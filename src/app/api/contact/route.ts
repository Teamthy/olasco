import { apiJson, fieldErrors, isSameOrigin, rateLimit, readJson, reportServerError, RequestBodyError } from "@/server/http";
import { contactSchema } from "@/server/schemas";
import { createContactMessage, StorageUnavailableError } from "@/server/repositories";
import { notifyLead } from "@/server/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return apiJson({ error: "Request origin could not be verified." }, 403);
  const limit = await rateLimit(request, "contact", 5);
  if (limit.unavailable) return apiJson({ error: "Request protection is temporarily unavailable. Please try again shortly." }, 503, { "Retry-After": String(limit.retryAfterSeconds) });
  if (!limit.allowed) return apiJson({ error: "Too many requests. Please try again shortly." }, 429, { "Retry-After": String(limit.retryAfterSeconds) });
  let rawBody: unknown;
  try {
    rawBody = await readJson(request);
  } catch (error) {
    const bodyError = error instanceof RequestBodyError ? error : new RequestBodyError("Request body could not be read.");
    return apiJson({ error: bodyError.message }, bodyError.status);
  }
  const parsed = contactSchema.safeParse(rawBody);
  if (!parsed.success) return apiJson({ error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) }, 400);
  try {
    const lead = await createContactMessage(parsed.data);
    await notifyLead(lead, "New contact message");
    return apiJson({ reference: lead.reference, status: "RECEIVED", createdAt: lead.createdAt }, 201);
  } catch (error) {
    if (error instanceof StorageUnavailableError) return apiJson({ error: "Online messages are temporarily unavailable. Please contact Olasco on WhatsApp." }, 503);
    reportServerError("contact.create.failed", error);
    return apiJson({ error: "We could not send your message right now. Please try again or contact Olasco on WhatsApp." }, 500);
  }
}
