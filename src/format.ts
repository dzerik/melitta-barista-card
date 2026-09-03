// Pure display-formatting helpers — no Lit, no Home Assistant dependencies.

import { localizeOptional } from "./localize/localize";
import { serverString } from "./server-i18n";

export const INTENSITY_DOTS: Record<string, number> = {
  very_mild: 1, mild: 2, medium: 3, strong: 4, very_strong: 5,
};

/** Translated short label for a machine value, falling back to a
 *  capitalized, de-underscored rendering of the raw value.
 *
 *  Bundle-only legacy path (spec §6.3.5.7) — deliberately does NOT consult
 *  server strings; family-aware call sites use displayNameFor instead. */
export function displayName(v: string): string {
  return (
    localizeOptional(`values.${v}`) ??
    v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " ")
  );
}

/**
 * Family-scoped display name for a machine value token (spec §6.3.5.7).
 *
 * Preference order per key (§6.3.5.1): server string
 * `values.<family>.<token>` → bundle `values.<token>` → humanized token.
 * Server keys are family-scoped because bare tokens collide across families
 * ("none", "standard" — §6.3.1); the card bundles keep their historical
 * bare-token keys as the shared fallback layer.
 */
export function displayNameFor(family: string, token: string): string {
  return serverString(`values.${family}.${token}`) ?? displayName(token);
}
