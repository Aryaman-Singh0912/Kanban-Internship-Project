# Kanban Enterprise - Task and Workflow Manager

A high-contrast, production-ready Kanban Board engineered for software development teams. Built with a strict focus on Role-Based Access Control (RBAC), state-machine-driven task automation, and data integrity.

Unlike standard drag-and-drop sticky note apps, this application enforces real-world workplace hierarchies, code-review pipelines, and strict approval checkpoints.

![Frontend](https://img.shields.io/badge/Frontend-React_19_%2B_Vite-90ee90?style=flat-square&logo=react&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT-black?style=flat-square)

> Built during my internship for **AllCargo Logistics Ltd.** (Gurugram). No live deployment link — the app is meant to be cloned and run on the company's internal database, and showcasing a live demo would require sharing admin/user credentials tied to that database.

---

## Demo

> Screen recording walkthrough — live deployment isn't available since admin/user credentials are tied to the company's internal database.

https://github.com/user-attachments/assets/your-video-id-here

---

## Table of Contents

- [Demo](#demo)
- [Overview](#overview)
- [Design System](#design-system-neo-brutalism)
- [Key Features](#key-features-and-business-logic)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roles & Permissions](#roles--permissions)
- [License](#license)

---

## Overview

This project is a full-stack Kanban board built as an internship project, simulating a real internal company tool rather than a generic to-do app. It enforces:

- Strict **role-based views** for Employees vs Administrators
- A **controlled task lifecycle** (state machine) instead of free-form drag-and-drop
- **Safe deletion rules** so work in progress can't be lost accidentally

## Design System: Neo-Brutalism

This project actively rejects the soft, rounded, low-contrast corporate aesthetic in favor of Neo-Brutalism:

- **High Legibility** — pure pitch-black `#000000` hard borders (`4px solid black`)
- **Intentional Hierarchy** — high-saturation, color-coded status columns
- **Tactile UX** — sharp, non-blurred drop shadows (`6px 6px 0px #9d9d9d`) that make UI cards feel like physical, heavy index cards sitting on a desk

## Key Features and Business Logic

### 1. Role-Based Access Control (RBAC)

**Employee Portal**
- **Scoped Identity** — employees only view tasks explicitly assigned to them
- **Restricted Permissions** — employees cannot self-assign tasks, cannot view peer boards, and the "Add New Task" control is fully hidden from their view
- **Feedback Loop** — declined tasks automatically display the admin's rejection notes directly inside the task card

**Administrator Portal**
- **Dual-Mode Engine** — admins can toggle between Review Mode (a global filter for all tasks awaiting approval) and Employee View (inspecting a specific worker's board)
- **Master Dispatcher** — full clearance to create, assign, and distribute tasks to any employee
- **The Gatekeeper** — admins alone can approve submissions or decline them back to the employee with mandatory feedback

### 2. Automated State Machine (Task Pipeline)

Tasks follow a strict, controlled lifecycle and cannot jump stages arbitrarily:

1. **To-Do** — created by an Admin and assigned to an employee
2. **In Progress** — triggered once the employee attaches a code/attachment link to the card
3. **Under Review** — triggered when the employee submits the task for admin review
4. **Approved** — granted only via the admin verification dashboard (or **declined**, which sends it back to *In Progress* with feedback attached)

### 3. Safe Deletion Guardrails

- A task **cannot** be deleted while it is To-Do, In Progress, or Under Review
- The delete control is not rendered in the UI until a card reaches the **Approved** column
- Employees may only delete their own approved tasks; admins can delete any task

## Tech Stack

**Frontend** (`kanban-frontend/`)
- [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/) for API requests (with a JWT-attaching interceptor)
- [Lucide React](https://lucide.dev/) for icons
- Plain CSS (Neo-Brutalist design system)

**Backend** (`kanban-backend/`)
- [FastAPI](https://fastapi.tiangolo.com/) (Python)
- [SQLAlchemy 2.0](https://www.sqlalchemy.org/) ORM
- [Alembic](https://alembic.sqlalchemy.org/) for database migrations
- [PostgreSQL](https://www.postgresql.org/) (via `psycopg2-binary`)
- [python-jose](https://github.com/mpdavis/python-jose) for JWT auth
- [passlib](https://passlib.readthedocs.io/) + `bcrypt` for password hashing
- [Pydantic v2](https://docs.pydantic.dev/) for request/response schemas

## Project Structure

```
Kanban-Internship-Project/
├── kanban-backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy models (User, Task)
│   │   ├── routers/        # API route handlers (auth, tasks)
│   │   ├── database.py     # DB engine/session setup
│   │   ├── main.py         # FastAPI app entrypoint
│   │   ├── schemas.py      # Pydantic request/response schemas
│   │   └── utils.py        # JWT creation/verification, current-user dependency
│   ├── alembic/             # Migration environment & versions
│   ├── alembic.ini
│   └── requirements.txt
└── kanban-frontend/
    ├── src/
    │   ├── api/             # Axios instance with auth interceptor
    │   ├── components/      # Card, Column, Login components
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- [Python](https://www.python.org/) 3.11+
- A running [PostgreSQL](https://www.postgresql.org/) instance

### Backend Setup

```bash
cd kanban-backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create a .env file (see Environment Variables below)

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

### Frontend Setup

```bash
cd kanban-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** The backend's CORS config currently only allows requests from `http://localhost:5173`, and the frontend's Axios instance points to `http://127.0.0.1:8000` — keep both defaults unless you update them together in `kanban-backend/app/main.py` and `kanban-frontend/src/api/axiosInstance.js`.

## Environment Variables

Create a `.env` file inside `kanban-backend/` with the following keys:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database_name>
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
```

- `DATABASE_URL` — PostgreSQL connection string
- `SECRET_KEY` — secret used to sign JWT access tokens (generate a long random string)
- `ALGORITHM` — JWT signing algorithm (e.g. `HS256`)

## API Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new employee account | Public |
| `POST` | `/auth/login` | Log in and receive a JWT access token | Public |
| `GET` | `/me` | Get the current authenticated user | Authenticated |
| `GET` | `/users` | List all users | Admin only |
| `GET` | `/tasks/` | List tasks (all tasks for admins, own tasks for employees) | Authenticated |
| `GET` | `/tasks/{task_id}` | Get a single task | Owner or Admin |
| `POST` | `/tasks/` | Create a task | Admin only |
| `PATCH` | `/tasks/{task_id}` | Update a task (title, description, status, assignee, attachment, feedback) | Owner or Admin (some fields Admin-only) |
| `PATCH` | `/tasks/{task_id}/approve` | Approve a task | Admin only |
| `PATCH` | `/tasks/{task_id}/decline` | Decline a task back to "In Progress" with feedback | Admin only |
| `DELETE` | `/tasks/{task_id}` | Delete a task (Approved tasks only for employees) | Owner or Admin |

Full interactive API documentation is auto-generated by FastAPI at `/docs` once the backend is running.

## Roles & Permissions

| Action | Employee | Admin |
|---|---|---|
| View own tasks | ✅ | ✅ |
| View all tasks | ❌ | ✅ |
| Create tasks | ❌ | ✅ |
| Assign/reassign tasks | ❌ | ✅ |
| Attach a link / move to "In Progress" | ✅ | ✅ |
| Submit task for review | ✅ | ✅ |
| Approve / decline tasks | ❌ | ✅ |
| Delete tasks | ✅ (own, Approved only) | ✅ (any) |

## License

This project was built as part of an internship for **AllCargo Logistics Ltd.** Code is shared here for portfolio purposes only and is not licensed for reuse, modification, or redistribution.