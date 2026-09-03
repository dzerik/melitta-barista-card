// Machine settings section (spec §9.1, Zone C-J).
//
// Two render paths, chosen by the resolved model (settings-catalog.ts):
// - Contract mode (§9.1.6): grouped entries from `contract.settings` with
//   writable level controls for numbers, select rows (Nivona), and the
//   §9.1.4 label/level chains (server strings → bundle → humanized token).
// - Legacy mode (tier 2, and the pre-wiring default when no resolved model
//   is passed): exactly the 2.7.0 behaviour — hardcoded switch toggles and
//   read-only number values from SWITCH_KEYS/NUMBER_KEYS + entity existence.

import { html, nothing, TemplateResult } from "lit";
import { SWITCH_KEYS, NUMBER_KEYS, SWITCH_META, NUMBER_META } from "../const";
import type { SettingEntry } from "../contract";
import { localize, localizeOptional } from "../localize/localize";
import { isRealState } from "../machine-state";
import {
  numberBounds,
  numberValueLabel,
  settingDescription,
  settingGroupLabel,
  settingIcon,
  settingLabel,
  settingLevelLabel,
  settingOptionLabel,
  type ResolvedSettings,
} from "../settings-catalog";

interface EntityLike {
  state: string;
  attributes: Record<string, unknown>;
}

export interface SettingsSectionProps {
  getEntity: (domain: string, key: string) => EntityLike | undefined;
  onToggle: (key: string, turnOn: boolean) => void;
  /**
   * Resolved settings model (Zone C-L wiring). Absent/null → the legacy
   * 2.7.0 render path, so the card behaves identically until wired.
   */
  resolved?: ResolvedSettings | null;
  /** Contract mode: write a number entity (`number.set_value`). */
  onSetNumber?: (entitySuffix: string, value: number) => void;
  /** Contract mode: write a select entity with the SERVED label (§9.1.6.4). */
  onSelectOption?: (entitySuffix: string, option: string) => void;
}

// ---------------------------------------------------------------------------
// Legacy path — byte-for-byte the 2.7.0 rendering (§5.3.6 tier 2/3)
// ---------------------------------------------------------------------------

function renderLegacy(
  props: SettingsSectionProps,
  switchKeys: readonly (typeof SWITCH_KEYS)[number][],
  numberKeys: readonly (typeof NUMBER_KEYS)[number][],
): TemplateResult | typeof nothing {
  const switchCards = switchKeys.map((key) => {
    const entity = props.getEntity("switch", key);
    if (!entity) return nothing;
    const isOn = entity.state === "on";
    const meta = SWITCH_META[key];
    return html`
      <div class="setting-card">
        <ha-icon class="setting-icon" icon="${meta.icon}"></ha-icon>
        <div class="setting-info">
          <div class="setting-label">${localize(`settings.switches.${key}.label`)}</div>
          <div class="setting-desc">${localize(`settings.switches.${key}.desc`)}</div>
        </div>
        <button class="toggle-track" ?data-on=${isOn}
          @click=${() => props.onToggle(key, !isOn)}>
          <span class="toggle-thumb"></span>
        </button>
      </div>
    `;
  });

  const numberCards = numberKeys.map((key) => {
    const entity = props.getEntity("number", key);
    if (!entity) return nothing;
    const meta = NUMBER_META[key];
    const val = isRealState(entity.state) ? parseFloat(entity.state) : NaN;
    let display: string;
    if (Number.isNaN(val)) {
      display = "—";
    } else if (meta.format === "level") {
      display = localizeOptional(`settings.levels.${key}.${val}`) ?? String(val);
    } else {
      display = localize("settings.minutes", { value: val });
    }
    return html`
      <div class="setting-card">
        <ha-icon class="setting-icon" icon="${meta.icon}"></ha-icon>
        <div class="setting-info">
          <div class="setting-label">${localize(`settings.numbers.${key}.label`)}</div>
          <div class="setting-desc">${localize(`settings.numbers.${key}.desc`)}</div>
        </div>
        <span class="setting-value">${display}</span>
      </div>
    `;
  });

  if (switchCards.every(c => c === nothing) && numberCards.every(c => c === nothing)) {
    return nothing;
  }

  return html`
    <div class="section-title">${localize("settings.title")}</div>
    <div class="settings-grid">
      ${switchCards}
      ${numberCards}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Contract path (§9.1.6)
// ---------------------------------------------------------------------------

function entryHeader(entry: SettingEntry): TemplateResult {
  const desc = settingDescription(entry.setting);
  return html`
    <ha-icon class="setting-icon" icon="${settingIcon(entry)}"></ha-icon>
    <div class="setting-info">
      <div class="setting-label">${settingLabel(entry.setting)}</div>
      ${desc !== null ? html`<div class="setting-desc">${desc}</div>` : nothing}
    </div>
  `;
}

function renderSwitchEntry(
  entry: SettingEntry, entity: EntityLike, props: SettingsSectionProps,
): TemplateResult {
  const isOn = entity.state === "on";
  const control = entry.writable
    ? html`
        <button class="toggle-track" ?data-on=${isOn}
          @click=${() => props.onToggle(entry.entity.entity_suffix, !isOn)}>
          <span class="toggle-thumb"></span>
        </button>
      `
    : html`<span class="setting-value">
        ${settingLevelLabel(entry.setting, isOn ? "on" : "off", isOn ? 1 : 0)}
      </span>`;
  return html`<div class="setting-card">${entryHeader(entry)}${control}</div>`;
}

function renderNumberEntry(
  entry: SettingEntry, entity: EntityLike, props: SettingsSectionProps,
): TemplateResult {
  const val = isRealState(entity.state) ? parseFloat(entity.state) : NaN;
  const writable = entry.writable && props.onSetNumber !== undefined;
  const onSet = props.onSetNumber;
  const suffix = entry.entity.entity_suffix;

  if (writable && entry.levels && entry.levels.length > 0) {
    // Discrete ladder → writable level control (segmented picker).
    return html`
      <div class="setting-card">
        ${entryHeader(entry)}
        <div class="segment-options setting-levels">
          ${entry.levels.map((level) => html`
            <button class="segment-opt" ?data-active=${level.value === val}
              @click=${() => onSet!(suffix, level.value)}>
              ${settingLevelLabel(entry.setting, level.token, level.value)}
            </button>
          `)}
        </div>
      </div>
    `;
  }

  if (writable) {
    // Plain numeric control; display hint is advisory (§9.1.1). Entity
    // attributes win the min/max/step cross-check (§9.1.6.5).
    const bounds = numberBounds(entry, entity.attributes);
    const commit = (e: Event) => {
      const v = (e.target as HTMLInputElement).valueAsNumber;
      if (!Number.isNaN(v)) onSet!(suffix, v);
    };
    const input = entry.display === "slider"
      ? html`
          <input type="range" class="portion-slider setting-num-input"
            min=${bounds.min ?? nothing} max=${bounds.max ?? nothing}
            step=${bounds.step ?? nothing}
            .value=${Number.isNaN(val) ? "" : String(val)} @change=${commit} />
        `
      : html`
          <input type="number" class="setting-num-input"
            min=${bounds.min ?? nothing} max=${bounds.max ?? nothing}
            step=${bounds.step ?? nothing}
            .value=${Number.isNaN(val) ? "" : String(val)} @change=${commit} />
        `;
    return html`
      <div class="setting-card">
        ${entryHeader(entry)}
        <span class="setting-value">${Number.isNaN(val) ? "—" : numberValueLabel(entry, val)}</span>
        ${input}
      </div>
    `;
  }

  // Read-only (writable: false, or the write path is not wired).
  return html`
    <div class="setting-card">
      ${entryHeader(entry)}
      <span class="setting-value">${Number.isNaN(val) ? "—" : numberValueLabel(entry, val)}</span>
    </div>
  `;
}

function renderSelectEntry(
  entry: SettingEntry, entity: EntityLike, props: SettingsSectionProps,
): TemplateResult {
  const options = entry.options ?? [];
  const current = options.find((o) => o.label === entity.state);
  const writable = entry.writable && props.onSelectOption !== undefined;
  const onSelect = props.onSelectOption;
  const suffix = entry.entity.entity_suffix;

  const control = writable
    ? html`
        <select class="setting-select"
          @change=${(e: Event) => onSelect!(suffix, (e.target as HTMLSelectElement).value)}>
          ${options.map((o) => html`
            <option value=${o.label} ?selected=${o.label === entity.state}>
              ${settingOptionLabel(entry.setting, o)}
            </option>
          `)}
        </select>
      `
    : html`<span class="setting-value">
        ${current
          ? settingOptionLabel(entry.setting, current)
          : (isRealState(entity.state) ? entity.state : "—")}
      </span>`;
  return html`<div class="setting-card">${entryHeader(entry)}${control}</div>`;
}

function renderContractEntry(
  entry: SettingEntry, props: SettingsSectionProps,
): TemplateResult | typeof nothing {
  // §9.1.6 rule 2 re-checked at render time: contract presence never
  // overrides entity absence (the resolver filtered on a snapshot).
  const entity = props.getEntity(entry.entity.domain, entry.entity.entity_suffix);
  if (!entity) return nothing;
  switch (entry.control) {
    case "switch": return renderSwitchEntry(entry, entity, props);
    case "number": return renderNumberEntry(entry, entity, props);
    case "select": return renderSelectEntry(entry, entity, props);
    default: return nothing; // unknown control kind (open set, §9.1.1)
  }
}

function renderContract(
  props: SettingsSectionProps, resolved: Extract<ResolvedSettings, { mode: "contract" }>,
): TemplateResult | typeof nothing {
  if (resolved.groups.length === 0) return nothing;
  return html`
    <div class="section-title">${localize("settings.title")}</div>
    ${resolved.groups.map((group) => html`
      <div class="maint-group-title settings-group-title">${settingGroupLabel(group.group)}</div>
      <div class="settings-grid">
        ${group.entries.map((entry) => renderContractEntry(entry, props))}
      </div>
    `)}
  `;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function renderSettings(props: SettingsSectionProps): TemplateResult | typeof nothing {
  const resolved = props.resolved;
  if (resolved?.mode === "contract") return renderContract(props, resolved);
  if (resolved?.mode === "hidden") return nothing;
  if (resolved?.mode === "legacy") {
    return renderLegacy(props, resolved.switches, resolved.numbers);
  }
  // No resolved model (wiring predates Zone C-L): full 2.7.0 behaviour.
  return renderLegacy(props, SWITCH_KEYS, NUMBER_KEYS);
}
