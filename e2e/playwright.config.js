const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://web:3000",
    navigationTimeout: 15000,
    actionTimeout: 10000,
    trace: "on-first-retry",
    screenshot: "on",
    video: "retain-on-failure"
  },
  timeout: 30000,
  expect: {
    timeout: 10000, // increased for e2e stablity
    toHaveURL: { timeout: 10000 },
    toBeVisible: { timeout: 10000 }
  },
  globalSetup: require.resolve("./global-setup.js"),
  globalTeardown: require.resolve("./global-teardown.js"),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
