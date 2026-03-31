export function initAnimations() {
  // ── Hero Entry Timeline ──
  animateHero();
  initParallax();

  // ── Scroll-triggered reveals ──
  animateSectionTitles();
  revealCards('.features__grid .feature-card', 0.12);
  revealCards('.menu__grid .meal-card', 0.1);
  revealCards('.pricing__grid .price-card', 0.15);
  animateHowItWorks();
  animatePricingCounters();
  animateContactSection();
}

// ─────────────────────────────────────────
// Hero — plays on load
// ─────────────────────────────────────────
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero__tag',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.7 }
  )
  .fromTo('.hero__headline .line',
    { opacity: 0, y: 80, rotationX: -25, transformOrigin: 'top center' },
    { opacity: 1, y: 0, rotationX: 0, duration: 0.9, stagger: 0.14 },
    '-=0.35'
  )
  .fromTo('.hero__sub',
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.7 },
    '-=0.5'
  )
  .fromTo('.hero__ctas .btn',
    { opacity: 0, y: 20, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1 },
    '-=0.45'
  )
  .fromTo('.hero__trust',
    { opacity: 0 },
    { opacity: 1, duration: 0.5 },
    '-=0.3'
  )
  .fromTo('.floater',
    { opacity: 0, scale: 0, rotation: -15 },
    { opacity: 0.7, scale: 1, rotation: 0, duration: 1.6, stagger: 0.12, ease: 'elastic.out(1, 0.5)' },
    '-=1.2'
  );
}

// ─────────────────────────────────────────
// Mouse-move parallax on floating icons
// ─────────────────────────────────────────
function initParallax() {
  const floaters = document.querySelectorAll('.floater');
  if (!floaters.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    floaters.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || 1);
      gsap.to(el, {
        x: dx * speed * 28,
        y: dy * speed * 18,
        duration: 1.1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  });
}

// ─────────────────────────────────────────
// Section title word-split reveal
// ─────────────────────────────────────────
function animateSectionTitles() {
  document.querySelectorAll('.section-title').forEach(h2 => {
    // Skip if already processed
    if (h2.dataset.split) return;
    h2.dataset.split = '1';

    // Preserve gradient spans — split at space level around them
    const original = h2.innerHTML;
    // Split by spaces but preserve HTML tags
    const parts = [];
    let buffer = '';
    let depth = 0;
    for (let i = 0; i < original.length; i++) {
      const ch = original[i];
      if (ch === '<') { depth++; buffer += ch; }
      else if (ch === '>') { depth--; buffer += ch; }
      else if (ch === ' ' && depth === 0) {
        if (buffer) parts.push(buffer);
        buffer = '';
      } else {
        buffer += ch;
      }
    }
    if (buffer) parts.push(buffer);

    h2.innerHTML = parts
      .map(p => `<span class="word-wrap"><span class="word">${p}</span></span>`)
      .join(' ');

    gsap.fromTo(
      h2.querySelectorAll('.word'),
      { y: '105%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.7,
        stagger: 0.055,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: h2,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });
}

// ─────────────────────────────────────────
// Generic card reveal
// ─────────────────────────────────────────
function revealCards(selector, stagger = 0.12) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  gsap.fromTo(
    elements,
    { opacity: 0, y: 55, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.75,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elements[0].closest('section') || elements[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    }
  );
}

// ─────────────────────────────────────────
// How It Works
// ─────────────────────────────────────────
function animateHowItWorks() {
  const steps = document.querySelectorAll('.how__step');
  const connectors = document.querySelectorAll('.how__connector');
  if (!steps.length) return;

  gsap.fromTo(
    steps,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.22,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.how__steps',
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  gsap.fromTo(
    connectors,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: 0.7,
      stagger: 0.3,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.how__steps',
        start: 'top 72%',
        toggleActions: 'play none none reverse',
      }
    }
  );
}

// ─────────────────────────────────────────
// Pricing counter animation
// ─────────────────────────────────────────
function animatePricingCounters() {
  document.querySelectorAll('.price-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate() {
        el.textContent = Math.round(obj.val);
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      }
    });
  });
}

// ─────────────────────────────────────────
// Contact section fade in
// ─────────────────────────────────────────
function animateContactSection() {
  gsap.fromTo(
    '.contact__form-wrap',
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#order',
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  gsap.fromTo(
    '.contact__info',
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#order',
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      }
    }
  );
}
