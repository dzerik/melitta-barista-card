// Pure business logic: derive the machine status from raw entity states.
// No Lit, no Home Assistant imports — testable in isolation.

import { STATE_COLORS } from "./const";

/** True when the value is an actual reported state, not a HA sentinel. */
export function isRealState(s: string | null | undefined): s is string {
  return s != null && s !== "unknown" && s !== "unavailable" && s !== "None";
}

export interface MachineStatus {
  state: string;
  activity: string;
  isConnected: boolean;
  isUnavailable: boolean;
  isBrewing: boolean;
  isReady: boolean;
  actionRequired: string | null;
  /** 0-100, or null when the machine reports no usable progress. */
  progress: number | null;
  stateColor: string;
}

export function computeMachineStatus(read: (suffix: string) => string | null): MachineStatus {
  const state = read("state") || "unavailable";
  const activityRaw = read("activity");
  const progressRaw = read("progress");
  const actionRaw = read("action_required");
  const connection = read("connection") || "Disconnected";

  let progress: number | null = null;
  if (isRealState(progressRaw)) {
    const p = parseFloat(progressRaw);
    if (!Number.isNaN(p)) progress = Math.max(0, Math.min(100, p));
  }

  return {
    state,
    activity: isRealState(activityRaw) ? activityRaw : "Idle",
    isConnected: connection === "Connected",
    isUnavailable: state === "unavailable" || state === "unknown",
    isBrewing: state === "Brewing",
    isReady: state === "Ready",
    actionRequired: isRealState(actionRaw) ? actionRaw : null,
    progress,
    stateColor: STATE_COLORS[state.toLowerCase()] || "var(--primary-text-color)",
  };
}
