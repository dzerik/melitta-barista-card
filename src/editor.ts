import { LitElement, html, css, nothing, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import type { MelittaCardConfig } from "./types";
import { localize, setLanguage } from "./localize/localize";
import {
  detectMelittaDevices,
  DetectedDevice,
  normalizeScale,
  MIN_SCALE,
  MAX_SCALE,
} from "./utils";

interface ToggleOption {
  key: keyof MelittaCardConfig;
  /** Options that are on unless explicitly disabled in the config. */
  defaultOn: boolean;
}

const TOGGLES: ToggleOption[] = [
  { key: "show_header", defaultOn: true },
  { key: "show_status", defaultOn: true },
  { key: "show_profiles", defaultOn: true },
  { key: "show_recipes", defaultOn: true },
  { key: "show_freestyle", defaultOn: false },
  { key: "show_sommelier", defaultOn: false },
  { key: "show_stats", defaultOn: false },
  { key: "show_maintenance", defaultOn: false },
  { key: "show_settings", defaultOn: false },
  { key: "compact", defaultOn: false },
];

@customElement("melitta-barista-card-editor")
export class MelittaBaristaCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: MelittaCardConfig;
  @state() private _manualMode = false;

  public setConfig(config: MelittaCardConfig): void {
    this._config = config;
  }

  private _fireConfigChanged(): void {
    const event = new CustomEvent("config-changed", {
      detail: { config: { ...this._config } },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _valueChanged(key: keyof MelittaCardConfig, ev: Event): void {
    const target = ev.target as HTMLInputElement | HTMLSelectElement;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    this._config = { ...this._config, [key]: value };
    this._fireConfigChanged();
  }

  /**
   * Stores the UI scale as a number, dropping the key at the default size.
   *
   * A config without `scale` is what every card shipped before this option
   * looked like, so leaving it out keeps the YAML clean for users who never
   * touch the slider.
   */
  private _scaleChanged(ev: Event): void {
    const scale = normalizeScale((ev.target as HTMLInputElement).value);
    const config = { ...this._config };
    if (scale === 1) delete config.scale;
    else config.scale = scale;
    this._config = config;
    this._fireConfigChanged();
  }

  private _prefixChanged(ev: Event): void {
    const raw = (ev.target as HTMLInputElement).value;
    this._config = { ...this._config, entity_prefix: raw.trim() };
    this._fireConfigChanged();
  }

  private _deviceSelected(ev: Event): void {
    const select = ev.target as HTMLSelectElement;
    const prefix = select.value;

    if (prefix === "__manual__") {
      this._manualMode = true;
      this._config = { ...this._config, entity_prefix: "" };
      this._fireConfigChanged();
      return;
    }

    this._manualMode = false;
    const devices = this.hass ? detectMelittaDevices(this.hass) : [];
    const device = devices.find((d) => d.prefix === prefix);
    this._config = {
      ...this._config,
      entity_prefix: prefix,
      name: device?.name || this._config.name,
    };
    this._fireConfigChanged();
  }

  protected render() {
    if (!this._config) return nothing;
    setLanguage(this.hass);

    const devices: DetectedDevice[] = this.hass
      ? detectMelittaDevices(this.hass)
      : [];

    const currentPrefix = this._config.entity_prefix || "";
    const isKnownDevice = devices.some((d) => d.prefix === currentPrefix);
    const manualSelected = this._manualMode || (!!currentPrefix && !isKnownDevice);
    const showManualInput = devices.length > 0 && manualSelected;
    const scale = normalizeScale(this._config.scale);

    return html`
      ${devices.length > 0
        ? html`
            <div class="editor-row">
              <label for="device">${localize("editor.device")}</label>
              <select id="device" @change=${this._deviceSelected}>
                ${devices.map(
                  (d) => html`
                    <option value=${d.prefix}
                      ?selected=${!manualSelected && d.prefix === currentPrefix}>
                      ${d.name}
                    </option>
                  `
                )}
                <option value="__manual__" ?selected=${manualSelected}>
                  ${localize("editor.enter_manually")}
                </option>
              </select>
            </div>
          `
        : html`
            <div class="editor-row">
              <label for="entity_prefix">${localize("editor.entity_prefix")}</label>
              <input
                id="entity_prefix"
                .value=${currentPrefix}
                placeholder=${localize("editor.entity_prefix_placeholder")}
                @input=${(ev: Event) => this._prefixChanged(ev)}
              />
              <span class="hint">${localize("editor.no_devices_hint")}</span>
            </div>
          `}

      ${showManualInput
        ? html`
            <div class="editor-row">
              <label for="entity_prefix">${localize("editor.entity_prefix")}</label>
              <input
                id="entity_prefix"
                .value=${currentPrefix}
                @input=${(ev: Event) => this._prefixChanged(ev)}
              />
            </div>
          `
        : ""}

      <div class="editor-row">
        <label for="name">${localize("editor.name")}</label>
        <input
          id="name"
          .value=${this._config.name || localize("common.default_name")}
          @input=${(ev: Event) => this._valueChanged("name", ev)}
        />
      </div>

      <div class="editor-row">
        <label for="scale">
          ${localize("editor.scale")}
          <span class="scale-value">${Math.round(scale * 100)}%</span>
        </label>
        <input
          id="scale"
          type="range"
          min=${MIN_SCALE}
          max=${MAX_SCALE}
          step="0.05"
          .value=${String(scale)}
          @input=${(ev: Event) => this._scaleChanged(ev)}
        />
      </div>

      ${TOGGLES.map(({ key, defaultOn }) => html`
        <div class="checkbox-row">
          <input type="checkbox" id=${key}
            .checked=${defaultOn ? this._config[key] !== false : this._config[key] === true}
            @change=${(ev: Event) => this._valueChanged(key, ev)} />
          <label for=${key}>${localize(`editor.${key}`)}</label>
        </div>
      `)}
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .editor-row {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
      }
      label {
        font-weight: 500;
        margin-bottom: 4px;
        font-size: 0.9em;
      }
      input[type="text"],
      input:not([type]),
      select {
        padding: 8px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px;
        font-size: 0.9em;
        background: var(--ha-card-background, var(--card-background-color, white));
        color: var(--primary-text-color);
      }
      select { cursor: pointer; }
      .hint {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }
      .scale-value {
        float: right;
        font-weight: 400;
        color: var(--secondary-text-color);
        font-variant-numeric: tabular-nums;
      }
      input[type="range"] { width: 100%; }
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
    `;
  }
}
