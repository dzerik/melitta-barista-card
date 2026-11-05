import { expect, it, vi } from "vitest";
import type { DirectKeyRecipe } from "../src/types";

// Keep real card handlers; Lit's Node shim only needs the registration surface.
vi.hoisted(() => { Object.assign(globalThis, { window: { customCards: [] } }); });
import { MelittaBaristaCard } from "../src/melitta-barista-card";

const RECIPE: DirectKeyRecipe = {
  category: 0,
  c1_process: "coffee", c1_intensity: "strong", c1_aroma: "standard",
  c1_temperature: "normal", c1_shots: 1, c1_portion_ml: 80,
  c2_process: "none", c2_intensity: "medium", c2_aroma: "standard",
  c2_temperature: "normal", c2_shots: 0, c2_portion_ml: 0,
};

function setupCard() {
  const card = new MelittaBaristaCard() as any;
  card.setConfig({ type: "custom:melitta-barista-card", entity_prefix: "machine" });
  const callService = vi.fn().mockResolvedValue({});
  const state = (active: number, entryId = "entry-a") => ({
    states: {
      "sensor.machine_connection": { state: "Connected", attributes: { entry_id: entryId } },
      "select.machine_profile": {
        state: `Profile ${active}`,
        attributes: {
          active_profile: active,
          directkey_recipes: {
            1: { Espresso: RECIPE },
            2: { Espresso: { ...RECIPE, c1_portion_ml: 140 } },
          },
        },
      },
    },
    callService,
  });
  card.hass = state(1);
  return { card, callService, state };
}

it("saves the opened recipe to its original profile after an external profile switch", async () => {
  const { card, callService, state } = setupCard();
  card._openEditDialog("espresso", RECIPE);
  card.hass = state(2);
  card._saveDirectkey();
  await Promise.resolve();
  expect(callService).toHaveBeenCalledExactlyOnceWith("melitta_barista", "save_directkey",
    expect.objectContaining({ entity_id: "button.machine_brew", profile_id: 1, portion1_ml: 80 }));
});

it("cannot save an open recipe to a different machine after reconfiguration", () => {
  const { card, callService } = setupCard();
  card._openEditDialog("espresso", RECIPE);
  card.setConfig({ type: "custom:melitta-barista-card", entity_prefix: "other" });
  card._saveDirectkey();
  expect(callService).not.toHaveBeenCalled();
});

it("cannot save an open recipe after the integration entry changes", () => {
  const { card, callService, state } = setupCard();
  card._openEditDialog("espresso", RECIPE);
  card.hass = state(1, "entry-b");
  card._saveDirectkey();
  expect(callService).not.toHaveBeenCalled();
});

it("keeps the pressed recipe profile when it changes during the long press", async () => {
  const { card, callService, state } = setupCard();
  vi.useFakeTimers();
  try {
    card._startDkLongPress("espresso", RECIPE);
    card.hass = state(2);
    vi.advanceTimersByTime(1000);
    card._saveDirectkey();
    await Promise.resolve();
    expect(callService).toHaveBeenCalledWith("melitta_barista", "save_directkey",
      expect.objectContaining({ profile_id: 1, portion1_ml: 80 }));
  } finally {
    vi.useRealTimers();
  }
});
