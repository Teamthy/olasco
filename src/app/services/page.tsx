import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CarFront, Handshake, MapPin, Plane, Route, ShieldCheck, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Fleet & services",
  description:
    "Every Olasco Autos service in one place: car rental, vehicle purchase, airport pickup, chauffeur hire, corporate travel, event transport and interstate trips in Lagos and Abuja.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    icon: CarFront,
    title: "Car rental",
    text: "Daily, weekly, and extended rentals with the vehicle class agreed before you commit.",
    href: "/rentals",
    action: "Explore rentals",
  },
  {
    icon: Plane,
    title: "Airport pickup",
    text: "Share the terminal, arrival time, and onward destination. The team confirms the meeting point.",
    href: "/pickup/airport",
    action: "Arrange an arrival",
  },
  {
    icon: Handshake,
    title: "Chauffeur service",
    text: "Request a driver for a single journey, a full-day schedule, or a route that needs planning.",
    href: "/pickup/chauffeur",
    action: "Request a chauffeur",
  },
  {
    icon: Users,
    title: "Corporate travel",
    text: "Coordinate airport runs, meetings, and recurring travel with one point of contact.",
    href: "/pickup/corporate",
    action: "Plan business travel",
  },
  {
    icon: MapPin,
    title: "City transfers",
    text: "Point-to-point transfers across Lagos and Abuja, with the route confirmed first.",
    href: "/pickup/city-transfer",
    action: "Book a transfer",
  },
  {
    icon: Route,
    title: "Interstate trips",
    text: "Long-distance itineraries reviewed for route eligibility, driver needs, and total quote.",
    href: "/pickup/interstate",
    action: "Plan a route",
  },
  {
    icon: ShieldCheck,
    title: "Cars for sale",
    text: "Ask for verified current options, inspection arrangements, and handover terms.",
    href: "/cars",
    action: "Browse cars",
  },
  {
    icon: Users,
    title: "Events & conferences",
    text: "Move guests between venues with capacity and timing confirmed case by case.",
    href: "/pickup/events",
    action: "Plan event transport",
  },
];

const guarantees = [
  { title: "A real person", text: "Every request reaches the Olasco team on WhatsApp, not a queue." },
  { title: "Terms before commitment", text: "Rates, requirements, and coverage are confirmed in writing first." },
  { title: "Two city starts", text: "Lagos and Abuja, with pickup points agreed directly." },
  { title: "No invented inventory", text: "Listings appear only when a vehicle is verified and photographed." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="FLEET / SERVICES"
        title={
          <>
            Everything Olasco <span>arranges.</span>
          </>
        }
        description="Car rental, vehicle sourcing, airport arrivals, chauffeur hire, corporate schedules, event transport, and interstate itineraries — coordinated through one team in Lagos and Abuja."
        image="/images/abuja-city.jpg"
        imageAlt="Aerial view of Abuja with the National Mosque and Aso Rock"
        aside="Availability, rates, and route eligibility are confirmed per request. No service is promised before the team checks it."
      >
        <div className="hero-actions page-hero-actions">
          <ButtonLink href="/rentals/booking" variant="primary">
            Start a request
            <ArrowUpRight size={15} aria-hidden="true" />
          </ButtonLink>
          <WhatsAppLink context="general" variant="outline" className="hero-secondary" icon="whatsapp">
            Ask on WhatsApp
          </WhatsAppLink>
        </div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Fleet & services" }]} />

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT WE DO"
            title={
              <>
                A service for the trip <span>you’re planning</span>
              </>
            }
            description="Each service starts with the same short request. The team confirms what is genuinely possible for your dates, route, and group size."
          />
          <div className="pickup-service-grid">
            {services.map(({ icon: Icon, title, text, href, action }, index) => (
              <article className="pickup-service-card" key={title}>
                <span className="pickup-service-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span className="pickup-service-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link className="inline-arrow-link" href={href}>
                  {action}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why-band">
        <div className="container why-band-inner">
          <div>
            <p className="eyebrow eyebrow--lime">HOW WE WORK</p>
            <h2>
              Clear answers before <span>the keys.</span>
            </h2>
            <p>
              A good journey starts with the details that matter: the right vehicle, a rate you agreed to, and someone who picks up the phone
              when plans change.
            </p>
            <ButtonLink href="/about" variant="primary">
              About Olasco
              <ArrowUpRight size={15} aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="why-band-media">
            <Image
              src="/images/corporate-travel.jpg"
              alt="Business travellers walking towards a chauffeured SUV in Lagos"
              fill
              quality={90}
              sizes="(max-width: 1000px) 92vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT YOU CAN EXPECT"
            title="The parts we control."
            description="These are the commitments Olasco can make today. Everything else — availability, rates, coverage — is confirmed per request."
          />
          <div className="trust-grid">
            {guarantees.map((item, index) => (
              <article className="trust-item" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <div>
            <p className="eyebrow eyebrow--lime">READY WHEN YOU ARE</p>
            <h2>
              Start with what you <span>already know.</span>
            </h2>
            <p>The city, the dates, and the route are enough to begin. Olasco will take it from there.</p>
          </div>
          <div className="cta-actions">
            <ButtonLink href="/rentals/booking" variant="primary">
              Make a request
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
