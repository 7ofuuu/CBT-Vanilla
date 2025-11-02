function togglePassword() {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
}

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

function fetchUser() {
  // Return users array wrapped in a Promise to maintain compatibility
  return Promise.resolve(users);
}

console.log(fetchUser());

function validateLogin(event) {
  //   event.preventDefault(); // Prevent form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === '' || password === '') {
    alert('Please fill in all fields');
    return false;
  }

  fetchUser().then(users => {
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      alert('Login successful');

      // Set cookies before redirect
      document.cookie = `username=${user.username}`;
      document.cookie = `role=${user.role}`;

      // Redirect based on user role
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
