import { apiJson, rateLimit, reportServerError } from "@/server/http";
import { getBookingPublicStatus, StorageUnavailableError } from "@/server/repositories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ reference: string }> }) {
  const limit = await rateLimit(request, "booking-status", 30);
  if (limit.unavailable) return apiJson({ error: "Request status checks are temporarily unavailable." }, 503, { "Retry-After": String(limit.retryAfterSeconds) });
  if (!limit.allowed) return apiJson({ error: "Too many status checks. Please wait and try again." }, 429, { "Retry-After": String(limit.retryAfterSeconds) });
  const { reference } = await context.params;
  if (!/^OLA-\d{4}-\d{6}$/.test(reference)) return apiJson({ error: "Request not found." }, 404);
  try {
    const booking = await getBookingPublicStatus(reference);
    if (!booking) return apiJson({ error: "Request not found." }, 404);
    return apiJson(booking);
  } catch (error) {
    if (error instanceof StorageUnavailableError) return apiJson({ error: "Request status is unavailable." }, 503);
    reportServerError("booking.status.failed", error);
    return apiJson({ error: "Request status is unavailable." }, 500);
  }
}
