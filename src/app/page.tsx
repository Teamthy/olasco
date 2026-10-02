import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CarFront,
  Handshake,
  Headphones,
  MapPin,
  Quote,
  ShieldCheck,
  Star,
} from "lucide-react";
import { businessConfig } from "@/config/business";
import { locationPages } from "@/content/locations";
import { CarRail, type CarRailItem } from "@/components/car-rail";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Car rental, car sales & mobility in Lagos and Abuja",
  description:
    "Rent a car, arrange airport pickup or chauffeur travel, and find your next vehicle in Lagos and Abuja. Talk to Olasco Autos on WhatsApp.",
  alternates: { canonical: "/" },
};

const heroFeatures = [
  { icon: Headphones, title: "Human handoff", text: "Every request reaches a real person on WhatsApp." },
  { icon: CalendarClock, title: "Flexible rental", text: "Daily, extended, airport or interstate." },
  { icon: BadgeCheck, title: "Quote before you commit", text: "Rates and terms confirmed in writing first." },
  { icon: MapPin, title: "Lagos & Abuja", text: "Two city starts, one point of contact." },
];

const fleetBenefits = [
  { icon: BadgeCheck, title: "Request in minutes", text: "A short form, then a reference by return." },
  { icon: ShieldCheck, title: "Rates confirmed up front", text: "Ask for the full basis before you commit." },
  { icon: MapPin, title: "Lagos & Abuja", text: "Pickup points agreed with the team." },
  { icon: Handshake, title: "Chauffeur on request", text: "Ask for a driver on any rental or transfer." },
];

const popularClasses: CarRailItem[] = [
  {
    name: "SUV",
    meta: "Space for the whole trip",
    price: "Quote on request",
    href: "/rentals/suv",
    image: "/images/hero-fleet.jpg",
    alt: "Black premium SUV prepared for a Lagos journey at golden hour",
  },
  {
    name: "Executive sedan",
    meta: "Composed business travel",
    price: "Quote on request",
    href: "/rentals/executive",
    image: "/images/executive-sedan.jpg",
    alt: "Black executive sedan outside a glass office building",
  },
  {
    name: "City car",
    meta: "Practical for a day in town",
    price: "Quote on request",
    href: "/rentals/sedan",
    image: "/images/fleet-lineup.jpg",
    alt: "Black SUV, executive sedan and compact city car parked together",
  },
  {
    name: "Airport transfer",
    meta: "Arrivals handled end to end",
    price: "Quote on request",
    href: "/pickup/airport",
    image: "/images/airport-pickup.jpg",
    alt: "Chauffeur loading suitcases into a sedan at airport arrivals",
  },
  {
    name: "Chauffeur service",
    meta: "A driver for the journey",
    price: "Quote on request",
    href: "/pickup/chauffeur",
    image: "/images/chauffeur-pickup.jpg",
    alt: "Chauffeur welcoming a passenger into an executive sedan",
  },
  {
    name: "Interstate trip",
    meta: "Route checked before you go",
    price: "Quote on request",
    href: "/pickup/interstate",
    image: "/images/interstate-highway.jpg",
    alt: "Premium SUV travelling on an expressway at golden hour",
  },
];

const exploreCategories = [
  { name: "Economy", note: "Everyday city driving", href: "/rentals/sedan", image: "/images/fleet-lineup.jpg", alt: "Compact city car parked on a quiet street" },
  { name: "SUV", note: "Room for people and luggage", href: "/rentals/suv", image: "/images/hero-fleet.jpg", alt: "Black premium SUV at golden hour" },
  { name: "Luxury", note: "Premium occasions", href: "/rentals/luxury", image: "/images/fleet-pair.jpg", alt: "Premium SUV and executive sedan side by side" },
  { name: "Executive", note: "Business travel", href: "/rentals/executive", image: "/images/executive-sedan.jpg", alt: "Black executive sedan outside a glass office building" },
  { name: "Corporate", note: "Teams and schedules", href: "/pickup/corporate", image: "/images/corporate-travel.jpg", alt: "Business travellers walking towards a chauffeured SUV" },
  { name: "Events", note: "Group movement", href: "/pickup/events", image: "/images/abuja-city.jpg", alt: "Aerial view of Abuja with the National Mosque" },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  name: businessConfig.name,
  url: businessConfig.publicUrl,
  description: "Car rental, vehicle sourcing, airport pickup, chauffeur, business and event mobility in Lagos and Abuja, Nigeria.",
  telephone: businessConfig.phoneE164,
  areaServed: [
    { "@type": "City", name: "Lagos", containedInPlace: { "@type": "Country", name: "Nigeria" } },
    { "@type": "City", name: "Abuja", containedInPlace: { "@type": "Country", name: "Nigeria" } },
  ],
  priceRange: "Quote on request",
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c") }} />

      {/* ------------------------------------------------------------- hero */}
      <section className="hero">
        <div className="hero-bg">
          <Image src="/images/fleet-pair.jpg" alt="" fill priority quality={90} sizes="100vw" />
        </div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">DRIVE YOUR NEXT STORY</p>
            <h1>
              Premium cars for <span>every journey</span>
            </h1>
            <p className="hero-description">
              From city runs to airport arrivals and interstate trips, Olasco Autos matches you with the right vehicle in Lagos and Abuja —
              then hands you to a real person who confirms the details.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/rentals/booking" variant="primary">
                Book your car
                <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/rentals" variant="outline" className="hero-secondary">
                Explore fleet
              </ButtonLink>
            </div>
          </div>

          <div className="hero-features">
            {heroFeatures.map(({ icon: Icon, title, text }) => (
              <div className="hero-feature" key={title}>
                <span className="hero-feature-icon" aria-hidden="true">
                  <Icon size={19} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- our fleet */}
      <section className="section section--white">
        <div className="container split-feature">
          <div className="split-content">
            <p className="eyebrow">OUR FLEET</p>
            <h2>
              Find the perfect ride <span>for your journey</span>
            </h2>
            <p>
              Choose the class that fits the trip — a compact car for the city, an SUV for the family, or an executive sedan for meetings.
              Availability, rate, and requirements are confirmed by the team before anything is agreed.
            </p>
            <ButtonLink href="/categories" variant="secondary">
              View all classes
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ul className="feature-list feature-list--two-column">
              {fleetBenefits.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="feature-chip" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <br />
                    <small>{text}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="split-media split-media--blob">
            <Image
              src="/images/hero-fleet.jpg"
              alt="Black premium SUV prepared for a Lagos journey at golden hour"
              fill
              quality={90}
              sizes="(max-width: 1000px) 92vw, 46vw"
            />
            <Link className="split-media-label" href="/rentals/suv">
              SUV class
              <span className="card-arrow" aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- why choose */}
      <section className="why-band">
        <div className="container why-band-inner">
          <div>
            <p className="eyebrow eyebrow--lime">WHY CHOOSE US</p>
            <h2>
              More than a rental. <span>It’s a better drive.</span>
            </h2>
            <p>
              Olasco focuses on the details that decide whether a journey works: the right vehicle for the route, a clear rate before you
              commit, and a person who answers when plans change.
            </p>
            <ButtonLink href="/about" variant="primary">
              Learn more
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="why-band-media">
            <Image
              src="/images/executive-sedan.jpg"
              alt="Black executive sedan outside a glass office building at dusk"
              fill
              quality={90}
              sizes="(max-width: 1000px) 92vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- popular rentals */}
      <section className="section section--paper">
        <div className="container">
          <CarRail
            eyebrow="POPULAR CLASSES"
            title={
              <>
                Most requested <span>by our customers</span>
              </>
            }
            description="These are the classes customers ask for most. Tell us your dates, route, and passenger needs — the team confirms the actual vehicle and current rate."
            items={popularClasses}
          />

          <div className="cta-strip">
            <div className="cta-strip-media">
              <Image src="/images/interstate-highway.jpg" alt="" fill quality={90} sizes="(max-width: 860px) 0px, 50vw" />
            </div>
            <div className="cta-strip-inner">
              <div className="cta-strip-copy">
                <span className="cta-strip-icon" aria-hidden="true">
                  <Quote size={22} />
                </span>
                <div>
                  <h2>Ready to hit the road?</h2>
                  <p>Send your dates and route, and Olasco will confirm what is available.</p>
                </div>
              </div>
              <ButtonLink href="/rentals/booking" variant="primary">
                Get started
                <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- categories */}
      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="EXPLORE CATEGORY"
            title={
              <>
                Explore by <span>category</span>
              </>
            }
            description="Start with the kind of journey you have in mind, then share your dates and city with the team."
            action={
              <Link className="inline-arrow-link" href="/categories">
                All categories
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            }
          />
          <div className="category-grid">
            {exploreCategories.map((category) => (
              <article className="category-card" key={category.name}>
                <Link className="category-card-media" href={category.href} aria-label={`${category.name} — ${category.note}`} tabIndex={-1}>
                  <Image src={category.image} alt={category.alt} fill quality={90} sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw" />
                </Link>
                <div className="category-card-body">
                  <div>
                    <h3>{category.name}</h3>
                    <small>{category.note}</small>
                  </div>
                  <Link className="card-arrow card-arrow--dark" href={category.href} aria-label={`Open ${category.name}`}>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ testimonials */}
      <section className="section section--paper">
        <div className="container">
          <SectionHeading
            eyebrow="CUSTOMER STORIES"
            title="What our customers say"
            description="Real people, real journeys, real stories — published only with the customer's permission."
          />
          <div className="testimonial-grid">
            <article className="testimonial-card">
              <span className="testimonial-empty-icon" aria-hidden="true">
                <Star size={22} />
              </span>
              <p className="testimonial-quote">
                Approved customer reviews have not been supplied yet, so we don’t publish any. Olasco would rather show nothing than invent a
                five-star story.
              </p>
              <p className="section-heading-description">
                If you have travelled with Olasco and would like your experience published, send it in and the team will confirm permission
                before it appears here.
              </p>
              <div className="confirmation-actions">
                <WhatsAppLink context="general" variant="primary" icon="whatsapp">
                  Share your experience
                </WhatsAppLink>
                <Link className="button button--outline" href="/testimonials">
                  How we handle reviews
                </Link>
              </div>
            </article>
            <div className="testimonial-media">
              <Image
                src="/images/lagos-city.jpg"
                alt="Lagos skyline and the Lekki-Ikoyi Link Bridge at blue hour"
                fill
                quality={90}
                sizes="(max-width: 860px) 92vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cities */}
      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="TWO CITIES, ONE CLEAR CONTACT"
            title={
              <>
                Choose the city <span>you’re moving through</span>
              </>
            }
            description="Olasco operates primarily in Lagos and Abuja. Exact meeting points and coverage are confirmed before a request is accepted."
          />
          <div className="location-grid">
            {Object.values(locationPages).map((location) => (
              <article className="location-card" key={location.slug}>
                <Image src={location.image} alt={location.imageAlt} fill quality={90} sizes="(max-width: 860px) 92vw, 45vw" />
                <div className="location-card-content">
                  <p className="eyebrow">{location.eyebrow}</p>
                  <h3>{location.name}</h3>
                  <p>{location.coverageNote}</p>
                  <div className="location-card-actions">
                    <Link href={`/locations/${location.slug}`}>
                      <MapPin size={15} aria-hidden="true" />
                      Explore {location.name}
                    </Link>
                    <Link href={`/rentals/booking?location=${location.name}`}>
                      <CarFront size={15} aria-hidden="true" />
                      Request a car
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- final CTA */}
      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <div>
            <p className="eyebrow eyebrow--lime">READY WHEN YOU ARE</p>
            <h2>
              Tell us where the road is <span>taking you.</span>
            </h2>
            <p>
              Rental, vehicle purchase, airport pickup, business travel, or something in between — start with a request and continue with
              Olasco directly.
            </p>
          </div>
          <div className="cta-actions">
            <ButtonLink href="/rentals/booking" variant="primary">
              Make a booking request
              <ArrowUpRight size={15} aria-hidden="true" />
            </ButtonLink>
            <WhatsAppLink context="general" variant="outline" className="cta-secondary" icon="whatsapp">
              Chat on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </>
  );
}
