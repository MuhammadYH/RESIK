/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/app.js
   Bootstrap: inisialisasi app, urutan init modul,
   dispatch halaman default saat DOMContentLoaded.
═══════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Apply Chart.js global defaults (jika ada) */
  if (typeof Charts !== 'undefined') {
    Charts.applyChartDefaults();
  }

  /* 2. Render navbar (top + dock) */
  if (typeof NavbarRenderer !== 'undefined') {
    NavbarRenderer.init();
  }

  /* 3. Init router (pasang listener resik:navigate) */
  if (typeof Router !== 'undefined') {
    Router.init();
  }

  /* 4. Set halaman default & tampilkan */
  const defaultPage = 'dashboard';

  // Sembunyikan semua page dulu, lalu tampilkan dashboard
  document.querySelectorAll('.resik-page, .page-section').forEach(function (el) {
    el.classList.remove('page-active');
  });
  AppState.setPage(defaultPage);

  const defaultEl = document.getElementById('page-' + defaultPage);
  if (defaultEl) defaultEl.classList.add('page-active');

  /* 5. Sync navbar active state */
  if (typeof NavbarRenderer !== 'undefined') {
    NavbarRenderer.setNavActive(defaultPage);
  }

  /* 6. Init halaman dashboard */
  if (typeof DashboardPage !== 'undefined') {
    DashboardPage.init();
  }

  /*
   * CATATAN: Sengaja TIDAK dispatch 'resik:navigate' untuk halaman awal.
   * Router.navigateTo() punya guard: if (page === current) return;
   * Jika di-dispatch setelah AppState.setPage('dashboard'), guard langsung
   * memblokir → show/hide logic tidak jalan → halaman lain stuck visible.
   */

});