/* ============================================================
   sairaah-website / script.js
   Vanilla JS — no dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. FOOTER — AUTO YEAR
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ----------------------------------------------------------
     2. MOBILE NAV TOGGLE
     Clicking the hamburger opens / closes the nav menu.
     body.menu-open prevents background scroll while open.
     ---------------------------------------------------------- */
  const navToggle  = document.querySelector('.nav-toggle');
  const navMenu    = document.getElementById('nav-menu');
  const siteHeader = document.querySelector('.site-header');

  function openMenu() {
    navMenu.classList.add('nav-menu--open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    navMenu.classList.remove('nav-menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    // Close when any nav link is activated
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close with Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('nav-menu--open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Close when clicking outside the header
    document.addEventListener('click', e => {
      if (navMenu.classList.contains('nav-menu--open') && !siteHeader.contains(e.target)) {
        closeMenu();
      }
    });
  }


  /* ----------------------------------------------------------
     3. SMOOTH SCROLL
     Overrides the CSS scroll-behavior so we can account for
     the sticky nav height as an offset.
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight  = siteHeader ? siteHeader.offsetHeight : 0;
      const targetTop  = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
     4. STICKY NAV SHADOW
     Adds .site-header--scrolled when page is scrolled > 50px.
     The CSS handles the shadow and backdrop-blur.
     ---------------------------------------------------------- */
  function updateNavState() {
    if (!siteHeader) return;
    siteHeader.classList.toggle('site-header--scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();


  /* ----------------------------------------------------------
     5. ACTIVE NAV LINK — IntersectionObserver
     Highlights the nav link whose section is most in view.
     rootMargin creates a thin horizontal band in the middle
     of the viewport — whichever section crosses it is "active".
     ---------------------------------------------------------- */
  const pageSections = [...document.querySelectorAll('main section[id]')];
  const navLinks     = [...document.querySelectorAll('.nav-link[href^="#"]')];

  if (pageSections.length && navLinks.length) {
    const activeLinkObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('nav-link--active', isActive);
          link.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });

    pageSections.forEach(s => activeLinkObserver.observe(s));
  }


  /* ----------------------------------------------------------
     6. FADE-IN ON SCROLL — IntersectionObserver
     Adds .reveal to targeted elements, then .reveal--visible
     when they enter the viewport. CSS @keyframes handles the
     actual animation. Grid children are staggered by index.
     ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.about__photo-frame, .about__bio-col, .pull-quote, .about__stats, ' +
    '.foundation__mission, .foundation__card,                            ' +
    '.activity__card,                                                    ' +
    '.gallery__item,                                                     ' +
    '.contact__form-col, .contact__details-col'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    // Stagger siblings within the same grid parent
    const seenParents = new WeakSet();

    revealTargets.forEach(el => {
      el.classList.add('reveal');

      const parent = el.parentElement;
      if (!seenParents.has(parent)) {
        seenParents.add(parent);
        const siblings = [...parent.children].filter(c => c.classList.contains(el.classList[0]));
        siblings.forEach((sibling, i) => {
          sibling.style.animationDelay = `${i * 90}ms`;
        });
      }
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal--visible');
        obs.unobserve(entry.target); // fire once only
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  }


  /* ----------------------------------------------------------
     7. GALLERY LIGHTBOX
     Builds a single overlay in the DOM, then reuses it for
     every image click. Closes on backdrop click, close button,
     or Escape. Focus is trapped inside while open.
     ---------------------------------------------------------- */

  // Build the lightbox once and append to body
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image viewer');
  lightbox.setAttribute('tabindex', '-1');
  lightbox.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <div class="lightbox__content">
      <button class="lightbox__close" aria-label="Close image viewer">&times;</button>
      <img class="lightbox__img" src="" alt="" />
      <p class="lightbox__caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg      = lightbox.querySelector('.lightbox__img');
  const lbCaption  = lightbox.querySelector('.lightbox__caption');
  const lbClose    = lightbox.querySelector('.lightbox__close');
  const lbBackdrop = lightbox.querySelector('.lightbox__backdrop');
  let   preFocus   = null; // element to restore focus to on close

  function openLightbox(src, alt, caption) {
    preFocus = document.activeElement;
    lbImg.src          = src;
    lbImg.alt          = alt;
    lbCaption.textContent = caption;
    lbCaption.hidden   = !caption;
    lightbox.classList.add('lightbox--open');
    document.body.classList.add('lightbox-active');
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.classList.remove('lightbox-active');
    // Clear src after transition ends to avoid flash on next open
    lightbox.addEventListener('transitionend', () => { lbImg.src = ''; }, { once: true });
    if (preFocus) preFocus.focus();
  }

  // Wire up each gallery item
  document.querySelectorAll('.gallery__item').forEach(item => {
    const img     = item.querySelector('.gallery__img');
    const caption = item.querySelector('.gallery__caption');
    if (!img) return;

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View full image${img.alt ? ': ' + img.alt : ''}`);

    function trigger() {
      openLightbox(img.src, img.alt, caption ? caption.textContent.trim() : '');
    }

    item.addEventListener('click', trigger);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });

  lbBackdrop.addEventListener('click', closeLightbox);
  lbClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLightbox(); return; }
    // Trap Tab focus on the close button (only interactive element)
    if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
  });


  /* ----------------------------------------------------------
     8. CONTACT FORM VALIDATION
     Validates on submit. Shows inline error messages.
     Clears each error as the user types.
     On success: logs to console, replaces form with thank-you.
     ---------------------------------------------------------- */
  const form = document.querySelector('.contact__form');

  if (form) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function getErrorEl(input) {
      let el = input.parentElement.querySelector('.form-error-msg');
      if (!el) {
        el = document.createElement('span');
        el.className = 'form-error-msg';
        el.setAttribute('role', 'alert');
        input.after(el);
      }
      return el;
    }

    function showError(input, msg) {
      input.classList.add('form-input--error');
      input.setAttribute('aria-invalid', 'true');
      getErrorEl(input).textContent = msg;
    }

    function clearError(input) {
      input.classList.remove('form-input--error');
      input.removeAttribute('aria-invalid');
      const el = input.parentElement.querySelector('.form-error-msg');
      if (el) el.textContent = '';
    }

    // Live clear: remove error the moment the user starts fixing the field
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      const nameEl    = form.querySelector('#contact-name');
      const emailEl   = form.querySelector('#contact-email');
      const messageEl = form.querySelector('#contact-message');
      let valid = true;

      // Name
      if (!nameEl.value.trim()) {
        showError(nameEl, 'Please enter your full name.');
        valid = false;
      } else {
        clearError(nameEl);
      }

      // Email
      if (!emailEl.value.trim()) {
        showError(emailEl, 'Please enter your email address.');
        valid = false;
      } else if (!EMAIL_RE.test(emailEl.value.trim())) {
        showError(emailEl, 'Please enter a valid email address (e.g. name@example.com).');
        valid = false;
      } else {
        clearError(emailEl);
      }

      // Message
      if (!messageEl.value.trim()) {
        showError(messageEl, 'Please enter a message.');
        valid = false;
      } else if (messageEl.value.trim().length < 10) {
        showError(messageEl, 'Your message is too short — please add a bit more detail.');
        valid = false;
      } else {
        clearError(messageEl);
      }

      if (!valid) {
        // Focus the first field with an error
        const firstInvalid = form.querySelector('.form-input--error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // --- Valid: log payload, show thank-you ---
      console.log('[Contact form] Submission ready to send:', {
        name:    nameEl.value.trim(),
        email:   emailEl.value.trim(),
        subject: form.querySelector('#contact-subject')?.value.trim() || '',
        message: messageEl.value.trim(),
      });

      // Replace the form with a success message
      const thankYou = document.createElement('div');
      thankYou.className = 'form-success';
      thankYou.setAttribute('role', 'status');
      thankYou.setAttribute('tabindex', '-1');
      thankYou.innerHTML = `
        <div class="form-success__icon" aria-hidden="true">&#10003;</div>
        <h3 class="form-success__heading">Thank you for reaching out!</h3>
        <p class="form-success__text">
          Your message has been received. We'll be in touch with you shortly.
        </p>
      `;
      form.replaceWith(thankYou);
      thankYou.focus();
    });
  }

}); // end DOMContentLoaded
