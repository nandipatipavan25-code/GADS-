/**
 * GA Digital Solutions — Homepage Application Logic (Light Theme)
 * Initializes the Framer 3D Spatial Gallery WebGL Engine and interactive behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Initialize Framer 3D Spatial Gallery Component
  const galleryContainer = document.getElementById('hero-spatial-gallery');

  if (galleryContainer && typeof window.initSpatialGallery === 'function') {
    // 1. 36 authentic GA Digital Solutions portfolio images from "Home page hero section images"
    const heroImageFiles = [
      { file: 'imgi_92_LIC Kartheek.jpg', alt: 'LIC Kartheek' },
      { file: 'imgi_93_Sri French Academy.jpg', alt: 'Sri French Academy' },
      { file: 'imgi_95_Workforce Consultants.jpg', alt: 'Workforce Consultants' },
      { file: 'imgi_96_Kangen Water.jpg', alt: 'Kangen Water' },
      { file: 'imgi_97_Radha Homes.jpg', alt: 'Radha Homes' },
      { file: 'imgi_98_Sreekanth & Co.jpg', alt: 'Sreekanth & Co' },
      { file: 'imgi_99_Surakshaa Builders.jpg', alt: 'Surakshaa Builders' },
      { file: 'imgi_100_Tooth Matters.jpg', alt: 'Tooth Matters' },
      { file: 'imgi_101_PoweRail.jpg', alt: 'PoweRail' },
      { file: 'imgi_102_Our Place.jpg', alt: 'Our Place' },
      { file: 'imgi_103_GA Consulting.jpg', alt: 'GA Consulting' },
      { file: 'imgi_104_RB Info Solutions.jpg', alt: 'RB Info Solutions' },
      { file: 'imgi_105_KY Pro.jpg', alt: 'KY Pro' },
      { file: 'imgi_106_Creative Energy Solutions.jpg', alt: 'Creative Energy Solutions' },
      { file: 'imgi_107_G.A Prapoties.jpg', alt: 'G.A Properties' },
      { file: 'imgi_108_Brain to Spine.jpg', alt: 'Brain to Spine' },
      { file: 'imgi_109_Ravi Hospitals.jpg', alt: 'Ravi Hospitals' },
      { file: 'imgi_110_Dr. Naveen Reddy.jpg', alt: 'Dr. Naveen Reddy' },
      { file: 'imgi_111_Vishwadharini Developers.jpg', alt: 'Vishwadharini Developers' },
      { file: 'imgi_112_Hyderabad Cosmetic Surgery.jpg', alt: 'Hyderabad Cosmetic Surgery' },
      { file: 'imgi_113_B.S.R Hospital.jpg', alt: 'B.S.R Hospital' },
      { file: 'imgi_114_JDP & Co.jpg', alt: 'JDP & Co' },
      { file: 'imgi_115_Mockup -Dharani Solar.jpg', alt: 'Dharani Solar' },
      { file: 'imgi_116_Kakatiya Media House.jpg', alt: 'Kakatiya Media House' },
      { file: 'imgi_117_Rootz Hair.jpg', alt: 'Rootz Hair' },
      { file: 'imgi_118_Anantha USA.jpg', alt: 'Anantha USA' },
      { file: 'imgi_119_Budding Leaf Infratech Pvt Ltd.jpg', alt: 'Budding Leaf Infratech Pvt Ltd' },
      { file: 'imgi_120_Dr. Lata Prasad.jpg', alt: 'Dr. Lata Prasad' },
      { file: 'imgi_121_Swift Digitals.jpg', alt: 'Swift Digitals' },
      { file: 'imgi_122_Way 2 Wash.jpg', alt: 'Way 2 Wash' },
      { file: 'imgi_123_Mockup -Darzee.jpg', alt: 'Darzee' },
      { file: 'imgi_124_Dr. Gowd Dental Hospitals.jpg', alt: 'Dr. Gowd Dental Hospitals' },
      { file: 'imgi_125_Hanuman Enterprises.jpg', alt: 'Hanuman Enterprises' },
      { file: 'imgi_126_Sleepzzz Mattress PVT LTD copy.jpg', alt: 'Sleepzzz Mattress Pvt Ltd' },
      { file: 'imgi_127_Duro Soft Mattress copy.jpg', alt: 'Duro Soft Mattress' },
      { file: 'imgi_128_Himalaya.webp', alt: 'Himalaya' }
    ];

    // 2. 16 authentic website builds from https://gadigitalsolutions.com/portfolio
    const websitePortfolioItems = [
      { url: 'port_padmaja.jpg', poster: 'port_padmaja.jpg', alt: 'Padmaja Foods', link: '#projects' },
      { url: 'port_susadhyaa.jpg', poster: 'port_susadhyaa.jpg', alt: 'Susaadhya Greens', link: '#projects' },
      { url: 'port_delicious.jpg', poster: 'port_delicious.jpg', alt: 'Delicious', link: '#projects' },
      { url: 'port_kigo_dental.jpg', poster: 'port_kigo_dental.jpg', alt: 'Kigo Dental', link: '#projects' },
      { url: 'port_baking_studio.jpg', poster: 'port_baking_studio.jpg', alt: 'Baking Studio', link: '#projects' },
      { url: 'port_amazon_vanlines.jpg', poster: 'port_amazon_vanlines.jpg', alt: 'Amazon Van Lines', link: '#projects' },
      { url: 'port_bohemian_soul.jpg', poster: 'port_bohemian_soul.jpg', alt: 'Bohemian Soul', link: '#projects' },
      { url: 'port_gsm.webp', poster: 'port_gsm.webp', alt: 'GSM Global', link: '#projects' },
      { url: 'port_palod_loya.jpg', poster: 'port_palod_loya.jpg', alt: 'Palod & Loya', link: '#projects' },
      { url: 'port_cpvia.webp', poster: 'port_cpvia.webp', alt: 'CPVIA', link: '#projects' },
      { url: 'port_aoda.webp', poster: 'port_aoda.webp', alt: 'Aoda', link: '#projects' },
      { url: 'port_sci_hex.webp', poster: 'port_sci_hex.webp', alt: 'Sci Hex', link: '#projects' },
      { url: 'port_zip_pouch.webp', poster: 'port_zip_pouch.webp', alt: 'Zip Pouch', link: '#projects' },
      { url: 'port_panjwani_foods.jpg', poster: 'port_panjwani_foods.jpg', alt: 'Panjwani Foods', link: '#projects' },
      { url: 'port_surakshaa_infra.jpg', poster: 'port_surakshaa_infra.jpg', alt: 'Surakshaa Infra', link: '#projects' },
      { url: 'port_clear_skin_clinic.jpg', poster: 'port_clear_skin_clinic.jpg', alt: 'Clear Skin Clinic', link: '#projects' }
    ];

    // 3. 50 authentic Brand Identity & Logo Design builds from "Logo Design _ Brand Identities"
    const brandIdentityFiles = [
      { file: 'imgi_10_Rectangle 5.jpg', alt: 'Brand Identity Design' },
      { file: 'imgi_11_Frame 70.png', alt: 'Visual Identity' },
      { file: 'imgi_12_Frame 73.png', alt: 'Logo Design' },
      { file: 'imgi_13_Frame 73.jpg', alt: 'Identity System' },
      { file: 'imgi_14_Frame 71.jpg', alt: 'Corporate Identity' },
      { file: 'imgi_15_Frame 74.jpg', alt: 'Brand Mark' },
      { file: 'imgi_16_1 (3).jpg', alt: 'Creative Branding' },
      { file: 'imgi_17_Frame 73-royce.jpg', alt: 'Royce Brand Identity' },
      { file: 'imgi_18_Frame 70-ogl.jpg', alt: 'OGL Brand Identity' },
      { file: 'imgi_19_Frame 69.jpg', alt: 'Identity Showcase' },
      { file: 'imgi_20_1 (4).jpg', alt: 'Brand System' },
      { file: 'imgi_21_1 (2).jpg', alt: 'Visual Mark' },
      { file: 'imgi_22_Rectangle 5-ga-digital.png', alt: 'GA Digital Solutions Brand' },
      { file: 'imgi_23_Rectangle 6-verve.png', alt: 'Verve Identity' },
      { file: 'imgi_24_Frame 73-bots.png', alt: 'Bots Identity' },
      { file: 'imgi_25_Rectangle 7-jai.png', alt: 'Jai Identity' },
      { file: 'imgi_26_Frame 71-sips.png', alt: 'SIPS Identity' },
      { file: 'imgi_27_Frame 74-bcs.png', alt: 'BCS Brand Mark' },
      { file: 'imgi_28_Frame 73-medstar.jpg', alt: 'Medstar Identity' },
      { file: 'imgi_29_Rectangle 7-ourplace.png', alt: 'Our Place Identity' },
      { file: 'imgi_30_Frame 70-unnadam.jpg', alt: 'Unnadam Brand' },
      { file: 'imgi_31_Rectangle 5-workforce.png', alt: 'Workforce Consultants' },
      { file: 'imgi_32_Frame 74-artha.jpg', alt: 'Artha Brand' },
      { file: 'imgi_33_Frame 71-lifeline.jpg', alt: 'Lifeline Brand' },
      { file: 'imgi_34_Rectangle 5-aicloud.png', alt: 'AI Cloud Brand' },
      { file: 'imgi_35_Frame 70-bkund.png', alt: 'BKund Identity' },
      { file: 'imgi_36_Frame 73-srikaraaya.png', alt: 'Srikaraaya Identity' },
      { file: 'imgi_37_Frame 73-suvidha.png', alt: 'Suvidha Brand' },
      { file: 'imgi_38_Frame 71-newconnex.png', alt: 'New Connex Identity' },
      { file: 'imgi_39_Frame 74-ky.png', alt: 'KY Identity' },
      { file: 'imgi_40_Frame 73-psns.jpg', alt: 'PSNS Identity' },
      { file: 'imgi_41_Frame 73-sips.jpg', alt: 'SIPS Brand' },
      { file: 'imgi_42_Frame 70-slns.jpg', alt: 'SLNS Identity' },
      { file: 'imgi_43_Rectangle 5-bsr.png', alt: 'BSR Identity' },
      { file: 'imgi_44_Frame 74-sips.jpg', alt: 'SIPS Design' },
      { file: 'imgi_45_Frame 71-nirvana.jpg', alt: 'Nirvana Brand' },
      { file: 'imgi_46_Frame 69-jdp.png', alt: 'JDP & Co Identity' },
      { file: 'imgi_47_Rectangle 6-br.png', alt: 'BR Brand' },
      { file: 'imgi_48_Rectangle 7-lms.png', alt: 'LMS Identity' },
      { file: 'imgi_49_Frame 73-field.png', alt: 'Field Identity' },
      { file: 'imgi_50_Frame 71-crave.png', alt: 'Crave Brand' },
      { file: 'imgi_51_Frame 74-dr.rajeshreddy.png', alt: 'Dr. Rajesh Reddy Brand' },
      { file: 'imgi_52_Frame 73-palod&loya.jpg', alt: 'Palod & Loya Brand' },
      { file: 'imgi_53_Frame 73-gradarena.jpg', alt: 'Gradarena Brand' },
      { file: 'imgi_54_Frame 70-grid.jpg', alt: 'Grid Identity' },
      { file: 'imgi_55_Frame 69-ga-orgsync.jpg', alt: 'GA OrgSync' },
      { file: 'imgi_56_Frame 74-ga-hiresync.jpg', alt: 'GA HireSync' },
      { file: 'imgi_57_Frame 71-krm.jpg', alt: 'KRM Brand' },
      { file: 'imgi_58_Scihex-logo-mockup.webp', alt: 'Scihex Logo Mockup' },
      { file: 'imgi_59_GSM_logo.webp', alt: 'GSM Logo' }
    ];

    const heroFolderItems = heroImageFiles.map(({ file, alt }) => {
      const encodedPath = `Home%20page%20hero%20section%20images/${encodeURIComponent(file)}`;
      return {
        url: encodedPath,
        poster: encodedPath,
        alt,
        link: '#projects'
      };
    });

    const brandFolderItems = brandIdentityFiles.map(({ file, alt }) => {
      const encodedPath = `Logo%20Design%20_%20Brand%20Identities/${encodeURIComponent(file)}`;
      return {
        url: encodedPath,
        poster: encodedPath,
        alt,
        link: '#projects'
      };
    });

    // Interleave all 102 authentic GA Digital Solutions portfolio & brand assets for high spatial variety
    const galleryItems = [];
    const maxLen = Math.max(heroFolderItems.length, brandFolderItems.length, websitePortfolioItems.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < heroFolderItems.length) galleryItems.push(heroFolderItems[i]);
      if (i < brandFolderItems.length) galleryItems.push(brandFolderItems[i]);
      if (i < websitePortfolioItems.length) galleryItems.push(websitePortfolioItems[i]);
    }

    const vw = window.innerWidth || 1440;
    const isMobile = vw < 768;
    const isTablet = vw >= 768 && vw <= 1024;

    const gallery = window.initSpatialGallery(galleryContainer, {
      items: galleryItems,
      background: 'transparent',
      objectWidth: isMobile ? 3.6 : isTablet ? 4.2 : 4.8,
      objectHeight: isMobile ? 2.5 : isTablet ? 3.0 : 3.4,
      objectFit: 'contain',
      radius: 0.16,
      facing: 'funnel',
      funnelAmount: 0.95,
      /* Significantly decluttered particle count: clean, airy, premium look */
      particleCount: isMobile ? 42 : isTablet ? 65 : 85,
      /* Wider hollow center: keeps the hero headline & text crystal-clear and spacious */
      hollowCenter: isMobile ? 2.2 : isTablet ? 2.6 : 3.0,
      spread: isMobile ? 3.2 : isTablet ? 3.6 : 4.0,
      verticalSquash: 0.94,
      scrollCapture: false,
      scrollSpeed: 1.8,
      dragToMove: true,
      depthRange: isMobile ? 60 : isTablet ? 68 : 74,
      spiralMotion: false,
      spiralTurns: 2,
      spiralRadius: 3.9,
      autoMotion: true,
      /* Faster & fluid speed: snappy and dynamic drift without lagging */
      autoSpeed: 1.75,
      autoDirection: 'forward',
      mouseInteraction: true,
      mouseSensitivity: 0.65,
      linkTarget: 'same',
      reducedMotion: true
    });
  }

  // 2. Navigation Scroll State
  const siteNav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. FAQ Accordion Interaction (People Also Ask)
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        // Close others
        faqCards.forEach(c => c.classList.remove('open'));
        if (!isOpen) {
          card.classList.add('open');
        }
      });
    }
  });

  // 4. Smooth Anchor Scrolling & Active Nav Link Scrollspy
  const allNavLinks = document.querySelectorAll('.nav-links .nav-link');
  const sectionsToWatch = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 130;
    let currentId = '';

    sectionsToWatch.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      allNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  // Initial check
  setTimeout(updateActiveNavLink, 200);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = siteNav ? siteNav.offsetHeight : 0;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight + 10);
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navList = document.querySelector('.nav-links');
        if (navList && window.innerWidth <= 768 && navList.style.display === 'flex') {
          navList.style.display = 'none';
        }
      }
    });
  });

  // 5. Horizontal Auto-Scrolling Projects Track (Infinite Seamless Loop + Controls)
  const projectTrack = document.getElementById('projects-track');
  const btnPrev = document.getElementById('proj-prev');
  const btnNext = document.getElementById('proj-next');
  const progressBar = document.getElementById('projects-progress-bar');

  if (projectTrack) {
    // Clone original cards once for seamless infinite horizontal auto-scrolling
    const originalCards = Array.from(projectTrack.querySelectorAll('.project-slide-card'));
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('project-slide-clone');
      projectTrack.appendChild(clone);
    });

    let virtualScroll = projectTrack.scrollLeft || 0;
    const baseSpeed = 1.15; // Smooth ~70px/sec horizontal auto-scroll at 60fps
    let currentSpeed = baseSpeed;
    let isHovered = false;
    let isDown = false;
    let isManualAnimating = false;
    let startX = 0;
    let dragStartScroll = 0;

    const getSingleSetWidth = () => {
      if (originalCards.length === 0) return projectTrack.scrollWidth / 2;
      const firstClone = projectTrack.querySelector('.project-slide-clone');
      if (firstClone) {
        return firstClone.offsetLeft - originalCards[0].offsetLeft;
      }
      return projectTrack.scrollWidth / 2;
    };

    const runnerAvatar = document.getElementById('runner-avatar-entity');
    const runnerBadgeText = document.getElementById('runner-badge-text');

    const updateProgress = () => {
      const setWidth = getSingleSetWidth();
      if (setWidth > 0) {
        const normalized = ((virtualScroll % setWidth) + setWidth) % setWidth;
        const rawRatio = normalized / setWidth;
        const pct = Math.min(100, Math.max(6, rawRatio * 100));

        if (progressBar) {
          progressBar.style.width = `${pct}%`;
        }

        if (runnerAvatar) {
          runnerAvatar.style.left = `${pct}%`;

          // Toggle running animation state based on movement
          if (isHovered && Math.abs(currentSpeed) < 0.1 && !isDown && !isManualAnimating) {
            runnerAvatar.classList.remove('is-running');
          } else {
            runnerAvatar.classList.add('is-running');
          }
        }

        if (runnerBadgeText) {
          const totalProjects = originalCards.length || 12;
          const currentIdx = Math.min(totalProjects, Math.max(1, Math.floor(rawRatio * totalProjects) + 1));
          runnerBadgeText.textContent = `${String(currentIdx).padStart(2, '0')} / ${String(totalProjects).padStart(2, '0')}`;
        }
      }
    };

    // Smooth manual step animation for Prev / Next arrow buttons
    const animateStepBy = (delta) => {
      const setWidth = getSingleSetWidth();
      if (setWidth <= 0) return;
      isManualAnimating = true;
      const startVal = virtualScroll;
      const duration = 460;
      const startTime = performance.now();

      const stepFrame = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        // Cubic ease-out
        const ease = 1 - Math.pow(1 - t, 3);
        let nextScroll = startVal + delta * ease;

        if (nextScroll >= setWidth) nextScroll -= setWidth;
        if (nextScroll < 0) nextScroll += setWidth;

        virtualScroll = nextScroll;
        projectTrack.scrollLeft = virtualScroll;
        updateProgress();

        if (t < 1) {
          requestAnimationFrame(stepFrame);
        } else {
          isManualAnimating = false;
        }
      };

      requestAnimationFrame(stepFrame);
    };

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        animateStepBy(-492);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        animateStepBy(492);
      });
    }

    // Continuous 60fps Horizontal Auto-Scroll Loop
    const autoScrollTick = () => {
      if (!isDown && !isManualAnimating) {
        const targetSpeed = isHovered ? 0 : baseSpeed;
        currentSpeed += (targetSpeed - currentSpeed) * 0.08;

        if (Math.abs(currentSpeed) > 0.01) {
          const setWidth = getSingleSetWidth();
          virtualScroll += currentSpeed;
          if (setWidth > 0 && virtualScroll >= setWidth) {
            virtualScroll -= setWidth;
          }
          projectTrack.scrollLeft = virtualScroll;
          updateProgress();
        }
      }
      requestAnimationFrame(autoScrollTick);
    };

    requestAnimationFrame(autoScrollTick);

    // Pause on hover over track or nav arrows
    projectTrack.addEventListener('mouseenter', () => { isHovered = true; });
    projectTrack.addEventListener('mouseleave', () => { isHovered = false; });
    if (btnPrev) {
      btnPrev.addEventListener('mouseenter', () => { isHovered = true; });
      btnPrev.addEventListener('mouseleave', () => { isHovered = false; });
    }
    if (btnNext) {
      btnNext.addEventListener('mouseenter', () => { isHovered = true; });
      btnNext.addEventListener('mouseleave', () => { isHovered = false; });
    }

    // Drag-to-scroll interaction with seamless loop wrapping
    projectTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      projectTrack.classList.add('dragging');
      startX = e.pageX - projectTrack.offsetLeft;
      dragStartScroll = virtualScroll;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        projectTrack.classList.remove('dragging');
      }
    });

    projectTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - projectTrack.offsetLeft;
      const walk = (x - startX) * 1.4;
      const setWidth = getSingleSetWidth();
      let nextScroll = dragStartScroll - walk;
      if (setWidth > 0) {
        nextScroll = ((nextScroll % setWidth) + setWidth) % setWidth;
      }
      virtualScroll = nextScroll;
      projectTrack.scrollLeft = virtualScroll;
      updateProgress();
    });

    // Touch support
    projectTrack.addEventListener('touchstart', () => {
      isHovered = true;
      virtualScroll = projectTrack.scrollLeft;
    }, { passive: true });

    projectTrack.addEventListener('touchend', () => {
      virtualScroll = projectTrack.scrollLeft;
      setTimeout(() => { isHovered = false; }, 1200);
    }, { passive: true });
  }

  // 5b. Horizontal Auto-Scrolling Reviews Track (Seamless Infinite Loop + Controls)
  const reviewsTrack = document.getElementById('reviews-track');
  const revBtnPrev = document.getElementById('reviews-prev');
  const revBtnNext = document.getElementById('reviews-next');

  if (reviewsTrack) {
    // Clone cards twice so the track is always wider than any viewport for endless auto-scroll
    const originalReviewCards = Array.from(reviewsTrack.querySelectorAll('.google-review-card'));
    for (let c = 0; c < 2; c++) {
      originalReviewCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.classList.add('review-card-clone');
        reviewsTrack.appendChild(clone);
      });
    }

    let revVirtualScroll = reviewsTrack.scrollLeft || 0;
    const revBaseSpeed = 1.15; // Crisp ~70px/sec continuous auto-scroll
    let revCurrentSpeed = revBaseSpeed;
    let revIsHovered = false;
    let revIsDown = false;
    let revIsManualAnimating = false;
    let revStartX = 0;
    let revDragStartScroll = 0;

    const getReviewsSetWidth = () => {
      if (originalReviewCards.length === 0) return reviewsTrack.scrollWidth / 2;
      const firstClone = reviewsTrack.querySelector('.review-card-clone');
      if (firstClone) {
        return firstClone.offsetLeft - originalReviewCards[0].offsetLeft;
      }
      return reviewsTrack.scrollWidth / 2;
    };

    const animateReviewsStep = (delta) => {
      const setWidth = getReviewsSetWidth();
      if (setWidth <= 0) return;
      revIsManualAnimating = true;
      const startVal = revVirtualScroll;
      const duration = 440;
      const startTime = performance.now();

      const stepFrame = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        let nextScroll = startVal + delta * ease;

        if (nextScroll >= setWidth) nextScroll -= setWidth;
        if (nextScroll < 0) nextScroll += setWidth;

        revVirtualScroll = nextScroll;
        reviewsTrack.scrollLeft = revVirtualScroll;

        if (t < 1) {
          requestAnimationFrame(stepFrame);
        } else {
          revIsManualAnimating = false;
        }
      };

      requestAnimationFrame(stepFrame);
    };

    if (revBtnPrev) {
      revBtnPrev.addEventListener('click', () => {
        animateReviewsStep(-364);
      });
    }

    if (revBtnNext) {
      revBtnNext.addEventListener('click', () => {
        animateReviewsStep(364);
      });
    }

    // 60fps continuous horizontal auto-scroll loop
    const revAutoScrollTick = () => {
      if (!revIsDown && !revIsManualAnimating) {
        const targetSpeed = revIsHovered ? 0 : revBaseSpeed;
        revCurrentSpeed += (targetSpeed - revCurrentSpeed) * 0.08;

        if (Math.abs(revCurrentSpeed) > 0.01) {
          const setWidth = getReviewsSetWidth();
          revVirtualScroll += revCurrentSpeed;
          if (setWidth > 0 && revVirtualScroll >= setWidth) {
            revVirtualScroll -= setWidth;
          }
          reviewsTrack.scrollLeft = revVirtualScroll;
        }
      }
      requestAnimationFrame(revAutoScrollTick);
    };

    requestAnimationFrame(revAutoScrollTick);

    // Hover pauses auto-scroll
    reviewsTrack.addEventListener('mouseenter', () => { revIsHovered = true; });
    reviewsTrack.addEventListener('mouseleave', () => { revIsHovered = false; });
    if (revBtnPrev) {
      revBtnPrev.addEventListener('mouseenter', () => { revIsHovered = true; });
      revBtnPrev.addEventListener('mouseleave', () => { revIsHovered = false; });
    }
    if (revBtnNext) {
      revBtnNext.addEventListener('mouseenter', () => { revIsHovered = true; });
      revBtnNext.addEventListener('mouseleave', () => { revIsHovered = false; });
    }

    // Drag to scroll
    reviewsTrack.addEventListener('mousedown', (e) => {
      revIsDown = true;
      reviewsTrack.classList.add('dragging');
      revStartX = e.pageX - reviewsTrack.offsetLeft;
      revDragStartScroll = revVirtualScroll;
    });

    window.addEventListener('mouseup', () => {
      if (revIsDown) {
        revIsDown = false;
        reviewsTrack.classList.remove('dragging');
      }
    });

    reviewsTrack.addEventListener('mousemove', (e) => {
      if (!revIsDown) return;
      e.preventDefault();
      const x = e.pageX - reviewsTrack.offsetLeft;
      const walk = (x - revStartX) * 1.35;
      const setWidth = getReviewsSetWidth();
      let nextScroll = revDragStartScroll - walk;
      if (setWidth > 0) {
        nextScroll = ((nextScroll % setWidth) + setWidth) % setWidth;
      }
      revVirtualScroll = nextScroll;
      reviewsTrack.scrollLeft = revVirtualScroll;
    });

    // Touch support
    reviewsTrack.addEventListener('touchstart', () => {
      revIsHovered = true;
      revVirtualScroll = reviewsTrack.scrollLeft;
    }, { passive: true });

    reviewsTrack.addEventListener('touchend', () => {
      revVirtualScroll = reviewsTrack.scrollLeft;
      setTimeout(() => { revIsHovered = false; }, 1200);
    }, { passive: true });
  }

  // 6. Mobile Menu Toggle (Light Theme)
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      if (isOpen) {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
        navLinks.style.padding = '24px';
        navLinks.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
        navLinks.style.borderBottom = '1px solid #e2e8f0';
      }
    });
  }

  // 7. Text Typing Animation (Full Hero Typewriter Entrance + Continuous Phrase Cycling)
  const typingEl = document.getElementById('typing-text');
  const prefixEl = document.getElementById('typing-prefix');
  const prefixCursor = document.getElementById('prefix-cursor');
  const mainCursor = document.getElementById('main-typing-cursor');

  if (typingEl) {
    const fullPrefix = prefixEl ? prefixEl.textContent.trim() : 'We build digital experiences that';
    const phrases = [
      'move businesses forward.',
      'generate qualified leads.',
      'accelerate digital sales.',
      'engineer high-ROI websites.',
      'turn visitors into clients.'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function startPhraseLoop() {
      if (prefixCursor) prefixCursor.style.display = 'none';
      if (mainCursor) mainCursor.style.display = 'inline-block';

      function typeLoop() {
        const currentPhrase = phrases[phraseIdx];
        let typingSpeed = 62;

        if (isDeleting) {
          charIdx = Math.max(0, charIdx - 1);
          typingEl.textContent = currentPhrase.substring(0, charIdx);
          typingSpeed = 32;
        } else {
          charIdx = Math.min(currentPhrase.length, charIdx + 1);
          typingEl.textContent = currentPhrase.substring(0, charIdx);
          typingSpeed = 58;
        }

        if (!isDeleting && charIdx >= currentPhrase.length) {
          // Pause at the end of the completed phrase before backspacing
          typingSpeed = 1900;
          isDeleting = true;
        } else if (isDeleting && charIdx <= 0) {
          // Move to next phrase and start typing
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          typingSpeed = 360;
        }

        setTimeout(typeLoop, typingSpeed);
      }

      typeLoop();
    }

    // Type out "We build digital experiences that" first on load, then type the blue highlight phrase
    if (prefixEl) {
      prefixEl.textContent = '';
      typingEl.textContent = '';
      if (prefixCursor) prefixCursor.style.display = 'inline-block';
      if (mainCursor) mainCursor.style.display = 'none';

      let prefixIdx = 0;
      function typePrefix() {
        prefixIdx++;
        prefixEl.textContent = fullPrefix.substring(0, prefixIdx);
        if (prefixIdx < fullPrefix.length) {
          setTimeout(typePrefix, 32);
        } else {
          setTimeout(startPhraseLoop, 180);
        }
      }
      setTimeout(typePrefix, 240);
    } else {
      typingEl.textContent = '';
      startPhraseLoop();
    }
  }

  // 8. Custom Animated Section Title & Kinetic Kicker System
  const kickerElements = document.querySelectorAll('.editorial-kicker');
  kickerElements.forEach((kicker, idx) => {
    if (kicker.querySelector('.kicker-radar-dot')) return;
    const num = String(idx + 1).padStart(2, '0');

    // Pulse Radar Dot
    const radar = document.createElement('span');
    radar.className = 'kicker-radar-dot';
    radar.innerHTML = '<span class="kicker-radar-core"></span><span class="kicker-radar-ring"></span>';

    // Index Pill
    const pill = document.createElement('span');
    pill.className = 'kicker-index-pill';
    pill.textContent = num;

    kicker.insertBefore(pill, kicker.firstChild);
    kicker.insertBefore(radar, kicker.firstChild);
  });

  const watermarkList = ['AGENCY', 'SOLUTIONS', 'PORTFOLIO', 'SECTORS', 'INSIGHTS', 'REVIEWS', 'CONNECT'];
  const splitHeadings = document.querySelectorAll('[data-split-text]');

  splitHeadings.forEach((heading, hIdx) => {
    // Inject Ghost Stroke Watermark if not already present
    const watermarkText = heading.getAttribute('data-watermark') || watermarkList[hIdx % watermarkList.length];
    const parentContainer = heading.parentElement;
    if (parentContainer && !parentContainer.querySelector('.title-ghost-watermark')) {
      const watermarkEl = document.createElement('span');
      watermarkEl.className = 'title-ghost-watermark';
      watermarkEl.setAttribute('aria-hidden', 'true');
      watermarkEl.textContent = watermarkText;
      parentContainer.style.position = 'relative';
      parentContainer.insertBefore(watermarkEl, heading);
    }

    let wordIndex = 0;

    function processTextString(text, extraClass = '') {
      const parts = text.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        if (/^\s+$/.test(part) || part === '') {
          frag.appendChild(document.createTextNode(part));
        } else {
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = `word-inner ${extraClass}`.trim();
          inner.style.setProperty('--word-idx', wordIndex++);
          inner.textContent = part;
          mask.appendChild(inner);
          frag.appendChild(mask);
        }
      });
      return frag;
    }

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return processTextString(node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          return node.cloneNode(true);
        }

        const isHighlighted = node.classList.contains('gradient-text') || node.classList.contains('faq-cyan-text');
        if (isHighlighted) {
          // Create custom highlight container
          const highlightBox = document.createElement('span');
          highlightBox.className = 'custom-highlight-box';

          // Wrap the text inside with gradient words
          const wordsFrag = processTextString(node.textContent, node.className);
          highlightBox.appendChild(wordsFrag);

          // Append Dual-Layer Animated SVG Swoosh Underline
          const isDarkSection = heading.closest('.section-faq-editorial, .section-contact-editorial');
          const strokeColor = isDarkSection ? '#38bdf8' : '#2296d3';
          const svgUnderline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svgUnderline.setAttribute('class', 'title-brush-underline');
          svgUnderline.setAttribute('viewBox', '0 0 240 14');
          svgUnderline.setAttribute('preserveAspectRatio', 'none');
          svgUnderline.innerHTML = `
            <path class="title-brush-base" d="M3 9C55 3.5 130 3 237 9" stroke="${strokeColor}"/>
            <path class="title-brush-comet" d="M3 9C55 3.5 130 3 237 9"/>
          `;
          highlightBox.appendChild(svgUnderline);

          // Append Twinkling Sparkle Star
          const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          sparkle.setAttribute('class', 'title-sparkle-star');
          sparkle.setAttribute('viewBox', '0 0 24 24');
          sparkle.setAttribute('fill', strokeColor);
          sparkle.innerHTML = `<path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>`;
          highlightBox.appendChild(sparkle);

          return highlightBox;
        }

        const clone = node.cloneNode(false);
        const childWords = node.textContent.trim().split(/\s+/);
        if (childWords.length > 1) {
          return processTextString(node.textContent, node.className);
        } else {
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          clone.classList.add('word-inner');
          clone.style.setProperty('--word-idx', wordIndex++);
          clone.textContent = node.textContent;
          mask.appendChild(clone);
          return mask;
        }
      }
      return node.cloneNode(true);
    }

    const children = Array.from(heading.childNodes);
    heading.innerHTML = '';
    children.forEach(child => {
      heading.appendChild(processNode(child));
    });
  });

  // 9. Scroll-Scrubbed Text Highlight (.scroll-scrub-text)
  const scrubTexts = document.querySelectorAll('.scroll-scrub-text');
  const scrubInstances = [];
  scrubTexts.forEach(p => {
    const rawHtml = p.innerHTML;
    const tokens = rawHtml.split(/(<[^>]+>|\s+)/g);
    const wrapped = tokens.map(tok => {
      if (!tok || /^\s+$/.test(tok) || tok.startsWith('<')) return tok;
      return `<span class="scrub-word">${tok}</span>`;
    }).join('');
    p.innerHTML = wrapped;
    const words = Array.from(p.querySelectorAll('.scrub-word'));
    if (words.length > 0) {
      scrubInstances.push({ el: p, words });
    }
  });

  function updateScrollScrubText() {
    if (scrubInstances.length === 0) return;
    const vh = window.innerHeight;
    scrubInstances.forEach(({ el, words }) => {
      const rect = el.getBoundingClientRect();
      // Start illuminating when element enters bottom 88% of viewport, finish by 42%
      const startY = vh * 0.88;
      const endY = vh * 0.42;
      const progress = Math.max(0, Math.min(1, (startY - rect.top) / (startY - endY)));
      const activeCount = Math.round(progress * words.length);
      words.forEach((w, idx) => {
        if (idx < activeCount) {
          w.classList.add('is-lit');
        } else {
          w.classList.remove('is-lit');
        }
      });
    });
  }

  window.addEventListener('scroll', updateScrollScrubText, { passive: true });
  window.addEventListener('resize', updateScrollScrubText, { passive: true });
  setTimeout(updateScrollScrubText, 120);

  // 10. Animated Number Counter ([data-count-to])
  function animateCounter(el) {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';
    const target = parseInt(el.getAttribute('data-count-to') || '30', 10);
    const suffix = el.getAttribute('data-count-suffix') || '+';
    const duration = 1500;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * target);
      el.textContent = `${current}${suffix}`;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }
    requestAnimationFrame(step);
  }

  // 11. Scroll Reveal Observer (Section Entrance, Staggered Cards, Split-Word Headings & Image Clip Curtain)
  const revealSelector = '.scroll-reveal, .stagger-reveal, .split-text-reveal, .clip-reveal-img';
  const revealElements = document.querySelectorAll(revealSelector);

  function triggerReveal(el) {
    el.classList.add('is-revealed');
    const counters = el.querySelectorAll('[data-count-to]');
    counters.forEach(c => animateCounter(c));
    if (el.hasAttribute('data-count-to')) {
      animateCounter(el);
    }
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerReveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -35px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Also reveal any elements already visible in viewport on load
    setTimeout(() => {
      const vh = window.innerHeight;
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 20 && rect.bottom > 0) {
          triggerReveal(el);
        }
      });
      updateScrollScrubText();
    }, 150);
  } else {
    revealElements.forEach(el => triggerReveal(el));
  }

  // 12. Quick Enquiry Form Handler (#v1-enquiry-form)
  const enquiryForm = document.getElementById('v1-enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = enquiryForm.querySelector('.v1-enquiry-submit');
      if (!btn) return;
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<span>Enquiry Sent Successfully! ✓</span>';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      enquiryForm.reset();
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.background = '';
      }, 3500);
    });
  }
});

