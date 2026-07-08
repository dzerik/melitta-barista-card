// Translation lookup. Language is taken from hass (set via setLanguage()
// by the components on every update), falling back en -> key.

import type { HomeAssistant } from "custom-card-helpers";
import bg from "./languages/bg.json";
import bs from "./languages/bs.json";
import cs from "./languages/cs.json";
import da from "./languages/da.json";
import de from "./languages/de.json";
import el from "./languages/el.json";
import en from "./languages/en.json";
import es from "./languages/es.json";
import et from "./languages/et.json";
import fi from "./languages/fi.json";
import fr from "./languages/fr.json";
import hr from "./languages/hr.json";
import hu from "./languages/hu.json";
import it from "./languages/it.json";
import lt from "./languages/lt.json";
import lv from "./languages/lv.json";
import mk from "./languages/mk.json";
import nb from "./languages/nb.json";
import nl from "./languages/nl.json";
import pl from "./languages/pl.json";
import pt from "./languages/pt.json";
import ro from "./languages/ro.json";
import ru from "./languages/ru.json";
import sk from "./languages/sk.json";
import sl from "./languages/sl.json";
import sr from "./languages/sr.json";
import sv from "./languages/sv.json";
import tr from "./languages/tr.json";
import uk from "./languages/uk.json";

// Mirrors the language list of the melitta_barista integration.
const LANGUAGES: Record<string, unknown> = {
  bg, bs, cs, da, de, el, en, es, et, fi, fr, hr, hu, it, lt, lv,
  mk, nb, nl, pl, pt, ro, ru, sk, sl, sr, sv, tr, uk,
};

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
