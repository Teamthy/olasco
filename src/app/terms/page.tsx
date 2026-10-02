import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Website terms",
  description: "Draft website terms for Olasco Autos. Business owner and legal approval is required before production launch.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL / TERMS" title={<>A request is a <span>conversation starter.</span></>} description="These working notes explain how this website’s requests are intended to work. The final terms must be reviewed and approved by Olasco Autos before launch." aside="Draft for owner and legal review. Service, payment, and cancellation terms are not finalized here." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <section className="section section--white"><article className="container prose">
        <div className="draft-notice"><strong>Owner action required before launch.</strong> Add Olasco’s registered business identity, governing law/jurisdiction, approved contract terms, limitation wording, and complaint/escalation procedure.</div>
        <h2>Information and requests</h2><p>Information on this website helps customers make a rental, purchase, pickup, or contact request. A submitted request is not an acceptance, confirmed booking, vehicle reservation, sale contract, or quote unless Olasco expressly confirms those terms with the customer.</p>
        <h2>Availability, prices, and service coverage</h2><p>Vehicle availability, photographs, prices, deposits, taxes, fees, service areas, airport meeting points, route eligibility, driver options, and capacity must be checked directly for the requested vehicle and itinerary. No online payment is taken by this website.</p>
        <h2>Vehicle purchase and handover</h2><p>Any inspection, vehicle condition, mileage, ownership documents, payment, financing, delivery, warranty, trade-in, and handover terms must be verified and agreed for the particular vehicle before a customer commits.</p>
        <h2>Use of the website</h2><p>Customers should provide accurate information and should not submit unlawful, abusive, or misleading content. Olasco’s approved legal terms, security process, and complaint route must replace this draft before launch.</p>
      </article></section>
    </>
  );
}
