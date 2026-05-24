// admin-laporan.js — Laporan page logic
'use strict';

const AdminLaporan = (() => {

  // ── DATA ──
  const KINERJA_LOKASI = [
    { icon: '🌿', name: 'Pondok Pesantren Darul Ulum',  sampah: '680',       pengiriman: '68', nilai: '4.620.000', emisi: '~54' },
    { icon: '🌿', name: 'Pondok Pesantren Al Hikmah',   sampah: '350',       pengiriman: '42', nilai: '2.240.000', emisi: '~28' },
    { icon: '🌿', name: 'Pondok Pesantren Nurul Huda',  sampah: '210',       pengiriman: '28', nilai: '1.260.000', emisi: '~16' },
    { icon: '🌿', name: 'Pondok Pesantren Al Falah',    sampah: '96',        pengiriman: '19', nilai: '672.000',   emisi: '~8'  },
    { icon: '🌿', name: 'Pondok Pesantren Al Amin',     sampah: '–',         pengiriman: '–',  nilai: '–',         emisi: '–'   },
  ];

  const DONUT_DATA = [
    { label: 'Sisa Makanan',    pct: 52, val: '645 kg', color: '#2E7D32' },
    { label: 'Sayuran & Buah',  pct: 28, val: '347 kg', color: '#F57C00' },
    { label: 'Daun & Ranting',  pct: 12, val: '149 kg', color: '#FDD835' },
    { label: 'Lainnya',         pct: 8,  val: '99 kg',  color: '#90A4AE'  },
  ];

  // Daily bar chart data (31 days May)
  const BAR_DATA_HARIAN = [
    180,210,195,240,220,270,260,300,285,310,295,330,315,
    280,350,340,320,380,360,400,385,420,410,390,440,430,
    460,450,480,470,490
  ];
  const BAR_LABELS_HARIAN = (() => {
    const labels = [];
    for (let i = 1; i <= 31; i++) labels.push(i % 5 === 1 ? `${i} Mei` : '');
    return labels;
  })();

  const BAR_DATA_MINGGUAN  = [980, 1420, 1680, 1920, 1240];
  const BAR_LABELS_MINGGUAN = ['M1', 'M2', 'M3', 'M4', 'M5'];

  const BAR_DATA_BULANAN  = [3200, 4100, 3800, 5200, 4800, 5600];
  const BAR_LABELS_BULANAN = ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

  // Line chart trend data
  const TREND_DATA_MINGGUAN  = [30, 27, 22, 38, 34, 42, 40, 48];
  const TREND_LABELS_MINGGUAN = ['1 Mei','6 Mei','11 Mei','16 Mei','21 Mei','26 Mei','31 Mei',''];
  const TREND_DATA_HARIAN = [18,22,20,28,24,30,26,32,29,35];
  const TREND_LABELS_HARIAN = ['1','4','7','10','13','16','19','22','25','28'];

  // ── SPARKLINES ──
  function drawSparkline(svgId, data, color) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const W = 80, H = 30;
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    svg.innerHTML = `
      <polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${pts[pts.length-1].split(',')[0]}" cy="${pts[pts.length-1].split(',')[1]}" r="3" fill="${color}"/>
    `;
  }

  // ── BAR CHART (pure canvas) ──
  let barCanvas, barCtx;
  let currentBarData  = BAR_DATA_HARIAN;
  let currentBarLabels = BAR_LABELS_HARIAN;

  function drawBarChart(data, labels) {
    barCanvas = document.getElementById('chart-volume');
    if (!barCanvas) return;
    barCtx = barCanvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const W = barCanvas.offsetWidth || barCanvas.parentElement.offsetWidth || 600;
    const H = 160;
    barCanvas.width  = W * dpr;
    barCanvas.height = H * dpr;
    barCanvas.style.width  = W + 'px';
    barCanvas.style.height = H + 'px';
    barCtx.scale(dpr, dpr);

    const padL = 42, padR = 12, padT = 10, padB = 28;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    barCtx.clearRect(0, 0, W, H);

    const maxVal = Math.max(...data);
    const steps = 5;

    // Grid lines + Y labels
    barCtx.strokeStyle = '#E8EAED';
    barCtx.lineWidth = 1;
    barCtx.fillStyle = '#9CA3AF';
    barCtx.font = '10px Plus Jakarta Sans, sans-serif';
    barCtx.textAlign = 'right';
    for (let i = 0; i <= steps; i++) {
      const y = padT + chartH - (i / steps) * chartH;
      barCtx.beginPath();
      barCtx.moveTo(padL, y);
      barCtx.lineTo(padL + chartW, y);
      barCtx.stroke();
      barCtx.fillText(Math.round((maxVal / steps) * i), padL - 6, y + 3.5);
    }

    // Bars
    const barW = Math.max(3, (chartW / data.length) - 2);
    const gap  = (chartW - barW * data.length) / (data.length + 1);

    data.forEach((v, i) => {
      const barH = (v / maxVal) * chartH;
      const x = padL + gap + i * (barW + gap);
      const y = padT + chartH - barH;

      // Green gradient fill
      const grad = barCtx.createLinearGradient(0, y, 0, padT + chartH);
      grad.addColorStop(0, '#388E3C');
      grad.addColorStop(1, '#81C784');
      barCtx.fillStyle = grad;
      barCtx.beginPath();
      if (barCtx.roundRect) {
        barCtx.roundRect(x, y, barW, barH, [2, 2, 0, 0]);
      } else {
        barCtx.rect(x, y, barW, barH);
      }
      barCtx.fill();

      // X label
      if (labels[i]) {
        barCtx.fillStyle = '#9CA3AF';
        barCtx.font = '9px Plus Jakarta Sans, sans-serif';
        barCtx.textAlign = 'center';
        barCtx.fillText(labels[i], x + barW / 2, padT + chartH + 16);
      }
    });
  }

  // ── LINE CHART (pure canvas) ──
  function drawLineChart(data, labels) {
    const canvas = document.getElementById('chart-trend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || canvas.parentElement.offsetWidth || 400;
    const H = 180;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const padL = 38, padR = 12, padT = 12, padB = 28;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    const maxVal = Math.max(...data) * 1.15;
    const steps = 6;

    // Grid + Y labels
    ctx.strokeStyle = '#E8EAED';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= steps; i++) {
      const y = padT + chartH - (i / steps) * chartH;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
      ctx.fillText(Math.round((maxVal / steps) * i), padL - 5, y + 3.5);
    }

    // Points
    const pts = data.map((v, i) => ({
      x: padL + (i / (data.length - 1)) * chartW,
      y: padT + chartH - (v / maxVal) * chartH,
    }));

    // Fill area
    const areaGrad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    areaGrad.addColorStop(0, 'rgba(46,125,50,0.18)');
    areaGrad.addColorStop(1, 'rgba(46,125,50,0.0)');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, padT + chartH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, padT + chartH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Dots
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2E7D32';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

    // X labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '9px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((lbl, i) => {
      if (!lbl) return;
      ctx.fillText(lbl, pts[i].x, padT + chartH + 16);
    });
  }

  // ── DONUT CHART ──
  function drawDonut() {
    const canvas = document.getElementById('chart-donut');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 180;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = 72, inner = 46;
    let startAngle = -Math.PI / 2;

    DONUT_DATA.forEach(seg => {
      const angle = (seg.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      startAngle += angle;
    });

    // Inner circle cutout
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Build legend
    const legend = document.getElementById('donut-legend');
    if (legend) {
      legend.innerHTML = DONUT_DATA.map(seg => `
        <div class="donut-legend-item">
          <span class="donut-legend-dot" style="background:${seg.color};"></span>
          <span class="donut-legend-label">${seg.label}<br><span style="font-size:11px;color:#9CA3AF;">${seg.pct}% (${seg.val})</span></span>
        </div>
      `).join('');
    }
  }

  // ── TABLE ──
  function renderTable() {
    const tbody = document.getElementById('kinerja-tbody');
    if (!tbody) return;
    tbody.innerHTML = KINERJA_LOKASI.map(row => `
      <tr>
        <td>
          <div class="lokasi-cell">
            <div class="lokasi-cell-icon">${row.icon}</div>
            <span class="lokasi-name-text">${row.name}</span>
          </div>
        </td>
        <td style="font-weight:600;">${row.sampah}</td>
        <td>${row.pengiriman}</td>
        <td>${row.nilai}</td>
        <td>${row.emisi}</td>
      </tr>
    `).join('');
  }

  // ── COUNTER ANIMATION ──
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const duration = 900;
      const start    = performance.now();
      function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Number.isInteger(target)
          ? Math.round(target * e).toLocaleString('id') + suffix
          : (target * e).toFixed(2) + suffix;
        if (p < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ── CHART PERIOD CONTROLS ──
  function initChartControls() {
    document.getElementById('chart-period')?.addEventListener('change', (e) => {
      switch (e.target.value) {
        case 'mingguan':
          currentBarData   = BAR_DATA_MINGGUAN;
          currentBarLabels = BAR_LABELS_MINGGUAN;
          break;
        case 'bulanan':
          currentBarData   = BAR_DATA_BULANAN;
          currentBarLabels = BAR_LABELS_BULANAN;
          break;
        default:
          currentBarData   = BAR_DATA_HARIAN;
          currentBarLabels = BAR_LABELS_HARIAN;
      }
      drawBarChart(currentBarData, currentBarLabels);
    });

    document.getElementById('trend-period')?.addEventListener('change', (e) => {
      if (e.target.value === 'harian') {
        drawLineChart(TREND_DATA_HARIAN, TREND_LABELS_HARIAN);
      } else {
        drawLineChart(TREND_DATA_MINGGUAN, TREND_LABELS_MINGGUAN);
      }
    });
  }

  // ── EXPORT ──
  function initExport() {
    document.getElementById('btn-export')?.addEventListener('click', () => {
      alert('Fitur export akan tersedia segera.');
    });
  }

  // ── RESIZE ──
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawBarChart(currentBarData, currentBarLabels);
      drawLineChart(TREND_DATA_MINGGUAN, TREND_LABELS_MINGGUAN);
    }, 150);
  }

  // ── INIT ──
  function init() {
    renderTable();
    animateCounters();
    initChartControls();
    initExport();

    // Charts need layout to settle first
    requestAnimationFrame(() => {
      drawBarChart(currentBarData, currentBarLabels);
      drawLineChart(TREND_DATA_MINGGUAN, TREND_LABELS_MINGGUAN);
      drawDonut();

      // Sparklines
      drawSparkline('spark-sampah',    [820,950,880,1050,980,1120,1080,1240], '#2E7D32');
      drawSparkline('spark-emisi',     [60,72,68,80,76,88,85,98],             '#2E7D32');
      drawSparkline('spark-pengiriman',[220,260,248,290,278,315,305,352],     '#1565C0');
      drawSparkline('spark-nilai',     [5.2,6.1,5.8,6.8,6.5,7.4,7.8,8.4],   '#F57C00');
    });

    window.addEventListener('resize', onResize);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AdminLaporan.init());
