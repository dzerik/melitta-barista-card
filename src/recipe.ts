// Recipe component model: the single source of truth for the 12-field
// two-component recipe shape used by freestyle brewing and DirectKey editing.
// Service-payload field names (process1, portion1_ml, ...) live ONLY in
// toServicePayload() — they are an external contract with the
// melitta_barista integration and must not be renamed.

import type { Process, Intensity, Aroma, Temperature, Shots } from "./const";
import type { DirectKeyRecipe } from "./types";

export interface ComponentSpec {
  process: Process;
  intensity: Intensity;
  aroma: Aroma;
  temperature: Temperature;
  shots: Shots;
  portion_ml: number;
}

export interface RecipeComponents {
  c1: ComponentSpec;
  c2: ComponentSpec;
}

export const SHOTS_TO_STRING: Record<number, Shots> = {
  0: "none", 1: "one", 2: "two", 3: "three",
};

export function defaultComponent1(): ComponentSpec {
  return {
    process: "coffee",
    intensity: "medium",
    aroma: "standard",
    temperature: "normal",
    shots: "one",
    portion_ml: 40,
  };
}

export function defaultComponent2(): ComponentSpec {
  return {
    process: "none",
    intensity: "medium",
    aroma: "standard",
    temperature: "normal",
    shots: "none",
    portion_ml: 0,
  };
}

export function defaultRecipe(): RecipeComponents {
  return { c1: defaultComponent1(), c2: defaultComponent2() };
}

export function fromDkRecipe(r: DirectKeyRecipe): RecipeComponents {
  return {
    c1: {
      process: (r.c1_process as Process) || "coffee",
      intensity: (r.c1_intensity as Intensity) || "medium",
      aroma: (r.c1_aroma as Aroma) || "standard",
      temperature: (r.c1_temperature as Temperature) || "normal",
      shots: SHOTS_TO_STRING[r.c1_shots] || "one",
      portion_ml: r.c1_portion_ml || 40,
    },
    c2: {
      process: (r.c2_process as Process) || "none",
      intensity: (r.c2_intensity as Intensity) || "medium",
      aroma: (r.c2_aroma as Aroma) || "standard",
      temperature: (r.c2_temperature as Temperature) || "normal",
      shots: SHOTS_TO_STRING[r.c2_shots] || "none",
      portion_ml: r.c2_portion_ml || 0,
    },
  };
}

export function toServicePayload(rc: RecipeComponents): Record<string, string | number> {
  return {
    process1: rc.c1.process,
    intensity1: rc.c1.intensity,
    aroma1: rc.c1.aroma,
    portion1_ml: rc.c1.portion_ml,
    temperature1: rc.c1.temperature,
    shots1: rc.c1.shots,
    process2: rc.c2.process,
    intensity2: rc.c2.intensity,
    aroma2: rc.c2.aroma,
    portion2_ml: rc.c2.portion_ml,
    temperature2: rc.c2.temperature,
    shots2: rc.c2.shots,
  };
}
