import { describe, it, expect, afterEach } from "vitest";
import type { HomeAssistant } from "custom-card-helpers";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  localize,
  localizeOptional,
  setLanguage,
  getLanguage,
  currentLanguage,
} from "../src/localize/localize";
import en from "../src/localize/languages/en.json";

function hassWith(lang: string): HomeAssistant {
  return { locale: { language: lang } } as unknown as HomeAssistant;
}

afterEach(() => setLanguage(undefined));

describe("getLanguage", () => {
  it("prefers hass.locale.language and normalizes it", () => {
    expect(getLanguage(hassWith("de_DE"))).toBe("de-de");
    expect(getLanguage(undefined)).toBe("en");
  });

  it("falls back to legacy hass.language", () => {
    expect(getLanguage({ language: "ru" } as unknown as HomeAssistant)).toBe("ru");
  });
});

describe("localize", () => {
  it("resolves nested keys with interpolation", () => {
    expect(localize("directkey.brew_drink", { drink: "Espresso" })).toBe("Brew Espresso");
    expect(localize("settings.minutes", { value: 30 })).toBe("30 min");
  });

  it("switches language via setLanguage", () => {
    setLanguage(hassWith("ru"));
    expect(currentLanguage()).toBe("ru");
    expect(localize("common.cancel")).toBe("Отмена");
    setLanguage(hassWith("de"));
    expect(localize("common.cancel")).toBe("Abbrechen");
  });

  it("resolves regional variants to the base language", () => {
    setLanguage(hassWith("de_AT"));
    expect(localize("common.save")).toBe("Speichern");
  });

  it("falls back to en, then to the key itself", () => {
    setLanguage(hassWith("ja"));
    expect(localize("common.cancel")).toBe("Cancel");
    expect(localize("no.such.key")).toBe("no.such.key");
    expect(localizeOptional("no.such.key")).toBeUndefined();
  });
});

describe("translation completeness", () => {
  function flatten(obj: unknown, prefix = ""): string[] {
    if (typeof obj !== "object" || obj === null) return [prefix];
    return Object.entries(obj).flatMap(([k, v]) =>
      flatten(v, prefix ? `${prefix}.${k}` : k),
    );
  }

  const langDir = join(__dirname, "../src/localize/languages");
  const enKeys = flatten(en).sort();
  const files = readdirSync(langDir).filter((f) => f.endsWith(".json"));

  it("mirrors the integration's language list (29 languages)", () => {
    expect(files.length).toBe(29);
  });

  it.each(files)("%s contains exactly the same keys as en.json", (file) => {
    const data = JSON.parse(readFileSync(join(langDir, file), "utf8"));
    expect(flatten(data).sort()).toEqual(enKeys);
  });

  it.each(files)("%s preserves the {placeholders} of en.json", (file) => {
    const data = JSON.parse(readFileSync(join(langDir, file), "utf8"));
    const get = (obj: unknown, key: string) =>
      key.split(".").reduce<any>((o, k) => o?.[k], obj) as string;
    for (const key of enKeys) {
      const placeholders = (get(en, key).match(/\{\w+\}/g) ?? []).sort();
      const translated = (get(data, key).match(/\{\w+\}/g) ?? []).sort();
      expect(translated, `${file}: ${key}`).toEqual(placeholders);
    }
  });
});
