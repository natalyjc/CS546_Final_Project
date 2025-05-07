document.addEventListener('DOMContentLoaded', () => {
  const courseTitles = document.querySelectorAll('.course-name');
  const videoLists = document.querySelectorAll('[id^="yt-"]');

  courseTitles.forEach(async (elem, i) => {
    const title = elem.innerText;
    const res = await fetch(`/recommendations/${encodeURIComponent(title)}`);
    const html = await res.text();
    videoLists[i].innerHTML = html;
  });
});