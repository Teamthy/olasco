import type { ReactNode } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { createContextMessage, createWhatsAppLink, type WhatsAppContext } from "@/lib/whatsapp";
import { buttonClass, type ButtonVariant } from "@/components/ui";

export function WhatsAppLink({
  children,
  context = "general",
  details,
  message,
  className = "",
  variant = "primary",
  icon = "arrow",
  ...props
}: {
  children: ReactNode;
  context?: WhatsAppContext;
  details?: Record<string, string | undefined>;
  message?: string;
  className?: string;
  variant?: ButtonVariant;
  icon?: "arrow" | "whatsapp" | "none";
  "aria-label"?: string;
}) {
  const content = message || createContextMessage(context, details);
  return (
    <a
      className={buttonClass(variant, className)}
      href={createWhatsAppLink({ message: content })}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {icon === "whatsapp" ? <MessageCircle size={17} aria-hidden="true" /> : null}
      <span>{children}</span>
      {icon === "arrow" ? <ArrowUpRight size={16} aria-hidden="true" /> : null}
    </a>
  );
}
