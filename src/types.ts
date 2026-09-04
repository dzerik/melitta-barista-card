export interface MelittaCardConfig {
  type: string;
  name?: string;
  entity_prefix?: string;
  show_header?: boolean;
  show_status?: boolean;
  show_recipes?: boolean;
  show_profiles?: boolean;
  show_freestyle?: boolean;
  show_sommelier?: boolean;
  show_settings?: boolean;
  show_stats?: boolean;
  show_maintenance?: boolean;
  compact?: boolean;
}

export interface DirectKeyRecipe {
  category: number;
  c1_process: string;
  c1_intensity: string;
  c1_aroma: string;
  c1_temperature: string;
  c1_shots: number;
  c1_portion_ml: number;
  c2_process: string;
  c2_intensity: string;
  c2_aroma: string;
  c2_temperature: string;
  c2_shots: number;
  c2_portion_ml: number;
}

export interface DirectKeyData {
  activeProfile: number;
  profiles: Record<number, Record<string, DirectKeyRecipe>>;
}

export interface MaintenanceAction {
  key: string;
  suffix: string;
  icon: string;
  confirm?: boolean;
}

export interface SommelierFavorite {
  id: string;
  name: string;
  description: string;
  blend: number;
  component1: Record<string, unknown>;
  component2: Record<string, unknown>;
  brew_count: number;
  /** Why the sommelier suggested this drink (kept since integration 0.94). */
  reasoning?: string;
  /** Optional step-machine fields (present since integration 0.89). */
  machine_phases?: Array<{
    component?: Record<string, unknown>;
    user_action_before?: unknown[];
  }> | null;
  steps?: { pre?: unknown[]; post?: unknown[] } | unknown[] | null;
}

export interface SommelierQuickRecipe {
  id: string;
  name: string;
  description: string;
  /** Optional: why the sommelier chose this recipe. */
  reasoning?: string;
  machine_phases?: Array<{
    component?: Record<string, unknown>;
    user_action_before?: unknown[];
  }> | null;
  steps?: { pre?: unknown[]; post?: unknown[] } | unknown[] | null;
}

export interface SommelierHoppers {
  hopper1: { bean: { brand: string; product: string; roast: string } | null } | null;
  hopper2: { bean: { brand: string; product: string; roast: string } | null } | null;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
