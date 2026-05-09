/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE — GSAP animations
═══════════════════════════════════════════════════════════ */

// Hero entrance
gsap.from('.about-hero-title', {
  opacity: 0, y: 40, duration: .9, delay: .3, ease: 'power3.out'
});
gsap.from('.about-hero-subtitle', {
  opacity: 0, y: 20, duration: .7, delay: .5, ease: 'power3.out'
});
gsap.from('.about-hero-desc', {
  opacity: 0, y: 20, duration: .7, delay: .65, ease: 'power3.out'
});
gsap.from('.scroll-widget', {
  opacity: 0, scale: .8, duration: .6, delay: .8, ease: 'back.out(1.7)'
});

// Photo grid — stagger clip reveal
gsap.set('.about-grid-img', { clipPath: 'inset(100% 0 0 0)' });
gsap.to('.about-grid-img', {
  clipPath: 'inset(0% 0 0 0)',
  duration: 1.0,
  stagger: .12,
  delay: .4,
  ease: 'expo.out',
});

// Journey section
gsap.from('.about-journey-title', {
  opacity: 0, x: -40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-journey', start: 'top 75%' }
});
gsap.from('.about-journey-desc', {
  opacity: 0, y: 24, duration: .7, stagger: .15, ease: 'power2.out',
  scrollTrigger: { trigger: '.about-journey', start: 'top 70%' }
});

// Collage images — parallax
gsap.fromTo('.about-collage-img-1',
  { y: 30 },
  { y: -30, ease: 'none',
    scrollTrigger: { trigger: '.about-collage', start: 'top bottom', end: 'bottom top', scrub: true }
  }
);
gsap.fromTo('.about-collage-img-2',
  { y: -20 },
  { y: 20, ease: 'none',
    scrollTrigger: { trigger: '.about-collage', start: 'top bottom', end: 'bottom top', scrub: true }
  }
);

// Difference section
gsap.from('.about-difference-title', {
  opacity: 0, y: 30, duration: .8, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-difference', start: 'top 75%' }
});

// Culture cards — clip reveal with stagger
gsap.set('.about-culture-card', { clipPath: 'inset(100% 0 0 0)' });
gsap.to('.about-culture-card', {
  clipPath: 'inset(0% 0 0 0)',
  duration: .9, stagger: .1, ease: 'expo.out',
  scrollTrigger: { trigger: '.about-culture-grid', start: 'top 80%',
    toggleActions: 'play reverse play reverse'
  }
});

// Sustainability
gsap.from('.about-sust-title', {
  opacity: 0, x: -40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-sustainability', start: 'top 70%' }
});
gsap.from('.about-sustainability-right', {
  opacity: 0, x: 40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-sustainability', start: 'top 65%' }
});

/* ═══════════════════════════════════════════════════════════
   COLLAGE — hover expand + click to fullscreen
═══════════════════════════════════════════════════════════ */
(function () {
  const wraps    = document.querySelectorAll('.about-collage-img');
  const overlay  = document.getElementById('collageOverlay');
  const oImg     = document.getElementById('collageOverlayImg');
  const closeBtn = document.getElementById('collageOverlayClose');
  if (!overlay || !wraps.length) return;

  let isOpen   = false;
  let openWrap = null;

  function pct(px, total) { return (px / total * 100).toFixed(3); }

  /* ── hover ─────────────────────────────────────────────── */
  wraps.forEach(wrap => {
    const others = Array.from(wraps).filter(w => w !== wrap);

    wrap.addEventListener('mouseenter', () => {
      if (isOpen) return;
      gsap.to(wrap.querySelector('img'), { scale: 1.06, duration: 0.6, ease: 'power2.out' });
      others.forEach(o => gsap.to(o, { opacity: 0.38, duration: 0.4, ease: 'power2.out' }));
    });

    wrap.addEventListener('mouseleave', () => {
      if (isOpen) return;
      gsap.to(wrap.querySelector('img'), { scale: 1, duration: 0.6, ease: 'power2.out' });
      others.forEach(o => gsap.to(o, { opacity: 1, duration: 0.4, ease: 'power2.out' }));
    });

    wrap.addEventListener('click', () => { if (!isOpen) openOverlay(wrap); });
  });

  /* ── open ──────────────────────────────────────────────── */
  function openOverlay(wrap) {
    isOpen   = true;
    openWrap = wrap;

    gsap.to(wrap.querySelector('img'), { scale: 1, duration: 0.25 });
    Array.from(wraps).filter(w => w !== wrap).forEach(o => gsap.to(o, { opacity: 1, duration: 0.25 }));

    oImg.src = wrap.querySelector('img').src;
    oImg.alt = wrap.querySelector('img').alt;

    const r  = wrap.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const from = `inset(${pct(r.top,vh)}% ${pct(vw-r.right,vw)}% ${pct(vh-r.bottom,vh)}% ${pct(r.left,vw)}%)`;

    gsap.set(overlay,  { clipPath: from, pointerEvents: 'all' });
    gsap.set(closeBtn, { opacity: 0, scale: 0.75 });
    gsap.set(oImg,     { scale: 1.08 });
    if (window.lenis) lenis.stop();

    gsap.timeline()
      .to(overlay,  { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power4.inOut' }, 0)
      .to(oImg,     { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
      .to(closeBtn, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, 0.7);
  }

  /* ── close ─────────────────────────────────────────────── */
  function closeOverlay() {
    if (!isOpen) return;

    const r  = openWrap.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const to = `inset(${pct(r.top,vh)}% ${pct(vw-r.right,vw)}% ${pct(vh-r.bottom,vh)}% ${pct(r.left,vw)}%)`;

    gsap.timeline({ onComplete: () => {
      gsap.set(overlay, { pointerEvents: 'none' });
      isOpen   = false;
      openWrap = null;
      if (window.lenis) lenis.start();
    }})
      .to(closeBtn, { opacity: 0, scale: 0.75, duration: 0.2, ease: 'power2.in' }, 0)
      .to(overlay,  { clipPath: to, duration: 0.75, ease: 'power4.inOut' }, 0.1);
  }

  closeBtn.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeOverlay(); });
})();

// CTA
gsap.from('.cta-left', {
  opacity: 0, x: -40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 70%' }
});
gsap.from('.cta-right', {
  opacity: 0, x: 40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 65%' }
});
