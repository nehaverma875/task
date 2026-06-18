# Operations Admin Dashboard

Admin dashboard built from the assessment brief with Next.js, TypeScript, TanStack Query, Zustand, ShadCN UI, responsive layouts, JWT auth, and MongoDB-backed API routes.

## Stack

- Next.js App Router
- TypeScript
- TanStack Query for server-state fetching and cache invalidation
- Zustand for client UI/session state
- Zukeeper for Zustand devtools inspection
- ShadCN UI local components in `components/ui`
- MongoDB Node.js driver for backend storage

## Features

- User registration with name, email, password, and role
- User login with email and password
- MongoDB `users` collection with hashed passwords
- Dashboard metrics: total clients, total projects, active projects, revenue, and leads
- Projects: listing, search, pagination, status filters, and detail view
- Leads: new, assigned, and converted lead columns
- Creator management: create, edit, activate, and deactivate

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `MONGODB_URI` in `.env.local`. A local MongoDB example:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/ops-admin-dashboard
MONGODB_DB=ops-admin-dashboard
JWT_SECRET=replace-with-a-long-random-secret
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`, then click `Seed MongoDB` on the dashboard to insert sample records if the collections are empty.

## Mock Users

The seed endpoint creates these users when the `users` collection is empty:

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `superadmin@example.com` | `Password@123` |
| Admin | `admin@example.com` | `Password@123` |
| Agent | `agent@example.com` | `Password@123` |

## Auth Flow

- `POST /api/auth/login` verifies email/password and returns `{ user, token }`.
- `POST /api/auth/register` creates a MongoDB user, hashes the password, and returns `{ user, token }`.
- The frontend stores the JWT in `localStorage` as `ops-admin-token`.
- API calls send `Authorization: Bearer <token>`.
- Protected APIs return `401` when the token is missing, invalid, or expired.
- `GET /api/auth/me` returns the current user from the token.
- `POST /api/auth/logout` confirms logout; the frontend clears localStorage.

## Evaluation Criteria

- Component Architecture: pages, layout shell, auth forms, UI primitives, API helpers, and domain logic are split into focused modules.
- State Management: TanStack Query handles server state; Zustand handles auth and sidebar UI state.
- UI Quality: ShadCN UI components, responsive layout, dashboard cards, tables, filters, and forms.
- Performance: paginated project API, cached queries, server-side MongoDB filtering/search, and lean JSON responses.
- Scalability: route handlers are organized by domain, MongoDB access is centralized, and auth helpers are reusable.
- Code Quality: TypeScript types, reusable utilities, hashed passwords, JWT-protected APIs, lint/typecheck/build verification.
