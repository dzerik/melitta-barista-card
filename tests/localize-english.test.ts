import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import en from "../src/localize/languages/en.json";

/**
 * Regression pin against untranslated strings.
 *
 * A locale value that is byte-identical to its en.json source is, in the vast
 * majority of cases, a string that was never translated: the file passes the
 * key-parity test, the card renders, and the user quietly reads English in a
 * German UI. The card shipped ~200 such values before the 2.11.1 sweep.
 *
 * Some collisions are legitimate — proper names, numerals, unit symbols and
 * cognates that really are spelled the same. Those live in ALLOWED_ENGLISH
 * below, each with the locales it applies to and the reason it is allowed.
 * The list is exact in both directions: an unlisted collision fails the test,
 * and a listed locale that has since been translated fails it too, so the
 * allowlist cannot rot into a blanket exemption.
 */

type Allowance = {
  /** Locales the collision is legitimate in, or "*" for every locale. */
  readonly locales: readonly string[] | "*";
  /** Why this value is the same string in those languages. */
  readonly reason: string;
};

const ALLOWED_ENGLISH: Readonly<Record<string, Allowance>> = {
  "common.default_name": {
    locales: "*",
    reason: "Product name — Melitta Barista is never translated (house rule).",
  },
  "values.one": { locales: "*", reason: "Bare numeral." },
  "values.two": { locales: "*", reason: "Bare numeral." },
  "values.three": { locales: "*", reason: "Bare numeral." },
  "directkey.two_cups": {
    locales: "*",
    reason: "Numeral plus the international 'x' multiplier, as printed on the machine.",
  },
  "freestyle.title": {
    locales: [
      "bg", "bs", "cs", "da", "de", "es", "et", "fi", "fr", "hr", "hu", "it",
      "lt", "lv", "mk", "nb", "nl", "pl", "pt", "ro", "ru", "sk", "sl", "sr",
      "sv", "tr", "uk",
    ],
    reason: "Feature name of the machine's Freestyle mode, kept in Latin script.",
  },
  "drinks.espresso": {
    locales: [
      "bg", "bs", "cs", "da", "de", "el", "es", "et", "fi", "fr", "hr", "hu",
      "it", "lt", "lv", "mk", "nb", "nl", "pl", "pt", "ro", "sk", "sl", "sr",
      "sv", "tr",
    ],
    reason: "Coffee proper name (house rule: Latin script in the UI).",
  },
  "drinks.cafe_creme": {
    locales: [
      "bg", "bs", "cs", "da", "de", "el", "es", "et", "fi", "fr", "hr", "hu",
      "it", "lt", "lv", "mk", "nb", "nl", "pl", "pt", "ro", "sk", "sl", "sr",
      "sv", "tr",
    ],
    reason: "Coffee proper name (house rule: Latin script in the UI).",
  },
  "drinks.cappuccino": {
    locales: [
      "bg", "bs", "cs", "da", "de", "el", "es", "et", "fi", "fr", "hr", "hu",
      "it", "lt", "lv", "mk", "nb", "nl", "pl", "pt", "ro", "sk", "sl", "sr",
      "sv", "tr",
    ],
    reason: "Coffee proper name (house rule: Latin script in the UI).",
  },
  "drinks.latte_macchiato": {
    locales: [
      "bg", "bs", "cs", "da", "de", "el", "es", "et", "fi", "fr", "hr", "hu",
      "it", "lt", "lv", "mk", "nb", "nl", "pl", "pt", "ro", "sk", "sl", "sr",
      "sv", "tr",
    ],
    reason: "Coffee proper name (house rule: Latin script in the UI).",
  },
  "freestyle.portion_value": {
    locales: [
      "bs", "cs", "da", "de", "el", "es", "et", "fi", "fr", "hr", "hu", "it",
      "lt", "lv", "nb", "nl", "pl", "pt", "ro", "sk", "sl", "sv", "tr",
    ],
    reason: "SI unit symbol 'ml' is the same everywhere; only the value moves.",
  },
  "settings.minutes": {
    locales: [
      "bs", "cs", "da", "es", "et", "fi", "fr", "hr", "it", "lv", "nb", "nl",
      "pl", "pt", "ro", "sk", "sl", "sv",
    ],
    reason: "'min' is the international abbreviation for minutes.",
  },
  "values.intense": {
    locales: [
      "bs", "cs", "da", "de", "et", "fi", "fr", "hr", "hu", "it", "lt", "lv",
      "nb", "nl", "pl", "pt", "ro", "sk", "sl", "sv",
    ],
    reason: "'Int+' is the abbreviation printed on the machine's own display.",
  },
  "values.standard": {
    locales: [
      "bs", "cs", "da", "de", "et", "fr", "hr", "it", "lt", "nb", "nl", "pl",
      "ro", "sl", "sv", "tr",
    ],
    reason: "'Std' abbreviates a word spelled the same way in these languages.",
  },
  "freestyle.aroma": {
    locales: ["bs", "cs", "da", "de", "es", "hr", "hu", "it", "nb", "nl", "pt", "sl", "tr"],
    reason: "Cognate — 'Aroma' is the native spelling in these languages.",
  },
  "values.normal": {
    locales: ["da", "de", "es", "nb", "pt", "ro", "sv", "tr"],
    reason: "Cognate — 'Normal' is the native spelling in these languages.",
  },
  "settings.levels.brew_temperature.1": {
    locales: ["da", "de", "es", "nb", "pt", "sv", "tr"],
    reason: "Cognate — 'Normal' is the native spelling in these languages.",
  },
  "values.mild": {
    locales: ["da", "de", "nb", "nl", "sv"],
    reason: "Cognate — 'Mild' is the native spelling in these languages.",
  },
  "freestyle.shots": {
    locales: ["da", "de", "nb", "nl", "sv"],
    reason: "Established loanword for espresso shots in these languages.",
  },
  "sommelier.title": {
    locales: ["bs", "hr", "pl", "sl"],
    reason: "'Sommelier' keeps its French spelling and 'AI' its English initials here.",
  },
  "common.start": {
    locales: ["da", "de", "nb"],
    reason: "Cognate — 'Start' is the native imperative in these languages.",
  },
  "freestyle.portion": {
    locales: ["da", "fr", "sv"],
    reason: "Cognate — 'Portion' is the native spelling in these languages.",
  },
  "freestyle.process": {
    locales: ["lv", "sv"],
    reason: "Cognate — 'Process' is the native spelling in Latvian and Swedish.",
  },
  "freestyle.temp": {
    locales: ["nb", "sv"],
    reason: "'Temp' abbreviates 'temperatur', spelled the same way.",
  },
  "editor.name": {
    locales: ["de"],
    reason: "Cognate — 'Name' is the German noun.",
  },
  "card.machine_offline": {
    locales: ["nl"],
    reason: "Dutch uses both words unchanged: 'Machine offline'.",
  },
  "activity.water": {
    locales: ["nl"],
    reason: "Cognate — 'Water' is the Dutch noun.",
  },
  "values.water": {
    locales: ["nl"],
    reason: "Cognate — 'Water' is the Dutch noun.",
  },
  "freestyle.component": {
    locales: ["nl"],
    reason: "Cognate — 'Component' is the Dutch noun.",
  },
  "settings.levels.water_hardness.3": {
    locales: ["nl"],
    reason: "Cognate — 'Hard' is the Dutch water-hardness level.",
  },
};

function flatten(obj: unknown, prefix = ""): Array<[string, string]> {
  if (typeof obj !== "object" || obj === null) return [[prefix, String(obj)]];
  return Object.entries(obj).flatMap(([k, v]) =>
    flatten(v, prefix ? `${prefix}.${k}` : k),
  );
}

const langDir = join(__dirname, "../src/localize/languages");
const enEntries = flatten(en);
const locales = readdirSync(langDir)
  .filter((f) => f.endsWith(".json") && f !== "en.json")
  .map((f) => f.replace(/\.json$/, ""))
  .sort();

/** Every `<locale>:<key>` whose value is byte-identical to en.json. */
const collisions: Array<{ locale: string; key: string; value: string }> = [];
for (const locale of locales) {
  const data = JSON.parse(readFileSync(join(langDir, `${locale}.json`), "utf8"));
  const flat = new Map(flatten(data));
  for (const [key, value] of enEntries) {
    if (flat.get(key) === value) collisions.push({ locale, key, value });
  }
}

function isAllowed(key: string, locale: string): boolean {
  const allowance = ALLOWED_ENGLISH[key];
  if (!allowance) return false;
  return allowance.locales === "*" || allowance.locales.includes(locale);
}

describe("untranslated English strings", () => {
  it("no locale value equals its en.json source outside the allowlist", () => {
    const leaks = collisions
      .filter(({ key, locale }) => !isAllowed(key, locale))
      .map(({ locale, key, value }) => `${locale}: ${key} = ${JSON.stringify(value)}`);
    expect(leaks).toEqual([]);
  });

  it("every allowlist entry still describes a real collision", () => {
    const seen = new Set(collisions.map(({ locale, key }) => `${locale}:${key}`));
    const stale: string[] = [];
    for (const [key, allowance] of Object.entries(ALLOWED_ENGLISH)) {
      const expected =
        allowance.locales === "*" ? locales : [...allowance.locales].sort();
      for (const locale of expected) {
        if (!seen.has(`${locale}:${key}`)) {
          stale.push(`${locale}: ${key} — now translated, drop it from the allowlist`);
        }
      }
    }
    expect(stale).toEqual([]);
  });

  it("allowlisted locales exist and never include en", () => {
    for (const [key, allowance] of Object.entries(ALLOWED_ENGLISH)) {
      if (allowance.locales === "*") continue;
      for (const locale of allowance.locales) {
        expect(locales, `${key}`).toContain(locale);
      }
    }
  });

  it("every allowlist entry carries a reason", () => {
    for (const [key, allowance] of Object.entries(ALLOWED_ENGLISH)) {
      expect(allowance.reason.length, `${key}`).toBeGreaterThan(10);
    }
  });
});
