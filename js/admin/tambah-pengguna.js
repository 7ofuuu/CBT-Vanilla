/* ==========================================================
   TAMBAH-PENGGUNA.JS — Switch Form by Role + UX helpers
   Berlaku untuk:
   - tambah-pengguna.html (default)
   - tambah-pengguna-admin.html
   - tambah-pengguna-guru.html
   - tambah-pengguna-siswa.html
   ========================================================== */

/* ---------- Breadcrumb: kembali ke daftar pengguna ---------- */
function initBreadcrumb() {
  const breadcrumb = document.querySelector(".breadcrumb-back");
  if (!breadcrumb) return;
  breadcrumb.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "./semua-pengguna.html";
  });
}

/* ---------- Role Switch: pindah ke halaman form yang sesuai ---------- */
function handleRoleChange(e) {
  const value = (e?.target?.value || "").toLowerCase();

  // Peta role → file HTML (semua di folder yang sama)
  const route = {
    "": "./tambah-pengguna.html",          // fallback / "Pilih Role *"
    admin: "./tambah-pengguna-admin.html",
    guru: "./tambah-pengguna-guru.html",
    siswa: "./tambah-pengguna-siswa.html",
  };

  const target = route[value] || route[""];

  // Hindari reload ke halaman yang sama
  const current = window.location.pathname.split("/").pop();
  const targetFile = target.replace("./", "");
  if (current !== targetFile) window.location.href = target;
}

/* ---------- Cancel → back ---------- */
function initCancel() {
  const btnCancel = document.querySelector(".btn-cancel");
  if (btnCancel) btnCancel.addEventListener("click", () => window.history.back());
}

/* ---------- Sinkronkan value select role dengan halaman aktif ---------- */
function syncRoleSelectToPage() {
  const roleSelect = document.getElementById("role");
  if (!roleSelect) return;

  const file = window.location.pathname.split("/").pop().toLowerCase();

  if (file.includes("admin")) roleSelect.value = "admin";
  else if (file.includes("guru")) roleSelect.value = "guru";
  else if (file.includes("siswa")) roleSelect.value = "siswa";
  else roleSelect.value = ""; // halaman default "tambah-pengguna.html"
}

/* ---------- (Opsional) Submit handler: cegah reload & validasi ringan ---------- */
function initSubmitGuard() {
  const form = document.querySelector(".form-tambah-pengguna");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    // contoh validasi singkat; silakan sambung ke logika simpan sebenarnya
    const required = form.querySelectorAll("[required]");
    const invalid = Array.from(required).find((el) => !el.value.trim());

    if (invalid) {
      e.preventDefault();
      invalid.focus();
      alert("Lengkapi semua field bertanda * sebelum konfirmasi.");
    }
  });
}

/* ---------- Inisialisasi ---------- */
document.addEventListener("DOMContentLoaded", function () {
  const roleSelect = document.getElementById("role");
  if (roleSelect) roleSelect.addEventListener("change", handleRoleChange);

  syncRoleSelectToPage();
  initCancel();
  initSubmitGuard();
  initBreadcrumb();
});
