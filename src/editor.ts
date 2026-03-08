import { LitElement, html, css, nothing, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import type { MelittaCardConfig } from "./types";
import { detectMelittaDevices, DetectedDevice } from "./utils";

@customElement("melitta-barista-card-editor")
export class MelittaBaristaCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: MelittaCardConfig;

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

  private _deviceSelected(ev: Event): void {
    const select = ev.target as HTMLSelectElement;
    const prefix = select.value;

    if (prefix === "__manual__") {
      this._config = { ...this._config, entity_prefix: "" };
      this._fireConfigChanged();
      return;
    }

    // Also auto-fill name from detected device
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

    const devices: DetectedDevice[] = this.hass
      ? detectMelittaDevices(this.hass)
      : [];

    const currentPrefix = this._config.entity_prefix || "";
    const isKnownDevice = devices.some((d) => d.prefix === currentPrefix);
    const showManualInput = currentPrefix && !isKnownDevice && devices.length > 0;

    return html`
      ${devices.length > 0
        ? html`
            <div class="editor-row">
              <label for="device">Device</label>
              <select
                id="device"
                @change=${this._deviceSelected}
              >
                ${devices.map(
                  (d) => html`
                    <option value=${d.prefix} ?selected=${d.prefix === currentPrefix}>
                      ${d.name}
                    </option>
                  `
                )}
                <option value="__manual__" ?selected=${showManualInput}>
                  Enter manually...
                </option>
              </select>
            </div>
          `
        : html`
            <div class="editor-row">
              <label for="entity_prefix">Entity Prefix</label>
              <input
                id="entity_prefix"
                .value=${currentPrefix}
                placeholder="Auto-detected if integration is running"
                @input=${(ev: Event) => this._valueChanged("entity_prefix", ev)}
              />
              <span class="hint">No Melitta devices detected. Enter prefix manually or check that the integration is configured.</span>
            </div>
          `}

      ${showManualInput
        ? html`
            <div class="editor-row">
              <label for="entity_prefix">Entity Prefix</label>
              <input
                id="entity_prefix"
                .value=${currentPrefix}
                @input=${(ev: Event) => this._valueChanged("entity_prefix", ev)}
              />
            </div>
          `
        : ""}

      <div class="editor-row">
        <label for="name">Name</label>
        <input
          id="name"
          .value=${this._config.name || "Melitta Barista"}
          @input=${(ev: Event) => this._valueChanged("name", ev)}
        />
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_header"
          .checked=${this._config.show_header !== false}
          @change=${(ev: Event) => this._valueChanged("show_header", ev)}
        />
        <label for="show_header">Show header</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_status"
          .checked=${this._config.show_status !== false}
          @change=${(ev: Event) => this._valueChanged("show_status", ev)}
        />
        <label for="show_status">Show status</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_profiles"
          .checked=${this._config.show_profiles !== false}
          @change=${(ev: Event) => this._valueChanged("show_profiles", ev)}
        />
        <label for="show_profiles">Show profile selector</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_recipes"
          .checked=${this._config.show_recipes !== false}
          @change=${(ev: Event) => this._valueChanged("show_recipes", ev)}
        />
        <label for="show_recipes">Show recipe selector</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_freestyle"
          .checked=${this._config.show_freestyle || false}
          @change=${(ev: Event) => this._valueChanged("show_freestyle", ev)}
        />
        <label for="show_freestyle">Show freestyle recipe</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_settings"
          .checked=${this._config.show_settings || false}
          @change=${(ev: Event) => this._valueChanged("show_settings", ev)}
        />
        <label for="show_settings">Show settings</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="compact"
          .checked=${this._config.compact || false}
          @change=${(ev: Event) => this._valueChanged("compact", ev)}
        />
        <label for="compact">Compact mode</label>
      </div>
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
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        color: var(--primary-text-color);
      }

      select {
        cursor: pointer;
      }

      .hint {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }

      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
    `;
  }
}
