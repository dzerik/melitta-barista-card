import { HomeAssistant } from "custom-card-helpers";

export interface MelittaCardConfig {
  type: string;
  name?: string;
  entity_prefix?: string;
  show_recipes?: boolean;
  show_settings?: boolean;
  compact?: boolean;
}

export interface SettingItem {
  name: string;
  value: string;
}

export type { HomeAssistant };
