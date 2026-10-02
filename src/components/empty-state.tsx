import type { ReactNode } from "react";
import { ArrowUpRight, CircleHelp } from "lucide-react";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ButtonLink } from "@/components/ui";

export function EmptyState({
  title,
  description,
  primaryHref,
  primaryLabel,
  context = "general",
  details,
  icon,
  compact = false,
}: {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  context?: "general" | "rental" | "purchase" | "pickup" | "airport" | "corporate" | "event" | "interstate";
  details?: Record<string, string | undefined>;
  icon?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`empty-state${compact ? " empty-state--compact" : ""}`}>
      <span className="empty-state-icon">{icon || <CircleHelp size={18} aria-hidden="true" />}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="empty-state-actions">
        {primaryHref && primaryLabel ? <ButtonLink href={primaryHref} variant="secondary">{primaryLabel}<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink> : null}
        <WhatsAppLink context={context} details={details} variant="text" icon="whatsapp">Ask the Olasco team</WhatsAppLink>
      </div>
    </div>
  );
}
