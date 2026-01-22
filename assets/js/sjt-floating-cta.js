document.addEventListener('DOMContentLoaded',function(){
const labels=['Solicitar demo','Hablar con un asesor'];
const nodes=[...document.querySelectorAll('a,button')].filter(el=>labels.includes((el.textContent||'').trim()));
if(nodes.length){const c=nodes[0].closest('.card,.cta,.cta-panel,.sticky-cta,.legacy-cta-card,.container,div');if(c)c.remove();}
});