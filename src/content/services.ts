import type { PickupServiceType } from "@/domain/types";

export const serviceCards = [
  {
    eyebrow: "01 / RENT",
    title: "Daily & extended rentals",
    description: "Request a car for a day, a longer stay, or a trip between cities. The team checks the exact vehicle and rate with you.",
    href: "/rentals",
    action: "Explore rentals",
    image: "/images/hero-suv.jpg",
    imageAlt: "Representative photograph of a premium SUV, not a live Olasco listing",
  },
  {
    eyebrow: "02 / OWN",
    title: "Find your next car",
    description: "Tell us the make, class, or budget you have in mind. Ask for verified current options and arrange a purchase conversation.",
    href: "/cars",
    action: "Explore car sales",
    image: "/images/executive-sedan.jpg",
    imageAlt: "Representative photograph of an executive sedan, not a live Olasco listing",
  },
  {
    eyebrow: "03 / ARRIVE",
    title: "Pickup & chauffeur",
    description: "Plan an airport arrival, city transfer, or a journey with a driver. Share the itinerary; Olasco confirms coverage and pricing.",
    href: "/pickup",
    action: "Arrange a pickup",
    image: "/images/chauffeur-pickup.jpg",
    imageAlt: "Stock photograph illustrating a chauffeur loading luggage into a car",
  },
  {
    eyebrow: "04 / TRAVEL",
    title: "Business, events & more",
    description: "Coordinate business trips, conferences, private events, or an interstate itinerary through one human contact.",
    href: "/pickup/corporate",
    action: "Plan group travel",
    image: "/images/abuja-city.jpg",
    imageAlt: "Representative city view in Abuja, Nigeria",
  },
] as const;

export const rentalCategories = [
  {
    name: "SUVs",
    key: "suv",
    description: "Tell us the space, route, and dates you need. Exact models are confirmed by the team.",
    image: "/images/hero-suv.jpg",
    alt: "Representative SUV photograph; not a current Olasco listing",
  },
  {
    name: "Executive sedans",
    key: "executive",
    description: "A composed option for meetings, longer drives, and business travel.",
    image: "/images/executive-sedan.jpg",
    alt: "Representative sedan photograph; not a current Olasco listing",
  },
  {
    name: "City cars",
    key: "sedan",
    description: "Ask about a practical car for a day in the city or an extended stay.",
    image: "/images/lagos-city.jpg",
    alt: "Lagos city street and buildings, used as editorial city imagery",
  },
] as const;

export interface PickupServiceContent {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  details: string[];
  serviceType: PickupServiceType;
  context: "pickup" | "airport" | "corporate" | "event" | "interstate";
  image: string;
  imageAlt: string;
}

export const pickupServices: PickupServiceContent[] = [
  {
    slug: "airport",
    title: "Airport pickup, without the guesswork.",
    eyebrow: "AIRPORT ARRIVALS",
    description: "Share your airport, arrival time, passenger count, and destination. The team confirms the meeting point, availability, waiting arrangements, and quote before you travel.",
    details: ["Arrival and destination details", "Passenger and luggage needs", "Meeting point confirmed with the team", "Quote shared before confirmation"],
    serviceType: "AIRPORT_PICKUP",
    context: "airport",
    image: "/images/chauffeur-pickup.jpg",
    imageAlt: "Stock image of a chauffeur arranging luggage beside a car",
  },
  {
    slug: "chauffeur",
    title: "A driver for the journey ahead.",
    eyebrow: "CHAUFFEUR SERVICES",
    description: "Request a chauffeur for a city journey, a full-day schedule, or a route that needs planning. Vehicle class, timing, and coverage are confirmed for each itinerary.",
    details: ["Driver-required options", "Single or multi-stop itinerary", "Vehicle class agreed in advance", "Availability and pricing confirmed per request"],
    serviceType: "CHAUFFEUR",
    context: "pickup",
    image: "/images/executive-sedan.jpg",
    imageAlt: "Representative sedan photograph used for chauffeur-service editorial content",
  },
  {
    slug: "corporate",
    title: "Business travel that stays coordinated.",
    eyebrow: "CORPORATE MOBILITY",
    description: "Coordinate airport runs, meetings, business trips, and recurring travel. Send the schedule and team size; Olasco will confirm workable vehicle and service options.",
    details: ["Meeting and airport schedules", "Business and corporate trips", "Recurring or one-off requests", "Invoice and account terms require confirmation"],
    serviceType: "CORPORATE_TRAVEL",
    context: "corporate",
    image: "/images/chauffeur-pickup.jpg",
    imageAlt: "Stock photograph illustrating a chauffeur-assisted business journey",
  },
  {
    slug: "events",
    title: "Move guests with the event in mind.",
    eyebrow: "EVENTS & CONFERENCES",
    description: "For a conference, private event, or scheduled group movement, share the venues, timings, passenger numbers, and route. Capacity and pricing are confirmed before anything is booked.",
    details: ["Event and conference transport requests", "Venue-to-venue planning", "Passenger count and schedule review", "Fleet capacity and quote confirmed case by case"],
    serviceType: "EVENT_TRANSPORT",
    context: "event",
    image: "/images/abuja-city.jpg",
    imageAlt: "Representative view of Abuja city used for event-transport editorial content",
  },
  {
    slug: "interstate",
    title: "Plan the route before the wheels turn.",
    eyebrow: "INTERSTATE TRIPS",
    description: "Share your origin, destination, travel dates, and whether you need a driver. Olasco confirms route eligibility, vehicle, conditions, and total quote before accepting the request.",
    details: ["Origin and destination review", "Driver option requested up front", "Route and date approval required", "Pricing shared before confirmation"],
    serviceType: "INTERSTATE_TRIP",
    context: "interstate",
    image: "/images/hero-suv.jpg",
    imageAlt: "Representative SUV photograph used to illustrate an interstate trip",
  },
  {
    slug: "city-transfer",
    title: "A pickup shaped around your day.",
    eyebrow: "CITY TRANSFERS",
    description: "Request a transfer between addresses in Lagos or Abuja. Share the route, preferred time, and passenger details so the team can check coverage and quote accurately.",
    details: ["Point-to-point transfer request", "Lagos and Abuja enquiries", "Pickup time and passenger details", "Route availability and quote confirmed"],
    serviceType: "CITY_TRANSFER",
    context: "pickup",
    image: "/images/lagos-city.jpg",
    imageAlt: "Lagos city view used as representative city-transfer imagery",
  },
];
