!function(){"use strict";var e,t,n,r,o={5947:function(e,t,n){n.d(t,{b:function(){return r},h:function(){return o}});var r=[{name:"Supremus",getModule:function(){return Promise.all([n.e(737),n.e(869)]).then(n.bind(n,3869))}},{name:"Terminal",getModule:function(){return Promise.all([n.e(737),n.e(819)]).then(n.bind(n,5819))}}],o=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)},8325:function(e,t,n){var r=n(5947);new function e(t){var n,o,i,u=this;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),i=function(e){e&&"getModule"in e&&e.getModule().then((function(t){u.curTheme=new t.default(u.rootElement,u.ChangeTheme),document.title=e.name,localStorage.setItem("currentTheme",e.name)})).catch((function(e){console.error(e)}))},(o="ChangeTheme")in(n=this)?Object.defineProperty(n,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):n[o]=i,this.curTheme=null,this.rootElement=t,r.b.length>0){if(localStorage.currentTheme){var a=r.b.find((function(e){return e.name===localStorage.currentTheme}));if(a)return void this.ChangeTheme(a)}this.ChangeTheme(r.b[0])}}(document.getElementById("root"))}},i={};function u(e){var t=i[e];if(void 0!==t)return t.exports;var n=i[e]={exports:{}};return o[e](n,n.exports,u),n.exports}u.m=o,e=[],u.O=function(t,n,r,o){if(!n){var i=1/0;for(f=0;f<e.length;f++){n=e[f][0],r=e[f][1],o=e[f][2];for(var a=!0,c=0;c<n.length;c++)(!1&o||i>=o)&&Object.keys(u.O).every((function(e){return u.O[e](n[c])}))?n.splice(c--,1):(a=!1,o<i&&(i=o));if(a){e.splice(f--,1);var l=r();void 0!==l&&(t=l)}}return t}o=o||0;for(var f=e.length;f>0&&e[f-1][2]>o;f--)e[f]=e[f-1];e[f]=[n,r,o]},u.d=function(e,t){for(var n in t)u.o(t,n)&&!u.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},u.f={},u.e=function(e){return Promise.all(Object.keys(u.f).reduce((function(t,n){return u.f[n](e,t),t}),[]))},u.u=function(e){return e+"."+{737:"4271b945fa202c9ec9c4",819:"f0ea5fb7bcab976d860c",869:"f47fd56328887633f22a"}[e]+".js"},u.miniCssF=function(e){return e+"."+{819:"36921e43b122e765e7e7",869:"d0eaf399a35ed323481b"}[e]+".css"},u.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t={},u.l=function(e,n,r,o){if(t[e])t[e].push(n);else{var i,a;if(void 0!==r)for(var c=document.getElementsByTagName("script"),l=0;l<c.length;l++){var f=c[l];if(f.getAttribute("src")==e){i=f;break}}i||(a=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,u.nc&&i.setAttribute("nonce",u.nc),i.src=e),t[e]=[n];var s=function(n,r){i.onerror=i.onload=null,clearTimeout(d);var o=t[e];if(delete t[e],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((function(e){return e(r)})),n)return n(r)},d=setTimeout(s.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=s.bind(null,i.onerror),i.onload=s.bind(null,i.onload),a&&document.head.appendChild(i)}},u.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e;u.g.importScripts&&(e=u.g.location+"");var t=u.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),u.p=e}(),n=function(e){return new Promise((function(t,n){var r=u.miniCssF(e),o=u.p+r;if(function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=(u=n[r]).getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(o===e||o===t))return u}var i=document.getElementsByTagName("style");for(r=0;r<i.length;r++){var u;if((o=(u=i[r]).getAttribute("data-href"))===e||o===t)return u}}(r,o))return t();!function(e,t,n,r){var o=document.createElement("link");o.rel="stylesheet",o.type="text/css",o.onerror=o.onload=function(i){if(o.onerror=o.onload=null,"load"===i.type)n();else{var u=i&&("load"===i.type?"missing":i.type),a=i&&i.target&&i.target.href||t,c=new Error("Loading CSS chunk "+e+" failed.\n("+a+")");c.code="CSS_CHUNK_LOAD_FAILED",c.type=u,c.request=a,o.parentNode.removeChild(o),r(c)}},o.href=t,document.head.appendChild(o)}(e,o,t,n)}))},r={179:0},u.f.miniCss=function(e,t){r[e]?t.push(r[e]):0!==r[e]&&{819:1,869:1}[e]&&t.push(r[e]=n(e).then((function(){r[e]=0}),(function(t){throw delete r[e],t})))},function(){var e={179:0};u.f.j=function(t,n){var r=u.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else{var o=new Promise((function(n,o){r=e[t]=[n,o]}));n.push(r[2]=o);var i=u.p+u.u(t),a=new Error;u.l(i,(function(n){if(u.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var o=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;a.message="Loading chunk "+t+" failed.\n("+o+": "+i+")",a.name="ChunkLoadError",a.type=o,a.request=i,r[1](a)}}),"chunk-"+t,t)}},u.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,o,i=n[0],a=n[1],c=n[2],l=0;for(r in a)u.o(a,r)&&(u.m[r]=a[r]);if(c)var f=c(u);for(t&&t(n);l<i.length;l++)o=i[l],u.o(e,o)&&e[o]&&e[o][0](),e[i[l]]=0;return u.O(f)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}(),u.O(void 0,[202],(function(){return u(1202)}));var a=u.O(void 0,[202],(function(){return u(8325)}));a=u.O(a)}();