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
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    toggle.classList.remove('active');
    links.classList.remove('open');
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

  // ---- Bento grid hover tilt (desktop only) ----
  if (window.innerWidth > 768) {
    document.querySelectorAll('.bento-item').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.02)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

})();
