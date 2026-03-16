/* =========================
   Header + Mobile Navigation
   ========================= */
(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.nav-overlay');
  const navLinks = nav ? nav.querySelectorAll('a') : [];

  const closeMenu = () => {
    if (!menuToggle || !nav || !overlay) return;
    menuToggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    overlay.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    if (!menuToggle || !nav || !overlay) return;
    menuToggle.classList.add('is-open');
    nav.classList.add('is-open');
    overlay.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  if (menuToggle && nav && overlay) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 981px)');
    const onDesktop = () => {
      if (desktopQuery.matches) {
        closeMenu();
      }
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', onDesktop);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(onDesktop);
    }
  }

  /* =========================
     Header Scroll State & Smart Hide/Show
     ========================= */
  let lastScrollY = window.scrollY;

  const updateHeader = () => {
    if (!header) return;
    const currentScrollY = window.scrollY;
    
    // Add is-scrolled class for shrinking/styling
    header.classList.toggle('is-scrolled', currentScrollY > 20);

    // Smart Hide/Show logic
    if (currentScrollY > 150) { // Only start hiding after some scroll
      if (currentScrollY > lastScrollY && !header.classList.contains('is-hidden')) {
        // Scrolling Down - Hide Header
        header.classList.add('is-hidden');
      } else if (currentScrollY < lastScrollY && header.classList.contains('is-hidden')) {
        // Scrolling Up - Show Header
        header.classList.remove('is-hidden');
      }
    } else {
      // Near Top - Always Show
      header.classList.remove('is-hidden');
    }

    lastScrollY = currentScrollY;
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* =========================
     Reveal On Scroll
     ========================= */
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observerRef) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observerRef.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.05
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* =========================
     Footer Year
     ========================= */
  const year = document.getElementById('currentYear');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
