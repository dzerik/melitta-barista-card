import { describe, expect, it, vi } from "vitest";

import { fetchDirectKeyIcons } from "../src/api";

/**
 * The DirectKey tiles used to draw a stock glyph per category, so two profiles
 * whose cappuccino differs looked identical and an edited slot never changed
 * its picture. The composition-derived spec comes from `recipes/list` — these
 * pin the shape the card reads and, more importantly, that every failure mode
 * degrades to "no spec" rather than to a wrong drink.
 */
function hassWith(response: unknown, capture?: (msg: unknown) => void) {
  return {
    callWS: vi.fn(async (msg: unknown) => {
      capture?.(msg);
      if (response instanceof Error) throw response;
      return response;
    }),
  } as never;
}

const ICON = { spec_version: 1, glass: "cup", total_ml: 190, fill_level: 0.9, layers: [{ role: "milk", ml: 150, fraction: 1, intensity: 0 }], foam: null, steam: true };

describe("fetchDirectKeyIcons", () => {
  it("keys the specs by profile and category token", async () => {
    const icons = await fetchDirectKeyIcons(hassWith({
      base_recipes: [],
      directkey: [
        { profile_id: 0, recipes: [{ category: "cappuccino", icon: ICON }] },
        { profile_id: 3, recipes: [{ category: "espresso", icon: ICON }] },
      ],
    }), "entry-1");
    expect(icons[0].cappuccino).toEqual(ICON);
    expect(icons[3].espresso).toEqual(ICON);
  });

  it("asks the entry it was given", async () => {
    let seen: unknown = null;
    await fetchDirectKeyIcons(hassWith({ directkey: [] }, (m) => { seen = m; }), "entry-7");
    expect(seen).toEqual({ type: "melitta_barista/recipes/list", entry_id: "entry-7" });
  });

  it("drops rows with no category token, so a pre-0.93 server contributes nothing", async () => {
    const icons = await fetchDirectKeyIcons(hassWith({
      directkey: [{ profile_id: 0, recipes: [{ icon: ICON }, { category: "", icon: ICON }] }],
    }), "e");
    expect(icons[0]).toEqual({});
  });

  it("drops rows with no icon rather than inventing one", async () => {
    const icons = await fetchDirectKeyIcons(hassWith({
      directkey: [{ profile_id: 0, recipes: [{ category: "milk", icon: null }] }],
    }), "e");
    expect(icons[0]).toEqual({});
  });

  it("resolves empty when the command fails — the tile keeps its category glyph", async () => {
    expect(await fetchDirectKeyIcons(hassWith(new Error("not admin")), "e")).toEqual({});
  });

  it("survives a response that is not shaped like one", async () => {
    expect(await fetchDirectKeyIcons(hassWith(null), "e")).toEqual({});
    expect(await fetchDirectKeyIcons(hassWith({ directkey: [{ profile_id: 1 }] }), "e")).toEqual({ 1: {} });
  });
});
