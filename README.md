# Ruminarium - Full-Stack Journal App

Ruminarium is a full-stack journaling application built to demonstrate hands-on learning with modern web technologies.  
It uses **React**, **Vite**, and **Tailwind CSS** for the frontend, **FastAPI** for the backend, and **PostgreSQL** as the database.  
All services are containerized using **Docker**.
---

## Features

- User registration and login with JWT authentication
- CRUD operations for journals
- Secure password hashing with Argon2 (via Passlib)
- Dockerized environment for easy setup
- API accessible at `/api/v1`  
- Frontend served via Nginx

---

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

> No need to install Python, Node, or PostgreSQL locally; everything runs in containers.

---

## Getting Started (Local Deployment)

1. **Clone the repository**
```bash
git clone https://github.com/<your-username>/ruminarium.git
cd ruminarium
```

2. **Add environment variables**

Create a .env file in the backend/ directory:

```bash
DATABASE_URL=postgresql://user:password@db:5432/journal_db
SECRET_KEY=your-super-secret-key
```

3. **Start the containers**

From the project root:

```bash
docker-compose up --build
```

This will build and run three services:

- db: PostgreSQL database (port 5433 mapped locally)

- backend: FastAPI backend (port 8000)

- frontend: React frontend served by Nginx (port 80)

4. **Access the app**

- Frontend: http://localhost

- Backend API docs: http://localhost:8000/docs or http://localhost:8000/redoc

---

### Notes

- The frontend expects the API URL to be http://localhost:8000/api/v1. If you change ports, update frontend/.env or VITE_API_URL.

- Passwords are hashed using Argon2. Make sure argon2-cffi is installed in the backend container.

- Data persists via Docker volume postgres_data.

---

### Available Scripts (Frontend)

Inside the frontend container:

- npm run dev – Start dev server (Vite)

---

### Available Scripts (Backend)

Inside the backend container:

- uvicorn app.main:app --reload – Start dev server

---

### Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Frontend    | React, Vite, TailwindCSS |
| Backend     | FastAPI, SQLAlchemy      |
| Auth        | JWT, Passlib (Argon2)    |
| Database    | PostgreSQL               |
| Deployment  | Docker, Docker Compose, Nginx |

---

## This project is for educational purposes and personal use.
