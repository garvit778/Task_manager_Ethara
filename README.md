# ProjectPilot

ProjectPilot is a production-ready full-stack project management SaaS application built with React, TypeScript, Express, Prisma, PostgreSQL, JWT authentication, RBAC, Socket.io, and a premium animated dashboard UI.

It is designed as a recruiter-friendly startup-grade project inspired by Trello, Asana, Jira, and Monday.com.

## Features

- JWT signup/login with bcrypt password hashing
- Admin and Member role-based access control
- Protected React Router routes with persisted sessions
- Project CRUD with priority, deadlines, progress, member invitations, search, and filters
- Task CRUD with assignees, priorities, due dates, comments, activity logs, and Kanban status movement
- Animated dashboard with metrics, charts, recent activity, and team productivity
- Real-time client refresh using Socket.io
- Integrated PySpark analytics snapshots for large-scale reporting workflows
- Team directory, calendar view, profile settings, notifications, and file attachment API
- Helmet, CORS, rate limiting, HPP, XSS cleaning, validation middleware, and centralized error handling
- Prisma relational schema with users, teams, projects, tasks, comments, activity logs, notifications, and attachments
- Seed script with demo users, project, tasks, activity, and comments
- Vercel and Railway deployment configuration
- Postman collection: `ProjectPilot.postman_collection.json`
- AWS deployment guide: `docs/AWS_DEPLOYMENT.md`

## Screenshots

Add screenshots after running locally:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/projects-kanban.png`
- `docs/screenshots/mobile.png`

## Tech Stack

Frontend:

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- ShadCN-style reusable UI primitives
- React Router
- Axios
- Zustand
- React Hook Form + Zod
- Recharts
- Socket.io Client

Backend:

- Node.js + Express.js + TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- REST APIs
- RBAC middleware
- Socket.io

Deployment:

- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL

## Folder Structure

```txt
root/
  client/
    src/
      components/
      hooks/
      layout/
      lib/
      pages/
      store/
      styles/
  server/
    prisma/
      migrations/
      schema.prisma
      seed.ts
    src/
      config/
      middleware/
      modules/
      sockets/
      utils/
  ProjectPilot.postman_collection.json
  README.md
```

## Getting Started

Prerequisites:

- Node.js 20+
- PostgreSQL 15+
- npm 10+

Install dependencies:

```bash
npm install
```

Configure environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/projectpilot?schema=public
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Run database migrations and seed data:

```bash
npm run prisma:dev --workspace server
npm run seed --workspace server
```

Start both apps:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

Demo accounts:

```txt
admin@projectpilot.dev / Password123!
member@projectpilot.dev / Password123!
designer@projectpilot.dev / Password123!
```

## Environment Variables

Server:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/projectpilot?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=250
INVITATION_FROM_EMAIL=no-reply@projectpilot.dev
```

Client:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## API Documentation

Import `ProjectPilot.postman_collection.json` into Postman.

Core endpoints:

```txt
GET    /api/health
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
GET    /api/dashboard
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/invite
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
POST   /api/tasks/:id/comments
GET    /api/users
PATCH  /api/users/me
GET    /api/notifications
PATCH  /api/notifications/:id/read
POST   /api/attachments
```

Use:

```txt
Authorization: Bearer <token>
```

## Deployment Guide

1. Push the monorepo to GitHub.
2. Create a Railway PostgreSQL database and copy the connection string.
3. Create a Railway service for `server/`.
4. Add backend env vars in Railway:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
   - `NODE_ENV=production`
5. Railway uses `server/railway.json` and runs:
   - `npm run prisma:migrate`
   - `npm run start`
6. Deploy `client/` to Vercel.
7. Add Vercel env vars:
   - `VITE_API_URL=https://your-railway-api.up.railway.app/api`
   - `VITE_SOCKET_URL=https://your-railway-api.up.railway.app`
8. Update Railway `CLIENT_URL` to the deployed Vercel URL.
9. Run the server seed script once from Railway shell if demo data is wanted:

```bash
npm run seed
```

10. Test auth, project creation, Kanban task movement, dashboard charts, and Socket.io refresh.

## Production Notes

- Replace `JWT_SECRET` with a long random value before deployment.
- Configure persistent object storage before using uploaded files heavily in production.
- Add transactional email provider credentials to turn invitation notifications into real emails.
- Add CI for lint, build, Prisma validation, and API smoke tests before accepting external contributions.
