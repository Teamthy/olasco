import { z } from "zod";
import type { CityLabel } from "@/domain/types";

const citySchema = z.enum(["Lagos", "Abuja"]);
const optionalEmailSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().email("Enter a valid email address.").max(254).optional(),
);

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) return `+234${digits.slice(1)}`;
  if (digits.startsWith("234")) return `+${digits}`;
  return `+${digits}`;
}

const phoneSchema = z
  .string()
  .trim()
  .min(8, "Enter a phone number we can reach.")
  .max(24, "Enter a valid phone number.")
  .regex(/^\+?[\d\s().-]+$/, "Enter a valid phone number.")
  .transform(normalizePhone)
  .refine((value) => /^\+\d{9,15}$/.test(value), "Enter a valid phone number with country code.");

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Choose a valid calendar date.");

const notInPast = (value: string) => value >= new Date().toISOString().slice(0, 10);
const basePerson = {
  fullName: z.string().trim().min(2, "Enter your name.").max(100, "Name is too long."),
  phone: phoneSchema,
  email: optionalEmailSchema,
  consent: z.boolean().refine((value) => value, "Please agree to be contacted about this request."),
};

export const bookingRequestSchema = z
  .object({
    ...basePerson,
    serviceType: z.enum(["DAILY_RENTAL", "LONG_TERM_RENTAL", "INTERSTATE_TRIP"]),
    requestedVehicle: z.string().trim().max(100).optional().default(""),
    vehicleSlug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    location: citySchema,
    pickupDate: dateOnlySchema.refine(notInPast, "Pickup date cannot be in the past."),
    returnDate: dateOnlySchema,
    pickupTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a pickup time."),
    pickupAddress: z.string().trim().min(4, "Enter a pickup address or meeting point.").max(200),
    destination: z.string().trim().max(200).optional().default(""),
    passengers: z.number().int().min(1, "At least one passenger is required.").max(50),
    driverRequired: z.boolean(),
    specialRequest: z.string().trim().max(1200).optional().default(""),
  })
  .superRefine((value, context) => {
    if (value.returnDate < value.pickupDate) {
      context.addIssue({ code: "custom", path: ["returnDate"], message: "Return date cannot be before pickup." });
    }
    if (value.serviceType === "INTERSTATE_TRIP" && !value.destination?.trim()) {
      context.addIssue({ code: "custom", path: ["destination"], message: "Add the interstate destination." });
    }
    if (value.vehicleSlug && !value.requestedVehicle) {
      context.addIssue({ code: "custom", path: ["requestedVehicle"], message: "Vehicle details are missing." });
    }
  });

export const pickupRequestSchema = z
  .object({
    ...basePerson,
    serviceType: z.enum([
      "AIRPORT_PICKUP",
      "CHAUFFEUR",
      "CORPORATE_TRAVEL",
      "EVENT_TRANSPORT",
      "INTERSTATE_TRIP",
      "CITY_TRANSFER",
    ]),
    city: citySchema,
    pickupDate: dateOnlySchema.refine(notInPast, "Pickup date cannot be in the past."),
    pickupTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a pickup time."),
    returnDate: dateOnlySchema.optional(),
    pickupAddress: z.string().trim().min(4, "Enter your pickup point.").max(200),
    destination: z.string().trim().min(2, "Enter your destination.").max(200),
    passengers: z.number().int().min(1).max(50),
    luggage: z.string().trim().max(160).optional().default(""),
    specialRequest: z.string().trim().max(1200).optional().default(""),
  })
  .superRefine((value, context) => {
    if (value.returnDate && value.returnDate < value.pickupDate) {
      context.addIssue({ code: "custom", path: ["returnDate"], message: "Return date cannot be before pickup." });
    }
  });

export const inquirySchema = z.object({
  ...basePerson,
  type: z.enum(["PURCHASE_CONSULTATION", "SELL_TRADE_IN", "GENERAL"]),
  city: citySchema.optional(),
  preferredVehicle: z.string().trim().max(120).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(8, "Add a little detail so the team can help.").max(1200),
});

export const contactSchema = z.object({
  ...basePerson,
  subject: z.string().trim().min(3, "Add a subject.").max(120),
  message: z.string().trim().min(10, "Add a message.").max(1600),
});

export const idempotencyKeySchema = z.string().uuid("Refresh the form and try again.");

export type BookingRequestValidated = z.infer<typeof bookingRequestSchema>;
export type PickupRequestValidated = z.infer<typeof pickupRequestSchema>;
export type InquiryValidated = z.infer<typeof inquirySchema>;
export type ContactValidated = z.infer<typeof contactSchema>;
export type CityValue = CityLabel;
