// Settings-catalog client logic (spec §9.1, 0.93 amendment) — Zone C-J.
//
// PURE module: no Lit, no Home Assistant imports — vitest-testable in
// isolation. The only imports are the pure contract reader, the pure
// server-string registry half of server-i18n (§6.3.5.6a), the pure card
// bundle lookup, and the legacy settings key tables.
//
// resolveSettings implements the §5.3.6 three-tier fallback for the settings
// feature: `contract.settings` (tier 1, with the §9.1.6 rule-2 entity-absence
// gate INSIDE it) → the legacy `SWITCH_KEYS`/`NUMBER_KEYS` tables + entity
// existence (tier 2, exactly the 2.7.0 behaviour) → hidden section (tier 3).
// The hardcoded tables are permanent fallback fixtures, never deleted while
// pre-0.93 integrations are supported (§5.3.6).

import { humanizeToken } from "./action-catalog";
import { NUMBER_KEYS, SWITCH_KEYS } from "./const";
import {
  readContractSettings,
  type SettingEntry,
  type SettingOption,
  type UiContract,
} from "./contract";
import { localizeOptional } from "./localize/localize";
import { serverString } from "./server-i18n";

// ---------------------------------------------------------------------------
// Resolution (§9.1.3 ordering, §9.1.6 rules 1–2)
// ---------------------------------------------------------------------------

/** Known group render order (spec §9.1.3); unknown groups follow, served order. */
export const KNOWN_SETTING_GROUP_ORDER: readonly string[] = [
  "brew", "water", "power", "system",
];

/** Setting control kinds this client can render (spec §9.1.1, open set). */
export const KNOWN_SETTING_CONTROLS: readonly string[] = ["switch", "number", "select"];

/** Client default icon for entries with an absent/malformed icon (§9.1.1). */
export const DEFAULT_SETTING_ICON = "mdi:tune";

/** One rendered settings group: contract entries sharing a `group` token. */
export interface SettingsGroup {
  group: string;
  entries: SettingEntry[];
}

export type LegacySwitchKey = (typeof SWITCH_KEYS)[number];
export type LegacyNumberKey = (typeof NUMBER_KEYS)[number];

/**
 * The resolved settings surface, one variant per §5.3.6 tier:
 * - "contract": render the grouped contract entries (empty groups = contract
 *   mode with nothing to show — the section hides, but NEVER falls back to
 *   the legacy tables; mirrors the action-catalog precedent).
 * - "legacy": render the 2.7.0 hardcoded rows for the listed keys.
 * - "hidden": nothing renderable at all.
 */
export type ResolvedSettings =
  | { mode: "contract"; groups: SettingsGroup[] }
  | { mode: "legacy"; switches: LegacySwitchKey[]; numbers: LegacyNumberKey[] }
  | { mode: "hidden" };

/** Entity-existence predicate: does `<domain>.<prefix>_<entitySuffix>` have a state object? */
export type SettingsEntityExists = (domain: string, entitySuffix: string) => boolean;

/**
 * Resolve the settings surface for rendering (spec §5.3.6 + §9.1.6).
 *
 * Tier 1 (contract `settings` present): entries with an unknown `control` are
 * skipped per entry (open set — a future control kind degrades only itself),
 * a select without renderable options is skipped, and — normative §9.1.6
 * rule 2 — an entry whose bound entity does not exist is hidden: contract
 * presence never overrides entity absence (covers user-disabled entities and
 * the §9.1.2.5 registration lag after a machine-type refinement). Survivors
 * are grouped in the §9.1.3 order (known groups first, then unknown groups
 * in served order; served order within each group).
 *
 * Tier 2 (no/older contract, or a malformed `settings` field): the legacy
 * key tables filtered by entity existence — exactly the 2.7.0 behaviour.
 * Tier 3: nothing exists on either tier → hidden.
 */
export function resolveSettings(
  contract: UiContract | null, entityExists: SettingsEntityExists,
): ResolvedSettings {
  const entries = contract ? readContractSettings(contract) : null;
  if (entries !== null) {
    const byGroup = new Map<string, SettingEntry[]>();
    for (const entry of entries) {
      if (!KNOWN_SETTING_CONTROLS.includes(entry.control)) continue;
      if (entry.control === "select" && (!entry.options || entry.options.length === 0)) continue;
      if (!entityExists(entry.entity.domain, entry.entity.entity_suffix)) continue;
      const list = byGroup.get(entry.group);
      if (list) list.push(entry);
      else byGroup.set(entry.group, [entry]);
    }
    const groups: SettingsGroup[] = [];
    for (const group of KNOWN_SETTING_GROUP_ORDER) {
      const list = byGroup.get(group);
      if (list) {
        groups.push({ group, entries: list });
        byGroup.delete(group);
      }
    }
    // Map iteration preserves insertion order = served order (§9.1.3).
    for (const [group, list] of byGroup) groups.push({ group, entries: list });
    return { mode: "contract", groups };
  }

  const switches = SWITCH_KEYS.filter((key) => entityExists("switch", key));
  const numbers = NUMBER_KEYS.filter((key) => entityExists("number", key));
  if (switches.length === 0 && numbers.length === 0) return { mode: "hidden" };
  return { mode: "legacy", switches, numbers };
}

// ---------------------------------------------------------------------------
// Display resolution (§9.1.4 chains, §6.3.5.1 preference order)
// ---------------------------------------------------------------------------

const MDI_RE = /^mdi:[a-z0-9][a-z0-9-]*$/;

/**
 * Icon for a setting entry: its `mdi:<name>` identifier when well-formed,
 * else the normative `mdi:tune` default (spec §9.1.1). An mdi identifier is
 * data, never markup — anything not matching the strict form is discarded.
 */
export function settingIcon(entry: SettingEntry): string {
  const icon = entry.icon;
  return typeof icon === "string" && MDI_RE.test(icon) ? icon : DEFAULT_SETTING_ICON;
}

/**
 * Display label for a setting token (spec §6.3.5.1 preference order):
 * server `settings.<setting>.label` → card bundle legacy keys
 * (`settings.switches.*` / `settings.numbers.*`) → humanized token.
 */
export function settingLabel(setting: string): string {
  return serverString(`settings.${setting}.label`)
    ?? localizeOptional(`settings.switches.${setting}.label`)
    ?? localizeOptional(`settings.numbers.${setting}.label`)
    ?? humanizeToken(setting);
}

/**
 * Optional description for a setting token (spec §9.1.6 rule 3):
 * server `settings.<setting>.description` → card bundle legacy `desc` keys →
 * null (a setting without one renders without a description line).
 */
export function settingDescription(setting: string): string | null {
  return serverString(`settings.${setting}.description`)
    ?? localizeOptional(`settings.switches.${setting}.desc`)
    ?? localizeOptional(`settings.numbers.${setting}.desc`)
    ?? null;
}

/**
 * Header label for a settings group (spec §9.1.3): server
 * `settings._groups.<group>` → card bundle `settings.groups.<group>` (a
 * future-bundle hook; no such keys ship today) → humanized group token (the
 * normative fallback for unknown group ids).
 */
export function settingGroupLabel(group: string): string {
  return serverString(`settings._groups.${group}`)
    ?? localizeOptional(`settings.groups.${group}`)
    ?? humanizeToken(group);
}

/**
 * Label for a level token — the normative §9.1.4 resolution chain:
 * server `settings.<setting>.levels.<token>` → server shared
 * `settings._levels.<token>` → card bundle (the legacy NUMERIC-keyed
 * `settings.levels.<setting>.<value>` entries, hence the wire `value`
 * parameter) → humanized token.
 */
export function settingLevelLabel(setting: string, token: string, value?: number): string {
  return serverString(`settings.${setting}.levels.${token}`)
    ?? serverString(`settings._levels.${token}`)
    ?? (value !== undefined
      ? localizeOptional(`settings.levels.${setting}.${value}`)
      : undefined)
    ?? humanizeToken(token);
}

/**
 * Display label for a select option (spec §9.1.1/§9.1.4): a tokenized option
 * localizes through the settingLevelLabel chain with the SERVED LABEL as the
 * last resort (real text beats a humanized token); `token: null` renders the
 * served label verbatim — it mirrors the entity's option string and no i18n
 * key exists for it (§6.3.4).
 */
export function settingOptionLabel(setting: string, option: SettingOption): string {
  if (option.token === null) return option.label;
  return serverString(`settings.${setting}.levels.${option.token}`)
    ?? serverString(`settings._levels.${option.token}`)
    ?? localizeOptional(`settings.levels.${setting}.${option.value}`)
    ?? option.label;
}

// ---------------------------------------------------------------------------
// Number helpers (§9.1.6 rule 5, read-only value display)
// ---------------------------------------------------------------------------

/** Effective bounds of a number control after the §9.1.6.5 cross-check. */
export interface NumberBounds {
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Effective min/max/step for a number control (spec §9.1.6 rule 5): the live
 * entity attributes are authoritative for the current instant, per attribute;
 * the contract values render before the entity loads (and fill any attribute
 * the entity does not carry).
 */
export function numberBounds(
  entry: SettingEntry, entityAttrs: Record<string, unknown> | null | undefined,
): NumberBounds {
  const pick = (key: "min" | "max" | "step"): number | undefined => {
    const live = entityAttrs?.[key];
    if (typeof live === "number" && Number.isFinite(live)) return live;
    return entry[key];
  };
  return { min: pick("min"), max: pick("max"), step: pick("step") };
}

/**
 * Read-only display string for a number setting's current value: a value on
 * the `levels` ladder renders its token label (§9.1.4 chain); a unit entry
 * renders value + unit (the "min" unit reuses the bundle's legacy
 * `settings.minutes` format so tier-1 and tier-2 render identically); a
 * plain entry renders the raw value. Never invents level labels for a
 * level-less entry (§9.1.1).
 */
export function numberValueLabel(entry: SettingEntry, value: number): string {
  const level = entry.levels?.find((l) => l.value === value);
  if (level) return settingLevelLabel(entry.setting, level.token, value);
  if (entry.unit === "min") {
    return localizeOptional("settings.minutes", { value }) ?? `${value} min`;
  }
  if (entry.unit) return `${value} ${entry.unit}`;
  return String(value);
}
