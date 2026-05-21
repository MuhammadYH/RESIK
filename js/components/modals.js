/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/components/modals.js
   Komponen modal/dialog generik.
═══════════════════════════════════════════════ */

'use strict';

const Modals = (() => {

  let activeModal = null;

  /* ── Buat overlay backdrop ── */
  function createBackdrop(onClose) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(26,58,42,0.35);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity 240ms cubic-bezier(.22,.68,0,1);
    `;
    backdrop.addEventListener('click', onClose);
    return backdrop;
  }

  /* ── Buat panel modal ── */
  function createPanel(opts) {
    const panel = document.createElement('div');
    panel.className = 'modal-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    if (opts.title) panel.setAttribute('aria-labelledby', 'modal-title');

    panel.style.cssText = `
      position: fixed; z-index: 1001;
      top: 50%; left: 50%;
      transform: translate(-50%, -48%);
      opacity: 0;
      background: rgba(255,255,255,0.96);
      border: 1px solid rgba(82,183,136,0.22);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(26,58,42,0.18);
      padding: 28px;
      width: min(520px, calc(100vw - 32px));
      max-height: calc(100vh - 80px);
      overflow-y: auto;
      transition: opacity 240ms cubic-bezier(.22,.68,0,1), transform 240ms cubic-bezier(.22,.68,0,1);
      font-family: 'DM Sans', system-ui, sans-serif;
    `;

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h2 id="modal-title" style="font-size:17px;font-weight:700;color:#1a3a2a;letter-spacing:-.01em;">
          ${opts.title || ''}
        </h2>
        <button class="modal-close" aria-label="Tutup modal" style="
          width:32px;height:32px;border-radius:50%;border:none;background:rgba(82,183,136,0.10);
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          transition:background .2s;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">${opts.body || ''}</div>
      ${opts.footer ? `<div class="modal-footer" style="margin-top:20px;display:flex;gap:8px;justify-content:flex-end;">${opts.footer}</div>` : ''}
    `;

    return panel;
  }

  /**
   * Buka modal
   * @param {Object} opts - { title, body, footer, onClose }
   */
  function open(opts = {}) {
    if (activeModal) close();

    const onClose = () => {
      close();
      if (typeof opts.onClose === 'function') opts.onClose();
    };

    const backdrop = createBackdrop(onClose);
    const panel    = createPanel(opts);

    panel.querySelector('.modal-close').addEventListener('click', onClose);

    // ESC to close
    const keyHandler = (e) => {
      if (e.key === 'Escape') { onClose(); document.removeEventListener('keydown', keyHandler); }
    };
    document.addEventListener('keydown', keyHandler);

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        backdrop.style.opacity = '1';
        panel.style.opacity    = '1';
        panel.style.transform  = 'translate(-50%, -50%)';
      });
    });

    activeModal = { backdrop, panel, keyHandler };

    // Focus first focusable element
    const focusable = panel.querySelector('button, input, select, textarea, [tabindex]');
    if (focusable) setTimeout(() => focusable.focus(), 260);
  }

  function close() {
    if (!activeModal) return;
    const { backdrop, panel, keyHandler } = activeModal;

    backdrop.style.opacity = '0';
    panel.style.opacity    = '0';
    panel.style.transform  = 'translate(-50%, -48%)';

    setTimeout(() => {
      backdrop.remove();
      panel.remove();
    }, 260);

    document.removeEventListener('keydown', keyHandler);
    activeModal = null;
  }

  /**
   * Modal aksi cepat (info placeholder)
   * @param {string} action - nama aksi dari data-rw-action
   */
  function openActionModal(action) {
    const labels = {
      'add-report':      'Tambah Laporan',
      'schedule-pickup': 'Jadwalkan Pickup',
      'upload-photo':    'Upload Foto',
      'history':         'Riwayat',
      'view-on-map':     'Lihat di Peta',
    };

    open({
      title:  labels[action] || action,
      body:   `<p style="font-size:14px;color:#5a7a68;line-height:1.6;">
                 Fitur <strong>${labels[action] || action}</strong> akan segera tersedia.<br>
                 Terima kasih atas kesabaran Anda! 🌿
               </p>`,
      footer: `<button onclick="Modals.close()" style="
                 padding:9px 20px;border-radius:10px;border:1px solid rgba(82,183,136,0.25);
                 background:rgba(45,106,79,0.10);font-size:13px;font-weight:600;
                 color:#2d6a4f;cursor:pointer;font-family:inherit;
               ">Tutup</button>`,
    });
  }

  return { open, close, openActionModal };

})();