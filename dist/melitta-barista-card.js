function e(e,t,a,i){var r,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(s=(n<3?r(s):n>3?r(t,a,s):r(t,a))||s);return n>3&&s&&Object.defineProperty(t,a,s),s}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,a=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let n=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const a=void 0!==t&&1===t.length;a&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&r.set(t,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,a,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[i+1],e[0]);return new n(a,e,i)},o=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:m,getPrototypeOf:u}=Object,_=globalThis,f=_.trustedTypes,g=f?f.emptyScript:"",h=_.reactiveElementPolyfillSupport,v=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=null!==e;break;case Number:a=null===e?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e)}catch(e){a=null}}return a}},y=(e,t)=>!l(e,t),k={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),i=this.getPropertyDescriptor(e,a,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,a){const{get:i,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);r?.call(this,t),this.requestUpdate(e,n,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...p(e),...m(e)];for(const a of t)this.createProperty(a,e[a])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,a]of t)this.elementProperties.set(e,a)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const a=this._$Eu(e,t);void 0!==a&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const e of a)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const a=t.attribute;return!1===a?void 0:"string"==typeof a?a:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(a)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const a of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=a.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,a);if(void 0!==i&&!0===a.reflect){const r=(void 0!==a.converter?.toAttribute?a.converter:b).toAttribute(t,a.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const a=this.constructor,i=a._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=a.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const n=r.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,a,i=!1,r){if(void 0!==e){const n=this.constructor;if(!1===i&&(r=this[e]),a??=n.getPropertyOptions(e),!((a.hasChanged??y)(r,t)||a.useDefault&&a.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,a))))return;this.C(e,t,a)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:i,wrapped:r},n){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==r||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,a]of e){const{wrapped:e}=a,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,a,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,h?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,z=e=>e,$=x.trustedTypes,S=$?$.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+j,P=`<${M}>`,I=document,C=()=>I.createComment(""),E=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,F="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,L=/>/g,B=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,D=/"/g,K=/^(?:script|style|textarea|title)$/i,O=e=>(t,...a)=>({_$litType$:e,strings:t,values:a}),H=O(1),U=O(2),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),W=new WeakMap,G=I.createTreeWalker(I,129);function Y(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const X=(e,t)=>{const a=e.length-1,i=[];let r,n=2===t?"<svg>":3===t?"<math>":"",s=T;for(let t=0;t<a;t++){const a=e[t];let o,l,c=-1,d=0;for(;d<a.length&&(s.lastIndex=d,l=s.exec(a),null!==l);)d=s.lastIndex,s===T?"!--"===l[1]?s=R:void 0!==l[1]?s=L:void 0!==l[2]?(K.test(l[2])&&(r=RegExp("</"+l[2],"g")),s=B):void 0!==l[3]&&(s=B):s===B?">"===l[0]?(s=r??T,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,o=l[1],s=void 0===l[3]?B:'"'===l[3]?D:V):s===D||s===V?s=B:s===R||s===L?s=T:(s=B,r=void 0);const p=s===B&&e[t+1].startsWith("/>")?" ":"";n+=s===T?a+P:c>=0?(i.push(o),a.slice(0,c)+A+a.slice(c)+j+p):a+j+(-2===c?t:p)}return[Y(e,n+(e[a]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class J{constructor({strings:e,_$litType$:t},a){let i;this.parts=[];let r=0,n=0;const s=e.length-1,o=this.parts,[l,c]=X(e,t);if(this.el=J.createElement(l,a),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&o.length<s;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(A)){const t=c[n++],a=i.getAttribute(e).split(j),s=/([.?@])?(.*)/.exec(t);o.push({type:1,index:r,name:s[2],strings:a,ctor:"."===s[1]?ie:"?"===s[1]?re:"@"===s[1]?ne:ae}),i.removeAttribute(e)}else e.startsWith(j)&&(o.push({type:6,index:r}),i.removeAttribute(e));if(K.test(i.tagName)){const e=i.textContent.split(j),t=e.length-1;if(t>0){i.textContent=$?$.emptyScript:"";for(let a=0;a<t;a++)i.append(e[a],C()),G.nextNode(),o.push({type:2,index:++r});i.append(e[t],C())}}}else if(8===i.nodeType)if(i.data===M)o.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(j,e+1));)o.push({type:7,index:r}),e+=j.length-1}r++}}static createElement(e,t){const a=I.createElement("template");return a.innerHTML=e,a}}function Q(e,t,a=e,i){if(t===q)return t;let r=void 0!==i?a._$Co?.[i]:a._$Cl;const n=E(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(e),r._$AT(e,a,i)),void 0!==i?(a._$Co??=[])[i]=r:a._$Cl=r),void 0!==r&&(t=Q(e,r._$AS(e,t.values),r,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,i=(e?.creationScope??I).importNode(t,!0);G.currentNode=i;let r=G.nextNode(),n=0,s=0,o=a[0];for(;void 0!==o;){if(n===o.index){let t;2===o.type?t=new te(r,r.nextSibling,this,e):1===o.type?t=new o.ctor(r,o.name,o.strings,this,e):6===o.type&&(t=new se(r,this,e)),this._$AV.push(t),o=a[++s]}n!==o?.index&&(r=G.nextNode(),n++)}return G.currentNode=I,i}p(e){let t=0;for(const a of this._$AV)void 0!==a&&(void 0!==a.strings?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,i){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),E(e)?e===Z||null==e||""===e?(this._$AH!==Z&&this._$AR(),this._$AH=Z):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Z&&E(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,i="number"==typeof a?this._$AC(e):(void 0===a.el&&(a.el=J.createElement(Y(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),a=e.u(this.options);e.p(t),this.T(a),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new J(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,i=0;for(const r of e)i===t.length?t.push(a=new te(this.O(C()),this.O(C()),this,this.options)):a=t[i],a._$AI(r),i++;i<t.length&&(this._$AR(a&&a._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=z(e).nextSibling;z(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ae{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,i,r){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,a.length>2||""!==a[0]||""!==a[1]?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=Z}_$AI(e,t=this,a,i){const r=this.strings;let n=!1;if(void 0===r)e=Q(this,e,t,0),n=!E(e)||e!==this._$AH&&e!==q,n&&(this._$AH=e);else{const i=e;let s,o;for(e=r[0],s=0;s<r.length-1;s++)o=Q(this,i[a+s],t,s),o===q&&(o=this._$AH[s]),n||=!E(o)||o!==this._$AH[s],o===Z?e=Z:e!==Z&&(e+=(o??"")+r[s+1]),this._$AH[s]=o}n&&!i&&this.j(e)}j(e){e===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends ae{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Z?void 0:e}}class re extends ae{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Z)}}class ne extends ae{constructor(e,t,a,i,r){super(e,t,a,i,r),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??Z)===q)return;const a=this._$AH,i=e===Z&&a!==Z||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,r=e!==Z&&(a===Z||i);i&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const oe=x.litHtmlPolyfillSupport;oe?.(J,te),(x.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;class ce extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,a)=>{const i=a?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=a?.renderBefore??null;i._$litPart$=r=new te(t.insertBefore(C(),e),e,void 0,a??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const pe=e=>(t,a)=>{void 0!==a?a.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},me={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},ue=(e=me,t,a)=>{const{kind:i,metadata:r}=a;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(a.name,e),"accessor"===i){const{name:i}=a;return{set(a){const r=t.get.call(this);t.set.call(this,a),this.requestUpdate(i,r,e,!0,a)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=a;return function(a){const r=this[i];t.call(this,a),this.requestUpdate(i,r,e,!0,a)}}throw Error("Unsupported decorator location: "+i)};function _e(e){return(t,a)=>"object"==typeof a?ue(e,t,a):((e,t,a)=>{const i=t.hasOwnProperty(a);return t.constructor.createProperty(a,e),i?Object.getOwnPropertyDescriptor(t,a):void 0})(e,t,a)}function fe(e){return _e({...e,state:!0,attribute:!1})}const ge="2.6.1",he="melitta_barista",ve=["friendly_name","unit_of_measurement","state_class","icon"],be=["coffee","milk","water"],ye=["none",...be],ke=["very_mild","mild","medium","strong","very_strong"],we=["standard","intense"],xe=["cold","normal","high"],ze=["none","one","two","three"],$e={min:5,max:250,step:5},Se={min:0,max:250,step:5},Ae=["espresso","cafe_creme","cappuccino","latte_macchiato","milk","milk_froth","water"],je={espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Milk",milk_froth:"Milk Froth",water:"Hot Water"},Me={Espresso:"espresso","Cafe Creme":"cafe_creme","Café Crème":"cafe_creme",Cappuccino:"cappuccino","Latte Macchiato":"latte_macchiato",Milk:"milk","Milk Froth":"milk_froth","Hot Water":"water"},Pe={ready:"var(--state-active-color, #4caf50)",brewing:"var(--warning-color, #ff9800)",cleaning:"var(--info-color, #2196f3)",descaling:"var(--info-color, #2196f3)",off:"var(--disabled-color, #9e9e9e)",busy:"var(--warning-color, #ff9800)",unavailable:"var(--error-color, #f44336)",READY:"var(--state-active-color, #4caf50)",PRODUCT:"var(--warning-color, #ff9800)",CLEANING:"var(--info-color, #2196f3)",EASY_CLEAN:"var(--info-color, #2196f3)",INTENSIVE_CLEAN:"var(--info-color, #2196f3)",DESCALING:"var(--info-color, #2196f3)",FILTER_INSERT:"var(--info-color, #2196f3)",FILTER_REPLACE:"var(--info-color, #2196f3)",FILTER_REMOVE:"var(--info-color, #2196f3)",EVAPORATING:"var(--info-color, #2196f3)",SWITCH_OFF:"var(--disabled-color, #9e9e9e)",BUSY:"var(--warning-color, #ff9800)"},Ie=["energy_saving","auto_bean_select","rinsing_disabled"],Ce=["water_hardness","auto_off_after","brew_temperature"],Ee={energy_saving:{icon:"mdi:lightning-bolt"},auto_bean_select:{icon:"mdi:seed"},rinsing_disabled:{icon:"mdi:water-off"}},Ne={water_hardness:{icon:"mdi:water",format:"level"},auto_off_after:{icon:"mdi:timer-outline",format:"minutes"},brew_temperature:{icon:"mdi:thermometer",format:"level"}},Fe=[{key:"easy_clean",suffix:"easy_clean",icon:"mdi:broom",confirm:!0},{key:"intensive_clean",suffix:"intensive_clean",icon:"mdi:spray-bottle",confirm:!0},{key:"descaling",suffix:"descaling",icon:"mdi:water-alert",confirm:!0},{key:"evaporating",suffix:"evaporating",icon:"mdi:weather-fog",confirm:!0}],Te=[{key:"filter_insert",suffix:"filter_insert",icon:"mdi:filter-plus"},{key:"filter_replace",suffix:"filter_replace",icon:"mdi:filter"},{key:"filter_remove",suffix:"filter_remove",icon:"mdi:filter-remove"}],Re=[{key:"switch_off",suffix:"switch_off",icon:"mdi:power",confirm:!0}],Le={0:"none",1:"one",2:"two",3:"three"};function Be(e){return{process1:e.c1.process,intensity1:e.c1.intensity,aroma1:e.c1.aroma,portion1_ml:e.c1.portion_ml,temperature1:e.c1.temperature,shots1:e.c1.shots,process2:e.c2.process,intensity2:e.c2.intensity,aroma2:e.c2.aroma,portion2_ml:e.c2.portion_ml,temperature2:e.c2.temperature,shots2:e.c2.shots}}function Ve(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)}function De(e){return Array.isArray(e)&&0!==e.length&&e.every(e=>"string"==typeof e)?e:null}function Ke(e,t){if(!Ve(e))return t;const{min:a,max:i,step:r}=e;return"number"!=typeof a||"number"!=typeof i||"number"!=typeof r?t:{min:a,max:i,step:r}}function Oe(e){const t=e?.vocabularies?.freestyle,a=De(t?.process)??[...ye],i=a.includes("none")?["none",...a.filter(e=>"none"!==e)]:["none",...a];return{processes:a.filter(e=>"none"!==e).length>0?a.filter(e=>"none"!==e):[...be],processesWithNone:i,intensities:De(t?.intensity)??[...ke],aromas:De(t?.aroma)??[...we],temperatures:De(t?.temperature)??[...xe],shots:De(t?.shots)??[...ze],limits:{c1:Ke(e?.limits?.portion_ml?.c1,{...$e}),c2:Ke(e?.limits?.portion_ml?.c2,{...Se})}}}function He(e){const t=e.icon;return{found:!0,icon:Ve(t)?t:null}}var Ue={common:{brew:"Приготви",cancel:"Отказ",save:"Запази",confirm:"Потвърди",start:"Старт",loading:"Зареждане...",retry:"Опитай отново",default_name:"Melitta Barista"},card:{no_device:"Не е намерена кафемашина Melitta Barista.",no_device_hint:"Уверете се, че интеграцията е инсталирана и конфигурирана.",machine_offline:"Машината е офлайн"},state:{ready:"Готова",brewing:"Приготвяне",cleaning:"Почистване",descaling:"Декалциране",off:"Изключена",busy:"Заета",filter_insert:"Поставяне на филтър",filter_replace:"Смяна на филтър",filter_remove:"Премахване на филтър",evaporating:"Изпаряване",idle:"В покой",unavailable:"Недостъпна",unknown:"Неизвестно"},activity:{grinding:"Мелене",coffee:"Кафе",steam:"Пара",water:"Вода",prepare:"Подготовка"},action:{none:"Няма",bu_removed:"Постави блока за запарване",trays_missing:"Постави тавичките",empty_trays:"Изпразни тавичките",fill_water:"Напълни резервоара с вода",close_powder_lid:"Затвори капака за мляно кафе",fill_powder:"Добави мляно кафе",move_cup_to_frother:"Премести чашата до дюзата за мляко",flush_required:"Необходимо е изплакване"},drinks:{espresso:"Еспресо",cafe_creme:"Кафе крем",cappuccino:"Капучино",latte_macchiato:"Лате макиато",milk:"Мляко",milk_froth:"Млечна пяна",water:"Гореща вода"},values:{very_mild:"Мн.слабо",mild:"Слабо",medium:"Средно",strong:"Силно",very_strong:"Мн.силно",extra_strong:"Екстра",cold:"Студена",normal:"Норм.",high:"Висока",none:"Няма",one:"1",two:"2",three:"3",coffee:"Кафе",milk:"Мляко",water:"Вода",standard:"Стд",intense:"Инт+"},directkey:{brew_drink:"Приготви: {drink}",two_cups:"2x",two_cups_on:"2x ВКЛ"},recipes:{title:"Рецепта",all_recipes:"Всички рецепти"},freestyle:{title:"Freestyle",drink_name_placeholder:"Име на напитката",component:"Компонент {n}",process:"Процес",portion:"Порция",intensity:"Сила",aroma:"Аромат",temp:"Темп.",temperature:"Температура",shots:"Шотове",portion_value:"{value} мл",brew_named:"Приготви {name}"},sommelier:{title:"AI Sommelier",unavailable:"Сомелиерът не е наличен.",generating:"Генериране...",surprise_me:"Изненадай ме",error_generate:"Сомелиер: генерирането на рецепта се провали",error_brew:"Сомелиер: приготвянето не можа да стартира",reasoning:"Защо тази рецепта?",wizard_title:"Приготвяне стъпка по стъпка",step_of:"Стъпка {n} от {total}",done:"Готово",brew_phase:"Приготви фаза {n}/{total}",phase_running:"Фазата е стартирана — изчакайте машината да приключи и продължете",finish:"Завърши",cancel:"Отказ",info:"Детайли за рецептата",steps:"Стъпки",err:{no_llm_agent:"В Home Assistant не е инсталиран AI агент — добавете LLM интеграция, за да използвате сомелиера",no_llm_agent_selected:"Не е избран AI агент — изберете го в панела на сомелиера, раздел System",llm_agent_missing:"Избраният AI агент липсва — изберете друг в панела на сомелиера, раздел System"}},stats:{title:"Статистика",total_cups:"Общо чаши",unavailable:"Статистиката за чашите не е налична.",empty:"Все още няма приготвени чаши"},maintenance:{title:"Поддръжка",groups:{cleaning:"Почистване и декалциране",filter:"Воден филтър",other:"Друго"},actions:{easy_clean:{label:"Бързо почистване",desc:"Бързо изплакване на заварочния блок"},intensive_clean:{label:"Интензивно почистване",desc:"Дълбоко почистване с таблетка"},descaling:{label:"Декалциране",desc:"Премахване на котлен камък"},evaporating:{label:"Изпаряване",desc:"Продухване на парната система"},filter_insert:{label:"Постави филтър",desc:"Започнете да използвате нов воден филтър"},filter_replace:{label:"Смени филтър",desc:"Сменете текущия воден филтър"},filter_remove:{label:"Премахни филтър",desc:"Спрете да използвате водния филтър"},switch_off:{label:"Изключи",desc:"Изключете машината"}}},settings:{title:"Настройки",switches:{energy_saving:{label:"Енергоспестяване",desc:"Намалена мощност в покой"},auto_bean_select:{label:"Автоматичен избор на зърна",desc:"Автоматичен избор на бункер за зърна"},rinsing_disabled:{label:"Изплакването изключено",desc:"Пропускане на автоматичното изплакване"}},numbers:{water_hardness:{label:"Твърдост на водата",desc:"Калибриране според типа вода"},auto_off_after:{label:"Автоизключване",desc:"Минути до изключване"},brew_temperature:{label:"Температура на приготвяне",desc:"Температура на водата при приготвяне"}},levels:{water_hardness:{1:"Мека",2:"Средна",3:"Твърда",4:"Много твърда"},brew_temperature:{0:"Ниска",1:"Норм.",2:"Висока"}},minutes:"{value} мин"},edit_dialog:{title:"Редактиране: {drink}"},editor:{device:"Устройство",enter_manually:"Въведете ръчно...",entity_prefix:"Префикс на обектите",entity_prefix_placeholder:"Открива се автоматично, ако интеграцията работи",no_devices_hint:"Не са открити устройства Melitta. Въведете префикса ръчно или проверете дали интеграцията е конфигурирана.",name:"Име",show_header:"Показване на заглавка",show_status:"Показване на статус",show_profiles:"Показване на избор на профил",show_recipes:"Показване на избор на рецепта",show_freestyle:"Показване на Freestyle",show_sommelier:"Показване на AI Sommelier",show_stats:"Показване на статистика за чашите",show_maintenance:"Показване на поддръжка",show_settings:"Показване на настройки",compact:"Компактен режим"}},qe={common:{brew:"Pripremi",cancel:"Otkaži",save:"Sačuvaj",confirm:"Potvrdi",start:"Start",loading:"Učitavanje...",retry:"Pokušaj ponovo",default_name:"Melitta Barista"},card:{no_device:"Uređaj Melitta Barista nije pronađen.",no_device_hint:"Provjerite da li je integracija instalirana i konfigurisana.",machine_offline:"Aparat van mreže"},state:{ready:"Spreman",brewing:"Priprema",cleaning:"Čišćenje",descaling:"Uklanjanje kamenca",off:"Isključen",busy:"Zauzet",filter_insert:"Umetanje filtera",filter_replace:"Zamjena filtera",filter_remove:"Uklanjanje filtera",evaporating:"Isparavanje",idle:"Neaktivan",unavailable:"Nedostupan",unknown:"Nepoznato"},activity:{grinding:"Mljevenje",coffee:"Kafa",steam:"Para",water:"Voda",prepare:"Priprema"},action:{none:"Nema",bu_removed:"Umetni jedinicu za kuhanje",trays_missing:"Umetni posude",empty_trays:"Isprazni posude",fill_water:"Napuni spremnik vodom",close_powder_lid:"Zatvori poklopac za mljevenu kafu",fill_powder:"Dodaj mljevenu kafu",move_cup_to_frother:"Pomjeri šolju do mliječne mlaznice",flush_required:"Potrebno ispiranje"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mlijeko",milk_froth:"Mliječna pjena",water:"Vruća voda"},values:{very_mild:"V. blaga",mild:"Blaga",medium:"Srednja",strong:"Jaka",very_strong:"V. jaka",extra_strong:"Ekstra",cold:"Hladno",normal:"Normalno",high:"Visoko",none:"Bez",one:"1",two:"2",three:"3",coffee:"Kafa",milk:"Mlijeko",water:"Voda",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Pripremi {drink}",two_cups:"2x",two_cups_on:"2x UKLJ."},recipes:{title:"Recept",all_recipes:"Svi recepti"},freestyle:{title:"Freestyle",drink_name_placeholder:"Naziv napitka",component:"Komponenta {n}",process:"Proces",portion:"Porcija",intensity:"Jačina",aroma:"Aroma",temp:"Temp.",temperature:"Temperatura",shots:"Šotovi",portion_value:"{value} ml",brew_named:"Pripremi {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier nije dostupan.",generating:"Generisanje...",surprise_me:"Iznenadi me",error_generate:"Sommelier: generisanje recepta nije uspjelo",error_brew:"Sommelier: priprema nije uspjela",reasoning:"Zašto ovaj recept?",wizard_title:"Priprema korak po korak",step_of:"Korak {n} od {total}",done:"Gotovo",brew_phase:"Pripremi fazu {n}/{total}",phase_running:"Faza je pokrenuta — sačekajte da mašina završi, zatim nastavite",finish:"Završi",cancel:"Otkaži",info:"Detalji recepta",steps:"Koraci",err:{no_llm_agent:"U Home Assistantu nije instaliran AI agent — dodajte LLM integraciju da biste koristili Sommeliera",no_llm_agent_selected:"Nijedan AI agent nije odabran — odaberite ga na Sommelier panelu, kartica System",llm_agent_missing:"Odabrani AI agent više ne postoji — odaberite drugi na Sommelier panelu, kartica System"}},stats:{title:"Statistika",total_cups:"Ukupno šoljica",unavailable:"Statistika šoljica nije dostupna.",empty:"Još nema pripremljenih šoljica"},maintenance:{title:"Održavanje",groups:{cleaning:"Čišćenje i uklanjanje kamenca",filter:"Filter za vodu",other:"Ostalo"},actions:{easy_clean:{label:"Brzo čišćenje",desc:"Brzo ispiranje jedinice za kuhanje"},intensive_clean:{label:"Intenzivno čišćenje",desc:"Dubinsko čišćenje s tabletom"},descaling:{label:"Uklanjanje kamenca",desc:"Uklanjanje naslaga kamenca"},evaporating:{label:"Isparavanje",desc:"Pročišćavanje parnog sistema"},filter_insert:{label:"Umetni filter",desc:"Počni koristiti novi filter za vodu"},filter_replace:{label:"Zamijeni filter",desc:"Zamijeni trenutni filter za vodu"},filter_remove:{label:"Ukloni filter",desc:"Prestani koristiti filter za vodu"},switch_off:{label:"Isključi",desc:"Isključi aparat"}}},settings:{title:"Postavke",switches:{energy_saving:{label:"Ušteda energije",desc:"Smanjena potrošnja u mirovanju"},auto_bean_select:{label:"Automatski odabir zrna",desc:"Automatski odabir spremnika zrna"},rinsing_disabled:{label:"Ispiranje isključeno",desc:"Preskoči automatsko ispiranje"}},numbers:{water_hardness:{label:"Tvrdoća vode",desc:"Kalibracija prema tipu vode"},auto_off_after:{label:"Automatsko isključenje",desc:"Minute do isključenja"},brew_temperature:{label:"Temperatura pripreme",desc:"Temperatura vode za pripremu"}},levels:{water_hardness:{1:"Meka",2:"Srednja",3:"Tvrda",4:"Vrlo tvrda"},brew_temperature:{0:"Niska",1:"Normalna",2:"Visoka"}},minutes:"{value} min"},edit_dialog:{title:"Uredi: {drink}"},editor:{device:"Uređaj",enter_manually:"Unesi ručno...",entity_prefix:"Prefiks entiteta",entity_prefix_placeholder:"Automatski se otkriva ako je integracija pokrenuta",no_devices_hint:"Nije pronađen nijedan Melitta uređaj. Unesite prefiks ručno ili provjerite da li je integracija konfigurisana.",name:"Naziv",show_header:"Prikaži zaglavlje",show_status:"Prikaži status",show_profiles:"Prikaži odabir profila",show_recipes:"Prikaži odabir recepta",show_freestyle:"Prikaži Freestyle recept",show_sommelier:"Prikaži AI Sommelier",show_stats:"Prikaži statistiku šoljica",show_maintenance:"Prikaži održavanje",show_settings:"Prikaži postavke",compact:"Kompaktni način"}},Ze={common:{brew:"Připravit",cancel:"Zrušit",save:"Uložit",confirm:"Potvrdit",start:"Start",loading:"Načítání...",retry:"Zkusit znovu",default_name:"Melitta Barista"},card:{no_device:"Kávovar Melitta Barista nebyl nalezen.",no_device_hint:"Ujistěte se, že je integrace nainstalována a nakonfigurována.",machine_offline:"Kávovar offline"},state:{ready:"Připraven",brewing:"Příprava",cleaning:"Čištění",descaling:"Odvápnění",off:"Vypnuto",busy:"Zaneprázdněn",filter_insert:"Vkládání filtru",filter_replace:"Výměna filtru",filter_remove:"Odebírání filtru",evaporating:"Odpařování",idle:"Nečinný",unavailable:"Nedostupný",unknown:"Neznámý"},activity:{grinding:"Mletí",coffee:"Káva",steam:"Pára",water:"Voda",prepare:"Příprava"},action:{none:"Žádné",bu_removed:"Vlož spařovací jednotku",trays_missing:"Vlož misky",empty_trays:"Vyprázdni misky",fill_water:"Doplň vodu do nádržky",close_powder_lid:"Zavři víko na mletou kávu",fill_powder:"Doplň mletou kávu",move_cup_to_frother:"Přesuň šálek k napěňovači",flush_required:"Nutné propláchnutí"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mléko",milk_froth:"Mléčná pěna",water:"Horká voda"},values:{very_mild:"V.jemná",mild:"Jemná",medium:"Střední",strong:"Silná",very_strong:"V.silná",extra_strong:"Extra",cold:"Studená",normal:"Norm.",high:"Vysoká",none:"Žádná",one:"1",two:"2",three:"3",coffee:"Káva",milk:"Mléko",water:"Voda",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Připravit: {drink}",two_cups:"2x",two_cups_on:"2x ZAP"},recipes:{title:"Recept",all_recipes:"Všechny recepty"},freestyle:{title:"Freestyle",drink_name_placeholder:"Název nápoje",component:"Složka {n}",process:"Proces",portion:"Porce",intensity:"Síla",aroma:"Aroma",temp:"Tepl.",temperature:"Teplota",shots:"Shoty",portion_value:"{value} ml",brew_named:"Připravit {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier není dostupný.",generating:"Generování...",surprise_me:"Překvap mě",error_generate:"Sommelier: generování receptu se nezdařilo",error_brew:"Sommelier: přípravu se nepodařilo spustit",reasoning:"Proč tento recept?",wizard_title:"Příprava krok za krokem",step_of:"Krok {n} z {total}",done:"Hotovo",brew_phase:"Připravit fázi {n}/{total}",phase_running:"Fáze spuštěna — nechte kávovar dokončit práci a pak pokračujte",finish:"Dokončit",cancel:"Zrušit",info:"Podrobnosti receptu",steps:"Kroky",err:{no_llm_agent:"V Home Assistantu není nainstalován žádný AI agent — přidejte LLM integraci, abyste mohli sommeliera používat",no_llm_agent_selected:"Není vybrán žádný AI agent — vyberte ho v panelu sommeliera na kartě System",llm_agent_missing:"Vybraný AI agent už neexistuje — vyberte jiného v panelu sommeliera na kartě System"}},stats:{title:"Statistiky",total_cups:"Celkem šálků",unavailable:"Statistiky šálků nejsou dostupné.",empty:"Zatím žádné připravené šálky"},maintenance:{title:"Údržba",groups:{cleaning:"Čištění a odvápnění",filter:"Vodní filtr",other:"Ostatní"},actions:{easy_clean:{label:"Rychlé čištění",desc:"Rychlé propláchnutí spařovací jednotky"},intensive_clean:{label:"Intenzivní čištění",desc:"Hloubkové čištění s tabletou"},descaling:{label:"Odvápnění",desc:"Odstranění vodního kamene"},evaporating:{label:"Odpařování",desc:"Profouknutí parního systému"},filter_insert:{label:"Vložit filtr",desc:"Začít používat nový vodní filtr"},filter_replace:{label:"Vyměnit filtr",desc:"Vyměnit stávající vodní filtr"},filter_remove:{label:"Odebrat filtr",desc:"Přestat používat vodní filtr"},switch_off:{label:"Vypnout",desc:"Vypnout kávovar"}}},settings:{title:"Nastavení",switches:{energy_saving:{label:"Úspora energie",desc:"Snížit spotřebu v nečinnosti"},auto_bean_select:{label:"Automatický výběr zrn",desc:"Automatická volba zásobníku zrn"},rinsing_disabled:{label:"Oplach vypnut",desc:"Přeskočit automatický oplach"}},numbers:{water_hardness:{label:"Tvrdost vody",desc:"Kalibrace podle typu vody"},auto_off_after:{label:"Automatické vypnutí",desc:"Minut do vypnutí"},brew_temperature:{label:"Teplota přípravy",desc:"Teplota vody při přípravě"}},levels:{water_hardness:{1:"Měkká",2:"Střední",3:"Tvrdá",4:"Velmi tvrdá"},brew_temperature:{0:"Nízká",1:"Normální",2:"Vysoká"}},minutes:"{value} min"},edit_dialog:{title:"Upravit: {drink}"},editor:{device:"Zařízení",enter_manually:"Zadat ručně...",entity_prefix:"Prefix entit",entity_prefix_placeholder:"Zjištěn automaticky, pokud integrace běží",no_devices_hint:"Nebyla nalezena žádná zařízení Melitta. Zadejte prefix ručně nebo zkontrolujte, zda je integrace nakonfigurována.",name:"Název",show_header:"Zobrazit záhlaví",show_status:"Zobrazit stav",show_profiles:"Zobrazit výběr profilu",show_recipes:"Zobrazit výběr receptu",show_freestyle:"Zobrazit Freestyle",show_sommelier:"Zobrazit AI Sommelier",show_stats:"Zobrazit statistiky šálků",show_maintenance:"Zobrazit údržbu",show_settings:"Zobrazit nastavení",compact:"Kompaktní režim"}},We={common:{brew:"Bryg",cancel:"Annuller",save:"Gem",confirm:"Bekræft",start:"Start",loading:"Indlæser...",retry:"Prøv igen",default_name:"Melitta Barista"},card:{no_device:"Ingen Melitta Barista-enhed fundet.",no_device_hint:"Kontrollér, at integrationen er installeret og konfigureret.",machine_offline:"Maskinen er offline"},state:{ready:"Klar",brewing:"Brygning",cleaning:"Rengøring",descaling:"Afkalkning",off:"Slukket",busy:"Optaget",filter_insert:"Indsætter filter",filter_replace:"Udskifter filter",filter_remove:"Fjerner filter",evaporating:"Fordampning",idle:"Inaktiv",unavailable:"Utilgængelig",unknown:"Ukendt"},activity:{grinding:"Maler",coffee:"Kaffe",steam:"Damp",water:"Vand",prepare:"Forbereder"},action:{none:"Ingen",bu_removed:"Isæt bryggeenheden",trays_missing:"Isæt bakkerne",empty_trays:"Tøm bakkerne",fill_water:"Fyld vandtanken",close_powder_lid:"Luk låget til malet kaffe",fill_powder:"Påfyld malet kaffe",move_cup_to_frother:"Flyt koppen til mælkeskummeren",flush_required:"Skylning påkrævet"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mælk",milk_froth:"Mælkeskum",water:"Varmt vand"},values:{very_mild:"M.Mild",mild:"Mild",medium:"Med",strong:"Stærk",very_strong:"M.Stærk",extra_strong:"X.Stærk",cold:"Kold",normal:"Normal",high:"Høj",none:"Ingen",one:"1",two:"2",three:"3",coffee:"Kaffe",milk:"Mælk",water:"Vand",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Bryg {drink}",two_cups:"2x",two_cups_on:"2x TIL"},recipes:{title:"Opskrift",all_recipes:"Alle opskrifter"},freestyle:{title:"Freestyle",drink_name_placeholder:"Drikkens navn",component:"Komponent {n}",process:"Proces",portion:"Portion",intensity:"Intensitet",aroma:"Aroma",temp:"Temp",temperature:"Temperatur",shots:"Shots",portion_value:"{value} ml",brew_named:"Bryg {name}"},sommelier:{title:"AI-sommelier",unavailable:"Sommelier er ikke tilgængelig.",generating:"Genererer...",surprise_me:"Overrask mig",error_generate:"Sommelier: opskriftsgenerering mislykkedes",error_brew:"Sommelier: brygning mislykkedes",reasoning:"Hvorfor denne opskrift?",wizard_title:"Trin-for-trin brygning",step_of:"Trin {n} af {total}",done:"Færdig",brew_phase:"Bryg fase {n}/{total}",phase_running:"Fasen er startet — lad maskinen blive færdig, og fortsæt derefter",finish:"Afslut",cancel:"Annuller",info:"Opskriftsdetaljer",steps:"Trin",err:{no_llm_agent:"Der er ingen AI-agent installeret i Home Assistant — tilføj en LLM-integration for at bruge sommelieren",no_llm_agent_selected:"Der er ikke valgt en AI-agent — vælg en i sommelier-panelet under fanen System",llm_agent_missing:"Den valgte AI-agent findes ikke længere — vælg en anden i sommelier-panelet under fanen System"}},stats:{title:"Statistik",total_cups:"Kopper i alt",unavailable:"Kopstatistik er ikke tilgængelig.",empty:"Ingen kopper brygget endnu"},maintenance:{title:"Vedligeholdelse",groups:{cleaning:"Rengøring & afkalkning",filter:"Vandfilter",other:"Andet"},actions:{easy_clean:{label:"Hurtig rengøring",desc:"Hurtig skylning af bryggeenheden"},intensive_clean:{label:"Intensiv rengøring",desc:"Grundig rengøring med tablet"},descaling:{label:"Afkalkning",desc:"Fjern kalkaflejringer"},evaporating:{label:"Fordampning",desc:"Tøm dampsystemet"},filter_insert:{label:"Indsæt filter",desc:"Begynd at bruge et nyt vandfilter"},filter_replace:{label:"Udskift filter",desc:"Udskift det nuværende vandfilter"},filter_remove:{label:"Fjern filter",desc:"Stop med at bruge vandfilteret"},switch_off:{label:"Sluk",desc:"Sluk maskinen"}}},settings:{title:"Indstillinger",switches:{energy_saving:{label:"Energibesparelse",desc:"Reducer effekten ved inaktivitet"},auto_bean_select:{label:"Auto bønnevalg",desc:"Vælg bønnebeholder automatisk"},rinsing_disabled:{label:"Skylning deaktiveret",desc:"Spring automatisk skylning over"}},numbers:{water_hardness:{label:"Vandhårdhed",desc:"Kalibrér til vandtypen"},auto_off_after:{label:"Auto sluk",desc:"Minutter til slukning"},brew_temperature:{label:"Bryggetemperatur",desc:"Bryggevandets temperatur"}},levels:{water_hardness:{1:"Blødt",2:"Middel",3:"Hårdt",4:"Meget hårdt"},brew_temperature:{0:"Lav",1:"Normal",2:"Høj"}},minutes:"{value} min"},edit_dialog:{title:"Rediger: {drink}"},editor:{device:"Enhed",enter_manually:"Indtast manuelt...",entity_prefix:"Entitetspræfiks",entity_prefix_placeholder:"Registreres automatisk, hvis integrationen kører",no_devices_hint:"Ingen Melitta-enheder fundet. Indtast præfikset manuelt, eller kontrollér, at integrationen er konfigureret.",name:"Navn",show_header:"Vis overskrift",show_status:"Vis status",show_profiles:"Vis profilvælger",show_recipes:"Vis opskriftsvælger",show_freestyle:"Vis Freestyle-opskrift",show_sommelier:"Vis AI-sommelier",show_stats:"Vis kopstatistik",show_maintenance:"Vis vedligeholdelse",show_settings:"Vis indstillinger",compact:"Kompakt tilstand"}},Ge={common:{brew:"Brühen",cancel:"Abbrechen",save:"Speichern",confirm:"Bestätigen",start:"Start",loading:"Laden...",retry:"Erneut versuchen",default_name:"Melitta Barista"},card:{no_device:"Keine Melitta Barista gefunden.",no_device_hint:"Stellen Sie sicher, dass die Integration installiert und konfiguriert ist.",machine_offline:"Maschine offline"},state:{ready:"Bereit",brewing:"Brüht",cleaning:"Reinigung",descaling:"Entkalkung",off:"Aus",busy:"Beschäftigt",filter_insert:"Filter wird eingesetzt",filter_replace:"Filter wird gewechselt",filter_remove:"Filter wird entfernt",evaporating:"Ausdampfen",idle:"Leerlauf",unavailable:"Nicht verfügbar",unknown:"Unbekannt"},activity:{grinding:"Mahlen",coffee:"Kaffee",steam:"Dampf",water:"Wasser",prepare:"Vorbereitung"},action:{none:"Keine",bu_removed:"Brüheinheit einsetzen",trays_missing:"Schalen einsetzen",empty_trays:"Schalen leeren",fill_water:"Wassertank füllen",close_powder_lid:"Pulverdeckel schließen",fill_powder:"Pulverkaffee einfüllen",move_cup_to_frother:"Tasse zum Milchschäumer stellen",flush_required:"Spülung erforderlich"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Milch",milk_froth:"Milchschaum",water:"Heißwasser"},values:{very_mild:"S.Mild",mild:"Mild",medium:"Mittel",strong:"Stark",very_strong:"S.Stark",extra_strong:"X.Stark",cold:"Kalt",normal:"Normal",high:"Hoch",none:"Ohne",one:"1",two:"2",three:"3",coffee:"Kaffee",milk:"Milch",water:"Wasser",standard:"Std",intense:"Int+"},directkey:{brew_drink:"{drink} brühen",two_cups:"2x",two_cups_on:"2x AN"},recipes:{title:"Rezept",all_recipes:"Alle Rezepte"},freestyle:{title:"Freestyle",drink_name_placeholder:"Getränkename",component:"Komponente {n}",process:"Prozess",portion:"Menge",intensity:"Intensität",aroma:"Aroma",temp:"Temp.",temperature:"Temperatur",shots:"Shots",portion_value:"{value} ml",brew_named:"{name} brühen"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier ist nicht verfügbar.",generating:"Generiere...",surprise_me:"Überrasch mich",error_generate:"Sommelier: Rezept-Generierung fehlgeschlagen",error_brew:"Sommelier: Brühen fehlgeschlagen",reasoning:"Warum dieses Rezept?",wizard_title:"Schritt-für-Schritt-Zubereitung",step_of:"Schritt {n} von {total}",done:"Fertig",brew_phase:"Phase {n}/{total} brühen",phase_running:"Phase gestartet — lass die Maschine zu Ende arbeiten und fahre dann fort",finish:"Abschließen",cancel:"Abbrechen",info:"Rezeptdetails",steps:"Schritte",err:{no_llm_agent:"In Home Assistant ist kein AI-Agent installiert — füge eine LLM-Integration hinzu, um den Sommelier zu nutzen",no_llm_agent_selected:"Kein AI-Agent ausgewählt — wähle einen im Sommelier-Panel, Tab System",llm_agent_missing:"Der ausgewählte AI-Agent existiert nicht mehr — wähle einen anderen im Sommelier-Panel, Tab System"}},stats:{title:"Statistik",total_cups:"Tassen gesamt",unavailable:"Tassenstatistik nicht verfügbar.",empty:"Noch keine Tassen gebrüht"},maintenance:{title:"Wartung",groups:{cleaning:"Reinigung & Entkalkung",filter:"Wasserfilter",other:"Sonstiges"},actions:{easy_clean:{label:"Easy Clean",desc:"Schnellspülung der Brüheinheit"},intensive_clean:{label:"Intensivreinigung",desc:"Gründliche Reinigung mit Tab"},descaling:{label:"Entkalkung",desc:"Kalkablagerungen entfernen"},evaporating:{label:"Ausdampfen",desc:"Dampfsystem entleeren"},filter_insert:{label:"Filter einsetzen",desc:"Neuen Wasserfilter aktivieren"},filter_replace:{label:"Filter wechseln",desc:"Aktuellen Wasserfilter ersetzen"},filter_remove:{label:"Filter entfernen",desc:"Wasserfilter nicht mehr verwenden"},switch_off:{label:"Ausschalten",desc:"Maschine ausschalten"}}},settings:{title:"Einstellungen",switches:{energy_saving:{label:"Energiesparen",desc:"Weniger Strom im Leerlauf"},auto_bean_select:{label:"Auto-Bohnenwahl",desc:"Bohnenbehälter automatisch wählen"},rinsing_disabled:{label:"Spülung deaktiviert",desc:"Automatische Spülung überspringen"}},numbers:{water_hardness:{label:"Wasserhärte",desc:"An den Wassertyp anpassen"},auto_off_after:{label:"Auto-Aus",desc:"Minuten bis zum Ausschalten"},brew_temperature:{label:"Brühtemperatur",desc:"Temperatur des Brühwassers"}},levels:{water_hardness:{1:"Weich",2:"Mittel",3:"Hart",4:"Sehr hart"},brew_temperature:{0:"Niedrig",1:"Normal",2:"Hoch"}},minutes:"{value} Min."},edit_dialog:{title:"Bearbeiten: {drink}"},editor:{device:"Gerät",enter_manually:"Manuell eingeben...",entity_prefix:"Entity-Präfix",entity_prefix_placeholder:"Wird automatisch erkannt, wenn die Integration läuft",no_devices_hint:"Keine Melitta-Geräte gefunden. Präfix manuell eingeben oder Integration prüfen.",name:"Name",show_header:"Kopfzeile anzeigen",show_status:"Status anzeigen",show_profiles:"Profilauswahl anzeigen",show_recipes:"Rezeptauswahl anzeigen",show_freestyle:"Freestyle anzeigen",show_sommelier:"AI Sommelier anzeigen",show_stats:"Tassenstatistik anzeigen",show_maintenance:"Wartung anzeigen",show_settings:"Einstellungen anzeigen",compact:"Kompaktmodus"}},Ye={common:{brew:"Παρασκευή",cancel:"Ακύρωση",save:"Αποθήκευση",confirm:"Επιβεβαίωση",start:"Έναρξη",loading:"Φόρτωση...",retry:"Επανάληψη",default_name:"Melitta Barista"},card:{no_device:"Δεν βρέθηκε συσκευή Melitta Barista.",no_device_hint:"Βεβαιωθείτε ότι η ενσωμάτωση είναι εγκατεστημένη και ρυθμισμένη.",machine_offline:"Μηχανή εκτός σύνδεσης"},state:{ready:"Έτοιμο",brewing:"Παρασκευή",cleaning:"Καθαρισμός",descaling:"Αφαλάτωση",off:"Σβηστό",busy:"Απασχολημένο",filter_insert:"Τοποθέτηση φίλτρου",filter_replace:"Αντικατάσταση φίλτρου",filter_remove:"Αφαίρεση φίλτρου",evaporating:"Εξάτμιση",idle:"Αδρανές",unavailable:"Μη διαθέσιμο",unknown:"Άγνωστο"},activity:{grinding:"Άλεση",coffee:"Καφές",steam:"Ατμός",water:"Νερό",prepare:"Προετοιμασία"},action:{none:"Καμία",bu_removed:"Τοποθετήστε τη μονάδα εκχύλισης",trays_missing:"Τοποθετήστε τους δίσκους",empty_trays:"Αδειάστε τους δίσκους",fill_water:"Γεμίστε το δοχείο νερού",close_powder_lid:"Κλείστε το καπάκι αλεσμένου καφέ",fill_powder:"Προσθέστε αλεσμένο καφέ",move_cup_to_frother:"Μετακινήστε το φλιτζάνι στο ακροφύσιο γάλακτος",flush_required:"Απαιτείται έκπλυση"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Γάλα",milk_froth:"Αφρόγαλα",water:"Ζεστό νερό"},values:{very_mild:"Π.Ήπιος",mild:"Ήπιος",medium:"Μέτριος",strong:"Δυνατός",very_strong:"Π.Δυνατ.",extra_strong:"X.Δυνατ.",cold:"Κρύο",normal:"Κανονικό",high:"Υψηλό",none:"Χωρίς",one:"1",two:"2",three:"3",coffee:"Καφές",milk:"Γάλα",water:"Νερό",standard:"Στάνταρ",intense:"Έντονο+"},directkey:{brew_drink:"Παρασκευή {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Συνταγή",all_recipes:"Όλες οι συνταγές"},freestyle:{title:"Freestyle",drink_name_placeholder:"Όνομα ροφήματος",component:"Συστατικό {n}",process:"Διαδικασία",portion:"Ποσότητα",intensity:"Ένταση",aroma:"Άρωμα",temp:"Θερμ.",temperature:"Θερμοκρασία",shots:"Δόσεις",portion_value:"{value} ml",brew_named:"Παρασκευή {name}"},sommelier:{title:"AI Sommelier",unavailable:"Ο Sommelier δεν είναι διαθέσιμος.",generating:"Δημιουργία...",surprise_me:"Εξέπληξέ με",error_generate:"Sommelier: αποτυχία δημιουργίας συνταγής",error_brew:"Sommelier: αποτυχία παρασκευής",reasoning:"Γιατί αυτή η συνταγή;",wizard_title:"Παρασκευή βήμα προς βήμα",step_of:"Βήμα {n} από {total}",done:"Έγινε",brew_phase:"Παρασκευή φάσης {n}/{total}",phase_running:"Η φάση ξεκίνησε — αφήστε τη μηχανή να ολοκληρώσει και μετά συνεχίστε",finish:"Ολοκλήρωση",cancel:"Άκυρο",info:"Λεπτομέρειες συνταγής",steps:"Βήματα",err:{no_llm_agent:"Δεν υπάρχει εγκατεστημένος AI agent στο Home Assistant — προσθέστε μια ενσωμάτωση LLM για να χρησιμοποιήσετε τον Sommelier",no_llm_agent_selected:"Δεν έχει επιλεγεί AI agent — επιλέξτε έναν στον πίνακα Sommelier, καρτέλα System",llm_agent_missing:"Ο επιλεγμένος AI agent δεν υπάρχει πια — επιλέξτε άλλον στον πίνακα Sommelier, καρτέλα System"}},stats:{title:"Στατιστικά",total_cups:"Σύνολο φλιτζανιών",unavailable:"Τα στατιστικά φλιτζανιών δεν είναι διαθέσιμα.",empty:"Δεν έχουν παρασκευαστεί φλιτζάνια ακόμα"},maintenance:{title:"Συντήρηση",groups:{cleaning:"Καθαρισμός & Αφαλάτωση",filter:"Φίλτρο νερού",other:"Άλλα"},actions:{easy_clean:{label:"Γρήγορος καθαρισμός",desc:"Γρήγορο ξέπλυμα της μονάδας παρασκευής"},intensive_clean:{label:"Εντατικός καθαρισμός",desc:"Βαθύς καθαρισμός με ταμπλέτα"},descaling:{label:"Αφαλάτωση",desc:"Αφαίρεση συσσωρευμένων αλάτων"},evaporating:{label:"Εξάτμιση",desc:"Εκκένωση του συστήματος ατμού"},filter_insert:{label:"Τοποθέτηση φίλτρου",desc:"Έναρξη χρήσης νέου φίλτρου νερού"},filter_replace:{label:"Αντικατάσταση φίλτρου",desc:"Αντικατάσταση του τρέχοντος φίλτρου νερού"},filter_remove:{label:"Αφαίρεση φίλτρου",desc:"Διακοπή χρήσης του φίλτρου νερού"},switch_off:{label:"Απενεργοποίηση",desc:"Απενεργοποίηση της μηχανής"}}},settings:{title:"Ρυθμίσεις",switches:{energy_saving:{label:"Εξοικονόμηση ενέργειας",desc:"Μειωμένη κατανάλωση σε αδράνεια"},auto_bean_select:{label:"Αυτόματη επιλογή κόκκων",desc:"Αυτόματη επιλογή δοχείου κόκκων"},rinsing_disabled:{label:"Ξέπλυμα απενεργοποιημένο",desc:"Παράλειψη αυτόματου ξεπλύματος"}},numbers:{water_hardness:{label:"Σκληρότητα νερού",desc:"Βαθμονόμηση για τον τύπο νερού"},auto_off_after:{label:"Αυτόματη απενεργοποίηση",desc:"Λεπτά έως την απενεργοποίηση"},brew_temperature:{label:"Θερμοκρασία παρασκευής",desc:"Θερμοκρασία νερού παρασκευής"}},levels:{water_hardness:{1:"Μαλακό",2:"Μέτριο",3:"Σκληρό",4:"Πολύ σκληρό"},brew_temperature:{0:"Χαμηλή",1:"Κανονική",2:"Υψηλή"}},minutes:"{value} λεπ."},edit_dialog:{title:"Επεξεργασία: {drink}"},editor:{device:"Συσκευή",enter_manually:"Χειροκίνητη εισαγωγή...",entity_prefix:"Πρόθεμα οντότητας",entity_prefix_placeholder:"Αυτόματος εντοπισμός εάν η ενσωμάτωση εκτελείται",no_devices_hint:"Δεν εντοπίστηκαν συσκευές Melitta. Εισαγάγετε το πρόθεμα χειροκίνητα ή ελέγξτε ότι η ενσωμάτωση είναι ρυθμισμένη.",name:"Όνομα",show_header:"Εμφάνιση κεφαλίδας",show_status:"Εμφάνιση κατάστασης",show_profiles:"Εμφάνιση επιλογής προφίλ",show_recipes:"Εμφάνιση επιλογής συνταγών",show_freestyle:"Εμφάνιση συνταγής Freestyle",show_sommelier:"Εμφάνιση AI Sommelier",show_stats:"Εμφάνιση στατιστικών φλιτζανιών",show_maintenance:"Εμφάνιση συντήρησης",show_settings:"Εμφάνιση ρυθμίσεων",compact:"Συμπαγής λειτουργία"}},Xe={common:{brew:"Brew",cancel:"Cancel",save:"Save",confirm:"Confirm",start:"Start",loading:"Loading...",retry:"Retry",default_name:"Melitta Barista"},card:{no_device:"No Melitta Barista device found.",no_device_hint:"Make sure the integration is installed and configured.",machine_offline:"Machine offline"},state:{ready:"Ready",brewing:"Brewing",cleaning:"Cleaning",descaling:"Descaling",off:"Off",busy:"Busy",filter_insert:"Inserting Filter",filter_replace:"Replacing Filter",filter_remove:"Removing Filter",evaporating:"Evaporating",idle:"Idle",unavailable:"Unavailable",unknown:"Unknown"},activity:{grinding:"Grinding",coffee:"Coffee",steam:"Steam",water:"Water",prepare:"Preparing"},action:{none:"None",bu_removed:"Insert brew unit",trays_missing:"Insert trays",empty_trays:"Empty trays",fill_water:"Fill water tank",close_powder_lid:"Close powder lid",fill_powder:"Fill ground coffee",move_cup_to_frother:"Move cup to frother",flush_required:"Rinse required"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Milk",milk_froth:"Milk Froth",water:"Hot Water"},values:{very_mild:"V.Mild",mild:"Mild",medium:"Med",strong:"Strong",very_strong:"V.Strong",extra_strong:"X.Strong",cold:"Cold",normal:"Normal",high:"High",none:"None",one:"1",two:"2",three:"3",coffee:"Coffee",milk:"Milk",water:"Water",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Brew {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Recipe",all_recipes:"All Recipes"},freestyle:{title:"Freestyle",drink_name_placeholder:"Drink name",component:"Component {n}",process:"Process",portion:"Portion",intensity:"Intensity",aroma:"Aroma",temp:"Temp",temperature:"Temperature",shots:"Shots",portion_value:"{value} ml",brew_named:"Brew {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier is not available.",generating:"Generating...",surprise_me:"Surprise me",error_generate:"Sommelier: recipe generation failed",error_brew:"Sommelier: brew failed",reasoning:"Why this recipe?",wizard_title:"Step-by-step brew",step_of:"Step {n} of {total}",done:"Done",brew_phase:"Brew phase {n}/{total}",phase_running:"Phase started — let the machine finish, then continue",finish:"Finish",cancel:"Cancel",info:"Recipe details",steps:"Steps",err:{no_llm_agent:"No AI agent is installed in Home Assistant — add an LLM integration to use the Sommelier",no_llm_agent_selected:"No AI agent selected — pick one in the Sommelier panel, System tab",llm_agent_missing:"The selected AI agent is gone — pick another in the Sommelier panel, System tab"}},stats:{title:"Stats",total_cups:"Total Cups",unavailable:"Cup statistics not available.",empty:"No cups brewed yet"},maintenance:{title:"Maintenance",groups:{cleaning:"Cleaning & Descaling",filter:"Water Filter",other:"Other"},actions:{easy_clean:{label:"Easy Clean",desc:"Quick rinse of the brew unit"},intensive_clean:{label:"Intensive Clean",desc:"Deep cleaning with tablet"},descaling:{label:"Descaling",desc:"Remove limescale buildup"},evaporating:{label:"Evaporating",desc:"Purge the steam system"},filter_insert:{label:"Insert Filter",desc:"Start using a new water filter"},filter_replace:{label:"Replace Filter",desc:"Replace the current water filter"},filter_remove:{label:"Remove Filter",desc:"Stop using the water filter"},switch_off:{label:"Switch Off",desc:"Turn off the machine"}}},settings:{title:"Settings",switches:{energy_saving:{label:"Energy Saving",desc:"Reduce power when idle"},auto_bean_select:{label:"Auto Bean Select",desc:"Auto-choose bean hopper"},rinsing_disabled:{label:"Rinsing Disabled",desc:"Skip auto rinse cycle"}},numbers:{water_hardness:{label:"Water Hardness",desc:"Calibrate for water type"},auto_off_after:{label:"Auto Off",desc:"Minutes until shutdown"},brew_temperature:{label:"Brew Temperature",desc:"Brewing water temp"}},levels:{water_hardness:{1:"Soft",2:"Medium",3:"Hard",4:"Very Hard"},brew_temperature:{0:"Low",1:"Normal",2:"High"}},minutes:"{value} min"},edit_dialog:{title:"Edit: {drink}"},editor:{device:"Device",enter_manually:"Enter manually...",entity_prefix:"Entity Prefix",entity_prefix_placeholder:"Auto-detected if integration is running",no_devices_hint:"No Melitta devices detected. Enter prefix manually or check that the integration is configured.",name:"Name",show_header:"Show header",show_status:"Show status",show_profiles:"Show profile selector",show_recipes:"Show recipe selector",show_freestyle:"Show freestyle recipe",show_sommelier:"Show AI Sommelier",show_stats:"Show cup statistics",show_maintenance:"Show maintenance",show_settings:"Show settings",compact:"Compact mode"}},Je={common:{brew:"Preparar",cancel:"Cancelar",save:"Guardar",confirm:"Confirmar",start:"Iniciar",loading:"Cargando...",retry:"Reintentar",default_name:"Melitta Barista"},card:{no_device:"No se encontró ningún dispositivo Melitta Barista.",no_device_hint:"Asegúrate de que la integración esté instalada y configurada.",machine_offline:"Máquina sin conexión"},state:{ready:"Listo",brewing:"Preparando",cleaning:"Limpieza",descaling:"Descalcificación",off:"Apagado",busy:"Ocupado",filter_insert:"Insertando filtro",filter_replace:"Reemplazando filtro",filter_remove:"Retirando filtro",evaporating:"Evaporación",idle:"Inactivo",unavailable:"No disponible",unknown:"Desconocido"},activity:{grinding:"Moliendo",coffee:"Café",steam:"Vapor",water:"Agua",prepare:"Preparando"},action:{none:"Ninguna",bu_removed:"Inserta el grupo de erogación",trays_missing:"Inserta las bandejas",empty_trays:"Vacía las bandejas",fill_water:"Llena el depósito de agua",close_powder_lid:"Cierra la tapa del café molido",fill_powder:"Añade café molido",move_cup_to_frother:"Acerca la taza al espumador",flush_required:"Se requiere enjuague"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Leche",milk_froth:"Espuma de leche",water:"Agua caliente"},values:{very_mild:"M.Suave",mild:"Suave",medium:"Medio",strong:"Fuerte",very_strong:"M.Fuerte",extra_strong:"X.Fuerte",cold:"Frío",normal:"Normal",high:"Alto",none:"Ninguno",one:"1",two:"2",three:"3",coffee:"Café",milk:"Leche",water:"Agua",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Preparar {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Receta",all_recipes:"Todas las recetas"},freestyle:{title:"Freestyle",drink_name_placeholder:"Nombre de la bebida",component:"Componente {n}",process:"Proceso",portion:"Porción",intensity:"Intensidad",aroma:"Aroma",temp:"Temp.",temperature:"Temperatura",shots:"Shots",portion_value:"{value} ml",brew_named:"Preparar {name}"},sommelier:{title:"Sommelier IA",unavailable:"El sommelier no está disponible.",generating:"Generando...",surprise_me:"Sorpréndeme",error_generate:"Sommelier: error al generar la receta",error_brew:"Sommelier: error al preparar",reasoning:"¿Por qué esta receta?",wizard_title:"Preparación paso a paso",step_of:"Paso {n} de {total}",done:"Hecho",brew_phase:"Preparar fase {n}/{total}",phase_running:"Fase iniciada — deja que la máquina termine y luego continúa",finish:"Finalizar",cancel:"Cancelar",info:"Detalles de la receta",steps:"Pasos",err:{no_llm_agent:"No hay ningún agente de IA instalado en Home Assistant — añade una integración LLM para usar el sommelier",no_llm_agent_selected:"No hay ningún agente de IA seleccionado — elige uno en el panel del sommelier, pestaña System",llm_agent_missing:"El agente de IA seleccionado ya no existe — elige otro en el panel del sommelier, pestaña System"}},stats:{title:"Estadísticas",total_cups:"Tazas totales",unavailable:"Estadísticas de tazas no disponibles.",empty:"Aún no se han preparado tazas"},maintenance:{title:"Mantenimiento",groups:{cleaning:"Limpieza y descalcificación",filter:"Filtro de agua",other:"Otros"},actions:{easy_clean:{label:"Limpieza rápida",desc:"Enjuague rápido de la unidad de infusión"},intensive_clean:{label:"Limpieza intensiva",desc:"Limpieza profunda con pastilla"},descaling:{label:"Descalcificación",desc:"Eliminar los depósitos de cal"},evaporating:{label:"Evaporación",desc:"Purgar el sistema de vapor"},filter_insert:{label:"Insertar filtro",desc:"Empezar a usar un filtro de agua nuevo"},filter_replace:{label:"Reemplazar filtro",desc:"Reemplazar el filtro de agua actual"},filter_remove:{label:"Retirar filtro",desc:"Dejar de usar el filtro de agua"},switch_off:{label:"Apagar",desc:"Apagar la máquina"}}},settings:{title:"Ajustes",switches:{energy_saving:{label:"Ahorro de energía",desc:"Reducir el consumo en reposo"},auto_bean_select:{label:"Selección auto de granos",desc:"Elegir automáticamente la tolva de granos"},rinsing_disabled:{label:"Enjuague desactivado",desc:"Omitir el ciclo de enjuague automático"}},numbers:{water_hardness:{label:"Dureza del agua",desc:"Calibrar según el tipo de agua"},auto_off_after:{label:"Apagado auto",desc:"Minutos hasta el apagado"},brew_temperature:{label:"Temperatura de infusión",desc:"Temperatura del agua de infusión"}},levels:{water_hardness:{1:"Blanda",2:"Media",3:"Dura",4:"Muy dura"},brew_temperature:{0:"Baja",1:"Normal",2:"Alta"}},minutes:"{value} min"},edit_dialog:{title:"Editar: {drink}"},editor:{device:"Dispositivo",enter_manually:"Introducir manualmente...",entity_prefix:"Prefijo de entidad",entity_prefix_placeholder:"Detectado automáticamente si la integración está en funcionamiento",no_devices_hint:"No se detectaron dispositivos Melitta. Introduce el prefijo manualmente o comprueba que la integración esté configurada.",name:"Nombre",show_header:"Mostrar encabezado",show_status:"Mostrar estado",show_profiles:"Mostrar selector de perfil",show_recipes:"Mostrar selector de recetas",show_freestyle:"Mostrar receta Freestyle",show_sommelier:"Mostrar Sommelier IA",show_stats:"Mostrar estadísticas de tazas",show_maintenance:"Mostrar mantenimiento",show_settings:"Mostrar ajustes",compact:"Modo compacto"}},Qe={common:{brew:"Valmista",cancel:"Tühista",save:"Salvesta",confirm:"Kinnita",start:"Alusta",loading:"Laadimine...",retry:"Proovi uuesti",default_name:"Melitta Barista"},card:{no_device:"Melitta Barista seadet ei leitud.",no_device_hint:"Veenduge, et integratsioon on paigaldatud ja seadistatud.",machine_offline:"Masin on võrguühenduseta"},state:{ready:"Valmis",brewing:"Valmistamine",cleaning:"Puhastus",descaling:"Katlakivi eemaldamine",off:"Väljas",busy:"Hõivatud",filter_insert:"Filtri sisestamine",filter_replace:"Filtri vahetus",filter_remove:"Filtri eemaldamine",evaporating:"Aurustumine",idle:"Ootel",unavailable:"Pole saadaval",unknown:"Tundmatu"},activity:{grinding:"Jahvatamine",coffee:"Kohv",steam:"Aur",water:"Vesi",prepare:"Ettevalmistus"},action:{none:"Puudub",bu_removed:"Paigalda tõmbeplokk",trays_missing:"Paigalda alused",empty_trays:"Tühjenda alused",fill_water:"Täida veepaak",close_powder_lid:"Sulge jahvatatud kohvi kaas",fill_powder:"Lisa jahvatatud kohvi",move_cup_to_frother:"Liiguta tass piimavahusti alla",flush_required:"Vajalik loputus"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Piim",milk_froth:"Piimavaht",water:"Kuum vesi"},values:{very_mild:"V.mahe",mild:"Mahe",medium:"Keskm.",strong:"Kange",very_strong:"V.kange",extra_strong:"X.kange",cold:"Külm",normal:"Tavaline",high:"Kõrge",none:"Puudub",one:"1",two:"2",three:"3",coffee:"Kohv",milk:"Piim",water:"Vesi",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Valmista {drink}",two_cups:"2x",two_cups_on:"2x SEES"},recipes:{title:"Retsept",all_recipes:"Kõik retseptid"},freestyle:{title:"Freestyle",drink_name_placeholder:"Joogi nimi",component:"Komponent {n}",process:"Protsess",portion:"Kogus",intensity:"Intensiivsus",aroma:"Aroom",temp:"Temp.",temperature:"Temperatuur",shots:"Šotid",portion_value:"{value} ml",brew_named:"Valmista {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier pole saadaval.",generating:"Genereerimine...",surprise_me:"Üllata mind",error_generate:"Sommelier: retsepti loomine ebaõnnestus",error_brew:"Sommelier: valmistamine ebaõnnestus",reasoning:"Miks see retsept?",wizard_title:"Samm-sammuline valmistamine",step_of:"Samm {n} / {total}",done:"Valmis",brew_phase:"Valmista faas {n}/{total}",phase_running:"Faas on käivitatud — lase masinal lõpetada ja seejärel jätka",finish:"Lõpeta",cancel:"Tühista",info:"Retsepti üksikasjad",steps:"Sammud",err:{no_llm_agent:"Home Assistanti pole paigaldatud ühtegi AI-agenti — lisa LLM-integratsioon, et Sommelier'd kasutada",no_llm_agent_selected:"AI-agent on valimata — vali see Sommelier' paneelil, vahekaart System",llm_agent_missing:"Valitud AI-agent on kadunud — vali Sommelier' paneelil teine, vahekaart System"}},stats:{title:"Statistika",total_cups:"Tasse kokku",unavailable:"Tassistatistika pole saadaval.",empty:"Ühtegi tassi pole veel valmistatud"},maintenance:{title:"Hooldus",groups:{cleaning:"Puhastus ja katlakivi eemaldamine",filter:"Veefilter",other:"Muu"},actions:{easy_clean:{label:"Kiirpuhastus",desc:"Valmistusüksuse kiire loputus"},intensive_clean:{label:"Intensiivne puhastus",desc:"Põhjalik puhastus tabletiga"},descaling:{label:"Katlakivi eemaldamine",desc:"Eemaldab katlakivi ladestused"},evaporating:{label:"Aurustumine",desc:"Aurusüsteemi tühjendamine"},filter_insert:{label:"Sisesta filter",desc:"Uue veefiltri kasutuselevõtt"},filter_replace:{label:"Vaheta filter",desc:"Praeguse veefiltri vahetamine"},filter_remove:{label:"Eemalda filter",desc:"Veefiltri kasutamise lõpetamine"},switch_off:{label:"Lülita välja",desc:"Masina väljalülitamine"}}},settings:{title:"Seaded",switches:{energy_saving:{label:"Energiasääst",desc:"Vähendab voolutarbimist ootel"},auto_bean_select:{label:"Automaatne ubade valik",desc:"Valib oamahuti automaatselt"},rinsing_disabled:{label:"Loputus keelatud",desc:"Jätab automaatse loputuse vahele"}},numbers:{water_hardness:{label:"Vee karedus",desc:"Kalibreerimine vee tüübi järgi"},auto_off_after:{label:"Automaatne väljalülitus",desc:"Minutid väljalülitumiseni"},brew_temperature:{label:"Valmistustemperatuur",desc:"Valmistusvee temperatuur"}},levels:{water_hardness:{1:"Pehme",2:"Keskmine",3:"Kare",4:"Väga kare"},brew_temperature:{0:"Madal",1:"Tavaline",2:"Kõrge"}},minutes:"{value} min"},edit_dialog:{title:"Muuda: {drink}"},editor:{device:"Seade",enter_manually:"Sisesta käsitsi...",entity_prefix:"Olemi prefiks",entity_prefix_placeholder:"Tuvastatakse automaatselt, kui integratsioon töötab",no_devices_hint:"Melitta seadmeid ei tuvastatud. Sisestage prefiks käsitsi või kontrollige, et integratsioon on seadistatud.",name:"Nimi",show_header:"Kuva päis",show_status:"Kuva olek",show_profiles:"Kuva profiilivalija",show_recipes:"Kuva retseptivalija",show_freestyle:"Kuva Freestyle retsept",show_sommelier:"Kuva AI Sommelier",show_stats:"Kuva tassistatistika",show_maintenance:"Kuva hooldus",show_settings:"Kuva seaded",compact:"Kompaktne režiim"}},et={common:{brew:"Valmista",cancel:"Peruuta",save:"Tallenna",confirm:"Vahvista",start:"Aloita",loading:"Ladataan...",retry:"Yritä uudelleen",default_name:"Melitta Barista"},card:{no_device:"Melitta Barista -laitetta ei löytynyt.",no_device_hint:"Varmista, että integraatio on asennettu ja määritetty.",machine_offline:"Kone on offline-tilassa"},state:{ready:"Valmis",brewing:"Keittäminen",cleaning:"Puhdistus",descaling:"Kalkinpoisto",off:"Pois",busy:"Varattu",filter_insert:"Suodattimen asennus",filter_replace:"Suodattimen vaihto",filter_remove:"Suodattimen poisto",evaporating:"Höyrystys",idle:"Odottaa",unavailable:"Ei saatavilla",unknown:"Tuntematon"},activity:{grinding:"Jauhatus",coffee:"Kahvi",steam:"Höyry",water:"Vesi",prepare:"Valmistelu"},action:{none:"Ei mitään",bu_removed:"Aseta suodatusyksikkö",trays_missing:"Aseta astiat",empty_trays:"Tyhjennä astiat",fill_water:"Täytä vesisäiliö",close_powder_lid:"Sulje jauhekahvin kansi",fill_powder:"Lisää jauhettua kahvia",move_cup_to_frother:"Siirrä kuppi maitovaahdottimen alle",flush_required:"Huuhtelu vaaditaan"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Maito",milk_froth:"Maitovaahto",water:"Kuuma vesi"},values:{very_mild:"E.Mieto",mild:"Mieto",medium:"Keski",strong:"Vahva",very_strong:"E.Vahva",extra_strong:"X.Vahva",cold:"Kylmä",normal:"Norm.",high:"Korkea",none:"Ei",one:"1",two:"2",three:"3",coffee:"Kahvi",milk:"Maito",water:"Vesi",standard:"Vakio",intense:"Int+"},directkey:{brew_drink:"Valmista {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Resepti",all_recipes:"Kaikki reseptit"},freestyle:{title:"Freestyle",drink_name_placeholder:"Juoman nimi",component:"Komponentti {n}",process:"Prosessi",portion:"Annos",intensity:"Vahvuus",aroma:"Aromi",temp:"Lämpö",temperature:"Lämpötila",shots:"Shotit",portion_value:"{value} ml",brew_named:"Valmista {name}"},sommelier:{title:"AI-sommelier",unavailable:"Sommelier ei ole käytettävissä.",generating:"Luodaan...",surprise_me:"Yllätä minut",error_generate:"Sommelier: reseptin luonti epäonnistui",error_brew:"Sommelier: valmistus epäonnistui",reasoning:"Miksi tämä resepti?",wizard_title:"Vaiheittainen valmistus",step_of:"Vaihe {n}/{total}",done:"Valmis",brew_phase:"Valmista vaihe {n}/{total}",phase_running:"Vaihe käynnistetty — anna koneen valmistua ja jatka sitten",finish:"Lopeta",cancel:"Peruuta",info:"Reseptin tiedot",steps:"Vaiheet",err:{no_llm_agent:"Home Assistantiin ei ole asennettu AI-agenttia — lisää LLM-integraatio käyttääksesi sommelieria",no_llm_agent_selected:"AI-agenttia ei ole valittu — valitse se sommelier-paneelin System-välilehdeltä",llm_agent_missing:"Valittu AI-agentti on poistunut — valitse toinen sommelier-paneelin System-välilehdeltä"}},stats:{title:"Tilastot",total_cups:"Kupit yhteensä",unavailable:"Kuppitilastot eivät ole saatavilla.",empty:"Ei vielä valmistettuja kuppeja"},maintenance:{title:"Huolto",groups:{cleaning:"Puhdistus ja kalkinpoisto",filter:"Vesisuodatin",other:"Muut"},actions:{easy_clean:{label:"Pikapuhdistus",desc:"Keittoyksikön pikahuuhtelu"},intensive_clean:{label:"Tehopuhdistus",desc:"Perusteellinen puhdistus tabletilla"},descaling:{label:"Kalkinpoisto",desc:"Poista kalkkikertymät"},evaporating:{label:"Höyrystys",desc:"Tyhjennä höyryjärjestelmä"},filter_insert:{label:"Aseta suodatin",desc:"Ota uusi vesisuodatin käyttöön"},filter_replace:{label:"Vaihda suodatin",desc:"Vaihda nykyinen vesisuodatin"},filter_remove:{label:"Poista suodatin",desc:"Poista vesisuodatin käytöstä"},switch_off:{label:"Sammuta",desc:"Sammuta kone"}}},settings:{title:"Asetukset",switches:{energy_saving:{label:"Energiansäästö",desc:"Vähennä tehoa lepotilassa"},auto_bean_select:{label:"Automaattinen papuvalinta",desc:"Valitse papusäiliö automaattisesti"},rinsing_disabled:{label:"Huuhtelu pois käytöstä",desc:"Ohita automaattinen huuhtelu"}},numbers:{water_hardness:{label:"Veden kovuus",desc:"Kalibroi vesityypin mukaan"},auto_off_after:{label:"Automaattisammutus",desc:"Minuutit sammutukseen"},brew_temperature:{label:"Keittolämpötila",desc:"Keittoveden lämpötila"}},levels:{water_hardness:{1:"Pehmeä",2:"Keskikova",3:"Kova",4:"Erittäin kova"},brew_temperature:{0:"Matala",1:"Normaali",2:"Korkea"}},minutes:"{value} min"},edit_dialog:{title:"Muokkaa: {drink}"},editor:{device:"Laite",enter_manually:"Syötä manuaalisesti...",entity_prefix:"Entiteettietuliite",entity_prefix_placeholder:"Tunnistetaan automaattisesti, jos integraatio on käynnissä",no_devices_hint:"Melitta-laitteita ei löytynyt. Syötä etuliite manuaalisesti tai tarkista, että integraatio on määritetty.",name:"Nimi",show_header:"Näytä otsikko",show_status:"Näytä tila",show_profiles:"Näytä profiilivalitsin",show_recipes:"Näytä reseptivalitsin",show_freestyle:"Näytä Freestyle-resepti",show_sommelier:"Näytä AI-sommelier",show_stats:"Näytä kuppitilastot",show_maintenance:"Näytä huolto",show_settings:"Näytä asetukset",compact:"Tiivis tila"}},tt={common:{brew:"Préparer",cancel:"Annuler",save:"Enregistrer",confirm:"Confirmer",start:"Démarrer",loading:"Chargement...",retry:"Réessayer",default_name:"Melitta Barista"},card:{no_device:"Aucun appareil Melitta Barista trouvé.",no_device_hint:"Vérifiez que l'intégration est installée et configurée.",machine_offline:"Machine hors ligne"},state:{ready:"Prêt",brewing:"Préparation",cleaning:"Nettoyage",descaling:"Détartrage",off:"Éteint",busy:"Occupé",filter_insert:"Insertion du filtre",filter_replace:"Remplacement du filtre",filter_remove:"Retrait du filtre",evaporating:"Évaporation",idle:"Inactif",unavailable:"Indisponible",unknown:"Inconnu"},activity:{grinding:"Mouture",coffee:"Café",steam:"Vapeur",water:"Eau",prepare:"Préparation"},action:{none:"Aucune",bu_removed:"Insérer le bloc d'infusion",trays_missing:"Insérer les bacs",empty_trays:"Vider les bacs",fill_water:"Remplir le réservoir d'eau",close_powder_lid:"Fermer le couvercle à café moulu",fill_powder:"Ajouter du café moulu",move_cup_to_frother:"Placer la tasse sous la buse à lait",flush_required:"Rinçage requis"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Lait",milk_froth:"Mousse de lait",water:"Eau chaude"},values:{very_mild:"T.Doux",mild:"Doux",medium:"Moyen",strong:"Fort",very_strong:"T.Fort",extra_strong:"X.Fort",cold:"Froid",normal:"Normal",high:"Élevé",none:"Aucun",one:"1",two:"2",three:"3",coffee:"Café",milk:"Lait",water:"Eau",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Préparer {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Recette",all_recipes:"Toutes les recettes"},freestyle:{title:"Freestyle",drink_name_placeholder:"Nom de la boisson",component:"Composant {n}",process:"Processus",portion:"Portion",intensity:"Intensité",aroma:"Arôme",temp:"Temp.",temperature:"Température",shots:"Doses",portion_value:"{value} ml",brew_named:"Préparer {name}"},sommelier:{title:"Sommelier IA",unavailable:"Le sommelier n'est pas disponible.",generating:"Génération...",surprise_me:"Surprends-moi",error_generate:"Sommelier : échec de la génération de la recette",error_brew:"Sommelier : échec de la préparation",reasoning:"Pourquoi cette recette ?",wizard_title:"Préparation pas à pas",step_of:"Étape {n} sur {total}",done:"Terminé",brew_phase:"Préparer la phase {n}/{total}",phase_running:"Phase lancée — laissez la machine terminer, puis continuez",finish:"Terminer",cancel:"Annuler",info:"Détails de la recette",steps:"Étapes",err:{no_llm_agent:"Aucun agent IA n'est installé dans Home Assistant — ajoutez une intégration LLM pour utiliser le sommelier",no_llm_agent_selected:"Aucun agent IA sélectionné — choisissez-en un dans le panneau du sommelier, onglet System",llm_agent_missing:"L'agent IA sélectionné n'existe plus — choisissez-en un autre dans le panneau du sommelier, onglet System"}},stats:{title:"Statistiques",total_cups:"Tasses au total",unavailable:"Statistiques des tasses non disponibles.",empty:"Aucune tasse préparée pour l'instant"},maintenance:{title:"Entretien",groups:{cleaning:"Nettoyage et détartrage",filter:"Filtre à eau",other:"Autre"},actions:{easy_clean:{label:"Nettoyage simple",desc:"Rinçage rapide de l'unité d'infusion"},intensive_clean:{label:"Nettoyage intensif",desc:"Nettoyage en profondeur avec pastille"},descaling:{label:"Détartrage",desc:"Éliminer les dépôts de calcaire"},evaporating:{label:"Évaporation",desc:"Purger le système de vapeur"},filter_insert:{label:"Insertion du filtre",desc:"Commencer à utiliser un nouveau filtre à eau"},filter_replace:{label:"Remplacement du filtre",desc:"Remplacer le filtre à eau actuel"},filter_remove:{label:"Retrait du filtre",desc:"Ne plus utiliser le filtre à eau"},switch_off:{label:"Éteindre",desc:"Éteindre la machine"}}},settings:{title:"Réglages",switches:{energy_saving:{label:"Économie d'énergie",desc:"Réduire la consommation en veille"},auto_bean_select:{label:"Sélection auto des grains",desc:"Choix automatique du bac à grains"},rinsing_disabled:{label:"Rinçage désactivé",desc:"Ignorer le cycle de rinçage auto"}},numbers:{water_hardness:{label:"Dureté de l'eau",desc:"Calibrer selon le type d'eau"},auto_off_after:{label:"Arrêt auto",desc:"Minutes avant l'extinction"},brew_temperature:{label:"Température d'infusion",desc:"Température de l'eau d'infusion"}},levels:{water_hardness:{1:"Douce",2:"Moyenne",3:"Dure",4:"Très dure"},brew_temperature:{0:"Basse",1:"Normale",2:"Élevée"}},minutes:"{value} min"},edit_dialog:{title:"Modifier : {drink}"},editor:{device:"Appareil",enter_manually:"Saisir manuellement...",entity_prefix:"Préfixe d'entité",entity_prefix_placeholder:"Détecté automatiquement si l'intégration est active",no_devices_hint:"Aucun appareil Melitta détecté. Saisissez le préfixe manuellement ou vérifiez que l'intégration est configurée.",name:"Nom",show_header:"Afficher l'en-tête",show_status:"Afficher le statut",show_profiles:"Afficher le sélecteur de profil",show_recipes:"Afficher le sélecteur de recettes",show_freestyle:"Afficher la recette Freestyle",show_sommelier:"Afficher le Sommelier IA",show_stats:"Afficher les statistiques de tasses",show_maintenance:"Afficher l'entretien",show_settings:"Afficher les réglages",compact:"Mode compact"}},at={common:{brew:"Pripremi",cancel:"Odustani",save:"Spremi",confirm:"Potvrdi",start:"Start",loading:"Učitavanje...",retry:"Pokušaj ponovno",default_name:"Melitta Barista"},card:{no_device:"Uređaj Melitta Barista nije pronađen.",no_device_hint:"Provjerite je li integracija instalirana i konfigurirana.",machine_offline:"Aparat izvan mreže"},state:{ready:"Spreman",brewing:"Priprema",cleaning:"Čišćenje",descaling:"Uklanjanje kamenca",off:"Isključen",busy:"Zauzet",filter_insert:"Umetanje filtera",filter_replace:"Zamjena filtera",filter_remove:"Uklanjanje filtera",evaporating:"Isparavanje",idle:"Neaktivan",unavailable:"Nedostupan",unknown:"Nepoznato"},activity:{grinding:"Mljevenje",coffee:"Kava",steam:"Para",water:"Voda",prepare:"Priprema"},action:{none:"Nema",bu_removed:"Umetni jedinicu za kuhanje",trays_missing:"Umetni posude",empty_trays:"Isprazni posude",fill_water:"Napuni spremnik vodom",close_powder_lid:"Zatvori poklopac za mljevenu kavu",fill_powder:"Dodaj mljevenu kavu",move_cup_to_frother:"Pomakni šalicu do mliječne mlaznice",flush_required:"Potrebno ispiranje"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mlijeko",milk_froth:"Mliječna pjena",water:"Vruća voda"},values:{very_mild:"V. blaga",mild:"Blaga",medium:"Srednja",strong:"Jaka",very_strong:"V. jaka",extra_strong:"Ekstra",cold:"Hladno",normal:"Normalno",high:"Visoko",none:"Bez",one:"1",two:"2",three:"3",coffee:"Kava",milk:"Mlijeko",water:"Voda",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Pripremi {drink}",two_cups:"2x",two_cups_on:"2x UKLJ."},recipes:{title:"Recept",all_recipes:"Svi recepti"},freestyle:{title:"Freestyle",drink_name_placeholder:"Naziv napitka",component:"Komponenta {n}",process:"Proces",portion:"Porcija",intensity:"Jačina",aroma:"Aroma",temp:"Temp.",temperature:"Temperatura",shots:"Šotovi",portion_value:"{value} ml",brew_named:"Pripremi {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier nije dostupan.",generating:"Generiranje...",surprise_me:"Iznenadi me",error_generate:"Sommelier: generiranje recepta nije uspjelo",error_brew:"Sommelier: priprema nije uspjela",reasoning:"Zašto ovaj recept?",wizard_title:"Priprema korak po korak",step_of:"Korak {n} od {total}",done:"Gotovo",brew_phase:"Pripremi fazu {n}/{total}",phase_running:"Faza je pokrenuta — pričekajte da aparat završi, zatim nastavite",finish:"Završi",cancel:"Odustani",info:"Detalji recepta",steps:"Koraci",err:{no_llm_agent:"U Home Assistantu nije instaliran AI agent — dodajte LLM integraciju kako biste koristili Sommeliera",no_llm_agent_selected:"Nije odabran AI agent — odaberite ga na Sommelier panelu, kartica System",llm_agent_missing:"Odabrani AI agent više ne postoji — odaberite drugi na Sommelier panelu, kartica System"}},stats:{title:"Statistika",total_cups:"Ukupno šalica",unavailable:"Statistika šalica nije dostupna.",empty:"Još nema pripremljenih šalica"},maintenance:{title:"Održavanje",groups:{cleaning:"Čišćenje i uklanjanje kamenca",filter:"Filter za vodu",other:"Ostalo"},actions:{easy_clean:{label:"Brzo čišćenje",desc:"Brzo ispiranje jedinice za kuhanje"},intensive_clean:{label:"Intenzivno čišćenje",desc:"Dubinsko čišćenje s tabletom"},descaling:{label:"Uklanjanje kamenca",desc:"Uklanjanje naslaga kamenca"},evaporating:{label:"Isparavanje",desc:"Pročišćavanje parnog sustava"},filter_insert:{label:"Umetni filter",desc:"Počni koristiti novi filter za vodu"},filter_replace:{label:"Zamijeni filter",desc:"Zamijeni trenutni filter za vodu"},filter_remove:{label:"Ukloni filter",desc:"Prestani koristiti filter za vodu"},switch_off:{label:"Isključi",desc:"Isključi aparat"}}},settings:{title:"Postavke",switches:{energy_saving:{label:"Ušteda energije",desc:"Smanjena potrošnja u mirovanju"},auto_bean_select:{label:"Automatski odabir zrna",desc:"Automatski odabir spremnika zrna"},rinsing_disabled:{label:"Ispiranje isključeno",desc:"Preskoči automatsko ispiranje"}},numbers:{water_hardness:{label:"Tvrdoća vode",desc:"Kalibracija prema tipu vode"},auto_off_after:{label:"Automatsko isključenje",desc:"Minute do isključenja"},brew_temperature:{label:"Temperatura pripreme",desc:"Temperatura vode za pripremu"}},levels:{water_hardness:{1:"Meka",2:"Srednja",3:"Tvrda",4:"Vrlo tvrda"},brew_temperature:{0:"Niska",1:"Normalna",2:"Visoka"}},minutes:"{value} min"},edit_dialog:{title:"Uredi: {drink}"},editor:{device:"Uređaj",enter_manually:"Unesi ručno...",entity_prefix:"Prefiks entiteta",entity_prefix_placeholder:"Automatski se otkriva ako je integracija pokrenuta",no_devices_hint:"Nije pronađen nijedan Melitta uređaj. Unesite prefiks ručno ili provjerite je li integracija konfigurirana.",name:"Naziv",show_header:"Prikaži zaglavlje",show_status:"Prikaži status",show_profiles:"Prikaži odabir profila",show_recipes:"Prikaži odabir recepta",show_freestyle:"Prikaži Freestyle recept",show_sommelier:"Prikaži AI Sommelier",show_stats:"Prikaži statistiku šalica",show_maintenance:"Prikaži održavanje",show_settings:"Prikaži postavke",compact:"Kompaktni način"}},it={common:{brew:"Főzés",cancel:"Mégse",save:"Mentés",confirm:"Megerősítés",start:"Indítás",loading:"Betöltés...",retry:"Újra",default_name:"Melitta Barista"},card:{no_device:"Nem található Melitta Barista eszköz.",no_device_hint:"Győződjön meg róla, hogy az integráció telepítve és beállítva van.",machine_offline:"A gép offline"},state:{ready:"Kész",brewing:"Főzés",cleaning:"Tisztítás",descaling:"Vízkőmentesítés",off:"Ki",busy:"Foglalt",filter_insert:"Szűrő behelyezése",filter_replace:"Szűrő cseréje",filter_remove:"Szűrő eltávolítása",evaporating:"Párologtatás",idle:"Üresjárat",unavailable:"Nem elérhető",unknown:"Ismeretlen"},activity:{grinding:"Őrlés",coffee:"Kávé",steam:"Gőz",water:"Víz",prepare:"Előkészítés"},action:{none:"Nincs",bu_removed:"Helyezd be a főzőegységet",trays_missing:"Helyezd be a tálcákat",empty_trays:"Ürítsd ki a tálcákat",fill_water:"Töltsd fel a víztartályt",close_powder_lid:"Zárd le az őrölt kávé fedelét",fill_powder:"Tölts be őrölt kávét",move_cup_to_frother:"Tedd a csészét a tejhabosító alá",flush_required:"Öblítés szükséges"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Tej",milk_froth:"Tejhab",water:"Forró víz"},values:{very_mild:"N.enyhe",mild:"Enyhe",medium:"Közepes",strong:"Erős",very_strong:"N.erős",extra_strong:"X.erős",cold:"Hideg",normal:"Normál",high:"Magas",none:"Nincs",one:"1",two:"2",three:"3",coffee:"Kávé",milk:"Tej",water:"Víz",standard:"Std",intense:"Int+"},directkey:{brew_drink:"{drink} főzése",two_cups:"2x",two_cups_on:"2x BE"},recipes:{title:"Recept",all_recipes:"Összes recept"},freestyle:{title:"Freestyle",drink_name_placeholder:"Ital neve",component:"Összetevő {n}",process:"Folyamat",portion:"Adag",intensity:"Intenzitás",aroma:"Aroma",temp:"Hőm.",temperature:"Hőmérséklet",shots:"Shot",portion_value:"{value} ml",brew_named:"{name} főzése"},sommelier:{title:"AI Sommelier",unavailable:"A Sommelier nem érhető el.",generating:"Generálás...",surprise_me:"Lepj meg",error_generate:"Sommelier: a recept generálása sikertelen",error_brew:"Sommelier: a főzés sikertelen",reasoning:"Miért ez a recept?",wizard_title:"Lépésről lépésre főzés",step_of:"{n}. lépés / {total}",done:"Kész",brew_phase:"Fázis {n}/{total} főzése",phase_running:"A fázis elindult — várd meg, míg a gép végez, majd folytasd",finish:"Befejezés",cancel:"Mégse",info:"Recept részletei",steps:"Lépések",err:{no_llm_agent:"Nincs AI-ügynök telepítve a Home Assistantban — adj hozzá egy LLM-integrációt a Sommelier használatához",no_llm_agent_selected:"Nincs kiválasztva AI-ügynök — válassz egyet a Sommelier panelen, a System fülön",llm_agent_missing:"A kiválasztott AI-ügynök eltűnt — válassz másikat a Sommelier panelen, a System fülön"}},stats:{title:"Statisztika",total_cups:"Összes csésze",unavailable:"A csészestatisztika nem érhető el.",empty:"Még nincs lefőzött csésze"},maintenance:{title:"Karbantartás",groups:{cleaning:"Tisztítás és vízkőmentesítés",filter:"Vízszűrő",other:"Egyéb"},actions:{easy_clean:{label:"Gyorstisztítás",desc:"A főzőegység gyors átöblítése"},intensive_clean:{label:"Intenzív tisztítás",desc:"Alapos tisztítás tablettával"},descaling:{label:"Vízkőmentesítés",desc:"Vízkőlerakódás eltávolítása"},evaporating:{label:"Párologtatás",desc:"A gőzrendszer kiürítése"},filter_insert:{label:"Szűrő behelyezése",desc:"Új vízszűrő használatba vétele"},filter_replace:{label:"Szűrő cseréje",desc:"A jelenlegi vízszűrő cseréje"},filter_remove:{label:"Szűrő eltávolítása",desc:"A vízszűrő használatának befejezése"},switch_off:{label:"Kikapcsolás",desc:"A gép kikapcsolása"}}},settings:{title:"Beállítások",switches:{energy_saving:{label:"Energiatakarékos",desc:"Kisebb fogyasztás üresjáratban"},auto_bean_select:{label:"Automatikus babválasztás",desc:"Babtartály automatikus kiválasztása"},rinsing_disabled:{label:"Öblítés kikapcsolva",desc:"Automatikus öblítés kihagyása"}},numbers:{water_hardness:{label:"Vízkeménység",desc:"Kalibrálás a víz típusához"},auto_off_after:{label:"Auto kikapcsolás",desc:"Percek a kikapcsolásig"},brew_temperature:{label:"Főzési hőmérséklet",desc:"A főzővíz hőmérséklete"}},levels:{water_hardness:{1:"Lágy",2:"Közepes",3:"Kemény",4:"Nagyon kemény"},brew_temperature:{0:"Alacsony",1:"Normál",2:"Magas"}},minutes:"{value} perc"},edit_dialog:{title:"Szerkesztés: {drink}"},editor:{device:"Eszköz",enter_manually:"Kézi megadás...",entity_prefix:"Entitás-előtag",entity_prefix_placeholder:"Automatikusan felismerve, ha az integráció fut",no_devices_hint:"Nem található Melitta eszköz. Adja meg az előtagot kézzel, vagy ellenőrizze, hogy az integráció be van-e állítva.",name:"Név",show_header:"Fejléc megjelenítése",show_status:"Állapot megjelenítése",show_profiles:"Profilválasztó megjelenítése",show_recipes:"Receptválasztó megjelenítése",show_freestyle:"Freestyle recept megjelenítése",show_sommelier:"AI Sommelier megjelenítése",show_stats:"Csészestatisztika megjelenítése",show_maintenance:"Karbantartás megjelenítése",show_settings:"Beállítások megjelenítése",compact:"Kompakt mód"}},rt={common:{brew:"Prepara",cancel:"Annulla",save:"Salva",confirm:"Conferma",start:"Avvia",loading:"Caricamento...",retry:"Riprova",default_name:"Melitta Barista"},card:{no_device:"Nessun dispositivo Melitta Barista trovato.",no_device_hint:"Assicurati che l'integrazione sia installata e configurata.",machine_offline:"Macchina offline"},state:{ready:"Pronto",brewing:"Erogazione",cleaning:"Pulizia",descaling:"Decalcificazione",off:"Spento",busy:"Occupato",filter_insert:"Inserimento filtro",filter_replace:"Sostituzione filtro",filter_remove:"Rimozione filtro",evaporating:"Evaporazione",idle:"Inattivo",unavailable:"Non disponibile",unknown:"Sconosciuto"},activity:{grinding:"Macinatura",coffee:"Caffè",steam:"Vapore",water:"Acqua",prepare:"Preparazione"},action:{none:"Nessuna",bu_removed:"Inserisci il gruppo infusore",trays_missing:"Inserisci le vaschette",empty_trays:"Svuota le vaschette",fill_water:"Riempi il serbatoio dell'acqua",close_powder_lid:"Chiudi il coperchio del caffè macinato",fill_powder:"Aggiungi caffè macinato",move_cup_to_frother:"Sposta la tazza sul cappuccinatore",flush_required:"Risciacquo necessario"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Latte",milk_froth:"Schiuma di latte",water:"Acqua calda"},values:{very_mild:"M.Legg.",mild:"Leggero",medium:"Medio",strong:"Forte",very_strong:"M.Forte",extra_strong:"X.Forte",cold:"Freddo",normal:"Normale",high:"Alto",none:"Nessuno",one:"1",two:"2",three:"3",coffee:"Caffè",milk:"Latte",water:"Acqua",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Prepara {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Ricetta",all_recipes:"Tutte le ricette"},freestyle:{title:"Freestyle",drink_name_placeholder:"Nome della bevanda",component:"Componente {n}",process:"Processo",portion:"Porzione",intensity:"Intensità",aroma:"Aroma",temp:"Temp.",temperature:"Temperatura",shots:"Shot",portion_value:"{value} ml",brew_named:"Prepara {name}"},sommelier:{title:"Sommelier AI",unavailable:"Il sommelier non è disponibile.",generating:"Generazione...",surprise_me:"Sorprendimi",error_generate:"Sommelier: generazione della ricetta non riuscita",error_brew:"Sommelier: preparazione non riuscita",reasoning:"Perché questa ricetta?",wizard_title:"Preparazione passo dopo passo",step_of:"Passo {n} di {total}",done:"Fatto",brew_phase:"Prepara fase {n}/{total}",phase_running:"Fase avviata — lascia che la macchina finisca, poi continua",finish:"Termina",cancel:"Annulla",info:"Dettagli della ricetta",steps:"Passaggi",err:{no_llm_agent:"Nessun agente AI installato in Home Assistant — aggiungi un'integrazione LLM per usare il sommelier",no_llm_agent_selected:"Nessun agente AI selezionato — scegline uno nel pannello del sommelier, scheda System",llm_agent_missing:"L'agente AI selezionato non esiste più — scegline un altro nel pannello del sommelier, scheda System"}},stats:{title:"Statistiche",total_cups:"Tazze totali",unavailable:"Statistiche delle tazze non disponibili.",empty:"Nessuna tazza preparata finora"},maintenance:{title:"Manutenzione",groups:{cleaning:"Pulizia e decalcificazione",filter:"Filtro dell'acqua",other:"Altro"},actions:{easy_clean:{label:"Pulizia rapida",desc:"Risciacquo rapido del gruppo erogatore"},intensive_clean:{label:"Pulizia intensiva",desc:"Pulizia profonda con pastiglia"},descaling:{label:"Decalcificazione",desc:"Rimuove i depositi di calcare"},evaporating:{label:"Evaporazione",desc:"Svuota il sistema del vapore"},filter_insert:{label:"Inserimento filtro",desc:"Inizia a usare un nuovo filtro dell'acqua"},filter_replace:{label:"Sostituzione filtro",desc:"Sostituisci il filtro dell'acqua attuale"},filter_remove:{label:"Rimozione filtro",desc:"Smetti di usare il filtro dell'acqua"},switch_off:{label:"Spegni",desc:"Spegni la macchina"}}},settings:{title:"Impostazioni",switches:{energy_saving:{label:"Risparmio energetico",desc:"Riduce il consumo quando inattiva"},auto_bean_select:{label:"Selezione auto chicchi",desc:"Scelta automatica del contenitore chicchi"},rinsing_disabled:{label:"Risciacquo disattivato",desc:"Salta il ciclo di risciacquo automatico"}},numbers:{water_hardness:{label:"Durezza dell'acqua",desc:"Calibra per il tipo di acqua"},auto_off_after:{label:"Spegnimento auto",desc:"Minuti fino allo spegnimento"},brew_temperature:{label:"Temperatura di erogazione",desc:"Temperatura dell'acqua di erogazione"}},levels:{water_hardness:{1:"Dolce",2:"Media",3:"Dura",4:"Molto dura"},brew_temperature:{0:"Bassa",1:"Normale",2:"Alta"}},minutes:"{value} min"},edit_dialog:{title:"Modifica: {drink}"},editor:{device:"Dispositivo",enter_manually:"Inserisci manualmente...",entity_prefix:"Prefisso entità",entity_prefix_placeholder:"Rilevato automaticamente se l'integrazione è attiva",no_devices_hint:"Nessun dispositivo Melitta rilevato. Inserisci il prefisso manualmente o verifica che l'integrazione sia configurata.",name:"Nome",show_header:"Mostra intestazione",show_status:"Mostra stato",show_profiles:"Mostra selettore profilo",show_recipes:"Mostra selettore ricette",show_freestyle:"Mostra ricetta Freestyle",show_sommelier:"Mostra Sommelier AI",show_stats:"Mostra statistiche tazze",show_maintenance:"Mostra manutenzione",show_settings:"Mostra impostazioni",compact:"Modalità compatta"}},nt={common:{brew:"Ruošti",cancel:"Atšaukti",save:"Išsaugoti",confirm:"Patvirtinti",start:"Pradėti",loading:"Įkeliama...",retry:"Bandyti dar kartą",default_name:"Melitta Barista"},card:{no_device:"Melitta Barista įrenginys nerastas.",no_device_hint:"Įsitikinkite, kad integracija įdiegta ir sukonfigūruota.",machine_offline:"Aparatas atsijungęs"},state:{ready:"Paruoštas",brewing:"Ruošimas",cleaning:"Valymas",descaling:"Kalkių šalinimas",off:"Išjungtas",busy:"Užimtas",filter_insert:"Filtro įdėjimas",filter_replace:"Filtro keitimas",filter_remove:"Filtro išėmimas",evaporating:"Garinimas",idle:"Laukimas",unavailable:"Nepasiekiamas",unknown:"Nežinomas"},activity:{grinding:"Malimas",coffee:"Kava",steam:"Garai",water:"Vanduo",prepare:"Paruošimas"},action:{none:"Nėra",bu_removed:"Įdėkite plikymo bloką",trays_missing:"Įdėkite padėklus",empty_trays:"Ištuštinkite padėklus",fill_water:"Pripilkite vandens į talpyklą",close_powder_lid:"Uždarykite maltos kavos dangtelį",fill_powder:"Įpilkite maltos kavos",move_cup_to_frother:"Perkelkite puodelį prie pieno putų antgalio",flush_required:"Reikalingas skalavimas"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Pienas",milk_froth:"Pieno puta",water:"Karštas vanduo"},values:{very_mild:"L.švelni",mild:"Švelni",medium:"Vidut.",strong:"Stipri",very_strong:"L.stipri",extra_strong:"X.stipri",cold:"Šalta",normal:"Įprasta",high:"Aukšta",none:"Nėra",one:"1",two:"2",three:"3",coffee:"Kava",milk:"Pienas",water:"Vanduo",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Ruošti {drink}",two_cups:"2x",two_cups_on:"2x ĮJ."},recipes:{title:"Receptas",all_recipes:"Visi receptai"},freestyle:{title:"Freestyle",drink_name_placeholder:"Gėrimo pavadinimas",component:"Komponentas {n}",process:"Procesas",portion:"Porcija",intensity:"Stiprumas",aroma:"Aromatas",temp:"Temp.",temperature:"Temperatūra",shots:"Šotai",portion_value:"{value} ml",brew_named:"Ruošti {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier nepasiekiamas.",generating:"Generuojama...",surprise_me:"Nustebink mane",error_generate:"Sommelier: nepavyko sugeneruoti recepto",error_brew:"Sommelier: nepavyko paruošti gėrimo",reasoning:"Kodėl šis receptas?",wizard_title:"Ruošimas žingsnis po žingsnio",step_of:"Žingsnis {n} iš {total}",done:"Atlikta",brew_phase:"Ruošti fazę {n}/{total}",phase_running:"Fazė pradėta — leiskite aparatui baigti, tada tęskite",finish:"Baigti",cancel:"Atšaukti",info:"Recepto informacija",steps:"Žingsniai",err:{no_llm_agent:"Home Assistant nėra įdiegto AI agento — pridėkite LLM integraciją, kad galėtumėte naudoti Sommelier",no_llm_agent_selected:"Nepasirinktas AI agentas — pasirinkite jį Sommelier skydelyje, skirtuke System",llm_agent_missing:"Pasirinktas AI agentas dingo — pasirinkite kitą Sommelier skydelyje, skirtuke System"}},stats:{title:"Statistika",total_cups:"Iš viso puodelių",unavailable:"Puodelių statistika nepasiekiama.",empty:"Dar neparuoštas nė vienas puodelis"},maintenance:{title:"Priežiūra",groups:{cleaning:"Valymas ir kalkių šalinimas",filter:"Vandens filtras",other:"Kita"},actions:{easy_clean:{label:"Greitas valymas",desc:"Greitas ruošimo bloko skalavimas"},intensive_clean:{label:"Intensyvus valymas",desc:"Kruopštus valymas su tablete"},descaling:{label:"Kalkių šalinimas",desc:"Pašalina kalkių nuosėdas"},evaporating:{label:"Garinimas",desc:"Išvalo garų sistemą"},filter_insert:{label:"Įdėti filtrą",desc:"Pradėti naudoti naują vandens filtrą"},filter_replace:{label:"Pakeisti filtrą",desc:"Pakeisti esamą vandens filtrą"},filter_remove:{label:"Išimti filtrą",desc:"Nustoti naudoti vandens filtrą"},switch_off:{label:"Išjungti",desc:"Išjungti aparatą"}}},settings:{title:"Nustatymai",switches:{energy_saving:{label:"Energijos taupymas",desc:"Mažina energijos sąnaudas laukiant"},auto_bean_select:{label:"Automatinis pupelių pasirinkimas",desc:"Automatiškai parenka pupelių talpyklą"},rinsing_disabled:{label:"Skalavimas išjungtas",desc:"Praleidžia automatinį skalavimą"}},numbers:{water_hardness:{label:"Vandens kietumas",desc:"Kalibravimas pagal vandens tipą"},auto_off_after:{label:"Auto išjungimas",desc:"Minutės iki išsijungimo"},brew_temperature:{label:"Ruošimo temperatūra",desc:"Ruošimo vandens temperatūra"}},levels:{water_hardness:{1:"Minkštas",2:"Vidutinis",3:"Kietas",4:"Labai kietas"},brew_temperature:{0:"Žema",1:"Įprasta",2:"Aukšta"}},minutes:"{value} min."},edit_dialog:{title:"Redaguoti: {drink}"},editor:{device:"Įrenginys",enter_manually:"Įvesti rankiniu būdu...",entity_prefix:"Esybės prefiksas",entity_prefix_placeholder:"Aptinkama automatiškai, jei integracija veikia",no_devices_hint:"Melitta įrenginių neaptikta. Įveskite prefiksą rankiniu būdu arba patikrinkite, ar integracija sukonfigūruota.",name:"Pavadinimas",show_header:"Rodyti antraštę",show_status:"Rodyti būseną",show_profiles:"Rodyti profilio pasirinkimą",show_recipes:"Rodyti receptų pasirinkimą",show_freestyle:"Rodyti Freestyle receptą",show_sommelier:"Rodyti AI Sommelier",show_stats:"Rodyti puodelių statistiką",show_maintenance:"Rodyti priežiūrą",show_settings:"Rodyti nustatymus",compact:"Kompaktiškas režimas"}},st={common:{brew:"Gatavot",cancel:"Atcelt",save:"Saglabāt",confirm:"Apstiprināt",start:"Sākt",loading:"Ielāde...",retry:"Mēģināt vēlreiz",default_name:"Melitta Barista"},card:{no_device:"Melitta Barista ierīce nav atrasta.",no_device_hint:"Pārliecinieties, ka integrācija ir instalēta un konfigurēta.",machine_offline:"Aparāts bezsaistē"},state:{ready:"Gatavs",brewing:"Gatavošana",cleaning:"Tīrīšana",descaling:"Atkaļķošana",off:"Izslēgts",busy:"Aizņemts",filter_insert:"Filtra ievietošana",filter_replace:"Filtra maiņa",filter_remove:"Filtra izņemšana",evaporating:"Iztvaikošana",idle:"Gaidīšana",unavailable:"Nav pieejams",unknown:"Nezināms"},activity:{grinding:"Malšana",coffee:"Kafija",steam:"Tvaiks",water:"Ūdens",prepare:"Sagatavošana"},action:{none:"Nav",bu_removed:"Ievietojiet gatavošanas bloku",trays_missing:"Ievietojiet paplātes",empty_trays:"Iztukšojiet paplātes",fill_water:"Uzpildiet ūdens tvertni",close_powder_lid:"Aizveriet maltās kafijas vāciņu",fill_powder:"Iepildiet malto kafiju",move_cup_to_frother:"Pārvietojiet tasi pie piena putotāja",flush_required:"Nepieciešama skalošana"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Piens",milk_froth:"Piena putas",water:"Karsts ūdens"},values:{very_mild:"Ļ.maiga",mild:"Maiga",medium:"Vidēja",strong:"Stipra",very_strong:"Ļ.stipra",extra_strong:"X.stipra",cold:"Auksta",normal:"Normāla",high:"Augsta",none:"Nav",one:"1",two:"2",three:"3",coffee:"Kafija",milk:"Piens",water:"Ūdens",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Gatavot {drink}",two_cups:"2x",two_cups_on:"2x IESL."},recipes:{title:"Recepte",all_recipes:"Visas receptes"},freestyle:{title:"Freestyle",drink_name_placeholder:"Dzēriena nosaukums",component:"Komponents {n}",process:"Process",portion:"Porcija",intensity:"Stiprums",aroma:"Aromāts",temp:"Temp.",temperature:"Temperatūra",shots:"Šoti",portion_value:"{value} ml",brew_named:"Gatavot {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier nav pieejams.",generating:"Ģenerē...",surprise_me:"Pārsteidz mani",error_generate:"Sommelier: neizdevās ģenerēt recepti",error_brew:"Sommelier: neizdevās pagatavot dzērienu",reasoning:"Kāpēc šī recepte?",wizard_title:"Pagatavošana soli pa solim",step_of:"Solis {n} no {total}",done:"Gatavs",brew_phase:"Pagatavot fāzi {n}/{total}",phase_running:"Fāze ir sākta — ļaujiet automātam pabeigt un tad turpiniet",finish:"Pabeigt",cancel:"Atcelt",info:"Receptes informācija",steps:"Soļi",err:{no_llm_agent:"Home Assistant nav instalēts neviens AI aģents — pievienojiet LLM integrāciju, lai izmantotu Sommelier",no_llm_agent_selected:"Nav izvēlēts AI aģents — izvēlieties to Sommelier panelī, cilnē System",llm_agent_missing:"Izvēlētais AI aģents ir pazudis — izvēlieties citu Sommelier panelī, cilnē System"}},stats:{title:"Statistika",total_cups:"Kopā tases",unavailable:"Tašu statistika nav pieejama.",empty:"Vēl nav pagatavota neviena tase"},maintenance:{title:"Apkope",groups:{cleaning:"Tīrīšana un atkaļķošana",filter:"Ūdens filtrs",other:"Cits"},actions:{easy_clean:{label:"Ātrā tīrīšana",desc:"Ātra gatavošanas bloka skalošana"},intensive_clean:{label:"Intensīvā tīrīšana",desc:"Pamatīga tīrīšana ar tableti"},descaling:{label:"Atkaļķošana",desc:"Noņem kaļķa nogulsnes"},evaporating:{label:"Iztvaikošana",desc:"Iztukšo tvaika sistēmu"},filter_insert:{label:"Ievietot filtru",desc:"Sākt lietot jaunu ūdens filtru"},filter_replace:{label:"Nomainīt filtru",desc:"Nomainīt pašreizējo ūdens filtru"},filter_remove:{label:"Izņemt filtru",desc:"Pārtraukt ūdens filtra lietošanu"},switch_off:{label:"Izslēgt",desc:"Izslēgt aparātu"}}},settings:{title:"Iestatījumi",switches:{energy_saving:{label:"Enerģijas taupīšana",desc:"Samazina patēriņu gaidīšanas režīmā"},auto_bean_select:{label:"Automātiska pupiņu izvēle",desc:"Automātiski izvēlas pupiņu tvertni"},rinsing_disabled:{label:"Skalošana izslēgta",desc:"Izlaiž automātisko skalošanu"}},numbers:{water_hardness:{label:"Ūdens cietība",desc:"Kalibrēšana atbilstoši ūdens tipam"},auto_off_after:{label:"Auto izslēgšana",desc:"Minūtes līdz izslēgšanai"},brew_temperature:{label:"Brūvēšanas temperatūra",desc:"Gatavošanas ūdens temperatūra"}},levels:{water_hardness:{1:"Mīksts",2:"Vidējs",3:"Ciets",4:"Ļoti ciets"},brew_temperature:{0:"Zema",1:"Normāla",2:"Augsta"}},minutes:"{value} min"},edit_dialog:{title:"Rediģēt: {drink}"},editor:{device:"Ierīce",enter_manually:"Ievadīt manuāli...",entity_prefix:"Entītijas prefikss",entity_prefix_placeholder:"Tiek noteikts automātiski, ja integrācija darbojas",no_devices_hint:"Melitta ierīces nav atrastas. Ievadiet prefiksu manuāli vai pārbaudiet, vai integrācija ir konfigurēta.",name:"Nosaukums",show_header:"Rādīt galveni",show_status:"Rādīt statusu",show_profiles:"Rādīt profila izvēli",show_recipes:"Rādīt recepšu izvēli",show_freestyle:"Rādīt Freestyle recepti",show_sommelier:"Rādīt AI Sommelier",show_stats:"Rādīt tašu statistiku",show_maintenance:"Rādīt apkopi",show_settings:"Rādīt iestatījumus",compact:"Kompaktais režīms"}},ot={common:{brew:"Подготви",cancel:"Откажи",save:"Зачувај",confirm:"Потврди",start:"Старт",loading:"Вчитување...",retry:"Обиди се повторно",default_name:"Melitta Barista"},card:{no_device:"Не е пронајден уред Melitta Barista.",no_device_hint:"Проверете дали интеграцијата е инсталирана и конфигурирана.",machine_offline:"Апаратот е офлајн"},state:{ready:"Подготвен",brewing:"Подготовка",cleaning:"Чистење",descaling:"Отстранување на каменец",off:"Исклучен",busy:"Зафатен",filter_insert:"Вметнување филтер",filter_replace:"Замена на филтер",filter_remove:"Отстранување филтер",evaporating:"Испарување",idle:"Неактивен",unavailable:"Недостапен",unknown:"Непознато"},activity:{grinding:"Мелење",coffee:"Кафе",steam:"Пареа",water:"Вода",prepare:"Подготовка"},action:{none:"Нема",bu_removed:"Вметни ја единицата за варење",trays_missing:"Вметни ги садовите",empty_trays:"Испразни ги садовите",fill_water:"Наполни го резервоарот со вода",close_powder_lid:"Затвори го капакот за мелено кафе",fill_powder:"Додај мелено кафе",move_cup_to_frother:"Премести ја шолјата кај млечната прскалка",flush_required:"Потребно е плакнење"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Млеко",milk_froth:"Млечна пена",water:"Топла вода"},values:{very_mild:"Мн. благо",mild:"Благо",medium:"Средно",strong:"Јако",very_strong:"Мн. јако",extra_strong:"Екстра",cold:"Ладно",normal:"Нормално",high:"Високо",none:"Без",one:"1",two:"2",three:"3",coffee:"Кафе",milk:"Млеко",water:"Вода",standard:"Стд",intense:"Инт+"},directkey:{brew_drink:"Подготви {drink}",two_cups:"2x",two_cups_on:"2x ВКЛ."},recipes:{title:"Рецепт",all_recipes:"Сите рецепти"},freestyle:{title:"Freestyle",drink_name_placeholder:"Име на пијалакот",component:"Компонента {n}",process:"Процес",portion:"Порција",intensity:"Јачина",aroma:"Арома",temp:"Темп.",temperature:"Температура",shots:"Шотови",portion_value:"{value} мл",brew_named:"Подготви {name}"},sommelier:{title:"AI Sommelier",unavailable:"Сомелиерот не е достапен.",generating:"Генерирање...",surprise_me:"Изненади ме",error_generate:"Сомелиер: генерирањето рецепт не успеа",error_brew:"Сомелиер: подготовката не успеа",reasoning:"Зошто овој рецепт?",wizard_title:"Подготовка чекор по чекор",step_of:"Чекор {n} од {total}",done:"Готово",brew_phase:"Подготви фаза {n}/{total}",phase_running:"Фазата е стартувана — почекајте машината да заврши, потоа продолжете",finish:"Заврши",cancel:"Откажи",info:"Детали за рецептот",steps:"Чекори",err:{no_llm_agent:"Во Home Assistant не е инсталиран AI агент — додадете LLM интеграција за да го користите сомелиерот",no_llm_agent_selected:"Не е избран AI агент — изберете го во панелот на сомелиерот, картичка System",llm_agent_missing:"Избраниот AI агент исчезна — изберете друг во панелот на сомелиерот, картичка System"}},stats:{title:"Статистика",total_cups:"Вкупно шолји",unavailable:"Статистиката за шолји не е достапна.",empty:"Сè уште нема подготвени шолји"},maintenance:{title:"Одржување",groups:{cleaning:"Чистење и декалцинирање",filter:"Филтер за вода",other:"Друго"},actions:{easy_clean:{label:"Брзо чистење",desc:"Брзо плакнење на единицата за варење"},intensive_clean:{label:"Интензивно чистење",desc:"Длабинско чистење со таблета"},descaling:{label:"Декалцинирање",desc:"Отстранување на наслаги од каменец"},evaporating:{label:"Испарување",desc:"Продувување на парниот систем"},filter_insert:{label:"Вметни филтер",desc:"Започни користење нов филтер за вода"},filter_replace:{label:"Замени филтер",desc:"Замени го тековниот филтер за вода"},filter_remove:{label:"Отстрани филтер",desc:"Прекини користење на филтерот за вода"},switch_off:{label:"Исклучи",desc:"Исклучи го апаратот"}}},settings:{title:"Поставки",switches:{energy_saving:{label:"Заштеда на енергија",desc:"Намалена потрошувачка во мирување"},auto_bean_select:{label:"Автоматски избор на зрна",desc:"Автоматски избор на садот за зрна"},rinsing_disabled:{label:"Плакнење исклучено",desc:"Прескокни автоматско плакнење"}},numbers:{water_hardness:{label:"Тврдост на водата",desc:"Калибрација според типот на вода"},auto_off_after:{label:"Автоматско исклучување",desc:"Минути до исклучување"},brew_temperature:{label:"Температура на подготовка",desc:"Температура на водата за подготовка"}},levels:{water_hardness:{1:"Мека",2:"Средна",3:"Тврда",4:"Многу тврда"},brew_temperature:{0:"Ниска",1:"Нормална",2:"Висока"}},minutes:"{value} мин"},edit_dialog:{title:"Уреди: {drink}"},editor:{device:"Уред",enter_manually:"Внеси рачно...",entity_prefix:"Префикс на ентитети",entity_prefix_placeholder:"Автоматски се открива ако интеграцијата работи",no_devices_hint:"Не се пронајдени уреди Melitta. Внесете префикс рачно или проверете дали интеграцијата е конфигурирана.",name:"Име",show_header:"Прикажи заглавие",show_status:"Прикажи статус",show_profiles:"Прикажи избор на профил",show_recipes:"Прикажи избор на рецепт",show_freestyle:"Прикажи Freestyle рецепт",show_sommelier:"Прикажи AI Sommelier",show_stats:"Прикажи статистика за шолји",show_maintenance:"Прикажи одржување",show_settings:"Прикажи поставки",compact:"Компактен режим"}};const lt={bg:Ue,bs:qe,cs:Ze,da:We,de:Ge,el:Ye,en:Xe,es:Je,et:Qe,fi:et,fr:tt,hr:at,hu:it,it:rt,lt:nt,lv:st,mk:ot,nb:{common:{brew:"Brygg",cancel:"Avbryt",save:"Lagre",confirm:"Bekreft",start:"Start",loading:"Laster...",retry:"Prøv igjen",default_name:"Melitta Barista"},card:{no_device:"Ingen Melitta Barista-enhet funnet.",no_device_hint:"Kontroller at integrasjonen er installert og konfigurert.",machine_offline:"Maskinen er offline"},state:{ready:"Klar",brewing:"Brygger",cleaning:"Rengjøring",descaling:"Avkalking",off:"Av",busy:"Opptatt",filter_insert:"Setter inn filter",filter_replace:"Bytter filter",filter_remove:"Fjerner filter",evaporating:"Fordamping",idle:"Inaktiv",unavailable:"Utilgjengelig",unknown:"Ukjent"},activity:{grinding:"Maler",coffee:"Kaffe",steam:"Damp",water:"Vann",prepare:"Forbereder"},action:{none:"Ingen",bu_removed:"Sett inn bryggeenheten",trays_missing:"Sett inn skuffene",empty_trays:"Tøm skuffene",fill_water:"Fyll vanntanken",close_powder_lid:"Lukk lokket for malt kaffe",fill_powder:"Fyll på malt kaffe",move_cup_to_frother:"Flytt koppen til melkeskummeren",flush_required:"Skylling kreves"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Melk",milk_froth:"Melkeskum",water:"Varmt vann"},values:{very_mild:"S.Mild",mild:"Mild",medium:"Med",strong:"Sterk",very_strong:"S.Sterk",extra_strong:"X.Sterk",cold:"Kald",normal:"Normal",high:"Høy",none:"Ingen",one:"1",two:"2",three:"3",coffee:"Kaffe",milk:"Melk",water:"Vann",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Brygg {drink}",two_cups:"2x",two_cups_on:"2x PÅ"},recipes:{title:"Oppskrift",all_recipes:"Alle oppskrifter"},freestyle:{title:"Freestyle",drink_name_placeholder:"Navn på drikk",component:"Komponent {n}",process:"Prosess",portion:"Porsjon",intensity:"Intensitet",aroma:"Aroma",temp:"Temp",temperature:"Temperatur",shots:"Shots",portion_value:"{value} ml",brew_named:"Brygg {name}"},sommelier:{title:"AI-sommelier",unavailable:"Sommelier er ikke tilgjengelig.",generating:"Genererer...",surprise_me:"Overrask meg",error_generate:"Sommelier: oppskriftsgenerering mislyktes",error_brew:"Sommelier: brygging mislyktes",reasoning:"Hvorfor denne oppskriften?",wizard_title:"Trinnvis brygging",step_of:"Trinn {n} av {total}",done:"Ferdig",brew_phase:"Brygg fase {n}/{total}",phase_running:"Fasen er startet — la maskinen bli ferdig, og fortsett deretter",finish:"Fullfør",cancel:"Avbryt",info:"Oppskriftsdetaljer",steps:"Trinn",err:{no_llm_agent:"Ingen AI-agent er installert i Home Assistant — legg til en LLM-integrasjon for å bruke sommelieren",no_llm_agent_selected:"Ingen AI-agent er valgt — velg en i sommelier-panelet, under fanen System",llm_agent_missing:"Den valgte AI-agenten finnes ikke lenger — velg en annen i sommelier-panelet, under fanen System"}},stats:{title:"Statistikk",total_cups:"Kopper totalt",unavailable:"Koppstatistikk er ikke tilgjengelig.",empty:"Ingen kopper brygget ennå"},maintenance:{title:"Vedlikehold",groups:{cleaning:"Rengjøring og avkalking",filter:"Vannfilter",other:"Annet"},actions:{easy_clean:{label:"Hurtigrengjøring",desc:"Rask skylling av bryggeenheten"},intensive_clean:{label:"Intensiv rengjøring",desc:"Grundig rengjøring med tablett"},descaling:{label:"Avkalking",desc:"Fjern kalkavleiringer"},evaporating:{label:"Fordamping",desc:"Tøm dampsystemet"},filter_insert:{label:"Sett inn filter",desc:"Begynn å bruke et nytt vannfilter"},filter_replace:{label:"Bytt filter",desc:"Bytt ut det nåværende vannfilteret"},filter_remove:{label:"Fjern filter",desc:"Slutt å bruke vannfilteret"},switch_off:{label:"Slå av",desc:"Slå av maskinen"}}},settings:{title:"Innstillinger",switches:{energy_saving:{label:"Energisparing",desc:"Reduser effekten ved inaktivitet"},auto_bean_select:{label:"Auto bønnevalg",desc:"Velg bønnebeholder automatisk"},rinsing_disabled:{label:"Skylling deaktivert",desc:"Hopp over automatisk skylling"}},numbers:{water_hardness:{label:"Vannhardhet",desc:"Kalibrer for vanntypen"},auto_off_after:{label:"Auto av",desc:"Minutter til avslåing"},brew_temperature:{label:"Bryggetemperatur",desc:"Bryggevannets temperatur"}},levels:{water_hardness:{1:"Bløtt",2:"Middels",3:"Hardt",4:"Svært hardt"},brew_temperature:{0:"Lav",1:"Normal",2:"Høy"}},minutes:"{value} min"},edit_dialog:{title:"Rediger: {drink}"},editor:{device:"Enhet",enter_manually:"Angi manuelt...",entity_prefix:"Entitetsprefiks",entity_prefix_placeholder:"Oppdages automatisk hvis integrasjonen kjører",no_devices_hint:"Ingen Melitta-enheter funnet. Angi prefikset manuelt, eller kontroller at integrasjonen er konfigurert.",name:"Navn",show_header:"Vis overskrift",show_status:"Vis status",show_profiles:"Vis profilvelger",show_recipes:"Vis oppskriftsvelger",show_freestyle:"Vis Freestyle-oppskrift",show_sommelier:"Vis AI-sommelier",show_stats:"Vis koppstatistikk",show_maintenance:"Vis vedlikehold",show_settings:"Vis innstillinger",compact:"Kompakt modus"}},nl:{common:{brew:"Zetten",cancel:"Annuleren",save:"Opslaan",confirm:"Bevestigen",start:"Starten",loading:"Laden...",retry:"Opnieuw",default_name:"Melitta Barista"},card:{no_device:"Geen Melitta Barista-apparaat gevonden.",no_device_hint:"Controleer of de integratie is geïnstalleerd en geconfigureerd.",machine_offline:"Machine offline"},state:{ready:"Gereed",brewing:"Zetten",cleaning:"Reiniging",descaling:"Ontkalking",off:"Uit",busy:"Bezig",filter_insert:"Filter plaatsen",filter_replace:"Filter vervangen",filter_remove:"Filter verwijderen",evaporating:"Verdampen",idle:"Inactief",unavailable:"Niet beschikbaar",unknown:"Onbekend"},activity:{grinding:"Malen",coffee:"Koffie",steam:"Stoom",water:"Water",prepare:"Voorbereiden"},action:{none:"Geen",bu_removed:"Plaats de zetgroep",trays_missing:"Plaats de bakjes",empty_trays:"Leeg de bakjes",fill_water:"Vul het waterreservoir",close_powder_lid:"Sluit het deksel voor gemalen koffie",fill_powder:"Vul gemalen koffie bij",move_cup_to_frother:"Zet het kopje bij de melkschuimer",flush_required:"Spoelen vereist"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Melk",milk_froth:"Melkschuim",water:"Heet water"},values:{very_mild:"Z.Mild",mild:"Mild",medium:"Med",strong:"Sterk",very_strong:"Z.Sterk",extra_strong:"X.Sterk",cold:"Koud",normal:"Normaal",high:"Hoog",none:"Geen",one:"1",two:"2",three:"3",coffee:"Koffie",milk:"Melk",water:"Water",standard:"Std",intense:"Int+"},directkey:{brew_drink:"{drink} zetten",two_cups:"2x",two_cups_on:"2x AAN"},recipes:{title:"Recept",all_recipes:"Alle recepten"},freestyle:{title:"Freestyle",drink_name_placeholder:"Naam van drank",component:"Component {n}",process:"Proces",portion:"Portie",intensity:"Intensiteit",aroma:"Aroma",temp:"Temp",temperature:"Temperatuur",shots:"Shots",portion_value:"{value} ml",brew_named:"{name} zetten"},sommelier:{title:"AI-sommelier",unavailable:"Sommelier is niet beschikbaar.",generating:"Genereren...",surprise_me:"Verras me",error_generate:"Sommelier: recept genereren mislukt",error_brew:"Sommelier: zetten mislukt",reasoning:"Waarom dit recept?",wizard_title:"Stap voor stap zetten",step_of:"Stap {n} van {total}",done:"Klaar",brew_phase:"Fase {n}/{total} zetten",phase_running:"Fase gestart — laat de machine de fase afronden en ga daarna verder",finish:"Voltooien",cancel:"Annuleren",info:"Receptdetails",steps:"Stappen",err:{no_llm_agent:"Er is geen AI-agent geïnstalleerd in Home Assistant — voeg een LLM-integratie toe om de sommelier te gebruiken",no_llm_agent_selected:"Geen AI-agent geselecteerd — kies er een in het sommelier-paneel, tabblad System",llm_agent_missing:"De geselecteerde AI-agent bestaat niet meer — kies een andere in het sommelier-paneel, tabblad System"}},stats:{title:"Statistieken",total_cups:"Totaal kopjes",unavailable:"Kopjesstatistieken niet beschikbaar.",empty:"Nog geen kopjes gezet"},maintenance:{title:"Onderhoud",groups:{cleaning:"Reiniging & ontkalking",filter:"Waterfilter",other:"Overig"},actions:{easy_clean:{label:"Snelle reiniging",desc:"Snelle spoeling van de zetgroep"},intensive_clean:{label:"Intensieve reiniging",desc:"Grondige reiniging met tablet"},descaling:{label:"Ontkalking",desc:"Kalkaanslag verwijderen"},evaporating:{label:"Verdampen",desc:"Stoomsysteem doorspoelen"},filter_insert:{label:"Filter plaatsen",desc:"Nieuw waterfilter in gebruik nemen"},filter_replace:{label:"Filter vervangen",desc:"Huidig waterfilter vervangen"},filter_remove:{label:"Filter verwijderen",desc:"Waterfilter niet meer gebruiken"},switch_off:{label:"Uitschakelen",desc:"Machine uitschakelen"}}},settings:{title:"Instellingen",switches:{energy_saving:{label:"Energiebesparing",desc:"Minder verbruik bij inactiviteit"},auto_bean_select:{label:"Auto bonenselectie",desc:"Bonenreservoir automatisch kiezen"},rinsing_disabled:{label:"Spoeling uitgeschakeld",desc:"Automatische spoeling overslaan"}},numbers:{water_hardness:{label:"Waterhardheid",desc:"Kalibreren voor watertype"},auto_off_after:{label:"Auto uit",desc:"Minuten tot uitschakeling"},brew_temperature:{label:"Zettemperatuur",desc:"Temperatuur van het zetwater"}},levels:{water_hardness:{1:"Zacht",2:"Gemiddeld",3:"Hard",4:"Zeer hard"},brew_temperature:{0:"Laag",1:"Normaal",2:"Hoog"}},minutes:"{value} min"},edit_dialog:{title:"Bewerken: {drink}"},editor:{device:"Apparaat",enter_manually:"Handmatig invoeren...",entity_prefix:"Entiteitsprefix",entity_prefix_placeholder:"Automatisch gedetecteerd als de integratie actief is",no_devices_hint:"Geen Melitta-apparaten gevonden. Voer de prefix handmatig in of controleer of de integratie is geconfigureerd.",name:"Naam",show_header:"Koptekst tonen",show_status:"Status tonen",show_profiles:"Profielkiezer tonen",show_recipes:"Receptkiezer tonen",show_freestyle:"Freestyle-recept tonen",show_sommelier:"AI-sommelier tonen",show_stats:"Kopjesstatistieken tonen",show_maintenance:"Onderhoud tonen",show_settings:"Instellingen tonen",compact:"Compacte modus"}},pl:{common:{brew:"Zaparz",cancel:"Anuluj",save:"Zapisz",confirm:"Potwierdź",start:"Start",loading:"Ładowanie...",retry:"Ponów",default_name:"Melitta Barista"},card:{no_device:"Nie znaleziono ekspresu Melitta Barista.",no_device_hint:"Upewnij się, że integracja jest zainstalowana i skonfigurowana.",machine_offline:"Ekspres offline"},state:{ready:"Gotowy",brewing:"Parzenie",cleaning:"Czyszczenie",descaling:"Odkamienianie",off:"Wyłączony",busy:"Zajęty",filter_insert:"Zakładanie filtra",filter_replace:"Wymiana filtra",filter_remove:"Usuwanie filtra",evaporating:"Odparowywanie",idle:"Bezczynny",unavailable:"Niedostępny",unknown:"Nieznany"},activity:{grinding:"Mielenie",coffee:"Kawa",steam:"Para",water:"Woda",prepare:"Przygotowanie"},action:{none:"Brak",bu_removed:"Włóż blok zaparzający",trays_missing:"Włóż tacki",empty_trays:"Opróżnij tacki",fill_water:"Napełnij zbiornik wody",close_powder_lid:"Zamknij pokrywę kawy mielonej",fill_powder:"Dodaj kawę mieloną",move_cup_to_frother:"Przesuń filiżankę pod spieniacz",flush_required:"Wymagane płukanie"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mleko",milk_froth:"Pianka mleczna",water:"Gorąca woda"},values:{very_mild:"B.łag.",mild:"Łagodna",medium:"Średnia",strong:"Mocna",very_strong:"B.mocna",extra_strong:"Ekstra",cold:"Zimna",normal:"Norm.",high:"Wysoka",none:"Brak",one:"1",two:"2",three:"3",coffee:"Kawa",milk:"Mleko",water:"Woda",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Zaparz: {drink}",two_cups:"2x",two_cups_on:"2x WŁ"},recipes:{title:"Przepis",all_recipes:"Wszystkie przepisy"},freestyle:{title:"Freestyle",drink_name_placeholder:"Nazwa napoju",component:"Składnik {n}",process:"Proces",portion:"Porcja",intensity:"Moc",aroma:"Aromat",temp:"Temp.",temperature:"Temperatura",shots:"Shoty",portion_value:"{value} ml",brew_named:"Zaparz {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier jest niedostępny.",generating:"Generowanie...",surprise_me:"Zaskocz mnie",error_generate:"Sommelier: nie udało się wygenerować przepisu",error_brew:"Sommelier: nie udało się rozpocząć parzenia",reasoning:"Dlaczego ten przepis?",wizard_title:"Parzenie krok po kroku",step_of:"Krok {n} z {total}",done:"Gotowe",brew_phase:"Zaparz fazę {n}/{total}",phase_running:"Faza rozpoczęta — poczekaj, aż ekspres skończy, potem kontynuuj",finish:"Zakończ",cancel:"Anuluj",info:"Szczegóły przepisu",steps:"Kroki",err:{no_llm_agent:"W Home Assistant nie zainstalowano agenta AI — dodaj integrację LLM, aby korzystać z sommeliera",no_llm_agent_selected:"Nie wybrano agenta AI — wybierz go w panelu sommeliera, zakładka System",llm_agent_missing:"Wybrany agent AI zniknął — wybierz innego w panelu sommeliera, zakładka System"}},stats:{title:"Statystyki",total_cups:"Łącznie filiżanek",unavailable:"Statystyki filiżanek są niedostępne.",empty:"Brak zaparzonych filiżanek"},maintenance:{title:"Konserwacja",groups:{cleaning:"Czyszczenie i odkamienianie",filter:"Filtr wody",other:"Inne"},actions:{easy_clean:{label:"Szybkie czyszczenie",desc:"Szybkie płukanie bloku parzącego"},intensive_clean:{label:"Intensywne czyszczenie",desc:"Głębokie czyszczenie z tabletką"},descaling:{label:"Odkamienianie",desc:"Usuwanie osadów kamienia"},evaporating:{label:"Odparowywanie",desc:"Przedmuchanie układu pary"},filter_insert:{label:"Włóż filtr",desc:"Rozpocznij używanie nowego filtra wody"},filter_replace:{label:"Wymień filtr",desc:"Wymień bieżący filtr wody"},filter_remove:{label:"Usuń filtr",desc:"Przestań używać filtra wody"},switch_off:{label:"Wyłącz",desc:"Wyłącz ekspres"}}},settings:{title:"Ustawienia",switches:{energy_saving:{label:"Oszczędzanie energii",desc:"Ogranicz pobór mocy w spoczynku"},auto_bean_select:{label:"Automatyczny wybór ziaren",desc:"Automatyczny wybór pojemnika na ziarna"},rinsing_disabled:{label:"Płukanie wyłączone",desc:"Pomiń automatyczne płukanie"}},numbers:{water_hardness:{label:"Twardość wody",desc:"Kalibracja pod rodzaj wody"},auto_off_after:{label:"Automatyczne wyłączenie",desc:"Minuty do wyłączenia"},brew_temperature:{label:"Temperatura parzenia",desc:"Temperatura wody parzenia"}},levels:{water_hardness:{1:"Miękka",2:"Średnia",3:"Twarda",4:"Bardzo twarda"},brew_temperature:{0:"Niska",1:"Normalna",2:"Wysoka"}},minutes:"{value} min"},edit_dialog:{title:"Edytuj: {drink}"},editor:{device:"Urządzenie",enter_manually:"Wprowadź ręcznie...",entity_prefix:"Prefiks encji",entity_prefix_placeholder:"Wykrywany automatycznie, jeśli integracja działa",no_devices_hint:"Nie wykryto urządzeń Melitta. Wprowadź prefiks ręcznie lub sprawdź, czy integracja jest skonfigurowana.",name:"Nazwa",show_header:"Pokaż nagłówek",show_status:"Pokaż status",show_profiles:"Pokaż wybór profilu",show_recipes:"Pokaż wybór przepisu",show_freestyle:"Pokaż Freestyle",show_sommelier:"Pokaż AI Sommelier",show_stats:"Pokaż statystyki filiżanek",show_maintenance:"Pokaż konserwację",show_settings:"Pokaż ustawienia",compact:"Tryb kompaktowy"}},pt:{common:{brew:"Preparar",cancel:"Cancelar",save:"Guardar",confirm:"Confirmar",start:"Iniciar",loading:"A carregar...",retry:"Tentar novamente",default_name:"Melitta Barista"},card:{no_device:"Nenhum dispositivo Melitta Barista encontrado.",no_device_hint:"Certifique-se de que a integração está instalada e configurada.",machine_offline:"Máquina offline"},state:{ready:"Pronto",brewing:"Preparando",cleaning:"Limpeza",descaling:"Descalcificação",off:"Desligado",busy:"Ocupado",filter_insert:"A inserir filtro",filter_replace:"A substituir filtro",filter_remove:"A remover filtro",evaporating:"Evaporação",idle:"Inativo",unavailable:"Indisponível",unknown:"Desconhecido"},activity:{grinding:"A moer",coffee:"Café",steam:"Vapor",water:"Água",prepare:"A preparar"},action:{none:"Nenhuma",bu_removed:"Insira o grupo de infusão",trays_missing:"Insira as bandejas",empty_trays:"Esvazie as bandejas",fill_water:"Encha o depósito de água",close_powder_lid:"Feche a tampa do café moído",fill_powder:"Adicione café moído",move_cup_to_frother:"Aproxime a chávena do bocal de leite",flush_required:"Enxaguamento necessário"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Leite",milk_froth:"Espuma de leite",water:"Água quente"},values:{very_mild:"M.Suave",mild:"Suave",medium:"Médio",strong:"Forte",very_strong:"M.Forte",extra_strong:"X.Forte",cold:"Frio",normal:"Normal",high:"Alto",none:"Nenhum",one:"1",two:"2",three:"3",coffee:"Café",milk:"Leite",water:"Água",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Preparar {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Receita",all_recipes:"Todas as receitas"},freestyle:{title:"Freestyle",drink_name_placeholder:"Nome da bebida",component:"Componente {n}",process:"Processo",portion:"Porção",intensity:"Intensidade",aroma:"Aroma",temp:"Temp.",temperature:"Temperatura",shots:"Shots",portion_value:"{value} ml",brew_named:"Preparar {name}"},sommelier:{title:"Sommelier IA",unavailable:"O sommelier não está disponível.",generating:"A gerar...",surprise_me:"Surpreende-me",error_generate:"Sommelier: falha ao gerar a receita",error_brew:"Sommelier: falha na preparação",reasoning:"Porquê esta receita?",wizard_title:"Preparação passo a passo",step_of:"Passo {n} de {total}",done:"Concluído",brew_phase:"Preparar fase {n}/{total}",phase_running:"Fase iniciada — deixe a máquina terminar e depois continue",finish:"Terminar",cancel:"Cancelar",info:"Detalhes da receita",steps:"Passos",err:{no_llm_agent:"Não há nenhum agente de IA instalado no Home Assistant — adicione uma integração LLM para usar o sommelier",no_llm_agent_selected:"Nenhum agente de IA selecionado — escolha um no painel do sommelier, separador System",llm_agent_missing:"O agente de IA selecionado já não existe — escolha outro no painel do sommelier, separador System"}},stats:{title:"Estatísticas",total_cups:"Total de chávenas",unavailable:"Estatísticas de chávenas não disponíveis.",empty:"Ainda não foram preparadas chávenas"},maintenance:{title:"Manutenção",groups:{cleaning:"Limpeza e descalcificação",filter:"Filtro de água",other:"Outros"},actions:{easy_clean:{label:"Limpeza rápida",desc:"Enxaguamento rápido da unidade de infusão"},intensive_clean:{label:"Limpeza intensiva",desc:"Limpeza profunda com pastilha"},descaling:{label:"Descalcificação",desc:"Remover depósitos de calcário"},evaporating:{label:"Evaporação",desc:"Purgar o sistema de vapor"},filter_insert:{label:"Inserir filtro",desc:"Começar a usar um novo filtro de água"},filter_replace:{label:"Substituir filtro",desc:"Substituir o filtro de água atual"},filter_remove:{label:"Remover filtro",desc:"Deixar de usar o filtro de água"},switch_off:{label:"Desligar",desc:"Desligar a máquina"}}},settings:{title:"Definições",switches:{energy_saving:{label:"Poupança de energia",desc:"Reduzir o consumo em repouso"},auto_bean_select:{label:"Seleção auto de grãos",desc:"Escolher automaticamente o depósito de grãos"},rinsing_disabled:{label:"Enxaguamento desativado",desc:"Ignorar o ciclo de enxaguamento automático"}},numbers:{water_hardness:{label:"Dureza da água",desc:"Calibrar para o tipo de água"},auto_off_after:{label:"Desligar auto",desc:"Minutos até desligar"},brew_temperature:{label:"Temperatura de infusão",desc:"Temperatura da água de infusão"}},levels:{water_hardness:{1:"Macia",2:"Média",3:"Dura",4:"Muito dura"},brew_temperature:{0:"Baixa",1:"Normal",2:"Alta"}},minutes:"{value} min"},edit_dialog:{title:"Editar: {drink}"},editor:{device:"Dispositivo",enter_manually:"Introduzir manualmente...",entity_prefix:"Prefixo de entidade",entity_prefix_placeholder:"Detetado automaticamente se a integração estiver em execução",no_devices_hint:"Nenhum dispositivo Melitta detetado. Introduza o prefixo manualmente ou verifique se a integração está configurada.",name:"Nome",show_header:"Mostrar cabeçalho",show_status:"Mostrar estado",show_profiles:"Mostrar seletor de perfil",show_recipes:"Mostrar seletor de receitas",show_freestyle:"Mostrar receita Freestyle",show_sommelier:"Mostrar Sommelier IA",show_stats:"Mostrar estatísticas de chávenas",show_maintenance:"Mostrar manutenção",show_settings:"Mostrar definições",compact:"Modo compacto"}},ro:{common:{brew:"Prepară",cancel:"Anulare",save:"Salvează",confirm:"Confirmă",start:"Pornește",loading:"Se încarcă...",retry:"Reîncearcă",default_name:"Melitta Barista"},card:{no_device:"Nu s-a găsit niciun dispozitiv Melitta Barista.",no_device_hint:"Asigurați-vă că integrarea este instalată și configurată.",machine_offline:"Aparat offline"},state:{ready:"Pregătit",brewing:"Preparare",cleaning:"Curățare",descaling:"Decalcifiere",off:"Oprit",busy:"Ocupat",filter_insert:"Inserare filtru",filter_replace:"Înlocuire filtru",filter_remove:"Eliminare filtru",evaporating:"Evaporare",idle:"Inactiv",unavailable:"Indisponibil",unknown:"Necunoscut"},activity:{grinding:"Măcinare",coffee:"Cafea",steam:"Abur",water:"Apă",prepare:"Pregătire"},action:{none:"Niciuna",bu_removed:"Introdu unitatea de infuzare",trays_missing:"Introdu tăvile",empty_trays:"Golește tăvile",fill_water:"Umple rezervorul de apă",close_powder_lid:"Închide capacul pentru cafea măcinată",fill_powder:"Adaugă cafea măcinată",move_cup_to_frother:"Mută ceașca la duza de lapte",flush_required:"Clătire necesară"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Lapte",milk_froth:"Spumă de lapte",water:"Apă fierbinte"},values:{very_mild:"F.Slabă",mild:"Slabă",medium:"Medie",strong:"Tare",very_strong:"F.Tare",extra_strong:"X.Tare",cold:"Rece",normal:"Normal",high:"Ridicat",none:"Fără",one:"1",two:"2",three:"3",coffee:"Cafea",milk:"Lapte",water:"Apă",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Prepară {drink}",two_cups:"2x",two_cups_on:"2x ON"},recipes:{title:"Rețetă",all_recipes:"Toate rețetele"},freestyle:{title:"Freestyle",drink_name_placeholder:"Numele băuturii",component:"Componentă {n}",process:"Proces",portion:"Porție",intensity:"Intensitate",aroma:"Aromă",temp:"Temp.",temperature:"Temperatură",shots:"Doze",portion_value:"{value} ml",brew_named:"Prepară {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelierul nu este disponibil.",generating:"Se generează...",surprise_me:"Surprinde-mă",error_generate:"Sommelier: generarea rețetei a eșuat",error_brew:"Sommelier: prepararea a eșuat",reasoning:"De ce această rețetă?",wizard_title:"Preparare pas cu pas",step_of:"Pasul {n} din {total}",done:"Gata",brew_phase:"Prepară faza {n}/{total}",phase_running:"Faza a început — lăsați aparatul să termine, apoi continuați",finish:"Finalizare",cancel:"Anulare",info:"Detaliile rețetei",steps:"Pași",err:{no_llm_agent:"Niciun agent AI nu este instalat în Home Assistant — adăugați o integrare LLM pentru a folosi sommelierul",no_llm_agent_selected:"Niciun agent AI selectat — alegeți unul în panoul sommelierului, fila System",llm_agent_missing:"Agentul AI selectat nu mai există — alegeți altul în panoul sommelierului, fila System"}},stats:{title:"Statistici",total_cups:"Total cești",unavailable:"Statisticile ceștilor nu sunt disponibile.",empty:"Nicio ceașcă preparată încă"},maintenance:{title:"Întreținere",groups:{cleaning:"Curățare și decalcifiere",filter:"Filtru de apă",other:"Altele"},actions:{easy_clean:{label:"Curățare rapidă",desc:"Clătire rapidă a unității de preparare"},intensive_clean:{label:"Curățare intensivă",desc:"Curățare profundă cu tabletă"},descaling:{label:"Decalcifiere",desc:"Îndepărtarea depunerilor de calcar"},evaporating:{label:"Evaporare",desc:"Golirea sistemului de abur"},filter_insert:{label:"Inserare filtru",desc:"Începeți utilizarea unui filtru de apă nou"},filter_replace:{label:"Înlocuire filtru",desc:"Înlocuiți filtrul de apă actual"},filter_remove:{label:"Eliminare filtru",desc:"Opriți utilizarea filtrului de apă"},switch_off:{label:"Oprire",desc:"Opriți aparatul"}}},settings:{title:"Setări",switches:{energy_saving:{label:"Economie energie",desc:"Reduce consumul în repaus"},auto_bean_select:{label:"Selectare automată boabe",desc:"Alegere automată a recipientului de boabe"},rinsing_disabled:{label:"Clătire dezactivată",desc:"Omite ciclul de clătire automată"}},numbers:{water_hardness:{label:"Duritate apă",desc:"Calibrare pentru tipul de apă"},auto_off_after:{label:"Oprire automată",desc:"Minute până la oprire"},brew_temperature:{label:"Temperatură preparare",desc:"Temperatura apei de preparare"}},levels:{water_hardness:{1:"Moale",2:"Medie",3:"Dură",4:"Foarte dură"},brew_temperature:{0:"Scăzută",1:"Normală",2:"Ridicată"}},minutes:"{value} min"},edit_dialog:{title:"Editare: {drink}"},editor:{device:"Dispozitiv",enter_manually:"Introduceți manual...",entity_prefix:"Prefix entitate",entity_prefix_placeholder:"Detectat automat dacă integrarea rulează",no_devices_hint:"Nu au fost detectate dispozitive Melitta. Introduceți prefixul manual sau verificați dacă integrarea este configurată.",name:"Nume",show_header:"Afișează antetul",show_status:"Afișează starea",show_profiles:"Afișează selectorul de profil",show_recipes:"Afișează selectorul de rețete",show_freestyle:"Afișează rețeta Freestyle",show_sommelier:"Afișează AI Sommelier",show_stats:"Afișează statisticile ceștilor",show_maintenance:"Afișează întreținerea",show_settings:"Afișează setările",compact:"Mod compact"}},ru:{common:{brew:"Приготовить",cancel:"Отмена",save:"Сохранить",confirm:"Подтвердить",start:"Старт",loading:"Загрузка...",retry:"Повторить",default_name:"Melitta Barista"},card:{no_device:"Кофемашина Melitta Barista не найдена.",no_device_hint:"Убедитесь, что интеграция установлена и настроена.",machine_offline:"Машина не в сети"},state:{ready:"Готова",brewing:"Готовит",cleaning:"Очистка",descaling:"Декальцинация",off:"Выключена",busy:"Занята",filter_insert:"Установка фильтра",filter_replace:"Замена фильтра",filter_remove:"Извлечение фильтра",evaporating:"Выпаривание",idle:"Ожидание",unavailable:"Недоступна",unknown:"Неизвестно"},activity:{grinding:"Помол",coffee:"Кофе",steam:"Пар",water:"Вода",prepare:"Подготовка"},action:{none:"Нет",bu_removed:"Установите заварочный блок",trays_missing:"Установите поддоны",empty_trays:"Опорожните поддоны",fill_water:"Наполните резервуар для воды",close_powder_lid:"Закройте крышку для молотого кофе",fill_powder:"Добавьте молотый кофе",move_cup_to_frother:"Подставьте чашку к капучинатору",flush_required:"Требуется промывка"},drinks:{espresso:"Эспрессо",cafe_creme:"Кафе крем",cappuccino:"Капучино",latte_macchiato:"Латте макиато",milk:"Молоко",milk_froth:"Молочная пена",water:"Горячая вода"},values:{very_mild:"Оч. мягк.",mild:"Мягкий",medium:"Средн.",strong:"Крепкий",very_strong:"Оч. креп.",extra_strong:"Экстра",cold:"Холод.",normal:"Норм.",high:"Выс.",none:"Нет",one:"1",two:"2",three:"3",coffee:"Кофе",milk:"Молоко",water:"Вода",standard:"Стд",intense:"Инт+"},directkey:{brew_drink:"Готовить: {drink}",two_cups:"2x",two_cups_on:"2x ВКЛ"},recipes:{title:"Рецепт",all_recipes:"Все рецепты"},freestyle:{title:"Freestyle",drink_name_placeholder:"Название напитка",component:"Компонент {n}",process:"Процесс",portion:"Порция",intensity:"Крепость",aroma:"Аромат",temp:"Темп.",temperature:"Температура",shots:"Шоты",portion_value:"{value} мл",brew_named:"Готовить {name}"},sommelier:{title:"AI Сомелье",unavailable:"Сомелье недоступен.",generating:"Генерация...",surprise_me:"Удиви меня",error_generate:"Сомелье: не удалось сгенерировать рецепт",error_brew:"Сомелье: не удалось запустить приготовление",reasoning:"Почему этот рецепт?",wizard_title:"Пошаговое приготовление",step_of:"Шаг {n} из {total}",done:"Готово",brew_phase:"Варить фазу {n}/{total}",phase_running:"Фаза запущена — дождитесь окончания и продолжайте",finish:"Завершить",cancel:"Отмена",info:"Описание рецепта",steps:"Шаги",err:{no_llm_agent:"В Home Assistant не установлен AI-агент — добавьте LLM-интеграцию, чтобы пользоваться сомелье",no_llm_agent_selected:"AI-агент не выбран — укажите его в панели сомелье, вкладка System",llm_agent_missing:"Выбранный AI-агент исчез — выберите другой в панели сомелье, вкладка System"}},stats:{title:"Статистика",total_cups:"Всего чашек",unavailable:"Статистика чашек недоступна.",empty:"Ещё нет приготовленных чашек"},maintenance:{title:"Обслуживание",groups:{cleaning:"Очистка и декальцинация",filter:"Фильтр воды",other:"Прочее"},actions:{easy_clean:{label:"Easy Clean",desc:"Быстрая промывка заварного блока"},intensive_clean:{label:"Интенсивная очистка",desc:"Глубокая очистка с таблеткой"},descaling:{label:"Декальцинация",desc:"Удаление известкового налёта"},evaporating:{label:"Выпаривание",desc:"Продувка паровой системы"},filter_insert:{label:"Установить фильтр",desc:"Начать использовать новый фильтр воды"},filter_replace:{label:"Заменить фильтр",desc:"Заменить текущий фильтр воды"},filter_remove:{label:"Убрать фильтр",desc:"Прекратить использование фильтра"},switch_off:{label:"Выключить",desc:"Выключить машину"}}},settings:{title:"Настройки",switches:{energy_saving:{label:"Энергосбережение",desc:"Экономия энергии в простое"},auto_bean_select:{label:"Автовыбор зёрен",desc:"Автовыбор бункера с зёрнами"},rinsing_disabled:{label:"Промывка отключена",desc:"Пропускать автопромывку"}},numbers:{water_hardness:{label:"Жёсткость воды",desc:"Калибровка под тип воды"},auto_off_after:{label:"Автовыключение",desc:"Минут до выключения"},brew_temperature:{label:"Температура",desc:"Температура воды при заваривании"}},levels:{water_hardness:{1:"Мягкая",2:"Средняя",3:"Жёсткая",4:"Очень жёсткая"},brew_temperature:{0:"Низкая",1:"Норм.",2:"Высокая"}},minutes:"{value} мин"},edit_dialog:{title:"Изменить: {drink}"},editor:{device:"Устройство",enter_manually:"Ввести вручную...",entity_prefix:"Префикс сущностей",entity_prefix_placeholder:"Определяется автоматически, если интеграция запущена",no_devices_hint:"Устройства Melitta не найдены. Введите префикс вручную или проверьте настройку интеграции.",name:"Название",show_header:"Показывать заголовок",show_status:"Показывать статус",show_profiles:"Показывать выбор профиля",show_recipes:"Показывать выбор рецепта",show_freestyle:"Показывать Freestyle",show_sommelier:"Показывать AI Сомелье",show_stats:"Показывать статистику чашек",show_maintenance:"Показывать обслуживание",show_settings:"Показывать настройки",compact:"Компактный режим"}},sk:{common:{brew:"Pripraviť",cancel:"Zrušiť",save:"Uložiť",confirm:"Potvrdiť",start:"Štart",loading:"Načítava sa...",retry:"Skúsiť znova",default_name:"Melitta Barista"},card:{no_device:"Kávovar Melitta Barista sa nenašiel.",no_device_hint:"Uistite sa, že je integrácia nainštalovaná a nakonfigurovaná.",machine_offline:"Kávovar offline"},state:{ready:"Pripravený",brewing:"Príprava",cleaning:"Čistenie",descaling:"Odvápňovanie",off:"Vypnuté",busy:"Zaneprázdnený",filter_insert:"Vkladanie filtra",filter_replace:"Výmena filtra",filter_remove:"Odoberanie filtra",evaporating:"Odparovanie",idle:"Nečinný",unavailable:"Nedostupný",unknown:"Neznámy"},activity:{grinding:"Mletie",coffee:"Káva",steam:"Para",water:"Voda",prepare:"Príprava"},action:{none:"Žiadne",bu_removed:"Vlož sparovaciu jednotku",trays_missing:"Vlož misky",empty_trays:"Vyprázdni misky",fill_water:"Doplň vodu do nádržky",close_powder_lid:"Zavri veko na mletú kávu",fill_powder:"Doplň mletú kávu",move_cup_to_frother:"Presuň šálku k napeňovaču",flush_required:"Potrebné prepláchnutie"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mlieko",milk_froth:"Mliečna pena",water:"Horúca voda"},values:{very_mild:"V.jemná",mild:"Jemná",medium:"Stredná",strong:"Silná",very_strong:"V.silná",extra_strong:"Extra",cold:"Studená",normal:"Norm.",high:"Vysoká",none:"Žiadna",one:"1",two:"2",three:"3",coffee:"Káva",milk:"Mlieko",water:"Voda",standard:"Štd",intense:"Int+"},directkey:{brew_drink:"Pripraviť: {drink}",two_cups:"2x",two_cups_on:"2x ZAP"},recipes:{title:"Recept",all_recipes:"Všetky recepty"},freestyle:{title:"Freestyle",drink_name_placeholder:"Názov nápoja",component:"Zložka {n}",process:"Proces",portion:"Porcia",intensity:"Sila",aroma:"Aróma",temp:"Tepl.",temperature:"Teplota",shots:"Shoty",portion_value:"{value} ml",brew_named:"Pripraviť {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier nie je dostupný.",generating:"Generovanie...",surprise_me:"Prekvap ma",error_generate:"Sommelier: generovanie receptu zlyhalo",error_brew:"Sommelier: prípravu sa nepodarilo spustiť",reasoning:"Prečo tento recept?",wizard_title:"Príprava krok za krokom",step_of:"Krok {n} z {total}",done:"Hotovo",brew_phase:"Pripraviť fázu {n}/{total}",phase_running:"Fáza sa spustila — nechajte kávovar dokončiť prácu a potom pokračujte",finish:"Dokončiť",cancel:"Zrušiť",info:"Podrobnosti receptu",steps:"Kroky",err:{no_llm_agent:"V Home Assistante nie je nainštalovaný žiadny AI agent — pridajte LLM integráciu, aby ste mohli sommeliera používať",no_llm_agent_selected:"Nie je vybraný žiadny AI agent — vyberte ho v paneli sommeliera na karte System",llm_agent_missing:"Vybraný AI agent už neexistuje — vyberte iného v paneli sommeliera na karte System"}},stats:{title:"Štatistiky",total_cups:"Celkom šálok",unavailable:"Štatistiky šálok nie sú dostupné.",empty:"Zatiaľ žiadne pripravené šálky"},maintenance:{title:"Údržba",groups:{cleaning:"Čistenie a odvápňovanie",filter:"Vodný filter",other:"Ostatné"},actions:{easy_clean:{label:"Rýchle čistenie",desc:"Rýchle prepláchnutie sparovacej jednotky"},intensive_clean:{label:"Intenzívne čistenie",desc:"Hĺbkové čistenie s tabletou"},descaling:{label:"Odvápnenie",desc:"Odstránenie vodného kameňa"},evaporating:{label:"Odparovanie",desc:"Prefúknutie parného systému"},filter_insert:{label:"Vložiť filter",desc:"Začať používať nový vodný filter"},filter_replace:{label:"Vymeniť filter",desc:"Vymeniť aktuálny vodný filter"},filter_remove:{label:"Odobrať filter",desc:"Prestať používať vodný filter"},switch_off:{label:"Vypnúť",desc:"Vypnúť kávovar"}}},settings:{title:"Nastavenia",switches:{energy_saving:{label:"Úspora energie",desc:"Znížiť spotrebu v nečinnosti"},auto_bean_select:{label:"Automatický výber zŕn",desc:"Automatická voľba zásobníka zŕn"},rinsing_disabled:{label:"Oplach vypnutý",desc:"Preskočiť automatický oplach"}},numbers:{water_hardness:{label:"Tvrdosť vody",desc:"Kalibrácia podľa typu vody"},auto_off_after:{label:"Automatické vypnutie",desc:"Minút do vypnutia"},brew_temperature:{label:"Teplota prípravy",desc:"Teplota vody pri príprave"}},levels:{water_hardness:{1:"Mäkká",2:"Stredná",3:"Tvrdá",4:"Veľmi tvrdá"},brew_temperature:{0:"Nízka",1:"Normálna",2:"Vysoká"}},minutes:"{value} min"},edit_dialog:{title:"Upraviť: {drink}"},editor:{device:"Zariadenie",enter_manually:"Zadať ručne...",entity_prefix:"Prefix entít",entity_prefix_placeholder:"Zistí sa automaticky, ak integrácia beží",no_devices_hint:"Nenašli sa žiadne zariadenia Melitta. Zadajte prefix ručne alebo skontrolujte, či je integrácia nakonfigurovaná.",name:"Názov",show_header:"Zobraziť hlavičku",show_status:"Zobraziť stav",show_profiles:"Zobraziť výber profilu",show_recipes:"Zobraziť výber receptu",show_freestyle:"Zobraziť Freestyle",show_sommelier:"Zobraziť AI Sommelier",show_stats:"Zobraziť štatistiky šálok",show_maintenance:"Zobraziť údržbu",show_settings:"Zobraziť nastavenia",compact:"Kompaktný režim"}},sl:{common:{brew:"Pripravi",cancel:"Prekliči",save:"Shrani",confirm:"Potrdi",start:"Start",loading:"Nalaganje...",retry:"Poskusi znova",default_name:"Melitta Barista"},card:{no_device:"Naprava Melitta Barista ni bila najdena.",no_device_hint:"Preverite, ali je integracija nameščena in konfigurirana.",machine_offline:"Aparat ni povezan"},state:{ready:"Pripravljen",brewing:"Priprava",cleaning:"Čiščenje",descaling:"Razapnjevanje",off:"Izklopljeno",busy:"Zaseden",filter_insert:"Vstavljanje filtra",filter_replace:"Menjava filtra",filter_remove:"Odstranjevanje filtra",evaporating:"Izhlapevanje",idle:"Nedejavno",unavailable:"Nedostopen",unknown:"Neznano"},activity:{grinding:"Mletje",coffee:"Kava",steam:"Para",water:"Voda",prepare:"Priprava"},action:{none:"Brez",bu_removed:"Vstavi kuhalno enoto",trays_missing:"Vstavi pladnje",empty_trays:"Izprazni pladnje",fill_water:"Napolni posodo za vodo",close_powder_lid:"Zapri pokrov za mleto kavo",fill_powder:"Dodaj mleto kavo",move_cup_to_frother:"Premakni skodelico k penilcu mleka",flush_required:"Potrebno izpiranje"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mleko",milk_froth:"Mlečna pena",water:"Vroča voda"},values:{very_mild:"Z. blaga",mild:"Blaga",medium:"Srednja",strong:"Močna",very_strong:"Z. močna",extra_strong:"Ekstra",cold:"Hladno",normal:"Običajno",high:"Visoko",none:"Brez",one:"1",two:"2",three:"3",coffee:"Kava",milk:"Mleko",water:"Voda",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Pripravi {drink}",two_cups:"2x",two_cups_on:"2x VKLOP"},recipes:{title:"Recept",all_recipes:"Vsi recepti"},freestyle:{title:"Freestyle",drink_name_placeholder:"Ime napitka",component:"Komponenta {n}",process:"Postopek",portion:"Porcija",intensity:"Jakost",aroma:"Aroma",temp:"Temp.",temperature:"Temperatura",shots:"Šoti",portion_value:"{value} ml",brew_named:"Pripravi {name}"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier ni na voljo.",generating:"Ustvarjanje...",surprise_me:"Preseneti me",error_generate:"Sommelier: ustvarjanje recepta ni uspelo",error_brew:"Sommelier: priprava ni uspela",reasoning:"Zakaj ta recept?",wizard_title:"Priprava korak za korakom",step_of:"Korak {n} od {total}",done:"Končano",brew_phase:"Pripravi fazo {n}/{total}",phase_running:"Faza se je začela — počakajte, da aparat konča, nato nadaljujte",finish:"Dokončaj",cancel:"Prekliči",info:"Podrobnosti recepta",steps:"Koraki",err:{no_llm_agent:"V Home Assistantu ni nameščen noben AI agent — dodajte LLM integracijo za uporabo Sommeliera",no_llm_agent_selected:"Izbran ni noben AI agent — izberite ga na plošči Sommelier, zavihek System",llm_agent_missing:"Izbrani AI agent ne obstaja več — izberite drugega na plošči Sommelier, zavihek System"}},stats:{title:"Statistika",total_cups:"Skupaj skodelic",unavailable:"Statistika skodelic ni na voljo.",empty:"Ni še pripravljenih skodelic"},maintenance:{title:"Vzdrževanje",groups:{cleaning:"Čiščenje in razapnjevanje",filter:"Vodni filter",other:"Drugo"},actions:{easy_clean:{label:"Hitro čiščenje",desc:"Hitro izpiranje kuhalne enote"},intensive_clean:{label:"Intenzivno čiščenje",desc:"Globinsko čiščenje s tableto"},descaling:{label:"Razapnjevanje",desc:"Odstranjevanje vodnega kamna"},evaporating:{label:"Izhlapevanje",desc:"Izpihovanje parnega sistema"},filter_insert:{label:"Vstavi filter",desc:"Začni uporabljati nov vodni filter"},filter_replace:{label:"Zamenjaj filter",desc:"Zamenjaj trenutni vodni filter"},filter_remove:{label:"Odstrani filter",desc:"Prenehaj uporabljati vodni filter"},switch_off:{label:"Izklopi",desc:"Izklopi aparat"}}},settings:{title:"Nastavitve",switches:{energy_saving:{label:"Varčevanje z energijo",desc:"Manjša poraba v mirovanju"},auto_bean_select:{label:"Samodejni izbor zrn",desc:"Samodejna izbira posode za zrna"},rinsing_disabled:{label:"Izpiranje izklopljeno",desc:"Preskoči samodejno izpiranje"}},numbers:{water_hardness:{label:"Trdota vode",desc:"Umerjanje glede na vrsto vode"},auto_off_after:{label:"Samodejni izklop",desc:"Minut do izklopa"},brew_temperature:{label:"Temperatura priprave",desc:"Temperatura vode za pripravo"}},levels:{water_hardness:{1:"Mehka",2:"Srednja",3:"Trda",4:"Zelo trda"},brew_temperature:{0:"Nizka",1:"Običajna",2:"Visoka"}},minutes:"{value} min"},edit_dialog:{title:"Uredi: {drink}"},editor:{device:"Naprava",enter_manually:"Vnesi ročno...",entity_prefix:"Predpona entitet",entity_prefix_placeholder:"Samodejno zaznano, če integracija deluje",no_devices_hint:"Ni zaznanih naprav Melitta. Vnesite predpono ročno ali preverite, ali je integracija konfigurirana.",name:"Ime",show_header:"Prikaži glavo",show_status:"Prikaži stanje",show_profiles:"Prikaži izbiro profila",show_recipes:"Prikaži izbiro recepta",show_freestyle:"Prikaži recept Freestyle",show_sommelier:"Prikaži AI Sommelier",show_stats:"Prikaži statistiko skodelic",show_maintenance:"Prikaži vzdrževanje",show_settings:"Prikaži nastavitve",compact:"Kompaktni način"}},sr:{common:{brew:"Припреми",cancel:"Откажи",save:"Сачувај",confirm:"Потврди",start:"Старт",loading:"Учитавање...",retry:"Покушај поново",default_name:"Melitta Barista"},card:{no_device:"Уређај Melitta Barista није пронађен.",no_device_hint:"Проверите да ли је интеграција инсталирана и конфигурисана.",machine_offline:"Апарат ван мреже"},state:{ready:"Спреман",brewing:"Припрема",cleaning:"Чишћење",descaling:"Уклањање каменца",off:"Искључен",busy:"Заузет",filter_insert:"Уметање филтера",filter_replace:"Замена филтера",filter_remove:"Уклањање филтера",evaporating:"Испаравање",idle:"Неактиван",unavailable:"Недоступан",unknown:"Непознато"},activity:{grinding:"Млевење",coffee:"Кафа",steam:"Пара",water:"Вода",prepare:"Припрема"},action:{none:"Нема",bu_removed:"Уметни јединицу за кување",trays_missing:"Уметни посуде",empty_trays:"Испразни посуде",fill_water:"Напуни резервоар водом",close_powder_lid:"Затвори поклопац за млевену кафу",fill_powder:"Додај млевену кафу",move_cup_to_frother:"Помери шољу до млечне млазнице",flush_required:"Потребно испирање"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Млеко",milk_froth:"Млечна пена",water:"Топла вода"},values:{very_mild:"В. блага",mild:"Блага",medium:"Средња",strong:"Јака",very_strong:"В. јака",extra_strong:"Екстра",cold:"Хладно",normal:"Нормално",high:"Високо",none:"Без",one:"1",two:"2",three:"3",coffee:"Кафа",milk:"Млеко",water:"Вода",standard:"Стд",intense:"Инт+"},directkey:{brew_drink:"Припреми {drink}",two_cups:"2x",two_cups_on:"2x УКЉ."},recipes:{title:"Рецепт",all_recipes:"Сви рецепти"},freestyle:{title:"Freestyle",drink_name_placeholder:"Назив напитка",component:"Компонента {n}",process:"Процес",portion:"Порција",intensity:"Јачина",aroma:"Арома",temp:"Темп.",temperature:"Температура",shots:"Шотови",portion_value:"{value} мл",brew_named:"Припреми {name}"},sommelier:{title:"AI Sommelier",unavailable:"Сомелијер није доступан.",generating:"Генерисање...",surprise_me:"Изненади ме",error_generate:"Сомелијер: генерисање рецепта није успело",error_brew:"Сомелијер: припрема није успела",reasoning:"Зашто овај рецепт?",wizard_title:"Припрема корак по корак",step_of:"Корак {n} од {total}",done:"Готово",brew_phase:"Припреми фазу {n}/{total}",phase_running:"Фаза је покренута — сачекајте да апарат заврши, затим наставите",finish:"Заврши",cancel:"Откажи",info:"Детаљи рецепта",steps:"Кораци",err:{no_llm_agent:"У Home Assistant-у није инсталиран AI агент — додајте LLM интеграцију да бисте користили сомелијера",no_llm_agent_selected:"Није изабран AI агент — изаберите га на панелу сомелијера, картица System",llm_agent_missing:"Изабрани AI агент више не постоји — изаберите другог на панелу сомелијера, картица System"}},stats:{title:"Статистика",total_cups:"Укупно шољица",unavailable:"Статистика шољица није доступна.",empty:"Још нема припремљених шољица"},maintenance:{title:"Одржавање",groups:{cleaning:"Чишћење и уклањање каменца",filter:"Филтер за воду",other:"Остало"},actions:{easy_clean:{label:"Брзо чишћење",desc:"Брзо испирање јединице за кување"},intensive_clean:{label:"Интензивно чишћење",desc:"Дубинско чишћење са таблетом"},descaling:{label:"Уклањање каменца",desc:"Уклањање наслага каменца"},evaporating:{label:"Испаравање",desc:"Продувавање парног система"},filter_insert:{label:"Уметни филтер",desc:"Започни коришћење новог филтера за воду"},filter_replace:{label:"Замени филтер",desc:"Замени тренутни филтер за воду"},filter_remove:{label:"Уклони филтер",desc:"Престани са коришћењем филтера за воду"},switch_off:{label:"Искључи",desc:"Искључи апарат"}}},settings:{title:"Подешавања",switches:{energy_saving:{label:"Уштеда енергије",desc:"Смањена потрошња у мировању"},auto_bean_select:{label:"Аутоматски избор зрна",desc:"Аутоматски избор резервоара за зрна"},rinsing_disabled:{label:"Испирање искључено",desc:"Прескочи аутоматско испирање"}},numbers:{water_hardness:{label:"Тврдоћа воде",desc:"Калибрација према типу воде"},auto_off_after:{label:"Аутоматско искључивање",desc:"Минута до искључивања"},brew_temperature:{label:"Температура припреме",desc:"Температура воде за припрему"}},levels:{water_hardness:{1:"Мека",2:"Средња",3:"Тврда",4:"Веома тврда"},brew_temperature:{0:"Ниска",1:"Нормална",2:"Висока"}},minutes:"{value} мин"},edit_dialog:{title:"Уреди: {drink}"},editor:{device:"Уређај",enter_manually:"Унеси ручно...",entity_prefix:"Префикс ентитета",entity_prefix_placeholder:"Аутоматски се открива ако је интеграција покренута",no_devices_hint:"Није пронађен ниједан Melitta уређај. Унесите префикс ручно или проверите да ли је интеграција конфигурисана.",name:"Назив",show_header:"Прикажи заглавље",show_status:"Прикажи статус",show_profiles:"Прикажи избор профила",show_recipes:"Прикажи избор рецепта",show_freestyle:"Прикажи Freestyle рецепт",show_sommelier:"Прикажи AI Sommelier",show_stats:"Прикажи статистику шољица",show_maintenance:"Прикажи одржавање",show_settings:"Прикажи подешавања",compact:"Компактни режим"}},sv:{common:{brew:"Brygg",cancel:"Avbryt",save:"Spara",confirm:"Bekräfta",start:"Starta",loading:"Laddar...",retry:"Försök igen",default_name:"Melitta Barista"},card:{no_device:"Ingen Melitta Barista-enhet hittades.",no_device_hint:"Kontrollera att integrationen är installerad och konfigurerad.",machine_offline:"Maskinen är offline"},state:{ready:"Redo",brewing:"Bryggning",cleaning:"Rengöring",descaling:"Avkalkning",off:"Av",busy:"Upptagen",filter_insert:"Sätter i filter",filter_replace:"Byter filter",filter_remove:"Tar bort filter",evaporating:"Avdunstning",idle:"Inaktiv",unavailable:"Otillgänglig",unknown:"Okänd"},activity:{grinding:"Malning",coffee:"Kaffe",steam:"Ånga",water:"Vatten",prepare:"Förbereder"},action:{none:"Ingen",bu_removed:"Sätt i bryggenheten",trays_missing:"Sätt i brickorna",empty_trays:"Töm brickorna",fill_water:"Fyll vattentanken",close_powder_lid:"Stäng locket för malet kaffe",fill_powder:"Fyll på malet kaffe",move_cup_to_frother:"Flytta koppen till mjölkskummaren",flush_required:"Sköljning krävs"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Mjölk",milk_froth:"Mjölkskum",water:"Varmt vatten"},values:{very_mild:"M.Mild",mild:"Mild",medium:"Med",strong:"Stark",very_strong:"M.Stark",extra_strong:"X.Stark",cold:"Kall",normal:"Normal",high:"Hög",none:"Ingen",one:"1",two:"2",three:"3",coffee:"Kaffe",milk:"Mjölk",water:"Vatten",standard:"Std",intense:"Int+"},directkey:{brew_drink:"Brygg {drink}",two_cups:"2x",two_cups_on:"2x PÅ"},recipes:{title:"Recept",all_recipes:"Alla recept"},freestyle:{title:"Freestyle",drink_name_placeholder:"Dryckens namn",component:"Komponent {n}",process:"Process",portion:"Portion",intensity:"Intensitet",aroma:"Arom",temp:"Temp",temperature:"Temperatur",shots:"Shots",portion_value:"{value} ml",brew_named:"Brygg {name}"},sommelier:{title:"AI-sommelier",unavailable:"Sommelier är inte tillgänglig.",generating:"Genererar...",surprise_me:"Överraska mig",error_generate:"Sommelier: receptgenerering misslyckades",error_brew:"Sommelier: bryggning misslyckades",reasoning:"Varför detta recept?",wizard_title:"Steg-för-steg-bryggning",step_of:"Steg {n} av {total}",done:"Klar",brew_phase:"Brygg fas {n}/{total}",phase_running:"Fasen har startat — låt maskinen bli klar och fortsätt sedan",finish:"Slutför",cancel:"Avbryt",info:"Receptdetaljer",steps:"Steg",err:{no_llm_agent:"Ingen AI-agent är installerad i Home Assistant — lägg till en LLM-integration för att använda sommeliern",no_llm_agent_selected:"Ingen AI-agent är vald — välj en i sommelier-panelen, under fliken System",llm_agent_missing:"Den valda AI-agenten finns inte längre — välj en annan i sommelier-panelen, under fliken System"}},stats:{title:"Statistik",total_cups:"Totalt antal koppar",unavailable:"Koppstatistik är inte tillgänglig.",empty:"Inga koppar bryggda ännu"},maintenance:{title:"Underhåll",groups:{cleaning:"Rengöring & avkalkning",filter:"Vattenfilter",other:"Övrigt"},actions:{easy_clean:{label:"Snabbrengöring",desc:"Snabb sköljning av bryggenheten"},intensive_clean:{label:"Intensiv rengöring",desc:"Djuprengöring med tablett"},descaling:{label:"Avkalkning",desc:"Ta bort kalkavlagringar"},evaporating:{label:"Avdunstning",desc:"Töm ångsystemet"},filter_insert:{label:"Sätt i filter",desc:"Börja använda ett nytt vattenfilter"},filter_replace:{label:"Byt filter",desc:"Byt ut det aktuella vattenfiltret"},filter_remove:{label:"Ta bort filter",desc:"Sluta använda vattenfiltret"},switch_off:{label:"Stäng av",desc:"Stäng av maskinen"}}},settings:{title:"Inställningar",switches:{energy_saving:{label:"Energibesparing",desc:"Minska effekten vid inaktivitet"},auto_bean_select:{label:"Auto bönval",desc:"Välj bönbehållare automatiskt"},rinsing_disabled:{label:"Sköljning avaktiverad",desc:"Hoppa över automatisk sköljning"}},numbers:{water_hardness:{label:"Vattenhårdhet",desc:"Kalibrera för vattentyp"},auto_off_after:{label:"Auto av",desc:"Minuter till avstängning"},brew_temperature:{label:"Bryggtemperatur",desc:"Bryggvattnets temperatur"}},levels:{water_hardness:{1:"Mjukt",2:"Medel",3:"Hårt",4:"Mycket hårt"},brew_temperature:{0:"Låg",1:"Normal",2:"Hög"}},minutes:"{value} min"},edit_dialog:{title:"Redigera: {drink}"},editor:{device:"Enhet",enter_manually:"Ange manuellt...",entity_prefix:"Entitetsprefix",entity_prefix_placeholder:"Identifieras automatiskt om integrationen körs",no_devices_hint:"Inga Melitta-enheter hittades. Ange prefixet manuellt eller kontrollera att integrationen är konfigurerad.",name:"Namn",show_header:"Visa rubrik",show_status:"Visa status",show_profiles:"Visa profilväljare",show_recipes:"Visa receptväljare",show_freestyle:"Visa Freestyle-recept",show_sommelier:"Visa AI-sommelier",show_stats:"Visa koppstatistik",show_maintenance:"Visa underhåll",show_settings:"Visa inställningar",compact:"Kompakt läge"}},tr:{common:{brew:"Demle",cancel:"İptal",save:"Kaydet",confirm:"Onayla",start:"Başlat",loading:"Yükleniyor...",retry:"Tekrar dene",default_name:"Melitta Barista"},card:{no_device:"Melitta Barista cihazı bulunamadı.",no_device_hint:"Entegrasyonun kurulu ve yapılandırılmış olduğundan emin olun.",machine_offline:"Makine çevrimdışı"},state:{ready:"Hazır",brewing:"Demleme",cleaning:"Temizlik",descaling:"Kireç çözme",off:"Kapalı",busy:"Meşgul",filter_insert:"Filtre takılıyor",filter_replace:"Filtre değiştiriliyor",filter_remove:"Filtre çıkarılıyor",evaporating:"Buharlaştırma",idle:"Boşta",unavailable:"Kullanılamaz",unknown:"Bilinmiyor"},activity:{grinding:"Öğütme",coffee:"Kahve",steam:"Buhar",water:"Su",prepare:"Hazırlık"},action:{none:"Yok",bu_removed:"Demleme ünitesini takın",trays_missing:"Tepsileri takın",empty_trays:"Tepsileri boşaltın",fill_water:"Su haznesini doldurun",close_powder_lid:"Öğütülmüş kahve kapağını kapatın",fill_powder:"Öğütülmüş kahve ekleyin",move_cup_to_frother:"Fincanı süt köpürtücüye yaklaştırın",flush_required:"Durulama gerekli"},drinks:{espresso:"Espresso",cafe_creme:"Café Crème",cappuccino:"Cappuccino",latte_macchiato:"Latte Macchiato",milk:"Süt",milk_froth:"Süt köpüğü",water:"Sıcak su"},values:{very_mild:"Ç.Hafif",mild:"Hafif",medium:"Orta",strong:"Sert",very_strong:"Ç.Sert",extra_strong:"X.Sert",cold:"Soğuk",normal:"Normal",high:"Yüksek",none:"Yok",one:"1",two:"2",three:"3",coffee:"Kahve",milk:"Süt",water:"Su",standard:"Std",intense:"Yoğun+"},directkey:{brew_drink:"{drink} demle",two_cups:"2x",two_cups_on:"2x AÇIK"},recipes:{title:"Tarif",all_recipes:"Tüm tarifler"},freestyle:{title:"Freestyle",drink_name_placeholder:"İçecek adı",component:"Bileşen {n}",process:"İşlem",portion:"Porsiyon",intensity:"Yoğunluk",aroma:"Aroma",temp:"Sıc.",temperature:"Sıcaklık",shots:"Shot",portion_value:"{value} ml",brew_named:"{name} demle"},sommelier:{title:"AI Sommelier",unavailable:"Sommelier kullanılamıyor.",generating:"Oluşturuluyor...",surprise_me:"Beni şaşırt",error_generate:"Sommelier: tarif oluşturma başarısız",error_brew:"Sommelier: demleme başarısız",reasoning:"Neden bu tarif?",wizard_title:"Adım adım demleme",step_of:"Adım {n}/{total}",done:"Tamam",brew_phase:"{n}/{total}. aşamayı demle",phase_running:"Aşama başlatıldı — makinenin bitirmesini bekleyin, sonra devam edin",finish:"Bitir",cancel:"İptal",info:"Tarif ayrıntıları",steps:"Adımlar",err:{no_llm_agent:"Home Assistant'ta yüklü bir AI aracısı yok — Sommelier özelliğini kullanmak için bir LLM entegrasyonu ekleyin",no_llm_agent_selected:"AI aracısı seçilmedi — Sommelier panelindeki System sekmesinden birini seçin",llm_agent_missing:"Seçilen AI aracısı artık yok — Sommelier panelindeki System sekmesinden başka birini seçin"}},stats:{title:"İstatistik",total_cups:"Toplam fincan",unavailable:"Fincan istatistikleri mevcut değil.",empty:"Henüz fincan demlenmedi"},maintenance:{title:"Bakım",groups:{cleaning:"Temizlik ve kireç çözme",filter:"Su filtresi",other:"Diğer"},actions:{easy_clean:{label:"Hızlı temizlik",desc:"Demleme ünitesinin hızlı durulanması"},intensive_clean:{label:"Yoğun temizlik",desc:"Tabletle derinlemesine temizlik"},descaling:{label:"Kireç çözme",desc:"Kireç birikintilerini giderir"},evaporating:{label:"Buharlaştırma",desc:"Buhar sistemini boşaltır"},filter_insert:{label:"Filtre tak",desc:"Yeni bir su filtresi kullanmaya başlayın"},filter_replace:{label:"Filtre değiştir",desc:"Mevcut su filtresini değiştirin"},filter_remove:{label:"Filtre çıkar",desc:"Su filtresini kullanmayı bırakın"},switch_off:{label:"Kapat",desc:"Makineyi kapatın"}}},settings:{title:"Ayarlar",switches:{energy_saving:{label:"Enerji tasarrufu",desc:"Boştayken gücü azaltır"},auto_bean_select:{label:"Otomatik çekirdek seçimi",desc:"Çekirdek haznesini otomatik seçer"},rinsing_disabled:{label:"Durulama kapalı",desc:"Otomatik durulamayı atlar"}},numbers:{water_hardness:{label:"Su sertliği",desc:"Su tipine göre kalibre edin"},auto_off_after:{label:"Otomatik kapanma",desc:"Kapanmaya kadar dakika"},brew_temperature:{label:"Demleme sıcaklığı",desc:"Demleme suyu sıcaklığı"}},levels:{water_hardness:{1:"Yumuşak",2:"Orta",3:"Sert",4:"Çok sert"},brew_temperature:{0:"Düşük",1:"Normal",2:"Yüksek"}},minutes:"{value} dk"},edit_dialog:{title:"Düzenle: {drink}"},editor:{device:"Cihaz",enter_manually:"Elle gir...",entity_prefix:"Varlık öneki",entity_prefix_placeholder:"Entegrasyon çalışıyorsa otomatik algılanır",no_devices_hint:"Melitta cihazı algılanmadı. Öneki elle girin veya entegrasyonun yapılandırıldığını kontrol edin.",name:"Ad",show_header:"Başlığı göster",show_status:"Durumu göster",show_profiles:"Profil seçiciyi göster",show_recipes:"Tarif seçiciyi göster",show_freestyle:"Freestyle tarifini göster",show_sommelier:"AI Sommelier'i göster",show_stats:"Fincan istatistiklerini göster",show_maintenance:"Bakımı göster",show_settings:"Ayarları göster",compact:"Kompakt mod"}},uk:{common:{brew:"Приготувати",cancel:"Скасувати",save:"Зберегти",confirm:"Підтвердити",start:"Старт",loading:"Завантаження...",retry:"Повторити",default_name:"Melitta Barista"},card:{no_device:"Кавомашину Melitta Barista не знайдено.",no_device_hint:"Переконайтеся, що інтеграція встановлена і налаштована.",machine_offline:"Машина не в мережі"},state:{ready:"Готова",brewing:"Приготування",cleaning:"Очищення",descaling:"Декальцинація",off:"Вимкнено",busy:"Зайнята",filter_insert:"Встановлення фільтра",filter_replace:"Заміна фільтра",filter_remove:"Виймання фільтра",evaporating:"Випаровування",idle:"Очікування",unavailable:"Недоступна",unknown:"Невідомо"},activity:{grinding:"Помел",coffee:"Кава",steam:"Пара",water:"Вода",prepare:"Підготовка"},action:{none:"Немає",bu_removed:"Встановіть заварювальний блок",trays_missing:"Встановіть піддони",empty_trays:"Спорожніть піддони",fill_water:"Наповніть резервуар для води",close_powder_lid:"Закрийте кришку для меленої кави",fill_powder:"Додайте мелену каву",move_cup_to_frother:"Підставте чашку до капучинатора",flush_required:"Потрібне промивання"},drinks:{espresso:"Еспресо",cafe_creme:"Кафе крем",cappuccino:"Капучино",latte_macchiato:"Лате макіато",milk:"Молоко",milk_froth:"Молочна пінка",water:"Гаряча вода"},values:{very_mild:"Д.м'яка",mild:"М'яка",medium:"Серед.",strong:"Міцна",very_strong:"Д.міцна",extra_strong:"Екстра",cold:"Холодна",normal:"Норм.",high:"Вис.",none:"Немає",one:"1",two:"2",three:"3",coffee:"Кава",milk:"Молоко",water:"Вода",standard:"Стд",intense:"Інт+"},directkey:{brew_drink:"Готувати: {drink}",two_cups:"2x",two_cups_on:"2x УВІМК"},recipes:{title:"Рецепт",all_recipes:"Усі рецепти"},freestyle:{title:"Freestyle",drink_name_placeholder:"Назва напою",component:"Компонент {n}",process:"Процес",portion:"Порція",intensity:"Міцність",aroma:"Аромат",temp:"Темп.",temperature:"Температура",shots:"Шоти",portion_value:"{value} мл",brew_named:"Готувати {name}"},sommelier:{title:"AI Сомельє",unavailable:"Сомельє недоступний.",generating:"Генерація...",surprise_me:"Здивуй мене",error_generate:"Сомельє: не вдалося згенерувати рецепт",error_brew:"Сомельє: не вдалося запустити приготування",reasoning:"Чому цей рецепт?",wizard_title:"Покрокове приготування",step_of:"Крок {n} з {total}",done:"Готово",brew_phase:"Заварити фазу {n}/{total}",phase_running:"Фазу запущено — дочекайтеся, поки машина завершить, і продовжуйте",finish:"Завершити",cancel:"Скасувати",info:"Деталі рецепта",steps:"Кроки",err:{no_llm_agent:"У Home Assistant не встановлено AI-агента — додайте LLM-інтеграцію, щоб користуватися сомельє",no_llm_agent_selected:"AI-агента не вибрано — вкажіть його на панелі сомельє, вкладка System",llm_agent_missing:"Вибраний AI-агент зник — виберіть інший на панелі сомельє, вкладка System"}},stats:{title:"Статистика",total_cups:"Усього чашок",unavailable:"Статистика чашок недоступна.",empty:"Ще немає приготованих чашок"},maintenance:{title:"Обслуговування",groups:{cleaning:"Очищення та декальцинація",filter:"Фільтр води",other:"Інше"},actions:{easy_clean:{label:"Швидке очищення",desc:"Швидке промивання заварювального блока"},intensive_clean:{label:"Інтенсивне очищення",desc:"Глибоке очищення з таблеткою"},descaling:{label:"Декальцинація",desc:"Видалення вапняного нальоту"},evaporating:{label:"Випаровування",desc:"Продування парової системи"},filter_insert:{label:"Встановити фільтр",desc:"Почати використовувати новий фільтр води"},filter_replace:{label:"Замінити фільтр",desc:"Замінити поточний фільтр води"},filter_remove:{label:"Видалити фільтр",desc:"Припинити використання фільтра"},switch_off:{label:"Вимкнути",desc:"Вимкнути машину"}}},settings:{title:"Налаштування",switches:{energy_saving:{label:"Енергозбереження",desc:"Економія енергії в режимі очікування"},auto_bean_select:{label:"Автовибір зерен",desc:"Автовибір бункера із зернами"},rinsing_disabled:{label:"Ополіскування вимкнено",desc:"Пропускати автоматичне ополіскування"}},numbers:{water_hardness:{label:"Жорсткість води",desc:"Калібрування під тип води"},auto_off_after:{label:"Автовимкнення",desc:"Хвилин до вимкнення"},brew_temperature:{label:"Температура",desc:"Температура води при заварюванні"}},levels:{water_hardness:{1:"М'яка",2:"Середня",3:"Жорстка",4:"Дуже жорстка"},brew_temperature:{0:"Низька",1:"Норм.",2:"Висока"}},minutes:"{value} хв"},edit_dialog:{title:"Змінити: {drink}"},editor:{device:"Пристрій",enter_manually:"Ввести вручну...",entity_prefix:"Префікс сутностей",entity_prefix_placeholder:"Визначається автоматично, якщо інтеграція запущена",no_devices_hint:"Пристрої Melitta не знайдено. Введіть префікс вручну або перевірте налаштування інтеграції.",name:"Назва",show_header:"Показувати заголовок",show_status:"Показувати статус",show_profiles:"Показувати вибір профілю",show_recipes:"Показувати вибір рецепта",show_freestyle:"Показувати Freestyle",show_sommelier:"Показувати AI Сомельє",show_stats:"Показувати статистику чашок",show_maintenance:"Показувати обслуговування",show_settings:"Показувати налаштування",compact:"Компактний режим"}}};let ct="en";function dt(e){ct=function(e){return(e?.locale?.language??e?.language??"en").replace("_","-").toLowerCase()}(e)}function pt(e,t){const a=t.split(".").reduce((e,t)=>"object"==typeof e&&null!==e?e[t]:void 0,e);return"string"==typeof a?a:void 0}function mt(e,t){const a=pt(lt[ct],e)??pt(lt[ct.split("-")[0]],e)??pt(lt.en,e);if(void 0!==a)return t?a.replace(/\{(\w+)\}/g,(e,a)=>String(t[a]??`{${a}}`)):a}function ut(e,t){return mt(e,t)??e}const _t={very_mild:1,mild:2,medium:3,strong:4,very_strong:5};function ft(e,t,a,i,r=!1){return H`
    <div class="segment-picker ${r?"freestyle-disabled":""}">
      <span class="segment-label">${e}</span>
      <div class="segment-options">
        ${t.map(e=>H`
          <button class="segment-opt" ?data-active=${e===a}
            @click=${()=>i(e)}>${function(e){return mt(`values.${e}`)??e.charAt(0).toUpperCase()+e.slice(1).replace(/_/g," ")}(e)}</button>
        `)}
      </div>
    </div>
  `}function gt(e){const{spec:t,onChange:a,allowNoneProcess:i}=e,r=e.vocab??Oe(null),n="none"===t.process,s="coffee"===t.process,o=i?r.limits.c2:r.limits.c1,l=i?r.processesWithNone:r.processes;return H`
    <div class="${e.containerClass}">
      <div class="component-title">${e.title}</div>
      ${ft(ut("freestyle.process"),l,t.process,e=>a({process:e}))}
      ${function(e,t,a,i,r,n,s=!1){return H`
    <div class="portion-row ${s?"freestyle-disabled":""}">
      <div class="portion-header">
        <span class="portion-label">${e}</span>
        <span class="portion-value">${ut("freestyle.portion_value",{value:t})}</span>
      </div>
      <input type="range" class="portion-slider"
        min=${a} max=${i} step=${r} .value=${String(t)}
        @input=${e=>n(parseInt(e.target.value)||0)} />
    </div>
  `}(ut("freestyle.portion"),t.portion_ml,o.min,o.max,o.step,e=>a({portion_ml:e}),i&&n)}
      ${ft(ut("freestyle.intensity"),r.intensities,t.intensity,e=>a({intensity:e}),!s)}
      ${ft(ut("freestyle.aroma"),r.aromas,t.aroma,e=>a({aroma:e}),!s)}
      ${ft(ut(e.longTemperatureLabel?"freestyle.temperature":"freestyle.temp"),r.temperatures,t.temperature,e=>a({temperature:e}),i&&n)}
      ${ft(ut("freestyle.shots"),r.shots,t.shots,e=>a({shots:e}),!s)}
    </div>
  `}const ht={Espresso:{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#C9A87C",height:.04}},Ristretto:{layers:[{color:"#1A0D04",height:.22}],foam:{color:"#B89970",height:.03}},Lungo:{layers:[{color:"#4A2A14",height:.5}],foam:{color:"#C9A87C",height:.04}},"Espresso Doppio":{layers:[{color:"#3E1F0D",height:.45}],foam:{color:"#C9A87C",height:.04}},"Ristretto Doppio":{layers:[{color:"#1A0D04",height:.4}],foam:{color:"#B89970",height:.03}},"Café Crème":{layers:[{color:"#5C3A1E",height:.5}],foam:{color:"#E8D5B7",height:.08}},"Café Crème Doppio":{layers:[{color:"#5C3A1E",height:.58}],foam:{color:"#E8D5B7",height:.08}},Americano:{layers:[{color:"#3E1F0D",height:.6}]},"Americano Extra":{layers:[{color:"#2C1507",height:.65}]},"Long Black":{layers:[{color:"#3E1F0D",height:.55}],foam:{color:"#C9A87C",height:.05}},"Red Eye":{layers:[{color:"#2C1507",height:.6}]},"Black Eye":{layers:[{color:"#1A0D04",height:.65}]},"Dead Eye":{layers:[{color:"#0F0803",height:.7}]},Cappuccino:{layers:[{color:"#3E1F0D",height:.28},{color:"#D4B896",height:.22}],foam:{color:"#F5EDE0",height:.18}},"Espresso Macchiato":{layers:[{color:"#3E1F0D",height:.3}],foam:{color:"#F5EDE0",height:.12}},"Caffè Latte":{tall:!0,layers:[{color:"#E8D5B7",height:.35},{color:"#8B5A30",height:.18}],foam:{color:"#F5EDE0",height:.1}},"Café au Lait":{layers:[{color:"#C9A87C",height:.5}],foam:{color:"#F0E6D8",height:.06}},"Flat White":{layers:[{color:"#3E1F0D",height:.2},{color:"#D4B896",height:.3}],foam:{color:"#F0E6D8",height:.05}},"Latte Macchiato":{tall:!0,layers:[{color:"#F0E6D8",height:.28},{color:"#6B4226",height:.12},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.15}},"Latte Macchiato Extra":{tall:!0,layers:[{color:"#F0E6D8",height:.25},{color:"#5C3A1E",height:.16},{color:"#E8D5B7",height:.12}],foam:{color:"#FEFCFA",height:.14}},"Latte Macchiato Triple":{tall:!0,layers:[{color:"#F0E6D8",height:.22},{color:"#4A2A14",height:.2},{color:"#E8D5B7",height:.1}],foam:{color:"#FEFCFA",height:.14}},Milk:{tall:!0,layers:[{color:"#F0E6D8",height:.55}]},"Milk Froth":{tall:!0,layers:[{color:"#F0E6D8",height:.15}],foam:{color:"#FEFCFA",height:.4}},"Hot Water":{layers:[{color:"#9DC4D8",height:.5}]}};ht["Cafe Creme"]=ht["Café Crème"],ht["Cafe Creme Doppio"]=ht["Café Crème Doppio"],ht["Caffe Latte"]=ht["Caffè Latte"],ht["Cafe au Lait"]=ht["Café au Lait"];const vt={layers:[{color:"#5C3A1E",height:.45}]},bt=[1],yt={espresso_cup:60,cup:220,tall_glass:320};function kt(e){const t=e?36:50,a=e?30:42,i=e?68:48,r=e?12:28,n=r+i,s=e?50:46,o=s-t/2,l=s+t/2,c=s-a/2,d=s+a/2,p=1.5,m=o+p,u=l-p,_=c+p+1.2,f=d-p-1.2,g=r+p,h=n-p,v=2.8;return{isTall:e,vbW:100,vbH:115,cupH:i,cupTop:r,cupBot:n,cx:s,topL:o,topR:l,botL:c,botR:d,ciTopL:m,ciTopR:u,ciBotL:_,ciBotR:f,ciTop:g,ciBot:h,ciR:v,glassPath:`M ${o} ${r} L ${c+4} ${n-4} Q ${c} ${n} ${c+4} ${n} L ${d-4} ${n} Q ${d} ${n} ${d-4} ${n-4} L ${l} ${r}`,clipPath:`M ${m} ${g} L ${_+v} ${h-v} Q ${_} ${h} ${_+v} ${h} L ${f-v} ${h} Q ${f} ${h} ${f-v} ${h-v} L ${u} ${g} Z`}}function wt(e,t,a){const i=(t-e.ciTop)/(e.ciBot-e.ciTop);return a?e.ciTopL+(e.ciBotL-e.ciTopL)*i:e.ciTopR+(e.ciBotR-e.ciTopR)*i}function xt(e,t){let a=e.ciBot;const i=[];for(let r=0;r<t.length;r++){const{frac:n,fill:s,role:o,intensity:l}=t[r],c=e.cupH*n,d=a,p=a-c;a=p;const m=wt(e,p,!0),u=wt(e,p,!1),_=wt(e,d,!0),f=wt(e,d,!1),g=0===r,h=g?e.ciR:0,v=g?`M ${m} ${p} L ${_+h} ${d-h} Q ${_} ${d} ${_+h} ${d} L ${f-h} ${d} Q ${f} ${d} ${f-h} ${d-h} L ${u} ${p} Z`:`M ${m} ${p} L ${_} ${d} L ${f} ${d} L ${u} ${p} Z`;i.push({d:v,fill:s,role:o,intensity:l,yTop:p,yBottom:d,height:c})}return i}const zt=[154,107,58],$t=[15,8,3],St=[224,224,224],At=[64,64,64],jt=/^#[0-9a-fA-F]{6}$/;function Mt(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Pt(e,t,a){const i=i=>Math.round(e[i]+(t[i]-e[i])*a),r=e=>e.toString(16).padStart(2,"0");return`#${r(i(0))}${r(i(1))}${r(i(2))}`}function It(e){const t=Mt(e.intensity);switch(e.role){case"coffee":return Pt(zt,$t,t);case"milk":return"#F0E6D8";case"water":return"#9DC4D8";case"additive":{const a=e.color_hint;return"string"==typeof a&&jt.test(a)?a:Pt(St,At,t)}default:return Pt(St,At,t)}}function Ct(e,t){if(!function(e){if("object"!=typeof e||null===e)return!1;if(!bt.includes(e.spec_version))return!1;if(!Array.isArray(e.layers)||0===e.layers.length)return!1;for(const t of e.layers)if("object"!=typeof t||null===t)return!1;return null===e.foam||void 0===e.foam||"object"==typeof e.foam}(e))return null;const a=kt("tall_glass"===e.glass);let i;if("number"==typeof e.fill_level&&Number.isFinite(e.fill_level))i=e.fill_level;else{if(!("number"==typeof e.total_ml&&Number.isFinite(e.total_ml)&&e.total_ml>0))return null;i=e.total_ml/(yt[e.glass]??yt.cup)}i=Math.min(1,Math.max(.01,i));const r=e.layers.map(e=>"number"==typeof e.fraction&&Number.isFinite(e.fraction)?Math.max(0,e.fraction):0),n=e.foam??null,s=n&&"number"==typeof n.fraction&&Number.isFinite(n.fraction)?Math.max(0,n.fraction):0,o=r.reduce((e,t)=>e+t,0)+s,l=r.length-1;r[l]=Math.max(0,r[l]+(1-o));let c=1;const d=r.reduce((e,t)=>e+t,0)+s;d>1&&(c=1/d);const p=[],m=e.layers.length-1;for(let t=0;t<e.layers.length;t++){const a=e.layers[t],n="string"==typeof a.role?a.role:"unknown",o=Mt(a.intensity),l=It({...a,role:n,intensity:o});let d=i*r[t]*c;if(d<=0)continue;let u=0;!0===a.crema&&"coffee"===n&&t===m&&s<=0&&(u=Math.min(.25*d,.05),d-=u),p.push({frac:d,fill:l,role:n,intensity:o}),u>0&&p.push({frac:u,fill:"#C9A87C",role:"crema",intensity:o})}return s>0&&p.push({frac:i*s*c,fill:"#FEFCFA",role:"milk_foam",intensity:0}),{frame:a,layers:xt(a,p),steam:!0===e.steam,width:t,height:t*(a.vbH/a.vbW)}}function Et(e,t,a,i,r){const{vbW:n,vbH:s,cupTop:o,cupBot:l,cupH:c,cx:d,topL:p,topR:m,botL:u,botR:_,isTall:f}=e,g=m,h=o+.18*c,v=o+.65*c,b=f?10:14,y=`M ${d-6} ${o-2} Q ${d-8} ${o-10} ${d-5} ${o-16}`,k=`${y};M ${d-6} ${o-2} Q ${d-4} ${o-10} ${d-7} ${o-16};${y}`,w=`M ${d+1} ${o-3} Q ${d+3} ${o-11} ${d} ${o-18}`,x=`${w};M ${d+1} ${o-3} Q ${d-1} ${o-11} ${d+2} ${o-18};${w}`,z=`M ${d+8} ${o-2} Q ${d+6} ${o-9} ${d+9} ${o-15}`,$=`${z};M ${d+8} ${o-2} Q ${d+10} ${o-9} ${d+7} ${o-15};${z}`;return U`
    <svg width="${i}" height="${i*(s/n)}" viewBox="0 0 ${n} ${s}" fill="none">
      <defs>
        <clipPath id="clip-${r}">
          <path d="${e.clipPath}" />
        </clipPath>
        <linearGradient id="refl-${r}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="0.18" />
          <stop offset="15%" stop-color="white" stop-opacity="0.06" />
          <stop offset="50%" stop-color="white" stop-opacity="0" />
          <stop offset="80%" stop-color="white" stop-opacity="0.03" />
          <stop offset="100%" stop-color="white" stop-opacity="0.10" />
        </linearGradient>
        <linearGradient id="spec-${r}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="0.35" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <filter id="sg-${r}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <linearGradient id="rf-${r}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0.15" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <mask id="rm-${r}">
          <rect x="0" y="${l+1}" width="${n}" height="${.4*c}" fill="url(#rf-${r})" />
        </mask>
      </defs>

      ${a?U`
        <g opacity="0.20" stroke="rgba(255,255,255,0.6)" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#sg-${r})">
          <path d="${y}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${k}" /></path>
          <path d="${w}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${x}" /></path>
          <path d="${z}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${$}" /></path>
        </g>
        <g opacity="0.40" stroke="#D4C4A0" stroke-width="1" fill="none" stroke-linecap="round">
          <path d="${y}"><animate attributeName="d" dur="3s" repeatCount="indefinite" values="${k}" /></path>
          <path d="${w}"><animate attributeName="d" dur="2.6s" repeatCount="indefinite" values="${x}" /></path>
          <path d="${z}"><animate attributeName="d" dur="3.3s" repeatCount="indefinite" values="${$}" /></path>
        </g>
      `:Z}

      <path d="${e.glassPath}" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-linejoin="round" />

      <g clip-path="url(#clip-${r})">
        ${t.map(e=>U`<path d="${e.d}" fill="${e.fill}" />`)}
      </g>

      <path d="${e.glassPath}" fill="url(#refl-${r})" clip-path="url(#clip-${r})" />
      <path d="M ${p+1.5} ${o+3} L ${u+2.5} ${l-5} L ${u+2.5+(f?4:5)} ${l-5} L ${p+1.5+(f?4:5)} ${o+3} Z" fill="url(#spec-${r})" />
      <line x1="${m-2.5}" y1="${o+5}" x2="${_-3}" y2="${l-7}" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-linecap="round" />
      <line x1="${p+3}" y1="${o+.5}" x2="${m-3}" y2="${o+.5}" stroke="rgba(255,255,255,0.20)" stroke-width="1" stroke-linecap="round" />

      <path d="M ${g} ${h} C ${g+b} ${h-2}, ${g+b} ${v+2}, ${g} ${v}" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="none" stroke-linecap="round" />

      <g mask="url(#rm-${r})">
        <g transform="translate(0, ${2*l+2}) scale(1, -1)">
          <path d="${e.glassPath}" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linejoin="round" />
          <g clip-path="url(#clip-${r})" opacity="0.5">
            ${t.map(e=>U`<path d="${e.d}" fill="${e.fill}" />`)}
          </g>
          <path d="M ${g} ${h} C ${g+b} ${h-2}, ${g+b} ${v+2}, ${g} ${v}" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none" />
        </g>
      </g>
    </svg>
  `}function Nt(e,t,a){const i=ht[e]||vt,r=kt(!!i.tall),n=[...i.layers].reverse().map(e=>({frac:e.height,fill:e.color,role:"legacy",intensity:0}));i.foam&&n.push({frac:i.foam.height,fill:i.foam.color,role:"legacy_foam",intensity:0});return Et(r,xt(r,n),"Milk"!==e&&"Milk Froth"!==e&&"Hot Water"!==e,t,a)}function Ft(e){const t=e.currentTarget;t.hidden=!0;const a=t.parentElement?.querySelector(".brand-badge-label");a&&(a.hidden=!1)}function Tt(e,t,a){return a?H`
    <div class="card-header">
      <span class="machine-name">${e}</span>
      <div class="header-right">
        ${function(e){return H`
    <span class="brand-badge" style="color: ${e.fg}; background: ${e.bg}">
      ${null!==e.logoUrl?H`
        <img class="brand-badge-logo" src=${e.logoUrl} alt=${e.label}
          @error=${Ft} />
        <span class="brand-badge-label" hidden>${e.label}</span>
      `:H`<span class="brand-badge-label">${e.label}</span>`}
    </span>
  `}(a)}
        <div class="connection-dot"
          style="background: ${t?"var(--mbc-success)":"var(--mbc-error)"}"></div>
      </div>
    </div>
  `:H`
      <div class="card-header">
        <span class="machine-name">${e}</span>
        <div class="connection-dot"
          style="background: ${t?"var(--mbc-success)":"var(--mbc-error)"}"></div>
      </div>
    `}function Rt(e){const t=e.data.profiles[e.data.activeProfile]??{};return 0===Object.keys(t).length?Z:H`
    <div class="dk-grid">
      ${Ae.map(a=>{const i=t[a];if(!i)return Z;const r=e.selected===a,n=void 0!==i.c1_process&&"none"!==i.c1_process;return H`
          <button class="dk-card" ?data-selected=${r}
            @click=${()=>e.onCardClick(a)}
            @pointerdown=${()=>e.onLongPressStart(a,i)}
            @pointerup=${()=>e.onLongPressCancel()}
            @pointerleave=${()=>e.onLongPressCancel()}
            @contextmenu=${e=>e.preventDefault()}>
            <div class="${r&&n?"dk-icon-dimmed":""}">
              ${Nt(je[a],48,`dk-${a}`)}
            </div>
            ${r&&n?H`
              <div class="dk-card-overlay">
                ${function(e){const t=[];e.c1_process&&"none"!==e.c1_process&&t.push({process:e.c1_process,intensity:e.c1_intensity,ml:e.c1_portion_ml});e.c2_process&&"none"!==e.c2_process&&t.push({process:e.c2_process,intensity:e.c2_intensity,ml:e.c2_portion_ml});return 0===t.length?Z:H`
    <div class="dk-recipe-info">
      ${t.map(e=>H`
        <div class="dk-recipe-row">
          <span class="dk-recipe-ml">${e.ml}<span class="dk-recipe-ml-unit">ml</span></span>
          ${"coffee"===e.process?H`
            <span class="intensity-dots">
              ${[1,2,3,4,5].map(t=>H`
                <span class="intensity-dot" ?data-on=${t<=(_t[e.intensity]||3)}></span>
              `)}
            </span>
          `:Z}
        </div>
      `)}
    </div>
  `}(i)}
              </div>
            `:Z}
            <span class="dk-card-label">
              ${r?ut("directkey.brew_drink",{drink:ut(`drinks.${a}`)}):ut(`drinks.${a}`)}
            </span>
          </button>
        `})}

      <!-- 2x toggle -->
      <button class="dk-card" ?data-selected=${e.twoCups}
        @click=${()=>e.onToggleTwoCups()}>
        <div class="dk-2x">2x</div>
        <span class="dk-card-label">
          ${e.twoCups?ut("directkey.two_cups_on"):ut("directkey.two_cups")}
        </span>
      </button>

    </div>
  `}function Lt(e){const t=e?.state?parseInt(e.state,10):null;if(null===t||isNaN(t))return H`
      <div class="section-title">${ut("stats.title")}</div>
      <div class="stats-unavailable">${ut("stats.unavailable")}</div>
    `;const a=e.attributes||{},i=[];for(const[e,t]of Object.entries(a))"number"!=typeof t||ve.includes(e)||i.push({name:e,count:t});return i.sort((e,t)=>t.count-e.count),H`
    <div class="section-title">${ut("stats.title")}</div>
    <div class="stats-section">
      <div class="stats-total">
        <span class="stats-total-number">${t.toLocaleString(ct)}</span>
        <span class="stats-total-label">${ut("stats.total_cups")}</span>
      </div>
      ${i.length>0?H`
        <div class="stats-grid">
          ${i.map(({name:e,count:t},a)=>H`
            <div class="stats-card" ?data-top=${0===a}>
              ${Nt(e,40,`stat-${e.replace(/[^a-zA-Z0-9]/g,"")}`)}
              <span class="stats-recipe-name">${e}</span>
              <span class="stats-recipe-count">${t}</span>
            </div>
          `)}
        </div>
      `:H`<div class="stats-empty">${ut("stats.empty")}</div>`}
    </div>
  `}function Bt(e){return null!=e&&"unknown"!==e&&"unavailable"!==e&&"None"!==e}const Vt={READY:"state.ready",PRODUCT:"state.brewing",SWITCH_OFF:"state.off",CLEANING:"state.cleaning",EASY_CLEAN:"state.cleaning",INTENSIVE_CLEAN:"state.cleaning",DESCALING:"state.descaling",BUSY:"state.busy",FILTER_INSERT:"state.filter_insert",FILTER_REPLACE:"state.filter_replace",FILTER_REMOVE:"state.filter_remove",EVAPORATING:"state.evaporating"},Dt={GRINDING:"activity.grinding",COFFEE:"activity.coffee",STEAM:"activity.steam",WATER:"activity.water",PREPARE:"activity.prepare"},Kt={NONE:"action.none",BU_REMOVED:"action.bu_removed",TRAYS_MISSING:"action.trays_missing",EMPTY_TRAYS:"action.empty_trays",FILL_WATER:"action.fill_water",CLOSE_POWDER_LID:"action.close_powder_lid",FILL_POWDER:"action.fill_powder",MOVE_CUP_TO_FROTHER:"action.move_cup_to_frother",FLUSH_REQUIRED:"action.flush_required"};function Ot(e){if(null==e)return ut("state.busy");const t=Vt[e];return t&&mt(t)||mt(e)||e}function Ht(e){if(null==e)return ut("state.idle");const t=Dt[e];return t&&mt(t)||mt(e)||e}function Ut(e){const t=Kt[e];return t&&mt(t)||mt(e)||e}function qt(e){if(!Bt(e))return null;const t=parseFloat(e);return Number.isNaN(t)?null:Math.max(0,Math.min(100,t))}const Zt=[1];function Wt(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)}function Gt(e){return"string"==typeof e?e:null}const Yt=new Map,Xt=new Map;function Jt(e){let t=Xt.get(e);return t||(t={durable:!1,transient:!1,retryArmed:!1,warned:!1,lastConnected:null,lastFingerprint:null},Xt.set(e,t)),t}function Qt(e,t,a,i){e.warned||(e.warned=!0,console.warn(`melitta-barista-card: ui_contract fetch failed for entry ${t} (${a}); contract-derived features fall back to legacy defaults`,i))}async function ea(e,t,a){const i=Yt.get(t);if(i&&(null==a||i.contract_fingerprint===a))return i;const r=Jt(t);if(r.durable)return null;if(r.transient&&!r.retryArmed)return null;let n;r.retryArmed=!1;try{n=await e.callWS({type:"melitta_barista/ui_contract/get",entry_id:t})}catch(e){return"unknown_command"===(Wt(e)?e.code:void 0)?(r.durable=!0,Qt(r,t,"durable",e)):(r.transient=!0,Qt(r,t,"transient",e)),null}const s=function(e){if(!Wt(e))return null;const t=e.contract_version;if("number"!=typeof t||!Zt.includes(t))return null;if("string"!=typeof e.contract_fingerprint||""===e.contract_fingerprint)return null;if("string"!=typeof e.entry_id||""===e.entry_id)return null;if(!Wt(e.machine))return null;if(!Wt(e.capabilities))return null;if(!Wt(e.vocabularies))return null;if(!Wt(e.vocabularies.status)||!Wt(e.vocabularies.freestyle))return null;if(!Wt(e.limits)||!Wt(e.limits.portion_ml))return null;const a=e.limits.portion_ml;return Wt(a.c1)&&Wt(a.c2)&&Array.isArray(e.recipes)?"string"!=typeof e.status_attribute_entity||"string"!=typeof e.bridge_attribute_entity?null:e:null}(n);if(!s){const e=Wt(n)?n.contract_version:void 0;return"number"!=typeof e||Zt.includes(e)?(r.transient=!0,Qt(r,t,"transient",n)):(r.durable=!0,Qt(r,t,"durable",n)),null}return r.transient=!1,Yt.set(t,s),s}const ta=/^#[0-9a-fA-F]{6}$/,aa=/^\/local\/[A-Za-z0-9_\-./]+$/;function ia(e){const t=t=>{const a=parseInt(e.slice(t,t+2),16)/255;return a<=.03928?a/12.92:((a+.055)/1.055)**2.4};return.2126*t(1)+.7152*t(3)+.0722*t(5)}function ra(e,t){const a=ia(e),i=ia(t);return(Math.max(a,i)+.05)/(Math.min(a,i)+.05)}function na(e){if(!function(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)}(e))return null;const t=e.wordmark;if("string"!=typeof t)return null;const a=t.trim();if(""===a)return null;const i=e.logo_url,r="string"==typeof i&&aa.test(i)&&!i.includes("..")?i:null,n=e.accent,s=e.accent_soft;if("string"!=typeof n||!ta.test(n)||"string"!=typeof s||!ta.test(s))return{label:a,fg:"var(--secondary-text-color, #666666)",bg:"color-mix(in srgb, currentColor 10%, transparent)",logoUrl:r};let o=n;return ra(n,s)<3&&(o=ra("#ffffff",s)>=ra("#1a1a1a",s)?"#ffffff":"#1a1a1a"),{label:a,fg:o,bg:s,logoUrl:r}}function sa(e,t,a){return e.callService("button","press",{entity_id:`button.${t}_${a}`})}function oa(e,t,a,i){return e.callService("select","select_option",{entity_id:`select.${t}_${a}`,option:i})}const la={favoritesList:`${he}/sommelier/favorites/list`,hoppersGet:`${he}/sommelier/hoppers/get`,generate:`${he}/sommelier/generate`,brew:`${he}/sommelier/brew`,favoritesBrew:`${he}/sommelier/favorites/brew`};async function ca(e){return(await e.callWS({type:la.favoritesList})).favorites}function da(e){const t=new Set;for(const a of Object.keys(e.states)){const e=a.match(/^button\.(.+?)_brew$/);e&&t.add(e[1])}const a=[];for(const i of t){const t=e.states[`sensor.${i}_state`];if(!t)continue;const r=t.attributes.friendly_name,n=r?r.replace(/\s*State$/,""):i.replace(/_/g," ");a.push({prefix:i,name:n})}return a}const pa=s`
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
  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 0.6em;
    font-weight: 700;
    letter-spacing: 0.14em;
    line-height: 1.7;
    text-transform: uppercase;
    user-select: none;
    max-width: 40%;
    overflow: hidden;
    white-space: nowrap;
  }
  .brand-badge-logo {
    display: block;
    height: 12px;
    width: auto;
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
  .profile-tabs-version {
    flex: 0 0 auto;
    align-self: center;
    margin-left: auto;
    padding: 0 12px;
    font-size: 0.55em;
    letter-spacing: 0.08em;
    color: var(--mbc-text2);
    opacity: 0.5;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    user-select: none;
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
  .dk-icon-dimmed { opacity: 0.15; }
  .dk-2x {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 55px;
    font-size: 1.6em;
    font-weight: 700;
    color: var(--mbc-text);
    opacity: 0.35;
  }
  .dk-card[data-selected] .dk-2x { opacity: 1; }
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

`,ma=[{key:"show_header",defaultOn:!0},{key:"show_status",defaultOn:!0},{key:"show_profiles",defaultOn:!0},{key:"show_recipes",defaultOn:!0},{key:"show_freestyle",defaultOn:!1},{key:"show_sommelier",defaultOn:!1},{key:"show_stats",defaultOn:!1},{key:"show_maintenance",defaultOn:!1},{key:"show_settings",defaultOn:!1},{key:"compact",defaultOn:!1}];let ua=class extends ce{constructor(){super(...arguments),this._manualMode=!1}setConfig(e){this._config=e}_fireConfigChanged(){const e=new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0});this.dispatchEvent(e)}_valueChanged(e,t){const a=t.target,i=a instanceof HTMLInputElement&&"checkbox"===a.type?a.checked:a.value;this._config={...this._config,[e]:i},this._fireConfigChanged()}_prefixChanged(e){const t=e.target.value;this._config={...this._config,entity_prefix:t.trim()},this._fireConfigChanged()}_deviceSelected(e){const t=e.target.value;if("__manual__"===t)return this._manualMode=!0,this._config={...this._config,entity_prefix:""},void this._fireConfigChanged();this._manualMode=!1;const a=(this.hass?da(this.hass):[]).find(e=>e.prefix===t);this._config={...this._config,entity_prefix:t,name:a?.name||this._config.name},this._fireConfigChanged()}render(){if(!this._config)return Z;dt(this.hass);const e=this.hass?da(this.hass):[],t=this._config.entity_prefix||"",a=e.some(e=>e.prefix===t),i=this._manualMode||!!t&&!a,r=e.length>0&&i;return H`
      ${e.length>0?H`
            <div class="editor-row">
              <label for="device">${ut("editor.device")}</label>
              <select id="device" @change=${this._deviceSelected}>
                ${e.map(e=>H`
                    <option value=${e.prefix}
                      ?selected=${!i&&e.prefix===t}>
                      ${e.name}
                    </option>
                  `)}
                <option value="__manual__" ?selected=${i}>
                  ${ut("editor.enter_manually")}
                </option>
              </select>
            </div>
          `:H`
            <div class="editor-row">
              <label for="entity_prefix">${ut("editor.entity_prefix")}</label>
              <input
                id="entity_prefix"
                .value=${t}
                placeholder=${ut("editor.entity_prefix_placeholder")}
                @input=${e=>this._prefixChanged(e)}
              />
              <span class="hint">${ut("editor.no_devices_hint")}</span>
            </div>
          `}

      ${r?H`
            <div class="editor-row">
              <label for="entity_prefix">${ut("editor.entity_prefix")}</label>
              <input
                id="entity_prefix"
                .value=${t}
                @input=${e=>this._prefixChanged(e)}
              />
            </div>
          `:""}

      <div class="editor-row">
        <label for="name">${ut("editor.name")}</label>
        <input
          id="name"
          .value=${this._config.name||ut("common.default_name")}
          @input=${e=>this._valueChanged("name",e)}
        />
      </div>

      ${ma.map(({key:e,defaultOn:t})=>H`
        <div class="checkbox-row">
          <input type="checkbox" id=${e}
            .checked=${t?!1!==this._config[e]:!0===this._config[e]}
            @change=${t=>this._valueChanged(e,t)} />
          <label for=${e}>${ut(`editor.${e}`)}</label>
        </div>
      `)}
    `}static get styles(){return s`
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
    `}};function _a(e){return Array.isArray(e)?e.filter(e=>"string"==typeof e&&e.trim().length>0):[]}function fa(e){const t=Array.isArray(e.machine_phases)?e.machine_phases:[],a=function(e){return e?Array.isArray(e)?{pre:e.filter(e=>"string"==typeof e)}:e:{}}(e.steps),i=[];for(const e of _a(a.pre))i.push({kind:"manual",text:e});const r=t.length;t.forEach((e,t)=>{for(const t of _a(e?.user_action_before))i.push({kind:"manual",text:t});const a=e&&"object"==typeof e.component&&null!==e.component?e.component:void 0;i.push({kind:"brew",phaseIndex:t,phaseCount:r,component:a})});for(const e of _a(a.post))i.push({kind:"manual",text:e});return i}function ga(e){const t=fa(e),a=t.filter(e=>"brew"===e.kind).length;return a>1||t.some(e=>"manual"===e.kind)}e([_e({attribute:!1})],ua.prototype,"hass",void 0),e([fe()],ua.prototype,"_config",void 0),e([fe()],ua.prototype,"_manualMode",void 0),ua=e([pe("melitta-barista-card-editor")],ua);const ha=["no_llm_agent","no_llm_agent_selected","llm_agent_missing"];function va(e){const t=ut("sommelier.brew_phase",{n:e.phaseIndex+1,total:e.phaseCount}),a=function(e){if("brew"!==e.kind||!e.component)return{process:null,portionMl:null,intensity:null};const t=e.component,a="string"==typeof t.process&&"none"!==t.process?t.process:null,i=t.portion_ml;return{process:a,portionMl:"number"==typeof i&&Number.isFinite(i)&&i>0?i:null,intensity:"coffee"===a&&"string"==typeof t.intensity?t.intensity:null}}(e),i=[];return a.process&&i.push(ut(`values.${a.process}`)),null!==a.portionMl&&i.push(ut("freestyle.portion_value",{value:a.portionMl})),a.intensity&&i.push(ut(`values.${a.intensity}`)),i.length?`${t} — ${i.join(", ")}`:t}let ba=class extends ce{constructor(){super(...arguments),this._favorites=[],this._hoppers={hopper1:null,hopper2:null},this._loaded=!1,this._error=!1,this._generating=!1,this._quickRecipe=null,this._wizard=null,this._infoFavId=null,this._loading=!1}willUpdate(e){dt(this.hass),!this.hass||this._loaded||this._loading||this._error||this._loadData()}async _loadData(){this._loading=!0;try{const[t,a]=await Promise.all([ca(this.hass),(e=this.hass,e.callWS({type:la.hoppersGet}))]);this._favorites=t.slice(0,3),this._hoppers=a,this._loaded=!0}catch(e){console.warn("[melitta-card] Sommelier not available:",e),this._error=!0}finally{this._loading=!1}var e}_retry(){this._error=!1}_notify(e){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e},bubbles:!0,composed:!0}))}async _surpriseMe(){if(this.hass&&!this._generating){this._generating=!0,this._quickRecipe=null;try{this._quickRecipe=await async function(e){return(await e.callWS({type:la.generate,mode:"surprise_me",count:1})).session.recipes[0]??null}(this.hass)}catch(e){console.error("[melitta-card] Generate failed:",e);const t=function(e){const t=e?.code;return"string"!=typeof t?null:ha.includes(t)?`sommelier.err.${t}`:null}(e);this._notify(ut(t??"sommelier.error_generate"))}finally{this._generating=!1}}}async _brewRecipe(e){var t,a;if(this.hass)if(ga(e))this._openWizard(e.name,{recipeId:e.id},e);else try{await(t=this.hass,a=e.id,t.callWS({type:la.brew,recipe_id:a})),this._quickRecipe=null}catch(e){console.error("[melitta-card] Brew failed:",e),this._notify(ut("sommelier.error_brew"))}}async _brewFavorite(e){var t,a;if(this.hass)if(ga(e))this._openWizard(e.name,{favoriteId:e.id},e);else try{await(t=this.hass,a=e.id,t.callWS({type:la.favoritesBrew,favorite_id:a})),this._favorites=this._favorites.map(t=>t.id===e.id?{...t,brew_count:(t.brew_count??0)+1}:t)}catch(e){console.error("[melitta-card] Brew favorite failed:",e),this._notify(ut("sommelier.error_brew"))}}_openWizard(e,t,a){this._wizard={name:e,target:t,plan:fa(a),index:0,brewing:!1,phaseRunning:!1}}_wizardClose(e){const t=this._wizard;this._wizard=null,e&&t&&(t.target.favoriteId&&(this._favorites=this._favorites.map(e=>e.id===t.target.favoriteId?{...e,brew_count:(e.brew_count??0)+1}:e)),t.target.recipeId&&(this._quickRecipe=null))}_wizardAdvance(){const e=this._wizard;e&&(e.index+1>=e.plan.length?this._wizardClose(!0):this._wizard={...e,index:e.index+1,phaseRunning:!1})}async _wizardBrew(){const e=this._wizard;if(!e||!this.hass||e.brewing)return;const t=e.plan[e.index];if("brew"===t.kind){this._wizard={...e,brewing:!0};try{await(a=this.hass,i=e.target,r=t.phaseIndex,a.callWS({type:`${he}/sommelier/brew_phase`,...i.recipeId?{recipe_id:i.recipeId}:{},...i.favoriteId?{favorite_id:i.favoriteId}:{},phase_index:r})),e.index+1>=e.plan.length?this._wizardClose(!0):this._wizard={...e,brewing:!1,phaseRunning:!0}}catch(t){console.error("[melitta-card] Brew phase failed:",t),this._notify(ut("sommelier.error_brew")),this._wizard={...e,brewing:!1}}var a,i,r}}render(){return H`
      <div class="section-title">
        <ha-icon icon="mdi:coffee-maker-check-outline"></ha-icon> ${ut("sommelier.title")}
      </div>
      <div class="mbc-section">${this._renderBody()}</div>
    `}_renderBody(){if(this._error)return H`
        <div class="som-error">
          <span>${ut("sommelier.unavailable")}</span>
          <button class="som-retry-btn" @click=${()=>this._retry()}>${ut("common.retry")}</button>
        </div>
      `;if(!this._loaded)return H`<span class="som-loading">${ut("common.loading")}</span>`;const e=this._hoppers.hopper1?.bean,t=this._hoppers.hopper2?.bean;return H`
      ${e||t?H`
        <div class="som-hoppers">
          ${e?H`<span class="som-hopper-tag">H1: ${e.brand} ${e.product}</span>`:Z}
          ${t?H`<span class="som-hopper-tag">H2: ${t.brand} ${t.product}</span>`:Z}
        </div>
      `:Z}

      ${this._favorites.length>0?H`
        <div class="som-favorites">
          ${this._favorites.map(e=>H`
            <div class="som-fav-row">
              <div class="som-fav-info">
                <span class="som-fav-name">★ ${e.name}</span>
                <span class="som-fav-count">${e.brew_count}×</span>
              </div>
              <div class="som-fav-actions">
                <button class="som-info-btn"
                  title=${ut("sommelier.info")}
                  aria-label=${ut("sommelier.info")}
                  aria-expanded=${this._infoFavId===e.id}
                  @click=${()=>{this._infoFavId=this._infoFavId===e.id?null:e.id}}>
                  <ha-icon icon="mdi:information-outline"></ha-icon>
                </button>
                <button class="som-brew-btn" @click=${()=>this._brewFavorite(e)}>
                  <ha-icon icon="mdi:coffee"></ha-icon>
                </button>
              </div>
            </div>
            ${this._infoFavId===e.id?this._renderFavInfo(e):Z}
          `)}
        </div>
      `:Z}

      ${this._quickRecipe?H`
        <div class="som-quick-recipe">
          <div class="som-quick-name">${this._quickRecipe.name}</div>
          <div class="som-quick-desc">${this._quickRecipe.description}</div>
          ${this._quickRecipe.reasoning?H`
            <details class="som-reasoning">
              <summary>${ut("sommelier.reasoning")}</summary>
              <div class="som-reasoning-text">${this._quickRecipe.reasoning}</div>
            </details>
          `:Z}
          <button class="som-brew-btn full" @click=${()=>this._brewRecipe(this._quickRecipe)}>
            <ha-icon icon="mdi:coffee"></ha-icon> ${ut("common.brew")}
          </button>
        </div>
      `:Z}

      ${this._wizard?this._renderWizard(this._wizard):Z}

      <div class="som-actions">
        <button class="som-surprise-btn" @click=${()=>this._surpriseMe()}
          ?disabled=${this._generating}>
          ${this._generating?H`<ha-icon icon="mdi:loading" class="spin"></ha-icon> ${ut("sommelier.generating")}`:H`<ha-icon icon="mdi:auto-fix"></ha-icon> ${ut("sommelier.surprise_me")}`}
        </button>
      </div>
    `}_renderFavInfo(e){const t=fa(e);return H`
      <div class="som-fav-details">
        ${e.description?H`<div class="som-fav-desc">${e.description}</div>`:Z}
        ${t.length>0?H`
          <div class="som-fav-steps-title">${ut("sommelier.steps")}</div>
          <ol class="som-fav-steps">
            ${t.map(e=>H`
              <li>${"manual"===e.kind?e.text:va(e)}</li>
            `)}
          </ol>
        `:Z}
      </div>
    `}_renderWizard(e){const t=e.plan[e.index],a=e.plan.length;return H`
      <div class="som-wizard-backdrop" @click=${()=>this._wizardClose(!1)}></div>
      <div class="som-wizard" role="dialog" aria-modal="true">
        <div class="som-wiz-head">
          <span class="som-wiz-title">${ut("sommelier.wizard_title")}</span>
          <span class="som-wiz-name">${e.name}</span>
        </div>
        <div class="som-wiz-progress">
          ${ut("sommelier.step_of",{n:e.index+1,total:a})}
        </div>
        <ol class="som-wiz-steps">
          ${e.plan.map((t,a)=>H`
            <li class=${a===e.index?"current":a<e.index?"done":""}>
              ${"manual"===t.kind?t.text:va(t)}
            </li>
          `)}
        </ol>
        ${e.phaseRunning?H`
          <div class="som-wiz-note">${ut("sommelier.phase_running")}</div>
        `:Z}
        <div class="som-wiz-actions">
          <button class="som-retry-btn" @click=${()=>this._wizardClose(!1)}>
            ${ut("sommelier.cancel")}
          </button>
          ${"manual"===t.kind||e.phaseRunning?H`
            <button class="som-brew-btn" @click=${()=>this._wizardAdvance()}>
              ${e.index+1>=a?ut("sommelier.finish"):ut("sommelier.done")}
            </button>
          `:H`
            <button class="som-brew-btn" ?disabled=${e.brewing}
              @click=${()=>this._wizardBrew()}>
              ${e.brewing?H`<ha-icon icon="mdi:loading" class="spin"></ha-icon>`:H`<ha-icon icon="mdi:coffee"></ha-icon>`}
              ${ut("sommelier.brew_phase",{n:t.phaseIndex+1,total:t.phaseCount})}
            </button>
          `}
        </div>
      </div>
    `}static get styles(){return s`
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

      .som-fav-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .som-info-btn {
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 6px;
        border: 1px solid var(--mbc-border);
        background: transparent;
        color: var(--mbc-text2);
        cursor: pointer;
        transition: all 0.15s;
      }
      .som-info-btn:hover { background: var(--mbc-surface); color: var(--mbc-text); }
      .som-info-btn ha-icon { --mdc-icon-size: 15px; }
      .som-fav-details {
        margin: -2px 0 4px;
        padding: 8px 10px;
        border-radius: 0 0 8px 8px;
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-border);
        border-top: none;
      }
      .som-fav-desc {
        font-size: 0.74em;
        color: var(--mbc-text2);
        line-height: 1.35;
      }
      .som-fav-steps-title {
        font-size: 0.66em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--mbc-text2);
        margin: 8px 0 4px;
        opacity: 0.8;
      }
      .som-fav-steps {
        margin: 0;
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: 0.74em;
        color: var(--mbc-text);
      }

      .som-reasoning { margin: 6px 0 2px; }
      .som-reasoning summary {
        cursor: pointer;
        font-size: 0.72em;
        color: var(--mbc-text2);
      }
      .som-reasoning-text {
        font-size: 0.72em;
        color: var(--mbc-text2);
        line-height: 1.35;
        padding: 4px 0 2px 12px;
      }

      .som-wizard-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 6;
      }
      .som-wizard {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 7;
        width: min(340px, calc(100vw - 32px));
        max-height: 80vh;
        overflow-y: auto;
        padding: 14px;
        border-radius: 12px;
        background: var(--mbc-bg, var(--card-background-color, #fff));
        border: 1px solid var(--mbc-border);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
      }
      .som-wiz-head { display: flex; flex-direction: column; gap: 2px; }
      .som-wiz-title {
        font-size: 0.68em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--mbc-text2);
      }
      .som-wiz-name { font-size: 0.9em; font-weight: 600; color: var(--mbc-text); }
      .som-wiz-progress { font-size: 0.7em; color: var(--mbc-text2); margin: 6px 0 4px; }
      .som-wiz-steps {
        margin: 4px 0 8px;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.78em;
        color: var(--mbc-text2);
      }
      .som-wiz-steps li.current { color: var(--mbc-text); font-weight: 600; }
      .som-wiz-steps li.done { text-decoration: line-through; opacity: 0.6; }
      .som-wiz-note {
        font-size: 0.72em;
        color: var(--mbc-text);
        background: var(--mbc-surface);
        border: 1px solid var(--mbc-border);
        border-radius: 8px;
        padding: 6px 8px;
        margin-bottom: 8px;
      }
      .som-wiz-actions {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
      .som-wiz-actions .som-brew-btn { padding: 6px 12px; }
    `}};e([_e({attribute:!1})],ba.prototype,"hass",void 0),e([fe()],ba.prototype,"_favorites",void 0),e([fe()],ba.prototype,"_hoppers",void 0),e([fe()],ba.prototype,"_loaded",void 0),e([fe()],ba.prototype,"_error",void 0),e([fe()],ba.prototype,"_generating",void 0),e([fe()],ba.prototype,"_quickRecipe",void 0),e([fe()],ba.prototype,"_wizard",void 0),e([fe()],ba.prototype,"_infoFavId",void 0),ba=e([pe("mbc-sommelier")],ba);let ya=class extends ce{constructor(){super(...arguments),this._resolvedPrefix=null,this._fsName="Custom",this._fsRecipe={c1:{process:"coffee",intensity:"medium",aroma:"standard",temperature:"normal",shots:"one",portion_ml:40},c2:{process:"none",intensity:"medium",aroma:"standard",temperature:"normal",shots:"none",portion_ml:0}},this._selectedDk=null,this._twoCups=!1,this._editDk=null,this._editState=null,this._editSaving=!1,this._confirmKey=null,this._busyKey=null,this._dkLongPressTimer=null,this._dkLongPressTriggered=!1,this._detectedName=null,this._trackedIds=[],this._trackedPrefix=null,this._contract=null,this._bridge=null,this._tokens=null,this._contractFetchInFlight=!1}disconnectedCallback(){super.disconnectedCallback(),this._cancelDkLongPress()}static getConfigElement(){return document.createElement("melitta-barista-card-editor")}static getStubConfig(e){const t=da(e);return{entity_prefix:t.length>0?t[0].prefix:"",name:t.length>0?t[0].name:"Melitta Barista",show_recipes:!0,show_settings:!1,compact:!1}}setConfig(e){this._config={...e,show_header:!1!==e.show_header,show_status:!1!==e.show_status,show_recipes:!1!==e.show_recipes,show_profiles:!1!==e.show_profiles,show_freestyle:e.show_freestyle||!1,show_settings:e.show_settings||!1,show_stats:e.show_stats||!1,show_maintenance:e.show_maintenance||!1,compact:e.compact||!1},this._resolvedPrefix=null,this._detectedName=null,this._trackedIds=[],this._trackedPrefix=null,this._contract=null,this._bridge=null,this._tokens=null}getCardSize(){if(!this._config)return 5;if(this._config.compact)return 3;let e=5;return this._config.show_freestyle&&(e+=4),this._config.show_sommelier&&(e+=2),this._config.show_stats&&(e+=3),this._config.show_maintenance&&(e+=4),this._config.show_settings&&(e+=2),e}getGridOptions(){return{rows:this.getCardSize(),columns:6,min_rows:2,min_columns:3}}_getPrefix(){return this._config?.entity_prefix||this._resolvedPrefix}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass");return!t||(t.locale?.language!==this.hass.locale?.language||(0===this._trackedIds.length||this._trackedIds.some(e=>t.states[e]!==this.hass.states[e])))}willUpdate(e){if(!this.hass||!this._config)return;if(dt(this.hass),!this._config.entity_prefix&&!this._resolvedPrefix&&e.has("hass")){const e=da(this.hass);e.length>0&&(this._resolvedPrefix=e[0].prefix,this._detectedName=e[0].name)}const t=this._getPrefix();t&&this._trackedPrefix!==t&&(this._trackedPrefix=t,this._trackedIds=this._buildTrackedIds(t)),this._updateContractBridge(t)}_updateContractBridge(e){if(this._bridge=e?function(e){if(!Wt(e))return null;const t=e.contract_version;if("number"!=typeof t||!Zt.includes(t))return null;const a=e.entry_id;return"string"!=typeof a||""===a?null:{entry_id:a,contract_version:t,contract_fingerprint:Gt(e.contract_fingerprint),connected:!0===e.connected}}(this.hass.states[`sensor.${e}_connection`]?.attributes):null,this._tokens=this._bridge&&e?function(e,t){if(!t)return null;if(!Wt(e))return null;if(!("process_token"in e))return null;const a=e.info_messages;return{process_token:Gt(e.process_token),sub_process_token:Gt(e.sub_process_token),manipulation_token:Gt(e.manipulation_token),info_messages:Array.isArray(a)?a.filter(e=>"string"==typeof e):[],is_brewing:!0===e.is_brewing,awaiting_confirmation:!0===e.awaiting_confirmation}}(this.hass.states[`sensor.${e}_state`]?.attributes,this._bridge):null,!this._bridge)return void(null!==this._contract&&(this._contract=null));if(function(e){const t=Jt(e.entry_id),a=e.contract_fingerprint;null!==a&&a!==t.lastFingerprint&&(t.retryArmed=!0),!1===t.lastConnected&&e.connected&&(t.retryArmed=!0),t.lastConnected=e.connected,t.lastFingerprint=a}(this._bridge),this._contractFetchInFlight)return;const t=this._bridge;this._contract&&this._contract.contract_fingerprint===t.contract_fingerprint||(this._contractFetchInFlight=!0,ea(this.hass,t.entry_id,t.contract_fingerprint).then(e=>{this._contractFetchInFlight=!1,this._contract=e}))}_buildTrackedIds(e){return[...["state","activity","progress","action_required","connection","total_cups"].map(t=>`sensor.${e}_${t}`),`select.${e}_recipe`,`select.${e}_profile`,...Ie.map(t=>`switch.${e}_${t}`),...Ce.map(t=>`number.${e}_${t}`),...[...Fe,...Te,...Re].map(t=>`button.${e}_${t.suffix}`),`button.${e}_brew`,`button.${e}_cancel`]}_entity(e,t){const a=this._getPrefix();if(a)return this.hass.states[`${e}.${a}_${t}`]}_state(e){const t=this._getPrefix();if(!t)return null;for(const a of["sensor","button","select","number","switch"]){const i=this.hass.states[`${a}.${t}_${e}`];if(i)return i.state}return null}_recipeEntity(){return this._entity("select","recipe")}_recipeOptions(){return this._recipeEntity()?.attributes?.options||[]}_selectedRecipe(){const e=this._recipeEntity()?.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}_selectRecipe(e){const t=this._getPrefix();t&&(this._selectedDk=null,oa(this.hass,t,"recipe",e))}_profileEntity(){return this._entity("select","profile")}_profileOptions(){return this._profileEntity()?.attributes?.options||[]}_selectedProfile(){const e=this._profileEntity()?.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}_selectProfile(e){const t=this._getPrefix();if(!t)return;const a=function(e,t){if(!(!Number.isInteger(t)||t<0||t>=e.length))return e[t]}(this._profileOptions(),e);void 0!==a?oa(this.hass,t,"profile",a):console.warn(`melitta-barista-card: no profile option for slot ${e}`)}_getDirectKeyData(){return function(e){if(!e)return null;const t=e.directkey_recipes,a=e.active_profile??0;if(!t)return null;const i={};for(const[e,a]of Object.entries(t)){const t=Number(e);i[t]={};for(const[e,r]of Object.entries(a)){const a=Me[e]||e;i[t][a]=r}}return{activeProfile:a,profiles:i}}(this._profileEntity()?.attributes)}_brew(){const e=this._getPrefix();e&&sa(this.hass,e,"brew")}_cancelBrew(){const e=this._getPrefix();e&&sa(this.hass,e,"cancel")}_brewDirectkey(e){const t=this._getPrefix();t&&function(e,t,a,i){e.callService(he,"brew_directkey",{entity_id:`button.${t}_brew`,category:a,two_cups:i})}(this.hass,t,e,this._twoCups)}_brewFreestyle(){const e=this._getPrefix();e&&function(e,t,a,i){e.callService(he,"brew_freestyle",{entity_id:`button.${t}_brew`,name:a,...Be(i)})}(this.hass,e,this._fsName,this._fsRecipe)}_toggleSwitch(e,t){const a=this._getPrefix();a&&function(e,t,a,i){e.callService("switch",i?"turn_on":"turn_off",{entity_id:`switch.${t}_${a}`})}(this.hass,a,e,t)}_saveDirectkey(){if(!this._editDk||!this._editState)return;const e=this._getPrefix();if(!e)return;this._editSaving=!0;const t=this._getDirectKeyData();(function(e,t,a,i,r){return e.callService(he,"save_directkey",{entity_id:`button.${t}_brew`,category:a,profile_id:i,...Be(r)})})(this.hass,e,this._editDk.category,t?.activeProfile??0,this._editState).then(()=>{this._editDk=null,this._editState=null,this._editSaving=!1}).catch(()=>{this._editSaving=!1})}_pressMaintenanceButton(e){if(e.confirm&&this._confirmKey!==e.key)return void(this._confirmKey=e.key);const t=this._getPrefix();t&&(this._confirmKey=null,this._busyKey=e.key,sa(this.hass,t,e.suffix).finally(()=>{setTimeout(()=>{this._busyKey=null},2e3)}))}_startDkLongPress(e,t){this._dkLongPressTriggered=!1,this._dkLongPressTimer=setTimeout(()=>{this._dkLongPressTriggered=!0,this._openEditDialog(e,t)},500)}_cancelDkLongPress(){this._dkLongPressTimer&&(clearTimeout(this._dkLongPressTimer),this._dkLongPressTimer=null)}_handleDkClick(e){this._dkLongPressTriggered||(this._selectedDk===e?this._brewDirectkey(e):this._selectedDk=e)}_openEditDialog(e,t){this._editDk={category:e,recipe:t},this._editState=function(e){return{c1:{process:e.c1_process||"coffee",intensity:e.c1_intensity||"medium",aroma:e.c1_aroma||"standard",temperature:e.c1_temperature||"normal",shots:Le[e.c1_shots]||"one",portion_ml:e.c1_portion_ml||40},c2:{process:e.c2_process||"none",intensity:e.c2_intensity||"medium",aroma:e.c2_aroma||"standard",temperature:e.c2_temperature||"normal",shots:Le[e.c2_shots]||"none",portion_ml:e.c2_portion_ml||0}}}(t),this._editSaving=!1}_closeEditDialog(){this._editDk=null,this._editState=null}_updateFs(e,t){this._fsRecipe={...this._fsRecipe,[e]:{...this._fsRecipe[e],...t}}}_updateEdit(e,t){this._editState&&(this._editState={...this._editState,[e]:{...this._editState[e],...t}})}render(){if(!this.hass||!this._config)return Z;if(!this._getPrefix())return H`<ha-card>${H`
    <div class="no-device">
      <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
      <p>${ut("card.no_device")}</p>
      <p class="hint">${ut("card.no_device_hint")}</p>
    </div>
  `}</ha-card>`;const e=function(e,t){const a=t?.tokens;if(a){const i=a.process_token,r=a.manipulation_token;return{state:Ot(i),activity:Ht(a.sub_process_token),isConnected:t.connected,isUnavailable:!1,isBrewing:a.is_brewing,isReady:"READY"===i&&"NONE"===r,isBusy:"BUSY"===i,actionRequired:null!=r&&"NONE"!==r?Ut(r):null,progress:qt(e("progress")),stateColor:null!=i&&Pe[i]||Pe.BUSY}}const i=e("state")||"unavailable",r=e("activity"),n=e("action_required"),s=e("connection")||"Disconnected";return{state:i,activity:Bt(r)?r:"Idle",isConnected:"Connected"===s,isUnavailable:"unavailable"===i||"unknown"===i,isBrewing:"Brewing"===i,isReady:"Ready"===i,isBusy:"Busy"===i,actionRequired:Bt(n)?n:null,progress:qt(e("progress")),stateColor:Pe[i.toLowerCase()]||"var(--primary-text-color)"}}(e=>this._state(e),this._bridge?{tokens:this._tokens,connected:this._bridge.connected}:void 0),t=this._config.name||this._detectedName||ut("common.default_name"),a=this._config.show_header,i=na(this._contract?.brand_theme);return e.isUnavailable?H`<ha-card>
        ${a?Tt(t,!1,i):Z}
        ${H`
    <div class="offline-section">
      <ha-icon icon="mdi:bluetooth-off"></ha-icon>
      <span>${ut("card.machine_offline")}</span>
    </div>
  `}
      </ha-card>`:H`<ha-card>
      ${a?Tt(t,e.isConnected,i):Z}

      ${this._config.show_status&&!e.isBrewing?function(e){return H`
    <div class="status-section">
      <div class="state-row">
        <span class="state-badge"
          style="background: color-mix(in srgb, ${e.stateColor} 10%, transparent); color: ${e.stateColor}">
          ${mt(`state.${e.state.toLowerCase()}`)??e.state}
        </span>
      </div>
    </div>

    ${e.actionRequired?H`
      <div class="action-alert">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <span>${e.actionRequired}</span>
      </div>
    `:Z}
  `}(e):Z}

      ${e.isBrewing?function(e,t,a,i){return H`
    <div class="brewing-view">
      <div class="brewing-icon-wrap">
        ${(i??Nt)(e||"Espresso",64,"brew-active")}
      </div>
      <div class="brewing-info">
        <span class="brewing-recipe">${e||ut("state.brewing")}</span>
        <span class="brewing-activity">${t.activity}</span>
        ${null!==t.progress?H`
          <div class="brewing-progress">
            <div class="brewing-progress-fill" style="width: ${t.progress}%"></div>
          </div>
          <span class="brewing-percent">${Math.round(t.progress)}%</span>
        `:Z}
      </div>
      <button class="brewing-cancel" @click=${a}>
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>
  `}(this._selectedRecipe(),e,()=>this._cancelBrew(),(e,t,a)=>this._renderRecipeIcon(e,t,a)):Z}

      ${!e.isBrewing&&this._config.show_profiles&&e.isReady&&this._profileOptions().length>1?this._renderProfileTabs():Z}

      ${!e.isBrewing&&e.isReady?this._renderDirectKey():Z}

      ${!e.isBrewing&&this._config.show_recipes&&this._recipeOptions().length>0?this._renderRecipes():Z}

      ${!e.isBrewing&&this._config.show_freestyle&&e.isReady&&(r=this._contract,!r||!1!==r.capabilities.supports_freestyle)?this._renderFreestyle():Z}

      ${this._config.show_sommelier?H`<mbc-sommelier .hass=${this.hass}></mbc-sommelier>`:Z}

      ${this._config.show_stats?this._renderStats():Z}

      ${this._config.show_maintenance?this._renderMaintenance(e):Z}

      ${this._config.show_settings?this._renderSettings():Z}

      ${this._editDk?this._renderEditDialog():Z}
    </ha-card>`;var r}_renderProfileTabs(){return e={options:this._profileOptions(),selected:this._selectedProfile(),onSelect:e=>this._selectProfile(e)},H`
    <div class="profile-tabs">
      ${e.options.map((t,a)=>H`
        <button class="profile-tab" ?data-active=${t===e.selected}
          @click=${()=>{t!==e.selected&&e.onSelect(a)}}>
          ${t}
          ${t===e.selected?H`<span class="profile-tab-indicator"></span>`:Z}
        </button>
      `)}
      <span class="profile-tabs-version">v${ge}</span>
    </div>
  `;var e}_renderDirectKey(){const e=this._getDirectKeyData();return e?Rt({data:e,selected:this._selectedDk,twoCups:this._twoCups,onCardClick:e=>this._handleDkClick(e),onLongPressStart:(e,t)=>this._startDkLongPress(e,t),onLongPressCancel:()=>this._cancelDkLongPress(),onToggleTwoCups:()=>{this._twoCups=!this._twoCups}}):Z}_renderRecipes(){const e=this._getDirectKeyData(),t=!!e&&Object.keys(e.profiles[e.activeProfile]??{}).length>0;return a={options:this._recipeOptions(),selected:this._selectedRecipe(),hasDk:t,dkActive:null!==this._selectedDk,onSelect:e=>this._selectRecipe(e),onBrew:()=>this._brew(),renderIcon:(e,t,a)=>this._renderRecipeIcon(e,t,a)},H`
    ${a.hasDk?H`
      <div class="recipes-divider">
        <span class="recipes-divider-line"></span>
        <span class="recipes-divider-text">${ut("recipes.all_recipes")}</span>
        <span class="recipes-divider-line"></span>
      </div>
    `:H`<div class="section-title">${ut("recipes.title")}</div>`}
    <div class="recipe-grid">
      ${a.options.map(e=>{const t=e.replace(/[^a-zA-Z0-9]/g,""),i=e===a.selected&&!a.dkActive;return H`
          <div class="recipe-card"
            ?data-selected=${i}
            @click=${()=>{i?a.onBrew():a.onSelect(e)}}>
            ${(a.renderIcon??Nt)(e,48,`r-${t}`)}
            <span class="recipe-name">${e}</span>
          </div>
        `})}
    </div>
  `;var a}_renderRecipeIcon(e,t,a){const i=function(e,t,a){if(Array.isArray(t))for(const a of t)if(Ve(a)&&a.name===e&&"icon"in a)return He(a);if(a&&Array.isArray(a.recipes))for(const t of a.recipes)if(Ve(t)&&t.name===e&&"icon"in t)return He(t);return{found:!1,icon:null}}(e,this._recipeEntity()?.attributes?.recipes,this._contract);return i.found?function(e,t,a){const i=Ct(e,t);return null===i?Nt("",t,a):Et(i.frame,i.layers,i.steam,t,a)}(i.icon,t,a):Nt(e,t,a)}_renderFreestyle(){const e=Oe(this._contract);return H`
      <div class="section-title">${ut("freestyle.title")}</div>
      <div class="freestyle-section">
        <div class="freestyle-name-row">
          <input class="freestyle-name-input" type="text"
            placeholder=${ut("freestyle.drink_name_placeholder")}
            .value=${this._fsName}
            @input=${e=>{this._fsName=e.target.value}} />
        </div>

        <div class="freestyle-components">
          ${gt({title:ut("freestyle.component",{n:1}),containerClass:"freestyle-component",spec:this._fsRecipe.c1,allowNoneProcess:!1,vocab:e,onChange:e=>this._updateFs("c1",e)})}
          ${gt({title:ut("freestyle.component",{n:2}),containerClass:"freestyle-component",spec:this._fsRecipe.c2,allowNoneProcess:!0,vocab:e,onChange:e=>this._updateFs("c2",e)})}
        </div>

        <div class="freestyle-brew-row">
          <button class="brew-btn" @click=${()=>this._brewFreestyle()}>
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            ${ut("freestyle.brew_named",{name:this._fsName})}
          </button>
        </div>
      </div>
    `}_renderStats(){return Lt(this._entity("sensor","total_cups"))}_renderMaintenance(e){const t=this._getPrefix();return t?function(e){const t=(t,a)=>{const i=a.map(t=>{if(!e.hasEntity(t.suffix))return Z;const a=e.confirmKey===t.key,i=e.busyKey===t.key,r=!e.st.isConnected||!e.st.isReady||i;return H`
        <div class="maint-card" ?data-confirming=${a}>
          <ha-icon class="maint-icon" icon="${t.icon}"></ha-icon>
          <div class="maint-info">
            <div class="maint-label">${ut(`maintenance.actions.${t.key}.label`)}</div>
            <div class="maint-desc">${ut(`maintenance.actions.${t.key}.desc`)}</div>
          </div>
          <button class="maint-btn" ?data-confirm=${a} ?disabled=${r}
            @click=${a=>{a.stopPropagation(),e.onPress(t)}}>
            ${i?"...":ut(a?"common.confirm":"common.start")}
          </button>
        </div>
      `}).filter(e=>e!==Z);return 0===i.length?Z:H`
      <div class="maint-group-title">${t}</div>
      <div class="maint-grid">${i}</div>
    `};return H`
    <div class="section-title">${ut("maintenance.title")}</div>
    <div class="maint-section" @click=${()=>e.onDismissConfirm()}>
      ${t(ut("maintenance.groups.cleaning"),Fe)}
      ${t(ut("maintenance.groups.filter"),Te)}
      ${t(ut("maintenance.groups.other"),Re)}
    </div>
  `}({st:e,hasEntity:e=>!!this.hass.states[`button.${t}_${e}`],confirmKey:this._confirmKey,busyKey:this._busyKey,onPress:e=>this._pressMaintenanceButton(e),onDismissConfirm:()=>{this._confirmKey&&(this._confirmKey=null)}}):Z}_renderSettings(){const e=this._getPrefix();return e?function(e){const t=Ie.map(t=>{const a=e.getEntity("switch",t);if(!a)return Z;const i="on"===a.state;return H`
      <div class="setting-card">
        <ha-icon class="setting-icon" icon="${Ee[t].icon}"></ha-icon>
        <div class="setting-info">
          <div class="setting-label">${ut(`settings.switches.${t}.label`)}</div>
          <div class="setting-desc">${ut(`settings.switches.${t}.desc`)}</div>
        </div>
        <button class="toggle-track" ?data-on=${i}
          @click=${()=>e.onToggle(t,!i)}>
          <span class="toggle-thumb"></span>
        </button>
      </div>
    `}),a=Ce.map(t=>{const a=e.getEntity("number",t);if(!a)return Z;const i=Ne[t],r=Bt(a.state)?parseFloat(a.state):NaN;let n;return n=Number.isNaN(r)?"—":"level"===i.format?mt(`settings.levels.${t}.${r}`)??String(r):ut("settings.minutes",{value:r}),H`
      <div class="setting-card">
        <ha-icon class="setting-icon" icon="${i.icon}"></ha-icon>
        <div class="setting-info">
          <div class="setting-label">${ut(`settings.numbers.${t}.label`)}</div>
          <div class="setting-desc">${ut(`settings.numbers.${t}.desc`)}</div>
        </div>
        <span class="setting-value">${n}</span>
      </div>
    `});return t.every(e=>e===Z)&&a.every(e=>e===Z)?Z:H`
    <div class="section-title">${ut("settings.title")}</div>
    <div class="settings-grid">
      ${t}
      ${a}
    </div>
  `}({getEntity:(t,a)=>this.hass.states[`${t}.${e}_${a}`],onToggle:(e,t)=>this._toggleSwitch(e,t)}):Z}_renderEditDialog(){if(!this._editDk||!this._editState)return Z;const e=this._editState,t=this._editDk.category,a=Oe(this._contract);return H`
      <div class="edit-overlay" @click=${()=>this._closeEditDialog()}>
        <div class="edit-dialog" @click=${e=>e.stopPropagation()}>
          <div class="edit-header">
            <span class="edit-title">
              ${ut("edit_dialog.title",{drink:ut(`drinks.${t}`)})}
            </span>
            <button class="edit-close" @click=${()=>this._closeEditDialog()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="edit-body">
            ${gt({title:ut("freestyle.component",{n:1}),containerClass:"edit-component",spec:e.c1,allowNoneProcess:!1,longTemperatureLabel:!0,vocab:a,onChange:e=>this._updateEdit("c1",e)})}
            ${gt({title:ut("freestyle.component",{n:2}),containerClass:"edit-component",spec:e.c2,allowNoneProcess:!0,longTemperatureLabel:!0,vocab:a,onChange:e=>this._updateEdit("c2",e)})}
          </div>
          <div class="edit-footer">
            <button class="edit-btn-cancel" @click=${()=>this._closeEditDialog()}>
              ${ut("common.cancel")}
            </button>
            <button class="edit-btn-save" ?disabled=${this._editSaving} @click=${()=>this._saveDirectkey()}>
              ${this._editSaving?"...":ut("common.save")}
            </button>
          </div>
        </div>
      </div>
    `}static get styles(){return pa}};e([_e({attribute:!1})],ya.prototype,"hass",void 0),e([fe()],ya.prototype,"_config",void 0),e([fe()],ya.prototype,"_resolvedPrefix",void 0),e([fe()],ya.prototype,"_fsName",void 0),e([fe()],ya.prototype,"_fsRecipe",void 0),e([fe()],ya.prototype,"_selectedDk",void 0),e([fe()],ya.prototype,"_twoCups",void 0),e([fe()],ya.prototype,"_editDk",void 0),e([fe()],ya.prototype,"_editState",void 0),e([fe()],ya.prototype,"_editSaving",void 0),e([fe()],ya.prototype,"_confirmKey",void 0),e([fe()],ya.prototype,"_busyKey",void 0),e([fe()],ya.prototype,"_contract",void 0),ya=e([pe("melitta-barista-card")],ya),window.customCards=window.customCards||[],window.customCards.some(e=>"melitta-barista-card"===e.type)||window.customCards.push({type:"melitta-barista-card",name:"Melitta Barista Card",description:"Premium control card for Melitta Barista coffee machines",preview:!0,documentationURL:"https://github.com/dzerik/melitta-barista-card"}),console.info(`%c MELITTA-BARISTA-CARD %c v${ge} `,"color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;","color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;");export{ya as MelittaBaristaCard};
//# sourceMappingURL=melitta-barista-card.js.map
