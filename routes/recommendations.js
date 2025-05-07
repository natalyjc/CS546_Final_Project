import express from 'express';
import { fetchYoutubeVideos } from '../utils/youtubeApi.js';
const router = express.Router();

router.get('/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const videos = await fetchYoutubeVideos(query);
    const html = videos.map(v => `
        <li class="video-item">
          <img class="video-thumb" src="${v.thumbnail}" alt="Thumbnail" />
          <div class="video-info">
            <a href="${v.link}" target="_blank" class="video-title">${v.title}</a>
          </div>
        </li>
      `).join('') || '<li>No videos found.</li>';

    res.send(html);
  } catch (e) {
    res.status(500).send('<li>Error fetching videos.</li>');
  }
});

export default router;