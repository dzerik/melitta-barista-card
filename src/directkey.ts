// DirectKey model (UI Contract v3, spec §9.3) + the frozen attribute parser.
//
// Two layers, deliberately split (§9.3.4):
//  * `resolveDirectKeyModel` — the MODEL: category set/order/icons/
//    machine_button and profile slot bindings from `contract.directkey`,
//    with the §9.3.6 rule-1 tier fallback to the hardcoded 2.7.0 arrays.
//  * `parseDirectKeyData` — the DATA: per-slot recipe contents from the
//    frozen `directkey_recipes` select attribute (push-updated with entity
//    state; `recipes/list` is a poll lane the card deliberately does not
//    adopt — card 2.9+ MAY, per §10.3 zone C-K).

import { DIRECTKEY_CATEGORIES, DIRECTKEY_DISPLAY_TO_KEY } from "./const";
import type { UiContract } from "./contract";
import type { ProfileSlotEntry } from "./profile";
import type { DirectKeyData, DirectKeyRecipe } from "./types";

export type { ProfileSlotEntry } from "./profile";

// ---------------------------------------------------------------------------
// Contract shape (spec §9.3.2). Defined here, not in contract.ts:
// validateContract MUST NOT require v3 fields (§9.0.1), so the block is read
// through a widening cast exactly like the v2 feature readers.
// ---------------------------------------------------------------------------

/** One `directkey.categories[]` entry as served (spec §9.3.2). */
export interface DirectKeyCategoryEntry {
  category: string;
  id: number;
  machine_button: boolean;
  icon: string;
}

/** The additive top-level `contract.directkey` block (spec §9.3.2). */
export interface ContractDirectKey {
  categories: DirectKeyCategoryEntry[];
  profiles: ProfileSlotEntry[];
  profile_select_entity_suffix: string;
  active_profile_attribute: string;
}

// ---------------------------------------------------------------------------
// Resolved model
// ---------------------------------------------------------------------------

/** One category in resolved render order (§9.3.6 rule 2). */
export interface DirectKeyCategoryModel {
  /** Category token (`values.directkey_category.*` i18n key; unknown tokens tolerated). */
  category: string;
  /**
   * §9.3.1: false = no dedicated key on the machine's front panel. Hide or
   * de-emphasize only — never disable the BLE brew path (§9.3.6 rule 3).
   */
  machineButton: boolean;
  /** Served mdi fallback icon, or null on the legacy tier (coffeeIconSvg is used). */
  icon: string | null;
}

/** Resolved DirectKey model — tier 1 (contract) or tier 2 (legacy 2.7.0). */
export interface DirectKeyModel {
  /** "contract" = catalog-driven; "legacy" = exactly-2.7.0 fallback behaviour. */
  source: "contract" | "legacy";
  /** Render order is the served order (tier 1) or the frozen const order (tier 2). */
  categories: DirectKeyCategoryModel[];
  /**
   * Profile slot bindings (§9.3.6 rule 4), or null on the legacy tier — the
   * card then keeps its 2.7.0 select-options-driven profile tabs.
   */
  profiles: ProfileSlotEntry[] | null;
  /** Entity anchor for the profile select ("profile" on both tiers today). */
  profileSelectSuffix: string;
  /** Attribute on that select carrying the active profile (§9.3.6 rule 4). */
  activeProfileAttribute: string;
}

const DEFAULT_PROFILE_SELECT_SUFFIX = "profile";
const DEFAULT_ACTIVE_PROFILE_ATTRIBUTE = "active_profile";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function legacyModel(): DirectKeyModel {
  return {
    source: "legacy",
    categories: DIRECTKEY_CATEGORIES.map((category) => ({
      category,
      machineButton: true,
      icon: null,
    })),
    profiles: null,
    profileSelectSuffix: DEFAULT_PROFILE_SELECT_SUFFIX,
    activeProfileAttribute: DEFAULT_ACTIVE_PROFILE_ATTRIBUTE,
  };
}

function readCategoryEntry(v: unknown): DirectKeyCategoryModel | null {
  if (!isRecord(v)) return null;
  if (typeof v.category !== "string" || v.category === "") return null;
  return {
    category: v.category,
    // Fail-open like the action catalog's advisory fields: the flag gates
    // styling, never correctness (§9.3.1 — the category always exists).
    machineButton: typeof v.machine_button === "boolean" ? v.machine_button : true,
    icon: typeof v.icon === "string" && v.icon !== "" ? v.icon : null,
  };
}

function readProfileEntry(v: unknown): ProfileSlotEntry | null {
  if (!isRecord(v)) return null;
  if (typeof v.slot !== "number" || !Number.isInteger(v.slot) || v.slot < 0) return null;
  const entry: ProfileSlotEntry = { slot: v.slot };
  if (v.fixed === true) entry.fixed = true;
  if (typeof v.name_key === "string" && v.name_key !== "") entry.name_key = v.name_key;
  if (typeof v.name_entity_suffix === "string" && v.name_entity_suffix !== "") {
    entry.name_entity_suffix = v.name_entity_suffix;
  }
  if (typeof v.active_entity_suffix === "string" && v.active_entity_suffix !== "") {
    entry.active_entity_suffix = v.active_entity_suffix;
  }
  return entry;
}

/**
 * Resolve the DirectKey model from a contract document (spec §9.3.6 rule 1).
 *
 * Tier 1: a well-formed `contract.directkey` block drives category set,
 * render order (= served order), icons, `machine_button`, and profile slot
 * bindings. Malformed category/profile entries are dropped individually
 * (§6.0.3 precedent); unknown category tokens are kept (unknown-token
 * tolerance). A malformed/empty `profiles` list degrades only the profile
 * half (`profiles: null` → 2.7.0 options-driven tabs), mirroring the §9.3.6
 * rule-6 "select absent → profile UI falls back" split.
 *
 * Tier 2: block absent (pre-0.93 server, or Nivona — the block is HC-gated)
 * or unusable → the exactly-2.7.0 legacy model: hardcoded const-order
 * categories, all buttons true, no served icons, no slot bindings.
 *
 * Tier 3 (feature hidden) needs no branch here: without a Melitta server the
 * `directkey_recipes` attribute never appears, so the data layer already
 * renders nothing — unchanged 2.7.0 behaviour.
 */
export function resolveDirectKeyModel(
  contract: UiContract | null | undefined,
): DirectKeyModel {
  // Widen: validateContract passes v3 fields through unchecked (§9.0.1).
  const raw: unknown = contract
    ? (contract as unknown as Record<string, unknown>).directkey
    : undefined;
  if (!isRecord(raw) || !Array.isArray(raw.categories)) return legacyModel();

  const categories = raw.categories
    .map(readCategoryEntry)
    .filter((c): c is DirectKeyCategoryModel => c !== null);
  if (categories.length === 0) return legacyModel();

  const rawProfiles = Array.isArray(raw.profiles)
    ? raw.profiles.map(readProfileEntry).filter((p): p is ProfileSlotEntry => p !== null)
    : [];

  return {
    source: "contract",
    categories,
    profiles: rawProfiles.length > 0 ? rawProfiles : null,
    profileSelectSuffix:
      typeof raw.profile_select_entity_suffix === "string"
        && raw.profile_select_entity_suffix !== ""
        ? raw.profile_select_entity_suffix
        : DEFAULT_PROFILE_SELECT_SUFFIX,
    activeProfileAttribute:
      typeof raw.active_profile_attribute === "string"
        && raw.active_profile_attribute !== ""
        ? raw.active_profile_attribute
        : DEFAULT_ACTIVE_PROFILE_ATTRIBUTE,
  };
}

// ---------------------------------------------------------------------------
// Frozen attribute parser (pre-existing data path, spec §9.3.4)
// ---------------------------------------------------------------------------

/**
 * Parse the frozen `directkey_recipes` profile-select attribute into
 * token-keyed per-profile recipe maps.
 *
 * The attribute is a frozen legacy surface (§5.2 rule 8): display-name keys,
 * closed set, push-updated with entity state — so the display-name reverse
 * map here is permanent for this data path, not only a pre-0.93 fallback.
 * The v3 delta is `activeProfileAttribute`: the attribute name now comes
 * from the contract's `directkey.active_profile_attribute` (§9.3.6 rule 4),
 * defaulting to the frozen `"active_profile"` on the legacy tier.
 */
export function parseDirectKeyData(
  attributes: Record<string, unknown> | undefined,
  activeProfileAttribute: string = DEFAULT_ACTIVE_PROFILE_ATTRIBUTE,
): DirectKeyData | null {
  if (!attributes) return null;
  const rawDk = attributes.directkey_recipes as
    Record<number, Record<string, DirectKeyRecipe>> | undefined;
  const activeProfile = (attributes[activeProfileAttribute] as number) ?? 0;
  if (!rawDk) return null;
  const profiles: DirectKeyData["profiles"] = {};
  for (const [pidStr, categories] of Object.entries(rawDk)) {
    const pid = Number(pidStr);
    profiles[pid] = {};
    for (const [dName, recipe] of Object.entries(categories as Record<string, DirectKeyRecipe>)) {
      const key = DIRECTKEY_DISPLAY_TO_KEY[dName] || dName;
      profiles[pid][key] = recipe;
    }
  }
  return { activeProfile, profiles };
}
