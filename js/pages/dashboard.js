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
      metaEl.textContent = hrs > 0 ? `~${hrs} jam ${mins} menit lagi` : `~${mins} menit lagi`;
    } else if (diff > -3600000) {
      metaEl.textContent = 'Sedang berlangsung';
    } else {
      metaEl.textContent = 'Selesai hari ini';
    }
  }

  function _updatePickupBar() {
    const bar = document.querySelector(
      '#page-dashboard .metric-card:nth-child(2) .metric-bar-fill'
    );
    if (!bar) return;
    const now   = new Date();
    const start = new Date(); start.setHours(6, 0, 0, 0);
    const end   = new Date(); end.setHours(9, 0, 0, 0);
    const total   = end - start;
    const elapsed = Math.max(0, Math.min(total, now - start));
    bar.style.width = Math.round((elapsed / total) * 100) + '%';
  }

  function _bindNotifItems() {
    const items = document.querySelectorAll('#page-dashboard .notif-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.remove('unread');
        const dot = item.querySelector('.notif-dot');
        if (dot) dot.classList.add('read');
        const remaining = document.querySelectorAll('#page-dashboard .notif-item.unread').length;
        AppState.setNotifCount(remaining);
      });
    });
  }

  function _bindSectionLinks() {
    const chartLink = document.querySelector('#page-dashboard .bottom-grid .section-link');
    if (chartLink) {
      chartLink.addEventListener('click', e => {
        e.preventDefault();
        NavbarRenderer.navigate('statistik');
      });
    }
  }

  function _bindQuickActions() {
    DashboardRenderer.bindQuickActions((actionLabel) => {
      switch (actionLabel) {
        case 'Lapor Sampah': NavbarRenderer.navigate('sampah'); break;
        case 'Jadwalkan':    NavbarRenderer.navigate('sampah'); break;
        case 'Lihat Rute':   Modals.comingSoon('Lihat Rute Pickup'); break;
        default: console.log('[DashboardPage] Quick action tidak dikenali:', actionLabel);
      }
    });
  }

  function _bindPickupTrack() {
    DashboardRenderer.bindPickupTrack(() => {
      Modals.comingSoon('Lacak Truk RESIK');
    });
  }

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

  function _ensureStatusDot() {
    const dot = document.querySelector('#page-dashboard .status-dot');
    if (dot) {
      dot.style.animation = 'none';
      requestAnimationFrame(() => { dot.style.animation = ''; });
    }
  }

  function _animateSectionCards() {
    const cards = document.querySelectorAll('#page-dashboard .section-card, #page-dashboard .reward-card');
    cards.forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'opacity 300ms cubic-bezier(.22,.68,0,1), transform 300ms cubic-bezier(.22,.68,0,1)';
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      }, 200 + i * 60);
    });
  }

  function _cleanup() {
    if (_countdownInterval) {
      clearInterval(_countdownInterval);
      _countdownInterval = null;
    }
  }

  function init() {
    DashboardRenderer.render();
    _updatePickupCountdown();
    _updatePickupBar();
    _cleanup();
    _countdownInterval = setInterval(() => {
      _updatePickupCountdown();
      _updatePickupBar();
    }, 60_000);
    _animateSectionCards();
    _ensureStatusDot();
    if (!_inited) {
      _bindNotifItems();
      _bindQuickActions();
      _bindPickupTrack();
      _bindSectionLinks();
      _bindMetricCardInteractions();
      _inited = true;
    }
    AppState.markPageInited('dashboard');
    console.log('[DashboardPage] Halaman dashboard diinisialisasi.');
  }

  function destroy() {
    _cleanup();
    console.log('[DashboardPage] Halaman dashboard di-destroy.');
  }

  return { init, destroy };

})();
