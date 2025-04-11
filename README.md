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

- Handlebars templates: login, register, dashboard, admin dashboard
- Responsive UI with modern CSS styling

### Admin Dashboard

- Admin can view a table of all users (except passwords).

### Database Setup

- MongoDB connection is configured.
- User data functions (createUser, checkUser) implemented.

### Basic Project Structure

```bash
.
├── README.md
├── app.js
├── config
│   ├── mongoConnection.js
│   └── settings.js
├── data
│   └── users.js
├── middleware
│   └── admin.js
├── package-lock.json
├── package.json
├── public
│   └── css
│       └── styles.css
├── routes
│   ├── admin.js
│   ├── auth.js
│   └── dashboard.js
├── tasks
│   └── seed.js
└── views
    ├── adminDashboard.handlebars
    ├── dashboard.handlebars
    ├── layouts
    │   └── main.handlebars
    ├── login.handlebars
    └── register.handlebars
```

---

## 🛠️ To-Do / In Progress

### Courses & Goals Features

- Courses Collection

  - CRUD operations for adding, updating, and removing courses for a user.
  - Frontend to display enrolled courses.
  - Optional: YouTube/Coursera API integration for recommendations.

- Goals Collection:
  - Allow users to set, update, and delete personal learning goals.
  - Add a UI component to track progress (like checkboxes or percentage).
  - Store goal completion status and deadlines.

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
