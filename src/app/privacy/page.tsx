import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "Draft privacy notice for Olasco Autos website requests. Owner and legal approval is required before production launch.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL / PRIVACY" title={<>Your details have <span>a clear purpose.</span></>} description="This draft explains the minimum information the Olasco Autos request forms need to begin a conversation. The business owner must approve the final legal wording before production." aside="Draft for owner and legal review. Not a substitute for an approved privacy notice." />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <section className="section section--white"><article className="container prose">
        <div className="draft-notice"><strong>Owner action required before launch.</strong> Confirm the legal business/controller name, data-retention period, hosting/processor locations, user-rights contact, analytics/cookie usage, and final Nigerian privacy wording.</div>
        <h2>Information the forms request</h2><p>When you send a rental, pickup, purchase, or contact request, the site asks for information such as your name, phone/WhatsApp number, optional email, chosen city, dates, route, passenger details, and message. Only provide information relevant to your enquiry.</p>
        <h2>Why the information is used</h2><p>The request details are used to save a reference, understand the service you want, check availability and pricing with you, respond to the enquiry, and — only when configured — notify Olasco’s authorized operations team.</p>
        <h2>Where requests are stored and sent</h2><p>Production requests are designed to be stored in Olasco’s PostgreSQL service. Email or WhatsApp Cloud API notifications are sent only when the business configures those server-side providers. Development without a database uses a local, ignored JSON file and is not suitable for production. The final hosting, processor, access-control, backup, and retention arrangements must be documented by Olasco.</p>
        <h2>How long information is kept</h2><p>The business has not supplied an approved retention period. Before launch, Olasco must choose a retention schedule, deletion process, and contact for privacy requests.</p>
        <h2>Your choices and requests</h2><p>To ask about a request or your personal information, contact Olasco on WhatsApp or the public customer number. A formal privacy-rights process and responsible business contact remain to be approved.</p>
        <h2>Cookies, analytics, and third parties</h2><p>No advertising or analytics integration is intentionally included in this build. Any future analytics, map embeds, payment, or marketing service must be disclosed and approved before activation.</p>
      </article></section>
    </>
  );
}
