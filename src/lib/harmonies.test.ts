import { describe, expect, it } from "vitest";
import { normalizeHue, type Hsl } from "./color";
import {
  generatePalette,
  HARMONIES,
  harmonyLabelKey,
  type HarmonyId,
} from "./harmonies";

const base: Hsl = { h: 210, s: 75, l: 55 };

describe("HARMONIES", () => {
  it("has seven unique schemes and unique translation keys", () => {
    expect(HARMONIES).toHaveLength(7);
    expect(new Set(HARMONIES.map((item) => item.id)).size).toBe(7);
    expect(new Set(HARMONIES.map((item) => item.labelKey)).size).toBe(7);
    expect(new Set(HARMONIES.map((item) => item.hintKey)).size).toBe(7);
    expect(new Set(HARMONIES.map((item) => item.descKey)).size).toBe(7);
  });

  it("resolves the label for every scheme", () => {
    for (const { id, labelKey } of HARMONIES) {
      expect(harmonyLabelKey(id)).toBe(labelKey);
    }
  });
});

describe("generatePalette", () => {
  const ids = HARMONIES.map((item) => item.id as HarmonyId);

  it.each(ids)("returns five deterministic colors for %s", (id) => {
    const first = generatePalette(base, id);
    const second = generatePalette(base, id);
    expect(first).toHaveLength(5);
    expect(first).toEqual(second);
    for (const color of first) {
      expect(normalizeHue(color.h)).toBeCloseTo(color.h);
      expect(color.s).toBeGreaterThanOrEqual(0);
      expect(color.s).toBeLessThanOrEqual(100);
      expect(color.l).toBeGreaterThanOrEqual(8);
      expect(color.l).toBeLessThanOrEqual(96);
    }
  });

  it("keeps the base color in the palette", () => {
    for (const id of ids) {
      expect(generatePalette(base, id).some((color) => color.h === base.h)).toBe(true);
    }
  });

  it("places the opposite hue in complementary palettes", () => {
    const palette = generatePalette(base, "complementary");
    expect(palette[2].h).toBe(normalizeHue(base.h + 180));
  });

  it("rotates square palettes by 90 degrees", () => {
    const palette = generatePalette(base, "square");
    expect(palette.slice(0, 4).map((color) => color.h)).toEqual([210, 300, 30, 120]);
  });

  it("uses five lightness steps for monochrome", () => {
    const palette = generatePalette(base, "monochromatic");
    expect(new Set(palette.map((color) => color.h)).size).toBe(1);
    expect(palette[2].l).toBe(base.l);
    expect(palette[0].l).toBeGreaterThan(palette[4].l);
  });
});
