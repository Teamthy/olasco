import { createHmac } from "node:crypto";
import { ZodError } from "zod";

interface RateLimitBucket {
  startedAt: number;
  count: number;
}

const rateBuckets = new Map<string, RateLimitBucket>();

export function apiJson(data: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const parsedOrigin = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || request.headers.get("host") || new URL(request.url).host;
    return parsedOrigin.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  unavailable?: boolean;
}

const redisRateLimitScript = [
  "local count = redis.call('INCR', KEYS[1])",
  "if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end",
  "local ttl = redis.call('PTTL', KEYS[1])",
  "return {count, ttl}",
].join("\n");

function rateLimitLocally(request: Request, scope: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const addressHash = createHmac("sha256", "olasco-local-rate-limit").update(clientAddress(request)).digest("hex");
  const key = `${scope}:${addressHash}`;
  const current = rateBuckets.get(key);
  if (!current || now - current.startedAt >= windowMs) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
  } else {
    current.count += 1;
    if (current.count > limit) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - current.startedAt)) / 1000)) };
    }
  }
  if (rateBuckets.size > 10_000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (now - bucket.startedAt > windowMs) rateBuckets.delete(bucketKey);
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

function unavailableRateLimit(): RateLimitResult {
  return { allowed: false, retryAfterSeconds: 30, unavailable: true };
}

export async function rateLimit(request: Request, scope: string, limit = 8, windowMs = 15 * 60 * 1000): Promise<RateLimitResult> {
  const endpoint = process.env.RATE_LIMIT_REDIS_URL?.trim();
  const token = process.env.RATE_LIMIT_REDIS_TOKEN?.trim();
  if (!endpoint && !token) return rateLimitLocally(request, scope, limit, windowMs);
  if (!endpoint || !token) return unavailableRateLimit();

  try {
    const parsedEndpoint = new URL(endpoint);
    if (parsedEndpoint.protocol !== "https:") return unavailableRateLimit();
    const addressHash = createHmac("sha256", token).update(clientAddress(request)).digest("hex");
    const redisKey = `olasco:rate-limit:${scope}:${addressHash}`;
    const response = await fetch(parsedEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", redisRateLimitScript, "1", redisKey, String(windowMs)]),
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) return unavailableRateLimit();
    const payload: unknown = await response.json();
    if (typeof payload !== "object" || payload === null || !("result" in payload) || !Array.isArray(payload.result)) return unavailableRateLimit();
    const [count, ttl] = payload.result;
    if (typeof count !== "number" || typeof ttl !== "number" || ttl < 0) return unavailableRateLimit();
    return {
      allowed: count <= limit,
      retryAfterSeconds: count <= limit ? 0 : Math.max(1, Math.ceil(ttl / 1000)),
    };
  } catch {
    return unavailableRateLimit();
  }
}

export async function readJson(request: Request, maximumBytes = 16_384): Promise<unknown> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new RequestBodyError("Send this request as JSON.", 415);
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
    throw new RequestBodyError("Request is too large.", 413);
  }
  try {
    if (!request.body) throw new RequestBodyError("Request body must be valid JSON.", 400);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel().catch(() => undefined);
        throw new RequestBodyError("Request is too large.", 413);
      }
      chunks.push(value);
    }
    const body = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(body)) as unknown;
  } catch (error) {
    if (error instanceof RequestBodyError) throw error;
    throw new RequestBodyError("Request body must be valid JSON.", 400);
  }
}

export class RequestBodyError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "RequestBodyError";
  }
}

export function fieldErrors(error: ZodError) {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

export function reportServerError(event: string, error: unknown) {
  console.error(JSON.stringify({
    event,
    errorType: error instanceof Error ? error.name : "UnknownError",
    at: new Date().toISOString(),
  }));
}
