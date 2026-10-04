import { apiJson, reportServerError } from "@/server/http";
import { getVehicleBySlug } from "@/server/repositories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return apiJson({ error: "Vehicle not found." }, 404);
  if (process.env.REQUIRE_DATABASE === "true" && !process.env.DATABASE_URL) return apiJson({ error: "Inventory is not configured." }, 503);
  try {
    const vehicle = await getVehicleBySlug(slug);
    return vehicle ? apiJson({ vehicle }) : apiJson({ error: "Vehicle not found." }, 404);
  } catch (error) {
    reportServerError("vehicles.detail.failed", error);
    return apiJson({ error: "Vehicle details are temporarily unavailable." }, 500);
  }
}
