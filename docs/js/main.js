/* ====== DYNAMIC HEADER HEIGHT ====== */
(function initHeaderHeight(){
  const header = document.querySelector('.site-header');
  const root = document.documentElement;
  
  const updateHeaderHeight = () => {
    if(header){
      const height = header.offsetHeight;
      root.style.setProperty('--header-h', height + 'px');
    }
  };
  
  // Initial call
  updateHeaderHeight();
  
  // Update on resize
  window.addEventListener('resize', updateHeaderHeight);
})();

const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ====== MOBILE MENU ====== */
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-list');
const body = document.body;

function closeMenu(){
  if(menu && toggle){
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }
}

if(toggle && menu){
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    body.classList.toggle('menu-open', isOpen);
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    const inside = e.target.closest('.nav');
    if(!inside && menu.classList.contains('open')){
      closeMenu();
    }
  });

  // Close menu on ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && menu.classList.contains('open')){
      closeMenu();
    }
  });
}

/* ====== AKORDEON - OPEN/CLOSE (IIFE) ====== */
(function initAccordion(){
  const serviceCards = document.querySelectorAll('.service-card[data-open]');
  const accordionItems = document.querySelectorAll('.acc-item');

  // Service card buttons: open accordion panel and close others
  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const panelId = card.getAttribute('data-open');
      const targetPanel = document.getElementById(panelId);
      
      if(targetPanel){
        // Close all other panels
        accordionItems.forEach(panel => {
          if(panel.id !== panelId){
            panel.removeAttribute('open');
          }
        });
        
        // Open target panel
        targetPanel.setAttribute('open', '');
        
        // Smooth scroll to section with offset for sticky header
        const section = document.getElementById('oferta-szczegoly');
        if(section){
          setTimeout(() => {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const scrollTop = section.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
            window.scrollTo({top: scrollTop, behavior: 'smooth'});
          }, 100);
        }
      }
    });
  });

  // Handle hash on page load (e.g., /#diagnoza)
  const handleHashOpen = () => {
    const hash = window.location.hash.slice(1);
    if(hash){
      const panel = document.getElementById(hash);
      if(panel && panel.classList.contains('acc-item')){
        // Close all
        accordionItems.forEach(p => p.removeAttribute('open'));
        // Open target
        panel.setAttribute('open', '');
        // Scroll to section
        setTimeout(() => {
          const section = document.getElementById('oferta-szczegoly');
          if(section){
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const scrollTop = section.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
            window.scrollTo({top: scrollTop, behavior: 'smooth'});
          }
        }, 100);
      }
    }
  };

  // Call on load and on hash change
  handleHashOpen();
  window.addEventListener('hashchange', handleHashOpen);
})();

/* ====== FAQ Toggle Buttons ====== */
const faqToggleOpen = document.getElementById('faqToggleOpen');
const faqToggleClose = document.getElementById('faqToggleClose');
const faqItems = document.querySelectorAll('.faq-item');

if(faqToggleOpen && faqToggleClose){
  faqToggleOpen.addEventListener('click', () => {
    faqItems.forEach(item => item.setAttribute('open', ''));
    faqToggleOpen.style.display = 'none';
    faqToggleClose.style.display = 'block';
  });
  
  faqToggleClose.addEventListener('click', () => {
    faqItems.forEach(item => item.removeAttribute('open'));
    faqToggleClose.style.display = 'none';
    faqToggleOpen.style.display = 'block';
  });
}

/* ====== ACTIVE ANNOUNCEMENT ====== */
const activeAnnouncement = {
  enabled: true,
  title: 'Akademia Twórczości Małego Odkrywcy',
  shortText: 'Zajęcia twórcze dla dzieci 5–10 lat',
  price: '55 zł za zajęcia',
  // Miniatura w panelu używa tego samego pliku; projekt nie ma narzędzi do generowania osobnego thumb.webp.
  imageSrc: 'assets/aktualnosci/akademia-tworczosci-malego-odkrywcy.jpeg',
  fallbackImageSrc: 'assets/aktualnosci/akademia-tworczosci-malego-odkrywcy-fallback.svg',
  imageAlt: 'Plakat Akademia Twórczości Małego Odkrywcy',
  detailsUrl: 'aktualnosci.html#akademia-tworczosci'
};

(function initAnnouncement(){
  const config = activeAnnouncement;
  const widget = document.querySelector('[data-announcement-widget]');
  const modal = document.querySelector('[data-announcement-modal]');
  const toggleBtn = document.querySelector('[data-announcement-toggle]');
  const panel = document.querySelector('[data-announcement-panel]');

  const isHomeAnnouncement = widget && modal && toggleBtn;
  const pageImages = document.querySelectorAll('[data-announcement-page-image]');

  const setImageWithFallback = (img) => {
    if(!img) return;
    img.src = config.imageSrc;
    img.alt = config.imageAlt;
    img.addEventListener('error', () => {
      if(config.fallbackImageSrc && !img.dataset.fallbackLoaded){
        img.dataset.fallbackLoaded = 'true';
        img.src = config.fallbackImageSrc;
      }
    }, { once: true });
  };

  pageImages.forEach(setImageWithFallback);

  if(!isHomeAnnouncement) return;

  if(!config.enabled){
    widget.hidden = true;
    modal.hidden = true;
    return;
  }

  const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const openButtons = document.querySelectorAll('[data-announcement-open]');
  const closeBtn = document.querySelector('[data-announcement-close]');
  const titleEls = document.querySelectorAll('[data-announcement-title], [data-announcement-modal-title]');
  const shortEl = document.querySelector('[data-announcement-short]');
  const priceEl = document.querySelector('[data-announcement-price]');
  const detailLinks = document.querySelectorAll('[data-announcement-details], [data-announcement-modal-details]');
  const images = document.querySelectorAll('[data-announcement-image], [data-announcement-modal-image]');
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  let lastFocus = null;

  titleEls.forEach(el => { el.textContent = config.title; });
  if(shortEl) shortEl.textContent = config.shortText;
  if(priceEl) priceEl.textContent = config.price;
  detailLinks.forEach(link => { link.href = config.detailsUrl; });
  images.forEach(setImageWithFallback);

  const setPanelState = (isOpen) => {
    widget.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if(panel) panel.setAttribute('aria-hidden', String(!isOpen));
  };

  const getFocusable = () => Array.from(modal.querySelectorAll(focusableSelector))
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

  const openModal = (trigger) => {
    lastFocus = trigger || document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    setPanelState(false);
    requestAnimationFrame(() => {
      const focusable = getFocusable();
      (closeBtn || focusable[0] || modal).focus();
    });
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if(lastFocus && typeof lastFocus.focus === 'function'){
      lastFocus.focus();
    }
  };

  toggleBtn.addEventListener('click', () => {
    if(mobileQuery.matches){
      openModal(toggleBtn);
      return;
    }
    setPanelState(!widget.classList.contains('is-open'));
  });

  openButtons.forEach(button => {
    button.addEventListener('click', () => openModal(button));
  });

  if(closeBtn){
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (event) => {
    if(event.target === modal){
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){
      if(!modal.hidden){
        closeModal();
      } else if(widget.classList.contains('is-open')){
        setPanelState(false);
        toggleBtn.focus();
      }
    }

    if(event.key === 'Tab' && !modal.hidden){
      const focusable = getFocusable();
      if(!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if(event.shiftKey && document.activeElement === first){
        event.preventDefault();
        last.focus();
      } else if(!event.shiftKey && document.activeElement === last){
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
const sections = [...navLinks].map(link => {
  const id = link.getAttribute('href');
  return document.querySelector(id);
}).filter(Boolean);

const scrollSpy = () => {
  let current = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if(rect.top <= 100){
      current = '#' + section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('is-active');
    if(link.getAttribute('href') === current){
      link.classList.add('is-active');
    }
  });
};

window.addEventListener('scroll', scrollSpy);
scrollSpy(); // initial call

/* ====== BACK-TO-TOP BUTTON ====== */
const backToTopBtn = document.getElementById('backToTop');

if(backToTopBtn){
  window.addEventListener('scroll', () => {
    if(window.scrollY > 500){
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

/* ====== CONTACT FORM VALIDATION ====== */
const contactForm = document.getElementById('contactForm');

if(contactForm){
  const nameInput = document.getElementById('name');
  const contactInput = document.getElementById('contact');
  const messageInput = document.getElementById('message');
  const consentInput = document.getElementById('consent');
  const feedbackEl = contactForm.querySelector('.form-feedback');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9\s+\-()]+$/;
    const digits = phone.replace(/\D/g, '');
    return re.test(phone) && digits.length >= 9;
  };

  const showError = (field, message) => {
    const group = field.closest('.form-group');
    const errorMsg = group.querySelector('.error-msg');
    if(errorMsg) errorMsg.textContent = message;
    group.classList.add('error');
  };

  const clearError = (field) => {
    const group = field.closest('.form-group');
    const errorMsg = group.querySelector('.error-msg');
    if(errorMsg) errorMsg.textContent = '';
    group.classList.remove('error');
  };

  const showFeedback = (message, type) => {
    feedbackEl.textContent = message;
    feedbackEl.className = 'form-feedback show ' + type;
    setTimeout(() => {
      feedbackEl.classList.remove('show');
    }, 5000);
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate name
    if(!nameInput.value.trim()){
      showError(nameInput, 'Wpisz imię i nazwisko');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validate contact (email or phone)
    const contactVal = contactInput.value.trim();
    if(!contactVal){
      showError(contactInput, 'Wpisz email lub telefon');
      isValid = false;
    } else if(!validateEmail(contactVal) && !validatePhone(contactVal)){
      showError(contactInput, 'Wpisz poprawny email lub numer telefonu');
      isValid = false;
    } else {
      clearError(contactInput);
    }

    // Validate message
    if(!messageInput.value.trim()){
      showError(messageInput, 'Wpisz wiadomość');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    // Validate consent
    if(!consentInput.checked){
      showError(consentInput, 'Musisz zaakceptować przetwarzanie danych');
      isValid = false;
    } else {
      clearError(consentInput);
    }

    if(!isValid) return;

    // Prepare form data for Netlify (URLencoded)
    const formData = new URLSearchParams();
    formData.append('form-name', 'kontakt');
    formData.append('name', nameInput.value.trim());
    formData.append('contact', contactVal);
    formData.append('message', messageInput.value.trim());
    formData.append('consent', consentInput.checked ? 'on' : 'off');

    // Submit via fetch to Netlify Forms endpoint
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
    .then(response => {
      if(!response.ok) throw new Error('Network response was not ok');
      // Success
      showFeedback('Dziękuję! Odezwiemy się wkrótce.', 'success');
      contactForm.reset();
      document.getElementById('mailtoFallback').classList.add('hidden');
    })
    .catch(error => {
      // Error: show fallback mailto
      console.error('Form submission error:', error);
      showFeedback('Nie udało się wysłać formularza. Możesz napisać do nas e-mailem.', 'error');
      
      // Build mailto link with form data
      const mailtoLink = buildMailtoLink(
        nameInput.value.trim(),
        contactVal,
        messageInput.value.trim()
      );
      
      const fallbackBtn = document.getElementById('mailtoFallback');
      fallbackBtn.href = mailtoLink;
      fallbackBtn.classList.remove('hidden');
    });
  });

  // Helper function to build mailto link
  function buildMailtoLink(name, contact, message){
    const to = 'iwona-sadzik@wp.pl';
    const subject = encodeURIComponent('Wiadomość ze strony Neuronest');
    const body = encodeURIComponent(
      `Imię i nazwisko: ${name}\nKontakt (email/telefon): ${contact}\n\nWiadomość:\n${message}`
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }
}
