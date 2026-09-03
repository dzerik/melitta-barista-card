// DirectKey display helpers (spec §9.3.6, Zone C-L wiring).
//
// PURE module (no Lit, no Home Assistant): the label chain for category
// tokens and the profile-tab view model built over C-K's resolved slots.
// The Lit sections consume these through props — they never read `hass`.

import { humanizeToken } from "./action-catalog";
import { localizeOptional } from "./localize/localize";
import type { ResolvedProfileSlot } from "./profile";
import { serverString } from "./server-i18n";

/**
 * Display label for a DirectKey category token (spec §9.3.6 rule 2).
 *
 * Contract mode: server `values.directkey_category.<token>` (the ×29 keys
 * shipped in 0.92 — zero new i18n keys for this feature) → card bundle
 * `drinks.<token>` → humanized token (unknown tokens tolerated, §5.3.2).
 *
 * Legacy mode (`contractMode: false`, no served `directkey` block): bundle
 * only — exactly the 2.7.0 label source, so a v2 server with installed
 * server strings changes nothing outside the directkey feature gate.
 */
export function directKeyCategoryLabel(category: string, contractMode: boolean): string {
  if (contractMode) {
    const served = serverString(`values.directkey_category.${category}`);
    if (served !== undefined) return served;
  }
  return localizeOptional(`drinks.${category}`) ?? humanizeToken(category);
}

/** One profile tab in render order — slot number is the stable identity (PR #6). */
export interface ProfileTab {
  slot: number;
  label: string;
  active: boolean;
}

/**
 * Build the profile tab bar model from resolved contract slots (§9.3.6 rule 4).
 *
 * Only visible slots become tabs (fixed slot 0 always; slots >= 1 iff their
 * activity switch is on — resolveProfileSlots already applied the rule-6
 * entity-absence gate). Labels: the fixed slot prefers the served
 * `recipes.category.<name_key>` string, then the select's option for the
 * slot (the integration-localized "My Coffee"), then the humanized key;
 * other slots prefer the bound name entity's state, then the option, then a
 * `#<slot>` placeholder (options can trail the contract during the §9.1.2.5
 * registration lag). The active tab is the slot the select's current option
 * resolves to via the stable index mapping — never a label comparison.
 */
export function buildProfileTabs(
  slots: readonly ResolvedProfileSlot[],
  options: readonly string[],
  selectedOption: string | null,
): ProfileTab[] {
  const selectedSlot = selectedOption !== null ? options.indexOf(selectedOption) : -1;
  return slots
    .filter((s) => s.visible)
    .map((s) => ({
      slot: s.slot,
      label: profileTabLabel(s, options),
      active: selectedSlot >= 0 && s.slot === selectedSlot,
    }));
}

function profileTabLabel(slot: ResolvedProfileSlot, options: readonly string[]): string {
  if (slot.fixed) {
    const served = slot.nameKey !== null
      ? serverString(`recipes.category.${slot.nameKey}`)
      : undefined;
    return served ?? options[slot.slot] ?? humanizeToken(slot.nameKey ?? "my_coffee");
  }
  return slot.name ?? options[slot.slot] ?? `#${slot.slot}`;
}
