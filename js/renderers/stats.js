/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/renderers/stats.js
   Render konten halaman statistik:
   animated counters, sparklines, trend chart,
   donut chart, activity feed, eco cards.
═══════════════════════════════════════════════ */

'use strict';

const StatsRenderer = (() => {

  /* ── Animated counter ── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 1400;
    const start  = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const val      = target * ease;
      el.textContent = prefix + Math.round(val).toLocaleString('id-ID') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + Math.round(target).toLocaleString('id-ID') + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ── Bind counters to IntersectionObserver ── */
  function initCounters() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('#page-statistik [data-count]').forEach(el => obs.observe(el));
  }

  /* ── Render activity feed ── */
  const ACTIVITIES = [
    {
      type: 'pickup',
      icon: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
      title: 'Penjemputan Selesai',
      sub:   'Pak Rudi Processor — 18 Kg Nasi & Sayuran',
      time:  '2j lalu'
    },
    {
      type: 'submit',
      icon: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
      title: 'Sampah Dikirim',
      sub:   'Kategori: Nasi + Sayuran — 18 Kg',
      time:  '2j lalu'
    },
    {
      type: 'accept',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
      title: 'Processor Menerima Permintaan',
      sub:   'CV. Hijau Lestari menerima pickup Anda',
      time:  '1h lalu'
    },
    {
      type: 'reward',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      title: 'Reward Ditambahkan',
      sub:   '+Rp 12.000 dari pengiriman 15 Okt',
      time:  '3h lalu'
    },
    {
      type: 'submit',
      icon: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
      title: 'Sampah Dikirim',
      sub:   'Kategori: Buah-buahan — 9 Kg',
      time:  'Kemarin'
    },
  ];

  function renderActivityFeed() {
    const feedEl = document.getElementById('activityFeed');
    if (!feedEl) return;
    feedEl.innerHTML = '';
    ACTIVITIES.forEach(a => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.setAttribute('role', 'article');
      item.innerHTML = `
        <div class="activity-item__icon act--${a.type}" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="${a.icon}"/>
          </svg>
        </div>
        <div class="activity-item__body">
          <div class="activity-item__title">${a.title}</div>
          <div class="activity-item__sub">${a.sub}</div>
        </div>
        <div class="activity-item__time" aria-label="Waktu: ${a.time}">${a.time}</div>
      `;
      feedEl.appendChild(item);
    });
  }

  /* ── Bind chart period tabs ── */
  function bindChartTabs() {
    document.querySelectorAll('#page-statistik .chart-tab[data-period]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#page-statistik .chart-tab[data-period]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        Charts.buildTrendChart(btn.dataset.period);
      });
    });
  }

  /* ── Bind date range buttons ── */
  function bindDateRange() {
    document.querySelectorAll('#page-statistik .date-range__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#page-statistik .date-range__btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log('[RESIK Stats] Rentang waktu:', btn.dataset.range, 'hari');
      });
    });
  }

  /* ── Bind export button ── */
  function bindExport() {
    const exportBtn = document.querySelector('#page-statistik .btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        alert('Fitur ekspor akan tersedia segera. Terima kasih!');
      });
    }
  }

  /**
   * Render & inisialisasi semua konten halaman statistik.
   * Dipanggil sekali saat halaman pertama kali dibuka.
   */
  function render() {
    Charts.applyChartDefaults();
    initCounters();
    Charts.renderAllSparklines();
    Charts.buildTrendChart('monthly');
    Charts.buildCategoryChart();
    renderActivityFeed();
    Tables.initHistoryTable();
    bindChartTabs();
    bindDateRange();
    bindExport();
  }

  return { render };

})();