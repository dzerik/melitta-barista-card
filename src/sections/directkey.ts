// DirectKey quick-brew grid.
//
// Rendered from the resolved DirectKey model (spec §9.3.6, Zone C-L wiring):
// category set and render order come from the model (contract-served order on
// tier 1, the frozen 2.7.0 const order on tier 2), `machine_button: false`
// de-emphasizes the tile (never disables the BLE brew path, rule 3), and
// unknown category tokens are tolerated — served mdi icon, humanized label.
// Without a `model` prop the section builds the legacy model itself, so any
// pre-wiring caller keeps the exact 2.7.0 rendering.

import { html, nothing, TemplateResult } from "lit";
import { DK_LABELS, type DirectKeyCategory } from "../const";
import { resolveDirectKeyModel, type DirectKeyModel } from "../directkey";
import { directKeyCategoryLabel } from "../directkey-display";
import { INTENSITY_DOTS } from "../format";
import { localize } from "../localize/localize";
import { coffeeIconSvg } from "../icons";
import type { DirectKeyData, DirectKeyRecipe } from "../types";

export interface DirectKeySectionProps {
  data: DirectKeyData;
  selected: string | null;
  twoCups: boolean;
  /** Resolved model (Zone C-L). Absent → the legacy tier-2 model. */
  model?: DirectKeyModel;
  onCardClick: (cat: string) => void;
  onLongPressStart: (cat: string, recipe: DirectKeyRecipe) => void;
  onLongPressCancel: () => void;
  onToggleTwoCups: () => void;
}

export function renderDirectKey(props: DirectKeySectionProps): TemplateResult | typeof nothing {
  const activeRecipes = props.data.profiles[props.data.activeProfile] ?? {};
  if (Object.keys(activeRecipes).length === 0) return nothing;
  const model = props.model ?? resolveDirectKeyModel(null);
  const contractMode = model.source === "contract";

  return html`
    <div class="dk-grid">
      ${model.categories.map(catModel => {
        const cat = catModel.category;
        const recipe = activeRecipes[cat];
        if (!recipe) return nothing;
        const isSelected = props.selected === cat;
        const hasDetails = recipe.c1_process !== undefined && recipe.c1_process !== "none";
        const label = directKeyCategoryLabel(cat, contractMode);
        return html`
          <button class="dk-card${catModel.machineButton ? "" : " dk-card-nobutton"}"
            ?data-selected=${isSelected}
            style=${catModel.machineButton ? nothing : "opacity:0.6"}
            @click=${() => props.onCardClick(cat)}
            @pointerdown=${() => props.onLongPressStart(cat, recipe)}
            @pointerup=${() => props.onLongPressCancel()}
            @pointerleave=${() => props.onLongPressCancel()}
            @contextmenu=${(e: Event) => e.preventDefault()}>
            <div class="${isSelected && hasDetails ? "dk-icon-dimmed" : ""}">
              ${renderDkIcon(cat, catModel.icon)}
            </div>
            ${isSelected && hasDetails ? html`
              <div class="dk-card-overlay">
                ${renderDkRecipeInfo(recipe)}
              </div>
            ` : nothing}
            <span class="dk-card-label">
              ${isSelected
                ? localize("directkey.brew_drink", { drink: label })
                : label}
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

/**
 * Tile icon: the seven known categories keep the procedural drink glyph
 * (exact 2.7.0 visuals — the served mdi is a *fallback* icon, §9.3.2);
 * an unknown token renders its served mdi icon when one exists, else the
 * generic drink glyph.
 */
function renderDkIcon(cat: string, mdiIcon: string | null): TemplateResult {
  const known = DK_LABELS[cat as DirectKeyCategory];
  if (known !== undefined) return coffeeIconSvg(known, 48, `dk-${cat}`);
  if (mdiIcon !== null) {
    return html`<ha-icon class="dk-card-mdi" icon="${mdiIcon}" style="--mdc-icon-size:48px"></ha-icon>`;
  }
  return coffeeIconSvg(cat, 48, `dk-${cat}`);
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
