# Digital Wellness Resource Hub — Implementation Plan

## 1. Purpose and scope

This plan uses the attached project brief as the product requirements. The requested deliverable is a practical implementation plan for an Express API and a Next.js site, with supporting technology choices.

The hub should help students choose a digital wellness resource that fits their need, device, budget, and privacy preferences. It should explain trade-offs and setup steps, rather than present an unexplained link list.

### MVP outcomes

- A student can start with a goal such as focus, fewer notifications, a better bedtime routine, or digital privacy and reach suitable options.
- The catalog contains **8–12 reviewed resources**, grouped into clear categories.
- Each resource uses the same comparison criteria: purpose, supported platforms, cost, account/privacy requirements, accessibility, limitations, official sources, and date checked.
- The site contains **at least three concise setup guides** with relevant, privacy-safe screenshots.
- A student can compare a small number of options side by side and send feedback about a resource or guide.
- Three to five students can complete a find-and-follow task; observations are recorded and used to revise the site.

### Out of scope for the first release

- Accounts, personalized tracking, behavioral analytics, or collection of screen-time data.
- Clinical or mental-health advice. The site is an educational guide to technology choices, not a diagnosis or treatment service.
- Public media uploads. The brief makes submissions optional; see the stretch scope below.

## 2. Recommended stack

| Area | Recommendation | Why |
|---|---|---|
| Web app | Next.js App Router, React, TypeScript | Server-rendered public pages suit a searchable resource directory and make resource and guide pages linkable. Use Server Components for read-only page data and Client Components only for interactive filters and comparison. Next.js documents server-side data fetching and public list pages in its App Router guides. |
| API | Express 5, TypeScript | A small, separate JSON API keeps the requested Express layer clear and gives the web app a stable content contract. Express routers support splitting endpoints into focused modules. |
| Database | PostgreSQL | Fits the related resource, category, guide, source, and feedback records. Use a managed PostgreSQL service for a deployed demo, or Docker Compose for local development. |
| Data access/migrations | Drizzle ORM + Drizzle Kit | Typed schema and SQL migration files keep the schema reviewable in a TypeScript project. |
| Validation | Zod | Share request/response schemas and validate public feedback input at the API boundary. |
| Styling | Tailwind CSS with a small accessible component set | Supports responsive layouts without requiring a large design system. Check keyboard and contrast behavior for each component. |
| Content authoring | Version-controlled JSON/TypeScript seed data | Keeps initial research and edits reviewable. Import approved content into PostgreSQL with an idempotent seed command. Avoid building an admin interface for the MVP. |
| Deployment | Deploy the Next.js app and Express API as separate Node services, with managed PostgreSQL | Keeps the API independently testable. Choose a host that supports the selected Next.js features and a persistent database; keep secrets server-side. |

Pin package versions in the lockfile when implementation begins and follow documentation for those installed versions. Next.js supports server-side data fetching in Server Components, while Express 5 provides the routing layer for the API. Drizzle documents code-first schemas and generated SQL migrations. [Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data) · [Express 5 routing](https://expressjs.com/en/guide/routing/) · [Drizzle migrations](https://orm.drizzle.team/docs/migrations)

### Repository layout

```text
apps/
  web/                 Next.js pages, components, styles
  api/                 Express app, routes, services, database access
packages/
  contracts/           Shared Zod schemas and inferred TypeScript types
content/
  resources/            Reviewed resource seed records
  guides/               Guide text and screenshot references
  research-log.csv      Source URLs, checked dates, and reviewer notes
```

Use a workspace package manager (pnpm or npm workspaces) and one root set of formatting, lint, type-check, and development scripts. Keep `apps/web` dependent on API contracts, not database code.

## 3. Product structure and user flows

### Main routes

- `/` — brief introduction, “What would you like to change?” goal choices, and prominent browse link.
- `/resources` — searchable catalog with category, device/platform, and cost filters.
- `/resources/[slug]` — purpose, who it may suit, compatibility, cost details, privacy/account requirements, accessibility notes, limitations, alternatives, source links, and last-checked date.
- `/compare?items=...` — comparison of up to three resources using the same fields; works on narrow screens with a clear stacked layout.
- `/guides` and `/guides/[slug]` — setup instructions, prerequisites, screenshots, platform/version context, and checked date.
- `/about/methodology` — selection criteria, how pricing/privacy claims are checked, and how a student can report stale information.
- `/feedback` or an embedded feedback form — short report form for a broken link, unclear step, outdated detail, or accessibility issue.

### Decision flow

1. Ask for the user’s practical goal (focus, screen-time routine, notifications/sleep, privacy/safety).
2. Ask or let them filter by device/platform and cost preference. Do not require a profile or store the answers.
3. Show a short set of matches with a plain-language reason each one may fit and a visible limitation.
4. Let the student compare options or open a setup guide.
5. Link to the official product or help page and show when the hub last checked it.

Do not present a “best” score unless a transparent scoring method is defined and explained. For the MVP, use transparent filters and explainable matches.

## 4. Resource research and content plan

### Catalog composition

Target 10 resources, with flexibility to publish 8–12 after research. Aim for a balanced mix across:

- Built-in screen-time, focus, or bedtime controls.
- Notification controls and routines.
- Browser focus or distraction-reduction tools.
- Privacy and digital-safety guidance.

Start with a shortlist from student feedback. Example guide candidates include a built-in mobile focus/screen-time setting, a notification or bedtime schedule, and a browser distraction-control setup. Confirm the actual products and platforms with the intended student audience before writing steps.

### Required resource record

Every published record must have:

- Name, category, short purpose, “may suit” guidance, and known limitations.
- Supported operating systems, browsers, and device types, with compatibility evidence.
- A cost label (`free`, `free tier`, `paid`, `open source`, or `built in`) plus a short explanation of what the label includes. Never call a tool free if an essential feature being recommended requires payment.
- Whether an account, permissions, or personal data are required; describe the requirement without implying that the hub has audited the vendor.
- Accessibility considerations or known gaps, and a source for any claim.
- Official product/help/privacy source URLs, `lastVerifiedAt`, and a short verification note.
- Review status and editor/reviewer initials or team role (do not publish student personal details).

Check official vendor or platform information before publishing and record the date checked. Recheck every resource and external link before release, then set a review cadence (for example, once per academic term) and mark overdue records for review. Do not make unsupported privacy or accessibility guarantees.

### Setup guides

Write at least three guides. Each should state the intended device/platform and version context, prerequisites, concise numbered steps, expected result, how to undo the change, and a troubleshooting note. Use screenshots that show only the relevant interface; remove names, accounts, notifications, identifiers, and other personal information. Add useful alt text (or mark a purely decorative image accordingly) and captions where needed.

## 5. Data model

Use UUID primary keys and timestamps. Keep source evidence separate so a resource can cite more than one official page.

| Table | Key fields |
|---|---|
| `categories` | `id`, `slug`, `name`, `description`, `sort_order` |
| `resources` | `id`, `slug`, `name`, `category_id`, `purpose`, `fit_notes`, `goal_tags`, `platforms` (JSON/text array), `cost_label`, `cost_details`, `account_required`, `permissions`, `privacy_notes`, `accessibility_notes`, `limitations`, `status`, `last_verified_at`, `created_at`, `updated_at` |
| `resource_sources` | `id`, `resource_id`, `url`, `source_type`, `checked_at`, `verification_note` |
| `guides` | `id`, `slug`, `title`, `resource_id` (nullable), `platform`, `version_context`, `intro`, `prerequisites`, `undo_steps`, `troubleshooting`, `status`, `last_verified_at` |
| `guide_steps` | `id`, `guide_id`, `position`, `instruction`, `image_path` (nullable), `image_alt` (nullable), `caption` (nullable) |
| `guide_sources` | `id`, `guide_id`, `url`, `source_type`, `checked_at` |
| `feedback` | `id`, `resource_id`/`guide_id` (nullable), `issue_type`, `message`, `created_at`, `review_status` |

Add database constraints for valid status/cost values and unique slugs. Enforce that a published resource has source evidence in the seed/publish validation step (or with a database trigger if an admin workflow is added later). Use migrations rather than editing deployed schemas manually.

## 6. Express API contract

Prefix endpoints with `/api/v1`. Return consistent JSON, use stable slugs for public URLs, validate query/body values with shared Zod schemas, and use standard HTTP status codes.

| Endpoint | Purpose |
|---|---|
| `GET /health` | Deployment health check; no sensitive configuration in response. |
| `GET /api/v1/categories` | Published categories and counts. |
| `GET /api/v1/resources` | Published resources; supports `q`, `goal`, `category`, `platform`, `cost`, and pagination. |
| `GET /api/v1/resources/compare?slugs=a,b` | Two or three published resources in consistent comparison shape. |
| `GET /api/v1/resources/:slug` | One resource with source links and checked date. Register the fixed `compare` route before the `:slug` route in Express. |
| `GET /api/v1/guides` | Published guides, optionally filtered by platform/resource. |
| `GET /api/v1/guides/:slug` | Guide plus ordered steps and screenshot metadata. |
| `POST /api/v1/feedback` | Submit a short issue report; strict length/type limits and rate limiting. |

Public catalog routes are read-only. For MVP, maintainers edit reviewed seed files, review the change, and run an import command. This avoids public account creation and reduces the risk of unreviewed wellness claims. Add a protected admin interface only if the project has a clear need and time for authentication, authorization, audit, and moderation.

## 7. Privacy, security, and accessibility

### Privacy/security

- Collect no accounts, health profiles, browsing history, or device telemetry.
- Make feedback optional; request only issue type and short message. Tell users not to include personal or health information. Do not request a name or email in the MVP.
- Limit message length, validate input, and rate-limit the feedback endpoint. Delete each report within 90 days of submission, and provide a way to remove it sooner if it contains sensitive information.
- Configure CORS for the deployed web origin only. Use HTTPS, environment-based secrets, request-size limits, safe error messages, and dependency updates.
- Do not accept file uploads in the MVP. If the optional media submission feature is added, use private object storage, allowlisted formats, strict size limits, malware scanning, metadata stripping, explicit consent, moderator approval, and a deletion/retention policy before publishing anything.
- Keep logs free of feedback message bodies, access tokens, and submitted personal data.

### Accessibility

Target WCAG 2.2 AA as a project goal. Provide semantic headings, a skip link, keyboard-operable filters and comparison controls, visible focus, meaningful link text, sufficient contrast, form labels and error messages, responsive zoom/reflow, and text alternatives for informative images. Verify the finished pages with keyboard-only navigation and an automated accessibility scan, then fix observed issues. WCAG 2.2 is the current W3C recommendation cited here. [W3C: What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

## 8. Build sequence and milestones

### Milestone 1 — Audience and content criteria

- Identify the intended student audience and collect quick feedback on their main needs and devices.
- Agree on categories, comparison vocabulary, cost labels, and the no-sensitive-data policy.
- Deliverable: one-page product brief, task flows, and shortlist of resource candidates.

### Milestone 2 — Research and guides

- Research 8–12 resources using official product, support, pricing, and privacy pages.
- Fill every required comparison field and log URLs plus date checked.
- Draft at least three platform-specific guides; capture and sanitize screenshots.
- Deliverable: reviewed resource records, three guides, source log, and unresolved-claims list.

### Milestone 3 — Project foundation and API

- Set up the workspace, TypeScript conventions, shared contracts, local PostgreSQL, Express app, and Drizzle migrations.
- Add seed/import command, read endpoints, feedback validation, health endpoint, and consistent error handling.
- Deliverable: API returning seeded sample content and documented endpoint contract.

### Milestone 4 — Next.js experience

- Build page shell/navigation, home decision flow, catalog filters, resource details, comparison, guide pages, methodology, and feedback.
- Render public content server-side where practical; keep browser-side state limited to temporary filters/comparison selections.
- Deliverable: complete responsive site connected to the Express API.

### Milestone 5 — Review and release

- Check every product/help/source link, verify checked dates, confirm screenshots contain no personal information, and fix stale or unsupported statements.
- Conduct keyboard, contrast, screen-size, form error, and browser checks.
- Ask 3–5 students to find a resource matching a goal and follow one guide. Record completion, confusion, dead ends, and feedback; revise and repeat the affected tasks.
- Deploy web, API, and database; document environment variables, migration/seed steps, content update process, and rollback procedure.
- Deliverable: release candidate, test/revision log, deployment notes, and final content review date.

## 9. Acceptance checklist

- [ ] 8–12 resources are published, categorized, and useful for the selected audience.
- [ ] Every resource includes purpose, platforms, cost, account/privacy requirements, accessibility, limitations, official source URLs, and checked date.
- [ ] Cost labels distinguish free, freemium, paid, open-source, and built-in options accurately.
- [ ] At least three concise guides include relevant, sanitized screenshots and are checked against current official instructions.
- [ ] Students can filter by goal/category, platform, and cost, then compare options using consistent criteria.
- [ ] Navigation is readable, links describe their destination, focus is visible, contrast is sufficient, and images have appropriate descriptions.
- [ ] Feedback asks for no unnecessary personal data and has a documented review/deletion process.
- [ ] All external links are checked; 3–5 student task sessions are recorded; revisions are made from their findings.
- [ ] README explains local setup, environment variables, database migration/seed, deployment, and how to re-verify catalog entries.

## 10. Optional stretch: student media contributions

If time and project policy allow, add submissions for videos, feedback, animations, or app-screen demonstrations only after the MVP is complete. Route contributions into a moderation queue; never publish automatically. Ask submitters to remove personal information and confirm they have permission to share the material. Store files privately until approved, apply the upload safeguards above, and provide a clear withdrawal/deletion route. A text feedback form is sufficient for the first release.

## 11. Deployment and operations

- Configure separate `web`, `api`, and database services. Store `DATABASE_URL`, API origin, and any storage credentials as server-side environment variables; never expose secrets through `NEXT_PUBLIC_*` variables.
- Run migrations as a deployment step, then seed only when appropriate. Keep production content changes reviewable and backed up.
- Add a readiness/health endpoint, basic uptime checks, error reporting without sensitive request bodies, and a documented restore path.
- Start with conservative caching for public catalog data and revalidate after reviewed content updates. If self-hosting Next.js, follow the framework’s deployment guidance for the chosen runtime and reverse proxy. [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting)

## 12. Main risks and responses

| Risk | Response |
|---|---|
| Prices, platform support, or settings change | Store official source and checked date; set a review cadence; show stale/review-needed status internally. |
| A “free” label hides a paid essential feature | Record what the free tier includes and label the relevant feature’s paid requirement explicitly. |
| The site becomes a link directory | Design the goal-based choice flow, consistent comparison, “may suit” explanations, limitations, and setup guides as core MVP work. |
| Screenshots or feedback expose personal details | Use synthetic/demo accounts, sanitize images, avoid identity fields, moderate feedback, and delete sensitive submissions. |
| Scope expands into media hosting or user accounts | Keep uploads and accounts out of MVP; complete them only with a defined moderation, privacy, and maintenance plan. |
| Product recommendations are mistaken for health advice | State the educational scope and avoid diagnosis, treatment claims, or behavioral promises. |
