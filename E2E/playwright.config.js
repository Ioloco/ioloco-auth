// E2E/playwright.config.js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: false,
  },
  projects: [
    {
      name: "nextjs",
      testDir: "./tests/nextjs",
    },
  ],
  // reporter: [["list"]],
  // outputDir: "/dev/null", // ignore all test artifacts
  // use: {
  //   trace: "off",
  //   video: "off",
  //   screenshot: "off",
  // },
});
