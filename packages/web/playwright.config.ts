/// <reference types="node" />

import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const bddTestDir = defineBddConfig({
  features: "test/**/*.feature",
  steps: "test/**/*.steps.ts",
  outputDir: ".features-gen",
  tags: "not @needs-review",
});

export default defineConfig({
  testDir: "./test",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-bdd", testDir: bddTestDir, use: { ...devices["Desktop Chrome"] } },
  ],
});
