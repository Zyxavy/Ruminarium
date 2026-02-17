# Frontend 
Modern single-page React application (built with Vite + TypeScript + Tailwind CSS) for a personal journaling platform.

Users can register, log in, create/read/update/delete journal entries, all protected by JWT authentication.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios (with interceptors for auth & 401 handling)
- **Styling**: Tailwind CSS
- **State Management**: Local component state (no Redux/Zustand/Pinia yet)
- **Authentication**: JWT stored in localStorage
- **Deployment**: Docker + Nginx (static hosting)


### Directory Breakdown

#### `src/api/`
API communication layer – centralized Axios instance + service modules.

| File                | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| `client.ts`         | Axios instance with baseURL, token interceptor, 401 → logout redirect   |
| `auth.ts`           | Auth operations: login, register, get current user (`/auth/*`)         |
| `journal.ts`        | Journal CRUD: list, create, update, delete (`/journal/*`)              |

#### `src/components/`
Reusable UI building blocks.

| Component           | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| `Layout.tsx`        | Authenticated layout: sticky navbar, "New Entry" button, logout         |
| `ProtectedRoute.tsx`| Route guard – redirects to /login if no token in localStorage           |
| `JournalList.tsx`   | Main journal feed: grid of entry previews, loading/error/empty states   |

#### `src/pages/`
Page-level components mapped to routes.

| Page                | Route                | Purpose                                      |
|---------------------|----------------------|----------------------------------------------|
| `Login.tsx`         | `/login`             | Sign-in form (email + password)              |
| `Register.tsx`      | `/register`          | Sign-up form with password confirmation      |
| `JournalEditor.tsx` | `/journals/new` or `/journals/:id` | Create or edit journal entry (title + content) |

#### `src/types/`
Shared TypeScript interfaces used across API, components, and state.

| Type       | Fields / Purpose                                            |
|------------|-------------------------------------------------------------|
| `User`     | `id`, `email`, `is_active`                                  |
| `Token`    | `access_token`, `token_type` (from login response)          |
| `Journal`  | `id`, `title`, `content?`, `owner_id`, `created_at`, `updated_at` |

#### Root files in `src/`

| File          | Purpose                                                                 |
|---------------|-------------------------------------------------------------------------|
| `App.tsx`     | Defines all routes using React Router, wraps in `<Router>`             |
| `main.tsx`    | Entry point – renders `<App />` into `#root`                            |
| `index.css`   | Global styles: font stack, body background, custom scrollbar, h1 size  |

## Features Implemented

- JWT-based authentication (login/register + protected routes)
- Full CRUD for journal entries
- Responsive design (Tailwind CSS)
- Loading, error, and empty states
- Client-side route protection
- Production-ready Docker + Nginx setup

## Running Locally

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev
# → http://localhost:5173 (or the port shown)

# Build for production
npm run build

```

## Docker Deployment

```bash
# Build the image
docker build -t myjournal-frontend .

# Run locally (maps port 80)
docker run -p 8080:80 myjournal-frontend

# Or use with docker-compose (recommended with backend)
docker-compose up --build
```

---

# nginx.conf – Custom Nginx Configuration
This file configures Nginx to:

- Serve the static Vite/React build from /usr/share/nginx/html
- Support single-page application (SPA) routing by returning index.html for all non-asset paths
- Proxy API requests (/api/*) to the backend service 