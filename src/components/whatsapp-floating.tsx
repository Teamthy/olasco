import { WhatsAppLink } from "@/components/whatsapp-link";

export function WhatsAppFloating() {
  return (
    <WhatsAppLink
      className="whatsapp-floating"
      context="general"
      variant="primary"
      icon="whatsapp"
      aria-label="Chat with Olasco Autos on WhatsApp"
    >
      Chat with Olasco
    </WhatsAppLink>
  );
}
