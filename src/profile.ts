// Profile slot logic: the PR #6 stable-slot rule (below) and, since UI
// Contract v3 (§9.3), contract-served slot bindings with the §9.3.6 rule-6
// entity-absence gate.

/**
 * One `directkey.profiles[]` entry as served (spec §9.3.2).
 *
 * Slot 0 carries `fixed`/`name_key`; slots >= 1 carry the text/switch
 * entity suffixes the card binds through `resolveProfileSlots`.
 */
export interface ProfileSlotEntry {
  slot: number;
  fixed?: true;
  name_key?: string;
  name_entity_suffix?: string;
  active_entity_suffix?: string;
}

/** A profile slot resolved against live entity state (§9.3.6 rules 4/6). */
export interface ResolvedProfileSlot {
  /** Stable numeric identity (the PR #6 rule — labels may change, slots don't). */
  slot: number;
  /** Slot 0: always active, non-renameable, recipes not resettable (§9.3.2). */
  fixed: boolean;
  /** i18n key for the fixed slot's label ("my_coffee"), else null. */
  nameKey: string | null;
  /** Current name from the bound text entity, or null when unknown/absent. */
  name: string | null;
  /** Render the slot at all (activity switch on; fixed slot always). */
  visible: boolean;
  /** Offer rename/edit/reset UI (visible AND the name entity has state). */
  editable: boolean;
}

/**
 * State lookup the caller provides: entity state string for
 * `<domain>.<prefix>_<suffix>`, or undefined when no state object exists
 * (user-disabled, renamed, or the §9.1.2.5 slot-count lag). Keeping the
 * lookup injected keeps this module pure — sections never read `hass`.
 */
export type EntityStateLookup = (domain: string, suffix: string) => string | undefined;

function usableState(state: string | undefined): string | null {
  return state !== undefined && state !== "unknown" && state !== "unavailable"
    ? state
    : null;
}

/**
 * Resolve contract profile slot entries against live entity state.
 *
 * Encodes the §9.3.2 profile-model semantics and the §9.3.6 rule-6
 * entity-absence gate — contract presence never overrides entity absence:
 *
 * * `fixed` slot (slot 0): always visible, never editable, labeled via
 *   `nameKey` (the reused `recipes.category.my_coffee` i18n key).
 * * A slot is visible iff its bound activity switch reports `"on"`; an
 *   absent (or unavailable) switch entity — or a slot >= 1 served without
 *   bindings — hides the slot.
 * * A visible slot is editable iff its bound name text entity has a state
 *   object; absent name entity → visible but read-only, `name: null`.
 */
export function resolveProfileSlots(
  entries: readonly ProfileSlotEntry[],
  getState: EntityStateLookup,
): ResolvedProfileSlot[] {
  return entries.map((entry) => {
    if (entry.fixed === true) {
      return {
        slot: entry.slot,
        fixed: true,
        nameKey: entry.name_key ?? null,
        name: null,
        visible: true,
        editable: false,
      };
    }

    const activeState = entry.active_entity_suffix
      ? getState("switch", entry.active_entity_suffix)
      : undefined;
    const visible = usableState(activeState) === "on";

    const nameState = entry.name_entity_suffix
      ? getState("text", entry.name_entity_suffix)
      : undefined;
    const namePresent = nameState !== undefined;

    return {
      slot: entry.slot,
      fixed: false,
      nameKey: null,
      name: visible ? usableState(nameState) : null,
      visible,
      editable: visible && namePresent,
    };
  });
}

/**
 * Resolve the current Home Assistant profile option for a stable slot.
 *
 * A profile display label may change asynchronously after render, e.g.
 * "Profile 1" -> "XXXUSER". The numeric slot remains stable (the PR #6
 * rule; the caller keeps its `console.warn` on an unresolvable slot).
 */
export function profileOptionForSlot(
  options: readonly string[],
  slot: number,
): string | undefined {
  if (
    !Number.isInteger(slot) ||
    slot < 0 ||
    slot >= options.length
  ) {
    return undefined;
  }

  return options[slot];
}
