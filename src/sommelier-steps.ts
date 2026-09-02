// Pure business logic: turn a sommelier recipe into a linear brew plan.
// No Lit, no Home Assistant imports — testable in isolation.
//
// Mirrors the panel wizard's step model in compact form: steps.pre (manual)
// → per machine phase: its user_action_before entries (manual) then the
// brew step → steps.post (manual). A recipe that needs none of that keeps
// the legacy one-shot brew path.

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
 */
export function agentErrorKey(err: unknown): string | null {
  const code = (err as { code?: unknown } | null | undefined)?.code;
  if (typeof code !== "string") return null;
  return (AGENT_ERROR_CODES as readonly string[]).includes(code)
    ? `sommelier.err.${code}`
    : null;
}
