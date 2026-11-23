import { html } from "lit";
import { coffeeIconSvg, coffeeIconSvgFromSpec, emptyCoffeeGlassSvg, legacyIconSpec, type IconSpec } from "./icons";
import { buildGlassModel, normalizeCupStyle } from "./glass-model";
import "./glass-icon";

/** Choose the card's visual style while preserving the classic fallback path. */
export function renderDrinkIcon(spec: IconSpec | null | undefined, size: number, uid: string,
  style?: unknown, recipe = "", empty = false) {
  const fallback=empty?emptyCoffeeGlassSvg(size,uid)
    :spec===undefined?coffeeIconSvg(recipe,size,uid):coffeeIconSvgFromSpec(spec,size,uid);
  if (normalizeCupStyle(style)==="classic") return fallback;
  const model=buildGlassModel(spec===undefined?legacyIconSpec(recipe):spec,empty)
    ??buildGlassModel(legacyIconSpec(""))!;
  return html`<melitta-glass-icon .model=${model} .size=${size} .uid=${uid} aria-hidden="true">${fallback}</melitta-glass-icon>`;
}
