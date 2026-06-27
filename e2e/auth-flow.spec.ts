import { test, expect } from "@playwright/test";

test.describe("authenticated flow", () => {
  test("loads profile page and triggers navigation sign-out", async ({ page }) => {
    await page.route("**/*", async (route) => {
      const url = route.request().url();
      if (url.includes("get-session") || url.includes("session")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              user: {
                email: "auth-test@example.com",
              },
            },
            user: {
              email: "auth-test@example.com",
            }
          }),
        });
      } else if (url.includes("sign-out")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/profile");

    await expect(page.locator("#profile-content")).toContainText("Logged in as auth-test@example.com");

    const navIn = page.locator("#nav-auth-in");
    await expect(navIn).toBeVisible();

    const dashboardLink = page.locator("nav").getByRole("link", { name: /dashboard/i });
    await expect(dashboardLink).toBeVisible();

    const signOutBtn = page.locator("#nav-sign-out");
    await expect(signOutBtn).toBeVisible();

    await signOutBtn.click();

    await expect(page).toHaveURL("/");
  });
});
