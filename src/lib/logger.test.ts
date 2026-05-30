import { describe, it, expect } from "vitest";
import { createRequestLogger } from "./logger";

describe("createRequestLogger", () => {
  it("returns a child logger with the given requestId", () => {
    const log = createRequestLogger("test-req-123");
    expect(log).toBeDefined();
    expect(typeof log.info).toBe("function");
    expect(typeof log.error).toBe("function");
  });
});
