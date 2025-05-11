document.addEventListener('DOMContentLoaded', () => {
  const saveTimeouts = {};

  document.querySelectorAll('.resizable-box').forEach((box) => {
    const sectionEl = box.querySelector('h3');
    if (!sectionEl) return;

    const sectionTitle = sectionEl.textContent.trim().toLowerCase();
    const section =
      sectionTitle.includes('course') ? 'courses' :
      sectionTitle.includes('goal') ? 'goals' :
      sectionTitle.includes('recommendation') ? 'recommendations' : null;

    if (!section) return;

    box.addEventListener('mouseup', () => {
      clearTimeout(saveTimeouts[section]);

      saveTimeouts[section] = setTimeout(() => {
        const layout = {
          section,
          width: box.offsetWidth + 'px',
          height: box.offsetHeight + 'px'
        };

        fetch('/dashboard/save-layout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(layout)
        });
      }, 400); // delay to avoid rapid triggers
    });
  });
});