import express from 'express';
import { fetchYoutubeVideos } from '../utils/youtubeApi.js';
import { courses } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/:courseId', async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const courseCollection = await courses();
    const course = await courseCollection.findOne({ _id: new ObjectId(courseId) });

    if (!course) return res.status(404).send('<li>Course not found.</li>');

    const query = `${course.title} tutorial`;
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
    console.error(e);
    res.status(500).send('<li>Error fetching recommendations.</li>');
  }
});

export default router;
