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
  FREESTYLE_AROMAS,
  FREESTYLE_TEMPERATURES,
  FREESTYLE_SHOTS,
  DIRECTKEY_CATEGORIES,
  DK_LABELS,
  DIRECTKEY_DISPLAY_TO_KEY,
  CLEANING_ACTIONS,
  FILTER_ACTIONS,
  OTHER_ACTIONS,
  type DirectKeyCategory,
  type DirectKeyRecipe,
  type DirectKeyData,
  type MaintenanceAction,
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
  standard: "Std", intense: "Int+",
};

const INTENSITY_DOTS: Record<string, number> = {
  very_mild: 1, mild: 2, medium: 3, strong: 4, very_strong: 5,
};

const SHOTS_TO_STRING: Record<number, string> = { 0: "none", 1: "one", 2: "two", 3: "three" };

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
  @state() private _fsAroma1 = "standard";
  @state() private _fsPortion1 = 40;
  @state() private _fsTemp1 = "normal";
  @state() private _fsShots1 = "one";
  @state() private _fsProcess2 = "none";
  @state() private _fsIntensity2 = "medium";
  @state() private _fsAroma2 = "standard";
  @state() private _fsPortion2 = 0;
  @state() private _fsTemp2 = "normal";
  @state() private _fsShots2 = "none";

  // DirectKey state
  @state() private _selectedDk: DirectKeyCategory | null = null;
  @state() private _twoCups = false;
  // Recipe edit dialog
  @state() private _editDk: { category: DirectKeyCategory; recipe: DirectKeyRecipe } | null = null;
  @state() private _editState: Record<string, string | number> | null = null;
  @state() private _editSaving = false;

  // Maintenance
  @state() private _confirmKey: string | null = null;
  @state() private _busyKey: string | null = null;

  // Long press
  private _dkLongPressTimer: ReturnType<typeof setTimeout> | null = null;
  private _dkLongPressTriggered = false;

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
      show_header: config.show_header !== false,
      show_status: config.show_status !== false,
      show_recipes: config.show_recipes !== false,
      show_profiles: config.show_profiles !== false,
      show_freestyle: config.show_freestyle || false,
      show_settings: config.show_settings || false,
      show_stats: config.show_stats || false,
      show_maintenance: config.show_maintenance || false,
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
    for (const key of changedProps.keys()) {
      if (typeof key === "string" && (key.startsWith("_fs") || key.startsWith("_selected") ||
          key.startsWith("_two") || key.startsWith("_edit") ||
          key.startsWith("_confirm") || key.startsWith("_busy"))) return true;
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

  // -- Recipe helpers --

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
    this._selectedDk = null;
    this.hass.callService("select", "select_option", {
      entity_id: `select.${prefix}_recipe`, option,
    });
  }

  // -- Profile helpers --

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

  // -- DirectKey helpers --

  private _getDirectKeyData(): DirectKeyData | null {
    const profileEntity = this._profileEntity();
    if (!profileEntity?.attributes) return null;
    const rawDk = profileEntity.attributes.directkey_recipes as
      Record<number, Record<string, DirectKeyRecipe>> | undefined;
    const activeProfile = (profileEntity.attributes.active_profile as number) ?? 0;
    if (!rawDk) return null;
    const profiles: DirectKeyData["profiles"] = {};
    for (const [pidStr, categories] of Object.entries(rawDk)) {
      const pid = Number(pidStr);
      profiles[pid] = {};
      for (const [dName, recipe] of Object.entries(categories as Record<string, DirectKeyRecipe>)) {
        const key = DIRECTKEY_DISPLAY_TO_KEY[dName] || dName;
        profiles[pid][key] = recipe;
      }
    }
    return { activeProfile, profiles };
  }

  // -- Actions --

  private _brew(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("button", "press", { entity_id: `button.${prefix}_brew` });
  }

  private _brewDirectkey(category: DirectKeyCategory): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("melitta_barista", "brew_directkey", {
      entity_id: `button.${prefix}_brew`,
      category,
      two_cups: this._twoCups,
    });
  }

  private _brewFreestyle(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("melitta_barista", "brew_freestyle", {
      entity_id: `button.${prefix}_brew`,
      name: this._fsName,
      process1: this._fsProcess1,
      intensity1: this._fsIntensity1,
      aroma1: this._fsAroma1,
      portion1_ml: this._fsPortion1,
      temperature1: this._fsTemp1,
      shots1: this._fsShots1,
      process2: this._fsProcess2,
      intensity2: this._fsIntensity2,
      aroma2: this._fsAroma2,
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

  private _saveDirectkey(): void {
    if (!this._editDk || !this._editState) return;
    const prefix = this._getPrefix();
    if (!prefix) return;
    this._editSaving = true;
    const dk = this._getDirectKeyData();
    this.hass.callService("melitta_barista", "save_directkey", {
      entity_id: `button.${prefix}_brew`,
      category: this._editDk.category,
      profile_id: dk?.activeProfile ?? 0,
      process1: this._editState.process1,
      intensity1: this._editState.intensity1,
      aroma1: this._editState.aroma1,
      portion1_ml: this._editState.portion1,
      temperature1: this._editState.temperature1,
      shots1: this._editState.shots1,
      process2: this._editState.process2,
      intensity2: this._editState.intensity2,
      aroma2: this._editState.aroma2,
      portion2_ml: this._editState.portion2,
      temperature2: this._editState.temperature2,
      shots2: this._editState.shots2,
    }).then(() => {
      this._editDk = null;
      this._editState = null;
      this._editSaving = false;
    }).catch(() => {
      this._editSaving = false;
    });
  }

  private _pressMaintenanceButton(action: MaintenanceAction): void {
    if (action.confirm && this._confirmKey !== action.key) {
      this._confirmKey = action.key;
      return;
    }
    this._confirmKey = null;
    this._busyKey = action.key;
    const prefix = this._getPrefix();
    if (!prefix) return;
    this.hass.callService("button", "press", {
      entity_id: `button.${prefix}_${action.suffix}`,
    }).finally(() => {
      setTimeout(() => { this._busyKey = null; }, 2000);
    });
  }

  // -- DK long press / click --

  private _startDkLongPress(cat: DirectKeyCategory, recipe: DirectKeyRecipe): void {
    this._dkLongPressTriggered = false;
    this._dkLongPressTimer = setTimeout(() => {
      this._dkLongPressTriggered = true;
      this._openEditDialog(cat, recipe);
    }, 500);
  }

  private _cancelDkLongPress(): void {
    if (this._dkLongPressTimer) {
      clearTimeout(this._dkLongPressTimer);
      this._dkLongPressTimer = null;
    }
  }

  private _handleDkClick(cat: DirectKeyCategory): void {
    if (this._dkLongPressTriggered) return;
    if (this._selectedDk === cat) {
      this._brewDirectkey(cat);
    } else {
      this._selectedDk = cat;
    }
  }

  private _openEditDialog(cat: DirectKeyCategory, recipe: DirectKeyRecipe): void {
    this._editDk = { category: cat, recipe };
    this._editState = {
      process1: recipe.c1_process || "coffee",
      intensity1: recipe.c1_intensity || "medium",
      aroma1: recipe.c1_aroma || "standard",
      temperature1: recipe.c1_temperature || "normal",
      shots1: SHOTS_TO_STRING[recipe.c1_shots] || "one",
      portion1: recipe.c1_portion_ml || 40,
      process2: recipe.c2_process || "none",
      intensity2: recipe.c2_intensity || "medium",
      aroma2: recipe.c2_aroma || "standard",
      temperature2: recipe.c2_temperature || "normal",
      shots2: SHOTS_TO_STRING[recipe.c2_shots] || "none",
      portion2: recipe.c2_portion_ml || 0,
    };
    this._editSaving = false;
  }

  // -- Render --

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

    const showHeader = this._config.show_header;
    const showStatus = this._config.show_status;

    if (isUnavailable) {
      return html`<ha-card>
        ${showHeader ? html`
          <div class="card-header">
            <span class="machine-name">${cardName}</span>
            <div class="connection-dot" style="background: var(--mbc-error)"></div>
          </div>
        ` : nothing}
        <div class="offline-section">
          <ha-icon icon="mdi:bluetooth-off"></ha-icon>
          <span>Machine offline</span>
        </div>
      </ha-card>`;
    }

    return html`<ha-card>
      ${showHeader ? html`
        <div class="card-header">
          <span class="machine-name">${cardName}</span>
          <div class="connection-dot" style="background: ${isConnected ? "var(--mbc-success)" : "var(--mbc-error)"}"></div>
        </div>
      ` : nothing}

      ${showStatus && !isBrewing ? html`
        <div class="status-section">
          <div class="state-row">
            <span class="state-badge" style="background: ${stateColor}18; color: ${stateColor}">
              ${machineState}
            </span>
          </div>
        </div>

        ${hasAction ? html`
          <div class="action-alert">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span>${actionRequired}</span>
          </div>
        ` : nothing}
      ` : nothing}

      ${isBrewing ? html`
        <div class="brewing-view">
          <div class="brewing-icon-wrap">
            ${coffeeIconSvg(this._selectedRecipe() || "Espresso", 64, "brew-active")}
          </div>
          <div class="brewing-info">
            <span class="brewing-recipe">${this._selectedRecipe() || "Brewing"}</span>
            <span class="brewing-activity">${activity}</span>
            ${hasProgress ? html`
              <div class="brewing-progress">
                <div class="brewing-progress-fill" style="width: ${progressNum}%"></div>
              </div>
              <span class="brewing-percent">${Math.round(progressNum)}%</span>
            ` : nothing}
          </div>
          <button class="brewing-cancel" @click=${() => this.hass.callService("button", "press", { entity_id: `button.${prefix}_cancel` })}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      ` : nothing}

      ${!isBrewing && this._config.show_profiles && isReady && this._profileOptions().length > 1
        ? this._renderProfileTabs()
        : nothing}

      ${!isBrewing && isReady
        ? this._renderDirectKey()
        : nothing}

      ${!isBrewing && this._config.show_recipes && this._recipeOptions().length > 0
        ? this._renderRecipes()
        : nothing}

      ${!isBrewing && this._config.show_freestyle && isReady
        ? this._renderFreestyle()
        : nothing}

      ${this._config.show_stats
        ? this._renderStats()
        : nothing}

      ${this._config.show_maintenance
        ? this._renderMaintenance()
        : nothing}

      ${this._config.show_settings
        ? this._renderSettings()
        : nothing}

      ${this._editDk ? this._renderEditDialog() : nothing}
    </ha-card>`;
  }

  // -- Profile Tab Bar --

  private _renderProfileTabs() {
    const options = this._profileOptions();
    const selected = this._selectedProfile();
    return html`
      <div class="profile-tabs">
        ${options.map(o => html`
          <button class="profile-tab" ?data-active=${o === selected}
            @click=${() => { if (o !== selected) this._selectProfile(o); }}>
            ${o}
            ${o === selected ? html`<span class="profile-tab-indicator"></span>` : nothing}
          </button>
        `)}
      </div>
    `;
  }

  // -- DirectKey Grid --

  private _renderDirectKey() {
    const dk = this._getDirectKeyData();
    if (!dk) return nothing;
    const activeRecipes = dk.profiles[dk.activeProfile] ?? {};
    if (Object.keys(activeRecipes).length === 0) return nothing;

    return html`
      <div class="dk-grid">
        ${DIRECTKEY_CATEGORIES.map(cat => {
          const recipe = activeRecipes[cat];
          if (!recipe) return nothing;
          const isSelected = this._selectedDk === cat;
          const hasDetails = recipe.c1_process !== undefined && recipe.c1_process !== "none";
          return html`
            <button class="dk-card" ?data-selected=${isSelected}
              @click=${() => this._handleDkClick(cat)}
              @dblclick=${() => this._openEditDialog(cat, recipe)}
              @pointerdown=${() => this._startDkLongPress(cat, recipe)}
              @pointerup=${() => this._cancelDkLongPress()}
              @pointerleave=${() => this._cancelDkLongPress()}
              @contextmenu=${(e: Event) => e.preventDefault()}>
              <div style="${isSelected && hasDetails ? "opacity: 0.15" : ""}">
                ${coffeeIconSvg(DK_LABELS[cat], 48, `dk-${cat}`)}
              </div>
              ${isSelected && hasDetails ? html`
                <div class="dk-card-overlay">
                  ${this._renderDkRecipeInfo(recipe)}
                </div>
              ` : nothing}
              <span class="dk-card-label">
                ${isSelected ? `Brew ${DK_LABELS[cat]}` : DK_LABELS[cat]}
              </span>
            </button>
          `;
        })}

        <!-- 2x toggle -->
        <button class="dk-card" ?data-selected=${this._twoCups}
          @click=${() => { this._twoCups = !this._twoCups; }}>
          <div style="display:flex;align-items:center;justify-content:center;width:48px;height:55px;font-size:1.6em;font-weight:700;color:var(--mbc-text);opacity:${this._twoCups ? "1" : "0.35"}">
            2x
          </div>
          <span class="dk-card-label">${this._twoCups ? "2x ON" : "2x"}</span>
        </button>

      </div>
    `;
  }

  private _renderDkRecipeInfo(recipe: DirectKeyRecipe) {
    const components: { process: string; intensity: string; ml: number }[] = [];
    if (recipe.c1_process && recipe.c1_process !== "none") {
      components.push({ process: recipe.c1_process, intensity: recipe.c1_intensity, ml: recipe.c1_portion_ml });
    }
    if (recipe.c2_process && recipe.c2_process !== "none") {
      components.push({ process: recipe.c2_process, intensity: recipe.c2_intensity, ml: recipe.c2_portion_ml });
    }
    if (components.length === 0) return nothing;

    return html`
      <div class="dk-recipe-info">
        ${components.map(c => html`
          <div class="dk-recipe-row">
            <span class="dk-recipe-ml">${c.ml}<span class="dk-recipe-ml-unit">ml</span></span>
            ${c.process === "coffee" ? html`
              <span class="intensity-dots">
                ${[1, 2, 3, 4, 5].map(n => html`
                  <span class="intensity-dot" style="background:${n <= (INTENSITY_DOTS[c.intensity] || 3) ? "var(--mbc-text)" : "rgba(255,255,255,0.2)"}"></span>
                `)}
              </span>
            ` : nothing}
          </div>
        `)}
      </div>
    `;
  }

  // -- Recipes --

  private _renderRecipes() {
    const options = this._recipeOptions();
    const selected = this._selectedRecipe();
    const dk = this._getDirectKeyData();
    const hasDk = dk && Object.keys(dk.profiles[dk.activeProfile] ?? {}).length > 0;

    return html`
      ${hasDk ? html`
        <div class="recipes-divider">
          <span class="recipes-divider-line"></span>
          <span class="recipes-divider-text">All Recipes</span>
          <span class="recipes-divider-line"></span>
        </div>
      ` : html`<div class="section-title">Recipe</div>`}
      <div class="recipe-grid">
        ${options.map((name) => {
          const uid = name.replace(/[^a-zA-Z0-9]/g, "");
          return html`
            <div class="recipe-card"
              ?data-selected=${name === selected && !this._selectedDk}
              @click=${() => {
                if (name === selected && !this._selectedDk) {
                  this._brew();
                } else {
                  this._selectRecipe(name);
                }
              }}>
              ${coffeeIconSvg(name, 48, `r-${uid}`)}
              <span class="recipe-name">${name}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  // -- Freestyle --

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
            ${this._renderSegment("Aroma", FREESTYLE_AROMAS, this._fsAroma1,
              (v) => { this._fsAroma1 = v; }, !p1Coffee)}
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
            ${this._renderSegment("Aroma", FREESTYLE_AROMAS, this._fsAroma2,
              (v) => { this._fsAroma2 = v; }, !p2Coffee)}
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

  // -- Stats --

  private _renderStats() {
    const entity = this._entity("sensor", "total_cups");
    const total = entity?.state ? parseInt(entity.state, 10) : null;

    if (total === null || isNaN(total)) {
      return html`
        <div class="section-title">Stats</div>
        <div class="stats-unavailable">Cup statistics not available.</div>
      `;
    }

    const attrs = entity!.attributes || {};
    const counters: { name: string; count: number }[] = [];
    for (const [name, val] of Object.entries(attrs)) {
      if (typeof val === "number" && !["friendly_name", "unit_of_measurement", "state_class", "icon"].includes(name)) {
        counters.push({ name, count: val });
      }
    }
    counters.sort((a, b) => b.count - a.count);

    return html`
      <div class="section-title">Stats</div>
      <div class="stats-section">
        <div class="stats-total">
          <span class="stats-total-number">${total.toLocaleString()}</span>
          <span class="stats-total-label">Total Cups</span>
        </div>
        ${counters.length > 0 ? html`
          <div class="stats-grid">
            ${counters.map(({ name, count }, i) => html`
              <div class="stats-card" ?data-top=${i === 0}>
                ${coffeeIconSvg(name, 40, `stat-${name.replace(/[^a-zA-Z0-9]/g, "")}`)}
                <span class="stats-recipe-name">${name}</span>
                <span class="stats-recipe-count">${count}</span>
              </div>
            `)}
          </div>
        ` : html`<div class="stats-empty">No cups brewed yet</div>`}
      </div>
    `;
  }

  // -- Maintenance --

  private _renderMaintenance() {
    const prefix = this._getPrefix();
    if (!prefix) return nothing;

    const machineState = this._state("state") || "unknown";
    const connection = this._state("connection") || "Disconnected";
    const isConnected = connection === "Connected";
    const isReady = machineState === "Ready";

    const renderGroup = (title: string, actions: MaintenanceAction[]) => {
      const cards = actions.map(action => {
        const entity = this.hass.states[`button.${prefix}_${action.suffix}`];
        if (!entity) return nothing;
        const isConfirming = this._confirmKey === action.key;
        const isBusy = this._busyKey === action.key;
        const disabled = !isConnected || !isReady || isBusy;
        return html`
          <div class="maint-card" ?data-confirming=${isConfirming}>
            <ha-icon class="maint-icon" icon="${action.icon}"></ha-icon>
            <div class="maint-info">
              <div class="maint-label">${action.label}</div>
              <div class="maint-desc">${action.desc}</div>
            </div>
            <button class="maint-btn" ?data-confirm=${isConfirming} ?disabled=${disabled}
              @click=${() => this._pressMaintenanceButton(action)}>
              ${isBusy ? "..." : isConfirming ? "Confirm" : "Start"}
            </button>
          </div>
        `;
      }).filter(c => c !== nothing);
      if (cards.length === 0) return nothing;
      return html`
        <div class="maint-group-title">${title}</div>
        <div class="maint-grid">${cards}</div>
      `;
    };

    return html`
      <div class="section-title">Maintenance</div>
      <div class="maint-section" @click=${() => { if (this._confirmKey) this._confirmKey = null; }}>
        ${renderGroup("Cleaning & Descaling", CLEANING_ACTIONS)}
        ${renderGroup("Water Filter", FILTER_ACTIONS)}
        ${renderGroup("Other", OTHER_ACTIONS)}
      </div>
    `;
  }

  // -- Settings --

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

  // -- Recipe Edit Dialog --

  private _renderEditDialog() {
    if (!this._editDk || !this._editState) return nothing;
    const s = this._editState;
    const cat = this._editDk.category;
    const p1Coffee = s.process1 === "coffee";
    const p2None = s.process2 === "none";
    const p2Coffee = s.process2 === "coffee";

    const updateEdit = (key: string, value: string | number) => {
      this._editState = { ...this._editState!, [key]: value };
    };

    return html`
      <div class="edit-overlay" @click=${() => { this._editDk = null; this._editState = null; }}>
        <div class="edit-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="edit-header">
            <span class="edit-title">Edit: ${DK_LABELS[cat]}</span>
            <button class="edit-close" @click=${() => { this._editDk = null; this._editState = null; }}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="edit-body">
            <div class="edit-component">
              <div class="component-title">Component 1</div>
              ${this._renderSegment("Process", FREESTYLE_PROCESSES, s.process1 as string,
                (v) => updateEdit("process1", v))}
              ${this._renderPortion("Portion", s.portion1 as number, 5, 250, 5,
                (v) => updateEdit("portion1", v))}
              ${this._renderSegment("Intensity", FREESTYLE_INTENSITIES, s.intensity1 as string,
                (v) => updateEdit("intensity1", v), !p1Coffee)}
              ${this._renderSegment("Aroma", FREESTYLE_AROMAS, s.aroma1 as string,
                (v) => updateEdit("aroma1", v), !p1Coffee)}
              ${this._renderSegment("Temperature", FREESTYLE_TEMPERATURES, s.temperature1 as string,
                (v) => updateEdit("temperature1", v))}
              ${this._renderSegment("Shots", FREESTYLE_SHOTS, s.shots1 as string,
                (v) => updateEdit("shots1", v), !p1Coffee)}
            </div>
            <div class="edit-component">
              <div class="component-title">Component 2</div>
              ${this._renderSegment("Process", FREESTYLE_PROCESSES_WITH_NONE, s.process2 as string,
                (v) => updateEdit("process2", v))}
              ${this._renderPortion("Portion", s.portion2 as number, 0, 250, 5,
                (v) => updateEdit("portion2", v), p2None)}
              ${this._renderSegment("Intensity", FREESTYLE_INTENSITIES, s.intensity2 as string,
                (v) => updateEdit("intensity2", v), !p2Coffee)}
              ${this._renderSegment("Aroma", FREESTYLE_AROMAS, s.aroma2 as string,
                (v) => updateEdit("aroma2", v), !p2Coffee)}
              ${this._renderSegment("Temperature", FREESTYLE_TEMPERATURES, s.temperature2 as string,
                (v) => updateEdit("temperature2", v), p2None)}
              ${this._renderSegment("Shots", FREESTYLE_SHOTS, s.shots2 as string,
                (v) => updateEdit("shots2", v), !p2Coffee)}
            </div>
          </div>
          <div class="edit-footer">
            <button class="edit-btn-cancel" @click=${() => { this._editDk = null; this._editState = null; }}>
              Cancel
            </button>
            <button class="edit-btn-save" ?disabled=${this._editSaving} @click=${() => this._saveDirectkey()}>
              ${this._editSaving ? "..." : "Save"}
            </button>
          </div>
        </div>
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
