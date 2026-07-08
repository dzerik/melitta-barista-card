// DirectKey quick-brew grid.

import { html, nothing, TemplateResult } from "lit";
import { DIRECTKEY_CATEGORIES, DK_LABELS, type DirectKeyCategory } from "../const";
import { INTENSITY_DOTS } from "../format";
import { localize } from "../localize/localize";
import { coffeeIconSvg } from "../icons";
import type { DirectKeyData, DirectKeyRecipe } from "../types";

export interface DirectKeySectionProps {
  data: DirectKeyData;
  selected: DirectKeyCategory | null;
  twoCups: boolean;
  onCardClick: (cat: DirectKeyCategory) => void;
  onLongPressStart: (cat: DirectKeyCategory, recipe: DirectKeyRecipe) => void;
  onLongPressCancel: () => void;
  onToggleTwoCups: () => void;
}

export function renderDirectKey(props: DirectKeySectionProps): TemplateResult | typeof nothing {
  const activeRecipes = props.data.profiles[props.data.activeProfile] ?? {};
  if (Object.keys(activeRecipes).length === 0) return nothing;

  return html`
    <div class="dk-grid">
      ${DIRECTKEY_CATEGORIES.map(cat => {
        const recipe = activeRecipes[cat];
        if (!recipe) return nothing;
        const isSelected = props.selected === cat;
        const hasDetails = recipe.c1_process !== undefined && recipe.c1_process !== "none";
        return html`
          <button class="dk-card" ?data-selected=${isSelected}
            @click=${() => props.onCardClick(cat)}
            @pointerdown=${() => props.onLongPressStart(cat, recipe)}
            @pointerup=${() => props.onLongPressCancel()}
            @pointerleave=${() => props.onLongPressCancel()}
            @contextmenu=${(e: Event) => e.preventDefault()}>
            <div class="${isSelected && hasDetails ? "dk-icon-dimmed" : ""}">
              ${coffeeIconSvg(DK_LABELS[cat], 48, `dk-${cat}`)}
            </div>
            ${isSelected && hasDetails ? html`
              <div class="dk-card-overlay">
                ${renderDkRecipeInfo(recipe)}
              </div>
            ` : nothing}
            <span class="dk-card-label">
              ${isSelected
                ? localize("directkey.brew_drink", { drink: localize(`drinks.${cat}`) })
                : localize(`drinks.${cat}`)}
            </span>
          </button>
        `;
      })}

      <!-- 2x toggle -->
      <button class="dk-card" ?data-selected=${props.twoCups}
        @click=${() => props.onToggleTwoCups()}>
        <div class="dk-2x">2x</div>
        <span class="dk-card-label">
          ${props.twoCups ? localize("directkey.two_cups_on") : localize("directkey.two_cups")}
        </span>
      </button>

    </div>
  `;
}

function renderDkRecipeInfo(recipe: DirectKeyRecipe): TemplateResult | typeof nothing {
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
                <span class="intensity-dot" ?data-on=${n <= (INTENSITY_DOTS[c.intensity] || 3)}></span>
              `)}
            </span>
          ` : nothing}
        </div>
      `)}
    </div>
  `;
}
