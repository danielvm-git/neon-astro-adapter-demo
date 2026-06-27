import { test, expect } from "@playwright/test";

test.describe("navigation auth state", () => {
  test("unauthenticated shows Login link in nav", async ({ page }) => {
    await page.goto("/");
    const navLoginLink = page.locator("nav").getByRole("link", { name: /log in/i });
    await expect(navLoginLink).toBeVisible({ timeout: 10000 });
  });
});
