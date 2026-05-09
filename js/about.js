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

// CTA
gsap.from('.cta-left', {
  opacity: 0, x: -40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 70%' }
});
gsap.from('.cta-right', {
  opacity: 0, x: 40, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.section-cta', start: 'top 65%' }
});
