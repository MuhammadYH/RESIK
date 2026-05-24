/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/state.js
   State management global (activePage, userData, dll)
═══════════════════════════════════════════════ */

'use strict';

/**
 * AppState — satu-satunya sumber kebenaran (single source of truth)
 * untuk state global RESIK SPA.
 *
 * Tidak menggunakan framework; cukup plain object dengan
 * metode getter/setter + sistem subscriber sederhana
 * agar modul lain bisa bereaksi terhadap perubahan state.
 */
const AppState = (function () {

  /* ── Private state ── */
  let _state = {
    activePage: 'dashboard',

    currentUser: {
      name:     'Muhammad R.',
      initials: 'MR',
      fullName: 'Muhammad Rizky',
      role:     'admin'   // 'admin' | 'operator' | 'viewer'
    },

    /* Halaman yang sudah pernah diinisialisasi (lazy init tracking) */
    initializedPages: new Set(),

    /* Flag loading global */
    isLoading: false,

    /* Notifikasi badge count */
    notifCount: 3,

    /* Timestamp terakhir data di-refresh */
    lastRefresh: null
  };

  /* ── Subscriber registry ── */
  const _subscribers = {};

  /**
   * Subscribe ke perubahan key tertentu di state.
   * @param {string}   key      - Key state yang di-listen
   * @param {Function} callback - Dipanggil dengan (newValue, oldValue)
   * @returns {Function} unsubscribe function
   */
  function subscribe(key, callback) {
    if (!_subscribers[key]) _subscribers[key] = [];
    _subscribers[key].push(callback);
    return function unsubscribe() {
      _subscribers[key] = _subscribers[key].filter(cb => cb !== callback);
    };
  }

  /**
   * Notify semua subscriber untuk key tertentu.
   * @param {string} key
   * @param {*}      newValue
   * @param {*}      oldValue
   */
  function _notify(key, newValue, oldValue) {
    if (!_subscribers[key]) return;
    _subscribers[key].forEach(cb => {
      try { cb(newValue, oldValue); }
      catch (err) { console.error('[AppState] Subscriber error untuk key "' + key + '":', err); }
    });
  }

  /* ══════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════ */
  return {

    /* ── Active Page ── */

    /**
     * Set halaman aktif.
     * @param {string} page - ID halaman (tanpa prefix "page-")
     */
    setPage(page) {
      const prev = _state.activePage;
      if (prev === page) return;
      _state.activePage = page;
      _notify('activePage', page, prev);
    },

    /**
     * Get halaman aktif saat ini.
     * @returns {string}
     */
    getPage() {
      return _state.activePage;
    },

    /* ── Current User ── */

    /**
     * Get data user yang sedang login.
     * Mengembalikan salinan (bukan referensi langsung).
     * @returns {{ name: string, initials: string, fullName: string, role: string }}
     */
    getUser() {
      return { ..._state.currentUser };
    },

    /**
     * Update data user.
     * @param {{ name?: string, initials?: string, fullName?: string, role?: string }} updates
     */
    setUser(updates) {
      const prev = { ..._state.currentUser };
      _state.currentUser = { ..._state.currentUser, ...updates };
      _notify('currentUser', { ..._state.currentUser }, prev);
    },

    /* ── Initialized Pages ── */

    /**
     * Tandai halaman sebagai sudah diinisialisasi.
     * @param {string} page
     */
    markPageInited(page) {
      _state.initializedPages.add(page);
    },

    /**
     * Cek apakah halaman sudah pernah diinisialisasi.
     * @param {string} page
     * @returns {boolean}
     */
    isPageInited(page) {
      return _state.initializedPages.has(page);
    },

    /* ── Loading State ── */

    /**
     * Set flag loading global.
     * @param {boolean} loading
     */
    setLoading(loading) {
      const prev = _state.isLoading;
      _state.isLoading = Boolean(loading);
      _notify('isLoading', _state.isLoading, prev);
    },

    /**
     * Get status loading saat ini.
     * @returns {boolean}
     */
    isLoading() {
      return _state.isLoading;
    },

    /* ── Notif Count ── */

    /**
     * Get jumlah notifikasi belum dibaca.
     * @returns {number}
     */
    getNotifCount() {
      return _state.notifCount;
    },

    /**
     * Set jumlah notifikasi belum dibaca.
     * @param {number} count
     */
    setNotifCount(count) {
      const prev = _state.notifCount;
      _state.notifCount = Math.max(0, count);
      _notify('notifCount', _state.notifCount, prev);
    },

    /* ── Last Refresh ── */

    /**
     * Update timestamp terakhir data di-refresh.
     */
    touchRefresh() {
      _state.lastRefresh = new Date();
      _notify('lastRefresh', _state.lastRefresh, null);
    },

    /**
     * Get timestamp terakhir refresh.
     * @returns {Date|null}
     */
    getLastRefresh() {
      return _state.lastRefresh;
    },

    /* ── Subscribe ── */
    subscribe,

    /* ── Debug helper (dev only) ── */
    _dump() {
      return JSON.parse(JSON.stringify({
        activePage:       _state.activePage,
        currentUser:      _state.currentUser,
        initializedPages: [..._state.initializedPages],
        isLoading:        _state.isLoading,
        notifCount:       _state.notifCount,
        lastRefresh:      _state.lastRefresh
      }));
    }

  };

})();