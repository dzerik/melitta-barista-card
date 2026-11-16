import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultRecipe, type RecipeComponents } from "../src/recipe";
import { setLanguage } from "../src/localize/localize";
import { freestylePreviewSpec } from "../src/freestyle-preview";

vi.hoisted(() => { Object.assign(globalThis, { window: { customCards: [] } }); });
import { MelittaBaristaCard } from "../src/melitta-barista-card";

afterEach(() => setLanguage());

function markup(value: unknown): string {
  if (value == null || typeof value === "symbol" || typeof value === "boolean" || typeof value === "function") return "";
  if (Array.isArray(value)) return value.map(markup).join("");
  if (typeof value === "object") {
    const t = value as { strings?: readonly string[]; values?: unknown[] };
    return t.strings?.map((part, i) => part + markup(t.values?.[i])).join("") ?? "";
  }
  return String(value);
}

function card(recipe = defaultRecipe()) {
  const c = new MelittaBaristaCard() as unknown as {
    _fsRecipe: RecipeComponents;
    _fsName: string;
    _updateFs(comp: "c1" | "c2", patch: Partial<RecipeComponents["c1"]>): void;
    _renderFreestyle(): unknown;
  };
  c._fsRecipe = recipe;
  return c;
}

const roles = (html: string) => [...html.matchAll(/class="mbc-coffee-layer"\s+data-role="([^"]+)"/g)].map(m => m[1]);
const volume = (html: string) => /<output\s+class="freestyle-volume"[^>]*>([\s\S]*?)<\/output>/.exec(html)?.[1].trim();

describe("Freestyle live drink preview", () => {
  it("shows the draft volume without counting an inactive component's retained portion", () => {
    const recipe = defaultRecipe();
    recipe.c2.portion_ml = 250;
    const html = markup(card(recipe)._renderFreestyle());
    expect(volume(html)).toBe("40 ml");
    expect(roles(html)).toEqual(["coffee", "crema"]);
  });

  it("redraws the fill and volume when the existing portion control updates the draft", () => {
    const recipe = defaultRecipe();
    recipe.c1.portion_ml = 80;
    const c = card(recipe);
    const before = markup(c._renderFreestyle());
    c._updateFs("c1", { portion_ml: 120 });
    const after = markup(c._renderFreestyle());
    expect(volume(after)).toBe("120 ml");
    const band = /class="mbc-coffee-layer"\s+data-role="coffee"\s+d="([^"]+)"/;
    expect(after.match(band)?.[1]).toBeDefined();
    expect(after.match(band)?.[1]).not.toBe(before.match(band)?.[1]);
  });

  it("keeps warm milk without foam even at high temperature", () => {
    const recipe = defaultRecipe();
    recipe.c2 = { ...recipe.c2, process: "milk", portion_ml: 160, milk_mode: "warm_milk", temperature: "high" };
    const html = markup(card(recipe)._renderFreestyle());
    expect(volume(html)).toBe("200 ml");
    expect(roles(html)).toEqual(["coffee", "milk"]);
  });

  it("adds a foam cap when milk mode changes without overwriting the stored shots", () => {
    const recipe = defaultRecipe();
    recipe.c2 = { ...recipe.c2, process: "milk", portion_ml: 160, milk_mode: "warm_milk", shots: "three" };
    const c = card(recipe);
    c._updateFs("c2", { milk_mode: "milk_froth" });
    const html = markup(c._renderFreestyle());
    expect(volume(html)).toBe("200 ml");
    expect(roles(html)).toEqual(["coffee", "milk", "milk_foam"]);
    expect(c._fsRecipe.c2.shots).toBe("three");
  });

  it("stacks milk before coffee when that is the selected dispense order", () => {
    const recipe = defaultRecipe();
    recipe.c2 = { ...recipe.c1 };
    recipe.c1 = { ...recipe.c1, process: "milk", portion_ml: 160, milk_mode: "milk_froth" };
    const html = markup(card(recipe)._renderFreestyle());
    expect(roles(html)).toEqual(["milk", "coffee", "milk_foam"]);
    expect(volume(html)).toBe("200 ml");
  });

  it("shows an empty glass instead of stock coffee when all portions are zero", () => {
    const recipe = defaultRecipe();
    recipe.c1.portion_ml = 0;
    const html = markup(card(recipe)._renderFreestyle());
    expect(volume(html)).toBe("0 ml");
    expect(html).toContain('class="mbc-coffee-outline"');
    expect(roles(html)).toEqual([]);
    expect(html).not.toContain('class="mbc-coffee-vapour"');
  });

  it("removes steam for cold coffee and never shows it for pure milk or water", () => {
    const c = card();
    expect(markup(c._renderFreestyle())).toContain('class="mbc-coffee-vapour"');
    c._updateFs("c1", { temperature: "cold" });
    expect(markup(c._renderFreestyle())).not.toContain('class="mbc-coffee-vapour"');
    for (const process of ["milk", "water"] as const) {
      c._updateFs("c1", { process, temperature: "high", portion_ml: 120 });
      expect(markup(c._renderFreestyle())).not.toContain('class="mbc-coffee-vapour"');
    }
  });

  it("localizes the preview volume", () => {
    setLanguage({ locale: { language: "ru" } } as never);
    expect(volume(markup(card()._renderFreestyle()))).toBe("40 мл");
  });

  it("renders a tiny froth portion as foam instead of the stock coffee fallback", () => {
    const recipe = defaultRecipe();
    recipe.c1 = { ...recipe.c1, process: "milk", portion_ml: 10, milk_mode: "milk_froth" };
    const html = markup(card(recipe)._renderFreestyle());
    expect(volume(html)).toBe("10 ml");
    expect(roles(html)).toEqual(["milk_foam"]);
  });

  it("uses the server's symbolic foam rounding at half steps", () => {
    const recipe = defaultRecipe();
    recipe.c1 = { ...recipe.c1, process: "milk", portion_ml: 125, milk_mode: "milk_froth" };
    const spec = freestylePreviewSpec(recipe)!;
    expect(spec.total_ml).toBe(125);
    expect(spec.foam).toEqual({ role: "milk_foam", ml: 60, fraction: .48 });
    expect(spec.layers).toEqual([{ role: "milk", ml: 65, fraction: .52, intensity: 0 }]);
  });

  it("includes aroma and extra shots in coffee shading with half-up rounding", () => {
    const recipe = defaultRecipe();
    recipe.c1 = { ...recipe.c1, intensity: "strong", shots: "two", aroma: "intense" };
    expect(freestylePreviewSpec(recipe)!.layers[0].intensity).toBe(.83);
    recipe.c1.aroma = "standard";
    expect(freestylePreviewSpec(recipe)!.layers[0].intensity).toBe(.78);
  });
});
