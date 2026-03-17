/* =========================
   Header + Mobile Navigation
   ========================= */
(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.nav-overlay');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  const brandLink = document.querySelector('.brand');

  // Smooth scroll to top when clicking the logo
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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
  const updateHeader = () => {
    if (!header) return;
    const currentScrollY = window.scrollY;
    
    // Add is-scrolled class for shrinking/styling
    header.classList.toggle('is-scrolled', currentScrollY > 20);
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

  /* ============================================================
     Soluções Carousel & Flip-Card Logic
     ============================================================ */
  const carouselTrack = document.querySelector('.solutions-track');
  const carouselCards = document.querySelectorAll('.solution-card');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  
  if (carouselTrack && carouselCards.length > 0) {
    let currentIndex = 0;
    const GAP = 24; // 1.5rem

    const getVisibleCount = () => {
      if (window.innerWidth > 1024) return 3;
      if (window.innerWidth > 768)  return 2;
      return 1;
    };

    const setCardWidths = () => {
      const wrapperW = carouselTrack.parentElement.clientWidth;
      const count   = getVisibleCount();
      const cardW   = (wrapperW - GAP * (count - 1)) / count;
      carouselCards.forEach(c => {
        c.style.width    = cardW + 'px';
        c.style.flexBasis = cardW + 'px';
      });
      return cardW;
    };

    const updateCarousel = () => {
      const cardW = setCardWidths();
      const moveDistance = (cardW + GAP) * currentIndex;
      carouselTrack.style.transform = `translateX(-${moveDistance}px)`;

      const maxIndex = Math.max(0, carouselCards.length - getVisibleCount());
      if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
      if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const maxIndex = Math.max(0, carouselCards.length - getVisibleCount());
        if (currentIndex < maxIndex) { currentIndex++; updateCarousel(); }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) { currentIndex--; updateCarousel(); }
      });
    }

    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateCarousel();
    });

    updateCarousel();
  }

  /* ============================================================
     Soluções Modal Highlight Logic
     ============================================================ */
  const solutionsModal = document.getElementById('solutionModal');
  const modalOpenBtns = document.querySelectorAll('.js-open-modal');
  const modalCloseBtns = document.querySelectorAll('.js-modal-close');
  
  if (solutionsModal) {
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalShortDesc = document.getElementById('modalShortDesc');
    const modalLongDesc = document.getElementById('modalLongDesc');

    const openModal = (card) => {
      // Get data from the card
      const imgElem = card.querySelector('.card-bg');
      const titleElem = card.querySelector('h3');
      const shortDescElem = card.querySelector('.card-content p');
      
      const imgSrc = imgElem ? imgElem.src : '';
      const title = titleElem ? titleElem.textContent : '';
      const shortDesc = shortDescElem ? shortDescElem.textContent : '';
      const longDesc = card.getAttribute('data-full-desc') || '';

      // Populate modal
      if (modalImg) modalImg.src = imgSrc;
      if (modalTitle) modalTitle.textContent = title;
      if (modalShortDesc) modalShortDesc.textContent = shortDesc;
      if (modalLongDesc) modalLongDesc.textContent = longDesc;

      // Show modal
      solutionsModal.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
      solutionsModal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    modalOpenBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = e.target.closest('.solution-card');
        if (card) openModal(card);
      });
    });

    modalCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && solutionsModal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }
})();
