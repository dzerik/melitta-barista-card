// Recipe selector grid and profile tab bar.

import { html, nothing, TemplateResult } from "lit";
import { CARD_VERSION } from "../const";
import { coffeeIconSvg } from "../icons";
import { localize } from "../localize/localize";

export interface RecipesSectionProps {
  options: string[];
  selected: string | null;
  /** A DirectKey grid is shown above (changes the divider style). */
  hasDk: boolean;
  /** A DirectKey tile is currently selected (recipe click always re-selects). */
  dkActive: boolean;
  onSelect: (name: string) => void;
  onBrew: () => void;
  /**
   * Icon renderer supplied by the card (UI Contract §7.2 C-D): prefers the
   * per-recipe IconSpec from the `recipes` attribute / contract catalog over
   * the legacy English-name lookup. Omitted → legacy coffeeIconSvg.
   */
  renderIcon?: (name: string, size: number, uid: string) => TemplateResult;
}

export function renderRecipes(props: RecipesSectionProps): TemplateResult {
  return html`
    ${props.hasDk ? html`
      <div class="recipes-divider">
        <span class="recipes-divider-line"></span>
        <span class="recipes-divider-text">${localize("recipes.all_recipes")}</span>
        <span class="recipes-divider-line"></span>
      </div>
    ` : html`<div class="section-title">${localize("recipes.title")}</div>`}
    <div class="recipe-grid">
      ${props.options.map((name) => {
        const uid = name.replace(/[^a-zA-Z0-9]/g, "");
        const isSelected = name === props.selected && !props.dkActive;
        return html`
          <div class="recipe-card"
            ?data-selected=${isSelected}
            @click=${() => {
              if (isSelected) {
                props.onBrew();
              } else {
                props.onSelect(name);
              }
            }}>
            ${(props.renderIcon ?? coffeeIconSvg)(name, 48, `r-${uid}`)}
            <span class="recipe-name">${name}</span>
          </div>
        `;
      })}
    </div>
  `;
}

export interface ProfileTabsProps {
  options: string[];
  selected: string | null;
  onSelect: (slot: number) => void;
  /**
   * Contract-mode tab model (UI Contract §9.3.6 rule 4, Zone C-L): explicit
   * slot identity, resolved labels, and slot-based active detection. When
   * present it replaces the legacy options/selected label-matching render;
   * absent → exactly the 2.7.0 tab bar.
   */
  tabs?: { slot: number; label: string; active: boolean }[];
}

export function renderProfileTabs(props: ProfileTabsProps): TemplateResult {
  if (props.tabs !== undefined) {
    return html`
      <div class="profile-tabs">
        ${props.tabs.map((t) => html`
          <button class="profile-tab" ?data-active=${t.active}
            @click=${() => { if (!t.active) props.onSelect(t.slot); }}>
            ${t.label}
            ${t.active ? html`<span class="profile-tab-indicator"></span>` : nothing}
          </button>
        `)}
        <span class="profile-tabs-version">v${CARD_VERSION}</span>
      </div>
    `;
  }
  return html`
    <div class="profile-tabs">
      ${props.options.map((o, slot) => html`
        <button class="profile-tab" ?data-active=${o === props.selected}
          @click=${() => { if (o !== props.selected) props.onSelect(slot); }}>
          ${o}
          ${o === props.selected ? html`<span class="profile-tab-indicator"></span>` : nothing}
        </button>
      `)}
      <span class="profile-tabs-version">v${CARD_VERSION}</span>
    </div>
  `;
}
