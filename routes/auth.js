import { Router } from 'express';
import { checkUser, createUser } from '../data/users.js';
import { validName, validEmail, validPassword } from '../utils/validation.js';

const router = Router();

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  try {
    email = validEmail(email);
    password = validPassword(password).trim();
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
  let { firstName, lastName, email, password } = req.body;
  try {
    firstName = validName(firstName).trim();
    lastName = validName(lastName).trim();
    email = validEmail(email).trim();
    password = validPassword(password).trim();
  } catch (e) {
    return res.status(400).render('register', { error: e });
  }

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
  res.redirect('/auth/login');
});

export default router;
