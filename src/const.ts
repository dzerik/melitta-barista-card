import pkg from "../package.json";
import type { MaintenanceAction } from "./types";

export const CARD_VERSION: string = pkg.version;

export const SERVICE_DOMAIN = "melitta_barista";

export const LONG_PRESS_MS = 500;
export const MAINT_BUSY_RESET_MS = 2000;
export const SOM_FAVORITES_LIMIT = 3;

export const STATS_EXCLUDED_ATTRS = [
  "friendly_name",
  "unit_of_measurement",
  "state_class",
  "icon",
];

export const FREESTYLE_PROCESSES = ["coffee", "milk", "water"] as const;
export const FREESTYLE_PROCESSES_WITH_NONE = ["none", ...FREESTYLE_PROCESSES] as const;
export const FREESTYLE_INTENSITIES = ["very_mild", "mild", "medium", "strong", "very_strong"] as const;
export const FREESTYLE_AROMAS = ["standard", "intense"] as const;
export const FREESTYLE_TEMPERATURES = ["cold", "normal", "high"] as const;
export const FREESTYLE_SHOTS = ["none", "one", "two", "three"] as const;

export type Process = (typeof FREESTYLE_PROCESSES_WITH_NONE)[number];
export type Intensity = (typeof FREESTYLE_INTENSITIES)[number];
export type Aroma = (typeof FREESTYLE_AROMAS)[number];
export type Temperature = (typeof FREESTYLE_TEMPERATURES)[number];
export type Shots = (typeof FREESTYLE_SHOTS)[number];

export const PORTION_LIMITS = {
  c1: { min: 5, max: 250, step: 5 },
  c2: { min: 0, max: 250, step: 5 },
} as const;

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
  cafe_creme: "Café Crème",
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
  // Legacy keys: lowercased English display strings (string-matching mode).
  ready: "var(--state-active-color, #4caf50)",
  brewing: "var(--warning-color, #ff9800)",
  cleaning: "var(--info-color, #2196f3)",
  descaling: "var(--info-color, #2196f3)",
  off: "var(--disabled-color, #9e9e9e)",
  busy: "var(--warning-color, #ff9800)",
  unavailable: "var(--error-color, #f44336)",
  // UI Contract v1 process-token keys (UPPER_SNAKE — cannot collide with the
  // lowercased legacy lookups above). Spec §3.2 status.process vocabulary.
  READY: "var(--state-active-color, #4caf50)",
  PRODUCT: "var(--warning-color, #ff9800)",
  CLEANING: "var(--info-color, #2196f3)",
  EASY_CLEAN: "var(--info-color, #2196f3)",
  INTENSIVE_CLEAN: "var(--info-color, #2196f3)",
  DESCALING: "var(--info-color, #2196f3)",
  FILTER_INSERT: "var(--info-color, #2196f3)",
  FILTER_REPLACE: "var(--info-color, #2196f3)",
  FILTER_REMOVE: "var(--info-color, #2196f3)",
  EVAPORATING: "var(--info-color, #2196f3)",
  SWITCH_OFF: "var(--disabled-color, #9e9e9e)",
  BUSY: "var(--warning-color, #ff9800)",
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

// Visible labels/descriptions live in the translation files
// (settings.switches.*, settings.numbers.*, maintenance.actions.*).
export const SWITCH_META: Record<
  (typeof SWITCH_KEYS)[number],
  { icon: string }
> = {
  energy_saving: { icon: "mdi:lightning-bolt" },
  auto_bean_select: { icon: "mdi:seed" },
  rinsing_disabled: { icon: "mdi:water-off" },
};

export const NUMBER_META: Record<
  (typeof NUMBER_KEYS)[number],
  { icon: string; format: "level" | "minutes" }
> = {
  water_hardness: { icon: "mdi:water", format: "level" },
  auto_off_after: { icon: "mdi:timer-outline", format: "minutes" },
  brew_temperature: { icon: "mdi:thermometer", format: "level" },
};

export const CLEANING_ACTIONS: MaintenanceAction[] = [
  { key: "easy_clean", suffix: "easy_clean", icon: "mdi:broom", confirm: true },
  { key: "intensive_clean", suffix: "intensive_clean", icon: "mdi:spray-bottle", confirm: true },
  { key: "descaling", suffix: "descaling", icon: "mdi:water-alert", confirm: true },
  { key: "evaporating", suffix: "evaporating", icon: "mdi:weather-fog", confirm: true },
];

export const FILTER_ACTIONS: MaintenanceAction[] = [
  { key: "filter_insert", suffix: "filter_insert", icon: "mdi:filter-plus" },
  { key: "filter_replace", suffix: "filter_replace", icon: "mdi:filter" },
  { key: "filter_remove", suffix: "filter_remove", icon: "mdi:filter-remove" },
];

export const OTHER_ACTIONS: MaintenanceAction[] = [
  { key: "switch_off", suffix: "switch_off", icon: "mdi:power", confirm: true },
];
