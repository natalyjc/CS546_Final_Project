import express from 'express';
const router = express.Router();

import { getCoursesByUserId, deleteCourse, createCourse } from '../data/courses.js';
import { getGoalsByUserId } from '../data/goals.js';
import { getUserById } from '../data/users.js';

router.get('/', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const userId = req.session.user._id;

    const user = await getUserById(userId);
    const courses = await getCoursesByUserId(userId);
    const goals = await getGoalsByUserId(userId);    

    res.render('dashboard', {
      title: 'Dashboard',
      firstName: user.firstName, 
      isAdmin: user.isAdmin,
      courses,
      goals
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Internal Server Error' });
  }
});



export default router;