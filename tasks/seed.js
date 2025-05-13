// tasks/seed.js
import { ObjectId } from 'mongodb';
import { createUser } from '../data/users.js';
import { createCourse } from '../data/courses.js';
import { createGoal } from '../data/goals.js';
import { connectDb } from '../config/mongoConnection.js';
import { awardBadges } from '../utils/gamification.js';
import { getGoalsByUserId } from '../data/goals.js';
import { markGoalCompleted } from '../data/goals.js';

const seed = async () => {
  const db = await connectDb();
  await db.dropDatabase(); 

  try {
    console.log('Seeding users...');
    const admin = await createUser('Admin', 'User', 'admin@example.com', 'adminpass', true);
    const user = await createUser('Test', 'User', 'testuser@example.com', 'testuser', false);

    console.log('Seeding courses...');
    const course1 = await createCourse(
      user._id.toString(),
      'Web Programming',
      'Learn full-stack JS',
      '2025-01-01',
      '2025-06-01'
    );
    const course2 = await createCourse(
      user._id.toString(),
      'Machine Learning',
      'Intro to ML',
      '2025-02-01',
      '2025-06-01'
    );

    const coursesCollection = (await import('../config/mongoCollections.js')).courses;
    const c = await coursesCollection();
    
    // Add assignments and resources with assignmentId
    await c.updateOne(
      { _id: course1._id },
      {
        $set: {
          assignments: [
            {
              assignmentId: new ObjectId().toString(),
              title: 'HW1',
              dueDate: new Date('2025-04-15T11:59Z'),
              isCompleted: true
            },
            {
              assignmentId: new ObjectId().toString(),
              title: 'HW2',
              dueDate: new Date('2025-05-13T11:59Z'),
              isCompleted: false
            }
          ],
          resources: [
            { 
              resourceId: new ObjectId().toString(),
              title: 'Intro Slides', 
              link: 'https://example.com/slides1' }
          ]
        }
      }
    );

    await c.updateOne(
      { _id: course2._id },
      {
        $set: {
          assignments: [
            {
              assignmentId: new ObjectId().toString(),
              title: 'Project Proposal',
              dueDate: new Date('2025-05-15T11:59Z'),
              isCompleted: false
            }
          ],
          resources: [
            { 
              resourceId: new ObjectId().toString(),
              title: 'ML Video', 
              link: 'https://example.com/ml' }
          ]
        }
      }
    );

    console.log('Seeding goals...');
    await createGoal(user._id.toString(), 'Finish Web Dev Course', '06/15/2025');
    await createGoal(user._id.toString(), 'Watch 3 ML videos', '07/15/2025');
    await createGoal(user._id.toString(), 'Goal 3', '08/01/2025');
    await createGoal(user._id.toString(), 'Goal 4', '08/15/2025');
    await createGoal(user._id.toString(), 'Goal 5', '09/01/2025');
    await createGoal(user._id.toString(), 'Goal 6', '09/15/2025');


    console.log('Marking 5 goals completed for badge test...');
    const goals = await getGoalsByUserId(user._id.toString());
    for (let i = 0; i < 5 && i < goals.length; i++) {
      await markGoalCompleted(goals[i]._id.toString());
    }

    console.log('Awarding badges...');
    await awardBadges(user._id.toString());

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (e) {
    console.error('Error during seeding:', e);
    process.exit(1);
  }
};

seed();