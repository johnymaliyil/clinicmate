# ClinicMate

A small clinic management app for:

- **Patient registration** — record patient details, contact info, blood group, and allergies.
- **Appointment booking** — schedule appointments with a doctor/department, track status (scheduled, completed, cancelled, no-show).
- **Medicine inventory** — track stock levels, reorder thresholds, expiry dates, and restock/dispense history.

Built with Next.js (App Router, TypeScript), Prisma, and Postgres (Supabase). Works as a normal responsive website on mobile and desktop browsers, and is installable as a PWA (add-to-home-screen icon, offline fallback screen).

## Getting started

1. Create a Postgres database — [Supabase](https://supabase.com) has a generous free tier. In your project, grab two connection strings: the **pooled** one (port 6543, used at runtime) and the **direct** one (port 5432, used only for migrations). Supabase's "Connect" panel shows both, or use the Prisma-specific snippet under "ORM".
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) with those values.
3. Install dependencies and apply the schema:
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run db:seed   # optional: adds sample patients, appointments, and medicines
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — runs pending migrations (`prisma migrate deploy`) then builds for production
- `npm run start` — start the production server
- `npm run lint` — lint the codebase
- `npm run db:seed` — populate the database with sample data
- `npx prisma studio` — browse/edit the database in a GUI
- `npx prisma migrate dev --name <description>` — create and apply a new migration after changing `prisma/schema.prisma`

## Data model

- `Patient` — has many `Appointment`s
- `Appointment` — belongs to a `Patient`; has a status (`SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`)
- `Medicine` — has many `StockMovement`s (`RESTOCK`, `DISPENSE`, `ADJUSTMENT`), tracks current `quantity` against a `reorderLevel`

## Deploying

The app is ready to deploy to any Node-capable host (Vercel, Railway, Render, Fly.io, your own server) once the database from "Getting started" above exists:

1. Connect this GitHub repo to your host (e.g. in Vercel: Project → Settings → Git → connect `johnymaliyil/clinicmate`).
2. Set the `DATABASE_URL` and `DIRECT_URL` environment variables on the host to the same Supabase connection strings used locally. If Supabase was provisioned through a native Vercel integration, these may already be injected automatically under different names (e.g. `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`) — rename or re-map them to `DATABASE_URL` / `DIRECT_URL` to match `prisma/schema.prisma`.
3. Deploy. `npm run build` runs `prisma migrate deploy` automatically before building, so the production database schema stays in sync on every deploy.
4. Point your domain's DNS at the host once you've bought it.
