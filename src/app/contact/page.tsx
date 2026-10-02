import type { Metadata } from "next";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { businessConfig } from "@/config/business";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Contact Olasco Autos",
  description: "Contact Olasco Autos about car rental, cars for sale, airport pickup, chauffeur, corporate trips, events and conference transport in Lagos and Abuja.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="CONTACT / LAGOS & ABUJA" title={<>Tell us what <span>you need.</span></>} description="Choose WhatsApp for the quickest human handoff, call the customer number, or send a note below. Include your city, dates, and service so the team can give you a useful answer." aside="Your message is saved securely when production storage is configured. Admin notifications are sent only through providers Olasco has configured." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <section className="section section--white"><div className="container contact-page-grid">
        <div className="contact-aside">
          <p className="eyebrow">A REAL PERSON, NOT A DEAD END</p>
          <h2>Keep the conversation moving.</h2>
          <p>Olasco is here for rental, sales, airport, chauffeur, corporate, event, and interstate enquiries in Lagos and Abuja.</p>
          <div className="contact-options">
            <a className="contact-option" href={`tel:${businessConfig.phoneE164}`}><Phone size={18} aria-hidden="true" /><span>Call / customer line</span><strong>{businessConfig.phoneDisplay}</strong></a>
            <WhatsAppLink className="contact-option contact-option--link" context="general" variant="outline" icon="whatsapp"><span>WhatsApp / fastest route</span><strong>Start a direct conversation</strong><ArrowUpRight size={14} aria-hidden="true" /></WhatsAppLink>
            {businessConfig.email ? <a className="contact-option" href={`mailto:${businessConfig.email}`}><Mail size={18} aria-hidden="true" /><span>Email</span><strong>{businessConfig.email}</strong></a> : <div className="contact-option contact-option--static"><Mail size={18} aria-hidden="true" /><span>Email address</span><strong>Not supplied for publication</strong></div>}
          </div>
          <div className="contact-meta-grid">
            {Object.values(businessConfig.locations).map((location) => <div className="map-note" key={location.slug}><MapPin size={18} aria-hidden="true" /><h2>{location.name}</h2><p>Office address and business hours are not yet confirmed. Agree your meeting point directly with the team.</p><a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">Open city map<ArrowUpRight size={13} aria-hidden="true" /></a></div>)}
          </div>
          <div className="hours-note"><Clock3 size={16} aria-hidden="true" /><p><strong>Hours</strong><br />Please confirm current business hours with Olasco. They have not been supplied for publication.</p></div>
        </div>
        <ContactForm />
      </div></section>
    </>
  );
}
