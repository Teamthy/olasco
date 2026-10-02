import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, FileSearch, HandCoins, ShieldCheck } from "lucide-react";
import { listVehicles } from "@/server/repositories";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { VehicleCatalog } from "@/components/vehicle-catalog";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Cars for sale in Lagos and Abuja",
  description: "Ask Olasco Autos about verified vehicles for sale in Lagos and Abuja. Request a purchase consultation, inspection, pricing, and handover details.",
  alternates: { canonical: "/cars" },
};

const buyingSteps = [
  { title: "Tell us what you want", text: "Share your preferred model, class, budget, and city.", icon: FileSearch },
  { title: "Review a real option", text: "Ask for verified current details, photographs, and inspection arrangements.", icon: BadgeCheck },
  { title: "Confirm the handover", text: "Agree price, documentation, payment, and ownership-transfer steps before committing.", icon: ShieldCheck },
];

export default async function CarsPage() {
  const vehicles = await listVehicles({ mode: "sale" });
  return (
    <>
      <PageHero
        eyebrow="CARS FOR SALE / NIGERIA"
        title={<>Find the right car.<br /><span>Then make it yours.</span></>}
        description="Looking for your next vehicle? Tell Olasco the model, class, budget, and city. The team will share verified current options and discuss inspection and handover details for the specific car."
        aside={<>No invented inventory, mileage, or asking prices. Only verified listings will be published here.</>}
        image="/images/executive-sedan.jpg"
        imageAlt="Black executive sedan outside a glass office building at dusk"
        dark
      >
        <div className="hero-actions page-hero-actions">
          <ButtonLink href="/cars/consultation">Request a consultation<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink>
          <WhatsAppLink context="purchase" variant="text" className="hero-secondary" icon="whatsapp">Talk to sales</WhatsAppLink>
        </div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cars for sale" }]} />
      <section className="section section--white">
        <div className="container">
          <SectionHeading eyebrow="VERIFIED INVENTORY" title="Only owner-approved cars belong here." description="A live listing needs the exact vehicle details, approved photos, current city, availability rule, and clear price or quote terms. We keep the catalog honest while the team confirms the current stock." />
          <VehicleCatalog vehicles={vehicles} mode="sale" />
        </div>
      </section>
      <section className="section section--sand">
        <div className="container">
          <SectionHeading eyebrow="A THOUGHTFUL PURCHASE" title="Make the important checks before you commit." description="The right conversation should cover the specific vehicle and the steps from inspection to handover — not just a headline price." />
          <div className="buying-steps">
            {buyingSteps.map(({ title, text, icon: Icon }, index) => <article className="buying-step" key={title}><span>0{index + 1}</span><Icon size={19} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <div className="split-cta-row"><div><h2>Already have a car to sell or trade?</h2><p>Share its make, model, year, city, condition, and a way to reach you. Trade-in availability and terms are confirmed by the team.</p></div><Link className="button button--secondary" href="/cars/sell-trade-in">Start a sell / trade-in enquiry<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section>
      <section className="section section--paper">
        <div className="container purchase-policy-note"><HandCoins size={22} aria-hidden="true" /><div><p className="eyebrow">PRICE / DOCUMENTS / HANDOVER</p><h2>Ask for the complete picture.</h2><p>Financing, warranty, deposits, vehicle verification, payment, and ownership-transfer terms have not been confirmed for publication. Ask Olasco to explain the approved steps for a specific vehicle before making a commitment.</p></div><ButtonLink href="/cars/consultation" variant="outline">Book a consultation<ArrowUpRight size={14} aria-hidden="true" /></ButtonLink></div>
      </section>
    </>
  );
}
