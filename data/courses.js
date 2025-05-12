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
  
  const [startMonth, startDay, startYear] = startDate.split('/');
  const [endMonth, endDay, endYear] = endDate.split('/');
  const start = new Date(`${startYear}-${startMonth}-${startDay}`);
  const end = new Date(`${endYear}-${endMonth}-${endDay}`);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (end < today) throw 'End date cannot be before today';
  if (end < start) throw 'End date must be after start date';
  
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
  
