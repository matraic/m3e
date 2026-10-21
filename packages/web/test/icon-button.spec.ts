import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

/** Records the toggle events dispatched by the first `m3e-icon-button`, optionally canceling `beforeinput`. */
function recordEvents(page: Page, cancelBeforeInput = false): Promise<void> {
  return page.evaluate((cancel) => {
    const events: string[] = [];
    (window as unknown as { events: string[] }).events = events;
    const button = document.querySelector("m3e-icon-button")!;
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

test.describe("m3e-icon-button", () => {
  test("exposes a focusable button named by its aria-label", async ({ page, render }) => {
    await render(`<m3e-icon-button variant="filled" aria-label="Save"></m3e-icon-button>`);
    const button = page.getByRole("button", { name: "Save" });

    await expect(button).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
  });

  test("toggles its selected state on click", async ({ page, render }) => {
    await render(`<m3e-icon-button toggle aria-label="Bold"></m3e-icon-button>`);
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
    await render(`<m3e-icon-button toggle aria-label="Bold"></m3e-icon-button>`);
    const button = page.getByRole("button", { name: "Bold" });
    await recordEvents(page, true);

    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "false");
    expect(await readEvents(page)).toEqual(["beforeinput"]);
  });

  test("cannot be focused or toggled when disabled", async ({ page, render }) => {
    await render(`<m3e-icon-button toggle disabled aria-label="Bold"></m3e-icon-button>`);
    const button = page.locator("m3e-icon-button");

    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).not.toHaveAttribute("tabindex");
    // Playwright refuses to click disabled elements, so click programmatically.
    await button.evaluate((x: HTMLElement) => x.click());
    await expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("can be focused but not toggled when disabled-interactive", async ({ page, render }) => {
    await render(`<m3e-icon-button toggle disabled-interactive aria-label="Bold"></m3e-icon-button>`);
    const button = page.locator("m3e-icon-button");

    await expect(button).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    await button.evaluate((x: HTMLElement) => x.click());
    await expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("toggles with the keyboard and updates its icon state", async ({ page, render }) => {
    await render(`
      <m3e-icon-button toggle aria-label="Favorite">
        <m3e-icon name="favorite"></m3e-icon>
      </m3e-icon-button>
    `);
    const button = page.getByRole("button", { name: "Favorite" });
    const icon = page.locator('m3e-icon[name="favorite"]');

    await button.focus();
    await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(icon).toHaveAttribute("filled", "");

    await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(icon).not.toHaveAttribute("filled");
  });

  test("resets its form when type is reset", async ({ page, render }) => {
    await render(`
      <form>
        <input id="name" value="Original" />
        <m3e-icon-button type="reset" aria-label="Reset"></m3e-icon-button>
      </form>
    `);
    const input = page.locator("#name");

    await input.fill("Changed");
    await page.getByRole("button", { name: "Reset" }).click();

    await expect(input).toHaveValue("Original");
  });

  test("submits its form name and value when type is submit", async ({ page, render }) => {
    await render(`
      <form>
        <m3e-icon-button type="submit" name="action" value="save" aria-label="Save"></m3e-icon-button>
      </form>
    `);
    await page.evaluate(() => {
      const form = document.querySelector("form")!;
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const submitter = (event as SubmitEvent).submitter as HTMLElement | null;
        (window as unknown as { submitted: unknown }).submitted = {
          submitter: submitter?.localName,
          values: Array.from(new FormData(form).entries()),
        };
      });
    });

    await page.getByRole("button", { name: "Save" }).click();

    await expect
      .poll(() => page.evaluate(() => (window as unknown as { submitted: unknown }).submitted))
      .toEqual({ submitter: "m3e-icon-button", values: [["action", "save"]] });
  });

  test("exposes link buttons as links", async ({ page, render }) => {
    await render('<m3e-icon-button href="#destination" aria-label="Go to destination"></m3e-icon-button>');

    await expect(page.getByRole("link", { name: "Go to destination" })).toBeVisible();
  });
});
