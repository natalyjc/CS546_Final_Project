document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    let hasError = false;

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email || !emailRegex.test(email)) {
      alert('Enter a valid email address.');
      hasError = true;
    }

    if (!password || password.length < 6) {
      alert('Enter a valid password (min 6 characters).');
      hasError = true;
    }

    if (hasError) e.preventDefault();
  });
});