// seed.js
import { create } from 'express-handlebars';
import { createUser } from '../data/users.js';

const seed = async () => {
  try {
    const users = [
      { firstName: 'Admin', lastName: 'User', email: 'admin@example.com', password: 'adminpass', isAdmin: true },
      { firstName: 'TestUser', lastName: 'TestUser', email: 'testuser@example.com', password: 'testuser', isAdmin: false },
    ];

    for (const user of users) {
      const created = await createUser(
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.isAdmin
      );
      console.log(`Seeded user: ${created.email} (${user.isAdmin ? 'admin' : 'user'})`);
    }

    console.log('✅ All seed users created!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
};

seed();

