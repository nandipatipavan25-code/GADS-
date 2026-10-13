/**
 * GA DIGITAL SOLUTIONS — VERSION 2 SCRIPT
 * Editorial Motion Design & Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveal();
  initFaqAccordion();
  initTestimonialsCarousel();
  initMobileDrawer();
  initEnquiryModal();
  initChartBarAnimations();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL SHADOW
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('site-nav');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .stagger-reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.02,
    rootMargin: '150px 0px 150px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. FAQ ACCORDION INTERACTION
   ========================================================================== */
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card-v2');
  if (!faqCards.length) return;

  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-card-v2-btn');
    const panel = card.querySelector('.faq-card-v2-panel');

    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      // Close all other open cards
      faqCards.forEach(c => {
        if (c !== card && c.classList.contains('open')) {
          c.classList.remove('open');
          const otherBtn = c.querySelector('.faq-card-v2-btn');
          const otherPanel = c.querySelector('.faq-card-v2-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      // Toggle current card
      if (isOpen) {
        card.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        card.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   4. TESTIMONIALS CAROUSEL
   ========================================================================== */
function initTestimonialsCarousel() {
  const track = document.getElementById('t-track');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  const dotsContainer = document.getElementById('t-dots');
  const cards = document.querySelectorAll('.t-card-v2');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

  function updateCarousel(index) {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = cards.length - 1;
    if (currentIndex >= cards.length) currentIndex = 0;

    // Update dots
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // In desktop 4-column view, highlight the selected card
    cards.forEach((card, idx) => {
      if (window.innerWidth > 991) {
        if (idx === currentIndex) {
          card.style.borderColor = 'var(--color-primary)';
          card.style.transform = 'translateY(-6px)';
        } else {
          card.style.borderColor = '#e2e8f0';
          card.style.transform = 'none';
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index') || '0', 10);
      updateCarousel(idx);
    });
  });
}

/* ==========================================================================
   5. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('mobile-close');
  const drawer = document.getElementById('mobile-drawer');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  const links = drawer.querySelectorAll('.mobile-nav-link');
  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   6. QUICK ENQUIRY MODAL
   ========================================================================== */
function initEnquiryModal() {
  const openBtn = document.getElementById('open-enquiry-btn');
  const closeBtn = document.getElementById('close-enquiry-btn');
  const modal = document.getElementById('enquiry-modal');
  const form = document.getElementById('enquiry-form');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Enquiry Sent Successfully ✓</span>';
        submitBtn.style.background = '#10b981';
      }
      setTimeout(() => {
        closeModal();
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = `<span>Submit Enquiry</span>
            <span class="arrow-circle">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>`;
          submitBtn.style.background = '';
        }
      }, 1600);
    });
  }

  // Floating Chatbot Button
  const chatbotBtn = document.getElementById('chatbot-btn');
  if (chatbotBtn) {
    chatbotBtn.addEventListener('click', () => {
      openModal();
    });
  }
}

/* ==========================================================================
   7. DYNAMIC CHART BAR ANIMATION
   ========================================================================== */
function initChartBarAnimations() {
  const bars = document.querySelectorAll('.cbar');
  if (!bars.length) return;

  bars.forEach((bar, idx) => {
    bar.style.animationDelay = `${0.3 + idx * 0.08}s`;
  });
}
