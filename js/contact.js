/* ═══════════════════════════════════════════════════════════
   CONTACT PAGE — animations + form
═══════════════════════════════════════════════════════════ */

// Hero — char wave + highlight (matches about hero pattern)
(function() {
  const titleEl = document.querySelector('.contact-hero-title');
  const chars   = titleEl ? splitChars(titleEl) : [];

  if (chars.length) gsap.set(chars, { opacity: 0, color: '#E9C91C' });
  gsap.set('.ch-highlight-box', { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('.ch-dot-tr, .ch-dot-bl', { opacity: 0 });

  const T = 0.45;

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

  gsap.to('.ch-highlight-box', {
    scaleX: 1, duration: 0.65, ease: 'power3.inOut', delay: 1.65
  });
  gsap.to('.ch-dot-tr, .ch-dot-bl', {
    opacity: 1, duration: 0.3, ease: 'power2.out', delay: 2.2
  });
})();

gsap.from('.contact-info-card', {
  opacity: 0, y: 30, duration: 0.8,
  stagger: 0.12, delay: 0.6,
  ease: 'power3.out'
});

// Form section scroll reveal
gsap.from('.contact-form-left', {
  opacity: 0, x: -40, duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-form-section', start: 'top 70%' }
});

gsap.from('.contact-form', {
  opacity: 0, x: 40, duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-form-section', start: 'top 70%' }
});

gsap.from('.form-field', {
  opacity: 0, y: 20, duration: 0.6,
  stagger: 0.08, ease: 'power2.out',
  scrollTrigger: { trigger: '.contact-form', start: 'top 80%' }
});

// Form submission handler
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Animate button
    gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    btn.innerHTML = '✓ Message Sent!';
    btn.style.background = '#2d7a3a';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}
