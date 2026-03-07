// ============================================
// H Village Research — Apple-Cinematic Script
// ============================================
(function () {
  'use strict';

  // ---- Reveal on scroll ----
  const revealObs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  // ---- Animated counters ----
  const cObs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { countUp(e.target); cObs.unobserve(e.target); }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach((el) => cObs.observe(el));

  function countUp(el) {
    const end = +el.dataset.count;
    const dur = 1400;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * end);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // ---- Nav scroll ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ---- Mobile nav ----
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));

  // ---- Smooth anchor scroll ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' }); }
    });
  });

  // ---- Hero overlay fade on scroll ----
  const heroOverlay = document.querySelector('.hero-overlay');
  const hero = document.getElementById('hero');
  if (heroOverlay && hero) {
    window.addEventListener('scroll', () => {
      const r = Math.min(window.scrollY / hero.offsetHeight, 1);
      heroOverlay.style.opacity = 0.5 + r * 0.5;
    }, { passive: true });
  }

  // ---- Full-image scroll zoom ----
  document.querySelectorAll('.zoom-img').forEach((img) => {
    const parent = img.closest('.full-img');
    if (!parent) return;

    const onScroll = () => {
      const rect = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = 1 - (rect.top / vh);
        const scale = 1 + Math.max(0, Math.min(progress, 1)) * 0.12;
        img.style.transform = 'scale(' + scale + ')';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  // ---- Organic tap interaction — all living elements ----
  const organicTargets = document.querySelectorAll(
    '.bento-item, .glass-card, .feat-card, .quote-box, .paper-box, .member'
  );

  organicTargets.forEach((el) => {
    // Ensure position for ripple
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }

    // Desktop hover tilt for bento items
    if (window.innerWidth > 768 && el.classList.contains('bento-item')) {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.02)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    }

    // Tap / click — viscous organic splash
    function organicSplash(e) {
      const rect = el.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.8;

      // Create ripple
      const ripple = document.createElement('div');
      ripple.className = el.classList.contains('bento-item') ? 'cell-ripple' : 'organic-ripple';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (x - size / 2) + 'px';
      ripple.style.top = (y - size / 2) + 'px';
      el.appendChild(ripple);

      // Trigger animation
      const tapClass = el.classList.contains('bento-item') ? 'cell-tapped' : 'organic-tapped';
      el.classList.remove(tapClass);
      void el.offsetWidth;
      el.classList.add(tapClass);

      // Cleanup
      setTimeout(() => {
        ripple.remove();
        el.classList.remove(tapClass);
      }, 950);
    }

    el.addEventListener('click', organicSplash);
    el.addEventListener('touchstart', function(e) {
      organicSplash(e);
    }, { passive: true });
  });

})();
