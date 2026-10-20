import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/** The built bundle that registers every element. */
const bundle = fileURLToPath(new URL("../dist/all.js", import.meta.url));

/** Fixtures shared by component tests. */
export const test = base.extend<{
  /** Renders `html` in the page body, loads the bundle and waits for elements to finish their first update. */
  render: (html: string) => Promise<void>;
}>({
  render: async ({ page }, use) => {
    if (!existsSync(bundle)) {
      throw new Error("The bundle is missing. Run `npm run build -w @m3e/web` before testing.");
    }
    await use(async (html) => {
      await page.setContent(`<!doctype html><html><body>${html}</body></html>`);
      await page.addScriptTag({ path: bundle, type: "module" });
      await page.waitForFunction(() => customElements.get("m3e-theme") !== undefined);
      await page.evaluate(() =>
        Promise.all(
          [...document.querySelectorAll("*")]
            .filter((x) => x.localName.startsWith("m3e-"))
            .map((x) => (x as Element & { updateComplete?: Promise<unknown> }).updateComplete),
        ),
      );
    });
  },
});
