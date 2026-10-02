import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Handshake, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "About Olasco Autos",
  description: "Olasco Autos connects car rental, vehicle sales, pickup and planned mobility requests in Lagos and Abuja with direct human support.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT OLASCO AUTOS" title={<>Mobility, <span>made personal.</span></>} description="Olasco Autos brings car rental, vehicle sourcing, pickup, chauffeur, corporate and event travel requests together in Lagos and Abuja — with WhatsApp as the human conversation that follows." aside="No years-in-business claim, fleet-size statistic, award, or certification is published without owner-verified evidence."
        image="/images/corporate-travel.jpg"
        imageAlt="Business travellers walking towards a chauffeured SUV in Lagos"
        dark>
        <div className="hero-actions page-hero-actions"><ButtonLink href="/contact">Talk with Olasco<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context="general" variant="text" className="hero-secondary" icon="whatsapp">Start on WhatsApp</WhatsAppLink></div>
      </PageHero>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <section className="section section--white"><div className="container about-story"><div className="about-story-photo"><Image src="/images/corporate-travel.jpg" alt="Business travellers arriving at a chauffeured SUV in Lagos" fill quality={90} sizes="(max-width: 640px) 92vw, 48vw" /><span className="split-note">Arrivals, handled</span></div><div className="about-story-copy"><p className="eyebrow">THE OLASCO APPROACH</p><h2>Less searching. More useful answers.</h2><p>Some journeys need a vehicle for a day. Others need a longer rental, a car to own, an airport arrival, or several people moved on a tight schedule. Olasco helps customers begin with the details that make a real quote possible.</p><p>The site is built to capture a clear request, provide a reference, and make a direct human handoff. Availability and terms are not guessed on a screen.</p><div className="about-facts"><div><MapPin size={17} aria-hidden="true" /><span><strong>Two city starts</strong><small>Lagos and Abuja</small></span></div><div><MessageCircle size={17} aria-hidden="true" /><span><strong>Human follow-through</strong><small>WhatsApp-first support</small></span></div><div><Handshake size={17} aria-hidden="true" /><span><strong>Request, then confirm</strong><small>No online payment flow</small></span></div></div></div></div></section>
      <section className="section section--ink"><div className="container"><SectionHeading eyebrow="WHAT WE OPTIMIZE FOR" title="A better conversation starts with a better request." dark /><div className="trust-grid trust-grid--dark"><article className="trust-item"><span>01</span><h3>Specificity</h3><p>Dates, cities, routes, passengers, and vehicle class make it easier to check what is genuinely possible.</p></article><article className="trust-item"><span>02</span><h3>Clarity</h3><p>Requests are not reservations. The team explains price, eligibility, and terms before confirmation.</p></article><article className="trust-item"><span>03</span><h3>Continuity</h3><p>Your request reference and contextual WhatsApp message help keep the person-to-person handoff connected.</p></article></div></div></section>
    </>
  );
}
