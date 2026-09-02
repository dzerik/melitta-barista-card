import { describe, expect, it } from "vitest";

import { profileOptionForSlot } from "../src/profile";

describe("profileOptionForSlot", () => {
  it("resolves the latest profile label for a stable slot", () => {
    const slot = 1;

    const optionsAtRender = [
      "My Coffee",
      "Profile 1",
      "--2--",
    ];

    expect(profileOptionForSlot(optionsAtRender, slot))
      .toBe("Profile 1");

    // Profile names finish loading after render but before click.
    const optionsAtClick = [
      "My Coffee",
      "XXXUSER",
      "--2--",
    ];

    // Slot 1 remains the identity, so the current valid HA option is used.
    expect(profileOptionForSlot(optionsAtClick, slot))
      .toBe("XXXUSER");
  });

  it("rejects invalid slots", () => {
    const options = ["My Coffee", "XXXUSER"];

    expect(profileOptionForSlot(options, -1)).toBeUndefined();
    expect(profileOptionForSlot(options, 2)).toBeUndefined();
    expect(profileOptionForSlot(options, 1.5)).toBeUndefined();
  });
});
