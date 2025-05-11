import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import landingRoutes from './routes/landing.js';
import coursesRoutes from './routes/courses.js';
import recommendationRoutes from './routes/recommendations.js';
import apiRoutes from './routes/api.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string',
  resave: false,
  saveUninitialized: false
}));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Route registration
app.use('/', landingRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/courses', coursesRoutes);
app.use('/recommendations', recommendationRoutes);

app.get('/', (req, res) => {
  if (req.session.user) {
    console.log("true");
    if (req.session.user.isAdmin) {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});