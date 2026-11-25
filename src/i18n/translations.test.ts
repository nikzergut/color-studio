import { describe, expect, it } from "vitest";
import { dictionaries, en, ru, translate } from "./translations";

describe("dictionaries", () => {
  it("has the same keys in both languages", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(ru).sort());
  });

  it("contains no empty translations", () => {
    for (const dictionary of Object.values(dictionaries)) {
      for (const [key, value] of Object.entries(dictionary)) {
        expect(value.trim().length, key).toBeGreaterThan(0);
      }
    }
  });
});

describe("translate", () => {
  it("substitutes parameters", () => {
    expect(translate("ru", "toast.copied", { hex: "#FFF" })).toBe("#FFF скопирован");
    expect(translate("en", "toast.copied", { hex: "#FFF" })).toBe("#FFF copied");
    expect(translate("en", "footer.hint", { key: "R" })).toBe(
      "Tip: press R for a random palette",
    );
  });

  it("leaves unknown placeholders untouched", () => {
    expect(translate("en", "toast.copied", { other: "x" })).toBe("{hex} copied");
  });
});
