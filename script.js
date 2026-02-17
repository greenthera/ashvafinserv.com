/* ============================================
   ASHVĀ FINSERV — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- ELEMENTS ---------- */
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const animatedElements = document.querySelectorAll('[data-animate]');
  const statNumbers = document.querySelectorAll('.stat-number');

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
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class for shadow
    header.classList.toggle('scrolled', scrollY > 50);

    // Back to top button visibility
    backToTop.classList.toggle('visible', scrollY > 600);

    lastScroll = scrollY;
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
        // Ease out cubic
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

  // Observe the hero stats section
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

  /* ---------- CONTACT FORM HANDLING ---------- */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = contactForm.querySelector('#name').value.trim();
    const phone = contactForm.querySelector('#phone').value.trim();
    const email = contactForm.querySelector('#email').value.trim();

    if (!name || !phone || !email) {
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // Show success message
    contactForm.classList.add('hidden');
    formSuccess.classList.remove('hidden');

    // Reset form after delay
    setTimeout(() => {
      contactForm.reset();
      contactForm.classList.remove('hidden');
      formSuccess.classList.add('hidden');
    }, 5000);
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
