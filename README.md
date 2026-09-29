# EventManch

EventManch is a full-stack MERN (MongoDB, Express.js, React, Node.js) event booking platform with OTP-based verification, role-based dashboards, and admin-managed booking confirmations.

# Live Demo

[EventManch — Live Project](https://eventmanch.vercel.app)

## Project Overview

EventManch allows users to discover events, view event details, submit booking requests with OTP-based verification, and track or cancel their bookings from a personal dashboard. Admins can create and manage events, review booking requests, and confirm or cancel bookings. The platform uses JWT-based authentication, role-based access control, MongoDB-backed persistence, and email-based verification and booking notifications.

## Features

- User registration and login with JWT authentication.
- Email OTP verification for account activation.
- Event discovery with search and event detail pages.
- OTP-based booking request flow for additional verification.
- User dashboard to view, track, and cancel bookings.
- Admin dashboard to create and delete events and manage booking approvals.
- Role-based access control for user and admin functionality.
- Booking states (`pending`, `confirmed`, `cancelled`) and payment states (`paid`, `not_paid`).
- Seat availability tracking with automatic updates on bookings and cancellations.
- Automated email notifications for OTP verification and booking confirmations.
- Seed script for quick local data setup.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Icons.
- Backend: Node.js, Express.js.
- Database: MongoDB with Mongoose.
- Authentication/Security: JWT, bcrypt.
- Email Service: Brevo Transactional Email API.

## Architecture Overview

1. React frontend (`client`) handles UI, routing, and authenticated API calls.
2. Express backend (`server`) exposes REST endpoints for authentication, events, and bookings.
3. JWT middleware protects private/admin routes and enforces role-based access.
4. Business logic in controllers validates OTPs, manages booking lifecycle, and updates seat availability.
5. MongoDB stores application entities (`User`, `Event`, `Booking`, `OTP`).
6. Brevo Transactional Email API handles OTP and booking confirmation emails.

High-level flow:


`Frontend (React)` → `REST API (Express)` → `MongoDB (Mongoose)`

`REST API (Express)` → `Brevo Transactional Email API` → `Email`

## Project Structure

```text
EventManch/
├── assets/
│   ├── docs/                 # DFD, flowcharts, and supporting documentation
│   └── screenshots/          # UI snapshots
├── client/
│   ├── src/
│   │   ├── components/       # Shared UI components (e.g., Navbar)
│   │   ├── context/          # Auth context and session state
│   │   ├── pages/            # Home, Event Detail, Auth, User/Admin dashboards
│   │   └── utils/axios.js    # Axios instance and auth header interceptor
│   ├── index.html
│   └── package.json
├── server/
│   ├── controllers/          # Route handlers and business logic
│   ├── middleware/           # JWT auth and admin guard middleware
│   ├── models/               # Mongoose models (User, Event, Booking, OTP)
│   ├── routes/               # API route modules (auth, events, bookings)
│   ├── utils/email.js        # Email API integration + OTP/booking email helpers
│   ├── seed.js               # Seed script for demo users/events/bookings
│   ├── server.js             # Express app bootstrap + DB connection
│   └── package.json
└── README.md
```

## Environment Setup

Create a `.env` file inside `server/` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_verified_sender_email
BREVO_API_KEY=your_brevo_api_key
JWT_SECRET=your_jwt_secret
```

Create a `.env` file inside `client/` with:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to the deployed backend API URL.

Notes:

- `BREVO_API_KEY` is used by the backend for transactional email delivery.
- `VITE_API_URL` configures the frontend API endpoint for different environments.
- Keep `.env` values private and never commit them to source control.

## Local Development Setup

1. Clone the repository and move into the project root.
2. Install server dependencies:

```bash
cd server
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

4. Configure environment variables in `server/.env` and `client/.env`.
5. Start backend server:

```bash
cd ../server
npm run dev
```

6. Start frontend app in a second terminal:

```bash
cd client
npm run dev
```

7. Open the frontend URL shown by Vite (typically `http://localhost:5173`).

Optional: seed demo data (users/events/bookings):

```bash
cd server
npm run seed
```

## Future Improvements

- Integrate a real payment gateway (e.g., Razorpay or Stripe) to automate payment processing instead of manually managing `paid` and `not_paid` statuses.
- Add pagination, advanced filtering, and sorting to improve event discovery and browsing as the number of events grows.
- Add automated unit and integration tests for authentication, booking, OTP verification, and critical API flows.
- Implement automated email reminders and notifications for upcoming events, booking status changes, and cancellations.
