gsap.registerPlugin(ScrollTrigger);

  /* ═══════════════════════════════════════════════════════════
     SMOOTH SCROLL — Lenis luxury inertia
  ═══════════════════════════════════════════════════════════ */
  const lenis = new Lenis({
    lerp: 0.08,
    smoothTouch: false,
  });

  // Hook Lenis into GSAP ticker
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

/* ═══════════════════════════════════════════════════════════
   PRELOADER — percentage bar + counter + clip-out
═══════════════════════════════════════════════════════════ */
(function() {
  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('preloaderBar');
  const counter   = document.getElementById('preloaderCounter');
  if (!preloader) return;

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';

  let progress = 0;
  let assetsLoaded = 0;
  let totalAssets = 0;
  let fakeProgress = 0;
  let realDone = false;

  // Count all images + track load
  const images = document.querySelectorAll('img');
  totalAssets = images.length || 1;

  function onAssetLoad() {
    assetsLoaded++;
    const real = assetsLoaded / totalAssets;
    if (real > fakeProgress) fakeProgress = real;
    if (assetsLoaded >= totalAssets) realDone = true;
  }

  images.forEach(img => {
    if (img.complete) { onAssetLoad(); }
    else {
      img.addEventListener('load', onAssetLoad);
      img.addEventListener('error', onAssetLoad); // count errors too
    }
  });

  // Animate the bar smoothly regardless of real progress
  // Uses a fake ticker that rushes to real progress
  let displayProgress = 0;

  const ticker = gsap.ticker.add(() => {
    // Target: real progress, but always creep forward
    const target = realDone ? 1 : Math.min(fakeProgress + 0.05, 0.92);
    displayProgress += (target - displayProgress) * 0.04;
    if (realDone && displayProgress > 0.995) displayProgress = 1;

    // Update bar and counter
    gsap.set(bar, { scaleX: displayProgress });
    const pct = Math.round(displayProgress * 100);
    if (counter) counter.textContent = pct + '%';

    // When we hit 100% — exit
    if (displayProgress >= 0.999 && realDone) {
      gsap.ticker.remove(ticker);
      exitPreloader();
    }
  });

  // Safety net: force complete after 4s max
  setTimeout(() => {
    realDone = true;
  }, 4000);

  function exitPreloader() {
    const tl = gsap.timeline({ onComplete: startHeroAnimations });
    tl.to(preloader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.2,
      onComplete() {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
})();

/* ═══════════════════════════════════════════════════════════
   1. HERO — pre-hide, then reveal after preloader / curtain
═══════════════════════════════════════════════════════════ */

/* split each character into a .h-char span, preserving HTML tags */
function splitChars(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(tn => {
    const frag = document.createDocumentFragment();
    [...tn.textContent].forEach(ch => {
      if (ch === ' ' || ch === '\n') {
        frag.appendChild(document.createTextNode(ch));
      } else {
        const s = document.createElement('span');
        s.className = 'h-char';
        s.textContent = ch;
        frag.appendChild(s);
      }
    });
    tn.parentNode.replaceChild(frag, tn);
  });
  return el.querySelectorAll('.h-char');
}

/* split each word into an inline-block .h-word span */
function splitWords(el) {
  const text = el.textContent.trim();
  el.innerHTML = text.split(/\s+/).map(w =>
    `<span class="h-word" style="display:inline-block;">${w}</span>`
  ).join(' ');
  return el.querySelectorAll('.h-word');
}

/* split words while preserving inner HTML structure (walks text nodes only) */
function splitWordsDeep(el, cls) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(tn => {
    const frag = document.createDocumentFragment();
    tn.textContent.split(/(\s+)/).forEach(part => {
      if (/^\s*$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const s = document.createElement('span');
        s.className = cls;
        s.style.display = 'inline-block';
        s.textContent = part;
        frag.appendChild(s);
      }
    });
    tn.parentNode.replaceChild(frag, tn);
  });
  return el.querySelectorAll('.' + cls);
}

/* project.html has its own navbar animation — skip on that page */
const isProjectPage = !!document.querySelector('.ph-hero');

if (!isProjectPage) {
  gsap.set('.logo-wrap',    { transformPerspective: 600, rotateX: -90, opacity: 0, transformOrigin: 'top center' });
  gsap.set('.nav-top-line', { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('.nav-link',     { transformPerspective: 400, rotateX: -90, opacity: 0, transformOrigin: 'top center' });
  gsap.set('.hamburger',    { opacity: 0 });
}

let _heroChars, _heroWords;

if (document.getElementById('preloader')) {
  const titleEl = document.querySelector('.hero-title');
  const subEl   = document.querySelector('.hero-sub');

  if (titleEl) {
    _heroChars = splitChars(titleEl);
    gsap.set(_heroChars, { opacity: 0, color: '#E9C91C' });
  }
  if (subEl) {
    _heroWords = splitWords(subEl);
    gsap.set(_heroWords, { opacity: 0, y: 14 });
  }

  gsap.set('.avatar-stack .avatar', { opacity: 0, y: 16 });
  gsap.set('.avatar-label',         { opacity: 0, y: 10 });
  gsap.set('.scroll-widget',        { opacity: 0, y: 14 });
}

/* shared navbar entrance — runs on all pages (except project.html) */
function startNavAnimation() {
  const tl = gsap.timeline();
  const LINE_START = 0.1;
  const LINE_DUR   = 0.85;
  const navLinks   = gsap.utils.toArray('.nav-link');

  tl.to('.logo-wrap',    { rotateX: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, 0);
  tl.to('.nav-top-line', { scaleX: 1,  duration: LINE_DUR, ease: 'power3.out' }, LINE_START);

  navLinks.forEach((link, i) => {
    const t = LINE_START + LINE_DUR * (i / navLinks.length);
    tl.to(link, { rotateX: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, t);
  });

  tl.to('.hamburger', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.25);
}

/* home page hero content — called after preloader exits */
function startHeroAnimations() {
  startNavAnimation();
  const tl = gsap.timeline();

  /* H1: chars wave in yellow, then color-shift to white */
  if (_heroChars && _heroChars.length) {
    tl.to(_heroChars, {
      opacity: 1,
      duration: 0.04,
      stagger: { each: 0.022, from: 'start' },
      ease: 'none'
    }, 0.55);
    tl.to(_heroChars, {
      color: '#FAFAFA',
      duration: 0.4,
      stagger: { each: 0.032, from: 'start' },
      ease: 'power2.inOut'
    }, 0.68);
  }

  /* Paragraph: word by word */
  if (_heroWords && _heroWords.length) {
    tl.to(_heroWords, {
      opacity: 1,
      y: 0,
      duration: 0.38,
      stagger: { each: 0.055, from: 'start' },
      ease: 'power2.out'
    }, 0.95);
  }

  /* Avatars: one by one, then label */
  tl.to('.avatar-stack .avatar', {
    opacity: 1, y: 0,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power2.out'
  }, 1.15);
  tl.to('.avatar-label', {
    opacity: 1, y: 0,
    duration: 0.38,
    ease: 'power2.out'
  }, 1.6);

  tl.to('.scroll-widget', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.35);
}

  /* ═══════════════════════════════════════════════════════════
     2. HOME PAGE — journey + services animations
  ═══════════════════════════════════════════════════════════ */
  if (document.querySelector('#about')) {
    /* ── Title: word color wash (yellow → dark) ─────────────── */
    const jTitleEl   = document.querySelector('.journey-title');
    const jTitleWords = jTitleEl ? splitWordsDeep(jTitleEl, 'j-title-word') : [];
    if (jTitleWords.length) gsap.set(jTitleWords, { color: '#E9C91C' });

    /* highlight-box starts collapsed */
    gsap.set('.highlight-box', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.highlight-dot-tr, .highlight-dot-bl', { opacity: 0 });

    if (jTitleWords.length) {
      gsap.to(jTitleWords, {
        color: '#252525', duration: 0.4,
        stagger: { each: 0.06, from: 'start' },
        ease: 'power2.out',
        scrollTrigger: { trigger: '#about', start: 'top 75%', once: true }
      });
    }

    /* 9 words × 0.06 stagger + 0.4 duration = last word ends ~0.88 s → box at 0.95 s */
    gsap.to('.highlight-box', {
      scaleX: 1, duration: 0.65, ease: 'power3.inOut',
      delay: 0.95,
      scrollTrigger: { trigger: '#about', start: 'top 75%' }
    });
    gsap.to('.highlight-dot-tr, .highlight-dot-bl', {
      opacity: 1, duration: 0.3, ease: 'power2.out',
      delay: 1.7,
      scrollTrigger: { trigger: '#about', start: 'top 75%' }
    });

    gsap.from('.journey-right', {
      opacity: 0, x: 40, duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 70%' }
    });

    /* ── Paragraph: word-by-word build (0.5 s after container slides in) ── */
    const journeyPara = document.querySelector('.journey-text');
    if (journeyPara) {
      journeyPara.innerHTML = journeyPara.textContent.trim()
        .split(/\s+/)
        .map(w => `<span class="jt-word" style="display:inline-block;">${w}</span>`)
        .join(' ');

      gsap.from('.jt-word', {
        opacity: 0, y: 14, duration: 0.38,
        stagger: { each: 0.05, from: 'start' },
        ease: 'power2.out',
        delay: 0.5,
        scrollTrigger: { trigger: '#about', start: 'top 70%', once: true }
      });
    }

    gsap.from('.services-header', {
      opacity: 0, y: 20, duration: .6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.services-header', start: 'top 85%' }
    });
    /* ─── SERVICE CARDS — clip reveal + stagger + repeat ─── */
    document.querySelectorAll('.service-card').forEach((card, i) => {
      const delay = i * 0.15;
      gsap.set(card, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.to(card, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0, delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     3. PROJECT PANELS — expand from center with ScrollTrigger scrub
  ═══════════════════════════════════════════════════════════ */
  if (document.querySelector('.project-track')) { const contents = [
    document.getElementById('content1'),
    document.getElementById('content2'),
    document.getElementById('content3'),
  ];

  // Force initial clip-path BEFORE ScrollTrigger runs — fully hidden
  const initClip = 'inset(50% 50% 50% 50% round 0px)';
  ['bg2','bg3','overlay2','overlay3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.setProperty('clip-path', initClip, 'important');
  });

  // Make sure content1 is visible on load
  contents[0].classList.add('visible');

  function showContent(idx) {
    contents.forEach((c, i) => {
      if (i === idx) {
        if (!c.classList.contains('visible')) {
          c.classList.add('visible');
          // staggered GSAP entrance
          const els = [
            c.querySelector('.project-panel-title'),
            c.querySelector('.project-panel-sub'),
            ...c.querySelectorAll('.btn'),
          ].filter(Boolean);
          gsap.fromTo(els,
            { opacity:0, y:36, scale:.95 },
            { opacity:1, y:0, scale:1, duration:.7, stagger:.12, ease:'power3.out', clearProps:'all' }
          );
        }
      } else {
        c.classList.remove('visible');
      }
    });
  }

  // Panel 2 expand — 0% to 25% of track (~100vh)
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.project-track',
      start: 'top top',
      end: '25% top',
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress;
        const top  = gsap.utils.interpolate(50, 0, p);
        const side = gsap.utils.interpolate(50, 0, p);
        const rad  = gsap.utils.interpolate(12, 0, p);
        const clip = `inset(${top}% ${side}% ${top}% ${side}% round ${rad}px)`;
        const bg2 = document.getElementById('bg2');
        const ov2 = document.getElementById('overlay2');
        if (bg2) bg2.style.clipPath = clip;
        if (ov2) ov2.style.clipPath = clip;
        if (p > 0.8) showContent(1);
        else showContent(0);
      }
    }
  });

  // Panel 3 expand — 35% to 60% of track (~100vh)
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.project-track',
      start: '35% top',
      end: '60% top',
      scrub: 1.2,
      onUpdate(self) {
        const p = self.progress;
        const top  = gsap.utils.interpolate(50, 0, p);
        const side = gsap.utils.interpolate(50, 0, p);
        const rad  = gsap.utils.interpolate(12, 0, p);
        const clip = `inset(${top}% ${side}% ${top}% ${side}% round ${rad}px)`;
        const bg3 = document.getElementById('bg3');
        const ov3 = document.getElementById('overlay3');
        if (bg3) bg3.style.clipPath = clip;
        if (ov3) ov3.style.clipPath = clip;
        if (p > 0.8) showContent(2);
        else showContent(1);
      }
    }
  });

  // Pin the sticky container via ScrollTrigger
  ScrollTrigger.create({
    trigger: '.project-track',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.projects-sticky-container',
    pinSpacing: false,
  });
  } // end if project-track

  /* ═══════════════════════════════════════════════════════════
     4. CTA — staggered lines + slide in (only if present)
  ═══════════════════════════════════════════════════════════ */
  if (document.querySelector('.section-cta')) {
    /* highlight-box starts collapsed; grows after line1 finishes (0 + 0.8s) */
    gsap.set('.cta-highlight-box', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.cta-bracket-left, .cta-bracket-right, .cta-bracket-dot, .cta-bracket-dot-bl', { opacity: 0 });

    gsap.from('.cta-title .line1, .cta-title .line2, .cta-title .line3', {
      opacity:0, y:30, duration:.8, stagger:.18, ease:'power3.out',
      scrollTrigger: { trigger: '.section-cta', start:'top 70%' }
    });

    gsap.to('.cta-highlight-box', {
      scaleX: 1,
      duration: 0.65,
      ease: 'power3.inOut',
      delay: 0.8,
      scrollTrigger: { trigger: '.section-cta', start: 'top 70%' }
    });
    gsap.to('.cta-bracket-left, .cta-bracket-right, .cta-bracket-dot, .cta-bracket-dot-bl', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      delay: 1.25,
      scrollTrigger: { trigger: '.section-cta', start: 'top 70%' }
    });

    /* ─── CTA PARAGRAPH — yellow → dark color wash on entrance ─── */
    document.querySelectorAll('.cta-text').forEach(para => {
      para.innerHTML = para.textContent.trim()
        .split(/\s+/)
        .map(w => `<span class="ct-word" style="display:inline-block;">${w}</span>`)
        .join(' ');
    });

    gsap.set('.ct-word', { color: '#E9C91C' });

    gsap.to('.ct-word', {
      color: '#252525',
      duration: 0.4,
      stagger: { each: 0.05, from: 'start' },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.section-cta',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });

    gsap.set('.cta-mobile-content', { opacity: 0 });
    gsap.to('.cta-mobile-content', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      delay: 0.5,
      scrollTrigger: { trigger: '.section-cta', start: 'top 70%' }
    });

    gsap.from('.cta-right', {
      opacity:0, x:40, duration:.9, ease:'power3.out',
      scrollTrigger: { trigger: '.section-cta', start:'top 65%' }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     5. FOOTER — fade up
  ═══════════════════════════════════════════════════════════ */
  gsap.from('.footer-nav, .footer-social, .footer-contact', {
    opacity:0, y:24, duration:.7, stagger:.1, ease:'power2.out',
    scrollTrigger: { trigger:'footer', start:'top 85%' }
  });

  /* ═══════════════════════════════════════════════════════════
     6. BUTTON HOVER — yellow glow
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { boxShadow:'0 8px 24px rgba(233,201,28,.4)', y:-2, duration:.2 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { boxShadow:'none', y:0, duration:.2 });
    });
  });


  /* ═══════════════════════════════════════════════════════════
     CUSTOM CURSOR — dot + lagging ring
  ═══════════════════════════════════════════════════════════ */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    // hover state — check on every mouse move if dot is over a hoverable element
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .scroll-widget');
    let isHovering = false;

    // Hide cursor until first mouse move
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
    let hasMoved = false;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Show cursor on first move
      if (!hasMoved) {
        hasMoved = true;
        dot.classList.remove('is-hidden');
        ring.classList.remove('is-hidden');
      }

      // Center dot on mouse point
      dot.style.left = (mouseX - 4) + 'px';
      dot.style.top  = (mouseY - 4) + 'px';

      // Check hover by testing bounding rects of all hoverable elements
      let overHoverable = false;
      document.querySelectorAll('a, button, .service-card, .scroll-widget').forEach(el => {
        const r = el.getBoundingClientRect();
        if (mouseX >= r.left && mouseX <= r.right && mouseY >= r.top && mouseY <= r.bottom) {
          overHoverable = true;
        }
      });

      if (overHoverable && !isHovering) {
        isHovering = true;
        ring.classList.add('is-hovering');
        dot.style.opacity = '0';
      } else if (!overHoverable && isHovering) {
        isHovering = false;
        ring.classList.remove('is-hovering');
        dot.style.opacity = '1';
      }
    });

    // ring follows with lerp lag - centered (36px / 2 = 18px offset)
    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = (ringX - 18) + 'px';
      ring.style.top  = (ringY - 18) + 'px';
    });

    document.addEventListener('mouseleave', () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', () => {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    });
  }

  /* ═══════════════════════════════════════════════════════════
     MOBILE MENU — ExoApe style clip-path + text reveal
  ═══════════════════════════════════════════════════════════ */
  const mobileMenu  = document.getElementById('mobileMenu');
  const hamburger   = document.getElementById('hamburger');
  const menuClose   = document.getElementById('menuClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const menuTagline = document.querySelector('.mobile-menu-tagline');
  const menuSocials = document.querySelector('.mobile-menu-socials');
  let menuOpen = false;
  let menuAnimating = false;

  function openMenu() {
    if (menuAnimating) return;
    menuAnimating = true;
    menuOpen = true;
    lenis.stop();

    // Reset positions before animating
    gsap.set(mobileMenu, { clipPath: 'inset(0 0 100% 0)', pointerEvents: 'all' });
    gsap.set(mobileLinks, { y: '110%' });
    gsap.set([menuTagline, menuSocials], { y: '110%' });

    const tl = gsap.timeline({ onComplete: () => menuAnimating = false });
    tl.to(mobileMenu, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'power4.inOut' })
      .to(mobileLinks, { y: '0%', duration: .7, stagger: .08, ease: 'power3.out' }, '-=.4')
      .to([menuTagline, menuSocials], { y: '0%', duration: .5, stagger: .06, ease: 'power3.out' }, '-=.3');

    // hamburger → X
    const s = hamburger.querySelectorAll('span');
    gsap.to(s[0], { rotate: 45, y: 7.5, duration: .4, ease: 'power3.inOut' });
    gsap.to(s[1], { scaleX: 0, duration: .2, ease: 'power3.inOut' });
    gsap.to(s[2], { rotate: -45, y: -7.5, duration: .4, ease: 'power3.inOut' });
  }

  function closeMenu() {
    if (menuAnimating) return;
    menuAnimating = true;
    menuOpen = false;
    lenis.start();

    const tl = gsap.timeline({ onComplete: () => {
      gsap.set(mobileMenu, { pointerEvents: 'none' });
      menuAnimating = false;
    }});
    tl.to(mobileLinks, { y: '110%', duration: .35, stagger: .04, ease: 'power3.in' })
      .to([menuTagline, menuSocials], { y: '110%', duration: .3, ease: 'power3.in' }, '<')
      .to(mobileMenu, { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'power4.inOut' }, '-=.1');

    // X → hamburger
    const s = hamburger.querySelectorAll('span');
    gsap.to(s[0], { rotate: 0, y: 0, duration: .4, delay: .1, ease: 'power3.inOut' });
    gsap.to(s[1], { scaleX: 1, duration: .3, delay: .15, ease: 'power3.inOut' });
    gsap.to(s[2], { rotate: 0, y: 0, duration: .4, delay: .1, ease: 'power3.inOut' });
  }

  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  menuClose.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

  /* ═══════════════════════════════════════════════════════════
     DESKTOP NAV — active yellow + hover line left→right on top bar
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === window.location.hash || (href === '#' && !window.location.hash)) {
      link.classList.add('nav-active');
    }

    const indicator = document.createElement('span');
    indicator.style.cssText = `
      position:absolute; top:-16px; left:0;
      width:0%; height:3px;
      background:var(--yellow-600);
      pointer-events:none;
    `;
    link.appendChild(indicator);

    link.addEventListener('mouseenter', () => {
      gsap.fromTo(indicator,
        { width: '0%', left: '0%' },
        { width: '100%', duration: .3, ease: 'power2.out' }
      );
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(indicator, {
        width: '0%', left: '100%', duration: .25, ease: 'power2.in',
        onComplete: () => gsap.set(indicator, { left: '0%' })
      });
    });
  });
  document.querySelectorAll('.service-card').forEach(card => {
    const label = card.querySelector('.service-label');
    if (!label) return;
    card.addEventListener('mouseenter', () => gsap.to(label, { scale:1.1, duration:.3, ease:'power2.out' }));
    card.addEventListener('mouseleave', () => gsap.to(label, { scale:1, duration:.3 }));
  });
/* ═══════════════════════════════════════════════════════════
   PAGE TRANSITIONS — curtain wipe
═══════════════════════════════════════════════════════════ */
(function() {
  // Reuse curtain if already in HTML (non-home pages inject it for instant coverage),
  // otherwise create it (home page — preloader handles the initial cover).
  let curtain = document.querySelector('.curtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.innerHTML = '<div class="curtain-logo">MR<span>•</span>HOME</div>';
    document.body.appendChild(curtain);
  }

  const curtainLogo = curtain.querySelector('.curtain-logo');

  // ENTER animation — runs on every page load (curtain slides OUT)
  function curtainEnter() {
    gsap.set(curtain, { scaleY: 1, transformOrigin: 'top', pointerEvents: 'none' });
    gsap.to(curtainLogo, { opacity: 0, duration: 0 });
    gsap.to(curtain, {
      scaleY: 0,
      duration: .9,
      ease: 'power4.inOut',
      transformOrigin: 'top',
      delay: .1,
      onComplete() {
        if (!isProjectPage) startNavAnimation();
      }
    });
  }

  // EXIT animation — runs when a link is clicked
  function curtainExit(href) {
    curtain.style.pointerEvents = 'all';
    gsap.set(curtain, { scaleY: 0, transformOrigin: 'bottom' });

    const tl = gsap.timeline({
      onComplete: () => window.location.href = href
    });

    tl.to(curtain, {
      scaleY: 1,
      duration: .8,
      ease: 'power4.inOut',
      transformOrigin: 'bottom',
    })
    .to(curtainLogo, {
      opacity: 1,
      duration: .3,
      ease: 'power2.out',
    }, '-=.2');
  }

  // Run enter animation on load — only if no preloader
  window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('preloader')) curtainEnter();
  });

  // Intercept all internal link clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, anchors, and empty hrefs
    if (href.startsWith('http') || href.startsWith('#') || href === '') return;

    // Skip if modifier key held (open in new tab etc)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    if (lenis) lenis.stop();
    curtainExit(href);
  });
})();
