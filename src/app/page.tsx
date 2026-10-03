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
} from "lucide-react";
import { businessConfig } from "@/config/business";
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
  { icon: Headphones, title: "Personal Support", text: "A real person, from first message to pickup." },
  { icon: CalendarClock, title: "Flexible Rental", text: "Hours, days or longer." },
  { icon: BadgeCheck, title: "Clear Pricing", text: "Get the full quote before you decide." },
  { icon: CarFront, title: "Vehicle Options", text: "Find the right fit for your trip." },
];

const fleetBenefits = [
  { icon: CalendarClock, title: "Easy Booking", text: "A quick, simple request." },
  { icon: ShieldCheck, title: "Transparent Pricing", text: "Know the full quote before you commit." },
  { icon: MapPin, title: "Multiple Locations", text: "Pickup in Lagos or Abuja." },
  { icon: Handshake, title: "Trip Support", text: "A real person to help with the details." }
];

const popularClasses: CarRailItem[] = [
  {
    name: "SUV",
    meta: "Space for people and luggage",
    price: "Quote on request",
    href: "/rentals/suv",
    image: "/images/home-hero-mountain.jpg",
    alt: "Pearl-white SUV on a mountain lakeside road",
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
    alt: "A selection of premium vehicles, including a compact city car",
  },
  {
    name: "Airport transfer",
    meta: "Arrivals handled end to end",
    price: "Quote on request",
    href: "/pickup/airport",
    image: "/images/airport-pickup.jpg",
    alt: "A chauffeur helping with luggage at an airport arrival",
  },
];

const exploreCategories = [
  { name: "Economy", note: "Everyday city driving", href: "/rentals/sedan", image: "/images/fleet-lineup.jpg", alt: "Compact car among a premium vehicle lineup" },
  { name: "SUV", note: "Room for people and luggage", href: "/rentals/suv", image: "/images/fleet-feature-lakeside.jpg", alt: "Pearl-white SUV beside a mountain lake" },
  { name: "Luxury", note: "Premium occasions", href: "/rentals/luxury", image: "/images/fleet-pair.jpg", alt: "Premium SUV and executive sedan side by side" },
  { name: "Executive", note: "Business travel", href: "/rentals/executive", image: "/images/executive-sedan.jpg", alt: "Black executive sedan outside a glass office building" },
  { name: "Airport pickup", note: "A smooth start to your trip", href: "/pickup/airport", image: "/images/airport-pickup.jpg", alt: "Chauffeur loading luggage at airport arrivals" },
  { name: "Interstate", note: "Plan the route with us", href: "/pickup/interstate", image: "/images/interstate-highway.jpg", alt: "Premium SUV travelling along an open highway at sunset" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c") }}
      />

      <div className="home-page">
        <section className="hero home-hero" aria-labelledby="home-title">
          <div className="hero-bg">
            <Image
              src="/images/home-hero-mountain.jpg"
              alt=""
              fill
              priority
              quality={92}
              sizes="100vw"
            />
          </div>
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">DRIVE YOUR NEXT STORY</p>
              <h1 id="home-title">
                Premium Cars <br className="hero-title-break" />for Every <span>Journey</span>
              </h1>
              <p className="hero-description">
                From city rides to mountain escapes, Olasco Autos helps you find the right vehicle for every destination.
              </p>
              <div className="hero-actions">
                <ButtonLink href="/rentals/booking" variant="primary">
                  <span className="hero-button-arrow" aria-hidden="true"><ArrowRight size={14} /></span>
                  Book Your Car
                </ButtonLink>
                <ButtonLink href="/rentals" variant="outline" className="hero-secondary">
                  Explore Fleet
                </ButtonLink>
              </div>
            </div>

            <div className="hero-features" aria-label="Olasco Autos service highlights">
              {heroFeatures.map(({ icon: Icon, title, text }) => (
                <div className="hero-feature" key={title}>
                  <span className="hero-feature-icon" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <span className="hero-feature-copy">
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--white home-fleet-section">
          <div className="container split-feature">
            <div className="split-content">
              <p className="eyebrow">OUR FLEET</p>
              <h2>
                Find the Perfect Ride <span>for Your Journey</span>
              </h2>
              <p>
                Choose from a range of options — from city cars to spacious SUVs and executive sedans. Tell us where you’re going and
                we’ll help find a ride that suits the journey.
              </p>
              <ButtonLink href="/categories" variant="secondary">
                View All Cars
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

            <div className="split-media split-media--blob home-fleet-media">
              <Image
                src="/images/fleet-feature-lakeside.jpg"
                alt="Pearl-white SUV beside a mountain lake on a clear afternoon"
                fill
                quality={92}
                sizes="(max-width: 1000px) 92vw, 46vw"
              />
              <Link className="split-media-label" href="/rentals/suv">
                Explore the SUV class
                <span className="card-arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="why-band home-why-band">
          <div className="why-band-bg" aria-hidden="true">
            <Image
              src="/images/why-drive-banner.jpg"
              alt=""
              fill
              quality={92}
              sizes="100vw"
            />
          </div>
          <div className="container why-band-inner">
            <div className="why-band-copy">
              <p className="eyebrow eyebrow--lime">WHY CHOOSE US</p>
              <h2>
                More Than a Rental,<br />It’s a <span>Better Drive.</span>
              </h2>
              <p>
                The right vehicle, clear terms, and a person who answers when plans change. We’ll help you work out the details before
                the journey begins.
              </p>
              <ButtonLink href="/about" variant="primary">
                Learn More
                <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="section section--paper home-rentals-section">
          <div className="container">
            <CarRail
              eyebrow="POPULAR RENTALS"
              title={
                <>
                  The right car <span>for every plan</span>
                </>
              }
              description="Explore popular vehicle classes and services. We’ll confirm the exact vehicle and current rate for your dates."
              items={popularClasses}
            />

            <div className="cta-strip">
              <div className="cta-strip-media">
                <Image src="/images/why-drive-banner.jpg" alt="" fill quality={90} sizes="(max-width: 860px) 100vw, 52vw" />
              </div>
              <div className="cta-strip-inner">
                <div className="cta-strip-copy">
                  <span className="cta-strip-icon" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                  <div>
                    <h2>Ready to hit the road?</h2>
                    <p>Share your plans and get a clear answer from our team.</p>
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

        <section className="section section--white home-categories-section">
          <div className="container">
            <SectionHeading
              eyebrow="EXPLORE BY CATEGORY"
              title={
                <>
                  Find the right fit <span>for your next trip</span>
                </>
              }
              description="Start with the kind of journey you have in mind."
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
                    <Image
                      src={category.image}
                      alt={category.alt}
                      fill
                      quality={90}
                      sizes="(max-width: 640px) 46vw, (max-width: 1000px) 45vw, 30vw"
                    />
                  </Link>
                  <div className="category-card-body">
                    <div>
                      <h3>{category.name}</h3>
                      <small>{category.note}</small>
                    </div>
                    <Link className="card-arrow card-arrow--dark" href={category.href} aria-label={`Explore ${category.name}`}>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--paper home-customer-care-section">
          <div className="container">
            <SectionHeading
              eyebrow="CUSTOMER CARE"
              title={
                <>
                  A better journey starts <span>with a clear plan</span>
                </>
              }
              description="Helpful answers and the right details, before you set off."
            />
            <div className="testimonial-grid home-customer-care-grid">
              <article className="testimonial-card home-promise-card">
                <div className="promise-tag">
                  <span aria-hidden="true"><Quote size={15} /></span>
                  A promise from our team
                </div>
                <h3>Good service is in the details.</h3>
                <p className="testimonial-quote">
                  Share your dates, route, and the kind of car you need. We’ll check current availability, explain the terms, and give you
                  a clear answer before you commit.
                </p>
                <p className="home-review-note">
                  We publish customer stories only with their permission. Until then, our team is happy to answer your questions directly.
                </p>
                <div className="testimonial-person">
                  <span className="testimonial-avatar" aria-hidden="true">OA</span>
                  <span><strong>Olasco Autos</strong><small>Here to help you plan</small></span>
                </div>
                <WhatsAppLink context="general" variant="text" icon="whatsapp" className="promise-chat-link">
                  Chat with Olasco
                </WhatsAppLink>
              </article>
              <div className="testimonial-media home-customer-care-media">
                <Image
                  src="/images/lagos-city.jpg"
                  alt="Lagos skyline and the Lekki-Ikoyi Link Bridge at blue hour"
                  fill
                  quality={92}
                  sizes="(max-width: 860px) 92vw, 40vw"
                />
                <div className="customer-care-image-label">
                  <MapPin size={15} aria-hidden="true" />
                  Lagos & Abuja
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
