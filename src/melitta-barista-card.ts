import { LitElement, html, nothing, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import {
  CARD_VERSION,
  SWITCH_KEYS,
  NUMBER_KEYS,
  CLEANING_ACTIONS,
  FILTER_ACTIONS,
  OTHER_ACTIONS,
  LONG_PRESS_MS,
  MAINT_BUSY_RESET_MS,
  type DirectKeyCategory,
} from "./const";
import type {
  MelittaCardConfig,
  DirectKeyRecipe,
  DirectKeyData,
  MaintenanceAction,
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
import {
  readBridgeAttrs,
  readStatusTokens,
  noteBridgeUpdate,
  fetchUiContract,
  type ActionEntry,
  type BridgeAttrs,
  type StatusTokens,
  type UiContract,
} from "./contract";
import {
  resolveParameters,
  contractAllowsFreestyle,
  iconSpecForRecipe,
} from "./contract-wiring";
import {
  resolveActionCatalog,
  needsConfirm,
  planActionInvocation,
} from "./action-catalog";
import {
  fetchServerStrings,
  setServerStrings,
  resetServerStrings,
  stringsVersionStale,
} from "./server-i18n";
import { buildBrandBadge } from "./brand-badge";
import { coffeeIconSvg, coffeeIconSvgFromSpec } from "./icons";
import * as api from "./api";
import { parseDirectKeyData } from "./directkey";
import { localize, setLanguage, getLanguage } from "./localize/localize";
import { detectMelittaDevices } from "./utils";
import { cardStyles } from "./styles";
import "./editor";
import "./sommelier";
import { profileOptionForSlot } from "./profile";

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

  // Long press
  private _dkLongPressTimer: ReturnType<typeof setTimeout> | null = null;
  private _dkLongPressTriggered = false;

  // Derived (non-reactive) device info
  private _detectedName: string | null = null;
  private _trackedIds: string[] = [];
  private _trackedPrefix: string | null = null;

  // UI Contract v1 (spec §2.3): bridge/tokens re-read every willUpdate (not
  // sticky), contract document session-cached inside fetchUiContract.
  @state() private _contract: UiContract | null = null;
  private _bridge: BridgeAttrs | null = null;
  private _tokens: StatusTokens | null = null;
  private _contractFetchInFlight = false;

  // Server-served display strings (spec §6.3, v2 amendment): fetched only in
  // token mode, re-fetched on the §6.3.2 triggers — first activation, HA
  // locale change, contract_fingerprint change (which rides the same
  // noteBridgeUpdate path as the contract refetch). `strings_version` is the
  // cache key inside fetchServerStrings; the fingerprint trigger completes
  // only once the refetched contract's strings_version lands (see
  // _updateServerStrings and stringsVersionStale).
  private _i18nLocale: string | null = null;
  private _i18nFingerprint: string | null = null;
  private _i18nFetchInFlight = false;
  private _serverStringsActive = false;
  /** Contract fingerprint the current _trackedIds were built against. */
  private _trackedContractFp: string | null = null;

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cancelDkLongPress();
  }

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
    this._contract = null;
    this._bridge = null;
    this._tokens = null;
    this._i18nLocale = null;
    this._i18nFingerprint = null;
    this._trackedContractFp = null;
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
    setLanguage(this.hass);
    // Resolve device prefix once (auto-detect when not configured).
    if (!this._config.entity_prefix && !this._resolvedPrefix && changedProps.has("hass")) {
      const devices = detectMelittaDevices(this.hass);
      if (devices.length > 0) {
        this._resolvedPrefix = devices[0].prefix;
        this._detectedName = devices[0].name;
      }
    }
    const prefix = this._getPrefix();
    const contractFp = this._contract?.contract_fingerprint ?? null;
    if (prefix && (this._trackedPrefix !== prefix || this._trackedContractFp !== contractFp)) {
      // Rebuilt on contract change too: catalog entries may anchor on button
      // entities outside the legacy arrays (e.g. factory_reset_settings).
      this._trackedPrefix = prefix;
      this._trackedContractFp = contractFp;
      this._trackedIds = this._buildTrackedIds(prefix);
    }
    this._updateContractBridge(prefix);
  }

  /**
   * UI Contract v1 wiring (spec §2.3): re-evaluate token-mode detection on
   * every willUpdate (never sticky — an integration upgraded mid-session is
   * picked up), feed the transient-retry hook, and keep the contract document
   * fresh. All failure handling lives inside fetchUiContract (never throws);
   * a missing/failed contract only degrades contract-derived features.
   */
  private _updateContractBridge(prefix: string | null): void {
    this._bridge = prefix
      ? readBridgeAttrs(this.hass.states[`sensor.${prefix}_connection`]?.attributes)
      : null;
    this._tokens = this._bridge && prefix
      ? readStatusTokens(this.hass.states[`sensor.${prefix}_state`]?.attributes, this._bridge)
      : null;
    if (!this._bridge) {
      // Legacy mode: no contract_version on the connection sensor (or an
      // unsupported one, §5.3.3) — never call the WS command, and clear any
      // installed server strings (§6.3: display falls back to the bundles).
      if (this._contract !== null) this._contract = null;
      if (this._serverStringsActive) {
        this._serverStringsActive = false;
        this._i18nLocale = null;
        this._i18nFingerprint = null;
        resetServerStrings();
      }
      return;
    }
    noteBridgeUpdate(this._bridge);
    this._updateServerStrings(this._bridge);
    if (this._contractFetchInFlight) return;
    const bridge = this._bridge;
    if (this._contract && this._contract.contract_fingerprint === bridge.contract_fingerprint) {
      return; // current document already matches the advertised fingerprint
    }
    this._contractFetchInFlight = true;
    fetchUiContract(this.hass, bridge.entry_id, bridge.contract_fingerprint)
      .then((contract) => {
        this._contractFetchInFlight = false;
        // @state assignment: identical reference (session cache) schedules no update.
        this._contract = contract;
      });
  }

  /**
   * Server-string lifecycle (spec §6.3.2, wired per §8.2 C-I): in token mode,
   * (re)fetch the machine-domain i18n map on first activation, HA locale
   * change, and contract_fingerprint change. fetchServerStrings owns the
   * session cache (`locale + strings_version`) and the durable-unknown_command
   * classification, so re-triggering here is cheap; a null result simply
   * clears the registry and every label falls back to the card bundles —
   * display strings only, never token semantics (§6.3.2).
   *
   * The fingerprint trigger arrives in two halves on different update passes:
   * the bridge advertises the new fingerprint while the contract refetch is
   * still in flight, so at that moment `expected` is still the OLD document's
   * strings_version and the locale cache correctly short-circuits. The
   * stringsVersionStale probe re-arms the fetch when the NEW contract document
   * lands with a different strings_version — an integration upgrade therefore
   * fetches exactly once, and never leaves stale strings for the session. A
   * transient failure of that re-fetch keeps the probe armed, so the next
   * update pass retries (still display-strings-only degradation).
   */
  private _updateServerStrings(bridge: BridgeAttrs): void {
    if (this._i18nFetchInFlight) return;
    const locale = getLanguage(this.hass);
    const fingerprint = bridge.contract_fingerprint;
    // The contract document's strings_version (when already fetched) lets a
    // matching cache entry short-circuit without a WS round-trip — and, via
    // the staleness probe, re-arms the fetch when a new document arrives.
    const expected = this._contract?.strings_version ?? null;
    if (this._serverStringsActive
        && this._i18nLocale === locale
        && this._i18nFingerprint === fingerprint
        && !stringsVersionStale(locale, expected)) {
      return; // no §6.3.2 trigger fired since the last fetch
    }
    this._i18nFetchInFlight = true;
    fetchServerStrings(this.hass, locale, expected).then((strings) => {
      this._i18nFetchInFlight = false;
      this._i18nLocale = locale;
      this._i18nFingerprint = fingerprint;
      this._serverStringsActive = true;
      setServerStrings(strings);
      // Server strings are module state, not a @state property — re-render so
      // labels pick up the freshly installed (or cleared) map.
      this.requestUpdate();
    });
  }

  private _buildTrackedIds(prefix: string): string[] {
    // Catalog-driven maintenance (spec §6.2) anchors every entry on a button
    // entity; track those too so presence changes re-render (the legacy
    // arrays below stay tracked unconditionally — permanent fixture, §6.2.5.1).
    const catalogButtonIds = (resolveActionCatalog(this._contract) ?? [])
      .flatMap((g) => g.entries.map((e) => `button.${prefix}_${e.invocation.entity_suffix}`));
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
      ...catalogButtonIds,
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

  private _selectProfile(slot: number): void {
    const prefix = this._getPrefix();
    if (!prefix) return;

    // Keep the numeric slot as identity. Profile labels can change after the
    // tab was rendered, so resolve the current HA select option only when the
    // user actually clicks.
    const option = profileOptionForSlot(this._profileOptions(), slot);
    if (option === undefined) {
      // Unreachable in normal operation (slots come from the same options
      // array) — logged to aid field debugging if entity state ever diverges.
      console.warn(`melitta-barista-card: no profile option for slot ${slot}`);
      return;
    }

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

  /**
   * Dispatch a pressed action-catalog entry (spec §6.2.1, wired per §8.2 C-I):
   * the confirm step first (`destructive` forces it, §6.2.5.4), then the
   * planned invocation — button entries through the existing pressButton path,
   * service entries through hass.callService with the plan's data (which
   * always carries the `button.<prefix>_<entity_suffix>` entity_id anchor).
   */
  private _pressCatalogAction(entry: ActionEntry): void {
    if (needsConfirm(entry) && this._confirmKey !== entry.action) {
      this._confirmKey = entry.action;
      return;
    }
    const prefix = this._getPrefix();
    if (!prefix) return;
    this._confirmKey = null;
    this._busyKey = entry.action;
    const plan = planActionInvocation(entry, prefix);
    const call = "button" in plan
      ? api.pressButton(this.hass, prefix, plan.button)
      : this.hass.callService(plan.domain, plan.service, plan.data);
    Promise.resolve(call).catch(() => undefined).finally(() => {
      setTimeout(() => { this._busyKey = null; }, MAINT_BUSY_RESET_MS);
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

    // Token mode when the bridge gate passed (§5.3.3); with tokens null (state
    // sensor unavailable = offline, §3.4) computeMachineStatus falls through
    // to the legacy branch, which renders the offline body exactly as before.
    const st = computeMachineStatus(
      (s) => this._state(s),
      this._bridge ? { tokens: this._tokens, connected: this._bridge.connected } : undefined,
    );
    const cardName = this._config.name || this._detectedName || localize("common.default_name");
    const showHeader = this._config.show_header;
    // Brand badge (UI Contract §3.10): null without a contract or brand_theme
    // (older integration) → renderHeader falls back to the legacy header.
    const brandBadge = buildBrandBadge(this._contract?.brand_theme);

    if (st.isUnavailable) {
      return html`<ha-card>
        ${showHeader ? renderHeader(cardName, false, brandBadge) : nothing}
        ${renderOfflineBody()}
      </ha-card>`;
    }

    return html`<ha-card>
      ${showHeader ? renderHeader(cardName, st.isConnected, brandBadge) : nothing}

      ${this._config.show_status && !st.isBrewing ? renderStatus(st) : nothing}

      ${st.isBrewing
        ? renderBrewingView(this._selectedRecipe(), st, () => this._cancelBrew(),
            (name, size, uid) => this._renderRecipeIcon(name, size, uid))
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
          && contractAllowsFreestyle(this._contract)
        ? this._renderFreestyle()
        : nothing}

      ${this._config.show_sommelier
        ? html`<mbc-sommelier .hass=${this.hass}></mbc-sommelier>`
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
      onSelect: (slot) => this._selectProfile(slot),
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
      renderIcon: (name, size, uid) => this._renderRecipeIcon(name, size, uid),
    });
  }

  /**
   * Per-recipe icon (UI Contract §7.2 C-D): prefer the IconSpec from the
   * `recipes` attribute of `select.<prefix>_recipe`, then the contract
   * catalog; only when neither surface knows the recipe fall back to the
   * legacy English-name DRINKS lookup. A known recipe with `icon: null`
   * renders the generic default drink (spec §3.3).
   */
  private _renderRecipeIcon(name: string, size: number, uid: string) {
    const lookup = iconSpecForRecipe(
      name, this._recipeEntity()?.attributes?.recipes, this._contract,
    );
    return lookup.found
      ? coffeeIconSvgFromSpec(lookup.icon, size, uid)
      : coffeeIconSvg(name, size, uid);
  }

  // -- Freestyle --

  private _renderFreestyle() {
    // v2 parameter catalog with the §6.1.5 three-tier fallback: contract
    // `parameters` → v1 vocabularies/limits → legacy consts, per parameter.
    const vocab = resolveParameters(this._contract);
    return html`
      <div class="section-title">${localize("freestyle.title")}</div>
      <div class="freestyle-section">
        <div class="freestyle-name-row">
          <input class="freestyle-name-input" type="text"
            placeholder=${localize("freestyle.drink_name_placeholder")}
            .value=${this._fsName}
            @input=${(e: Event) => { this._fsName = (e.target as HTMLInputElement).value; }} />
        </div>

        <div class="freestyle-components">
          ${renderComponentForm({
            title: localize("freestyle.component", { n: 1 }),
            containerClass: "freestyle-component",
            spec: this._fsRecipe.c1,
            allowNoneProcess: false,
            vocab,
            onChange: (patch) => this._updateFs("c1", patch),
          })}
          ${renderComponentForm({
            title: localize("freestyle.component", { n: 2 }),
            containerClass: "freestyle-component",
            spec: this._fsRecipe.c2,
            allowNoneProcess: true,
            vocab,
            onChange: (patch) => this._updateFs("c2", patch),
          })}
        </div>

        <div class="freestyle-brew-row">
          <button class="brew-btn" @click=${() => this._brewFreestyle()}>
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            ${localize("freestyle.brew_named", { name: this._fsName })}
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
    // Catalog mode when the contract serves `actions` (spec §6.2.5); null —
    // no contract or a 0.91 server — keeps the legacy hardcoded arrays.
    const catalog = resolveActionCatalog(this._contract);
    return renderMaintenance({
      st,
      hasEntity: (suffix) => !!this.hass.states[`button.${prefix}_${suffix}`],
      confirmKey: this._confirmKey,
      busyKey: this._busyKey,
      onPress: (action) => this._pressMaintenanceButton(action),
      onDismissConfirm: () => { if (this._confirmKey) this._confirmKey = null; },
      catalog,
      requiresCtx: this._bridge
        ? { statusTokens: this._tokens, connected: this._bridge.connected }
        : null,
      onCatalogPress: (entry) => this._pressCatalogAction(entry),
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
    const vocab = resolveParameters(this._contract);

    return html`
      <div class="edit-overlay" @click=${() => this._closeEditDialog()}>
        <div class="edit-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="edit-header">
            <span class="edit-title">
              ${localize("edit_dialog.title", { drink: localize(`drinks.${cat}`) })}
            </span>
            <button class="edit-close" @click=${() => this._closeEditDialog()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="edit-body">
            ${renderComponentForm({
              title: localize("freestyle.component", { n: 1 }),
              containerClass: "edit-component",
              spec: s.c1,
              allowNoneProcess: false,
              longTemperatureLabel: true,
              vocab,
              onChange: (patch) => this._updateEdit("c1", patch),
            })}
            ${renderComponentForm({
              title: localize("freestyle.component", { n: 2 }),
              containerClass: "edit-component",
              spec: s.c2,
              allowNoneProcess: true,
              longTemperatureLabel: true,
              vocab,
              onChange: (patch) => this._updateEdit("c2", patch),
            })}
          </div>
          <div class="edit-footer">
            <button class="edit-btn-cancel" @click=${() => this._closeEditDialog()}>
              ${localize("common.cancel")}
            </button>
            <button class="edit-btn-save" ?disabled=${this._editSaving} @click=${() => this._saveDirectkey()}>
              ${this._editSaving ? "..." : localize("common.save")}
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
