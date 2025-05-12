import express from 'express';
const router = express.Router();

import { getCoursesByUserId, deleteCourse, createCourse } from '../data/courses.js';
import { getUserById } from '../data/users.js';
import { getGoalsByUserId, getGoalById, createGoal, markGoalCompleted, updateGoal, deleteGoal } from '../data/goals.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { awardBadges } from '../utils/gamification.js';
import { badgeMap } from '../utils/badgeMap.js';

const today = new Date().toISOString().split('T')[0];
import { loggedOutRedirect } from '../middleware/auth.js';

router.get('/', loggedOutRedirect, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await getUserById(userId);

    const prefs = {
      showGoals: user.dashboardPreferences?.showGoals ?? true,
      showCourses: user.dashboardPreferences?.showCourses ?? true,
      showRecommendations: user.dashboardPreferences?.showRecommendations ?? true,
      layout: user.dashboardPreferences?.layout ?? {}
    };


    // Collecting TotalAssignments and CompletedAssignments for Assignment-based progress tracking
    let courses = [];
    if (prefs.showCourses) {
      courses = await getCoursesByUserId(userId);
      
      courses = courses.map(course => {
        const totalAssignments = course.assignments ? course.assignments.length : 0;
        const completedAssignments = course.assignments ? 
          course.assignments.filter(a => a.isCompleted).length : 0;
        
        return {
          ...course,
          totalAssignments,
          completedAssignments
        };
      });
    }
    
    const goals = prefs.showGoals ? await getGoalsByUserId(userId) : [];

    const allBadges = badgeMap.map(b => ({
      ...b,
      earned: (user.points || 0) >= b.minPoints
    }));
    const visibleBadges = allBadges.filter(b => b.earned);

    res.render('dashboard', {
      title: 'Dashboard',
      firstName: user.firstName,
      isAdmin: user.isAdmin,
      dashboardPreferences: prefs,
      layoutPrefs: prefs.layout,
      courses,
      goals,
      user: {
        badges : visibleBadges,
        points : user.points || 0
      }
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

// GET: Edit form
router.get('/goals/:goalId/edit', async (req, res) => {
  const goal = await getGoalById(req.params.goalId);
  res.render('editGoal', { goal });
});

// POST: Save edits
router.post('/goals/:goalId/edit', async (req, res) => {
  try {
    await updateGoal(req.params.goalId, req.body.goalTitle, req.body.targetDate);
    res.redirect('/dashboard');
  } catch (e) {
    res.status(400).render('editGoal', { error: e, goal: req.body });
  }
});

router.post('/goals/:goalId/delete', async (req, res) => {
  try {
    await deleteGoal(req.params.goalId);
    res.redirect('/dashboard');
  } catch (e) {
    res.status(500).send(e);
  }
});


router.post('/goals/complete/:id', async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.session.user._id;

    await markGoalCompleted(goalId);
    await awardBadges(userId); // 👈 Add this line

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