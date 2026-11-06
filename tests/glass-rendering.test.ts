import { describe, expect, it } from "vitest";
import { coffeeIconSvg, coffeeIconSvgFromSpec, type IconSpec } from "../src/icons";
import { renderRecipes } from "../src/sections/recipes";

/** Inspect the real Lit output, including nested SVG templates and arrays. */
function markup(value: unknown): string {
  if (value == null || typeof value === "symbol" || typeof value === "boolean") return "";
  if (Array.isArray(value)) return value.map(markup).join("");
  if (typeof value === "object") {
    const template = value as { strings?: readonly string[]; values?: unknown[] };
    return template.strings?.map((part, i) => part + markup(template.values?.[i])).join("") ?? "";
  }
  return String(value);
}

const drink: IconSpec = {
  spec_version: 1, glass: "cup", total_ml: 160, fill_level: 160 / 220,
  layers: [
    { role: "coffee", ml: 40, fraction: .25, intensity: .7 },
    { role: "milk", ml: 80, fraction: .5, intensity: 0 },
  ],
  foam: { role: "milk_foam", ml: 40, fraction: .25 }, steam: true,
};

function vapour(svg: string): string[] {
  return [...svg.matchAll(/<g\s+class="mbc-coffee-vapour"[^>]*style="([^"]+)"[^>]*>\s*<path\s+d="([^"]+)"/g)]
    .map(match => `${match[1]} ${match[2]}`);
}

function layerSpans(svg: string): { role: string; top: number; bottom: number }[] {
  return [...svg.matchAll(/<path\s+class="mbc-coffee-layer"\s+data-role="([^"]+)"\s+d="M[^ ]+ ([^H]+)H[^V]+V([^H]+)H[^Z]+Z"/g)]
    .map(match => ({ role: match[1], top: Number(match[2]), bottom: Number(match[3]) }));
}

describe("transparent glass rendering", () => {
  it.each(["cup", "tall_glass"])("does not draw a chord across the %s opening", glass => {
    const svg = markup(coffeeIconSvgFromSpec({ ...drink, glass }, 48, "cup"));
    const stroke = /<path\s+class="mbc-coffee-outline"\s+d="([^"]+)"/.exec(svg);
    expect(stroke).not.toBeNull();
    expect(stroke![1]).not.toMatch(/Z\s*$/i);
    const mask = /<clipPath[^>]+>\s*<path d="([^"]+)"/.exec(svg);
    expect(mask?.[1]).toMatch(/Z\s*$/i);
  });

  it("paints the supplied coffee, milk and foam in contiguous proportions", () => {
    const layers = layerSpans(markup(coffeeIconSvgFromSpec(drink, 48, "layers")));
    expect(layers.map(layer => layer.role)).toEqual(["coffee", "milk", "milk_foam"]);
    expect(layers[0].bottom).toBeCloseTo(74.5);
    expect(layers[0].bottom - layers[0].top).toBeCloseTo(8.7272727273);
    expect(layers[1].bottom - layers[1].top).toBeCloseTo(17.4545454545);
    expect(layers[2].bottom - layers[2].top).toBeCloseTo(8.7272727273);
    expect(layers[1].bottom).toBeCloseTo(layers[0].top);
    expect(layers[2].bottom).toBeCloseTo(layers[1].top);
  });

  it("repaints a changed composition instead of retaining the stock drink picture", () => {
    const changed: IconSpec = {
      ...drink, total_ml: 120, fill_level: 120 / 220,
      layers: [
        { role: "milk", ml: 40, fraction: 1 / 3, intensity: 0 },
        { role: "coffee", ml: 40, fraction: 1 / 3, intensity: .7 },
      ], foam: { role: "milk_foam", ml: 40, fraction: 1 / 3 },
    };
    const layers = layerSpans(markup(coffeeIconSvgFromSpec(changed, 48, "layers")));
    expect(layers.map(layer => layer.role)).toEqual(["milk", "coffee", "milk_foam"]);
    expect(layers[0].bottom - layers[0].top).toBeCloseTo(8.7272727273);
    expect(layers[2].top).toBeCloseTo(48.3181818182);
  });

  it("keeps every generated reference local even for names containing SVG punctuation", () => {
    const svg = markup(coffeeIconSvgFromSpec(drink, 48, 'Мой кофе / a");#<x>'));
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    const references = [...svg.matchAll(/url\(#([^)]*)\)/g)].map(match => match[1]);
    expect(ids.length).toBeGreaterThan(3);
    expect(ids.every(id => /^[A-Za-z][\w-]*$/.test(id))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(references.every(id => ids.includes(id))).toBe(true);
  });

  it("does not merge distinct localized recipes into the same SVG definitions", () => {
    const svg = markup(renderRecipes({
      options: ["Молоко", "Пена", "Кофе"], selected: "Кофе", dkActive: false, hasDk: false,
      onSelect: () => undefined, onBrew: () => undefined,
    }));
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    expect(ids.length).toBeGreaterThan(3);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("exposes recipe selection as native buttons for keyboard users", () => {
    const svg = markup(renderRecipes({
      options: ["Espresso", "Cappuccino"], selected: "Espresso", dkActive: false, hasDk: false,
      onSelect: () => undefined, onBrew: () => undefined,
    }));
    expect([...svg.matchAll(/<button\s+type="button"\s+class="recipe-card"/g)]).toHaveLength(2);
  });
});

describe("independent cup steam", () => {
  it("gives separate cups different curls, speed and phase", () => {
    const a = vapour(markup(coffeeIconSvgFromSpec(drink, 48, "recipe-a")));
    const b = vapour(markup(coffeeIconSvgFromSpec(drink, 48, "recipe-b")));
    expect(a.length).toBeGreaterThanOrEqual(2);
    expect(b.length).toBeGreaterThanOrEqual(2);
    expect(a).not.toEqual(b);
    expect(new Set(a).size).toBe(a.length);
  });

  it("keeps one cup's animation parameters stable across updates and display sizes", () => {
    const a = vapour(markup(coffeeIconSvgFromSpec(drink, 48, "same-cup")));
    const b = vapour(markup(coffeeIconSvgFromSpec({ ...drink, fill_level: .5 }, 96, "same-cup")));
    expect(a.length).toBeGreaterThanOrEqual(2);
    expect(a).toEqual(b);
  });

  it("never adds steam to a spec explicitly marked cold", () => {
    expect(vapour(markup(coffeeIconSvgFromSpec({ ...drink, steam: false }, 48, "cold")))).toEqual([]);
  });

  it("applies the material and varied steam to legacy recipe rendering too", () => {
    const svg = markup(coffeeIconSvg("Cappuccino", 48, "legacy"));
    expect(layerSpans(svg).length).toBeGreaterThan(1);
    expect(vapour(svg).length).toBeGreaterThanOrEqual(2);
  });
});
