function handleRoleChange(e) {
    const v = e.target.value;
    if (v === "siswa") {
        window.location.href = "tambah-pengguna-siswa.html";
    } else if (v === "guru") {
        window.location.href = "tambah-pengguna-guru.html";
    } else if (v === "admin") {
        window.location.href = "tambah-pengguna-admin.html";
    }
}

function initBreadcrumb() {
    const breadcrumb = document.querySelector(".breadcrumb-back");
    if (!breadcrumb) return;
    breadcrumb.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "semua-pengguna.html";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form-tambah-pengguna");
    const roleSelect = document.getElementById("role");
    const btnCancel = document.querySelector(".btn-cancel");

    if (roleSelect) roleSelect.addEventListener("change", handleRoleChange);

    if (btnCancel) btnCancel.addEventListener("click", () => window.history.back());

    if (form) {
        form.addEventListener("submit", function (e) {

        });
    }
    initBreadcrumb();
});
