// Pure business logic: turn a sommelier recipe into a linear brew plan, plus
// the string resolution for the mini-wizard vocabulary and the sommelier
// error hints. No Lit, no Home Assistant imports — testable in isolation
// (the server-string registry consumed here is the PURE half of
// server-i18n, per spec §6.3.5.6).
//
// Mirrors the panel wizard's step model in compact form: steps.pre (manual)
// → per machine phase: its user_action_before entries (manual) then the
// brew step → steps.post (manual). A recipe that needs none of that keeps
// the legacy one-shot brew path.

import { localize } from "./localize/localize";
import { serverString } from "./server-i18n";

export interface SomMachinePhase {
  component?: Record<string, unknown>;
  user_action_before?: string[];
}

export interface SomRecipeSteps {
  pre?: string[];
  post?: string[];
}

/** Minimal shape of a generate/favorite row the plan builder consumes. */
export interface SomPlannable {
  machine_phases?: SomMachinePhase[] | null;
  steps?: SomRecipeSteps | string[] | null;
}

export type BrewStep =
  | { kind: "manual"; text: string }
  | {
      kind: "brew";
      phaseIndex: number;
      phaseCount: number;
      component?: Record<string, unknown>;
    };

/** What a brew phase actually pours, extracted defensively. */
export interface BrewStepDetail {
  process: string | null;
  portionMl: number | null;
  intensity: string | null;
}

/**
 * Extract the pour composition of a brew step ("coffee, 40 ml, strong").
 * Missing/malformed component fields degrade to nulls — callers render
 * only the parts that exist.
 */
export function brewStepDetail(step: BrewStep): BrewStepDetail {
  const empty: BrewStepDetail = { process: null, portionMl: null, intensity: null };
  if (step.kind !== "brew" || !step.component) return empty;
  const c = step.component;
  const process = typeof c.process === "string" && c.process !== "none" ? c.process : null;
  const rawMl = c.portion_ml;
  const portionMl =
    typeof rawMl === "number" && Number.isFinite(rawMl) && rawMl > 0 ? rawMl : null;
  const intensity =
    process === "coffee" && typeof c.intensity === "string" ? c.intensity : null;
  return { process, portionMl, intensity };
}

function normalizeSteps(steps: SomPlannable["steps"]): SomRecipeSteps {
  if (!steps) return {};
  // Legacy rows stored steps as a flat list — treat those as pre-steps.
  if (Array.isArray(steps)) return { pre: steps.filter((s) => typeof s === "string") };
  return steps;
}

function manualList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((s): s is string => typeof s === "string" && s.trim().length > 0);
}

/** Linear step plan: pre → (actions_i, brew_i)* → post. */
export function buildBrewPlan(recipe: SomPlannable): BrewStep[] {
  const phases = Array.isArray(recipe.machine_phases) ? recipe.machine_phases : [];
  const steps = normalizeSteps(recipe.steps);
  const plan: BrewStep[] = [];
  for (const text of manualList(steps.pre)) plan.push({ kind: "manual", text });
  const phaseCount = phases.length;
  phases.forEach((phase, phaseIndex) => {
    for (const text of manualList(phase?.user_action_before)) {
      plan.push({ kind: "manual", text });
    }
    const component =
      phase && typeof phase.component === "object" && phase.component !== null
        ? (phase.component as Record<string, unknown>)
        : undefined;
    plan.push({ kind: "brew", phaseIndex, phaseCount, component });
  });
  for (const text of manualList(steps.post)) plan.push({ kind: "manual", text });
  return plan;
}

/**
 * True when a one-shot brew would silently skip user interaction:
 * more than one machine phase, or any manual step anywhere.
 * Single-phase recipes without manual steps keep the legacy path.
 */
export function needsWizard(recipe: SomPlannable): boolean {
  const plan = buildBrewPlan(recipe);
  const brews = plan.filter((s) => s.kind === "brew").length;
  return brews > 1 || plan.some((s) => s.kind === "manual");
}

/** Codes the backend pre-flight returns when no usable LLM agent exists. */
export const AGENT_ERROR_CODES = [
  "no_llm_agent",
  "no_llm_agent_selected",
  "llm_agent_missing",
] as const;

/**
 * Map a WS error to the card i18n key for it, or null for generic handling.
 * hass.callWS rejections carry {code, message}.
 *
 * Bundle tier (tier 2 of §6.3.5.1) — the served `sommelier.error.<code>`
 * string is preferred by agentErrorText; this mapper stays the offline /
 * pre-0.94 path and keeps its exact 3-code surface.
 */
export function agentErrorKey(err: unknown): string | null {
  const code = errorCode(err);
  if (code === null) return null;
  return (AGENT_ERROR_CODES as readonly string[]).includes(code)
    ? `sommelier.err.${code}`
    : null;
}

/** WS rejection code, or null when the error carries none. */
function errorCode(err: unknown): string | null {
  const code = (err as { code?: unknown } | null | undefined)?.code;
  return typeof code === "string" ? code : null;
}

/**
 * Sommelier error codes the SERVER carries a string for
 * (`sommelier.error.<code>`, spec §6.3.7).
 *
 * Superset of AGENT_ERROR_CODES: `timeout` and `unauthorized` have a served
 * string but no card bundle entry, so they render a specific hint only on a
 * 0.94+ server and fall through to the caller's generic message otherwise.
 *
 * Descriptive, not a gate — `agentErrorText` probes the server for any code,
 * so the list going stale costs nothing but its own accuracy.
 */
export const SOMMELIER_ERROR_CODES = [
  ...AGENT_ERROR_CODES,
  "timeout",
  "unauthorized",
] as const;

/**
 * Resolved hint text for a sommelier WS rejection, or null when the error is
 * not one we have wording for (the caller then shows its generic message).
 *
 * Preference order per §6.3.5.1/§6.3.7: served `sommelier.error.<code>` →
 * card bundle `sommelier.err.<code>` → null. The bundle entries stay in all
 * 29 languages as the tier-2 fallback and are never deleted.
 *
 * The server is asked for ANY code, not only the ones in the lists above:
 * those lists guard the bundle tier only. Gating the server probe on a
 * client-side allowlist would keep a sixth served code invisible until every
 * card shipped a new list — the opposite of what a server-owned family buys.
 */
export function agentErrorText(err: unknown): string | null {
  const code = errorCode(err);
  if (code === null) return null;
  const served = serverString(`sommelier.error.${code}`);
  if (served !== undefined) return served;
  const bundleKey = agentErrorKey(err);
  return bundleKey === null ? null : localize(bundleKey);
}

/**
 * Card mini-wizard key → served machine-domain key (spec §6.3.7 `wizard`
 * domain). The card's wizard vocabulary predates the served domain and uses
 * its own names, so the mapping is explicit and reviewed rather than derived:
 *
 *   sommelier.wizard_title  → wizard.title           "Brew guide"
 *   sommelier.step_of       → wizard.step_of         "Step {n} of {m}"
 *   sommelier.done          → wizard.step.done       "Done"
 *   sommelier.finish        → wizard.finish.button   "Close"
 *
 * Three card strings deliberately stay card-owned, because the served
 * wording means something else in this layout (§6.3.7c keeps client chrome
 * out of the machine domain):
 *
 *   sommelier.phase_running — in the card's flat wizard this note is the ONLY
 *     thing telling the user to wait and then press Done; the served
 *     `wizard.machine.waiting` ("Brewing…") is a status word that sits next
 *     to an explicit done-button in the panel and PWA layouts.
 *   sommelier.cancel — a standalone dismiss button, whereas
 *     `wizard.close.leave` is the affirmative answer inside a
 *     "Leave the brew guide? / Stay / Leave" confirm dialog.
 *   sommelier.brew_phase — the card's brew BUTTON caption, an action that
 *     carries the pour composition ("Brew phase 1/2 — Milk, 160 ml");
 *     `wizard.step.machine_n` is a step-list title and would drop the
 *     composition this label exists to show.
 *
 * Left side = card bundle key, kept in all 29 bundles as the tier-2 fallback
 * (offline use and pre-0.94 integrations, §6.3.7c). Right side = the key the
 * integration serves over `i18n/get`. The card sends no `domains` list, so
 * the `wizard` domain arrives automatically (§6.3.7a).
 */
export const WIZARD_SERVER_KEYS: Readonly<Record<string, string>> = {
  "sommelier.wizard_title": "wizard.title",
  "sommelier.step_of": "wizard.step_of",
  "sommelier.done": "wizard.step.done",
  "sommelier.finish": "wizard.finish.button",
};

/**
 * Placeholder name aliases between the two vocabularies: the card bundles
 * call the step total `{total}`, the served strings call it `{m}` (§6.3.7a —
 * placeholder names are carried verbatim per key, so neither side may be
 * renamed). Call sites keep passing their own variable names.
 */
const WIZARD_PLACEHOLDER_ALIASES: Readonly<Record<string, string>> = {
  m: "total",
  total: "m",
};

/** Interpolate `{name}` spans, honouring the alias table; unknown spans stay. */
function interpolate(
  template: string, vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (span, name: string) => {
    const direct = vars[name];
    if (direct !== undefined) return String(direct);
    const alias = WIZARD_PLACEHOLDER_ALIASES[name];
    const aliased = alias === undefined ? undefined : vars[alias];
    return aliased === undefined ? span : String(aliased);
  });
}

/**
 * Wizard vocabulary lookup by CARD key (spec §6.3.5.1 preference order):
 * served `wizard.*` string → card bundle → the key itself (localize's own
 * last resort). Interpolation works on both tiers.
 */
export function wizardLabel(
  cardKey: string, vars?: Record<string, string | number>,
): string {
  const servedKey = WIZARD_SERVER_KEYS[cardKey];
  if (servedKey !== undefined) {
    const served = serverString(servedKey);
    if (served !== undefined) return vars ? interpolate(served, vars) : served;
  }
  return localize(cardKey, vars);
}
