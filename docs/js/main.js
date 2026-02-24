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

    // If form has action (Formspree/Netlify), submit normally
    if(contactForm.action){
      contactForm.submit();
    } else {
      // Demo mode: show success and reset
      showFeedback('Dziękuję! Odezwiemy się wkrótce.', 'success');
      contactForm.reset();
    }
  });
}

