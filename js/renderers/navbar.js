/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/renderers/navbar.js
   Render HTML navbar top + bottom dock dari
   config/navigation.js. Kelola state aktif,
   scroll shadow, dan resize sync.
═══════════════════════════════════════════════ */

'use strict';

const NavbarRenderer = (() => {

  /* ── Render top navbar ── */
  function renderTopNav() {
    const container = document.getElementById('rn-top-nav');
    if (!container) return;

    const items = NavigationConfig.items.map(item => `
      <button class="rn-item" role="menuitem" data-page="${item.page}"
        aria-label="${item.label}"
        ${item.page === AppState.getPage() ? 'aria-current="page"' : ''}>
        <span class="rn-icon" aria-hidden="true">
          ${item.badge ? `<span class="rn-badge" aria-label="${item.badge}"></span>` : ''}
          <svg viewBox="0 0 24 24">${item.icon}</svg>
        </span>
        <span class="rn-label" aria-hidden="true">${item.label}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <a class="rn-logo" href="#" aria-label="RESIK beranda">
        <span class="rn-logo-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L4 7v10l8 5 8-5V7z"/>
            <path d="M12 12v8M12 12L4 7M12 12l8-5"/>
          </svg>
        </span>
        <span class="rn-logo-text">RESIK</span>
      </a>

      <div class="rn-center" role="menubar" aria-label="Menu utama">
        ${items}
      </div>

      <div class="rn-profile" role="button" tabindex="0"
        aria-label="Menu profil pengguna" aria-haspopup="true">
        <div class="rn-avatar" aria-hidden="true">${AppState.getUser().initials}</div>
        <span class="rn-uname">${AppState.getUser().name}</span>
        <span class="rn-chev" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>
    `;
  }

  /* ── Render bottom dock ── */
  function renderBottomDock() {
    const container = document.getElementById('rn-dock-nav');
    if (!container) return;

    const activePage = AppState.getPage();
    let html = '';

    NavigationConfig.items
      .filter(item => !item.topNavOnly)
      .forEach(item => {
        if (item.dockSepBefore) {
          html += `<div class="dock-sep" role="separator" aria-hidden="true"></div>`;
        }
        html += `
          <button class="dock-item${item.page === activePage ? ' active' : ''}"
            role="menuitem" data-page="${item.page}"
            ${item.page === activePage ? 'aria-current="page"' : ''}
            aria-label="${item.label}">
            <span class="dock-icon" aria-hidden="true">
              ${item.badge ? `<span class="rn-badge" aria-label="${item.badgeLabel || ''}"></span>` : ''}
              <svg viewBox="${item.iconViewBox}">${item.icon}</svg>
            </span>
            <span class="dock-tip" aria-hidden="true">${item.label}</span>
          </button>
        `;
      });

    container.innerHTML = html;
  }

  /* ── Bind nav event listeners ── */
  function bindNavEvents() {
    // Top nav items
    document.querySelectorAll('.rn-center .rn-item').forEach(item => {
      item.addEventListener('click', () => _setActive(item.dataset.page));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _setActive(item.dataset.page); }
      });
    });

    // Dock items
    document.querySelectorAll('.dock-item').forEach(item => {
      item.addEventListener('click', () => _setActive(item.dataset.page));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _setActive(item.dataset.page); }
      });
    });

    // Profile button
    const profileBtn = document.querySelector('.rn-profile');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => console.log('[RESIK] Profile menu dibuka'));
      profileBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); profileBtn.click(); }
      });
    }
  }

  /* ── Set nav item active state ── */
  function setNavActive(page) {
    document.querySelectorAll('.rn-item').forEach(item => {
      const a = item.dataset.page === page;
      item.classList.toggle('active', a);
      item.setAttribute('aria-current', a ? 'page' : 'false');
    });
    document.querySelectorAll('.dock-item').forEach(item => {
      const a = item.dataset.page === page;
      item.classList.toggle('active', a);
      item.setAttribute('aria-current', a ? 'page' : 'false');
    });
  }

  /* ── Scroll shadow effect ── */
  function bindScrollShadow() {
    const header = document.querySelector('.rn-header');
    if (!header) return;
    let scrolled = false;
    window.addEventListener('scroll', () => {
      const s = window.scrollY > 8;
      if (s !== scrolled) {
        scrolled = s;
        header.style.paddingTop = s ? '8px' : '14px';
      }
    }, { passive: true });
  }

  /* ── Resize: re-sync active state ── */
  function bindResizeSync() {
    const MOBILE_BP = 700;
    let wasMobile = window.innerWidth < MOBILE_BP;
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth < MOBILE_BP;
      if (isMobile !== wasMobile) {
        wasMobile = isMobile;
        setNavActive(AppState.getPage());
      }
    }, { passive: true });
  }

  function _setActive(page) {
    setNavActive(page);
    document.dispatchEvent(new CustomEvent('resik:navigate', { detail: { page } }));
  }

  /**
   * Inisialisasi & render seluruh navbar
   */
  function init() {
    renderTopNav();
    renderBottomDock();
    bindNavEvents();
    bindScrollShadow();
    bindResizeSync();
    setNavActive(AppState.getPage());
  }

  return { init, setNavActive, renderTopNav, renderBottomDock };

})();