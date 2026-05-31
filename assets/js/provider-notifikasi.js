/* provider-notifikasi.js — Alert Smart Bin & Sistem */
(function () {

  const NOTIFS = [
    {
      id: 1, unread: true, type: 'danger',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      iconBg: '#FFEBEE', iconColor: '#C62828',
      title: 'Bin Dapur Utama hampir penuh (92%)',
      desc: 'Kapasitas mendekati batas maksimum. Segera jadwalkan pengangkutan untuk mencegah overflow.',
      time: '2 menit lalu', source: 'Smart Bin', sourceBg: '#FFEBEE', sourceColor: '#C62828',
    },
    {
      id: 2, unread: true, type: 'warning',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      iconBg: '#FFF3E0', iconColor: '#E65100',
      title: 'Sensor Bin Asrama Putra bermasalah',
      desc: 'Data pengukuran tidak konsisten. Diperlukan pengecekan fisik pada perangkat sensor.',
      time: '35 menit lalu', source: 'Sensor', sourceBg: '#FFF3E0', sourceColor: '#E65100',
    },
    {
      id: 3, unread: true, type: 'info',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
      iconBg: '#E8F5E9', iconColor: '#2E7D32',
      title: 'Setoran diterima & dikonfirmasi',
      desc: 'Bin Kantin Barat berhasil dikosongkan. 18 kg limbah organik tercatat masuk ke sistem.',
      time: '1 jam lalu', source: 'Setoran', sourceBg: '#E8F5E9', sourceColor: '#2E7D32',
    },
    {
      id: 4, unread: false, type: 'info',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      iconBg: '#E3F2FD', iconColor: '#1565C0',
      title: 'Jadwal pengangkutan besok dikonfirmasi',
      desc: 'Tim pengangkutan akan tiba pukul 08.00 WIB untuk Bin Asrama Putra dan Bin Masjid Utama.',
      time: '3 jam lalu', source: 'Jadwal', sourceBg: '#E3F2FD', sourceColor: '#1565C0',
    },
    {
      id: 5, unread: false, type: 'system',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
      iconBg: '#F5F5F5', iconColor: '#9CA3AF',
      title: 'Bin Gudang Belakang offline',
      desc: 'Koneksi sensor terputus sejak kemarin 15.30 WIB. Diperlukan pengecekan koneksi WiFi di lokasi.',
      time: 'Kemarin', source: 'Sistem', sourceBg: '#F5F5F5', sourceColor: '#9CA3AF',
    },
    {
      id: 6, unread: false, type: 'success',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      iconBg: '#E8F5E9', iconColor: '#2E7D32',
      title: 'Laporan mingguan tersedia',
      desc: 'Laporan kinerja minggu ini telah digenerate. Total 76 kg limbah terkelola minggu ini.',
      time: 'Kemarin', source: 'Laporan', sourceBg: '#E8F5E9', sourceColor: '#2E7D32',
    },
    {
      id: 7, unread: false, type: 'info',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      iconBg: '#E8F5E9', iconColor: '#2E7D32',
      title: 'Kontrak layanan diperpanjang',
      desc: 'Kontrak layanan pengelolaan limbah organik Anda telah diperpanjang hingga Desember 2026.',
      time: '3 hari lalu', source: 'Sistem', sourceBg: '#F5F5F5', sourceColor: '#9CA3AF',
    },
    {
      id: 8, unread: false, type: 'warning',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-2.82-1.18l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      iconBg: '#FFF3E0', iconColor: '#E65100',
      title: 'Pembaruan firmware tersedia',
      desc: 'Versi firmware 2.3.1 tersedia untuk 3 smart bin Anda. Pembaruan disarankan untuk keamanan optimal.',
      time: '5 hari lalu', source: 'Update', sourceBg: '#FFF3E0', sourceColor: '#E65100',
    },
  ];

  let activeTab = 'semua';
  let data = [...NOTIFS];

  function getFiltered() {
    if (activeTab === 'belum')  return data.filter(n => n.unread);
    if (activeTab === 'dibaca') return data.filter(n => !n.unread);
    return data;
  }

  function render() {
    const list = document.getElementById('notif-list');
    const countEl = document.getElementById('notif-count-text');
    if (!list) return;
    const filtered = getFiltered();

    list.innerHTML = filtered.length === 0
      ? `<div style="text-align:center;padding:var(--space-10);color:var(--text-muted);">Tidak ada notifikasi.</div>`
      : filtered.map(n => `
          <div class="notif-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
            <div class="notif-icon" style="background:${n.iconBg};color:${n.iconColor};">${n.icon}</div>
            <div class="notif-body">
              <div class="notif-title">${n.title}</div>
              <div class="notif-desc">${n.desc}</div>
              <div class="notif-meta">
                <span class="notif-time">${n.time}</span>
                <span class="notif-source-tag" style="background:${n.sourceBg};color:${n.sourceColor};">${n.source}</span>
              </div>
            </div>
            ${n.unread ? '<div class="notif-unread-dot"></div>' : ''}
          </div>`).join('');

    if (countEl) countEl.textContent = `Menampilkan ${filtered.length} dari ${data.length} notifikasi`;

    // Update badge
    const unreadCount = data.filter(n => n.unread).length;
    document.querySelectorAll('#notifBadge, .sidebar-notif-badge').forEach(el => {
      el.textContent = unreadCount;
      el.style.display = unreadCount ? '' : 'none';
    });

    // Click to mark read
    list.querySelectorAll('.notif-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id);
        const notif = data.find(n => n.id === id);
        if (notif) { notif.unread = false; render(); }
      });
    });
  }

  // Tabs
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      render();
    });
  });

  // Mark all
  document.getElementById('btn-mark-all')?.addEventListener('click', () => {
    data.forEach(n => { n.unread = false; });
    render();
  });

  render();
})();
