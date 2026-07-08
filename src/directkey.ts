// Pure transformer: profile-entity attributes -> DirectKeyData.

import { DIRECTKEY_DISPLAY_TO_KEY } from "./const";
import type { DirectKeyData, DirectKeyRecipe } from "./types";

export function parseDirectKeyData(
  attributes: Record<string, unknown> | undefined,
): DirectKeyData | null {
  if (!attributes) return null;
  const rawDk = attributes.directkey_recipes as
    Record<number, Record<string, DirectKeyRecipe>> | undefined;
  const activeProfile = (attributes.active_profile as number) ?? 0;
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
