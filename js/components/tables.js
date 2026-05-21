/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/tables.js
   Komponen tabel data (pickup history, statistik)
═══════════════════════════════════════════════ */

'use strict';

const Tables = (() => {

  /* ── Data riwayat pickup ── */
  const HISTORY_DATA = [
    { date:'19 Mei 2025',  category:'Nasi & Sayuran',   weight:'18 Kg', processor:'Pak Rudi',           status:'Selesai'    },
    { date:'15 Okt 2024',  category:'Buah-buahan',      weight:'9 Kg',  processor:'CV. Hijau Lestari',  status:'Selesai'    },
    { date:'10 Okt 2024',  category:'Daging & Protein', weight:'5 Kg',  processor:'UD. Berkah Compost', status:'Selesai'    },
    { date:'05 Okt 2024',  category:'Roti / Kue',       weight:'4 Kg',  processor:'Pak Rudi',           status:'Selesai'    },
    { date:'01 Okt 2024',  category:'Nasi & Sayuran',   weight:'12 Kg', processor:'CV. Hijau Lestari',  status:'Dijemput'   },
    { date:'25 Sep 2024',  category:'Sayuran',           weight:'7 Kg',  processor:'UD. Berkah Compost', status:'Selesai'    },
    { date:'20 Sep 2024',  category:'Minuman',           weight:'3 Kg',  processor:'Pak Rudi',           status:'Selesai'    },
    { date:'15 Sep 2024',  category:'Lainnya',           weight:'2 Kg',  processor:'CV. Hijau Lestari',  status:'Dibatalkan' },
    { date:'10 Sep 2024',  category:'Nasi & Sayuran',   weight:'20 Kg', processor:'UD. Berkah Compost', status:'Selesai'    },
    { date:'05 Sep 2024',  category:'Buah-buahan',      weight:'6 Kg',  processor:'Pak Rudi',           status:'Menunggu'   },
  ];

  const STATUS_CLASS = {
    'Selesai':    'status--done',
    'Dijemput':   'status--pickup',
    'Menunggu':   'status--pending',
    'Dibatalkan': 'status--cancelled',
  };

  /**
   * Render tabel ke tbody
   * @param {Array}  data    - array row
   * @param {string} tbodyId - id tbody element
   * @param {string} emptyId - id empty state element
   */
  function renderTable(data, tbodyId, emptyId) {
    const tbody   = document.getElementById(tbodyId);
    const emptyEl = document.getElementById(emptyId);
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!data.length) {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-date">${row.date}</td>
        <td>${row.category}</td>
        <td class="td-weight">${row.weight}</td>
        <td>${row.processor}</td>
        <td><span class="status-badge ${STATUS_CLASS[row.status] || ''}">${row.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  /**
   * Filter tabel berdasarkan query dan status
   */
  function filterTable(query, status, tbodyId, emptyId) {
    const q  = (query || '').toLowerCase();
    const s  = status || '';
    const filtered = HISTORY_DATA.filter(row => {
      const matchQ = !q ||
        row.date.toLowerCase().includes(q)      ||
        row.category.toLowerCase().includes(q)  ||
        row.processor.toLowerCase().includes(q);
      const matchS = !s || row.status === s;
      return matchQ && matchS;
    });
    renderTable(filtered, tbodyId, emptyId);
  }

  /**
   * Inisialisasi tabel beserta search + filter interaktif
   */
  function initHistoryTable() {
    renderTable(HISTORY_DATA, 'historyTableBody', 'tableEmpty');

    const searchEl = document.getElementById('tableSearch');
    const filterEl = document.getElementById('statusFilter');

    function onFilter() {
      const q = searchEl ? searchEl.value : '';
      const s = filterEl ? filterEl.value : '';
      filterTable(q, s, 'historyTableBody', 'tableEmpty');
    }

    if (searchEl) searchEl.addEventListener('input',  onFilter);
    if (filterEl) filterEl.addEventListener('change', onFilter);
  }

  return {
    HISTORY_DATA,
    renderTable,
    filterTable,
    initHistoryTable,
  };

})();