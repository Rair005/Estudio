(function () {
  "use strict";

  /* =========================================================
     CONFIGURAÇÃO — edite só isto para personalizar o estúdio
     ========================================================= */
  const CONFIG = {
    // Número do WhatsApp em formato internacional, só dígitos.
    // Ex.: 55 (Brasil) + DDD + número
    whatsappNumber: "5500000000000",
    studioName: "Tinta & Osso Tatuagens",
  };

  let estiloSelecionado = "Fineline";

  function buildWaLink(message) {
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function messageFor(el) {
    const base = el.dataset.msgBase;
    if (base === "peca") {
      return `Olá! Vi no site sobre ${el.dataset.peca} e quero saber mais.`;
    }
    if (base === "artista") {
      return `Olá! Gostaria de agendar uma tatuagem com ${el.dataset.artista}.`;
    }
    if (base === "local") {
      return `Olá! Gostaria de saber como chegar até o estúdio.`;
    }
    if (base === "flutuante") {
      return `Olá! Vim pelo site e quero agendar uma tatuagem, estilo ${estiloSelecionado}.`;
    }
    // "hero" e padrão
    return `Olá! Quero agendar uma tatuagem, estilo ${estiloSelecionado}.`;
  }

  function refreshWhatsLinks() {
    document.querySelectorAll(".whats-link").forEach((el) => {
      el.setAttribute("href", buildWaLink(messageFor(el)));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ---------- Chips de estilo ---------- */
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      estiloSelecionado = chip.dataset.estilo;
      refreshWhatsLinks();
    });
  });

  /* ---------- Formulário rápido -> WhatsApp ---------- */
  const quickForm = document.getElementById("quickForm");
  if (quickForm) {
    quickForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      const estilo = document.getElementById("estiloForm").value;
      const mensagem = document.getElementById("mensagem").value.trim();

      if (!nome || !mensagem) {
        quickForm.reportValidity();
        return;
      }

      const texto = `Olá! Meu nome é ${nome}. Quero uma tatuagem estilo ${estilo}. Ideia: ${mensagem}`;
      window.open(buildWaLink(texto), "_blank", "noopener");
    });
  }

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Ano no rodapé ---------- */
  const anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ---------- Revelação suave ao rolar (respeita reduced motion) ---------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll("section > .container > *");
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }

  refreshWhatsLinks();
})();
