// Zone C-D pure wiring helpers: contract → freestyle vocab/limits resolution
// and per-recipe icon-spec lookup (UI Contract §7.2 C-D).
import { describe, it, expect } from "vitest";
import {
  resolveFreestyleVocab,
  iconSpecForRecipe,
  contractAllowsFreestyle,
  type FreestyleVocab,
} from "../src/contract-wiring";
import type { UiContract } from "../src/contract";
import {
  FREESTYLE_PROCESSES,
  FREESTYLE_PROCESSES_WITH_NONE,
  FREESTYLE_INTENSITIES,
  FREESTYLE_AROMAS,
  FREESTYLE_TEMPERATURES,
  FREESTYLE_SHOTS,
  PORTION_LIMITS,
} from "../src/const";

// -- Fixtures (verbatim slices of the §3.7 / §3.8 example payloads) ----------

const espressoIcon = {
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

function melittaContract(): UiContract {
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
        intensity: ["very_mild", "mild", "normal", "strong", "very_strong"],
        aroma: ["standard", "intense"],
        temperature: ["cold", "normal", "high"],
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
    recipes: [
      { recipe_id: 200, name: "Espresso", category: "espresso", icon: espressoIcon },
      { recipe_id: 300, name: "My Coffee 1", category: "my_coffee", icon: null },
    ],
    status_attribute_entity: "state",
    bridge_attribute_entity: "connection",
  };
}

function nivonaContract(): UiContract {
  const c = melittaContract();
  c.contract_fingerprint = "41c09be77a20";
  c.capabilities.supports_freestyle = false;
  c.vocabularies.freestyle.intensity = ["mild", "normal", "strong"];
  c.vocabularies.freestyle.blend = ["hopper_1"];
  return c;
}

// -- resolveFreestyleVocab ----------------------------------------------------

describe("resolveFreestyleVocab", () => {
  it("falls back to the legacy consts without a contract", () => {
    for (const v of [resolveFreestyleVocab(null), resolveFreestyleVocab(undefined)]) {
      expect(v.processes).toEqual([...FREESTYLE_PROCESSES]);
      expect(v.processesWithNone).toEqual([...FREESTYLE_PROCESSES_WITH_NONE]);
      expect(v.intensities).toEqual([...FREESTYLE_INTENSITIES]);
      expect(v.aromas).toEqual([...FREESTYLE_AROMAS]);
      expect(v.temperatures).toEqual([...FREESTYLE_TEMPERATURES]);
      expect(v.shots).toEqual([...FREESTYLE_SHOTS]);
      expect(v.limits).toEqual(PORTION_LIMITS);
    }
    // The legacy intensity list keeps its historical "medium" token.
    expect(resolveFreestyleVocab(null).intensities).toContain("medium");
  });

  it("prefers contract vocabularies and limits (Melitta §3.7)", () => {
    const v = resolveFreestyleVocab(melittaContract());
    expect(v.processes).toEqual(["coffee", "milk", "water"]); // "none" stripped for c1
    expect(v.processesWithNone).toEqual(["none", "coffee", "milk", "water"]);
    expect(v.intensities).toEqual(["very_mild", "mild", "normal", "strong", "very_strong"]);
    expect(v.aromas).toEqual(["standard", "intense"]);
    expect(v.temperatures).toEqual(["cold", "normal", "high"]);
    expect(v.shots).toEqual(["none", "one", "two", "three"]);
    expect(v.limits.c1).toEqual({ min: 5, max: 250, step: 5 });
    expect(v.limits.c2).toEqual({ min: 0, max: 250, step: 5 });
  });

  it("renders exactly the machine-filtered subset (Nivona §3.8: 3-level intensity)", () => {
    const v = resolveFreestyleVocab(nivonaContract());
    expect(v.intensities).toEqual(["mild", "normal", "strong"]);
  });

  it("keeps unknown future tokens (additive growth, §5.2.2)", () => {
    const c = melittaContract();
    c.vocabularies.freestyle.temperature = ["cold", "normal", "high", "extra_hot"];
    expect(resolveFreestyleVocab(c).temperatures).toContain("extra_hot");
  });

  it("injects 'none' into the c2 process list when the server omitted it", () => {
    const c = melittaContract();
    c.vocabularies.freestyle.process = ["coffee", "milk", "water"];
    const v = resolveFreestyleVocab(c);
    expect(v.processesWithNone).toEqual(["none", "coffee", "milk", "water"]);
    expect(v.processes).toEqual(["coffee", "milk", "water"]);
  });

  it("falls back per-field on empty or malformed vocabulary lists", () => {
    const c = melittaContract();
    (c.vocabularies.freestyle as Record<string, unknown>).intensity = [];
    (c.vocabularies.freestyle as Record<string, unknown>).shots = "three";
    const v = resolveFreestyleVocab(c);
    expect(v.intensities).toEqual([...FREESTYLE_INTENSITIES]);
    expect(v.shots).toEqual([...FREESTYLE_SHOTS]);
    // Untouched fields still come from the contract.
    expect(v.temperatures).toEqual(["cold", "normal", "high"]);
  });

  it("falls back per-component on malformed portion limits", () => {
    const c = melittaContract();
    (c.limits.portion_ml as Record<string, unknown>).c1 = { min: 5, max: "big", step: 5 };
    c.limits.portion_ml.c2 = { min: 0, max: 300, step: 10 };
    const v = resolveFreestyleVocab(c);
    expect(v.limits.c1).toEqual(PORTION_LIMITS.c1);
    expect(v.limits.c2).toEqual({ min: 0, max: 300, step: 10 });
  });
});

// -- contractAllowsFreestyle --------------------------------------------------

describe("contractAllowsFreestyle", () => {
  it("defaults to true without a contract (legacy mode keeps the section)", () => {
    expect(contractAllowsFreestyle(null)).toBe(true);
    expect(contractAllowsFreestyle(undefined)).toBe(true);
  });

  it("follows capabilities.supports_freestyle when a contract is present", () => {
    expect(contractAllowsFreestyle(melittaContract())).toBe(true);
    expect(contractAllowsFreestyle(nivonaContract())).toBe(false);
  });
});

// -- iconSpecForRecipe --------------------------------------------------------

describe("iconSpecForRecipe", () => {
  const attrRecipes = [
    { name: "Espresso", icon: { ...espressoIcon, total_ml: 41 } },
    { name: "My Coffee 1", icon: null },
    { name: "Cappuccino" }, // old-integration entry shape: no icon key
  ];

  it("prefers the recipes attribute entry over the contract catalog", () => {
    const r = iconSpecForRecipe("Espresso", attrRecipes, melittaContract());
    expect(r.found).toBe(true);
    expect((r.icon as { total_ml: number }).total_ml).toBe(41);
  });

  it("returns found with a null icon (server-mandated generic default, §3.3)", () => {
    const r = iconSpecForRecipe("My Coffee 1", attrRecipes, null);
    expect(r).toEqual({ found: true, icon: null });
  });

  it("falls through to the contract catalog when the attribute entry has no icon key", () => {
    const r = iconSpecForRecipe("Espresso", [{ name: "Espresso" }], melittaContract());
    expect(r.found).toBe(true);
    expect(r.icon).toEqual(espressoIcon);
  });

  it("uses the contract catalog when the attribute has no matching entry", () => {
    const r = iconSpecForRecipe("My Coffee 1", [], melittaContract());
    expect(r).toEqual({ found: true, icon: null });
  });

  it("reports not-found when neither surface knows the recipe (→ legacy name lookup)", () => {
    expect(iconSpecForRecipe("Ristretto", attrRecipes, null)).toEqual({ found: false, icon: null });
    expect(iconSpecForRecipe("Cappuccino", attrRecipes, null)).toEqual({ found: false, icon: null });
  });

  it("tolerates malformed attribute shapes without throwing", () => {
    expect(iconSpecForRecipe("Espresso", undefined, null).found).toBe(false);
    expect(iconSpecForRecipe("Espresso", "nope", null).found).toBe(false);
    expect(iconSpecForRecipe("Espresso", [null, 42, { icon: espressoIcon }], null).found).toBe(false);
    // A malformed icon value (non-object, non-null) is passed through as null.
    const r = iconSpecForRecipe("Espresso", [{ name: "Espresso", icon: "broken" }], null);
    expect(r).toEqual({ found: true, icon: null });
  });
});
