# Backend Directory

### Directories

## app/ - Main Application Package
The root package containing all backend code for the **FastAPI** application.

### app/api/ - API Layer
Handles HTTP requests, routing, and request/response validation.

#### api/v1/ - API Version 1

| File       | Purpose                     | Key Endpoints                              |
|------------|-----------------------------|--------------------------------------------|
| `auth.py`  | Authentication endpoints    | `POST /register`<br>`POST /login`<br>`GET /me` |
| `journals.py` | Journal CRUD operations  | `POST /`<br>`GET /`<br>`GET /{id}`<br>`PATCH /{id}`<br>`DELETE /{id}` |

#### api/deps.py - Dependencies

| Function              | Purpose                                           |
|-----------------------|---------------------------------------------------|
| `get_current_user()`  | Extracts & validates JWT, returns authenticated user |

### app/core/ - Core Business Logic

| File           | Components                          | Purpose                              |
|----------------|-------------------------------------|--------------------------------------|
| `security.py`  | `SECRET_KEY`, `ALGORITHM`, `pwd_context` | JWT config & password hashing     |
|                | `get_password_hash()`               | Hashes plain text passwords          |
|                | `verify_password()`                 | Verifies password against hash       |
|                | `create_access_token()`             | Generates JWT tokens                 |

### app/crud/ - Database Operations

| File                  | Functions             | Purpose                          |
|-----------------------|-----------------------|----------------------------------|
| `journal_services.py` | `create_journal()`    | Create new journal entry         |
|                       | `get_journals()`      | List user's journals (paginated) |
|                       | `get_journal()`       | Get single journal by ID         |
|                       | `update_journal()`    | Update existing journal          |
|                       | `delete_journal()`    | Delete journal                   |

### app/db/ - Database Configuration

| File            | Component              | Purpose                              |
|-----------------|------------------------|--------------------------------------|
| `database.py`   | `engine`               | SQLAlchemy connection pool           |
|                 | `SessionLocal`         | Database session factory             |
|                 | `Base`                 | Declarative base for all models      |
|                 | `get_db()`             | Dependency for database sessions     |
|                 | `test_db_connection()` | Health check utility                 |

### app/models/ - Database Models (SQLAlchemy)

| File         | Model   | Key Fields                              |
|--------------|---------|-----------------------------------------|
| `user.py`    | `User`  | `id`, `email`, `password_hash`, `created_at` |
| `journal.py` | `Journal` | `id`, `title`, `content`, `owner_id`, `created_at`, `updated_at` |

**Relationships**: One-to-many (User -> Journals)

### app/schemas/ - Pydantic Models (Validation & Serialization)

| File        | Schemas                        | Purpose                            |
|-------------|--------------------------------|------------------------------------|
| `user.py`   | `UserCreate`, `UserRead`       | Registration data & response       |
| `journal.py`| `JournalCreate`, `JournalUpdate`, `JournalRead` | Journal validation & response |
| `token.py`  | `Token`, `TokenData`           | JWT response & internal token data |

### app/main.py - Application Entry Point

**Responsibilities:**

- Creates FastAPI application instance
- Configures CORS middleware
- Registers all API routers (`/api/v1/auth`, `/api/v1/journal`)
- Initializes database tables
- Provides health check endpoint (`GET /health`)

##  Request Lifecycle
1. HTTP Request -> main.py (CORS middleware)
2. -> API Router (auth.py or journals.py)
3. -> Dependencies (get_current_user for protected routes)
4. -> CRUD Operations (journal_services.py)
5. -> Database Models (SQLAlchemy)
6. <- Pydantic Schema validation
7. <- JSON Response


## Authentication Flow

| Step             | Description                                          |
|------------------|------------------------------------------------------|
| **Register**     | Password hashed with Argon2 → User stored in DB      |
| **Login**        | Password verified → JWT token generated              |
| **Protected Routes** | Token extracted from header → Decoded & validated → User fetched from DB |

##  Setup & Configuration

### Environment Variables (`.env`)

```env
DATABASE_URL=postgresql://user:password@db:5432/journal_db
SECRET_KEY=your-secret-key-here
```

---

## Key Dependencies
Inside `pyproject.toml`.


## Running the Backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

#or
docker-compose up --build backend
```
---

## API Documentation
Once running, access:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

