// Maintenance actions (cleaning, descaling, filter, power).

import { html, nothing, TemplateResult } from "lit";
import { CLEANING_ACTIONS, FILTER_ACTIONS, OTHER_ACTIONS } from "../const";
import { localize } from "../localize/localize";
import type { MachineStatus } from "../machine-state";
import type { MaintenanceAction } from "../types";

export interface MaintenanceSectionProps {
  st: MachineStatus;
  hasEntity: (suffix: string) => boolean;
  confirmKey: string | null;
  busyKey: string | null;
  onPress: (action: MaintenanceAction) => void;
  onDismissConfirm: () => void;
}

export function renderMaintenance(props: MaintenanceSectionProps): TemplateResult {
  const renderGroup = (title: string, actions: MaintenanceAction[]) => {
    const cards = actions.map(action => {
      if (!props.hasEntity(action.suffix)) return nothing;
      const isConfirming = props.confirmKey === action.key;
      const isBusy = props.busyKey === action.key;
      const disabled = !props.st.isConnected || !props.st.isReady || isBusy;
      return html`
        <div class="maint-card" ?data-confirming=${isConfirming}>
          <ha-icon class="maint-icon" icon="${action.icon}"></ha-icon>
          <div class="maint-info">
            <div class="maint-label">${localize(`maintenance.actions.${action.key}.label`)}</div>
            <div class="maint-desc">${localize(`maintenance.actions.${action.key}.desc`)}</div>
          </div>
          <button class="maint-btn" ?data-confirm=${isConfirming} ?disabled=${disabled}
            @click=${(e: Event) => { e.stopPropagation(); props.onPress(action); }}>
            ${isBusy ? "..." : isConfirming ? localize("common.confirm") : localize("common.start")}
          </button>
        </div>
      `;
    }).filter(c => c !== nothing);
    if (cards.length === 0) return nothing;
    return html`
      <div class="maint-group-title">${title}</div>
      <div class="maint-grid">${cards}</div>
    `;
  };

  return html`
    <div class="section-title">${localize("maintenance.title")}</div>
    <div class="maint-section" @click=${() => props.onDismissConfirm()}>
      ${renderGroup(localize("maintenance.groups.cleaning"), CLEANING_ACTIONS)}
      ${renderGroup(localize("maintenance.groups.filter"), FILTER_ACTIONS)}
      ${renderGroup(localize("maintenance.groups.other"), OTHER_ACTIONS)}
    </div>
  `;
}
