import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  SUPPORTED_CONTRACT_VERSIONS,
  readBridgeAttrs,
  readStatusTokens,
  validateContract,
  fetchUiContract,
  noteBridgeUpdate,
  _resetContractClientState,
  type BridgeAttrs,
  type UiContract,
} from "../src/contract";

// ---------------------------------------------------------------------------
// Fixtures: UI Contract spec §3.7 and §3.8 example payloads, VERBATIM.
// ---------------------------------------------------------------------------

/** Spec §3.7 — Melitta Barista TS Smart. */
const MELITTA_CONTRACT = {
  "schema_version": 1,
  "contract_version": 1,
  "contract_fingerprint": "9f3ac1d24b07",
  "entry_id": "a1b2c3d4e5f6",
  "generated_at": "2026-09-02T10:15:00Z",
  "source": "live",
  "machine": {
    "brand": "melitta",
    "brand_name": "Melitta",
    "model_name": "Barista TS Smart",
    "family_key": "barista_ts",
    "machine_type": "BARISTA_TS",
    "connected": true
  },
  "brand_theme": {
    "brand": "melitta",
    "wordmark": "MELITTA",
    "accent": "#c8102e",
    "accent_soft": "#f6e3e6",
    "logo_url": null
  },
  "capabilities": {
    "supports_recipe_writes": true,
    "supports_stats": true,
    "supports_factory_reset": false,
    "supports_brew_overrides": false,
    "supports_freestyle": true,
    "my_coffee_slots": 8,
    "strength_levels": 5,
    "has_aroma_balance": true,
    "hopper_count": 2,
    "has_milk_system": true,
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
      "intensity": ["very_mild", "mild", "normal", "strong", "very_strong"],
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
      "recipe_id": 200,
      "name": "Espresso",
      "category": "espresso",
      "components": {
        "c1": { "process": "coffee", "intensity": "strong", "aroma": "standard",
                "temperature": "normal", "shots": "one", "portion_ml": 40,
                "blend": "hopper_1" },
        "c2": null
      },
      "icon": {
        "spec_version": 1,
        "glass": "espresso_cup",
        "total_ml": 40,
        "fill_level": 0.67,
        "layers": [
          { "role": "coffee", "ml": 40, "fraction": 1.0, "intensity": 0.68, "crema": true }
        ],
        "foam": null,
        "steam": true
      }
    },
    {
      "recipe_id": 214,
      "name": "Latte Macchiato",
      "category": "milk_drink",
      "components": {
        "c1": { "process": "milk", "intensity": "normal", "aroma": "standard",
                "temperature": "normal", "shots": "none", "portion_ml": 160,
                "blend": "hopper_1" },
        "c2": { "process": "coffee", "intensity": "strong", "aroma": "standard",
                "temperature": "normal", "shots": "one", "portion_ml": 40,
                "blend": "hopper_1" }
      },
      "icon": {
        "spec_version": 1,
        "glass": "tall_glass",
        "total_ml": 200,
        "fill_level": 0.63,
        "layers": [
          { "role": "milk", "ml": 130, "fraction": 0.65, "intensity": 0.0 },
          { "role": "coffee", "ml": 40, "fraction": 0.20, "intensity": 0.68 }
        ],
        "foam": { "role": "milk_foam", "ml": 30, "fraction": 0.15 },
        "steam": true
      }
    }
  ],
  "status_attribute_entity": "state",
  "bridge_attribute_entity": "connection"
};

/** Spec §3.8 — Nivona 700 family, NICR 769. */
const NIVONA_CONTRACT = {
  "schema_version": 1,
  "contract_version": 1,
  "contract_fingerprint": "41c09be77a20",
  "entry_id": "f6e5d4c3b2a1",
  "generated_at": "2026-09-02T10:15:00Z",
  "source": "live",
  "machine": {
    "brand": "nivona",
    "brand_name": "Nivona",
    "model_name": "NICR 769",
    "family_key": "700",
    "machine_type": null,
    "connected": true
  },
  "brand_theme": {
    "brand": "nivona",
    "wordmark": "NIVONA",
    "accent": "#00646b",
    "accent_soft": "#e0eeef",
    "logo_url": "/local/melitta_barista/nivona.png"
  },
  "capabilities": {
    "supports_recipe_writes": false,
    "supports_stats": true,
    "supports_factory_reset": true,
    "supports_brew_overrides": true,
    "supports_freestyle": false,
    "my_coffee_slots": 4,
    "strength_levels": 3,
    "has_aroma_balance": true,
    "hopper_count": 1,
    "has_milk_system": true,
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
      "intensity": ["mild", "normal", "strong"],
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
      "recipe_id": 1,
      "name": "Espresso",
      "category": "espresso",
      "icon": {
        "spec_version": 1,
        "glass": "espresso_cup",
        "total_ml": 40,
        "fill_level": 0.67,
        "layers": [
          { "role": "coffee", "ml": 40, "fraction": 1.0, "intensity": 0.68, "crema": true }
        ],
        "foam": null,
        "steam": true
      }
    },
    {
      "recipe_id": 4,
      "name": "Cappuccino",
      "category": "milk_drink",
      "icon": {
        "spec_version": 1,
        "glass": "cup",
        "total_ml": 180,
        "fill_level": 0.82,
        "layers": [
          { "role": "coffee", "ml": 40, "fraction": 0.22, "intensity": 0.68 },
          { "role": "milk", "ml": 110, "fraction": 0.61, "intensity": 0.0 }
        ],
        "foam": { "role": "milk_foam", "ml": 30, "fraction": 0.17 },
        "steam": true
      }
    }
  ],
  "status_attribute_entity": "state",
  "bridge_attribute_entity": "connection"
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BRIDGE: BridgeAttrs = {
  entry_id: "a1b2c3d4e5f6",
  contract_version: 1,
  contract_fingerprint: "9f3ac1d24b07",
  connected: true,
};

function hassWith(ws: (msg: unknown) => Promise<unknown>) {
  const fn = vi.fn(ws);
  return { hass: { callWS: fn as <T>(msg: { type: string }) => Promise<T> }, fn };
}

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  _resetContractClientState();
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

// ---------------------------------------------------------------------------
// SUPPORTED_CONTRACT_VERSIONS
// ---------------------------------------------------------------------------

describe("SUPPORTED_CONTRACT_VERSIONS", () => {
  it("supports exactly contract v1", () => {
    expect(SUPPORTED_CONTRACT_VERSIONS).toEqual([1]);
  });
});

// ---------------------------------------------------------------------------
// readBridgeAttrs — §3.4 block A + attribute-surface version gate (§5.3.3)
// ---------------------------------------------------------------------------

describe("readBridgeAttrs", () => {
  it("parses a full bridge block", () => {
    const b = readBridgeAttrs({
      entry_id: "0123abcd",
      contract_version: 1,
      contract_fingerprint: "9f3ac1d24b07",
      connected: true,
    });
    expect(b).toEqual({
      entry_id: "0123abcd",
      contract_version: 1,
      contract_fingerprint: "9f3ac1d24b07",
      connected: true,
    });
  });

  it("returns null when contract_version is absent (old integration)", () => {
    expect(readBridgeAttrs({ entry_id: "0123abcd", connected: true })).toBeNull();
  });

  it("returns null when contract_version is unsupported (future v2 server)", () => {
    expect(readBridgeAttrs({
      entry_id: "0123abcd", contract_version: 2, contract_fingerprint: "x", connected: true,
    })).toBeNull();
  });

  it("returns null on missing/empty entry_id or non-object attrs", () => {
    expect(readBridgeAttrs({ contract_version: 1, connected: true })).toBeNull();
    expect(readBridgeAttrs({ entry_id: "", contract_version: 1 })).toBeNull();
    expect(readBridgeAttrs(null)).toBeNull();
    expect(readBridgeAttrs(undefined)).toBeNull();
    expect(readBridgeAttrs("garbage")).toBeNull();
  });

  it("tolerates a pre-handshake entry without a fingerprint", () => {
    const b = readBridgeAttrs({ entry_id: "0123abcd", contract_version: 1, connected: false });
    expect(b).not.toBeNull();
    expect(b!.contract_fingerprint).toBeNull();
    expect(b!.connected).toBe(false);
  });

  it("coerces a non-boolean connected to false", () => {
    const b = readBridgeAttrs({ entry_id: "e", contract_version: 1, connected: "yes" });
    expect(b!.connected).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// readStatusTokens — §3.4 block B, gated by the bridge (§2.3 step 2)
// ---------------------------------------------------------------------------

describe("readStatusTokens", () => {
  const TOKEN_ATTRS = {
    process_id: 4,
    info_messages: ["FILL_BEANS_1"],
    process_token: "PRODUCT",
    sub_process_token: "GRINDING",
    manipulation_token: "NONE",
    is_brewing: true,
    awaiting_confirmation: false,
  };

  it("parses the §3.4 example block", () => {
    const t = readStatusTokens(TOKEN_ATTRS, BRIDGE);
    expect(t).toEqual({
      process_token: "PRODUCT",
      sub_process_token: "GRINDING",
      manipulation_token: "NONE",
      info_messages: ["FILL_BEANS_1"],
      is_brewing: true,
      awaiting_confirmation: false,
    });
  });

  it("returns null without a valid bridge (attribute-surface version gate)", () => {
    expect(readStatusTokens(TOKEN_ATTRS, null)).toBeNull();
  });

  it("returns null when token attributes are absent (old integration / unavailable entity)", () => {
    expect(readStatusTokens({ process_id: 4 }, BRIDGE)).toBeNull();
    expect(readStatusTokens(null, BRIDGE)).toBeNull();
    expect(readStatusTokens(undefined, BRIDGE)).toBeNull();
  });

  it("keeps a present-but-null process_token (unmapped raw code)", () => {
    const t = readStatusTokens({ ...TOKEN_ATTRS, process_token: null }, BRIDGE);
    expect(t).not.toBeNull();
    expect(t!.process_token).toBeNull();
  });

  it("passes unknown token values through untouched (§5.3.2)", () => {
    const t = readStatusTokens({
      ...TOKEN_ATTRS,
      process_token: "SOME_FUTURE_PROCESS",
      sub_process_token: "NEW_PHASE",
      manipulation_token: "NEW_MANIP",
    }, BRIDGE);
    expect(t!.process_token).toBe("SOME_FUTURE_PROCESS");
    expect(t!.sub_process_token).toBe("NEW_PHASE");
    expect(t!.manipulation_token).toBe("NEW_MANIP");
  });

  it("defaults idle/missing fields safely", () => {
    const t = readStatusTokens({ process_token: "READY" }, BRIDGE);
    expect(t).toEqual({
      process_token: "READY",
      sub_process_token: null,
      manipulation_token: null,
      info_messages: [],
      is_brewing: false,
      awaiting_confirmation: false,
    });
  });

  it("drops non-string entries from info_messages", () => {
    const t = readStatusTokens(
      { process_token: "READY", info_messages: ["EASY_CLEAN", 5, null] }, BRIDGE,
    );
    expect(t!.info_messages).toEqual(["EASY_CLEAN"]);
  });
});

// ---------------------------------------------------------------------------
// validateContract — §3.2/§3.3: structural + version only, never token values
// ---------------------------------------------------------------------------

describe("validateContract", () => {
  it("accepts the §3.7 Melitta example payload verbatim", () => {
    const c = validateContract(clone(MELITTA_CONTRACT));
    expect(c).not.toBeNull();
    expect(c!.contract_fingerprint).toBe("9f3ac1d24b07");
    expect(c!.machine.brand).toBe("melitta");
    expect(c!.capabilities.hopper_count).toBe(2);
    expect(c!.vocabularies.freestyle.intensity).toHaveLength(5);
    expect(c!.limits.portion_ml.c1).toEqual({ min: 5, max: 250, step: 5 });
    expect(c!.recipes).toHaveLength(2);
    expect(c!.recipes[1].icon!.foam).toEqual({ role: "milk_foam", ml: 30, fraction: 0.15 });
    expect(c!.recipes[0].components!.c1!.blend).toBe("hopper_1");
    expect(c!.status_attribute_entity).toBe("state");
    expect(c!.bridge_attribute_entity).toBe("connection");
    expect(c!.brand_theme).toEqual({
      brand: "melitta", wordmark: "MELITTA",
      accent: "#c8102e", accent_soft: "#f6e3e6", logo_url: null,
    });
  });

  it("does NOT require brand_theme (§3.10 is additive; pre-amendment 0.91 servers)", () => {
    const c = clone(MELITTA_CONTRACT) as Record<string, unknown>;
    delete c.brand_theme;
    const validated = validateContract(c);
    expect(validated).not.toBeNull();
    expect(validated!.brand_theme).toBeUndefined();
  });

  it("accepts the §3.8 Nivona example payload verbatim (no components blocks)", () => {
    const c = validateContract(clone(NIVONA_CONTRACT));
    expect(c).not.toBeNull();
    expect(c!.machine.machine_type).toBeNull();
    expect(c!.capabilities.hopper_count).toBe(1);
    expect(c!.vocabularies.freestyle.blend).toEqual(["hopper_1"]);
    expect(c!.recipes[0].components).toBeUndefined();
    expect(c!.recipes[1].icon!.fill_level).toBe(0.82);
    expect(c!.brand_theme!.logo_url).toBe("/local/melitta_barista/nivona.png");
  });

  it("must NOT reject unknown token values or unknown fields (§3.2, §5.3.1)", () => {
    const c = clone(MELITTA_CONTRACT) as Record<string, unknown> & typeof MELITTA_CONTRACT;
    c.vocabularies.status.process.push("SOME_FUTURE_PROCESS");
    c.vocabularies.freestyle.blend.push("hopper_3");
    (c.recipes[0] as Record<string, unknown>).category = "weird_new_category";
    (c.recipes[0].icon as Record<string, unknown>).glass = "bucket";
    c.some_future_field = { nested: true };
    (c.machine as Record<string, unknown>).brand = "unheard_of_brand";
    expect(validateContract(c)).not.toBeNull();
  });

  it("rejects an unsupported contract_version", () => {
    expect(validateContract({ ...clone(MELITTA_CONTRACT), contract_version: 2 })).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), contract_version: 0 })).toBeNull();
  });

  it("rejects malformed documents", () => {
    expect(validateContract(null)).toBeNull();
    expect(validateContract(undefined)).toBeNull();
    expect(validateContract("nope")).toBeNull();
    expect(validateContract(42)).toBeNull();
    expect(validateContract({})).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), entry_id: undefined })).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), contract_fingerprint: 7 })).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), machine: "x" })).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), capabilities: null })).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), vocabularies: {} })).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), limits: {} })).toBeNull();
    expect(validateContract({ ...clone(MELITTA_CONTRACT), recipes: "not-an-array" })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fetchUiContract — §2.3: cache, failure classification, transient retry
// ---------------------------------------------------------------------------

describe("fetchUiContract", () => {
  const ENTRY = "a1b2c3d4e5f6";
  const FP = "9f3ac1d24b07";

  it("fetches, validates, and serves the session cache on repeat calls", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(MELITTA_CONTRACT)));
    const c1 = await fetchUiContract(hass, ENTRY, FP);
    expect(c1).not.toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ type: "melitta_barista/ui_contract/get", entry_id: ENTRY });

    const c2 = await fetchUiContract(hass, ENTRY, FP);
    expect(c2).toBe(c1);
    expect(fn).toHaveBeenCalledTimes(1);

    // Fingerprint omitted → latest cached document for the entry.
    const c3 = await fetchUiContract(hass, ENTRY);
    expect(c3).toBe(c1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("refetches when the fingerprint changes (fingerprint-keyed invalidation, §2.3.4)", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(MELITTA_CONTRACT)));
    await fetchUiContract(hass, ENTRY, FP);
    expect(fn).toHaveBeenCalledTimes(1);

    const updated = { ...clone(MELITTA_CONTRACT), contract_fingerprint: "deadbeef0000" };
    fn.mockImplementation(() => Promise.resolve(updated));
    const c = await fetchUiContract(hass, ENTRY, "deadbeef0000");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(c!.contract_fingerprint).toBe("deadbeef0000");
  });

  it("keeps separate caches per entry_id (multi-entry installs)", async () => {
    const { hass, fn } = hassWith((msg) => {
      const m = msg as { entry_id: string };
      return Promise.resolve(
        m.entry_id === ENTRY ? clone(MELITTA_CONTRACT) : clone(NIVONA_CONTRACT),
      );
    });
    const a = await fetchUiContract(hass, ENTRY, FP);
    const b = await fetchUiContract(hass, "f6e5d4c3b2a1", "41c09be77a20");
    expect(a!.machine.brand).toBe("melitta");
    expect(b!.machine.brand).toBe("nivona");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("classifies WS unknown command as DURABLE: no re-probing for the session", async () => {
    const { hass, fn } = hassWith(() => Promise.reject({ code: "unknown_command" }));
    expect(await fetchUiContract(hass, ENTRY, FP)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);

    // Even a connected false→true transition must not re-probe a durable failure.
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: false });
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: true });
    expect(await fetchUiContract(hass, ENTRY, FP)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("classifies an unsupported response contract_version as DURABLE", async () => {
    const { hass, fn } = hassWith(() =>
      Promise.resolve({ ...clone(MELITTA_CONTRACT), contract_version: 2 }));
    expect(await fetchUiContract(hass, ENTRY, FP)).toBeNull();
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: false });
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: true });
    expect(await fetchUiContract(hass, ENTRY, FP)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("classifies contract_not_ready as TRANSIENT: no polling, one retry per connected transition", async () => {
    const { hass, fn } = hassWith(() => Promise.reject({ code: "contract_not_ready" }));
    expect(await fetchUiContract(hass, ENTRY)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);

    // Repeat calls without a transition do NOT hit the WS (no polling).
    expect(await fetchUiContract(hass, ENTRY)).toBeNull();
    expect(await fetchUiContract(hass, ENTRY)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);

    // connected: false alone does not arm a retry.
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: null, connected: false });
    expect(await fetchUiContract(hass, ENTRY)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);

    // false→true transition arms exactly one retry.
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: null, connected: true });
    expect(await fetchUiContract(hass, ENTRY)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(2);

    // The armed retry was consumed — bounded to one per transition.
    expect(await fetchUiContract(hass, ENTRY)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(2);

    // A later successful retry recovers fully.
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: null, connected: false });
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: true });
    fn.mockImplementation(() => Promise.resolve(clone(MELITTA_CONTRACT)));
    const c = await fetchUiContract(hass, ENTRY, FP);
    expect(c).not.toBeNull();
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("treats client_not_ready, entry_not_found and generic network errors as TRANSIENT", async () => {
    for (const err of [{ code: "client_not_ready" }, { code: "entry_not_found" }, new Error("socket closed")]) {
      _resetContractClientState();
      const { hass, fn } = hassWith(() => Promise.reject(err));
      expect(await fetchUiContract(hass, ENTRY)).toBeNull();
      expect(await fetchUiContract(hass, ENTRY)).toBeNull();
      expect(fn).toHaveBeenCalledTimes(1);
      noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: null, connected: false });
      noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: null, connected: true });
      fn.mockImplementation(() => Promise.resolve(clone(MELITTA_CONTRACT)));
      expect(await fetchUiContract(hass, ENTRY)).not.toBeNull();
    }
  });

  it("arms a retry when the fingerprint first appears or changes (§2.3.5)", async () => {
    const { hass, fn } = hassWith(() => Promise.reject({ code: "contract_not_ready" }));
    expect(await fetchUiContract(hass, ENTRY)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);

    // Fingerprint appears for the first time → one retry armed, no transition needed.
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: true });
    fn.mockImplementation(() => Promise.resolve(clone(MELITTA_CONTRACT)));
    expect(await fetchUiContract(hass, ENTRY, FP)).not.toBeNull();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("returns null on a malformed response without caching it", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve({ garbage: true }));
    expect(await fetchUiContract(hass, ENTRY, FP)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
    // Nothing cached; next armed attempt refetches.
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: false });
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: FP, connected: true });
    fn.mockImplementation(() => Promise.resolve(clone(MELITTA_CONTRACT)));
    expect(await fetchUiContract(hass, ENTRY, FP)).not.toBeNull();
  });

  it("warns on console exactly once per entry", async () => {
    const { hass } = hassWith(() => Promise.reject({ code: "contract_not_ready" }));
    await fetchUiContract(hass, ENTRY);
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: null, connected: false });
    noteBridgeUpdate({ entry_id: ENTRY, contract_version: 1, contract_fingerprint: null, connected: true });
    await fetchUiContract(hass, ENTRY);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("legacy compatibility: a rejected fetch never throws", async () => {
    const { hass } = hassWith(() => Promise.reject(new Error("boom")));
    await expect(fetchUiContract(hass, ENTRY)).resolves.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Type-level smoke: the fixtures satisfy the exported UiContract type
// ---------------------------------------------------------------------------

describe("types", () => {
  it("the validated document is usable through the UiContract type", () => {
    const c: UiContract | null = validateContract(clone(MELITTA_CONTRACT));
    const espresso = c!.recipes.find((r) => r.recipe_id === 200)!;
    expect(espresso.icon!.layers[0].crema).toBe(true);
    expect(espresso.icon!.steam).toBe(true);
    expect(espresso.components!.c2).toBeNull();
  });
});
