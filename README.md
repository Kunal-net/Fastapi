# FastAPI Posts & Voting REST API

A robust, production-ready RESTful API built with **FastAPI**, **SQLAlchemy**, **PostgreSQL**, and **Alembic**. This application implements user authentication (JWT), complete CRUD operations for posts with ownership protection, a voting (upvote/like) system, and database migration management.

---

## 🚀 Features

- **User Management & Authentication**:
  - Secure registration with password hashing using `passlib` (bcrypt).
  - OAuth2 Password Flow with JWT (JSON Web Tokens) for stateless authentication.
- **Post Management**:
  - Full CRUD operations: Create, Read, Update, Delete.
  - Ownership validation (users can only edit or delete their own posts).
  - Pagination (`limit` and `skip`) and keyword search filtering (`search`).
  - Total vote count aggregated dynamically on post retrieval.
- **Voting System**:
  - Upvote or remove a vote on any post (one vote per user per post enforced by composite primary keys).
- **Database Migrations**:
  - Database schema tracked and versioned using **Alembic**.
- **Interactive Documentation**:
  - Auto-generated Swagger UI (`/docs`) and ReDoc (`/redoc`).
- **Postman Collection**:
  - Pre-configured requests included under `postman/`.

---

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Data Validation & Settings**: [Pydantic v2](https://docs.pydantic.dev/) & [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **Security & Tokens**: [python-jose](https://github.com/mpdavis/python-jose) & [passlib](https://passlib.readthedocs.io/)

---

## 📁 Project Structure

```text
├── alembic/              # Database migration scripts
│   ├── versions/         # Migration revisions
│   └── env.py            # Alembic environment configuration
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application entry point & CORS configuration
│   ├── config.py         # Environment variables & Pydantic settings
│   ├── database.py       # SQLAlchemy engine & session setup
│   ├── models.py         # SQLAlchemy database models
│   ├── schemas.py        # Pydantic validation schemas
│   ├── utils.py          # Password hashing utilities
│   ├── auth.py           # Login and token generation route
│   ├── auth2.py          # JWT creation, decoding, and dependency injection
│   └── routers/
│       ├── post.py       # Post CRUD routes
│       ├── users.py      # User registration & lookup routes
│       └── vote.py       # Voting routes
├── postman/              # Postman collection files for API testing
├── alembic.ini           # Alembic settings
├── requirements.txt      # Project dependencies
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **PostgreSQL** running locally or on a remote server

### 2. Clone the Repository
```bash
git clone https://github.com/Kunal-net/Fastapi.git
cd Fastapi
```

### 3. Create and Activate a Virtual Environment
```bash
# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows (Command Prompt)
# .venv\Scripts\activate.bat

# Windows (PowerShell)
# .venv\Scripts\Activate.ps1
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
touch .env
```

Add your configuration (adjust values to match your PostgreSQL setup):
```env
DATABASE_HOSTNAME=localhost
DATABASE_PORT=5432
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=fastapi
DATABASE_USERNAME=postgres
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> **Tip**: You can generate a secure random secret key with:
> ```bash
> openssl rand -hex 32
> ```

### 6. Run Database Migrations
Apply all schema migrations to your PostgreSQL database:
```bash
alembic upgrade head
```

### 7. Start the Development Server
```bash
uvicorn app.main:app --reload
```

The API will now be running at: **`http://127.0.0.1:8000`**

---

## 📖 API Documentation

Once the server is running, you can explore and test the endpoints directly from your browser:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Log in with form-data (`username`, `password`) to receive a JWT access token | No |

### 👤 Users
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/` | Register a new user | No |
| `GET` | `/user/{id}` | Retrieve user details by ID | No |

### 📝 Posts
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts/` | Get all posts (supports `limit`, `skip`, and `search` query params) | No |
| `GET` | `/posts/{id}` | Get a specific post by ID with vote count | Yes |
| `POST` | `/posts/` | Create a new post | Yes |
| `PUT` | `/posts/{id}` | Update an existing post (Owner only) | Yes |
| `DELETE` | `/posts/{id}` | Delete a post (Owner only) | Yes |

### 🗳️ Votes
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/vote/` | Vote on a post (`dir: 1` to upvote, `dir: 0` to remove vote) | Yes |

---

## 🧪 Testing with Postman
You can import the collection located in the `postman/` folder directly into Postman to test all endpoints.
