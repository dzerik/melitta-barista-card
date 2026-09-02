// Brand badge model (UI Contract §3.10 brand_theme).
// Pure business logic: no Lit, no Home Assistant imports — testable in isolation.
//
// brand_theme is DATA ONLY — a slug, a wordmark display string, and accent
// colors. The integration never ships brand logos; `logo_url` is non-null only
// when the user placed their own file under HA's www dir (`/local/...`). The
// card renders the wordmark as text (never an image), uses the logo image only
// when `logo_url` is present, and falls back to the wordmark on image error.
//
// Absent brand_theme (older server) or malformed data ⇒ null ⇒ the header
// renders exactly as it did before the contract carried a theme (§3.10:
// "neutral, unbranded rendering — never an error").

import type { BrandTheme } from "./contract";

/** Resolved, render-ready badge model for the card header. */
export interface BrandBadge {
  /** Wordmark display string, trimmed; rendered as text. */
  label: string;
  /** CSS color value for the badge text. */
  fg: string;
  /** CSS color value for the badge background tint. */
  bg: string;
  /** Sanitized `/local/...` logo URL, or null (wordmark-only badge). */
  logoUrl: string | null;
}

/** Neutral badge text color when the theme's accent pair is unusable. */
export const NEUTRAL_FG = "var(--secondary-text-color, #666666)";
/** Neutral badge background when the theme's accent pair is unusable. */
export const NEUTRAL_BG = "color-mix(in srgb, currentColor 10%, transparent)";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
/** `/local/...` paths only — spec §3.10 emits exactly this shape; anything
 * else (absolute URLs, schemes, traversal) is dropped as untrusted data. */
const LOCAL_URL_RE = /^\/local\/[A-Za-z0-9_\-./]+$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** WCAG relative luminance of a "#rrggbb" color. */
function luminance(hex: string): number {
  const chan = (i: number): number => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(1) + 0.7152 * chan(3) + 0.0722 * chan(5);
}

/** WCAG contrast ratio between two "#rrggbb" colors (1..21). */
function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Build the header badge model from a contract `brand_theme` block.
 *
 * Contrast safety (§3.10 "client contrast responsibilities"): the accent pair
 * is advisory — when accent-on-accent_soft falls below ~3:1 the text color is
 * swapped for white or near-black, whichever reads better on `accent_soft`;
 * a pair that is not valid `#rrggbb` data degrades to theme-neutral colors.
 * Returns null for an absent or unusable brand_theme (legacy header).
 */
export function buildBrandBadge(theme: BrandTheme | unknown): BrandBadge | null {
  if (!isRecord(theme)) return null;

  const wordmark = theme.wordmark;
  if (typeof wordmark !== "string") return null;
  const label = wordmark.trim();
  if (label === "") return null;

  const rawLogo = theme.logo_url;
  const logoUrl =
    typeof rawLogo === "string" && LOCAL_URL_RE.test(rawLogo) && !rawLogo.includes("..")
      ? rawLogo
      : null;

  const accent = theme.accent;
  const accentSoft = theme.accent_soft;
  if (typeof accent !== "string" || !HEX_RE.test(accent)
    || typeof accentSoft !== "string" || !HEX_RE.test(accentSoft)) {
    return { label, fg: NEUTRAL_FG, bg: NEUTRAL_BG, logoUrl };
  }

  let fg = accent;
  if (contrastRatio(accent, accentSoft) < 3) {
    fg = contrastRatio("#ffffff", accentSoft) >= contrastRatio("#1a1a1a", accentSoft)
      ? "#ffffff"
      : "#1a1a1a";
  }
  return { label, fg, bg: accentSoft, logoUrl };
}
