import { describe, it, expect } from "vitest";
import { GET } from "../../../pages/api/health";

describe("GET /api/health", () => {
  it("returns 200 with {status: 'ok'} and no db/auth details", async () => {
    const response = await GET({
      request: new Request("http://localhost/api/health"),
      params: {},
      locals: {},
      url: new URL("http://localhost/api/health"),
    } as any);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ status: "ok" });
    expect(body).not.toHaveProperty("db");
    expect(body).not.toHaveProperty("auth");
  });
});
