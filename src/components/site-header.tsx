"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { primaryNavigation } from "@/content/navigation";
import { BrandMark } from "@/components/brand-mark";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <BrandMark inverted />
        <div className="mobile-header-contact">
          <WhatsAppLink context="general" variant="text" icon="whatsapp" aria-label="Chat with Olasco Autos on WhatsApp">
            WhatsApp
          </WhatsAppLink>
        </div>
        <nav className="desktop-nav" aria-label="Main navigation">
          {primaryNavigation.map((item) => (
            <Link
              className={isCurrent(item.href) ? "nav-link is-current" : "nav-link"}
              href={item.href}
              key={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-icon-button" href="/rentals/search" aria-label="Search available vehicles">
            <Search size={18} aria-hidden="true" />
          </Link>
          <WhatsAppLink
            context="general"
            className="header-whatsapp"
            variant="text"
            icon="whatsapp"
            aria-label="Chat with Olasco Autos on WhatsApp"
          >
            WhatsApp
          </WhatsAppLink>
          <Link className="button button--primary header-book" href="/rentals/booking">
            Book Now
          </Link>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>
      {menuOpen ? (
        <div className="mobile-menu container" id="mobile-navigation">
          <nav aria-label="Mobile navigation">
            {primaryNavigation.map((item, index) => (
              <Link className="mobile-menu-link" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                <span className="mobile-menu-index">0{index + 1}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-actions">
            <Link className="button button--primary" href="/rentals/booking" onClick={() => setMenuOpen(false)}>
              Book Now
            </Link>
            <WhatsAppLink context="general" variant="outline" icon="whatsapp" className="hero-secondary">
              Chat on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
