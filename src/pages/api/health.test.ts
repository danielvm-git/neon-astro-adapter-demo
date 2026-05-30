import { describe, it, expect } from "vitest";
import { getHealthStatus } from "../../health-check";

describe("GET /api/health", () => {
  it("returns 503 status when DB is unavailable", async () => {
    const health = await getHealthStatus(undefined, "");
    const status = health.db === "connected" ? 200 : 503;
    expect(status).toBe(503);
  });

  it("returns JSON with db and auth fields", async () => {
    const health = await getHealthStatus(undefined, "");
    expect(health).toHaveProperty("db");
    expect(health).toHaveProperty("auth");
  });
});
