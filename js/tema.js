// js/tema.js (robusto — substitua o existente)
(function () {
  // Aguarda DOM (funciona mesmo se o script foi incluído no head ou com defer)
  function ready(fn) {
    if (document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const html = document.documentElement;
    // Aceita várias chaves históricas
    const KEYS = ['tema', 'temaWolf', 'temaWolfpack', 'wp-theme'];

    function readSaved() {
      for (const k of KEYS) {
        try {
          const v = localStorage.getItem(k);
          if (v) return {key: k, value: v};
        } catch (e) {}
      }
      return null;
    }

    function save(key, value) {
      try { localStorage.setItem(key, value); } catch(e) {}
    }

    function applyTheme(t) {
      if (t === 'light') {
        html.setAttribute('data-theme', 'light');
      } else if (t === 'dark') {
        html.setAttribute('data-theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
      }
      updateIcon();
    }

    function getCurrent() {
      return html.getAttribute('data-theme') === 'light' ? 'light' : (html.getAttribute('data-theme') === 'dark' ? 'dark' : null);
    }

    function detectSystem() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateIcon() {
      // tenta vários ids possíveis
      const icon = document.getElementById('iconTema') || document.querySelector('#btnTema > span') || null;
      const curr = getCurrent() || detectSystem();
      if (icon) icon.textContent = curr === 'light' ? '☀️' : '🌙';
      // também atualiza aria-pressed no botão
      const btn = document.getElementById('btnTema');
      if (btn) btn.setAttribute('aria-pressed', String(curr === 'dark'));
    }

    // inicia lendo salvo ou sistema
    const saved = readSaved();
    if (saved) {
      applyTheme(saved.value);
    } else {
      applyTheme(detectSystem());
    }

    // tenta ligar handler no botão, e se botão aparecer depois (ex.: carregado dinamicamente)
    function setupButton() {
      const btn = document.getElementById('btnTema');
      if (!btn) return false;
      btn.removeEventListener('click', toggleTheme);
      btn.addEventListener('click', toggleTheme);
      return true;
    }

    function toggleTheme(e) {
      const curr = getCurrent() || detectSystem();
      const next = curr === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      // grava na mesma chave usada antes, ou na key padrão 'tema'
      const usedKey = (readSaved() && readSaved().key) || 'tema';
      save(usedKey, next);
    }

    // tenta 10x se botão ainda não existir (caso carregue depois)
    if (!setupButton()) {
      let tries = 0;
      const it = setInterval(() => {
        tries++;
        if (setupButton() || tries > 10) clearInterval(it);
      }, 200);
    }

    // se o sistema mudar preferencia, atualiza só se o usuário não tem escolha salva
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!readSaved()) applyTheme(e.matches ? 'dark' : 'light');
      });
    }

    // atualização inicial do ícone
    updateIcon();
  });
})();