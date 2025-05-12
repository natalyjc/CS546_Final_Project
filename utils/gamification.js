import { users } from '../config/mongoCollections.js';
import { goals } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

export const awardBadges = async (userId) => {
  const usersCollection = await users();
  const goalsCollection = await goals();

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error("User not found");

  const completedGoalsCount = await goalsCollection.countDocuments({
    userId: userId,
    isCompleted: true
  });

  const existingBadges = user.badges || [];
  const newBadges = [];

  const badgeThresholds = [
    { threshold: 1, name: "First Goal" },
    { threshold: 5, name: "5 Goals" },
    { threshold: 10, name: "10 Goals" },
    { threshold: 20, name: "20 Goals" },
    { threshold: 50, name: "50 Goals" },
    { threshold: 100, name: "100 Goals" }
  ];

  for (const badge of badgeThresholds) {
    if (
      completedGoalsCount >= badge.threshold &&
      !existingBadges.includes(badge.name)
    ) {
      newBadges.push(badge.name);
    }
  }

    if (newBadges.length > 0) {
    // Update badges
    await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
        $addToSet: { badges: { $each: newBadges } }
        }
    );
    }

    // ✅ Always update points to match # of completed goals
    await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
        $set: { points: completedGoalsCount }
    }
    );
};