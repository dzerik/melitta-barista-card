function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:f}=Object,m=globalThis,g=m.trustedTypes,u=g?g.emptyScript:"",b=m.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[_("elementProperties")]=new Map,y[_("finalized")]=new Map,b?.({ReactiveElement:y}),(m.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,S=w.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+E,D=`<${P}>`,M=document,z=()=>M.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,O="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,F=/>/g,U=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,H=/"/g,j=/^(?:script|style|textarea|title)$/i,I=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),K=I(1),W=I(2),Q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,Z=M.createTreeWalker(M,129);function G(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===R?"!--"===c[1]?n=N:void 0!==c[1]?n=F:void 0!==c[2]?(j.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=U):void 0!==c[3]&&(n=U):n===U?">"===c[0]?(n=r??R,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?U:'"'===c[3]?H:B):n===H||n===B?n=U:n===N||n===F?n=R:(n=U,r=void 0);const p=n===U&&t[e+1].startsWith("/>")?" ":"";o+=n===R?i+D:l>=0?(s.push(a),i.slice(0,l)+C+i.slice(l)+E+p):i+E+(-2===l?e:p)}return[G(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=J.createElement(c,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=l[o++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?rt:"@"===n[1]?ot:it}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],z()),Z.nextNode(),a.push({type:2,index:++r});s.append(t[e],z())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===Q)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=T(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);Z.currentNode=s;let r=Z.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new et(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new nt(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=Z.nextNode(),o++)}return Z.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),T(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==Q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new et(this.O(z()),this.O(z()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Y(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Y(this,s[i+n],e,n),a===Q&&(a=this._$AH[n]),o||=!T(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class rt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class ot extends it{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??V)===Q)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(J,et),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;class lt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new et(e.insertBefore(z(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Q}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:$},ft=(t=ht,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function mt(t){return(e,i)=>"object"==typeof i?ft(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return mt({...t,state:!0,attribute:!1})}const ut=["coffee","milk","water"],bt=["none",...ut],_t=["very_mild","mild","medium","strong","very_strong"],vt=["standard","intense"],$t=["cold","normal","high"],xt=["none","one","two","three"],yt=["espresso","cafe_creme","cappuccino","latte_macchiato","milk","milk_froth","water"],wt={espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Milk",milk_froth:"Milk Froth",water:"Hot Water"},kt={Espresso:"espresso","Cafe Creme":"cafe_creme","Café Crème":"cafe_creme",Cappuccino:"cappuccino","Latte Macchiato":"latte_macchiato",Milk:"milk","Milk Froth":"milk_froth","Hot Water":"water"},St={ready:"var(--state-active-color, #4caf50)",brewing:"var(--warning-color, #ff9800)",cleaning:"var(--info-color, #2196f3)",descaling:"var(--info-color, #2196f3)",off:"var(--disabled-color, #9e9e9e)",busy:"var(--warning-color, #ff9800)",unavailable:"var(--error-color, #f44336)"},At=["energy_saving","auto_bean_select","rinsing_disabled"],Ct=["water_hardness","auto_off_after","brew_temperature"],Et=[{key:"easy_clean",suffix:"easy_clean",label:"Easy Clean",desc:"Quick rinse of the brew unit",icon:"mdi:broom",confirm:!0},{key:"intensive_clean",suffix:"intensive_clean",label:"Intensive Clean",desc:"Deep cleaning with tablet",icon:"mdi:spray-bottle",confirm:!0},{key:"descaling",suffix:"descaling",label:"Descaling",desc:"Remove limescale buildup",icon:"mdi:water-alert",confirm:!0},{key:"evaporating",suffix:"evaporating",label:"Evaporating",desc:"Purge the steam system",icon:"mdi:weather-fog",confirm:!0}],Pt=[{key:"filter_insert",suffix:"filter_insert",label:"Insert Filter",desc:"Start using a new water filter",icon:"mdi:filter-plus"},{key:"filter_replace",suffix:"filter_replace",label:"Replace Filter",desc:"Replace the current water filter",icon:"mdi:filter"},{key:"filter_remove",suffix:"filter_remove",label:"Remove Filter",desc:"Stop using the water filter",icon:"mdi:filter-remove"}],Dt=[{key:"switch_off",suffix:"switch_off",label:"Switch Off",desc:"Turn off the machine",icon:"mdi:power",confirm:!0}];function Mt(t){const e=new Set;for(const i of Object.keys(t.states)){const t=i.match(/^button\.(.+?)_brew$/);t&&e.add(t[1])}const i=[];for(const s of e){const e=t.states[`sensor.${s}_state`];if(!e)continue;const r=e.attributes.friendly_name,o=r?r.replace(/\s*State$/,""):s.replace(/_/g," ");i.push({prefix:s,name:o})}return i}const zt={Espresso:{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#C9A87C",height:.04}},Ristretto:{layers:[{color:"#1A0D04",height:.22}],foam:{color:"#B89970",height:.03}},Lungo:{layers:[{color:"#4A2A14",height:.5}],foam:{color:"#C9A87C",height:.04}},"Espresso Doppio":{layers:[{color:"#3E1F0D",height:.45}],foam:{color:"#C9A87C",height:.04}},"Ristretto Doppio":{layers:[{color:"#1A0D04",height:.4}],foam:{color:"#B89970",height:.03}},"Café Crème":{layers:[{color:"#5C3A1E",height:.5}],foam:{color:"#E8D5B7",height:.08}},"Café Crème Doppio":{layers:[{color:"#5C3A1E",height:.58}],foam:{color:"#E8D5B7",height:.08}},Americano:{layers:[{color:"#3E1F0D",height:.6}]},"Americano Extra":{layers:[{color:"#2C1507",height:.65}]},"Long Black":{layers:[{color:"#3E1F0D",height:.55}],foam:{color:"#C9A87C",height:.05}},"Red Eye":{layers:[{color:"#2C1507",height:.6}]},"Black Eye":{layers:[{color:"#1A0D04",height:.65}]},"Dead Eye":{layers:[{color:"#0F0803",height:.7}]},Cappuccino:{layers:[{color:"#3E1F0D",height:.28},{color:"#D4B896",height:.22}],foam:{color:"#F5EDE0",height:.18}},"Espresso Macchiato":{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#F5EDE0",height:.12}},"Caffè Latte":{tall:!0,layers:[{color:"#E8D5B7",height:.35},{color:"#8B5A30",height:.18}],foam:{color:"#F5EDE0",height:.1}},"Café au Lait":{layers:[{color:"#C9A87C",height:.5}],foam:{color:"#F0E6D8",height:.06}},"Flat White":{layers:[{color:"#3E1F0D",height:.2},{color:"#D4B896",height:.3}],foam:{color:"#F0E6D8",height:.05}},"Latte Macchiato":{tall:!0,layers:[{color:"#F0E6D8",height:.28},{color:"#6B4226",height:.12},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.15}},"Latte Macchiato Extra":{tall:!0,layers:[{color:"#F0E6D8",height:.25},{color:"#5C3A1E",height:.16},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.14}},"Latte Macchiato Triple":{tall:!0,layers:[{color:"#F0E6D8",height:.22},{color:"#4A2A14",height:.2},{color:"#E8D5B7",height:.1}],foam:{color:"#FEFCFA",height:.14}},Milk:{tall:!0,layers:[{color:"#F0E6D8",height:.55}]},"Milk Froth":{tall:!0,layers:[{color:"#F0E6D8",height:.15}],foam:{color:"#FEFCFA",height:.4}},"Hot Water":{layers:[{color:"#9DC4D8",height:.5}]}};zt["Cafe Creme"]=zt["Café Crème"],zt["Cafe Creme Doppio"]=zt["Café Crème Doppio"],zt["Caffe Latte"]=zt["Caffè Latte"],zt["Cafe au Lait"]=zt["Café au Lait"];const Tt={layers:[{color:"#5C3A1E",height:.45}]};function Lt(t,e,i){const s=zt[t]||Tt,r=s.tall,o=r?36:50,n=r?30:42,a=r?68:48,c=r?12:28,l=c+a,d=r?50:46,p=d-o/2,h=d+o/2,f=d-n/2,m=d+n/2,g=`M ${p} ${c} L ${f+4} ${l-4} Q ${f} ${l} ${f+4} ${l} L ${m-4} ${l} Q ${m} ${l} ${m-4} ${l-4} L ${h} ${c}`,u=1.5,b=p+u,_=h-u,v=f+u+1.2,$=m-u-1.2,x=c+u,y=l-u,w=2.8,k=`M ${b} ${x} L ${v+w} ${y-w} Q ${v} ${y} ${v+w} ${y} L ${$-w} ${y} Q ${$} ${y} ${$-w} ${y-w} L ${_} ${x} Z`,S=(t,e)=>{const i=(t-x)/(y-x);return e?b+(v-b)*i:_+($-_)*i};let A=y;const C=[],E=[...s.layers];for(let t=E.length-1;t>=0;t--){const{color:e,height:i}=E[t],s=A,r=A-a*i;A=r;const o=S(r,!0),n=S(r,!1),c=S(s,!0),l=S(s,!1),d=t===E.length-1,p=d?w:0,h=d?`M ${o} ${r} L ${c+p} ${s-p} Q ${c} ${s} ${c+p} ${s} L ${l-p} ${s} Q ${l} ${s} ${l-p} ${s-p} L ${n} ${r} Z`:`M ${o} ${r} L ${c} ${s} L ${l} ${s} L ${n} ${r} Z`;C.push({d:h,fill:e})}if(s.foam){const t=A,e=A-a*s.foam.height;A=e;const i=S(e,!0),r=S(e,!1),o=S(t,!0),n=S(t,!1);C.push({d:`M ${i} ${e} L ${o} ${t} L ${n} ${t} L ${r} ${e} Z`,fill:s.foam.color})}const P=h,D=c+.18*a,M=c+.65*a,z=r?10:14,T=`M ${d-6} ${c-2} Q ${d-8} ${c-10} ${d-5} ${c-16}`,L=`${T};M ${d-6} ${c-2} Q ${d-4} ${c-10} ${d-7} ${c-16};${T}`,O=`M ${d+1} ${c-3} Q ${d+3} ${c-11} ${d} ${c-18}`,R=`${O};M ${d+1} ${c-3} Q ${d-1} ${c-11} ${d+2} ${c-18};${O}`,N=`M ${d+8} ${c-2} Q ${d+6} ${c-9} ${d+9} ${c-15}`,F=`${N};M ${d+8} ${c-2} Q ${d+10} ${c-9} ${d+7} ${c-15};${N}`;return W`
    <svg width="${e}" height="${1.15*e}" viewBox="0 0 ${100} ${115}" fill="none">
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

      ${"Milk"!==t&&"Milk Froth"!==t&&"Hot Water"!==t?W`
        <g opacity="0.20" stroke="rgba(255,255,255,0.6)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#sg-${i})">
          <path d="${T}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${L}" /></path>
          <path d="${O}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${R}" /></path>
          <path d="${N}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${F}" /></path>
        </g>
        <g opacity="0.40" stroke="#D4C4A0" stroke-width="1" fill="none" stroke-linecap="round">
          <path d="${T}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${L}" /></path>
          <path d="${O}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${R}" /></path>
          <path d="${N}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${F}" /></path>
        </g>
      `:V}

      <path d="${g}" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-linejoin="round" />

      <g clip-path="url(#clip-${i})">
        ${C.map(t=>W`<path d="${t.d}" fill="${t.fill}" />`)}
      </g>

      <path d="${g}" fill="url(#refl-${i})" clip-path="url(#clip-${i})" />
      <path d="M ${p+1.5} ${c+3} L ${f+2.5} ${l-5} L ${f+2.5+(r?4:5)} ${l-5} L ${p+1.5+(r?4:5)} ${c+3} Z" fill="url(#spec-${i})" />
      <line x1="${h-2.5}" y1="${c+5}" x2="${m-3}" y2="${l-7}" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round" />
      <line x1="${p+3}" y1="${c+.5}" x2="${h-3}" y2="${c+.5}" stroke="rgba(255,255,255,0.20)" stroke-width="1" stroke-linecap="round" />

      <path d="M ${P} ${D} C ${P+z} ${D-2}, ${P+z} ${M+2}, ${P} ${M}" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="none" stroke-linecap="round" />

      <g mask="url(#rm-${i})">
        <g transform="translate(0, ${2*l+2}) scale(1, -1)">
          <path d="${g}" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linejoin="round" />
          <g clip-path="url(#clip-${i})" opacity="0.5">
            ${C.map(t=>W`<path d="${t.d}" fill="${t.fill}" />`)}
          </g>
          <path d="M ${P} ${D} C ${P+z} ${D-2}, ${P+z} ${M+2}, ${P} ${M}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" />
        </g>
      </g>
    </svg>
  `}const Ot=n`
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
  }

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
`;let Rt=class extends lt{setConfig(t){this._config=t}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0});this.dispatchEvent(t)}_valueChanged(t,e){const i=e.target,s=i instanceof HTMLInputElement&&"checkbox"===i.type?i.checked:i.value;this._config={...this._config,[t]:s},this._fireConfigChanged()}_deviceSelected(t){const e=t.target.value;if("__manual__"===e)return this._config={...this._config,entity_prefix:""},void this._fireConfigChanged();const i=(this.hass?Mt(this.hass):[]).find(t=>t.prefix===e);this._config={...this._config,entity_prefix:e,name:i?.name||this._config.name},this._fireConfigChanged()}render(){if(!this._config)return V;const t=this.hass?Mt(this.hass):[],e=this._config.entity_prefix||"",i=t.some(t=>t.prefix===e),s=e&&!i&&t.length>0;return K`
      ${t.length>0?K`
            <div class="editor-row">
              <label for="device">Device</label>
              <select id="device" @change=${this._deviceSelected}>
                ${t.map(t=>K`
                    <option value=${t.prefix} ?selected=${t.prefix===e}>
                      ${t.name}
                    </option>
                  `)}
                <option value="__manual__" ?selected=${s}>
                  Enter manually...
                </option>
              </select>
            </div>
          `:K`
            <div class="editor-row">
              <label for="entity_prefix">Entity Prefix</label>
              <input
                id="entity_prefix"
                .value=${e}
                placeholder="Auto-detected if integration is running"
                @input=${t=>this._valueChanged("entity_prefix",t)}
              />
              <span class="hint">No Melitta devices detected. Enter prefix manually or check that the integration is configured.</span>
            </div>
          `}

      ${s?K`
            <div class="editor-row">
              <label for="entity_prefix">Entity Prefix</label>
              <input
                id="entity_prefix"
                .value=${e}
                @input=${t=>this._valueChanged("entity_prefix",t)}
              />
            </div>
          `:""}

      <div class="editor-row">
        <label for="name">Name</label>
        <input
          id="name"
          .value=${this._config.name||"Melitta Barista"}
          @input=${t=>this._valueChanged("name",t)}
        />
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_header"
          .checked=${!1!==this._config.show_header}
          @change=${t=>this._valueChanged("show_header",t)} />
        <label for="show_header">Show header</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_status"
          .checked=${!1!==this._config.show_status}
          @change=${t=>this._valueChanged("show_status",t)} />
        <label for="show_status">Show status</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_profiles"
          .checked=${!1!==this._config.show_profiles}
          @change=${t=>this._valueChanged("show_profiles",t)} />
        <label for="show_profiles">Show profile selector</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_recipes"
          .checked=${!1!==this._config.show_recipes}
          @change=${t=>this._valueChanged("show_recipes",t)} />
        <label for="show_recipes">Show recipe selector</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_freestyle"
          .checked=${this._config.show_freestyle||!1}
          @change=${t=>this._valueChanged("show_freestyle",t)} />
        <label for="show_freestyle">Show freestyle recipe</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_stats"
          .checked=${this._config.show_stats||!1}
          @change=${t=>this._valueChanged("show_stats",t)} />
        <label for="show_stats">Show cup statistics</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_maintenance"
          .checked=${this._config.show_maintenance||!1}
          @change=${t=>this._valueChanged("show_maintenance",t)} />
        <label for="show_maintenance">Show maintenance</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show_settings"
          .checked=${this._config.show_settings||!1}
          @change=${t=>this._valueChanged("show_settings",t)} />
        <label for="show_settings">Show settings</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="compact"
          .checked=${this._config.compact||!1}
          @change=${t=>this._valueChanged("compact",t)} />
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
    `}};t([mt({attribute:!1})],Rt.prototype,"hass",void 0),t([gt()],Rt.prototype,"_config",void 0),Rt=t([pt("melitta-barista-card-editor")],Rt);const Nt={energy_saving:{label:"Energy Saving",desc:"Reduce power when idle",icon:"mdi:lightning-bolt"},auto_bean_select:{label:"Auto Bean Select",desc:"Auto-choose bean hopper",icon:"mdi:seed"},rinsing_disabled:{label:"Rinsing Disabled",desc:"Skip auto rinse cycle",icon:"mdi:water-off"}},Ft={water_hardness:{label:"Water Hardness",desc:"Calibrate for water type",icon:"mdi:water",format:"level"},auto_off_after:{label:"Auto Off",desc:"Minutes until shutdown",icon:"mdi:timer-outline",format:"minutes"},brew_temperature:{label:"Brew Temperature",desc:"Brewing water temp",icon:"mdi:thermometer",format:"level"}},Ut={water_hardness:{1:"Soft",2:"Medium",3:"Hard",4:"Very Hard"},brew_temperature:{0:"Low",1:"Normal",2:"High"}},Bt={very_mild:"V.Mild",mild:"Mild",medium:"Med",strong:"Strong",very_strong:"V.Strong",extra_strong:"X.Strong",cold:"Cold",normal:"Normal",high:"High",none:"None",one:"1",two:"2",three:"3",coffee:"Coffee",milk:"Milk",water:"Water",standard:"Std",intense:"Int+"},Ht={very_mild:1,mild:2,medium:3,strong:4,very_strong:5},jt={0:"none",1:"one",2:"two",3:"three"};let It=class extends lt{constructor(){super(...arguments),this._resolvedPrefix=null,this._fsName="Custom",this._fsProcess1="coffee",this._fsIntensity1="medium",this._fsAroma1="standard",this._fsPortion1=40,this._fsTemp1="normal",this._fsShots1="one",this._fsProcess2="none",this._fsIntensity2="medium",this._fsAroma2="standard",this._fsPortion2=0,this._fsTemp2="normal",this._fsShots2="none",this._selectedDk=null,this._twoCups=!1,this._editDk=null,this._editState=null,this._editSaving=!1,this._confirmKey=null,this._busyKey=null,this._dkLongPressTimer=null,this._dkLongPressTriggered=!1}static getConfigElement(){return document.createElement("melitta-barista-card-editor")}static getStubConfig(t){const e=Mt(t);return{entity_prefix:e.length>0?e[0].prefix:"",name:e.length>0?e[0].name:"Melitta Barista",show_recipes:!0,show_settings:!1,compact:!1}}setConfig(t){this._config={...t,show_header:!1!==t.show_header,show_status:!1!==t.show_status,show_recipes:!1!==t.show_recipes,show_profiles:!1!==t.show_profiles,show_freestyle:t.show_freestyle||!1,show_settings:t.show_settings||!1,show_stats:t.show_stats||!1,show_maintenance:t.show_maintenance||!1,compact:t.compact||!1},this._resolvedPrefix=null}getCardSize(){return this._config?.compact?3:5}getGridOptions(){return{rows:this._config?.compact?3:5,columns:6,min_rows:2,min_columns:3}}_getPrefix(){if(this._config.entity_prefix)return this._config.entity_prefix;if(this._resolvedPrefix)return this._resolvedPrefix;if(this.hass){const t=Mt(this.hass);if(t.length>0)return this._resolvedPrefix=t[0].prefix,this._config.name||(this._config={...this._config,name:t[0].name}),this._resolvedPrefix}return null}shouldUpdate(t){if(t.has("_config")||t.has("_resolvedPrefix"))return!0;for(const e of t.keys())if("string"==typeof e&&(e.startsWith("_fs")||e.startsWith("_selected")||e.startsWith("_two")||e.startsWith("_edit")||e.startsWith("_confirm")||e.startsWith("_busy")))return!0;const e=t.get("hass");if(!e)return!0;const i=this._getPrefix();if(!i)return!0;for(const[t,s]of Object.entries(this.hass.states))if(t.includes(i)&&e.states[t]!==s)return!0;return!1}_entity(t,e){const i=this._getPrefix();if(i)return this.hass.states[`${t}.${i}_${e}`]}_state(t){const e=this._getPrefix();if(!e)return null;for(const i of["sensor","button","select","number","switch"]){const s=this.hass.states[`${i}.${e}_${t}`];if(s)return s.state}return null}_recipeEntity(){return this._entity("select","recipe")}_recipeOptions(){return this._recipeEntity()?.attributes?.options||[]}_selectedRecipe(){const t=this._recipeEntity()?.state;return t&&"unknown"!==t&&"unavailable"!==t?t:null}_selectRecipe(t){const e=this._getPrefix();e&&(this._selectedDk=null,this.hass.callService("select","select_option",{entity_id:`select.${e}_recipe`,option:t}))}_profileEntity(){return this._entity("select","profile")}_profileOptions(){return this._profileEntity()?.attributes?.options||[]}_selectedProfile(){const t=this._profileEntity()?.state;return t&&"unknown"!==t&&"unavailable"!==t?t:null}_selectProfile(t){const e=this._getPrefix();e&&this.hass.callService("select","select_option",{entity_id:`select.${e}_profile`,option:t})}_getDirectKeyData(){const t=this._profileEntity();if(!t?.attributes)return null;const e=t.attributes.directkey_recipes,i=t.attributes.active_profile??0;if(!e)return null;const s={};for(const[t,i]of Object.entries(e)){const e=Number(t);s[e]={};for(const[t,r]of Object.entries(i)){const i=kt[t]||t;s[e][i]=r}}return{activeProfile:i,profiles:s}}_brew(){const t=this._getPrefix();t&&this.hass.callService("button","press",{entity_id:`button.${t}_brew`})}_brewDirectkey(t){const e=this._getPrefix();e&&this.hass.callService("melitta_barista","brew_directkey",{entity_id:`button.${e}_brew`,category:t,two_cups:this._twoCups})}_brewFreestyle(){const t=this._getPrefix();t&&this.hass.callService("melitta_barista","brew_freestyle",{entity_id:`button.${t}_brew`,name:this._fsName,process1:this._fsProcess1,intensity1:this._fsIntensity1,aroma1:this._fsAroma1,portion1_ml:this._fsPortion1,temperature1:this._fsTemp1,shots1:this._fsShots1,process2:this._fsProcess2,intensity2:this._fsIntensity2,aroma2:this._fsAroma2,portion2_ml:this._fsPortion2,temperature2:this._fsTemp2,shots2:this._fsShots2})}_toggleSwitch(t,e){const i=this._getPrefix();i&&this.hass.callService("switch",e?"turn_on":"turn_off",{entity_id:`switch.${i}_${t}`})}_saveDirectkey(){if(!this._editDk||!this._editState)return;const t=this._getPrefix();if(!t)return;this._editSaving=!0;const e=this._getDirectKeyData();this.hass.callService("melitta_barista","save_directkey",{entity_id:`button.${t}_brew`,category:this._editDk.category,profile_id:e?.activeProfile??0,process1:this._editState.process1,intensity1:this._editState.intensity1,aroma1:this._editState.aroma1,portion1_ml:this._editState.portion1,temperature1:this._editState.temperature1,shots1:this._editState.shots1,process2:this._editState.process2,intensity2:this._editState.intensity2,aroma2:this._editState.aroma2,portion2_ml:this._editState.portion2,temperature2:this._editState.temperature2,shots2:this._editState.shots2}).then(()=>{this._editDk=null,this._editState=null,this._editSaving=!1}).catch(()=>{this._editSaving=!1})}_pressMaintenanceButton(t){if(t.confirm&&this._confirmKey!==t.key)return void(this._confirmKey=t.key);this._confirmKey=null,this._busyKey=t.key;const e=this._getPrefix();e&&this.hass.callService("button","press",{entity_id:`button.${e}_${t.suffix}`}).finally(()=>{setTimeout(()=>{this._busyKey=null},2e3)})}_startDkLongPress(t,e){this._dkLongPressTriggered=!1,this._dkLongPressTimer=setTimeout(()=>{this._dkLongPressTriggered=!0,this._openEditDialog(t,e)},500)}_cancelDkLongPress(){this._dkLongPressTimer&&(clearTimeout(this._dkLongPressTimer),this._dkLongPressTimer=null)}_handleDkClick(t){this._dkLongPressTriggered||(this._selectedDk===t?this._brewDirectkey(t):this._selectedDk=t)}_openEditDialog(t,e){this._editDk={category:t,recipe:e},this._editState={process1:e.c1_process||"coffee",intensity1:e.c1_intensity||"medium",aroma1:e.c1_aroma||"standard",temperature1:e.c1_temperature||"normal",shots1:jt[e.c1_shots]||"one",portion1:e.c1_portion_ml||40,process2:e.c2_process||"none",intensity2:e.c2_intensity||"medium",aroma2:e.c2_aroma||"standard",temperature2:e.c2_temperature||"normal",shots2:jt[e.c2_shots]||"none",portion2:e.c2_portion_ml||0},this._editSaving=!1}render(){if(!this.hass||!this._config)return V;const t=this._getPrefix();if(!t)return K`<ha-card>
        <div class="no-device">
          <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
          <p>No Melitta Barista device found.</p>
          <p class="hint">Make sure the integration is installed and configured.</p>
        </div>
      </ha-card>`;const e=this._state("state")||"unavailable",i=this._state("activity")||"Idle",s=this._state("progress"),r=this._state("action_required"),o="Connected"===(this._state("connection")||"Disconnected"),n="unavailable"===e||"unknown"===e,a="Brewing"===e,c="Ready"===e,l=!!r&&"None"!==r&&"unknown"!==r,d=!!s&&"unknown"!==s&&"None"!==s,p=d?Math.max(0,Math.min(100,parseFloat(s)||0)):0,h=St[e.toLowerCase()]||"var(--primary-text-color)",f=this._config.name||"Melitta Barista",m=this._config.show_header,g=this._config.show_status;return n?K`<ha-card>
        ${m?K`
          <div class="card-header">
            <span class="machine-name">${f}</span>
            <div class="connection-dot" style="background: var(--mbc-error)"></div>
          </div>
        `:V}
        <div class="offline-section">
          <ha-icon icon="mdi:bluetooth-off"></ha-icon>
          <span>Machine offline</span>
        </div>
      </ha-card>`:K`<ha-card>
      ${m?K`
        <div class="card-header">
          <span class="machine-name">${f}</span>
          <div class="connection-dot" style="background: ${o?"var(--mbc-success)":"var(--mbc-error)"}"></div>
        </div>
      `:V}

      ${g&&!a?K`
        <div class="status-section">
          <div class="state-row">
            <span class="state-badge" style="background: ${h}18; color: ${h}">
              ${e}
            </span>
          </div>
        </div>

        ${l?K`
          <div class="action-alert">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span>${r}</span>
          </div>
        `:V}
      `:V}

      ${a?K`
        <div class="brewing-view">
          <div class="brewing-icon-wrap">
            ${Lt(this._selectedRecipe()||"Espresso",64,"brew-active")}
          </div>
          <div class="brewing-info">
            <span class="brewing-recipe">${this._selectedRecipe()||"Brewing"}</span>
            <span class="brewing-activity">${i}</span>
            ${d?K`
              <div class="brewing-progress">
                <div class="brewing-progress-fill" style="width: ${p}%"></div>
              </div>
              <span class="brewing-percent">${Math.round(p)}%</span>
            `:V}
          </div>
          <button class="brewing-cancel" @click=${()=>this.hass.callService("button","press",{entity_id:`button.${t}_cancel`})}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      `:V}

      ${!a&&this._config.show_profiles&&c&&this._profileOptions().length>1?this._renderProfileTabs():V}

      ${!a&&c?this._renderDirectKey():V}

      ${!a&&this._config.show_recipes&&this._recipeOptions().length>0?this._renderRecipes():V}

      ${!a&&this._config.show_freestyle&&c?this._renderFreestyle():V}

      ${this._config.show_stats?this._renderStats():V}

      ${this._config.show_maintenance?this._renderMaintenance():V}

      ${this._config.show_settings?this._renderSettings():V}

      ${this._editDk?this._renderEditDialog():V}
    </ha-card>`}_renderProfileTabs(){const t=this._profileOptions(),e=this._selectedProfile();return K`
      <div class="profile-tabs">
        ${t.map(t=>K`
          <button class="profile-tab" ?data-active=${t===e}
            @click=${()=>{t!==e&&this._selectProfile(t)}}>
            ${t}
            ${t===e?K`<span class="profile-tab-indicator"></span>`:V}
          </button>
        `)}
      </div>
    `}_renderDirectKey(){const t=this._getDirectKeyData();if(!t)return V;const e=t.profiles[t.activeProfile]??{};return 0===Object.keys(e).length?V:K`
      <div class="dk-grid">
        ${yt.map(t=>{const i=e[t];if(!i)return V;const s=this._selectedDk===t,r=void 0!==i.c1_process&&"none"!==i.c1_process;return K`
            <button class="dk-card" ?data-selected=${s}
              @click=${()=>this._handleDkClick(t)}
              @dblclick=${()=>this._openEditDialog(t,i)}
              @pointerdown=${()=>this._startDkLongPress(t,i)}
              @pointerup=${()=>this._cancelDkLongPress()}
              @pointerleave=${()=>this._cancelDkLongPress()}
              @contextmenu=${t=>t.preventDefault()}>
              <div style="${s&&r?"opacity: 0.15":""}">
                ${Lt(wt[t],48,`dk-${t}`)}
              </div>
              ${s&&r?K`
                <div class="dk-card-overlay">
                  ${this._renderDkRecipeInfo(i)}
                </div>
              `:V}
              <span class="dk-card-label">
                ${s?`Brew ${wt[t]}`:wt[t]}
              </span>
            </button>
          `})}

        <!-- 2x toggle -->
        <button class="dk-card" ?data-selected=${this._twoCups}
          @click=${()=>{this._twoCups=!this._twoCups}}>
          <div style="display:flex;align-items:center;justify-content:center;width:48px;height:55px;font-size:1.6em;font-weight:700;color:var(--mbc-text);opacity:${this._twoCups?"1":"0.35"}">
            2x
          </div>
          <span class="dk-card-label">${this._twoCups?"2x ON":"2x"}</span>
        </button>

      </div>
    `}_renderDkRecipeInfo(t){const e=[];return t.c1_process&&"none"!==t.c1_process&&e.push({process:t.c1_process,intensity:t.c1_intensity,ml:t.c1_portion_ml}),t.c2_process&&"none"!==t.c2_process&&e.push({process:t.c2_process,intensity:t.c2_intensity,ml:t.c2_portion_ml}),0===e.length?V:K`
      <div class="dk-recipe-info">
        ${e.map(t=>K`
          <div class="dk-recipe-row">
            <span class="dk-recipe-ml">${t.ml}<span class="dk-recipe-ml-unit">ml</span></span>
            ${"coffee"===t.process?K`
              <span class="intensity-dots">
                ${[1,2,3,4,5].map(e=>K`
                  <span class="intensity-dot" style="background:${e<=(Ht[t.intensity]||3)?"var(--mbc-text)":"rgba(255,255,255,0.2)"}"></span>
                `)}
              </span>
            `:V}
          </div>
        `)}
      </div>
    `}_renderRecipes(){const t=this._recipeOptions(),e=this._selectedRecipe(),i=this._getDirectKeyData(),s=i&&Object.keys(i.profiles[i.activeProfile]??{}).length>0;return K`
      ${s?K`
        <div class="recipes-divider">
          <span class="recipes-divider-line"></span>
          <span class="recipes-divider-text">All Recipes</span>
          <span class="recipes-divider-line"></span>
        </div>
      `:K`<div class="section-title">Recipe</div>`}
      <div class="recipe-grid">
        ${t.map(t=>{const i=t.replace(/[^a-zA-Z0-9]/g,"");return K`
            <div class="recipe-card"
              ?data-selected=${t===e&&!this._selectedDk}
              @click=${()=>{t!==e||this._selectedDk?this._selectRecipe(t):this._brew()}}>
              ${Lt(t,48,`r-${i}`)}
              <span class="recipe-name">${t}</span>
            </div>
          `})}
      </div>
    `}_renderSegment(t,e,i,s,r=!1){return K`
      <div class="segment-picker ${r?"freestyle-disabled":""}">
        <span class="segment-label">${t}</span>
        <div class="segment-options">
          ${e.map(t=>K`
            <button class="segment-opt" ?data-active=${t===i}
              @click=${()=>s(t)}>${function(t){return Bt[t]||t.charAt(0).toUpperCase()+t.slice(1).replace(/_/g," ")}(t)}</button>
          `)}
        </div>
      </div>
    `}_renderPortion(t,e,i,s,r,o,n=!1){return K`
      <div class="portion-row ${n?"freestyle-disabled":""}">
        <div class="portion-header">
          <span class="portion-label">${t}</span>
          <span class="portion-value">${e} ml</span>
        </div>
        <input type="range" class="portion-slider"
          min=${i} max=${s} step=${r} .value=${String(e)}
          @input=${t=>o(parseInt(t.target.value)||0)} />
      </div>
    `}_renderFreestyle(){const t="coffee"===this._fsProcess1,e="none"===this._fsProcess2,i="coffee"===this._fsProcess2;return K`
      <div class="section-title">Freestyle</div>
      <div class="freestyle-section">
        <div class="freestyle-name-row">
          <input class="freestyle-name-input" type="text" placeholder="Drink name"
            .value=${this._fsName}
            @input=${t=>{this._fsName=t.target.value}} />
        </div>

        <div class="freestyle-components">
          <div class="freestyle-component">
            <div class="component-title">Component 1</div>
            ${this._renderSegment("Process",ut,this._fsProcess1,t=>{this._fsProcess1=t})}
            ${this._renderPortion("Portion",this._fsPortion1,5,250,5,t=>{this._fsPortion1=t})}
            ${this._renderSegment("Intensity",_t,this._fsIntensity1,t=>{this._fsIntensity1=t},!t)}
            ${this._renderSegment("Aroma",vt,this._fsAroma1,t=>{this._fsAroma1=t},!t)}
            ${this._renderSegment("Temp",$t,this._fsTemp1,t=>{this._fsTemp1=t})}
            ${this._renderSegment("Shots",xt,this._fsShots1,t=>{this._fsShots1=t},!t)}
          </div>

          <div class="freestyle-component">
            <div class="component-title">Component 2</div>
            ${this._renderSegment("Process",bt,this._fsProcess2,t=>{this._fsProcess2=t})}
            ${this._renderPortion("Portion",this._fsPortion2,0,250,5,t=>{this._fsPortion2=t},e)}
            ${this._renderSegment("Intensity",_t,this._fsIntensity2,t=>{this._fsIntensity2=t},!i)}
            ${this._renderSegment("Aroma",vt,this._fsAroma2,t=>{this._fsAroma2=t},!i)}
            ${this._renderSegment("Temp",$t,this._fsTemp2,t=>{this._fsTemp2=t},e)}
            ${this._renderSegment("Shots",xt,this._fsShots2,t=>{this._fsShots2=t},!i)}
          </div>
        </div>

        <div class="freestyle-brew-row">
          <button class="brew-btn" @click=${()=>this._brewFreestyle()}>
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            Brew ${this._fsName}
          </button>
        </div>
      </div>
    `}_renderStats(){const t=this._entity("sensor","total_cups"),e=t?.state?parseInt(t.state,10):null;if(null===e||isNaN(e))return K`
        <div class="section-title">Stats</div>
        <div class="stats-unavailable">Cup statistics not available.</div>
      `;const i=t.attributes||{},s=[];for(const[t,e]of Object.entries(i))"number"!=typeof e||["friendly_name","unit_of_measurement","state_class","icon"].includes(t)||s.push({name:t,count:e});return s.sort((t,e)=>e.count-t.count),K`
      <div class="section-title">Stats</div>
      <div class="stats-section">
        <div class="stats-total">
          <span class="stats-total-number">${e.toLocaleString()}</span>
          <span class="stats-total-label">Total Cups</span>
        </div>
        ${s.length>0?K`
          <div class="stats-grid">
            ${s.map(({name:t,count:e},i)=>K`
              <div class="stats-card" ?data-top=${0===i}>
                ${Lt(t,40,`stat-${t.replace(/[^a-zA-Z0-9]/g,"")}`)}
                <span class="stats-recipe-name">${t}</span>
                <span class="stats-recipe-count">${e}</span>
              </div>
            `)}
          </div>
        `:K`<div class="stats-empty">No cups brewed yet</div>`}
      </div>
    `}_renderMaintenance(){const t=this._getPrefix();if(!t)return V;const e=this._state("state")||"unknown",i="Connected"===(this._state("connection")||"Disconnected"),s="Ready"===e,r=(e,r)=>{const o=r.map(e=>{if(!this.hass.states[`button.${t}_${e.suffix}`])return V;const r=this._confirmKey===e.key,o=this._busyKey===e.key,n=!i||!s||o;return K`
          <div class="maint-card" ?data-confirming=${r}>
            <ha-icon class="maint-icon" icon="${e.icon}"></ha-icon>
            <div class="maint-info">
              <div class="maint-label">${e.label}</div>
              <div class="maint-desc">${e.desc}</div>
            </div>
            <button class="maint-btn" ?data-confirm=${r} ?disabled=${n}
              @click=${()=>this._pressMaintenanceButton(e)}>
              ${o?"...":r?"Confirm":"Start"}
            </button>
          </div>
        `}).filter(t=>t!==V);return 0===o.length?V:K`
        <div class="maint-group-title">${e}</div>
        <div class="maint-grid">${o}</div>
      `};return K`
      <div class="section-title">Maintenance</div>
      <div class="maint-section" @click=${()=>{this._confirmKey&&(this._confirmKey=null)}}>
        ${r("Cleaning & Descaling",Et)}
        ${r("Water Filter",Pt)}
        ${r("Other",Dt)}
      </div>
    `}_renderSettings(){const t=this._getPrefix();if(!t)return V;const e=At.map(e=>{const i=this.hass.states[`switch.${t}_${e}`];if(!i)return V;const s="on"===i.state,r=Nt[e];return K`
        <div class="setting-card">
          <ha-icon class="setting-icon" icon="${r.icon}"></ha-icon>
          <div class="setting-info">
            <div class="setting-label">${r.label}</div>
            <div class="setting-desc">${r.desc}</div>
          </div>
          <button class="toggle-track" ?data-on=${s}
            @click=${()=>this._toggleSwitch(e,!s)}>
            <span class="toggle-thumb"></span>
          </button>
        </div>
      `}),i=Ct.map(e=>{const i=this.hass.states[`number.${t}_${e}`];if(!i)return V;const s=Ft[e],r=parseFloat(i.state)||0;let o;return o="level"===s.format?Ut[e]?.[r]??String(r):`${r} min`,K`
        <div class="setting-card">
          <ha-icon class="setting-icon" icon="${s.icon}"></ha-icon>
          <div class="setting-info">
            <div class="setting-label">${s.label}</div>
            <div class="setting-desc">${s.desc}</div>
          </div>
          <span class="setting-value">${o}</span>
        </div>
      `});return e.every(t=>t===V)&&i.every(t=>t===V)?V:K`
      <div class="section-title">Settings</div>
      <div class="settings-grid">
        ${e}
        ${i}
      </div>
    `}_renderEditDialog(){if(!this._editDk||!this._editState)return V;const t=this._editState,e=this._editDk.category,i="coffee"===t.process1,s="none"===t.process2,r="coffee"===t.process2,o=(t,e)=>{this._editState={...this._editState,[t]:e}};return K`
      <div class="edit-overlay" @click=${()=>{this._editDk=null,this._editState=null}}>
        <div class="edit-dialog" @click=${t=>t.stopPropagation()}>
          <div class="edit-header">
            <span class="edit-title">Edit: ${wt[e]}</span>
            <button class="edit-close" @click=${()=>{this._editDk=null,this._editState=null}}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="edit-body">
            <div class="edit-component">
              <div class="component-title">Component 1</div>
              ${this._renderSegment("Process",ut,t.process1,t=>o("process1",t))}
              ${this._renderPortion("Portion",t.portion1,5,250,5,t=>o("portion1",t))}
              ${this._renderSegment("Intensity",_t,t.intensity1,t=>o("intensity1",t),!i)}
              ${this._renderSegment("Aroma",vt,t.aroma1,t=>o("aroma1",t),!i)}
              ${this._renderSegment("Temperature",$t,t.temperature1,t=>o("temperature1",t))}
              ${this._renderSegment("Shots",xt,t.shots1,t=>o("shots1",t),!i)}
            </div>
            <div class="edit-component">
              <div class="component-title">Component 2</div>
              ${this._renderSegment("Process",bt,t.process2,t=>o("process2",t))}
              ${this._renderPortion("Portion",t.portion2,0,250,5,t=>o("portion2",t),s)}
              ${this._renderSegment("Intensity",_t,t.intensity2,t=>o("intensity2",t),!r)}
              ${this._renderSegment("Aroma",vt,t.aroma2,t=>o("aroma2",t),!r)}
              ${this._renderSegment("Temperature",$t,t.temperature2,t=>o("temperature2",t),s)}
              ${this._renderSegment("Shots",xt,t.shots2,t=>o("shots2",t),!r)}
            </div>
          </div>
          <div class="edit-footer">
            <button class="edit-btn-cancel" @click=${()=>{this._editDk=null,this._editState=null}}>
              Cancel
            </button>
            <button class="edit-btn-save" ?disabled=${this._editSaving} @click=${()=>this._saveDirectkey()}>
              ${this._editSaving?"...":"Save"}
            </button>
          </div>
        </div>
      </div>
    `}static get styles(){return Ot}};t([mt({attribute:!1})],It.prototype,"hass",void 0),t([gt()],It.prototype,"_config",void 0),t([gt()],It.prototype,"_resolvedPrefix",void 0),t([gt()],It.prototype,"_fsName",void 0),t([gt()],It.prototype,"_fsProcess1",void 0),t([gt()],It.prototype,"_fsIntensity1",void 0),t([gt()],It.prototype,"_fsAroma1",void 0),t([gt()],It.prototype,"_fsPortion1",void 0),t([gt()],It.prototype,"_fsTemp1",void 0),t([gt()],It.prototype,"_fsShots1",void 0),t([gt()],It.prototype,"_fsProcess2",void 0),t([gt()],It.prototype,"_fsIntensity2",void 0),t([gt()],It.prototype,"_fsAroma2",void 0),t([gt()],It.prototype,"_fsPortion2",void 0),t([gt()],It.prototype,"_fsTemp2",void 0),t([gt()],It.prototype,"_fsShots2",void 0),t([gt()],It.prototype,"_selectedDk",void 0),t([gt()],It.prototype,"_twoCups",void 0),t([gt()],It.prototype,"_editDk",void 0),t([gt()],It.prototype,"_editState",void 0),t([gt()],It.prototype,"_editSaving",void 0),t([gt()],It.prototype,"_confirmKey",void 0),t([gt()],It.prototype,"_busyKey",void 0),It=t([pt("melitta-barista-card")],It),window.customCards=window.customCards||[],window.customCards.push({type:"melitta-barista-card",name:"Melitta Barista Card",description:"Premium control card for Melitta Barista coffee machines",preview:!0,documentationURL:"https://github.com/dzerik/melitta-barista-card"}),console.info("%c MELITTA-BARISTA-CARD %c v2.0.0 ","color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;","color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;");export{It as MelittaBaristaCard};
