import Image from "next/image";
import Link from "next/link";
import { Armchair, ArrowUpRight, Fuel, Gauge, Settings2 } from "lucide-react";
import type { VehicleRecord } from "@/domain/types";
import { WhatsAppLink } from "@/components/whatsapp-link";

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

export function VehicleCard({ vehicle, mode }: { vehicle: VehicleRecord; mode: "rent" | "sale" }) {
  const forRent = mode === "rent";
  const price = forRent ? vehicle.rentalPriceDaily : vehicle.salePrice;
  const detailHref = forRent ? `/rentals/${vehicle.slug}` : `/cars/${vehicle.slug}`;
  const image = vehicle.images[0];
  const priceLabel = price === null || price === undefined ? "Quote on request" : formatCurrency(price, vehicle.currency);
  const whatsAppContext = forRent ? "rental" : "purchase";

  return (
    <article className="vehicle-card">
      <Link className="vehicle-card-media" href={detailHref} aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
        {image ? <Image src={image.url} alt={image.altText} fill sizes="(max-width: 640px) 40vw, (max-width: 1000px) 45vw, 32vw" /> : null}
        <span className="vehicle-badge">{vehicle.location}</span>
      </Link>
      <div className="vehicle-card-body">
        <div className="vehicle-card-overline"><span>{vehicle.category.toLowerCase().replaceAll("_", " ")}</span><span>{vehicle.year}</span></div>
        <h3>{vehicle.make} {vehicle.model}{vehicle.trim ? ` ${vehicle.trim}` : ""}</h3>
        <div className="vehicle-specs">
          {vehicle.seats ? <span><Armchair size={13} aria-hidden="true" />{vehicle.seats} seats</span> : null}
          {vehicle.transmission ? <span><Settings2 size={13} aria-hidden="true" />{vehicle.transmission}</span> : null}
          {vehicle.fuelType ? <span><Fuel size={13} aria-hidden="true" />{vehicle.fuelType}</span> : null}
          {!forRent && vehicle.mileage !== null && vehicle.mileage !== undefined ? <span><Gauge size={13} aria-hidden="true" />{vehicle.mileage.toLocaleString("en-NG")} km</span> : null}
        </div>
        <div className="vehicle-price-row">
          <div><small>{forRent ? "Daily rate" : "Asking price"}</small><strong>{priceLabel}{forRent && price ? <small> / day</small> : null}</strong></div>
          <span className={`vehicle-status${vehicle.isAvailable ? "" : " vehicle-status--pending"}`}>{vehicle.isAvailable ? "Availability to confirm" : "Enquire for status"}</span>
        </div>
        <div className="vehicle-card-actions">
          <Link className="button button--secondary" href={forRent ? `/rentals/booking?vehicle=${vehicle.slug}` : detailHref}>{forRent ? "Request this car" : "View vehicle"}<ArrowUpRight size={14} aria-hidden="true" /></Link>
          {forRent ? <Link href={detailHref}>Details</Link> : <WhatsAppLink context={whatsAppContext} details={{ vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, location: vehicle.location }} variant="text" icon="none">Ask Olasco</WhatsAppLink>}
        </div>
      </div>
    </article>
  );
}
