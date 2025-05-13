import { Router } from 'express';
import { getGoalsByUserId } from '../data/goals.js';
import { loggedOutRedirect } from '../middleware/auth.js';
const router = Router();

router.get('/goals', loggedOutRedirect, async (req, res) => {
  try{
    const userId = req.session.user._id;
    const goals = await getGoalsByUserId(userId);
    res.json(goals);
  }catch(e){
    console.error(e);
    res.status(500).render('error', { error: 'Internal Server Error'});
  }
});

export default router;