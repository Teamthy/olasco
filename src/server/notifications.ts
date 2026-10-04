import nodemailer from "nodemailer";
import type { BookingConfirmation } from "@/domain/types";
import { formatJourneyDate } from "@/lib/whatsapp";
import type { LeadResult } from "@/server/repositories";

interface AdminNotification {
  reference: string;
  subject: string;
  text: string;
}

interface NotificationProvider {
  name: "smtp" | "whatsapp-cloud";
  send(notification: AdminNotification): Promise<void>;
}

function smtpProvider(): NotificationProvider | null {
  const enabled = process.env.EMAIL_PROVIDER === "smtp";
  const port = Number(process.env.SMTP_PORT || 587);
  if (!enabled || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.EMAIL_FROM || !process.env.ADMIN_EMAIL || !Number.isFinite(port)) {
    return null;
  }
  return {
    name: "smtp",
    async send(notification) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: process.env.SMTP_SECURE === "true" || port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: notification.subject,
        text: notification.text,
      });
    },
  };
}

function whatsappCloudProvider(): NotificationProvider | null {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE?.replace(/\D/g, "");
  const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION;
  if (!token || !phoneNumberId || !adminPhone || !graphVersion) return null;
  return {
    name: "whatsapp-cloud",
    async send(notification) {
      const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(graphVersion)}/${encodeURIComponent(phoneNumberId)}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: adminPhone,
          type: "text",
          text: { preview_url: false, body: `${notification.subject}\n\n${notification.text}`.slice(0, 3900) },
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        throw new Error(`WhatsApp Cloud API returned HTTP ${response.status}.`);
      }
    },
  };
}

async function dispatch(notification: AdminNotification) {
  const providers = [smtpProvider(), whatsappCloudProvider()].filter((provider): provider is NotificationProvider => Boolean(provider));
  if (!providers.length) {
    console.info(JSON.stringify({ event: "notification.skipped", reference: notification.reference, reason: "no_provider_configured", at: new Date().toISOString() }));
    return;
  }
  const results = await Promise.allSettled(providers.map((provider) => provider.send(notification)));
  results.forEach((result, index) => {
    const provider = providers[index];
    if (result.status === "fulfilled") {
      console.info(JSON.stringify({ event: "notification.sent", provider: provider.name, reference: notification.reference, at: new Date().toISOString() }));
    } else {
      console.error(JSON.stringify({ event: "notification.failed", provider: provider.name, reference: notification.reference, errorType: result.reason instanceof Error ? result.reason.name : "UnknownError", at: new Date().toISOString() }));
    }
  });
}

export async function notifyBooking(booking: BookingConfirmation, serviceType: string, passengers: number, driverRequired: boolean, notes: string) {
  const text = [
    `Reference: ${booking.reference}`,
    `Customer: ${booking.fullName}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email || "Not provided"}`,
    `Vehicle / class: ${booking.vehicle || "Not specified"}`,
    `Service: ${serviceType}`,
    `Location: ${booking.serviceArea ? `${booking.location} · ${booking.serviceArea}` : booking.location}`,
    `Pickup date: ${formatJourneyDate(booking.pickupDate)} at ${booking.pickupTime}`,
    `Return date: ${formatJourneyDate(booking.returnDate)}`,
    `Pickup address: ${booking.pickupAddress}`,
    `Destination: ${booking.destination || "Not provided"}`,
    `Passengers: ${passengers}`,
    `Driver requested: ${driverRequired ? "Yes" : "No"}`,
    `Notes: ${notes || "None"}`,
  ].join("\n");
  await dispatch({ reference: booking.reference, subject: `New Olasco rental request — ${booking.reference}`, text });
}

export async function notifyLead(lead: LeadResult, title: string) {
  const text = [
    `Reference: ${lead.reference}`,
    `Name: ${lead.fullName}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || "Not provided"}`,
    `Service: ${lead.serviceType || "General enquiry"}`,
    `City: ${lead.city ? (lead.serviceArea ? `${lead.city} · ${lead.serviceArea}` : lead.city) : "Not specified"}`,
    `Date and time: ${lead.pickupDate ? `${formatJourneyDate(lead.pickupDate)}${lead.pickupTime ? ` at ${lead.pickupTime}` : ""}` : "Not specified"}`,
    `Pickup: ${lead.pickupAddress || "Not specified"}`,
    `Destination: ${lead.destination || "Not specified"}`,
    `Passengers: ${lead.passengers ?? "Not specified"}`,
    `Details: ${lead.details || "None"}`,
  ].join("\n");
  await dispatch({ reference: lead.reference, subject: `${title} — ${lead.reference}`, text });
}
