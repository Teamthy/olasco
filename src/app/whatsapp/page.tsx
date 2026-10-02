import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { businessConfig } from "@/config/business";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Contact Olasco Autos on WhatsApp",
  description: "Start a direct WhatsApp conversation with Olasco Autos about car rental, vehicle purchase, airport pickup, corporate travel, events, and interstate requests.",
  alternates: { canonical: "/whatsapp" },
};

export default function WhatsAppPage() {
  return (
    <>
      <PageHero eyebrow="DIRECT / HUMAN / WHATSAPP" title={<>One conversation <span>can start the journey.</span></>} description="Tell Olasco what you need and where you are travelling. A representative can check current details and guide you through the next step." aside="WhatsApp is the human handoff, not the booking database. Online requests are saved first and receive a reference." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "WhatsApp" }]} />
      <section className="section section--white"><div className="container whatsapp-page-card"><span className="whatsapp-page-icon"><MessageCircle size={22} aria-hidden="true" /></span><p className="eyebrow">OLASCO AUTOS / CUSTOMER SUPPORT</p><h2>What would you like to arrange?</h2><p>Start a chat with a contextual message. You can also call the customer line if a voice conversation works better.</p><div className="confirmation-actions"><WhatsAppLink context="general" variant="primary" icon="whatsapp">Open WhatsApp<ArrowUpRight size={14} aria-hidden="true" /></WhatsAppLink><a className="button button--outline" href={`tel:${businessConfig.phoneE164}`}><Phone size={14} aria-hidden="true" />Call {businessConfig.phoneDisplay}</a></div></div></section>
    </>
  );
}
