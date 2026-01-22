(function(){
const data = window.SJT_PRODUCTOS_DATA || {};
const __ICON_POOL = [
"📄","🧾","📊","📈","📉","🧮","💳","🏦","🏛️","💼","📚","🗂️","🗃️","🗄️","🧑‍⚖️","⚖️","📜","📝","✉️","📬","📥","🧪","🔬","🧰","🛠️","🧱","🏗️","📌","📍","🧷","🧲","🧯","🪪","🔐","🔒","🔑","🧠","📅","⏱️","🧭","🗺️","📎","🧾","🧾","🧾","🧾","🧾","🧾","🧾","🧾",
"🧩","🧠","💡","🔎","🛰️","📶","📡","💾","💽","💿","🗒️","📂","🗄️","🧑‍💼","🧑‍💻","🧑‍🔬","🧑‍🏫","🧑‍⚕️","🏷️","🔖","🧾","📤","📑","🧾","🧾","🧾","🧾","🧾","🧾"
];
(function buildIconMap(){
try{
const pool = Array.from(new Set(__ICON_POOL));
const modules = [];
Object.values(data).forEach(gmap=>{
Object.values(gmap||{}).forEach(arr=>{
(arr||[]).forEach(m=>{ if(modules.indexOf(m)<0) modules.push(m); });
});
});
const map = {};
let i=0;
modules.forEach(m=>{ map[m]= pool[i % pool.length]; i++; });
window.SJT_PRODUCTOS_ICONS = map;
}catch(e){ console.warn('ICON MAP build failed', e); }
})();
function el(tag, attrs={}, children=[]) {
const e = document.createElement(tag);
Object.entries(attrs).forEach(([k,v])=>{
if(k==='class') e.className=v;
else if(k==='html') e.innerHTML=v;
else e.setAttribute(k,v);
});
children.forEach(c => e.appendChild(c));
return e;
}
function iconFor(name){
try{
const map = window.SJT_PRODUCTOS_ICONS || {};
const icon = map[name] || "🔹";
return icon;
}catch(e){ return "🔹"; }
}
function renderModules(modNames){
const grid = document.getElementById('modulos-grid');
if(!grid) return;
grid.innerHTML = '';
(modNames||[]).forEach(m => {
const card = el('div', {class: 'module-card'});
const ic = el('div', {class:'module-ico', html: iconFor(m)});
const title = el('div', {class:'module-title', html: m});
card.appendChild(ic); card.appendChild(title);
grid.appendChild(card);
});
}
function renderGestiones(gestiones, onSelect){
const leftBox = document.querySelector('.productos-modulos-below .panel .grid > div'); // first column
const rightBox = document.querySelector('.productos-modulos-below .panel .grid > div:nth-of-type(2)'); // second column
if(!leftBox || !rightBox) return;
leftBox.innerHTML = '<h3 class="coltitle" style="text-align:center">GESTIONES</h3>';
const list = document.createElement('div'); list.className='gestiones-list';
gestiones.forEach(g => {
const item = document.createElement('button');
item.type='button'; item.className='gestion-item';
item.innerHTML = '<span class="gi-label">'+g+'</span><span class="gi-cue">Ver módulos ▶</span>';
item.addEventListener('click', () => {
document.querySelectorAll('.gestion-item').forEach(b=>b.classList.remove('active'));
item.classList.add('active');
try{ item.scrollIntoView({block:'end', inline:'nearest'}); }catch(_){}
onSelect && onSelect(g);
});
list.appendChild(item);
});
leftBox.appendChild(list);
rightBox.innerHTML = '<h3 class="coltitle" style="text-align:center">MÓDULOS INVOLUCRADOS</h3><div id="modulos-grid"></div><div id="modulos-hint" class="mod-hint"></div>';
}
function renderEntitySelector(entities, onChange){
const container = document.querySelector('.productos-brandbox-container');
if(!container) return;
let holder = document.getElementById('entidad-selector-holder');
if(holder) holder.remove();
holder = el('div', {id:'entidad-selector-holder', class:'entidad-chips'});
entities.forEach(name => {
const chip = el('button', {class:'entidad-chip', type:'button'}, [document.createTextNode(name)]);
chip.addEventListener('click', ()=>{
document.querySelectorAll('.entidad-chip').forEach(c=>c.classList.remove('active'));
chip.classList.add('active');
onChange(name);
});
holder.appendChild(chip);
});
container.parentNode.insertBefore(holder, container);
}
function init(){
const entities = Object.keys(data);
if(!entities.length) return;
renderEntitySelector(entities, (ent)=>{
const gestiones = Object.keys(data[ent]||{});
renderGestiones(gestiones, (g)=>{
renderModules((data[ent]||{})[g]||[]);
});
const first = document.querySelector('.gestion-item');
if(first){ first.click(); }
});
const firstEnt = document.querySelector('.entidad-chip');
if(firstEnt){ firstEnt.click(); }
}
if(document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
})();