import { describe, it, expect } from "vitest";
import { displayName, INTENSITY_DOTS } from "../src/format";

describe("displayName", () => {
  it("uses the translation map for known values (en default)", () => {
    expect(displayName("very_mild")).toBe("V.Mild");
    expect(displayName("one")).toBe("1");
    expect(displayName("standard")).toBe("Std");
  });

  it("capitalizes and de-underscores unknown values", () => {
    expect(displayName("extra_shot")).toBe("Extra shot");
    expect(displayName("foo")).toBe("Foo");
  });
});

describe("INTENSITY_DOTS", () => {
  it("maps all five intensities to 1-5 dots", () => {
    expect(INTENSITY_DOTS.very_mild).toBe(1);
    expect(INTENSITY_DOTS.very_strong).toBe(5);
    expect(Object.keys(INTENSITY_DOTS)).toHaveLength(5);
  });
});
