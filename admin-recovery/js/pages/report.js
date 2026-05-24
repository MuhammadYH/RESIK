/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/report.js
   Bridge file: memastikan ReportsPage tersedia
   saat di-load dari admin.html sebelum reports.js.

   Catatan:
   - File utama controller ada di js/pages/reports.js
   - File ini di-load oleh admin.html (baris 1038)
   - Jika reports.js sudah ter-load lebih dulu,
     file ini tidak melakukan apa-apa (safe guard).
   - Jika belum, file ini mendefinisikan stub
     ReportsPage sementara agar dependency check
     di app.js tidak gagal.
═══════════════════════════════════════════════ */

'use strict';

/* Jika reports.js sudah ter-load, ReportsPage sudah ada — skip. */
if (typeof window.ReportsPage === 'undefined') {

  /* ── Stub sementara ──
     Akan di-override jika reports.js dimuat setelahnya.
     Dalam kondisi normal, admin.html memuat report.js
     sebelum app.js sehingga stub ini aktif sampai
     reports.js juga di-load. */
  window.ReportsPage = (function () {

    let _delegated = false;

    function _getDelegate() {
      /* Coba ambil implementasi asli dari reports.js */
      return (typeof ReportsPage !== 'undefined' && ReportsPage._real)
        ? ReportsPage._real
        : null;
    }

    function init() {
      /* Jika ada StatsRenderer, jalankan langsung */
      if (typeof StatsRenderer !== 'undefined' && typeof StatsRenderer.render === 'function') {
        StatsRenderer.render();
        if (typeof AppState !== 'undefined') AppState.markPageInited('statistik');
        console.log('[ReportsPage/stub] Statistik dirender via StatsRenderer.');
      } else {
        console.warn('[ReportsPage/stub] StatsRenderer belum tersedia.');
      }
    }

    function getActiveRange() { return 30; }
    function getTableController() { return null; }

    return { init, getActiveRange, getTableController };

  })();

  console.log('[report.js] ReportsPage stub didaftarkan (reports.js belum ter-load).');
}
