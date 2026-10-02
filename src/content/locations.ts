import { businessConfig } from "@/config/business";
import type { CitySlug } from "@/domain/types";

export const locationPages = {
  lagos: {
    ...businessConfig.locations.lagos,
    eyebrow: "LAGOS / NIGERIA",
    description: "Request a rental, pickup, vehicle consultation, or planned business journey in Lagos. Share your dates and route; Olasco will confirm the exact service area and current options with you.",
    serviceLinks: [
      { label: "Car rentals", href: "/rentals" },
      { label: "Airport and city pickups", href: "/pickup/airport" },
      { label: "Corporate & event travel", href: "/pickup/corporate" },
      { label: "Cars for sale", href: "/cars" },
    ],
    serviceNote: "Office address, operating hours, and precise coverage have not yet been provided. Pickup points and route eligibility are confirmed per request.",
  },
  abuja: {
    ...businessConfig.locations.abuja,
    eyebrow: "ABUJA / FCT",
    description: "Arrange a car rental, airport arrival, chauffeur, purchase enquiry, or work trip in Abuja. The team checks the pickup point, itinerary, dates, and availability before confirming.",
    serviceLinks: [
      { label: "Car rentals", href: "/rentals" },
      { label: "Airport and city pickups", href: "/pickup/airport" },
      { label: "Corporate & event travel", href: "/pickup/corporate" },
      { label: "Cars for sale", href: "/cars" },
    ],
    serviceNote: "Office address, operating hours, and precise coverage have not yet been provided. Pickup points and route eligibility are confirmed per request.",
  },
} as const satisfies Record<CitySlug, {
  name: string;
  slug: CitySlug;
  officeAddress: string | null;
  coverageNote: string;
  mapsUrl: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  description: string;
  serviceLinks: Array<{ label: string; href: string }>;
  serviceNote: string;
}>;
