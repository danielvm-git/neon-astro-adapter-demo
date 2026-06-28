import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readNetlifyToml(): string {
  return readFileSync(resolve(import.meta.dirname, "../../../netlify.toml"), "utf-8");
}

const REQUIRED_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "0",
};

describe("netlify.toml security headers", () => {
  it("has a [[headers]] block for path '/*' with all required security headers", () => {
    const toml = readNetlifyToml();

    expect(toml).toContain("[[headers]]");
    expect(toml).toContain('for = "/*"');

    for (const [header, value] of Object.entries(REQUIRED_HEADERS)) {
      expect(toml).toContain(`${header} = "${value}"`);
    }
  });
});
