// Import functions from ilham.js
// ==================== KELAS DATA ====================
let kelasList = [
  {
    id: 1,
    namaKelas: 'XII IPA 1',
    jurusan: 'IPA',
    tingkat: 'XII',
    waliKelas: 'Matematika',
    jumlahSiswa: 86,
    status: 'Tidak Aktif',
    color: 'blue',
  },
  {
    id: 2,
    namaKelas: 'XII IPA 2',
    jurusan: 'IPA',
    tingkat: 'XII',
    waliKelas: 'B. Indonesia',
    jumlahSiswa: 90,
    status: 'Tidak Aktif',
    color: 'blue',
  },
  {
    id: 3,
    namaKelas: 'XII IPS 1',
    jurusan: 'IPS',
    tingkat: 'XII',
    waliKelas: 'Sosiologi',
    jumlahSiswa: 70,
    status: 'Tidak Aktif',
    color: 'orange',
  },
  {
    id: 4,
    namaKelas: 'XI IPS 1',
    jurusan: 'IPS',
    tingkat: 'XI',
    waliKelas: 'Geografi',
    jumlahSiswa: 83,
    status: 'Tidak Aktif',
    color: 'orange',
  },
  {
    id: 5,
    namaKelas: 'XII IPA 3',
    jurusan: 'IPA',
    tingkat: 'XII',
    waliKelas: 'B. Inggris',
    jumlahSiswa: 90,
    status: 'Tidak Aktif',
    color: 'pink',
  },
];

// Load from sessionStorage if available
const storedKelas = sessionStorage.getItem('kelasList');
if (storedKelas) {
  kelasList = JSON.parse(storedKelas);
}

// ==================== UTILITY FUNCTIONS ====================
function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function logout() {
  document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '../login.html';
}

// Display user info from cookies
let role = getCookie('role');
let username = getCookie('username');

if (role) {
  const roleElement = document.getElementById('user-role');
  if (roleElement) {
    roleElement.innerText = role;
  }
}

if (username) {
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    usernameElement.innerText = username;
  }
}

// ==================== DISPLAY KELAS ====================
function displayKelas(filter = {}) {
  const kelasGrid = document.getElementById('kelasGrid');

  if (!kelasGrid) return;

  kelasGrid.innerHTML = '';

  // Apply filters
  let filteredKelas = kelasList;

  if (filter.search) {
    filteredKelas = filteredKelas.filter(kelas => kelas.namaKelas.toLowerCase().includes(filter.search.toLowerCase()));
  }

  if (filter.jurusan) {
    filteredKelas = filteredKelas.filter(kelas => kelas.jurusan === filter.jurusan);
  }

  if (filter.tingkat) {
    filteredKelas = filteredKelas.filter(kelas => kelas.tingkat === filter.tingkat);
  }

  if (filteredKelas.length === 0) {
    kelasGrid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3>Tidak ada kelas ditemukan</h3>
        <p>Coba ubah filter atau tambah kelas baru</p>
      </div>
    `;
    return;
  }

  filteredKelas.forEach(kelas => {
    const card = document.createElement('div');
    card.className = `kelas-card ${kelas.color}`;
    card.innerHTML = `
      <div class="kelas-header">
        <h3 class="kelas-title">${kelas.namaKelas}</h3>
        <p class="kelas-subtitle">${kelas.jurusan} - Tingkat ${kelas.tingkat}</p>
      </div>
      <div class="kelas-info">
        <div class="kelas-info-row">
          <span class="kelas-info-label">Wali Kelas:</span>
          <span class="kelas-info-value">${kelas.waliKelas}</span>
        </div>
        <div class="kelas-info-row">
          <span class="kelas-info-label">Jumlah Siswa:</span>
          <span class="kelas-info-value">${kelas.jumlahSiswa}</span>
        </div>
        <div class="kelas-info-row">
          <span class="kelas-info-label">Status:</span>
          <span class="kelas-info-value">${kelas.status}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      // Navigate to detail page or show detail modal
      sessionStorage.setItem('selectedKelas', JSON.stringify(kelas));
      // window.location.href = 'detail-kelas.html';
      alert(`Detail kelas: ${kelas.namaKelas}`);
    });

    kelasGrid.appendChild(card);
  });
}

// ==================== MODAL FUNCTIONS ====================
function showTambahKelasModal() {
  const modal = document.getElementById('modalTambahKelas');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeTambahKelasModal() {
  const modal = document.getElementById('modalTambahKelas');
  if (modal) {
    modal.classList.remove('show');
    document.getElementById('formTambahKelas').reset();
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('modalTambahKelas');
  if (event.target === modal) {
    closeTambahKelasModal();
  }
};

// ==================== CREATE KELAS ====================
function tambahKelas(event) {
  event.preventDefault();

  const namaKelas = document.getElementById('namaKelas').value.trim();
  const jurusan = document.getElementById('jurusan').value;
  const tingkat = document.getElementById('tingkat').value;
  const waliKelas = document.getElementById('waliKelas').value.trim();
  const jumlahSiswa = parseInt(document.getElementById('jumlahSiswa').value) || 0;

  // Validate
  if (!namaKelas || !jurusan || !tingkat) {
    alert('Mohon lengkapi semua field yang wajib diisi!');
    return;
  }

  // Determine color based on jurusan
  let color = 'blue';
  if (jurusan === 'IPS') {
    color = 'orange';
  } else if (tingkat === 'XI') {
    color = 'pink';
  }

  // Create new kelas object
  const newKelas = {
    id: kelasList.length > 0 ? Math.max(...kelasList.map(k => k.id)) + 1 : 1,
    namaKelas: namaKelas,
    jurusan: jurusan,
    tingkat: tingkat,
    waliKelas: waliKelas || '-',
    jumlahSiswa: jumlahSiswa,
    status: 'Tidak Aktif',
    color: color,
  };

  // Add to array
  kelasList.push(newKelas);

  // Save to sessionStorage
  sessionStorage.setItem('kelasList', JSON.stringify(kelasList));

  // Close modal and refresh display
  closeTambahKelasModal();
  displayKelas();

  alert(`Kelas ${namaKelas} berhasil ditambahkan!`);
}

// ==================== FILTER & SEARCH ====================
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const filterJurusan = document.getElementById('filterJurusan');
  const filterTingkat = document.getElementById('filterTingkat');

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (filterJurusan) {
    filterJurusan.addEventListener('change', applyFilters);
  }

  if (filterTingkat) {
    filterTingkat.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  const filter = {
    search: document.getElementById('searchInput')?.value || '',
    jurusan: document.getElementById('filterJurusan')?.value || '',
    tingkat: document.getElementById('filterTingkat')?.value || '',
  };

  displayKelas(filter);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  displayKelas();
  setupFilters();

  // Setup form submit
  const form = document.getElementById('formTambahKelas');
  if (form) {
    form.addEventListener('submit', tambahKelas);
  }
});
