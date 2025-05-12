import { Router } from 'express';
import { getCoursesByUserId } from '../data/courses.js';

const router = Router();

router.get('/courses', async (req, res) => {
    try{
      const userId = req.session.user._id;
      const courses = await getCoursesByUserId(userId);
      res.json(courses);
    }catch(e){
      console.error(error);
      res.status(500).render('error', { error: 'Internal Server Error'});
    }
  });

export default router;