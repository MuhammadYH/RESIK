/* provider-pengaturan.js — Settings interactions */
(function () {

  /* ── Sidebar nav scrollspy ── */
  const navItems = document.querySelectorAll('.pengaturan-nav-item[data-section]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  /* ── Toast helper ── */
  function showToast(msg) {
    const toast = document.getElementById('saveToast');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg || 'Perubahan disimpan!';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ── Save buttons ── */
  document.querySelectorAll('.btn-save-section').forEach(btn => {
    btn.addEventListener('click', () => showToast('Perubahan berhasil disimpan!'));
  });

  /* ── Form auto-save indicator ── */
  document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
    input.addEventListener('change', () => {
      // Optional: show unsaved indicator
    });
  });

  /* ── Toggle switches ── */
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', () => {
      // Could trigger auto-save
    });
  });

  /* ── Danger zone confirm ── */
  document.getElementById('btnDeleteAccount')?.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
      alert('Permintaan penghapusan akun telah dikirim ke tim support.');
    }
  });

  /* ── Avatar upload preview ── */
  document.getElementById('avatarInput')?.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById('avatarPreview');
      if (preview) {
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Avatar"/>`;
      }
    };
    reader.readAsDataURL(file);
  });

  /* ── Password strength ── */
  const pwdInput = document.getElementById('newPassword');
  const strengthBar = document.getElementById('pwdStrengthBar');
  const strengthText = document.getElementById('pwdStrengthText');
  if (pwdInput && strengthBar && strengthText) {
    pwdInput.addEventListener('input', () => {
      const val = pwdInput.value;
      let score = 0;
      if (val.length >= 8)   score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      const labels = ['','Lemah','Sedang','Kuat','Sangat Kuat'];
      const colors = ['','#C62828','#F57F17','#2E7D32','#1B5E20'];
      const widths = ['0%','25%','50%','75%','100%'];
      strengthBar.style.width   = widths[score];
      strengthBar.style.background = colors[score];
      strengthText.textContent  = labels[score];
      strengthText.style.color  = colors[score];
    });
  }

})();
