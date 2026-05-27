/* ═══════════════════════════════════════════════
   RESIK Dashboard — js/config/roles.js
   Definisi roles user (admin, operator, viewer)
═══════════════════════════════════════════════ */

'use strict';

const RolesConfig = {

  /**
   * Definisi semua role yang tersedia dalam sistem RESIK.
   *
   * @property {string}   id          - ID role unik
   * @property {string}   label       - Nama tampilan role
   * @property {string}   description - Deskripsi singkat role
   * @property {string[]} permissions - Daftar permission yang dimiliki role ini
   */
  roles: {

    admin: {
      id: 'admin',
      label: 'Administrator',
      description: 'Akses penuh ke seluruh fitur dashboard RESIK.',
      permissions: [
        'dashboard.view',
        'dashboard.edit',
        'sampah.view',
        'sampah.edit',
        'sampah.delete',
        'sampah.schedule',
        'statistik.view',
        'statistik.export',
        'notifikasi.view',
        'notifikasi.manage',
        'profil.view',
        'profil.edit',
        'users.manage',
        'reports.view',
        'reports.export',
        'marketplace.view',
        'marketplace.manage',
        'management.view',
        'management.edit'
      ]
    },

    operator: {
      id: 'operator',
      label: 'Operator',
      description: 'Dapat mengelola laporan sampah dan menjadwalkan pickup.',
      permissions: [
        'dashboard.view',
        'sampah.view',
        'sampah.edit',
        'sampah.schedule',
        'statistik.view',
        'notifikasi.view',
        'profil.view',
        'profil.edit',
        'reports.view',
        'marketplace.view',
        'management.view',
        'management.edit'
      ]
    },

    viewer: {
      id: 'viewer',
      label: 'Viewer',
      description: 'Hanya dapat melihat data, tidak dapat melakukan perubahan.',
      permissions: [
        'dashboard.view',
        'sampah.view',
        'statistik.view',
        'notifikasi.view',
        'profil.view',
        'reports.view',
        'marketplace.view',
        'management.view'
      ]
    }

  },

  /**
   * Role default yang digunakan jika tidak ada role yang terdefinisi.
   */
  defaultRole: 'viewer',

  /**
   * Cek apakah sebuah role memiliki permission tertentu.
   *
   * @param {string} roleId      - ID role yang dicek
   * @param {string} permission  - Permission string (e.g. 'sampah.edit')
   * @returns {boolean}
   */
  hasPermission(roleId, permission) {
    const role = this.roles[roleId] || this.roles[this.defaultRole];
    return role.permissions.includes(permission);
  },

  /**
   * Ambil semua permission untuk sebuah role.
   *
   * @param {string} roleId
   * @returns {string[]}
   */
  getPermissions(roleId) {
    const role = this.roles[roleId] || this.roles[this.defaultRole];
    return [...role.permissions];
  },

  /**
   * Ambil label tampilan untuk sebuah role.
   *
   * @param {string} roleId
   * @returns {string}
   */
  getRoleLabel(roleId) {
    const role = this.roles[roleId] || this.roles[this.defaultRole];
    return role.label;
  }

};

Object.freeze(RolesConfig);