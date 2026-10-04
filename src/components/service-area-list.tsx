import Link from "next/link";
import { serviceAreaGroups } from "@/content/service-areas";
import type { CityLabel } from "@/domain/types";

/**
 * Editorial list of the major local government areas / districts for a city.
 * Each chip links into the booking flow pre-set to that city so a visitor can
 * go straight from browsing coverage to sending a request.
 */
export function ServiceAreaList({ city }: { city: CityLabel }) {
  const groups = serviceAreaGroups[city];
  return (
    <div>
      {groups.map((group) => (
        <section className="area-group" key={group.label}>
          <h3>{group.label}</h3>
          <p>
            {group.label === "Area Councils"
              ? "The six FCT area councils covered by request."
              : group.label === "Major Districts"
                ? "Popular pickup and drop-off districts inside the FCT."
                : `${group.label} local government areas.`}
          </p>
          <ul className="area-chips">
            {group.areas.map((area) => (
              <li key={area}>
                <Link className="area-chip" href={`/rentals/booking?location=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}`}>
                  {area}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
