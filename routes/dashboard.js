import express from 'express';
const router = express.Router();

import { getCoursesByUserId, deleteCourse, createCourse } from '../data/courses.js';
import { getGoalsByUserId } from '../data/goals.js';
import { getUserById } from '../data/users.js';
import { createGoal, markGoalCompleted } from '../data/goals.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const today = new Date().toISOString().split('T')[0];
import { loggedOutRedirect } from '../middleware/auth.js';

router.get('/', loggedOutRedirect,async (req, res) => {
  try {

    const userId = req.session.user._id;
    const user = await getUserById(userId);

    const prefs = {
      showGoals: user.dashboardPreferences?.showGoals ?? true,
      showCourses: user.dashboardPreferences?.showCourses ?? true,
      showRecommendations: user.dashboardPreferences?.showRecommendations ?? true,
      layout: user.dashboardPreferences?.layout ?? {}
    };

    const courses = prefs.showCourses ? await getCoursesByUserId(userId) : [];
    const goals = prefs.showGoals ? await getGoalsByUserId(userId) : [];

    res.render('dashboard', {
      title: 'Dashboard',
      firstName: user.firstName,
      isAdmin: user.isAdmin,
      dashboardPreferences: prefs,
      layoutPrefs: prefs.layout,
      courses,
      goals
    });
  } catch (error) {
    res.status(500).render('error', { error: error.toString() });
  }
});

router.get('/courses/new', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('createCourse', {
    title: 'Create New Course',
    todayDate: today
  });
});


router.post('/courses', loggedOutRedirect, async (req, res) => {

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

router.get('/goals/new', loggedOutRedirect, (req, res) => {

  res.render('createGoal', { 
    title: 'Create New Goal',
    todayDate: today
  });
});

router.post('/goals', async (req, res) => {
  const userId = req.session.user._id;
  const { goalTitle, targetDate } = req.body;

  try {
    await createGoal(userId, goalTitle, targetDate);
    res.redirect('/dashboard');
  } catch (e) {
    res.status(400).render('createGoal', {
      title: 'Create New Goal',
      error: e.toString()
    });
  }
});

router.post('/goals/complete/:id', async (req, res) => {
  try {
    await markGoalCompleted(req.params.id);
    res.redirect('/dashboard');
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

router.post('/preferences', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { showCourses, showGoals, showRecommendations } = req.body;

    const usersCollection = await users();
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'dashboardPreferences.showCourses': !!showCourses,
          'dashboardPreferences.showGoals': !!showGoals,
          'dashboardPreferences.showRecommendations': !!showRecommendations
        }
      }
    );

    res.redirect('/dashboard');
  } catch (e) {
    res.status(500).render('error', { error: e.toString() });
  }
});

router.post('/save-layout', async (req, res) => {
  const userId = req.session.user._id;
  const { section, width, height } = req.body;

  if (!['courses', 'goals', 'recommendations'].includes(section)) return res.sendStatus(400);

  try {
    const usersCollection = await users();
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          [`dashboardPreferences.layout.${section}.width`]: width,
          [`dashboardPreferences.layout.${section}.height`]: height
        }
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error('Failed to save layout:', err);
    res.sendStatus(500);
  }
});



export default router;