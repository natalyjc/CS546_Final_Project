import { Router } from 'express';
import { connectDb } from '../config/mongoConnection.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

router.get('/', isAdmin, async (req, res) => {
  const db = await connectDb();
  const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
  res.render('adminDashboard', {
    title: 'Admin Dashboard',
    users
  });
});

export default router;