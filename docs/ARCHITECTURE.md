# Olasco Autos — product and technical architecture

## 1. Design system

The written brief is the available visual reference in this checkout; no separate reference image was attached. The direction is an original editorial automotive system rather than a literal reference clone.

- **Positioning:** premium Nigerian mobility, with the warmth and directness of a local service business.
- **Palette:** ink `#111311`, paper `#F4F3EF`, white `#FFFFFF`, muted stone `#777A74`, and a restrained electric-lime `#D8F36A` for primary actions and small signals only.
- **Typography:** Manrope; large, tightly tracked editorial display type with calm, readable body copy and compact uppercase labels.
- **Composition:** dark cinematic opening, light editorial sections, asymmetric photo-and-copy panels, spacious catalog rows, then a dark closing CTA. Avoid generic gradients, fake statistics, fake ratings, and unverified inventory.
- **Photography:** high-resolution generated editorial photography is used as *placeholder imagery* until owner photographs arrive. Images are sharp, consistently graded, and never presented as a specific Olasco vehicle: no make/model, price, condition, or availability is attached to them. Actual vehicle listings stay empty until owner-approved records and photos are supplied. See [public/images/IMAGE-SOURCES.md](../public/images/IMAGE-SOURCES.md) for the replacement workflow.
- **Contact and WhatsApp:** WhatsApp is the primary handoff everywhere. `Chat with Olasco` actions open the direct chat at `wa.me/2348151594253` (from `NEXT_PUBLIC_WHATSAPP_NUMBER`) with a short greeting, so the customer lands in the conversation and only has to tap send.
- **Brand mark:** original OA monogram and Olasco Autos wordmark; replaceable with official artwork when supplied.

## 2. Sitemap and page families

Routes are composed from shared layouts and content data; similar categories do not become disconnected copy-pasted pages.

- `/` — home and primary service selector
- `/about`, `/contact`, `/faq`, `/privacy`, `/terms`
- `/locations`, `/locations/lagos`, `/locations/abuja`
- `/rentals`, `/rentals/search`, `/rentals/booking`, `/rentals/policies`
- `/rentals/luxury`, `/rentals/suv`, `/rentals/sedan`, `/rentals/executive`, `/rentals/airport`, `/rentals/corporate`, `/rentals/long-term`, `/rentals/interstate`
- `/rentals/[slug]` — published rental vehicle detail
- `/cars`, `/cars/luxury`, `/cars/suv`, `/cars/executive`, `/cars/sell-trade-in`, `/cars/consultation`
- `/cars/[slug]` — published car-for-sale detail
- `/pickup`, `/pickup/airport`, `/pickup/chauffeur`, `/pickup/corporate`, `/pickup/events`, `/pickup/booking`
- `/testimonials` — consented stories only; publish no fabricated reviews
- `/whatsapp` — contextual human contact handoff
- `/api/*` — REST endpoints; no admin surface is exposed in public navigation

Vehicle detail paths are data-backed. An unknown or unpublished slug returns a not-found response. Category pages render verified inventory when available and a useful request-first empty state otherwise.

## 3. Data model

PostgreSQL via Prisma. Core tables: `User` (admin identity, reserved for a later protected admin app), `Vehicle`, `VehicleImage`, `Customer`, `Booking`, `BookingCounter`, `Inquiry`, `PickupRequest`, `ContactMessage`, `Location`, and `AuditLog`.

- `Vehicle` stores normalized facts, nullable prices, city, category, publication/availability flags, and rental/sales mode. Only owner-approved inventory is published.
- `Customer` holds contact details; `Booking` is a request, not a payment or confirmed reservation.
- `Booking` stores the requested service, vehicle/category, city, dates/time, pickup/destination, passenger and driver details, notes, status, and idempotency key. Public confirmation uses a reference (`OLA-YYYY-NNNNNN`), never the database ID.
- Statuses: `PENDING`, `CONTACTED`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.
- Indexes: vehicle slug/city/category/publication, booking status/createdAt/reference/idempotency key, and inquiry/pickup creation time.
- No inventory, price, policy, address, opening-hour, testimonial, rating, award, or certification data is seeded as fact.

Schema status: `prisma/schema.prisma` is the intended data model, but schema validation and generated-client behavior are not verified in this sandbox because the Prisma engine download fails before validation can complete. No `prisma/migrations` directory has been created or checked in. Validate the schema, generate the client, create and review a baseline migration, and test it against a clean PostgreSQL database before any production deployment.

## 4. API and service boundaries

Next.js App Router hosts a versionable JSON REST boundary. Route handlers call `src/server/*` services; UI components never import Prisma or talk to storage directly.

- `POST /api/bookings` — validate, rate-limit, idempotently persist, issue public reference, then attempt configured notifications.
- `GET /api/bookings/:reference` — return a privacy-minimal confirmation projection.
- `GET /api/vehicles`, `GET /api/vehicles/:slug` — published, owner-approved inventory only.
- `POST /api/inquiries`, `POST /api/pickup-requests`, `POST /api/contact` — validate, persist, then notify.
- `GET /api/locations` — public business configuration without secrets.
- Admin listing/mutation endpoints are intentionally not enabled until authentication, roles, and an owner-managed admin account are configured.

Zod validates request bodies. Public write endpoints have same-origin checks and rate limits. When `RATE_LIMIT_REDIS_URL` and `RATE_LIMIT_REDIS_TOKEN` are configured, an atomic Redis REST script shares counters across instances; client addresses are HMAC-hashed before becoming keys. If Redis is unconfigured, the app falls back to a per-process in-memory limiter (suitable only for local/single-instance use). Partial Redis configuration or a Redis error fails closed with HTTP 503. PostgreSQL is required in production. When no `DATABASE_URL` is present in development, a local JSON adapter makes the flow demonstrable; it is never selected in production. Secrets are server-only.

Notifications use provider interfaces. SMTP and the WhatsApp Cloud API are attempted only when the required deployment secrets are present; an unconfigured provider is logged as skipped, never faked. Notification failures do not erase a saved request.

## 5. Component architecture

- **App shell:** `SiteHeader`, accessible `MobileMenu`, `SiteFooter`, mobile action bar, `WhatsAppButton`, `Breadcrumbs`.
- **Brand/system:** OA `BrandMark`, `SectionHeading`, `Button`, form controls, `Notice`, `EmptyState`, `StatusPill`.
- **Commerce:** `ServiceCard`, `VehicleCard` (rental/sales modes), `VehicleFilters`, `VehicleGrid`, `VehicleGallery`, `VehicleSpecs`, `BookingStepper`, `BookingForm`, `InquiryForm`.
- **Content/data:** `businessConfig`, `locations`, `services`, `faqs`, `navigation`, `vehicles` API model.
- **Server-only:** Zod schemas, rate limiting, Prisma client, repository adapters, booking/reference service, notification providers, logging.

## 6. Booking flow

1. Customer chooses a city/service or a verified vehicle.
2. A three-step mobile-first form collects journey details, contact details, and review. Dates are validated in the browser and again on the server; return must be on/after pickup. Phone is normalized/validated; email is optional but validated if supplied.
3. Client submits JSON with an idempotency key to `POST /api/bookings`.
4. Server validates, stores a `PENDING` request, generates `OLA-YYYY-NNNNNN`, and attempts configured admin notifications.
5. Confirmation verifies the public reference against the persisted request-status endpoint before it says the request was received. A missing reference or unavailable store produces a clear not-found / cannot-verify state, never a success claim. `Continue on WhatsApp` shares the public reference and asks the team to confirm it can be located. No online payment is taken and no booking is described as confirmed until Olasco confirms it.

## 7. WhatsApp architecture

One client-safe config reads `NEXT_PUBLIC_WHATSAPP_NUMBER` (defaulting to the number supplied by the owner, normalized to `2348151594253`). All handoffs call `createWhatsAppLink({ phone, message })`; messages cover general, rental, sales, pickup, airport, corporate, event, interstate, and booking follow-up contexts. The WhatsApp Cloud API is a separate server-only notification provider and is not required for the user's click-to-chat link.

## 8. Responsive strategy (mobile-first; majority mobile)

- Design from 360px up. Mobile header uses OA mark, menu button, and a compact WhatsApp action; desktop expands into primary route groups.
- Hero becomes a short, high-impact stacked composition with the vehicle image below/behind copy; avoid desktop-height hero on small screens.
- Services become swipeable, snap-aligned panels where useful. Vehicle imagery uses fixed aspect ratios; cards remain readable without hover.
- Filters become a labeled bottom sheet on mobile. Booking is a full-page/stacked experience with a persistent step indicator, large touch targets, native date/time controls, and a safe-area-aware bottom action bar.
- Sticky mobile actions reserve bottom spacing and never obscure form fields or page content. Motion respects `prefers-reduced-motion`.

## 9. Implementation phases

1. Architecture and content integrity (this document; owner-input checklist).
2. Design tokens, OA mark, responsive shell, photography sources.
3. Conversion-focused homepage and service/location page templates.
4. Data-backed rental and sales catalogs, filters, and detail routes (empty until approved data exists).
5. Booking, purchase inquiry, pickup request, and contextual WhatsApp handoff.
6. Prisma schema, API validation, dev adapter, PostgreSQL persistence, and notification interfaces.
7. SEO metadata, sitemap/robots, structured data, accessibility/performance checks.
8. Protected admin, production DB/migrations, shared rate limiting, SMTP/WhatsApp providers, deployment hardening after credentials and operational policies are supplied.
