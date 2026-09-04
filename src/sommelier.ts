// AI Sommelier — self-contained sub-component: own state, WS calls, render.

import { LitElement, html, css, nothing, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import { SOM_FAVORITES_LIMIT } from "./const";
import { localize, setLanguage } from "./localize/localize";
import { displayNameFor } from "./format";
import * as api from "./api";
import type { SommelierFavorite, SommelierHoppers, SommelierQuickRecipe } from "./types";
import {
  buildBrewPlan,
  needsWizard,
  agentErrorText,
  brewStepDetail,
  wizardLabel,
  type BrewStep,
} from "./sommelier-steps";

/** "Brew phase 1/2 — Coffee, 40 ml, Strong" (composition parts optional). */
function brewStepLabel(step: BrewStep & { kind: "brew" }): string {
  const base = wizardLabel("sommelier.brew_phase", {
    n: step.phaseIndex + 1, total: step.phaseCount,
  });
  const d = brewStepDetail(step);
  const parts: string[] = [];
  if (d.process) parts.push(displayNameFor("process", d.process));
  if (d.portionMl !== null) {
    parts.push(localize("freestyle.portion_value", { value: d.portionMl }));
  }
  if (d.intensity) parts.push(displayNameFor("intensity", d.intensity));
  return parts.length ? `${base} — ${parts.join(", ")}` : base;
}

/** One plan line: the sommelier's sentence, or the pour with its own hints. */
function stepLine(step: BrewStep) {
  if (step.kind === "manual") {
    return html`
      <span>${step.text}</span>
      ${step.notes ? html`<span class="som-step-note">${step.notes}</span>` : nothing}
    `;
  }
  return html`
    <span>${brewStepLabel(step)}</span>
    ${(step.hints ?? []).map((h) => html`<span class="som-step-note">${h}</span>`)}
  `;
}

interface WizardState {
  name: string;
  target: { recipeId?: string; favoriteId?: string };
  plan: BrewStep[];
  index: number;
  brewing: boolean;
  /** Set after a brew step resolved: the machine is pouring this phase. */
  phaseRunning: boolean;
}

@customElement("mbc-sommelier")
export class MbcSommelier extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _favorites: SommelierFavorite[] = [];
  @state() private _hoppers: SommelierHoppers = { hopper1: null, hopper2: null };
  @state() private _loaded = false;
  @state() private _error = false;
  @state() private _generating = false;
  @state() private _quickRecipe: SommelierQuickRecipe | null = null;
  @state() private _wizard: WizardState | null = null;
  @state() private _infoFavId: string | null = null;

  private _loading = false;

  protected willUpdate(_changedProps: PropertyValues): void {
    setLanguage(this.hass);
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
      // Served hint (sommelier.error.<code>) → card bundle → generic message.
      this._notify(agentErrorText(e) ?? localize("sommelier.error_generate"));
    } finally {
      this._generating = false;
    }
  }

  private async _brewRecipe(recipe: SommelierQuickRecipe): Promise<void> {
    if (!this.hass) return;
    // Multi-phase or manual-step recipes must not one-shot brew: the pauses
    // (attach milk, add syrup, ...) are part of the recipe.
    if (needsWizard(recipe)) {
      this._openWizard(recipe.name, { recipeId: recipe.id }, recipe);
      return;
    }
    try {
      await api.somBrew(this.hass, recipe.id);
      this._quickRecipe = null;
    } catch (e) {
      console.error("[melitta-card] Brew failed:", e);
      this._notify(localize("sommelier.error_brew"));
    }
  }

  private async _brewFavorite(fav: SommelierFavorite): Promise<void> {
    if (!this.hass) return;
    if (needsWizard(fav)) {
      this._openWizard(fav.name, { favoriteId: fav.id }, fav);
      return;
    }
    try {
      await api.somBrewFavorite(this.hass, fav.id);
      // Update brew count locally
      this._favorites = this._favorites.map(f =>
        f.id === fav.id ? { ...f, brew_count: (f.brew_count ?? 0) + 1 } : f
      );
    } catch (e) {
      console.error("[melitta-card] Brew favorite failed:", e);
      this._notify(localize("sommelier.error_brew"));
    }
  }

  // -- Mini brew wizard (compact card counterpart of the panel wizard) --

  private _openWizard(
    name: string,
    target: { recipeId?: string; favoriteId?: string },
    recipe: SommelierQuickRecipe | SommelierFavorite,
  ): void {
    this._wizard = {
      name,
      target,
      plan: buildBrewPlan(recipe),
      index: 0,
      brewing: false,
      phaseRunning: false,
    };
  }

  private _wizardClose(completed: boolean): void {
    const w = this._wizard;
    this._wizard = null;
    if (!completed || !w) return;
    if (w.target.favoriteId) {
      this._favorites = this._favorites.map(f =>
        f.id === w.target.favoriteId
          ? { ...f, brew_count: (f.brew_count ?? 0) + 1 }
          : f
      );
    }
    if (w.target.recipeId) this._quickRecipe = null;
  }

  private _wizardAdvance(): void {
    const w = this._wizard;
    if (!w) return;
    if (w.index + 1 >= w.plan.length) {
      this._wizardClose(true);
      return;
    }
    this._wizard = { ...w, index: w.index + 1, phaseRunning: false };
  }

  private async _wizardBrew(): Promise<void> {
    const w = this._wizard;
    if (!w || !this.hass || w.brewing) return;
    const step = w.plan[w.index];
    if (step.kind !== "brew") return;
    this._wizard = { ...w, brewing: true };
    try {
      await api.somBrewPhase(this.hass, w.target, step.phaseIndex);
      if (w.index + 1 >= w.plan.length) {
        this._wizardClose(true);
      } else {
        // Stay on this step until the user confirms the pour finished.
        this._wizard = { ...w, brewing: false, phaseRunning: true };
      }
    } catch (e) {
      console.error("[melitta-card] Brew phase failed:", e);
      this._notify(localize("sommelier.error_brew"));
      this._wizard = { ...w, brewing: false };
    }
  }

  protected render() {
    return html`
      <div class="section-title">
        <ha-icon icon="mdi:coffee-maker-check-outline"></ha-icon> ${localize("sommelier.title")}
      </div>
      <div class="mbc-section">${this._renderBody()}</div>
    `;
  }

  private _renderBody() {
    if (this._error) {
      return html`
        <div class="som-error">
          <span>${localize("sommelier.unavailable")}</span>
          <button class="som-retry-btn" @click=${() => this._retry()}>${localize("common.retry")}</button>
        </div>
      `;
    }
    if (!this._loaded) {
      return html`<span class="som-loading">${localize("common.loading")}</span>`;
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
              <div class="som-fav-actions">
                <button class="som-info-btn"
                  title=${localize("sommelier.info")}
                  aria-label=${localize("sommelier.info")}
                  aria-expanded=${this._infoFavId === fav.id}
                  @click=${() => {
                    this._infoFavId = this._infoFavId === fav.id ? null : fav.id;
                  }}>
                  <ha-icon icon="mdi:information-outline"></ha-icon>
                </button>
                <button class="som-brew-btn" @click=${() => this._brewFavorite(fav)}>
                  <ha-icon icon="mdi:coffee"></ha-icon>
                </button>
              </div>
            </div>
            ${this._infoFavId === fav.id ? this._renderFavInfo(fav) : nothing}
          `)}
        </div>
      ` : nothing}

      ${this._quickRecipe ? html`
        <div class="som-quick-recipe">
          <div class="som-quick-name">${this._quickRecipe.name}</div>
          <div class="som-quick-desc">${this._quickRecipe.description}</div>
          ${this._quickRecipe.reasoning ? html`
            <details class="som-reasoning">
              <summary>${localize("sommelier.reasoning")}</summary>
              <div class="som-reasoning-text">${this._quickRecipe.reasoning}</div>
            </details>
          ` : nothing}
          <button class="som-brew-btn full" @click=${() => this._brewRecipe(this._quickRecipe!)}>
            <ha-icon icon="mdi:coffee"></ha-icon> ${localize("common.brew")}
          </button>
        </div>
      ` : nothing}

      ${this._wizard ? this._renderWizard(this._wizard) : nothing}

      <div class="som-actions">
        <button class="som-surprise-btn" @click=${() => this._surpriseMe()}
          ?disabled=${this._generating}>
          ${this._generating
            ? html`<ha-icon icon="mdi:loading" class="spin"></ha-icon> ${localize("sommelier.generating")}`
            : html`<ha-icon icon="mdi:auto-fix"></ha-icon> ${localize("sommelier.surprise_me")}`}
        </button>
      </div>
    `;
  }

  /** Expanded favorite details: description + the linear brew step plan. */
  private _renderFavInfo(fav: SommelierFavorite) {
    const plan = buildBrewPlan(fav);
    return html`
      <div class="som-fav-details">
        ${fav.description
          ? html`<div class="som-fav-desc">${fav.description}</div>`
          : nothing}
        ${fav.reasoning ? html`
          <details class="som-reasoning">
            <summary>${localize("sommelier.reasoning")}</summary>
            <div class="som-reasoning-text">${fav.reasoning}</div>
          </details>
        ` : nothing}
        ${plan.length > 0 ? html`
          <div class="som-fav-steps-title">${localize("sommelier.steps")}</div>
          <ol class="som-fav-steps">
            ${plan.map(s => html`<li>${stepLine(s)}</li>`)}
          </ol>
        ` : nothing}
      </div>
    `;
  }

  private _renderWizard(w: WizardState) {
    const step = w.plan[w.index];
    const total = w.plan.length;
    return html`
      <div class="som-wizard-backdrop" @click=${() => this._wizardClose(false)}></div>
      <div class="som-wizard" role="dialog" aria-modal="true">
        <div class="som-wiz-head">
          <span class="som-wiz-title">${wizardLabel("sommelier.wizard_title")}</span>
          <span class="som-wiz-name">${w.name}</span>
        </div>
        <div class="som-wiz-progress">
          ${wizardLabel("sommelier.step_of", { n: w.index + 1, total })}
        </div>
        <ol class="som-wiz-steps">
          ${w.plan.map((s, i) => html`
            <li class=${i === w.index ? "current" : i < w.index ? "done" : ""}>
              ${stepLine(s)}
            </li>
          `)}
        </ol>
        ${w.phaseRunning ? html`
          <div class="som-wiz-note">${wizardLabel("sommelier.phase_running")}</div>
        ` : nothing}
        <div class="som-wiz-actions">
          <button class="som-retry-btn" @click=${() => this._wizardClose(false)}>
            ${wizardLabel("sommelier.cancel")}
          </button>
          ${step.kind === "manual" || w.phaseRunning ? html`
            <button class="som-brew-btn" @click=${() => this._wizardAdvance()}>
              ${w.index + 1 >= total
                ? wizardLabel("sommelier.finish")
                : wizardLabel("sommelier.done")}
            </button>
          ` : html`
            <button class="som-brew-btn" ?disabled=${w.brewing}
              @click=${() => this._wizardBrew()}>
              ${w.brewing
                ? html`<ha-icon icon="mdi:loading" class="spin"></ha-icon>`
                : html`<ha-icon icon="mdi:coffee"></ha-icon>`}
              ${wizardLabel("sommelier.brew_phase", {
                n: step.phaseIndex + 1, total: step.phaseCount,
              })}
            </button>
          `}
        </div>
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

      .som-fav-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .som-info-btn {
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 6px;
        border: 1px solid var(--mbc-border);
        background: transparent;
        color: var(--mbc-text2);
        cursor: pointer;
        transition: all 0.15s;
      }
      .som-info-btn:hover { background: var(--mbc-surface); color: var(--mbc-text); }
      .som-info-btn ha-icon { --mdc-icon-size: 15px; }
      .som-fav-details {
        margin: -2px 0 4px;
        padding: 8px 10px;
        border-radius: 0 0 8px 8px;
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-border);
        border-top: none;
      }
      .som-fav-desc {
        font-size: 0.74em;
        color: var(--mbc-text2);
        line-height: 1.35;
      }
      .som-fav-steps-title {
        font-size: 0.66em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--mbc-text2);
        margin: 8px 0 4px;
        opacity: 0.8;
      }
      .som-fav-steps {
        margin: 0;
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: 0.74em;
        color: var(--mbc-text);
      }

      .som-reasoning { margin: 6px 0 2px; }
      .som-reasoning summary {
        cursor: pointer;
        font-size: 0.72em;
        color: var(--mbc-text2);
      }
      .som-reasoning-text {
        font-size: 0.72em;
        color: var(--mbc-text2);
        line-height: 1.35;
        padding: 4px 0 2px 12px;
      }

      .som-wizard-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 6;
      }
      .som-wizard {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 7;
        width: min(340px, calc(100vw - 32px));
        max-height: 80vh;
        overflow-y: auto;
        padding: 14px;
        border-radius: 12px;
        background: var(--mbc-bg, var(--card-background-color, #fff));
        border: 1px solid var(--mbc-border);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
      }
      .som-wiz-head { display: flex; flex-direction: column; gap: 2px; }
      .som-wiz-title {
        font-size: 0.68em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--mbc-text2);
      }
      .som-wiz-name { font-size: 0.9em; font-weight: 600; color: var(--mbc-text); }
      .som-wiz-progress { font-size: 0.7em; color: var(--mbc-text2); margin: 6px 0 4px; }
      .som-wiz-steps {
        margin: 4px 0 8px;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.78em;
        color: var(--mbc-text2);
      }
      .som-step-note {
        display: block;
        font-size: 0.92em;
        color: var(--mbc-text2);
        margin-top: 1px;
      }
      .som-wiz-steps li.current { color: var(--mbc-text); font-weight: 600; }
      .som-wiz-steps li.done { text-decoration: line-through; opacity: 0.6; }
      .som-wiz-note {
        font-size: 0.72em;
        color: var(--mbc-text);
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-border);
        border-radius: 8px;
        padding: 6px 8px;
        margin-bottom: 8px;
      }
      .som-wiz-actions {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
      .som-wiz-actions .som-brew-btn { padding: 6px 12px; }
    `;
  }
}
