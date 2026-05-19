/**
 * RESIK Dashboard — Navbar JS
 * Mengelola state navigasi untuk:
 * - Top navbar (desktop & tablet)
 * - Bottom dock (mobile)
 * Versi: 1.0
 */

(function () {
  'use strict';

  /* ─────────────────────────────────
     STATE
  ───────────────────────────────── */
  let activePage = 'dashboard';

  /* ─────────────────────────────────
     ELEMENT REFERENCES
  ───────────────────────────────── */
  const topItems  = document.querySelectorAll('.rn-item');
  const dockItems = document.querySelectorAll('.dock-item');

  /* ─────────────────────────────────
     NAV STATE UPDATER
  ───────────────────────────────── */

  /**
   * Mengubah halaman aktif secara sinkron
   * antara top navbar dan bottom dock.
   * @param {string} page - data-page value
   */
  function setActive(page) {
    activePage = page;

    /* Update top navbar */
    topItems.forEach(item => {
      const isActive = item.dataset.page === page;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    /* Update bottom dock */
    dockItems.forEach(item => {
      const isActive = item.dataset.page === page;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    /* Dispatch custom event — mudah dihook oleh router nanti */
    document.dispatchEvent(new CustomEvent('resik:navigate', {
      detail: { page }
    }));
  }

  /* ─────────────────────────────────
     EVENT LISTENERS — TOP NAVBAR
  ───────────────────────────────── */
  topItems.forEach(item => {
    item.addEventListener('click', () => {
      setActive(item.dataset.page);
    });

    /* Keyboard: Enter atau Space untuk aktivasi */
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(item.dataset.page);
      }
    });
  });

  /* ─────────────────────────────────
     EVENT LISTENERS — BOTTOM DOCK
  ───────────────────────────────── */
  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      setActive(item.dataset.page);
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(item.dataset.page);
      }
    });
  });

  /* ─────────────────────────────────
     PROFILE BUTTON
  ───────────────────────────────── */
  const profileBtn = document.querySelector('.rn-profile');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      /* Placeholder: buka dropdown profil */
      console.log('[RESIK] Profile menu dibuka');
    });

    profileBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        profileBtn.click();
      }
    });
  }

  /* ─────────────────────────────────
     SCROLL BEHAVIOR — top navbar
     Tambahkan shadow saat page di-scroll
  ───────────────────────────────── */
  const header = document.querySelector('.rn-header');
  if (header) {
    let scrolled = false;
    window.addEventListener('scroll', () => {
      const shouldScroll = window.scrollY > 8;
      if (shouldScroll !== scrolled) {
        scrolled = shouldScroll;
        header.style.paddingTop = scrolled ? '8px' : '14px';
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────
     RESIZE HANDLER
     Sinkronisasi state antara top dan dock
     saat breakpoint berubah
  ───────────────────────────────── */
  const MOBILE_BP = 700;
  let wasMobile = window.innerWidth < MOBILE_BP;

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < MOBILE_BP;
    if (isMobile !== wasMobile) {
      wasMobile = isMobile;
      setActive(activePage); /* Sinkronkan ulang state aktif */
    }
  }, { passive: true });

  /* ─────────────────────────────────
     NAVIGATION EVENT LISTENER
     Hook untuk SPA router nanti
  ───────────────────────────────── */
  document.addEventListener('resik:navigate', e => {
    const { page } = e.detail;
    const main = document.getElementById('main-content');
    if (main) {
      /* Placeholder untuk konten per halaman */
      /* Di masa depan: ganti dengan router component loader */
      console.log('[RESIK] Navigasi ke halaman:', page);
    }
  });

  /* ─────────────────────────────────
     INIT — pastikan state awal sinkron
  ───────────────────────────────── */
  setActive(activePage);

})();
