// UI Contract v1 client (spec: docs/UI_CONTRACT.md in melitta-ha-integration).
// Pure business logic: no Lit, no Home Assistant imports — testable in isolation.
//
// The card bridges from the entity world to the WS world (spec §2.3):
//   1. readBridgeAttrs() parses sensor.<prefix>_connection attributes and gates
//      token mode on a supported contract_version (§5.3.3).
//   2. readStatusTokens() parses sensor.<prefix>_state attributes — only when
//      the bridge gate passed.
//   3. fetchUiContract() fetches the contract document over WS with the §2.3.5
//      durable/transient failure classification, a session cache keyed by
//      entry_id + contract_fingerprint, and a bounded transient-retry hook
//      driven by noteBridgeUpdate() (connected false→true / fingerprint change).
//
// Legacy string-matching paths elsewhere in the card stay untouched: every
// reader here returns null when the integration predates the contract.

/** Contract versions this card can render. Anything else → full legacy mode. */
export const SUPPORTED_CONTRACT_VERSIONS: readonly number[] = [1];

/**
 * WS command name for the contract document (spec §2.2).
 * Lives here rather than in api.ts because the contract client is a
 * self-contained new module (Zone C-A owns only new files).
 */
export const WS_UI_CONTRACT_GET = "melitta_barista/ui_contract/get";

// ---------------------------------------------------------------------------
// Types (spec §3.3, §3.4, §3.6). Token-typed fields are open strings: unknown
// values MUST flow through — vocabularies grow additively within a version.
// ---------------------------------------------------------------------------

/** Bridge block from `sensor.<prefix>_connection` attributes (spec §3.4 A). */
export interface BridgeAttrs {
  entry_id: string;
  contract_version: number;
  /** May be null on a pre-handshake entry where no contract exists yet. */
  contract_fingerprint: string | null;
  connected: boolean;
}

/** Live token block from `sensor.<prefix>_state` attributes (spec §3.4 B). */
export interface StatusTokens {
  /** MachineProcess token, or null when the raw code is unmapped. */
  process_token: string | null;
  /** SubProcess token, or null when idle. */
  sub_process_token: string | null;
  /** Manipulation token; "NONE" for no-manipulation, null iff status is None. */
  manipulation_token: string | null;
  /** InfoMessage flag tokens (frozen list, spec §3.4). */
  info_messages: string[];
  is_brewing: boolean;
  awaiting_confirmation: boolean;
}

/** One stacked liquid layer of a drink icon, bottom→top (spec §3.6). */
export interface Layer {
  /** Known: "coffee" | "milk" | "water" | "additive"; unknown → neutral grey. */
  role: string;
  ml: number;
  fraction: number;
  /** 0.00–1.00 darkness/opacity hint. */
  intensity: number;
  /** Present only on a coffee layer that is topmost overall. */
  crema?: true;
  /** Additive layers only; "#RRGGBB" or null. Data, never markup. */
  color_hint?: string | null;
  /** Additive layers only; additive display name. */
  label?: string;
}

/** Foam cap, always rendered topmost when present (spec §3.6). */
export interface Foam {
  role: string; // known: "milk_foam"
  ml: number;
  fraction: number;
}

/** Procedural drink icon description (spec §3.6). Client owns geometry/colors. */
export interface IconSpec {
  spec_version: number; // known: 1; unknown → client default icon (§5.3.2)
  /** Known: "espresso_cup" | "cup" | "tall_glass"; unknown → render as "cup". */
  glass: string;
  total_ml: number;
  /** 0.01–1.00: how full the glass is drawn. */
  fill_level: number;
  layers: Layer[];
  foam: Foam | null;
  steam: boolean;
}

/**
 * Brand badge data (spec §3.10) — additive within contract_version 1.
 *
 * DATA ONLY: the integration never ships brand logos. `logo_url` is non-null
 * only when the user placed their own file under HA's www dir. Absent on
 * older servers — every consumer must render fine without it.
 */
export interface BrandTheme {
  /** BrandProfile.brand_slug; same value as machine.brand. */
  brand: string;
  /** Display string, e.g. "MELITTA" — rendered as text, never an image. */
  wordmark: string;
  /** "#rrggbb" primary brand accent. */
  accent: string;
  /** "#rrggbb" muted companion usable as a background tint. */
  accent_soft: string;
  /** "/local/melitta_barista/<brand>.png" iff the user-supplied file exists. */
  logo_url: string | null;
}

/** Token-level composition of one recipe component (spec §3.3). */
export interface RecipeComponentData {
  process: string;
  intensity: string;
  aroma: string;
  temperature: string;
  shots: string;
  portion_ml: number;
  /** Omitted for the machine-default hopper (wire byte 0) or unknown bytes. */
  blend?: string;
}

/** One catalog recipe from the contract document (spec §3.3, §6.3.6). */
export interface ContractRecipe {
  recipe_id: number;
  name: string;
  category: string;
  icon: IconSpec | null;
  components?: {
    c1: RecipeComponentData | null;
    c2: RecipeComponentData | null;
  };
  /**
   * Stable ASCII lower_snake i18n key (spec §6.3.6, additive v2 field):
   * server string lookup goes through `recipes.name.<name_key>`; `name`
   * stays the English fallback. Absent on 0.91 servers.
   */
  name_key?: string;
}

/** Inclusive numeric range with step, e.g. portion limits (spec §3.3). */
export interface PortionRange {
  min: number;
  max: number;
  step: number;
}

// ---------------------------------------------------------------------------
// v2 feature types (spec §6, 0.92 amendment). ALL additive and optional:
// every one of these ships within contract_version 1, is detected by field
// presence (never by version, §6.0.1), and degrades independently (§6.0.4).
// validateContract deliberately does NOT check any of them.
// ---------------------------------------------------------------------------

/**
 * Self-describing parameter descriptor (spec §6.1.1).
 *
 * `kind` and `scope` are open sets (§5.3.2): a descriptor with an unknown
 * `kind` is ignored per-parameter (§6.1.5 three-tier fallback); a descriptor
 * whose `scope` contains no token the client understands is not rendered.
 */
export interface ParameterDescriptor {
  /** Known: "enum" | "range" (open set). */
  kind: string;
  /** Known: "freestyle" | "brew_override" (open set). */
  scope: string[];
  /** Freestyle process tokens the parameter attaches to; absent = all. */
  applies_to?: string[];
  /** kind == "enum": lower_snake value tokens, §3.1 casing. */
  tokens?: string[];
  /** kind == "range": known "ml". */
  unit?: string;
  /** kind == "range": when set, c1/c2 sub-ranges apply; else min/max/step. */
  per_component?: true;
  c1?: PortionRange;
  c2?: PortionRange;
  min?: number;
  max?: number;
  step?: number;
}

/** Forbidden parameter combination (spec §6.1.6); advisory, server re-validates. */
export interface ForbiddenCombination {
  params: Record<string, string>;
  reason_token?: string;
}

/** One parameter of a service-kind action invocation (spec §6.2.1). */
export interface ActionParam {
  name: string;
  /** Known: "enum" | "bool" | "int" | "params_ref" (open set). */
  kind: string;
  required: boolean;
  /** kind enum. */
  tokens?: string[];
  default?: string | number | boolean;
  /** kind int; disjoint inclusive ranges. */
  ranges?: [number, number][];
  /** kind params_ref; known: "freestyle". */
  ref?: string;
}

/** Press `button.<prefix>_<entity_suffix>` (spec §6.2.1). */
export interface ActionInvocationButton {
  kind: "button";
  entity_suffix: string;
}

/**
 * Call `melitta_barista.<service>` (spec §6.2.1). `entity_suffix` is REQUIRED:
 * the service's `entity_id` target is `button.<prefix>_<entity_suffix>` —
 * multi-machine targeting is normative.
 */
export interface ActionInvocationService {
  kind: "service";
  service: string;
  entity_suffix: string;
  params: ActionParam[];
}

/**
 * How an action is invoked. The `kind` set is open on the wire: entries with
 * an unknown `invocation.kind` are dropped by the client (§6.0.3/§6.2.1) —
 * see readContractActions.
 */
export type ActionInvocation = ActionInvocationButton | ActionInvocationService;

/** One action-catalog entry (spec §6.2.1/§6.2.2). */
export interface ActionEntry {
  /** lower_snake action token, e.g. "easy_clean". */
  action: string;
  /** Known: "brew" | "control" | "cleaning" | "filter" | "power" | "danger" (open). */
  group: string;
  /** MachineProcess token the action starts, if any. */
  process: string | null;
  /** "mdi:<name>"; absent/malformed → client default (normatively mdi:cog). */
  icon?: string;
  /** Client shows a confirm step (two-tap or dialog). */
  confirm: boolean;
  /** Implies confirm regardless of the confirm flag, plus danger styling. */
  destructive?: true;
  /** Condition tokens (§6.2.4); [] = always; unknown token = satisfied. */
  requires: string[];
  /** Per-family truth (§6.2.6); false entries hidden by default. */
  available: boolean;
  invocation: ActionInvocation;
}

// ---------------------------------------------------------------------------
// v3 feature types (spec §9, 0.93 amendment). ALL additive and optional —
// exactly the v2 pattern: shipped within contract_version 1, detected by
// field presence (§9.0.1), degrading per feature (§5.3.6). validateContract
// deliberately does NOT check any of them.
// ---------------------------------------------------------------------------

/** One rung of a discrete number scale (spec §9.1.1): token = semantic identity, value = wire mapping. */
export interface SettingLevel {
  value: number;
  token: string;
}

/**
 * One select option (spec §9.1.1). `label` mirrors the select entity's current
 * option string — writes send the served label verbatim (§9.1.6 rule 4);
 * `token` is non-null only where a semantic ladder has been authored.
 */
export interface SettingOption {
  value: number;
  token: string | null;
  label: string;
}

/** Entity binding of a setting: `<domain>.<prefix>_<entity_suffix>` (§6.2.1 anchor convention). */
export interface SettingEntityBinding {
  domain: string; // "switch" | "number" | "select"
  entity_suffix: string;
}

/**
 * One machine-settings descriptor (spec §9.1.1). Served order is the
 * normative render order; `control` and `group` are open sets (§5.3.2) —
 * an unknown `control` is skipped per entry by the resolver, an unknown
 * `group` renders after the known ones.
 */
export interface SettingEntry {
  /** lower_snake stable token, byte-equal to the entity suffix (§9.1.2.1). */
  setting: string;
  /** Known: "switch" | "number" | "select" (open set). */
  control: string;
  /** Known: "brew" | "water" | "power" | "system" (open set). */
  group: string;
  /** "mdi:<name>"; absent/malformed → mdi:tune (§9.1.1). */
  icon?: string;
  entity: SettingEntityBinding;
  /** false → read-only display, never a disabled write control (§9.1.6.6). */
  writable: boolean;
  // control == "number":
  min?: number;
  max?: number;
  step?: number;
  /** Known: "min" | "h". */
  unit?: string;
  /** Known: "slider" | "box" — advisory rendering hint only. */
  display?: string;
  /** Semantic ladder for discrete scales; absent → plain numeric control. */
  levels?: SettingLevel[];
  // control == "select":
  options?: SettingOption[];
}

/** The full `ui_contract/get` response document (spec §3.3). */
export interface UiContract {
  schema_version: number;
  contract_version: number;
  contract_fingerprint: string;
  entry_id: string;
  generated_at: string;
  source: string;
  machine: {
    brand: string;
    brand_name: string;
    model_name: string | null;
    family_key: string | null;
    machine_type: string | null;
    connected: boolean;
  };
  /** Absent on servers older than the §3.10 amendment; never required. */
  brand_theme?: BrandTheme;
  capabilities: {
    supports_recipe_writes: boolean;
    supports_stats: boolean;
    supports_factory_reset: boolean;
    supports_brew_overrides: boolean;
    supports_freestyle: boolean;
    my_coffee_slots: number;
    strength_levels: number;
    has_aroma_balance: boolean;
    hopper_count: number;
    has_milk_system: boolean;
    tolerated_brew_manipulations: string[];
  };
  vocabularies: {
    status: {
      process: string[];
      sub_process: string[];
      manipulation: string[];
      info_message: string[];
    };
    freestyle: {
      process: string[];
      intensity: string[];
      aroma: string[];
      temperature: string[];
      shots: string[];
      blend: string[];
    };
  };
  limits: {
    portion_ml: { c1: PortionRange; c2: PortionRange };
  };
  recipes: ContractRecipe[];
  status_attribute_entity: string;
  bridge_attribute_entity: string;

  // --- v2 additive fields (spec §6, all optional; absent on 0.91 servers) ---

  /** Parameter catalogs (§6.1); mirrors and closes the v1 vocab/limits blocks. */
  parameters?: Record<string, ParameterDescriptor>;
  /** Action catalog (§6.2); absent → legacy hardcoded action arrays. */
  actions?: ActionEntry[];
  /** Defined shape, empty content in 0.92 (§6.1.6). */
  forbidden_combinations?: ForbiddenCombination[];
  /** Server-strings cache axis (§6.3.2): the integration manifest version. */
  strings_version?: string;

  // --- v3 additive fields (spec §9, all optional; absent on ≤0.92 servers) ---

  /** Settings descriptors (§9.1); absent → legacy hardcoded settings tables. */
  settings?: SettingEntry[];
  /**
   * DirectKey/profile model (§9.3); present iff the machine supports the HC
   * extension (Melitta only). The shape lives with its Zone C-K consumer
   * (`ContractDirectKey` in directkey.ts), which reads it through a widening
   * cast exactly like every feature reader — untyped here on purpose.
   */
  directkey?: unknown;
}

/** Minimal structural slice of the HA connection object this module needs. */
export interface ContractHass {
  callWS<T = unknown>(msg: { type: string; [key: string]: unknown }): Promise<T>;
}

// ---------------------------------------------------------------------------
// Attribute readers
// ---------------------------------------------------------------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function optString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

/**
 * Parse the bridge block from `sensor.<prefix>_connection` attributes.
 *
 * Returns null unless `contract_version` is present AND supported — this is
 * the attribute-surface half of the version gate (spec §5.3.3): a future v2
 * server must not leak v2 token semantics into this v1 client, so an
 * unsupported version disables the entire token surface, not just the WS
 * document.
 */
export function readBridgeAttrs(connectionEntityAttrs: unknown): BridgeAttrs | null {
  if (!isRecord(connectionEntityAttrs)) return null;
  const version = connectionEntityAttrs.contract_version;
  if (typeof version !== "number" || !SUPPORTED_CONTRACT_VERSIONS.includes(version)) return null;
  const entryId = connectionEntityAttrs.entry_id;
  if (typeof entryId !== "string" || entryId === "") return null;
  return {
    entry_id: entryId,
    contract_version: version,
    contract_fingerprint: optString(connectionEntityAttrs.contract_fingerprint),
    connected: connectionEntityAttrs.connected === true,
  };
}

/**
 * Parse the live token block from `sensor.<prefix>_state` attributes.
 *
 * Returns null when the bridge gate did not pass (legacy mode) or when the
 * token attributes are absent — an unavailable state sensor has its attributes
 * stripped by HA, and that absence means "offline", identical to legacy
 * semantics (spec §3.4). Unknown token values pass through untouched.
 */
export function readStatusTokens(
  stateEntityAttrs: unknown, bridge: BridgeAttrs | null,
): StatusTokens | null {
  if (!bridge) return null;
  if (!isRecord(stateEntityAttrs)) return null;
  if (!("process_token" in stateEntityAttrs)) return null;
  const raw = stateEntityAttrs.info_messages;
  return {
    process_token: optString(stateEntityAttrs.process_token),
    sub_process_token: optString(stateEntityAttrs.sub_process_token),
    manipulation_token: optString(stateEntityAttrs.manipulation_token),
    info_messages: Array.isArray(raw) ? raw.filter((m): m is string => typeof m === "string") : [],
    is_brewing: stateEntityAttrs.is_brewing === true,
    awaiting_confirmation: stateEntityAttrs.awaiting_confirmation === true,
  };
}

// ---------------------------------------------------------------------------
// Contract validation
// ---------------------------------------------------------------------------

/**
 * Validate a raw WS response into a UiContract.
 *
 * Checks only the contract version and the minimal structure the card relies
 * on. It MUST NOT reject unknown token values, unknown fields, or grown
 * vocabularies (spec §3.2): additive server evolution never requires a client
 * release. Returns null on version or structural mismatch.
 */
export function validateContract(data: unknown): UiContract | null {
  if (!isRecord(data)) return null;
  const version = data.contract_version;
  if (typeof version !== "number" || !SUPPORTED_CONTRACT_VERSIONS.includes(version)) return null;
  if (typeof data.contract_fingerprint !== "string" || data.contract_fingerprint === "") return null;
  if (typeof data.entry_id !== "string" || data.entry_id === "") return null;
  if (!isRecord(data.machine)) return null;
  if (!isRecord(data.capabilities)) return null;
  if (!isRecord(data.vocabularies)) return null;
  if (!isRecord(data.vocabularies.status) || !isRecord(data.vocabularies.freestyle)) return null;
  if (!isRecord(data.limits) || !isRecord(data.limits.portion_ml)) return null;
  const portion = data.limits.portion_ml;
  if (!isRecord(portion.c1) || !isRecord(portion.c2)) return null;
  if (!Array.isArray(data.recipes)) return null;
  if (typeof data.status_attribute_entity !== "string") return null;
  if (typeof data.bridge_attribute_entity !== "string") return null;
  return data as unknown as UiContract;
}

// ---------------------------------------------------------------------------
// v2 feature readers (spec §6.0.1/§6.0.3): per-feature presence detection and
// unknown-kind dropping. These are the primitives the parameter wiring (tier
// fallback, §6.1.5) and the action-catalog resolver (§6.2.5) build on; they
// never reject a document — v2 malformation degrades only its own feature.
// ---------------------------------------------------------------------------

/** Parameter descriptor kinds this client can interpret (spec §6.1.1). */
export const KNOWN_PARAMETER_KINDS: readonly string[] = ["enum", "range"];

/** Action invocation kinds this client can dispatch (spec §6.2.1). */
export const KNOWN_INVOCATION_KINDS: readonly string[] = ["button", "service"];

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((s) => typeof s === "string");
}

function isPortionRangeLike(v: unknown): v is PortionRange {
  return isRecord(v)
    && typeof v.min === "number" && typeof v.max === "number" && typeof v.step === "number";
}

/**
 * Read the v2 `parameters` catalog from a contract document (spec §6.1).
 *
 * Returns null when the field is absent (0.91 server) — the caller falls back
 * wholesale to the v1 vocabularies/limits tier (§6.1.5). When present, only
 * descriptors this client can interpret survive: unknown `kind`, an enum
 * without a string `tokens` list, or a range without usable numbers are
 * OMITTED, so the per-parameter fallback happens naturally at the wiring tier.
 * An unknown `scope` token is NOT dropped here — scope filtering is a
 * rendering decision (§6.1.1); `scope` is only normalized to a string array.
 */
export function readContractParameters(
  contract: UiContract,
): Record<string, ParameterDescriptor> | null {
  // Widen: validateContract passes v2 fields through unchecked (§6.0.1), so
  // the value may be malformed despite the optimistic UiContract typing.
  const raw: unknown = contract.parameters;
  if (!isRecord(raw)) return null;
  const out: Record<string, ParameterDescriptor> = {};
  for (const [family, desc] of Object.entries(raw)) {
    if (!isRecord(desc)) continue;
    const kind = desc.kind;
    if (typeof kind !== "string" || !KNOWN_PARAMETER_KINDS.includes(kind)) continue;
    if (kind === "enum" && !isStringArray(desc.tokens)) continue;
    if (kind === "range") {
      const perComponent = desc.per_component === true;
      const rangeOk = perComponent
        ? isPortionRangeLike(desc.c1) && isPortionRangeLike(desc.c2)
        : typeof desc.min === "number" && typeof desc.max === "number"
          && typeof desc.step === "number";
      if (!rangeOk) continue;
    }
    const scope = isStringArray(desc.scope) ? desc.scope : [];
    out[family] = { ...(desc as unknown as ParameterDescriptor), scope };
  }
  return out;
}

function readInvocation(v: unknown): ActionInvocation | null {
  if (!isRecord(v)) return null;
  if (v.kind === "button") {
    return typeof v.entity_suffix === "string" && v.entity_suffix !== ""
      ? (v as unknown as ActionInvocationButton) : null;
  }
  if (v.kind === "service") {
    // entity_suffix is REQUIRED on service entries (§6.2.1 multi-machine rule).
    return typeof v.service === "string" && v.service !== ""
      && typeof v.entity_suffix === "string" && v.entity_suffix !== ""
      && Array.isArray(v.params)
      ? (v as unknown as ActionInvocationService) : null;
  }
  return null; // unknown invocation kind → entry dropped (§6.0.3)
}

/**
 * Read the v2 `actions` catalog from a contract document (spec §6.2).
 *
 * Returns null when the field is absent (0.91 server) — the caller renders
 * its legacy hardcoded action arrays (§6.2.5.1). When present, entries with
 * an unknown or malformed `invocation.kind` are dropped (§6.0.3/§6.2.1) and
 * the advisory fields are normalized fail-open (`available` defaults true,
 * missing `requires` → always-satisfied []): the catalog gates styling, never
 * correctness — the server re-validates every command (§6.2.4). Serve order
 * is preserved; group ordering is the resolver's concern (§6.2.3).
 */
export function readContractActions(contract: UiContract): ActionEntry[] | null {
  // Widen: validateContract passes v2 fields through unchecked (§6.0.1).
  const raw: unknown = contract.actions;
  if (!Array.isArray(raw)) return null;
  const out: ActionEntry[] = [];
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    if (typeof entry.action !== "string" || entry.action === "") continue;
    const invocation = readInvocation(entry.invocation);
    if (!invocation) continue;
    const normalized: ActionEntry = {
      ...(entry as unknown as ActionEntry),
      group: typeof entry.group === "string" ? entry.group : "",
      process: typeof entry.process === "string" ? entry.process : null,
      confirm: entry.confirm === true,
      requires: isStringArray(entry.requires) ? entry.requires : [],
      available: entry.available !== false,
      invocation,
    };
    // destructive is meaningful only as the literal true (§6.2.1).
    if (entry.destructive !== true) delete normalized.destructive;
    out.push(normalized);
  }
  return out;
}

// ---------------------------------------------------------------------------
// v3 feature readers (spec §9.0.1): same contract as the v2 readers above —
// per-feature presence detection, per-entry malformation dropping, never a
// document rejection.
// ---------------------------------------------------------------------------

function readSettingLevels(v: unknown): SettingLevel[] | null {
  if (!Array.isArray(v)) return null;
  const out: SettingLevel[] = [];
  for (const item of v) {
    if (!isRecord(item)) continue;
    if (typeof item.value !== "number") continue;
    if (typeof item.token !== "string" || item.token === "") continue;
    out.push({ value: item.value, token: item.token });
  }
  return out.length > 0 ? out : null;
}

function readSettingOptions(v: unknown): SettingOption[] | null {
  if (!Array.isArray(v)) return null;
  const out: SettingOption[] = [];
  for (const item of v) {
    if (!isRecord(item)) continue;
    if (typeof item.value !== "number") continue;
    if (typeof item.label !== "string") continue;
    out.push({
      value: item.value,
      token: typeof item.token === "string" && item.token !== "" ? item.token : null,
      label: item.label,
    });
  }
  return out.length > 0 ? out : null;
}

/**
 * Read the v3 `settings` block from a contract document (spec §9.1).
 *
 * Returns null when the field is absent or malformed (a ≤0.92 server) — the
 * caller falls back to the legacy hardcoded settings tables (§5.3.6 tier 2).
 * When present, entries are normalized per entry: an entry without a usable
 * `setting` token, `control` string, or entity binding is DROPPED (it cannot
 * be addressed); unknown `control`/`group` tokens pass through untouched
 * (open sets, §5.3.2 — renderability is the resolver's decision); `writable`
 * normalizes fail-closed (never invent a write control the server did not
 * declare); malformed `levels`/`options` items and malformed optional scalars
 * are stripped so the renderer sees only well-typed data. Served order is
 * preserved — it is the normative render order (§9.1.1).
 */
export function readContractSettings(contract: UiContract): SettingEntry[] | null {
  // Widen: validateContract passes v3 fields through unchecked (§9.0.1).
  const raw: unknown = contract.settings;
  if (!Array.isArray(raw)) return null;
  const out: SettingEntry[] = [];
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    if (typeof entry.setting !== "string" || entry.setting === "") continue;
    if (typeof entry.control !== "string" || entry.control === "") continue;
    const entity = entry.entity;
    if (!isRecord(entity)) continue;
    if (typeof entity.domain !== "string" || entity.domain === "") continue;
    if (typeof entity.entity_suffix !== "string" || entity.entity_suffix === "") continue;
    const normalized: SettingEntry = {
      ...(entry as unknown as SettingEntry),
      group: typeof entry.group === "string" ? entry.group : "",
      entity: { domain: entity.domain, entity_suffix: entity.entity_suffix },
      writable: entry.writable === true,
    };
    const levels = readSettingLevels(entry.levels);
    if (levels) normalized.levels = levels;
    else delete normalized.levels;
    const options = readSettingOptions(entry.options);
    if (options) normalized.options = options;
    else delete normalized.options;
    if (typeof entry.min !== "number") delete normalized.min;
    if (typeof entry.max !== "number") delete normalized.max;
    if (typeof entry.step !== "number") delete normalized.step;
    if (typeof entry.unit !== "string") delete normalized.unit;
    if (typeof entry.display !== "string") delete normalized.display;
    if (typeof entry.icon !== "string") delete normalized.icon;
    out.push(normalized);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Session cache + failure classification + transient-retry hook (spec §2.3)
// ---------------------------------------------------------------------------

interface EntryFetchState {
  /** Durable failure (§2.3.5): legacy fallback for the rest of the session. */
  durable: boolean;
  /** A transient failure happened; further attempts need an armed retry. */
  transient: boolean;
  /** One retry is armed (connected false→true, or fingerprint appeared/changed). */
  retryArmed: boolean;
  /** console.warn emitted for this entry already. */
  warned: boolean;
  lastConnected: boolean | null;
  lastFingerprint: string | null;
}

/** Latest validated contract per entry_id (keyed check uses its fingerprint). */
const contractCache = new Map<string, UiContract>();
const fetchStates = new Map<string, EntryFetchState>();

function fetchStateFor(entryId: string): EntryFetchState {
  let st = fetchStates.get(entryId);
  if (!st) {
    st = {
      durable: false, transient: false, retryArmed: false,
      warned: false, lastConnected: null, lastFingerprint: null,
    };
    fetchStates.set(entryId, st);
  }
  return st;
}

function warnOnce(st: EntryFetchState, entryId: string, kind: "durable" | "transient", detail: unknown): void {
  if (st.warned) return;
  st.warned = true;
  console.warn(
    `melitta-barista-card: ui_contract fetch failed for entry ${entryId} (${kind}); `
    + `contract-derived features fall back to legacy defaults`,
    detail,
  );
}

/**
 * Transient-retry hook (spec §2.3.5): feed every bridge-attribute update here.
 *
 * Arms exactly one retry on a `connected` false→true transition, or when
 * `contract_fingerprint` first appears or changes. No polling: fetchUiContract
 * consumes the armed retry on its next attempt.
 */
export function noteBridgeUpdate(bridge: BridgeAttrs): void {
  const st = fetchStateFor(bridge.entry_id);
  const fp = bridge.contract_fingerprint;
  if (fp !== null && fp !== st.lastFingerprint) st.retryArmed = true;
  if (st.lastConnected === false && bridge.connected) st.retryArmed = true;
  st.lastConnected = bridge.connected;
  st.lastFingerprint = fp;
}

/**
 * Fetch the UI contract document for an entry over WS.
 *
 * Session-cached per `entry_id + contract_fingerprint`: pass the bridge's
 * current `contract_fingerprint` as `expectedFingerprint` so a stale cached
 * document is refetched after a fingerprint bump (spec §2.3.4); omit it to
 * accept the latest cached document.
 *
 * Failure classification (spec §2.3.5), never throws:
 * - Durable (WS `unknown command`, unsupported response `contract_version`):
 *   returns null for the rest of the session, no re-probing.
 * - Transient (`client_not_ready`, `contract_not_ready`, `entry_not_found`,
 *   network/auth errors, malformed response): returns null; retried only when
 *   noteBridgeUpdate() armed a retry — bounded to one per transition.
 *
 * Degradation is per-feature: a null here only sends contract-derived features
 * (icons, enum lists, limits, capability gating) to legacy consts; attribute
 * token status stays active.
 */
export async function fetchUiContract(
  hass: ContractHass, entryId: string, expectedFingerprint?: string | null,
): Promise<UiContract | null> {
  const cached = contractCache.get(entryId);
  if (cached && (expectedFingerprint == null || cached.contract_fingerprint === expectedFingerprint)) {
    return cached;
  }

  const st = fetchStateFor(entryId);
  if (st.durable) return null;
  if (st.transient && !st.retryArmed) return null;
  st.retryArmed = false;

  let response: unknown;
  try {
    response = await hass.callWS({ type: WS_UI_CONTRACT_GET, entry_id: entryId });
  } catch (err) {
    const code = isRecord(err) ? err.code : undefined;
    if (code === "unknown_command") {
      st.durable = true;
      warnOnce(st, entryId, "durable", err);
    } else {
      st.transient = true;
      warnOnce(st, entryId, "transient", err);
    }
    return null;
  }

  const contract = validateContract(response);
  if (!contract) {
    const version = isRecord(response) ? response.contract_version : undefined;
    if (typeof version === "number" && !SUPPORTED_CONTRACT_VERSIONS.includes(version)) {
      // A well-formed response from a future contract version: durable.
      st.durable = true;
      warnOnce(st, entryId, "durable", response);
    } else {
      // Structurally broken payload: treat as transient (a fingerprint bump
      // or reconnect may deliver a sane document).
      st.transient = true;
      warnOnce(st, entryId, "transient", response);
    }
    return null;
  }

  st.transient = false;
  contractCache.set(entryId, contract);
  return contract;
}

/** Test-only: drop the session cache and all per-entry fetch/retry state. */
export function _resetContractClientState(): void {
  contractCache.clear();
  fetchStates.clear();
}
