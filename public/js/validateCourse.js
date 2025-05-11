document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorDiv = document.getElementById('clientError');
  
    form.addEventListener('submit', (e) => {
      const titleInput = document.getElementById('title');
      const startDate = new Date(document.getElementById('startDate').value);
      const endDate = new Date(document.getElementById('endDate').value);
      const rawTitle = titleInput.value.trim();
  
      errorDiv.textContent = ''; // Clear any previous error
  
      const hasValidContent = /[a-zA-Z0-9]/.test(rawTitle); // Must include letters or digits
      const tooManySymbols = /^[^a-zA-Z0-9]*$/.test(rawTitle); // Reject only symbols
  
      if (!rawTitle) {
        errorDiv.textContent = 'Course title cannot be empty.';
        e.preventDefault();
        return;
      }
  
      if (!hasValidContent || tooManySymbols) {
        errorDiv.textContent = 'Course title must contain at least one letter or number.';
        e.preventDefault();
        return;
      }
  
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        errorDiv.textContent = 'Please enter valid start and end dates.';
        e.preventDefault();
        return;
      }
  
      if (startDate > endDate) {
        errorDiv.textContent = 'Start date cannot be after end date.';
        e.preventDefault();
      }
    });
  });
  