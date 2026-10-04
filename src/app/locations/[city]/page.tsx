import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { businessConfig } from "@/config/business";
import { locationPages } from "@/content/locations";
import { serviceAreaLabels } from "@/content/service-areas";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CityMap } from "@/components/city-map";
import { SectionHeading } from "@/components/section-heading";
import { ServiceAreaList } from "@/components/service-area-list";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ButtonLink } from "@/components/ui";

type Params = { city: string };

export function generateStaticParams() {
  return Object.keys(locationPages).map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city } = await params;
  const location = locationPages[city as keyof typeof locationPages];
  if (!location) return { title: "Location not found" };
  return {
    title: `Car rental and mobility in ${location.name}`,
    description: `Request car rental, vehicle sourcing, airport pickup, chauffeur, business and event transport in ${location.name}. Exact service coverage and pickup points are confirmed with Olasco Autos.`,
    alternates: { canonical: `/locations/${location.slug}` },
  };
}

export default async function LocationDetailPage({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  if (!(city in locationPages)) notFound();
  const location = locationPages[city as keyof typeof locationPages];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: businessConfig.name,
    url: `${businessConfig.publicUrl}/locations/${location.slug}`,
    telephone: businessConfig.phoneE164,
    areaServed: { "@type": "City", name: location.name, containedInPlace: { "@type": "Country", name: "Nigeria" } },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="page-hero page-hero--dark"><div className="container page-hero-inner"><div><p className="eyebrow eyebrow--lime">{location.eyebrow}</p><h1>Make {location.name} <span>the easy part.</span></h1><p className="page-hero-copy">{location.description}</p><div className="hero-actions page-hero-actions"><ButtonLink href={`/rentals/booking?location=${location.name}`}>Request a car<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context="general" details={{ location: location.name }} variant="text" className="hero-secondary" icon="whatsapp">Ask about {location.name}</WhatsAppLink></div></div><div className="page-hero-aside">{location.coverageNote}</div></div></section>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations", href: "/locations" }, { label: location.name }]} />
      <section className="section section--white"><div className="container location-detail"><div className="location-detail-media"><Image src={location.image} alt={location.imageAlt} fill sizes="(max-width: 640px) 92vw, 50vw" /></div><div className="location-detail-copy"><p className="eyebrow">SERVICES IN {location.name.toUpperCase()}</p><h2>Start with the service you need.</h2><p>Share your city, pickup point, dates, route, and vehicle preference. Olasco will confirm exact availability and any service limits directly before accepting your request.</p><ul className="location-service-links">{location.serviceLinks.map((service) => <li key={service.href + service.label}><Link href={service.href}>{service.label}<ArrowUpRight size={13} aria-hidden="true" /></Link></li>)}</ul><div className="location-detail-actions"><a className="button button--outline" href={location.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={14} aria-hidden="true" />Explore {location.name} map</a><WhatsAppLink context="general" details={{ location: location.name }} variant="text" icon="whatsapp">Ask a local representative</WhatsAppLink></div></div></div></section>
      <section className="section section--sand"><div className="container"><SectionHeading eyebrow="COVERAGE MAP / LOCAL GOVERNMENT AREAS" title={`Where journeys in ${location.name} begin.`} description={`Explore the wider ${location.name} area on the map and pick from the major ${location.name === "Lagos" ? "local government areas" : "area councils and districts"}. ${serviceAreaLabels[location.name].helper}`} /><div className="area-map-grid"><div className="area-map-stack"><CityMap city={location.name} mapsUrl={location.mapsUrl} note="This map shows the wider city only. It is not an office pin — the exact pickup or meeting point is agreed with the Olasco team for every request." /></div><ServiceAreaList city={location.name} /></div></div></section>
      <section className="section section--white"><div className="container"><SectionHeading eyebrow="PRACTICAL DETAILS" title="Agree the meeting point before you set off." description={location.serviceNote} /><div className="location-contact-strip"><div><MapPin size={17} aria-hidden="true" /><span><strong>Office address</strong><small>{location.officeAddress || "Not supplied for publication"}</small></span></div><div><Phone size={17} aria-hidden="true" /><span><strong>Customer contact</strong><small>{businessConfig.phoneDisplay}</small></span></div><div><MapPin size={17} aria-hidden="true" /><span><strong>Opening hours</strong><small>{businessConfig.openingHours || "Confirm current hours with the team"}</small></span></div></div></div></section>
    </>
  );
}
