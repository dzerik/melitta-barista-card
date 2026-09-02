// Pure business logic: derive the machine status from raw entity states.
// No Lit, no Home Assistant imports — testable in isolation.
//
// Two modes (UI Contract v1, spec §3.4 / §5.3 / §7.2 Zone C-B):
//  - Token mode: the caller passes the StatusTokens read from
//    `sensor.<prefix>_state` attributes plus the bridge `connected` flag from
//    `sensor.<prefix>_connection`. Non-null tokens imply the contract-version
//    gate already passed upstream.
//  - Legacy mode (tokens absent/null): the original English display-string
//    matching, kept byte-identical for integrations older than the contract.

import { STATE_COLORS } from "./const";
import { localize, localizeOptional } from "./localize/localize";

/** True when the value is an actual reported state, not a HA sentinel. */
export function isRealState(s: string | null | undefined): s is string {
  return s != null && s !== "unknown" && s !== "unavailable" && s !== "None";
}

/**
 * Live status token block of `sensor.<prefix>_state` (UI Contract §3.4 B).
 * Structurally identical to the contract module's StatusTokens; duplicated
 * here so this pure module has no import edge into the WS client.
 */
export interface StatusTokens {
  process_token: string | null;
  sub_process_token: string | null;
  manipulation_token: string | null;
  is_brewing: boolean;
  awaiting_confirmation: boolean;
}

/** Token-mode input for computeMachineStatus: tokens + bridge connectivity. */
export interface TokenStatusInput {
  /** Parsed status tokens, or null when unavailable/unsupported (→ legacy mode). */
  tokens: StatusTokens | null;
  /** The `connected` bridge attribute of `sensor.<prefix>_connection`. */
  connected: boolean;
}

// ---------------------------------------------------------------------------
// Normative v1 token → card-i18n-key maps (spec §7.2 Zone C-B).
// The display-string story until machine-domain i18n-over-WS (§6.3) lands.
// ---------------------------------------------------------------------------

/** MachineProcess token → card i18n key. */
export const PROCESS_TOKEN_I18N: Record<string, string> = {
  READY: "state.ready",
  PRODUCT: "state.brewing",
  SWITCH_OFF: "state.off",
  CLEANING: "state.cleaning",
  EASY_CLEAN: "state.cleaning",
  INTENSIVE_CLEAN: "state.cleaning",
  DESCALING: "state.descaling",
  BUSY: "state.busy",
  FILTER_INSERT: "state.filter_insert",
  FILTER_REPLACE: "state.filter_replace",
  FILTER_REMOVE: "state.filter_remove",
  EVAPORATING: "state.evaporating",
};

/** SubProcess token → card i18n key. */
export const ACTIVITY_TOKEN_I18N: Record<string, string> = {
  GRINDING: "activity.grinding",
  COFFEE: "activity.coffee",
  STEAM: "activity.steam",
  WATER: "activity.water",
  PREPARE: "activity.prepare",
};

/** Manipulation token → card i18n key (NONE included for map completeness). */
export const ACTION_TOKEN_I18N: Record<string, string> = {
  NONE: "action.none",
  BU_REMOVED: "action.bu_removed",
  TRAYS_MISSING: "action.trays_missing",
  EMPTY_TRAYS: "action.empty_trays",
  FILL_WATER: "action.fill_water",
  CLOSE_POWDER_LID: "action.close_powder_lid",
  FILL_POWDER: "action.fill_powder",
  MOVE_CUP_TO_FROTHER: "action.move_cup_to_frother",
  FLUSH_REQUIRED: "action.flush_required",
};

/**
 * Display label for a process token. Unknown tokens fall back to
 * `localizeOptional(token)` then the raw token (§5.3.2); a null token
 * (unmapped raw status code) renders as the neutral busy label.
 */
export function processTokenLabel(token: string | null): string {
  if (token == null) return localize("state.busy");
  const key = PROCESS_TOKEN_I18N[token];
  return (key && localizeOptional(key)) || localizeOptional(token) || token;
}

/** Display label for a sub-process token; null (idle) → localized idle. */
export function activityTokenLabel(token: string | null): string {
  if (token == null) return localize("state.idle");
  const key = ACTIVITY_TOKEN_I18N[token];
  return (key && localizeOptional(key)) || localizeOptional(token) || token;
}

/** Display label for a manipulation token (raw-token fallback for unknown). */
export function actionTokenLabel(token: string): string {
  const key = ACTION_TOKEN_I18N[token];
  return (key && localizeOptional(key)) || localizeOptional(token) || token;
}

export interface MachineStatus {
  state: string;
  activity: string;
  isConnected: boolean;
  isUnavailable: boolean;
  isBrewing: boolean;
  isReady: boolean;
  isBusy: boolean;
  actionRequired: string | null;
  /** 0-100, or null when the machine reports no usable progress. */
  progress: number | null;
  stateColor: string;
}

function parseProgress(progressRaw: string | null): number | null {
  if (!isRealState(progressRaw)) return null;
  const p = parseFloat(progressRaw);
  return Number.isNaN(p) ? null : Math.max(0, Math.min(100, p));
}

/**
 * Derive the machine status. When `tokenInput.tokens` is non-null the
 * token-first path (§3.4 rules) is used; otherwise the legacy
 * display-string-matching branch runs unchanged.
 */
export function computeMachineStatus(
  read: (suffix: string) => string | null,
  tokenInput?: TokenStatusInput | null,
): MachineStatus {
  const t = tokenInput?.tokens;
  if (t) {
    const proc = t.process_token;
    const manip = t.manipulation_token;
    return {
      state: processTokenLabel(proc),
      activity: activityTokenLabel(t.sub_process_token),
      isConnected: tokenInput.connected,
      // Tokens present ⇒ the state sensor is available ⇒ not offline (§3.4).
      isUnavailable: false,
      isBrewing: t.is_brewing,
      isReady: proc === "READY" && manip === "NONE",
      isBusy: proc === "BUSY",
      actionRequired:
        manip != null && manip !== "NONE" ? actionTokenLabel(manip) : null,
      progress: parseProgress(read("progress")),
      // Unknown/null token → neutral busy-like color (§5.3.2).
      stateColor: (proc != null && STATE_COLORS[proc]) || STATE_COLORS.BUSY,
    };
  }

  const state = read("state") || "unavailable";
  const activityRaw = read("activity");
  const actionRaw = read("action_required");
  const connection = read("connection") || "Disconnected";

  return {
    state,
    activity: isRealState(activityRaw) ? activityRaw : "Idle",
    isConnected: connection === "Connected",
    isUnavailable: state === "unavailable" || state === "unknown",
    isBrewing: state === "Brewing",
    isReady: state === "Ready",
    isBusy: state === "Busy",
    actionRequired: isRealState(actionRaw) ? actionRaw : null,
    progress: parseProgress(read("progress")),
    stateColor: STATE_COLORS[state.toLowerCase()] || "var(--primary-text-color)",
  };
}
