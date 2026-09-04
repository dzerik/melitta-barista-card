// Server-string preference layer for the sommelier error hints and the
// mini-wizard vocabulary (spec §6.3.7, 0.94 wave).
//
// Per-key order (§6.3.5.1): served machine-domain string → card bundle →
// last resort. The 29 card bundles stay untouched: they are tier 2 (offline
// use, pre-0.94 integrations) and no key is deleted in this round.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { HomeAssistant } from "custom-card-helpers";
import { setServerStrings, resetServerStrings } from "../src/server-i18n";
import { setLanguage } from "../src/localize/localize";
import {
  agentErrorKey,
  agentErrorText,
  wizardLabel,
  AGENT_ERROR_CODES,
  SOMMELIER_ERROR_CODES,
  WIZARD_SERVER_KEYS,
} from "../src/sommelier-steps";

function hassWith(lang: string): HomeAssistant {
  return { locale: { language: lang } } as unknown as HomeAssistant;
}

beforeEach(() => {
  resetServerStrings();
  setLanguage(undefined);
});

afterEach(() => {
  resetServerStrings();
  setLanguage(undefined);
});

// ---------------------------------------------------------------------------
// sommelier.error.<code> — LLM pre-flight hints
// ---------------------------------------------------------------------------

describe("agentErrorText server-string preference", () => {
  it("prefers the served string over the card bundle", () => {
    setServerStrings({
      "sommelier.error.no_llm_agent": "Kein KI-Agent installiert.",
    });
    expect(agentErrorText({ code: "no_llm_agent" }))
      .toBe("Kein KI-Agent installiert.");
  });

  it("falls back to the card bundle per key, not per fetch", () => {
    setServerStrings({ "sommelier.error.llm_agent_missing": "Agent weg." });
    expect(agentErrorText({ code: "llm_agent_missing" })).toBe("Agent weg.");
    // Sibling code has no served string: the en bundle answers.
    expect(agentErrorText({ code: "no_llm_agent_selected" })).toBe(
      "No AI agent selected — pick one in the Sommelier panel, System tab",
    );
  });

  it("is bundle-identical with no server strings installed", () => {
    for (const code of AGENT_ERROR_CODES) {
      const bundleKey = agentErrorKey({ code });
      expect(bundleKey).toBe(`sommelier.err.${code}`);
      const text = agentErrorText({ code });
      expect(typeof text).toBe("string");
      expect(text).not.toBe(bundleKey); // resolved, not the raw key
    }
  });

  it("keeps the bundle fallback localized", () => {
    setLanguage(hassWith("ru"));
    const ru = agentErrorText({ code: "no_llm_agent" });
    setLanguage(hassWith("en"));
    const en = agentErrorText({ code: "no_llm_agent" });
    expect(ru).not.toBe(en);
    expect(ru).toBeTruthy();
  });

  it("serves timeout and unauthorized, which have no bundle entry", () => {
    expect(agentErrorText({ code: "timeout" })).toBeNull();
    expect(agentErrorText({ code: "unauthorized" })).toBeNull();
    setServerStrings({
      "sommelier.error.timeout": "The AI agent timed out.",
      "sommelier.error.unauthorized": "Admin required.",
    });
    expect(agentErrorText({ code: "timeout" })).toBe("The AI agent timed out.");
    expect(agentErrorText({ code: "unauthorized" })).toBe("Admin required.");
  });

  it("returns null for unserved unknown codes and malformed errors", () => {
    expect(agentErrorText({ code: "db_error" })).toBeNull();
    expect(agentErrorText({})).toBeNull();
    expect(agentErrorText(undefined)).toBeNull();
    expect(agentErrorText(new Error("boom"))).toBeNull();
  });

  it("renders a code the server serves but no client list knows", () => {
    // A sixth served code must reach the user without a card release: the
    // client lists guard the bundle tier only, never the server probe.
    setServerStrings({ "sommelier.error.db_error": "Rezeptspeicher nicht erreichbar." });
    expect(agentErrorText({ code: "db_error" })).toBe(
      "Rezeptspeicher nicht erreichbar.",
    );
    expect(agentErrorKey({ code: "db_error" })).toBeNull(); // bundle tier untouched
  });

  it("agentErrorKey keeps its 3-code bundle surface", () => {
    expect([...AGENT_ERROR_CODES]).toEqual([
      "no_llm_agent", "no_llm_agent_selected", "llm_agent_missing",
    ]);
    expect([...SOMMELIER_ERROR_CODES]).toEqual([
      ...AGENT_ERROR_CODES, "timeout", "unauthorized",
    ]);
    expect(agentErrorKey({ code: "timeout" })).toBeNull();
    expect(agentErrorKey({ code: "unauthorized" })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// wizard.* — mini-wizard vocabulary
// ---------------------------------------------------------------------------

describe("wizardLabel key map", () => {
  it("maps every card wizard key to a served wizard.* key", () => {
    expect(WIZARD_SERVER_KEYS).toEqual({
      "sommelier.wizard_title": "wizard.title",
      "sommelier.step_of": "wizard.step_of",
      "sommelier.done": "wizard.step.done",
      "sommelier.finish": "wizard.finish.button",
    });
    for (const served of Object.values(WIZARD_SERVER_KEYS)) {
      expect(served.startsWith("wizard.")).toBe(true);
    }
  });
});

describe("wizardLabel server-string preference", () => {
  it("prefers the served string for every mapped key", () => {
    const served: Record<string, string> = {};
    for (const key of Object.values(WIZARD_SERVER_KEYS)) served[key] = `S:${key}`;
    setServerStrings(served);
    for (const [cardKey, servedKey] of Object.entries(WIZARD_SERVER_KEYS)) {
      expect(wizardLabel(cardKey)).toBe(`S:${servedKey}`);
    }
  });

  it("interpolates served placeholders, aliasing {m} to the card's {total}", () => {
    setServerStrings({ "wizard.step_of": "Schritt {n} von {m}" });
    expect(wizardLabel("sommelier.step_of", { n: 2, total: 3 }))
      .toBe("Schritt 2 von 3");
  });

  it("keeps card-owned wizard chrome on the bundle even when the server has wording", () => {
    // The served strings mean something else in this layout (see the key-map
    // comment): a status word, a confirm-dialog answer, and a step title that
    // would drop the pour composition from the card's brew button.
    setServerStrings({
      "wizard.machine.waiting": "Brewing…",
      "wizard.close.leave": "Leave",
      "wizard.step.machine_n": "Machine pour {n} of {m}",
    });
    expect(wizardLabel("sommelier.phase_running")).not.toBe("Brewing…");
    expect(wizardLabel("sommelier.cancel")).not.toBe("Leave");
    expect(wizardLabel("sommelier.brew_phase", { n: 1, total: 2 }))
      .toBe("Brew phase 1/2");
  });

  it("interpolates a served {total} span too (alias works both ways)", () => {
    setServerStrings({ "wizard.step_of": "Step {n}/{total}" });
    expect(wizardLabel("sommelier.step_of", { n: 1, total: 4 })).toBe("Step 1/4");
  });

  it("leaves unknown placeholder spans verbatim", () => {
    setServerStrings({ "wizard.title": "Guide {unknown}" });
    expect(wizardLabel("sommelier.wizard_title", { n: 1 })).toBe("Guide {unknown}");
  });

  it("falls through to the bundle per key", () => {
    setServerStrings({ "wizard.title": "Brühanleitung" });
    expect(wizardLabel("sommelier.wizard_title")).toBe("Brühanleitung");
    expect(wizardLabel("sommelier.done")).toBe("Done");          // en bundle
    expect(wizardLabel("sommelier.cancel")).toBe("Cancel");      // en bundle
    expect(wizardLabel("sommelier.step_of", { n: 1, total: 2 }))
      .toBe("Step 1 of 2");                                      // en bundle
  });

  it("is bundle-identical with no server strings installed", () => {
    expect(wizardLabel("sommelier.wizard_title")).toBe("Step-by-step brew");
    expect(wizardLabel("sommelier.finish")).toBe("Finish");
    expect(wizardLabel("sommelier.phase_running")).toBe(
      "Phase started — let the machine finish, then continue",
    );
    expect(wizardLabel("sommelier.brew_phase", { n: 1, total: 2 }))
      .toBe("Brew phase 1/2");
  });

  it("keeps the bundle fallback localized, and the served string wins", () => {
    setLanguage(hassWith("de"));
    expect(wizardLabel("sommelier.wizard_title")).toBe("Schritt-für-Schritt-Zubereitung");
    setServerStrings({ "wizard.title": "Brühanleitung" });
    expect(wizardLabel("sommelier.wizard_title")).toBe("Brühanleitung");
  });

  it("unmapped keys go straight to the bundle", () => {
    setServerStrings({ "wizard.title": "served" });
    expect(wizardLabel("sommelier.title")).toBe("AI Sommelier");
    expect(wizardLabel("no.such.key")).toBe("no.such.key");
  });

  it("ignores a served map that lacks every wizard key", () => {
    setServerStrings({ "status.process.READY": "Ready" });
    expect(wizardLabel("sommelier.done")).toBe("Done");
  });
});

// ---------------------------------------------------------------------------
// Tier 2 stays intact: the bundles keep every wired key, in all 29 languages
// ---------------------------------------------------------------------------

describe("card bundles remain the tier-2 fallback", () => {
  const langDir = join(__dirname, "../src/localize/languages");
  const files = readdirSync(langDir).filter((f) => f.endsWith(".json"));

  function resolve(obj: unknown, key: string): unknown {
    return key.split(".").reduce<unknown>(
      (o, k) =>
        typeof o === "object" && o !== null
          ? (o as Record<string, unknown>)[k]
          : undefined,
      obj,
    );
  }

  it("still ships 29 language bundles", () => {
    expect(files.length).toBe(29);
  });

  it.each(files)("%s keeps every wired wizard and error key", (file) => {
    const data = JSON.parse(readFileSync(join(langDir, file), "utf8"));
    for (const cardKey of Object.keys(WIZARD_SERVER_KEYS)) {
      expect(typeof resolve(data, cardKey)).toBe("string");
    }
    for (const code of AGENT_ERROR_CODES) {
      expect(typeof resolve(data, `sommelier.err.${code}`)).toBe("string");
    }
  });
});
