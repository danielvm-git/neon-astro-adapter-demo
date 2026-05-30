import { describe, it, expect } from "vitest";
import { onRequest } from "../middleware";

describe("middleware", () => {
  it("calls next and returns its response when auth env vars are missing", async () => {
    const ctx = {
      request: new Request("http://localhost/"),
      url: new URL("http://localhost/"),
      locals: {},
    } as any;

    const expected = new Response("OK", { status: 200 });
    const next = async () => expected;

    const response = await onRequest(ctx, next);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("OK");
  });

  it("re-throws when next throws", async () => {
    const ctx = {
      request: new Request("http://localhost/"),
      url: new URL("http://localhost/"),
      locals: {},
    } as any;

    const error = new Error("db failure");
    const next = async () => { throw error; };

    await expect(onRequest(ctx, next)).rejects.toThrow("db failure");
  });
});
