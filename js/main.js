import { initNav } from './nav.js';
import { initAnimations } from './animations.js';
import { initMarquee } from './marquee.js';
import { initForm } from './form.js';

// ── Register GSAP plugins ──
gsap.registerPlugin(ScrollTrigger);

// ── Lenis smooth scroll ──
const lenis = new Lenis({
  duration: 1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.9,
});

// Sync Lenis with GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

// ── Anchor link smooth scroll via Lenis ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.4 });
    }
  });
});

// ── Init all modules ──
initNav();
initMarquee();
initAnimations();
initForm();

// Refresh ScrollTrigger after Lenis and images settle
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
