import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { rentalCategoryPages, rentalServicePages } from "@/content/catalog-pages";
import { getVehicleBySlug, listVehicles } from "@/server/repositories";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { VehicleCatalog } from "@/components/vehicle-catalog";
import { VehicleDetail } from "@/components/vehicle-detail";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

type Params = { slug: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = rentalCategoryPages[slug];
  if (category) return { title: category.metaTitle, description: category.metaDescription, alternates: { canonical: `/rentals/${slug}` } };
  const service = rentalServicePages[slug];
  if (service) return { title: service.metaTitle, description: service.metaDescription, alternates: { canonical: `/rentals/${slug}` } };
  const vehicle = await getVehicleBySlug(slug);
  if (vehicle?.isForRent) return { title: `${vehicle.year} ${vehicle.make} ${vehicle.model} rental`, description: vehicle.description, alternates: { canonical: `/rentals/${slug}` } };
  return { title: "Rental vehicle not found" };
}

export default async function RentalSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = rentalCategoryPages[slug];
  if (category) {
    const vehicles = await listVehicles({ mode: "rent", category: category.category });
    return (
      <>
        <PageHero eyebrow={category.eyebrow} title={<>{category.title}</>} description={category.description} image={category.image} imageAlt={category.imageAlt} aside="Photos, current rates, and stock belong to confirmed listings only. Use the request form to check current options." dark>
          <div className="hero-actions page-hero-actions"><ButtonLink href={`/rentals/booking?category=${category.category}`}>Request {category.category.toLowerCase()} availability<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context="rental" details={{ vehicle: category.category }} variant="text" className="hero-secondary" icon="whatsapp">Ask the team</WhatsAppLink></div>
        </PageHero>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rentals", href: "/rentals" }, { label: category.title }]} />
        <section className="section section--white"><div className="container"><SectionHeading eyebrow="VERIFIED VEHICLES" title="Current, owner-approved options." description="Only listings with approved details and photos appear here. No stock image is presented as an actual Olasco vehicle." /><VehicleCatalog vehicles={vehicles} mode="rent" initialCategory={category.category} /></div></section>
      </>
    );
  }

  const service = rentalServicePages[slug];
  if (service) {
    return (
      <>
        <PageHero eyebrow={service.eyebrow} title={<>{service.title}</>} description={service.description} image={service.image} imageAlt={service.imageAlt} aside="No booking is confirmed and no payment is taken through this request. A representative will discuss details with you." dark>
          <div className="hero-actions page-hero-actions"><ButtonLink href={`/rentals/booking?service=${service.serviceType}`}>Make a rental request<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context={service.serviceType === "INTERSTATE_TRIP" ? "interstate" : "rental"} details={{ service: service.title }} variant="text" className="hero-secondary" icon="whatsapp">Ask a question</WhatsAppLink></div>
        </PageHero>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rentals", href: "/rentals" }, { label: service.title }]} />
        <section className="section section--white"><div className="container service-detail-layout"><div><SectionHeading eyebrow="BEFORE YOU SEND A REQUEST" title="Put the important details on the table." description="A useful quote depends on more than a vehicle class. Share the dates, city, pickup point, route, passenger needs, and whether you want a driver." /><ul className="feature-list">{service.points.map((point) => <li key={point}><ShieldCheck size={15} aria-hidden="true" />{point}</li>)}</ul><ButtonLink href={`/rentals/booking?service=${service.serviceType}`}>Check a rental request<ArrowUpRight size={14} aria-hidden="true" /></ButtonLink></div><aside className="service-detail-aside"><p className="eyebrow">STILL NOT SURE?</p><h2>Start with what you know.</h2><p>Tell us the city and dates. The team can help match a vehicle class and explain the questions that need a firm answer.</p><Link className="service-detail-row" href="/rentals/booking"><CalendarDays size={16} aria-hidden="true" /><span>Rental booking request</span><ArrowUpRight size={14} aria-hidden="true" /></Link><Link className="service-detail-row" href="/locations"><MapPin size={16} aria-hidden="true" /><span>Choose Lagos or Abuja</span><ArrowUpRight size={14} aria-hidden="true" /></Link></aside></div></section>
      </>
    );
  }

  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle || !vehicle.isForRent) notFound();
  return <VehicleDetail vehicle={vehicle} mode="rent" />;
}
