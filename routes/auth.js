import { Router } from 'express';
import { checkUser, createUser } from '../data/users.js';

const router = Router();

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await checkUser(email, password);
    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      isAdmin: user.isAdmin
    };    
    if (user.isAdmin) {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  } catch (e) {
    res.status(401).render('login', { error: e });
  }
});


router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).render('register', { error: "All fields are required." });
  }

  try {
    const user = await createUser(firstName, lastName, email, password);
    req.session.user = {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    };
    res.redirect(user.isAdmin ? '/admin' : '/dashboard');
  } catch (e) {
    res.status(400).render('register', {
      error: typeof e === 'string' ? e : 'Registration failed'
    });
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;
