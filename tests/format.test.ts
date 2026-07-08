import { describe, it, expect } from "vitest";
import { displayName, DISPLAY, LEVEL_LABELS } from "../src/format";

describe("displayName", () => {
  it("uses the DISPLAY map for known values", () => {
    expect(displayName("very_mild")).toBe("V.Mild");
    expect(displayName("one")).toBe("1");
    expect(displayName("standard")).toBe("Std");
  });

  it("capitalizes and de-underscores unknown values", () => {
    expect(displayName("extra_shot")).toBe("Extra shot");
    expect(displayName("foo")).toBe("Foo");
  });
});

describe("LEVEL_LABELS", () => {
  it("covers water hardness 1-4 and brew temperature 0-2", () => {
    expect(Object.keys(LEVEL_LABELS.water_hardness)).toHaveLength(4);
    expect(Object.keys(LEVEL_LABELS.brew_temperature)).toHaveLength(3);
  });
});

describe("DISPLAY", () => {
  it("has short labels for every intensity", () => {
    for (const k of ["very_mild", "mild", "medium", "strong", "very_strong"]) {
      expect(DISPLAY[k]).toBeTruthy();
    }
  });
});
