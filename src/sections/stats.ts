// Cup statistics section.

import { html, TemplateResult } from "lit";
import { STATS_EXCLUDED_ATTRS } from "../const";
import { coffeeIconSvg } from "../icons";

interface EntityLike {
  state: string;
  attributes: Record<string, unknown>;
}

export function renderStats(entity: EntityLike | undefined): TemplateResult {
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
    if (typeof val === "number" && !STATS_EXCLUDED_ATTRS.includes(name)) {
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
