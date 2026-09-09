import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { normalizeScale, MIN_SCALE, MAX_SCALE } from "../src/utils";
import { cardStyles } from "../src/styles";
import { coffeeIconSvg } from "../src/icons";

describe("normalizeScale", () => {
  it("keeps a usable number", () => {
    expect(normalizeScale(1.25)).toBe(1.25);
    expect(normalizeScale(MIN_SCALE)).toBe(MIN_SCALE);
    expect(normalizeScale(MAX_SCALE)).toBe(MAX_SCALE);
  });

  it("accepts the string YAML and the editor slider hand over", () => {
    expect(normalizeScale("1.5")).toBe(1.5);
  });

  it("clamps out-of-range values instead of rendering an unusable card", () => {
    expect(normalizeScale(0.1)).toBe(MIN_SCALE);
    expect(normalizeScale(125)).toBe(MAX_SCALE); // percentage typo
  });

  it("falls back to 1 for anything unusable", () => {
    for (const raw of [undefined, null, "", "big", NaN, Infinity, {}, []]) {
      expect(normalizeScale(raw)).toBe(1);
    }
  });
});

describe("scale plumbing in the stylesheet", () => {
  const css = cardStyles.cssText;

  it("drives the body font-size, resolving to 1em at the default scale", () => {
    expect(css).toContain("font-size: calc(var(--mbc-scale, 1) * 1em)");
  });

  it("leaves no icon size outside the scale", () => {
    const srcDir = join(__dirname, "../src");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".ts")) files.push(full);
      }
    };
    walk(srcDir);

    const unscaled = files.flatMap((f) =>
      (readFileSync(f, "utf8").match(/--mdc-icon-size:\s*\d+px/g) ?? []).map(
        (hit) => `${f}: ${hit}`,
      ),
    );
    expect(unscaled).toEqual([]);
  });
});

describe("drink icons", () => {
  it("carry a scale-aware width so they grow with the text", () => {
    const res = coffeeIconSvg("Espresso", 48, "u1") as { strings?: readonly string[] };
    expect(res.strings?.join("")).toContain("calc(var(--mbc-scale, 1) *");
  });
});
