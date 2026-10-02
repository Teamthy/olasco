import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { businessConfig } from "@/config/business";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsAppPanel } from "@/components/whatsapp-panel";
import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata: Metadata = {
  title: "Chat with Olasco Autos on WhatsApp",
  description:
    "Open a direct WhatsApp chat with Olasco Autos about car rental, vehicle purchase, airport pickup, corporate travel, events, and interstate requests in Lagos and Abuja.",
  alternates: { canonical: "/whatsapp" },
};

const starters = [
  { label: "I need a rental", context: "rental" as const },
  { label: "I want to buy a car", context: "purchase" as const },
  { label: "Airport pickup", context: "airport" as const },
  { label: "Corporate travel", context: "corporate" as const },
];

export default function WhatsAppPage() {
  return (
    <>
      <PageHero
        eyebrow="DIRECT / HUMAN / WHATSAPP"
        title={
          <>
            One conversation <span>can start the journey.</span>
          </>
        }
        description="Tell Olasco what you need and where you are travelling. A representative will check current availability and guide you through the next step."
        image="/images/chauffeur-pickup.jpg"
        imageAlt="Chauffeur welcoming a passenger into an executive sedan"
        aside="WhatsApp is the human handoff, not the booking database. Online requests are saved first and receive a reference."
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "WhatsApp" }]} />

      <section className="section section--white">
        <div className="container whatsapp-page-layout">
          <WhatsAppPanel />
          <div className="whatsapp-starters">
            <p className="eyebrow">PICK A STARTING POINT</p>
            <h2>Not sure how to begin?</h2>
            <p>
              Each button below opens the same Olasco chat with a short message already written. Choose the closest one and edit it before
              sending — or just say hello.
            </p>
            <div className="whatsapp-starter-grid">
              {starters.map((starter) => (
                <WhatsAppLink key={starter.context} context={starter.context} variant="outline" icon="whatsapp">
                  {starter.label}
                </WhatsAppLink>
              ))}
            </div>
            <a className="whatsapp-call-row" href={`tel:${businessConfig.phoneE164}`}>
              <Phone size={15} aria-hidden="true" />
              Call {businessConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
