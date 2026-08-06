document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.createElement('div');
  overlay.className = 'flyer-lightbox';
  overlay.innerHTML = `
    <button class="flyer-lightbox-close" aria-label="Close">&times;</button>
    <button class="flyer-lightbox-prev" aria-label="Previous">&#8249;</button>
    <img class="flyer-lightbox-img" src="" alt="" />
    <button class="flyer-lightbox-next" aria-label="Next">&#8250;</button>
    <div class="flyer-lightbox-counter"></div>
  `;
  document.body.appendChild(overlay);

  const lightboxImg = overlay.querySelector('.flyer-lightbox-img');
  const closeBtn   = overlay.querySelector('.flyer-lightbox-close');
  const prevBtn    = overlay.querySelector('.flyer-lightbox-prev');
  const nextBtn    = overlay.querySelector('.flyer-lightbox-next');
  const counter    = overlay.querySelector('.flyer-lightbox-counter');

  let gallery = null;
  let currentIndex = 0;

  function show(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
  }

  function openSingle(src, alt) {
    gallery = null;
    show(src, alt);
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    counter.hidden = true;
    activate();
  }

  function openGallery(photos, index) {
    gallery = photos;
    currentIndex = index;
    updateNav();
    activate();
  }

  function activate() {
    overlay.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function updateNav() {
    show(gallery[currentIndex].src, gallery[currentIndex].alt);
    const multi = gallery.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
    counter.hidden = !multi;
    if (multi) counter.textContent = `${currentIndex + 1} / ${gallery.length}`;
  }

  function close() {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  function parseGallery(photosStr, altsStr) {
    const srcs = photosStr.split('|');
    const alts = (altsStr || '').split('|');
    return srcs.map((src, i) => ({ src: src.trim(), alt: alts[i] || '' }));
  }

  // Single flyer thumbnails and standalone lightbox images
  document.querySelectorAll('.event-flyer-thumb img, .lightbox-single').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openSingle(img.src, img.alt));
  });

  // Standalone gallery-trigger buttons (e.g. "See Photos")
  document.querySelectorAll('.gallery-trigger').forEach(btn => {
    const photos = parseGallery(btn.dataset.photos, btn.dataset.alts);
    btn.addEventListener('click', () => openGallery(photos, 0));
  });

  // Photo strips: parent has data-gallery-container; children have data-gallery-index
  document.querySelectorAll('[data-gallery-container]').forEach(container => {
    const photos = parseGallery(container.dataset.photos, container.dataset.alts);
    container.querySelectorAll('[data-gallery-index]').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const idx = parseInt(img.dataset.galleryIndex, 10);
        openGallery(photos, idx);
      });
    });
  });

  // Navigation
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!gallery) return;
    currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    updateNav();
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!gallery) return;
    currentIndex = (currentIndex + 1) % gallery.length;
    updateNav();
  });

  // Close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
});
