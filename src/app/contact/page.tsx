import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { businessConfig } from "@/config/business";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { WhatsAppPanel } from "@/components/whatsapp-panel";

export const metadata: Metadata = {
  title: "Contact Olasco Autos",
  description:
    "Chat with Olasco Autos on WhatsApp, call the customer line, or send a message about car rental, cars for sale, airport pickup, chauffeur, corporate and event travel in Lagos and Abuja.",
  alternates: { canonical: "/contact" },
};

const services = [
  "Car rental — daily, weekly, long-term",
  "Cars for sale and purchase advice",
  "Airport pickup and city transfers",
  "Chauffeur, corporate and event travel",
  "Interstate trips and route checks",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT / LAGOS & ABUJA"
        title={
          <>
            Talk to Olasco <span>directly.</span>
          </>
        }
        description="WhatsApp is the fastest way to reach a person. Call the customer line, or send a message and the team will reply with clear answers on availability, rates, and requirements."
        image="/images/lagos-city.jpg"
        imageAlt="Lagos skyline and the Lekki-Ikoyi Link Bridge at blue hour"
        aside="Office address and opening hours have not been supplied for publication. Meeting points are agreed directly with the team."
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="section section--white">
        <div className="container contact-layout">
          <div className="contact-column">
            <WhatsAppPanel />

            <div className="contact-detail-grid">
              <a className="contact-detail" href={`tel:${businessConfig.phoneE164}`}>
                <span className="contact-detail-icon" aria-hidden="true">
                  <Phone size={17} />
                </span>
                <span className="contact-detail-label">Call the customer line</span>
                <strong>{businessConfig.phoneDisplay}</strong>
              </a>
              {businessConfig.email ? (
                <a className="contact-detail" href={`mailto:${businessConfig.email}`}>
                  <span className="contact-detail-icon" aria-hidden="true">
                    <Mail size={17} />
                  </span>
                  <span className="contact-detail-label">Email</span>
                  <strong>{businessConfig.email}</strong>
                </a>
              ) : (
                <div className="contact-detail contact-detail--static">
                  <span className="contact-detail-icon" aria-hidden="true">
                    <Mail size={17} />
                  </span>
                  <span className="contact-detail-label">Email</span>
                  <strong>Ask on WhatsApp for the current address</strong>
                </div>
              )}
            </div>

            <div className="contact-block">
              <p className="eyebrow">WHAT WE ARRANGE</p>
              <ul className="contact-service-list">
                {services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>

            <div className="contact-block">
              <p className="eyebrow">WHERE WE OPERATE</p>
              <div className="contact-city-grid">
                {Object.values(businessConfig.locations).map((location) => (
                  <article className="contact-city" key={location.slug}>
                    <span className="contact-city-head">
                      <MapPin size={15} aria-hidden="true" />
                      <strong>{location.name}</strong>
                    </span>
                    <p>Pickup points, coverage, and meeting locations are confirmed per request before anything is agreed.</p>
                    <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                      Open {location.name} map
                    </a>
                  </article>
                ))}
              </div>
            </div>

            <p className="contact-hours">
              <Clock3 size={15} aria-hidden="true" />
              <span>
                <strong>Business hours</strong> have not been supplied for publication. Reply times vary, so a saved message is the safest
                way to reach the team outside working hours.
              </span>
            </p>
          </div>

          <div className="contact-form-column">
            <ContactForm />
            <p className="contact-form-note">{businessConfig.locations.lagos.coverageNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
