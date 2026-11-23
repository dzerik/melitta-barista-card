const cache = new Map<string, HTMLCanvasElement>();
const mix = (a: number, b: number, t: number) => a+(b-a)*t;

function noise(x: number, y: number, seed: number): number {
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const smooth=(t: number)=>t*t*(3-2*t);
  const hash=(a: number,b: number)=>{
    let n=Math.imul(a+seed*19,374761393)^Math.imul(b+seed*53,668265263);
    n=Math.imul(n^(n>>>13),1274126177);
    return ((n^(n>>>16))>>>0)/4294967295;
  };
  return mix(mix(hash(ix,iy),hash(ix+1,iy),smooth(fx)),mix(hash(ix,iy+1),hash(ix+1,iy+1),smooth(fx)),smooth(fy));
}

function cloud(seed: number, light: boolean): HTMLCanvasElement {
  const key=seed+":"+light, hit=cache.get(key);
  if (hit) return hit;
  const canvas=document.createElement("canvas"); canvas.width=96; canvas.height=192;
  const g=canvas.getContext("2d")!, image=g.createImageData(96,192);
  const rgb=light?[132,124,112]:[237,228,212];
  const ease=(a: number,b: number,x: number)=>{
    const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t);
  };
  for (let y=0;y<192;y++) for (let x=0;x<96;x++) {
    const rise=1-y/191,u=x/95*2-1;
    const center=.23*Math.sin(rise*5+seed*.71)+.12*Math.sin(rise*11+seed*.37);
    const width=.075+rise*.32,curl=.11*Math.sin(rise*13+seed);
    const core=Math.exp(-Math.pow((u-center)/width,2)*1.3);
    const fold=.55*Math.exp(-Math.pow((u-center-curl)/(width*.65),2));
    const n=.56*noise(u*4+seed,rise*7,seed)+.29*noise(u*9,rise*16+seed,seed+31)+.15*noise(u*20,rise*35,seed+83);
    const density=(core+fold)*(.14+.86*n)*ease(0,.11,rise)*(1-ease(.52,1,rise));
    const i=(y*96+x)*4;
    image.data[i]=rgb[0]; image.data[i+1]=rgb[1]; image.data[i+2]=rgb[2];
    image.data[i+3]=Math.min(215,density*205);
  }
  g.putImageData(image,0,0);
  cache.set(key,canvas);
  // Twelve seed buckets × three plumes × two themes. Retain the entire
  // bounded set so mixed-theme dashboards never regenerate clouds per frame.
  if (cache.size>72) cache.delete(cache.keys().next().value!);
  return canvas;
}

/** Draw independently phased density clouds without redrawing the glass. */
export function drawGlassSteam(g: CanvasRenderingContext2D, width: number, height: number,
  rim: { x: number; y: number }, scale: number, seed: number, light: boolean, now: number, reduced: boolean): void {
  g.clearRect(0,0,width,height);
  const unit=width/5.6,lipX=rim.x*width,lipY=rim.y*height;
  const plumeHeight=Math.max(1,Math.min(unit*1.5*scale,(lipY-2)/1.1));
  for (let j=0;j<3;j++) {
    const phase=reduced?.35+j*.13:((now/1000/(4.1+(seed%7)*.19+j*.37)+j*.337+(seed%19)*.073)%1);
    const growth=.66+phase*.29, wind=Math.sin(phase*2.6+seed*1.6+j*.63)*unit*.1*phase;
    const w=unit*1.18*scale*(.72+phase*.36),h=plumeHeight*growth;
    g.save(); g.globalAlpha=Math.sin(phase*Math.PI)*.42;
    g.drawImage(cloud((seed%12)*31+j*13+7,light),lipX-w/2+wind+(j-1)*unit*.035,lipY-1-h-phase*plumeHeight*.12,w,h);
    g.restore();
  }
}
