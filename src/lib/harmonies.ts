import { clamp, normalizeHue, type Hsl } from "./color";
import type { TranslationKey } from "../i18n/translations";

export type HarmonyId =
  | "complementary"
  | "split"
  | "analogous"
  | "triadic"
  | "tetradic"
  | "square"
  | "monochromatic";

export type Harmony = {
  id: HarmonyId;
  labelKey: TranslationKey;
  hintKey: TranslationKey;
  descKey: TranslationKey;
};

/** Порядок пунктов в переключателе схем и ключи локализованных подписей. */
export const HARMONIES: Harmony[] = [
  {
    id: "complementary",
    labelKey: "harmony.complementary.label",
    hintKey: "harmony.complementary.hint",
    descKey: "harmony.complementary.desc",
  },
  {
    id: "split",
    labelKey: "harmony.split.label",
    hintKey: "harmony.split.hint",
    descKey: "harmony.split.desc",
  },
  {
    id: "analogous",
    labelKey: "harmony.analogous.label",
    hintKey: "harmony.analogous.hint",
    descKey: "harmony.analogous.desc",
  },
  {
    id: "triadic",
    labelKey: "harmony.triadic.label",
    hintKey: "harmony.triadic.hint",
    descKey: "harmony.triadic.desc",
  },
  {
    id: "tetradic",
    labelKey: "harmony.tetradic.label",
    hintKey: "harmony.tetradic.hint",
    descKey: "harmony.tetradic.desc",
  },
  {
    id: "square",
    labelKey: "harmony.square.label",
    hintKey: "harmony.square.hint",
    descKey: "harmony.square.desc",
  },
  {
    id: "monochromatic",
    labelKey: "harmony.monochromatic.label",
    hintKey: "harmony.monochromatic.hint",
    descKey: "harmony.monochromatic.desc",
  },
];

const rotate = (base: Hsl, degrees: number): Hsl => ({
  ...base,
  h: normalizeHue(base.h + degrees),
});

const lighten = (color: Hsl, amount: number): Hsl => ({
  ...color,
  l: clamp(color.l + amount, 8, 94),
});

const desaturate = (color: Hsl, amount: number): Hsl => ({
  ...color,
  s: clamp(color.s - amount, 0, 100),
});

/** Пять ступеней светлоты; базовый цвет стоит в центре. */
function monoSteps(base: Hsl): Hsl[] {
  const up = 96 - base.l;
  const down = base.l - 8;
  return [
    base.l + up * 0.8,
    base.l + up * 0.4,
    base.l,
    base.l - down * 0.4,
    base.l - down * 0.8,
  ].map((l) => ({ ...base, l: Math.round(l) }));
}

export function generatePalette(base: Hsl, harmony: HarmonyId): Hsl[] {
  switch (harmony) {
    case "complementary": {
      const opposite = rotate(base, 180);
      return [
        base,
        lighten(base, 16),
        opposite,
        desaturate(lighten(opposite, 16), 12),
        desaturate(base, 32),
      ];
    }
    case "split": {
      const left = rotate(base, 150);
      const right = rotate(base, 210);
      return [base, left, right, lighten(left, 16), desaturate(lighten(right, 10), 14)];
    }
    case "analogous": {
      return [
        desaturate(rotate(base, -40), 10),
        rotate(base, -20),
        base,
        rotate(base, 20),
        desaturate(rotate(base, 40), 10),
      ];
    }
    case "triadic": {
      const second = rotate(base, 120);
      const third = rotate(base, 240);
      return [base, second, third, lighten(second, 16), desaturate(lighten(third, 12), 12)];
    }
    case "tetradic": {
      return [base, rotate(base, 60), rotate(base, 180), rotate(base, 240), lighten(base, 18)];
    }
    case "square": {
      return [base, rotate(base, 90), rotate(base, 180), rotate(base, 270), desaturate(base, 30)];
    }
    case "monochromatic":
      return monoSteps(base);
  }
}

export const harmonyLabelKey = (id: HarmonyId): TranslationKey =>
  HARMONIES.find((harmony) => harmony.id === id)?.labelKey ?? "harmony.complementary.label";
