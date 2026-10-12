# TaskFlow

A full-stack task management application built with the MERN stack. Users can sign up, log in, and manage their own tasks by creating, editing, updating statuses, searching, filtering, and deleting tasks. Admins can view and manage tasks across all users.

## Key Features

- JWT authentication with registration, login, persistent sessions, and protected routes
- Password hashing with `bcryptjs`; user roles are not accepted from the client during signup
- Role-based access control: regular users can access only their own tasks, while admins can access all tasks
- REST API with full CRUD operations for tasks and ownership checks
- Search by title, filter by status and priority, and API pagination
- Dashboard statistics (total, to do, in progress, and done) calculated using a MongoDB aggregation
- Centralized error handling for validation errors, invalid IDs, and duplicate email addresses
- Responsive React UI with debounced search

## Technologies Used

- **MongoDB** with Mongoose
- **Express.js** and **Node.js** using ES modules
- **React 18** with Vite, React Router, and Context API
- JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, and `dotenv`

## Project Structure

```text
taskflow/
├── server/
│   └── src/
│       ├── config/        # Database connection
│       ├── models/        # User and Task schemas
│       ├── controllers/   # Authentication and task logic
│       ├── routes/        # API route definitions
│       ├── middleware/    # Authentication, authorization, error handling
│       └── index.js
└── client/
    └── src/
        ├── api.js         # API request wrapper
        ├── context/       # AuthContext
        ├── components/    # TaskForm, TaskCard, ProtectedRoute
        └── pages/         # AuthPage, Dashboard
```

## Setup and Installation

### Prerequisites

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection URI

### Install dependencies

From the project root, install the backend and frontend dependencies in separate steps.

**Backend**

```bash
cd server
npm install
```

Create or update the `server/.env` file with the environment variables required by your backend, including `JWT_SECRET` and `MONGO_URI`. Use the variable names expected by your server configuration. Keep `.env` private and do not commit it to GitHub because it may contain secrets.

**Frontend**

Open a second terminal from the project root, then run:

```bash
cd client
npm install
```

## Running the Application

Run the backend and frontend in separate terminals from the project root.

**Terminal 1 — Backend API** (default: `http://localhost:5000`)

```bash
cd server
npm run dev
```

**Terminal 2 — React frontend** (default: `http://localhost:5173`)

```bash
cd client
npm run dev
```

In development, Vite proxies `/api` requests to the backend, so separate CORS configuration is not needed for this development setup.

## Creating an Admin User

Register an account through the application, then update that user's role in MongoDB. For example:

```js
db.users.updateOne(
  { email: "you@example.com" },
  { $set: { role: "admin" } }
)
```

Replace `you@example.com` with the email address of the account you want to promote. Only do this directly in your own development database.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account and return a token |
| `POST` | `/api/auth/login` | Log in and return a token |
| `GET` | `/api/auth/me` | Get the currently authenticated user |
| `GET` | `/api/tasks` | List tasks; supports `q`, `status`, `priority`, `page`, and `limit` query parameters |
| `GET` | `/api/tasks/stats` | Get task counts by status |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

All `/api/tasks` routes require an `Authorization: Bearer <token>` header.

## Code0 Usage



> **Before submission:** Keep only statements that accurately reflect how you actually used Code0. Do not claim that Code0 performed work it did not perform.

## AI Development Experience



> **Before submission:** Replace this guidance with a short, truthful first-person account of your actual Code0 workflow.

### Tasks Where Code0 Helped



1. **React component development:** Describe a component or frontend behavior Code0 helped you implement or refine.
2. **REST API development:** Describe an Express route or API behavior Code0 helped you create or review.
3. **Database integration:** Describe how Code0 helped with MongoDB/Mongoose models or database operations.
4. **Debugging and testing:** Describe an issue Code0 helped you investigate and how you tested the fix.
5. **Refactoring or Git workflow:** Describe a real code improvement or Git operation performed with Code0.



## Testing and Validation

