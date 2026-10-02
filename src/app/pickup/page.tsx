import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin, Plane, Route, Users } from "lucide-react";
import { pickupServices } from "@/content/services";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Airport pickup, chauffeur and mobility services",
  description: "Request airport pickup, chauffeur service, corporate and business trips, event and conference transport, city transfers, or an interstate itinerary in Lagos and Abuja.",
  alternates: { canonical: "/pickup" },
};

const iconFor = [Plane, Users, BriefcaseBusiness, CalendarDays, Route, ArrowUpRight];

export default function PickupPage() {
  return (
    <>
      <PageHero
        eyebrow="PICKUP / MOBILITY"
        title={<>The journey around <span>the journey.</span></>}
        description="Airport pickup, city transfers, chauffeur requests, corporate and business trips, event and conference transport, and interstate itineraries — coordinated through one direct conversation."
        aside={<>Share the schedule, route, and group size. Olasco confirms coverage, vehicle capacity, timing, and pricing before acceptance.</>}
        dark
      >
        <div className="hero-actions page-hero-actions">
          <ButtonLink href="/pickup/booking">Plan a pickup<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink>
          <WhatsAppLink context="pickup" variant="text" className="hero-secondary" icon="whatsapp">Talk through an itinerary</WhatsAppLink>
        </div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pickup & travel" }]} />
      <section className="section section--white">
        <div className="container">
          <SectionHeading eyebrow="SERVICE DIRECTORY" title="Tell us where, when, and who is travelling." description="Every itinerary is checked directly. Service coverage, airport meeting point, waiting terms, vehicle capacity, driver arrangements, and fare are not assumed by the form." />
          <div className="pickup-service-grid">
            {pickupServices.map((service, index) => {
              const Icon = iconFor[index] || ArrowUpRight;
              return <Link className="pickup-service-card" href={`/pickup/${service.slug}`} key={service.slug}><span className="pickup-service-index">0{index + 1}</span><span className="pickup-service-icon"><Icon size={18} aria-hidden="true" /></span><p className="eyebrow">{service.eyebrow}</p><h3>{service.title}</h3><p>{service.description}</p><span className="inline-arrow-link">Explore service<ArrowUpRight size={14} aria-hidden="true" /></span></Link>;
            })}
          </div>
        </div>
      </section>
      <section className="section section--ink pickup-process">
        <div className="container split-feature">
          <div className="split-media"><Image src="/images/chauffeur-pickup.jpg" alt="Stock photograph illustrating a chauffeur arranging luggage beside a car" fill sizes="(max-width: 640px) 92vw, 48vw" /><span className="split-note">Editorial stock photo</span></div>
          <div className="split-content split-content--light">
            <p className="eyebrow eyebrow--lime">SCHEDULE / ROUTE / CAPACITY</p>
            <h2>Good coordination begins before pickup.</h2>
            <p>Event and corporate journeys often involve more than a start and finish. Include arrival windows, stops, venue access, passengers, luggage, and any return schedule so the team can evaluate the request accurately.</p>
            <ul className="feature-list feature-list--dark">
              <li><CalendarDays size={15} aria-hidden="true" />Share an actual date and pickup time</li>
              <li><MapPin size={15} aria-hidden="true" />Add the pickup point and destination</li>
              <li><Users size={15} aria-hidden="true" />Include passenger and luggage details</li>
              <li><BriefcaseBusiness size={15} aria-hidden="true" />Ask for corporate / event terms directly</li>
            </ul>
            <div className="hero-actions"><ButtonLink href="/pickup/booking">Send a pickup request<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context="corporate" variant="text" className="hero-secondary" icon="none">Ask about group travel</WhatsAppLink></div>
          </div>
        </div>
      </section>
      <section className="section section--paper">
        <div className="container pickup-route-note"><div><p className="eyebrow">LAGOS / ABUJA / BEYOND</p><h2>Interstate routes are reviewed one itinerary at a time.</h2><p>Share origin, destination, dates, preferred vehicle class, and whether a driver is required. Olasco will confirm route eligibility, conditions, and pricing before accepting the request.</p></div><Link className="button button--outline" href="/pickup/interstate">Ask about an interstate trip<ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      </section>
    </>
  );
}
