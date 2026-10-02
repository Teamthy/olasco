import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { businessConfig } from "@/config/business";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloating } from "@/components/whatsapp-floating";

export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.publicUrl),
  title: {
    default: "Olasco Autos — Car rental, sales & mobility in Lagos and Abuja",
    template: "%s | Olasco Autos",
  },
  description: "Arrange car rental, vehicle sourcing, airport pickup, chauffeur, corporate and event travel in Lagos and Abuja. Submit a request and continue with a real person on WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: businessConfig.name,
    title: "Olasco Autos — Mobility, made personal",
    description: "Car rental, vehicle sourcing, pickup and planned journeys in Lagos and Abuja.",
    url: businessConfig.publicUrl,
    images: [{ url: "/images/hero-suv.jpg", width: 1200, height: 800, alt: "Representative Olasco Autos automotive photography" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Olasco Autos — Mobility, made personal",
    description: "Car rental, vehicle sourcing, pickup and planned journeys in Lagos and Abuja.",
    images: ["/images/hero-suv.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#111311",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <MobileActionBar />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
