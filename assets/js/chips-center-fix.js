(function(){
  function centerChipsToBox(){
    try{
      var labels=['ALCALDÍAS','GOBERNACIONES','EMPRESAS DE SERVICIOS PÚBLICOS','INSTITUTOS DE VIVIENDA Y FINANCIEROS','INSTITUCIONES EDUCATIVAS','INSTITUTOS DE CULTURA Y DEPORTE / ENTES DESCENTRALIZADOS','CONTRALORÍAS'];
      var chips = Array.from(document.querySelectorAll('a,button')).filter(function(el){
        return labels.includes((el.textContent||'').trim().toUpperCase());
      });
      if(!chips.length) return;
      var sets = chips.map(function(n){
        var a=[], p=n;
        while(p){ a.push(p); p=p.parentElement; }
        return a;
      });
      var common = sets[0].find(function(node){
        return sets.every(function(s){ return s.indexOf(node) >= 0; });
      });
      var container = common || chips[0].parentElement;
      if(!container) return;
      var ref = document.querySelector('.productos-brandbox-container .grid') || document.querySelector('.productos-brandbox-container') || document.querySelector('.productos-modulos-below');
      var refWidth = ref ? ref.clientWidth : 0;
      var s = container.style;
      s.display='flex'; s.flexWrap='wrap'; s.justifyContent='center'; s.alignItems='center';
      s.gap='16px'; s.margin='0 auto';
      if(refWidth>0){ s.maxWidth=refWidth+'px'; s.width='100%'; }
      chips.forEach(function(c){ c.style.margin='0'; c.style.float='none'; c.style.display='inline-flex'; c.style.whiteSpace='nowrap'; });
    }catch(e){ /* silent */ }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', centerChipsToBox); }
  else{ centerChipsToBox(); }
  window.addEventListener('resize', centerChipsToBox);
})();