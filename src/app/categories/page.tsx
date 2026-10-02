import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Vehicle categories & service types",
  description:
    "Browse every Olasco Autos category — economy, SUV, executive and luxury cars, plus airport pickup, chauffeur, corporate, event and interstate services in Lagos and Abuja.",
  alternates: { canonical: "/categories" },
};

const vehicleCategories = [
  { name: "Economy", note: "Everyday city driving", href: "/rentals/sedan", image: "/images/fleet-lineup.jpg", alt: "Compact city car parked on a quiet street" },
  { name: "SUV", note: "Space for people and luggage", href: "/rentals/suv", image: "/images/hero-fleet.jpg", alt: "Black premium SUV at golden hour" },
  { name: "Executive", note: "Meetings and business travel", href: "/rentals/executive", image: "/images/executive-sedan.jpg", alt: "Black executive sedan outside a glass office building" },
  { name: "Luxury", note: "Premium occasions", href: "/rentals/luxury", image: "/images/fleet-pair.jpg", alt: "Premium SUV and executive sedan side by side" },
  { name: "Extended rental", note: "Weeks and months", href: "/rentals/long-term", image: "/images/city-car.jpg", alt: "Compact car on a Lagos street" },
  { name: "Interstate rental", note: "Route checked first", href: "/rentals/interstate", image: "/images/interstate-highway.jpg", alt: "SUV travelling on an expressway at golden hour" },
];

const serviceCategories = [
  { name: "Airport pickup", note: "Arrivals handled end to end", href: "/pickup/airport", image: "/images/airport-pickup.jpg", alt: "Chauffeur loading suitcases at airport arrivals" },
  { name: "Chauffeur", note: "A driver for the journey", href: "/pickup/chauffeur", image: "/images/chauffeur-pickup.jpg", alt: "Chauffeur welcoming a passenger into a sedan" },
  { name: "City transfer", note: "Point to point in Lagos or Abuja", href: "/pickup/city-transfer", image: "/images/lagos-city.jpg", alt: "Lagos skyline at blue hour" },
  { name: "Corporate", note: "Teams and schedules", href: "/pickup/corporate", image: "/images/corporate-travel.jpg", alt: "Business travellers walking to a chauffeured SUV" },
  { name: "Events", note: "Group movement", href: "/pickup/events", image: "/images/abuja-city.jpg", alt: "Aerial view of Abuja with the National Mosque" },
  { name: "Interstate", note: "Long-distance planning", href: "/pickup/interstate", image: "/images/interstate-highway.jpg", alt: "SUV on an expressway at golden hour" },
];

export default function CategoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="EXPLORE / CATEGORIES"
        title={
          <>
            Explore by <span>category.</span>
          </>
        }
        description="Find the kind of vehicle or service your trip needs, then share your dates and city. Olasco confirms the exact vehicle, current rate, and requirements before anything is agreed."
        image="/images/fleet-lineup.jpg"
        imageAlt="Black SUV, executive sedan and compact city car parked together"
        aside="Categories describe the kind of vehicle or service requested — never a specific car, price, or availability."
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="BY VEHICLE"
            title={
              <>
                Choose the class that <span>fits the trip</span>
              </>
            }
            description="Tell us how many people are travelling, where you are going, and the dates you need. The team checks what is genuinely available."
          />
          <div className="category-grid">
            {vehicleCategories.map((category) => (
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

      <section className="section section--paper">
        <div className="container">
          <SectionHeading
            eyebrow="BY SERVICE"
            title={
              <>
                Or start with the <span>kind of journey</span>
              </>
            }
            description="Airport arrivals, full-day chauffeur hire, corporate schedules, event transport, and interstate itineraries all begin with the same clear conversation."
          />
          <div className="category-grid">
            {serviceCategories.map((category) => (
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

      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <div>
            <p className="eyebrow eyebrow--lime">NOT SURE WHICH ONE?</p>
            <h2>
              Tell us the trip and <span>we’ll suggest the class.</span>
            </h2>
            <p>Share the city, dates, passenger count, and route. The team will recommend what suits the journey.</p>
          </div>
          <div className="cta-actions">
            <Link className="button button--primary" href="/rentals/booking">
              Start a request
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <WhatsAppLink context="general" variant="outline" className="cta-secondary" icon="whatsapp">
              Ask on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </>
  );
}
