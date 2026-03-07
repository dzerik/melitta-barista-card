export const CARD_VERSION = "0.5.0";

export const FREESTYLE_PROCESSES = ["coffee", "milk", "water"] as const;
export const FREESTYLE_PROCESSES_WITH_NONE = ["none", ...FREESTYLE_PROCESSES] as const;
export const FREESTYLE_INTENSITIES = ["very_mild", "mild", "medium", "strong", "very_strong"] as const;
export const FREESTYLE_TEMPERATURES = ["cold", "normal", "high"] as const;
export const FREESTYLE_SHOTS = ["none", "one", "two", "three"] as const;

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
