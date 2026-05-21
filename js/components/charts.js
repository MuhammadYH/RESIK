/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/charts.js
   Komponen chart: SVG line/area chart dashboard,
   Chart.js bar chart & donut chart statistik,
   sparklines.
═══════════════════════════════════════════════ */

'use strict';

const Charts = (() => {

  /* ── Chart.js global defaults (dipanggil sekali) ── */
  function applyChartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family            = "'DM Sans', system-ui, sans-serif";
    Chart.defaults.color                  = '#5a7a68';
    Chart.defaults.plugins.legend.display = false;
  }

  /* ────────────────────────────────────
     SPARKLINE (mini line chart, statistik)
  ──────────────────────────────────── */
  function makeSparkline(id, data, color) {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById(id);
    if (!canvas) return;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          borderWidth: 1.8,
          pointRadius: 0,
          tension: 0.45,
          fill: true,
          backgroundColor: (ctx) => {
            const grad = ctx.chart.ctx.createLinearGradient(0, 0, 0, 36);
            grad.addColorStop(0, color.replace(')', ', 0.18)').replace('rgb', 'rgba'));
            grad.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
            return grad;
          },
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins:  { tooltip: { enabled: false } },
        scales:   { x: { display: false }, y: { display: false } },
        animation:{ duration: 1000 }
      }
    });
  }

  function renderAllSparklines() {
    makeSparkline('spark1', [8,11,9,14,12,18,16,22,19,25,21,28],                                   'rgb(82,183,136)');
    makeSparkline('spark2', [1,1,2,1,2,2,1,2,2,1,2,2],                                             'rgb(116,198,157)');
    makeSparkline('spark3', [5,7,6,9,8,12,11,14,12,16,14,18],                                      'rgb(144,224,239)');
    makeSparkline('spark4', [5000,7000,6500,9000,8000,12000,11000,14000,12000,16000,14000,18000],   'rgb(233,196,106)');
    makeSparkline('spark5', [3,4,4,5,4,5,5,5,5,5,5,5],                                             'rgb(199,125,255)');
  }

  /* ────────────────────────────────────
     TREND CHART (bar, statistik)
  ──────────────────────────────────── */
  const TREND_DATA = {
    weekly: {
      labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
      data:   [4.2, 6.8, 5.1, 8.4, 7.2, 9.6, 5.8]
    },
    monthly: {
      labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
      data:   [28, 34, 22, 40, 36, 45, 52, 48, 60, 55, 72, 124]
    },
    yearly: {
      labels: ['2021','2022','2023','2024'],
      data:   [210, 380, 520, 780]
    }
  };

  let trendChartInstance = null;

  function buildTrendChart(period) {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;

    const { labels, data } = TREND_DATA[period];
    const ctx = canvas.getContext('2d');

    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sampah (Kg)',
          data,
          backgroundColor: (ctx) => {
            const idx   = ctx.dataIndex;
            const total = data.length - 1;
            return idx === total
              ? 'rgba(45,106,79,0.85)'
              : 'rgba(82,183,136,0.55)';
          },
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: 'rgba(45,106,79,0.80)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.parsed.y} Kg` },
            backgroundColor: 'rgba(26,58,42,0.88)',
            padding: { x: 12, y: 8 },
            cornerRadius: 10,
            titleFont: { weight: '600' }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(82,183,136,0.08)' },
            border: { display: false, dash: [4, 4] },
            ticks: { font: { size: 11 }, callback: v => v + ' Kg' },
            beginAtZero: true
          }
        },
        animation: { duration: 600, easing: 'easeInOutQuart' }
      }
    };

    if (trendChartInstance) {
      trendChartInstance.data.labels              = labels;
      trendChartInstance.data.datasets[0].data    = data;
      trendChartInstance.update('active');
    } else {
      trendChartInstance = new Chart(ctx, config);
    }
  }

  function destroyTrendChart() {
    if (trendChartInstance) {
      trendChartInstance.destroy();
      trendChartInstance = null;
    }
  }

  /* ────────────────────────────────────
     CATEGORY DONUT (statistik)
  ──────────────────────────────────── */
  const CATEGORIES = [
    { label: 'Nasi / Karbohidrat', value: 38, color: '#52b788' },
    { label: 'Sayuran',            value: 22, color: '#74c69d' },
    { label: 'Buah-buahan',        value: 15, color: '#40916c' },
    { label: 'Daging & Protein',   value: 12, color: '#2d6a4f' },
    { label: 'Roti / Kue',         value:  7, color: '#b7e4c7' },
    { label: 'Minuman',            value:  4, color: '#90e0ef' },
    { label: 'Lainnya',            value:  2, color: '#d8f3dc' },
  ];

  function buildCategoryChart() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    const totalKg = CATEGORIES.reduce((s, c) => s + c.value, 0);

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels:   CATEGORIES.map(c => c.label),
        datasets: [{
          data:            CATEGORIES.map(c => c.value),
          backgroundColor: CATEGORIES.map(c => c.color),
          borderWidth:     2,
          borderColor:     '#fff',
          hoverOffset:     8,
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} Kg (${Math.round(ctx.parsed / totalKg * 100)}%)`
            },
            backgroundColor: 'rgba(26,58,42,0.88)',
            padding: { x: 12, y: 8 },
            cornerRadius: 10,
          }
        },
        animation: { animateRotate: true, duration: 900 }
      }
    });

    /* Build legend */
    const legendEl = document.getElementById('donutLegend');
    if (!legendEl) return;
    legendEl.innerHTML = '';
    CATEGORIES.forEach(c => {
      const pct  = Math.round(c.value / totalKg * 100);
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.setAttribute('role', 'listitem');
      item.innerHTML = `
        <span class="legend-dot" style="background:${c.color}" aria-hidden="true"></span>
        <span>${c.label}</span>
        <span class="legend-item__pct">${pct}%</span>
      `;
      legendEl.appendChild(item);
    });
  }

  /* ────────────────────────────────────
     DASHBOARD SVG CHART
     (sudah di-render statis di HTML,
      fungsi ini untuk animasi bar fills)
  ──────────────────────────────────── */
  function animateDashboardBars() {
    document.querySelectorAll('.metric-bar-fill').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = target; }, 400);
    });
  }

  return {
    applyChartDefaults,
    makeSparkline,
    renderAllSparklines,
    buildTrendChart,
    destroyTrendChart,
    buildCategoryChart,
    animateDashboardBars,
    TREND_DATA,
    CATEGORIES,
  };

})();