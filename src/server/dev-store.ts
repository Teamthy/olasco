import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { BookingConfirmation, BookingStatus, CityLabel } from "@/domain/types";
import type { BookingRequestValidated, ContactValidated, InquiryValidated, PickupRequestValidated } from "@/server/schemas";

interface LocalBooking extends BookingConfirmation {
  idempotencyKey: string;
  serviceType: string;
  requestedVehicle: string;
  driverRequired: boolean;
  specialRequest: string;
}

export interface LocalLead {
  reference: string;
  fullName: string;
  phone: string;
  email?: string;
  serviceType?: string;
  city?: CityLabel;
  serviceArea?: string;
  pickupDate?: string;
  pickupTime?: string;
  pickupAddress?: string;
  destination?: string;
  passengers?: number;
  details?: string;
  createdAt: string;
}

interface LocalState {
  version: 1;
  sequence: number;
  bookings: LocalBooking[];
  inquiries: LocalLead[];
  pickupRequests: LocalLead[];
  contactMessages: LocalLead[];
}

const dataDirectory = process.env.VERCEL
  ? path.join(os.tmpdir(), "olasco-data")
  : path.join(process.cwd(), ".data");
const dataFile = path.join(dataDirectory, "requests.json");
const emptyState = (): LocalState => ({ version: 1, sequence: 0, bookings: [], inquiries: [], pickupRequests: [], contactMessages: [] });
let writeQueue: Promise<unknown> = Promise.resolve();

function withLocalLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  return result;
}

async function readState(): Promise<LocalState> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const state = JSON.parse(raw) as LocalState;
    if (state.version !== 1 || !Array.isArray(state.bookings)) return emptyState();
    return state;
  } catch {
    return emptyState();
  }
}

async function saveState(state: LocalState) {
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  const temporaryFile = path.join(dataDirectory, `.requests-${randomUUID()}.tmp`);
  await writeFile(temporaryFile, JSON.stringify(state, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temporaryFile, dataFile);
}

function nextReference(state: LocalState, prefix = "OLA") {
  state.sequence += 1;
  const year = new Date().getUTCFullYear();
  return `${prefix}-${year}-${String(state.sequence).padStart(6, "0")}`;
}

export async function createLocalBooking(input: BookingRequestValidated, idempotencyKey: string) {
  return withLocalLock(async () => {
    const state = await readState();
    const existing = state.bookings.find((booking) => booking.idempotencyKey === idempotencyKey);
    if (existing) return existing;
    const createdAt = new Date().toISOString();
    const record: LocalBooking = {
      bookingId: "",
      reference: nextReference(state),
      status: "PENDING" satisfies BookingStatus,
      vehicle: input.requestedVehicle || null,
      location: input.location,
      serviceArea: input.serviceArea || undefined,
      pickupDate: input.pickupDate,
      returnDate: input.returnDate,
      pickupTime: input.pickupTime,
      pickupAddress: input.pickupAddress,
      destination: input.destination || undefined,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      createdAt,
      idempotencyKey,
      serviceType: input.serviceType,
      requestedVehicle: input.requestedVehicle || "",
      driverRequired: input.driverRequired,
      specialRequest: input.specialRequest || "",
    };
    record.bookingId = record.reference;
    state.bookings.push(record);
    await saveState(state);
    return record;
  });
}

export async function getLocalBookingStatus(reference: string) {
  const state = await readState();
  const booking = state.bookings.find((item) => item.reference === reference);
  if (!booking) return null;
  return { reference: booking.reference, status: booking.status, createdAt: booking.createdAt };
}

export async function createLocalPickup(input: PickupRequestValidated): Promise<LocalLead> {
  return withLocalLock(async () => {
    const state = await readState();
    const record: LocalLead = {
      reference: nextReference(state, "OLA-P"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      serviceType: input.serviceType,
      city: input.city,
      serviceArea: input.serviceArea || undefined,
      pickupDate: input.pickupDate,
      pickupTime: input.pickupTime,
      pickupAddress: input.pickupAddress,
      destination: input.destination,
      passengers: input.passengers,
      details: [input.luggage && `Luggage: ${input.luggage}`, input.specialRequest].filter(Boolean).join("\n"),
      createdAt: new Date().toISOString(),
    };
    state.pickupRequests.push(record);
    await saveState(state);
    return record;
  });
}

export async function createLocalInquiry(input: InquiryValidated): Promise<LocalLead> {
  return withLocalLock(async () => {
    const state = await readState();
    const record: LocalLead = {
      reference: nextReference(state, "OLA-I"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      serviceType: input.type,
      city: input.city,
      serviceArea: input.serviceArea || undefined,
      details: [input.preferredVehicle && `Vehicle: ${input.preferredVehicle}`, input.budget && `Budget: ${input.budget}`, input.message].filter(Boolean).join("\n"),
      createdAt: new Date().toISOString(),
    };
    state.inquiries.push(record);
    await saveState(state);
    return record;
  });
}

export async function createLocalContact(input: ContactValidated): Promise<LocalLead> {
  return withLocalLock(async () => {
    const state = await readState();
    const record: LocalLead = {
      reference: nextReference(state, "OLA-C"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      city: input.city,
      serviceArea: input.serviceArea || undefined,
      details: `${input.subject}\n\n${input.message}`,
      createdAt: new Date().toISOString(),
    };
    state.contactMessages.push(record);
    await saveState(state);
    return record;
  });
}
