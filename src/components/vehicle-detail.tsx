import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Armchair, DoorOpen, Fuel, Gauge, MapPin, Settings2 } from "lucide-react";
import type { VehicleRecord } from "@/domain/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/ui";
import { WhatsAppLink } from "@/components/whatsapp-link";

function money(amount: number | null | undefined, currency: string) {
  if (amount === undefined || amount === null) return "Quote on request";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function VehicleDetail({ vehicle, mode }: { vehicle: VehicleRecord; mode: "rent" | "sale" }) {
  const isRental = mode === "rent";
  const images = vehicle.images;
  const hrefBase = isRental ? "/rentals" : "/cars";
  const path = `${hrefBase}/${vehicle.slug}`;
  const price = isRental ? vehicle.rentalPriceDaily : vehicle.salePrice;
  const whatsAppContext = isRental ? "rental" : "purchase";
  const requestHref = isRental ? `/rentals/booking?vehicle=${encodeURIComponent(vehicle.slug)}&location=${encodeURIComponent(vehicle.location)}` : "/cars/consultation";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    manufacturer: { "@type": "Organization", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    category: vehicle.category.toLowerCase(),
    image: images.map((image) => image.url),
    ...(vehicle.transmission ? { vehicleTransmission: vehicle.transmission } : {}),
    ...(vehicle.fuelType ? { fuelType: vehicle.fuelType } : {}),
    ...(vehicle.seats ? { numberOfSeats: vehicle.seats } : {}),
    ...(vehicle.mileage ? { mileageFromOdometer: { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" } } : {}),
    ...(price !== null && price !== undefined ? { offers: { "@type": "Offer", price: price.toString(), priceCurrency: vehicle.currency, url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}` } } : {}),
  };

  const specs = [
    { label: "Category", value: vehicle.category.toLowerCase().replaceAll("_", " "), icon: MapPin },
    { label: "Capacity", value: vehicle.seats ? `${vehicle.seats} seats` : null, icon: Armchair },
    { label: "Transmission", value: vehicle.transmission, icon: Settings2 },
    { label: "Fuel", value: vehicle.fuelType, icon: Fuel },
    { label: "Doors", value: vehicle.doors ? String(vehicle.doors) : null, icon: DoorOpen },
    { label: "Mileage", value: vehicle.mileage !== null && vehicle.mileage !== undefined ? `${vehicle.mileage.toLocaleString("en-NG")} km` : null, icon: Gauge },
  ].filter((item): item is typeof item & { value: string } => Boolean(item.value));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="page-hero page-hero--dark vehicle-detail-hero"><div className="container page-hero-inner"><div><p className="eyebrow eyebrow--lime">{vehicle.location.toUpperCase()} / {isRental ? "FOR RENT" : "FOR SALE"}</p><h1>{vehicle.year} {vehicle.make} <span>{vehicle.model}</span></h1><p className="page-hero-copy">{vehicle.description}</p><div className="hero-actions page-hero-actions"><ButtonLink href={requestHref}>{isRental ? "Book this car" : "Request purchase details"}<ArrowUpRight size={15} aria-hidden="true" /></ButtonLink><WhatsAppLink context={whatsAppContext} details={{ vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, location: vehicle.location }} variant="text" className="hero-secondary" icon="whatsapp">Ask Olasco</WhatsAppLink></div></div><div className="vehicle-detail-price"><small>{isRental ? "Daily rental rate" : "Current asking price"}</small><strong>{money(price, vehicle.currency)}{isRental && price ? <small> / day</small> : null}</strong><span>Confirm current terms and availability with Olasco.</span></div></div></section>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: isRental ? "Rentals" : "Cars for sale", href: hrefBase }, { label: `${vehicle.year} ${vehicle.make} ${vehicle.model}` }]} />
      <section className="section section--white"><div className="container vehicle-detail-grid">
        <div className="vehicle-gallery">
          {images.slice(0, 3).map((image, index) => <figure className={index === 0 ? "vehicle-gallery-main" : "vehicle-gallery-secondary"} key={image.url}><Image src={image.url} alt={image.altText} fill sizes={index === 0 ? "(max-width: 640px) 92vw, 62vw" : "(max-width: 640px) 44vw, 30vw"} /><figcaption>{image.altText}</figcaption></figure>)}
        </div>
        <aside className="vehicle-detail-aside"><p className="eyebrow">THE VEHICLE</p><h2>Details worth knowing.</h2><p className="vehicle-detail-location"><MapPin size={14} aria-hidden="true" />{vehicle.location}, Nigeria</p><div className="vehicle-detail-specs">{specs.map(({ label, value, icon: Icon }) => <div key={label}><Icon size={16} aria-hidden="true" /><span>{label}</span><strong>{value}</strong></div>)}</div>{vehicle.features.length ? <><h3>Features</h3><ul className="vehicle-feature-tags">{vehicle.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></> : null}<div className="vehicle-detail-terms"><strong>Before you confirm</strong><p>Ask Olasco to verify current availability, price, condition, documents, deposit or fees, and any trip or handover requirements.</p></div><div className="vehicle-detail-actions"><ButtonLink href={requestHref}>{isRental ? "Book this car" : "Request a consultation"}<ArrowUpRight size={14} aria-hidden="true" /></ButtonLink>{!isRental ? <WhatsAppLink context="purchase" details={{ vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, location: vehicle.location }} variant="text" icon="whatsapp">Ask on WhatsApp</WhatsAppLink> : null}</div></aside>
      </div></section>
      <div className="detail-mobile-cta"><Link href={requestHref}>{isRental ? "Book this car" : "Ask about this car"}<ArrowUpRight size={15} aria-hidden="true" /></Link><WhatsAppLink context={whatsAppContext} details={{ vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, location: vehicle.location }} variant="text" icon="whatsapp">WhatsApp</WhatsAppLink></div>
    </>
  );
}
