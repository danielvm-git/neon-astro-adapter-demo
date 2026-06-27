import { test, expect } from "@playwright/test";

test.describe("reviews API", () => {
  test("unauthenticated POST returns 401", async ({ page }) => {
    const response = await page.request.post("/api/reviews", {
      data: { film_id: 1, rating: 4, content: "Great film!" },
    });
    // Without auth cookie, should return 401 or redirect to login
    expect([401, 302, 307]).toContain(response.status());
  });
});
