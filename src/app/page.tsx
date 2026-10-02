import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness, CarFront, CircleDollarSign, Clock3, Handshake, Plane, ShieldCheck } from "lucide-react";
import { businessConfig } from "@/config/business";
import { serviceCards, rentalCategories, pickupServices } from "@/content/services";
import { locationPages } from "@/content/locations";
import { ServiceCard, VehicleClassCard } from "@/components/service-card";
import { LocationCard } from "@/components/location-card";
import { SectionHeading } from "@/components/section-heading";
import { RentalSearch } from "@/components/rental-search";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Car rental, car sales & mobility in Lagos and Abuja",
  description: "Request daily or long-term car rental, verified vehicle options, airport pickup, chauffeur, corporate and event transport in Lagos or Abuja. Talk to Olasco on WhatsApp.",
  alternates: { canonical: "/" },
};

const serviceIcons = [CarFront, CircleDollarSign, Plane, BriefcaseBusiness];

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
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">OLASCO AUTOS / LAGOS & ABUJA</p>
            <h1>Every journey, <span>considered.</span></h1>
            <p className="hero-description">Car rental, vehicle sourcing, and planned journeys in Lagos and Abuja — brought together by one team that stays with you from request to confirmation.</p>
            <div className="hero-actions">
              <ButtonLink href="/rentals" variant="primary">Explore rentals<ArrowRight size={15} aria-hidden="true" /></ButtonLink>
              <ButtonLink href="/cars" variant="text" className="hero-secondary">Find a car to own<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink>
            </div>
            <div className="hero-coverage"><strong>Lagos</strong><span className="hero-coverage-dot" aria-hidden="true" /><strong>Abuja</strong><span>·</span><span>Human confirmation, every time</span></div>
          </div>
          <figure className="hero-media">
            <Image className="hero-photo" src="/images/hero-fleet.jpg" alt="Black premium SUV prepared for a Lagos journey at golden hour" fill priority quality={90} sizes="(max-width: 860px) 100vw, 55vw" />
            <span className="hero-index">01 — SET THE PACE</span>
            <span className="hero-photo-note"><BadgeCheck size={12} aria-hidden="true" />Olasco fleet</span>
            <figcaption className="hero-media-caption"><span>A considered start to a good journey.</span><span>Rental · Sales · Mobility</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="service-strip" aria-labelledby="service-selector-title">
        <div className="container">
          <div className="service-strip-header">
            <p className="eyebrow" id="service-selector-title">A better way to get moving</p>
            <p>Choose your starting point. We’ll take it from there.</p>
          </div>
          <div className="service-selector">
            {serviceCards.map((service, index) => {
              const Icon = serviceIcons[index];
              return <ServiceCard {...service} icon={<Icon key={`service-icon-${index}`} size={18} aria-hidden="true" />} key={service.href} />;
            })}
          </div>
        </div>
      </section>

      <section className="search-section" aria-label="Rental availability search">
        <div className="container"><RentalSearch /></div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="THE RENTAL FLEET"
            title="Start with the kind of journey you have in mind."
            description="Browse by vehicle class, then share your dates and city. Specific vehicles, current rates, and availability are confirmed by the team for your dates."
            action={<Link className="inline-arrow-link" href="/rentals">View rental options<ArrowUpRight size={15} aria-hidden="true" /></Link>}
          />
          <div className="class-card-grid">
            {rentalCategories.map((category, index) => <VehicleClassCard key={category.key} name={category.name} description={category.description} href={`/rentals/${category.key}`} image={category.image} alt={category.alt} label={`0${index + 1} / REQUEST A CLASS`} />)}
          </div>
          <p className="catalog-disclaimer">Models, specifications, availability and rates are confirmed by Olasco. No sample car is presented as live inventory.</p>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <SectionHeading eyebrow="HOW IT WORKS" title="A useful first step. A person for the rest." description="The website helps you share the details that matter. Our team checks the operational details with you before anything is confirmed." dark />
          <div className="process-grid">
            <article className="process-item"><span className="process-item-index">01 / TELL US</span><h3>Share the journey.</h3><p>Choose a service, city, dates, route, and the kind of vehicle you have in mind.</p></article>
            <article className="process-item"><span className="process-item-index">02 / WE CHECK</span><h3>Get clear answers.</h3><p>Olasco checks genuine availability, route coverage, current pricing, and the terms that apply.</p></article>
            <article className="process-item"><span className="process-item-index">03 / CONNECT</span><h3>Continue with a human.</h3><p>Receive a request reference, then carry the details into WhatsApp to complete the conversation.</p></article>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split-feature split-feature--reverse">
          <div className="split-media split-media--rounded">
            <Image src="/images/executive-sedan.jpg" alt="Black executive sedan outside a glass office building at dusk" fill quality={90} sizes="(max-width: 640px) 92vw, 48vw" />
            <span className="split-note">Executive sedan</span>
          </div>
          <div className="split-content">
            <p className="eyebrow">BUY WITH CLARITY</p>
            <h2>Your next car should come with the right conversation.</h2>
            <p>Tell Olasco what you’re looking for — make, class, budget, and city. The team can share verified options and confirm inspection, documentation, payment, and handover details for the specific car.</p>
            <ul className="feature-list">
              <li><ShieldCheck size={15} aria-hidden="true" />Ask about a specific vehicle or get help choosing</li>
              <li><Clock3 size={15} aria-hidden="true" />Arrange an inspection conversation with the team</li>
              <li><Handshake size={15} aria-hidden="true" />Confirm price and handover terms before committing</li>
            </ul>
            <div className="hero-actions">
              <ButtonLink href="/cars" variant="secondary">Explore cars for sale<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink>
              <WhatsAppLink context="purchase" variant="text" icon="none">Talk to a sales specialist<ArrowUpRight size={14} aria-hidden="true" /></WhatsAppLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mobility-band" aria-labelledby="mobility-heading">
        <div className="mobility-image"><Image src="/images/chauffeur-pickup.jpg" alt="Chauffeur welcoming a passenger into an executive sedan" fill quality={90} sizes="(max-width: 640px) 100vw, 42vw" /></div>
        <div className="mobility-copy">
          <p className="eyebrow eyebrow--lime">PICKUP / CHAUFFEUR / CORPORATE</p>
          <h2 id="mobility-heading">Move people well. Keep the day in motion.</h2>
          <p>From airport arrivals to a boardroom schedule, event shuttle, or interstate itinerary, share the route and timing. Olasco confirms which services and capacity can be arranged.</p>
          <div className="mobility-links">
            {pickupServices.slice(0, 5).map((service) => <Link className="mobility-link" key={service.slug} href={`/pickup/${service.slug}`}>{service.title.replace(/[.!]$/, "")}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}
            <Link className="mobility-link" href="/pickup/booking">Request a pickup<ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHeading eyebrow="TWO CITIES, ONE CLEAR CONTACT" title="Choose the city you’re moving through." description="Olasco operates primarily in Lagos and Abuja. Exact office addresses, meeting points, opening hours, and route limits will be confirmed before a request is accepted." />
          <div className="location-grid">
            <LocationCard location={locationPages.lagos} />
            <LocationCard location={locationPages.abuja} />
          </div>
          <p className="location-caveat">No unverified office address or opening hour is published. Meeting points are agreed directly with the team.</p>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHeading eyebrow="OUR PROMISE TO BE STRAIGHT WITH YOU" title="Real details before big promises." description="A request reference and direct access to a person make it easier to ask the right questions. We only publish claims and customer stories Olasco can verify." />
          <div className="trust-grid">
            <article className="trust-item"><span>01 / FACTS</span><h3>No invented fleet or rates.</h3><p>Vehicle photos, specifications, current availability, and prices belong to the specific verified listing — not a sample card.</p></article>
            <article className="trust-item"><span>02 / TERMS</span><h3>Know what needs confirming.</h3><p>Rental requirements, deposits, delivery fees, route eligibility, and sales handover terms are discussed before confirmation.</p></article>
            <article className="trust-item"><span>03 / PEOPLE</span><h3>Keep a human in the loop.</h3><p>Online forms capture context; WhatsApp is there for the representative who can confirm the next step.</p></article>
          </div>
          <div className="story-note">
            <div><p className="eyebrow">CUSTOMER STORIES</p><h3>We don’t make up five stars.</h3></div>
            <p>Approved testimonials, ratings, and awards have not yet been supplied. When real customer stories are ready and publication permission is confirmed, they can appear here.</p>
            <Link href="/testimonials">About customer stories<ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Tell us where the road is taking you.</h2><p>Rental, vehicle purchase, airport pickup, business travel, or something in between — start with a request and continue with Olasco directly.</p></div>
          <div className="cta-actions"><ButtonLink href="/rentals/booking" variant="primary">Make a rental request<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context="general" variant="text" className="cta-secondary" icon="whatsapp">Chat on WhatsApp</WhatsAppLink></div>
        </div>
      </section>
    </>
  );
}
