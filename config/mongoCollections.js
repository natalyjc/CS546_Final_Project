import { connectDb} from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await connectDb();
      _col = await db.collection(collection);
    }
    return _col;
  };
};

export const users = getCollectionFn('users');
export const courses = getCollectionFn('courses');
export const goals = getCollectionFn('goals');
