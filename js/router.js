/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/router.js
   SPA router: listen event resik:navigate,
   show/hide section halaman, panggil page init.
═══════════════════════════════════════════════ */

'use strict';

const Router = (() => {

  const PAGES = ['dashboard', 'sampah', 'statistik', 'notifikasi', 'search', 'profil'];

  /* ── Navigasi ke halaman tertentu ── */
  function navigateTo(page) {
    const current = AppState.getPage();
    if (page === current) return;
    if (!PAGES.includes(page)) return;

    /* Sembunyikan halaman aktif */
    const currentEl = document.getElementById('page-' + current);
    if (currentEl) currentEl.classList.remove('page-active');

    /* Tampilkan halaman baru */
    const nextEl = document.getElementById('page-' + page);
    if (nextEl) {
      nextEl.classList.add('page-active', 'page-enter');
      nextEl.addEventListener('animationend', () => nextEl.classList.remove('page-enter'), { once: true });
    }

    /* Update state */
    AppState.setPage(page);

    /* Scroll ke atas */
    window.scrollTo({ top: 0, behavior: 'smooth' });

    /* Panggil page init */
    _initPage(page);
  }

  /* ── Lazy-init per halaman ── */
  function _initPage(page) {
    switch (page) {
      case 'dashboard':
        if (typeof DashboardPage !== 'undefined') DashboardPage.init();
        break;
      case 'sampah':
        if (typeof ManagementPage !== 'undefined') ManagementPage.init();
        break;
      case 'statistik':
        if (typeof ReportsPage !== 'undefined') ReportsPage.init();
        break;
      case 'notifikasi':
      case 'search':
      case 'profil':
        // Placeholder halaman — tidak ada init khusus
        break;
    }
  }

  /**
   * Inisialisasi router.
   * Listen event custom `resik:navigate`.
   */
  function init() {
    document.addEventListener('resik:navigate', (e) => {
      const page = e.detail?.page;
      if (!page) return;

      // Update navbar active state
      if (typeof NavbarRenderer !== 'undefined') {
        NavbarRenderer.setNavActive(page);
      }

      navigateTo(page);
    });
  }

  return { init, navigateTo };

})();