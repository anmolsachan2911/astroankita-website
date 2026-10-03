/* ==========================================================================
   ASTRO ANKITA - Main JavaScript Logic
   ========================================================================== */

// CENTRALIZED BRAND CONFIGURATION
// Easily update your WhatsApp number, Phone, Email, and Instagram handle here:
window.ASTRO_CONFIG = {
  // Format: Country Code + Phone Number (no + symbol or dashes for WhatsApp link)
  whatsappNumber: "918750722636", 
  
  // Format for displaying phone number to users
  displayPhone: "+91 87507 22636",
  
  // Contact email
  email: "consult@astroankita.com",
  
  // Instagram handle
  instagram: "@astroankita"
};

document.addEventListener('DOMContentLoaded', () => {

  // Update all WhatsApp and Phone links dynamically from ASTRO_CONFIG
  function syncContactInfo() {
    const waNum = window.ASTRO_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const displayPhone = window.ASTRO_CONFIG.displayPhone;

    // Sync all WhatsApp links
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      const url = new URL(link.href);
      const textParam = url.searchParams.get('text');
      link.href = `https://wa.me/${waNum}${textParam ? '?text=' + textParam : ''}`;
    });

    // Sync telephone links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.href = `tel:+${waNum}`;
      if (link.dataset.syncText !== "false") {
        link.textContent = displayPhone;
      }
    });

    // Sync email links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.href = `mailto:${window.ASTRO_CONFIG.email}`;
      if (link.dataset.syncText !== "false") {
        link.textContent = window.ASTRO_CONFIG.email;
      }
    });
  }

  syncContactInfo();


  /* ------------------------------------------------------------------------
     1. Constellation Background Canvas
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    });

    let stars = [];
    const numStars = Math.min(Math.floor(window.innerWidth / 20), 45);

    function initStars() {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    }

    initStars();

    function animateStars() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 106, ${star.alpha})`;
        ctx.fill();

        // Connect nearby stars with subtle gold lines
        for (let j = i + 1; j < stars.length; j++) {
          const star2 = stars[j];
          const dist = Math.hypot(star.x - star2.x, star.y - star2.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.strokeStyle = `rgba(212, 175, 106, ${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateStars);
    }

    animateStars();
  }

  /* ------------------------------------------------------------------------
     2. Sticky Navbar & Scroll Spy
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy active state update
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    const isOpen = hamburgerBtn.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    hamburgerBtn.classList.add('open');
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburgerBtn.classList.remove('open');
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ------------------------------------------------------------------------
     4. FAQ Accordion Logic
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all faq items first for clean single-accordion feel
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Testimonials Carousel
     ------------------------------------------------------------------------ */
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dotsContainer = document.getElementById('carousel-dots');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function updateCarousel(index) {
    if (totalSlides === 0) return;
    currentIndex = (index + totalSlides) % totalSlides;
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
      resetAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 6000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();

  /* ------------------------------------------------------------------------
     6. Modal Management (Booking, About, Privacy, Terms)
     ------------------------------------------------------------------------ */
  const bookingModal = document.getElementById('booking-modal');
  const closeBookingBtn = document.getElementById('close-booking-modal');
  const bookingBtns = document.querySelectorAll('.open-booking-btn');
  const consultationTypeSelect = document.getElementById('consultation-type');

  function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.add('active');
    modalElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('active');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  bookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && consultationTypeSelect) {
        // Try to match select option if exists
        const options = Array.from(consultationTypeSelect.options);
        const matched = options.find(opt => opt.value === serviceName);
        if (matched) {
          consultationTypeSelect.value = serviceName;
        }
      }
      openModal(bookingModal);
      if (mobileDrawer.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  });

  if (closeBookingBtn) {
    closeBookingBtn.addEventListener('click', () => closeModal(bookingModal));
  }

  // About Modal
  const aboutModal = document.getElementById('about-modal');
  const openAboutBtn = document.getElementById('open-about-modal');
  const closeAboutBtn = document.getElementById('close-about-modal');

  if (openAboutBtn && aboutModal) {
    openAboutBtn.addEventListener('click', () => openModal(aboutModal));
  }
  if (closeAboutBtn && aboutModal) {
    closeAboutBtn.addEventListener('click', () => closeModal(aboutModal));
  }

  // Privacy Modal
  const privacyModal = document.getElementById('privacy-modal');
  const openPrivacyLink = document.getElementById('open-privacy-link');
  const closePrivacyBtn = document.getElementById('close-privacy-modal');

  if (openPrivacyLink && privacyModal) {
    openPrivacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  }
  if (closePrivacyBtn && privacyModal) {
    closePrivacyBtn.addEventListener('click', () => closeModal(privacyModal));
  }

  // Terms Modal
  const termsModal = document.getElementById('terms-modal');
  const openTermsLink = document.getElementById('open-terms-link');
  const closeTermsBtn = document.getElementById('close-terms-modal');

  if (openTermsLink && termsModal) {
    openTermsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  }
  if (closeTermsBtn && termsModal) {
    closeTermsBtn.addEventListener('click', () => closeModal(termsModal));
  }

  // Close modal when clicking overlay outside content
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Handle Booking Form Submission
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = document.getElementById('consultation-type').value;
      const name = document.getElementById('client-name').value;
      const email = document.getElementById('client-email').value;
      const phone = document.getElementById('client-phone').value;
      const dob = document.getElementById('dob').value;
      const tob = document.getElementById('tob').value;
      const pob = document.getElementById('pob').value;
      const questions = document.getElementById('questions').value;

      // Construct WhatsApp message with Kundli details pre-formatted
      const waText = encodeURIComponent(
        `Hello Astro Ankita,\n\nI would like to confirm my consultation booking request:\n` +
        `• Service: ${service}\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Date of Birth: ${dob}\n` +
        `• Time of Birth: ${tob}\n` +
        `• Place of Birth: ${pob}\n` +
        (questions ? `• Question: ${questions}\n` : '') +
        `\nLooking forward to your guidance.`
      );

      // Render confirmation screen inside modal
      const modalBody = bookingModal.querySelector('.modal-body');
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 1.5rem 0;">
          <div style="width: 64px; height: 64px; background: rgba(37, 211, 102, 0.15); color: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.25rem auto;">
            ✓
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-primary); margin-bottom: 0.5rem;">
            Booking Request Received!
          </h3>
          <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
            Thank you, <strong>${name}</strong>. We have captured your birth chart details for <strong>${service}</strong>.
          </p>

          <div style="background: var(--color-bg-card); border: 1px solid rgba(212, 175, 106, 0.3); border-radius: 12px; padding: 1.25rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.875rem;">
            <p style="margin-bottom: 0.4rem;"><strong>Date of Birth:</strong> ${dob}</p>
            <p style="margin-bottom: 0.4rem;"><strong>Time of Birth:</strong> ${tob}</p>
            <p style="margin-bottom: 0.4rem;"><strong>Place of Birth:</strong> ${pob}</p>
            <p><strong>Status:</strong> Pending Slot Confirmation</p>
          </div>

          <p style="font-size: 0.9rem; color: var(--color-text-dark); margin-bottom: 1.5rem;">
            To expedite your schedule confirmation, you can instantly connect via WhatsApp:
          </p>

          <a href="https://wa.me/${window.ASTRO_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${waText}" 
             target="_blank" 
             class="btn btn-whatsapp" 
             style="width: 100%; margin-bottom: 0.75rem;">
            Confirm on WhatsApp
          </a>

          <button class="btn btn-outline" id="reset-booking-btn" style="width: 100%;">
            Done / Close Window
          </button>
        </div>
      `;

      document.getElementById('reset-booking-btn').addEventListener('click', () => {
        closeModal(bookingModal);
        location.reload();
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Reveal Animations on Scroll
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
