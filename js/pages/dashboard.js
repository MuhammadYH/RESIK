/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/dashboard.js
   Page controller dashboard:
   inisialisasi, event listeners, data dinamis.
═══════════════════════════════════════════════ */

'use strict';

const DashboardPage = (() => {

  let inited = false;

  /**
   * Init halaman dashboard.
   * Dipanggil setiap kali router mengaktifkan halaman ini.
   */
  function init() {
    DashboardRenderer.render();

    // Hanya bind event listener sekali
    if (!inited) {
      _bindQuickActions();
      _bindNotifItems();
      _bindPickupAction();
      inited = true;
    }
  }

  /* ── Quick action buttons ── */
  function _bindQuickActions() {
    document.querySelectorAll('#page-dashboard .qa-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.querySelector('.qa-label')?.textContent?.trim() || 'Aksi';
        console.log('[RESIK Dashboard] Aksi cepat:', label);
        // Animasi press
        btn.style.transform = 'scale(.95)';
        setTimeout(() => { btn.style.transform = ''; }, 180);
      });
    });
  }

  /* ── Notifikasi item click ── */
  function _bindNotifItems() {
    document.querySelectorAll('#page-dashboard .notif-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.remove('unread');
        const dot = item.querySelector('.notif-dot');
        if (dot) dot.classList.add('read');
      });
    });
  }

  /* ── Pickup "Lacak" button ── */
  function _bindPickupAction() {
    const btn = document.querySelector('#page-dashboard .pickup-action');
    if (btn) {
      btn.addEventListener('click', () => {
        console.log('[RESIK Dashboard] Lacak truk diklik');
        btn.textContent = 'Melacak...';
        setTimeout(() => { btn.textContent = 'Lacak'; }, 2000);
      });
    }
  }

  return { init };

})();