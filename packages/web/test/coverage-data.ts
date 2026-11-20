import type { Page } from "@playwright/test";

export const bundle = new URL("../dist/all.js", import.meta.url);
export const coverageAttachment = "browser-js-coverage";

export type CoverageOptions = { collectCoverage: boolean };
export type CoverageFunctions = Awaited<ReturnType<Page["coverage"]["stopJSCoverage"]>>[number]["functions"];
