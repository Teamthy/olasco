# Olasco Autos

A mobile-first, request-led website for Olasco Autos in Lagos and Abuja. The platform brings rental discovery, car-sales enquiries, pickup/chauffeur/corporate/event/interstate requests, central WhatsApp handoff, and PostgreSQL-backed intake into one reusable Next.js application.

**Important:** this is a request platform, not an online payment or instant-reservation system. A request is not confirmed until the Olasco team checks and confirms availability, rate, requirements, and terms. Vehicle listings stay empty until verified inventory is entered; the editorial photography in `public/images` is generated placeholder imagery and is not a record of Olasco inventory.

## Product and design documentation

- [Architecture, sitemap, data model, API/component design, flows, responsive strategy, and phases](docs/ARCHITECTURE.md)
- [Owner information and approvals required before launch](docs/OWNER-INPUTS.md)
- [Editorial image sources and replacement guide](public/images/IMAGE-SOURCES.md)

## Stack

- Next.js App Router, React, and TypeScript
- REST route handlers with Zod request validation
- PostgreSQL and Prisma persistence
- Local JSON request adapter for development only
- SMTP and WhatsApp Cloud API admin notifications (optional, server-only credentials)
- Contextual WhatsApp click-to-chat link using the configured customer number

## Requirements

- Node.js 22 LTS recommended (Next.js 16 requires Node.js 20.9 or newer)
- npm
- PostgreSQL for production-like request persistence

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The default `.env.example` leaves `DATABASE_URL` blank; in non-production mode, submitted requests are written to the ignored `.data/requests.json` file. This adapter is only a local demonstration convenience. It is not shared across instances, not backed up, and must never be used for production customer data.

To develop against PostgreSQL, set `DATABASE_URL` in `.env.local`. Before using the Prisma-backed flow, generate the Prisma client and apply a reviewed database migration (see **Database and migrations** below). Never commit `.env.local`, credentials, or customer data.

## Environment configuration

Copy `.env.example` to `.env.local` for development. Keep secrets in the deployment provider's secret manager; never expose them with a `NEXT_PUBLIC_` prefix.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Canonical public URL used by metadata, sitemap, and robots; set to the deployed HTTPS domain in production. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Customer-facing click-to-chat number; use international digits (default normalizes to `2348151594253`). |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Optional public business email. |
| `NEXT_PUBLIC_LAGOS_MAPS_URL`, `NEXT_PUBLIC_ABUJA_MAPS_URL` | Approved public map links; defaults are generic city searches, not business addresses. |
| `DATABASE_URL` | PostgreSQL connection string. Required for production request persistence and published inventory. |
| `EMAIL_PROVIDER`, `EMAIL_FROM`, `ADMIN_EMAIL`, `SMTP_*` | Optional SMTP notification provider. Configure the complete set on the server. |
| `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ADMIN_PHONE`, `WHATSAPP_GRAPH_API_VERSION` | Optional WhatsApp Cloud API admin notification provider; distinct from customer click-to-chat. |
| `RATE_LIMIT_REDIS_URL`, `RATE_LIMIT_REDIS_TOKEN` | Optional HTTPS Redis REST endpoint and bearer token for the shared atomic limiter. If both are blank, limits are per-process; configure both before multi-instance production. Partial configuration or Redis errors fail closed with HTTP 503. |

No credentials are needed for the customer click-to-chat handoff. The supplied public WhatsApp number is centralized in `src/config/business.ts`; components use the shared encoded message builder.

## Database and migrations

The Prisma schema is at `prisma/schema.prisma`. **No migration has been checked in yet.** Before connecting a production database:

1. Configure a disposable development PostgreSQL database in `DATABASE_URL`.
2. Resolve the current Prisma engine-download issue noted under **Verification status**.
3. Validate the schema and generate the client: `npx prisma validate` and `npx prisma generate`.
4. Create and review the initial migration with `npx prisma migrate dev --name init`, commit the generated `prisma/migrations` directory, and test it against a clean database.
5. Apply only reviewed migrations in production with `npx prisma migrate deploy`; back up the database first.

`npm run build` runs `prisma generate` before `next build`. The production API deliberately fails closed for request writes when `DATABASE_URL` is absent. Do not use `prisma db push` as a production migration strategy. Populate vehicle records only from owner-approved inventory and photography; no sample cars or prices are seeded.

## Main routes and request flow

- `/` — services and primary conversion paths
- `/rentals`, `/rentals/search`, `/rentals/[category-or-vehicle]`, `/rentals/booking`
- `/cars`, `/cars/[category-or-vehicle]`, `/cars/consultation`, `/cars/sell-trade-in`
- `/pickup`, `/pickup/[service]`, `/pickup/booking`
- `/locations`, `/locations/[city]`, `/about`, `/contact`, `/faq`, `/privacy`, `/terms`, `/testimonials`, `/whatsapp`
- `POST /api/bookings`, `GET /api/bookings/[reference]`
- `POST /api/inquiries`, `POST /api/pickup-requests`, `POST /api/contact`
- `GET /api/vehicles`, `GET /api/vehicles/[slug]`, `GET /api/locations`

Rental requests are validated in the browser and again on the server, persisted, assigned a public reference, and followed by a privacy-minimal status verification before the confirmation UI claims receipt. Requests remain `PENDING`; no payment is processed. Pickup, sales, and contact requests are stored and return a reference. Configured notification providers alert the business but are optional and are not the booking database. The user can then continue the conversation via an encoded WhatsApp message.

There is **no admin UI, authentication, or admin API** in this implementation. These must be designed and reviewed before staff access or customer-record management is added. Public endpoints use a shared Redis REST limiter when configured; otherwise rate limits are per-process and are not sufficient for multi-instance production. Apply appropriate database access controls, backups, retention rules, privacy/legal review, and monitoring before launch.

## Commands

```bash
npm run dev         # Start the local development server
npm run lint        # ESLint
npm run typecheck   # TypeScript check
npm test            # Vitest unit tests
npm run build       # Generate Prisma client, then build Next.js (requires Prisma engine download)
npm start           # Start the production server after a successful build
```

## Verification status in this workspace

- `npm test` — passed (22 tests across bounded JSON parsing, shared/local rate limiting, booking-confirmation verification, all four request schemas, and WhatsApp handoff).
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npx next build` — optimized Next.js compile, typecheck, and static-page generation passed **without running Prisma generation**.
- Prisma validation/client generation, the checked-in migration workflow, and the full `npm run build` — **not verified**. Prisma cannot download `schema-engine.gz.sha256` from `binaries.prisma.sh` in this environment because the TLS connection is disconnected. Resolve that network/engine issue and rerun schema validation, generation, migrations, and `npm run build` before deployment.
- `npm audit` currently reports 3 high advisories in the Prisma CLI/config dependency tree. Nodemailer was upgraded to `10.0.13` and Vitest to `5.0.3`; the previously reported advisories for those packages are cleared. Review the Prisma toolchain upgrade path before launch; do not use `npm audit fix --force` without testing the major-version change. `npm audit --omit=dev` still surfaces this Prisma peer/tooling dependency in the current lockfile.
- No production database, approved inventory, admin access, live notifications, or launch policies have been configured.

## Before launch

Review [the owner-input checklist](docs/OWNER-INPUTS.md) and approve actual inventory, exact photos and rights, rates or quote rules, rental requirements/policies, service coverage, addresses and contact details, legal/privacy text, production domain, database/migration plan, notification recipients, and security/operations ownership. Do not send credentials through chat or commit them to the repository.
