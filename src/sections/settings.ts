// Machine settings: switches (toggles) and read-only number values.

import { html, nothing, TemplateResult } from "lit";
import { SWITCH_KEYS, NUMBER_KEYS, SWITCH_META, NUMBER_META } from "../const";
import { localize, localizeOptional } from "../localize/localize";
import { isRealState } from "../machine-state";

interface EntityLike {
  state: string;
  attributes: Record<string, unknown>;
}

export interface SettingsSectionProps {
  getEntity: (domain: "switch" | "number", key: string) => EntityLike | undefined;
  onToggle: (key: string, turnOn: boolean) => void;
}

export function renderSettings(props: SettingsSectionProps): TemplateResult | typeof nothing {
  const switchCards = SWITCH_KEYS.map((key) => {
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

  const numberCards = NUMBER_KEYS.map((key) => {
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
