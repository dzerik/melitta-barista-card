// Zone C-J: pure settings-catalog logic (spec §9.1, 0.93 amendment) —
// three-tier resolution (§5.3.6: contract.settings → legacy SWITCH_KEYS/
// NUMBER_KEYS + entity existence → hidden), the §9.1.6 entity-absence rule
// inside tier 1, level/option label chains (§9.1.4 incl. the `_levels`
// shared tier), and unknown control/group tolerance. Rendering itself is
// verified by the §10.4 live checklist (no DOM harness exists).
import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_SETTING_ICON,
  KNOWN_SETTING_CONTROLS,
  KNOWN_SETTING_GROUP_ORDER,
  numberBounds,
  numberValueLabel,
  resolveSettings,
  settingDescription,
  settingGroupLabel,
  settingIcon,
  settingLabel,
  settingLevelLabel,
  settingOptionLabel,
  type ResolvedSettings,
} from "../src/settings-catalog";
import {
  readContractSettings,
  validateContract,
  type SettingEntry,
  type UiContract,
} from "../src/contract";
import { resetServerStrings, setServerStrings } from "../src/server-i18n";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Minimal structurally-valid v1 document (validateContract-passing base). */
const BASE_DOC = {
  schema_version: 1,
  contract_version: 1,
  contract_fingerprint: "9f3ac1d24b07",
  entry_id: "a1b2c3d4e5f6",
  generated_at: "2026-09-02T10:15:00Z",
  source: "live",
  machine: {
    brand: "melitta", brand_name: "Melitta", model_name: "Barista TS Smart",
    family_key: "barista_ts", machine_type: "BARISTA_TS", connected: true,
  },
  capabilities: {
    supports_recipe_writes: true, supports_stats: true, supports_factory_reset: false,
    supports_brew_overrides: false, supports_freestyle: true, my_coffee_slots: 8,
    strength_levels: 5, has_aroma_balance: true, hopper_count: 2,
    has_milk_system: true, tolerated_brew_manipulations: [],
  },
  vocabularies: {
    status: { process: ["READY"], sub_process: [], manipulation: ["NONE"], info_message: [] },
    freestyle: {
      process: ["COFFEE"], intensity: ["mild"], aroma: ["standard"],
      temperature: ["normal"], shots: ["one"], blend: ["hopper1"],
    },
  },
  limits: {
    portion_ml: { c1: { min: 25, max: 220, step: 5 }, c2: { min: 25, max: 220, step: 5 } },
  },
  recipes: [],
  status_attribute_entity: "sensor.machine_state",
  bridge_attribute_entity: "sensor.machine_connection",
};

/** §9.1.5 Melitta-style entries (abbreviated) plus a Nivona-style select. */
const SETTINGS_BLOCK: unknown[] = [
  {
    setting: "auto_bean_select", control: "switch", group: "brew",
    icon: "mdi:grain",
    entity: { domain: "switch", entity_suffix: "auto_bean_select" },
    writable: true,
  },
  {
    setting: "brew_temperature", control: "number", group: "brew",
    icon: "mdi:thermometer",
    entity: { domain: "number", entity_suffix: "brew_temperature" },
    writable: true, min: 0, max: 2, step: 1, display: "slider",
    levels: [
      { value: 0, token: "low" }, { value: 1, token: "normal" }, { value: 2, token: "high" },
    ],
  },
  {
    setting: "water_hardness", control: "number", group: "water",
    icon: "mdi:water-opacity",
    entity: { domain: "number", entity_suffix: "water_hardness" },
    writable: true, min: 1, max: 4, step: 1, display: "slider",
    levels: [
      { value: 1, token: "soft" }, { value: 2, token: "medium" },
      { value: 3, token: "hard" }, { value: 4, token: "very_hard" },
    ],
  },
  {
    setting: "auto_off_after", control: "number", group: "power",
    icon: "mdi:timer-off-outline",
    entity: { domain: "number", entity_suffix: "auto_off_after" },
    writable: true, min: 15, max: 240, step: 15, unit: "min", display: "box",
  },
  {
    setting: "off_rinse", control: "select", group: "water",
    icon: "mdi:tune",
    entity: { domain: "select", entity_suffix: "off_rinse" },
    writable: true,
    options: [
      { value: 0, token: "off", label: "off" },
      { value: 1, token: "on", label: "on" },
    ],
  },
];

function doc(settings?: unknown): UiContract {
  const raw: Record<string, unknown> = { ...BASE_DOC };
  if (settings !== undefined) raw.settings = settings;
  const contract = validateContract(raw);
  if (!contract) throw new Error("fixture must validate");
  return contract;
}

const allExist = () => true;
const noneExist = () => false;

function contractGroups(resolved: ResolvedSettings) {
  if (resolved.mode !== "contract") throw new Error(`expected contract mode, got ${resolved.mode}`);
  return resolved.groups;
}

afterEach(() => resetServerStrings());

// ---------------------------------------------------------------------------
// validateContract — v3 fields must never be required (binding precedent)
// ---------------------------------------------------------------------------

describe("validateContract v3 additivity", () => {
  it("passes a document without any v3 field", () => {
    expect(validateContract({ ...BASE_DOC })).not.toBeNull();
  });

  it("passes a document with settings and directkey, preserving them", () => {
    const contract = validateContract({
      ...BASE_DOC,
      settings: SETTINGS_BLOCK,
      directkey: { categories: [], profiles: [], profile_select_entity_suffix: "profile", active_profile_attribute: "active_profile" },
    });
    expect(contract).not.toBeNull();
    expect(contract?.settings).toHaveLength(SETTINGS_BLOCK.length);
    expect((contract?.directkey as Record<string, unknown>).profile_select_entity_suffix).toBe("profile");
  });

  it("passes a document with a malformed settings field (degradation is per-feature)", () => {
    expect(validateContract({ ...BASE_DOC, settings: "garbage" })).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// readContractSettings — normalization / malformed-entry dropping
// ---------------------------------------------------------------------------

describe("readContractSettings", () => {
  it("returns null when the field is absent (0.92 server)", () => {
    expect(readContractSettings(doc())).toBeNull();
  });

  it("returns null when the field is not an array", () => {
    expect(readContractSettings(doc({ nope: true }))).toBeNull();
  });

  it("keeps well-formed entries in served order", () => {
    const entries = readContractSettings(doc(SETTINGS_BLOCK));
    expect(entries?.map((e) => e.setting)).toEqual([
      "auto_bean_select", "brew_temperature", "water_hardness", "auto_off_after", "off_rinse",
    ]);
  });

  it("drops entries without a usable setting/control/entity binding", () => {
    const entries = readContractSettings(doc([
      { control: "switch", entity: { domain: "switch", entity_suffix: "x" }, writable: true },
      { setting: "a", entity: { domain: "switch", entity_suffix: "x" }, writable: true },
      { setting: "b", control: "switch", writable: true },
      { setting: "c", control: "switch", entity: { domain: "switch" }, writable: true },
      { setting: "d", control: "switch", entity: { domain: "switch", entity_suffix: "d" }, writable: true },
      "not-a-record",
    ]));
    expect(entries?.map((e) => e.setting)).toEqual(["d"]);
  });

  it("normalizes writable fail-closed and missing group to empty string", () => {
    const entries = readContractSettings(doc([
      { setting: "a", control: "switch", entity: { domain: "switch", entity_suffix: "a" } },
    ]));
    expect(entries?.[0].writable).toBe(false);
    expect(entries?.[0].group).toBe("");
  });

  it("filters malformed levels/options items and strips malformed scalars", () => {
    const entries = readContractSettings(doc([
      {
        setting: "a", control: "number", group: "brew",
        entity: { domain: "number", entity_suffix: "a" }, writable: true,
        min: "nope", unit: 5, icon: 7,
        levels: [{ value: 1, token: "soft" }, { value: "x", token: "bad" }, "junk"],
      },
      {
        setting: "b", control: "select", group: "water",
        entity: { domain: "select", entity_suffix: "b" }, writable: true,
        options: [
          { value: 0, token: "off", label: "off" },
          { value: 1, label: "on" },            // missing token → null
          { value: "x", label: "bad" },          // malformed → dropped
          { value: 2, token: null },             // no label → dropped
        ],
      },
    ]));
    const a = entries?.[0] as SettingEntry;
    expect(a.levels).toEqual([{ value: 1, token: "soft" }]);
    expect(a.min).toBeUndefined();
    expect(a.unit).toBeUndefined();
    expect(a.icon).toBeUndefined();
    const b = entries?.[1] as SettingEntry;
    expect(b.options).toEqual([
      { value: 0, token: "off", label: "off" },
      { value: 1, token: null, label: "on" },
    ]);
  });

  it("passes unknown control and group tokens through (open sets)", () => {
    const entries = readContractSettings(doc([
      {
        setting: "a", control: "hologram", group: "future",
        entity: { domain: "select", entity_suffix: "a" }, writable: true,
      },
    ]));
    expect(entries?.[0].control).toBe("hologram");
    expect(entries?.[0].group).toBe("future");
  });
});

// ---------------------------------------------------------------------------
// resolveSettings — the §5.3.6 three tiers
// ---------------------------------------------------------------------------

describe("resolveSettings tier fallback", () => {
  it("tier 2: no contract → legacy keys filtered by entity existence", () => {
    const resolved = resolveSettings(null, (domain, suffix) =>
      domain === "switch" ? suffix === "energy_saving" : suffix === "water_hardness");
    expect(resolved).toEqual({
      mode: "legacy", switches: ["energy_saving"], numbers: ["water_hardness"],
    });
  });

  it("tier 2: contract without settings block → legacy", () => {
    const resolved = resolveSettings(doc(), allExist);
    expect(resolved.mode).toBe("legacy");
    if (resolved.mode === "legacy") {
      expect(resolved.switches).toEqual(["energy_saving", "auto_bean_select", "rinsing_disabled"]);
      expect(resolved.numbers).toEqual(["water_hardness", "auto_off_after", "brew_temperature"]);
    }
  });

  it("tier 2: malformed settings field → legacy (per-feature degradation)", () => {
    expect(resolveSettings(doc("garbage"), allExist).mode).toBe("legacy");
  });

  it("tier 3: no contract and no entities → hidden", () => {
    expect(resolveSettings(null, noneExist)).toEqual({ mode: "hidden" });
  });

  it("tier 1: settings block present → contract mode, grouped in §9.1.3 order", () => {
    const groups = contractGroups(resolveSettings(doc(SETTINGS_BLOCK), allExist));
    expect(groups.map((g) => g.group)).toEqual(["brew", "water", "power"]);
    expect(groups[0].entries.map((e) => e.setting)).toEqual(["auto_bean_select", "brew_temperature"]);
    expect(groups[1].entries.map((e) => e.setting)).toEqual(["water_hardness", "off_rinse"]);
    expect(groups[2].entries.map((e) => e.setting)).toEqual(["auto_off_after"]);
  });

  it("tier 1: an empty settings array is contract mode with nothing to show, NOT legacy", () => {
    const resolved = resolveSettings(doc([]), allExist);
    expect(resolved).toEqual({ mode: "contract", groups: [] });
  });

  it("tier 1: unknown groups render after known ones, in served order", () => {
    const block = [
      { setting: "z", control: "switch", group: "quantum",
        entity: { domain: "switch", entity_suffix: "z" }, writable: true },
      { setting: "a", control: "switch", group: "power",
        entity: { domain: "switch", entity_suffix: "a" }, writable: true },
      { setting: "y", control: "switch", group: "aux",
        entity: { domain: "switch", entity_suffix: "y" }, writable: true },
    ];
    const groups = contractGroups(resolveSettings(doc(block), allExist));
    expect(groups.map((g) => g.group)).toEqual(["power", "quantum", "aux"]);
  });

  it("tier 1: unknown control kinds are skipped per entry, never break the block", () => {
    const block = [
      { setting: "a", control: "hologram", group: "brew",
        entity: { domain: "switch", entity_suffix: "a" }, writable: true },
      { setting: "b", control: "switch", group: "brew",
        entity: { domain: "switch", entity_suffix: "b" }, writable: true },
    ];
    const groups = contractGroups(resolveSettings(doc(block), allExist));
    expect(groups).toHaveLength(1);
    expect(groups[0].entries.map((e) => e.setting)).toEqual(["b"]);
  });

  it("tier 1: a select without renderable options is skipped", () => {
    const block = [
      { setting: "a", control: "select", group: "water",
        entity: { domain: "select", entity_suffix: "a" }, writable: true, options: [] },
    ];
    expect(contractGroups(resolveSettings(doc(block), allExist))).toEqual([]);
  });

  it("§9.1.6 rule 2: entity absence hides the entry inside tier 1 — no legacy fallback", () => {
    const resolved = resolveSettings(doc(SETTINGS_BLOCK), (domain, suffix) =>
      suffix !== "auto_bean_select");
    const groups = contractGroups(resolved);
    expect(groups[0].entries.map((e) => e.setting)).toEqual(["brew_temperature"]);
  });

  it("§9.1.6 rule 2: every entity absent → contract mode with empty groups (section hidden)", () => {
    expect(resolveSettings(doc(SETTINGS_BLOCK), noneExist)).toEqual({ mode: "contract", groups: [] });
  });
});

// ---------------------------------------------------------------------------
// Display resolution — §9.1.4 chains incl. the `_levels` shared tier
// ---------------------------------------------------------------------------

describe("settingLabel / settingDescription / settingGroupLabel", () => {
  it("prefers the server settings.<setting>.label key", () => {
    setServerStrings({ "settings.energy_saving.label": "Energiesparen" });
    expect(settingLabel("energy_saving")).toBe("Energiesparen");
  });

  it("falls back to the card bundle legacy keys (switch and number keyspaces)", () => {
    expect(settingLabel("energy_saving")).toBe("Energy Saving");
    expect(settingLabel("water_hardness")).toBe("Water Hardness");
  });

  it("humanizes an unknown token as the last resort", () => {
    expect(settingLabel("milk_products_active")).toBe("Milk products active");
  });

  it("description: server → bundle → null", () => {
    setServerStrings({ "settings.temperature.description": "Brühtemperatur" });
    expect(settingDescription("temperature")).toBe("Brühtemperatur");
    setServerStrings(null);
    expect(settingDescription("energy_saving")).toBe("Reduce power when idle");
    expect(settingDescription("temperature")).toBeNull();
  });

  it("group label: server settings._groups key → humanized token", () => {
    setServerStrings({ "settings._groups.water": "Wasser" });
    expect(settingGroupLabel("water")).toBe("Wasser");
    expect(settingGroupLabel("power")).toBe("Power");
    expect(settingGroupLabel("quantum")).toBe("Quantum");
  });
});

describe("settingLevelLabel chain", () => {
  it("prefers the per-setting server key", () => {
    setServerStrings({
      "settings.water_hardness.levels.soft": "Weich",
      "settings._levels.soft": "WRONG-TIER",
    });
    expect(settingLevelLabel("water_hardness", "soft", 1)).toBe("Weich");
  });

  it("falls back to the shared settings._levels tier", () => {
    setServerStrings({ "settings._levels.on": "An" });
    expect(settingLevelLabel("filter", "on", 1)).toBe("An");
  });

  it("falls back to the numeric-keyed card bundle by wire value", () => {
    expect(settingLevelLabel("water_hardness", "soft", 1)).toBe("Soft");
    expect(settingLevelLabel("brew_temperature", "low", 0)).toBe("Low");
  });

  it("humanizes the token as the last resort", () => {
    expect(settingLevelLabel("filter", "very_hard", 9)).toBe("Very hard");
    expect(settingLevelLabel("filter", "on")).toBe("On");
  });
});

describe("settingOptionLabel", () => {
  it("token null → served label verbatim, never humanized", () => {
    expect(settingOptionLabel("auto_off", { value: 9, token: null, label: "off" })).toBe("off");
  });

  it("tokenized option resolves per-setting server key, then the shared tier", () => {
    setServerStrings({ "settings._levels.off": "Aus" });
    expect(settingOptionLabel("off_rinse", { value: 0, token: "off", label: "off" })).toBe("Aus");
    setServerStrings({ "settings.off_rinse.levels.off": "Spülen aus" });
    expect(settingOptionLabel("off_rinse", { value: 0, token: "off", label: "off" })).toBe("Spülen aus");
  });

  it("tokenized option falls back to the numeric bundle key, then the served label", () => {
    expect(settingOptionLabel("water_hardness", { value: 1, token: "soft", label: "soft" })).toBe("Soft");
    expect(settingOptionLabel("off_rinse", { value: 1, token: "on", label: "an" })).toBe("an");
  });
});

describe("settingIcon", () => {
  const entry = (icon?: unknown): SettingEntry => ({
    setting: "x", control: "switch", group: "brew",
    entity: { domain: "switch", entity_suffix: "x" }, writable: true,
    ...(icon === undefined ? {} : { icon: icon as string }),
  });

  it("keeps a well-formed mdi identifier", () => {
    expect(settingIcon(entry("mdi:water-opacity"))).toBe("mdi:water-opacity");
  });

  it("absent or malformed → mdi:tune (§9.1.1)", () => {
    expect(DEFAULT_SETTING_ICON).toBe("mdi:tune");
    expect(settingIcon(entry())).toBe("mdi:tune");
    expect(settingIcon(entry("javascript:alert(1)"))).toBe("mdi:tune");
    expect(settingIcon(entry("mdi:Bad_Name"))).toBe("mdi:tune");
  });
});

describe("numberBounds / numberValueLabel", () => {
  const entry: SettingEntry = {
    setting: "auto_off_after", control: "number", group: "power",
    entity: { domain: "number", entity_suffix: "auto_off_after" },
    writable: true, min: 15, max: 240, step: 15, unit: "min", display: "box",
  };

  it("uses contract bounds before the entity loads", () => {
    expect(numberBounds(entry, null)).toEqual({ min: 15, max: 240, step: 15 });
  });

  it("live entity attributes are authoritative for the current instant (§9.1.6.5)", () => {
    expect(numberBounds(entry, { min: 30, max: 120, step: 30 }))
      .toEqual({ min: 30, max: 120, step: 30 });
    expect(numberBounds(entry, { min: "x", step: 5 }))
      .toEqual({ min: 15, max: 240, step: 5 });
  });

  it("level entries display the level-token label for the current value", () => {
    const leveled: SettingEntry = {
      ...entry, setting: "water_hardness", unit: undefined,
      levels: [{ value: 1, token: "soft" }, { value: 2, token: "medium" }],
    };
    expect(numberValueLabel(leveled, 2)).toBe("Medium");
    expect(numberValueLabel(leveled, 7)).toBe("7"); // value outside the ladder → raw
  });

  it("unit entries display value + unit; plain entries the raw value", () => {
    expect(numberValueLabel(entry, 30)).toBe("30 min");
    expect(numberValueLabel({ ...entry, unit: "h" }, 2)).toBe("2 h");
    expect(numberValueLabel({ ...entry, unit: undefined }, 3)).toBe("3");
  });
});

// ---------------------------------------------------------------------------
// Constants pinned (renderer + wiring rely on these exact sets)
// ---------------------------------------------------------------------------

describe("catalog constants", () => {
  it("known group order is the §9.1.3 order", () => {
    expect(KNOWN_SETTING_GROUP_ORDER).toEqual(["brew", "water", "power", "system"]);
  });

  it("known controls are the §9.1.1 kinds", () => {
    expect(KNOWN_SETTING_CONTROLS).toEqual(["switch", "number", "select"]);
  });
});
