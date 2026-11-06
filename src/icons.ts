import { html, svg, nothing } from "lit";

interface Layer {
  color: string;
  height: number;
}

interface DrinkProfile {
  layers: Layer[];
  foam?: { color: string; height: number };
  tall?: boolean;
}

const DRINKS: Record<string, DrinkProfile> = {
  Espresso: {
    layers: [{ color: "#3E1F0D", height: 0.30 }],
    foam: { color: "#C9A87C", height: 0.04 },
  },
  Ristretto: {
    layers: [{ color: "#1A0D04", height: 0.22 }],
    foam: { color: "#B89970", height: 0.03 },
  },
  Lungo: {
    layers: [{ color: "#4A2A14", height: 0.50 }],
    foam: { color: "#C9A87C", height: 0.04 },
  },
  "Espresso Doppio": {
    layers: [{ color: "#3E1F0D", height: 0.45 }],
    foam: { color: "#C9A87C", height: 0.04 },
  },
  "Ristretto Doppio": {
    layers: [{ color: "#1A0D04", height: 0.40 }],
    foam: { color: "#B89970", height: 0.03 },
  },
  "Café Crème": {
    layers: [{ color: "#5C3A1E", height: 0.50 }],
    foam: { color: "#E8D5B7", height: 0.08 },
  },
  "Café Crème Doppio": {
    layers: [{ color: "#5C3A1E", height: 0.58 }],
    foam: { color: "#E8D5B7", height: 0.08 },
  },
  Americano: {
    layers: [{ color: "#3E1F0D", height: 0.60 }],
  },
  "Americano Extra": {
    layers: [{ color: "#2C1507", height: 0.65 }],
  },
  "Long Black": {
    layers: [{ color: "#3E1F0D", height: 0.55 }],
    foam: { color: "#C9A87C", height: 0.05 },
  },
  "Red Eye": {
    layers: [{ color: "#2C1507", height: 0.60 }],
  },
  "Black Eye": {
    layers: [{ color: "#1A0D04", height: 0.65 }],
  },
  "Dead Eye": {
    layers: [{ color: "#0F0803", height: 0.70 }],
  },
  Cappuccino: {
    layers: [
      { color: "#3E1F0D", height: 0.28 },
      { color: "#D4B896", height: 0.22 },
    ],
    foam: { color: "#F5EDE0", height: 0.18 },
  },
  "Espresso Macchiato": {
    layers: [{ color: "#3E1F0D", height: 0.30 }],
    foam: { color: "#F5EDE0", height: 0.12 },
  },
  "Caffè Latte": {
    tall: true,
    layers: [
      { color: "#E8D5B7", height: 0.35 },
      { color: "#8B5A30", height: 0.18 },
    ],
    foam: { color: "#F5EDE0", height: 0.10 },
  },
  "Café au Lait": {
    layers: [{ color: "#C9A87C", height: 0.50 }],
    foam: { color: "#F0E6D8", height: 0.06 },
  },
  "Flat White": {
    layers: [
      { color: "#3E1F0D", height: 0.20 },
      { color: "#D4B896", height: 0.30 },
    ],
    foam: { color: "#F0E6D8", height: 0.05 },
  },
  "Latte Macchiato": {
    tall: true,
    layers: [
      { color: "#F0E6D8", height: 0.28 },
      { color: "#6B4226", height: 0.12 },
      { color: "#E8D5B7", height: 0.12 },
    ],
    foam: { color: "#FEFCFA", height: 0.15 },
  },
  "Latte Macchiato Extra": {
    tall: true,
    layers: [
      { color: "#F0E6D8", height: 0.25 },
      { color: "#5C3A1E", height: 0.16 },
      { color: "#E8D5B7", height: 0.12 },
    ],
    foam: { color: "#FEFCFA", height: 0.14 },
  },
  "Latte Macchiato Triple": {
    tall: true,
    layers: [
      { color: "#F0E6D8", height: 0.22 },
      { color: "#4A2A14", height: 0.20 },
      { color: "#E8D5B7", height: 0.10 },
    ],
    foam: { color: "#FEFCFA", height: 0.14 },
  },
  Milk: {
    tall: true,
    layers: [{ color: "#F0E6D8", height: 0.55 }],
  },
  "Milk Froth": {
    tall: true,
    layers: [{ color: "#F0E6D8", height: 0.15 }],
    foam: { color: "#FEFCFA", height: 0.40 },
  },
  "Hot Water": {
    layers: [{ color: "#9DC4D8", height: 0.50 }],
  },
};

// Aliases for names without accents (from integration entity attributes)
DRINKS["Cafe Creme"] = DRINKS["Café Crème"];
DRINKS["Cafe Creme Doppio"] = DRINKS["Café Crème Doppio"];
DRINKS["Caffe Latte"] = DRINKS["Caffè Latte"];
DRINKS["Cafe au Lait"] = DRINKS["Café au Lait"];

const DEFAULT: DrinkProfile = {
  layers: [{ color: "#5C3A1E", height: 0.45 }],
};

// ---------------------------------------------------------------------------
// UI Contract v1 — IconSpec input types (§3.6).
//
// Structural mirrors of the canonical types in src/contract.ts (Zone C-A);
// duplicated here so the icon renderer stays file-disjoint from the contract
// client. TypeScript structural typing makes the two interchangeable.
// ---------------------------------------------------------------------------

/** One stacked liquid layer of a contract IconSpec (§3.6). */
export interface IconSpecLayer {
  role: string;
  ml: number;
  fraction: number;
  intensity: number;
  crema?: true;
  color_hint?: string | null;
  label?: string;
}

/** Foam cap of a contract IconSpec (§3.6); always rendered topmost. */
export interface IconSpecFoam {
  role: string;
  ml: number;
  fraction: number;
}

/** Procedural drink description from the UI contract (§3.6). */
export interface IconSpec {
  spec_version: number;
  glass: string;
  total_ml: number;
  fill_level: number;
  layers: IconSpecLayer[];
  foam: IconSpecFoam | null;
  steam: boolean;
}

/** Icon-spec versions this renderer understands; anything else → DEFAULT icon. */
const SUPPORTED_ICON_SPEC_VERSIONS: readonly number[] = [1];

/** Nominal glass volumes in ml, normative for spec_version 1 (§3.6). */
const NOMINAL_GLASS_ML: Record<string, number> = {
  espresso_cup: 60,
  cup: 220,
  tall_glass: 320,
};

// ---------------------------------------------------------------------------
// Shared cup geometry primitives (pure — no Lit, no DOM).
// ---------------------------------------------------------------------------

/** Static cup/glass outline metrics shared by legacy and spec rendering. */
export interface CupFrame {
  isTall: boolean;
  vbW: number;
  vbH: number;
  cupH: number;
  cupTop: number;
  cupBot: number;
  cx: number;
  topL: number;
  topR: number;
  botL: number;
  botR: number;
  /** Inner (clip) region bounds — liquid lives between ciTop and ciBot. */
  ciTopL: number;
  ciTopR: number;
  ciBotL: number;
  ciBotR: number;
  ciTop: number;
  ciBot: number;
  ciR: number;
  glassPath: string;
  clipPath: string;
}

/** Computes the glass outline + inner clip metrics for the cup or tall shape. */
export function computeCupFrame(isTall: boolean): CupFrame {
  const vbW = 100;
  const vbH = 115;

  const cupTopW = isTall ? 36 : 50;
  const cupBotW = isTall ? 30 : 42;
  const cupH = isTall ? 68 : 48;
  const cupTop = isTall ? 12 : 28;
  const cupBot = cupTop + cupH;
  const cx = isTall ? 50 : 46;

  const topL = cx - cupTopW / 2;
  const topR = cx + cupTopW / 2;
  const botL = cx - cupBotW / 2;
  const botR = cx + cupBotW / 2;

  const r = 4;
  const glassPath = `M ${topL} ${cupTop} L ${botL + r} ${cupBot - r} Q ${botL} ${cupBot} ${botL + r} ${cupBot} L ${botR - r} ${cupBot} Q ${botR} ${cupBot} ${botR - r} ${cupBot - r} L ${topR} ${cupTop}`;

  const inset = 1.5;
  const ciTopL = topL + inset;
  const ciTopR = topR - inset;
  const ciBotL = botL + inset + r * 0.3;
  const ciBotR = botR - inset - r * 0.3;
  const ciTop = cupTop + inset;
  const ciBot = cupBot - inset;
  const ciR = r * 0.7;

  const clipPath = `M ${ciTopL} ${ciTop} L ${ciBotL + ciR} ${ciBot - ciR} Q ${ciBotL} ${ciBot} ${ciBotL + ciR} ${ciBot} L ${ciBotR - ciR} ${ciBot} Q ${ciBotR} ${ciBot} ${ciBotR - ciR} ${ciBot - ciR} L ${ciTopR} ${ciTop} Z`;

  return {
    isTall, vbW, vbH, cupH, cupTop, cupBot, cx,
    topL, topR, botL, botR,
    ciTopL, ciTopR, ciBotL, ciBotR, ciTop, ciBot, ciR,
    glassPath, clipPath,
  };
}

/** X of the slanted inner glass wall at height y (left or right side). */
function lerpX(f: CupFrame, y: number, isLeft: boolean): number {
  const t = (y - f.ciTop) / (f.ciBot - f.ciTop);
  return isLeft ? f.ciTopL + (f.ciBotL - f.ciTopL) * t : f.ciTopR + (f.ciBotR - f.ciTopR) * t;
}

interface StackEntry {
  /** Layer height as a fraction of cupH. */
  frac: number;
  fill: string;
  role: string;
  intensity: number;
}

/** One rendered liquid band: path data plus its semantic descriptor. */
export interface LayerGeom {
  d: string;
  fill: string;
  role: string;
  intensity: number;
  yTop: number;
  yBottom: number;
  height: number;
}

/**
 * Stacks liquid bands bottom-up from the inner-glass floor.
 *
 * Entries are ordered bottom→top; only the first (bottom) band gets the
 * rounded floor corners — identical math to the original inline loop, so
 * legacy rendering is byte-for-byte unchanged.
 */
function computeStackPaths(f: CupFrame, stack: StackEntry[]): LayerGeom[] {
  let layerY = f.ciBot;
  const out: LayerGeom[] = [];
  for (let i = 0; i < stack.length; i++) {
    const { frac, fill, role, intensity } = stack[i];
    const lh = f.cupH * frac;
    const y1 = layerY;
    const y0 = layerY - lh;
    layerY = y0;

    const x0L = lerpX(f, y0, true);
    const x0R = lerpX(f, y0, false);
    const x1L = lerpX(f, y1, true);
    const x1R = lerpX(f, y1, false);
    const isBottom = i === 0;
    const bR = isBottom ? f.ciR : 0;

    const d = isBottom
      ? `M ${x0L} ${y0} L ${x1L + bR} ${y1 - bR} Q ${x1L} ${y1} ${x1L + bR} ${y1} L ${x1R - bR} ${y1} Q ${x1R} ${y1} ${x1R - bR} ${y1 - bR} L ${x0R} ${y0} Z`
      : `M ${x0L} ${y0} L ${x1L} ${y1} L ${x1R} ${y1} L ${x0R} ${y0} Z`;

    out.push({ d, fill, role, intensity, yTop: y0, yBottom: y1, height: lh });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Spec → geometry (pure — no Lit, no DOM).
// ---------------------------------------------------------------------------

const COFFEE_LIGHT: [number, number, number] = [0x9a, 0x6b, 0x3a];
const COFFEE_DARK: [number, number, number] = [0x0f, 0x08, 0x03];
const GREY_LIGHT: [number, number, number] = [0xe0, 0xe0, 0xe0];
const GREY_DARK: [number, number, number] = [0x40, 0x40, 0x40];
const MILK_COLOR = "#F0E6D8";
const WATER_COLOR = "#9DC4D8";
const FOAM_COLOR = "#FEFCFA";
const CREMA_COLOR = "#C9A87C";
const COLOR_HINT_RE = /^#[0-9a-fA-F]{6}$/;

function clamp01(n: number): number {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  const ch = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(ch(0))}${hex(ch(1))}${hex(ch(2))}`;
}

/** Resolves a layer's fill color from its role/intensity (client-owned style). */
function layerFill(layer: IconSpecLayer): string {
  const intensity = clamp01(layer.intensity);
  switch (layer.role) {
    case "coffee":
      return lerpColor(COFFEE_LIGHT, COFFEE_DARK, intensity);
    case "milk":
      return MILK_COLOR;
    case "water":
      return WATER_COLOR;
    case "additive": {
      // color_hint is data, never markup: only a strict #RRGGBB survives.
      const hint = layer.color_hint;
      if (typeof hint === "string" && COLOR_HINT_RE.test(hint)) return hint;
      return lerpColor(GREY_LIGHT, GREY_DARK, intensity);
    }
    default:
      // Unknown role → neutral grey of the given intensity (§5.3.2).
      return lerpColor(GREY_LIGHT, GREY_DARK, intensity);
  }
}

/** Full drink-icon geometry: frame, stacked liquid bands, steam flag, pixel size. */
export interface IconGeometry {
  frame: CupFrame;
  /** Bottom→top; includes the foam cap (role "milk_foam") and crema stripes. */
  layers: LayerGeom[];
  steam: boolean;
  width: number;
  height: number;
}

function isValidSpec(spec: IconSpec | null | undefined): spec is IconSpec {
  if (typeof spec !== "object" || spec === null) return false;
  if (!SUPPORTED_ICON_SPEC_VERSIONS.includes(spec.spec_version)) return false;
  if (!Array.isArray(spec.layers) || spec.layers.length === 0) return false;
  for (const l of spec.layers) {
    if (typeof l !== "object" || l === null) return false;
  }
  if (spec.foam !== null && spec.foam !== undefined && typeof spec.foam !== "object") return false;
  return true;
}

/**
 * Pure geometry for a contract IconSpec (§3.6): no Lit, no DOM — data only.
 *
 * Maps `glass` to the cup/tall shapes (unknown → cup), fills the glass
 * interior to `fill_level`, stacks layers (then foam) bottom-up by `fraction`
 * (remainder normalized into the last layer per §3.6), resolves coffee
 * darkness from `intensity`, carves a crema stripe from a `crema: true`
 * layer, and treats `color_hint` as escaped fill data only.
 *
 * Returns null for a null/structurally-invalid spec or an unsupported
 * `spec_version` — the caller falls back to the legacy DEFAULT drink.
 */
export function computeIconGeometry(
  spec: IconSpec | null | undefined,
  size: number,
): IconGeometry | null {
  if (!isValidSpec(spec)) return null;

  const isTall = spec.glass === "tall_glass";
  const frame = computeCupFrame(isTall);

  // fill_level: server-computed; if absent, derive from total_ml and the
  // nominal volume (unknown glass uses the cup nominal — §3.6).
  let fill: number;
  if (typeof spec.fill_level === "number" && Number.isFinite(spec.fill_level)) {
    fill = spec.fill_level;
  } else if (typeof spec.total_ml === "number" && Number.isFinite(spec.total_ml) && spec.total_ml > 0) {
    fill = spec.total_ml / (NOMINAL_GLASS_ML[spec.glass] ?? NOMINAL_GLASS_ML.cup);
  } else {
    return null;
  }
  fill = Math.min(1, Math.max(0.01, fill));

  // Fractions: clamp negatives/non-numbers to 0, then normalize the remainder
  // into the last layer (client-side rule, §3.6). Foam keeps its own fraction.
  const fracs = spec.layers.map((l) =>
    typeof l.fraction === "number" && Number.isFinite(l.fraction) ? Math.max(0, l.fraction) : 0,
  );
  const foam = spec.foam ?? null;
  const foamFrac =
    foam && typeof foam.fraction === "number" && Number.isFinite(foam.fraction)
      ? Math.max(0, foam.fraction)
      : 0;
  const sum = fracs.reduce((s, x) => s + x, 0) + foamFrac;
  const last = fracs.length - 1;
  fracs[last] = Math.max(0, fracs[last] + (1 - sum));
  // Safety: if the spec badly over-fills (sum still > 1), scale everything.
  let scale = 1;
  const sum2 = fracs.reduce((s, x) => s + x, 0) + foamFrac;
  if (sum2 > 1) scale = 1 / sum2;

  const stack: StackEntry[] = [];
  const topIdx = spec.layers.length - 1;
  for (let i = 0; i < spec.layers.length; i++) {
    const layer = spec.layers[i];
    const role = typeof layer.role === "string" ? layer.role : "unknown";
    const intensity = clamp01(layer.intensity);
    const fill_ = layerFill({ ...layer, role, intensity });
    let frac = fill * fracs[i] * scale;
    if (frac <= 0) continue;

    // Crema stripe: carved from the top of the flagged coffee layer (the
    // server only sets crema on the topmost-overall coffee layer, §4.3).
    const wantsCrema = layer.crema === true && role === "coffee" && i === topIdx && foamFrac <= 0;
    let cremaFrac = 0;
    if (wantsCrema) {
      cremaFrac = Math.min(0.25 * frac, 0.05);
      frac -= cremaFrac;
    }
    stack.push({ frac, fill: fill_, role, intensity });
    if (cremaFrac > 0) {
      stack.push({ frac: cremaFrac, fill: CREMA_COLOR, role: "crema", intensity });
    }
  }
  if (foamFrac > 0) {
    stack.push({
      frac: fill * foamFrac * scale,
      fill: FOAM_COLOR,
      role: "milk_foam",
      intensity: 0,
    });
  }

  return {
    frame,
    layers: computeStackPaths(frame, stack),
    steam: spec.steam === true,
    width: size,
    height: size * (frame.vbH / frame.vbW),
  };
}

// ---------------------------------------------------------------------------
// Lit template rendering (shared by legacy and spec paths).
// ---------------------------------------------------------------------------

/** A soft steam curl with stable timing and phase for one visible cup. */
interface SteamStream {
  path: string;
  duration: number;
  delay: number;
  drift: number;
  peak: number;
  width: number;
}

/** Derive a repeatable, independently phased steam field for one visible cup. */
function steamStreams(frame: CupFrame, uid: string): SteamStream[] {
  let seed = 2166136261;
  for (const char of uid) seed = Math.imul(seed ^ char.codePointAt(0)!, 16777619) >>> 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const count = 2 + Math.floor(random() * 2);
  return Array.from({ length: count }, () => {
    const x = frame.cx + (random() - .5) * 16;
    const rise = Math.max(5, frame.cupTop - 7) * (.5 + random() * .43);
    const curl = (random() - .5) * 13;
    const duration = 3.2 + random() * 3.1;
    const delay = -random() * duration;
    const drift = (random() - .5) * 9;
    const peak = .25 + random() * .28;
    const y = frame.cupTop - 1;
    return {
      path: `M${x} ${y}C${x + curl} ${y - rise * .3},${x - curl} ${y - rise * .58},${x + curl * .7} ${y - rise}`,
      duration, delay, drift, peak, width: 1.3 + random() * 1.5,
    };
  });
}

/** Apply material lighting to a validated fill without changing its role. */
function shadeFill(color: string, amount: number): string {
  if (!COLOR_HINT_RE.test(color)) return color;
  const rgb: [number, number, number] = [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
  ];
  return lerpColor(rgb, amount < 0 ? [0, 0, 0] : [255, 255, 255], Math.abs(amount));
}

/** Renders the full glass SVG (steam, outline, liquid bands, shine, reflection). */
function renderGlassSvg(
  f: CupFrame,
  layerPaths: LayerGeom[],
  hasSteam: boolean,
  size: number,
  uid: string,
) {
  // Code-point encoding is injective, SVG-safe and stable across Lit updates.
  const key = `mbc-cup-${Array.from(uid, char => char.codePointAt(0)!.toString(16)).join("-") || "empty"}`;
  const { vbW, vbH, cupTop, cupBot, cupH, cx, topL, topR, botL, botR, isTall } = f;
  const outer = isTall
    ? `M${topL} ${cupTop}L${botL} ${cupBot - 6}Q${botL} ${cupBot + 1},${botL + 6} ${cupBot + 1}L${botR - 6} ${cupBot + 1}Q${botR} ${cupBot + 1},${botR} ${cupBot - 6}L${topR} ${cupTop}Z`
    : `M${topL} ${cupTop}C${topL + 1} ${cupBot - 19},${botL} ${cupBot},${botL + 10} ${cupBot}L${botR - 10} ${cupBot}C${botR} ${cupBot},${topR - 1} ${cupBot - 19},${topR} ${cupTop}Z`;
  const inner = isTall
    ? `M${topL + 1.1} ${cupTop + 1}L${botL + 1.6} ${cupBot - 6}Q${botL + 1.6} ${cupBot - 1.5},${botL + 6} ${cupBot - 1.5}L${botR - 6} ${cupBot - 1.5}Q${botR - 1.6} ${cupBot - 1.5},${botR - 1.6} ${cupBot - 6}L${topR - 1.1} ${cupTop + 1}Z`
    : `M${topL + 1.3} ${cupTop + 1}C${topL + 2.4} ${cupBot - 19},${botL + 1.7} ${cupBot - 1.5},${botL + 10} ${cupBot - 1.5}L${botR - 10} ${cupBot - 1.5}C${botR - 1.7} ${cupBot - 1.5},${topR - 2.4} ${cupBot - 19},${topR - 1.3} ${cupTop + 1}Z`;
  // Only filled masks close at the rim: closing the stroke draws a false chord.
  const sideOutline = outer.slice(0, -1);
  const handleTop = cupTop + cupH * .21;
  const handleBottom = cupTop + cupH * .68;
  const handle = `M${topR - .5} ${handleTop}C${topR + 19} ${handleTop - 7},${topR + 22} ${handleBottom + 7},${topR - 4} ${handleBottom}`;
  const top = layerPaths[layerPaths.length - 1];
  const streams = hasSteam ? steamStreams(f, uid) : [];

  return html`
    <svg width="${size}" height="${size * (vbH / vbW)}" viewBox="0 0 ${vbW} ${vbH}"
      fill="none" aria-hidden="true"
      style="width: calc(var(--mbc-scale, 1) * ${size}px); height: auto; color: var(--mbc-text, currentColor);">
      ${hasSteam ? svg`<style>
        .mbc-coffee-vapour {
          transform-box: fill-box;
          transform-origin: center bottom;
          opacity: .2;
          animation: mbc-coffee-rise var(--mbc-vapour-duration) var(--mbc-vapour-delay) linear infinite;
        }
        @keyframes mbc-coffee-rise {
          0% { opacity: 0; transform: translate(0,3px) scale(.8,.8); }
          24% { opacity: var(--mbc-vapour-peak); }
          62% { opacity: calc(var(--mbc-vapour-peak) * .65); }
          100% { opacity: 0; transform: translate(var(--mbc-vapour-drift),-5px) scale(1.35,1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mbc-coffee-vapour { animation: none; }
        }
      </style>` : nothing}
      <defs>
        <clipPath id="${key}-clip"><path d="${inner}" /></clipPath>
        <linearGradient id="${key}-light">
          <stop offset="0" stop-color="white" stop-opacity=".6" />
          <stop offset=".08" stop-color="white" stop-opacity=".1" />
          <stop offset=".45" stop-color="white" stop-opacity="0" />
          <stop offset=".9" stop-color="white" stop-opacity=".025" />
          <stop offset="1" stop-color="white" stop-opacity=".42" />
        </linearGradient>
        <linearGradient id="${key}-spec">
          <stop stop-color="white" stop-opacity=".8" />
          <stop offset=".42" stop-color="white" stop-opacity=".3" />
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="${key}-handle">
          <stop stop-color="white" stop-opacity=".65" />
          <stop offset=".25" stop-color="white" stop-opacity=".1" />
          <stop offset=".62" stop-color="white" stop-opacity=".3" />
          <stop offset="1" stop-color="white" stop-opacity=".1" />
        </linearGradient>
        <radialGradient id="${key}-shadow">
          <stop stop-color="var(--mbc-glass-shadow, #000)" stop-opacity=".7" />
          <stop offset="1" stop-color="var(--mbc-glass-shadow, #000)" stop-opacity="0" />
        </radialGradient>
        <filter id="${key}-soft"><feGaussianBlur stdDeviation=".5" /></filter>
        ${hasSteam ? svg`<filter id="${key}-vapour" x="-100%" y="-70%" width="300%" height="230%">
          <feGaussianBlur stdDeviation=".8" />
        </filter>` : nothing}
        ${layerPaths.map((layer, i) => svg`
          <linearGradient id="${key}-liquid-${i}">
            <stop stop-color="${shadeFill(layer.fill, -.23)}" />
            <stop offset=".18" stop-color="${shadeFill(layer.fill, .06)}" />
            <stop offset=".48" stop-color="${layer.fill}" />
            <stop offset=".76" stop-color="${shadeFill(layer.fill, -.04)}" />
            <stop offset="1" stop-color="${shadeFill(layer.fill, -.21)}" />
          </linearGradient>
        `)}
      </defs>
      <ellipse cx="${cx + 1}" cy="${cupBot + 3}" rx="${isTall ? 21 : 29}" ry="3.7" fill="url(#${key}-shadow)" />
      ${isTall ? nothing : svg`
        <path d="${handle}" stroke="var(--mbc-glass-edge, currentColor)" stroke-width="4" stroke-opacity=".28" />
        <path d="${handle}" stroke="url(#${key}-handle)" stroke-width="2.2" opacity=".65" />
      `}
      <path d="${outer}" fill="url(#${key}-light)" opacity=".18" />
      <g clip-path="url(#${key}-clip)">
        ${layerPaths.map((layer, i) => svg`
          <path class="mbc-coffee-layer" data-role="${layer.role}"
            d="M${topL - 1} ${layer.yTop}H${topR + 1}V${layer.yBottom}H${topL - 1}Z"
            fill="url(#${key}-liquid-${i})" />
        `)}
        ${top ? svg`<ellipse cx="${cx}" cy="${top.yTop + Math.min(2.2, top.height / 3)}"
          rx="${(topR - topL) / 2 - 1}" ry="${Math.min(2.2, top.height / 3)}" fill="${shadeFill(top.fill, .04)}" />` : nothing}
        <path d="${outer}" fill="url(#${key}-light)" opacity=".4" />
        <path d="M${topL + 3} ${cupTop + 4}C${topL + 4} ${cupBot - 22},${botL + 4} ${cupBot - 5},${botL + 9} ${cupBot - 4}L${botL + 13} ${cupBot - 4}C${botL + 6} ${cupBot - 16},${topL + 10} ${cupTop + 5},${topL + 9} ${cupTop + 4}Z"
          fill="url(#${key}-spec)" opacity=".4" filter="url(#${key}-soft)" />
      </g>
      <path class="mbc-coffee-outline" d="${sideOutline}"
        stroke="var(--mbc-glass-edge, currentColor)" stroke-width=".4" stroke-opacity=".35" />
      <ellipse cx="${cx}" cy="${cupTop}" rx="${(topR - topL) / 2}" ry="3.2"
        stroke="var(--mbc-glass-rim, currentColor)" stroke-width="1" stroke-opacity=".55" />
      ${hasSteam ? svg`
        <g filter="url(#${key}-vapour)" stroke="currentColor" stroke-linecap="round" style="color: var(--mbc-text, #fff)">
          ${streams.map(stream => svg`
            <g class="mbc-coffee-vapour"
              style="--mbc-vapour-duration:${stream.duration}s;--mbc-vapour-delay:${stream.delay}s;--mbc-vapour-drift:${stream.drift}px;--mbc-vapour-peak:${stream.peak}">
              <path d="${stream.path}" stroke-width="${stream.width}" />
            </g>
          `)}
        </g>
      ` : nothing}
    </svg>
  `;
}

/**
 * Renders a glass coffee cup SVG with drink layers, foam, steam, handle, and reflection.
 * Lit `svg` tagged template — use inside an <svg> or standalone.
 *
 * Legacy name-keyed path: looks the recipe up in the hardcoded DRINKS table
 * (DEFAULT profile for unknown names). Kept as the permanent fallback for
 * integrations older than UI Contract v1 (§5.3.5).
 */
export function coffeeIconSvg(recipe: string, size: number, uid: string) {
  const profile = DRINKS[recipe] || DEFAULT;
  const frame = computeCupFrame(!!profile.tall);

  // DRINKS arrays are ordered top→bottom; the stack wants bottom→top.
  const stack: StackEntry[] = [...profile.layers]
    .reverse()
    .map((l) => ({ frac: l.height, fill: l.color, role: "legacy", intensity: 0 }));
  if (profile.foam) {
    stack.push({ frac: profile.foam.height, fill: profile.foam.color, role: "legacy_foam", intensity: 0 });
  }
  const layerPaths = computeStackPaths(frame, stack);

  const hasSteam = recipe !== "Milk" && recipe !== "Milk Froth" && recipe !== "Hot Water";
  return renderGlassSvg(frame, layerPaths, hasSteam, size, uid);
}

/**
 * Renders the drink icon from a UI Contract v1 IconSpec (§3.6/§7.2 Zone C-C).
 *
 * Thin Lit wrapper over `computeIconGeometry`; a null/invalid spec or an
 * unknown `spec_version` falls back to the legacy DEFAULT drink rendering.
 */
export function coffeeIconSvgFromSpec(
  spec: IconSpec | null | undefined,
  size: number,
  uid: string,
) {
  const geom = computeIconGeometry(spec, size);
  if (geom === null) {
    // Existing DEFAULT path: an unknown name resolves to the DEFAULT profile.
    return coffeeIconSvg("", size, uid);
  }
  return renderGlassSvg(geom.frame, geom.layers, geom.steam, size, uid);
}
