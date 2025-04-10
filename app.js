import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';
import authRoutes from './routes/auth.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: 'AuthCookie',
  secret: 'personalizedLearningSecret',
  resave: false,
  saveUninitialized: true
}));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
