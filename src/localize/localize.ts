// Translation lookup. Language is taken from hass (set via setLanguage()
// by the components on every update), falling back en -> key.

import type { HomeAssistant } from "custom-card-helpers";
import en from "./languages/en.json";
import ru from "./languages/ru.json";
import de from "./languages/de.json";

const LANGUAGES: Record<string, unknown> = { en, ru, de };

let currentLang = "en";

export function getLanguage(hass?: HomeAssistant): string {
  const raw =
    hass?.locale?.language ??
    (hass as { language?: string } | undefined)?.language ??
    "en";
  return raw.replace("_", "-").toLowerCase();
}

/** Components call this whenever hass updates (cheap, idempotent). */
export function setLanguage(hass?: HomeAssistant): void {
  currentLang = getLanguage(hass);
}

export function currentLanguage(): string {
  return currentLang;
}

function resolve(obj: unknown, key: string): string | undefined {
  const val = key.split(".").reduce<unknown>(
    (o, k) => (typeof o === "object" && o !== null ? (o as Record<string, unknown>)[k] : undefined),
    obj,
  );
  return typeof val === "string" ? val : undefined;
}

/** Returns undefined when the key has no translation (for custom fallbacks). */
export function localizeOptional(
  key: string,
  vars?: Record<string, string | number>,
): string | undefined {
  const value =
    resolve(LANGUAGES[currentLang], key) ??
    resolve(LANGUAGES[currentLang.split("-")[0]], key) ??
    resolve(LANGUAGES.en, key);
  if (value === undefined) return undefined;
  return vars
    ? value.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`))
    : value;
}

/** Returns the key itself when missing, so gaps are visible, never empty. */
export function localize(key: string, vars?: Record<string, string | number>): string {
  return localizeOptional(key, vars) ?? key;
}
