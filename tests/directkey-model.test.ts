import { describe, expect, it } from "vitest";

import { DIRECTKEY_CATEGORIES } from "../src/const";
import {
  parseDirectKeyData,
  resolveDirectKeyModel,
  type ContractDirectKey,
} from "../src/directkey";
import { resolveProfileSlots, type ProfileSlotEntry } from "../src/profile";
import type { UiContract } from "../src/contract";

// §9.3.3 pinned example payload (Melitta Barista TS) — verbatim.
const TS_DIRECTKEY: ContractDirectKey = {
  categories: [
    { category: "espresso", id: 0, machine_button: true, icon: "mdi:coffee" },
    { category: "cafe_creme", id: 1, machine_button: true, icon: "mdi:coffee-outline" },
    { category: "cappuccino", id: 2, machine_button: true, icon: "mdi:coffee" },
    { category: "latte_macchiato", id: 3, machine_button: true, icon: "mdi:glass-mug-variant" },
    { category: "milk_froth", id: 4, machine_button: true, icon: "mdi:cup" },
    { category: "milk", id: 5, machine_button: false, icon: "mdi:cup-outline" },
    { category: "water", id: 6, machine_button: true, icon: "mdi:cup-water" },
  ],
  profiles: [
    { slot: 0, fixed: true, name_key: "my_coffee" },
    ...Array.from({ length: 8 }, (_, i) => ({
      slot: i + 1,
      name_entity_suffix: `profile_${i + 1}_name`,
      active_entity_suffix: `profile_${i + 1}_active`,
    })),
  ],
  profile_select_entity_suffix: "profile",
  active_profile_attribute: "active_profile",
};

function contractWith(directkey: unknown): UiContract {
  return { directkey } as unknown as UiContract;
}

describe("resolveDirectKeyModel — tier fallback (§9.3.6 rule 1)", () => {
  it("degrades to the legacy 2.7.0 model without a contract", () => {
    for (const contract of [null, undefined]) {
      const model = resolveDirectKeyModel(contract);
      expect(model.source).toBe("legacy");
      // Exactly-2.7.0 order: the const array, not the contract enum order.
      expect(model.categories.map((c) => c.category)).toEqual([...DIRECTKEY_CATEGORIES]);
      expect(model.categories.every((c) => c.machineButton)).toBe(true);
      expect(model.categories.every((c) => c.icon === null)).toBe(true);
      expect(model.profiles).toBeNull();
      expect(model.profileSelectSuffix).toBe("profile");
      expect(model.activeProfileAttribute).toBe("active_profile");
    }
  });

  it("degrades to legacy when the contract has no directkey block (pre-0.93 / Nivona)", () => {
    expect(resolveDirectKeyModel({} as UiContract).source).toBe("legacy");
  });

  it("degrades to legacy on a malformed block", () => {
    expect(resolveDirectKeyModel(contractWith("nope")).source).toBe("legacy");
    expect(resolveDirectKeyModel(contractWith({ categories: "nope" })).source).toBe("legacy");
    expect(resolveDirectKeyModel(contractWith({ categories: [] })).source).toBe("legacy");
    expect(
      resolveDirectKeyModel(contractWith({ categories: [{ machine_button: true }] })).source,
    ).toBe("legacy");
  });
});

describe("resolveDirectKeyModel — contract tier (§9.3.2/§9.3.3)", () => {
  it("resolves the pinned TS payload: served order, milk button flag, icons, 9 slots", () => {
    const model = resolveDirectKeyModel(contractWith(TS_DIRECTKEY));
    expect(model.source).toBe("contract");
    // Served order is the normative render order — milk_froth before milk,
    // unlike the legacy const order.
    expect(model.categories.map((c) => c.category)).toEqual([
      "espresso", "cafe_creme", "cappuccino", "latte_macchiato",
      "milk_froth", "milk", "water",
    ]);
    const milk = model.categories.find((c) => c.category === "milk")!;
    expect(milk.machineButton).toBe(false);
    expect(milk.icon).toBe("mdi:cup-outline");
    expect(model.categories.find((c) => c.category === "water")!.machineButton).toBe(true);
    expect(model.profiles).toHaveLength(9);
    expect(model.profiles![0]).toEqual({ slot: 0, fixed: true, name_key: "my_coffee" });
    expect(model.profiles![3]).toEqual({
      slot: 3,
      name_entity_suffix: "profile_3_name",
      active_entity_suffix: "profile_3_active",
    });
    expect(model.profileSelectSuffix).toBe("profile");
    expect(model.activeProfileAttribute).toBe("active_profile");
  });

  it("drops malformed category entries, keeps the rest, tolerates unknown tokens", () => {
    const model = resolveDirectKeyModel(contractWith({
      categories: [
        { category: "espresso", id: 0, machine_button: true, icon: "mdi:coffee" },
        { category: "", id: 1, machine_button: true, icon: "x" },       // dropped
        { id: 2, machine_button: true, icon: "x" },                      // dropped
        "junk",                                                          // dropped
        { category: "turbo_shot", id: 3, machine_button: true, icon: "mdi:flash" }, // kept
      ],
      profiles: [{ slot: 0, fixed: true, name_key: "my_coffee" }],
    }));
    expect(model.source).toBe("contract");
    expect(model.categories.map((c) => c.category)).toEqual(["espresso", "turbo_shot"]);
  });

  it("normalizes fail-open: missing machine_button → true, bad icon → null", () => {
    const model = resolveDirectKeyModel(contractWith({
      categories: [{ category: "espresso", id: 0 }],
      profiles: [{ slot: 0, fixed: true }],
    }));
    expect(model.categories[0].machineButton).toBe(true);
    expect(model.categories[0].icon).toBeNull();
  });

  it("keeps contract categories but nulls profiles when the profiles list is malformed", () => {
    for (const profiles of [undefined, "nope", [], [{ slot: "zero" }]]) {
      const model = resolveDirectKeyModel(contractWith({
        categories: TS_DIRECTKEY.categories,
        profiles,
      }));
      expect(model.source).toBe("contract");
      expect(model.categories).toHaveLength(7);
      expect(model.profiles).toBeNull();
    }
  });

  it("drops malformed profile entries but keeps valid ones", () => {
    const model = resolveDirectKeyModel(contractWith({
      categories: TS_DIRECTKEY.categories,
      profiles: [
        { slot: 0, fixed: true, name_key: "my_coffee" },
        { slot: -1 },                       // dropped
        { slot: 1.5 },                      // dropped
        { slot: 2, name_entity_suffix: "profile_2_name", active_entity_suffix: "profile_2_active" },
      ],
    }));
    expect(model.profiles!.map((p) => p.slot)).toEqual([0, 2]);
  });

  it("honors served entity-anchor strings and defaults them when malformed", () => {
    const custom = resolveDirectKeyModel(contractWith({
      ...TS_DIRECTKEY,
      profile_select_entity_suffix: "user_profile",
      active_profile_attribute: "current_profile",
    }));
    expect(custom.profileSelectSuffix).toBe("user_profile");
    expect(custom.activeProfileAttribute).toBe("current_profile");

    const defaulted = resolveDirectKeyModel(contractWith({
      categories: TS_DIRECTKEY.categories,
      profiles: TS_DIRECTKEY.profiles,
      profile_select_entity_suffix: 7,
    }));
    expect(defaulted.profileSelectSuffix).toBe("profile");
    expect(defaulted.activeProfileAttribute).toBe("active_profile");
  });
});

describe("resolveProfileSlots — bindings + entity absence (§9.3.6 rules 4/6)", () => {
  const entries: ProfileSlotEntry[] = [
    { slot: 0, fixed: true, name_key: "my_coffee" },
    { slot: 1, name_entity_suffix: "profile_1_name", active_entity_suffix: "profile_1_active" },
    { slot: 2, name_entity_suffix: "profile_2_name", active_entity_suffix: "profile_2_active" },
  ];

  function lookup(states: Record<string, string>) {
    return (domain: string, suffix: string) => states[`${domain}.${suffix}`];
  }

  it("slot 0 is fixed: always visible, never editable, localized via name_key", () => {
    const [slot0] = resolveProfileSlots(entries, lookup({}));
    expect(slot0).toEqual({
      slot: 0, fixed: true, nameKey: "my_coffee", name: null,
      visible: true, editable: false,
    });
  });

  it("a slot with its activity switch on and name entity present is visible and editable", () => {
    const slots = resolveProfileSlots(entries, lookup({
      "switch.profile_1_active": "on",
      "text.profile_1_name": "XXXUSER",
    }));
    expect(slots[1]).toEqual({
      slot: 1, fixed: false, nameKey: null, name: "XXXUSER",
      visible: true, editable: true,
    });
  });

  it("an activity switch that is off hides the slot", () => {
    const slots = resolveProfileSlots(entries, lookup({
      "switch.profile_1_active": "off",
      "text.profile_1_name": "XXXUSER",
    }));
    expect(slots[1].visible).toBe(false);
    expect(slots[1].editable).toBe(false);
  });

  it("an absent activity entity hides the slot (§9.3.6 rule 6)", () => {
    const slots = resolveProfileSlots(entries, lookup({
      "text.profile_1_name": "XXXUSER",
    }));
    expect(slots[1].visible).toBe(false);
    expect(slots[1].editable).toBe(false);
  });

  it("an absent name entity keeps the slot visible but read-only (§9.3.6 rule 6)", () => {
    const slots = resolveProfileSlots(entries, lookup({
      "switch.profile_2_active": "on",
    }));
    expect(slots[2]).toEqual({
      slot: 2, fixed: false, nameKey: null, name: null,
      visible: true, editable: false,
    });
  });

  it("treats unknown/unavailable name states as no name, unavailable switch as hidden", () => {
    const slots = resolveProfileSlots(entries, lookup({
      "switch.profile_1_active": "on",
      "text.profile_1_name": "unknown",
      "switch.profile_2_active": "unavailable",
      "text.profile_2_name": "Bob",
    }));
    expect(slots[1].visible).toBe(true);
    expect(slots[1].name).toBeNull();
    expect(slots[1].editable).toBe(true);
    expect(slots[2].visible).toBe(false);
  });

  it("a non-fixed slot without bindings is hidden", () => {
    const slots = resolveProfileSlots([{ slot: 3 }], lookup({}));
    expect(slots[0]).toEqual({
      slot: 3, fixed: false, nameKey: null, name: null,
      visible: false, editable: false,
    });
  });
});

describe("parseDirectKeyData — served active_profile_attribute (§9.3.6 rule 4)", () => {
  const recipe = {
    category: 1,
    c1_process: "coffee", c1_intensity: "medium", c1_aroma: "standard",
    c1_temperature: "normal", c1_shots: 1, c1_portion_ml: 40,
    c2_process: "none", c2_intensity: "medium", c2_aroma: "standard",
    c2_temperature: "normal", c2_shots: 0, c2_portion_ml: 0,
  };

  it("reads the active profile from the attribute name the contract serves", () => {
    const data = parseDirectKeyData(
      {
        current_profile: 3,
        directkey_recipes: { 3: { Espresso: recipe } },
      },
      "current_profile",
    );
    expect(data!.activeProfile).toBe(3);
    expect(data!.profiles[3].espresso).toEqual(recipe);
  });

  it("defaults to the frozen active_profile attribute (2.7.0 behaviour)", () => {
    const data = parseDirectKeyData({
      active_profile: 2,
      directkey_recipes: { 2: { "Café Crème": recipe } },
    });
    expect(data!.activeProfile).toBe(2);
    expect(data!.profiles[2].cafe_creme).toEqual(recipe);
  });
});
