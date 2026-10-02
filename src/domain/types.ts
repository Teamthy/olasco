export type CityLabel = "Lagos" | "Abuja";
export type CitySlug = "lagos" | "abuja";

export type RentalServiceType = "DAILY_RENTAL" | "LONG_TERM_RENTAL" | "INTERSTATE_TRIP";
export type PickupServiceType =
  | "AIRPORT_PICKUP"
  | "CHAUFFEUR"
  | "CORPORATE_TRAVEL"
  | "EVENT_TRANSPORT"
  | "INTERSTATE_TRIP"
  | "CITY_TRANSFER";
export type InquiryType = "PURCHASE_CONSULTATION" | "SELL_TRADE_IN" | "GENERAL";
export type BookingStatus = "PENDING" | "CONTACTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type VehicleCategory =
  | "ECONOMY"
  | "SEDAN"
  | "SUV"
  | "LUXURY"
  | "EXECUTIVE"
  | "VAN"
  | "CONVERTIBLE"
  | "SPORTS";

export interface VehicleRecord {
  id: string;
  slug: string;
  make: string;
  model: string;
  trim?: string | null;
  year: number;
  category: VehicleCategory;
  description: string;
  currency: string;
  rentalPriceDaily?: number | null;
  rentalPriceWeekly?: number | null;
  salePrice?: number | null;
  location: CityLabel;
  seats?: number | null;
  doors?: number | null;
  transmission?: string | null;
  fuelType?: string | null;
  color?: string | null;
  mileage?: number | null;
  features: string[];
  isForRent: boolean;
  isForSale: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  images: Array<{ url: string; altText: string }>;
}

export interface BookingRequestInput {
  fullName: string;
  phone: string;
  email?: string;
  whatsappNumber?: string;
  serviceType: RentalServiceType;
  requestedVehicle?: string;
  vehicleSlug?: string;
  location: CityLabel;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  pickupAddress: string;
  destination?: string;
  passengers: number;
  driverRequired: boolean;
  specialRequest?: string;
  consent: true;
}

export interface BookingConfirmation {
  bookingId: string;
  reference: string;
  status: BookingStatus;
  vehicle: string | null;
  location: CityLabel;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  pickupAddress: string;
  destination?: string;
  fullName: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface PublicBookingStatus {
  reference: string;
  status: BookingStatus;
  createdAt: string;
}
