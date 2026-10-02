import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function MobileActionBar() {
  return (
    <div className="mobile-action-bar" aria-label="Quick contact actions">
      <Link className="mobile-action-primary" href="/rentals/booking">Make a request <ArrowUpRight size={15} aria-hidden="true" /></Link>
      <WhatsAppLink context="general" variant="text" icon="whatsapp" aria-label="Open Olasco Autos WhatsApp chat">WhatsApp</WhatsAppLink>
    </div>
  );
}
