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

/** One catalog recipe from the contract document (spec §3.3). */
export interface ContractRecipe {
  recipe_id: number;
  name: string;
  category: string;
  icon: IconSpec | null;
  components?: {
    c1: RecipeComponentData | null;
    c2: RecipeComponentData | null;
  };
}

/** Inclusive numeric range with step, e.g. portion limits (spec §3.3). */
export interface PortionRange {
  min: number;
  max: number;
  step: number;
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
