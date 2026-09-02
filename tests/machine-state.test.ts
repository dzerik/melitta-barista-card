import { describe, it, expect } from "vitest";
import {
  computeMachineStatus,
  isRealState,
  PROCESS_TOKEN_I18N,
  ACTIVITY_TOKEN_I18N,
  ACTION_TOKEN_I18N,
  processTokenLabel,
  activityTokenLabel,
  actionTokenLabel,
  type StatusTokens,
} from "../src/machine-state";
import { STATE_COLORS } from "../src/const";
import { localizeOptional } from "../src/localize/localize";

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

// ---------------------------------------------------------------------------
// UI Contract v1 — token mode (spec §3.4 / §7.2 Zone C-B)
// ---------------------------------------------------------------------------

function tokens(over: Partial<StatusTokens> = {}): StatusTokens {
  return {
    process_token: "READY",
    sub_process_token: null,
    manipulation_token: "NONE",
    is_brewing: false,
    awaiting_confirmation: false,
    ...over,
  };
}

describe("computeMachineStatus — token mode", () => {
  it("derives a ready connected machine from tokens", () => {
    const st = computeMachineStatus(reader({}), { tokens: tokens(), connected: true });
    expect(st.isReady).toBe(true);
    expect(st.isBrewing).toBe(false);
    expect(st.isBusy).toBe(false);
    expect(st.isConnected).toBe(true);
    expect(st.isUnavailable).toBe(false);
    expect(st.actionRequired).toBeNull();
    expect(st.state).toBe("Ready");
    expect(st.activity).toBe("Idle");
    expect(st.stateColor).toBe(STATE_COLORS.READY);
  });

  it("derives brewing with activity from sub_process_token", () => {
    const st = computeMachineStatus(reader({}), {
      tokens: tokens({ process_token: "PRODUCT", sub_process_token: "GRINDING", is_brewing: true }),
      connected: true,
    });
    expect(st.isBrewing).toBe(true);
    expect(st.isReady).toBe(false);
    expect(st.state).toBe("Brewing");
    expect(st.activity).toBe("Grinding");
    expect(st.stateColor).toBe(STATE_COLORS.PRODUCT);
  });

  it("a manipulation blocks isReady and localizes actionRequired", () => {
    const st = computeMachineStatus(reader({}), {
      tokens: tokens({ manipulation_token: "FILL_WATER" }),
      connected: true,
    });
    expect(st.isReady).toBe(false);
    expect(st.actionRequired).toBe("Fill water tank");
  });

  it("unknown manipulation token falls back to the raw token", () => {
    const st = computeMachineStatus(reader({}), {
      tokens: tokens({ manipulation_token: "SOME_NEW_MANIPULATION" }),
      connected: true,
    });
    expect(st.isReady).toBe(false);
    expect(st.actionRequired).toBe("SOME_NEW_MANIPULATION");
  });

  it("derives isBusy from BUSY", () => {
    const st = computeMachineStatus(reader({}), {
      tokens: tokens({ process_token: "BUSY" }),
      connected: true,
    });
    expect(st.isBusy).toBe(true);
    expect(st.isReady).toBe(false);
    expect(st.state).toBe("Busy");
  });

  it("maps SWITCH_OFF, DESCALING and the cleaning trio to display keys", () => {
    const one = (process_token: string) =>
      computeMachineStatus(reader({}), { tokens: tokens({ process_token }), connected: true });
    expect(one("SWITCH_OFF").state).toBe("Off");
    expect(one("SWITCH_OFF").stateColor).toBe(STATE_COLORS.SWITCH_OFF);
    expect(one("DESCALING").state).toBe("Descaling");
    for (const t of ["CLEANING", "EASY_CLEAN", "INTENSIVE_CLEAN"]) {
      expect(one(t).state).toBe("Cleaning");
    }
  });

  it("renders unknown process tokens as neutral busy-like, raw label (§5.3.2)", () => {
    const st = computeMachineStatus(reader({}), {
      tokens: tokens({ process_token: "COLD_BREW" }),
      connected: true,
    });
    expect(st.state).toBe("COLD_BREW");
    expect(st.stateColor).toBe(STATE_COLORS.BUSY);
    expect(st.isReady).toBe(false);
    expect(st.isBrewing).toBe(false);
  });

  it("renders a null process_token (unmapped raw code) as busy-like", () => {
    const st = computeMachineStatus(reader({}), {
      tokens: tokens({ process_token: null, manipulation_token: null }),
      connected: true,
    });
    expect(st.state).toBe("Busy");
    expect(st.stateColor).toBe(STATE_COLORS.BUSY);
    expect(st.isReady).toBe(false);
    expect(st.actionRequired).toBeNull();
  });

  it("renders unknown activity tokens as the raw token", () => {
    const st = computeMachineStatus(reader({}), {
      tokens: tokens({ sub_process_token: "LEVITATING" }),
      connected: true,
    });
    expect(st.activity).toBe("LEVITATING");
  });

  it("takes isConnected from the bridge attribute, not the legacy sensor", () => {
    const st = computeMachineStatus(reader({ connection: "Connected" }), {
      tokens: tokens(),
      connected: false,
    });
    expect(st.isConnected).toBe(false);
  });

  it("keeps reading progress from the legacy sensor in token mode", () => {
    const st = computeMachineStatus(reader({ progress: "42.5" }), {
      tokens: tokens({ process_token: "PRODUCT", is_brewing: true }),
      connected: true,
    });
    expect(st.progress).toBe(42.5);
  });

  it("falls through to the legacy branch when tokens are null", () => {
    const legacy = computeMachineStatus(reader({ state: "Ready", connection: "Connected" }));
    const gated = computeMachineStatus(reader({ state: "Ready", connection: "Connected" }), {
      tokens: null,
      connected: true,
    });
    expect(gated).toEqual(legacy);
    expect(gated.isReady).toBe(true);
  });

  it("legacy branch also derives isBusy from the display string", () => {
    expect(computeMachineStatus(reader({ state: "Busy" })).isBusy).toBe(true);
    expect(computeMachineStatus(reader({ state: "Ready" })).isBusy).toBe(false);
  });
});

describe("token → card-i18n-key maps (spec §7.2 Zone C-B, normative)", () => {
  const PROCESS_TOKENS = [
    "READY", "PRODUCT", "CLEANING", "DESCALING", "FILTER_INSERT", "FILTER_REPLACE",
    "FILTER_REMOVE", "SWITCH_OFF", "EASY_CLEAN", "INTENSIVE_CLEAN", "EVAPORATING", "BUSY",
  ];
  const SUB_PROCESS_TOKENS = ["GRINDING", "COFFEE", "STEAM", "WATER", "PREPARE"];
  const MANIPULATION_TOKENS = [
    "NONE", "BU_REMOVED", "TRAYS_MISSING", "EMPTY_TRAYS", "FILL_WATER",
    "CLOSE_POWDER_LID", "FILL_POWDER", "MOVE_CUP_TO_FROTHER", "FLUSH_REQUIRED",
  ];

  it("covers every §3.2 status token", () => {
    expect(Object.keys(PROCESS_TOKEN_I18N).sort()).toEqual([...PROCESS_TOKENS].sort());
    expect(Object.keys(ACTIVITY_TOKEN_I18N).sort()).toEqual([...SUB_PROCESS_TOKENS].sort());
    expect(Object.keys(ACTION_TOKEN_I18N).sort()).toEqual([...MANIPULATION_TOKENS].sort());
  });

  it("pins the normative mappings verbatim", () => {
    expect(PROCESS_TOKEN_I18N.PRODUCT).toBe("state.brewing");
    expect(PROCESS_TOKEN_I18N.READY).toBe("state.ready");
    expect(PROCESS_TOKEN_I18N.SWITCH_OFF).toBe("state.off");
    expect(PROCESS_TOKEN_I18N.CLEANING).toBe("state.cleaning");
    expect(PROCESS_TOKEN_I18N.EASY_CLEAN).toBe("state.cleaning");
    expect(PROCESS_TOKEN_I18N.INTENSIVE_CLEAN).toBe("state.cleaning");
    expect(PROCESS_TOKEN_I18N.DESCALING).toBe("state.descaling");
    expect(PROCESS_TOKEN_I18N.BUSY).toBe("state.busy");
  });

  it("every mapped key resolves to an English translation", () => {
    for (const map of [PROCESS_TOKEN_I18N, ACTIVITY_TOKEN_I18N, ACTION_TOKEN_I18N]) {
      for (const [token, key] of Object.entries(map)) {
        expect(localizeOptional(key), `${token} → ${key}`).toBeDefined();
      }
    }
  });

  it("label helpers localize known tokens and pass through unknown ones", () => {
    expect(processTokenLabel("EVAPORATING")).toBe("Evaporating");
    expect(processTokenLabel("FILTER_INSERT")).toBe("Inserting Filter");
    expect(processTokenLabel(null)).toBe("Busy");
    expect(processTokenLabel("MYSTERY")).toBe("MYSTERY");
    expect(activityTokenLabel("PREPARE")).toBe("Preparing");
    expect(activityTokenLabel(null)).toBe("Idle");
    expect(actionTokenLabel("BU_REMOVED")).toBe("Insert brew unit");
  });
});

describe("STATE_COLORS token keys", () => {
  it("keeps every legacy lowercase key", () => {
    for (const k of ["ready", "brewing", "cleaning", "descaling", "off", "busy", "unavailable"]) {
      expect(STATE_COLORS[k], k).toBeDefined();
    }
  });

  it("gains a color for every §3.2 process token", () => {
    for (const t of [
      "READY", "PRODUCT", "CLEANING", "DESCALING", "FILTER_INSERT", "FILTER_REPLACE",
      "FILTER_REMOVE", "SWITCH_OFF", "EASY_CLEAN", "INTENSIVE_CLEAN", "EVAPORATING", "BUSY",
    ]) {
      expect(STATE_COLORS[t], t).toBeDefined();
    }
  });

  it("token keys mirror their legacy twins", () => {
    expect(STATE_COLORS.READY).toBe(STATE_COLORS.ready);
    expect(STATE_COLORS.PRODUCT).toBe(STATE_COLORS.brewing);
    expect(STATE_COLORS.SWITCH_OFF).toBe(STATE_COLORS.off);
    expect(STATE_COLORS.BUSY).toBe(STATE_COLORS.busy);
  });
});
