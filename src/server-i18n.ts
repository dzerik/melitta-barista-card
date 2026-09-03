// Server-served machine-domain i18n client (spec §6.3, 0.92 amendment).
//
// Split per spec §6.3.5.6 — two halves in one module:
//   (a) a PURE synchronous registry — setServerStrings / serverString /
//       resetServerStrings — with zero Home Assistant imports. This is ALL
//       that label/format modules may import; label functions stay synchronous
//       and the pure-module isolation the test suites depend on is preserved.
//   (b) a hass-coupled fetch/cache/failure-classification half —
//       fetchServerStrings — called only from top-level card wiring, which
//       feeds (a) via setServerStrings.
//
// Server strings are a DISPLAY layer only (§6.3.2): failure here — durable
// `unknown_command` on a 0.91 server, or any transient error — degrades only
// display strings to the client bundles; never token semantics, catalogs, or
// status handling. Keys are flat, dot-joined, byte-equal to contract tokens
// (§6.3.1); no case-folding anywhere.

import type { ContractHass } from "./contract";

/** WS command name for machine-domain i18n (spec §6.3.1). Not entry-scoped. */
export const WS_I18N_GET = "melitta_barista/i18n/get";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// ---------------------------------------------------------------------------
// (a) Pure registry — the only surface label/format modules import.
// ---------------------------------------------------------------------------

let registry: Map<string, string> | null = null;

/**
 * Install (or clear, with null) the server-string map for the session.
 *
 * Called from top-level wiring after a successful fetchServerStrings; the map
 * replaces the previous one wholesale. Non-string values are dropped —
 * unknown or malformed keys must fall through the §6.3.5.1 preference order
 * per key, never break lookup.
 */
export function setServerStrings(strings: Record<string, string> | null): void {
  if (strings === null) {
    registry = null;
    return;
  }
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(strings)) {
    if (typeof value === "string") map.set(key, value);
  }
  registry = map;
}

/**
 * Look up one server string by its flat dot-joined key (spec §6.3.1), e.g.
 * "status.process.READY" or "values.intensity.very_mild".
 *
 * Returns undefined when no server strings are installed or the key is
 * missing — the caller falls through to its bundle string, then to the
 * humanized raw token (§6.3.5.1). Casing is significant and byte-equal to
 * contract tokens; keys are never case-folded.
 */
export function serverString(key: string): string | undefined {
  return registry?.get(key);
}

/** Clear the installed server strings (registry half only; cache untouched). */
export function resetServerStrings(): void {
  registry = null;
}

// ---------------------------------------------------------------------------
// (b) Fetch / cache / failure classification — top-level wiring only.
// ---------------------------------------------------------------------------

interface CachedLocaleStrings {
  strings_version: string;
  strings: Record<string, string>;
}

/** Session cache per requested locale, keyed by strings_version (§6.3.2). */
const localeCache = new Map<string, CachedLocaleStrings>();

/** Durable failure: the server has no i18n/get (0.91) — never re-probe. */
let durable = false;
let warned = false;

function warnOnce(kind: "durable" | "transient", detail: unknown): void {
  if (warned) return;
  warned = true;
  console.warn(
    `melitta-barista-card: i18n/get fetch failed (${kind}); `
    + `display strings fall back to the card bundles`,
    detail,
  );
}

function parseI18nResponse(data: unknown): CachedLocaleStrings | null {
  if (!isRecord(data)) return null;
  if (typeof data.strings_version !== "string" || data.strings_version === "") return null;
  if (!isRecord(data.strings)) return null;
  const strings: Record<string, string> = {};
  for (const [key, value] of Object.entries(data.strings)) {
    if (typeof value === "string") strings[key] = value;
  }
  return { strings_version: data.strings_version, strings };
}

/**
 * Fetch the server-string map for a locale over WS (spec §6.3.1/§6.3.2).
 *
 * Session-cached per locale with `strings_version` as the storage key, never
 * the trigger: the CALLER re-invokes on the §6.3.2 triggers (session start,
 * HA locale change, contract_fingerprint change) and passes the contract
 * document's `strings_version` as `expectedStringsVersion` when it has one —
 * a cached entry matching it is returned WITHOUT a WS round-trip (the
 * fingerprint-change short-circuit). When a re-fetch does go out and returns
 * the cached `strings_version`, the cached strings stand (same object).
 *
 * Failure classification, never throws:
 * - Durable (WS `unknown command` — a 0.91 server): null for the rest of the
 *   session, no re-probing, for every locale.
 * - Transient (network/auth errors, malformed payload): null now; the next
 *   trigger-driven call attempts again. When a stale cache exists for the
 *   locale, it is returned instead of null — old display strings beat raw
 *   tokens (§6.3.5.1 still prefers them over nothing).
 *
 * Degrades only display strings (§6.3.2) — the caller keeps bundles as the
 * fallback layer and never treats null as an error.
 */
export async function fetchServerStrings(
  hass: ContractHass, locale: string, expectedStringsVersion?: string | null,
): Promise<Record<string, string> | null> {
  const cached = localeCache.get(locale);
  if (cached && (expectedStringsVersion == null
      || cached.strings_version === expectedStringsVersion)) {
    return cached.strings;
  }
  if (durable) return cached ? cached.strings : null;

  let response: unknown;
  try {
    response = await hass.callWS({ type: WS_I18N_GET, locale });
  } catch (err) {
    if (isRecord(err) && err.code === "unknown_command") {
      durable = true;
      warnOnce("durable", err);
    } else {
      warnOnce("transient", err);
    }
    return cached ? cached.strings : null;
  }

  const parsed = parseI18nResponse(response);
  if (!parsed) {
    warnOnce("transient", response);
    return cached ? cached.strings : null;
  }
  if (cached && cached.strings_version === parsed.strings_version) {
    // Re-fetch returned the cached strings_version: the cached strings stand
    // (§6.3.2 — strings_version is the equality axis).
    return cached.strings;
  }
  localeCache.set(locale, parsed);
  return parsed.strings;
}

/**
 * True when the strings cached for `locale` predate `expected` — the wiring's
 * re-arm probe for the §6.3.2 fingerprint-change trigger.
 *
 * At fingerprint-change time the contract refetch is still in flight, so the
 * wiring can only pass the OLD document's strings_version and the cache
 * short-circuit correctly stands. This probe closes the gap: once the NEW
 * contract document lands, its strings_version disagrees with the cached one
 * and the wiring re-fetches — an integration upgrade arms exactly one
 * re-fetch (§6.3.2), even though its two halves (fingerprint, then
 * strings_version) arrive on different update passes. No expectation, or no
 * cache for the locale, is never stale — degradation stays independent.
 */
export function stringsVersionStale(
  locale: string, expected: string | null | undefined,
): boolean {
  if (expected == null) return false;
  const cached = localeCache.get(locale);
  return cached !== undefined && cached.strings_version !== expected;
}

/** Test-only: drop the locale cache, durable flag, and warn state. */
export function _resetServerI18nState(): void {
  localeCache.clear();
  durable = false;
  warned = false;
}
