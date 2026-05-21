/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/reports.js
   Page controller halaman Statistik/Laporan.
═══════════════════════════════════════════════ */

'use strict';

const ReportsPage = (() => {

  let inited = false;

  /**
   * Init halaman statistik.
   * Dipanggil sekali saat halaman pertama kali dibuka.
   */
  function init() {
    if (inited) return;
    inited = true;
    StatsRenderer.render();
  }

  return { init };

})();