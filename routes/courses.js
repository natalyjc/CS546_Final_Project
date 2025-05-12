import express from 'express';
const router = express.Router();

import {
  getCoursesByUserId,
  deleteCourse,
  createCourse,
  getCourseById,
  updateCourse
} from '../data/courses.js';
import { getGoalsByUserId } from '../data/goals.js';
import { getUserById } from '../data/users.js';
import { checkEmpty, validCourseTitle, validDate, validateDateOrder } from '../utils/validation.js';
import { courses } from '../config/mongoCollections.js';
import { ConnectionCheckOutStartedEvent, ObjectId } from 'mongodb';
import { loggedOutRedirect } from '../middleware/auth.js';

// --- Course Creation ---
router.get('/new', loggedOutRedirect, (req, res) => {
  res.render('createCourse', { title: 'Create New Course' });
});

router.post('/', loggedOutRedirect, async (req, res) => {
  const userId = req.session.user._id;
  let { title, notes, startDate, endDate } = req.body;
  try {
    title = checkEmpty(title);
    const safeTitle = validCourseTitle(title);
    validateDateOrder(startDate, endDate);
    const newCourse = await createCourse(userId, safeTitle, notes, startDate, endDate);
    res.redirect(`/courses/${newCourse._id}`);
  } catch (error) {
    res.status(400).render('createCourse', { title: 'Create New Course', error: error.toString() });
  }
});

// --- Course View ---
router.get('/:id', loggedOutRedirect, async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    res.render('courseView', { course, title: course.title });
  } catch (e) {
    res.status(404).render('error', { error: 'Course not found' });
  }
});

// --- Assignments ---
router.post('/:id/assignments', loggedOutRedirect, async (req, res) => {
  try {
    let { title, description, dueDate } = req.body;
    title = checkEmpty(title, "Title");
    description = checkEmpty(description, "Description");
    dueDate = validDate(dueDate);
    const courseCollection = await courses();
    await courseCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: {
          assignments: {
            assignmentId: new ObjectId().toString(),
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate,
            isCompleted: false
          }
        }
      }
    );
    res.redirect(`/courses/${req.params.id}`);
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

router.get('/:courseId/assignments/:assignmentId/edit', loggedOutRedirect, async (req, res) => {
  const course = await courses().then(c => c.findOne({ _id: new ObjectId(req.params.courseId) }));

  const assignment = course?.assignments?.find(a => a.assignmentId === req.params.assignmentId);

  if (!assignment) return res.status(404).render('error', { error: 'Assignment not found' });

  const formattedDueDate = new Date(assignment.dueDate).toISOString().slice(0, 16); 

  res.render('editAssignment', { courseId: req.params.courseId, assignment, formattedDueDate });
});

router.post('/:courseId/assignments/:assignmentId/edit', loggedOutRedirect, async (req, res) => {
  try {
    let { title, description, dueDate } = req.body;
    title = checkEmpty(title, "Title");
    description = checkEmpty(description, "Description");
    dueDate = validDate(dueDate);


    const result = await courses().then(c =>
      c.updateOne(
        { _id: new ObjectId(req.params.courseId), 'assignments.assignmentId': req.params.assignmentId },
        {
          $set: {
            'assignments.$.title': title.trim(),
            'assignments.$.description': description.trim(),
            'assignments.$.dueDate': new Date(dueDate)
          }
        }
      )
    );
    if (result.matchedCount === 0) {
      throw 'Assignment not found — update failed';
    }
    
    if (result.modifiedCount === 0) {
      console.warn('No changes were made to the assignment.');
    }

    res.redirect(`/courses/${req.params.courseId}`);
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

router.post('/:courseId/assignments/:assignmentId/complete', loggedOutRedirect, async (req, res) => {
  try {
    await courses().then(c =>
      c.updateOne(
        { _id: new ObjectId(req.params.courseId), 'assignments.assignmentId': req.params.assignmentId },
        { $set: { 'assignments.$.isCompleted': true, 'assignments.$.completedDate': new Date() } }
      )
    );
    res.redirect(`/courses/${req.params.courseId}`);
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

router.post('/:courseId/assignments/:assignmentId/delete', loggedOutRedirect, async (req, res) => {
  try {
    await courses().then(c =>
      c.updateOne(
        { _id: new ObjectId(req.params.courseId) },
        { $pull: { assignments: { assignmentId: req.params.assignmentId } } }
      )
    );
    res.redirect(`/courses/${req.params.courseId}`);
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

// --- Resources ---
router.post('/:id/resources', loggedOutRedirect, async (req, res) => {
  try {
    let { title, link } = req.body;
    title = checkEmpty(title);
    link = checkEmpty(link);
    await courses().then(c =>
      c.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $push: {
            resources: {
              resourceId: new ObjectId().toString(),
              title: title.trim(),
              link: link.trim()
            }
          }
        }
      )
    );
    res.redirect(`/courses/${req.params.id}`);
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

router.get('/:courseId/resources/:resourceId/edit', loggedOutRedirect, async (req, res) => {
  try {
    const course = await courses().then(c => c.findOne({ _id: new ObjectId(req.params.courseId) }));
    const resource = course?.resources?.find(r => r.resourceId === req.params.resourceId);
    if (!resource) throw 'Resource not found';
    res.render('editResource', { courseId: req.params.courseId, resource });
  } catch (e) {
    res.status(404).render('error', { error: e.toString() });
  }
});

router.post('/:courseId/resources/:resourceId/edit', loggedOutRedirect, async (req, res) => {
  try {
    let { title, link } = req.body;
    title = checkEmpty(title);
    link = checkEmpty(link);
    const result = await courses().then(c =>
      c.updateOne(
        { _id: new ObjectId(req.params.courseId), 'resources.resourceId': req.params.resourceId },
        { $set: { 'resources.$.title': title.trim(), 'resources.$.link': link.trim() } }
      )
    );
    if (result.modifiedCount === 0) throw 'Resource update failed';
    res.redirect(`/courses/${req.params.courseId}`);
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

router.post('/:courseId/resources/:resourceId/delete', loggedOutRedirect, async (req, res) => {
  try {
    const result = await courses().then(c =>
      c.updateOne(
        { _id: new ObjectId(req.params.courseId) },
        { $pull: { resources: { resourceId: req.params.resourceId } } }
      )
    );
    if (result.modifiedCount === 0) throw 'Resource deletion failed';
    res.redirect(`/courses/${req.params.courseId}`);
  } catch (e) {
    res.status(400).render('error', { error: e.toString() });
  }
});

// --- Delete Course ---
router.post('/delete/:id', loggedOutRedirect, async (req, res) => {
  try {
    const userId = req.session.user._id;
    await deleteCourse(req.params.id, userId);
    res.redirect('/dashboard');
  } catch (error) {
    const userId = req.session.user._id;
    const user = await getUserById(userId);
    const coursesList = await getCoursesByUserId(userId);
    const goals = await getGoalsByUserId(userId);
    res.status(400).render('dashboard', {
      title: 'Dashboard',
      firstName: user.firstName,
      isAdmin: user.isAdmin,
      courses: coursesList,
      goals,
      error: error.toString()
    });
  }
});

// --- Edit Course ---
router.get('/:id/edit', loggedOutRedirect, async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    res.render('editCourse', { course });
  } catch (e) {
    res.status(404).render('error', { error: 'Course not found' });
  }
});

router.post('/:id/update', loggedOutRedirect, async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    const courseId = req.params.id;
    const userId = req.session.user._id;
    const safeTitle = validCourseTitle(title);
    validateDateOrder(startDate, endDate);
    await updateCourse(courseId, userId, safeTitle, startDate, endDate);
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).render('editCourse', {
      error: error.toString(),
      course: {
        _id: req.params.id,
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      }
    });
  }
});

export default router;
