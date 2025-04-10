import { Router } from 'express';
import { createUser, checkUser } from '../data/users.js';

const router = Router();

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await checkUser(username, password);
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (e) {
    res.status(401).render('login', { error: e });
  }
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await createUser(username, password);
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (e) {
    res.status(400).render('register', { error: e });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;
