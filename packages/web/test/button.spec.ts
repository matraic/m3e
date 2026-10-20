import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

/** Records the toggle events dispatched by the first `m3e-button`, optionally canceling `beforeinput`. */
function recordEvents(page: Page, cancelBeforeInput = false): Promise<void> {
  return page.evaluate((cancel) => {
    const events: string[] = [];
    (window as unknown as { events: string[] }).events = events;
    const button = document.querySelector("m3e-button")!;
    for (const type of ["beforeinput", "input", "change"]) {
      button.addEventListener(type, (e) => {
        events.push(type);
        if (cancel && type === "beforeinput") e.preventDefault();
      });
    }
  }, cancelBeforeInput);
}

function readEvents(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { events: string[] }).events);
}

test.describe("m3e-button", () => {
  test("exposes a focusable button named by its label", async ({ page, render }) => {
    await render(`<m3e-button variant="filled">Save</m3e-button>`);
    const button = page.getByRole("button", { name: "Save" });

    await expect(button).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
  });

  test("toggles its selected state on click", async ({ page, render }) => {
    await render(`<m3e-button toggle>Bold</m3e-button>`);
    const button = page.getByRole("button", { name: "Bold" });
    await recordEvents(page);

    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(button).toHaveAttribute("selected", "");
    expect(await readEvents(page)).toEqual(["beforeinput", "input", "change"]);

    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("keeps its selected state when beforeinput is canceled", async ({ page, render }) => {
    await render(`<m3e-button toggle>Bold</m3e-button>`);
    const button = page.getByRole("button", { name: "Bold" });
    await recordEvents(page, true);

    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "false");
    expect(await readEvents(page)).toEqual(["beforeinput"]);
  });

  test("cannot be focused or toggled when disabled", async ({ page, render }) => {
    await render(`<m3e-button toggle disabled>Bold</m3e-button>`);
    const button = page.locator("m3e-button");

    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).not.toHaveAttribute("tabindex");
    // Playwright refuses to click disabled elements, so click programmatically.
    await button.evaluate((x: HTMLElement) => x.click());
    await expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("can be focused but not toggled when disabled-interactive", async ({ page, render }) => {
    await render(`<m3e-button toggle disabled-interactive>Bold</m3e-button>`);
    const button = page.locator("m3e-button");

    await expect(button).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    await button.evaluate((x: HTMLElement) => x.click());
    await expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
