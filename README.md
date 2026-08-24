# Community Center Management System

A full-stack web application for managing a community center, its activities, events, and user registrations.

The system allows residents to register, browse courses and events, register for activities, purchase event tickets, read community updates, and manage their personal registrations.

Administrators can manage courses, events, news, and user inquiries through a dedicated dashboard.

---

## Key Features

### User Features

- User registration and login.
- Browse and filter community courses.
- Register for courses.
- Browse upcoming events.
- Purchase event tickets.
- Capacity validation to prevent registrations beyond the maximum number of participants.
- View registered courses and event tickets in a personal area.
- Submit inquiries through a contact form.
- View community news and updates.

### Admin Features

- Add, edit, and delete courses.
- Add, edit, and delete events.
- Manage community news.
- View and handle user inquiries.
- View registration lists for courses and events.
- Generate participant information through database queries.

---

## Resource Coordination

The system includes a reusable resource-coordination engine designed to prevent scheduling conflicts and duplicate reservations in real time.

The client interface supports dynamic updates to keep relevant information current.

---

## System Architecture

The application follows a client-server architecture:

- **Frontend:** React
- **Backend:** ASP.NET Core
- **Database:** Relational database

The backend handles business logic, database operations, registrations, capacity validation, and resource coordination, while the frontend provides the user and administrator interfaces.

---

## Database

The main entities include:

- Users
- Courses
- Events
- News
- Course Registrations
- Event Registrations
- Contact Inquiries
- Subjects
- Locations
- Target Audiences
- Employees

---

## Main Pages

- **Home** – upcoming events and latest community news.
- **Courses & Activities** – browse, filter, and register for courses.
- **Upcoming Events** – view events and purchase tickets.
- **News & Updates** – community announcements.
- **Contact** – submit inquiries.
- **Personal Area** – view registered courses and tickets.
- **Admin Dashboard** – manage content, inquiries, and registrations.

---

## Technologies

- React
- ASP.NET Core
- Database
- RESTful Web Application Architecture

---

## Project Highlights

- Full-stack web development.
- React-based dynamic UI.
- ASP.NET Core backend.
- Database-driven application.
- CRUD operations.
- User registration and authentication.
- Course and event management.
- Capacity and registration management.
- Resource conflict prevention.
- Real-time interface refresh.
