import type { HomeAssistant } from "custom-card-helpers";

export interface DetectedDevice {
  prefix: string;
  name: string;
}

/**
 * Scan hass.states for Melitta Barista devices by looking for
 * `button.<prefix>_brew_*` entities unique to the integration.
 */
export function detectMelittaDevices(hass: HomeAssistant): DetectedDevice[] {
  const prefixSet = new Set<string>();

  for (const entityId of Object.keys(hass.states)) {
    const match = entityId.match(/^button\.(.+?)_brew_/);
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
