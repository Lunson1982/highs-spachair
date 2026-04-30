/* ══════════════════════════════════════════════════
   HIGHS SPA CHAIRS — Shared JS
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── STICKY NAV SHADOW ── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── BACK TO TOP ── */
  const backToTop = document.getElementById('backToTop');
  const compareBar = document.getElementById('compareBar');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      backToTop.classList.toggle('visible', scrollY > 400);
      // Gold on CTA band and footer (dark backgrounds)
      const ctaBand = document.querySelector('.cta-band');
      const ctaTop = ctaBand ? ctaBand.offsetTop : docH;
      backToTop.classList.toggle('on-dark', scrollY + winH > ctaTop);
    }, { passive: true });
    backToTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // Keep compare bar above CTA band — scroll-based approach
  if (compareBar) {
    const ctaBand = document.querySelector('.cta-band');
    const compareBarStyle = compareBar.style;
    const defaultBottom = '1.5rem';
    const barHeight = compareBar.offsetHeight || 56;

    window.addEventListener('scroll', () => {
      if (!compareBar.classList.contains('visible')) return;
      if (!ctaBand) return;
      const ctaRect = ctaBand.getBoundingClientRect();
      const barSpace = barHeight + 16; // bar height + gap
      // When CTA band's top edge is within barSpace of viewport bottom, lift
      if (ctaRect.top <= window.innerHeight && ctaRect.top > 0) {
        compareBarStyle.setProperty('bottom', `${window.innerHeight - ctaRect.top + 16}px`);
      } else {
        compareBarStyle.setProperty('bottom', defaultBottom);
      }
    }, { passive: true });
  }

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu?.querySelectorAll('a');
  const mobileCta = mobileMenu?.querySelector('.btn');

  function openMenu() {
    hamburger?.classList.add('open');
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  const mobileClose = document.getElementById('mobileMenuClose');
  mobileClose?.addEventListener('click', closeMenu);

  mobileLinks?.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  mobileCta?.addEventListener('click', closeMenu);

  /* Close mobile menu when language is changed */
  document.addEventListener('lang-changed', () => { closeMenu(); });

  /* ── SCROLL ANIMATIONS ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ── PRODUCT GALLERY THUMBS ── */
  const mainImg = document.getElementById('galleryMain');
  const thumbs = document.querySelectorAll('.product-gallery__thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.querySelector('img')?.src;
      if (src && mainImg) {
        mainImg.src = src;
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      }
    });
  });

  /* ── CARD CLICK → DETAIL PAGE ── */
  document.querySelectorAll('.product-card[data-href]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', e => {
      // Let the Details link handle itself (it has onclick="event.stopPropagation()")
      if (e.target.closest('.product-card__link')) return;
      window.location.href = card.getAttribute('data-href');
    });
  });

  /* ── FILTER BUTTONS ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('[data-category]');
  const compareTable = document.getElementById('compareTable');
  if (compareTable) compareTable.dataset.filter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      const isCompareFilter = btn.closest('.compare-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (isCompareFilter) {
        if (compareTable) {
          compareTable.dataset.filter = filter;
          compareTable.classList.toggle('filtered', filter !== 'all');

          const headerCells = compareTable.querySelectorAll('thead th[data-cat]');
          const bodyRows    = compareTable.querySelectorAll('tbody tr');
          const allBodyCells = compareTable.querySelectorAll('tbody td[data-cat]');

          if (filter === 'all') {
            // Restore all
            headerCells.forEach(th => {
              th.style.visibility = '';
              th.style.width     = '';
              th.style.padding   = '';
            });
            allBodyCells.forEach(td => {
              td.style.visibility = '';
              td.style.width     = '';
            });
          } else {
            // For headers: use width:0 to shrink the column
            headerCells.forEach(th => {
              const cat = th.dataset.cat;
              if (cat === filter) {
                th.style.visibility = '';
                th.style.width     = '';
                th.style.padding   = '';
              } else {
                th.style.visibility = 'hidden';
                th.style.width     = '0';
                th.style.padding   = '0';
              }
            });
            // For body cells: same approach
            allBodyCells.forEach(td => {
              const cat = td.dataset.cat;
              if (cat === filter || cat === 'all') {
                td.style.visibility = '';
                td.style.width     = '';
              } else {
                td.style.visibility = 'hidden';
                td.style.width     = '0';
              }
            });
          }
        }
      } else {
        // Product grid filter
        productCards.forEach(card => {
          const cat = card.dataset.category;
          if (filter === 'all' || cat.split(' ').includes(filter)) {
            card.style.display = '';
            card.style.animation = 'fadeIn 300ms ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });

  /* ── COMPARE TABLE ROW HIGHLIGHT ── */
  const compareRows = document.querySelectorAll('.compare-table tbody tr');
  compareRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const idx = [...row.children].indexOf(row.querySelector('td:first-child'));
      document.querySelectorAll(`.compare-table td:nth-child(${idx + 1})`).forEach(cell => {
        cell.style.background = 'oklch(0.96 0.01 85)';
      });
    });
    row.addEventListener('mouseleave', () => {
      document.querySelectorAll('.compare-table td').forEach(cell => {
        cell.style.background = '';
      });
    });
  });

  /* ── FOOTER ACCORDION (MOBILE) ── */
  document.querySelectorAll('.footer__col-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.parentElement.classList.toggle('open');
    });
  });



  /* ── HERO CAROUSEL ── */
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel__slide');
    const dots   = carousel.querySelectorAll('.carousel__dot');
    const prevBtn = carousel.querySelector('.carousel__arrow--prev');
    const nextBtn = carousel.querySelector('.carousel__arrow--next');
    let current = 0;
    let timer;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function start() { timer = setInterval(next, +(carousel.dataset.speed || 5000)); }
    function stop()  { clearInterval(timer); }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        stop();
        goTo(parseInt(dot.dataset.slide));
        start();
      });
    });
    prevBtn?.addEventListener('click', () => { stop(); prev(); start(); });
    nextBtn?.addEventListener('click', () => { stop(); next(); start(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    // Touch swipe
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) { stop(); dx < 0 ? next() : prev(); start(); }
    }, { passive: true });

    start();
  }

  /* ── CAROUSEL LIGHTBOX ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  carousel?.querySelectorAll('.carousel__slide').forEach(slide => {
    slide.style.cursor = 'zoom-in';
    slide.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const bg = slide.style.backgroundImage;
      const url = bg.replace(/url\(['"]?(.+?)['"]?\)/, '$1');
      if (lightbox && lightboxImg) {
        lightboxImg.src = url;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightboxClose?.addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });

  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

});

/* ── COMPARE CARDS ── */
  const compareGrid = document.getElementById('compareGrid');
  const compareBar  = document.getElementById('compareBar');
  const compareBtn  = document.getElementById('compareBtn');
  const compareBarCount = document.getElementById('compareBarCount');
  const compareModal = document.getElementById('compareModal');
  const compareModalBody = document.getElementById('compareModalBody');
  const compareModalClose = document.getElementById('compareModalClose');
  const compareModalBackdrop = document.getElementById('compareModalBackdrop');

  const MODEL_DATA = {
    'lm9-limited': { name: 'LM9 Limited', cat: 'Flagship', price: '$5,390', msrp: 'US$5,390', img: 'LM9-Limited/newLM9-Limited.jpg' },
    'lm9':         { name: 'LM9',         cat: 'Flagship', price: '$5,390', msrp: 'US$5,390', img: 'LM9/LM9.jpg' },
    'hw9':         { name: 'HW9',         cat: 'Hair Wash', price: '$5,390', msrp: 'US$5,390', img: 'HW9/HW9 (1).jpg' },
    'w7':          { name: 'W7',          cat: 'Premium', price: '$4,390', msrp: 'US$4,390', img: 'W7/W7.jpg' },
    'hw8':         { name: 'HW8',         cat: 'Hair Wash', price: '$4,790', msrp: 'US$4,790', img: 'HW8/HW8-1.jpg' },
    'w8':          { name: 'W8',          cat: 'Popular', price: '$3,390', msrp: 'US$3,390', img: 'W8/W8 (1).jpg' },
    'ws8':         { name: 'WS8',         cat: 'Standard', price: '$3,390', msrp: 'US$3,390', img: 'WS8/WS8-1.jpg' },
    'nw8':         { name: 'NW8',         cat: 'Plumbing-Free', price: '$2,580', msrp: 'US$2,580', img: 'NW8/NW8 (6).jpg' },
    'z8':          { name: 'Z8',          cat: 'Plumbing-Free', price: '$2,580', msrp: 'US$2,580', img: 'Z8/Z8 (1).jpg' },
  };

  const FEATURES = [
    { label: 'Massage',            models: { 'lm9-limited': true, lm9: true, hw9: true, w7: true, hw8: false, w8: false, ws8: false, nw8: false, z8: false } },
    { label: 'Hair Wash Basin',    models: { 'lm9-limited': false, lm9: false, hw9: true, w7: false, hw8: true, w8: false, ws8: false, nw8: false, z8: false } },
    { label: 'Foot Basin Type',    models: { 'lm9-limited': 'Built-in', lm9: 'Built-in', hw9: 'Built-in', w7: 'Separate', hw8: 'Built-in', w8: 'Built-in', ws8: 'Built-in', nw8: 'Built-in', z8: 'Detachable' } },
    { label: 'Hand Basin',         models: { 'lm9-limited': 'Built-in', lm9: 'Built-in', hw9: 'Built-in', w7: 'Built-in', hw8: 'Built-in', w8: 'Built-in', ws8: 'Built-in', nw8: 'Detachable', z8: 'Detachable' } },
    { label: 'Drainage System',    models: { 'lm9-limited': 'Auto', lm9: 'Auto', hw9: 'Auto', w7: 'Auto', hw8: 'Manual', w8: 'Manual', ws8: 'Manual', nw8: 'Manual', z8: 'Manual' } },
    { label: 'Magnetic Jet System', models: { 'lm9-limited': true, lm9: true, hw9: true, w7: false, hw8: true, w8: true, ws8: false, nw8: false, z8: false } },
    { label: 'USB + Type-C Socket',models: { 'lm9-limited': true, lm9: true, hw9: true, w7: true, hw8: true, w8: true, ws8: true, nw8: true, z8: true } },
    { label: 'Plumbing-Free',       models: { 'lm9-limited': false, lm9: false, hw9: false, w7: false, hw8: false, w8: false, ws8: false, nw8: true, z8: true } },
    { label: 'Custom Colour',       models: { 'lm9-limited': '2 matching colours', lm9: '1 colour', hw9: '1 colour', w7: '1 colour', hw8: '1 colour', w8: '1 colour', ws8: '1 colour', nw8: '1 colour', z8: '1 colour' } },
    { label: 'Carton Volume',      models: { 'lm9-limited': '1.44 m³', lm9: '1.44 m³', hw9: '1.44 m³', w7: '1.40 m³', hw8: '1.54 m³', w8: '1.44 m³', ws8: '1.54 m³', nw8: '1.44 m³', z8: '1.11 m³' } },
    { label: 'Gross Weight',        models: { 'lm9-limited': '145 kg', lm9: '145 kg', hw9: '141 kg', w7: '95 kg', hw8: '160 kg', w8: '137 kg', ws8: '160 kg', nw8: '127 kg', z8: '102.5 kg' } },
    { label: '40\' HC Load',        models: { 'lm9-limited': '44 pcs', lm9: '44 pcs', hw9: '44 pcs', w7: '36 sets', hw8: '22 pcs', w8: '44 pcs', ws8: '22 pcs', nw8: '44 pcs', z8: '44 pcs' } },
    { label: 'Pedicure Stool',      models: { 'lm9-limited': true, lm9: true, hw9: true, w7: true, hw8: true, w8: true, ws8: true, nw8: true, z8: true } },
  ];

  function getSelectedModels() {
    return Array.from(compareGrid.querySelectorAll('.compare-card__checkbox:checked')).map(cb => cb.closest('.compare-card').dataset.model);
  }

  function updateCompareBar() {
    const selected = getSelectedModels();
    const count = selected.length;
    const lang = (typeof Lang !== 'undefined' && Lang.current) ? Lang.current : 'en';
    const t = (key) => (typeof translations !== 'undefined' && translations[lang]?.[key]) || translations?.en?.[key] || key;
    if (compareBar) compareBar.classList.toggle('visible', count > 0);
    if (compareBarCount) compareBarCount.textContent = count === 2 ? t('comp_2_selected') : count === 3 ? t('comp_3_selected') : t('comp_models_selected').replace('{n}', count);
    if (compareBtn) {
      compareBtn.disabled = count < 2;
      compareBtn.textContent = count < 2 ? t('comp_select_more').replace('{n}', 2 - count) : count === 2 ? t('comp_compare_2') : count === 3 ? t('comp_compare_3') : t('comp_compare_btn').replace('{n}', count);
    }
  }

  compareGrid?.querySelectorAll('.compare-card__checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      // Max 3 selections — uncheck oldest if selecting a 4th
      const checked = Array.from(compareGrid.querySelectorAll('.compare-card__checkbox:checked'));
      if (checked.length > 3) {
        checked[0].checked = false;
      }
      updateCompareBar();
    });
  });

  function buildModalTable(models) {
    let html = '<table class="compare-modal-table"><thead><tr><th>Feature</th>';
    models.forEach(m => {
      const d = MODEL_DATA[m];
      const img = `media/${MODEL_DATA[m].img}`
      html += `<th>
        <img src="${img}" alt="${d.name}" loading="lazy" onerror="this.src='https://placehold.co/80x60/f7f3ed/1c2b4a?text=${d.name}'">
        <span class="model-name">${d.name}</span>
        <span class="model-price">${d.msrp}</span>
        <a href="product.html?model=${m}" class="btn btn-primary" style="margin-top:0.4rem;display:inline-block;">Details</a>
      </th>`;
    });
    html += '</tr></thead><tbody>';
    FEATURES.forEach((feat, i) => {
      html += `<tr${i % 2 === 0 ? '' : ' style="background:var(--cream)"'}>\n<td>${feat.label}</td>`;
      models.forEach(m => {
        const val = feat.models[m];
        if (val === true)  html += `<td><span class="check">✓</span></td>`;
        else if (val === false) html += `<td><span class="dash">—</span></td>`;
        else html += `<td>${val}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  function openCompareModal() {
    const selected = getSelectedModels();
    if (!compareModal || !compareModalBody || selected.length < 2) return;
    compareModalBody.innerHTML = buildModalTable(selected);
    compareModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCompareModal() {
    compareModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Compare All button — opens modal with all 9 models
  document.getElementById('compareAllBtn')?.addEventListener('click', () => {
    const allModels = Object.keys(MODEL_DATA);
    compareModalBody.innerHTML = buildModalTable(allModels);
    compareModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  compareBtn?.addEventListener('click', openCompareModal);
  compareModalClose?.addEventListener('click', closeCompareModal);
  compareModalBackdrop?.addEventListener('click', closeCompareModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCompareModal(); });

/* ── KEYFRAMES ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

`;
document.head.appendChild(style);
