/* ═══════════════════════════════════════════════════════════
   PROJECTS PAGE
═══════════════════════════════════════════════════════════ */
(function () {

  /* ─── CUBE TEXT ANIMATION ─────────────────────────────── */
  const letters = document.querySelectorAll('.pl');
  if (letters.length) {
    gsap.set(letters, { rotateX: -90, y: '110%' });
    gsap.to(letters, {
      rotateX: 0,
      y: '0%',
      duration: 0.75,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.85
    });
  }

  /* ─── INFINITE CAROUSEL ───────────────────────────────── */
  const cards = Array.from(document.querySelectorAll('.projects-card'));
  if (!cards.length) return;

  const CARD_COUNT = cards.length;
  const SPEED = 0.9;
  const GAP_D = 40;
  const GAP_M = 20;

  let dims = {};
  let positions = [];
  let STEP, TOTAL;

  function measure() {
    dims.w = cards[0].offsetWidth;
    dims.h = cards[0].offsetHeight;
    dims.gap = window.innerWidth > 900 ? GAP_D : GAP_M;
    STEP = dims.w + dims.gap;
    TOTAL = CARD_COUNT * STEP;
  }

  function init() {
    measure();
    cards.forEach((_, i) => {
      positions[i] = i * STEP;
    });
  }

  function render() {
    const vw = window.innerWidth;
    const center = vw / 2;
    const maxDist = vw * 0.65;

    cards.forEach((card, i) => {
      const cardCenter = positions[i] + dims.w / 2;
      const dist = Math.abs(cardCenter - center);
      const norm = Math.min(dist / maxDist, 1);

      const scale = gsap.utils.interpolate(1.08, 1.0, norm);
      const opacity = gsap.utils.interpolate(1, 0.1, norm);

      gsap.set(card, {
        x: positions[i],
        y: '-50%',
        scale,
        opacity,
        rotation: 10,
        transformOrigin: 'center center'
      });
    });
  }

  init();
  render();

  gsap.ticker.add(() => {
    cards.forEach((_, i) => {
      positions[i] -= SPEED;
      /* when card is fully off-screen left, wrap it to the right */
      if (positions[i] + dims.w < 0) {
        positions[i] += TOTAL;
      }
    });
    render();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      init();
      render();
    }, 100);
  });

})();
