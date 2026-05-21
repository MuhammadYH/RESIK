/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/renderers/stats.js
   Render konten halaman statistik
   (stat cards, charts, activity feed, eco cards, table)
═══════════════════════════════════════════════ */

'use strict';

const StatsRenderer = (function () {

  /* ══════════════════════════════════════════
     ACTIVITY FEED DATA
  ══════════════════════════════════════════ */

  const ACTIVITY_DATA = [
    {
      type:  'pickup',
      icon:  'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
      title: 'Penjemputan Selesai',
      sub:   'Pak Rudi Processor — 18 Kg Nasi & Sayuran',
      time:  '2j lalu'
    },
    {
      type:  'submit',
      icon:  'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
      title: 'Sampah Dikirim',
      sub:   'Kategori: Nasi + Sayuran — 18 Kg',
      time:  '2j lalu'
    },
    {
      type:  'accept',
      icon:  'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
      title: 'Processor Menerima Permintaan',
      sub:   'CV. Hijau Lestari menerima pickup Anda',
      time:  '1h lalu'
    },
    {
      type:  'reward',
      icon:  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      title: 'Reward Ditambahkan',
      sub:   '+Rp 12.000 dari pengiriman 15 Okt',
      time:  '3h lalu'
    },
    {
      type:  'submit',
      icon:  'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
      title: 'Sampah Dikirim',
      sub:   'Kategori: Buah-buahan — 9 Kg',
      time:  'Kemarin'
    }
  ];

  /* ══════════════════════════════════════════
     RENDER ACTIVITY FEED
  ══════════════════════════════════════════ */

  /**
   * Render activity feed ke dalam #activityFeed.
   * @param {Array} [data] - Override ACTIVITY_DATA
   */
  function renderActivityFeed(data) {
    const feedEl = document.getElementById('activityFeed');
    if (!feedEl) return;

    const items = data || ACTIVITY_DATA;
    feedEl.innerHTML = '';

    items.forEach(a => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.setAttribute('role', 'article');
      item.innerHTML = `
        <div class="activity-item__icon act--${a.type}" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="${a.icon}"/>
          </svg>
        </div>
        <div class="activity-item__body">
          <div class="activity-item__title">${a.title}</div>
          <div class="activity-item__sub">${a.sub}</div>
        </div>
        <div class="activity-item__time" aria-label="Waktu: ${a.time}">${a.time}</div>`;
      feedEl.appendChild(item);
    });
  }

  /* ══════════════════════════════════════════
     RENDER TREND CHART
  ══════════════════════════════════════════ */

  /**
   * Render trend chart dengan periode default 'monthly'.
   * Bind event pada tab buttons.
   *
   * @param {string} [defaultPeriod='monthly']
   */
  function renderTrendChart(defaultPeriod) {
    const period = defaultPeriod || 'monthly';

    /* Render chart */
    Charts.buildTrendChart('trendChart', period);

    /* Bind tab buttons */
    document.querySelectorAll('.chart-tab[data-period]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab[data-period]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        Charts.buildTrendChart('trendChart', btn.dataset.period);
      });
    });
  }

  /* ══════════════════════════════════════════
     RENDER DONUT CHART
  ══════════════════════════════════════════ */

  /**
   * Render donut chart kategori sampah + legenda.
   */
  function renderCategoryChart() {
    const result = Charts.buildCategoryDonut('categoryChart');
    if (!result) return;
    Charts.renderDonutLegend('donutLegend', result.categories, result.totalKg);
  }

  /* ══════════════════════════════════════════
     RENDER SPARKLINES
  ══════════════════════════════════════════ */

  /**
   * Render semua sparkline di stat cards.
   */
  function renderSparklines() {
    Charts.renderStatSparklines();
  }

  /* ══════════════════════════════════════════
     RENDER COUNTER ANIMATIONS
  ══════════════════════════════════════════ */

  /**
   * Setup counter animations untuk semua [data-count] di halaman statistik.
   */
  function renderCounters() {
    const scope = document.getElementById('page-statistik');
    if (!scope) return;
    Charts.initCounters('[data-count]', scope);
  }

  /* ══════════════════════════════════════════
     RENDER TABLE
  ══════════════════════════════════════════ */

  /**
   * Inisialisasi tabel riwayat pickup dengan search & filter.
   * @returns {Object|null} Table controller dari Tables.initPickupHistoryTable
   */
  function renderPickupTable() {
    return Tables.initPickupHistoryTable({
      tbodyId:  'historyTableBody',
      emptyId:  'tableEmpty',
      searchId: 'tableSearch',
      filterId: 'statusFilter'
    });
  }

  /* ══════════════════════════════════════════
     BIND DATE RANGE BUTTONS
  ══════════════════════════════════════════ */

  /**
   * Pasang event listener pada tombol date range.
   * @param {Function} [onRangeChange] - Callback(days: number)
   */
  function bindDateRange(onRangeChange) {
    document.querySelectorAll('.date-range__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-range__btn')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const days = parseInt(btn.dataset.range, 10);
        if (onRangeChange) onRangeChange(days);
        console.log('[StatsRenderer] Rentang waktu dipilih:', days, 'hari');
      });
    });
  }

  /* ══════════════════════════════════════════
     BIND EXPORT BUTTON
  ══════════════════════════════════════════ */

  /**
   * Pasang event listener pada tombol ekspor.
   * @param {Function} [onExport] - Callback saat diklik
   */
  function bindExportButton(onExport) {
    const btn = document.querySelector('#page-statistik .btn-export');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (onExport) {
        onExport();
      } else {
        Modals.alert(
          'Ekspor Laporan',
          'Fitur ekspor akan segera tersedia. Terima kasih atas kesabaran Anda!'
        );
      }
    });
  }

  /* ══════════════════════════════════════════
     FULL RENDER
  ══════════════════════════════════════════ */

  /**
   * Render semua komponen halaman statistik sekaligus.
   * Dipanggil oleh ReportsPage.init() saat pertama kali halaman dibuka.
   */
  function render() {
    /* Pastikan Chart.js global defaults sudah di-apply */
    Charts.applyGlobalDefaults();

    renderCounters();
    renderSparklines();
    renderTrendChart('monthly');
    renderCategoryChart();
    renderActivityFeed();
    renderPickupTable();
    bindDateRange();
    bindExportButton();
  }

  /* ── Public API ── */
  return {
    render,
    renderActivityFeed,
    renderTrendChart,
    renderCategoryChart,
    renderSparklines,
    renderCounters,
    renderPickupTable,
    bindDateRange,
    bindExportButton,
    ACTIVITY_DATA
  };

})();