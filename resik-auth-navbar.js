/* ════════════════════════════════════════════════════════
   resik-auth-navbar.js — Auth-Aware Navbar Integration
   v1.0 — Persistent Supabase Auth State across all pages
   
   Depends on: resik-supabase.js (RESIK_AUTH must be defined)
   Place: <script src="resik-auth-navbar.js" defer></script>
           after resik-supabase.js, before </body>
   ════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════
     DESKTOP NAV — Profile Dropdown
     Replaces #navAuthArea content based on auth state
     ════════════════════════════════════════════════════════ */

  /**
   * Build the SVG icon set used throughout the dropdown.
   * All icons: Lucide-style outline, stroke-based, currentColor.
   */
  const ICONS = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,

    dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,

    logout: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,

    chevron: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-profile-chevron" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`,

    masuk: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
  };

  /* ── Render: logged-out state (desktop) ── */
  function renderNavGuest(area) {
    area.innerHTML = `
      <a href="login.html" class="nav-btn rsik-nav-masuk" aria-label="Masuk ke RESIK">
        ${ICONS.masuk}
        Masuk
      </a>
    `;
  }

  /* ── Render: logged-in state (desktop) ── */
  function renderNavUser(area, user) {
    const meta      = user.user_metadata || {};
    const firstName = meta.first_name
                      || (user.email ? user.email.split('@')[0] : 'Pengguna');
    const avatarUrl = meta.avatar_url || null;

    /* Avatar: photo or initials fallback */
    const avatarHTML = avatarUrl
      ? `<img src="${avatarUrl}" alt="${firstName}" class="nav-profile-img">`
      : `<span class="nav-profile-initials" aria-hidden="true">${ICONS.user}</span>`;

    area.innerHTML = `
      <div class="nav-profile" id="navProfile" role="button"
           aria-haspopup="true" aria-expanded="false"
           tabindex="0" aria-label="Menu profil ${firstName}">
        <div class="nav-profile-avatar">${avatarHTML}</div>
        <span class="nav-profile-name">${firstName}</span>
        ${ICONS.chevron}

        <div class="nav-profile-dropdown" id="navProfileDropdown" role="menu">
          <div class="nav-dropdown-user">
            <div class="nav-dropdown-user-name">${firstName}</div>
            <div class="nav-dropdown-user-email">${user.email || ''}</div>
          </div>
          <div class="nav-dropdown-divider" role="separator"></div>
          <a href="admin/admin-dashboard.html"
             class="nav-dropdown-item" role="menuitem">
            ${ICONS.dashboard}
            Dashboard
          </a>
          <button class="nav-dropdown-item nav-dropdown-logout"
                  id="navLogoutBtn" role="menuitem"
                  aria-label="Keluar dari akun">
            ${ICONS.logout}
            Keluar
          </button>
        </div>
      </div>
    `;

    /* ── Dropdown toggle (click + keyboard) ── */
    const profile  = area.querySelector('#navProfile');
    const dropdown = area.querySelector('#navProfileDropdown');

    function openDropdown() {
      dropdown.classList.add('open');
      profile.setAttribute('aria-expanded', 'true');
    }
    function closeDropdown() {
      dropdown.classList.remove('open');
      profile.setAttribute('aria-expanded', 'false');
    }
    function toggleDropdown() {
      dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
    }

    profile.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown();
    });

    profile.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(); }
      if (e.key === 'Escape') closeDropdown();
    });

    /* Close on outside click */
    document.addEventListener('click', function handleOutside(e) {
      if (!area.contains(e.target)) closeDropdown();
    });

    /* Close on Escape anywhere */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
    });

    /* ── Logout ── */
    area.querySelector('#navLogoutBtn').addEventListener('click', async function () {
      closeDropdown();
      this.textContent = 'Keluar...';
      this.disabled = true;
      try {
        await RESIK_AUTH.logout();
      } catch (e) {
        console.warn('[RESIK Auth] logout error:', e);
      }
      location.reload();
    });
  }

  /* ════════════════════════════════════════════════════════
     MOBILE DRAWER — Profile section
     Works with existing #drawerProfile / #drawerCta HTML
     ════════════════════════════════════════════════════════ */

  const DRAWER_ICONS = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  };

  function syncDrawerAuth(user) {
    const profile  = document.getElementById('drawerProfile');
    const cta      = document.getElementById('drawerCta');
    if (!profile || !cta) return;

    if (!user) {
      profile.style.display = 'none';
      cta.style.display     = '';
      return;
    }

    const meta      = user.user_metadata || {};
    const firstName = meta.first_name
                      || (user.email ? user.email.split('@')[0] : 'Pengguna');
    const avatarUrl = meta.avatar_url || null;

    /* Populate drawer fields */
    const nameEl   = document.getElementById('drawerName');
    const emailEl  = document.getElementById('drawerEmail');
    const avatarEl = document.getElementById('drawerAvatar');

    if (nameEl)  nameEl.textContent  = firstName;
    if (emailEl) emailEl.textContent = user.email || '';
    if (avatarEl) {
      avatarEl.innerHTML = avatarUrl
        ? `<img src="${avatarUrl}" alt="${firstName}">`
        : DRAWER_ICONS.user;
    }

    profile.style.display = 'flex';
    cta.style.display     = 'none';

    /* Inject dashboard + logout links into drawer if not already there */
    if (!document.getElementById('drawerAuthActions')) {
      const actionsWrap = document.createElement('div');
      actionsWrap.id = 'drawerAuthActions';
      actionsWrap.className = 'drawer-auth-actions';
      actionsWrap.innerHTML = `
        <a href="admin/admin-dashboard.html" class="drawer-action-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </a>
        <button class="drawer-action-link drawer-action-logout" id="drawerLogoutBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Keluar
        </button>
      `;
      /* Insert after drawerProfile */
      profile.insertAdjacentElement('afterend', actionsWrap);

      document.getElementById('drawerLogoutBtn').addEventListener('click', async function () {
        this.textContent = 'Keluar...';
        this.disabled = true;
        try {
          await RESIK_AUTH.logout();
        } catch (e) {
          console.warn('[RESIK Auth] logout error:', e);
        }
        location.reload();
      });
    }
  }

  /* ════════════════════════════════════════════════════════
     CORE: Auth state detection + rendering
     ════════════════════════════════════════════════════════ */

  async function initAuthNavbar() {
    /* ── 1. Find the nav auth area ── */
    const area = document.getElementById('navAuthArea');

    /* ── 2. Guard: wait for RESIK_AUTH to be available ── */
    let attempts = 0;
    while (typeof RESIK_AUTH === 'undefined' && attempts < 30) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }

    /* ── 3. Graceful fallback if Supabase unavailable ── */
    if (typeof RESIK_AUTH === 'undefined') {
      console.warn('[RESIK Auth] RESIK_AUTH not available — showing guest state.');
      if (area) renderNavGuest(area);
      syncDrawerAuth(null);
      return;
    }

    /* ── 4. Get current session ── */
    let user = null;
    try {
      user = await RESIK_AUTH.getUser();
    } catch (e) {
      console.warn('[RESIK Auth] getUser() failed — treating as guest.', e);
    }

    /* ── 5. Render desktop navbar ── */
    if (area) {
      if (user) {
        renderNavUser(area, user);
      } else {
        renderNavGuest(area);
      }
    }

    /* ── 6. Sync mobile drawer ── */
    syncDrawerAuth(user);

    /* ── 7. Remove any duplicate inline drawer auth script result ──
       (Some pages have an inline script that also touches drawerProfile.
        We already handle it above, so neutralise double-render by
        marking the element as managed.) */
    const profile = document.getElementById('drawerProfile');
    if (profile) profile.dataset.managed = 'resik-auth-navbar';
  }

  /* ── Run after DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthNavbar);
  } else {
    initAuthNavbar();
  }

})();
