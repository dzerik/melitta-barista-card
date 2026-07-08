function e(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new o(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:m}=Object,f=globalThis,u=f.trustedTypes,g=u?u.emptyScript:"",b=f.reactiveElementPolyfillSupport,_=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},x=(e,t)=>!c(e,t),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);r?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=s;const o=r.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){const o=this.constructor;if(!1===s&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??x)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[_("elementProperties")]=new Map,y[_("finalized")]=new Map,b?.({ReactiveElement:y}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=e=>e,C=w.trustedTypes,A=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+S,D=`<${P}>`,M=document,z=()=>M.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,L=Array.isArray,N="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,O=/>/g,F=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,H=/"/g,j=/^(?:script|style|textarea|title)$/i,I=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),q=I(1),K=I(2),W=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),G=new WeakMap,V=M.createTreeWalker(M,129);function Z(e,t){if(!L(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const X=(e,t)=>{const i=e.length-1,s=[];let r,o=2===t?"<svg>":3===t?"<math>":"",n=T;for(let t=0;t<i;t++){const i=e[t];let a,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===T?"!--"===c[1]?n=B:void 0!==c[1]?n=O:void 0!==c[2]?(j.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=F):void 0!==c[3]&&(n=F):n===F?">"===c[0]?(n=r??T,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?F:'"'===c[3]?H:U):n===H||n===U?n=F:n===B||n===O?n=T:(n=F,r=void 0);const p=n===F&&e[t+1].startsWith("/>")?" ":"";o+=n===T?i+D:l>=0?(s.push(a),i.slice(0,l)+E+i.slice(l)+S+p):i+S+(-2===l?t:p)}return[Z(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class J{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0;const n=e.length-1,a=this.parts,[c,l]=X(e,t);if(this.el=J.createElement(c,i),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=V.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(E)){const t=l[o++],i=s.getAttribute(e).split(S),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?se:"?"===n[1]?re:"@"===n[1]?oe:ie}),s.removeAttribute(e)}else e.startsWith(S)&&(a.push({type:6,index:r}),s.removeAttribute(e));if(j.test(s.tagName)){const e=s.textContent.split(S),t=e.length-1;if(t>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],z()),V.nextNode(),a.push({type:2,index:++r});s.append(e[t],z())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(S,e+1));)a.push({type:7,index:r}),e+=S.length-1}r++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,s){if(t===W)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=R(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);V.currentNode=s;let r=V.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new te(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new ne(r,this,e)),this._$AV.push(t),a=i[++n]}o!==a?.index&&(r=V.nextNode(),o++)}return V.currentNode=M,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),R(e)?e===Q||null==e||""===e?(this._$AH!==Q&&this._$AR(),this._$AH=Q):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>L(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Q&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new J(e)),t}k(e){L(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new te(this.O(z()),this.O(z()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Q}_$AI(e,t=this,i,s){const r=this.strings;let o=!1;if(void 0===r)e=Y(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==W,o&&(this._$AH=e);else{const s=e;let n,a;for(e=r[0],n=0;n<r.length-1;n++)a=Y(this,s[i+n],t,n),a===W&&(a=this._$AH[n]),o||=!R(a)||a!==this._$AH[n],a===Q?e=Q:e!==Q&&(e+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(e)}j(e){e===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Q?void 0:e}}class re extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Q)}}class oe extends ie{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??Q)===W)return;const i=this._$AH,s=e===Q&&i!==Q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==Q&&(i===Q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(J,te),(w.litHtmlVersions??=[]).push("3.3.2");const ce=globalThis;class le extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new te(t.insertBefore(z(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}le._$litElement$=!0,le.finalized=!0,ce.litElementHydrateSupport?.({LitElement:le});const de=ce.litElementPolyfillSupport;de?.({LitElement:le}),(ce.litElementVersions??=[]).push("4.2.2");const pe=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:x},me=(e=he,t,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,r,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];t.call(this,i),this.requestUpdate(s,r,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function fe(e){return(t,i)=>"object"==typeof i?me(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ue(e){return fe({...e,state:!0,attribute:!1})}const ge="2.1.9",be="melitta_barista",_e=["friendly_name","unit_of_measurement","state_class","icon"],ve=["coffee","milk","water"],xe=["none",...ve],$e=["very_mild","mild","medium","strong","very_strong"],ye=["standard","intense"],we=["cold","normal","high"],ke=["none","one","two","three"],Ce={c1:{min:5,max:250,step:5},c2:{min:0,max:250,step:5}},Ae=["espresso","cafe_creme","cappuccino","latte_macchiato","milk","milk_froth","water"],Ee={espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Milk",milk_froth:"Milk Froth",water:"Hot Water"},Se={Espresso:"espresso","Cafe Creme":"cafe_creme","Café Crème":"cafe_creme",Cappuccino:"cappuccino","Latte Macchiato":"latte_macchiato",Milk:"milk","Milk Froth":"milk_froth","Hot Water":"water"},Pe={ready:"var(--state-active-color, #4caf50)",brewing:"var(--warning-color, #ff9800)",cleaning:"var(--info-color, #2196f3)",descaling:"var(--info-color, #2196f3)",off:"var(--disabled-color, #9e9e9e)",busy:"var(--warning-color, #ff9800)",unavailable:"var(--error-color, #f44336)"},De=["energy_saving","auto_bean_select","rinsing_disabled"],Me=["water_hardness","auto_off_after","brew_temperature"],ze={energy_saving:{label:"Energy Saving",desc:"Reduce power when idle",icon:"mdi:lightning-bolt"},auto_bean_select:{label:"Auto Bean Select",desc:"Auto-choose bean hopper",icon:"mdi:seed"},rinsing_disabled:{label:"Rinsing Disabled",desc:"Skip auto rinse cycle",icon:"mdi:water-off"}},Re={water_hardness:{label:"Water Hardness",desc:"Calibrate for water type",icon:"mdi:water",format:"level"},auto_off_after:{label:"Auto Off",desc:"Minutes until shutdown",icon:"mdi:timer-outline",format:"minutes"},brew_temperature:{label:"Brew Temperature",desc:"Brewing water temp",icon:"mdi:thermometer",format:"level"}},Le=[{key:"easy_clean",suffix:"easy_clean",label:"Easy Clean",desc:"Quick rinse of the brew unit",icon:"mdi:broom",confirm:!0},{key:"intensive_clean",suffix:"intensive_clean",label:"Intensive Clean",desc:"Deep cleaning with tablet",icon:"mdi:spray-bottle",confirm:!0},{key:"descaling",suffix:"descaling",label:"Descaling",desc:"Remove limescale buildup",icon:"mdi:water-alert",confirm:!0},{key:"evaporating",suffix:"evaporating",label:"Evaporating",desc:"Purge the steam system",icon:"mdi:weather-fog",confirm:!0}],Ne=[{key:"filter_insert",suffix:"filter_insert",label:"Insert Filter",desc:"Start using a new water filter",icon:"mdi:filter-plus"},{key:"filter_replace",suffix:"filter_replace",label:"Replace Filter",desc:"Replace the current water filter",icon:"mdi:filter"},{key:"filter_remove",suffix:"filter_remove",label:"Remove Filter",desc:"Stop using the water filter",icon:"mdi:filter-remove"}],Te=[{key:"switch_off",suffix:"switch_off",label:"Switch Off",desc:"Turn off the machine",icon:"mdi:power",confirm:!0}],Be={0:"none",1:"one",2:"two",3:"three"};function Oe(e){return{process1:e.c1.process,intensity1:e.c1.intensity,aroma1:e.c1.aroma,portion1_ml:e.c1.portion_ml,temperature1:e.c1.temperature,shots1:e.c1.shots,process2:e.c2.process,intensity2:e.c2.intensity,aroma2:e.c2.aroma,portion2_ml:e.c2.portion_ml,temperature2:e.c2.temperature,shots2:e.c2.shots}}const Fe={very_mild:"V.Mild",mild:"Mild",medium:"Med",strong:"Strong",very_strong:"V.Strong",extra_strong:"X.Strong",cold:"Cold",normal:"Normal",high:"High",none:"None",one:"1",two:"2",three:"3",coffee:"Coffee",milk:"Milk",water:"Water",standard:"Std",intense:"Int+"},Ue={water_hardness:{1:"Soft",2:"Medium",3:"Hard",4:"Very Hard"},brew_temperature:{0:"Low",1:"Normal",2:"High"}},He={very_mild:1,mild:2,medium:3,strong:4,very_strong:5};function je(e,t,i,s,r=!1){return q`
    <div class="segment-picker ${r?"freestyle-disabled":""}">
      <span class="segment-label">${e}</span>
      <div class="segment-options">
        ${t.map(e=>q`
          <button class="segment-opt" ?data-active=${e===i}
            @click=${()=>s(e)}>${function(e){return Fe[e]||e.charAt(0).toUpperCase()+e.slice(1).replace(/_/g," ")}(e)}</button>
        `)}
      </div>
    </div>
  `}function Ie(e){const{spec:t,onChange:i,allowNoneProcess:s}=e,r="none"===t.process,o="coffee"===t.process,n=s?Ce.c2:Ce.c1,a=s?xe:ve;return q`
    <div class="${e.containerClass}">
      <div class="component-title">${e.title}</div>
      ${je("Process",a,t.process,e=>i({process:e}))}
      ${function(e,t,i,s,r,o,n=!1){return q`
    <div class="portion-row ${n?"freestyle-disabled":""}">
      <div class="portion-header">
        <span class="portion-label">${e}</span>
        <span class="portion-value">${t} ml</span>
      </div>
      <input type="range" class="portion-slider"
        min=${i} max=${s} step=${r} .value=${String(t)}
        @input=${e=>o(parseInt(e.target.value)||0)} />
    </div>
  `}("Portion",t.portion_ml,n.min,n.max,n.step,e=>i({portion_ml:e}),s&&r)}
      ${je("Intensity",$e,t.intensity,e=>i({intensity:e}),!o)}
      ${je("Aroma",ye,t.aroma,e=>i({aroma:e}),!o)}
      ${je(e.temperatureLabel??"Temp",we,t.temperature,e=>i({temperature:e}),s&&r)}
      ${je("Shots",ke,t.shots,e=>i({shots:e}),!o)}
    </div>
  `}const qe={Espresso:{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#C9A87C",height:.04}},Ristretto:{layers:[{color:"#1A0D04",height:.22}],foam:{color:"#B89970",height:.03}},Lungo:{layers:[{color:"#4A2A14",height:.5}],foam:{color:"#C9A87C",height:.04}},"Espresso Doppio":{layers:[{color:"#3E1F0D",height:.45}],foam:{color:"#C9A87C",height:.04}},"Ristretto Doppio":{layers:[{color:"#1A0D04",height:.4}],foam:{color:"#B89970",height:.03}},"Café Crème":{layers:[{color:"#5C3A1E",height:.5}],foam:{color:"#E8D5B7",height:.08}},"Café Crème Doppio":{layers:[{color:"#5C3A1E",height:.58}],foam:{color:"#E8D5B7",height:.08}},Americano:{layers:[{color:"#3E1F0D",height:.6}]},"Americano Extra":{layers:[{color:"#2C1507",height:.65}]},"Long Black":{layers:[{color:"#3E1F0D",height:.55}],foam:{color:"#C9A87C",height:.05}},"Red Eye":{layers:[{color:"#2C1507",height:.6}]},"Black Eye":{layers:[{color:"#1A0D04",height:.65}]},"Dead Eye":{layers:[{color:"#0F0803",height:.7}]},Cappuccino:{layers:[{color:"#3E1F0D",height:.28},{color:"#D4B896",height:.22}],foam:{color:"#F5EDE0",height:.18}},"Espresso Macchiato":{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#F5EDE0",height:.12}},"Caffè Latte":{tall:!0,layers:[{color:"#E8D5B7",height:.35},{color:"#8B5A30",height:.18}],foam:{color:"#F5EDE0",height:.1}},"Café au Lait":{layers:[{color:"#C9A87C",height:.5}],foam:{color:"#F0E6D8",height:.06}},"Flat White":{layers:[{color:"#3E1F0D",height:.2},{color:"#D4B896",height:.3}],foam:{color:"#F0E6D8",height:.05}},"Latte Macchiato":{tall:!0,layers:[{color:"#F0E6D8",height:.28},{color:"#6B4226",height:.12},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.15}},"Latte Macchiato Extra":{tall:!0,layers:[{color:"#F0E6D8",height:.25},{color:"#5C3A1E",height:.16},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.14}},"Latte Macchiato Triple":{tall:!0,layers:[{color:"#F0E6D8",height:.22},{color:"#4A2A14",height:.2},{color:"#E8D5B7",height:.1}],foam:{color:"#FEFCFA",height:.14}},Milk:{tall:!0,layers:[{color:"#F0E6D8",height:.55}]},"Milk Froth":{tall:!0,layers:[{color:"#F0E6D8",height:.15}],foam:{color:"#FEFCFA",height:.4}},"Hot Water":{layers:[{color:"#9DC4D8",height:.5}]}};qe["Cafe Creme"]=qe["Café Crème"],qe["Cafe Creme Doppio"]=qe["Café Crème Doppio"],qe["Caffe Latte"]=qe["Caffè Latte"],qe["Cafe au Lait"]=qe["Café au Lait"];const Ke={layers:[{color:"#5C3A1E",height:.45}]};function We(e,t,i){const s=qe[e]||Ke,r=s.tall,o=r?36:50,n=r?30:42,a=r?68:48,c=r?12:28,l=c+a,d=r?50:46,p=d-o/2,h=d+o/2,m=d-n/2,f=d+n/2,u=`M ${p} ${c} L ${m+4} ${l-4} Q ${m} ${l} ${m+4} ${l} L ${f-4} ${l} Q ${f} ${l} ${f-4} ${l-4} L ${h} ${c}`,g=1.5,b=p+g,_=h-g,v=m+g+1.2,x=f-g-1.2,$=c+g,y=l-g,w=2.8,k=`M ${b} ${$} L ${v+w} ${y-w} Q ${v} ${y} ${v+w} ${y} L ${x-w} ${y} Q ${x} ${y} ${x-w} ${y-w} L ${_} ${$} Z`,C=(e,t)=>{const i=(e-$)/(y-$);return t?b+(v-b)*i:_+(x-_)*i};let A=y;const E=[],S=[...s.layers];for(let e=S.length-1;e>=0;e--){const{color:t,height:i}=S[e],s=A,r=A-a*i;A=r;const o=C(r,!0),n=C(r,!1),c=C(s,!0),l=C(s,!1),d=e===S.length-1,p=d?w:0,h=d?`M ${o} ${r} L ${c+p} ${s-p} Q ${c} ${s} ${c+p} ${s} L ${l-p} ${s} Q ${l} ${s} ${l-p} ${s-p} L ${n} ${r} Z`:`M ${o} ${r} L ${c} ${s} L ${l} ${s} L ${n} ${r} Z`;E.push({d:h,fill:t})}if(s.foam){const e=A,t=A-a*s.foam.height;A=t;const i=C(t,!0),r=C(t,!1),o=C(e,!0),n=C(e,!1);E.push({d:`M ${i} ${t} L ${o} ${e} L ${n} ${e} L ${r} ${t} Z`,fill:s.foam.color})}const P=h,D=c+.18*a,M=c+.65*a,z=r?10:14,R=`M ${d-6} ${c-2} Q ${d-8} ${c-10} ${d-5} ${c-16}`,L=`${R};M ${d-6} ${c-2} Q ${d-4} ${c-10} ${d-7} ${c-16};${R}`,N=`M ${d+1} ${c-3} Q ${d+3} ${c-11} ${d} ${c-18}`,T=`${N};M ${d+1} ${c-3} Q ${d-1} ${c-11} ${d+2} ${c-18};${N}`,B=`M ${d+8} ${c-2} Q ${d+6} ${c-9} ${d+9} ${c-15}`,O=`${B};M ${d+8} ${c-2} Q ${d+10} ${c-9} ${d+7} ${c-15};${B}`;return K`
    <svg width="${t}" height="${1.15*t}" viewBox="0 0 ${100} ${115}" fill="none">
      <defs>
        <clipPath id="clip-${i}">
          <path d="${k}" />
        </clipPath>
        <linearGradient id="refl-${i}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="0.18" />
          <stop offset="15%" stop-color="white" stop-opacity="0.06" />
          <stop offset="50%" stop-color="white" stop-opacity="0" />
          <stop offset="80%" stop-color="white" stop-opacity="0.03" />
          <stop offset="100%" stop-color="white" stop-opacity="0.10" />
        </linearGradient>
        <linearGradient id="spec-${i}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="0.35" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <filter id="sg-${i}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <linearGradient id="rf-${i}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0.15" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <mask id="rm-${i}">
          <rect x="0" y="${l+1}" width="${100}" height="${.4*a}" fill="url(#rf-${i})" />
        </mask>
      </defs>

      ${"Milk"!==e&&"Milk Froth"!==e&&"Hot Water"!==e?K`
        <g opacity="0.20" stroke="rgba(255,255,255,0.6)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#sg-${i})">
          <path d="${R}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${L}" /></path>
          <path d="${N}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${T}" /></path>
          <path d="${B}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${O}" /></path>
        </g>
        <g opacity="0.40" stroke="#D4C4A0" stroke-width="1" fill="none" stroke-linecap="round">
          <path d="${R}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${L}" /></path>
          <path d="${N}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${T}" /></path>
          <path d="${B}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${O}" /></path>
        </g>
      `:Q}

      <path d="${u}" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-linejoin="round" />

      <g clip-path="url(#clip-${i})">
        ${E.map(e=>K`<path d="${e.d}" fill="${e.fill}" />`)}
      </g>

      <path d="${u}" fill="url(#refl-${i})" clip-path="url(#clip-${i})" />
      <path d="M ${p+1.5} ${c+3} L ${m+2.5} ${l-5} L ${m+2.5+(r?4:5)} ${l-5} L ${p+1.5+(r?4:5)} ${c+3} Z" fill="url(#spec-${i})" />
      <line x1="${h-2.5}" y1="${c+5}" x2="${f-3}" y2="${l-7}" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round" />
      <line x1="${p+3}" y1="${c+.5}" x2="${h-3}" y2="${c+.5}" stroke="rgba(255,255,255,0.20)" stroke-width="1" stroke-linecap="round" />

      <path d="M ${P} ${D} C ${P+z} ${D-2}, ${P+z} ${M+2}, ${P} ${M}" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="none" stroke-linecap="round" />

      <g mask="url(#rm-${i})">
        <g transform="translate(0, ${2*l+2}) scale(1, -1)">
          <path d="${u}" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linejoin="round" />
          <g clip-path="url(#clip-${i})" opacity="0.5">
            ${E.map(e=>K`<path d="${e.d}" fill="${e.fill}" />`)}
          </g>
          <path d="M ${P} ${D} C ${P+z} ${D-2}, ${P+z} ${M+2}, ${P} ${M}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" />
        </g>
      </g>
    </svg>
  `}function Qe(e,t){return q`
    <div class="card-header">
      <span class="machine-name">${e}</span>
      <div class="connection-dot"
        style="background: ${t?"var(--mbc-success)":"var(--mbc-error)"}"></div>
    </div>
  `}function Ge(e){const t=e.data.profiles[e.data.activeProfile]??{};return 0===Object.keys(t).length?Q:q`
    <div class="dk-grid">
      ${Ae.map(i=>{const s=t[i];if(!s)return Q;const r=e.selected===i,o=void 0!==s.c1_process&&"none"!==s.c1_process;return q`
          <button class="dk-card" ?data-selected=${r}
            @click=${()=>e.onCardClick(i)}
            @pointerdown=${()=>e.onLongPressStart(i,s)}
            @pointerup=${()=>e.onLongPressCancel()}
            @pointerleave=${()=>e.onLongPressCancel()}
            @contextmenu=${e=>e.preventDefault()}>
            <div style="${r&&o?"opacity: 0.15":""}">
              ${We(Ee[i],48,`dk-${i}`)}
            </div>
            ${r&&o?q`
              <div class="dk-card-overlay">
                ${function(e){const t=[];e.c1_process&&"none"!==e.c1_process&&t.push({process:e.c1_process,intensity:e.c1_intensity,ml:e.c1_portion_ml});e.c2_process&&"none"!==e.c2_process&&t.push({process:e.c2_process,intensity:e.c2_intensity,ml:e.c2_portion_ml});return 0===t.length?Q:q`
    <div class="dk-recipe-info">
      ${t.map(e=>q`
        <div class="dk-recipe-row">
          <span class="dk-recipe-ml">${e.ml}<span class="dk-recipe-ml-unit">ml</span></span>
          ${"coffee"===e.process?q`
            <span class="intensity-dots">
              ${[1,2,3,4,5].map(t=>q`
                <span class="intensity-dot" ?data-on=${t<=(He[e.intensity]||3)}></span>
              `)}
            </span>
          `:Q}
        </div>
      `)}
    </div>
  `}(s)}
              </div>
            `:Q}
            <span class="dk-card-label">
              ${r?`Brew ${Ee[i]}`:Ee[i]}
            </span>
          </button>
        `})}

      <!-- 2x toggle -->
      <button class="dk-card" ?data-selected=${e.twoCups}
        @click=${()=>e.onToggleTwoCups()}>
        <div style="display:flex;align-items:center;justify-content:center;width:48px;height:55px;font-size:1.6em;font-weight:700;color:var(--mbc-text);opacity:${e.twoCups?"1":"0.35"}">
          2x
        </div>
        <span class="dk-card-label">${e.twoCups?"2x ON":"2x"}</span>
      </button>

    </div>
  `}function Ve(e){return null!=e&&"unknown"!==e&&"unavailable"!==e&&"None"!==e}function Ze(e,t,i){return e.callService("button","press",{entity_id:`button.${t}_${i}`})}function Xe(e,t,i,s){return e.callService("select","select_option",{entity_id:`select.${t}_${i}`,option:s})}const Je={favoritesList:`${be}/sommelier/favorites/list`,hoppersGet:`${be}/sommelier/hoppers/get`,generate:`${be}/sommelier/generate`,brew:`${be}/sommelier/brew`,favoritesBrew:`${be}/sommelier/favorites/brew`};async function Ye(e){return(await e.callWS({type:Je.favoritesList})).favorites}function et(e){const t=new Set;for(const i of Object.keys(e.states)){const e=i.match(/^button\.(.+?)_brew$/);e&&t.add(e[1])}const i=[];for(const s of t){const t=e.states[`sensor.${s}_state`];if(!t)continue;const r=t.attributes.friendly_name,o=r?r.replace(/\s*State$/,""):s.replace(/_/g," ");i.push({prefix:s,name:o})}return i}const tt=n`
  :host {
    --mbc-bg: var(--ha-card-background, var(--card-background-color, #1a1a1a));
    --mbc-text: var(--primary-text-color, #e5e5e5);
    --mbc-text2: var(--secondary-text-color, #a3a3a3);
    --mbc-border: rgba(255, 255, 255, 0.06);
    --mbc-surface: rgba(255, 255, 255, 0.03);
    --mbc-surface-hover: rgba(255, 255, 255, 0.06);
    --mbc-accent: var(--primary-color, #03a9f4);
    --mbc-error: var(--error-color, #f44336);
    --mbc-success: var(--state-active-color, #4caf50);
    --mbc-warning: var(--warning-color, #ff9800);
    --mbc-radius: 12px;
  }
  ha-card { overflow: hidden; background: var(--mbc-bg); }

  /* -- No device / Offline -- */
  .no-device {
    padding: 40px 20px;
    text-align: center;
    color: var(--mbc-text2);
  }
  .no-device ha-icon { --mdc-icon-size: 48px; opacity: 0.3; }
  .no-device p { margin: 8px 0 0; }
  .no-device .hint { font-size: 0.8em; opacity: 0.6; }

  .offline-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 16px 32px;
    color: var(--mbc-text2);
    font-size: 0.85em;
  }
  .offline-section ha-icon { --mdc-icon-size: 32px; opacity: 0.3; }

  /* -- Header -- */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 0;
  }
  .machine-name {
    font-size: 0.7em;
    font-weight: 500;
    color: var(--mbc-text2);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .connection-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background 0.3s;
  }

  .section-title {
    font-size: 0.65em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--mbc-text2);
    padding: 12px 16px 6px;
    opacity: 0.7;
  }

  /* -- Status -- */
  .status-section { padding: 8px 16px 12px; }
  .state-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .state-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: 500;
    letter-spacing: 0.03em;
  }

  /* Progress bar */
  .progress-container {
    height: 3px;
    background: var(--mbc-border);
    border-radius: 2px;
    margin: 10px 0 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.5s ease;
    position: relative;
  }
  .progress-fill::after {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 40px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
    animation: progress-shimmer 1.5s infinite;
  }
  @keyframes progress-shimmer {
    0% { opacity: 0; transform: translateX(-40px); }
    50% { opacity: 1; }
    100% { opacity: 0; transform: translateX(40px); }
  }

  /* -- Action alert -- */
  .action-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    margin: 0 12px 8px;
    border-radius: var(--mbc-radius);
    background: color-mix(in srgb, var(--mbc-error) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--mbc-error) 20%, transparent);
    color: var(--mbc-error);
    font-size: 0.82em;
    font-weight: 500;
  }
  .action-alert ha-icon { --mdc-icon-size: 18px; flex-shrink: 0; }

  /* -- Brewing view -- */
  .brewing-view {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    margin: 0 12px 8px;
    border-radius: var(--mbc-radius);
    background: var(--mbc-surface);
    border: 1px solid var(--mbc-border);
    animation: brewing-fade-in 0.3s ease both;
  }
  @keyframes brewing-fade-in {
    from { opacity: 0; transform: scale(0.97); }
    to { opacity: 1; transform: scale(1); }
  }
  .brewing-icon-wrap {
    flex-shrink: 0;
    animation: brewing-pulse 2s ease-in-out infinite;
  }
  @keyframes brewing-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .brewing-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .brewing-recipe {
    font-size: 0.85em;
    font-weight: 600;
    color: var(--mbc-text);
  }
  .brewing-activity {
    font-size: 0.72em;
    color: var(--mbc-text2);
  }
  .brewing-progress {
    height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 2px;
  }
  .brewing-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--mbc-warning);
    transition: width 0.5s ease;
    position: relative;
  }
  .brewing-progress-fill::after {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 30px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
    animation: progress-shimmer 1.5s infinite;
  }
  .brewing-percent {
    font-size: 0.65em;
    font-weight: 700;
    color: var(--mbc-warning);
    font-variant-numeric: tabular-nums;
  }
  .brewing-cancel {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--mbc-error) 30%, transparent);
    background: color-mix(in srgb, var(--mbc-error) 8%, transparent);
    color: var(--mbc-error);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    padding: 0;
  }
  .brewing-cancel ha-icon { --mdc-icon-size: 16px; }
  .brewing-cancel:hover { background: color-mix(in srgb, var(--mbc-error) 18%, transparent); }
  .brewing-cancel:active { transform: scale(0.9); }

  /* -- Profile tab bar -- */
  .profile-tabs {
    display: flex;
    overflow-x: auto;
    background: rgba(0,0,0,0.3);
    scrollbar-width: none;
  }
  .profile-tabs::-webkit-scrollbar { display: none; }
  .profile-tab {
    flex: 1;
    min-width: 70px;
    padding: 10px 12px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.35);
    font-size: 0.6em;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    position: relative;
    font-family: inherit;
    transition: color 0.2s;
  }
  .profile-tab[data-active] {
    color: #ffffff;
  }
  .profile-tab-indicator {
    position: absolute;
    bottom: 0;
    left: 12px;
    right: 12px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  }

  /* -- DirectKey grid -- */
  .dk-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 1px;
    background: var(--mbc-border);
  }
  .dk-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 4px 20px;
    background: var(--mbc-surface);
    border: none;
    cursor: pointer;
    overflow: hidden;
    transition: background 0.3s;
    font-family: inherit;
  }
  .dk-card:active { transform: scale(0.97); }
  .dk-card[data-selected] {
    background: rgba(255,255,255,0.08);
  }
  .dk-card-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.55em;
    padding: 4px 2px;
    font-weight: 500;
    color: var(--mbc-text2);
    transition: all 0.3s;
    z-index: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dk-card[data-selected] .dk-card-label {
    background: var(--mbc-text);
    color: var(--mbc-bg);
    font-weight: 600;
  }
  .dk-card-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    background: rgba(0,0,0,0.5);
    animation: overlay-in 0.2s ease both;
  }
  @keyframes overlay-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .dk-recipe-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 0.62em;
    color: var(--mbc-text);
  }
  .dk-recipe-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .dk-recipe-ml {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .dk-recipe-ml-unit {
    font-size: 0.8em;
    font-weight: 400;
    color: var(--mbc-text2);
  }
  .intensity-dots {
    display: inline-flex;
    gap: 2px;
  }
  .intensity-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--mbc-text) 20%, transparent);
  }
  .intensity-dot[data-on] { background: var(--mbc-text); }

  /* -- All Recipes divider -- */
  .recipes-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px;
    background: var(--mbc-bg);
  }
  .recipes-divider-line {
    flex: 1;
    height: 1px;
    background: var(--mbc-border);
  }
  .recipes-divider-text {
    font-size: 0.55em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--mbc-text2);
    opacity: 0.6;
  }

  /* -- Recipe grid -- */
  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    gap: 4px;
    padding: 4px 12px 8px;
  }
  .recipe-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px 6px;
    border-radius: var(--mbc-radius);
    background: var(--mbc-surface);
    border: 1px solid var(--mbc-border);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .recipe-card:hover { background: var(--mbc-surface-hover); }
  .recipe-card:active { transform: scale(0.96); }
  .recipe-card[data-selected] {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }
  .recipe-card[data-selected]::before {
    content: "";
    position: absolute;
    top: 4px; right: 4px;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: white;
  }
  .recipe-name {
    font-size: 0.6em;
    color: var(--mbc-text2);
    font-weight: 500;
    margin-top: 3px;
    text-align: center;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  /* -- Brew button -- */
  .brew-row { padding: 4px 12px 12px; }
  .brew-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 10px 16px;
    border: none;
    border-radius: var(--mbc-radius);
    background: var(--mbc-text);
    color: var(--mbc-bg);
    font-size: 0.85em;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
    letter-spacing: 0.02em;
  }
  .brew-btn ha-icon { --mdc-icon-size: 18px; }
  .brew-btn:hover:not(:disabled) { opacity: 0.88; }
  .brew-btn:active:not(:disabled) { transform: scale(0.97); }
  .brew-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* -- Freestyle -- */
  .freestyle-section { padding: 4px 12px 12px; }
  .freestyle-name-row { margin-bottom: 10px; }
  .freestyle-name-input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--mbc-border);
    border-radius: 8px;
    background: var(--mbc-surface);
    color: var(--mbc-text);
    font-size: 0.85em;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .freestyle-name-input:focus { outline: none; border-color: var(--mbc-accent); }

  .freestyle-components {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .freestyle-component {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .component-title {
    font-size: 0.65em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--mbc-text2);
    opacity: 0.7;
    margin-bottom: 2px;
  }

  .segment-picker {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .segment-label {
    font-size: 0.65em;
    font-weight: 500;
    color: var(--mbc-text2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .segment-options {
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--mbc-border);
  }
  .segment-opt {
    flex: 1;
    padding: 5px 2px;
    border: none;
    background: var(--mbc-surface);
    color: var(--mbc-text2);
    font-size: 0.62em;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    text-transform: capitalize;
  }
  .segment-opt + .segment-opt { border-left: 1px solid var(--mbc-border); }
  .segment-opt[data-active] {
    background: var(--mbc-text);
    color: var(--mbc-bg);
    font-weight: 700;
  }
  .segment-opt:hover:not([data-active]) { background: var(--mbc-surface-hover); }

  .portion-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .portion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .portion-label {
    font-size: 0.65em;
    font-weight: 500;
    color: var(--mbc-text2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .portion-value {
    font-size: 0.68em;
    font-weight: 700;
    color: var(--mbc-text);
    font-variant-numeric: tabular-nums;
  }
  .portion-slider {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  .portion-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--mbc-text);
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }

  .freestyle-disabled { opacity: 0.25; pointer-events: none; }
  .freestyle-brew-row { margin-top: 10px; }

  /* -- Settings -- */
  .settings-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 12px 12px;
  }
  .setting-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--mbc-radius);
    background: var(--mbc-surface);
    border: 1px solid var(--mbc-border);
    transition: background 0.2s;
  }
  .setting-icon {
    --mdc-icon-size: 18px;
    color: var(--mbc-text2);
    opacity: 0.6;
    flex-shrink: 0;
  }
  .setting-info { flex: 1; min-width: 0; }
  .setting-label {
    font-size: 0.82em;
    font-weight: 500;
    color: var(--mbc-text);
  }
  .setting-desc {
    font-size: 0.68em;
    color: var(--mbc-text2);
    opacity: 0.7;
    margin-top: 1px;
  }
  .setting-value {
    font-size: 0.82em;
    font-weight: 600;
    color: var(--mbc-text);
    white-space: nowrap;
  }

  .toggle-track {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: rgba(255,255,255,0.12);
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
    border: none;
    padding: 0;
  }
  .toggle-track[data-on] { background: var(--mbc-text); }
  .toggle-thumb {
    position: absolute;
    top: 2px; left: 2px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transition: transform 0.2s, background 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  .toggle-track[data-on] .toggle-thumb {
    transform: translateX(16px);
    background: var(--mbc-bg);
  }

  /* -- Stats -- */
  .stats-section { padding: 4px 12px 12px; }
  .stats-total {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 12px 0 16px;
    border-bottom: 1px solid var(--mbc-border);
    margin-bottom: 10px;
  }
  .stats-total-number {
    font-size: 2.5em;
    font-weight: 200;
    color: var(--mbc-text);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .stats-total-label {
    font-size: 0.6em;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--mbc-text2);
    opacity: 0.7;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 4px;
  }
  .stats-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px 6px;
    border-radius: var(--mbc-radius);
    background: var(--mbc-surface);
    border: 1px solid var(--mbc-border);
    position: relative;
    overflow: hidden;
  }
  .stats-card[data-top] {
    border-color: rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
  }
  .stats-card[data-top]::after {
    content: "";
    position: absolute;
    top: 4px;
    right: 4px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--mbc-accent);
  }
  .stats-recipe-name {
    font-size: 0.6em;
    color: var(--mbc-text2);
    font-weight: 500;
    margin-top: 2px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  .stats-recipe-count {
    font-size: 1em;
    font-weight: 300;
    color: var(--mbc-text2);
    margin-top: 2px;
    font-variant-numeric: tabular-nums;
  }
  .stats-card[data-top] .stats-recipe-count {
    color: var(--mbc-text);
  }
  .stats-empty {
    text-align: center;
    padding: 20px;
    color: var(--mbc-text2);
    font-size: 0.8em;
    opacity: 0.6;
  }
  .stats-unavailable {
    text-align: center;
    padding: 20px;
    color: var(--mbc-text2);
    font-size: 0.8em;
  }

  /* -- Maintenance -- */
  .maint-section { padding: 4px 12px 12px; }
  .maint-group-title {
    font-size: 0.6em;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--mbc-text2);
    opacity: 0.6;
    margin-bottom: 6px;
    margin-top: 8px;
  }
  .maint-group-title:first-child { margin-top: 0; }
  .maint-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
  }
  .maint-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--mbc-radius);
    background: var(--mbc-surface);
    border: 1px solid var(--mbc-border);
    transition: all 0.2s;
  }
  .maint-card[data-confirming] {
    border-color: color-mix(in srgb, var(--mbc-error) 30%, transparent);
    background: color-mix(in srgb, var(--mbc-error) 5%, transparent);
  }
  .maint-icon {
    --mdc-icon-size: 18px;
    color: var(--mbc-text2);
    opacity: 0.6;
    flex-shrink: 0;
  }
  .maint-info { flex: 1; min-width: 0; }
  .maint-label {
    font-size: 0.82em;
    font-weight: 500;
    color: var(--mbc-text);
  }
  .maint-desc {
    font-size: 0.68em;
    color: var(--mbc-text2);
    opacity: 0.7;
    margin-top: 1px;
  }
  .maint-btn {
    flex-shrink: 0;
    padding: 5px 12px;
    border-radius: 8px;
    border: 1px solid var(--mbc-border);
    background: var(--mbc-surface);
    color: var(--mbc-text2);
    font-size: 0.72em;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .maint-btn:hover:not(:disabled) { background: var(--mbc-surface-hover); }
  .maint-btn:active:not(:disabled) { transform: scale(0.95); }
  .maint-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .maint-btn[data-confirm] {
    border-color: color-mix(in srgb, var(--mbc-error) 40%, transparent);
    background: color-mix(in srgb, var(--mbc-error) 10%, transparent);
    color: var(--mbc-error);
  }

  /* -- Recipe Edit Dialog -- */
  .edit-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
  }
  .edit-dialog {
    width: 90%;
    max-width: 480px;
    max-height: 85vh;
    border-radius: 16px;
    background: var(--mbc-bg);
    border: 1px solid var(--mbc-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .edit-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--mbc-border);
  }
  .edit-title {
    font-size: 0.85em;
    font-weight: 600;
    color: var(--mbc-text);
    letter-spacing: 0.03em;
  }
  .edit-close {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: var(--mbc-surface);
    color: var(--mbc-text2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    padding: 0;
  }
  .edit-close ha-icon { --mdc-icon-size: 16px; }
  .edit-close:hover { background: var(--mbc-surface-hover); }
  .edit-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
  }
  .edit-component {
    margin-bottom: 16px;
  }
  .edit-component:last-child { margin-bottom: 8px; }
  .edit-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--mbc-border);
  }
  .edit-btn-cancel {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid var(--mbc-border);
    background: transparent;
    color: var(--mbc-text2);
    font-size: 0.8em;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .edit-btn-cancel:hover { background: var(--mbc-surface); }
  .edit-btn-save {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    background: var(--mbc-text);
    color: var(--mbc-bg);
    font-size: 0.8em;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .edit-btn-save:hover { opacity: 0.88; }
  .edit-btn-save:active { transform: scale(0.97); }
  .edit-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

`;let it=class extends le{setConfig(e){this._config=e}_fireConfigChanged(){const e=new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0});this.dispatchEvent(e)}_valueChanged(e,t){const i=t.target,s=i instanceof HTMLInputElement&&"checkbox"===i.type?i.checked:i.value;this._config={...this._config,[e]:s},this._fireConfigChanged()}_deviceSelected(e){const t=e.target.value;if("__manual__"===t)return this._config={...this._config,entity_prefix:""},void this._fireConfigChanged();const i=(this.hass?et(this.hass):[]).find(e=>e.prefix===t);this._config={...this._config,entity_prefix:t,name:i?.name||this._config.name},this._fireConfigChanged()}render(){if(!this._config)return Q;const e=this.hass?et(this.hass):[],t=this._config.entity_prefix||"",i=e.some(e=>e.prefix===t),s=t&&!i&&e.length>0;return q`
      ${e.length>0?q`
            <div class="editor-row">
              <label for="device">Device</label>
              <select id="device" @change=${this._deviceSelected}>
                ${e.map(e=>q`
                    <option value=${e.prefix} ?selected=${e.prefix===t}>
                      ${e.name}
                    </option>
                  `)}
                <option value="__manual__" ?selected=${s}>
                  Enter manually...
                </option>
              </select>
            </div>
          `:q`
            <div class="editor-row">
              <label for="entity_prefix">Entity Prefix</label>
              <input
                id="entity_prefix"
                .value=${t}
                placeholder="Auto-detected if integration is running"
                @input=${e=>this._valueChanged("entity_prefix",e)}
              />
              <span class="hint">No Melitta devices detected. Enter prefix manually or check that the integration is configured.</span>
            </div>
          `}

      ${s?q`
            <div class="editor-row">
              <label for="entity_prefix">Entity Prefix</label>
              <input
                id="entity_prefix"
                .value=${t}
                @input=${e=>this._valueChanged("entity_prefix",e)}
              />
            </div>
          `:""}

      <div class="editor-row">
        <label for="name">Name</label>
        <input
          id="name"
          .value=${this._config.name||"Melitta Barista"}
          @input=${e=>this._valueChanged("name",e)}
        />
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_header"
          .checked=${!1!==this._config.show_header}
          @change=${e=>this._valueChanged("show_header",e)} />
        <label for="show_header">Show header</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_status"
          .checked=${!1!==this._config.show_status}
          @change=${e=>this._valueChanged("show_status",e)} />
        <label for="show_status">Show status</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_profiles"
          .checked=${!1!==this._config.show_profiles}
          @change=${e=>this._valueChanged("show_profiles",e)} />
        <label for="show_profiles">Show profile selector</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_recipes"
          .checked=${!1!==this._config.show_recipes}
          @change=${e=>this._valueChanged("show_recipes",e)} />
        <label for="show_recipes">Show recipe selector</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_freestyle"
          .checked=${this._config.show_freestyle||!1}
          @change=${e=>this._valueChanged("show_freestyle",e)} />
        <label for="show_freestyle">Show freestyle recipe</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_sommelier"
          .checked=${this._config.show_sommelier||!1}
          @change=${e=>this._valueChanged("show_sommelier",e)} />
        <label for="show_sommelier">Show AI Sommelier</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_stats"
          .checked=${this._config.show_stats||!1}
          @change=${e=>this._valueChanged("show_stats",e)} />
        <label for="show_stats">Show cup statistics</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_maintenance"
          .checked=${this._config.show_maintenance||!1}
          @change=${e=>this._valueChanged("show_maintenance",e)} />
        <label for="show_maintenance">Show maintenance</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_settings"
          .checked=${this._config.show_settings||!1}
          @change=${e=>this._valueChanged("show_settings",e)} />
        <label for="show_settings">Show settings</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="compact"
          .checked=${this._config.compact||!1}
          @change=${e=>this._valueChanged("compact",e)} />
        <label for="compact">Compact mode</label>
      </div>
    `}static get styles(){return n`
      .editor-row {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
      }
      label {
        font-weight: 500;
        margin-bottom: 4px;
        font-size: 0.9em;
      }
      input[type="text"],
      input:not([type]),
      select {
        padding: 8px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px;
        font-size: 0.9em;
        background: var(--ha-card-background, var(--card-background-color, white));
        color: var(--primary-text-color);
      }
      select { cursor: pointer; }
      .hint {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }
      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
    `}};e([fe({attribute:!1})],it.prototype,"hass",void 0),e([ue()],it.prototype,"_config",void 0),it=e([pe("melitta-barista-card-editor")],it);let st=class extends le{constructor(){super(...arguments),this._favorites=[],this._hoppers={hopper1:null,hopper2:null},this._loaded=!1,this._error=!1,this._generating=!1,this._quickRecipe=null,this._loading=!1}willUpdate(e){!this.hass||this._loaded||this._loading||this._error||this._loadData()}async _loadData(){this._loading=!0;try{const[t,i]=await Promise.all([Ye(this.hass),(e=this.hass,e.callWS({type:Je.hoppersGet}))]);this._favorites=t.slice(0,3),this._hoppers=i,this._loaded=!0}catch(e){console.warn("[melitta-card] Sommelier not available:",e),this._error=!0}finally{this._loading=!1}var e}_retry(){this._error=!1}_notify(e){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e},bubbles:!0,composed:!0}))}async _surpriseMe(){if(this.hass&&!this._generating){this._generating=!0,this._quickRecipe=null;try{this._quickRecipe=await async function(e){return(await e.callWS({type:Je.generate,mode:"surprise_me",count:1})).session.recipes[0]??null}(this.hass)}catch(e){console.error("[melitta-card] Generate failed:",e),this._notify("Sommelier: recipe generation failed")}finally{this._generating=!1}}}async _brewRecipe(e){if(this.hass)try{await function(e,t){return e.callWS({type:Je.brew,recipe_id:t})}(this.hass,e),this._quickRecipe=null}catch(e){console.error("[melitta-card] Brew failed:",e),this._notify("Sommelier: brew failed")}}async _brewFavorite(e){var t,i;if(this.hass)try{await(t=this.hass,i=e,t.callWS({type:Je.favoritesBrew,favorite_id:i})),this._favorites=this._favorites.map(t=>t.id===e?{...t,brew_count:(t.brew_count??0)+1}:t)}catch(e){console.error("[melitta-card] Brew favorite failed:",e),this._notify("Sommelier: brew failed")}}render(){return q`
      <div class="section-title">
        <ha-icon icon="mdi:coffee-maker-check-outline"></ha-icon> AI Sommelier
      </div>
      <div class="mbc-section">${this._renderBody()}</div>
    `}_renderBody(){if(this._error)return q`
        <div class="som-error">
          <span>Sommelier is not available.</span>
          <button class="som-retry-btn" @click=${()=>this._retry()}>Retry</button>
        </div>
      `;if(!this._loaded)return q`<span class="som-loading">Loading...</span>`;const e=this._hoppers.hopper1?.bean,t=this._hoppers.hopper2?.bean;return q`
      ${e||t?q`
        <div class="som-hoppers">
          ${e?q`<span class="som-hopper-tag">H1: ${e.brand} ${e.product}</span>`:Q}
          ${t?q`<span class="som-hopper-tag">H2: ${t.brand} ${t.product}</span>`:Q}
        </div>
      `:Q}

      ${this._favorites.length>0?q`
        <div class="som-favorites">
          ${this._favorites.map(e=>q`
            <div class="som-fav-row">
              <div class="som-fav-info">
                <span class="som-fav-name">★ ${e.name}</span>
                <span class="som-fav-count">${e.brew_count}×</span>
              </div>
              <button class="som-brew-btn" @click=${()=>this._brewFavorite(e.id)}>
                <ha-icon icon="mdi:coffee"></ha-icon>
              </button>
            </div>
          `)}
        </div>
      `:Q}

      ${this._quickRecipe?q`
        <div class="som-quick-recipe">
          <div class="som-quick-name">${this._quickRecipe.name}</div>
          <div class="som-quick-desc">${this._quickRecipe.description}</div>
          <button class="som-brew-btn full" @click=${()=>this._brewRecipe(this._quickRecipe.id)}>
            <ha-icon icon="mdi:coffee"></ha-icon> Brew
          </button>
        </div>
      `:Q}

      <div class="som-actions">
        <button class="som-surprise-btn" @click=${()=>this._surpriseMe()}
          ?disabled=${this._generating}>
          ${this._generating?q`<ha-icon icon="mdi:loading" class="spin"></ha-icon> Generating...`:q`<ha-icon icon="mdi:auto-fix"></ha-icon> Surprise me`}
        </button>
      </div>
    `}static get styles(){return n`
      :host { display: block; }

      .section-title {
        font-size: 0.65em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--mbc-text2);
        padding: 12px 16px 6px;
        opacity: 0.7;
      }
      .mbc-section { padding: 4px 12px 12px; }

      .som-loading { opacity: 0.5; font-size: 0.8em; }
      .som-error {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.78em;
        color: var(--mbc-text2);
      }
      .som-retry-btn {
        padding: 4px 12px;
        border-radius: 6px;
        border: 1px solid var(--mbc-border);
        background: transparent;
        color: var(--mbc-text);
        font-size: 0.9em;
        cursor: pointer;
        font-family: inherit;
      }
      .som-retry-btn:hover { background: var(--mbc-surface); }

      .som-hoppers {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
      .som-hopper-tag {
        font-size: 0.72em;
        padding: 3px 8px;
        border-radius: 12px;
        background: var(--mbc-surface);
        color: var(--mbc-text2);
        border: 1px solid var(--mbc-border);
      }
      .som-favorites { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
      .som-fav-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 10px;
        border-radius: 8px;
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-border);
      }
      .som-fav-info { display: flex; align-items: center; gap: 8px; min-width: 0; }
      .som-fav-name {
        font-size: 0.78em;
        font-weight: 500;
        color: var(--mbc-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .som-fav-count { font-size: 0.68em; color: var(--mbc-text2); flex-shrink: 0; }
      .som-brew-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        border: none;
        background: var(--mbc-text);
        color: var(--mbc-bg);
        font-size: 0.72em;
        cursor: pointer;
        transition: all 0.15s;
      }
      .som-brew-btn:hover { opacity: 0.85; }
      .som-brew-btn.full { width: 100%; justify-content: center; padding: 6px; margin-top: 6px; }
      .som-brew-btn ha-icon { --mdc-icon-size: 16px; }
      .som-quick-recipe {
        padding: 10px;
        border-radius: 10px;
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-accent, var(--mbc-border));
        margin-bottom: 10px;
      }
      .som-quick-name { font-size: 0.82em; font-weight: 600; color: var(--mbc-text); margin-bottom: 4px; }
      .som-quick-desc { font-size: 0.72em; color: var(--mbc-text2); line-height: 1.3; }
      .som-actions { display: flex; gap: 6px; }
      .som-surprise-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid var(--mbc-border);
        background: transparent;
        color: var(--mbc-text);
        font-size: 0.78em;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
      }
      .som-surprise-btn:hover { background: var(--mbc-surface); }
      .som-surprise-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .som-surprise-btn ha-icon { --mdc-icon-size: 18px; }
      @keyframes mbc-spin { to { transform: rotate(360deg); } }
      .spin, ha-icon.spin { animation: mbc-spin 1s linear infinite; }
    `}};e([fe({attribute:!1})],st.prototype,"hass",void 0),e([ue()],st.prototype,"_favorites",void 0),e([ue()],st.prototype,"_hoppers",void 0),e([ue()],st.prototype,"_loaded",void 0),e([ue()],st.prototype,"_error",void 0),e([ue()],st.prototype,"_generating",void 0),e([ue()],st.prototype,"_quickRecipe",void 0),st=e([pe("mbc-sommelier")],st);let rt=class extends le{constructor(){super(...arguments),this._resolvedPrefix=null,this._fsName="Custom",this._fsRecipe={c1:{process:"coffee",intensity:"medium",aroma:"standard",temperature:"normal",shots:"one",portion_ml:40},c2:{process:"none",intensity:"medium",aroma:"standard",temperature:"normal",shots:"none",portion_ml:0}},this._selectedDk=null,this._twoCups=!1,this._editDk=null,this._editState=null,this._editSaving=!1,this._confirmKey=null,this._busyKey=null,this._dkLongPressTimer=null,this._dkLongPressTriggered=!1,this._detectedName=null,this._trackedIds=[],this._trackedPrefix=null}disconnectedCallback(){super.disconnectedCallback(),this._cancelDkLongPress()}static getConfigElement(){return document.createElement("melitta-barista-card-editor")}static getStubConfig(e){const t=et(e);return{entity_prefix:t.length>0?t[0].prefix:"",name:t.length>0?t[0].name:"Melitta Barista",show_recipes:!0,show_settings:!1,compact:!1}}setConfig(e){this._config={...e,show_header:!1!==e.show_header,show_status:!1!==e.show_status,show_recipes:!1!==e.show_recipes,show_profiles:!1!==e.show_profiles,show_freestyle:e.show_freestyle||!1,show_settings:e.show_settings||!1,show_stats:e.show_stats||!1,show_maintenance:e.show_maintenance||!1,compact:e.compact||!1},this._resolvedPrefix=null,this._detectedName=null,this._trackedIds=[],this._trackedPrefix=null}getCardSize(){if(!this._config)return 5;if(this._config.compact)return 3;let e=5;return this._config.show_freestyle&&(e+=4),this._config.show_sommelier&&(e+=2),this._config.show_stats&&(e+=3),this._config.show_maintenance&&(e+=4),this._config.show_settings&&(e+=2),e}getGridOptions(){return{rows:this.getCardSize(),columns:6,min_rows:2,min_columns:3}}_getPrefix(){return this._config?.entity_prefix||this._resolvedPrefix}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass");return!t||(t.locale?.language!==this.hass.locale?.language||(0===this._trackedIds.length||this._trackedIds.some(e=>t.states[e]!==this.hass.states[e])))}willUpdate(e){if(!this.hass||!this._config)return;if(!this._config.entity_prefix&&!this._resolvedPrefix&&e.has("hass")){const e=et(this.hass);e.length>0&&(this._resolvedPrefix=e[0].prefix,this._detectedName=e[0].name)}const t=this._getPrefix();t&&this._trackedPrefix!==t&&(this._trackedPrefix=t,this._trackedIds=this._buildTrackedIds(t))}_buildTrackedIds(e){return[...["state","activity","progress","action_required","connection","total_cups"].map(t=>`sensor.${e}_${t}`),`select.${e}_recipe`,`select.${e}_profile`,...De.map(t=>`switch.${e}_${t}`),...Me.map(t=>`number.${e}_${t}`),...[...Le,...Ne,...Te].map(t=>`button.${e}_${t.suffix}`),`button.${e}_brew`,`button.${e}_cancel`]}_entity(e,t){const i=this._getPrefix();if(i)return this.hass.states[`${e}.${i}_${t}`]}_state(e){const t=this._getPrefix();if(!t)return null;for(const i of["sensor","button","select","number","switch"]){const s=this.hass.states[`${i}.${t}_${e}`];if(s)return s.state}return null}_recipeEntity(){return this._entity("select","recipe")}_recipeOptions(){return this._recipeEntity()?.attributes?.options||[]}_selectedRecipe(){const e=this._recipeEntity()?.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}_selectRecipe(e){const t=this._getPrefix();t&&(this._selectedDk=null,Xe(this.hass,t,"recipe",e))}_profileEntity(){return this._entity("select","profile")}_profileOptions(){return this._profileEntity()?.attributes?.options||[]}_selectedProfile(){const e=this._profileEntity()?.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}_selectProfile(e){const t=this._getPrefix();t&&Xe(this.hass,t,"profile",e)}_getDirectKeyData(){return function(e){if(!e)return null;const t=e.directkey_recipes,i=e.active_profile??0;if(!t)return null;const s={};for(const[e,i]of Object.entries(t)){const t=Number(e);s[t]={};for(const[e,r]of Object.entries(i)){const i=Se[e]||e;s[t][i]=r}}return{activeProfile:i,profiles:s}}(this._profileEntity()?.attributes)}_brew(){const e=this._getPrefix();e&&Ze(this.hass,e,"brew")}_cancelBrew(){const e=this._getPrefix();e&&Ze(this.hass,e,"cancel")}_brewDirectkey(e){const t=this._getPrefix();t&&function(e,t,i,s){e.callService(be,"brew_directkey",{entity_id:`button.${t}_brew`,category:i,two_cups:s})}(this.hass,t,e,this._twoCups)}_brewFreestyle(){const e=this._getPrefix();e&&function(e,t,i,s){e.callService(be,"brew_freestyle",{entity_id:`button.${t}_brew`,name:i,...Oe(s)})}(this.hass,e,this._fsName,this._fsRecipe)}_toggleSwitch(e,t){const i=this._getPrefix();i&&function(e,t,i,s){e.callService("switch",s?"turn_on":"turn_off",{entity_id:`switch.${t}_${i}`})}(this.hass,i,e,t)}_saveDirectkey(){if(!this._editDk||!this._editState)return;const e=this._getPrefix();if(!e)return;this._editSaving=!0;const t=this._getDirectKeyData();(function(e,t,i,s,r){return e.callService(be,"save_directkey",{entity_id:`button.${t}_brew`,category:i,profile_id:s,...Oe(r)})})(this.hass,e,this._editDk.category,t?.activeProfile??0,this._editState).then(()=>{this._editDk=null,this._editState=null,this._editSaving=!1}).catch(()=>{this._editSaving=!1})}_pressMaintenanceButton(e){if(e.confirm&&this._confirmKey!==e.key)return void(this._confirmKey=e.key);const t=this._getPrefix();t&&(this._confirmKey=null,this._busyKey=e.key,Ze(this.hass,t,e.suffix).finally(()=>{setTimeout(()=>{this._busyKey=null},2e3)}))}_startDkLongPress(e,t){this._dkLongPressTriggered=!1,this._dkLongPressTimer=setTimeout(()=>{this._dkLongPressTriggered=!0,this._openEditDialog(e,t)},500)}_cancelDkLongPress(){this._dkLongPressTimer&&(clearTimeout(this._dkLongPressTimer),this._dkLongPressTimer=null)}_handleDkClick(e){this._dkLongPressTriggered||(this._selectedDk===e?this._brewDirectkey(e):this._selectedDk=e)}_openEditDialog(e,t){this._editDk={category:e,recipe:t},this._editState=function(e){return{c1:{process:e.c1_process||"coffee",intensity:e.c1_intensity||"medium",aroma:e.c1_aroma||"standard",temperature:e.c1_temperature||"normal",shots:Be[e.c1_shots]||"one",portion_ml:e.c1_portion_ml||40},c2:{process:e.c2_process||"none",intensity:e.c2_intensity||"medium",aroma:e.c2_aroma||"standard",temperature:e.c2_temperature||"normal",shots:Be[e.c2_shots]||"none",portion_ml:e.c2_portion_ml||0}}}(t),this._editSaving=!1}_closeEditDialog(){this._editDk=null,this._editState=null}_updateFs(e,t){this._fsRecipe={...this._fsRecipe,[e]:{...this._fsRecipe[e],...t}}}_updateEdit(e,t){this._editState&&(this._editState={...this._editState,[e]:{...this._editState[e],...t}})}render(){if(!this.hass||!this._config)return Q;if(!this._getPrefix())return q`<ha-card>${q`
    <div class="no-device">
      <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
      <p>No Melitta Barista device found.</p>
      <p class="hint">Make sure the integration is installed and configured.</p>
    </div>
  `}</ha-card>`;const e=function(e){const t=e("state")||"unavailable",i=e("activity"),s=e("progress"),r=e("action_required"),o=e("connection")||"Disconnected";let n=null;if(Ve(s)){const e=parseFloat(s);Number.isNaN(e)||(n=Math.max(0,Math.min(100,e)))}return{state:t,activity:Ve(i)?i:"Idle",isConnected:"Connected"===o,isUnavailable:"unavailable"===t||"unknown"===t,isBrewing:"Brewing"===t,isReady:"Ready"===t,actionRequired:Ve(r)?r:null,progress:n,stateColor:Pe[t.toLowerCase()]||"var(--primary-text-color)"}}(e=>this._state(e)),t=this._config.name||this._detectedName||"Melitta Barista",i=this._config.show_header;return e.isUnavailable?q`<ha-card>
        ${i?Qe(t,!1):Q}
        ${q`
    <div class="offline-section">
      <ha-icon icon="mdi:bluetooth-off"></ha-icon>
      <span>Machine offline</span>
    </div>
  `}
      </ha-card>`:q`<ha-card>
      ${i?Qe(t,e.isConnected):Q}

      ${this._config.show_status&&!e.isBrewing?function(e){return q`
    <div class="status-section">
      <div class="state-row">
        <span class="state-badge"
          style="background: color-mix(in srgb, ${e.stateColor} 10%, transparent); color: ${e.stateColor}">
          ${e.state}
        </span>
      </div>
    </div>

    ${e.actionRequired?q`
      <div class="action-alert">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <span>${e.actionRequired}</span>
      </div>
    `:Q}
  `}(e):Q}

      ${e.isBrewing?function(e,t,i){return q`
    <div class="brewing-view">
      <div class="brewing-icon-wrap">
        ${We(e||"Espresso",64,"brew-active")}
      </div>
      <div class="brewing-info">
        <span class="brewing-recipe">${e||"Brewing"}</span>
        <span class="brewing-activity">${t.activity}</span>
        ${null!==t.progress?q`
          <div class="brewing-progress">
            <div class="brewing-progress-fill" style="width: ${t.progress}%"></div>
          </div>
          <span class="brewing-percent">${Math.round(t.progress)}%</span>
        `:Q}
      </div>
      <button class="brewing-cancel" @click=${i}>
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
  `}(this._selectedRecipe(),e,()=>this._cancelBrew()):Q}

      ${!e.isBrewing&&this._config.show_profiles&&e.isReady&&this._profileOptions().length>1?this._renderProfileTabs():Q}

      ${!e.isBrewing&&e.isReady?this._renderDirectKey():Q}

      ${!e.isBrewing&&this._config.show_recipes&&this._recipeOptions().length>0?this._renderRecipes():Q}

      ${!e.isBrewing&&this._config.show_freestyle&&e.isReady?this._renderFreestyle():Q}

      ${this._config.show_sommelier?q`<mbc-sommelier .hass=${this.hass}></mbc-sommelier>`:Q}

      ${this._config.show_stats?this._renderStats():Q}

      ${this._config.show_maintenance?this._renderMaintenance(e):Q}

      ${this._config.show_settings?this._renderSettings():Q}

      ${this._editDk?this._renderEditDialog():Q}
    </ha-card>`}_renderProfileTabs(){return e={options:this._profileOptions(),selected:this._selectedProfile(),onSelect:e=>this._selectProfile(e)},q`
    <div class="profile-tabs">
      ${e.options.map(t=>q`
        <button class="profile-tab" ?data-active=${t===e.selected}
          @click=${()=>{t!==e.selected&&e.onSelect(t)}}>
          ${t}
          ${t===e.selected?q`<span class="profile-tab-indicator"></span>`:Q}
        </button>
      `)}
    </div>
  `;var e}_renderDirectKey(){const e=this._getDirectKeyData();return e?Ge({data:e,selected:this._selectedDk,twoCups:this._twoCups,onCardClick:e=>this._handleDkClick(e),onLongPressStart:(e,t)=>this._startDkLongPress(e,t),onLongPressCancel:()=>this._cancelDkLongPress(),onToggleTwoCups:()=>{this._twoCups=!this._twoCups}}):Q}_renderRecipes(){const e=this._getDirectKeyData(),t=!!e&&Object.keys(e.profiles[e.activeProfile]??{}).length>0;return i={options:this._recipeOptions(),selected:this._selectedRecipe(),hasDk:t,dkActive:null!==this._selectedDk,onSelect:e=>this._selectRecipe(e),onBrew:()=>this._brew()},q`
    ${i.hasDk?q`
      <div class="recipes-divider">
        <span class="recipes-divider-line"></span>
        <span class="recipes-divider-text">All Recipes</span>
        <span class="recipes-divider-line"></span>
      </div>
    `:q`<div class="section-title">Recipe</div>`}
    <div class="recipe-grid">
      ${i.options.map(e=>{const t=e.replace(/[^a-zA-Z0-9]/g,""),s=e===i.selected&&!i.dkActive;return q`
          <div class="recipe-card"
            ?data-selected=${s}
            @click=${()=>{s?i.onBrew():i.onSelect(e)}}>
            ${We(e,48,`r-${t}`)}
            <span class="recipe-name">${e}</span>
          </div>
        `})}
    </div>
  `;var i}_renderFreestyle(){return q`
      <div class="section-title">Freestyle</div>
      <div class="freestyle-section">
        <div class="freestyle-name-row">
          <input class="freestyle-name-input" type="text" placeholder="Drink name"
            .value=${this._fsName}
            @input=${e=>{this._fsName=e.target.value}} />
        </div>

        <div class="freestyle-components">
          ${Ie({title:"Component 1",containerClass:"freestyle-component",spec:this._fsRecipe.c1,allowNoneProcess:!1,onChange:e=>this._updateFs("c1",e)})}
          ${Ie({title:"Component 2",containerClass:"freestyle-component",spec:this._fsRecipe.c2,allowNoneProcess:!0,onChange:e=>this._updateFs("c2",e)})}
        </div>

        <div class="freestyle-brew-row">
          <button class="brew-btn" @click=${()=>this._brewFreestyle()}>
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            Brew ${this._fsName}
          </button>
        </div>
      </div>
    `}_renderStats(){return function(e){const t=e?.state?parseInt(e.state,10):null;if(null===t||isNaN(t))return q`
      <div class="section-title">Stats</div>
      <div class="stats-unavailable">Cup statistics not available.</div>
    `;const i=e.attributes||{},s=[];for(const[e,t]of Object.entries(i))"number"!=typeof t||_e.includes(e)||s.push({name:e,count:t});return s.sort((e,t)=>t.count-e.count),q`
    <div class="section-title">Stats</div>
    <div class="stats-section">
      <div class="stats-total">
        <span class="stats-total-number">${t.toLocaleString()}</span>
        <span class="stats-total-label">Total Cups</span>
      </div>
      ${s.length>0?q`
        <div class="stats-grid">
          ${s.map(({name:e,count:t},i)=>q`
            <div class="stats-card" ?data-top=${0===i}>
              ${We(e,40,`stat-${e.replace(/[^a-zA-Z0-9]/g,"")}`)}
              <span class="stats-recipe-name">${e}</span>
              <span class="stats-recipe-count">${t}</span>
            </div>
          `)}
        </div>
      `:q`<div class="stats-empty">No cups brewed yet</div>`}
    </div>
  `}(this._entity("sensor","total_cups"))}_renderMaintenance(e){const t=this._getPrefix();return t?function(e){const t=(t,i)=>{const s=i.map(t=>{if(!e.hasEntity(t.suffix))return Q;const i=e.confirmKey===t.key,s=e.busyKey===t.key,r=!e.st.isConnected||!e.st.isReady||s;return q`
        <div class="maint-card" ?data-confirming=${i}>
          <ha-icon class="maint-icon" icon="${t.icon}"></ha-icon>
          <div class="maint-info">
            <div class="maint-label">${t.label}</div>
            <div class="maint-desc">${t.desc}</div>
          </div>
          <button class="maint-btn" ?data-confirm=${i} ?disabled=${r}
            @click=${i=>{i.stopPropagation(),e.onPress(t)}}>
            ${s?"...":i?"Confirm":"Start"}
          </button>
        </div>
      `}).filter(e=>e!==Q);return 0===s.length?Q:q`
      <div class="maint-group-title">${t}</div>
      <div class="maint-grid">${s}</div>
    `};return q`
    <div class="section-title">Maintenance</div>
    <div class="maint-section" @click=${()=>e.onDismissConfirm()}>
      ${t("Cleaning & Descaling",Le)}
      ${t("Water Filter",Ne)}
      ${t("Other",Te)}
    </div>
  `}({st:e,hasEntity:e=>!!this.hass.states[`button.${t}_${e}`],confirmKey:this._confirmKey,busyKey:this._busyKey,onPress:e=>this._pressMaintenanceButton(e),onDismissConfirm:()=>{this._confirmKey&&(this._confirmKey=null)}}):Q}_renderSettings(){const e=this._getPrefix();return e?function(e){const t=De.map(t=>{const i=e.getEntity("switch",t);if(!i)return Q;const s="on"===i.state,r=ze[t];return q`
      <div class="setting-card">
        <ha-icon class="setting-icon" icon="${r.icon}"></ha-icon>
        <div class="setting-info">
          <div class="setting-label">${r.label}</div>
          <div class="setting-desc">${r.desc}</div>
        </div>
        <button class="toggle-track" ?data-on=${s}
          @click=${()=>e.onToggle(t,!s)}>
          <span class="toggle-thumb"></span>
        </button>
      </div>
    `}),i=Me.map(t=>{const i=e.getEntity("number",t);if(!i)return Q;const s=Re[t],r=Ve(i.state)?parseFloat(i.state):NaN;let o;return o=Number.isNaN(r)?"—":"level"===s.format?Ue[t]?.[r]??String(r):`${r} min`,q`
      <div class="setting-card">
        <ha-icon class="setting-icon" icon="${s.icon}"></ha-icon>
        <div class="setting-info">
          <div class="setting-label">${s.label}</div>
          <div class="setting-desc">${s.desc}</div>
        </div>
        <span class="setting-value">${o}</span>
      </div>
    `});return t.every(e=>e===Q)&&i.every(e=>e===Q)?Q:q`
    <div class="section-title">Settings</div>
    <div class="settings-grid">
      ${t}
      ${i}
    </div>
  `}({getEntity:(t,i)=>this.hass.states[`${t}.${e}_${i}`],onToggle:(e,t)=>this._toggleSwitch(e,t)}):Q}_renderEditDialog(){if(!this._editDk||!this._editState)return Q;const e=this._editState,t=this._editDk.category;return q`
      <div class="edit-overlay" @click=${()=>this._closeEditDialog()}>
        <div class="edit-dialog" @click=${e=>e.stopPropagation()}>
          <div class="edit-header">
            <span class="edit-title">Edit: ${Ee[t]}</span>
            <button class="edit-close" @click=${()=>this._closeEditDialog()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="edit-body">
            ${Ie({title:"Component 1",containerClass:"edit-component",spec:e.c1,allowNoneProcess:!1,temperatureLabel:"Temperature",onChange:e=>this._updateEdit("c1",e)})}
            ${Ie({title:"Component 2",containerClass:"edit-component",spec:e.c2,allowNoneProcess:!0,temperatureLabel:"Temperature",onChange:e=>this._updateEdit("c2",e)})}
          </div>
          <div class="edit-footer">
            <button class="edit-btn-cancel" @click=${()=>this._closeEditDialog()}>
              Cancel
            </button>
            <button class="edit-btn-save" ?disabled=${this._editSaving} @click=${()=>this._saveDirectkey()}>
              ${this._editSaving?"...":"Save"}
            </button>
          </div>
        </div>
      </div>
    `}static get styles(){return tt}};e([fe({attribute:!1})],rt.prototype,"hass",void 0),e([ue()],rt.prototype,"_config",void 0),e([ue()],rt.prototype,"_resolvedPrefix",void 0),e([ue()],rt.prototype,"_fsName",void 0),e([ue()],rt.prototype,"_fsRecipe",void 0),e([ue()],rt.prototype,"_selectedDk",void 0),e([ue()],rt.prototype,"_twoCups",void 0),e([ue()],rt.prototype,"_editDk",void 0),e([ue()],rt.prototype,"_editState",void 0),e([ue()],rt.prototype,"_editSaving",void 0),e([ue()],rt.prototype,"_confirmKey",void 0),e([ue()],rt.prototype,"_busyKey",void 0),rt=e([pe("melitta-barista-card")],rt),window.customCards=window.customCards||[],window.customCards.some(e=>"melitta-barista-card"===e.type)||window.customCards.push({type:"melitta-barista-card",name:"Melitta Barista Card",description:"Premium control card for Melitta Barista coffee machines",preview:!0,documentationURL:"https://github.com/dzerik/melitta-barista-card"}),console.info(`%c MELITTA-BARISTA-CARD %c v${ge} `,"color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;","color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;");export{rt as MelittaBaristaCard};
