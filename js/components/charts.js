/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/charts.js
   Komponen chart SVG (line chart dashboard, bar/donut chart statistik)
═══════════════════════════════════════════════ */

'use strict';

const Charts = (function () {

  /* ══════════════════════════════════════════
     CHART.JS GLOBAL DEFAULTS
     Dipanggil sekali saat modul di-init.
  ══════════════════════════════════════════ */

  function applyGlobalDefaults() {
    if (typeof Chart === 'undefined') {
      console.warn('[Charts] Chart.js belum dimuat.');
      return;
    }
    Chart.defaults.font.family          = "'DM Sans', system-ui, sans-serif";
    Chart.defaults.color                = '#5a7a68';
    Chart.defaults.plugins.legend.display = false;
  }

  /* ══════════════════════════════════════════
     SPARKLINE (mini line chart di stat-card)
  ══════════════════════════════════════════ */

  /**
   * Buat sparkline Chart.js di dalam canvas.
   *
   * @param {string}   canvasId - ID elemen canvas
   * @param {number[]} data     - Array data poin
   * @param {string}   color    - Warna garis dalam format 'rgb(r,g,b)'
   * @returns {Chart|null}
   */
  function makeSparkline(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    /* Buat gradient fill */
    const tempCtx = canvas.getContext('2d');
    const grad = tempCtx.createLinearGradient(0, 0, 0, 36);
    const rgba0 = color.replace('rgb(', 'rgba(').replace(')', ', 0.18)');
    const rgba1 = color.replace('rgb(', 'rgba(').replace(')', ', 0)');
    grad.addColorStop(0, rgba0);
    grad.addColorStop(1, rgba1);

    return new Chart(canvas, {
      type: 'line',
      data: {
        labels:   data.map((_, i) => i),
        datasets: [{
          data,
          borderColor:     color,
          borderWidth:     1.8,
          pointRadius:     0,
          tension:         0.45,
          fill:            true,
          backgroundColor: grad
        }]
      },
      options: {
        responsive:            true,
        maintainAspectRatio:   false,
        plugins: { tooltip: { enabled: false } },
        scales:  { x: { display: false }, y: { display: false } },
        animation: { duration: 1000 }
      }
    });
  }

  /* ══════════════════════════════════════════
     SPARKLINES PRESET (Statistik page)
  ══════════════════════════════════════════ */

  /**
   * Render semua sparkline default untuk halaman Statistik.
   * Mengasumsikan canvas dengan ID spark1–spark5 ada di DOM.
   */
  function renderStatSparklines() {
    makeSparkline('spark1', [8,11,9,14,12,18,16,22,19,25,21,28],                              'rgb(82,183,136)');
    makeSparkline('spark2', [1,1,2,1,2,2,1,2,2,1,2,2],                                        'rgb(116,198,157)');
    makeSparkline('spark3', [5,7,6,9,8,12,11,14,12,16,14,18],                                 'rgb(144,224,239)');
    makeSparkline('spark4', [5000,7000,6500,9000,8000,12000,11000,14000,12000,16000,14000,18000], 'rgb(233,196,106)');
    makeSparkline('spark5', [3,4,4,5,4,5,5,5,5,5,5,5],                                        'rgb(199,125,255)');
  }

  /* ══════════════════════════════════════════
     TREND CHART (Bar chart statistik)
  ══════════════════════════════════════════ */

  /** Data per periode untuk trend chart */
  const TREND_DATA = {
    weekly: {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      data:   [4.2, 6.8, 5.1, 8.4, 7.2, 9.6, 5.8]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      data:   [28, 34, 22, 40, 36, 45, 52, 48, 60, 55, 72, 124]
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024'],
      data:   [210, 380, 520, 780]
    }
  };

  let _trendChartInstance = null;

  /**
   * Buat atau update trend bar chart.
   *
   * @param {string} canvasId  - ID canvas element
   * @param {string} period    - 'weekly' | 'monthly' | 'yearly'
   * @returns {Chart|null}
   */
  function buildTrendChart(canvasId, period) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const { labels, data } = TREND_DATA[period] || TREND_DATA.monthly;
    const ctx = canvas.getContext('2d');

    /* Jika sudah ada instance, update data saja */
    if (_trendChartInstance) {
      _trendChartInstance.data.labels                = labels;
      _trendChartInstance.data.datasets[0].data      = data;
      _trendChartInstance.data.datasets[0].backgroundColor = _makeTrendBgFn(data);
      _trendChartInstance.update('active');
      return _trendChartInstance;
    }

    _trendChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label:           'Sampah (Kg)',
          data,
          backgroundColor: _makeTrendBgFn(data),
          borderRadius:    8,
          borderSkipped:   false,
          hoverBackgroundColor: 'rgba(45,106,79,0.80)'
        }]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.parsed.y} Kg` },
            backgroundColor: 'rgba(26,58,42,0.88)',
            padding:         { x: 12, y: 8 },
            cornerRadius:    10,
            titleFont:       { weight: '600' }
          }
        },
        scales: {
          x: {
            grid:   { display: false },
            border: { display: false },
            ticks:  { font: { size: 11 } }
          },
          y: {
            grid:   { color: 'rgba(82,183,136,0.08)' },
            border: { display: false, dash: [4, 4] },
            ticks:  { font: { size: 11 }, callback: v => v + ' Kg' },
            beginAtZero: true
          }
        },
        animation: { duration: 600, easing: 'easeInOutQuart' }
      }
    });

    return _trendChartInstance;
  }

  /** Buat fungsi backgroundColor yang mewarnai bar terakhir lebih gelap */
  function _makeTrendBgFn(data) {
    return function(ctx) {
      return ctx.dataIndex === data.length - 1
        ? 'rgba(45,106,79,0.85)'
        : 'rgba(82,183,136,0.55)';
    };
  }

  /**
   * Destroy instance trend chart (untuk cleanup saat page unload).
   */
  function destroyTrendChart() {
    if (_trendChartInstance) {
      _trendChartInstance.destroy();
      _trendChartInstance = null;
    }
  }

  /* ══════════════════════════════════════════
     DONUT CHART (Kategori sampah statistik)
  ══════════════════════════════════════════ */

  /** Data kategori sampah default */
  const CATEGORY_DATA = [
    { label: 'Nasi / Karbohidrat', value: 38, color: '#52b788' },
    { label: 'Sayuran',            value: 22, color: '#74c69d' },
    { label: 'Buah-buahan',        value: 15, color: '#40916c' },
    { label: 'Daging & Protein',   value: 12, color: '#2d6a4f' },
    { label: 'Roti / Kue',         value:  7, color: '#b7e4c7' },
    { label: 'Minuman',            value:  4, color: '#90e0ef' },
    { label: 'Lainnya',            value:  2, color: '#d8f3dc' }
  ];

  /**
   * Buat donut chart kategori sampah.
   *
   * @param {string} canvasId    - ID canvas element
   * @param {Array}  [data]      - Override CATEGORY_DATA jika diperlukan
   * @returns {{ chart: Chart, totalKg: number, categories: Array }}
   */
  function buildCategoryDonut(canvasId, data) {
    const categories = data || CATEGORY_DATA;
    const totalKg    = categories.reduce((s, c) => s + c.value, 0);
    const canvas     = document.getElementById(canvasId);
    if (!canvas) return null;

    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels:   categories.map(c => c.label),
        datasets: [{
          data:            categories.map(c => c.value),
          backgroundColor: categories.map(c => c.color),
          borderWidth:     2,
          borderColor:     '#fff',
          hoverOffset:     8
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` ${ctx.label}: ${ctx.parsed} Kg (${Math.round(ctx.parsed / totalKg * 100)}%)`
            },
            backgroundColor: 'rgba(26,58,42,0.88)',
            padding:         { x: 12, y: 8 },
            cornerRadius:    10
          }
        },
        animation: { animateRotate: true, duration: 900 }
      }
    });

    return { chart, totalKg, categories };
  }

  /**
   * Render legenda donut ke dalam elemen DOM.
   *
   * @param {string} legendElId   - ID elemen container legenda
   * @param {Array}  categories   - Array { label, value, color }
   * @param {number} totalKg      - Total kg untuk hitung persentase
   */
  function renderDonutLegend(legendElId, categories, totalKg) {
    const legendEl = document.getElementById(legendElId);
    if (!legendEl) return;

    legendEl.innerHTML = '';
    categories.forEach(c => {
      const pct  = Math.round(c.value / totalKg * 100);
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.setAttribute('role', 'listitem');
      item.innerHTML = `
        <span class="legend-dot" style="background:${c.color}" aria-hidden="true"></span>
        <span>${c.label}</span>
        <span class="legend-item__pct">${pct}%</span>`;
      legendEl.appendChild(item);
    });
  }

  /* ══════════════════════════════════════════
     ANIMATED COUNTER (stat-card values)
  ══════════════════════════════════════════ */

  /**
   * Jalankan animasi counter dari 0 ke target value.
   *
   * @param {HTMLElement} el - Elemen dengan data-count, data-prefix, data-suffix, data-format
   */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 1400;
    const start  = performance.now();

    function fmt(val) {
      return Math.round(val).toLocaleString('id-ID');
    }

    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const val      = target * ease;
      el.textContent = prefix + fmt(val) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target) + suffix;
    }

    requestAnimationFrame(tick);
  }

  /**
   * Setup IntersectionObserver untuk menjalankan counter
   * saat elemen masuk viewport.
   *
   * @param {string} selector - CSS selector untuk elemen counter (default '[data-count]')
   * @param {Element} [scope] - Root element pencarian (default document)
   */
  function initCounters(selector, scope) {
    const root = scope || document;
    const els  = root.querySelectorAll(selector || '[data-count]');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    els.forEach(el => obs.observe(el));
  }

  /* ── Public API ── */
  return {
    applyGlobalDefaults,
    makeSparkline,
    renderStatSparklines,
    buildTrendChart,
    destroyTrendChart,
    buildCategoryDonut,
    renderDonutLegend,
    animateCounter,
    initCounters,
    TREND_DATA,
    CATEGORY_DATA
  };

})();