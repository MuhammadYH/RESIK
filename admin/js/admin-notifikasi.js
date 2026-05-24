// admin-notifikasi.js — Notifikasi page logic
'use strict';

const AdminNotifikasi = (() => {

  // ── DATA ──
  const NOTIFICATIONS = [
    {
      id: 1,
      type: 'pengiriman',
      icon: '🚚',
      title: 'Pengiriman baru dijadwalkan',
      desc: 'Pengiriman sampah dari Pondok Pesantren Darul Ulum dijadwalkan hari ini.',
      time: '10 menit lalu',
      read: false,
    },
    {
      id: 2,
      type: 'smartbin',
      icon: '🗑️',
      title: 'Smart bin hampir penuh',
      desc: 'Smart Bin di Pondok Pesantren Al Hikmah sudah mencapai 87% kapasitas.',
      time: '45 menit lalu',
      read: false,
    },
    {
      id: 3,
      type: 'sensor',
      icon: '📶',
      title: 'Sensor offline',
      desc: 'Sensor di Pondok Pesantren Al Amin tidak terhubung selama 10 menit.',
      time: '1 jam lalu',
      read: false,
    },
    {
      id: 4,
      type: 'laporan',
      icon: '🌿',
      title: 'Laporan mingguan tersedia',
      desc: 'Laporan pengelolaan sampah mingguan telah berhasil dibuat.',
      time: 'Kemarin, 09:00',
      read: true,
    },
    {
      id: 5,
      type: 'pencapaian',
      icon: '🏆',
      title: 'Pencapaian baru',
      desc: 'Pondok Pesantren Nurul Huda berhasil mencapai pengurangan 100 kg CO₂!',
      time: '2 hari lalu',
      read: true,
    },
    {
      id: 6,
      type: 'sistem',
      icon: '⚙️',
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
        <div class="notif-icon type-${n.type}">${n.icon}</div>
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
