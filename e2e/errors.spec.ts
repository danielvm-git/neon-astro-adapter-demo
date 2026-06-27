import { test, expect } from "@playwright/test";

test.describe("error pages", () => {
  test("nonexistent page shows custom 404", async ({ page }) => {
    const response = await page.goto("/nonexistent-page");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByText(/page not found/i),
    ).toBeVisible();
  });
});
