// admin-riwayat.js — Riwayat page logic
'use strict';

const AdminRiwayat = (() => {

  // ── DATA ──
  const ACTIVITIES = [
    {
      id: 1,
      date: '12 Mei 2024', time: '08:45 WIB',
      jenis: 'pengambilan', jenisLabel: 'Pengambilan Sampah',
      lokasiName: 'Pondok Pesantren Darul Ulum', lokasiSub: 'Kapasitas: 60L',
      detail: 'Sampah organik berhasil diambil oleh armada B 1234 KAA',
      jumlah: '68 kg', status: 'selesai', statusLabel: 'Selesai',
      olehName: 'Ahmad F.', olehRole: 'Driver',
    },
    {
      id: 2,
      date: '12 Mei 2024', time: '08:20 WIB',
      jenis: 'smartbin', jenisLabel: 'Smart Bin Penuh',
      lokasiName: 'Pondok Pesantren Al Hikmah', lokasiSub: 'Kapasitas: 40L',
      detail: 'Smart bin mencapai kapasitas maksimal (87%)',
      jumlah: '35 kg', status: 'terkirim', statusLabel: 'Terkirim',
      olehName: 'Sistem Otomatis', olehRole: 'Smart Bin',
    },
    {
      id: 3,
      date: '12 Mei 2024', time: '07:15 WIB',
      jenis: 'sensor', jenisLabel: 'Sensor Update',
      lokasiName: 'Pondok Pesantren Nurul Huda', lokasiSub: 'Kapasitas: 20L',
      detail: 'Sensor mendeteksi suhu dan kelembapan normal',
      jumlah: '28°C / 65%', status: 'selesai', statusLabel: 'Selesai',
      olehName: 'Sistem Otomatis', olehRole: 'Sensor',
    },
    {
      id: 4,
      date: '11 Mei 2024', time: '16:30 WIB',
      jenis: 'pengiriman', jenisLabel: 'Pengiriman',
      lokasiName: 'Pondok Pesantren Al Falah', lokasiSub: 'Armada: B 5678 KBB',
      detail: 'Pengiriman ke TPST Organik Lestari',
      jumlah: '96 kg', status: 'selesai', statusLabel: 'Selesai',
      olehName: 'Dedi K.', olehRole: 'Driver',
    },
    {
      id: 5,
      date: '11 Mei 2024', time: '14:10 WIB',
      jenis: 'maintenance', jenisLabel: 'Maintenance',
      lokasiName: 'Pondok Pesantren Darul Ulum', lokasiSub: 'Smart Bin ID: SB-001',
      detail: 'Pembersihan dan kalibrasi sensor smart bin',
      jumlah: '—', status: 'selesai', statusLabel: 'Selesai',
      olehName: 'Rizky A.', olehRole: 'Teknisi',
    },
    {
      id: 6,
      date: '11 Mei 2024', time: '09:45 WIB',
      jenis: 'peringatan', jenisLabel: 'Peringatan',
      lokasiName: 'Pondok Pesantren Nurul Huda', lokasiSub: 'Smart Bin ID: SB-003',
      detail: 'Kapasitas hampir penuh (96%)',
      jumlah: '19 kg (96%)', status: 'selesai', statusLabel: 'Selesai',
      olehName: 'Sistem Otomatis', olehRole: 'Smart Bin',
    },
    {
      id: 7,
      date: '10 Mei 2024', time: '17:20 WIB',
      jenis: 'laporan', jenisLabel: 'Laporan Harian',
      lokasiName: 'Semua Lokasi', lokasiSub: '',
      detail: 'Ringkasan aktivitas harian otomatis',
      jumlah: '—', status: 'selesai', statusLabel: 'Selesai',
      olehName: 'Sistem Otomatis', olehRole: 'Laporan',
    },
  ];

  const ICONS = {
    pengambilan:  { emoji: '🗃️', cls: 'pengambilan' },
    smartbin:     { emoji: '🗑️', cls: 'smartbin'    },
    sensor:       { emoji: '🌿', cls: 'sensor'       },
    pengiriman:   { emoji: '🚚', cls: 'pengiriman'   },
    maintenance:  { emoji: '🔧', cls: 'maintenance'  },
    peringatan:   { emoji: '⚠️', cls: 'peringatan'  },
    laporan:      { emoji: '📄', cls: 'laporan'      },
  };

  const STATUS_CLS = {
    selesai:  'badge-selesai',
    terkirim: 'badge-terkirim',
    proses:   'badge-proses',
  };

  // Pagination state
  let currentPage = 1;
  const perPage   = 7;
  const total     = 1248;
  const totalPages = Math.ceil(total / perPage);

  // Filter state
  let filterDate  = '';
  let filterJenis = '';
  let filterLokasi = '';

  // ── RENDER ──
  function renderTable(data) {
    const tbody = document.getElementById('riwayat-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(row => {
      const icon = ICONS[row.jenis] || { emoji: '📋', cls: '' };
      const sCls = STATUS_CLS[row.status] || 'badge-gray';
      return `
        <tr>
          <td class="col-waktu">
            <div class="waktu-date">${row.date}</div>
            <div class="waktu-time">${row.time}</div>
          </td>
          <td class="col-jenis">
            <div class="jenis-wrap">
              <div class="jenis-icon ${icon.cls}">${icon.emoji}</div>
              <span class="jenis-name">${row.jenisLabel}</span>
            </div>
          </td>
          <td class="col-lokasi">
            <div class="lokasi-name">${row.lokasiName}</div>
            ${row.lokasiSub ? `<div class="lokasi-sub">${row.lokasiSub}</div>` : ''}
          </td>
          <td class="col-detail">
            <span class="detail-text">${row.detail}</span>
          </td>
          <td class="col-jumlah">
            <span class="jumlah-val">${row.jumlah}</span>
          </td>
          <td class="col-status">
            <span class="badge ${sCls}">
              <span class="status-dot" style="background:currentColor;opacity:.6"></span>
              ${row.statusLabel}
            </span>
          </td>
          <td class="col-oleh">
            <div class="oleh-name">${row.olehName}</div>
            <div class="oleh-role">${row.olehRole}</div>
          </td>
        </tr>`;
    }).join('');
  }

  function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const pages = [];
    // First / prev
    pages.push(`<button class="page-btn" id="pg-first" title="Halaman pertama">«</button>`);
    pages.push(`<button class="page-btn" id="pg-prev" title="Sebelumnya">‹</button>`);

    // Page numbers
    const range = buildPageRange(currentPage, totalPages);
    range.forEach(p => {
      if (p === '…') {
        pages.push(`<button class="page-btn ellipsis" disabled>…</button>`);
      } else {
        pages.push(`<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`);
      }
    });

    pages.push(`<button class="page-btn" id="pg-next" title="Selanjutnya">›</button>`);
    pages.push(`<button class="page-btn" id="pg-last" title="Halaman terakhir">»</button>`);

    container.innerHTML = pages.join('');

    // Bind
    container.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => goToPage(+btn.dataset.page));
    });
    container.querySelector('#pg-first').addEventListener('click', () => goToPage(1));
    container.querySelector('#pg-prev').addEventListener('click',  () => goToPage(Math.max(1, currentPage - 1)));
    container.querySelector('#pg-next').addEventListener('click',  () => goToPage(Math.min(totalPages, currentPage + 1)));
    container.querySelector('#pg-last').addEventListener('click',  () => goToPage(totalPages));
  }

  function buildPageRange(current, last) {
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
      range.push(i);
    }
    if (range[0] - 1 > 1)    range.unshift('…');
    if (last - range[range.length - 1] > 1) range.push('…');
    range.unshift(1);
    if (last > 1) range.push(last);
    return range;
  }

  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    currentPage = p;
    const start = (p - 1) * perPage + 1;
    const end   = Math.min(p * perPage, total);
    document.getElementById('riwayat-count').textContent = `Menampilkan ${start} - ${end} dari ${total.toLocaleString('id')} aktivitas`;
    renderTable(getFilteredData());
    renderPagination();
  }

  function getFilteredData() {
    // In a real app, fetch from API with page/filter params.
    // Here we just return the sample data.
    return ACTIVITIES;
  }

  // ── SPARKLINES ──
  function drawSparkline(svgId, data, color) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const W = 80, H = 30;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    }).join(' ');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = `
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${pts.split(' ').pop().split(',')[0]}" cy="${pts.split(' ').pop().split(',')[1]}" r="3" fill="${color}"/>
    `;
  }

  // ── FILTERS ──
  function initFilters() {
    const selDate   = document.getElementById('filter-date');
    const selJenis  = document.getElementById('filter-jenis');
    const selLokasi = document.getElementById('filter-lokasi');
    const btnReset  = document.getElementById('filter-reset');
    const searchInput = document.getElementById('riwayat-search');

    [selDate, selJenis, selLokasi].forEach(sel => {
      sel?.addEventListener('change', () => {
        currentPage = 1;
        renderTable(getFilteredData());
        renderPagination();
      });
    });

    btnReset?.addEventListener('click', () => {
      if (selDate)   selDate.value   = '';
      if (selJenis)  selJenis.value  = '';
      if (selLokasi) selLokasi.value = '';
      currentPage = 1;
      renderTable(getFilteredData());
      renderPagination();
    });

    searchInput?.addEventListener('input', () => {
      currentPage = 1;
      renderTable(getFilteredData());
      renderPagination();
    });
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
          : (target * e).toFixed(1) + suffix;
        if (p < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ── EXPORT ──
  function initExport() {
    document.getElementById('btn-export')?.addEventListener('click', () => {
      alert('Fitur export akan tersedia segera.');
    });
  }

  // ── INIT ──
  function init() {
    renderTable(getFilteredData());
    renderPagination();
    initFilters();
    animateCounters();
    initExport();

    // Draw sparklines
    drawSparkline('spark-aktivitas', [60,75,68,90,80,95,88,1248%100+40], '#2E7D32');
    drawSparkline('spark-sampah',    [10,14,12,18,16,22,20,24.5], '#2E7D32');
    drawSparkline('spark-pengiriman',[20,25,30,28,35,32,38,42], '#2E7D32');
    drawSparkline('spark-efisiensi', [75,78,80,82,85,84,88,89], '#2E7D32');
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AdminRiwayat.init());
