// Pure display-formatting helpers — no Lit, no Home Assistant dependencies.

export const DISPLAY: Record<string, string> = {
  very_mild: "V.Mild", mild: "Mild", medium: "Med", strong: "Strong",
  very_strong: "V.Strong", extra_strong: "X.Strong",
  cold: "Cold", normal: "Normal", high: "High",
  none: "None", one: "1", two: "2", three: "3",
  coffee: "Coffee", milk: "Milk", water: "Water",
  standard: "Std", intense: "Int+",
};

export const LEVEL_LABELS: Record<string, Record<number, string>> = {
  water_hardness: { 1: "Soft", 2: "Medium", 3: "Hard", 4: "Very Hard" },
  brew_temperature: { 0: "Low", 1: "Normal", 2: "High" },
};

export const INTENSITY_DOTS: Record<string, number> = {
  very_mild: 1, mild: 2, medium: 3, strong: 4, very_strong: 5,
};

export function displayName(v: string): string {
  return DISPLAY[v] || v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " ");
}
