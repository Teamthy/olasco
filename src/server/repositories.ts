import { randomInt } from "node:crypto";
import type { BookingConfirmation, CityLabel, PublicBookingStatus, VehicleRecord } from "@/domain/types";
import {
  getPrismaClient,
  type DbBookingRow,
  type DbCity as City,
  type DbVehicleCategory as VehicleCategory,
  type DbVehicleRow,
  type OlascoTransactionClient,
} from "@/server/db";
type VehicleWhereInput = { isPublished: boolean; isForRent?: boolean; isForSale?: boolean; location?: City; category?: VehicleCategory };
import {
  createLocalBooking,
  createLocalContact,
  createLocalInquiry,
  createLocalPickup,
  getLocalBookingStatus,
  type LocalLead,
} from "@/server/dev-store";
import type { BookingRequestValidated, ContactValidated, InquiryValidated, PickupRequestValidated } from "@/server/schemas";

export class StorageUnavailableError extends Error {
  constructor() {
    super("Request storage is not configured.");
    this.name = "StorageUnavailableError";
  }
}

export class VehicleUnavailableError extends Error {
  constructor() {
    super("This vehicle is no longer available. Please send a fresh availability request.");
    this.name = "VehicleUnavailableError";
  }
}

export interface VehicleFilters {
  mode?: "rent" | "sale";
  city?: CityLabel;
  category?: VehicleCategory;
}

export type LeadResult = LocalLead;

const toDbCity = (city: CityLabel): City => city === "Lagos" ? "LAGOS" : "ABUJA";
const fromDbCity = (city: City): CityLabel => city === "LAGOS" ? "Lagos" : "Abuja";

function issueReference(prefix: "OLA-I" | "OLA-P" | "OLA-C") {
  const year = new Date().getUTCFullYear();
  return `${prefix}-${year}-${String(randomInt(0, 1_000_000_000_000)).padStart(12, "0")}`;
}

function mapVehicle(vehicle: DbVehicleRow): VehicleRecord {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    year: vehicle.year,
    category: vehicle.category,
    description: vehicle.description,
    currency: vehicle.currency,
    rentalPriceDaily: vehicle.rentalPriceDaily ? Number(vehicle.rentalPriceDaily) : null,
    rentalPriceWeekly: vehicle.rentalPriceWeekly ? Number(vehicle.rentalPriceWeekly) : null,
    salePrice: vehicle.salePrice ? Number(vehicle.salePrice) : null,
    location: fromDbCity(vehicle.location),
    seats: vehicle.seats,
    doors: vehicle.doors,
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    color: vehicle.color,
    mileage: vehicle.mileage,
    features: vehicle.features,
    isForRent: vehicle.isForRent,
    isForSale: vehicle.isForSale,
    isFeatured: vehicle.isFeatured,
    isAvailable: vehicle.isAvailable,
    images: vehicle.images.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((image) => ({ url: image.url, altText: image.altText })),
  };
}

function assertWritableStorage(db: ReturnType<typeof getPrismaClient>): asserts db is NonNullable<ReturnType<typeof getPrismaClient>> {
  if (!db && process.env.REQUIRE_DATABASE === "true") throw new StorageUnavailableError();
}

export async function listVehicles(filters: VehicleFilters = {}): Promise<VehicleRecord[]> {
  const db = getPrismaClient();
  if (!db) return [];
  const where: VehicleWhereInput = { isPublished: true };
  if (filters.mode === "rent") where.isForRent = true;
  if (filters.mode === "sale") where.isForSale = true;
  if (filters.city) where.location = toDbCity(filters.city);
  if (filters.category) where.category = filters.category;
  try {
    const vehicles = await db.vehicle.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 60,
    });
    return vehicles.map(mapVehicle);
  } catch {
    return [];
  }
}

export async function getVehicleBySlug(slug: string): Promise<VehicleRecord | null> {
  const db = getPrismaClient();
  if (!db) return null;
  try {
    const vehicle = await db.vehicle.findFirst({
      where: { slug, isPublished: true },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    return vehicle ? mapVehicle(vehicle) : null;
  } catch {
    return null;
  }
}

function mapBooking(record: DbBookingRow): BookingConfirmation {
  return {
    bookingId: record.reference,
    reference: record.reference,
    status: record.status,
    vehicle: record.vehicle ? `${record.vehicle.make} ${record.vehicle.model}` : record.requestedVehicle,
    location: fromDbCity(record.location),
    serviceArea: record.serviceArea ?? undefined,
    pickupDate: record.pickupDate.toISOString().slice(0, 10),
    returnDate: record.returnDate.toISOString().slice(0, 10),
    pickupTime: record.pickupTime,
    pickupAddress: record.pickupAddress,
    destination: record.destination ?? undefined,
    fullName: record.customer.fullName,
    phone: record.customer.phone,
    email: record.customer.email ?? undefined,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function createBooking(input: BookingRequestValidated, idempotencyKey: string): Promise<BookingConfirmation> {
  const db = getPrismaClient();
  assertWritableStorage(db);
  if (!db) return createLocalBooking(input, idempotencyKey);

  const existing = await db.booking.findUnique({
    where: { idempotencyKey },
    include: { customer: true, vehicle: true },
  });
  if (existing) return mapBooking(existing);

  try {
    return await db.$transaction(async (tx: OlascoTransactionClient) => {
      const vehicle = input.vehicleSlug
        ? await tx.vehicle.findFirst({
            where: { slug: input.vehicleSlug, isPublished: true, isAvailable: true, isForRent: true },
            select: { id: true, make: true, model: true },
          })
        : null;
      if (input.vehicleSlug && !vehicle) throw new VehicleUnavailableError();

      const customer = await tx.customer.upsert({
        where: { phone: input.phone },
        create: {
          fullName: input.fullName,
          phone: input.phone,
          whatsappNumber: input.phone,
          email: input.email || null,
        },
        update: {
          fullName: input.fullName,
          ...(input.email ? { email: input.email } : {}),
          whatsappNumber: input.phone,
        },
      });
      const year = new Date().getUTCFullYear();
      const counter = await tx.bookingCounter.upsert({
        where: { year },
        create: { year, value: 1 },
        update: { value: { increment: 1 } },
      });
      const reference = `OLA-${year}-${String(counter.value).padStart(6, "0")}`;
      const created = await tx.booking.create({
        data: {
          reference,
          idempotencyKey,
          customerId: customer.id,
          vehicleId: vehicle?.id,
          requestedVehicle: input.requestedVehicle || null,
          serviceType: input.serviceType,
          location: toDbCity(input.location),
          serviceArea: input.serviceArea || null,
          pickupDate: new Date(`${input.pickupDate}T00:00:00.000Z`),
          returnDate: new Date(`${input.returnDate}T00:00:00.000Z`),
          pickupTime: input.pickupTime,
          pickupAddress: input.pickupAddress,
          destination: input.destination || null,
          passengers: input.passengers,
          driverRequired: input.driverRequired,
          specialRequest: input.specialRequest || null,
          privacyConsentAt: new Date(),
        },
        include: { customer: true, vehicle: true },
      });
      return mapBooking(created);
    });
  } catch (error) {
    if (error instanceof VehicleUnavailableError) throw error;
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      const duplicate = await db.booking.findUnique({ where: { idempotencyKey }, include: { customer: true, vehicle: true } });
      if (duplicate) return mapBooking(duplicate);
    }
    throw error;
  }
}

export async function getBookingPublicStatus(reference: string): Promise<PublicBookingStatus | null> {
  const db = getPrismaClient();
  if (!db) {
    if (process.env.REQUIRE_DATABASE === "true") throw new StorageUnavailableError();
    return getLocalBookingStatus(reference);
  }
  const record = await db.booking.findUnique({
    where: { reference },
    select: { reference: true, status: true, createdAt: true },
  });
  return record ? { ...record, createdAt: record.createdAt.toISOString() } : null;
}

export async function createPickupRequest(input: PickupRequestValidated): Promise<LeadResult> {
  const db = getPrismaClient();
  assertWritableStorage(db);
  if (!db) return createLocalPickup(input);
  const record = await db.pickupRequest.create({
    data: {
      reference: issueReference("OLA-P"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || null,
      serviceType: input.serviceType,
      city: toDbCity(input.city),
      serviceArea: input.serviceArea || null,
      pickupDate: new Date(`${input.pickupDate}T00:00:00.000Z`),
      pickupTime: input.pickupTime,
      returnDate: input.returnDate ? new Date(`${input.returnDate}T00:00:00.000Z`) : null,
      pickupAddress: input.pickupAddress,
      destination: input.destination,
      passengers: input.passengers,
      luggage: input.luggage || null,
      specialRequest: input.specialRequest || null,
      privacyConsentAt: new Date(),
    },
  });
  return {
    reference: record.reference,
    fullName: record.fullName,
    phone: record.phone,
    email: record.email ?? undefined,
    serviceType: record.serviceType,
    city: fromDbCity(record.city),
    serviceArea: record.serviceArea ?? undefined,
    pickupDate: record.pickupDate.toISOString().slice(0, 10),
    pickupTime: record.pickupTime,
    pickupAddress: record.pickupAddress,
    destination: record.destination,
    passengers: record.passengers,
    details: [record.luggage && `Luggage: ${record.luggage}`, record.specialRequest].filter(Boolean).join("\n"),
    createdAt: record.createdAt.toISOString(),
  };
}

export async function createInquiry(input: InquiryValidated): Promise<LeadResult> {
  const db = getPrismaClient();
  assertWritableStorage(db);
  if (!db) return createLocalInquiry(input);
  const record = await db.inquiry.create({
    data: {
      reference: issueReference("OLA-I"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || null,
      type: input.type,
      city: input.city ? toDbCity(input.city) : null,
      serviceArea: input.serviceArea || null,
      preferredVehicle: input.preferredVehicle || null,
      budget: input.budget || null,
      message: input.message,
      privacyConsentAt: new Date(),
    },
  });
  return {
    reference: record.reference,
    fullName: record.fullName,
    phone: record.phone,
    email: record.email ?? undefined,
    serviceType: record.type,
    city: record.city ? fromDbCity(record.city) : undefined,
    serviceArea: record.serviceArea ?? undefined,
    details: [record.preferredVehicle && `Vehicle: ${record.preferredVehicle}`, record.budget && `Budget: ${record.budget}`, record.message].filter(Boolean).join("\n"),
    createdAt: record.createdAt.toISOString(),
  };
}

export async function createContactMessage(input: ContactValidated): Promise<LeadResult> {
  const db = getPrismaClient();
  assertWritableStorage(db);
  if (!db) return createLocalContact(input);
  const record = await db.contactMessage.create({
    data: {
      reference: issueReference("OLA-C"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || null,
      subject: input.subject,
      city: input.city ? toDbCity(input.city) : null,
      serviceArea: input.serviceArea || null,
      message: input.message,
      privacyConsentAt: new Date(),
    },
  });
  return {
    reference: record.reference,
    fullName: record.fullName,
    phone: record.phone,
    email: record.email ?? undefined,
    city: record.city ? fromDbCity(record.city) : undefined,
    serviceArea: record.serviceArea ?? undefined,
    details: `${record.subject}\n\n${record.message}`,
    createdAt: record.createdAt.toISOString(),
  };
}
