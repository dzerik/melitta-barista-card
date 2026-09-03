// Shared form controls for recipe editing (freestyle section + edit dialog).

import { html, nothing, TemplateResult } from "lit";
import {
  type Process,
  type Intensity,
  type Aroma,
  type Temperature,
  type Shots,
} from "../const";
import {
  resolveParameters,
  parameterEnabledFor,
  parameterRendered,
  type FreestyleVocab,
  type ResolvedParameters,
} from "../contract-wiring";
import { displayNameFor } from "../format";
import { localize } from "../localize/localize";
import type { ComponentSpec } from "../recipe";

export function renderSegment(
  label: string,
  options: readonly string[],
  value: string,
  onChange: (v: string) => void,
  disabled = false,
  /** Parameter family for family-scoped value labels (spec §6.3.5.7). */
  family = "",
): TemplateResult {
  return html`
    <div class="segment-picker ${disabled ? "freestyle-disabled" : ""}">
      <span class="segment-label">${label}</span>
      <div class="segment-options">
        ${options.map(o => html`
          <button class="segment-opt" ?data-active=${o === value}
            @click=${() => onChange(o)}>${displayNameFor(family, o)}</button>
        `)}
      </div>
    </div>
  `;
}

export function renderPortion(
  label: string, value: number, min: number, max: number, step: number,
  onChange: (v: number) => void, disabled = false,
  /** Range-descriptor unit (spec §6.1.1); null/"ml" keep the localized label. */
  unit: string | null = null,
): TemplateResult {
  const valueLabel = unit === null || unit === "ml"
    ? localize("freestyle.portion_value", { value })
    : `${value} ${unit}`;
  return html`
    <div class="portion-row ${disabled ? "freestyle-disabled" : ""}">
      <div class="portion-header">
        <span class="portion-label">${label}</span>
        <span class="portion-value">${valueLabel}</span>
      </div>
      <input type="range" class="portion-slider"
        min=${min} max=${max} step=${step} .value=${String(value)}
        @input=${(e: Event) => onChange(parseInt((e.target as HTMLInputElement).value) || 0)} />
    </div>
  `;
}

export interface ComponentFormOptions {
  title: string;
  containerClass: string;
  spec: ComponentSpec;
  onChange: (patch: Partial<ComponentSpec>) => void;
  /** Second component: allows process "none", portion may go down to 0. */
  allowNoneProcess: boolean;
  /** Dialog uses the long "Temperature" label, freestyle the short "Temp". */
  longTemperatureLabel?: boolean;
  /**
   * Resolved contract parameters (UI Contract §6.1.5 three-tier fallback,
   * Zone C-F) — a ResolvedParameters carries per-family `applies_to` and
   * scope-rendering metadata; a plain FreestyleVocab (pre-catalog caller)
   * keeps the legacy hardcoded rules. Omitted → legacy const.ts option lists
   * and PORTION_LIMITS, byte-identical to the pre-contract behaviour.
   */
  vocab?: FreestyleVocab | ResolvedParameters;
}

export function renderComponentForm(opts: ComponentFormOptions): TemplateResult {
  const { spec, onChange, allowNoneProcess } = opts;
  const vocab = opts.vocab ?? resolveParameters(null);
  const isNone = spec.process === "none";
  const limits = allowNoneProcess ? vocab.limits.c2 : vocab.limits.c1;
  const processes = allowNoneProcess ? vocab.processesWithNone : vocab.processes;
  // applies_to filtering per component process (§6.1.1); legacy vocabs fall
  // back to the historical coffee-only rule inside parameterEnabledFor.
  const enabled = (family: string): boolean => parameterEnabledFor(vocab, family, spec.process);
  const shown = (family: string): boolean => parameterRendered(vocab, family);
  const unit = (vocab as Partial<ResolvedParameters>).portionUnit ?? null;

  return html`
    <div class="${opts.containerClass}">
      <div class="component-title">${opts.title}</div>
      ${shown("process")
        ? renderSegment(localize("freestyle.process"), processes, spec.process,
            (v) => onChange({ process: v as Process }), false, "process")
        : nothing}
      ${shown("portion_ml")
        ? renderPortion(localize("freestyle.portion"), spec.portion_ml, limits.min, limits.max, limits.step,
            (v) => onChange({ portion_ml: v }), allowNoneProcess && isNone, unit)
        : nothing}
      ${shown("intensity")
        ? renderSegment(localize("freestyle.intensity"), vocab.intensities, spec.intensity,
            (v) => onChange({ intensity: v as Intensity }), !enabled("intensity"), "intensity")
        : nothing}
      ${shown("aroma")
        ? renderSegment(localize("freestyle.aroma"), vocab.aromas, spec.aroma,
            (v) => onChange({ aroma: v as Aroma }), !enabled("aroma"), "aroma")
        : nothing}
      ${shown("temperature")
        ? renderSegment(localize(opts.longTemperatureLabel ? "freestyle.temperature" : "freestyle.temp"),
            vocab.temperatures, spec.temperature,
            (v) => onChange({ temperature: v as Temperature }),
            (allowNoneProcess && isNone) || !enabled("temperature"), "temperature")
        : nothing}
      ${shown("shots")
        ? renderSegment(localize("freestyle.shots"), vocab.shots, spec.shots,
            (v) => onChange({ shots: v as Shots }), !enabled("shots"), "shots")
        : nothing}
    </div>
  `;
}
