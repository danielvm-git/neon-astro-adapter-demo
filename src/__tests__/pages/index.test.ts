import { describe, it, expect } from "vitest";
import { getHealthStatus } from "../../health-check";

describe("index page health check", () => {
  it("reports auth configured when NEON_AUTH_BASE_URL is set", async () => {
    const status = await getHealthStatus(
      "https://example.com/api/auth",
      "",
    );
    expect(status.auth).toBe("configured");
  });

  it("reports auth missing when NEON_AUTH_BASE_URL is unset", async () => {
    const status = await getHealthStatus(undefined, "");
    expect(status.auth).toBe("missing");
  });

  it("reports db unavailable when DATABASE_URL is unset", async () => {
    const status = await getHealthStatus(undefined, "");
    expect(status.db).toBe("unavailable");
  });
});
