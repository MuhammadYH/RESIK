/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/cards.js
   Komponen card reusable: metric-card, rw-card, rw-bin-card
═══════════════════════════════════════════════ */

'use strict';

const Cards = (() => {

  /**
   * Membuat HTML metric card (halaman dashboard)
   * @param {Object} opts
   * @param {string} opts.iconClass   - 'green' | 'teal' | 'gold'
   * @param {string} opts.iconPath    - SVG path/shapes string
   * @param {string} opts.badge       - teks badge
   * @param {string} opts.badgeClass  - 'badge-up' | 'badge-warn' | 'badge-info'
   * @param {string} opts.value       - nilai utama (angka)
   * @param {string} opts.unit        - satuan (opsional)
   * @param {string} opts.label       - label deskripsi
   * @param {number} opts.barWidth    - lebar progress bar dalam %
   * @param {string} opts.barStyle    - custom style untuk bar fill (opsional)
   * @param {string} opts.metaLeft    - teks meta kiri
   * @param {string} opts.metaRight   - teks meta kanan
   * @param {number} opts.animDelay   - delay animasi dalam ms
   */
  function createMetricCard(opts) {
    const el = document.createElement('div');
    el.className = 'metric-card';
    el.setAttribute('role', 'article');
    if (opts.ariaLabel) el.setAttribute('aria-label', opts.ariaLabel);
    if (opts.animDelay) el.style.animationDelay = opts.animDelay + 'ms';

    el.innerHTML = `
      <div class="metric-header">
        <div class="metric-icon ${opts.iconClass}">
          <svg viewBox="0 0 24 24">${opts.iconPath}</svg>
        </div>
        <span class="metric-badge ${opts.badgeClass}">${opts.badge}</span>
      </div>
      <div class="metric-value">${opts.value}${opts.unit ? `<span class="metric-value-unit">${opts.unit}</span>` : ''}</div>
      <p class="metric-label">${opts.label}</p>
      <div class="metric-bar">
        <div class="metric-bar-fill" style="width:0%;${opts.barStyle || ''}"></div>
      </div>
      <div class="metric-footer">
        <span class="metric-meta">${opts.metaLeft}</span>
        <span class="metric-meta">${opts.metaRight}</span>
      </div>
    `;

    // Animate bar after insertion
    requestAnimationFrame(() => {
      setTimeout(() => {
        const fill = el.querySelector('.metric-bar-fill');
        if (fill) fill.style.width = (opts.barWidth || 0) + '%';
      }, 400);
    });

    return el;
  }

  /**
   * Membuat HTML stat card (halaman statistik)
   * @param {Object} opts
   */
  function createStatCard(opts) {
    const el = document.createElement('article');
    el.className = `stat-card stat-card--${opts.colorVariant} anim-in ${opts.animDelayClass || ''}`;

    const sparklineId = opts.sparklineId || '';
    el.innerHTML = `
      <div class="stat-card__top">
        <div class="stat-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">${opts.iconPath}</svg>
        </div>
        <span class="stat-card__badge ${opts.badgeClass}">${opts.badge}</span>
      </div>
      <div class="stat-card__body">
        <div class="stat-card__value"
          ${opts.dataCount !== undefined ? `data-count="${opts.dataCount}"` : ''}
          ${opts.dataSuffix ? `data-suffix="${opts.dataSuffix}"` : ''}
          ${opts.dataPrefix ? `data-prefix="${opts.dataPrefix}"` : ''}
          ${opts.dataFormat ? `data-format="${opts.dataFormat}"` : ''}
        >${opts.valueDisplay}</div>
        <div class="stat-card__label">${opts.label}</div>
        <div class="stat-card__trend">
          <span class="stat-card__trend-val ${opts.trendClass || ''}">${opts.trendVal}</span>
          <span>${opts.trendLabel || ''}</span>
        </div>
      </div>
      ${sparklineId ? `<canvas class="stat-card__sparkline" id="${sparklineId}" aria-hidden="true"></canvas>` : ''}
    `;

    return el;
  }

  /**
   * Membuat HTML rw-card (laporan food waste)
   * @param {Object} opts
   */
  function createRwCard(opts) {
    const el = document.createElement('article');
    el.className = 'rw-card';
    el.dataset.rwFresh  = opts.fresh;
    el.dataset.rwPickup = opts.pickup;
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-expanded', 'false');

    const pickupLabels = { waiting: 'Menunggu', scheduled: 'Terjadwal', done: 'Selesai ✓' };
    const pickupClasses = { waiting: 'waiting', scheduled: 'scheduled', done: 'done' };
    const freshLabels = { fresh: 'Fresh', warn: 'Segera', urgent: 'Urgent' };

    el.innerHTML = `
      <div class="rw-card-top">
        <div class="rw-card-left">
          <div class="rw-card-emoji">${opts.emoji}</div>
          <div>
            <div class="rw-card-name">${opts.name}</div>
            <div class="rw-card-meta">${opts.meta}</div>
          </div>
        </div>
        <div class="rw-card-badges">
          <span class="rw-fresh-badge ${opts.fresh}">
            <span class="rw-fresh-badge-dot"></span>${freshLabels[opts.fresh]}
          </span>
          <span class="rw-pickup-chip ${pickupClasses[opts.pickup]}">${pickupLabels[opts.pickup]}</span>
          <span class="rw-card-expand-icon">
            <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      </div>
      <div class="rw-card-footer">
        <span class="rw-card-weight">${opts.weight}</span>
        <div class="rw-progress-wrap">
          <div class="rw-progress-fill ${opts.fresh}" style="width:${opts.progressWidth}%"></div>
        </div>
        <span class="rw-card-time">${opts.time}</span>
      </div>
      <div class="rw-card-detail">
        <div class="rw-card-detail-inner">
          ${opts.details.map(d => `
            <div class="rw-detail-row">
              <span class="rw-detail-label">${d.label}</span>
              <span class="rw-detail-val${d.mono ? ' mono' : ''}">${d.value}</span>
            </div>
          `).join('')}
          <div class="rw-card-detail-actions">
            ${opts.actions.map(a => `
              <button class="rw-detail-btn${a.primary ? ' primary' : ''}" data-rw-action="${a.action}">${a.label}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    return el;
  }

  /**
   * Membuat HTML bin card (Smart Bin Fleet)
   * @param {Object} bin  - dari BIN_DATA
   * @param {string} status - 'green'|'yellow'|'red'|'offline'
   */
  function createBinCard(bin, status) {
    const labels = { green: 'Normal', yellow: 'Hampir Penuh', red: 'Penuh!', offline: 'Offline' };
    const syncText = bin.online
      ? (bin.syncMins < 60 ? `${bin.syncMins} mnt lalu` : `${Math.round(bin.syncMins / 60)} jam lalu`)
      : 'Tidak terhubung';
    const pctDisplay = bin.online ? `${bin.pct}%` : '—';

    const el = document.createElement('div');
    el.className = `rw-bin-card ${status}`;
    el.setAttribute('role', 'listitem');

    el.innerHTML = `
      <div class="rw-bin-top">
        <div class="rw-bin-icon">🗑️</div>
        <span class="rw-bin-badge">
          <span class="rw-bin-badge-dot"></span>${labels[status]}
        </span>
      </div>
      <div class="rw-bin-name">${bin.id} · ${bin.name}</div>
      <div class="rw-bin-location">${bin.location}</div>
      <div class="rw-bin-gauge-wrap">
        <div class="rw-bin-gauge-bar">
          <div class="rw-bin-gauge-fill" style="width:${bin.online ? bin.pct : 0}%"></div>
        </div>
        <span class="rw-bin-pct">${pctDisplay}</span>
      </div>
      <div class="rw-bin-sync">
        <svg viewBox="0 0 24 24">
          <path d="M23 4v6h-6"/>
          <path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
        ${syncText}
      </div>
    `;

    return el;
  }

  /**
   * Membuat eco-card (statistik dampak lingkungan)
   */
  function createEcoCard(opts) {
    const el = document.createElement('div');
    el.className = `eco-card eco-card--${opts.variant}`;

    el.innerHTML = `
      <div class="eco-card__icon" aria-hidden="true">${opts.icon}</div>
      <div>
        <span class="eco-card__value" data-count="${opts.count}" data-suffix="">${opts.valueDisplay}</span>
        <span class="eco-card__unit">${opts.unit}</span>
      </div>
      <div class="eco-card__label">${opts.label}</div>
      <div class="eco-card__detail">${opts.detail}</div>
    `;

    return el;
  }

  return {
    createMetricCard,
    createStatCard,
    createRwCard,
    createBinCard,
    createEcoCard,
  };

})();