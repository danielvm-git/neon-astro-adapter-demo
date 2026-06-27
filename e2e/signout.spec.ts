import { test, expect } from "@playwright/test";

test.describe("sign-out", () => {
  test("unauthenticated profile has no sign-out button", async ({ page }) => {
    await page.goto("/profile");
    // Without login, no sign-out button should be visible
    const signOutButton = page.getByRole("button", { name: /sign out/i });
    await expect(signOutButton).not.toBeVisible();
  });
});
