/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/tables.js
   Komponen tabel data (pickup history table)
═══════════════════════════════════════════════ */

'use strict';

const Tables = (function () {

  /* ══════════════════════════════════════════
     STATUS CONFIG
  ══════════════════════════════════════════ */

  const STATUS_CLASS = {
    'Selesai':    'status--done',
    'Dijemput':   'status--pickup',
    'Menunggu':   'status--pending',
    'Dibatalkan': 'status--cancelled'
  };

  /* ══════════════════════════════════════════
     DATA DEFAULT — Pickup History
  ══════════════════════════════════════════ */

  const DEFAULT_HISTORY_DATA = [
    { date:'19 Mei 2025',  category:'Nasi & Sayuran',   weight:'18 Kg', processor:'Pak Rudi',           status:'Selesai'   },
    { date:'15 Okt 2024',  category:'Buah-buahan',      weight:'9 Kg',  processor:'CV. Hijau Lestari',  status:'Selesai'   },
    { date:'10 Okt 2024',  category:'Daging & Protein', weight:'5 Kg',  processor:'UD. Berkah Compost', status:'Selesai'   },
    { date:'05 Okt 2024',  category:'Roti / Kue',       weight:'4 Kg',  processor:'Pak Rudi',           status:'Selesai'   },
    { date:'01 Okt 2024',  category:'Nasi & Sayuran',   weight:'12 Kg', processor:'CV. Hijau Lestari',  status:'Dijemput'  },
    { date:'25 Sep 2024',  category:'Sayuran',           weight:'7 Kg',  processor:'UD. Berkah Compost', status:'Selesai'   },
    { date:'20 Sep 2024',  category:'Minuman',           weight:'3 Kg',  processor:'Pak Rudi',           status:'Selesai'   },
    { date:'15 Sep 2024',  category:'Lainnya',           weight:'2 Kg',  processor:'CV. Hijau Lestari',  status:'Dibatalkan'},
    { date:'10 Sep 2024',  category:'Nasi & Sayuran',   weight:'20 Kg', processor:'UD. Berkah Compost', status:'Selesai'   },
    { date:'05 Sep 2024',  category:'Buah-buahan',      weight:'6 Kg',  processor:'Pak Rudi',           status:'Menunggu'  }
  ];

  /* ══════════════════════════════════════════
     PICKUP HISTORY TABLE
  ══════════════════════════════════════════ */

  /**
   * Inisialisasi tabel riwayat pickup dengan search & filter.
   *
   * @param {Object} opts
   * @param {string}  opts.tbodyId        - ID elemen <tbody>
   * @param {string}  opts.emptyId        - ID elemen "data kosong"
   * @param {string}  [opts.searchId]     - ID input search
   * @param {string}  [opts.filterId]     - ID select filter status
   * @param {Array}   [opts.data]         - Override data default
   * @returns {{ render: Function, filter: Function, getData: Function }}
   */
  function initPickupHistoryTable(opts) {
    const tbody   = document.getElementById(opts.tbodyId);
    const emptyEl = document.getElementById(opts.emptyId);
    const data    = opts.data || DEFAULT_HISTORY_DATA;

    if (!tbody) {
      console.warn('[Tables] tbody tidak ditemukan:', opts.tbodyId);
      return null;
    }

    /* Render awal */
    _renderRows(tbody, emptyEl, data);

    /* Bind search & filter */
    const searchEl = document.getElementById(opts.searchId);
    const filterEl = document.getElementById(opts.filterId);

    function applyFilter() {
      const q      = searchEl ? searchEl.value.toLowerCase() : '';
      const status = filterEl ? filterEl.value : '';
      const filtered = data.filter(row => {
        const matchQ = !q ||
          row.date.toLowerCase().includes(q)      ||
          row.category.toLowerCase().includes(q)  ||
          row.processor.toLowerCase().includes(q);
        const matchS = !status || row.status === status;
        return matchQ && matchS;
      });
      _renderRows(tbody, emptyEl, filtered);
    }

    if (searchEl) searchEl.addEventListener('input',  applyFilter);
    if (filterEl) filterEl.addEventListener('change', applyFilter);

    return {
      render:  (newData) => _renderRows(tbody, emptyEl, newData || data),
      filter:  applyFilter,
      getData: () => [...data]
    };
  }

  /**
   * Render baris-baris tabel ke dalam tbody.
   *
   * @param {HTMLElement} tbody
   * @param {HTMLElement} emptyEl
   * @param {Array}       rows
   */
  function _renderRows(tbody, emptyEl, rows) {
    tbody.innerHTML = '';

    if (!rows.length) {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-date">${_esc(row.date)}</td>
        <td>${_esc(row.category)}</td>
        <td class="td-weight">${_esc(row.weight)}</td>
        <td>${_esc(row.processor)}</td>
        <td>
          <span class="status-badge ${STATUS_CLASS[row.status] || ''}">
            ${_esc(row.status)}
          </span>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  /* ══════════════════════════════════════════
     GENERIC TABLE BUILDER
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string tabel generik.
   *
   * @param {Object}   opts
   * @param {string[]} opts.headers        - Array header teks
   * @param {Array[]}  opts.rows           - Array of arrays (tiap row = array sel)
   * @param {string}   [opts.ariaLabel]    - aria-label tabel
   * @param {string}   [opts.emptyMessage] - Pesan saat data kosong
   * @returns {string} HTML string
   */
  function buildTable(opts) {
    const headers = (opts.headers || [])
      .map(h => `<th scope="col">${_esc(h)}</th>`)
      .join('');

    const rows = (opts.rows || [])
      .map(row => {
        const cells = row.map(cell => `<td>${cell}</td>`).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const body = rows || `
      <tr>
        <td colspan="${opts.headers?.length || 1}" class="table-empty">
          ${opts.emptyMessage || 'Tidak ada data.'}
        </td>
      </tr>`;

    return `
      <div class="table-scroll" role="region" aria-label="${opts.ariaLabel || 'Tabel data'}">
        <table aria-label="${opts.ariaLabel || 'Tabel data'}">
          <thead><tr>${headers}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>`;
  }

  /* ══════════════════════════════════════════
     SORT HELPER
  ══════════════════════════════════════════ */

  /**
   * Sort array of objects berdasarkan key tertentu.
   *
   * @param {Array}   data       - Data yang akan di-sort
   * @param {string}  key        - Key yang dijadikan acuan sort
   * @param {'asc'|'desc'} dir  - Arah sort
   * @returns {Array} Data baru (tidak mutate original)
   */
  function sortBy(data, key, dir = 'asc') {
    return [...data].sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      const cmp = String(av).localeCompare(String(bv), 'id', { numeric: true });
      return dir === 'asc' ? cmp : -cmp;
    });
  }

  /* ══════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════ */

  /** Escape HTML untuk mencegah XSS */
  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── Public API ── */
  return {
    initPickupHistoryTable,
    buildTable,
    sortBy,
    STATUS_CLASS,
    DEFAULT_HISTORY_DATA
  };

})();