"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cityLabels } from "@/config/business";
import type { InquiryType } from "@/domain/types";
import { FieldError, ActionButton } from "@/components/ui";
import { createContextMessage, createWhatsAppLink } from "@/lib/whatsapp";

type InquiryFormState = {
  fullName: string;
  phone: string;
  email: string;
  type: InquiryType;
  city: string;
  preferredVehicle: string;
  budget: string;
  message: string;
  consent: boolean;
};

export function InquiryForm({
  type = "PURCHASE_CONSULTATION",
  initialCity = "",
  initialVehicle = "",
  title = "Start a purchase conversation",
}: {
  type?: InquiryType;
  initialCity?: string;
  initialVehicle?: string;
  title?: string;
}) {
  const [form, setForm] = useState<InquiryFormState>({ fullName: "", phone: "", email: "", type, city: initialCity, preferredVehicle: initialVehicle, budget: "", message: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  function update<K extends keyof InquiryFormState>(key: K, value: InquiryFormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
    setFormError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setFormError("");
    setErrors({});
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, city: form.city || undefined }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload.fieldErrors && typeof payload.fieldErrors === "object") setErrors(payload.fieldErrors as Record<string, string>);
        throw new Error(typeof payload.error === "string" ? payload.error : "We could not submit your enquiry.");
      }
      setResult({ reference: payload.reference as string });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Connection issue. Please try again or contact Olasco on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const message = createContextMessage("purchase", { reference: result.reference, vehicle: form.preferredVehicle, location: form.city, budget: form.budget, fullName: form.fullName, phone: form.phone, message: form.message });
    return (
      <section className="form-success" aria-live="polite">
        <span className="confirmation-mark"><CheckCircle2 size={26} aria-hidden="true" /></span>
        <p className="eyebrow">ENQUIRY RECEIVED</p>
        <h2>Thank you, {form.fullName.split(" ")[0]}.</h2>
        <p>Your purchase enquiry is saved with reference <strong>{result.reference}</strong>. A sales representative can continue with you on WhatsApp.</p>
        <div className="confirmation-actions">
          <a className="button button--primary" href={createWhatsAppLink({ message })} target="_blank" rel="noopener noreferrer">Continue on WhatsApp<ArrowUpRight size={15} aria-hidden="true" /></a>
          <Link className="button button--outline" href="/cars">Back to cars for sale</Link>
        </div>
      </section>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <p className="eyebrow">PURCHASE ENQUIRY</p>
      <h2>{title}</h2>
      <p className="form-card-intro">Tell us what you are looking for. Current stock, pricing, inspection, and handover details are confirmed directly.</p>
      {formError ? <p className="form-message" role="alert">{formError}</p> : null}
      <div className="form-grid">
        <div className="form-field form-field--full">
          <label htmlFor="inquiry-name">Full name</label>
          <input id="inquiry-name" autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "inquiry-name-error" : undefined} />
          <FieldError id="inquiry-name-error">{errors.fullName}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="inquiry-phone">Phone / WhatsApp</label>
          <input id="inquiry-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="0815 159 4253" value={form.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "inquiry-phone-error" : undefined} />
          <FieldError id="inquiry-phone-error">{errors.phone}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="inquiry-email">Email <span className="optional">Optional</span></label>
          <input id="inquiry-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "inquiry-email-error" : undefined} />
          <FieldError id="inquiry-email-error">{errors.email}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="inquiry-city">Preferred city</label>
          <select id="inquiry-city" value={form.city} onChange={(event) => update("city", event.target.value)}><option value="">No preference</option>{cityLabels.map((city) => <option key={city}>{city}</option>)}</select>
        </div>
        <div className="form-field">
          <label htmlFor="inquiry-vehicle">Vehicle of interest <span className="optional">Optional</span></label>
          <input id="inquiry-vehicle" placeholder="Make, model, or vehicle class" value={form.preferredVehicle} onChange={(event) => update("preferredVehicle", event.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="inquiry-budget">Budget <span className="optional">Optional</span></label>
          <input id="inquiry-budget" placeholder="NGN or quote on request" value={form.budget} onChange={(event) => update("budget", event.target.value)} />
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="inquiry-message">What would you like to know?</label>
          <textarea id="inquiry-message" placeholder="Share your ideal car, timing, or questions about inspection and handover." value={form.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "inquiry-message-error" : undefined} />
          <FieldError id="inquiry-message-error">{errors.message}</FieldError>
        </div>
        <div className="form-field form-field--full">
          <label className="checkbox-row" htmlFor="inquiry-consent"><input id="inquiry-consent" type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "inquiry-consent-error" : undefined} /><span>I agree that Olasco Autos may use these details to respond to this enquiry. I have read the <Link href="/privacy" target="_blank">privacy notice</Link>.</span></label>
          <FieldError id="inquiry-consent-error">{errors.consent}</FieldError>
        </div>
      </div>
      <div className="form-actions"><span className="form-submit-note">No payment or purchase commitment is created by this enquiry.</span><ActionButton type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send purchase enquiry"}<ArrowUpRight size={14} aria-hidden="true" /></ActionButton></div>
    </form>
  );
}
