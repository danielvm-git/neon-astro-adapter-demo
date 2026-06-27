import { describe, it, expect, vi, beforeEach } from "vitest";

describe("middleware", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("throws when auth env vars are missing", async () => {
    vi.stubEnv("NEON_AUTH_BASE_URL", "");
    vi.stubEnv("NEON_AUTH_COOKIE_SECRET", "");
    await expect(import("../middleware")).rejects.toThrow(
      "NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET environment variables are required",
    );
  });

  it("loads successfully and runs when env vars are present", async () => {
    vi.stubEnv("NEON_AUTH_BASE_URL", "https://auth.example.com");
    vi.stubEnv("NEON_AUTH_COOKIE_SECRET", "12345678901234567890123456789012");
    
    const { onRequest } = await import("../middleware");
    expect(onRequest).toBeDefined();

    const ctx = {
      request: new Request("http://localhost/"),
      url: new URL("http://localhost/"),
      locals: {},
    } as any;

    const expected = new Response("OK", { status: 200 });
    const next = async () => expected;

    const response = await onRequest(ctx, next);
    expect(response.status).toBe(200);
  });
});

