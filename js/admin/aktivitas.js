/* =========================================================================
   AKTIVITAS.JS — Versi LocalStorage + Double-Tap Delete + Sync Status
   ---------------------------------------------------------------------
   FITUR:
   - Persistensi aktivitas & peserta (per aktivitas) di localStorage
   - Double tap/dblclick untuk hapus aktivitas/peserta dengan konfirmasi
   - Sinkronisasi status peserta dari detail → daftar peserta
   - Tambah Peserta (prompt) di bawah tabel, otomatis isi Kelas/Mapel/Status
   - Sidebar & breadcrumb mengikuti implementasi yang ada
   - Reset helper: window.resetAktivitasData()
   ---------------------------------------------------------------------
   Catatan: Tetap kompatibel dengan struktur halaman:
   - aktivitas.html: grid kartu aktivitas
   - aktivitas-peserta.html: tabel peserta + filter
   - aktivitas-peserta-detail.html: unblock peserta (kode pemulihan)
   ===================================================================== */

/* ===================== KONST & STORAGE KEY ===================== */
const LS_KEYS = {
    AKTIVITAS: "aktivitasData",
    PESERTA_MAP: "pesertaDataByAktivitas",          // { "Judul - Mapel": [peserta, ...] }
    AKTIVITAS_AKTIF_KEY: "aktivitasAktifKey"        // "Judul - Mapel" yang sedang dibuka
};

/* ===================== DATA DEFAULT (FALLBACK) ===================== */
/* Default aktivitas (mengacu pada data lama yang dipakai render awal) */
const DEFAULT_AKTIVITAS = [
    { id: 1, judul: "Ujian Akhir Semester", mapel: "Matematika", jurusan: "XII - IPA", kelas: "XII", peserta: 86, status: "Aktif", mulai: "08:30, 20 Juni 2025", selesai: "09:30, 20 Juni 2025", color: "bg-blue" },
    { id: 2, judul: "Ujian Akhir Semester", mapel: "B. Indonesia", jurusan: "XII - IPA", kelas: "XII", peserta: 90, status: "Tidak Aktif", mulai: "07:30, 21 Juni 2025", selesai: "08:30, 21 Juni 2025", color: "bg-teal" },
    { id: 3, judul: "Ujian Akhir Semester", mapel: "Sosiologi", jurusan: "XII - IPS", kelas: "XII", peserta: 70, status: "Tidak Aktif", mulai: "08:30, 22 Juni 2025", selesai: "09:30, 22 Juni 2025", color: "bg-orange" },
    { id: 4, judul: "Ujian Tengah Semester", mapel: "Geografi", jurusan: "XII - IPS", kelas: "XII", peserta: 83, status: "Tidak Aktif", mulai: "09:30, 20 Maret 2025", selesai: "10:30, 20 Maret 2025", color: "bg-yellow" },
    { id: 5, judul: "Ujian Tengah Semester", mapel: "B. Inggris", jurusan: "XII - IPA", kelas: "XII", peserta: 90, status: "Tidak Aktif", mulai: "10:30, 23 Maret 2025", selesai: "11:30, 23 Maret 2025", color: "bg-purple" }
];

/* Default peserta: ditempatkan untuk aktivitas "Ujian Akhir Semester - Matematika" */
const DEFAULT_PESERTA_MAP = {
    ["Ujian Akhir Semester - Matematika"]: [
        { id: genId(), nama: "Ahmad Fauzi", tingkat: "XII", kelas: "IPA 01", mapel: "Matematika", status: "onprogress" },
        { id: genId(), nama: "Rizky Ananda", tingkat: "XII", kelas: "IPA 02", mapel: "Matematika", status: "submitted" },
        { id: genId(), nama: "Dewi Lestari", tingkat: "XII", kelas: "IPS 01", mapel: "Matematika", status: "blocked" },
        { id: genId(), nama: "Daffa Pratama", tingkat: "XII", kelas: "IPA 03", mapel: "Matematika", status: "submitted" },
        { id: genId(), nama: "Siti Rahma", tingkat: "XII", kelas: "IPS 02", mapel: "Matematika", status: "onprogress" }
    ]
};
// Aktivitas lain → peserta default kosong (akan otomatis dibuat saat pertama kali dibuka)

/* ===================== UTIL: ID & KEY ===================== */
function genId() { return Date.now() + Math.floor(Math.random() * 1000); }
function makeAktivitasKey(item) { return `${item.judul} - ${item.mapel}`; }

/* ===================== STORAGE HELPERS ===================== */
function loadAktivitas() {
    const raw = localStorage.getItem(LS_KEYS.AKTIVITAS);
    if (!raw) {
        // seed default + kasih ID jika belum ada
        const seeded = DEFAULT_AKTIVITAS.map((a, idx) => ({ ...a, id: a.id ?? (idx + 1) }));
        localStorage.setItem(LS_KEYS.AKTIVITAS, JSON.stringify(seeded));
        return seeded;
    }
    try { return JSON.parse(raw) || []; } catch { return []; }
}

function saveAktivitas(arr) {
    localStorage.setItem(LS_KEYS.AKTIVITAS, JSON.stringify(arr));
}

function loadPesertaMap() {
    const raw = localStorage.getItem(LS_KEYS.PESERTA_MAP);
    if (!raw) {
        localStorage.setItem(LS_KEYS.PESERTA_MAP, JSON.stringify(DEFAULT_PESERTA_MAP));
        return { ...DEFAULT_PESERTA_MAP };
    }
    try { return JSON.parse(raw) || {}; } catch { return {}; }
}

function savePesertaMap(map) {
    localStorage.setItem(LS_KEYS.PESERTA_MAP, JSON.stringify(map));
}

function getAktivitasAktifKey() {
    return localStorage.getItem(LS_KEYS.AKTIVITAS_AKTIF_KEY) || "";
}
function setAktivitasAktifKey(key) {
    localStorage.setItem(LS_KEYS.AKTIVITAS_AKTIF_KEY, key);
}

/* ===================== RESET HELPER (opsional) ===================== */
window.resetAktivitasData = function resetAktivitasData() {
    localStorage.removeItem(LS_KEYS.AKTIVITAS);
    localStorage.removeItem(LS_KEYS.PESERTA_MAP);
    localStorage.removeItem(LS_KEYS.AKTIVITAS_AKTIF_KEY);
    alert("LocalStorage aktivitas/peserta telah direset. Muat ulang halaman untuk data default.");
};

/* ===================== RENDER: AKTIVITAS (KARTU) ===================== */
function renderAktivitasCards(data) {
    const grid = document.querySelector(".cards-grid");
    if (!grid) return;

    grid.innerHTML = "";

    if (!data || data.length === 0) {
        grid.innerHTML = `<p style="color:#666; text-align:center;">Tidak ada aktivitas yang sesuai filter.</p>`;
        return;
    }

    data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.id = item.id;
        const key = makeAktivitasKey(item);

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

        // === Single click → buka peserta (tetap seperti sebelumnya) ===
        card.addEventListener("click", () => {
            // simpan konteks aktivitas aktif agar halaman peserta tahu harus render siapa
            setAktivitasAktifKey(key);
            window.location.href = "./aktivitas-peserta.html";
        });

        // === Double click/tap → hapus aktivitas (konfirmasi) ===
        attachDoubleTap(card, () => {
            const ok = confirm("Apakah Anda yakin ingin menghapus aktivitas ini?");
            if (!ok) return;

            // hapus aktivitas
            const all = loadAktivitas().filter(a => a.id !== item.id);
            saveAktivitas(all);
            // hapus bundle peserta untuk aktivitas ini
            const map = loadPesertaMap();
            delete map[key];
            savePesertaMap(map);
            // remove kartu
            card.remove();
        });

        grid.appendChild(card);
    });
}

/* ===================== FILTER: AKTIVITAS ===================== */
function initFiltersAktivitas(aktivitas) {
    const selects = document.querySelectorAll(".filters-row select");
    if (!selects.length) return;

    const [jenisUjian, jurusan, kelas, mapel, status] = selects;

    const getUnique = (key) => [...new Set(aktivitas.map((i) => i[key]))];
    fillSelect(jenisUjian, "judul", getUnique("judul"));
    fillSelect(jurusan, "jurusan", getUnique("jurusan"));
    fillSelect(kelas, "kelas", getUnique("kelas"));
    fillSelect(mapel, "mapel", getUnique("mapel"));
    fillSelect(status, "status", getUnique("status"));

    selects.forEach((sel) => {
        sel.addEventListener("change", () => {
            const filtered = aktivitas.filter((item) => {
                return (
                    (jenisUjian.value === "" || item.judul === jenisUjian.value) &&
                    (jurusan.value === "" || item.jurusan === jurusan.value) &&
                    (kelas.value === "" || item.kelas === kelas.value) &&
                    (mapel.value === "" || item.mapel === mapel.value) &&
                    (status.value === "" || item.status === status.value)
                );
            });
            renderAktivitasCards(filtered);
        });
    });
}

function fillSelect(select, key, values) {
    select.innerHTML = `<option value="">Semua ${capitalize(key)}</option>`;
    values.forEach((val) => {
        select.innerHTML += `<option value="${val}">${val}</option>`;
    });
}
function capitalize(txt) { return txt.charAt(0).toUpperCase() + txt.slice(1); }

/* ===================== RENDER: PESERTA (TABEL) ===================== */
function renderPesertaTableForActiveAktivitas() {
    const tbody = document.querySelector(".activity-detail-table tbody");
    if (!tbody) return;

    const aktifKey = getAktivitasAktifKey();
    const map = loadPesertaMap();
    const list = map[aktifKey] || [];

    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">Tidak ada peserta ditemukan</td></tr>`;
        return;
    }

    list.forEach((p) => {
        const tr = document.createElement("tr");
        tr.dataset.id = p.id;

        const statusLabel =
            p.status === "blocked"
                ? `<span class="status-badge blocked">Blocked</span>`
                : p.status === "submitted"
                    ? `<span class="status-badge submitted">Submitted</span>`
                    : `<span class="status-badge onprogress">On Progress</span>`;

        tr.innerHTML = `
      <td>${p.nama}</td>
      <td>${p.tingkat || "XII"}</td>
      <td>${p.kelas}</td>
      <td>${p.mapel}</td>
      <td>${statusLabel}</td>
    `;

        // === Klik baris "blocked" → ke detail (sesuai behavior lama) ===
        if (p.status === "blocked") {
            tr.classList.add("clickable-row");
            tr.addEventListener("click", () => {
                window.location.href = "./aktivitas-peserta-detail.html";
            });
        }

        // === Double click/tap baris → hapus peserta dengan konfirmasi ===
        attachDoubleTap(tr, () => {
            const ok = confirm(`Hapus peserta "${p.nama}"?`);
            if (!ok) return;

            const mapNow = loadPesertaMap();
            mapNow[aktifKey] = (mapNow[aktifKey] || []).filter(item => item.id !== p.id);
            savePesertaMap(mapNow);
            tr.remove();
        });

        tbody.appendChild(tr);
    });

    // Tambah tombol "+ Tambah Peserta" di BAWAH tabel
    ensureAddPesertaButton();
}

/* ===================== FILTER & SEARCH: PESERTA ===================== */
function initPesertaFilters() {
    const searchInput = document.getElementById("search-aktivitas");
    const selects = document.querySelectorAll(".filters-row select");
    const tbody = document.querySelector(".activity-detail-table tbody");
    if (!tbody || selects.length < 3) return;

    const [tingkatSelect, kelasSelect, statusSelect] = selects;

    const aktifKey = getAktivitasAktifKey();
    const map = loadPesertaMap();
    const list = map[aktifKey] || [];

    const getUnique = (key) => [...new Set(list.map((p) => p[key]).filter(Boolean))];

    // isi opsi filter dari data aktif
    tingkatSelect.innerHTML = `<option value="">Semua tingkat</option>` + getUnique("tingkat").map(v => `<option value="${v}">${v}</option>`).join("");
    kelasSelect.innerHTML = `<option value="">Semua kelas</option>` + getUnique("kelas").map(v => `<option value="${v}">${v}</option>`).join("");
    statusSelect.innerHTML = `<option value="">Semua status</option><option value="onprogress">Onprogress</option><option value="submitted">Submitted</option><option value="blocked">Blocked</option>`;

    const apply = () => {
        const keyword = (searchInput?.value || "").toLowerCase();
        const tingkat = tingkatSelect.value;
        const kelas = kelasSelect.value;
        const status = statusSelect.value.toLowerCase();

        const filtered = list.filter((p) => {
            const matchesSearch =
                p.nama.toLowerCase().includes(keyword) ||
                p.kelas.toLowerCase().includes(keyword) ||
                p.mapel.toLowerCase().includes(keyword) ||
                p.status.toLowerCase().includes(keyword);

            const matchesFilter =
                (tingkat === "" || (p.tingkat || "").toString() === tingkat) &&
                (kelas === "" || p.kelas === kelas) &&
                (status === "" || p.status.toLowerCase() === status);

            return matchesSearch && matchesFilter;
        });

        renderPesertaTableFiltered(filtered);
    };

    [searchInput, tingkatSelect, kelasSelect, statusSelect].forEach((el) => {
        if (!el) return;
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
    });
}

function renderPesertaTableFiltered(filteredData) {
    const tbody = document.querySelector(".activity-detail-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">Tidak ada peserta ditemukan</td></tr>`;
        ensureAddPesertaButton();
        return;
    }

    filteredData.forEach((p) => {
        const tr = document.createElement("tr");
        tr.dataset.id = p.id;

        const statusLabel =
            p.status === "blocked"
                ? `<span class="status-badge blocked">Blocked</span>`
                : p.status === "submitted"
                    ? `<span class="status-badge submitted">Submitted</span>`
                    : `<span class="status-badge onprogress">On Progress</span>`;

        tr.innerHTML = `
      <td>${p.nama}</td>
      <td>${p.tingkat || "XII"}</td>
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

        attachDoubleTap(tr, () => {
            const ok = confirm(`Hapus peserta "${p.nama}"?`);
            if (!ok) return;
            const aktifKey = getAktivitasAktifKey();
            const mapNow = loadPesertaMap();
            mapNow[aktifKey] = (mapNow[aktifKey] || []).filter(item => item.id !== p.id);
            savePesertaMap(mapNow);
            tr.remove();
        });

        tbody.appendChild(tr);
    });

    ensureAddPesertaButton();
}

/* ===================== TAMBAH PESERTA (BUTTON DI BAWAH TABEL) ===================== */
function ensureAddPesertaButton() {
    const container = document.querySelector(".container");
    if (!container) return;

    // Hindari duplikasi tombol
    if (container.querySelector(".btn-add-peserta")) return;

    const btnWrap = document.createElement("div");
    btnWrap.style.marginTop = "12px";
    const btn = document.createElement("button");
    btn.textContent = "+ Tambah Peserta";
    btn.className = "btn-add-peserta";
    btn.style.padding = "10px 14px";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.background = "#1e3a8a";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "600";

    btn.addEventListener("click", () => {
        const nama = prompt("Masukkan nama peserta baru:");
        if (!nama || !nama.trim()) return;

        const aktifKey = getAktivitasAktifKey();
        const map = loadPesertaMap();
        const list = map[aktifKey] || [];

        // Otomatis: Kelas = "XII IPA 01", Mapel = "Matematika", Status = "onprogress"
        const newPeserta = {
            id: genId(),
            nama: nama.trim(),
            tingkat: "XII",
            kelas: "XII IPA 01",
            mapel: "Matematika",
            status: "onprogress"
        };

        map[aktifKey] = [newPeserta, ...list];
        savePesertaMap(map);

        // Re-render tabel
        renderPesertaTableForActiveAktivitas();
    });

    btnWrap.appendChild(btn);
    container.appendChild(btnWrap);
}

/* ===================== DETAIL PAGE: UNBLOCK (PERSISTENT) ===================== */
/* Meng-augment fitur yang sudah ada: ketika kode pemulihan benar → update pesertanya di localStorage */
function initUnblockPersistence() {
    const detailHeaderName = document.querySelector(".user-detail .user-info h2")?.textContent?.trim();
    const form = document.getElementById("unblockForm");
    const input = document.getElementById("unblockCodeInput");
    const msg = document.getElementById("unblockMessage");
    const statusLabel = document.querySelector(".status span");

    if (!detailHeaderName || !form || !input || !statusLabel) return;

    // Intercept submit setelah validasi existing script: kita tambahkan persistensi
    form.addEventListener("submit", (e) => {
        // Script lama sudah mencegah default dan mengecek kode (tetap dibiarkan).
        // Di sini kita tunggu sejenak lalu cek apakah status label berubah menjadi On Progress.
        setTimeout(() => {
            if (statusLabel.classList.contains("onprogress") || /on\s*progress/i.test(statusLabel.textContent || "")) {
                const aktifKey = getAktivitasAktifKey();
                const map = loadPesertaMap();
                const list = map[aktifKey] || [];
                const idx = list.findIndex(p => p.nama === detailHeaderName);
                if (idx !== -1) {
                    list[idx].status = "onprogress";
                    map[aktifKey] = list;
                    savePesertaMap(map);
                    if (msg) {
                        msg.style.color = "#217a3d";
                        msg.textContent = "Status berhasil diperbarui & disimpan.";
                    }
                }
            }
        }, 50);
    });
}

/* ===================== GENERATE CODE BUTTON (Detail Page) ===================== */
function initGenerateCodeButton() {
    const generateBtn = document.querySelector(".generate-btn");
    const codeInput = document.getElementById("recoveryCode");
    if (!generateBtn || !codeInput) return;

    generateBtn.addEventListener("click", () => {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
        codeInput.value = code;

        // Simpan kode ke peserta aktif (optional tapi bagus untuk konsistensi)
        const aktifKey = getAktivitasAktifKey();
        const map = loadPesertaMap();
        const pesertaName = document.querySelector(".user-detail .user-info h2")?.textContent?.trim();
        if (aktifKey && pesertaName) {
            const list = map[aktifKey] || [];
            const idx = list.findIndex(p => p.nama === pesertaName);
            if (idx !== -1) {
                list[idx].unblockCode = code;
                map[aktifKey] = list;
                savePesertaMap(map);
            }
        }
    });
}

/* ===================== UNBLOCK FORM HANDLER (Detail Page) ===================== */
function initUnblockForm() {
    const form = document.getElementById("unblockForm");
    const input = document.getElementById("unblockCodeInput");
    const codeDisplay = document.getElementById("recoveryCode");
    const statusLabel = document.querySelector(".status span");
    const msg = document.getElementById("unblockMessage");

    if (!form || !input || !codeDisplay || !statusLabel) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredCode = input.value.trim();
        const currentCode = codeDisplay.value.trim();
        const pesertaName = document.querySelector(".user-detail .user-info h2")?.textContent?.trim();
        const aktifKey = getAktivitasAktifKey();
        const map = loadPesertaMap();
        const list = map[aktifKey] || [];
        const idx = list.findIndex(p => p.nama === pesertaName);

        if (enteredCode !== currentCode || !currentCode || currentCode === "ex: u8Bp9") {
            alert("Kode salah atau belum digenerate!");
            return;
        }

        if (idx !== -1) {
            list[idx].status = "onprogress";
            map[aktifKey] = list;
            savePesertaMap(map);
        }

        statusLabel.textContent = "On Progress";
        statusLabel.classList.remove("blocked", "submitted");
        statusLabel.classList.add("onprogress");
        if (msg) {
            msg.style.color = "#217a3d";
            msg.textContent = "✅ Status berhasil diperbarui!";
        }
        input.value = "";
    });
}

/* ===================== DETAIL PAGE: BLOKIR PESERTA (Inject Button) ===================== */
function initBlockButton() {
    // Pastikan di halaman detail peserta
    const detailWrap = document.querySelector(".detail-container");
    const statusLabel = document.querySelector(".status span");
    const pesertaName = document.querySelector(".user-detail .user-info h2")?.textContent?.trim();

    if (!detailWrap || !statusLabel || !pesertaName) return;

    // Cegah duplikasi
    if (detailWrap.querySelector(".btn-block-peserta")) return;

    // Buat tombol
    const blockBtn = document.createElement("button");
    blockBtn.type = "button";
    blockBtn.textContent = "Blokir Peserta";
    blockBtn.className = "btn-block-peserta";
    blockBtn.style.marginTop = "10px";
    blockBtn.style.padding = "10px 14px";
    blockBtn.style.border = "none";
    blockBtn.style.borderRadius = "8px";
    blockBtn.style.background = "#dc2626";
    blockBtn.style.color = "#fff";
    blockBtn.style.cursor = "pointer";
    blockBtn.style.fontWeight = "600";

    // Letakkan di bawah form pemulihan
    const codeSections = document.querySelectorAll(".code-section");
    const lastSection = codeSections[codeSections.length - 1] || detailWrap;
    lastSection.appendChild(blockBtn);

    // Handler: set status = "blocked" + persist ke localStorage + update UI + alert
    blockBtn.addEventListener("click", () => {
        const ok = confirm("Yakin ingin memblokir peserta ini?");
        if (!ok) return;

        const aktifKey = getAktivitasAktifKey();
        const map = loadPesertaMap();
        const list = map[aktifKey] || [];
        const idx = list.findIndex(p => p.nama === pesertaName);

        if (idx !== -1) {
            list[idx].status = "blocked";
            map[aktifKey] = list;
            savePesertaMap(map);
        }

        // Update UI langsung
        statusLabel.textContent = "Blocked";
        statusLabel.classList.remove("onprogress", "submitted");
        statusLabel.classList.add("blocked");

        alert("Peserta berhasil diblokir!");
    });
}

/* ===================== SIDEBAR & BREADCRUMB (sesuai implementasi lama) ===================== */
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
        } else {
            window.location.href = "./semua-pengguna.html";
        }
    });
}

/* ===================== DOUBLE-TAP / DBLCLICK HELPER ===================== */
/* Menangani desktop (dblclick) & mobile (double tap) tanpa mengganggu single click */
function attachDoubleTap(element, onDouble) {
    let lastTouchTime = 0;

    // desktop
    element.addEventListener("dblclick", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDouble();
    });

    // mobile (double tap ~300ms)
    element.addEventListener("touchend", (e) => {
        const now = Date.now();
        if (now - lastTouchTime <= 300) {
            e.preventDefault();
            e.stopPropagation();
            onDouble();
        }
        lastTouchTime = now;
    }, { passive: false });
}

document.addEventListener("DOMContentLoaded", () => {
  initSidebarNavigation();
  initBreadcrumb();

  // Halaman aktivitas utama (cards)
  if (document.querySelector(".cards-grid")) {
    const aktivitas = loadAktivitas();
    renderAktivitasCards(aktivitas);
    initFiltersAktivitas(aktivitas);
  }

  // Halaman aktivitas peserta (tabel)
  if (document.querySelector(".activity-detail-table")) {
    renderPesertaTableForActiveAktivitas();
    initPesertaFilters();
  }

  // Halaman detail peserta
  if (document.querySelector(".code-section") && document.querySelector(".user-detail")) {
    initUnblockPersistence();     // jika sebelumnya dipakai untuk “menyimak” perubahan
    initGenerateCodeButton();     // tombol Generate Code
    initUnblockForm();            // konfirmasi & simpan status onprogress
    initBlockButton();            // tombol “Blokir Peserta”
  }

  const btnCancel = document.querySelector(".btn-cancel");
  if (btnCancel) btnCancel.addEventListener("click", () => window.history.back());
});