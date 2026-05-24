/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/router.js
   SPA Router:
   - Listen event custom `resik:navigate`
   - Sembunyikan semua section page
   - Tampilkan section yang sesuai
   - Panggil page init function yang relevan
═══════════════════════════════════════════════ */

'use strict';

const Router = (function () {

  /* ══════════════════════════════════════════
     CONSTANTS
  ══════════════════════════════════════════ */

  /**
   * Map halaman ke page controller yang bertanggung jawab.
   * Key   : ID halaman (tanpa prefix "page-")
   * Value : Object dengan method init() dan opsional destroy()
   *
   * Diisi saat init() dipanggil agar semua modul sudah ter-load.
   */
  let PAGE_CONTROLLERS = {};

  /**
   * Semua ID section halaman yang dikelola router.
   * Harus cocok dengan NavigationConfig.pages.
   */
  const ALL_PAGES = ['dashboard', 'sampah', 'statistik', 'marketplace', 'notifikasi', 'search', 'profil'];

  /* ══════════════════════════════════════════
     INTERNAL STATE
  ══════════════════════════════════════════ */

  let _currentPage = null;

  /* ══════════════════════════════════════════
     PAGE TRANSITION
  ══════════════════════════════════════════ */

  /**
   * Sembunyikan semua section halaman.
   * Menghapus class page-active dari semua .resik-page.
   */
  function _hideAll() {
    ALL_PAGES.forEach(pageId => {
      const el = document.getElementById('page-' + pageId);
      if (el) {
        el.classList.remove('page-active', 'page-enter');
      }
    });
  }

  /**
   * Tampilkan section halaman tertentu dengan animasi.
   * @param {string} pageId - ID halaman (tanpa prefix "page-")
   */
  function _showPage(pageId) {
    const el = document.getElementById('page-' + pageId);
    if (!el) {
      console.warn('[Router] Section tidak ditemukan: #page-' + pageId);
      return false;
    }

    el.classList.add('page-active', 'page-enter');

    /* Hapus class page-enter setelah animasi selesai */
    el.addEventListener('animationend', () => {
      el.classList.remove('page-enter');
    }, { once: true });

    return true;
  }

  /**
   * Scroll ke atas saat berpindah halaman.
   */
  function _scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ══════════════════════════════════════════
     PAGE INIT DISPATCHER
  ══════════════════════════════════════════ */

  /**
   * Panggil method init() dari page controller yang sesuai.
   * Jika controller tidak ada, tampilkan log saja.
   * @param {string} pageId
   */
  function _initPage(pageId) {
    const controller = PAGE_CONTROLLERS[pageId];

    if (controller && typeof controller.init === 'function') {
      try {
        controller.init();
      } catch (err) {
        console.error(`[Router] Error saat init halaman "${pageId}":`, err);
      }
    } else {
      /* Halaman tanpa controller (notifikasi, search, profil) */
      console.log(`[Router] Halaman "${pageId}" tidak memiliki controller terdaftar.`);
    }
  }

  /**
   * Panggil method destroy() dari page controller halaman sebelumnya.
   * Berguna untuk membersihkan interval, listener, dll.
   * @param {string} pageId
   */
  function _destroyPage(pageId) {
    if (!pageId) return;
    const controller = PAGE_CONTROLLERS[pageId];
    if (controller && typeof controller.destroy === 'function') {
      try {
        controller.destroy();
      } catch (err) {
        console.error(`[Router] Error saat destroy halaman "${pageId}":`, err);
      }
    }
  }

  /* ══════════════════════════════════════════
     NAVIGATE
  ══════════════════════════════════════════ */

  /**
   * Navigasi ke halaman tertentu.
   * Ini adalah fungsi inti router.
   *
   * Alur:
   * 1. Validasi page ID
   * 2. Cek apakah sudah di halaman yang sama
   * 3. Destroy halaman sebelumnya
   * 4. Hide semua section
   * 5. Show section baru
   * 6. Update AppState
   * 7. Update navbar active state
   * 8. Scroll to top
   * 9. Init halaman baru
   *
   * @param {string} page - ID halaman tujuan
   */
  function navigateTo(page) {
    /* 1. Validasi */
    if (!ALL_PAGES.includes(page)) {
      console.warn('[Router] Halaman tidak dikenali:', page);
      return;
    }

    /* 2. Skip jika sudah di halaman yang sama */
    if (page === _currentPage) {
      console.log('[Router] Sudah di halaman:', page);
      return;
    }

    const previousPage = _currentPage;

    /* 3. Destroy halaman sebelumnya */
    _destroyPage(previousPage);

    /* 4. Hide semua section */
    _hideAll();

    /* 5. Show section baru */
    const shown = _showPage(page);
    if (!shown) return;

    /* 6. Update internal state & AppState */
    _currentPage = page;
    AppState.setPage(page);

    /* 7. Update navbar active state */
    NavbarRenderer.setActive(page);

    /* 8. Scroll to top */
    _scrollToTop();

    /* 9. Init halaman baru */
    _initPage(page);

    console.log(`[Router] Navigasi: ${previousPage || 'start'} → ${page}`);
  }

  /* ══════════════════════════════════════════
     EVENT LISTENER
  ══════════════════════════════════════════ */

  /**
   * Listen event custom `resik:navigate`.
   * Event detail harus mengandung { page: string }.
   *
   * Semua navigasi SPA harus melalui event ini,
   * bukan memanggil navigateTo() secara langsung.
   */
  function _bindNavigateEvent() {
    document.addEventListener('resik:navigate', (e) => {
      const page = e.detail?.page;
      if (!page) {
        console.warn('[Router] resik:navigate diterima tanpa detail.page');
        return;
      }
      navigateTo(page);
    });
  }

  /**
   * Listen event browser popstate (back/forward button).
   * Sementara hanya log — bisa dikembangkan untuk
   * mendukung URL hash routing.
   */
  function _bindPopState() {
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page;
      if (page && ALL_PAGES.includes(page)) {
        navigateTo(page);
      }
    });
  }

  /* ══════════════════════════════════════════
     PUSH STATE (opsional — hash routing)
  ══════════════════════════════════════════ */

  /**
   * Update browser URL hash saat berpindah halaman.
   * Opsional — aktifkan jika ingin deep linking.
   * @param {string} page
   */
  function _pushState(page) {
    /* Uncomment untuk mengaktifkan hash routing:
    const hash = page === 'dashboard' ? '#' : '#' + page;
    history.pushState({ page }, '', hash);
    */
  }

  /**
   * Baca halaman awal dari URL hash (jika ada).
   * @returns {string|null}
   */
  function _readHashPage() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && ALL_PAGES.includes(hash)) return hash;
    return null;
  }

  /* ══════════════════════════════════════════
     REGISTER CONTROLLERS
  ══════════════════════════════════════════ */

  /**
   * Daftarkan page controller.
   * Dipanggil dari app.js setelah semua modul di-load.
   *
   * @param {string} pageId     - ID halaman
   * @param {Object} controller - Object dengan method init() [dan opsional destroy()]
   */
  function registerController(pageId, controller) {
    if (!ALL_PAGES.includes(pageId)) {
      console.warn('[Router] registerController: pageId tidak dikenali:', pageId);
      return;
    }
    PAGE_CONTROLLERS[pageId] = controller;
    console.log('[Router] Controller terdaftar untuk halaman:', pageId);
  }

  /* ══════════════════════════════════════════
     PUBLIC: INIT
  ══════════════════════════════════════════ */

  /**
   * Inisialisasi router.
   * Dipanggil dari app.js setelah semua modul ter-load.
   *
   * @param {Object} [controllers] - Map pageId → controller
   *   Contoh: { dashboard: DashboardPage, sampah: ManagementPage, ... }
   */
  function init(controllers) {
    /* Daftarkan semua controller sekaligus */
    if (controllers && typeof controllers === 'object') {
      Object.entries(controllers).forEach(([pageId, controller]) => {
        registerController(pageId, controller);
      });
    }

    /* Bind events */
    _bindNavigateEvent();
    _bindPopState();

    console.log('[Router] Router berhasil diinisialisasi.');
  }

  /**
   * Kembalikan halaman yang sedang aktif.
   * @returns {string|null}
   */
  function getCurrentPage() {
    return _currentPage;
  }

  /**
   * Kembalikan semua halaman yang terdaftar.
   * @returns {string[]}
   */
  function getPages() {
    return [...ALL_PAGES];
  }

  /* ── Public API ── */
  return {
    init,
    navigateTo,
    registerController,
    getCurrentPage,
    getPages,
    /* Expose untuk NavbarRenderer & modul lain */
    navigate: navigateTo
  };

})();