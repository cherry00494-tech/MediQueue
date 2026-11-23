# MediQueue

MediQueue coordinates hospital appointments and patient queues. The pilot interface and the initial Express API/Prisma foundation are being built for a single fictional hospital before any multi-hospital rollout.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- PostgreSQL 15+ for database-backed API readiness and migrations

## Run the frontend

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Vite URL (normally `http://localhost:5173`).

## Configure and run the API

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a local PostgreSQL database URL. Never commit `.env`.
3. Generate the Prisma client and apply migrations:

```powershell
npm.cmd run db:generate
npm.cmd run db:migrate
```

4. Start the API in a separate terminal:

```powershell
npm.cmd run dev:api
```

The API listens on port `4000` by default.

## Initial API endpoints

- `GET /api/v1/health/live` — process liveness; does not depend on PostgreSQL.
- `GET /api/v1/health/ready` — returns ready only if PostgreSQL responds; returns `503` otherwise.

All API responses use generic error messages; credentials and request bodies are not logged. Rate limiting is currently in-memory and must be replaced with a shared store before horizontally scaling API instances.

## Verify

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

## Current limitations

- There are no authentication or patient/appointment/queue CRUD endpoints yet.
- The frontend still uses fictional pilot fixtures. Queue changes are browser-memory only and reset on refresh; ticket allocation is not safe for concurrent use there.
- Department, staff, patient, analytics, and settings screens are read-only interface previews.
- The initial migration has been generated but not applied to a live PostgreSQL server in this environment.
- Do not enter real patient data or use this build for clinical operations.
