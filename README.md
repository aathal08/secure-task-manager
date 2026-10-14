# SecureTask Manager

A full-stack task manager built with React, Vite, Node.js, Express and MongoDB. Users can register, sign in and manage their own tasks through a REST API.

## Features

- User registration and login with bcrypt password hashing
- JWT authentication with token expiry
- User-scoped task CRUD operations to prevent cross-account task access
- Authentication rate limiting
- Validation for task titles, descriptions, statuses and due dates
- Helmet security headers, bounded JSON request bodies and configurable CORS origins
- Environment configuration checks before the API starts
- Jest tests for authentication middleware and validation helpers
- GitHub Actions workflow for backend tests

## Project structure

```text
secure-task-manager/
├── .github/workflows/test.yml
├── server/                 # Express API and MongoDB models
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── utils/
└── client/                 # React + Vite frontend
    └── src/
```

## Requirements

- Node.js 20 or newer recommended
- MongoDB database (local or MongoDB Atlas)

## Run locally

### 1. Configure the backend

```bash
cd server
npm install
cp .env.example .env
```

Set `MONGO_URI` to your database connection string. Generate a strong JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put the generated value in `JWT_SECRET`. Keep `.env` private; never commit secrets. Set `CLIENT_ORIGIN` to the exact frontend origin. Multiple origins can be separated by commas.

Start the API:

```bash
npm run dev
```

The API health endpoint is `http://localhost:5000/api/health`.

### 2. Configure the frontend

In another terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register an account |
| POST | `/api/auth/login` | No | Sign in |
| GET | `/api/auth/me` | Yes | Current account |
| GET | `/api/tasks` | Yes | List your tasks |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

Authenticated requests currently send `Authorization: Bearer <token>`.

## Tests

```bash
cd server
npm install
npm test
```

The test suite covers token verification and input validation. The GitHub Actions workflow runs the backend tests on pushes and pull requests.

## Security notes

- Passwords are hashed with bcrypt and excluded from normal user queries.
- JWTs are signed using an environment-provided secret and have an expiry.
- Every task lookup, update and deletion is scoped to the authenticated user.
- Task fields are validated before writes; unknown fields such as a client-supplied `user` are rejected.
- Helmet sets common HTTP security headers, JSON request bodies are size-limited, and CORS origins are configurable.
- Use HTTPS in production and set `CLIENT_ORIGIN` to your exact deployed frontend origin. Wildcard origins are rejected in production.
- The current frontend stores bearer tokens in `localStorage`; an XSS flaw could expose them. For a higher-security production deployment, consider migrating to `HttpOnly`, `Secure`, `SameSite` cookies with appropriate CSRF protections.
- This project has not undergone an independent penetration test. Passing unit tests does not establish that an application is vulnerability-free.

## Author

Athar Ali — B.Tech Computer Science & Engineering (Cyber Security), Parul University
