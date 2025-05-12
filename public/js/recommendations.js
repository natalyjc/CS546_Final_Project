document.addEventListener('DOMContentLoaded', () => {
  // Dashboard cards
  const courseCards = document.querySelectorAll('.course-card');
  courseCards.forEach(async (card) => {
    const courseId = card.getAttribute('data-course-id');
    const videoList = card.querySelector('.course-recommendations ul');
    if (!videoList) return;

    try {
      const res = await fetch(`/recommendations/${courseId}`);
      const html = await res.text();
      videoList.innerHTML = html;
    } catch {
      videoList.innerHTML = '<li>Error loading recommendations.</li>';
    }
  });

  // Course detail page
  const courseDetailContainer = document.querySelector('.course-detail-container');
  if (courseDetailContainer) {
    const courseId = window.location.pathname.split('/')[2]; // /courses/:id
    const videoList = document.querySelector('#yt-course-page');
    if (courseId && videoList) {
      fetch(`/recommendations/${courseId}`)
        .then((res) => res.text())
        .then((html) => {
          videoList.innerHTML = html;
        })
        .catch(() => {
          videoList.innerHTML = '<li>Error loading recommendations.</li>';
        });
    }
  }
});
