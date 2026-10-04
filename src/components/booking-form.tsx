"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleCheck, MapPin, ShieldCheck } from "lucide-react";
import { ActionButton, FieldError } from "@/components/ui";
import { ServiceAreaSelect } from "@/components/service-area-select";
import type { RentalServiceType } from "@/domain/types";

type BookingFormState = {
  fullName: string;
  phone: string;
  email: string;
  serviceType: RentalServiceType;
  requestedVehicle: string;
  vehicleSlug: string;
  location: "Lagos" | "Abuja";
  serviceArea: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  pickupAddress: string;
  destination: string;
  passengers: string;
  driverRequired: boolean;
  specialRequest: string;
  consent: boolean;
};

function localToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function createIdempotencyKey() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    return (character === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}

function categoryLabel(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "executive" || normalized === "executive sedan") return "Executive sedan";
  if (normalized === "luxury" || normalized === "luxury vehicle") return "Luxury vehicle";
  if (normalized === "sedan") return "Sedan";
  if (normalized === "van" || normalized === "people carrier") return "People carrier";
  if (normalized === "not sure" || normalized === "help me choose") return "Help me choose";
  return value || "SUV";
}

export function BookingForm({
  initialLocation = "Lagos",
  initialCategory = "SUV",
  initialPickupDate = "",
  initialReturnDate = "",
  initialVehicleSlug = "",
  initialVehicleName = "",
  initialService = "DAILY_RENTAL",
  initialServiceArea = "",
}: {
  initialLocation?: string;
  initialCategory?: string;
  initialPickupDate?: string;
  initialReturnDate?: string;
  initialVehicleSlug?: string;
  initialVehicleName?: string;
  initialService?: RentalServiceType;
  initialServiceArea?: string;
}) {
  const router = useRouter();
  const requestKey = useRef("");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<BookingFormState>({
    fullName: "",
    phone: "",
    email: "",
    serviceType: initialService,
    requestedVehicle: initialVehicleName || categoryLabel(initialCategory),
    vehicleSlug: initialVehicleSlug,
    location: initialLocation === "Abuja" ? "Abuja" : "Lagos",
    serviceArea: initialServiceArea,
    pickupDate: initialPickupDate,
    returnDate: initialReturnDate,
    pickupTime: "09:00",
    pickupAddress: "",
    destination: "",
    passengers: "1",
    driverRequired: false,
    specialRequest: "",
    consent: false,
  });

  function update<K extends keyof BookingFormState>(key: K, value: BookingFormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "", form: "" }));
    setFormError("");
  }

  function validateStep(current: number) {
    const nextErrors: Record<string, string> = {};
    if (current === 1) {
      if (!form.requestedVehicle.trim()) nextErrors.requestedVehicle = "Choose a vehicle class or tell us what you need.";
      if (!form.pickupDate) nextErrors.pickupDate = "Choose a pickup date.";
      else if (form.pickupDate < localToday()) nextErrors.pickupDate = "Pickup date cannot be in the past.";
      if (!form.returnDate) nextErrors.returnDate = "Choose a return date.";
      else if (form.pickupDate && form.returnDate < form.pickupDate) nextErrors.returnDate = "Return date cannot be before pickup.";
      if (!form.pickupTime) nextErrors.pickupTime = "Choose a pickup time.";
      if (form.pickupAddress.trim().length < 4) nextErrors.pickupAddress = "Enter a pickup address or meeting point.";
      if (!form.serviceArea) nextErrors.serviceArea = "Choose the pickup local government area.";
      if (form.serviceType === "INTERSTATE_TRIP" && form.destination.trim().length < 2) nextErrors.destination = "Add the interstate destination.";
      if (!Number.isInteger(Number(form.passengers)) || Number(form.passengers) < 1) nextErrors.passengers = "Enter at least one passenger.";
    }
    if (current === 2) {
      if (form.fullName.trim().length < 2) nextErrors.fullName = "Enter your name.";
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 9 || digits.length > 15) nextErrors.phone = "Enter a valid phone number, including country code if outside Nigeria.";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
      if (!form.consent) nextErrors.consent = "Please agree to be contacted about this request.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    setFormError("");
    if (!validateStep(step)) return;
    setStep((current) => Math.min(3, current + 1));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !validateStep(2)) return;
    setSubmitting(true);
    setFormError("");
    try {
      if (!requestKey.current) requestKey.current = createIdempotencyKey();
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey.current },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          serviceType: form.serviceType,
          requestedVehicle: form.requestedVehicle,
          ...(form.vehicleSlug ? { vehicleSlug: form.vehicleSlug } : {}),
          location: form.location,
          serviceArea: form.serviceArea,
          pickupDate: form.pickupDate,
          returnDate: form.returnDate,
          pickupTime: form.pickupTime,
          pickupAddress: form.pickupAddress,
          destination: form.destination,
          passengers: Number(form.passengers),
          driverRequired: form.driverRequired,
          specialRequest: form.specialRequest,
          consent: form.consent,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload.fieldErrors && typeof payload.fieldErrors === "object") setErrors(payload.fieldErrors as Record<string, string>);
        throw new Error(typeof payload.error === "string" ? payload.error : "We could not submit your request.");
      }
      if (typeof payload.reference !== "string" || !/^OLA-\d{4}-\d{6}$/.test(payload.reference)) {
        throw new Error("The response did not include a valid booking reference. Please retry this request or contact Olasco on WhatsApp.");
      }
      router.push(`/rentals/booking/confirmation/${encodeURIComponent(payload.reference)}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Connection issue. Please try again or contact Olasco on WhatsApp.");
      setSubmitting(false);
    }
  }

  return (
    <div className="form-layout">
      <form className="form-card" onSubmit={submit} noValidate>
        <p className="eyebrow">RENTAL REQUEST / NO PAYMENT REQUIRED</p>
        <h2>Tell us about the journey.</h2>
        <p className="form-card-intro">Your request is not a confirmed reservation. Olasco will check the vehicle, terms, and price with you before confirming.</p>
        <ol className="stepper" aria-label={`Step ${step} of 3`}>
          {["Journey", "Your details", "Review"].map((label, index) => <li className={step === index + 1 ? "is-active" : step > index + 1 ? "is-done" : ""} key={label} aria-current={step === index + 1 ? "step" : undefined}>{label}</li>)}
        </ol>
        {formError ? <p className="form-message" role="alert">{formError}</p> : null}

        {step === 1 ? (
          <fieldset className="form-fieldset">
            <legend className="form-section-title">What should we plan?</legend>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="booking-service">Rental type</label>
                <select id="booking-service" value={form.serviceType} onChange={(event) => update("serviceType", event.target.value as RentalServiceType)}>
                  <option value="DAILY_RENTAL">Daily rental</option>
                  <option value="LONG_TERM_RENTAL">Long-term rental</option>
                  <option value="INTERSTATE_TRIP">Interstate trip</option>
                </select>
              </div>
              <ServiceAreaSelect
                city={form.location}
                onCityChange={(city) => update("location", city === "Abuja" ? "Abuja" : "Lagos")}
                area={form.serviceArea}
                onAreaChange={(area) => update("serviceArea", area)}
                cityId="booking-city"
                areaId="booking-area"
                cityLabel="City"
                areaOptional={false}
                error={errors.serviceArea}
              />
              <div className="form-field">
                <label htmlFor="booking-class">Preferred vehicle class</label>
                <select id="booking-class" value={form.requestedVehicle} onChange={(event) => { update("requestedVehicle", event.target.value); update("vehicleSlug", ""); }} aria-invalid={Boolean(errors.requestedVehicle)} aria-describedby={errors.requestedVehicle ? "booking-class-error" : "booking-class-help"}>
                  <option value="">Choose a class</option>
                  {initialVehicleName ? <option value={initialVehicleName}>{initialVehicleName} · selected vehicle</option> : null}
                  <option value="SUV">SUV</option>
                  <option value="Executive sedan">Executive sedan</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Luxury vehicle">Luxury vehicle</option>
                  <option value="People carrier">People carrier / van</option>
                  <option value="Help me choose">Help me choose</option>
                </select>
                <FieldError id="booking-class-error">{errors.requestedVehicle}</FieldError>
                {!errors.requestedVehicle ? <p className="form-help" id="booking-class-help">Exact make, model, availability, and rate are confirmed by the team.</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="booking-passengers">Passengers</label>
                <select id="booking-passengers" value={form.passengers} onChange={(event) => update("passengers", event.target.value)} aria-invalid={Boolean(errors.passengers)} aria-describedby={errors.passengers ? "booking-passengers-error" : undefined}>
                  {[1,2,3,4,5,6,7,8,9,10].map((count) => <option key={count} value={count}>{count}{count === 10 ? "+" : ""}</option>)}
                </select>
                <FieldError id="booking-passengers-error">{errors.passengers}</FieldError>
              </div>
              <div className="form-field">
                <label htmlFor="booking-pickup-date">Pickup date</label>
                <input id="booking-pickup-date" type="date" min={localToday()} value={form.pickupDate} onChange={(event) => update("pickupDate", event.target.value)} aria-invalid={Boolean(errors.pickupDate)} aria-describedby={errors.pickupDate ? "booking-pickup-date-error" : undefined} />
                <FieldError id="booking-pickup-date-error">{errors.pickupDate}</FieldError>
              </div>
              <div className="form-field">
                <label htmlFor="booking-return-date">Return date</label>
                <input id="booking-return-date" type="date" min={form.pickupDate || localToday()} value={form.returnDate} onChange={(event) => update("returnDate", event.target.value)} aria-invalid={Boolean(errors.returnDate)} aria-describedby={errors.returnDate ? "booking-return-date-error" : undefined} />
                <FieldError id="booking-return-date-error">{errors.returnDate}</FieldError>
              </div>
              <div className="form-field">
                <label htmlFor="booking-time">Pickup time</label>
                <input id="booking-time" type="time" value={form.pickupTime} onChange={(event) => update("pickupTime", event.target.value)} aria-invalid={Boolean(errors.pickupTime)} aria-describedby={errors.pickupTime ? "booking-time-error" : undefined} />
                <FieldError id="booking-time-error">{errors.pickupTime}</FieldError>
              </div>
              <div className="form-field">
                <label htmlFor="booking-address">Pickup address / meeting point</label>
                <input id="booking-address" type="text" autoComplete="street-address" placeholder="e.g. hotel, office, airport terminal" value={form.pickupAddress} onChange={(event) => update("pickupAddress", event.target.value)} aria-invalid={Boolean(errors.pickupAddress)} aria-describedby={errors.pickupAddress ? "booking-address-error" : "booking-address-help"} />
                <FieldError id="booking-address-error">{errors.pickupAddress}</FieldError>
                {!errors.pickupAddress ? <p id="booking-address-help" className="form-help">A precise pickup point helps the team check coverage.</p> : null}
              </div>
              <div className="form-field form-field--full">
                <label htmlFor="booking-destination">Destination or route <span className="optional">{form.serviceType === "INTERSTATE_TRIP" ? "Required for interstate requests" : "Optional"}</span></label>
                <input id="booking-destination" type="text" placeholder="Where are you heading?" value={form.destination} onChange={(event) => update("destination", event.target.value)} aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? "booking-destination-error" : undefined} />
                <FieldError id="booking-destination-error">{errors.destination}</FieldError>
              </div>
              <div className="form-field form-field--full">
                <label className="checkbox-row" htmlFor="booking-driver"><input id="booking-driver" type="checkbox" checked={form.driverRequired} onChange={(event) => update("driverRequired", event.target.checked)} /><span>I would like to ask about a driver / chauffeur. Availability and fees need confirmation.</span></label>
              </div>
              <div className="form-field form-field--full">
                <label htmlFor="booking-notes">Anything else we should know? <span className="optional">Optional</span></label>
                <textarea id="booking-notes" placeholder="Stops, luggage, preferences, or a longer-term schedule" value={form.specialRequest} onChange={(event) => update("specialRequest", event.target.value)} />
              </div>
            </div>
            <div className="form-actions">
              <span className="form-submit-note"><CalendarDays size={13} aria-hidden="true" /> Dates and routes are checked by a person.</span>
              <ActionButton type="button" onClick={nextStep}>Continue<ArrowRight size={15} aria-hidden="true" /></ActionButton>
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="form-fieldset">
            <legend className="form-section-title">Who should we contact?</legend>
            <div className="form-grid">
              <div className="form-field form-field--full">
                <label htmlFor="booking-name">Full name</label>
                <input id="booking-name" autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "booking-name-error" : undefined} />
                <FieldError id="booking-name-error">{errors.fullName}</FieldError>
              </div>
              <div className="form-field">
                <label htmlFor="booking-phone">Phone / WhatsApp number</label>
                <input id="booking-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="0815 159 4253" value={form.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "booking-phone-error" : "booking-phone-help"} />
                <FieldError id="booking-phone-error">{errors.phone}</FieldError>
                {!errors.phone ? <p id="booking-phone-help" className="form-help">Include country code if your number is outside Nigeria.</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="booking-email">Email <span className="optional">Optional</span></label>
                <input id="booking-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "booking-email-error" : undefined} />
                <FieldError id="booking-email-error">{errors.email}</FieldError>
              </div>
              <div className="form-field form-field--full">
                <label className="checkbox-row" htmlFor="booking-consent"><input id="booking-consent" type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "booking-consent-error" : undefined} /><span>I agree that Olasco Autos may use these details to respond to this request. I have read the <Link href="/privacy" target="_blank">privacy notice</Link>.</span></label>
                <FieldError id="booking-consent-error">{errors.consent}</FieldError>
              </div>
            </div>
            <div className="form-actions">
              <ActionButton type="button" variant="text" onClick={() => setStep(1)}><ArrowLeft size={14} aria-hidden="true" />Back</ActionButton>
              <ActionButton type="button" onClick={nextStep}>Review request<ArrowRight size={15} aria-hidden="true" /></ActionButton>
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="form-fieldset">
            <legend className="form-section-title">Review before sending</legend>
            <div className="review-panel">
              <ReviewItem label="Rental type" value={form.serviceType.replaceAll("_", " ").toLowerCase()} />
              <ReviewItem label="City" value={form.serviceArea ? `${form.location} · ${form.serviceArea}` : form.location} />
              <ReviewItem label="Vehicle class" value={form.requestedVehicle} />
              <ReviewItem label="Pickup" value={`${form.pickupDate || "—"} · ${form.pickupTime || "—"}`} />
              <ReviewItem label="Return" value={form.returnDate || "—"} />
              <ReviewItem label="Pickup point" value={form.pickupAddress || "—"} />
              <ReviewItem label="Destination" value={form.destination || "Not specified"} />
              <ReviewItem label="Passenger / driver" value={`${form.passengers}${form.driverRequired ? " · driver requested" : ""}`} />
              <ReviewItem label="Name" value={form.fullName} />
              <ReviewItem label="Phone / WhatsApp" value={form.phone} />
            </div>
            <p className="draft-notice">This submits a request, not a confirmed reservation. No payment is taken here. Olasco will confirm availability, current price, requirements, and any fees directly with you.</p>
            <div className="form-actions">
              <ActionButton type="button" variant="text" disabled={submitting} onClick={() => setStep(2)}><ArrowLeft size={14} aria-hidden="true" />Edit details</ActionButton>
              <ActionButton type="submit" disabled={submitting}>{submitting ? "Sending request…" : "Send rental request"}{submitting ? null : <Check size={15} aria-hidden="true" />}</ActionButton>
            </div>
          </fieldset>
        ) : null}
      </form>

      <aside className="form-aside">
        <p className="eyebrow">A HUMAN CHECK-IN</p>
        <h2>Clear next steps, not checkout pressure.</h2>
        <p>Your details help the team check what is genuinely available. There is no online payment, automatic availability promise, or hidden fare on this form.</p>
        <ul className="form-aside-list">
          <li><MapPin size={14} aria-hidden="true" />Requests for Lagos and Abuja</li>
          <li><MapPin size={14} aria-hidden="true" />Local government area confirmed per pickup</li>
          <li><ShieldCheck size={14} aria-hidden="true" />Requirements and fees discussed before confirmation</li>
          <li><CircleCheck size={14} aria-hidden="true" />A public reference after a successful submission</li>
        </ul>
      </aside>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return <div className="review-item"><span>{label}</span><strong>{value}</strong></div>;
}
