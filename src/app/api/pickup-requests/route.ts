import { apiJson, fieldErrors, isSameOrigin, rateLimit, readJson, reportServerError, RequestBodyError } from "@/server/http";
import { pickupRequestSchema } from "@/server/schemas";
import { createPickupRequest, StorageUnavailableError } from "@/server/repositories";
import { notifyLead } from "@/server/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return apiJson({ error: "Request origin could not be verified." }, 403);
  const limit = await rateLimit(request, "pickup", 6);
  if (limit.unavailable) return apiJson({ error: "Request protection is temporarily unavailable. Please try again shortly." }, 503, { "Retry-After": String(limit.retryAfterSeconds) });
  if (!limit.allowed) return apiJson({ error: "Too many requests. Please try again shortly." }, 429, { "Retry-After": String(limit.retryAfterSeconds) });
  let rawBody: unknown;
  try {
    rawBody = await readJson(request);
  } catch (error) {
    const bodyError = error instanceof RequestBodyError ? error : new RequestBodyError("Request body could not be read.");
    return apiJson({ error: bodyError.message }, bodyError.status);
  }
  const parsed = pickupRequestSchema.safeParse(rawBody);
  if (!parsed.success) return apiJson({ error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) }, 400);
  try {
    const lead = await createPickupRequest(parsed.data);
    await notifyLead(lead, "New pickup / mobility request");
    return apiJson({ reference: lead.reference, status: "PENDING", createdAt: lead.createdAt }, 201);
  } catch (error) {
    if (error instanceof StorageUnavailableError) return apiJson({ error: "Online requests are temporarily unavailable. Please contact Olasco on WhatsApp." }, 503);
    reportServerError("pickup.create.failed", error);
    return apiJson({ error: "We could not save your request right now. Please try again or contact Olasco on WhatsApp." }, 500);
  }
}
