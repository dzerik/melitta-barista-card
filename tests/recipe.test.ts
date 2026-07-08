import { describe, it, expect } from "vitest";
import {
  defaultRecipe,
  fromDkRecipe,
  toServicePayload,
  SHOTS_TO_STRING,
} from "../src/recipe";
import type { DirectKeyRecipe } from "../src/types";

const dkRecipe: DirectKeyRecipe = {
  category: 1,
  c1_process: "coffee",
  c1_intensity: "strong",
  c1_aroma: "intense",
  c1_temperature: "high",
  c1_shots: 2,
  c1_portion_ml: 60,
  c2_process: "milk",
  c2_intensity: "medium",
  c2_aroma: "standard",
  c2_temperature: "normal",
  c2_shots: 0,
  c2_portion_ml: 120,
};

describe("toServicePayload", () => {
  it("emits the exact melitta_barista service contract keys", () => {
    const payload = toServicePayload(defaultRecipe());
    expect(Object.keys(payload).sort()).toEqual([
      "aroma1", "aroma2",
      "intensity1", "intensity2",
      "portion1_ml", "portion2_ml",
      "process1", "process2",
      "shots1", "shots2",
      "temperature1", "temperature2",
    ]);
  });

  it("maps defaults to the historical values", () => {
    expect(toServicePayload(defaultRecipe())).toEqual({
      process1: "coffee", intensity1: "medium", aroma1: "standard",
      portion1_ml: 40, temperature1: "normal", shots1: "one",
      process2: "none", intensity2: "medium", aroma2: "standard",
      portion2_ml: 0, temperature2: "normal", shots2: "none",
    });
  });
});

describe("fromDkRecipe -> toServicePayload round-trip", () => {
  it("preserves every field of a fully populated recipe", () => {
    expect(toServicePayload(fromDkRecipe(dkRecipe))).toEqual({
      process1: "coffee", intensity1: "strong", aroma1: "intense",
      portion1_ml: 60, temperature1: "high", shots1: "two",
      process2: "milk", intensity2: "medium", aroma2: "standard",
      portion2_ml: 120, temperature2: "normal", shots2: "none",
    });
  });

  it("falls back to defaults for missing fields", () => {
    const rc = fromDkRecipe({ category: 0 } as DirectKeyRecipe);
    expect(rc.c1).toEqual({
      process: "coffee", intensity: "medium", aroma: "standard",
      temperature: "normal", shots: "one", portion_ml: 40,
    });
    expect(rc.c2).toEqual({
      process: "none", intensity: "medium", aroma: "standard",
      temperature: "normal", shots: "none", portion_ml: 0,
    });
  });
});

describe("SHOTS_TO_STRING", () => {
  it("covers 0-3", () => {
    expect(SHOTS_TO_STRING[0]).toBe("none");
    expect(SHOTS_TO_STRING[1]).toBe("one");
    expect(SHOTS_TO_STRING[2]).toBe("two");
    expect(SHOTS_TO_STRING[3]).toBe("three");
  });
});
