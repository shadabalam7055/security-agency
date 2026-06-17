/**
 * Global Security Agency - Main JavaScript
 * Handles:
 * - Light/Dark Theme Toggling (localStorage persistent)
 * - Sticky Navbar on Scroll
 * - Active Page Navigation Highlight
 * - AOS (Animate on Scroll) Library Initialization
 * - Intersection Observer Scroll Counter Animations
 * - Gallery Category Filtering
 * - Custom Image Lightbox
 * - Careers & Contact Form Client-side Validations
 * - Request Security Modal Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Light/Dark Theme Switcher ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Set default theme to dark if not set in localStorage
  const currentTheme = localStorage.getItem('gsa-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('gsa-theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  function updateThemeIcons(theme) {
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (theme === 'light') {
        icon.className = 'bi bi-moon-fill';
        btn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        icon.className = 'bi bi-sun-fill';
        btn.setAttribute('title', 'Switch to Light Mode');
      }
    });
  }

  // --- 2. Sticky Navbar Effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shadow-lg');
      navbar.style.padding = '0.5rem 0';
    } else {
      navbar.classList.remove('shadow-lg');
      navbar.style.padding = '0.8rem 0';
    }
  });

  // --- 3. Active Page Link Highlighting ---
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === pageName || (pageName === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- 4. Scroll To Top Button ---
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('active');
      } else {
        scrollToTopBtn.classList.remove('active');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 5. AOS Animations ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 100
    });
  }

  // --- 6. Scroll Statistics Counters ---
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const counters = document.querySelectorAll('.counter-val');
    let countersStarted = false;

    const startCounters = () => {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 1500; // Duration of animation in ms
        const stepTime = Math.max(Math.floor(duration / target), 10);
        
        const timer = setInterval(() => {
          count += Math.ceil(target / (duration / stepTime));
          if (count >= target) {
            counter.innerText = target + suffix;
            clearInterval(timer);
          } else {
            counter.innerText = count + suffix;
          }
        }, stepTime);
      });
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          startCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  // --- 7. Gallery Category Filtering ---
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Class on Buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const categories = item.getAttribute('data-category').split(' ');
          
          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.transform = 'scale(1)';
              item.style.opacity = '1';
            }, 10);
          } else {
            item.style.transform = 'scale(0.8)';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
        
        // Refresh AOS after items rearrange
        setTimeout(() => {
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        }, 350);
      });
    });
  }

  // --- 8. Custom Gallery Lightbox ---
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.querySelector('.gsa-lightbox');
  const lightboxImg = document.querySelector('.gsa-lightbox-img');
  const lightboxCaption = document.querySelector('.gsa-lightbox-caption');
  const lightboxClose = document.querySelector('.gsa-lightbox-close');

  if (galleryCards.length > 0 && lightbox) {
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.gallery-item-img');
        const title = card.querySelector('.gallery-overlay-title').innerText;
        const tag = card.querySelector('.gallery-overlay-tag').innerText;

        lightboxImg.src = img.src;
        lightboxCaption.innerText = `${title} - ${tag}`;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable page scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Enable page scrolling
      lightboxImg.src = '';
      lightboxCaption.innerText = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- 9. Form Validations (Careers & Contact & Request Modal) ---
  
  // Custom Validation Helper
  function validateField(input, validationFn, errorMsg) {
    const parent = input.closest('.gsa-form-group') || input.parentElement;
    let feedback = parent.querySelector('.invalid-feedback');
    
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      parent.appendChild(feedback);
    }

    const isValid = validationFn(input.value.trim());
    if (!isValid) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      feedback.innerText = errorMsg;
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      feedback.innerText = '';
      return true;
    }
  }

  // Common Validators
  const validators = {
    required: (val) => val.length > 0,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    phone: (val) => /^\+?[0-9\s-]{10,15}$/.test(val),
    file: (input) => input.files && input.files.length > 0
  };

  // Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const phoneInput = document.getElementById('contactPhone');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      let isValid = true;

      isValid &= validateField(nameInput, validators.required, 'Please enter your full name.');
      isValid &= validateField(emailInput, validators.email, 'Please enter a valid email address.');
      isValid &= validateField(phoneInput, validators.phone, 'Please enter a valid phone number (10-15 digits).');
      isValid &= validateField(subjectInput, validators.required, 'Please enter a subject.');
      isValid &= validateField(messageInput, (val) => val.length >= 10, 'Your message must be at least 10 characters long.');

      if (isValid) {
        showSuccessAlert(contactForm, 'Thank you! Your message has been sent successfully. Our team will get back to you shortly.');
      }
    });
  }

  // Careers Form Validation
  const careersForm = document.getElementById('careersForm');
  if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('applicantName');
      const emailInput = document.getElementById('applicantEmail');
      const phoneInput = document.getElementById('applicantPhone');
      const roleSelect = document.getElementById('applicantRole');
      const fileInput = document.getElementById('applicantDocuments');
      const messageInput = document.getElementById('applicantCover');

      let isValid = true;

      isValid &= validateField(nameInput, validators.required, 'Please enter your full name.');
      isValid &= validateField(emailInput, validators.email, 'Please enter a valid email address.');
      isValid &= validateField(phoneInput, validators.phone, 'Please enter a valid phone number.');
      isValid &= validateField(roleSelect, validators.required, 'Please select the position you are applying for.');
      isValid &= validateField(fileInput, () => fileInput.files.length > 0, 'Please upload the required documents (PDF or ZIP).');

      if (isValid) {
        showSuccessAlert(careersForm, 'Application Submitted! Thank you for applying to Global Security Agency. We will review your application and documents and contact you soon.');
      }
    });

    // Sync custom file upload text
    const fileInput = document.getElementById('applicantDocuments');
    const uploadText = document.querySelector('.gsa-file-upload-text');
    if (fileInput && uploadText) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          uploadText.innerHTML = `<strong class="text-gold">Selected:</strong> ${fileInput.files[0].name}`;
          fileInput.classList.remove('is-invalid');
          fileInput.classList.add('is-valid');
        } else {
          uploadText.innerText = 'Click to upload files or drag & drop here (Aadhaar, PAN, Certificates, Photo - ZIP/PDF)';
        }
      });
    }
  }

  // Request Security CTA Modal Form Validation
  const requestModalForm = document.getElementById('requestModalForm');
  if (requestModalForm) {
    requestModalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('reqName');
      const emailInput = document.getElementById('reqEmail');
      const phoneInput = document.getElementById('reqPhone');
      const serviceSelect = document.getElementById('reqService');
      const messageInput = document.getElementById('reqDetails');

      let isValid = true;

      isValid &= validateField(nameInput, validators.required, 'Please enter your name.');
      isValid &= validateField(emailInput, validators.email, 'Please enter a valid email address.');
      isValid &= validateField(phoneInput, validators.phone, 'Please enter your phone number.');
      isValid &= validateField(serviceSelect, validators.required, 'Please select a service.');

      if (isValid) {
        // Close modal first
        const modalElement = document.getElementById('requestSecurityModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }

        // Show generic confirmation popup
        alert('Request Received! A luxury security consultant from Global Security Agency will contact you within the next 2 hours.');
        requestModalForm.reset();
        
        // Remove validation classes
        requestModalForm.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      }
    });
  }

  // Success message alert replacement helper
  function showSuccessAlert(form, message) {
    const parentContainer = form.parentElement;
    
    // Create Alert Box
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success d-flex align-items-center gsa-card border-success mt-4 animate__animated animate__fadeIn';
    alertDiv.style.borderColor = 'rgba(40, 167, 69, 0.4)';
    alertDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
    alertDiv.style.color = '#FFFFFF';
    
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-check-circle-fill text-success fs-3 me-3"></i>
        <div>
          <h5 class="alert-heading text-success mb-1" style="font-size: 1.1rem; text-transform: uppercase;">Success!</h5>
          <p class="mb-0 text-secondary-custom" style="font-size: 0.9rem;">${message}</p>
        </div>
      </div>
    `;

    // Fade out form and display alert
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.4s ease';
    
    setTimeout(() => {
      form.style.display = 'none';
      parentContainer.appendChild(alertDiv);
    }, 400);
  }
});
