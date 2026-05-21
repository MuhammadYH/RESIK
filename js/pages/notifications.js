/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/notifications.js
   Page controller halaman Notifikasi.
   Menampilkan daftar notifikasi dengan filter,
   mark as read, dan badge count sync ke AppState.
═══════════════════════════════════════════════ */

'use strict';

const NotificationsPage = (function () {

  /* ── Internal state ── */
  let _inited      = false;
  let _activeFilter = 'semua';

  /* ══════════════════════════════════════════
     DATA
  ══════════════════════════════════════════ */

  const NOTIF_DATA = [
    {
      id:       'N001',
      type:     'pickup',
      title:    'Jadwal Pengambilan Hari Ini',
      msg:      'Truk RESIK dijadwalkan tiba pukul 09.00 WIB di area Anda.',
      time:     '08:30',
      timeAgo:  '30 menit lalu',
      read:     false,
      icon:     '🚛'
    },
    {
      id:       'N002',
      type:     'reward',
      title:    'Poin Reward Bertambah!',
      msg:      'Anda mendapatkan +120 poin dari setoran sampah plastik 4 kg kemarin.',
      time:     '07:15',
      timeAgo:  '1 jam lalu',
      read:     false,
      icon:     '⭐'
    },
    {
      id:       'N003',
      type:     'alert',
      title:    'Smart Bin BIN-02 Hampir Penuh',
      msg:      'Kapasitas BIN-02 Wonokromo telah mencapai 91%. Segera lakukan pengambilan.',
      time:     'Kemarin',
      timeAgo:  'Kemarin, 14:20',
      read:     false,
      icon:     '⚠️'
    },
    {
      id:       'N004',
      type:     'info',
      title:    'Laporan Bulanan Tersedia',
      msg:      'Laporan statistik sampah bulan April 2026 telah siap diunduh.',
      time:     'Kemarin',
      timeAgo:  'Kemarin, 09:00',
      read:     true,
      icon:     '📊'
    },
    {
      id:       'N005',
      type:     'pickup',
      title:    'Pengambilan Selesai',
      msg:      'Pengambilan sampah di zona Sungkono berhasil diselesaikan. Total: 34 kg.',
      time:     '2 hari lalu',
      timeAgo:  '2 hari lalu',
      read:     true,
      icon:     '✅'
    },
    {
      id:       'N006',
      type:     'reward',
      title:    'Selamat! Level Naik',
      msg:      'Anda mencapai level "Pahlawan Hijau" dengan total 1.500 poin terkumpul.',
      time:     '3 hari lalu',
      timeAgo:  '3 hari lalu',
      read:     true,
      icon:     '🏆'
    },
    {
      id:       'N007',
      type:     'alert',
      title:    'Sensor BIN-10 Offline',
      msg:      'Smart Bin BIN-10 Lakarsantri tidak terhubung selama 92 menit terakhir.',
      time:     '3 hari lalu',
      timeAgo:  '3 hari lalu',
      read:     true,
      icon:     '📡'
    }
  ];

  /* ══════════════════════════════════════════
     FILTER
  ══════════════════════════════════════════ */

  const FILTER_LABELS = {
    semua:   'Semua',
    belum:   'Belum Dibaca',
    pickup:  'Pickup',
    reward:  'Reward',
    alert:   'Peringatan',
    info:    'Info'
  };

  function _getFiltered() {
    if (_activeFilter === 'semua')  return NOTIF_DATA;
    if (_activeFilter === 'belum')  return NOTIF_DATA.filter(n => !n.read);
    return NOTIF_DATA.filter(n => n.type === _activeFilter);
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */

  function _typeBadgeClass(type) {
    const map = {
      pickup: 'badge-pickup',
      reward: 'badge-reward',
      alert:  'badge-alert',
      info:   'badge-info-n'
    };
    return map[type] || 'badge-info-n';
  }

  function _renderFilters() {
    const wrap = document.getElementById('notif-filter-wrap');
    if (!wrap) return;

    wrap.innerHTML = Object.entries(FILTER_LABELS).map(([key, label]) => {
      const count = key === 'belum'
        ? NOTIF_DATA.filter(n => !n.read).length
        : key === 'semua'
          ? NOTIF_DATA.length
          : NOTIF_DATA.filter(n => n.type === key).length;

      const isActive = key === _activeFilter ? 'notif-filter-btn--active' : '';
      return `
        <button class="notif-filter-btn ${isActive}" data-filter="${key}">
          ${label}
          <span class="notif-filter-count">${count}</span>
        </button>`;
    }).join('');

    wrap.querySelectorAll('.notif-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeFilter = btn.dataset.filter;
        _renderFilters();
        _renderList();
      });
    });
  }

  function _renderList() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    const items = _getFiltered();

    if (items.length === 0) {
      list.innerHTML = `
        <div class="notif-empty">
          <div class="notif-empty-icon">🔔</div>
          <div class="notif-empty-msg">Tidak ada notifikasi</div>
        </div>`;
      return;
    }

    list.innerHTML = items.map(n => `
      <div class="notif-row ${n.read ? '' : 'notif-row--unread'}" data-id="${n.id}">
        <div class="notif-row-icon">${n.icon}</div>
        <div class="notif-row-body">
          <div class="notif-row-title">${n.title}</div>
          <div class="notif-row-msg">${n.msg}</div>
          <div class="notif-row-meta">
            <span class="notif-type-badge ${_typeBadgeClass(n.type)}">${FILTER_LABELS[n.type]}</span>
            <span class="notif-row-time">${n.timeAgo}</span>
          </div>
        </div>
        ${!n.read ? '<div class="notif-row-dot"></div>' : ''}
      </div>`).join('');

    list.querySelectorAll('.notif-row').forEach(row => {
      row.addEventListener('click', () => _markRead(row.dataset.id));
    });
  }

  function _render() {
    const page = document.getElementById('page-notifikasi');
    if (!page) return;

    const unreadCount = NOTIF_DATA.filter(n => !n.read).length;

    page.innerHTML = `
      <div class="notif-wrap">

        <div class="notif-header">
          <div>
            <div class="notif-header-title">Notifikasi</div>
            <div class="notif-header-sub">${unreadCount} belum dibaca</div>
          </div>
          <button class="notif-read-all-btn" id="notif-read-all">
            Tandai semua dibaca
          </button>
        </div>

        <div class="notif-filter-scroll">
          <div id="notif-filter-wrap" class="notif-filter-wrap"></div>
        </div>

        <div id="notif-list" class="notif-list"></div>

      </div>`;
  }

  /* ══════════════════════════════════════════
     ACTIONS
  ══════════════════════════════════════════ */

  function _markRead(id) {
    const notif = NOTIF_DATA.find(n => n.id === id);
    if (!notif || notif.read) return;
    notif.read = true;

    const unread = NOTIF_DATA.filter(n => !n.read).length;
    AppState.setNotifCount(unread);

    _renderFilters();
    _renderList();

    /* Update header sub */
    const sub = document.querySelector('.notif-header-sub');
    if (sub) sub.textContent = `${unread} belum dibaca`;
  }

  function _markAllRead() {
    NOTIF_DATA.forEach(n => { n.read = true; });
    AppState.setNotifCount(0);
    _renderFilters();
    _renderList();
    const sub = document.querySelector('.notif-header-sub');
    if (sub) sub.textContent = '0 belum dibaca';
  }

  function _bindEvents() {
    const btn = document.getElementById('notif-read-all');
    if (btn) btn.addEventListener('click', _markAllRead);
  }

  /* ══════════════════════════════════════════
     PUBLIC: INIT
  ══════════════════════════════════════════ */

  function init() {
    if (!_inited) {
      _render();
      _renderFilters();
      _renderList();
      _bindEvents();
      _inited = true;
      AppState.markPageInited('notifikasi');
      console.log('[NotificationsPage] Halaman notifikasi diinisialisasi.');
    } else {
      _renderFilters();
      _renderList();
      console.log('[NotificationsPage] Halaman notifikasi diaktifkan kembali.');
    }
  }

  return { init };

})();
