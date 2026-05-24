// admin-laporan.js — Laporan page logic
'use strict';

const AdminLaporan = (() => {

  // ── DATA ──
  const LEAF_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;

  const KINERJA_LOKASI = [
    { icon: LEAF_ICON, name: 'Pondok Pesantren Darul Ulum',  sampah: '680',       pengiriman: '68', nilai: '4.620.000', emisi: '~54' },
    { icon: LEAF_ICON, name: 'Pondok Pesantren Al Hikmah',   sampah: '350',       pengiriman: '42', nilai: '2.240.000', emisi: '~28' },
    { icon: LEAF_ICON, name: 'Pondok Pesantren Nurul Huda',  sampah: '210',       pengiriman: '28', nilai: '1.260.000', emisi: '~16' },
    { icon: LEAF_ICON, name: 'Pondok Pesantren Al Falah',    sampah: '96',        pengiriman: '19', nilai: '672.000',   emisi: '~8'  },
    { icon: LEAF_ICON, name: 'Pondok Pesantren Al Amin',     sampah: '–',         pengiriman: '–',  nilai: '–',         emisi: '–'   },
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

  // ── SPARKLINES DATA — 15 titik realistis per kartu ──
  // Setiap array merepresentasikan data 15 hari terakhir
  const SPARK_SAMPAH     = [820,870,845,910,890,955,930,980,1010,1050,1020,1100,1080,1150,1240];
  const SPARK_EMISI      = [60,65,63,70,68,74,72,78,76,82,80,87,85,92,98];
  const SPARK_PENGIRIMAN = [220,235,228,250,244,262,258,278,271,290,283,305,298,326,352];
  const SPARK_NILAI      = [5.2,5.5,5.3,5.8,5.6,6.1,5.9,6.4,6.2,6.8,6.5,7.2,7.0,7.8,8.4];

  // ── SPARKLINE RENDERER — Catmull-Rom spline (smooth, mengikuti data) ──
  function drawSparkline(svgId, data, color) {
    const svg = document.getElementById(svgId);
    if (!svg) return;

    // Gunakan koordinat viewBox langsung (80x30) — tidak perlu DOM size
    const VW = 80, VH = 30, PX = 4, PY = 4;
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;

    const pts = data.map((v, i) => ({
      x: PX + (i / (data.length - 1)) * (VW - PX * 2),
      y: PY + (1 - (v - min) / range) * (VH - PY * 2),
    }));

    // Catmull-Rom ke cubic bezier (tension = 0.4)
    function catmullToBezier(pts, tension) {
      const t = tension || 0.4;
      let d = 'M ' + f(pts[0].x) + ',' + f(pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(i + 2, pts.length - 1)];
        const cp1x = p1.x + (p2.x - p0.x) * t;
        const cp1y = p1.y + (p2.y - p0.y) * t;
        const cp2x = p2.x - (p3.x - p1.x) * t;
        const cp2y = p2.y - (p3.y - p1.y) * t;
        d += ' C ' + f(cp1x) + ',' + f(cp1y)
           + ' ' + f(cp2x) + ',' + f(cp2y)
           + ' ' + f(p2.x) + ',' + f(p2.y);
      }
      return d;
    }
    function f(n) { return n.toFixed(2); }

    const pathD = catmullToBezier(pts);
    const last  = pts[pts.length - 1];
    const first = pts[0];
    const areaD = pathD
      + ' L ' + f(last.x)  + ',' + VH
      + ' L ' + f(first.x) + ',' + VH + ' Z';
    const gid = 'sg_' + svgId;

    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.25"/>' +
          '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="' + areaD + '" fill="url(#' + gid + ')" stroke="none"/>' +
      '<path d="' + pathD + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + f(last.x) + '" cy="' + f(last.y) + '" r="2.5" fill="' + color + '"/>' +
      '<circle cx="' + f(last.x) + '" cy="' + f(last.y) + '" r="1.3" fill="#fff"/>';
  }

  // ── BAR CHART (pure canvas) ──
  let barCanvas, barCtx;
  let currentBarData  = BAR_DATA_HARIAN;
  let currentBarLabels = BAR_LABELS_HARIAN;
  let currentTrendData   = TREND_DATA_MINGGUAN;
  let currentTrendLabels = TREND_LABELS_MINGGUAN;

  function drawBarChart(data, labels) {
    barCanvas = document.getElementById('chart-volume');
    if (!barCanvas) return;
    barCtx = barCanvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    // Walk up to find the first ancestor with a real rendered width
    let container = barCanvas.parentElement;
    while (container && container.offsetWidth === 0) container = container.parentElement;
    const W = (container ? container.clientWidth : 600) - 0; // no extra padding deduction; padding handled by chart padL/padR
    // Height: proportional to width — aim for ~40% aspect ratio, clamped
    const H = Math.max(160, Math.min(220, Math.round(W * 0.36)));
    barCanvas.width  = W * dpr;
    barCanvas.height = H * dpr;
    barCanvas.style.width  = W + 'px';
    barCanvas.style.height = H + 'px';
    barCtx.scale(dpr, dpr);

    const padL = 46, padR = 16, padT = 12, padB = 32;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    barCtx.clearRect(0, 0, W, H);

    const maxVal = Math.max(...data);
    // Round ceiling up to a nice number
    const niceMax = Math.ceil(maxVal / 100) * 100;
    const steps = 5;

    // Grid lines + Y labels
    barCtx.strokeStyle = '#F0F2F5';
    barCtx.lineWidth = 1;
    barCtx.fillStyle = '#9CA3AF';
    barCtx.font = `${W < 400 ? 9 : 10}px Plus Jakarta Sans, sans-serif`;
    barCtx.textAlign = 'right';
    for (let i = 0; i <= steps; i++) {
      const y = padT + chartH - (i / steps) * chartH;
      barCtx.beginPath();
      barCtx.moveTo(padL, y);
      barCtx.lineTo(padL + chartW, y);
      barCtx.stroke();
      const val = Math.round((niceMax / steps) * i);
      barCtx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val, padL - 6, y + 3.5);
    }

    // Bars — auto-size: thinner for many bars (daily=31), wider for few (weekly/monthly)
    const totalBars = data.length;
    const minGap = totalBars > 15 ? 1.5 : 3;
    const maxBarW = totalBars > 15 ? 12 : 28;
    const barW = Math.min(maxBarW, Math.max(3, (chartW / totalBars) - minGap));
    const totalUsed = (barW + minGap) * totalBars - minGap;
    const offsetX = (chartW - totalUsed) / 2;

    data.forEach((v, i) => {
      const barH = (v / niceMax) * chartH;
      const x = padL + offsetX + i * (barW + minGap);
      const y = padT + chartH - barH;

      // Green gradient fill
      const grad = barCtx.createLinearGradient(0, y, 0, padT + chartH);
      grad.addColorStop(0, '#388E3C');
      grad.addColorStop(1, '#81C784');
      barCtx.fillStyle = grad;
      barCtx.beginPath();
      if (barCtx.roundRect) {
        barCtx.roundRect(x, y, barW, barH, [Math.min(3, barW * 0.4), Math.min(3, barW * 0.4), 0, 0]);
      } else {
        barCtx.rect(x, y, barW, barH);
      }
      barCtx.fill();

      // X label
      if (labels[i]) {
        barCtx.fillStyle = '#9CA3AF';
        barCtx.font = `${W < 400 ? 8 : 9}px Plus Jakarta Sans, sans-serif`;
        barCtx.textAlign = 'center';
        barCtx.fillText(labels[i], x + barW / 2, padT + chartH + 18);
      }
    });
  }

  // ── LINE CHART (pure canvas) ──
  function drawLineChart(data, labels) {
    const canvas = document.getElementById('chart-trend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    // Walk up to find real container width
    let container = canvas.parentElement;
    while (container && container.clientWidth === 0) container = container.parentElement;
    const W = container ? container.clientWidth : 400;
    // Proportional height ~55% of width, clamped
    const H = Math.max(160, Math.min(240, Math.round(W * 0.55)));

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const padL = 42, padR = 14, padT = 14, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    const rawMax = Math.max(...data);
    // Round ceiling to a nice step
    const niceMax = Math.ceil(rawMax * 1.2 / 10) * 10;
    const steps = 5;

    // Grid + Y labels
    ctx.strokeStyle = '#F0F2F5';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#9CA3AF';
    ctx.font = (W < 300 ? '9' : '10') + 'px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= steps; i++) {
      const y = padT + chartH - (i / steps) * chartH;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
      ctx.fillText(Math.round((niceMax / steps) * i), padL - 6, y + 3.5);
    }

    // Points
    const pts = data.map((v, i) => ({
      x: padL + (i / (data.length - 1)) * chartW,
      y: padT + chartH - (v / niceMax) * chartH,
    }));

    // Smooth bezier path via Catmull-Rom -> cubic bezier (tension 0.38)
    function buildSmoothPath(pts) {
      const t = 0.38;
      let d = 'M ' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(i + 2, pts.length - 1)];
        const cp1x = p1.x + (p2.x - p0.x) * t;
        const cp1y = p1.y + (p2.y - p0.y) * t;
        const cp2x = p2.x - (p3.x - p1.x) * t;
        const cp2y = p2.y - (p3.y - p1.y) * t;
        d += ' C ' + cp1x.toFixed(2) + ',' + cp1y.toFixed(2)
           + ' ' + cp2x.toFixed(2) + ',' + cp2y.toFixed(2)
           + ' ' + p2.x.toFixed(2) + ',' + p2.y.toFixed(2);
      }
      return d;
    }
    const pathStr = buildSmoothPath(pts);

    // Fill area under curve
    const areaGrad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    areaGrad.addColorStop(0, 'rgba(46,125,50,0.20)');
    areaGrad.addColorStop(1, 'rgba(46,125,50,0.01)');
    const areaPath = new Path2D(
      pathStr +
      ' L ' + pts[pts.length-1].x.toFixed(2) + ',' + (padT + chartH).toFixed(2) +
      ' L ' + pts[0].x.toFixed(2) + ',' + (padT + chartH).toFixed(2) + ' Z'
    );
    ctx.fillStyle = areaGrad;
    ctx.fill(areaPath);

    // Smooth line stroke
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D(pathStr));

    // Dots — thin out if too many points
    const dotStep = Math.max(1, Math.ceil(data.length / Math.floor(chartW / 28)));
    pts.forEach((p, i) => {
      if (i % dotStep !== 0 && i !== pts.length - 1) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2E7D32';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

    // X labels — only show as many as fit without overlapping
    const labelPixW = 38;
    const maxLabels = Math.max(2, Math.floor(chartW / (labelPixW + 8)));
    const nonEmpty = labels.map((l, i) => ({ l, i })).filter(o => o.l && o.l.trim());
    const labelStep = Math.max(1, Math.ceil(nonEmpty.length / maxLabels));

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '9px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    nonEmpty.forEach(({ l, i }, idx) => {
      if (idx % labelStep === 0) {
        ctx.fillText(l, pts[i].x, padT + chartH + 18);
      }
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
        currentTrendData = TREND_DATA_HARIAN; currentTrendLabels = TREND_LABELS_HARIAN;
      } else {
        currentTrendData = TREND_DATA_MINGGUAN; currentTrendLabels = TREND_LABELS_MINGGUAN;
      }
      drawLineChart(currentTrendData, currentTrendLabels);
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
      drawLineChart(currentTrendData, currentTrendLabels);
    }, 150);
  }

  // ── INIT ──
  function init() {
    renderTable();
    animateCounters();
    initChartControls();
    initExport();

    // Use ResizeObserver on chart wraps for precise responsive redraws
    if (typeof ResizeObserver !== 'undefined') {
      const observe = (sel, fn) => {
        const el = document.querySelector(sel);
        if (!el) return;
        let t;
        new ResizeObserver(() => { clearTimeout(t); t = setTimeout(fn, 80); }).observe(el);
      };
      observe('.bar-chart-wrap', () => drawBarChart(currentBarData, currentBarLabels));
      observe('.line-chart-wrap', () => drawLineChart(currentTrendData, currentTrendLabels));
    }

    // Charts need layout to settle first
    requestAnimationFrame(() => {
      // Double-raf to ensure CSS layout is fully computed before measuring
      requestAnimationFrame(() => {
        drawBarChart(currentBarData, currentBarLabels);
        drawLineChart(currentTrendData, currentTrendLabels);
        drawDonut();

        // Sparklines
        drawSparkline('spark-sampah',     SPARK_SAMPAH,     '#2E7D32');
        drawSparkline('spark-emisi',      SPARK_EMISI,      '#2E7D32');
        drawSparkline('spark-pengiriman', SPARK_PENGIRIMAN, '#1565C0');
        drawSparkline('spark-nilai',      SPARK_NILAI,      '#F57C00');
      });
    });

    window.addEventListener('resize', onResize);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AdminLaporan.init());
