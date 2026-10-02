"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ActionButton, FieldError } from "@/components/ui";
import { createContextMessage, createWhatsAppLink } from "@/lib/whatsapp";

export function ContactForm() {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", subject: "", message: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  function update(key: keyof typeof form, value: string | boolean) {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload.fieldErrors && typeof payload.fieldErrors === "object") setErrors(payload.fieldErrors as Record<string, string>);
        throw new Error(typeof payload.error === "string" ? payload.error : "We could not send your message.");
      }
      setReference(payload.reference as string);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Connection issue. Please try again or contact Olasco on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    const message = createContextMessage("general", { service: "Contact message", reference, fullName: form.fullName, phone: form.phone, message: form.message });
    return (
      <section className="form-success" aria-live="polite">
        <span className="confirmation-mark"><CheckCircle2 size={26} aria-hidden="true" /></span>
        <p className="eyebrow">MESSAGE RECEIVED</p>
        <h2>Thank you for reaching out.</h2>
        <p>Your message is saved with reference <strong>{reference}</strong>. If you need a quicker answer, continue the conversation on WhatsApp.</p>
        <div className="confirmation-actions">
          <a className="button button--primary" href={createWhatsAppLink({ message })} target="_blank" rel="noopener noreferrer">Continue on WhatsApp<ArrowUpRight size={15} aria-hidden="true" /></a>
          <Link className="button button--outline" href="/">Back to home</Link>
        </div>
      </section>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <p className="eyebrow">CONTACT / SEND A MESSAGE</p>
      <h2>What can we help with?</h2>
      <p className="form-card-intro">Tell us the city and service you are interested in. Your note is saved so the team has context when they reply.</p>
      {formError ? <p className="form-message" role="alert">{formError}</p> : null}
      <div className="form-grid">
        <div className="form-field form-field--full">
          <label htmlFor="contact-name">Full name</label>
          <input id="contact-name" autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "contact-name-error" : undefined} />
          <FieldError id="contact-name-error">{errors.fullName}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="contact-phone">Phone / WhatsApp</label>
          <input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0815 159 4253" value={form.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} />
          <FieldError id="contact-phone-error">{errors.phone}</FieldError>
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Email <span className="optional">Optional</span></label>
          <input id="contact-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />
          <FieldError id="contact-email-error">{errors.email}</FieldError>
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="contact-subject">Subject</label>
          <input id="contact-subject" placeholder="Rental, vehicle purchase, pickup…" value={form.subject} onChange={(event) => update("subject", event.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "contact-subject-error" : undefined} />
          <FieldError id="contact-subject-error">{errors.subject}</FieldError>
        </div>
        <div className="form-field form-field--full">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" placeholder="Share what you need and when." value={form.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} />
          <FieldError id="contact-message-error">{errors.message}</FieldError>
        </div>
        <div className="form-field form-field--full">
          <label className="checkbox-row" htmlFor="contact-consent"><input id="contact-consent" type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "contact-consent-error" : undefined} /><span>I agree that Olasco Autos may use these details to respond. I have read the <Link href="/privacy" target="_blank">privacy notice</Link>.</span></label>
          <FieldError id="contact-consent-error">{errors.consent}</FieldError>
        </div>
      </div>
      <div className="form-actions"><span className="form-submit-note">For the quickest route to a person, use WhatsApp.</span><ActionButton type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send message"}<ArrowUpRight size={14} aria-hidden="true" /></ActionButton></div>
    </form>
  );
}
