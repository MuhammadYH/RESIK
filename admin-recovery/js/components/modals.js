/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/modals.js
   Komponen modal/dialog
═══════════════════════════════════════════════ */

'use strict';

const Modals = (function () {

  /* ── State ── */
  let _activeModal  = null;
  let _lastFocusEl  = null;

  /* ── Konstanta ── */
  const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  /* ══════════════════════════════════════════
     MODAL CONTAINER
     Satu overlay dipakai semua modal.
  ══════════════════════════════════════════ */

  function _ensureOverlay() {
    let overlay = document.getElementById('resik-modal-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id            = 'resik-modal-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      z-index: 900;
      background: rgba(26,58,42,0.45);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      align-items: center;
      justify-content: center;
      padding: 20px;
      transition: opacity 240ms cubic-bezier(.22,.68,0,1);
      opacity: 0;
    `;
    overlay.setAttribute('role', 'presentation');
    document.body.appendChild(overlay);

    /* Tutup saat klik di luar modal */
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    return overlay;
  }

  /* ══════════════════════════════════════════
     OPEN
  ══════════════════════════════════════════ */

  /**
   * Buka modal dengan konten HTML.
   *
   * @param {Object} opts
   * @param {string}   opts.title         - Judul modal
   * @param {string}   opts.bodyHtml      - HTML konten body
   * @param {string}   [opts.size]        - 'sm' | 'md' | 'lg' (default 'md')
   * @param {Function} [opts.onClose]     - Callback saat modal ditutup
   * @param {string}   [opts.confirmText] - Teks tombol konfirmasi
   * @param {Function} [opts.onConfirm]   - Callback saat konfirmasi
   * @param {string}   [opts.cancelText]  - Teks tombol batal (default 'Batal')
   * @param {boolean}  [opts.hideCancel]  - Sembunyikan tombol batal
   */
  function open(opts) {
    const overlay = _ensureOverlay();
    _lastFocusEl  = document.activeElement;

    const sizeMap = { sm: '400px', md: '540px', lg: '720px' };
    const maxW    = sizeMap[opts.size] || sizeMap.md;

    const hasFooter = opts.confirmText || !opts.hideCancel;

    const footerHtml = hasFooter ? `
      <div style="
        padding: 16px 24px;
        border-top: 1px solid rgba(82,183,136,0.15);
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      ">
        ${!opts.hideCancel ? `
          <button id="resik-modal-cancel" style="
            padding: 9px 18px;
            border-radius: 10px;
            border: 1px solid rgba(82,183,136,0.22);
            background: transparent;
            font-size: 13px;
            font-weight: 500;
            color: var(--eco-mid, #2d6a4f);
            cursor: pointer;
            font-family: var(--font-main, 'DM Sans', sans-serif);
            transition: background .2s;
          ">${opts.cancelText || 'Batal'}</button>
        ` : ''}
        ${opts.confirmText ? `
          <button id="resik-modal-confirm" style="
            padding: 9px 18px;
            border-radius: 10px;
            border: none;
            background: var(--eco-mid, #2d6a4f);
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;            font-family: var(--font-main, 'DM Sans', sans-serif);
            transition: background .2s;
          ">${opts.confirmText}</button>
        ` : ''}
      </div>
    ` : '';

    overlay.innerHTML = `
      <div id="resik-modal-box" role="dialog" aria-modal="true" aria-labelledby="resik-modal-title" style="
        background: #fff;
        border-radius: 18px;
        width: 100%;
        max-width: ${maxW};
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 24px 64px rgba(26,58,42,0.18);
        display: flex;
        flex-direction: column;
        position: relative;
        animation: modalIn 220ms cubic-bezier(.22,.68,0,1) forwards;
      ">
        <div style="
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(82,183,136,0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        ">
          <h2 id="resik-modal-title" style="
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: var(--eco-dark, #1a3a2a);
            font-family: var(--font-main, 'DM Sans', sans-serif);
          ">${opts.title || ''}</h2>
          <button id="resik-modal-close" aria-label="Tutup modal" style="
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 8px;
            color: var(--eco-mid, #2d6a4f);
            display: flex;
            align-items: center;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style="
          padding: 20px 24px;
          font-size: 14px;
          line-height: 1.65;
          color: var(--eco-text, #2d3a32);
          font-family: var(--font-main, 'DM Sans', sans-serif);
          flex: 1;
        ">${opts.bodyHtml || ''}</div>
        ${footerHtml}
      </div>`;

    /* Animasi keyframe */
    if (!document.getElementById('resik-modal-keyframes')) {
      const style = document.createElement('style');
      style.id = 'resik-modal-keyframes';
      style.textContent = `
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);   }
        }`;
      document.head.appendChild(style);
    }

    /* Tampilkan overlay */
    overlay.style.display  = 'flex';
    _activeModal           = opts;

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    /* Bind tombol */
    const closeBtn   = document.getElementById('resik-modal-close');
    const cancelBtn  = document.getElementById('resik-modal-cancel');
    const confirmBtn = document.getElementById('resik-modal-confirm');

    if (closeBtn)   closeBtn.addEventListener('click',  () => close());
    if (cancelBtn)  cancelBtn.addEventListener('click', () => close());
    if (confirmBtn) confirmBtn.addEventListener('click', () => {
      if (typeof opts.onConfirm === 'function') opts.onConfirm();
      close();
    });

    /* Keyboard trap: Escape */
    document.addEventListener('keydown', _handleKeydown);

    /* Focus ke modal */
    requestAnimationFrame(() => {
      const firstFocusable = overlay.querySelector(FOCUSABLE);
      if (firstFocusable) firstFocusable.focus();
    });
  }

  /* ══════════════════════════════════════════
     CLOSE
  ══════════════════════════════════════════ */

  function close() {
    const overlay = document.getElementById('resik-modal-overlay');
    if (!overlay) return;

    overlay.style.opacity = '0';

    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.innerHTML     = '';
      if (_lastFocusEl && typeof _lastFocusEl.focus === 'function') {
        _lastFocusEl.focus();
      }
      if (_activeModal && typeof _activeModal.onClose === 'function') {
        _activeModal.onClose();
      }
      _activeModal = null;
    }, 240);

    document.removeEventListener('keydown', _handleKeydown);
  }

  /* ══════════════════════════════════════════
     KEYBOARD HANDLER
  ══════════════════════════════════════════ */

  function _handleKeydown(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }

    /* Tab trap */
    if (e.key === 'Tab') {
      const overlay    = document.getElementById('resik-modal-overlay');
      if (!overlay) return;
      const focusable  = Array.from(overlay.querySelectorAll(FOCUSABLE));
      if (!focusable.length) return;
      const first      = focusable[0];
      const last       = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
  }

  /* ══════════════════════════════════════════
     SHORTHAND HELPERS
  ══════════════════════════════════════════ */

  /**
   * Tampilkan modal alert sederhana (hanya tombol OK).
   * @param {string} title
   * @param {string} bodyHtml
   */
  function alert(title, bodyHtml) {
    open({
      title,
      bodyHtml,
      confirmText: 'OK',
      hideCancel:  true,
      size:        'sm'
    });
  }

  /**
   * Tampilkan modal konfirmasi (tombol Konfirmasi + Batal).
   * @param {string}   title
   * @param {string}   bodyHtml
   * @param {Function} onConfirm
   * @param {string}   [confirmText]
   */
  function confirm(title, bodyHtml, onConfirm, confirmText) {
    open({
      title,
      bodyHtml,
      confirmText: confirmText || 'Konfirmasi',
      onConfirm,
      size: 'sm'
    });
  }

  /**
   * Modal "segera hadir" untuk fitur yang belum tersedia.
   * @param {string} featureName
   */
  function comingSoon(featureName) {
    alert(
      featureName || 'Segera Hadir',
      `<div style="text-align:center;padding:10px 0">
        <div style="font-size:36px;margin-bottom:10px">🚧</div>
        <p style="margin:0;color:var(--eco-mid,#2d6a4f)">
          Fitur <strong>${featureName || 'ini'}</strong> sedang dalam pengembangan.<br/>Nantikan pembaruan berikutnya!
        </p>
      </div>`
    );
  }

  /* ── Public API ── */
  return {
    open,
    close,
    alert,
    confirm,
    comingSoon
  };

})();
