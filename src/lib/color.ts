export type Hsl = { h: number; s: number; l: number };
export type Hsv = { h: number; s: number; v: number };
export type Rgb = { r: number; g: number; b: number };

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

const round = (value: number) => Math.round(value);

export function hexToRgb(input: string): Rgb | null {
  const value = input.trim().replace(/^#/, "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return null;

  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const part = (channel: number) =>
    clamp(round(channel), 0, 255).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h *= 60;
  }

  return { h: normalizeHue(h), s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hue = normalizeHue(h) / 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;

  if (sat === 0) {
    const value = round(light * 255);
    return { r: value, g: value, b: value };
  }

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;
  const channel = (t: number) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };

  return {
    r: round(channel(hue + 1 / 3) * 255),
    g: round(channel(hue) * 255),
    b: round(channel(hue - 1 / 3) * 255),
  };
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h *= 60;
  }

  return {
    h: normalizeHue(h),
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const hue = normalizeHue(h) / 60;
  const sat = clamp(s, 0, 100) / 100;
  const val = clamp(v, 0, 100) / 100;
  const i = Math.floor(hue);
  const f = hue - i;
  const p = val * (1 - sat);
  const q = val * (1 - f * sat);
  const t = val * (1 - (1 - f) * sat);

  const cases: Array<[number, number, number]> = [
    [val, t, p],
    [q, val, p],
    [p, val, t],
    [p, q, val],
    [t, p, val],
    [val, p, q],
  ];
  const [r, g, b] = cases[i % 6];
  return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
}

export const hsvToHsl = (hsv: Hsv): Hsl => rgbToHsl(hsvToRgb(hsv));
export const hslToHsv = (hsl: Hsl): Hsv => rgbToHsv(hslToRgb(hsl));

export const hexToHsl = (hex: string): Hsl | null => {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb) : null;
};
export const hslToHex = (hsl: Hsl): string => rgbToHex(hslToRgb(hsl));

export const formatRgb = (rgb: Rgb) => `${rgb.r}, ${rgb.g}, ${rgb.b}`;
export const formatHsl = (hsl: Hsl) =>
  `${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`;

function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const rgbA = hexToRgb(a);
  const rgbB = hexToRgb(b);
  if (!rgbA || !rgbB) return 1;
  const l1 = relativeLuminance(rgbA);
  const l2 = relativeLuminance(rgbB);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Возвращает более контрастный из двух цветов текста для заданного фона. */
export function readableTextColor(background: string): string {
  return contrastRatio(background, "#FFFFFF") >= contrastRatio(background, "#101423")
    ? "#FFFFFF"
    : "#101423";
}

export function randomHsl(): Hsl {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(55 + Math.random() * 35),
    l: Math.floor(46 + Math.random() * 24),
  };
}
