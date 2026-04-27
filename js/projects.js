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
  // Clone the 5 cards → 10 so the loop always has cards entering from the right
  const carouselWrap = document.querySelector('.projects-carousel-wrap');
  if (!carouselWrap) return;

  const origCards = Array.from(carouselWrap.querySelectorAll('.projects-card'));
  origCards.forEach(card => carouselWrap.appendChild(card.cloneNode(true)));

  const cards = Array.from(carouselWrap.querySelectorAll('.projects-card')); // 10
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
    TOTAL = CARD_COUNT * STEP; // 10 × 320 = 3200px — always > any viewport
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
        rotation: 0,
        transformOrigin: 'center center'
      });
    });
  }

  init();
  render();

  gsap.ticker.add(() => {
    cards.forEach((_, i) => {
      positions[i] -= SPEED;
      /* when fully off-screen left, jump to right end of the stream */
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

/* ═══════════════════════════════════════════════════════════
   PROJECT CARD GALLERIES
═══════════════════════════════════════════════════════════ */
(function () {

  document.querySelectorAll('.pci').forEach(card => {
    const slides = Array.from(card.querySelectorAll('.pci-slide'));
    if (!slides.length) return;

    /* ── build progress bar ──────────────────────────────── */
    const progress = document.createElement('div');
    progress.className = 'pci-progress';
    const bars = slides.map((_, i) => {
      const bar = document.createElement('div');
      bar.className = 'pci-bar' + (i === 0 ? ' active' : '');
      const fill = document.createElement('div');
      fill.className = 'pci-bar-fill';
      bar.appendChild(fill);
      progress.appendChild(bar);
      return bar;
    });
    card.appendChild(progress);

    if (slides.length < 2) return;

    let idx = 0;
    let busy = false;

    slides.forEach((s, i) => gsap.set(s, { zIndex: i === 0 ? 1 : 0 }));

    function startTimer() {
      const fill = bars[idx].querySelector('.pci-bar-fill');
      gsap.set(fill, { width: '0%' });
      gsap.to(fill, { width: '100%', duration: 4, ease: 'none', onComplete: advance });
    }

    function advance() {
      if (busy) return;
      busy = true;

      /* deactivate old bar — shrink it and clear fill */
      const oldBar = bars[idx];
      oldBar.classList.remove('active');
      gsap.set(oldBar.querySelector('.pci-bar-fill'), { width: '0%' });

      const out = slides[idx];
      idx = (idx + 1) % slides.length;
      const inn = slides[idx];

      /* activate new bar */
      bars[idx].classList.add('active');
      gsap.set(bars[idx].querySelector('.pci-bar-fill'), { width: '0%' });

      transC(out, inn, () => {
        out.classList.remove('active');
        inn.classList.add('active');
        busy = false;
        startTimer();
      });
    }

    /* begin after 2s so images have loaded */
    setTimeout(startTimer, 2000);
  });

  /* ── Scale + depth crossfade ─────────────────────────── */
  function transC(out, inn, done) {
    gsap.set(out, { zIndex: 2 });
    gsap.set(inn, { zIndex: 1, opacity: 0 });
    /* incoming image starts at 1.1 — stays there while fading in */
    gsap.set(inn.querySelector('img'), { scale: 1.1 });

    const tl = gsap.timeline({ onComplete: () => {
      gsap.set(out, { zIndex: 0, opacity: 1 });
      gsap.set(out.querySelector('img'), { clearProps: 'scale' });
      done();
    }});

    /* outgoing: slight zoom-in + fade out */
    tl.to(out.querySelector('img'), { scale: 1.15, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(out, { opacity: 0, duration: 0.65, ease: 'power2.in' }, 0);

    /* incoming: fades in while simultaneously scaling back to 1 */
    tl.to(inn, { opacity: 1, duration: 0.75, ease: 'power2.out' }, 0.18)
      .to(inn.querySelector('img'), { scale: 1, duration: 0.75, ease: 'power2.out' }, 0.18);
  }

})();
