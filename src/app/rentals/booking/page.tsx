import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, CircleCheck, MapPin } from "lucide-react";
import type { RentalServiceType } from "@/domain/types";
import { getVehicleBySlug } from "@/server/repositories";
import { BookingForm } from "@/components/booking-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Rental booking request",
  description: "Request a car rental in Lagos or Abuja. Choose dates, location, pickup point and vehicle class, then receive a booking reference and continue with Olasco on WhatsApp.",
  alternates: { canonical: "/rentals/booking" },
};

const serviceTypes = new Set<RentalServiceType>(["DAILY_RENTAL", "LONG_TERM_RENTAL", "INTERSTATE_TRIP"]);
const categoryLookup: Record<string, string> = { SUV: "SUV", SEDAN: "Sedan", EXECUTIVE: "Executive sedan", LUXURY: "Luxury vehicle", VAN: "People carrier" };

export default async function RentalBookingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const location = query.location === "Abuja" || query.location === "abuja" ? "Abuja" : "Lagos";
  const rawService = typeof query.service === "string" ? query.service as RentalServiceType : "DAILY_RENTAL";
  const serviceType = serviceTypes.has(rawService) ? rawService : "DAILY_RENTAL";
  const rawCategory = typeof query.category === "string" ? query.category.toUpperCase() : "SUV";
  const category = categoryLookup[rawCategory] ? rawCategory : "SUV";
  const pickupDate = typeof query.pickupDate === "string" ? query.pickupDate : "";
  const returnDate = typeof query.returnDate === "string" ? query.returnDate : "";
  const vehicleSlug = typeof query.vehicle === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(query.vehicle) ? query.vehicle : "";
  const vehicle = vehicleSlug ? await getVehicleBySlug(vehicleSlug) : null;
  if (vehicleSlug && vehicle && !vehicle.isForRent) notFound();
  return (
    <>
      <PageHero eyebrow="RENTAL REQUEST / LAGOS & ABUJA" title={<>A few details. <span>A person for the rest.</span></>} description="Let us know the vehicle class, city, dates, and pickup point. Olasco will check actual availability and current terms before anything is confirmed." aside="Three short steps. No payment. Your reference helps the team find your request in the conversation." dark>
        <div className="hero-actions page-hero-actions"><WhatsAppLink context="rental" variant="text" className="hero-secondary" icon="whatsapp">Ask before you book<ArrowUpRight size={14} aria-hidden="true" /></WhatsAppLink></div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rentals", href: "/rentals" }, { label: "Rental request" }]} />
      <section className="section section--paper"><div className="container"><BookingForm initialLocation={location} initialCategory={categoryLookup[category] || category} initialPickupDate={pickupDate} initialReturnDate={returnDate} initialVehicleSlug={vehicle ? vehicle.slug : ""} initialVehicleName={vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : ""} initialService={serviceType} /></div></section>
      <section className="request-footnote"><div className="container request-footnote-inner"><div><p className="eyebrow">NO ONLINE PAYMENT</p><h2>Your request stays a request until the team confirms it.</h2><p>Availability, exact model, price, driver, deposits, mileage, delivery, and cancellation terms are discussed directly before a reservation is confirmed.</p></div><div className="request-footnote-stamps"><span><CircleCheck size={15} aria-hidden="true" />Reference number</span><span><CalendarDays size={15} aria-hidden="true" />Date validation</span><span><MapPin size={15} aria-hidden="true" />Lagos / Abuja</span></div></div></section>
    </>
  );
}
