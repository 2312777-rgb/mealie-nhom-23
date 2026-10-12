import { defineConfig } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 20_000 },
  updateSnapshots: "none",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["json", { outputFile: "test-results/results.json" }], ["list"]],
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  use: {
    baseURL: process.env.MEALIE_BASE_URL ?? "http://localhost:3000",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "UTC",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    permissions: ["screen-wake-lock"],
  },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      testMatch: /visual\.spec\.ts/,
      use: { browserName: "chromium", storageState: ".auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "smoke",
      testMatch: /business\.spec\.ts/,
      use: { browserName: "chromium", storageState: ".auth/user.json" },
      dependencies: ["setup"],
    },
  ],
});
