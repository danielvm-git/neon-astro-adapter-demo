import { test, expect } from "@playwright/test";

test.describe("auth ui", () => {
  test("signup page renders form fields", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
  });

  test("login page renders form fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("login form submit disables button while processing", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "nonexistent@example.com");
    await page.fill('input[name="password"]', "wrongpassword");

    const submitBtn = page.getByRole("button", { name: /log in/i });
    await expect(submitBtn).toBeEnabled();

    await submitBtn.click();

    // button should become disabled once the handler fires
    await expect(submitBtn).toBeDisabled({ timeout: 2000 });
  });
});
