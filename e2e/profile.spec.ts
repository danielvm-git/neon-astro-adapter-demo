import { test, expect } from "@playwright/test";

test.describe("profile page", () => {
  test("renders without crashing", async ({ page }) => {
    const response = await page.goto("/profile");
    expect(response?.status()).not.toBe(500);
  });

  test("shows unauthenticated state without login", async ({ page }) => {
    await page.goto("/profile");
    // Page loads without auth → should show "Not logged in"
    await expect(
      page.getByText(/not logged in/i),
    ).toBeVisible({ timeout: 10000 });
  });
});
