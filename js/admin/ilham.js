// ==================== USER DATA ====================
// User data array
const users = [
  {
    username: 'agus',
    password: 'admin123',
    role: 'admin',
  },
  {
    username: 'guru1',
    password: 'password1',
    role: 'guru',
  },
];

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
