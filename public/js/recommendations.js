document.addEventListener('DOMContentLoaded', () => {
  const courseCards = document.querySelectorAll('.course-card');

  courseCards.forEach(async (card) => {
    const courseId = card.getAttribute('data-course-id');
    const videoList = card.querySelector('.course-recommendations ul');

    try {
      const res = await fetch(`/recommendations/${courseId}`);
      const html = await res.text();
      videoList.innerHTML = html;
    } catch {
      videoList.innerHTML = '<li>Error loading recommendations.</li>';
    }
  });
});
