/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/pages/marketplace.js
   Page controller halaman Marketplace.
   Placeholder — siap dikembangkan lebih lanjut.
═══════════════════════════════════════════════ */

'use strict';

const MarketplacePage = (function () {

  /* ── Internal state ── */
  let _inited = false;

  /* ══════════════════════════════════════════
     DATA PLACEHOLDER
  ══════════════════════════════════════════ */

  /**
   * Data produk marketplace (placeholder).
   * Dalam implementasi nyata, di-fetch dari API.
   */
  const PLACEHOLDER_PRODUCTS = [
    {
      id:       'P001',
      name:     'Kompos Premium BSF',
      category: 'Pupuk Organik',
      price:    15000,
      unit:     'kg',
      stock:    120,
      seller:   'CV. Hijau Lestari',
      badge:    'Terlaris'
    },
    {
      id:       'P002',
      name:     'Maggot Kering BSF',
      category: 'Pakan Ternak',
      price:    35000,
      unit:     'kg',
      stock:    80,
      seller:   'UD. Berkah Compost',
      badge:    'Baru'
    },
    {
      id:       'P003',
      name:     'Biogas Portable Kit',
      category: 'Energi Terbarukan',
      price:    450000,
      unit:     'unit',
      stock:    15,
      seller:   'PT. EcoTech Solutions',
      badge:    null
    },
    {
      id:       'P004',
      name:     'Pupuk Cair Organik',
      category: 'Pupuk Organik',
      price:    12000,
      unit:     'liter',
      stock:    200,
      seller:   'CV. Hijau Lestari',
      badge:    null
    }
  ];

  /* ══════════════════════════════════════════
     RENDER — COMING SOON PLACEHOLDER
  ══════════════════════════════════════════ */

  /**
   * Render konten placeholder untuk halaman marketplace.
   * Dipanggil saat section #page-marketplace ada di DOM
   * tapi belum punya konten.
   */
  function _renderPlaceholder() {
    const page = document.getElementById('page-marketplace');
    if (!page) return;

    /* Jika sudah ada konten, skip */
    if (page.querySelector('.marketplace-content, .rw-wrap, .dash-wrap')) return;

    page.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        flex-direction: column;
        gap: 16px;
        padding: 40px 24px;
      ">
        <div style="
          width: 72px; height: 72px;
          border-radius: 20px;
          background: rgba(82,183,136,0.10);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          margin-bottom: 8px;
        ">🏪</div>

        <div style="
          font-size: 20px;
          font-weight: 700;
          color: var(--eco-dark, #1a3a2a);
          letter-spacing: -.01em;
        ">Marketplace RESIK</div>

        <div style="
          font-size: 13px;
          color: var(--eco-mid, #2d6a4f);
          opacity: .65;
          text-align: center;
          max-width: 320px;
          line-height: 1.6;
        ">
          Temukan produk hasil daur ulang, kompos, maggot BSF,
          dan energi terbarukan dari mitra terpercaya kami.
        </div>

        <div style="
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 8px;
        ">
          ${PLACEHOLDER_PRODUCTS.map(p => _buildProductChip(p)).join('')}
        </div>

        <div style="
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(82,183,136,0.08);
          border: 1px solid rgba(82,183,136,0.18);
          border-radius: 40px;
          padding: 10px 18px;
          font-size: 12px;
          font-weight: 500;
          color: var(--eco-mid, #2d6a4f);
        ">
          <span style="
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #2ecc71;
            box-shadow: 0 0 0 3px rgba(46,204,113,0.25);
            animation: pulse-dot 2.4s ease-in-out infinite;
            flex-shrink: 0;
          "></span>
          Segera hadir — dalam pengembangan aktif
        </div>
      </div>`;
  }

  /**
   * Buat chip produk placeholder.
   * @param {Object} product
   * @returns {string} HTML string
   */
  function _buildProductChip(product) {
    const badgeHtml = product.badge
      ? `<span style="
           font-size: 9px;
           font-weight: 700;
           background: rgba(45,106,79,0.12);
           color: var(--eco-mid, #2d6a4f);
           padding: 2px 6px;
           border-radius: 20px;
           letter-spacing: .03em;
         ">${product.badge}</span>`
      : '';

    return `
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255,255,255,0.72);
        border: 1px solid rgba(82,183,136,0.18);
        border-radius: 12px;
        padding: 10px 14px;
        font-size: 12px;
        cursor: default;
        transition: transform .2s, box-shadow .2s;
      "
      onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(26,58,42,0.09)'"
      onmouseleave="this.style.transform='';this.style.boxShadow=''"
      >
        <div>
          <div style="font-weight:600;color:var(--eco-dark,#1a3a2a);margin-bottom:2px;display:flex;align-items:center;gap:6px">
            ${product.name}
            ${badgeHtml}
          </div>
          <div style="color:var(--eco-mid,#2d6a4f);opacity:.6">
            ${product.category} · Rp ${product.price.toLocaleString('id-ID')}/${product.unit}
          </div>
        </div>
      </div>`;
  }

  /* ══════════════════════════════════════════
     BIND EVENTS
  ══════════════════════════════════════════ */

  function _bindEvents() {
    /* Placeholder: pasang listener untuk tombol/link
       yang akan ada setelah halaman ini dikembangkan. */
    document.dispatchEvent(
      new CustomEvent('resik:marketplace-ready', {
        detail: { products: PLACEHOLDER_PRODUCTS },
        bubbles: true
      })
    );
  }

  /* ══════════════════════════════════════════
     PUBLIC: INIT
  ══════════════════════════════════════════ */

  /**
   * Inisialisasi halaman marketplace.
   * Dipanggil oleh Router saat halaman diaktifkan.
   */
  function init() {
    if (!_inited) {
      _renderPlaceholder();
      _bindEvents();
      _inited = true;
      AppState.markPageInited('marketplace');
      console.log('[MarketplacePage] Halaman marketplace diinisialisasi.');
    } else {
      console.log('[MarketplacePage] Halaman marketplace diaktifkan kembali.');
    }
  }

  /**
   * Kembalikan data produk placeholder.
   * @returns {Array}
   */
  function getProducts() {
    return [...PLACEHOLDER_PRODUCTS];
  }

  /* ── Public API ── */
  return {
    init,
    getProducts,
    PLACEHOLDER_PRODUCTS
  };

})();