import Link from "next/link";
import { Phone } from "lucide-react";
import { businessConfig } from "@/config/business";
import { footerGroups } from "@/content/navigation";
import { BrandMark } from "@/components/brand-mark";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-column">
          <BrandMark inverted />
          <p>Car rental, vehicle sourcing, and planned journeys in Lagos and Abuja. One clear request, then a conversation with the team.</p>
          <div className="footer-contact-actions">
            <a href={`tel:${businessConfig.phoneE164}`} className="footer-phone"><Phone size={15} aria-hidden="true" />{businessConfig.phoneDisplay}</a>
            <WhatsAppLink context="general" variant="text" icon="whatsapp">Talk to Olasco</WhatsAppLink>
          </div>
        </div>
        {footerGroups.map((group) => (
          <div className="footer-link-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
            </ul>
          </div>
        ))}
        <div className="footer-link-group">
          <h2>Locations</h2>
          <ul>
            <li><Link href="/locations/lagos">Lagos</Link></li>
            <li><Link href="/locations/abuja">Abuja</Link></li>
            <li><Link href="/locations">All locations</Link></li>
            <li><Link href="/testimonials">Customer stories</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Olasco Autos. Availability and terms are confirmed directly with our team.</p>
        <div className="footer-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/rentals/policies">Rental policies</Link>
        </div>
      </div>
    </footer>
  );
}
