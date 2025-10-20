/**
 * MowForce Website - JavaScript
 * Handles navigation, form validation, and smooth scrolling
 */

(function () {
  'use strict';

  /* ============================================
     Mobile Navigation Toggle
     ============================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (event) {
    const isClickInside =
      navMenu.contains(event.target) || navToggle.contains(event.target);
    if (!isClickInside && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ============================================
     Navbar Scroll Effect
     ============================================ */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
  });

  /* ============================================
     Smooth Scrolling
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ============================================
     Scroll Down + Back To Top
     ============================================ */
  // Scroll Down buttons
  document.querySelectorAll('[data-scroll-target]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const target = document.querySelector(
        this.getAttribute('data-scroll-target')
      );
      if (!target) return;
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Back to top visibility
  const backToTop = document.querySelector('.back-to-top');
  const toggleBackToTop = () => {
    if (!backToTop) return;
    if (window.pageYOffset > 400) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  };
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop);

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     Form Validation & Submission
     ============================================ */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea');

    // Real-time validation
    formInputs.forEach((input) => {
      input.addEventListener('blur', function () {
        validateField(this);
      });

      input.addEventListener('input', function () {
        if (this.classList.contains('invalid')) {
          validateField(this);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      // Validate all fields
      formInputs.forEach((input) => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Prepare email content
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value || 'Not provided';
        const message = document.getElementById('message').value;

        const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        const mailtoLink = `mailto:marcus@mowforce.co.nz?subject=New Quote Request from ${name}&body=${emailBody}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        const successMessage = document.getElementById('form-success');
        if (successMessage) {
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 5000);
        }

        // Reset form
        contactForm.reset();

        // Remove validation classes
        formInputs.forEach((input) => {
          input.classList.remove('invalid', 'valid');
        });
      } else {
        // Focus on first invalid field
        const firstInvalid = contactForm.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  }

  /**
   * Validate individual form field
   */
  function validateField(field) {
    const value = field.value.trim();
    const errorMessage = field.nextElementSibling;
    let isValid = true;
    let message = '';

    // Check if field is required
    if (field.hasAttribute('required') && value === '') {
      isValid = false;
      message = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }

    // Phone validation (optional but if provided, should be valid)
    if (field.type === 'tel' && value !== '') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 7) {
        isValid = false;
        message = 'Please enter a valid phone number';
      }
    }

    // Update field styling and error message
    if (isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
      }
    } else {
      field.classList.remove('valid');
      field.classList.add('invalid');
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      }
    }

    return isValid;
  }

  /* ============================================
     Scroll Animations
     ============================================ */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.service-card, .stat-card, .about-feature, .contact-card'
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });

  /* ============================================
     Accessibility Enhancements
     ============================================ */
  // Trap focus in mobile menu when open
  if (navToggle && navMenu) {
    const focusableElements = navMenu.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    navMenu.addEventListener('keydown', function (e) {
      if (!navMenu.classList.contains('active')) return;

      if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  /* ============================================
     Performance Optimization
     ============================================ */
  // Lazy load images with intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  });

  // Observe all lazy images
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });

  // Debounce scroll events for better performance
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(function() {
      // Scroll handling code here
    }, 10);
  });

  /* ============================================
     Analytics Event Tracking (Optional)
     ============================================ */
  function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  }

  // Track button clicks
  document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('click', function () {
      trackEvent('Button', 'Click', this.textContent.trim());
    });
  });

  // Track phone calls
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', function () {
      trackEvent('Contact', 'Phone Call', this.href);
    });
  });

  // Track email clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', function () {
      trackEvent('Contact', 'Email', this.href);
    });
  });

  console.log('MowForce website loaded successfully! 🌱');
})();
