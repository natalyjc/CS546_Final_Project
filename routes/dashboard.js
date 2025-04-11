import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.redirect('/login');
    }

    // Render dashboard with user data
    res.render('dashboard', {
      title: 'Dashboard',
      firstName: req.session.user.firstName,
      isAdmin: req.session.user.isAdmin
    });
  } catch (error) {
    res.status(500).render('error', { error: 'Internal Server Error' });
  }
});

export default router;