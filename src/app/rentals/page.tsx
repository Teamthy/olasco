import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Route } from "lucide-react";
import { listVehicles } from "@/server/repositories";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { VehicleCatalog } from "@/components/vehicle-catalog";
import { RentalSearch } from "@/components/rental-search";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Car rental in Lagos and Abuja",
  description: "Request a daily, long-term or interstate rental in Lagos or Abuja. Share dates and vehicle class; Olasco confirms current availability, pricing and requirements directly.",
  alternates: { canonical: "/rentals" },
};

const rentalServices = [
  { title: "Daily rentals", href: "/rentals/daily", detail: "A short request for the dates and vehicle class you need.", icon: CalendarDays },
  { title: "Long-term rentals", href: "/rentals/long-term", detail: "Ask about an extended period, rate basis, and any terms before you decide.", icon: Clock3 },
  { title: "Airport rental", href: "/rentals/airport", detail: "Share the terminal, arrival time, and onward journey for a coverage check.", icon: MapPin },
  { title: "Interstate trips", href: "/rentals/interstate", detail: "Route, dates, driver needs, and eligibility are confirmed first.", icon: Route },
];

export default async function RentalsPage() {
  const vehicles = await listVehicles({ mode: "rent" });
  return (
    <>
      <PageHero
        eyebrow="CAR RENTAL / LAGOS & ABUJA"
        title={<>A better start <span>to the road ahead.</span></>}
        description="Request a car for the day, a longer stay, or a route between cities. Olasco checks the actual vehicle, price, requirements, and availability with you before anything is confirmed."
        aside="Your request is checked by a real person. We confirm the vehicle, price, and requirements before you decide."
        image="/images/fleet-pair.jpg"
        imageAlt="Premium SUV and executive sedan from the Olasco fleet on a Lagos boulevard"
        dark
      >
        <div className="hero-actions page-hero-actions">
          <ButtonLink href="/rentals/booking">Request a rental<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink>
          <WhatsAppLink context="rental" variant="text" className="hero-secondary" icon="whatsapp">Ask about availability</WhatsAppLink>
        </div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rent a car" }]} />
      <section className="search-section search-section--catalog">
        <div className="container"><RentalSearch /></div>
      </section>
      <section className="section section--white">
        <div className="container">
          <SectionHeading eyebrow="CURRENT VEHICLES" title="Verified cars, not placeholder listings." description="Live vehicle cards appear only after make, model, photos, city, availability, and price terms are approved. Until then, request the class and dates you need and we’ll check directly." />
          <VehicleCatalog vehicles={vehicles} mode="rent" />
        </div>
      </section>
      <section className="section section--paper">
        <div className="container">
          <SectionHeading eyebrow="WAYS TO RENT" title="A request that fits more than one kind of trip." description="Daily and extended rentals, airport arrivals, corporate travel, event transport, and interstate trips can all start with the same clear conversation." />
          <div className="rental-service-grid">
            {rentalServices.map(({ title, href, detail, icon: Icon }, index) => <Link className="rental-service-tile" href={href} key={`${title}-${index}`}><span className="rental-service-number">0{index + 1}</span><Icon size={19} aria-hidden="true" /><h3>{title}</h3><p>{detail}</p><span className="inline-arrow-link">Explore service<ArrowUpRight size={14} aria-hidden="true" /></span></Link>)}
          </div>
          <div className="rental-terms-callout">
            <div><p className="eyebrow">BEFORE YOU CONFIRM</p><h2>Know the details before you go.</h2><p>Driver eligibility, required documents, deposits, mileage, insurance, delivery, and route rules can vary. We’ll confirm the terms that apply before you agree.</p></div>
            <ButtonLink href="/rentals/policies" variant="outline">Read rental policies<ArrowUpRight size={14} aria-hidden="true" /></ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
