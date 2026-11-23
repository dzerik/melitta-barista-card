import { afterEach, describe, expect, it, vi } from "vitest";
import { type TemplateResult } from "lit";
import { coffeeIconSvg } from "../src/icons";
import { renderDrinkIcon } from "../src/drink-icon";
import { defaultRecipe } from "../src/recipe";
import { parseDirectKeyData } from "../src/directkey";
import { renderDirectKey } from "../src/sections/directkey";
import { renderStats } from "../src/sections/stats";
import { setLanguage } from "../src/localize/localize";

vi.hoisted(() => { Object.assign(globalThis, { window: { customCards: [] } }); });
import { MelittaBaristaCard } from "../src/melitta-barista-card";
import { MelittaBaristaCardEditor } from "../src/editor";

function markup(value: unknown): string {
  if (value==null || typeof value==="symbol" || typeof value==="function") return "";
  if (Array.isArray(value)) return value.map(markup).join("");
  if (typeof value==="object") {
    const t=value as TemplateResult;
    return t.strings?.map((part,i)=>part+markup(t.values[i])).join("")??"";
  }
  return String(value);
}

afterEach(()=>setLanguage());

describe("cup style selection", () => {
  it("leaves the classic icon unchanged when no style is supplied", () => {
    expect(markup(renderDrinkIcon(undefined,64,"a",undefined,"Espresso")))
      .toBe(markup(coffeeIconSvg("Espresso",64,"a")));
  });

  it("renders the glass component with an unchanged SVG fallback", () => {
    const result=markup(renderDrinkIcon(undefined,64,"a","glass","Espresso"));
    expect(result).toContain("<melitta-glass-icon");
    expect(result).toContain('class="mbc-coffee-outline"');
  });

  it("uses the selected style in Freestyle and returns to classic immediately", () => {
    const card=new MelittaBaristaCard();
    const internals=card as unknown as { _renderFreestyle(): unknown; _fsRecipe: ReturnType<typeof defaultRecipe> };
    card.setConfig({type:"custom:melitta-barista-card",cup_style:"glass"});
    const glass=markup(internals._renderFreestyle());
    expect(glass).toContain("<melitta-glass-icon");
    expect(glass).toContain("40 ml");
    card.setConfig({type:"custom:melitta-barista-card",cup_style:"classic"});
    expect(markup(internals._renderFreestyle())).not.toContain("<melitta-glass-icon");
  });

  it("uses the style in DirectKey without losing configured recipe specs", () => {
    const data=parseDirectKeyData({active_profile:1,directkey_recipes:{1:{Espresso:{
      category:0,c1_process:"coffee",c1_portion_ml:40,c2_process:"none",c2_portion_ml:0,
    }}}})!;
    const output=markup(renderDirectKey({data,selected:null,twoCups:false,cupStyle:"glass",
      onCardClick:()=>{},onLongPressStart:()=>{},onLongPressCancel:()=>{},onToggleTwoCups:()=>{},
    }));
    expect(output).toContain("<melitta-glass-icon");
  });

  it("uses the same style renderer for statistic icons", () => {
    const output=markup(renderStats({state:"3",attributes:{Espresso:3}},
      (name,size,uid)=>renderDrinkIcon(undefined,size,uid,"glass",name)));
    expect(output).toContain("<melitta-glass-icon");
  });

  it("exposes a localized select reflecting the persisted card setting", () => {
    const editor=new MelittaBaristaCardEditor();
    editor.hass={locale:{language:"ru"},states:{}} as never;
    editor.setConfig({type:"custom:melitta-barista-card",cup_style:"glass"});
    const view=markup((editor as unknown as { render(): unknown }).render());
    expect(view).toContain('id="cup_style"');
    expect(view).toContain("Объёмное стекло");
    expect(view).toContain("Классический");
  });
});
