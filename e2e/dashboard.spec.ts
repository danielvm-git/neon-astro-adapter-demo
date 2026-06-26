import { test, expect } from "@playwright/test";

test.describe("dashboard", () => {
  test("page renders without crashing", async ({ page }) => {
    const response = await page.goto("/dashboard");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: /film catalog/i }),
    ).toBeVisible();
  });

  test("shows film catalog table by default", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("table")).toBeVisible();
  });
});
