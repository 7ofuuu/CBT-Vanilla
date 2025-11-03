// ==================== USER DATA ====================
// User data array
const users = [
  {
    username: 'agus',
    password: 'admin123',
    role: 'admin',
    nama: 'Agus Supriadi',
    foto: '../../assets/profile-admin.png',
  },
  {
    username: 'guru1',
    password: 'password1',
    role: 'guru',
    nama: 'Muhammad Sumbul',
    foto: '../../assets/profile-admin.png',
  },
  {
    username: 'kanabawi',
    password: 'siswa123',
    role: 'siswa',
    nama: 'Ahmad Kanabawi',
    foto: '../../assets/profile-admin.png',
    jurusan: 'IPA',
    tingkat: 'XII',
    kelas: 'IPA 01',
  },
  {
    username: 'jalil',
    password: 'siswa123',
    role: 'siswa',
    nama: 'Usman Abdul Jalil',
    foto: '../../assets/profile-admin.png',
    jurusan: 'IPS',
    tingkat: 'XI',
    kelas: 'IPS 02',
  },
  {
    username: 'kashmiri',
    password: 'guru123',
    role: 'guru',
    nama: 'Khalid Kashmiri',
    foto: '../../assets/profile-admin.png',
  },
];

// Get deleted users from localStorage
function getDeletedUsers() {
  const deleted = localStorage.getItem('deletedUsers');
  return deleted ? JSON.parse(deleted) : [];
}

// Get active users (excluding deleted ones)
function getActiveUsers() {
  const deletedUsernames = getDeletedUsers();
  return users.filter(user => !deletedUsernames.includes(user.username));
}

// ==================== UTILITY FUNCTIONS ====================
function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
}

// ==================== LOGIN FUNCTIONS ====================
function fetchUser() {
  // Return users array wrapped in a Promise to maintain compatibility
  return Promise.resolve(users);
}

console.log(fetchUser());

function validateLogin() {
  const usernameInput = document.getElementById('username').value;
  const passwordInput = document.getElementById('password').value;

  if (usernameInput === '' || passwordInput === '') {
    alert('Please fill in all fields');
    return false;
  }

  fetchUser().then(users => {
    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
      alert('Login successful');

      document.cookie = `username=${user.username}`;
      document.cookie = `role=${user.role}`;

      if (user.role === 'admin') {
        window.location.href = 'admin/home-admin.html';
      } else if (user.role === 'guru') {
        window.location.href = 'guru/home-guru.html';
      } else {
        alert('Unknown role');
      }
    } else {
      alert('Invalid username or password');
    }
  });

  return false;
}

// ==================== HOME PAGE FUNCTIONS ====================
let role = getCookie('role');
let username = getCookie('username');

if (role) {
  const roleElement = document.getElementById('user-role');
  if (roleElement) {
    roleElement.innerText = role;
  }
} else {
  const roleElement = document.getElementById('user-role');
  if (roleElement) {
    roleElement.innerText = 'Unknown';
  }
}

if (username) {
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    usernameElement.innerText = username;
  }
} else {
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    usernameElement.innerText = 'Guest';
  }
}

// ==================== LOGOUT FUNCTION ====================
function logout() {
  document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  window.location.href = '../../pages/login.html';
}

// ==================== USER TABLE DISPLAY ====================
function displayUsers() {
  const tableBody = document.querySelector('.user-table tbody');

  if (!tableBody) return; // Exit if table doesn't exist on this page

  // Clear existing rows
  tableBody.innerHTML = '';

  // Get active users (excluding deleted ones) and filter out admin users
  const activeUsers = getActiveUsers().filter(user => user.role !== 'admin');

  if (activeUsers.length === 0) {
    // Display message if no users
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="4" style="text-align: center; padding: 2rem; color: #6b7280;">
        Tidak ada pengguna yang ditampilkan
      </td>
    `;
    tableBody.appendChild(row);
    return;
  }

  // Populate table with active users
  activeUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${user.foto || '../../assets/profile-admin.png'}" alt="User" class="user-avatar" /></td>
      <td>${user.username}</td>
      <td>${user.nama || 'N/A'}</td>
      <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
    `;

    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      // Store selected user in localStorage
      localStorage.setItem('selectedUser', JSON.stringify(user));

      // Navigate to detail page based on role
      if (user.role === 'guru') {
        window.location.href = `detail-pengguna-guru.html?username=${user.username}`;
      } else if (user.role === 'siswa') {
        window.location.href = `detail-pengguna-siswa.html?username=${user.username}`;
      } else if (user.role === 'admin') {
        window.location.href = `detail-pengguna-admin.html?username=${user.username}`;
      }
    });

    tableBody.appendChild(row);
  });
}

// Call displayUsers when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayUsers);
} else {
  displayUsers();
}

// ==================== USER DETAIL PAGE ====================
function displayUserDetail() {
  // Get the selected user from localStorage
  const selectedUserData = localStorage.getItem('selectedUser');

  if (!selectedUserData) {
    console.log('No selected user found');
    return;
  }

  const selectedUser = JSON.parse(selectedUserData);

  // Update user photo
  const userPhoto = document.querySelector('.user-photo');
  if (userPhoto) {
    userPhoto.src = selectedUser.foto || '../../assets/profile-admin.png';
    userPhoto.alt = selectedUser.nama;
  }

  // Update user full name in header
  const userFullname = document.querySelector('.user-fullname');
  if (userFullname) {
    userFullname.textContent = selectedUser.nama || selectedUser.username;
  }

  // Update user role label
  const userRoleLabel = document.querySelector('.user-role-label');
  if (userRoleLabel) {
    userRoleLabel.textContent = selectedUser.role;
  }

  // Update role badge
  const roleBadge = document.querySelector('.role-badge');
  if (roleBadge) {
    roleBadge.textContent = selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1);
  }

  // Update form fields
  const namaInput = document.getElementById('nama');
  if (namaInput) {
    namaInput.value = selectedUser.nama || 'N/A';
  }

  const usernameField = document.getElementById('username-field');
  if (usernameField) {
    usernameField.value = selectedUser.username;
  }

  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.value = selectedUser.password;
  }

  const roleSelect = document.getElementById('role');
  if (roleSelect) {
    roleSelect.value = selectedUser.role;
  }

  // Update siswa-specific fields if they exist
  const jurusanInput = document.getElementById('jurusan');
  if (jurusanInput && selectedUser.jurusan) {
    jurusanInput.value = selectedUser.jurusan;
  }

  const tingkatInput = document.getElementById('tingkat');
  if (tingkatInput && selectedUser.tingkat) {
    tingkatInput.value = selectedUser.tingkat;
  }

  const kelasInput = document.getElementById('kelas');
  if (kelasInput && selectedUser.kelas) {
    kelasInput.value = selectedUser.kelas;
  }
}

// Call displayUserDetail when on detail page
if (window.location.pathname.includes('detail-pengguna')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayUserDetail);
  } else {
    displayUserDetail();
  }
}

// ==================== DELETE USER FUNCTION ====================
function hapusPengguna() {
  // Get the selected user from localStorage
  const selectedUserData = localStorage.getItem('selectedUser');

  if (!selectedUserData) {
    alert('Tidak ada pengguna yang dipilih');
    return;
  }

  const selectedUser = JSON.parse(selectedUserData);

  // Confirm deletion
  const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus pengguna "${selectedUser.nama}" (${selectedUser.username})?`);

  if (!confirmDelete) {
    return;
  }

  // Get current deleted users list
  const deletedUsers = getDeletedUsers();

  // Add this user to deleted list
  if (!deletedUsers.includes(selectedUser.username)) {
    deletedUsers.push(selectedUser.username);
    localStorage.setItem('deletedUsers', JSON.stringify(deletedUsers));
  }

  localStorage.removeItem('selectedUser');

  alert('Pengguna berhasil dihapus!');

  window.location.href = 'semua-pengguna.html';
}

if (window.location.pathname.includes('detail-pengguna')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const deleteBtn = document.querySelector('.btn-delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', hapusPengguna);
      }
    });
  } else {
    const deleteBtn = document.querySelector('.btn-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', hapusPengguna);
    }
  }
}
