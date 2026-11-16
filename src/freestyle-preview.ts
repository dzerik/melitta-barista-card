import { FREESTYLE_INTENSITIES, FREESTYLE_SHOTS } from "./const";
import type { IconSpec, IconSpecLayer } from "./icons";
import { displayedMilkMode, type RecipeComponents } from "./recipe";

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

// Match the server\'s nearest-5 rounding, including ties to the even multiple.
const round5 = (value: number) => {
  const units = value / 5;
  const lower = Math.floor(units);
  return (units - lower === .5 ? lower + lower % 2 : Math.round(units)) * 5;
};

/**
 * Describe an unsaved Freestyle draft using UI Contract §4's visual rules.
 * Catalog/Profile icons still come from HA; drafts have no server icon yet.
 * Foam is a symbolic part of the milk portion, never extra beverage volume.
 */
export function freestylePreviewSpec(recipe: RecipeComponents): IconSpec | null {
  const components = [recipe.c1, recipe.c2].filter(c =>
    c.process !== "none" && Number.isFinite(c.portion_ml) && c.portion_ml > 0,
  );
  if (!components.length) return null;
  const total = components.reduce((sum, c) => sum + c.portion_ml, 0);
  const layers: IconSpecLayer[] = [];
  let foamMl = 0;
  for (const c of components) {
    let ml = c.portion_ml;
    let intensity = 0;
    if (c.process === "milk" && displayedMilkMode(c) === "milk_froth") {
      const ratio = components.length === 1 ? .5 : .2;
      const foam = Math.min(ml, Math.max(10, round5(ml * ratio)));
      foamMl += foam;
      ml -= foam;
    } else if (c.process === "coffee") {
      const index = FREESTYLE_INTENSITIES.indexOf(c.intensity);
      const shots = FREESTYLE_SHOTS.indexOf(c.shots);
      intensity = round2(Math.min(1, .3 + .125 * (index < 0 ? 2 : index) + .1 * Math.max(0, shots - 1) + (c.aroma === "intense" ? .05 : 0)));
    }
    if (ml > 0) layers.push({ role: c.process, ml, fraction: round2(ml / total), intensity });
  }
  const top = layers[layers.length - 1];
  if (top?.role === "coffee" && foamMl === 0) top.crema = true;
  const coffeeIndex = components.findIndex(c => c.process === "coffee");
  const milkFirst = coffeeIndex >= 0 && components.slice(0, coffeeIndex).some(c => c.process === "milk");
  const glass = total > 200 || milkFirst ? "tall_glass" : total <= 60 ? "espresso_cup" : "cup";
  const nominal = glass === "tall_glass" ? 320 : glass === "espresso_cup" ? 60 : 220;
  return {
    spec_version: 1, glass, total_ml: total,
    fill_level: Math.max(.01, round2(Math.min(1, total / nominal))),
    layers,
    foam: foamMl > 0 ? { role: "milk_foam", ml: foamMl, fraction: round2(foamMl / total) } : null,
    steam: components.some(c => c.process === "coffee" && c.temperature !== "cold"),
  };
}
