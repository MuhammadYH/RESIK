/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/app.js
   Bootstrap: inisialisasi app, import modul,
   init pertama kali. Entry point utama SPA.

   Urutan init yang dijamin:
   1. DOMContentLoaded
   2. Charts.applyGlobalDefaults()
   3. NavbarRenderer.initNavbar()
   4. Router.init(controllers)
   5. Dispatch resik:navigate → 'dashboard'
═══════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════
   APP BOOTSTRAP
   Semua logika init dibungkus dalam IIFE agar
   tidak mencemari global scope.
══════════════════════════════════════════════ */

(function ResikApp() {

  /* ──────────────────────────────────────────
     DEPENDENCY CHECK
     Pastikan semua modul wajib sudah ter-load
     sebelum bootstrap dijalankan.
  ────────────────────────────────────────── */

  const REQUIRED_MODULES = [
    'AppState',
    'NavigationConfig',
    'NavbarRenderer',
    'Router',
    'Cards',
    'Charts',
    'Modals',
    'Tables',
    'DashboardRenderer',
    'StatsRenderer',
    'DashboardPage',
    'ReportsPage',
    'ManagementPage',
    'MarketplacePage',
    'NotificationsPage'
  ];

  function _checkDependencies() {
    const missing = REQUIRED_MODULES.filter(mod => typeof window[mod] === 'undefined');
    if (missing.length > 0) {
      console.error('[ResikApp] Modul berikut belum ter-load:', missing.join(', '));
      return false;
    }
    return true;
  }

  /* ──────────────────────────────────────────
     PLACEHOLDER PAGE INIT
     Halaman tanpa controller khusus
     (notifikasi, search, profil) mendapatkan
     controller placeholder generik.
  ────────────────────────────────────────── */

  function _makePlaceholderController(pageId) {
    return {
      init() {
        const page = document.getElementById('page-' + pageId);
        if (!page) return;

        /* Jika sudah ada konten, skip */
        if (page.querySelector('[data-placeholder-rendered]')) return;

        /* Konfigurasi tampilan per halaman */
        const config = {
          notifikasi: { emoji: '🔔', label: 'Notifikasi',  sub: 'Segera hadir' },
          search:     { emoji: '🔍', label: 'Pencarian',   sub: 'Segera hadir' },
          profil:     { emoji: '👤', label: 'Profil',      sub: 'Segera hadir' }
        };

        const cfg = config[pageId] || {
          emoji: '🚧',
          label: pageId.charAt(0).toUpperCase() + pageId.slice(1),
          sub:   'Segera hadir'
        };

        const inner = document.createElement('div');
        inner.setAttribute('data-placeholder-rendered', 'true');
        inner.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          flex-direction: column;
          gap: 10px;
          opacity: .45;
        `;
        inner.innerHTML = `
          <div style="font-size:32px">${cfg.emoji}</div>
          <div style="font-size:15px;font-weight:600;color:var(--eco-dark)">${cfg.label}</div>
          <div style="font-size:13px;color:var(--eco-mid)">${cfg.sub}</div>`;

        page.appendChild(inner);

        AppState.markPageInited(pageId);
        console.log('[ResikApp] Placeholder halaman dirender:', pageId);
      }
    };
  }

  /* ──────────────────────────────────────────
     GLOBAL ERROR HANDLER
     Tangkap error tak terduga agar app tidak
     crash sepenuhnya.
  ────────────────────────────────────────── */

  function _bindGlobalErrorHandler() {
    window.addEventListener('error', (e) => {
      console.error('[ResikApp] Uncaught error:', e.message, 'di', e.filename, 'baris', e.lineno);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('[ResikApp] Unhandled promise rejection:', e.reason);
    });
  }

  /* ──────────────────────────────────────────
     CUSTOM EVENT LISTENERS (global hooks)
     Tangkap event dari modul lain untuk
     logging / analytics / future use.
  ────────────────────────────────────────── */

  function _bindGlobalEvents() {
    /* Log semua navigasi */
    document.addEventListener('resik:navigate', (e) => {
      console.log('[ResikApp] Navigate event diterima:', e.detail?.page);
    });

    /* Log aksi waste management */
    document.addEventListener('rw:action', (e) => {
      console.log('[ResikApp] Waste action:', e.detail?.action);
    });

    /* Log marketplace ready */
    document.addEventListener('resik:marketplace-ready', (e) => {
      console.log('[ResikApp] Marketplace ready, produk:', e.detail?.products?.length);
    });

    /* Log profile click */
    document.addEventListener('resik:profile-click', () => {
      console.log('[ResikApp] Profile button diklik');
    });
  }

  /* ──────────────────────────────────────────
     INITIAL PAGE DARI URL HASH
     Cek apakah URL memiliki hash yang valid.
  ────────────────────────────────────────── */

  function _getInitialPage() {
    const validPages = NavigationConfig.pages;
    const hash       = window.location.hash.replace('#', '').trim().toLowerCase();
    if (hash && validPages.includes(hash)) {
      console.log('[ResikApp] Halaman awal dari hash URL:', hash);
      return hash;
    }
    return 'dashboard';
  }

  /* ──────────────────────────────────────────
     MAIN INIT
  ────────────────────────────────────────── */

  function _init() {

    console.log('[ResikApp] 🌿 RESIK Dashboard — Bootstrap dimulai...');

    /* 0. Dependency check */
    if (!_checkDependencies()) {
      console.error('[ResikApp] Bootstrap dibatalkan karena modul hilang.');
      return;
    }

    /* 1. Global error handler */
    _bindGlobalErrorHandler();

    /* 2. Apply Chart.js global defaults */
    Charts.applyGlobalDefaults();

    /* 3. Inisialisasi navbar
          - Render top nav + bottom dock dari NavigationConfig
          - Bind semua event listener nav */
    NavbarRenderer.initNavbar();

    /* 4. Daftarkan semua page controller ke router */
    const controllers = {
      dashboard:  DashboardPage,
      sampah:     ManagementPage,
      statistik:  ReportsPage,
      marketplace: MarketplacePage,
      notifikasi: NotificationsPage,
      search:     _makePlaceholderController('search'),
      profil:     _makePlaceholderController('profil')
    };

    /* 5. Inisialisasi router dengan semua controller */
    Router.init(controllers);

    /* 6. Bind global custom events */
    _bindGlobalEvents();

    /* 7. Tentukan halaman awal */
    const initialPage = _getInitialPage();

    /* 8. Dispatch resik:navigate ke halaman awal
          Router akan menangkap event ini dan
          menginisialisasi halaman pertama. */
    document.dispatchEvent(
      new CustomEvent('resik:navigate', {
        detail:  { page: initialPage },
        bubbles: true
      })
    );

    console.log(`[ResikApp] ✅ Bootstrap selesai. Halaman awal: "${initialPage}"`);
  }

  /* ──────────────────────────────────────────
     ENTRY POINT
     Tunggu DOM selesai sebelum bootstrap.
  ────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    /* DOM sudah siap (script dimuat dengan defer atau di akhir body) */
    _init();
  }

})();