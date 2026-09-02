import { describe, it, expect } from "vitest";
import {
  buildBrewPlan,
  needsWizard,
  agentErrorKey,
  brewStepDetail,
} from "../src/sommelier-steps";

const phase = (actions: string[] = []) => ({
  component: { process: "coffee" },
  user_action_before: actions,
});

describe("buildBrewPlan", () => {
  it("single phase, no manual steps → one brew step", () => {
    expect(buildBrewPlan({ machine_phases: [phase()] })).toEqual([
      { kind: "brew", phaseIndex: 0, phaseCount: 1, component: { process: "coffee" } },
    ]);
  });

  it("interleaves pre, per-phase actions, and post", () => {
    const plan = buildBrewPlan({
      machine_phases: [phase(), phase(["Add 20 ml syrup"])],
      steps: { pre: ["Place a 300 ml cup"], post: ["Stir gently"] },
    });
    expect(plan).toEqual([
      { kind: "manual", text: "Place a 300 ml cup" },
      { kind: "brew", phaseIndex: 0, phaseCount: 2, component: { process: "coffee" } },
      { kind: "manual", text: "Add 20 ml syrup" },
      { kind: "brew", phaseIndex: 1, phaseCount: 2, component: { process: "coffee" } },
      { kind: "manual", text: "Stir gently" },
    ]);
  });

  it("legacy flat steps list is treated as pre-steps", () => {
    const plan = buildBrewPlan({
      machine_phases: [phase()],
      steps: ["Warm the cup"],
    });
    expect(plan[0]).toEqual({ kind: "manual", text: "Warm the cup" });
  });

  it("tolerates null/missing fields and junk entries", () => {
    expect(buildBrewPlan({})).toEqual([]);
    expect(buildBrewPlan({ machine_phases: null, steps: null })).toEqual([]);
    const plan = buildBrewPlan({
      machine_phases: [{ user_action_before: ["ok", "", 42 as unknown as string] }],
    });
    expect(plan).toEqual([
      { kind: "manual", text: "ok" },
      { kind: "brew", phaseIndex: 0, phaseCount: 1 },
    ]);
  });
});

describe("needsWizard", () => {
  it("false for single phase without manual steps (legacy one-shot)", () => {
    expect(needsWizard({ machine_phases: [phase()] })).toBe(false);
    expect(needsWizard({})).toBe(false);
  });

  it("true for two phases even without manual steps", () => {
    expect(needsWizard({ machine_phases: [phase(), phase()] })).toBe(true);
  });

  it("true for single phase with a user action", () => {
    expect(needsWizard({ machine_phases: [phase(["Attach milk"])] })).toBe(true);
  });

  it("true when only pre/post steps exist", () => {
    expect(
      needsWizard({ machine_phases: [phase()], steps: { post: ["Stir"] } }),
    ).toBe(true);
  });
});

describe("agentErrorKey", () => {
  it("maps the three pre-flight codes to i18n keys", () => {
    for (const code of ["no_llm_agent", "no_llm_agent_selected", "llm_agent_missing"]) {
      expect(agentErrorKey({ code, message: "x" })).toBe(`sommelier.err.${code}`);
    }
  });

  it("returns null for other codes and malformed errors", () => {
    expect(agentErrorKey({ code: "timeout" })).toBeNull();
    expect(agentErrorKey({})).toBeNull();
    expect(agentErrorKey(undefined)).toBeNull();
    expect(agentErrorKey(new Error("boom"))).toBeNull();
  });
});

describe("brewStepDetail", () => {
  const brew = (component?: Record<string, unknown>) =>
    ({ kind: "brew", phaseIndex: 0, phaseCount: 2, component }) as const;

  it("extracts process, portion and coffee intensity", () => {
    expect(
      brewStepDetail(brew({ process: "coffee", portion_ml: 40, intensity: "strong" })),
    ).toEqual({ process: "coffee", portionMl: 40, intensity: "strong" });
  });

  it("intensity only applies to coffee", () => {
    expect(
      brewStepDetail(brew({ process: "milk", portion_ml: 160, intensity: "strong" })),
    ).toEqual({ process: "milk", portionMl: 160, intensity: null });
  });

  it("degrades to nulls on missing/malformed fields", () => {
    expect(brewStepDetail(brew(undefined))).toEqual({
      process: null, portionMl: null, intensity: null,
    });
    expect(
      brewStepDetail(brew({ process: "none", portion_ml: "40" })),
    ).toEqual({ process: null, portionMl: null, intensity: null });
    expect(brewStepDetail(brew({ portion_ml: -5 }))).toEqual({
      process: null, portionMl: null, intensity: null,
    });
  });

  it("carries the phase component through buildBrewPlan", () => {
    const plan = buildBrewPlan({
      machine_phases: [
        { component: { process: "milk", portion_ml: 160 } },
        { component: { process: "coffee", portion_ml: 40, intensity: "strong" } },
      ],
    });
    expect(brewStepDetail(plan[0] as never).process).toBe("milk");
    expect(brewStepDetail(plan[1] as never)).toEqual({
      process: "coffee", portionMl: 40, intensity: "strong",
    });
  });
});
