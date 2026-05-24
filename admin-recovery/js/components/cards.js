/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/cards.js
   Komponen card reusable (metric-card, stat-card, rw-card)
═══════════════════════════════════════════════ */

'use strict';

const Cards = (function () {

  /* ══════════════════════════════════════════
     METRIC CARD (Dashboard hero grid)
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string untuk metric-card di dashboard.
   *
   * @param {Object} opts
   * @param {string} opts.iconClass       - Kelas warna icon: 'green' | 'teal' | 'gold'
   * @param {string} opts.iconPath        - SVG path content (tanpa <svg> wrapper)
   * @param {string} opts.badgeClass      - Kelas badge: 'badge-up' | 'badge-warn' | 'badge-info'
   * @param {string} opts.badgeText       - Teks badge (e.g. '↑ 12%')
   * @param {string} opts.value           - Nilai utama (bisa mengandung HTML untuk unit)
   * @param {string} opts.label           - Label deskripsi
   * @param {number} opts.barWidth        - Lebar progress bar 0–100 (%)
   * @param {string} [opts.barStyle]      - Override inline style untuk bar fill
   * @param {string} opts.metaLeft        - Teks meta kiri (e.g. 'Target: 70 kg')
   * @param {string} opts.metaRight       - Teks meta kanan (e.g. '68%')
   * @param {string} [opts.ariaLabel]     - aria-label untuk article
   * @returns {string} HTML string
   */
  function metricCard(opts) {
    const barStyle = opts.barStyle
      ? `style="width:${opts.barWidth}%;${opts.barStyle}"`
      : `style="width:${opts.barWidth}%"`;

    return `
      <div class="metric-card" role="article" aria-label="${opts.ariaLabel || ''}">
        <div class="metric-header">
          <div class="metric-icon ${opts.iconClass}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                 aria-hidden="true">
              ${opts.iconPath}
            </svg>
          </div>
          <span class="metric-badge ${opts.badgeClass}">${opts.badgeText}</span>
        </div>
        <div class="metric-value">${opts.value}</div>
        <p class="metric-label">${opts.label}</p>
        <div class="metric-bar">
          <div class="metric-bar-fill" ${barStyle}></div>
        </div>
        <div class="metric-footer">
          <span class="metric-meta">${opts.metaLeft}</span>
          <span class="metric-meta">${opts.metaRight}</span>
        </div>
      </div>`;
  }

  /* ══════════════════════════════════════════
     RW METRIC CARD (Halaman Sampah)
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string untuk rw-metric di halaman Sampah.
   *
   * @param {Object} opts
   * @param {string} opts.iconClass     - Kelas warna icon: 'green' | 'teal' | 'amber' | 'leaf'
   * @param {string} opts.iconPath      - SVG path content
   * @param {string} opts.deltaClass    - 'up' | 'down'
   * @param {string} opts.deltaText     - Teks delta (e.g. '↑ 12%')
   * @param {string} opts.value         - Nilai utama
   * @param {string} opts.unit          - Satuan (e.g. ' kg', ' laporan')
   * @param {string} opts.label         - Label deskripsi
   * @returns {string} HTML string
   */
  function rwMetricCard(opts) {
    return `
      <article class="rw-metric">
        <div class="rw-metric-top">
          <div class="rw-metric-icon ${opts.iconClass}" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              ${opts.iconPath}
            </svg>
          </div>
          <span class="rw-metric-delta ${opts.deltaClass}">${opts.deltaText}</span>
        </div>
        <div class="rw-metric-value">
          ${opts.value}<span class="rw-metric-unit">${opts.unit}</span>
        </div>
        <div class="rw-metric-label">${opts.label}</div>
      </article>`;
  }

  /* ══════════════════════════════════════════
     RW WASTE CARD (Laporan Food Waste)
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string untuk rw-card (kartu laporan food waste).
   *
   * @param {Object} opts
   * @param {string}  opts.emoji           - Emoji ikon (e.g. '🍱')
   * @param {string}  opts.name            - Nama laporan
   * @param {string}  opts.meta            - Meta info (e.g. 'Dilaporkan 2 jam lalu · Kec. Genteng')
   * @param {string}  opts.freshClass      - 'fresh' | 'warn' | 'urgent'
   * @param {string}  opts.freshLabel      - 'Fresh' | 'Segera' | 'Urgent'
   * @param {string}  opts.pickupClass     - 'waiting' | 'scheduled' | 'done'
   * @param {string}  opts.pickupLabel     - Teks chip pickup
   * @param {string}  opts.weight          - Berat (e.g. '12 kg')
   * @param {number}  opts.progressWidth   - Lebar progress 0–100 (%)
   * @param {string}  opts.time            - Waktu singkat (e.g. '09:45')
   * @param {Object}  opts.detail          - Data detail expand
   * @param {string}  opts.detail.pelapor
   * @param {string}  opts.detail.kategori
   * @param {string}  opts.detail.koordinat
   * @param {string}  opts.detail.smartBin
   * @param {string}  opts.detail.volume
   * @param {string}  opts.detail.konversi
   * @param {string}  opts.detail.primaryBtnLabel
   * @param {string}  opts.detail.primaryBtnAction
   * @param {string}  opts.detail.secondaryBtnLabel
   * @param {string}  opts.detail.secondaryBtnAction
   * @param {string}  [opts.dataFresh]     - data-rw-fresh attribute value
   * @param {string}  [opts.dataPickup]    - data-rw-pickup attribute value
   * @returns {string} HTML string
   */
  function rwCard(opts) {
    const d = opts.detail || {};
    return `
      <article class="rw-card"
               data-rw-fresh="${opts.dataFresh || opts.freshClass}"
               data-rw-pickup="${opts.dataPickup || opts.pickupClass}"
               tabindex="0"
               aria-expanded="false">
        <div class="rw-card-top">
          <div class="rw-card-left">
            <div class="rw-card-emoji">${opts.emoji}</div>
            <div>
              <div class="rw-card-name">${opts.name}</div>
              <div class="rw-card-meta">${opts.meta}</div>
            </div>
          </div>
          <div class="rw-card-badges">
            <span class="rw-fresh-badge ${opts.freshClass}">
              <span class="rw-fresh-badge-dot"></span>
              ${opts.freshLabel}
            </span>
            <span class="rw-pickup-chip ${opts.pickupClass}">${opts.pickupLabel}</span>
            <span class="rw-card-expand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
        </div>
        <div class="rw-card-footer">
          <span class="rw-card-weight">${opts.weight}</span>
          <div class="rw-progress-wrap">
            <div class="rw-progress-fill ${opts.freshClass}"
                 style="width:${opts.progressWidth}%"></div>
          </div>
          <span class="rw-card-time">${opts.time}</span>
        </div>
        <div class="rw-card-detail" aria-hidden="true">
          <div class="rw-card-detail-inner">
            ${_rwDetailRow('Pelapor',    d.pelapor    || '')}
            ${_rwDetailRow('Kategori',   d.kategori   || '')}
            ${_rwDetailRow('Koordinat',  d.koordinat  || '', true)}
            ${_rwDetailRow('Smart Bin',  d.smartBin   || '')}
            ${_rwDetailRow('Volume Est.',d.volume     || '')}
            ${_rwDetailRow('Konversi',   d.konversi   || '')}
            <div class="rw-card-detail-actions">
              <button class="rw-detail-btn primary"
                      data-rw-action="${d.primaryBtnAction || 'schedule-pickup'}">
                ${d.primaryBtnLabel || 'Jadwalkan Pickup'}
              </button>
              <button class="rw-detail-btn"
                      data-rw-action="${d.secondaryBtnAction || 'view-on-map'}">
                ${d.secondaryBtnLabel || 'Lihat di Peta'}
              </button>
            </div>
          </div>
        </div>
      </article>`;
  }

  /** Helper: baris detail di dalam rw-card expand */
  function _rwDetailRow(label, value, mono = false) {
    return `
      <div class="rw-detail-row">
        <span class="rw-detail-label">${label}</span>
        <span class="rw-detail-val${mono ? ' mono' : ''}">${value}</span>
      </div>`;
  }

  /* ══════════════════════════════════════════
     RW BIN CARD (Smart Bin Fleet)
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string untuk rw-bin-card.
   *
   * @param {Object}  bin
   * @param {string}  bin.id         - ID bin (e.g. 'BIN-01')
   * @param {string}  bin.name       - Nama lokasi
   * @param {string}  bin.location   - Detail lokasi
   * @param {number}  bin.pct        - Persentase kapasitas 0–100
   * @param {boolean} bin.online     - Status online
   * @param {number}  bin.syncMins   - Menit sejak sync terakhir
   * @returns {string} HTML string
   */
  function rwBinCard(bin) {
    const status    = _binStatus(bin.pct, bin.online);
    const label     = _binLabel(status);
    const syncText  = bin.online
      ? (bin.syncMins < 60
          ? `${bin.syncMins} mnt lalu`
          : `${Math.round(bin.syncMins / 60)} jam lalu`)
      : 'Tidak terhubung';
    const pctDisplay = bin.online ? `${bin.pct}%` : '—';
    const gaugeWidth = bin.online ? bin.pct : 0;

    return `
      <div class="rw-bin-card ${status}" role="listitem">
        <div class="rw-bin-top">
          <div class="rw-bin-icon">🗑️</div>
          <span class="rw-bin-badge">
            <span class="rw-bin-badge-dot"></span>
            ${label}
          </span>
        </div>
        <div class="rw-bin-name">${bin.id} · ${bin.name}</div>
        <div class="rw-bin-location">${bin.location}</div>
        <div class="rw-bin-gauge-wrap">
          <div class="rw-bin-gauge-bar">
            <div class="rw-bin-gauge-fill" style="width:${gaugeWidth}%"></div>
          </div>
          <span class="rw-bin-pct">${pctDisplay}</span>
        </div>
        <div class="rw-bin-sync">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          ${syncText}
        </div>
      </div>`;
  }

  /** Tentukan status visual bin berdasarkan pct & online */
  function _binStatus(pct, online) {
    if (!online) return 'offline';
    if (pct >= 90) return 'red';
    if (pct >= 60) return 'yellow';
    return 'green';
  }

  /** Label teks untuk status bin */
  function _binLabel(status) {
    return {
      green:   'Normal',
      yellow:  'Hampir Penuh',
      red:     'Penuh!',
      offline: 'Offline'
    }[status] || 'Unknown';
  }

  /* ══════════════════════════════════════════
     STAT CARD (Halaman Statistik)
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string untuk stat-card di halaman Statistik.
   *
   * @param {Object} opts
   * @param {string} opts.colorClass    - Modifier class: 'green'|'teal'|'amber'|'sky'|'violet'|'coral'
   * @param {string} opts.animDelay     - Kelas delay: 'anim-delay-1' dst
   * @param {string} opts.iconPath      - SVG path content
   * @param {string} opts.badgeClass    - 'badge--up' | 'badge--down' | 'badge--flat'
   * @param {string} opts.badgeText     - Teks badge
   * @param {string} opts.valueAttr     - data-count attribute value
   * @param {string} [opts.valueSuffix] - data-suffix value (e.g. ' Kg')
   * @param {string} [opts.valuePrefix] - data-prefix value (e.g. 'Rp ')
   * @param {string} [opts.valueFormat] - 'currency' jika perlu format ribuan
   * @param {string} [opts.valueStyle]  - Inline style override untuk value el
   * @param {string} opts.label         - Label deskripsi
   * @param {string} opts.trendHtml     - HTML konten trend (bisa berisi span)
   * @param {string} opts.sparkId       - ID canvas sparkline (e.g. 'spark1')
   * @param {boolean} [opts.noSpark]    - Set true jika tidak ada sparkline
   * @returns {string} HTML string
   */
  function statCard(opts) {
    const valueAttrs = [
      `data-count="${opts.valueAttr}"`,
      opts.valueSuffix ? `data-suffix="${opts.valueSuffix}"` : '',
      opts.valuePrefix ? `data-prefix="${opts.valuePrefix}"` : '',
      opts.valueFormat ? `data-format="${opts.valueFormat}"` : '',
    ].filter(Boolean).join(' ');

    const valueStyle = opts.valueStyle ? ` style="${opts.valueStyle}"` : '';

    const sparkline = opts.noSpark
      ? ''
      : `<canvas class="stat-card__sparkline" id="${opts.sparkId}" aria-hidden="true"></canvas>`;

    return `
      <article class="stat-card stat-card--${opts.colorClass} anim-in ${opts.animDelay || ''}">
        <div class="stat-card__top">
          <div class="stat-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              ${opts.iconPath}
            </svg>
          </div>
          <span class="stat-card__badge ${opts.badgeClass}">${opts.badgeText}</span>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__value" ${valueAttrs}${valueStyle}>
            ${opts.valuePrefix || ''}0${opts.valueSuffix || ''}
          </div>
          <div class="stat-card__label">${opts.label}</div>
          <div class="stat-card__trend">${opts.trendHtml}</div>
        </div>
        ${sparkline}
      </article>`;
  }

  /* ══════════════════════════════════════════
     ECO CARD (Halaman Statistik — dampak)
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string untuk eco-card.
   *
   * @param {Object} opts
   * @param {string} opts.modifier   - 'landfill' | 'co2' | 'trees'
   * @param {string} opts.emoji      - Emoji icon
   * @param {string} opts.count      - data-count value
   * @param {string} opts.unit       - Satuan (e.g. 'Kg')
   * @param {string} opts.label      - Label utama
   * @param {string} opts.detail     - Teks detail/deskripsi
   * @returns {string} HTML string
   */
  function ecoCard(opts) {
    return `
      <div class="eco-card eco-card--${opts.modifier}">
        <div class="eco-card__icon" aria-hidden="true">${opts.emoji}</div>
        <div>
          <span class="eco-card__value" data-count="${opts.count}" data-suffix="">0</span>
          <span class="eco-card__unit">${opts.unit}</span>
        </div>
        <div class="eco-card__label">${opts.label}</div>
        <div class="eco-card__detail">${opts.detail}</div>
      </div>`;
  }

  /* ══════════════════════════════════════════
     SECTION CARD WRAPPER
  ══════════════════════════════════════════ */

  /**
   * Buat HTML string untuk section-card (container glass card).
   *
   * @param {Object} opts
   * @param {string} opts.title       - Judul section
   * @param {string} [opts.linkText]  - Teks link di kanan header
   * @param {string} [opts.linkHref]  - href link
   * @param {string} [opts.linkAriaLabel]
   * @param {string} opts.bodyHtml    - HTML konten body
   * @param {string} [opts.ariaLabel] - aria-label untuk section wrapper
   * @returns {string} HTML string
   */
  function sectionCard(opts) {
    const link = opts.linkText
      ? `<a class="section-link" href="${opts.linkHref || '#'}"
             aria-label="${opts.linkAriaLabel || opts.linkText}">
           ${opts.linkText}
         </a>`
      : '';

    return `
      <div class="section-card" role="region" aria-label="${opts.ariaLabel || opts.title}">
        <div class="section-header">
          <span class="section-title">${opts.title}</span>
          ${link}
        </div>
        <div class="section-body">${opts.bodyHtml}</div>
      </div>`;
  }

  /* ══════════════════════════════════════════
     ANIMATE ENTRANCE
  ══════════════════════════════════════════ */

  /**
   * Jalankan animasi entrance pada kumpulan elemen card.
   * Dipakai saat halaman pertama kali dibuka.
   *
   * @param {NodeList|Element[]} elements - Elemen-elemen yang akan dianimasikan
   * @param {number} [baseDelay=60]       - Delay awal dalam ms
   * @param {number} [step=55]            - Tambahan delay per elemen (ms)
   */
  function animateEntrance(elements, baseDelay = 60, step = 55) {
    elements.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(12px)';
      setTimeout(() => {
        el.style.transition = [
          `opacity 320ms var(--ease-fluid, cubic-bezier(.22,.68,0,1))`,
          `transform 320ms var(--ease-fluid, cubic-bezier(.22,.68,0,1))`
        ].join(', ');
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, baseDelay + i * step);
    });
  }

  /**
   * Animasikan progress bar (dari 0 ke target width).
   * Ambil target dari style.width yang sudah di-set di HTML.
   *
   * @param {NodeList|Element[]} bars     - Elemen bar fill
   * @param {number} [baseDelay=350]      - Delay awal (ms)
   */
  function animateBars(bars, baseDelay = 350) {
    bars.forEach(bar => {
      const target      = bar.style.width;
      bar.style.width   = '0%';
      setTimeout(() => {
        bar.style.width = target;
      }, baseDelay + Math.random() * 200);
    });
  }

  /* ── Public API ── */
  return {
    metricCard,
    rwMetricCard,
    rwCard,
    rwBinCard,
    statCard,
    ecoCard,
    sectionCard,
    animateEntrance,
    animateBars,
    /* expose helpers for external use */
    binStatus: _binStatus,
    binLabel:  _binLabel
  };

})();