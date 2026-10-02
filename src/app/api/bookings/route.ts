import { bookingRequestSchema, idempotencyKeySchema } from "@/server/schemas";
import { apiJson, fieldErrors, isSameOrigin, rateLimit, readJson, reportServerError, RequestBodyError } from "@/server/http";
import { createBooking, StorageUnavailableError, VehicleUnavailableError } from "@/server/repositories";
import { notifyBooking } from "@/server/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return apiJson({ error: "Request origin could not be verified." }, 403);
  const limit = await rateLimit(request, "booking", 6);
  if (limit.unavailable) return apiJson({ error: "Request protection is temporarily unavailable. Please try again shortly." }, 503, { "Retry-After": String(limit.retryAfterSeconds) });
  if (!limit.allowed) return apiJson({ error: "Too many requests. Please try again shortly." }, 429, { "Retry-After": String(limit.retryAfterSeconds) });

  let rawBody: unknown;
  try {
    rawBody = await readJson(request);
  } catch (error) {
    const bodyError = error instanceof RequestBodyError ? error : new RequestBodyError("Request body could not be read.");
    return apiJson({ error: bodyError.message }, bodyError.status);
  }
  const parsed = bookingRequestSchema.safeParse(rawBody);
  if (!parsed.success) return apiJson({ error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) }, 400);

  const idempotencyKey = idempotencyKeySchema.safeParse(request.headers.get("idempotency-key"));
  if (!idempotencyKey.success) return apiJson({ error: "Your request could not be identified. Refresh the form and try again." }, 400);

  try {
    const booking = await createBooking(parsed.data, idempotencyKey.data);
    await notifyBooking(booking, parsed.data.serviceType, parsed.data.passengers, parsed.data.driverRequired, parsed.data.specialRequest || "");
    return apiJson({
      reference: booking.reference,
      status: booking.status,
      createdAt: booking.createdAt,
    }, 201);
  } catch (error) {
    if (error instanceof VehicleUnavailableError) return apiJson({ error: error.message }, 409);
    if (error instanceof StorageUnavailableError) return apiJson({ error: "Online requests are temporarily unavailable. Please contact Olasco on WhatsApp." }, 503);
    reportServerError("booking.create.failed", error);
    return apiJson({ error: "We could not save your request right now. Please try again or contact Olasco on WhatsApp." }, 500);
  }
}
