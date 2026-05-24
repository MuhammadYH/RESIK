/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/reports.js
   Page controller halaman Statistik (reports).
   Mengorkestrasi StatsRenderer, Charts, Tables.
═══════════════════════════════════════════════ */

'use strict';

const ReportsPage = (function () {

  /* ── Internal state ── */
  let _inited          = false;
  let _activeRange     = 30;      /* Rentang hari aktif */
  let _tableController = null;    /* Referensi ke table controller */

  /* ══════════════════════════════════════════
     DATE RANGE HANDLER
  ══════════════════════════════════════════ */

  /**
   * Handler saat rentang tanggal berubah.
   * Dalam implementasi nyata: re-fetch data sesuai range.
   * @param {number} days
   */
  function _onRangeChange(days) {
    _activeRange = days;
    console.log('[ReportsPage] Range berubah ke', days, 'hari');

    /* Simulasi update nilai summary card berdasarkan range */
    _updateSummaryByRange(days);
  }

  /**
   * Simulasi update nilai stat cards berdasarkan rentang waktu.
   * Dalam implementasi nyata, ini akan memanggil API.
   * @param {number} days
   */
  function _updateSummaryByRange(days) {
    const multipliers = { 7: 0.25, 30: 1, 90: 2.8, 365: 11.5 };
    const m           = multipliers[days] || 1;

    /* Update counter values */
    const counterEls = document.querySelectorAll(
      '#page-statistik [data-count]'
    );
    counterEls.forEach(el => {
      const base = parseFloat(el.dataset.count);
      if (isNaN(base)) return;
      const newVal       = Math.round(base * m);
      el.dataset.count   = newVal;
      /* Re-animate */
      Charts.animateCounter(el);
    });
  }

  /* ══════════════════════════════════════════
     EXPORT HANDLER
  ══════════════════════════════════════════ */

  function _onExport() {
    Modals.alert(
      'Ekspor Laporan',
      `Fitur ekspor laporan untuk rentang <strong>${_activeRange} hari</strong> akan segera tersedia.<br/><br/>
       Format yang akan didukung: PDF, Excel (.xlsx), dan CSV.`
    );
  }

  /* ══════════════════════════════════════════
     KEYBOARD NAVIGATION — CHART TABS
  ══════════════════════════════════════════ */

  function _bindChartTabKeyboard() {
    const tabs = document.querySelectorAll(
      '#page-statistik .chart-tab[data-period]'
    );
    tabs.forEach((tab, index) => {
      tab.setAttribute('tabindex', '0');
      tab.addEventListener('keydown', e => {
        let targetIndex = -1;
        if (e.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
        if (e.key === 'ArrowLeft')  targetIndex = (index - 1 + tabs.length) % tabs.length;
        if (targetIndex !== -1) {
          e.preventDefault();
          tabs[targetIndex].focus();
          tabs[targetIndex].click();
        }
      });
    });
  }

  /* ══════════════════════════════════════════
     KEYBOARD NAVIGATION — DATE RANGE BUTTONS
  ══════════════════════════════════════════ */

  function _bindDateRangeKeyboard() {
    const btns = document.querySelectorAll(
      '#page-statistik .date-range__btn'
    );
    btns.forEach((btn, index) => {
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', e => {
        let targetIndex = -1;
        if (e.key === 'ArrowRight') targetIndex = (index + 1) % btns.length;
        if (e.key === 'ArrowLeft')  targetIndex = (index - 1 + btns.length) % btns.length;
        if (targetIndex !== -1) {
          e.preventDefault();
          btns[targetIndex].focus();
          btns[targetIndex].click();
        }
      });
    });
  }

  /* ══════════════════════════════════════════
     SECTION HEADING LINKS
  ══════════════════════════════════════════ */

  function _bindSectionLinks() {
    /* "Lihat semua" di activity feed */
    const actLink = document.querySelector(
      '#page-statistik .section-heading__link'
    );
    if (actLink) {
      actLink.addEventListener('click', e => {
        e.preventDefault();
        Modals.comingSoon('Riwayat Aktivitas Lengkap');
      });
      actLink.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          actLink.click();
        }
      });
    }
  }

  /* ══════════════════════════════════════════
     ENTRANCE ANIMATION
  ══════════════════════════════════════════ */

  function _triggerEntranceAnimations() {
    /* Re-trigger anim-in untuk elemen yang sudah selesai animasi */
    const animEls = document.querySelectorAll(
      '#page-statistik .anim-in'
    );
    animEls.forEach(el => {
      el.style.animation = 'none';
      requestAnimationFrame(() => {
        el.style.animation = '';
      });
    });
  }

  /* ══════════════════════════════════════════
     PUBLIC: INIT
  ══════════════════════════════════════════ */

  /**
   * Inisialisasi halaman statistik/reports.
   * Dipanggil oleh Router setiap kali halaman statistik diaktifkan.
   *
   * Render chart & table hanya pada kunjungan pertama (lazy init).
   * Kunjungan berikutnya hanya trigger animasi ulang.
   */
  function init() {
    if (!_inited) {
      /* Render semua komponen — hanya sekali */
      StatsRenderer.render();

      /* Override bind dengan handler kustom */
      StatsRenderer.bindDateRange(_onRangeChange);
      StatsRenderer.bindExportButton(_onExport);

      /* Event binding tambahan */
      _bindChartTabKeyboard();
      _bindDateRangeKeyboard();
      _bindSectionLinks();

      _inited = true;
      AppState.markPageInited('statistik');
      console.log('[ReportsPage] Halaman statistik diinisialisasi (pertama kali).');
    } else {
      /* Kunjungan berikutnya: hanya trigger animasi ulang */
      _triggerEntranceAnimations();
      console.log('[ReportsPage] Halaman statistik diaktifkan kembali.');
    }
  }

  /**
   * Kembalikan rentang waktu yang sedang aktif.
   * @returns {number}
   */
  function getActiveRange() {
    return _activeRange;
  }

  /**
   * Kembalikan table controller untuk akses eksternal.
   * @returns {Object|null}
   */
  function getTableController() {
    return _tableController;
  }

  /* ── Public API ── */
  return {
    init,
    getActiveRange,
    getTableController
  };

})();