/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/management.js
   Page controller halaman Manajemen Sampah (rw-*):
   renderBins, simulateFreshness,
   updatePickupCountdown, filter, expand cards.
═══════════════════════════════════════════════ */

'use strict';

const ManagementPage = (() => {

  let inited     = false;
  let binInterval = null;

  const DAYS   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli',
                  'Agustus','September','Oktober','November','Desember'];

  /* ── Smart bin data ── */
  const BIN_DATA = [
    { id:'BIN-01', name:'Sungkono',     location:'Kec. Dukuh Pakis', pct:34,  online:true,  syncMins:2  },
    { id:'BIN-02', name:'Wonokromo',    location:'Kec. Wonokromo',   pct:91,  online:true,  syncMins:1  },
    { id:'BIN-03', name:'Genteng',      location:'Kec. Genteng',     pct:55,  online:true,  syncMins:4  },
    { id:'BIN-04', name:'Tegalsari',    location:'Kec. Tegalsari',   pct:22,  online:true,  syncMins:3  },
    { id:'BIN-05', name:'Darmo',        location:'Jl. Raya Darmo',   pct:67,  online:true,  syncMins:5  },
    { id:'BIN-06', name:'Kenjeran',     location:'Kec. Kenjeran',    pct:78,  online:true,  syncMins:7  },
    { id:'BIN-07', name:'Keputran',     location:'Pasar Keputran',   pct:61,  online:true,  syncMins:2  },
    { id:'BIN-08', name:'Gubeng',       location:'Kec. Gubeng',      pct:18,  online:true,  syncMins:6  },
    { id:'BIN-09', name:'Dharmahusada', location:'Kec. Mulyorejo',   pct:44,  online:true,  syncMins:3  },
    { id:'BIN-10', name:'Lakarsantri',  location:'Kec. Lakarsantri', pct:0,   online:false, syncMins:92 },
  ];

  function _binStatus(pct, online) {
    if (!online)    return 'offline';
    if (pct >= 90)  return 'red';
    if (pct >= 60)  return 'yellow';
    return 'green';
  }

  /* ── Render smart bin grid ── */
  function renderBins() {
    const grid = document.getElementById('rw-bin-grid');
    if (!grid) return;

    let green = 0, yellow = 0, red = 0, active = 0;

    grid.innerHTML = BIN_DATA.map(bin => {
      const s = _binStatus(bin.pct, bin.online);
      if (bin.online) active++;
      if (s === 'green')  green++;
      if (s === 'yellow') yellow++;
      if (s === 'red')    red++;

      const card = Cards.createBinCard(bin, s);
      return card.outerHTML;
    }).join('');

    /* Update summary counters */
    const el = id => document.getElementById(id);
    if (el('rw-bin-count-green'))  el('rw-bin-count-green').textContent  = green;
    if (el('rw-bin-count-yellow')) el('rw-bin-count-yellow').textContent = yellow;
    if (el('rw-bin-count-red'))    el('rw-bin-count-red').textContent    = red;
    if (el('rw-bin-active-count')) el('rw-bin-active-count').textContent = `${active} aktif`;

    /* Animate gauge fills */
    requestAnimationFrame(() => {
      grid.querySelectorAll('.rw-bin-gauge-fill').forEach(fill => {
        const t = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => { fill.style.width = t; }, 200 + Math.random() * 150);
      });
    });
  }

  /* ── Simulate freshness for waste cards ── */
  const FRESHNESS_THRESHOLDS = {
    '09:45': 2, '06:20': 5, '22:10': 12,
    '10:55': 1, '04:30': 7, '08:15': 3
  };

  function simulateFreshness() {
    document.querySelectorAll('#rw-list .rw-card').forEach(card => {
      const timeEl = card.querySelector('.rw-card-time');
      if (!timeEl) return;
      const h     = FRESHNESS_THRESHOLDS[timeEl.textContent.trim()] ?? 0;
      const fresh = h < 4 ? 'fresh' : h < 10 ? 'warn' : 'urgent';
      const labels = { fresh:'Fresh', warn:'Segera', urgent:'Urgent' };

      const badge = card.querySelector('.rw-fresh-badge');
      const fill  = card.querySelector('.rw-progress-fill');

      if (badge) {
        badge.className = `rw-fresh-badge ${fresh}`;
        badge.innerHTML = `<span class="rw-fresh-badge-dot"></span>${labels[fresh]}`;
      }
      if (fill) fill.className = `rw-progress-fill ${fresh}`;
      card.dataset.rwFresh = fresh;
    });
  }

  /* ── Pickup countdown ── */
  function updatePickupCountdown() {
    const el = document.getElementById('rw-pickup-countdown');
    if (!el) return;
    const now    = new Date();
    const pickup = new Date();
    pickup.setHours(13, 30, 0, 0);
    const diff = pickup - now;
    if (diff > 0) {
      const mins = Math.floor(diff / 60000);
      const hrs  = Math.floor(mins / 60);
      const rem  = mins % 60;
      el.textContent = `Pickup berikutnya · ${hrs > 0 ? `${hrs} jam ${rem} menit` : `${mins} menit`} lagi`;
    } else {
      el.textContent = 'Pickup berikutnya';
    }
  }

  /* ── Filter buttons ── */
  function _bindFilters() {
    const filterBtns = document.querySelectorAll('[data-rw-filter]');
    const cards      = document.querySelectorAll('#rw-list .rw-card');
    const countEl    = document.getElementById('rw-list-count');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');
        _applyFilter(btn.dataset.rwFilter, cards, countEl);
      });
    });
  }

  function _applyFilter(filter, cards, countEl) {
    let visible = 0;
    cards.forEach(card => {
      const fresh  = card.dataset.rwFresh;
      const pickup = card.dataset.rwPickup;
      const show   = filter === 'all'
        || (filter === 'fresh'     && fresh  === 'fresh')
        || (filter === 'warn'      && fresh  === 'warn')
        || (filter === 'urgent'    && fresh  === 'urgent')
        || (filter === 'scheduled' && pickup === 'scheduled');

      if (show) {
        card.style.display   = '';
        card.style.opacity   = '0';
        card.style.transform = 'translateY(6px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 280ms cubic-bezier(.22,.68,0,1), transform 280ms cubic-bezier(.22,.68,0,1)';
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';
        });
        visible++;
      } else {
        card.classList.remove('expanded');
        card.style.opacity   = '0';
        card.style.transform = 'translateY(-4px)';
        setTimeout(() => { card.style.display = 'none'; }, 240);
      }
    });
    if (countEl) setTimeout(() => { countEl.textContent = `${visible} item`; }, 260);
  }

  /* ── Expand/collapse cards ── */
  function _bindCardExpand() {
    const cards = document.querySelectorAll('#rw-list .rw-card');
    cards.forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.rw-detail-btn')) return;
        const isExpanded = card.classList.contains('expanded');
        // Collapse others
        cards.forEach(c => {
          if (c !== card) {
            c.classList.remove('expanded');
            c.setAttribute('aria-expanded', 'false');
            const d = c.querySelector('.rw-card-detail');
            if (d) d.setAttribute('aria-hidden', 'true');
          }
        });
        card.classList.toggle('expanded', !isExpanded);
        card.setAttribute('aria-expanded', String(!isExpanded));
        const detail = card.querySelector('.rw-card-detail');
        if (detail) detail.setAttribute('aria-hidden', String(isExpanded));
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });
    });
  }

  /* ── Quick action & detail buttons ── */
  function _bindActions() {
    document.querySelectorAll('#page-sampah [data-rw-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.rwAction;
        btn.style.transform = 'scale(.94)';
        setTimeout(() => { btn.style.transform = ''; }, 200);

        if (typeof Modals !== 'undefined') {
          Modals.openActionModal(action);
        }
        document.dispatchEvent(new CustomEvent('rw:action', { detail: { action }, bubbles: true }));
        console.log('[RESIK Waste] Aksi:', action);
      });
    });
  }

  /* ── Metric entrance animation ── */
  function _animateMetrics() {
    document.querySelectorAll('#page-sampah .rw-metric').forEach((c, i) => {
      c.style.opacity   = '0';
      c.style.transform = 'translateY(12px)';
      setTimeout(() => {
        c.style.transition = 'opacity 320ms cubic-bezier(.22,.68,0,1), transform 320ms cubic-bezier(.22,.68,0,1)';
        c.style.opacity    = '1';
        c.style.transform  = 'translateY(0)';
      }, 60 + i * 55);
    });
  }

  /* ── Progress bar entrance ── */
  function _animateBars() {
    document.querySelectorAll('#page-sampah .rw-progress-fill, #page-sampah .rw-impact-bar').forEach(bar => {
      const t = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = t; }, 350 + Math.random() * 200);
    });
  }

  /* ── Render date chip ── */
  function _renderDateChip() {
    const el = document.getElementById('rw-date-text');
    if (!el) return;
    const now = new Date();
    el.textContent = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  }

  /**
   * Init halaman sampah.
   * Dipanggil sekali saat halaman pertama kali dibuka.
   */
  function init() {
    if (inited) return;
    inited = true;

    _renderDateChip();
    _animateMetrics();
    _animateBars();
    renderBins();
    simulateFreshness();

    // Update freshness setiap 1 menit
    setInterval(simulateFreshness, 60_000);

    updatePickupCountdown();
    setInterval(updatePickupCountdown, 30_000);

    // Live bin updates setiap 30 detik
    if (binInterval) clearInterval(binInterval);
    binInterval = setInterval(() => {
      BIN_DATA.forEach(bin => {
        if (!bin.online) return;
        bin.pct = Math.max(0, Math.min(100, bin.pct + (Math.random() > .5 ? 1 : -1)));
      });
      renderBins();
    }, 30_000);

    _bindCardExpand();
    _bindFilters();
    _bindActions();
  }

  return { init, renderBins, simulateFreshness, updatePickupCountdown };

})();