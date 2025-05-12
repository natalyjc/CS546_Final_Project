# CS546 Final Project

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

### Progress Tracking Dashboard

- Use Chart.js to visualize:
  - Needs to be modified to fit with total and completed course assignments and start-end dates of course
  - Course completion progress.
  - Weekly learning time (still in progress)
  - Goal progress over time (still in progress)

### Courses & Goals Features

- Goals Collection:
  - Allow users to update and delete personal learning goals.
  - Build frontend forms and POST routes to allow users to add new goals via dashboard
  - Add targetDate to UI

### Courses & Goals Features
- Courses Collection
  - Build frontend forms and POST routes to allow users to add new courses via dashboard

### Extra Feature

- Points, badges, or streaks for completing goals.
- Customizable Dashboard

### Basic Project Structure

```bash
.
├── README.md
├── app.js
├── config
│   ├── mongoCollections.js
│   ├── mongoConnection.js
│   └── settings.js
├── data
│   ├── courses.js
│   ├── goals.js
│   └── users.js
├── middleware
│   ├── admin.js
│   └── auth.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   └── styles.css
│   ├── favicon.png
│   ├── images
│   │   └── badges
│   │       ├── first-goal.png
│   │       ├── goal-10.png
│   │       ├── goal-20.png
│   │       ├── goal-5.png
│   │       ├── goal-over100.png
│   │       └── goal-over50.png
│   └── js
│       ├── dashboard.js
│       ├── dashboardresize.js
│       ├── form_validation.js
│       ├── goalsToggle.js
│       ├── progress.js
│       ├── recommendations.js
│       └── validateCourse.js
├── routes
│   ├── admin.js
│   ├── api.js
│   ├── auth.js
│   ├── courses.js
│   ├── dashboard.js
│   ├── landing.js
│   └── recommendations.js
├── tasks
│   └── seed.js
├── utils
│   ├── badgeMap.js
│   ├── gamification.js
│   ├── validation.js
│   └── youtubeApi.js
└── views
    ├── adminDashboard.handlebars
    ├── courseView.handlebars
    ├── createCourse.handlebars
    ├── createGoal.handlebars
    ├── dashboard.handlebars
    ├── editAssignment.handlebars
    ├── editCourse.handlebars
    ├── editGoal.handlebars
    ├── editResource.handlebars
    ├── error.handlebars
    ├── landing.handlebars
    ├── layouts
    │   └── main.handlebars
    ├── login.handlebars
    └── register.handlebars
```

---

## 🛠️ To-Do / In Progress
  
#### Gamification & Engagement (Extra Features)

- Daily/weekly email reminders (could use `node-cron` for local or Zoho/Mailgun API).
- “Motivational quote” or daily tip on the dashboard.

#### Error Handling + Validation

- Input validation for user registration and login.
- Try-catch wrappers across all route logic.
- User-friendly error messages in the UI.
  
#### Security Improvements

- Protect sensitive routes with middleware.
- Sanitize inputs to prevent injection.
- HTTPS if deploying live (e.g., via Heroku or Vercel).

## Running the App

### YouTube API Setup:

1. Go to the Google Cloud Console

2. Create a project and enable the YouTube Data API v3

3. Generate an API key

4. Create a .env file in the project root:

```bash
YOUTUBE_API_KEY=your_api_key_here
```

```bash
npm install
npm run seed    # Seeds default admin and testuser
npm start       # Starts the server at http://localhost:3000
```
