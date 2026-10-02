import type { Metadata } from "next";
import { ArrowUpRight, Clock3, MapPin, Users } from "lucide-react";
import type { PickupServiceType } from "@/domain/types";
import { PickupRequestForm } from "@/components/pickup-request-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Request an airport pickup or mobility service",
  description: "Send a pickup request for airport arrivals, chauffeur, city transfer, corporate trips, events, conferences, or an interstate itinerary in Lagos or Abuja.",
  alternates: { canonical: "/pickup/booking" },
};

const pickupTypes = new Set<PickupServiceType>(["AIRPORT_PICKUP", "CHAUFFEUR", "CORPORATE_TRAVEL", "EVENT_TRANSPORT", "INTERSTATE_TRIP", "CITY_TRANSFER"]);

export default async function PickupBookingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const requested = typeof query.serviceType === "string" ? query.serviceType as PickupServiceType : "AIRPORT_PICKUP";
  const initialService = pickupTypes.has(requested) ? requested : "AIRPORT_PICKUP";
  const city = query.city === "Abuja" || query.city === "abuja" ? "Abuja" : "Lagos";
  return (
    <>
      <PageHero eyebrow="PICKUP REQUEST / LAGOS & ABUJA" title={<>Plan the pickup. <span>Keep the day moving.</span></>} description="Send the route, timing, passenger count, and contact details. Olasco checks service coverage, capacity, waiting terms, and the quote before confirming." aside="This request is not a confirmed transfer or fare. You will receive a reference and can continue with the team on WhatsApp." dark>
        <div className="hero-actions page-hero-actions"><WhatsAppLink context="pickup" variant="text" className="hero-secondary" icon="whatsapp">Ask a question first<ArrowUpRight size={14} aria-hidden="true" /></WhatsAppLink></div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pickup & travel", href: "/pickup" }, { label: "Request a pickup" }]} />
      <section className="section section--white"><div className="container form-layout"><PickupRequestForm initialCity={city} initialService={initialService} /><aside className="form-aside"><p className="eyebrow">ITINERARY CHECK</p><h2>Help us plan around the real route.</h2><p>Pickup, airport, corporate, event, and interstate journeys can need different information. Share as much of the schedule as you already know.</p><ul className="form-aside-list"><li><MapPin size={14} aria-hidden="true" />Precise pickup and destination</li><li><Clock3 size={14} aria-hidden="true" />Date, time, and any end date</li><li><Users size={14} aria-hidden="true" />Passenger, luggage, and event notes</li></ul></aside></div></section>
    </>
  );
}
