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
});
