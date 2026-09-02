import { describe, it, expect } from "vitest";
import { buildBrandBadge, NEUTRAL_FG, NEUTRAL_BG } from "../src/brand-badge";

// ---------------------------------------------------------------------------
// Fixtures: UI Contract spec §3.7 / §3.8 brand_theme blocks, VERBATIM (§3.10).
// ---------------------------------------------------------------------------

/** Spec §3.7 — Melitta default case (no user-supplied logo file). */
const MELITTA_THEME = {
  "brand": "melitta",
  "wordmark": "MELITTA",
  "accent": "#c8102e",
  "accent_soft": "#f6e3e6",
  "logo_url": null,
};

/** Spec §3.8 — Nivona, illustrative user-supplied-logo case. */
const NIVONA_THEME = {
  "brand": "nivona",
  "wordmark": "NIVONA",
  "accent": "#00646b",
  "accent_soft": "#e0eeef",
  "logo_url": "/local/melitta_barista/nivona.png",
};

describe("buildBrandBadge", () => {
  it("builds the badge model from the §3.7 Melitta brand_theme (logo_url null)", () => {
    expect(buildBrandBadge(MELITTA_THEME)).toEqual({
      label: "MELITTA",
      fg: "#c8102e",
      bg: "#f6e3e6",
      logoUrl: null,
    });
  });

  it("builds the badge model from the §3.8 Nivona brand_theme (user-supplied logo)", () => {
    expect(buildBrandBadge(NIVONA_THEME)).toEqual({
      label: "NIVONA",
      fg: "#00646b",
      bg: "#e0eeef",
      logoUrl: "/local/melitta_barista/nivona.png",
    });
  });

  it("returns null when brand_theme is absent (older server ⇒ legacy header, §3.10)", () => {
    expect(buildBrandBadge(undefined)).toBeNull();
    expect(buildBrandBadge(null)).toBeNull();
  });

  it("returns null on a malformed brand_theme (non-object / missing wordmark)", () => {
    expect(buildBrandBadge("melitta")).toBeNull();
    expect(buildBrandBadge(42)).toBeNull();
    expect(buildBrandBadge([])).toBeNull();
    expect(buildBrandBadge({})).toBeNull();
    expect(buildBrandBadge({ ...MELITTA_THEME, wordmark: undefined })).toBeNull();
    expect(buildBrandBadge({ ...MELITTA_THEME, wordmark: "" })).toBeNull();
    expect(buildBrandBadge({ ...MELITTA_THEME, wordmark: "   " })).toBeNull();
    expect(buildBrandBadge({ ...MELITTA_THEME, wordmark: 7 })).toBeNull();
  });

  it("falls back to neutral colors when accent/accent_soft are not #rrggbb data", () => {
    for (const bad of ["red", "#fff", "#c8102e; color: red", "url(x)", 7, null, undefined]) {
      const badge = buildBrandBadge({ ...MELITTA_THEME, accent: bad });
      expect(badge).toEqual({ label: "MELITTA", fg: NEUTRAL_FG, bg: NEUTRAL_BG, logoUrl: null });
      const badge2 = buildBrandBadge({ ...MELITTA_THEME, accent_soft: bad });
      expect(badge2).toEqual({ label: "MELITTA", fg: NEUTRAL_FG, bg: NEUTRAL_BG, logoUrl: null });
    }
  });

  it("keeps text legible: low fg/bg contrast swaps fg for white or near-black (§3.10)", () => {
    // accent == accent_soft (dark red): white wins over near-black.
    const onDark = buildBrandBadge({ ...MELITTA_THEME, accent_soft: "#c8102e" });
    expect(onDark).not.toBeNull();
    expect(onDark!.bg).toBe("#c8102e");
    expect(onDark!.fg).toBe("#ffffff");

    // Two near-white colors: near-black wins.
    const onLight = buildBrandBadge({ ...MELITTA_THEME, accent: "#f0f0f0", accent_soft: "#ffffff" });
    expect(onLight).not.toBeNull();
    expect(onLight!.bg).toBe("#ffffff");
    expect(onLight!.fg).toBe("#1a1a1a");
  });

  it("keeps the normative brand pairs untouched (they pass the contrast check)", () => {
    expect(buildBrandBadge(MELITTA_THEME)!.fg).toBe("#c8102e");
    expect(buildBrandBadge(NIVONA_THEME)!.fg).toBe("#00646b");
  });

  it("accepts only /local/... logo URLs; anything else becomes null (data, never markup)", () => {
    for (const bad of [
      "javascript:alert(1)",
      "https://evil.example/logo.png",
      "local/melitta_barista/x.png",
      "/local/../secret.png ",
      "",
      7,
      {},
    ]) {
      const badge = buildBrandBadge({ ...NIVONA_THEME, logo_url: bad });
      expect(badge).not.toBeNull();
      expect(badge!.logoUrl).toBeNull();
    }
    // The exact spec form survives.
    expect(buildBrandBadge(NIVONA_THEME)!.logoUrl).toBe("/local/melitta_barista/nivona.png");
  });

  it("trims the wordmark for display", () => {
    expect(buildBrandBadge({ ...MELITTA_THEME, wordmark: "  MELITTA  " })!.label).toBe("MELITTA");
  });
});
