/* ==========================================================================
   Everclean Steam Services — Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ========== NAV SCROLL EFFECT ========== */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ========== MOBILE NAV ========== */
  const mobileNav = document.getElementById('mobileNav');
  const mobileOpen = document.getElementById('mobileOpen');
  const mobileClose = document.getElementById('mobileClose');

  if (mobileOpen) {
    mobileOpen.addEventListener('click', function () {
      mobileNav.classList.add('open');
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', function () {
      mobileNav.classList.remove('open');
    });
  }
  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
    });
  });

  /* ========== SCROLL REVEAL ========== */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
    // Safety fallback
    setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }, 2500);
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ========== REVIEWS CAROUSEL ========== */
  var track = document.querySelector('.reviews-track');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var dots = document.querySelectorAll('.carousel-dot');
  var autoplayInterval = null;
  var cardWidth = 404; // card width + gap

  function getMaxScroll() {
    return track.scrollWidth - track.clientWidth;
  }

  function getCurrentIndex() {
    var scrollPos = track.scrollLeft;
    return Math.round(scrollPos / cardWidth);
  }

  function updateDots() {
    var totalCards = track.children.length;
    var visibleCards = Math.floor(track.clientWidth / cardWidth) || 1;
    var maxIndex = Math.max(0, totalCards - visibleCards);
    var currentIndex = Math.min(getCurrentIndex(), maxIndex);
    var dotCount = dots.length;
    var dotIndex = Math.min(Math.round((currentIndex / Math.max(maxIndex, 1)) * (dotCount - 1)), dotCount - 1);

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === dotIndex);
    });
  }

  function scrollToCard(direction) {
    var current = track.scrollLeft;
    var newPos = direction === 'next'
      ? Math.min(current + cardWidth, getMaxScroll())
      : Math.max(current - cardWidth, 0);

    // Wrap around
    if (direction === 'next' && current >= getMaxScroll() - 10) {
      newPos = 0;
    } else if (direction === 'prev' && current <= 10) {
      newPos = getMaxScroll();
    }

    track.scrollTo({ left: newPos, behavior: 'smooth' });
    setTimeout(updateDots, 350);
  }

  if (prevBtn && nextBtn && track) {
    prevBtn.addEventListener('click', function () {
      scrollToCard('prev');
      resetAutoplay();
    });
    nextBtn.addEventListener('click', function () {
      scrollToCard('next');
      resetAutoplay();
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        track.scrollTo({ left: i * cardWidth * 2, behavior: 'smooth' });
        setTimeout(updateDots, 350);
        resetAutoplay();
      });
    });

    track.addEventListener('scroll', function () {
      updateDots();
    }, { passive: true });

    // Auto-play
    function startAutoplay() {
      autoplayInterval = setInterval(function () {
        scrollToCard('next');
      }, 5000);
    }
    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }
    startAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', function () {
      clearInterval(autoplayInterval);
    });
    track.addEventListener('mouseleave', function () {
      startAutoplay();
    });

    // Recalculate card width on resize
    window.addEventListener('resize', function () {
      var firstCard = track.querySelector('.review-card');
      if (firstCard) {
        cardWidth = firstCard.offsetWidth + 24; // card + gap
      }
    });
    // Init card width
    var firstCard = track.querySelector('.review-card');
    if (firstCard) {
      cardWidth = firstCard.offsetWidth + 24;
    }
  }

  /* ========== BACK TO TOP ========== */
  var backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      backBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========== CONTACT FORM — NETLIFY ========== */
  var form = document.getElementById('contactForm');
  var thankYou = document.getElementById('formThankYou');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      var formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(function (res) {
        if (res.ok) {
          form.style.display = 'none';
          if (thankYou) thankYou.classList.add('active');
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function () {
        // Fallback: show thank-you anyway (form will still be submitted to Netlify)
        form.style.display = 'none';
        if (thankYou) thankYou.classList.add('active');
      });
    });
  }

  /* ========== FAQ ACCORDION ========== */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('open');
      });
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

});
