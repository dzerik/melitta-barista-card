import * as THREE from "three";
import type { GlassModel, GlassLayer, GlassShape } from "./glass-model";

type Profile = [number, number][];
interface HeightPoint { y: number; v: number }
export interface GlassImage {
  canvas: HTMLCanvasElement;
  rim: { x: number; y: number };
  scale: number;
}

const CUP: Profile = [[0,.035],[.63,.035],[.81,.055],[.91,.13],[.98,.32],[1.06,.68],[1.16,1.22],[1.27,1.95],[1.34,2.50],[1.35,2.54],[1.33,2.58],[1.28,2.59],[1.25,2.55],[1.25,2.48],[1.18,1.95],[1.07,1.22],[.97,.68],[.89,.36],[.83,.27],[.74,.25],[0,.25]];
const CUP_INNER: Profile = [[.25,.74],[.27,.83],[.36,.89],[.68,.97],[1.22,1.07],[1.95,1.18],[2.48,1.25]];
const TALL: Profile = [[0,.035],[.65,.035],[.84,.055],[.94,.14],[1,.35],[1.08,1.30],[1.20,2.60],[1.26,3.75],[1.265,3.79],[1.25,3.83],[1.20,3.84],[1.17,3.80],[1.17,3.73],[1.11,2.60],[.99,1.30],[.91,.38],[.85,.25],[.78,.22],[0,.22]];
const TALL_INNER: Profile = [[.22,.78],[.25,.85],[.38,.91],[1.30,.99],[2.60,1.11],[3.73,1.17]];

function radiusAt(profile: Profile, y: number): number {
  for (let i = 1; i < profile.length; i++) {
    if (y <= profile[i][0]) {
      const a = profile[i-1], b = profile[i];
      return THREE.MathUtils.lerp(a[1], b[1], Math.max(0, (y-a[0])/(b[0]-a[0])));
    }
  }
  return profile[profile.length-1][1];
}

function heightTable(inner: Profile): HeightPoint[] {
  const low = inner[0][0], high = inner[inner.length-1][0]-.035;
  const points = [{ y: low, v: 0 }];
  let volume = 0;
  for (let i = 1; i <= 160; i++) {
    const y = low+(high-low)*i/160, previous = points[i-1];
    const r = radiusAt(inner, y), r0 = radiusAt(inner, previous.y);
    volume += Math.PI*(r*r+r0*r0)/2*(y-previous.y);
    points.push({ y, v: volume });
  }
  return points;
}

function volumeY(table: HeightPoint[], fraction: number): number {
  const target = table[table.length-1].v*THREE.MathUtils.clamp(fraction, 0, 1);
  for (let i = 1; i < table.length; i++) {
    if (target <= table[i].v) {
      const a = table[i-1], b = table[i];
      return THREE.MathUtils.lerp(a.y, b.y, (target-a.v)/(b.v-a.v || 1));
    }
  }
  return table[table.length-1].y;
}

function texture(paint: (g: CanvasRenderingContext2D, w: number, h: number) => void, w = 256, h = w): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  paint(canvas.getContext("2d")!, w, h);
  const result = new THREE.CanvasTexture(canvas);
  result.colorSpace = THREE.SRGBColorSpace;
  return result;
}

function random(seed: number): () => number {
  return () => {
    seed = (Math.imul(seed, 1664525)+1013904223)|0;
    return (seed >>> 0)/4294967296;
  };
}

/** Owns one offscreen GPU context; tiles receive ordinary cached 2D images. */
class GlassRenderer {
  private renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-2.8, 2.8, 3.22, -3.22, .1, 80);
  private pmrem = new THREE.PMREMGenerator(this.renderer);
  private environments = new Map<boolean, THREE.WebGLRenderTarget>();
  private glass = new THREE.MeshPhysicalMaterial({ color: 0xfffbf4, roughness: .035,
    transmission: 1, ior: 1.48, thickness: .11, attenuationColor: 0xfff3da,
    attenuationDistance: 6, specularIntensity: 1, toneMapped: false });
  private mask = new THREE.MeshBasicMaterial({ color: 0xffffff });
  private background = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  private resolution = new THREE.Vector2();
  private key = new THREE.DirectionalLight(0xfff4e2, 3.2);
  private liquid = new THREE.Group();
  private vessels = new Map<GlassShape, THREE.Group>();
  private cache = new Map<string, GlassImage>();
  private cachedPixels = 0;
  private lost = false;
  private crema = texture((g, w, h) => {
    const gradient = g.createRadialGradient(w*.42,h*.4,1,w*.5,h*.5,w*.7);
    gradient.addColorStop(0,"#f1b75f"); gradient.addColorStop(.58,"#c98230"); gradient.addColorStop(1,"#f5c873");
    g.fillStyle = gradient; g.fillRect(0,0,w,h);
    const rnd = random(819);
    for (let i=0;i<1000;i++) {
      g.fillStyle = i%3 ? "rgba(91,43,13,.15)" : "rgba(255,236,174,.35)";
      g.beginPath(); g.arc(rnd()*w,rnd()*h,.35+rnd()*1.55,0,Math.PI*2); g.fill();
    }
  });
  private foam = texture((g,w,h) => {
    g.fillStyle="#fff3db"; g.fillRect(0,0,w,h);
    const rnd=random(402);
    for (let i=0;i<1100;i++) {
      const x=rnd()*w,y=rnd()*h,r=.4+rnd()*2.8;
      const gradient=g.createRadialGradient(x-r*.2,y-r*.2,0,x,y,r);
      gradient.addColorStop(0,"rgba(255,255,251,.7)");
      gradient.addColorStop(.68,"rgba(255,251,239,.15)");
      gradient.addColorStop(1,"rgba(137,110,75,.12)");
      g.fillStyle=gradient; g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();
    }
  });

  constructor() {
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.25;
    this.renderer.transmissionResolutionScale=1;
    this.renderer.domElement.addEventListener("webglcontextlost", () => { this.lost=true; this.cache.clear(); });
    this.camera.position.set(0,6.2,19); this.camera.lookAt(0,1.6,0);
    this.key.position.set(-4,9,6); this.scene.add(this.key);
    const fill = new THREE.DirectionalLight(0xd9e7ff,.9);
    fill.position.set(6,4,-2); this.scene.add(fill);
    this.scene.add(this.liquid);
  }

  private environment(light: boolean): void {
    let target=this.environments.get(light);
    if (!target) {
      const map=texture((g,w,h) => {
        const gradient=g.createLinearGradient(0,0,0,h);
        gradient.addColorStop(0,light?"#36383b":"#42474b");
        gradient.addColorStop(.48,light?"#18191b":"#282a2c");
        gradient.addColorStop(1,light?"#39352e":"#171a1b");
        g.fillStyle=gradient; g.fillRect(0,0,w,h);
        const box=(x:number,y:number,bw:number,bh:number,color:string) => {
          const a=g.createLinearGradient(x,0,x+bw,0);
          a.addColorStop(0,color+"00"); a.addColorStop(.23,color);
          a.addColorStop(.75,color); a.addColorStop(1,color+"00");
          g.shadowBlur=30; g.shadowColor=color; g.fillStyle=a; g.fillRect(x,y,bw,bh);
        };
        box(140,115,53,270,"#ffffff"); box(215,140,25,225,"#e8e4db");
        box(755,165,90,170,"#fff7e7"); box(500,35,215,48,"#fff6e3");
        box(940,155,28,235,"#c4d4df");
      },1024,512);
      map.mapping=THREE.EquirectangularReflectionMapping;
      target=this.pmrem.fromEquirectangular(map); map.dispose();
      this.environments.set(light,target);
    }
    this.scene.environment=target.texture;
    this.scene.environmentIntensity=light?.9:1.45;
    this.glass.envMap=target.texture;
    this.glass.envMapIntensity=light?.95:1.5;
    this.glass.needsUpdate=true;
  }

  private vessel(shape: GlassShape): THREE.Group {
    for (const group of this.vessels.values()) group.visible=false;
    let vessel=this.vessels.get(shape);
    if (!vessel) {
      vessel=new THREE.Group();
      const profile=shape==="tall_glass"?TALL:CUP;
      const curve=new THREE.CatmullRomCurve3(profile.map(([x,y])=>new THREE.Vector3(x,y,0)),false,"centripetal");
      const points=curve.getPoints(160).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y));
      vessel.add(new THREE.Mesh(new THREE.LatheGeometry(points,96),this.glass));
      if (shape!=="tall_glass") {
        const handle=new THREE.CatmullRomCurve3([[1.29,2.10,0],[1.85,2.08,0],[2.12,1.79,0],[2.09,1.30,0],[1.74,.93,0],[1.12,.82,0]].map(([x,y,z])=>new THREE.Vector3(x,y,z)));
        vessel.add(new THREE.Mesh(new THREE.TubeGeometry(handle,64,.115,12,false),this.glass));
        vessel.position.x=-.25;
      }
      vessel.scale.setScalar(shape==="espresso_cup"?.67:1);
      this.vessels.set(shape,vessel); this.scene.add(vessel);
    }
    vessel.visible=true;
    return vessel;
  }

  private aqueous(depth: number, width: number, coffee: number, light: boolean): THREE.ShaderMaterial {
    const material=new THREE.ShaderMaterial({
      uniforms: { uScene:{value:this.background.texture},uResolution:{value:this.resolution},
        uDepth:{value:Math.max(.03,depth)},uWidth:{value:width},uCoffee:{value:coffee},uLight:{value:light?1:0} },
      vertexShader: `varying vec3 vWaterNormal; varying vec3 vWaterToEye;
        void main(){ vec4 p=modelViewMatrix*vec4(position,1.0);
          vWaterNormal=normalize(normalMatrix*normal); vWaterToEye=-p.xyz;
          gl_Position=projectionMatrix*p; }`,
      fragmentShader: `uniform sampler2D uScene; uniform vec2 uResolution;
        uniform float uDepth; uniform float uWidth; uniform float uCoffee; uniform float uLight;
        varying vec3 vWaterNormal; varying vec3 vWaterToEye;
        void main(){
          vec3 N=normalize(vWaterNormal),V=normalize(vWaterToEye);
          if(!gl_FrontFacing)N=-N;
          float facing=clamp(dot(N,V),0.0,1.0);
          vec3 ray=refract(-V,N,0.75019);
          vec2 uv=gl_FragCoord.xy/uResolution;
          vec2 bend=(ray.xy+V.xy)*(0.025+min(uDepth,2.0)*0.07);
          vec3 behind=texture2D(uScene,clamp(uv+bend,vec2(0.002),vec2(0.998))).rgb;
          float topness=smoothstep(0.65,0.92,abs(N.y));
          float distanceInWater=min(6.0,mix(uWidth*max(0.2,facing),uDepth/max(facing,0.35),topness));
          vec3 sigma=vec3(0.012)+uCoffee*vec3(1.8,4.0,8.0);
          vec3 transmission=exp(-sigma*distanceInWater);
          vec3 illumination=behind+vec3(0.30,0.12,0.035)*(1.0-exp(-uCoffee*30.0));
          vec3 color=illumination*transmission;
          color+=vec3(0.25)*(1.0-exp(-distanceInWater*0.65))*0.035*exp(-uCoffee*14.0);
          color+=vec3(0.028,0.007,0.0015)*(vec3(1.0)-transmission)*uCoffee;
          float fresnel=0.02+0.98*pow(1.0-facing,5.0);
          vec3 R=reflect(-V,N);
          float left=exp(-pow((R.x+0.55)/0.15,2.0)-pow((R.y-0.35)/0.65,2.0));
          float right=exp(-pow((R.x-0.7)/0.12,2.0)-pow((R.y-0.2)/0.7,2.0));
          vec3 reflected=mix(vec3(0.08,0.10,0.11),vec3(0.52,0.57,0.59),uLight);
          reflected+=vec3(0.6,0.62,0.63)*(left+right*0.75);
          color=mix(color,reflected,min(0.38,fresnel)*0.65);
          gl_FragColor=vec4(color,1.0);
          #include <colorspace_fragment>
        }`,
      toneMapped:false,
    });
    material.userData.aqueous=true;
    return material;
  }

  private clearLiquid(): void {
    for (const object of [...this.liquid.children]) {
      const mesh=object as THREE.Mesh;
      this.liquid.remove(mesh); mesh.geometry.dispose();
      (Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>m.dispose());
    }
  }

  private addLayer(layer: GlassLayer, inner: Profile, bottom: number, top: number, scale: number, light: boolean, last: boolean): void {
    const aqueous=layer.role==="coffee"||layer.role==="water";
    const froth=layer.role==="milk_foam"||layer.role==="crema";
    const depth=(top-bottom)*scale, width=2*radiusAt(inner,(bottom+top)/2)*scale;
    const concentration=layer.concentration*(.65+layer.intensity*.5);
    const material=aqueous?this.aqueous(depth,width,concentration,light):new THREE.MeshStandardMaterial({
      color:layer.color,roughness:froth?.8:.23,envMapIntensity:.5,
    });
    const points=[new THREE.Vector2(0,bottom)];
    for (let j=0;j<=24;j++) {
      const y=bottom+(top-bottom)*j/24;
      points.push(new THREE.Vector2(Math.max(0,radiusAt(inner,y)-.014),y));
    }
    const r=radiusAt(inner,top)-.014;
    points.push(new THREE.Vector2(r-.012,top+.008),new THREE.Vector2(Math.max(0,r-.055),top+.01),new THREE.Vector2(0,top+.01));
    this.liquid.add(new THREE.Mesh(new THREE.LatheGeometry(points,72),material));
    if (last) {
      const map=layer.role==="milk_foam"?this.foam:this.crema;
      const surfaceMaterial=aqueous?this.aqueous(depth,width,concentration,light):new THREE.MeshPhysicalMaterial({
        color:froth?0xffffff:layer.color,map:froth?map:null,bumpMap:froth?map:null,
        bumpScale:.008,roughness:froth?.7:.17,clearcoat:froth?0:.5,envMapIntensity:.7,
      });
      const surface=new THREE.Mesh(new THREE.CircleGeometry(Math.max(.001,r-.011),72),surfaceMaterial);
      surface.rotation.x=-Math.PI/2; surface.position.y=top+.013; this.liquid.add(surface);
    }
  }

  /** Render only on composition, size or theme changes, never on steam frames. */
  render(model: GlassModel, pixels: number, background: string, light: boolean): GlassImage {
    if (this.lost) throw new Error("Glass rendering context unavailable");
    const key=JSON.stringify([model,pixels,background,light]);
    const hit=this.cache.get(key);
    if (hit) { this.cache.delete(key); this.cache.set(key,hit); return hit; }
    const width=pixels,height=Math.round(pixels*1.15);
    this.renderer.setSize(width,height,false);
    this.environment(light); this.key.intensity=light?2.6:3.2;
    const vessel=this.vessel(model.glass),scale=vessel.scale.x;
    const inner=model.glass==="tall_glass"?TALL_INNER:CUP_INNER, table=heightTable(inner);
    this.clearLiquid(); this.liquid.scale.copy(vessel.scale); this.liquid.position.copy(vessel.position);
    let fraction=0;
    model.layers.forEach((layer,i) => {
      const bottom=volumeY(table,fraction); fraction+=layer.fraction;
      const top=volumeY(table,fraction);
      if (top-bottom>.0001) this.addLayer(layer,inner,bottom,top,scale,light,i===model.layers.length-1);
    });
    this.scene.background=new THREE.Color(background);
    this.renderer.getDrawingBufferSize(this.resolution);
    this.background.setSize(width,height);
    vessel.visible=false;
    const hidden: THREE.Object3D[]=[];
    this.liquid.traverse(object => {
      if (object instanceof THREE.Mesh && (object.material as THREE.Material).userData.aqueous) {
        object.visible=false; hidden.push(object);
      }
    });
    this.renderer.setRenderTarget(this.background);
    this.renderer.toneMapping=THREE.NoToneMapping;
    this.renderer.render(this.scene,this.camera);
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.setRenderTarget(null);
    vessel.visible=true; hidden.forEach(object=>{object.visible=true;});
    this.renderer.render(this.scene,this.camera);
    const canvas=document.createElement("canvas"); canvas.width=width; canvas.height=height;
    const g=canvas.getContext("2d")!;
    g.drawImage(this.renderer.domElement,0,0);
    // Keep the pixels seen THROUGH the glass while removing the rectangular
    // studio backdrop. This also works on selected tiles and custom HA themes.
    this.scene.background=null; this.scene.overrideMaterial=this.mask;
    this.renderer.setClearColor(0,0); this.renderer.render(this.scene,this.camera);
    g.globalCompositeOperation="destination-in"; g.drawImage(this.renderer.domElement,0,0);
    g.globalCompositeOperation="source-over"; this.scene.overrideMaterial=null;
    const lip=model.glass==="tall_glass"?3.80:2.56;
    const point=new THREE.Vector3(vessel.position.x,lip*scale,0).project(this.camera);
    const result={canvas,rim:{x:point.x*.5+.5,y:-point.y*.5+.5},scale};
    this.cache.set(key,result); this.cachedPixels+=width*height;
    // Bound CPU image memory as well as GPU resource use during slider drags.
    while (this.cachedPixels>4_000_000 && this.cache.size>1) {
      const oldest=this.cache.keys().next().value!;
      const image=this.cache.get(oldest)!;
      this.cachedPixels-=image.canvas.width*image.canvas.height; this.cache.delete(oldest);
    }
    return result;
  }

  /** Release GPU resources once all glass icons have left the dashboard. */
  dispose(): void {
    this.clearLiquid();
    for (const group of this.vessels.values()) group.traverse(object => {
      if (object instanceof THREE.Mesh) object.geometry.dispose();
    });
    this.glass.dispose(); this.mask.dispose(); this.crema.dispose(); this.foam.dispose();
    this.background.dispose(); this.environments.forEach(map=>map.dispose());
    this.pmrem.dispose(); this.renderer.dispose(); this.renderer.forceContextLoss();
    this.cache.clear();
  }
}

let engine: GlassRenderer | undefined;
let clients=0;
let idleTimer: ReturnType<typeof setTimeout> | undefined;
let failed=false;

/** Retain the shared renderer while an icon is mounted. GPU creation is lazy. */
export function retainGlassRenderer(): void {
  clients++; clearTimeout(idleTimer);
}

/** Delay disposal briefly to avoid rebuilding the engine while switching tabs. */
export function releaseGlassRenderer(): void {
  clients=Math.max(0,clients-1);
  if (!clients) idleTimer=setTimeout(()=>{engine?.dispose();engine=undefined;},5000);
}

/** Produce a cached image with one shared, lazily created renderer. */
export function renderGlass(model: GlassModel, pixels: number, background: string, light: boolean): GlassImage {
  if (failed) throw new Error("Glass rendering unavailable");
  try {
    engine??=new GlassRenderer();
    return engine.render(model,pixels,background,light);
  } catch (error) {
    failed=true; engine?.dispose(); engine=undefined;
    throw error;
  }
}
