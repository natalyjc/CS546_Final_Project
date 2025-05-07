import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;

export const fetchYoutubeVideos = async (query) => {
  try {
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        key: API_KEY,
        maxResults: 5,
        type: 'video'
      }
    });

    return data.items.map((item) => ({
        title: item.snippet.title,
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.medium.url       
    }));
  } catch (err) {
    console.error('YouTube fetch failed:', err.message);
    return [];
  }
};