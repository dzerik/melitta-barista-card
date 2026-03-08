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

const DEFAULT: DrinkProfile = {
  layers: [{ color: "#5C3A1E", height: 0.45 }],
};

/**
 * Renders a glass coffee cup SVG with drink layers, foam, steam, handle, and reflection.
 * Lit `svg` tagged template — use inside an <svg> or standalone.
 */
export function coffeeIconSvg(recipe: string, size: number, uid: string) {
  const profile = DRINKS[recipe] || DEFAULT;
  const isTall = profile.tall;

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

  const lerpX = (y: number, isLeft: boolean) => {
    const t = (y - ciTop) / (ciBot - ciTop);
    return isLeft ? ciTopL + (ciBotL - ciTopL) * t : ciTopR + (ciBotR - ciTopR) * t;
  };

  let layerY = ciBot;
  const layerPaths: { d: string; fill: string }[] = [];

  const allLayers = [...profile.layers];
  for (let i = allLayers.length - 1; i >= 0; i--) {
    const { color, height: frac } = allLayers[i];
    const lh = cupH * frac;
    const y1 = layerY;
    const y0 = layerY - lh;
    layerY = y0;

    const x0L = lerpX(y0, true);
    const x0R = lerpX(y0, false);
    const x1L = lerpX(y1, true);
    const x1R = lerpX(y1, false);
    const isBottom = i === allLayers.length - 1;
    const bR = isBottom ? ciR : 0;

    const d = isBottom
      ? `M ${x0L} ${y0} L ${x1L + bR} ${y1 - bR} Q ${x1L} ${y1} ${x1L + bR} ${y1} L ${x1R - bR} ${y1} Q ${x1R} ${y1} ${x1R - bR} ${y1 - bR} L ${x0R} ${y0} Z`
      : `M ${x0L} ${y0} L ${x1L} ${y1} L ${x1R} ${y1} L ${x0R} ${y0} Z`;

    layerPaths.push({ d, fill: color });
  }

  if (profile.foam) {
    const fh = cupH * profile.foam.height;
    const y1 = layerY;
    const y0 = layerY - fh;
    layerY = y0;
    const x0L = lerpX(y0, true);
    const x0R = lerpX(y0, false);
    const x1L = lerpX(y1, true);
    const x1R = lerpX(y1, false);
    layerPaths.push({ d: `M ${x0L} ${y0} L ${x1L} ${y1} L ${x1R} ${y1} L ${x0R} ${y0} Z`, fill: profile.foam.color });
  }

  const handleX = topR;
  const hTop = cupTop + cupH * 0.18;
  const hBot = cupTop + cupH * 0.65;
  const hOut = isTall ? 10 : 14;

  const hasSteam = recipe !== "Milk" && recipe !== "Milk Froth" && recipe !== "Hot Water";

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
          <path d="${clipPath}" />
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

      <path d="${glassPath}" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-linejoin="round" />

      <g clip-path="url(#clip-${uid})">
        ${layerPaths.map((l) => svg`<path d="${l.d}" fill="${l.fill}" />`)}
      </g>

      <path d="${glassPath}" fill="url(#refl-${uid})" clip-path="url(#clip-${uid})" />
      <path d="M ${topL + 1.5} ${cupTop + 3} L ${botL + 2.5} ${cupBot - 5} L ${botL + 2.5 + (isTall ? 4 : 5)} ${cupBot - 5} L ${topL + 1.5 + (isTall ? 4 : 5)} ${cupTop + 3} Z" fill="url(#spec-${uid})" />
      <line x1="${topR - 2.5}" y1="${cupTop + 5}" x2="${botR - 3}" y2="${cupBot - 7}" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round" />
      <line x1="${topL + 3}" y1="${cupTop + 0.5}" x2="${topR - 3}" y2="${cupTop + 0.5}" stroke="rgba(255,255,255,0.20)" stroke-width="1" stroke-linecap="round" />

      <path d="M ${handleX} ${hTop} C ${handleX + hOut} ${hTop - 2}, ${handleX + hOut} ${hBot + 2}, ${handleX} ${hBot}" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="none" stroke-linecap="round" />

      <g mask="url(#rm-${uid})">
        <g transform="translate(0, ${cupBot * 2 + 2}) scale(1, -1)">
          <path d="${glassPath}" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linejoin="round" />
          <g clip-path="url(#clip-${uid})" opacity="0.5">
            ${layerPaths.map((l) => svg`<path d="${l.d}" fill="${l.fill}" />`)}
          </g>
          <path d="M ${handleX} ${hTop} C ${handleX + hOut} ${hTop - 2}, ${handleX + hOut} ${hBot + 2}, ${handleX} ${hBot}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" />
        </g>
      </g>
    </svg>
  `;
}
