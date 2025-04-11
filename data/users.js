import { connectDb } from '../config/mongoConnection.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

export const createUser = async (firstName, lastName, email, password, isAdmin = false) => {
  if (!password) throw 'Password is required';

  const db = await connectDb();
  const users = db.collection('users');

  const existing = await users.findOne({ email });
  if (existing) throw 'Email already registered';

  const hashed = await bcrypt.hash(password, 10); 

  const newUser = {
    firstName,
    lastName,
    email,
    hashedPassword: hashed,
    createdAt: new Date(),
    isAdmin
  };

  const result = await users.insertOne(newUser);
  if (!result.acknowledged) throw 'User creation failed';

  return { _id: result.insertedId, email, isAdmin };
};


export const checkUser = async (email, password) => {
  const db = await connectDb();
  const user = await db.collection('users').findOne({ email });
  if (!user) throw 'Invalid email or password';

  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) throw 'Invalid email or password';

  return {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    isAdmin: user.isAdmin
  };
};