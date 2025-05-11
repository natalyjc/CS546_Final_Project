import { connectDb } from '../config/mongoConnection.js';
import { goals } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

// get all goals for a specific user
export const getGoalsByUserId = async (userId) => {
  if (!userId) throw 'User ID is required';

  const goalsCollection = await goals();
  const userGoals = await goalsCollection.find({ userId: userId.toString() }).toArray();
  return userGoals;
};

// create a new goal for a user
export const createGoal = async (userId, courseId, goalTitle, targetDate) => {
  if (!userId || !courseId || !goalTitle || !targetDate) throw 'All fields are required';

  const goalsCollection = await goals();

  const newGoal = {
    userId: userId.toString(),
    courseId,
    goalTitle,
    targetDate,
    isCompleted: false
  };

  const result = await goalsCollection.insertOne(newGoal);
  if (!result.acknowledged) throw 'Goal creation failed';

  return newGoal;
};

// mark goal as completed
export const markGoalCompleted = async (goalId) => {
  if (!goalId) throw 'Goal ID is required';

  const goalsCollection = await goals();

  const result = await goalsCollection.updateOne(
    { _id: new ObjectId(goalId) },
    { $set: { isCompleted: true } }
  );

  if (result.modifiedCount === 0) throw 'Could not mark goal as completed';
  return true;
};
