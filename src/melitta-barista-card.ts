import { LitElement, html, css, nothing, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import { CARD_VERSION, STATE_COLORS, SWITCH_KEYS, NUMBER_KEYS } from "./const";
import type { MelittaCardConfig, SettingItem } from "./types";
import { detectMelittaDevices } from "./utils";
import "./editor";

@customElement("melitta-barista-card")
export class MelittaBaristaCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: MelittaCardConfig;
  @state() private _resolvedPrefix: string | null = null;

  public static getConfigElement(): HTMLElement {
    return document.createElement("melitta-barista-card-editor");
  }

  public static getStubConfig(hass: HomeAssistant): Record<string, unknown> {
    const devices = detectMelittaDevices(hass);
    return {
      entity_prefix: devices.length > 0 ? devices[0].prefix : "",
      name: devices.length > 0 ? devices[0].name : "Melitta Barista",
      show_recipes: true,
      show_settings: false,
      compact: false,
    };
  }

  public setConfig(config: MelittaCardConfig): void {
    this._config = {
      ...config,
      show_recipes: config.show_recipes !== false,
      show_settings: config.show_settings || false,
      compact: config.compact || false,
    };
    // Reset resolved prefix so it re-detects on next render
    this._resolvedPrefix = null;
  }

  public getCardSize(): number {
    return this._config?.compact ? 3 : 5;
  }

  public getGridOptions() {
    return { rows: this._config?.compact ? 3 : 5, columns: 6, min_rows: 2, min_columns: 3 };
  }

  private _getPrefix(): string | null {
    // Explicit config takes priority
    if (this._config.entity_prefix) return this._config.entity_prefix;

    // Auto-detect and cache
    if (this._resolvedPrefix) return this._resolvedPrefix;

    if (this.hass) {
      const devices = detectMelittaDevices(this.hass);
      if (devices.length > 0) {
        this._resolvedPrefix = devices[0].prefix;
        // Also set name if not configured
        if (!this._config.name) {
          this._config = { ...this._config, name: devices[0].name };
        }
        return this._resolvedPrefix;
      }
    }
    return null;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("_config") || changedProps.has("_resolvedPrefix")) return true;
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) return true;

    const prefix = this._getPrefix();
    if (!prefix) return true;

    for (const [id, stateObj] of Object.entries(this.hass.states)) {
      if (id.includes(prefix) && oldHass.states[id] !== stateObj) {
        return true;
      }
    }
    return false;
  }

  private _getState(suffix: string): string | null {
    if (!this.hass) return null;
    const prefix = this._getPrefix();
    if (!prefix) return null;
    const domains = ["sensor", "button", "select", "number", "switch"];
    for (const domain of domains) {
      const id = `${domain}.${prefix}_${suffix}`;
      if (this.hass.states[id]) return this.hass.states[id].state;
    }
    return null;
  }

  private _getRecipeSelectId(): string | null {
    const prefix = this._getPrefix();
    if (!prefix) return null;
    const id = `select.${prefix}_recipe`;
    return this.hass.states[id] ? id : null;
  }

  private _getRecipeOptions(): string[] {
    const id = this._getRecipeSelectId();
    if (!id) return [];
    return this.hass.states[id]?.attributes?.options || [];
  }

  private _getSelectedRecipe(): string | null {
    const id = this._getRecipeSelectId();
    if (!id) return null;
    const state = this.hass.states[id]?.state;
    return state && state !== "unknown" && state !== "unavailable" ? state : null;
  }

  private _selectRecipe(option: string): void {
    const id = this._getRecipeSelectId();
    if (id) {
      this.hass.callService("select", "select_option", {
        entity_id: id,
        option,
      });
    }
  }

  private _brew(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this._pressButton(`button.${prefix}_brew`);
  }

  private _getSettings(): SettingItem[] {
    if (!this.hass) return [];
    const prefix = this._getPrefix();
    if (!prefix) return [];
    const settings: SettingItem[] = [];

    for (const key of SWITCH_KEYS) {
      const entity = this.hass.states[`switch.${prefix}_${key}`];
      if (entity) {
        settings.push({
          name: entity.attributes.friendly_name || key,
          value: entity.state === "on" ? "On" : "Off",
        });
      }
    }

    for (const key of NUMBER_KEYS) {
      const entity = this.hass.states[`number.${prefix}_${key}`];
      if (entity) {
        const unit = entity.attributes.unit_of_measurement || "";
        settings.push({
          name: entity.attributes.friendly_name || key,
          value: `${entity.state}${unit ? " " + unit : ""}`,
        });
      }
    }

    return settings;
  }

  private _pressButton(entityId: string): void {
    if (!this.hass.states[entityId]) return;
    this.hass.callService("button", "press", { entity_id: entityId });
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const prefix = this._getPrefix();
    if (!prefix) {
      return html`
        <ha-card>
          <div class="no-device">
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            <p>No Melitta Barista device found.</p>
            <p class="hint">Make sure the integration is installed and configured.</p>
          </div>
        </ha-card>
      `;
    }

    const machineState = this._getState("state") || "unavailable";
    const activity = this._getState("activity") || "Idle";
    const progress = this._getState("progress");
    const actionRequired = this._getState("action_required");
    const connection = this._getState("connection") || "Disconnected";

    const isConnected = connection === "Connected";
    const isUnavailable = machineState === "unavailable" || machineState === "unknown";
    const isBrewing = machineState === "Brewing";
    const isReady = machineState === "Ready";
    const hasAction = actionRequired && actionRequired !== "None" && actionRequired !== "unknown";
    const hasProgress = progress && progress !== "unknown" && progress !== "None";
    const progressNum = hasProgress
      ? Math.max(0, Math.min(100, parseFloat(progress!) || 0))
      : 0;

    const stateColor = STATE_COLORS[machineState.toLowerCase()] || "var(--primary-text-color)";
    const recipeOptions = this._getRecipeOptions();
    const selectedRecipe = this._getSelectedRecipe();
    const cancelEntityId = `button.${prefix}_cancel`;
    const cardName = this._config.name || "Melitta Barista";

    if (isUnavailable) {
      return html`
        <ha-card>
          <div class="card-header">
            <span class="machine-name">${cardName}</span>
            <div
              class="connection-dot"
              style="background: var(--error-color, #f44336)"
              title="Disconnected"
            ></div>
          </div>
          <div class="offline-section">
            <ha-icon icon="mdi:bluetooth-off"></ha-icon>
            <span>Machine offline</span>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="card-header">
          <span class="machine-name">${cardName}</span>
          <div
            class="connection-dot"
            style="background: ${isConnected ? "var(--state-active-color, #4caf50)" : "var(--error-color, #f44336)"}"
            title="${connection}"
          ></div>
        </div>

        <div class="status-section">
          <div class="state-row">
            <span
              class="state-badge"
              style="background: ${stateColor}22; color: ${stateColor}"
            >
              ${machineState}
            </span>
            ${isBrewing
              ? html`<span class="activity-text">${activity}</span>`
              : nothing}
          </div>
          ${hasProgress
            ? html`
                <div class="progress-bar-container">
                  <div
                    class="progress-bar"
                    style="width: ${progressNum}%; background: ${stateColor}"
                  ></div>
                </div>
              `
            : nothing}
        </div>

        ${hasAction
          ? html`
              <div class="action-alert">
                <ha-icon icon="mdi:alert-circle"></ha-icon>
                <span>${actionRequired}</span>
              </div>
            `
          : nothing}

        ${isBrewing
          ? html`
              <div class="cancel-row">
                <button
                  class="cancel-btn"
                  @click=${() => this._pressButton(cancelEntityId)}
                >
                  Cancel
                </button>
              </div>
            `
          : nothing}

        ${this._config.show_recipes && isReady && recipeOptions.length > 0
          ? html`
              <div class="section-title">Recipe</div>
              <div class="recipe-row">
                <select
                  class="recipe-select"
                  .value=${selectedRecipe || ""}
                  @change=${(e: Event) =>
                    this._selectRecipe((e.target as HTMLSelectElement).value)}
                >
                  <option value="" disabled ?selected=${!selectedRecipe}>
                    Select recipe…
                  </option>
                  ${recipeOptions.map(
                    (opt) => html`
                      <option value=${opt} ?selected=${opt === selectedRecipe}>
                        ${opt}
                      </option>
                    `
                  )}
                </select>
                <button
                  class="brew-btn"
                  ?disabled=${!selectedRecipe}
                  @click=${() => this._brew()}
                >
                  <ha-icon icon="mdi:coffee"></ha-icon>
                  Brew
                </button>
              </div>
            `
          : nothing}

        ${this._config.show_settings ? this._renderSettings() : nothing}
      </ha-card>
    `;
  }

  private _renderSettings() {
    const settings = this._getSettings();
    if (settings.length === 0) return nothing;

    return html`
      <div class="section-title">Settings</div>
      <div class="settings-list">
        ${settings.map(
          (s) => html`
            <div class="setting-row">
              <span class="setting-label">${s.name}</span>
              <span class="setting-value">${s.value}</span>
            </div>
          `
        )}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --card-bg: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        --text-primary: var(--primary-text-color);
        --text-secondary: var(--secondary-text-color);
      }

      .no-device {
        padding: 32px 16px;
        text-align: center;
        color: var(--text-secondary);
      }

      .no-device ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.4;
      }

      .no-device p {
        margin: 8px 0 0;
      }

      .no-device .hint {
        font-size: 0.85em;
        opacity: 0.7;
      }

      .offline-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px 20px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .offline-section ha-icon {
        --mdc-icon-size: 20px;
        opacity: 0.5;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 8px;
      }

      .machine-name {
        font-size: 1.1em;
        font-weight: 500;
        color: var(--text-primary);
      }

      .connection-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-section {
        padding: 0 16px 12px;
      }

      .state-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .state-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.85em;
        font-weight: 500;
      }

      .activity-text {
        font-size: 0.85em;
        color: var(--text-secondary);
      }

      .progress-bar-container {
        height: 4px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 2px;
        margin: 8px 0;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        border-radius: 2px;
        transition: width 0.5s ease;
      }

      .action-alert {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin: 0 16px 8px;
        border-radius: 8px;
        background: color-mix(
          in srgb,
          var(--error-color, #f44336) 8%,
          transparent
        );
        color: var(--error-color, #f44336);
        font-size: 0.85em;
      }

      .action-alert ha-icon {
        --mdc-icon-size: 18px;
        flex-shrink: 0;
      }

      .recipe-row {
        display: flex;
        gap: 8px;
        padding: 0 16px 12px;
        align-items: center;
      }

      .recipe-select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 0.9em;
        font-family: inherit;
        cursor: pointer;
        appearance: auto;
      }

      .recipe-select:focus {
        outline: none;
        border-color: var(--primary-color, #03a9f4);
      }

      .brew-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        font-size: 0.9em;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s ease;
        white-space: nowrap;
      }

      .brew-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      .brew-btn:hover:not(:disabled) {
        opacity: 0.85;
      }

      .brew-btn:active:not(:disabled) {
        transform: scale(0.96);
      }

      .brew-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .brew-btn:focus-visible,
      .cancel-btn:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
      }

      .cancel-row {
        padding: 0 16px 12px;
      }

      .cancel-btn {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--error-color, #f44336);
        border-radius: 8px;
        background: color-mix(
          in srgb,
          var(--error-color, #f44336) 8%,
          transparent
        );
        color: var(--error-color, #f44336);
        font-size: 0.85em;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s ease;
      }

      .cancel-btn:hover {
        background: color-mix(
          in srgb,
          var(--error-color, #f44336) 18%,
          transparent
        );
      }

      .section-title {
        font-size: 0.8em;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-secondary);
        padding: 8px 16px 4px;
      }

      .settings-list {
        padding: 0 16px 12px;
      }

      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 0.85em;
      }

      .setting-label {
        color: var(--text-secondary);
      }

      .setting-value {
        color: var(--text-primary);
        font-weight: 500;
      }
    `;
  }
}

// Register in card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "melitta-barista-card",
  name: "Melitta Barista Card",
  description: "Control your Melitta Barista coffee machine",
  preview: true,
  documentationURL: "https://github.com/dzerik/melitta-barista-card",
});

console.info(
  `%c MELITTA-BARISTA-CARD %c v${CARD_VERSION} `,
  "color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;",
  "color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;"
);
