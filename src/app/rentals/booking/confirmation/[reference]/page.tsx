import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingConfirmationPanel } from "@/components/booking-confirmation-panel";
import { getBookingPublicStatus, StorageUnavailableError } from "@/server/repositories";
import { reportServerError } from "@/server/http";

export const dynamic = "force-dynamic";

type Params = { reference: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { reference } = await params;
  return { title: `Rental request status ${reference}`, description: "Check whether the Olasco Autos team has received your rental request, then continue the conversation on WhatsApp.", robots: { index: false, follow: false } };
}

export default async function BookingConfirmationPage({ params }: { params: Promise<Params> }) {
  const { reference } = await params;
  if (!/^OLA-\d{4}-\d{6}$/.test(reference)) notFound();
  let referenceExists: boolean | null = null;
  try {
    referenceExists = Boolean(await getBookingPublicStatus(reference));
  } catch (error) {
    if (!(error instanceof StorageUnavailableError)) reportServerError("booking.status.page.failed", error);
  }
  if (referenceExists === false) notFound();
  return <section className="section section--paper"><div className="container"><BookingConfirmationPanel reference={reference} /></div></section>;
}
