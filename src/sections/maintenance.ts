// Maintenance actions (cleaning, descaling, filter, power) — Zone C-G.
//
// Thin renderer over the pure action-catalog module (spec §6.2): when Zone
// C-I wires a resolved catalog in via the additive optional props below, the
// section catalog-drives cleaning/filter/power/danger plus unknown groups
// (§6.2.5.2 — brew/control entries are informational and never render here).
// Without those props — including the untouched 2.6.x call site in
// melitta-barista-card.ts — the legacy hardcoded-array path renders exactly
// as before (§6.2.5.1: the legacy arrays are a permanent fixture, not a shim).

import { html, nothing, TemplateResult } from "lit";
import {
  actionDescription,
  actionGroupLabel,
  actionIcon,
  actionLabel,
  evalRequires,
  isDestructive,
  maintenanceActionGroups,
  type ActionGroup,
  type RequiresContext,
} from "../action-catalog";
import { CLEANING_ACTIONS, FILTER_ACTIONS, OTHER_ACTIONS } from "../const";
import type { ActionEntry } from "../contract";
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

  // --- v2 additive props (spec §6.2; wired by Zone C-I, all optional so the
  // --- existing card call site keeps compiling and rendering legacy) ---

  /** Resolved catalog (resolveActionCatalog); null/absent → legacy arrays. */
  catalog?: ActionGroup[] | null;
  /** `requires` evaluation inputs (§6.2.4); absent → legacy ready gating. */
  requiresCtx?: RequiresContext | null;
  /** Dispatcher for a pressed catalog entry (confirm flow + invocation plan). */
  onCatalogPress?: (entry: ActionEntry) => void;
}

/**
 * Render the maintenance section: catalog-driven when a resolved catalog and
 * dispatcher are provided (spec §6.2.5), legacy hardcoded arrays otherwise.
 */
export function renderMaintenance(props: MaintenanceSectionProps): TemplateResult {
  const body = props.catalog != null && props.onCatalogPress
    ? renderCatalogGroups(props, props.catalog, props.onCatalogPress)
    : renderLegacyGroups(props);
  return html`
    <div class="section-title">${localize("maintenance.title")}</div>
    <div class="maint-section" @click=${() => props.onDismissConfirm()}>${body}</div>
  `;
}

// ---------------------------------------------------------------------------
// Catalog-driven path (§6.2.5)
// ---------------------------------------------------------------------------

function renderCatalogGroups(
  props: MaintenanceSectionProps,
  catalog: ActionGroup[],
  onPress: (entry: ActionEntry) => void,
): unknown[] {
  return maintenanceActionGroups(catalog).map((group) => {
    const cards = group.entries.map((entry) => {
      // Both invocation kinds anchor on a button entity (§6.2.1); hide the
      // card when the entity is missing, exactly like the legacy path.
      if (!props.hasEntity(entry.invocation.entity_suffix)) return nothing;
      const isConfirming = props.confirmKey === entry.action;
      const isBusy = props.busyKey === entry.action;
      const satisfied = props.requiresCtx
        ? evalRequires(entry.requires, props.requiresCtx)
        : props.st.isConnected && props.st.isReady;
      const disabled = !satisfied || isBusy;
      const destructive = isDestructive(entry);
      const desc = actionDescription(entry.action);
      return html`
        <div class="maint-card" ?data-confirming=${isConfirming} ?data-destructive=${destructive}>
          <ha-icon class="maint-icon" icon="${actionIcon(entry)}"
            style=${destructive ? "color: var(--error-color, #db4437)" : nothing}></ha-icon>
          <div class="maint-info">
            <div class="maint-label">${actionLabel(entry.action)}</div>
            ${desc !== null ? html`<div class="maint-desc">${desc}</div>` : nothing}
          </div>
          <button class="maint-btn" ?data-confirm=${isConfirming} ?disabled=${disabled}
            style=${destructive && isConfirming ? "background: var(--error-color, #db4437)" : nothing}
            @click=${(e: Event) => { e.stopPropagation(); onPress(entry); }}>
            ${isBusy ? "..." : isConfirming ? localize("common.confirm") : localize("common.start")}
          </button>
        </div>
      `;
    }).filter((c) => c !== nothing);
    if (cards.length === 0) return nothing;
    return html`
      <div class="maint-group-title">${actionGroupLabel(group.group)}</div>
      <div class="maint-grid">${cards}</div>
    `;
  }).filter((g) => g !== nothing);
}

// ---------------------------------------------------------------------------
// Legacy path — unchanged 2.6.x rendering (§6.2.5.1, permanent fixture)
// ---------------------------------------------------------------------------

function renderLegacyGroups(props: MaintenanceSectionProps): unknown[] {
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

  return [
    renderGroup(localize("maintenance.groups.cleaning"), CLEANING_ACTIONS),
    renderGroup(localize("maintenance.groups.filter"), FILTER_ACTIONS),
    renderGroup(localize("maintenance.groups.other"), OTHER_ACTIONS),
  ];
}
