// All outbound calls to Home Assistant (services + Sommelier WebSocket API).
// The melitta_barista service/WS message names are an external contract —
// they live only here.

import type { HomeAssistant } from "custom-card-helpers";
import { SERVICE_DOMAIN } from "./const";
import { toServicePayload, type RecipeComponents } from "./recipe";
import type { SommelierFavorite, SommelierHoppers, SommelierQuickRecipe } from "./types";

export function pressButton(hass: HomeAssistant, prefix: string, suffix: string): Promise<unknown> {
  return hass.callService("button", "press", { entity_id: `button.${prefix}_${suffix}` });
}

export function selectOption(
  hass: HomeAssistant, prefix: string, suffix: string, option: string,
): Promise<unknown> {
  return hass.callService("select", "select_option", {
    entity_id: `select.${prefix}_${suffix}`, option,
  });
}

export function toggleSwitch(
  hass: HomeAssistant, prefix: string, key: string, turnOn: boolean,
): Promise<unknown> {
  return hass.callService("switch", turnOn ? "turn_on" : "turn_off", {
    entity_id: `switch.${prefix}_${key}`,
  });
}

/** Write a number entity (contract-mode settings, UI Contract §9.1.6 rule 4). */
export function setNumber(
  hass: HomeAssistant, prefix: string, suffix: string, value: number,
): Promise<unknown> {
  return hass.callService("number", "set_value", {
    entity_id: `number.${prefix}_${suffix}`, value,
  });
}

export function brewDirectkey(
  hass: HomeAssistant, prefix: string, category: string, twoCups: boolean,
): Promise<unknown> {
  return hass.callService(SERVICE_DOMAIN, "brew_directkey", {
    entity_id: `button.${prefix}_brew`,
    category,
    two_cups: twoCups,
  });
}

export function brewFreestyle(
  hass: HomeAssistant, prefix: string, name: string, rc: RecipeComponents,
): Promise<unknown> {
  return hass.callService(SERVICE_DOMAIN, "brew_freestyle", {
    entity_id: `button.${prefix}_brew`,
    name,
    ...toServicePayload(rc),
  });
}

export function saveDirectkey(
  hass: HomeAssistant, prefix: string,
  category: string, profileId: number, rc: RecipeComponents,
): Promise<unknown> {
  return hass.callService(SERVICE_DOMAIN, "save_directkey", {
    entity_id: `button.${prefix}_brew`,
    category,
    profile_id: profileId,
    ...toServicePayload(rc),
  });
}

// -- Sommelier WebSocket API --

const WS = {
  favoritesList: `${SERVICE_DOMAIN}/sommelier/favorites/list`,
  hoppersGet: `${SERVICE_DOMAIN}/sommelier/hoppers/get`,
  generate: `${SERVICE_DOMAIN}/sommelier/generate`,
  brew: `${SERVICE_DOMAIN}/sommelier/brew`,
  favoritesBrew: `${SERVICE_DOMAIN}/sommelier/favorites/brew`,
} as const;

export async function somListFavorites(hass: HomeAssistant): Promise<SommelierFavorite[]> {
  const res = await hass.callWS<{ favorites: SommelierFavorite[] }>({ type: WS.favoritesList });
  return res.favorites;
}

export function somGetHoppers(hass: HomeAssistant): Promise<SommelierHoppers> {
  return hass.callWS<SommelierHoppers>({ type: WS.hoppersGet });
}

export async function somGenerateSurprise(hass: HomeAssistant): Promise<SommelierQuickRecipe | null> {
  const res = await hass.callWS<{ session: { recipes: SommelierQuickRecipe[] } }>({
    type: WS.generate,
    mode: "surprise_me",
    count: 1,
  });
  return res.session.recipes[0] ?? null;
}

export function somBrew(hass: HomeAssistant, recipeId: string): Promise<unknown> {
  return hass.callWS({ type: WS.brew, recipe_id: recipeId });
}

export function somBrewFavorite(hass: HomeAssistant, favoriteId: string): Promise<unknown> {
  return hass.callWS({ type: WS.favoritesBrew, favorite_id: favoriteId });
}

/** Brew a single machine phase of a recipe or favorite (wizard backend). */
export function somBrewPhase(
  hass: HomeAssistant,
  target: { recipeId?: string; favoriteId?: string },
  phaseIndex: number,
): Promise<unknown> {
  return hass.callWS({
    type: `${SERVICE_DOMAIN}/sommelier/brew_phase`,
    ...(target.recipeId ? { recipe_id: target.recipeId } : {}),
    ...(target.favoriteId ? { favorite_id: target.favoriteId } : {}),
    phase_index: phaseIndex,
  });
}
