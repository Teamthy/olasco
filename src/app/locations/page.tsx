import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { locationPages } from "@/content/locations";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { LocationCard } from "@/components/location-card";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Lagos and Abuja service areas",
  description: "Find Olasco Autos service information for Lagos and Abuja. Pickup points, office details, opening hours, and route coverage are confirmed directly while owner details are being finalized.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero eyebrow="LOCATIONS / NIGERIA" title={<>One contact. <span>Two city starts.</span></>} description="Olasco Autos operates primarily in Lagos and Abuja. Tell us where your trip begins; the team will confirm whether your pickup point, destination, and service can be covered."
        image="/images/fleet-lineup.jpg"
        imageAlt="Black SUV, executive sedan and compact city car parked together"
        aside="Office addresses, business hours, and exact coverage areas have not been supplied, so they are not guessed or mapped as Olasco premises." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
      <section className="section section--white">
        <div className="container">
          <SectionHeading eyebrow="CITY SERVICE AREAS" title="Choose the city your journey starts in." description="Use the city map to explore the wider area, then ask Olasco to confirm an exact meeting point for your dates." />
          <div className="location-grid"><LocationCard location={locationPages.lagos} /><LocationCard location={locationPages.abuja} /></div>
        </div>
      </section>
      <section className="section section--sand">
        <div className="container location-info-row"><MapPin size={22} aria-hidden="true" /><div><p className="eyebrow">MEETING POINTS / OFFICE DETAILS</p><h2>We won’t send you to an unverified address.</h2><p>Public office addresses, hours, and map pins will be added once approved. For now, pickup and drop-off points are agreed with the representative before the request is confirmed.</p></div></div>
      </section>
    </>
  );
}
