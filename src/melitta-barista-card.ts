import { LitElement, html, nothing, PropertyValues, CSSResultGroup } from "lit";
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
import type { MelittaCardConfig } from "./types";
import { detectMelittaDevices } from "./utils";
import { coffeeIconSvg } from "./icons";
import { cardStyles } from "./styles";
import "./editor";

const SWITCH_META: Record<string, { label: string; desc: string; icon: string }> = {
  energy_saving: { label: "Energy Saving", desc: "Reduce power when idle", icon: "mdi:lightning-bolt" },
  auto_bean_select: { label: "Auto Bean Select", desc: "Auto-choose bean hopper", icon: "mdi:seed" },
  rinsing_disabled: { label: "Rinsing Disabled", desc: "Skip auto rinse cycle", icon: "mdi:water-off" },
};

const NUMBER_META: Record<string, { label: string; desc: string; icon: string; format: "level" | "minutes" }> = {
  water_hardness: { label: "Water Hardness", desc: "Calibrate for water type", icon: "mdi:water", format: "level" },
  auto_off_after: { label: "Auto Off", desc: "Minutes until shutdown", icon: "mdi:timer-outline", format: "minutes" },
  brew_temperature: { label: "Brew Temperature", desc: "Brewing water temp", icon: "mdi:thermometer", format: "level" },
};

const LEVEL_LABELS: Record<string, Record<number, string>> = {
  water_hardness: { 1: "Soft", 2: "Medium", 3: "Hard", 4: "Very Hard" },
  brew_temperature: { 0: "Low", 1: "Normal", 2: "High" },
};

const DISPLAY: Record<string, string> = {
  very_mild: "V.Mild", mild: "Mild", medium: "Med", strong: "Strong",
  very_strong: "V.Strong", extra_strong: "X.Strong",
  cold: "Cold", normal: "Normal", high: "High",
  none: "None", one: "1", two: "2", three: "3",
  coffee: "Coffee", milk: "Milk", water: "Water",
};

function displayName(v: string): string {
  return DISPLAY[v] || v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " ");
}

@customElement("melitta-barista-card")
export class MelittaBaristaCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: MelittaCardConfig;
  @state() private _resolvedPrefix: string | null = null;

  // Freestyle form
  @state() private _fsName = "Custom";
  @state() private _fsProcess1 = "coffee";
  @state() private _fsIntensity1 = "medium";
  @state() private _fsPortion1 = 40;
  @state() private _fsTemp1 = "normal";
  @state() private _fsShots1 = "one";
  @state() private _fsProcess2 = "none";
  @state() private _fsIntensity2 = "medium";
  @state() private _fsPortion2 = 0;
  @state() private _fsTemp2 = "normal";
  @state() private _fsShots2 = "none";

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
    this._resolvedPrefix = null;
  }

  public getCardSize(): number {
    return this._config?.compact ? 3 : 5;
  }

  public getGridOptions() {
    return { rows: this._config?.compact ? 3 : 5, columns: 6, min_rows: 2, min_columns: 3 };
  }

  private _getPrefix(): string | null {
    if (this._config.entity_prefix) return this._config.entity_prefix;
    if (this._resolvedPrefix) return this._resolvedPrefix;
    if (this.hass) {
      const devices = detectMelittaDevices(this.hass);
      if (devices.length > 0) {
        this._resolvedPrefix = devices[0].prefix;
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
    // Check freestyle state changes
    for (const key of changedProps.keys()) {
      if (typeof key === "string" && key.startsWith("_fs")) return true;
    }
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) return true;
    const prefix = this._getPrefix();
    if (!prefix) return true;
    for (const [id, stateObj] of Object.entries(this.hass.states)) {
      if (id.includes(prefix) && oldHass.states[id] !== stateObj) return true;
    }
    return false;
  }

  private _entity(domain: string, suffix: string) {
    const prefix = this._getPrefix();
    if (!prefix) return undefined;
    return this.hass.states[`${domain}.${prefix}_${suffix}`];
  }

  private _state(suffix: string): string | null {
    const prefix = this._getPrefix();
    if (!prefix) return null;
    for (const d of ["sensor", "button", "select", "number", "switch"]) {
      const e = this.hass.states[`${d}.${prefix}_${suffix}`];
      if (e) return e.state;
    }
    return null;
  }

  // ── Recipe helpers ──

  private _recipeEntity() {
    return this._entity("select", "recipe");
  }

  private _recipeOptions(): string[] {
    return this._recipeEntity()?.attributes?.options || [];
  }

  private _selectedRecipe(): string | null {
    const s = this._recipeEntity()?.state;
    return s && s !== "unknown" && s !== "unavailable" ? s : null;
  }

  private _selectRecipe(option: string): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("select", "select_option", {
      entity_id: `select.${prefix}_recipe`, option,
    });
  }

  // ── Profile helpers ──

  private _profileEntity() {
    return this._entity("select", "profile");
  }

  private _profileOptions(): string[] {
    return this._profileEntity()?.attributes?.options || [];
  }

  private _selectedProfile(): string | null {
    const s = this._profileEntity()?.state;
    return s && s !== "unknown" && s !== "unavailable" ? s : null;
  }

  private _selectProfile(option: string): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("select", "select_option", {
      entity_id: `select.${prefix}_profile`, option,
    });
  }

  // ── Actions ──

  private _brew(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("button", "press", { entity_id: `button.${prefix}_brew` });
  }

  private _brewFreestyle(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("melitta_barista", "brew_freestyle", {
      entity_id: `button.${prefix}_brew`,
      name: this._fsName,
      process1: this._fsProcess1,
      intensity1: this._fsIntensity1,
      portion1_ml: this._fsPortion1,
      temperature1: this._fsTemp1,
      shots1: this._fsShots1,
      process2: this._fsProcess2,
      intensity2: this._fsIntensity2,
      portion2_ml: this._fsPortion2,
      temperature2: this._fsTemp2,
      shots2: this._fsShots2,
    });
  }

  private _toggleSwitch(key: string, turnOn: boolean): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("switch", turnOn ? "turn_on" : "turn_off", {
      entity_id: `switch.${prefix}_${key}`,
    });
  }

  // ── Render ──

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const prefix = this._getPrefix();
    if (!prefix) {
      return html`<ha-card>
        <div class="no-device">
          <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
          <p>No Melitta Barista device found.</p>
          <p class="hint">Make sure the integration is installed and configured.</p>
        </div>
      </ha-card>`;
    }

    const machineState = this._state("state") || "unavailable";
    const activity = this._state("activity") || "Idle";
    const progress = this._state("progress");
    const actionRequired = this._state("action_required");
    const connection = this._state("connection") || "Disconnected";

    const isConnected = connection === "Connected";
    const isUnavailable = machineState === "unavailable" || machineState === "unknown";
    const isBrewing = machineState === "Brewing";
    const isReady = machineState === "Ready";
    const hasAction = !!actionRequired && actionRequired !== "None" && actionRequired !== "unknown";
    const hasProgress = !!progress && progress !== "unknown" && progress !== "None";
    const progressNum = hasProgress ? Math.max(0, Math.min(100, parseFloat(progress!) || 0)) : 0;
    const stateColor = STATE_COLORS[machineState.toLowerCase()] || "var(--primary-text-color)";
    const cardName = this._config.name || "Melitta Barista";

    if (isUnavailable) {
      return html`<ha-card>
        <div class="card-header">
          <span class="machine-name">${cardName}</span>
          <div class="connection-dot" style="background: var(--mbc-error)"></div>
        </div>
        <div class="offline-section">
          <ha-icon icon="mdi:bluetooth-off"></ha-icon>
          <span>Machine offline</span>
        </div>
      </ha-card>`;
    }

    return html`<ha-card>
      <div class="card-header">
        <span class="machine-name">${cardName}</span>
        <div class="connection-dot" style="background: ${isConnected ? "var(--mbc-success)" : "var(--mbc-error)"}"></div>
      </div>

      <div class="status-section">
        <div class="state-row">
          <span class="state-badge" style="background: ${stateColor}18; color: ${stateColor}">
            ${machineState}
          </span>
          ${isBrewing ? html`<span class="activity-text">${activity}</span>` : nothing}
        </div>
        ${hasProgress ? html`
          <div class="progress-container">
            <div class="progress-fill" style="width: ${progressNum}%; background: ${stateColor}"></div>
          </div>
        ` : nothing}
      </div>

      ${hasAction ? html`
        <div class="action-alert">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <span>${actionRequired}</span>
        </div>
      ` : nothing}

      ${isBrewing ? html`
        <div class="cancel-row">
          <button class="cancel-btn" @click=${() => this.hass.callService("button", "press", { entity_id: `button.${prefix}_cancel` })}>
            Cancel
          </button>
        </div>
      ` : nothing}

      ${this._config.show_profiles && isReady && this._profileOptions().length > 1
        ? this._renderProfile()
        : nothing}

      ${this._config.show_recipes && isReady && this._recipeOptions().length > 0
        ? this._renderRecipes()
        : nothing}

      ${this._config.show_freestyle && isReady
        ? this._renderFreestyle()
        : nothing}

      ${this._config.show_settings
        ? this._renderSettings()
        : nothing}
    </ha-card>`;
  }

  // ── Profile ──

  private _renderProfile() {
    const options = this._profileOptions();
    const selected = this._selectedProfile();
    return html`
      <div class="section-title">Profile</div>
      <div class="profile-row">
        <ha-icon icon="mdi:account-circle"></ha-icon>
        <select class="profile-select" .value=${selected || ""}
          @change=${(e: Event) => this._selectProfile((e.target as HTMLSelectElement).value)}>
          ${options.map(o => html`<option value=${o} ?selected=${o === selected}>${o}</option>`)}
        </select>
      </div>
    `;
  }

  // ── Recipes ──

  private _renderRecipes() {
    const options = this._recipeOptions();
    const selected = this._selectedRecipe();
    return html`
      <div class="section-title">Recipe</div>
      <div class="recipe-grid">
        ${options.map((name) => {
          const uid = name.replace(/[^a-zA-Z0-9]/g, "");
          return html`
            <div class="recipe-card"
              ?data-selected=${name === selected}
              @click=${() => this._selectRecipe(name)}>
              ${coffeeIconSvg(name, 48, `r-${uid}`)}
              <span class="recipe-name">${name}</span>
            </div>
          `;
        })}
      </div>
      <div class="brew-row">
        <button class="brew-btn" ?disabled=${!selected} @click=${() => this._brew()}>
          <ha-icon icon="mdi:coffee"></ha-icon>
          Brew ${selected || ""}
        </button>
      </div>
    `;
  }

  // ── Freestyle ──

  private _renderSegment(
    label: string,
    options: readonly string[],
    value: string,
    onChange: (v: string) => void,
    disabled = false,
  ) {
    return html`
      <div class="segment-picker ${disabled ? "freestyle-disabled" : ""}">
        <span class="segment-label">${label}</span>
        <div class="segment-options">
          ${options.map(o => html`
            <button class="segment-opt" ?data-active=${o === value}
              @click=${() => onChange(o)}>${displayName(o)}</button>
          `)}
        </div>
      </div>
    `;
  }

  private _renderPortion(
    label: string, value: number, min: number, max: number, step: number,
    onChange: (v: number) => void, disabled = false,
  ) {
    return html`
      <div class="portion-row ${disabled ? "freestyle-disabled" : ""}">
        <div class="portion-header">
          <span class="portion-label">${label}</span>
          <span class="portion-value">${value} ml</span>
        </div>
        <input type="range" class="portion-slider"
          min=${min} max=${max} step=${step} .value=${String(value)}
          @input=${(e: Event) => onChange(parseInt((e.target as HTMLInputElement).value) || 0)} />
      </div>
    `;
  }

  private _renderFreestyle() {
    const p1Coffee = this._fsProcess1 === "coffee";
    const p2None = this._fsProcess2 === "none";
    const p2Coffee = this._fsProcess2 === "coffee";

    return html`
      <div class="section-title">Freestyle</div>
      <div class="freestyle-section">
        <div class="freestyle-name-row">
          <input class="freestyle-name-input" type="text" placeholder="Drink name"
            .value=${this._fsName}
            @input=${(e: Event) => { this._fsName = (e.target as HTMLInputElement).value; }} />
        </div>

        <div class="freestyle-components">
          <div class="freestyle-component">
            <div class="component-title">Component 1</div>
            ${this._renderSegment("Process", FREESTYLE_PROCESSES, this._fsProcess1,
              (v) => { this._fsProcess1 = v; })}
            ${this._renderPortion("Portion", this._fsPortion1, 5, 250, 5,
              (v) => { this._fsPortion1 = v; })}
            ${this._renderSegment("Intensity", FREESTYLE_INTENSITIES, this._fsIntensity1,
              (v) => { this._fsIntensity1 = v; }, !p1Coffee)}
            ${this._renderSegment("Temp", FREESTYLE_TEMPERATURES, this._fsTemp1,
              (v) => { this._fsTemp1 = v; })}
            ${this._renderSegment("Shots", FREESTYLE_SHOTS, this._fsShots1,
              (v) => { this._fsShots1 = v; }, !p1Coffee)}
          </div>

          <div class="freestyle-component">
            <div class="component-title">Component 2</div>
            ${this._renderSegment("Process", FREESTYLE_PROCESSES_WITH_NONE, this._fsProcess2,
              (v) => { this._fsProcess2 = v; })}
            ${this._renderPortion("Portion", this._fsPortion2, 0, 250, 5,
              (v) => { this._fsPortion2 = v; }, p2None)}
            ${this._renderSegment("Intensity", FREESTYLE_INTENSITIES, this._fsIntensity2,
              (v) => { this._fsIntensity2 = v; }, !p2Coffee)}
            ${this._renderSegment("Temp", FREESTYLE_TEMPERATURES, this._fsTemp2,
              (v) => { this._fsTemp2 = v; }, p2None)}
            ${this._renderSegment("Shots", FREESTYLE_SHOTS, this._fsShots2,
              (v) => { this._fsShots2 = v; }, !p2Coffee)}
          </div>
        </div>

        <div class="freestyle-brew-row">
          <button class="brew-btn" @click=${() => this._brewFreestyle()}>
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            Brew ${this._fsName}
          </button>
        </div>
      </div>
    `;
  }

  // ── Settings ──

  private _renderSettings() {
    const prefix = this._getPrefix();
    if (!prefix) return nothing;

    const switchCards = SWITCH_KEYS.map((key) => {
      const entity = this.hass.states[`switch.${prefix}_${key}`];
      if (!entity) return nothing;
      const isOn = entity.state === "on";
      const meta = SWITCH_META[key];
      return html`
        <div class="setting-card">
          <ha-icon class="setting-icon" icon="${meta.icon}"></ha-icon>
          <div class="setting-info">
            <div class="setting-label">${meta.label}</div>
            <div class="setting-desc">${meta.desc}</div>
          </div>
          <button class="toggle-track" ?data-on=${isOn}
            @click=${() => this._toggleSwitch(key, !isOn)}>
            <span class="toggle-thumb"></span>
          </button>
        </div>
      `;
    });

    const numberCards = NUMBER_KEYS.map((key) => {
      const entity = this.hass.states[`number.${prefix}_${key}`];
      if (!entity) return nothing;
      const meta = NUMBER_META[key];
      const val = parseFloat(entity.state) || 0;
      let display: string;
      if (meta.format === "level") {
        display = LEVEL_LABELS[key]?.[val] ?? String(val);
      } else {
        display = `${val} min`;
      }
      return html`
        <div class="setting-card">
          <ha-icon class="setting-icon" icon="${meta.icon}"></ha-icon>
          <div class="setting-info">
            <div class="setting-label">${meta.label}</div>
            <div class="setting-desc">${meta.desc}</div>
          </div>
          <span class="setting-value">${display}</span>
        </div>
      `;
    });

    if (switchCards.every(c => c === nothing) && numberCards.every(c => c === nothing)) {
      return nothing;
    }

    return html`
      <div class="section-title">Settings</div>
      <div class="settings-grid">
        ${switchCards}
        ${numberCards}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return cardStyles;
  }
}

// Register in card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "melitta-barista-card",
  name: "Melitta Barista Card",
  description: "Premium control card for Melitta Barista coffee machines",
  preview: true,
  documentationURL: "https://github.com/dzerik/melitta-barista-card",
});

console.info(
  `%c MELITTA-BARISTA-CARD %c v${CARD_VERSION} `,
  "color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;",
  "color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;",
);
