import type { VehicleCategory } from "@/domain/types";

export interface CatalogPageContent {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  category: VehicleCategory;
  mode: "rent" | "sale";
  metaTitle: string;
  metaDescription: string;
}

export const rentalCategoryPages: Record<string, CatalogPageContent> = {
  luxury: {
    slug: "luxury", eyebrow: "LUXURY RENTAL / LAGOS & ABUJA", title: "Luxury car rental, arranged with care.",
    description: "Request a premium vehicle for a business engagement, special occasion, or important arrival. Olasco confirms the exact make, model, availability, current rate, driver option, and terms before accepting.", category: "LUXURY", mode: "rent",
    metaTitle: "Luxury car rental in Lagos and Abuja", metaDescription: "Request a luxury car rental in Lagos or Abuja. Share your date and itinerary; Olasco confirms the actual vehicle, availability, rate, and requirements.",
  },
  suv: {
    slug: "suv", eyebrow: "SUV RENTAL / LAGOS & ABUJA", title: "SUV rental for the shape of your trip.",
    description: "Tell us how many people are travelling, where you are going, and the dates you need. Olasco checks a suitable available SUV and shares the current terms directly.", category: "SUV", mode: "rent",
    metaTitle: "SUV rental in Lagos and Abuja", metaDescription: "Request an SUV rental in Lagos or Abuja. Ask Olasco about current vehicle availability, space, route eligibility, driver options, and pricing.",
  },
  sedan: {
    slug: "sedan", eyebrow: "SEDAN RENTAL / LAGOS & ABUJA", title: "A composed car for city days and longer drives.",
    description: "Request a sedan for a day in the city, an extended stay, or a planned route. Vehicle specifications, availability, and current pricing are confirmed before a booking is accepted.", category: "SEDAN", mode: "rent",
    metaTitle: "Sedan rental in Lagos and Abuja", metaDescription: "Ask Olasco Autos about sedan rentals in Lagos and Abuja. Availability, current rates, and trip requirements are confirmed directly.",
  },
  executive: {
    slug: "executive", eyebrow: "EXECUTIVE CAR RENTAL / LAGOS & ABUJA", title: "Executive travel, with the details in place.",
    description: "For a business trip, client visit, airport arrival, or meeting schedule, share the route and timing. Olasco will confirm the vehicle, chauffeur option, availability, and quote.", category: "EXECUTIVE", mode: "rent",
    metaTitle: "Executive car rental in Lagos and Abuja", metaDescription: "Request executive car rental in Lagos or Abuja for business travel, airport pickup, and meeting schedules. Ask for confirmed availability and price.",
  },
};

export interface RentalServicePageContent {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  serviceType: "DAILY_RENTAL" | "LONG_TERM_RENTAL" | "INTERSTATE_TRIP";
  metaTitle: string;
  metaDescription: string;
}

export const rentalServicePages: Record<string, RentalServicePageContent> = {
  daily: {
    slug: "daily", eyebrow: "DAILY CAR RENTAL", title: "A day’s drive, arranged around your plans.",
    description: "Share your preferred city, pickup point, dates, and vehicle class. Olasco checks what is currently available and confirms the applicable daily rate and terms before accepting.",
    points: ["Choose Lagos or Abuja", "Add a clear pickup point and time", "Ask about delivery or a driver", "Confirm rate basis and requirements directly"],
    serviceType: "DAILY_RENTAL", metaTitle: "Daily car rental in Lagos and Abuja", metaDescription: "Request a daily car rental in Lagos or Abuja. Olasco confirms actual vehicle availability, current daily pricing, pickup options, and requirements.",
  },
  "long-term": {
    slug: "long-term", eyebrow: "EXTENDED / LONG-TERM RENTAL", title: "A longer stay deserves a better plan.",
    description: "For a longer rental, tell us the city, preferred vehicle class, start date, and expected duration. Olasco confirms the available vehicle, rate basis, deposit, mileage, and extension terms with you.",
    points: ["Share expected rental duration", "Ask for the full rate basis", "Confirm mileage, deposit, and extension rules", "Availability is checked before acceptance"],
    serviceType: "LONG_TERM_RENTAL", metaTitle: "Long-term car rental in Lagos and Abuja", metaDescription: "Ask Olasco Autos about long-term car rental in Lagos or Abuja. Rates, deposits, mileage, extensions, and availability are confirmed per request.",
  },
  airport: {
    slug: "airport", eyebrow: "AIRPORT CAR RENTAL", title: "Make airport arrival part of the plan.",
    description: "Tell us your airport, arrival date and time, onward destination, luggage, and whether you need a driver. Olasco confirms the meeting point, availability, waiting terms, and quote before your trip.",
    points: ["Share airport and arrival details", "Confirm rental versus chauffeur service", "Discuss wait time and meeting point", "Request the full quote before confirming"],
    serviceType: "DAILY_RENTAL", metaTitle: "Airport car rental in Lagos and Abuja", metaDescription: "Request airport car rental or airport pickup in Lagos or Abuja. Meeting points, vehicle availability, waiting terms, and pricing are confirmed directly.",
  },
  corporate: {
    slug: "corporate", eyebrow: "CORPORATE CAR RENTAL", title: "A rental plan for business on the move.",
    description: "Share dates, locations, vehicle needs, and whether the schedule is one-off or recurring. Olasco will confirm the options, service capacity, quote, and any corporate account terms.",
    points: ["One-off or recurring business trips", "Vehicle class and driver options", "Schedules, routes, and passenger needs", "Account and invoicing terms require confirmation"],
    serviceType: "DAILY_RENTAL", metaTitle: "Corporate car rental in Lagos and Abuja", metaDescription: "Arrange a corporate or executive car rental in Lagos or Abuja. Discuss the schedule, vehicle, driver options, availability, and account terms with Olasco.",
  },
  interstate: {
    slug: "interstate", eyebrow: "INTERSTATE CAR RENTAL", title: "Start with the route. Confirm before you go.",
    description: "Share origin, destination, dates, passenger count, and whether you need a driver. Olasco checks route eligibility, vehicle, operating conditions, and price before accepting the trip.",
    points: ["Add origin and destination", "Share both travel dates", "Request a driver if needed", "Route and price must be confirmed"],
    serviceType: "INTERSTATE_TRIP", metaTitle: "Interstate car rental and trips in Nigeria", metaDescription: "Request an interstate car rental or trip with Olasco Autos. Route eligibility, vehicle, driver requirements, conditions, and pricing are confirmed per itinerary.",
  },
};

export const saleCategoryPages: Record<string, CatalogPageContent> = {
  luxury: {
    slug: "luxury", eyebrow: "LUXURY CARS FOR SALE", title: "A luxury car, with the facts in view.",
    description: "Tell Olasco the make, model, city, and budget you have in mind. Ask for owner-verified current stock, approved photos, inspection arrangements, and the full handover process.", category: "LUXURY", mode: "sale",
    metaTitle: "Luxury cars for sale in Lagos and Abuja", metaDescription: "Ask Olasco Autos about verified luxury cars for sale in Lagos and Abuja. Current stock, price, inspection, and handover details are confirmed directly.",
  },
  suv: {
    slug: "suv", eyebrow: "SUVS FOR SALE", title: "Find a useful SUV for the life you lead.",
    description: "Share your preferred make, model, budget, and city. Olasco will confirm which SUVs are genuinely available and explain inspection, documents, price, and handover details.", category: "SUV", mode: "sale",
    metaTitle: "SUVs for sale in Lagos and Abuja", metaDescription: "Request verified SUV options for sale in Lagos or Abuja. Ask Olasco about current stock, inspection, pricing, vehicle records, and handover.",
  },
  executive: {
    slug: "executive", eyebrow: "EXECUTIVE CARS FOR SALE", title: "The right executive car starts with the right checks.",
    description: "Ask about a specific executive model or share the kind of car you want. Olasco can confirm current options and arrange a conversation about inspection and documentation.", category: "EXECUTIVE", mode: "sale",
    metaTitle: "Executive cars for sale in Lagos and Abuja", metaDescription: "Explore verified executive vehicles for sale through Olasco Autos in Lagos and Abuja. Ask for current listing details, inspection, and handover terms.",
  },
};
