(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');

  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    };

    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const filterButtons = document.querySelectorAll('.filter-button');
  const projectCards = document.querySelectorAll('.project-grid .project-card');
  const emptyMessage = document.querySelector('.empty-filter');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visible = 0;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      projectCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visible !== 0;
    });
  });

  const enquiryService = document.querySelector('.contact-form select[name="service"]');
  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      if (enquiryService) {
        enquiryService.value = link.dataset.service;
        enquiryService.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  const whyStories = document.querySelector('[data-why-stories]');
  if (whyStories) {
    const reasons = [...whyStories.querySelectorAll('[data-why-reason]')];
    const photos = [...whyStories.querySelectorAll('[data-why-photo]')];
    reasons.forEach(reason => reason.addEventListener('toggle', () => {
      if (!reason.open) return;
      reasons.forEach(other => { if (other !== reason) other.open = false; });
      photos.forEach(photo => { photo.hidden = photo.dataset.whyPhoto !== reason.dataset.whyReason; });
    }));
  }

  const heroPlayer = document.querySelector('[data-hero-player]');
  if (heroPlayer) {
    const videos = [...heroPlayer.querySelectorAll('.hero-video')];
    const choices = [...heroPlayer.querySelectorAll('.hero-video-choice')];
    const toggle = heroPlayer.querySelector('.hero-video-toggle');
    const title = heroPlayer.querySelector('.hero-video-title');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = 0;
    let paused = reducedMotion.matches || Boolean(navigator.connection?.saveData);
    let inView = true;
    let fallbackTimer;
    let playRequest = 0;

    heroPlayer.querySelector('.hero-controls').hidden = false;

    const updateToggle = () => {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Play background videos' : 'Pause background videos');
      toggle.innerHTML = paused ? 'Play <span aria-hidden="true">▷</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
    };

    const canPlay = () => !paused && inView && !document.hidden;

    const syncPlayback = () => {
      clearTimeout(fallbackTimer);
      const request = ++playRequest;
      videos.forEach((video, index) => {
        if (index !== activeIndex || !canPlay()) video.pause();
      });
      if (!canPlay()) return;
      const video = videos[activeIndex];
      if (video.dataset.failed) {
        fallbackTimer = setTimeout(() => selectVideo((activeIndex + 1) % videos.length), 8000);
        return;
      }
      if (!video.hasAttribute('src')) {
        video.muted = true;
        video.src = video.dataset.src;
        video.load();
      }
      video.play().then(() => {
        if (!canPlay() || video !== videos[activeIndex]) video.pause();
      }).catch((error) => {
        if (request !== playRequest || error.name === 'AbortError') return;
        if (video.error) return; // The error handler keeps the poster visible and advances.
        paused = true; // Autoplay can be blocked; offer a manual Play action.
        updateToggle();
      });
    };

    const selectVideo = (index) => {
      videos[activeIndex].pause();
      activeIndex = index;
      videos.forEach((video, videoIndex) => {
        video.classList.toggle('is-active', videoIndex === index);
        if (videoIndex === index && video.readyState > 0) video.currentTime = 0;
      });
      choices.forEach((choice, choiceIndex) => {
        choice.classList.toggle('is-active', choiceIndex === index);
        choice.setAttribute('aria-pressed', String(choiceIndex === index));
      });
      title.textContent = choices[index].dataset.videoTitle;
      syncPlayback();
    };

    videos.forEach((video, index) => {
      video.addEventListener('ended', () => {
        if (index === activeIndex && canPlay()) selectVideo((index + 1) % videos.length);
      });
      video.addEventListener('error', () => {
        video.dataset.failed = 'true';
        if (index === activeIndex) syncPlayback();
      });
    });
    choices.forEach((choice, index) => choice.addEventListener('click', () => selectVideo(index)));
    toggle.addEventListener('click', () => {
      paused = !paused;
      if (!paused && videos[activeIndex].ended) videos[activeIndex].currentTime = 0;
      updateToggle();
      syncPlayback();
    });
    document.addEventListener('visibilitychange', syncPlayback);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      }).observe(heroPlayer);
    }
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        paused = true;
        updateToggle();
        syncPlayback();
      }
    });
    updateToggle();
    syncPlayback();
  }

  const clientRibbon = document.querySelector('.client-strip');
  const clientToggle = document.querySelector('.client-scroll-toggle');
  if (clientRibbon && clientToggle) {
    const clientLogos = clientRibbon.querySelector('.client-logos');
    const ribbonMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateRibbonFocus = () => {
      if (ribbonMotion.matches) clientLogos.setAttribute('tabindex', '0');
      else clientLogos.removeAttribute('tabindex');
    };
    updateRibbonFocus();
    ribbonMotion.addEventListener('change', updateRibbonFocus);
    clientToggle.addEventListener('click', () => {
      const paused = clientRibbon.classList.toggle('is-paused');
      clientToggle.setAttribute('aria-pressed', String(paused));
      clientToggle.setAttribute('aria-label', paused ? 'Resume client logos' : 'Pause client logos');
      clientToggle.textContent = paused ? 'Resume' : 'Pause';
    });
  }

  const galleryItems = [...document.querySelectorAll('[data-gallery-item]')];
  const galleryModal = document.querySelector('.gallery-modal');

  if (galleryItems.length && galleryModal && typeof galleryModal.showModal === 'function') {
    const fullImage = galleryModal.querySelector('.gallery-full-image');
    const caption = galleryModal.querySelector('#gallery-caption');
    const count = galleryModal.querySelector('.gallery-count');
    const closeButton = galleryModal.querySelector('.gallery-close');
    let activeIndex = 0;
    let returnFocus = null;

    const showImage = (index) => {
      activeIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[activeIndex];
      const thumbnail = item.querySelector('img');
      fullImage.src = item.href;
      fullImage.alt = thumbnail.alt;
      caption.textContent = thumbnail.alt;
      count.textContent = `${activeIndex + 1} of ${galleryItems.length}`;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        returnFocus = item;
        showImage(index);
        galleryModal.showModal();
        document.body.classList.add('gallery-open');
        closeButton.focus();
      });
    });

    closeButton.addEventListener('click', () => galleryModal.close());
    galleryModal.querySelector('.gallery-previous').addEventListener('click', () => showImage(activeIndex - 1));
    galleryModal.querySelector('.gallery-next').addEventListener('click', () => showImage(activeIndex + 1));
    galleryModal.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const controls = [...galleryModal.querySelectorAll('button')];
        const firstControl = controls[0];
        const lastControl = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault();
          lastControl.focus();
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault();
          firstControl.focus();
        }
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showImage(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    galleryModal.addEventListener('click', (event) => {
      const bounds = galleryModal.getBoundingClientRect();
      if (event.target === galleryModal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
        galleryModal.close();
      }
    });
    galleryModal.addEventListener('close', () => {
      document.body.classList.remove('gallery-open');
      fullImage.removeAttribute('src');
      returnFocus?.focus({ preventScroll: true });
    });
  }

  if (document.body.classList.contains('home-page') && 'IntersectionObserver' in window) {
    const navLinks = document.querySelectorAll('.main-nav > a:not(.nav-cta)');
    const sections = [
      { id: 'about', element: document.querySelector('#about') },
      { id: 'services', element: document.querySelector('#services') },
      { id: 'work', element: document.querySelector('#work') },
      { id: 'contact', element: document.querySelector('#contact') }
    ];

    const updateActiveLink = (activeSection) => {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const isHome = href === 'index.html' || href === './index.html';
        const isCurrent = activeSection ? href.endsWith(`#${activeSection}`) : isHome;

        if (isCurrent) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      let activeSection = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection = entry.target.id;
        }
      });

      if (!activeSection) {
        const pageTop = window.scrollY;
        if (pageTop < 100) {
          activeSection = null;
        }
      }

      updateActiveLink(activeSection);
    }, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    updateActiveLink(null);
  }
})();
