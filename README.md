# ⚽ Office World Cup Predictor 2026

A self-hostable web app where colleagues register, predict the score of every
2026 FIFA World Cup group-stage match, and compete on a live leaderboard.

Built with **Next.js 14** (App Router) + **Prisma** + **PostgreSQL**. Designed to
deploy free on **Vercel** with a free **Neon** Postgres database.

## Sections / features

- **Register** — name, email, password, plus an optional shared registration code so only colleagues can join.
- **Log in / log out** — secure sessions (httpOnly cookie, passwords hashed with bcrypt).
- **Games** — all 72 group-stage fixtures (real 2026 draw), grouped by day, with kickoff times. Enter/update your predicted scoreline; **predictions lock automatically at kickoff**.
- **Rules** — standalone page explaining scoring and deadlines.
- **Leaderboard** — every player ranked by total points (then by exact-score hits).
- **Admin** — organiser-only page to enter final scores; everyone's points recalculate automatically.

## Scoring

| Outcome | Points |
|---|---|
| Exact score correct | **3** |
| Correct result (win/draw/loss), wrong score | **1** |
| Wrong result | **0** |

---

## Deploy in ~20 minutes (free)

### 1. Create a free Postgres database (Neon)
1. Go to https://neon.tech and sign up.
2. Create a project → copy the **connection string** (looks like `postgresql://user:pass@host/db?sslmode=require`).

### 2. Push the code to GitHub
```bash
cd worldcup-predictor
git init && git add . && git commit -m "World Cup Predictor"
# create a repo on github.com, then:
git remote add origin https://github.com/<you>/worldcup-predictor.git
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to https://vercel.com → **Add New Project** → import your GitHub repo.
2. Add these **Environment Variables** (Settings → Environment Variables):

| Name | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (host contains `-pooler`) |
| `DIRECT_URL` | Neon **direct** connection string (same string without `-pooler`) |
| `AUTH_SECRET` | a long random string (e.g. run `openssl rand -base64 32`) |
| `ADMIN_NAME` | e.g. `Radman` |
| `ADMIN_EMAIL` | your email — this account becomes the organiser/admin |
| `ADMIN_PASSWORD` | a password for the admin login |
| `REGISTRATION_CODE` | a code you share with colleagues (e.g. `GOALS2026`); leave blank for open signup |

3. Click **Deploy**.

### 4. Create the tables and seed the fixtures
After the first deploy, run these **once** from your own machine (with the same `DATABASE_URL` in a local `.env`):
```bash
npm install
npx prisma db push      # creates the tables
npm run db:seed         # loads all 72 fixtures + creates the admin user
```
> Tip: copy `.env.example` to `.env` and fill in the values first.

That's it — share your Vercel URL and the registration code with the office.

---

## Run locally (optional)
```bash
cp .env.example .env     # fill in DATABASE_URL + AUTH_SECRET + admin vars
npm install
npx prisma db push
npm run db:seed
npm run dev              # http://localhost:3000
```

## Running the game
- Colleagues visit the URL, **Register** with the code, then predict on the **Games** page.
- Predictions for a match lock the moment it kicks off.
- After each match, the **admin** logs in, opens **Admin**, enters the final score, and saves — points and the leaderboard update instantly.
- To correct a result, just re-save it (or **Clear** it) on the Admin page; points recalculate.

## Notes
- Kickoff times are stored with a timezone offset and displayed in **US Eastern** (the host time zone).
- All 12 groups (A–L), 48 teams, 72 matches are pre-loaded from the official December 2025 draw.
- To add the knockout rounds later, append fixtures to `prisma/fixtures.mjs` and re-run `npm run db:seed` (it skips fixtures already present).

## Tech / project map
```
prisma/schema.prisma     # User, Match, Prediction models
prisma/fixtures.mjs      # all 72 group-stage fixtures
prisma/seed.mjs          # seeds matches + admin user
lib/auth.js              # JWT session cookies (jose)
lib/scoring.js           # 3 / 1 / 0 scoring
lib/db.js                # Prisma client singleton
app/                     # pages: /, /login, /register, /games, /rules, /leaderboard, /admin
app/api/                 # register, login, logout, predictions, admin/results
```
