import { svg, nothing } from "lit";

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

/** Renders the full glass SVG (steam, outline, liquid bands, shine, reflection). */
function renderGlassSvg(
  f: CupFrame,
  layerPaths: { d: string; fill: string }[],
  hasSteam: boolean,
  size: number,
  uid: string,
) {
  const { vbW, vbH, cupTop, cupBot, cupH, cx, topL, topR, botL, botR, isTall } = f;

  const handleX = topR;
  const hTop = cupTop + cupH * 0.18;
  const hBot = cupTop + cupH * 0.65;
  const hOut = isTall ? 10 : 14;

  const sp1 = `M ${cx - 6} ${cupTop - 2} Q ${cx - 8} ${cupTop - 10} ${cx - 5} ${cupTop - 16}`;
  const sa1 = `${sp1};M ${cx - 6} ${cupTop - 2} Q ${cx - 4} ${cupTop - 10} ${cx - 7} ${cupTop - 16};${sp1}`;
  const sp2 = `M ${cx + 1} ${cupTop - 3} Q ${cx + 3} ${cupTop - 11} ${cx} ${cupTop - 18}`;
  const sa2 = `${sp2};M ${cx + 1} ${cupTop - 3} Q ${cx - 1} ${cupTop - 11} ${cx + 2} ${cupTop - 18};${sp2}`;
  const sp3 = `M ${cx + 8} ${cupTop - 2} Q ${cx + 6} ${cupTop - 9} ${cx + 9} ${cupTop - 15}`;
  const sa3 = `${sp3};M ${cx + 8} ${cupTop - 2} Q ${cx + 10} ${cupTop - 9} ${cx + 7} ${cupTop - 15};${sp3}`;

  return svg`
    <svg width="${size}" height="${size * (vbH / vbW)}" viewBox="0 0 ${vbW} ${vbH}" fill="none">
      <defs>
        <clipPath id="clip-${uid}">
          <path d="${f.clipPath}" />
        </clipPath>
        <linearGradient id="refl-${uid}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="0.18" />
          <stop offset="15%" stop-color="white" stop-opacity="0.06" />
          <stop offset="50%" stop-color="white" stop-opacity="0" />
          <stop offset="80%" stop-color="white" stop-opacity="0.03" />
          <stop offset="100%" stop-color="white" stop-opacity="0.10" />
        </linearGradient>
        <linearGradient id="spec-${uid}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="0.35" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <filter id="sg-${uid}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <linearGradient id="rf-${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0.15" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <mask id="rm-${uid}">
          <rect x="0" y="${cupBot + 1}" width="${vbW}" height="${cupH * 0.4}" fill="url(#rf-${uid})" />
        </mask>
      </defs>

      ${hasSteam ? svg`
        <g opacity="0.20" stroke="rgba(255,255,255,0.6)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#sg-${uid})">
          <path d="${sp1}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${sa1}" /></path>
          <path d="${sp2}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${sa2}" /></path>
          <path d="${sp3}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${sa3}" /></path>
        </g>
        <g opacity="0.40" stroke="#D4C4A0" stroke-width="1" fill="none" stroke-linecap="round">
          <path d="${sp1}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${sa1}" /></path>
          <path d="${sp2}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${sa2}" /></path>
          <path d="${sp3}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${sa3}" /></path>
        </g>
      ` : nothing}

      <path d="${f.glassPath}" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-linejoin="round" />

      <g clip-path="url(#clip-${uid})">
        ${layerPaths.map((l) => svg`<path d="${l.d}" fill="${l.fill}" />`)}
      </g>

      <path d="${f.glassPath}" fill="url(#refl-${uid})" clip-path="url(#clip-${uid})" />
      <path d="M ${topL + 1.5} ${cupTop + 3} L ${botL + 2.5} ${cupBot - 5} L ${botL + 2.5 + (isTall ? 4 : 5)} ${cupBot - 5} L ${topL + 1.5 + (isTall ? 4 : 5)} ${cupTop + 3} Z" fill="url(#spec-${uid})" />
      <line x1="${topR - 2.5}" y1="${cupTop + 5}" x2="${botR - 3}" y2="${cupBot - 7}" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round" />
      <line x1="${topL + 3}" y1="${cupTop + 0.5}" x2="${topR - 3}" y2="${cupTop + 0.5}" stroke="rgba(255,255,255,0.20)" stroke-width="1" stroke-linecap="round" />

      <path d="M ${handleX} ${hTop} C ${handleX + hOut} ${hTop - 2}, ${handleX + hOut} ${hBot + 2}, ${handleX} ${hBot}" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="none" stroke-linecap="round" />

      <g mask="url(#rm-${uid})">
        <g transform="translate(0, ${cupBot * 2 + 2}) scale(1, -1)">
          <path d="${f.glassPath}" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linejoin="round" />
          <g clip-path="url(#clip-${uid})" opacity="0.5">
            ${layerPaths.map((l) => svg`<path d="${l.d}" fill="${l.fill}" />`)}
          </g>
          <path d="M ${handleX} ${hTop} C ${handleX + hOut} ${hTop - 2}, ${handleX + hOut} ${hBot + 2}, ${handleX} ${hBot}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" />
        </g>
      </g>
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
