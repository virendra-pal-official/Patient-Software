# MediKiosk

**AI-Powered Clinical History Taking for Faster, Structured and Patient-Centered OPD Care**

MediKiosk is a SIH 2026 prototype for structured patient intake, document review, red-flag triage, AYUSH history, and physician verification. It uses synthetic demo data only. It is not a diagnostic, prescription, or emergency system.

## Run on Windows

```powershell
npm install
npm install --prefix backend
npm install --prefix web
copy .env.example .env
npm run dev:backend
# In another terminal
npm run dev:web
```

Web: http://localhost:5173  
API: http://localhost:5000/api/health

## Optional PostgreSQL

```powershell
docker compose up -d
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

The prototype API runs with mock data even when PostgreSQL is not configured. Set `AI_MODE=mock` for deterministic demo behavior.

## Demo accounts

- Doctor: `doctor@demo.com` / `Demo@123`
- Nurse: `nurse@demo.com` / `Demo@123`
- Admin: `admin@demo.com` / `Demo@123`
- Patient: `patient@demo.com` / `Demo@123`

## Demo workflow

Landing page -> Launch Demo -> language and consent -> adaptive case-taking -> red-flag review -> mock OCR -> medical timeline -> AI draft summary -> doctor queue -> physician verification.

## Architecture

- `web/`: React + TypeScript + Vite responsive clinical interface
- `backend/`: Express + TypeScript JWT API with mock-safe services
- `prisma/`: PostgreSQL schema and synthetic seed
- `mobile/`: Expo React Native prototype shell
- `docs/`: architecture, security, API, database, and demo notes

All AI, OCR, speech, ABDM, and FHIR integrations are explicitly mock/prototype paths until provider credentials are configured. Extracted and generated clinical information requires human verification.
