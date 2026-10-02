import { businessConfig } from "@/config/business";

export type WhatsAppContext =
  | "general"
  | "rental"
  | "purchase"
  | "pickup"
  | "airport"
  | "corporate"
  | "event"
  | "interstate"
  | "booking-follow-up";

export function createWhatsAppLink({
  phone = businessConfig.whatsappNumber,
  message,
}: {
  phone?: string;
  message: string;
}) {
  let normalizedPhone = phone.replace(/\D/g, "");
  if (normalizedPhone.startsWith("0") && normalizedPhone.length === 11) normalizedPhone = `234${normalizedPhone.slice(1)}`;
  const safeMessage = message.trim();
  if (!normalizedPhone || !safeMessage) return "https://wa.me/";
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(safeMessage)}`;
}

export function formatJourneyDate(value?: string) {
  if (!value) return "Not specified";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
}

export function createContextMessage(context: WhatsAppContext, details: Record<string, string | undefined> = {}) {
  const value = (key: string, fallback = "Not specified") => details[key]?.trim() || fallback;
  const hello = "Hello Olasco Autos,";

  if (context === "booking-follow-up") {
    return [
      hello,
      "I am following up on my rental request from the website.",
      "",
      `Booking reference: ${value("reference")}`,
      `Vehicle / class: ${value("vehicle", "I would like help choosing")}`,
      `Location: ${value("location")}`,
      `Pickup: ${formatJourneyDate(details.pickupDate)} at ${value("pickupTime")}`,
      `Return: ${formatJourneyDate(details.returnDate)}`,
      `Pickup point: ${value("pickupAddress")}`,
      `Destination: ${value("destination")}`,
      `Name: ${value("fullName")}`,
      `Phone: ${value("phone")}`,
      "",
      "Please confirm whether you can locate this request, then advise on availability, current pricing, requirements, and next steps. Thank you.",
    ].join("\n");
  }

  if (context === "rental") {
    return [
      hello,
      "I am interested in renting a car.",
      `Preferred class: ${value("vehicle", "Please recommend an option")}`,
      `City: ${value("location")}`,
      `Pickup date: ${formatJourneyDate(details.pickupDate)}`,
      `Return date: ${formatJourneyDate(details.returnDate)}`,
      `Rental type: ${value("serviceType", "Please advise")}`,
      "Please share current availability, rates, and requirements.",
    ].join("\n");
  }

  if (context === "purchase") {
    return [
      hello,
      "I would like to discuss buying a vehicle.",
      `Vehicle / type: ${value("vehicle", "Please help me find the right car")}`,
      `City: ${value("location")}`,
      `Budget: ${value("budget")}`,
      `Name: ${value("fullName")}`,
      `Phone: ${value("phone")}`,
      `Notes: ${value("message")}`,
      "Please share verified current options and the inspection / handover process.",
    ].join("\n");
  }

  if (context === "pickup" || context === "airport" || context === "corporate" || context === "event" || context === "interstate") {
    const service = {
      pickup: "a pickup or transfer",
      airport: "an airport pickup",
      corporate: "corporate or business travel",
      event: "event or conference transport",
      interstate: "an interstate trip",
    }[context];
    return [
      hello,
      `I am enquiring about ${service}.`,
      `City: ${value("location")}`,
      `Pickup: ${value("pickupAddress")}`,
      `Destination: ${value("destination")}`,
      `Date: ${formatJourneyDate(details.pickupDate)}`,
      `Time: ${value("pickupTime")}`,
      `Passengers: ${value("passengers")}`,
      `Name: ${value("fullName")}`,
      `Phone: ${value("phone")}`,
      `Notes: ${value("message")}`,
      "Please confirm whether the itinerary can be covered and share a quote.",
    ].join("\n");
  }

  return [
    hello,
    "I have a question about Olasco Autos services.",
    `Service: ${value("service", "Please help me choose")}`,
    `City: ${value("location")}`,
    `Name: ${value("fullName")}`,
    `Phone: ${value("phone")}`,
    `Message: ${value("message")}`,
    "Please get back to me when convenient. Thank you.",
  ].join("\n");
}
