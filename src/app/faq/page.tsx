import type { Metadata } from "next";
import { FAQAccordion } from "@/components/faq-accordion";
import { FAQStructuredData } from "@/components/faq-schema";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Car rental, purchase and pickup FAQs",
  description: "Answers about rental requirements, pricing, vehicle purchase, inspection and handover, airport pickup, chauffeur, corporate travel, and request confirmations.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <>
      <FAQStructuredData />
      <PageHero eyebrow="HELP / FREQUENT QUESTIONS" title={<>A few clear answers <span>before you start.</span></>} description="Find the questions customers often ask about rentals, buying, pickup, and what happens after a request. Where Olasco has not supplied a firm policy, we say so and point you to the team." aside="Policy details are intentionally not invented. Always ask for the terms that apply to your specific vehicle and trip." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />
      <section className="section section--white"><div className="container faq-layout"><div><SectionHeading eyebrow="GOOD TO KNOW" title="The practical details." description="If a specific policy is not written here, ask Olasco to confirm it before you accept a booking or purchase." /><ButtonLink href="/contact" variant="outline">Ask another question<ArrowUpRight size={14} aria-hidden="true" /></ButtonLink></div><FAQAccordion /></div></section>
    </>
  );
}
