/**
 * CS-AI Agent — Motion Controller v2.0
 * Drives scroll-reveal (IntersectionObserver fallback) and demo sequences.
 * Loaded as a module via <script type="module" src="js/motion-controller.js">
 */

/* ─────────────────────────────────────────
   1. Header scroll state
   ───────────────────────────────────────── */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────────
   2. Scroll-entry reveal (IntersectionObserver)
   ───────────────────────────────────────── */
(function () {
  const targets = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────
   3. Auto-apply reveal-up to major sections
   (so HTML doesn't need class on every element)
   ───────────────────────────────────────── */
(function () {
  // Selectors that should animate in when they enter viewport
  const AUTO_REVEAL = [
    '.feature-card',
    '.feature-item',
    '.scenario-card',
    '.use-case-card',
    '.roadmap-item',
    '.voice-card',
    '.cl-entry',
    '.step-card',
    '.step-item',
    '.benefit-item',
    '.plan-card',
    '.ds-stat-chip',
  ];

  const elements = document.querySelectorAll(AUTO_REVEAL.join(', '));
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 70, 350)}ms`;
          entry.target.classList.add('reveal-up', 'is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  elements.forEach((el) => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('is-visible')) {
      el.classList.add('reveal-up');
      observer.observe(el);
    }
  });
})();

/* ─────────────────────────────────────────
   4. Glimmer class — add to glass cards
   ───────────────────────────────────────── */
(function () {
  document.querySelectorAll(
    '.feature-card, .feature-item, .voice-card, .roadmap-item, .plan-card'
  ).forEach((el) => el.classList.add('glimmer-card'));
})();

/* ─────────────────────────────────────────
   5. Demo: Confidence bar fill on viewport entry
   ───────────────────────────────────────── */
(function () {
  const fills = document.querySelectorAll('.demo-confidence-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-filled');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────
   6. Animated Gmail sidebar demo sequence
   Cycles through: email open → fetch → rule match → draft ready
   ───────────────────────────────────────── */
(function () {
  const demo = document.querySelector('[data-demo-sequence]');
  if (!demo) return;

  const steps = demo.querySelectorAll('[data-step]');
  if (steps.length < 2) return;

  let current = 0;
  let timer;

  const showStep = (idx) => {
    steps.forEach((s, i) => {
      s.classList.toggle('demo-step--active', i === idx);
      s.classList.remove('demo-step--exit');
    });
  };

  const advance = () => {
    const prev = current;
    current = (current + 1) % steps.length;
    steps[prev].classList.remove('demo-step--active');
    steps[prev].classList.add('demo-step--exit');
    setTimeout(() => steps[prev].classList.remove('demo-step--exit'), 500);
    showStep(current);
  };

  showStep(0);

  // Only start cycling when in viewport
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        timer = setInterval(advance, 3200);
      } else {
        clearInterval(timer);
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(demo);
})();

/* ─────────────────────────────────────────
   7. Animated number counter (count-up)
   ───────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || '';
    const prefix = el.dataset.countPrefix || '';
    const duration = parseInt(el.dataset.countDuration || '1400');
    const decimals = parseInt(el.dataset.countDecimals || '0');
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      el.classList.add('counting');
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));
})();
