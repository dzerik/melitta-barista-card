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

import type { UiContract, IconSpec } from "./contract";
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
