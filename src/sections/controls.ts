// Shared form controls for recipe editing (freestyle section + edit dialog).

import { html, TemplateResult } from "lit";
import {
  type Process,
  type Intensity,
  type Aroma,
  type Temperature,
  type Shots,
} from "../const";
import { resolveFreestyleVocab, type FreestyleVocab } from "../contract-wiring";
import { displayName } from "../format";
import { localize } from "../localize/localize";
import type { ComponentSpec } from "../recipe";

export function renderSegment(
  label: string,
  options: readonly string[],
  value: string,
  onChange: (v: string) => void,
  disabled = false,
): TemplateResult {
  return html`
    <div class="segment-picker ${disabled ? "freestyle-disabled" : ""}">
      <span class="segment-label">${label}</span>
      <div class="segment-options">
        ${options.map(o => html`
          <button class="segment-opt" ?data-active=${o === value}
            @click=${() => onChange(o)}>${displayName(o)}</button>
        `)}
      </div>
    </div>
  `;
}

export function renderPortion(
  label: string, value: number, min: number, max: number, step: number,
  onChange: (v: number) => void, disabled = false,
): TemplateResult {
  return html`
    <div class="portion-row ${disabled ? "freestyle-disabled" : ""}">
      <div class="portion-header">
        <span class="portion-label">${label}</span>
        <span class="portion-value">${localize("freestyle.portion_value", { value })}</span>
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
   * Resolved contract vocabularies + limits (UI Contract §7.2 C-D). Omitted →
   * legacy const.ts option lists and PORTION_LIMITS, byte-identical to the
   * pre-contract behaviour.
   */
  vocab?: FreestyleVocab;
}

export function renderComponentForm(opts: ComponentFormOptions): TemplateResult {
  const { spec, onChange, allowNoneProcess } = opts;
  const vocab = opts.vocab ?? resolveFreestyleVocab(null);
  const isNone = spec.process === "none";
  const isCoffee = spec.process === "coffee";
  const limits = allowNoneProcess ? vocab.limits.c2 : vocab.limits.c1;
  const processes = allowNoneProcess ? vocab.processesWithNone : vocab.processes;

  return html`
    <div class="${opts.containerClass}">
      <div class="component-title">${opts.title}</div>
      ${renderSegment(localize("freestyle.process"), processes, spec.process,
        (v) => onChange({ process: v as Process }))}
      ${renderPortion(localize("freestyle.portion"), spec.portion_ml, limits.min, limits.max, limits.step,
        (v) => onChange({ portion_ml: v }), allowNoneProcess && isNone)}
      ${renderSegment(localize("freestyle.intensity"), vocab.intensities, spec.intensity,
        (v) => onChange({ intensity: v as Intensity }), !isCoffee)}
      ${renderSegment(localize("freestyle.aroma"), vocab.aromas, spec.aroma,
        (v) => onChange({ aroma: v as Aroma }), !isCoffee)}
      ${renderSegment(localize(opts.longTemperatureLabel ? "freestyle.temperature" : "freestyle.temp"),
        vocab.temperatures, spec.temperature,
        (v) => onChange({ temperature: v as Temperature }), allowNoneProcess && isNone)}
      ${renderSegment(localize("freestyle.shots"), vocab.shots, spec.shots,
        (v) => onChange({ shots: v as Shots }), !isCoffee)}
    </div>
  `;
}
