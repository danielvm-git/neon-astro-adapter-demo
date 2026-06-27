import { test, expect } from "@playwright/test";

test.describe("protected routes", () => {
  test("film detail page responds without 500", async ({ page }) => {
    const response = await page.goto("/films/1");
    // Without live DB, getFilm returns null → redirect to /
    // What matters is it doesn't crash (no 500)
    expect(response?.status()).not.toBe(500);
    expect(response?.status()).toBeGreaterThanOrEqual(200);
    expect(response?.status()).toBeLessThan(400);
  });

  test("invalid film ID redirects to home", async ({ page }) => {
    const response = await page.goto("/films/99999");
    // In dev (no live DB), getFilm returns null → redirect to /
    await expect(
      page.getByRole("heading", { name: /neon auth \+ astro/i }),
    ).toBeVisible();
  });

  test("films API endpoint returns JSON", async ({ page }) => {
    const response = await page.request.get("/api/films");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"] || "";
    expect(contentType).toContain("application/json");
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
