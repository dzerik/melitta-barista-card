// Zone C-F: v2 parameter wiring — resolveParameters() three-tier fallback
// (spec §6.1.5), range-driven slider config, applies_to filtering, and
// unknown kind/scope handling, plus the displayNameFor call-site helper
// (§6.3.5.7 frozen signature; internals are Zone C-H's).
import { describe, it, expect } from "vitest";
import {
  resolveParameters,
  resolveFreestyleVocab,
  parameterEnabledFor,
  parameterRendered,
  type ResolvedParameters,
} from "../src/contract-wiring";
import { displayNameFor } from "../src/format";
import type { UiContract } from "../src/contract";
import {
  FREESTYLE_PROCESSES,
  FREESTYLE_INTENSITIES,
  FREESTYLE_AROMAS,
  FREESTYLE_TEMPERATURES,
  FREESTYLE_SHOTS,
  PORTION_LIMITS,
} from "../src/const";

// -- Fixtures -----------------------------------------------------------------
// Base v1 document (no v2 fields → a 0.91 server). The freestyle vocabulary
// deliberately differs from const.ts (temperature carries "extra_hot") so the
// tier-2-not-tier-3 assertions can tell the tiers apart.

function v1Contract(): UiContract {
  return {
    schema_version: 1,
    contract_version: 1,
    contract_fingerprint: "9f3ac1d24b07",
    entry_id: "a1b2c3d4e5f6",
    generated_at: "2026-09-02T10:15:00Z",
    source: "live",
    machine: {
      brand: "melitta",
      brand_name: "Melitta",
      model_name: "Barista TS Smart",
      family_key: "barista_ts",
      machine_type: "BARISTA_TS",
      connected: true,
    },
    capabilities: {
      supports_recipe_writes: true,
      supports_stats: true,
      supports_factory_reset: false,
      supports_brew_overrides: false,
      supports_freestyle: true,
      my_coffee_slots: 8,
      strength_levels: 5,
      has_aroma_balance: true,
      hopper_count: 2,
      has_milk_system: true,
      tolerated_brew_manipulations: [],
    },
    vocabularies: {
      status: {
        process: ["READY", "PRODUCT", "BUSY"],
        sub_process: ["GRINDING"],
        manipulation: ["NONE"],
        info_message: ["FILL_BEANS_1"],
      },
      freestyle: {
        process: ["none", "coffee", "milk", "water"],
        intensity: ["very_mild", "mild", "medium", "strong", "very_strong"],
        aroma: ["standard", "intense"],
        temperature: ["cold", "normal", "high", "extra_hot"],
        shots: ["none", "one", "two", "three"],
        blend: ["hopper_1", "hopper_2"],
      },
    },
    limits: {
      portion_ml: {
        c1: { min: 5, max: 250, step: 5 },
        c2: { min: 0, max: 250, step: 5 },
      },
    },
    recipes: [],
    status_attribute_entity: "state",
    bridge_attribute_entity: "connection",
  };
}

/** §6.1.4 Melitta TS `parameters` block, verbatim. */
function melittaParameters(): NonNullable<UiContract["parameters"]> {
  return {
    process: { kind: "enum", scope: ["freestyle"],
      tokens: ["none", "coffee", "milk", "water"] },
    intensity: { kind: "enum", scope: ["freestyle"], applies_to: ["coffee"],
      tokens: ["very_mild", "mild", "medium", "strong", "very_strong"] },
    aroma: { kind: "enum", scope: ["freestyle"], applies_to: ["coffee"],
      tokens: ["standard", "intense"] },
    temperature: { kind: "enum", scope: ["freestyle"],
      tokens: ["cold", "normal", "high"] },
    shots: { kind: "enum", scope: ["freestyle"], applies_to: ["coffee"],
      tokens: ["none", "one", "two", "three"] },
    blend: { kind: "enum", scope: ["freestyle"], applies_to: ["coffee"],
      tokens: ["hopper_1", "hopper_2"] },
    portion_ml: { kind: "range", scope: ["freestyle"], unit: "ml",
      per_component: true,
      c1: { min: 5, max: 250, step: 5 },
      c2: { min: 0, max: 250, step: 5 } },
  };
}

function v2Contract(): UiContract {
  const c = v1Contract();
  c.parameters = melittaParameters();
  c.forbidden_combinations = [];
  c.strings_version = "0.92.0b1";
  return c;
}

// -- Three-tier fallback (§6.1.5) --------------------------------------------

describe("resolveParameters: three-tier fallback", () => {
  it("tier 3 — no contract at all lands on const.ts", () => {
    for (const v of [resolveParameters(null), resolveParameters(undefined)]) {
      expect(v.processes).toEqual([...FREESTYLE_PROCESSES]);
      expect(v.intensities).toEqual([...FREESTYLE_INTENSITIES]);
      expect(v.aromas).toEqual([...FREESTYLE_AROMAS]);
      expect(v.temperatures).toEqual([...FREESTYLE_TEMPERATURES]);
      expect(v.shots).toEqual([...FREESTYLE_SHOTS]);
      expect(v.limits).toEqual(PORTION_LIMITS);
      expect(v.portionUnit).toBeNull();
    }
  });

  it("tier 2 — a 0.91 server (no `parameters`) lands on the v1 vocabularies, NOT the consts", () => {
    const v = resolveParameters(v1Contract());
    // "extra_hot" exists only in the v1 vocabulary fixture — proof this is
    // tier 2 and not the const.ts tier (§6.1.5: skipping tier 2 is forbidden).
    expect(v.temperatures).toEqual(["cold", "normal", "high", "extra_hot"]);
    expect(v.intensities).toEqual(["very_mild", "mild", "medium", "strong", "very_strong"]);
    expect(v.limits.c1).toEqual({ min: 5, max: 250, step: 5 });
    expect(v.limits.c2).toEqual({ min: 0, max: 250, step: 5 });
  });

  it("tier 1 — a §6.1.4 `parameters` catalog wins over the v1 blocks", () => {
    const v = resolveParameters(v2Contract());
    // temperature descriptor lacks "extra_hot" — proof the descriptor won.
    expect(v.temperatures).toEqual(["cold", "normal", "high"]);
    expect(v.intensities).toEqual(["very_mild", "mild", "medium", "strong", "very_strong"]);
    expect(v.aromas).toEqual(["standard", "intense"]);
    expect(v.shots).toEqual(["none", "one", "two", "three"]);
    expect(v.processes).toEqual(["coffee", "milk", "water"]);
    expect(v.processesWithNone).toEqual(["none", "coffee", "milk", "water"]);
  });

  it("falls back per parameter: a family absent from `parameters` uses tier 2", () => {
    const c = v2Contract();
    delete c.parameters!.shots;
    c.vocabularies.freestyle.shots = ["none", "one"]; // distinct tier-2 marker
    const v = resolveParameters(c);
    expect(v.shots).toEqual(["none", "one"]); // tier 2 for shots…
    expect(v.temperatures).toEqual(["cold", "normal", "high"]); // …tier 1 for the rest
  });

  it("3-level Nivona intensity slice renders exactly as served", () => {
    const c = v2Contract();
    c.parameters!.intensity = {
      kind: "enum", scope: ["freestyle"], applies_to: ["coffee"],
      tokens: ["mild", "medium", "strong"],
    };
    expect(resolveParameters(c).intensities).toEqual(["mild", "medium", "strong"]);
  });
});

// -- Unknown kind / scope handling (§6.0.3, §6.1.1, §6.1.5) -------------------

describe("resolveParameters: unknown kind and scope", () => {
  it("unknown descriptor kind → that parameter falls back to tier 2, still rendered", () => {
    const c = v2Contract();
    (c.parameters as Record<string, unknown>).temperature = {
      kind: "hologram", scope: ["freestyle"], tokens: ["cold"],
    };
    const v = resolveParameters(c);
    expect(v.temperatures).toEqual(["cold", "normal", "high", "extra_hot"]); // tier 2
    expect(parameterRendered(v, "temperature")).toBe(true);
  });

  it("empty enum token list → per-parameter fallback (existing stringList guard)", () => {
    const c = v2Contract();
    c.parameters!.aroma = { kind: "enum", scope: ["freestyle"], tokens: [] };
    expect(resolveParameters(c).aromas).toEqual(["standard", "intense"]); // tier 2
  });

  it("brew_override-scoped descriptor is not rendered in freestyle UI", () => {
    const c = v2Contract();
    c.parameters!.intensity = {
      kind: "enum", scope: ["brew_override"], applies_to: ["coffee"],
      tokens: ["mild", "medium", "strong"],
    };
    const v = resolveParameters(c);
    expect(parameterRendered(v, "intensity")).toBe(false);
    // Its tokens are NOT promoted into the freestyle lists.
    expect(v.intensities).toEqual(["very_mild", "mild", "medium", "strong", "very_strong"]);
  });

  it("descriptor whose scope has no token this client understands is not rendered", () => {
    const c = v2Contract();
    c.parameters!.shots = { kind: "enum", scope: ["pwa_only"], tokens: ["one"] };
    const v = resolveParameters(c);
    expect(parameterRendered(v, "shots")).toBe(false);
    expect(parameterRendered(v, "intensity")).toBe(true); // others unaffected
  });

  it("all families render by default in tier-2/tier-3 modes", () => {
    for (const v of [resolveParameters(null), resolveParameters(v1Contract())]) {
      for (const f of ["process", "intensity", "aroma", "temperature", "shots", "portion_ml"]) {
        expect(parameterRendered(v, f)).toBe(true);
      }
    }
  });
});

// -- Range descriptors drive slider config (§6.1.1, §8.2 C-F) -----------------

describe("resolveParameters: portion range", () => {
  it("per_component range descriptor drives both sliders + unit", () => {
    const c = v2Contract();
    c.parameters!.portion_ml = {
      kind: "range", scope: ["freestyle"], unit: "ml", per_component: true,
      c1: { min: 10, max: 200, step: 10 },
      c2: { min: 0, max: 100, step: 5 },
    };
    const v = resolveParameters(c);
    expect(v.limits.c1).toEqual({ min: 10, max: 200, step: 10 });
    expect(v.limits.c2).toEqual({ min: 0, max: 100, step: 5 });
    expect(v.portionUnit).toBe("ml");
  });

  it("flat min/max/step range applies to both components", () => {
    const c = v2Contract();
    c.parameters!.portion_ml = {
      kind: "range", scope: ["freestyle"], unit: "ml",
      min: 5, max: 300, step: 5,
    };
    const v = resolveParameters(c);
    expect(v.limits.c1).toEqual({ min: 5, max: 300, step: 5 });
    expect(v.limits.c2).toEqual({ min: 5, max: 300, step: 5 });
  });

  it("brew_override-scoped portion range is not rendered and keeps tier-2 limits", () => {
    const c = v2Contract();
    c.parameters!.portion_ml = {
      kind: "range", scope: ["brew_override"], unit: "ml", per_component: true,
      c1: { min: 10, max: 200, step: 10 },
      c2: { min: 0, max: 100, step: 5 },
    };
    const v = resolveParameters(c);
    expect(parameterRendered(v, "portion_ml")).toBe(false);
    expect(v.limits).toEqual(PORTION_LIMITS); // tier 2 (fixture equals consts)
    expect(v.portionUnit).toBeNull();
  });

  it("0.91 server portion limits stay tier 2", () => {
    const c = v1Contract();
    c.limits.portion_ml.c2 = { min: 0, max: 300, step: 10 };
    const v = resolveParameters(c);
    expect(v.limits.c2).toEqual({ min: 0, max: 300, step: 10 });
    expect(v.portionUnit).toBeNull(); // unit is a tier-1-only datum
  });
});

// -- applies_to filtering (§6.1.1) --------------------------------------------

describe("parameterEnabledFor", () => {
  it("tier-1 applies_to gates by component process", () => {
    const v = resolveParameters(v2Contract());
    expect(parameterEnabledFor(v, "intensity", "coffee")).toBe(true);
    expect(parameterEnabledFor(v, "intensity", "milk")).toBe(false);
    expect(parameterEnabledFor(v, "shots", "water")).toBe(false);
    // No applies_to on the descriptor = attaches to all processes.
    expect(parameterEnabledFor(v, "temperature", "milk")).toBe(true);
    expect(parameterEnabledFor(v, "process", "milk")).toBe(true);
  });

  it("a served applies_to can open a family the legacy rule kept coffee-only", () => {
    const c = v2Contract();
    c.parameters!.intensity = {
      kind: "enum", scope: ["freestyle"], applies_to: ["coffee", "milk"],
      tokens: ["mild", "medium", "strong"],
    };
    const v = resolveParameters(c);
    expect(parameterEnabledFor(v, "intensity", "milk")).toBe(true);
    expect(parameterEnabledFor(v, "intensity", "water")).toBe(false);
  });

  it("legacy modes mirror today's hardcoded coffee-only rule", () => {
    for (const v of [resolveParameters(null), resolveParameters(v1Contract())]) {
      expect(parameterEnabledFor(v, "intensity", "coffee")).toBe(true);
      expect(parameterEnabledFor(v, "intensity", "milk")).toBe(false);
      expect(parameterEnabledFor(v, "aroma", "water")).toBe(false);
      expect(parameterEnabledFor(v, "shots", "milk")).toBe(false);
      expect(parameterEnabledFor(v, "temperature", "milk")).toBe(true);
      expect(parameterEnabledFor(v, "portion_ml", "water")).toBe(true);
    }
  });

  it("accepts a plain FreestyleVocab (pre-C-F caller) with the legacy rule", () => {
    const vocab = resolveFreestyleVocab(v1Contract());
    expect(parameterEnabledFor(vocab, "intensity", "milk")).toBe(false);
    expect(parameterEnabledFor(vocab, "temperature", "milk")).toBe(true);
    expect(parameterRendered(vocab, "intensity")).toBe(true);
  });
});

// -- ResolvedParameters stays a FreestyleVocab superset -----------------------

describe("ResolvedParameters compatibility", () => {
  it("is assignable where a FreestyleVocab is expected (controls.ts vocab prop)", () => {
    const v: ResolvedParameters = resolveParameters(v2Contract());
    const asVocab: ReturnType<typeof resolveFreestyleVocab> = v;
    expect(asVocab.processes).toEqual(["coffee", "milk", "water"]);
  });

  it("matches resolveFreestyleVocab byte-for-byte on the shared fields without v2 data", () => {
    const legacy = resolveFreestyleVocab(v1Contract());
    const v = resolveParameters(v1Contract());
    expect(v.processes).toEqual(legacy.processes);
    expect(v.processesWithNone).toEqual(legacy.processesWithNone);
    expect(v.intensities).toEqual(legacy.intensities);
    expect(v.aromas).toEqual(legacy.aromas);
    expect(v.temperatures).toEqual(legacy.temperatures);
    expect(v.shots).toEqual(legacy.shots);
    expect(v.limits).toEqual(legacy.limits);
  });
});

// -- displayNameFor (§6.3.5.7 frozen signature; internals Zone C-H) ----------

describe("displayNameFor", () => {
  it("resolves known value tokens via the bundle layer", () => {
    // Stable under C-H: with no server strings set, the bundle layer wins.
    expect(displayNameFor("intensity", "very_mild")).toBe("V.Mild");
    expect(displayNameFor("shots", "one")).toBe("1");
    expect(displayNameFor("aroma", "standard")).toBe("Std");
  });

  it("humanizes unknown tokens as the last resort", () => {
    expect(displayNameFor("intensity", "extra_bold")).toBe("Extra bold");
    expect(displayNameFor("temperature", "foo")).toBe("Foo");
  });
});
