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

router.get('/courses/new', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  res.render('createCourse', {
    title: 'Create New Course'
  });
});


router.post('/courses', async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userId = req.session.user._id;
  const { title, startDate, endDate, status } = req.body;

  try {
    await createCourse(userId, title, startDate, endDate);
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).render('createCourse', {
      title: 'Create New Course',
      error: error.toString()
    });
  }
});


router.post('/courses/delete/:id', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const courseId = req.params.id;

    await deleteCourse(courseId, userId);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    const userId = req.session.user._id;
    const user = await getUserById(userId);
    const courses = await getCoursesByUserId(userId);
    const goals = await getGoalsByUserId(userId);

    res.status(400).render('dashboard', {
      title: 'Dashboard',
      firstName: user.firstName,
      isAdmin: user.isAdmin,
      courses,
      goals,
      error: error.toString()
    });
  }
});


export default router;