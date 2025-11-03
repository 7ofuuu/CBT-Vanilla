// ===================== SIDEBAR NAVIGATION =====================
function initSidebarNavigation() {
  document.querySelectorAll(".menu-item").forEach((item) => {
    const text = item.textContent.trim();

    item.addEventListener("click", () => {
      if (text === "Beranda") {
        window.location.href = "./home-admin.html";
      } else if (text === "Pengguna") {
        window.location.href = "./semua-pengguna.html";
      } else if (text === "Aktivitas") {
        window.location.href = "./aktivitas.html";
      }
    });
  });

  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("Anda telah keluar dari akun ini.");
      window.location.href = "../login.html";
    });
  }
}

// ===================== BREADCRUMB NAVIGATION =====================
function initBreadcrumb() {
  const breadcrumb = document.querySelector(".breadcrumb-back");
  if (!breadcrumb) return;
  breadcrumb.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "./semua-pengguna.html";
  });
}

// ===================== FORM VALIDATION =====================
function initFormValidation() {
  const form = document.querySelector(".form-tambah-pengguna");
  if (!form) return;

  const inputs = form.querySelectorAll("input[required], select[required]");

  // Buat elemen error text di bawah setiap field
  inputs.forEach((input) => {
    const errorText = document.createElement("p");
    errorText.className = "error-text";
    errorText.style.color = "#dc2626";
    errorText.style.fontSize = "0.8rem";
    errorText.style.marginTop = "4px";
    errorText.style.display = "none";
    errorText.textContent = "Field ini wajib diisi";
    input.insertAdjacentElement("afterend", errorText);

    // Hilangkan error saat user mengetik/memilih
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        showError(input);
        valid = false;
      } else {
        clearError(input);
      }
    });

    if (!valid) return;

    // Jika semua field terisi
    alert("Pengguna berhasil ditambahkan!");
    form.reset();

    // Hapus semua error & styling merah
    inputs.forEach(clearError);
  });
}

// ===================== ERROR HANDLING =====================
function showError(input) {
  input.style.borderColor = "#dc2626";
  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-text")) {
    error.style.display = "block";
  }
}

function clearError(input) {
  input.style.borderColor = "";
  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-text")) {
    error.style.display = "none";
  }
}

// ===================== CANCEL BUTTON =====================
function initCancelButton() {
  const btnCancel = document.querySelector(".btn-cancel");
  if (btnCancel) {
    btnCancel.addEventListener("click", () => window.history.back());
  }
}

// ===================== INITIALIZATION =====================
document.addEventListener("DOMContentLoaded", () => {
  initSidebarNavigation();
  initBreadcrumb();
  initFormValidation();
  initCancelButton();
});
