import { describe, it, expect } from "vitest";
import { parseDirectKeyData } from "../src/directkey";

const recipe = {
  category: 1,
  c1_process: "coffee", c1_intensity: "medium", c1_aroma: "standard",
  c1_temperature: "normal", c1_shots: 1, c1_portion_ml: 40,
  c2_process: "none", c2_intensity: "medium", c2_aroma: "standard",
  c2_temperature: "normal", c2_shots: 0, c2_portion_ml: 0,
};

describe("parseDirectKeyData", () => {
  it("returns null without attributes or directkey_recipes", () => {
    expect(parseDirectKeyData(undefined)).toBeNull();
    expect(parseDirectKeyData({})).toBeNull();
  });

  it("maps display names to category keys and keeps active profile", () => {
    const data = parseDirectKeyData({
      active_profile: 2,
      directkey_recipes: {
        2: { "Café Crème": recipe, "Hot Water": recipe, "Unknown Drink": recipe },
      },
    });
    expect(data).not.toBeNull();
    expect(data!.activeProfile).toBe(2);
    expect(Object.keys(data!.profiles[2]).sort()).toEqual(
      ["Unknown Drink", "cafe_creme", "water"].sort(),
    );
  });

  it("defaults active_profile to 0", () => {
    const data = parseDirectKeyData({ directkey_recipes: { 0: { Espresso: recipe } } });
    expect(data!.activeProfile).toBe(0);
    expect(data!.profiles[0].espresso).toEqual(recipe);
  });

  it("merges configured drinks by profile and category without mutating HA attributes", () => {
    const lungo = Object.freeze({ type: 2, name: "Lungo", name_key: "lungo" });
    const ristretto = { type: 1, name: "Ristretto", name_key: "ristretto" };
    const attributes = {
      active_profile: 1,
      directkey_recipes: {
        1: { Espresso: Object.freeze({ ...recipe, category: 0 }) },
        2: { Espresso: { ...recipe, category: 0 } },
      },
      directkey_drinks: { 1: { espresso: lungo }, 2: { espresso: ristretto } },
    };
    const before = JSON.stringify(attributes);
    const data = parseDirectKeyData(attributes)!;
    expect(data.profiles[1].espresso).toEqual({ ...recipe, category: 0, configured_recipe: lungo });
    expect(data.profiles[2].espresso).toEqual({ ...recipe, category: 0, configured_recipe: ristretto });
    expect(JSON.stringify(attributes)).toBe(before);
    expect(data.profiles[1].espresso).not.toBe(attributes.directkey_recipes[1].Espresso);
    expect(data.profiles[1].espresso.configured_recipe).not.toBe(lungo);
  });

  it.each([
    null, undefined, [], "Lungo", {},
    { type: 24, name: "Freestyle", name_key: "freestyle" },
    { type: 255, name: "Unknown", name_key: "unknown" },
    { type: true, name: "Lungo", name_key: "lungo" },
    { type: "2", name: "Lungo", name_key: "lungo" },
    { type: 2.5, name: "Lungo", name_key: "lungo" },
    { type: 2, name: " ", name_key: "lungo" },
    { type: 2, name: "Lungo", name_key: "" },
    { type: 2, name: "Lungo", name_key: "recipes.name.lungo" },
  ])("ignores invalid configured drink metadata: %j", (identity) => {
    const data = parseDirectKeyData({
      directkey_recipes: { 1: { Espresso: recipe } },
      directkey_drinks: { 1: { espresso: identity } },
    })!;
    expect(data.profiles[1].espresso).toEqual(recipe);
  });

  it.each([null, [], "bad", { 1: null }, { 1: [] }, { 2: { espresso: { type: 2, name: "Lungo", name_key: "lungo" } } }])(
    "ignores unavailable or unrelated metadata maps: %j", (directkey_drinks) => {
      expect(parseDirectKeyData({ directkey_recipes: { 1: { Espresso: recipe } }, directkey_drinks })!
        .profiles[1].espresso).toEqual(recipe);
    },
  );

  it("drops configured identity when the next entity update removes it", () => {
    const attributes = { directkey_recipes: { 1: { Espresso: recipe } } };
    const loaded = parseDirectKeyData({ ...attributes,
      directkey_drinks: { 1: { espresso: { type: 2, name: "Lungo", name_key: "lungo" } } },
    })!;
    expect(loaded.profiles[1].espresso.configured_recipe?.name).toBe("Lungo");
    expect(parseDirectKeyData(attributes)!.profiles[1].espresso).toEqual(recipe);
  });
});
