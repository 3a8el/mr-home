/* ═══════════════════════════════════════════════════════════
   PROJECT SINGLE PAGE
═══════════════════════════════════════════════════════════ */
(function () {
  const loader   = document.getElementById('phLoader');
  const imgWrap  = document.querySelector('.ph-img-wrap');
  const heroImg  = document.querySelector('.ph-img-wrap img');
  const titleEls = document.querySelectorAll('.ph-title .ph-pl');
  const subEls   = document.querySelectorAll('.ph-sub .ph-pl');
  const navbar   = document.querySelector('.ph-hero .navbar');

  if (!heroImg || !imgWrap) return;

  /* set initial hidden states */
  gsap.set([titleEls, subEls], { rotateX: -90, y: '110%' });
  gsap.set(imgWrap, { clipPath: 'inset(100% 0 0 0)' });
  if (navbar) gsap.set(navbar, { opacity: 0, y: -10 });

  function startAnimation() {
    const tl = gsap.timeline();

    /* loader fades out */
    tl.to(loader, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .set(loader, { display: 'none' }, 0.5);

    /* image clips up — reveals from bottom to top */
    tl.to(imgWrap, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'power4.inOut',
    }, 0.15);

    /* navbar drops in */
    if (navbar) {
      tl.to(navbar, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.4);
    }

    /* project title words animate in */
    tl.to(titleEls, {
      rotateX: 0,
      y: '0%',
      duration: 0.75,
      stagger: 0.08,
      ease: 'power3.out',
    }, 0.65);

    /* sub heading follows 0.5s after title starts */
    tl.to(subEls, {
      rotateX: 0,
      y: '0%',
      duration: 0.75,
      stagger: 0.07,
      ease: 'power3.out',
    }, 1.15);
  }

  /* wait for both the page-transition curtain (~1s) and the image */
  let imgReady = false;
  const t0 = Date.now();
  const MIN_WAIT = 1000;

  function maybeStart() {
    if (!imgReady) return;
    const remaining = Math.max(0, MIN_WAIT - (Date.now() - t0));
    setTimeout(startAnimation, remaining);
  }

  if (heroImg.complete && heroImg.naturalWidth > 0) {
    imgReady = true;
    maybeStart();
  } else {
    heroImg.addEventListener('load',  () => { imgReady = true; maybeStart(); });
    heroImg.addEventListener('error', () => { imgReady = true; maybeStart(); });
  }
})();

/* ═══════════════════════════════════════════════════════════
   META SECTION — growing bar + staggered text reveals
═══════════════════════════════════════════════════════════ */
(function () {
  const meta = document.querySelector('.ph-meta');
  if (!meta) return;

  const bar   = meta.querySelector('.ph-meta-bar');
  const items = Array.from(meta.querySelectorAll('.ph-meta-item'));
  const N     = items.length;
  const BAR_DUR = 2.2;
  const mobile  = () => window.innerWidth <= 900;

  /* hide all text initially */
  items.forEach(item => {
    gsap.set(item.querySelectorAll('.ph-meta-label .ph-pl'), { rotateX: -90, y: '110%' });
    gsap.set(item.querySelectorAll('.ph-meta-value .ph-pl'), { rotateX: -90, y: '110%' });
  });
  gsap.set(bar, mobile() ? { scaleY: 0 } : { scaleX: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: meta,
      start: 'top 75%',
    }
  });

  /* bar grows — linear so timing maps cleanly to column positions */
  tl.to(bar, mobile()
    ? { scaleY: 1, duration: BAR_DUR, ease: 'none' }
    : { scaleX: 1, duration: BAR_DUR, ease: 'none' }
  , 0);

  /* each item fires as bar tip reaches its column / row */
  items.forEach((item, i) => {
    const arrival = (BAR_DUR / N) * (i + 1) - 0.12;
    const labels  = item.querySelectorAll('.ph-meta-label .ph-pl');
    const values  = item.querySelectorAll('.ph-meta-value .ph-pl');

    /* sub heading first */
    tl.to(labels, { rotateX: 0, y: '0%', duration: 0.5, ease: 'power3.out' }, arrival);
    /* heading 0.2s after sub heading */
    tl.to(values, { rotateX: 0, y: '0%', duration: 0.5, ease: 'power3.out' }, arrival + 0.2);
  });
})();
