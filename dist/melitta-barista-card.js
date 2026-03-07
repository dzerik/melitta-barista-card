function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,_=g?g.emptyScript:"",v=f.reactiveElementPolyfillSupport,$=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),y={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:m).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??b)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[$("elementProperties")]=new Map,x[$("finalized")]=new Map,v?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,S=w.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+P,O=`<${k}>`,R=document,M=()=>R.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,N="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,j=/>/g,B=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),J=new WeakMap,K=R.createTreeWalker(R,129);function Z(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const F=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(o.lastIndex=h,c=o.exec(i),null!==c);)h=o.lastIndex,o===H?"!--"===c[1]?o=z:void 0!==c[1]?o=j:void 0!==c[2]?(L.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=B):void 0!==c[3]&&(o=B):o===B?">"===c[0]?(o=r??H,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?B:'"'===c[3]?I:D):o===I||o===D?o=B:o===z||o===j?o=H:(o=B,r=void 0);const d=o===B&&t[e+1].startsWith("/>")?" ":"";n+=o===H?i+O:l>=0?(s.push(a),i.slice(0,l)+C+i.slice(l)+P+d):i+P+(-2===l?e:d)}return[Z(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[c,l]=F(t,e);if(this.el=G.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=l[n++],i=s.getAttribute(t).split(P),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(P),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),K.nextNode(),a.push({type:2,index:++r});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(P,t+1));)a.push({type:7,index:r}),t+=P.length-1}r++}}static createElement(t,e){const i=R.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=U(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??R).importNode(e,!0);K.currentNode=s;let r=K.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=K.nextNode(),n++)}return K.currentNode=R,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),U(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(R.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new G(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Y(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Q(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Q(this,s[i+o],e,o),a===W&&(a=this._$AH[o]),n||=!U(a)||a!==this._$AH[o],a===V?t=V:t!==V&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===W)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,Y),(w.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Y(e.insertBefore(M(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const ct=ot.litElementPolyfillSupport;ct?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:b},dt=(t=ht,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const ft={ready:"var(--state-active-color, #4caf50)",brewing:"var(--warning-color, #ff9800)",cleaning:"var(--info-color, #2196f3)",descaling:"var(--info-color, #2196f3)",off:"var(--disabled-color, #9e9e9e)",busy:"var(--warning-color, #ff9800)",unavailable:"var(--error-color, #f44336)"},gt=["energy_saving","auto_bean_select","rinsing_disabled"],_t=["water_hardness","auto_off_after","brew_temperature"];function vt(t){const e=new Set;for(const i of Object.keys(t.states)){const t=i.match(/^button\.(.+?)_brew$/);t&&e.add(t[1])}const i=[];for(const s of e){const e=t.states[`sensor.${s}_state`];if(!e)continue;const r=e.attributes.friendly_name,n=r?r.replace(/\s*State$/,""):s.replace(/_/g," ");i.push({prefix:s,name:n})}return i}let $t=class extends at{setConfig(t){this._config=t}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0});this.dispatchEvent(t)}_valueChanged(t,e){const i=e.target,s=i instanceof HTMLInputElement&&"checkbox"===i.type?i.checked:i.value;this._config={...this._config,[t]:s},this._fireConfigChanged()}_deviceSelected(t){const e=t.target.value;if("__manual__"===e)return this._config={...this._config,entity_prefix:""},void this._fireConfigChanged();const i=(this.hass?vt(this.hass):[]).find(t=>t.prefix===e);this._config={...this._config,entity_prefix:e,name:i?.name||this._config.name},this._fireConfigChanged()}render(){if(!this._config)return q``;const t=this.hass?vt(this.hass):[],e=this._config.entity_prefix||"",i=t.some(t=>t.prefix===e),s=e&&!i&&t.length>0;return q`
      ${t.length>0?q`
            <div class="editor-row">
              <label for="device">Device</label>
              <select
                id="device"
                @change=${this._deviceSelected}
              >
                ${t.map(t=>q`
                    <option value=${t.prefix} ?selected=${t.prefix===e}>
                      ${t.name}
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
                .value=${e}
                placeholder="Auto-detected if integration is running"
                @input=${t=>this._valueChanged("entity_prefix",t)}
              />
              <span class="hint">No Melitta devices detected. Enter prefix manually or check that the integration is configured.</span>
            </div>
          `}

      ${s?q`
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
        <input
          type="checkbox"
          id="show_recipes"
          .checked=${!1!==this._config.show_recipes}
          @change=${t=>this._valueChanged("show_recipes",t)}
        />
        <label for="show_recipes">Show recipe selector</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="show_settings"
          .checked=${this._config.show_settings||!1}
          @change=${t=>this._valueChanged("show_settings",t)}
        />
        <label for="show_settings">Show settings</label>
      </div>
      <div class="checkbox-row">
        <input
          type="checkbox"
          id="compact"
          .checked=${this._config.compact||!1}
          @change=${t=>this._valueChanged("compact",t)}
        />
        <label for="compact">Compact mode</label>
      </div>
    `}static get styles(){return o`
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
    `}};t([pt({attribute:!1})],$t.prototype,"hass",void 0),t([ut()],$t.prototype,"_config",void 0),$t=t([lt("melitta-barista-card-editor")],$t);let mt=class extends at{constructor(){super(...arguments),this._resolvedPrefix=null}static getConfigElement(){return document.createElement("melitta-barista-card-editor")}static getStubConfig(t){const e=vt(t);return{entity_prefix:e.length>0?e[0].prefix:"",name:e.length>0?e[0].name:"Melitta Barista",show_recipes:!0,show_settings:!1,compact:!1}}setConfig(t){this._config={...t,show_recipes:!1!==t.show_recipes,show_settings:t.show_settings||!1,compact:t.compact||!1},this._resolvedPrefix=null}getCardSize(){return this._config?.compact?3:5}getGridOptions(){return{rows:this._config?.compact?3:5,columns:6,min_rows:2,min_columns:3}}_getPrefix(){if(this._config.entity_prefix)return this._config.entity_prefix;if(this._resolvedPrefix)return this._resolvedPrefix;if(this.hass){const t=vt(this.hass);if(t.length>0)return this._resolvedPrefix=t[0].prefix,this._config.name||(this._config={...this._config,name:t[0].name}),this._resolvedPrefix}return null}shouldUpdate(t){if(t.has("_config")||t.has("_resolvedPrefix"))return!0;const e=t.get("hass");if(!e)return!0;const i=this._getPrefix();if(!i)return!0;for(const[t,s]of Object.entries(this.hass.states))if(t.includes(i)&&e.states[t]!==s)return!0;return!1}_getState(t){if(!this.hass)return null;const e=this._getPrefix();if(!e)return null;const i=["sensor","button","select","number","switch"];for(const s of i){const i=`${s}.${e}_${t}`;if(this.hass.states[i])return this.hass.states[i].state}return null}_getRecipeSelectId(){const t=this._getPrefix();if(!t)return null;const e=`select.${t}_recipe`;return this.hass.states[e]?e:null}_getRecipeOptions(){const t=this._getRecipeSelectId();return t&&this.hass.states[t]?.attributes?.options||[]}_getSelectedRecipe(){const t=this._getRecipeSelectId();if(!t)return null;const e=this.hass.states[t]?.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}_selectRecipe(t){const e=this._getRecipeSelectId();e&&this.hass.callService("select","select_option",{entity_id:e,option:t})}_brew(){const t=this._getPrefix();if(!t)return;const e=`button.${t}_brew`;this.hass.states[e]&&this.hass.callService("button","press",{entity_id:e})}_getSettings(){if(!this.hass)return[];const t=this._getPrefix();if(!t)return[];const e=[];for(const i of gt){const s=this.hass.states[`switch.${t}_${i}`];s&&e.push({name:s.attributes.friendly_name||i,value:"on"===s.state?"On":"Off"})}for(const i of _t){const s=this.hass.states[`number.${t}_${i}`];if(s){const t=s.attributes.unit_of_measurement||"";e.push({name:s.attributes.friendly_name||i,value:`${s.state}${t?" "+t:""}`})}}return e}_pressButton(t){this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this._config)return V;const t=this._getPrefix();if(!t)return q`
        <ha-card>
          <div class="no-device">
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            <p>No Melitta Barista device found.</p>
            <p class="hint">Make sure the integration is installed and configured.</p>
          </div>
        </ha-card>
      `;const e=this._getState("state")||"unavailable",i=this._getState("activity")||"Idle",s=this._getState("progress"),r=this._getState("action_required"),n=this._getState("connection")||"Disconnected",o="Connected"===n,a="unavailable"===e||"unknown"===e,c="Brewing"===e,l="Ready"===e,h=r&&"None"!==r&&"unknown"!==r,d=s&&"unknown"!==s&&"None"!==s,p=ft[e.toLowerCase()]||"var(--primary-text-color)",u=this._getRecipeOptions(),f=this._getSelectedRecipe(),g=`button.${t}_cancel`,_=this._config.name||"Melitta Barista";return a?q`
        <ha-card>
          <div class="card-header">
            <span class="machine-name">${_}</span>
            <div
              class="connection-dot"
              style="background: var(--error-color, #f44336)"
              title="Disconnected"
            ></div>
          </div>
          <div class="offline-section">
            <ha-icon icon="mdi:bluetooth-off"></ha-icon>
            <span>Machine offline</span>
          </div>
        </ha-card>
      `:q`
      <ha-card>
        <div class="card-header">
          <span class="machine-name">${_}</span>
          <div
            class="connection-dot"
            style="background: ${o?"var(--state-active-color, #4caf50)":"var(--error-color, #f44336)"}"
            title="${n}"
          ></div>
        </div>

        <div class="status-section">
          <div class="state-row">
            <span
              class="state-badge"
              style="background: ${p}22; color: ${p}"
            >
              ${e}
            </span>
            ${c?q`<span class="activity-text">${i}</span>`:V}
          </div>
          ${d?q`
                <div class="progress-bar-container">
                  <div
                    class="progress-bar"
                    style="width: ${s}%; background: ${p}"
                  ></div>
                </div>
              `:V}
        </div>

        ${h?q`
              <div class="action-alert">
                <ha-icon icon="mdi:alert-circle"></ha-icon>
                <span>${r}</span>
              </div>
            `:V}

        ${c?q`
              <div class="cancel-row">
                <button
                  class="cancel-btn"
                  @click=${()=>this._pressButton(g)}
                >
                  Cancel
                </button>
              </div>
            `:V}

        ${this._config.show_recipes&&l&&u.length>0?q`
              <div class="section-title">Recipe</div>
              <div class="recipe-row">
                <select
                  class="recipe-select"
                  .value=${f||""}
                  @change=${t=>this._selectRecipe(t.target.value)}
                >
                  <option value="" disabled ?selected=${!f}>
                    Select recipe…
                  </option>
                  ${u.map(t=>q`
                      <option value=${t} ?selected=${t===f}>
                        ${t}
                      </option>
                    `)}
                </select>
                <button
                  class="brew-btn"
                  ?disabled=${!f}
                  @click=${()=>this._brew()}
                >
                  <ha-icon icon="mdi:coffee"></ha-icon>
                  Brew
                </button>
              </div>
            `:V}

        ${this._config.show_settings?this._renderSettings():V}
      </ha-card>
    `}_renderSettings(){const t=this._getSettings();return 0===t.length?V:q`
      <div class="section-title">Settings</div>
      <div class="settings-list">
        ${t.map(t=>q`
            <div class="setting-row">
              <span class="setting-label">${t.name}</span>
              <span class="setting-value">${t.value}</span>
            </div>
          `)}
      </div>
    `}static get styles(){return o`
      :host {
        --card-bg: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        --text-primary: var(--primary-text-color);
        --text-secondary: var(--secondary-text-color);
      }

      .no-device {
        padding: 32px 16px;
        text-align: center;
        color: var(--text-secondary);
      }

      .no-device ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.4;
      }

      .no-device p {
        margin: 8px 0 0;
      }

      .no-device .hint {
        font-size: 0.85em;
        opacity: 0.7;
      }

      .offline-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px 20px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .offline-section ha-icon {
        --mdc-icon-size: 20px;
        opacity: 0.5;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 8px;
      }

      .machine-name {
        font-size: 1.1em;
        font-weight: 500;
        color: var(--text-primary);
      }

      .connection-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-section {
        padding: 0 16px 12px;
      }

      .state-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .state-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.85em;
        font-weight: 500;
      }

      .activity-text {
        font-size: 0.85em;
        color: var(--text-secondary);
      }

      .progress-bar-container {
        height: 4px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 2px;
        margin: 8px 0;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        border-radius: 2px;
        transition: width 0.5s ease;
      }

      .action-alert {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin: 0 16px 8px;
        border-radius: 8px;
        background: color-mix(
          in srgb,
          var(--error-color, #f44336) 8%,
          transparent
        );
        color: var(--error-color, #f44336);
        font-size: 0.85em;
      }

      .action-alert ha-icon {
        --mdc-icon-size: 18px;
        flex-shrink: 0;
      }

      .recipe-row {
        display: flex;
        gap: 8px;
        padding: 0 16px 12px;
        align-items: center;
      }

      .recipe-select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 0.9em;
        font-family: inherit;
        cursor: pointer;
        appearance: auto;
      }

      .recipe-select:focus {
        outline: none;
        border-color: var(--primary-color, #03a9f4);
      }

      .brew-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        font-size: 0.9em;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s ease;
        white-space: nowrap;
      }

      .brew-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      .brew-btn:hover:not(:disabled) {
        opacity: 0.85;
      }

      .brew-btn:active:not(:disabled) {
        transform: scale(0.96);
      }

      .brew-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .cancel-row {
        padding: 0 16px 12px;
      }

      .cancel-btn {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--error-color, #f44336);
        border-radius: 8px;
        background: color-mix(
          in srgb,
          var(--error-color, #f44336) 8%,
          transparent
        );
        color: var(--error-color, #f44336);
        font-size: 0.85em;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s ease;
      }

      .cancel-btn:hover {
        background: color-mix(
          in srgb,
          var(--error-color, #f44336) 18%,
          transparent
        );
      }

      .section-title {
        font-size: 0.8em;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-secondary);
        padding: 8px 16px 4px;
      }

      .settings-list {
        padding: 0 16px 12px;
      }

      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 0.85em;
      }

      .setting-label {
        color: var(--text-secondary);
      }

      .setting-value {
        color: var(--text-primary);
        font-weight: 500;
      }
    `}};t([pt({attribute:!1})],mt.prototype,"hass",void 0),t([ut()],mt.prototype,"_config",void 0),t([ut()],mt.prototype,"_resolvedPrefix",void 0),mt=t([lt("melitta-barista-card")],mt),window.customCards=window.customCards||[],window.customCards.push({type:"melitta-barista-card",name:"Melitta Barista Card",description:"Control your Melitta Barista coffee machine",preview:!0,documentationURL:"https://github.com/dzerik/melitta-barista-card"}),console.info("%c MELITTA-BARISTA-CARD %c v0.4.1 ","color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;","color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;");export{mt as MelittaBaristaCard};
