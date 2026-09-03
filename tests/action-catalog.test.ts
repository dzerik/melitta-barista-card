// Zone C-G: pure action-catalog logic (spec §6.2, 0.92 amendment) —
// resolution/ordering/fallback, `requires` evaluation, confirm/destructive
// policy, invocation planning, and display resolution. Rendering itself is
// verified by the §8.3 live checklist (no DOM harness exists).
import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_ACTION_ICON,
  INFORMATIONAL_GROUPS,
  KNOWN_GROUP_ORDER,
  actionDescription,
  actionGroupLabel,
  actionIcon,
  actionLabel,
  evalRequires,
  humanizeToken,
  isDestructive,
  maintenanceActionGroups,
  needsConfirm,
  planActionInvocation,
  resolveActionCatalog,
  type ActionGroup,
  type RequiresContext,
} from "../src/action-catalog";
import { validateContract, type ActionEntry, type StatusTokens, type UiContract } from "../src/contract";
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
      process: ["none", "coffee", "milk", "water"],
      intensity: ["very_mild", "mild", "medium", "strong", "very_strong"],
      aroma: ["standard", "intense"], temperature: ["cold", "normal", "high"],
      shots: ["none", "one", "two", "three"], blend: ["hopper_1", "hopper_2"],
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

function docWith(fields: Record<string, unknown>): UiContract {
  return { ...BASE_DOC, ...fields } as unknown as UiContract;
}

const button = (entity_suffix: string) => ({ kind: "button", entity_suffix });

/** Spec §6.2.2 — the full 16-entry Melitta catalog, pinned shape-for-shape. */
const MELITTA_ACTIONS = [
  { action: "brew", group: "brew", process: "PRODUCT", icon: "mdi:coffee",
    confirm: false, requires: ["ready"], available: true, invocation: button("brew") },
  { action: "brew_freestyle", group: "brew", process: "PRODUCT", icon: "mdi:coffee-maker",
    confirm: false, requires: ["ready"], available: true,
    invocation: { kind: "service", service: "brew_freestyle", entity_suffix: "brew",
      params: [{ name: "params", kind: "params_ref", ref: "freestyle", required: true }] } },
  { action: "brew_directkey", group: "brew", process: "PRODUCT", icon: "mdi:gesture-tap-button",
    confirm: false, requires: ["ready"], available: true,
    invocation: { kind: "service", service: "brew_directkey", entity_suffix: "brew",
      params: [
        { name: "category", kind: "enum", required: true,
          tokens: ["espresso", "cafe_creme", "cappuccino", "latte_macchiato",
                   "milk", "milk_froth", "water"] },
        { name: "two_cups", kind: "bool", default: false, required: false },
      ] } },
  { action: "cancel", group: "control", process: null, icon: "mdi:stop",
    confirm: false, requires: ["connected"], available: true, invocation: button("cancel") },
  { action: "confirm_prompt", group: "control", process: null, icon: "mdi:check-circle",
    confirm: false, requires: ["awaiting_confirmation"], available: true,
    invocation: button("confirm_prompt") },
  { action: "reset_recipe", group: "control", process: null, icon: "mdi:restore",
    confirm: true, requires: ["ready"], available: true,
    invocation: { kind: "service", service: "reset_recipe", entity_suffix: "brew",
      params: [{ name: "recipe_id", kind: "int", ranges: [[200, 223], [302, 388]],
                 required: false }] } },
  { action: "easy_clean", group: "cleaning", process: "EASY_CLEAN", icon: "mdi:shimmer",
    confirm: true, requires: ["ready"], available: true, invocation: button("easy_clean") },
  { action: "intensive_clean", group: "cleaning", process: "INTENSIVE_CLEAN",
    icon: "mdi:dishwasher", confirm: true, requires: ["ready"], available: true,
    invocation: button("intensive_clean") },
  { action: "descaling", group: "cleaning", process: "DESCALING", icon: "mdi:water-sync",
    confirm: true, requires: ["ready"], available: true, invocation: button("descaling") },
  { action: "filter_insert", group: "filter", process: "FILTER_INSERT",
    icon: "mdi:filter-plus", confirm: false, requires: ["ready"], available: true,
    invocation: button("filter_insert") },
  { action: "filter_replace", group: "filter", process: "FILTER_REPLACE",
    icon: "mdi:filter-cog", confirm: false, requires: ["ready"], available: true,
    invocation: button("filter_replace") },
  { action: "filter_remove", group: "filter", process: "FILTER_REMOVE",
    icon: "mdi:filter-remove", confirm: false, requires: ["ready"], available: true,
    invocation: button("filter_remove") },
  { action: "evaporating", group: "power", process: "EVAPORATING",
    icon: "mdi:air-humidifier", confirm: true, requires: ["ready"], available: true,
    invocation: button("evaporating") },
  { action: "switch_off", group: "power", process: "SWITCH_OFF", icon: "mdi:power",
    confirm: true, requires: ["connected"], available: true, invocation: button("switch_off") },
  { action: "factory_reset_settings", group: "danger", process: null,
    icon: "mdi:cog-refresh", confirm: true, destructive: true, requires: ["ready"],
    available: true, invocation: button("factory_reset_settings") },
  { action: "factory_reset_recipes", group: "danger", process: null,
    icon: "mdi:book-refresh", confirm: true, destructive: true, requires: ["ready"],
    available: true, invocation: button("factory_reset_recipes") },
];

function findEntry(catalog: ActionGroup[], action: string): ActionEntry {
  for (const g of catalog) {
    const hit = g.entries.find((e) => e.action === action);
    if (hit) return hit;
  }
  throw new Error(`entry not found: ${action}`);
}

const TOKENS_READY: StatusTokens = {
  process_token: "READY", sub_process_token: null, manipulation_token: "NONE",
  info_messages: [], is_brewing: false, awaiting_confirmation: false,
};

const CTX_READY: RequiresContext = { statusTokens: TOKENS_READY, connected: true };

/** Connected but busy — the pinned switch_off scenario (PR #42 precedent). */
const CTX_CONNECTED_NOT_READY: RequiresContext = {
  statusTokens: { ...TOKENS_READY, process_token: "BUSY" },
  connected: true,
};

// ---------------------------------------------------------------------------
// resolveActionCatalog (§6.2.3/§6.2.5)
// ---------------------------------------------------------------------------

describe("resolveActionCatalog", () => {
  it("returns null for a null contract (no contract at all)", () => {
    expect(resolveActionCatalog(null)).toBeNull();
  });

  it("returns null when `actions` is absent (0.91 server) → legacy fallback", () => {
    const doc = docWith({});
    expect(validateContract(doc)).not.toBeNull(); // v1 doc without v2 fields is valid
    expect(resolveActionCatalog(doc)).toBeNull();
  });

  it("returns null when `actions` is malformed (non-array) → legacy fallback", () => {
    expect(resolveActionCatalog(docWith({ actions: "nope" }))).toBeNull();
    expect(resolveActionCatalog(docWith({ actions: { easy_clean: {} } }))).toBeNull();
  });

  it("resolves `actions: []` to an empty catalog — catalog mode, NOT legacy", () => {
    expect(resolveActionCatalog(docWith({ actions: [] }))).toEqual([]);
  });

  it("groups the full §6.2.2 Melitta catalog in the normative order", () => {
    const catalog = resolveActionCatalog(docWith({ actions: MELITTA_ACTIONS }))!;
    expect(catalog.map((g) => g.group)).toEqual(
      ["brew", "control", "cleaning", "filter", "power", "danger"],
    );
    expect(catalog.map((g) => g.group)).toEqual([...KNOWN_GROUP_ORDER]);
    expect(catalog.find((g) => g.group === "cleaning")!.entries.map((e) => e.action))
      .toEqual(["easy_clean", "intensive_clean", "descaling"]);
    expect(catalog.find((g) => g.group === "power")!.entries.map((e) => e.action))
      .toEqual(["evaporating", "switch_off"]);
  });

  it("orders known groups first even when served shuffled; unknown groups follow in served order", () => {
    const actions = [
      { action: "mystery_b", group: "zeta", process: null, confirm: false,
        requires: [], available: true, invocation: button("mystery_b") },
      { action: "factory_reset_settings", group: "danger", process: null, confirm: true,
        destructive: true, requires: ["ready"], available: true,
        invocation: button("factory_reset_settings") },
      { action: "mystery_a", group: "alpha_group", process: null, confirm: false,
        requires: [], available: true, invocation: button("mystery_a") },
      { action: "easy_clean", group: "cleaning", process: "EASY_CLEAN", confirm: true,
        requires: ["ready"], available: true, invocation: button("easy_clean") },
    ];
    const catalog = resolveActionCatalog(docWith({ actions }))!;
    // Known groups in KNOWN_GROUP_ORDER, then unknown in SERVED order (zeta first).
    expect(catalog.map((g) => g.group)).toEqual(["cleaning", "danger", "zeta", "alpha_group"]);
  });

  it("hides available:false entries and omits emptied groups (§6.2.5.3/§6.2.6)", () => {
    const actions = MELITTA_ACTIONS.map((a) =>
      a.group === "danger" || a.action === "switch_off" ? { ...a, available: false } : a,
    );
    const catalog = resolveActionCatalog(docWith({ actions }))!;
    expect(catalog.map((g) => g.group)).toEqual(["brew", "control", "cleaning", "filter", "power"]);
    expect(catalog.find((g) => g.group === "power")!.entries.map((e) => e.action))
      .toEqual(["evaporating"]);
  });

  it("drops entries with unknown invocation kinds (§6.0.3)", () => {
    const actions = [
      { action: "easy_clean", group: "cleaning", process: "EASY_CLEAN", confirm: true,
        requires: ["ready"], available: true, invocation: button("easy_clean") },
      { action: "webhook_thing", group: "cleaning", process: null, confirm: false,
        requires: [], available: true, invocation: { kind: "webhook", url: "https://x" } },
    ];
    const catalog = resolveActionCatalog(docWith({ actions }))!;
    expect(catalog).toHaveLength(1);
    expect(catalog[0].entries.map((e) => e.action)).toEqual(["easy_clean"]);
  });
});

describe("maintenanceActionGroups", () => {
  it("excludes the informational brew/control groups, keeps the rest + unknown (§6.2.5.2)", () => {
    const actions = [
      ...MELITTA_ACTIONS,
      { action: "mystery", group: "experimental", process: null, confirm: false,
        requires: [], available: true, invocation: button("mystery") },
    ];
    const catalog = resolveActionCatalog(docWith({ actions }))!;
    const groups = maintenanceActionGroups(catalog).map((g) => g.group);
    expect(groups).toEqual(["cleaning", "filter", "power", "danger", "experimental"]);
    for (const g of INFORMATIONAL_GROUPS) expect(groups).not.toContain(g);
  });
});

// ---------------------------------------------------------------------------
// evalRequires (§6.2.4)
// ---------------------------------------------------------------------------

describe("evalRequires", () => {
  it("empty requires is always satisfied", () => {
    expect(evalRequires([], { statusTokens: null, connected: false })).toBe(true);
  });

  it("connected follows the bridge attribute", () => {
    expect(evalRequires(["connected"], { statusTokens: null, connected: true })).toBe(true);
    expect(evalRequires(["connected"], { statusTokens: null, connected: false })).toBe(false);
  });

  it("ready needs READY + NONE", () => {
    expect(evalRequires(["ready"], CTX_READY)).toBe(true);
    expect(evalRequires(["ready"], CTX_CONNECTED_NOT_READY)).toBe(false);
    expect(evalRequires(["ready"], {
      statusTokens: { ...TOKENS_READY, manipulation_token: "FILL_WATER" },
      connected: true,
    })).toBe(false);
  });

  it("ready and awaiting_confirmation are unsatisfied with null statusTokens (offline)", () => {
    expect(evalRequires(["ready"], { statusTokens: null, connected: true })).toBe(false);
    expect(evalRequires(["awaiting_confirmation"], { statusTokens: null, connected: true }))
      .toBe(false);
  });

  it("awaiting_confirmation follows the state attribute", () => {
    expect(evalRequires(["awaiting_confirmation"], {
      statusTokens: { ...TOKENS_READY, awaiting_confirmation: true }, connected: true,
    })).toBe(true);
    expect(evalRequires(["awaiting_confirmation"], CTX_READY)).toBe(false);
  });

  it("unknown condition tokens are satisfied (fail-open)", () => {
    expect(evalRequires(["quantum_flux"], { statusTokens: null, connected: false })).toBe(true);
    expect(evalRequires(["connected", "quantum_flux"], { statusTokens: null, connected: true }))
      .toBe(true);
  });

  it("ANDs all listed tokens", () => {
    expect(evalRequires(["connected", "ready"], CTX_CONNECTED_NOT_READY)).toBe(false);
    expect(evalRequires(["connected", "ready"], CTX_READY)).toBe(true);
  });

  it("PINNED: switch_off stays enabled connected-not-ready while ready-gated entries do not", () => {
    const catalog = resolveActionCatalog(docWith({ actions: MELITTA_ACTIONS }))!;
    const switchOff = findEntry(catalog, "switch_off");
    const easyClean = findEntry(catalog, "easy_clean");
    expect(switchOff.requires).toEqual(["connected"]); // the PR #42 precedent as data
    expect(evalRequires(switchOff.requires, CTX_CONNECTED_NOT_READY)).toBe(true);
    expect(evalRequires(easyClean.requires, CTX_CONNECTED_NOT_READY)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Confirm / destructive policy (§6.2.5.4)
// ---------------------------------------------------------------------------

describe("confirm/destructive policy", () => {
  it("destructive forces confirm regardless of the confirm flag", () => {
    const catalog = resolveActionCatalog(docWith({
      actions: [{
        action: "factory_reset_settings", group: "danger", process: null,
        confirm: false, destructive: true, requires: ["ready"], available: true,
        invocation: button("factory_reset_settings"),
      }],
    }))!;
    const entry = catalog[0].entries[0];
    expect(entry.confirm).toBe(false);
    expect(isDestructive(entry)).toBe(true);
    expect(needsConfirm(entry)).toBe(true);
  });

  it("confirm flag alone triggers the confirm step; neither → no confirm", () => {
    const catalog = resolveActionCatalog(docWith({ actions: MELITTA_ACTIONS }))!;
    expect(needsConfirm(findEntry(catalog, "easy_clean"))).toBe(true);
    expect(isDestructive(findEntry(catalog, "easy_clean"))).toBe(false);
    expect(needsConfirm(findEntry(catalog, "filter_insert"))).toBe(false);
    expect(needsConfirm(findEntry(catalog, "factory_reset_recipes"))).toBe(true);
    expect(isDestructive(findEntry(catalog, "factory_reset_recipes"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// planActionInvocation (§6.2.1)
// ---------------------------------------------------------------------------

describe("planActionInvocation", () => {
  const catalog = () => resolveActionCatalog(docWith({ actions: MELITTA_ACTIONS }))!;

  it("plans a button press for button-kind entries", () => {
    expect(planActionInvocation(findEntry(catalog(), "easy_clean"), "barista"))
      .toEqual({ button: "easy_clean" });
  });

  it("service plans always carry entity_id = button.<prefix>_<entity_suffix>", () => {
    const plan = planActionInvocation(
      findEntry(catalog(), "brew_directkey"), "barista", { category: "espresso" },
    );
    expect(plan).toEqual({
      domain: "melitta_barista",
      service: "brew_directkey",
      data: { entity_id: "button.barista_brew", category: "espresso", two_cups: false },
    });
  });

  it("applies declared defaults and lets formState override them", () => {
    const plan = planActionInvocation(
      findEntry(catalog(), "brew_directkey"), "barista",
      { category: "cappuccino", two_cups: true },
    ) as { data: Record<string, unknown> };
    expect(plan.data.two_cups).toBe(true);
    expect(plan.data.category).toBe("cappuccino");
  });

  it("omits an optional param with no default and no form value (server defaults apply)", () => {
    const plan = planActionInvocation(findEntry(catalog(), "reset_recipe"), "barista");
    expect(plan).toEqual({
      domain: "melitta_barista",
      service: "reset_recipe",
      data: { entity_id: "button.barista_brew" },
    });
    const withId = planActionInvocation(
      findEntry(catalog(), "reset_recipe"), "barista", { recipe_id: 214 },
    ) as { data: Record<string, unknown> };
    expect(withId.data.recipe_id).toBe(214);
  });

  it("spreads a params_ref record into the service data (freestyle form)", () => {
    const plan = planActionInvocation(
      findEntry(catalog(), "brew_freestyle"), "barista",
      { params: { c1_process: "coffee", c1_portion_ml: 40, name: "Custom" } },
    );
    expect(plan).toEqual({
      domain: "melitta_barista",
      service: "brew_freestyle",
      data: {
        entity_id: "button.barista_brew",
        c1_process: "coffee", c1_portion_ml: 40, name: "Custom",
      },
    });
  });

  it("never lets form values override the entity_id targeting anchor", () => {
    const plan = planActionInvocation(
      findEntry(catalog(), "brew_freestyle"), "barista",
      { params: { entity_id: "button.evil_other", c1_process: "coffee" } },
    ) as { data: Record<string, unknown> };
    expect(plan.data.entity_id).toBe("button.barista_brew");
  });

  it("splits a dotted service string into its own domain", () => {
    const entry: ActionEntry = {
      action: "custom", group: "control", process: null, confirm: false,
      requires: [], available: true,
      invocation: { kind: "service", service: "other_domain.do_thing",
        entity_suffix: "brew", params: [] },
    };
    expect(planActionInvocation(entry, "barista")).toEqual({
      domain: "other_domain", service: "do_thing",
      data: { entity_id: "button.barista_brew" },
    });
  });
});

// ---------------------------------------------------------------------------
// Display resolution (§6.2.1 icon, §6.2.3 group labels, §6.3.5.1 preference)
// ---------------------------------------------------------------------------

describe("display resolution", () => {
  afterEach(() => resetServerStrings());

  const entryWithIcon = (icon?: string): ActionEntry => ({
    action: "easy_clean", group: "cleaning", process: "EASY_CLEAN", confirm: true,
    requires: ["ready"], available: true, invocation: { kind: "button", entity_suffix: "easy_clean" },
    ...(icon !== undefined ? { icon } : {}),
  });

  it("passes well-formed mdi icons through; defaults absent/malformed to mdi:cog", () => {
    expect(actionIcon(entryWithIcon("mdi:shimmer"))).toBe("mdi:shimmer");
    expect(actionIcon(entryWithIcon("mdi:water-sync"))).toBe("mdi:water-sync");
    expect(actionIcon(entryWithIcon())).toBe(DEFAULT_ACTION_ICON);
    expect(actionIcon(entryWithIcon("shimmer"))).toBe(DEFAULT_ACTION_ICON);
    expect(actionIcon(entryWithIcon("mdi:"))).toBe(DEFAULT_ACTION_ICON);
    expect(actionIcon(entryWithIcon("mdi:UPPER"))).toBe(DEFAULT_ACTION_ICON);
    expect(actionIcon(entryWithIcon("javascript:alert(1)"))).toBe(DEFAULT_ACTION_ICON);
    expect(DEFAULT_ACTION_ICON).toBe("mdi:cog");
  });

  it("actionLabel prefers server string → bundle → humanized token", () => {
    expect(actionLabel("easy_clean")).toBe("Easy Clean"); // bundle
    expect(actionLabel("factory_reset_settings")).toBe("Factory reset settings"); // humanized
    setServerStrings({ "actions.easy_clean.label": "Schnellreinigung" });
    expect(actionLabel("easy_clean")).toBe("Schnellreinigung"); // server wins
    resetServerStrings();
    expect(actionLabel("easy_clean")).toBe("Easy Clean");
  });

  it("actionDescription prefers server string → bundle → null", () => {
    expect(actionDescription("easy_clean")).toBe("Quick rinse of the brew unit");
    expect(actionDescription("factory_reset_settings")).toBeNull();
    setServerStrings({ "actions.easy_clean.description": "Milchsystem spülen" });
    expect(actionDescription("easy_clean")).toBe("Milchsystem spülen");
  });

  it("actionGroupLabel prefers server string → bundle → humanized group id", () => {
    expect(actionGroupLabel("cleaning")).toBe("Cleaning & Descaling"); // bundle
    expect(actionGroupLabel("power")).toBe("Power"); // humanized (no bundle key)
    expect(actionGroupLabel("experimental_stuff")).toBe("Experimental stuff"); // unknown group
    setServerStrings({ "actions._groups.cleaning": "Reinigung" });
    expect(actionGroupLabel("cleaning")).toBe("Reinigung");
  });

  it("humanizeToken capitalizes and de-underscores", () => {
    expect(humanizeToken("factory_reset_recipes")).toBe("Factory reset recipes");
    expect(humanizeToken("danger")).toBe("Danger");
  });
});
