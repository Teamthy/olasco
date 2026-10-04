import { ArrowUpRight, MapPin } from "lucide-react";

function embedUrl(city: "Lagos" | "Abuja") {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${city}, Nigeria`)}&z=11&output=embed`;
}

/**
 * City-level service area map. Deliberately pins no office address — it shows
 * the wider city so people can orient their pickup area before the Olasco team
 * confirms an exact meeting point.
 */
export function CityMap({
  city,
  mapsUrl,
  title,
  note,
  compact = false,
}: {
  city: "Lagos" | "Abuja";
  mapsUrl: string;
  title?: string;
  note?: string;
  compact?: boolean;
}) {
  return (
    <figure className={`city-map${compact ? " city-map--compact" : ""}`}>
      <div className="city-map-head">
        <span className="city-map-badge"><MapPin size={14} aria-hidden="true" />{city}</span>
        <figcaption>{title || `${city} service area map`}</figcaption>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          Open in Google Maps<ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      <div className="city-map-frame">
        <iframe
          src={embedUrl(city)}
          title={`${city} city map — Olasco Autos service area`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {note ? <p className="city-map-note">{note}</p> : null}
    </figure>
  );
}
