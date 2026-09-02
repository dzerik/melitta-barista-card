import { describe, it, expect } from "vitest";
import {
  computeIconGeometry,
  coffeeIconSvgFromSpec,
  coffeeIconSvg,
  type IconSpec,
} from "../src/icons";

// --- Fixtures: verbatim icon specs from UI_CONTRACT.md §3.7 / §3.8 ---

const ESPRESSO_SPEC: IconSpec = {
  spec_version: 1,
  glass: "espresso_cup",
  total_ml: 40,
  fill_level: 0.67,
  layers: [
    { role: "coffee", ml: 40, fraction: 1.0, intensity: 0.68, crema: true },
  ],
  foam: null,
  steam: true,
};

const LATTE_MACCHIATO_SPEC: IconSpec = {
  spec_version: 1,
  glass: "tall_glass",
  total_ml: 200,
  fill_level: 0.63,
  layers: [
    { role: "milk", ml: 130, fraction: 0.65, intensity: 0.0 },
    { role: "coffee", ml: 40, fraction: 0.2, intensity: 0.68 },
  ],
  foam: { role: "milk_foam", ml: 30, fraction: 0.15 },
  steam: true,
};

const CAPPUCCINO_SPEC: IconSpec = {
  spec_version: 1,
  glass: "cup",
  total_ml: 180,
  fill_level: 0.82,
  layers: [
    { role: "coffee", ml: 40, fraction: 0.22, intensity: 0.68 },
    { role: "milk", ml: 110, fraction: 0.61, intensity: 0.0 },
  ],
  foam: { role: "milk_foam", ml: 30, fraction: 0.17 },
  steam: true,
};

const HEX = /^#[0-9a-f]{6}$/i;

/** Approximate perceived lightness: sum of RGB channels of a #RRGGBB fill. */
function rgbSum(hex: string): number {
  return (
    parseInt(hex.slice(1, 3), 16) +
    parseInt(hex.slice(3, 5), 16) +
    parseInt(hex.slice(5, 7), 16)
  );
}

function totalHeight(g: NonNullable<ReturnType<typeof computeIconGeometry>>): number {
  return g.layers.reduce((s, l) => s + l.height, 0);
}

describe("computeIconGeometry — §3.7 Espresso", () => {
  const g = computeIconGeometry(ESPRESSO_SPEC, 48)!;

  it("parses and maps espresso_cup to the small cup shape", () => {
    expect(g).not.toBeNull();
    expect(g.frame.isTall).toBe(false);
    expect(g.frame.cupH).toBe(48);
  });

  it("fills to fill_level of the glass interior (0.67 * cupH)", () => {
    expect(totalHeight(g)).toBeCloseTo(48 * 0.67, 5);
  });

  it("stacks from the interior bottom", () => {
    expect(g.layers[0].yBottom).toBeCloseTo(g.frame.ciBot, 5);
  });

  it("renders a crema stripe topmost above the coffee body", () => {
    const roles = g.layers.map((l) => l.role);
    expect(roles).toEqual(["coffee", "crema"]);
    const [coffee, crema] = g.layers;
    expect(crema.yBottom).toBeCloseTo(coffee.yTop, 5);
    expect(crema.height).toBeGreaterThan(0);
    expect(crema.height).toBeLessThan(coffee.height);
  });

  it("resolves coffee fill from intensity and keeps steam", () => {
    expect(g.layers[0].fill).toMatch(HEX);
    expect(g.layers[0].intensity).toBeCloseTo(0.68, 5);
    expect(g.steam).toBe(true);
  });
});

describe("computeIconGeometry — §3.7 Latte Macchiato", () => {
  const g = computeIconGeometry(LATTE_MACCHIATO_SPEC, 48)!;

  it("maps tall_glass to the tall shape", () => {
    expect(g.frame.isTall).toBe(true);
    expect(g.frame.cupH).toBe(68);
  });

  it("stacks milk, coffee, foam bottom-up by fraction within fill_level", () => {
    expect(g.layers.map((l) => l.role)).toEqual(["milk", "coffee", "milk_foam"]);
    const [milk, coffee, foam] = g.layers;
    expect(milk.height).toBeCloseTo(68 * 0.63 * 0.65, 5);
    expect(coffee.height).toBeCloseTo(68 * 0.63 * 0.2, 5);
    expect(foam.height).toBeCloseTo(68 * 0.63 * 0.15, 5);
    expect(totalHeight(g)).toBeCloseTo(68 * 0.63, 5);
  });

  it("gives non-topmost coffee no crema stripe", () => {
    expect(g.layers.some((l) => l.role === "crema")).toBe(false);
  });

  it("layers are contiguous bottom-up", () => {
    expect(g.layers[0].yBottom).toBeCloseTo(g.frame.ciBot, 5);
    expect(g.layers[1].yBottom).toBeCloseTo(g.layers[0].yTop, 5);
    expect(g.layers[2].yBottom).toBeCloseTo(g.layers[1].yTop, 5);
  });
});

describe("computeIconGeometry — §3.8 Cappuccino", () => {
  const g = computeIconGeometry(CAPPUCCINO_SPEC, 48)!;

  it("renders in a cup with coffee under milk under foam", () => {
    expect(g.frame.isTall).toBe(false);
    expect(g.layers.map((l) => l.role)).toEqual(["coffee", "milk", "milk_foam"]);
  });

  it("honors fill_level 0.82 heights", () => {
    const [coffee, milk, foam] = g.layers;
    expect(coffee.height).toBeCloseTo(48 * 0.82 * 0.22, 5);
    expect(milk.height).toBeCloseTo(48 * 0.82 * 0.61, 5);
    expect(foam.height).toBeCloseTo(48 * 0.82 * 0.17, 5);
    expect(totalHeight(g)).toBeCloseTo(48 * 0.82, 5);
  });
});

describe("computeIconGeometry — fallbacks and robustness", () => {
  it("returns null for null/undefined/non-object specs", () => {
    expect(computeIconGeometry(null, 48)).toBeNull();
    expect(computeIconGeometry(undefined as unknown as IconSpec, 48)).toBeNull();
    expect(computeIconGeometry("x" as unknown as IconSpec, 48)).toBeNull();
  });

  it("returns null for unknown spec_version", () => {
    expect(
      computeIconGeometry({ ...ESPRESSO_SPEC, spec_version: 2 }, 48),
    ).toBeNull();
  });

  it("returns null for missing/empty layers", () => {
    expect(
      computeIconGeometry({ ...ESPRESSO_SPEC, layers: [] }, 48),
    ).toBeNull();
    expect(
      computeIconGeometry(
        { ...ESPRESSO_SPEC, layers: undefined as unknown as IconSpec["layers"] },
        48,
      ),
    ).toBeNull();
  });

  it("renders unknown glass as a cup", () => {
    const g = computeIconGeometry({ ...ESPRESSO_SPEC, glass: "bucket" }, 48)!;
    expect(g).not.toBeNull();
    expect(g.frame.isTall).toBe(false);
  });

  it("derives fill_level from total_ml and the cup nominal when missing", () => {
    const spec = {
      ...ESPRESSO_SPEC,
      glass: "bucket",
      total_ml: 110,
    } as IconSpec & { fill_level?: number };
    delete spec.fill_level;
    const g = computeIconGeometry(spec as IconSpec, 48)!;
    expect(g).not.toBeNull();
    // 110 / 220 (cup nominal) = 0.5 of cupH
    expect(totalHeight(g)).toBeCloseTo(48 * 0.5, 5);
  });

  it("renders unknown roles as a neutral grey layer scaled by intensity", () => {
    const mk = (intensity: number) =>
      computeIconGeometry(
        {
          spec_version: 1,
          glass: "cup",
          total_ml: 100,
          fill_level: 0.5,
          layers: [{ role: "tea", ml: 100, fraction: 1.0, intensity }],
          foam: null,
          steam: false,
        },
        48,
      )!;
    const light = mk(0.0).layers[0];
    const dark = mk(1.0).layers[0];
    expect(light.fill).toMatch(HEX);
    expect(dark.fill).toMatch(HEX);
    expect(rgbSum(dark.fill)).toBeLessThan(rgbSum(light.fill));
  });

  it("darker coffee for higher intensity", () => {
    const at = (intensity: number) =>
      computeIconGeometry(
        {
          ...ESPRESSO_SPEC,
          layers: [{ role: "coffee", ml: 40, fraction: 1.0, intensity }],
        },
        48,
      )!.layers[0].fill;
    expect(rgbSum(at(1.0))).toBeLessThan(rgbSum(at(0.3)));
  });

  it("normalizes fraction remainder into the last layer", () => {
    const g = computeIconGeometry(
      {
        spec_version: 1,
        glass: "cup",
        total_ml: 100,
        fill_level: 0.5,
        layers: [
          { role: "coffee", ml: 50, fraction: 0.5, intensity: 0.5 },
          { role: "milk", ml: 30, fraction: 0.3, intensity: 0.0 },
        ],
        foam: null,
        steam: true,
      },
      48,
    )!;
    // milk absorbs the missing 0.2 -> 0.5
    expect(g.layers[1].height).toBeCloseTo(48 * 0.5 * 0.5, 5);
    expect(totalHeight(g)).toBeCloseTo(48 * 0.5, 5);
  });

  it("steam=false is honored", () => {
    expect(
      computeIconGeometry({ ...ESPRESSO_SPEC, steam: false }, 48)!.steam,
    ).toBe(false);
  });
});

describe("computeIconGeometry — color_hint escaping (additives)", () => {
  const withHint = (color_hint: unknown) =>
    computeIconGeometry(
      {
        spec_version: 1,
        glass: "cup",
        total_ml: 100,
        fill_level: 0.5,
        layers: [
          {
            role: "additive",
            ml: 10,
            fraction: 1.0,
            intensity: 0.5,
            color_hint: color_hint as string | null,
            label: "Syrup",
          },
        ],
        foam: null,
        steam: false,
      },
      48,
    )!.layers[0];

  it("uses a valid #RRGGBB hint verbatim", () => {
    expect(withHint("#12AB34").fill).toBe("#12AB34");
  });

  it("rejects anything that is not #RRGGBB", () => {
    for (const bad of [
      "red",
      "url(#evil)",
      "#12345",
      "#1234567",
      "#gggggg",
      '#123456" onload="alert(1)',
      "javascript:alert(1)",
      null,
      undefined,
      12,
    ]) {
      const fill = withHint(bad);
      expect(fill.fill).toMatch(HEX);
      expect(fill.fill).not.toBe(bad);
    }
  });
});

describe("coffeeIconSvgFromSpec — template wrapper", () => {
  it("returns a lit template for a valid spec", () => {
    const res = coffeeIconSvgFromSpec(ESPRESSO_SPEC, 48, "t1") as {
      strings?: unknown;
    };
    expect(res).toBeTruthy();
    expect(res.strings).toBeDefined();
  });

  it("falls back to the DEFAULT drink for null/invalid/unknown-version specs", () => {
    for (const bad of [
      null,
      { ...ESPRESSO_SPEC, spec_version: 99 },
      { broken: true } as unknown as IconSpec,
    ]) {
      const res = coffeeIconSvgFromSpec(bad as IconSpec | null, 48, "t2") as {
        strings?: unknown;
      };
      expect(res).toBeTruthy();
      expect(res.strings).toBeDefined();
    }
  });
});

describe("legacy coffeeIconSvg stays functional", () => {
  it("renders known and unknown recipe names", () => {
    for (const name of ["Espresso", "Latte Macchiato", "Cafe Creme", "Nope"]) {
      const res = coffeeIconSvg(name, 48, "u1") as { strings?: unknown };
      expect(res).toBeTruthy();
      expect(res.strings).toBeDefined();
    }
  });
});
