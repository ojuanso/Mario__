/* tilt-card.js — efecto tilt + glare para [data-tilt] */
(function initTiltCard(){
  function ready(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once:true });
    } else { fn(); }
  }

  ready(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(document.querySelectorAll('[data-tilt]'));
    if (!cards.length) {
      console.warn('[tilt-card] No se encontraron elementos [data-tilt].');
      return;
    }

    cards.forEach((card) => {
      const max = parseFloat(card.getAttribute('data-max-tilt')) || 12;
      let rafId = null;

      const update = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width;   // 0..1
        const y = (clientY - rect.top)  / rect.height;  // 0..1
        const rx = (0.5 - y) * (max * 2);
        const ry = (x - 0.5) * (max * 2);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
          card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
          card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        });
      };

      const onPointerMove = (e) => {
        const pt = e.touches ? e.touches[0] : e;
        update(pt.clientX, pt.clientY);
      };

      const onLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        card.style.setProperty('--gx', '50%');
        card.style.setProperty('--gy', '50%');
      };

      // eventos (mouse + touch)
      card.addEventListener('mousemove', onPointerMove);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('touchmove', onPointerMove, { passive: true });
      card.addEventListener('touchend', onLeave);
      card.addEventListener('touchcancel', onLeave);
    });
  });
})();


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("themeToggle");
  let isNewTheme = false;

  const defaultTheme = {
    "--bg": "#0a0d12",
    "--surface": "#0f141b",
    "--text": "#e6edf5",
    "--muted": "#a9b4c1",
    "--accent": "#FF5400",
    "--accent-2": "#FF7300"
  };

  const newTheme = {
    "--bg": "#FFFFFF",
    "--surface": "#F5F5F5",
    "--text": "#1B1B1E",
    "--muted": "#666A73",
    "--accent": "#FF5400",
    "--accent-2": "#FF7300"
  };

  const setTheme = (theme) => {
    for (let key in theme) {
      document.documentElement.style.setProperty(key, theme[key]);
    }
  };

  btn.addEventListener("click", () => {
    isNewTheme = !isNewTheme;
    setTheme(isNewTheme ? newTheme : defaultTheme);
    btn.textContent = isNewTheme ? "Estilo oscuro" : "Estilo claro";
  });
});
