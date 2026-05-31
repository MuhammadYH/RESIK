/**
 * session.js
 * Loads and manages the current user session object.
 * Exposes window.__session and helpers.
 */
(function () {
  'use strict';

  function loadSession() {
    try {
      const raw = sessionStorage.getItem('poros_session');
      if (raw) return JSON.parse(raw);
    } catch (_) {}

    // Fallback: decode JWT payload (no signature validation — server must validate)
    const token = localStorage.getItem('poros_token') || sessionStorage.getItem('poros_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload || null;
    } catch (_) {
      return null;
    }
  }

  const session = loadSession();
  window.__session = session;

  // Expose helpers
  window.PorosSession = {
    get: function () { return window.__session; },
    getUser: function () { return (window.__session || {}).user || null; },
    getRole: function () { return ((window.__session || {}).role || '').toLowerCase(); },
    getName: function () { return (window.__session || {}).name || 'Pengguna'; },
    getEmail: function () { return (window.__session || {}).email || ''; },
  };
})();
