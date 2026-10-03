# McMaster Cyber Society website

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4. **No backend, no database, no secrets.**
Everything is static and deploys to Vercel as-is.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test           # vitest (use `npm run test:coverage` for coverage)
npm run build
```

Requires Node 20.19+ (Node 22 recommended).

## How content works (no CMS needed)

All club content is plain TypeScript in `src/data/`. To change the site, edit a file and open a PR.

| To change... | Edit |
| --- | --- |
| Add or edit an event (homepage hero picks the soonest upcoming one automatically) | `src/data/events.ts` |
| CTF results / hall of fame | `src/data/ctf.ts` |
| Past workshops, slides, recordings | `src/data/workshops.ts` |
| Project showcase | `src/data/projects.ts` |
| Exec team | `src/data/team.ts` |
| Start Here roadmap links | `src/data/resources.ts` |
| Sponsors and tiers | `src/data/sponsors.ts` |
| Socials, email, nav, member count | `src/data/site.ts` |
| FAQ on /join | `src/data/faq.ts` |
| Daily challenges | `src/data/challenges.ts` (see below) |

Entries marked `SAMPLE` or `TODO` are placeholders. Replace them before launch.
Pages that depend on "now" (home, events, links) revalidate hourly, so an event moves from upcoming to past without a redeploy.

### Adding a daily challenge

Answers are stored as salted SHA-256 hashes so view-source does not spoil them.

```bash
node scripts/hash-answer.mjs my-new-id "the answer"
```

Paste the printed hash as `answerHash` for a new entry with the same `id`. Do not commit the plaintext answer.
This only deters casual spoilers; short answers can still be brute-forced.

## Features

- **Home**: next-event hero with live countdown and one-click sign up, stats, upcoming and past events
- **Events**: upcoming list, detail pages, Add to Google Calendar, `.ics` download
- **Past events, CTF hall of fame, Workshops, Projects**: credibility pages
- **Start Here**: beginner roadmap
- **About, Join (FAQ), Sponsors**
- **Links**: Linktree alternative (`/links`)
- **Daily challenge**: one puzzle per day, same for everyone, streak saved in the browser
- **Meet planner**: When2meet alternative. The poll and every answer live in the URL fragment (`#...`), which browsers never send to a server. Share the updated link to collect answers; paste links to merge.

## Security notes

- Static security headers (CSP, HSTS, frame, referrer, permissions) are set in `next.config.ts`. A nonce-based CSP would force dynamic rendering of every page. Next.js needs `'unsafe-inline'` for its inline hydration scripts, so scripts are limited to same-origin plus that.
- All untrusted input (meet links, localStorage) is parsed with strict validation and size limits. See `src/lib/meet.ts`, `src/lib/daily.ts` and their tests.
- External links go through `ExternalLink` (only `http(s)` and `mailto`, `rel="noopener noreferrer"`).
- `npm audit` reports a dev-only advisory (`braces`, via `eslint-config-next`). It is not in the production bundle, and no patched version exists yet.

## Adding a backend later (optional)

You do not need Supabase to ship this. Reach for one only when you want:

- an **admin panel** so execs can edit events without a PR
- a **daily-challenge leaderboard** or accounts
- **project submissions** stored in a database

Content access is isolated in `src/lib/events.ts`, so a database-backed version only needs to replace that file's data source.

## Deploy

Import the repo in Vercel, framework preset Next.js, no environment variables required.
Optionally set `NEXT_PUBLIC_SITE_URL` to the final domain for correct sitemap and metadata URLs.
