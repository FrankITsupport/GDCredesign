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

  const clientRibbon = document.querySelector('.client-strip');
  const clientToggle = document.querySelector('.client-scroll-toggle');
  if (clientRibbon && clientToggle) {
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
})();
