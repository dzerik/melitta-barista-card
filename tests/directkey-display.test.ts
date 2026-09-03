// Zone C-L — pure display helpers wiring the v3 DirectKey model into the
// existing section renderers (spec §9.3.6 rules 2/4/6).

import { afterEach, describe, expect, it } from "vitest";
import {
  buildProfileTabs,
  directKeyCategoryLabel,
} from "../src/directkey-display";
import { resolveProfileSlots, type ResolvedProfileSlot } from "../src/profile";
import { resetServerStrings, setServerStrings } from "../src/server-i18n";

afterEach(() => resetServerStrings());

// ---------------------------------------------------------------------------
// directKeyCategoryLabel — §9.3.6 rule 2 label chain
// ---------------------------------------------------------------------------

describe("directKeyCategoryLabel", () => {
  it("contract mode prefers the served values.directkey_category key", () => {
    setServerStrings({ "values.directkey_category.espresso": "Espresso (served)" });
    expect(directKeyCategoryLabel("espresso", true)).toBe("Espresso (served)");
  });

  it("contract mode falls back to the bundle drinks key", () => {
    expect(directKeyCategoryLabel("latte_macchiato", true)).toBe("Latte Macchiato");
  });

  it("contract mode humanizes an unknown token (tolerated, §5.3.2)", () => {
    expect(directKeyCategoryLabel("flat_white", true)).toBe("Flat white");
  });

  it("legacy mode ignores installed server strings (exact 2.7.0 labels)", () => {
    setServerStrings({ "values.directkey_category.espresso": "Espresso (served)" });
    expect(directKeyCategoryLabel("espresso", false)).toBe("Espresso");
  });

  it("legacy mode still renders the bundle label", () => {
    expect(directKeyCategoryLabel("milk_froth", false)).toBe("Milk Froth");
  });
});

// ---------------------------------------------------------------------------
// buildProfileTabs — §9.3.6 rules 4/6 tab model over resolved slots
// ---------------------------------------------------------------------------

const OPTIONS = ["My Coffee", "XXXUSER", "Profile 2", "Profile 3"];

function slotsFixture(states: Record<string, string | undefined>): ResolvedProfileSlot[] {
  return resolveProfileSlots(
    [
      { slot: 0, fixed: true, name_key: "my_coffee" },
      { slot: 1, name_entity_suffix: "profile_1_name", active_entity_suffix: "profile_1_active" },
      { slot: 2, name_entity_suffix: "profile_2_name", active_entity_suffix: "profile_2_active" },
      { slot: 3, name_entity_suffix: "profile_3_name", active_entity_suffix: "profile_3_active" },
    ],
    (domain, suffix) => states[`${domain}.${suffix}`],
  );
}

const LIVE_STATES = {
  "switch.profile_1_active": "on",
  "text.profile_1_name": "XXXUSER",
  "switch.profile_2_active": "off",
  "switch.profile_3_active": "on",
  // profile_3_name absent → visible read-only, name null (§9.3.6 rule 6)
};

describe("buildProfileTabs", () => {
  it("renders only visible slots, keeping stable slot identity", () => {
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), OPTIONS, null);
    expect(tabs.map((t) => t.slot)).toEqual([0, 1, 3]);
  });

  it("labels: fixed slot from the select option, bound name entity, option fallback", () => {
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), OPTIONS, null);
    expect(tabs.map((t) => t.label)).toEqual(["My Coffee", "XXXUSER", "Profile 3"]);
  });

  it("fixed-slot label prefers the served recipes.category key (§9.3.2 name_key)", () => {
    setServerStrings({ "recipes.category.my_coffee": "Mein Kaffee" });
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), OPTIONS, null);
    expect(tabs[0].label).toBe("Mein Kaffee");
  });

  it("marks active by the slot the selected option resolves to (PR #6 rule)", () => {
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), OPTIONS, "XXXUSER");
    expect(tabs.map((t) => t.active)).toEqual([false, true, false]);
  });

  it("no selection → no active tab", () => {
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), OPTIONS, null);
    expect(tabs.every((t) => !t.active)).toBe(true);
  });

  it("a selected option outside the options array marks nothing active", () => {
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), OPTIONS, "Ghost");
    expect(tabs.every((t) => !t.active)).toBe(true);
  });

  it("options shorter than slots (§9.1.2.5 lag): placeholder label, tab kept", () => {
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), ["My Coffee", "XXXUSER"], null);
    expect(tabs.map((t) => t.label)).toEqual(["My Coffee", "XXXUSER", "#3"]);
  });

  it("fixed slot label survives an empty options array", () => {
    setServerStrings(null);
    const tabs = buildProfileTabs(slotsFixture(LIVE_STATES), [], null);
    expect(tabs[0].label).toBe("My coffee");
  });

  it("empty slot list yields no tabs", () => {
    expect(buildProfileTabs([], OPTIONS, "My Coffee")).toEqual([]);
  });
});
