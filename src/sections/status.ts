// Header, status badge, offline / no-device and brewing views.

import { html, nothing, TemplateResult } from "lit";
import { coffeeIconSvg } from "../icons";
import type { MachineStatus } from "../machine-state";

export function renderNoDevice(): TemplateResult {
  return html`
    <div class="no-device">
      <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
      <p>No Melitta Barista device found.</p>
      <p class="hint">Make sure the integration is installed and configured.</p>
    </div>
  `;
}

export function renderHeader(name: string, connected: boolean): TemplateResult {
  return html`
    <div class="card-header">
      <span class="machine-name">${name}</span>
      <div class="connection-dot"
        style="background: ${connected ? "var(--mbc-success)" : "var(--mbc-error)"}"></div>
    </div>
  `;
}

export function renderOfflineBody(): TemplateResult {
  return html`
    <div class="offline-section">
      <ha-icon icon="mdi:bluetooth-off"></ha-icon>
      <span>Machine offline</span>
    </div>
  `;
}

export function renderStatus(st: MachineStatus): TemplateResult {
  return html`
    <div class="status-section">
      <div class="state-row">
        <span class="state-badge"
          style="background: color-mix(in srgb, ${st.stateColor} 10%, transparent); color: ${st.stateColor}">
          ${st.state}
        </span>
      </div>
    </div>

    ${st.actionRequired ? html`
      <div class="action-alert">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <span>${st.actionRequired}</span>
      </div>
    ` : nothing}
  `;
}

export function renderBrewingView(
  recipeName: string | null,
  st: MachineStatus,
  onCancel: () => void,
): TemplateResult {
  return html`
    <div class="brewing-view">
      <div class="brewing-icon-wrap">
        ${coffeeIconSvg(recipeName || "Espresso", 64, "brew-active")}
      </div>
      <div class="brewing-info">
        <span class="brewing-recipe">${recipeName || "Brewing"}</span>
        <span class="brewing-activity">${st.activity}</span>
        ${st.progress !== null ? html`
          <div class="brewing-progress">
            <div class="brewing-progress-fill" style="width: ${st.progress}%"></div>
          </div>
          <span class="brewing-percent">${Math.round(st.progress)}%</span>
        ` : nothing}
      </div>
      <button class="brewing-cancel" @click=${onCancel}>
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
  `;
}
