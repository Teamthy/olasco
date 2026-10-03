import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { businessConfig } from "@/config/business";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppGlyph } from "@/components/whatsapp-glyph";
import { WhatsAppLink } from "@/components/whatsapp-link";

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
      <section className="contact-hero">
        <div className="contact-hero-bg" aria-hidden="true">
          <Image
            src="/images/lagos-city.jpg"
            alt=""
            fill
            priority
            quality={92}
            sizes="100vw"
          />
        </div>
        <div className="container contact-hero-inner">
          <div className="contact-hero-copy">
            <p className="eyebrow eyebrow--lime">CONTACT / LAGOS & ABUJA</p>
            <h1>
              Let’s plan a <span>better journey.</span>
            </h1>
            <p>
              Tell us where you’re going and what you need. A real person from Olasco will help you with availability, clear pricing, and
              the next steps.
            </p>
            <div className="contact-hero-actions">
              <WhatsAppLink context="general" variant="primary" icon="whatsapp">
                Chat with Olasco
              </WhatsAppLink>
              <a className="button button--outline contact-hero-call" href={`tel:${businessConfig.phoneE164}`}>
                Call {businessConfig.phoneDisplay}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <aside className="contact-hero-card">
            <span className="contact-hero-card-icon" aria-hidden="true"><ShieldCheck size={22} /></span>
            <p className="contact-hero-card-kicker">DIRECT, PERSONAL SUPPORT</p>
            <h2>One clear conversation gets you moving.</h2>
            <p>Share your city, dates, and route. We’ll check what is available and explain the terms before you decide.</p>
            <div className="contact-hero-card-foot">
              <MapPin size={16} aria-hidden="true" />
              <span>Serving Lagos and Abuja</span>
            </div>
          </aside>
        </div>
      </section>

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="section section--paper contact-main-section">
        <div className="container">
          <SectionHeading
            eyebrow="REACH OUR TEAM"
            title={
              <>
                How can we <span>help you today?</span>
              </>
            }
            description="Choose the quickest way to get in touch, or send a message and we’ll get back to you with the details you need."
          />

          <div className="contact-layout">
            <div className="contact-column">
              <article className="contact-whatsapp-card">
                <div className="contact-whatsapp-heading">
                  <span className="contact-whatsapp-icon" aria-hidden="true"><WhatsAppGlyph size={25} /></span>
                  <div>
                    <span className="contact-whatsapp-status"><span aria-hidden="true" />FASTEST WAY TO REACH US</span>
                    <h2>Chat with Olasco</h2>
                  </div>
                </div>
                <p>Open a direct WhatsApp conversation with our team. Your message starts with a simple greeting — add the details when you’re ready.</p>
                <WhatsAppLink context="general" variant="primary" icon="whatsapp" className="contact-whatsapp-button">
                  Start a WhatsApp chat
                  <ArrowUpRight size={15} aria-hidden="true" />
                </WhatsAppLink>
                <p className="contact-whatsapp-number">WhatsApp: <strong>{businessConfig.phoneDisplay}</strong></p>
              </article>

              <div className="contact-detail-grid contact-channel-grid">
                <a className="contact-detail" href={`tel:${businessConfig.phoneE164}`}>
                  <span className="contact-detail-icon" aria-hidden="true"><Phone size={17} /></span>
                  <span className="contact-detail-label">Call the customer line</span>
                  <strong>{businessConfig.phoneDisplay}</strong>
                </a>
                {businessConfig.email ? (
                  <a className="contact-detail" href={`mailto:${businessConfig.email}`}>
                    <span className="contact-detail-icon" aria-hidden="true"><Mail size={17} /></span>
                    <span className="contact-detail-label">Email</span>
                    <strong>{businessConfig.email}</strong>
                  </a>
                ) : (
                  <div className="contact-detail contact-detail--static">
                    <span className="contact-detail-icon" aria-hidden="true"><Mail size={17} /></span>
                    <span className="contact-detail-label">Email</span>
                    <strong>Ask us on WhatsApp</strong>
                  </div>
                )}
              </div>

              <div className="contact-block">
                <p className="eyebrow">WHAT WE CAN HELP WITH</p>
                <ul className="contact-service-list">
                  {services.map((service) => (
                    <li key={service}><span aria-hidden="true"><ArrowRight size={14} /></span>{service}</li>
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
                      <p>Pickup points and coverage are confirmed for each request.</p>
                      <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                        View {location.name} map <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              <p className="contact-safety-note">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Never send payments, ID documents, or card details in a chat.</span>
              </p>
            </div>

            <div className="contact-form-column">
              <ContactForm />
              <p className="contact-form-note">Your message is saved so the team has context when they reply. You can also reach us directly on WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
