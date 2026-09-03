// Action-catalog client logic (spec §6.2, 0.92 amendment) — Zone C-G.
//
// PURE module: no Lit, no Home Assistant imports — vitest-testable in
// isolation. The only imports are the pure contract readers (Zone C-E), the
// pure server-string registry half of server-i18n (§6.3.5.6a), and the pure
// card bundle lookup.
//
// The catalog is DESCRIPTIVE, never a correctness boundary (§6.2.4): every
// helper here gates styling/visibility only — the server re-validates every
// command and the machine NACKs what it can't do. Absence of `actions` (a
// 0.91 server) resolves to null and the renderer falls back to the permanent
// legacy hardcoded action arrays (§6.2.5.1).

import {
  readContractActions,
  type ActionEntry,
  type StatusTokens,
  type UiContract,
} from "./contract";
import { localizeOptional } from "./localize/localize";
import { serverString } from "./server-i18n";

// ---------------------------------------------------------------------------
// Catalog resolution (§6.2.3/§6.2.5)
// ---------------------------------------------------------------------------

/** One rendered action group: catalog entries sharing a `group` token. */
export interface ActionGroup {
  group: string;
  entries: ActionEntry[];
}

/** Known group render order (spec §6.2.3); unknown groups follow, served order. */
export const KNOWN_GROUP_ORDER: readonly string[] = [
  "brew", "control", "cleaning", "filter", "power", "danger",
];

/**
 * Groups the card renders with bespoke UI (spec §6.2.5.2): their catalog
 * entries are informational for this client — the card keeps its own brew and
 * control sections, so these groups never enter maintenance rendering (and
 * `params_ref` handling never does either).
 */
export const INFORMATIONAL_GROUPS: readonly string[] = ["brew", "control"];

/**
 * Resolve a contract's action catalog into ordered render groups (spec §6.2).
 *
 * Returns null when there is no contract or it carries no `actions` field
 * (0.91 server) — the caller renders its legacy hardcoded action arrays
 * (§6.2.5.1). Otherwise: entries with unknown/malformed invocation kinds are
 * dropped (§6.0.3, via readContractActions), `available: false` entries are
 * hidden (§6.2.5.3), and surviving entries are grouped in the §6.2.3 order —
 * known groups first, then unknown groups in served order. An empty result
 * (`actions: []`, or everything filtered) is catalog mode with nothing to
 * show, NOT legacy fallback.
 */
export function resolveActionCatalog(contract: UiContract | null): ActionGroup[] | null {
  if (!contract) return null;
  const entries = readContractActions(contract);
  if (entries === null) return null;
  const byGroup = new Map<string, ActionEntry[]>();
  for (const entry of entries) {
    if (!entry.available) continue;
    const list = byGroup.get(entry.group);
    if (list) list.push(entry);
    else byGroup.set(entry.group, [entry]);
  }
  const ordered: ActionGroup[] = [];
  for (const group of KNOWN_GROUP_ORDER) {
    const list = byGroup.get(group);
    if (list) {
      ordered.push({ group, entries: list });
      byGroup.delete(group);
    }
  }
  // Map iteration preserves insertion order = served order (§6.2.3).
  for (const [group, list] of byGroup) ordered.push({ group, entries: list });
  return ordered;
}

/**
 * The subset of a resolved catalog the maintenance section renders (spec
 * §6.2.5.2): everything except the informational brew/control groups the card
 * covers with bespoke sections. Unknown groups pass through — a client must
 * render a group it has never heard of (§1.2).
 */
export function maintenanceActionGroups(catalog: ActionGroup[]): ActionGroup[] {
  return catalog.filter((g) => !INFORMATIONAL_GROUPS.includes(g.group));
}

// ---------------------------------------------------------------------------
// `requires` evaluation (§6.2.4) — client-side, advisory
// ---------------------------------------------------------------------------

/** Inputs for evalRequires: live tokens + the bridge `connected` attribute. */
export interface RequiresContext {
  /** Parsed §3.4 state-sensor tokens, or null when unavailable (offline). */
  statusTokens: StatusTokens | null;
  /** The `connected` bridge attribute (§3.4 block A). */
  connected: boolean;
}

/**
 * Evaluate an entry's `requires` condition tokens (spec §6.2.4).
 *
 * All listed tokens must hold (AND); `[]` is always satisfied. An UNKNOWN
 * token is treated as satisfied (fail-open) — the catalog gates enablement
 * styling, never correctness; the server re-validates every command. The
 * known tokens derive from surfaces the card already reads: `connected` from
 * the bridge, `ready`/`awaiting_confirmation` from the state-sensor tokens
 * (both false while the state sensor is unavailable).
 */
export function evalRequires(requires: string[], ctx: RequiresContext): boolean {
  for (const token of requires) {
    switch (token) {
      case "connected":
        if (!ctx.connected) return false;
        break;
      case "ready":
        if (
          ctx.statusTokens?.process_token !== "READY"
          || ctx.statusTokens?.manipulation_token !== "NONE"
        ) return false;
        break;
      case "awaiting_confirmation":
        if (ctx.statusTokens?.awaiting_confirmation !== true) return false;
        break;
      default:
        break; // unknown token → satisfied (fail-open, §6.2.4)
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Confirm / destructive policy (§6.2.5.4)
// ---------------------------------------------------------------------------

/** True when the entry is flagged destructive (danger styling, §6.2.1). */
export function isDestructive(entry: ActionEntry): boolean {
  return entry.destructive === true;
}

/**
 * Whether pressing this entry needs a confirm step first (spec §6.2.5.4):
 * `destructive` forces the confirm step regardless of the `confirm` flag.
 */
export function needsConfirm(entry: ActionEntry): boolean {
  return entry.confirm || entry.destructive === true;
}

// ---------------------------------------------------------------------------
// Invocation planning (§6.2.1)
// ---------------------------------------------------------------------------

/** Press `button.<prefix>_<button>` — dispatch via api.pressButton. */
export interface ActionPlanButton {
  button: string;
}

/** Call `<domain>.<service>` with `data` — dispatch via hass.callService. */
export interface ActionPlanService {
  domain: string;
  service: string;
  data: Record<string, unknown>;
}

/** What the dispatcher (Zone C-I wiring) executes for one pressed entry. */
export type ActionPlan = ActionPlanButton | ActionPlanService;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Plan how to invoke an action entry (spec §6.2.1).
 *
 * Button kind → `{ button: entity_suffix }` (the existing pressButton path).
 * Service kind → `{ domain, service, data }` with `data.entity_id` ALWAYS set
 * to `button.<prefix>_<entity_suffix>` — the normative multi-machine anchor.
 * A bare `service` name targets the `melitta_barista` domain; a dotted name
 * carries its own domain.
 *
 * `formState` supplies parameter values keyed by `ActionParam.name`; a param
 * absent from it takes its declared `default`, and a param with neither is
 * OMITTED (the server's own schema defaults apply — the catalog is
 * descriptive). A `params_ref` param expects a record in `formState` and
 * spreads it into the service data (the referenced form is flat on the wire);
 * maintenance rendering never reaches this branch (§6.2.5.2) — it exists for
 * the C-I brew dispatch. `entity_id` is set last so no form value can
 * override the targeting anchor.
 */
export function planActionInvocation(
  entry: ActionEntry, prefix: string, formState?: Record<string, unknown>,
): ActionPlan {
  const inv = entry.invocation;
  if (inv.kind === "button") return { button: inv.entity_suffix };

  const dot = inv.service.indexOf(".");
  const domain = dot > 0 ? inv.service.slice(0, dot) : "melitta_barista";
  const service = dot > 0 ? inv.service.slice(dot + 1) : inv.service;
  const data: Record<string, unknown> = {};
  for (const param of inv.params) {
    const provided = formState && param.name in formState ? formState[param.name] : undefined;
    if (param.kind === "params_ref") {
      if (isRecord(provided)) Object.assign(data, provided);
      continue;
    }
    if (provided !== undefined) data[param.name] = provided;
    else if (param.default !== undefined) data[param.name] = param.default;
  }
  data.entity_id = `button.${prefix}_${inv.entity_suffix}`;
  return { domain, service, data };
}

// ---------------------------------------------------------------------------
// Display resolution (§6.2.1 icon default, §6.2.3 group labels, §6.3.5.1
// label preference: server string → client bundle → humanized token)
// ---------------------------------------------------------------------------

/** Client default icon for entries with an absent/malformed icon (§6.2.1). */
export const DEFAULT_ACTION_ICON = "mdi:cog";

const MDI_RE = /^mdi:[a-z0-9][a-z0-9-]*$/;

/** Capitalized, de-underscored last-resort rendering of a raw token (§5.3.2). */
export function humanizeToken(token: string): string {
  return token.charAt(0).toUpperCase() + token.slice(1).replace(/_/g, " ");
}

/**
 * Icon for a catalog entry: its `mdi:<name>` identifier when well-formed,
 * else the normative `mdi:cog` default (spec §6.2.1). An mdi identifier is
 * data, never markup — anything not matching the strict form is discarded.
 */
export function actionIcon(entry: ActionEntry): string {
  const icon = entry.icon;
  return typeof icon === "string" && MDI_RE.test(icon) ? icon : DEFAULT_ACTION_ICON;
}

/**
 * Display label for an action token (spec §6.3.5.1 preference order):
 * server `actions.<token>.label` → card bundle
 * `maintenance.actions.<token>.label` → humanized token.
 */
export function actionLabel(action: string): string {
  return serverString(`actions.${action}.label`)
    ?? localizeOptional(`maintenance.actions.${action}.label`)
    ?? humanizeToken(action);
}

/**
 * Optional description for an action token: server
 * `actions.<token>.description` → card bundle
 * `maintenance.actions.<token>.desc` → null (descriptions are optional keys,
 * §6.3.4 — a token without one renders without a description line).
 */
export function actionDescription(action: string): string | null {
  return serverString(`actions.${action}.description`)
    ?? localizeOptional(`maintenance.actions.${action}.desc`)
    ?? null;
}

/**
 * Header label for an action group (spec §6.2.3): server
 * `actions._groups.<group>` → card bundle `maintenance.groups.<group>` →
 * humanized group token (the normative fallback for unknown group ids).
 */
export function actionGroupLabel(group: string): string {
  return serverString(`actions._groups.${group}`)
    ?? localizeOptional(`maintenance.groups.${group}`)
    ?? humanizeToken(group);
}
