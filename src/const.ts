export const CARD_VERSION = "2.0.0";

export const FREESTYLE_PROCESSES = ["coffee", "milk", "water"] as const;
export const FREESTYLE_PROCESSES_WITH_NONE = ["none", ...FREESTYLE_PROCESSES] as const;
export const FREESTYLE_INTENSITIES = ["very_mild", "mild", "medium", "strong", "very_strong"] as const;
export const FREESTYLE_AROMAS = ["standard", "intense"] as const;
export const FREESTYLE_TEMPERATURES = ["cold", "normal", "high"] as const;
export const FREESTYLE_SHOTS = ["none", "one", "two", "three"] as const;

export const DIRECTKEY_CATEGORIES = [
  "espresso",
  "cafe_creme",
  "cappuccino",
  "latte_macchiato",
  "milk",
  "milk_froth",
  "water",
] as const;

export type DirectKeyCategory = (typeof DIRECTKEY_CATEGORIES)[number];

export const DK_LABELS: Record<DirectKeyCategory, string> = {
  espresso: "Espresso",
  cafe_creme: "Cafe Creme",
  cappuccino: "Cappuccino",
  latte_macchiato: "Latte Macchiato",
  milk: "Milk",
  milk_froth: "Milk Froth",
  water: "Hot Water",
};

export const DK_RECIPE_ICON: Record<DirectKeyCategory, string> = {
  espresso: "Espresso",
  cafe_creme: "Cafe Creme",
  cappuccino: "Cappuccino",
  latte_macchiato: "Latte Macchiato",
  milk: "Milk",
  milk_froth: "Milk Froth",
  water: "Hot Water",
};

export const DIRECTKEY_DISPLAY_TO_KEY: Record<string, DirectKeyCategory> = {
  "Espresso": "espresso",
  "Cafe Creme": "cafe_creme",
  "Café Crème": "cafe_creme",
  "Cappuccino": "cappuccino",
  "Latte Macchiato": "latte_macchiato",
  "Milk": "milk",
  "Milk Froth": "milk_froth",
  "Hot Water": "water",
};

export const STATE_COLORS: Record<string, string> = {
  ready: "var(--state-active-color, #4caf50)",
  brewing: "var(--warning-color, #ff9800)",
  cleaning: "var(--info-color, #2196f3)",
  descaling: "var(--info-color, #2196f3)",
  off: "var(--disabled-color, #9e9e9e)",
  busy: "var(--warning-color, #ff9800)",
  unavailable: "var(--error-color, #f44336)",
};

export const SWITCH_KEYS = [
  "energy_saving",
  "auto_bean_select",
  "rinsing_disabled",
] as const;

export const NUMBER_KEYS = [
  "water_hardness",
  "auto_off_after",
  "brew_temperature",
] as const;

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
  label: string;
  desc: string;
  icon: string;
  confirm?: boolean;
}

export const CLEANING_ACTIONS: MaintenanceAction[] = [
  { key: "easy_clean", suffix: "easy_clean", label: "Easy Clean", desc: "Quick rinse of the brew unit", icon: "mdi:broom", confirm: true },
  { key: "intensive_clean", suffix: "intensive_clean", label: "Intensive Clean", desc: "Deep cleaning with tablet", icon: "mdi:spray-bottle", confirm: true },
  { key: "descaling", suffix: "descaling", label: "Descaling", desc: "Remove limescale buildup", icon: "mdi:water-alert", confirm: true },
  { key: "evaporating", suffix: "evaporating", label: "Evaporating", desc: "Purge the steam system", icon: "mdi:weather-fog", confirm: true },
];

export const FILTER_ACTIONS: MaintenanceAction[] = [
  { key: "filter_insert", suffix: "filter_insert", label: "Insert Filter", desc: "Start using a new water filter", icon: "mdi:filter-plus" },
  { key: "filter_replace", suffix: "filter_replace", label: "Replace Filter", desc: "Replace the current water filter", icon: "mdi:filter" },
  { key: "filter_remove", suffix: "filter_remove", label: "Remove Filter", desc: "Stop using the water filter", icon: "mdi:filter-remove" },
];

export const OTHER_ACTIONS: MaintenanceAction[] = [
  { key: "switch_off", suffix: "switch_off", label: "Switch Off", desc: "Turn off the machine", icon: "mdi:power", confirm: true },
];
