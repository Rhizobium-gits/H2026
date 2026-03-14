// ============================================
// H Village Research — Apple-Cinematic Interaction Script
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

  // ---- Bento: tap splash + drag to tear ----
  document.querySelectorAll('.bento-item').forEach((card) => {
    // Desktop hover tilt
    if (window.innerWidth > 768) {
      card.addEventListener('mousemove', (e) => {
        if (card.classList.contains('dragging')) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.02)';
      });
      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('dragging')) card.style.transform = '';
      });
    }

    // Tap splash (bento only)
    function splash(e) {
      if (card.classList.contains('dragging')) return;
      const rect = card.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      const x = t.clientX - rect.left, y = t.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.6;
      const rip = document.createElement('div');
      rip.className = 'cell-ripple';
      rip.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(x-size/2)+'px;top:'+(y-size/2)+'px';
      card.appendChild(rip);
      card.classList.remove('cell-tapped');
      void card.offsetWidth;
      card.classList.add('cell-tapped');
      setTimeout(() => { rip.remove(); card.classList.remove('cell-tapped'); }, 850);
    }

    // Drag to tear
    let startX, startY, isDragging = false, dragThreshold = 40;

    function onStart(e) {
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX; startY = t.clientY;
      isDragging = false;
    }

    function onMove(e) {
      if (startX === undefined) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - startX, dy = t.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 15) {
        isDragging = true;
        card.classList.add('dragging');
        // Stretch toward drag direction
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const stretch = Math.min(dist / 3, 25);
        card.style.transform = 'translate(' + (dx * 0.3) + 'px,' + (dy * 0.3) + 'px) rotate(' + (angle * 0.02) + 'deg) scale(' + (1 + stretch * 0.003) + ',' + (1 - stretch * 0.002) + ')';
      }

      // Tear threshold
      if (dist > dragThreshold * 3 && !card.dataset.torn) {
        card.dataset.torn = '1';
        tearOff(card, dx, dy);
      }
    }

    function onEnd() {
      if (isDragging) {
        card.classList.remove('dragging');
        card.classList.add('snap-back');
        card.style.transform = '';
        setTimeout(() => card.classList.remove('snap-back'), 600);
      } else if (startX !== undefined) {
        splash({ clientX: startX, clientY: startY });
      }
      startX = startY = undefined;
      isDragging = false;
      delete card.dataset.torn;
    }

    function tearOff(el, dx, dy) {
      const rect = el.getBoundingClientRect();
      const ghost = document.createElement('div');
      ghost.className = 'tear-ghost';
      ghost.style.cssText =
        'left:' + rect.left + 'px;top:' + rect.top + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;' +
        'border-radius:' + getComputedStyle(el).borderRadius + ';';

      // Clone image inside
      const img = el.querySelector('img');
      if (img) {
        const c = img.cloneNode();
        c.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        ghost.appendChild(c);
      }

      document.body.appendChild(ghost);

      // Animate tear piece flying away
      requestAnimationFrame(() => {
        ghost.style.transform = 'translate(' + (dx * 1.5) + 'px,' + (dy * 1.5) + 'px) rotate(' + (dx * 0.15) + 'deg) scale(.6)';
        ghost.classList.add('fade');
      });

      setTimeout(() => ghost.remove(), 800);
    }

    card.addEventListener('mousedown', onStart);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseup', onEnd);
    card.addEventListener('mouseleave', () => { if (isDragging) onEnd(); });
    card.addEventListener('touchstart', onStart, { passive: true });
    card.addEventListener('touchmove', onMove, { passive: true });
    card.addEventListener('touchend', onEnd);
  });

  // ---- Tap jiggle on cards & text blocks ----
  document.querySelectorAll('.glass-card,.feat-card,.member,.quote-box,.paper-box,.col-text,.findings-hero,.img-reveal,.full-img-text,.sec-heading,.sec-sub,.num').forEach((el) => {
    el.addEventListener('click', () => {
      el.classList.remove('tap-jiggle');
      void el.offsetWidth;
      el.classList.add('tap-jiggle');
    });
    el.addEventListener('animationend', () => {
      el.classList.remove('tap-jiggle');
    });
  });

})();
