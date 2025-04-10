import { connectDb } from '../config/mongoConnection.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

const saltRounds = 10;

export const createUser = async (username, password) => {
  const db = await connectDb();
  const users = db.collection('users');

  const hashed = await bcrypt.hash(password, saltRounds);
  const newUser = { username, password: hashed, goals: [], courses: [] };

  const insertResult = await users.insertOne(newUser);
  if (!insertResult.acknowledged) throw 'Insert failed!';
  return { _id: insertResult.insertedId, username };
};

export const checkUser = async (username, password) => {
  const db = await connectDb();
  const user = await db.collection('users').findOne({ username });
  if (!user) throw 'Invalid credentials';

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw 'Invalid credentials';

  return { _id: user._id, username: user.username };
};
