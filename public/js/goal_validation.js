document.addEventListener('DOMContentLoaded', () => {
  const goalForm = document.getElementById('goal-form');
  if (!goalForm) return;

  goalForm.addEventListener('submit', (e) => {
    const titleInput = document.getElementById('goalTitle');
    const dateInput = document.getElementById('targetDate');

    const title = titleInput?.value.trim();
    const date = dateInput?.value;

    let hasError = false;

    if (!title || title.length < 3) {
      alert('Goal title must be at least 3 characters.');
      hasError = true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    if (!date || selectedDate <= today) {
      alert('Target date must be in the future.');
      hasError = true;
    }

    if (hasError) {
      e.preventDefault();
    }
  });
});