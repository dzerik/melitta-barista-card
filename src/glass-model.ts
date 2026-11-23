import { computeIconGeometry, type IconSpec } from "./icons";

export type CupStyle = "classic" | "glass";
export type GlassShape = "espresso_cup" | "cup" | "tall_glass";

/** A normalized, bottom-up optical layer; fraction is of the vessel capacity. */
export interface GlassLayer {
  role: string;
  fraction: number;
  color: string;
  concentration: number;
  intensity: number;
}

/** Renderer input independent of Home Assistant, Lit and the graphics engine. */
export interface GlassModel {
  glass: GlassShape;
  fill: number;
  layers: GlassLayer[];
  steam: boolean;
}

/** Old dashboards retain their appearance until the new style is selected. */
export function normalizeCupStyle(value: unknown): CupStyle {
  return value === "glass" ? "glass" : "classic";
}

/** Adapt the existing composition contract without modifying its source data. */
export function buildGlassModel(spec: IconSpec | null | undefined, empty = false): GlassModel | null {
  if (empty) return { glass: "cup", fill: 0, layers: [], steam: false };
  const positive = (n: number) => Number.isFinite(n) && n > 0 ? n : 0;
  const validLayers = Array.isArray(spec?.layers) ? spec.layers : [];
  const coffeeMl = validLayers.reduce((n, l) => n + (l?.role === "coffee" ? positive(l.ml) : 0), 0);
  const waterMl = validLayers.reduce((n, l) => n + (l?.role === "water" ? positive(l.ml) : 0), 0);
  // Dilution forms one liquid phase, including water dispensed before coffee.
  // Never draw an espresso crema cap on this mixed aqueous phase.
  const input = spec && waterMl > 0 && coffeeMl > 0
    ? { ...spec, layers: validLayers.map(l => l ? { ...l, crema: undefined } : l) }
    : spec;
  const geometry = computeIconGeometry(input, 100);
  if (!geometry || !spec) return null;
  const layers: GlassLayer[] = [];
  let aqueous: GlassLayer | undefined;
  const concentration = coffeeMl / (coffeeMl + waterMl || 1);
  for (const layer of geometry.layers) {
    const fraction = layer.height / geometry.frame.cupH;
    if (layer.role === "coffee" || layer.role === "water") {
      if (aqueous) {
        aqueous.fraction += fraction;
        if (layer.role === "coffee") aqueous.intensity = layer.intensity;
      } else {
        aqueous = {
          role: coffeeMl > 0 ? "coffee" : "water", fraction,
          color: layer.fill, intensity: layer.intensity, concentration,
        };
        layers.push(aqueous);
      }
    } else {
      layers.push({ role: layer.role, fraction, color: layer.fill,
        intensity: layer.intensity, concentration: 0 });
    }
  }
  return {
    glass: spec.glass === "espresso_cup" || spec.glass === "tall_glass" ? spec.glass : "cup",
    fill: layers.reduce((sum, l) => sum + l.fraction, 0),
    layers, steam: geometry.steam,
  };
}
