// admin-notifikasi.js — Notifikasi page logic
'use strict';

const AdminNotifikasi = (() => {

  // ── LINE ICONS ──
  const ICONS = {
    pengiriman: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    smartbin:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    sensor:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    laporan:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    pencapaian: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    sistem:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  };

  // ── DATA ──
  const NOTIFICATIONS = [
    {
      id: 1,
      type: 'pengiriman',
      title: 'Pengiriman baru dijadwalkan',
      desc: 'Pengiriman sampah dari Pondok Pesantren Darul Ulum dijadwalkan hari ini.',
      time: '10 menit lalu',
      read: false,
    },
    {
      id: 2,
      type: 'smartbin',
      title: 'Smart bin hampir penuh',
      desc: 'Smart Bin di Pondok Pesantren Al Hikmah sudah mencapai 87% kapasitas.',
      time: '45 menit lalu',
      read: false,
    },
    {
      id: 3,
      type: 'sensor',
      title: 'Sensor offline',
      desc: 'Sensor di Pondok Pesantren Al Amin tidak terhubung selama 10 menit.',
      time: '1 jam lalu',
      read: false,
    },
    {
      id: 4,
      type: 'laporan',
      title: 'Laporan mingguan tersedia',
      desc: 'Laporan pengelolaan sampah mingguan telah berhasil dibuat.',
      time: 'Kemarin, 09:00',
      read: true,
    },
    {
      id: 5,
      type: 'pencapaian',
      title: 'Pencapaian baru',
      desc: 'Pondok Pesantren Nurul Huda berhasil mencapai pengurangan 100 kg CO₂!',
      time: '2 hari lalu',
      read: true,
    },
    {
      id: 6,
      type: 'sistem',
      title: 'Pemeliharaan sistem',
      desc: 'Sistem akan menjalani pemeliharaan rutin pada Minggu, 19 Mei 2024 pukul 02:00 WIB.',
      time: '3 hari lalu',
      read: true,
    },
  ];

  let activeTab = 'semua';

  // ── FILTER ──
  function getFiltered() {
    if (activeTab === 'belum') return NOTIFICATIONS.filter(n => !n.read);
    if (activeTab === 'dibaca') return NOTIFICATIONS.filter(n => n.read);
    return NOTIFICATIONS;
  }

  function unreadCount() {
    return NOTIFICATIONS.filter(n => !n.read).length;
  }

  // ── RENDER ──
  function renderList() {
    const list = document.getElementById('notif-list');
    const countText = document.getElementById('notif-count-text');
    if (!list) return;

    const data = getFiltered();

    if (data.length === 0) {
      list.innerHTML = `
        <div class="notif-empty">
          <div class="empty-icon">🔔</div>
          <p>Tidak ada notifikasi</p>
        </div>`;
      if (countText) countText.textContent = 'Tidak ada notifikasi';
      return;
    }

    list.innerHTML = data.map(n => `
      <div class="notif-item${n.read ? '' : ' unread'}" data-id="${n.id}">
        <div class="notif-icon type-${n.type}">${ICONS[n.type] || ''}</div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-desc">${n.desc}</div>
        </div>
        <div class="notif-time-wrap">
          <div class="notif-unread-dot"></div>
          <span class="notif-time">${n.time}</span>
        </div>
      </div>
    `).join('');

    if (countText) {
      countText.textContent = `Menampilkan 1 - ${data.length} dari ${data.length} notifikasi`;
    }

    // Click to mark as read
    list.querySelectorAll('.notif-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = +el.dataset.id;
        const notif = NOTIFICATIONS.find(n => n.id === id);
        if (notif && !notif.read) {
          notif.read = true;
          updateBadges();
          renderList();
        }
      });
    });
  }

  function updateBadges() {
    const count = unreadCount();
    const badge = document.getElementById('topbar-notif-count');
    const sidebarBadge = document.getElementById('sidebar-notif-badge');

    [badge, sidebarBadge].forEach(el => {
      if (!el) return;
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  // ── TABS ──
  function initTabs() {
    document.querySelectorAll('.admin-tab[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab[data-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        renderList();
      });
    });
  }

  // ── MARK ALL ──
  function initMarkAll() {
    document.getElementById('btn-mark-all')?.addEventListener('click', () => {
      NOTIFICATIONS.forEach(n => { n.read = true; });
      updateBadges();
      renderList();
    });
  }

  // ── INIT ──
  function init() {
    renderList();
    initTabs();
    initMarkAll();
    updateBadges();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AdminNotifikasi.init());
