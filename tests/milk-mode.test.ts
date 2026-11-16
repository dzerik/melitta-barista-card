import { afterEach, describe, expect, it, vi } from "vitest";
import type { TemplateResult } from "lit";
import type { UiContract } from "../src/contract";
import type { DirectKeyRecipe } from "../src/types";
import { defaultRecipe, fromDkRecipe, toServicePayload, type RecipeComponents } from "../src/recipe";
import { renderComponentForm } from "../src/sections/controls";
import { resolveParameters } from "../src/contract-wiring";
import { brewFreestyle, saveDirectkey } from "../src/api";
import { resetServerStrings, setServerStrings } from "../src/server-i18n";
import { setLanguage } from "../src/localize/localize";

// Node's Lit SSR shim is sufficient: keep the real card, form, and listeners.
vi.hoisted(() => { Object.assign(globalThis, { window: { customCards: [] } }); });
import { MelittaBaristaCard } from "../src/melitta-barista-card";

afterEach(() => { resetServerStrings(); setLanguage(); });

function templates(value: unknown): TemplateResult[] {
  if (Array.isArray(value)) return value.flatMap(templates);
  if (!value || typeof value !== "object" || !("strings" in value) || !("values" in value)) return [];
  const template = value as TemplateResult;
  return [template, ...template.values.flatMap(templates)];
}
function row(tree: TemplateResult, label: string): TemplateResult | undefined {
  return templates(tree).find(t => t.strings.some(s => s.includes('class="segment-label"')) && t.values.includes(label));
}
function buttons(tree: TemplateResult): TemplateResult[] {
  return templates(tree).filter(t => t.strings.some(s => s.includes('<button class="segment-opt"')));
}
function click(button: TemplateResult): void {
  const index = button.strings.findIndex(s => s.endsWith('@click='));
  (button.values[index] as () => void)();
}
function activeLabel(segment: TemplateResult): unknown {
  return buttons(segment).find(b => b.values[b.strings.findIndex(s => s.endsWith('?data-active='))] === true)?.values.at(-1);
}
function form(rc: RecipeComponents, comp: "c1" | "c2", contract: UiContract | null = null): TemplateResult {
  return renderComponentForm({ title: comp, containerClass: "test-component", spec: rc[comp],
    allowNoneProcess: comp === "c2", vocab: resolveParameters(contract),
    onChange: patch => { rc[comp] = { ...rc[comp], ...patch }; },
  });
}
function choose(rc: RecipeComponents, comp: "c1" | "c2", label: string, value: string): void {
  const segment = row(form(rc, comp), label);
  expect(segment, `visible ${label} control`).toBeDefined();
  const button = buttons(segment!).find(b => b.values.at(-1) === value);
  expect(button, `selectable ${value} choice`).toBeDefined();
  click(button!);
}
function milkRecipe(shots1 = 0, shots2 = 1): DirectKeyRecipe {
  return { category: 4, c1_process: "milk", c1_intensity: "medium", c1_aroma: "standard",
    c1_temperature: "normal", c1_shots: shots1, c1_portion_ml: 80,
    c2_process: "milk", c2_intensity: "medium", c2_aroma: "standard",
    c2_temperature: "normal", c2_shots: shots2, c2_portion_ml: 120 };
}
function withDescriptor(descriptor: unknown): UiContract {
  return { parameters: { milk_mode: descriptor } } as unknown as UiContract;
}

describe("milk mode choice to legacy service requests", () => {
  it.each(["c1", "c2"] as const)("sends explicit foam and warm milk for %s on old backends", async comp => {
    const rc = defaultRecipe();
    rc[comp] = { ...rc[comp], process: "milk", shots: "three" };
    const requests: unknown[][] = [];
    const hass = { callService: async (...args: unknown[]) => { requests.push(args); } } as never;
    choose(rc, comp, "Milk mode", "Milk Froth");
    await brewFreestyle(hass, "machine", "Custom", rc);
    expect(requests[0]).toEqual(["melitta_barista", "brew_freestyle", {
      entity_id: "button.machine_brew", name: "Custom", ...toServicePayload(defaultRecipe()),
      [`process${comp === "c1" ? 1 : 2}`]: "milk", [`shots${comp === "c1" ? 1 : 2}`]: "none",
    }]);
    choose(rc, comp, "Milk mode", "Milk");
    await brewFreestyle(hass, "machine", "Custom", rc);
    expect(requests[1][2]).toMatchObject({ [`shots${comp === "c1" ? 1 : 2}`]: "one" });
    expect(rc[comp].shots).toBe("three");
    expect(Object.keys(requests[1][2] as object)).not.toContain("milk_mode1");
    expect(Object.keys(requests[1][2] as object)).not.toContain("milk_mode2");
  });

  it.each(["c1", "c2"] as const)("keeps %s coffee shots through milk and foam switches", comp => {
    const rc = defaultRecipe();
    rc[comp] = { ...rc[comp], process: "coffee", shots: "two" };
    choose(rc, comp, "Process", "Milk");
    choose(rc, comp, "Milk mode", "Milk Froth");
    expect(toServicePayload(rc)[comp === "c1" ? "shots1" : "shots2"]).toBe("none");
    choose(rc, comp, "Milk mode", "Milk");
    choose(rc, comp, "Process", "Coffee");
    expect(toServicePayload(rc)[comp === "c1" ? "shots1" : "shots2"]).toBe("two");
    expect(row(form(rc, comp), "Milk mode")).toBeUndefined();
  });

  it("edits both components independently and keeps DirectKey category/profile targets", async () => {
    const rc = fromDkRecipe(milkRecipe());
    choose(rc, "c1", "Milk mode", "Milk");
    choose(rc, "c2", "Milk mode", "Milk Froth");
    const requests: unknown[][] = [];
    await saveDirectkey({ callService: async (...args: unknown[]) => requests.push(args) } as never,
      "machine", "milk", 3, rc);
    expect(requests).toEqual([["melitta_barista", "save_directkey", {
      entity_id: "button.machine_brew", category: "milk", profile_id: 3,
      process1: "milk", intensity1: "medium", aroma1: "standard", portion1_ml: 80,
      temperature1: "normal", shots1: "one", process2: "milk", intensity2: "medium",
      aroma2: "standard", portion2_ml: 120, temperature2: "normal", shots2: "none",
    }]]);
  });

  it.each([[0, "Milk Froth", "none"], [1, "Milk", "one"], [2, "Milk", "two"], [3, "Milk", "three"]])(
    "displays legacy shots %s without silently normalizing untouched recipes", (shots, label, outgoing) => {
      const rc = fromDkRecipe(milkRecipe(shots as number, shots as number));
      for (const comp of ["c1", "c2"] as const) {
        expect(activeLabel(row(form(rc, comp), "Milk mode")!)).toBe(label);
        expect(rc[comp]).not.toHaveProperty("milk_mode");
      }
      expect(toServicePayload(rc)).toMatchObject({ shots1: outgoing, shots2: outgoing });
    });

  it.each(["coffee", "water", "none"])("never applies a stale milk mode to %s", process => {
    const rc = defaultRecipe();
    Object.assign(rc.c2, { process: "milk", shots: "three" });
    choose(rc, "c2", "Milk mode", "Milk Froth");
    Object.assign(rc.c2, { process });
    expect(toServicePayload(rc).shots2).toBe("three");
    expect(row(form(rc, "c2"), "Milk mode")).toBeUndefined();
  });
});

describe("milk-mode metadata and labels", () => {
  it("uses descriptor tokens, labels, order and applicability", () => {
    const rc = fromDkRecipe(milkRecipe());
    const contract = withDescriptor({ kind: "enum", scope: ["freestyle"], applies_to: ["milk"], tokens: ["milk_froth"] });
    setServerStrings({ "values.milk_mode.milk_froth": "Foam from server" });
    expect(buttons(row(form(rc, "c1", contract), "Milk mode")!).map(b => b.values.at(-1))).toEqual(["Foam from server"]);
    const hidden = withDescriptor({ kind: "enum", scope: ["freestyle"], applies_to: [], tokens: ["warm_milk"] });
    expect(row(form(rc, "c1", hidden), "Milk mode")).toBeUndefined();
  });

  it.each([undefined, { kind: "future_kind", scope: ["freestyle"], tokens: ["milk_froth"] }])(
    "offers both known modes without usable metadata (%j)", descriptor => {
      const rc = fromDkRecipe(milkRecipe());
      expect(buttons(row(form(rc, "c1", withDescriptor(descriptor)), "Milk mode")!).map(b => b.values.at(-1))).toEqual(["Milk", "Milk Froth"]);
    });

  it("hides a milk-mode descriptor scoped away from freestyle", () => {
    const rc = fromDkRecipe(milkRecipe());
    expect(row(form(rc, "c1", withDescriptor({ kind: "enum", scope: ["future_scope"], tokens: ["warm_milk"] })), "Milk mode")).toBeUndefined();
  });

  it("falls back to recipe-name server strings and localized drink names", () => {
    const rc = fromDkRecipe(milkRecipe());
    setServerStrings({ "recipes.name.warm_milk": "Heated milk", "recipes.name.milk_froth": "Foamed milk" });
    expect(buttons(row(form(rc, "c1"), "Milk mode")!).map(b => b.values.at(-1))).toEqual(["Heated milk", "Foamed milk"]);
    resetServerStrings();
    setLanguage({ locale: { language: "ru" } } as never);
    expect(buttons(row(form(rc, "c1"), "Режим молока")!).map(b => b.values.at(-1))).toEqual(["Тёплое молоко", "Молочная пена"]);
  });
});

it("the real DirectKey dialog clears prior mode choices when a different recipe opens", () => {
  const card = new MelittaBaristaCard() as any;
  card.setConfig({ type: "custom:melitta-barista-card", entity_prefix: "machine" });
  card.hass = { states: {} };
  card._openEditDialog("milk", milkRecipe());
  choose(card._editState, "c1", "Milk mode", "Milk");
  card._openEditDialog("milk", milkRecipe(0, 3));
  expect(activeLabel(row(form(card._editState, "c1"), "Milk mode")!)).toBe("Milk Froth");
  expect(card._editState.c1).not.toHaveProperty("milk_mode");
  expect(toServicePayload(card._editState)).toMatchObject({ shots1: "none", shots2: "three" });
});


describe("native optional mode initialization", () => {
  function nativeCard(states: Record<string, unknown>, recipe = defaultRecipe()): any {
    const card = new MelittaBaristaCard() as any;
    card.setConfig({ type: "custom:melitta-barista-card", entity_prefix: "machine", show_freestyle: true });
    card._fsRecipe = recipe;
    card.hass = { states, locale: { language: "en" } };
    card.willUpdate(new Map([["hass", undefined]]));
    return card;
  }

  it("seeds independent explicit modes once without replacing the card's coffee shots", () => {
    const card = nativeCard({
      "select.machine_freestyle_milk_mode_1": { state: "milk_froth", attributes: { milk_mode: "milk_froth" } },
      "select.machine_freestyle_milk_mode_2": { state: "warm_milk", attributes: { milk_mode: "warm_milk" } },
    });
    expect(card._fsRecipe.c1).toMatchObject({ milk_mode: "milk_froth", shots: "one" });
    expect(card._fsRecipe.c2).toMatchObject({ milk_mode: "warm_milk", shots: "none" });
    expect(toServicePayload(card._fsRecipe)).toMatchObject({ shots1: "one", shots2: "none" });
    card._updateFs("c1", { milk_mode: "warm_milk" });
    card.willUpdate(new Map([["hass", undefined]]));
    expect(card._fsRecipe.c1.milk_mode).toBe("warm_milk");
  });

  it("preserves absence for derived native labels and unavailable or missing entities", () => {
    const card = nativeCard({
      "select.machine_freestyle_milk_mode_1": { state: "milk_froth", attributes: { milk_mode: null } },
      "select.machine_freestyle_milk_mode_2": { state: "unavailable", attributes: {} },
    });
    expect(card._fsRecipe.c1).not.toHaveProperty("milk_mode");
    expect(card._fsRecipe.c2).not.toHaveProperty("milk_mode");
    expect(nativeCard({})._fsRecipe).toEqual(defaultRecipe());
  });

  it.each(["unavailable", "unknown"])("seeds valid optional attributes despite %s native state", state => {
    const recipe = defaultRecipe();
    Object.assign(recipe.c1, { process: "coffee", shots: "two" });
    Object.assign(recipe.c2, { process: "coffee", shots: "three" });
    const card = nativeCard({
      "select.machine_freestyle_milk_mode_1": { state, attributes: { milk_mode: "milk_froth" } },
      "select.machine_freestyle_milk_mode_2": { state, attributes: { milk_mode: "milk_froth" } },
    }, recipe);
    expect(card._fsRecipe.c1).toMatchObject({ milk_mode: "milk_froth", shots: "two" });
    expect(card._fsRecipe.c2).toMatchObject({ milk_mode: "milk_froth", shots: "three" });
    expect(toServicePayload(card._fsRecipe)).toMatchObject({ shots1: "two", shots2: "three" });
    card._updateFs("c1", { process: "milk" });
    card._updateFs("c2", { process: "milk" });
    expect(toServicePayload(card._fsRecipe)).toMatchObject({ shots1: "none", shots2: "none" });
    expect(card._fsRecipe.c1.shots).toBe("two");
    expect(card._fsRecipe.c2.shots).toBe("three");
  });

  it.each(["unavailable", "unknown"])("initializes null attributes as absence despite %s state", state => {
    const recipe = fromDkRecipe(milkRecipe(2, 3));
    const card = nativeCard({
      "select.machine_freestyle_milk_mode_1": { state, attributes: { milk_mode: null } },
      "select.machine_freestyle_milk_mode_2": { state, attributes: { milk_mode: null } },
    }, recipe);
    expect(card._fsRecipe.c1).not.toHaveProperty("milk_mode");
    expect(card._fsRecipe.c2).not.toHaveProperty("milk_mode");
    expect(toServicePayload(card._fsRecipe)).toMatchObject({ shots1: "two", shots2: "three" });
    // The initial null is a complete seed; later native changes do not replace local editing state.
    card.hass = { ...card.hass, states: {
      "select.machine_freestyle_milk_mode_1": { state: "milk_froth", attributes: { milk_mode: "milk_froth" } },
      "select.machine_freestyle_milk_mode_2": { state: "warm_milk", attributes: { milk_mode: "warm_milk" } },
    } };
    card.willUpdate(new Map([["hass", undefined]]));
    expect(card._fsRecipe.c1).not.toHaveProperty("milk_mode");
    expect(card._fsRecipe.c2).not.toHaveProperty("milk_mode");
    expect(toServicePayload(card._fsRecipe)).toMatchObject({ shots1: "two", shots2: "three" });
  });

  it.each(["unavailable", "unknown"])("ignores %s fallback states without a valid optional attribute", state => {
    const card = nativeCard({
      "select.machine_freestyle_milk_mode_1": { state, attributes: {} },
      "select.machine_freestyle_milk_mode_2": { state, attributes: { milk_mode: "future_mode" } },
    });
    expect(card._fsRecipe).toEqual(defaultRecipe());
  });

  it("accepts a legacy external select token when its optional attribute is absent", () => {
    const card = nativeCard({ "select.machine_freestyle_milk_mode_2": { state: "milk_froth", attributes: {} } });
    expect(card._fsRecipe.c2).toMatchObject({ milk_mode: "milk_froth", shots: "none" });
  });

  it("seeds late entity arrival and never overwrites an earlier local choice", () => {
    const card = nativeCard({});
    card._updateFs("c1", { milk_mode: "warm_milk" });
    card.hass = { ...card.hass, states: {
      "select.machine_freestyle_milk_mode_1": { state: "milk_froth", attributes: {} },
      "select.machine_freestyle_milk_mode_2": { state: "milk_froth", attributes: {} },
    } };
    card.willUpdate(new Map([["hass", undefined]]));
    expect(card._fsRecipe.c1.milk_mode).toBe("warm_milk");
    expect(card._fsRecipe.c2.milk_mode).toBe("milk_froth");
    expect(card._buildTrackedIds("machine")).toContain("select.machine_freestyle_milk_mode_2");
  });
});

it("binds the real Freestyle and DirectKey forms to their outgoing requests", async () => {
  const requests: unknown[][] = [];
  const card = new MelittaBaristaCard() as any;
  card.setConfig({ type: "custom:melitta-barista-card", entity_prefix: "machine" });
  card.hass = { states: { "select.machine_profile": { state: "Profile 3", attributes: {
    active_profile: 3, directkey_recipes: { 3: { Milk: milkRecipe() } },
  } } }, callService: async (...args: unknown[]) => { requests.push(args); } };
  card._fsRecipe = fromDkRecipe(milkRecipe());
  let controls = templates(card._renderFreestyle()).filter(t => t.strings.some(s => s.includes('class="segment-label"')) && t.values.includes("Milk mode"));
  expect(controls).toHaveLength(2);
  click(buttons(controls[0]).find(b => b.values.at(-1) === "Milk")!);
  click(buttons(controls[1]).find(b => b.values.at(-1) === "Milk Froth")!);
  card._brewFreestyle();
  expect(requests[0]).toMatchObject(["melitta_barista", "brew_freestyle", { shots1: "one", shots2: "none" }]);
  card._openEditDialog("milk", milkRecipe());
  controls = templates(card._renderEditDialog()).filter(t => t.strings.some(s => s.includes('class="segment-label"')) && t.values.includes("Milk mode"));
  expect(controls).toHaveLength(2);
  click(buttons(controls[1]).find(b => b.values.at(-1) === "Milk Froth")!);
  card._saveDirectkey();
  await Promise.resolve();
  expect(requests[1]).toMatchObject(["melitta_barista", "save_directkey", { category: "milk", profile_id: 3, shots1: "none", shots2: "none" }]);
});

it.each([["warm_milk", "one"], ["milk_froth", "none"]])("serializes explicit %s without leaking new service fields", (mode, shots) => {
  const rc = defaultRecipe();
  Object.assign(rc.c1, { process: "milk", shots: "three", milk_mode: mode });
  Object.assign(rc.c2, { process: "milk", shots: "two", milk_mode: mode });
  const payload = toServicePayload(rc);
  expect(payload).toMatchObject({ process1: "milk", process2: "milk", shots1: shots, shots2: shots });
  expect(Object.keys(payload)).toHaveLength(12);
  expect(rc.c1.shots).toBe("three");
  expect(rc.c2.shots).toBe("two");
});
