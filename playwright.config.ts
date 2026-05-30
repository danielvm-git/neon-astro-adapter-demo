import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "local",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "live",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.LIVE_URL || "https://neon-astro-demo.netlify.app",
      },
    },
  ],
  webServer: {
    command: "npx astro dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
