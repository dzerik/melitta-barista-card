import { describe, it, expect } from "vitest";
import { computeMachineStatus, isRealState } from "../src/machine-state";

function reader(states: Record<string, string | null>) {
  return (suffix: string) => states[suffix] ?? null;
}

describe("isRealState", () => {
  it("rejects HA sentinels and null", () => {
    for (const v of [null, undefined, "unknown", "unavailable", "None"]) {
      expect(isRealState(v)).toBe(false);
    }
  });
  it("accepts real values", () => {
    expect(isRealState("Ready")).toBe(true);
    expect(isRealState("42")).toBe(true);
  });
});

describe("computeMachineStatus", () => {
  it("derives a ready connected machine", () => {
    const st = computeMachineStatus(reader({
      state: "Ready", activity: "Idle", connection: "Connected",
      progress: "None", action_required: "None",
    }));
    expect(st.isReady).toBe(true);
    expect(st.isBrewing).toBe(false);
    expect(st.isConnected).toBe(true);
    expect(st.isUnavailable).toBe(false);
    expect(st.actionRequired).toBeNull();
    expect(st.progress).toBeNull();
  });

  it("treats missing state sensor as unavailable", () => {
    const st = computeMachineStatus(reader({}));
    expect(st.isUnavailable).toBe(true);
    expect(st.isConnected).toBe(false);
    expect(st.activity).toBe("Idle");
  });

  it("clamps and parses progress, ignores sentinel progress", () => {
    expect(computeMachineStatus(reader({ state: "Brewing", progress: "42.5" })).progress).toBe(42.5);
    expect(computeMachineStatus(reader({ state: "Brewing", progress: "150" })).progress).toBe(100);
    expect(computeMachineStatus(reader({ state: "Brewing", progress: "-5" })).progress).toBe(0);
    expect(computeMachineStatus(reader({ state: "Brewing", progress: "unavailable" })).progress).toBeNull();
    expect(computeMachineStatus(reader({ state: "Brewing", progress: "garbage" })).progress).toBeNull();
  });

  it("filters sentinel action_required and activity", () => {
    const st = computeMachineStatus(reader({
      state: "Ready", action_required: "unavailable", activity: "unavailable",
    }));
    expect(st.actionRequired).toBeNull();
    expect(st.activity).toBe("Idle");
  });

  it("maps state color case-insensitively with fallback", () => {
    expect(computeMachineStatus(reader({ state: "Ready" })).stateColor).toContain("--state-active-color");
    expect(computeMachineStatus(reader({ state: "SomethingNew" })).stateColor).toBe("var(--primary-text-color)");
  });
});
