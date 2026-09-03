// Zone C-E: server-served machine-domain i18n (spec §6.3, 0.92 amendment).
// Covers both halves of the §6.3.5.6 split: the pure registry and the
// hass-coupled fetch/cache/failure-classification half.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  WS_I18N_GET,
  setServerStrings,
  serverString,
  resetServerStrings,
  fetchServerStrings,
  stringsVersionStale,
  _resetServerI18nState,
} from "../src/server-i18n";

// ---------------------------------------------------------------------------
// Fixtures — the §6.3.1 example response, verbatim.
// ---------------------------------------------------------------------------

const DE_STRINGS = {
  "status.process.READY": "Bereit",
  "status.manipulation.FILL_WATER": "Wassertank füllen",
  "values.intensity.very_mild": "Sehr mild",
  "recipes.name.espresso": "Espresso",
  "actions.easy_clean.label": "Easy Clean",
  "actions.easy_clean.description": "Milchsystem spülen",
  "actions._groups.cleaning": "Reinigung",
};

const DE_RESPONSE = {
  "schema_version": 1,
  "locale": "de-DE",
  "resolved_locale": "de",
  "strings_version": "0.92.0",
  "strings": DE_STRINGS,
};

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function hassWith(ws: (msg: unknown) => Promise<unknown>) {
  const fn = vi.fn(ws);
  return { hass: { callWS: fn as <T>(msg: { type: string }) => Promise<T> }, fn };
}

let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  _resetServerI18nState();
  resetServerStrings();
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

// ---------------------------------------------------------------------------
// (a) Pure registry — setServerStrings / serverString / resetServerStrings
// ---------------------------------------------------------------------------

describe("server-string registry", () => {
  it("returns undefined for every key before any strings are set", () => {
    expect(serverString("status.process.READY")).toBeUndefined();
  });

  it("serves installed strings by flat dot-joined key (§6.3.1)", () => {
    setServerStrings(DE_STRINGS);
    expect(serverString("status.process.READY")).toBe("Bereit");
    expect(serverString("values.intensity.very_mild")).toBe("Sehr mild");
    expect(serverString("actions._groups.cleaning")).toBe("Reinigung");
  });

  it("returns undefined for a missing key (per-key fallthrough, §6.3.5.1/.4)", () => {
    setServerStrings(DE_STRINGS);
    expect(serverString("status.process.SOME_FUTURE_PROCESS")).toBeUndefined();
    expect(serverString("values.intensity.extra_strong")).toBeUndefined();
  });

  it("casing is significant — keys are byte-equal to tokens, never case-folded (§6.3.5.5)", () => {
    setServerStrings(DE_STRINGS);
    expect(serverString("status.process.ready")).toBeUndefined();
    expect(serverString("STATUS.PROCESS.READY")).toBeUndefined();
  });

  it("does not resolve inherited object-prototype names as keys", () => {
    setServerStrings(DE_STRINGS);
    expect(serverString("toString")).toBeUndefined();
    expect(serverString("constructor")).toBeUndefined();
  });

  it("replaces the map wholesale on set and drops non-string values", () => {
    setServerStrings(DE_STRINGS);
    setServerStrings({ "status.process.READY": "Prêt", "bad.key": 42 as unknown as string });
    expect(serverString("status.process.READY")).toBe("Prêt");
    expect(serverString("bad.key")).toBeUndefined();
    expect(serverString("recipes.name.espresso")).toBeUndefined(); // old map gone
  });

  it("setServerStrings(null) and resetServerStrings() both clear the registry", () => {
    setServerStrings(DE_STRINGS);
    setServerStrings(null);
    expect(serverString("status.process.READY")).toBeUndefined();

    setServerStrings(DE_STRINGS);
    resetServerStrings();
    expect(serverString("status.process.READY")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// (b) fetchServerStrings — cache, short-circuit, durable/transient fallback
// ---------------------------------------------------------------------------

describe("fetchServerStrings", () => {
  it("fetches over WS with the §6.3.1 request shape and returns the strings map", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    const strings = await fetchServerStrings(hass, "de-DE");
    expect(strings).toEqual(DE_STRINGS);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ type: WS_I18N_GET, locale: "de-DE" });
    expect(WS_I18N_GET).toBe("melitta_barista/i18n/get");
  });

  it("does NOT feed the pure registry — wiring calls setServerStrings (§6.3.5.6 split)", async () => {
    const { hass } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    await fetchServerStrings(hass, "de-DE");
    expect(serverString("status.process.READY")).toBeUndefined();
  });

  it("serves the session cache per locale — no WS on a repeat call", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    const first = await fetchServerStrings(hass, "de-DE");
    const second = await fetchServerStrings(hass, "de-DE");
    expect(second).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("caches per locale — a different locale fetches separately", async () => {
    const { hass, fn } = hassWith((msg) => {
      const m = msg as { locale: string };
      return Promise.resolve(m.locale === "fr"
        ? { ...clone(DE_RESPONSE), locale: "fr", resolved_locale: "fr",
            strings: { "status.process.READY": "Prêt" } }
        : clone(DE_RESPONSE));
    });
    const de = await fetchServerStrings(hass, "de-DE");
    const fr = await fetchServerStrings(hass, "fr");
    expect(de!["status.process.READY"]).toBe("Bereit");
    expect(fr!["status.process.READY"]).toBe("Prêt");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("short-circuits WITHOUT a WS call when the cached strings_version matches the expected one (§6.3.2)", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    const first = await fetchServerStrings(hass, "de-DE");
    expect(fn).toHaveBeenCalledTimes(1);

    // Fingerprint changed → wiring re-invokes, passing the contract document's
    // strings_version. It matches the cache → no round-trip, cached strings stand.
    const again = await fetchServerStrings(hass, "de-DE", "0.92.0");
    expect(again).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("re-fetches when the expected strings_version differs (integration upgrade)", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    await fetchServerStrings(hass, "de-DE");

    const upgraded = {
      ...clone(DE_RESPONSE),
      strings_version: "0.93.0",
      strings: { ...DE_STRINGS, "status.process.READY": "Bereit!" },
    };
    fn.mockImplementation(() => Promise.resolve(upgraded));
    const strings = await fetchServerStrings(hass, "de-DE", "0.93.0");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(strings!["status.process.READY"]).toBe("Bereit!");

    // The new version is now the cached one — matching expectation short-circuits.
    expect(await fetchServerStrings(hass, "de-DE", "0.93.0")).toBe(strings);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("a re-fetch that returns the cached strings_version leaves the cached strings standing (§6.3.2)", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    const first = await fetchServerStrings(hass, "de-DE");

    // Wiring believes a newer version exists, but the server still answers 0.92.0
    // (e.g. a fingerprint change unrelated to an upgrade): cached strings stand.
    const again = await fetchServerStrings(hass, "de-DE", "0.99.0");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(again).toBe(first);
  });

  it("classifies WS unknown command as DURABLE for the whole session and every locale", async () => {
    const { hass, fn } = hassWith(() => Promise.reject({ code: "unknown_command" }));
    expect(await fetchServerStrings(hass, "de-DE")).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);

    // No re-probing — the endpoint is not entry- or locale-scoped (§6.3.1).
    expect(await fetchServerStrings(hass, "de-DE")).toBeNull();
    expect(await fetchServerStrings(hass, "fr")).toBeNull();
    expect(await fetchServerStrings(hass, "de-DE", "0.92.0")).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("treats network errors as TRANSIENT — the next trigger-driven call retries", async () => {
    const { hass, fn } = hassWith(() => Promise.reject(new Error("socket closed")));
    expect(await fetchServerStrings(hass, "de-DE")).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);

    fn.mockImplementation(() => Promise.resolve(clone(DE_RESPONSE)));
    expect(await fetchServerStrings(hass, "de-DE")).toEqual(DE_STRINGS);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("returns the stale cached strings when a version-armed re-fetch fails transiently", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    const first = await fetchServerStrings(hass, "de-DE");

    fn.mockImplementation(() => Promise.reject(new Error("socket closed")));
    const stale = await fetchServerStrings(hass, "de-DE", "0.93.0");
    expect(stale).toBe(first); // old display strings beat raw tokens
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("treats a malformed response as TRANSIENT and never caches it", async () => {
    for (const bad of [
      { garbage: true },
      { ...clone(DE_RESPONSE), strings: "nope" },
      { ...clone(DE_RESPONSE), strings_version: 7 },
      null,
      "nope",
    ]) {
      _resetServerI18nState();
      const { hass, fn } = hassWith(() => Promise.resolve(bad));
      expect(await fetchServerStrings(hass, "de-DE")).toBeNull();
      fn.mockImplementation(() => Promise.resolve(clone(DE_RESPONSE)));
      expect(await fetchServerStrings(hass, "de-DE")).toEqual(DE_STRINGS);
    }
  });

  it("drops non-string values from a served strings map", async () => {
    const { hass } = hassWith(() => Promise.resolve({
      ...clone(DE_RESPONSE),
      strings: { "status.process.READY": "Bereit", "bad.key": 42, "worse.key": null },
    }));
    const strings = await fetchServerStrings(hass, "de-DE");
    expect(strings).toEqual({ "status.process.READY": "Bereit" });
  });

  it("warns on console exactly once", async () => {
    const { hass } = hassWith(() => Promise.reject(new Error("boom")));
    await fetchServerStrings(hass, "de-DE");
    await fetchServerStrings(hass, "de-DE");
    await fetchServerStrings(hass, "fr");
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("never throws — display strings degrade, nothing else (§6.3.2)", async () => {
    const { hass } = hassWith(() => Promise.reject(new Error("boom")));
    await expect(fetchServerStrings(hass, "de-DE")).resolves.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// stringsVersionStale — the wiring's re-arm probe for the §6.3.2
// fingerprint-change/upgrade trigger (contract strings_version arrival).
// ---------------------------------------------------------------------------

describe("stringsVersionStale", () => {
  it("is false with no cache for the locale, whatever is expected", () => {
    expect(stringsVersionStale("de-DE", "0.93.0")).toBe(false);
    expect(stringsVersionStale("de-DE", null)).toBe(false);
    expect(stringsVersionStale("de-DE", undefined)).toBe(false);
  });

  it("is false with a cache but no expected version (no contract document yet)", async () => {
    const { hass } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    await fetchServerStrings(hass, "de-DE");
    expect(stringsVersionStale("de-DE", null)).toBe(false);
    expect(stringsVersionStale("de-DE", undefined)).toBe(false);
  });

  it("compares the cached version for the locale against the expected one", async () => {
    const { hass } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    await fetchServerStrings(hass, "de-DE");
    expect(stringsVersionStale("de-DE", "0.92.0")).toBe(false);
    expect(stringsVersionStale("de-DE", "0.93.0")).toBe(true);
    expect(stringsVersionStale("fr", "0.93.0")).toBe(false); // other locale uncached
  });

  it("§6.3.2 upgrade sequence: the OLD expected version at fingerprint-trigger time short-circuits, then the NEW contract's strings_version arms exactly one re-fetch", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));

    // t0: session start — first activation fetch.
    const first = await fetchServerStrings(hass, "de-DE");
    expect(fn).toHaveBeenCalledTimes(1);

    // t1: integration upgrade → contract_fingerprint change. The contract
    // refetch is still in flight, so the wiring only has the OLD document's
    // strings_version — cache matches, no round-trip, no staleness yet.
    expect(stringsVersionStale("de-DE", "0.92.0")).toBe(false);
    expect(await fetchServerStrings(hass, "de-DE", "0.92.0")).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);

    // t2: the NEW contract document lands carrying strings_version 0.93.0 —
    // the probe re-arms the wiring even though locale/fingerprint trackers
    // already match.
    expect(stringsVersionStale("de-DE", "0.93.0")).toBe(true);
    const upgraded = {
      ...clone(DE_RESPONSE),
      strings_version: "0.93.0",
      strings: { ...DE_STRINGS, "status.process.READY": "Bereit!" },
    };
    fn.mockImplementation(() => Promise.resolve(upgraded));
    const strings = await fetchServerStrings(hass, "de-DE", "0.93.0");
    expect(fn).toHaveBeenCalledTimes(2); // exactly one WS re-fetch
    expect(strings!["status.process.READY"]).toBe("Bereit!");

    // Disarmed: the probe is quiet again and a repeat pass costs nothing.
    expect(stringsVersionStale("de-DE", "0.93.0")).toBe(false);
    expect(await fetchServerStrings(hass, "de-DE", "0.93.0")).toBe(strings);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("stays armed after a transient re-fetch failure so the next trigger-driven pass retries", async () => {
    const { hass, fn } = hassWith(() => Promise.resolve(clone(DE_RESPONSE)));
    const first = await fetchServerStrings(hass, "de-DE");

    fn.mockImplementation(() => Promise.reject(new Error("socket closed")));
    expect(await fetchServerStrings(hass, "de-DE", "0.93.0")).toBe(first);
    expect(stringsVersionStale("de-DE", "0.93.0")).toBe(true); // still stale → retried later
  });
});
