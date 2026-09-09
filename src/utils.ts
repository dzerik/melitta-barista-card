import type { HomeAssistant } from "custom-card-helpers";

export interface DetectedDevice {
  prefix: string;
  name: string;
}

/**
 * Scan hass.states for Melitta Barista devices by looking for
 * the `button.<prefix>_brew` entity unique to the integration.
 */
export function detectMelittaDevices(hass: HomeAssistant): DetectedDevice[] {
  const prefixSet = new Set<string>();

  for (const entityId of Object.keys(hass.states)) {
    const match = entityId.match(/^button\.(.+?)_brew$/);
    if (match) {
      prefixSet.add(match[1]);
    }
  }

  const devices: DetectedDevice[] = [];
  for (const prefix of prefixSet) {
    // Verify this prefix also has a state sensor (confirms it's Melitta)
    const stateEntity = hass.states[`sensor.${prefix}_state`];
    if (!stateEntity) continue;

    // Use device friendly name from state sensor, or derive from prefix
    const friendlyName = stateEntity.attributes.friendly_name;
    const name = friendlyName
      ? friendlyName.replace(/\s*State$/, "")
      : prefix.replace(/_/g, " ");

    devices.push({ prefix, name });
  }

  return devices;
}

/** Lowest and highest UI scale the card accepts; 1 is the theme's own size. */
export const MIN_SCALE = 0.8;
export const MAX_SCALE = 2;

/**
 * Clamps a user-supplied `scale` into the supported range, defaulting to 1.
 *
 * The value reaches us straight from YAML, so anything can arrive: a string
 * ("1.25"), a percentage typo (125), null, NaN. Everything unusable falls back
 * to 1 rather than collapsing the card to an unreadable or unusable size.
 */
export function normalizeScale(raw: unknown): number {
  let value: unknown = raw;
  if (typeof value === "string") {
    const trimmed = value.trim();
    // Number("") is 0, which would clamp to the minimum instead of the default.
    value = trimmed === "" ? NaN : Number(trimmed);
  }
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}
