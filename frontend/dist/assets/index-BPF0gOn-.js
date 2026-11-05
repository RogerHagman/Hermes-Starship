var e=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=e((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.for(`react.view_transition`),m=Symbol.iterator;function h(e){return typeof e!=`object`||!e?null:(e=m&&e[m]||e[`@@iterator`],typeof e==`function`?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_=Object.assign,v={};function y(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function b(){}b.prototype=y.prototype;function x(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}var S=x.prototype=new b;S.constructor=x,_(S,y.prototype),S.isPureReactComponent=!0;var ee=Array.isArray;function te(){}var C={H:null,A:null,T:null,S:null},ne=Object.prototype.hasOwnProperty;function w(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function T(e,t){return w(e.type,t,e.props)}function re(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ie(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var ae=/\/+/g;function oe(e,t){return typeof e==`object`&&e&&e.key!=null?ie(``+e.key):t.toString(36)}function se(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(te,te):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ce(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ce(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+oe(e,0):a,ee(o)?(i=``,c!=null&&(i=c.replace(ae,`$&/`)+`/`),ce(o,r,i,``,function(e){return e})):o!=null&&(re(o)&&(o=T(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(ae,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(ee(e))for(var u=0;u<e.length;u++)a=e[u],s=l+oe(a,u),c+=ce(a,r,i,s,o);else if(u=h(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+oe(a,u++),c+=ce(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ce(se(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function le(e,t,n){if(e==null)return e;var r=[],i=0;return ce(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ue(e){if(e._status===-1){var t=e._result,n=t();n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t,n.status===void 0&&(n.status=`fulfilled`,n.value=t))},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t,n.status===void 0&&(n.status=`rejected`,n.reason=t))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var de=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)};function fe(e){var t=C.T,n={};n.types=t===null?null:t.types,C.T=n;try{var r=e(),i=C.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(te,de)}catch(e){de(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),C.T=t}}function E(e){var t=C.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else fe(E.bind(null,e))}var pe={map:le,forEach:function(e,t,n){le(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return le(e,function(){t++}),t},toArray:function(e){return le(e,function(e){return e})||[]},only:function(e){if(!re(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=pe,e.Component=y,e.Fragment=r,e.Profiler=a,e.PureComponent=x,e.StrictMode=i,e.Suspense=l,e.ViewTransition=p,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=C,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return C.H.useMemoCache(e)}},e.addTransitionType=E,e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=_({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!ne.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return w(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)ne.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return w(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=re,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ue}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=fe,e.unstable_useCacheRefresh=function(){return C.H.useCacheRefresh()},e.use=function(e){return C.H.use(e)},e.useActionState=function(e,t,n){return C.H.useActionState(e,t,n)},e.useCallback=function(e,t){return C.H.useCallback(e,t)},e.useContext=function(e){return C.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return C.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return C.H.useEffect(e,t)},e.useEffectEvent=function(e){return C.H.useEffectEvent(e)},e.useId=function(){return C.H.useId()},e.useImperativeHandle=function(e,t,n){return C.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return C.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return C.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return C.H.useMemo(e,t)},e.useOptimistic=function(e,t){return C.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return C.H.useReducer(e,t,n)},e.useRef=function(e){return C.H.useRef(e)},e.useState=function(e){return C.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return C.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return C.H.useTransition()},e.version=`19.3.1`})),n=e(((e,n)=>{n.exports=t()})),r=e((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,S||(S=!0,T());else{var t=n(l);t!==null&&ae(x,t.startTime-e)}}}var S=!1,ee=-1,te=5,C=-1;function ne(){return g?!0:!(e.unstable_now()-C<te)}function w(){if(g=!1,S){var t=e.unstable_now();C=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(ee),ee=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&ne());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&ae(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?T():S=!1}}}var T;if(typeof y==`function`)T=function(){y(w)};else if(typeof MessageChannel<`u`){var re=new MessageChannel,ie=re.port2;re.port1.onmessage=w,T=function(){ie.postMessage(null)}}else T=function(){_(w,0)};function ae(t,n){ee=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):te=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(ee),ee=-1):h=!0,ae(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,T()))),r},e.unstable_shouldYield=ne,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),i=e(((e,t)=>{t.exports=r()})),a=e((e=>{var t=n();function r(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function i(){}var a={d:{f:i,r:function(){throw Error(r(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},o=Symbol.for(`react.portal`),s=Symbol.for(`react.recoverable`),c=Symbol.for(`react.optimistic_key`);function l(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:r==null?null:r===c?c:``+r,children:e,containerInfo:t,implementation:n}}var u=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=a,e.browser=function(e){return{$$typeof:s,_reason:e}},e.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(r(299));return l(e,t,null,n)},e.flushSync=function(e){var t=u.T,n=a.p;try{if(u.T=null,a.p=2,e)return e()}finally{u.T=t,a.p=n,a.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,a.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&a.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin),i=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?a.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:i,fetchPriority:o}):n===`script`&&a.d.X(e,{crossOrigin:r,integrity:i,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=d(t.as,t.crossOrigin);a.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??a.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin);a.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=d(t.as,t.crossOrigin);a.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else a.d.m(e)}},e.requestFormReset=function(e){a.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return u.H.useFormState(e,t,n)},e.useFormStatus=function(){return u.H.useHostTransitionStatus()},e.version=`19.3.1`})),o=e(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=a()})),s=e((e=>{var t=i(),r=n(),a=o();function s(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function c(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function l(e){for(var t=e,n=t;n&&!n.alternate;)t=n,t.flags&4098&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function u(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function d(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function f(e){if(l(e)!==e)throw Error(s(188))}function p(e){var t=e.alternate;if(!t){if(t=l(e),t===null)throw Error(s(188));return t===e?e:null}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var a=i.alternate;if(a===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===a.child){for(a=i.child;a;){if(a===n)return f(i),e;if(a===r)return f(i),t;a=a.sibling}throw Error(s(188))}if(n.return!==r.return)n=i,r=a;else{for(var o=!1,c=i.child;c;){if(c===n){o=!0,n=i,r=a;break}if(c===r){o=!0,r=i,n=a;break}c=c.sibling}if(!o){for(c=a.child;c;){if(c===n){o=!0,n=a,r=i;break}if(c===r){o=!0,r=a,n=i;break}c=c.sibling}if(!o)throw Error(s(189))}}if(n.alternate!==r)throw Error(s(190))}if(n.tag!==3)throw Error(s(188));return n.stateNode.current===n?e:t}function m(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=m(e),t!==null)return t;e=e.sibling}return null}function h(e,t,n,r,i,a){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,r,i,a)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&h(e.child,t,n,r,i,a))return!0;e=e.sibling}return!1}function g(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function _(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),e.tag!==3&&e.tag!==5&&e.tag!==27);)e=e.return;return t}function v(e){var t=[null,null],n=g(e);return n===null||y(t,e,n.child,{foundSelf:!1}),t}function y(e,t,n,r){for(;n!==null;){if(n===t)r.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(r.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&y(e,t,n.child,r))return!0;n=n.sibling}return!1}function b(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(s(559))}}var x=null,S=null;function ee(e,t,n){return e===n||e===t&&(x=e,!0)}function te(e,t,n){return e===n?(S=e,!1):e===t&&(S!==null&&(x=e),!0)}function C(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function ne(e,t,n){for(var r=0,i=e;i;i=n(i))r++;i=0;for(var a=t;a;a=n(a))i++;for(;0<r-i;)e=n(e),r--;for(;0<i-r;)t=n(t),i--;for(;r--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var w=Object.assign,T=Symbol.for(`react.element`),re=Symbol.for(`react.transitional.element`),ie=Symbol.for(`react.portal`),ae=Symbol.for(`react.fragment`),oe=Symbol.for(`react.strict_mode`),se=Symbol.for(`react.profiler`),ce=Symbol.for(`react.consumer`),le=Symbol.for(`react.context`),ue=Symbol.for(`react.forward_ref`),de=Symbol.for(`react.suspense`),fe=Symbol.for(`react.suspense_list`),E=Symbol.for(`react.memo`),pe=Symbol.for(`react.lazy`),me=Symbol.for(`react.activity`),he=Symbol.for(`react.legacy_hidden`),ge=Symbol.for(`react.memo_cache_sentinel`),D=Symbol.for(`react.view_transition`),_e=Symbol.for(`react.recoverable`),ve=Symbol.iterator;function ye(e){return typeof e!=`object`||!e?null:(e=ve&&e[ve]||e[`@@iterator`],typeof e==`function`?e:null)}var be=Symbol.for(`react.client.reference`);function xe(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===be?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case ae:return`Fragment`;case se:return`Profiler`;case oe:return`StrictMode`;case de:return`Suspense`;case fe:return`SuspenseList`;case me:return`Activity`;case D:return`ViewTransition`}if(typeof e==`object`)switch(e.$$typeof){case ie:return`Portal`;case le:return e.displayName||`Context`;case ce:return(e._context.displayName||`Context`)+`.Consumer`;case ue:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case E:return t=e.displayName||null,t===null?xe(e.type)||`Memo`:t;case pe:t=e._payload,e=e._init;try{return xe(e(t))}catch{}}return null}var Se=Array.isArray,O=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,k=a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ce={pending:!1,data:null,method:null,action:null},we=[],Te=-1;function Ee(e){return{current:e}}function A(e){0>Te||(e.current=we[Te],we[Te]=null,Te--)}function j(e,t){Te++,we[Te]=e.current,e.current=t}var De=Ee(null),Oe=Ee(null),M=Ee(null),ke=Ee(null);function Ae(e,t){switch(j(M,t),j(Oe,e),j(De,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?up(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=up(t),e=dp(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}A(De),j(De,e)}function je(){A(De),A(Oe),A(M)}function Me(e){var t=e.memoizedState;t!==null&&(sh._currentValue=t.memoizedState,j(ke,e)),t=De.current;var n=dp(t,e.type);t!==n&&(j(Oe,e),j(De,n))}function Ne(e){Oe.current===e&&(A(De),A(Oe)),ke.current===e&&(A(ke),sh._currentValue=Ce)}var Pe,Fe;function Ie(e){if(Pe===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Pe=t&&t[1]||``,Fe=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Pe+e+Fe}var Le=!1;function Re(e,t){if(!e||Le)return``;Le=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}n=!1;try{var i=Object.getOwnPropertyDescriptor(e.prototype,`props`);Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),n=!0,new e}finally{n&&(i===void 0?delete e.prototype.props:Object.defineProperty(e.prototype,"props",i))}}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Le=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Ie(n):``}function ze(e,t){switch(e.tag){case 26:case 27:case 5:return Ie(e.type);case 16:return Ie(`Lazy`);case 13:return e.child!==t&&t!==null?Ie(`Suspense Fallback`):Ie(`Suspense`);case 19:return Ie(`SuspenseList`);case 0:case 15:return Re(e.type,!1);case 11:return Re(e.type.render,!1);case 1:return Re(e.type,!0);case 31:return Ie(`Activity`);case 30:return Ie(`ViewTransition`);default:return``}}function Be(e){try{var t=``,n=null;do t+=ze(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Ve=Object.prototype.hasOwnProperty,He=t.unstable_scheduleCallback,Ue=t.unstable_cancelCallback,We=t.unstable_shouldYield,Ge=t.unstable_requestPaint,Ke=t.unstable_now,qe=t.unstable_getCurrentPriorityLevel,Je=t.unstable_ImmediatePriority,Ye=t.unstable_UserBlockingPriority,Xe=t.unstable_NormalPriority,Ze=t.unstable_LowPriority,Qe=t.unstable_IdlePriority,$e=t.log,et=t.unstable_setDisableYieldValue,tt=null,nt=null;function rt(e){if(typeof $e==`function`&&et(e),nt&&typeof nt.setStrictMode==`function`)try{nt.setStrictMode(tt,e)}catch{}}var it=Math.clz32?Math.clz32:st,at=Math.log,ot=Math.LN2;function st(e){return e>>>=0,e===0?32:31-(at(e)/ot|0)|0}var ct=256,lt=262144,ut=4194304;function dt(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function ft(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=dt(n))):i=dt(o):i=dt(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=dt(n))):i=dt(o)):i=dt(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function pt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function mt(e,t){t&8&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var r=31-it(n),i=1<<r;t|=e[r],n&=~i}return t}function ht(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function gt(){var e=ut;return ut<<=1,!(ut&62914560)&&(ut=4194304),e}function _t(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function vt(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function yt(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-it(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&bt(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function bt(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-it(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function xt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-it(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function St(e,t){var n=t&-t;return n=n&42?1:Ct(n),(n&(e.suspendedLanes|t))===0?n:0}function Ct(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function wt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function Tt(){var e=k.p;return e===0?(e=window.event,e===void 0?32:Ch(e.type)):e}function Et(e,t){var n=k.p;try{return k.p=e,t()}finally{k.p=n}}var Dt=Math.random().toString(36).slice(2),Ot=`__reactFiber$`+Dt,kt=`__reactProps$`+Dt,At=`__reactContainer$`+Dt,jt=`__reactEvents$`+Dt,Mt=`__reactListeners$`+Dt,Nt=`__reactHandles$`+Dt,Pt=`__reactResources$`+Dt,Ft=`__reactMarker$`+Dt,It=`__reactLoad$`+Dt;function Lt(e){delete e[Ot],delete e[kt],delete e[Mt],delete e[Nt]}function Rt(e){var t;if(t=e[Ot])return t;for(var n=e.parentNode;n;){if(t=n[At]||n[Ot]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=fm(e);e!==null;){if(n=e[Ot])return n;e=fm(e)}return t}e=n,n=e.parentNode}return null}function zt(e){if(e=e[Ot]||e[At]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Bt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(s(33))}function Vt(e){var t=e[Pt];return t||=e[Pt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Ht(e){e[Ft]=!0}function Ut(e){e[It]=void 0}var Wt=new Set,Gt={};function Kt(e,t){qt(e,t),qt(e+`Capture`,t)}function qt(e,t){for(Gt[e]=t,e=0;e<t.length;e++)Wt.add(t[e])}var Jt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Yt={},Xt={};function Zt(e){return Ve.call(Xt,e)?!0:Ve.call(Yt,e)?!1:Jt.test(e)?Xt[e]=!0:(Yt[e]=!0,!1)}var N=!1;function Qt(){var e=N;return N=!1,e}function $t(e,t,n){if(Zt(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,n)}}}function en(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,n)}}function tn(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,r)}}function nn(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function rn(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function an(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function on(e){if(!e._valueTracker){var t=rn(e)?`checked`:`value`;e._valueTracker=an(e,t,``+e[t])}}function sn(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=rn(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}var cn=/[\n"\\]/g;function ln(e){return e.replace(cn,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function un(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+nn(t)):e.value!==``+nn(t)&&(e.value=``+nn(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):fn(e,nn(n)):o===`number`&&e.value==t?fn(e,nn(e.value)):fn(e,nn(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+nn(s):e.removeAttribute(`name`)}function dn(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){on(e);return}n=n==null?``:``+nn(n),t=t==null?n:``+nn(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),on(e)}function fn(e,t){e.defaultValue!==``+t&&(e.defaultValue=``+t)}function pn(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+nn(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function mn(e,t,n){t!=null&&(t=``+nn(t),t!==e.value&&(e.value=t),n==null)?e.defaultValue!==t&&(e.defaultValue=t):e.defaultValue=n==null?``:``+nn(n)}function hn(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(s(92));if(Se(r)){if(1<r.length)throw Error(s(93));r=r[0]}n=r}n??=``,t=n}n=nn(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),on(e)}function gn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var _n=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function vn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||_n.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function yn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(s(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``,N=!0);for(var i in t)r=t[i],t.hasOwnProperty(i)&&n[i]!==r&&(vn(e,i,r),N=!0)}else for(var a in t)t.hasOwnProperty(a)&&vn(e,a,t[a])}function bn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var xn=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`maskType`,`mask-type`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),Sn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Cn(e){return Sn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function wn(){}var Tn=null;function En(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Dn=null,On=null;function kn(e){var t=zt(e);if(t&&(e=t.stateNode)){var n=e[kt]||null;a:switch(e=t.stateNode,t.type){case`input`:if(un(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+ln(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=r[kt]||null;if(!i)throw Error(s(90));un(r,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&sn(r)}break a;case`textarea`:mn(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&pn(e,!!n.multiple,t,!1)}}}var An=!1;function jn(e,t,n){if(An)return e(t,n);An=!0;try{return e(t)}finally{if(An=!1,(Dn!==null||On!==null)&&(zd(),Dn&&(t=Dn,e=On,On=Dn=null,kn(t),e)))for(t=0;t<e.length;t++)kn(e[t])}}function Mn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[kt]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(s(231,t,typeof n));return n}var Nn=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0,Pn=!1;if(Nn)try{var Fn={};Object.defineProperty(Fn,"passive",{get:function(){Pn=!0}}),window.addEventListener(`test`,Fn,Fn),window.removeEventListener(`test`,Fn,Fn)}catch{Pn=!1}var In=null,Ln=null,Rn=null;function zn(){if(Rn)return Rn;var e,t=Ln,n=t.length,r,i=`value`in In?In.value:In.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Rn=i.slice(e,1<r?1-r:void 0)}function Bn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Vn(){return!0}function Hn(){return!1}function Un(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Vn:Hn,this.isPropagationStopped=Hn,this}return w(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Vn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Vn)},persist:function(){},isPersistent:Vn}),t}var Wn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Gn=Un(Wn),Kn=w({},Wn,{view:0,detail:0}),qn=Un(Kn),Jn,Yn,Xn,Zn=w({},Kn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:cr,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Xn&&(Xn&&e.type===`mousemove`?(Jn=e.screenX-Xn.screenX,Yn=e.screenY-Xn.screenY):Yn=Jn=0,Xn=e),Jn)},movementY:function(e){return`movementY`in e?e.movementY:Yn}}),Qn=Un(Zn),$n=Un(w({},Zn,{dataTransfer:0})),er=Un(w({},Kn,{relatedTarget:0})),tr=Un(w({},Wn,{animationName:0,elapsedTime:0,pseudoElement:0})),nr=Un(w({},Wn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),rr=Un(w({},Wn,{data:0})),ir={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},ar={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},or={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function sr(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=or[e])?!!t[e]:!1}function cr(){return sr}var lr=Un(w({},Kn,{key:function(e){if(e.key){var t=ir[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Bn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?ar[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:cr,charCode:function(e){return e.type===`keypress`?Bn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Bn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),ur=Un(w({},Zn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),dr=Un(w({},Wn,{submitter:0})),fr=Un(w({},Kn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:cr})),pr=Un(w({},Wn,{propertyName:0,elapsedTime:0,pseudoElement:0})),mr=Un(w({},Zn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),hr=Un(w({},Wn,{newState:0,oldState:0,source:0})),gr=[9,13,27,32],_r=Nn&&`CompositionEvent`in window,vr=null;Nn&&`documentMode`in document&&(vr=document.documentMode);var yr=Nn&&`TextEvent`in window&&!vr,br=Nn&&(!_r||vr&&8<vr&&11>=vr),xr=` `,Sr=!1;function Cr(e,t){switch(e){case`keyup`:return gr.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function wr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var Tr=!1;function Er(e,t){switch(e){case`compositionend`:return wr(t);case`keypress`:return t.which===32?(Sr=!0,xr):null;case`textInput`:return e=t.data,e===xr&&Sr?null:e;default:return null}}function Dr(e,t){if(Tr)return e===`compositionend`||!_r&&Cr(e,t)?(e=zn(),Rn=Ln=In=null,Tr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return br&&t.locale!==`ko`?null:t.data;default:return null}}var Or={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function kr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!Or[e.type]:t===`textarea`}function Ar(e,t,n,r){Dn?On?On.push(r):On=[r]:Dn=r,t=Jf(t,`onChange`),0<t.length&&(n=new Gn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var jr=null,Mr=null;function Nr(e){Vf(e,0)}function Pr(e){if(sn(Bt(e)))return e}function Fr(e,t){if(e===`change`)return t}var Ir=!1;if(Nn){var Lr;if(Nn){var Rr=`oninput`in document;if(!Rr){var zr=document.createElement(`div`);zr.setAttribute(`oninput`,`return;`),Rr=typeof zr.oninput==`function`}Lr=Rr}else Lr=!1;Ir=Lr&&(!document.documentMode||9<document.documentMode)}function Br(){jr&&(jr.detachEvent(`onpropertychange`,Vr),Mr=jr=null)}function Vr(e){if(e.propertyName===`value`&&Pr(Mr)){var t=[];Ar(t,Mr,e,En(e)),jn(Nr,t)}}function Hr(e,t,n){e===`focusin`?(Br(),jr=t,Mr=n,jr.attachEvent(`onpropertychange`,Vr)):e===`focusout`&&Br()}function Ur(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return Pr(Mr)}function Wr(e,t){if(e===`click`)return Pr(t)}function Gr(e,t){if(e===`input`||e===`change`)return Pr(t)}function Kr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var qr=typeof Object.is==`function`?Object.is:Kr;function Jr(e,t){if(qr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Ve.call(t,i)||!qr(e[i],t[i]))return!1}return!0}function Yr(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function Xr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Zr(e,t){var n=Xr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Xr(n)}}function Qr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Qr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function $r(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Yr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Yr(e.document)}return t}function ei(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var ti=Nn&&`documentMode`in document&&11>=document.documentMode,ni=null,ri=null,ii=null,ai=!1;function oi(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ai||ni==null||ni!==Yr(r)||(r=ni,`selectionStart`in r&&ei(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ii&&Jr(ii,r)||(ii=r,r=Jf(ri,`onSelect`),0<r.length&&(t=new Gn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=ni)))}function si(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var ci={animationend:si(`Animation`,`AnimationEnd`),animationiteration:si(`Animation`,`AnimationIteration`),animationstart:si(`Animation`,`AnimationStart`),transitionrun:si(`Transition`,`TransitionRun`),transitionstart:si(`Transition`,`TransitionStart`),transitioncancel:si(`Transition`,`TransitionCancel`),transitionend:si(`Transition`,`TransitionEnd`)},li={},ui={};Nn&&(ui=document.createElement(`div`).style,`AnimationEvent`in window||(delete ci.animationend.animation,delete ci.animationiteration.animation,delete ci.animationstart.animation),`TransitionEvent`in window||delete ci.transitionend.transition);function di(e){if(li[e])return li[e];if(!ci[e])return e;var t=ci[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ui)return li[e]=t[n];return e}var fi=di(`animationend`),pi=di(`animationiteration`),mi=di(`animationstart`),hi=di(`transitionrun`),gi=di(`transitionstart`),_i=di(`transitioncancel`),vi=di(`transitionend`),yi=new Map,bi=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);bi.push(`scrollEnd`);function xi(e,t){yi.set(e,t),Kt(t,[e])}var Si=0;function Ci(e,t){if(e.name!=null&&e.name!==`auto`)return e.name;if(t.autoName!==null)return t.autoName;e=bd.identifierPrefix;var n=Si++;return e=`_`+e+`t_`+n.toString(32)+`_`,t.autoName=e}function wi(e){if(e==null||typeof e==`string`)return e;var t=null,n=Od;if(n!==null)for(var r=0;r<n.length;r++){var i=e[n[r]];if(i!=null){if(i===`none`)return`none`;t=t==null?i:t+(` `+i)}}return t??e.default}function Ti(e,t){return e=wi(e),t=wi(t),t==null?e===`auto`?null:e:t===`auto`?null:t}var Ei=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},Di=[],Oi=0,ki=0;function Ai(){for(var e=Oi,t=ki=Oi=0;t<e;){var n=Di[t];Di[t++]=null;var r=Di[t];Di[t++]=null;var i=Di[t];Di[t++]=null;var a=Di[t];if(Di[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&Pi(n,i,a)}}function ji(e,t,n,r){Di[Oi++]=e,Di[Oi++]=t,Di[Oi++]=n,Di[Oi++]=r,ki|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function Mi(e,t,n,r){return ji(e,t,n,r),Fi(e)}function Ni(e,t){return ji(e,null,null,t),Fi(e)}function Pi(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-it(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function Fi(e){if(50<kd)throw kd=0,Ad=null,Error(s(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Ii={};function Li(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ri(e,t,n,r){return new Li(e,t,n,r)}function zi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Bi(e,t){var n=e.alternate;return n===null?(n=Ri(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Vi(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Hi(e,t,n,r,i,a){var o=0;if(r=e,typeof r==`function`)zi(r)&&(o=1);else if(typeof r==`string`)o=qm(e,n,De.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(r){case me:return e=Ri(31,n,t,i),e.elementType=me,e.lanes=a,e;case ae:return Ui(n.children,i,a,t);case oe:o=8,i|=24;break;case se:return e=Ri(12,n,t,i|2),e.elementType=se,e.lanes=a,e;case de:return e=Ri(13,n,t,i),e.elementType=de,e.lanes=a,e;case fe:return e=Ri(19,n,t,i),e.elementType=fe,e.lanes=a,e;case he:case D:return e=i|32,e=Ri(30,n,t,e),e.elementType=D,e.lanes=a,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r==`object`&&r)switch(r.$$typeof){case le:o=10;break a;case ce:o=9;break a;case ue:o=11;break a;case E:o=14;break a;case pe:o=16,r=null;break a}o=29,n=Error(s(130,e===null?`null`:typeof e,``)),r=null}return t=Ri(o,n,t,i),t.elementType=e,t.type=r,t.lanes=a,t}function Ui(e,t,n,r){return e=Ri(7,e,r,t),e.lanes=n,e}function Wi(e,t,n){return e=Ri(6,e,null,t),e.lanes=n,e}function Gi(e){var t=Ri(18,null,null,0);return t.stateNode=e,t}function Ki(e,t,n){return t=Ri(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var qi=new WeakMap;function Ji(e,t){if(typeof e==`object`&&e){var n=qi.get(e);return n===void 0?(t={value:e,source:t,stack:Be(t)},qi.set(e,t),t):n}return{value:e,source:t,stack:Be(t)}}var Yi=[],Xi=0,Zi=null,Qi=0,$i=[],ea=0,ta=null,na=1,ra=``;function ia(e,t){Yi[Xi++]=Qi,Yi[Xi++]=Zi,Zi=e,Qi=t}function aa(e,t,n){$i[ea++]=na,$i[ea++]=ra,$i[ea++]=ta,ta=e;var r=na;e=ra;var i=32-it(r)-1;r&=~(1<<i),n+=1;var a=32-it(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,na=1<<32-it(t)+i|n<<i|r,ra=a+e}else na=1<<a|n<<i|r,ra=e}function oa(e){e.return!==null&&(ia(e,1),aa(e,1,0))}function sa(e){for(;e===Zi;)Zi=Yi[--Xi],Yi[Xi]=null,Qi=Yi[--Xi],Yi[Xi]=null;for(;e===ta;)ta=$i[--ea],$i[ea]=null,ra=$i[--ea],$i[ea]=null,na=$i[--ea],$i[ea]=null}function ca(e,t){$i[ea++]=na,$i[ea++]=ra,$i[ea++]=ta,na=t.id,ra=t.overflow,ta=e}var la=null,P=null,F=!1,ua=null,da=!1,fa=Error(s(519));function pa(e){throw ya(Ji(Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),fa}function ma(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[Ot]=e,t[kt]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<zf.length;n++)Q(zf[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),dn(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),hn(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||ep(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=wn),t=!0):t=!1,t||pa(e,!0)}function ha(e){for(la=e.return;la;)switch(la.tag){case 5:case 31:case 13:da=!1;return;case 27:case 3:da=!0;return;default:la=la.return}}function ga(e){if(e!==la)return!1;if(!F)return ha(e),F=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||pp(e.type,e.memoizedProps)),n=!n),n&&P&&pa(e),ha(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(s(317));P=dm(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(s(317));P=dm(e)}else t===27?(t=P,Sp(e.type)?(e=um,um=null,P=e):P=t):P=la?lm(e.stateNode.nextSibling):null;return!0}function _a(){P=la=null,F=!1}function va(){var e=ua;return e!==null&&(pd===null?pd=e:pd.push.apply(pd,e),ua=null),e}function ya(e){ua===null?ua=[e]:ua.push(e)}var ba=Ee(null),xa=null,Sa=null;function Ca(e,t,n){j(ba,t._currentValue),t._currentValue=n}function wa(e){e._currentValue=ba.current,A(ba)}function Ta(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function Ea(e,t,n,r){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var a=i.dependencies;if(a!==null){var o=i.child;a=a.firstContext;a:for(;a!==null;){var c=a;a=i;for(var l=0;l<t.length;l++)if(c.context===t[l]){a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),Ta(a.return,n,e),r||(o=null);break a}a=c.next}}else if(i.tag===18){if(o=i.return,o===null)throw Error(s(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),Ta(o,n,e),o=null}else i.tag===13&&i.memoizedState!==null&&i.memoizedState.dehydrated===null?(i.lanes|=n,o=i.alternate,o!==null&&(o.lanes|=n),Ta(i.return,n,e),o=i.child,o=o===null?null:o.sibling):o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===e){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}}function Da(e,t,n,r){e=null;for(var i=t,a=!1;i!==null;){if(!a){if(i.flags&524288)a=!0;else if(i.flags&262144)break}if(i.tag===10){var o=i.alternate;if(o===null)throw Error(s(387));if(o=o.memoizedProps,o!==null){var c=i.type;qr(i.pendingProps.value,o.value)||(e===null?e=[c]:e.push(c))}}else if(i===ke.current){if(o=i.alternate,o===null)throw Error(s(387));o.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e===null?e=[sh]:e.push(sh))}i=i.return}return e!==null&&Ea(t,e,n,r),t.flags|=262144,e!==null}function Oa(e){for(e=e.firstContext;e!==null;){if(!qr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ka(e){xa=e,Sa=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Aa(e){return Ma(xa,e)}function ja(e,t){return xa===null&&ka(e),Ma(e,t)}function Ma(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Sa===null){if(e===null)throw Error(s(308));Sa=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Sa=Sa.next=t;return n}var Na=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},Pa=t.unstable_scheduleCallback,Fa=t.unstable_NormalPriority,I={$$typeof:le,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ia(){return{controller:new Na,data:new Map,refCount:0}}function La(e){e.refCount--,e.refCount===0&&Pa(Fa,function(){e.controller.abort()})}function Ra(e,t){if(e.pendingLanes&4194048){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var r=t[e];n.indexOf(r)===-1&&n.push(r)}}}var za=null;function Ba(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var Va=null,Ha=0,Ua=0,Wa=null;function Ga(e,t){if(Va===null){var n=Va=[];Ha=0,Ua=Pf(),Wa={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return Ha++,t.then(Ka,Ka),t}function Ka(){if(--Ha===0&&(za=null,Va!==null)){Wa!==null&&(Wa.status=`fulfilled`);var e=Va;Va=null,Ua=0,Wa=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function qa(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Ja=O.S;O.S=function(e,t){if(gd=Ke(),typeof t==`object`&&t&&typeof t.then==`function`&&Ga(e,t),za!==null)for(var n=bf;n!==null;)Ra(n,za),n=n.next;if(n=e.types,n!==null){for(var r=bf;r!==null;)Ra(r,n),r=r.next;if(Ua!==0){r=za,r===null&&(r=za=[]);for(var i=0;i<n.length;i++){var a=n[i];r.indexOf(a)===-1&&r.push(a)}}}Ja!==null&&Ja(e,t)};var Ya=Ee(null);function Xa(){var e=Ya.current;return e===null?G.pooledCache:e}function Za(e,t){t===null?j(Ya,Ya.current):j(Ya,t.pool)}function Qa(){var e=Xa();return e===null?null:{parent:I._currentValue,pool:e}}var $a=Error(s(460)),eo=Error(s(474)),to=Error(s(542)),no={then:function(){}};function ro(e){return e=e.status,e===`fulfilled`||e===`rejected`}function io(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(wn,wn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,co(e),e===void 0&&!(`reason`in t)?Error(s(600)):e;default:if(typeof t.status==`string`)t.then(wn,wn);else{if(e=G,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,co(e),e}throw oo=t,$a}}function ao(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(oo=e,$a):e}}var oo=null;function so(){if(oo===null)throw Error(s(459));var e=oo;return oo=null,e}function co(e){if(e===$a||e===to)throw Error(s(483))}var lo=null,uo=0;function fo(e){var t=uo;return uo+=1,lo===null&&(lo=[]),io(lo,e,t)}function po(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function mo(e,t){throw t.$$typeof===T?Error(s(525)):(e=Object.prototype.toString.call(t),Error(s(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function ho(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function i(e,t){return e=Bi(e,t),e.index=0,e.sibling=null,e}function a(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=134217730,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function o(t){return e&&t.alternate===null&&(t.flags|=134217730),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Wi(n,e.mode,r),t.return=e,t):(t=i(t,n),t.return=e,t)}function l(e,t,n,r){var a=n.type;return a===ae?(e=d(e,t,n.props.children,r,n.key),po(e,n),e):t!==null&&(t.elementType===a||typeof a==`object`&&a&&a.$$typeof===pe&&ao(a)===t.type)?(t=i(t,n.props),po(t,n),t.return=e,t):(t=Hi(n.type,n.key,n.props,null,e.mode,r),po(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Ki(n,e.mode,r),t.return=e,t):(t=i(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,a){return t===null||t.tag!==7?(t=Ui(n,e.mode,r,a),t.return=e,t):(t=i(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Wi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case re:return n=Hi(t.type,t.key,t.props,null,e.mode,n),po(n,t),n.return=e,n;case ie:return t=Ki(t,e.mode,n),t.return=e,t;case pe:return t=ao(t),f(e,t,n)}if(Se(t)||ye(t))return t=Ui(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,fo(t),n);if(t.$$typeof===le)return f(e,ja(e,t),n);mo(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case re:return n.key===i?l(e,t,n,r):null;case ie:return n.key===i?u(e,t,n,r):null;case pe:return n=ao(n),p(e,t,n,r)}if(Se(n)||ye(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,fo(n),r);if(n.$$typeof===le)return p(e,t,ja(e,n),r);mo(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case re:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case ie:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case pe:return r=ao(r),m(e,t,n,r,i)}if(Se(r)||ye(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,fo(r),i);if(r.$$typeof===le)return m(e,t,n,ja(t,r),i);mo(t,r)}return null}function h(i,o,s,c){for(var l=null,u=null,d=o,h=o=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),o=a(_,o,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),F&&ia(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(o=a(d,o,h),u===null?l=d:u.sibling=d,u=d);return F&&ia(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&(_=g.alternate,_!==null&&d.delete(_.key===null?h:_.key)),o=a(g,o,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),F&&ia(i,h),l}function g(i,o,c,l){if(c==null)throw Error(s(151));for(var u=null,d=null,h=o,g=o=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(i,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(i,h),o=a(y,o,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(i,h),F&&ia(i,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(i,v.value,l),v!==null&&(o=a(v,o,g),d===null?u=v:d.sibling=v,d=v);return F&&ia(i,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,i,g,v.value,l),v!==null&&(e&&(_=v.alternate,_!==null&&h.delete(_.key===null?g:_.key)),o=a(v,o,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(i,e)}),F&&ia(i,g),u}function _(e,r,a,c){if(typeof a==`object`&&a&&a.type===ae&&a.key===null&&a.props.ref===void 0&&(a=a.props.children),typeof a==`object`&&a){switch(a.$$typeof){case re:a:{for(var l=a.key;r!==null;){if(r.key===l){if(l=a.type,l===ae){if(r.tag===7){n(e,r.sibling),c=i(r,a.props.children),po(c,a),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===pe&&ao(l)===r.type){n(e,r.sibling),c=i(r,a.props),po(c,a),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}a.type===ae?(c=Ui(a.props.children,e.mode,c,a.key),po(c,a),c.return=e,e=c):(c=Hi(a.type,a.key,a.props,null,e.mode,c),po(c,a),c.return=e,e=c)}return o(e);case ie:a:{for(l=a.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===a.containerInfo&&r.stateNode.implementation===a.implementation){n(e,r.sibling),c=i(r,a.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=Ki(a,e.mode,c),c.return=e,e=c}return o(e);case pe:return a=ao(a),_(e,r,a,c)}if(Se(a))return h(e,r,a,c);if(ye(a)){if(l=ye(a),typeof l!=`function`)throw Error(s(150));return a=l.call(a),g(e,r,a,c)}if(typeof a.then==`function`)return _(e,r,fo(a),c);if(a.$$typeof===le)return _(e,r,ja(e,a),c);mo(e,a)}return typeof a==`string`&&a!==``||typeof a==`number`||typeof a==`bigint`?(a=``+a,r!==null&&r.tag===6?(n(e,r.sibling),c=i(r,a),c.return=e,e=c):(n(e,r),c=Wi(a,e.mode,c),c.return=e,e=c),o(e)):n(e,r)}return function(e,t,n,r){try{uo=0;var i=_(e,t,n,r);return lo=null,i}catch(t){if(t===$a||t===to)throw t;var a=Ri(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var go=ho(!0),_o=ho(!1),vo=!1;function yo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function bo(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function xo(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function So(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,W&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=Fi(e),Pi(e,null,n),t}return ji(e,r,t,n),Fi(e)}function Co(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,xt(e,n)}}function wo(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n}else e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var To=!1;function Eo(){if(To){var e=Wa;if(e!==null)throw e}}function Do(e,t,n,r){To=!1;var i=e.updateQueue;vo=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(q&f)===f:(r&f)===f){f!==0&&f===Ua&&(To=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,h=s;f=t;var g=n;switch(h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(g,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(g,d,f):m,f==null)break a;d=w({},d,f);break a;case 2:vo=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),sd|=o,e.lanes=o,e.memoizedState=d}}function Oo(e,t){if(typeof e!=`function`)throw Error(s(191,e));e.call(t)}function ko(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Oo(n[e],t)}var Ao=Ee(null),jo=Ee(0);function Mo(e,t){e=od,j(jo,e),j(Ao,t),od=e|t.baseLanes}function No(){j(jo,od),j(Ao,Ao.current)}function Po(){od=jo.current,A(Ao),A(jo)}var Fo=Ee(null),Io=null;function Lo(e){var t=e.alternate;j(Ho,Ho.current&1),j(Fo,e),Io===null&&(t===null||Ao.current!==null||t.memoizedState!==null)&&(Io=e)}function Ro(e){j(Ho,Ho.current),j(Fo,e),Io===null&&(Io=e)}function zo(e){e.tag===22?(j(Ho,Ho.current),j(Fo,e),Io===null&&(Io=e)):Bo()}function Bo(){j(Ho,Ho.current),j(Fo,Fo.current)}function Vo(e){A(Fo),Io===e&&(Io=null),A(Ho)}var Ho=Ee(0);function Uo(e,t){j(Fo,Fo.current),j(Ho,t)}function Wo(e){A(Ho),A(Fo),Io===e&&(Io=null)}function Go(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||om(n)||sm(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==`independent`){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ko=0,L=null,R=null,qo=null,Jo=!1,Yo=!1,Xo=!1,Zo=0,Qo=0,$o=null,es=0;function z(){throw Error(s(321))}function ts(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!qr(e[n],t[n]))return!1;return!0}function ns(e,t,n,r,i,a){return Ko=a,L=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,O.H=e===null||e.memoizedState===null?vc:yc,Xo=!1,a=n(r,i),Xo=!1,Yo&&(a=is(t,n,r,i)),rs(e),a}function rs(e){O.H=_c;var t=R!==null&&R.next!==null;if(Ko=0,qo=R=L=null,Jo=!1,Qo=0,$o=null,t)throw Error(s(300));e===null||Ic||(e=e.dependencies,e!==null&&Oa(e)&&(Ic=!0))}function is(e,t,n,r){L=e;var i=0;do{if(Yo&&($o=null),Qo=0,Yo=!1,25<=i)throw Error(s(301));if(i+=1,qo=R=null,e.updateQueue!=null){var a=e.updateQueue;a.lastEffect=null,a.events=null,a.stores=null,a.memoCache!=null&&(a.memoCache.index=0)}O.H=bc,a=t(n,r)}while(Yo);return a}function as(){var e=O.H,t=e.useState()[0];return t=typeof t.then==`function`?ds(t):t,e=e.useState()[0],(R===null?null:R.memoizedState)!==e&&(L.flags|=1024),t}function os(){var e=Zo!==0;return Zo=0,e}function ss(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function cs(e){if(Jo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Jo=!1}Ko=0,qo=R=L=null,Yo=!1,Qo=Zo=0,$o=null}function ls(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return qo===null?L.memoizedState=qo=e:qo=qo.next=e,qo}function B(){if(R===null){var e=L.alternate;e=e===null?null:e.memoizedState}else e=R.next;var t=qo===null?L.memoizedState:qo.next;if(t!==null)qo=t,R=e;else{if(e===null)throw L.alternate===null?Error(s(467)):Error(s(310));R=e,e={memoizedState:R.memoizedState,baseState:R.baseState,baseQueue:R.baseQueue,queue:R.queue,next:null},qo===null?L.memoizedState=qo=e:qo=qo.next=e}return qo}function us(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ds(e){var t=Qo;return Qo+=1,$o===null&&($o=[]),e=io($o,e,t),t=L,(qo===null?t.memoizedState:qo.next)===null&&(t=t.alternate,O.H=t===null||t.memoizedState===null?vc:yc),e}function fs(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return ds(e);if(e.$$typeof===_e)return;if(e.$$typeof===le)return Aa(e)}throw Error(s(438,String(e)))}function ps(e){var t=null,n=L.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=L.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=us(),L.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=ge;return t.index++,n}function ms(e,t){return typeof t==`function`?t(e):t}function hs(e){return gs(B(),R,e)}function gs(e,t,n){var r=e.queue;if(r===null)throw Error(s(311));r.lastRenderedReducer=n;var i=e.baseQueue,a=r.pending;if(a!==null){if(i!==null){var o=i.next;i.next=a.next,a.next=o}t.baseQueue=i=a,r.pending=null}if(a=e.baseState,i===null)e.memoizedState=a;else{t=i.next;var c=o=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(Ko&f)===f:(q&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===Ua&&(d=!0);else if((Ko&p)===p){u=u.next,p===Ua&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,o=a):l=l.next=f,L.lanes|=p,sd|=p;f=u.action,Xo&&n(a,f),a=u.hasEagerState?u.eagerState:n(a,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,o=a):l=l.next=p,L.lanes|=f,sd|=f;u=u.next}while(u!==null&&u!==t);if(l===null?o=a:l.next=c,!qr(a,e.memoizedState)&&(Ic=!0,d&&(n=Wa,n!==null)))throw n;e.memoizedState=a,e.baseState=o,e.baseQueue=l,r.lastRenderedState=a}return i===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function _s(e){var t=B(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,a=t.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do a=e(a,o.action),o=o.next;while(o!==i);qr(a,t.memoizedState)||(Ic=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function vs(e,t,n){var r=L,i=B(),a=F;if(a){if(n===void 0)throw Error(s(407));n=n()}else n=t();var o=!qr((R||i).memoizedState,n);if(o&&(i.memoizedState=n,Ic=!0),i=i.queue,Us(xs.bind(null,r,i,e),[e]),e=i.getSnapshot!==t||o||qo!==null&&!!(qo.memoizedState.tag&1),Rs(e?9:8,{destroy:void 0},bs.bind(null,r,i,n,t),null),e){if(r.flags|=2048,G===null)throw Error(s(349));a||Ko&127||ys(r,t,n)}return n}function ys(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=L.updateQueue,t===null?(t=us(),L.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function bs(e,t,n,r){t.value=n,t.getSnapshot=r,Ss(t)&&Cs(e)}function xs(e,t,n){return n(function(){Ss(t)&&Cs(e)})}function Ss(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!qr(e,n)}catch{return!0}}function Cs(e){var t=Ni(e,2);t!==null&&Pd(t,e,2)}function ws(e){var t=ls();if(typeof e==`function`){var n=e;if(e=n(),Xo){rt(!0);try{n()}finally{rt(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ms,lastRenderedState:e},t}function Ts(e,t,n,r){return e.baseState=n,gs(e,R,typeof r==`function`?r:ms)}function Es(e,t,n,r,i){if(mc(e))throw Error(s(485));if(e=t.action,e!==null){var a={payload:i,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){a.listeners.push(e)}};O.T===null?a.isTransition=!1:n(!0),r(a),n=t.pending,n===null?(a.next=t.pending=a,Ds(t,a)):(a.next=n.next,t.pending=n.next=a)}}function Ds(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=O.T,o={};o.types=a===null?null:a.types,O.T=o;try{var s=n(i,r),c=O.S;c!==null&&c(o,s),Os(e,t,s)}catch(n){As(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),O.T=a}}else try{a=n(i,r),Os(e,t,a)}catch(n){As(e,t,n)}}function Os(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){ks(e,t,n)},function(n){return As(e,t,n)}):ks(e,t,n)}function ks(e,t,n){t.status=`fulfilled`,t.value=n,js(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Ds(e,n)))}function As(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,js(t),t=t.next;while(t!==r)}e.action=null}function js(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Ms(e,t){return t}function Ns(e,t){if(F){var n=G.formState;if(n!==null){a:{var r=L;if(F){if(P){b:{for(var i=P,a=da;i.nodeType!==8;)if(!a||(i=lm(i.nextSibling),i===null)){i=null;break b}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){P=lm(i.nextSibling),r=i.data===`F!`;break a}}pa(r)}r=!1}r&&(t=n[0])}}return n=ls(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ms,lastRenderedState:t},n.queue=r,n=dc.bind(null,L,r),r.dispatch=n,r=ws(!1),a=pc.bind(null,L,!1,r.queue),r=ls(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Es.bind(null,L,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function Ps(e){return Fs(B(),R,e)}function Fs(e,t,n){if(t=gs(e,t,Ms)[0],e=hs(ms)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=ds(t)}catch(e){throw e===$a?to:e}else r=t;t=B();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(L.flags|=2048,Rs(9,{destroy:void 0},Is.bind(null,i,n),null)),[r,a,e]}function Is(e,t){e.action=t}function Ls(e){var t=B(),n=R;if(n!==null)return Fs(t,n,e);B(),t=t.memoizedState,n=B();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function Rs(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=L.updateQueue,t===null&&(t=us(),L.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function zs(){return B().memoizedState}function Bs(e,t,n,r){var i=ls();L.flags|=e,i.memoizedState=Rs(1|t,{destroy:void 0},n,r===void 0?null:r)}function Vs(e,t,n,r){var i=B();r=r===void 0?null:r;var a=i.memoizedState.inst;R!==null&&r!==null&&ts(r,R.memoizedState.deps)?i.memoizedState=Rs(t,a,n,r):(L.flags|=e,i.memoizedState=Rs(1|t,a,n,r))}function Hs(e,t){Bs(8390656,8,e,t)}function Us(e,t){Vs(2048,8,e,t)}function Ws(e){L.flags|=4;var t=L.updateQueue;if(t===null)t=us(),L.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Gs(e){var t=B().memoizedState;return Ws({ref:t,nextImpl:e}),function(){if(W&2)throw Error(s(440));return t.impl.apply(void 0,arguments)}}function Ks(e,t){return Vs(4,2,e,t)}function qs(e,t){return Vs(4,4,e,t)}function Js(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ys(e,t,n){n=n==null?null:n.concat([e]),Vs(4,4,Js.bind(null,t,e),n)}function Xs(){}function Zs(e,t){var n=B();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&ts(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Qs(e,t){var n=B();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&ts(t,r[1]))return r[0];if(r=e(),Xo){rt(!0);try{e()}finally{rt(!1)}}return n.memoizedState=[r,t],r}function $s(e,t,n){return n===void 0||Ko&1073741824&&!(q&261930)?e.memoizedState=t:(e.memoizedState=n,e=Md(),L.lanes|=e,sd|=e,n)}function ec(e,t,n,r){return qr(n,t)?n:Ao.current===null?!(Ko&106)||Ko&1073741824&&!(q&261930)?(Ic=!0,e.memoizedState=n):(e=Md(),L.lanes|=e,sd|=e,t):(e=$s(e,n,r),qr(e,t)||(Ic=!0),e)}function tc(e,t,n,r,i){var a=k.p;k.p=a!==0&&8>a?a:8;var o=O.T,s={};s.types=o===null?null:o.types,O.T=s,pc(e,!1,t,n);try{var c=i(),l=O.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?fc(e,t,qa(c,r),jd(e)):fc(e,t,r,jd(e))}catch(n){fc(e,t,{then:function(){},status:`rejected`,reason:n},jd())}finally{k.p=a,o!==null&&s.types!==null&&(o.types=s.types),O.T=o}}function nc(){}function rc(e,t,n,r){if(e.tag!==5)throw Error(s(476));var i=ic(e).queue;tc(e,i,t,Ce,n===null?nc:function(){return ac(e),n(r)})}function ic(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Ce,baseState:Ce,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ms,lastRenderedState:Ce},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ms,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function ac(e){var t=ic(e);t.next===null&&(t=e.alternate.memoizedState),fc(e,t.next.queue,{},jd())}function oc(){return Aa(sh)}function sc(){return B().memoizedState}function cc(){return B().memoizedState}function lc(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=jd();e=xo(n);var r=So(t,e,n);r!==null&&(Pd(r,t,n),Co(r,t,n)),t={cache:Ia()},e.payload=t;return}t=t.return}}function uc(e,t,n){var r=jd();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},mc(e)?hc(t,n):(n=Mi(e,t,n,r),n!==null&&(Pd(n,e,r),gc(n,t,r)))}function dc(e,t,n){fc(e,t,n,jd())}function fc(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(mc(e))hc(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,qr(s,o))return ji(e,t,i,0),G===null&&Ai(),!1}catch{}if(n=Mi(e,t,i,r),n!==null)return Pd(n,e,r),gc(n,t,r),!0}return!1}function pc(e,t,n,r){if(r={lane:2,revertLane:Pf(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},mc(e)){if(t)throw Error(s(479))}else t=Mi(e,n,r,2),t!==null&&Pd(t,e,2)}function mc(e){var t=e.alternate;return e===L||t!==null&&t===L}function hc(e,t){Yo=Jo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function gc(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,xt(e,n)}}var _c={readContext:Aa,use:fs,useCallback:z,useContext:z,useEffect:z,useImperativeHandle:z,useLayoutEffect:z,useInsertionEffect:z,useMemo:z,useReducer:z,useRef:z,useState:z,useDebugValue:z,useDeferredValue:z,useTransition:z,useSyncExternalStore:z,useId:z,useHostTransitionStatus:z,useFormState:z,useActionState:z,useOptimistic:z,useMemoCache:z,useCacheRefresh:z,useEffectEvent:z},vc={readContext:Aa,use:fs,useCallback:function(e,t){return ls().memoizedState=[e,t===void 0?null:t],e},useContext:Aa,useEffect:Hs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),Bs(4194308,4,Js.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Bs(4194308,4,e,t)},useInsertionEffect:function(e,t){Bs(4,2,e,t)},useMemo:function(e,t){var n=ls();t=t===void 0?null:t;var r=e();if(Xo){rt(!0);try{e()}finally{rt(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=ls();if(n!==void 0){var i=n(t);if(Xo){rt(!0);try{n(t)}finally{rt(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=uc.bind(null,L,e),[r.memoizedState,e]},useRef:function(e){var t=ls();return e={current:e},t.memoizedState=e},useState:function(e){e=ws(e);var t=e.queue,n=dc.bind(null,L,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Xs,useDeferredValue:function(e,t){return $s(ls(),e,t)},useTransition:function(){var e=ws(!1);return e=tc.bind(null,L,e.queue,!0,!1),ls().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=L,i=ls();if(F){if(n===void 0)throw Error(s(407));n=n()}else{if(n=t(),G===null)throw Error(s(349));q&127||ys(r,t,n)}i.memoizedState=n;var a={value:n,getSnapshot:t};return i.queue=a,Hs(xs.bind(null,r,a,e),[e]),r.flags|=2048,Rs(9,{destroy:void 0},bs.bind(null,r,a,n,t),null),n},useId:function(){var e=ls(),t=G.identifierPrefix;if(F){var n=ra,r=na;n=(r&~(1<<32-it(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=Zo++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=es++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:oc,useFormState:Ns,useActionState:Ns,useOptimistic:function(e){var t=ls();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=pc.bind(null,L,!0,n),n.dispatch=t,[e,t]},useMemoCache:ps,useCacheRefresh:function(){return ls().memoizedState=lc.bind(null,L)},useEffectEvent:function(e){var t=ls(),n={impl:e};return t.memoizedState=n,function(){if(W&2)throw Error(s(440));return n.impl.apply(void 0,arguments)}}},yc={readContext:Aa,use:fs,useCallback:Zs,useContext:Aa,useEffect:Us,useImperativeHandle:Ys,useInsertionEffect:Ks,useLayoutEffect:qs,useMemo:Qs,useReducer:hs,useRef:zs,useState:function(){return hs(ms)},useDebugValue:Xs,useDeferredValue:function(e,t){return ec(B(),R.memoizedState,e,t)},useTransition:function(){var e=hs(ms)[0],t=B().memoizedState;return[typeof e==`boolean`?e:ds(e),t]},useSyncExternalStore:vs,useId:sc,useHostTransitionStatus:oc,useFormState:Ps,useActionState:Ps,useOptimistic:function(e,t){return Ts(B(),R,e,t)},useMemoCache:ps,useCacheRefresh:cc,useEffectEvent:Gs},bc={readContext:Aa,use:fs,useCallback:Zs,useContext:Aa,useEffect:Us,useImperativeHandle:Ys,useInsertionEffect:Ks,useLayoutEffect:qs,useMemo:Qs,useReducer:_s,useRef:zs,useState:function(){return _s(ms)},useDebugValue:Xs,useDeferredValue:function(e,t){var n=B();return R===null?$s(n,e,t):ec(n,R.memoizedState,e,t)},useTransition:function(){var e=_s(ms)[0],t=B().memoizedState;return[typeof e==`boolean`?e:ds(e),t]},useSyncExternalStore:vs,useId:sc,useHostTransitionStatus:oc,useFormState:Ls,useActionState:Ls,useOptimistic:function(e,t){var n=B();return R===null?(n.baseState=e,[e,n.queue.dispatch]):Ts(n,R,e,t)},useMemoCache:ps,useCacheRefresh:cc,useEffectEvent:Gs};function xc(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:w({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Sc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=jd(),i=xo(r);i.payload=t,n!=null&&(i.callback=n),t=So(e,i,r),t!==null&&(Pd(t,e,r),Co(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=jd(),i=xo(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=So(e,i,r),t!==null&&(Pd(t,e,r),Co(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=jd(),r=xo(n);r.tag=2,t!=null&&(r.callback=t),t=So(e,r,n),t!==null&&(Pd(t,e,n),Co(t,e,n))}};function Cc(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Jr(n,r)||!Jr(i,a):!0}function wc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Sc.enqueueReplaceState(t,t.state,null)}function Tc(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=w({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Ec(e){Ei(e)}function Dc(e){console.error(e)}function Oc(e){Ei(e)}function kc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Ac(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function jc(e,t,n){return n=xo(n),n.tag=3,n.payload={element:null},n.callback=function(){kc(e,t)},n}function Mc(e){return e=xo(e),e.tag=3,e}function Nc(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Ac(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Ac(t,n,r),typeof i!=`function`&&(yd===null?yd=new Set([this]):yd.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function Pc(e,t,n,r,i){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&Da(t,n,i,!0),n=Fo.current,n!==null){switch(n.tag){case 31:case 13:case 19:return Io===null?Kd():n.alternate===null&&Y===0&&(Y=3),n.flags&=-257,n.flags|=65536,n.lanes=i,r===no?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),mf(e,r,i)),!1;case 22:return n.flags|=65536,r===no?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),mf(e,r,i)),!1}throw Error(s(435,n.tag))}return mf(e,r,i),Kd(),!1}if(F)return t=Fo.current,t===null?(r!==fa&&(t=Error(s(423),{cause:r}),ya(Ji(t,n))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,r=Ji(r,n),i=jc(e.stateNode,r,i),wo(e,i),Y!==4&&(Y=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=i,r!==fa&&(e=Error(s(422),{cause:r}),ya(Ji(e,n)))),!1;var a=Error(s(520),{cause:r});if(a=Ji(a,n),fd===null?fd=[a]:fd.push(a),Y!==4&&(Y=2),t===null)return!0;r=Ji(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=i&-i,n.lanes|=e,e=jc(n.stateNode,r,e),wo(n,e),!1;case 1:if(t=n.type,a=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||a!==null&&typeof a.componentDidCatch==`function`&&(yd===null||!yd.has(a))))return n.flags|=65536,i&=-i,n.lanes|=i,i=Mc(i),Nc(i,e,n,r),wo(n,i),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var Fc=Error(s(461)),Ic=!1;function Lc(e,t,n,r){t.child=e===null?_o(t,null,n,r):go(t,e.child,n,r)}function Rc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ka(t),r=ns(e,t,n,o,a,i),s=os(),e!==null&&!Ic?(ss(e,t,i),fl(e,t,i)):(F&&s&&oa(t),t.flags|=1,Lc(e,t,r,i),t.child)}function zc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!zi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,Bc(e,t,a,r,i)):(e=Hi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!pl(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Jr:n,n(o,r)&&e.ref===t.ref)return fl(e,t,i)}return t.flags|=1,e=Bi(a,r),e.ref=t.ref,e.return=t,t.child=e}function Bc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Jr(a,r)&&e.ref===t.ref){if(Ic=!1,t.pendingProps=r=a,pl(e,i))e.flags&131072&&(Ic=!0);else return t.lanes=e.lanes,fl(e,t,i)}}return Jc(e,t,n,r,i)}function Vc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return Uc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Za(t,a===null?null:a.cachePool),a===null?No():Mo(t,a),zo(t);else return r=t.lanes=536870912,Uc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Za(t,null),No(),Bo()):(Za(t,a.cachePool),Mo(t,a),Bo(),t.memoizedState=null);return Lc(e,t,i,n),t.child}function Hc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Uc(e,t,n,r,i){var a=Xa();return a=a===null?null:{parent:I._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Za(t,null),No(),zo(t),e!==null&&Da(e,t,r,!0),t.childLanes=i,null}function Wc(e,t){return t=rl({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Gc(e,t,n){return go(t,e.child,null,n),e=Wc(t,t.pendingProps),e.flags|=2,Vo(t),t.memoizedState=null,e}function Kc(e,t,n){var r=t.pendingProps,i=!!(t.flags&128);if(t.flags&=-129,e===null){if(F){if(r.mode===`hidden`)return e=Wc(t,r),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Hc(null,e);if(Ro(t),(e=P)?(e=am(e,da),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ta===null?null:{id:na,overflow:ra},retryLane:536870912,hydrationErrors:null},n=Gi(e),n.return=t,t.child=n,la=t,P=null)):e=null,e===null)throw pa(t);return t.lanes=536870912,null}return Wc(t,r)}var a=e.memoizedState;if(a!==null){var o=a.dehydrated;if(Ro(t),i){if(t.flags&256)t.flags&=-257,t=Gc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(s(558))}else if(Ic||Da(e,t,n,!1),i=(n&e.childLanes)!==0,Ic||i){if(Ao.current===null){if(r=G,r!==null&&(o=St(r,n),o!==0&&o!==a.retryLane))throw a.retryLane=o,Ni(e,o),Pd(r,e,o),Fc;Kd()}t=Gc(e,t,n)}else e=a.treeContext,P=lm(o.nextSibling),la=t,F=!0,ua=null,da=!1,e!==null&&ca(t,e),t=Wc(t,r),t.flags|=134221824;return t}return e=Bi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function qc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(s(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Jc(e,t,n,r,i){return ka(t),n=ns(e,t,n,r,void 0,i),r=os(),e!==null&&!Ic?(ss(e,t,i),fl(e,t,i)):(F&&r&&oa(t),t.flags|=1,Lc(e,t,n,i),t.child)}function Yc(e,t,n,r,i,a){return ka(t),t.updateQueue=null,n=is(t,r,n,i),rs(e),r=os(),e!==null&&!Ic?(ss(e,t,a),fl(e,t,a)):(F&&r&&oa(t),t.flags|=1,Lc(e,t,n,a),t.child)}function Xc(e,t,n,r,i){if(ka(t),t.stateNode===null){var a=Ii,o=n.contextType;typeof o==`object`&&o&&(a=Aa(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Sc,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},yo(t),o=n.contextType,a.context=typeof o==`object`&&o?Aa(o):Ii,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(xc(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Sc.enqueueReplaceState(a,a.state,null),Do(t,r,a,i),Eo(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Tc(n,s);a.props=c;var l=a.context,u=n.contextType;o=Ii,typeof u==`object`&&u&&(o=Aa(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&wc(t,a,r,o),vo=!1;var f=t.memoizedState;a.state=f,Do(t,r,a,i),Eo(),l=t.memoizedState,s||f!==l||vo?(typeof d==`function`&&(xc(t,n,d,r),l=t.memoizedState),(c=vo||Cc(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,bo(e,t),o=t.memoizedProps,u=Tc(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=Ii,typeof l==`object`&&l&&(c=Aa(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&wc(t,a,r,c),vo=!1,f=t.memoizedState,a.state=f,Do(t,r,a,i),Eo();var p=t.memoizedState;o!==d||f!==p||vo||e!==null&&e.dependencies!==null&&Oa(e.dependencies)?(typeof s==`function`&&(xc(t,n,s,r),p=t.memoizedState),(u=vo||Cc(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&Oa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,qc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=go(t,e.child,null,i),t.child=go(t,null,n,i)):Lc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=fl(e,t,i),e}function Zc(e,t,n,r){return _a(),t.flags|=256,Lc(e,t,n,r),t.child}var Qc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function $c(e){return{baseLanes:e,cachePool:Qa()}}function el(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=ud),e}function tl(e,t,n){var r=t.pendingProps,i=!1,a=!!(t.flags&128),o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:!!(Ho.current&2)),o&&(i=!0,t.flags&=-129),o=!!(t.flags&32),t.flags&=-33,e===null){if(F){if(i?Lo(t):Bo(),(e=P)?(e=am(e,da),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ta===null?null:{id:na,overflow:ra},retryLane:536870912,hydrationErrors:null},n=Gi(e),n.return=t,t.child=n,la=t,P=null)):e=null,e===null)throw pa(t);return t.lanes=sm(e)?32:536870912,null}return a=r.children,r=r.fallback,i?(Bo(),i=t.mode,a=rl({mode:`hidden`,children:a},i),r=Ui(r,i,n,null),a.return=t,r.return=t,a.sibling=r,t.child=a,r=t.child,r.memoizedState=$c(n),r.childLanes=el(e,o,n),t.memoizedState=Qc,Hc(null,r)):(Lo(t),nl(t,a))}var s=e.memoizedState;if(s!==null){var c=s.dehydrated;if(c!==null)return al(e,t,a,o,r,c,s,n)}return i?(Bo(),i=r.fallback,a=t.mode,s=e.child,c=s.sibling,r=Bi(s,{mode:`hidden`,children:r.children}),r.subtreeFlags=s.subtreeFlags&1206910976,c===null?(i=Ui(i,a,n,null),i.flags|=2):i=Bi(c,i),i.return=t,r.return=t,r.sibling=i,t.child=r,Hc(null,r),r=t.child,i=e.child.memoizedState,i===null?i=$c(n):(a=i.cachePool,a===null?a=Qa():(s=I._currentValue,a=a.parent===s?a:{parent:s,pool:s}),i={baseLanes:i.baseLanes|n,cachePool:a}),r.memoizedState=i,r.childLanes=el(e,o,n),t.memoizedState=Qc,Hc(e.child,r)):(Lo(t),n=e.child,e=n.sibling,n=Bi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=n,t.memoizedState=null,n)}function nl(e,t){return t=rl({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function rl(e,t){return e=Ri(22,e,null,t),e.lanes=0,e}function il(e,t,n){return go(t,e.child,null,n),e=nl(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function al(e,t,n,r,i,a,o,c){if(n)return t.flags&256?(Lo(t),t.flags&=-257,il(e,t,c)):t.memoizedState===null?(Bo(),a=i.fallback,o=t.mode,i=rl({mode:`visible`,children:i.children},o),a=Ui(a,o,c,null),a.flags|=2,i.return=t,a.return=t,i.sibling=a,t.child=i,go(t,e.child,null,c),i=t.child,i.memoizedState=$c(c),i.childLanes=el(e,r,c),t.memoizedState=Qc,Hc(null,i)):(Bo(),t.child=e.child,t.flags|=128,null);if(Lo(t),sm(a)){if(r=a.nextSibling&&a.nextSibling.dataset,r)var l=r.dgst;return r=l,r!==``&&(i=Error(s(419)),i.stack=``,i.digest=r,ya({value:i,source:null,stack:null})),il(e,t,c)}if(Ic||Da(e,t,c,!1),r=(c&e.childLanes)!==0,Ic||r){if(Ao.current!==null)return il(e,t,c);if(r=G,r!==null&&(i=St(r,c),i!==0&&i!==o.retryLane))throw o.retryLane=i,Ni(e,i),Pd(r,e,i),Fc;return om(a)||Kd(),il(e,t,c)}return om(a)?(t.flags|=192,t.child=e.child,null):(e=o.treeContext,P=lm(a.nextSibling),la=t,F=!0,ua=null,da=!1,e!==null&&ca(t,e),t=nl(t,i.children),t.flags|=134221824,t)}function ol(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Ta(e.return,t,n)}function sl(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Go(n)===null&&(t=e),e=e.sibling}return t}function cl(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function ll(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function ul(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=Ho.current;if(t.flags&128)return Uo(t,o),null;var s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,Uo(t,o),i===`backwards`&&e!==null?(ll(e),Lc(e,t,r,n),ll(e)):Lc(e,t,r,n),r=F?Qi:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ol(e,n,t);else if(e.tag===19)ol(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`backwards`:n=sl(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null,ll(t)),cl(t,!0,i,null,a,r);break;case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&Go(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}cl(t,!0,n,null,a,r);break;case`together`:cl(t,!1,null,null,void 0,r);break;case`independent`:t.memoizedState=null;break;default:n=sl(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),cl(t,!1,i,n,a,r)}return t.child}function dl(e,t,n){var r=t.pendingProps;return Ca(t,t.type,r.value),Lc(e,t,r.children,n),t.child}function fl(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),sd|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(Da(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(s(153));if(t.child!==null){for(e=t.child,n=Bi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Bi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function pl(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&Oa(e)))}function ml(e,t,n){switch(t.tag){case 3:Ae(t,t.stateNode.containerInfo),Ca(t,I,e.memoizedState.cache),_a();break;case 27:case 5:Me(t);break;case 4:Ae(t,t.stateNode.containerInfo);break;case 10:Ca(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ro(t),null;break;case 13:var r=t.memoizedState;if(r!==null){if(r.dehydrated!==null)return Lo(t),t.flags|=128,null;r=Da(e,t,n,!1);var i=t.child.childLanes;return r||(n&i)!==0?tl(e,t,n):(Lo(t),e=fl(e,t,n),e===null?null:e.sibling)}Lo(t);break;case 19:if(t.flags&128)return ul(e,t,n);if(i=!!(e.flags&128),r=(n&t.childLanes)!==0,r||=(Da(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return ul(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Uo(t,Ho.current),r)break;return null;case 22:return t.lanes=0,Vc(e,t,n,t.pendingProps);case 24:Ca(t,I,e.memoizedState.cache)}return fl(e,t,n)}function hl(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)Ic=!0;else{if(!pl(e,n)&&!(t.flags&128))return Ic=!1,ml(e,t,n);Ic=!!(e.flags&131072)}}else Ic=!1,F&&t.flags&1048576&&aa(t,Qi,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=ao(t.elementType),t.type=e,typeof e==`function`)zi(e)?(r=Tc(e,r),t.tag=1,t=Xc(null,t,e,r,n)):(t.tag=0,t=Jc(null,t,e,r,n));else{if(e!=null){var i=e.$$typeof;if(i===ue){t.tag=11,t=Rc(null,t,e,r,n);break a}if(i===E){t.tag=14,t=zc(null,t,e,r,n);break a}if(i===le){t.tag=10,t.type=e,t=dl(null,t,n);break a}}throw t=xe(e)||e,Error(s(306,t,``))}}return t;case 0:return Jc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,i=Tc(r,t.pendingProps),Xc(e,t,r,i,n);case 3:a:{if(Ae(t,t.stateNode.containerInfo),e===null)throw Error(s(387));r=t.pendingProps;var a=t.memoizedState;i=a.element,bo(e,t),Do(t,r,null,n);var o=t.memoizedState;if(r=o.cache,Ca(t,I,r),r!==a.cache&&Ea(t,[I],n,!0),Eo(),r=o.element,a.isDehydrated){if(a={element:r,isDehydrated:!1,cache:o.cache},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){t=Zc(e,t,r,n);break a}if(r!==i){i=Ji(Error(s(424)),t),ya(i),t=Zc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(P=lm(e.firstChild),la=t,F=!0,ua=null,da=!0,n=_o(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling}else{if(_a(),r===i){t=fl(e,t,n);break a}Lc(e,t,r,n)}t=t.child}return t;case 26:return qc(e,t),e===null?(n=Nm(t.type,null,t.pendingProps,null))?t.memoizedState=n:F||(t.stateNode=fp(t.type,t.pendingProps,M.current,t)):t.memoizedState=Nm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Me(t),e===null&&F&&(r=t.stateNode=hm(t.type,t.pendingProps,M.current),la=t,da=!0,i=P,Sp(t.type)?(um=i,P=lm(r.firstChild)):P=i),Lc(e,t,t.pendingProps.children,n),qc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&F&&((i=r=P)&&(r=rm(r,t.type,t.pendingProps,da),r===null?i=!1:(t.stateNode=r,la=t,P=lm(r.firstChild),da=!1,i=!0)),i||pa(t)),Me(t),i=t.type,a=t.pendingProps,o=e===null?null:e.memoizedProps,r=a.children,pp(i,a)?r=null:o!==null&&pp(i,o)&&(t.flags|=32),t.memoizedState!==null&&(i=ns(e,t,as,null,null,n),sh._currentValue=i),qc(e,t),Lc(e,t,r,n),t.child;case 6:return e===null&&F&&((e=n=P)&&(n=im(n,t.pendingProps,da),n===null?e=!1:(t.stateNode=n,la=t,P=null,e=!0)),e||pa(t)),null;case 13:return tl(e,t,n);case 4:return Ae(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=go(t,null,r,n):Lc(e,t,r,n),t.child;case 11:return Rc(e,t,t.type,t.pendingProps,n);case 7:return r=t.pendingProps,qc(e,t),Lc(e,t,r,n),t.child;case 8:return Lc(e,t,t.pendingProps.children,n),t.child;case 12:return Lc(e,t,t.pendingProps.children,n),t.child;case 10:return dl(e,t,n);case 9:return i=t.type._context,r=t.pendingProps.children,ka(t),i=Aa(i),r=r(i),t.flags|=1,Lc(e,t,r,n),t.child;case 14:return zc(e,t,t.type,t.pendingProps,n);case 15:return Bc(e,t,t.type,t.pendingProps,n);case 19:return ul(e,t,n);case 31:return Kc(e,t,n);case 22:return Vc(e,t,n,t.pendingProps);case 24:return ka(t),r=Aa(I),e===null?(i=Xa(),i===null&&(i=G,a=Ia(),i.pooledCache=a,a.refCount++,a!==null&&(i.pooledCacheLanes|=n),i=a),t.memoizedState={parent:r,cache:i},yo(t),Ca(t,I,i)):((e.lanes&n)!==0&&(bo(e,t),Do(t,null,null,n),Eo()),i=e.memoizedState,a=t.memoizedState,i.parent===r?(r=a.cache,Ca(t,I,r),r!==i.cache&&Ea(t,[I],n,!0)):(i={parent:r,cache:r},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),Ca(t,I,r))),Lc(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=t.pendingProps,r.name!=null&&r.name!==`auto`?t.flags|=e===null?18882560:18874368:F&&oa(t),e!==null&&e.memoizedProps.name!==r.name?t.flags|=4194816:qc(e,t),Lc(e,t,r.children,n),t.child;case 29:throw t.pendingProps}throw Error(s(156,t.tag))}function gl(e){e.flags|=4}function _l(e,t,n,r,i){var a;if((a=!!(e.mode&32))&&(a=n===null?Jm(t,r):Jm(t,r)&&(r.src!==n.src||r.srcSet!==n.srcSet)),a){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(Ud())e.flags|=8192;else throw oo=no,eo}}else e.flags&=-16777217}function vl(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Ym(t)){if(Ud())e.flags|=8192;else throw oo=no,eo}}function yl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:gt(),e.lanes|=t,dd|=t)}function bl(e,t){if(!F)switch(e.tailMode){case`visible`:break;case`collapsed`:for(var n=e.tail,r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function V(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&1206910976,r|=i.flags&1206910976,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function xl(e,t,n){var r=t.pendingProps;switch(sa(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return V(t),null;case 1:return V(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),wa(I),je(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(ga(t)?gl(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,va())),V(t),null;case 26:var i=t.type,a=t.memoizedState;return e===null?(gl(t),a===null?(V(t),_l(t,i,null,r,n)):(V(t),vl(t,a))):a?a===e.memoizedState?(V(t),t.flags&=-16777217):(gl(t),V(t),vl(t,a)):(e=e.memoizedProps,e!==r&&gl(t),V(t),_l(t,i,e,r,n)),null;case 27:if(Ne(t),n=M.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&gl(t);else{if(!r){if(t.stateNode===null)throw Error(s(166));return V(t),t.subtreeFlags&=-33554433,null}e=De.current,ga(t)?ma(t,e):(e=hm(i,r,n),t.stateNode=e,gl(t))}return V(t),t.subtreeFlags&=-33554433,null;case 5:if(Ne(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&gl(t);else{if(!r){if(t.stateNode===null)throw Error(s(166));return V(t),t.subtreeFlags&=-33554433,null}if(a=De.current,ga(t))ma(t,a);else{var o=lp(M.current);switch(a){case 1:a=o.createElementNS(`http://www.w3.org/2000/svg`,i);break;case 2:a=o.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;default:switch(i){case`svg`:a=o.createElementNS(`http://www.w3.org/2000/svg`,i);break;case`math`:a=o.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;case`script`:a=o.createElement(`div`),a.innerHTML=`<script><\/script>`,a=a.removeChild(a.firstChild);break;case`select`:a=typeof r.is==`string`?o.createElement(`select`,{is:r.is}):o.createElement(`select`),r.multiple?a.multiple=!0:r.size&&(a.size=r.size);break;default:a=typeof r.is==`string`?o.createElement(i,{is:r.is}):o.createElement(i)}}a[Ot]=t,a[kt]=r;a:for(o=t.child;o!==null;){if(o.tag===5||o.tag===6)a.appendChild(o.stateNode);else if(o.tag!==4&&o.tag!==27&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===t)break a;for(;o.sibling===null;){if(o.return===null||o.return===t)break a;o=o.return}o.sibling.return=o.return,o=o.sibling}t.stateNode=a;a:switch(np(a,i,r),i){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&gl(t)}}return V(t),t.subtreeFlags&=-33554433,_l(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&gl(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(s(166));if(e=M.current,ga(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,i=la,i!==null)switch(i.tag){case 27:case 5:r=i.memoizedProps}e[Ot]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||ep(e.nodeValue,n)),e||pa(t,!0)}else e=lp(e).createTextNode(r),e[Ot]=t,t.stateNode=e}return V(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=ga(t),n!==null){if(e===null){if(!r)throw Error(s(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(s(557));e[Ot]=t}else _a(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;V(t),e=!1}else n=va(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Vo(t),t):(Vo(t),null);if(t.flags&128)throw Error(s(558))}return V(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=ga(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(s(318));if(i=t.memoizedState,i=i===null?null:i.dehydrated,!i)throw Error(s(317));i[Ot]=t}else _a(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;V(t),i=!1}else i=va(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(Vo(t),t):(Vo(t),null)}return Vo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,i=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(i=r.alternate.memoizedState.cachePool.pool),a=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(a=r.memoizedState.cachePool.pool),a!==i&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),yl(t,t.updateQueue),V(t),null);case 4:return je(),e===null&&Wf(t.stateNode.containerInfo),t.flags|=67108864,V(t),null;case 10:return wa(t.type),V(t),null;case 19:if(Wo(t),r=t.memoizedState,r===null)return V(t),null;if(i=!!(t.flags&128),a=r.rendering,a===null){if(i)bl(r,!1);else{if(Y!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(a=Go(e),a!==null){for(t.flags|=128,bl(r,!1),e=a.updateQueue,t.updateQueue=e,yl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Vi(n,e),n=n.sibling;return Uo(t,Ho.current&1|2),F&&ia(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Ke()>_d&&(t.flags|=128,i=!0,bl(r,!1),t.lanes=4194304)}}else{if(!i){if(e=Go(a),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,yl(t,e),bl(r,!0),r.tail===null&&r.tailMode!==`collapsed`&&r.tailMode!==`visible`&&!a.alternate&&!F)return V(t),null}else 2*Ke()-r.renderingStartTime>_d&&n!==536870912&&(t.flags|=128,i=!0,bl(r,!1),t.lanes=4194304)}r.isBackwards?(a.sibling=t.child,t.child=a):(e=r.last,e===null?t.child=a:e.sibling=a,r.last=a)}if(r.tail!==null){e=r.tail;a:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break a}n=n.sibling}n=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Ke(),e.sibling=null,a=Ho.current,a=i?a&1|2:a&1,r.tailMode===`visible`||r.tailMode===`collapsed`||!n||F?Uo(t,a):(n=a,j(Fo,t),j(Ho,n),Io===null&&(Io=t)),F&&ia(t,r.treeForkCount),e}return V(t),null;case 22:case 23:return Vo(t),Po(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(V(t),t.subtreeFlags&6&&(t.flags|=8192)):V(t),n=t.updateQueue,n!==null&&yl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&A(Ya),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),wa(I),V(t),null;case 25:return null;case 30:return t.flags|=33554432,V(t),null}throw Error(s(156,t.tag))}function Sl(e,t){switch(sa(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return wa(I),je(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Ne(t),null;case 31:if(t.memoizedState!==null){if(Vo(t),t.alternate===null)throw Error(s(340));_a()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Vo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(s(340));_a()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Wo(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return je(),null;case 10:return wa(t.type),null;case 22:case 23:return Vo(t),Po(),e!==null&&A(Ya),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return wa(I),null;case 25:return null;default:return null}}function Cl(e,t){switch(sa(t),t.tag){case 3:wa(I),je();break;case 26:case 27:case 5:Ne(t);break;case 4:je();break;case 31:t.memoizedState!==null&&Vo(t);break;case 13:Vo(t);break;case 19:Wo(t);break;case 10:wa(t.type);break;case 22:case 23:Vo(t),Po(),e!==null&&A(Ya);break;case 24:wa(I)}}function wl(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Tl(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function El(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{ko(t,n)}catch(t){Z(e,e.return,t)}}}function Dl(e,t,n){n.props=Tc(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Ol(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var i=e.stateNode,a=Ci(e.memoizedProps,i);(i.ref===null||i.ref.name!==a)&&(i.ref=Pp(a)),r=i.ref;break;case 7:if(e.stateNode===null){var o=new Fp(e);h(e.child,!1,Qp,o,void 0,void 0),e.stateNode=o}r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function kl(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Al(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)em(e.stateNode,t[n])}function jl(e){for(var t=e.return;t!==null&&(Pl(t)&&em(e.stateNode,t.stateNode),!Nl(t));)t=t.return}function Ml(e){for(var t=e.return;t!==null&&(Pl(t)&&tm(e.stateNode,t.stateNode),!Nl(t));)t=t.return}function Nl(e){return e.tag===5||e.tag===3||e.tag===27}function Pl(e){return e&&e.tag===7&&e.stateNode!==null}function Fl(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Il(e,t,n){try{var r=e.stateNode;ip(r,e.type,n,t),r[kt]=t}catch(t){Z(e,e.return,t)}}function Ll(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Sp(e.type)||e.tag===4}function Rl(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Ll(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Sp(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function zl(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(i,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(i),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=wn)),Al(e,r),N=!0;else if(i!==4&&(i===27&&(Al(e,r),r=null,Sp(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(zl(e,t,n,r),e=e.sibling;e!==null;)zl(e,t,n,r),e=e.sibling}function Bl(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?n.insertBefore(i,t):n.appendChild(i),Al(e,r),N=!0;else if(i!==4&&(i===27&&(Al(e,r),r=null,Sp(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Bl(e,t,n,r),e=e.sibling;e!==null;)Bl(e,t,n,r),e=e.sibling}function Vl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);np(t,r,n),t[Ot]=e,t[kt]=n}catch(t){Z(e,e.return,t)}}var Hl=!1,Ul=null;function Wl(e){(e.tag===30||e.subtreeFlags&33554432)&&(Hl=!0)}var Gl=null;function Kl(){var e=Gl;return Gl=null,e}var ql=0;function Jl(e,t,n,r,i){return ql=0,Yl(e.child,t,n,r,i)}function Yl(e,t,n,r,i){for(var a=!1;e!==null;){if(e.tag===5){var o=e.stateNode;if(r!==null){var s=Op(o);r.push(s),s.view&&(a=!0)}else a||Op(o).view&&(a=!0);Hl=!0,Tp(o,ql===0?t:t+`_`+ql,n),ql++}else e.tag===22&&e.memoizedState!==null||e.tag===30&&i||Yl(e.child,t,n,r,i)&&(a=!0);e=e.sibling}return a}function Xl(e,t){for(;e!==null;)e.tag===5?Ep(e.stateNode,e.memoizedProps):e.tag===22&&e.memoizedState!==null||e.tag===30&&t||Xl(e.child,t),e=e.sibling}function Zl(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Zl(e),e.tag===30&&e.flags&18874368&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name===`auto`)throw Error(s(544));var n=t.name;t=Ti(t.default,t.share),t!==`none`&&(Jl(e,n,t,null,!1)||Xl(e.child,!1))}e=e.sibling}}function Ql(e,t){if(e.tag===30){var n=e.stateNode,r=e.memoizedProps,i=Ci(r,n),a=Ti(r.default,n.paired?r.share:r.enter);a===`none`?Zl(e):Jl(e,i,a,null,!1)?(Zl(e),n.paired||t||Nd(e,r.onEnter)):Xl(e.child,!1)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Ql(e,t),e=e.sibling;else Zl(e)}function $l(e){if(Ul!==null&&Ul.size!==0){var t=Ul;if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var n=e.memoizedProps,r=n.name;if(r!=null&&r!==`auto`){var i=t.get(r);if(i!==void 0){var a=Ti(n.default,n.share);if(a!==`none`&&(Jl(e,r,a,null,!1)?(a=e.stateNode,i.paired=a,a.paired=i,Nd(e,n.onShare)):Xl(e.child,!1)),t.delete(r),t.size===0)break}}}$l(e)}e=e.sibling}}}function eu(e){if(e.tag===30){var t=e.memoizedProps,n=Ci(t,e.stateNode),r=Ul===null?void 0:Ul.get(n),i=Ti(t.default,r===void 0?t.exit:t.share);i!==`none`&&(Jl(e,n,i,null,!1)?r===void 0?Nd(e,t.onExit):(i=e.stateNode,r.paired=i,i.paired=r,Ul.delete(n),Nd(e,t.onShare)):Xl(e.child,!1)),Ul!==null&&$l(e)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)eu(e),e=e.sibling;else Ul!==null&&$l(e)}function tu(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=Ci(t,e.stateNode);t=Ti(t.default,t.update),e.flags&=-5,t!==`none`&&Jl(e,n,t,e.memoizedState=[],!1)}else e.subtreeFlags&33554432&&tu(e);e=e.sibling}}function nu(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var t=e.stateNode;t.paired!==null&&(t.paired=null,Xl(e.child,!1))}nu(e)}e=e.sibling}}function ru(e){if(e.tag===30)e.stateNode.paired=null,Xl(e.child,!1),nu(e);else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)ru(e),e=e.sibling;else nu(e)}function iu(e){for(e=e.child;e!==null;)e.tag===30?Xl(e.child,!1):e.subtreeFlags&33554432&&iu(e),e=e.sibling}function au(e,t,n,r,i,a,o){for(var s=!1;t!==null;){if(t.tag===5){var c=t.stateNode;if(a!==null&&ql<a.length){var l=a[ql],u=Op(c);(l.view||u.view)&&(s=!0);var d;if(d=!(e.flags&4)){if(u.clip)d=!0;else{d=l.rect;var f=u.rect;d=d.y!==f.y||d.x!==f.x||d.height!==f.height||d.width!==f.width}}d&&(e.flags|=4),u.abs?u=!l.abs:(l=l.rect,u=u.rect,u=l.height!==u.height||l.width!==u.width),u&&(e.flags|=32)}else e.flags|=32;e.flags&4&&Tp(c,ql===0?n:n+`_`+ql,i),s&&e.flags&4||(Gl===null&&(Gl=[]),Gl.push(c,ql===0?r:r+`_`+ql,t.memoizedProps)),ql++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&o?e.flags|=t.flags&32:au(e,t.child,n,r,i,a,o)&&(s=!0));t=t.sibling}return s}function ou(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,r=e.stateNode,i=Ci(n,r),a=Ti(n.default,n.update);if(t){r=r.clones;var o=r===null?null:r.map(kp)}else o=e.memoizedState,e.memoizedState=null;r=e;var s=e.child;ql=0,i=au(r,s,i,i,a,o,!1),e.flags&4&&i&&(t||Nd(e,n.onUpdate))}else e.subtreeFlags&33554432&&ou(e,t);e=e.sibling}}var su=!1,H=!1,cu=!1,lu=!1,uu=typeof WeakSet==`function`?WeakSet:Set,du=null,fu=!1,pu=!1,mu=!1,hu=!1;function gu(e,t,n){if(e=e.containerInfo,sp=gh,e=$r(e),ei(e)){if(`selectionStart`in e)var r={start:e.selectionStart,end:e.selectionEnd};else a:{r=(r=e.ownerDocument)&&r.defaultView||window;var i=r.getSelection&&r.getSelection();if(i&&i.rangeCount!==0){r=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==r||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===r&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}r=c===-1||l===-1?null:{start:c,end:l}}else r=null}r||={start:0,end:0}}else r=null;for(cp={focusedElem:e,selectionRange:r},gh=!1,n=(n&335544064)===n,du=t,t=n?9270:1024;du!==null;){if(e=du,n&&(r=e.deletions,r!==null))for(a=0;a<r.length;a++)n&&eu(r[a]);if(e.alternate===null&&e.flags&2)n&&Wl(e),_u(n);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&n&&eu(r),_u(n);continue}if(r!==null&&r.memoizedState!==null){n&&Wl(e),_u(n);continue}}r=e.child,(e.subtreeFlags&t)!==0&&r!==null?(r.return=e,du=r):(n&&tu(e),_u(n))}}Ul=null}function _u(e){for(;du!==null;){var t=du,n=e,r=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if(i&1024&&r!==null){n=void 0,i=r.memoizedProps,r=r.memoizedState;var a=t.stateNode;try{var o=Tc(t.type,i);n=a.getSnapshotBeforeUpdate(o,r),a.__reactInternalSnapshotBeforeUpdate=n}catch(e){Z(t,t.return,e)}}break;case 3:if(i&1024){if(r=t.stateNode.containerInfo,n=r.nodeType,n===9)nm(r);else if(n===1)switch(r.nodeName){case`HEAD`:case`HTML`:case`BODY`:nm(r);break;default:r.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&r!==null&&(n=Ci(r.memoizedProps,r.stateNode),i=t.memoizedProps,i=Ti(i.default,i.update),i!==`none`&&Jl(r,n,i,r.memoizedState=[],!0));break;default:if(i&1024)throw Error(s(163))}if(r=t.sibling,r!==null){r.return=t.return,du=r;break}du=t.return}}function vu(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Lu(e,n),r&4&&wl(5,n);break;case 1:if(Lu(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Tc(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&El(n),r&512&&Ol(n,n.return);break;case 3:if(Lu(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{ko(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&Vl(n);case 26:case 5:Lu(e,n),t===null&&r&4&&Fl(n),r&512&&Ol(n,n.return);break;case 12:Lu(e,n);break;case 31:Lu(e,n),r&4&&Eu(e,n);break;case 13:Lu(e,n),r&4&&Du(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=_f.bind(null,n),cm(e,n))));break;case 22:if(r=n.memoizedState!==null||su,!r){var a=t!==null&&t.memoizedState!==null||H;t=su,i=H,su=r,(H=a)&&!i?(r=2,n.subtreeFlags&8772&&(r|=1),zu(e,n,r)):Lu(e,n),su=t,H=i}break;case 30:Lu(e,n),r&512&&Ol(n,n.return);break;case 7:r&512&&Ol(n,n.return);default:Lu(e,n)}}function yu(e,t){for(e=e.child;e!==null;)bu(e,t),e=e.sibling}function bu(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var r=n.style;typeof r.setProperty==`function`?r.setProperty(`display`,`none`,`important`):r.display=`none`}else{var i=e.stateNode,a=e.memoizedProps.style,o=a!=null&&a.hasOwnProperty(`display`)?a.display:null;i.style.display=o==null||typeof o==`boolean`?``:(``+o).trim()}}catch(t){Z(e,e.return,t)}xu(e,t);break;case 6:try{e.stateNode.nodeValue=t?``:e.memoizedProps,N=!0}catch(t){Z(e,e.return,t)}break;case 18:try{var s=e.stateNode;t?wp(s,!0):wp(e.stateNode,!1)}catch(t){Z(e,e.return,t)}break;case 22:case 23:e.memoizedState===null&&yu(e,t);break;default:yu(e,t)}}function xu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){a:{var n=e,r=t;switch(n.tag){case 4:bu(n,r);break a;case 22:n.memoizedState===null&&xu(n,r);break a;default:xu(n,r)}}e=e.sibling}}function Su(e){var t=e.alternate;t!==null&&(e.alternate=null,Su(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Lt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var U=null,Cu=!1;function wu(e,t,n){for(n=n.child;n!==null;)Tu(e,t,n),n=n.sibling}function Tu(e,t,n){if(nt&&typeof nt.onCommitFiberUnmount==`function`)try{nt.onCommitFiberUnmount(tt,n)}catch{}switch(n.tag){case 26:H||kl(n,t),wu(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!H&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:H||kl(n,t),Ml(n);var r=U,i=Cu;Sp(n.type)&&(U=n.stateNode,Cu=!1),wu(e,t,n),gm(n.stateNode,n.type,n.memoizedProps),U=r,Cu=i;break;case 5:H||kl(n,t),Ml(n);case 6:if(n.tag===6&&Ml(n),r=U,i=Cu,U=null,wu(e,t,n),U=r,Cu=i,U!==null){if(Cu)try{(U.nodeType===9?U.body:U.nodeName===`HTML`?U.ownerDocument.body:U).removeChild(n.stateNode),N=!0}catch(e){Z(n,t,e)}else try{U.removeChild(n.stateNode),N=!0}catch(e){Z(n,t,e)}}break;case 18:U!==null&&(Cu?(e=U,Cp(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Hh(e)):Cp(U,n.stateNode));break;case 4:r=U,i=Cu,U=n.stateNode.containerInfo,Cu=!0,wu(e,t,n),U=r,Cu=i;break;case 0:case 11:case 14:case 15:Tl(2,n,t),H||Tl(4,n,t),wu(e,t,n);break;case 1:H||(kl(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Dl(n,t,r)),wu(e,t,n);break;case 21:wu(e,t,n);break;case 22:H=(r=H)||n.memoizedState!==null,wu(e,t,n),H=r;break;case 30:kl(n,t),wu(e,t,n);break;case 7:H||kl(n,t),wu(e,t,n);break;default:wu(e,t,n)}}function Eu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Hh(e)}catch(e){Z(t,t.return,e)}}}function Du(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Hh(e)}catch(e){Z(t,t.return,e)}}function Ou(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new uu),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new uu),t;default:throw Error(s(435,e.tag))}}function ku(e,t){var n=Ou(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=vf.bind(null,e,t);t.then(r,r)}})}function Au(e,t,n){var r=t.deletions;if(r!==null)for(var i=0;i<r.length;i++){var a=r[i],o=e,c=t,l=c;a:for(;l!==null;){switch(l.tag){case 27:if(Sp(l.type)){U=l.stateNode,Cu=!1;break a}break;case 5:U=l.stateNode,Cu=!1;break a;case 3:case 4:U=l.stateNode.containerInfo,Cu=!0;break a}l=l.return}if(U===null)throw Error(s(160));Tu(o,c,a),U=null,Cu=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Mu(t,e,n),t=t.sibling}var ju=null;function Mu(e,t,n){var r=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(i&4&&(r=e.updateQueue,r=r===null?null:r.events,r!==null))for(var a=0;a<r.length;a++){var o=r[a];o.ref.impl=o.nextImpl}Au(t,e,n),Nu(e),i&4&&(Tl(3,e,e.return),wl(3,e),Tl(5,e,e.return));break;case 1:Au(t,e,n),Nu(e),i&512&&(H||r===null||kl(r,r.return)),i&64&&su&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(a=ju,Au(t,e,n),Nu(e),i&512&&(H||r===null||kl(r,r.return)),i&4){if(i=r===null?null:r.memoizedState,n=e.memoizedState,r===null){if(n===null){if(e.stateNode===null){if(su)e.stateNode=fp(e.type,e.memoizedProps,t.containerInfo,e);else{a:{t=e.type,n=e.memoizedProps,i=a.ownerDocument||a;b:switch(t){case`title`:r=i.getElementsByTagName(`title`)[0],(!r||r[Ft]||r[Ot]||r.namespaceURI===`http://www.w3.org/2000/svg`||r.hasAttribute(`itemprop`))&&(r=i.createElement(t),i.head.insertBefore(r,i.querySelector(`head > title`))),np(r,t,n),r[Ot]=e,Ht(r),t=r;break a;case`link`:if(a=Gm(`link`,`href`,i).get(t+(n.href||``))){for(o=0;o<a.length;o++)if(r=a[o],r.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&r.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&r.getAttribute(`title`)===(n.title==null?null:n.title)&&r.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){a.splice(o,1);break b}}r=i.createElement(t),np(r,t,n),i.head.appendChild(r);break;case`meta`:if(a=Gm(`meta`,`content`,i).get(t+(n.content||``))){for(o=0;o<a.length;o++)if(r=a[o],r.getAttribute(`content`)===(n.content==null?null:``+n.content)&&r.getAttribute(`name`)===(n.name==null?null:n.name)&&r.getAttribute(`property`)===(n.property==null?null:n.property)&&r.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&r.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){a.splice(o,1);break b}}r=i.createElement(t),np(r,t,n),i.head.appendChild(r);break;default:throw Error(s(468,t))}r[Ot]=e,Ht(r),t=r}e.stateNode=t}}else su||Km(a,e.type,e.stateNode)}else e.stateNode=Bm(a,n,e.memoizedProps)}else i===n?n===null&&e.stateNode!==null&&Il(e,e.memoizedProps,r.memoizedProps):(i===null?(t=r.stateNode,t===null||H||t.parentNode.removeChild(t)):i.count--,n===null?su||Km(a,e.type,e.stateNode):Bm(a,n,e.memoizedProps))}break;case 27:Au(t,e,n),Nu(e),i&512&&(H||r===null||kl(r,r.return)),r!==null&&i&4&&Il(e,e.memoizedProps,r.memoizedProps);break;case 5:if(a=cu,cu=!1,Au(t,e,n),cu=a,Nu(e),i&512&&(H||r===null||kl(r,r.return)),e.flags&32){t=e.stateNode;try{gn(t,``),N=!0}catch(t){Z(e,e.return,t)}}i&4&&e.stateNode!=null&&(t=e.memoizedProps,Il(e,t,r===null?t:r.memoizedProps)),i&1024&&(lu=!0);break;case 6:if(Au(t,e,n),Nu(e),i&4){if(e.stateNode===null)throw Error(s(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,N=!0}catch(t){Z(e,e.return,t)}}break;case 3:if(N=!1,Wm=null,a=ju,ju=bm(t.containerInfo),Au(t,e,n),ju=a,Nu(e),i&4&&r!==null&&r.memoizedState.isDehydrated)try{Hh(t.containerInfo)}catch(t){Z(e,e.return,t)}lu&&(lu=!1,Pu(e)),N=!1;break;case 4:i=cu,cu=su,r=Qt(),a=ju,ju=bm(e.stateNode.containerInfo),Au(t,e,n),Nu(e),ju=a,N&&pu&&(mu=!0),N=r,cu=i;break;case 12:Au(t,e,n),Nu(e);break;case 31:Au(t,e,n),Nu(e),i&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,ku(e,t)));break;case 13:Au(t,e,n),Nu(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(hd=Ke()),i&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,ku(e,t)));break;case 22:a=e.memoizedState!==null,o=r!==null&&r.memoizedState!==null;var c=su,l=H,u=cu;su=c||a,cu=u||a,H=l||o,Au(t,e,n),H=l,cu=u,su=c,Nu(e),i&8192&&(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,!a||r===null||o||su||H||(t=o||H,n=su,r=H,su=a||su,H=t,Ru(e,2),su=n,H=r),!a&&cu||yu(e,a)),i&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,ku(e,n))));break;case 19:Au(t,e,n),Nu(e),i&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,ku(e,t)));break;case 30:i&512&&(H||r===null||kl(r,r.return)),i=Qt(),a=pu,o=(n&335544064)===n,c=e.memoizedProps,pu=o&&Ti(c.default,c.update)!==`none`,Au(t,e,n),Nu(e),o&&r!==null&&N&&(e.flags|=4),pu=a,N=i;break;case 21:break;case 7:i&512&&(H||r===null||kl(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:Au(t,e,n),Nu(e)}}function Nu(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Ll(r)){n=r;break}r=r.return}r=null;for(var i=e.return;i!==null;){if(Pl(i)){var a=i.stateNode;r===null?r=[a]:r.push(a)}if(Nl(i))break;i=i.return}var o=r;if(n==null)throw Error(s(160));switch(n.tag){case 27:var c=n.stateNode;Bl(e,Rl(e),c,o);break;case 5:var l=n.stateNode;n.flags&32&&(gn(l,``),n.flags&=-33),Bl(e,Rl(e),l,o);break;case 3:case 4:var u=n.stateNode.containerInfo;zl(e,Rl(e),u,o);break;default:throw Error(s(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Pu(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Pu(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,gh=!0,t.reset(),gh=!1),e=e.sibling}}function Fu(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Iu(t,e),t=t.sibling;else ou(t,!1)}function Iu(e,t){var n=e.alternate;if(n===null)Ql(e,!1);else switch(e.tag){case 3:if(hu=fu=!1,Kl(),Fu(t,e),!fu&&!mu){if(e=Gl,e!==null)for(var r=0;r<e.length;r+=3){n=e[r];var i=e[r+1];Ep(n,e[r+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(`+i+`)`})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===``&&(e.style.viewTransitionName=`none`,e.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(root)`}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition`})),hu=!0}Gl=null;break;case 5:Fu(t,e);break;case 4:r=fu,fu=!1,Fu(t,e),fu&&(mu=!0),fu=r;break;case 22:e.memoizedState===null&&(n.memoizedState===null?Fu(t,e):Ql(e,!1));break;case 30:r=fu,i=Kl(),fu=!1,Fu(t,e),fu&&(e.flags|=4);var a=e.memoizedProps,o=e.stateNode;t=Ci(a,o),o=Ci(n.memoizedProps,o);var s=Ti(a.default,a.update);s===`none`?t=!1:(a=n.memoizedState,n.memoizedState=null,n=e.child,ql=0,t=au(e,n,t,o,s,a,!0),ql!==(a===null?0:a.length)&&(e.flags|=32)),e.flags&4&&t?(Nd(e,e.memoizedProps.onUpdate),Gl=i):i!==null&&(i.push.apply(i,Gl),Gl=i),fu=e.flags&32?!0:r;break;default:Fu(t,e)}}function Lu(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)vu(e,t.alternate,t),t=t.sibling}function Ru(e,t){for(e=e.child;e!==null;){var n=e,r=t;switch(n.tag){case 0:case 11:case 14:case 15:Tl(4,n,n.return),Ru(n,r);break;case 1:kl(n,n.return);var i=n.stateNode;typeof i.componentWillUnmount==`function`&&Dl(n,n.return,i),Ru(n,r);break;case 27:r&2&&gm(n.stateNode,n.type,n.memoizedProps);case 5:kl(n,n.return),n.tag!==5&&n.tag!==27||Ml(n),Ru(n,r);break;case 6:Ml(n);break;case 26:kl(n,n.return),i=n.stateNode,n.memoizedState!==null||i===null||H||i.parentNode.removeChild(i),Ru(n,r);break;case 22:n.memoizedState===null&&Ru(n,r);break;case 30:kl(n,n.return),Ru(n,r);break;case 7:kl(n,n.return);default:Ru(n,r)}e=e.sibling}}function zu(e,t,n){for(n=t.subtreeFlags&8772?n:n&-2,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags,s=!!(n&1);switch(a.tag){case 0:case 11:case 15:zu(i,a,n),wl(4,a);break;case 1:if(zu(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var c=r.stateNode;try{var l=i.shared.hiddenCallbacks;if(l!==null)for(i.shared.hiddenCallbacks=null,i=0;i<l.length;i++)Oo(l[i],c)}catch(e){Z(r,r.return,e)}}s&&o&64&&El(a),Ol(a,a.return);break;case 27:n&2&&Vl(a);case 5:a.tag!==5&&a.tag!==27||jl(a),zu(i,a,n),s&&r===null&&o&4&&Fl(a),Ol(a,a.return);break;case 6:jl(a);break;case 26:c=a.stateNode,a.memoizedState!==null||c===null||su||Km(bm(c.ownerDocument),a.type,c),zu(i,a,n),s&&r===null&&o&4&&Fl(a),Ol(a,a.return);break;case 12:zu(i,a,n);break;case 31:zu(i,a,n),s&&o&4&&Eu(i,a);break;case 13:zu(i,a,n),s&&o&4&&Du(i,a);break;case 22:a.memoizedState===null&&zu(i,a,n),Ol(a,a.return);break;case 30:zu(i,a,n),Ol(a,a.return);break;case 7:Ol(a,a.return);default:zu(i,a,n)}t=t.sibling}}function Bu(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&La(n))}function Vu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&La(e))}function Hu(e,t,n,r){var i=(n&335544064)===n;if(t.subtreeFlags&(i?10262:10256))for(t=t.child;t!==null;)Uu(e,t,n,r),t=t.sibling;else i&&iu(t)}function Uu(e,t,n,r){var i=(n&335544064)===n;i&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&ru(t);var a=t.flags;switch(t.tag){case 0:case 11:case 15:Hu(e,t,n,r),a&2048&&wl(9,t);break;case 1:Hu(e,t,n,r);break;case 3:Hu(e,t,n,r),i&&hu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,e.style.viewTransitionName===`root`&&(e.style.viewTransitionName=``),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===`none`&&(e.style.viewTransitionName=``)),a&2048&&(a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&La(a)));break;case 12:if(a&2048){Hu(e,t,n,r),a=t.stateNode;try{var o=t.memoizedProps,s=o.id,c=o.onPostCommit;typeof c==`function`&&c(s,t.alternate===null?`mount`:`update`,a.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Hu(e,t,n,r);break;case 31:Hu(e,t,n,r);break;case 13:Hu(e,t,n,r);break;case 23:break;case 22:o=t.stateNode,s=t.alternate,t.memoizedState===null?(i&&s!==null&&s.memoizedState!==null&&ru(t),o._visibility&2?Hu(e,t,n,r):(o._visibility|=2,Wu(e,t,n,r,!!(t.subtreeFlags&10256)||!1))):(i&&s!==null&&s.memoizedState===null&&ru(s),o._visibility&2?Hu(e,t,n,r):Gu(e,t)),a&2048&&Bu(s,t);break;case 24:Hu(e,t,n,r),a&2048&&Vu(t.alternate,t);break;case 30:i&&(a=t.alternate,a!==null&&(Xl(a.child,!0),Xl(t.child,!0))),Hu(e,t,n,r);break;default:Hu(e,t,n,r)}}function Wu(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Wu(a,o,s,c,i),wl(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Wu(a,o,s,c,i)):u._visibility&2?Wu(a,o,s,c,i):Gu(a,o),i&&l&2048&&Bu(o.alternate,o);break;case 24:Wu(a,o,s,c,i),i&&l&2048&&Vu(o.alternate,o);break;default:Wu(a,o,s,c,i)}t=t.sibling}}function Gu(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Gu(n,r),i&2048&&Bu(r.alternate,r);break;case 24:Gu(n,r),i&2048&&Vu(r.alternate,r);break;default:Gu(n,r)}t=t.sibling}}var Ku=8192;function qu(e,t,n){if(e.subtreeFlags&Ku)for(e=e.child;e!==null;)Ju(e,t,n),e=e.sibling}function Ju(e,t,n){switch(e.tag){case 26:qu(e,t,n),e.flags&Ku&&(e.memoizedState===null?(e=e.stateNode,(t&335544128)===t&&Zm(n,e)):Qm(n,ju,e.memoizedState,e.memoizedProps));break;case 5:qu(e,t,n),e.flags&Ku&&(e=e.stateNode,(t&335544128)===t&&Zm(n,e));break;case 3:case 4:var r=ju;ju=bm(e.stateNode.containerInfo),qu(e,t,n),ju=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Ku,Ku=16777216,qu(e,t,n),Ku=r):qu(e,t,n));break;case 30:if((e.flags&Ku)!==0&&(r=e.memoizedProps.name,r!=null&&r!==`auto`)){var i=e.stateNode;i.paired=null,Ul===null&&(Ul=new Map),Ul.set(r,i)}qu(e,t,n);break;default:qu(e,t,n)}}function Yu(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Xu(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];du=r,$u(r,e)}Yu(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Zu(e),e=e.sibling}function Zu(e){switch(e.tag){case 0:case 11:case 15:Xu(e),e.flags&2048&&Tl(9,e,e.return);break;case 3:Xu(e);break;case 12:Xu(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Qu(e)):Xu(e);break;default:Xu(e)}}function Qu(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];du=r,$u(r,e)}Yu(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Tl(8,t,t.return),Qu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Qu(t));break;default:Qu(t)}e=e.sibling}}function $u(e,t){for(;du!==null;){var n=du;switch(n.tag){case 0:case 11:case 15:Tl(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:La(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,du=r;else a:for(n=e;du!==null;){r=du;var i=r.sibling,a=r.return;if(Su(r),r===n){du=null;break a}if(i!==null){i.return=a,du=i;break a}du=a}}}var ed={getCacheForType:function(e){var t=Aa(I),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Aa(I).controller.signal}},td=typeof WeakMap==`function`?WeakMap:Map,W=0,G=null,K=null,q=0,J=0,nd=null,rd=!1,id=!1,ad=!1,od=0,Y=0,sd=0,cd=0,ld=0,ud=0,dd=0,fd=null,pd=null,md=!1,hd=0,gd=0,_d=1/0,vd=null,yd=null,X=0,bd=null,xd=null,Sd=0,Cd=0,wd=null,Td=null,Ed=null,Dd=null,Od=null,kd=0,Ad=null;function jd(){return W&2&&q!==0?q&-q:O.T===null?Tt():Pf()}function Md(){if(ud===0){if(!(q&536870912)||F){var e=lt;lt<<=1,!(lt&3932160)&&(lt=262144),ud=e}else ud=536870912}return e=Fo.current,e!==null&&(e.flags|=32),ud}function Nd(e,t){if(t!=null){var n=e.stateNode,r=n.ref;r===null&&(r=n.ref=Pp(Ci(e.memoizedProps,n))),Dd===null&&(Dd=[]),Dd.push(t.bind(null,r))}}function Pd(e,t,n){(e===G&&(J===2||J===9)||e.cancelPendingCommit!==null)&&(Vd(e,0),Rd(e,q,ud,!1)),vt(e,n),W&2&&e===G||(e===G&&(!(W&2)&&(cd|=n),Y===4&&Rd(e,q,ud,!1)),Ef(e))}function Fd(e,t,n){if(W&6)throw Error(s(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||pt(e,t),i=r?Yd(e,t):qd(e,t,!0),a=r;do{if(i===0){id&&!r&&Rd(e,t,0,!1);break}if(n=e.current.alternate,a&&!Ld(n))i=qd(e,t,!1),a=!1;else{if(i===2){if(a=t,e.errorRecoveryDisabledLanes&a)var o=0;else o=e.pendingLanes&-536870913,o=o===0?o&536870912?536870912:0:o;if(o!==0){t=o;a:{var c=e;i=fd;var l=c.current.memoizedState.isDehydrated;if(l&&(Vd(c,o).flags|=256),o=qd(c,o,!1),o!==2&&o!==6){if(ad&&!l){c.errorRecoveryDisabledLanes|=a,cd|=a,i=4;break a}a=pd,pd=i,a!==null&&(pd===null?pd=a:pd.push.apply(pd,a))}i=o}if(a=!1,i!==2)continue}}if(i===1){Vd(e,0),Rd(e,t,0,!0);break}a:{switch(r=e,a=i,a){case 0:case 1:throw Error(s(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:Rd(r,t,ud,!rd);break a;case 2:pd=null;break;case 3:case 5:break;default:throw Error(s(329))}if((t&62914560)===t&&(i=hd+300-Ke(),10<i)){if(Rd(r,t,ud,!rd),ft(r,0,!0)!==0)break a;Sd=t,r.timeoutHandle=gp(Id.bind(null,r,n,pd,vd,md,t,ud,cd,dd,rd,a,`Throttled`,-0,0),i);break a}Id(r,n,pd,vd,md,t,ud,cd,dd,rd,a,null,-0,0)}break}}while(1);Ef(e)}function Id(e,t,n,r,i,a,o,s,c,l,u,d,f,p){e.timeoutHandle=-1;var m=t.subtreeFlags,h=(a&335544064)===a;d=null,(h||m&8192||(m&16785408)==16785408)&&(d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:wn},Ul=null,Ju(t,a,d),h&&(m=d,h=e.containerInfo,h=(h.nodeType===9?h:h.ownerDocument).__reactViewTransition,h!=null&&(m.count++,m.waitingForViewTransition=!0,m=nh.bind(m),h.finished.then(m,m))),m=(a&62914560)===a?hd-Ke():(a&4194048)===a?gd-Ke():0,m=eh(d,m),m!==null)?(Sd=a,e.cancelPendingCommit=m(nf.bind(null,e,t,a,n,r,i,o,s,c,l,u,d,null,f,p)),Rd(e,a,o,!l)):nf(e,t,a,n,r,i,o,s,c,l,u,d)}function Ld(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!qr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Rd(e,t,n,r){t=mt(e,t),t&=~ld,t&=~cd,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-it(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&bt(e,n,t)}function zd(){return W&6?!0:(Df(0,!1),!1)}function Bd(){if(K!==null){if(J===0)var e=K.return;else e=K,Sa=xa=null,cs(e),lo=null,uo=0,e=K;for(;e!==null;)Cl(e.alternate,e),e=e.return;K=null}}function Vd(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,_p(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Sd=0,Bd(),G=e,K=n=Bi(e.current,null),q=t,J=0,nd=null,rd=!1,id=pt(e,t),ad=!1,dd=ud=ld=cd=sd=Y=0,pd=fd=null,md=!1,od=mt(e,t),Ai(),n}function Hd(e,t){L=null,O.H=_c,t===$a||t===to?(t=so(),J=3):t===eo?(t=so(),J=4):J=t===Fc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,nd=t,K===null&&(Y=1,kc(e,Ji(t,e.current)))}function Ud(){var e=Fo.current;return e===null?!0:(q&4194048)===q?Io===null:(q&62914560)===q||q&536870912?e===Io:!1}function Wd(){var e=O.H;return O.H=_c,e===null?_c:e}function Gd(){var e=O.A;return O.A=ed,e}function Kd(){Y=4,rd||(q&4194048)!==q&&Fo.current!==null||(id=!0),!(sd&134217727)&&!(cd&134217727)||G===null||Rd(G,q,ud,!1)}function qd(e,t,n){var r=W;W|=2;var i=Wd(),a=Gd();(G!==e||q!==t)&&(vd=null,Vd(e,t)),t=!1;var o=Y;a:do try{if(J!==0&&K!==null){var s=K,c=nd;switch(J){case 8:Bd(),o=6;break a;case 3:case 2:case 9:case 6:Fo.current===null&&(t=!0);var l=J;if(J=0,nd=null,$d(e,s,c,l),n&&id){o=0;break a}break;default:l=J,J=0,nd=null,$d(e,s,c,l)}}Jd(),o=Y;break}catch(t){Hd(e,t)}while(1);return t&&e.shellSuspendCounter++,Sa=xa=null,W=r,O.H=i,O.A=a,K===null&&(G=null,q=0,Ai()),o}function Jd(){for(;K!==null;)Zd(K)}function Yd(e,t){var n=W;W|=2;var r=Wd(),i=Gd();G!==e||q!==t?(vd=null,_d=Ke()+500,Vd(e,t)):id=pt(e,t);a:do try{if(J!==0&&K!==null){t=K;var a=nd;b:switch(J){case 1:J=0,nd=null,$d(e,t,a,1);break;case 2:case 9:if(ro(a)){J=0,nd=null,Qd(t);break}t=function(){J!==2&&J!==9||G!==e||(J=7),Ef(e)},a.then(t,t);break a;case 3:J=7;break a;case 4:J=5;break a;case 7:ro(a)?(J=0,nd=null,Qd(t)):(J=0,nd=null,$d(e,t,a,7));break;case 5:var o=null;switch(K.tag){case 26:o=K.memoizedState;case 5:case 27:var c=K;if(o?Ym(o):c.stateNode.complete){J=0,nd=null;var l=c.sibling;if(l!==null)K=l;else{var u=c.return;u===null?K=null:(K=u,ef(u))}break b}}J=0,nd=null,$d(e,t,a,5);break;case 6:J=0,nd=null,$d(e,t,a,6);break;case 8:Bd(),Y=6;break a;default:throw Error(s(462))}}Xd();break}catch(t){Hd(e,t)}while(1);return Sa=xa=null,O.H=r,O.A=i,W=n,K===null?(G=null,q=0,Ai(),Y):0}function Xd(){for(;K!==null&&!We();)Zd(K)}function Zd(e){var t=hl(e.alternate,e,od);e.memoizedProps=e.pendingProps,t===null?ef(e):K=t}function Qd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Yc(n,t,t.pendingProps,t.type,void 0,q);break;case 11:t=Yc(n,t,t.pendingProps,t.type.render,t.ref,q);break;case 5:cs(t);var r=t;r===la&&(F?(ha(r),r.tag===5&&r.stateNode!=null&&(P=r.stateNode)):(ha(r),F=!0));default:Cl(n,t),t=K=Vi(t,od),t=hl(n,t,od)}e.memoizedProps=e.pendingProps,t===null?ef(e):K=t}function $d(e,t,n,r){Sa=xa=null,cs(t),lo=null,uo=0;var i=t.return;try{if(Pc(e,i,t,n,q)){Y=1,kc(e,Ji(n,e.current)),K=null;return}}catch(t){if(i!==null)throw K=i,t;Y=1,kc(e,Ji(n,e.current)),K=null;return}t.flags&32768?(F||r===1?e=!0:id||q&536870912?e=!1:(rd=e=!0,(r===2||r===9||r===3||r===6)&&(r=Fo.current,r!==null&&r.tag===13&&(r.flags|=16384))),tf(t,e)):ef(t)}function ef(e){var t=e;do{if(t.flags&32768){tf(t,rd);return}e=t.return;var n=xl(t.alternate,t,od);if(n!==null){K=n;return}if(t=t.sibling,t!==null){K=t;return}K=t=e}while(t!==null);Y===0&&(Y=5)}function tf(e,t){do{var n=Sl(e.alternate,e);if(n!==null){n.flags&=32767,K=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){K=e;return}K=e=n}while(e!==null);Y=6,K=null}function nf(e,t,n,r,i,a,o,c,l,u,d,f){e.cancelPendingCommit=null;do df();while(X!==0);if(W&6)throw Error(s(327));if(t!==null){if(t===e.current)throw Error(s(177));e===G&&(K=G=null,q=0),xd=t,bd=e,Sd=n,wd=i,Td=r,rf(e,t,n,o,c,l,f)}}function rf(e,t,n,r,i,a,o){var s=t.lanes|t.childLanes;if(Cd=s,s|=ki,yt(e,n,s,r,i,a),Dd=null,(n&335544064)===n?(Od=Ba(e),r=10262):(Od=null,r=10256),(t.subtreeFlags&r)!==0||(t.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,yf(Xe,function(){return ff(),null})):(e.callbackNode=null,e.callbackPriority=0),Hl=!1,r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=O.T,O.T=null,i=k.p,k.p=2,a=W,W|=4;try{gu(e,t,n)}finally{W=a,k.p=i,O.T=r}}X=1,Hl?Ed=Mp(o,e.containerInfo,Od,sf,cf,of,lf,ff,af,null,null):(sf(),cf(),lf())}function af(e){if(X!==0){var t=bd.onRecoverableError;t(e,{componentStack:null})}}function of(){X===3&&(X=0,Iu(xd,bd),X=4)}function sf(){if(X===1){X=0;var e=bd,t=xd,n=Sd,r=!!(t.flags&13878);if(t.subtreeFlags&13878||r){r=O.T,O.T=null;var i=k.p;k.p=2;var a=W;W|=4;try{pu=mu=!1,Mu(t,e,n),n=cp;var o=$r(e.containerInfo),s=n.focusedElem,c=n.selectionRange;if(o!==s&&s&&s.ownerDocument&&Qr(s.ownerDocument.documentElement,s)){if(c!==null&&ei(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Zr(s,h),v=Zr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}gh=!!sp,cp=sp=null}finally{W=a,k.p=i,O.T=r}}e.current=t,X=2}}function cf(){if(X===2){X=0;var e=bd,t=xd,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=O.T,O.T=null;var r=k.p;k.p=2;var i=W;W|=4;try{vu(e,t.alternate,t)}finally{W=i,k.p=r,O.T=n}}X=3}}function lf(){if(X===4||X===3){X=0;var e=Ed;Ed=null,Ge();var t=bd,n=xd,r=Sd,i=Td,a=(r&335544064)===r?10262:10256;if((n.subtreeFlags&a)!==0||(n.flags&a)!==0?X=5:(X=0,xd=bd=null,uf(t,t.pendingLanes)),a=t.pendingLanes,a===0&&(yd=null),wt(r),n=n.stateNode,nt&&typeof nt.onCommitFiberRoot==`function`)try{nt.onCommitFiberRoot(tt,n,void 0,(n.current.flags&128)==128)}catch{}if(i!==null){n=O.T,a=k.p,k.p=2,O.T=null;try{for(var o=t.onRecoverableError,s=0;s<i.length;s++){var c=i[s];o(c.value,{componentStack:c.stack})}}finally{O.T=n,k.p=a}}if(i=Dd,o=Od,Od=null,i!==null&&(Dd=null,o===null&&(o=[]),e!==null))for(c=0;c<i.length;c++)n=(0,i[c])(o),n!==void 0&&e.finished.finally(n);Sd&3&&df(),Ef(t),a=t.pendingLanes,r&261930&&a&42?t===Ad?kd++:(kd=0,Ad=t):(kd=0,Ad=null),Df(0,!1)}}function uf(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,La(t)))}function df(){return Ed!==null&&(Ed.skipTransition(),Ed=null),sf(),cf(),lf(),ff()}function ff(){if(X!==5)return!1;var e=bd,t=Cd;Cd=0;var n=wt(Sd),r=O.T,i=k.p;try{k.p=32>n?32:n,O.T=null,n=wd,wd=null;var a=bd,o=Sd;if(X=0,xd=bd=null,Sd=0,W&6)throw Error(s(331));var c=W;if(W|=4,Zu(a.current),Uu(a,a.current,o,n),W=c,Df(0,!1),nt&&typeof nt.onPostCommitFiberRoot==`function`)try{nt.onPostCommitFiberRoot(tt,a)}catch{}return!0}finally{k.p=i,O.T=r,uf(e,t)}}function pf(e,t,n){t=Ji(n,t),t=jc(e.stateNode,t,2),e=So(e,t,2),e!==null&&(vt(e,2),Ef(e))}function Z(e,t,n){if(e.tag===3)pf(e,e,n);else for(;t!==null;){if(t.tag===3){pf(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(yd===null||!yd.has(r))){e=Ji(n,e),n=Mc(2),r=So(t,n,2),r!==null&&(Nc(n,r,t,e),vt(r,2),Ef(r));break}}t=t.return}}function mf(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new td;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(ad=!0,i.add(n),e=hf.bind(null,e,t,n),t.then(e,e))}function hf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,G===e&&(q&n)===n&&(Y===4||Y===3&&(q&62914560)===q&&300>Ke()-hd?W&2?ld|=n:Vd(e,0):ld|=n,dd===q&&(dd=0)),Ef(e)}function gf(e,t){t===0&&(t=gt()),e=Ni(e,t),e!==null&&(vt(e,t),Ef(e))}function _f(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),gf(e,n)}function vf(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(s(314))}r!==null&&r.delete(t),gf(e,n)}function yf(e,t){return He(e,t)}var bf=null,xf=null,Sf=!1,Cf=!1,wf=!1,Tf=0;function Ef(e){e!==xf&&e.next===null&&(xf===null?bf=xf=e:xf=xf.next=e),Cf=!0,Sf||(Sf=!0,Nf())}function Df(e,t){if(!wf&&Cf){wf=!0;do for(var n=!1,r=bf;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-it(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,Mf(r,a))}else a=q,a=ft(r,r===G?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||pt(r,a)||(n=!0,Mf(r,a))}r=r.next}while(n);wf=!1}}function Of(){kf()}function kf(){Cf=Sf=!1;var e=0;Tf!==0&&hp()&&(e=Tf);for(var t=Ke(),n=null,r=bf;r!==null;){var i=r.next,a=Af(r,t);a===0?(r.next=null,n===null?bf=i:n.next=i,i===null&&(xf=n)):(n=r,(e!==0||a&3)&&(Cf=!0)),r=i}X!==0&&X!==5||Df(e,!1),Tf!==0&&(Tf=0)}function Af(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-it(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=ht(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=G,n=q,n=ft(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(J===2||J===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Ue(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||pt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Ue(r),wt(n)){case 2:case 8:n=Ye;break;case 32:n=Xe;break;case 268435456:n=Qe;break;default:n=Xe}return r=jf.bind(null,e),n=He(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Ue(r),e.callbackPriority=2,e.callbackNode=null,2}function jf(e,t){if(X!==0&&X!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(df()&&e.callbackNode!==n)return null;var r=q;return r=ft(e,e===G?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Fd(e,r,t),Af(e,Ke()),e.callbackNode!=null&&e.callbackNode===n?jf.bind(null,e):null)}function Mf(e,t){if(df())return null;Fd(e,t,!0)}function Nf(){bp(function(){W&6?He(Je,Of):kf()})}function Pf(){if(Tf===0){var e=Ua;e===0&&(e=ct,ct<<=1,!(ct&261888)&&(ct=256)),Tf=e}return Tf}function Ff(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:Cn(e)}function If(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=Ff((i[kt]||null).action),o=r.submitter;o&&(t=(t=o[kt]||null)?Ff(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Gn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Tf!==0){var e=new FormData(i,o);rc(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=new FormData(i,o),rc(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var Lf=0;Lf<bi.length;Lf++){var Rf=bi[Lf];xi(Rf.toLowerCase(),`on`+(Rf[0].toUpperCase()+Rf.slice(1)))}xi(fi,`onAnimationEnd`),xi(pi,`onAnimationIteration`),xi(mi,`onAnimationStart`),xi(`dblclick`,`onDoubleClick`),xi(`focusin`,`onFocus`),xi(`focusout`,`onBlur`),xi(hi,`onTransitionRun`),xi(gi,`onTransitionStart`),xi(_i,`onTransitionCancel`),xi(vi,`onTransitionEnd`),qt(`onMouseEnter`,[`mouseout`,`mouseover`]),qt(`onMouseLeave`,[`mouseout`,`mouseover`]),qt(`onPointerEnter`,[`pointerout`,`pointerover`]),qt(`onPointerLeave`,[`pointerout`,`pointerover`]),Kt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),Kt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),Kt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),Kt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),Kt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),Kt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var zf=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),Bf=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(zf));function Vf(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Ei(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Ei(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[jt];n===void 0&&(n=t[jt]=new Set);var r=e+`__bubble`;n.has(r)||(Gf(t,e,2,!1),n.add(r))}function Hf(e,t,n){var r=0;t&&(r|=4),Gf(n,e,r,t)}var Uf=`_reactListening`+Math.random().toString(36).slice(2);function Wf(e){if(!e[Uf]){e[Uf]=!0,Wt.forEach(function(t){t!==`selectionchange`&&(Bf.has(t)||Hf(t,!1,e),Hf(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Uf]||(t[Uf]=!0,Hf(`selectionchange`,!1,t))}}function Gf(e,t,n,r){switch(Ch(t)){case 2:var i=_h;break;case 8:i=vh;break;default:i=yh}n=i.bind(null,t,n,e),i=void 0,!Pn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Kf(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===i)break;if(o===4)for(o=r.return;o!==null;){var c=o.tag;if((c===3||c===4)&&o.stateNode.containerInfo===i)return;o=o.return}for(;s!==null;){if(o=Rt(s),o===null)return;if(c=o.tag,c===5||c===6||c===26||c===27){r=a=o;continue a}s=s.parentNode}}r=r.return}jn(function(){var r=a,i=En(n),o=[];a:{var s=yi.get(e);if(s!==void 0){var c=Gn,u=e;switch(e){case`keypress`:if(Bn(n)===0)break a;case`keydown`:case`keyup`:c=lr;break;case`focusin`:u=`focus`,c=er;break;case`focusout`:u=`blur`,c=er;break;case`beforeblur`:case`afterblur`:c=er;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:c=Qn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:c=$n;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:c=fr;break;case fi:case pi:case mi:c=tr;break;case vi:c=pr;break;case`scroll`:case`scrollend`:c=qn;break;case`wheel`:c=mr;break;case`copy`:case`cut`:case`paste`:c=nr;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:c=ur;break;case`submit`:c=dr;break;case`toggle`:case`beforetoggle`:c=hr}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?s===null?null:s+`Capture`:s;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=Mn(m,p),g!=null&&d.push(qf(m,g,h))),f)break;m=m.return}0<d.length&&(s=new c(s,u,null,n,i),o.push({event:s,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,s=e===`mouseout`||e===`pointerout`,c&&n!==Tn&&(u=n.relatedTarget||n.fromElement)&&(Rt(u)||u[At]))break a;(s||c)&&(u=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,s?(c=n.relatedTarget||n.toElement,s=r,c=c?Rt(c):null,c!==null&&(f=l(c),d=c.tag,c!==f||d!==5&&d!==27&&d!==6)&&(c=null)):(s=null,c=r),s!==c&&(d=Qn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=ur,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=s==null?u:Bt(s),h=c==null?u:Bt(c),u=new d(g,m+`leave`,s,n,i),u.target=f,u.relatedTarget=h,g=null,Rt(i)===r&&(d=new d(p,m+`enter`,c,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,d=s&&c?ne(s,c,Yf):null,s!==null&&Xf(o,u,s,d,!1),c!==null&&f!==null&&Xf(o,f,c,d,!0)))}a:{if(s=r?Bt(r):window,c=s.nodeName&&s.nodeName.toLowerCase(),c===`select`||c===`input`&&s.type===`file`)var _=Fr;else if(kr(s)){if(Ir)_=Gr;else{_=Ur;var v=Hr}}else c=s.nodeName,!c||c.toLowerCase()!==`input`||s.type!==`checkbox`&&s.type!==`radio`?r&&bn(r.elementType)&&(_=Fr):_=Wr;if(_&&=_(e,r)){Ar(o,_,n,i);break a}v&&v(e,s,r)}switch(v=r?Bt(r):window,e){case`focusin`:(kr(v)||v.contentEditable===`true`)&&(ni=v,ri=r,ii=null);break;case`focusout`:ii=ri=ni=null;break;case`mousedown`:ai=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:ai=!1,oi(o,n,i);break;case`selectionchange`:if(ti)break;case`keydown`:case`keyup`:oi(o,n,i)}var y;if(_r)b:{switch(e){case`compositionstart`:var b=`onCompositionStart`;break b;case`compositionend`:b=`onCompositionEnd`;break b;case`compositionupdate`:b=`onCompositionUpdate`;break b}b=void 0}else Tr?Cr(e,n)&&(b=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(b=`onCompositionStart`);b&&(br&&n.locale!==`ko`&&(Tr||b!==`onCompositionStart`?b===`onCompositionEnd`&&Tr&&(y=zn()):(In=i,Ln=`value`in In?In.value:In.textContent,Tr=!0)),v=Jf(r,b),0<v.length&&(b=new rr(b,e,null,n,i),o.push({event:b,listeners:v}),y?b.data=y:(y=wr(n),y!==null&&(b.data=y)))),(y=yr?Er(e,n):Dr(e,n))&&(b=Jf(r,`onBeforeInput`),0<b.length&&(v=new rr(`onBeforeInput`,`beforeinput`,null,n,i),o.push({event:v,listeners:b}),v.data=y)),If(o,e,r,n,i)}Vf(o,t)})}function qf(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Jf(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=Mn(e,n),i!=null&&r.unshift(qf(e,i,a)),i=Mn(e,t),i!=null&&r.push(qf(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Yf(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Xf(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=Mn(n,a),l!=null&&o.unshift(qf(n,l,c))):i||(l=Mn(n,a),l!=null&&o.push(qf(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Zf=/\r\n?/g,Qf=/\u0000|\uFFFD/g;function $f(e){return(typeof e==`string`?e:``+e).replace(Zf,`
`).replace(Qf,``)}function ep(e,t){return t=$f(t),$f(e)===t}function $(e,t,n,r,i,a){switch(n){case`children`:if(typeof r==`string`)t===`body`||t===`textarea`&&r===``||gn(e,r);else if(typeof r==`number`||typeof r==`bigint`)t!==`body`&&gn(e,``+r);else return;break;case`className`:en(e,`class`,r);break;case`tabIndex`:en(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:en(e,n,r);break;case`style`:yn(e,r,a);return;case`data`:if(t!==`object`){en(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)||r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=Cn(r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof a==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,i.name,i,null),$(e,t,`formEncType`,i.formEncType,i,null),$(e,t,`formMethod`,i.formMethod,i,null),$(e,t,`formTarget`,i.formTarget,i,null)):($(e,t,`encType`,i.encType,i,null),$(e,t,`method`,i.method,i,null),$(e,t,`target`,i.target,i,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=Cn(r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=wn);return;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(s(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(s(60));a?.__html!==n&&(e.innerHTML=n)}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=Cn(r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`credentialless`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),$t(e,`popover`,r);break;case`xlinkActuate`:tn(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:tn(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:tn(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:tn(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:tn(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:tn(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:tn(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:tn(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:tn(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:$t(e,`is`,r);break;case`innerText`:case`textContent`:return;default:if(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)n=xn.get(n)||n,$t(e,n,r);else return}N=!0}function tp(e,t,n,r,i,a){switch(n){case`style`:yn(e,r,a);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(s(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(s(60));a?.__html!==n&&(e.innerHTML=n)}}break;case`children`:if(typeof r==`string`)gn(e,r);else if(typeof r==`number`||typeof r==`bigint`)gn(e,``+r);else return;break;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`onClick`:r!=null&&(e.onclick=wn);return;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:return;case`innerText`:case`textContent`:return;default:if(!Gt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(i=n.endsWith(`Capture`),a=n.slice(2,i?n.length-7:void 0),t=e[kt]||null,t=t==null?null:t[n],typeof t==`function`&&e.removeEventListener(a,t,i),typeof r==`function`)){typeof t!=`function`&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(a,r,i);break a}N=!0,n in e?e[n]=r:!0===r?e.setAttribute(n,``):$t(e,n,r)}return}N=!0}function np(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,i=!1,a;for(a in n)if(n.hasOwnProperty(a)){var o=n[a];if(o!=null)switch(a){case`src`:r=!0;break;case`srcSet`:i=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(s(137,t));default:$(e,t,a,o,n,null)}}i&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=a=o=i=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:i=d;break;case`type`:o=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:a=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(s(137,t));break;default:$(e,t,r,d,n,null)}}dn(e,a,c,l,u,o,i,!1);return;case`select`:for(i in Q(`invalid`,e),r=o=a=null,n)if(n.hasOwnProperty(i)&&(c=n[i],c!=null))switch(i){case`value`:a=c;break;case`defaultValue`:o=c;break;case`multiple`:r=c;default:$(e,t,i,c,n,null)}t=a,n=o,e.multiple=!!r,t==null?n!=null&&pn(e,!!r,n,!0):pn(e,!!r,t,!1);return;case`textarea`:for(o in Q(`invalid`,e),a=i=r=null,n)if(n.hasOwnProperty(o)&&(c=n[o],c!=null))switch(o){case`value`:r=c;break;case`defaultValue`:i=c;break;case`children`:a=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(s(91));break;default:$(e,t,o,c,n,null)}hn(e,r,i,a);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<zf.length;r++)Q(zf[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(s(137,t));default:$(e,t,u,r,n,null)}return;default:if(bn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&tp(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}var rp={};function ip(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var i=null,a=null,o=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:m!==f&&(N=!0),a=m;break;case`name`:m!==f&&(N=!0),i=m;break;case`checked`:m!==f&&(N=!0),u=m;break;case`defaultChecked`:m!==f&&(N=!0),d=m;break;case`value`:m!==f&&(N=!0),o=m;break;case`defaultValue`:m!==f&&(N=!0),c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(s(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}un(e,o,c,l,u,d,a,i);return;case`select`:for(a in m=o=c=p=null,n)if(l=n[a],n.hasOwnProperty(a)&&l!=null)switch(a){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(a)||$(e,t,a,null,r,l)}for(i in r)if(a=r[i],l=n[i],r.hasOwnProperty(i)&&(a!=null||l!=null))switch(i){case`value`:a!==l&&(N=!0),p=a;break;case`defaultValue`:a!==l&&(N=!0),c=a;break;case`multiple`:a!==l&&(N=!0),o=a;default:a!==l&&$(e,t,i,a,r,l)}t=c,n=o,r=m,p==null?!!r!=!!n&&(t==null?pn(e,!!n,n?[]:``,!1):pn(e,!!n,t,!0)):pn(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(i=n[c],n.hasOwnProperty(c)&&i!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,i)}for(o in r)if(i=r[o],a=n[o],r.hasOwnProperty(o)&&(i!=null||a!=null))switch(o){case`value`:i!==a&&(N=!0),p=i;break;case`defaultValue`:i!==a&&(N=!0),m=i;break;case`children`:break;case`dangerouslySetInnerHTML`:if(i!=null)throw Error(s(91));break;default:i!==a&&$(e,t,o,i,r,a)}mn(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:p!==m&&(N=!0),e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(s(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(bn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&tp(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||tp(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function ap(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function op(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&ap(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&ap(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var sp=null,cp=null;function lp(e){return e.nodeType===9?e:e.ownerDocument}function up(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function dp(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function fp(e,t,n,r){return n=lp(n).createElement(e),n[Ot]=r,n[kt]=t,np(n,e,t),Ht(n),n}function pp(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var mp=null;function hp(){var e=window.event;return e&&e.type===`popstate`?e!==mp&&(mp=e,!0):(mp=null,!1)}var gp=typeof setTimeout==`function`?setTimeout:void 0,_p=typeof clearTimeout==`function`?clearTimeout:void 0,vp=typeof Promise==`function`?Promise:void 0,yp=typeof requestAnimationFrame==`function`?requestAnimationFrame:gp,bp=typeof queueMicrotask==`function`?queueMicrotask:vp===void 0?gp:function(e){return vp.resolve(null).then(e).catch(xp)};function xp(e){setTimeout(function(){throw e})}function Sp(e){return e===`head`}function Cp(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Hh(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)_m(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,_m(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Ft]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&_m(e.ownerDocument.body)}n=i}while(n);Hh(t)}function wp(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function Tp(e,t,n){if(t=CSS.escape(t)===t?t:`r-`+btoa(t).replace(/=/g,``),e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display===`inline`){if(t=e.getClientRects(),t.length===1)var r=1;else for(var i=r=0;i<t.length;i++){var a=t[i];0<a.width&&0<a.height&&r++}r===1&&(e=e.style,e.display=t.length===1?`inline-block`:`block`,e.marginTop=`-`+n.paddingTop,e.marginBottom=`-`+n.paddingBottom)}}function Ep(e,t){e=e.style,t=t.style;var n=t==null?null:t.hasOwnProperty(`viewTransitionName`)?t.viewTransitionName:t.hasOwnProperty(`view-transition-name`)?t[`view-transition-name`]:null;e.viewTransitionName=n==null||typeof n==`boolean`?``:(``+n).trim(),n=t==null?null:t.hasOwnProperty(`viewTransitionClass`)?t.viewTransitionClass:t.hasOwnProperty(`view-transition-class`)?t[`view-transition-class`]:null,e.viewTransitionClass=n==null||typeof n==`boolean`?``:(``+n).trim(),e.display===`inline-block`&&(t==null?e.display=e.margin=``:(n=t.display,e.display=n==null||typeof n==`boolean`?``:n,n=t.margin,n==null?(n=t.hasOwnProperty(`marginTop`)?t.marginTop:t[`margin-top`],e.marginTop=n==null||typeof n==`boolean`?``:n,t=t.hasOwnProperty(`marginBottom`)?t.marginBottom:t[`margin-bottom`],e.marginBottom=t==null||typeof t==`boolean`?``:t):e.margin=n))}function Dp(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position===`absolute`||t.position===`fixed`,clip:t.clipPath!==`none`||t.overflow!==`visible`||t.filter!==`none`||t.mask!==`none`||t.mask!==`none`||t.borderRadius!==`0px`,view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Op(e){return Dp(e.getBoundingClientRect(),getComputedStyle(e),e)}function kp(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return Dp(t,n,e)}function Ap(e){return e.documentElement.clientHeight}function jp(e){this.addEventListener(`load`,e),this.addEventListener(`error`,e)}function Mp(e,t,n,r,i,a,o,s,c){var l=t.nodeType===9?t:t.ownerDocument;try{var u=l.startViewTransition({update:function(){var t=l.defaultView,n=t.navigation&&t.navigation.transition,o=l.fonts.status;r();var s=[];if(o===`loaded`&&(Ap(l),l.fonts.status===`loading`&&s.push(l.fonts.ready)),o=s.length,e!==null)for(var c=e.suspenseyImages,u=0,d=0;d<c.length;d++){var f=c[d];if(!f.complete){var p=f.getBoundingClientRect();if(0<p.bottom&&0<p.right&&p.top<t.innerHeight&&p.left<t.innerWidth){if(u+=Xm(f),u>$m){s.length=o;break}f=new Promise(jp.bind(f)),s.push(f)}}}if(0<s.length)return t=Promise.race([Promise.all(s),new Promise(function(e){return setTimeout(e,500)})]).then(i,i),(n?Promise.allSettled([n.finished,t]):t).then(a,a);if(i(),n)return n.finished.then(a,a);a()},types:n});l.__reactViewTransition=u;var d=[];return u.ready.then(function(){for(var e=l.documentElement.getAnimations({subtree:!0}),t=0;t<e.length;t++){var n=e[t],r=n.effect,i=r.pseudoElement;if(i!=null&&i.startsWith(`::view-transition`)){d.push(n),n=r.getKeyframes();for(var a=i=void 0,s=!0,c=0;c<n.length;c++){var u=n[c],f=u.width;if(i===void 0)i=f;else if(i!==f){s=!1;break}if(f=u.height,a===void 0)a=f;else if(a!==f){s=!1;break}delete u.width,delete u.height,u.transform===`none`&&delete u.transform}s&&i!==void 0&&a!==void 0&&(r.setKeyframes(n),s=getComputedStyle(r.target,r.pseudoElement),s.width!==i||s.height!==a)&&(s=n[0],s.width=i,s.height=a,s=n[n.length-1],s.width=i,s.height=a,r.setKeyframes(n))}}o()},function(e){l.__reactViewTransition===u&&(l.__reactViewTransition=null);try{if(typeof e==`object`&&e)switch(e.name){case`InvalidStateError`:(e.message===`View transition was skipped because document visibility state is hidden.`||e.message===`Skipping view transition because document visibility state has become hidden.`||e.message===`Skipping view transition because viewport size changed.`||e.message===`Transition was aborted because of invalid state`)&&(e=null)}e!==null&&c(e)}finally{r(),i(),o()}}),u.finished.finally(function(){for(var e=0;e<d.length;e++)d[e].cancel();l.__reactViewTransition===u&&(l.__reactViewTransition=null),s()}),u}catch{return r(),i(),o(),null}}function Np(e,t){this._scope=document.documentElement,this._selector=`::view-transition-`+e+`(`+t+`)`}Np.prototype.animate=function(e,t){return t=typeof t==`number`?{duration:t}:w({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)},Np.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),r=[],i=0;i<n.length;i++){var a=n[i].effect;a!==null&&a.target===e&&a.pseudoElement===t&&r.push(n[i])}return r},Np.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Pp(e){return{name:e,group:new Np(`group`,e),imagePair:new Np(`image-pair`,e),old:new Np(`old`,e),new:new Np(`new`,e)}}function Fp(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Fp.prototype.addEventListener=function(e,t,n){var r=null,i=null;if(!(n!=null&&typeof n!=`boolean`&&(r=n.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var a=this._eventListeners;if(Bp(a,e,t,n)===-1){var o=this,s=t;n!=null&&typeof n!=`boolean`&&!0===n.once&&(s=function(r){o.removeEventListener(e,t,n),typeof t==`function`?t.call(this,r):t.handleEvent(r)}),r!==null&&(i=o.removeEventListener.bind(o,e,t,n),r.addEventListener(`abort`,i,{once:!0}),i=r.removeEventListener.bind(r,`abort`,i)),r=Rp(n),a.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:s,cleanup:i}),h(this._fragmentFiber.child,!1,Ip,e,s,r)}this._eventListeners=a}};function Ip(e,t,n,r){return b(e).addEventListener(t,n,r),!1}Fp.prototype.removeEventListener=function(e,t,n){var r=this._eventListeners;if(r!==null&&(t=Bp(r,e,t,n),t!==-1)){var i=r[t];n=i.attachedListener;var a=i.cleanup;i=Rp(i.optionsOrUseCapture),h(this._fragmentFiber.child,!1,Lp,e,n,i),r.splice(t,1),a!==null&&a()}};function Lp(e,t,n,r){return b(e).removeEventListener(t,n,r),!1}function Rp(e){return e!=null&&typeof e!=`boolean`&&(!0===e.once||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function zp(e){return e==null?`c=0`:typeof e==`boolean`?`c=`+(e?`1`:`0`):`c=`+(e.capture?`1`:`0`)}function Bp(e,t,n,r){if(e.length===0)return-1;r=zp(r);for(var i=0;i<e.length;i++){var a=e[i];if(a.type===t&&a.listener===n&&zp(a.optionsOrUseCapture)===r)return i}return-1}Fp.prototype.dispatchEvent=function(e){var t=g(this._fragmentFiber);if(t===null)return!0;t=b(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var r=t.nodeType===9?t.createComment(``):document.createTextNode(``);if(n)for(var i=0;i<n.length;i++){var a=n[i];r.addEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture))}if(t.appendChild(r),e=r.dispatchEvent(e),n)for(i=0;i<n.length;i++)a=n[i],r.removeEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture));return t.removeChild(r),e}return t.dispatchEvent(e)},Fp.prototype.focus=function(e){h(this._fragmentFiber.child,!0,Vp,e,void 0,void 0)};function Vp(e,t){return e.tag!==6&&(e=b(e),pm(e,t))}Fp.prototype.focusLast=function(e){var t=[];h(this._fragmentFiber.child,!0,Hp,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Vp(t[n],e);n--);};function Hp(e,t){return t.push(e),!1}Fp.prototype.blur=function(){var e=g(this._fragmentFiber);e!==null&&(e=b(e),e=lp(e).activeElement,e!==null&&h(this._fragmentFiber.child,!1,Up,e,void 0,void 0))};function Up(e,t){return e.tag!==6&&(e=b(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Fp.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),h(this._fragmentFiber.child,!1,Wp,e,void 0,void 0)};function Wp(e,t){return e.tag===6||(e=b(e),t.observe(e)),!1}Fp.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),h(this._fragmentFiber.child,!1,Gp,e,void 0,void 0);for(var n=t=0;n<Kp.length;n++){var r=Kp[n];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Kp[t++]=r}Kp.length=t}};function Gp(e,t){return e.tag===6||(e=b(e),t.unobserve(e)),!1}var Kp=[],qp=!1;function Jp(e,t,n){Kp.push({fragmentInstance:e,observer:t,instance:n}),qp||(qp=!0,mm(function(){qp=!1;var e=Kp;Kp=[];for(var t=0;t<e.length;t++){var n=e[t];n.observer.unobserve(n.instance)}}))}Fp.prototype.getClientRects=function(){var e=[];return h(this._fragmentFiber.child,!1,Yp,e,void 0,void 0),e};function Yp(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=b(e),t.push.apply(t,e.getClientRects());return!1}Fp.prototype.getRootNode=function(e){var t=g(this._fragmentFiber);return t===null?this:b(t).getRootNode(e)},Fp.prototype.compareDocumentPosition=function(e){var t=g(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];h(this._fragmentFiber.child,!1,Hp,n,void 0,void 0);var r=b(t);if(n.length===0){if(n=r,_(this._fragmentFiber)){a:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break a}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var i=r=n.compareDocumentPosition(e);return n===e?i=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=v(t)[1],n===null?i=Node.DOCUMENT_POSITION_PRECEDING:(e=b(n).compareDocumentPosition(e),i=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),i|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=b(n[0]),i=b(n[n.length-1]);var a=_(this._fragmentFiber)?t.parentElement:r;if(a==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,a=a.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_CONTAINED_BY;var o=t.compareDocumentPosition(e),s=i.compareDocumentPosition(e),c=o&Node.DOCUMENT_POSITION_CONTAINED_BY||s&Node.DOCUMENT_POSITION_CONTAINED_BY;return s=r&&a&&o&Node.DOCUMENT_POSITION_FOLLOWING&&s&Node.DOCUMENT_POSITION_PRECEDING,t=r&&t===e||a&&i===e||c||s?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&t===e||!a&&i===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:o,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Xp(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Xp(e,t,n,r,i){var a=Rt(i);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!a)a:{for(;a!==null;){if(a.tag===7&&(a===t||a.alternate===t)){n=!0;break a}a=a.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(a===null)return a=i.ownerDocument,i===a||i===a.documentElement||i===a.body;a:{for(a=t,t=g(t);a!==null;){if(!(a.tag!==5&&a.tag!==3&&a.tag!==27||a!==t&&a.alternate!==t)){a=!0;break a}a=a.return}a=!1}return a}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!a)&&!(t=a===n)&&(t=ne(n,a,C),t===null?t=!1:(h(t,!0,ee,a,n),a=x,x=null,t=a!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!a)&&!(t=a===r)&&(t=ne(r,a,C),t===null?t=!1:(h(t,!0,te,a,r),a=x,S=x=null,t=a!==null)),t):!1}function Zp(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Fp.prototype.scrollIntoView=function(e){if(typeof e==`object`)throw Error(s(566));var t=[];h(this._fragmentFiber.child,!1,Hp,t,void 0,void 0);var n=!1!==e;if(t.length===0){var r=v(this._fragmentFiber);if(r=n?r[1]||r[0]||g(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=b(r),Zp(e,n);return}if(r=b(r),r.nodeType!==9){if(r.nodeType===11){n=`host`in r?r.host:null,n!==null&&n.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=n?t.length-1:0;r!==(n?-1:t.length);){var i=t[r];i.tag===6?(i=b(i),Zp(i,n)):b(i).scrollIntoView(e),r+=n?-1:1}};function Qp(e,t){return e=b(e),$p(e,t),!1}function $p(e,t){e.reactFragments??=new Set,e.reactFragments.add(t)}function em(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.addEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){for(var r=0,i=0;i<Kp.length;i++){var a=Kp[i];(a.fragmentInstance!==t||a.observer!==n||a.instance!==e)&&(Kp[r++]=a)}Kp.length=r,n.observe(e)}),$p(e,t))}function tm(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.removeEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){typeof n.rootMargin==`string`?Jp(t,n,e):n.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function nm(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:nm(n),Lt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function rm(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[Ft])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=lm(e.nextSibling),e===null)break}return null}function im(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=lm(e.nextSibling),e===null))return null;return e}function am(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=lm(e.nextSibling),e===null))return null;return e}function om(e){return e.data===`$?`||e.data===`$~`}function sm(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function cm(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function lm(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var um=null;function dm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return lm(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function fm(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function pm(e,t){function n(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener(`focus`,n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener(`focus`,n,!0)}return r}function mm(e){yp(function(){yp(function(t){return e(t)})})}function hm(e,t,n){switch(t=lp(n),e){case`html`:if(e=t.documentElement,!e)throw Error(s(452));return e;case`head`:if(e=t.head,!e)throw Error(s(453));return e;case`body`:if(e=t.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function gm(e,t,n){for(var r in n){var i=n[r];n.hasOwnProperty(r)&&i!=null&&$(e,t,r,null,rp,i)}n.dangerouslySetInnerHTML!=null&&(e.textContent=``),e.onclick===wn&&(e.onclick=null),Lt(e)}function _m(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Lt(e)}var vm=new Map,ym=new Set;function bm(e){if(typeof e.getRootNode==`function`){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var xm=k.d;k.d={f:Sm,r:Cm,D:Em,C:Dm,L:Om,m:km,X:jm,S:Am,M:Mm};function Sm(){var e=xm.f(),t=zd();return e||t}function Cm(e){var t=zt(e);t!==null&&t.tag===5&&t.type===`form`?ac(t):xm.r(e)}var wm=typeof document>`u`?null:document;function Tm(e,t,n){var r=wm;if(r&&typeof t==`string`&&t){var i=ln(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),ym.has(i)||(ym.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),np(t,`link`,e),Ht(t),r.head.appendChild(t)))}}function Em(e){xm.D(e),Tm(`dns-prefetch`,e,null)}function Dm(e,t){xm.C(e,t),Tm(`preconnect`,e,t)}function Om(e,t,n){xm.L(e,t,n);var r=wm;if(r&&e&&t){var i=`link[rel="preload"][as="`+ln(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+ln(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+ln(n.imageSizes)+`"]`)):i+=`[href="`+ln(e)+`"]`;var a=i;switch(t){case`style`:a=Pm(e);break;case`script`:a=Rm(e)}if(!(vm.has(a)||(e=w({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),vm.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(Fm(a))||t===`script`&&r.querySelector(zm(a))))){var o=r.createElement(`link`);np(o,`link`,e),t===`style`&&(o[It]=!0,o.onload=o.onerror=function(){Ut(o)}),Ht(o),r.head.appendChild(o)}}}function km(e,t){xm.m(e,t);var n=wm;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+ln(r)+`"][href="`+ln(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Rm(e)}if(!vm.has(a)&&(e=w({rel:`modulepreload`,href:e},t),vm.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(zm(a)))return}r=n.createElement(`link`),np(r,`link`,e),Ht(r),n.head.appendChild(r)}}}function Am(e,t,n){xm.S(e,t,n);var r=wm;if(r&&e){var i=Vt(r).hoistableStyles,a=Pm(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(Fm(a)))s.loading=5;else{e=w({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=vm.get(a))&&Hm(e,n);var c=o=r.createElement(`link`);Ht(c),np(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Vm(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function jm(e,t){xm.X(e,t);var n=wm;if(n&&e){var r=Vt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=w({src:e,async:!0},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Ht(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Mm(e,t){xm.M(e,t);var n=wm;if(n&&e){var r=Vt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=w({src:e,async:!0,type:`module`},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Ht(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Nm(e,t,n,r){var i=(i=M.current)?bm(i):null;if(!i)throw Error(s(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(n=Pm(n.href),t=Vt(i).hoistableStyles,r=t.get(n),r||(r={type:`style`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Pm(n.href);var a=Vt(i).hoistableStyles,o=a.get(e);if(o||(i=i.ownerDocument||i,o={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},a.set(e,o),(a=i.querySelector(Fm(e)))?a._p||(o.instance=a,o.state.loading=5):(a=vm.get(e),a||(a={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},vm.set(e,a)),Lm(i,e,a,o.state))),t&&r===null)throw Error(s(528,``));return o}if(t&&r!==null)throw Error(s(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(n=Rm(n),t=Vt(i).hoistableScripts,r=t.get(n),r||(r={type:`script`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(s(444,e))}}function Pm(e){return`href="`+ln(e)+`"`}function Fm(e){return`link[rel="stylesheet"][`+e+`]`}function Im(e){return w({},e,{"data-precedence":e.precedence,precedence:null})}function Lm(e,t,n,r){if(t=e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)){if(!0!==t[It]){r.loading=1;return}}else t=e.createElement(`link`),t[It]=!0,t.onload=t.onerror=Ut.bind(null,t),np(t,`link`,n),Ht(t),e.head.appendChild(t);r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2})}function Rm(e){return`[src="`+ln(e)+`"]`}function zm(e){return`script[async]`+e}function Bm(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+ln(n.href)+`"]`);if(r)return t.instance=r,Ht(r),r;var i=w({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Ht(r),np(r,`style`,i),Vm(r,n.precedence,e),t.instance=r;case`stylesheet`:i=Pm(n.href);var a=e.querySelector(Fm(i));if(a)return t.state.loading|=4,t.instance=a,Ht(a),a;r=Im(n),(i=vm.get(i))&&Hm(r,i),a=(e.ownerDocument||e).createElement(`link`),Ht(a);var o=a;return o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),np(a,`link`,r),t.state.loading|=4,Vm(a,n.precedence,e),t.instance=a;case`script`:return a=Rm(n.src),(i=e.querySelector(zm(a)))?(t.instance=i,Ht(i),i):(r=n,(i=vm.get(a))&&(r=w({},n),Um(r,i)),e=e.ownerDocument||e,i=e.createElement(`script`),Ht(i),np(i,`link`,r),e.head.appendChild(i),t.instance=i);case`void`:return null;default:throw Error(s(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Vm(r,n.precedence,e));return t.instance}function Vm(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Hm(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function Um(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Wm=null;function Gm(e,t,n){if(Wm===null){var r=new Map,i=Wm=new Map;i.set(n,r)}else i=Wm,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Ft]||a[Ot]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Km(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function qm(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Jm(e,t){return e===`img`&&t.src!=null&&t.src!==``&&t.onLoad==null&&t.loading!==`lazy`}function Ym(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Xm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio==`number`?devicePixelRatio:1)*.25}function Zm(e,t){typeof t.decode==`function`&&(e.imgCount++,t.complete||(e.imgBytes+=Xm(t),e.suspenseyImages.push(t)),e=rh.bind(e),t.decode().then(e,e))}function Qm(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Pm(r.href),a=t.querySelector(Fm(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=nh.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Ht(a);return}a=t.ownerDocument||t,r=Im(r),(i=vm.get(i))&&Hm(r,i),a=a.createElement(`link`),Ht(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),np(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=nh.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var $m=0;function eh(e,t){return e.stylesheets&&e.count===0&&ah(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&$m===0&&($m=62500*op());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>$m?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function th(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ah(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function nh(){this.count--,th(this)}function rh(){this.imgCount--,th(this)}var ih=null;function ah(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ih=new Map,t.forEach(oh,e),ih=null,nh.call(e))}function oh(e,t){if(!(t.state.loading&4)){var n=ih.get(e);if(n)var r=n.get(null);else{n=new Map,ih.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=nh.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var sh={$$typeof:le,Provider:null,Consumer:null,_currentValue:Ce,_currentValue2:Ce,_threadCount:0};function ch(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=_t(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=_t(0),this.hiddenUpdates=_t(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map}function lh(e,t,n,r,i,a,o,s,c,l,u,d){return e=new ch(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=Ri(3,null,null,t),e.current=a,a.stateNode=e,t=Ia(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},yo(a),e}function uh(e){return e?(e=Ii,e):Ii}function dh(e,t,n,r,i,a){i=uh(i),r.context===null?r.context=i:r.pendingContext=i,r=xo(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=So(e,r,t),n!==null&&(Pd(n,e,t),Co(n,e,t))}function fh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ph(e,t){fh(e,t),(e=e.alternate)&&fh(e,t)}function mh(e){if(e.tag===13||e.tag===31){var t=Ni(e,67108864);t!==null&&Pd(t,e,67108864),ph(e,67108864)}}function hh(e){if(e.tag===13||e.tag===31){var t=jd();t=Ct(t);var n=Ni(e,t);n!==null&&Pd(n,e,t),ph(e,t)}}var gh=!0;function _h(e,t,n,r){var i=O.T;O.T=null;var a=k.p;try{k.p=2,yh(e,t,n,r)}finally{k.p=a,O.T=i}}function vh(e,t,n,r){var i=O.T;O.T=null;var a=k.p;try{k.p=8,yh(e,t,n,r)}finally{k.p=a,O.T=i}}function yh(e,t,n,r){if(gh){var i=bh(r);if(i===null)Kf(e,t,r,xh,n),Mh(e,r);else if(Ph(i,e,t,n,r))r.stopPropagation();else if(Mh(e,r),t&4&&-1<jh.indexOf(e)){for(;i!==null;){var a=zt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=dt(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-it(o);s.entanglements[1]|=c,o&=~c}Ef(a),!(W&6)&&(_d=Ke()+500,Df(0,!1))}}break;case 31:case 13:s=Ni(a,2),s!==null&&Pd(s,a,2),zd(),ph(a,2)}if(a=bh(r),a===null&&Kf(e,t,r,xh,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Kf(e,t,r,null,n)}}function bh(e){return e=En(e),Sh(e)}var xh=null;function Sh(e){if(xh=null,e=Rt(e),e!==null){var t=l(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=u(t),e!==null)return e;e=null}else if(n===31){if(e=d(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return xh=e,null}function Ch(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`fullscreenerror`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`resize`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(qe()){case Je:return 2;case Ye:return 8;case Xe:case Ze:return 32;case Qe:return 268435456;default:return 32}default:return 32}}var wh=!1,Th=null,Eh=null,Dh=null,Oh=new Map,kh=new Map,Ah=[],jh=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Mh(e,t){switch(e){case`focusin`:case`focusout`:Th=null;break;case`dragenter`:case`dragleave`:Eh=null;break;case`mouseover`:case`mouseout`:Dh=null;break;case`pointerover`:case`pointerout`:Oh.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:kh.delete(t.pointerId)}}function Nh(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=zt(t),t!==null&&mh(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ph(e,t,n,r,i){switch(t){case`focusin`:return Th=Nh(Th,e,t,n,r,i),!0;case`dragenter`:return Eh=Nh(Eh,e,t,n,r,i),!0;case`mouseover`:return Dh=Nh(Dh,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Oh.set(a,Nh(Oh.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,kh.set(a,Nh(kh.get(a)||null,e,t,n,r,i)),!0}return!1}function Fh(e){var t=Rt(e.target);if(t!==null){var n=l(t);if(n!==null){if(t=n.tag,t===13){if(t=u(n),t!==null){e.blockedOn=t,Et(e.priority,function(){hh(n)});return}}else if(t===31){if(t=d(n),t!==null){e.blockedOn=t,Et(e.priority,function(){hh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ih(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=bh(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Tn=r,n.target.dispatchEvent(r),Tn=null}else return t=zt(n),t!==null&&mh(t),e.blockedOn=n,!1;t.shift()}return!0}function Lh(e,t,n){Ih(e)&&n.delete(t)}function Rh(){wh=!1,Th!==null&&Ih(Th)&&(Th=null),Eh!==null&&Ih(Eh)&&(Eh=null),Dh!==null&&Ih(Dh)&&(Dh=null),Oh.forEach(Lh),kh.forEach(Lh)}function zh(e,n){e.blockedOn===n&&(e.blockedOn=null,wh||(wh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Rh)))}var Bh=null;function Vh(e){Bh!==e&&(Bh=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){Bh===e&&(Bh=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(Sh(r||n)===null)continue;break}var a=zt(n);a!==null&&(e.splice(t,3),t-=3,rc(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Hh(e){function t(t){return zh(t,e)}Th!==null&&zh(Th,e),Eh!==null&&zh(Eh,e),Dh!==null&&zh(Dh,e),Oh.forEach(t),kh.forEach(t);for(var n=0;n<Ah.length;n++){var r=Ah[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Ah.length&&(n=Ah[0],n.blockedOn===null);)Fh(n),n.blockedOn===null&&Ah.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[kt]||null;if(typeof a==`function`)o||Vh(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[kt]||null)s=o.formAction;else if(Sh(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Vh(n)}}}function Uh(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Wh(e){this._internalRoot=e}Gh.prototype.render=Wh.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(s(409));var n=t.current;dh(n,jd(),e,t,null,null)},Gh.prototype.unmount=Wh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;dh(e.current,2,null,e,null,null),zd(),t[At]=null}};function Gh(e){this._internalRoot=e}Gh.prototype.unstable_scheduleHydration=function(e){if(e){var t=Tt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ah.length&&t!==0&&t<Ah[n].priority;n++);Ah.splice(n,0,e),n===0&&Fh(e)}};var Kh=r.version;if(Kh!==`19.3.1`)throw Error(s(527,Kh,`19.3.1`));k.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(s(188)):(e=Object.keys(e).join(`,`),Error(s(268,e)));return e=p(t),e=e===null?null:m(e),e=e===null?null:e.stateNode,e};var qh={bundleType:0,version:`19.3.1`,rendererPackageName:`react-dom`,currentDispatcherRef:O,reconcilerVersion:`19.3.1`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Jh=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jh.isDisabled&&Jh.supportsFiber)try{tt=Jh.inject(qh),nt=Jh}catch{}}e.createRoot=function(e,t){if(!c(e))throw Error(s(299));var n=!1,r=``,i=Ec,a=Dc,o=Oc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=lh(e,1,!1,null,null,n,r,null,i,a,o,Uh),e[At]=t.current,Wf(e),new Wh(t)}})),c=e(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=s()})),l=n(),u=c(),d=[`ship`,`stations`,`rails`,`orders`,`shiplog`,`quarters`];async function f(){if(window.FIXTURES)return window.FIXTURES;let e=await Promise.all(d.map(async e=>{let t=await fetch(`fixtures/${e}.json`,{cache:`no-store`});if(!t.ok)throw Error(`fixtures/${e}.json: ${t.status}`);return[e,await t.json()]})),t=Object.fromEntries(e),n=await m();return n?{...t,rails:n}:t}var p=6e4;async function m(){if(window.FIXTURES)return null;try{let e=await fetch(`live/rails.json`,{cache:`no-store`});if(!e.ok)return null;let t=await e.json();return t&&t.synthetic===!1&&Array.isArray(t.rails)&&typeof t.asOf==`string`?t:null}catch{return null}}function h(e,t=Date.now()){return e.synthetic?`sample`:t-Date.parse(e.asOf)>3e5?`stale`:`live`}var g=[`bridge`,`quarters`];function _(e){let t=e.replace(/^#\/?/,``);return g.includes(t)?t:`bridge`}function v(){let[e,t]=(0,l.useState)(()=>_(window.location.hash));return(0,l.useEffect)(()=>{let e=()=>t(_(window.location.hash));return window.addEventListener(`hashchange`,e),window.addEventListener(`popstate`,e),()=>{window.removeEventListener(`hashchange`,e),window.removeEventListener(`popstate`,e)}},[]),[e,(0,l.useCallback)(e=>{t(e),window.scrollTo(0,0);try{window.history.pushState(null,``,`#/${e}`)}catch{}},[])]}var y={local:{label:`LOCAL`,color:`var(--rail-local)`,legend:`Local qwen`},codex:{label:`CODEX`,color:`var(--rail-codex)`,legend:`Codex`},claude:{label:`CLAUDE`,color:`var(--rail-claude)`,legend:`Claude`},mixed:{label:`MIXED`,color:`var(--rail-mixed)`,legend:`Mixed`},captain:{label:`CAPTAIN`,color:`var(--captain)`,legend:`Captain`}},b={live:{label:`LIVE`,line:`solid`},approved:{label:`APPROVED, NOT BUILT`,line:`dashed`},proposed:{label:`PROPOSED`,line:`dashed`},reserved:{label:`NAME RESERVED`,line:`dotted`}},x={captain:{label:`Captain`,short:`Captain`,order:0,officer:!0},commander:{label:`Commander`,short:`Commander`,order:1,officer:!0},ltcmdr:{label:`Lieutenant Commander`,short:`Lt Cmdr`,order:2,officer:!0},lt:{label:`Lieutenant`,short:`Lieutenant`,order:3,officer:!0},ltjg:{label:`Lieutenant junior grade`,short:`Lt jg`,order:4,officer:!0},ensign:{label:`Ensign`,short:`Ensign`,order:5,officer:!0},cpo:{label:`Chief Petty Officer`,short:`Chief PO`,order:6,officer:!1},po:{label:`Petty Officer`,short:`Petty Officer`,order:7,officer:!1},cadet:{label:`Cadet`,short:`Cadet`,order:8,officer:!1},none:{label:`No rank (the computer)`,short:`No rank`,order:9,officer:!1},team:{label:`No rank (a team)`,short:`No rank`,order:10,officer:!1},space:{label:`A place`,short:`Place`,order:11,officer:!1}},S=[{id:`command`,name:`Command`,uniform:`#e8645c`},{id:`flight`,name:`Flight Control`,uniform:`#e8645c`},{id:`ops`,name:`Operations`,uniform:`#e3b24a`},{id:`security`,name:`Security`,uniform:`#e3b24a`},{id:`eng`,name:`Engineering`,uniform:`#e3b24a`},{id:`holo`,name:`Holodeck & Design`,uniform:`#e3b24a`},{id:`sci`,name:`Sciences`,uniform:`#5aa4ec`},{id:`med`,name:`Medical`,uniform:`#5aa4ec`}],ee=[`Bridge`,`Command deck`,`Sciences, records & sickbay`,`Holodeck & design`,`Crew quarters`,`Operations & customs`,`Main engineering`,`Lower decks`],te=new Set([`strategist`]),C=[{id:`bridge`,label:`Bridge`,deck:1,built:!0},{id:`quarters`,label:`Captain's Quarters`,deck:2,built:!0},{id:`deckplan`,label:`Deck plan`,phase:`H2`},{id:`sector`,label:`Sector chart`,phase:`H2`},{id:`science`,label:`Science lab`,phase:`H3`},{id:`sensors`,label:`Sensor array`,phase:`H3`},{id:`engineering`,label:`Main Engineering`,phase:`H3`},{id:`conn`,label:`Conn handoff`,phase:`H4`}],ne={captain:{full:4,hollow:0},commander:{full:3,hollow:0},ltcmdr:{full:2,hollow:1},lt:{full:2,hollow:0},ltjg:{full:1,hollow:1},ensign:{full:1,hollow:0}},w=`Speed words set the reasoning level: Thrusters, Impulse, Warp, High Warp, Maximum Warp.`;function T(e){return y[e]?.color??y.mixed.color}var re=new Set,ie=new Set([`captain`,`computer`]);function ae(e){return e.kind===`station`&&e.status===`live`&&!ie.has(e.id)}var oe=[`local`,`codex`,`claude`];function se(e,t,n){return t[n]?`out`:e.rails.rails.find(e=>e.id===n)?.state??`up`}function ce(e,t,n,r=re){if(n.kind!==`station`||n.status!==`live`)return null;if(r.has(n.id)&&ae(n))return`relieved`;let i=(n.needs??[]).filter(n=>se(e,t,n)===`out`);return i.length?i.map(e=>`${y[e].legend} out`).join(`, `):null}function le(e,t){return e.filter(e=>!e.head&&e.status===`live`&&!t(e)&&x[e.rank].officer&&!te.has(e.id)).sort((e,t)=>x[e.rank].order-x[t.rank].order)[0]}function ue(e,t,n=re){let r={},i=r=>ce(e,t,r,n);for(let t of S){if(t.id===`command`)continue;let n=e.stations.stations.filter(e=>e.dept===t.id&&e.status===`live`),a=n.find(e=>e.head);if(!a||!i(a))continue;let o=le(n,i);r[t.id]=o?o.id:`dark`}return r}function de(e,t,n=re){let r=ue(e,t,n);return{data:e,rail:n=>se(e,t,n),off:r=>ce(e,t,r,n),acting:r,relieved:n,station:t=>e.stations.stations.find(e=>e.id===t),actingFor:e=>Object.keys(r).find(t=>r[t]===e)}}var fe=e((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),E=e(((e,t)=>{t.exports=fe()}))(),pe=[{id:`ask`,label:`Ask`},{id:`order`,label:`Order`},{id:`approve`,label:`Approve`},{id:`deny`,label:`Deny`}];function me({ship:e,target:t,onToast:n}){let[r,i]=(0,l.useState)(`ask`),[a,o]=(0,l.useState)(!1),[s,c]=(0,l.useState)(!1),[u,d]=(0,l.useState)(``),[f,p]=(0,l.useState)(null),m=(0,l.useRef)(null),h=a?e.station(`lounge`):e.station(t??`xo`)??e.station(`xo`),g=h?.kind!==`station`,_=g&&!a?e.station(`xo`):h,v=_?e.off(_):null,b=e.data.orders.orders.filter(e=>e.state===`awaiting-captain`),x=r===`ask`?[`Status report`,`What's in flight?`,`Anything for me?`]:r===`order`?_?.activeOrder?[`Follow up ${_.activeOrder}`,`Run the next card`]:[`Run the next card`]:b.map(e=>e.id),S=r===`ask`?0:r===`order`?1:Math.max(0,...b.map(e=>e.tier)),ee=u.trim()||f;(0,l.useEffect)(()=>{p(null)},[r]),(0,l.useEffect)(()=>{s&&m.current?.focus()},[s]);let te=()=>{ee&&(n(`Comms open in H4. Nothing was sent to ${a?`all hands`:_?.short??`Number One`}.`),d(``),p(null),c(!1))},C=a?`Briefing Room · every station on its own rail`:v?`${_?.short} is off duty (${v}): this would queue for the acting head`:g?`${h?.short} is a place, so this goes to Number One`:`Goes to ${_?.short} on ${y[_?.rail??`mixed`].legend}`;return(0,E.jsx)(`div`,{className:`badgewrap`,children:(0,E.jsxs)(`div`,{className:`badge`+(s?` lifted`:``),role:`region`,"aria-label":`Comm badge`,children:[(0,E.jsxs)(`div`,{className:`brow`,children:[(0,E.jsx)(`svg`,{className:`bicon`,viewBox:`0 0 24 24`,"aria-hidden":`true`,children:(0,E.jsx)(`path`,{d:`M12 2 L20 21 L12 16.5 L4 21 Z`})}),(0,E.jsxs)(`span`,{className:`bname`,children:[(0,E.jsx)(`span`,{className:`btitle`,children:`COMM BADGE`}),(0,E.jsx)(`span`,{className:`bsub mono`,children:`READ-ONLY · OPENS IN H4`})]}),(0,E.jsx)(`span`,{className:`mono blabel`,children:`TO`}),(0,E.jsxs)(`span`,{className:`bto`,style:{"--c":T(a?`mixed`:_?.rail??`local`)},children:[(0,E.jsx)(`span`,{className:`dot`}),a?`All hands`:h?.short??`Number One`]}),(0,E.jsx)(`button`,{type:`button`,className:`bchip`,"aria-pressed":a,onClick:()=>o(!a),children:`All hands`}),(0,E.jsx)(`span`,{className:`bsep`,"aria-hidden":`true`}),pe.map(e=>(0,E.jsx)(`button`,{type:`button`,className:`bkind bk-`+e.id,"aria-pressed":r===e.id,onClick:()=>i(e.id),children:e.label},e.id)),(0,E.jsx)(`span`,{className:`bsep`,"aria-hidden":`true`}),(0,E.jsxs)(`div`,{className:`bpresets`,children:[x.length===0&&(0,E.jsx)(`span`,{className:`bempty`,children:`Nothing waits for you.`}),x.map(e=>(0,E.jsx)(`button`,{type:`button`,className:`bpreset`,"aria-pressed":f===e,onClick:()=>p(f===e?null:e),children:e},e)),(0,E.jsx)(`span`,{className:`bnote`,style:{color:v?`var(--bad)`:`var(--text-muted)`},children:C})]}),(0,E.jsxs)(`span`,{className:`btier`,style:{"--c":`var(--tier-${S})`},children:[`TIER `,S]}),(0,E.jsxs)(`button`,{type:`button`,className:`bwritebtn`,"aria-expanded":s,onClick:()=>c(!s),children:[(0,E.jsx)(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`,children:(0,E.jsx)(`path`,{d:`M4 20h4L19 9l-4-4L4 16z M14 6l4 4`})}),s?`Close`:`Write`]}),(0,E.jsx)(`button`,{type:`button`,className:`bsend`,"aria-disabled":!ee,onClick:te,children:r===`approve`?`Approve`:r===`deny`?`Deny`:`Send`})]}),s&&(0,E.jsxs)(`div`,{className:`bwrite`,children:[(0,E.jsx)(`textarea`,{ref:m,className:`btext`,rows:3,maxLength:500,value:u,onChange:e=>d(e.target.value),onKeyDown:e=>{e.key===`Escape`&&c(!1),e.key===`Enter`&&(e.ctrlKey||e.metaKey)&&te()},placeholder:`Your words to ${a?`all hands`:_?.short??`Number One`}`,"aria-label":`Your own words`}),(0,E.jsxs)(`div`,{className:`bmeta mono`,children:[(0,E.jsx)(`span`,{children:`Passed through word for word. Nothing leaves this screen yet.`}),(0,E.jsxs)(`span`,{children:[u.length,`/500 · Ctrl+Enter sends · Esc closes`]})]})]})]})})}var he=`Europe/Stockholm`;function ge(e){return new Intl.DateTimeFormat(`en-GB`,{hour:`2-digit`,minute:`2-digit`,timeZone:he}).format(new Date(e))}function D(e){return new Intl.DateTimeFormat(`en-GB`,{weekday:`short`,hour:`2-digit`,minute:`2-digit`,timeZone:he}).format(new Date(e))}function _e(e){return new Intl.DateTimeFormat(`en-GB`,{weekday:`short`,day:`numeric`,month:`short`,timeZone:he}).format(new Date(e)).toUpperCase()}function ve(e){return new Intl.DateTimeFormat(`en-GB`,{weekday:`short`,day:`2-digit`,month:`short`,timeZone:he}).format(e).toUpperCase()}function ye(e,t){let n=Math.round((new Date(e).getTime()-new Date(t).getTime())/6e4);return n<1?`just now`:n<60?`${n} min ago`:`${Math.floor(n/60)} h ${n%60} min ago`}var be={sample:`Sample numbers: the rails probe is not running yet.`,live:`Live: read by the rails probe on the NAS about once a minute.`,stale:`Stale: the rails probe has not written for over five minutes.`},xe={gpu:`GPU`,vram:`VRAM`,window:`5 H`,week:`WEEK`};function Se({ship:e,drills:t,compact:n=!1}){return(0,E.jsxs)(`section`,{className:`panel`+(n?` rails-compact`:``),"aria-labelledby":`rails-title`,children:[(0,E.jsxs)(`div`,{className:`panel-head`,children:[(0,E.jsx)(`h2`,{className:`panel-title`,id:`rails-title`,children:`Rails`}),(0,E.jsxs)(`span`,{className:`mono panel-meta`,title:be[h(e.data.rails)],children:[h(e.data.rails).toUpperCase(),` · AS OF `,ge(e.data.rails.asOf),n?` · RESETS ON THE VIEWPORT`:``]})]}),!n&&(0,E.jsx)(`p`,{className:`help`,children:`Engine, nacelles and how much of each window is spent.`}),(0,E.jsx)(`div`,{className:`rails`,children:e.data.rails.rails.map(r=>{let i=e.rail(r.id),a=!!t[r.id];return(0,E.jsxs)(`div`,{className:`rail`+(i===`out`?` out`:``),style:{"--c":T(r.id)},children:[(0,E.jsxs)(`div`,{children:[(0,E.jsxs)(`div`,{className:`rail-name`,children:[r.label,(0,E.jsx)(`span`,{className:`state ${i}`,children:a?`DRILL · OUT`:i.toUpperCase()})]}),(0,E.jsx)(`div`,{className:`rail-sub`,children:r.engine}),r.burn?.active&&r.burn.until&&!a&&(0,E.jsx)(`div`,{className:`rail-burn`,children:(0,E.jsxs)(`span`,{className:`state burn`,title:`Dilithium Burn: full windows overnight until the weekly reset`,children:[`BURN TO `,D(r.burn.until).toUpperCase()]})})]}),(0,E.jsxs)(`div`,{className:`meters`,children:[r.meters.length===0&&(0,E.jsx)(`p`,{className:`meter-none`,children:r.note??`No readings yet.`}),r.meters.map(e=>{let t=a&&e.id!==`vram`?100:e.percent;return(0,E.jsxs)(`div`,{children:[(0,E.jsxs)(`div`,{className:`meter`,children:[(0,E.jsx)(`span`,{className:`meter-label`,children:n?xe[e.id]??e.label.toUpperCase():e.label.toUpperCase()}),(0,E.jsx)(O,{value:t,label:`${r.label} ${e.label}`}),(0,E.jsxs)(`span`,{className:`meter-val`,children:[t,`%`]})]}),e.resetsAt&&!n&&(0,E.jsxs)(`div`,{className:`meter`,"aria-hidden":`true`,children:[(0,E.jsx)(`span`,{}),(0,E.jsxs)(`span`,{className:`meter-reset`,children:[`resets `,D(e.resetsAt)]})]})]},e.id)})]})]},r.id)})})]})}function O({value:e,label:t}){let n=Math.round(Math.min(100,Math.max(0,e))/5);return(0,E.jsx)(`div`,{className:`segbar`,role:`meter`,"aria-valuenow":e,"aria-valuemin":0,"aria-valuemax":100,"aria-label":t,children:Array.from({length:20},(e,t)=>(0,E.jsx)(`i`,{className:(t<n?`on`:``)+(t>=16?` hot`:``)},t))})}function k({ship:e,picked:t,onOpen:n,help:r=`Approve and Deny open in H4, in the Captain's Quarters.`}){let i=e.data.orders.orders.filter(e=>e.state===`awaiting-captain`).sort((e,t)=>t.tier-e.tier);return(0,E.jsxs)(`section`,{className:`panel panel-captain`,"aria-labelledby":`hails-title`,children:[(0,E.jsxs)(`div`,{className:`panel-head`,children:[(0,E.jsx)(`h2`,{className:`panel-title`,id:`hails-title`,children:`Awaiting your orders`}),(0,E.jsx)(`span`,{className:`count`+(i.length?``:` zero`),children:i.length})]}),(0,E.jsx)(`p`,{className:`help`,children:r}),(0,E.jsxs)(`div`,{className:`hails`,children:[i.length===0&&(0,E.jsx)(`p`,{className:`empty`,children:`Nothing waits for you.`}),i.map(r=>{let i=e.station(r.station);return(0,E.jsxs)(`div`,{className:`hail`,role:`button`,tabIndex:0,"aria-pressed":t===r.id,style:{"--tc":`var(--tier-${r.tier})`},onClick:()=>n(r.station,r.id),onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n(r.station,r.id))},children:[(0,E.jsx)(`div`,{className:`hail-title`,children:r.title}),(0,E.jsxs)(`div`,{className:`hail-meta`,children:[(0,E.jsx)(`span`,{className:`idtag`,children:r.id}),(0,E.jsx)(`span`,{className:`railpill`,style:{"--c":T(i?.rail??`mixed`)},children:(i?.short??r.station).toUpperCase()}),(0,E.jsxs)(`span`,{className:`tierpill`,style:{"--c":`var(--tier-${r.tier})`},children:[`TIER `,r.tier]}),(0,E.jsx)(`span`,{className:`idtag`,children:ye(e.data.orders.asOf,r.updatedAt)})]}),(0,E.jsxs)(`div`,{className:`hail-actions`,children:[(0,E.jsx)(`button`,{type:`button`,className:`btn btn-ghost`,disabled:!0,title:`Arrives in H4`,children:`Deny`}),(0,E.jsx)(`button`,{type:`button`,className:`btn btn-gold`,disabled:!0,title:`Arrives in H4`,children:`Approve`})]})]},r.id)})]})]})}function Ce({ship:e,filter:t,picked:n,onOpen:r}){let[i,a]=(0,l.useState)(new Set),[o,s]=(0,l.useState)(new Set),c=e.data.orders.orders.filter(e=>e.state!==`done`&&e.state!==`awaiting-captain`),u=e=>c.filter(t=>t.parent===e),d=c.filter(e=>!e.parent||!c.some(t=>t.id===e.parent)).flatMap(e=>[e,...u(e.id).filter(t=>!o.has(e.id)||t.id===n)]).filter(n=>t===`all`||e.station(n.station)?.rail===t),f=new Set(d.map(e=>e.id)),p=d.length>0&&d.every(e=>i.has(e.id)),m=(e,t)=>e(e=>{let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n});return(0,E.jsxs)(`section`,{className:`panel panel-grow`,"aria-labelledby":`flight-title`,children:[(0,E.jsxs)(`div`,{className:`panel-head`,children:[(0,E.jsx)(`h2`,{className:`panel-title`,id:`flight-title`,children:`In flight`}),(0,E.jsxs)(`span`,{className:`mono panel-meta`,title:w,children:[c.length,` ORDERS · SPEED SETS THE REASONING`]}),(0,E.jsxs)(`button`,{type:`button`,className:`foldall`,"aria-expanded":p,onClick:()=>a(p?new Set:new Set(d.map(e=>e.id))),children:[(0,E.jsx)(Ee,{}),p?`CLOSE ALL CARDS`:`OPEN ALL CARDS`]})]}),(0,E.jsxs)(`ol`,{className:`orders`,children:[d.length===0&&(0,E.jsx)(`li`,{className:`empty`,children:`No orders in flight on this rail.`}),d.map((t,c)=>{let l=e.station(t.station),p=l?e.off(l):null,h=!!t.parent&&f.has(t.parent),g=h?[]:u(t.id),_=i.has(t.id),v=o.has(t.id),y=h&&d[c+1]?.parent===t.parent;return(0,E.jsxs)(`li`,{style:{"--c":T(l?.rail??`mixed`)},className:`ocard`+(h?` child`:``)+(y?` more-sibs`:``)+(_?` is-read`:``)+(n===t.id?` picked`:``),children:[(0,E.jsxs)(`div`,{className:`ocard-head`,onClick:()=>r(t.station,t.id),children:[(0,E.jsx)(`span`,{className:`idtag`,children:t.id}),(0,E.jsx)(`button`,{type:`button`,className:`ocard-title`,"aria-pressed":n===t.id,onClick:e=>{e.stopPropagation(),r(t.station,t.id)},children:t.title}),(0,E.jsx)(`span`,{className:`statepill ${p?`waiting`:t.state}`,children:p?`WAITS · ${p.toUpperCase()}`:t.state.toUpperCase()}),(0,E.jsx)(`button`,{type:`button`,className:`fold`,"aria-expanded":_,"aria-controls":_?`body-${t.id}`:void 0,"aria-label":`${_?`Close`:`Read`} the card ${t.id}`,title:_?`Close the card`:`Read the full card`,onClick:e=>{e.stopPropagation(),m(a,t.id)},children:(0,E.jsx)(Ee,{})}),(0,E.jsxs)(`span`,{className:`ocard-sub`,children:[l?.short??t.station,` · `,t.speed??``,` · `,ye(e.data.orders.asOf,t.updatedAt),g.length>0&&(0,E.jsxs)(`button`,{type:`button`,className:`subfold`,"aria-expanded":!v,onClick:e=>{e.stopPropagation(),m(s,t.id)},children:[(0,E.jsx)(Ee,{}),g.length,` SUB-ORDERS`]})]})]}),_&&(0,E.jsxs)(`div`,{className:`ocard-body`,id:`body-${t.id}`,children:[t.body?(0,E.jsx)(Te,{text:t.body}):t.detail&&(0,E.jsx)(`p`,{className:`cb-text`,children:t.detail}),(0,E.jsxs)(`p`,{className:`cb-facts mono`,children:[(l?.name??t.station).toUpperCase(),` · TIER `,t.tier,t.parent&&` · PART OF ${t.parent}`,g.length>0&&` · ${g.length} SUB-ORDERS`]})]})]},t.id)})]})]})}var we=/^(GOAL|CONTEXT|CONSTRAINTS|DONE WHEN|START WITH):\s*(.*)$/;function Te({text:e}){let t=[];for(let n of e.split(`
`)){let e=we.exec(n);e?t.push({head:e[1],lines:e[2]?[e[2]]:[]}):n.trim()&&(t.length===0&&t.push({lines:[]}),t[t.length-1].lines.push(n.trim()))}return(0,E.jsx)(`dl`,{className:`cb`,children:t.map((e,t)=>{let n=e.lines.filter(e=>e.startsWith(`- `)),r=e.lines.filter(e=>!e.startsWith(`- `));return(0,E.jsxs)(`div`,{className:`cb-sec`,children:[(0,E.jsx)(`dt`,{className:`cb-head mono`,children:e.head??`NOTE`}),(0,E.jsxs)(`dd`,{className:`cb-text`,children:[r.map((e,t)=>(0,E.jsx)(`p`,{children:e},t)),n.length>0&&(0,E.jsx)(`ul`,{children:n.map((e,t)=>(0,E.jsx)(`li`,{children:e.slice(2)},t))})]})]},t)})})}function Ee(){return(0,E.jsx)(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`,className:`chev`,children:(0,E.jsx)(`path`,{d:`M6 9l6 6 6-6`})})}function A({rank:e}){let t=ne[e];return t?(0,E.jsxs)(`span`,{className:`pips`,"aria-hidden":`true`,children:[Array.from({length:t.full},(e,t)=>(0,E.jsx)(`i`,{},t)),Array.from({length:t.hollow},(e,t)=>(0,E.jsx)(`i`,{className:`hollow`},`h`+t))]}):null}function j({ship:e,filter:t,picked:n,pickedDept:r,onOpen:i,onDept:a}){return(0,E.jsxs)(`section`,{className:`panel roster-panel`,"aria-labelledby":`roster-title`,children:[(0,E.jsxs)(`div`,{className:`panel-head`,children:[(0,E.jsx)(`h2`,{className:`panel-title`,id:`roster-title`,children:`Duty roster`}),(0,E.jsx)(`span`,{className:`mono panel-meta`,children:`HEAD FIRST · ACTING HEAD WHEN THE HEAD IS OFF DUTY`})]}),(0,E.jsx)(`div`,{className:`roster`,children:S.map(o=>{let s=e.data.stations.stations.filter(e=>e.dept===o.id).sort((e,t)=>Number(!!t.head)-Number(!!e.head)||x[e.rank].order-x[t.rank].order),c=s.filter(t=>t.status===`live`&&!e.off(t)).length,l=e.acting[o.id]===`dark`;return(0,E.jsxs)(`div`,{className:`dept`,style:{"--u":o.uniform},"aria-current":r===o.id,onClick:e=>{e.target.closest(`.member, .dept-name`)||a(o.id)},children:[(0,E.jsxs)(`button`,{type:`button`,className:`dept-name`,onClick:()=>a(o.id),title:`${o.name}: chain of command`,children:[o.name,(0,E.jsx)(`span`,{className:`mono`+(l?` dark`:``),children:l?`DARK · NO ONE TO ACT`:`${c} OF ${s.length} ON DUTY`})]}),(0,E.jsx)(`div`,{className:`members`,children:s.map(r=>{let a=e.off(r),s=`member`+(r.head?` head`:``)+(a?` off`:``)+(r.status===`reserved`?` reserved`:``);return(0,E.jsxs)(`button`,{type:`button`,className:s,"aria-pressed":n===r.id,hidden:t!==`all`&&r.rail!==t,style:{"--c":T(r.rail),"--ls":b[r.status].line},title:`${r.name} · ${x[r.rank].label}${a?` · off duty: ${a}`:``}`,onClick:()=>i(r.id),children:[ne[r.rank]?(0,E.jsx)(A,{rank:r.rank}):(0,E.jsx)(`span`,{className:`dot`}),r.short,e.acting[o.id]===r.id&&(0,E.jsx)(`span`,{className:`acting`,children:`ACTING`}),r.head&&a&&(0,E.jsx)(`span`,{className:`acting`,style:{color:`var(--text-muted)`},children:`OFF`})]},r.id)})})]},o.id)})})]})}function De({ship:e}){return(0,E.jsxs)(`section`,{className:`panel log-panel`,"aria-labelledby":`log-title`,children:[(0,E.jsx)(`div`,{className:`panel-head`,children:(0,E.jsx)(`h2`,{className:`panel-title`,id:`log-title`,children:`Ship's log`})}),(0,E.jsx)(`ol`,{className:`log`,children:e.data.shiplog.entries.map((t,n,r)=>{let i=_e(t.at);return[i!==_e(n?r[n-1].at:e.data.shiplog.asOf)&&(0,E.jsx)(`li`,{className:`log-day mono`,children:i},`day`+i),(0,E.jsxs)(`li`,{children:[(0,E.jsx)(`time`,{dateTime:t.at,children:ge(t.at)}),(0,E.jsx)(`span`,{className:`dot`,style:{"--c":T(e.station(t.station)?.rail??`mixed`)}}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`span`,{className:`log-who`,children:(e.station(t.station)?.short??t.station).toUpperCase()}),t.text]})]},t.at+t.text)]})})]})}var Oe=`<svg class="hull" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2200 1060" aria-hidden="true" font-family="'JetBrains Mono', monospace">
        <defs>
          <radialGradient id="g5neb1" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#1d5a9e" stop-opacity="0.42"></stop><stop offset="0.55" stop-color="#173f73" stop-opacity="0.18"></stop><stop offset="1" stop-color="#0b1a33" stop-opacity="0"></stop></radialGradient>
          <radialGradient id="g5neb2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#3b2f7a" stop-opacity="0.32"></stop><stop offset="0.6" stop-color="#2a2358" stop-opacity="0.12"></stop><stop offset="1" stop-color="#140f2c" stop-opacity="0"></stop></radialGradient>
          <radialGradient id="g5neb3" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#2a7fa8" stop-opacity="0.22"></stop><stop offset="1" stop-color="#0d2b40" stop-opacity="0"></stop></radialGradient>
          <radialGradient id="g5star"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"></stop><stop offset="0.3" stop-color="#cfe0ff" stop-opacity="0.35"></stop><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"></stop></radialGradient>
          <linearGradient id="g5saucer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3cddd"></stop><stop offset="0.1" stop-color="#9aa7bd"></stop><stop offset="0.46" stop-color="#66748e"></stop><stop offset="0.5" stop-color="#4a566d"></stop><stop offset="0.75" stop-color="#323d52"></stop><stop offset="1" stop-color="#1a2232"></stop></linearGradient>
          <linearGradient id="g5dome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4dcea"></stop><stop offset="0.4" stop-color="#9aa7bd"></stop><stop offset="1" stop-color="#5e6b84"></stop></linearGradient>
          <linearGradient id="g5hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a3afc3"></stop><stop offset="0.18" stop-color="#77849c"></stop><stop offset="0.6" stop-color="#3f4a60"></stop><stop offset="1" stop-color="#1a2131"></stop></linearGradient>
          <linearGradient id="g5neck" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a455b"></stop><stop offset="0.55" stop-color="#8794ab"></stop><stop offset="1" stop-color="#4a566d"></stop></linearGradient>
          <linearGradient id="g5pylon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4c586f"></stop><stop offset="0.45" stop-color="#97a4ba"></stop><stop offset="1" stop-color="#3a455b"></stop></linearGradient>
          <linearGradient id="g5pylonfar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2e384b"></stop><stop offset="0.5" stop-color="#5b6880"></stop><stop offset="1" stop-color="#262f40"></stop></linearGradient>
          <linearGradient id="g5nac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d2e0"></stop><stop offset="0.3" stop-color="#8592a9"></stop><stop offset="0.7" stop-color="#4a566d"></stop><stop offset="1" stop-color="#232b3b"></stop></linearGradient>
          <linearGradient id="g5nacfar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d99ae"></stop><stop offset="0.4" stop-color="#5a6780"></stop><stop offset="1" stop-color="#1c2331"></stop></linearGradient>
          <linearGradient id="g5rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8ff" stop-opacity="0.95"></stop><stop offset="0.3" stop-color="#f4f8ff" stop-opacity="0.25"></stop><stop offset="0.5" stop-color="#f4f8ff" stop-opacity="0"></stop></linearGradient>
          <linearGradient id="g5grille" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b4c96"></stop><stop offset="0.28" stop-color="#3fa2ff"></stop><stop offset="0.5" stop-color="#eaf8ff"></stop><stop offset="0.72" stop-color="#3fa2ff"></stop><stop offset="1" stop-color="#1b4c96"></stop></linearGradient>
          <linearGradient id="g5core" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4f8a"></stop><stop offset="0.25" stop-color="#4fa3ff"></stop><stop offset="0.5" stop-color="#e2f4ff"></stop><stop offset="0.75" stop-color="#4fa3ff"></stop><stop offset="1" stop-color="#2a4f8a"></stop></linearGradient>
          <radialGradient id="g5buss" cx="0.42" cy="0.42" r="0.6"><stop offset="0" stop-color="#fff2f5"></stop><stop offset="0.22" stop-color="#ff9ab4"></stop><stop offset="0.55" stop-color="#ff2b58"></stop><stop offset="0.85" stop-color="#a50f30"></stop><stop offset="1" stop-color="#5c0719"></stop></radialGradient>
          <radialGradient id="g5bussglow"><stop offset="0" stop-color="#ff4f74" stop-opacity="0.75"></stop><stop offset="0.45" stop-color="#ff2b58" stop-opacity="0.25"></stop><stop offset="1" stop-color="#ff2b58" stop-opacity="0"></stop></radialGradient>
          <radialGradient id="g5blueglow"><stop offset="0" stop-color="#6cc6ff" stop-opacity="0.7"></stop><stop offset="0.45" stop-color="#3f8fff" stop-opacity="0.22"></stop><stop offset="1" stop-color="#3f8fff" stop-opacity="0"></stop></radialGradient>
          <radialGradient id="g5defl"><stop offset="0" stop-color="#ffffff"></stop><stop offset="0.22" stop-color="#d4f1ff"></stop><stop offset="0.5" stop-color="#55b4ff"></stop><stop offset="0.82" stop-color="#1c54a6"></stop><stop offset="1" stop-color="#0d2448"></stop></radialGradient>
          <radialGradient id="g5imp"><stop offset="0" stop-color="#ffe0cc"></stop><stop offset="0.4" stop-color="#ff5a4a"></stop><stop offset="1" stop-color="#ff3a3a" stop-opacity="0"></stop></radialGradient>
          <pattern id="g5az" width="132" height="60" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="44" height="20" fill="#ffffff" fill-opacity="0.06"></rect><rect x="44" y="0" width="40" height="20" fill="#000000" fill-opacity="0.07"></rect><rect x="84" y="0" width="48" height="20" fill="#ffffff" fill-opacity="0.03"></rect>
            <rect x="0" y="20" width="30" height="20" fill="#000000" fill-opacity="0.06"></rect><rect x="30" y="20" width="56" height="20" fill="#ffffff" fill-opacity="0.07"></rect><rect x="86" y="20" width="46" height="20" fill="#000000" fill-opacity="0.04"></rect>
            <rect x="0" y="40" width="62" height="20" fill="#ffffff" fill-opacity="0.04"></rect><rect x="62" y="40" width="34" height="20" fill="#000000" fill-opacity="0.08"></rect><rect x="96" y="40" width="36" height="20" fill="#ffffff" fill-opacity="0.06"></rect>
            <path d="M0 20H132 M0 40H132 M44 0V20 M84 0V20 M30 20V40 M86 20V40 M62 40V60 M96 40V60" stroke="#0a0f18" stroke-opacity="0.16" stroke-width="1" fill="none"></path>
          </pattern>
          <pattern id="g5holo" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#0b0d08"></rect><path d="M16 0H0V16" fill="none" stroke="#f0c048" stroke-opacity="0.38" stroke-width="1"></path></pattern>
          <pattern id="g5hatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#070c16" fill-opacity="0.9"></rect><rect width="9" height="18" fill="#f0a948" fill-opacity="0.06"></rect></pattern>
          <filter id="g5blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"></feGaussianBlur></filter>
          <filter id="g5soft" x="-20%" y="-80%" width="140%" height="260%"><feGaussianBlur stdDeviation="6"></feGaussianBlur></filter>
          <linearGradient id="g6wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26375a"></stop><stop offset="0.5" stop-color="#172540"></stop><stop offset="1" stop-color="#0c1526"></stop></linearGradient>
          <linearGradient id="g6walloff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a2a"></stop><stop offset="1" stop-color="#080d18"></stop></linearGradient>
          <linearGradient id="g6light" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dbe9ff" stop-opacity="0.16"></stop><stop offset="1" stop-color="#dbe9ff" stop-opacity="0"></stop></linearGradient>
          <linearGradient id="g6bridgewall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3c62"></stop><stop offset="0.45" stop-color="#18264a"></stop><stop offset="1" stop-color="#0b1426"></stop></linearGradient>
          <radialGradient id="g6skyglow" cx="0.5" cy="0" r="1"><stop offset="0" stop-color="#cfe3ff" stop-opacity="0.22"></stop><stop offset="1" stop-color="#cfe3ff" stop-opacity="0"></stop></radialGradient>
          <radialGradient id="g6space" cx="0.3" cy="0.3" r="0.9"><stop offset="0" stop-color="#14254a"></stop><stop offset="1" stop-color="#03060e"></stop></radialGradient>
          <radialGradient id="g6planet" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#7fd0e8"></stop><stop offset="0.45" stop-color="#2f7fae"></stop><stop offset="1" stop-color="#0c2a48"></stop></radialGradient>
          <linearGradient id="g6wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a4f28"></stop><stop offset="0.5" stop-color="#c88d4d"></stop><stop offset="1" stop-color="#7a4f28"></stop></linearGradient>
          <linearGradient id="g6screenwash" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#6cc6ff" stop-opacity="0.16"></stop><stop offset="1" stop-color="#6cc6ff" stop-opacity="0"></stop></linearGradient>
          <linearGradient id="g6beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ff" stop-opacity="0"></stop><stop offset="0.6" stop-color="#9fd0ff" stop-opacity="0.18"></stop><stop offset="1" stop-color="#cfe9ff" stop-opacity="0.5"></stop></linearGradient>
          <clipPath id="g6scr"><rect x="1602" y="52" width="174" height="64" rx="4"></rect></clipPath>
          <pattern id="g6struct" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#121a29"></rect><path d="M0 0L40 40 M40 0L0 40" stroke="#222d42" stroke-width="2"></path><path d="M0 0H40V40" fill="none" stroke="#2a3549" stroke-width="2"></path><circle cx="4" cy="4" r="1.3" fill="#3d4a62"></circle><circle cx="36" cy="4" r="1.3" fill="#3d4a62"></circle></pattern>
        </defs>

        <ellipse cx="380" cy="820" rx="620" ry="330" fill="url(#g5neb1)"></ellipse>
        <ellipse cx="1900" cy="170" rx="560" ry="260" fill="url(#g5neb2)"></ellipse>
        <ellipse cx="1180" cy="520" rx="900" ry="420" fill="url(#g5neb3)"></ellipse>
        <ellipse cx="1820" cy="900" rx="520" ry="240" fill="url(#g5neb1)" opacity="0.6"></ellipse>
        <g>
<circle cx="1944" cy="704" r="0.9" fill="#cfe0ff" opacity="0.28"></circle>
<circle cx="824" cy="591" r="1.6" fill="#ffffff" opacity="0.34"></circle>
<circle cx="234" cy="570" r="0.6" fill="#cfe0ff" opacity="0.63"></circle>
<circle cx="166" cy="412" r="1.3" fill="#fff1dc" opacity="0.23"></circle>
<circle cx="859" cy="514" r="1.1" fill="#cfe0ff" opacity="0.74"></circle>
<circle cx="198" cy="122" r="0.8" fill="#dfe9ff" opacity="0.22"></circle>
<circle cx="193" cy="922" r="1.1" fill="#ffffff" opacity="0.65"></circle>
<circle cx="1814" cy="492" r="1.1" fill="#ffffff" opacity="0.7"></circle>
<circle cx="673" cy="964" r="1.6" fill="#ffffff" opacity="0.61"></circle>
<circle cx="1712" cy="704" r="0.9" fill="#fff1dc" opacity="0.31"></circle>
<circle cx="559" cy="560" r="0.8" fill="#fff1dc" opacity="0.52"></circle>
<circle cx="2108" cy="830" r="0.8" fill="#ffffff" opacity="0.44"></circle>
<circle cx="504" cy="29" r="0.9" fill="#dfe9ff" opacity="0.22"></circle>
<circle cx="1472" cy="891" r="1.6" fill="#ffffff" opacity="0.58"></circle>
<circle cx="79" cy="403" r="1.3" fill="#ffffff" opacity="0.31"></circle>
<circle cx="172" cy="904" r="1.1" fill="#ffffff" opacity="0.5"></circle>
<circle cx="1925" cy="51" r="0.9" fill="#fff1dc" opacity="0.47"></circle>
<circle cx="993" cy="322" r="1.3" fill="#cfe0ff" opacity="0.68"></circle>
<circle cx="736" cy="482" r="0.8" fill="#ffffff" opacity="0.83"></circle>
<circle cx="605" cy="282" r="1.6" fill="#fff1dc" opacity="0.37"></circle>
<circle cx="227" cy="128" r="0.8" fill="#ffffff" opacity="0.71"></circle>
<circle cx="546" cy="703" r="1.1" fill="#ffffff" opacity="0.42"></circle>
<circle cx="1787" cy="780" r="0.8" fill="#dfe9ff" opacity="0.21"></circle>
<circle cx="1356" cy="107" r="1.3" fill="#dfe9ff" opacity="0.26"></circle>
<circle cx="266" cy="197" r="0.9" fill="#ffffff" opacity="0.4"></circle>
<circle cx="1792" cy="241" r="1.6" fill="#dfe9ff" opacity="0.74"></circle>
<circle cx="115" cy="285" r="1.3" fill="#ffffff" opacity="0.69"></circle>
<circle cx="1326" cy="910" r="0.6" fill="#cfe0ff" opacity="0.48"></circle>
<circle cx="1304" cy="622" r="0.8" fill="#ffffff" opacity="0.74"></circle>
<circle cx="2162" cy="853" r="1.1" fill="#cfe0ff" opacity="0.69"></circle>
<circle cx="1353" cy="516" r="0.8" fill="#dfe9ff" opacity="0.81"></circle>
<circle cx="148" cy="312" r="0.8" fill="#cfe0ff" opacity="0.56"></circle>
<circle cx="1575" cy="624" r="1.1" fill="#dfe9ff" opacity="0.74"></circle>
<circle cx="450" cy="939" r="0.9" fill="#ffffff" opacity="0.29"></circle>
<circle cx="1083" cy="561" r="0.9" fill="#ffffff" opacity="0.28"></circle>
<circle cx="586" cy="815" r="0.8" fill="#dfe9ff" opacity="0.77"></circle>
<circle cx="2087" cy="81" r="0.8" fill="#dfe9ff" opacity="0.49"></circle>
<circle cx="1590" cy="514" r="0.9" fill="#fff1dc" opacity="0.28"></circle>
<circle cx="1033" cy="1046" r="0.6" fill="#ffffff" opacity="0.43"></circle>
<circle cx="848" cy="839" r="1.6" fill="#dfe9ff" opacity="0.33"></circle>
<circle cx="703" cy="750" r="1.6" fill="#ffffff" opacity="0.69"></circle>
<circle cx="1141" cy="395" r="1.3" fill="#cfe0ff" opacity="0.79"></circle>
<circle cx="658" cy="967" r="0.6" fill="#fff1dc" opacity="0.55"></circle>
<circle cx="1456" cy="213" r="0.8" fill="#ffffff" opacity="0.73"></circle>
<circle cx="1878" cy="913" r="1.1" fill="#cfe0ff" opacity="0.38"></circle>
<circle cx="1847" cy="300" r="0.9" fill="#fff1dc" opacity="0.38"></circle>
<circle cx="2175" cy="380" r="0.6" fill="#fff1dc" opacity="0.49"></circle>
<circle cx="222" cy="400" r="0.8" fill="#ffffff" opacity="0.4"></circle>
<circle cx="622" cy="927" r="1.3" fill="#ffffff" opacity="0.21"></circle>
<circle cx="1663" cy="567" r="0.9" fill="#fff1dc" opacity="0.81"></circle>
<circle cx="1928" cy="947" r="1.1" fill="#ffffff" opacity="0.68"></circle>
<circle cx="723" cy="289" r="0.6" fill="#cfe0ff" opacity="0.41"></circle>
<circle cx="1003" cy="446" r="1.3" fill="#dfe9ff" opacity="0.69"></circle>
<circle cx="666" cy="782" r="1.1" fill="#dfe9ff" opacity="0.56"></circle>
<circle cx="2174" cy="736" r="0.9" fill="#dfe9ff" opacity="0.54"></circle>
<circle cx="2070" cy="726" r="1.3" fill="#cfe0ff" opacity="0.39"></circle>
<circle cx="1107" cy="718" r="0.8" fill="#fff1dc" opacity="0.24"></circle>
<circle cx="1000" cy="377" r="0.9" fill="#dfe9ff" opacity="0.35"></circle>
<circle cx="1747" cy="20" r="0.9" fill="#fff1dc" opacity="0.48"></circle>
<circle cx="116" cy="644" r="1.1" fill="#fff1dc" opacity="0.38"></circle>
<circle cx="290" cy="927" r="1.1" fill="#ffffff" opacity="0.75"></circle>
<circle cx="1467" cy="429" r="1.6" fill="#ffffff" opacity="0.32"></circle>
<circle cx="486" cy="862" r="0.8" fill="#fff1dc" opacity="0.81"></circle>
<circle cx="1629" cy="244" r="0.9" fill="#ffffff" opacity="0.65"></circle>
<circle cx="78" cy="714" r="1.6" fill="#fff1dc" opacity="0.46"></circle>
<circle cx="1239" cy="428" r="1.6" fill="#dfe9ff" opacity="0.57"></circle>
<circle cx="2144" cy="33" r="1.1" fill="#ffffff" opacity="0.3"></circle>
<circle cx="443" cy="929" r="1.3" fill="#ffffff" opacity="0.47"></circle>
<circle cx="462" cy="543" r="0.6" fill="#dfe9ff" opacity="0.73"></circle>
<circle cx="1549" cy="845" r="1.6" fill="#cfe0ff" opacity="0.36"></circle>
<circle cx="771" cy="237" r="1.6" fill="#ffffff" opacity="0.25"></circle>
<circle cx="1881" cy="470" r="0.9" fill="#dfe9ff" opacity="0.23"></circle>
<circle cx="2084" cy="917" r="0.9" fill="#ffffff" opacity="0.77"></circle>
<circle cx="2192" cy="633" r="0.8" fill="#ffffff" opacity="0.66"></circle>
<circle cx="2042" cy="869" r="1.3" fill="#dfe9ff" opacity="0.27"></circle>
<circle cx="1433" cy="938" r="1.1" fill="#ffffff" opacity="0.69"></circle>
<circle cx="1348" cy="410" r="1.3" fill="#fff1dc" opacity="0.55"></circle>
<circle cx="2077" cy="377" r="0.8" fill="#ffffff" opacity="0.6"></circle>
<circle cx="1519" cy="10" r="0.9" fill="#ffffff" opacity="0.26"></circle>
<circle cx="2125" cy="447" r="1.1" fill="#ffffff" opacity="0.81"></circle>
<circle cx="381" cy="340" r="0.6" fill="#fff1dc" opacity="0.7"></circle>
<circle cx="1990" cy="151" r="0.8" fill="#ffffff" opacity="0.49"></circle>
<circle cx="1644" cy="633" r="1.6" fill="#cfe0ff" opacity="0.4"></circle>
<circle cx="499" cy="587" r="0.8" fill="#ffffff" opacity="0.46"></circle>
<circle cx="384" cy="176" r="1.3" fill="#dfe9ff" opacity="0.25"></circle>
<circle cx="1509" cy="628" r="1.1" fill="#fff1dc" opacity="0.74"></circle>
<circle cx="1878" cy="979" r="0.8" fill="#cfe0ff" opacity="0.32"></circle>
<circle cx="2057" cy="349" r="1.6" fill="#ffffff" opacity="0.56"></circle>
<circle cx="1342" cy="232" r="1.1" fill="#ffffff" opacity="0.4"></circle>
<circle cx="1143" cy="172" r="1.3" fill="#fff1dc" opacity="0.77"></circle>
<circle cx="52" cy="99" r="0.6" fill="#dfe9ff" opacity="0.59"></circle>
<circle cx="2042" cy="428" r="0.6" fill="#ffffff" opacity="0.66"></circle>
<circle cx="593" cy="632" r="1.1" fill="#cfe0ff" opacity="0.41"></circle>
<circle cx="876" cy="753" r="0.6" fill="#dfe9ff" opacity="0.43"></circle>
<circle cx="515" cy="593" r="1.3" fill="#dfe9ff" opacity="0.77"></circle>
<circle cx="1354" cy="662" r="0.8" fill="#cfe0ff" opacity="0.42"></circle>
<circle cx="1135" cy="172" r="0.9" fill="#cfe0ff" opacity="0.62"></circle>
<circle cx="1797" cy="293" r="1.6" fill="#ffffff" opacity="0.76"></circle>
<circle cx="1862" cy="746" r="1.3" fill="#dfe9ff" opacity="0.61"></circle>
<circle cx="1946" cy="200" r="1.6" fill="#ffffff" opacity="0.56"></circle>
<circle cx="492" cy="368" r="1.6" fill="#ffffff" opacity="0.28"></circle>
<circle cx="363" cy="885" r="1.6" fill="#dfe9ff" opacity="0.25"></circle>
<circle cx="736" cy="197" r="0.9" fill="#cfe0ff" opacity="0.72"></circle>
<circle cx="1169" cy="770" r="0.8" fill="#cfe0ff" opacity="0.5"></circle>
<circle cx="1395" cy="660" r="1.3" fill="#dfe9ff" opacity="0.42"></circle>
<circle cx="1389" cy="756" r="1.3" fill="#ffffff" opacity="0.49"></circle>
<circle cx="1461" cy="64" r="0.9" fill="#cfe0ff" opacity="0.54"></circle>
<circle cx="718" cy="742" r="1.1" fill="#ffffff" opacity="0.62"></circle>
<circle cx="931" cy="85" r="1.1" fill="#ffffff" opacity="0.25"></circle>
<circle cx="1608" cy="558" r="1.1" fill="#cfe0ff" opacity="0.32"></circle>
<circle cx="1532" cy="988" r="1.1" fill="#cfe0ff" opacity="0.34"></circle>
<circle cx="1588" cy="901" r="0.9" fill="#ffffff" opacity="0.61"></circle>
<circle cx="1695" cy="789" r="0.8" fill="#ffffff" opacity="0.66"></circle>
<circle cx="1015" cy="440" r="1.3" fill="#ffffff" opacity="0.43"></circle>
<circle cx="530" cy="1002" r="0.9" fill="#cfe0ff" opacity="0.32"></circle>
<circle cx="1103" cy="568" r="1.3" fill="#dfe9ff" opacity="0.46"></circle>
<circle cx="1832" cy="667" r="0.8" fill="#dfe9ff" opacity="0.37"></circle>
<circle cx="292" cy="866" r="1.6" fill="#dfe9ff" opacity="0.68"></circle>
<circle cx="1312" cy="959" r="1.1" fill="#cfe0ff" opacity="0.27"></circle>
<circle cx="1315" cy="800" r="1.3" fill="#ffffff" opacity="0.81"></circle>
<circle cx="554" cy="544" r="0.9" fill="#fff1dc" opacity="0.37"></circle>
<circle cx="1838" cy="296" r="0.9" fill="#ffffff" opacity="0.2"></circle>
<circle cx="1531" cy="421" r="0.8" fill="#ffffff" opacity="0.71"></circle>
<circle cx="1533" cy="714" r="1.3" fill="#ffffff" opacity="0.77"></circle>
<circle cx="582" cy="426" r="1.6" fill="#ffffff" opacity="0.27"></circle>
<circle cx="741" cy="880" r="1.1" fill="#dfe9ff" opacity="0.67"></circle>
<circle cx="233" cy="298" r="1.3" fill="#cfe0ff" opacity="0.49"></circle>
<circle cx="730" cy="399" r="1.3" fill="#dfe9ff" opacity="0.42"></circle>
<circle cx="1435" cy="19" r="1.6" fill="#dfe9ff" opacity="0.46"></circle>
<circle cx="1582" cy="505" r="0.8" fill="#cfe0ff" opacity="0.64"></circle>
<circle cx="1832" cy="341" r="0.6" fill="#ffffff" opacity="0.77"></circle>
<circle cx="585" cy="837" r="1.1" fill="#dfe9ff" opacity="0.53"></circle>
<circle cx="2081" cy="60" r="0.8" fill="#cfe0ff" opacity="0.51"></circle>
<circle cx="1592" cy="916" r="0.6" fill="#dfe9ff" opacity="0.52"></circle>
<circle cx="1452" cy="457" r="0.6" fill="#cfe0ff" opacity="0.32"></circle>
<circle cx="580" cy="632" r="1.1" fill="#ffffff" opacity="0.8"></circle>
<circle cx="1540" cy="654" r="1.1" fill="#ffffff" opacity="0.7"></circle>
<circle cx="1110" cy="602" r="0.6" fill="#cfe0ff" opacity="0.64"></circle>
<circle cx="875" cy="792" r="1.3" fill="#ffffff" opacity="0.43"></circle>
<circle cx="1574" cy="903" r="1.3" fill="#ffffff" opacity="0.2"></circle>
<circle cx="1883" cy="601" r="0.9" fill="#dfe9ff" opacity="0.75"></circle>
<circle cx="496" cy="343" r="1.1" fill="#ffffff" opacity="0.21"></circle>
<circle cx="832" cy="371" r="0.9" fill="#fff1dc" opacity="0.23"></circle>
<circle cx="1738" cy="126" r="0.8" fill="#cfe0ff" opacity="0.27"></circle>
<circle cx="626" cy="127" r="1.3" fill="#dfe9ff" opacity="0.41"></circle>
<circle cx="2129" cy="976" r="0.9" fill="#cfe0ff" opacity="0.24"></circle>
<circle cx="260" cy="493" r="1.3" fill="#ffffff" opacity="0.28"></circle>
<circle cx="1951" cy="265" r="1.6" fill="#ffffff" opacity="0.85"></circle>
<circle cx="1929" cy="468" r="0.6" fill="#ffffff" opacity="0.24"></circle>
<circle cx="1277" cy="23" r="0.6" fill="#ffffff" opacity="0.45"></circle>
<circle cx="1669" cy="476" r="1.1" fill="#ffffff" opacity="0.81"></circle>
<circle cx="854" cy="791" r="1.6" fill="#fff1dc" opacity="0.53"></circle>
<circle cx="1797" cy="1015" r="1.1" fill="#cfe0ff" opacity="0.77"></circle>
<circle cx="156" cy="758" r="1.6" fill="#fff1dc" opacity="0.71"></circle>
<circle cx="1249" cy="939" r="1.6" fill="#ffffff" opacity="0.63"></circle>
<circle cx="807" cy="39" r="1.1" fill="#cfe0ff" opacity="0.68"></circle>
<circle cx="2196" cy="571" r="1.6" fill="#ffffff" opacity="0.39"></circle>
<circle cx="690" cy="833" r="1.6" fill="#ffffff" opacity="0.29"></circle>
<circle cx="1404" cy="727" r="0.8" fill="#dfe9ff" opacity="0.51"></circle>
<circle cx="1529" cy="927" r="1.6" fill="#cfe0ff" opacity="0.33"></circle>
<circle cx="123" cy="752" r="1.1" fill="#cfe0ff" opacity="0.24"></circle>
<circle cx="1767" cy="195" r="1.6" fill="#fff1dc" opacity="0.36"></circle>
<circle cx="673" cy="253" r="0.9" fill="#ffffff" opacity="0.57"></circle>
<circle cx="600" cy="1014" r="1.1" fill="#cfe0ff" opacity="0.52"></circle>
<circle cx="33" cy="565" r="0.8" fill="#ffffff" opacity="0.81"></circle>
<circle cx="806" cy="139" r="1.6" fill="#fff1dc" opacity="0.35"></circle>
<circle cx="541" cy="220" r="0.8" fill="#fff1dc" opacity="0.49"></circle>
<circle cx="278" cy="8" r="0.9" fill="#ffffff" opacity="0.61"></circle>
<circle cx="159" cy="325" r="1.1" fill="#ffffff" opacity="0.67"></circle>
<circle cx="1537" cy="1057" r="0.9" fill="#cfe0ff" opacity="0.63"></circle>
<circle cx="822" cy="949" r="0.6" fill="#dfe9ff" opacity="0.3"></circle>
<circle cx="839" cy="769" r="1.3" fill="#dfe9ff" opacity="0.77"></circle>
<circle cx="320" cy="681" r="0.9" fill="#ffffff" opacity="0.35"></circle>
<circle cx="1691" cy="442" r="0.9" fill="#ffffff" opacity="0.46"></circle>
<circle cx="318" cy="477" r="1.1" fill="#ffffff" opacity="0.23"></circle>
<circle cx="157" cy="929" r="1.6" fill="#cfe0ff" opacity="0.23"></circle>
<circle cx="1097" cy="780" r="1.3" fill="#fff1dc" opacity="0.62"></circle>
<circle cx="2129" cy="324" r="0.9" fill="#ffffff" opacity="0.78"></circle>
<circle cx="907" cy="145" r="1.1" fill="#cfe0ff" opacity="0.32"></circle>
<circle cx="211" cy="472" r="1.1" fill="#cfe0ff" opacity="0.57"></circle>
<circle cx="875" cy="218" r="0.6" fill="#cfe0ff" opacity="0.31"></circle>
<circle cx="544" cy="449" r="0.8" fill="#ffffff" opacity="0.2"></circle>
<circle cx="285" cy="663" r="0.9" fill="#ffffff" opacity="0.42"></circle>
<circle cx="1140" cy="426" r="0.6" fill="#cfe0ff" opacity="0.56"></circle>
<circle cx="260" cy="595" r="1.6" fill="#ffffff" opacity="0.77"></circle>
<circle cx="321" cy="352" r="0.9" fill="#dfe9ff" opacity="0.62"></circle>
<circle cx="1152" cy="246" r="1.3" fill="#ffffff" opacity="0.79"></circle>
<circle cx="2082" cy="548" r="0.9" fill="#cfe0ff" opacity="0.48"></circle>
<circle cx="79" cy="264" r="0.8" fill="#fff1dc" opacity="0.54"></circle>
<circle cx="860" cy="457" r="1.1" fill="#cfe0ff" opacity="0.3"></circle>
<circle cx="177" cy="129" r="1.3" fill="#fff1dc" opacity="0.55"></circle>
<circle cx="1284" cy="764" r="0.6" fill="#ffffff" opacity="0.8"></circle>
<circle cx="1926" cy="407" r="1.1" fill="#cfe0ff" opacity="0.65"></circle>
<circle cx="223" cy="921" r="0.6" fill="#fff1dc" opacity="0.71"></circle>
<circle cx="1486" cy="347" r="1.6" fill="#ffffff" opacity="0.63"></circle>
<circle cx="533" cy="787" r="1.1" fill="#fff1dc" opacity="0.29"></circle>
<circle cx="1076" cy="278" r="0.9" fill="#fff1dc" opacity="0.67"></circle>
<circle cx="1575" cy="791" r="0.6" fill="#dfe9ff" opacity="0.64"></circle>
<circle cx="131" cy="974" r="1.1" fill="#ffffff" opacity="0.4"></circle>
<circle cx="1829" cy="911" r="1.3" fill="#ffffff" opacity="0.58"></circle>
<circle cx="1083" cy="214" r="1.1" fill="#fff1dc" opacity="0.81"></circle>
<circle cx="238" cy="375" r="1.3" fill="#ffffff" opacity="0.54"></circle>
<circle cx="2080" cy="190" r="0.8" fill="#dfe9ff" opacity="0.44"></circle>
<circle cx="932" cy="240" r="0.9" fill="#fff1dc" opacity="0.62"></circle>
<circle cx="2005" cy="328" r="1.6" fill="#ffffff" opacity="0.85"></circle>
<circle cx="2032" cy="808" r="0.9" fill="#fff1dc" opacity="0.4"></circle>
<circle cx="841" cy="1058" r="1.1" fill="#ffffff" opacity="0.82"></circle>
<circle cx="326" cy="50" r="1.3" fill="#fff1dc" opacity="0.47"></circle>
<circle cx="1805" cy="465" r="1.1" fill="#dfe9ff" opacity="0.57"></circle>
<circle cx="1602" cy="92" r="1.1" fill="#dfe9ff" opacity="0.65"></circle>
<circle cx="1018" cy="164" r="1.1" fill="#dfe9ff" opacity="0.79"></circle>
<circle cx="827" cy="42" r="1.1" fill="#fff1dc" opacity="0.54"></circle>
<circle cx="207" cy="356" r="1.6" fill="#dfe9ff" opacity="0.44"></circle>
<circle cx="1537" cy="929" r="0.8" fill="#dfe9ff" opacity="0.22"></circle>
<circle cx="1999" cy="987" r="1.6" fill="#ffffff" opacity="0.52"></circle>
<circle cx="1192" cy="1042" r="0.9" fill="#fff1dc" opacity="0.35"></circle>
<circle cx="127" cy="810" r="0.6" fill="#dfe9ff" opacity="0.51"></circle>
<circle cx="1317" cy="414" r="0.6" fill="#ffffff" opacity="0.64"></circle>
<circle cx="2164" cy="232" r="0.6" fill="#ffffff" opacity="0.31"></circle>
<circle cx="1888" cy="443" r="1.3" fill="#fff1dc" opacity="0.45"></circle>
<circle cx="415" cy="88" r="1.3" fill="#dfe9ff" opacity="0.45"></circle>
<circle cx="1377" cy="965" r="1.6" fill="#fff1dc" opacity="0.36"></circle>
<circle cx="673" cy="322" r="0.6" fill="#dfe9ff" opacity="0.76"></circle>
<circle cx="713" cy="890" r="0.6" fill="#cfe0ff" opacity="0.72"></circle>
<circle cx="362" cy="136" r="0.6" fill="#fff1dc" opacity="0.25"></circle>
<circle cx="1367" cy="993" r="1.1" fill="#cfe0ff" opacity="0.43"></circle>
<circle cx="411" cy="464" r="0.6" fill="#ffffff" opacity="0.83"></circle>
<circle cx="1148" cy="492" r="0.8" fill="#fff1dc" opacity="0.68"></circle>
<circle cx="648" cy="724" r="0.9" fill="#cfe0ff" opacity="0.68"></circle>
<circle cx="999" cy="764" r="0.9" fill="#cfe0ff" opacity="0.63"></circle>
<circle cx="1835" cy="325" r="0.8" fill="#cfe0ff" opacity="0.65"></circle>
<circle cx="1296" cy="902" r="1.6" fill="#cfe0ff" opacity="0.46"></circle>
<circle cx="652" cy="267" r="0.8" fill="#fff1dc" opacity="0.67"></circle>
<circle cx="636" cy="75" r="1.6" fill="#ffffff" opacity="0.33"></circle>
<circle cx="39" cy="520" r="0.8" fill="#dfe9ff" opacity="0.34"></circle>
<circle cx="399" cy="470" r="0.9" fill="#fff1dc" opacity="0.66"></circle>
<circle cx="407" cy="520" r="0.9" fill="#cfe0ff" opacity="0.53"></circle>
<circle cx="2194" cy="114" r="1.1" fill="#cfe0ff" opacity="0.74"></circle>
<circle cx="188" cy="335" r="0.9" fill="#fff1dc" opacity="0.8"></circle>
<circle cx="1640" cy="79" r="1.1" fill="#dfe9ff" opacity="0.41"></circle>
<circle cx="1329" cy="1042" r="1.1" fill="#fff1dc" opacity="0.49"></circle>
<circle cx="100" cy="298" r="0.8" fill="#cfe0ff" opacity="0.54"></circle>
<circle cx="174" cy="926" r="0.8" fill="#ffffff" opacity="0.21"></circle>
<circle cx="2012" cy="202" r="1.6" fill="#ffffff" opacity="0.53"></circle>
<circle cx="560" cy="164" r="0.6" fill="#dfe9ff" opacity="0.81"></circle>
<circle cx="1345" cy="547" r="0.8" fill="#dfe9ff" opacity="0.24"></circle>
<circle cx="1544" cy="132" r="0.9" fill="#ffffff" opacity="0.22"></circle>
<circle cx="1801" cy="881" r="1.6" fill="#ffffff" opacity="0.36"></circle>
<circle cx="1875" cy="162" r="0.9" fill="#fff1dc" opacity="0.58"></circle>
<circle cx="1738" cy="455" r="0.6" fill="#dfe9ff" opacity="0.44"></circle>
<circle cx="161" cy="694" r="0.6" fill="#cfe0ff" opacity="0.43"></circle>
<circle cx="1122" cy="123" r="0.8" fill="#ffffff" opacity="0.68"></circle>
<circle cx="993" cy="117" r="0.6" fill="#ffffff" opacity="0.52"></circle>
<circle cx="2109" cy="235" r="1.6" fill="#fff1dc" opacity="0.59"></circle>
<circle cx="488" cy="105" r="1.3" fill="#ffffff" opacity="0.58"></circle>
<circle cx="2160" cy="378" r="0.6" fill="#cfe0ff" opacity="0.25"></circle>
<circle cx="994" cy="530" r="0.8" fill="#dfe9ff" opacity="0.63"></circle>
<circle cx="1963" cy="86" r="0.9" fill="#ffffff" opacity="0.68"></circle>
<circle cx="1864" cy="644" r="0.8" fill="#ffffff" opacity="0.42"></circle>
<circle cx="1686" cy="185" r="0.6" fill="#dfe9ff" opacity="0.25"></circle>
        </g>
        <g>
<g transform="translate(150 560)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
<g transform="translate(880 70)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
<g transform="translate(2080 90)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
<g transform="translate(1980 700)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
<g transform="translate(640 1010)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
<g transform="translate(330 240)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
<g transform="translate(2140 960)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
<g transform="translate(1140 140)"><circle r="9" fill="url(#g5star)"></circle><path d="M-9 0H9 M0 -9V9" stroke="#ffffff" stroke-width="0.8" opacity="0.6"></path><circle r="1.6" fill="#ffffff"></circle></g>
        </g>
        <text x="40" y="44" font-size="12" letter-spacing="2.4" fill="#7f9cc8">MSD 02 · CUTAWAY UNDER THE HULL · NOT TO SCALE</text>
        <text x="2170" y="30" font-size="12" letter-spacing="2.4" fill="#7f9cc8" text-anchor="end">◂ STERN · BOW ▸</text>

        <path d="M214 396 L276 396 C330 500 440 620 556 700 L470 700 C380 620 280 500 214 396 Z" fill="url(#g5pylonfar)" stroke="#0b111c" stroke-width="1.5"></path>
        <path d="M46 377 C46 365 58 356 82 354 L560 349 C608 348 640 358 648 372 C652 386 638 398 600 401 L88 403 C62 402 46 391 46 377 Z" fill="url(#g5nacfar)" stroke="#0b111c" stroke-width="1.5"></path>
<path d="M583 352.0 A7.0 24 0 0 1 583 400.0 L590 400.0 A7.0 24 0 0 0 590 352.0 Z" fill="url(#g7collarfar)"></path>
<path d="M583 352.0 A7.0 24 0 0 1 583 400.0" fill="none" stroke="#0b111c" stroke-opacity="0.7" stroke-width="1.4"></path>
<path d="M584.5 354.0 A7.0 22 0 0 1 584.5 398.0" fill="none" stroke="#f4f8ff" stroke-opacity="0.35" stroke-width="1"></path>
        <path d="M90 356 L560 351" stroke="#e889b6" stroke-width="3" stroke-linecap="round" opacity="0.75"></path>
        <g style="opacity: var(--claude-glow)">
          <rect x="100" y="362" width="456" height="30" rx="10" fill="#3f9cff" opacity="0.6" filter="url(#g5soft)"></rect>
          <rect x="100" y="362" width="456" height="30" rx="9" fill="url(#g5grille)"></rect>
          <path d="M104 364V390 M115 364V390 M126 364V390 M137 364V390 M148 364V390 M159 364V390 M170 364V390 M181 364V390 M192 364V390 M203 364V390 M214 364V390 M225 364V390 M236 364V390 M247 364V390 M258 364V390 M269 364V390 M280 364V390 M291 364V390 M302 364V390 M313 364V390 M324 364V390 M335 364V390 M346 364V390 M357 364V390 M368 364V390 M379 364V390 M390 364V390 M401 364V390 M412 364V390 M423 364V390 M434 364V390 M445 364V390 M456 364V390 M467 364V390 M478 364V390 M489 364V390 M500 364V390 M511 364V390 M522 364V390 M533 364V390 M544 364V390" stroke="#0d2a55" stroke-width="1.2" opacity="0.45"></path>
          <ellipse cx="636" cy="376" rx="70" ry="54" fill="url(#g5bussglow)"></ellipse>
<defs><clipPath id="g7bclipf"><path d="M590 352.0 A62 24 0 0 1 652 376.0 A62 24 0 0 1 590 400.0 A7.0 24 0 0 0 590 352.0 Z"></path></clipPath></defs>
<path class="core" d="M590 352.0 A62 24 0 0 1 652 376.0 A62 24 0 0 1 590 400.0 A7.0 24 0 0 0 590 352.0 Z" fill="url(#g7buss)"></path>
<g clip-path="url(#g7bclipf)">
<path d="M590 352.0 A62 24 0 0 1 652 376.0 A62 24 0 0 1 590 400.0 A7.0 24 0 0 0 590 352.0 Z" fill="url(#g7bussshade)"></path>
<path d="M593.5 355.2 L596.1 355.2 L598.6 355.3 L601.2 355.4 L603.8 355.5 L606.3 355.7 L608.9 355.9 L611.4 356.1 L613.9 356.4 L616.5 356.7 L619.0 357.1 L621.5 357.5 L624.0 358.0 L626.5 358.5 L629.0 359.1 L631.5 359.8 L633.9 360.5 L636.4 361.3 L638.8 362.3 L641.2 363.3 L643.6 364.5 L645.9 365.9 L648.2 367.7 L650.4 370.1 L652.0 376.0 M596.0 364.0 L598.6 364.0 L601.2 364.0 L603.7 364.1 L606.3 364.2 L608.8 364.3 L611.3 364.4 L613.8 364.5 L616.3 364.7 L618.8 364.9 L621.3 365.1 L623.8 365.3 L626.2 365.6 L628.7 365.9 L631.1 366.3 L633.5 366.6 L635.8 367.1 L638.2 367.5 L640.5 368.1 L642.8 368.7 L645.0 369.4 L647.2 370.2 L649.2 371.2 L651.1 372.6 L652.0 376.0 M597.0 376.0 L599.5 376.0 L602.1 376.0 L604.7 376.0 L607.2 376.0 L609.7 376.0 L612.2 376.0 L614.7 376.0 L617.2 376.0 L619.7 376.0 L622.2 376.0 L624.6 376.0 L627.0 376.0 L629.4 376.0 L631.8 376.0 L634.2 376.0 L636.5 376.0 L638.8 376.0 L641.1 376.0 L643.3 376.0 L645.5 376.0 L647.6 376.0 L649.6 376.0 L651.4 376.0 L652.0 376.0 M596.0 388.0 L598.6 388.0 L601.2 388.0 L603.7 387.9 L606.3 387.8 L608.8 387.7 L611.3 387.6 L613.8 387.5 L616.3 387.3 L618.8 387.1 L621.3 386.9 L623.8 386.7 L626.2 386.4 L628.7 386.1 L631.1 385.7 L633.5 385.4 L635.8 384.9 L638.2 384.5 L640.5 383.9 L642.8 383.3 L645.0 382.6 L647.2 381.8 L649.2 380.8 L651.1 379.4 L652.0 376.0 M593.5 396.8 L596.1 396.8 L598.6 396.7 L601.2 396.6 L603.8 396.5 L606.3 396.3 L608.9 396.1 L611.4 395.9 L613.9 395.6 L616.5 395.3 L619.0 394.9 L621.5 394.5 L624.0 394.0 L626.5 393.5 L629.0 392.9 L631.5 392.2 L633.9 391.5 L636.4 390.7 L638.8 389.7 L641.2 388.7 L643.6 387.5 L645.9 386.1 L648.2 384.3 L650.4 381.9 L652.0 376.0 M616.0 354.2 A6.3 21.8 0 0 1 616.0 397.8 M638.4 361.0 A4.4 15.0 0 0 1 638.4 391.0" fill="none" stroke="#5c0719" stroke-opacity="0.32" stroke-width="1"></path>
<path d="M593.5 355.2 L596.1 355.2 L598.6 355.3 L601.2 355.4 L603.8 355.5 L606.3 355.7 L608.9 355.9 L611.4 356.1 L613.9 356.4 L616.5 356.7 L619.0 357.1 L621.5 357.5 L624.0 358.0 L626.5 358.5 L629.0 359.1 L631.5 359.8 L633.9 360.5 L636.4 361.3 L638.8 362.3 L641.2 363.3 L643.6 364.5 L645.9 365.9 L648.2 367.7 L650.4 370.1 L652.0 376.0 M596.0 364.0 L598.6 364.0 L601.2 364.0 L603.7 364.1 L606.3 364.2 L608.8 364.3 L611.3 364.4 L613.8 364.5 L616.3 364.7 L618.8 364.9 L621.3 365.1 L623.8 365.3 L626.2 365.6 L628.7 365.9 L631.1 366.3 L633.5 366.6 L635.8 367.1 L638.2 367.5 L640.5 368.1 L642.8 368.7 L645.0 369.4 L647.2 370.2 L649.2 371.2 L651.1 372.6 L652.0 376.0 M597.0 376.0 L599.5 376.0 L602.1 376.0 L604.7 376.0 L607.2 376.0 L609.7 376.0 L612.2 376.0 L614.7 376.0 L617.2 376.0 L619.7 376.0 L622.2 376.0 L624.6 376.0 L627.0 376.0 L629.4 376.0 L631.8 376.0 L634.2 376.0 L636.5 376.0 L638.8 376.0 L641.1 376.0 L643.3 376.0 L645.5 376.0 L647.6 376.0 L649.6 376.0 L651.4 376.0 L652.0 376.0 M596.0 388.0 L598.6 388.0 L601.2 388.0 L603.7 387.9 L606.3 387.8 L608.8 387.7 L611.3 387.6 L613.8 387.5 L616.3 387.3 L618.8 387.1 L621.3 386.9 L623.8 386.7 L626.2 386.4 L628.7 386.1 L631.1 385.7 L633.5 385.4 L635.8 384.9 L638.2 384.5 L640.5 383.9 L642.8 383.3 L645.0 382.6 L647.2 381.8 L649.2 380.8 L651.1 379.4 L652.0 376.0 M593.5 396.8 L596.1 396.8 L598.6 396.7 L601.2 396.6 L603.8 396.5 L606.3 396.3 L608.9 396.1 L611.4 395.9 L613.9 395.6 L616.5 395.3 L619.0 394.9 L621.5 394.5 L624.0 394.0 L626.5 393.5 L629.0 392.9 L631.5 392.2 L633.9 391.5 L636.4 390.7 L638.8 389.7 L641.2 388.7 L643.6 387.5 L645.9 386.1 L648.2 384.3 L650.4 381.9 L652.0 376.0" fill="none" stroke="#ffd6e0" stroke-opacity="0.22" stroke-width="0.8" transform="translate(0.9 -0.6)"></path>
<path d="M590 352.0 A62 24 0 0 1 652 376.0 A62 24 0 0 1 590 400.0 A7.0 24 0 0 0 590 352.0 Z" fill="none" stroke="#3a0010" stroke-opacity="0.55" stroke-width="5.3"></path>
</g>
<path d="M590 352.0 A62 24 0 0 1 652 376.0 A62 24 0 0 1 590 400.0 A7.0 24 0 0 0 590 352.0 Z" fill="none" stroke="#ff8aa4" stroke-opacity="0.45" stroke-width="1.2"></path>
<path d="M601.7 357.2 L603.0 357.3 L604.3 357.3 L605.5 357.4 L606.8 357.5 L608.1 357.6 L609.3 357.7 L610.6 357.8 L611.9 357.9 L613.1 358.0 L614.4 358.1 L615.7 358.3 L616.9 358.4 L618.2 358.6 L619.4 358.8 L620.7 358.9 L621.9 359.1 L623.2 359.3 L624.4 359.6 L625.7 359.8 L626.9 360.0 L628.1 360.3 L629.4 360.6 L630.6 360.9 L631.8 361.2" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2.2" stroke-linecap="round"></path>
<circle cx="612.8" cy="361.1" r="1.4" fill="#ffffff" opacity="0.85"></circle>
        </g>
        <text x="114" y="381" font-size="12" font-weight="600" letter-spacing="1.6" id="lbl-claude" style="fill: var(--claude-text)"></text>
        <circle class="pulse" cx="52" cy="370" r="3.5" fill="#5dff8a"></circle>

        <path d="M376 156 L452 156 C470 330 506 520 566 700 L446 700 C420 520 392 330 376 156 Z" fill="url(#g5pylon)" stroke="#0b111c" stroke-width="1.5"></path>
        <path d="M404 170 C420 340 452 520 500 690" stroke="#e6edf8" stroke-width="2" opacity="0.35" fill="none"></path>
        <path d="M40 130 C40 114 54 102 84 99 L640 92 C700 90 748 104 760 124 C766 140 750 158 704 162 L92 164 C60 163 40 149 40 130 Z" fill="url(#g5nac)" stroke="#0b111c" stroke-width="1.5"></path>
        <path d="M40 130 C40 114 54 102 84 99 L640 92 C700 90 748 104 760 124 C766 140 750 158 704 162 L92 164 C60 163 40 149 40 130 Z" fill="url(#g5az)" opacity="0.7"></path>
<defs>
<radialGradient id="g7buss" cx="0.58" cy="0.4" r="0.62" fx="0.62" fy="0.36"><stop offset="0" stop-color="#fff2f5"></stop><stop offset="0.2" stop-color="#ffa0b8"></stop><stop offset="0.5" stop-color="#ff2b58"></stop><stop offset="0.82" stop-color="#a50f30"></stop><stop offset="1" stop-color="#4a0514"></stop></radialGradient>
<linearGradient id="g7bussshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0010" stop-opacity="0"></stop><stop offset="0.55" stop-color="#3a0010" stop-opacity="0.05"></stop><stop offset="1" stop-color="#2a000b" stop-opacity="0.6"></stop></linearGradient>
<linearGradient id="g7collar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3fa"></stop><stop offset="0.3" stop-color="#9aa6bb"></stop><stop offset="0.7" stop-color="#4a566d"></stop><stop offset="1" stop-color="#1f2736"></stop></linearGradient>
<linearGradient id="g7collarfar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7c1d1"></stop><stop offset="0.4" stop-color="#6b788f"></stop><stop offset="1" stop-color="#1c2331"></stop></linearGradient>
</defs>
<path d="M682 98.0 A9.0 31 0 0 1 682 160.0 L690 160.0 A9.0 31 0 0 0 690 98.0 Z" fill="url(#g7collar)"></path>
<path d="M682 98.0 A9.0 31 0 0 1 682 160.0" fill="none" stroke="#0b111c" stroke-opacity="0.7" stroke-width="1.4"></path>
<path d="M683.5 100.0 A9.0 29 0 0 1 683.5 158.0" fill="none" stroke="#f4f8ff" stroke-opacity="0.35" stroke-width="1"></path>
        <path d="M86 101 L640 94" stroke="#f0a948" stroke-width="3.5" stroke-linecap="round" opacity="0.8"></path>
        <path d="M60 158 L700 160" stroke="#0a0f18" stroke-width="2" opacity="0.4"></path>
        <g style="opacity: var(--codex-glow)">
          <rect x="104" y="112" width="548" height="36" rx="11" fill="#3f9cff" opacity="0.65" filter="url(#g5soft)"></rect>
          <rect x="104" y="112" width="548" height="36" rx="10" fill="url(#g5grille)"></rect>
          <path d="M110 114V146 M122 114V146 M134 114V146 M146 114V146 M158 114V146 M170 114V146 M182 114V146 M194 114V146 M206 114V146 M218 114V146 M230 114V146 M242 114V146 M254 114V146 M266 114V146 M278 114V146 M290 114V146 M302 114V146 M314 114V146 M326 114V146 M338 114V146 M350 114V146 M362 114V146 M374 114V146 M386 114V146 M398 114V146 M410 114V146 M422 114V146 M434 114V146 M446 114V146 M458 114V146 M470 114V146 M482 114V146 M494 114V146 M506 114V146 M518 114V146 M530 114V146 M542 114V146 M554 114V146 M566 114V146 M578 114V146 M590 114V146 M602 114V146 M614 114V146 M626 114V146 M638 114V146" stroke="#0d2a55" stroke-width="1.3" opacity="0.45"></path>
          <ellipse cx="740" cy="128" rx="96" ry="72" fill="url(#g5bussglow)"></ellipse>
<defs><clipPath id="g7bclipn"><path d="M690 98.0 A72 31 0 0 1 762 129.0 A72 31 0 0 1 690 160.0 A9.0 31 0 0 0 690 98.0 Z"></path></clipPath></defs>
<path class="core" d="M690 98.0 A72 31 0 0 1 762 129.0 A72 31 0 0 1 690 160.0 A9.0 31 0 0 0 690 98.0 Z" fill="url(#g7buss)"></path>
<g clip-path="url(#g7bclipn)">
<path d="M690 98.0 A72 31 0 0 1 762 129.0 A72 31 0 0 1 690 160.0 A9.0 31 0 0 0 690 98.0 Z" fill="url(#g7bussshade)"></path>
<path d="M694.5 102.2 L697.5 102.2 L700.5 102.2 L703.5 102.4 L706.4 102.5 L709.4 102.7 L712.4 103.0 L715.3 103.3 L718.2 103.7 L721.2 104.1 L724.1 104.6 L727.0 105.1 L729.9 105.8 L732.8 106.4 L735.7 107.2 L738.5 108.0 L741.4 109.0 L744.2 110.0 L747.0 111.2 L749.7 112.6 L752.5 114.2 L755.2 116.0 L757.8 118.3 L760.3 121.3 L762.0 129.0 M697.8 113.5 L700.8 113.5 L703.8 113.6 L706.7 113.6 L709.7 113.7 L712.6 113.8 L715.5 114.0 L718.4 114.2 L721.3 114.4 L724.2 114.6 L727.1 114.9 L729.9 115.2 L732.7 115.6 L735.5 116.0 L738.3 116.4 L741.1 116.9 L743.8 117.4 L746.5 118.1 L749.1 118.7 L751.8 119.5 L754.3 120.4 L756.8 121.5 L759.1 122.8 L761.2 124.6 L762.0 129.0 M699.0 129.0 L702.0 129.0 L705.0 129.0 L707.9 129.0 L710.9 129.0 L713.8 129.0 L716.7 129.0 L719.6 129.0 L722.5 129.0 L725.3 129.0 L728.2 129.0 L731.0 129.0 L733.8 129.0 L736.6 129.0 L739.3 129.0 L742.0 129.0 L744.7 129.0 L747.3 129.0 L749.9 129.0 L752.5 129.0 L755.0 129.0 L757.4 129.0 L759.6 129.0 L761.6 129.0 L762.0 129.0 M697.8 144.5 L700.8 144.5 L703.8 144.4 L706.7 144.4 L709.7 144.3 L712.6 144.2 L715.5 144.0 L718.4 143.8 L721.3 143.6 L724.2 143.4 L727.1 143.1 L729.9 142.8 L732.7 142.4 L735.5 142.0 L738.3 141.6 L741.1 141.1 L743.8 140.6 L746.5 139.9 L749.1 139.3 L751.8 138.5 L754.3 137.6 L756.8 136.5 L759.1 135.2 L761.2 133.4 L762.0 129.0 M694.5 155.8 L697.5 155.8 L700.5 155.8 L703.5 155.6 L706.4 155.5 L709.4 155.3 L712.4 155.0 L715.3 154.7 L718.2 154.3 L721.2 153.9 L724.1 153.4 L727.0 152.9 L729.9 152.2 L732.8 151.6 L735.7 150.8 L738.5 150.0 L741.4 149.0 L744.2 148.0 L747.0 146.8 L749.7 145.4 L752.5 143.8 L755.2 142.0 L757.8 139.7 L760.3 136.7 L762.0 129.0 M720.2 100.9 A8.2 28.1 0 0 1 720.2 157.1 M746.2 109.6 A5.6 19.4 0 0 1 746.2 148.4" fill="none" stroke="#5c0719" stroke-opacity="0.32" stroke-width="1"></path>
<path d="M694.5 102.2 L697.5 102.2 L700.5 102.2 L703.5 102.4 L706.4 102.5 L709.4 102.7 L712.4 103.0 L715.3 103.3 L718.2 103.7 L721.2 104.1 L724.1 104.6 L727.0 105.1 L729.9 105.8 L732.8 106.4 L735.7 107.2 L738.5 108.0 L741.4 109.0 L744.2 110.0 L747.0 111.2 L749.7 112.6 L752.5 114.2 L755.2 116.0 L757.8 118.3 L760.3 121.3 L762.0 129.0 M697.8 113.5 L700.8 113.5 L703.8 113.6 L706.7 113.6 L709.7 113.7 L712.6 113.8 L715.5 114.0 L718.4 114.2 L721.3 114.4 L724.2 114.6 L727.1 114.9 L729.9 115.2 L732.7 115.6 L735.5 116.0 L738.3 116.4 L741.1 116.9 L743.8 117.4 L746.5 118.1 L749.1 118.7 L751.8 119.5 L754.3 120.4 L756.8 121.5 L759.1 122.8 L761.2 124.6 L762.0 129.0 M699.0 129.0 L702.0 129.0 L705.0 129.0 L707.9 129.0 L710.9 129.0 L713.8 129.0 L716.7 129.0 L719.6 129.0 L722.5 129.0 L725.3 129.0 L728.2 129.0 L731.0 129.0 L733.8 129.0 L736.6 129.0 L739.3 129.0 L742.0 129.0 L744.7 129.0 L747.3 129.0 L749.9 129.0 L752.5 129.0 L755.0 129.0 L757.4 129.0 L759.6 129.0 L761.6 129.0 L762.0 129.0 M697.8 144.5 L700.8 144.5 L703.8 144.4 L706.7 144.4 L709.7 144.3 L712.6 144.2 L715.5 144.0 L718.4 143.8 L721.3 143.6 L724.2 143.4 L727.1 143.1 L729.9 142.8 L732.7 142.4 L735.5 142.0 L738.3 141.6 L741.1 141.1 L743.8 140.6 L746.5 139.9 L749.1 139.3 L751.8 138.5 L754.3 137.6 L756.8 136.5 L759.1 135.2 L761.2 133.4 L762.0 129.0 M694.5 155.8 L697.5 155.8 L700.5 155.8 L703.5 155.6 L706.4 155.5 L709.4 155.3 L712.4 155.0 L715.3 154.7 L718.2 154.3 L721.2 153.9 L724.1 153.4 L727.0 152.9 L729.9 152.2 L732.8 151.6 L735.7 150.8 L738.5 150.0 L741.4 149.0 L744.2 148.0 L747.0 146.8 L749.7 145.4 L752.5 143.8 L755.2 142.0 L757.8 139.7 L760.3 136.7 L762.0 129.0" fill="none" stroke="#ffd6e0" stroke-opacity="0.22" stroke-width="0.8" transform="translate(0.9 -0.6)"></path>
<path d="M690 98.0 A72 31 0 0 1 762 129.0 A72 31 0 0 1 690 160.0 A9.0 31 0 0 0 690 98.0 Z" fill="none" stroke="#3a0010" stroke-opacity="0.55" stroke-width="6.8"></path>
</g>
<path d="M690 98.0 A72 31 0 0 1 762 129.0 A72 31 0 0 1 690 160.0 A9.0 31 0 0 0 690 98.0 Z" fill="none" stroke="#ff8aa4" stroke-opacity="0.45" stroke-width="1.2"></path>
<path d="M704.1 104.7 L705.6 104.8 L707.1 104.9 L708.6 105.0 L710.1 105.1 L711.5 105.2 L713.0 105.3 L714.5 105.5 L715.9 105.6 L717.4 105.8 L718.9 105.9 L720.3 106.1 L721.8 106.3 L723.2 106.5 L724.7 106.7 L726.1 107.0 L727.6 107.2 L729.0 107.5 L730.4 107.8 L731.9 108.1 L733.3 108.4 L734.7 108.7 L736.2 109.1 L737.6 109.4 L739.0 109.8" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2.8" stroke-linecap="round"></path>
<circle cx="717.0" cy="109.8" r="1.9" fill="#ffffff" opacity="0.85"></circle>
        </g>
        <text x="122" y="135" font-size="14" font-weight="600" letter-spacing="2" id="lbl-codex" style="fill: var(--codex-text)"></text>
        <circle class="pulse" cx="46" cy="124" r="4" fill="#ff4a4a"></circle>

        <path d="M1066 614 L1414 614 C1338 642 1268 672 1222 702 L876 702 C954 672 1016 642 1066 614 Z" fill="url(#g5neck)" stroke="#0b111c" stroke-width="1.5"></path>
        <path d="M1066 614 L1414 614 C1338 642 1268 672 1222 702 L876 702 C954 672 1016 642 1066 614 Z" fill="url(#g5az)" opacity="0.6"></path>

        <path d="M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z" fill="url(#g5hull)" stroke="#0b111c" stroke-width="2"></path>
        <path d="M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z" fill="url(#g5az)"></path>
        <path d="M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z" fill="none" stroke="url(#g5rim)" stroke-width="3"></path>
        <rect x="58" y="800" width="14" height="112" rx="4" fill="#3a2c12" stroke="#f0c048" stroke-opacity="0.6" stroke-width="1.5"></rect>
        <rect x="61" y="806" width="8" height="100" rx="3" fill="#ffd27a" opacity="0.55" filter="url(#g5soft)"></rect>
        <path d="M60 826h10 M60 848h10 M60 870h10 M60 892h10" stroke="#ffe2a8" stroke-width="1.5" opacity="0.6"></path>

        <path d="M704 412 C710 312 830 204 1040 190 C1240 180 1720 180 1920 190 C2106 204 2198 300 2199 410 C2198 524 2108 620 1930 630 C1720 640 1240 640 1050 630 C846 618 710 512 704 412 Z" fill="url(#g5saucer)" stroke="#0b111c" stroke-width="2"></path>
        <path d="M704 412 C710 312 830 204 1040 190 C1240 180 1720 180 1920 190 C2106 204 2198 300 2199 410 C2198 524 2108 620 1930 630 C1720 640 1240 640 1050 630 C846 618 710 512 704 412 Z" fill="url(#g5az)"></path>
        <path d="M704 412 C710 312 830 204 1040 190 C1240 180 1720 180 1920 190 C2106 204 2198 300 2199 410 C2198 524 2108 620 1930 630 C1720 640 1240 640 1050 630 C846 618 710 512 704 412 Z" fill="none" stroke="#0a0f18" stroke-width="1.5" opacity="0.3" transform="translate(1452 410) scale(0.93 0.86) translate(-1452 -410)"></path>
        <path d="M704 412 C710 312 830 204 1040 190 C1240 180 1720 180 1920 190 C2106 204 2198 300 2199 410 C2198 524 2108 620 1930 630 C1720 640 1240 640 1050 630 C846 618 710 512 704 412 Z" fill="none" stroke="#0a0f18" stroke-width="1.2" opacity="0.22" transform="translate(1452 410) scale(0.85 0.7) translate(-1452 -410)"></path>
        <path d="M704 412 C710 312 830 204 1040 190 C1240 180 1720 180 1920 190 C2106 204 2198 300 2199 410 C2198 524 2108 620 1930 630 C1720 640 1240 640 1050 630 C846 618 710 512 704 412 Z" fill="none" stroke="url(#g5rim)" stroke-width="3.5"></path>
        <path d="M710 409 L2196 409" stroke="#e8eef8" stroke-width="2" opacity="0.55"></path>
        <path d="M712 413 L2194 413" stroke="#0a0f18" stroke-width="2" opacity="0.5"></path>

        <path d="M1024 218 C1044 104 1150 20 1320 10 L1660 10 C1830 20 1936 104 1956 218 Z" fill="url(#g5dome)" stroke="#0b111c" stroke-width="2"></path>
        <path d="M1024 218 C1044 104 1150 20 1320 10 L1660 10 C1830 20 1936 104 1956 218 Z" fill="url(#g5az)"></path>
        <path d="M1024 218 C1044 104 1150 20 1320 10 L1660 10 C1830 20 1936 104 1956 218 Z" fill="none" stroke="url(#g5rim)" stroke-width="3"></path>
        <path d="M1024 217 L1956 217" stroke="#2a3446" stroke-width="3" opacity="0.8"></path>
        <path d="M1438 12 C1448 4 1468 1 1490 1 C1512 1 1532 4 1542 12 Z" fill="#c9d3e3" stroke="#0b111c" stroke-width="1.5"></path>
        <rect x="1462" y="6" width="56" height="3" rx="1.5" fill="#ffe7bd" opacity="0.9"></rect>
        <circle class="pulse" cx="1490" cy="2" r="2.5" fill="#ffffff"></circle>

        <g>
<rect x="987" y="202.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1017" y="202.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1962" y="202.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="878" y="232.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="893" y="232.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="908" y="232.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="2048" y="232.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="848" y="250.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="863" y="250.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="878" y="250.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="893" y="250.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="908" y="250.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="2048" y="250.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="2063" y="250.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="2078" y="250.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="2093" y="250.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="818" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="833" y="268.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="848" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="863" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="878" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="893" y="268.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="908" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="2048" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="2063" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="2078" y="268.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="2093" y="268.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2108" y="268.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="788" y="286.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="803" y="286.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="818" y="286.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="848" y="286.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="878" y="286.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="893" y="286.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="2048" y="286.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="2063" y="286.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2078" y="286.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2093" y="286.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="2108" y="286.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="2123" y="286.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2138" y="286.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="773" y="304.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="788" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="803" y="304.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="818" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="833" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="848" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="878" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="908" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="2063" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="2078" y="304.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="2108" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="2123" y="304.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="2138" y="304.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="773" y="518.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="803" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="818" y="518.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="833" y="518.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="863" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="878" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="893" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="908" y="518.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="923" y="518.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="2063" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="2078" y="518.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="2093" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="2108" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2123" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="2138" y="518.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="803" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="818" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="833" y="536.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="848" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="863" y="536.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="878" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="893" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="908" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="923" y="536.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="2063" y="536.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="2078" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="2093" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="2108" y="536.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2123" y="536.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="833" y="554.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="848" y="554.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="863" y="554.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="893" y="554.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="908" y="554.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="923" y="554.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="2048" y="554.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="2063" y="554.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="2078" y="554.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="2093" y="554.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="2108" y="554.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="863" y="572.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="893" y="572.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="923" y="572.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2048" y="572.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2063" y="572.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="908" y="590.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="923" y="590.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="2048" y="590.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="938" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="953" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="968" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="983" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="998" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1013" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1028" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1043" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1058" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1073" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1088" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1103" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1118" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1133" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1148" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1163" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1178" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1193" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1223" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1238" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1253" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1268" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1283" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1298" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1313" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1328" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1343" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1358" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1373" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1388" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1403" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1418" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1433" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1448" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1463" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1478" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1493" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1508" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1523" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1553" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1568" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1583" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1598" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1613" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1628" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1643" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1658" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1673" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1688" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1718" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1748" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1763" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1778" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1793" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1808" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1823" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1838" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1853" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1868" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1883" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1898" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1913" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1928" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1943" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1958" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1973" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1988" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="2003" y="604.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="2018" y="604.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1013" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1028" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1043" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1058" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1073" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1088" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1103" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1118" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1148" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1163" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1178" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1193" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1208" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1223" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1238" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1283" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1298" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1313" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1328" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1343" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1358" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1373" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1388" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1403" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1418" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1433" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1448" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1463" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1478" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1493" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1508" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1523" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1538" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1553" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1568" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1583" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1598" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1628" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1643" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1658" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1673" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1688" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1703" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1718" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1733" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1748" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1763" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1778" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1793" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1838" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1853" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1868" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1883" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1898" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1928" y="618.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1943" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1958" y="618.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="749" y="328.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="762" y="328.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="775" y="328.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="749" y="348.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="762" y="348.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="775" y="348.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="723" y="368.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="749" y="368.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="762" y="368.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="775" y="368.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="2179" y="368.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="723" y="388.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="736" y="388.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="749" y="388.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="762" y="388.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="775" y="388.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="2179" y="388.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="736" y="428.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="749" y="428.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="762" y="428.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="775" y="428.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="2179" y="428.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="723" y="448.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="749" y="448.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="762" y="448.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="2179" y="448.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="736" y="468.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="749" y="468.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="762" y="468.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="775" y="468.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="749" y="488.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="762" y="488.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="775" y="488.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1811" y="58.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1139" y="78.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1153" y="78.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1811" y="78.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1825" y="78.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1839" y="78.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1097" y="98.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1111" y="98.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1125" y="98.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1139" y="98.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1825" y="98.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1839" y="98.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1853" y="98.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1867" y="98.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1083" y="118.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1125" y="118.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1139" y="118.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1153" y="118.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1825" y="118.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1839" y="118.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1853" y="118.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1867" y="118.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1881" y="118.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1895" y="118.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1069" y="138.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1083" y="138.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1097" y="138.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1111" y="138.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1125" y="138.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1139" y="138.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1825" y="138.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1839" y="138.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1853" y="138.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1867" y="138.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1895" y="138.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1055" y="158.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1069" y="158.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1083" y="158.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1111" y="158.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1139" y="158.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1839" y="158.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1867" y="158.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1881" y="158.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1895" y="158.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1909" y="158.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1923" y="158.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1055" y="178.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1069" y="178.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1083" y="178.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1097" y="178.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1111" y="178.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1125" y="178.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1839" y="178.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1853" y="178.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1867" y="178.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1881" y="178.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1895" y="178.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1909" y="178.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1923" y="178.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1055" y="196.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1069" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1083" y="196.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1125" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1853" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1867" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1881" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1895" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1909" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1923" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1937" y="196.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1059" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1073" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1087" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1115" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1129" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1143" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1171" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1185" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1199" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1213" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1227" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1241" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1255" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1297" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1311" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1325" y="626.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1339" y="626.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1045" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1059" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1073" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1087" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1115" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1129" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1143" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1157" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1171" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1185" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1199" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1213" y="644.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1227" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1241" y="644.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1255" y="644.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1269" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1283" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1297" y="644.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="989" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1031" y="662.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1045" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1059" y="662.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1073" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1087" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1101" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1115" y="662.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1129" y="662.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1143" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1157" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1171" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1185" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1199" y="662.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1213" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1227" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1241" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1255" y="662.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1269" y="662.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="975" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="989" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1003" y="680.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1017" y="680.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1031" y="680.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1045" y="680.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1059" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1073" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1087" y="680.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1101" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1129" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1143" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1157" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1171" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1185" y="680.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1199" y="680.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1213" y="680.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="147" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="162" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="177" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="192" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="207" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="222" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="237" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="252" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="267" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="282" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="297" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="312" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="327" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="342" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="357" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="372" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="387" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="402" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="417" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="432" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="447" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="462" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="477" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="507" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="522" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="537" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="552" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="567" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="582" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="597" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="612" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="642" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="657" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="672" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="702" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="717" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="732" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="747" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="762" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="792" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="822" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="837" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="852" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="867" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="882" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="912" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="942" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="957" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="972" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="987" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1002" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1017" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1032" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1047" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1062" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1077" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1092" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1107" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1122" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1137" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1167" y="701.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1182" y="701.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="132" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="177" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="192" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="207" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="222" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="237" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="252" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="267" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="282" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="297" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="342" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="372" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="387" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="402" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="417" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="432" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="462" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="477" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="522" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="537" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="567" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="582" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="597" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="612" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="627" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="642" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="657" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="687" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="702" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="717" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="732" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="747" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="762" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="777" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="792" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="807" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="822" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="837" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="852" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="867" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="882" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="897" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="912" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="927" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="942" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="957" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="972" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="987" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1002" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1017" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1032" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1047" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1062" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1077" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1092" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1107" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1122" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1137" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1152" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1167" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1182" y="1002.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1212" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1227" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1242" y="1002.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="207" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="222" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="237" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="252" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="282" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="297" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="312" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="327" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="342" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="357" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="372" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="387" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="402" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="417" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="432" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="447" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="462" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="477" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="492" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="507" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="522" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="537" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="552" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="567" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="582" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="612" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="627" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="657" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="672" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="687" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="702" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="717" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="732" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="762" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="792" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="807" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="837" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="852" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="867" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="882" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="897" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="912" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="927" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="942" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="957" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="987" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1002" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1017" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1047" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1062" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1092" y="1018.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1107" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1122" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1137" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="1152" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1167" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1182" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1197" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1212" y="1018.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1261" y="722.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="71" y="742.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="85" y="742.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1261" y="742.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1275" y="742.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="71" y="762.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="85" y="762.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1261" y="762.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="71" y="782.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="85" y="782.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1261" y="782.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="85" y="822.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.7"></rect>
<rect x="1261" y="822.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="85" y="842.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.4"></rect>
<rect x="1261" y="842.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="85" y="862.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1261" y="862.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="85" y="882.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1261" y="882.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="71" y="918.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="85" y="918.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="99" y="918.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="113" y="918.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="127" y="918.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="1247" y="918.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="85" y="938.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.4"></rect>
<rect x="127" y="938.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="141" y="938.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="1247" y="938.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1261" y="938.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.7"></rect>
<rect x="1275" y="938.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="85" y="958.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="99" y="958.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="127" y="958.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="141" y="958.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
<rect x="1247" y="958.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1261" y="958.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1275" y="958.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="99" y="978.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="113" y="978.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.55"></rect>
<rect x="127" y="978.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.95"></rect>
<rect x="141" y="978.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.95"></rect>
<rect x="1247" y="978.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.85"></rect>
<rect x="1261" y="978.5" width="6" height="3" rx="1" fill="#ffe7bd" opacity="0.55"></rect>
<rect x="1275" y="978.5" width="6" height="3" rx="1" fill="#d9ecff" opacity="0.85"></rect>
        </g>

        <ellipse class="thrust" cx="712" cy="411" rx="16" ry="34" fill="url(#g5imp)"></ellipse>
        <rect x="704" y="398" width="10" height="26" rx="4" fill="#ff5a4a" opacity="0.9"></rect>
        <circle class="pulse" cx="2197" cy="410" r="4" fill="#ffffff"></circle>

        <path d="M1206 36 L1774 36 Q1790 36 1794 50 L1834 192 Q1838 206 1822 206 L1158 206 Q1142 206 1146 192 L1186 50 Q1190 36 1206 36 Z" fill="url(#g6bridgewall)" stroke="#b9c8df" stroke-opacity="0.45" stroke-width="1.5"></path>
        <g>
<ellipse cx="1490" cy="58" rx="300" ry="40" fill="url(#g6skyglow)"></ellipse>
<ellipse cx="1490" cy="40" rx="170" ry="3.5" fill="#e6f2ff" opacity="0.55"></ellipse>
<rect x="1226" y="38" width="70" height="6" rx="3" fill="#8fa8e0" opacity="0.6"></rect>
<rect x="1300" y="38" width="36" height="6" rx="3" fill="#e8c37a" opacity="0.6"></rect>
<rect x="1340" y="37" width="96" height="6" rx="3" fill="#e889b6" opacity="0.6"></rect>
<rect x="1544" y="37" width="42" height="6" rx="3" fill="#3fc1a5" opacity="0.6"></rect>
<rect x="1590" y="37" width="90" height="6" rx="3" fill="#8fa8e0" opacity="0.6"></rect>
<rect x="1684" y="37" width="76" height="6" rx="3" fill="#f0a948" opacity="0.6"></rect>
<rect x="1197" y="64" width="26" height="58" rx="2" fill="#2a3a56" stroke="#56709c" stroke-width="1.2"></rect><path d="M1210 66V122" stroke="#0a1222" stroke-width="1.5"></path><rect x="1199" y="60" width="22" height="2.5" rx="1" fill="#e8c37a" opacity="0.8"></rect>
<rect x="1596" y="46" width="186" height="76" rx="7" fill="#0b1322" stroke="#56709c" stroke-width="2"></rect><rect x="1602" y="52" width="174" height="64" rx="4" fill="url(#g6space)"></rect><g clip-path="url(#g6scr)"><circle cx="1742" cy="95" r="1.2" fill="#ffffff" opacity="0.9"></circle><circle cx="1678" cy="71" r="1.2" fill="#ffffff" opacity="0.9"></circle><circle cx="1644" cy="67" r="0.9" fill="#ffffff" opacity="0.5"></circle><circle cx="1669" cy="73" r="0.9" fill="#ffffff" opacity="0.5"></circle><circle cx="1752" cy="70" r="0.9" fill="#ffffff" opacity="0.5"></circle><circle cx="1694" cy="73" r="1.2" fill="#ffffff" opacity="0.9"></circle><circle cx="1660" cy="61" r="0.9" fill="#ffffff" opacity="0.9"></circle><circle cx="1725" cy="89" r="1.5" fill="#ffffff" opacity="0.5"></circle><circle cx="1624" cy="59" r="1.2" fill="#ffffff" opacity="0.9"></circle><circle cx="1673" cy="92" r="1.5" fill="#ffffff" opacity="0.7"></circle><circle cx="1744" cy="57" r="0.9" fill="#ffffff" opacity="0.5"></circle><circle cx="1763" cy="90" r="1.5" fill="#ffffff" opacity="0.5"></circle><circle cx="1637" cy="57" r="0.7" fill="#ffffff" opacity="0.9"></circle><circle cx="1665" cy="93" r="0.9" fill="#ffffff" opacity="0.5"></circle><circle cx="1770" cy="111" r="1.5" fill="#ffffff" opacity="0.9"></circle><circle cx="1753" cy="109" r="0.9" fill="#ffffff" opacity="0.5"></circle><circle cx="1745" cy="69" r="1.2" fill="#ffffff" opacity="0.5"></circle><circle cx="1695" cy="62" r="1.5" fill="#ffffff" opacity="0.5"></circle><circle cx="1698" cy="91" r="1.5" fill="#ffffff" opacity="0.7"></circle><circle cx="1688" cy="72" r="1.2" fill="#ffffff" opacity="0.9"></circle><circle cx="1666" cy="59" r="1.2" fill="#ffffff" opacity="0.9"></circle><circle cx="1609" cy="110" r="1.5" fill="#ffffff" opacity="0.9"></circle><circle cx="1704" cy="61" r="1.5" fill="#ffffff" opacity="0.7"></circle><circle cx="1760" cy="78" r="1.5" fill="#ffffff" opacity="0.9"></circle><circle cx="1632" cy="106" r="1.2" fill="#ffffff" opacity="0.5"></circle><circle cx="1752" cy="112" r="0.9" fill="#ffffff" opacity="0.9"></circle><circle cx="1755" cy="71" r="0.7" fill="#ffffff" opacity="0.9"></circle><circle cx="1736" cy="105" r="0.7" fill="#ffffff" opacity="0.5"></circle><circle cx="1642" cy="100" r="1.5" fill="#ffffff" opacity="0.5"></circle><circle cx="1610" cy="64" r="1.2" fill="#ffffff" opacity="0.7"></circle><circle cx="1712" cy="61" r="0.9" fill="#ffffff" opacity="0.9"></circle><circle cx="1635" cy="86" r="1.2" fill="#ffffff" opacity="0.5"></circle><circle cx="1757" cy="75" r="1.5" fill="#ffffff" opacity="0.9"></circle><circle cx="1735" cy="76" r="0.7" fill="#ffffff" opacity="0.5"></circle><circle cx="1756" cy="170" r="76" fill="url(#g6planet)"></circle><circle cx="1756" cy="170" r="79" fill="none" stroke="#9fe0ff" stroke-width="2" opacity="0.5"></circle></g><rect x="1602" y="52" width="174" height="64" rx="4" fill="none" stroke="#6cc6ff" stroke-opacity="0.35" stroke-width="1.5"></rect>
<rect x="1194" y="122" width="404" height="5" fill="#4a5874"></rect><path d="M1194 122.5H1598" stroke="#a3b2cc" stroke-opacity="0.55"></path><rect x="1194" y="127" width="404" height="3" fill="#1d2534"></rect>
<path d="M1598 122 L1640 128" stroke="#4a5874" stroke-width="4"></path>
<rect x="1158" y="194" width="670" height="6" fill="#4a5874"></rect><path d="M1158 194.5H1828" stroke="#a3b2cc" stroke-opacity="0.55"></path>
<rect x="1600" y="176" width="226" height="18" fill="url(#g6screenwash)"></rect>
<path d="M1240 110 Q1410 100 1584 110" fill="none" stroke="url(#g6wood)" stroke-width="5" stroke-linecap="round"></path><path d="M1250 108V122" stroke="#5e3f22" stroke-width="3"></path><path d="M1330 105V122" stroke="#5e3f22" stroke-width="3"></path><path d="M1490 105V122" stroke="#5e3f22" stroke-width="3"></path><path d="M1574 108V122" stroke="#5e3f22" stroke-width="3"></path>
<rect x="1237" y="63" width="38" height="34" rx="9" fill="#2a3550" stroke="#56709c" stroke-width="1.5"></rect><rect x="1227" y="98" width="58" height="7" rx="3" fill="#3a4c6e" stroke="#56709c" stroke-opacity="0.7"></rect><rect x="1229" y="99.5" width="9" height="2.5" rx="1" fill="#3fc1a5"></rect><rect x="1274" y="99.5" width="9" height="2.5" rx="1" fill="#3fc1a5"></rect><rect x="1250" y="105" width="12" height="17" fill="#1d2534"></rect>
<rect x="1416" y="63" width="38" height="34" rx="9" fill="#2a3550" stroke="#e8c37a" stroke-width="1.5"></rect><rect x="1406" y="98" width="58" height="7" rx="3" fill="#3a4c6e" stroke="#e8c37a" stroke-opacity="0.7"></rect><rect x="1408" y="99.5" width="9" height="2.5" rx="1" fill="#e8c37a"></rect><rect x="1453" y="99.5" width="9" height="2.5" rx="1" fill="#e8c37a"></rect><rect x="1429" y="105" width="12" height="17" fill="#1d2534"></rect>
<rect x="1401" y="168" width="8" height="16" rx="3" fill="#2a3a56"></rect><rect x="1400" y="183" width="36" height="5" rx="2" fill="#2a3a56"></rect><rect x="1415" y="188" width="6" height="6" fill="#1d2534"></rect>
<path d="M1526 194 L1530 176 L1582 168 L1586 194 Z" fill="#1b2840" stroke="#56709c" stroke-width="1.2"></path><path d="M1531 175 L1581 167.5 L1582 171 L1532 178.5 Z" fill="#3fc1a5" opacity="0.85"></path><rect x="1534" y="183" width="7" height="2.5" rx="1" fill="#8fa8e0" opacity="0.75"></rect><rect x="1544" y="183" width="7" height="2.5" rx="1" fill="#e8c37a" opacity="0.75"></rect><rect x="1554" y="183" width="7" height="2.5" rx="1" fill="#e889b6" opacity="0.75"></rect><rect x="1564" y="183" width="7" height="2.5" rx="1" fill="#f0a948" opacity="0.75"></rect><rect x="1574" y="183" width="7" height="2.5" rx="1" fill="#3fc1a5" opacity="0.75"></rect>
<rect x="1615" y="168" width="8" height="16" rx="3" fill="#2a3a56"></rect><rect x="1614" y="183" width="36" height="5" rx="2" fill="#2a3a56"></rect><rect x="1629" y="188" width="6" height="6" fill="#1d2534"></rect>
<path d="M1740 194 L1744 176 L1796 168 L1800 194 Z" fill="#1b2840" stroke="#56709c" stroke-width="1.2"></path><path d="M1745 175 L1795 167.5 L1796 171 L1746 178.5 Z" fill="#3fc1a5" opacity="0.85"></path><rect x="1748" y="183" width="7" height="2.5" rx="1" fill="#8fa8e0" opacity="0.75"></rect><rect x="1758" y="183" width="7" height="2.5" rx="1" fill="#e8c37a" opacity="0.75"></rect><rect x="1768" y="183" width="7" height="2.5" rx="1" fill="#e889b6" opacity="0.75"></rect><rect x="1778" y="183" width="7" height="2.5" rx="1" fill="#f0a948" opacity="0.75"></rect><rect x="1788" y="183" width="7" height="2.5" rx="1" fill="#3fc1a5" opacity="0.75"></rect>
<rect x="1316" y="138" width="54" height="40" rx="3" fill="#070d18" stroke="#56709c" stroke-width="1.2"></rect><rect x="1320" y="142" width="18" height="4" rx="2" fill="#8fa8e0" opacity="0.7"></rect><rect x="1320" y="149" width="32" height="4" rx="2" fill="#e8c37a" opacity="0.7"></rect><rect x="1320" y="156" width="40" height="4" rx="2" fill="#3fc1a5" opacity="0.7"></rect><rect x="1320" y="163" width="26" height="4" rx="2" fill="#e889b6" opacity="0.7"></rect><rect x="1320" y="170" width="32" height="4" rx="2" fill="#8fa8e0" opacity="0.7"></rect><path d="M1316 194 L1320 180 L1368 180 L1370 194 Z" fill="#1b2840" stroke="#56709c" stroke-width="1.2"></path>
        </g>
        <text x="1490" y="52" font-size="11" letter-spacing="1.8" fill="#8ea3c4" text-anchor="middle"><tspan fill="#c8d6ec">01</tspan><tspan dx="12">BRIDGE</tspan></text>

        <g fill="#060b16" fill-opacity="0.88" stroke="#b9c8df" stroke-opacity="0.4" stroke-width="1.5">
          <rect x="922" y="222" width="1110" height="88" rx="12"></rect>
          <rect x="792" y="318" width="1370" height="88" rx="12"></rect>
          <rect x="790" y="414" width="1374" height="88" rx="12"></rect>
          <rect x="944" y="510" width="1088" height="88" rx="12"></rect>
          <rect x="100" y="712" width="1150" height="88" rx="12"></rect>
          <rect x="100" y="808" width="1150" height="88" rx="12"></rect>
        </g>
        <rect x="160" y="904" width="1080" height="88" rx="12" fill="url(#g5hatch)" stroke="#f0a948" stroke-opacity="0.45" stroke-width="1.5"></rect>
        <g fill="url(#g6struct)" stroke="#b9c8df" stroke-opacity="0.4" stroke-width="1.5">
          <rect x="922" y="222" width="1110" height="88" rx="12"></rect>
          <rect x="792" y="318" width="1370" height="88" rx="12"></rect>
          <rect x="790" y="414" width="1374" height="88" rx="12"></rect>
          <rect x="944" y="510" width="1088" height="88" rx="12"></rect>
          <rect x="100" y="712" width="1150" height="88" rx="12"></rect>
          <rect x="100" y="808" width="1150" height="88" rx="12"></rect>
        </g>
        <g>
<rect x="931" y="238" width="536" height="4" fill="#2a3446"></rect><rect x="934" y="242" width="530" height="64" fill="url(#g6wall)"></rect><path d="M970 246V302 M1006 246V302 M1042 246V302 M1078 246V302 M1114 246V302 M1150 246V302 M1186 246V302 M1222 246V302 M1258 246V302 M1294 246V302 M1330 246V302 M1366 246V302 M1402 246V302 M1438 246V302" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="934" y="242" width="530" height="34" fill="url(#g6light)"></rect><rect x="944" y="243" width="510" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="934" y="302" width="530" height="4" fill="#4a5874"></rect><path d="M934 302.5H1464" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="931" y="306" width="536" height="4" fill="#1d2534"></rect>
<g><path d="M1176 246 L1224 246 L1220 268 L1172 268 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path><circle cx="1195" cy="252" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1204" cy="249" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1186" cy="262" r="1" fill="#ffffff" opacity="0.85"></circle><circle cx="1202" cy="258" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1190" cy="263" r="1" fill="#ffffff" opacity="0.85"></circle><path d="M1234 246 L1282 246 L1278 268 L1230 268 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path><circle cx="1255" cy="251" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1259" cy="250" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1235" cy="257" r="1" fill="#ffffff" opacity="0.85"></circle><circle cx="1233" cy="250" r="1" fill="#ffffff" opacity="0.85"></circle><circle cx="1249" cy="264" r="1" fill="#ffffff" opacity="0.85"></circle><path d="M1292 246 L1340 246 L1336 268 L1288 268 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path><circle cx="1319" cy="264" r="1" fill="#ffffff" opacity="0.85"></circle><circle cx="1312" cy="260" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1295" cy="252" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1310" cy="251" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1309" cy="256" r="1.3" fill="#ffffff" opacity="0.85"></circle><path d="M1350 246 L1398 246 L1394 268 L1346 268 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path><circle cx="1360" cy="262" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1373" cy="260" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1384" cy="257" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1388" cy="256" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1350" cy="249" r="0.7" fill="#ffffff" opacity="0.85"></circle><path d="M1408 246 L1456 246 L1452 268 L1404 268 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path><circle cx="1444" cy="256" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1437" cy="263" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1442" cy="253" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1443" cy="263" r="1.3" fill="#ffffff" opacity="0.85"></circle><circle cx="1448" cy="265" r="1.3" fill="#ffffff" opacity="0.85"></circle></g>
<rect x="1473" y="238" width="176" height="4" fill="#2a3446"></rect><rect x="1476" y="242" width="170" height="64" fill="url(#g6walloff)"></rect><path d="M1512 246V302 M1548 246V302 M1584 246V302 M1620 246V302" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1476" y="302" width="170" height="4" fill="#4a5874"></rect><path d="M1476 302.5H1646" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1473" y="306" width="176" height="4" fill="#1d2534"></rect>
<g opacity="0.42"><path d="M1578 286 L1604 256 L1630 286 Z" fill="#e889b6" opacity="0.1"></path><polyline points="1586,272 1594,264 1602,269 1612,256 1622,262" fill="none" stroke="#e889b6" stroke-width="1.5" opacity="0.9"></polyline><circle cx="1612" cy="256" r="2.5" fill="#e8c37a"></circle><rect x="1572" y="286" width="62" height="5" rx="2" fill="#56709c"></rect><rect x="1598" y="291" width="10" height="11" fill="#1b2840"></rect><rect x="1532" y="282" width="24" height="3" rx="1" fill="#56709c"></rect><path d="M1544 285V302 M1537 302 H1551" stroke="#1b2840" stroke-width="3"></path><rect x="1534" y="279" width="4" height="3" fill="#3a4c6e"></rect><rect x="1539" y="279" width="4" height="3" fill="#e8c37a"></rect><rect x="1544" y="279" width="4" height="3" fill="#3a4c6e"></rect><rect x="1549" y="279" width="4" height="3" fill="#e8c37a"></rect><path d="M1538 279 v-5 M1549 279 v-4" stroke="#e889b6" stroke-width="2.5" stroke-linecap="round"></path></g>
<rect x="1655" y="238" width="176" height="4" fill="#2a3446"></rect><rect x="1658" y="242" width="170" height="64" fill="url(#g6wall)"></rect><path d="M1694 246V302 M1730 246V302 M1766 246V302 M1802 246V302" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1658" y="242" width="170" height="34" fill="url(#g6light)"></rect><rect x="1668" y="243" width="150" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="1658" y="302" width="170" height="4" fill="#4a5874"></rect><path d="M1658 302.5H1828" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1655" y="306" width="176" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="1760" y="246" width="54" height="30" rx="2" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1764" y="250" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1774" y="250" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1784" y="250" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1794" y="250" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1804" y="250" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1764" y="258" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1774" y="258" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1784" y="258" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1794" y="258" width="8" height="6" fill="#e8c37a" opacity="0.9"></rect><rect x="1804" y="258" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1764" y="266" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1774" y="266" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1784" y="266" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1794" y="266" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1804" y="266" width="8" height="6" fill="#3fc1a5" opacity="0.3"></rect><rect x="1754" y="286" width="60" height="4" fill="#56709c"></rect><rect x="1758" y="290" width="3" height="12" fill="#1b2840"></rect><rect x="1808" y="290" width="3" height="12" fill="#1b2840"></rect><rect x="1770" y="282" width="10" height="4" rx="1" fill="#c4cfe2" opacity="0.6"></rect><rect x="1772" y="279" width="10" height="3" rx="1" fill="#8fa8e0" opacity="0.6"></rect><rect x="1714" y="272" width="22" height="30" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><path d="M1717 276 h16" stroke="#0a1222" stroke-width="1"></path><rect x="1722" y="278" width="6" height="2" rx="1" fill="#3fc1a5" opacity="0.8"></rect><path d="M1717 286 h16" stroke="#0a1222" stroke-width="1"></path><rect x="1722" y="288" width="6" height="2" rx="1" fill="#3fc1a5" opacity="0.8"></rect><path d="M1717 296 h16" stroke="#0a1222" stroke-width="1"></path><rect x="1722" y="298" width="6" height="2" rx="1" fill="#3fc1a5" opacity="0.8"></rect><path d="M1719 272 L1720 262 L1730 262 L1731 272 Z" fill="#3a4c6e" stroke="#56709c" stroke-width="0.8"></path><path d="M1725 262 q-9 -6 -7 -17 M1725 262 q8 -8 5 -19 M1725 262 q2 -10 -1 -22 M1725 262 q-3 -4 -11 -6" fill="none" stroke="#3fa86a" stroke-width="2.2" stroke-linecap="round" opacity="0.85"></path></g>
<rect x="1837" y="238" width="186" height="4" fill="#2a3446"></rect><rect x="1840" y="242" width="180" height="64" fill="url(#g6wall)"></rect><path d="M1876 246V302 M1912 246V302 M1948 246V302 M1984 246V302" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1840" y="242" width="180" height="34" fill="url(#g6light)"></rect><rect x="1850" y="243" width="160" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="1840" y="302" width="180" height="4" fill="#4a5874"></rect><path d="M1840 302.5H2020" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1837" y="306" width="186" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="1912" y="244" width="58" height="30" rx="4" fill="#040810" stroke="#56709c" stroke-width="1.5"></rect><circle cx="1957" cy="262" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1958" cy="249" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1927" cy="249" r="1.2" fill="#ffffff" opacity="0.85"></circle><circle cx="1954" cy="270" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1937" cy="253" r="1" fill="#ffffff" opacity="0.85"></circle><circle cx="1922" cy="260" r="1" fill="#ffffff" opacity="0.85"></circle><circle cx="1939" cy="263" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1944" cy="263" r="1.2" fill="#ffffff" opacity="0.85"></circle><circle cx="1963" cy="249" r="0.7" fill="#ffffff" opacity="0.85"></circle><circle cx="1949" cy="262" r="1.2" fill="#ffffff" opacity="0.85"></circle><rect x="1978" y="256" width="30" height="24" rx="2" fill="#0d3550" fill-opacity="0.85" stroke="#6fc0ff" stroke-opacity="0.6"></rect><path d="M1986 267 q5 -5 10 0 q-5 5 -10 0 Z M1996 267 l4 -3 v6 Z" fill="#ff7a45"></path><circle cx="2002" cy="261" r="1.2" fill="#bfe6ff" opacity="0.8"></circle><circle cx="2000" cy="265" r="0.9" fill="#bfe6ff" opacity="0.8"></circle><rect x="1980" y="280" width="26" height="22" fill="#1b2840" stroke="#3d5580" stroke-width="1"></rect><rect x="1914" y="288" width="52" height="10" rx="4" fill="#4a3558"></rect><rect x="1914" y="282" width="10" height="16" rx="3" fill="#4a3558"></rect><rect x="1918" y="298" width="3" height="4" fill="#1b2840"></rect><rect x="1960" y="298" width="3" height="4" fill="#1b2840"></rect></g>
<rect x="837" y="334" width="246" height="4" fill="#2a3446"></rect><rect x="840" y="338" width="240" height="64" fill="url(#g6wall)"></rect><path d="M876 342V398 M912 342V398 M948 342V398 M984 342V398 M1020 342V398 M1056 342V398" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="840" y="338" width="240" height="34" fill="url(#g6light)"></rect><rect x="850" y="339" width="220" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="840" y="398" width="240" height="4" fill="#4a5874"></rect><path d="M840 398.5H1080" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="837" y="402" width="246" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="1002" y="348" width="19" height="50" rx="3" fill="#16223a" stroke="#3d5580" stroke-width="1.2"></rect><rect class="pulse" x="1006" y="353" width="11" height="2" fill="#3fc1a5" opacity="0.6"></rect><rect x="1006" y="359" width="7" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1006" y="365" width="4" height="2" fill="#3fc1a5" opacity="0.35"></rect><rect x="1006" y="371" width="11" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1006" y="377" width="11" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1006" y="383" width="7" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect class="pulse" x="1006" y="389" width="11" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1025" y="348" width="19" height="50" rx="3" fill="#16223a" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1029" y="353" width="7" height="2" fill="#3fc1a5" opacity="0.6"></rect><rect x="1029" y="359" width="4" height="2" fill="#3fc1a5" opacity="0.35"></rect><rect x="1029" y="365" width="11" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1029" y="371" width="11" height="2" fill="#3fc1a5" opacity="0.6"></rect><rect x="1029" y="377" width="11" height="2" fill="#3fc1a5" opacity="0.9"></rect><rect x="1029" y="383" width="7" height="2" fill="#3fc1a5" opacity="0.6"></rect><rect x="1029" y="389" width="7" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1048" y="348" width="19" height="50" rx="3" fill="#16223a" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1052" y="353" width="4" height="2" fill="#3fc1a5" opacity="0.6"></rect><rect x="1052" y="359" width="11" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1052" y="365" width="7" height="2" fill="#3fc1a5" opacity="0.9"></rect><rect x="1052" y="371" width="11" height="2" fill="#3fc1a5" opacity="0.2"></rect><rect x="1052" y="377" width="4" height="2" fill="#3fc1a5" opacity="0.6"></rect><rect x="1052" y="383" width="4" height="2" fill="#3fc1a5" opacity="0.6"></rect><rect x="1052" y="389" width="7" height="2" fill="#3fc1a5" opacity="0.9"></rect><rect x="896" y="344" width="46" height="26" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="898" y="346" width="42" height="22" rx="2" fill="#3fc1a5" fill-opacity="0.14"></rect><rect x="900" y="348" width="38" height="2.5" rx="1" fill="#8fa8e0" opacity="0.7"></rect><rect x="900" y="353" width="26" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><rect x="900" y="358" width="19" height="2.5" rx="1" fill="#3fc1a5" opacity="0.7"></rect><rect x="900" y="363" width="26" height="2.5" rx="1" fill="#8fa8e0" opacity="0.7"></rect><path d="M948 398 L948 388 L956 382 L992 382 L992 398 Z" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></path><rect x="957" y="383" width="32" height="2.5" rx="1" fill="#3fc1a5" opacity="0.85"></rect><rect x="958" y="389" width="6" height="2.5" rx="1" fill="#e889b6" opacity="0.7"></rect><rect x="967" y="389" width="6" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><rect x="976" y="389" width="6" height="2.5" rx="1" fill="#e889b6" opacity="0.7"></rect><rect x="959" y="378" width="6" height="14" rx="2" fill="#2a3a56"></rect><rect x="958" y="389" width="18" height="4" rx="2" fill="#2a3a56"></rect><rect x="967" y="393" width="3" height="5" fill="#1d2534"></rect></g>
<rect x="1091" y="334" width="246" height="4" fill="#2a3446"></rect><rect x="1094" y="338" width="240" height="64" fill="url(#g6wall)"></rect><path d="M1130 342V398 M1166 342V398 M1202 342V398 M1238 342V398 M1274 342V398 M1310 342V398" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1094" y="338" width="240" height="34" fill="url(#g6light)"></rect><rect x="1104" y="339" width="220" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="1094" y="398" width="240" height="4" fill="#4a5874"></rect><path d="M1094 398.5H1334" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1091" y="402" width="246" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="1252" y="350" width="70" height="48" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1254" y="355" width="3" height="10" fill="#8fa8e0" opacity="0.72"></rect><rect x="1258" y="352" width="3" height="13" fill="#3fc1a5" opacity="0.72"></rect><rect x="1262" y="354" width="3" height="11" fill="#c4cfe2" opacity="0.72"></rect><rect x="1266" y="354" width="3" height="11" fill="#8fa8e0" opacity="0.72"></rect><rect x="1270" y="355" width="4" height="10" fill="#e8c37a" opacity="0.72"></rect><rect x="1275" y="355" width="5" height="10" fill="#e8c37a" opacity="0.72"></rect><rect x="1281" y="352" width="4" height="13" fill="#e889b6" opacity="0.72"></rect><rect x="1286" y="355" width="4" height="10" fill="#7d5a3a" opacity="0.72"></rect><rect x="1291" y="352" width="4" height="13" fill="#7d5a3a" opacity="0.72"></rect><rect x="1296" y="352" width="5" height="13" fill="#e889b6" opacity="0.72"></rect><rect x="1302" y="354" width="4" height="11" fill="#e8c37a" opacity="0.72"></rect><rect x="1307" y="353" width="4" height="12" fill="#e889b6" opacity="0.72"></rect><rect x="1312" y="355" width="4" height="10" fill="#e889b6" opacity="0.72"></rect><rect x="1317" y="353" width="4" height="12" fill="#f0a948" opacity="0.72"></rect><rect x="1252" y="365" width="70" height="2" fill="#56709c"></rect><rect x="1254" y="368" width="4" height="13" fill="#c4cfe2" opacity="0.72"></rect><rect x="1259" y="368" width="5" height="13" fill="#3fc1a5" opacity="0.72"></rect><rect x="1265" y="369" width="5" height="12" fill="#8fa8e0" opacity="0.72"></rect><rect x="1271" y="369" width="4" height="12" fill="#c4cfe2" opacity="0.72"></rect><rect x="1276" y="369" width="5" height="12" fill="#f0a948" opacity="0.72"></rect><rect x="1282" y="369" width="5" height="12" fill="#3fc1a5" opacity="0.72"></rect><rect x="1288" y="369" width="3" height="12" fill="#e889b6" opacity="0.72"></rect><rect x="1292" y="369" width="5" height="12" fill="#e8c37a" opacity="0.72"></rect><rect x="1298" y="371" width="4" height="10" fill="#e889b6" opacity="0.72"></rect><rect x="1303" y="371" width="4" height="10" fill="#8fa8e0" opacity="0.72"></rect><rect x="1308" y="370" width="5" height="11" fill="#e8c37a" opacity="0.72"></rect><rect x="1314" y="370" width="4" height="11" fill="#e8c37a" opacity="0.72"></rect><rect x="1252" y="381" width="70" height="2" fill="#56709c"></rect><rect x="1254" y="384" width="4" height="13" fill="#8fa8e0" opacity="0.72"></rect><rect x="1259" y="387" width="4" height="10" fill="#e889b6" opacity="0.72"></rect><rect x="1264" y="384" width="4" height="13" fill="#3fc1a5" opacity="0.72"></rect><rect x="1269" y="386" width="4" height="11" fill="#e8c37a" opacity="0.72"></rect><rect x="1274" y="385" width="3" height="12" fill="#e889b6" opacity="0.72"></rect><rect x="1278" y="387" width="3" height="10" fill="#3fc1a5" opacity="0.72"></rect><rect x="1282" y="384" width="4" height="13" fill="#8fa8e0" opacity="0.72"></rect><rect x="1287" y="384" width="4" height="13" fill="#e889b6" opacity="0.72"></rect><rect x="1292" y="385" width="4" height="12" fill="#e8c37a" opacity="0.72"></rect><rect x="1297" y="386" width="3" height="11" fill="#e8c37a" opacity="0.72"></rect><rect x="1301" y="385" width="4" height="12" fill="#3fc1a5" opacity="0.72"></rect><rect x="1306" y="387" width="5" height="10" fill="#e889b6" opacity="0.72"></rect><rect x="1312" y="387" width="5" height="10" fill="#c4cfe2" opacity="0.72"></rect><rect x="1252" y="397" width="70" height="2" fill="#56709c"></rect><rect x="1156" y="382" width="56" height="4" rx="1" fill="#56709c"></rect><rect x="1160" y="386" width="3" height="12" fill="#1b2840"></rect><rect x="1205" y="386" width="3" height="12" fill="#1b2840"></rect><path d="M1166 382 L1166 368 L1174 364" fill="none" stroke="#56709c" stroke-width="1.5"></path><path d="M1170 362 L1180 362 L1177 367 L1173 367 Z" fill="#e8c37a" opacity="0.9"></path><path d="M1168 367 L1184 382 L1160 382 Z" fill="#e8c37a" opacity="0.08"></path><rect x="1188" y="378.0" width="14" height="3" rx="0.5" fill="#8fa8e0" opacity="0.75"></rect><rect x="1188" y="374.5" width="12" height="3" rx="0.5" fill="#7d5a3a" opacity="0.75"></rect><rect x="1188" y="371.0" width="15" height="3" rx="0.5" fill="#e889b6" opacity="0.75"></rect><rect x="1215" y="378" width="6" height="14" rx="2" fill="#2a3a56"></rect><rect x="1214" y="389" width="18" height="4" rx="2" fill="#2a3a56"></rect><rect x="1223" y="393" width="3" height="5" fill="#1d2534"></rect></g>
<rect x="1345" y="334" width="246" height="4" fill="#2a3446"></rect><rect x="1348" y="338" width="240" height="64" fill="url(#g6wall)"></rect><path d="M1384 342V398 M1420 342V398 M1456 342V398 M1492 342V398 M1528 342V398 M1564 342V398" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1348" y="338" width="240" height="34" fill="url(#g6light)"></rect><rect x="1358" y="339" width="220" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="1348" y="398" width="240" height="4" fill="#4a5874"></rect><path d="M1348 398.5H1588" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1345" y="402" width="246" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="1530" y="344" width="42" height="22" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1532" y="346" width="38" height="18" rx="2" fill="#8fa8e0" fill-opacity="0.14"></rect><path d="M1534 355 q5 -9 10 0 t10 0 t10 0" fill="none" stroke="#8fa8e0" stroke-width="1.4"></path><rect x="1506" y="381" width="70" height="4" rx="1" fill="#56709c"></rect><rect x="1510" y="385" width="3" height="13" fill="#1b2840"></rect><rect x="1568" y="385" width="3" height="13" fill="#1b2840"></rect><rect x="1514" y="369" width="7" height="12" rx="2" fill="none" stroke="#9fb3d1" stroke-width="1" opacity="0.8"></rect><rect x="1515" y="375" width="5" height="6" fill="#3fc1a5" opacity="0.75"></rect><rect x="1524" y="372" width="7" height="9" rx="2" fill="none" stroke="#9fb3d1" stroke-width="1" opacity="0.8"></rect><rect x="1525" y="377" width="5" height="4" fill="#e889b6" opacity="0.75"></rect><rect x="1534" y="367" width="7" height="14" rx="2" fill="none" stroke="#9fb3d1" stroke-width="1" opacity="0.8"></rect><rect x="1535" y="374" width="5" height="7" fill="#8fa8e0" opacity="0.75"></rect><rect x="1546" y="373" width="7" height="8" rx="2" fill="none" stroke="#9fb3d1" stroke-width="1" opacity="0.8"></rect><rect x="1547" y="377" width="5" height="4" fill="#3fc1a5" opacity="0.75"></rect><rect x="1406" y="352" width="26" height="46" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1409" y="356" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1410" y="360" width="4" height="2.5" fill="#3fc1a5" opacity="0.8"></rect><rect x="1417" y="356" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1418" y="360" width="4" height="2.5" fill="#e8c37a" opacity="0.8"></rect><rect x="1425" y="356" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1426" y="360" width="4" height="2.5" fill="#e8c37a" opacity="0.8"></rect><rect x="1409" y="366" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1410" y="370" width="4" height="2.5" fill="#e8c37a" opacity="0.8"></rect><rect x="1417" y="366" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1418" y="370" width="4" height="2.5" fill="#3fc1a5" opacity="0.8"></rect><rect x="1425" y="366" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1426" y="370" width="4" height="2.5" fill="#3fc1a5" opacity="0.8"></rect><rect x="1409" y="376" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1410" y="380" width="4" height="2.5" fill="#e8c37a" opacity="0.8"></rect><rect x="1417" y="376" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1418" y="380" width="4" height="2.5" fill="#3fc1a5" opacity="0.8"></rect><rect x="1425" y="376" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1426" y="380" width="4" height="2.5" fill="#e889b6" opacity="0.8"></rect><rect x="1409" y="386" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1410" y="390" width="4" height="2.5" fill="#3fc1a5" opacity="0.8"></rect><rect x="1417" y="386" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1418" y="390" width="4" height="2.5" fill="#e889b6" opacity="0.8"></rect><rect x="1425" y="386" width="6" height="7" rx="1" fill="none" stroke="#9fb3d1" stroke-width="0.8" opacity="0.7"></rect><rect x="1426" y="390" width="4" height="2.5" fill="#8fa8e0" opacity="0.8"></rect><rect x="1440" y="382" width="50" height="4" rx="1" fill="#56709c"></rect><rect x="1444" y="386" width="3" height="12" fill="#1b2840"></rect><rect x="1483" y="386" width="3" height="12" fill="#1b2840"></rect><path d="M1456 382 h12 M1462 382 v-4 M1459 378 l6 -12 M1464 364 l-3 -5" stroke="#c4cfe2" stroke-width="2.2" stroke-linecap="round" opacity="0.8"></path><circle cx="1465" cy="366" r="2" fill="#8fa8e0"></circle></g>
<rect x="1599" y="334" width="246" height="4" fill="#2a3446"></rect><rect x="1602" y="338" width="240" height="64" fill="url(#g6wall)"></rect><path d="M1638 342V398 M1674 342V398 M1710 342V398 M1746 342V398 M1782 342V398 M1818 342V398" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1602" y="338" width="240" height="34" fill="url(#g6light)"></rect><rect x="1612" y="339" width="220" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="1602" y="398" width="240" height="4" fill="#4a5874"></rect><path d="M1602 398.5H1842" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1599" y="402" width="246" height="4" fill="#1d2534"></rect>
<g opacity="1"><circle cx="1804" cy="364" r="17" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></circle><circle cx="1804" cy="364" r="11" fill="none" stroke="#e889b6" stroke-width="1" opacity="0.5"></circle><circle cx="1804" cy="364" r="5" fill="none" stroke="#e889b6" stroke-width="1" opacity="0.5"></circle><path d="M1804 364 L1816 352" stroke="#e889b6" stroke-width="1.6" opacity="0.9"></path><circle class="pulse" cx="1797" cy="369" r="2" fill="#e889b6"></circle><path d="M1756 398 L1756 390 L1764 384 L1786 384 L1786 398 Z" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></path><rect x="1765" y="385" width="18" height="2.5" rx="1" fill="#e889b6" opacity="0.85"></rect><rect x="1766" y="391" width="6" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><rect x="1658" y="344" width="78" height="30" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1660" y="346" width="74" height="26" rx="2" fill="#e889b6" fill-opacity="0.14"></rect><polyline points="1662,359 1668,365 1674,367 1680,360 1686,355 1692,350 1698,352 1704,358 1710,365 1716,366 1722,362 1728,353" fill="none" stroke="#e889b6" stroke-width="1.3"></polyline><path d="M1662 368H1732" stroke="#e889b6" stroke-opacity="0.3"></path><rect x="1689" y="378" width="6" height="14" rx="2" fill="#2a3a56"></rect><rect x="1688" y="389" width="18" height="4" rx="2" fill="#2a3a56"></rect><rect x="1697" y="393" width="3" height="5" fill="#1d2534"></rect></g>
<rect x="1853" y="334" width="246" height="4" fill="#2a3446"></rect><rect x="1856" y="338" width="240" height="64" fill="url(#g6walloff)"></rect><path d="M1892 342V398 M1928 342V398 M1964 342V398 M2000 342V398 M2036 342V398 M2072 342V398" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1856" y="398" width="240" height="4" fill="#4a5874"></rect><path d="M1856 398.5H2096" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1853" y="402" width="246" height="4" fill="#1d2534"></rect>
<g opacity="0.42"><rect x="2024" y="344" width="50" height="20" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="2026" y="346" width="46" height="16" rx="2" fill="#3fc1a5" fill-opacity="0.14"></rect><polyline points="2028,354 2038,354 2041,348 2045,360 2048,354 2068,354" fill="none" stroke="#3fc1a5" stroke-width="1.4"></polyline><rect x="2014" y="380" width="64" height="7" rx="3" fill="#3a4c6e" stroke="#56709c" stroke-width="1"></rect><rect x="2016" y="377" width="12" height="4" rx="2" fill="#c4cfe2" opacity="0.7"></rect><rect x="2040" y="387" width="16" height="11" fill="#1b2840"></rect><rect x="1914" y="348" width="30" height="34" rx="2" fill="#dfe7f3" fill-opacity="0.16" stroke="#3d5580" stroke-width="1.2"></rect><path d="M1929 357v14 M1922 364h14" stroke="#ff8a8a" stroke-width="3"></path><path d="M1960 398 v-46 M1956 398 h8 M1960 352 h8" stroke="#56709c" stroke-width="1.6"></path><rect x="1964" y="354" width="7" height="11" rx="2" fill="#3fc1a5" opacity="0.45"></rect><path d="M1967 365 q2 10 -4 18" fill="none" stroke="#3fc1a5" stroke-width="0.8" opacity="0.6"></path><rect x="1976" y="378" width="28" height="4" rx="1" fill="#56709c"></rect><rect x="1978" y="382" width="3" height="16" fill="#1b2840"></rect><rect x="1999" y="382" width="3" height="16" fill="#1b2840"></rect><rect x="1982" y="374" width="8" height="4" rx="1" fill="#c4cfe2" opacity="0.6"></rect></g>
<rect x="827" y="430" width="246" height="4" fill="#2a3446"></rect><rect x="830" y="434" width="240" height="64" fill="url(#g6walloff)"></rect><path d="M866 438V494 M902 438V494 M938 438V494 M974 438V494 M1010 438V494 M1046 438V494" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="830" y="494" width="240" height="4" fill="#4a5874"></rect><path d="M830 494.5H1070" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="827" y="498" width="246" height="4" fill="#1d2534"></rect>
<g opacity="0.42"><rect x="980" y="438" width="78" height="54" fill="url(#g5holo)" opacity="0.75" stroke="#f0c048" stroke-opacity="0.5"></rect><rect x="1012" y="490" width="14" height="4" fill="#f0c048" opacity="0.8"></rect><rect x="890" y="454" width="22" height="30" rx="2" fill="#2a3a56" stroke="#f0c048" stroke-opacity="0.6" stroke-width="1.2"></rect><rect x="894" y="459" width="5" height="3" rx="1" fill="#f0c048" opacity="0.8"></rect><rect x="901" y="459" width="5" height="3" rx="1" fill="#e889b6" opacity="0.8"></rect><rect x="894" y="465" width="5" height="3" rx="1" fill="#f0c048" opacity="0.8"></rect><rect x="901" y="465" width="5" height="3" rx="1" fill="#f0c048" opacity="0.8"></rect><rect x="894" y="471" width="5" height="3" rx="1" fill="#8fa8e0" opacity="0.8"></rect><rect x="901" y="471" width="5" height="3" rx="1" fill="#8fa8e0" opacity="0.8"></rect><rect x="894" y="477" width="5" height="3" rx="1" fill="#f0c048" opacity="0.8"></rect><rect x="901" y="477" width="5" height="3" rx="1" fill="#8fa8e0" opacity="0.8"></rect><path d="M922 494 L926 444" stroke="#f0c048" stroke-opacity="0.18" stroke-width="1"></path><path d="M934 494 L938 444" stroke="#f0c048" stroke-opacity="0.18" stroke-width="1"></path><path d="M946 494 L950 444" stroke="#f0c048" stroke-opacity="0.18" stroke-width="1"></path><path d="M958 494 L962 444" stroke="#f0c048" stroke-opacity="0.18" stroke-width="1"></path><path d="M970 494 L974 444" stroke="#f0c048" stroke-opacity="0.18" stroke-width="1"></path></g>
<rect x="1081" y="430" width="246" height="4" fill="#2a3446"></rect><rect x="1084" y="434" width="240" height="64" fill="url(#g6wall)"></rect><path d="M1120 438V494 M1156 438V494 M1192 438V494 M1228 438V494 M1264 438V494 M1300 438V494" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="1084" y="434" width="240" height="34" fill="url(#g6light)"></rect><rect x="1094" y="435" width="220" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="1084" y="494" width="240" height="4" fill="#4a5874"></rect><path d="M1084 494.5H1324" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="1081" y="498" width="246" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="1234" y="436" width="78" height="40" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1236" y="438" width="74" height="36" rx="2" fill="#e889b6" fill-opacity="0.14"></rect><circle cx="1303" cy="472" r="1.3" fill="#ffffff" opacity="0.8"></circle><circle cx="1266" cy="456" r="1.3" fill="#ffffff" opacity="0.8"></circle><circle cx="1269" cy="455" r="0.8" fill="#ffffff" opacity="0.8"></circle><circle cx="1303" cy="470" r="0.8" fill="#ffffff" opacity="0.8"></circle><circle cx="1242" cy="454" r="1" fill="#ffffff" opacity="0.8"></circle><circle cx="1278" cy="454" r="1" fill="#ffffff" opacity="0.8"></circle><circle cx="1303" cy="446" r="0.8" fill="#ffffff" opacity="0.8"></circle><circle cx="1249" cy="468" r="0.8" fill="#ffffff" opacity="0.8"></circle><circle cx="1281" cy="461" r="0.8" fill="#ffffff" opacity="0.8"></circle><circle cx="1290" cy="456" r="0.8" fill="#ffffff" opacity="0.8"></circle><circle cx="1267" cy="447" r="0.8" fill="#ffffff" opacity="0.8"></circle><circle cx="1265" cy="461" r="1" fill="#ffffff" opacity="0.8"></circle><circle cx="1283" cy="452" r="1.3" fill="#ffffff" opacity="0.8"></circle><circle cx="1296" cy="469" r="1" fill="#ffffff" opacity="0.8"></circle><circle cx="1274" cy="449" r="1" fill="#ffffff" opacity="0.8"></circle><circle cx="1259" cy="472" r="0.8" fill="#ffffff" opacity="0.8"></circle><ellipse cx="1272" cy="456" rx="22" ry="9" fill="none" stroke="#e889b6" stroke-width="1" opacity="0.7"></ellipse><circle cx="1272" cy="456" r="3.5" fill="#e8c37a"></circle><circle cx="1292" cy="459" r="2" fill="#e889b6"></circle><path d="M1246 494 L1246 488 L1254 482 L1302 482 L1302 494 Z" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></path><rect x="1255" y="483" width="44" height="2.5" rx="1" fill="#e889b6" opacity="0.85"></rect><rect x="1256" y="489" width="6" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><rect x="1265" y="489" width="6" height="2.5" rx="1" fill="#f0a948" opacity="0.7"></rect><rect x="1274" y="489" width="6" height="2.5" rx="1" fill="#e889b6" opacity="0.7"></rect><rect x="1283" y="489" width="6" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><circle cx="1170" cy="464" r="17" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></circle><ellipse cx="1170" cy="464" rx="17" ry="6" fill="none" stroke="#e889b6" stroke-width="0.8" opacity="0.6"></ellipse><ellipse cx="1170" cy="464" rx="6" ry="17" fill="none" stroke="#e889b6" stroke-width="0.8" opacity="0.6"></ellipse><circle cx="1175" cy="456" r="0.9" fill="#ffffff" opacity="0.8"></circle><circle cx="1163" cy="472" r="0.9" fill="#ffffff" opacity="0.8"></circle><circle cx="1163" cy="465" r="0.9" fill="#ffffff" opacity="0.8"></circle><circle cx="1177" cy="455" r="0.9" fill="#ffffff" opacity="0.8"></circle><circle cx="1179" cy="463" r="0.9" fill="#ffffff" opacity="0.8"></circle><circle cx="1168" cy="464" r="0.9" fill="#ffffff" opacity="0.8"></circle><circle cx="1175" cy="476" r="0.9" fill="#ffffff" opacity="0.8"></circle><circle cx="1169" cy="461" r="0.9" fill="#ffffff" opacity="0.8"></circle><path d="M1170 481 v10 M1160 494 L1170 491 L1180 494" fill="none" stroke="#56709c" stroke-width="2"></path><rect x="1197" y="474" width="6" height="14" rx="2" fill="#2a3a56"></rect><rect x="1196" y="485" width="18" height="4" rx="2" fill="#2a3a56"></rect><rect x="1205" y="489" width="3" height="5" fill="#1d2534"></rect></g>
<rect x="107" y="728" width="206" height="4" fill="#2a3446"></rect><rect x="110" y="732" width="200" height="64" fill="url(#g6walloff)"></rect><path d="M146 736V792 M182 736V792 M218 736V792 M254 736V792 M290 736V792" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="110" y="792" width="200" height="4" fill="#4a5874"></rect><path d="M110 792.5H310" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="107" y="796" width="206" height="4" fill="#1d2534"></rect>
<g opacity="0.42"><path d="M170 740H302 M170 746H302" stroke="#56709c" stroke-width="3"></path><circle cx="276" cy="768" r="16" fill="#0b1322" stroke="#3d5580" stroke-width="1.5"></circle><path d="M276 768 L290 765" stroke="#3fc1a5" stroke-width="3" opacity="0.6" transform="rotate(0 276 768)"></path><path d="M276 768 L290 765" stroke="#3fc1a5" stroke-width="3" opacity="0.6" transform="rotate(90 276 768)"></path><path d="M276 768 L290 765" stroke="#3fc1a5" stroke-width="3" opacity="0.6" transform="rotate(180 276 768)"></path><path d="M276 768 L290 765" stroke="#3fc1a5" stroke-width="3" opacity="0.6" transform="rotate(270 276 768)"></path><rect x="232" y="756" width="20" height="36" rx="8" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><path d="M172 746 V792 M182 746 V792" stroke="#56709c" stroke-width="3"></path><circle cx="177" cy="768" r="7" fill="none" stroke="#e8c37a" stroke-width="2" opacity="0.8"></circle><path d="M170 768h14 M177 761v14" stroke="#e8c37a" stroke-width="1.2" opacity="0.8"></path><rect x="194" y="758" width="16" height="34" rx="7" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><rect x="197" y="772" width="10" height="3" rx="1" fill="#3fc1a5" opacity="0.8"></rect></g>
<rect x="319" y="728" width="206" height="4" fill="#2a3446"></rect><rect x="322" y="732" width="200" height="64" fill="url(#g6wall)"></rect><path d="M358 736V792 M394 736V792 M430 736V792 M466 736V792 M502 736V792" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="322" y="732" width="200" height="34" fill="url(#g6light)"></rect><rect x="332" y="733" width="180" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="322" y="792" width="200" height="4" fill="#4a5874"></rect><path d="M322 792.5H522" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="319" y="796" width="206" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="494" y="744" width="18" height="48" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="507" y="766" width="2" height="7" fill="#8fa8e0" opacity="0.8"></rect><path d="M498 748h10 M498 751h10 M498 754h10" stroke="#0a1222" stroke-width="1"></path><rect x="474" y="744" width="18" height="48" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="487" y="766" width="2" height="7" fill="#8fa8e0" opacity="0.8"></rect><path d="M478 748h10 M478 751h10 M478 754h10" stroke="#0a1222" stroke-width="1"></path><path d="M418 792 L418 756 Q430 742 442 756 L442 792" fill="none" stroke="#56709c" stroke-width="4"></path><path d="M418 756 Q430 742 442 756" fill="none" stroke="#8fa8e0" stroke-width="1.5" opacity="0.9"></path><rect x="421" y="758" width="18" height="34" fill="#8fa8e0" opacity="0.08"></rect><rect x="376" y="738" width="32" height="16" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="378" y="740" width="28" height="12" rx="2" fill="#8fa8e0" fill-opacity="0.14"></rect><rect x="380" y="742" width="24" height="2.5" rx="1" fill="#8fa8e0" opacity="0.7"></rect><rect x="380" y="747" width="12" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><rect x="376" y="758" width="32" height="16" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="378" y="760" width="28" height="12" rx="2" fill="#8fa8e0" fill-opacity="0.14"></rect><rect x="380" y="762" width="18" height="2.5" rx="1" fill="#8fa8e0" opacity="0.7"></rect><rect x="380" y="767" width="18" height="2.5" rx="1" fill="#8fa8e0" opacity="0.7"></rect></g>
<rect x="597" y="728" width="206" height="4" fill="#2a3446"></rect><rect x="600" y="732" width="200" height="64" fill="url(#g6wall)"></rect><path d="M636 736V792 M672 736V792 M708 736V792 M744 736V792 M780 736V792" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="600" y="732" width="200" height="34" fill="url(#g6light)"></rect><rect x="610" y="733" width="180" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="600" y="792" width="200" height="4" fill="#4a5874"></rect><path d="M600 792.5H800" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="597" y="796" width="206" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="722" y="772" width="22" height="20" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><path d="M722 772 L744 792 M744 772 L722 792" stroke="#16223a" stroke-width="1"></path><rect x="724" y="774" width="11" height="2" fill="#3fc1a5" opacity="0.8"></rect><rect x="746" y="772" width="22" height="20" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><path d="M746 772 L768 792 M768 772 L746 792" stroke="#16223a" stroke-width="1"></path><rect x="748" y="774" width="11" height="2" fill="#3fc1a5" opacity="0.8"></rect><rect x="734" y="754" width="22" height="18" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><path d="M734 754 L756 772 M756 754 L734 772" stroke="#16223a" stroke-width="1"></path><rect x="736" y="756" width="11" height="2" fill="#3fc1a5" opacity="0.8"></rect><rect x="770" y="778" width="16" height="14" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><path d="M770 778 L786 792 M786 778 L770 792" stroke="#16223a" stroke-width="1"></path><rect x="772" y="780" width="8" height="2" fill="#3fc1a5" opacity="0.8"></rect><rect x="658" y="746" width="34" height="46" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="661" y="750" width="7" height="10" rx="2" fill="#c4cfe2" opacity="0.65"></rect><rect x="671" y="750" width="7" height="10" rx="2" fill="#e8c37a" opacity="0.65"></rect><rect x="681" y="750" width="7" height="10" rx="2" fill="#f0a948" opacity="0.65"></rect><rect x="661" y="765" width="7" height="10" rx="2" fill="#e8c37a" opacity="0.65"></rect><rect x="671" y="765" width="7" height="10" rx="2" fill="#7d5a3a" opacity="0.65"></rect><rect x="681" y="765" width="7" height="10" rx="2" fill="#c4cfe2" opacity="0.65"></rect><rect x="661" y="780" width="7" height="10" rx="2" fill="#c4cfe2" opacity="0.65"></rect><rect x="671" y="780" width="7" height="10" rx="2" fill="#c4cfe2" opacity="0.65"></rect><rect x="681" y="780" width="7" height="10" rx="2" fill="#e8c37a" opacity="0.65"></rect><rect x="658" y="761" width="34" height="2" fill="#56709c"></rect><rect x="658" y="776" width="34" height="2" fill="#56709c"></rect><rect x="700" y="784" width="16" height="8" rx="1" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><rect x="703" y="786" width="10" height="3" fill="#070d18"></rect><rect x="704" y="786.5" width="5" height="2" fill="#3fc1a5"></rect></g>
<rect x="809" y="728" width="206" height="4" fill="#2a3446"></rect><rect x="812" y="732" width="200" height="64" fill="url(#g6walloff)"></rect><path d="M848 736V792 M884 736V792 M920 736V792 M956 736V792 M992 736V792" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="812" y="792" width="200" height="4" fill="#4a5874"></rect><path d="M812 792.5H1012" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="809" y="796" width="206" height="4" fill="#1d2534"></rect>
<g opacity="0.42"><rect x="944" y="740" width="54" height="22" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="946" y="742" width="50" height="18" rx="2" fill="#3fc1a5" fill-opacity="0.14"></rect><polyline points="948,750 952,747 956,753 960,750 964,747 968,747 972,750 976,756 980,744 984,753 988,747 992,744" fill="none" stroke="#3fc1a5" stroke-width="1.3"></polyline><path d="M940 792 L940 782 L948 776 L1000 776 L1000 792 Z" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></path><rect x="949" y="777" width="48" height="2.5" rx="1" fill="#3fc1a5" opacity="0.85"></rect><rect x="950" y="783" width="6" height="2.5" rx="1" fill="#8fa8e0" opacity="0.7"></rect><rect x="959" y="783" width="6" height="2.5" rx="1" fill="#8fa8e0" opacity="0.7"></rect><rect x="968" y="783" width="6" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><rect x="977" y="783" width="6" height="2.5" rx="1" fill="#e8c37a" opacity="0.7"></rect><rect x="870" y="744" width="28" height="48" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="873" y="748" width="22" height="6" rx="1" fill="#070d18"></rect><rect x="875" y="750" width="10" height="2" fill="#3fc1a5" opacity="0.8"></rect><circle cx="892" cy="751" r="1.5" fill="#ff8a8a"></circle><rect x="873" y="757" width="22" height="6" rx="1" fill="#070d18"></rect><rect x="875" y="759" width="14" height="2" fill="#3fc1a5" opacity="0.8"></rect><circle cx="892" cy="760" r="1.5" fill="#e8c37a"></circle><rect x="873" y="766" width="22" height="6" rx="1" fill="#070d18"></rect><rect x="875" y="768" width="6" height="2" fill="#3fc1a5" opacity="0.8"></rect><circle cx="892" cy="769" r="1.5" fill="#e8c37a"></circle><rect x="873" y="775" width="22" height="6" rx="1" fill="#070d18"></rect><rect x="875" y="777" width="10" height="2" fill="#3fc1a5" opacity="0.8"></rect><circle cx="892" cy="778" r="1.5" fill="#e8c37a"></circle><rect x="873" y="784" width="22" height="6" rx="1" fill="#070d18"></rect><rect x="875" y="786" width="10" height="2" fill="#3fc1a5" opacity="0.8"></rect><circle cx="892" cy="787" r="1.5" fill="#e8c37a"></circle><rect x="907" y="772" width="6" height="14" rx="2" fill="#2a3a56"></rect><rect x="906" y="783" width="18" height="4" rx="2" fill="#2a3a56"></rect><rect x="915" y="787" width="3" height="5" fill="#1d2534"></rect></g>
<rect x="107" y="824" width="206" height="4" fill="#2a3446"></rect><rect x="110" y="828" width="200" height="64" fill="url(#g6wall)"></rect><path d="M146 832V888 M182 832V888 M218 832V888 M254 832V888 M290 832V888" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="110" y="828" width="200" height="34" fill="url(#g6light)"></rect><rect x="120" y="829" width="180" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="110" y="888" width="200" height="4" fill="#4a5874"></rect><path d="M110 888.5H310" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="107" y="892" width="206" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="282" y="840" width="18" height="48" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="295" y="862" width="2" height="7" fill="#8fa8e0" opacity="0.8"></rect><path d="M286 844h10 M286 847h10 M286 850h10" stroke="#0a1222" stroke-width="1"></path><rect x="262" y="840" width="18" height="48" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="275" y="862" width="2" height="7" fill="#8fa8e0" opacity="0.8"></rect><path d="M266 844h10 M266 847h10 M266 850h10" stroke="#0a1222" stroke-width="1"></path><rect x="242" y="840" width="18" height="48" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="255" y="862" width="2" height="7" fill="#8fa8e0" opacity="0.8"></rect><path d="M246 844h10 M246 847h10 M246 850h10" stroke="#0a1222" stroke-width="1"></path><rect x="168" y="874" width="56" height="4" rx="1" fill="#56709c"></rect><rect x="172" y="878" width="3" height="10" fill="#1b2840"></rect><rect x="217" y="878" width="3" height="10" fill="#1b2840"></rect><rect x="174" y="864" width="18" height="10" rx="2" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><rect x="196" y="866" width="22" height="8" rx="2" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><rect x="180" y="862" width="6" height="2" rx="1" fill="#56709c"></rect><rect x="170" y="838" width="50" height="14" rx="2" fill="#070d18" stroke="#3d5580" stroke-width="1"></rect><rect x="174" y="841" width="7" height="9" rx="1.5" fill="#3a4c6e"></rect><rect x="175" y="842" width="5" height="2" fill="#8fa8e0" opacity="0.8"></rect><rect x="185" y="841" width="7" height="9" rx="1.5" fill="#3a4c6e"></rect><rect x="186" y="842" width="5" height="2" fill="#8fa8e0" opacity="0.8"></rect><rect x="196" y="841" width="7" height="9" rx="1.5" fill="#3a4c6e"></rect><rect x="197" y="842" width="5" height="2" fill="#8fa8e0" opacity="0.8"></rect><rect x="207" y="841" width="7" height="9" rx="1.5" fill="#3a4c6e"></rect><rect x="208" y="842" width="5" height="2" fill="#8fa8e0" opacity="0.8"></rect></g>
<rect x="597" y="824" width="206" height="4" fill="#2a3446"></rect><rect x="600" y="828" width="200" height="64" fill="url(#g6wall)"></rect><path d="M636 832V888 M672 832V888 M708 832V888 M744 832V888 M780 832V888" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="600" y="828" width="200" height="34" fill="url(#g6light)"></rect><rect x="610" y="829" width="180" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="600" y="888" width="200" height="4" fill="#4a5874"></rect><path d="M600 888.5H800" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="597" y="892" width="206" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="704" y="830" width="82" height="22" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="706" y="832" width="78" height="18" rx="2" fill="#f0a948" fill-opacity="0.14"></rect><path d="M712 841 L732 841 L740 845 L764 845 M746 836 C756 832 772 834 778 840 L756 842" fill="none" stroke="#f0a948" stroke-width="1.3"></path><path d="M702 868 L788 864 L788 870 L702 874 Z" fill="#2a3a56" stroke="#56709c" stroke-width="1"></path><path d="M708 871 L782 867" stroke="#f0a948" stroke-width="2" opacity="0.8"></path><rect x="710" y="874" width="4" height="14" fill="#1b2840"></rect><rect x="778" y="870" width="4" height="18" fill="#1b2840"></rect><path d="M654 832 V888 M664 832 V888" stroke="#2a3a56" stroke-width="6"></path><path d="M654 832 V888 M664 832 V888" stroke="#f0a948" stroke-width="1.5" opacity="0.55" class="pulse"></path><circle cx="680" cy="854" r="8" fill="#0b1322" stroke="#56709c" stroke-width="1.5"></circle><path d="M680 854 L685 849" stroke="#f0a948" stroke-width="1.5"></path><path d="M664 854 H672" stroke="#56709c" stroke-width="2"></path></g>
<rect x="167" y="920" width="186" height="4" fill="#2a3446"></rect><rect x="170" y="924" width="180" height="64" fill="url(#g6walloff)"></rect><path d="M206 928V984 M242 928V984 M278 928V984 M314 928V984" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="170" y="984" width="180" height="4" fill="#4a5874"></rect><path d="M170 984.5H350" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="167" y="988" width="186" height="4" fill="#1d2534"></rect>
<g opacity="0.42"><path d="M276 960 L320 940 L326 952 L282 970 Z" fill="#2a3a56" stroke="#56709c" stroke-width="1"></path><path d="M286 962 L314 949 M292 966 L308 958" stroke="#e889b6" stroke-width="1.2" opacity="0.85"></path><path d="M302 964 L302 984 M292 984 H312" stroke="#1b2840" stroke-width="3"></path><rect x="226" y="930" width="36" height="24" rx="2" fill="#070d18" stroke="#3d5580" stroke-width="1"></rect><rect x="230" y="934" width="6" height="6" rx="1" fill="#3fc1a5" opacity="0.8"></rect><rect x="238" y="934" width="6" height="6" rx="1" fill="#f0a948" opacity="0.8"></rect><rect x="246" y="934" width="6" height="6" rx="1" fill="#e889b6" opacity="0.8"></rect><rect x="254" y="934" width="6" height="6" rx="1" fill="#8fa8e0" opacity="0.8"></rect><rect x="230" y="943" width="6" height="6" rx="1" fill="#e8c37a" opacity="0.8"></rect><rect x="238" y="943" width="6" height="6" rx="1" fill="#ff8a8a" opacity="0.8"></rect><rect x="246" y="943" width="6" height="6" rx="1" fill="#6fc0ff" opacity="0.8"></rect><rect x="254" y="943" width="6" height="6" rx="1" fill="#c4cfe2" opacity="0.8"></rect><rect x="234" y="970" width="16" height="4" rx="2" fill="#2a3a56"></rect><rect x="240" y="974" width="3" height="10" fill="#1d2534"></rect></g>
<rect x="357" y="920" width="186" height="4" fill="#2a3446"></rect><rect x="360" y="924" width="180" height="64" fill="url(#g6walloff)"></rect><path d="M396 928V984 M432 928V984 M468 928V984 M504 928V984" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="360" y="984" width="180" height="4" fill="#4a5874"></rect><path d="M360 984.5H540" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="357" y="988" width="186" height="4" fill="#1d2534"></rect>
<g opacity="0.42"><rect x="476" y="948" width="44" height="22" rx="3" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><rect x="479" y="951" width="28" height="16" fill="#070d18"></rect><path d="M480 959 q3.5 -6 7 0 t7 0 t7 0 t6 0" fill="none" stroke="#e889b6" stroke-width="1.2"></path><circle cx="514" cy="955" r="2.5" fill="#56709c"></circle><circle cx="514" cy="963" r="2.5" fill="#56709c"></circle><rect x="464" y="970" width="64" height="4" fill="#56709c"></rect><rect x="468" y="974" width="3" height="10" fill="#1b2840"></rect><rect x="520" y="974" width="3" height="10" fill="#1b2840"></rect><rect x="416" y="934" width="36" height="50" rx="1" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><circle cx="426" cy="944" r="5" fill="#0b1322" stroke="#56709c" stroke-width="1"></circle><path d="M426 944 l-3 -3" stroke="#e889b6" stroke-width="1.2"></path><circle cx="442" cy="944" r="5" fill="#0b1322" stroke="#56709c" stroke-width="1"></circle><path d="M442 944 l4 -3" stroke="#e889b6" stroke-width="1.2"></path><circle cx="426" cy="958" r="5" fill="#0b1322" stroke="#56709c" stroke-width="1"></circle><path d="M426 958 l3 -3" stroke="#e889b6" stroke-width="1.2"></path><circle cx="442" cy="958" r="5" fill="#0b1322" stroke="#56709c" stroke-width="1"></circle><path d="M442 958 l-3 -3" stroke="#e889b6" stroke-width="1.2"></path><circle cx="426" cy="972" r="5" fill="#0b1322" stroke="#56709c" stroke-width="1"></circle><path d="M426 972 l-3 -3" stroke="#e889b6" stroke-width="1.2"></path><circle cx="442" cy="972" r="5" fill="#0b1322" stroke="#56709c" stroke-width="1"></circle><path d="M442 972 l3 -3" stroke="#e889b6" stroke-width="1.2"></path></g>
<rect x="597" y="920" width="196" height="4" fill="#2a3446"></rect><rect x="600" y="924" width="190" height="64" fill="url(#g6wall)"></rect><path d="M636 928V984 M672 928V984 M708 928V984 M744 928V984 M780 928V984" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="600" y="924" width="190" height="34" fill="url(#g6light)"></rect><rect x="610" y="925" width="170" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="600" y="984" width="190" height="4" fill="#4a5874"></rect><path d="M600 984.5H790" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="597" y="988" width="196" height="4" fill="#1d2534"></rect>
<g opacity="1"><circle cx="768" cy="970" r="11" fill="#0b1322" stroke="#56709c" stroke-width="2"></circle><path d="M761 970h14 M768 963v14" stroke="#3d5580" stroke-width="1.5"></path><rect x="716" y="934" width="40" height="20" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="718" y="936" width="36" height="16" rx="2" fill="#f0a948" fill-opacity="0.14"></rect><path d="M720 944h10 v-5 h8 v8 h10" fill="none" stroke="#f0a948" stroke-width="1.3"></path><path d="M712 984 L712 974 L720 968 L752 968 L752 984 Z" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></path><rect x="721" y="969" width="28" height="2.5" rx="1" fill="#f0a948" opacity="0.85"></rect><rect x="722" y="975" width="6" height="2.5" rx="1" fill="#3fc1a5" opacity="0.7"></rect><rect x="731" y="975" width="6" height="2.5" rx="1" fill="#e889b6" opacity="0.7"></rect><rect x="656" y="932" width="22" height="52" rx="1" fill="#16223a" stroke="#3d5580" stroke-width="1.2"></rect><rect x="659" y="936" width="16" height="4" rx="1" fill="#070d18"></rect><rect x="660" y="937" width="9" height="2" fill="#f0a948" opacity="0.7"></rect><rect x="659" y="943" width="16" height="4" rx="1" fill="#070d18"></rect><rect x="660" y="944" width="3" height="2" fill="#f0a948" opacity="0.7"></rect><rect x="659" y="950" width="16" height="4" rx="1" fill="#070d18"></rect><rect x="660" y="951" width="6" height="2" fill="#f0a948" opacity="0.4"></rect><rect x="659" y="957" width="16" height="4" rx="1" fill="#070d18"></rect><rect x="660" y="958" width="6" height="2" fill="#f0a948" opacity="0.9"></rect><rect x="659" y="964" width="16" height="4" rx="1" fill="#070d18"></rect><rect x="660" y="965" width="3" height="2" fill="#f0a948" opacity="0.4"></rect><rect x="659" y="971" width="16" height="4" rx="1" fill="#070d18"></rect><rect x="660" y="972" width="6" height="2" fill="#f0a948" opacity="0.7"></rect><rect x="659" y="978" width="16" height="4" rx="1" fill="#070d18"></rect><rect x="660" y="979" width="6" height="2" fill="#f0a948" opacity="0.7"></rect><path d="M678 934 H706 M678 938 q14 4 28 0" fill="none" stroke="#56709c" stroke-width="1.5"></path></g>
<rect x="797" y="920" width="196" height="4" fill="#2a3446"></rect><rect x="800" y="924" width="190" height="64" fill="url(#g6wall)"></rect><path d="M836 928V984 M872 928V984 M908 928V984 M944 928V984 M980 928V984" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="800" y="924" width="190" height="34" fill="url(#g6light)"></rect><rect x="810" y="925" width="170" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="800" y="984" width="190" height="4" fill="#4a5874"></rect><path d="M800 984.5H990" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="797" y="988" width="196" height="4" fill="#1d2534"></rect>
<g opacity="1"><rect x="922" y="932" width="52" height="30" rx="3" fill="#070d18" stroke="#3d5580" stroke-width="1.2"></rect><rect x="924" y="934" width="48" height="26" rx="2" fill="#f0a948" fill-opacity="0.14"></rect><rect x="926" y="948" width="6" height="10" fill="#f0a948" opacity="0.75"></rect><rect x="935" y="942" width="6" height="16" fill="#f0a948" opacity="0.75"></rect><rect x="944" y="951" width="6" height="7" fill="#f0a948" opacity="0.75"></rect><rect x="953" y="938" width="6" height="20" fill="#f0a948" opacity="0.75"></rect><rect x="962" y="945" width="6" height="13" fill="#f0a948" opacity="0.75"></rect><path d="M922 984 L922 978 L930 972 L974 972 L974 984 Z" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></path><rect x="931" y="973" width="40" height="2.5" rx="1" fill="#f0a948" opacity="0.85"></rect><rect x="932" y="979" width="6" height="2.5" rx="1" fill="#e889b6" opacity="0.7"></rect><rect x="941" y="979" width="6" height="2.5" rx="1" fill="#e889b6" opacity="0.7"></rect><rect x="950" y="979" width="6" height="2.5" rx="1" fill="#3fc1a5" opacity="0.7"></rect><rect x="959" y="979" width="6" height="2.5" rx="1" fill="#3fc1a5" opacity="0.7"></rect><rect x="858" y="958" width="30" height="4" rx="1" fill="#56709c"></rect><rect x="858" y="972" width="30" height="3" rx="1" fill="#56709c"></rect><path d="M860 962V980 M886 962V980" stroke="#1b2840" stroke-width="2"></path><circle cx="862" cy="982" r="2" fill="#1d2534"></circle><circle cx="884" cy="982" r="2" fill="#1d2534"></circle><path d="M866 958 l10 -10" stroke="#c4cfe2" stroke-width="2" stroke-linecap="round" opacity="0.8"></path><circle cx="877" cy="947" r="2" fill="#f0a948"></circle><rect x="896" y="964" width="20" height="12" rx="2" fill="#2a3a56" stroke="#56709c" stroke-width="1"></rect><rect x="899" y="958" width="14" height="7" fill="#c4cfe2" opacity="0.6"></rect><rect x="900" y="976" width="3" height="8" fill="#1b2840"></rect><rect x="909" y="976" width="3" height="8" fill="#1b2840"></rect></g>
<g><rect x="1016" y="546" width="24" height="44" rx="2" fill="#1b2840" stroke="#3d5580" stroke-width="1.2"></rect><rect x="1020" y="552" width="16" height="14" rx="2" fill="#070d18"></rect><rect x="1022" y="562" width="12" height="2" fill="#3fc1a5" opacity="0.8"></rect><rect x="1058" y="574" width="52" height="10" rx="4" fill="#3a4c6e"></rect><rect x="1058" y="566" width="10" height="18" rx="3" fill="#3a4c6e"></rect><rect x="1100" y="566" width="10" height="18" rx="3" fill="#3a4c6e"></rect><rect x="1070" y="568" width="28" height="8" rx="3" fill="#8fa8e0" opacity="0.35"></rect><rect x="1062" y="584" width="3" height="6" fill="#1b2840"></rect><rect x="1103" y="584" width="3" height="6" fill="#1b2840"></rect><rect x="1116" y="581" width="20" height="3" rx="1" fill="#56709c"></rect><rect x="1124" y="584" width="4" height="6" fill="#1b2840"></rect><path d="M1040 590 L1041 580 L1051 580 L1052 590 Z" fill="#3a4c6e" stroke="#56709c" stroke-width="0.8"></path><path d="M1046 580 q-9 -6 -7 -17 M1046 580 q8 -8 5 -19 M1046 580 q2 -10 -1 -22 M1046 580 q-3 -4 -11 -6" fill="none" stroke="#3fa86a" stroke-width="2.2" stroke-linecap="round" opacity="0.85"></path></g>
<rect x="319" y="824" width="206" height="4" fill="#2a3446"></rect><rect x="322" y="828" width="200" height="64" fill="url(#g6wall)"></rect><path d="M358 832V888 M394 832V888 M430 832V888 M466 832V888 M502 832V888" stroke="#000000" stroke-opacity="0.22" stroke-width="1"></path><rect x="322" y="828" width="200" height="34" fill="url(#g6light)"></rect><rect x="332" y="829" width="180" height="2" rx="1" fill="#e6f1ff" opacity="0.55"></rect><rect x="322" y="888" width="200" height="4" fill="#4a5874"></rect><path d="M322 888.5H522" stroke="#a3b2cc" stroke-opacity="0.5" stroke-width="1"></path><rect x="319" y="892" width="206" height="4" fill="#1d2534"></rect>
<rect x="349" y="832" width="26" height="40" fill="url(#g6beam)" class="core"></rect><rect x="389" y="832" width="26" height="40" fill="url(#g6beam)" class="core"></rect><rect x="429" y="832" width="26" height="40" fill="url(#g6beam)" class="core"></rect><rect x="469" y="832" width="26" height="40" fill="url(#g6beam)" class="core"></rect>
<rect x="530" y="708" width="62" height="288" fill="#070d18" stroke="#3d5580" stroke-width="1.5"></rect><path d="M530 804H592 M530 900H592" stroke="#4a5874" stroke-width="4"></path>
        </g>
        <g font-size="11" letter-spacing="1.8" fill="#8ea3c4">
          <text x="938" y="237"><tspan fill="#c8d6ec">02</tspan><tspan dx="12">COMMAND DECK</tspan></text>
          <text x="808" y="333"><tspan fill="#c8d6ec">03</tspan><tspan dx="12">SCIENCES, RECORDS &amp; SICKBAY</tspan></text>
          <text x="806" y="429"><tspan fill="#c8d6ec">04</tspan><tspan dx="12">HOLODECK, DESIGN &amp; MESS HALL</tspan></text>
          <text x="960" y="525"><tspan fill="#c8d6ec">05</tspan><tspan dx="12">CREW QUARTERS</tspan></text>
          <text x="116" y="727"><tspan fill="#c8d6ec">06</tspan><tspan dx="12">OPERATIONS &amp; CUSTOMS</tspan></text>
          <text x="116" y="823"><tspan fill="#c8d6ec">07</tspan><tspan dx="12">MAIN ENGINEERING · TRANSPORTER ROOM</tspan></text>
        </g>
        <g font-size="11" letter-spacing="1.8" fill="#c9a77a">
          <text x="176" y="919"><tspan fill="#f6c98a">08</tspan><tspan dx="12">LOWER DECKS</tspan></text>
          <text x="600" y="919">ENGINEERING ▸ CARDS FROM THE CHIEF ONLY</text>
        </g>

        <rect x="1150" y="292" width="316" height="7" rx="3.5" fill="#24375a" style="opacity: var(--table-glow)"></rect>
        <g style="opacity: var(--table-glow)">
          <circle cx="1176" cy="274" r="17" fill="none" stroke="#5a6f9f" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <circle cx="1220" cy="274" r="17" fill="none" stroke="#5a6f9f" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <circle cx="1264" cy="274" r="17" fill="none" stroke="#5a6f9f" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <circle cx="1308" cy="274" r="17" fill="none" stroke="#5a6f9f" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <circle cx="1352" cy="274" r="17" fill="none" stroke="#5a6f9f" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <circle cx="1396" cy="274" r="17" fill="none" stroke="#5a6f9f" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <circle cx="1440" cy="274" r="17" fill="none" stroke="#5a6f9f" stroke-width="1.2" stroke-dasharray="3 4"></circle>
        </g>

        <g>
          <rect x="1158" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1166" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1161" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1162" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1180" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1206" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1214" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1209" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1210" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1228" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1254" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1262" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1257" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1258" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1276" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1302" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1310" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1305" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1306" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1324" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1350" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1358" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1353" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1354" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1372" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1398" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1406" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1401" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1402" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1420" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1446" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1454" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1449" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1450" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1468" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1494" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1502" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1497" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1498" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1516" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1542" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1550" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1545" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1546" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1564" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1590" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1598" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1593" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1594" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1612" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1638" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1646" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1641" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1642" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1660" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1686" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1694" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1689" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1690" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1708" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1734" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1742" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1737" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1738" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1756" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1782" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1790" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1785" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1786" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1804" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1830" y="536" width="44" height="52" rx="7" fill="url(#g6wall)" stroke="#3a5684" stroke-width="1.5"></rect><rect x="1838" y="537.5" width="28" height="1.5" rx="0.75" fill="#e6f1ff" opacity="0.45"></rect><rect x="1833" y="578" width="38" height="6" rx="2" fill="#3a4c6e"></rect><rect x="1834" y="575" width="9" height="4" rx="1.5" fill="#8fa8e0" opacity="0.8"></rect><circle cx="1852" cy="562" r="17" fill="none" stroke="#3a5684" stroke-width="1.2" stroke-dasharray="3 4"></circle>
          <rect x="1878" y="536" width="44" height="52" rx="7" fill="none" stroke="#3a5684" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="4 4"></rect>
          <rect x="1926" y="536" width="44" height="52" rx="7" fill="none" stroke="#3a5684" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="4 4"></rect>
          <rect x="1974" y="536" width="44" height="52" rx="7" fill="none" stroke="#3a5684" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="4 4"></rect>
        </g>

        <rect x="1340" y="434" width="320" height="64" rx="8" fill="url(#g5holo)" stroke="#f0c048" stroke-opacity="0.55" stroke-width="1.5"></rect>
        <rect x="1360" y="456" width="280" height="20" fill="#0b0d08"></rect>
        <text x="1500" y="470" font-size="11" letter-spacing="1.8" fill="#f0c048" text-anchor="middle">HOLODECK · THE SHIP'S OWN SCREENS</text>
        <g>
<rect x="1669" y="430" width="484" height="4" fill="#2a3446"></rect>
<rect x="1672" y="434" width="478" height="64" fill="url(#g6wall)"></rect>
<rect x="1672" y="434" width="478" height="64" fill="#ffb066" opacity="0.05"></rect>
<rect x="1672" y="434" width="478" height="34" fill="url(#g6light)"></rect><rect x="1682" y="435" width="458" height="2" rx="1" fill="#ffe7c4" opacity="0.5"></rect>
<path d="M1888 438 L1928 438 L1924 472 L1884 472 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path>
<path d="M1909 463h6" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M1903 455h9" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M1896 455h6" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M1906 462h9" stroke="#cfe3ff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M1894 464h9" stroke="#cfe3ff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M1937 438 L1977 438 L1973 472 L1933 472 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path>
<path d="M1950 466h12" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M1955 458h12" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.7"></path>
<path d="M1961 465h6" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M1939 447h6" stroke="#cfe3ff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M1939 464h12" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M1986 438 L2026 438 L2022 472 L1982 472 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path>
<path d="M2005 444h6" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M1989 460h9" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M1995 444h12" stroke="#cfe3ff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M1995 451h12" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.7"></path>
<path d="M1998 446h12" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M2035 438 L2075 438 L2071 472 L2031 472 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path>
<path d="M2052 457h9" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.7"></path>
<path d="M2039 447h12" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M2051 463h9" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M2049 443h12" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M2043 452h6" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M2084 438 L2124 438 L2120 472 L2080 472 Z" fill="#03060d" stroke="#56709c" stroke-width="1.5"></path>
<path d="M2100 457h9" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.7"></path>
<path d="M2089 465h12" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<path d="M2088 463h12" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.9"></path>
<path d="M2106 460h6" stroke="#9fd0ff" stroke-width="1" stroke-linecap="round" opacity="0.7"></path>
<path d="M2086 449h6" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.5"></path>
<rect x="1676" y="440" width="28" height="54" rx="2" fill="#070d18" stroke="#56709c" stroke-width="1.5"></rect>
<rect x="1679" y="443" width="22" height="51" fill="#ffe7c4" opacity="0.35"></rect>
<rect class="mh mdl" x="1679" y="443" width="11" height="51" fill="#2a3a56" stroke="#56709c" stroke-width="0.8"></rect>
<rect class="mh mdr" x="1690" y="443" width="11" height="51" fill="#2a3a56" stroke="#56709c" stroke-width="0.8"></rect>
<rect x="1680" y="436" width="20" height="2.5" rx="1" fill="#e8c37a" opacity="0.85"></rect>
<rect x="1728" y="450" width="100" height="22" fill="#ffcc88" opacity="0.07"></rect>
<rect x="1730" y="442" width="4" height="8" rx="1" fill="#8fa8e0" opacity="0.75"></rect>
<rect x="1737" y="443" width="3" height="7" rx="1" fill="#e889b6" opacity="0.75"></rect>
<rect x="1743" y="443" width="3" height="7" rx="1" fill="#e8c37a" opacity="0.75"></rect>
<rect x="1749" y="444" width="4" height="6" rx="1" fill="#8fa8e0" opacity="0.75"></rect>
<rect x="1757" y="443" width="3" height="7" rx="1" fill="#c4cfe2" opacity="0.75"></rect>
<rect x="1762" y="444" width="3" height="6" rx="1" fill="#c4cfe2" opacity="0.75"></rect>
<rect x="1768" y="443" width="4" height="7" rx="1" fill="#e8c37a" opacity="0.75"></rect>
<rect x="1774" y="443" width="3" height="7" rx="1" fill="#e8c37a" opacity="0.75"></rect>
<rect x="1781" y="441" width="3" height="9" rx="1" fill="#f0a948" opacity="0.75"></rect>
<rect x="1787" y="441" width="3" height="9" rx="1" fill="#e8c37a" opacity="0.75"></rect>
<rect x="1794" y="441" width="4" height="9" rx="1" fill="#c4cfe2" opacity="0.75"></rect>
<rect x="1801" y="441" width="3" height="9" rx="1" fill="#e889b6" opacity="0.75"></rect>
<rect x="1808" y="441" width="4" height="9" rx="1" fill="#c4cfe2" opacity="0.75"></rect>
<rect x="1815" y="444" width="4" height="6" rx="1" fill="#f0a948" opacity="0.75"></rect>
<rect x="1822" y="444" width="3" height="6" rx="1" fill="#3fc1a5" opacity="0.75"></rect>
<rect x="1728" y="450" width="100" height="2.5" fill="#56709c"></rect>
<rect x="1730" y="453" width="3" height="9" rx="1" fill="#3fc1a5" opacity="0.75"></rect>
<rect x="1736" y="453" width="3" height="9" rx="1" fill="#3fc1a5" opacity="0.75"></rect>
<rect x="1741" y="454" width="3" height="8" rx="1" fill="#f0a948" opacity="0.75"></rect>
<rect x="1748" y="454" width="3" height="8" rx="1" fill="#8fa8e0" opacity="0.75"></rect>
<rect x="1754" y="455" width="4" height="7" rx="1" fill="#e889b6" opacity="0.75"></rect>
<rect x="1760" y="453" width="3" height="9" rx="1" fill="#c4cfe2" opacity="0.75"></rect>
<rect x="1765" y="453" width="4" height="9" rx="1" fill="#3fc1a5" opacity="0.75"></rect>
<rect x="1772" y="453" width="3" height="9" rx="1" fill="#8fa8e0" opacity="0.75"></rect>
<rect x="1778" y="456" width="3" height="6" rx="1" fill="#f0a948" opacity="0.75"></rect>
<rect x="1783" y="454" width="4" height="8" rx="1" fill="#c4cfe2" opacity="0.75"></rect>
<rect x="1791" y="456" width="3" height="6" rx="1" fill="#e889b6" opacity="0.75"></rect>
<rect x="1797" y="455" width="4" height="7" rx="1" fill="#e8c37a" opacity="0.75"></rect>
<rect x="1805" y="454" width="4" height="8" rx="1" fill="#8fa8e0" opacity="0.75"></rect>
<rect x="1812" y="455" width="4" height="7" rx="1" fill="#8fa8e0" opacity="0.75"></rect>
<rect x="1818" y="456" width="3" height="6" rx="1" fill="#f0a948" opacity="0.75"></rect>
<rect x="1823" y="453" width="3" height="9" rx="1" fill="#e889b6" opacity="0.75"></rect>
<rect x="1728" y="462" width="100" height="2.5" fill="#56709c"></rect>
<g class="mh mbtx"><g class="mh mbto"><g class="mh mbtb"><circle cx="1772" cy="456.5" r="4.2" fill="#e8b896"></circle><path d="M1767.7 456 a4.3 4.3 0 0 1 8.6 0 Z" fill="#8a6a3a"></path><rect x="1766" y="461.5" width="12" height="13" rx="4" fill="#7a5a9a"></rect><rect class="mh mbtl1" x="1767" y="474" width="4" height="20" fill="#1a1f2b"></rect><rect class="mh mbtl2" x="1773" y="474" width="4" height="20" fill="#1a1f2b"></rect><rect class="mh mbtc" x="1778" y="462" width="3.5" height="5" rx="1" fill="#f0a948"></rect></g></g></g>
<path d="M1734 494 L1734 476 Q1736 472 1742 472 L1830 472 Q1836 472 1838 476 L1838 494 Z" fill="#22304a" stroke="#56709c" stroke-width="1.2"></path>
<path d="M1740 473 H1832" stroke="#e8c37a" stroke-width="2" opacity="0.8"></path>
<rect x="1776" y="467" width="3" height="5" fill="#f0a948" opacity="0.85"></rect>
<rect class="mh mdr1" x="1815" y="467" width="3.5" height="5" rx="1" fill="#3fc1a5"></rect>
<rect class="mh mdr2" x="1790" y="467" width="3.5" height="5" rx="1" fill="#e889b6"></rect>
<path d="M1796 494 V482 M1791 482 H1801" stroke="#56709c" stroke-width="2"></path>
<circle cx="1800" cy="464.5" r="4.2" fill="#f1c9a5"></circle><path d="M1795.7 464 a4.3 4.3 0 0 1 8.6 0 Z" fill="#4a3020"></path><rect x="1794" y="469.5" width="12" height="13" rx="4" fill="#d4a23c"></rect><rect x="1789" y="480" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="1788" y="482" width="4" height="12" fill="#1a1f2b"></rect>
<path d="M1822 494 V482 M1817 482 H1827" stroke="#56709c" stroke-width="2"></path>
<circle cx="1826" cy="464.5" r="4.2" fill="#e8b896"></circle><path d="M1821.7 464 a4.3 4.3 0 0 1 8.6 0 Z" fill="#4a3020"></path><rect x="1820" y="469.5" width="12" height="13" rx="4" fill="#4a8fd6"></rect><rect x="1815" y="480" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="1814" y="482" width="4" height="12" fill="#1a1f2b"></rect>
<rect x="1847.5" y="468" width="3" height="22" fill="#33496e"></rect><rect x="1849" y="486" width="12" height="3" fill="#33496e"></rect>
<circle cx="1857" cy="466.5" r="4.2" fill="#e8b896"></circle><path d="M1852.7 466 a4.3 4.3 0 0 1 8.6 0 Z" fill="#4a3020"></path><rect x="1851" y="471.5" width="12" height="13" rx="4" fill="#c8524a"></rect><rect x="1857" y="482" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="1865" y="484" width="4" height="10" fill="#1a1f2b"></rect>
<rect x="1909.5" y="468" width="3" height="22" fill="#33496e"></rect><rect x="1899" y="486" width="12" height="3" fill="#33496e"></rect>
<g class="mh mv2s"><circle cx="1903" cy="466.5" r="4.2" fill="#a8714a"></circle><path d="M1898.7 466 a4.3 4.3 0 0 1 8.6 0 Z" fill="#4a3020"></path><rect x="1897" y="471.5" width="12" height="13" rx="4" fill="#7a5a9a"></rect><rect x="1892" y="482" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="1891" y="484" width="4" height="10" fill="#1a1f2b"></rect></g>
<rect x="1864" y="478" width="32" height="3" rx="1.5" fill="#8d9bb5"></rect><rect x="1878" y="481" width="4" height="11" fill="#56709c"></rect><rect x="1873" y="492" width="14" height="2" fill="#56709c"></rect>
<rect x="1873" y="473" width="3" height="5" fill="#f0a948" opacity="0.85"></rect>
<rect x="1942.5" y="468" width="3" height="22" fill="#33496e"></rect><rect x="1944" y="486" width="12" height="3" fill="#33496e"></rect>
<circle cx="1952" cy="466.5" r="4.2" fill="#e8b896"></circle><path d="M1947.7 466 a4.3 4.3 0 0 1 8.6 0 Z" fill="#c9c2b8"></path><rect x="1946" y="471.5" width="12" height="13" rx="4" fill="#d4a23c"></rect><rect x="1952" y="482" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="1960" y="484" width="4" height="10" fill="#1a1f2b"></rect>
<rect x="2004.5" y="468" width="3" height="22" fill="#33496e"></rect><rect x="1994" y="486" width="12" height="3" fill="#33496e"></rect>
<g class="mh mv1s"><circle cx="1998" cy="466.5" r="4.2" fill="#e8b896"></circle><path d="M1993.7 466 a4.3 4.3 0 0 1 8.6 0 Z" fill="#1a1410"></path><rect x="1992" y="471.5" width="12" height="13" rx="4" fill="#c8524a"></rect><rect x="1987" y="482" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="1986" y="484" width="4" height="10" fill="#1a1f2b"></rect></g>
<rect x="1959" y="478" width="32" height="3" rx="1.5" fill="#8d9bb5"></rect><rect x="1973" y="481" width="4" height="11" fill="#56709c"></rect><rect x="1968" y="492" width="14" height="2" fill="#56709c"></rect>
<rect x="1968" y="473" width="3" height="5" fill="#e889b6" opacity="0.85"></rect>
<rect x="2035.5" y="468" width="3" height="22" fill="#33496e"></rect><rect x="2037" y="486" width="12" height="3" fill="#33496e"></rect>
<circle cx="2045" cy="466.5" r="4.2" fill="#e8b896"></circle><path d="M2040.7 466 a4.3 4.3 0 0 1 8.6 0 Z" fill="#4a3020"></path><rect x="2039" y="471.5" width="12" height="13" rx="4" fill="#4a8fd6"></rect><rect x="2045" y="482" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="2053" y="484" width="4" height="10" fill="#1a1f2b"></rect>
<rect x="2097.5" y="468" width="3" height="22" fill="#33496e"></rect><rect x="2087" y="486" width="12" height="3" fill="#33496e"></rect>
<g class="mh mcvs"><circle cx="2091" cy="466.5" r="4.2" fill="#f1c9a5"></circle><path d="M2086.7 466 a4.3 4.3 0 0 1 8.6 0 Z" fill="#c9c2b8"></path><rect x="2085" y="471.5" width="12" height="13" rx="4" fill="#4f8a6a"></rect><rect x="2080" y="482" width="11" height="4" rx="2" fill="#1a1f2b"></rect><rect x="2079" y="484" width="4" height="10" fill="#1a1f2b"></rect></g>
<rect x="2052" y="478" width="32" height="3" rx="1.5" fill="#8d9bb5"></rect><rect x="2066" y="481" width="4" height="11" fill="#56709c"></rect><rect x="2061" y="492" width="14" height="2" fill="#56709c"></rect>
<rect x="2061" y="473" width="3" height="5" fill="#f0a948" opacity="0.85"></rect>
<rect class="mh mgl3" x="2076" y="474" width="3" height="4" fill="#e889b6"></rect>
<rect x="1846" y="446" width="28" height="30" rx="3" fill="#070d18" stroke="#56709c" stroke-width="1.5"></rect>
<rect class="mh mglow" x="1849" y="449" width="22" height="24" rx="2" fill="#bfe6ff"></rect>
<rect x="1849" y="470" width="22" height="3" fill="#56709c"></rect><rect x="1876" y="450" width="4" height="12" rx="2" fill="#e8c37a" opacity="0.8"></rect><rect x="1876" y="464" width="4" height="6" rx="2" fill="#3fc1a5" opacity="0.8"></rect>
<rect x="1672" y="494" width="478" height="4" fill="#4a5874"></rect><path d="M1672 494.5H2150" stroke="#a3b2cc" stroke-opacity="0.5"></path><rect x="1669" y="498" width="484" height="4" fill="#1d2534"></rect>
<g class="mh mgax"><g class="mh mgao"><g class="mh mgab"><circle cx="2128" cy="454.5" r="4.2" fill="#7a4b2e"></circle><path d="M2123.7 454 a4.3 4.3 0 0 1 8.6 0 Z" fill="#2a1d14"></path><rect x="2122" y="459.5" width="12" height="13" rx="4" fill="#4a8fd6"></rect><rect class="mh mgal1" x="2123" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mgal2" x="2129" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mgac" x="2134" y="460" width="3.5" height="5" rx="1" fill="#f0a948"></rect></g></g></g>
<g class="mh mv1x"><g class="mh mv1o"><g class="mh mv1b"><circle cx="1690" cy="454.5" r="4.2" fill="#e8b896"></circle><path d="M1685.7 454 a4.3 4.3 0 0 1 8.6 0 Z" fill="#1a1410"></path><rect x="1684" y="459.5" width="12" height="13" rx="4" fill="#c8524a"></rect><rect class="mh mv1l1" x="1685" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mv1l2" x="1691" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mv1c" x="1696" y="460" width="3.5" height="5" rx="1" fill="#f0a948"></rect></g></g></g>
<g class="mh mv2x"><g class="mh mv2o"><g class="mh mv2b"><circle cx="1903" cy="454.5" r="4.2" fill="#a8714a"></circle><path d="M1898.7 454 a4.3 4.3 0 0 1 8.6 0 Z" fill="#4a3020"></path><rect x="1897" y="459.5" width="12" height="13" rx="4" fill="#7a5a9a"></rect><rect class="mh mv2l1" x="1898" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mv2l2" x="1904" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mv2c" x="1909" y="460" width="3.5" height="5" rx="1" fill="#3fc1a5"></rect></g></g></g>
<g class="mh mcvx"><g class="mh mcvo"><g class="mh mcvb"><circle cx="2091" cy="454.5" r="4.2" fill="#f1c9a5"></circle><path d="M2086.7 454 a4.3 4.3 0 0 1 8.6 0 Z" fill="#c9c2b8"></path><rect x="2085" y="459.5" width="12" height="13" rx="4" fill="#4f8a6a"></rect><rect class="mh mcvl1" x="2086" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mcvl2" x="2092" y="472" width="4" height="22" fill="#1a1f2b"></rect><rect class="mh mcvc" x="2097" y="460" width="3.5" height="5" rx="1" fill="#3fc1a5"></rect></g></g></g>
<text x="1676" y="429" font-size="11" letter-spacing="1.8" fill="#e8c37a">MESS HALL · TEN FORWARD</text>
        </g>

                <text x="422" y="847" font-size="10" letter-spacing="1.8" fill="#8ea3c4" text-anchor="middle">TRANSPORTER</text>
        <g fill="#9fd0ff"><ellipse cx="362" cy="872" rx="15" ry="5" opacity="0.7"></ellipse><ellipse cx="402" cy="872" rx="15" ry="5" opacity="0.7"></ellipse><ellipse cx="442" cy="872" rx="15" ry="5" opacity="0.7"></ellipse><ellipse cx="482" cy="872" rx="15" ry="5" opacity="0.7"></ellipse></g>

        <line x1="573" y1="900" x2="1300" y2="900" stroke="#4fa3ff" stroke-width="2" opacity="0.3" style="opacity: var(--conduit)"></line>
        <g style="opacity: var(--core-glow)">
          <rect x="537" y="712" width="48" height="280" rx="24" fill="#4fa3ff" opacity="0.45" filter="url(#g5blur)"></rect>
          <rect class="core" x="549" y="712" width="24" height="280" rx="12" fill="url(#g5core)"></rect>
        </g>
        <text x="600" y="823" font-size="11" letter-spacing="1.6" id="lbl-core" style="fill: var(--core-text)"></text>

<g class="deflector">
<defs>
<clipPath id="g7hullclip"><path d="M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z"></path></clipPath>
<clipPath id="g7cowlclip"><ellipse cx="1318" cy="848" rx="46" ry="120"></ellipse></clipPath>
<clipPath id="g7dishclip"><ellipse cx="1305" cy="848" rx="28" ry="81"></ellipse></clipPath>
<clipPath id="g7recclip"><ellipse cx="1316" cy="848" rx="31" ry="90"></ellipse></clipPath>
<linearGradient id="g7cowl" gradientUnits="userSpaceOnUse" x1="0" y1="728" x2="0" y2="968"><stop offset="0" stop-color="#c4cede"></stop><stop offset="0.22" stop-color="#909db4"></stop><stop offset="0.55" stop-color="#58647b"></stop><stop offset="0.85" stop-color="#2d3648"></stop><stop offset="1" stop-color="#1a2131"></stop></linearGradient>
<linearGradient id="g7seamhi" gradientUnits="userSpaceOnUse" x1="0" y1="728" x2="0" y2="968"><stop offset="0" stop-color="#f4f8ff" stop-opacity="0.7"></stop><stop offset="0.5" stop-color="#f4f8ff" stop-opacity="0.15"></stop><stop offset="1" stop-color="#f4f8ff" stop-opacity="0"></stop></linearGradient>
<radialGradient id="g7spill" gradientUnits="userSpaceOnUse" cx="1326" cy="848" r="190" gradientTransform="translate(1326 848) scale(0.8 1.1) translate(-1326 -848)"><stop offset="0" stop-color="#7fd0ff" stop-opacity="0.4"></stop><stop offset="0.3" stop-color="#4fa3ff" stop-opacity="0.15"></stop><stop offset="1" stop-color="#4fa3ff" stop-opacity="0"></stop></radialGradient>
<linearGradient id="g7cavity" gradientUnits="userSpaceOnUse" x1="1290" y1="762" x2="1340" y2="934"><stop offset="0" stop-color="#02050b"></stop><stop offset="0.5" stop-color="#0a1426"></stop><stop offset="1" stop-color="#26395c"></stop></linearGradient>
<radialGradient id="g7dish" cx="0.6" cy="0.5" r="0.6" fx="0.66" fy="0.47"><stop offset="0" stop-color="#9fdcff"></stop><stop offset="0.3" stop-color="#3f8fe8"></stop><stop offset="0.72" stop-color="#173f86"></stop><stop offset="1" stop-color="#0a1c3e"></stop></radialGradient>
<radialGradient id="g7core" cx="0.55" cy="0.5" r="0.5" fx="0.6" fy="0.46"><stop offset="0" stop-color="#ffffff"></stop><stop offset="0.25" stop-color="#e2f6ff" stop-opacity="0.95"></stop><stop offset="0.6" stop-color="#6cc6ff" stop-opacity="0.45"></stop><stop offset="1" stop-color="#2f7fe0" stop-opacity="0"></stop></radialGradient>
<linearGradient id="g7ishadow" gradientUnits="userSpaceOnUse" x1="1290" y1="767" x2="1338" y2="931"><stop offset="0" stop-color="#000000" stop-opacity="0.75"></stop><stop offset="0.45" stop-color="#000000" stop-opacity="0.28"></stop><stop offset="0.75" stop-color="#000000" stop-opacity="0"></stop></linearGradient>
<linearGradient id="g7lip" gradientUnits="userSpaceOnUse" x1="1284" y1="760" x2="1344" y2="936"><stop offset="0" stop-color="#f2f6ff" stop-opacity="0.9"></stop><stop offset="0.4" stop-color="#aab7cd" stop-opacity="0.5"></stop><stop offset="0.7" stop-color="#1a2232" stop-opacity="0.9"></stop><stop offset="1" stop-color="#0b111c"></stop></linearGradient>
<linearGradient id="g7wall" gradientUnits="userSpaceOnUse" x1="1326" y1="0" x2="1347" y2="0"><stop offset="0" stop-color="#5a9ee0"></stop><stop offset="0.45" stop-color="#2f5d96"></stop><stop offset="1" stop-color="#162640"></stop></linearGradient>
<linearGradient id="g7walltop" gradientUnits="userSpaceOnUse" x1="0" y1="758" x2="0" y2="938"><stop offset="0" stop-color="#000000" stop-opacity="0.85"></stop><stop offset="0.35" stop-color="#000000" stop-opacity="0.35"></stop><stop offset="0.6" stop-color="#000000" stop-opacity="0"></stop><stop offset="1" stop-color="#000000" stop-opacity="0.25"></stop></linearGradient>
</defs>
<ellipse cx="1326" cy="848" rx="36" ry="100" class="thrust" fill="#5ab8ff" fill-opacity="0.5" filter="url(#g5blur)"></ellipse>
<g clip-path="url(#g7hullclip)"><ellipse cx="1313" cy="855" rx="46" ry="120" fill="#000000" fill-opacity="0.55" filter="url(#g5soft)"></ellipse></g>
<ellipse cx="1318" cy="848" rx="46" ry="120" fill="url(#g7cowl)" clip-path="url(#g7hullclip)"></ellipse>
<ellipse cx="1318" cy="848" rx="46" ry="120" fill="url(#g5az)" opacity="0.7" clip-path="url(#g7hullclip)"></ellipse>
<path d="M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z" fill="none" stroke="#0b111c" stroke-width="2" clip-path="url(#g7cowlclip)"></path>
<path d="M150 696 L1190 696 C1290 696 1352 758 1358 832 C1362 914 1300 1030 1176 1034 L250 1034 C140 1034 70 992 62 924 L56 786 C54 731 90 696 150 696 Z" fill="none" stroke="url(#g5rim)" stroke-width="3" clip-path="url(#g7cowlclip)"></path>
<ellipse cx="1318" cy="848" rx="46" ry="120" fill="none" stroke="#0a0f18" stroke-opacity="0.8" stroke-width="1.6" clip-path="url(#g7hullclip)"></ellipse>
<ellipse cx="1318" cy="848" rx="46" ry="120" fill="none" stroke="url(#g7seamhi)" stroke-width="1.2" transform="translate(1.6 0)" clip-path="url(#g7hullclip)"></ellipse>
<ellipse cx="1326" cy="848" rx="200" ry="230" fill="url(#g7spill)" style="mix-blend-mode: screen" clip-path="url(#g7hullclip)"></ellipse>
<ellipse cx="1316" cy="848" rx="31" ry="90" fill="url(#g7wall)"></ellipse>
<g clip-path="url(#g7recclip)">
<path d="M1313.8 759.8 A30.4 88.2 0 0 1 1313.8 936.2 M1311.6 761.6 A29.8 86.4 0 0 1 1311.6 934.4 M1309.4 763.4 A29.2 84.6 0 0 1 1309.4 932.6 M1307.2 765.2 A28.6 82.8 0 0 1 1307.2 930.8" fill="none" stroke="#0a1222" stroke-opacity="0.55" stroke-width="1.2"></path>
<path d="M1313.8 759.8 A30.4 88.2 0 0 1 1313.8 936.2 M1311.6 761.6 A29.8 86.4 0 0 1 1311.6 934.4 M1309.4 763.4 A29.2 84.6 0 0 1 1309.4 932.6 M1307.2 765.2 A28.6 82.8 0 0 1 1307.2 930.8" fill="none" stroke="#9fd0ff" stroke-opacity="0.18" stroke-width="0.8" transform="translate(1.2 0)"></path>
<ellipse cx="1305" cy="848" rx="28" ry="81" fill="url(#g7dish)"></ellipse>
<g clip-path="url(#g7dishclip)"><path d="M1270 772H1334 M1270 780H1334 M1270 788H1334 M1270 796H1334 M1270 804H1334 M1270 812H1334 M1270 820H1334 M1270 828H1334 M1270 836H1334 M1270 844H1334 M1270 852H1334 M1270 860H1334 M1270 868H1334 M1270 876H1334 M1270 884H1334 M1270 892H1334 M1270 900H1334 M1270 908H1334 M1270 916H1334 M1270 924H1334" stroke="#cfeeff" stroke-opacity="0.1" stroke-width="0.8"></path><ellipse cx="1303" cy="848" rx="23" ry="66" fill="none" stroke="#bfe6ff" stroke-opacity="0.3" stroke-width="1"></ellipse><ellipse cx="1301.5" cy="848" rx="18" ry="51" fill="none" stroke="#bfe6ff" stroke-opacity="0.36" stroke-width="1"></ellipse><ellipse cx="1300" cy="848" rx="12.5" ry="35" fill="none" stroke="#bfe6ff" stroke-opacity="0.45" stroke-width="1"></ellipse><ellipse cx="1299" cy="848" rx="7" ry="19" fill="none" stroke="#bfe6ff" stroke-opacity="0.55" stroke-width="1"></ellipse></g>
<ellipse cx="1301" cy="848" rx="18" ry="58" class="thrust" fill="url(#g7core)" style="mix-blend-mode: screen"></ellipse>
<ellipse cx="1305" cy="848" rx="28" ry="81" fill="none" stroke="url(#g7ishadow)" stroke-width="10" clip-path="url(#g7dishclip)"></ellipse>
<ellipse cx="1305" cy="848" rx="28" ry="81" fill="none" stroke="#04080f" stroke-opacity="0.7" stroke-width="1.4"></ellipse>
<ellipse cx="1316" cy="848" rx="31" ry="90" fill="url(#g7walltop)"></ellipse>
</g>
<ellipse cx="1316" cy="848" rx="31" ry="90" fill="none" stroke="url(#g7lip)" stroke-width="2.4"></ellipse>
<path d="M1289.2 893.0 A31 90 0 0 1 1311.7 758.9" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1" stroke-linecap="round"></path>
</g>

        <ellipse cx="502" cy="698" rx="70" ry="13" fill="#8fa8e0" opacity="0.35" filter="url(#g5blur)"></ellipse>
        <ellipse cx="502" cy="698" rx="64" ry="9" fill="#0c1526" stroke="#8fa8e0" stroke-width="3"></ellipse>
        <text x="420" y="686" font-size="10.5" letter-spacing="1.4" fill="#c3d2ee" text-anchor="end">CUSTOMS · SECURITY SCANS CLOUD-BOUND WORK ▸</text>
      </svg>`,M={width:2200,height:1060,tileHeight:64,cabins:{x:1180,y:562,step:48},lifts:{saucer:1210,engineering:561,deck6:764,neckFoot:{x:1050,y:700},neckTop:{x:1240,y:614}},cabinOrder:[`xo`,`ops`,`helm`,`nav`,`computer`,`archives`,`science`,`sensors`,`carto`,`security`,`qm`,`away`,`eng`,`sys`,`diag`,`strategist`,`yeoman`,`holo`],places:{xo:{x:1228,y:58,w:166},captain:{x:1407,y:58,w:166},screen:{x:1586,y:58,w:166},nav:{x:1176,y:130,w:200},helm:{x:1390,y:130,w:200},ops:{x:1604,y:130,w:200},lounge:{x:934,y:242,w:530},strategist:{x:1476,y:242,w:170},yeoman:{x:1658,y:242,w:170},quarters:{x:1840,y:242,w:180},computer:{x:840,y:338,w:240},archives:{x:1094,y:338,w:240},science:{x:1348,y:338,w:240},sensors:{x:1602,y:338,w:240},doctor:{x:1856,y:338,w:240},holo:{x:830,y:434,w:240},carto:{x:1084,y:434,w:240},crewq:{x:950,y:530,w:1072},life:{x:110,y:732,w:200},security:{x:322,y:732,w:200},qm:{x:600,y:732,w:200},comms:{x:812,y:732,w:200},away:{x:110,y:828,w:200},eng:{x:600,y:828,w:200},design:{x:170,y:924,w:180},calib:{x:360,y:924,w:180},sys:{x:600,y:924,w:190},diag:{x:800,y:924,w:190}},icons:{screen:`M3 5h18v11H3z M8 20h8 M12 16v4`,helm:`M12 6a6 6 0 1 0 0.01 0 M12 2v4 M12 18v4 M2 12h4 M18 12h4 M12 10.5a1.5 1.5 0 1 0 0.01 0`,nav:`M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14`,ops:`M3 12h4l3-7 4 14 3-7h4`,xo:`M12 3l7 18-7-4-7 4z`,captain:`M12 2l2.9 6.2 6.6.6-5 4.4 1.5 6.6L12 16.5 6 19.8l1.5-6.6-5-4.4 6.6-.6z`,sensors:`M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0 M12 12l6-6`,security:`M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4`,comms:`M3 6h18v12H3z M3 6l9 7 9-7`,science:`M9 3h6 M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3 M7.5 15h9`,computer:`M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0 M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3`,archives:`M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z`,carto:`M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z`,lounge:`M4 5h11v8H8l-4 3z M9 16h7l4 3v-8h-2`,quarters:`M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6`,crewq:`M3 18h18 M3 18V8 M21 18v-5H9v5 M6 12a2 2 0 1 0 0.01 0`,yeoman:`M8 4h8v3H8z M6 5H5v16h14V5h-1 M8 12l2 2 4-4 M8 17h8`,eng:`M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z`,qm:`M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10`,away:`M12 4a2 2 0 1 0 0.01 0 M9 21v-6l-2-3 5-2 5 2-2 3v6 M4 3v18 M20 3v18`,doctor:`M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z`,life:`M5 19c0-8 6-14 14-14 0 8-6 14-14 14z M5 19l8-8`,strategist:`M12 3a2.5 2.5 0 1 0 0.01 0 M9.5 8.5h5 M10.2 8.5L8.5 17h7l-1.7-8.5 M6 21h12 M7.5 17h9`,holo:`M4 4h16v16H4z M4 9.3h16 M4 14.7h16 M9.3 4v16 M14.7 4v16`,sys:`M12 8a4 4 0 1 0 0.01 0 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1L7 17 M17 7l2.1-2.1`,diag:`M10 4a6 6 0 1 0 0.01 0 M14.5 14.5L20 20`,design:`M12 3l7 7-7 11-7-11z M12 3v8 M12 14a1.5 1.5 0 1 0 0.01 0`,calib:`M12 3a9 9 0 1 0 0.01 0 M12 8a4 4 0 1 0 0.01 0 M12 1v4 M12 19v4 M1 12h4 M19 12h4`}};function ke({path:e,className:t}){return(0,E.jsx)(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`,className:t,children:(0,E.jsx)(`path`,{d:e??`M12 12h.01`})})}var Ae=M.places,je=M.icons,Me=M.cabinOrder,Ne=(e,t)=>`${(e/t*100).toFixed(3)}%`,Pe=e=>e.kind===`station`&&e.status===`live`;function Fe(e){let t=Ae[e];return{x:t.x+28,y:t.y+M.tileHeight/2}}function Ie(e,t){let n=Me.indexOf(e);return n<0&&(n=Me.length+t.filter(e=>Pe(e)&&!Me.includes(e.id)).findIndex(t=>t.id===e)),n=Math.max(0,n)%18,{n:n+1,x:M.cabins.x+n*M.cabins.step,y:M.cabins.y}}function Le(e,t){return e.off(t)?t.id===`captain`?Fe(`quarters`):Ie(t.id,e.data.stations.stations):Fe(t.id)}function Re(e,t,n){let r=M.lifts,i=e.deck>=6?[t,{x:r.engineering,y:t.y},{x:r.engineering,y:r.deck6},{x:r.neckFoot.x,y:r.deck6},r.neckFoot,r.neckTop,{x:r.neckTop.x,y:n.y},n]:[t,{x:r.saucer,y:t.y},{x:r.saucer,y:n.y},n];return i.filter((e,t)=>t===0||e.x!==i[t-1].x||e.y!==i[t-1].y)}var ze=(e,t)=>e.x===t.x&&(e.x===M.lifts.saucer||e.x===M.lifts.engineering),Be=200;function Ve(e,t){if(typeof e.animate!=`function`||window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches)return;let n=t.slice(1).map((e,n)=>Math.hypot(e.x-t[n].x,e.y-t[n].y)),r=n.reduce((e,t)=>e+t,0);if(!r)return;let i=0,a=t.map((e,a)=>{a&&(i+=n[a-1]);let o=a>0&&ze(t[a-1],e)||a<t.length-1&&ze(e,t[a+1]);return{left:Ne(e.x,M.width),top:Ne(e.y,M.height),opacity:o&&a>0&&a<t.length-1?.55:1,offset:i/r}});e.getAnimations().forEach(e=>e.cancel()),e.animate(a,{duration:Math.min(9e3,Math.max(1500,r/Be*1e3)),easing:`linear`})}function He({ship:e,st:t,all:n,filter:r,selected:i,onPick:a}){let o=(0,l.useRef)(null),s=e.off(t),c=Le(e,t),u=(0,l.useRef)(c);(0,l.useLayoutEffect)(()=>{let e=u.current;if(u.current=c,!o.current||e.x===c.x&&e.y===c.y)return;let n=Re(t,Fe(t.id),s?c:e);Ve(o.current,s?n:n.reverse())},[c.x,c.y]);let d=e.actingFor(t.id),f=[`tok`];s&&f.push(`off`),d&&f.push(`acting`),r!==`all`&&t.rail!==r&&f.push(`dim`);let p=s?t.id===`captain`?`in the Captain's Quarters`:`off duty in cabin 05-${String(Ie(t.id,n).n).padStart(2,`0`)}`:`at the post`;return(0,E.jsx)(`button`,{ref:o,type:`button`,className:f.join(` `),tabIndex:-1,"aria-pressed":i,"aria-label":`${t.name}, ${p}`,title:`${t.short}, ${p}`,style:{left:Ne(c.x,M.width),top:Ne(c.y,M.height),"--c":T(t.rail)},onClick:()=>a(t.id),children:(0,E.jsx)(ke,{path:je[t.id]})})}function Ue({ship:e,filter:t,selected:n,slots:r,onPick:i}){let a=e.data.stations.stations.filter(e=>Ae[e.id]),o=M.width,s=M.height,c=e=>({left:Ne(e.x,o),top:Ne(e.y,s)}),l=a.some(t=>t.id===`captain`&&e.off(t));return(0,E.jsxs)(`div`,{className:`crew-layer`,children:[r&&a.filter(e=>e.kind===`station`||e.id===`quarters`&&l).map(e=>(0,E.jsx)(`span`,{"aria-hidden":`true`,className:`slot`+(Pe(e)?``:` unbuilt`)+(e.id===`quarters`?` quarters`:``)+(t!==`all`&&e.rail!==t&&e.id!==`quarters`?` dim`:``),style:c(Fe(e.id))},`slot-${e.id}`)),a.filter(Pe).map(r=>(0,E.jsx)(He,{ship:e,st:r,all:a,filter:t,selected:n===r.id,onPick:i},r.id))]})}var We=`<svg class="bridge-chair-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<clipPath id="bc-glass"><rect x="34" y="26" width="452" height="224" rx="12"/></clipPath>
<radialGradient id="bc-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="bc-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="bc-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="bc-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<linearGradient id="bc-shell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>
<linearGradient id="bc-shell-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd89a" stop-opacity=".12"/><stop offset=".35" stop-color="#ffd89a" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
<linearGradient id="bc-arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2b33"/><stop offset="1" stop-color="#120c10"/></linearGradient>
<linearGradient id="bc-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="bc-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="bc-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="bc-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="bc-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<radialGradient id="bc-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="bc-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="bc-planet" cx=".3" cy=".05" r="1"><stop offset="0" stop-color="#5fa2b4"/><stop offset=".18" stop-color="#1f5068"/><stop offset=".5" stop-color="#0c2236"/><stop offset="1" stop-color="#050b14"/></radialGradient>
<linearGradient id="bc-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="bc-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<radialGradient id="bc-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
</defs>
<!-- the bridge -->
<rect width="520" height="440" fill="url(#bc-wall)"/>
<path d="M0 268 L520 268 L520 440 L0 440 Z" fill="url(#bc-floor)"/>
<ellipse cx="260" cy="276" rx="250" ry="26" fill="url(#bc-screenlight)"/>
<path d="M18 440 C40 352 150 318 260 318 C370 318 480 352 502 440" fill="none" stroke="#2e4569" stroke-width="2"/>
<path d="M30 440 C52 362 156 330 260 330 C364 330 468 362 490 440" fill="none" stroke="#e8c37a" stroke-opacity=".22" stroke-width="1.2"/>
<path d="M0 0 L22 0 L22 268 L0 290 Z" fill="#0d1526"/>
<rect x="2" y="70" width="14" height="4" rx="2" fill="#3fc1a5" opacity=".55"/>
<rect x="2" y="116" width="14" height="4" rx="2" fill="#f0a948" opacity=".55"/>
<rect x="2" y="162" width="14" height="4" rx="2" fill="#e889b6" opacity=".55"/>
<path d="M520 0 L498 0 L498 268 L520 290 Z" fill="#0d1526"/>
<rect x="504" y="70" width="14" height="4" rx="2" fill="#3fc1a5" opacity=".55"/>
<rect x="504" y="116" width="14" height="4" rx="2" fill="#f0a948" opacity=".55"/>
<rect x="504" y="162" width="14" height="4" rx="2" fill="#e889b6" opacity=".55"/>
<!-- the main viewscreen -->
<rect x="22" y="14" width="476" height="248" rx="22" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<rect x="30" y="22" width="460" height="232" rx="16" fill="none" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1.2"/>
<g clip-path="url(#bc-glass)">
<rect x="34" y="26" width="452" height="224" fill="url(#bc-space)"/>
<ellipse cx="150" cy="96" rx="150" ry="70" fill="url(#bc-neb-plum)"/>
<ellipse cx="380" cy="170" rx="140" ry="64" fill="url(#bc-neb-teal)"/>
<circle cx="63.3" cy="92.1" r="0.5" fill="#dfe8ff" opacity="0.7" class="bc-tw" style="animation-delay:-3.3s"/>
<circle cx="333.9" cy="53.1" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="428.6" cy="96" r="0.6" fill="#ffffff" opacity="0.5"/>
<circle cx="347.2" cy="63.1" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="306.4" cy="211.5" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="37.4" cy="60.3" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="361.3" cy="51" r="1.2" fill="#dfe8ff" opacity="0.8"/>
<circle cx="197.6" cy="118.1" r="1" fill="#dfe8ff" opacity="0.8"/>
<circle cx="46.1" cy="227.4" r="0.7" fill="#ffffff" opacity="0.7" class="bc-tw" style="animation-delay:-3.2s"/>
<circle cx="463.8" cy="242.2" r="0.8" fill="#dfe8ff" opacity="0.5"/>
<circle cx="162.1" cy="90.6" r="1.2" fill="#fff1d6" opacity="0.7"/>
<circle cx="393.1" cy="158.2" r="0.8" fill="#fff1d6" opacity="0.6"/>
<circle cx="57.4" cy="71.2" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="149.9" cy="246.2" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="43.4" cy="97.1" r="0.7" fill="#fff1d6" opacity="0.9"/>
<circle cx="35.1" cy="247.5" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="365" cy="32.6" r="1" fill="#fff1d6" opacity="0.4" class="bc-tw" style="animation-delay:-0.4s"/>
<circle cx="176.8" cy="151.4" r="0.7" fill="#ffffff" opacity="0.8"/>
<circle cx="97.6" cy="244.2" r="0.6" fill="#fff1d6" opacity="0.4"/>
<circle cx="189" cy="226.2" r="1.4" fill="#ffffff" opacity="0.4"/>
<circle cx="455.9" cy="104" r="0.7" fill="#ffffff" opacity="0.6"/>
<circle cx="252.6" cy="130.2" r="0.7" fill="#dfe8ff" opacity="0.7"/>
<circle cx="188.7" cy="74.6" r="1" fill="#ffffff" opacity="0.9"/>
<circle cx="464.5" cy="45.3" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="201.4" cy="200.3" r="0.6" fill="#dfe8ff" opacity="0.4" class="bc-tw" style="animation-delay:-5s"/>
<circle cx="41.2" cy="101.2" r="0.9" fill="#dfe8ff" opacity="0.4"/>
<circle cx="168.4" cy="29.3" r="0.7" fill="#fff1d6" opacity="0.4"/>
<circle cx="343.9" cy="159.1" r="0.7" fill="#ffffff" opacity="0.9"/>
<circle cx="403.7" cy="133" r="0.7" fill="#dfe8ff" opacity="0.7"/>
<circle cx="197.7" cy="190.2" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="463.8" cy="205" r="1.4" fill="#fff1d6" opacity="0.6"/>
<circle cx="41.7" cy="129" r="0.7" fill="#dfe8ff" opacity="0.7"/>
<circle cx="40.9" cy="181.4" r="0.9" fill="#fff1d6" opacity="0.6" class="bc-tw" style="animation-delay:-2s"/>
<circle cx="246.9" cy="119" r="0.8" fill="#dfe8ff" opacity="0.7"/>
<circle cx="220.6" cy="182.6" r="0.5" fill="#fff1d6" opacity="0.5"/>
<circle cx="484.7" cy="34.2" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="201.1" cy="113.1" r="1.2" fill="#fff1d6" opacity="0.6"/>
<circle cx="93.3" cy="224.6" r="0.7" fill="#ffffff" opacity="0.6"/>
<circle cx="123.4" cy="134.5" r="0.7" fill="#ffffff" opacity="0.9"/>
<circle cx="154.2" cy="54.1" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="141.6" cy="188.4" r="1.2" fill="#fff1d6" opacity="0.6" class="bc-tw" style="animation-delay:-2.7s"/>
<circle cx="332.4" cy="85.5" r="1" fill="#fff1d6" opacity="0.4"/>
<circle cx="162.2" cy="92" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="402.6" cy="219.7" r="1.2" fill="#dfe8ff" opacity="0.9"/>
<circle cx="217.7" cy="246.9" r="0.7" fill="#fff1d6" opacity="0.7"/>
<circle cx="201.2" cy="153.3" r="1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="348.5" cy="52.9" r="0.7" fill="#fff1d6" opacity="0.4"/>
<circle cx="189.8" cy="161.9" r="0.5" fill="#dfe8ff" opacity="0.7"/>
<circle cx="224.2" cy="43.7" r="0.5" fill="#ffffff" opacity="0.6" class="bc-tw" style="animation-delay:-1.1s"/>
<circle cx="134" cy="246.4" r="0.8" fill="#fff1d6" opacity="0.5"/>
<circle cx="454.5" cy="100.5" r="1.4" fill="#ffffff" opacity="0.5"/>
<circle cx="276.4" cy="36.4" r="0.5" fill="#ffffff" opacity="0.9"/>
<circle cx="82.9" cy="69.2" r="0.5" fill="#fff1d6" opacity="0.7"/>
<circle cx="142.9" cy="36.3" r="0.6" fill="#ffffff" opacity="0.7"/>
<circle cx="294" cy="39.2" r="0.8" fill="#ffffff" opacity="0.7"/>
<circle cx="158.6" cy="108.9" r="0.6" fill="#ffffff" opacity="0.8"/>
<circle cx="308" cy="200.4" r="0.9" fill="#ffffff" opacity="0.5" class="bc-tw" style="animation-delay:-4.9s"/>
<circle cx="308.2" cy="149.4" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="329.9" cy="70.3" r="1" fill="#dfe8ff" opacity="0.8"/>
<circle cx="423.2" cy="119.8" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="164.7" cy="129.7" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="402.9" cy="100.4" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="397.8" cy="135" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="61.8" cy="31.8" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="299.4" cy="79.3" r="1.2" fill="#dfe8ff" opacity="0.4" class="bc-tw" style="animation-delay:-3.3s"/>
<circle cx="454.3" cy="83.3" r="1.2" fill="#ffffff" opacity="0.9"/>
<circle cx="127.1" cy="207.2" r="1" fill="#fff1d6" opacity="0.7"/>
<circle cx="279" cy="60.7" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="179.7" cy="83.9" r="1.4" fill="#ffffff" opacity="0.5"/>
<circle cx="153.9" cy="157.9" r="1.4" fill="#ffffff" opacity="0.7"/>
<circle cx="210.9" cy="214.4" r="1.2" fill="#fff1d6" opacity="0.5"/>
<circle cx="335.5" cy="51.8" r="0.7" fill="#fff1d6" opacity="0.8"/>
<circle cx="101.4" cy="102.4" r="1.4" fill="#ffffff" opacity="0.9" class="bc-tw" style="animation-delay:-3.9s"/>
<circle cx="92.9" cy="175" r="0.5" fill="#fff1d6" opacity="0.9"/>
<circle cx="235.7" cy="243.1" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="43.7" cy="29.8" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="209.9" cy="187.3" r="1.4" fill="#ffffff" opacity="0.4"/>
<circle cx="115.5" cy="127.5" r="1.2" fill="#ffffff" opacity="0.6"/>
<circle cx="169.3" cy="84.4" r="0.9" fill="#fff1d6" opacity="0.7"/>
<circle cx="243.3" cy="163.5" r="0.5" fill="#ffffff" opacity="0.8"/>
<circle cx="469.6" cy="219.1" r="1.4" fill="#ffffff" opacity="0.7" class="bc-tw" style="animation-delay:-1.5s"/>
<circle cx="337.9" cy="88.2" r="0.7" fill="#fff1d6" opacity="0.8"/>
<circle cx="298.9" cy="103.4" r="0.8" fill="#dfe8ff" opacity="0.9"/>
<circle cx="395.6" cy="118" r="0.8" fill="#fff1d6" opacity="0.6"/>
<circle cx="43.6" cy="177.6" r="1.4" fill="#ffffff" opacity="0.6"/>
<circle cx="393.4" cy="143.2" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="315.1" cy="130.1" r="0.6" fill="#dfe8ff" opacity="0.9"/>
<circle cx="115.3" cy="208.9" r="1.2" fill="#fff1d6" opacity="0.6"/>
<circle cx="89.9" cy="107.7" r="1.4" fill="#ffffff" opacity="0.5" class="bc-tw" style="animation-delay:-3.3s"/>
<circle cx="315.3" cy="198.1" r="0.8" fill="#ffffff" opacity="0.8"/>
<circle cx="118.5" cy="35.8" r="0.7" fill="#ffffff" opacity="0.9"/>
<circle cx="448.6" cy="32.3" r="1.4" fill="#dfe8ff" opacity="0.6"/>
<circle cx="484.8" cy="173.7" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="428.6" cy="135.9" r="1" fill="#fff1d6" opacity="0.6"/>
<circle cx="312.8" cy="235.6" r="1" fill="#fff1d6" opacity="0.5"/>
<circle cx="480.9" cy="31.7" r="0.9" fill="#ffffff" opacity="0.8"/>
<circle cx="298.6" cy="106.6" r="1.4" fill="#ffffff" opacity="0.9" class="bc-tw" style="animation-delay:-1.9s"/>
<circle cx="340.6" cy="93.9" r="0.9" fill="#fff1d6" opacity="0.4"/>
<circle cx="53.1" cy="96.3" r="1.4" fill="#fff1d6" opacity="0.9"/>
<circle cx="299.7" cy="144.7" r="0.7" fill="#dfe8ff" opacity="0.5"/>
<circle cx="267" cy="92.3" r="0.6" fill="#fff1d6" opacity="0.4"/>
<circle cx="470.3" cy="30" r="1.2" fill="#ffffff" opacity="0.6"/>
<circle cx="134.5" cy="32.1" r="0.7" fill="#fff1d6" opacity="0.8"/>
<circle cx="449.5" cy="98" r="0.7" fill="#ffffff" opacity="0.5"/>
<circle cx="199.7" cy="162.9" r="0.9" fill="#dfe8ff" opacity="0.4" class="bc-tw" style="animation-delay:-1.7s"/>
<circle cx="124.4" cy="238.7" r="0.5" fill="#fff1d6" opacity="0.9"/>
<circle cx="232.1" cy="60.9" r="1.2" fill="#dfe8ff" opacity="0.4"/>
<circle cx="341.4" cy="243.3" r="0.8" fill="#ffffff" opacity="0.7"/>
<circle cx="449.2" cy="116" r="0.7" fill="#dfe8ff" opacity="0.9"/>
<circle cx="315" cy="132.9" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="354.8" cy="114.4" r="0.8" fill="#fff1d6" opacity="0.5"/>
<circle cx="358" cy="221.9" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="66.1" cy="35.8" r="0.8" fill="#ffffff" opacity="0.7" class="bc-tw" style="animation-delay:-1.2s"/>
<circle cx="53.9" cy="132.9" r="0.9" fill="#fff1d6" opacity="0.5"/>
<circle cx="344.9" cy="33.1" r="1.2" fill="#fff1d6" opacity="0.4"/>
<circle cx="342.4" cy="53.7" r="1.2" fill="#fff1d6" opacity="0.4"/>
<circle cx="237.8" cy="117.3" r="0.6" fill="#ffffff" opacity="0.5"/>
<circle cx="404.3" cy="87.8" r="1.4" fill="#fff1d6" opacity="0.7"/>
<circle cx="388.5" cy="162.7" r="1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="402" cy="90.2" r="1.2" fill="#dfe8ff" opacity="0.9"/>
<circle cx="96" cy="62" r="7" fill="url(#bc-starglow)"/><circle cx="96" cy="62" r="1.3" fill="#fff"/>
<circle cx="402" cy="88" r="6" fill="url(#bc-starglow)"/><circle cx="402" cy="88" r="1.3" fill="#fff"/>
<circle cx="250" cy="52" r="5" fill="url(#bc-starglow)"/><circle cx="250" cy="52" r="1.3" fill="#fff"/>
<g class="bc-streaks" style="opacity:var(--bc-burn,0)"><line class="bc-streak" x1="0" y1="233.8" x2="41.7" y2="233.8" stroke="url(#bc-streak)" stroke-width="1.5" opacity="0.4" style="animation-duration:5.6s;animation-delay:-1.7s"/>
<line class="bc-streak" x1="0" y1="91.4" x2="81.4" y2="91.4" stroke="url(#bc-streak)" stroke-width="1.5" opacity="0.5" style="animation-duration:7.6s;animation-delay:-6.6s"/>
<line class="bc-streak" x1="0" y1="174.1" x2="43" y2="174.1" stroke="url(#bc-streak)" stroke-width="1.3" opacity="0.3" style="animation-duration:7.9s;animation-delay:-3.4s"/>
<line class="bc-streak" x1="0" y1="52.2" x2="50.6" y2="52.2" stroke="url(#bc-streak)" stroke-width="1.3" opacity="0.6" style="animation-duration:7.1s;animation-delay:-7.3s"/>
<line class="bc-streak" x1="0" y1="175.5" x2="48.1" y2="175.5" stroke="url(#bc-streak)" stroke-width="1" opacity="0.4" style="animation-duration:6.5s;animation-delay:-6.9s"/>
<line class="bc-streak" x1="0" y1="42.7" x2="53.2" y2="42.7" stroke="url(#bc-streak)" stroke-width="0.9" opacity="0.4" style="animation-duration:5.8s;animation-delay:-3.9s"/>
<line class="bc-streak" x1="0" y1="120.8" x2="80.2" y2="120.8" stroke="url(#bc-streak)" stroke-width="1.1" opacity="0.5" style="animation-duration:4.4s;animation-delay:-4.4s"/>
<line class="bc-streak" x1="0" y1="201.7" x2="83.5" y2="201.7" stroke="url(#bc-streak)" stroke-width="1.1" opacity="0.3" style="animation-duration:4.5s;animation-delay:-5.8s"/>
<line class="bc-streak" x1="0" y1="99.6" x2="50.7" y2="99.6" stroke="url(#bc-streak)" stroke-width="1.1" opacity="0.3" style="animation-duration:4.7s;animation-delay:-3.8s"/>
<line class="bc-streak" x1="0" y1="82.8" x2="40.7" y2="82.8" stroke="url(#bc-streak)" stroke-width="1.1" opacity="0.3" style="animation-duration:4.3s;animation-delay:-7.8s"/>
<line class="bc-streak" x1="0" y1="176.7" x2="54.3" y2="176.7" stroke="url(#bc-streak)" stroke-width="1" opacity="0.5" style="animation-duration:7.7s;animation-delay:-2.2s"/>
<line class="bc-streak" x1="0" y1="214.7" x2="42.3" y2="214.7" stroke="url(#bc-streak)" stroke-width="1" opacity="0.3" style="animation-duration:4.4s;animation-delay:-7.6s"/>
<line class="bc-streak" x1="0" y1="224.2" x2="45.6" y2="224.2" stroke="url(#bc-streak)" stroke-width="1.1" opacity="0.6" style="animation-duration:6.8s;animation-delay:-2.9s"/>
<line class="bc-streak" x1="0" y1="83.3" x2="66.9" y2="83.3" stroke="url(#bc-streak)" stroke-width="1.1" opacity="0.4" style="animation-duration:5.6s;animation-delay:-1.2s"/>
<line class="bc-streak" x1="0" y1="220.9" x2="45.5" y2="220.9" stroke="url(#bc-streak)" stroke-width="1.5" opacity="0.5" style="animation-duration:6.8s;animation-delay:-2.6s"/>
<line class="bc-streak" x1="0" y1="42.1" x2="82.1" y2="42.1" stroke="url(#bc-streak)" stroke-width="1.3" opacity="0.5" style="animation-duration:7.4s;animation-delay:-6.8s"/>
<line class="bc-streak" x1="0" y1="101" x2="32.1" y2="101" stroke="url(#bc-streak)" stroke-width="1.3" opacity="0.6" style="animation-duration:7.7s;animation-delay:-0.9s"/>
<line class="bc-streak" x1="0" y1="48.7" x2="79.4" y2="48.7" stroke="url(#bc-streak)" stroke-width="0.9" opacity="0.4" style="animation-duration:4.2s;animation-delay:-1.7s"/></g>
<circle cx="410" cy="380" r="200" fill="url(#bc-planet)"/>
<circle cx="410" cy="380" r="200" fill="none" stroke="#9fe0ee" stroke-opacity=".5" stroke-width="1.5"/>
<path d="M34 46 L154 26 L204 26 L34 86 Z" fill="#fff" opacity=".035"/>
</g>
<rect x="52" y="16" width="54" height="5" rx="2.5" fill="#e8c37a" opacity=".75"/>
<rect x="414" y="16" width="54" height="5" rx="2.5" fill="#8fa8e0" opacity=".75"/>
<!-- helm and ops -->
<path d="M86 300 L98 274 L202 274 L214 300 Z" fill="url(#bc-console)" stroke="#2e4569" stroke-width="1.2"/>
<rect x="104" y="279" width="92" height="9" rx="3" fill="#0a1a22"/>
<rect x="108" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/>
<rect x="123" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/>
<rect x="138" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/>
<rect x="153" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/>
<rect x="168" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/>
<rect x="183" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/>
<rect x="86" y="300" width="128" height="10" rx="3" fill="#0b1220"/>
<path d="M306 300 L318 274 L422 274 L434 300 Z" fill="url(#bc-console)" stroke="#2e4569" stroke-width="1.2"/>
<rect x="324" y="279" width="92" height="9" rx="3" fill="#0a1a22"/>
<rect x="328" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/>
<rect x="343" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/>
<rect x="358" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/>
<rect x="373" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/>
<rect x="388" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/>
<rect x="403" y="281.5" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/>
<rect x="306" y="300" width="128" height="10" rx="3" fill="#0b1220"/>
<!-- the seats either side -->
<g transform="translate(116 424) scale(0.34) translate(-400 -714)" opacity=".85"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#bc-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#bc-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#bc-seat)"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#bc-rim)" stroke-width="3"/></g>
<g transform="translate(404 424) scale(0.34) translate(-400 -714)" opacity=".85"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#bc-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#bc-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#bc-seat)"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#bc-rim)" stroke-width="3"/></g>
<!-- the Captain's chair -->
<g transform="translate(260 440) scale(.6) translate(-400 -716)"><ellipse cx="400" cy="714" rx="170" ry="20" fill="url(#bc-shadow)"/>
<ellipse cx="400" cy="708" rx="84" ry="12" fill="#231c21" stroke="#c9a560" stroke-opacity=".45" stroke-width="1.5"/>
<path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#bc-metal)"/>
<rect x="304" y="612" width="192" height="42" rx="18" fill="#1d1216"/>
<path d="M310 618 Q400 606 490 618" fill="none" stroke="#5a3a40" stroke-width="2" opacity=".6"/>
<path d="M322 590 L276 586 Q256 586 256 600 Q256 614 276 614 L326 618 Z" fill="url(#bc-arm)"/>
<path d="M478 590 L524 586 Q544 586 544 600 Q544 614 524 614 L474 618 Z" fill="url(#bc-arm)"/>
<path d="M262 592 L318 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M538 592 L482 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>
<rect x="268" y="598" width="11" height="4" rx="2" fill="#3fc1a5" style="opacity:var(--q-local,1)"/>
<rect x="283" y="598" width="11" height="4" rx="2" fill="#f0a948" style="opacity:var(--q-codex,1)"/>
<rect x="298" y="598" width="11" height="4" rx="2" fill="#e889b6" style="opacity:var(--q-claude,1)"/>
<rect class="bc-armlight" x="492" y="598" width="40" height="4" rx="2" fill="#e8c37a"/>
<path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#bc-shell)"/>
<path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#bc-shell-top)"/>
<path d="M340 628 C328 556 312 470 315 402 C318 340 356 304 400 302 C444 304 482 340 485 402 C488 470 472 556 460 628" fill="none" stroke="#c9a560" stroke-width="1.8" stroke-opacity=".7"/>
<rect x="397.5" y="350" width="5" height="250" rx="2.5" fill="#c9a560" opacity=".22"/>
<path d="M400 318 L413 346 L400 339 L387 346 Z" fill="#e8c37a"/>
<path d="M400 318 L413 346 L400 339 Z" fill="#8a6a32" opacity=".5"/>
<path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#bc-rim)" stroke-width="2.6"/>
<path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#bc-vignette)" pointer-events="none"/>
</svg>
`;function Ge({pages:e,page:t,onPage:n}){return(0,E.jsx)(`span`,{className:`pager`,role:`group`,"aria-label":`Pages`,children:e.map((e,r)=>(0,E.jsx)(`button`,{type:`button`,className:`pager-dot`,"aria-pressed":t===r,"aria-label":`Page ${r+1}: ${e}`,"data-tip":e,onClick:()=>n(r)},e))})}var Ke=Object.fromEntries(Object.entries(Object.assign({"../assets/station-archives.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="ar-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="ar-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="ar-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="ar-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="ar-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="ar-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ar-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="ar-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ar-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="ar-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="ar-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="ar-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="ar-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="ar-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="ar-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="ar-trim-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".32"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient><linearGradient id="ar-shelflight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".16"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#ar-wall)"/>
<path d="M0 280 L520 280 L520 440 L0 440 Z" fill="url(#ar-floor)"/>
<ellipse cx="260" cy="288" rx="250" ry="26" fill="url(#ar-screenlight)"/>
<rect x="40" y="26" width="190" height="250" rx="6" fill="#120f16" stroke="#2e4569" stroke-width="1.4"/>
<rect x="40" y="84" width="190" height="5" fill="#2a2230"/>
<rect x="46" y="42.3" width="9.9" height="41.7" rx="1.5" fill="#6a4a7a" opacity=".9"/>
<rect x="57.3" y="39.5" width="12.2" height="44.5" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="70.6" y="53.2" width="8.5" height="30.8" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="81.1" y="52.4" width="7" height="31.6" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="88.8" y="48.3" width="12.2" height="35.7" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="102.4" y="41" width="10.1" height="43" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="114.3" y="41.1" width="6.3" height="42.9" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="121.9" y="51.8" width="10.9" height="32.2" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="134.1" y="49" width="7.6" height="35" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="143.6" y="53.1" width="6.9" height="30.9" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="152" y="40.2" width="10.4" height="43.8" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="163.5" y="52" width="12.6" height="32" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="178" y="41.8" width="6.2" height="42.2" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="185.5" y="39.5" width="12.5" height="44.5" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="199.5" y="46.5" width="8.6" height="37.5" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="209.7" y="39" width="6.2" height="45" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="217.3" y="50.2" width="10.4" height="33.8" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="40" y="136" width="190" height="5" fill="#2a2230"/>
<rect x="46" y="95" width="10.6" height="41" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="58.4" y="94" width="8.1" height="42" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="68" y="94.5" width="11.8" height="41.5" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="81.4" y="102.9" width="11.3" height="33.1" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="93.4" y="96.2" width="7.3" height="39.8" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="102.6" y="104.7" width="8.6" height="31.3" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="112.4" y="93.8" width="10.2" height="42.2" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="123.9" y="103.4" width="12.7" height="32.6" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="137.2" y="98.7" width="7.9" height="37.3" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="147" y="99.8" width="8.3" height="36.2" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="157" y="105.6" width="11.8" height="30.4" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="170.7" y="102.8" width="8.4" height="33.2" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="179.7" y="104.5" width="9.3" height="31.5" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="190.7" y="92.1" width="7.8" height="43.9" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="199.4" y="98" width="12.9" height="38" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="213.1" y="96.6" width="12.5" height="39.4" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="40" y="188" width="190" height="5" fill="#2a2230"/>
<rect x="46" y="144" width="8.2" height="44" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="55.2" y="157.8" width="8.4" height="30.2" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="65.6" y="153.9" width="10.1" height="34.1" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="77.2" y="148.6" width="7.4" height="39.4" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="85.8" y="150.2" width="6.5" height="37.8" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="93.9" y="146" width="6.7" height="42" rx="1.5" fill="#6a4a7a" opacity=".9"/>
<rect x="102.5" y="149.1" width="12" height="38.9" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="115.3" y="143.8" width="12.3" height="44.2" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="129.5" y="154.9" width="6.1" height="33.1" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="136.5" y="151.4" width="8.8" height="36.6" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="146.9" y="153.2" width="7.4" height="34.8" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="156" y="143.5" width="8.8" height="44.5" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="166.4" y="154.9" width="9.2" height="33.1" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="177.4" y="155.4" width="7.7" height="32.6" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="187" y="153.6" width="6.8" height="34.4" rx="1.5" fill="#6a4a7a" opacity=".9"/>
<rect x="195.6" y="151.8" width="11.1" height="36.2" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="207.9" y="150.4" width="6.8" height="37.6" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="215.8" y="151.5" width="12.6" height="36.5" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="40" y="240" width="190" height="5" fill="#2a2230"/>
<rect x="46" y="197.8" width="11.3" height="42.2" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="58.2" y="203.2" width="8.4" height="36.8" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="67.5" y="205" width="9.5" height="35" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="78.3" y="198.8" width="9.1" height="41.2" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="88.2" y="209.5" width="11.6" height="30.5" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="100.7" y="195.4" width="6.9" height="44.6" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="108.6" y="197.7" width="8.7" height="42.3" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="118.1" y="203.1" width="7.4" height="36.9" rx="1.5" fill="#6a4a7a" opacity=".9"/>
<rect x="126.5" y="199.5" width="6.8" height="40.5" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="134" y="201.3" width="11.1" height="38.7" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="146.3" y="200.3" width="10.6" height="39.7" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="158.5" y="202" width="8.4" height="38" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="168.5" y="194.7" width="7.7" height="45.3" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="177.4" y="201.9" width="12" height="38.1" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="191" y="202" width="6.1" height="38" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="197.8" y="199" width="12.1" height="41" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="211" y="195.9" width="11.5" height="44.1" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="40" y="26" width="190" height="250" rx="6" fill="url(#ar-shelflight)"/>
<rect x="290" y="26" width="190" height="250" rx="6" fill="#120f16" stroke="#2e4569" stroke-width="1.4"/>
<rect x="290" y="84" width="190" height="5" fill="#2a2230"/>
<rect x="296" y="47.6" width="6.3" height="36.4" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="303.1" y="38.6" width="9.8" height="45.4" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="314.8" y="41.9" width="7.1" height="42.1" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="323.8" y="44.1" width="7.5" height="39.9" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="332.7" y="53.5" width="12.2" height="30.5" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="346.8" y="48.1" width="12.4" height="35.9" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="359.9" y="44.4" width="8.4" height="39.6" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="370" y="46.5" width="11.2" height="37.5" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="382.4" y="40.5" width="7.3" height="43.5" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="390.5" y="38.1" width="6.1" height="45.9" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="397.8" y="50" width="11.8" height="34" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="410.3" y="51.8" width="11.3" height="32.2" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="422.8" y="49.6" width="6.6" height="34.4" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="430.1" y="45.2" width="6.6" height="38.8" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="437.4" y="42" width="7.3" height="42" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="446.6" y="47.7" width="7.5" height="36.3" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="455.4" y="44.7" width="9" height="39.3" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="465.3" y="45.3" width="8.1" height="38.7" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="290" y="136" width="190" height="5" fill="#2a2230"/>
<rect x="296" y="92.1" width="10.6" height="43.9" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="308.2" y="98.4" width="8" height="37.6" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="317.6" y="95.3" width="10.4" height="40.7" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="329" y="101.2" width="10.9" height="34.8" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="340.9" y="97.9" width="7.2" height="38.1" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="348.8" y="90.1" width="10.7" height="45.9" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="360.2" y="96.3" width="11.2" height="39.7" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="372.6" y="95.3" width="10.4" height="40.7" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="383.7" y="96.9" width="6.8" height="39.1" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="391.1" y="100.5" width="9.5" height="35.5" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="401.6" y="105.1" width="12.1" height="30.9" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="414.6" y="93.4" width="12.3" height="42.6" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="428.6" y="94.6" width="11.4" height="41.4" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="441.5" y="99.7" width="9" height="36.3" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="452" y="91.3" width="10.2" height="44.7" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="463" y="103.2" width="7.6" height="32.8" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="290" y="188" width="190" height="5" fill="#2a2230"/>
<rect x="296" y="148.5" width="11.6" height="39.5" rx="1.5" fill="#6a4a7a" opacity=".9"/>
<rect x="308.3" y="152.5" width="8.9" height="35.5" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="318.9" y="144.3" width="8.1" height="43.7" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="328" y="142.9" width="6.4" height="45.1" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="335.7" y="148.3" width="9.4" height="39.7" rx="1.5" fill="#8a4a3a" opacity=".9"/>
<rect x="346.9" y="147.4" width="10.9" height="40.6" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="359" y="145.2" width="6.2" height="42.8" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="366.4" y="143.7" width="11.4" height="44.3" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="379.2" y="157" width="12.8" height="31" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="393.7" y="154" width="8.4" height="34" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="403" y="145.9" width="10.4" height="42.1" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="415.3" y="143.4" width="12.8" height="44.6" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="430" y="144.3" width="10.4" height="43.7" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="441.5" y="157.2" width="8.6" height="30.8" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="451.6" y="145.9" width="11.8" height="42.1" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="465.3" y="153.3" width="10.9" height="34.7" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="290" y="240" width="190" height="5" fill="#2a2230"/>
<rect x="296" y="201" width="7.7" height="39" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="305.4" y="198" width="7.9" height="42" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="314.1" y="207.2" width="7.3" height="32.8" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="322.4" y="197.2" width="12.6" height="42.8" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="335.9" y="199.5" width="12.8" height="40.5" rx="1.5" fill="#7a3b3b" opacity=".9"/>
<rect x="349.8" y="203.7" width="10.5" height="36.3" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="361.7" y="198.7" width="12.1" height="41.3" rx="1.5" fill="#8a6a3a" opacity=".9"/>
<rect x="374.7" y="202" width="6.7" height="38" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="382.9" y="201.7" width="9.5" height="38.3" rx="1.5" fill="#a08050" opacity=".9"/>
<rect x="393.3" y="201.6" width="7.3" height="38.4" rx="1.5" fill="#556b4a" opacity=".9"/>
<rect x="402" y="199.2" width="9" height="40.8" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="412.6" y="195.3" width="11" height="44.7" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="425.1" y="200.3" width="9.7" height="39.7" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="436.7" y="209" width="6.6" height="31" rx="1.5" fill="#3b5a7a" opacity=".9"/>
<rect x="444.2" y="206.9" width="8.2" height="33.1" rx="1.5" fill="#4a6a5a" opacity=".9"/>
<rect x="454.3" y="198.2" width="7" height="41.8" rx="1.5" fill="#5a3a4a" opacity=".9"/>
<rect x="462" y="202.6" width="11.4" height="37.4" rx="1.5" fill="#2f4f6a" opacity=".9"/>
<rect x="290" y="26" width="190" height="250" rx="6" fill="url(#ar-shelflight)"/>
<rect x="238" y="70" width="44" height="200" rx="8" fill="#0b1220" stroke="#2e4569"/>
<circle cx="260" cy="120" r="16" fill="none" stroke="#2e4569" stroke-width="4"/>
<path d="M260 104 A16 16 0 1 1 245 126" fill="none" stroke="#3fc1a5" stroke-width="4" stroke-linecap="round" style="opacity:var(--sa-glow,1)"/>
<g style="opacity:var(--sa-glow,1)"><rect x="246" y="160" width="28" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g><g style="opacity:var(--sa-glow,1)"><rect x="246" y="176" width="20" height="5" rx="2.5" fill="#8fa8e0" opacity="0.5"/></g>
<path d="M90 342 L124 292 L396 292 L430 342 Z" fill="url(#ar-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M124 292 L396 292" stroke="#3fc1a5" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="90" y="342" width="340" height="12" rx="4" fill="#0b1220"/>
<path d="M210 300 l100 0 l8 22 l-116 0 Z" fill="#2b1f24" stroke="#5a4048"/>
<path d="M260 300 l0 22" stroke="#5a4048"/>
<g transform="translate(260 560) scale(0.46) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#ar-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#ar-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#ar-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#ar-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#ar-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-away.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="aw-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="aw-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="aw-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="aw-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="aw-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="aw-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="aw-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="aw-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="aw-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="aw-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="aw-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="aw-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="aw-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="aw-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="aw-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="aw-trim-glow"><stop offset="0" stop-color="#8fa8e0" stop-opacity=".32"/><stop offset="1" stop-color="#8fa8e0" stop-opacity="0"/></radialGradient><linearGradient id="aw-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#8fa8e0" stop-opacity=".35"/><stop offset="1" stop-color="#8fa8e0" stop-opacity="0"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#aw-wall)"/>
<path d="M0 240 L520 240 L520 440 L0 440 Z" fill="url(#aw-floor)"/>
<ellipse cx="260" cy="248" rx="250" ry="26" fill="url(#aw-screenlight)"/>
<path d="M80 60 Q260 20 440 60 L440 90 Q260 52 80 90 Z" fill="#141f34" stroke="#2e4569"/>
<ellipse cx="170" cy="214" rx="34" ry="11" fill="#0b1220" stroke="#2e4569" stroke-width="1.5"/>
<ellipse cx="170" cy="212" rx="24" ry="7" fill="#8fa8e0" opacity=".35" style="opacity:var(--sa-glow,1)"/>
<rect x="148" y="60" width="44" height="152" fill="url(#aw-beam)" class="sa-beam" style="animation-delay:-0.8s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="210" rx="34" ry="11" fill="#0b1220" stroke="#2e4569" stroke-width="1.5"/>
<ellipse cx="260" cy="208" rx="24" ry="7" fill="#8fa8e0" opacity=".35" style="opacity:var(--sa-glow,1)"/>
<rect x="238" y="56" width="44" height="152" fill="url(#aw-beam)" class="sa-beam" style="animation-delay:-1.6s;opacity:var(--sa-glow,1)"/>
<ellipse cx="350" cy="214" rx="34" ry="11" fill="#0b1220" stroke="#2e4569" stroke-width="1.5"/>
<ellipse cx="350" cy="212" rx="24" ry="7" fill="#8fa8e0" opacity=".35" style="opacity:var(--sa-glow,1)"/>
<rect x="328" y="60" width="44" height="152" fill="url(#aw-beam)" class="sa-beam" style="animation-delay:-0s;opacity:var(--sa-glow,1)"/>
<ellipse cx="210" cy="250" rx="34" ry="11" fill="#0b1220" stroke="#2e4569" stroke-width="1.5"/>
<ellipse cx="210" cy="248" rx="24" ry="7" fill="#8fa8e0" opacity=".35" style="opacity:var(--sa-glow,1)"/>
<rect x="188" y="96" width="44" height="152" fill="url(#aw-beam)" class="sa-beam" style="animation-delay:-0.4s;opacity:var(--sa-glow,1)"/>
<ellipse cx="310" cy="250" rx="34" ry="11" fill="#0b1220" stroke="#2e4569" stroke-width="1.5"/>
<ellipse cx="310" cy="248" rx="24" ry="7" fill="#8fa8e0" opacity=".35" style="opacity:var(--sa-glow,1)"/>
<rect x="288" y="96" width="44" height="152" fill="url(#aw-beam)" class="sa-beam" style="animation-delay:-1.2s;opacity:var(--sa-glow,1)"/>
<circle cx="311.2" cy="201.6" r="1.3" fill="#e6efff" class="sa-tw" style="animation-delay:-0.4s"/>
<circle cx="297.5" cy="153.6" r="1.4" fill="#e6efff" class="sa-tw" style="animation-delay:-0.9s"/>
<circle cx="214.7" cy="175.1" r="0.6" fill="#e6efff" class="sa-tw" style="animation-delay:-2.3s"/>
<circle cx="170.9" cy="106.1" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-3.7s"/>
<circle cx="349.7" cy="112.7" r="1.1" fill="#e6efff" class="sa-tw" style="animation-delay:-2.4s"/>
<circle cx="296.5" cy="208.2" r="1.3" fill="#e6efff" class="sa-tw" style="animation-delay:-3.1s"/>
<circle cx="165" cy="140.7" r="1.3" fill="#e6efff" class="sa-tw" style="animation-delay:-1.5s"/>
<circle cx="297.8" cy="174.4" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-2.8s"/>
<circle cx="152.6" cy="152.7" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-4.2s"/>
<circle cx="224.1" cy="215.8" r="0.7" fill="#e6efff" class="sa-tw" style="animation-delay:-3.1s"/>
<circle cx="327.3" cy="111.6" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-1s"/>
<circle cx="172.3" cy="70.4" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-2.8s"/>
<circle cx="338" cy="176.3" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-3.5s"/>
<circle cx="160.7" cy="129.5" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-4.8s"/>
<circle cx="267.2" cy="97.5" r="1.1" fill="#e6efff" class="sa-tw" style="animation-delay:-4.4s"/>
<circle cx="194.2" cy="217" r="1.3" fill="#e6efff" class="sa-tw" style="animation-delay:-0.2s"/>
<circle cx="259.1" cy="134.5" r="0.7" fill="#e6efff" class="sa-tw" style="animation-delay:-2.9s"/>
<circle cx="242.4" cy="103.6" r="1" fill="#e6efff" class="sa-tw" style="animation-delay:-3.5s"/>
<circle cx="350" cy="133.6" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-0.9s"/>
<circle cx="222.8" cy="180.9" r="1.4" fill="#e6efff" class="sa-tw" style="animation-delay:-0.6s"/>
<circle cx="325.8" cy="166.8" r="1" fill="#e6efff" class="sa-tw" style="animation-delay:-4.7s"/>
<circle cx="204.9" cy="217.7" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-2.9s"/>
<circle cx="326.3" cy="220" r="1.3" fill="#e6efff" class="sa-tw" style="animation-delay:-1.3s"/>
<circle cx="217" cy="205" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-0.7s"/>
<circle cx="226.5" cy="197.5" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-1.8s"/>
<circle cx="226.3" cy="123" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-1.1s"/>
<circle cx="311.1" cy="166.2" r="1.3" fill="#e6efff" class="sa-tw" style="animation-delay:-0.7s"/>
<circle cx="366.5" cy="141.9" r="0.8" fill="#e6efff" class="sa-tw" style="animation-delay:-3.9s"/>
<circle cx="361.1" cy="134.3" r="1.1" fill="#e6efff" class="sa-tw" style="animation-delay:-0.6s"/>
<circle cx="245.6" cy="175" r="1.2" fill="#e6efff" class="sa-tw" style="animation-delay:-3.9s"/>
<circle cx="182.7" cy="87.6" r="1.1" fill="#e6efff" class="sa-tw" style="animation-delay:-4.1s"/>
<circle cx="217.2" cy="190.4" r="1" fill="#e6efff" class="sa-tw" style="animation-delay:-3s"/>
<circle cx="264" cy="139.5" r="0.7" fill="#e6efff" class="sa-tw" style="animation-delay:-3.9s"/>
<circle cx="258" cy="175.2" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-2.7s"/>
<circle cx="183.2" cy="74.7" r="0.6" fill="#e6efff" class="sa-tw" style="animation-delay:-2.9s"/>
<circle cx="248.7" cy="100.8" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-2.5s"/>
<circle cx="268.8" cy="122.6" r="0.9" fill="#e6efff" class="sa-tw" style="animation-delay:-1.9s"/>
<circle cx="168.3" cy="80.5" r="1" fill="#e6efff" class="sa-tw" style="animation-delay:-0.9s"/>
<circle cx="263.1" cy="80.3" r="1" fill="#e6efff" class="sa-tw" style="animation-delay:-0.7s"/>
<circle cx="176.1" cy="103.7" r="1.1" fill="#e6efff" class="sa-tw" style="animation-delay:-2.2s"/>
<path d="M90 236 Q260 190 430 236 L450 290 Q260 250 70 290 Z" fill="none" stroke="#2e4569" stroke-width="2"/>
<path d="M120 380 L154 330 L366 330 L400 380 Z" fill="url(#aw-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M154 330 L366 330" stroke="#8fa8e0" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="120" y="380" width="280" height="12" rx="4" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="170" y="344" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.5"/><rect x="194" y="344" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="218" y="344" width="14" height="5" rx="2.5" fill="#f0a948" opacity="0.9"/><rect x="242" y="344" width="14" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="266" y="344" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7"/><rect x="290" y="344" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="314" y="344" width="14" height="5" rx="2.5" fill="#f0a948" opacity="0.5"/><rect x="338" y="344" width="14" height="5" rx="2.5" fill="#e889b6" opacity="0.7"/></g>
<rect x="196" y="358" width="30" height="8" rx="3" fill="#8fa8e0" opacity=".5" class="sa-key" style="animation-delay:-0.0s"/>
<rect x="242" y="358" width="30" height="8" rx="3" fill="#8fa8e0" opacity=".5" class="sa-key" style="animation-delay:-0.5s"/>
<rect x="288" y="358" width="30" height="8" rx="3" fill="#8fa8e0" opacity=".5" class="sa-key" style="animation-delay:-1.0s"/>
<rect width="520" height="440" fill="url(#aw-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-calib.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="cb-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="cb-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="cb-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="cb-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="cb-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="cb-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cb-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="cb-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cb-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="cb-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="cb-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="cb-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="cb-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="cb-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="cb-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="cb-trim-glow"><stop offset="0" stop-color="#e889b6" stop-opacity=".32"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#cb-wall)"/>
<path d="M0 276 L520 276 L520 440 L0 440 Z" fill="url(#cb-floor)"/>
<ellipse cx="260" cy="284" rx="250" ry="26" fill="url(#cb-screenlight)"/>
<rect x="54" y="30" width="272" height="192" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="60" y="36" width="260" height="180" rx="12" fill="#0b1220"/>
<rect x="60" y="36" width="37" height="120" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="97" y="36" width="37" height="120" fill="#f0a948" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="134" y="36" width="37" height="120" fill="#e889b6" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="171" y="36" width="37" height="120" fill="#8fa8e0" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="208" y="36" width="37" height="120" fill="#e8c37a" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="245" y="36" width="37" height="120" fill="#e8645c" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="282" y="36" width="37" height="120" fill="#e6efff" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="60" y="156" width="26" height="60" fill="#141414" opacity=".9"/>
<rect x="86" y="156" width="26" height="60" fill="#2a2a2a" opacity=".9"/>
<rect x="112" y="156" width="26" height="60" fill="#404040" opacity=".9"/>
<rect x="138" y="156" width="26" height="60" fill="#565656" opacity=".9"/>
<rect x="164" y="156" width="26" height="60" fill="#6c6c6c" opacity=".9"/>
<rect x="190" y="156" width="26" height="60" fill="#828282" opacity=".9"/>
<rect x="216" y="156" width="26" height="60" fill="#989898" opacity=".9"/>
<rect x="242" y="156" width="26" height="60" fill="#aeaeae" opacity=".9"/>
<rect x="268" y="156" width="26" height="60" fill="#c4c4c4" opacity=".9"/>
<rect x="294" y="156" width="26" height="60" fill="#dadada" opacity=".9"/>
<circle cx="400" cy="140" r="60" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<line x1="356.8" y1="124.3" x2="349.3" y2="121.5" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="361.9" y1="114.3" x2="355.2" y2="109.8" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="369.2" y1="105.8" x2="363.9" y2="99.9" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="378.4" y1="99.4" x2="374.6" y2="92.3" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="388.9" y1="95.4" x2="386.9" y2="87.6" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="400" y1="94" x2="400" y2="86" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="411.1" y1="95.4" x2="413.1" y2="87.6" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="421.6" y1="99.4" x2="425.4" y2="92.3" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="430.8" y1="105.8" x2="436.1" y2="99.9" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="438.1" y1="114.3" x2="444.8" y2="109.8" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<line x1="443.2" y1="124.3" x2="450.7" y2="121.5" stroke="#8aa0c4" stroke-width="1.4" opacity=".6"/>
<path d="M387.9 91.5 A50 50 0 0 1 412.1 91.5" fill="none" stroke="#3fc1a5" stroke-width="5" style="opacity:var(--sa-glow,1)"/>
<line x1="400" y1="140" x2="400" y2="96" stroke="#e8c37a" stroke-width="2.4" stroke-linecap="round" class="sa-needle" style="transform-origin:400px 140px"/>
<circle cx="400" cy="140" r="4" fill="#0b1220" stroke="#8aa0c4"/>
<path d="M50 344 L84 292 L436 292 L470 344 Z" fill="url(#cb-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M84 292 L436 292" stroke="#e889b6" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="50" y="344" width="420" height="12" rx="4" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="100" y="306" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="128" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="156" y="306" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/><rect x="184" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="212" y="306" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.7"/><rect x="240" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="268" y="306" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="296" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="324" y="306" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/><rect x="352" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="380" y="306" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.7"/><rect x="408" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/></g>
<g transform="translate(260 568) scale(0.46) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#cb-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#cb-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#cb-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#cb-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#cb-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-carto.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="ct-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="ct-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="ct-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="ct-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="ct-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="ct-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ct-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="ct-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ct-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="ct-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="ct-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="ct-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="ct-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="ct-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="ct-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="ct-trim-glow"><stop offset="0" stop-color="#e889b6" stop-opacity=".32"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#ct-wall)"/>
<path d="M0 268 L520 268 L520 440 L0 440 Z" fill="url(#ct-floor)"/>
<ellipse cx="260" cy="276" rx="250" ry="26" fill="url(#ct-screenlight)"/>
<path d="M30 40 Q260 0 490 40 L490 250 Q260 214 30 250 Z" fill="url(#ct-space)" stroke="#2e4569" stroke-width="2"/>
<circle cx="112.1" cy="161.6" r="1.4" fill="#ffffff" opacity="0.7" class="sa-tw" style="animation-delay:-2.7s"/>
<circle cx="325.5" cy="186.5" r="1.2" fill="#fff1d6" opacity="0.4"/>
<circle cx="192.2" cy="99.9" r="1.2" fill="#fff1d6" opacity="0.5"/>
<circle cx="421.4" cy="151.9" r="1.2" fill="#fff1d6" opacity="0.8"/>
<circle cx="359.3" cy="52.2" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="137.3" cy="123.1" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="323.7" cy="39.7" r="1.2" fill="#fff1d6" opacity="0.9"/>
<circle cx="149.8" cy="135.9" r="0.5" fill="#ffffff" opacity="0.9"/>
<circle cx="380.1" cy="136.9" r="0.7" fill="#fff1d6" opacity="0.6" class="sa-tw" style="animation-delay:-3.4s"/>
<circle cx="319.4" cy="153.5" r="0.5" fill="#fff1d6" opacity="0.5"/>
<circle cx="369.2" cy="115.4" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="330.1" cy="184.5" r="0.8" fill="#ffffff" opacity="0.4"/>
<circle cx="207.7" cy="110.7" r="0.7" fill="#ffffff" opacity="0.9"/>
<circle cx="383.7" cy="87.8" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="298.4" cy="57.4" r="1.2" fill="#fff1d6" opacity="0.6"/>
<circle cx="445.3" cy="98.5" r="0.9" fill="#fff1d6" opacity="0.7"/>
<circle cx="153.7" cy="77.5" r="1.2" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-2.9s"/>
<circle cx="88.7" cy="158" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="420.6" cy="119.4" r="1.2" fill="#ffffff" opacity="0.4"/>
<circle cx="106.8" cy="149.2" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="398.7" cy="47.1" r="0.8" fill="#fff1d6" opacity="0.9"/>
<circle cx="199.5" cy="89.3" r="1.4" fill="#dfe8ff" opacity="0.9"/>
<circle cx="186.7" cy="73.4" r="1.2" fill="#dfe8ff" opacity="0.9"/>
<circle cx="109" cy="232.9" r="1.2" fill="#fff1d6" opacity="0.9"/>
<circle cx="60.8" cy="91.7" r="1" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-3.2s"/>
<circle cx="345.5" cy="190.7" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="415.3" cy="55" r="1.4" fill="#dfe8ff" opacity="0.7"/>
<circle cx="189.3" cy="39.9" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="446.3" cy="37" r="0.8" fill="#dfe8ff" opacity="0.4"/>
<circle cx="230.6" cy="72.6" r="0.8" fill="#ffffff" opacity="0.8"/>
<circle cx="439.5" cy="147.3" r="1" fill="#dfe8ff" opacity="0.6"/>
<circle cx="218.2" cy="107.7" r="0.7" fill="#dfe8ff" opacity="0.8"/>
<circle cx="111.2" cy="37.1" r="0.9" fill="#dfe8ff" opacity="0.5" class="sa-tw" style="animation-delay:-0.7s"/>
<circle cx="192.2" cy="188.3" r="0.6" fill="#dfe8ff" opacity="0.8"/>
<circle cx="446.8" cy="180" r="0.8" fill="#fff1d6" opacity="0.8"/>
<circle cx="328.7" cy="60.9" r="1.2" fill="#ffffff" opacity="0.4"/>
<circle cx="118.9" cy="119.6" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="446" cy="121.7" r="0.8" fill="#fff1d6" opacity="0.7"/>
<circle cx="380.7" cy="117" r="0.8" fill="#dfe8ff" opacity="0.9"/>
<circle cx="146.9" cy="64.6" r="0.9" fill="#dfe8ff" opacity="0.9"/>
<circle cx="348.7" cy="176" r="0.6" fill="#ffffff" opacity="0.4" class="sa-tw" style="animation-delay:-6s"/>
<circle cx="397.7" cy="176.7" r="1.4" fill="#ffffff" opacity="0.9"/>
<circle cx="386.7" cy="175.9" r="1.4" fill="#ffffff" opacity="0.5"/>
<circle cx="322.6" cy="229" r="0.7" fill="#fff1d6" opacity="0.8"/>
<circle cx="364.3" cy="96.3" r="1.2" fill="#ffffff" opacity="0.6"/>
<circle cx="209" cy="126.5" r="1.2" fill="#ffffff" opacity="0.4"/>
<circle cx="121.6" cy="51.9" r="0.6" fill="#fff1d6" opacity="0.4"/>
<circle cx="306.3" cy="54.7" r="0.9" fill="#ffffff" opacity="0.8"/>
<circle cx="150.7" cy="156.6" r="0.8" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-2.3s"/>
<circle cx="316.4" cy="125.6" r="0.6" fill="#ffffff" opacity="0.8"/>
<circle cx="267.3" cy="134.5" r="0.6" fill="#dfe8ff" opacity="0.7"/>
<circle cx="108.6" cy="203.7" r="1.2" fill="#ffffff" opacity="0.5"/>
<circle cx="166.3" cy="146.5" r="0.6" fill="#fff1d6" opacity="0.4"/>
<circle cx="290.6" cy="178.6" r="0.6" fill="#dfe8ff" opacity="0.7"/>
<circle cx="360.7" cy="217.7" r="1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="244.3" cy="174.6" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="337.2" cy="198.7" r="1.2" fill="#dfe8ff" opacity="0.7" class="sa-tw" style="animation-delay:-0.3s"/>
<circle cx="476.6" cy="114.3" r="0.6" fill="#dfe8ff" opacity="0.8"/>
<circle cx="321.1" cy="61.9" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="86.6" cy="148.7" r="0.7" fill="#ffffff" opacity="0.5"/>
<circle cx="338.1" cy="173.5" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="115.6" cy="221.2" r="0.7" fill="#ffffff" opacity="0.8"/>
<circle cx="408.5" cy="143.6" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="291.8" cy="200.6" r="0.6" fill="#ffffff" opacity="0.6"/>
<circle cx="292.4" cy="85" r="1.4" fill="#fff1d6" opacity="0.5" class="sa-tw" style="animation-delay:-0.5s"/>
<circle cx="160.8" cy="83.5" r="1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="353.6" cy="222.9" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="436.3" cy="186.1" r="1.4" fill="#fff1d6" opacity="0.9"/>
<circle cx="171.1" cy="124.9" r="1.4" fill="#dfe8ff" opacity="0.7"/>
<circle cx="266.2" cy="71.7" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="328.8" cy="207.2" r="1.2" fill="#ffffff" opacity="0.9"/>
<circle cx="185.2" cy="117.6" r="1.4" fill="#fff1d6" opacity="0.4"/>
<circle cx="104.3" cy="83.6" r="0.7" fill="#fff1d6" opacity="0.9" class="sa-tw" style="animation-delay:-2.9s"/>
<circle cx="305.4" cy="145.7" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="237.5" cy="103" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="283.5" cy="198" r="0.6" fill="#ffffff" opacity="0.7"/>
<circle cx="337.9" cy="98.9" r="0.6" fill="#fff1d6" opacity="0.4"/>
<circle cx="134" cy="70.3" r="1" fill="#fff1d6" opacity="0.5"/>
<circle cx="69.9" cy="135.8" r="0.5" fill="#fff1d6" opacity="0.4"/>
<circle cx="55" cy="107" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="212.6" cy="120.8" r="0.7" fill="#fff1d6" opacity="0.9" class="sa-tw" style="animation-delay:-2.7s"/>
<circle cx="292" cy="109" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="468" cy="67.4" r="0.6" fill="#ffffff" opacity="0.5"/>
<circle cx="129" cy="35.9" r="1.4" fill="#fff1d6" opacity="0.4"/>
<circle cx="274.2" cy="115.9" r="0.6" fill="#fff1d6" opacity="0.8"/>
<circle cx="448.1" cy="186.5" r="0.5" fill="#ffffff" opacity="0.7"/>
<circle cx="305.6" cy="197.1" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="426.5" cy="206.1" r="1.2" fill="#fff1d6" opacity="0.5"/>
<circle cx="119.5" cy="200" r="1" fill="#dfe8ff" opacity="0.9" class="sa-tw" style="animation-delay:-4.1s"/>
<circle cx="460" cy="225.8" r="0.8" fill="#fff1d6" opacity="0.7"/>
<circle cx="83" cy="69.2" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="174.9" cy="57.8" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="76.5" cy="57.4" r="1" fill="#fff1d6" opacity="0.6"/>
<circle cx="203" cy="232.7" r="0.9" fill="#ffffff" opacity="0.9"/>
<circle cx="435.3" cy="80.7" r="0.8" fill="#dfe8ff" opacity="0.7"/>
<circle cx="231.9" cy="193.2" r="1.2" fill="#dfe8ff" opacity="0.8"/>
<circle cx="404.9" cy="175.1" r="1.2" fill="#fff1d6" opacity="0.4" class="sa-tw" style="animation-delay:-5s"/>
<circle cx="320.4" cy="182.5" r="0.7" fill="#dfe8ff" opacity="0.9"/>
<circle cx="206.1" cy="217.1" r="0.7" fill="#ffffff" opacity="0.6"/>
<circle cx="97" cy="191.6" r="1" fill="#ffffff" opacity="0.9"/>
<circle cx="466.5" cy="195.3" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="454.2" cy="128.1" r="1.2" fill="#fff1d6" opacity="0.7"/>
<circle cx="262.1" cy="117.9" r="0.9" fill="#dfe8ff" opacity="0.5"/>
<circle cx="259.6" cy="50.2" r="0.5" fill="#ffffff" opacity="0.7"/>
<circle cx="189.4" cy="101.5" r="0.6" fill="#dfe8ff" opacity="0.6" class="sa-tw" style="animation-delay:-0.4s"/>
<circle cx="178.5" cy="38" r="0.8" fill="#dfe8ff" opacity="0.5"/>
<circle cx="271.4" cy="232.8" r="1" fill="#dfe8ff" opacity="0.4"/>
<circle cx="347.5" cy="177.9" r="0.7" fill="#fff1d6" opacity="0.6"/>
<circle cx="97.8" cy="113.1" r="0.8" fill="#fff1d6" opacity="0.7"/>
<circle cx="369" cy="143.9" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="143.4" cy="66.9" r="0.8" fill="#ffffff" opacity="0.4"/>
<circle cx="328.3" cy="63.5" r="0.5" fill="#fff1d6" opacity="0.5"/>
<circle cx="128.7" cy="170.6" r="1" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-2.7s"/>
<circle cx="308.4" cy="110.8" r="0.8" fill="#fff1d6" opacity="0.4"/>
<circle cx="459.2" cy="87.6" r="0.6" fill="#fff1d6" opacity="0.5"/>
<circle cx="402.1" cy="170.8" r="0.7" fill="#ffffff" opacity="0.5"/>
<circle cx="348.9" cy="162.5" r="1" fill="#fff1d6" opacity="0.5"/>
<circle cx="141.8" cy="144.2" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="439.2" cy="129" r="0.9" fill="#ffffff" opacity="0.8"/>
<circle cx="238.7" cy="140.4" r="0.7" fill="#ffffff" opacity="0.5"/>
<circle cx="110" cy="80" r="6" fill="url(#ct-starglow)"/><circle cx="110" cy="80" r="1.3" fill="#fff"/>
<circle cx="400" cy="70" r="5" fill="url(#ct-starglow)"/><circle cx="400" cy="70" r="1.3" fill="#fff"/>
<path d="M80 120 L130 90 L190 130 L240 96" fill="none" stroke="#e889b6" stroke-width="1.2" opacity=".6"/>
<circle cx="80" cy="120" r="2.6" fill="#e889b6"/>
<circle cx="130" cy="90" r="2.6" fill="#e889b6"/>
<circle cx="190" cy="130" r="2.6" fill="#e889b6"/>
<circle cx="240" cy="96" r="2.6" fill="#e889b6"/>
<rect x="290" y="80" width="150" height="120" rx="10" fill="#101a2e" stroke="#e889b6" stroke-width="1.4" opacity=".95" class="sa-holo" style="opacity:var(--sa-glow,1)"/>
<rect x="302" y="92" width="40" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/>
<rect x="304" y="156" width="10" height="30" rx="2" fill="#8fa8e0" opacity=".8"/>
<rect x="320" y="136" width="10" height="50" rx="2" fill="#8fa8e0" opacity=".8"/>
<rect x="336" y="148" width="10" height="38" rx="2" fill="#8fa8e0" opacity=".8"/>
<rect x="352" y="122" width="10" height="64" rx="2" fill="#e889b6" opacity=".8"/>
<rect x="368" y="140" width="10" height="46" rx="2" fill="#8fa8e0" opacity=".8"/>
<circle cx="412" cy="150" r="18" fill="#8fa8e0" opacity=".4"/>
<path d="M412 150 L412 132 A18 18 0 0 1 429 156 Z" fill="#e889b6" opacity=".85"/>
<ellipse cx="260" cy="320" rx="150" ry="34" fill="#0e1729" stroke="#2e4569" stroke-width="2"/>
<ellipse cx="260" cy="316" rx="120" ry="24" fill="none" stroke="#e889b6" stroke-opacity=".35"/>
<path d="M150 318 L120 440 L400 440 L370 318" fill="#0c1322"/>
<g style="opacity:var(--sa-glow,1)"><rect x="196" y="330" width="12" height="4" rx="2" fill="#e889b6" opacity="0.5"/><rect x="218" y="330" width="12" height="4" rx="2" fill="#8fa8e0" opacity="0.7"/><rect x="240" y="330" width="12" height="4" rx="2" fill="#e889b6" opacity="0.9"/><rect x="262" y="330" width="12" height="4" rx="2" fill="#8fa8e0" opacity="0.5"/><rect x="284" y="330" width="12" height="4" rx="2" fill="#e889b6" opacity="0.7"/><rect x="306" y="330" width="12" height="4" rx="2" fill="#8fa8e0" opacity="0.9"/></g>
<g transform="translate(260 590) scale(0.5) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#ct-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#ct-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#ct-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#ct-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#ct-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-comms.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="cm-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="cm-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="cm-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="cm-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="cm-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="cm-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cm-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="cm-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cm-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="cm-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="cm-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="cm-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="cm-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="cm-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="cm-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="cm-trim-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".32"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#cm-wall)"/>
<path d="M0 280 L520 280 L520 440 L0 440 Z" fill="url(#cm-floor)"/>
<ellipse cx="260" cy="288" rx="250" ry="26" fill="url(#cm-screenlight)"/>
<rect x="54" y="34" width="262" height="208" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="60" y="40" width="250" height="196" rx="12" fill="#0b1220"/>
<rect x="72" y="34" width="50" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/>
<rect x="78" y="62" width="214" height="26" rx="6" fill="#101a2e" stroke="#2e4569"/>
<path d="M88 69 h18 v12 h-18 z M88 69 l9 7 l9 -7" fill="none" stroke="#3fc1a5" stroke-width="1.3" style="opacity:var(--sa-glow,1)"/>
<rect x="116" y="71" width="120" height="4" rx="2" fill="#8aa0c4" opacity=".5"/>
<rect x="116" y="78" width="80" height="3" rx="1.5" fill="#8aa0c4" opacity=".3"/>
<rect x="254" y="71" width="28" height="8" rx="4" fill="none" stroke="#e8c37a" stroke-width="1.2"/>
<rect x="78" y="96" width="214" height="26" rx="6" fill="#101a2e" stroke="#2e4569"/>
<path d="M88 103 h18 v12 h-18 z M88 103 l9 7 l9 -7" fill="none" stroke="#3fc1a5" stroke-width="1.3" style="opacity:var(--sa-glow,1)"/>
<rect x="116" y="105" width="96" height="4" rx="2" fill="#8aa0c4" opacity=".5"/>
<rect x="116" y="112" width="60" height="3" rx="1.5" fill="#8aa0c4" opacity=".3"/>
<rect x="254" y="105" width="28" height="8" rx="4" fill="none" stroke="#e8c37a" stroke-width="1.2"/>
<rect x="78" y="130" width="214" height="26" rx="6" fill="#101a2e" stroke="#2e4569"/>
<path d="M88 137 h18 v12 h-18 z M88 137 l9 7 l9 -7" fill="none" stroke="#8aa0c4" stroke-width="1.3" style="opacity:var(--sa-glow,1)"/>
<rect x="116" y="139" width="72" height="4" rx="2" fill="#8aa0c4" opacity=".5"/>
<rect x="116" y="146" width="80" height="3" rx="1.5" fill="#8aa0c4" opacity=".3"/>
<rect x="78" y="164" width="214" height="26" rx="6" fill="#101a2e" stroke="#2e4569"/>
<path d="M88 171 h18 v12 h-18 z M88 171 l9 7 l9 -7" fill="none" stroke="#8aa0c4" stroke-width="1.3" style="opacity:var(--sa-glow,1)"/>
<rect x="116" y="173" width="120" height="4" rx="2" fill="#8aa0c4" opacity=".5"/>
<rect x="116" y="180" width="60" height="3" rx="1.5" fill="#8aa0c4" opacity=".3"/>
<rect x="78" y="198" width="214" height="26" rx="6" fill="#101a2e" stroke="#2e4569"/>
<path d="M88 205 h18 v12 h-18 z M88 205 l9 7 l9 -7" fill="none" stroke="#8aa0c4" stroke-width="1.3" style="opacity:var(--sa-glow,1)"/>
<rect x="116" y="207" width="96" height="4" rx="2" fill="#8aa0c4" opacity=".5"/>
<rect x="116" y="214" width="80" height="3" rx="1.5" fill="#8aa0c4" opacity=".3"/>
<line x1="400" y1="130" x2="400" y2="250" stroke="#8aa0c4" stroke-width="3"/>
<circle cx="400" cy="130" r="6" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<circle cx="400" cy="130" r="14" fill="none" stroke="#3fc1a5" stroke-width="1.5" class="sa-ping" style="transform-origin:400px 130px;animation-delay:-0s;opacity:var(--sa-glow,1)"/>
<circle cx="400" cy="130" r="14" fill="none" stroke="#3fc1a5" stroke-width="1.5" class="sa-ping" style="transform-origin:400px 130px;animation-delay:-0.8s;opacity:var(--sa-glow,1)"/>
<circle cx="400" cy="130" r="14" fill="none" stroke="#3fc1a5" stroke-width="1.5" class="sa-ping" style="transform-origin:400px 130px;animation-delay:-1.7s;opacity:var(--sa-glow,1)"/>
<path d="M50 348 L84 296 L436 296 L470 348 Z" fill="url(#cm-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M84 296 L436 296" stroke="#3fc1a5" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="50" y="348" width="420" height="12" rx="4" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="100" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="128" y="310" width="16" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/><rect x="156" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="184" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="212" y="310" width="16" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/><rect x="240" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="268" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="296" y="310" width="16" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/><rect x="324" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="352" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="380" y="310" width="16" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/><rect x="408" y="310" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/></g>
<g transform="translate(260 572) scale(0.46) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#cm-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#cm-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#cm-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#cm-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#cm-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-computer.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="cp-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="cp-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="cp-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="cp-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="cp-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="cp-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cp-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="cp-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cp-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="cp-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="cp-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="cp-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="cp-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="cp-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="cp-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="cp-trim-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".32"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient><linearGradient id="cp-core" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".08"/><stop offset=".5" stop-color="#3fc1a5" stop-opacity=".55"/><stop offset="1" stop-color="#3fc1a5" stop-opacity=".08"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#cp-wall)"/>
<path d="M0 300 L520 300 L520 440 L0 440 Z" fill="url(#cp-floor)"/>
<ellipse cx="260" cy="308" rx="250" ry="26" fill="url(#cp-screenlight)"/>
<rect x="40" y="40" width="100" height="220" rx="10" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="56" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="73" y="56" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="94" y="56" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="115" y="56" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="78" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="73" y="78" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="94" y="78" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="115" y="78" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="100" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="73" y="100" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="94" y="100" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="115" y="100" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="122" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="73" y="122" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="94" y="122" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="115" y="122" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="144" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="73" y="144" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="94" y="144" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="115" y="144" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="166" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="73" y="166" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="94" y="166" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="115" y="166" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="188" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="73" y="188" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="94" y="188" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="115" y="188" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="210" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="73" y="210" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="94" y="210" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="115" y="210" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="52" y="232" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="73" y="232" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="94" y="232" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="115" y="232" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<rect x="380" y="40" width="100" height="220" rx="10" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="56" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="413" y="56" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="434" y="56" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="455" y="56" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="78" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="413" y="78" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="434" y="78" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="455" y="78" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="100" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="413" y="100" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="434" y="100" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="455" y="100" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="122" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="413" y="122" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="434" y="122" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="455" y="122" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="144" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="413" y="144" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="434" y="144" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="455" y="144" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="166" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="413" y="166" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="434" y="166" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="455" y="166" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="188" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="413" y="188" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="434" y="188" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="455" y="188" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="210" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="413" y="210" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="434" y="210" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="455" y="210" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="232" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="413" y="232" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="434" y="232" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="455" y="232" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<rect x="222" y="20" width="76" height="300" rx="20" fill="url(#cp-core)" style="opacity:var(--sa-glow,1)"/>
<rect x="222" y="20" width="76" height="300" rx="20" fill="none" stroke="#3fc1a5" stroke-opacity=".6" stroke-width="1.5"/>
<ellipse cx="260" cy="50" rx="54" ry="10" fill="none" stroke="#3fc1a5" stroke-width="2" opacity=".7" class="sa-ping-soft" style="animation-delay:-0s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="90" rx="54" ry="10" fill="none" stroke="#3fc1a5" stroke-width="2" opacity=".7" class="sa-ping-soft" style="animation-delay:-0.5s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="130" rx="54" ry="10" fill="none" stroke="#3fc1a5" stroke-width="2" opacity=".7" class="sa-ping-soft" style="animation-delay:-1s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="170" rx="54" ry="10" fill="none" stroke="#3fc1a5" stroke-width="2" opacity=".7" class="sa-ping-soft" style="animation-delay:-1.5s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="210" rx="54" ry="10" fill="none" stroke="#3fc1a5" stroke-width="2" opacity=".7" class="sa-ping-soft" style="animation-delay:-2s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="250" rx="54" ry="10" fill="none" stroke="#3fc1a5" stroke-width="2" opacity=".7" class="sa-ping-soft" style="animation-delay:-2.5s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="290" rx="54" ry="10" fill="none" stroke="#3fc1a5" stroke-width="2" opacity=".7" class="sa-ping-soft" style="animation-delay:-3s;opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="330" rx="110" ry="22" fill="#0e1729" stroke="#2e4569" stroke-width="2"/>
<ellipse cx="260" cy="326" rx="60" ry="10" fill="#3fc1a5" opacity=".35" style="opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="400" rx="220" ry="30" fill="url(#cp-trim-glow)" style="opacity:var(--sa-glow,1)" opacity=".55"/>
<rect width="520" height="440" fill="url(#cp-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-crewq.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="cq-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="cq-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="cq-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="cq-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="cq-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="cq-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cq-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="cq-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="cq-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="cq-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="cq-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="cq-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="cq-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="cq-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="cq-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="cq-trim-glow"><stop offset="0" stop-color="#8fa8e0" stop-opacity=".32"/><stop offset="1" stop-color="#8fa8e0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#cq-wall)"/><path d="M0 60 Q260 30 520 60 L520 300 Q260 330 0 300 Z" fill="#0d1526"/>
<rect x="20" y="69.6" width="64" height="230.2" rx="8" fill="#141f34" stroke="#2e4569" stroke-width="1.4"/>
<line x1="52.0" y1="75.6" x2="52.0" y2="293.8" stroke="#2e4569"/>
<rect x="40" y="53.6" width="24" height="7" rx="3.5" fill="#3fc1a5" opacity="0.8" style="opacity:var(--sa-glow,1)"/>
<rect x="92" y="67.6" width="54" height="233.7" rx="8" fill="#141f34" stroke="#2e4569" stroke-width="1.4"/>
<line x1="119.0" y1="73.6" x2="119.0" y2="295.3" stroke="#2e4569"/>
<rect x="107" y="51.6" width="24" height="7" rx="3.5" fill="#f0a948" opacity="0.8" style="opacity:var(--sa-glow,1)"/>
<rect x="172" y="66" width="48" height="236.5" rx="8" fill="#141f34" stroke="#2e4569" stroke-width="1.4"/>
<line x1="196.0" y1="72" x2="196.0" y2="296.5" stroke="#2e4569"/>
<rect x="184" y="50" width="24" height="7" rx="3.5" fill="#2a3550" opacity="0.5" style=""/>
<rect x="260" y="64.8" width="46" height="238.6" rx="8" fill="#141f34" stroke="#2e4569" stroke-width="1.4"/>
<line x1="283.0" y1="70.8" x2="283.0" y2="297.4" stroke="#2e4569"/>
<rect x="271" y="48.8" width="24" height="7" rx="3.5" fill="#e889b6" opacity="0.8" style="opacity:var(--sa-glow,1)"/>
<rect x="350" y="66" width="48" height="236.5" rx="8" fill="#141f34" stroke="#2e4569" stroke-width="1.4"/>
<line x1="374.0" y1="72" x2="374.0" y2="296.5" stroke="#2e4569"/>
<rect x="362" y="50" width="24" height="7" rx="3.5" fill="#2a3550" opacity="0.5" style=""/>
<rect x="432" y="67.6" width="54" height="233.7" rx="8" fill="#141f34" stroke="#2e4569" stroke-width="1.4"/>
<line x1="459.0" y1="73.6" x2="459.0" y2="295.3" stroke="#2e4569"/>
<rect x="447" y="51.6" width="24" height="7" rx="3.5" fill="#8fa8e0" opacity="0.8" style="opacity:var(--sa-glow,1)"/>
<path d="M0 300 Q260 330 520 300 L520 440 L0 440 Z" fill="url(#cq-floor)"/>
<path d="M0 330 Q260 362 520 330" fill="none" stroke="#8fa8e0" stroke-opacity=".35" stroke-width="2" style="opacity:var(--sa-glow,1)"/>
<path d="M0 44 Q260 16 520 44" fill="none" stroke="#8fa8e0" stroke-opacity=".3" stroke-width="3"/>
<rect width="520" height="440" fill="url(#cq-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-design.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="de-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="de-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="de-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="de-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="de-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="de-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="de-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="de-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="de-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="de-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="de-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="de-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="de-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="de-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="de-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="de-trim-glow"><stop offset="0" stop-color="#e889b6" stop-opacity=".32"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#de-wall)"/>
<path d="M0 250 L520 250 L520 440 L0 440 Z" fill="url(#de-floor)"/>
<ellipse cx="260" cy="258" rx="250" ry="26" fill="url(#de-screenlight)"/>
<rect x="54" y="30" width="412" height="162" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="60" y="36" width="400" height="150" rx="12" fill="#0b1220"/>
<rect x="80" y="56" width="40" height="40" rx="8" fill="#3fc1a5" opacity=".75" style="opacity:var(--sa-glow,1)"/>
<rect x="80" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="132" y="56" width="40" height="40" rx="8" fill="#f0a948" opacity=".75" style="opacity:var(--sa-glow,1)"/>
<rect x="132" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="184" y="56" width="40" height="40" rx="8" fill="#e889b6" opacity=".75" style="opacity:var(--sa-glow,1)"/>
<rect x="184" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="236" y="56" width="40" height="40" rx="8" fill="#8fa8e0" opacity=".75" style="opacity:var(--sa-glow,1)"/>
<rect x="236" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="288" y="56" width="40" height="40" rx="8" fill="#e8c37a" opacity=".75" style="opacity:var(--sa-glow,1)"/>
<rect x="288" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="340" y="56" width="40" height="40" rx="8" fill="#e8645c" opacity=".75" style="opacity:var(--sa-glow,1)"/>
<rect x="340" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="392" y="56" width="40" height="40" rx="8" fill="#5aa4ec" opacity=".75" style="opacity:var(--sa-glow,1)"/>
<rect x="392" y="104" width="34" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="80" y="126" width="108" height="44" rx="8" fill="none" stroke="#e889b6" stroke-dasharray="4 4" opacity=".6"/>
<rect x="200" y="126" width="108" height="44" rx="8" fill="none" stroke="#e889b6" stroke-dasharray="4 4" opacity=".6"/>
<rect x="320" y="126" width="108" height="44" rx="8" fill="none" stroke="#e889b6" stroke-dasharray="4 4" opacity=".6"/>
<path d="M80 360 L130 230 L390 230 L440 360 Z" fill="url(#de-board)" stroke="#2e4569" stroke-width="1.6"/>
<path d="M146 244 L250 244 L259.2 290 L132.2 290 Z" fill="#101a2e" stroke="#e889b6" stroke-opacity=".6"/>
<path d="M262 244 L374 244 L379.2 270 L254.2 270 Z" fill="#101a2e" stroke="#e889b6" stroke-opacity=".6"/>
<path d="M262 278 L374 278 L382.4 320 L249.4 320 Z" fill="#101a2e" stroke="#e889b6" stroke-opacity=".6"/>
<path d="M132 300 L250 300 L259.2 346 L118.2 346 Z" fill="#101a2e" stroke="#e889b6" stroke-opacity=".6"/>
<rect x="146" y="252" width="40" height="5" rx="2.5" fill="#e8c37a" opacity=".7"/>
<path d="M330 286 l40 -60" stroke="#c9b3e8" stroke-width="3" stroke-linecap="round"/>
<rect width="520" height="440" fill="url(#de-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-diag.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="dg-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="dg-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="dg-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="dg-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="dg-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="dg-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="dg-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="dg-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="dg-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="dg-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="dg-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="dg-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="dg-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="dg-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="dg-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="dg-trim-glow"><stop offset="0" stop-color="#f0a948" stop-opacity=".32"/><stop offset="1" stop-color="#f0a948" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#dg-wall)"/>
<path d="M0 276 L520 276 L520 440 L0 440 Z" fill="url(#dg-floor)"/>
<ellipse cx="260" cy="284" rx="250" ry="26" fill="url(#dg-screenlight)"/>
<rect x="54" y="30" width="272" height="212" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="60" y="36" width="260" height="200" rx="12" fill="#0b1220"/>
<rect x="72" y="30" width="50" height="5" rx="2.5" fill="#f0a948" opacity="0.7"/>
<rect x="80" y="58" width="150" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>
<circle cx="290" cy="60" r="5" fill="#3fc1a5" stroke="#3fc1a5" stroke-opacity="1" style="opacity:var(--sa-glow,1)"/>
<rect x="80" y="82" width="124" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>
<circle cx="290" cy="84" r="5" fill="#3fc1a5" stroke="#3fc1a5" stroke-opacity="1" style="opacity:var(--sa-glow,1)"/>
<rect x="80" y="106" width="98" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>
<circle cx="290" cy="108" r="5" fill="#3fc1a5" stroke="#3fc1a5" stroke-opacity="1" style="opacity:var(--sa-glow,1)"/>
<rect x="80" y="130" width="150" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>
<circle cx="290" cy="132" r="5" fill="#3fc1a5" stroke="#3fc1a5" stroke-opacity="1" style="opacity:var(--sa-glow,1)"/>
<rect x="80" y="154" width="124" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>
<circle cx="290" cy="156" r="5" fill="none" stroke="#8aa0c4" stroke-opacity="0.4" style="opacity:var(--sa-glow,1)"/>
<rect x="80" y="178" width="98" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>
<circle cx="290" cy="180" r="5" fill="none" stroke="#8aa0c4" stroke-opacity="0.4" style="opacity:var(--sa-glow,1)"/>
<rect x="80" y="202" width="150" height="5" rx="2.5" fill="#8aa0c4" opacity=".45"/>
<circle cx="290" cy="204" r="5" fill="none" stroke="#8aa0c4" stroke-opacity="0.4" style="opacity:var(--sa-glow,1)"/>
<rect x="66" y="150" width="248" height="16" rx="4" fill="#f0a948" opacity=".14" class="sa-scan2" style="opacity:var(--sa-glow,1)"/>
<rect x="350" y="70" width="120" height="16" rx="6" fill="#1a2742" stroke="#2e4569"/>
<path d="M362 84 L458 84 L458 210 L362 214 Z" fill="#e8e0d0" opacity=".85"/>
<rect x="372" y="96" width="70" height="3" rx="1.5" fill="#5a5a66"/>
<rect x="372" y="109" width="54" height="3" rx="1.5" fill="#5a5a66"/>
<rect x="372" y="122" width="38" height="3" rx="1.5" fill="#5a5a66"/>
<rect x="372" y="135" width="70" height="3" rx="1.5" fill="#5a5a66"/>
<rect x="372" y="148" width="54" height="3" rx="1.5" fill="#5a5a66"/>
<rect x="372" y="161" width="38" height="3" rx="1.5" fill="#5a5a66"/>
<rect x="372" y="174" width="70" height="3" rx="1.5" fill="#5a5a66"/>
<rect x="372" y="187" width="54" height="3" rx="1.5" fill="#5a5a66"/>
<path d="M50 344 L84 292 L436 292 L470 344 Z" fill="url(#dg-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M84 292 L436 292" stroke="#f0a948" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="50" y="344" width="420" height="12" rx="4" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="100" y="306" width="16" height="5" rx="2.5" fill="#f0a948" opacity="0.5"/><rect x="128" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="156" y="306" width="16" height="5" rx="2.5" fill="#f0a948" opacity="0.9"/><rect x="184" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="212" y="306" width="16" height="5" rx="2.5" fill="#f0a948" opacity="0.7"/><rect x="240" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="268" y="306" width="16" height="5" rx="2.5" fill="#f0a948" opacity="0.5"/><rect x="296" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="324" y="306" width="16" height="5" rx="2.5" fill="#f0a948" opacity="0.9"/><rect x="352" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="380" y="306" width="16" height="5" rx="2.5" fill="#f0a948" opacity="0.7"/><rect x="408" y="306" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/></g>
<g transform="translate(260 568) scale(0.46) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#dg-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#dg-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#dg-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#f0a948" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#f0a948" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#dg-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#dg-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-doctor.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="md-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="md-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="md-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="md-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="md-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="md-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="md-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="md-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="md-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="md-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="md-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="md-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="md-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="md-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="md-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="md-trim-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".32"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient><linearGradient id="md-bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22324e"/><stop offset="1" stop-color="#121c30"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#md-wall)"/>
<path d="M0 270 L520 270 L520 440 L0 440 Z" fill="url(#md-floor)"/>
<ellipse cx="260" cy="278" rx="250" ry="26" fill="url(#md-screenlight)"/>
<rect x="124" y="30" width="272" height="132" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="130" y="36" width="260" height="120" rx="12" fill="#0b1220"/>
<rect x="142" y="30" width="50" height="5" rx="2.5" fill="#5aa4ec" opacity="0.7"/>
<path d="M146 100 L160 100 L165 74 L171 120 L176 100 L186 100 L200 100 L205 74 L211 120 L216 100 L226 100 L240 100 L245 74 L251 120 L256 100 L266 100 L280 100 L285 74 L291 120 L296 100 L306 100 L320 100 L325 74 L331 120 L336 100 L346 100 L360 100 L365 74 L371 120 L376 100 L386 100" pathLength="100" fill="none" stroke="#3fc1a5" stroke-width="1.8" class="sa-trace" style="opacity:var(--sa-glow,1)"/>
<rect x="146" y="128" width="70" height="4" rx="2" fill="#8aa0c4" opacity=".35" transform="translate(0 0)"/>
<rect x="146" y="128" width="50" height="4" rx="2" fill="#8aa0c4" opacity=".35" transform="translate(90 0)"/>
<rect x="146" y="128" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".35" transform="translate(180 0)"/>
<path d="M150 300 L190 214 L330 214 L370 300 Z" fill="url(#md-bed)" stroke="#2e4569" stroke-width="1.5"/>
<path d="M190 214 L330 214" stroke="#3fc1a5" stroke-opacity=".6" stroke-width="2" style="opacity:var(--sa-glow,1)"/>
<rect x="150" y="300" width="220" height="40" rx="6" fill="#0e1729" stroke="#2e4569"/>
<g style="opacity:var(--sa-glow,1)"><rect x="170" y="316" width="18" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="202" y="316" width="18" height="5" rx="2.5" fill="#5aa4ec" opacity="0.7"/><rect x="234" y="316" width="18" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="266" y="316" width="18" height="5" rx="2.5" fill="#5aa4ec" opacity="0.5"/><rect x="298" y="316" width="18" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="330" y="316" width="18" height="5" rx="2.5" fill="#5aa4ec" opacity="0.9"/></g>
<path d="M226 222 C226 210 294 210 294 222 L300 246 C280 252 240 252 220 246 Z" fill="#1d2b44"/>
<rect x="60" y="120" width="60" height="150" rx="8" fill="#0b1220" stroke="#2e4569"/>
<g style="opacity:var(--sa-glow,1)"><rect x="70" y="136" width="10" height="4" rx="2" fill="#5aa4ec" opacity="0.5"/><rect x="85" y="136" width="10" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="100" y="136" width="10" height="4" rx="2" fill="#5aa4ec" opacity="0.9"/></g>
<rect x="400" y="120" width="60" height="150" rx="8" fill="#0b1220" stroke="#2e4569"/>
<g style="opacity:var(--sa-glow,1)"><rect x="410" y="136" width="10" height="4" rx="2" fill="#5aa4ec" opacity="0.5"/><rect x="425" y="136" width="10" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="440" y="136" width="10" height="4" rx="2" fill="#5aa4ec" opacity="0.9"/></g>
<ellipse cx="260" cy="400" rx="180" ry="30" fill="url(#md-trim-glow)" style="opacity:var(--sa-glow,1)" opacity=".55"/>
<rect width="520" height="440" fill="url(#md-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-eng.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="en-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="en-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="en-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="en-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="en-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="en-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="en-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="en-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="en-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="en-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="en-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="en-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="en-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="en-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="en-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="en-trim-glow"><stop offset="0" stop-color="#f0a948" stop-opacity=".32"/><stop offset="1" stop-color="#f0a948" stop-opacity="0"/></radialGradient><linearGradient id="en-core" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".1"/><stop offset=".5" stop-color="#3fc1a5" stop-opacity=".6"/><stop offset="1" stop-color="#3fc1a5" stop-opacity=".1"/></linearGradient><linearGradient id="en-msd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1408"/><stop offset="1" stop-color="#0c0a06"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#en-wall)"/>
<path d="M0 250 L520 250 L520 440 L0 440 Z" fill="url(#en-floor)"/>
<ellipse cx="260" cy="258" rx="250" ry="26" fill="url(#en-screenlight)"/>
<rect x="226" y="0" width="68" height="250" rx="14" fill="url(#en-core)" style="opacity:var(--sa-glow,1)"/>
<rect x="220" y="20" width="80" height="10" rx="5" fill="#3fc1a5" opacity=".55" class="sa-key" style="animation-delay:-0s;opacity:var(--sa-glow,1)"/>
<rect x="220" y="58" width="80" height="10" rx="5" fill="#3fc1a5" opacity=".55" class="sa-key" style="animation-delay:-0.3s;opacity:var(--sa-glow,1)"/>
<rect x="220" y="96" width="80" height="10" rx="5" fill="#3fc1a5" opacity=".55" class="sa-key" style="animation-delay:-0.6s;opacity:var(--sa-glow,1)"/>
<rect x="220" y="134" width="80" height="10" rx="5" fill="#3fc1a5" opacity=".55" class="sa-key" style="animation-delay:-0.9s;opacity:var(--sa-glow,1)"/>
<rect x="220" y="172" width="80" height="10" rx="5" fill="#3fc1a5" opacity=".55" class="sa-key" style="animation-delay:-1.2s;opacity:var(--sa-glow,1)"/>
<rect x="220" y="210" width="80" height="10" rx="5" fill="#3fc1a5" opacity=".55" class="sa-key" style="animation-delay:-1.5s;opacity:var(--sa-glow,1)"/>
<rect x="40" y="40" width="120" height="170" rx="10" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<rect x="50" y="50" width="40" height="5" rx="2.5" fill="#f0a948" opacity="0.7"/>
<rect x="52" y="70" width="96" height="6" rx="3" fill="#8fa8e0" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="52" y="92" width="79" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="52" y="114" width="62" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="52" y="136" width="85" height="6" rx="3" fill="#8fa8e0" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="52" y="158" width="68" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="52" y="180" width="91" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="360" y="40" width="120" height="170" rx="10" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<rect x="370" y="50" width="40" height="5" rx="2.5" fill="#f0a948" opacity="0.7"/>
<rect x="372" y="70" width="96" height="6" rx="3" fill="#8fa8e0" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="372" y="92" width="79" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="372" y="114" width="62" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="372" y="136" width="85" height="6" rx="3" fill="#8fa8e0" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="372" y="158" width="68" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<rect x="372" y="180" width="91" height="6" rx="3" fill="#f0a948" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M40 380 L100 290 L420 290 L480 380 Z" fill="#101826" stroke="#2e4569" stroke-width="2"/>
<path d="M60 372 L112 298 L408 298 L460 372 Z" fill="url(#en-msd)"/>
<g style="opacity:var(--sa-glow,1)" stroke="#f0a948" stroke-width="1.5" fill="none" opacity=".85"><ellipse cx="210" cy="326" rx="78" ry="16"/><path d="M286 330 L360 334 L372 346 L300 348 Z"/><path d="M300 340 L300 362 M340 336 L344 362"/><path d="M290 360 L400 360"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="150" y="352" width="8" height="4" rx="2" fill="#f0a948" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="166" y="352" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="182" y="352" width="8" height="4" rx="2" fill="#f0a948" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="198" y="352" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/><rect x="214" y="352" width="8" height="4" rx="2" fill="#f0a948" opacity="0.7" class="sa-key" style="animation-delay:-1.5s"/><rect x="230" y="352" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-1.9s"/><rect x="246" y="352" width="8" height="4" rx="2" fill="#f0a948" opacity="0.5" class="sa-key" style="animation-delay:-2.2s"/><rect x="262" y="352" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-2.6s"/></g>
<rect x="40" y="380" width="440" height="14" rx="4" fill="#0b1220"/>
<rect width="520" height="440" fill="url(#en-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-helm.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="hm-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="hm-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="hm-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="hm-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="hm-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="hm-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="hm-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="hm-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="hm-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="hm-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="hm-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="hm-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="hm-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="hm-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="hm-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>

</defs>
<rect width="520" height="440" fill="url(#hm-wall)"/>
<path d="M0 262 L520 262 L520 440 L0 440 Z" fill="url(#hm-floor)"/>
<ellipse cx="260" cy="270" rx="250" ry="26" fill="url(#hm-screenlight)"/>
<rect x="28" y="14" width="464" height="238" rx="22" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<rect x="36" y="22" width="448" height="222" rx="16" fill="none" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1.2"/>
<clipPath id="hm-glass"><rect x="40" y="26" width="440" height="214" rx="12"/></clipPath>
<g clip-path="url(#hm-glass)">
<rect x="40" y="26" width="440" height="214" fill="url(#hm-space)"/>
<ellipse cx="150.0" cy="100.89999999999999" rx="145.20000000000002" ry="68.48" fill="url(#hm-neb-plum)"/>
<ellipse cx="374.4" cy="175.79999999999998" rx="132.0" ry="64.2" fill="url(#hm-neb-teal)"/>
<circle cx="375.2" cy="116" r="0.7" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-5.7s"/>
<circle cx="94.5" cy="130.5" r="0.9" fill="#fff1d6" opacity="0.8"/>
<circle cx="302.6" cy="119.5" r="1.4" fill="#ffffff" opacity="0.9"/>
<circle cx="79.1" cy="92.6" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="347.1" cy="106.3" r="1.4" fill="#ffffff" opacity="0.4"/>
<circle cx="152.8" cy="219.5" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="328.6" cy="188.7" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="432.9" cy="128.4" r="0.9" fill="#fff1d6" opacity="0.5"/>
<circle cx="200.5" cy="81.4" r="0.5" fill="#dfe8ff" opacity="0.6" class="sa-tw" style="animation-delay:-3.9s"/>
<circle cx="308.9" cy="97.5" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="340.4" cy="144.5" r="1.2" fill="#fff1d6" opacity="0.6"/>
<circle cx="407.8" cy="114.8" r="1.2" fill="#ffffff" opacity="0.5"/>
<circle cx="373.8" cy="124.4" r="1" fill="#ffffff" opacity="0.9"/>
<circle cx="198.9" cy="72" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="302.3" cy="177.8" r="0.8" fill="#dfe8ff" opacity="0.6"/>
<circle cx="392.3" cy="72.8" r="0.8" fill="#ffffff" opacity="0.5"/>
<circle cx="443.7" cy="175.2" r="1.4" fill="#dfe8ff" opacity="0.7" class="sa-tw" style="animation-delay:-5.6s"/>
<circle cx="165.8" cy="180.4" r="1.2" fill="#ffffff" opacity="0.4"/>
<circle cx="313.3" cy="51.4" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="279.3" cy="58.2" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="224.6" cy="208.7" r="0.9" fill="#dfe8ff" opacity="0.4"/>
<circle cx="412.2" cy="88.9" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="317.4" cy="49.7" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="125.1" cy="76.2" r="0.6" fill="#dfe8ff" opacity="0.5"/>
<circle cx="282.1" cy="201.2" r="0.6" fill="#fff1d6" opacity="0.5" class="sa-tw" style="animation-delay:-1.8s"/>
<circle cx="338" cy="151.9" r="1.4" fill="#ffffff" opacity="0.6"/>
<circle cx="267.1" cy="99.3" r="0.5" fill="#ffffff" opacity="0.9"/>
<circle cx="471.9" cy="194.7" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="132.3" cy="206.3" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="135.9" cy="149.5" r="0.7" fill="#ffffff" opacity="0.5"/>
<circle cx="238.2" cy="66.3" r="0.8" fill="#ffffff" opacity="0.6"/>
<circle cx="233.1" cy="217" r="1.2" fill="#dfe8ff" opacity="0.4"/>
<circle cx="387.9" cy="96.8" r="1" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-2.6s"/>
<circle cx="87.6" cy="84.9" r="1.2" fill="#ffffff" opacity="0.6"/>
<circle cx="393.7" cy="66.7" r="0.8" fill="#fff1d6" opacity="0.5"/>
<circle cx="202.9" cy="209.3" r="0.5" fill="#ffffff" opacity="0.7"/>
<circle cx="72.9" cy="45.6" r="0.8" fill="#ffffff" opacity="0.5"/>
<circle cx="236.5" cy="170.4" r="1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="473.6" cy="79.8" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="280.3" cy="83.4" r="1.4" fill="#fff1d6" opacity="0.7"/>
<circle cx="372.7" cy="195.3" r="0.6" fill="#dfe8ff" opacity="0.7" class="sa-tw" style="animation-delay:-0.6s"/>
<circle cx="468" cy="69.1" r="1.4" fill="#ffffff" opacity="0.7"/>
<circle cx="295.1" cy="227" r="0.5" fill="#fff1d6" opacity="0.9"/>
<circle cx="453.3" cy="185.7" r="0.6" fill="#dfe8ff" opacity="0.5"/>
<circle cx="77.4" cy="41.9" r="0.8" fill="#fff1d6" opacity="0.5"/>
<circle cx="308.9" cy="186.1" r="0.8" fill="#fff1d6" opacity="0.5"/>
<circle cx="89.8" cy="144.2" r="0.6" fill="#ffffff" opacity="0.7"/>
<circle cx="310.1" cy="187.5" r="1.4" fill="#fff1d6" opacity="0.6"/>
<circle cx="197.8" cy="190.8" r="0.9" fill="#ffffff" opacity="0.7" class="sa-tw" style="animation-delay:-2.6s"/>
<circle cx="148.5" cy="146.2" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="74.6" cy="207.6" r="0.9" fill="#dfe8ff" opacity="0.5"/>
<circle cx="135.8" cy="51.4" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="463.4" cy="124.4" r="0.5" fill="#fff1d6" opacity="0.5"/>
<circle cx="78.2" cy="223.1" r="1.2" fill="#fff1d6" opacity="0.7"/>
<circle cx="313.9" cy="38.3" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="61.4" cy="102.7" r="1" fill="#fff1d6" opacity="0.9"/>
<circle cx="465.1" cy="181" r="1.4" fill="#ffffff" opacity="0.7" class="sa-tw" style="animation-delay:-3.4s"/>
<circle cx="107.8" cy="56.6" r="1.4" fill="#fff1d6" opacity="0.5"/>
<circle cx="317.9" cy="107" r="0.8" fill="#ffffff" opacity="0.5"/>
<circle cx="431.9" cy="85.7" r="1.2" fill="#ffffff" opacity="0.6"/>
<circle cx="350.4" cy="138" r="0.8" fill="#dfe8ff" opacity="0.9"/>
<circle cx="119.1" cy="29.2" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="310.5" cy="158.2" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="415" cy="47.6" r="0.5" fill="#ffffff" opacity="0.9"/>
<circle cx="125.7" cy="183.7" r="0.8" fill="#fff1d6" opacity="0.6" class="sa-tw" style="animation-delay:-0.1s"/>
<circle cx="83.1" cy="234.4" r="0.8" fill="#dfe8ff" opacity="0.9"/>
<circle cx="71.5" cy="227" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="325.8" cy="215" r="1.2" fill="#ffffff" opacity="0.5"/>
<circle cx="251.9" cy="77.4" r="0.8" fill="#fff1d6" opacity="0.7"/>
<circle cx="359" cy="158.1" r="0.5" fill="#ffffff" opacity="0.9"/>
<circle cx="228" cy="34.3" r="0.7" fill="#dfe8ff" opacity="0.9"/>
<circle cx="325.8" cy="205.9" r="0.5" fill="#ffffff" opacity="0.5"/>
<circle cx="73.1" cy="195.1" r="1.2" fill="#dfe8ff" opacity="0.8" class="sa-tw" style="animation-delay:-2.7s"/>
<circle cx="137.8" cy="205.7" r="1" fill="#fff1d6" opacity="0.5"/>
<circle cx="163.1" cy="221.1" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="279" cy="111.2" r="0.7" fill="#dfe8ff" opacity="0.4"/>
<circle cx="422.3" cy="71.6" r="0.7" fill="#fff1d6" opacity="0.4"/>
<circle cx="79.1" cy="43.2" r="1.4" fill="#fff1d6" opacity="0.4"/>
<circle cx="200.9" cy="219.6" r="1.4" fill="#dfe8ff" opacity="0.5"/>
<circle cx="370.9" cy="87.4" r="0.8" fill="#ffffff" opacity="0.5"/>
<circle cx="422.4" cy="169.7" r="0.8" fill="#ffffff" opacity="0.8" class="sa-tw" style="animation-delay:-4s"/>
<circle cx="354.1" cy="163.6" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="370.7" cy="179.3" r="1.2" fill="#fff1d6" opacity="0.7"/>
<circle cx="44.8" cy="157.8" r="0.9" fill="#dfe8ff" opacity="0.4"/>
<circle cx="410.3" cy="63.4" r="1.4" fill="#ffffff" opacity="0.8"/>
<circle cx="424.5" cy="41" r="0.9" fill="#dfe8ff" opacity="0.7"/>
<circle cx="85.1" cy="239.1" r="0.7" fill="#dfe8ff" opacity="0.7"/>
<circle cx="420.1" cy="111.4" r="1.4" fill="#ffffff" opacity="0.8"/>
<circle cx="65.6" cy="112.7" r="1.4" fill="#dfe8ff" opacity="0.9" class="sa-tw" style="animation-delay:-0.5s"/>
<circle cx="208.3" cy="178.8" r="1.2" fill="#ffffff" opacity="0.5"/>
<circle cx="452.1" cy="141.9" r="1.2" fill="#ffffff" opacity="0.9"/>
<circle cx="162" cy="222.3" r="1.2" fill="#ffffff" opacity="0.6"/>
<circle cx="446.4" cy="75.8" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="109.9" cy="157.6" r="1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="438.5" cy="65.9" r="1.4" fill="#ffffff" opacity="0.9"/>
<circle cx="447.9" cy="116" r="1.2" fill="#ffffff" opacity="0.9"/>
<circle cx="264.9" cy="135" r="0.7" fill="#fff1d6" opacity="0.7" class="sa-tw" style="animation-delay:-0.7s"/>
<circle cx="405.8" cy="41.5" r="0.8" fill="#ffffff" opacity="0.6"/>
<circle cx="239.2" cy="197.7" r="0.8" fill="#dfe8ff" opacity="0.8"/>
<circle cx="443.9" cy="234.4" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="126.4" cy="237.3" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="390.2" cy="212.1" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="259" cy="64.2" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="426.8" cy="32.4" r="0.9" fill="#fff1d6" opacity="0.9"/>
<circle cx="433.5" cy="58.6" r="0.9" fill="#ffffff" opacity="0.8" class="sa-tw" style="animation-delay:-0.2s"/>
<circle cx="224.6" cy="171.1" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="138.1" cy="127.1" r="1" fill="#dfe8ff" opacity="0.4"/>
<circle cx="252.2" cy="55.4" r="0.8" fill="#dfe8ff" opacity="0.6"/>
<circle cx="474.7" cy="39.8" r="1.2" fill="#ffffff" opacity="0.9"/>
<circle cx="315" cy="191.7" r="1.4" fill="#dfe8ff" opacity="0.4"/>
<g class="sa-streaks" style="opacity:var(--sa-burn,0)"><line class="sa-streak" x1="0" y1="39.2" x2="88.6" y2="39.2" stroke="url(#hm-streak)" stroke-width="0.9" opacity="0.6" style="animation-duration:4.3s;animation-delay:-7.7s"/><line class="sa-streak" x1="0" y1="52.7" x2="61.1" y2="52.7" stroke="url(#hm-streak)" stroke-width="1" opacity="0.3" style="animation-duration:5.1s;animation-delay:-7.7s"/><line class="sa-streak" x1="0" y1="208.1" x2="39.8" y2="208.1" stroke="url(#hm-streak)" stroke-width="1.1" opacity="0.4" style="animation-duration:4.4s;animation-delay:-7.9s"/><line class="sa-streak" x1="0" y1="131.5" x2="74" y2="131.5" stroke="url(#hm-streak)" stroke-width="1.1" opacity="0.4" style="animation-duration:5.5s;animation-delay:-5.5s"/><line class="sa-streak" x1="0" y1="108.6" x2="75.2" y2="108.6" stroke="url(#hm-streak)" stroke-width="1.1" opacity="0.3" style="animation-duration:5.3s;animation-delay:-3s"/><line class="sa-streak" x1="0" y1="153" x2="66.4" y2="153" stroke="url(#hm-streak)" stroke-width="1.3" opacity="0.3" style="animation-duration:8s;animation-delay:-5.7s"/><line class="sa-streak" x1="0" y1="100.3" x2="66.2" y2="100.3" stroke="url(#hm-streak)" stroke-width="0.8" opacity="0.6" style="animation-duration:6.2s;animation-delay:-4.5s"/><line class="sa-streak" x1="0" y1="77.2" x2="55.4" y2="77.2" stroke="url(#hm-streak)" stroke-width="0.9" opacity="0.5" style="animation-duration:5.1s;animation-delay:-6.3s"/><line class="sa-streak" x1="0" y1="108" x2="44.1" y2="108" stroke="url(#hm-streak)" stroke-width="1.2" opacity="0.4" style="animation-duration:7.7s;animation-delay:-4.3s"/><line class="sa-streak" x1="0" y1="161.9" x2="88.3" y2="161.9" stroke="url(#hm-streak)" stroke-width="1" opacity="0.3" style="animation-duration:7.5s;animation-delay:-4.8s"/><line class="sa-streak" x1="0" y1="77.2" x2="56.9" y2="77.2" stroke="url(#hm-streak)" stroke-width="1" opacity="0.5" style="animation-duration:5.1s;animation-delay:-4.7s"/><line class="sa-streak" x1="0" y1="213.3" x2="79.8" y2="213.3" stroke="url(#hm-streak)" stroke-width="1.2" opacity="0.5" style="animation-duration:5.8s;animation-delay:-1.3s"/><line class="sa-streak" x1="0" y1="200.9" x2="73.7" y2="200.9" stroke="url(#hm-streak)" stroke-width="1.1" opacity="0.5" style="animation-duration:6.7s;animation-delay:-4.7s"/><line class="sa-streak" x1="0" y1="136.1" x2="49.4" y2="136.1" stroke="url(#hm-streak)" stroke-width="0.9" opacity="0.6" style="animation-duration:5.9s;animation-delay:-3.3s"/><line class="sa-streak" x1="0" y1="150.5" x2="58.6" y2="150.5" stroke="url(#hm-streak)" stroke-width="1.1" opacity="0.3" style="animation-duration:5.5s;animation-delay:-3.9s"/><line class="sa-streak" x1="0" y1="195.6" x2="84.8" y2="195.6" stroke="url(#hm-streak)" stroke-width="1.3" opacity="0.4" style="animation-duration:5.1s;animation-delay:-7.9s"/></g>
<circle cx="352" cy="102" r="16" fill="url(#hm-starglow)"/><circle cx="352" cy="102" r="2.4" fill="#fff8e6"/>
<path d="M96 232 C150 200 210 186 262 160 S322 124 352 102" fill="none" stroke="#3fc1a5" stroke-width="1.6" stroke-dasharray="6 6" class="sa-flow" style="opacity:var(--sa-glow,1)"/>
<circle cx="150" cy="204" r="3" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="214" cy="182" r="3" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="270" cy="156" r="3" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="318" cy="122" r="3" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="352" cy="102" r="20" fill="none" stroke="#e8c37a" stroke-width="1.4" opacity=".85"/>
<circle cx="352" cy="102" r="30" fill="none" stroke="#e8c37a" stroke-width="1" stroke-dasharray="3 5" opacity=".5" class="sa-spin" style="transform-origin:352px 102px"/>
<line x1="376" y1="102" x2="388" y2="102" stroke="#e8c37a" stroke-width="1.4" opacity=".85"/>
<line x1="352" y1="126" x2="352" y2="138" stroke="#e8c37a" stroke-width="1.4" opacity=".85"/>
<line x1="328" y1="102" x2="316" y2="102" stroke="#e8c37a" stroke-width="1.4" opacity=".85"/>
<line x1="352" y1="78" x2="352" y2="66" stroke="#e8c37a" stroke-width="1.4" opacity=".85"/>
<path d="M40 46 L160 26 L210 26 L40 86 Z" fill="#fff" opacity=".035"/>
</g>
<rect x="58" y="16" width="54" height="5" rx="2.5" fill="#e8c37a" opacity=".75"/>
<rect x="408" y="16" width="54" height="5" rx="2.5" fill="#8fa8e0" opacity=".75"/>
<path d="M58 352 L96 286 L424 286 L462 352 Z" fill="url(#hm-console)" stroke="#2e4569" stroke-width="1.4"/>
<path d="M96 286 L424 286" stroke="#3fc1a5" stroke-opacity=".5" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/>
<rect x="58" y="352" width="404" height="14" rx="4" fill="#0b1220"/>
<path d="M110 340 L126 296 L206 296 L198 340 Z" fill="#0a1a22" stroke="#2e4569"/>
<path d="M410 340 L394 296 L314 296 L322 340 Z" fill="#0a1a22" stroke="#2e4569"/>
<g style="opacity:var(--sa-glow,1)"><rect x="134" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="150" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="166" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="182" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="134" y="316" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="150" y="316" width="9" height="4" rx="2" fill="#8fa8e0" opacity="0.7"/><rect x="166" y="316" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="182" y="316" width="9" height="4" rx="2" fill="#8fa8e0" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="132" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="148" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="164" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="180" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="324" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="340" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="356" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="372" y="304" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="326" y="316" width="9" height="4" rx="2" fill="#8fa8e0" opacity="0.5"/><rect x="342" y="316" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="358" y="316" width="9" height="4" rx="2" fill="#8fa8e0" opacity="0.9"/><rect x="374" y="316" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="328" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="344" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="360" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="376" y="328" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/></g>
<ellipse cx="260" cy="420" rx="200" ry="30" fill="url(#hm-teal-glow)" style="opacity:var(--sa-glow,1)" opacity=".5"/>
<g transform="translate(260 520) scale(0.56) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#hm-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#hm-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#hm-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#hm-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#hm-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-holo.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="hd-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="hd-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="hd-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="hd-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="hd-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="hd-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="hd-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="hd-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="hd-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="hd-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="hd-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="hd-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="hd-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="hd-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="hd-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="hd-trim-glow"><stop offset="0" stop-color="#e889b6" stop-opacity=".32"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="#050608"/>
<line x1="260" y1="170" x2="-380" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="-300" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="-220" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="-140" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="-60" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="20" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="100" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="180" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="260" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="340" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="420" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="500" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="580" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="660" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="740" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="820" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="260" y1="170" x2="900" y2="440" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1"/>
<line x1="0" y1="176.4" x2="520" y2="176.4" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="0" y1="192.3" x2="520" y2="192.3" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="0" y1="216.2" x2="520" y2="216.2" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="0" y1="247.5" x2="520" y2="247.5" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="0" y1="285.9" x2="520" y2="285.9" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="0" y1="330.9" x2="520" y2="330.9" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="0" y1="382.3" x2="520" y2="382.3" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="0" y1="440" x2="520" y2="440" stroke="#e8c37a" stroke-opacity=".3" stroke-width="1"/>
<line x1="260" y1="170" x2="-380" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="-300" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="-220" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="-140" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="-60" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="20" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="100" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="180" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="260" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="340" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="420" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="500" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="580" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="660" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="740" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="820" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<line x1="260" y1="170" x2="900" y2="0" stroke="#e8c37a" stroke-opacity=".18" stroke-width="1"/>
<rect x="200" y="122" width="120" height="96" fill="#050608" stroke="#e8c37a" stroke-opacity=".5"/>
<path d="M150 440 L150 150 Q150 96 210 96 L310 96 Q370 96 370 150 L370 440" fill="none" stroke="#3a3220" stroke-width="22"/>
<path d="M150 440 L150 150 Q150 96 210 96 L310 96 Q370 96 370 150 L370 440" fill="none" stroke="#e8c37a" stroke-width="2" stroke-opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="384" y="210" width="44" height="80" rx="6" fill="#141820" stroke="#e8c37a" stroke-opacity=".5"/>
<g style="opacity:var(--sa-glow,1)"><rect x="392" y="222" width="12" height="5" rx="2.5" fill="#e8c37a" opacity="0.5"/><rect x="408" y="222" width="12" height="5" rx="2.5" fill="#e889b6" opacity="0.7"/></g><g style="opacity:var(--sa-glow,1)"><rect x="392" y="236" width="12" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="408" y="236" width="12" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/></g>
<rect x="392" y="254" width="28" height="26" rx="4" fill="#e889b6" opacity=".35" class="sa-key" style="opacity:var(--sa-glow,1)"/>
<g transform="translate(256 300)" stroke="#e889b6" stroke-width="1.6" fill="none" class="sa-holo" style="opacity:var(--sa-glow,1)"><line x1="-30" y1="-30" x2="30" y2="-30"/><line x1="30" y1="-30" x2="30" y2="30"/><line x1="30" y1="30" x2="-30" y2="30"/><line x1="-30" y1="30" x2="-30" y2="-30"/><line x1="-14" y1="-44" x2="46" y2="-44"/><line x1="46" y1="-44" x2="46" y2="16"/><line x1="-30" y1="-30" x2="-14" y2="-44"/><line x1="30" y1="-30" x2="46" y2="-44"/><line x1="30" y1="30" x2="46" y2="16"/></g>
<rect width="520" height="440" fill="url(#hd-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-life.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="ls-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="ls-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="ls-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="ls-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="ls-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="ls-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ls-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="ls-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ls-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="ls-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="ls-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="ls-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="ls-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="ls-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="ls-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="ls-trim-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".32"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#ls-wall)"/>
<path d="M0 290 L520 290 L520 440 L0 440 Z" fill="url(#ls-floor)"/>
<ellipse cx="260" cy="298" rx="250" ry="26" fill="url(#ls-screenlight)"/>
<path d="M280 140 A90 90 0 0 1 270.9 179.5" fill="none" stroke="hsl(10 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M267.9 185 A90 90 0 0 1 240.3 214.6" fill="none" stroke="hsl(40 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M235 217.9 A90 90 0 0 1 196.3 229.8" fill="none" stroke="hsl(70 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M190 230 A90 90 0 0 1 150.5 220.9" fill="none" stroke="hsl(100 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M145 217.9 A90 90 0 0 1 115.4 190.3" fill="none" stroke="hsl(130 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M112.1 185 A90 90 0 0 1 100.2 146.3" fill="none" stroke="hsl(160 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M100 140 A90 90 0 0 1 109.1 100.5" fill="none" stroke="hsl(190 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M112.1 95 A90 90 0 0 1 139.7 65.4" fill="none" stroke="hsl(220 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M145 62.1 A90 90 0 0 1 183.7 50.2" fill="none" stroke="hsl(250 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M190 50 A90 90 0 0 1 229.5 59.1" fill="none" stroke="hsl(280 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M235 62.1 A90 90 0 0 1 264.6 89.7" fill="none" stroke="hsl(310 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<path d="M267.9 95 A90 90 0 0 1 279.8 133.7" fill="none" stroke="hsl(340 45% 60%)" stroke-width="16" opacity=".6" style="opacity:var(--sa-glow,1)"/>
<circle cx="190" cy="140" r="62" fill="#0b1220" stroke="#2e4569"/>
<circle cx="166" cy="126" r="7" fill="#ffd89a" opacity="0.35" style="opacity:var(--sa-glow,1)"/>
<circle cx="190" cy="116" r="7" fill="#ffd89a" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<circle cx="214" cy="126" r="7" fill="#ffd89a" opacity="0.75" style="opacity:var(--sa-glow,1)"/>
<circle cx="176" cy="154" r="7" fill="#ffd89a" opacity="0.35" style="opacity:var(--sa-glow,1)"/>
<circle cx="204" cy="154" r="7" fill="#ffd89a" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<circle cx="380" cy="104" r="36" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<path d="M350 118 A32 32 0 1 1 410 118" fill="none" stroke="#2e4569" stroke-width="5"/>
<path d="M350 118 A32 32 0 0 1 386.1 72.6" fill="none" stroke="#3fc1a5" stroke-width="5" stroke-linecap="round" style="opacity:var(--sa-glow,1)"/>
<circle cx="380" cy="190" r="36" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<path d="M350 204 A32 32 0 1 1 410 204" fill="none" stroke="#2e4569" stroke-width="5"/>
<path d="M350 204 A32 32 0 0 1 362.6 163.2" fill="none" stroke="#5aa4ec" stroke-width="5" stroke-linecap="round" style="opacity:var(--sa-glow,1)"/>
<rect x="60" y="260" width="400" height="4" rx="2" fill="#1a2742"/>
<rect x="60" y="269" width="400" height="4" rx="2" fill="#1a2742"/>
<rect x="60" y="278" width="400" height="4" rx="2" fill="#1a2742"/>
<rect x="60" y="287" width="400" height="4" rx="2" fill="#1a2742"/>
<rect x="60" y="296" width="400" height="4" rx="2" fill="#1a2742"/>
<path d="M50 354 L84 304 L436 304 L470 354 Z" fill="url(#ls-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M84 304 L436 304" stroke="#3fc1a5" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="50" y="354" width="420" height="12" rx="4" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="100" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="128" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="156" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="184" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="212" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="240" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="268" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="296" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="324" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="352" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="380" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="408" y="318" width="16" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/></g>
<rect width="520" height="440" fill="url(#ls-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-lounge.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="br-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="br-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="br-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="br-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="br-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="br-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="br-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="br-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="br-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="br-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="br-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="br-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="br-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="br-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="br-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="br-trim-glow"><stop offset="0" stop-color="#8fa8e0" stop-opacity=".32"/><stop offset="1" stop-color="#8fa8e0" stop-opacity="0"/></radialGradient><radialGradient id="br-top"><stop offset="0" stop-color="#1b2a44"/><stop offset="1" stop-color="#0d1626"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#br-wall)"/>
<path d="M0 258 L520 258 L520 440 L0 440 Z" fill="url(#br-floor)"/>
<ellipse cx="260" cy="266" rx="250" ry="26" fill="url(#br-screenlight)"/>
<rect x="50" y="34" width="130.7" height="120" rx="12" fill="url(#br-space)" stroke="#2e4569" stroke-width="1.6"/>
<circle cx="119.4" cy="149.1" r="1" fill="#ffffff" opacity="0.5" class="sa-tw" style="animation-delay:-4.8s"/>
<circle cx="97.9" cy="48.7" r="1.2" fill="#ffffff" opacity="0.9"/>
<circle cx="99.6" cy="60.9" r="1" fill="#fff1d6" opacity="0.7"/>
<circle cx="176.1" cy="142.3" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="160.6" cy="111.5" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="118.7" cy="39.6" r="1.2" fill="#fff1d6" opacity="0.8"/>
<circle cx="162" cy="92.6" r="0.9" fill="#fff1d6" opacity="0.7"/>
<circle cx="150.6" cy="50.9" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="160.3" cy="127.9" r="0.9" fill="#fff1d6" opacity="0.4" class="sa-tw" style="animation-delay:-4.8s"/>
<circle cx="91.7" cy="126.6" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="140.7" cy="65.3" r="1" fill="#fff1d6" opacity="0.9"/>
<circle cx="99.7" cy="146.5" r="0.7" fill="#dfe8ff" opacity="0.8"/>
<circle cx="151.1" cy="108.7" r="0.7" fill="#ffffff" opacity="0.8"/>
<circle cx="110.3" cy="125.8" r="0.9" fill="#dfe8ff" opacity="0.9"/>
<circle cx="146.9" cy="96.4" r="0.9" fill="#fff1d6" opacity="0.4"/>
<circle cx="56.3" cy="114.7" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="170.9" cy="89" r="1" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-1s"/>
<circle cx="110.3" cy="87.4" r="1.4" fill="#dfe8ff" opacity="0.4"/>
<circle cx="137.2" cy="139.5" r="0.7" fill="#dfe8ff" opacity="0.5"/>
<circle cx="55.7" cy="138.8" r="1" fill="#dfe8ff" opacity="0.6"/>
<circle cx="150.1" cy="138.9" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="129.6" cy="56.4" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="61.5" cy="58.6" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="175.9" cy="55.5" r="1.2" fill="#dfe8ff" opacity="0.9"/>
<circle cx="140.6" cy="64.1" r="1.4" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-5.8s"/>
<circle cx="69.8" cy="85.2" r="0.6" fill="#ffffff" opacity="0.6"/>
<rect x="194.7" y="34" width="130.7" height="120" rx="12" fill="url(#br-space)" stroke="#2e4569" stroke-width="1.6"/>
<circle cx="209.8" cy="115.2" r="0.6" fill="#dfe8ff" opacity="0.6" class="sa-tw" style="animation-delay:-0.6s"/>
<circle cx="279.6" cy="99.5" r="0.5" fill="#ffffff" opacity="0.8"/>
<circle cx="303" cy="97.2" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="234.6" cy="85.4" r="1.4" fill="#ffffff" opacity="0.5"/>
<circle cx="292.9" cy="66.1" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="258.5" cy="109.7" r="0.8" fill="#ffffff" opacity="0.4"/>
<circle cx="217.5" cy="111.2" r="0.8" fill="#ffffff" opacity="0.8"/>
<circle cx="296" cy="148.7" r="1.2" fill="#ffffff" opacity="0.4"/>
<circle cx="226.4" cy="71.1" r="0.6" fill="#fff1d6" opacity="0.6" class="sa-tw" style="animation-delay:-4.3s"/>
<circle cx="306.1" cy="77.7" r="1.2" fill="#ffffff" opacity="0.4"/>
<circle cx="247.5" cy="89" r="1.2" fill="#dfe8ff" opacity="0.7"/>
<circle cx="265.4" cy="44.8" r="0.8" fill="#dfe8ff" opacity="0.8"/>
<circle cx="269" cy="116" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="268.3" cy="103.7" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="223.1" cy="106.1" r="0.8" fill="#fff1d6" opacity="0.8"/>
<circle cx="311.9" cy="87.3" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="298.8" cy="59.4" r="0.7" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-4.8s"/>
<circle cx="234.3" cy="124" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="227.6" cy="129" r="0.6" fill="#fff1d6" opacity="0.4"/>
<circle cx="222.6" cy="112.3" r="0.6" fill="#ffffff" opacity="0.6"/>
<circle cx="284.6" cy="133" r="0.5" fill="#fff1d6" opacity="0.4"/>
<circle cx="304.8" cy="61.5" r="0.5" fill="#ffffff" opacity="0.8"/>
<circle cx="243.3" cy="66" r="0.6" fill="#ffffff" opacity="0.6"/>
<circle cx="243.9" cy="75.2" r="0.5" fill="#dfe8ff" opacity="0.8"/>
<circle cx="242.6" cy="147.3" r="0.8" fill="#dfe8ff" opacity="0.4" class="sa-tw" style="animation-delay:-0.8s"/>
<circle cx="272.1" cy="59.3" r="0.9" fill="#ffffff" opacity="0.9"/>
<rect x="339.3" y="34" width="130.7" height="120" rx="12" fill="url(#br-space)" stroke="#2e4569" stroke-width="1.6"/>
<circle cx="395.8" cy="80.8" r="1" fill="#dfe8ff" opacity="0.4" class="sa-tw" style="animation-delay:-2.5s"/>
<circle cx="397.3" cy="54.1" r="0.7" fill="#ffffff" opacity="0.6"/>
<circle cx="410.6" cy="83.8" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="389.3" cy="106.6" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="428.4" cy="136.7" r="0.7" fill="#dfe8ff" opacity="0.4"/>
<circle cx="380.6" cy="141.4" r="0.5" fill="#fff1d6" opacity="0.4"/>
<circle cx="450.7" cy="98.2" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="376.8" cy="125.6" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="352.4" cy="59.3" r="1.2" fill="#ffffff" opacity="0.4" class="sa-tw" style="animation-delay:-2.5s"/>
<circle cx="424.7" cy="110.6" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="399.7" cy="134.1" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="443.3" cy="56.5" r="0.8" fill="#ffffff" opacity="0.8"/>
<circle cx="410.4" cy="99.7" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="352.9" cy="49.6" r="1.4" fill="#ffffff" opacity="0.4"/>
<circle cx="409.6" cy="99.9" r="0.5" fill="#ffffff" opacity="0.5"/>
<circle cx="400.7" cy="101.2" r="0.9" fill="#dfe8ff" opacity="0.9"/>
<circle cx="455.2" cy="139.3" r="0.5" fill="#ffffff" opacity="0.7" class="sa-tw" style="animation-delay:-5.6s"/>
<circle cx="369.7" cy="88.7" r="0.7" fill="#fff1d6" opacity="0.9"/>
<circle cx="368.5" cy="54.5" r="0.8" fill="#fff1d6" opacity="0.7"/>
<circle cx="377.5" cy="110.1" r="1.2" fill="#fff1d6" opacity="0.4"/>
<circle cx="457.1" cy="134.2" r="1" fill="#fff1d6" opacity="0.8"/>
<circle cx="405.3" cy="129.2" r="0.8" fill="#fff1d6" opacity="0.6"/>
<circle cx="415.3" cy="139.7" r="0.6" fill="#ffffff" opacity="0.8"/>
<circle cx="458" cy="48.1" r="1.4" fill="#dfe8ff" opacity="0.6"/>
<circle cx="398" cy="142.3" r="0.8" fill="#fff1d6" opacity="0.7" class="sa-tw" style="animation-delay:-2.6s"/>
<circle cx="390.3" cy="99.4" r="0.5" fill="#ffffff" opacity="0.7"/>
<rect x="208" y="166" width="104" height="66" rx="12" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="214" y="172" width="92" height="54" rx="8" fill="#0b1220"/><rect x="222" y="180" width="30" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/><g style="opacity:var(--sa-glow,1)"><rect x="222" y="196" width="12" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="240" y="196" width="12" height="4" rx="2" fill="#f0a948" opacity="0.7"/><rect x="258" y="196" width="12" height="4" rx="2" fill="#e889b6" opacity="0.9"/><rect x="276" y="196" width="12" height="4" rx="2" fill="#8fa8e0" opacity="0.5"/></g><g style="opacity:var(--sa-glow,1)"><rect x="222" y="208" width="12" height="4" rx="2" fill="#8fa8e0" opacity="0.5"/><rect x="240" y="208" width="12" height="4" rx="2" fill="#8fa8e0" opacity="0.7"/><rect x="258" y="208" width="12" height="4" rx="2" fill="#8fa8e0" opacity="0.9"/></g>
<g transform="translate(150 340) scale(0.2) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(205 336) scale(0.2) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#f0a948" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#f0a948" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(260 335) scale(0.2) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#8fa8e0" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#8fa8e0" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(315 336) scale(0.2) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(370 340) scale(0.2) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<ellipse cx="260" cy="338" rx="196" ry="44" fill="#0e1729" stroke="#2e4569" stroke-width="2"/>
<ellipse cx="260" cy="334" rx="178" ry="34" fill="url(#br-top)"/>
<ellipse cx="260" cy="334" rx="120" ry="20" fill="none" stroke="#8fa8e0" stroke-opacity=".3"/>
<rect x="156" y="330" width="22" height="5" rx="2.5" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="208" y="330" width="22" height="5" rx="2.5" fill="#f0a948" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="260" y="330" width="22" height="5" rx="2.5" fill="#8fa8e0" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="312" y="330" width="22" height="5" rx="2.5" fill="#e889b6" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="364" y="330" width="22" height="5" rx="2.5" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<g transform="translate(120 520) scale(0.34) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#f0a948" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#f0a948" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(260 520) scale(0.34) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#e8c37a" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#e8c37a" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(400 520) scale(0.34) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#br-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#br-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#br-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#br-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#br-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-nav.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="nv-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="nv-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="nv-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="nv-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="nv-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="nv-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="nv-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="nv-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="nv-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="nv-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="nv-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="nv-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="nv-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="nv-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="nv-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="nv-sun"><stop offset="0" stop-color="#ffe7b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>
<radialGradient id="nv-tabletop"><stop offset="0" stop-color="#16324a"/><stop offset="1" stop-color="#0b1424"/></radialGradient>
<linearGradient id="nv-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".22"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#nv-wall)"/>
<path d="M0 236 L520 236 L520 440 L0 440 Z" fill="url(#nv-floor)"/>
<ellipse cx="260" cy="244" rx="250" ry="26" fill="url(#nv-screenlight)"/>
<circle cx="135.2" cy="46.1" r="1.4" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-2.6s"/>
<circle cx="299.7" cy="124.9" r="0.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="169.4" cy="98.6" r="1.4" fill="#fff1d6" opacity="0.8"/>
<circle cx="441.9" cy="34.1" r="1.2" fill="#fff1d6" opacity="0.5"/>
<circle cx="150.7" cy="26.1" r="1.2" fill="#fff1d6" opacity="0.8"/>
<circle cx="122.3" cy="49.6" r="0.8" fill="#fff1d6" opacity="0.9"/>
<circle cx="92.5" cy="108.1" r="1.4" fill="#dfe8ff" opacity="0.8"/>
<circle cx="394.5" cy="61.4" r="0.6" fill="#fff1d6" opacity="0.4"/>
<circle cx="259.3" cy="114.3" r="0.7" fill="#dfe8ff" opacity="0.5" class="sa-tw" style="animation-delay:-2.4s"/>
<circle cx="364" cy="88.8" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="161.7" cy="37.5" r="0.7" fill="#dfe8ff" opacity="0.5"/>
<circle cx="409.2" cy="27.3" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="191.6" cy="69.1" r="0.7" fill="#ffffff" opacity="0.6"/>
<circle cx="79.1" cy="40.7" r="1.2" fill="#dfe8ff" opacity="0.6"/>
<circle cx="192.8" cy="95.2" r="0.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="48.9" cy="91.2" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="133.1" cy="109.4" r="1" fill="#fff1d6" opacity="0.7" class="sa-tw" style="animation-delay:-5.9s"/>
<circle cx="262.1" cy="100.6" r="0.6" fill="#ffffff" opacity="0.7"/>
<circle cx="295.3" cy="44.1" r="0.8" fill="#fff1d6" opacity="0.9"/>
<circle cx="424.9" cy="103" r="0.9" fill="#fff1d6" opacity="0.4"/>
<circle cx="209.4" cy="70.9" r="0.8" fill="#dfe8ff" opacity="0.9"/>
<circle cx="331.4" cy="35.8" r="0.5" fill="#fff1d6" opacity="0.9"/>
<circle cx="53.8" cy="86" r="0.8" fill="#ffffff" opacity="0.7"/>
<circle cx="70.8" cy="134.6" r="0.9" fill="#fff1d6" opacity="0.7"/>
<circle cx="253.2" cy="103.5" r="0.6" fill="#fff1d6" opacity="0.7" class="sa-tw" style="animation-delay:-5.4s"/>
<circle cx="167.5" cy="123.2" r="1.2" fill="#fff1d6" opacity="0.4"/>
<circle cx="430.9" cy="23.8" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="331.5" cy="107.9" r="0.7" fill="#dfe8ff" opacity="0.4"/>
<circle cx="289.1" cy="122.6" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="81.5" cy="112.2" r="1.4" fill="#fff1d6" opacity="0.9"/>
<circle cx="383.1" cy="126" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="251.5" cy="81.1" r="1.4" fill="#ffffff" opacity="0.9"/>
<circle cx="73.3" cy="136.3" r="1" fill="#ffffff" opacity="0.4" class="sa-tw" style="animation-delay:-5.1s"/>
<circle cx="477.6" cy="76.2" r="1.4" fill="#dfe8ff" opacity="0.5"/>
<circle cx="58.4" cy="121.6" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="128.8" cy="116.2" r="0.7" fill="#ffffff" opacity="0.9"/>
<circle cx="124.8" cy="91.5" r="1.4" fill="#dfe8ff" opacity="0.8"/>
<circle cx="263.8" cy="54.7" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="237.5" cy="94.1" r="0.6" fill="#dfe8ff" opacity="0.4"/>
<circle cx="40.2" cy="70.6" r="0.7" fill="#dfe8ff" opacity="0.5"/>
<circle cx="259.7" cy="85.1" r="0.8" fill="#fff1d6" opacity="0.6" class="sa-tw" style="animation-delay:-1.4s"/>
<circle cx="69.2" cy="22.7" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="336.9" cy="64.4" r="1.2" fill="#fff1d6" opacity="0.6"/>
<circle cx="212.9" cy="86.9" r="0.8" fill="#dfe8ff" opacity="0.5"/>
<circle cx="237.2" cy="52.7" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="89.7" cy="135" r="1" fill="#fff1d6" opacity="0.5"/>
<rect x="54" y="34" width="120" height="78" rx="10" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<rect x="200" y="34" width="120" height="78" rx="10" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<rect x="346" y="34" width="120" height="78" rx="10" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<path d="M64 94 L84 76 L104 58 L124 85 L144 67 L164 94" fill="none" stroke="#8fa8e0" stroke-width="1.2" opacity=".45"/>
<path d="M210 86 L230 67 L250 94 L270 76 L290 58 L310 85" fill="none" stroke="#8fa8e0" stroke-width="1.2" opacity=".45"/>
<path d="M356 78 L376 58 L396 85 L416 67 L436 94 L456 76" fill="none" stroke="#8fa8e0" stroke-width="1.2" opacity=".45"/>
<rect x="64" y="44" width="40" height="5" rx="2.5" fill="#e8c37a" opacity=".6"/>
<rect x="210" y="44" width="40" height="5" rx="2.5" fill="#3fc1a5" opacity=".6"/>
<rect x="356" y="44" width="40" height="5" rx="2.5" fill="#8fa8e0" opacity=".6"/>
<ellipse cx="260" cy="380" rx="200" ry="34" fill="url(#nv-shadow)"/>
<path d="M140 356 L170 428 L350 428 L380 356 Z" fill="url(#nv-console)" stroke="#2e4569"/>
<ellipse cx="260" cy="336" rx="226" ry="70" fill="#0e1729" stroke="#2e4569" stroke-width="2"/>
<ellipse cx="260" cy="336" rx="196" ry="56" fill="url(#nv-tabletop)"/>
<ellipse cx="260" cy="336" rx="120" ry="34" fill="none" stroke="#3fc1a5" stroke-opacity=".25"/>
<path d="M58.9 314.1 A214 64 0 0 1 89.1 297.5" fill="none" stroke="#3fc1a5" stroke-width="4" stroke-linecap="round" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M97.5 294.4 A214 64 0 0 1 145.3 282" fill="none" stroke="#3fc1a5" stroke-width="4" stroke-linecap="round" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M156.9 279.9 A214 64 0 0 1 216.2 273.4" fill="none" stroke="#3fc1a5" stroke-width="4" stroke-linecap="round" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M229.5 272.7 A214 64 0 0 1 292.7 272.8" fill="none" stroke="#e8c37a" stroke-width="4" stroke-linecap="round" opacity="1" style="opacity:var(--sa-glow,1)"/>
<path d="M306 273.5 A214 64 0 0 1 365.1 280.2" fill="none" stroke="#3fc1a5" stroke-width="4" stroke-linecap="round" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M376.6 282.3 A214 64 0 0 1 423.9 294.9" fill="none" stroke="#3fc1a5" stroke-width="4" stroke-linecap="round" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M432.2 298 A214 64 0 0 1 461.8 314.7" fill="none" stroke="#3fc1a5" stroke-width="4" stroke-linecap="round" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M220 332 L70 196 L450 196 L300 332 Z" fill="url(#nv-beam)" style="opacity:var(--sa-glow,1)"/>
<ellipse cx="260" cy="334" rx="40" ry="10" fill="#3fc1a5" opacity=".35" style="opacity:var(--sa-glow,1)"/>
<g class="sa-holo" style="opacity:var(--sa-glow,1)"><ellipse cx="260" cy="186" rx="58" ry="19.7" fill="none" stroke="#3fc1a5" stroke-width="1" opacity="0.55"/><ellipse cx="260" cy="186" rx="104" ry="35.4" fill="none" stroke="#3fc1a5" stroke-width="1" opacity="0.42"/><ellipse cx="260" cy="186" rx="150" ry="51" fill="none" stroke="#3fc1a5" stroke-width="1" opacity="0.3"/><ellipse cx="260" cy="186" rx="186" ry="64" fill="none" stroke="#3fc1a5" stroke-width=".8" stroke-dasharray="2 6" opacity=".3"/><circle cx="260" cy="186" r="18" fill="url(#nv-sun)"/><circle cx="260" cy="186" r="4" fill="#fff4d6"/><circle cx="310" cy="176" r="4" fill="#9fe0ee"/><circle cx="164" cy="200" r="5.5" fill="#7fb8d8"/><circle cx="388" cy="212" r="6.5" fill="#c9b3e8"/><path d="M164 200 C200 116 350 122 388 212" fill="none" stroke="#e8c37a" stroke-width="1.6" stroke-dasharray="5 5" class="sa-flow"/><circle cx="208" cy="156" r="2.6" fill="#e8c37a"/><circle cx="276" cy="140" r="2.6" fill="#e8c37a"/><circle cx="344" cy="160" r="2.6" fill="#e8c37a"/><circle cx="388" cy="212" r="12" fill="none" stroke="#e8c37a" stroke-width="1.2" class="sa-ping" style="transform-origin:388px 212px"/></g>
<rect width="520" height="440" fill="url(#nv-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-ops.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="op-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="op-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="op-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="op-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="op-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="op-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="op-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="op-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="op-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="op-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="op-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="op-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="op-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="op-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="op-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<linearGradient id="op-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1626"/><stop offset="1" stop-color="#060c18"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#op-wall)"/>
<path d="M0 262 L520 262 L520 440 L0 440 Z" fill="url(#op-floor)"/>
<ellipse cx="260" cy="270" rx="250" ry="26" fill="url(#op-screenlight)"/>
<rect x="34" y="20" width="452" height="228" rx="20" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<rect x="44" y="30" width="432" height="208" rx="12" fill="url(#op-glass)"/>
<rect x="58" y="24" width="54" height="5" rx="2.5" fill="#e8c37a" opacity=".75"/>
<rect x="408" y="24" width="54" height="5" rx="2.5" fill="#3fc1a5" opacity=".75"/>
<rect x="56" y="46" width="166" height="176" rx="8" fill="none" stroke="#2e4569"/>
<rect x="230" y="46" width="152" height="176" rx="8" fill="none" stroke="#2e4569"/>
<rect x="388" y="46" width="76" height="176" rx="8" fill="none" stroke="#2e4569"/>
<rect x="66" y="54" width="14" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="92" y="54" width="14" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="118" y="54" width="14" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="144" y="54" width="14" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="170" y="54" width="14" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="196" y="54" width="14" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<g style="opacity:var(--sa-glow,1)"><rect x="66" y="70" width="14" height="136" rx="4" fill="#0a1424" stroke="#2e4569"/><rect class="sa-bar" x="69" y="122.4" width="8" height="80.6" rx="2" fill="#3fc1a5" opacity=".85" style="animation-delay:-0s;transform-origin:73px 203px"/><rect x="92" y="70" width="14" height="136" rx="4" fill="#0a1424" stroke="#2e4569"/><rect class="sa-bar" x="95" y="140.6" width="8" height="62.4" rx="2" fill="#3fc1a5" opacity=".85" style="animation-delay:-0.8s;transform-origin:99px 203px"/><rect x="118" y="70" width="14" height="136" rx="4" fill="#0a1424" stroke="#2e4569"/><rect class="sa-bar" x="121" y="112" width="8" height="91" rx="2" fill="#3fc1a5" opacity=".85" style="animation-delay:-1.6s;transform-origin:125px 203px"/><rect x="144" y="70" width="14" height="136" rx="4" fill="#0a1424" stroke="#2e4569"/><rect class="sa-bar" x="147" y="91.2" width="8" height="111.8" rx="2" fill="#f0a948" opacity=".85" style="animation-delay:-2.4s;transform-origin:151px 203px"/><rect x="170" y="70" width="14" height="136" rx="4" fill="#0a1424" stroke="#2e4569"/><rect class="sa-bar" x="173" y="151" width="8" height="52" rx="2" fill="#3fc1a5" opacity=".85" style="animation-delay:-3.2s;transform-origin:177px 203px"/><rect x="196" y="70" width="14" height="136" rx="4" fill="#0a1424" stroke="#2e4569"/><rect class="sa-bar" x="199" y="131.5" width="8" height="71.5" rx="2" fill="#3fc1a5" opacity=".85" style="animation-delay:-4s;transform-origin:203px 203px"/></g>
<line x1="236" y1="90" x2="376" y2="90" stroke="#2e4569" stroke-width=".8"/>
<line x1="236" y1="130" x2="376" y2="130" stroke="#2e4569" stroke-width=".8"/>
<line x1="236" y1="170" x2="376" y2="170" stroke="#2e4569" stroke-width=".8"/>
<path d="M230 130 L238 130 L242 104 L246 144 L250 130 L252 130 L256 120 L260 136 L264 130 L266 130 L270 120 L274 136 L278 130 L280 130 L284 104 L288 144 L292 130 L294 130 L298 120 L302 136 L306 130 L308 130 L312 120 L316 136 L320 130 L322 130 L326 104 L330 144 L334 130 L336 130 L340 120 L344 136 L348 130 L350 130 L354 120 L358 136 L362 130" pathLength="100" fill="none" stroke="#3fc1a5" stroke-width="1.8" stroke-linejoin="round" class="sa-trace" style="opacity:var(--sa-glow,1)"/>
<rect x="240" y="190" width="60" height="5" rx="2.5" fill="#3fc1a5" opacity=".5" style="opacity:var(--sa-glow,1)"/>
<rect x="306" y="190" width="36" height="5" rx="2.5" fill="#8fa8e0" opacity=".5"/>
<g style="opacity:var(--sa-glow,1)"><rect x="396" y="74" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.4"/><rect x="413" y="74" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.6"/><rect x="430" y="74" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="447" y="74" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.8"/><rect x="396" y="100" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.8"/><rect x="413" y="100" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.4"/><rect x="430" y="100" width="11" height="11" rx="2.5" fill="#f0a948" opacity="0.6" class="sa-blink"/><rect x="447" y="100" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="396" y="126" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="413" y="126" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.8"/><rect x="430" y="126" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.4"/><rect x="447" y="126" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.6"/><rect x="396" y="152" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.6"/><rect x="413" y="152" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="430" y="152" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.8"/><rect x="447" y="152" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.4"/><rect x="396" y="178" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.4"/><rect x="413" y="178" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.6"/><rect x="430" y="178" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="447" y="178" width="11" height="11" rx="2.5" fill="#3fc1a5" opacity="0.8"/></g>
<path d="M30 356 L70 284 L450 284 L490 356 Z" fill="url(#op-console)" stroke="#2e4569" stroke-width="1.4"/>
<rect x="30" y="356" width="460" height="14" rx="4" fill="#0b1220"/>
<path d="M70 284 L450 284" stroke="#3fc1a5" stroke-opacity=".5" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/>
<g style="opacity:var(--sa-glow,1)"><rect x="90" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="114" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="138" y="300" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="162" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="186" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="210" y="300" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="234" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="258" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="282" y="300" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="306" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="330" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="354" y="300" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="378" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="402" y="300" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="80" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="104" y="318" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="128" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/><rect x="152" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-1.1s"/><rect x="176" y="318" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7" class="sa-key" style="animation-delay:-1.5s"/><rect x="200" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-1.9s"/><rect x="224" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-2.2s"/><rect x="248" y="318" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7" class="sa-key" style="animation-delay:-2.6s"/><rect x="272" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-3s"/><rect x="296" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-3.3s"/><rect x="320" y="318" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7" class="sa-key" style="animation-delay:-3.7s"/><rect x="344" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-4.1s"/><rect x="368" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-4.4s"/><rect x="392" y="318" width="14" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7" class="sa-key" style="animation-delay:-4.8s"/><rect x="416" y="318" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-5.2s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="70" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="94" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="118" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="142" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="166" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="190" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="214" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="238" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="262" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="286" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="310" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="334" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="358" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/><rect x="382" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="406" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.9"/><rect x="430" y="336" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.5"/></g>
<ellipse cx="260" cy="420" rx="200" ry="30" fill="url(#op-teal-glow)" style="opacity:var(--sa-glow,1)" opacity=".5"/>
<g transform="translate(260 524) scale(0.54) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#op-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#op-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#op-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#op-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#op-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-qm.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="qm-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="qm-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="qm-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="qm-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="qm-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="qm-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="qm-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="qm-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="qm-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="qm-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="qm-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="qm-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="qm-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="qm-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="qm-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="qm-trim-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".32"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient><linearGradient id="qm-crate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26344e"/><stop offset="1" stop-color="#162034"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#qm-wall)"/>
<path d="M0 270 L520 270 L520 440 L0 440 Z" fill="url(#qm-floor)"/>
<ellipse cx="260" cy="278" rx="250" ry="26" fill="url(#qm-screenlight)"/>
<rect x="54" y="30" width="232" height="182" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="60" y="36" width="220" height="170" rx="12" fill="#0b1220"/>
<rect x="72" y="30" width="50" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/>
<rect x="76" y="58" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="220" y="58" width="40" height="4" rx="2" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="76" y="78" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="207" y="78" width="53" height="4" rx="2" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="76" y="98" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="194" y="98" width="66" height="4" rx="2" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="76" y="118" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="211" y="118" width="49" height="4" rx="2" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="76" y="138" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="198" y="138" width="62" height="4" rx="2" fill="#f0a948" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="76" y="158" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="215" y="158" width="45" height="4" rx="2" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<rect x="76" y="178" width="90" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="202" y="178" width="58" height="4" rx="2" fill="#3fc1a5" opacity=".7" style="opacity:var(--sa-glow,1)"/>
<line x1="76" y1="200" x2="266" y2="200" stroke="#2e4569"/>
<rect x="320" y="196" width="80" height="70" rx="5" fill="url(#qm-crate)" stroke="#3a4a68"/>
<rect x="330" y="206" width="36.0" height="8" rx="2" fill="#3fc1a5" opacity=".6"/>
<path d="M320 231.0 L400 231.0" stroke="#3a4a68"/>
<rect x="402" y="196" width="80" height="70" rx="5" fill="url(#qm-crate)" stroke="#3a4a68"/>
<rect x="412" y="206" width="36.0" height="8" rx="2" fill="#3fc1a5" opacity=".6"/>
<path d="M402 231.0 L482 231.0" stroke="#3a4a68"/>
<rect x="352" y="124" width="90" height="70" rx="5" fill="url(#qm-crate)" stroke="#3a4a68"/>
<rect x="362" y="134" width="40.5" height="8" rx="2" fill="#f0a948" opacity=".6"/>
<path d="M352 159.0 L442 159.0" stroke="#3a4a68"/>
<path d="M40 340 L74 290 L446 290 L480 340 Z" fill="url(#qm-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M74 290 L446 290" stroke="#3fc1a5" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="40" y="340" width="440" height="12" rx="4" fill="#0b1220"/>
<rect x="120" y="282" width="110" height="14" rx="5" fill="#1d2b44" stroke="#2e4569"/>
<rect x="150" y="300" width="50" height="14" rx="3" fill="#081620"/>
<g style="opacity:var(--sa-glow,1)"><rect x="156" y="305" width="6" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="166" y="305" width="6" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="176" y="305" width="6" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="186" y="305" width="6" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/></g>
<path d="M270 302 l60 0 l0 18 l-60 0 Z" fill="#e8e0d0" opacity=".8"/>
<rect x="276" y="306" width="36" height="1.6" fill="#6a6a6a"/><rect x="276" y="310" width="30" height="1.6" fill="#6a6a6a"/><rect x="276" y="314" width="24" height="1.6" fill="#6a6a6a"/>
<g transform="translate(260 590) scale(0.46) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#qm-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#qm-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#qm-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#qm-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#qm-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-quarters.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="96 150 640 542" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<clipPath id="qs-glass"><polygon points="180,100 620,100 640,548 160,548"/></clipPath>
<filter id="qs-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="qs-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2130"/><stop offset=".55" stop-color="#211a27"/><stop offset="1" stop-color="#17121c"/></linearGradient>
<linearGradient id="qs-ceiling" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0a10"/><stop offset="1" stop-color="#1a1520"/></linearGradient>
<linearGradient id="qs-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21171f"/><stop offset="1" stop-color="#0d0a10"/></linearGradient>
<linearGradient id="qs-baseglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".16"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
<linearGradient id="qs-spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".07"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></linearGradient>
<radialGradient id="qs-downcone" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffd89a" stop-opacity=".22"/><stop offset=".6" stop-color="#ffd89a" stop-opacity=".04"/><stop offset="1" stop-color="#ffd89a" stop-opacity="0"/></radialGradient>
<linearGradient id="qs-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1520"/><stop offset=".5" stop-color="#2c2333"/><stop offset="1" stop-color="#1a1520"/></linearGradient>
<linearGradient id="qs-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070a18"/><stop offset=".6" stop-color="#0b0f22"/><stop offset="1" stop-color="#120b1c"/></linearGradient>
<radialGradient id="qs-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="qs-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="qs-neb-rose"><stop offset="0" stop-color="#c0587a" stop-opacity=".26"/><stop offset="1" stop-color="#5a2038" stop-opacity="0"/></radialGradient>
<radialGradient id="qs-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="qs-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="qs-planet" cx=".78" cy=".08" r="1.05"><stop offset="0" stop-color="#6fb2c4"/><stop offset=".14" stop-color="#245c74"/><stop offset=".38" stop-color="#0f2a42"/><stop offset=".75" stop-color="#081626"/><stop offset="1" stop-color="#050b14"/></radialGradient>
<radialGradient id="qs-atmo" cx=".8" cy=".05" r=".9"><stop offset="0" stop-color="#d8f6ff" stop-opacity="1"/><stop offset=".4" stop-color="#7fd8e8" stop-opacity=".45"/><stop offset=".8" stop-color="#3f7f9a" stop-opacity=".08"/><stop offset="1" stop-color="#3f7f9a" stop-opacity="0"/></radialGradient>
<radialGradient id="qs-band"><stop offset="0" stop-color="#e8e0ff" stop-opacity=".09"/><stop offset=".5" stop-color="#b8a8e0" stop-opacity=".04"/><stop offset="1" stop-color="#b8a8e0" stop-opacity="0"/></radialGradient>
<linearGradient id="qs-shell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>
<linearGradient id="qs-shell-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd89a" stop-opacity=".12"/><stop offset=".35" stop-color="#ffd89a" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
<linearGradient id="qs-arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2b33"/><stop offset="1" stop-color="#120c10"/></linearGradient>
<linearGradient id="qs-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="qs-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="qs-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="qs-alcove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a26"/><stop offset=".35" stop-color="#1e1619"/><stop offset="1" stop-color="#120d12"/></linearGradient>
<linearGradient id="qs-shelflight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
<radialGradient id="qs-globe" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#4f8fb0"/><stop offset=".7" stop-color="#1f4a66"/><stop offset="1" stop-color="#0f2233"/></radialGradient>
<linearGradient id="qs-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d898"/><stop offset=".45" stop-color="#c9a560"/><stop offset="1" stop-color="#8a6a32"/></linearGradient>
<radialGradient id="qs-screenglow" cx=".5" cy=".5" r=".6"><stop offset=".7" stop-color="#e8c37a" stop-opacity=".1"/><stop offset="1" stop-color="#e8c37a" stop-opacity="0"/></radialGradient>
<linearGradient id="qs-desktop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2c33"/><stop offset="1" stop-color="#2a1f26"/></linearGradient>
<linearGradient id="qs-deskfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22181f"/><stop offset="1" stop-color="#140e13"/></linearGradient>
<linearGradient id="qs-termglass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1410"/><stop offset="1" stop-color="#0c0a0a"/></linearGradient>
<linearGradient id="qs-paddglass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fd8c4" stop-opacity=".85"/><stop offset="1" stop-color="#3fa58f" stop-opacity=".7"/></linearGradient>
<linearGradient id="qs-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3cddd"/><stop offset=".5" stop-color="#7d8aa3"/><stop offset="1" stop-color="#3a4458"/></linearGradient>
<linearGradient id="qs-lampcone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".28"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></linearGradient>
<radialGradient id="qs-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>
<!-- the room -->
<rect width="1600" height="740" fill="#120e16"/>
<rect y="38" width="1600" height="562" fill="url(#qs-wall)"/>
<path d="M140 40 L140 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M142 40 L142 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M252 40 L252 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M254 40 L254 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M364 40 L364 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M366 40 L366 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M476 40 L476 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M478 40 L478 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M588 40 L588 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M590 40 L590 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M700 40 L700 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M702 40 L702 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M812 40 L812 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M814 40 L814 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M924 40 L924 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M926 40 L926 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1036 40 L1036 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1038 40 L1038 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1148 40 L1148 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1150 40 L1150 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1260 40 L1260 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1262 40 L1262 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1372 40 L1372 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1374 40 L1374 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1484 40 L1484 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1486 40 L1486 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1596 40 L1596 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1598 40 L1598 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<rect y="508" width="1600" height="3" fill="#e8c37a" opacity=".1"/>
<rect width="1600" height="38" fill="url(#qs-ceiling)"/>
<rect y="34" width="1600" height="4" fill="#2a2230"/>
<rect y="37" width="1600" height="1" fill="#e8c37a" opacity=".35"/>
<ellipse cx="80" cy="40" rx="120" ry="200" fill="url(#qs-downcone)" opacity=".9"/>
<rect x="68" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="400" cy="40" rx="120" ry="200" fill="url(#qs-downcone)" opacity=".9"/>
<rect x="388" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="696" cy="40" rx="120" ry="200" fill="url(#qs-downcone)" opacity=".9"/>
<rect x="684" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="980" cy="40" rx="120" ry="200" fill="url(#qs-downcone)" opacity=".9"/>
<rect x="968" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="1260" cy="40" rx="120" ry="200" fill="url(#qs-downcone)" opacity=".9"/>
<rect x="1248" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="1520" cy="40" rx="120" ry="200" fill="url(#qs-downcone)" opacity=".9"/>
<rect x="1508" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<rect y="598" width="1600" height="142" fill="url(#qs-floor)"/>
<rect y="596" width="1600" height="4" fill="#2a2028"/>
<rect y="599" width="1600" height="2" fill="#ffcf8a" opacity=".45"/>
<rect y="601" width="1600" height="26" fill="url(#qs-baseglow)"/>
<ellipse cx="400" cy="694" rx="300" ry="38" fill="#2a1722" stroke="#c9a560" stroke-opacity=".28" stroke-width="2"/>
<ellipse cx="400" cy="694" rx="270" ry="30" fill="none" stroke="#c9a560" stroke-opacity=".14" stroke-width="1"/>
<path d="M160 600 L640 600 L760 740 L40 740 Z" fill="url(#qs-spill)"/>
<!-- the bookshelf -->
<rect x="22" y="78" width="114" height="522" rx="16" fill="#0f0c13" stroke="#3a2f3e" stroke-width="2"/>
<rect x="30" y="86" width="98" height="508" rx="11" fill="url(#qs-alcove)"/>
<ellipse cx="79" cy="180" rx="18" ry="3" fill="#000" opacity=".4"/>
<path d="M79 178 L79 170" stroke="#8a7350" stroke-width="2"/>
<circle cx="79" cy="146" r="21" fill="url(#qs-globe)"/>
<path d="M64 140 q8 -8 16 -2 q6 4 12 -3 M66 154 q10 4 18 -2" stroke="#7fbf9a" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>
<path d="M56 146 a23 23 0 0 1 46 0" stroke="#b8914a" stroke-width="2" fill="none"/>
<rect x="30" y="182" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="188" width="98" height="14" fill="url(#qs-shelflight)" opacity=".7"/>
<rect x="36" y="209" width="9.3" height="63" rx="1.2" fill="#4a6a5a"/>
<rect x="37.5" y="217" width="6.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="46.1" y="200.9" width="9.6" height="71.1" rx="1.2" fill="#6a4a7a"/>
<rect x="47.6" y="208.9" width="6.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="57.2" y="220.7" width="8.9" height="51.3" rx="1.2" fill="#8a6a3a"/>
<rect x="58.7" y="228.7" width="5.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="67.5" y="201.9" width="9.8" height="70.1" rx="1.2" fill="#556b4a"/>
<rect x="69" y="209.9" width="6.8" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="78.2" y="218.2" width="10.9" height="53.8" rx="1.2" fill="#6a4a7a"/>
<rect x="79.7" y="226.2" width="7.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="90.3" y="205" width="10.6" height="67" rx="1.2" fill="#2f4f6a"/>
<rect x="91.8" y="213" width="7.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="101.7" y="217.6" width="10.6" height="54.4" rx="1.2" fill="#4a6a5a"/>
<rect x="103.2" y="225.6" width="7.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="113.6" y="215.5" width="7.9" height="56.5" rx="1.2" fill="#8a6a3a"/>
<rect x="115.1" y="223.5" width="4.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="272" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="278" width="98" height="14" fill="url(#qs-shelflight)" opacity=".7"/>
<rect x="36" y="301.1" width="11.1" height="60.9" rx="1.2" fill="#2f4f6a"/>
<rect x="37.5" y="309.1" width="8.1" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="48.6" y="305.5" width="9.4" height="56.5" rx="1.2" fill="#556b4a"/>
<rect x="50.1" y="313.5" width="6.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="59.1" y="307.3" width="10.4" height="54.7" rx="1.2" fill="#8a6a3a"/>
<rect x="60.6" y="315.3" width="7.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="70.3" y="305.4" width="10.6" height="56.6" rx="1.2" fill="#4a6a5a"/>
<rect x="71.8" y="313.4" width="7.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="81.6" y="290.8" width="9" height="71.2" rx="1.2" fill="#a08050"/>
<rect x="83.1" y="298.8" width="6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="92" y="299.2" width="11.7" height="62.8" rx="1.2" fill="#3b5a7a"/>
<rect x="93.5" y="307.2" width="8.7" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="105.2" y="303.7" width="11.9" height="58.3" rx="1.2" fill="#556b4a"/>
<rect x="106.7" y="311.7" width="8.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="362" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="368" width="98" height="14" fill="url(#qs-shelflight)" opacity=".7"/>
<rect x="36" y="381.9" width="11.3" height="70.1" rx="1.2" fill="#2f4f6a"/>
<rect x="37.5" y="389.9" width="8.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="48.2" y="381.8" width="8.2" height="70.2" rx="1.2" fill="#8a6a3a"/>
<rect x="49.7" y="389.8" width="5.2" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="57.3" y="380" width="9" height="72" rx="1.2" fill="#556b4a"/>
<rect x="58.8" y="388" width="6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="67.4" y="384.4" width="10" height="67.6" rx="1.2" fill="#5a3a4a"/>
<rect x="68.9" y="392.4" width="7" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="78.2" y="401.6" width="8.9" height="50.4" rx="1.2" fill="#5a3a4a"/>
<rect x="79.7" y="409.6" width="5.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="88.6" y="384.4" width="8.5" height="67.6" rx="1.2" fill="#3b5a7a"/>
<rect x="90.1" y="392.4" width="5.5" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="97.8" y="381.9" width="10.4" height="70.1" rx="1.2" fill="#a08050"/>
<rect x="99.3" y="389.9" width="7.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="109.1" y="400.5" width="10.4" height="51.5" rx="1.2" fill="#a08050"/>
<rect x="110.6" y="408.5" width="7.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="452" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="458" width="98" height="14" fill="url(#qs-shelflight)" opacity=".7"/>
<rect x="36" y="486.3" width="9.3" height="55.7" rx="1.2" fill="#a08050"/>
<rect x="37.5" y="494.3" width="6.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="46.8" y="485" width="11.5" height="57" rx="1.2" fill="#8a6a3a"/>
<rect x="48.3" y="493" width="8.5" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="59.9" y="475.7" width="7.3" height="66.3" rx="1.2" fill="#8a6a3a"/>
<rect x="61.4" y="483.7" width="4.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="68.1" y="490.9" width="7.5" height="51.1" rx="1.2" fill="#5a3a4a"/>
<rect x="69.6" y="498.9" width="4.5" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="76.6" y="488.5" width="10.9" height="53.5" rx="1.2" fill="#a08050"/>
<rect x="78.1" y="496.5" width="7.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="88.5" y="486.2" width="11.9" height="55.8" rx="1.2" fill="#3b5a7a"/>
<rect x="90" y="494.2" width="8.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="101.1" y="490.5" width="9.2" height="51.5" rx="1.2" fill="#a08050"/>
<rect x="102.6" y="498.5" width="6.2" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="111.5" y="481.1" width="7.1" height="60.9" rx="1.2" fill="#8a4a3a"/>
<rect x="113" y="489.1" width="4.1" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="542" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="548" width="98" height="14" fill="url(#qs-shelflight)" opacity=".7"/>
<!-- the viewport -->
<polygon points="166,86 634,86 656,566 144,566" fill="#2a2230" stroke="#4d4052" stroke-width="2"/>
<polygon points="180,100 620,100 640,548 160,548" fill="#04060d"/>
<g clip-path="url(#qs-glass)">
<rect x="150" y="90" width="500" height="470" fill="url(#qs-space)"/>
<ellipse cx="300" cy="210" rx="250" ry="130" fill="url(#qs-neb-plum)"/>
<ellipse cx="540" cy="330" rx="210" ry="130" fill="url(#qs-neb-teal)"/>
<ellipse cx="250" cy="400" rx="170" ry="90" fill="url(#qs-neb-rose)"/>
<ellipse cx="400" cy="300" rx="330" ry="46" fill="url(#qs-band)" transform="rotate(-24 400 300)"/>
<g >
<circle cx="448.7" cy="284.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="390" cy="303.8" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="555.4" cy="219.7" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="350.4" cy="312.4" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="230.4" cy="377.7" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="528.2" cy="225.1" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="410.8" cy="290.2" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="115.5" cy="410" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="370.4" cy="325.1" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="324.5" cy="319.6" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="611.4" cy="223.2" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="565.3" cy="219.8" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="399.1" cy="304.3" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="533.6" cy="258.9" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="148.6" cy="418.4" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="331.1" cy="346" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="274.9" cy="354.4" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="448.8" cy="289.7" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="363.2" cy="306.9" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="629" cy="195.4" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="616.7" cy="203.3" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="670.2" cy="179.7" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="469.9" cy="288.5" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="246.7" cy="360.7" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="680.8" cy="181.4" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="148.4" cy="404.3" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="587.2" cy="210.2" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="646.3" cy="207.9" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="663.7" cy="183.5" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="268.2" cy="374.2" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="418.9" cy="303.1" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="356.4" cy="287.5" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="671" cy="172.6" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="633.9" cy="212" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="356.6" cy="332.9" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="245.1" cy="357" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="483.3" cy="252.7" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="249.5" cy="344.3" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="201.8" cy="393.9" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="287.3" cy="359.1" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="415" cy="296.9" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="452.3" cy="280" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="161.8" cy="430.2" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="231.5" cy="374.1" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="576.9" cy="205" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="431.9" cy="304" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="494.4" cy="249.9" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="387" cy="292.8" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="626.3" cy="194.4" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="626" cy="214.6" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="478.3" cy="274.6" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="555.7" cy="219.5" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="239.2" cy="373.2" r="0.7" fill="#e8e4ff" opacity="0.6"/>
<circle cx="647.6" cy="174.4" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="191.1" cy="399.1" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="424.3" cy="274.2" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="358.4" cy="341.2" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="511.7" cy="237" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="144.9" cy="437.1" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="324.6" cy="360.2" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="630.4" cy="203.1" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="510.9" cy="258.7" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="348.8" cy="335" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="359.2" cy="290.5" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="628.7" cy="214.8" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="595.5" cy="222" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="505.6" cy="255.5" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="269.4" cy="360.8" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="490.8" cy="253.3" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="611.1" cy="193.1" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="221.5" cy="384.8" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="251.2" cy="335.4" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="332.3" cy="329.1" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="163.5" cy="429.3" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="388" cy="326.7" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="462.4" cy="291.2" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="279.4" cy="355.9" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="581.1" cy="229.9" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="243.3" cy="313.1" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="625.9" cy="174.3" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="372.4" cy="281.8" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="189.1" cy="405.6" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="367.9" cy="296" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="264.1" cy="359.8" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="300.9" cy="333" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="502.7" cy="231.2" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="444.1" cy="265.6" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="509.5" cy="263.9" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="375.5" cy="323.9" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="629.1" cy="205.8" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="635.8" cy="196.3" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="671.9" cy="208.6" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="300.3" cy="329.5" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="152.8" cy="413.3" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="258.2" cy="358.5" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="392" cy="311" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="570" cy="187.3" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="425" cy="305.6" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="304" cy="299.3" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="487.9" cy="271.4" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="337.6" cy="313.6" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="249.5" cy="343.8" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="118.1" cy="419.3" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="488.3" cy="237.7" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="138.9" cy="394.9" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="502.4" cy="220.1" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="520.4" cy="258.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="311.5" cy="333" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="183.3" cy="398.9" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="187.8" cy="403.2" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="443.7" cy="284.4" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="251.9" cy="362.3" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="444.2" cy="270" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="563.9" cy="198.4" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="657.1" cy="163.4" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="654.9" cy="193.4" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="130.1" cy="421.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="658.2" cy="197.4" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="284.9" cy="339.6" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="440.7" cy="273.1" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="149.4" cy="408.1" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="400.7" cy="361.4" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="264.9" cy="373" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="537" cy="217.7" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="687.1" cy="197.2" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="130.1" cy="409.7" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="307.4" cy="340" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="388.9" cy="316.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="550.6" cy="228" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="330.2" cy="279" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="464.6" cy="264.8" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="428.5" cy="282.7" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="170" cy="413.7" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="161.7" cy="418.4" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="565.8" cy="245" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="581.9" cy="246.5" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="582.5" cy="229.1" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="249.1" cy="351.9" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="211" cy="408.4" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="223.4" cy="370.6" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="410.9" cy="470.5" r="0.5" fill="#ffffff" opacity="0.8" class="sa-tw" style="animation-delay:-0.8s"/>
<circle cx="531.4" cy="174.8" r="0.6" fill="#dfe8ff" opacity="0.5"/>
<circle cx="217.7" cy="316.1" r="1.3" fill="#ffe0f0" opacity="0.7"/>
<circle cx="169.1" cy="103.3" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="181.4" cy="202.8" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="521.1" cy="385.6" r="1.3" fill="#ffe0f0" opacity="0.5"/>
<circle cx="499.4" cy="234.9" r="1.3" fill="#ffffff" opacity="0.9"/>
<circle cx="337" cy="114.2" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="370.5" cy="342.3" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="181.3" cy="240.7" r="1.1" fill="#ffffff" opacity="0.4" class="sa-tw" style="animation-delay:-3.5s"/>
<circle cx="461.5" cy="178.8" r="0.6" fill="#ffffff" opacity="0.8"/>
<circle cx="507.9" cy="390.1" r="1.6" fill="#ffffff" opacity="0.8"/>
<circle cx="209.2" cy="181.6" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="182" cy="149.3" r="0.5" fill="#ffe0f0" opacity="0.9"/>
<circle cx="171.7" cy="324.5" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="238.6" cy="442.9" r="1.3" fill="#ffffff" opacity="0.7"/>
<circle cx="179.9" cy="162.2" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="394.5" cy="187.6" r="1.6" fill="#ffffff" opacity="0.6"/>
<circle cx="425.7" cy="315.4" r="1.6" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-5s"/>
<circle cx="286.7" cy="331.4" r="0.9" fill="#fff1d6" opacity="0.7"/>
<circle cx="505.8" cy="191.1" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="234.1" cy="548" r="0.5" fill="#ffe0f0" opacity="0.7"/>
<circle cx="229.4" cy="526.2" r="0.7" fill="#ffe0f0" opacity="0.8"/>
<circle cx="579.2" cy="185.7" r="1.6" fill="#ffffff" opacity="0.8"/>
<circle cx="314" cy="502.7" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="504.1" cy="388.1" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="427.8" cy="300.5" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="389.9" cy="146.9" r="1.6" fill="#ffffff" opacity="0.8" class="sa-tw" style="animation-delay:-0.1s"/>
<circle cx="280.6" cy="223.6" r="0.8" fill="#dfe8ff" opacity="0.8"/>
<circle cx="407.4" cy="260.9" r="0.5" fill="#dfe8ff" opacity="0.6"/>
<circle cx="600.1" cy="339" r="1.6" fill="#ffffff" opacity="0.8"/>
<circle cx="336.8" cy="119.7" r="0.6" fill="#ffe0f0" opacity="0.9"/>
<circle cx="568" cy="378" r="1" fill="#fff1d6" opacity="0.5"/>
<circle cx="634.1" cy="229.2" r="0.5" fill="#fff1d6" opacity="0.9"/>
<circle cx="320.8" cy="355.9" r="1.3" fill="#ffffff" opacity="0.7"/>
<circle cx="626.1" cy="100.6" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="169.9" cy="479.7" r="1.6" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-3.8s"/>
<circle cx="234.2" cy="463.5" r="1.3" fill="#ffffff" opacity="0.9"/>
<circle cx="544.3" cy="246.2" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="622.7" cy="293.8" r="0.9" fill="#dfe8ff" opacity="0.9"/>
<circle cx="339.5" cy="481.4" r="0.6" fill="#ffffff" opacity="0.7"/>
<circle cx="228.3" cy="461.9" r="1.6" fill="#ffffff" opacity="0.9"/>
<circle cx="472.1" cy="518.2" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="409.2" cy="544" r="0.8" fill="#ffffff" opacity="0.4"/>
<circle cx="615.3" cy="385.1" r="1.3" fill="#ffffff" opacity="0.7"/>
<circle cx="277.5" cy="257" r="1" fill="#fff1d6" opacity="0.5" class="sa-tw" style="animation-delay:-4s"/>
<circle cx="531" cy="528.5" r="0.8" fill="#fff1d6" opacity="0.4"/>
<circle cx="275.3" cy="512.4" r="0.8" fill="#dfe8ff" opacity="0.6"/>
<circle cx="442.9" cy="143.4" r="0.7" fill="#ffffff" opacity="0.5"/>
<circle cx="483.6" cy="151.9" r="1.1" fill="#ffe0f0" opacity="0.5"/>
<circle cx="404.3" cy="329.9" r="0.5" fill="#fff1d6" opacity="0.6"/>
<circle cx="223.1" cy="539.6" r="0.8" fill="#dfe8ff" opacity="0.4"/>
<circle cx="267.7" cy="545.5" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="498" cy="309.6" r="1.6" fill="#dfe8ff" opacity="0.9"/>
<circle cx="261.5" cy="516.2" r="0.6" fill="#fff1d6" opacity="0.9" class="sa-tw" style="animation-delay:-2s"/>
<circle cx="490.8" cy="519.3" r="0.6" fill="#ffe0f0" opacity="0.9"/>
<circle cx="181.6" cy="151.9" r="1.6" fill="#ffffff" opacity="0.5"/>
<circle cx="563.7" cy="303.6" r="0.7" fill="#ffe0f0" opacity="0.9"/>
<circle cx="203.4" cy="507.1" r="1.3" fill="#ffe0f0" opacity="0.4"/>
<circle cx="370.8" cy="453.8" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="600.3" cy="435" r="1.6" fill="#ffffff" opacity="0.6"/>
<circle cx="220.9" cy="160.4" r="1" fill="#ffe0f0" opacity="0.7"/>
<circle cx="630.6" cy="217.9" r="1.1" fill="#ffffff" opacity="0.9"/>
<circle cx="503.1" cy="153.8" r="1.1" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-1.8s"/>
<circle cx="264" cy="121.1" r="0.8" fill="#ffffff" opacity="0.4"/>
<circle cx="260.7" cy="410.9" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="348.6" cy="307.7" r="1.1" fill="#ffffff" opacity="0.8"/>
<circle cx="324.5" cy="268.4" r="1.1" fill="#ffe0f0" opacity="0.5"/>
<circle cx="263.8" cy="490.6" r="1.6" fill="#fff1d6" opacity="0.7"/>
<circle cx="540.6" cy="313.5" r="1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="436.8" cy="377.1" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="181.5" cy="475.5" r="1.1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="557.6" cy="134.6" r="1.3" fill="#fff1d6" opacity="0.5" class="sa-tw" style="animation-delay:-1.3s"/>
<circle cx="601.1" cy="380.4" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="491.8" cy="142.5" r="1.1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="516.3" cy="344.3" r="0.8" fill="#fff1d6" opacity="0.9"/>
<circle cx="448.9" cy="288.5" r="0.9" fill="#ffe0f0" opacity="0.5"/>
<circle cx="211.7" cy="498" r="0.9" fill="#ffe0f0" opacity="0.5"/>
<circle cx="449.5" cy="419.5" r="1.1" fill="#ffffff" opacity="0.5"/>
<circle cx="420.2" cy="402.2" r="0.5" fill="#fff1d6" opacity="0.7"/>
<circle cx="604.1" cy="310.6" r="1.6" fill="#dfe8ff" opacity="0.7"/>
<circle cx="488.5" cy="413.1" r="1" fill="#ffffff" opacity="0.8" class="sa-tw" style="animation-delay:-2.6s"/>
<circle cx="227.3" cy="320" r="0.7" fill="#fff1d6" opacity="0.5"/>
<circle cx="586.9" cy="349" r="1.3" fill="#ffe0f0" opacity="0.6"/>
<circle cx="532.7" cy="130" r="1" fill="#ffe0f0" opacity="0.9"/>
<circle cx="169.7" cy="511.2" r="0.9" fill="#ffffff" opacity="0.8"/>
<circle cx="348.8" cy="534" r="1.3" fill="#ffe0f0" opacity="0.4"/>
<circle cx="473.3" cy="112.5" r="1" fill="#ffffff" opacity="0.9"/>
<circle cx="204.7" cy="224.1" r="1.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="607.1" cy="225.7" r="1.3" fill="#ffffff" opacity="0.5"/>
<circle cx="378.3" cy="330.1" r="0.8" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-4.4s"/>
<circle cx="227.8" cy="507.1" r="0.5" fill="#ffe0f0" opacity="0.4"/>
<circle cx="273.5" cy="509.8" r="1" fill="#ffe0f0" opacity="0.5"/>
<circle cx="587.7" cy="336" r="1.3" fill="#fff1d6" opacity="0.6"/>
<circle cx="591.5" cy="194" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="412.3" cy="403" r="1.6" fill="#ffffff" opacity="0.9"/>
<circle cx="620.2" cy="145.3" r="0.6" fill="#dfe8ff" opacity="0.7"/>
<circle cx="551.8" cy="509.3" r="1.6" fill="#dfe8ff" opacity="0.4"/>
<circle cx="254.6" cy="286.7" r="0.8" fill="#ffe0f0" opacity="0.8"/>
<circle cx="386.8" cy="317.4" r="0.6" fill="#ffe0f0" opacity="0.4" class="sa-tw" style="animation-delay:-1.9s"/>
<circle cx="438.5" cy="334.7" r="1" fill="#fff1d6" opacity="0.4"/>
<circle cx="169.3" cy="522.9" r="1" fill="#ffe0f0" opacity="0.8"/>
<circle cx="166.3" cy="422.2" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="226.6" cy="245" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="419.1" cy="383.1" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="236.7" cy="452.3" r="0.5" fill="#dfe8ff" opacity="0.8"/>
<circle cx="168.6" cy="173.1" r="0.6" fill="#dfe8ff" opacity="0.8"/>
<circle cx="625.6" cy="218.7" r="0.6" fill="#ffffff" opacity="0.8"/>
<circle cx="389.9" cy="297.5" r="0.5" fill="#ffffff" opacity="0.7" class="sa-tw" style="animation-delay:-3.1s"/>
<circle cx="219.2" cy="477.3" r="0.5" fill="#dfe8ff" opacity="0.5"/>
<circle cx="536.7" cy="293.1" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="566.5" cy="292.9" r="1.3" fill="#ffe0f0" opacity="0.8"/>
<circle cx="349" cy="266.3" r="1.1" fill="#ffe0f0" opacity="0.4"/>
<circle cx="418.5" cy="127.3" r="1.1" fill="#ffffff" opacity="0.6"/>
<circle cx="349.1" cy="114.8" r="1.6" fill="#fff1d6" opacity="0.6"/>
<circle cx="618.3" cy="433.2" r="1" fill="#fff1d6" opacity="0.4"/>
<circle cx="514.4" cy="345.2" r="0.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="311.4" cy="543.5" r="0.7" fill="#fff1d6" opacity="0.5" class="sa-tw" style="animation-delay:-5s"/>
<circle cx="315.8" cy="381.6" r="1.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="609.4" cy="120.9" r="0.5" fill="#ffffff" opacity="0.4"/>
<circle cx="557.1" cy="324.8" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="237.2" cy="469.2" r="1" fill="#fff1d6" opacity="0.7"/>
<circle cx="423.9" cy="315.4" r="0.7" fill="#ffe0f0" opacity="0.5"/>
<circle cx="534.6" cy="300.8" r="0.9" fill="#ffe0f0" opacity="0.4"/>
<circle cx="545.6" cy="297.6" r="0.8" fill="#ffe0f0" opacity="0.9"/>
<circle cx="595.4" cy="313.2" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="627.9" cy="484" r="0.5" fill="#fff1d6" opacity="0.8" class="sa-tw" style="animation-delay:-5.6s"/>
<circle cx="307.1" cy="274.1" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="175.6" cy="417.3" r="1.3" fill="#ffffff" opacity="0.8"/>
<circle cx="278.2" cy="108.3" r="1.3" fill="#ffffff" opacity="0.4"/>
<circle cx="372" cy="116.9" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="253.5" cy="443.7" r="1.6" fill="#ffe0f0" opacity="0.5"/>
<circle cx="341.7" cy="531.3" r="1.6" fill="#ffe0f0" opacity="0.4"/>
<circle cx="559.9" cy="440.3" r="1.6" fill="#fff1d6" opacity="0.8"/>
<circle cx="350.9" cy="397.7" r="1.6" fill="#ffffff" opacity="0.6"/>
<circle cx="421.7" cy="419" r="0.9" fill="#ffe0f0" opacity="0.8" class="sa-tw" style="animation-delay:-4.7s"/>
<circle cx="382.4" cy="178.9" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="290.6" cy="489.5" r="1.6" fill="#ffffff" opacity="0.5"/>
<circle cx="608.7" cy="337.3" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="197.6" cy="336.1" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="542.1" cy="475.8" r="0.7" fill="#dfe8ff" opacity="0.7"/>
<circle cx="510.8" cy="274.9" r="0.5" fill="#ffffff" opacity="0.5"/>
<circle cx="224.3" cy="494.9" r="0.5" fill="#ffffff" opacity="0.7"/>
<circle cx="579.1" cy="256.6" r="0.9" fill="#ffe0f0" opacity="0.4"/>
<circle cx="612.7" cy="179" r="0.6" fill="#dfe8ff" opacity="0.6" class="sa-tw" style="animation-delay:-0.7s"/>
<circle cx="189.1" cy="350.3" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="581.2" cy="110.3" r="1.6" fill="#ffffff" opacity="0.4"/>
<circle cx="214.8" cy="173.5" r="1.6" fill="#dfe8ff" opacity="0.8"/>
<circle cx="368.6" cy="535.1" r="1.3" fill="#dfe8ff" opacity="0.5"/>
<circle cx="591.6" cy="342.2" r="0.6" fill="#ffffff" opacity="0.5"/>
<circle cx="418.1" cy="305.3" r="0.8" fill="#dfe8ff" opacity="0.4"/>
<circle cx="377.7" cy="458.9" r="0.9" fill="#ffe0f0" opacity="0.4"/>
<circle cx="219.2" cy="191.3" r="1.1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="432.5" cy="387.8" r="1" fill="#ffffff" opacity="0.6" class="sa-tw" style="animation-delay:-2.8s"/>
<circle cx="468.8" cy="104.3" r="1" fill="#ffe0f0" opacity="0.7"/>
<circle cx="191.3" cy="329.5" r="0.9" fill="#ffe0f0" opacity="0.5"/>
<circle cx="276.9" cy="342.2" r="0.5" fill="#dfe8ff" opacity="0.6"/>
<circle cx="370.3" cy="268.2" r="0.7" fill="#dfe8ff" opacity="0.4"/>
<circle cx="274.3" cy="334.1" r="0.9" fill="#dfe8ff" opacity="0.7"/>
<circle cx="611.2" cy="230.9" r="0.9" fill="#dfe8ff" opacity="0.4"/>
<circle cx="282.2" cy="177.9" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="274.1" cy="292.8" r="0.8" fill="#fff1d6" opacity="0.9"/>
<circle cx="293.2" cy="257" r="1.1" fill="#fff1d6" opacity="0.7" class="sa-tw" style="animation-delay:-5.2s"/>
<circle cx="431.6" cy="150.7" r="0.6" fill="#ffffff" opacity="0.6"/>
<circle cx="546.2" cy="529.2" r="1.1" fill="#dfe8ff" opacity="0.6"/>
<circle cx="568.8" cy="305.6" r="1.3" fill="#ffffff" opacity="0.4"/>
<circle cx="461.2" cy="173.8" r="1.1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="533.5" cy="489.9" r="0.6" fill="#fff1d6" opacity="0.6"/>
<circle cx="483.3" cy="504.8" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="185.1" cy="114.1" r="0.8" fill="#fff1d6" opacity="0.4"/>
<circle cx="236" cy="150" r="9" fill="url(#qs-starglow)"/><circle cx="236" cy="150" r="1.4" fill="#fff"/>
<circle cx="548" cy="212" r="7" fill="url(#qs-starglow)"/><circle cx="548" cy="212" r="1.4" fill="#fff"/>
<circle cx="420" cy="128" r="6" fill="url(#qs-starglow)"/><circle cx="420" cy="128" r="1.4" fill="#fff"/>
<circle cx="590" cy="420" r="8" fill="url(#qs-starglow)"/><circle cx="590" cy="420" r="1.4" fill="#fff"/>
<circle cx="300" cy="300" r="5" fill="url(#qs-starglow)"/><circle cx="300" cy="300" r="1.4" fill="#fff"/>
</g>
<g class="sa-streaks" style="opacity:var(--sa-burn,0)">
<line class="sa-streak" x1="0" y1="381" x2="102.9" y2="381" stroke="url(#qs-streak)" stroke-width="1.3" opacity="0.5" style="animation-duration:6.6s;animation-delay:-4s"/>
<line class="sa-streak" x1="0" y1="175.1" x2="46.3" y2="175.1" stroke="url(#qs-streak)" stroke-width="1.1" opacity="0.6" style="animation-duration:6.4s;animation-delay:-1.8s"/>
<line class="sa-streak" x1="0" y1="150.9" x2="76.4" y2="150.9" stroke="url(#qs-streak)" stroke-width="1.3" opacity="0.4" style="animation-duration:5.6s;animation-delay:-9.4s"/>
<line class="sa-streak" x1="0" y1="351.5" x2="49" y2="351.5" stroke="url(#qs-streak)" stroke-width="1.4" opacity="0.3" style="animation-duration:8.2s;animation-delay:-1.3s"/>
<line class="sa-streak" x1="0" y1="119.4" x2="42.7" y2="119.4" stroke="url(#qs-streak)" stroke-width="1.5" opacity="0.5" style="animation-duration:6s;animation-delay:-3.5s"/>
<line class="sa-streak" x1="0" y1="390" x2="103.3" y2="390" stroke="url(#qs-streak)" stroke-width="0.9" opacity="0.4" style="animation-duration:5.9s;animation-delay:-0.3s"/>
<line class="sa-streak" x1="0" y1="227.7" x2="83.8" y2="227.7" stroke="url(#qs-streak)" stroke-width="1.1" opacity="0.4" style="animation-duration:5.9s;animation-delay:-9.5s"/>
<line class="sa-streak" x1="0" y1="434.3" x2="72.9" y2="434.3" stroke="url(#qs-streak)" stroke-width="1.5" opacity="0.3" style="animation-duration:7.4s;animation-delay:-0.7s"/>
<line class="sa-streak" x1="0" y1="191.7" x2="41.6" y2="191.7" stroke="url(#qs-streak)" stroke-width="1.3" opacity="0.4" style="animation-duration:7.9s;animation-delay:-5.8s"/>
<line class="sa-streak" x1="0" y1="259.1" x2="51.7" y2="259.1" stroke="url(#qs-streak)" stroke-width="1.5" opacity="0.5" style="animation-duration:6s;animation-delay:-0.3s"/>
<line class="sa-streak" x1="0" y1="154.9" x2="84.6" y2="154.9" stroke="url(#qs-streak)" stroke-width="0.9" opacity="0.5" style="animation-duration:9s;animation-delay:-3.7s"/>
<line class="sa-streak" x1="0" y1="436.8" x2="57.7" y2="436.8" stroke="url(#qs-streak)" stroke-width="1.1" opacity="0.3" style="animation-duration:6.5s;animation-delay:-6.8s"/>
<line class="sa-streak" x1="0" y1="414.6" x2="106.8" y2="414.6" stroke="url(#qs-streak)" stroke-width="1.4" opacity="0.4" style="animation-duration:7.8s;animation-delay:-1.3s"/>
<line class="sa-streak" x1="0" y1="176.5" x2="114.4" y2="176.5" stroke="url(#qs-streak)" stroke-width="0.9" opacity="0.5" style="animation-duration:8s;animation-delay:-8.7s"/>
</g>
<circle cx="566" cy="168" r="13" fill="#9aa3b5"/>
<circle cx="561" cy="165" r="13" fill="#04060d" opacity=".55"/>
<circle cx="190" cy="690" r="250" fill="none" stroke="#7fd8e8" stroke-opacity=".10" stroke-width="22" filter="url(#qs-blur)"/>
<circle cx="190" cy="690" r="250" fill="url(#qs-planet)"/>
<path d="M-20 520 Q160 452 400 520 M0 556 Q180 494 420 560" stroke="#cfe8ff" stroke-opacity=".05" stroke-width="12" fill="none"/>
<circle cx="190" cy="690" r="250" fill="none" stroke="url(#qs-atmo)" stroke-width="3"/>
<path d="M190 100 L260 100 L200 548 L160 548 Z" fill="#fff" opacity=".025"/>
<path d="M500 100 L540 100 L500 548 L480 548 Z" fill="#fff" opacity=".02"/>
</g>
<path d="M327 100 L321 548" stroke="#2a2230" stroke-width="9"/><path d="M324 100 L318 548" stroke="#5a4a5e" stroke-width="1.2"/>
<path d="M473 100 L479 548" stroke="#2a2230" stroke-width="9"/><path d="M470 100 L476 548" stroke="#5a4a5e" stroke-width="1.2"/>
<polygon points="180,100 620,100 640,548 160,548" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="3"/>
<path d="M136 560 L664 560 L672 576 L128 576 Z" fill="#3a2f3e"/>
<path d="M128 576 L672 576" stroke="#c9a560" stroke-opacity=".5" stroke-width="1.5"/>
<!-- the plaque -->
<rect x="656" y="40" width="80" height="560" fill="url(#qs-pillar)"/>
<ellipse cx="696" cy="122" rx="44" ry="10" fill="#ffd89a" opacity=".12"/>
<rect x="684" y="112" width="24" height="5" rx="2.5" fill="#6b5a40"/>
<path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" fill="url(#qs-brass)" stroke="#f3d898" stroke-width="1.2" stroke-opacity=".6"/>
<path d="M696 146 L709 174 L696 167 L683 174 Z" fill="#5a4520" opacity=".85"/>
<rect x="680" y="186" width="32" height="3" rx="1.5" fill="#5a4520" opacity=".9"/>
<rect x="678.6" y="210" width="34.9" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="679.6" y="225" width="32.9" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="677.8" y="240" width="36.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="686.7" y="255" width="18.5" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="682.4" y="277" width="27.3" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="679.1" y="292" width="33.7" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="677.2" y="307" width="37.7" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="688" y="322" width="16.1" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="681.7" y="344" width="28.7" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="679.3" y="359" width="33.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="680.9" y="374" width="30.2" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="685.8" y="389" width="20.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="682.5" y="411" width="27" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="678.3" y="426" width="35.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<!-- the wall screen -->
<rect x="742" y="46" width="840" height="456" rx="20" fill="url(#qs-screenglow)" opacity=".9"/>
<rect x="744" y="48" width="836" height="452" rx="18" fill="#0b0a10" stroke="#3d3242" stroke-width="2"/>
<rect x="752" y="56" width="820" height="436" rx="12" fill="#080a12"/>
<rect x="752" y="56" width="820" height="436" rx="12" fill="none" stroke="#e8c37a" stroke-opacity=".25" stroke-width="1"/>
<g opacity=".5">
<path d="M1162 232 L1184 282 L1162 270 L1140 282 Z" fill="none" stroke="#e8c37a" stroke-width="2.4" stroke-linejoin="round"/>
<text x="1162" y="314" text-anchor="middle" fill="#e8c37a" font-family="JetBrains Mono, monospace" font-size="13" letter-spacing="4">HERMES · HX-01</text>
<rect x="1102" y="328" width="120" height="2" rx="1" fill="#e8c37a" opacity=".5"/>
</g>
<!-- the desk -->
<ellipse cx="1166" cy="694" rx="420" ry="14" fill="url(#qs-shadow)"/>
<path d="M790 586 L1542 586 L1558 604 L774 604 Z" fill="url(#qs-desktop)"/>
<path d="M774 604 L1558 604" stroke="#c9a560" stroke-width="2.2" stroke-opacity=".8"/>
<path d="M776 606 L1556 606 L1546 690 L786 690 Z" fill="url(#qs-deskfront)"/>
<path d="M800 652 L1532 652" stroke="#e8c37a" stroke-opacity=".12" stroke-width="1"/>
<rect x="874" y="574" width="16" height="14" fill="#3a3036"/>
<ellipse cx="882" cy="588" rx="30" ry="4" fill="#3a3036"/>
<rect x="808" y="506" width="148" height="72" rx="7" fill="#100d14" stroke="#4a3d4c" stroke-width="1.5"/>
<rect x="814" y="512" width="136" height="60" rx="4" fill="url(#qs-termglass)"/>
<rect x="822" y="519" width="44" height="4" rx="2" fill="#e8c37a" opacity=".85"/>
<rect x="822" y="529" width="112" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>
<rect x="822" y="536" width="98" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>
<rect x="822" y="543" width="106" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>
<rect x="822" y="553" width="76" height="2.4" rx="1.2" fill="#e8c37a" opacity=".3"/>
<rect  x="901" y="551" width="5" height="6" fill="#e8c37a"/>
<path d="M992 596 L1060 584 L1078 592 L1010 604 Z" fill="#1a161d" stroke="#5a4a50" stroke-width="1"/>
<path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" fill="#221c25" stroke="#7a6a5a" stroke-width="1.2"/>
<path d="M1010 587 L1064 578 L1076 584 L1022 593 Z" fill="url(#qs-paddglass)"/>
<path d="M1022 585 L1050 580 M1025 588 L1058 582.5 M1028 590.5 L1046 587.5" stroke="#06120f" stroke-width="1.1" opacity=".6"/>
<path d="M1090 596 L1124 590" stroke="#c9a560" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="1150" cy="590" rx="22" ry="4" fill="#3a3036"/>
<path d="M1136 562 L1164 562 L1160 588 Q1150 592 1140 588 Z" fill="#e9e2d6"/>
<path d="M1164 568 q10 1 9 9 q-1 7 -11 6" fill="none" stroke="#e9e2d6" stroke-width="3"/>
<ellipse cx="1150" cy="562" rx="14" ry="3" fill="#7a4a2a"/>
<path  d="M1144 554 q-6 -10 0 -18 q6 -8 0 -18" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>
<path class="q-steam q-steam2" d="M1155 556 q-6 -10 0 -18 q6 -8 0 -18" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="1342" cy="592" rx="42" ry="6" fill="#2d252b" stroke="#6b5a40" stroke-width="1.2"/>
<rect x="1340" y="556" width="5" height="36" fill="url(#qs-metal)"/>
<g id="qs-model">
<path d="M1356 546 L1372 522 L1378 522 L1366 548 Z" fill="#3a4458"/>
<rect x="1334" y="511" width="92" height="7" rx="3.5" fill="#5d6a80"/>
<rect x="1350" y="512.5" width="66" height="2.6" rx="1.3" fill="#e889b6" opacity=".9"/>
<circle cx="1337" cy="514.5" r="3.2" fill="#ff6a50" opacity=".85"/>
<path d="M1346 550 L1364 528 L1372 528 L1358 552 Z" fill="#4a556b"/>
<path d="M1270 534 L1300 534 L1330 550 L1316 556 Z" fill="#56627a"/>
<path d="M1312 546 Q1312 540 1322 540 L1396 542 Q1408 546 1396 554 L1322 558 Q1312 556 1312 552 Z" fill="url(#qs-hull)"/>
<circle cx="1316" cy="549" r="4.2" fill="#3fc1a5" opacity=".9"/>
<rect x="1340" y="519" width="94" height="8" rx="4" fill="#6f7b92"/>
<rect x="1356" y="520.6" width="70" height="3" rx="1.5" fill="#f0a948" opacity=".95"/>
<circle cx="1343" cy="523" r="3.6" fill="#ff6a50"/>
<ellipse cx="1262" cy="530" rx="66" ry="9.5" fill="url(#qs-hull)"/>
<ellipse cx="1262" cy="525" rx="24" ry="4.5" fill="#a9b5ca"/>
<ellipse  cx="1262" cy="520.5" rx="7" ry="2.6" fill="#e8c37a"/>
<path d="M1198 531 L1326 531" stroke="#1d2433" stroke-width="1"/>
<circle cx="1214" cy="529.5" r=".9" fill="#ffe7b0"/><circle cx="1230" cy="530" r=".9" fill="#ffe7b0"/><circle cx="1294" cy="530" r=".9" fill="#ffe7b0"/><circle cx="1310" cy="529.5" r=".9" fill="#ffe7b0"/>
</g>
<ellipse cx="1470" cy="592" rx="70" ry="10" fill="#ffd08a" opacity=".16"/>
<path d="M1462 532 L1420 590 L1520 590 Z" fill="url(#qs-lampcone)"/>
<ellipse cx="1514" cy="590" rx="18" ry="4" fill="#3a3036"/>
<path d="M1514 588 Q1512 534 1480 520" fill="none" stroke="#8a7350" stroke-width="3" stroke-linecap="round"/>
<path d="M1454 524 L1488 508 L1496 520 L1468 538 Z" fill="#5a4a3a" stroke="#c9a560" stroke-width="1"/>
<ellipse cx="1462" cy="532" rx="9" ry="3.4" fill="#ffe2a8" transform="rotate(-28 1462 532)"/>
<!-- the chair, in front of the window -->
<ellipse cx="400" cy="714" rx="170" ry="20" fill="url(#qs-shadow)"/>
<ellipse cx="400" cy="708" rx="84" ry="12" fill="#231c21" stroke="#c9a560" stroke-opacity=".45" stroke-width="1.5"/>
<path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#qs-metal)"/>
<rect x="304" y="612" width="192" height="42" rx="18" fill="#1d1216"/>
<path d="M310 618 Q400 606 490 618" fill="none" stroke="#5a3a40" stroke-width="2" opacity=".6"/>
<path d="M322 590 L276 586 Q256 586 256 600 Q256 614 276 614 L326 618 Z" fill="url(#qs-arm)"/>
<path d="M478 590 L524 586 Q544 586 544 600 Q544 614 524 614 L474 618 Z" fill="url(#qs-arm)"/>
<path d="M262 592 L318 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M538 592 L482 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>
<rect x="268" y="598" width="11" height="4" rx="2" fill="#3fc1a5" style="opacity:var(--q-local,1)"/>
<rect x="283" y="598" width="11" height="4" rx="2" fill="#f0a948" style="opacity:var(--q-codex,1)"/>
<rect x="298" y="598" width="11" height="4" rx="2" fill="#e889b6" style="opacity:var(--q-claude,1)"/>
<rect class="sa-key" x="492" y="598" width="40" height="4" rx="2" fill="#e8c37a"/>
<path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#qs-shell)"/>
<path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#qs-shell-top)"/>
<path d="M340 628 C328 556 312 470 315 402 C318 340 356 304 400 302 C444 304 482 340 485 402 C488 470 472 556 460 628" fill="none" stroke="#c9a560" stroke-width="1.8" stroke-opacity=".7"/>
<rect x="397.5" y="350" width="5" height="250" rx="2.5" fill="#c9a560" opacity=".22"/>
<path d="M400 318 L413 346 L400 339 L387 346 Z" fill="#e8c37a"/>
<path d="M400 318 L413 346 L400 339 Z" fill="#8a6a32" opacity=".5"/>
<path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#qs-rim)" stroke-width="2.6"/>
<path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="10" stroke-linecap="round"/>
<!-- highlights -->
<g id="qs-hl-viewport" class="sa-hide"><polygon points="166,86 634,86 656,566 144,566" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#qs-blur)"/><polygon points="166,86 634,86 656,566 144,566" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="qs-hl-chair" class="sa-hide"><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#qs-blur)"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="qs-hl-reading" class="sa-hide"><rect x="22" y="78" width="114" height="522" rx="16" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#qs-blur)"/><rect x="22" y="78" width="114" height="522" rx="16" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="qs-hl-orders" class="sa-hide"><path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#qs-blur)"/><path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="qs-hl-log" class="sa-hide"><rect x="808" y="506" width="148" height="72" rx="7" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#qs-blur)"/><rect x="808" y="506" width="148" height="72" rx="7" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="qs-hl-yeoman" class="sa-hide"><path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#qs-blur)"/><path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="qs-hl-bridge" class="sa-hide"><ellipse cx="1312" cy="534" rx="128" ry="34" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#qs-blur)"/><ellipse cx="1312" cy="534" rx="128" ry="34" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<rect width="1600" height="740" fill="url(#qs-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-science.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="sc-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="sc-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="sc-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="sc-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="sc-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="sc-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sc-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="sc-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sc-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="sc-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="sc-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="sc-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="sc-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="sc-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="sc-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="sc-trim-glow"><stop offset="0" stop-color="#8fa8e0" stop-opacity=".32"/><stop offset="1" stop-color="#8fa8e0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="url(#sc-wall)"/>
<path d="M0 262 L520 262 L520 440 L0 440 Z" fill="url(#sc-floor)"/>
<ellipse cx="260" cy="270" rx="250" ry="26" fill="url(#sc-screenlight)"/>
<rect x="44" y="30" width="302" height="202" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="50" y="36" width="290" height="190" rx="12" fill="#0b1220"/>
<rect x="62" y="30" width="50" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7"/><rect x="270" y="30" width="50" height="5" rx="2.5" fill="#f0a948" opacity="0.7"/>
<line x1="70" y1="70" x2="326" y2="70" stroke="#2e4569" stroke-width=".8"/>
<line x1="70" y1="110" x2="326" y2="110" stroke="#2e4569" stroke-width=".8"/>
<line x1="70" y1="150" x2="326" y2="150" stroke="#2e4569" stroke-width=".8"/>
<line x1="70" y1="190" x2="326" y2="190" stroke="#2e4569" stroke-width=".8"/>
<path d="M70 200 L120 170 L170 150 L220 120 L270 108 L320 96" fill="none" stroke="#3fc1a5" stroke-width="2" stroke-linejoin="round" style="opacity:var(--sa-glow,1)"/>
<circle cx="70" cy="200" r="3" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<circle cx="120" cy="170" r="3" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<circle cx="170" cy="150" r="3" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<circle cx="220" cy="120" r="3" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<circle cx="270" cy="108" r="3" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<circle cx="320" cy="96" r="3" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<path d="M70 196 L120 186 L170 160 L220 150 L270 132 L320 126" fill="none" stroke="#f0a948" stroke-width="2" stroke-linejoin="round" style="opacity:var(--sa-glow,1)"/>
<circle cx="70" cy="196" r="3" fill="#f0a948" style="opacity:var(--sa-glow,1)"/>
<circle cx="120" cy="186" r="3" fill="#f0a948" style="opacity:var(--sa-glow,1)"/>
<circle cx="170" cy="160" r="3" fill="#f0a948" style="opacity:var(--sa-glow,1)"/>
<circle cx="220" cy="150" r="3" fill="#f0a948" style="opacity:var(--sa-glow,1)"/>
<circle cx="270" cy="132" r="3" fill="#f0a948" style="opacity:var(--sa-glow,1)"/>
<circle cx="320" cy="126" r="3" fill="#f0a948" style="opacity:var(--sa-glow,1)"/>
<rect x="368" y="30" width="104" height="250" rx="8" fill="#0b1220" stroke="#2e4569" stroke-width="1.4"/>
<rect x="378" y="44" width="84" height="38" rx="5" fill="#101a2e" stroke="#2e4569"/>
<circle cx="398" cy="63" r="12" fill="none" stroke="#8aa0c4" stroke-opacity=".4" stroke-dasharray="4 3" class="sa-spin" style="transform-origin:398px 63px;animation-duration:3s"/>
<g style="opacity:var(--sa-glow,1)"><rect x="420" y="54" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="432" y="54" width="8" height="4" rx="2" fill="#f0a948" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="444" y="54" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/></g>
<rect x="420" y="68" width="32" height="4" rx="2" fill="#8aa0c4" opacity=".3"/>
<rect x="378" y="90" width="84" height="38" rx="5" fill="#101a2e" stroke="#2e4569"/>
<circle cx="398" cy="109" r="12" fill="none" stroke="#8aa0c4" stroke-opacity=".4" stroke-dasharray="4 3" class="sa-spin" style="transform-origin:398px 109px;animation-duration:4s"/>
<g style="opacity:var(--sa-glow,1)"><rect x="420" y="100" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="432" y="100" width="8" height="4" rx="2" fill="#f0a948" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="444" y="100" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/></g>
<rect x="420" y="114" width="32" height="4" rx="2" fill="#8aa0c4" opacity=".3"/>
<rect x="378" y="136" width="84" height="38" rx="5" fill="#101a2e" stroke="#2e4569"/>
<circle cx="398" cy="155" r="12" fill="none" stroke="#8aa0c4" stroke-opacity=".4" stroke-dasharray="4 3" class="sa-spin" style="transform-origin:398px 155px;animation-duration:5s"/>
<g style="opacity:var(--sa-glow,1)"><rect x="420" y="146" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="432" y="146" width="8" height="4" rx="2" fill="#f0a948" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="444" y="146" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/></g>
<rect x="420" y="160" width="32" height="4" rx="2" fill="#8aa0c4" opacity=".3"/>
<rect x="378" y="182" width="84" height="38" rx="5" fill="#101a2e" stroke="#2e4569"/>
<circle cx="398" cy="201" r="12" fill="none" stroke="#8aa0c4" stroke-opacity=".4" stroke-dasharray="4 3" class="sa-spin" style="transform-origin:398px 201px;animation-duration:6s"/>
<g style="opacity:var(--sa-glow,1)"><rect x="420" y="192" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="432" y="192" width="8" height="4" rx="2" fill="#f0a948" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="444" y="192" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/></g>
<rect x="420" y="206" width="32" height="4" rx="2" fill="#8aa0c4" opacity=".3"/>
<rect x="378" y="228" width="84" height="38" rx="5" fill="#101a2e" stroke="#2e4569"/>
<circle cx="398" cy="247" r="12" fill="none" stroke="#8aa0c4" stroke-opacity=".4" stroke-dasharray="4 3" class="sa-spin" style="transform-origin:398px 247px;animation-duration:7s"/>
<g style="opacity:var(--sa-glow,1)"><rect x="420" y="238" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="432" y="238" width="8" height="4" rx="2" fill="#f0a948" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="444" y="238" width="8" height="4" rx="2" fill="#3fc1a5" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/></g>
<rect x="420" y="252" width="32" height="4" rx="2" fill="#8aa0c4" opacity=".3"/>
<path d="M40 342 L74 290 L326 290 L360 342 Z" fill="url(#sc-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M74 290 L326 290" stroke="#8fa8e0" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="40" y="342" width="320" height="12" rx="4" fill="#0b1220"/>
<rect x="120" y="270" width="16" height="26" rx="4" fill="#1a2742" stroke="#2e4569"/>
<rect x="123" y="281.7" width="10" height="13" rx="2" fill="#3fc1a5" opacity=".55" style="opacity:var(--sa-glow,1)"/>
<rect x="150" y="262" width="16" height="34" rx="4" fill="#1a2742" stroke="#2e4569"/>
<rect x="153" y="277.3" width="10" height="17" rx="2" fill="#3fc1a5" opacity=".55" style="opacity:var(--sa-glow,1)"/>
<rect x="180" y="276" width="16" height="20" rx="4" fill="#1a2742" stroke="#2e4569"/>
<rect x="183" y="285.0" width="10" height="10" rx="2" fill="#3fc1a5" opacity=".55" style="opacity:var(--sa-glow,1)"/>
<g transform="translate(230 560) scale(0.48) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#sc-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#sc-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#sc-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#8fa8e0" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#8fa8e0" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#sc-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#sc-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-screen.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="vs-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="vs-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="vs-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="vs-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="vs-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="vs-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="vs-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="vs-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="vs-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="vs-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="vs-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="vs-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="vs-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="vs-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="vs-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<linearGradient id="vs-wallpaper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1430"/><stop offset=".55" stop-color="#121a3a"/><stop offset="1" stop-color="#1c1236"/></linearGradient>
<pattern id="vs-scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" opacity=".35"/></pattern>
<linearGradient id="vs-capshell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#vs-wall)"/>
<path d="M0 300 L520 300 L520 440 L0 440 Z" fill="url(#vs-floor)"/>
<ellipse cx="260" cy="308" rx="250" ry="26" fill="url(#vs-screenlight)"/>
<rect x="24" y="16" width="472" height="276" rx="22" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<rect x="32" y="24" width="456" height="260" rx="16" fill="none" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1.2"/>
<clipPath id="vs-glass"><rect x="36" y="28" width="448" height="252" rx="12"/></clipPath>
<g clip-path="url(#vs-glass)" style="opacity:var(--sa-glow,1)"><rect x="36" y="28" width="448" height="252" fill="url(#vs-wallpaper)"/>
<circle cx="385.44" cy="93.52" r="70" fill="url(#vs-neb-teal)"/>
<rect x="74" y="68" width="210" height="132" rx="8" fill="#000" opacity=".35"/>
<rect x="70" y="62" width="210" height="132" rx="8" fill="#101a2e" stroke="#33496e"/>
<path d="M70 70 Q70 62 78 62 L272 62 Q280 62 280 70 L280 80 L70 80 Z" fill="#1a2742"/>
<circle cx="82" cy="71" r="2.6" fill="#e889b6" opacity=".8"/>
<circle cx="92" cy="71" r="2.6" fill="#f0a948" opacity=".8"/>
<circle cx="102" cy="71" r="2.6" fill="#3fc1a5" opacity=".8"/>
<rect x="82" y="92" width="94.5" height="6" rx="3" fill="#3fc1a5" opacity=".7"/>
<rect x="82" y="108" width="172.2" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="82" y="122" width="136.5" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="82" y="136" width="100.8" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="82" y="150" width="172.2" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="82" y="164" width="136.5" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="236" y="110" width="214" height="140" rx="8" fill="#000" opacity=".35"/>
<rect x="232" y="104" width="214" height="140" rx="8" fill="#101a2e" stroke="#33496e"/>
<path d="M232 112 Q232 104 240 104 L438 104 Q446 104 446 112 L446 122 L232 122 Z" fill="#1a2742"/>
<circle cx="244" cy="113" r="2.6" fill="#e889b6" opacity=".8"/>
<circle cx="254" cy="113" r="2.6" fill="#f0a948" opacity=".8"/>
<circle cx="264" cy="113" r="2.6" fill="#3fc1a5" opacity=".8"/>
<rect x="244" y="134" width="96.3" height="6" rx="3" fill="#8fa8e0" opacity=".7"/>
<rect x="244" y="150" width="175.5" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="244" y="164" width="139.1" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="244" y="178" width="102.7" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="244" y="192" width="175.5" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="244" y="206" width="139.1" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="244" y="220" width="102.7" height="4" rx="2" fill="#8aa0c4" opacity=".35"/>
<rect x="300" y="186" width="2" height="10" fill="#dfe8ff" class="sa-blink"/>
<rect x="164.0" y="250" width="192" height="22" rx="11" fill="#0a1222" stroke="#33496e" opacity=".95"/>
<rect x="176.0" y="255" width="12" height="12" rx="3.5" fill="#3fc1a5" opacity=".75"/>
<rect x="204.0" y="255" width="12" height="12" rx="3.5" fill="#8fa8e0" opacity=".75"/>
<rect x="232.0" y="255" width="12" height="12" rx="3.5" fill="#e8c37a" opacity=".75"/>
<rect x="260.0" y="255" width="12" height="12" rx="3.5" fill="#f0a948" opacity=".75"/>
<rect x="288.0" y="255" width="12" height="12" rx="3.5" fill="#e889b6" opacity=".75"/>
<rect x="316.0" y="255" width="12" height="12" rx="3.5" fill="#8aa0c4" opacity=".75"/>
<rect x="344.0" y="255" width="12" height="12" rx="3.5" fill="#3fc1a5" opacity=".75"/>
<rect x="36" y="28" width="448" height="252" fill="url(#vs-scan)" opacity=".5"/></g>
<rect x="54" y="18" width="54" height="5" rx="2.5" fill="#e8c37a" opacity=".75"/>
<circle cx="462" cy="20" r="3.5" fill="#e8c37a" class="sa-onair"/>
<rect x="402" y="18" width="48" height="5" rx="2.5" fill="#8fa8e0" opacity=".75"/>
<ellipse cx="260" cy="318" rx="250" ry="24" fill="url(#vs-screenlight)"/>
<path d="M80 352 L92 328 L188 328 L200 352 Z" fill="url(#vs-console)" stroke="#2e4569"/><rect x="80" y="352" width="120" height="9" rx="3" fill="#0b1220"/>
<path d="M320 352 L332 328 L428 328 L440 352 Z" fill="url(#vs-console)" stroke="#2e4569"/><rect x="320" y="352" width="120" height="9" rx="3" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="102" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="116" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="130" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="144" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="158" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="172" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="342" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="356" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="370" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="384" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="398" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="412" y="334" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/></g>
<g transform="translate(260 474) scale(.42) translate(-400 -716)"><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#vs-capshell)"/><path d="M340 628 C328 556 312 470 315 402 C318 340 356 304 400 302 C444 304 482 340 485 402 C488 470 472 556 460 628" fill="none" stroke="#c9a560" stroke-width="2" stroke-opacity=".6"/><path d="M400 318 L413 346 L400 339 L387 346 Z" fill="#e8c37a"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#vs-rim)" stroke-width="3"/></g>
<g transform="translate(150 470) scale(0.3) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#vs-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#vs-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#vs-seat)"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#vs-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<g transform="translate(370 470) scale(0.3) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#vs-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#vs-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#vs-seat)"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#vs-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#vs-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-security.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="sy-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="sy-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="sy-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="sy-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="sy-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="sy-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sy-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="sy-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sy-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="sy-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="sy-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="sy-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="sy-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="sy-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="sy-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="sy-trim-glow"><stop offset="0" stop-color="#8fa8e0" stop-opacity=".32"/><stop offset="1" stop-color="#8fa8e0" stop-opacity="0"/></radialGradient><linearGradient id="sy-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8c37a" stop-opacity=".12"/><stop offset="1" stop-color="#e8c37a" stop-opacity="0"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#sy-wall)"/>
<path d="M0 300 L520 300 L520 440 L0 440 Z" fill="url(#sy-floor)"/>
<ellipse cx="260" cy="308" rx="250" ry="26" fill="url(#sy-screenlight)"/>
<path d="M150 330 L150 120 Q150 70 200 70 L320 70 Q370 70 370 120 L370 330" fill="none" stroke="#1c2840" stroke-width="26"/>
<path d="M150 330 L150 120 Q150 70 200 70 L320 70 Q370 70 370 120 L370 330" fill="none" stroke="#2e4569" stroke-width="2"/>
<rect x="166" y="96" width="188" height="6" rx="3" fill="#e8c37a" opacity=".7" class="sa-scan" style="opacity:var(--sa-glow,1)"/>
<rect x="166" y="90" width="188" height="220" fill="url(#sy-beam)" style="opacity:var(--sa-glow,1)"/>
<path d="M60 340 L460 340 L480 370 L40 370 Z" fill="#141f34" stroke="#2e4569"/>
<line x1="56" y1="344" x2="52" y2="366" stroke="#2e4569"/>
<line x1="82" y1="344" x2="78" y2="366" stroke="#2e4569"/>
<line x1="108" y1="344" x2="104" y2="366" stroke="#2e4569"/>
<line x1="134" y1="344" x2="130" y2="366" stroke="#2e4569"/>
<line x1="160" y1="344" x2="156" y2="366" stroke="#2e4569"/>
<line x1="186" y1="344" x2="182" y2="366" stroke="#2e4569"/>
<line x1="212" y1="344" x2="208" y2="366" stroke="#2e4569"/>
<line x1="238" y1="344" x2="234" y2="366" stroke="#2e4569"/>
<line x1="264" y1="344" x2="260" y2="366" stroke="#2e4569"/>
<line x1="290" y1="344" x2="286" y2="366" stroke="#2e4569"/>
<line x1="316" y1="344" x2="312" y2="366" stroke="#2e4569"/>
<line x1="342" y1="344" x2="338" y2="366" stroke="#2e4569"/>
<line x1="368" y1="344" x2="364" y2="366" stroke="#2e4569"/>
<line x1="394" y1="344" x2="390" y2="366" stroke="#2e4569"/>
<line x1="420" y1="344" x2="416" y2="366" stroke="#2e4569"/>
<line x1="446" y1="344" x2="442" y2="366" stroke="#2e4569"/>
<rect x="222" y="270" width="76" height="70" rx="8" fill="#1a2742" stroke="#8fa8e0" stroke-width="1.5"/>
<g style="opacity:var(--sa-glow,1)"><rect x="234" y="284" width="12" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="252" y="284" width="12" height="4" rx="2" fill="#f0a948" opacity="0.7"/><rect x="270" y="284" width="12" height="4" rx="2" fill="#e889b6" opacity="0.9"/></g>
<rect x="234" y="300" width="52" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<circle cx="430" cy="110" r="11" fill="none" stroke="#3fc1a5" stroke-width="1.6" style="opacity:var(--sa-glow,1)"/>
<path d="M425 110 l4 4 l7 -8" fill="none" stroke="#3fc1a5" stroke-width="2" style="opacity:var(--sa-glow,1)"/>
<circle cx="430" cy="144" r="11" fill="none" stroke="#3fc1a5" stroke-width="1.6" style="opacity:var(--sa-glow,1)"/>
<path d="M425 144 l4 4 l7 -8" fill="none" stroke="#3fc1a5" stroke-width="2" style="opacity:var(--sa-glow,1)"/>
<circle cx="430" cy="178" r="11" fill="none" stroke="#3fc1a5" stroke-width="1.6" style="opacity:var(--sa-glow,1)"/>
<path d="M425 178 l4 4 l7 -8" fill="none" stroke="#3fc1a5" stroke-width="2" style="opacity:var(--sa-glow,1)"/>
<circle cx="430" cy="212" r="11" fill="none" stroke="#3fc1a5" stroke-width="1.6" style="opacity:var(--sa-glow,1)"/>
<path d="M425 212 l4 4 l7 -8" fill="none" stroke="#3fc1a5" stroke-width="2" style="opacity:var(--sa-glow,1)"/>
<rect x="60" y="104" width="60" height="6" rx="3" fill="#8aa0c4" opacity=".4"/>
<rect x="60" y="138" width="42" height="6" rx="3" fill="#8aa0c4" opacity=".4"/>
<rect x="60" y="172" width="60" height="6" rx="3" fill="#8aa0c4" opacity=".4"/>
<rect x="60" y="206" width="42" height="6" rx="3" fill="#8aa0c4" opacity=".4"/>
<rect width="520" height="440" fill="url(#sy-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-sensors.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="sn-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="sn-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="sn-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="sn-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="sn-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="sn-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sn-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="sn-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sn-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="sn-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="sn-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="sn-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="sn-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="sn-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="sn-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="sn-trim-glow"><stop offset="0" stop-color="#e889b6" stop-opacity=".32"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></radialGradient><radialGradient id="sn-scope"><stop offset="0" stop-color="#1a1030"/><stop offset="1" stop-color="#07060f"/></radialGradient><linearGradient id="sn-sweep" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#e889b6" stop-opacity=".45"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#sn-wall)"/>
<path d="M0 290 L520 290 L520 440 L0 440 Z" fill="url(#sn-floor)"/>
<ellipse cx="260" cy="298" rx="250" ry="26" fill="url(#sn-screenlight)"/>
<circle cx="260" cy="150" r="134" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<circle cx="260" cy="150" r="120" fill="url(#sn-scope)"/>
<circle cx="260" cy="150" r="40.0" fill="none" stroke="#e889b6" stroke-opacity=".25"/>
<circle cx="260" cy="150" r="80.0" fill="none" stroke="#e889b6" stroke-opacity=".25"/>
<circle cx="260" cy="150" r="120.0" fill="none" stroke="#e889b6" stroke-opacity=".25"/>
<line x1="140" y1="150" x2="380" y2="150" stroke="#e889b6" stroke-opacity=".18"/>
<line x1="260" y1="30" x2="260" y2="270" stroke="#e889b6" stroke-opacity=".18"/>
<g class="sa-spin" style="transform-origin:260px 150px;animation-duration:6s;opacity:var(--sa-glow,1)"><path d="M260 150 L380 150 A120 120 0 0 0 351.9 72.9 Z" fill="url(#sn-sweep)"/><line x1="260" y1="150" x2="380" y2="150" stroke="#e889b6" stroke-width="1.6"/></g>
<circle cx="200" cy="110" r="3.5" fill="#e8c37a" class="sa-blink" style="animation-delay:-0s;opacity:var(--sa-glow,1)"/>
<circle cx="308" cy="80" r="3.5" fill="#e889b6" class="sa-blink" style="animation-delay:-0.6s;opacity:var(--sa-glow,1)"/>
<circle cx="330" cy="180" r="3.5" fill="#e889b6" class="sa-blink" style="animation-delay:-1.2s;opacity:var(--sa-glow,1)"/>
<circle cx="230" cy="216" r="3.5" fill="#e889b6" class="sa-blink" style="animation-delay:-1.8s;opacity:var(--sa-glow,1)"/>
<circle cx="172" cy="170" r="3.5" fill="#e889b6" class="sa-blink" style="animation-delay:-2.4s;opacity:var(--sa-glow,1)"/>
<rect x="54" y="54" width="52" height="162" rx="12" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="60" y="60" width="40" height="150" rx="8" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="68" y="74" width="24" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/></g><rect x="68" y="92" width="24" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="68" y="110" width="17" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="68" y="128" width="24" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="68" y="146" width="17" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="68" y="164" width="24" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="68" y="182" width="17" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<rect x="414" y="54" width="52" height="162" rx="12" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="420" y="60" width="40" height="150" rx="8" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="428" y="74" width="24" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/></g><rect x="428" y="92" width="24" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="428" y="110" width="17" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="428" y="128" width="24" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="428" y="146" width="17" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="428" y="164" width="24" height="4" rx="2" fill="#8aa0c4" opacity=".4"/><rect x="428" y="182" width="17" height="4" rx="2" fill="#8aa0c4" opacity=".4"/>
<path d="M50 350 L84 300 L436 300 L470 350 Z" fill="url(#sn-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M84 300 L436 300" stroke="#e889b6" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="50" y="350" width="420" height="12" rx="4" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="100" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="128" y="314" width="16" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7"/><rect x="156" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/><rect x="184" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="212" y="314" width="16" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7"/><rect x="240" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/><rect x="268" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="296" y="314" width="16" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7"/><rect x="324" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/><rect x="352" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="380" y="314" width="16" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7"/><rect x="408" y="314" width="16" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/></g>
<g transform="translate(260 566) scale(0.46) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#sn-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#sn-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#sn-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#sn-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#sn-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-strategist.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="st-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="st-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="st-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="st-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="st-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="st-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="st-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="st-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="st-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="st-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="st-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="st-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="st-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="st-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="st-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="st-trim-glow"><stop offset="0" stop-color="#e889b6" stop-opacity=".32"/><stop offset="1" stop-color="#e889b6" stop-opacity="0"/></radialGradient><linearGradient id="st-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1730"/><stop offset="1" stop-color="#080e1e"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#st-wall)"/>
<path d="M0 262 L520 262 L520 440 L0 440 Z" fill="url(#st-floor)"/>
<ellipse cx="260" cy="270" rx="250" ry="26" fill="url(#st-screenlight)"/>
<rect x="44" y="24" width="432" height="226" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="50" y="30" width="420" height="214" rx="12" fill="url(#st-glass)"/>
<rect x="64" y="24" width="54" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/><rect x="400" y="24" width="54" height="5" rx="2.5" fill="#e889b6" opacity="0.7"/>
<path d="M170 92 C198 92 178 132 206 132" fill="none" stroke="#e889b6" stroke-width="1.4" stroke-dasharray="5 5" class="sa-flow" style="opacity:var(--sa-glow,1)"/>
<path d="M170 172 C198 172 178 132 206 132" fill="none" stroke="#e889b6" stroke-width="1.4" stroke-dasharray="5 5" class="sa-flow" style="opacity:var(--sa-glow,1)"/>
<path d="M298 132 C326 132 306 92 334 92" fill="none" stroke="#e889b6" stroke-width="1.4" stroke-dasharray="5 5" class="sa-flow" style="opacity:var(--sa-glow,1)"/>
<path d="M298 132 C326 132 306 172 334 172" fill="none" stroke="#e889b6" stroke-width="1.4" stroke-dasharray="5 5" class="sa-flow" style="opacity:var(--sa-glow,1)"/>
<rect x="78" y="70" width="92" height="44" rx="8" fill="#101a2e" stroke="#2e4569" stroke-width="1.4"/>
<rect x="86" y="79" width="40" height="5" rx="2.5" fill="#8fa8e0" opacity=".7"/>
<rect x="86" y="91" width="70" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".4"/>
<rect x="86" y="100" width="52" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".3"/>
<rect x="78" y="150" width="92" height="44" rx="8" fill="#101a2e" stroke="#2e4569" stroke-width="1.4"/>
<rect x="86" y="159" width="40" height="5" rx="2.5" fill="#8fa8e0" opacity=".7"/>
<rect x="86" y="171" width="70" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".4"/>
<rect x="86" y="180" width="52" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".3"/>
<rect x="206" y="110" width="92" height="44" rx="8" fill="#101a2e" stroke="#e889b6" stroke-width="1.4"/>
<rect x="214" y="119" width="40" height="5" rx="2.5" fill="#e8c37a" opacity=".7"/>
<rect x="214" y="131" width="70" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".4"/>
<rect x="214" y="140" width="52" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".3"/>
<rect x="334" y="70" width="92" height="44" rx="8" fill="#101a2e" stroke="#2e4569" stroke-width="1.4"/>
<rect x="342" y="79" width="40" height="5" rx="2.5" fill="#8fa8e0" opacity=".7"/>
<rect x="342" y="91" width="70" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".4"/>
<rect x="342" y="100" width="52" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".3"/>
<rect x="334" y="150" width="92" height="44" rx="8" fill="#101a2e" stroke="#2e4569" stroke-width="1.4"/>
<rect x="342" y="159" width="40" height="5" rx="2.5" fill="#8fa8e0" opacity=".7"/>
<rect x="342" y="171" width="70" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".4"/>
<rect x="342" y="180" width="52" height="3.5" rx="1.75" fill="#8aa0c4" opacity=".3"/>
<line x1="78" y1="222" x2="426" y2="222" stroke="#2e4569" stroke-width="2"/>
<circle cx="78" cy="222" r="5" fill="#e8c37a" stroke="#e8c37a" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="166" cy="222" r="5" fill="#e8c37a" stroke="#e8c37a" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="254" cy="222" r="5" fill="#0b1220" stroke="#e8c37a" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="342" cy="222" r="5" fill="#0b1220" stroke="#e8c37a" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<circle cx="426" cy="222" r="5" fill="#0b1220" stroke="#e8c37a" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<path d="M60 342 L94 286 L426 286 L460 342 Z" fill="url(#st-console)" stroke="#2e4569" stroke-width="1.4"/><path d="M94 286 L426 286" stroke="#e889b6" stroke-opacity=".55" stroke-width="1.5" style="opacity:var(--sa-glow,1)"/><rect x="60" y="342" width="400" height="12" rx="4" fill="#0b1220"/>
<g style="opacity:var(--sa-glow,1)"><rect x="110" y="300" width="18" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="142" y="300" width="18" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7"/><rect x="174" y="300" width="18" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/><rect x="206" y="300" width="18" height="5" rx="2.5" fill="#8fa8e0" opacity="0.5"/><rect x="238" y="300" width="18" height="5" rx="2.5" fill="#e889b6" opacity="0.7"/><rect x="270" y="300" width="18" height="5" rx="2.5" fill="#8fa8e0" opacity="0.9"/><rect x="302" y="300" width="18" height="5" rx="2.5" fill="#e889b6" opacity="0.5"/><rect x="334" y="300" width="18" height="5" rx="2.5" fill="#8fa8e0" opacity="0.7"/><rect x="366" y="300" width="18" height="5" rx="2.5" fill="#e889b6" opacity="0.9"/><rect x="398" y="300" width="18" height="5" rx="2.5" fill="#8fa8e0" opacity="0.5"/></g>
<g transform="translate(260 540) scale(0.5) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#st-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#st-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#st-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#e889b6" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#st-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#st-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-sys.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="sy8-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="sy8-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="sy8-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="sy8-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="sy8-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="sy8-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sy8-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="sy8-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="sy8-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="sy8-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="sy8-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="sy8-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="sy8-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="sy8-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="sy8-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="sy8-trim-glow"><stop offset="0" stop-color="#f0a948" stop-opacity=".32"/><stop offset="1" stop-color="#f0a948" stop-opacity="0"/></radialGradient>
</defs>
<rect width="520" height="440" fill="#0a0f1a"/>
<rect x="30" y="20" width="460" height="400" rx="60" fill="none" stroke="#24324c" stroke-width="10"/>
<rect x="62.2" y="48" width="395.6" height="344" rx="51.6" fill="none" stroke="#24324c" stroke-width="8.6"/>
<rect x="94.4" y="76" width="331.2" height="288" rx="43.2" fill="none" stroke="#24324c" stroke-width="7.2"/>
<rect x="126.6" y="104" width="266.8" height="232" rx="34.8" fill="none" stroke="#24324c" stroke-width="5.8"/>
<rect x="158.8" y="132" width="202.4" height="176" rx="26.4" fill="none" stroke="#24324c" stroke-width="4.4"/>
<rect x="191" y="160" width="138" height="120" rx="18" fill="none" stroke="#24324c" stroke-width="3"/>
<rect x="200" y="160" width="120" height="120" rx="20" fill="#05070c"/>
<rect x="210" y="170" width="100" height="100" rx="14" fill="#f0a948" opacity=".08" style="opacity:var(--sa-glow,1)"/>
<path d="M60 110 L170 140 L170 320 L60 350 Z" fill="#101826" stroke="#2e4569" stroke-width="1.5"/>
<path d="M76 140 l22 3 l0 16 l-22 -3 Z" fill="#8fa8e0" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M106 142 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M136 144 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M76 172 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M106 174 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M136 176 l22 3 l0 16 l-22 -3 Z" fill="#8fa8e0" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M76 204 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M96 206 l22 3 l0 16 l-22 -3 Z" fill="#8fa8e0" opacity="0.85" style="opacity:var(--sa-glow,1)"/>
<path d="M136 208 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M76 236 l22 3 l0 16 l-22 -3 Z" fill="#8fa8e0" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M106 238 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M136 240 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M76 268 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M106 270 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M136 272 l22 3 l0 16 l-22 -3 Z" fill="#8fa8e0" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M76 300 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M106 302 l22 3 l0 16 l-22 -3 Z" fill="#8fa8e0" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M136 304 l22 3 l0 16 l-22 -3 Z" fill="#f0a948" opacity="0.55" style="opacity:var(--sa-glow,1)"/>
<path d="M350 140 L460 110 L460 350 L350 320 Z" fill="#101826" stroke="#2e4569" stroke-width="1.5"/>
<g style="opacity:var(--sa-glow,1)"><rect x="370" y="160" width="14" height="5" rx="2.5" fill="#f0a948" opacity="0.5" class="sa-key" style="animation-delay:-0s"/><rect x="396" y="160" width="14" height="5" rx="2.5" fill="#3fc1a5" opacity="0.7" class="sa-key" style="animation-delay:-0.4s"/><rect x="422" y="160" width="14" height="5" rx="2.5" fill="#f0a948" opacity="0.9" class="sa-key" style="animation-delay:-0.7s"/></g>
<g style="opacity:var(--sa-glow,1)"><rect x="370" y="200" width="14" height="5" rx="2.5" fill="#f0a948" opacity="0.5"/><rect x="396" y="200" width="14" height="5" rx="2.5" fill="#f0a948" opacity="0.7"/><rect x="422" y="200" width="14" height="5" rx="2.5" fill="#f0a948" opacity="0.9"/></g>
<path d="M300 440 C320 380 380 360 400 300" fill="none" stroke="#3a4a68" stroke-width="6"/>
<path d="M280 440 C300 370 350 350 380 300" fill="none" stroke="#f0a948" stroke-opacity=".4" stroke-width="3" style="opacity:var(--sa-glow,1)"/>
<rect width="520" height="440" fill="url(#sy8-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-xo.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="xo-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="xo-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="xo-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="xo-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="xo-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="xo-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="xo-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="xo-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="xo-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="xo-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="xo-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="xo-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="xo-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="xo-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="xo-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<linearGradient id="xo-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2030"/><stop offset="1" stop-color="#07101c"/></linearGradient>
<linearGradient id="xo-capshell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#xo-wall)"/>
<path d="M0 250 L520 250 L520 440 L0 440 Z" fill="url(#xo-floor)"/>
<ellipse cx="260" cy="258" rx="250" ry="26" fill="url(#xo-screenlight)"/>
<rect x="22" y="10" width="476" height="214" rx="22" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<rect x="30" y="18" width="460" height="198" rx="16" fill="none" stroke="#e8c37a" stroke-opacity=".35" stroke-width="1.2"/>
<clipPath id="xo-glass"><rect x="34" y="22" width="452" height="190" rx="12"/></clipPath>
<g clip-path="url(#xo-glass)">
<rect x="34" y="22" width="452" height="190" fill="url(#xo-space)"/>
<ellipse cx="147.0" cy="88.5" rx="149.16" ry="60.800000000000004" fill="url(#xo-neb-plum)"/>
<ellipse cx="377.52" cy="155.0" rx="135.6" ry="57.0" fill="url(#xo-neb-teal)"/>
<circle cx="250.3" cy="49" r="0.9" fill="#fff1d6" opacity="0.4" class="sa-tw" style="animation-delay:-1.2s"/>
<circle cx="284.8" cy="167.6" r="1" fill="#fff1d6" opacity="0.9"/>
<circle cx="91.8" cy="203.2" r="1" fill="#ffffff" opacity="0.9"/>
<circle cx="221.8" cy="99.5" r="0.9" fill="#dfe8ff" opacity="0.7"/>
<circle cx="255.8" cy="144.3" r="0.7" fill="#fff1d6" opacity="0.9"/>
<circle cx="126.6" cy="196.2" r="1" fill="#fff1d6" opacity="0.9"/>
<circle cx="217.4" cy="156.3" r="0.6" fill="#fff1d6" opacity="0.5"/>
<circle cx="34.7" cy="122.9" r="1.4" fill="#fff1d6" opacity="0.6"/>
<circle cx="35.5" cy="205" r="1.4" fill="#dfe8ff" opacity="0.4" class="sa-tw" style="animation-delay:-0.4s"/>
<circle cx="232.4" cy="152.1" r="1" fill="#fff1d6" opacity="0.9"/>
<circle cx="458.2" cy="83.7" r="1" fill="#dfe8ff" opacity="0.8"/>
<circle cx="129.8" cy="34" r="0.7" fill="#ffffff" opacity="0.8"/>
<circle cx="424.6" cy="36.8" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="421.7" cy="84.3" r="0.7" fill="#ffffff" opacity="0.6"/>
<circle cx="466.6" cy="174.4" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="401.9" cy="166.1" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="385" cy="102.2" r="0.8" fill="#fff1d6" opacity="0.9" class="sa-tw" style="animation-delay:-5.7s"/>
<circle cx="350.6" cy="72.5" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="418.2" cy="153.7" r="0.7" fill="#fff1d6" opacity="0.7"/>
<circle cx="415.9" cy="52.4" r="1.4" fill="#fff1d6" opacity="0.8"/>
<circle cx="362.7" cy="127.2" r="0.8" fill="#ffffff" opacity="0.6"/>
<circle cx="161.8" cy="32.3" r="1.2" fill="#ffffff" opacity="0.7"/>
<circle cx="280.5" cy="44.3" r="0.7" fill="#ffffff" opacity="0.6"/>
<circle cx="42.1" cy="107.9" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="178.7" cy="100.5" r="0.7" fill="#fff1d6" opacity="0.4" class="sa-tw" style="animation-delay:-1.1s"/>
<circle cx="328.5" cy="54.4" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="210.9" cy="202.8" r="1.4" fill="#ffffff" opacity="0.7"/>
<circle cx="147.1" cy="62.2" r="1.2" fill="#dfe8ff" opacity="0.4"/>
<circle cx="184.5" cy="100.3" r="1" fill="#fff1d6" opacity="0.4"/>
<circle cx="99.6" cy="27.7" r="1.2" fill="#ffffff" opacity="0.5"/>
<circle cx="209.8" cy="176.9" r="1" fill="#fff1d6" opacity="0.8"/>
<circle cx="136.5" cy="170.5" r="1.2" fill="#ffffff" opacity="0.4"/>
<circle cx="249.9" cy="171.6" r="1" fill="#fff1d6" opacity="0.5" class="sa-tw" style="animation-delay:-3.4s"/>
<circle cx="219.9" cy="75.7" r="0.7" fill="#fff1d6" opacity="0.5"/>
<circle cx="386.6" cy="33.8" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="484.8" cy="148.6" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="178.4" cy="37.4" r="0.5" fill="#ffffff" opacity="0.4"/>
<circle cx="64.8" cy="76.7" r="0.5" fill="#ffffff" opacity="0.5"/>
<circle cx="107.1" cy="183.3" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="473.7" cy="104.3" r="1.4" fill="#dfe8ff" opacity="0.4"/>
<circle cx="43.7" cy="64.1" r="0.7" fill="#ffffff" opacity="0.9" class="sa-tw" style="animation-delay:-1.1s"/>
<circle cx="39.7" cy="39.8" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="286.2" cy="65" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="348.4" cy="116" r="0.7" fill="#dfe8ff" opacity="0.6"/>
<circle cx="372.8" cy="197" r="1.4" fill="#ffffff" opacity="0.8"/>
<circle cx="219.8" cy="200.8" r="0.8" fill="#ffffff" opacity="0.7"/>
<circle cx="139.1" cy="206.1" r="0.5" fill="#ffffff" opacity="0.8"/>
<circle cx="145.7" cy="122.4" r="0.9" fill="#ffffff" opacity="0.8"/>
<circle cx="149.9" cy="49.4" r="0.7" fill="#ffffff" opacity="0.4" class="sa-tw" style="animation-delay:-4.7s"/>
<circle cx="445.7" cy="159.1" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="60.2" cy="127.3" r="1.4" fill="#dfe8ff" opacity="0.8"/>
<circle cx="193.1" cy="60" r="0.8" fill="#dfe8ff" opacity="0.8"/>
<circle cx="346" cy="55.8" r="0.7" fill="#dfe8ff" opacity="0.8"/>
<circle cx="356" cy="102.2" r="0.7" fill="#dfe8ff" opacity="0.7"/>
<circle cx="307.5" cy="171.7" r="1.2" fill="#dfe8ff" opacity="0.6"/>
<circle cx="470.2" cy="188.3" r="1.2" fill="#fff1d6" opacity="0.7"/>
<circle cx="146" cy="165" r="0.5" fill="#ffffff" opacity="0.4" class="sa-tw" style="animation-delay:-1.2s"/>
<circle cx="114.6" cy="107.7" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="247.5" cy="109.5" r="1.2" fill="#ffffff" opacity="0.9"/>
<circle cx="381.1" cy="201.2" r="0.9" fill="#ffffff" opacity="0.9"/>
<circle cx="322.2" cy="145" r="0.5" fill="#dfe8ff" opacity="0.8"/>
<circle cx="307.2" cy="133.4" r="1.4" fill="#dfe8ff" opacity="0.8"/>
<circle cx="441.6" cy="104.9" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="426.1" cy="212" r="1.2" fill="#dfe8ff" opacity="0.5"/>
<circle cx="354.1" cy="205.8" r="1.4" fill="#dfe8ff" opacity="0.7" class="sa-tw" style="animation-delay:-2s"/>
<circle cx="248.7" cy="33.5" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="310.2" cy="126.4" r="1" fill="#dfe8ff" opacity="0.6"/>
<circle cx="359.5" cy="190.9" r="0.5" fill="#ffffff" opacity="0.8"/>
<circle cx="413.5" cy="65.7" r="0.5" fill="#ffffff" opacity="0.4"/>
<circle cx="483.1" cy="171.8" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="368.8" cy="35.6" r="1.2" fill="#dfe8ff" opacity="0.5"/>
<circle cx="468.5" cy="42" r="0.7" fill="#dfe8ff" opacity="0.8"/>
<circle cx="450.7" cy="22.4" r="1.2" fill="#dfe8ff" opacity="0.7" class="sa-tw" style="animation-delay:-2.2s"/>
<circle cx="241.2" cy="32.7" r="0.8" fill="#fff1d6" opacity="0.4"/>
<circle cx="131.2" cy="24.4" r="1.2" fill="#dfe8ff" opacity="0.7"/>
<circle cx="416" cy="68.1" r="1.4" fill="#fff1d6" opacity="0.5"/>
<circle cx="267.3" cy="23.9" r="0.9" fill="#fff1d6" opacity="0.9"/>
<circle cx="324.4" cy="170.8" r="0.6" fill="#dfe8ff" opacity="0.4"/>
<circle cx="112.7" cy="165.6" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="223.8" cy="177" r="0.5" fill="#ffffff" opacity="0.8"/>
<circle cx="151.6" cy="167.9" r="0.6" fill="#ffffff" opacity="0.7" class="sa-tw" style="animation-delay:-4.8s"/>
<circle cx="176.4" cy="113" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="462.4" cy="148.9" r="1.4" fill="#ffffff" opacity="0.7"/>
<circle cx="374.9" cy="141.2" r="0.6" fill="#dfe8ff" opacity="0.9"/>
<circle cx="49.1" cy="128.9" r="0.9" fill="#dfe8ff" opacity="0.4"/>
<circle cx="90.3" cy="178" r="0.8" fill="#dfe8ff" opacity="0.9"/>
<circle cx="79.4" cy="79.5" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="252.9" cy="102" r="0.5" fill="#fff1d6" opacity="0.5"/>
<circle cx="358.4" cy="188.5" r="0.9" fill="#dfe8ff" opacity="0.8" class="sa-tw" style="animation-delay:-3s"/>
<circle cx="230.5" cy="201.5" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="480.1" cy="56.3" r="1.4" fill="#ffffff" opacity="0.5"/>
<circle cx="336.3" cy="77.6" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="163.4" cy="90.9" r="0.8" fill="#dfe8ff" opacity="0.6"/>
<circle cx="253.2" cy="161.4" r="0.8" fill="#ffffff" opacity="0.6"/>
<circle cx="109.1" cy="50.7" r="0.7" fill="#dfe8ff" opacity="0.5"/>
<circle cx="256.5" cy="146.7" r="0.5" fill="#fff1d6" opacity="0.9"/>
<circle cx="225.9" cy="167.3" r="0.9" fill="#fff1d6" opacity="0.9" class="sa-tw" style="animation-delay:-4.2s"/>
<circle cx="425.4" cy="56.2" r="1.4" fill="#fff1d6" opacity="0.5"/>
<circle cx="439.2" cy="202.3" r="0.9" fill="#fff1d6" opacity="0.8"/>
<circle cx="354.4" cy="90.5" r="1" fill="#ffffff" opacity="0.9"/>
<circle cx="481.4" cy="46.8" r="1" fill="#fff1d6" opacity="0.5"/>
<circle cx="442.9" cy="155.9" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="215.6" cy="167.4" r="1.2" fill="#ffffff" opacity="0.8"/>
<circle cx="201.1" cy="74.1" r="0.9" fill="#ffffff" opacity="0.4"/>
<circle cx="300.6" cy="126.8" r="1" fill="#ffffff" opacity="0.5" class="sa-tw" style="animation-delay:-2.3s"/>
<circle cx="105" cy="74.3" r="0.7" fill="#fff1d6" opacity="0.6"/>
<circle cx="281.7" cy="146.2" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="376.1" cy="164.2" r="1.4" fill="#fff1d6" opacity="0.9"/>
<circle cx="319.8" cy="82.3" r="0.6" fill="#fff1d6" opacity="0.8"/>
<circle cx="113.3" cy="90.1" r="1.2" fill="#fff1d6" opacity="0.6"/>
<g class="sa-streaks" style="opacity:var(--sa-burn,0)"><line class="sa-streak" x1="0" y1="59.9" x2="68.3" y2="59.9" stroke="url(#xo-streak)" stroke-width="1.3" opacity="0.4" style="animation-duration:6.2s;animation-delay:-7s"/><line class="sa-streak" x1="0" y1="119.8" x2="68.9" y2="119.8" stroke="url(#xo-streak)" stroke-width="0.8" opacity="0.4" style="animation-duration:7s;animation-delay:-3.3s"/><line class="sa-streak" x1="0" y1="88" x2="54" y2="88" stroke="url(#xo-streak)" stroke-width="1.2" opacity="0.3" style="animation-duration:5.9s;animation-delay:-4.7s"/><line class="sa-streak" x1="0" y1="101.2" x2="62.8" y2="101.2" stroke="url(#xo-streak)" stroke-width="1.4" opacity="0.5" style="animation-duration:7.6s;animation-delay:-3.6s"/><line class="sa-streak" x1="0" y1="122.6" x2="43.3" y2="122.6" stroke="url(#xo-streak)" stroke-width="1" opacity="0.4" style="animation-duration:5.8s;animation-delay:-0.2s"/><line class="sa-streak" x1="0" y1="53.8" x2="40.2" y2="53.8" stroke="url(#xo-streak)" stroke-width="1.4" opacity="0.5" style="animation-duration:5.6s;animation-delay:-3.7s"/><line class="sa-streak" x1="0" y1="65.5" x2="81.2" y2="65.5" stroke="url(#xo-streak)" stroke-width="1.2" opacity="0.3" style="animation-duration:7.5s;animation-delay:-6.2s"/><line class="sa-streak" x1="0" y1="189.4" x2="64.1" y2="189.4" stroke="url(#xo-streak)" stroke-width="1.2" opacity="0.3" style="animation-duration:5.8s;animation-delay:-5.1s"/><line class="sa-streak" x1="0" y1="74.3" x2="74.9" y2="74.3" stroke="url(#xo-streak)" stroke-width="1.2" opacity="0.4" style="animation-duration:5.6s;animation-delay:-4.5s"/><line class="sa-streak" x1="0" y1="144.1" x2="75.2" y2="144.1" stroke="url(#xo-streak)" stroke-width="1.4" opacity="0.4" style="animation-duration:4.9s;animation-delay:-1.2s"/><line class="sa-streak" x1="0" y1="164.3" x2="71.6" y2="164.3" stroke="url(#xo-streak)" stroke-width="1" opacity="0.5" style="animation-duration:7.8s;animation-delay:-6.2s"/><line class="sa-streak" x1="0" y1="135.2" x2="38.7" y2="135.2" stroke="url(#xo-streak)" stroke-width="1.1" opacity="0.5" style="animation-duration:6.3s;animation-delay:-0.9s"/><line class="sa-streak" x1="0" y1="116.4" x2="85.3" y2="116.4" stroke="url(#xo-streak)" stroke-width="1" opacity="0.5" style="animation-duration:5.3s;animation-delay:-5s"/><line class="sa-streak" x1="0" y1="75.9" x2="43" y2="75.9" stroke="url(#xo-streak)" stroke-width="0.8" opacity="0.5" style="animation-duration:5.6s;animation-delay:-6.6s"/><line class="sa-streak" x1="0" y1="195.3" x2="63.5" y2="195.3" stroke="url(#xo-streak)" stroke-width="0.9" opacity="0.6" style="animation-duration:4s;animation-delay:-5.4s"/><line class="sa-streak" x1="0" y1="104.6" x2="71.5" y2="104.6" stroke="url(#xo-streak)" stroke-width="0.8" opacity="0.3" style="animation-duration:5.7s;animation-delay:-5.8s"/></g>

<path d="M34 42 L154 22 L204 22 L34 82 Z" fill="#fff" opacity=".035"/>
</g>
<rect x="52" y="12" width="54" height="5" rx="2.5" fill="#e8c37a" opacity=".75"/>
<rect x="414" y="12" width="54" height="5" rx="2.5" fill="#8fa8e0" opacity=".75"/>
<path d="M70 280 L84 258 L200 258 L214 280 Z" fill="url(#xo-console)" stroke="#2e4569"/>
<g style="opacity:var(--sa-glow,1)"><rect x="96" y="264" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="112" y="264" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="128" y="264" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/><rect x="144" y="264" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.5"/><rect x="160" y="264" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.7"/><rect x="176" y="264" width="9" height="4" rx="2" fill="#3fc1a5" opacity="0.9"/></g>
<path d="M-20 440 C10 360 150 322 300 322 C420 322 520 352 540 400" fill="none" stroke="#2e4569" stroke-width="2"/>
<path d="M-8 440 C24 370 156 334 300 334 C414 334 512 362 532 410" fill="none" stroke="#e8c37a" stroke-opacity=".22" stroke-width="1.2"/>
<g transform="translate(88 470) scale(.5) translate(-400 -716)" opacity=".7"><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#xo-capshell)"/><path d="M340 628 C328 556 312 470 315 402 C318 340 356 304 400 302 C444 304 482 340 485 402 C488 470 472 556 460 628" fill="none" stroke="#c9a560" stroke-width="2" stroke-opacity=".55"/><path d="M400 318 L413 346 L400 339 L387 346 Z" fill="#e8c37a" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#xo-rim)" stroke-width="3"/></g>
<g transform="translate(410 512) scale(0.52) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#xo-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#xo-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#xo-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#xo-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<path d="M252.0 334 L272.0 334 L346.0 440 L320.0 440 Z" fill="url(#xo-console)" stroke="#2e4569"/>
<rect x="164" y="222" width="196" height="112" rx="12" fill="#081220" stroke="#2e4569" stroke-width="1.6"/>
<rect x="168" y="226" width="188" height="104" rx="9" fill="url(#xo-panel)"/>
<rect x="176" y="232" width="44" height="4" rx="2" fill="#e8c37a" opacity=".7"/>
<g style="opacity:var(--sa-glow,1)"><path d="M262 308 L179.3 284.1" stroke="#3fc1a5" stroke-width="1.3" opacity=".5"/><path d="M262 308 L179.3 284.1" stroke="#3fc1a5" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-0s"/><circle cx="179.3" cy="284.1" r="4.5" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.5"/><path d="M262 308 L192.2 265.4" stroke="#3fc1a5" stroke-width="1.3" opacity=".5"/><path d="M262 308 L192.2 265.4" stroke="#3fc1a5" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-0.4s"/><circle cx="192.2" cy="265.4" r="4.5" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.5"/><path d="M262 308 L211.5 250.7" stroke="#f0a948" stroke-width="1.3" opacity=".5"/><path d="M262 308 L211.5 250.7" stroke="#f0a948" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-0.9s"/><circle cx="211.5" cy="250.7" r="4.5" fill="#0b1220" stroke="#f0a948" stroke-width="1.5"/><path d="M262 308 L235.5 241.2" stroke="#3fc1a5" stroke-width="1.3" opacity=".5"/><path d="M262 308 L235.5 241.2" stroke="#3fc1a5" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-1.3s"/><circle cx="235.5" cy="241.2" r="4.5" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.5"/><path d="M262 308 L262 238" stroke="#e889b6" stroke-width="1.3" opacity=".5"/><path d="M262 308 L262 238" stroke="#e889b6" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-1.7s"/><circle cx="262" cy="238" r="4.5" fill="#0b1220" stroke="#e889b6" stroke-width="1.5"/><path d="M262 308 L288.5 241.2" stroke="#3fc1a5" stroke-width="1.3" opacity=".5"/><path d="M262 308 L288.5 241.2" stroke="#3fc1a5" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-2.1s"/><circle cx="288.5" cy="241.2" r="4.5" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.5"/><path d="M262 308 L312.5 250.7" stroke="#f0a948" stroke-width="1.3" opacity=".5"/><path d="M262 308 L312.5 250.7" stroke="#f0a948" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-2.6s"/><circle cx="312.5" cy="250.7" r="4.5" fill="#0b1220" stroke="#f0a948" stroke-width="1.5"/><path d="M262 308 L331.8 265.4" stroke="#3fc1a5" stroke-width="1.3" opacity=".5"/><path d="M262 308 L331.8 265.4" stroke="#3fc1a5" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-3s"/><circle cx="331.8" cy="265.4" r="4.5" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.5"/><path d="M262 308 L344.7 284.1" stroke="#3fc1a5" stroke-width="1.3" opacity=".5"/><path d="M262 308 L344.7 284.1" stroke="#3fc1a5" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 120" class="sa-route" style="animation-delay:-3.4s"/><circle cx="344.7" cy="284.1" r="4.5" fill="#0b1220" stroke="#3fc1a5" stroke-width="1.5"/></g>
<circle cx="262" cy="308" r="11" fill="url(#xo-teal-glow)" style="opacity:var(--sa-glow,1)"/>
<circle cx="262" cy="308" r="6" fill="#3fc1a5" style="opacity:var(--sa-glow,1)"/>
<circle cx="262" cy="308" r="6" fill="none" stroke="#3fc1a5" class="sa-ping" style="transform-origin:262px 308px"/>
<rect width="520" height="440" fill="url(#xo-vignette)" pointer-events="none"/>
</svg>
`,"../assets/station-yeoman.svg":`<svg class="station-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="ye-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#0c1526"/></linearGradient>
<linearGradient id="ye-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#131c2e"/><stop offset="1" stop-color="#060a12"/></linearGradient>
<linearGradient id="ye-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050815"/><stop offset=".6" stop-color="#0a0f22"/><stop offset="1" stop-color="#10091a"/></linearGradient>
<radialGradient id="ye-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="ye-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="ye-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ye-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="ye-screenlight"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".14"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></radialGradient>
<linearGradient id="ye-console" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2840"/><stop offset="1" stop-color="#0c1322"/></linearGradient>
<linearGradient id="ye-seat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c111c"/><stop offset=".35" stop-color="#25304a"/><stop offset="1" stop-color="#0a0e18"/></linearGradient>
<linearGradient id="ye-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="ye-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="ye-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="ye-teal-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".35"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient>
<radialGradient id="ye-vignette" cx=".5" cy=".42" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
<radialGradient id="ye-trim-glow"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".32"/><stop offset="1" stop-color="#3fc1a5" stop-opacity="0"/></radialGradient><linearGradient id="ye-padd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3fc1a5" stop-opacity=".8"/><stop offset="1" stop-color="#3fc1a5" stop-opacity=".45"/></linearGradient>
</defs>
<rect width="520" height="440" fill="url(#ye-wall)"/>
<path d="M0 262 L520 262 L520 440 L0 440 Z" fill="url(#ye-floor)"/>
<ellipse cx="260" cy="270" rx="250" ry="26" fill="url(#ye-screenlight)"/>
<rect x="54" y="30" width="262" height="212" rx="16" fill="#0b1220" stroke="#2e4569" stroke-width="1.6"/><rect x="60" y="36" width="250" height="200" rx="12" fill="#0b1220"/>
<rect x="72" y="30" width="50" height="5" rx="2.5" fill="#e8c37a" opacity="0.7"/>
<rect x="82" y="64" width="14" height="14" rx="3.5" fill="#3fc1a5" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<path d="M85 71 l3 3 l6 -6" fill="none" stroke="#0b1220" stroke-width="1.8"/>
<rect x="106" y="68" width="150" height="5" rx="2.5" fill="#8aa0c4" opacity="0.25"/>
<rect x="82" y="92" width="14" height="14" rx="3.5" fill="#3fc1a5" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<path d="M85 99 l3 3 l6 -6" fill="none" stroke="#0b1220" stroke-width="1.8"/>
<rect x="106" y="96" width="120" height="5" rx="2.5" fill="#8aa0c4" opacity="0.25"/>
<rect x="82" y="120" width="14" height="14" rx="3.5" fill="none" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<rect x="106" y="124" width="90" height="5" rx="2.5" fill="#8aa0c4" opacity="0.55"/>
<rect x="82" y="148" width="14" height="14" rx="3.5" fill="#3fc1a5" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<path d="M85 155 l3 3 l6 -6" fill="none" stroke="#0b1220" stroke-width="1.8"/>
<rect x="106" y="152" width="150" height="5" rx="2.5" fill="#8aa0c4" opacity="0.25"/>
<rect x="82" y="176" width="14" height="14" rx="3.5" fill="none" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<rect x="106" y="180" width="120" height="5" rx="2.5" fill="#8aa0c4" opacity="0.55"/>
<rect x="82" y="204" width="14" height="14" rx="3.5" fill="none" stroke="#3fc1a5" stroke-width="1.4" style="opacity:var(--sa-glow,1)"/>
<rect x="106" y="208" width="90" height="5" rx="2.5" fill="#8aa0c4" opacity="0.55"/>
<circle cx="390" cy="120" r="70" fill="#0b1220" stroke="#2e4569" stroke-width="2"/>
<line x1="390" y1="62" x2="390" y2="56" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="419" y1="69.8" x2="422" y2="64.6" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="440.2" y1="91" x2="445.4" y2="88" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="448" y1="120" x2="454" y2="120" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="440.2" y1="149" x2="445.4" y2="152" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="419" y1="170.2" x2="422" y2="175.4" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="390" y1="178" x2="390" y2="184" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="361" y1="170.2" x2="358" y2="175.4" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="339.8" y1="149" x2="334.6" y2="152" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="332" y1="120" x2="326" y2="120" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="339.8" y1="91" x2="334.6" y2="88" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<line x1="361" y1="69.8" x2="358" y2="64.6" stroke="#8aa0c4" stroke-opacity=".5" stroke-width="1.4"/>
<path d="M390 72 A48 48 0 0 1 431.6 144" fill="none" stroke="#e8c37a" stroke-width="4" stroke-linecap="round" style="opacity:var(--sa-glow,1)"/>
<line x1="390" y1="120" x2="390" y2="80" stroke="#dfe8ff" stroke-width="2" stroke-linecap="round" class="sa-spin" style="transform-origin:390px 120px"/>
<circle cx="390" cy="120" r="4" fill="#e8c37a"/>
<path d="M30 330 L80 280 L440 280 L490 330 Z" fill="url(#ye-console)" stroke="#2e4569" stroke-width="1.4"/>
<rect x="30" y="330" width="460" height="12" rx="4" fill="#0b1220"/>
<path d="M150 304 l70 -4 l10 14 l-70 4 Z" fill="#1a2742" stroke="#2e4569"/>
<path d="M154 298 l70 -4 l10 14 l-70 4 Z" fill="#1a2742" stroke="#2e4569"/>
<path d="M158 292 l70 -4 l10 14 l-70 4 Z" fill="#1a2742" stroke="#2e4569"/>
<path d="M158 292 l70 -4 l10 14 l-70 4 Z" fill="url(#ye-padd)" style="opacity:var(--sa-glow,1)"/>
<rect x="330" y="290" width="30" height="20" rx="4" fill="#1a2742" stroke="#2e4569"/>
<g transform="translate(260 560) scale(0.5) translate(-400 -714)"><ellipse cx="400" cy="714" rx="150" ry="18" fill="url(#ye-shadow)"/><path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#ye-metal)"/><rect x="310" y="612" width="180" height="40" rx="18" fill="#141b2a"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#ye-seat)"/><path d="M318 470 C314 420 322 352 358 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M482 470 C486 420 478 352 442 316" fill="none" stroke="#3fc1a5" stroke-width="3" stroke-linecap="round" style="opacity:var(--sa-glow,1)" opacity=".8"/><path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#ye-rim)" stroke-width="3"/><path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="10" stroke-linecap="round"/></g>
<rect width="520" height="440" fill="url(#ye-vignette)" pointer-events="none"/>
</svg>
`})).map(([e,t])=>[e.replace(/^.*station-(.+)\.svg$/,`$1`),t])),qe=e=>e in Ke,Je=e=>e.data.rails.rails.some(t=>t.burn?.active&&e.rail(t.id)!==`out`),Ye=(e,t)=>e.off(t)?.25:t.status===`live`?1:.45;function Xe({ship:e,st:t}){let n={"--sa-glow":Ye(e,t),"--sa-burn":+!!Je(e)},r=(0,l.useMemo)(()=>(0,E.jsx)(`div`,{className:`cchair-svg`,dangerouslySetInnerHTML:{__html:Ke[t.id]}}),[t.id]);return(0,E.jsx)(`div`,{className:`cchair-art station-art-wrap`,style:n,children:r})}var Ze=e=>e,Qe=M.icons;function $e(){return(0,l.useMemo)(()=>(0,E.jsx)(`div`,{className:`cchair-svg`,dangerouslySetInnerHTML:{__html:We}}),[])}function et({ship:e,onPick:t,onBack:n,onQuarters:r}){let[i,a]=(0,l.useState)(0),o=e.station(`captain`),s=e.data.orders.orders.filter(e=>e.state===`awaiting-captain`).sort((e,t)=>t.tier-e.tier),c=Je(e),u=Ze({"--q-local":e.rail(`local`)===`out`?.12:1,"--q-codex":e.rail(`codex`)===`out`?.12:1,"--q-claude":e.rail(`claude`)===`out`?.12:1,"--bc-burn":+!!c}),d=o&&(0,E.jsx)(Ge,{pages:[`The chair`,`Station card`],page:i,onPage:a});return i===1&&o?(0,E.jsx)(`section`,{className:`console cchair`,role:`region`,"aria-label":`The Captain's station card`,style:Ze({"--c":`var(--captain)`}),children:(0,E.jsx)(Ct,{ship:e,st:o,back:`‹ Watch`,onBack:n,actions:d,onQuarters:r})}):(0,E.jsxs)(`section`,{className:`console cchair`,role:`region`,"aria-label":`The Captain's chair`,style:Ze({"--c":`var(--captain)`}),children:[(0,E.jsx)(vt,{icon:Qe.captain,title:`The Captain's chair`,back:`‹ Watch`,onBack:n,sub:`BRIDGE · YOU HAVE THE CONN${c?` · BURN ON`:``}`,children:d}),(0,E.jsxs)(`div`,{className:`cchair-body`,children:[(0,E.jsx)(`div`,{className:`cchair-art`,style:u,children:(0,E.jsx)($e,{})}),(0,E.jsxs)(`div`,{className:`cchair-side`,children:[(0,E.jsx)(`span`,{className:`cchair-count mono`,children:s.length?`${s.length} HAILS WAIT FOR YOU`:`NOTHING WAITS FOR YOU`}),(0,E.jsx)(`ul`,{className:`cchair-hails`,children:s.map(e=>(0,E.jsx)(`li`,{children:(0,E.jsxs)(`button`,{type:`button`,className:`cchair-hail`,style:Ze({"--c":`var(--tier-${e.tier})`}),onClick:()=>t(e.station,e.id,`captain`),title:`${e.id} · ${e.title}`,children:[(0,E.jsxs)(`span`,{className:`tierpill`,children:[`TIER `,e.tier]}),(0,E.jsx)(`span`,{className:`cchair-hail-title`,children:e.title})]})},e.id))}),(0,E.jsxs)(`div`,{className:`cchair-foot`,children:[r&&(0,E.jsx)(`button`,{type:`button`,className:`btn btn-gold`,onClick:r,children:`To your Quarters`}),(0,E.jsx)(`span`,{className:`con-hint`,children:`Approve and Deny open in H4, in your Quarters.`})]})]})]})]})}var tt=M.icons;function nt({ship:e,dept:t,onPick:n,onBack:r}){let i=S.find(e=>e.id===t);if(!i)return null;let a=e.data.stations.stations.filter(e=>e.dept===i.id).sort((e,t)=>Number(!!t.head)-Number(!!e.head)||x[e.rank].order-x[t.rank].order),o=a.find(e=>e.head),s=e.station(`captain`),c=e.station(`xo`),l=e.acting[i.id],u=[];if(i.id===`command`)for(let e of a)u.push([e,e.head?0:e.id===`xo`?1:2,e.head?`COMMANDS THE SHIP`:e.id===`xo`?`SECOND IN COMMAND`:``]);else{s&&u.push([s,0,`COMMANDS THE SHIP`]),c&&o?.answersTo?.startsWith(`Number One`)&&u.push([c,1,`RUNS THE BRIDGE`]);for(let e of a)u.push([e,e.head?2:3,e.head?`HEAD`:``])}let d=o&&le(a,()=>null),f=i.id===`command`?`Number One takes the bridge when the Captain clocks out.`:l===`dark`?`${o?.short} is off duty and nobody can act: ${i.name} is dark.`:l?`${o?.short} is off duty: ${e.station(l)?.short} has ${i.name}.`:d?`If ${o?.short} goes off duty, ${d.short} (${x[d.rank].label}) takes ${i.name}.`:`If ${o?.short} goes off duty, nobody can act: ${i.name} goes dark.`,p=a.filter(t=>t.status===`live`&&!e.off(t)).length;return(0,E.jsxs)(`section`,{className:`console chain-con`,role:`region`,"aria-label":`${i.name} chain of command`,style:{"--c":i.uniform},children:[(0,E.jsx)(vt,{icon:o?tt[o.id]:void 0,title:i.name,back:`‹ Watch`,onBack:r,sub:`CHAIN OF COMMAND · ${p} OF ${a.length} ON DUTY`}),(0,E.jsx)(`div`,{className:`con-body`,children:(0,E.jsx)(`ol`,{className:`chain`,children:u.map(([t,r,i])=>{let a=e.off(t),o=[i,l===t.id?`ACTING HEAD`:``,a?`OFF · ${a.toUpperCase()}`:``,t.status===`live`?``:b[t.status].label].filter(Boolean);return(0,E.jsx)(`li`,{style:{"--lvl":r},children:(0,E.jsxs)(`button`,{type:`button`,className:`chain-row`+(a||t.status!==`live`?` off`:``),onClick:()=>n(t.id),style:{"--c":T(t.rail),borderLeftStyle:b[t.status].line},title:`${t.name} · answers to ${t.answersTo??`nobody`}`,children:[(0,E.jsx)(`span`,{className:`chain-pips`,children:x[t.rank].officer?(0,E.jsx)(A,{rank:t.rank}):(0,E.jsx)(`span`,{className:`dot`})}),(0,E.jsx)(`span`,{className:`chain-name`,children:t.short}),(0,E.jsx)(`span`,{className:`chain-rank`,children:x[t.rank].label}),(0,E.jsx)(`span`,{className:`chain-tags mono`,children:o.join(` · `)})]})},t.id)})})}),(0,E.jsx)(`p`,{className:`chain-cover`,children:f})]})}var rt=e=>e,it=e=>`05-${String(e).padStart(2,`0`)}`,at=e=>e.charAt(0).toUpperCase()+e.slice(1);function ot({ship:e,id:t}){let n=e.station(t);return(0,E.jsxs)(`span`,{className:`place-who`,style:rt({"--c":T(n?.rail??`mixed`)}),children:[(0,E.jsx)(`i`,{}),n?.short??t]})}function st({ship:e}){let t=e.data.stations.stations,n=t.filter(t=>Pe(t)&&t.id!==`captain`&&e.off(t)),r=e.data.shiplog.entries.filter(e=>e.kind===`duty`);return(0,E.jsxs)(`div`,{className:`con-body svc`,children:[(0,E.jsxs)(`span`,{className:`cchair-count mono`,children:[`IN QUARTERS NOW · `,n.length||`NOBODY`]}),n.length>0&&(0,E.jsx)(`ul`,{className:`svc-log place-log`,children:n.map(n=>(0,E.jsxs)(`li`,{children:[(0,E.jsxs)(`span`,{className:`idtag`,children:[`CABIN `,it(Ie(n.id,t).n)]}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(ot,{ship:e,id:n.id}),e.off(n)]})]},n.id))}),(0,E.jsxs)(`span`,{className:`cchair-count mono`,children:[`CHECK-INS AND CHECK-OUTS · `,r.length||`NONE YET`]}),r.length>0&&(0,E.jsx)(`ol`,{className:`svc-log place-log`,children:r.map(n=>(0,E.jsxs)(`li`,{children:[(0,E.jsx)(`time`,{className:`idtag`,dateTime:n.at,children:D(n.at).toUpperCase()}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`span`,{className:`place-dir ${n.dir}`,children:n.dir===`out`?`IN · ${it(Ie(n.station,t).n)}`:`OUT`}),(0,E.jsx)(ot,{ship:e,id:n.station}),at(n.text.replace(/^(To quarters|Back at the post): /,``))]})]},n.at+n.station))})]})}function ct({ship:e}){let t=e.data.shiplog.entries.filter(e=>e.kind===`briefing`),n=(e,t)=>t?Math.round((Date.parse(t)-Date.parse(e))/6e4):0;return(0,E.jsxs)(`div`,{className:`con-body svc`,children:[(0,E.jsxs)(`span`,{className:`cchair-count mono`,children:[`MEETINGS · `,t.length||`NONE YET`,` · MINUTES BY THE SHIP'S COMPUTER`]}),t.length>0&&(0,E.jsx)(`ol`,{className:`meet-list`,children:t.map(t=>(0,E.jsxs)(`li`,{className:`meet`,children:[(0,E.jsxs)(`div`,{className:`meet-head`,children:[(0,E.jsx)(`span`,{className:`svc-title`,children:at(t.text.replace(/^Briefing: /,``))}),(0,E.jsxs)(`time`,{className:`idtag`,dateTime:t.at,children:[D(t.at).toUpperCase(),t.ends?`–${ge(t.ends)} · ${n(t.at,t.ends)} MIN`:``]})]}),(0,E.jsx)(`div`,{className:`meet-who`,"aria-label":`Attended`,children:(t.attendees??[]).map(t=>(0,E.jsx)(ot,{ship:e,id:t},t))}),t.outcome&&(0,E.jsx)(`p`,{className:`meet-outcome`,children:t.outcome})]},t.at))})]})}var lt=M.icons,ut={crewq:`Duty log`,lounge:`Meetings`};function dt({ship:e,st:t,orderId:n,back:r,onBack:i,onQuarters:a,relief:o}){let[s,c]=(0,l.useState)(0),[u,d]=(0,l.useState)(n),f=[`The station`,`Station card`,ut[t.id]??`Service log`],p=(0,E.jsx)(Ge,{pages:f,page:s,onPage:c}),m=(0,E.jsx)(vt,{icon:lt[t.id],title:t.name,sub:yt(t),back:r,onBack:i,children:p});return(0,E.jsxs)(`section`,{className:`console scene`,role:`region`,"aria-label":`${t.name} console`,style:{"--c":_t(t)},children:[s===1&&(0,E.jsx)(Ct,{ship:e,st:t,orderId:u,back:r,onBack:i,actions:p,onQuarters:a,relief:o}),s===2&&(0,E.jsxs)(E.Fragment,{children:[m,t.id===`crewq`?(0,E.jsx)(st,{ship:e}):t.id===`lounge`?(0,E.jsx)(ct,{ship:e}):(0,E.jsx)(ft,{ship:e,st:t,picked:u,onOrder:e=>{d(e),c(0)}})]}),s===0&&(0,E.jsxs)(E.Fragment,{children:[m,(0,E.jsxs)(`div`,{className:`cchair-body`,children:[(0,E.jsx)(Xe,{ship:e,st:t}),(0,E.jsxs)(`div`,{className:`station-side`,children:[(0,E.jsx)(bt,{ship:e,st:t}),(0,E.jsxs)(`div`,{className:`con-body`,children:[u??t.activeOrder?(0,E.jsx)(xt,{ship:e,st:t,orderId:u}):(0,E.jsx)(`span`,{className:`cchair-count mono`,children:`NO ORDER AT THIS STATION`}),(0,E.jsx)(`p`,{className:`con-text station-duty`,children:t.duty})]}),(0,E.jsx)(St,{st:t,onQuarters:a,relief:o})]})]})]})]})}function ft({ship:e,st:t,picked:n,onOrder:r}){let i=e.data.orders.orders.filter(e=>e.station===t.id).sort((e,t)=>t.updatedAt.localeCompare(e.updatedAt)),a=e.data.shiplog.entries.filter(e=>e.station===t.id||e.attendees?.includes(t.id));return(0,E.jsxs)(`div`,{className:`con-body svc`,children:[(0,E.jsxs)(`span`,{className:`cchair-count mono`,children:[`ORDERS · `,i.length||`NONE YET`]}),i.length>0&&(0,E.jsx)(`ul`,{className:`svc-list`,children:i.map(e=>{let t=e.state===`awaiting-captain`?`waits for you`:e.state;return(0,E.jsx)(`li`,{children:(0,E.jsxs)(`button`,{type:`button`,className:`svc-row`,"aria-pressed":n===e.id,onClick:()=>r(e.id),title:`${e.id} · ${e.title}`,children:[(0,E.jsx)(`span`,{className:`statepill ${e.state}`,children:t.toUpperCase()}),(0,E.jsx)(`span`,{className:`svc-title`,children:e.title}),(0,E.jsxs)(`span`,{className:`idtag`,children:[e.id,` · `,D(e.updatedAt).toUpperCase()]})]})},e.id)})}),(0,E.jsxs)(`span`,{className:`cchair-count mono`,children:[`SHIP'S LOG · `,a.length||`NOTHING YET`]}),a.length>0&&(0,E.jsx)(`ol`,{className:`svc-log`,children:a.map(e=>(0,E.jsxs)(`li`,{children:[(0,E.jsx)(`time`,{className:`idtag`,dateTime:e.at,children:D(e.at).toUpperCase()}),(0,E.jsx)(`span`,{children:e.text})]},e.at+e.text))})]})}var pt=e=>e,mt=M.icons;function ht(e,t){(0,l.useEffect)(()=>{if(!e)return;let n=e=>{e.key===`Escape`&&t()};return document.addEventListener(`keydown`,n),()=>document.removeEventListener(`keydown`,n)},[e,t])}function gt({ship:e,pick:t,onPick:n,onDept:r,onBack:i,onQuarters:a,onRelieve:o}){let s=t?.from?.startsWith(`dept:`)?t.from.slice(5):void 0,c=t?.from&&!s?e.station(t.from):void 0,u=(0,l.useCallback)(()=>{s&&r?r(s):c?n(c.id):i()},[s,c,r,n,i]);if(ht(!!t,u),t?.dept)return(0,E.jsx)(nt,{ship:e,dept:t.dept,onBack:i,onPick:e=>n(e,void 0,`dept:${t.dept}`)});let d=t?.station?e.station(t.station):void 0;if(!d)return(0,E.jsx)(wt,{ship:e,onPick:n});if(d.id===`captain`)return(0,E.jsx)(et,{ship:e,onPick:n,onBack:i,onQuarters:a});let f=s?`‹ Chain`:c?`‹ ${c.id===`captain`?`Chair`:c.short}`:`‹ Watch`,p=o&&ae(d)?{on:e.relieved.has(d.id),toggle:()=>o(d.id)}:void 0;return qe(d.id)?(0,E.jsx)(dt,{ship:e,st:d,orderId:t?.order,back:f,onBack:u,onQuarters:a,relief:p},d.id):(0,E.jsx)(`section`,{className:`console`,role:`region`,"aria-label":`${d.name} console`,style:pt({"--c":_t(d)}),children:(0,E.jsx)(Ct,{ship:e,st:d,orderId:t?.order,back:f,onBack:u,relief:p})})}function _t(e){return e.kind===`place`?`var(--border-strong)`:T(e.rail)}function vt({icon:e,title:t,sub:n,back:r,onBack:i,children:a}){return(0,E.jsxs)(`div`,{className:`con-head`,children:[(0,E.jsx)(`span`,{className:`con-icon`,children:(0,E.jsx)(ke,{path:e})}),(0,E.jsxs)(`span`,{className:`con-titles`,children:[(0,E.jsx)(`span`,{className:`con-title`,children:t}),(0,E.jsx)(`span`,{className:`con-sub mono`,children:n})]}),a,i&&(0,E.jsx)(`button`,{type:`button`,className:`con-back`,onClick:i,title:`Back (Esc)`,children:r})]})}function yt(e){let t=S.find(t=>t.id===e.dept);return`DECK ${e.deck} · ${ee[e.deck-1].toUpperCase()}${t?` · ${t.name.toUpperCase()}`:``}`}function bt({ship:e,st:t}){let n=e.off(t);return(0,E.jsxs)(`div`,{className:`con-pills`,children:[(0,E.jsx)(`span`,{className:`railpill`,style:pt({"--c":T(t.rail)}),children:y[t.rail].label}),(0,E.jsx)(`span`,{className:`railpill`,style:pt({"--c":`var(--text-label)`,borderStyle:b[t.status].line}),children:b[t.status].label}),(0,E.jsx)(`span`,{className:`railpill`,style:pt({"--c":`var(--text-label)`}),children:x[t.rank].label.toUpperCase()}),n&&(0,E.jsxs)(`span`,{className:`railpill`,style:pt({"--c":`var(--bad)`}),children:[`OFF · `,n.toUpperCase()]}),e.actingFor(t.id)&&(0,E.jsx)(`span`,{className:`railpill`,style:pt({"--c":`var(--captain)`}),children:`ACTING HEAD`})]})}function xt({ship:e,st:t,orderId:n}){let r=e.off(t),i=n??t.activeOrder,a=i?e.data.orders.orders.find(e=>e.id===i):void 0;return a?(0,E.jsxs)(`div`,{className:`con-order`,style:pt({"--c":`var(--tier-${a.tier})`}),children:[(0,E.jsxs)(`span`,{className:`idtag`,children:[a.id,` · `,r?`WAITS, ${r.toUpperCase()}`:a.state.toUpperCase(),` · TIER `,a.tier,a.speed?` · ${a.speed.toUpperCase()}`:``,` · `,ye(e.data.orders.asOf,a.updatedAt).toUpperCase()]}),(0,E.jsx)(`span`,{className:`con-order-title`,children:a.title}),a.detail&&(0,E.jsx)(`span`,{className:`con-text`,children:a.detail}),a.state===`awaiting-captain`&&(0,E.jsxs)(`span`,{className:`con-actions`,children:[(0,E.jsx)(`button`,{type:`button`,className:`btn btn-ghost`,disabled:!0,children:`Deny`}),(0,E.jsx)(`button`,{type:`button`,className:`btn btn-gold`,disabled:!0,children:`Approve`}),(0,E.jsx)(`span`,{className:`con-hint`,children:`Orders arrive in H4.`})]})]}):null}function St({st:e,onQuarters:t,relief:n}){return(0,E.jsxs)(`div`,{className:`con-foot`,children:[n&&(0,E.jsx)(`button`,{type:`button`,className:`btn btn-ghost relieve`,"aria-pressed":n.on,onClick:n.toggle,title:n.on?`Bring them back to their post. Screen only.`:`Send them to quarters. Screen only.`,children:n.on?`Recall to post`:`Relieve`}),e.id===`captain`?t&&(0,E.jsx)(`button`,{type:`button`,className:`btn btn-gold`,onClick:t,children:`To your Quarters`}):e.id===`quarters`&&t?(0,E.jsxs)(`button`,{type:`button`,className:`btn btn-gold`,onClick:t,children:[e.short,` console`]}):(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)(`button`,{type:`button`,className:`btn btn-ghost`,disabled:!0,children:[e.short,` console`]}),(0,E.jsx)(`span`,{className:`con-hint`,children:`Not built yet.`})]})]})}function Ct({ship:e,st:t,orderId:n,back:r,onBack:i,actions:a,onQuarters:o,relief:s}){return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:mt[t.id],title:t.name,back:r,onBack:i,sub:yt(t),children:a}),(0,E.jsx)(bt,{ship:e,st:t}),(0,E.jsxs)(`div`,{className:`con-body`,children:[(0,E.jsx)(xt,{ship:e,st:t,orderId:n}),(0,E.jsxs)(`dl`,{className:`con-facts`,children:[(0,E.jsx)(`dt`,{children:`DUTY`}),(0,E.jsx)(`dd`,{children:t.duty}),t.note&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`dt`,{children:`NOTE`}),(0,E.jsx)(`dd`,{children:t.note})]}),t.model&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`dt`,{children:`MODEL`}),(0,E.jsx)(`dd`,{children:t.model})]}),t.aliases.length>0&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`dt`,{children:`ALIASES`}),(0,E.jsx)(`dd`,{children:t.aliases.join(`, `)})]}),t.answersTo&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`dt`,{children:`ANSWERS TO`}),(0,E.jsx)(`dd`,{children:t.answersTo})]})]})]}),(0,E.jsx)(St,{st:t,onQuarters:o,relief:s})]})}function wt({ship:e,onPick:t}){let n=e.data.stations.stations.filter(e=>e.activeOrder),r=e.data.stations.stations.filter(t=>e.off(t));return(0,E.jsxs)(`section`,{className:`console`,role:`region`,"aria-label":`The watch`,style:pt({"--c":`var(--captain)`}),children:[(0,E.jsx)(vt,{icon:mt.captain,title:`The watch`,sub:`${n.length} AT WORK · ${r.length} OFF DUTY · PICK A ROOM OR A CARD`}),(0,E.jsx)(`div`,{className:`con-body`,children:(0,E.jsx)(`ul`,{className:`con-rows`,children:n.map(n=>{let r=e.data.orders.orders.find(e=>e.id===n.activeOrder),i=e.off(n);return(0,E.jsx)(`li`,{children:(0,E.jsxs)(`button`,{type:`button`,className:`con-row`+(i?` off`:``),style:pt({"--c":T(n.rail)}),onClick:()=>t(n.id),children:[(0,E.jsx)(`span`,{className:`dot`}),(0,E.jsx)(`span`,{className:`con-row-name`,children:n.short}),(0,E.jsx)(`span`,{className:`con-row-text`,children:r?.title}),(0,E.jsx)(`span`,{className:`idtag`,children:i?`WAITS`:n.activeOrder})]})},n.id)})})})]})}var Tt=(e,t)=>`${(e/t*100).toFixed(3)}%`,Et=[[`role`,`Role`],[`rank`,`Rank`],[`off`,`Off`]],Dt=`hermes.shipLabels`;function Ot(){let[e,t]=(0,l.useState)(()=>{try{let e=localStorage.getItem(Dt);if(e===`role`||e===`rank`||e===`off`)return e}catch{}return`role`});return[e,e=>{t(e);try{localStorage.setItem(Dt,e)}catch{}}]}var kt=(0,l.memo)(function(){return(0,E.jsx)(`div`,{className:`ship-art-svg`,dangerouslySetInnerHTML:{__html:Oe}})});function At({ship:e,filter:t,pick:n,onPick:r,onDept:i,onBack:a,onQuarters:o,onRelieve:s}){let c=n?.station??null,u=(0,l.useRef)(null),d=e.rail(`codex`)!==`out`,f=e.rail(`claude`)!==`out`,p=e.rail(`local`)!==`out`,[m,h]=Ot();(0,l.useEffect)(()=>{let e=u.current;if(!e)return;let t=(t,n)=>{let r=e.querySelector(`#`+t);r&&(r.textContent=n)};t(`lbl-codex`,d?`CODEX · PORT NACELLE · CHIEF · SYSTEMS · DIAGNOSTICS`:`CODEX · WINDOW OUT · CREW IN QUARTERS`),t(`lbl-claude`,f?`CLAUDE · STARBOARD NACELLE`:`CLAUDE · WINDOW OUT`),t(`lbl-core`,p?`◂ WARP CORE · LOCAL QWEN`:`◂ WARP CORE COLD · OLLAMA DOWN`)},[d,f,p]);let g={"--codex-glow":d?1:.16,"--codex-text":d?`#1a1206`:`#f0a948`,"--claude-glow":f?1:.16,"--claude-text":f?`#1a1206`:`#e889b6`,"--core-glow":p?1:.18,"--conduit":p?.3:.08,"--core-text":p?`#9fb0cc`:`#f08a7a`,"--table-glow":1};return(0,E.jsxs)(`section`,{className:`hero`,"aria-label":`Ship plan`,children:[(0,E.jsxs)(`div`,{className:`hero-top`,children:[(0,E.jsx)(`p`,{className:`mono hero-label`,children:`MASTER SYSTEMS DISPLAY · SIDE ELEVATION · PICK A ROOM`}),(0,E.jsxs)(`div`,{className:`hero-tools`,children:[(0,E.jsxs)(`div`,{className:`labels-ctl`,role:`group`,"aria-label":`Labels on the rooms`,children:[(0,E.jsx)(`span`,{className:`mono`,children:`LABELS`}),Et.map(([e,t])=>(0,E.jsx)(`button`,{type:`button`,className:`chip`,"aria-pressed":m===e,onClick:()=>h(e),children:t},e))]}),(0,E.jsx)(Mt,{})]})]}),(0,E.jsxs)(`div`,{className:`ship-wrap`,children:[(0,E.jsxs)(`div`,{className:`ship`,children:[(0,E.jsx)(`div`,{className:`ship-art`,ref:u,style:g,"aria-hidden":`true`,children:(0,E.jsx)(kt,{})}),(0,E.jsxs)(`div`,{className:`ship-tiles`+(m===`off`?` bare`:``),children:[e.data.stations.stations.map(n=>(0,E.jsx)(jt,{st:n,ship:e,filter:t,labels:m,selected:c===n.id,onPick:r},n.id)),(0,E.jsx)(Ue,{ship:e,filter:t,selected:c,slots:m!==`off`,onPick:r})]})]}),(0,E.jsx)(gt,{ship:e,pick:n,onPick:r,onDept:i,onBack:a,onQuarters:o,onRelieve:s})]})]})}function jt({st:e,ship:t,filter:n,labels:r,selected:i,onPick:a}){let o=M.places[e.id];if(!o)return null;let s=t.off(e),c=t.actingFor(e.id),l=[`tile`];e.kind===`place`&&l.push(`place`),(e.id===`crewq`||e.id===`lounge`)&&l.push(`space-wide`),e.status===`reserved`&&l.push(`reserved`),s&&l.push(`off`),n!==`all`&&e.rail!==n&&e.kind!==`place`&&l.push(`dim`);let u=s?`OFF · ${s.toUpperCase()}`:c?`ACTING HEAD`:e.kind===`place`?`PLACE`:e.status===`live`?y[e.rail].label+(e.activeOrder?` · ${e.activeOrder}`:``):b[e.status].label,d={left:Tt(o.x,M.width),top:Tt(o.y,M.height),width:Tt(o.w,M.width),"--c":e.kind===`place`?`var(--border-strong)`:T(e.rail),"--ls":b[e.status].line};return(0,E.jsxs)(`button`,{type:`button`,className:l.join(` `),style:d,"aria-pressed":i,"aria-label":`${e.name}, ${u.toLowerCase()}`,onClick:()=>a(e.id),children:[!Pe(e)&&(0,E.jsx)(ke,{path:M.icons[e.id],className:`ticon`}),(0,E.jsx)(`span`,{className:`t1`,children:e.short}),r===`rank`&&e.kind===`station`?(0,E.jsxs)(`span`,{className:`t2 rank`,children:[x[e.rank].officer&&(0,E.jsx)(A,{rank:e.rank}),x[e.rank].short.toUpperCase()]}):(0,E.jsx)(`span`,{className:`t2`,children:u}),e.activeOrder&&!s&&(0,E.jsx)(`span`,{className:`busy`,title:`Working on ${e.activeOrder}`})]})}function Mt(){return(0,E.jsxs)(`div`,{className:`legend`,children:[[`local`,`codex`,`claude`,`mixed`,`captain`].map(e=>(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`i`,{style:{"--c":y[e].color}}),y[e].legend]},e)),[[`solid`,`Live`],[`dashed`,`Approved or proposed`],[`dotted`,`Name reserved`]].map(([e,t])=>(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`i`,{className:`line`,style:{"--ls":e}}),t]},e))]})}function Nt({ship:e,filter:t,drills:n,target:r,onTarget:i,onToast:a,onQuarters:o,onRelieve:s}){let[c,u]=(0,l.useState)(null),d=(e,t,n)=>{let r=c?.station===e&&c?.order===t;u(r?null:{station:e,order:t,from:n}),i(e)},f=e=>u(c?.dept===e?null:{dept:e}),p=(0,l.useCallback)(()=>u(null),[]);return(0,E.jsxs)(`div`,{className:`grid`,children:[(0,E.jsx)(At,{ship:e,filter:t,pick:c,onPick:d,onDept:f,onBack:p,onQuarters:o,onRelieve:s}),(0,E.jsxs)(`aside`,{className:`side`,children:[(0,E.jsx)(Se,{ship:e,drills:n}),(0,E.jsx)(k,{ship:e,picked:c?.order,onOpen:d}),(0,E.jsx)(Ce,{ship:e,filter:t,picked:c?.order,onOpen:d})]}),(0,E.jsx)(j,{ship:e,filter:t,picked:c?.station,pickedDept:c?.dept,onOpen:e=>d(e),onDept:f}),(0,E.jsx)(De,{ship:e}),(0,E.jsx)(me,{ship:e,target:r,onToast:a})]})}function Pt({ship:e,board:t,side:n,children:r}){return(0,E.jsxs)(`div`,{className:`frame`,children:[(0,E.jsx)(`div`,{className:`elbow elbow-top`,"aria-hidden":`true`}),(0,E.jsxs)(`header`,{className:`topbar`,children:[(0,E.jsx)(`div`,{className:`topbar-stats mono`,children:e?t===`quarters`?Lt(e):It(e):`—`}),(0,E.jsx)(`span`,{className:`seg seg-gold`,"aria-hidden":`true`}),(0,E.jsx)(`span`,{className:`seg seg-local`,"aria-hidden":`true`}),(0,E.jsx)(`span`,{className:`seg seg-claude`,"aria-hidden":`true`}),(0,E.jsx)(`span`,{className:`seg seg-end`,"aria-hidden":`true`})]}),n,r]})}function Ft(e){return e.data.orders.orders.filter(e=>e.state===`awaiting-captain`).length}function It(e){let t=e.data.stations.stations.filter(e=>e.kind!==`place`),n=t.filter(t=>t.status===`live`&&!e.off(t)).length,r=oe.filter(t=>e.rail(t)!==`out`).length;return`${t.length} CREW · ${n} ON DUTY · ${r} OF 3 RAILS UP · ${Ft(e)} HAILS`}function Lt(e){let t=e.data.quarters,n=t.missions.filter(e=>e.status===`in-flight`).length,r=e.data.rails.rails.find(t=>t.burn?.active&&t.burn.until&&e.rail(t.id)!==`out`),i=e.relieved.size?` · ${e.relieved.size} RELIEVED`:``;return`${t.campaigns.length} CAMPAIGNS · ${n} MISSIONS IN FLIGHT · ${Ft(e)} HAILS`+(r?.burn?.until?` · BURN TO ${D(r.burn.until).toUpperCase()}`:``)+i}var Rt={bridge:{deck:`BRIDGE · SHIP STATUS`,title:`Bridge · all decks`,intro:`Who is at their post, where work is running and what waits for you.`},quarters:{deck:`DECK 2 · CAPTAIN'S QUARTERS · PRIVATE`,title:`Captain's Quarters`,intro:`Your hails, your campaigns and your own log. Pick something in the room to bring it up on the wall screen.`}};function zt({ship:e,board:t,error:n}){let r=e?oe.some(t=>e.rail(t)===`out`):!1,i=r?`yellow`:e?.data.ship.condition??`green`,a=e?`${e.data.ship.name.toUpperCase()} · ${e.data.ship.registry}`:`HERMES`,o=Rt[t],s=e?.data.ship.captain.conn===`captain`;return(0,E.jsxs)(`div`,{className:`head`,children:[(0,E.jsxs)(`div`,{children:[(0,E.jsxs)(`p`,{className:`deck-label mono`,children:[a,` · `,o.deck]}),(0,E.jsx)(`h1`,{className:`board-title`,children:o.title}),(0,E.jsx)(`p`,{className:`intro`,children:n?`Could not load the fixtures (${n}). Run npm run dev, or serve the built page with /fixtures/ next to it.`:o.intro})]}),(0,E.jsxs)(`div`,{className:`head-right`,children:[t===`quarters`&&e&&(0,E.jsx)(`span`,{className:`pill pill-conn mono`+(s?``:` away`),title:`The Conn handoff board arrives in H4.`,children:s?`YOU HAVE THE CONN`:`NUMBER ONE HAS THE CONN`}),(0,E.jsxs)(`div`,{className:`condition ${i}`,title:r?`A rail is out, so its crew are off duty`:`All rails up`,children:[(0,E.jsx)(`span`,{className:`lamp`}),(0,E.jsxs)(`span`,{className:`mono`,children:[`CONDITION `,i.toUpperCase()]})]}),(0,E.jsx)(Bt,{}),(0,E.jsx)(`span`,{className:`pill pill-fixture mono`,title:`Synthetic data from fixtures/. Nothing on this screen calls a model.`,children:`FIXTURES · NO MODEL CALLS`})]})]})}function Bt(){let[e,t]=(0,l.useState)(()=>new Date);return(0,l.useEffect)(()=>{let e=setInterval(()=>t(new Date),15e3);return()=>clearInterval(e)},[]),(0,E.jsxs)(`div`,{className:`clock`,children:[(0,E.jsx)(`span`,{className:`clock-time`,children:ge(e)}),(0,E.jsxs)(`span`,{className:`mono clock-sub`,children:[ve(e),` · STOCKHOLM`]})]})}var Vt=e=>e;function Ht({ship:e,filter:t,picked:n,onOpen:r,onRelieve:i}){let a=S.flatMap(t=>e.data.stations.stations.filter(e=>e.dept===t.id&&ae(e)).sort((e,t)=>Number(!!t.head)-Number(!!e.head)||x[e.rank].order-x[t.rank].order)),o=a.filter(t=>e.relieved.has(t.id)).length,s=t=>{let n=e.station(t),r=S.find(e=>e.id===n.dept),i=e.off(n);if(i===`relieved`){if(!n.head||n.dept===`command`)return{text:`relieved · orders wait`,tone:`warn`};let t=e.acting[n.dept];return{text:t===`dark`?`relieved · nobody can act`:`relieved · ${e.station(t)?.short} acts`,tone:`warn`}}return i?{text:`off · ${i}`,tone:`warn`}:e.actingFor(t)?{text:`acting head · ${r.name}`,tone:`gold`}:n.head?{text:`head · ${r.name}`}:{text:r.name}};return(0,E.jsxs)(`section`,{className:`panel duty-panel`,"aria-labelledby":`duty-title`,children:[(0,E.jsxs)(`div`,{className:`panel-head`,children:[(0,E.jsx)(`h2`,{className:`panel-title`,id:`duty-title`,children:`Duty roster`}),(0,E.jsxs)(`span`,{className:`mono panel-meta`,children:[o?`${o} RELIEVED · `:``,`SCREEN ONLY, LIKE A DRILL`]})]}),(0,E.jsx)(`p`,{className:`help`,children:`Relieve a station and the next officer by rank acts as head. Enlisted crew and the Computer never command.`}),(0,E.jsx)(`ul`,{className:`duty`,children:a.map(a=>{let o=s(a.id),c=!!e.off(a),l=e.relieved.has(a.id);return(0,E.jsxs)(`li`,{className:`duty-row`+(c?` off`:``),hidden:t!==`all`&&a.rail!==t,style:Vt({"--c":T(a.rail)}),children:[(0,E.jsxs)(`button`,{type:`button`,className:`duty-name`,"aria-pressed":n===a.id,onClick:()=>r(a.id),title:`${a.name} · ${x[a.rank].label}`,children:[(0,E.jsx)(`span`,{className:`dot`}),(0,E.jsxs)(`span`,{className:`duty-short`,children:[a.short,(0,E.jsx)(A,{rank:a.rank})]}),(0,E.jsx)(`span`,{className:`duty-note mono`+(o.tone?` ${o.tone}`:``),children:o.text})]}),(0,E.jsx)(`button`,{type:`button`,className:`duty-btn`,"aria-pressed":l,onClick:()=>i(a.id),"aria-label":`${l?`Recall`:`Relieve`} ${a.name}`,children:l?`Recall`:`Relieve`})]},a.id)})})]})}var Ut={"awaiting-captain":`WAITS FOR YOU`,"in-flight":`IN FLIGHT`,planning:`PLANNING`,closed:`CLOSED`};function Wt({ship:e,scope:t,onScope:n}){let r=e.data.quarters,i=r.missions.filter(e=>!t.campaign||e.campaign===t.campaign);return(0,E.jsxs)(`section`,{className:`panel camp-panel`,"aria-labelledby":`camp-title`,children:[(0,E.jsxs)(`div`,{className:`panel-head`,children:[(0,E.jsx)(`h2`,{className:`panel-title`,id:`camp-title`,children:`Campaigns`}),(0,E.jsx)(`span`,{className:`mono panel-meta`,children:`LONG-TERM GOALS · ONLY YOU OPEN OR CLOSE ONE · SAMPLE`})]}),(0,E.jsx)(`div`,{className:`camps`,children:r.campaigns.map(e=>{let r=t.campaign===e.id;return(0,E.jsxs)(`button`,{type:`button`,className:`camp`,"aria-pressed":r,onClick:()=>n(r?{}:{campaign:e.id}),children:[(0,E.jsxs)(`span`,{className:`camp-top mono`,children:[e.id,` · BY `,Gt(e.target)]}),(0,E.jsx)(`span`,{className:`camp-name`,children:e.name}),(0,E.jsx)(`span`,{className:`camp-meter`,role:`meter`,"aria-valuenow":e.percent,"aria-valuemin":0,"aria-valuemax":100,"aria-label":`${e.name}, ${e.percent}%`,children:(0,E.jsx)(`b`,{style:{width:`${e.percent}%`}})}),(0,E.jsxs)(`span`,{className:`camp-measure`,children:[(0,E.jsx)(`span`,{children:e.measure}),(0,E.jsxs)(`span`,{className:`mono`,children:[e.percent,`%`]})]})]},e.id)})}),(0,E.jsx)(`ul`,{className:`missions`,"aria-label":`Missions`,children:i.map(r=>{let i=t.mission===r.id;return(0,E.jsx)(`li`,{children:(0,E.jsxs)(`button`,{type:`button`,className:`mission `+r.status,"aria-pressed":i,onClick:()=>n(i?{campaign:t.campaign}:{campaign:t.campaign,mission:r.id}),children:[(0,E.jsx)(`span`,{className:`idtag`,children:r.id}),(0,E.jsxs)(`span`,{className:`mission-name`,children:[r.name,(0,E.jsxs)(`span`,{className:`mission-done`,children:[`done when `,r.doneWhen]})]}),(0,E.jsx)(`span`,{className:`mission-crew`,children:r.stations.map(t=>{let n=e.station(t);return(0,E.jsx)(`span`,{className:`crewdot`,title:n?.name,style:Vt({"--c":T(n?.rail??`mixed`)})},t)})}),(0,E.jsx)(`span`,{className:`mono mission-progress`,children:r.progress}),(0,E.jsx)(`span`,{className:`mission-state mono `+r.status,children:Ut[r.status]})]})},r.id)})})]})}function Gt(e){let[t,n]=e.split(`-`).map(Number);return new Intl.DateTimeFormat(`en-GB`,{month:`short`,year:`numeric`,timeZone:`UTC`}).format(new Date(Date.UTC(t,n-1,1))).toUpperCase()}var Kt=[{id:`all`,label:`All`},{id:`flight`,label:`In flight`},{id:`you`,label:`Waits for you`},{id:`done`,label:`Done`}];function qt({ship:e,filter:t,scope:n,onScope:r,picked:i,onOpen:a}){let[o,s]=(0,l.useState)(`all`),c=e.data.quarters,u=e=>!n.campaign||c.missions.some(t=>t.id===e.mission&&t.campaign===n.campaign),d=[...e.data.orders.orders].sort((e,t)=>t.updatedAt.localeCompare(e.updatedAt)).filter(e=>(!n.mission||e.mission===n.mission)&&u(e)).filter(n=>t===`all`||e.station(n.station)?.rail===t).filter(e=>o===`all`||(o===`done`?e.state===`done`:o===`you`?e.state===`awaiting-captain`:e.state!==`done`&&e.state!==`awaiting-captain`)),f=n.mission??n.campaign,p=t=>D(t).split(` `)[0]===D(e.data.orders.asOf).split(` `)[0];return(0,E.jsxs)(`section`,{className:`panel log-table-panel`,"aria-labelledby":`olog-title`,children:[(0,E.jsxs)(`div`,{className:`panel-head`,children:[(0,E.jsx)(`h2`,{className:`panel-title`,id:`olog-title`,children:`Order log`}),(0,E.jsx)(`div`,{className:`olog-filters`,role:`group`,"aria-label":`Show orders`,children:Kt.map(e=>(0,E.jsx)(`button`,{type:`button`,className:`chip`,"aria-pressed":o===e.id,onClick:()=>s(e.id),children:e.label},e.id))}),(0,E.jsxs)(`span`,{className:`mono panel-meta`,children:[f?`${f} ONLY`:`EVERY ORDER`,` · `,d.length,` ROWS`]}),f&&(0,E.jsx)(`button`,{type:`button`,className:`foldall`,onClick:()=>r({}),children:`SHOW ALL`})]}),(0,E.jsx)(`div`,{className:`olog-scroll`,children:(0,E.jsxs)(`table`,{className:`olog`,children:[(0,E.jsx)(`thead`,{children:(0,E.jsxs)(`tr`,{children:[(0,E.jsx)(`th`,{children:`ID`}),(0,E.jsx)(`th`,{children:`MISSION`}),(0,E.jsx)(`th`,{children:`TIME`}),(0,E.jsx)(`th`,{children:`SPEED`}),(0,E.jsx)(`th`,{children:`TO`}),(0,E.jsx)(`th`,{children:`WHAT`}),(0,E.jsx)(`th`,{children:`TIER`}),(0,E.jsx)(`th`,{children:`STATE`})]})}),(0,E.jsxs)(`tbody`,{children:[d.length===0&&(0,E.jsx)(`tr`,{children:(0,E.jsx)(`td`,{colSpan:8,className:`empty`,children:`No orders for this filter.`})}),d.map(t=>{let n=e.station(t.station),r=n?e.off(n):null,o=t.state===`awaiting-captain`?`awaiting-captain`:r&&t.state!==`done`?`waiting`:t.state;return(0,E.jsxs)(`tr`,{className:i===t.id?`picked`:void 0,onClick:()=>a(t),children:[(0,E.jsx)(`td`,{className:`mono`,children:(0,E.jsx)(`button`,{type:`button`,className:`olog-id`,"aria-pressed":i===t.id,onClick:e=>{e.stopPropagation(),a(t)},children:t.id})}),(0,E.jsx)(`td`,{className:`mono`,children:t.mission??`—`}),(0,E.jsx)(`td`,{className:`mono`,children:p(t.updatedAt)?ge(t.updatedAt):D(t.updatedAt)}),(0,E.jsx)(`td`,{className:`mono`,children:t.speed?.toUpperCase()??`—`}),(0,E.jsxs)(`td`,{children:[(0,E.jsx)(`span`,{className:`dot`,style:Vt({"--c":T(n?.rail??`mixed`)})}),n?.short??t.station]}),(0,E.jsx)(`td`,{className:`olog-what`,children:t.title}),(0,E.jsx)(`td`,{children:(0,E.jsx)(`span`,{className:`tierpill`,style:Vt({"--c":`var(--tier-${t.tier})`}),children:t.tier})}),(0,E.jsx)(`td`,{children:(0,E.jsx)(`span`,{className:`statepill ${o}`,children:o===`awaiting-captain`?`WAITS FOR YOU`:o===`waiting`?`WAITS`:t.state.toUpperCase()})})]},t.id)})]})]})})]})}var Jt=`<svg class="quarters-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 740" aria-hidden="true">
<defs>
<clipPath id="q-glass"><polygon points="180,100 620,100 640,548 160,548"/></clipPath>
<filter id="q-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="q-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2130"/><stop offset=".55" stop-color="#211a27"/><stop offset="1" stop-color="#17121c"/></linearGradient>
<linearGradient id="q-ceiling" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0a10"/><stop offset="1" stop-color="#1a1520"/></linearGradient>
<linearGradient id="q-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21171f"/><stop offset="1" stop-color="#0d0a10"/></linearGradient>
<linearGradient id="q-baseglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".16"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
<linearGradient id="q-spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc4ff" stop-opacity=".07"/><stop offset="1" stop-color="#9fc4ff" stop-opacity="0"/></linearGradient>
<radialGradient id="q-downcone" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffd89a" stop-opacity=".22"/><stop offset=".6" stop-color="#ffd89a" stop-opacity=".04"/><stop offset="1" stop-color="#ffd89a" stop-opacity="0"/></radialGradient>
<linearGradient id="q-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1520"/><stop offset=".5" stop-color="#2c2333"/><stop offset="1" stop-color="#1a1520"/></linearGradient>
<linearGradient id="q-space" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070a18"/><stop offset=".6" stop-color="#0b0f22"/><stop offset="1" stop-color="#120b1c"/></linearGradient>
<radialGradient id="q-neb-plum"><stop offset="0" stop-color="#7a3d8c" stop-opacity=".42"/><stop offset=".6" stop-color="#4a2560" stop-opacity=".16"/><stop offset="1" stop-color="#2a1538" stop-opacity="0"/></radialGradient>
<radialGradient id="q-neb-teal"><stop offset="0" stop-color="#2f8a96" stop-opacity=".34"/><stop offset=".6" stop-color="#1f5a6a" stop-opacity=".12"/><stop offset="1" stop-color="#0f2a33" stop-opacity="0"/></radialGradient>
<radialGradient id="q-neb-rose"><stop offset="0" stop-color="#c0587a" stop-opacity=".26"/><stop offset="1" stop-color="#5a2038" stop-opacity="0"/></radialGradient>
<radialGradient id="q-starglow"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".25" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="0"/></radialGradient>
<linearGradient id="q-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b9c8ff" stop-opacity="0"/></linearGradient>
<radialGradient id="q-planet" cx=".78" cy=".08" r="1.05"><stop offset="0" stop-color="#6fb2c4"/><stop offset=".14" stop-color="#245c74"/><stop offset=".38" stop-color="#0f2a42"/><stop offset=".75" stop-color="#081626"/><stop offset="1" stop-color="#050b14"/></radialGradient>
<radialGradient id="q-atmo" cx=".8" cy=".05" r=".9"><stop offset="0" stop-color="#d8f6ff" stop-opacity="1"/><stop offset=".4" stop-color="#7fd8e8" stop-opacity=".45"/><stop offset=".8" stop-color="#3f7f9a" stop-opacity=".08"/><stop offset="1" stop-color="#3f7f9a" stop-opacity="0"/></radialGradient>
<radialGradient id="q-band"><stop offset="0" stop-color="#e8e0ff" stop-opacity=".09"/><stop offset=".5" stop-color="#b8a8e0" stop-opacity=".04"/><stop offset="1" stop-color="#b8a8e0" stop-opacity="0"/></radialGradient>
<linearGradient id="q-shell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e12"/><stop offset=".3" stop-color="#3a2b33"/><stop offset=".55" stop-color="#2a1f26"/><stop offset="1" stop-color="#0f0a0d"/></linearGradient>
<linearGradient id="q-shell-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd89a" stop-opacity=".12"/><stop offset=".35" stop-color="#ffd89a" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
<linearGradient id="q-arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2b33"/><stop offset="1" stop-color="#120c10"/></linearGradient>
<linearGradient id="q-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".65"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></linearGradient>
<linearGradient id="q-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a4048"/><stop offset=".5" stop-color="#8a7a7e"/><stop offset="1" stop-color="#3a3238"/></linearGradient>
<radialGradient id="q-shadow"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="q-alcove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a26"/><stop offset=".35" stop-color="#1e1619"/><stop offset="1" stop-color="#120d12"/></linearGradient>
<linearGradient id="q-shelflight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></linearGradient>
<radialGradient id="q-globe" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#4f8fb0"/><stop offset=".7" stop-color="#1f4a66"/><stop offset="1" stop-color="#0f2233"/></radialGradient>
<linearGradient id="q-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d898"/><stop offset=".45" stop-color="#c9a560"/><stop offset="1" stop-color="#8a6a32"/></linearGradient>
<radialGradient id="q-screenglow" cx=".5" cy=".5" r=".6"><stop offset=".7" stop-color="#e8c37a" stop-opacity=".1"/><stop offset="1" stop-color="#e8c37a" stop-opacity="0"/></radialGradient>
<linearGradient id="q-desktop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2c33"/><stop offset="1" stop-color="#2a1f26"/></linearGradient>
<linearGradient id="q-deskfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22181f"/><stop offset="1" stop-color="#140e13"/></linearGradient>
<linearGradient id="q-termglass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1410"/><stop offset="1" stop-color="#0c0a0a"/></linearGradient>
<linearGradient id="q-paddglass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fd8c4" stop-opacity=".85"/><stop offset="1" stop-color="#3fa58f" stop-opacity=".7"/></linearGradient>
<linearGradient id="q-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3cddd"/><stop offset=".5" stop-color="#7d8aa3"/><stop offset="1" stop-color="#3a4458"/></linearGradient>
<linearGradient id="q-lampcone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".28"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></linearGradient>
<radialGradient id="q-vignette" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>
<!-- the room -->
<rect width="1600" height="740" fill="#120e16"/>
<rect y="38" width="1600" height="562" fill="url(#q-wall)"/>
<path d="M140 40 L140 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M142 40 L142 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M252 40 L252 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M254 40 L254 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M364 40 L364 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M366 40 L366 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M476 40 L476 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M478 40 L478 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M588 40 L588 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M590 40 L590 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M700 40 L700 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M702 40 L702 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M812 40 L812 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M814 40 L814 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M924 40 L924 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M926 40 L926 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1036 40 L1036 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1038 40 L1038 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1148 40 L1148 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1150 40 L1150 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1260 40 L1260 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1262 40 L1262 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1372 40 L1372 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1374 40 L1374 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1484 40 L1484 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1486 40 L1486 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<path d="M1596 40 L1596 598" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
<path d="M1598 40 L1598 598" stroke="#fff" stroke-opacity=".025" stroke-width="1"/>
<rect y="508" width="1600" height="3" fill="#e8c37a" opacity=".1"/>
<rect width="1600" height="38" fill="url(#q-ceiling)"/>
<rect y="34" width="1600" height="4" fill="#2a2230"/>
<rect y="37" width="1600" height="1" fill="#e8c37a" opacity=".35"/>
<ellipse cx="80" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>
<rect x="68" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="400" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>
<rect x="388" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="696" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>
<rect x="684" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="980" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>
<rect x="968" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="1260" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>
<rect x="1248" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<ellipse cx="1520" cy="40" rx="120" ry="200" fill="url(#q-downcone)" opacity=".9"/>
<rect x="1508" y="30" width="24" height="5" rx="2.5" fill="#ffe2a8"/>
<rect y="598" width="1600" height="142" fill="url(#q-floor)"/>
<rect y="596" width="1600" height="4" fill="#2a2028"/>
<rect y="599" width="1600" height="2" fill="#ffcf8a" opacity=".45"/>
<rect y="601" width="1600" height="26" fill="url(#q-baseglow)"/>
<ellipse cx="400" cy="694" rx="300" ry="38" fill="#2a1722" stroke="#c9a560" stroke-opacity=".28" stroke-width="2"/>
<ellipse cx="400" cy="694" rx="270" ry="30" fill="none" stroke="#c9a560" stroke-opacity=".14" stroke-width="1"/>
<path d="M160 600 L640 600 L760 740 L40 740 Z" fill="url(#q-spill)"/>
<!-- the bookshelf -->
<rect x="22" y="78" width="114" height="522" rx="16" fill="#0f0c13" stroke="#3a2f3e" stroke-width="2"/>
<rect x="30" y="86" width="98" height="508" rx="11" fill="url(#q-alcove)"/>
<ellipse cx="79" cy="180" rx="18" ry="3" fill="#000" opacity=".4"/>
<path d="M79 178 L79 170" stroke="#8a7350" stroke-width="2"/>
<circle cx="79" cy="146" r="21" fill="url(#q-globe)"/>
<path d="M64 140 q8 -8 16 -2 q6 4 12 -3 M66 154 q10 4 18 -2" stroke="#7fbf9a" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>
<path d="M56 146 a23 23 0 0 1 46 0" stroke="#b8914a" stroke-width="2" fill="none"/>
<rect x="30" y="182" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="188" width="98" height="14" fill="url(#q-shelflight)" opacity=".7"/>
<rect x="36" y="209" width="9.3" height="63" rx="1.2" fill="#4a6a5a"/>
<rect x="37.5" y="217" width="6.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="46.1" y="200.9" width="9.6" height="71.1" rx="1.2" fill="#6a4a7a"/>
<rect x="47.6" y="208.9" width="6.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="57.2" y="220.7" width="8.9" height="51.3" rx="1.2" fill="#8a6a3a"/>
<rect x="58.7" y="228.7" width="5.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="67.5" y="201.9" width="9.8" height="70.1" rx="1.2" fill="#556b4a"/>
<rect x="69" y="209.9" width="6.8" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="78.2" y="218.2" width="10.9" height="53.8" rx="1.2" fill="#6a4a7a"/>
<rect x="79.7" y="226.2" width="7.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="90.3" y="205" width="10.6" height="67" rx="1.2" fill="#2f4f6a"/>
<rect x="91.8" y="213" width="7.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="101.7" y="217.6" width="10.6" height="54.4" rx="1.2" fill="#4a6a5a"/>
<rect x="103.2" y="225.6" width="7.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="113.6" y="215.5" width="7.9" height="56.5" rx="1.2" fill="#8a6a3a"/>
<rect x="115.1" y="223.5" width="4.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="272" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="278" width="98" height="14" fill="url(#q-shelflight)" opacity=".7"/>
<rect x="36" y="301.1" width="11.1" height="60.9" rx="1.2" fill="#2f4f6a"/>
<rect x="37.5" y="309.1" width="8.1" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="48.6" y="305.5" width="9.4" height="56.5" rx="1.2" fill="#556b4a"/>
<rect x="50.1" y="313.5" width="6.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="59.1" y="307.3" width="10.4" height="54.7" rx="1.2" fill="#8a6a3a"/>
<rect x="60.6" y="315.3" width="7.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="70.3" y="305.4" width="10.6" height="56.6" rx="1.2" fill="#4a6a5a"/>
<rect x="71.8" y="313.4" width="7.6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="81.6" y="290.8" width="9" height="71.2" rx="1.2" fill="#a08050"/>
<rect x="83.1" y="298.8" width="6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="92" y="299.2" width="11.7" height="62.8" rx="1.2" fill="#3b5a7a"/>
<rect x="93.5" y="307.2" width="8.7" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="105.2" y="303.7" width="11.9" height="58.3" rx="1.2" fill="#556b4a"/>
<rect x="106.7" y="311.7" width="8.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="362" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="368" width="98" height="14" fill="url(#q-shelflight)" opacity=".7"/>
<rect x="36" y="381.9" width="11.3" height="70.1" rx="1.2" fill="#2f4f6a"/>
<rect x="37.5" y="389.9" width="8.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="48.2" y="381.8" width="8.2" height="70.2" rx="1.2" fill="#8a6a3a"/>
<rect x="49.7" y="389.8" width="5.2" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="57.3" y="380" width="9" height="72" rx="1.2" fill="#556b4a"/>
<rect x="58.8" y="388" width="6" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="67.4" y="384.4" width="10" height="67.6" rx="1.2" fill="#5a3a4a"/>
<rect x="68.9" y="392.4" width="7" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="78.2" y="401.6" width="8.9" height="50.4" rx="1.2" fill="#5a3a4a"/>
<rect x="79.7" y="409.6" width="5.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="88.6" y="384.4" width="8.5" height="67.6" rx="1.2" fill="#3b5a7a"/>
<rect x="90.1" y="392.4" width="5.5" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="97.8" y="381.9" width="10.4" height="70.1" rx="1.2" fill="#a08050"/>
<rect x="99.3" y="389.9" width="7.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="109.1" y="400.5" width="10.4" height="51.5" rx="1.2" fill="#a08050"/>
<rect x="110.6" y="408.5" width="7.4" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="452" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="458" width="98" height="14" fill="url(#q-shelflight)" opacity=".7"/>
<rect x="36" y="486.3" width="9.3" height="55.7" rx="1.2" fill="#a08050"/>
<rect x="37.5" y="494.3" width="6.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="46.8" y="485" width="11.5" height="57" rx="1.2" fill="#8a6a3a"/>
<rect x="48.3" y="493" width="8.5" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="59.9" y="475.7" width="7.3" height="66.3" rx="1.2" fill="#8a6a3a"/>
<rect x="61.4" y="483.7" width="4.3" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="68.1" y="490.9" width="7.5" height="51.1" rx="1.2" fill="#5a3a4a"/>
<rect x="69.6" y="498.9" width="4.5" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="76.6" y="488.5" width="10.9" height="53.5" rx="1.2" fill="#a08050"/>
<rect x="78.1" y="496.5" width="7.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="88.5" y="486.2" width="11.9" height="55.8" rx="1.2" fill="#3b5a7a"/>
<rect x="90" y="494.2" width="8.9" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="101.1" y="490.5" width="9.2" height="51.5" rx="1.2" fill="#a08050"/>
<rect x="102.6" y="498.5" width="6.2" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="111.5" y="481.1" width="7.1" height="60.9" rx="1.2" fill="#8a4a3a"/>
<rect x="113" y="489.1" width="4.1" height="1.6" fill="#e8c37a" opacity=".45"/>
<rect x="30" y="542" width="98" height="6" fill="#3d2e33"/>
<rect x="30" y="548" width="98" height="14" fill="url(#q-shelflight)" opacity=".7"/>
<!-- the viewport -->
<polygon points="166,86 634,86 656,566 144,566" fill="#2a2230" stroke="#4d4052" stroke-width="2"/>
<polygon points="180,100 620,100 640,548 160,548" fill="#04060d"/>
<g clip-path="url(#q-glass)">
<rect x="150" y="90" width="500" height="470" fill="url(#q-space)"/>
<ellipse cx="300" cy="210" rx="250" ry="130" fill="url(#q-neb-plum)"/>
<ellipse cx="540" cy="330" rx="210" ry="130" fill="url(#q-neb-teal)"/>
<ellipse cx="250" cy="400" rx="170" ry="90" fill="url(#q-neb-rose)"/>
<ellipse cx="400" cy="300" rx="330" ry="46" fill="url(#q-band)" transform="rotate(-24 400 300)"/>
<g class="q-drift">
<circle cx="448.7" cy="284.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="390" cy="303.8" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="555.4" cy="219.7" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="350.4" cy="312.4" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="230.4" cy="377.7" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="528.2" cy="225.1" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="410.8" cy="290.2" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="115.5" cy="410" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="370.4" cy="325.1" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="324.5" cy="319.6" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="611.4" cy="223.2" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="565.3" cy="219.8" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="399.1" cy="304.3" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="533.6" cy="258.9" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="148.6" cy="418.4" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="331.1" cy="346" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="274.9" cy="354.4" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="448.8" cy="289.7" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="363.2" cy="306.9" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="629" cy="195.4" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="616.7" cy="203.3" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="670.2" cy="179.7" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="469.9" cy="288.5" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="246.7" cy="360.7" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="680.8" cy="181.4" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="148.4" cy="404.3" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="587.2" cy="210.2" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="646.3" cy="207.9" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="663.7" cy="183.5" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="268.2" cy="374.2" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="418.9" cy="303.1" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="356.4" cy="287.5" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="671" cy="172.6" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="633.9" cy="212" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="356.6" cy="332.9" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="245.1" cy="357" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="483.3" cy="252.7" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="249.5" cy="344.3" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="201.8" cy="393.9" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="287.3" cy="359.1" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="415" cy="296.9" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="452.3" cy="280" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="161.8" cy="430.2" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="231.5" cy="374.1" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="576.9" cy="205" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="431.9" cy="304" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="494.4" cy="249.9" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="387" cy="292.8" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="626.3" cy="194.4" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="626" cy="214.6" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="478.3" cy="274.6" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="555.7" cy="219.5" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="239.2" cy="373.2" r="0.7" fill="#e8e4ff" opacity="0.6"/>
<circle cx="647.6" cy="174.4" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="191.1" cy="399.1" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="424.3" cy="274.2" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="358.4" cy="341.2" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="511.7" cy="237" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="144.9" cy="437.1" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="324.6" cy="360.2" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="630.4" cy="203.1" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="510.9" cy="258.7" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="348.8" cy="335" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="359.2" cy="290.5" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="628.7" cy="214.8" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="595.5" cy="222" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="505.6" cy="255.5" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="269.4" cy="360.8" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="490.8" cy="253.3" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="611.1" cy="193.1" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="221.5" cy="384.8" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="251.2" cy="335.4" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="332.3" cy="329.1" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="163.5" cy="429.3" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="388" cy="326.7" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="462.4" cy="291.2" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="279.4" cy="355.9" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="581.1" cy="229.9" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="243.3" cy="313.1" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="625.9" cy="174.3" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="372.4" cy="281.8" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="189.1" cy="405.6" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="367.9" cy="296" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="264.1" cy="359.8" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="300.9" cy="333" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="502.7" cy="231.2" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="444.1" cy="265.6" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="509.5" cy="263.9" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="375.5" cy="323.9" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="629.1" cy="205.8" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="635.8" cy="196.3" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="671.9" cy="208.6" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="300.3" cy="329.5" r="0.7" fill="#e8e4ff" opacity="0.5"/>
<circle cx="152.8" cy="413.3" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="258.2" cy="358.5" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="392" cy="311" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="570" cy="187.3" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="425" cy="305.6" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="304" cy="299.3" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="487.9" cy="271.4" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="337.6" cy="313.6" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="249.5" cy="343.8" r="0.6" fill="#e8e4ff" opacity="0.6"/>
<circle cx="118.1" cy="419.3" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="488.3" cy="237.7" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="138.9" cy="394.9" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="502.4" cy="220.1" r="0.6" fill="#e8e4ff" opacity="0.4"/>
<circle cx="520.4" cy="258.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="311.5" cy="333" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="183.3" cy="398.9" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="187.8" cy="403.2" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="443.7" cy="284.4" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="251.9" cy="362.3" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="444.2" cy="270" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="563.9" cy="198.4" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="657.1" cy="163.4" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="654.9" cy="193.4" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="130.1" cy="421.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="658.2" cy="197.4" r="0.4" fill="#e8e4ff" opacity="0.3"/>
<circle cx="284.9" cy="339.6" r="0.5" fill="#e8e4ff" opacity="0.6"/>
<circle cx="440.7" cy="273.1" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="149.4" cy="408.1" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="400.7" cy="361.4" r="0.4" fill="#e8e4ff" opacity="0.6"/>
<circle cx="264.9" cy="373" r="0.5" fill="#e8e4ff" opacity="0.4"/>
<circle cx="537" cy="217.7" r="0.6" fill="#e8e4ff" opacity="0.3"/>
<circle cx="687.1" cy="197.2" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="130.1" cy="409.7" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="307.4" cy="340" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="388.9" cy="316.4" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="550.6" cy="228" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="330.2" cy="279" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="464.6" cy="264.8" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="428.5" cy="282.7" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="170" cy="413.7" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="161.7" cy="418.4" r="0.4" fill="#e8e4ff" opacity="0.4"/>
<circle cx="565.8" cy="245" r="0.7" fill="#e8e4ff" opacity="0.3"/>
<circle cx="581.9" cy="246.5" r="0.4" fill="#e8e4ff" opacity="0.5"/>
<circle cx="582.5" cy="229.1" r="0.5" fill="#e8e4ff" opacity="0.3"/>
<circle cx="249.1" cy="351.9" r="0.7" fill="#e8e4ff" opacity="0.4"/>
<circle cx="211" cy="408.4" r="0.6" fill="#e8e4ff" opacity="0.5"/>
<circle cx="223.4" cy="370.6" r="0.5" fill="#e8e4ff" opacity="0.5"/>
<circle cx="410.9" cy="470.5" r="0.5" fill="#ffffff" opacity="0.8" class="q-tw" style="animation-delay:-0.8s"/>
<circle cx="531.4" cy="174.8" r="0.6" fill="#dfe8ff" opacity="0.5"/>
<circle cx="217.7" cy="316.1" r="1.3" fill="#ffe0f0" opacity="0.7"/>
<circle cx="169.1" cy="103.3" r="0.9" fill="#ffffff" opacity="0.5"/>
<circle cx="181.4" cy="202.8" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="521.1" cy="385.6" r="1.3" fill="#ffe0f0" opacity="0.5"/>
<circle cx="499.4" cy="234.9" r="1.3" fill="#ffffff" opacity="0.9"/>
<circle cx="337" cy="114.2" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="370.5" cy="342.3" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="181.3" cy="240.7" r="1.1" fill="#ffffff" opacity="0.4" class="q-tw" style="animation-delay:-3.5s"/>
<circle cx="461.5" cy="178.8" r="0.6" fill="#ffffff" opacity="0.8"/>
<circle cx="507.9" cy="390.1" r="1.6" fill="#ffffff" opacity="0.8"/>
<circle cx="209.2" cy="181.6" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="182" cy="149.3" r="0.5" fill="#ffe0f0" opacity="0.9"/>
<circle cx="171.7" cy="324.5" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="238.6" cy="442.9" r="1.3" fill="#ffffff" opacity="0.7"/>
<circle cx="179.9" cy="162.2" r="1" fill="#ffffff" opacity="0.8"/>
<circle cx="394.5" cy="187.6" r="1.6" fill="#ffffff" opacity="0.6"/>
<circle cx="425.7" cy="315.4" r="1.6" fill="#ffffff" opacity="0.9" class="q-tw" style="animation-delay:-5s"/>
<circle cx="286.7" cy="331.4" r="0.9" fill="#fff1d6" opacity="0.7"/>
<circle cx="505.8" cy="191.1" r="0.6" fill="#ffffff" opacity="0.9"/>
<circle cx="234.1" cy="548" r="0.5" fill="#ffe0f0" opacity="0.7"/>
<circle cx="229.4" cy="526.2" r="0.7" fill="#ffe0f0" opacity="0.8"/>
<circle cx="579.2" cy="185.7" r="1.6" fill="#ffffff" opacity="0.8"/>
<circle cx="314" cy="502.7" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="504.1" cy="388.1" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="427.8" cy="300.5" r="0.9" fill="#ffffff" opacity="0.7"/>
<circle cx="389.9" cy="146.9" r="1.6" fill="#ffffff" opacity="0.8" class="q-tw" style="animation-delay:-0.1s"/>
<circle cx="280.6" cy="223.6" r="0.8" fill="#dfe8ff" opacity="0.8"/>
<circle cx="407.4" cy="260.9" r="0.5" fill="#dfe8ff" opacity="0.6"/>
<circle cx="600.1" cy="339" r="1.6" fill="#ffffff" opacity="0.8"/>
<circle cx="336.8" cy="119.7" r="0.6" fill="#ffe0f0" opacity="0.9"/>
<circle cx="568" cy="378" r="1" fill="#fff1d6" opacity="0.5"/>
<circle cx="634.1" cy="229.2" r="0.5" fill="#fff1d6" opacity="0.9"/>
<circle cx="320.8" cy="355.9" r="1.3" fill="#ffffff" opacity="0.7"/>
<circle cx="626.1" cy="100.6" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="169.9" cy="479.7" r="1.6" fill="#ffffff" opacity="0.6" class="q-tw" style="animation-delay:-3.8s"/>
<circle cx="234.2" cy="463.5" r="1.3" fill="#ffffff" opacity="0.9"/>
<circle cx="544.3" cy="246.2" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="622.7" cy="293.8" r="0.9" fill="#dfe8ff" opacity="0.9"/>
<circle cx="339.5" cy="481.4" r="0.6" fill="#ffffff" opacity="0.7"/>
<circle cx="228.3" cy="461.9" r="1.6" fill="#ffffff" opacity="0.9"/>
<circle cx="472.1" cy="518.2" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="409.2" cy="544" r="0.8" fill="#ffffff" opacity="0.4"/>
<circle cx="615.3" cy="385.1" r="1.3" fill="#ffffff" opacity="0.7"/>
<circle cx="277.5" cy="257" r="1" fill="#fff1d6" opacity="0.5" class="q-tw" style="animation-delay:-4s"/>
<circle cx="531" cy="528.5" r="0.8" fill="#fff1d6" opacity="0.4"/>
<circle cx="275.3" cy="512.4" r="0.8" fill="#dfe8ff" opacity="0.6"/>
<circle cx="442.9" cy="143.4" r="0.7" fill="#ffffff" opacity="0.5"/>
<circle cx="483.6" cy="151.9" r="1.1" fill="#ffe0f0" opacity="0.5"/>
<circle cx="404.3" cy="329.9" r="0.5" fill="#fff1d6" opacity="0.6"/>
<circle cx="223.1" cy="539.6" r="0.8" fill="#dfe8ff" opacity="0.4"/>
<circle cx="267.7" cy="545.5" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="498" cy="309.6" r="1.6" fill="#dfe8ff" opacity="0.9"/>
<circle cx="261.5" cy="516.2" r="0.6" fill="#fff1d6" opacity="0.9" class="q-tw" style="animation-delay:-2s"/>
<circle cx="490.8" cy="519.3" r="0.6" fill="#ffe0f0" opacity="0.9"/>
<circle cx="181.6" cy="151.9" r="1.6" fill="#ffffff" opacity="0.5"/>
<circle cx="563.7" cy="303.6" r="0.7" fill="#ffe0f0" opacity="0.9"/>
<circle cx="203.4" cy="507.1" r="1.3" fill="#ffe0f0" opacity="0.4"/>
<circle cx="370.8" cy="453.8" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="600.3" cy="435" r="1.6" fill="#ffffff" opacity="0.6"/>
<circle cx="220.9" cy="160.4" r="1" fill="#ffe0f0" opacity="0.7"/>
<circle cx="630.6" cy="217.9" r="1.1" fill="#ffffff" opacity="0.9"/>
<circle cx="503.1" cy="153.8" r="1.1" fill="#ffffff" opacity="0.9" class="q-tw" style="animation-delay:-1.8s"/>
<circle cx="264" cy="121.1" r="0.8" fill="#ffffff" opacity="0.4"/>
<circle cx="260.7" cy="410.9" r="1" fill="#ffffff" opacity="0.5"/>
<circle cx="348.6" cy="307.7" r="1.1" fill="#ffffff" opacity="0.8"/>
<circle cx="324.5" cy="268.4" r="1.1" fill="#ffe0f0" opacity="0.5"/>
<circle cx="263.8" cy="490.6" r="1.6" fill="#fff1d6" opacity="0.7"/>
<circle cx="540.6" cy="313.5" r="1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="436.8" cy="377.1" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="181.5" cy="475.5" r="1.1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="557.6" cy="134.6" r="1.3" fill="#fff1d6" opacity="0.5" class="q-tw" style="animation-delay:-1.3s"/>
<circle cx="601.1" cy="380.4" r="0.7" fill="#ffffff" opacity="0.7"/>
<circle cx="491.8" cy="142.5" r="1.1" fill="#dfe8ff" opacity="0.5"/>
<circle cx="516.3" cy="344.3" r="0.8" fill="#fff1d6" opacity="0.9"/>
<circle cx="448.9" cy="288.5" r="0.9" fill="#ffe0f0" opacity="0.5"/>
<circle cx="211.7" cy="498" r="0.9" fill="#ffe0f0" opacity="0.5"/>
<circle cx="449.5" cy="419.5" r="1.1" fill="#ffffff" opacity="0.5"/>
<circle cx="420.2" cy="402.2" r="0.5" fill="#fff1d6" opacity="0.7"/>
<circle cx="604.1" cy="310.6" r="1.6" fill="#dfe8ff" opacity="0.7"/>
<circle cx="488.5" cy="413.1" r="1" fill="#ffffff" opacity="0.8" class="q-tw" style="animation-delay:-2.6s"/>
<circle cx="227.3" cy="320" r="0.7" fill="#fff1d6" opacity="0.5"/>
<circle cx="586.9" cy="349" r="1.3" fill="#ffe0f0" opacity="0.6"/>
<circle cx="532.7" cy="130" r="1" fill="#ffe0f0" opacity="0.9"/>
<circle cx="169.7" cy="511.2" r="0.9" fill="#ffffff" opacity="0.8"/>
<circle cx="348.8" cy="534" r="1.3" fill="#ffe0f0" opacity="0.4"/>
<circle cx="473.3" cy="112.5" r="1" fill="#ffffff" opacity="0.9"/>
<circle cx="204.7" cy="224.1" r="1.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="607.1" cy="225.7" r="1.3" fill="#ffffff" opacity="0.5"/>
<circle cx="378.3" cy="330.1" r="0.8" fill="#ffffff" opacity="0.9" class="q-tw" style="animation-delay:-4.4s"/>
<circle cx="227.8" cy="507.1" r="0.5" fill="#ffe0f0" opacity="0.4"/>
<circle cx="273.5" cy="509.8" r="1" fill="#ffe0f0" opacity="0.5"/>
<circle cx="587.7" cy="336" r="1.3" fill="#fff1d6" opacity="0.6"/>
<circle cx="591.5" cy="194" r="0.5" fill="#dfe8ff" opacity="0.9"/>
<circle cx="412.3" cy="403" r="1.6" fill="#ffffff" opacity="0.9"/>
<circle cx="620.2" cy="145.3" r="0.6" fill="#dfe8ff" opacity="0.7"/>
<circle cx="551.8" cy="509.3" r="1.6" fill="#dfe8ff" opacity="0.4"/>
<circle cx="254.6" cy="286.7" r="0.8" fill="#ffe0f0" opacity="0.8"/>
<circle cx="386.8" cy="317.4" r="0.6" fill="#ffe0f0" opacity="0.4" class="q-tw" style="animation-delay:-1.9s"/>
<circle cx="438.5" cy="334.7" r="1" fill="#fff1d6" opacity="0.4"/>
<circle cx="169.3" cy="522.9" r="1" fill="#ffe0f0" opacity="0.8"/>
<circle cx="166.3" cy="422.2" r="1" fill="#ffffff" opacity="0.6"/>
<circle cx="226.6" cy="245" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="419.1" cy="383.1" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="236.7" cy="452.3" r="0.5" fill="#dfe8ff" opacity="0.8"/>
<circle cx="168.6" cy="173.1" r="0.6" fill="#dfe8ff" opacity="0.8"/>
<circle cx="625.6" cy="218.7" r="0.6" fill="#ffffff" opacity="0.8"/>
<circle cx="389.9" cy="297.5" r="0.5" fill="#ffffff" opacity="0.7" class="q-tw" style="animation-delay:-3.1s"/>
<circle cx="219.2" cy="477.3" r="0.5" fill="#dfe8ff" opacity="0.5"/>
<circle cx="536.7" cy="293.1" r="0.9" fill="#ffffff" opacity="0.6"/>
<circle cx="566.5" cy="292.9" r="1.3" fill="#ffe0f0" opacity="0.8"/>
<circle cx="349" cy="266.3" r="1.1" fill="#ffe0f0" opacity="0.4"/>
<circle cx="418.5" cy="127.3" r="1.1" fill="#ffffff" opacity="0.6"/>
<circle cx="349.1" cy="114.8" r="1.6" fill="#fff1d6" opacity="0.6"/>
<circle cx="618.3" cy="433.2" r="1" fill="#fff1d6" opacity="0.4"/>
<circle cx="514.4" cy="345.2" r="0.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="311.4" cy="543.5" r="0.7" fill="#fff1d6" opacity="0.5" class="q-tw" style="animation-delay:-5s"/>
<circle cx="315.8" cy="381.6" r="1.6" fill="#fff1d6" opacity="0.9"/>
<circle cx="609.4" cy="120.9" r="0.5" fill="#ffffff" opacity="0.4"/>
<circle cx="557.1" cy="324.8" r="0.6" fill="#dfe8ff" opacity="0.6"/>
<circle cx="237.2" cy="469.2" r="1" fill="#fff1d6" opacity="0.7"/>
<circle cx="423.9" cy="315.4" r="0.7" fill="#ffe0f0" opacity="0.5"/>
<circle cx="534.6" cy="300.8" r="0.9" fill="#ffe0f0" opacity="0.4"/>
<circle cx="545.6" cy="297.6" r="0.8" fill="#ffe0f0" opacity="0.9"/>
<circle cx="595.4" cy="313.2" r="0.5" fill="#fff1d6" opacity="0.8"/>
<circle cx="627.9" cy="484" r="0.5" fill="#fff1d6" opacity="0.8" class="q-tw" style="animation-delay:-5.6s"/>
<circle cx="307.1" cy="274.1" r="0.6" fill="#ffffff" opacity="0.4"/>
<circle cx="175.6" cy="417.3" r="1.3" fill="#ffffff" opacity="0.8"/>
<circle cx="278.2" cy="108.3" r="1.3" fill="#ffffff" opacity="0.4"/>
<circle cx="372" cy="116.9" r="0.8" fill="#ffffff" opacity="0.9"/>
<circle cx="253.5" cy="443.7" r="1.6" fill="#ffe0f0" opacity="0.5"/>
<circle cx="341.7" cy="531.3" r="1.6" fill="#ffe0f0" opacity="0.4"/>
<circle cx="559.9" cy="440.3" r="1.6" fill="#fff1d6" opacity="0.8"/>
<circle cx="350.9" cy="397.7" r="1.6" fill="#ffffff" opacity="0.6"/>
<circle cx="421.7" cy="419" r="0.9" fill="#ffe0f0" opacity="0.8" class="q-tw" style="animation-delay:-4.7s"/>
<circle cx="382.4" cy="178.9" r="0.5" fill="#ffffff" opacity="0.6"/>
<circle cx="290.6" cy="489.5" r="1.6" fill="#ffffff" opacity="0.5"/>
<circle cx="608.7" cy="337.3" r="0.9" fill="#fff1d6" opacity="0.6"/>
<circle cx="197.6" cy="336.1" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="542.1" cy="475.8" r="0.7" fill="#dfe8ff" opacity="0.7"/>
<circle cx="510.8" cy="274.9" r="0.5" fill="#ffffff" opacity="0.5"/>
<circle cx="224.3" cy="494.9" r="0.5" fill="#ffffff" opacity="0.7"/>
<circle cx="579.1" cy="256.6" r="0.9" fill="#ffe0f0" opacity="0.4"/>
<circle cx="612.7" cy="179" r="0.6" fill="#dfe8ff" opacity="0.6" class="q-tw" style="animation-delay:-0.7s"/>
<circle cx="189.1" cy="350.3" r="1" fill="#ffffff" opacity="0.7"/>
<circle cx="581.2" cy="110.3" r="1.6" fill="#ffffff" opacity="0.4"/>
<circle cx="214.8" cy="173.5" r="1.6" fill="#dfe8ff" opacity="0.8"/>
<circle cx="368.6" cy="535.1" r="1.3" fill="#dfe8ff" opacity="0.5"/>
<circle cx="591.6" cy="342.2" r="0.6" fill="#ffffff" opacity="0.5"/>
<circle cx="418.1" cy="305.3" r="0.8" fill="#dfe8ff" opacity="0.4"/>
<circle cx="377.7" cy="458.9" r="0.9" fill="#ffe0f0" opacity="0.4"/>
<circle cx="219.2" cy="191.3" r="1.1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="432.5" cy="387.8" r="1" fill="#ffffff" opacity="0.6" class="q-tw" style="animation-delay:-2.8s"/>
<circle cx="468.8" cy="104.3" r="1" fill="#ffe0f0" opacity="0.7"/>
<circle cx="191.3" cy="329.5" r="0.9" fill="#ffe0f0" opacity="0.5"/>
<circle cx="276.9" cy="342.2" r="0.5" fill="#dfe8ff" opacity="0.6"/>
<circle cx="370.3" cy="268.2" r="0.7" fill="#dfe8ff" opacity="0.4"/>
<circle cx="274.3" cy="334.1" r="0.9" fill="#dfe8ff" opacity="0.7"/>
<circle cx="611.2" cy="230.9" r="0.9" fill="#dfe8ff" opacity="0.4"/>
<circle cx="282.2" cy="177.9" r="1" fill="#ffffff" opacity="0.4"/>
<circle cx="274.1" cy="292.8" r="0.8" fill="#fff1d6" opacity="0.9"/>
<circle cx="293.2" cy="257" r="1.1" fill="#fff1d6" opacity="0.7" class="q-tw" style="animation-delay:-5.2s"/>
<circle cx="431.6" cy="150.7" r="0.6" fill="#ffffff" opacity="0.6"/>
<circle cx="546.2" cy="529.2" r="1.1" fill="#dfe8ff" opacity="0.6"/>
<circle cx="568.8" cy="305.6" r="1.3" fill="#ffffff" opacity="0.4"/>
<circle cx="461.2" cy="173.8" r="1.1" fill="#dfe8ff" opacity="0.9"/>
<circle cx="533.5" cy="489.9" r="0.6" fill="#fff1d6" opacity="0.6"/>
<circle cx="483.3" cy="504.8" r="0.7" fill="#ffffff" opacity="0.4"/>
<circle cx="185.1" cy="114.1" r="0.8" fill="#fff1d6" opacity="0.4"/>
<circle cx="236" cy="150" r="9" fill="url(#q-starglow)"/><circle cx="236" cy="150" r="1.4" fill="#fff"/>
<circle cx="548" cy="212" r="7" fill="url(#q-starglow)"/><circle cx="548" cy="212" r="1.4" fill="#fff"/>
<circle cx="420" cy="128" r="6" fill="url(#q-starglow)"/><circle cx="420" cy="128" r="1.4" fill="#fff"/>
<circle cx="590" cy="420" r="8" fill="url(#q-starglow)"/><circle cx="590" cy="420" r="1.4" fill="#fff"/>
<circle cx="300" cy="300" r="5" fill="url(#q-starglow)"/><circle cx="300" cy="300" r="1.4" fill="#fff"/>
</g>
<g class="q-streaks" style="opacity:var(--q-burn,1)">
<line class="q-streak" x1="0" y1="381" x2="102.9" y2="381" stroke="url(#q-streak)" stroke-width="1.3" opacity="0.5" style="animation-duration:6.6s;animation-delay:-4s"/>
<line class="q-streak" x1="0" y1="175.1" x2="46.3" y2="175.1" stroke="url(#q-streak)" stroke-width="1.1" opacity="0.6" style="animation-duration:6.4s;animation-delay:-1.8s"/>
<line class="q-streak" x1="0" y1="150.9" x2="76.4" y2="150.9" stroke="url(#q-streak)" stroke-width="1.3" opacity="0.4" style="animation-duration:5.6s;animation-delay:-9.4s"/>
<line class="q-streak" x1="0" y1="351.5" x2="49" y2="351.5" stroke="url(#q-streak)" stroke-width="1.4" opacity="0.3" style="animation-duration:8.2s;animation-delay:-1.3s"/>
<line class="q-streak" x1="0" y1="119.4" x2="42.7" y2="119.4" stroke="url(#q-streak)" stroke-width="1.5" opacity="0.5" style="animation-duration:6s;animation-delay:-3.5s"/>
<line class="q-streak" x1="0" y1="390" x2="103.3" y2="390" stroke="url(#q-streak)" stroke-width="0.9" opacity="0.4" style="animation-duration:5.9s;animation-delay:-0.3s"/>
<line class="q-streak" x1="0" y1="227.7" x2="83.8" y2="227.7" stroke="url(#q-streak)" stroke-width="1.1" opacity="0.4" style="animation-duration:5.9s;animation-delay:-9.5s"/>
<line class="q-streak" x1="0" y1="434.3" x2="72.9" y2="434.3" stroke="url(#q-streak)" stroke-width="1.5" opacity="0.3" style="animation-duration:7.4s;animation-delay:-0.7s"/>
<line class="q-streak" x1="0" y1="191.7" x2="41.6" y2="191.7" stroke="url(#q-streak)" stroke-width="1.3" opacity="0.4" style="animation-duration:7.9s;animation-delay:-5.8s"/>
<line class="q-streak" x1="0" y1="259.1" x2="51.7" y2="259.1" stroke="url(#q-streak)" stroke-width="1.5" opacity="0.5" style="animation-duration:6s;animation-delay:-0.3s"/>
<line class="q-streak" x1="0" y1="154.9" x2="84.6" y2="154.9" stroke="url(#q-streak)" stroke-width="0.9" opacity="0.5" style="animation-duration:9s;animation-delay:-3.7s"/>
<line class="q-streak" x1="0" y1="436.8" x2="57.7" y2="436.8" stroke="url(#q-streak)" stroke-width="1.1" opacity="0.3" style="animation-duration:6.5s;animation-delay:-6.8s"/>
<line class="q-streak" x1="0" y1="414.6" x2="106.8" y2="414.6" stroke="url(#q-streak)" stroke-width="1.4" opacity="0.4" style="animation-duration:7.8s;animation-delay:-1.3s"/>
<line class="q-streak" x1="0" y1="176.5" x2="114.4" y2="176.5" stroke="url(#q-streak)" stroke-width="0.9" opacity="0.5" style="animation-duration:8s;animation-delay:-8.7s"/>
</g>
<circle cx="566" cy="168" r="13" fill="#9aa3b5"/>
<circle cx="561" cy="165" r="13" fill="#04060d" opacity=".55"/>
<circle cx="190" cy="690" r="250" fill="none" stroke="#7fd8e8" stroke-opacity=".10" stroke-width="22" filter="url(#q-blur)"/>
<circle cx="190" cy="690" r="250" fill="url(#q-planet)"/>
<path d="M-20 520 Q160 452 400 520 M0 556 Q180 494 420 560" stroke="#cfe8ff" stroke-opacity=".05" stroke-width="12" fill="none"/>
<circle cx="190" cy="690" r="250" fill="none" stroke="url(#q-atmo)" stroke-width="3"/>
<path d="M190 100 L260 100 L200 548 L160 548 Z" fill="#fff" opacity=".025"/>
<path d="M500 100 L540 100 L500 548 L480 548 Z" fill="#fff" opacity=".02"/>
</g>
<path d="M327 100 L321 548" stroke="#2a2230" stroke-width="9"/><path d="M324 100 L318 548" stroke="#5a4a5e" stroke-width="1.2"/>
<path d="M473 100 L479 548" stroke="#2a2230" stroke-width="9"/><path d="M470 100 L476 548" stroke="#5a4a5e" stroke-width="1.2"/>
<polygon points="180,100 620,100 640,548 160,548" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="3"/>
<path d="M136 560 L664 560 L672 576 L128 576 Z" fill="#3a2f3e"/>
<path d="M128 576 L672 576" stroke="#c9a560" stroke-opacity=".5" stroke-width="1.5"/>
<!-- the plaque -->
<rect x="656" y="40" width="80" height="560" fill="url(#q-pillar)"/>
<ellipse cx="696" cy="122" rx="44" ry="10" fill="#ffd89a" opacity=".12"/>
<rect x="684" y="112" width="24" height="5" rx="2.5" fill="#6b5a40"/>
<path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" fill="url(#q-brass)" stroke="#f3d898" stroke-width="1.2" stroke-opacity=".6"/>
<path d="M696 146 L709 174 L696 167 L683 174 Z" fill="#5a4520" opacity=".85"/>
<rect x="680" y="186" width="32" height="3" rx="1.5" fill="#5a4520" opacity=".9"/>
<rect x="678.6" y="210" width="34.9" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="679.6" y="225" width="32.9" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="677.8" y="240" width="36.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="686.7" y="255" width="18.5" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="682.4" y="277" width="27.3" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="679.1" y="292" width="33.7" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="677.2" y="307" width="37.7" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="688" y="322" width="16.1" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="681.7" y="344" width="28.7" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="679.3" y="359" width="33.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="680.9" y="374" width="30.2" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="685.8" y="389" width="20.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="682.5" y="411" width="27" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<rect x="678.3" y="426" width="35.4" height="2.2" rx="1" fill="#5a4520" opacity=".8"/>
<!-- the wall screen -->
<rect x="742" y="46" width="840" height="456" rx="20" fill="url(#q-screenglow)" opacity=".9"/>
<rect x="744" y="48" width="836" height="452" rx="18" fill="#0b0a10" stroke="#3d3242" stroke-width="2"/>
<rect x="752" y="56" width="820" height="436" rx="12" fill="#080a12"/>
<rect x="752" y="56" width="820" height="436" rx="12" fill="none" stroke="#e8c37a" stroke-opacity=".25" stroke-width="1"/>
<g opacity=".5">
<path d="M1162 232 L1184 282 L1162 270 L1140 282 Z" fill="none" stroke="#e8c37a" stroke-width="2.4" stroke-linejoin="round"/>
<text x="1162" y="314" text-anchor="middle" fill="#e8c37a" font-family="JetBrains Mono, monospace" font-size="13" letter-spacing="4">HERMES · HX-01</text>
<rect x="1102" y="328" width="120" height="2" rx="1" fill="#e8c37a" opacity=".5"/>
</g>
<!-- the desk -->
<ellipse cx="1166" cy="694" rx="420" ry="14" fill="url(#q-shadow)"/>
<path d="M790 586 L1542 586 L1558 604 L774 604 Z" fill="url(#q-desktop)"/>
<path d="M774 604 L1558 604" stroke="#c9a560" stroke-width="2.2" stroke-opacity=".8"/>
<path d="M776 606 L1556 606 L1546 690 L786 690 Z" fill="url(#q-deskfront)"/>
<path d="M800 652 L1532 652" stroke="#e8c37a" stroke-opacity=".12" stroke-width="1"/>
<rect x="874" y="574" width="16" height="14" fill="#3a3036"/>
<ellipse cx="882" cy="588" rx="30" ry="4" fill="#3a3036"/>
<rect x="808" y="506" width="148" height="72" rx="7" fill="#100d14" stroke="#4a3d4c" stroke-width="1.5"/>
<rect x="814" y="512" width="136" height="60" rx="4" fill="url(#q-termglass)"/>
<rect x="822" y="519" width="44" height="4" rx="2" fill="#e8c37a" opacity=".85"/>
<rect x="822" y="529" width="112" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>
<rect x="822" y="536" width="98" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>
<rect x="822" y="543" width="106" height="2.4" rx="1.2" fill="#e8c37a" opacity=".45"/>
<rect x="822" y="553" width="76" height="2.4" rx="1.2" fill="#e8c37a" opacity=".3"/>
<rect class="q-cursor" x="901" y="551" width="5" height="6" fill="#e8c37a"/>
<path d="M992 596 L1060 584 L1078 592 L1010 604 Z" fill="#1a161d" stroke="#5a4a50" stroke-width="1"/>
<path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" fill="#221c25" stroke="#7a6a5a" stroke-width="1.2"/>
<path d="M1010 587 L1064 578 L1076 584 L1022 593 Z" fill="url(#q-paddglass)"/>
<path d="M1022 585 L1050 580 M1025 588 L1058 582.5 M1028 590.5 L1046 587.5" stroke="#06120f" stroke-width="1.1" opacity=".6"/>
<path d="M1090 596 L1124 590" stroke="#c9a560" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="1150" cy="590" rx="22" ry="4" fill="#3a3036"/>
<path d="M1136 562 L1164 562 L1160 588 Q1150 592 1140 588 Z" fill="#e9e2d6"/>
<path d="M1164 568 q10 1 9 9 q-1 7 -11 6" fill="none" stroke="#e9e2d6" stroke-width="3"/>
<ellipse cx="1150" cy="562" rx="14" ry="3" fill="#7a4a2a"/>
<path class="q-steam" d="M1144 554 q-6 -10 0 -18 q6 -8 0 -18" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>
<path class="q-steam q-steam2" d="M1155 556 q-6 -10 0 -18 q6 -8 0 -18" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="1342" cy="592" rx="42" ry="6" fill="#2d252b" stroke="#6b5a40" stroke-width="1.2"/>
<rect x="1340" y="556" width="5" height="36" fill="url(#q-metal)"/>
<g id="q-model">
<path d="M1356 546 L1372 522 L1378 522 L1366 548 Z" fill="#3a4458"/>
<rect x="1334" y="511" width="92" height="7" rx="3.5" fill="#5d6a80"/>
<rect x="1350" y="512.5" width="66" height="2.6" rx="1.3" fill="#e889b6" opacity=".9"/>
<circle cx="1337" cy="514.5" r="3.2" fill="#ff6a50" opacity=".85"/>
<path d="M1346 550 L1364 528 L1372 528 L1358 552 Z" fill="#4a556b"/>
<path d="M1270 534 L1300 534 L1330 550 L1316 556 Z" fill="#56627a"/>
<path d="M1312 546 Q1312 540 1322 540 L1396 542 Q1408 546 1396 554 L1322 558 Q1312 556 1312 552 Z" fill="url(#q-hull)"/>
<circle cx="1316" cy="549" r="4.2" fill="#3fc1a5" opacity=".9"/>
<rect x="1340" y="519" width="94" height="8" rx="4" fill="#6f7b92"/>
<rect x="1356" y="520.6" width="70" height="3" rx="1.5" fill="#f0a948" opacity=".95"/>
<circle cx="1343" cy="523" r="3.6" fill="#ff6a50"/>
<ellipse cx="1262" cy="530" rx="66" ry="9.5" fill="url(#q-hull)"/>
<ellipse cx="1262" cy="525" rx="24" ry="4.5" fill="#a9b5ca"/>
<ellipse class="q-modelbridge" cx="1262" cy="520.5" rx="7" ry="2.6" fill="#e8c37a"/>
<path d="M1198 531 L1326 531" stroke="#1d2433" stroke-width="1"/>
<circle cx="1214" cy="529.5" r=".9" fill="#ffe7b0"/><circle cx="1230" cy="530" r=".9" fill="#ffe7b0"/><circle cx="1294" cy="530" r=".9" fill="#ffe7b0"/><circle cx="1310" cy="529.5" r=".9" fill="#ffe7b0"/>
</g>
<ellipse cx="1470" cy="592" rx="70" ry="10" fill="#ffd08a" opacity=".16"/>
<path d="M1462 532 L1420 590 L1520 590 Z" fill="url(#q-lampcone)"/>
<ellipse cx="1514" cy="590" rx="18" ry="4" fill="#3a3036"/>
<path d="M1514 588 Q1512 534 1480 520" fill="none" stroke="#8a7350" stroke-width="3" stroke-linecap="round"/>
<path d="M1454 524 L1488 508 L1496 520 L1468 538 Z" fill="#5a4a3a" stroke="#c9a560" stroke-width="1"/>
<ellipse cx="1462" cy="532" rx="9" ry="3.4" fill="#ffe2a8" transform="rotate(-28 1462 532)"/>
<!-- the chair, in front of the window -->
<ellipse cx="400" cy="714" rx="170" ry="20" fill="url(#q-shadow)"/>
<ellipse cx="400" cy="708" rx="84" ry="12" fill="#231c21" stroke="#c9a560" stroke-opacity=".45" stroke-width="1.5"/>
<path d="M384 648 L416 648 C418 672 426 690 440 704 L360 704 C374 690 382 672 384 648 Z" fill="url(#q-metal)"/>
<rect x="304" y="612" width="192" height="42" rx="18" fill="#1d1216"/>
<path d="M310 618 Q400 606 490 618" fill="none" stroke="#5a3a40" stroke-width="2" opacity=".6"/>
<path d="M322 590 L276 586 Q256 586 256 600 Q256 614 276 614 L326 618 Z" fill="url(#q-arm)"/>
<path d="M478 590 L524 586 Q544 586 544 600 Q544 614 524 614 L474 618 Z" fill="url(#q-arm)"/>
<path d="M262 592 L318 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>
<path d="M538 592 L482 594" stroke="#c9a560" stroke-opacity=".55" stroke-width="1.2"/>
<rect x="268" y="598" width="11" height="4" rx="2" fill="#3fc1a5" style="opacity:var(--q-local,1)"/>
<rect x="283" y="598" width="11" height="4" rx="2" fill="#f0a948" style="opacity:var(--q-codex,1)"/>
<rect x="298" y="598" width="11" height="4" rx="2" fill="#e889b6" style="opacity:var(--q-claude,1)"/>
<rect class="q-armlight" x="492" y="598" width="40" height="4" rx="2" fill="#e8c37a"/>
<path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#q-shell)"/>
<path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="url(#q-shell-top)"/>
<path d="M340 628 C328 556 312 470 315 402 C318 340 356 304 400 302 C444 304 482 340 485 402 C488 470 472 556 460 628" fill="none" stroke="#c9a560" stroke-width="1.8" stroke-opacity=".7"/>
<rect x="397.5" y="350" width="5" height="250" rx="2.5" fill="#c9a560" opacity=".22"/>
<path d="M400 318 L413 346 L400 339 L387 346 Z" fill="#e8c37a"/>
<path d="M400 318 L413 346 L400 339 Z" fill="#8a6a32" opacity=".5"/>
<path d="M304 430 C302 396 306 326 352 300 C372 290 388 288 400 288 C412 288 428 290 448 300 C494 326 498 396 496 430" fill="none" stroke="url(#q-rim)" stroke-width="2.6"/>
<path d="M322 420 C320 380 330 336 362 314" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="10" stroke-linecap="round"/>
<!-- highlights -->
<g id="q-hl-viewport" class="q-hl"><polygon points="166,86 634,86 656,566 144,566" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"/><polygon points="166,86 634,86 656,566 144,566" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="q-hl-chair" class="q-hl"><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"/><path d="M332 640 C318 560 298 470 302 398 C306 326 350 290 400 288 C450 290 494 326 498 398 C502 470 482 560 468 640 Z" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="q-hl-reading" class="q-hl"><rect x="22" y="78" width="114" height="522" rx="16" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"/><rect x="22" y="78" width="114" height="522" rx="16" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="q-hl-orders" class="q-hl"><path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"/><path d="M672 126 L720 126 L720 452 Q720 464 708 464 L684 464 Q672 464 672 452 Z" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="q-hl-log" class="q-hl"><rect x="808" y="506" width="148" height="72" rx="7" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"/><rect x="808" y="506" width="148" height="72" rx="7" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="q-hl-yeoman" class="q-hl"><path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"/><path d="M1000 588 L1068 576 L1086 584 L1018 596 Z" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<g id="q-hl-bridge" class="q-hl"><ellipse cx="1312" cy="534" rx="128" ry="34" fill="none" stroke="#ffd98a" stroke-width="3" filter="url(#q-blur)"/><ellipse cx="1312" cy="534" rx="128" ry="34" fill="none" stroke="#ffe2a8" stroke-width="1.5"/></g>
<rect width="1600" height="740" fill="url(#q-vignette)" pointer-events="none"/>
</svg>
`,Yt={w:1600,h:740},Xt=[{id:`reading`,box:[22,78,114,522],label:[79,60]},{id:`viewport`,box:[144,86,512,480],label:[400,122]},{id:`chair`,box:[256,288,288,432],label:[400,262]},{id:`orders`,box:[664,110,64,360],label:[738,492],hang:!0},{id:`log`,box:[804,502,156,92],label:[882,630]},{id:`yeoman`,box:[988,570,104,40],label:[1040,630]},{id:`bridge`,box:[1190,496,250,100],label:[1312,630]}],Zt={x:752,y:56,w:820,h:436},N=(e,t)=>`${(e/t*100).toFixed(3)}%`,Qt={ease:`M3 11l9-7 9 7 M5 10v10h14V10 M10 20v-6h4v6`,chair:`M7 3h10v10H7z M5 13h14 M8 13v4 M16 13v4 M12 17v4 M8 21h8`,viewport:`M4 5h16l-1.5 14h-13z M10 5l-.8 14 M14 5l.8 14`,reading:`M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z`,orders:`M7 3h10v18H7z M12 5.5l2 4-2-1.2-2 1.2z M9.5 12h5 M9.5 15h5 M9.5 18h3`,log:`M4 4h16v12H4z M8 20h8 M12 16v4 M7 8h7 M7 11h10`,yeoman:`M8 4h8v3H8z M6 5H5v16h14V5h-1 M8 12l2 2 4-4 M8 17h8`,bridge:`M12 3l7 18-7-4-7 4z`};function $t(e){let t=Number(new Intl.DateTimeFormat(`en-GB`,{hour:`numeric`,hourCycle:`h23`,timeZone:`Europe/Stockholm`}).format(e));return t>=5&&t<12?`Good morning, Captain.`:t>=12&&t<17?`Good afternoon, Captain.`:t>=17&&t<23?`Good evening, Captain.`:`The late watch, Captain.`}function en(e){let t=e.getUTCFullYear(),n=Date.UTC(t,0,1),r=(Date.UTC(t+1,0,1)-n)/864e5,i=Math.floor((e.getTime()-n)/864e5/r*1e3);return`${t}.${String(i).padStart(3,`0`)}`}var tn=new Intl.DateTimeFormat(`en-GB`,{hour:`numeric`,minute:`numeric`,hourCycle:`h23`,timeZone:`Europe/Stockholm`});function nn(e){let t=tn.formatToParts(new Date(e));return[Number(t.find(e=>e.type===`hour`).value),Number(t.find(e=>e.type===`minute`).value)]}function rn(e,t,n=3e5){let r=[],i=null;for(let a=e;a<=t;a+=n){let[e]=nn(a),t=e>=22||e<7;t&&i===null&&(i=a),!t&&i!==null&&(r.push([i,a]),i=null)}return i!==null&&r.push([i,t]),r}var an=(0,l.memo)(function(){return(0,E.jsx)(`div`,{className:`room-art-svg`,dangerouslySetInnerHTML:{__html:Jt}})});function on({ship:e,on:t,labels:n,onPick:r,children:i}){let[a,o]=(0,l.useState)(null),s=e.data.rails.rails.some(t=>t.burn?.active&&e.rail(t.id)!==`out`),c={"--q-local":e.rail(`local`)===`out`?.12:1,"--q-codex":e.rail(`codex`)===`out`?.12:1,"--q-claude":e.rail(`claude`)===`out`?.12:1,"--q-burn":+!!s};return(0,E.jsxs)(`section`,{className:`room`,"aria-label":`Captain's Quarters`,children:[(0,E.jsxs)(`div`,{className:`hero-top`,children:[(0,E.jsx)(`p`,{className:`mono hero-label`,children:`DECK 2 · THE CAPTAIN'S QUARTERS · PICK SOMETHING IN THE ROOM`}),(0,E.jsx)(`p`,{className:`mono hero-label room-hint`,children:`ESC RETURNS THE WALL SCREEN TO AT EASE`})]}),(0,E.jsxs)(`div`,{className:`room-wrap`,children:[(0,E.jsxs)(`div`,{className:`room-pic`,"data-hot":a??``,"data-on":t??``,style:c,children:[(0,E.jsx)(`div`,{className:`room-art`,"aria-hidden":`true`,children:(0,E.jsx)(an,{})}),Xt.map(({id:e,box:[i,a,s,c],label:[l,u],hang:d})=>(0,E.jsx)(`button`,{type:`button`,className:`spot spot-${e}`,"aria-pressed":t===e,"aria-label":n[e].meta?`${n[e].name}, ${n[e].meta}`:n[e].name,style:{left:N(i,Yt.w),top:N(a,Yt.h),width:N(s,Yt.w),height:N(c,Yt.h)},onPointerEnter:()=>o(e),onPointerLeave:()=>o(null),onFocus:()=>o(e),onBlur:()=>o(null),onClick:()=>r(e),children:(0,E.jsxs)(`span`,{className:`spot-label`+(d?` hang`:``),style:{left:N(l-i,s),top:N(u-a,c)},children:[(0,E.jsx)(`span`,{className:`spot-name`,children:n[e].name}),n[e].meta&&(0,E.jsx)(`span`,{className:`spot-meta mono`,children:n[e].meta})]})},e))]}),(0,E.jsx)(`div`,{className:`wall-slot`,style:{"--x":N(Zt.x,Yt.w),"--y":N(Zt.y,Yt.h),"--w":N(Zt.w,Yt.w),"--h":N(Zt.h,Yt.h)},children:i})]})]})}var sn=e=>e;function cn(e){return e.data.orders.orders.filter(e=>e.state===`awaiting-captain`).sort((e,t)=>t.tier-e.tier)}function ln({ship:e,screen:t,desk:n,onScreen:r,onLog:i,onTick:a,onRelieve:o}){let s=()=>r({view:`ease`});ht(t.view!==`ease`,s);let c=t.view===`station`?_t(e.station(t.id)):`var(--captain)`,l;switch(t.view){case`chair`:l=(0,E.jsx)(pn,{ship:e,hail:t.hail,onScreen:r,onBack:s});break;case`viewport`:l=(0,E.jsx)(_n,{ship:e,onBack:s});break;case`log`:l=(0,E.jsx)(yn,{ship:e,desk:n,onLog:i,onBack:s});break;case`yeoman`:l=(0,E.jsx)(xn,{ship:e,desk:n,onTick:a,onBack:s});break;case`orders`:l=(0,E.jsx)(Sn,{ship:e,onBack:s});break;case`reading`:l=(0,E.jsx)(Cn,{ship:e,onBack:s});break;case`station`:{let n=e.station(t.id);l=n&&(0,E.jsx)(Ct,{ship:e,st:n,orderId:t.order,back:`‹ At ease`,onBack:s,actions:ae(n)&&(0,E.jsx)(`button`,{type:`button`,className:`con-back relieve`,"aria-pressed":e.relieved.has(n.id),onClick:()=>o(n.id),children:e.relieved.has(n.id)?`Recall`:`Relieve`})});break}default:l=(0,E.jsx)(dn,{ship:e,desk:n,onScreen:r})}return(0,E.jsx)(`section`,{className:`console wall`,role:`region`,"aria-label":`Wall screen`,style:sn({"--c":c}),children:l})}function un(e){let[t,n]=(0,l.useState)(()=>new Date);return(0,l.useEffect)(()=>{let t=setInterval(()=>n(new Date),e);return()=>clearInterval(t)},[e]),t}function dn({ship:e,desk:t,onScreen:n}){let r=un(3e4),i=e.data.quarters,a=cn(e),o=hn(e),s=gn(e),c=i.yeoman.filter(e=>!t.ticked.has(e.id)).sort((e,t)=>e.due.localeCompare(t.due)),l=t.entries[0]??i.log[0],u=i.reading,d=e.data.ship.captain.conn===`captain`?`YOU HAVE THE CONN`:`NUMBER ONE HAS THE CONN`;return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.ease,title:$t(r),sub:`${ve(r)} · ${ge(r)} · STARDATE ${en(r)} · ${d}`}),(0,E.jsx)(`div`,{className:`con-body`,children:(0,E.jsxs)(`div`,{className:`ease`,children:[(0,E.jsx)(fn,{icon:`chair`,label:`THE CHAIR · HAILS`,figure:String(a.length),onClick:()=>n({view:`chair`}),text:a[0]?.title??`Nothing waits for you.`,foot:a[0]?`TIER ${a[0].tier} FIRST · ${a[0].id}`:`ALL QUIET`}),(0,E.jsx)(fn,{icon:`viewport`,label:`VIEWPORT · WINDOWS`,figure:o?`Burn`:s[0]?ge(s[0].at):`—`,onClick:()=>n({view:`viewport`}),text:o?`Dilithium Burn until ${D(o.until)}.`:`No burn window open.`,foot:s[0]?`NEXT RESET ${ge(s[0].at)} · ${s[0].rail.label.toUpperCase()} ${s[0].week?`WEEK`:`5 H`}`:`NO RESETS AHEAD`}),(0,E.jsx)(fn,{icon:`yeoman`,label:`PADD · THE YEOMAN`,figure:String(c.length),onClick:()=>n({view:`yeoman`}),text:c[0]?.text??`Your list is clear.`,foot:c[0]?`${bn[c[0].kind].toUpperCase()} · ${D(c[0].due).toUpperCase()}`:`NOTHING DUE`}),(0,E.jsx)(fn,{icon:`log`,label:`TERMINAL · CAPTAIN'S LOG`,onClick:()=>n({view:`log`}),figure:String(t.entries.length+i.log.length),text:l?.text??`No entries yet.`,foot:l?`LAST ENTRY ${D(l.at).toUpperCase()}`:`LOCAL RAIL ONLY`}),(0,E.jsx)(fn,{icon:`orders`,label:`PLAQUE · STANDING ORDERS`,figure:String(i.standingOrders.length),onClick:()=>n({view:`orders`}),text:i.standingOrders[0],foot:`ONLY YOU CHANGE THEM`}),(0,E.jsx)(fn,{icon:`reading`,label:`SHELF · READING YEAR`,figure:`${u.read}/${u.goal}`,onClick:()=>n({view:`reading`}),text:u.current[0]?`${u.current[0].title}, ${u.current[0].percent}% read.`:`Nothing open.`,foot:`${Math.max(0,u.goal-u.read)} TO GO BY 31 DEC ${u.year}`})]})})]})}function fn({icon:e,label:t,figure:n,text:r,foot:i,onClick:a}){return(0,E.jsxs)(`button`,{type:`button`,className:`ease-tile`,onClick:a,children:[(0,E.jsxs)(`span`,{className:`ease-label mono`,children:[(0,E.jsx)(`svg`,{viewBox:`0 0 24 24`,"aria-hidden":`true`,children:(0,E.jsx)(`path`,{d:Qt[e]})}),t]}),(0,E.jsx)(`span`,{className:`ease-figure`,children:n}),(0,E.jsx)(`span`,{className:`ease-text`,children:r}),(0,E.jsx)(`span`,{className:`ease-foot mono`,children:i})]})}function pn({ship:e,hail:t,onScreen:n,onBack:r}){let i=cn(e),a=Math.max(0,i.findIndex(e=>e.id===t)),o=i[a];if(!o)return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.chair,title:`The chair`,sub:`NOTHING WAITS FOR YOU`,back:`‹ At ease`,onBack:r}),(0,E.jsx)(`div`,{className:`con-body`,children:(0,E.jsx)(`p`,{className:`empty`,children:`Nothing waits for you. The chair is yours.`})})]});let s=e.station(o.station),c=e.data.quarters.missions.find(e=>e.id===o.mission),l=e=>n({view:`chair`,hail:i[(a+e+i.length)%i.length].id});return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.chair,title:`Awaiting your orders`,back:`‹ At ease`,onBack:r,sub:`HAIL ${a+1} OF ${i.length} · HIGHEST TIER FIRST`,children:i.length>1&&(0,E.jsxs)(`span`,{className:`stepper`,children:[(0,E.jsx)(`button`,{type:`button`,className:`con-back`,"aria-label":`Previous hail`,onClick:()=>l(-1),children:`‹`}),(0,E.jsx)(`button`,{type:`button`,className:`con-back`,"aria-label":`Next hail`,onClick:()=>l(1),children:`›`})]})}),(0,E.jsx)(`div`,{className:`con-body`,children:(0,E.jsxs)(`article`,{className:`hailcard`,style:sn({"--c":`var(--tier-${o.tier})`}),children:[(0,E.jsxs)(`div`,{className:`hailcard-meta`,children:[(0,E.jsx)(`span`,{className:`idtag`,children:o.id}),(0,E.jsx)(`span`,{className:`railpill`,style:sn({"--c":T(s?.rail??`mixed`)}),children:(s?.short??o.station).toUpperCase()}),(0,E.jsxs)(`span`,{className:`tierpill`,style:sn({"--c":`var(--tier-${o.tier})`}),children:[`TIER `,o.tier]}),o.speed&&(0,E.jsx)(`span`,{className:`idtag`,children:o.speed.toUpperCase()}),c&&(0,E.jsxs)(`span`,{className:`idtag`,children:[c.id,` · `,c.name.toUpperCase()]}),(0,E.jsx)(`span`,{className:`idtag`,children:ye(e.data.orders.asOf,o.updatedAt).toUpperCase()})]}),(0,E.jsx)(`h3`,{className:`hailcard-title`,children:o.title}),o.detail&&(0,E.jsx)(`p`,{className:`con-text`,children:o.detail}),o.body&&(0,E.jsx)(Te,{text:o.body})]})}),(0,E.jsxs)(`div`,{className:`wall-actions`,children:[(0,E.jsx)(`button`,{type:`button`,className:`btn btn-ghost`,disabled:!0,children:`Deny`}),(0,E.jsx)(`button`,{type:`button`,className:`btn btn-ghost`,disabled:!0,children:`Write`}),(0,E.jsx)(`button`,{type:`button`,className:`btn btn-gold`,disabled:!0,children:`Approve`}),(0,E.jsx)(`span`,{className:`con-hint`,children:`Orders arrive in H4. Nothing here reaches the crew yet.`})]})]})}var mn=36e5;function hn(e){let t=e.data.rails.rails.find(t=>t.burn?.active&&t.burn.until&&e.rail(t.id)!==`out`);return t?.burn?.until?{rail:t,until:t.burn.until}:null}function gn(e){let t=Date.parse(e.data.rails.asOf);return e.data.rails.rails.flatMap(e=>e.meters.filter(e=>e.resetsAt&&Date.parse(e.resetsAt)>t).map(t=>({rail:e,label:t.label,percent:t.percent,week:t.id===`week`,at:t.resetsAt}))).sort((e,t)=>e.at.localeCompare(t.at))}function _n({ship:e,onBack:t}){let n=hn(e),r=gn(e),i=Date.parse(e.data.rails.asOf);return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.viewport,title:`Windows ahead`,back:`‹ At ease`,onBack:t,sub:`THE NEXT 24 HOURS FROM ${D(e.data.rails.asOf).toUpperCase()} · SAMPLE READING`}),(0,E.jsxs)(`div`,{className:`con-body`,children:[(0,E.jsxs)(`p`,{className:`burnline`,children:[n?(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`span`,{className:`state burn`,children:`DILITHIUM BURN`}),` Open until `,D(n.until),`: held Burn cards run on `,n.rail.label,`.`]}):(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`span`,{className:`state`,children:`NO BURN`}),` No burn window is open.`]}),` `,`Overnight, Codex and Claude may use their full windows.`]}),(0,E.jsx)(vn,{ship:e,from:i,burn:n}),(0,E.jsxs)(`table`,{className:`resets`,children:[(0,E.jsx)(`caption`,{className:`mono`,children:`EVERY RESET AHEAD`}),(0,E.jsx)(`thead`,{children:(0,E.jsxs)(`tr`,{children:[(0,E.jsx)(`th`,{children:`WHEN`}),(0,E.jsx)(`th`,{children:`RAIL`}),(0,E.jsx)(`th`,{children:`WINDOW`}),(0,E.jsx)(`th`,{children:`USED NOW`})]})}),(0,E.jsx)(`tbody`,{children:r.map(t=>(0,E.jsxs)(`tr`,{className:Date.parse(t.at)>i+24*mn?`later`:void 0,children:[(0,E.jsx)(`td`,{className:`mono`,children:D(t.at)}),(0,E.jsxs)(`td`,{children:[(0,E.jsx)(`span`,{className:`dot`,style:sn({"--c":T(t.rail.id)})}),t.rail.label]}),(0,E.jsx)(`td`,{children:t.label}),(0,E.jsx)(`td`,{className:`mono`,children:e.rail(t.rail.id)===`out`?`out`:`${t.percent}%`})]},t.rail.id+t.label))})]})]})]})}function vn({ship:e,from:t,burn:n}){let r=t+24*mn,[i,a]=(0,l.useState)(null),o=[`claude`,`codex`],s=e=>92+(Math.min(Math.max(e,t),r)-t)/(r-t)*652,c=e=>44+e*40,u=(0,l.useMemo)(()=>{let e=[];for(let n=Math.ceil(t/9e5)*15*6e4;n<=r;n+=9e5){let[t,r]=nn(n);r===0&&t%3==0&&e.push({t:n,label:t===0?D(new Date(n).toISOString()).split(` `)[0].toUpperCase():String(t).padStart(2,`0`),day:t===0})}return e},[t,r]),d=(0,l.useMemo)(()=>rn(t,r),[t,r]);return(0,E.jsxs)(`figure`,{className:`wchart`,children:[(0,E.jsxs)(`svg`,{viewBox:`0 0 760 132`,role:`img`,"aria-label":`Rail windows over the next 24 hours: nights, the burn and every reset. The table below lists the same.`,children:[d.map(([e,t])=>(0,E.jsx)(`rect`,{className:`w-night`,x:s(e),y:22,width:s(t)-s(e),height:88,rx:4},e)),d[0]&&(0,E.jsx)(`text`,{className:`w-note`,x:(s(d[0][0])+s(d[0][1]))/2,y:16,textAnchor:`middle`,children:`NIGHT · FULL WINDOWS`}),u.map(e=>(0,E.jsxs)(`g`,{children:[(0,E.jsx)(`line`,{className:`w-grid`,x1:s(e.t),x2:s(e.t),y1:22,y2:110}),(0,E.jsx)(`text`,{className:`w-tick`+(e.day?` day`:``),x:s(e.t),y:126,textAnchor:`middle`,children:e.label})]},e.t)),o.map((o,l)=>{let u=e.data.rails.rails.find(e=>e.id===o),d=c(l),f=e.rail(o)===`out`;return(0,E.jsxs)(`g`,{style:sn({"--c":T(o)}),className:f?`w-out`:void 0,children:[(0,E.jsx)(`circle`,{cx:14,cy:d,r:4,className:`w-key`}),(0,E.jsx)(`text`,{className:`w-lane`,x:24,y:d+4,children:y[o].legend}),(0,E.jsx)(`line`,{className:`w-track`,x1:92,x2:744,y1:d,y2:d}),n&&n.rail.id===o&&(0,E.jsxs)(`g`,{children:[(0,E.jsx)(`rect`,{className:`w-burn`,x:92,y:d-7,width:s(Date.parse(n.until))-92,height:14,rx:4}),(0,E.jsx)(`text`,{className:`w-burn-label`,x:100,y:d+3.5,children:`BURN`})]}),u?.meters.filter(e=>e.resetsAt).map(e=>{let n=Date.parse(e.resetsAt),c=o+e.id,l=n>t&&n<=r,f=`${u.label} ${e.label} resets ${D(e.resetsAt)} · ${e.percent}% used now`;if(!l)return n>r?(0,E.jsxs)(`g`,{className:`w-mark`,tabIndex:0,onPointerEnter:()=>a(c),onPointerLeave:()=>a(null),onFocus:()=>a(c),onBlur:()=>a(null),children:[(0,E.jsx)(`title`,{children:f}),(0,E.jsx)(`rect`,{x:738,y:d-12,width:24,height:24,fill:`transparent`}),(0,E.jsx)(`path`,{className:`w-later`,d:`M746 ${d-6} l7 6 -7 6`})]},c):null;let p=s(n);return(0,E.jsxs)(`g`,{className:`w-mark`,tabIndex:0,onPointerEnter:()=>a(c),onPointerLeave:()=>a(null),onFocus:()=>a(c),onBlur:()=>a(null),children:[(0,E.jsx)(`title`,{children:f}),(0,E.jsx)(`rect`,{x:p-12,y:d-14,width:24,height:28,fill:`transparent`}),e.id===`week`?(0,E.jsx)(`rect`,{className:`w-week`,x:p-2.5,y:d-11,width:5,height:22,rx:2}):(0,E.jsx)(`path`,{className:`w-five`,d:`M${p} ${d-7} l7 7 -7 7 -7 -7z`}),(0,E.jsx)(`text`,{className:`w-time`+(i===c?` on`:``),x:p,y:d-15,textAnchor:`middle`,children:ge(e.resetsAt)})]},c)})]},o)}),(0,E.jsx)(`line`,{className:`w-now`,x1:92,x2:92,y1:20,y2:112}),(0,E.jsx)(`text`,{className:`w-now-label`,x:86,y:126,textAnchor:`end`,children:`NOW`})]}),(0,E.jsxs)(`figcaption`,{className:`wlegend mono`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`i`,{className:`k-five`}),`5 H WINDOW RESETS`]}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`i`,{className:`k-week`}),`WEEK RESETS`]}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`i`,{className:`k-night`}),`NIGHT`]}),n&&(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`i`,{className:`k-burn`}),`BURN`]}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`i`,{className:`k-later`}),`LATER THAN 24 H`]})]})]})}function yn({ship:e,desk:t,onLog:n,onBack:r}){let[i,a]=(0,l.useState)(``),o=[...t.entries.map(e=>({...e,here:!0})),...e.data.quarters.log.map(e=>({...e,here:!1}))],s=()=>{i.trim()&&(n(i.trim()),a(``))};return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.log,title:`Captain's log`,back:`‹ At ease`,onBack:r,sub:`STARDATE ${en(new Date)} · STAYS ON THE LOCAL RAIL · ONLY THE SHIP'S COMPUTER READS IT`}),(0,E.jsxs)(`div`,{className:`con-body`,children:[(0,E.jsxs)(`div`,{className:`logentry`,children:[(0,E.jsx)(`textarea`,{className:`logtext`,rows:2,maxLength:400,value:i,"aria-label":`New log entry`,placeholder:`Captain's log, supplemental…`,onChange:e=>a(e.target.value),onKeyDown:e=>{e.key===`Enter`&&(e.ctrlKey||e.metaKey)&&s()}}),(0,E.jsx)(`button`,{type:`button`,className:`btn btn-gold`,"aria-disabled":!i.trim(),onClick:s,children:`Log it`})]}),(0,E.jsx)(`p`,{className:`con-hint`,children:`Entries you add stay on this screen until you reload. The log opens for real in H4.`}),(0,E.jsx)(`ol`,{className:`captlog`,children:o.map(e=>(0,E.jsxs)(`li`,{children:[(0,E.jsx)(`time`,{className:`mono`,dateTime:e.at,children:D(e.at).toUpperCase()}),(0,E.jsxs)(`span`,{children:[e.text,e.here&&(0,E.jsx)(`span`,{className:`here mono`,children:` · THIS SCREEN ONLY`})]})]},e.at+e.text))})]})]})}var bn={todo:`To do`,reminder:`Reminder`,waiting:`Waiting for`};function xn({ship:e,desk:t,onTick:n,onBack:r}){let i=[...e.data.quarters.yeoman].sort((e,t)=>e.due.localeCompare(t.due)),a=i.filter(e=>!t.ticked.has(e.id)).length;return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.yeoman,title:`From the Yeoman`,back:`‹ At ease`,onBack:r,sub:`${a} OF ${i.length} OPEN · SAMPLE LIST · THE YEOMAN KEEPS IT ON THE LOCAL RAIL`}),(0,E.jsxs)(`div`,{className:`con-body`,children:[(0,E.jsx)(`ul`,{className:`yeo`,children:i.map(e=>{let r=t.ticked.has(e.id);return(0,E.jsx)(`li`,{children:(0,E.jsxs)(`label`,{className:`yeo-item`+(r?` done`:``),children:[(0,E.jsx)(`input`,{type:`checkbox`,checked:r,onChange:()=>n(e)}),(0,E.jsx)(`span`,{className:`yeo-text`,children:e.text}),(0,E.jsx)(`span`,{className:`yeo-kind `+e.kind,children:bn[e.kind]}),(0,E.jsx)(`span`,{className:`yeo-due mono`,children:D(e.due)})]})},e.id)})}),(0,E.jsx)(`p`,{className:`con-hint`,children:`Ticking stays on this screen. The Yeoman hears it once orders open in H4.`})]})]})}function Sn({ship:e,onBack:t}){let n=e.data.quarters.standingOrders;return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.orders,title:`Standing orders`,back:`‹ At ease`,onBack:t,sub:`${n.length} ORDERS · EVERY STATION KEEPS THEM · ONLY YOU CHANGE THEM`}),(0,E.jsx)(`div`,{className:`con-body`,children:(0,E.jsx)(`ol`,{className:`standing`,children:n.map((e,t)=>(0,E.jsxs)(`li`,{children:[(0,E.jsx)(`span`,{className:`standing-n`,children:t+1}),(0,E.jsx)(`span`,{children:e})]},e))})})]})}function Cn({ship:e,onBack:t}){let n=e.data.quarters.reading,r=Math.round(100*n.read/n.goal);return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(vt,{icon:Qt.reading,title:`Reading year ${n.year}`,back:`‹ At ease`,onBack:t,sub:`SAMPLE SHELF · THE ARCHIVIST KEEPS IT`}),(0,E.jsxs)(`div`,{className:`con-body`,children:[(0,E.jsxs)(`div`,{className:`readhero`,children:[(0,E.jsxs)(`span`,{className:`readfig`,children:[n.read,(0,E.jsxs)(`small`,{children:[` of `,n.goal]})]}),(0,E.jsxs)(`span`,{className:`readmeta`,children:[(0,E.jsxs)(`span`,{children:[`books read this year, `,Math.max(0,n.goal-n.read),` to go by 31 December`]}),(0,E.jsx)(wn,{value:r,label:`Reading goal, ${r}%`})]})]}),(0,E.jsx)(`h4`,{className:`readhead mono`,children:`ON THE NIGHTSTAND`}),(0,E.jsx)(`ul`,{className:`books`,children:n.current.map(e=>(0,E.jsxs)(`li`,{children:[(0,E.jsx)(`span`,{className:`book-title`,children:e.title}),(0,E.jsx)(`span`,{className:`book-by`,children:e.author}),(0,E.jsx)(wn,{value:e.percent,label:`${e.title}, ${e.percent}% read`}),(0,E.jsxs)(`span`,{className:`book-pct mono`,children:[e.percent,`%`]})]},e.title))}),(0,E.jsx)(`h4`,{className:`readhead mono`,children:`NEXT ON THE SHELF`}),(0,E.jsx)(`ul`,{className:`books next`,children:n.next.map(e=>(0,E.jsxs)(`li`,{children:[(0,E.jsx)(`span`,{className:`book-title`,children:e.title}),(0,E.jsx)(`span`,{className:`book-by`,children:e.author})]},e.title))})]})]})}function wn({value:e,label:t}){return(0,E.jsx)(`span`,{className:`qmeter`,role:`meter`,"aria-valuenow":e,"aria-valuemin":0,"aria-valuemax":100,"aria-label":t,children:(0,E.jsx)(`b`,{style:{width:`${Math.min(100,Math.max(0,e))}%`}})})}var Tn=[`chair`,`viewport`,`log`,`yeoman`,`orders`,`reading`];function En({ship:e,filter:t,drills:n,target:r,onTarget:i,onRelieve:a,onBridge:o,onToast:s}){let[c,u]=(0,l.useState)({view:`ease`}),[d,f]=(0,l.useState)({}),[p,m]=(0,l.useState)([]),[h,g]=(0,l.useState)(new Set),_={entries:p,ticked:h},v=e.data.quarters,y=cn(e),b=e.data.rails.rails.some(t=>t.burn?.active&&e.rail(t.id)!==`out`),x=Tn.includes(c.view)?c.view:null,S=(0,l.useCallback)(e=>u(t=>JSON.stringify(t)===JSON.stringify(e)?{view:`ease`}:e),[]),ee=e=>e===`bridge`?o():S({view:e}),te=e=>{S(e.state===`awaiting-captain`?{view:`chair`,hail:e.id}:{view:`station`,id:e.station,order:e.id}),i(e.station)},C=e=>{m(t=>[{at:new Date().toISOString(),text:e},...t]),s(`Logged on this screen only. It is gone when you reload.`)},ne=e=>{let t=!h.has(e.id);g(n=>{let r=new Set(n);return t?r.add(e.id):r.delete(e.id),r}),s(t?`Ticked "${e.text}" on this screen. The Yeoman hears it in H4.`:`"${e.text}" is open again.`)},w=v.yeoman.filter(e=>!h.has(e.id)).length,T={chair:{name:`The chair`,meta:y.length?`${y.length} HAILS`:`ALL QUIET`},viewport:{name:`Viewport`,meta:b?`BURN OPEN`:`WINDOWS`},reading:{name:`Bookshelf`,meta:`${v.reading.read}/${v.reading.goal}`},orders:{name:`Standing orders`,meta:String(v.standingOrders.length)},log:{name:`Captain's log`,meta:`LOCAL ONLY`},yeoman:{name:`Yeoman`,meta:`${w} OPEN`},bridge:{name:`To the Bridge`,meta:`DECK 1`}};return(0,E.jsxs)(`div`,{className:`qgrid`,children:[(0,E.jsx)(on,{ship:e,on:x,labels:T,onPick:ee,children:(0,E.jsx)(ln,{ship:e,screen:c,desk:_,onScreen:u,onLog:C,onTick:ne,onRelieve:a})}),(0,E.jsxs)(`aside`,{className:`side qside`,children:[(0,E.jsx)(k,{ship:e,picked:c.view===`chair`?c.hail??y[0]?.id:void 0,help:`Pick one to read it in full on the wall screen. Approve and Deny open in H4.`,onOpen:(e,t)=>{S({view:`chair`,hail:t}),i(e)}}),(0,E.jsx)(Se,{ship:e,drills:n,compact:!0}),(0,E.jsx)(Ht,{ship:e,filter:t,picked:c.view===`station`?c.id:void 0,onOpen:e=>{S({view:`station`,id:e}),i(e)},onRelieve:a})]}),(0,E.jsxs)(`div`,{className:`qbottom`,children:[(0,E.jsx)(Wt,{ship:e,scope:d,onScope:f}),(0,E.jsx)(qt,{ship:e,filter:t,scope:d,onScope:f,picked:c.view===`chair`?c.hail:c.view===`station`?c.order:void 0,onOpen:te})]}),(0,E.jsx)(me,{ship:e,target:r,onToast:s})]})}function Dn({registry:e,board:t,onBoard:n,filter:r,onFilter:i,drills:a,onDrill:o,onToast:s}){let c=[`all`,`local`,`codex`,`claude`,`mixed`],l=C.find(e=>e.id===t);return(0,E.jsxs)(`nav`,{className:`siderail`,"aria-label":`Boards`,children:[(0,E.jsxs)(`div`,{className:`brand`,children:[(0,E.jsx)(`span`,{className:`brand-name`,children:`HERMES`}),(0,E.jsxs)(`span`,{className:`brand-reg mono`,children:[e,` · `,t===`quarters`?`QUARTERS`:`BRIDGE`]})]}),(0,E.jsx)(`p`,{className:`rail-label mono`,children:`BOARDS`}),(0,E.jsx)(`ul`,{className:`boards`,children:C.map(e=>{let t=e.id===l?.id;return(0,E.jsx)(`li`,{children:(0,E.jsxs)(`button`,{type:`button`,className:`board-btn`+(e.built?``:` not-built`)+(e.id===`quarters`?` quarters`:``),"aria-current":t?`page`:void 0,onClick:()=>{e.built?t||n(e.id):s(`${e.label} isn't built yet. It arrives in ${e.phase}.`)},children:[(0,E.jsx)(`span`,{children:e.label}),(0,E.jsx)(`span`,{className:`tag`,children:t?`HERE`:e.built?`DECK ${e.deck}`:e.phase})]})},e.id)})}),(0,E.jsx)(`p`,{className:`rail-label mono`,children:`SHOW RAIL`}),(0,E.jsx)(`div`,{className:`filters`,role:`group`,"aria-label":`Show stations on a rail`,children:c.map(e=>(0,E.jsxs)(`button`,{type:`button`,className:`chip`,"aria-pressed":r===e,style:e===`all`?void 0:{"--c":y[e].color},onClick:()=>i(e),children:[e!==`all`&&(0,E.jsx)(`span`,{className:`dot`}),e===`all`?`All`:y[e].legend]},e))}),(0,E.jsx)(`p`,{className:`rail-label mono`,children:`DRILL · RAIL OUT`}),(0,E.jsx)(`div`,{className:`filters`,role:`group`,"aria-label":`Preview a rail going out`,children:oe.map(e=>(0,E.jsxs)(`button`,{type:`button`,className:`chip drill`,"aria-pressed":!!a[e],style:{"--c":y[e].color},onClick:()=>o(e),children:[(0,E.jsx)(`span`,{className:`dot`}),y[e].legend]},e))}),(0,E.jsx)(`p`,{className:`rail-help`,children:`A drill only changes this screen. Nothing on the ship is touched.`})]})}var On={w:2560,h:1440};function kn(e,t){let n=Math.min(e/On.w,t/On.h);return n<.6||e<t?{fit:!1,scale:1,left:0,top:0}:{fit:!0,scale:n,left:Math.round((e-On.w*n)/2),top:Math.round((t-On.h*n)/2)}}function An(){let e=()=>kn(window.innerWidth,window.innerHeight),[t,n]=(0,l.useState)(e);return(0,l.useEffect)(()=>{let t=()=>n(e());return window.addEventListener(`resize`,t),()=>window.removeEventListener(`resize`,t)},[]),t}function jn(){(0,l.useEffect)(()=>{let e=e=>{let t=e.target;e.key!==`f`&&e.key!==`F`||e.ctrlKey||e.metaKey||e.altKey||t?.closest(`input, textarea, select, [contenteditable]`)||(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.().catch(()=>void 0))};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[])}function Mn(){let[e,t]=(0,l.useState)(null),[n,r]=(0,l.useState)(null),[i,a]=v(),[o,s]=(0,l.useState)(`all`),[c,u]=(0,l.useState)({}),[d,h]=(0,l.useState)(new Set),[g,_]=(0,l.useState)(null),[b,x]=Nn(),ee=An();jn(),(0,l.useEffect)(()=>{f().then(t,e=>r(e.message))},[]),(0,l.useEffect)(()=>{let e=setInterval(()=>{m().then(e=>{e&&t(t=>t&&{...t,rails:e})})},p);return()=>clearInterval(e)},[]);let te=(0,l.useMemo)(()=>e?de(e,c,d):null,[e,c,d]),C=e=>{let t=!c[e];u({...c,[e]:t}),x(t?`Drill: ${y[e].legend} out. Its crew go to quarters.`:`Drill over: ${y[e].legend} back up.`)},ne=t=>{if(!e)return;let n=e.stations.stations.find(e=>e.id===t);if(!n)return;let r=new Set(d),i=r.delete(t);i||r.add(t),h(r);let a=S.find(e=>e.id===n.dept),o=n.head&&n.dept?de(e,c,r).acting[n.dept]:void 0,s=o===`dark`?`Nobody can act for ${a?.name}: its orders queue.`:o?`${e.stations.stations.find(e=>e.id===o)?.short} acts as head of ${a?.name}.`:`Their orders wait.`;x(i?`${n.short} is back at their post.`:`${n.short} relieved. ${s} Screen only.`)};return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`div`,{className:`stage board-${i}`+(ee.fit?` fit`:``),style:ee.fit?{transform:`scale(${ee.scale})`,left:ee.left,top:ee.top}:void 0,children:(0,E.jsx)(Pt,{ship:te,board:i,side:(0,E.jsx)(Dn,{registry:e?.ship.registry??`HX-01`,board:i,onBoard:a,filter:o,onFilter:s,drills:c,onDrill:C,onToast:x}),children:(0,E.jsxs)(`main`,{className:`main`,children:[(0,E.jsx)(zt,{ship:te,board:i,error:n}),te&&i===`bridge`&&(0,E.jsx)(Nt,{ship:te,filter:o,drills:c,target:g,onTarget:_,onToast:x,onQuarters:()=>a(`quarters`),onRelieve:ne}),te&&i===`quarters`&&(0,E.jsx)(En,{ship:te,filter:o,drills:c,target:g,onTarget:_,onRelieve:ne,onBridge:()=>a(`bridge`),onToast:x})]})})}),(0,E.jsx)(`div`,{className:`toast`+(b?` show`:``),role:`status`,"aria-live":`polite`,children:b})]})}function Nn(){let[e,t]=(0,l.useState)(``),n=(0,l.useRef)(void 0);return[e,(0,l.useCallback)(e=>{t(e),clearTimeout(n.current),n.current=setTimeout(()=>t(``),3600)},[])]}(0,u.createRoot)(document.getElementById(`root`)).render((0,E.jsx)(l.StrictMode,{children:(0,E.jsx)(Mn,{})}));