/* ============================================
   ASHVA FINSERV — LOCATION LANDING PAGE JAVASCRIPT
   (Adajan / Dindoli / Vesu — pages without a lead form)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- ELEMENTS ---------- */
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const animatedElements = document.querySelectorAll('[data-animate]');
  const statNumbers = document.querySelectorAll('.stat-number');
  const currentYear = document.getElementById('currentYear');

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ---------- MOBILE NAV OVERLAY ---------- */
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  /* ---------- MOBILE MENU TOGGLE ---------- */
  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  navLinkItems.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- HEADER SCROLL EFFECT ---------- */
  function handleScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class for shadow
    header.classList.toggle('scrolled', scrollY > 50);

    // Back to top button visibility
    backToTop.classList.toggle('visible', scrollY > 600);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ---------- BACK TO TOP ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- SCROLL ANIMATIONS (Intersection Observer) ---------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  /* ---------- STAT COUNTER ANIMATION ---------- */
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;

    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1500;
      const start = performance.now();

      function updateCounter(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });

    statsAnimated = true;
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  }

  /* ---------- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- CLOSE MOBILE MENU ON ESCAPE ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  /* ---------- HANDLE RESIZE ---------- */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    }, 150);
  });
});
