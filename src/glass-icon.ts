import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { GlassModel } from "./glass-model";
import type { GlassImage } from "./glass-renderer";
import { drawGlassSteam } from "./glass-steam";

type Graphics = typeof import("./glass-renderer");
const pending=new Map<MelittaGlassIcon,()=>void>();
let drawFrame=0;
function drain(): void {
  drawFrame=0;
  const entry=pending.entries().next().value;
  if (entry) { pending.delete(entry[0]); entry[1](); }
  if (pending.size) drawFrame=requestAnimationFrame(drain);
}
const animated=new Set<MelittaGlassIcon>();
let steamFrame=0,lastSteam=0;
function animate(time: number): void {
  steamFrame=0;
  if (document.hidden) return;
  if (time-lastSteam>=40) {
    lastSteam=time; animated.forEach(icon=>icon.drawSteam(time));
  }
  if (animated.size) steamFrame=requestAnimationFrame(animate);
}
function visibility(): void {
  if (document.hidden) { cancelAnimationFrame(steamFrame); steamFrame=0; }
  else if (animated.size&&!steamFrame) steamFrame=requestAnimationFrame(animate);
}
function animation(icon: MelittaGlassIcon, active: boolean): void {
  const wasEmpty=animated.size===0;
  if (active) animated.add(icon); else animated.delete(icon);
  if (animated.size && wasEmpty) document.addEventListener("visibilitychange",visibility);
  if (!animated.size) {
    cancelAnimationFrame(steamFrame); steamFrame=0;
    document.removeEventListener("visibilitychange",visibility);
  } else if (!steamFrame&&!document.hidden) steamFrame=requestAnimationFrame(animate);
}

const colors=new Map<string,number[]>();
let colorProbe: CanvasRenderingContext2D | null=null;
function rgba(value: string): number[] {
  const hit=colors.get(value);
  if (hit) return hit;
  colorProbe??=document.createElement("canvas").getContext("2d",{willReadFrequently:true});
  colorProbe!.clearRect(0,0,1,1);
  colorProbe!.fillStyle=value; colorProbe!.fillRect(0,0,1,1);
  const pixel=Array.from(colorProbe!.getImageData(0,0,1,1).data);
  pixel[3]/=255;
  colors.set(value,pixel);
  if (colors.size>128) colors.delete(colors.keys().next().value!);
  return pixel;
}

/** Composite ancestor backgrounds so translucent selected tiles stay seamless. */
function backdrop(element: HTMLElement): { color: string; light: boolean } {
  let remaining=1,r=0,g=0,b=0;
  let node: Element | null=element.parentElement;
  const root=element.getRootNode();
  if (!node && root instanceof ShadowRoot) node=root.host;
  while (node && remaining>.001) {
    const values=rgba(getComputedStyle(node).backgroundColor),a=values[3];
    r+=values[0]*a*remaining; g+=values[1]*a*remaining; b+=values[2]*a*remaining;
    remaining*=1-a;
    const parent=node.parentElement,owner=node.getRootNode();
    node=parent??(owner instanceof ShadowRoot?owner.host:null);
  }
  if (remaining>.001) {
    const fallback=getComputedStyle(element).getPropertyValue("--card-background-color").trim();
    const rgb=rgba(fallback||"#1c1c1c");
    r+=rgb[0]*remaining; g+=rgb[1]*remaining; b+=rgb[2]*remaining;
  }
  return {color:`rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`,light:(r*.2126+g*.7152+b*.0722)>140};
}

/** Decorative drink image with shared GPU rendering and a classic SVG fallback. */
@customElement("melitta-glass-icon")
export class MelittaGlassIcon extends LitElement {
  @property({attribute:false}) model!: GlassModel;
  @property({type:Number}) size=64;
  @property() uid="drink";
  @state() private ready=false;
  private graphics?: Graphics;
  private image?: GlassImage;
  private resize?: ResizeObserver;
  private intersection?: IntersectionObserver;
  private theme?: MutationObserver;
  private motion?: MediaQueryList;
  private visible=true;
  private light=false;
  private signature="";
  private generation=0;
  private seed=0;
  private onMotion=()=>this.syncSteam();
  private transitionRoot?: Node;
  private onTransition=(event: Event)=>{
    if (/color|background/.test((event as TransitionEvent).propertyName)) this.requestImage();
  };

  static styles=css`
    :host { display:inline-block; position:relative; flex-shrink:0; vertical-align:middle;
      width:calc(var(--mbc-scale,1)*var(--glass-size,64px)); max-width:100%; aspect-ratio:100/115;
      pointer-events:none; }
    canvas { position:absolute; inset:0; width:100%; height:100%; }
    canvas[hidden], slot[hidden] { display:none; }
    ::slotted(svg) { display:block; width:100%; height:auto; }
  `;

  /** Watch layout, visibility and theme only while this icon is mounted. */
  connectedCallback(): void {
    super.connectedCallback();
    this.motion=matchMedia("(prefers-reduced-motion: reduce)");
    this.motion.addEventListener("change",this.onMotion);
    this.resize=new ResizeObserver(()=>this.requestImage()); this.resize.observe(this);
    this.intersection=new IntersectionObserver(entries=>{
      this.visible=entries[0]?.isIntersecting??true;
      if (this.visible) this.requestImage();
      this.syncSteam();
    });
    this.intersection.observe(this);
    // An ancestor's CSS background transition can finish after the attribute
    // mutation. Read the final color as well as the initial theme change.
    this.transitionRoot=this.getRootNode();
    this.transitionRoot.addEventListener("transitionend",this.onTransition,true);
    document.addEventListener("transitionend",this.onTransition,true);
    this.theme=new MutationObserver(()=>{this.signature="";this.requestImage();});
    let node: Element | null=this;
    while (node) {
      this.theme.observe(node,{attributes:true,attributeFilter:["class","style"]});
      const root=node.getRootNode();
      node=node.parentElement??(root instanceof ShadowRoot?root.host:null);
    }
    void this.updateComplete.then(()=>this.requestImage());
  }

  /** Cancel stale draws and release observers, animation and the shared GPU lease. */
  disconnectedCallback(): void {
    super.disconnectedCallback(); this.generation++;
    this.resize?.disconnect(); this.intersection?.disconnect(); this.theme?.disconnect();
    this.motion?.removeEventListener("change",this.onMotion);
    this.transitionRoot?.removeEventListener("transitionend",this.onTransition,true);
    document.removeEventListener("transitionend",this.onTransition,true);
    animation(this,false); pending.delete(this);
    this.graphics?.releaseGlassRenderer(); this.graphics=undefined;
    this.signature="";
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("size")) this.style.setProperty("--glass-size",`${this.size}px`);
    if (changed.has("uid")) {
      this.seed=0;
      for (const c of this.uid) this.seed=(Math.imul(this.seed,31)+c.charCodeAt(0))>>>0;
    }
    if (changed.has("model")||changed.has("size")||changed.has("uid")) this.requestImage();
  }

  private requestImage(): void {
    if (!this.isConnected||!this.visible||!this.model) return;
    const width=this.clientWidth;
    if (!width) return;
    const pixels=Math.min(512,Math.max(64,Math.round(width*Math.min(devicePixelRatio||1,2))));
    const theme=backdrop(this), signature=JSON.stringify([this.model,pixels,theme]);
    if (this.signature===signature) return;
    this.signature=signature; this.light=theme.light;
    const generation=++this.generation;
    pending.set(this,()=>{
      void import("./glass-renderer").then(graphics=>{
        if (!this.isConnected||generation!==this.generation) return;
        if (!this.graphics) { this.graphics=graphics;graphics.retainGlassRenderer(); }
        this.image=graphics.renderGlass(this.model,pixels,theme.color,theme.light);
        const canvas=this.renderRoot.querySelector<HTMLCanvasElement>(".glass")!;
        canvas.width=this.image.canvas.width; canvas.height=this.image.canvas.height;
        canvas.getContext("2d")!.drawImage(this.image.canvas,0,0);
        this.ready=true; this.syncSteam();
      }).catch(()=>{
        if (generation!==this.generation) return;
        this.ready=false; this.image=undefined; animation(this,false);
      });
    });
    if (!drawFrame) drawFrame=requestAnimationFrame(drain);
  }

  private syncSteam(): void {
    const active=!!(this.ready&&this.model?.steam&&this.model.fill>0&&this.visible&&this.isConnected);
    animation(this,active&&!this.motion?.matches);
    this.drawSteam(performance.now());
  }

  /** Draw vapour only; the glass image is unchanged while the drink is idle. */
  drawSteam(time: number): void {
    const canvas=this.renderRoot.querySelector<HTMLCanvasElement>(".steam");
    if (!canvas) return;
    if (!this.image||!this.ready||!this.model.steam||!this.visible) {
      canvas.getContext("2d")!.clearRect(0,0,canvas.width,canvas.height); return;
    }
    const {width,height}=this.image.canvas;
    if (canvas.width!==width||canvas.height!==height) {canvas.width=width;canvas.height=height;}
    drawGlassSteam(canvas.getContext("2d")!,width,height,this.image.rim,this.image.scale,this.seed,this.light,time,!!this.motion?.matches);
  }

  protected render() {
    return html`<slot ?hidden=${this.ready}></slot>
      <canvas class="glass" ?hidden=${!this.ready} aria-hidden="true"></canvas>
      <canvas class="steam" ?hidden=${!this.ready} aria-hidden="true"></canvas>`;
  }
}
