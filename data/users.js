import { connectDb } from '../config/mongoConnection.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import { validEmail, validName, validPassword } from '../utils/validation.js';

// create a new user 
export const createUser = async (firstName, lastName, email, password, isAdmin = false) => {
  try{
    firstName = validName(firstName).trim();
    lastName = validName(lastName).trim();
    email = validEmail(email).trim();
    password = validPassword(password).trim();
  }catch(e){
    throw e;
  }

  const usersCollection = await users();

  const existing = await usersCollection.findOne({ email });
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

  const result = await usersCollection.insertOne(newUser);
  if (!result.acknowledged) throw 'User creation failed';

  return { _id: result.insertedId, email, isAdmin };
};

// check user
export const checkUser = async (email, password) => {
  if (!email || !password) throw 'Email and password required';

  const usersCollection = await users();

  const user = await usersCollection.findOne({ email });
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

// get user by id
export const getUserById = async (id) => {
  if (!id) throw 'User ID required';

  const usersCollection = await users();

  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw 'User not found';

  return user;
};