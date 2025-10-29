// js/admin/tambah-pengguna.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-tambah-pengguna");
  const roleSelect = document.getElementById("role");
  const btnCancel = document.querySelector(".btn-cancel");

  // Navigasi berdasarkan role yang dipilih
  if (roleSelect) {
    roleSelect.addEventListener("change", function () {
      const v = this.value;

      if (v === "siswa") {
        window.location.href = "tambah-pengguna-siswa.html";
      } else if (v === "guru") {
        window.location.href = "tambah-pengguna-guru.html";
      } else if (v === "admin") {
        window.location.href = "tambah-pengguna-admin.html";
      }
    });
  }

  // Tombol batal
  if (btnCancel) {
    btnCancel.addEventListener("click", function () {
      window.history.back();
    });
  }

  // Placeholder untuk submit (bisa ditambah validasi)
  if (form) {
    form.addEventListener("submit", function (e) {
      // e.preventDefault();
    });
  }
});
