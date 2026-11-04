import { afterEach, describe, expect, it, vi } from "vitest";
import { nothing, type TemplateResult } from "lit";
import { parseDirectKeyData } from "../src/directkey";
import { renderDirectKey, type DirectKeySectionProps } from "../src/sections/directkey";
import { resetServerStrings, setServerStrings } from "../src/server-i18n";
import { setLanguage } from "../src/localize/localize";

afterEach(() => { resetServerStrings(); setLanguage(); });

const recipe = {
  category: 0,
  c1_process: "coffee", c1_intensity: "medium", c1_aroma: "standard",
  c1_temperature: "normal", c1_shots: 1, c1_portion_ml: 80,
  c2_process: "none", c2_intensity: "medium", c2_aroma: "standard",
  c2_temperature: "normal", c2_shots: 0, c2_portion_ml: 0,
};
const attributes = {
  active_profile: 1,
  directkey_recipes: { 1: { Espresso: recipe }, 2: { Espresso: recipe }, 3: { Espresso: recipe } },
  directkey_drinks: {
    1: { espresso: { type: 2, name: "Lungo", name_key: "lungo" } },
    2: { espresso: { type: 1, name: "Ristretto", name_key: "ristretto" } },
    3: { espresso: { type: 3, name: "Doppio", name_key: "doppio" } },
  },
};

function props(overrides: Partial<DirectKeySectionProps> = {}): DirectKeySectionProps {
  return {
    data: parseDirectKeyData(attributes)!, selected: null, twoCups: false,
    onCardClick: vi.fn(), onLongPressStart: vi.fn(), onLongPressCancel: vi.fn(),
    onToggleTwoCups: vi.fn(), ...overrides,
  };
}

// Inspect the real Lit result, including its label text and bound listeners.
// No DOM shim or replacement renderer changes the production template.
function firstTile(input: DirectKeySectionProps): TemplateResult {
  const grid = renderDirectKey(input) as TemplateResult;
  return (grid.values[0] as unknown[]).find((v) => v !== nothing) as TemplateResult;
}

function label(tile: TemplateResult): string {
  const marker = tile.strings.findIndex((s) => s.includes('class="dk-card-label"'));
  return tile.values[marker] as string;
}

function listener(tile: TemplateResult, event: string): (...args: unknown[]) => void {
  const marker = tile.strings.findIndex((s) => s.endsWith(`@${event}=`));
  return tile.values[marker] as (...args: unknown[]) => void;
}

describe("configured DirectKey titles", () => {
  it("renders Lungo in the Espresso slot and uses it for the brew prompt", () => {
    expect(label(firstTile(props()))).toBe("Lungo");
    expect(label(firstTile(props({ selected: "espresso" })))).toBe("Brew Lungo");
  });

  it("updates the title when the active profile changes", () => {
    for (const [active_profile, title] of [[1, "Lungo"], [2, "Ristretto"], [3, "Doppio"]] as const) {
      expect(label(firstTile(props({ data: parseDirectKeyData({ ...attributes, active_profile })! })))).toBe(title);
    }
  });

  it("uses recipe-name translations and updates on locale changes", () => {
    setLanguage({ locale: { language: "ru" } } as never);
    setServerStrings({ "recipes.name.lungo": "Лунго", "values.directkey_category.espresso": "Эспрессо" });
    expect(label(firstTile(props({ selected: "espresso" })))).toBe("Готовить: Лунго");
    setLanguage();
    setServerStrings({ "recipes.name.lungo": "Lungo (translated)" });
    expect(label(firstTile(props()))).toBe("Lungo (translated)");
    resetServerStrings();
    expect(label(firstTile(props()))).toBe("Lungo");
  });

  it("falls back to the category for old servers and removed or invalid metadata", () => {
    expect(label(firstTile(props()))).toBe("Lungo");
    for (const directkey_drinks of [undefined, {}, { 1: { espresso: null } }, { 1: { espresso: { type: 24, name: "Freestyle", name_key: "freestyle" } } }]) {
      const data = parseDirectKeyData({ ...attributes, directkey_drinks })!;
      expect(label(firstTile(props({ data })))).toBe("Espresso");
    }
  });

  it("keeps the category and active-profile recipe as the click and edit targets", () => {
    const input = props({ selected: "espresso" });
    const tile = firstTile(input);
    listener(tile, "click")();
    listener(tile, "pointerdown")();
    expect(input.onCardClick).toHaveBeenCalledExactlyOnceWith("espresso");
    expect(input.onLongPressStart).toHaveBeenCalledExactlyOnceWith("espresso", input.data.profiles[1].espresso);
    expect(input.data.activeProfile).toBe(1);
    expect(input.data.profiles[1].espresso.category).toBe(0);
  });
});
