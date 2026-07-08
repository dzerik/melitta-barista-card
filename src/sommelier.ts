// AI Sommelier — self-contained sub-component: own state, WS calls, render.

import { LitElement, html, css, nothing, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import { SOM_FAVORITES_LIMIT } from "./const";
import * as api from "./api";
import type { SommelierFavorite, SommelierHoppers, SommelierQuickRecipe } from "./types";

@customElement("mbc-sommelier")
export class MbcSommelier extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _favorites: SommelierFavorite[] = [];
  @state() private _hoppers: SommelierHoppers = { hopper1: null, hopper2: null };
  @state() private _loaded = false;
  @state() private _error = false;
  @state() private _generating = false;
  @state() private _quickRecipe: SommelierQuickRecipe | null = null;

  private _loading = false;

  protected willUpdate(_changedProps: PropertyValues): void {
    if (this.hass && !this._loaded && !this._loading && !this._error) {
      this._loadData();
    }
  }

  private async _loadData(): Promise<void> {
    this._loading = true;
    try {
      const [favorites, hoppers] = await Promise.all([
        api.somListFavorites(this.hass),
        api.somGetHoppers(this.hass),
      ]);
      this._favorites = favorites.slice(0, SOM_FAVORITES_LIMIT);
      this._hoppers = hoppers;
      this._loaded = true;
    } catch (e) {
      console.warn("[melitta-card] Sommelier not available:", e);
      this._error = true;
    } finally {
      this._loading = false;
    }
  }

  private _retry(): void {
    // willUpdate re-triggers the load once _error is cleared.
    this._error = false;
  }

  private _notify(message: string): void {
    this.dispatchEvent(new CustomEvent("hass-notification", {
      detail: { message },
      bubbles: true,
      composed: true,
    }));
  }

  private async _surpriseMe(): Promise<void> {
    if (!this.hass || this._generating) return;
    this._generating = true;
    this._quickRecipe = null;
    try {
      this._quickRecipe = await api.somGenerateSurprise(this.hass);
    } catch (e) {
      console.error("[melitta-card] Generate failed:", e);
      this._notify("Sommelier: recipe generation failed");
    } finally {
      this._generating = false;
    }
  }

  private async _brewRecipe(recipeId: string): Promise<void> {
    if (!this.hass) return;
    try {
      await api.somBrew(this.hass, recipeId);
      this._quickRecipe = null;
    } catch (e) {
      console.error("[melitta-card] Brew failed:", e);
      this._notify("Sommelier: brew failed");
    }
  }

  private async _brewFavorite(favId: string): Promise<void> {
    if (!this.hass) return;
    try {
      await api.somBrewFavorite(this.hass, favId);
      // Update brew count locally
      this._favorites = this._favorites.map(f =>
        f.id === favId ? { ...f, brew_count: (f.brew_count ?? 0) + 1 } : f
      );
    } catch (e) {
      console.error("[melitta-card] Brew favorite failed:", e);
      this._notify("Sommelier: brew failed");
    }
  }

  protected render() {
    return html`
      <div class="section-title">
        <ha-icon icon="mdi:coffee-maker-check-outline"></ha-icon> AI Sommelier
      </div>
      <div class="mbc-section">${this._renderBody()}</div>
    `;
  }

  private _renderBody() {
    if (this._error) {
      return html`
        <div class="som-error">
          <span>Sommelier is not available.</span>
          <button class="som-retry-btn" @click=${() => this._retry()}>Retry</button>
        </div>
      `;
    }
    if (!this._loaded) {
      return html`<span class="som-loading">Loading...</span>`;
    }

    const h1 = this._hoppers.hopper1?.bean;
    const h2 = this._hoppers.hopper2?.bean;

    return html`
      ${h1 || h2 ? html`
        <div class="som-hoppers">
          ${h1 ? html`<span class="som-hopper-tag">H1: ${h1.brand} ${h1.product}</span>` : nothing}
          ${h2 ? html`<span class="som-hopper-tag">H2: ${h2.brand} ${h2.product}</span>` : nothing}
        </div>
      ` : nothing}

      ${this._favorites.length > 0 ? html`
        <div class="som-favorites">
          ${this._favorites.map(fav => html`
            <div class="som-fav-row">
              <div class="som-fav-info">
                <span class="som-fav-name">★ ${fav.name}</span>
                <span class="som-fav-count">${fav.brew_count}×</span>
              </div>
              <button class="som-brew-btn" @click=${() => this._brewFavorite(fav.id)}>
                <ha-icon icon="mdi:coffee"></ha-icon>
              </button>
            </div>
          `)}
        </div>
      ` : nothing}

      ${this._quickRecipe ? html`
        <div class="som-quick-recipe">
          <div class="som-quick-name">${this._quickRecipe.name}</div>
          <div class="som-quick-desc">${this._quickRecipe.description}</div>
          <button class="som-brew-btn full" @click=${() => this._brewRecipe(this._quickRecipe!.id)}>
            <ha-icon icon="mdi:coffee"></ha-icon> Brew
          </button>
        </div>
      ` : nothing}

      <div class="som-actions">
        <button class="som-surprise-btn" @click=${() => this._surpriseMe()}
          ?disabled=${this._generating}>
          ${this._generating
            ? html`<ha-icon icon="mdi:loading" class="spin"></ha-icon> Generating...`
            : html`<ha-icon icon="mdi:auto-fix"></ha-icon> Surprise me`}
        </button>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host { display: block; }

      .section-title {
        font-size: 0.65em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--mbc-text2);
        padding: 12px 16px 6px;
        opacity: 0.7;
      }
      .mbc-section { padding: 4px 12px 12px; }

      .som-loading { opacity: 0.5; font-size: 0.8em; }
      .som-error {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.78em;
        color: var(--mbc-text2);
      }
      .som-retry-btn {
        padding: 4px 12px;
        border-radius: 6px;
        border: 1px solid var(--mbc-border);
        background: transparent;
        color: var(--mbc-text);
        font-size: 0.9em;
        cursor: pointer;
        font-family: inherit;
      }
      .som-retry-btn:hover { background: var(--mbc-surface); }

      .som-hoppers {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
      .som-hopper-tag {
        font-size: 0.72em;
        padding: 3px 8px;
        border-radius: 12px;
        background: var(--mbc-surface);
        color: var(--mbc-text2);
        border: 1px solid var(--mbc-border);
      }
      .som-favorites { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
      .som-fav-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 10px;
        border-radius: 8px;
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-border);
      }
      .som-fav-info { display: flex; align-items: center; gap: 8px; min-width: 0; }
      .som-fav-name {
        font-size: 0.78em;
        font-weight: 500;
        color: var(--mbc-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .som-fav-count { font-size: 0.68em; color: var(--mbc-text2); flex-shrink: 0; }
      .som-brew-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        border: none;
        background: var(--mbc-text);
        color: var(--mbc-bg);
        font-size: 0.72em;
        cursor: pointer;
        transition: all 0.15s;
      }
      .som-brew-btn:hover { opacity: 0.85; }
      .som-brew-btn.full { width: 100%; justify-content: center; padding: 6px; margin-top: 6px; }
      .som-brew-btn ha-icon { --mdc-icon-size: 16px; }
      .som-quick-recipe {
        padding: 10px;
        border-radius: 10px;
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-accent, var(--mbc-border));
        margin-bottom: 10px;
      }
      .som-quick-name { font-size: 0.82em; font-weight: 600; color: var(--mbc-text); margin-bottom: 4px; }
      .som-quick-desc { font-size: 0.72em; color: var(--mbc-text2); line-height: 1.3; }
      .som-actions { display: flex; gap: 6px; }
      .som-surprise-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid var(--mbc-border);
        background: transparent;
        color: var(--mbc-text);
        font-size: 0.78em;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
      }
      .som-surprise-btn:hover { background: var(--mbc-surface); }
      .som-surprise-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .som-surprise-btn ha-icon { --mdc-icon-size: 18px; }
      @keyframes mbc-spin { to { transform: rotate(360deg); } }
      .spin, ha-icon.spin { animation: mbc-spin 1s linear infinite; }
    `;
  }
}
