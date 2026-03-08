function e(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new o(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:f}=Object,g=globalThis,u=g.trustedTypes,m=u?u.emptyScript:"",$=g.reactiveElementPolyfillSupport,b=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},v=(e,t)=>!c(e,t),y={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);r?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=f(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...d(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=s;const o=r.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){const o=this.constructor;if(!1===s&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??v)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,$?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=e=>e,k=w.trustedTypes,E=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,M=`<${P}>`,D=document,O=()=>D.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,z="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,L=/>/g,B=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,F=/"/g,I=/^(?:script|style|textarea|title)$/i,j=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),W=j(1),Q=j(2),V=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),G=new WeakMap,Z=D.createTreeWalker(D,129);function X(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,s=[];let r,o=2===t?"<svg>":3===t?"<math>":"",n=R;for(let t=0;t<i;t++){const i=e[t];let a,c,l=-1,h=0;for(;h<i.length&&(n.lastIndex=h,c=n.exec(i),null!==c);)h=n.lastIndex,n===R?"!--"===c[1]?n=U:void 0!==c[1]?n=L:void 0!==c[2]?(I.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=B):void 0!==c[3]&&(n=B):n===B?">"===c[0]?(n=r??R,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?B:'"'===c[3]?F:H):n===F||n===H?n=B:n===U||n===L?n=R:(n=B,r=void 0);const d=n===B&&e[t+1].startsWith("/>")?" ":"";o+=n===R?i+M:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+C+d):i+C+(-2===l?t:d)}return[X(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class K{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0;const n=e.length-1,a=this.parts,[c,l]=J(e,t);if(this.el=K.createElement(c,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(S)){const t=l[o++],i=s.getAttribute(e).split(C),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?se:"?"===n[1]?re:"@"===n[1]?oe:ie}),s.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(e));if(I.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],O()),Z.nextNode(),a.push({type:2,index:++r});s.append(e[t],O())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)a.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const i=D.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,s){if(t===V)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=N(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??D).importNode(t,!0);Z.currentNode=s;let r=Z.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new te(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new ne(r,this,e)),this._$AV.push(t),a=i[++n]}o!==a?.index&&(r=Z.nextNode(),o++)}return Z.currentNode=D,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),N(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new K(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new te(this.O(O()),this.O(O()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(e,t=this,i,s){const r=this.strings;let o=!1;if(void 0===r)e=Y(this,e,t,0),o=!N(e)||e!==this._$AH&&e!==V,o&&(this._$AH=e);else{const s=e;let n,a;for(e=r[0],n=0;n<r.length-1;n++)a=Y(this,s[i+n],t,n),a===V&&(a=this._$AH[n]),o||=!N(a)||a!==this._$AH[n],a===q?e=q:e!==q&&(e+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class re extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class oe extends ie{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??q)===V)return;const i=this._$AH,s=e===q&&i!==q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(K,te),(w.litHtmlVersions??=[]).push("3.3.2");const ce=globalThis;class le extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new te(t.insertBefore(O(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}le._$litElement$=!0,le.finalized=!0,ce.litElementHydrateSupport?.({LitElement:le});const he=ce.litElementPolyfillSupport;he?.({LitElement:le}),(ce.litElementVersions??=[]).push("4.2.2");const de=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:v},fe=(e=pe,t,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,r,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];t.call(this,i),this.requestUpdate(s,r,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ge(e){return(t,i)=>"object"==typeof i?fe(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ue(e){return ge({...e,state:!0,attribute:!1})}const me=["coffee","milk","water"],$e=["none",...me],be=["very_mild","mild","medium","strong","very_strong"],_e=["cold","normal","high"],ve=["none","one","two","three"],ye={ready:"var(--state-active-color, #4caf50)",brewing:"var(--warning-color, #ff9800)",cleaning:"var(--info-color, #2196f3)",descaling:"var(--info-color, #2196f3)",off:"var(--disabled-color, #9e9e9e)",busy:"var(--warning-color, #ff9800)",unavailable:"var(--error-color, #f44336)"},xe=["energy_saving","auto_bean_select","rinsing_disabled"],we=["water_hardness","auto_off_after","brew_temperature"];function Ae(e){const t=new Set;for(const i of Object.keys(e.states)){const e=i.match(/^button\.(.+?)_brew$/);e&&t.add(e[1])}const i=[];for(const s of t){const t=e.states[`sensor.${s}_state`];if(!t)continue;const r=t.attributes.friendly_name,o=r?r.replace(/\s*State$/,""):s.replace(/_/g," ");i.push({prefix:s,name:o})}return i}const ke={Espresso:{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#C9A87C",height:.04}},Ristretto:{layers:[{color:"#1A0D04",height:.22}],foam:{color:"#B89970",height:.03}},Lungo:{layers:[{color:"#4A2A14",height:.5}],foam:{color:"#C9A87C",height:.04}},"Espresso Doppio":{layers:[{color:"#3E1F0D",height:.45}],foam:{color:"#C9A87C",height:.04}},"Ristretto Doppio":{layers:[{color:"#1A0D04",height:.4}],foam:{color:"#B89970",height:.03}},"Café Crème":{layers:[{color:"#5C3A1E",height:.5}],foam:{color:"#E8D5B7",height:.08}},"Café Crème Doppio":{layers:[{color:"#5C3A1E",height:.58}],foam:{color:"#E8D5B7",height:.08}},Americano:{layers:[{color:"#3E1F0D",height:.6}]},"Americano Extra":{layers:[{color:"#2C1507",height:.65}]},"Long Black":{layers:[{color:"#3E1F0D",height:.55}],foam:{color:"#C9A87C",height:.05}},"Red Eye":{layers:[{color:"#2C1507",height:.6}]},"Black Eye":{layers:[{color:"#1A0D04",height:.65}]},"Dead Eye":{layers:[{color:"#0F0803",height:.7}]},Cappuccino:{layers:[{color:"#3E1F0D",height:.28},{color:"#D4B896",height:.22}],foam:{color:"#F5EDE0",height:.18}},"Espresso Macchiato":{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#F5EDE0",height:.12}},"Caffè Latte":{tall:!0,layers:[{color:"#E8D5B7",height:.35},{color:"#8B5A30",height:.18}],foam:{color:"#F5EDE0",height:.1}},"Café au Lait":{layers:[{color:"#C9A87C",height:.5}],foam:{color:"#F0E6D8",height:.06}},"Flat White":{layers:[{color:"#3E1F0D",height:.2},{color:"#D4B896",height:.3}],foam:{color:"#F0E6D8",height:.05}},"Latte Macchiato":{tall:!0,layers:[{color:"#F0E6D8",height:.28},{color:"#6B4226",height:.12},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.15}},"Latte Macchiato Extra":{tall:!0,layers:[{color:"#F0E6D8",height:.25},{color:"#5C3A1E",height:.16},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.14}},"Latte Macchiato Triple":{tall:!0,layers:[{color:"#F0E6D8",height:.22},{color:"#4A2A14",height:.2},{color:"#E8D5B7",height:.1}],foam:{color:"#FEFCFA",height:.14}},Milk:{tall:!0,layers:[{color:"#F0E6D8",height:.55}]},"Milk Froth":{tall:!0,layers:[{color:"#F0E6D8",height:.15}],foam:{color:"#FEFCFA",height:.4}},"Hot Water":{layers:[{color:"#9DC4D8",height:.5}]}},Ee={layers:[{color:"#5C3A1E",height:.45}]};function Se(e,t,i){const s=ke[e]||Ee,r=s.tall,o=r?36:50,n=r?30:42,a=r?68:48,c=r?12:28,l=c+a,h=r?50:46,d=h-o/2,p=h+o/2,f=h-n/2,g=h+n/2,u=`M ${d} ${c} L ${f+4} ${l-4} Q ${f} ${l} ${f+4} ${l} L ${g-4} ${l} Q ${g} ${l} ${g-4} ${l-4} L ${p} ${c}`,m=1.5,$=d+m,b=p-m,_=f+m+1.2,v=g-m-1.2,y=c+m,x=l-m,w=2.8,A=`M ${$} ${y} L ${_+w} ${x-w} Q ${_} ${x} ${_+w} ${x} L ${v-w} ${x} Q ${v} ${x} ${v-w} ${x-w} L ${b} ${y} Z`,k=(e,t)=>{const i=(e-y)/(x-y);return t?$+(_-$)*i:b+(v-b)*i};let E=x;const S=[],C=[...s.layers];for(let e=C.length-1;e>=0;e--){const{color:t,height:i}=C[e],s=E,r=E-a*i;E=r;const o=k(r,!0),n=k(r,!1),c=k(s,!0),l=k(s,!1),h=e===C.length-1,d=h?w:0,p=h?`M ${o} ${r} L ${c+d} ${s-d} Q ${c} ${s} ${c+d} ${s} L ${l-d} ${s} Q ${l} ${s} ${l-d} ${s-d} L ${n} ${r} Z`:`M ${o} ${r} L ${c} ${s} L ${l} ${s} L ${n} ${r} Z`;S.push({d:p,fill:t})}if(s.foam){const e=E,t=E-a*s.foam.height;E=t;const i=k(t,!0),r=k(t,!1),o=k(e,!0),n=k(e,!1);S.push({d:`M ${i} ${t} L ${o} ${e} L ${n} ${e} L ${r} ${t} Z`,fill:s.foam.color})}const P=p,M=c+.18*a,D=c+.65*a,O=r?10:14,N=`M ${h-6} ${c-2} Q ${h-8} ${c-10} ${h-5} ${c-16}`,T=`${N};M ${h-6} ${c-2} Q ${h-4} ${c-10} ${h-7} ${c-16};${N}`,z=`M ${h+1} ${c-3} Q ${h+3} ${c-11} ${h} ${c-18}`,R=`${z};M ${h+1} ${c-3} Q ${h-1} ${c-11} ${h+2} ${c-18};${z}`,U=`M ${h+8} ${c-2} Q ${h+6} ${c-9} ${h+9} ${c-15}`,L=`${U};M ${h+8} ${c-2} Q ${h+10} ${c-9} ${h+7} ${c-15};${U}`;return Q`
    <svg width="${t}" height="${1.15*t}" viewBox="0 0 ${100} ${115}" fill="none">
      <defs>
        <clipPath id="clip-${i}">
          <path d="${A}" />
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

      ${"Milk"!==e&&"Milk Froth"!==e&&"Hot Water"!==e?Q`
        <g opacity="0.20" stroke="rgba(255,255,255,0.6)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#sg-${i})">
          <path d="${N}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${T}" /></path>
          <path d="${z}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${R}" /></path>
          <path d="${U}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${L}" /></path>
        </g>
        <g opacity="0.40" stroke="#D4C4A0" stroke-width="1" fill="none" stroke-linecap="round">
          <path d="${N}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${T}" /></path>
          <path d="${z}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${R}" /></path>
          <path d="${U}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${L}" /></path>
        </g>
      `:q}

      <path d="${u}" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-linejoin="round" />

      <g clip-path="url(#clip-${i})">
        ${S.map(e=>Q`<path d="${e.d}" fill="${e.fill}" />`)}
      </g>

      <path d="${u}" fill="url(#refl-${i})" clip-path="url(#clip-${i})" />
      <path d="M ${d+1.5} ${c+3} L ${f+2.5} ${l-5} L ${f+2.5+(r?4:5)} ${l-5} L ${d+1.5+(r?4:5)} ${c+3} Z" fill="url(#spec-${i})" />
      <line x1="${p-2.5}" y1="${c+5}" x2="${g-3}" y2="${l-7}" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round" />
      <line x1="${d+3}" y1="${c+.5}" x2="${p-3}" y2="${c+.5}" stroke="rgba(255,255,255,0.20)" stroke-width="1" stroke-linecap="round" />

      <path d="M ${P} ${M} C ${P+O} ${M-2}, ${P+O} ${D+2}, ${P} ${D}" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="none" stroke-linecap="round" />

      <g mask="url(#rm-${i})">
        <g transform="translate(0, ${2*l+2}) scale(1, -1)">
          <path d="${u}" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linejoin="round" />
          <g clip-path="url(#clip-${i})" opacity="0.5">
            ${S.map(e=>Q`<path d="${e.d}" fill="${e.fill}" />`)}
          </g>
          <path d="M ${P} ${M} C ${P+O} ${M-2}, ${P+O} ${D+2}, ${P} ${D}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" />
        </g>
      </g>
    </svg>
  `}const Ce=n`
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

  /* ── No device / Offline ── */
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

  /* ── Header ── */
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

  /* ── Status ── */
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
  .activity-text {
    font-size: 0.8em;
    color: var(--mbc-text2);
    opacity: 0.8;
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

  /* ── Action alert ── */
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

  /* ── Brewing view ── */
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

  /* ── Profile ── */
  .profile-row {
    display: flex;
    gap: 6px;
    padding: 4px 12px 8px;
    align-items: center;
  }
  .profile-row ha-icon { --mdc-icon-size: 18px; color: var(--mbc-text2); opacity: 0.6; }
  .profile-select {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid var(--mbc-border);
    border-radius: 8px;
    background: var(--mbc-surface);
    color: var(--mbc-text);
    font-size: 0.82em;
    font-family: inherit;
    cursor: pointer;
    appearance: auto;
    transition: border-color 0.2s;
  }
  .profile-select:focus { outline: none; border-color: var(--mbc-accent); }

  /* ── Recipe grid ── */
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

  /* ── Brew button ── */
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

  /* ── Freestyle ── */
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

  /* ── Settings ── */
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
`;let Pe=class extends le{setConfig(e){this._config=e}_fireConfigChanged(){const e=new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0});this.dispatchEvent(e)}_valueChanged(e,t){const i=t.target,s=i instanceof HTMLInputElement&&"checkbox"===i.type?i.checked:i.value;this._config={...this._config,[e]:s},this._fireConfigChanged()}_deviceSelected(e){const t=e.target.value;if("__manual__"===t)return this._config={...this._config,entity_prefix:""},void this._fireConfigChanged();const i=(this.hass?Ae(this.hass):[]).find(e=>e.prefix===t);this._config={...this._config,entity_prefix:t,name:i?.name||this._config.name},this._fireConfigChanged()}render(){if(!this._config)return q;const e=this.hass?Ae(this.hass):[],t=this._config.entity_prefix||"",i=e.some(e=>e.prefix===t),s=t&&!i&&e.length>0;return W`
      ${e.length>0?W`
            <div class="editor-row">
              <label for="device">Device</label>
              <select
                id="device"
                @change=${this._deviceSelected}
              >
                ${e.map(e=>W`
                    <option value=${e.prefix} ?selected=${e.prefix===t}>
                      ${e.name}
                    </option>
                  `)}
                <option value="__manual__" ?selected=${s}>
                  Enter manually...
                </option>
              </select>
            </div>
          `:W`
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

      ${s?W`
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
        <input
          type="checkbox"
          id="show_header"
          .checked=${!1!==this._config.show_header}
          @change=${e=>this._valueChanged("show_header",e)}
        />
        <label for="show_header">Show header</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_status"
          .checked=${!1!==this._config.show_status}
          @change=${e=>this._valueChanged("show_status",e)}
        />
        <label for="show_status">Show status</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_profiles"
          .checked=${!1!==this._config.show_profiles}
          @change=${e=>this._valueChanged("show_profiles",e)}
        />
        <label for="show_profiles">Show profile selector</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_recipes"
          .checked=${!1!==this._config.show_recipes}
          @change=${e=>this._valueChanged("show_recipes",e)}
        />
        <label for="show_recipes">Show recipe selector</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_freestyle"
          .checked=${this._config.show_freestyle||!1}
          @change=${e=>this._valueChanged("show_freestyle",e)}
        />
        <label for="show_freestyle">Show freestyle recipe</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_settings"
          .checked=${this._config.show_settings||!1}
          @change=${e=>this._valueChanged("show_settings",e)}
        />
        <label for="show_settings">Show settings</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="compact"
          .checked=${this._config.compact||!1}
          @change=${e=>this._valueChanged("compact",e)}
        />
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
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        color: var(--primary-text-color);
      }

      select {
        cursor: pointer;
      }

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
    `}};e([ge({attribute:!1})],Pe.prototype,"hass",void 0),e([ue()],Pe.prototype,"_config",void 0),Pe=e([de("melitta-barista-card-editor")],Pe);const Me={energy_saving:{label:"Energy Saving",desc:"Reduce power when idle",icon:"mdi:lightning-bolt"},auto_bean_select:{label:"Auto Bean Select",desc:"Auto-choose bean hopper",icon:"mdi:seed"},rinsing_disabled:{label:"Rinsing Disabled",desc:"Skip auto rinse cycle",icon:"mdi:water-off"}},De={water_hardness:{label:"Water Hardness",desc:"Calibrate for water type",icon:"mdi:water",format:"level"},auto_off_after:{label:"Auto Off",desc:"Minutes until shutdown",icon:"mdi:timer-outline",format:"minutes"},brew_temperature:{label:"Brew Temperature",desc:"Brewing water temp",icon:"mdi:thermometer",format:"level"}},Oe={water_hardness:{1:"Soft",2:"Medium",3:"Hard",4:"Very Hard"},brew_temperature:{0:"Low",1:"Normal",2:"High"}},Ne={very_mild:"V.Mild",mild:"Mild",medium:"Med",strong:"Strong",very_strong:"V.Strong",extra_strong:"X.Strong",cold:"Cold",normal:"Normal",high:"High",none:"None",one:"1",two:"2",three:"3",coffee:"Coffee",milk:"Milk",water:"Water"};let Te=class extends le{constructor(){super(...arguments),this._resolvedPrefix=null,this._fsName="Custom",this._fsProcess1="coffee",this._fsIntensity1="medium",this._fsPortion1=40,this._fsTemp1="normal",this._fsShots1="one",this._fsProcess2="none",this._fsIntensity2="medium",this._fsPortion2=0,this._fsTemp2="normal",this._fsShots2="none"}static getConfigElement(){return document.createElement("melitta-barista-card-editor")}static getStubConfig(e){const t=Ae(e);return{entity_prefix:t.length>0?t[0].prefix:"",name:t.length>0?t[0].name:"Melitta Barista",show_recipes:!0,show_settings:!1,compact:!1}}setConfig(e){this._config={...e,show_header:!1!==e.show_header,show_status:!1!==e.show_status,show_recipes:!1!==e.show_recipes,show_profiles:!1!==e.show_profiles,show_freestyle:e.show_freestyle||!1,show_settings:e.show_settings||!1,compact:e.compact||!1},this._resolvedPrefix=null}getCardSize(){return this._config?.compact?3:5}getGridOptions(){return{rows:this._config?.compact?3:5,columns:6,min_rows:2,min_columns:3}}_getPrefix(){if(this._config.entity_prefix)return this._config.entity_prefix;if(this._resolvedPrefix)return this._resolvedPrefix;if(this.hass){const e=Ae(this.hass);if(e.length>0)return this._resolvedPrefix=e[0].prefix,this._config.name||(this._config={...this._config,name:e[0].name}),this._resolvedPrefix}return null}shouldUpdate(e){if(e.has("_config")||e.has("_resolvedPrefix"))return!0;for(const t of e.keys())if("string"==typeof t&&t.startsWith("_fs"))return!0;const t=e.get("hass");if(!t)return!0;const i=this._getPrefix();if(!i)return!0;for(const[e,s]of Object.entries(this.hass.states))if(e.includes(i)&&t.states[e]!==s)return!0;return!1}_entity(e,t){const i=this._getPrefix();if(i)return this.hass.states[`${e}.${i}_${t}`]}_state(e){const t=this._getPrefix();if(!t)return null;for(const i of["sensor","button","select","number","switch"]){const s=this.hass.states[`${i}.${t}_${e}`];if(s)return s.state}return null}_recipeEntity(){return this._entity("select","recipe")}_recipeOptions(){return this._recipeEntity()?.attributes?.options||[]}_selectedRecipe(){const e=this._recipeEntity()?.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}_selectRecipe(e){const t=this._getPrefix();t&&this.hass.callService("select","select_option",{entity_id:`select.${t}_recipe`,option:e})}_profileEntity(){return this._entity("select","profile")}_profileOptions(){return this._profileEntity()?.attributes?.options||[]}_selectedProfile(){const e=this._profileEntity()?.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}_selectProfile(e){const t=this._getPrefix();t&&this.hass.callService("select","select_option",{entity_id:`select.${t}_profile`,option:e})}_brew(){const e=this._getPrefix();e&&this.hass.callService("button","press",{entity_id:`button.${e}_brew`})}_brewFreestyle(){const e=this._getPrefix();e&&this.hass.callService("melitta_barista","brew_freestyle",{entity_id:`button.${e}_brew`,name:this._fsName,process1:this._fsProcess1,intensity1:this._fsIntensity1,portion1_ml:this._fsPortion1,temperature1:this._fsTemp1,shots1:this._fsShots1,process2:this._fsProcess2,intensity2:this._fsIntensity2,portion2_ml:this._fsPortion2,temperature2:this._fsTemp2,shots2:this._fsShots2})}_toggleSwitch(e,t){const i=this._getPrefix();i&&this.hass.callService("switch",t?"turn_on":"turn_off",{entity_id:`switch.${i}_${e}`})}render(){if(!this.hass||!this._config)return q;const e=this._getPrefix();if(!e)return W`<ha-card>
        <div class="no-device">
          <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
          <p>No Melitta Barista device found.</p>
          <p class="hint">Make sure the integration is installed and configured.</p>
        </div>
      </ha-card>`;const t=this._state("state")||"unavailable",i=this._state("activity")||"Idle",s=this._state("progress"),r=this._state("action_required"),o="Connected"===(this._state("connection")||"Disconnected"),n="unavailable"===t||"unknown"===t,a="Brewing"===t,c="Ready"===t,l=!!r&&"None"!==r&&"unknown"!==r,h=!!s&&"unknown"!==s&&"None"!==s,d=h?Math.max(0,Math.min(100,parseFloat(s)||0)):0,p=ye[t.toLowerCase()]||"var(--primary-text-color)",f=this._config.name||"Melitta Barista",g=this._config.show_header,u=this._config.show_status;return n?W`<ha-card>
        ${g?W`
          <div class="card-header">
            <span class="machine-name">${f}</span>
            <div class="connection-dot" style="background: var(--mbc-error)"></div>
          </div>
        `:q}
        <div class="offline-section">
          <ha-icon icon="mdi:bluetooth-off"></ha-icon>
          <span>Machine offline</span>
        </div>
      </ha-card>`:W`<ha-card>
      ${g?W`
        <div class="card-header">
          <span class="machine-name">${f}</span>
          <div class="connection-dot" style="background: ${o?"var(--mbc-success)":"var(--mbc-error)"}"></div>
        </div>
      `:q}

      ${u&&!a?W`
        <div class="status-section">
          <div class="state-row">
            <span class="state-badge" style="background: ${p}18; color: ${p}">
              ${t}
            </span>
          </div>
        </div>

        ${l?W`
          <div class="action-alert">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span>${r}</span>
          </div>
        `:q}
      `:q}

      ${a?W`
        <div class="brewing-view">
          <div class="brewing-icon-wrap">
            ${Se(this._selectedRecipe()||"Espresso",64,"brew-active")}
          </div>
          <div class="brewing-info">
            <span class="brewing-recipe">${this._selectedRecipe()||"Brewing"}</span>
            <span class="brewing-activity">${i}</span>
            ${h?W`
              <div class="brewing-progress">
                <div class="brewing-progress-fill" style="width: ${d}%"></div>
              </div>
              <span class="brewing-percent">${Math.round(d)}%</span>
            `:q}
          </div>
          <button class="brewing-cancel" @click=${()=>this.hass.callService("button","press",{entity_id:`button.${e}_cancel`})}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      `:q}

      ${!a&&this._config.show_profiles&&c&&this._profileOptions().length>1?this._renderProfile():q}

      ${!a&&this._config.show_recipes&&this._recipeOptions().length>0?this._renderRecipes():q}

      ${!a&&this._config.show_freestyle&&c?this._renderFreestyle():q}

      ${this._config.show_settings?this._renderSettings():q}
    </ha-card>`}_renderProfile(){const e=this._profileOptions(),t=this._selectedProfile();return W`
      <div class="section-title">Profile</div>
      <div class="profile-row">
        <ha-icon icon="mdi:account-circle"></ha-icon>
        <select class="profile-select" .value=${t||""}
          @change=${e=>this._selectProfile(e.target.value)}>
          ${e.map(e=>W`<option value=${e} ?selected=${e===t}>${e}</option>`)}
        </select>
      </div>
    `}_renderRecipes(){const e=this._recipeOptions(),t=this._selectedRecipe();return W`
      <div class="section-title">Recipe</div>
      <div class="recipe-grid">
        ${e.map(e=>{const i=e.replace(/[^a-zA-Z0-9]/g,"");return W`
            <div class="recipe-card"
              ?data-selected=${e===t}
              @click=${()=>this._selectRecipe(e)}>
              ${Se(e,48,`r-${i}`)}
              <span class="recipe-name">${e}</span>
            </div>
          `})}
      </div>
      <div class="brew-row">
        <button class="brew-btn" ?disabled=${!t} @click=${()=>this._brew()}>
          <ha-icon icon="mdi:coffee"></ha-icon>
          Brew ${t||""}
        </button>
      </div>
    `}_renderSegment(e,t,i,s,r=!1){return W`
      <div class="segment-picker ${r?"freestyle-disabled":""}">
        <span class="segment-label">${e}</span>
        <div class="segment-options">
          ${t.map(e=>W`
            <button class="segment-opt" ?data-active=${e===i}
              @click=${()=>s(e)}>${function(e){return Ne[e]||e.charAt(0).toUpperCase()+e.slice(1).replace(/_/g," ")}(e)}</button>
          `)}
        </div>
      </div>
    `}_renderPortion(e,t,i,s,r,o,n=!1){return W`
      <div class="portion-row ${n?"freestyle-disabled":""}">
        <div class="portion-header">
          <span class="portion-label">${e}</span>
          <span class="portion-value">${t} ml</span>
        </div>
        <input type="range" class="portion-slider"
          min=${i} max=${s} step=${r} .value=${String(t)}
          @input=${e=>o(parseInt(e.target.value)||0)} />
      </div>
    `}_renderFreestyle(){const e="coffee"===this._fsProcess1,t="none"===this._fsProcess2,i="coffee"===this._fsProcess2;return W`
      <div class="section-title">Freestyle</div>
      <div class="freestyle-section">
        <div class="freestyle-name-row">
          <input class="freestyle-name-input" type="text" placeholder="Drink name"
            .value=${this._fsName}
            @input=${e=>{this._fsName=e.target.value}} />
        </div>

        <div class="freestyle-components">
          <div class="freestyle-component">
            <div class="component-title">Component 1</div>
            ${this._renderSegment("Process",me,this._fsProcess1,e=>{this._fsProcess1=e})}
            ${this._renderPortion("Portion",this._fsPortion1,5,250,5,e=>{this._fsPortion1=e})}
            ${this._renderSegment("Intensity",be,this._fsIntensity1,e=>{this._fsIntensity1=e},!e)}
            ${this._renderSegment("Temp",_e,this._fsTemp1,e=>{this._fsTemp1=e})}
            ${this._renderSegment("Shots",ve,this._fsShots1,e=>{this._fsShots1=e},!e)}
          </div>

          <div class="freestyle-component">
            <div class="component-title">Component 2</div>
            ${this._renderSegment("Process",$e,this._fsProcess2,e=>{this._fsProcess2=e})}
            ${this._renderPortion("Portion",this._fsPortion2,0,250,5,e=>{this._fsPortion2=e},t)}
            ${this._renderSegment("Intensity",be,this._fsIntensity2,e=>{this._fsIntensity2=e},!i)}
            ${this._renderSegment("Temp",_e,this._fsTemp2,e=>{this._fsTemp2=e},t)}
            ${this._renderSegment("Shots",ve,this._fsShots2,e=>{this._fsShots2=e},!i)}
          </div>
        </div>

        <div class="freestyle-brew-row">
          <button class="brew-btn" @click=${()=>this._brewFreestyle()}>
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            Brew ${this._fsName}
          </button>
        </div>
      </div>
    `}_renderSettings(){const e=this._getPrefix();if(!e)return q;const t=xe.map(t=>{const i=this.hass.states[`switch.${e}_${t}`];if(!i)return q;const s="on"===i.state,r=Me[t];return W`
        <div class="setting-card">
          <ha-icon class="setting-icon" icon="${r.icon}"></ha-icon>
          <div class="setting-info">
            <div class="setting-label">${r.label}</div>
            <div class="setting-desc">${r.desc}</div>
          </div>
          <button class="toggle-track" ?data-on=${s}
            @click=${()=>this._toggleSwitch(t,!s)}>
            <span class="toggle-thumb"></span>
          </button>
        </div>
      `}),i=we.map(t=>{const i=this.hass.states[`number.${e}_${t}`];if(!i)return q;const s=De[t],r=parseFloat(i.state)||0;let o;return o="level"===s.format?Oe[t]?.[r]??String(r):`${r} min`,W`
        <div class="setting-card">
          <ha-icon class="setting-icon" icon="${s.icon}"></ha-icon>
          <div class="setting-info">
            <div class="setting-label">${s.label}</div>
            <div class="setting-desc">${s.desc}</div>
          </div>
          <span class="setting-value">${o}</span>
        </div>
      `});return t.every(e=>e===q)&&i.every(e=>e===q)?q:W`
      <div class="section-title">Settings</div>
      <div class="settings-grid">
        ${t}
        ${i}
      </div>
    `}static get styles(){return Ce}};e([ge({attribute:!1})],Te.prototype,"hass",void 0),e([ue()],Te.prototype,"_config",void 0),e([ue()],Te.prototype,"_resolvedPrefix",void 0),e([ue()],Te.prototype,"_fsName",void 0),e([ue()],Te.prototype,"_fsProcess1",void 0),e([ue()],Te.prototype,"_fsIntensity1",void 0),e([ue()],Te.prototype,"_fsPortion1",void 0),e([ue()],Te.prototype,"_fsTemp1",void 0),e([ue()],Te.prototype,"_fsShots1",void 0),e([ue()],Te.prototype,"_fsProcess2",void 0),e([ue()],Te.prototype,"_fsIntensity2",void 0),e([ue()],Te.prototype,"_fsPortion2",void 0),e([ue()],Te.prototype,"_fsTemp2",void 0),e([ue()],Te.prototype,"_fsShots2",void 0),Te=e([de("melitta-barista-card")],Te),window.customCards=window.customCards||[],window.customCards.push({type:"melitta-barista-card",name:"Melitta Barista Card",description:"Premium control card for Melitta Barista coffee machines",preview:!0,documentationURL:"https://github.com/dzerik/melitta-barista-card"}),console.info("%c MELITTA-BARISTA-CARD %c v1.2.0 ","color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;","color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;");export{Te as MelittaBaristaCard};
