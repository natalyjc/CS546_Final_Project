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
export const createGoal = async (userId, goalTitle, targetDate) => {
  if (!userId || !goalTitle || !targetDate) throw 'All fields are required';

  const [month, day, year] = targetDate.split('/');
  const target = new Date(Date.UTC(year, month - 1, day)); // UTC midnight
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (target <= today) {
    throw 'Target date must be after today';
  }

  const goalsCollection = await goals();

  const newGoal = {
    userId: userId.toString(),
    goalTitle,
    targetDate: target, // stored as date-only
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

export const updateGoal = async (goalId, goalTitle, targetDate) => {
  if (!goalId || !goalTitle || !targetDate) throw 'All fields required';

  const [month, day, year] = targetDate.split('/');
  const target = new Date(Date.UTC(year, month - 1, day)); // UTC midnight

  const goalsCollection = await goals();

  const result = await goalsCollection.updateOne(
    { _id: new ObjectId(goalId) },
    { $set: { goalTitle, targetDate: target } }
  );

  if (result.matchedCount === 0) throw 'Goal not found or not authorized to edit.';
  return true;
};

export const deleteGoal = async (goalId) => {
  const goalsCollection = await goals();
  const result = await goalsCollection.deleteOne({ _id: new ObjectId(goalId) });
  if (result.deletedCount === 0) throw 'Failed to delete goal';
  return true;
};

export const getGoalById = async (goalId) => {
  if (!goalId || typeof goalId !== 'string' || !ObjectId.isValid(goalId)) {
    throw 'Invalid goal ID';
  }

  const goalsCollection = await goals();
  const goal = await goalsCollection.findOne({ _id: new ObjectId(goalId) });

  if (!goal) throw 'Goal not found';
  return goal;
};