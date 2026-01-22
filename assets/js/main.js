/**
 * SJT ERP – Clean rebuild (production-ready baseline)
 * - Mobile nav (hamburger)
 * - Products dropdown (mobile accordion)
 * - Slider (index)
 * - Productos page renderer (from JSON)
 */

(function () {
  "use strict";

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function initNav() {
    const toggle = qs(".nav-toggle");
    const nav = qs("#primary-nav");
    const body = document.body;

    if (toggle && nav) {
      const setExpanded = (v) => toggle.setAttribute("aria-expanded", v ? "true" : "false");

      toggle.addEventListener("click", () => {
        const open = !body.classList.contains("nav-open");
        body.classList.toggle("nav-open", open);
        setExpanded(open);
      });

      // Close on link click (mobile)
      nav.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (!a) return;
        body.classList.remove("nav-open");
        setExpanded(false);
      });

      // Close on escape
      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        body.classList.remove("nav-open");
        setExpanded(false);
      });
    }

    // Productos dropdown (desktop + mobile)
    // - Click on "PRODUCTOS" toggles the mega-menu.
    // - Click outside or press ESC closes it.
    // - Clicking a submenu link closes it.
    const prodItem = qs(".nav__item--has-sub");
    const prodBtn = qs(".nav__link--button", prodItem || undefined);

    const closeProductsMenu = () => {
      if (!prodItem || !prodBtn) return;
      prodItem.classList.remove("is-open");
      prodBtn.setAttribute("aria-expanded", "false");
    };

    if (prodItem && prodBtn) {
      // Ensure initial aria state
      if (!prodBtn.hasAttribute("aria-expanded")) prodBtn.setAttribute("aria-expanded", "false");

      prodBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = prodItem.classList.toggle("is-open");
        prodBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      // Close when clicking any submenu link
      qsa(".nav__submenu a", prodItem).forEach((a) => {
        a.addEventListener("click", () => closeProductsMenu());
      });

      // Close on outside click
      document.addEventListener("click", (e) => {
        if (!prodItem.classList.contains("is-open")) return;
        if (prodItem.contains(e.target)) return;
        closeProductsMenu();
      });

      // Close on ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeProductsMenu();
      });
    }
  }

  function initSlider() {
    const slider = qs(".slider");
    if (!slider) return;

    const slides = qsa(".slide", slider);
    const dotsWrap = qs(".dots", slider);
    const prev = qs(".arrow.left", slider);
    const next = qs(".arrow.right", slider);
    const interval = parseInt(slider.getAttribute("data-interval") || "8000", 10);

    if (!slides.length) return;

    let idx = slides.findIndex(s => s.classList.contains("active"));
    if (idx < 0) idx = 0;

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === idx));
      if (dotsWrap) {
        qsa("button", dotsWrap).forEach((b, k) => b.classList.toggle("active", k === idx));
      }
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach((_, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Ir al slide ${k + 1}`);
        b.addEventListener("click", () => { show(k); restart(); });
        dotsWrap.appendChild(b);
      });
    }

    buildDots();
    show(idx);

    if (prev) prev.addEventListener("click", () => { show(idx - 1); restart(); });
    if (next) next.addEventListener("click", () => { show(idx + 1); restart(); });

    let t = null;
    function start() {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (interval <= 0) return;
      t = window.setInterval(() => show(idx + 1), interval);
    }
    function stop() { if (t) window.clearInterval(t); t = null; }
    function restart() { stop(); start(); }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());

    start();
  }

  async function initProductos() {
    const gestionesEl = qs("#gestiones-list");
    const modulosEl = qs("#modulos-grid");
    const chipsEl = qs(".chips");
    if (!gestionesEl || !modulosEl || !chipsEl) return;

    let data = null;
    try {
      const res = await fetch("assets/data/productos.json", { cache: "force-cache" });
      if (!res.ok) throw new Error("No se pudo cargar productos.json");
      data = await res.json();
    } catch (err) {
      modulosEl.innerHTML = `<div class="module-card">Error cargando datos de productos.</div>`;
      return;
    }

    const entities = Object.keys(data || {});
    if (!entities.length) {
      modulosEl.innerHTML = `<div class="module-card">No hay datos disponibles.</div>`;
      return;
    }

    let activeEntity = entities[0];
    let activeGestion = null;

    function setSelectedChip(entity) {
      qsa(".chip", chipsEl).forEach(b => b.classList.toggle("is-selected", b.dataset.entity === entity));
    }

    function renderGestiones(entity) {
      gestionesEl.innerHTML = "";
      const gestiones = Object.keys((data[entity] || {}));
      if (!gestiones.length) {
        gestionesEl.innerHTML = `<div class="list__item"><button type="button" class="list__btn" disabled>Sin gestiones</button></div>`;
        activeGestion = null;
        renderModulos(entity, null);
        return;
      }

      // keep selection if possible
      if (!activeGestion || !gestiones.includes(activeGestion)) activeGestion = gestiones[0];

      gestiones.forEach(g => {
        const wrap = document.createElement("div");
        wrap.className = "list__item";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "list__btn";
        btn.textContent = g;
        btn.classList.toggle("is-active", g === activeGestion);
        btn.addEventListener("click", () => {
          activeGestion = g;
          qsa(".list__btn", gestionesEl).forEach(x => x.classList.toggle("is-active", x.textContent === g));
          renderModulos(entity, g);
        });
        wrap.appendChild(btn);
        gestionesEl.appendChild(wrap);
      });

      renderModulos(entity, activeGestion);
    }

    function renderModulos(entity, gestion) {
      modulosEl.innerHTML = "";
      const mods = (data[entity] && gestion && data[entity][gestion]) ? data[entity][gestion] : [];
      if (!mods || !mods.length) {
        const empty = document.createElement("div");
        empty.className = "module-card";
        empty.textContent = "Sin módulos para esta gestión en la entidad seleccionada.";
        modulosEl.appendChild(empty);
        return;
      }
      mods.forEach(name => {
        const card = document.createElement("div");
        card.className = "module-card";
        card.textContent = name;
        modulosEl.appendChild(card);
      });
    }

    // Hook chips
    qsa(".chip", chipsEl).forEach(btn => {
      btn.addEventListener("click", () => {
        activeEntity = btn.dataset.entity || activeEntity;
        setSelectedChip(activeEntity);
        renderGestiones(activeEntity);
      });
    });

    // Initial render
    setSelectedChip(activeEntity);
    renderGestiones(activeEntity);
  }

  function initContactValidation() {
    const form = qs(".contacto-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      const acepta = qs("#acepta", form);
      if (acepta && !acepta.checked) {
        e.preventDefault();
        alert("Debes aceptar el tratamiento de datos personales.");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initSlider();
    initProductos();
    initContactValidation();
  });
})();
/* Apply background images to slides */
document.querySelectorAll('.slide[data-bg]').forEach(slide => {
  const bg = slide.getAttribute('data-bg');
  if (bg) slide.style.backgroundImage = `url(${bg})`;
});
