import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { hslToHex, normalizeHue } from "../lib/color";

const SIZE = 320;
const RADIUS = 126;

type Props = {
  hue: number;
  color: string;
  onChange: (hue: number) => void;
};

export function ColorWheel({ hue, color, onChange }: Props) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = SIZE * ratio;
      canvas.height = SIZE * ratio;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 44;
      ctx.lineCap = "butt";

      for (let degree = 0; degree < 360; degree += 1) {
        const start = ((degree - 90) * Math.PI) / 180;
        const end = ((degree + 1 - 90) * Math.PI) / 180 + 0.01;
        ctx.strokeStyle = `hsl(${degree}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, RADIUS, start, end);
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      for (const radius of [RADIUS - 22, RADIUS + 22]) {
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  const updateFromPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const degrees = normalizeHue((Math.atan2(y, x) * 180) / Math.PI + 90);
    onChange(Math.round(degrees));
  };

  const angle = ((hue - 90) * Math.PI) / 180;
  const offset = (RADIUS / SIZE) * 100;
  const handleX = 50 + offset * Math.cos(angle);
  const handleY = 50 + offset * Math.sin(angle);

  return (
    <div className="wheel">
      <canvas
        ref={canvasRef}
        className="wheel__canvas"
        aria-label={t("wheel.aria")}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={Math.round(hue)}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            onChange(normalizeHue(hue - 1));
          }
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            onChange(normalizeHue(hue + 1));
          }
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          updateFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (dragging) updateFromPointer(event);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      />
      <span
        className="wheel__handle"
        style={{ left: `${handleX}%`, top: `${handleY}%`, background: hslToHex({ h: hue, s: 100, l: 50 }) }}
      />
      <div className="wheel__center" style={{ background: color }}>
        <span>{t("wheel.selected")}</span>
        <strong>{color}</strong>
      </div>
    </div>
  );
}
