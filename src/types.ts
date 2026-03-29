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

export interface SommelierFavorite {
  id: string;
  name: string;
  description: string;
  blend: number;
  component1: Record<string, unknown>;
  component2: Record<string, unknown>;
  brew_count: number;
}

export interface SommelierHoppers {
  hopper1: { bean: { brand: string; product: string; roast: string } | null } | null;
  hopper2: { bean: { brand: string; product: string; roast: string } | null } | null;
}
