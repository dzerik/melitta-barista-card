// Header, status badge, offline / no-device and brewing views.

import { html, nothing, TemplateResult } from "lit";
import type { BrandBadge } from "../brand-badge";
import { coffeeIconSvg } from "../icons";
import { localize, localizeOptional } from "../localize/localize";
import type { MachineStatus } from "../machine-state";

export function renderNoDevice(): TemplateResult {
  return html`
    <div class="no-device">
      <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
      <p>${localize("card.no_device")}</p>
      <p class="hint">${localize("card.no_device_hint")}</p>
    </div>
  `;
}

/** Image error path (UI Contract §3.10): hide the logo, reveal the wordmark. */
function onBrandLogoError(e: Event): void {
  const img = e.currentTarget as HTMLImageElement;
  img.hidden = true;
  const label = img.parentElement?.querySelector<HTMLElement>(".brand-badge-label");
  if (label) label.hidden = false;
}

/** Compact brand badge (UI Contract §3.10): wordmark text tinted with the
 * brand accent pair; the user-supplied logo image when `logoUrl` is set. */
function renderBrandBadge(badge: BrandBadge): TemplateResult {
  return html`
    <span class="brand-badge" style="color: ${badge.fg}; background: ${badge.bg}">
      ${badge.logoUrl !== null ? html`
        <img class="brand-badge-logo" src=${badge.logoUrl} alt=${badge.label}
          @error=${onBrandLogoError} />
        <span class="brand-badge-label" hidden>${badge.label}</span>
      ` : html`<span class="brand-badge-label">${badge.label}</span>`}
    </span>
  `;
}

export function renderHeader(
  name: string,
  connected: boolean,
  /** Brand badge model (UI Contract §3.10); null/omitted → legacy header. */
  badge?: BrandBadge | null,
): TemplateResult {
  if (!badge) {
    return html`
      <div class="card-header">
        <span class="machine-name">${name}</span>
        <div class="connection-dot"
          style="background: ${connected ? "var(--mbc-success)" : "var(--mbc-error)"}"></div>
      </div>
    `;
  }
  return html`
    <div class="card-header">
      <span class="machine-name">${name}</span>
      <div class="header-right">
        ${renderBrandBadge(badge)}
        <div class="connection-dot"
          style="background: ${connected ? "var(--mbc-success)" : "var(--mbc-error)"}"></div>
      </div>
    </div>
  `;
}

export function renderOfflineBody(): TemplateResult {
  return html`
    <div class="offline-section">
      <ha-icon icon="mdi:bluetooth-off"></ha-icon>
      <span>${localize("card.machine_offline")}</span>
    </div>
  `;
}

export function renderStatus(st: MachineStatus): TemplateResult {
  return html`
    <div class="status-section">
      <div class="state-row">
        <span class="state-badge"
          style="background: color-mix(in srgb, ${st.stateColor} 10%, transparent); color: ${st.stateColor}">
          ${localizeOptional(`state.${st.state.toLowerCase()}`) ?? st.state}
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
  /** Optional card-supplied icon renderer (UI Contract §7.2 C-D); omitted → legacy name lookup. */
  renderIcon?: (name: string, size: number, uid: string) => TemplateResult,
): TemplateResult {
  return html`
    <div class="brewing-view">
      <div class="brewing-icon-wrap">
        ${(renderIcon ?? coffeeIconSvg)(recipeName || "Espresso", 64, "brew-active")}
      </div>
      <div class="brewing-info">
        <span class="brewing-recipe">${recipeName || localize("state.brewing")}</span>
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
