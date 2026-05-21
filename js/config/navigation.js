/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/config/navigation.js
   Konfigurasi item navigasi (data-page, icon, label)
═══════════════════════════════════════════════ */

'use strict';

const NavigationConfig = {

  /**
   * Item navigasi utama.
   * Digunakan oleh NavbarRenderer untuk membuat top nav & bottom dock.
   *
   * @property {string}  page      - ID halaman (tanpa prefix "page-"), juga dipakai sebagai data-page
   * @property {string}  label     - Label teks yang ditampilkan
   * @property {string}  icon      - SVG path/content (tanpa wrapper <svg>)
   * @property {string}  iconViewBox - viewBox attribute untuk <svg>
   * @property {boolean} [badge]   - Tampilkan notification badge (dot merah)
   * @property {boolean} [dockSepBefore] - Tambahkan separator sebelum item ini di dock
   */
  items: [
    {
      page: 'dashboard',
      label: 'Dashboard',
      iconViewBox: '0 0 24 24',
      icon: `<rect x="3" y="3" width="7" height="7" rx="1.5"/>
             <rect x="14" y="3" width="7" height="7" rx="1.5"/>
             <rect x="3" y="14" width="7" height="7" rx="1.5"/>
             <rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
      badge: false,
      dockSepBefore: false
    },
    {
      page: 'sampah',
      label: 'Sampah',
      iconViewBox: '0 0 24 24',
      icon: `<polyline points="3 6 5 6 21 6"/>
             <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
             <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>`,
      badge: false,
      dockSepBefore: false
    },
    {
      page: 'statistik',
      label: 'Statistik',
      iconViewBox: '0 0 24 24',
      icon: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
      badge: false,
      dockSepBefore: false
    },
    {
      page: 'notifikasi',
      label: 'Notifikasi',
      iconViewBox: '0 0 24 24',
      icon: `<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
             <path d="M13.73 21a2 2 0 01-3.46 0"/>`,
      badge: true,
      badgeLabel: '3 notifikasi baru',
      dockSepBefore: true   // separator sebelum item ini di bottom dock
    },
    {
      page: 'search',
      label: 'Cari',
      iconViewBox: '0 0 24 24',
      icon: `<circle cx="11" cy="11" r="8"/>
             <line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
      badge: false,
      dockSepBefore: false,
      topNavOnly: true      // hanya tampil di top nav, tidak di bottom dock
    },
    {
      page: 'profil',
      label: 'Profil',
      iconViewBox: '0 0 24 24',
      icon: `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
             <circle cx="12" cy="7" r="4"/>`,
      badge: false,
      dockSepBefore: false,
      dockOnly: true        // hanya tampil di bottom dock, tidak di top nav center
    }
  ],

  /**
   * Konfigurasi logo RESIK di top nav.
   */
  logo: {
    text: 'RESIK',
    ariaLabel: 'RESIK beranda',
    iconViewBox: '0 0 24 24',
    icon: `<path d="M12 2L4 7v10l8 5 8-5V7z"/>
           <path d="M12 12v8M12 12L4 7M12 12l8-5"/>`
  },

  /**
   * Konfigurasi profil user di top nav.
   * Data dinamis diambil dari AppState.currentUser.
   */
  profile: {
    ariaLabel: 'Menu profil pengguna'
  },

  /**
   * Halaman-halaman yang dikenali oleh router.
   * Harus sesuai dengan id section di admin.html (tanpa prefix "page-").
   */
  pages: ['dashboard', 'sampah', 'statistik', 'notifikasi', 'search', 'profil']

};

/* Freeze agar tidak sengaja dimodifikasi */
Object.freeze(NavigationConfig);
Object.freeze(NavigationConfig.logo);
Object.freeze(NavigationConfig.profile);