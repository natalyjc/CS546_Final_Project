# CS546_Final_Project

## ✅ Features Implemented

### User Authentication & Sessions

- User registration & login
- Session-based authentication with `express-session`
- Password hashing using `bcrypt`

### Role-Based Routing

- Admin vs. Regular user handling
- Middleware for admin-only routes

### Views & Styling

- Handlebars templates: login, register, dashboard, admin dashboard, create course
- Responsive UI with modern CSS styling

### Admin Dashboard

- Admin can view a table of all users (except passwords).

### Database Setup

- MongoDB connection is configured.
- User data functions (createUser, checkUser) implemented.

### Courses & Goals Features (Implemented)

- Courses Collection  
  - CRUD operations for adding and updating courses for a user.  
  - Frontend to display enrolled courses.  
  - Form and POST routes to allow users to add new courses via dashboard.

- Goals Collection  
  - Users can create and mark completed personal learning goals.  
  - UI components include checkboxes to track progress.

### Recommendations & APIs

- YouTube API integration via `youtubeApi.js` in utils.
- Basic recommendation logic implemented.

### Static Assets & Client Scripts

- CSS styling via `public/css/styles.css`
- Client-side scripts: `form_validation.js`, `recommendations.js`
  
### Basic Project Structure

### Courses & Goals Features
- Courses Collection

  - Build frontend forms and POST routes to allow users to add new courses via dashboard

```bash
.
├── README.md
├── app.js
├── config
│   ├── mongoCollections.js
│   ├── mongoConnection.js
│   └── settings.js
├── data
│   ├── courses.js
│   ├── goals.js
│   └── users.js
├── middleware
│   └── admin.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   └── styles.css
│   └── js
│       ├── form_validation.js
│       └── recommendations.js
├── routes
│   ├── admin.js
|   ├── courses.js
│   ├── auth.js
│   ├── dashboard.js
│   └── recommendations.js
├── tasks
│   └── seed.js
├── utils
│   ├── validation.js
│   └── youtubeApi.js
└── views
    ├── adminDashboard.handlebars
    ├── createCourse.handlebars
    ├── dashboard.handlebars
    ├── error.handlebars
    ├── layouts
    │   └── main.handlebars
    ├── login.handlebars
    └── register.handlebars
```

---

## 🛠️ To-Do / In Progress

### Courses & Goals Features


- Goals Collection:
  - Allow users to update and delete personal learning goals.
  - Build frontend forms and POST routes to allow users to add new goals via dashboard
  - Add targetDate to UI

#### Progress Tracking Dashboard

- Use Chart.js to visualize:
  - Course completion progress.
  - Weekly learning time.
  - Goal progress over time.
  
#### Gamification & Engagement (Extra Features)

- Points, badges, or streaks for completing goals.
- Daily/weekly email reminders (could use `node-cron` for local or Zoho/Mailgun API).
- “Motivational quote” or daily tip on the dashboard.

#### Error Handling + Validation

- Input validation for user registration and login.
- Try-catch wrappers across all route logic.
- User-friendly error messages in the UI.

#### Custom Dashboard per User

- Users should see:
  - Their own set of courses/goals.
  - Personalized content or learning feed.
  
#### Security Improvements

- Protect sensitive routes with middleware.
- Sanitize inputs to prevent injection.
- HTTPS if deploying live (e.g., via Heroku or Vercel).

## Running the App

```bash
npm install
npm run seed    # Seeds default admin and testuser
npm start       # Starts the server at http://localhost:3000
```
