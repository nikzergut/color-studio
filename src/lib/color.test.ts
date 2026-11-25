import { describe, expect, it } from "vitest";
import {
  contrastRatio,
  hexToHsl,
  hexToRgb,
  hslToHex,
  hslToHsv,
  hsvToHsl,
  normalizeHue,
  randomHsl,
  readableTextColor,
  rgbToHex,
  type Rgb,
} from "./color";

const samples = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFFFF",
  "#000000",
  "#123456",
  "#ABCDEF",
  "#0D1018",
];

function expectRgbClose(actual: Rgb, expected: Rgb) {
  expect(Math.abs(actual.r - expected.r)).toBeLessThanOrEqual(1);
  expect(Math.abs(actual.g - expected.g)).toBeLessThanOrEqual(1);
  expect(Math.abs(actual.b - expected.b)).toBeLessThanOrEqual(1);
}

describe("HEX", () => {
  it("parses long and short forms", () => {
    expect(hexToRgb("#ABCDEF")).toEqual({ r: 171, g: 205, b: 239 });
    expect(hexToRgb("abc")).toEqual({ r: 170, g: 187, b: 204 });
    expect(rgbToHex({ r: 170, g: 187, b: 204 })).toBe("#AABBCC");
  });

  it("rejects malformed values", () => {
    expect(hexToRgb("#12")).toBeNull();
    expect(hexToRgb("#GGHHII")).toBeNull();
    expect(hexToHsl("not-a-color")).toBeNull();
  });

  it.each(samples)("round-trips through HSL: %s", (hex) => {
    const hsl = hexToHsl(hex);
    expect(hsl).not.toBeNull();
    expectRgbClose(hexToRgb(hslToHex(hsl!))!, hexToRgb(hex)!);
  });
});

describe("normalizeHue", () => {
  it("wraps in both directions", () => {
    expect(normalizeHue(-10)).toBe(350);
    expect(normalizeHue(370)).toBe(10);
    expect(normalizeHue(360)).toBe(0);
    expect(normalizeHue(725)).toBe(5);
  });
});

describe("HSL / HSV", () => {
  it("round-trips through HSV", () => {
    for (const hsl of [
      { h: 12, s: 80, l: 55 },
      { h: 190, s: 40, l: 30 },
      { h: 300, s: 100, l: 75 },
      { h: 0, s: 0, l: 50 },
    ]) {
      const restored = hsvToHsl(hslToHsv(hsl));
      expectRgbClose(
        hexToRgb(hslToHex(restored))!,
        hexToRgb(hslToHex(hsl))!,
      );
    }
  });

  it("generates colors in the intended ranges", () => {
    for (let i = 0; i < 100; i += 1) {
      const color = randomHsl();
      expect(color.h).toBeGreaterThanOrEqual(0);
      expect(color.h).toBeLessThan(360);
      expect(color.s).toBeGreaterThanOrEqual(55);
      expect(color.s).toBeLessThan(90);
      expect(color.l).toBeGreaterThanOrEqual(46);
      expect(color.l).toBeLessThan(70);
    }
  });
});

describe("contrast", () => {
  it("computes the black/white ratio", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 1);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBe(1);
  });

  it("picks the more readable text color", () => {
    expect(readableTextColor("#000000")).toBe("#FFFFFF");
    expect(readableTextColor("#FFFFFF")).toBe("#101423");
    expect(readableTextColor("#FF5D6C")).toBe("#101423");
  });
});
