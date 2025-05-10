import { connectDb } from '../config/mongoConnection.js';
import { courses } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

// get courses by Id
export const getCoursesByUserId = async (userId) => {
  if (!userId) throw 'User ID is required';

  const coursesCollection = await courses();
  const userCourses = await coursesCollection.find({ userId: userId.toString() }).toArray();
  return userCourses;
};

// get course by course ID
export const getCourseById = async (id) => {
  if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
    throw 'Invalid course ID';
  }

  const courseCollection = await courses();
  const course = await courseCollection.findOne({ _id: new ObjectId(id) });

  if (!course) {
    throw 'Course not found';
  }

  return course;
};


// create a new course for a user
export const createCourse = async (userId, title, notes='', startDate, endDate) => {
  if (!userId || !title || !startDate || !endDate) throw 'All fields are required';

  const coursesCollection = await courses();

  const newCourse = {
    userId: userId.toString(),
    title,
    startDate,
    endDate,
    status: 'not started', 
    progress: 0,           
    notes: notes.trim(),
    resources: [],
    assignments: [] // sub document
  };

  const result = await coursesCollection.insertOne(newCourse);
  if (!result.acknowledged) throw 'Course creation failed';
  newCourse._id = result.insertedId;
  return newCourse;
};

// update course progress
export const updateCourseProgress = async (courseId) => {
    if (!courseId) throw 'Course ID is required';
  
    const coursesCollection = await courses();
  
    // get the course
    const course = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
    if (!course) throw 'Course not found';
  
    const assignments = course.assignments || [];
  
    // count total and completed assignments
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.scoreReceived !== undefined && a.scoreReceived !== null).length;
  
    // calculate progress
    let progress = 0;
    if (totalAssignments > 0) {
      progress = (completedAssignments / totalAssignments) * 100;
      progress = Math.round(progress); // round to nearest integer
    }
  
    // update progress in DB
    const result = await coursesCollection.updateOne(
      { _id: new ObjectId(courseId) },
      { $set: { progress } }
    );
  
    if (result.modifiedCount === 0) throw 'Could not update course progress';
    return true;
};

export const updateCourse = async (id, userId, title, startDate, endDate) => {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) throw 'Invalid ID(s)';

  const courseCollection = await courses();
  const result = await courseCollection.updateOne(
    { _id: new ObjectId(id), userId: userId },
    { $set: { title, startDate, endDate } }
  );

  if (result.modifiedCount === 0) throw 'Course update failed or no changes detected';
};



// delete a course by course ID 
export const deleteCourse = async (courseId, userId) => {
  if (!courseId) throw 'Course ID is required';
  if (!ObjectId.isValid(courseId)) throw 'Invalid course ID';

  const coursesCollection = await courses();
  const deletionResult = await coursesCollection.deleteOne({
    _id: new ObjectId(courseId),
    userId: userId.toString() // ensure only the owner can delete
  });

  if (deletionResult.deletedCount === 0) throw 'Course not found or could not be deleted';
  return true;
};
  
