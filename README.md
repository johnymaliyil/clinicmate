# ClinicMate

A small clinic management app for:

- **Patient registration** — record patient details, contact info, blood group, and allergies.
- **Appointment booking** — schedule appointments with a doctor/department, track status (scheduled, completed, cancelled, no-show).
- **Medicine inventory** — track stock levels, reorder thresholds, expiry dates, and restock/dispense history.

Built with Next.js (App Router, TypeScript), Prisma, and SQLite. No external services required.

## Getting started

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed   # optional: adds sample patients, appointments, and medicines
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — lint the codebase
- `npm run db:seed` — populate the database with sample data
- `npx prisma studio` — browse/edit the SQLite database in a GUI
- `npx prisma migrate dev` — apply schema migrations (SQLite file lives at `prisma/dev.db`)

## Data model

- `Patient` — has many `Appointment`s
- `Appointment` — belongs to a `Patient`; has a status (`SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`)
- `Medicine` — has many `StockMovement`s (`RESTOCK`, `DISPENSE`, `ADJUSTMENT`), tracks current `quantity` against a `reorderLevel`
