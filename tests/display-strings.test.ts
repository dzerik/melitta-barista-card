// Zone C-H — server-string preference layer for display labels (spec §6.3.5).
//
// Per-key preference order (§6.3.5.1): server string → client bundle string →
// humanized raw token. The server registry is consumed via the PURE half of
// server-i18n only (§6.3.5.6); the token→bundle-key maps and 29 card bundles
// stay untouched as the fallback layer. Legacy suites (machine-state.test.ts,
// format.test.ts) are untouched and must stay green — bundle-only behaviour
// with no server strings installed is byte-identical to 2.6.x.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, it, expect, beforeEach } from "vitest";
import {
  setServerStrings,
  resetServerStrings,
} from "../src/server-i18n";
import {
  processTokenLabel,
  activityTokenLabel,
  actionTokenLabel,
  computeMachineStatus,
} from "../src/machine-state";
import { displayName, displayNameFor } from "../src/format";

beforeEach(() => {
  resetServerStrings();
});

// ---------------------------------------------------------------------------
// processTokenLabel — server key `status.process.<TOKEN>` (§6.3.1)
// ---------------------------------------------------------------------------

describe("processTokenLabel server-string preference", () => {
  it("prefers the server string over the bundle string", () => {
    setServerStrings({ "status.process.READY": "Bereit" });
    expect(processTokenLabel("READY")).toBe("Bereit");
  });

  it("falls through to the bundle string when the server key is missing", () => {
    setServerStrings({ "status.process.PRODUCT": "Bezug läuft" });
    expect(processTokenLabel("READY")).toBe("Ready"); // en bundle, per key
    expect(processTokenLabel("PRODUCT")).toBe("Bezug läuft");
  });

  it("is bundle-identical with no server strings installed", () => {
    expect(processTokenLabel("READY")).toBe("Ready");
    expect(processTokenLabel("PRODUCT")).toBe("Brewing");
    expect(processTokenLabel("EASY_CLEAN")).toBe("Cleaning");
  });

  it("serves unknown tokens too when the server has a key for them (§5.3.2)", () => {
    setServerStrings({ "status.process.FUTURE_MODE": "Zukunftsmodus" });
    expect(processTokenLabel("FUTURE_MODE")).toBe("Zukunftsmodus");
  });

  it("unknown token without a server key keeps the raw-token fallback", () => {
    setServerStrings({ "status.process.READY": "Bereit" });
    expect(processTokenLabel("FUTURE_MODE")).toBe("FUTURE_MODE");
  });

  it("never case-folds keys — casing is significant (§6.3.1)", () => {
    setServerStrings({ "status.process.ready": "wrong-case" });
    expect(processTokenLabel("READY")).toBe("Ready");
  });

  it("null token (unmapped raw code) stays the bundle busy label", () => {
    setServerStrings({ "status.process.BUSY": "Beschäftigt" });
    expect(processTokenLabel(null)).toBe("Busy");
  });
});

// ---------------------------------------------------------------------------
// activityTokenLabel — server key `status.sub_process.<TOKEN>`
// ---------------------------------------------------------------------------

describe("activityTokenLabel server-string preference", () => {
  it("prefers the server string", () => {
    setServerStrings({ "status.sub_process.GRINDING": "Mahlen" });
    expect(activityTokenLabel("GRINDING")).toBe("Mahlen");
  });

  it("falls through to the bundle per key", () => {
    setServerStrings({ "status.sub_process.STEAM": "Dampf" });
    expect(activityTokenLabel("GRINDING")).toBe("Grinding");
  });

  it("null token (idle) stays the bundle idle label", () => {
    setServerStrings({ "status.sub_process.PREPARE": "Vorbereiten" });
    expect(activityTokenLabel(null)).toBe("Idle");
  });

  it("does not read process-domain keys (no key-space bleed)", () => {
    setServerStrings({ "status.process.GRINDING": "wrong-domain" });
    expect(activityTokenLabel("GRINDING")).toBe("Grinding");
  });
});

// ---------------------------------------------------------------------------
// actionTokenLabel — server key `status.manipulation.<TOKEN>`
// ---------------------------------------------------------------------------

describe("actionTokenLabel server-string preference", () => {
  it("prefers the server string", () => {
    setServerStrings({ "status.manipulation.FILL_WATER": "Wassertank füllen" });
    expect(actionTokenLabel("FILL_WATER")).toBe("Wassertank füllen");
  });

  it("falls through to the bundle per key", () => {
    setServerStrings({ "status.manipulation.BU_REMOVED": "Brüheinheit einsetzen" });
    expect(actionTokenLabel("FILL_WATER")).toBe("Fill water tank");
  });

  it("unknown token without a server key keeps the raw-token fallback", () => {
    expect(actionTokenLabel("NEW_MANIP")).toBe("NEW_MANIP");
    setServerStrings({ "status.manipulation.NEW_MANIP": "Neue Aktion" });
    expect(actionTokenLabel("NEW_MANIP")).toBe("Neue Aktion");
  });
});

// ---------------------------------------------------------------------------
// computeMachineStatus token path picks up the installed server strings
// ---------------------------------------------------------------------------

describe("computeMachineStatus with server strings", () => {
  const read = () => null;

  it("renders state/activity/actionRequired through the preference layer", () => {
    setServerStrings({
      "status.process.PRODUCT": "Bezug läuft",
      "status.sub_process.GRINDING": "Mahlen",
      "status.manipulation.FILL_WATER": "Wassertank füllen",
    });
    const s = computeMachineStatus(read, {
      tokens: {
        process_token: "PRODUCT",
        sub_process_token: "GRINDING",
        manipulation_token: "FILL_WATER",
        is_brewing: true,
        awaiting_confirmation: false,
      },
      connected: true,
    });
    expect(s.state).toBe("Bezug läuft");
    expect(s.activity).toBe("Mahlen");
    expect(s.actionRequired).toBe("Wassertank füllen");
  });

  it("token semantics are untouched by display strings (§6.3.2)", () => {
    setServerStrings({ "status.process.READY": "Bereit" });
    const s = computeMachineStatus(read, {
      tokens: {
        process_token: "READY",
        sub_process_token: null,
        manipulation_token: "NONE",
        is_brewing: false,
        awaiting_confirmation: false,
      },
      connected: true,
    });
    expect(s.state).toBe("Bereit");
    expect(s.isReady).toBe(true); // derived from the token, not the label
    expect(s.actionRequired).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// displayNameFor — §6.3.5.7 frozen signature, family-scoped server keys
// ---------------------------------------------------------------------------

describe("displayNameFor", () => {
  it("prefers the family-scoped server key values.<family>.<token>", () => {
    setServerStrings({ "values.intensity.very_mild": "Sehr mild" });
    expect(displayNameFor("intensity", "very_mild")).toBe("Sehr mild");
  });

  it("falls through to the bare-token bundle key values.<token>", () => {
    expect(displayNameFor("intensity", "very_mild")).toBe("V.Mild");
    expect(displayNameFor("shots", "one")).toBe("1");
  });

  it("falls through to the humanized token last", () => {
    expect(displayNameFor("blend", "hopper_1")).toBe("Hopper 1");
  });

  it("family-scopes colliding tokens (§6.3.1: bare tokens collide)", () => {
    setServerStrings({
      "values.shots.none": "Keine Shots",
      "values.process.none": "Keine",
    });
    expect(displayNameFor("shots", "none")).toBe("Keine Shots");
    expect(displayNameFor("process", "none")).toBe("Keine");
    // family with no server key falls to the shared bundle entry
    expect(displayNameFor("intensity", "none")).toBe("None");
  });

  it("does not read bare-token server keys (family scoping is mandatory)", () => {
    setServerStrings({ "values.medium": "wrong-shape" });
    expect(displayNameFor("intensity", "medium")).toBe("Med");
  });

  it("legacy displayName stays the bundle-only path (§6.3.5.7)", () => {
    setServerStrings({ "values.intensity.very_mild": "Sehr mild" });
    expect(displayName("very_mild")).toBe("V.Mild");
    expect(displayName("extra_shot")).toBe("Extra shot");
  });
});

// ---------------------------------------------------------------------------
// Module purity (§6.3.5.6): label/format modules import only the pure
// registry half of server-i18n; no HA imports appear.
// ---------------------------------------------------------------------------

describe("module purity", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = (f: string) => readFileSync(join(here, "..", "src", f), "utf8");

  const importsOf = (code: string): { from: string; names: string }[] =>
    [...code.matchAll(/^import\s+(type\s+)?(.+?)\s+from\s+"(.+?)";?$/gm)].map(
      (m) => ({ names: m[2], from: m[3] }),
    );

  it("machine-state.ts imports only const, localize, and the registry", () => {
    const imports = importsOf(src("machine-state.ts"));
    expect(imports.map((i) => i.from).sort()).toEqual(
      ["./const", "./localize/localize", "./server-i18n"].sort(),
    );
    const reg = imports.find((i) => i.from === "./server-i18n")!;
    expect(reg.names).toBe("{ serverString }"); // pure half only
  });

  it("format.ts imports only localize and the registry", () => {
    const imports = importsOf(src("format.ts"));
    expect(imports.map((i) => i.from).sort()).toEqual(
      ["./localize/localize", "./server-i18n"].sort(),
    );
    const reg = imports.find((i) => i.from === "./server-i18n")!;
    expect(reg.names).toBe("{ serverString }");
  });

  it("neither module imports HA surfaces", () => {
    for (const f of ["machine-state.ts", "format.ts"]) {
      const code = src(f);
      expect(code).not.toMatch(/custom-card-helpers/);
      expect(code).not.toMatch(/\bhass\b/);
      expect(code).not.toMatch(/fetchServerStrings|setServerStrings/);
    }
  });
});
