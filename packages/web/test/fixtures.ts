import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { test as base } from "@playwright/test";

import { bundle, coverageAttachment, type CoverageOptions } from "./coverage-data";

export { expect } from "@playwright/test";

const coverageBundleUrl = "https://m3e.test/dist/all.js";

/** Fixtures shared by component tests. */
export const test = base.extend<
  CoverageOptions & {
    /** Renders `html` in the page body, loads the bundle and waits for elements to finish their first update. */
    render: (html: string, direction?: "ltr" | "rtl") => Promise<void>;
  }
>({
  collectCoverage: [false, { option: true }],
  render: async ({ page, collectCoverage }, use, testInfo) => {
    if (!existsSync(bundle)) {
      throw new Error("The bundle is missing. Run `npm run build -w @m3e/web` before testing.");
    }
    const path = fileURLToPath(bundle);
    if (collectCoverage) {
      await page.route(coverageBundleUrl, (route) =>
        route.fulfill({ path, contentType: "text/javascript", headers: { "access-control-allow-origin": "*" } }),
      );
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
    }

    try {
      await use(async (html, direction) => {
        const directionAttribute = direction ? ` dir="${direction}"` : "";
        await page.setContent(
          `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body${directionAttribute}>${html}</body></html>`,
        );
        await page.addScriptTag(
          collectCoverage ? { url: coverageBundleUrl, type: "module" } : { path, type: "module" },
        );
        await page.waitForFunction(() => customElements.get("m3e-theme") !== undefined);
        await page.evaluate(() =>
          Promise.all(
            [...document.querySelectorAll("*")]
              .filter((x) => x.localName.startsWith("m3e-"))
              .map((x) => (x as Element & { updateComplete?: Promise<unknown> }).updateComplete),
          ),
        );
      });
    } finally {
      if (collectCoverage) {
        for (const entry of await page.coverage.stopJSCoverage()) {
          if (entry.url === coverageBundleUrl) {
            await testInfo.attach(coverageAttachment, {
              body: JSON.stringify(entry.functions),
              contentType: "application/json",
            });
          }
        }
      }
    }
  },
});
