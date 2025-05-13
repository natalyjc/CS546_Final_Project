# 📘 CS546 Final Project – Personalized Learning Dashboard

## ✅ Overview

This is a personalized learning dashboard web application that allows users to track learning goals, courses, and progress, with features like gamification, customizable layout, and intelligent video recommendations.

Built with **Node.js**, **Express**, **MongoDB**, **Handlebars**, and **Chart.js**, the app implements full-stack functionality, strong user validation, clean UI/UX, and meets all rubric requirements.

---

## 🚀 Features Implemented (Rubric-Matched)

### 🔐 User Authentication & Session Management

- User registration & login with password hashing via `bcrypt`
- Session-based authentication with `express-session`
- Role-based routing: admin vs. regular users

### 🖥️ Views, Layout & Styling

- Responsive, clean UI using custom CSS (15+ custom rules)
- Handlebars templates for all pages
- Form validation with user-friendly inline error messages
- Escape of all output to prevent XSS

### 🗂️ Core Functionality: Courses & Goals

- **Courses**: Create, edit, delete, view progress, track assignments
- **Goals**: Create, edit, complete, delete goals with target dates
- Embedded progress tracking via Chart.js (assignments & dates)
- Dashboard toggle preferences: show/hide Courses, Goals, Recommendations

### 📺 Recommendation Engine

- YouTube API integration recommends videos based on course topics

### 🎮 Gamification (Extra Credit)

- Badges and points awarded for goal completions
- Progress and achievements visible on dashboard

### 🧩 Customizable Dashboard (Extra Credit)

- Resizable layout blocks (Courses, Goals)
- Persisted in MongoDB and restored on login
- 🔄 "Reset Layout" option to restore defaults

### 📦 AJAX + Client-side JS

- Dashboard preferences saved via AJAX (with client/server error handling)
- JS validation and interactivity on forms (goals, login, register, etc.)

### 🧪 Validation & Security

- Full input validation client- and server-side
- Use of `xss()` to sanitize user inputs
- Duplicate email prevention (case-insensitive)
- All user inputs escaped using `{{variable}}` in Handlebars

### 🛠️ Admin Dashboard

- Admin can view all registered users
- Role-based route protection using middleware

---

## 🧪 Testing, Seeding & Startup

### 🧬 Seeding Test Users

```bash
npm run seed # Seeds default users including one admin and one test user
```

### 🔐 Environment Variables

- Create a `.env` file in the root of your project with the following:

```bash
YOUTUBE_API_KEY=your_actual_youtube_api_key_here
```

backup api -> AIzaSyDEoD3IQQfIZPg-oWYSXzr-_omjgHq2IyM

stevens email api -> AIzaSyAHDo5QLEioHtMrcMuoaFkjOQaURo-XVIY

### 🖥️  Run the App

```bash
npm install
npm start # Starts the server at http://localhost:3000
```

## 🗂️ Project Structure

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
│   ├── admin.js
│   └── auth.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   └── styles.css
│   ├── favicon.png
│   ├── images
│   │   └── badges
│   │       ├── first-goal.png
│   │       ├── goal-10.png
│   │       ├── goal-20.png
│   │       ├── goal-5.png
│   │       ├── goal-over100.png
│   │       └── goal-over50.png
│   └── js
│       ├── dashboard.js
│       ├── dashboardresize.js
│       ├── form_validation.js
│       ├── goal_validation.js
│       ├── goalsToggle.js
│       ├── login_validation.js
│       ├── progress.js
│       ├── recommendations.js
│       └── validateCourse.js
├── routes
│   ├── admin.js
│   ├── api.js
│   ├── auth.js
│   ├── courses.js
│   ├── dashboard.js
│   ├── landing.js
│   └── recommendations.js
├── tasks
│   └── seed.js
├── utils
│   ├── badgeMap.js
│   ├── gamification.js
│   ├── validation.js
│   └── youtubeApi.js
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
    │   └── main.handlebars
    ├── login.handlebars
    └── register.handlebars
```

Extra Credit Features Included

- Gamification (badges, points)
- Customizable Dashboard (resizable layout + reset)
