import { businessConfig } from "@/config/business";
import { apiJson } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return apiJson({
    business: {
      name: businessConfig.name,
      phone: businessConfig.phoneDisplay,
      phoneE164: businessConfig.phoneE164,
      whatsappNumber: businessConfig.whatsappNumber,
      email: businessConfig.email || null,
    },
    locations: Object.values(businessConfig.locations).map((location) => ({
      city: location.name,
      slug: location.slug,
      address: location.officeAddress,
      mapsUrl: location.mapsUrl,
      openingHours: businessConfig.openingHours,
      coverageNote: location.coverageNote,
    })),
  });
}
