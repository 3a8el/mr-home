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
   1. HERO — fires after preloader exits
═══════════════════════════════════════════════════════════ */
function startHeroAnimations() {
  gsap.from('.logo-wrap',    { opacity:0, y:20,  duration:.8, delay:.05, ease:'power3.out' });
  gsap.from('.nav-links',    { opacity:0, y:-20, duration:.8, delay:.15, ease:'power3.out' });
  gsap.from('.hero-title',   { opacity:0, y:40,  duration:.9, delay:.3,  ease:'power3.out' });
  gsap.from('.hero-sub',     { opacity:0, y:30,  duration:.8, delay:.5,  ease:'power3.out' });
  gsap.from('.avatar-row',   { opacity:0, y:20,  duration:.7, delay:.65, ease:'power3.out' });
  gsap.from('.scroll-widget',{ opacity:0, scale:.8, duration:.6, delay:.78, ease:'back.out(1.7)' });
}

  /* ═══════════════════════════════════════════════════════════
     2. JOURNEY TITLE LINES — stagger slide in from left
  ═══════════════════════════════════════════════════════════ */
  gsap.from('.journey-title .line-1, .journey-title .line-2, .journey-title .line-3', {
    opacity: 0, x: -40, duration: .8,
    stagger: .15, ease: 'power3.out',
    scrollTrigger: { trigger: '#about', start: 'top 75%' }
  });
  gsap.from('.journey-right', {
    opacity: 0, x: 40, duration: .9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#about', start: 'top 70%' }
  });
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

  /* ═══════════════════════════════════════════════════════════
     3. PROJECT PANELS — expand from center with ScrollTrigger scrub
  ═══════════════════════════════════════════════════════════ */
  const contents = [
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

  /* ═══════════════════════════════════════════════════════════
     4. CTA — staggered lines + slide in
  ═══════════════════════════════════════════════════════════ */
  gsap.from('.cta-title .line1, .cta-title .line2, .cta-title .line3', {
    opacity:0, y:30, duration:.8, stagger:.18, ease:'power3.out',
    scrollTrigger: { trigger: '.section-cta', start:'top 70%' }
  });
  gsap.from('.cta-right', {
    opacity:0, x:40, duration:.9, ease:'power3.out',
    scrollTrigger: { trigger: '.section-cta', start:'top 65%' }
  });

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
      position:absolute; top:-19px; left:0;
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
  // Inject curtain element
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.innerHTML = '<div class="curtain-logo">MR<span>•</span>HOME</div>';
  document.body.appendChild(curtain);

  const curtainLogo = curtain.querySelector('.curtain-logo');

  // ENTER animation — runs on every page load (curtain slides OUT)
  function curtainEnter() {
    // Start curtain covering the page, then reveal
    gsap.set(curtain, { scaleY: 1, transformOrigin: 'top', pointerEvents: 'none' });
    gsap.to(curtainLogo, { opacity: 0, duration: 0 });
    gsap.to(curtain, {
      scaleY: 0,
      duration: .9,
      ease: 'power4.inOut',
      transformOrigin: 'top',
      delay: .1,
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
