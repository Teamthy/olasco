import Link from "next/link";
import { ArrowUp, Mail, Phone } from "lucide-react";
import { businessConfig } from "@/config/business";
import { footerGroups } from "@/content/navigation";
import { BrandMark } from "@/components/brand-mark";
import { WhatsAppGlyph } from "@/components/whatsapp-glyph";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { createWhatsAppLink, whatsAppGreeting } from "@/lib/whatsapp";

// Only channels Olasco actually answers. No placeholder social profiles are linked.
const channelLinks = [
  {
    label: "Chat with Olasco Autos on WhatsApp",
    href: createWhatsAppLink({ message: whatsAppGreeting }),
    external: true,
    icon: <WhatsAppGlyph size={17} />,
  },
  { label: `Call Olasco Autos on ${businessConfig.phoneDisplay}`, href: `tel:${businessConfig.phoneE164}`, external: false, icon: <Phone size={17} aria-hidden="true" /> },
  ...(businessConfig.email
    ? [{ label: `Email Olasco Autos at ${businessConfig.email}`, href: `mailto:${businessConfig.email}`, external: false, icon: <Mail size={17} aria-hidden="true" /> }]
    : [{ label: "Contact Olasco Autos", href: "/contact", external: false, icon: <Mail size={17} aria-hidden="true" /> }]),
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-column">
          <BrandMark inverted />
          <p>
            Car rental, vehicle sourcing, airport pickup and planned journeys in Lagos and Abuja. One clear request, then a conversation with
            the team.
          </p>
          <div className="footer-contact-actions">
            <a href={`tel:${businessConfig.phoneE164}`} className="footer-phone">
              <Phone size={15} aria-hidden="true" />
              {businessConfig.phoneDisplay}
            </a>
            <WhatsAppLink context="general" variant="text" icon="whatsapp">
              Chat with Olasco
            </WhatsAppLink>
          </div>
          <div className="footer-socials">
            {channelLinks.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                aria-label={channel.label}
                {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {channel.icon}
              </a>
            ))}
          </div>
        </div>

        {footerGroups.map((group) => (
          <div className="footer-link-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Olasco Autos. Availability and terms are confirmed directly with our team.</p>
        <div className="footer-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/faq">Support</Link>
          <Link href="/locations">Locations</Link>
        </div>
        <Link className="footer-top-link" href="#main-content">
          Back to top
          <ArrowUp size={14} aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
