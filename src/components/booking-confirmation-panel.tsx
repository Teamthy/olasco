"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CircleAlert, House, MessageCircle } from "lucide-react";
import type { BookingStatus } from "@/domain/types";
import { createContextMessage, createWhatsAppLink } from "@/lib/whatsapp";

type VerificationState = "checking" | "verified" | "not-found" | "unavailable";
const bookingStatuses: BookingStatus[] = ["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED", "COMPLETED"];

export function BookingConfirmationPanel({ reference }: { reference: string }) {
  const [verification, setVerification] = useState<VerificationState>("checking");
  const [status, setStatus] = useState<BookingStatus | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
      setVerification("unavailable");
    }, 10_000);
    fetch(`/api/bookings/${encodeURIComponent(reference)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) {
          setVerification("not-found");
          return;
        }
        if (!response.ok) {
          setVerification("unavailable");
          return;
        }
        const payload: unknown = await response.json();
        if (typeof payload !== "object" || payload === null || !("reference" in payload) || !("status" in payload)) {
          setVerification("unavailable");
          return;
        }
        const data = payload as { reference?: unknown; status?: unknown };
        if (data.reference !== reference || typeof data.status !== "string" || !bookingStatuses.includes(data.status as BookingStatus)) {
          setVerification("unavailable");
          return;
        }
        setStatus(data.status as BookingStatus);
        setVerification("verified");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setVerification("unavailable");
      })
      .finally(() => window.clearTimeout(timeout));
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [reference]);

  const message = createContextMessage("booking-follow-up", { reference });
  const isVerified = verification === "verified";

  return (
    <section className="booking-confirmation" aria-live="polite" aria-busy={verification === "checking"}>
      <span className={`confirmation-mark${isVerified ? "" : " confirmation-mark--muted"}`}>
        {isVerified ? <CheckCircle2 size={28} aria-hidden="true" /> : <CircleAlert size={28} aria-hidden="true" />}
      </span>
      {verification === "checking" ? (
        <>
          <p className="eyebrow">CHECKING REQUEST</p>
          <h1>Verifying your reference.</h1>
          <p>We are checking Olasco&apos;s request records before confirming receipt.</p>
        </>
      ) : null}
      {isVerified ? (
        <>
          <p className="eyebrow">RENTAL REQUEST RECEIVED</p>
          <h1>We have your request.</h1>
          <p>Olasco will check the details and contact you. This is a request, not a confirmed reservation.</p>
        </>
      ) : null}
      {verification === "not-found" ? (
        <>
          <p className="eyebrow">REFERENCE NOT FOUND</p>
          <h1>We couldn&apos;t find this request.</h1>
          <p>Do not assume the request was received. Contact Olasco on WhatsApp and share this reference so the team can check.</p>
        </>
      ) : null}
      {verification === "unavailable" ? (
        <>
          <p className="eyebrow">COULD NOT VERIFY</p>
          <h1>We can&apos;t confirm receipt yet.</h1>
          <p>Olasco&apos;s request records could not be checked. Please do not assume this request was received; contact the team on WhatsApp with this reference.</p>
        </>
      ) : null}
      <div className="reference-box"><span>Booking reference</span><strong>{reference}</strong></div>
      {isVerified ? (
        <>
          <span className="confirmation-status">Status · {status?.toLowerCase()}</span>
          <p>Our team will confirm current availability, pricing, requirements, and the next steps with you directly.</p>
        </>
      ) : null}
      <div className="confirmation-actions">
        <a className="button button--primary" href={createWhatsAppLink({ message })} target="_blank" rel="noopener noreferrer">Continue on WhatsApp<MessageCircle size={15} aria-hidden="true" /></a>
        <Link className="button button--outline" href="/"><House size={15} aria-hidden="true" />Back to home<ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
