/* ═══════════════════════════════════════════════════════════
   CONTACT PAGE — animations + form
═══════════════════════════════════════════════════════════ */

// Hero title + cards stagger in on load
gsap.from('.contact-hero-title', {
  opacity: 0, y: 40, duration: 1,
  delay: 0.3, ease: 'power3.out'
});

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
