// ===================== DATA AKTIVITAS =====================
const aktivitasData = [
    {
        judul: "Ujian Akhir Semester",
        mapel: "Matematika",
        jurusan: "XII - IPA",
        kelas: "XII",
        peserta: 86,
        status: "Aktif",
        mulai: "08:30, 20 Juni 2025",
        selesai: "09:30, 20 Juni 2025",
        color: "bg-blue"
    },
    {
        judul: "Ujian Akhir Semester",
        mapel: "B. Indonesia",
        jurusan: "XII - IPA",
        kelas: "XII",
        peserta: 90,
        status: "Tidak Aktif",
        mulai: "07:30, 21 Juni 2025",
        selesai: "08:30, 21 Juni 2025",
        color: "bg-teal"
    },
    {
        judul: "Ujian Akhir Semester",
        mapel: "Sosiologi",
        jurusan: "XII - IPS",
        kelas: "XII",
        peserta: 70,
        status: "Tidak Aktif",
        mulai: "08:30, 22 Juni 2025",
        selesai: "09:30, 22 Juni 2025",
        color: "bg-orange"
    },
    {
        judul: "Ujian Tengah Semester",
        mapel: "Geografi",
        jurusan: "XII - IPS",
        kelas: "XII",
        peserta: 83,
        status: "Tidak Aktif",
        mulai: "09:30, 20 Maret 2025",
        selesai: "10:30, 20 Maret 2025",
        color: "bg-yellow"
    },
    {
        judul: "Ujian Tengah Semester",
        mapel: "B. Inggris",
        jurusan: "XII - IPA",
        kelas: "XII",
        peserta: 90,
        status: "Tidak Aktif",
        mulai: "10:30, 23 Maret 2025",
        selesai: "11:30, 23 Maret 2025",
        color: "bg-purple"
    }
];

// ===================== DATA PESERTA =====================
const pesertaData = [
    { nama: "Ahmad Fauzi", tingkat: "XII", kelas: "IPA 01", mapel: "Matematika", status: "onprogress" },
    { nama: "Rizky Ananda", tingkat: "XII", kelas: "IPA 02", mapel: "Matematika", status: "submitted" },
    { nama: "Dewi Lestari", tingkat: "XII", kelas: "IPS 01", mapel: "Matematika", status: "blocked" },
    { nama: "Daffa Pratama", tingkat: "XII", kelas: "IPA 03", mapel: "Matematika", status: "submitted" },
    { nama: "Siti Rahma", tingkat: "XII", kelas: "IPS 02", mapel: "Matematika", status: "onprogress" }
];

// ===================== RENDER KARTU AKTIVITAS =====================
function renderAktivitasCards(data = aktivitasData) {
    const grid = document.querySelector(".cards-grid");
    if (!grid) return;

    grid.innerHTML = "";

    if (data.length === 0) {
        grid.innerHTML = `<p style="color:#666; text-align:center;">Tidak ada aktivitas yang sesuai filter.</p>`;
        return;
    }

    data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <div class="card-header ${item.color}">${item.judul}</div>
      <div class="card-body">
        <p><strong>Mapel :</strong> ${item.mapel}</p>
        <p><strong>Jurusan/Tingkat :</strong> ${item.jurusan}</p>
        <p><strong>Kelas :</strong> ${item.kelas}</p>
        <p><strong>Peserta :</strong> ${item.peserta}</p>
        <p><strong>Status :</strong> ${item.status}</p>
        <p><strong>Dimulai pada :</strong> ${item.mulai}</p>
        <p><strong>Berakhir pada :</strong> ${item.selesai}</p>
      </div>
    `;

        // klik card -> halaman peserta
        card.addEventListener("click", () => {
            window.location.href = "./aktivitas-peserta.html";
        });

        grid.appendChild(card);
    });
}

// ===================== SET STATUS BADGE =====================
function setStatusBadge(el, statusKey) {
  if (!el) return;
  const map = {
    blocked: { text: "Blocked", cls: "blocked" },
    submitted: { text: "Submitted", cls: "submitted" },
    onprogress: { text: "On Progress", cls: "onprogress" },
    aktif: { text: "Aktif", cls: "onprogress" },          // optional mapping lain
    "tidak aktif": { text: "Tidak Aktif", cls: "blocked" } // optional mapping lain
  };

  const s = map[statusKey.toLowerCase()] || map.onprogress;

  // reset kelas status-badge
  el.classList.remove("blocked", "submitted", "onprogress");
  el.classList.add("status-badge", s.cls);
  el.textContent = s.text;
}

// ===================== RENDER PESERTA (TABEL) =====================
function renderPesertaTable() {
    const tbody = document.querySelector(".activity-detail-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    pesertaData.forEach((p) => {
        const tr = document.createElement("tr");
        const statusLabel =
            p.status === "blocked"
                ? `<span class="status-badge blocked">Blocked</span>`
                : p.status === "submitted"
                    ? `<span class="status-badge submitted">Submitted</span>`
                    : `<span class="status-badge onprogress">On Progress</span>`;

        tr.innerHTML = `
      <td>${p.nama}</td>
      <td>${p.tingkat}</td>
      <td>${p.kelas}</td>
      <td>${p.mapel}</td>
      <td>${statusLabel}</td>
    `;

        // Klik baris dengan status blocked → ke detail
        if (p.status === "blocked") {
            tr.classList.add("clickable-row");
            tr.addEventListener("click", () => {
                window.location.href = "./aktivitas-peserta-detail.html";
            });
        }

        tbody.appendChild(tr);
    });
}

// ===================== NAVIGASI SIDEBAR =====================
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

// === BREADCRUMB DINAMIS UNTUK AKTIVITAS ===
function initBreadcrumb() {
    const breadcrumb = document.querySelector(".breadcrumb-back");
    if (!breadcrumb) return;

    breadcrumb.addEventListener("click", function (e) {
        e.preventDefault();

        const current = window.location.pathname;

        if (current.includes("aktivitas-peserta-detail.html")) {
            window.location.href = "./aktivitas-peserta.html";
        } else if (current.includes("aktivitas-peserta.html")) {
            window.location.href = "./aktivitas.html";
        }
    });
}

// === GENERATE RANDOM CODE (UNTUK DETAIL AKTIVITAS) ===
function generateRandomCode(length = 5) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// === Klik baris berstatus "Blocked" -> ke halaman detail peserta ===
function initBlockedRowNavigation() {
    const rows = document.querySelectorAll(".activity-detail-table tbody tr");
    if (!rows.length) return;

    rows.forEach((tr) => {
        const isBlocked = tr.querySelector(".status-badge.blocked");
        if (isBlocked) {
            tr.classList.add("clickable-row");
            tr.addEventListener("click", () => {
                window.location.href = "./aktivitas-peserta-detail.html";
            });
        }
    });
}

// ===================== FILTER DINAMIS =====================
function initFilters() {
    const selects = document.querySelectorAll(".filters-row select");
    if (!selects.length) return;

    const [jenisUjian, jurusan, kelas, mapel, status] = selects;

    // Buat opsi otomatis dari data
    const getUnique = (key) => [...new Set(aktivitasData.map((i) => i[key]))];

    fillSelect(jenisUjian, "judul", getUnique("judul"));
    fillSelect(jurusan, "jurusan", getUnique("jurusan"));
    fillSelect(kelas, "kelas", getUnique("kelas"));
    fillSelect(mapel, "mapel", getUnique("mapel"));
    fillSelect(status, "status", getUnique("status"));

    // Jalankan filter real-time
    selects.forEach((sel) => {
        sel.addEventListener("change", () => {
            applyFilter(jenisUjian, jurusan, kelas, mapel, status);
        });
    });
}

function fillSelect(select, key, values) {
    select.innerHTML = `<option value="">Semua ${capitalize(key)}</option>`;
    values.forEach((val) => {
        select.innerHTML += `<option value="${val}">${val}</option>`;
    });
}

function capitalize(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}

function applyFilter(jenisUjian, jurusan, kelas, mapel, status) {
    const filtered = aktivitasData.filter((item) => {
        return (
            (jenisUjian.value === "" || item.judul === jenisUjian.value) &&
            (jurusan.value === "" || item.jurusan === jurusan.value) &&
            (kelas.value === "" || item.kelas === kelas.value) &&
            (mapel.value === "" || item.mapel === mapel.value) &&
            (status.value === "" || item.status === status.value)
        );
    });
    renderAktivitasCards(filtered);
}

// ===================== FILTER DAN SEARCH PESERTA =====================
function initPesertaFilters() {
    const searchInput = document.getElementById("search-aktivitas");
    const selects = document.querySelectorAll(".filters-row select");
    const tbody = document.querySelector(".activity-detail-table tbody");
    if (!tbody || selects.length < 3) return;

    const [tingkatSelect, kelasSelect, statusSelect] = selects;

    // Ambil nilai unik dari pesertaData
    const getUnique = (key) => [...new Set(pesertaData.map((p) => p[key]))];

    fillSelect(tingkatSelect, "tingkat", getUnique("tingkat"));
    fillSelect(kelasSelect, "kelas", getUnique("kelas"));
    fillSelect(statusSelect, "status", getUnique("status").map(capitalize));

    // Jalankan filter real-time (kombinasi dengan search)
    [searchInput, tingkatSelect, kelasSelect, statusSelect].forEach((el) => {
        el.addEventListener("input", () => applyPesertaFilters(searchInput, tingkatSelect, kelasSelect, statusSelect));
        el.addEventListener("change", () => applyPesertaFilters(searchInput, tingkatSelect, kelasSelect, statusSelect));
    });
}

// Jalankan penyaringan data
function applyPesertaFilters(searchInput, tingkatSelect, kelasSelect, statusSelect) {
    const keyword = searchInput.value.toLowerCase();
    const tingkat = tingkatSelect.value;
    const kelas = kelasSelect.value;
    const status = statusSelect.value.toLowerCase();

    const filtered = pesertaData.filter((p) => {
        const matchesSearch =
            p.nama.toLowerCase().includes(keyword) ||
            p.kelas.toLowerCase().includes(keyword) ||
            p.mapel.toLowerCase().includes(keyword) ||
            p.status.toLowerCase().includes(keyword);

        const matchesFilter =
            (tingkat === "" || p.tingkat === tingkat) &&
            (kelas === "" || p.kelas === kelas) &&
            (status === "" || p.status.toLowerCase() === status);

        return matchesSearch && matchesFilter;
    });

    renderPesertaTableFiltered(filtered);
}


function renderPesertaTableFiltered(filteredData) {
    const tbody = document.querySelector(".activity-detail-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">Tidak ada peserta ditemukan</td></tr>`;
        return;
    }

    filteredData.forEach((p) => {
        const tr = document.createElement("tr");
        const statusLabel =
            p.status === "blocked"
                ? `<span class="status-badge blocked">Blocked</span>`
                : p.status === "submitted"
                    ? `<span class="status-badge submitted">Submitted</span>`
                    : `<span class="status-badge onprogress">On Progress</span>`;

        tr.innerHTML = `
      <td>${p.nama}</td>
      <td>${p.tingkat}</td>
      <td>${p.kelas}</td>
      <td>${p.mapel}</td>
      <td>${statusLabel}</td>
    `;

        if (p.status === "blocked") {
            tr.classList.add("clickable-row");
            tr.addEventListener("click", () => {
                window.location.href = "./aktivitas-peserta-detail.html";
            });
        }

        tbody.appendChild(tr);
    });
}

// ===================== UNBLOCK FEATURE =====================
function assignUnblockFeature(entity, selectors) {
  const {
    generateBtn,     // .generate-btn (kode pemulihan)
    codeInput,       // #recoveryCode
    form,            // #unblockForm
    input,           // #unblockCodeInput
    msg,             // #unblockMessage
    statusLabel,     // .status span (di header profil)
    violationSection, // .violation-section (info pelanggaran)
    progressSection   // .progress-section (container on progress)
  } = selectors;

  if (!entity || !generateBtn || !codeInput || !form || !input || !msg || !statusLabel) return;

  // generate code
  generateBtn.addEventListener("click", () => {
    const newCode = generateRandomCode();
    codeInput.value = newCode;
    entity.unblockCode = newCode;     
    entity.status = "blocked";
    msg.style.color = "#555";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = input.value.trim();

    if (entered === entity.unblockCode) {
      entity.status = "onprogress";

      statusLabel.textContent = "On Progress";
      statusLabel.classList.remove("blocked");
      statusLabel.classList.add("onprogress");

      if (violationSection) violationSection.style.display = "none";
      if (progressSection)  progressSection.style.display = "block";


    }

    input.value = "";
  });
}


// === INISIALISASI UTAMA ===
document.addEventListener("DOMContentLoaded", () => {
    initSidebarNavigation();
    initBreadcrumb();
    initBlockedRowNavigation();

    // === Halaman aktivitas utama ===
    if (document.querySelector(".cards-grid")) {
        renderAktivitasCards();
        initFilters();
    }

    // === Halaman aktivitas peserta ===
    if (document.querySelector(".activity-detail-table")) {
        renderPesertaTable();
        initPesertaFilters();
    }

    // === Halaman detail aktivitas ===
    if (document.querySelector(".code-section") && document.querySelector(".user-detail")) {
    const namaDiHalaman = document.querySelector(".user-info h2")?.textContent?.trim();
    const currentStudent = pesertaData.find(p => p.nama === namaDiHalaman)
                         || { nama: namaDiHalaman || "Siswa", status: "blocked" };
    assignUnblockFeature(currentStudent, {
      generateBtn:      document.querySelector(".generate-btn"),          // tombol generate code
      codeInput:        document.getElementById("recoveryCode"),          // input tampil kode
      form:             document.getElementById("unblockForm"),
      input:            document.getElementById("unblockCodeInput"),
      msg:              document.getElementById("unblockMessage"),
      statusLabel:      document.querySelector(".status span"),
      violationSection: document.querySelector(".violation-section"),     // disembunyikan setelah sukses
      progressSection:  document.querySelector(".progress-section")       // ditampilkan setelah sukses
    });
  }

    const btnCancel = document.querySelector(".btn-cancel");
    if (btnCancel) btnCancel.addEventListener("click", () => window.history.back());
});
