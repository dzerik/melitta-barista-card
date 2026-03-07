import { LitElement, html, css, nothing, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import {
  CARD_VERSION,
  STATE_COLORS,
  SWITCH_KEYS,
  NUMBER_KEYS,
  FREESTYLE_PROCESSES,
  FREESTYLE_PROCESSES_WITH_NONE,
  FREESTYLE_INTENSITIES,
  FREESTYLE_TEMPERATURES,
  FREESTYLE_SHOTS,
} from "./const";
import type { MelittaCardConfig, SettingItem } from "./types";
import { detectMelittaDevices } from "./utils";
import "./editor";

@customElement("melitta-barista-card")
export class MelittaBaristaCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: MelittaCardConfig;
  @state() private _resolvedPrefix: string | null = null;

  // Freestyle form state
  @state() private _freestyleName = "Custom";
  @state() private _freestyleProcess1 = "coffee";
  @state() private _freestyleIntensity1 = "medium";
  @state() private _freestylePortion1 = 40;
  @state() private _freestyleTemp1 = "normal";
  @state() private _freestyleShots1 = "one";
  @state() private _freestyleProcess2 = "none";
  @state() private _freestyleIntensity2 = "medium";
  @state() private _freestylePortion2 = 0;
  @state() private _freestyleTemp2 = "normal";
  @state() private _freestyleShots2 = "none";

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
      show_profiles: config.show_profiles !== false,
      show_freestyle: config.show_freestyle || false,
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

  private _getProfileSelectId(): string | null {
    const prefix = this._getPrefix();
    if (!prefix) return null;
    const id = `select.${prefix}_profile`;
    return this.hass.states[id] ? id : null;
  }

  private _getProfileOptions(): string[] {
    const id = this._getProfileSelectId();
    if (!id) return [];
    return this.hass.states[id]?.attributes?.options || [];
  }

  private _getSelectedProfile(): string | null {
    const id = this._getProfileSelectId();
    if (!id) return null;
    const state = this.hass.states[id]?.state;
    return state && state !== "unknown" && state !== "unavailable" ? state : null;
  }

  private _selectProfile(option: string): void {
    const id = this._getProfileSelectId();
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

  private _brewFreestyle(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    const brewEntityId = `button.${prefix}_brew`;
    if (!this.hass.states[brewEntityId]) return;

    this.hass.callService("melitta_barista", "brew_freestyle", {
      entity_id: brewEntityId,
      name: this._freestyleName,
      process1: this._freestyleProcess1,
      intensity1: this._freestyleIntensity1,
      portion1_ml: this._freestylePortion1,
      temperature1: this._freestyleTemp1,
      shots1: this._freestyleShots1,
      process2: this._freestyleProcess2,
      intensity2: this._freestyleIntensity2,
      portion2_ml: this._freestylePortion2,
      temperature2: this._freestyleTemp2,
      shots2: this._freestyleShots2,
    });
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

        ${this._config.show_profiles && isReady && this._getProfileOptions().length > 1
          ? this._renderProfileSelect()
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

        ${this._config.show_freestyle && isReady
          ? this._renderFreestyle()
          : nothing}

        ${this._config.show_settings ? this._renderSettings() : nothing}
      </ha-card>
    `;
  }

  private _renderProfileSelect() {
    const profileOptions = this._getProfileOptions();
    const selectedProfile = this._getSelectedProfile();

    return html`
      <div class="section-title">Profile</div>
      <div class="profile-row">
        <ha-icon icon="mdi:account-circle" class="profile-icon"></ha-icon>
        <select
          class="recipe-select"
          .value=${selectedProfile || ""}
          @change=${(e: Event) =>
            this._selectProfile((e.target as HTMLSelectElement).value)}
        >
          ${profileOptions.map(
            (opt) => html`
              <option value=${opt} ?selected=${opt === selectedProfile}>
                ${opt}
              </option>
            `
          )}
        </select>
      </div>
    `;
  }

  private _renderFreestyle() {
    return html`
      <div class="section-title">Freestyle</div>
      <div class="freestyle-section">
        <div class="freestyle-row">
          <label>Name</label>
          <input
            class="freestyle-input"
            type="text"
            .value=${this._freestyleName}
            @input=${(e: Event) => { this._freestyleName = (e.target as HTMLInputElement).value; }}
          />
        </div>

        <div class="freestyle-subtitle">Component 1</div>
        <div class="freestyle-grid">
          <div class="freestyle-field">
            <label>Process</label>
            <select class="freestyle-select" .value=${this._freestyleProcess1}
              @change=${(e: Event) => { this._freestyleProcess1 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_PROCESSES.map(p => html`<option value=${p} ?selected=${p === this._freestyleProcess1}>${p}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Intensity</label>
            <select class="freestyle-select" .value=${this._freestyleIntensity1}
              @change=${(e: Event) => { this._freestyleIntensity1 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_INTENSITIES.map(i => html`<option value=${i} ?selected=${i === this._freestyleIntensity1}>${i}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Portion (ml)</label>
            <input class="freestyle-input" type="number" min="5" max="250" step="5"
              .value=${String(this._freestylePortion1)}
              @input=${(e: Event) => { this._freestylePortion1 = parseInt((e.target as HTMLInputElement).value) || 40; }} />
          </div>
          <div class="freestyle-field">
            <label>Temperature</label>
            <select class="freestyle-select" .value=${this._freestyleTemp1}
              @change=${(e: Event) => { this._freestyleTemp1 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_TEMPERATURES.map(t => html`<option value=${t} ?selected=${t === this._freestyleTemp1}>${t}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Shots</label>
            <select class="freestyle-select" .value=${this._freestyleShots1}
              @change=${(e: Event) => { this._freestyleShots1 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_SHOTS.map(s => html`<option value=${s} ?selected=${s === this._freestyleShots1}>${s}</option>`)}
            </select>
          </div>
        </div>

        <div class="freestyle-subtitle">Component 2</div>
        <div class="freestyle-grid">
          <div class="freestyle-field">
            <label>Process</label>
            <select class="freestyle-select" .value=${this._freestyleProcess2}
              @change=${(e: Event) => { this._freestyleProcess2 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_PROCESSES_WITH_NONE.map(p => html`<option value=${p} ?selected=${p === this._freestyleProcess2}>${p}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Intensity</label>
            <select class="freestyle-select" .value=${this._freestyleIntensity2}
              @change=${(e: Event) => { this._freestyleIntensity2 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_INTENSITIES.map(i => html`<option value=${i} ?selected=${i === this._freestyleIntensity2}>${i}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Portion (ml)</label>
            <input class="freestyle-input" type="number" min="0" max="250" step="5"
              .value=${String(this._freestylePortion2)}
              @input=${(e: Event) => { this._freestylePortion2 = parseInt((e.target as HTMLInputElement).value) || 0; }} />
          </div>
          <div class="freestyle-field">
            <label>Temperature</label>
            <select class="freestyle-select" .value=${this._freestyleTemp2}
              @change=${(e: Event) => { this._freestyleTemp2 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_TEMPERATURES.map(t => html`<option value=${t} ?selected=${t === this._freestyleTemp2}>${t}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Shots</label>
            <select class="freestyle-select" .value=${this._freestyleShots2}
              @change=${(e: Event) => { this._freestyleShots2 = (e.target as HTMLSelectElement).value; }}>
              ${FREESTYLE_SHOTS.map(s => html`<option value=${s} ?selected=${s === this._freestyleShots2}>${s}</option>`)}
            </select>
          </div>
        </div>

        <button class="brew-btn freestyle-brew-btn" @click=${() => this._brewFreestyle()}>
          <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
          Brew Freestyle
        </button>
      </div>
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

      /* Profile */
      .profile-row {
        display: flex;
        gap: 8px;
        padding: 0 16px 12px;
        align-items: center;
      }

      .profile-icon {
        --mdc-icon-size: 20px;
        color: var(--text-secondary);
        flex-shrink: 0;
      }

      /* Freestyle */
      .freestyle-section {
        padding: 0 16px 12px;
      }

      .freestyle-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }

      .freestyle-row label,
      .freestyle-field label {
        font-size: 0.75em;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .freestyle-subtitle {
        font-size: 0.8em;
        font-weight: 500;
        color: var(--text-secondary);
        margin: 8px 0 4px;
        opacity: 0.8;
      }

      .freestyle-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .freestyle-field {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .freestyle-input,
      .freestyle-select {
        padding: 6px 8px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 0.85em;
        font-family: inherit;
      }

      .freestyle-select {
        cursor: pointer;
        appearance: auto;
      }

      .freestyle-input:focus,
      .freestyle-select:focus {
        outline: none;
        border-color: var(--primary-color, #03a9f4);
      }

      .freestyle-brew-btn {
        width: 100%;
        justify-content: center;
        margin-top: 12px;
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
