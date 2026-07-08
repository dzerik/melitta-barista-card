// Maintenance actions (cleaning, descaling, filter, power).

import { html, nothing, TemplateResult } from "lit";
import { CLEANING_ACTIONS, FILTER_ACTIONS, OTHER_ACTIONS } from "../const";
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
            <div class="maint-label">${action.label}</div>
            <div class="maint-desc">${action.desc}</div>
          </div>
          <button class="maint-btn" ?data-confirm=${isConfirming} ?disabled=${disabled}
            @click=${(e: Event) => { e.stopPropagation(); props.onPress(action); }}>
            ${isBusy ? "..." : isConfirming ? "Confirm" : "Start"}
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
    <div class="section-title">Maintenance</div>
    <div class="maint-section" @click=${() => props.onDismissConfirm()}>
      ${renderGroup("Cleaning & Descaling", CLEANING_ACTIONS)}
      ${renderGroup("Water Filter", FILTER_ACTIONS)}
      ${renderGroup("Other", OTHER_ACTIONS)}
    </div>
  `;
}
