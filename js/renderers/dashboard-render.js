/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/renderers/dashboard.js
   Render konten halaman dashboard
   (greeting, cards, chart, activity)
═══════════════════════════════════════════════ */

'use strict';

const DashboardRenderer = (function () {

  /* ══════════════════════════════════════════
     GREETING
  ══════════════════════════════════════════ */

  /**
   * Update teks tanggal di greeting section.
   * Mengambil elemen #greeting-date dan mengisi
   * dengan tanggal hari ini dalam format Indonesia.
   */
  function renderGreetingDate() {
    const el = document.getElementById('greeting-date');
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

  /**
   * Update nama user di greeting title.
   * Mengambil data dari AppState.
   */
  function renderGreetingName() {
    const el = document.querySelector('#page-dashboard .greeting-title span');
    if (!el) return;
    const user = AppState.getUser();
    /* Ambil first name dari fullName */
    const firstName = (user.fullName || user.name || '').split(' ')[0];
    el.textContent  = firstName;
  }

  /**
   * Update sub-judul greeting berdasarkan waktu hari ini.
   * Pagi / Siang / Sore / Malam.
   */
  function renderGreetingSub() {
    const el = document.querySelector('#page-dashboard .greeting-sub');
    if (!el) return;
    const hour = new Date().getHours();
    if      (hour >= 4  && hour < 11) el.textContent = 'Selamat pagi';
    else if (hour >= 11 && hour < 15) el.textContent = 'Selamat siang';
    else if (hour >= 15 && hour < 18) el.textContent = 'Selamat sore';
    else                               el.textContent = 'Selamat malam';
  }

  /* ══════════════════════════════════════════
     METRIC BAR ANIMATIONS
  ══════════════════════════════════════════ */

  /**
   * Animasikan semua progress bar di hero metrics dashboard.
   * Bar di-set ke 0 lalu ditransisikan ke target width.
   */
  function renderMetricBars() {
    const bars = document.querySelectorAll('#page-dashboard .metric-bar-fill');
    bars.forEach(bar => {
      const target    = bar.style.width;
      bar.style.width = '0%';
      /* Delay kecil agar CSS transition aktif */
      setTimeout(() => { bar.style.width = target; }, 400);
    });
  }

  /* ══════════════════════════════════════════
     NOTIFIKASI BADGE
  ══════════════════════════════════════════ */

  /**
   * Update visibility badge notif di top nav berdasarkan
   * notifCount di AppState.
   */
  function renderNotifBadge() {
    const badge = document.querySelector('.rn-badge');
    if (!badge) return;
    const count = AppState.getNotifCount();
    badge.style.display = count > 0 ? '' : 'none';
    if (count > 0) {
      badge.setAttribute('aria-label', `${count} notifikasi baru`);
    }
  }

  /* ══════════════════════════════════════════
     ACTIVITY FEED
     (Konten statis, sudah ada di HTML)
     Fungsi ini disediakan jika kelak data
     di-fetch secara dinamis.
  ══════════════════════════════════════════ */

  /**
   * Data aktivitas default dashboard.
   * @type {Array<{initials:string, colorClass:string, msg:string, tag:string, tagClass:string, time:string}>}
   */
  const ACTIVITY_DATA = [
    {
      initials:  'MR',
      colorClass: 'a1',
      msg:        '<b>Pickup berhasil</b> — 12,5 kg organik dicatat',
      tag:        '+125 pts',
      tagClass:   'green',
      time:       '17 Mei · 09:14'
    },
    {
      initials:  'MR',
      colorClass: 'a2',
      msg:        '<b>Laporan sampah liar</b> dikirim di Jl. Anggrek',
      tag:        'Verifikasi',
      tagClass:   'blue',
      time:       '15 Mei · 14:32'
    },
    {
      initials:  'MR',
      colorClass: 'a1',
      msg:        '<b>Level naik!</b> Kamu jadi Ranger Hijau 🌿',
      tag:        '+200 pts bonus',
      tagClass:   'gold',
      time:       '13 Mei · 10:05'
    },
    {
      initials:  'MR',
      colorClass: 'a1',
      msg:        '<b>Pickup berhasil</b> — 9,8 kg plastik & kertas',
      tag:        '+98 pts',
      tagClass:   'green',
      time:       '10 Mei · 08:50'
    }
  ];

  /**
   * Render activity feed ke dalam .activity-list.
   * Jika konten sudah ada di HTML (static), tidak perlu dipanggil.
   *
   * @param {Array} [data] - Override ACTIVITY_DATA
   */
  function renderActivityFeed(data) {
    const list = document.querySelector('#page-dashboard .activity-list');
    if (!list) return;

    const items = data || ACTIVITY_DATA;
    list.innerHTML = items.map(item => `
      <div class="act-item" role="listitem">
        <div class="act-avatar ${item.colorClass}" aria-hidden="true">${item.initials}</div>
        <div class="act-content">
          <p class="act-msg">${item.msg}</p>
          <span class="act-tag ${item.tagClass}">${item.tag}</span>
          <p class="act-time">${item.time}</p>
        </div>
      </div>`).join('');
  }

  /* ══════════════════════════════════════════
     CHART SVG (Tren Pengumpulan)
     Chart sudah di-render via SVG statis di HTML.
     Fungsi ini menyediakan akses programatik
     jika kelak data di-update secara dinamis.
  ══════════════════════════════════════════ */

  /**
   * Data chart tren dashboard (6 bulan terakhir).
   */
  const CHART_DATA = {
    labels: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
    kg:     [28,    32,    38,    45,    46,    48],
    pts:    [24,    27,    33,    39,    41,    44]
  };

  /**
   * Kembalikan data chart untuk dipakai modul lain.
   * @returns {{ labels: string[], kg: number[], pts: number[] }}
   */
  function getChartData() {
    return { ...CHART_DATA };
  }

  /* ══════════════════════════════════════════
     QUICK ACTIONS
  ══════════════════════════════════════════ */

  /**
   * Pasang event listener pada tombol-tombol quick action
   * di halaman dashboard.
   *
   * @param {Function} [onAction] - Callback(actionName: string)
   */
  function bindQuickActions(onAction) {
    const buttons = document.querySelectorAll('#page-dashboard .qa-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.querySelector('.qa-label')?.textContent?.trim() || '';
        /* Animasi micro-interaction */
        btn.style.transform = 'scale(.95)';
        setTimeout(() => { btn.style.transform = ''; }, 180);
        if (onAction) onAction(label);
        console.log('[DashboardRenderer] Quick action:', label);
      });
    });
  }

  /**
   * Pasang event listener pada tombol Lacak di pickup panel.
   * @param {Function} [onTrack] - Callback saat tombol diklik
   */
  function bindPickupTrack(onTrack) {
    const btn = document.querySelector('#page-dashboard .pickup-action');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (onTrack) onTrack();
      else console.log('[DashboardRenderer] Lacak truk diklik');
    });
  }

  /* ══════════════════════════════════════════
     REWARD BAR
  ══════════════════════════════════════════ */

  /**
   * Animasikan reward bar di reward-card.
   * @param {number} [targetPct=72] - Target persentase 0–100
   */
  function animateRewardBar(targetPct) {
    const fill = document.querySelector('#page-dashboard .reward-bar-fill');
    if (!fill) return;
    const pct         = targetPct !== undefined ? targetPct : 72;
    fill.style.width  = '0%';
    setTimeout(() => { fill.style.width = pct + '%'; }, 500);
  }

  /* ══════════════════════════════════════════
     FULL RENDER
  ══════════════════════════════════════════ */

  /**
   * Jalankan semua render fungsi sekaligus.
   * Dipanggil oleh DashboardPage.init().
   */
  function render() {
    renderGreetingSub();
    renderGreetingName();
    renderGreetingDate();
    renderMetricBars();
    renderNotifBadge();
    animateRewardBar();
  }

  /* ── Public API ── */
  return {
    render,
    renderGreetingDate,
    renderGreetingName,
    renderGreetingSub,
    renderMetricBars,
    renderNotifBadge,
    renderActivityFeed,
    animateRewardBar,
    bindQuickActions,
    bindPickupTrack,
    getChartData,
    ACTIVITY_DATA,
    CHART_DATA
  };

})();