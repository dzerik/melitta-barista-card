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
  it("single phase, no authored steps → one brew step", () => {
    expect(buildBrewPlan({ machine_phases: [phase()] })).toEqual([
      { kind: "brew", phaseIndex: 0, phaseCount: 1, component: { process: "coffee" }, hints: undefined },
    ]);
  });

  it("renders the sommelier's own sentences, ordered, around the pours", () => {
    const plan = buildBrewPlan({
      machine_phases: [
        phase(),
        { component: { process: "milk" }, user_action_before: [
          { order: 1, action: "Add vanilla syrup", amount: 20, unit: "ml" },
        ] },
      ],
      steps: [
        { order: 2, phase: "pre", action: "Chill a 300 ml glass" },
        { order: 1, phase: "pre", action: "Fill it with ice", amount: 3, unit: "cubes" },
        { order: 3, phase: "during", action: "Let the espresso settle before the milk" },
        { order: 4, phase: "post", action: "Dust with cocoa" },
      ],
    });
    expect(plan.map((s) => (s.kind === "manual" ? s.text : `brew#${s.phaseIndex}`))).toEqual([
      "Fill it with ice (3 cubes)",   // order wins over array position
      "Chill a 300 ml glass",
      "brew#0",
      "Add vanilla syrup (20 ml)",
      "brew#1",
      "Dust with cocoa",
    ]);
  });

  it("attaches 'during' sentences to the first pour as hints", () => {
    const plan = buildBrewPlan({
      machine_phases: [phase(), phase()],
      steps: [{ order: 1, phase: "during", action: "Swirl the cup halfway" }],
    });
    const brews = plan.filter((s) => s.kind === "brew") as Extract<BrewStep, { kind: "brew" }>[];
    expect(brews[0].hints).toEqual(["Swirl the cup halfway"]);
    expect(brews[1].hints).toBeUndefined();
  });

  it("keeps a step's notes alongside its sentence", () => {
    const plan = buildBrewPlan({
      machine_phases: [phase()],
      steps: [{ order: 1, phase: "pre", action: "Warm the cup", notes: "Hot water works" }],
    });
    expect(plan[0]).toEqual({ kind: "manual", text: "Warm the cup", notes: "Hot water works" });
  });

  it("accepts the legacy grouped {pre, post} object of plain strings", () => {
    const plan = buildBrewPlan({
      machine_phases: [phase()],
      steps: { pre: ["Warm the cup"], post: ["Stir gently"] },
    });
    expect(plan.map((s) => (s.kind === "manual" ? s.text : "brew"))).toEqual([
      "Warm the cup", "brew", "Stir gently",
    ]);
  });

  it("tolerates null/missing fields and unusable entries", () => {
    expect(buildBrewPlan({})).toEqual([]);
    expect(buildBrewPlan({ machine_phases: null, steps: null })).toEqual([]);
    const plan = buildBrewPlan({
      machine_phases: [{ user_action_before: [
        { order: 1, action: "Attach the milk hose" },
        { order: 2, action: "   " },
        { order: 3 },
        42 as unknown as Record<string, unknown>,
      ] }],
    });
    expect(plan).toEqual([
      { kind: "manual", text: "Attach the milk hose", notes: null },
      { kind: "brew", phaseIndex: 0, phaseCount: 1, component: undefined, hints: undefined },
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
