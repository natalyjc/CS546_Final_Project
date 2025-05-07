/* 
client-side validation for first name, last name, email, and password
- First name and last name must be at least 2 letters, no numbers or symbols
- Email must be valid (contains '@' and '.' and is at least 5 characters long)
- Password must be at least 6 characters, include a letter and a number, and contain no spaces
*/

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
      document.querySelectorAll('input').forEach(el => el.classList.remove('error', 'valid'));

      //added ids in the handlebars for each input
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      const firstNameInput = document.getElementById('firstName');
      const lastNameInput = document.getElementById('lastName');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');

      const nameRegex = /^[A-Za-z]{2,}$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
     // email validation regex from  https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
     const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   


      let hasError = false;

      if (!firstName || !nameRegex.test(firstName) || firstName.length < 2) {
        document.getElementById('firstNameError').textContent = 'First name must be at least 2 letters, no numbers or symbols.';
        firstNameInput.classList.add('error');
        firstNameInput.classList.remove('valid');
        hasError = true;
      } else {
        firstNameInput.classList.remove('error');
        firstNameInput.classList.add('valid');
      }

      if (!lastName || !nameRegex.test(lastName) || lastName.length < 2) {
        document.getElementById('lastNameError').textContent = 'Last name must be at least 2 letters, no numbers or symbols.';
        lastNameInput.classList.add('error');
        lastNameInput.classList.remove('valid');
        hasError = true;
      } else {
        lastNameInput.classList.remove('error');
        lastNameInput.classList.add('valid');
      }

      if (!email || !emailRegex.test(email) || email.length < 5) {
        document.getElementById('emailError').textContent = 'Enter a valid email address.';
        emailInput.classList.add('error');
        emailInput.classList.remove('valid');
        hasError = true;
      } else {
        emailInput.classList.remove('error');
        emailInput.classList.add('valid');
      }

      if (!password || password.includes(' ') || !passwordRegex.test(password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters, include a letter and a number, and contain no spaces.';
        passwordInput.classList.add('error');
        passwordInput.classList.remove('valid');
        hasError = true;
      } else {
        passwordInput.classList.remove('error');
        passwordInput.classList.add('valid');
      }

      if (hasError) {
        e.preventDefault();
      }
    });
  }
});
