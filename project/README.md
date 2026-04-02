# Nucleus — Full-Stack Web Application

A modern full-stack workspace app with authentication, task management, and notes — built with React + Express + PostgreSQL.

---

## 📁 Project Structure

```
project/
├── frontend/          # React (Vite) SPA
│   ├── src/
│   │   ├── components/    # Layout, shared components
│   │   ├── pages/         # LoginPage, RegisterPage, Dashboard, Tasks, Notes, Profile
│   │   ├── hooks/         # useAuth (AuthContext)
│   │   └── utils/         # Axios API client
│   └── vite.config.js
│
└── backend/           # Express REST API
    ├── controllers/   # authController, tasksController, notesController
    ├── routes/        # /api/auth, /api/tasks, /api/notes
    ├── middleware/    # JWT auth middleware
    ├── db/            # PostgreSQL pool + schema init
    └── server.js
```

---

## 🚀 Getting Started

### 1. PostgreSQL

Create a database:
```sql
CREATE DATABASE appdb;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials & JWT secret
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 🔑 Features

| Feature | Details |
|---|---|
| **Auth** | Register, Login, JWT tokens, protected routes |
| **Dashboard** | Stats overview, recent tasks & notes |
| **Tasks** | CRUD, status (todo/in_progress/done), priority, due dates, filters |
| **Notes** | CRUD, color coding, pin/unpin |
| **Profile** | Edit name/avatar, view account info |

---

## 🛠 Tech Stack

**Frontend:** React 18, React Router 6, Vite, Axios  
**Backend:** Node.js, Express 4, bcryptjs, jsonwebtoken  
**Database:** PostgreSQL (via `pg` driver)

---

## 📡 API Endpoints

```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login, returns JWT
GET    /api/auth/me           Get current user (auth)
PUT    /api/auth/profile      Update profile (auth)

GET    /api/tasks             List tasks (auth)
POST   /api/tasks             Create task (auth)
PUT    /api/tasks/:id         Update task (auth)
DELETE /api/tasks/:id         Delete task (auth)

GET    /api/notes             List notes (auth)
POST   /api/notes             Create note (auth)
PUT    /api/notes/:id         Update note (auth)
DELETE /api/notes/:id         Delete note (auth)
```
