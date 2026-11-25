import { useState } from "react";
import { useI18n } from "../i18n";
import { clamp } from "../lib/color";

type Props = {
  hue: number;
  saturation: number;
  value: number;
  onChange: (saturation: number, value: number) => void;
};

export function SvSquare({ hue, saturation, value, onChange }: Props) {
  const { t } = useI18n();
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    onChange(Math.round(x * 100), Math.round((1 - y) * 100));
  };

  return (
    <div className="sv-square-wrap">
      <div className="sv-square__title">{t("sv.title")}</div>
      <div
        className="sv-square"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hue}, 100%, 50%)`,
        }}
        role="slider"
        aria-label={t("sv.aria")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(saturation)}
        tabIndex={0}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 10 : 1;
          if (!event.key.startsWith("Arrow")) return;
          event.preventDefault();
          if (event.key === "ArrowLeft") onChange(clamp(saturation - step, 0, 100), value);
          if (event.key === "ArrowRight") onChange(clamp(saturation + step, 0, 100), value);
          if (event.key === "ArrowUp") onChange(saturation, clamp(value + step, 0, 100));
          if (event.key === "ArrowDown") onChange(saturation, clamp(value - step, 0, 100));
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
      >
        <span
          className="sv-square__handle"
          style={{ left: `${saturation}%`, top: `${100 - value}%` }}
        />
      </div>
      <div className="sv-square__hint">
        <span>S {Math.round(saturation)}%</span>
        <span>V {Math.round(value)}%</span>
      </div>
    </div>
  );
}
