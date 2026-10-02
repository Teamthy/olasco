import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { locationPages } from "@/content/locations";

type LocationContent = (typeof locationPages)[keyof typeof locationPages];

export function LocationCard({ location }: { location: LocationContent }) {
  return (
    <article className="location-card">
      <Image src={location.image} alt={location.imageAlt} fill sizes="(max-width: 640px) 94vw, 48vw" />
      <div className="location-card-content">
        <p className="eyebrow">SERVICE AREA / {location.slug.toUpperCase()}</p>
        <h3>{location.name}</h3>
        <p>{location.coverageNote}</p>
        <div className="location-card-actions">
          <Link href={`/locations/${location.slug}`}>Explore {location.name}<ArrowUpRight size={14} aria-hidden="true" /></Link>
          <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={14} aria-hidden="true" />Open city map</a>
        </div>
      </div>
    </article>
  );
}
