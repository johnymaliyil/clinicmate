# ClinicMate

A small clinic management app for:

- **Patient registration** — record patient details, contact info, blood group, and allergies.
- **Appointment booking** — schedule appointments with a doctor/department, track status (scheduled, completed, cancelled, no-show).
- **Medicine inventory** — track stock levels, reorder thresholds, expiry dates, and restock/dispense history.

Built with Next.js (App Router, TypeScript), Prisma, and SQLite. No external services required for local development. Works as a normal responsive website on mobile and desktop browsers, and is installable as a PWA (add-to-home-screen icon, offline fallback screen).

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

## Deploying to production

Local dev uses SQLite (a file on disk) — that's fine on a laptop, but **do not deploy as-is to a serverless host** (Vercel, Netlify, etc.): their filesystems are ephemeral, so the database would silently reset on every deploy or cold start. Before deploying, switch to a real hosted database. Two options:

### Option A — Hosted Postgres (recommended, works with any host including serverless)

1. Create a free Postgres database — [Supabase](https://supabase.com) or [Neon](https://neon.tech) both have generous free tiers. Copy the connection string they give you (a `postgresql://...` URL).
2. Edit `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` in `.env` (locally) and in your host's environment variables (in production) to the connection string from step 1.
4. Regenerate migrations against Postgres and apply them:
   ```bash
   rm -rf prisma/migrations
   npx prisma migrate dev --name init
   npm run db:seed   # optional
   ```
5. Deploy the Next.js app to any Node-capable host — Vercel, Railway, Render, Fly.io, or your own server (`npm run build && npm run start`). Point your domain's DNS at whichever host you pick once you've bought it.

### Option B — Keep SQLite, self-host on a server with a persistent disk

Only viable if you're deploying to something with a real, persistent filesystem (a VPS, or a platform that gives you an attached volume, e.g. Fly.io volumes or a Docker host with a bind mount for `prisma/dev.db`). Not compatible with typical serverless platforms.

No code changes needed for Option B beyond making sure `prisma/dev.db` lives on that persistent volume and `npx prisma migrate deploy` is run once on first boot.
