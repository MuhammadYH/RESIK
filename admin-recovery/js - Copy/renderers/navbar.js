/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/renderers/navbar.js
   Render HTML navbar top + bottom dock dari
   config/navigation.js. Export fungsi initNavbar().
═══════════════════════════════════════════════ */

'use strict';

const NavbarRenderer = (function () {

  /* ══════════════════════════════════════════
     RENDER TOP NAVBAR
  ══════════════════════════════════════════ */

  /**
   * Render HTML top navbar ke dalam .rn-header.
   * Struktur: logo | center nav items | profile button
   */
  function renderTopNav() {
    const header = document.querySelector('.rn-header');
    if (!header) {
      console.warn('[NavbarRenderer] .rn-header tidak ditemukan di DOM.');
      return;
    }

    const user  = AppState.getUser();
    const items = NavigationConfig.items.filter(item => !item.dockOnly);

    const navItemsHtml = items.map(item => _buildTopNavItem(item)).join('');

    header.innerHTML = `
      <nav class="rn-top" role="navigation" aria-label="Navigasi utama RESIK">

        <!-- Logo -->
        <a class="rn-logo" href="#" aria-label="${NavigationConfig.logo.ariaLabel}">
          <span class="rn-logo-icon" aria-hidden="true">
            <svg viewBox="${NavigationConfig.logo.iconViewBox}"
                 fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              ${NavigationConfig.logo.icon}
            </svg>
          </span>
          <span class="rn-logo-text">${NavigationConfig.logo.text}</span>
        </a>

        <!-- Center nav items -->
        <div class="rn-center" role="menubar" aria-label="Menu utama">
          ${navItemsHtml}
        </div>

        <!-- Profile -->
        <div class="rn-profile"
             role="button"
             tabindex="0"
             aria-label="${NavigationConfig.profile.ariaLabel}"
             aria-haspopup="true">
          <div class="rn-avatar" aria-hidden="true">${user.initials}</div>
          <span class="rn-uname">${user.name}</span>
          <span class="rn-chev" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>

      </nav>`;
  }

  /**
   * Buat HTML string untuk satu item di top navbar.
   * @param {Object} item - Item dari NavigationConfig.items
   * @returns {string}
   */
  function _buildTopNavItem(item) {
    const badgeHtml = item.badge
      ? `<span class="rn-badge" aria-label="${item.badgeLabel || 'notifikasi baru'}"></span>`
      : '';

    return `
      <button class="rn-item"
              role="menuitem"
              data-page="${item.page}"
              aria-label="${item.label}"
              aria-current="false">
        <span class="rn-icon" aria-hidden="true">
          ${badgeHtml}
          <svg viewBox="${item.iconViewBox}"
               fill="none" stroke="currentColor"
               stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            ${item.icon}
          </svg>
        </span>
        <span class="rn-label" aria-hidden="true">${item.label}</span>
      </button>`;
  }

  /* ══════════════════════════════════════════
     RENDER BOTTOM DOCK
  ══════════════════════════════════════════ */

  /**
   * Render HTML bottom dock ke dalam .rn-dock-wrap.
   * Hanya item yang tidak bertanda topNavOnly yang ditampilkan.
   */
  function renderBottomDock() {
    const dockWrap = document.querySelector('.rn-dock-wrap');
    if (!dockWrap) {
      console.warn('[NavbarRenderer] .rn-dock-wrap tidak ditemukan di DOM.');
      return;
    }

    const dockItems = NavigationConfig.items.filter(item => !item.topNavOnly);

    let dockItemsHtml = '';
    dockItems.forEach(item => {
      if (item.dockSepBefore) {
        dockItemsHtml += `<div class="dock-sep" role="separator" aria-hidden="true"></div>`;
      }
      dockItemsHtml += _buildDockItem(item);
    });

    dockWrap.innerHTML = `
      <nav class="rn-dock" role="menubar">
        ${dockItemsHtml}
      </nav>`;

    dockWrap.setAttribute('aria-label', 'Navigasi bawah');
    dockWrap.setAttribute('role', 'navigation');
  }

  /**
   * Buat HTML string untuk satu item di bottom dock.
   * @param {Object} item - Item dari NavigationConfig.items
   * @returns {string}
   */
  function _buildDockItem(item) {
    return `
      <button class="dock-item"
              role="menuitem"
              data-page="${item.page}"
              aria-label="${item.label}"
              aria-current="false">
        <span class="dock-icon" aria-hidden="true">
          <svg viewBox="${item.iconViewBox}"
               fill="none" stroke="currentColor"
               stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            ${item.icon}
          </svg>
        </span>
        <span class="dock-tip" aria-hidden="true">${item.label}</span>
      </button>`;
  }

  /* ══════════════════════════════════════════
     SET ACTIVE STATE
  ══════════════════════════════════════════ */

  /**
   * Update state aktif pada semua nav item (top + dock)
   * berdasarkan halaman yang sedang aktif.
   *
   * @param {string} page - ID halaman aktif
   */
  function setActive(page) {
    /* Top nav items */
    document.querySelectorAll('.rn-item').forEach(item => {
      const isActive = item.dataset.page === page;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    /* Bottom dock items */
    document.querySelectorAll('.dock-item').forEach(item => {
      const isActive = item.dataset.page === page;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  /* ══════════════════════════════════════════
     BIND EVENTS
  ══════════════════════════════════════════ */

  /**
   * Pasang event listener pada semua nav item dan dock item.
   * Dispatch event resik:navigate saat item diklik.
   */
  function _bindNavEvents() {
    /* Top nav items */
    document.querySelectorAll('.rn-item').forEach(item => {
      item.addEventListener('click', () => {
        _dispatchNavigate(item.dataset.page);
      });
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          _dispatchNavigate(item.dataset.page);
        }
      });
    });

    /* Bottom dock items */
    document.querySelectorAll('.dock-item').forEach(item => {
      item.addEventListener('click', () => {
        _dispatchNavigate(item.dataset.page);
      });
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          _dispatchNavigate(item.dataset.page);
        }
      });
    });

    /* Profile button */
    const profileBtn = document.querySelector('.rn-profile');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        console.log('[NavbarRenderer] Profile menu dibuka');
        document.dispatchEvent(
          new CustomEvent('resik:profile-click', { bubbles: true })
        );
      });
      profileBtn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          profileBtn.click();
        }
      });
    }
  }

  /**
   * Dispatch event resik:navigate dengan detail page.
   * @param {string} page
   */
  function _dispatchNavigate(page) {
    if (!page) return;
    document.dispatchEvent(
      new CustomEvent('resik:navigate', {
        detail:  { page },
        bubbles: true
      })
    );
  }

  /* ══════════════════════════════════════════
     SCROLL SHADOW EFFECT
  ══════════════════════════════════════════ */

  function _bindScrollShadow() {
    const header = document.querySelector('.rn-header');
    if (!header) return;

    let scrolled = false;
    window.addEventListener('scroll', () => {
      const s = window.scrollY > 8;
      if (s !== scrolled) {
        scrolled           = s;
        header.style.paddingTop = s ? '8px' : '14px';
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     RESIZE SYNC
     Sinkronisasi state aktif saat breakpoint berubah.
  ══════════════════════════════════════════ */

  function _bindResizeSync() {
    const MOBILE_BP = 700;
    let wasMobile   = window.innerWidth < MOBILE_BP;

    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth < MOBILE_BP;
      if (isMobile !== wasMobile) {
        wasMobile = isMobile;
        setActive(AppState.getPage());
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     SUBSCRIBE TO STATE CHANGES
  ══════════════════════════════════════════ */

  /**
   * Dengarkan perubahan activePage dari AppState
   * agar navbar selalu sinkron.
   */
  function _subscribeToState() {
    AppState.subscribe('activePage', (newPage) => {
      setActive(newPage);
    });

    /* Sinkronisasi jika user data berubah (misal re-login) */
    AppState.subscribe('currentUser', (newUser) => {
      const avatarEl = document.querySelector('.rn-avatar');
      const unameEl  = document.querySelector('.rn-uname');
      if (avatarEl) avatarEl.textContent = newUser.initials;
      if (unameEl)  unameEl.textContent  = newUser.name;
    });
  }

  /* ══════════════════════════════════════════
     PUBLIC: INIT
  ══════════════════════════════════════════ */

  /**
   * Entry point utama.
   * Render top nav + bottom dock, pasang semua event listener,
   * dan mulai listen state changes.
   *
   * Dipanggil sekali dari app.js saat DOMContentLoaded.
   */
  function initNavbar() {
    renderTopNav();
    renderBottomDock();
    _bindNavEvents();
    _bindScrollShadow();
    _bindResizeSync();
    _subscribeToState();
    console.log('[NavbarRenderer] Navbar berhasil diinisialisasi.');
  }

  /* ── Public API ── */
  return {
    initNavbar,
    renderTopNav,
    renderBottomDock,
    setActive,
    /* expose dispatch untuk dipakai modul lain jika perlu */
    navigate: _dispatchNavigate
  };

})();