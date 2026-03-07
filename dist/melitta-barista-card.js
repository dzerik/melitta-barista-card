function e(e,t,s,i){var r,o=arguments.length,n=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,s,n):r(t,s))||n);return o>3&&n&&Object.defineProperty(t,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new o(s,e,i)},a=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:f}=Object,u=globalThis,_=u.trustedTypes,g=_?_.emptyScript:"",y=u.reactiveElementPolyfillSupport,v=(e,t)=>e,m={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},$=(e,t)=>!l(e,t),b={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=b){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:r}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const o=i?.call(this);r?.call(this,t),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=f(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...d(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(t,s.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:m;this._$Em=i;const o=r.fromAttribute(t,e.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(void 0!==e){const o=this.constructor;if(!1===i&&(r=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??$)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,y?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=e=>e,S=w.trustedTypes,P=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,O=`<${k}>`,T=document,M=()=>T.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,N="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,H=/>/g,j=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,q=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),V=new WeakMap,J=T.createTreeWalker(T,129);function K(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==P?P.createHTML(t):t}const Z=(e,t)=>{const s=e.length-1,i=[];let r,o=2===t?"<svg>":3===t?"<math>":"",n=I;for(let t=0;t<s;t++){const s=e[t];let a,l,c=-1,h=0;for(;h<s.length&&(n.lastIndex=h,l=n.exec(s),null!==l);)h=n.lastIndex,n===I?"!--"===l[1]?n=z:void 0!==l[1]?n=H:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=j):void 0!==l[3]&&(n=j):n===j?">"===l[0]?(n=r??I,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?j:'"'===l[3]?D:B):n===D||n===B?n=j:n===z||n===H?n=I:(n=j,r=void 0);const d=n===j&&e[t+1].startsWith("/>")?" ":"";o+=n===I?s+O:c>=0?(i.push(a),s.slice(0,c)+E+s.slice(c)+C+d):s+C+(-2===c?t:d)}return[K(e,o+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class G{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0;const n=e.length-1,a=this.parts,[l,c]=Z(e,t);if(this.el=G.createElement(l,s),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=J.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=c[o++],s=i.getAttribute(e).split(C),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?te:"?"===n[1]?se:"@"===n[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:r}),i.removeAttribute(e));if(L.test(i.tagName)){const e=i.textContent.split(C),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],M()),J.nextNode(),a.push({type:2,index:++r});i.append(e[t],M())}}}else if(8===i.nodeType)if(i.data===k)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(C,e+1));)a.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const s=T.createElement("template");return s.innerHTML=e,s}}function Q(e,t,s=e,i){if(t===F)return t;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=R(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(t=Q(e,r._$AS(e,t.values),r,i)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??T).importNode(t,!0);J.currentNode=i;let r=J.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new Y(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new re(r,this,e)),this._$AV.push(t),a=s[++n]}o!==a?.index&&(r=J.nextNode(),o++)}return J.currentNode=T,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),R(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==F&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=G.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new X(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new G(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new Y(this.O(M()),this.O(M()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(e,t=this,s,i){const r=this.strings;let o=!1;if(void 0===r)e=Q(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==F,o&&(this._$AH=e);else{const i=e;let n,a;for(e=r[0],n=0;n<r.length-1;n++)a=Q(this,i[s+n],t,n),a===F&&(a=this._$AH[n]),o||=!R(a)||a!==this._$AH[n],a===W?e=W:e!==W&&(e+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class se extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ie extends ee{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??W)===F)return;const s=this._$AH,i=e===W&&s!==W||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const oe=w.litHtmlPolyfillSupport;oe?.(G,Y),(w.litHtmlVersions??=[]).push("3.3.2");const ne=globalThis;class ae extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=s?.renderBefore??null;i._$litPart$=r=new Y(t.insertBefore(M(),e),e,void 0,s??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}ae._$litElement$=!0,ae.finalized=!0,ne.litElementHydrateSupport?.({LitElement:ae});const le=ne.litElementPolyfillSupport;le?.({LitElement:ae}),(ne.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:$},de=(e=he,t,s)=>{const{kind:i,metadata:r}=s;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),o.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const r=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,r,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];t.call(this,s),this.requestUpdate(i,r,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function pe(e){return(t,s)=>"object"==typeof s?de(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function fe(e){return pe({...e,state:!0,attribute:!1})}const ue=["coffee","steam","water"],_e=["none",...ue],ge=["very_mild","mild","medium","strong","very_strong"],ye=["cold","normal","high"],ve=["none","one","two","three"],me={ready:"var(--state-active-color, #4caf50)",brewing:"var(--warning-color, #ff9800)",cleaning:"var(--info-color, #2196f3)",descaling:"var(--info-color, #2196f3)",off:"var(--disabled-color, #9e9e9e)",busy:"var(--warning-color, #ff9800)",unavailable:"var(--error-color, #f44336)"},$e=["energy_saving","auto_bean_select","rinsing_disabled"],be=["water_hardness","auto_off_after","brew_temperature"];function xe(e){const t=new Set;for(const s of Object.keys(e.states)){const e=s.match(/^button\.(.+?)_brew$/);e&&t.add(e[1])}const s=[];for(const i of t){const t=e.states[`sensor.${i}_state`];if(!t)continue;const r=t.attributes.friendly_name,o=r?r.replace(/\s*State$/,""):i.replace(/_/g," ");s.push({prefix:i,name:o})}return s}let we=class extends ae{setConfig(e){this._config=e}_fireConfigChanged(){const e=new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:!0,composed:!0});this.dispatchEvent(e)}_valueChanged(e,t){const s=t.target,i=s instanceof HTMLInputElement&&"checkbox"===s.type?s.checked:s.value;this._config={...this._config,[e]:i},this._fireConfigChanged()}_deviceSelected(e){const t=e.target.value;if("__manual__"===t)return this._config={...this._config,entity_prefix:""},void this._fireConfigChanged();const s=(this.hass?xe(this.hass):[]).find(e=>e.prefix===t);this._config={...this._config,entity_prefix:t,name:s?.name||this._config.name},this._fireConfigChanged()}render(){if(!this._config)return W;const e=this.hass?xe(this.hass):[],t=this._config.entity_prefix||"",s=e.some(e=>e.prefix===t),i=t&&!s&&e.length>0;return q`
      ${e.length>0?q`
            <div class="editor-row">
              <label for="device">Device</label>
              <select
                id="device"
                @change=${this._deviceSelected}
              >
                ${e.map(e=>q`
                    <option value=${e.prefix} ?selected=${e.prefix===t}>
                      ${e.name}
                    </option>
                  `)}
                <option value="__manual__" ?selected=${i}>
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

      ${i?q`
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
    `}};e([pe({attribute:!1})],we.prototype,"hass",void 0),e([fe()],we.prototype,"_config",void 0),we=e([ce("melitta-barista-card-editor")],we);let Ae=class extends ae{constructor(){super(...arguments),this._resolvedPrefix=null,this._freestyleName="Custom",this._freestyleProcess1="coffee",this._freestyleIntensity1="medium",this._freestylePortion1=40,this._freestyleTemp1="normal",this._freestyleShots1="one",this._freestyleProcess2="none",this._freestyleIntensity2="medium",this._freestylePortion2=0,this._freestyleTemp2="normal",this._freestyleShots2="none"}static getConfigElement(){return document.createElement("melitta-barista-card-editor")}static getStubConfig(e){const t=xe(e);return{entity_prefix:t.length>0?t[0].prefix:"",name:t.length>0?t[0].name:"Melitta Barista",show_recipes:!0,show_settings:!1,compact:!1}}setConfig(e){this._config={...e,show_recipes:!1!==e.show_recipes,show_profiles:!1!==e.show_profiles,show_freestyle:e.show_freestyle||!1,show_settings:e.show_settings||!1,compact:e.compact||!1},this._resolvedPrefix=null}getCardSize(){return this._config?.compact?3:5}getGridOptions(){return{rows:this._config?.compact?3:5,columns:6,min_rows:2,min_columns:3}}_getPrefix(){if(this._config.entity_prefix)return this._config.entity_prefix;if(this._resolvedPrefix)return this._resolvedPrefix;if(this.hass){const e=xe(this.hass);if(e.length>0)return this._resolvedPrefix=e[0].prefix,this._config.name||(this._config={...this._config,name:e[0].name}),this._resolvedPrefix}return null}shouldUpdate(e){if(e.has("_config")||e.has("_resolvedPrefix"))return!0;const t=e.get("hass");if(!t)return!0;const s=this._getPrefix();if(!s)return!0;for(const[e,i]of Object.entries(this.hass.states))if(e.includes(s)&&t.states[e]!==i)return!0;return!1}_getState(e){if(!this.hass)return null;const t=this._getPrefix();if(!t)return null;const s=["sensor","button","select","number","switch"];for(const i of s){const s=`${i}.${t}_${e}`;if(this.hass.states[s])return this.hass.states[s].state}return null}_getRecipeSelectId(){const e=this._getPrefix();if(!e)return null;const t=`select.${e}_recipe`;return this.hass.states[t]?t:null}_getRecipeOptions(){const e=this._getRecipeSelectId();return e&&this.hass.states[e]?.attributes?.options||[]}_getSelectedRecipe(){const e=this._getRecipeSelectId();if(!e)return null;const t=this.hass.states[e]?.state;return t&&"unknown"!==t&&"unavailable"!==t?t:null}_selectRecipe(e){const t=this._getRecipeSelectId();t&&this.hass.callService("select","select_option",{entity_id:t,option:e})}_getProfileSelectId(){const e=this._getPrefix();if(!e)return null;const t=`select.${e}_profile`;return this.hass.states[t]?t:null}_getProfileOptions(){const e=this._getProfileSelectId();return e&&this.hass.states[e]?.attributes?.options||[]}_getSelectedProfile(){const e=this._getProfileSelectId();if(!e)return null;const t=this.hass.states[e]?.state;return t&&"unknown"!==t&&"unavailable"!==t?t:null}_selectProfile(e){const t=this._getProfileSelectId();t&&this.hass.callService("select","select_option",{entity_id:t,option:e})}_brew(){const e=this._getPrefix();e&&this._pressButton(`button.${e}_brew`)}_brewFreestyle(){const e=this._getPrefix();if(!e)return;const t=`button.${e}_brew`;this.hass.states[t]&&this.hass.callService("melitta_barista","brew_freestyle",{entity_id:t,name:this._freestyleName,process1:this._freestyleProcess1,intensity1:this._freestyleIntensity1,portion1_ml:this._freestylePortion1,temperature1:this._freestyleTemp1,shots1:this._freestyleShots1,process2:this._freestyleProcess2,intensity2:this._freestyleIntensity2,portion2_ml:this._freestylePortion2,temperature2:this._freestyleTemp2,shots2:this._freestyleShots2})}_getSettings(){if(!this.hass)return[];const e=this._getPrefix();if(!e)return[];const t=[];for(const s of $e){const i=this.hass.states[`switch.${e}_${s}`];i&&t.push({name:i.attributes.friendly_name||s,value:"on"===i.state?"On":"Off"})}for(const s of be){const i=this.hass.states[`number.${e}_${s}`];if(i){const e=i.attributes.unit_of_measurement||"";t.push({name:i.attributes.friendly_name||s,value:`${i.state}${e?" "+e:""}`})}}return t}_pressButton(e){this.hass.states[e]&&this.hass.callService("button","press",{entity_id:e})}render(){if(!this.hass||!this._config)return W;const e=this._getPrefix();if(!e)return q`
        <ha-card>
          <div class="no-device">
            <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
            <p>No Melitta Barista device found.</p>
            <p class="hint">Make sure the integration is installed and configured.</p>
          </div>
        </ha-card>
      `;const t=this._getState("state")||"unavailable",s=this._getState("activity")||"Idle",i=this._getState("progress"),r=this._getState("action_required"),o=this._getState("connection")||"Disconnected",n="Connected"===o,a="unavailable"===t||"unknown"===t,l="Brewing"===t,c="Ready"===t,h=r&&"None"!==r&&"unknown"!==r,d=i&&"unknown"!==i&&"None"!==i,p=d?Math.max(0,Math.min(100,parseFloat(i)||0)):0,f=me[t.toLowerCase()]||"var(--primary-text-color)",u=this._getRecipeOptions(),_=this._getSelectedRecipe(),g=`button.${e}_cancel`,y=this._config.name||"Melitta Barista";return a?q`
        <ha-card>
          <div class="card-header">
            <span class="machine-name">${y}</span>
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
          <span class="machine-name">${y}</span>
          <div
            class="connection-dot"
            style="background: ${n?"var(--state-active-color, #4caf50)":"var(--error-color, #f44336)"}"
            title="${o}"
          ></div>
        </div>

        <div class="status-section">
          <div class="state-row">
            <span
              class="state-badge"
              style="background: ${f}22; color: ${f}"
            >
              ${t}
            </span>
            ${l?q`<span class="activity-text">${s}</span>`:W}
          </div>
          ${d?q`
                <div class="progress-bar-container">
                  <div
                    class="progress-bar"
                    style="width: ${p}%; background: ${f}"
                  ></div>
                </div>
              `:W}
        </div>

        ${h?q`
              <div class="action-alert">
                <ha-icon icon="mdi:alert-circle"></ha-icon>
                <span>${r}</span>
              </div>
            `:W}

        ${l?q`
              <div class="cancel-row">
                <button
                  class="cancel-btn"
                  @click=${()=>this._pressButton(g)}
                >
                  Cancel
                </button>
              </div>
            `:W}

        ${this._config.show_profiles&&c&&this._getProfileOptions().length>1?this._renderProfileSelect():W}

        ${this._config.show_recipes&&c&&u.length>0?q`
              <div class="section-title">Recipe</div>
              <div class="recipe-row">
                <select
                  class="recipe-select"
                  .value=${_||""}
                  @change=${e=>this._selectRecipe(e.target.value)}
                >
                  <option value="" disabled ?selected=${!_}>
                    Select recipe…
                  </option>
                  ${u.map(e=>q`
                      <option value=${e} ?selected=${e===_}>
                        ${e}
                      </option>
                    `)}
                </select>
                <button
                  class="brew-btn"
                  ?disabled=${!_}
                  @click=${()=>this._brew()}
                >
                  <ha-icon icon="mdi:coffee"></ha-icon>
                  Brew
                </button>
              </div>
            `:W}

        ${this._config.show_freestyle&&c?this._renderFreestyle():W}

        ${this._config.show_settings?this._renderSettings():W}
      </ha-card>
    `}_renderProfileSelect(){const e=this._getProfileOptions(),t=this._getSelectedProfile();return q`
      <div class="section-title">Profile</div>
      <div class="profile-row">
        <ha-icon icon="mdi:account-circle" class="profile-icon"></ha-icon>
        <select
          class="recipe-select"
          .value=${t||""}
          @change=${e=>this._selectProfile(e.target.value)}
        >
          ${e.map(e=>q`
              <option value=${e} ?selected=${e===t}>
                ${e}
              </option>
            `)}
        </select>
      </div>
    `}_renderFreestyle(){return q`
      <div class="section-title">Freestyle</div>
      <div class="freestyle-section">
        <div class="freestyle-row">
          <label>Name</label>
          <input
            class="freestyle-input"
            type="text"
            .value=${this._freestyleName}
            @input=${e=>{this._freestyleName=e.target.value}}
          />
        </div>

        <div class="freestyle-subtitle">Component 1</div>
        <div class="freestyle-grid">
          <div class="freestyle-field">
            <label>Process</label>
            <select class="freestyle-select" .value=${this._freestyleProcess1}
              @change=${e=>{this._freestyleProcess1=e.target.value}}>
              ${ue.map(e=>q`<option value=${e} ?selected=${e===this._freestyleProcess1}>${e}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Intensity</label>
            <select class="freestyle-select" .value=${this._freestyleIntensity1}
              @change=${e=>{this._freestyleIntensity1=e.target.value}}>
              ${ge.map(e=>q`<option value=${e} ?selected=${e===this._freestyleIntensity1}>${e}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Portion (ml)</label>
            <input class="freestyle-input" type="number" min="5" max="250" step="5"
              .value=${String(this._freestylePortion1)}
              @input=${e=>{this._freestylePortion1=parseInt(e.target.value)||40}} />
          </div>
          <div class="freestyle-field">
            <label>Temperature</label>
            <select class="freestyle-select" .value=${this._freestyleTemp1}
              @change=${e=>{this._freestyleTemp1=e.target.value}}>
              ${ye.map(e=>q`<option value=${e} ?selected=${e===this._freestyleTemp1}>${e}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Shots</label>
            <select class="freestyle-select" .value=${this._freestyleShots1}
              @change=${e=>{this._freestyleShots1=e.target.value}}>
              ${ve.map(e=>q`<option value=${e} ?selected=${e===this._freestyleShots1}>${e}</option>`)}
            </select>
          </div>
        </div>

        <div class="freestyle-subtitle">Component 2</div>
        <div class="freestyle-grid">
          <div class="freestyle-field">
            <label>Process</label>
            <select class="freestyle-select" .value=${this._freestyleProcess2}
              @change=${e=>{this._freestyleProcess2=e.target.value}}>
              ${_e.map(e=>q`<option value=${e} ?selected=${e===this._freestyleProcess2}>${e}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Intensity</label>
            <select class="freestyle-select" .value=${this._freestyleIntensity2}
              @change=${e=>{this._freestyleIntensity2=e.target.value}}>
              ${ge.map(e=>q`<option value=${e} ?selected=${e===this._freestyleIntensity2}>${e}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Portion (ml)</label>
            <input class="freestyle-input" type="number" min="0" max="250" step="5"
              .value=${String(this._freestylePortion2)}
              @input=${e=>{this._freestylePortion2=parseInt(e.target.value)||0}} />
          </div>
          <div class="freestyle-field">
            <label>Temperature</label>
            <select class="freestyle-select" .value=${this._freestyleTemp2}
              @change=${e=>{this._freestyleTemp2=e.target.value}}>
              ${ye.map(e=>q`<option value=${e} ?selected=${e===this._freestyleTemp2}>${e}</option>`)}
            </select>
          </div>
          <div class="freestyle-field">
            <label>Shots</label>
            <select class="freestyle-select" .value=${this._freestyleShots2}
              @change=${e=>{this._freestyleShots2=e.target.value}}>
              ${ve.map(e=>q`<option value=${e} ?selected=${e===this._freestyleShots2}>${e}</option>`)}
            </select>
          </div>
        </div>

        <button class="brew-btn freestyle-brew-btn" @click=${()=>this._brewFreestyle()}>
          <ha-icon icon="mdi:coffee-maker-outline"></ha-icon>
          Brew Freestyle
        </button>
      </div>
    `}_renderSettings(){const e=this._getSettings();return 0===e.length?W:q`
      <div class="section-title">Settings</div>
      <div class="settings-list">
        ${e.map(e=>q`
            <div class="setting-row">
              <span class="setting-label">${e.name}</span>
              <span class="setting-value">${e.value}</span>
            </div>
          `)}
      </div>
    `}static get styles(){return n`
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

      .brew-btn:focus-visible,
      .cancel-btn:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
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

      /* Profile */
      .profile-row {
        display: flex;
        gap: 8px;
        padding: 0 16px 12px;
        align-items: center;
      }

      .profile-icon {
        --mdc-icon-size: 20px;
        color: var(--text-secondary);
        flex-shrink: 0;
      }

      /* Freestyle */
      .freestyle-section {
        padding: 0 16px 12px;
      }

      .freestyle-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }

      .freestyle-row label,
      .freestyle-field label {
        font-size: 0.75em;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .freestyle-subtitle {
        font-size: 0.8em;
        font-weight: 500;
        color: var(--text-secondary);
        margin: 8px 0 4px;
        opacity: 0.8;
      }

      .freestyle-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .freestyle-field {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .freestyle-input,
      .freestyle-select {
        padding: 6px 8px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 0.85em;
        font-family: inherit;
      }

      .freestyle-select {
        cursor: pointer;
        appearance: auto;
      }

      .freestyle-input:focus,
      .freestyle-select:focus {
        outline: none;
        border-color: var(--primary-color, #03a9f4);
      }

      .freestyle-brew-btn {
        width: 100%;
        justify-content: center;
        margin-top: 12px;
      }
    `}};e([pe({attribute:!1})],Ae.prototype,"hass",void 0),e([fe()],Ae.prototype,"_config",void 0),e([fe()],Ae.prototype,"_resolvedPrefix",void 0),e([fe()],Ae.prototype,"_freestyleName",void 0),e([fe()],Ae.prototype,"_freestyleProcess1",void 0),e([fe()],Ae.prototype,"_freestyleIntensity1",void 0),e([fe()],Ae.prototype,"_freestylePortion1",void 0),e([fe()],Ae.prototype,"_freestyleTemp1",void 0),e([fe()],Ae.prototype,"_freestyleShots1",void 0),e([fe()],Ae.prototype,"_freestyleProcess2",void 0),e([fe()],Ae.prototype,"_freestyleIntensity2",void 0),e([fe()],Ae.prototype,"_freestylePortion2",void 0),e([fe()],Ae.prototype,"_freestyleTemp2",void 0),e([fe()],Ae.prototype,"_freestyleShots2",void 0),Ae=e([ce("melitta-barista-card")],Ae),window.customCards=window.customCards||[],window.customCards.push({type:"melitta-barista-card",name:"Melitta Barista Card",description:"Control your Melitta Barista coffee machine",preview:!0,documentationURL:"https://github.com/dzerik/melitta-barista-card"}),console.info("%c MELITTA-BARISTA-CARD %c v0.5.0 ","color: white; background: #795548; font-weight: bold; padding: 2px 6px; border-radius: 3px 0 0 3px;","color: #795548; background: #efebe9; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;");export{Ae as MelittaBaristaCard};
