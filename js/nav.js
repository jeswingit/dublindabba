export function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.nav__burger');
  const mobileNav = document.getElementById('navMobile');
  const mobileLinks = mobileNav.querySelectorAll('a');
  const navLinks = document.querySelectorAll('.nav__links a');

  // ── Scroll state ──
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Burger toggle ──
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ── Close mobile nav on link click ──
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // ── Active link tracking ──
  function setActiveLink(id) {
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === `#${id}`);
    });
  }

  // Use IntersectionObserver for active section tracking
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));

  // ── Radio label active state (visual) ──
  document.querySelectorAll('.form-radio-group').forEach(group => {
    const labels = group.querySelectorAll('.form-radio-label');
    labels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio && radio.checked) label.classList.add('checked');

      radio && radio.addEventListener('change', () => {
        labels.forEach(l => l.classList.remove('checked'));
        label.classList.add('checked');
      });

      label.addEventListener('click', () => {
        labels.forEach(l => l.classList.remove('checked'));
        label.classList.add('checked');
      });
    });
  });
}
