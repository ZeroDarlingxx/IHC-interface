(function () {
  "use strict";
  function carregarTorneios() {
    try {
      const raw = localStorage.getItem("torneios");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Erro ao parsear torneios do localStorage", e);
      return [];
    }
  }
  function salvarTorneios(lista) {
    localStorage.setItem("torneios", JSON.stringify(lista));
  }
  function criarTorneioObj(titulo, descricao) {
    return {
      id: Date.now(),
      titulo: titulo || "Sem título",
      descricao: descricao || "",
      criado_em: new Date().toISOString()
    };
  }
  function criarTorneioSalvar(titulo, descricao) {
    const lista = carregarTorneios();
    const novo = criarTorneioObj(titulo, descricao);
    lista.push(novo);
    salvarTorneios(lista);
    return novo;
  }
  function abrirTorneioPorId(id) {
    window.location.href = `torneio.html?id=${encodeURIComponent(id)}`;
  }
  function montarCardTorneio(t) {
    const a = document.createElement("a");
    a.className = "tournament-item";
    a.href = `torneio.html?id=${encodeURIComponent(t.id)}`;
    a.dataset.id = t.id;
    a.dataset.titulo = t.titulo || "";
    a.style.display = "block";
    a.style.textDecoration = "none";
    a.style.color = "inherit";
    const title = document.createElement("div");
    title.className = "t-item-title";
    title.textContent = t.titulo;
    title.style.fontWeight = "600";
    title.style.marginBottom = "6px";
    const desc = document.createElement("div");
    desc.className = "t-item-desc";
    desc.textContent = t.descricao || "";
    desc.style.color = "var(--muted, #c3c7cc)";
    desc.style.fontSize = "0.95rem";
    a.appendChild(title);
    a.appendChild(desc);
    return a;
  }
  function mostrarTorneiosNaPrincipal() {
    const container = document.getElementById("tabelaTorneios") || document.getElementById("listaTorneios") || document.getElementById("tabela");
    if (!container) return;
    const lista = carregarTorneios();
    container.innerHTML = "";
    if (!lista.length) {
      const p = document.createElement("p");
      p.textContent = "Nenhum torneio criado ainda.";
      p.style.color = "var(--muted, #c3c7cc)";
      container.appendChild(p);
      return;
    }
    lista.forEach(t => {
      const card = montarCardTorneio(t);
      container.appendChild(card);
    });
  }
  function preencherDetalhesTorneioDaURL() {
    const params = new URLSearchParams(window.location.search);
    const idStr = params.get("id");
    if (!idStr) return;
    const id = Number(idStr);
    if (Number.isNaN(id)) return;
    const lista = carregarTorneios();
    const torneio = lista.find(x => Number(x.id) === id);
    if (!torneio) return;
    const titleEl = document.getElementById("tituloTorneio") || document.getElementById("tituloExibir") || document.getElementById("tituloDisplayed") || document.querySelector(".titulo-exibido");
    const descEl = document.getElementById("descricaoTorneio") || document.getElementById("descricaoExibir") || document.querySelector(".descricao-exibida");
    if (titleEl) {
      if ("value" in titleEl) titleEl.value = torneio.titulo;
      else titleEl.textContent = torneio.titulo;
    }
    if (descEl) {
      if ("value" in descEl) descEl.value = torneio.descricao;
      else descEl.textContent = torneio.descricao;
    }
  }
  function inicializarBusca() {
    const input = document.getElementById("searchInput");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const items = document.querySelectorAll("#tabelaTorneios .tournament-item, #listaTorneios .tournament-item");
      items.forEach(it => {
        const text = (it.dataset.titulo || it.textContent || "").toLowerCase();
        it.style.display = text.includes(q) ? "" : "none";
      });
    });
  }
  function inicializarHeaderSidebar() {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const sidebarClose = document.getElementById("sidebarClose");
    if (menuToggle && sidebar && overlay) {
      menuToggle.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.hidden = false;
        overlay.classList.add("active");
        sidebar.setAttribute("aria-hidden", "false");
      });
    }
    if (sidebarClose && overlay && sidebar) {
      sidebarClose.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        overlay.hidden = true;
        sidebar.setAttribute("aria-hidden", "true");
      });
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        overlay.hidden = true;
        sidebar.setAttribute("aria-hidden", "true");
      });
    }
  }
  function aplicarTemaSalvo() {
    const tema = localStorage.getItem("theme") || "dark";
    if (tema === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }
  function alternarTema() {
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }
  window.toggleSiteTheme = alternarTema;
  document.addEventListener("DOMContentLoaded", function () {
    inicializarHeaderSidebar();
    aplicarTemaSalvo();
    mostrarTorneiosNaPrincipal();
    inicializarBusca();
    preencherDetalhesTorneioDaURL();
    const form = document.getElementById("formCriarTorneio");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const titulo = (document.getElementById("tituloTorneio") || {}).value || "";
        const descricao = (document.getElementById("descricaoTorneio") || {}).value || "";
        if (!titulo.trim()) {
          alert("O torneio precisa de um título.");
          return;
        }
        const novo = criarTorneioSalvar(titulo.trim(), descricao.trim());
        abrirTorneioPorId(novo.id);
      });
    }
    const btn = document.getElementById("btnCriar");
    if (btn) {
      btn.addEventListener("click", function (e) {
        const titulo = (document.getElementById("tituloTorneio") || {}).value || "";
        const descricao = (document.getElementById("descricaoTorneio") || {}).value || "";
        if (!titulo.trim()) {
          alert("O torneio precisa de um título.");
          return;
        }
        const novo = criarTorneioSalvar(titulo.trim(), descricao.trim());
        abrirTorneioPorId(novo.id);
      });
    }
    const themeBtn = document.getElementById("themeBtn") || document.getElementById("toggleTheme") || document.querySelector(".theme-toggle button");
    if (themeBtn) {
      themeBtn.addEventListener("click", alternarTema);
      if (document.body.classList.contains("light-mode")) {
        if (themeBtn.tagName === "BUTTON") themeBtn.textContent = "Modo Escuro";
      } else {
        if (themeBtn.tagName === "BUTTON") themeBtn.textContent = "Acessibilidade";
      }
    }
  });
  window.mostrarTorneiosNaPrincipal = mostrarTorneiosNaPrincipal;
  window.carregarTorneios = carregarTorneios;
  window.salvarTorneios = salvarTorneios;
  window.abrirTorneioPorId = abrirTorneioPorId;
})();