# TaskFlow

A full-stack task management app built with the MERN stack. Users sign up, log in, and manage their own tasks (create, edit, move through statuses, search, filter, delete). Admins can see and manage every user's tasks.

## Key Features

- JWT authentication (register, login, persistent session, protected routes)
- Password hashing with bcrypt; role is never accepted from the client at signup
- Role-based access control: `user` sees only their own tasks, `admin` sees all
- Full CRUD REST API for tasks with ownership checks on every operation
- Search by title, filter by status and priority, pagination support on the API
- Dashboard stats (total / to do / in progress / done) via a MongoDB aggregation
- Centralised error handling (validation, bad ids, duplicate emails)
- Responsive React UI with debounced search

## Technologies Used

- **MongoDB** + Mongoose
- **Express.js** on **Node.js** (ES modules)
- **React 18** (Vite, React Router, Context API)
- JSON Web Tokens, bcryptjs, cors, dotenv

## Project Structure

```
taskflow/
├── server/
│   └── src/
│       ├── config/        # DB connection
│       ├── models/        # User, Task schemas
│       ├── controllers/   # auth + task logic
│       ├── routes/        # route definitions
│       ├── middleware/    # auth (protect, restrictTo), error handling
│       └── index.js
└── client/
    └── src/
        ├── api.js         # fetch wrapper
        ├── context/       # AuthContext
        ├── components/    # TaskForm, TaskCard, ProtectedRoute
        └── pages/         # AuthPage, Dashboard
```

## Setup and Installation

Prerequisites: Node.js 18+, and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env      # then edit JWT_SECRET (and MONGO_URI if needed)

# 2. Frontend
cd ../client
npm install
```

## Running the Application

Open two terminals:

```bash
# Terminal 1 – API on http://localhost:5000
cd server && npm run dev

# Terminal 2 – React app on http://localhost:5173
cd client && npm run dev
```

Vite proxies `/api` to the backend, so no extra CORS setup is needed in development.

To create an admin, register normally and then change the user's `role` to `admin` in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account, returns token |
| POST | `/api/auth/login` | Log in, returns token |
| GET | `/api/auth/me` | Current user |
| GET | `/api/tasks` | List tasks (`?q=&status=&priority=&page=&limit=`) |
| GET | `/api/tasks/stats` | Counts per status |
| POST | `/api/tasks` | Create task |
| GET / PUT / DELETE | `/api/tasks/:id` | Read / update / delete a task |

All `/api/tasks` routes require `Authorization: Bearer <token>`.

## Code0 Usage

<!-- FILL THIS IN YOURSELF, honestly, after you have actually used Code0. -->
I used the Code0 VS Code extension throughout development, including its terminal for Git operations (init, commits, push).

## AI Development Experience

<!-- Write 1 short paragraph in your own words: how you prompted Code0, what you
accepted, what you rejected or fixed, and how you verified the output. -->

TODO

### Tasks where Code0 helped

<!-- List 3-5 REAL tasks. Examples of the kind of thing to cover, only if true for you:
     component development, API creation, debugging, DB integration, refactoring, testing. -->

1. TODO
2. TODO
3. TODO
