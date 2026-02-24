# Ruminarium

Ruminarium is a journaling application built to demonstrate hands-on learning with modern web technologies.
It uses **React**, **Vite**, and **Tailwind CSS** for the frontend, **FastAPI** for the backend, and **PostgreSQL** as the database.
All services are containerized using **Docker**.

---

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete journal entries
- Full-text search across journal entries with ranked, highlighted results (PostgreSQL native FTS)
- Secure password hashing with Argon2 (via Passlib)
- Dockerized environment for easy setup
- API accessible at `/api/v1`
- Frontend served via Nginx

---

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

> No need to install Python, Node, or PostgreSQL locally — everything runs inside containers.

---

## Project Structure

```
ruminarium/
├── backend/              # FastAPI application
│   ├── alembic/          # Database migrations
│   │   └── versions/     # Individual migration files
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── crud/         # Database operations
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── core/         # Security & config
│   │   ├── db/           # Database connection
│   │   └── main.py       # App entry point
│   └── alembic.ini       # Alembic configuration
├── frontend/             # React + Vite application
├── docker-compose.yml
└── .env                  # (you create this — see below)
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory. This file is not committed to Git and must be created manually.

```bash
# backend/.env

# PostgreSQL connection string — use this exact value when running via Docker
DATABASE_URL=postgresql://user:password@db:5432/journal_db

# Secret key used to sign JWT tokens — change this to any long random string
SECRET_KEY=your-super-secret-key
```

> **Why `@db:5432`?** Inside Docker, services talk to each other using their service names as hostnames. `db` refers to the PostgreSQL container defined in `docker-compose.yml`. Do not change this to `localhost` — it will not work inside Docker.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Zyxavy/Ruminarium.git
cd ruminarium
```

### 2. Create the environment file

Create `backend/.env` with the contents shown in the Environment Variables section above.

### 3. Start the containers

From the project root:

```bash
# Without AI assistant
docker compose up --build

# With AI assistant
docker compose --profile ai up --build
```

This builds and starts the following services:

| Service    | Description                        | Local Port |
|------------|------------------------------------|------------|
| `db`       | PostgreSQL database                | `5433`     |
| `backend`  | FastAPI backend                    | `8000`     |
| `frontend` | React frontend served via Nginx    | `80`       |

### 4. Run database migrations

Once the containers are running, open a **new terminal** and run:

```bash
docker exec -it journal_backend sh -c "cd /app && alembic upgrade head"
```

This applies all migrations in order, including:
- Creating the `search_vector` column and GIN index
- Installing the PostgreSQL trigger for automatic FTS updates
- Backfilling search vectors for any existing entries

> **This step is required.** Skipping it means search will not work and the database schema may be incomplete.

### 5. Access the app

| URL | Description |
|-----|-------------|
| http://localhost | Frontend |
| http://localhost:8000/docs | Swagger API docs |
| http://localhost:8000/redoc | ReDoc API docs |

---

## Stopping & Resetting Containers

### Stop containers (keeps your data)

```bash
docker compose down
```

### Stop and delete all data (full reset)

```bash
docker compose down -v
```

> The `-v` flag removes the `postgres_data` volume, wiping the database entirely. Use this if you want a completely clean slate. **You will need to re-run migrations afterwards.**

### Rebuild after code changes

```bash
docker compose up --build
```

---

## Troubleshooting

**Search returns no results for entries that exist**

Existing entries may have been created before the search trigger was in place. Run the migration step from Step 4 above — it includes a backfill that updates all existing entries.

**`alembic upgrade head` fails with "relation does not exist"**

The database container may still be starting up. Wait a few seconds and try again.

**Frontend can't reach the backend**

Make sure the backend container is running (`docker compose ps`) and that you haven't changed the API URL away from `http://localhost:8000/api/v1`.

**Port already in use**

Another process is using port `80`, `8000`, or `5433`. Either stop the conflicting process or change the port mappings in `docker-compose.yml`.

**Changes to backend code aren't reflected**

Run `docker compose up --build` to rebuild the backend image with your latest changes.

---

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React, Vite, TailwindCSS                  |
| Backend    | FastAPI, SQLAlchemy                       |
| Auth       | JWT, Passlib (Argon2)                     |
| Database   | PostgreSQL (with native Full-Text Search) |
| Deployment | Docker, Docker Compose, Nginx             |

---

> This project is for educational purposes and personal use.