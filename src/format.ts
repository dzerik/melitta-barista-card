// Pure display-formatting helpers — no Lit, no Home Assistant dependencies.

import { localizeOptional } from "./localize/localize";

export const INTENSITY_DOTS: Record<string, number> = {
  very_mild: 1, mild: 2, medium: 3, strong: 4, very_strong: 5,
};

/** Translated short label for a machine value, falling back to a
 *  capitalized, de-underscored rendering of the raw value. */
export function displayName(v: string): string {
  return (
    localizeOptional(`values.${v}`) ??
    v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " ")
  );
}
