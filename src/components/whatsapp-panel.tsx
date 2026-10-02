import { Clock3, Phone, ShieldCheck } from "lucide-react";
import { businessConfig } from "@/config/business";
import { WhatsAppGlyph } from "@/components/whatsapp-glyph";
import { createWhatsAppLink, whatsAppGreeting } from "@/lib/whatsapp";

const expectations = [
  "Tell us the city, dates, and the kind of vehicle or journey you have in mind.",
  "A representative checks live availability, current rates, and requirements.",
  "You get a clear answer and a quote before anything is confirmed.",
];

/**
 * The primary "Chat with Olasco" surface. The whole card is deliberately built
 * around one unmistakable action: open the direct WhatsApp chat.
 */
export function WhatsAppPanel({ className = "" }: { className?: string }) {
  return (
    <section className={`wa-panel${className ? ` ${className}` : ""}`} aria-labelledby="wa-panel-title">
      <div className="wa-panel-head">
        <span className="wa-panel-avatar" aria-hidden="true">
          <WhatsAppGlyph size={24} />
        </span>
        <div className="wa-panel-identity">
          <span className="wa-panel-status">
            <span className="wa-panel-dot" aria-hidden="true" />Usually the fastest reply
          </span>
          <h2 id="wa-panel-title">Chat with Olasco</h2>
        </div>
      </div>

      <p className="wa-panel-copy">
        WhatsApp is the quickest route to a person. It opens a direct chat with the Olasco team on{" "}
        <strong>{businessConfig.phoneDisplay}</strong> — with your greeting already written, so you can just tap send.
      </p>

      <a
        className="wa-panel-button"
        href={createWhatsAppLink({ message: whatsAppGreeting })}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppGlyph size={22} />
        <span>Start chat on WhatsApp</span>
      </a>

      <a className="wa-panel-call" href={`tel:${businessConfig.phoneE164}`}>
        <Phone size={15} aria-hidden="true" />
        <span>
          Prefer to talk? Call <strong>{businessConfig.phoneDisplay}</strong>
        </span>
      </a>

      <ul className="wa-panel-list">
        {expectations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="wa-panel-foot">
        <ShieldCheck size={14} aria-hidden="true" />
        <span>Never send payments, ID documents, or card details in a chat.</span>
      </p>
      <p className="wa-panel-foot">
        <Clock3 size={14} aria-hidden="true" />
        <span>Business hours have not been supplied for publication — reply times vary. A request on the form is saved either way.</span>
      </p>
    </section>
  );
}
