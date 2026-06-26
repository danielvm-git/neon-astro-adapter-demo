import { describe, it, expect, vi, afterEach } from "vitest";

describe("authClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("exports authClient with signIn, signUp, signOut, getSession", async () => {
    vi.stubEnv("NEON_AUTH_BASE_URL", "https://auth.example.com");

    const mod = await import("../auth-client");

    expect(typeof mod.authClient).toBe("function");
    expect(typeof mod.authClient.signIn).toBe("function");
    expect(typeof mod.authClient.signUp).toBe("function");
    expect(typeof mod.authClient.signOut).toBe("function");
    expect(typeof mod.authClient.getSession).toBe("function");
  });

  it("throws when NEON_AUTH_BASE_URL is not set", async () => {
    await expect(async () => {
      await import("../auth-client");
    }).rejects.toThrow("NEON_AUTH_BASE_URL");
  });
});
