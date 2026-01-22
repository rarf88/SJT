(function() {
var H0 = 74;
var H1 = 46;
var SEP0 = 200;
var SEP1 = 172;
var GAP0 = 60;
var GAP1 = 56;
var SHRINK_AT = 120;
var EXPAND_AT = 60;
var isSmall = false;
function q(s){ return document.querySelector(s); }
function qa(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
function ensureHeaderVeil(){
var veil = document.getElementById("sjt-header-veil");
if(!veil){
veil = document.createElement("div");
veil.id = "sjt-header-veil";
veil.setAttribute("aria-hidden","true");
document.body.appendChild(veil);
}
var header = document.querySelector("header.site-header, .site-header, header");
var bg = "#0e3f42";
try {
var ref = header || document.body;
var cs = window.getComputedStyle(ref);
bg = cs.background && cs.background !== "none" ? cs.background : cs.backgroundColor || bg;
} catch(e){}
veil.style.position = "fixed";
veil.style.top = "0";
veil.style.left = "0";
veil.style.right = "0";
veil.style.height = "90px"; // overscan to cover any residual gap
veil.style.transformOrigin = "top";
veil.style.background = bg;
veil.style.pointerEvents = "none";
veil.style.zIndex = "999"; // header should be 1000+
return veil;
}
veil.style.position = "fixed";
veil.style.top = "0";
veil.style.left = "0";
veil.style.right = "0";
veil.style.height = "74px";
veil.style.transformOrigin = "top";
veil.style.backgroundColor = "var(--header-bg, #0e3f42)";
veil.style.pointerEvents = "none";
veil.style.zIndex = "999"; // under header z-index:1000
return veil;
}
function ensureHeaderInner(){
var header = q("header.site-header");
if(!header) return null;
var inner = document.getElementById("sjt-header-inner");
if(!inner){
inner = document.createElement("div");
inner.id = "sjt-header-inner";
while(header.firstChild){
inner.appendChild(header.firstChild);
}
header.appendChild(inner);
}
setImp(header, "min-height", "74px");
setImp(header, "height", "74px");
setImp(header, "overflow", "hidden");
setImp(inner, "transform-origin", "top");
return inner;
}
function ensureSpacer(){
var header = q("header.site-header");
if(!header) return null;
var spacer = document.getElementById("sjt-header-spacer");
if(!spacer){
spacer = document.createElement("div");
spacer.id = "sjt-header-spacer";
spacer.setAttribute("aria-hidden","true");
spacer.style.height = "0px";
spacer.style.margin = "0";
spacer.style.padding = "0";
spacer.style.border = "0";
spacer.style.transition = "none";
header.insertAdjacentElement("afterend", spacer);
}
return spacer;
}
function setSpacerHeight(px){
var spacer = ensureSpacer();
if(spacer){
spacer.style.height = (px|0) + "px";
}
}
function setImp(el, prop, val){
if (!el) return;
try {
// Hard guard: never let header lose its reserved height in 'top' state
if (prop && (prop === "height" || prop === "min-height")) {
if (el.matches && el.matches("header.site-header, .site-header, header")) {
val = "74px";
}
}
el.style.setProperty(prop, val, "important");
} catch(e){}
}
catch(e){ el.style[prop.replace(/-([a-z])/g, (_,c)=>c.toUpperCase())] = val; }
}
function apply(h, sep, gap) {
var header = q("header.site-header");
if (!header) return;
var inner = ensureHeaderInner();
var nav = header.querySelector(".nav");
var logo = header.querySelector(".logo");
var img = header.querySelector(".logo img.brand-sjt");
var linksWrap = header.querySelector(".nav-links");
var links = linksWrap ? linksWrap.querySelectorAll("a") : null;
setImp(header, "min-height", "74px");
setImp(header, "height", "74px");
setImp(header, "padding-top", "0px");
setImp(header, "padding-bottom", "0px");
setImp(header, "overflow", "hidden");
if (logo) {
setImp(logo, "height", "74px"); // contenedor
setImp(logo, "margin-right", sep + "px");
setImp(logo, "display", "flex");
setImp(logo, "align-items", "center");
}
if (img) {
setImp(img, "height", "74px");
setImp(img, "max-height", "none");
setImp(img, "width", "auto");
setImp(img, "position", "static");
setImp(img, "margin", "0");
setImp(img, "top", "0");
setImp(img, "z-index", "1");
}
if (linksWrap) {
setImp(linksWrap, "display", "flex");
setImp(linksWrap, "align-items", "center");
setImp(linksWrap, "gap", gap + "px");
}
}
);
}
function initState(){ ensureHeaderVeil(); ensureHeaderInner(); ensureSpacer();
var y = window.pageYOffset || document.documentElement.scrollTop || 0;
if (y >= SHRINK_AT) { applySmall(); }
else { applyBig(); }
}
document.addEventListener("DOMContentLoaded", initState);
window.addEventListener("load", initState);
window.addEventListener("pageshow", function(e){ initState(); });
window.addEventListener("scroll", onScroll, {passive:true});
window.addEventListener("resize", onScroll, {passive:true});
window.addEventListener("load", update);
})();