document.addEventListener('DOMContentLoaded', () => {
  const goalForm = document.getElementById('goal-form');
  if (!goalForm) return;

  const titleInput = document.getElementById('goalTitle');
  const dateInput = document.getElementById('targetDate');

  const showError = (inputEl, message) => {
    let errorEl = inputEl.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('error-message')) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message';
      inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
    }
    errorEl.textContent = message;
  };

  const clearErrors = () => {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
  };

  const containsDangerousHTML = (str) => {
    const pattern = /[<>]/g;
    return pattern.test(str);
  };

  goalForm.addEventListener('submit', (e) => {
    clearErrors();
    let hasError = false;

    const title = titleInput?.value.trim();
    const date = dateInput?.value;

    if (!title || title.length < 3) {
      showError(titleInput, 'Goal title must be at least 3 characters.');
      hasError = true;
    } else if (containsDangerousHTML(title)) {
      showError(titleInput, 'Goal title contains invalid characters like < or >.');
      hasError = true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    if (!date || selectedDate <= today) {
      showError(dateInput, 'Target date must be in the future.');
      hasError = true;
    }

    if (hasError) {
      e.preventDefault();
    }
  });
});
