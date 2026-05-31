/**
 * pengolah-navbar.js
 * Manages the sticky topbar: title, mobile search expansion, notification badge.
 * Mirror of admin-navbar.js — adapted for role: Pengolah.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const topbar = document.querySelector('.admin-topbar');
    if (!topbar) return;

    topbar.classList.add('navbar-managed');

    // Page title from <body data-navbar-title>
    const pageTitle = document.body.getAttribute('data-navbar-title') || 'Pengolah';

    topbar.innerHTML = `
      <button class="btn btn-ghost btn-icon mobile-menu-btn" id="mobileMenuBtn" aria-label="Buka menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div class="navbar-title-wrap">
        <h1 class="navbar-title">${pageTitle}</h1>
      </div>

      <!-- Home button -->
      <a class="navbar-home-btn" href="/index.html" title="Kembali ke Beranda" aria-label="Beranda">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </a>

      <div style="display:flex; align-items:center; gap:var(--space-3); margin-left:auto;">
        <!-- Desktop search -->
        <div class="navbar-search-wrap">
          <div class="navbar-search-desktop">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Cari…" aria-label="Cari"/>
          </div>
          <button class="navbar-search-icon-btn" id="searchIconBtn" aria-label="Cari">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>

        <!-- Notification -->
        <div class="topbar-notif" role="button" tabindex="0" aria-label="Notifikasi">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="notif-badge">2</span>
        </div>
      </div>

      <!-- Mobile expanded search bar -->
      <div class="navbar-search-expanded" id="searchExpanded">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Cari…" aria-label="Cari"/>
        <button class="navbar-search-close" id="searchCloseBtn" aria-label="Tutup pencarian">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;

    // Wire mobile menu button (sidebar script also binds it, but we do it here too for safety)
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', function () {
        sidebar.classList.add('open');
        overlay && overlay.classList.add('active');
      });
    }

    // Wire search expand/collapse
    const searchIconBtn  = document.getElementById('searchIconBtn');
    const searchExpanded = document.getElementById('searchExpanded');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const titleWrap      = topbar.querySelector('.navbar-title-wrap');

    if (searchIconBtn && searchExpanded) {
      searchIconBtn.addEventListener('click', function () {
        searchExpanded.classList.add('open');
        titleWrap && titleWrap.classList.add('hidden');
        searchExpanded.querySelector('input') && searchExpanded.querySelector('input').focus();
      });
      searchCloseBtn && searchCloseBtn.addEventListener('click', function () {
        searchExpanded.classList.remove('open');
        titleWrap && titleWrap.classList.remove('hidden');
      });
    }
  });
})();
