import { test, expect } from "@playwright/test";

test.describe("full user journey", () => {
  test("unauthenticated flow: home → dashboard → profile → 404 → reviews API", async ({ page }) => {
    // Home page loads with health check
    await page.goto("/");
    await expect(
      page.getByText(/neon auth \+ astro/i),
    ).toBeVisible();
    const body = page.locator("body");
    await expect(body).toContainText(/neon auth/i);
    await expect(body).toContainText(/neon db/i);

    // Nav shows Login link (unauthenticated)
    const navLogin = page.locator("nav").getByRole("link", { name: /log in/i });
    await expect(navLogin).toBeVisible();

    // Dashboard loads (with or without data)
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: /film catalog/i }),
    ).toBeVisible();

    // Film detail page responds without error
    await page.goto("/films/1");
    const filmResponse = await page.goto("/films/1");
    expect(filmResponse?.status()).not.toBe(500);
    expect(filmResponse?.status()).toBeGreaterThanOrEqual(200);
    expect(filmResponse?.status()).toBeLessThan(400);

    // Profile page shows unauthenticated state
    await page.goto("/profile");
    await expect(
      page.getByText(/not logged in/i),
    ).toBeVisible({ timeout: 10000 });

    // Profile has no sign-out button when unauthenticated
    const signOutButton = page.getByRole("button", { name: /sign out/i });
    await expect(signOutButton).not.toBeVisible();

    // Reviews API returns 401 without auth
    const reviewResponse = await page.request.post("/api/reviews", {
      data: { film_id: 1, rating: 4, content: "Great film!" },
    });
    expect([401, 302, 307]).toContain(reviewResponse.status());

    // Invalid film ID redirects
    await page.goto("/films/99999");
    await expect(
      page.getByRole("heading", { name: /neon auth \+ astro/i }),
    ).toBeVisible();

    // 404 page for nonexistent route
    const notFoundResponse = await page.goto("/nonexistent-page");
    expect(notFoundResponse?.status()).toBe(404);
    await expect(
      page.getByText(/page not found/i),
    ).toBeVisible();

    // Login page renders form
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /log in/i }),
    ).toBeVisible();

    // Signup page renders form
    await page.goto("/signup");
    await expect(
      page.getByRole("heading", { name: /sign up/i }),
    ).toBeVisible();
  });
});
