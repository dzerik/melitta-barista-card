// Zone C-D pure wiring helpers (UI Contract §7.2 C-D).
// No Lit, no Home Assistant imports — testable in isolation.
//
// These helpers implement the "prefer contract data, fall back to hardcoded
// consts" rule for the card wiring layer:
//  - resolveFreestyleVocab(): freestyle picker option lists + portion-slider
//    limits from contract.vocabularies.freestyle / contract.limits, falling
//    back per-field to the legacy const.ts values (degradation is per-feature,
//    spec §2.3.5 — one malformed list never drags the whole form to legacy).
//  - iconSpecForRecipe(): per-recipe IconSpec lookup from the select entity's
//    `recipes` attribute first, then the contract catalog; only when neither
//    surface knows the recipe does the caller use the legacy DRINKS name
//    lookup (spec: "no client ever joins by display name again" — within one
//    entity the display name is the join key HA gives us, which is fine).
//  - contractAllowsFreestyle(): capability gate for the freestyle section.

import { readContractParameters, type UiContract, type IconSpec } from "./contract";
import {
  FREESTYLE_PROCESSES,
  FREESTYLE_PROCESSES_WITH_NONE,
  FREESTYLE_INTENSITIES,
  FREESTYLE_AROMAS,
  FREESTYLE_TEMPERATURES,
  FREESTYLE_SHOTS,
  PORTION_LIMITS,
} from "./const";

/** Numeric range for one portion slider. */
export interface PortionLimit {
  min: number;
  max: number;
  step: number;
}

/** Resolved option lists + limits for the freestyle/edit component forms. */
export interface FreestyleVocab {
  /** Component-1 process options (never contains "none"). */
  processes: readonly string[];
  /** Component-2 process options ("none" always first). */
  processesWithNone: readonly string[];
  intensities: readonly string[];
  aromas: readonly string[];
  temperatures: readonly string[];
  shots: readonly string[];
  limits: { c1: PortionLimit; c2: PortionLimit };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** A non-empty array of strings, or null (→ per-field legacy fallback). */
function stringList(v: unknown): string[] | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  return v.every((x) => typeof x === "string") ? (v as string[]) : null;
}

function portionLimit(v: unknown, fallback: PortionLimit): PortionLimit {
  if (!isRecord(v)) return fallback;
  const { min, max, step } = v;
  if (typeof min !== "number" || typeof max !== "number" || typeof step !== "number") {
    return fallback;
  }
  return { min, max, step };
}

/**
 * Resolve the freestyle picker vocabularies and portion limits.
 *
 * With a contract, each list is the machine-filtered subset the server sent
 * (spec §3.2: "the client renders exactly what it receives"), including any
 * unknown future tokens. Without a contract — or per-field when a list is
 * empty/malformed — the legacy const.ts values apply unchanged.
 */
export function resolveFreestyleVocab(contract: UiContract | null | undefined): FreestyleVocab {
  const fs = contract?.vocabularies?.freestyle;
  const process = stringList(fs?.process) ?? [...FREESTYLE_PROCESSES_WITH_NONE];
  const withNone = process.includes("none")
    ? ["none", ...process.filter((p) => p !== "none")]
    : ["none", ...process];
  return {
    processes: process.filter((p) => p !== "none").length > 0
      ? process.filter((p) => p !== "none")
      : [...FREESTYLE_PROCESSES],
    processesWithNone: withNone,
    intensities: stringList(fs?.intensity) ?? [...FREESTYLE_INTENSITIES],
    aromas: stringList(fs?.aroma) ?? [...FREESTYLE_AROMAS],
    temperatures: stringList(fs?.temperature) ?? [...FREESTYLE_TEMPERATURES],
    shots: stringList(fs?.shots) ?? [...FREESTYLE_SHOTS],
    limits: {
      c1: portionLimit(contract?.limits?.portion_ml?.c1, { ...PORTION_LIMITS.c1 }),
      c2: portionLimit(contract?.limits?.portion_ml?.c2, { ...PORTION_LIMITS.c2 }),
    },
  };
}

// ---------------------------------------------------------------------------
// Zone C-F: v2 parameter-catalog wiring (spec §6.1.5 three-tier fallback).
// ---------------------------------------------------------------------------

/** The one descriptor scope this card renders parameters under (§6.1.1). */
const FREESTYLE_SCOPE = "freestyle";

/** Families whose legacy (pre-catalog) rule is "coffee component only" —
 *  mirrors the historical hardcoded `!isCoffee` disables in controls.ts. */
const COFFEE_ONLY_FAMILIES: readonly string[] = ["intensity", "aroma", "shots"];

/** Parameter families the freestyle/edit component form renders. */
export const FREESTYLE_PARAMETER_FAMILIES = [
  "process", "intensity", "aroma", "temperature", "shots", "portion_ml",
] as const;

/** A string array (possibly empty), or null. Unlike stringList, an empty
 *  array is meaningful here: `applies_to: []` attaches to no process. */
function optionalStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v) || !v.every((x) => typeof x === "string")) return null;
  return v as string[];
}

/**
 * FreestyleVocab plus the v2 catalog metadata (spec §6.1). A strict superset:
 * every consumer of FreestyleVocab accepts a ResolvedParameters unchanged.
 */
export interface ResolvedParameters extends FreestyleVocab {
  /**
   * Per family: freestyle process tokens the parameter attaches to
   * (`applies_to`, §6.1.1); null = all processes. In tier-2/tier-3 modes this
   * carries the legacy hardcoded rule (intensity/aroma/shots → coffee only).
   */
  appliesTo: Record<string, readonly string[] | null>;
  /**
   * Per family: false when a served descriptor scopes the family away from
   * freestyle UI — brew_override-only or unknown scopes (§6.1.1/§6.1.4 note).
   * Such a family is omitted from the form, never tier-fallen-back.
   */
  rendered: Record<string, boolean>;
  /** Portion slider unit from a tier-1 range descriptor; null otherwise. */
  portionUnit: string | null;
}

/**
 * Resolve the freestyle form's parameters with the normative §6.1.5
 * three-tier per-parameter fallback:
 *
 *   `parameters.<family>` → v1 `vocabularies.freestyle.<family>` /
 *   `limits.portion_ml` → const.ts.
 *
 * Tier 2 is built by resolveFreestyleVocab (which already folds tier 3 in
 * per field — today's 2.6.x behaviour, mandatory for 0.91 servers); tier 1
 * then overrides per family from the readContractParameters() view, in which
 * unknown-kind/structurally-unusable descriptors are already dropped (§6.0.3)
 * so their families fall through naturally. A descriptor whose scope does not
 * include "freestyle" marks its family not-rendered instead (§6.1.1); range
 * descriptors drive the slider config (min/max/step/unit), flat ranges
 * applying to both components.
 */
export function resolveParameters(contract: UiContract | null | undefined): ResolvedParameters {
  const base = resolveFreestyleVocab(contract);
  const out: ResolvedParameters = {
    ...base,
    appliesTo: {
      process: null,
      intensity: ["coffee"],
      aroma: ["coffee"],
      temperature: null,
      shots: ["coffee"],
      portion_ml: null,
    },
    rendered: {
      process: true, intensity: true, aroma: true,
      temperature: true, shots: true, portion_ml: true,
    },
    portionUnit: null,
  };
  const params = contract ? readContractParameters(contract) : null;
  if (!params) return out; // tiers 2/3 (0.91 server, or no contract at all)

  const applyEnum = (family: string, apply: (tokens: string[]) => void): void => {
    const d = params[family];
    if (!d) return; // absent or reader-dropped → per-parameter fallback
    if (!d.scope.includes(FREESTYLE_SCOPE)) {
      out.rendered[family] = false; // §6.1.1: not rendered as freestyle UI
      return;
    }
    if (d.kind !== "enum") return; // wrong kind for an enum family → fallback
    const tokens = stringList(d.tokens);
    if (!tokens) return; // empty/malformed list → per-parameter fallback
    apply(tokens);
    out.appliesTo[family] = optionalStringArray(d.applies_to);
  };

  applyEnum("process", (tokens) => {
    const noNone = tokens.filter((p) => p !== "none");
    if (noNone.length > 0) out.processes = noNone;
    out.processesWithNone = ["none", ...noNone];
  });
  applyEnum("intensity", (t) => { out.intensities = t; });
  applyEnum("aroma", (t) => { out.aromas = t; });
  applyEnum("temperature", (t) => { out.temperatures = t; });
  applyEnum("shots", (t) => { out.shots = t; });

  const p = params.portion_ml;
  if (p) {
    if (!p.scope.includes(FREESTYLE_SCOPE)) {
      out.rendered.portion_ml = false;
    } else if (p.kind === "range") {
      if (p.per_component === true) {
        out.limits = {
          c1: portionLimit(p.c1, base.limits.c1),
          c2: portionLimit(p.c2, base.limits.c2),
        };
      } else {
        // Flat min/max/step: one range descriptor drives both sliders.
        out.limits = {
          c1: portionLimit(p, base.limits.c1),
          c2: portionLimit(p, base.limits.c2),
        };
      }
      out.portionUnit = typeof p.unit === "string" ? p.unit : null;
      out.appliesTo.portion_ml = optionalStringArray(p.applies_to);
    }
  }
  return out;
}

/**
 * Whether a parameter family attaches to a component with the given process
 * (`applies_to` filtering, §6.1.1) — drives the form's disabled styling.
 *
 * Accepts a plain FreestyleVocab from pre-catalog callers, for which the
 * legacy hardcoded rule applies (intensity/aroma/shots enabled only on a
 * coffee component; everything else always enabled).
 */
export function parameterEnabledFor(
  vocab: FreestyleVocab | ResolvedParameters, family: string, process: string,
): boolean {
  if ("appliesTo" in vocab && family in vocab.appliesTo) {
    const list = vocab.appliesTo[family];
    return list === null || list.includes(process);
  }
  return !COFFEE_ONLY_FAMILIES.includes(family) || process === "coffee";
}

/**
 * Whether a parameter family is rendered in the freestyle form at all.
 * False only when a served descriptor scoped the family away from freestyle
 * UI (§6.1.1); plain FreestyleVocab callers always render everything.
 */
export function parameterRendered(
  vocab: FreestyleVocab | ResolvedParameters, family: string,
): boolean {
  if ("rendered" in vocab) return vocab.rendered[family] !== false;
  return true;
}

/**
 * Capability gate for the freestyle section: false only when a contract is
 * present and declares `supports_freestyle: false` (e.g. Nivona). Without a
 * contract the legacy behaviour (section available) is preserved.
 */
export function contractAllowsFreestyle(contract: UiContract | null | undefined): boolean {
  if (!contract) return true;
  return contract.capabilities.supports_freestyle !== false;
}

/** Result of a per-recipe icon lookup. */
export interface RecipeIconLookup {
  /**
   * True when a contract-era surface knows this recipe and its `icon` field is
   * authoritative (icon === null then means "render the generic default icon",
   * spec §3.3). False → the caller falls back to the legacy name lookup.
   */
  found: boolean;
  icon: IconSpec | null;
}

function iconFromEntry(entry: Record<string, unknown>): RecipeIconLookup {
  const icon = entry.icon;
  // Malformed icon values degrade to the generic default, never to a throw.
  return { found: true, icon: isRecord(icon) ? (icon as unknown as IconSpec) : null };
}

/**
 * Find the IconSpec for a recipe display name (spec §7.2 C-D: prefer the
 * per-recipe `icon` from the `recipes` attribute, then the contract catalog,
 * over the legacy English-name lookup).
 *
 * `recipesAttr` is the raw `recipes` attribute of `select.<prefix>_recipe`
 * (untrusted shape — old integrations ship entries without an `icon` key,
 * which correctly reports not-found and keeps the legacy path).
 */
export function iconSpecForRecipe(
  name: string,
  recipesAttr: unknown,
  contract: UiContract | null | undefined,
): RecipeIconLookup {
  if (Array.isArray(recipesAttr)) {
    for (const entry of recipesAttr) {
      if (isRecord(entry) && entry.name === name && "icon" in entry) {
        return iconFromEntry(entry);
      }
    }
  }
  if (contract && Array.isArray(contract.recipes)) {
    for (const entry of contract.recipes) {
      if (isRecord(entry) && entry.name === name && "icon" in entry) {
        return iconFromEntry(entry);
      }
    }
  }
  return { found: false, icon: null };
}
