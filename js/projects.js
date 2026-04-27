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

  document.querySelectorAll('.pci[data-transition]').forEach(card => {
    const slides = Array.from(card.querySelectorAll('.pci-slide'));
    if (slides.length < 2) return;

    const type = card.dataset.transition;
    let idx = 0;
    let busy = false;

    /* set initial z-indices */
    slides.forEach((s, i) => gsap.set(s, { zIndex: i === 0 ? 1 : 0 }));

    function advance() {
      if (busy) return;
      busy = true;
      const out = slides[idx];
      idx = (idx + 1) % slides.length;
      const inn = slides[idx];
      const done = () => {
        out.classList.remove('active');
        inn.classList.add('active');
        busy = false;
      };
      if (type === 'a') transA(out, inn, done);
      else if (type === 'b') transB(out, inn, card, done);
      else if (type === 'c') transC(out, inn, done);
    }

    /* first transition at 2s, then every 4s */
    setTimeout(() => {
      advance();
      setInterval(advance, 4000);
    }, 2000);
  });

  /* ── Option A: vertical curtain wipe ─────────────────── */
  function transA(out, inn, done) {
    gsap.set(out, { zIndex: 2, y: '0%' });
    gsap.set(inn, { zIndex: 1, y: '0%' });

    const tl = gsap.timeline({ onComplete: () => {
      gsap.set(out, { zIndex: 0, y: '0%' });
      done();
    }});

    /* outgoing slides up and out */
    tl.to(out, { y: '-100%', duration: 0.9, ease: 'power4.inOut' }, 0);
    /* incoming rises from below simultaneously */
    gsap.set(inn, { y: '100%' });
    tl.to(inn, { y: '0%', duration: 0.9, ease: 'power4.inOut' }, 0);
  }

  /* ── Option B: staggered horizontal strips ───────────── */
  function transB(out, inn, card, done) {
    const N = 6;
    const cardH = card.offsetHeight;
    const stripH = cardH / N;
    const imgSrc = inn.querySelector('img').src;

    gsap.set(out, { zIndex: 1 });
    gsap.set(inn, { zIndex: 0 });

    /* build strips each showing a horizontal slice of the next image */
    const strips = Array.from({ length: N }, (_, i) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = `position:absolute;left:0;right:0;top:${i * stripH}px;height:${stripH}px;overflow:hidden;z-index:10;`;
      const img = document.createElement('img');
      img.src = imgSrc;
      img.style.cssText = `position:absolute;top:${-i * stripH}px;left:0;right:0;width:100%;height:${cardH}px;object-fit:cover;`;
      wrap.appendChild(img);
      card.appendChild(wrap);
      return wrap;
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(inn, { zIndex: 2 });
        gsap.set(out, { zIndex: 0 });
        strips.forEach(s => s.remove());
        done();
      }
    });

    strips.forEach((strip, i) => {
      gsap.set(strip, { x: i % 2 === 0 ? '110%' : '-110%' });
      tl.to(strip, { x: '0%', duration: 0.5, ease: 'power3.inOut' }, i * 0.07);
    });
  }

  /* ── Option C: scale + depth crossfade ───────────────── */
  function transC(out, inn, done) {
    gsap.set(out, { zIndex: 2 });
    gsap.set(inn, { zIndex: 1, opacity: 0 });
    gsap.set(inn.querySelector('img'), { scale: 1.07 });

    const tl = gsap.timeline({ onComplete: () => {
      gsap.set(out, { zIndex: 0, opacity: 1 });
      gsap.set(out.querySelector('img'), { clearProps: 'scale' });
      done();
    }});

    /* outgoing: zooms in and fades */
    tl.to(out.querySelector('img'), { scale: 1.1, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(out, { opacity: 0, duration: 0.65, ease: 'power2.in' }, 0);

    /* incoming: fades in while zooming out to natural size */
    tl.to(inn, { opacity: 1, duration: 0.75, ease: 'power2.out' }, 0.18)
      .to(inn.querySelector('img'), { scale: 1, duration: 0.9, ease: 'power2.out' }, 0.18);
  }

})();
