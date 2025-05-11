document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-completed-btn');
  const completedGoals = document.querySelectorAll('.completed-goal');
  let shown = false;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      shown = !shown;
      completedGoals.forEach(goal => {
        goal.style.display = shown ? 'block' : 'none';
      });
      toggleBtn.textContent = shown ? 'Hide Completed Goals' : 'Show Completed Goals';
    });
  }
});