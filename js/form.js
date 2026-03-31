export function initForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  initMenuTabs();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      showSuccess();
    }
  });
}

// ─────────────────────────────────────────
// Validation
// ─────────────────────────────────────────
function validateForm() {
  let valid = true;

  const fields = [
    { id: 'name',    errorId: 'name-error',    check: v => v.trim().length >= 2 },
    { id: 'email',   errorId: 'email-error',   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    { id: 'phone',   errorId: 'phone-error',   check: v => v.trim().length >= 7 },
    { id: 'address', errorId: 'address-error', check: v => v.trim().length >= 5 },
  ];

  fields.forEach(({ id, errorId, check }) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    const ok = check(input.value);

    input.classList.toggle('error', !ok);
    error.classList.toggle('visible', !ok);

    if (!ok) valid = false;

    // Clear error on input
    input.addEventListener('input', () => {
      if (check(input.value)) {
        input.classList.remove('error');
        error.classList.remove('visible');
      }
    }, { once: false });
  });

  return valid;
}

// ─────────────────────────────────────────
// Success state
// ─────────────────────────────────────────
function showSuccess() {
  const form = document.getElementById('orderForm');
  const success = document.getElementById('formSuccess');

  // Animate fields out
  const fields = form.querySelectorAll('.form-row, .form-group, .form-submit-wrap');
  if (typeof gsap !== 'undefined') {
    gsap.to(fields, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        fields.forEach(f => { f.style.display = 'none'; });
        success.classList.add('visible');
        gsap.fromTo(success,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    });
  } else {
    fields.forEach(f => { f.style.display = 'none'; });
    success.classList.add('visible');
  }
}

// ─────────────────────────────────────────
// Menu Tabs
// ─────────────────────────────────────────
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      panels.forEach(panel => {
        const isActive = panel.id === `panel-${target}`;
        panel.classList.toggle('active', isActive);
      });

      // Animate new panel cards in
      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel && typeof gsap !== 'undefined') {
        const cards = activePanel.querySelectorAll('.meal-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
        );
      }
    });
  });
}
