/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/dashboard.js
   Page controller dashboard:
   init, event listeners, data fetch, countdown
═══════════════════════════════════════════════ */

'use strict';

const DashboardPage = (function () {

  /* ── Internal state ── */
  let _countdownInterval = null;
  let _inited            = false;

  /* ══════════════════════════════════════════
     PICKUP COUNTDOWN
  ══════════════════════════════════════════ */

  /**
   * Hitung sisa waktu menuju jadwal pickup hari ini (09:00)
   * dan update teks di metric card.
   */
  function _updatePickupCountdown() {
    const metaEl = document.querySelector(
      '#page-dashboard .metric-card:nth-child(2) .metric-footer .metric-meta:last-child'
    );
    if (!metaEl) return;

    const now    = new Date();
    const pickup = new Date();
    pickup.setHours(9, 0, 0, 0);

    const diff = pickup - now;

    if (diff > 0) {
      const totalMins = Math.floor(diff / 60000);
      const hrs       = Math.floor(totalMins / 60);
      const mins      = totalMins % 60;

      if (hrs > 0) {
        metaEl.textContent = `~${hrs} jam ${mins} menit lagi`;
      } else {
        metaEl.textContent = `~${mins} menit lagi`;
      }
    } else if (diff > -3600000) {
      /* Dalam 1 jam setelah jadwal: tampilkan "sedang berlangsung" */
      metaEl.textContent = 'Sedang berlangsung';
    } else {
      metaEl.textContent = 'Selesai hari ini';
    }
  }

  /* ══════════════════════════════════════════
     METRIC BAR ANIMATED COUNTDOWN
     Bar untuk metric pickup menunjukkan
     progress waktu mendekati jadwal.
  ══════════════════════════════════════════ */

  function _updatePickupBar() {
    /* Bar di metric card #2 menunjukkan seberapa dekat waktu pickup */
    const bar = document.querySelector(
      '#page-dashboard .metric-card:nth-child(2) .metric-bar-fill'
    );
    if (!bar) return;

    const now    = new Date();
    const start  = new Date(); start.setHours(6, 0, 0, 0);   /* mulai hitung dari jam 06:00 */
    const end    = new Date(); end.setHours(9, 0, 0, 0);     /* target 09:00 */

    const total   = end - start;
    const elapsed = Math.max(0, Math.min(total, now - start));
    const pct     = Math.round((elapsed / total) * 100);

    bar.style.width = pct + '%';
  }

  /* ══════════════════════════════════════════
     NOTIFIKASI ITEMS — EVENT BINDING
  ══════════════════════════════════════════ */

  function _bindNotifItems() {
    const items = document.querySelectorAll('#page-dashboard .notif-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        /* Tandai sebagai dibaca */
        item.classList.remove('unread');
        const dot = item.querySelector('.notif-dot');
        if (dot) dot.classList.add('read');

        /* Update badge count di state */
        const remaining = document.querySelectorAll(
          '#page-dashboard .notif-item.unread'
        ).length;
        AppState.setNotifCount(remaining);
      });
    });
  }

  /* ══════════════════════════════════════════
     SECTION LINK — NAVIGATION
  ══════════════════════════════════════════ */

  function _bindSectionLinks() {
    /* "Detail →" pada chart section → navigasi ke statistik */
    const chartLink = document.querySelector(
      '#page-dashboard .bottom-grid .section-link'
    );
    if (chartLink) {
      chartLink.addEventListener('click', e => {
        e.preventDefault();
        NavbarRenderer.navigate('statistik');
      });
    }

    /* "Riwayat" pada activity section → navigasi ke statistik */
    const actLink = document.querySelector(
      '#page-dashboard .activity-list ~ * .section-link, ' +
      '#page-dashboard .section-card:last-child .section-link'
    );
    if (actLink) {
      actLink.addEventListener('click', e => {
        e.preventDefault();
        NavbarRenderer.navigate('statistik');
      });
    }
  }

  /* ══════════════════════════════════════════
     QUICK ACTIONS
  ══════════════════════════════════════════ */

  function _bindQuickActions() {
    DashboardRenderer.bindQuickActions((actionLabel) => {
      switch (actionLabel) {
        case 'Lapor Sampah':
          NavbarRenderer.navigate('sampah');
          break;
        case 'Jadwalkan':
          NavbarRenderer.navigate('sampah');
          break;
        case 'Lihat Rute':
          Modals.comingSoon('Lihat Rute Pickup');
          break;
        default:
          console.log('[DashboardPage] Quick action tidak dikenali:', actionLabel);
      }
    });
  }

  /* ══════════════════════════════════════════
     PICKUP TRACK BUTTON
  ══════════════════════════════════════════ */

  function _bindPickupTrack() {
    DashboardRenderer.bindPickupTrack(() => {
      Modals.comingSoon('Lacak Truk RESIK');
    });
  }

  /* ══════════════════════════════════════════
     METRIC CARD HOVER DETAIL
     Menampilkan info tambahan saat hover
     (enhancement ringan).
  ══════════════════════════════════════════ */

  function _bindMetricCardInteractions() {
    const cards = document.querySelectorAll('#page-dashboard .metric-card');
    cards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
    });
  }

  /* ══════════════════════════════════════════
     STATUS DOT PULSE
     Pastikan animasi pulse-dot berjalan.
  ══════════════════════════════════════════ */

  function _ensureStatusDot() {
    const dot = document.querySelector('#page-dashboard .status-dot');
    if (dot) {
      /* Re-trigger animation jika diperlukan */
      dot.style.animation = 'none';
      requestAnimationFrame(() => {
        dot.style.animation = '';
      });
    }
  }

  /* ══════════════════════════════════════════
     SECTION CARDS ENTRANCE ANIMATION
  ══════════════════════════════════════════ */

  function _animateSectionCards() {
    const cards = document.querySelectorAll(
      '#page-dashboard .section-card, #page-dashboard .reward-card'
    );
    cards.forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = [
          'opacity 300ms cubic-bezier(.22,.68,0,1)',
          'transform 300ms cubic-bezier(.22,.68,0,1)'
        ].join(', ');
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      }, 200 + i * 60);
    });
  }

  /* ══════════════════════════════════════════
     CLEANUP
     Bersihkan interval saat navigasi keluar.
  ══════════════════════════════════════════ */

  function _cleanup() {
    if (_countdownInterval) {
      clearInterval(_countdownInterval);
      _countdownInterval = null;
    }
  }

  /* ══════════════════════════════════════════
     PUBLIC: INIT
  ══════════════════════════════════════════ */

  /**
   * Inisialisasi halaman dashboard.
   * Dipanggil oleh Router setiap kali halaman dashboard diaktifkan.
   *
   * Untuk operasi yang hanya perlu berjalan sekali (event binding),
   * cek AppState.isPageInited('dashboard').
   */
  function init() {
    /* Selalu jalankan renderer (update tanggal, bar, dll.) */
    DashboardRenderer.render();

    /* Update pickup countdown & bar */
    _updatePickupCountdown();
    _updatePickupBar();

    /* Cleanup interval lama jika ada */
    _cleanup();

    /* Mulai countdown interval */
    _countdownInterval = setInterval(() => {
      _updatePickupCountdown();
      _updatePickupBar();
    }, 60_000);

    /* Animasi entrance section cards */
    _animateSectionCards();

    /* Pastikan status dot berjalan */
    _ensureStatusDot();

    /* Event binding — hanya sekali */
    if (!_inited) {
      _bindNotifItems();
      _bindQuickActions();
      _bindPickupTrack();
      _bindSectionLinks();
      _bindMetricCardInteractions();
      _inited = true;
    }

    /* Tandai di state */
    AppState.markPageInited('dashboard');

    console.log('[DashboardPage] Halaman dashboard diinisialisasi.');
  }

  /**
   * Dipanggil saat navigasi meninggalkan halaman dashboard.
   */
  function destroy() {
    _cleanup();
    console.log('[DashboardPage] Halaman dashboard di-destroy.');
  }

  /* ── Public API ── */
  return { init, destroy };

})();