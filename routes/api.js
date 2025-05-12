import { Router } from 'express';
import { getCoursesByUserId } from '../data/courses.js';
import { getGoalsByUserId } from '../data/goals.js';

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

router.get('/goals', async (req, res) => {
  try{
    const userId = req.session.user._id;
    const goals = await getGoalsByUserId(userId);
    res.json(goals);
  }catch(e){
    console.error(error);
    res.status(500).render('error', {error: 'Internal Server Error'});
  }
});
export default router;