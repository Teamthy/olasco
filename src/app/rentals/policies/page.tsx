import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Rental requirements and policies",
  description: "Review which rental policy details Olasco Autos confirms before a request becomes a reservation. Owner approval is required for final policy wording.",
  alternates: { canonical: "/rentals/policies" },
};

const policyTopics = [
  { title: "Driver eligibility and documents", detail: "Ask about minimum driver age, licence validity, identification, additional drivers, and any documents required for international visitors." },
  { title: "Deposit, insurance, and responsibility", detail: "Before accepting, request the deposit or security-hold amount, insurance details, excess/damage responsibility, and payment timing for the specific vehicle." },
  { title: "Mileage, fuel, and vehicle return", detail: "Confirm mileage allowance, fuel policy, inspection/check-in, cleaning expectations, late return, and any extension charges." },
  { title: "Pickup, delivery, and driver options", detail: "Ask whether your address, airport, or return point can be served, whether a driver can be arranged, and what delivery or chauffeur charges apply." },
  { title: "Cancellation and changes", detail: "Cancellation, refund, date-change, extension, and no-show rules have not been supplied. Request the written terms before committing." },
  { title: "Airport, corporate, event, and interstate use", detail: "Confirm airport meeting points, waiting time, route eligibility, corporate/event capacity, interstate approval, driver availability, and fare before accepting." },
];

export default function RentalPoliciesPage() {
  return (
    <>
      <PageHero eyebrow="RENTAL REQUIREMENTS / POLICIES" title={<>Understand the terms <span>before you say yes.</span></>} description="Rental requirements and operating rules have not been supplied in full. This page lists the information Olasco should confirm for your exact vehicle, dates, city, and route." aside="No minimum age, deposit, mileage allowance, insurance promise, cancellation rule, or fee is invented here." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Rent a car", href: "/rentals" }, { label: "Rental policies" }]} />
      <section className="section section--white"><div className="container"><SectionHeading eyebrow="OWNER TERMS TO CONFIRM" title="Ask these questions for your specific request." description="The final policy wording should be approved by Olasco and shown before a customer accepts a booking." /><div className="policy-topic-grid">{policyTopics.map((item, index) => <article className="policy-topic" key={item.title}><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.detail}</p></article>)}</div><div className="policy-cta"><p>Need an answer now? Share your city, dates, and preferred class with Olasco.</p><ButtonLink href="/rentals/booking">Start a rental request<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink></div></div></section>
    </>
  );
}
