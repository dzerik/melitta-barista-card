import { LitElement, html, nothing, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import {
  CARD_VERSION,
  SWITCH_KEYS,
  NUMBER_KEYS,
  DK_LABELS,
  CLEANING_ACTIONS,
  FILTER_ACTIONS,
  OTHER_ACTIONS,
  LONG_PRESS_MS,
  MAINT_BUSY_RESET_MS,
  SOM_FAVORITES_LIMIT,
  type DirectKeyCategory,
} from "./const";
import type {
  MelittaCardConfig,
  DirectKeyRecipe,
  DirectKeyData,
  MaintenanceAction,
  SommelierFavorite,
  SommelierHoppers,
  SommelierQuickRecipe,
} from "./types";
import {
  defaultRecipe,
  fromDkRecipe,
  type RecipeComponents,
  type ComponentSpec,
} from "./recipe";
import { renderComponentForm } from "./sections/controls";
import {
  renderNoDevice,
  renderHeader,
  renderOfflineBody,
  renderStatus,
  renderBrewingView,
} from "./sections/status";
import { renderDirectKey } from "./sections/directkey";
import { renderRecipes, renderProfileTabs } from "./sections/recipes";
import { renderStats } from "./sections/stats";
import { renderMaintenance } from "./sections/maintenance";
import { renderSettings } from "./sections/settings";
import { computeMachineStatus, type MachineStatus } from "./machine-state";
import * as api from "./api";
import { parseDirectKeyData } from "./directkey";
import { detectMelittaDevices } from "./utils";
import { cardStyles } from "./styles";
import "./editor";

@customElement("melitta-barista-card")
export class MelittaBaristaCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: MelittaCardConfig;
  @state() private _resolvedPrefix: string | null = null;

  // Freestyle form
  @state() private _fsName = "Custom";
  @state() private _fsRecipe: RecipeComponents = defaultRecipe();

  // DirectKey state
  @state() private _selectedDk: DirectKeyCategory | null = null;
  @state() private _twoCups = false;
  // Recipe edit dialog
  @state() private _editDk: { category: DirectKeyCategory; recipe: DirectKeyRecipe } | null = null;
  @state() private _editState: RecipeComponents | null = null;
  @state() private _editSaving = false;

  // Maintenance
  @state() private _confirmKey: string | null = null;
  @state() private _busyKey: string | null = null;

  // Sommelier
  @state() private _somFavorites: SommelierFavorite[] = [];
  @state() private _somHoppers: SommelierHoppers = { hopper1: null, hopper2: null };
  @state() private _somLoaded = false;
  @state() private _somGenerating = false;
  @state() private _somQuickRecipe: SommelierQuickRecipe | null = null;

  // Long press
  private _dkLongPressTimer: ReturnType<typeof setTimeout> | null = null;
  private _dkLongPressTriggered = false;

  // Derived (non-reactive) device info
  private _detectedName: string | null = null;
  private _trackedIds: string[] = [];
  private _trackedPrefix: string | null = null;

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
    this._detectedName = null;
    this._trackedIds = [];
    this._trackedPrefix = null;
  }

  public getCardSize(): number {
    if (!this._config) return 5;
    if (this._config.compact) return 3;
    let size = 5;
    if (this._config.show_freestyle) size += 4;
    if (this._config.show_sommelier) size += 2;
    if (this._config.show_stats) size += 3;
    if (this._config.show_maintenance) size += 4;
    if (this._config.show_settings) size += 2;
    return size;
  }

  public getGridOptions() {
    return { rows: this.getCardSize(), columns: 6, min_rows: 2, min_columns: 3 };
  }

  /** Pure: never mutates state. Resolution happens in willUpdate(). */
  private _getPrefix(): string | null {
    return this._config?.entity_prefix || this._resolvedPrefix;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Any config or internal @state change always renders — no fragile
    // per-property whitelist.
    if (changedProps.size > 1 || !changedProps.has("hass")) return true;
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) return true;
    if (oldHass.locale?.language !== this.hass.locale?.language) return true;
    if (this._trackedIds.length === 0) return true;
    // Only hass changed: re-render only when one of our entities changed.
    return this._trackedIds.some(
      (id) => oldHass.states[id] !== this.hass.states[id],
    );
  }

  protected willUpdate(changedProps: PropertyValues): void {
    if (!this.hass || !this._config) return;
    // Resolve device prefix once (auto-detect when not configured).
    if (!this._config.entity_prefix && !this._resolvedPrefix && changedProps.has("hass")) {
      const devices = detectMelittaDevices(this.hass);
      if (devices.length > 0) {
        this._resolvedPrefix = devices[0].prefix;
        this._detectedName = devices[0].name;
      }
    }
    const prefix = this._getPrefix();
    if (prefix && this._trackedPrefix !== prefix) {
      this._trackedPrefix = prefix;
      this._trackedIds = this._buildTrackedIds(prefix);
    }
  }

  private _buildTrackedIds(prefix: string): string[] {
    return [
      ...["state", "activity", "progress", "action_required", "connection", "total_cups"]
        .map((s) => `sensor.${prefix}_${s}`),
      `select.${prefix}_recipe`,
      `select.${prefix}_profile`,
      ...SWITCH_KEYS.map((k) => `switch.${prefix}_${k}`),
      ...NUMBER_KEYS.map((k) => `number.${prefix}_${k}`),
      ...[...CLEANING_ACTIONS, ...FILTER_ACTIONS, ...OTHER_ACTIONS]
        .map((a) => `button.${prefix}_${a.suffix}`),
      `button.${prefix}_brew`,
      `button.${prefix}_cancel`,
    ];
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
    api.selectOption(this.hass, prefix, "recipe", option);
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
    api.selectOption(this.hass, prefix, "profile", option);
  }

  // -- DirectKey helpers --

  private _getDirectKeyData(): DirectKeyData | null {
    return parseDirectKeyData(this._profileEntity()?.attributes);
  }

  // -- Actions --

  private _brew(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    api.pressButton(this.hass, prefix, "brew");
  }

  private _cancelBrew(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    api.pressButton(this.hass, prefix, "cancel");
  }

  private _brewDirectkey(category: DirectKeyCategory): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    api.brewDirectkey(this.hass, prefix, category, this._twoCups);
  }

  private _brewFreestyle(): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    api.brewFreestyle(this.hass, prefix, this._fsName, this._fsRecipe);
  }

  private _toggleSwitch(key: string, turnOn: boolean): void {
    const prefix = this._getPrefix();
    if (!prefix) return;
    api.toggleSwitch(this.hass, prefix, key, turnOn);
  }

  private _saveDirectkey(): void {
    if (!this._editDk || !this._editState) return;
    const prefix = this._getPrefix();
    if (!prefix) return;
    this._editSaving = true;
    const dk = this._getDirectKeyData();
    api.saveDirectkey(this.hass, prefix, this._editDk.category, dk?.activeProfile ?? 0, this._editState)
      .then(() => {
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
    const prefix = this._getPrefix();
    if (!prefix) return;
    this._confirmKey = null;
    this._busyKey = action.key;
    api.pressButton(this.hass, prefix, action.suffix).finally(() => {
      setTimeout(() => { this._busyKey = null; }, MAINT_BUSY_RESET_MS);
    });
  }

  // -- DK long press / click --

  private _startDkLongPress(cat: DirectKeyCategory, recipe: DirectKeyRecipe): void {
    this._dkLongPressTriggered = false;
    this._dkLongPressTimer = setTimeout(() => {
      this._dkLongPressTriggered = true;
      this._openEditDialog(cat, recipe);
    }, LONG_PRESS_MS);
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
    this._editState = fromDkRecipe(recipe);
    this._editSaving = false;
  }

  private _closeEditDialog(): void {
    this._editDk = null;
    this._editState = null;
  }

  private _updateFs(comp: "c1" | "c2", patch: Partial<ComponentSpec>): void {
    this._fsRecipe = { ...this._fsRecipe, [comp]: { ...this._fsRecipe[comp], ...patch } };
  }

  private _updateEdit(comp: "c1" | "c2", patch: Partial<ComponentSpec>): void {
    if (!this._editState) return;
    this._editState = { ...this._editState, [comp]: { ...this._editState[comp], ...patch } };
  }

  // -- Render --

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const prefix = this._getPrefix();
    if (!prefix) {
      return html`<ha-card>${renderNoDevice()}</ha-card>`;
    }

    const st = computeMachineStatus((s) => this._state(s));
    const cardName = this._config.name || this._detectedName || "Melitta Barista";
    const showHeader = this._config.show_header;

    if (st.isUnavailable) {
      return html`<ha-card>
        ${showHeader ? renderHeader(cardName, false) : nothing}
        ${renderOfflineBody()}
      </ha-card>`;
    }

    return html`<ha-card>
      ${showHeader ? renderHeader(cardName, st.isConnected) : nothing}

      ${this._config.show_status && !st.isBrewing ? renderStatus(st) : nothing}

      ${st.isBrewing
        ? renderBrewingView(this._selectedRecipe(), st, () => this._cancelBrew())
        : nothing}

      ${!st.isBrewing && this._config.show_profiles && st.isReady && this._profileOptions().length > 1
        ? this._renderProfileTabs()
        : nothing}

      ${!st.isBrewing && st.isReady
        ? this._renderDirectKey()
        : nothing}

      ${!st.isBrewing && this._config.show_recipes && this._recipeOptions().length > 0
        ? this._renderRecipes()
        : nothing}

      ${!st.isBrewing && this._config.show_freestyle && st.isReady
        ? this._renderFreestyle()
        : nothing}

      ${this._config.show_sommelier
        ? this._renderSommelier()
        : nothing}

      ${this._config.show_stats
        ? this._renderStats()
        : nothing}

      ${this._config.show_maintenance
        ? this._renderMaintenance(st)
        : nothing}

      ${this._config.show_settings
        ? this._renderSettings()
        : nothing}

      ${this._editDk ? this._renderEditDialog() : nothing}
    </ha-card>`;
  }

  // -- Section wrappers (props glue) --

  private _renderProfileTabs() {
    return renderProfileTabs({
      options: this._profileOptions(),
      selected: this._selectedProfile(),
      onSelect: (o) => this._selectProfile(o),
    });
  }

  private _renderDirectKey() {
    const dk = this._getDirectKeyData();
    if (!dk) return nothing;
    return renderDirectKey({
      data: dk,
      selected: this._selectedDk,
      twoCups: this._twoCups,
      onCardClick: (cat) => this._handleDkClick(cat),
      onLongPressStart: (cat, recipe) => this._startDkLongPress(cat, recipe),
      onLongPressCancel: () => this._cancelDkLongPress(),
      onToggleTwoCups: () => { this._twoCups = !this._twoCups; },
    });
  }

  private _renderRecipes() {
    const dk = this._getDirectKeyData();
    const hasDk = !!dk && Object.keys(dk.profiles[dk.activeProfile] ?? {}).length > 0;
    return renderRecipes({
      options: this._recipeOptions(),
      selected: this._selectedRecipe(),
      hasDk,
      dkActive: this._selectedDk !== null,
      onSelect: (name) => this._selectRecipe(name),
      onBrew: () => this._brew(),
    });
  }

  // -- Freestyle --

  private _renderFreestyle() {
    return html`
      <div class="section-title">Freestyle</div>
      <div class="freestyle-section">
        <div class="freestyle-name-row">
          <input class="freestyle-name-input" type="text" placeholder="Drink name"
            .value=${this._fsName}
            @input=${(e: Event) => { this._fsName = (e.target as HTMLInputElement).value; }} />
        </div>

        <div class="freestyle-components">
          ${renderComponentForm({
            title: "Component 1",
            containerClass: "freestyle-component",
            spec: this._fsRecipe.c1,
            allowNoneProcess: false,
            onChange: (patch) => this._updateFs("c1", patch),
          })}
          ${renderComponentForm({
            title: "Component 2",
            containerClass: "freestyle-component",
            spec: this._fsRecipe.c2,
            allowNoneProcess: true,
            onChange: (patch) => this._updateFs("c2", patch),
          })}
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

  // -- Sommelier --

  private async _somLoadData() {
    if (this._somLoaded || !this.hass) return;
    try {
      const [favorites, hoppers] = await Promise.all([
        api.somListFavorites(this.hass),
        api.somGetHoppers(this.hass),
      ]);
      this._somFavorites = favorites.slice(0, SOM_FAVORITES_LIMIT);
      this._somHoppers = hoppers;
      this._somLoaded = true;
    } catch (e) {
      console.warn("[melitta-card] Sommelier not available:", e);
      this._somLoaded = true;
    }
  }

  private async _somSurpriseMe() {
    if (!this.hass || this._somGenerating) return;
    this._somGenerating = true;
    this._somQuickRecipe = null;
    try {
      this._somQuickRecipe = await api.somGenerateSurprise(this.hass);
    } catch (e) {
      console.error("[melitta-card] Generate failed:", e);
    } finally {
      this._somGenerating = false;
    }
  }

  private async _somBrewRecipe(recipeId: string) {
    if (!this.hass) return;
    try {
      await api.somBrew(this.hass, recipeId);
      this._somQuickRecipe = null;
    } catch (e) {
      console.error("[melitta-card] Brew failed:", e);
    }
  }

  private async _somBrewFavorite(favId: string) {
    if (!this.hass) return;
    try {
      await api.somBrewFavorite(this.hass, favId);
      // Update brew count locally
      this._somFavorites = this._somFavorites.map(f =>
        f.id === favId ? { ...f, brew_count: (f.brew_count ?? 0) + 1 } : f
      );
    } catch (e) {
      console.error("[melitta-card] Brew favorite failed:", e);
    }
  }

  private _renderSommelier() {
    if (!this._somLoaded) {
      this._somLoadData();
      return html`<div class="section-title">
        <ha-icon icon="mdi:coffee-maker-check-outline"></ha-icon> Sommelier
      </div>
      <div class="mbc-section"><span style="opacity:0.5">Loading...</span></div>`;
    }

    const h1 = this._somHoppers.hopper1?.bean;
    const h2 = this._somHoppers.hopper2?.bean;

    return html`
      <div class="section-title">
        <ha-icon icon="mdi:coffee-maker-check-outline"></ha-icon> AI Sommelier
      </div>
      <div class="mbc-section">
        ${h1 || h2 ? html`
          <div class="som-hoppers">
            ${h1 ? html`<span class="som-hopper-tag">H1: ${h1.brand} ${h1.product}</span>` : nothing}
            ${h2 ? html`<span class="som-hopper-tag">H2: ${h2.brand} ${h2.product}</span>` : nothing}
          </div>
        ` : nothing}

        ${this._somFavorites.length > 0 ? html`
          <div class="som-favorites">
            ${this._somFavorites.map(fav => html`
              <div class="som-fav-row">
                <div class="som-fav-info">
                  <span class="som-fav-name">★ ${fav.name}</span>
                  <span class="som-fav-count">${fav.brew_count}×</span>
                </div>
                <button class="som-brew-btn" @click=${() => this._somBrewFavorite(fav.id)}>
                  <ha-icon icon="mdi:coffee"></ha-icon>
                </button>
              </div>
            `)}
          </div>
        ` : nothing}

        ${this._somQuickRecipe ? html`
          <div class="som-quick-recipe">
            <div class="som-quick-name">${this._somQuickRecipe.name}</div>
            <div class="som-quick-desc">${this._somQuickRecipe.description}</div>
            <button class="som-brew-btn full" @click=${() => this._somBrewRecipe(this._somQuickRecipe!.id)}>
              <ha-icon icon="mdi:coffee"></ha-icon> Brew
            </button>
          </div>
        ` : nothing}

        <div class="som-actions">
          <button class="som-surprise-btn" @click=${() => this._somSurpriseMe()}
            ?disabled=${this._somGenerating}>
            ${this._somGenerating
              ? html`<ha-icon icon="mdi:loading" class="spin"></ha-icon> Generating...`
              : html`<ha-icon icon="mdi:auto-fix"></ha-icon> Surprise me`}
          </button>
        </div>
      </div>
    `;
  }

  private _renderStats() {
    return renderStats(this._entity("sensor", "total_cups"));
  }

  private _renderMaintenance(st: MachineStatus) {
    const prefix = this._getPrefix();
    if (!prefix) return nothing;
    return renderMaintenance({
      st,
      hasEntity: (suffix) => !!this.hass.states[`button.${prefix}_${suffix}`],
      confirmKey: this._confirmKey,
      busyKey: this._busyKey,
      onPress: (action) => this._pressMaintenanceButton(action),
      onDismissConfirm: () => { if (this._confirmKey) this._confirmKey = null; },
    });
  }

  private _renderSettings() {
    const prefix = this._getPrefix();
    if (!prefix) return nothing;
    return renderSettings({
      getEntity: (domain, key) => this.hass.states[`${domain}.${prefix}_${key}`],
      onToggle: (key, turnOn) => this._toggleSwitch(key, turnOn),
    });
  }

  // -- Recipe Edit Dialog --

  private _renderEditDialog() {
    if (!this._editDk || !this._editState) return nothing;
    const s = this._editState;
    const cat = this._editDk.category;

    return html`
      <div class="edit-overlay" @click=${() => this._closeEditDialog()}>
        <div class="edit-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="edit-header">
            <span class="edit-title">Edit: ${DK_LABELS[cat]}</span>
            <button class="edit-close" @click=${() => this._closeEditDialog()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="edit-body">
            ${renderComponentForm({
              title: "Component 1",
              containerClass: "edit-component",
              spec: s.c1,
              allowNoneProcess: false,
              temperatureLabel: "Temperature",
              onChange: (patch) => this._updateEdit("c1", patch),
            })}
            ${renderComponentForm({
              title: "Component 2",
              containerClass: "edit-component",
              spec: s.c2,
              allowNoneProcess: true,
              temperatureLabel: "Temperature",
              onChange: (patch) => this._updateEdit("c2", patch),
            })}
          </div>
          <div class="edit-footer">
            <button class="edit-btn-cancel" @click=${() => this._closeEditDialog()}>
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

// Register in card picker (guard against double-loading of the resource)
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "melitta-barista-card")) {
  window.customCards.push({
    type: "melitta-barista-card",
    name: "Melitta Barista Card",
    description: "Premium control card for Melitta Barista coffee machines",
    preview: true,
    documentationURL: "https://github.com/dzerik/melitta-barista-card",
  });
}

console.info(
  `%c MELITTA-BARISTA-CARD %c v${CARD_VERSION} `,
  "color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;",
  "color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;",
);
