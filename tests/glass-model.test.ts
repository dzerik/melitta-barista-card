import { describe, expect, it } from "vitest";
import { buildGlassModel, normalizeCupStyle } from "../src/glass-model";
import { legacyIconSpec, type IconSpec } from "../src/icons";

const americano: IconSpec = {
  spec_version: 1, glass: "tall_glass", total_ml: 320, fill_level: 1,
  layers: [
    { role: "coffee", ml: 20, fraction: .06, intensity: .7 },
    { role: "water", ml: 300, fraction: .94, intensity: 0 },
  ], foam: null, steam: true,
};

describe("volumetric drink model", () => {
  it("keeps milk and milk foam in the fallback for older integrations", () => {
    const model=buildGlassModel(legacyIconSpec("Cappuccino"))!;
    expect(model.layers.map(l=>l.role)).toEqual(["milk","coffee","milk_foam"]);
    expect(buildGlassModel(legacyIconSpec("Espresso Macchiato"))!.layers.at(-1)?.role).toBe("milk_foam");
  });
  it("merges coffee and water into one diluted phase using their actual volumes", () => {
    const model = buildGlassModel(americano)!;
    expect(model.layers).toHaveLength(1);
    expect(model.layers[0].role).toBe("coffee");
    expect(model.layers[0].concentration).toBeCloseTo(.0625);
    expect(model.layers[0].fraction).toBe(1);
    expect(model.steam).toBe(true);
    expect(americano.layers).toHaveLength(2);
  });

  it("keeps milk and foam distinct and respects milk-first order", () => {
    const model = buildGlassModel({ ...americano, total_ml: 200, fill_level: .8,
      layers: [
        { role: "milk", ml: 100, fraction: .5, intensity: 0 },
        { role: "water", ml: 60, fraction: .3, intensity: 0 },
        { role: "coffee", ml: 20, fraction: .1, intensity: .6, crema: true },
      ], foam: { role: "milk_foam", ml: 20, fraction: .1 },
    })!;
    expect(model.layers.map(l => l.role)).toEqual(["milk", "coffee", "milk_foam"]);
    for (const [i, fraction] of [.4, .32, .08].entries()) {
      expect(model.layers[i].fraction).toBeCloseTo(fraction);
    }
    expect(model.layers[1].concentration).toBe(.25);
    expect(model.fill).toBeCloseTo(.8);
  });

  it("preserves server fill and keeps three distinct vessel shapes", () => {
    expect(buildGlassModel({ ...americano, glass: "espresso_cup", fill_level: .5 })?.glass).toBe("espresso_cup");
    expect(buildGlassModel({ ...americano, glass: "cup", fill_level: .5 })?.fill).toBe(.5);
    expect(buildGlassModel({ ...americano, glass: "future_glass" })?.glass).toBe("cup");
  });

  it("uses neutral unknown layers and only validated additive colors", () => {
    const model = buildGlassModel({ ...americano, layers: [
      { role: "future_ingredient", ml: 160, fraction: .5, intensity: .8, color_hint: "#ff0000" },
      { role: "additive", ml: 160, fraction: .5, intensity: .5, color_hint: "#AA8844" },
    ] })!;
    expect(model.layers[0].color).not.toBe("#ff0000");
    expect(model.layers[1].color).toBe("#AA8844");
    expect(buildGlassModel({ ...americano, layers: [
      { role: "additive", ml: 320, fraction: 1, intensity: .5, color_hint: 'url("https://bad")' },
    ] })?.layers[0].color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("supports foam-only and deliberately empty Freestyle without phantom coffee", () => {
    const foam = buildGlassModel({ ...americano, layers: [], foam: { role: "milk_foam", ml: 20, fraction: 1 } })!;
    expect(foam.layers.map(l => l.role)).toEqual(["milk_foam"]);
    const empty = buildGlassModel(null, true)!;
    expect(empty.layers).toEqual([]);
    expect(empty.fill).toBe(0);
    expect(empty.steam).toBe(false);
  });

  it("rejects unreadable specs for the existing generic fallback", () => {
    expect(buildGlassModel(null)).toBeNull();
    expect(buildGlassModel({ ...americano, spec_version: 999 })).toBeNull();
    expect(buildGlassModel({ ...americano, layers: [null as never] })).toBeNull();
  });

  it("keeps existing configurations classic and safely handles unknown style values", () => {
    expect(normalizeCupStyle(undefined)).toBe("classic");
    expect(normalizeCupStyle("glass")).toBe("glass");
    expect(normalizeCupStyle("future")).toBe("classic");
  });
});
