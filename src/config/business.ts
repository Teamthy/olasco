import type { CityLabel, CitySlug } from "@/domain/types";

const normalizeWhatsAppNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.startsWith("234")) return digits;
  return digits;
};

const publicUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

export const businessConfig = {
  name: "Olasco Autos",
  shortName: "Olasco",
  tagline: "Mobility, made personal.",
  publicUrl,
  phoneDisplay: "0815 159 4253",
  phoneE164: "+2348151594253",
  whatsappNumber: normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "08151594253"),
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL?.trim() || "",
  currency: "NGN",
  country: "Nigeria",
  openingHours: null as string | null,
  locations: {
    lagos: {
      name: "Lagos" as CityLabel,
      slug: "lagos" as CitySlug,
      officeAddress: null as string | null,
      coverageNote: "Lagos requests are reviewed against the pickup point, destination, dates, and selected service before confirmation.",
      mapsUrl:
        process.env.NEXT_PUBLIC_LAGOS_MAPS_URL ||
        "https://www.google.com/maps/search/?api=1&query=Lagos%2C%20Nigeria",
      image: "/images/lagos-city.jpg",
      imageAlt: "Lagos skyline and the Lekki-Ikoyi Link Bridge at blue hour",
    },
    abuja: {
      name: "Abuja" as CityLabel,
      slug: "abuja" as CitySlug,
      officeAddress: null as string | null,
      coverageNote: "Abuja requests are reviewed against the pickup point, destination, dates, and selected service before confirmation.",
      mapsUrl:
        process.env.NEXT_PUBLIC_ABUJA_MAPS_URL ||
        "https://www.google.com/maps/search/?api=1&query=Abuja%2C%20Nigeria",
      image: "/images/abuja-city.jpg",
      imageAlt: "Aerial view of Abuja with the National Mosque and Aso Rock",
    },
  },
} as const;

export const cityLabels: CityLabel[] = ["Lagos", "Abuja"];
