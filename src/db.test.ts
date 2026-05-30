import { describe, it, expect } from "vitest";

describe("db", () => {
  it("exports sql as a function", async () => {
    const mod = await import("./db");
    expect(typeof mod.sql).toBe("function");
  });
});
