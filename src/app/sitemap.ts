import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business";
import { listVehicles } from "@/server/repositories";

const publicPaths = [
  "/", "/about", "/contact", "/faq", "/locations", "/locations/lagos", "/locations/abuja",
  "/rentals", "/rentals/search", "/rentals/luxury", "/rentals/suv", "/rentals/sedan", "/rentals/executive",
  "/rentals/airport", "/rentals/corporate", "/rentals/long-term", "/rentals/interstate", "/rentals/booking", "/rentals/policies",
  "/cars", "/cars/luxury", "/cars/suv", "/cars/executive", "/cars/consultation", "/cars/sell-trade-in",
  "/pickup", "/pickup/airport", "/pickup/chauffeur", "/pickup/corporate", "/pickup/events", "/pickup/interstate", "/pickup/booking",
  "/testimonials", "/whatsapp", "/privacy", "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = publicPaths.map((path) => ({
    url: `${businessConfig.publicUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/rentals" || path === "/cars" || path === "/pickup" ? 0.8 : 0.6,
  }));
  try {
    const vehicles = await listVehicles();
    const vehicleEntries: MetadataRoute.Sitemap = vehicles.flatMap((vehicle) => [
      ...(vehicle.isForRent ? [{ url: `${businessConfig.publicUrl}/rentals/${vehicle.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
      ...(vehicle.isForSale ? [{ url: `${businessConfig.publicUrl}/cars/${vehicle.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
    ]);
    return [...staticEntries, ...vehicleEntries];
  } catch {
    return staticEntries;
  }
}
