import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Rental search results",
  description: "Review your rental search details and send an availability request to Olasco Autos for a vehicle in Lagos or Abuja.",
  robots: { index: false, follow: true },
};

export default async function RentalSearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const city = query.location === "Abuja" || query.location === "abuja" ? "Abuja" : "Lagos";
  const category = typeof query.category === "string" ? query.category : "SUV";
  const pickupDate = typeof query.pickupDate === "string" ? query.pickupDate : "";
  const returnDate = typeof query.returnDate === "string" ? query.returnDate : "";
  const bookingQuery = new URLSearchParams({ location: city, category, pickupDate, returnDate }).toString();
  return (
    <>
      <PageHero eyebrow="YOUR RENTAL SEARCH" title={<>One quick check <span>before the trip.</span></>} description="No unverified car is returned as a match. Share these preferences with Olasco and the team will confirm a real vehicle, current rate, and requirements." aside="Search preferences help qualify the request; availability is checked directly." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rentals", href: "/rentals" }, { label: "Search" }]} />
      <section className="section section--white"><div className="container rental-search-results">
        <div className="search-summary"><p className="eyebrow">REQUEST PREFERENCES</p><h2>{category} in {city}</h2><div><span><CalendarDays size={14} aria-hidden="true" />{pickupDate || "Pickup date to confirm"} — {returnDate || "Return date to confirm"}</span><span><MapPin size={14} aria-hidden="true" />{city}, Nigeria</span></div><ButtonLink href={`/rentals/booking?${bookingQuery}`}>Check availability<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink></div>
        <EmptyState title="Let’s check the real options." description="The public catalog is kept empty until Olasco supplies verified vehicle records and approved photos. Send this city, class, and date range as a request; the team can confirm current options." primaryHref={`/rentals/booking?${bookingQuery}`} primaryLabel="Send these preferences" context="rental" details={{ location: city, vehicle: category, pickupDate, returnDate }} />
        <div className="search-update"><div><h3>Change something?</h3><p>Update the city, vehicle class, or date range before sending the request.</p></div><Link href="/rentals">Edit search<ArrowUpRight size={13} aria-hidden="true" /></Link></div>
      </div></section>
    </>
  );
}
