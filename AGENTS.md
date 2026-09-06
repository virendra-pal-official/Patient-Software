# MediKiosk Agent Guide

## Project shape

- `backend/` is the Express + TypeScript API. `backend/src/server.ts` owns routes, auth, validation, uploads, demo state, and error handling.
- `web/` is the React + TypeScript + Vite client. `web/src/App.tsx` composes the main workflows; `web/src/services/api.ts` is the typed API wrapper.
- `mobile/` is an Expo Router prototype. `mobile/app/index.tsx` is its primary screen.
- `prisma/` contains the intended PostgreSQL schema and synthetic seed. The demo API currently uses in-memory records instead of Prisma.
- `docs/` contains the detailed [architecture](docs/architecture.md), [API](docs/api.md), [database](docs/database.md), [demo](docs/demo.md), and [security](docs/security.md) notes.

## Common commands

Install dependencies separately because the root install does not install child packages:

```powershell
npm install
npm install --prefix backend
npm install --prefix web
```

Run the web and API in separate terminals:

```powershell
npm run dev:backend
npm run dev:web
```

Useful checks:

```powershell
npm run build:backend
npm run build:web
npm --prefix backend test
npm --prefix web run lint
```

For database work, start PostgreSQL with `docker compose up -d`, then use `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed`. Copy `.env.example` to `.env`; local demo work should use `AI_MODE=mock`.

## Working conventions

- Backend TypeScript is strict, uses NodeNext/ESM imports with `.js` extensions, and validates API inputs with Zod where applicable.
- Protected API requests use `Authorization: Bearer <JWT>`; preserve role checks and upload restrictions.
- Keep mock/provider behavior deterministic in demo mode. Provider seams live under `backend/src/services/`.
- Use synthetic data only and never log patient medical information.
- AI summaries, OCR extraction, and other clinical outputs are drafts that require physician or qualified-practitioner verification. This is not a diagnostic, prescription, or emergency system.
- Keep web changes consistent with the existing React functional-component, `react-router-dom`, `lucide-react`, and CSS conventions.
- Add or update focused tests for backend business rules; `backend/src/services/redFlagService.test.ts` is the reference pattern.

## Ports and defaults

- Backend: `http://localhost:5000`, API base `http://localhost:5000/api`
- Web: `http://localhost:5173`
- Override the web API base with `VITE_API_URL`.
- Demo records are lost when the backend restarts unless a database-backed workflow is explicitly being used.