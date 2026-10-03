import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Handshake, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "About Olasco Autos",
  description:
    "Olasco Autos helps people in Lagos and Abuja arrange car rental, vehicle sourcing, airport pickup, and planned journeys with direct human support.",
  alternates: { canonical: "/about" },
};

const priorities = [
  {
    number: "01",
    title: "Useful details",
    text: "Dates, city, route, and vehicle class help us check what is genuinely possible.",
  },
  {
    number: "02",
    title: "Clear next steps",
    text: "We explain availability, price, eligibility, and terms before anything is confirmed.",
  },
  {
    number: "03",
    title: "A human handoff",
    text: "Your request reference and WhatsApp conversation help keep the details together.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT OLASCO AUTOS"
        title={
          <>
            Mobility, <span>made personal.</span>
          </>
        }
        description="From a day’s rental to an airport pickup or a vehicle you’re ready to buy, Olasco helps you sort the details with one person in Lagos or Abuja."
        image="/images/corporate-travel.jpg"
        imageAlt="Business travellers walking towards a chauffeured SUV in Lagos"
        dark
      >
        <div className="hero-actions page-hero-actions">
          <ButtonLink href="/contact">
            Talk with Olasco
            <ArrowUpRight size={15} aria-hidden="true" />
          </ButtonLink>
          <WhatsAppLink context="general" variant="text" className="hero-secondary" icon="whatsapp">
            Start on WhatsApp
          </WhatsAppLink>
        </div>
      </PageHero>

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <section className="section section--white">
        <div className="container about-story">
          <div className="about-story-photo">
            <Image
              src="/images/corporate-travel.jpg"
              alt="Business travellers arriving at a chauffeured SUV in Lagos"
              fill
              quality={90}
              sizes="(max-width: 640px) 92vw, 48vw"
            />
            <span className="split-note">Arrivals, handled</span>
          </div>
          <div className="about-story-copy">
            <p className="eyebrow">THE OLASCO APPROACH</p>
            <h2>Less searching. More useful answers.</h2>
            <p>
              Some journeys need a vehicle for a day. Others need a longer rental, a car to own, an airport arrival, or several people moved
              on a tight schedule. Olasco helps you start with the details that make a real quote possible.
            </p>
            <p>
              Send a request, get a reference, and continue the conversation with a member of the team. Availability and terms are confirmed
              with you directly.
            </p>
            <div className="about-facts">
              <div>
                <MapPin size={17} aria-hidden="true" />
                <span><strong>Two city starts</strong><small>Lagos and Abuja</small></span>
              </div>
              <div>
                <MessageCircle size={17} aria-hidden="true" />
                <span><strong>Human follow-through</strong><small>WhatsApp-first support</small></span>
              </div>
              <div>
                <Handshake size={17} aria-hidden="true" />
                <span><strong>Request, then confirm</strong><small>No online payment flow</small></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT WE OPTIMIZE FOR"
            title="A better conversation starts with a better request."
            dark
          />
          <div className="trust-grid trust-grid--dark">
            {priorities.map((priority) => (
              <article className="trust-item" key={priority.number}>
                <span>{priority.number}</span>
                <h3>{priority.title}</h3>
                <p>{priority.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
