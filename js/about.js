/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE — GSAP animations
═══════════════════════════════════════════════════════════ */

// Hero entrance
(function() {
  const titleEl    = document.querySelector('.about-hero-title');
  const subtitleEl = document.querySelector('.about-hero-subtitle');
  const descEl     = document.querySelector('.about-hero-desc');

  const chars    = titleEl    ? splitChars(titleEl)    : [];
  const subWords = subtitleEl ? splitWords(subtitleEl) : [];
  const dscWords = descEl     ? splitWords(descEl)     : [];

  // Pre-hide
  if (chars.length)    gsap.set(chars,    { opacity: 0, color: '#E9C91C' });
  if (subWords.length) gsap.set(subWords, { opacity: 0, y: 12 });
  if (dscWords.length) gsap.set(dscWords, { opacity: 0, y: 12 });
  gsap.set('.about-highlight-box', { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('.about-title-dot-tr, .about-title-dot-bl', { opacity: 0 });
  gsap.set('.about-hero .scroll-widget', { opacity: 0, y: 14 });

  const T = 0.45; // title start offset

  // H1: chars wave in yellow then shift to white
  if (chars.length) {
    gsap.to(chars, {
      opacity: 1, duration: 0.04,
      stagger: { each: 0.022, from: 'start' },
      ease: 'none', delay: T
    });
    gsap.to(chars, {
      color: '#FAFAFA', duration: 0.4,
      stagger: { each: 0.032, from: 'start' },
      ease: 'power2.inOut', delay: T + 0.13
    });
  }

  // Subtitle: word by word  (ends ~1.52 s)
  if (subWords.length) {
    gsap.to(subWords, {
      opacity: 1, y: 0, duration: 0.35,
      stagger: { each: 0.06, from: 'start' },
      ease: 'power2.out', delay: 0.75
    });
  }

  // Desc: word by word  (each: 0.015 → ~37 words × 0.015 = 0.555 s stagger → ends ~1.78 s)
  if (dscWords.length) {
    gsap.to(dscWords, {
      opacity: 1, y: 0, duration: 0.28,
      stagger: { each: 0.015, from: 'start' },
      ease: 'power2.out', delay: 0.95
    });
  }

  // Scroll widget
  gsap.to('.about-hero .scroll-widget', {
    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 1.15
  });

  // Highlight: box + lines grow after ALL text animations finish (~1.85 s)
  gsap.to('.about-highlight-box', {
    scaleX: 1, duration: 0.65, ease: 'power3.inOut', delay: 1.85
  });
  gsap.to('.about-title-dot-tr, .about-title-dot-bl', {
    opacity: 1, duration: 0.3, ease: 'power2.out', delay: 2.5
  });
})();

// Photo grid — stagger clip reveal
gsap.set('.about-grid-img', { clipPath: 'inset(100% 0 0 0)' });
gsap.to('.about-grid-img', {
  clipPath: 'inset(0% 0 0 0)',
  duration: 1.0,
  stagger: .12,
  delay: .4,
  ease: 'expo.out',
});

// Photo grid — staggered parallax (image slides down, each one lags more than the one above)
(function() {
  const scrub = [0.8, 1.6, 2.8, 4.2]; // increasing lag per image

  document.querySelectorAll('.about-grid-img').forEach((container, i) => {
    const img = container.querySelector('img');
    if (!img) return;

    gsap.fromTo(img,
      { y: -30 },
      {
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-hero-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: scrub[i]
        }
      }
    );
  });
})();

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

// CTA
gsap.from('.cta-left', {
  opacity: 0, x: -40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 70%' }
});
gsap.from('.cta-right', {
  opacity: 0, x: 40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 65%' }
});
