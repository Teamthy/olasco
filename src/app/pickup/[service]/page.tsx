import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, MapPin, ShieldCheck, Users } from "lucide-react";
import { pickupServices } from "@/content/services";
import type { PickupServiceType } from "@/domain/types";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PickupRequestForm } from "@/components/pickup-request-form";
import { WhatsAppLink } from "@/components/whatsapp-link";

 type Params = { service: string };

const contexts: Record<string, string> = {
  airport: "airport pickup",
  chauffeur: "chauffeur service",
  corporate: "corporate / business travel",
  events: "event / conference transport",
  interstate: "interstate trip",
  "city-transfer": "city transfer",
};

export function generateStaticParams() {
  return pickupServices.map((item) => ({ service: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service } = await params;
  const entry = pickupServices.find((item) => item.slug === service);
  if (!entry) return { title: "Pickup service not found" };
  return {
    title: entry.title.replace(/[.!]$/, ""),
    description: entry.description,
    alternates: { canonical: `/pickup/${service}` },
  };
}

export default async function PickupServicePage({ params }: { params: Promise<Params> }) {
  const { service } = await params;
  const entry = pickupServices.find((item) => item.slug === service);
  if (!entry) notFound();
  return (
    <>
      <PageHero eyebrow={entry.eyebrow} title={<>{entry.title}</>} description={entry.description} image={entry.image} imageAlt={entry.imageAlt} aside="Service areas, vehicle capacity, driver availability, airport meeting points, waiting terms, and prices are confirmed with Olasco for the specific itinerary." dark>
        <div className="hero-actions page-hero-actions"><a className="button button--primary" href="#request-form">Send an itinerary<ArrowUpRight size={15} aria-hidden="true" /></a><WhatsAppLink context={entry.context} details={{ service: entry.title }} variant="text" className="hero-secondary" icon="whatsapp">Ask about {contexts[service] || "this service"}</WhatsAppLink></div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pickup & travel", href: "/pickup" }, { label: entry.eyebrow }]} />
      <section className="section section--white"><div className="container pickup-detail-grid">
        <div className="pickup-detail-content">
          <p className="eyebrow">BEFORE WE CONFIRM</p>
          <h2>Make the itinerary easy to review.</h2>
          <p>{entry.description}</p>
          <ul className="feature-list">{entry.details.map((detail) => <li key={detail}><ShieldCheck size={15} aria-hidden="true" />{detail}</li>)}</ul>
          <div className="pickup-detail-note"><div><MapPin size={16} aria-hidden="true" /><span>Pickup and destination</span></div><div><CalendarDays size={16} aria-hidden="true" /><span>Date and time</span></div><div><Users size={16} aria-hidden="true" /><span>Passenger / luggage count</span></div></div>
        </div>
        <aside className="pickup-detail-aside"><p className="eyebrow">DIRECT SUPPORT</p><h2>A clear reply starts with clear details.</h2><p>Send the request below or continue on WhatsApp with a service-specific message. A representative will confirm whether the route and schedule can be covered.</p><WhatsAppLink context={entry.context} details={{ service: entry.title }} variant="outline" icon="whatsapp">Chat about this service</WhatsAppLink></aside>
      </div></section>
      <section id="request-form" className="section section--sand"><div className="container pickup-form-container"><div><p className="eyebrow">PICKUP REQUEST / {entry.eyebrow}</p><h2>Start the conversation.</h2><p>Your request receives a reference. It is not a confirmed booking or fare.</p></div><PickupRequestForm initialService={entry.serviceType as PickupServiceType} /></div></section>
    </>
  );
}
