import { describe, expect, it } from "vitest";
import { bookingRequestSchema, contactSchema, inquirySchema, normalizePhone, pickupRequestSchema } from "@/server/schemas";

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + count);
  return next.toISOString().slice(0, 10);
}

function validBooking() {
  const pickupDate = addDays(new Date(), 2);
  return {
    fullName: "Ada Okafor",
    phone: "0815 159 4253",
    email: "",
    serviceType: "DAILY_RENTAL",
    requestedVehicle: "SUV",
    location: "Lagos",
    pickupDate,
    returnDate: addDays(new Date(`${pickupDate}T00:00:00.000Z`), 3),
    pickupTime: "09:00",
    pickupAddress: "Victoria Island, Lagos",
    destination: "",
    passengers: 2,
    driverRequired: false,
    specialRequest: "",
    consent: true,
  };
}

function validPickup() {
  const pickupDate = addDays(new Date(), 2);
  return {
    fullName: "Ada Okafor",
    phone: "0815 159 4253",
    email: "",
    serviceType: "AIRPORT_PICKUP",
    city: "Lagos",
    pickupDate,
    pickupTime: "10:30",
    returnDate: addDays(new Date(`${pickupDate}T00:00:00.000Z`), 1),
    pickupAddress: "Murtala Muhammed Airport, Lagos",
    destination: "Victoria Island, Lagos",
    passengers: 2,
    luggage: "Two bags",
    specialRequest: "",
    consent: true,
  };
}

describe("booking request validation", () => {
  it("accepts a valid rental request and normalizes the Nigerian phone number", () => {
    const result = bookingRequestSchema.safeParse(validBooking());
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone).toBe("+2348151594253");
  });

  it("rejects a return date before pickup", () => {
    const booking = validBooking();
    booking.returnDate = addDays(new Date(`${booking.pickupDate}T00:00:00.000Z`), -1);
    const result = bookingRequestSchema.safeParse(booking);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path.includes("returnDate"))).toBe(true);
  });

  it("rejects an impossible calendar date", () => {
    const result = bookingRequestSchema.safeParse({ ...validBooking(), pickupDate: "2026-02-31" });
    expect(result.success).toBe(false);
  });

  it("requires a destination for interstate requests", () => {
    const booking = validBooking();
    const result = bookingRequestSchema.safeParse({ ...booking, serviceType: "INTERSTATE_TRIP", destination: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path.includes("destination"))).toBe(true);
  });

  it("normalizes local and international contact formats", () => {
    expect(normalizePhone("0815-159-4253")).toBe("+2348151594253");
    expect(normalizePhone("+1 (415) 555-0100")).toBe("+14155550100");
  });

  it("accepts the pickup form payload, including optional return and luggage details", () => {
    const result = pickupRequestSchema.safeParse(validPickup());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+2348151594253");
      expect(result.data.luggage).toBe("Two bags");
    }
  });

  it("accepts the purchase inquiry form payload with no city preference", () => {
    const result = inquirySchema.safeParse({
      fullName: "Ada Okafor",
      phone: "08151594253",
      email: "",
      type: "PURCHASE_CONSULTATION",
      city: undefined,
      preferredVehicle: "SUV",
      budget: "",
      message: "I would like to discuss verified SUV options.",
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts the contact form payload and rejects a missing consent", () => {
    const contact = {
      fullName: "Ada Okafor",
      phone: "08151594253",
      email: "",
      subject: "Rental question",
      message: "Please tell me how to request a rental.",
      consent: true,
    };
    expect(contactSchema.safeParse(contact).success).toBe(true);
    expect(contactSchema.safeParse({ ...contact, consent: false }).success).toBe(false);
  });
});
