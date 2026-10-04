"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MapPin } from "lucide-react";
import type { PickupServiceType } from "@/domain/types";
import { ActionButton, FieldError } from "@/components/ui";
import { ServiceAreaSelect } from "@/components/service-area-select";
import { createContextMessage, createWhatsAppLink, type WhatsAppContext } from "@/lib/whatsapp";

const serviceOptions: Array<{ value: PickupServiceType; label: string; context: WhatsAppContext }> = [
  { value: "AIRPORT_PICKUP", label: "Airport pickup", context: "airport" },
  { value: "CITY_TRANSFER", label: "City transfer / pickup", context: "pickup" },
  { value: "CHAUFFEUR", label: "Chauffeur service", context: "pickup" },
  { value: "CORPORATE_TRAVEL", label: "Corporate / business trip", context: "corporate" },
  { value: "EVENT_TRANSPORT", label: "Event / conference transport", context: "event" },
  { value: "INTERSTATE_TRIP", label: "Interstate trip", context: "interstate" },
];

function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

type PickupFormState = {
  fullName: string;
  phone: string;
  email: string;
  serviceType: PickupServiceType;
  city: "Lagos" | "Abuja";
  serviceArea: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  pickupAddress: string;
  destination: string;
  passengers: string;
  luggage: string;
  specialRequest: string;
  consent: boolean;
};

export function PickupRequestForm({ initialCity = "Lagos", initialService = "AIRPORT_PICKUP" }: { initialCity?: string; initialService?: PickupServiceType }) {
  const [form, setForm] = useState<PickupFormState>({
    fullName: "", phone: "", email: "", serviceType: initialService,
    city: initialCity === "Abuja" ? "Abuja" : "Lagos", serviceArea: "", pickupDate: "", pickupTime: "09:00", returnDate: "",
    pickupAddress: "", destination: "", passengers: "1", luggage: "", specialRequest: "", consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  function update<K extends keyof PickupFormState>(key: K, value: PickupFormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
    setFormError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});
    setFormError("");
    try {
      const response = await fetch("/api/pickup-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, passengers: Number(form.passengers), returnDate: form.returnDate || undefined }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload.fieldErrors && typeof payload.fieldErrors === "object") setErrors(payload.fieldErrors as Record<string, string>);
        throw new Error(typeof payload.error === "string" ? payload.error : "We could not send your request.");
      }
      setResult({ reference: payload.reference as string });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Connection issue. Please try again or contact Olasco on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const context = serviceOptions.find((item) => item.value === form.serviceType)?.context || "pickup";
    const message = createContextMessage(context, {
      reference: result.reference,
      service: serviceOptions.find((item) => item.value === form.serviceType)?.label,
      location: form.city,
      serviceArea: form.serviceArea,
      pickupAddress: form.pickupAddress,
      destination: form.destination,
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      passengers: form.passengers,
      fullName: form.fullName,
      phone: form.phone,
      message: [form.luggage && `Luggage: ${form.luggage}`, form.specialRequest].filter(Boolean).join("\n"),
    });
    return (
      <section className="form-success" aria-live="polite">
        <span className="confirmation-mark"><CheckCircle2 size={26} aria-hidden="true" /></span>
        <p className="eyebrow">PICKUP REQUEST RECEIVED</p>
        <h2>We have the itinerary.</h2>
        <p>Your request reference is <strong>{result.reference}</strong>. Olasco will confirm route coverage, timing, capacity, and the quote with you.</p>
        <div className="confirmation-actions">
          <a className="button button--primary" href={createWhatsAppLink({ message })} target="_blank" rel="noopener noreferrer">Continue on WhatsApp<ArrowUpRight size={15} aria-hidden="true" /></a>
          <Link className="button button--outline" href="/pickup">Back to pickup services</Link>
        </div>
      </section>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <p className="eyebrow">PICKUP / MOBILITY REQUEST</p>
      <h2>Share the itinerary.</h2>
      <p className="form-card-intro">This is a request, not a confirmed transfer. Airport meeting points, route coverage, waiting terms, vehicle capacity, and price are agreed with Olasco first.</p>
      {formError ? <p className="form-message" role="alert">{formError}</p> : null}
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="pickup-service">Service</label>
          <select id="pickup-service" value={form.serviceType} onChange={(event) => update("serviceType", event.target.value as PickupServiceType)}>
            {serviceOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </div>
        <ServiceAreaSelect
          city={form.city}
          onCityChange={(city) => update("city", city === "Abuja" ? "Abuja" : "Lagos")}
          area={form.serviceArea}
          onAreaChange={(area) => update("serviceArea", area)}
          cityId="pickup-city"
          areaId="pickup-area"
          cityLabel="City"
          areaOptional={false}
          error={errors.serviceArea}
        />
        <div className="form-field">
          <label htmlFor="pickup-date">Pickup date</label>
          <input id="pickup-date" type="date" min={localToday()} value={form.pickupDate} onChange={(event) => update("pickupDate", event.target.value)} aria-invalid={Boolean(errors.pickupDate)} aria-describedby={errors.pickupDate ? "pickup-date-error" : undefined} />
          <FieldError id="pickup-date-error">{errors.pickupDate}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="pickup-time">Pickup time</label>
          <input id="pickup-time" type="time" value={form.pickupTime} onChange={(event) => update("pickupTime", event.target.value)} aria-invalid={Boolean(errors.pickupTime)} aria-describedby={errors.pickupTime ? "pickup-time-error" : undefined} />
          <FieldError id="pickup-time-error">{errors.pickupTime}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="pickup-address">Pickup point</label>
          <input id="pickup-address" autoComplete="street-address" placeholder="Airport, hotel, office, or address" value={form.pickupAddress} onChange={(event) => update("pickupAddress", event.target.value)} aria-invalid={Boolean(errors.pickupAddress)} aria-describedby={errors.pickupAddress ? "pickup-address-error" : undefined} />
          <FieldError id="pickup-address-error">{errors.pickupAddress}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="pickup-destination">Destination</label>
          <input id="pickup-destination" placeholder="Where should we take you?" value={form.destination} onChange={(event) => update("destination", event.target.value)} aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? "pickup-destination-error" : undefined} />
          <FieldError id="pickup-destination-error">{errors.destination}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="pickup-passengers">Passengers</label>
          <select id="pickup-passengers" value={form.passengers} onChange={(event) => update("passengers", event.target.value)}>{Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option value={count} key={count}>{count}{count === 10 ? "+" : ""}</option>)}</select>
        </div>
        <div className="form-field">
          <label htmlFor="pickup-return-date">Return / end date <span className="optional">Optional</span></label>
          <input id="pickup-return-date" type="date" min={form.pickupDate || localToday()} value={form.returnDate} onChange={(event) => update("returnDate", event.target.value)} aria-invalid={Boolean(errors.returnDate)} aria-describedby={errors.returnDate ? "pickup-return-error" : undefined} />
          <FieldError id="pickup-return-error">{errors.returnDate}</FieldError>
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="pickup-luggage">Luggage / group details <span className="optional">Optional</span></label>
          <input id="pickup-luggage" placeholder="Number of bags, guests, or group notes" value={form.luggage} onChange={(event) => update("luggage", event.target.value)} />
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="pickup-notes">Schedule or extra details <span className="optional">Optional</span></label>
          <textarea id="pickup-notes" placeholder="Flight arrival details, stops, event schedule, or route notes" value={form.specialRequest} onChange={(event) => update("specialRequest", event.target.value)} />
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="pickup-name">Full name</label>
          <input id="pickup-name" autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "pickup-name-error" : undefined} />
          <FieldError id="pickup-name-error">{errors.fullName}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="pickup-phone">Phone / WhatsApp</label>
          <input id="pickup-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="0815 159 4253" value={form.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "pickup-phone-error" : undefined} />
          <FieldError id="pickup-phone-error">{errors.phone}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="pickup-email">Email <span className="optional">Optional</span></label>
          <input id="pickup-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "pickup-email-error" : undefined} />
          <FieldError id="pickup-email-error">{errors.email}</FieldError>
        </div>
        <div className="form-field form-field--full">
          <label className="checkbox-row" htmlFor="pickup-consent"><input id="pickup-consent" type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "pickup-consent-error" : undefined} /><span>I agree that Olasco Autos may use these details to respond. I have read the <Link href="/privacy" target="_blank">privacy notice</Link>.</span></label>
          <FieldError id="pickup-consent-error">{errors.consent}</FieldError>
        </div>
      </div>
      <div className="form-actions"><span className="form-submit-note"><MapPin size={13} aria-hidden="true" />Exact coverage is checked before acceptance.</span><ActionButton type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send pickup request"}<ArrowUpRight size={14} aria-hidden="true" /></ActionButton></div>
    </form>
  );
}
