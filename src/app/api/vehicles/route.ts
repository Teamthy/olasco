import { apiJson, reportServerError } from "@/server/http";
import { listVehicles } from "@/server/repositories";
import type { CityLabel } from "@/domain/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const categories = new Set(["ECONOMY", "SEDAN", "SUV", "LUXURY", "EXECUTIVE", "VAN", "CONVERTIBLE", "SPORTS"]);

export async function GET(request: Request) {
  if (process.env.REQUIRE_DATABASE === "true" && !process.env.DATABASE_URL) return apiJson({ error: "Inventory is not configured." }, 503);
  const params = new URL(request.url).searchParams;
  const modeParam = params.get("mode")?.toLowerCase();
  const cityParam = params.get("city")?.toLowerCase();
  const categoryParam = params.get("category")?.toUpperCase();
  if (modeParam && modeParam !== "rent" && modeParam !== "sale") return apiJson({ error: "Invalid inventory mode." }, 400);
  if (cityParam && cityParam !== "lagos" && cityParam !== "abuja") return apiJson({ error: "Invalid city." }, 400);
  if (categoryParam && !categories.has(categoryParam)) return apiJson({ error: "Invalid vehicle category." }, 400);

  try {
    const vehicles = await listVehicles({
      mode: modeParam as "rent" | "sale" | undefined,
      city: cityParam ? (cityParam === "lagos" ? "Lagos" : "Abuja") as CityLabel : undefined,
      category: categoryParam as never,
    });
    return apiJson({ vehicles });
  } catch (error) {
    reportServerError("vehicles.list.failed", error);
    return apiJson({ error: "Inventory is temporarily unavailable." }, 500);
  }
}
