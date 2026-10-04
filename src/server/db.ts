import { createRequire } from "node:module";
import type { BookingConfirmation, PublicBookingStatus } from "@/domain/types";

export type DbCity = "LAGOS" | "ABUJA";
export type DbVehicleCategory = "ECONOMY" | "SEDAN" | "SUV" | "LUXURY" | "EXECUTIVE" | "VAN" | "CONVERTIBLE" | "SPORTS";
export type DbDecimalValue = number | { toString(): string };

export interface DbVehicleRow {
  id: string;
  slug: string;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  category: DbVehicleCategory;
  description: string;
  currency: string;
  rentalPriceDaily: DbDecimalValue | null;
  rentalPriceWeekly: DbDecimalValue | null;
  salePrice: DbDecimalValue | null;
  location: DbCity;
  seats: number | null;
  doors: number | null;
  transmission: string | null;
  fuelType: string | null;
  color: string | null;
  mileage: number | null;
  features: string[];
  isForRent: boolean;
  isForSale: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  images: Array<{ url: string; altText: string; sortOrder?: number }>;
}

export interface DbBookingRow {
  reference: string;
  status: BookingConfirmation["status"];
  requestedVehicle: string | null;
  vehicle: { make: string; model: string } | null;
  location: DbCity;
  serviceArea: string | null;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
  pickupAddress: string;
  destination: string | null;
  customer: { fullName: string; phone: string; email: string | null };
  createdAt: Date;
}

export interface DbBookingStatusRow {
  reference: string;
  status: PublicBookingStatus["status"];
  createdAt: Date;
}

export interface OlascoTransactionClient {
  vehicle: {
    findFirst(args: Record<string, unknown>): Promise<{ id: string; make: string; model: string } | null>;
  };
  customer: {
    upsert(args: Record<string, unknown>): Promise<{ id: string }>;
  };
  bookingCounter: {
    upsert(args: Record<string, unknown>): Promise<{ value: number }>;
  };
  booking: {
    create(args: Record<string, unknown>): Promise<DbBookingRow>;
  };
}

export interface OlascoPrismaClient {
  vehicle: {
    findMany(args: Record<string, unknown>): Promise<DbVehicleRow[]>;
    findFirst(args: Record<string, unknown>): Promise<DbVehicleRow | null>;
  };
  booking: {
    findUnique(args: { where: { idempotencyKey: string }; include: { customer: true; vehicle: true } }): Promise<DbBookingRow | null>;
    findUnique(args: { where: { reference: string }; select: { reference: true; status: true; createdAt: true } }): Promise<DbBookingStatusRow | null>;
  };
  pickupRequest: {
    create(args: Record<string, unknown>): Promise<{
      reference: string;
      fullName: string;
      phone: string;
      email: string | null;
      serviceType: string;
      city: DbCity;
      serviceArea: string | null;
      pickupDate: Date;
      pickupTime: string;
      pickupAddress: string;
      destination: string;
      passengers: number;
      luggage: string | null;
      specialRequest: string | null;
      createdAt: Date;
    }>;
  };
  inquiry: {
    create(args: Record<string, unknown>): Promise<{
      reference: string;
      fullName: string;
      phone: string;
      email: string | null;
      type: string;
      city: DbCity | null;
      serviceArea: string | null;
      preferredVehicle: string | null;
      budget: string | null;
      message: string;
      createdAt: Date;
    }>;
  };
  contactMessage: {
    create(args: Record<string, unknown>): Promise<{
      reference: string;
      fullName: string;
      phone: string;
      email: string | null;
      subject: string;
      city: DbCity | null;
      serviceArea: string | null;
      message: string;
      createdAt: Date;
    }>;
  };
  $transaction<T>(fn: (tx: OlascoTransactionClient) => Promise<T>): Promise<T>;
}

const globalForPrisma = globalThis as typeof globalThis & { olascoPrisma?: OlascoPrismaClient };

export function getPrismaClient(): OlascoPrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (globalForPrisma.olascoPrisma) return globalForPrisma.olascoPrisma;
  try {
    const requireModule = createRequire(import.meta.url);
    const prismaModuleName = ["@prisma", "client"].join("/");
    const prismaModule = requireModule(prismaModuleName) as {
      PrismaClient?: new (options?: Record<string, unknown>) => OlascoPrismaClient;
    };
    if (!prismaModule.PrismaClient) return null;
    const client = new prismaModule.PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    globalForPrisma.olascoPrisma = client;
    return client;
  } catch {
    return null;
  }
}

export function isDemoStorage() {
  return !process.env.DATABASE_URL && process.env.NODE_ENV !== "production";
}
