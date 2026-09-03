// Zone C-E: v2 contract features (spec §6, 0.92 amendment) — additive types,
// per-feature presence detection, unknown-kind dropping. The v1 suite in
// contract.test.ts stays untouched; this file covers only the v2 surface.
import { describe, it, expect } from "vitest";
import {
  validateContract,
  readContractParameters,
  readContractActions,
  KNOWN_PARAMETER_KINDS,
  KNOWN_INVOCATION_KINDS,
  type UiContract,
  type ActionEntry,
  type ParameterDescriptor,
} from "../src/contract";

// ---------------------------------------------------------------------------
// Fixtures.
// Base documents: spec §3.7 (Melitta TS) / §3.8 (Nivona 700), VERBATIM.
// v2 blocks: spec §6.1.4 parameter payloads, VERBATIM (pinned by the zone).
// ---------------------------------------------------------------------------

/** Spec §6.1.4 — Melitta Barista TS `parameters` block, verbatim. */
const MELITTA_PARAMETERS = {
  "process":     { "kind": "enum", "scope": ["freestyle"],
                   "tokens": ["none", "coffee", "milk", "water"] },
  "intensity":   { "kind": "enum", "scope": ["freestyle"], "applies_to": ["coffee"],
                   "tokens": ["very_mild", "mild", "medium", "strong", "very_strong"] },
  "aroma":       { "kind": "enum", "scope": ["freestyle"], "applies_to": ["coffee"],
                   "tokens": ["standard", "intense"] },
  "temperature": { "kind": "enum", "scope": ["freestyle"],
                   "tokens": ["cold", "normal", "high"] },
  "shots":       { "kind": "enum", "scope": ["freestyle"], "applies_to": ["coffee"],
                   "tokens": ["none", "one", "two", "three"] },
  "blend":       { "kind": "enum", "scope": ["freestyle"], "applies_to": ["coffee"],
                   "tokens": ["hopper_1", "hopper_2"] },
  "portion_ml":  { "kind": "range", "scope": ["freestyle"], "unit": "ml",
                   "per_component": true,
                   "c1": { "min": 5, "max": 250, "step": 5 },
                   "c2": { "min": 0, "max": 250, "step": 5 } }
};

/** Spec §6.1.4 — Nivona 700 `parameters` block, verbatim. */
const NIVONA_PARAMETERS = {
  "intensity":  { "kind": "enum", "scope": ["brew_override"], "applies_to": ["coffee"],
                  "tokens": ["mild", "medium", "strong"] },
  "aroma":      { "kind": "enum", "scope": ["brew_override"], "applies_to": ["coffee"],
                  "tokens": ["standard", "intense"] },
  "portion_ml": { "kind": "range", "scope": ["brew_override"], "unit": "ml",
                  "per_component": true,
                  "c1": { "min": 5, "max": 250, "step": 5 },
                  "c2": { "min": 0, "max": 250, "step": 5 } }
};

/** Representative §6.2.2 action-catalog slice (button, service, power, danger). */
const MELITTA_ACTIONS = [
  { "action": "brew", "group": "brew", "process": "PRODUCT", "icon": "mdi:coffee",
    "confirm": false, "requires": ["ready"], "available": true,
    "invocation": { "kind": "button", "entity_suffix": "brew" } },
  { "action": "brew_freestyle", "group": "brew", "process": "PRODUCT",
    "icon": "mdi:coffee-maker", "confirm": false, "requires": ["ready"], "available": true,
    "invocation": { "kind": "service", "service": "brew_freestyle", "entity_suffix": "brew",
      "params": [{ "name": "params", "kind": "params_ref", "ref": "freestyle",
                   "required": true }] } },
  { "action": "easy_clean", "group": "cleaning", "process": "EASY_CLEAN",
    "icon": "mdi:shimmer", "confirm": true, "requires": ["ready"], "available": true,
    "invocation": { "kind": "button", "entity_suffix": "easy_clean" } },
  { "action": "switch_off", "group": "power", "process": "SWITCH_OFF", "icon": "mdi:power",
    "confirm": true, "requires": ["connected"], "available": true,
    "invocation": { "kind": "button", "entity_suffix": "switch_off" } },
  { "action": "factory_reset_settings", "group": "danger", "process": null,
    "icon": "mdi:cog-refresh", "confirm": true, "destructive": true,
    "requires": ["ready"], "available": false,
    "invocation": { "kind": "button", "entity_suffix": "factory_reset_settings" } },
];

/** Spec §3.7 — Melitta Barista TS Smart, verbatim. */
const MELITTA_V1 = {
  "schema_version": 1,
  "contract_version": 1,
  "contract_fingerprint": "9f3ac1d24b07",
  "entry_id": "a1b2c3d4e5f6",
  "generated_at": "2026-09-02T10:15:00Z",
  "source": "live",
  "machine": {
    "brand": "melitta", "brand_name": "Melitta", "model_name": "Barista TS Smart",
    "family_key": "barista_ts", "machine_type": "BARISTA_TS", "connected": true
  },
  "brand_theme": {
    "brand": "melitta", "wordmark": "MELITTA",
    "accent": "#c8102e", "accent_soft": "#f6e3e6", "logo_url": null
  },
  "capabilities": {
    "supports_recipe_writes": true, "supports_stats": true,
    "supports_factory_reset": false, "supports_brew_overrides": false,
    "supports_freestyle": true, "my_coffee_slots": 8, "strength_levels": 5,
    "has_aroma_balance": true, "hopper_count": 2, "has_milk_system": true,
    "tolerated_brew_manipulations": []
  },
  "vocabularies": {
    "status": {
      "process": ["READY", "PRODUCT", "CLEANING", "DESCALING", "FILTER_INSERT",
                  "FILTER_REPLACE", "FILTER_REMOVE", "SWITCH_OFF", "EASY_CLEAN",
                  "INTENSIVE_CLEAN", "EVAPORATING", "BUSY"],
      "sub_process": ["GRINDING", "COFFEE", "STEAM", "WATER", "PREPARE"],
      "manipulation": ["NONE", "BU_REMOVED", "TRAYS_MISSING", "EMPTY_TRAYS",
                       "FILL_WATER", "CLOSE_POWDER_LID", "FILL_POWDER",
                       "MOVE_CUP_TO_FROTHER", "FLUSH_REQUIRED"],
      "info_message": ["FILL_BEANS_1", "FILL_BEANS_2", "EASY_CLEAN",
                       "POWDER_FILLED", "PREPARATION_CANCELLED"]
    },
    "freestyle": {
      "process": ["none", "coffee", "milk", "water"],
      "intensity": ["very_mild", "mild", "medium", "strong", "very_strong"],
      "aroma": ["standard", "intense"],
      "temperature": ["cold", "normal", "high"],
      "shots": ["none", "one", "two", "three"],
      "blend": ["hopper_1", "hopper_2"]
    }
  },
  "limits": {
    "portion_ml": {
      "c1": { "min": 5, "max": 250, "step": 5 },
      "c2": { "min": 0, "max": 250, "step": 5 }
    }
  },
  "recipes": [
    {
      "recipe_id": 200, "name": "Espresso", "category": "espresso",
      "components": {
        "c1": { "process": "coffee", "intensity": "strong", "aroma": "standard",
                "temperature": "normal", "shots": "one", "portion_ml": 40,
                "blend": "hopper_1" },
        "c2": null
      },
      "icon": {
        "spec_version": 1, "glass": "espresso_cup", "total_ml": 40, "fill_level": 0.67,
        "layers": [
          { "role": "coffee", "ml": 40, "fraction": 1.0, "intensity": 0.68, "crema": true }
        ],
        "foam": null, "steam": true
      }
    }
  ],
  "status_attribute_entity": "state",
  "bridge_attribute_entity": "connection"
};

/** Spec §3.8 — Nivona 700 family, NICR 769, verbatim (no components blocks). */
const NIVONA_V1 = {
  "schema_version": 1,
  "contract_version": 1,
  "contract_fingerprint": "41c09be77a20",
  "entry_id": "f6e5d4c3b2a1",
  "generated_at": "2026-09-02T10:15:00Z",
  "source": "live",
  "machine": {
    "brand": "nivona", "brand_name": "Nivona", "model_name": "NICR 769",
    "family_key": "700", "machine_type": null, "connected": true
  },
  "brand_theme": {
    "brand": "nivona", "wordmark": "NIVONA",
    "accent": "#00646b", "accent_soft": "#e0eeef",
    "logo_url": "/local/melitta_barista/nivona.png"
  },
  "capabilities": {
    "supports_recipe_writes": false, "supports_stats": true,
    "supports_factory_reset": true, "supports_brew_overrides": true,
    "supports_freestyle": false, "my_coffee_slots": 4, "strength_levels": 3,
    "has_aroma_balance": true, "hopper_count": 1, "has_milk_system": true,
    "tolerated_brew_manipulations": []
  },
  "vocabularies": {
    "status": {
      "process": ["READY", "PRODUCT", "CLEANING", "DESCALING", "FILTER_INSERT",
                  "FILTER_REPLACE", "FILTER_REMOVE", "SWITCH_OFF", "EASY_CLEAN",
                  "INTENSIVE_CLEAN", "EVAPORATING", "BUSY"],
      "sub_process": ["GRINDING", "COFFEE", "STEAM", "WATER", "PREPARE"],
      "manipulation": ["NONE", "BU_REMOVED", "TRAYS_MISSING", "EMPTY_TRAYS",
                       "FILL_WATER", "CLOSE_POWDER_LID", "FILL_POWDER",
                       "MOVE_CUP_TO_FROTHER", "FLUSH_REQUIRED"],
      "info_message": ["FILL_BEANS_1", "FILL_BEANS_2", "EASY_CLEAN",
                       "POWDER_FILLED", "PREPARATION_CANCELLED"]
    },
    "freestyle": {
      "process": ["none", "coffee", "milk", "water"],
      "intensity": ["mild", "medium", "strong"],
      "aroma": ["standard", "intense"],
      "temperature": ["cold", "normal", "high"],
      "shots": ["none", "one", "two", "three"],
      "blend": ["hopper_1"]
    }
  },
  "limits": {
    "portion_ml": {
      "c1": { "min": 5, "max": 250, "step": 5 },
      "c2": { "min": 0, "max": 250, "step": 5 }
    }
  },
  "recipes": [
    {
      "recipe_id": 1, "name": "Espresso", "category": "espresso",
      "icon": {
        "spec_version": 1, "glass": "espresso_cup", "total_ml": 40, "fill_level": 0.67,
        "layers": [
          { "role": "coffee", "ml": 40, "fraction": 1.0, "intensity": 0.68, "crema": true }
        ],
        "foam": null, "steam": true
      }
    }
  ],
  "status_attribute_entity": "state",
  "bridge_attribute_entity": "connection"
};

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/** §3.7 doc extended with the full v2 feature set (§6.1.4 verbatim + §6.2/§6.3). */
function melittaV2(): Record<string, unknown> {
  const doc = clone(MELITTA_V1) as Record<string, unknown>;
  doc.parameters = clone(MELITTA_PARAMETERS);
  doc.forbidden_combinations = [];
  doc.actions = clone(MELITTA_ACTIONS);
  doc.strings_version = "0.92.0";
  (doc.recipes as Record<string, unknown>[])[0].name_key = "espresso";
  return doc;
}

/** §3.8 doc extended with the Nivona §6.1.4 parameters verbatim. */
function nivonaV2(): Record<string, unknown> {
  const doc = clone(NIVONA_V1) as Record<string, unknown>;
  doc.parameters = clone(NIVONA_PARAMETERS);
  doc.forbidden_combinations = [];
  doc.strings_version = "0.92.0";
  (doc.recipes as Record<string, unknown>[])[0].name_key = "espresso";
  return doc;
}

// ---------------------------------------------------------------------------
// validateContract — NOT extended for v2 (§6.0.1): v2 fields are optional
// pass-through, a v1 document without them stays valid, and v2 malformation
// never invalidates the whole contract.
// ---------------------------------------------------------------------------

describe("validateContract with v2 fields", () => {
  it("accepts the §3.7 document extended with the §6.1.4 Melitta v2 blocks", () => {
    const c = validateContract(melittaV2());
    expect(c).not.toBeNull();
    expect(c!.parameters).toEqual(MELITTA_PARAMETERS);
    expect(c!.parameters!.intensity.tokens)
      .toEqual(["very_mild", "mild", "medium", "strong", "very_strong"]);
    expect(c!.parameters!.portion_ml.c1).toEqual({ min: 5, max: 250, step: 5 });
    expect(c!.forbidden_combinations).toEqual([]);
    expect(c!.strings_version).toBe("0.92.0");
    expect(c!.actions).toHaveLength(5);
    expect(c!.recipes[0].name_key).toBe("espresso");
  });

  it("accepts the §3.8 document extended with the §6.1.4 Nivona v2 blocks", () => {
    const c = validateContract(nivonaV2());
    expect(c).not.toBeNull();
    expect(c!.parameters).toEqual(NIVONA_PARAMETERS);
    expect(Object.keys(c!.parameters!)).toEqual(["intensity", "aroma", "portion_ml"]);
    expect(c!.parameters!.intensity.scope).toEqual(["brew_override"]);
    expect(c!.parameters!.intensity.tokens).toEqual(["mild", "medium", "strong"]);
  });

  it("still accepts a v1 document WITHOUT any v2 field (§6.0.1 — not extended)", () => {
    for (const doc of [clone(MELITTA_V1), clone(NIVONA_V1)]) {
      const c = validateContract(doc);
      expect(c).not.toBeNull();
      expect(c!.parameters).toBeUndefined();
      expect(c!.actions).toBeUndefined();
      expect(c!.forbidden_combinations).toBeUndefined();
      expect(c!.strings_version).toBeUndefined();
      expect(c!.recipes[0].name_key).toBeUndefined();
    }
  });

  it("does not reject v2 malformation — per-feature degradation, not doc-level (§6.0.4)", () => {
    const doc = melittaV2();
    doc.parameters = "garbage";
    doc.actions = 42;
    expect(validateContract(doc)).not.toBeNull();
  });

  it("the §6.1.2 mirror holds in the fixtures: parameters mirror v1 vocab/limits", () => {
    const c = validateContract(melittaV2())!;
    for (const family of ["process", "intensity", "aroma", "temperature", "shots", "blend"] as const) {
      expect(c.parameters![family].tokens).toEqual(c.vocabularies.freestyle[family]);
    }
    expect(c.parameters!.portion_ml.c1).toEqual(c.limits.portion_ml.c1);
    expect(c.parameters!.portion_ml.c2).toEqual(c.limits.portion_ml.c2);
  });
});

// ---------------------------------------------------------------------------
// readContractParameters — presence detection + unknown-kind dropping (§6.1.5)
// ---------------------------------------------------------------------------

describe("readContractParameters", () => {
  it("knows exactly the §6.1.1 kinds", () => {
    expect(KNOWN_PARAMETER_KINDS).toEqual(["enum", "range"]);
  });

  it("returns null when parameters is absent (0.91 server → v1-tier fallback)", () => {
    const c = validateContract(clone(MELITTA_V1))!;
    expect(readContractParameters(c)).toBeNull();
  });

  it("returns null when parameters is not an object (malformed v2 block)", () => {
    const doc = melittaV2();
    doc.parameters = "garbage";
    expect(readContractParameters(validateContract(doc)!)).toBeNull();
  });

  it("passes all seven §6.1.4 Melitta families through untouched", () => {
    const params = readContractParameters(validateContract(melittaV2())!)!;
    expect(params).toEqual(MELITTA_PARAMETERS);
    expect(Object.keys(params)).toEqual([
      "process", "intensity", "aroma", "temperature", "shots", "blend", "portion_ml",
    ]);
  });

  it("passes the §6.1.4 Nivona brew_override families through untouched", () => {
    const params = readContractParameters(validateContract(nivonaV2())!)!;
    expect(params).toEqual(NIVONA_PARAMETERS);
  });

  it("drops a descriptor with an unknown kind, keeping the rest (§6.0.3)", () => {
    const doc = melittaV2();
    (doc.parameters as Record<string, unknown>).grind_ms =
      { kind: "matrix", scope: ["freestyle"], cells: [] };
    const params = readContractParameters(validateContract(doc)!)!;
    expect(params.grind_ms).toBeUndefined();
    expect(params.intensity).toEqual(MELITTA_PARAMETERS.intensity);
  });

  it("drops structurally unusable descriptors (enum without tokens, broken range, non-record)", () => {
    const doc = melittaV2();
    const p = doc.parameters as Record<string, unknown>;
    p.aroma = { kind: "enum", scope: ["freestyle"] };                  // no tokens
    p.portion_ml = { kind: "range", scope: ["freestyle"],
                     per_component: true, c1: { min: 5 } };            // broken c1, no c2
    p.temperature = null;                                              // non-record
    const params = readContractParameters(validateContract(doc)!)!;
    expect(params.aroma).toBeUndefined();
    expect(params.portion_ml).toBeUndefined();
    expect(params.temperature).toBeUndefined();
    expect(params.process).toEqual(MELITTA_PARAMETERS.process);
  });

  it("accepts a flat (non-per_component) range descriptor", () => {
    const doc = melittaV2();
    (doc.parameters as Record<string, unknown>).grind_level =
      { kind: "range", scope: ["freestyle"], min: 1, max: 5, step: 1 };
    const params = readContractParameters(validateContract(doc)!)!;
    expect(params.grind_level).toEqual(
      { kind: "range", scope: ["freestyle"], min: 1, max: 5, step: 1 });
  });

  it("keeps a descriptor with an UNKNOWN scope (scope filtering is a rendering decision)", () => {
    const doc = melittaV2();
    (doc.parameters as Record<string, unknown>).intensity =
      { kind: "enum", scope: ["holo_deck"], tokens: ["mild"] };
    const params = readContractParameters(validateContract(doc)!)!;
    expect(params.intensity).toEqual({ kind: "enum", scope: ["holo_deck"], tokens: ["mild"] });
  });

  it("normalizes a missing/malformed scope to []", () => {
    const doc = melittaV2();
    (doc.parameters as Record<string, unknown>).intensity =
      { kind: "enum", tokens: ["mild"] };
    const params = readContractParameters(validateContract(doc)!)!;
    expect(params.intensity.scope).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// readContractActions — presence detection + unknown-invocation-kind dropping
// (§6.0.3/§6.2.1) + fail-open normalization (§6.2.4)
// ---------------------------------------------------------------------------

describe("readContractActions", () => {
  it("knows exactly the §6.2.1 invocation kinds", () => {
    expect(KNOWN_INVOCATION_KINDS).toEqual(["button", "service"]);
  });

  it("returns null when actions is absent (0.91 server → legacy action arrays)", () => {
    const c = validateContract(clone(MELITTA_V1))!;
    expect(readContractActions(c)).toBeNull();
  });

  it("returns null when actions is not an array (malformed v2 block)", () => {
    const doc = melittaV2();
    doc.actions = 42;
    expect(readContractActions(validateContract(doc)!)).toBeNull();
  });

  it("parses the catalog slice in serve order, fields intact", () => {
    const actions = readContractActions(validateContract(melittaV2())!)!;
    expect(actions.map((a) => a.action)).toEqual([
      "brew", "brew_freestyle", "easy_clean", "switch_off", "factory_reset_settings",
    ]);
    expect(actions).toEqual(MELITTA_ACTIONS);
  });

  it("service-kind entries keep service, entity_suffix, and params (§6.2.1 anchor rule)", () => {
    const actions = readContractActions(validateContract(melittaV2())!)!;
    const freestyle = actions.find((a) => a.action === "brew_freestyle")!;
    expect(freestyle.invocation).toEqual({
      kind: "service", service: "brew_freestyle", entity_suffix: "brew",
      params: [{ name: "params", kind: "params_ref", ref: "freestyle", required: true }],
    });
  });

  it("encodes the switch_off connected-only precedent as data (§6.2.2)", () => {
    const actions = readContractActions(validateContract(melittaV2())!)!;
    const off = actions.find((a) => a.action === "switch_off")!;
    expect(off.requires).toEqual(["connected"]);
    expect(off.group).toBe("power");
  });

  it("keeps destructive + available:false entries (hiding is the resolver's job)", () => {
    const actions = readContractActions(validateContract(melittaV2())!)!;
    const reset = actions.find((a) => a.action === "factory_reset_settings")!;
    expect(reset.destructive).toBe(true);
    expect(reset.available).toBe(false);
    expect(reset.confirm).toBe(true);
  });

  it("drops an entry with an unknown invocation.kind, keeping the rest (§6.0.3)", () => {
    const doc = melittaV2();
    (doc.actions as unknown[]).push({
      action: "teleport_coffee", group: "brew", process: null, confirm: false,
      requires: [], available: true, invocation: { kind: "quantum", warp: 9 },
    });
    const actions = readContractActions(validateContract(doc)!)!;
    expect(actions.map((a) => a.action)).not.toContain("teleport_coffee");
    expect(actions).toHaveLength(5);
  });

  it("drops structurally broken entries (missing suffix/service/params, no action token)", () => {
    const doc = melittaV2();
    doc.actions = [
      { action: "a", group: "g", process: null, confirm: false, requires: [],
        available: true, invocation: { kind: "button" } },                    // no suffix
      { action: "b", group: "g", process: null, confirm: false, requires: [],
        available: true, invocation: { kind: "service", service: "s" } },     // no suffix/params
      { action: "", group: "g", process: null, confirm: false, requires: [],
        available: true, invocation: { kind: "button", entity_suffix: "x" } }, // empty token
      "garbage",                                                               // non-record
      { action: "ok", group: "g", process: null, confirm: false, requires: [],
        available: true, invocation: { kind: "button", entity_suffix: "ok" } },
    ];
    const actions = readContractActions(validateContract(doc)!)!;
    expect(actions.map((a) => a.action)).toEqual(["ok"]);
  });

  it("normalizes advisory fields fail-open (§6.2.4: styling gate, never correctness)", () => {
    const doc = melittaV2();
    doc.actions = [{
      action: "mystery", invocation: { kind: "button", entity_suffix: "mystery" },
      requires: "not-an-array", destructive: "yes",
    }];
    const [entry] = readContractActions(validateContract(doc)!)!;
    expect(entry.group).toBe("");
    expect(entry.process).toBeNull();
    expect(entry.confirm).toBe(false);
    expect(entry.requires).toEqual([]);
    expect(entry.available).toBe(true);
    expect(entry.destructive).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Type-level smoke: v2 types narrow and compose as intended
// ---------------------------------------------------------------------------

describe("v2 types", () => {
  it("ActionInvocation narrows by kind; descriptors type-check through UiContract", () => {
    const c: UiContract = validateContract(melittaV2())!;
    const entries: ActionEntry[] = readContractActions(c)!;
    for (const entry of entries) {
      if (entry.invocation.kind === "service") {
        expect(typeof entry.invocation.service).toBe("string");
        expect(Array.isArray(entry.invocation.params)).toBe(true);
      } else {
        expect(typeof entry.invocation.entity_suffix).toBe("string");
      }
    }
    const desc: ParameterDescriptor = c.parameters!.portion_ml;
    expect(desc.per_component).toBe(true);
    expect(desc.unit).toBe("ml");
  });
});
