/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/management.js
   Page controller manajemen sampah (waste/rw-*):
   renderBins, simulateFreshness,
   updatePickupCountdown, filter, expand cards
═══════════════════════════════════════════════ */

'use strict';

const ManagementPage = (function () {

  /* ── Internal state ── */
  let _inited      = false;
  let _binInterval = null;

  /* ══════════════════════════════════════════
     SMART BIN DATA
  ══════════════════════════════════════════ */

  const BIN_DATA = [
    { id:'BIN-01', name:'Sungkono',     location:'Kec. Dukuh Pakis', pct:34, online:true,  syncMins:2  },
    { id:'BIN-02', name:'Wonokromo',    location:'Kec. Wonokromo',   pct:91, online:true,  syncMins:1  },
    { id:'BIN-03', name:'Genteng',      location:'Kec. Genteng',     pct:55, online:true,  syncMins:4  },
    { id:'BIN-04', name:'Tegalsari',    location:'Kec. Tegalsari',   pct:22, online:true,  syncMins:3  },
    { id:'BIN-05', name:'Darmo',        location:'Jl. Raya Darmo',   pct:67, online:true,  syncMins:5  },
    { id:'BIN-06', name:'Kenjeran',     location:'Kec. Kenjeran',    pct:78, online:true,  syncMins:7  },
    { id:'BIN-07', name:'Keputran',     location:'Pasar Keputran',   pct:61, online:true,  syncMins:2  },
    { id:'BIN-08', name:'Gubeng',       location:'Kec. Gubeng',      pct:18, online:true,  syncMins:6  },
    { id:'BIN-09', name:'Dharmahusada', location:'Kec. Mulyorejo',   pct:44, online:true,  syncMins:3  },
    { id:'BIN-10', name:'Lakarsantri',  location:'Kec. Lakarsantri', pct:0,  online:false, syncMins:92 }
  ];

  /* ══════════════════════════════════════════
     RENDER SMART BINS
  ══════════════════════════════════════════ */

  /**
   * Render semua smart bin card ke dalam #rw-bin-grid.
   * Update juga counter summary (green/yellow/red/active).
   */
  function renderBins() {
    const grid = document.getElementById('rw-bin-grid');
    if (!grid) return;

    let green = 0, yellow = 0, red = 0, active = 0;

    /* Hitung summary dulu */
    BIN_DATA.forEach(bin => {
      const s = Cards.binStatus(bin.pct, bin.online);
      if (bin.online) active++;
      if (s === 'green')  green++;
      if (s === 'yellow') yellow++;
      if (s === 'red')    red++;
    });

    /* Render card HTML */
    grid.innerHTML = BIN_DATA.map(bin => Cards.rwBinCard(bin)).join('');

    /* Update summary text */
    _updateEl('rw-bin-count-green',  green);
    _updateEl('rw-bin-count-yellow', yellow);
    _updateEl('rw-bin-count-red',    red);
    _updateEl('rw-bin-active-count', `${active} aktif`);

    /* Animasi gauge fills */
    requestAnimationFrame(() => {
      grid.querySelectorAll('.rw-bin-gauge-fill').forEach(fill => {
        const target    = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = target;
        }, 200 + Math.random() * 150);
      });
    });
  }

  /* ══════════════════════════════════════════
     SIMULATE BIN LIVE UPDATES
  ══════════════════════════════════════════ */

  /**
   * Simulasikan perubahan level bin secara periodik (setiap 30 detik).
   * Setiap bin online pct berubah ±1 secara random.
   */
  function _startBinLiveUpdates() {
    if (_binInterval) clearInterval(_binInterval);
    _binInterval = setInterval(() => {
      BIN_DATA.forEach(bin => {
        if (!bin.online) return;
        bin.pct = Math.max(0, Math.min(100, bin.pct + (Math.random() > 0.5 ? 1 : -1)));
      });
      renderBins();
    }, 30_000);
  }

  /* ══════════════════════════════════════════
     FRESHNESS SIMULATION
  ══════════════════════════════════════════ */

  /**
   * Simulasikan tingkat kesegaran (freshness) berdasarkan
   * jam laporan. Memperbarui badge & progress fill tiap kartu.
   */
  function simulateFreshness() {
    /* Mapping waktu laporan → jam berlalu (estimasi) */
    const thresholds = {
      '09:45': 2,
      '06:20': 5,
      '22:10': 12,
      '10:55': 1,
      '04:30': 7,
      '08:15': 3
    };

    const labels = { fresh: 'Fresh', warn: 'Segera', urgent: 'Urgent' };

    document.querySelectorAll('#rw-list .rw-card').forEach(card => {
      const timeEl = card.querySelector('.rw-card-time');
      if (!timeEl) return;

      const hoursAgo = thresholds[timeEl.textContent.trim()] ?? 0;
      const fresh    = hoursAgo < 4 ? 'fresh' : hoursAgo < 10 ? 'warn' : 'urgent';

      /* Update badge */
      const badge = card.querySelector('.rw-fresh-badge');
      if (badge) {
        badge.className = `rw-fresh-badge ${fresh}`;
        badge.innerHTML = `<span class="rw-fresh-badge-dot"></span>${labels[fresh]}`;
      }

      /* Update progress fill class */
      const fill = card.querySelector('.rw-progress-fill');
      if (fill) {
        fill.className = `rw-progress-fill ${fresh}`;
      }

      /* Update data attribute untuk filter */
      card.dataset.rwFresh = fresh;
    });
  }

  /* ══════════════════════════════════════════
     PICKUP COUNTDOWN
  ══════════════════════════════════════════ */

  /**
   * Hitung sisa waktu menuju pickup berikutnya (13:30)
   * dan update teks di #rw-pickup-countdown.
   */
  function updatePickupCountdown() {
    const el = document.getElementById('rw-pickup-countdown');
    if (!el) return;

    const now    = new Date();
    const pickup = new Date();
    pickup.setHours(13, 30, 0, 0);

    const diff = pickup - now;
    if (diff > 0) {
      const totalMins = Math.floor(diff / 60000);
      const hrs       = Math.floor(totalMins / 60);
      const rem       = totalMins % 60;
      el.textContent  = `Pickup berikutnya · ${
        hrs > 0 ? `${hrs} jam ${rem} menit` : `${totalMins} menit`
      } lagi`;
    } else {
      el.textContent = 'Pickup berikutnya';
    }
  }

  /* ══════════════════════════════════════════
     DATE CHIP
  ══════════════════════════════════════════ */

  function _renderDateChip() {
    const el = document.getElementById('rw-date-text');
    if (!el) return;

    const now    = new Date();
    const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const months = [
      'Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'
    ];
    el.textContent =
      `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  /* ══════════════════════════════════════════
     METRIC ENTRANCE ANIMATION
  ══════════════════════════════════════════ */

  function _animateMetrics() {
    Cards.animateEntrance(
      document.querySelectorAll('#page-sampah .rw-metric'),
      60, 55
    );
  }

  /* ══════════════════════════════════════════
     PROGRESS BARS ENTRANCE
  ══════════════════════════════════════════ */

  function _animateProgressBars() {
    Cards.animateBars(
      document.querySelectorAll('#page-sampah .rw-progress-fill, #page-sampah .rw-impact-bar'),
      350
    );
  }

  /* ══════════════════════════════════════════
     CARD EXPAND / COLLAPSE
  ══════════════════════════════════════════ */

  function _bindCardExpand() {
    const cards = document.querySelectorAll('#rw-list .rw-card');

    cards.forEach(card => {
      card.addEventListener('click', e => {
        /* Jika klik di dalam detail button, jangan toggle expand */
        if (e.target.closest('.rw-detail-btn')) return;

        const isExpanded = card.classList.contains('expanded');

        /* Collapse semua card lain */
        cards.forEach(c => {
          if (c !== card) {
            c.classList.remove('expanded');
            c.setAttribute('aria-expanded', 'false');
            const d = c.querySelector('.rw-card-detail');
            if (d) d.setAttribute('aria-hidden', 'true');
          }
        });

        /* Toggle card yang diklik */
        card.classList.toggle('expanded', !isExpanded);
        card.setAttribute('aria-expanded', String(!isExpanded));
        const detail = card.querySelector('.rw-card-detail');
        if (detail) detail.setAttribute('aria-hidden', String(isExpanded));
      });

      /* Keyboard support */
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  /* ══════════════════════════════════════════
     FILTER BUTTONS
  ══════════════════════════════════════════ */

  function _bindFilters() {
    const filterBtns = document.querySelectorAll('[data-rw-filter]');
    const cards      = document.querySelectorAll('#rw-list .rw-card');
    const countEl    = document.getElementById('rw-list-count');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        /* Update active state */
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        /* Apply filter */
        _applyFilter(btn.dataset.rwFilter, cards, countEl);
      });

      /* Keyboard support */
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /**
   * Terapkan filter ke daftar rw-card.
   *
   * @param {string}      filter   - 'all'|'fresh'|'warn'|'urgent'|'scheduled'
   * @param {NodeList}    cards    - Semua rw-card elements
   * @param {HTMLElement} countEl  - Element counter jumlah item
   */
  function _applyFilter(filter, cards, countEl) {
    let visible = 0;

    cards.forEach(card => {
      const fresh  = card.dataset.rwFresh;
      const pickup = card.dataset.rwPickup;

      const show = filter === 'all'
        || (filter === 'fresh'     && fresh  === 'fresh')
        || (filter === 'warn'      && fresh  === 'warn')
        || (filter === 'urgent'    && fresh  === 'urgent')
        || (filter === 'scheduled' && pickup === 'scheduled');

      if (show) {
        card.style.display   = '';
        card.style.opacity   = '0';
        card.style.transform = 'translateY(6px)';

        requestAnimationFrame(() => {
          card.style.transition = [
            'opacity 280ms cubic-bezier(.22,.68,0,1)',
            'transform 280ms cubic-bezier(.22,.68,0,1)'
          ].join(', ');
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        });
        visible++;
      } else {
        /* Collapse sebelum hide */
        card.classList.remove('expanded');
        card.style.opacity   = '0';
        card.style.transform = 'translateY(-4px)';
        setTimeout(() => { card.style.display = 'none'; }, 240);
      }
    });

    /* Update counter teks */
    if (countEl) {
      setTimeout(() => {
        countEl.textContent = `${visible} item`;
      }, 260);
    }
  }

  /* ══════════════════════════════════════════
     QUICK ACTIONS (rw-action buttons)
  ══════════════════════════════════════════ */

  function _bindQuickActions() {
    document.querySelectorAll('#page-sampah [data-rw-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.rwAction;

        /* Micro-interaction */
        btn.style.transform = 'scale(.94)';
        setTimeout(() => { btn.style.transform = ''; }, 200);

        /* Dispatch event untuk modul lain */
        document.dispatchEvent(
          new CustomEvent('rw:action', {
            detail:  { action },
            bubbles: true
          })
        );

        /* Handle aksi */
        _handleAction(action);
      });
    });
  }

  /**
   * Handle aksi dari rw-action button.
   * @param {string} action
   */
  function _handleAction(action) {
    switch (action) {
      case 'add-report':
        Modals.comingSoon('Tambah Laporan Sampah');
        break;
      case 'schedule-pickup':
        Modals.comingSoon('Jadwalkan Pickup');
        break;
      case 'upload-photo':
        Modals.comingSoon('Upload Foto Sampah');
        break;
      case 'history':
        NavbarRenderer.navigate('statistik');
        break;
      case 'view-on-map':
        Modals.comingSoon('Lihat di Peta');
        break;
      case 'prioritize-pickup':
        Modals.confirm(
          'Prioritaskan Pickup',
          'Tandai laporan ini sebagai prioritas tinggi untuk dijemput sesegera mungkin?',
          () => {
            console.log('[ManagementPage] Pickup diprioritaskan.');
          }
        );
        break;
      default:
        console.log('[ManagementPage] Aksi:', action);
    }
  }

  /* ══════════════════════════════════════════
     CLEANUP
  ══════════════════════════════════════════ */

  function _cleanup() {
    if (_binInterval) {
      clearInterval(_binInterval);
      _binInterval = null;
    }
  }

  /* ══════════════════════════════════════════
     HELPER
  ══════════════════════════════════════════ */

  function _updateEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /* ══════════════════════════════════════════
     PUBLIC: INIT
  ══════════════════════════════════════════ */

  /**
   * Inisialisasi halaman manajemen sampah.
   * Dipanggil oleh Router setiap kali halaman sampah diaktifkan.
   *
   * Animasi & countdown dijalankan ulang tiap kunjungan.
   * Event binding hanya sekali (cek _inited).
   */
  function init() {
    /* Selalu jalankan saat halaman diaktifkan */
    _renderDateChip();
    _animateMetrics();
    _animateProgressBars();
    renderBins();
    simulateFreshness();
    updatePickupCountdown();

    /* Cleanup & restart intervals */
    _cleanup();
    setInterval(simulateFreshness, 60_000);
    setInterval(updatePickupCountdown, 30_000);
    _startBinLiveUpdates();

    /* Event binding — hanya sekali */
    if (!_inited) {
      _bindCardExpand();
      _bindFilters();
      _bindQuickActions();
      _inited = true;
      AppState.markPageInited('sampah');
      console.log('[ManagementPage] Halaman sampah diinisialisasi (pertama kali).');
    } else {
      console.log('[ManagementPage] Halaman sampah diaktifkan kembali.');
    }
  }

  /**
   * Dipanggil saat navigasi keluar dari halaman sampah.
   */
  function destroy() {
    _cleanup();
    console.log('[ManagementPage] Halaman sampah di-destroy.');
  }

  /* ── Public API ── */
  return {
    init,
    destroy,
    renderBins,
    simulateFreshness,
    updatePickupCountdown,
    BIN_DATA
  };

})();