import { defineConfig } from "@playwright/test";

import config from "./playwright.config";
import type { CoverageOptions } from "./test/coverage-data";

export default defineConfig<CoverageOptions>({
  ...config,
  use: { ...config.use, collectCoverage: true },
  reporter: [["list"], ["./test/coverage-reporter.ts"]],
});
