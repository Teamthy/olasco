import { describe, expect, it } from "vitest";
import { businessConfig } from "@/config/business";
import { createContextMessage, createWhatsAppLink } from "@/lib/whatsapp";

describe("WhatsApp handoff", () => {
  it("uses the configured Olasco number and encodes a contextual message", () => {
    const message = "Hello Olasco Autos,\nVehicle: SUV / Lagos & Abuja?";
    const url = createWhatsAppLink({ message });
    expect(url).toBe(`https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(message)}`);
    expect(url).toContain("%0A");
  });

  it("normalizes the supplied local Nigerian mobile number", () => {
    expect(createWhatsAppLink({ phone: "0815 159 4253", message: "Good morning" })).toBe("https://wa.me/2348151594253?text=Good%20morning");
  });

  it("includes the public booking reference and journey in a follow-up message", () => {
    const message = createContextMessage("booking-follow-up", {
      reference: "OLA-2026-000123",
      vehicle: "SUV",
      location: "Lagos",
      pickupDate: "2026-10-10",
      returnDate: "2026-10-14",
      pickupTime: "09:30",
      fullName: "Ada Okafor",
      phone: "+2348151594253",
    });
    expect(message).toContain("OLA-2026-000123");
    expect(message).toContain("SUV");
    expect(message).toContain("10 October 2026");
    expect(message).toContain("Ada Okafor");
  });
});
