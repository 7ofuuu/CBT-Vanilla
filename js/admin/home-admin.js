// Function to get a specific cookie value by name
function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Get the role cookie and display it
let role = getCookie('role');
let username = getCookie('username');
if (role) {
  document.getElementById('user-role').innerText = role;
} else {
  document.getElementById('user-role').innerText = 'Unknown';
}

if (username) {
  document.getElementById('username').innerText = username;
} else {
  document.getElementById('username').innerText = 'Guest';
}

function logout() {
  // Clear cookies by setting expiration date to past
  document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Redirect to login page
  window.location.href = '../../pages/login.html';
}
