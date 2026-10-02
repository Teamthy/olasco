# Editorial image sources

All files in this folder are **generated editorial photography**, produced for the Olasco Autos site to replace low-resolution stock placeholders. They are clean, high-resolution (≥1050px on the long edge) and served through Next Image optimisation.

**They are not photographs of Olasco-owned vehicles, current listings, staff, or offices.** No make, model, price, availability, or specification is attached to any of them. Replace each file with owner-approved photographs of the actual fleet before publishing live vehicle listings.

| Local file | Dimensions | Description | Used for |
| --- | --- | --- | --- |
| `hero-fleet.jpg` | 1152 × 768 | Black premium SUV on a city boulevard at golden hour | Home hero, SUV rental class |
| `fleet-pair.jpg` | 1584 × 672 | Premium SUV and executive sedan side by side | Rentals page hero |
| `executive-sedan.jpg` | 1408 × 768 | Black executive sedan outside a glass office building | Cars-for-sale hero, executive class |
| `fleet-lineup.jpg` | 1408 × 768 | SUV, executive sedan and city car parked together | Locations hero, city-car class, event transport |
| `chauffeur-pickup.jpg` | 1408 × 768 | Chauffeur welcoming a passenger into a sedan | WhatsApp page, chauffeur service |
| `airport-pickup.jpg` | 1408 × 768 | Chauffeur loading suitcases at airport arrivals | Pickup page, airport service |
| `corporate-travel.jpg` | 1408 × 768 | Business travellers walking to a chauffeured SUV | About page, corporate service |
| `interstate-highway.jpg` | 1408 × 768 | SUV travelling on an expressway at golden hour | Interstate service |
| `lagos-city.jpg` | 1408 × 768 | Lagos skyline and Link Bridge at blue hour | Contact page, Lagos location |
| `abuja-city.jpg` | 1052 × 768 | Aerial view of Abuja with the National Mosque | Abuja location |

## Replacing with real inventory photography

1. Supply owner-approved photographs of the **exact** vehicle (exterior three-quarter front, interior, boot, dashboard) or the exact city/office context.
2. Mask registration plates and any personal details.
3. Keep at least 1408px on the long edge so the hero and gallery crops stay sharp.
4. Update the corresponding `image` / `imageAlt` values in `src/content/services.ts`, `src/config/business.ts`, and the page-level `<PageHero>` props.
5. Only then attach a make, model, price, or availability from a verified `Vehicle` record.

Vehicle listings themselves stay empty until verified inventory is entered through the database; no sample car or price is seeded in code.
