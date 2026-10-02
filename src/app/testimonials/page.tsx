import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Customer stories",
  description: "Olasco Autos publishes customer stories only with permission. Contact the team directly for current service details in Lagos and Abuja.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="CUSTOMER STORIES / TRUST" title={<>Trust should be <span>earned in the open.</span></>} description="Customer feedback matters. We will publish real comments only when the customer has approved the wording and publication. No names, ratings, or quotes are fabricated for this page." aside="No testimonials, ratings, awards, or certifications have been supplied for publication." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Customer stories" }]} />
      <section className="section section--white"><div className="container"><div className="story-page-card"><span className="empty-state-icon"><ShieldCheck size={20} aria-hidden="true" /></span><p className="eyebrow">VERIFIED / WITH PERMISSION</p><h2>We’ll add stories when they’re ready to be shared.</h2><p>For now, ask the Olasco team about current availability, policies, vehicle details, and the next step for your journey.</p><WhatsAppLink context="general" variant="primary" icon="whatsapp">Talk to Olasco Autos</WhatsAppLink></div></div></section>
    </>
  );
}
