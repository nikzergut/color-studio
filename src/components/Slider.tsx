type Props = {
  label: string;
  value: number;
  max: number;
  display: string;
  gradient: string;
  onChange: (value: number) => void;
};

export function Slider({ label, value, max, display, gradient, onChange }: Props) {
  return (
    <label className="slider">
      <span className="slider__top">
        <span className="slider__label">{label}</span>
        <span className="slider__value">{display}</span>
      </span>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={Math.round(value)}
        style={{ background: gradient }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
