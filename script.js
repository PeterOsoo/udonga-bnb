/* =============================================
   UDONGA FURNISHED HOMES — udonga.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ---- HAMBURGER ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- HERO SLIDESHOW ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDots');
  let currentSlide = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goSlide(index) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');
  }

  setInterval(() => goSlide((currentSlide + 1) % slides.length), 5000);

  /* ---- HERO SEARCH BUTTON ---- */
  document.getElementById('heroSearchBtn').addEventListener('click', () => {
    const city = document.getElementById('heroCity').value;
    const type = document.getElementById('heroType').value;

    // Scroll to listings
    const listingsSection = document.getElementById('listings');
    const top = listingsSection.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });

    // Apply filters after scroll
    setTimeout(() => {
      if (city) {
        const cityBtn = document.querySelector(`.fbtn[data-city="${city}"]`);
        if (cityBtn) cityBtn.click();
      }
      if (type) {
        const typeBtn = document.querySelector(`.fbtn-type[data-type="${type}"]`);
        if (typeBtn) typeBtn.click();
      }
    }, 800);
  });

  /* ---- UNIT FILTERS ---- */
  let activeCity = 'all';
  let activeType = 'all';

  function applyFilters() {
    const cards = document.querySelectorAll('.unit-card');
    let visible = 0;
    cards.forEach(card => {
      const cityMatch = activeCity === 'all' || card.dataset.city === activeCity;
      const typeMatch = activeType === 'all' || card.dataset.type === activeType
        || (activeType === '4br' && (card.dataset.type === '4br' || card.dataset.type === '5br'));
      const show = cityMatch && typeMatch;
      card.style.display = show ? '' : 'none';
      card.style.opacity = show ? '1' : '0';
      if (show) visible++;
    });
    const noResults = document.getElementById('noResults');
    noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  document.querySelectorAll('.fbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCity = btn.dataset.city;
      applyFilters();
    });
  });

  document.querySelectorAll('.fbtn-type').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fbtn-type').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.dataset.type;
      applyFilters();
    });
  });

  document.getElementById('resetFilters').addEventListener('click', e => {
    e.preventDefault();
    activeCity = 'all'; activeType = 'all';
    document.querySelector('.fbtn[data-city="all"]').click();
    document.querySelector('.fbtn-type[data-type="all"]').click();
  });

  /* ---- CITY CARDS → FILTER LISTINGS ---- */
  document.querySelectorAll('.city-btn[data-city]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const city = btn.dataset.city;
      const listingsSection = document.getElementById('listings');
      const top = listingsSection.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => {
        const cityBtn = document.querySelector(`.fbtn[data-city="${city}"]`);
        if (cityBtn) cityBtn.click();
      }, 800);
    });
  });

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('.hnum');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        const target = parseInt(entry.target.dataset.target);
        const duration = 1600;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { entry.target.textContent = target; clearInterval(timer); }
          else entry.target.textContent = Math.floor(current);
        }, 16);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObs.observe(el));

  /* ---- SCROLL FADE ANIMATIONS ---- */
  const animTargets = [
    '.unit-card', '.city-card', '.amen-card',
    '.gal-item', '.tcard', '.cdet', '.ah-item',
    '.about-img-wrap', '.about-copy',
    '.section-header', '.contact-form-wrap', '.contact-info'
  ];
  animTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
    });
  });
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

  /* ---- BOOKING FORM ---- */
  const bookingForm = document.getElementById('bookingForm');
  const bookSuccess = document.getElementById('bookSuccess');
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = bookingForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    setTimeout(() => {
      bookSuccess.classList.add('show');
      bookingForm.reset();
      btn.innerHTML = 'Send Booking Request <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      btn.style.opacity = '1';
      setTimeout(() => bookSuccess.classList.remove('show'), 8000);
    }, 1400);
  });

  /* ---- GALLERY LIGHTBOX (Simple) ---- */
  document.querySelectorAll('.gal-item img').forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;
        background:rgba(0,0,0,0.92);
        display:flex;align-items:center;justify-content:center;
        cursor:zoom-out;animation:fadeIn 0.3s ease;
      `;
      const image = document.createElement('img');
      image.src = img.src.replace('w=500', 'w=1200');
      image.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 32px 80px rgba(0,0,0,0.5);';
      overlay.appendChild(image);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

});