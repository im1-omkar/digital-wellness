# Wellspace — Digital Wellness Resource Hub

A student-facing guide to practical digital wellness resources. The site helps students compare screen-time, focus, notification, and privacy options, then follow short setup guides.

This implementation uses a Next.js App Router frontend, an Express 5 TypeScript API, PostgreSQL, Drizzle ORM/Kit, shared Zod contracts, and version-controlled content seeds.

## Requirements

- Node.js 20.9 or newer (required by the current Next.js setup).
- Bun or npm.
- Docker Desktop or another Docker Compose implementation for the local PostgreSQL database.

## Run locally

1. Copy environment examples:

   ```sh
   cp .env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

2. Install dependencies and start PostgreSQL:

   ```sh
   bun install --concurrent-scripts 2 --network-concurrency 8
   bun run db:up
   ```

3. Generate and apply the initial database migration, then seed reviewed content:

   ```sh
   bun run db:generate
   bun run db:migrate
   bun run db:seed
   ```

4. Start the API and website in separate terminals so startup is staged and each service is easy to monitor:

   ```sh
   # Terminal 1
   bun run dev:api
   ```

   ```sh
   # Terminal 2
   bun run dev:web
   ```

   `bun run dev` is also available to start both together. The web dev server uses Webpack with Next.js memory optimizations for a lower memory footprint.

Open <http://localhost:3000>. The API health endpoint is <http://localhost:4000/health>.

For a later database schema change, edit `apps/api/src/db/schema.ts`, generate a migration with `bun run db:generate`, review the SQL under `apps/api/drizzle`, then apply it with `bun run db:migrate`. Update catalog copy in `packages/content/src/catalog.ts` and run `bun run db:seed`; the import updates matching slugs and is safe to run again.

## Project structure

```text
apps/api/                 Express API, Drizzle schema, migrations, seed and feedback retention
apps/web/                 Next.js pages, styles, guide illustrations and feedback proxy
packages/contracts/       Shared Zod request and response contracts
packages/content/         Reviewed catalog and guide content
docs/                      Student usability and content review templates
IMPLEMENTATION_PLAN.md    Product, architecture, milestone and acceptance plan
```

## Features

- Goal, topic, platform, cost, and text search filters.
- Nine curated resources with official source links and a shared checked date (November 11, 2026).
- Side-by-side comparison of two or three options.
- Three setup guides for iPhone Focus, Android Focus mode, and LeechBlock NG on Firefox.
- Original interface illustrations for each guide. They contain no personal information and are labeled as illustrations; device menus may vary.
- Optional feedback reports with strict length limits, rate limiting, and a 90-day automatic deletion period. The API does not expose submitted feedback publicly.
- Keyboard skip link, visible focus styles, semantic labels, text alternatives, responsive layouts, and reduced-motion styling.

## Feedback moderation and deletion

Feedback is intentionally limited to an issue category and short note. Maintainers can view recent reports from a private terminal connected to the database:

```sh
bun run --filter @wellness/api feedback:list
```

Delete a report sooner if it includes sensitive information:

```sh
bun run --filter @wellness/api feedback:delete -- <report-uuid>
```

The API also removes reports older than 90 days on startup and once per day. Do not paste private feedback into public logs or issues.

## Environment variables

### API (`apps/api/.env`)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. |
| `PORT` | API port; defaults to `4000`. |
| `WEB_ORIGIN` | Comma-separated allowed browser origins; defaults to `http://localhost:3000`. |
| `DB_POOL_SIZE` | Optional PostgreSQL pool size; defaults to `10`. |
| `TRUST_PROXY` | Optional trusted proxy hop count. Set only to the number of reverse proxies controlled by your deployment. |

### Web (`apps/web/.env.local`)

| Variable | Purpose |
|---|---|
| `API_INTERNAL_URL` | Server-side API base URL; defaults to `http://localhost:4000/api/v1`. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for metadata and sitemap links. |

Never put database credentials or API secrets in a `NEXT_PUBLIC_*` variable.

## Content review

The initial catalog contains nine records across four categories. Each record includes purpose, platform, cost details, account/permission needs, privacy notes, accessibility considerations, limitations, official sources, and a checked date. Paid requirements are called out in the resource details and comparison table. The project does not claim to independently audit a vendor's privacy or accessibility statements.

Before presenting this as a final student project, recruit three to five students to complete a resource-finding task and follow a guide. Record what confused them, verify the current menus and links on the actual devices they use, and revise the content. The SVG guides are intentionally original illustrative mockups; replace or supplement them with sanitized device screenshots if the course specifically requires literal product screenshots.

Use [the student usability review template](docs/USABILITY_REVIEW_TEMPLATE.md) for the three tasks and revision log, and [the content review guide](docs/CONTENT_REVIEW_GUIDE.md) when refreshing official sources.

## Deployment

Deploy `apps/web` and `apps/api` as separate Node services and use a managed PostgreSQL database. Set the environment variables above, configure `WEB_ORIGIN` to the deployed web origin, apply migrations before starting the API, and run the seed only when reviewed content changes. Use HTTPS and backups on the selected host. The default feedback limiter stores counts in process memory; use a shared store if the API runs on multiple replicas. Provider-specific commands depend on the deployment platform.

## References used for the seeded resource records

- [Apple Screen Time](https://support.apple.com/en-ie/guide/iphone/iphbfa595995/27/ios/27) and [Apple Focus](https://support.apple.com/en-gb/guide/iphone/iphd6288a67f/ios)
- [Google Digital Wellbeing](https://support.google.com/android/answer/9346420?hl=en) and [Google Account privacy controls](https://support.google.com/accounts/answer/7660719?hl=en)
- [Windows Focus](https://support.microsoft.com/en-us/windows/experience/focus-stay-on-task-without-distractions-in-windows) and [Windows Do Not Disturb](https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows)
- [LeechBlock NG on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/leechblock-ng/) and [documentation](https://www.proginosko.com/leechblock/documentation/)
- [Cold Turkey pricing](https://getcoldturkey.com/pricing/) and [privacy policy](https://getcoldturkey.com/privacy/)
- [EFF Surveillance Self-Defense](https://ssd.eff.org/)

Official sources were checked on November 11, 2026. Recheck the pages before relying on changing pricing, compatibility, permissions, or settings instructions.
