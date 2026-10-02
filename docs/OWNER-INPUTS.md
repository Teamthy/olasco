# Olasco Autos — owner details needed before launch

The public experience is intentionally request-first where business facts have not been supplied. These items must be confirmed before the corresponding production content is published. **Do not send credentials or private customer information in chat or commit them to Git; use the deployment secret manager.**

## 1. Brand and contact

- Official OA/Olasco logo files (SVG preferred) and any brand colours/typography rules. The current OA mark is a designed text/monogram placeholder.
- Confirm the WhatsApp number supplied as `08151594253` is the public customer-service number and whether voice calls should use the same line.
- Public email address, if customers should be offered email.
- Business hours, response-time expectations, and whether support runs on weekends/public holidays.
- Lagos and Abuja office/meeting-point addresses (if public), approved map pins/URLs, and service coverage boundaries. No address or office opening hour is invented on the site.
- Social account URLs.

## 2. Rental fleet and pricing — one record per vehicle

For **each vehicle** please supply:

- Make, model, year, trim, category, city, and rent/sale/both status.
- Owner-verified availability source or rule (live calendar, staff confirmation, or another approved workflow).
- Approved specs, passenger/luggage capacity, condition wording, features, and any restrictions.
- Daily/weekly/monthly rate and billing basis, currency, deposit, delivery/pickup fees, taxes, mileage limits, driver fee, and any mandatory charges—or explicit approval for “quote on request.”
- Owner-approved photos of that exact vehicle, publication permission, and photo credit. Mask registration plates, people, and personal details where appropriate.

## 3. Rental requirements and policy

Approve the exact wording/rules for:

- Minimum/maximum driver age, licence and ID requirements, international-visitor documents, and who may drive.
- Deposit/security hold, payment method/timing, insurance/damage responsibility, mileage/fuel, late return, extensions, cancellation/refund, cleaning, and prohibited use.
- Self-drive versus chauffeur availability, delivery/collection locations, inspection/check-in, and incident support.
- Daily, long-term, airport, corporate/business, event/conference, and interstate eligibility/limits. Confirm what routes are accepted and any driver, timing, security, or overnight conditions.

Until approved, the website says requirements and rates are confirmed per request. It does not promise a deposit amount, age threshold, cancellation policy, mileage allowance, driver availability, or route coverage.

## 4. Purchase, trade-in, and handover

- Verified sales inventory, exact approved photography, asking price/quote policy, mileage/condition, inspection process, and document/ownership-transfer steps.
- Whether financing, trade-in, delivery, warranty, or after-sales support is offered, and the exact terms if so.
- Approved purchasing, payment, reservation, and handover policies.

## 5. Pickup and corporate mobility

- Airports served, pickup meeting points, flight monitoring/wait-time rules, luggage/passenger limits, service hours, and fare/quote logic.
- Chauffeur availability, vehicle classes, areas/routes, waiting time and overtime rules.
- Corporate account requirements, invoicing/payment terms, event/conference capacity, service-level limits, interstate itinerary approval and pricing rules.

## 6. Trust, legal, and content

- Customer testimonials with explicit publication permission; evidence and publication permission for every rating, award, or certification. None are fabricated or displayed by default.
- Owner-approved Terms, Privacy Notice, cookie/analytics decisions, retention period, data-controller/company details, and any required Nigerian legal/compliance wording.
- Confirmed FAQs and support escalation contact.

## 7. Production operations and integrations

- Production domain and canonical URL.
- PostgreSQL database, backup/retention, migration and monitoring setup.
- Admin recipients and chosen notification providers. SMTP and WhatsApp Cloud API credentials belong only in the deployment secret manager.
- Security owner/contact, approved rate limits, and shared Redis/WAF configuration for multi-instance production.
- Deployment provider and content owner for updating inventory/policies.

### Currently configured from your brief

- Customer WhatsApp: `08151594253`, normalized for click-to-chat as `2348151594253`.
- Cities served: Lagos and Abuja (specific office addresses and coverage remain unverified).
- Services requested: daily and long-term rentals, vehicle sales, pickup/drop-off, airport pickup, chauffeur, corporate/business trips, event and conference transport, and interstate trips.
