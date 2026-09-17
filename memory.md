# Skill Bridge (Pulse Community Platform) — Memory Bank

> **Project Identity:** Full-Stack Social Community Platform — Posts, Voting & JWT Auth  
> **App Name:** Pulse Community Platform  
> **Active Workspace:** `/Users/kunalsuryanshi/Documents/Projectsnew/Fastapi`  
> **Last Updated:** 2026-09-12  
> **Status:** 🟢 Active Development

---

## 1. Project Overview & North Star

**Pulse Community Platform** is a Reddit/Hacker-News-style community platform where users can:
- Register & authenticate with JWT tokens
- Create, read, update, and delete posts
- Upvote / remove votes on any post (one vote per user per post)
- Browse a paginated feed with keyword search

**Backend**: FastAPI REST API  
**Frontend**: Next.js 14 App Router with React Query (TanStack)

---

## 2. Tech Stack

### Backend (`app/`)
| Layer | Technology | Version |
|:---|:---|:---|
| Framework | FastAPI | 0.128.8 |
| ASGI Server | Uvicorn | 0.39.0 |
| ORM | SQLAlchemy | 2.0.51 |
| Database | PostgreSQL | — |
| Migrations | Alembic | 1.16.5 |
| Validation | Pydantic v2 | 2.13.4 |
| Auth | python-jose (JWT) + passlib (bcrypt) | — |
| Settings | pydantic-settings | 2.11.0 |

### Frontend (`src/`)
| Layer | Technology | Version |
|:---|:---|:---|
| Framework | Next.js 14 (App Router) | 14.2.15 |
| Language | TypeScript | 5.6.3 |
| Styling | Tailwind CSS | 3.4.13 |
| Data Fetching | TanStack React Query | 5.59.0 |
| HTTP | Axios | 1.7.7 |
| Icons | Lucide React | 0.453.0 |
| Auth | jwt-decode | 4.0.0 |
| Markdown | react-markdown + remark-gfm | — |

---

## 3. Directory Structure

\`\`\`
Fastapi/                          # Project root (Skill Bridge / Pulse)
├── memory.md                     # ← This file — project state & memory
├── rules.md                      # ← Vibe coding rules & guidelines
├── GEMINI.md                     # ← Antigravity / AI assistant context
├── .cursorrules                  # ← Cursor IDE agent config
├── app/                          # FastAPI backend
│   ├── main.py                   # App entrypoint, CORS, router registration
│   ├── config.py                 # Pydantic settings (env vars)
│   ├── database.py               # SQLAlchemy engine & session
│   ├── models.py                 # DB models: Post, User, Vote
│   ├── schemas.py                # Pydantic schemas (request/response)
│   ├── auth.py                   # /login route (OAuth2 form)
│   ├── auth2.py                  # JWT creation, decoding, get_current_user
│   ├── utils.py                  # Password hashing (bcrypt)
│   └── routers/
│       ├── post.py               # CRUD for /posts
│       ├── users.py              # /user registration & lookup
│       └── vote.py               # /vote upvote/remove
├── alembic/                      # DB migration scripts
├── alembic.ini                   # Alembic config
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables (never commit)
├── .env.example                  # Safe template to share
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Home / feed page
│   │   ├── providers.tsx         # React Query provider
│   │   ├── feed/                 # Feed route
│   │   └── posts/                # Post detail route
│   └── components/               # React components
│       ├── auth/                 # Login/Register forms
│       ├── feed/                 # Post feed components
│       ├── post/                 # Single post components
│       ├── shell/                # Layout shell (navbar, sidebar)
│       └── ui/                   # Shared UI primitives
├── postman/                      # Postman collection for API testing
├── package.json                  # Frontend dependencies
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
\`\`\`

---

## 4. Database Schema

### \`Users\` table
| Column | Type | Notes |
|:---|:---|:---|
| \`id\` | Integer PK | Auto-increment |
| \`email\` | String (unique) | Used as username |
| \`password\` | String | bcrypt hashed |
| \`created_at\` | TIMESTAMP | \`now()\` default |

### \`posts\` table
| Column | Type | Notes |
|:---|:---|:---|
| \`id\` | Integer PK | Auto-increment |
| \`title\` | String | Required |
| \`content\` | String | Required |
| \`published\` | Boolean | Default TRUE |
| \`created_at\` | TIMESTAMP | \`now()\` default |
| \`user_id\` | FK → Users.id | CASCADE delete |

### \`votes\` table
| Column | Type | Notes |
|:---|:---|:---|
| \`user_id\` | FK → Users.id | Composite PK |
| \`post_id\` | FK → posts.id | Composite PK |

---

## 5. API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | \`/login\` | Returns JWT access token | ❌ |

### Users
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | \`/user/\` | Register new user | ❌ |
| GET | \`/user/{id}\` | Get user by ID | ❌ |

### Posts
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| GET | \`/posts/\` | List posts (limit, skip, search) | ❌ |
| GET | \`/posts/{id}\` | Get single post + vote count | ✅ |
| POST | \`/posts/\` | Create post | ✅ |
| PUT | \`/posts/{id}\` | Update post (owner only) | ✅ |
| DELETE | \`/posts/{id}\` | Delete post (owner only) | ✅ |

### Votes
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | \`/vote/\` | dir=1 to upvote, dir=0 to remove | ✅ |

---

## 6. Environment Variables (`.env`)

\`\`\`env
DATABASE_HOSTNAME=localhost
DATABASE_PORT=5432
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=fastapi
DATABASE_USERNAME=postgres
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
\`\`\`

---

## 7. Dev Server Commands

\`\`\`bash
# Backend (from project root)
source .venv/bin/activate
uvicorn app.main:app --reload
# → http://127.0.0.1:8000
# → Swagger: http://127.0.0.1:8000/docs

# Frontend (from project root)
npm run dev
# → http://localhost:3000

# DB Migrations
alembic upgrade head                                    # apply all pending
alembic revision --autogenerate -m "description"        # create new migration
\`\`\`

---

## 8. Architecture Decisions

1. **Ownership enforcement**: PUT/DELETE on posts returns HTTP 403 if \`current_user.id != post.user_id\`.
2. **Vote uniqueness**: Composite PK on \`(user_id, post_id)\` — upvoting twice raises \`409 Conflict\`.
3. **JWT stateless auth**: Tokens expire after \`ACCESS_TOKEN_EXPIRE_MINUTES\`; no server-side session.
4. **Alembic for migrations**: Schema changes must go through migration files, never \`create_all()\` in production.
5. **CORS**: Origins \`http://localhost:3000\` and \`http://localhost:8000\` are whitelisted for dev.
6. **Pydantic v2**: Use \`model_config = ConfigDict(from_attributes=True)\` — not deprecated \`class Config\`.

---

## 9. Progress Tracker

- [x] **Backend Foundation** — FastAPI app, CORS, router registration
- [x] **Database Models** — Post, User, Vote (SQLAlchemy)
- [x] **Pydantic Schemas** — Request/response validation
- [x] **Auth System** — JWT login, password hashing, \`get_current_user\` dependency
- [x] **Post CRUD** — All 5 endpoints with ownership protection
- [x] **Vote System** — Upvote / remove with composite PK uniqueness
- [x] **Alembic Migrations** — Schema version control
- [x] **Frontend Scaffold** — Next.js 14, Tailwind, React Query
- [ ] **Frontend Auth Flow** — Login/Register forms wired to backend
- [ ] **Frontend Feed** — Post listing with search and pagination
- [ ] **Frontend Post Detail** — Single post with vote button
- [ ] **Frontend Create/Edit Post** — Authenticated post creation form
- [ ] **Tests** — Pytest unit tests for routes and services
- [ ] **Deployment** — Docker / Railway / Render setup

---

## 10. Known Issues & TODOs

- \`class Config\` in \`schemas.py\` should migrate to \`model_config = ConfigDict(from_attributes=True)\` for Pydantic v2.
- CORS \`origins\` list is hardcoded in \`main.py\` — should move to \`config.py\`.
- No rate limiting on \`/login\` — brute-force attack surface; add \`slowapi\` or similar.
- Frontend \`providers.tsx\` should wrap with React Query DevTools in dev mode.
- \`.env\` is in \`.gitignore\` ✅ — never commit secrets.
