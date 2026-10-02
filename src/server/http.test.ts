import { afterEach, describe, expect, it, vi } from "vitest";
import { rateLimit, readJson, RequestBodyError } from "@/server/http";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function jsonRequest(body: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body,
  });
}

describe("bounded JSON request parsing", () => {
  it("parses a valid JSON body", async () => {
    await expect(readJson(jsonRequest(JSON.stringify({ message: "hello" })))).resolves.toEqual({ message: "hello" });
  });

  it("rejects unsupported media types", async () => {
    const request = new Request("http://localhost/api/test", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "hello" });
    await expect(readJson(request)).rejects.toMatchObject({ status: 415 });
  });

  it("rejects malformed JSON", async () => {
    await expect(readJson(jsonRequest("{"))).rejects.toMatchObject({ status: 400 });
  });

  it("rejects a body that exceeds the limit even when Content-Length understates it", async () => {
    const request = jsonRequest(JSON.stringify({ long: "this body exceeds the configured limit" }), { "Content-Length": "1" });
    try {
      await readJson(request, 8);
      throw new Error("Expected the request body to be rejected.");
    } catch (error) {
      expect(error).toBeInstanceOf(RequestBodyError);
      expect(error).toMatchObject({ status: 413 });
    }
  });
});

describe("shared rate limiting", () => {
  it("falls back to an in-memory fixed window when Redis is not configured", async () => {
    vi.stubEnv("RATE_LIMIT_REDIS_URL", "");
    vi.stubEnv("RATE_LIMIT_REDIS_TOKEN", "");
    const request = new Request("http://localhost/api/test", { headers: { "x-real-ip": "203.0.113.88" } });
    const scope = `local-test-${crypto.randomUUID()}`;
    await expect(rateLimit(request, scope, 1, 60_000)).resolves.toMatchObject({ allowed: true, retryAfterSeconds: 0 });
    await expect(rateLimit(request, scope, 1, 60_000)).resolves.toMatchObject({ allowed: false });
  });

  it("uses an atomic Redis REST script and HMACs the client address", async () => {
    vi.stubEnv("RATE_LIMIT_REDIS_URL", "https://redis.example.test");
    vi.stubEnv("RATE_LIMIT_REDIS_TOKEN", "test-secret-token");
    const redisFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: [3, 45_000] }), { status: 200 }));
    vi.stubGlobal("fetch", redisFetch);
    const request = new Request("http://localhost/api/test", { headers: { "x-real-ip": "198.51.100.12" } });

    await expect(rateLimit(request, "redis-test", 2, 60_000)).resolves.toEqual({ allowed: false, retryAfterSeconds: 45 });
    const requestBody = JSON.parse(String(redisFetch.mock.calls[0]?.[1]?.body)) as unknown[];
    expect(requestBody[0]).toBe("EVAL");
    expect(requestBody[3]).not.toContain("198.51.100.12");
  });

  it("fails closed when the shared limiter is only partially configured", async () => {
    vi.stubEnv("RATE_LIMIT_REDIS_URL", "https://redis.example.test");
    vi.stubEnv("RATE_LIMIT_REDIS_TOKEN", "");
    const redisFetch = vi.fn();
    vi.stubGlobal("fetch", redisFetch);

    await expect(rateLimit(new Request("http://localhost/api/test"), "partial-test")).resolves.toMatchObject({ allowed: false, unavailable: true });
    expect(redisFetch).not.toHaveBeenCalled();
  });
});
