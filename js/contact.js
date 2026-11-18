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

// Form section — vertical blinds on title, word-by-word on paragraph
(function() {
  function makeBlinds(el, count, bg) {
    el.style.position = 'relative';
    const strips = [];
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.style.cssText = `display:block;position:absolute;top:0;bottom:0;` +
        `left:${(i / count) * 100}%;width:calc(${100 / count}% + 1px);` +
        `background:${bg};z-index:2;pointer-events:none;transform-origin:center center;`;
      el.appendChild(s);
      strips.push(s);
    }
    return strips;
  }

  const titleEl = document.querySelector('.contact-form-title');
  const strips  = titleEl ? makeBlinds(titleEl, 8, '#FAFAFA') : [];

  if (strips.length) {
    gsap.to(strips, {
      scaleX: 0, duration: 0.45,
      stagger: { each: 0.06, from: 'start' },
      ease: 'power2.inOut',
      scrollTrigger: { trigger: '.contact-form-section', start: 'top 75%', once: true }
    });
  }

  const descEl = document.querySelector('.contact-form-desc');
  if (descEl) {
    descEl.innerHTML = descEl.textContent.trim()
      .split(/\s+/)
      .map(w => `<span class="cfd-word" style="display:inline-block;">${w}</span>`)
      .join(' ');
  }

  gsap.from('.cfd-word', {
    opacity: 0, y: 14, duration: 0.35,
    stagger: { each: 0.015, from: 'start' },
    ease: 'power2.out',
    delay: 0.35,
    scrollTrigger: { trigger: '.contact-form-section', start: 'top 70%', once: true }
  });
})();

gsap.from('.contact-form', {
  opacity: 0, y: 40, duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-form-section', start: 'top 70%' }
});

// Form fields — input slides up from bottom, border grows left-to-right, staggered per field
(function() {
  const fields = document.querySelectorAll('.form-field');

  fields.forEach(field => {
    const line = document.createElement('span');
    line.className = 'field-line';
    field.appendChild(line);
  });

  gsap.set('.form-field input, .form-field select, .form-field textarea', { opacity: 0, y: 28 });
  gsap.set('.field-line', { scaleX: 0 });

  fields.forEach((field, i) => {
    const delay   = i * 0.12;
    const input   = field.querySelector('input, select, textarea');
    const line    = field.querySelector('.field-line');
    const trigger = { scrollTrigger: { trigger: '.contact-form', start: 'top 80%', once: true } };

    if (input) {
      gsap.to(input, {
        opacity: 1, y: 0,
        duration: 0.55, ease: 'power3.out',
        delay,
        ...trigger
      });
    }

    if (line) {
      gsap.to(line, {
        scaleX: 1,
        duration: 0.5, ease: 'power2.out',
        delay: delay + 0.25,
        ...trigger
      });
    }
  });
})();

// Form submission handler
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');

  // Arrived back here from the no-JS fallback after a server error
  if (status && new URLSearchParams(location.search).get('error')) {
    status.textContent = 'Sorry, your message could not be sent. Please call or WhatsApp us on +20 11 42451985.';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    if (status) status.textContent = '';

    gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    btn.disabled = true;
    btn.innerHTML = 'SENDING…';

    try {
      const res  = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Request failed');

      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = '#2d7a3a';
      // Thank-you page fires the Meta "Lead" event and gives ads a conversion URL
      setTimeout(() => { window.location.href = '/thank-you'; }, 600);
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      if (status) {
        status.textContent = (err && err.message && err.message !== 'Request failed' && !/fetch|network|JSON/i.test(err.message))
          ? err.message
          : 'Sorry, your message could not be sent. Please call or WhatsApp us on +20 11 42451985.';
      }
    }
  });
}
