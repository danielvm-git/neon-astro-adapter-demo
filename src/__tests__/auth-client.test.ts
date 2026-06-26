import { describe, it, expect, vi, afterEach } from "vitest";

describe("authClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("importing auth-client module does not throw when env unset", async () => {
    await expect(import("../auth-client")).resolves.toBeDefined();
  });

  it("getAuthClient throws when NEON_AUTH_BASE_URL is not set", async () => {
    const mod = await import("../auth-client");

    expect(() => mod.getAuthClient()).toThrow("NEON_AUTH_BASE_URL");
  });

  it("getAuthClient returns client with signIn, signUp, signOut, getSession when env set", async () => {
    vi.stubEnv("NEON_AUTH_BASE_URL", "https://auth.example.com");

    const mod = await import("../auth-client");
    const client = mod.getAuthClient();

    const methods = ["signIn", "signUp", "signOut", "getSession"] as const;
    for (const method of methods) {
      expect(typeof Reflect.get(client, method)).toBe("function");
    }
  });
});
