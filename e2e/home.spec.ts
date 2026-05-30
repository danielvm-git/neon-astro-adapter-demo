import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("loads with health check status", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);
    await expect(page.getByText("Neon Auth + Astro")).toBeVisible();
    await expect(page.getByText(/Neon Auth: (online|not configured)/)).toBeVisible();
    await expect(page.getByText(/Neon DB: (online|not connected)/)).toBeVisible();
  });
});
