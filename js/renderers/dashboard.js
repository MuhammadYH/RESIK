/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/renderers/dashboard.js
   Render konten halaman dashboard:
   greeting + tanggal, animasi metric bars.
═══════════════════════════════════════════════ */

'use strict';

const DashboardRenderer = (() => {

  const DAYS   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli',
                  'Agustus','September','Oktober','November','Desember'];

  /* ── Render greeting date ── */
  function renderGreetingDate() {
    const el = document.getElementById('greeting-date');
    if (!el) return;
    const now = new Date();
    el.textContent = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  }

  /* ── Animate metric progress bars ── */
  function animateMetricBars() {
    document.querySelectorAll('#page-dashboard .metric-bar-fill').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = target; }, 400);
    });
  }

  /**
   * Render semua elemen dashboard yang bersifat dinamis.
   * Dipanggil setiap kali halaman dashboard diaktifkan.
   */
  function render() {
    renderGreetingDate();
    animateMetricBars();
  }

  return { render, renderGreetingDate, animateMetricBars };

})();