import { expect, test } from "./fixtures";

test.describe("m3e-expansion-panel", () => {
  test("expands from its accessible header and exposes its content region", async ({ page, render }) => {
    await render(`
      <m3e-expansion-panel>
        <span slot="header">Shipping details</span>
        Delivery takes three to five business days.
      </m3e-expansion-panel>
    `);
    const header = page.getByRole("button", { name: "Shipping details" });
    const region = page.getByRole("region", { name: "Shipping details" });

    await expect(header).toHaveAttribute("aria-expanded", "false");
    await expect(region).toBeHidden();

    await header.click();

    await expect(page.locator("m3e-expansion-panel")).toHaveAttribute("open", "");
    await expect(header).toHaveAttribute("aria-expanded", "true");
    await expect(region).toBeVisible();
    await expect(page.getByText("Delivery takes three to five business days.")).toBeVisible();
  });

  test("dispatches lifecycle events when expanded and collapsed", async ({ page, render }) => {
    await render(`
      <m3e-expansion-panel>
        <span slot="header">Details</span>
        Panel content
      </m3e-expansion-panel>
    `);
    const panel = page.locator("m3e-expansion-panel");
    await page.evaluate(() => {
      (window as unknown as { panelEvents: string[] }).panelEvents = [];
      const element = document.querySelector("m3e-expansion-panel")!;
      for (const name of ["opening", "opened", "closing", "closed"]) {
        element.addEventListener(name, () => (window as unknown as { panelEvents: string[] }).panelEvents.push(name));
      }
    });

    await page.getByRole("button", { name: "Details" }).click();
    await expect(panel).toHaveAttribute("open", "");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { panelEvents: string[] }).panelEvents))
      .toEqual(["opening", "opened"]);

    await page.getByRole("button", { name: "Details" }).click();
    await expect(panel).not.toHaveAttribute("open");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { panelEvents: string[] }).panelEvents))
      .toEqual(["opening", "opened", "closing", "closed"]);
  });

  test("does not expand when disabled", async ({ page, render }) => {
    await render(`
      <m3e-expansion-panel disabled>
        <span slot="header">Unavailable section</span>
        Panel content
      </m3e-expansion-panel>
    `);
    const header = page.getByRole("button", { name: "Unavailable section" });
    const panel = page.locator("m3e-expansion-panel");

    await expect(header).toHaveAttribute("aria-disabled", "true");
    await header.evaluate((element) => (element as HTMLElement).click());

    await expect(panel).not.toHaveAttribute("open");
    await expect(header).toHaveAttribute("aria-expanded", "false");
  });

  test("allows only one panel open in an accordion by default", async ({ page, render }) => {
    await render(`
      <m3e-accordion>
        <m3e-expansion-panel>
          <span slot="header">First</span>
          First content
        </m3e-expansion-panel>
        <m3e-expansion-panel>
          <span slot="header">Second</span>
          Second content
        </m3e-expansion-panel>
      </m3e-accordion>
    `);
    const first = page.locator("m3e-expansion-panel").nth(0);
    const second = page.locator("m3e-expansion-panel").nth(1);

    await page.getByRole("button", { name: "First" }).click();
    await expect(first).toHaveAttribute("open", "");
    await page.getByRole("button", { name: "Second" }).click();

    await expect(second).toHaveAttribute("open", "");
    await expect(first).not.toHaveAttribute("open");
  });

  test("allows multiple panels open in a multi accordion", async ({ page, render }) => {
    await render(`
      <m3e-accordion multi>
        <m3e-expansion-panel>
          <span slot="header">First</span>
          First content
        </m3e-expansion-panel>
        <m3e-expansion-panel>
          <span slot="header">Second</span>
          Second content
        </m3e-expansion-panel>
      </m3e-accordion>
    `);
    const panels = page.locator("m3e-expansion-panel");

    await page.getByRole("button", { name: "First" }).click();
    await page.getByRole("button", { name: "Second" }).click();

    await expect(panels.nth(0)).toHaveAttribute("open", "");
    await expect(panels.nth(1)).toHaveAttribute("open", "");
  });

  const panel = (attrs = "") => `
    <m3e-expansion-panel ${attrs}>
      <span slot="header">Details</span>
      Panel content
    </m3e-expansion-panel>
  `;

  test("defaults the header toggle to vertical and after", async ({ page, render }) => {
    await render(panel());
    const header = page.locator("m3e-expansion-header");

    await expect(header).toHaveAttribute("toggle-direction", "vertical");
    await expect(header).toHaveAttribute("toggle-position", "after");
  });

  test("falls back to defaults for invalid toggle values", async ({ page, render }) => {
    await render(panel('toggle-direction="bogus" toggle-position="bogus"'));
    const header = page.locator("m3e-expansion-header");

    await expect(header).toHaveAttribute("toggle-direction", "vertical");
    await expect(header).toHaveAttribute("toggle-position", "after");
  });

  test("hide-toggle hides the toggle icon", async ({ page, render }) => {
    await render(panel());
    const toggle = page.locator("m3e-expansion-header").locator(".toggle[aria-hidden]");
    await expect(toggle).toBeVisible();

    await page
      .locator("m3e-expansion-panel")
      .evaluate((el) => ((el as HTMLElement & { hideToggle: boolean }).hideToggle = true));

    await expect(page.locator("m3e-expansion-header")).toHaveAttribute("hide-toggle", "");
    await expect(toggle).toBeHidden();
  });

  test("toggle-position places the toggle before or after the header content", async ({ page, render }) => {
    await render(`${panel('id="a" toggle-position="before"')}${panel('id="b" toggle-position="after"')}`);
    const isBefore = (id: string) =>
      page.locator(id).evaluate((el) => {
        const text = el.querySelector("[slot=header]")!.getBoundingClientRect();
        const toggle = el
          .shadowRoot!.querySelector("m3e-expansion-header")!
          .shadowRoot!.querySelector(".toggle")!
          .getBoundingClientRect();
        return toggle.left < text.left;
      });

    expect(await isBefore("#a")).toBe(true);
    expect(await isBefore("#b")).toBe(false);
  });

  test("toggles open with Enter and Space from the header", async ({ page, render }) => {
    await render(panel());
    const header = page.getByRole("button", { name: "Details" });

    await header.focus();
    await page.keyboard.press("Enter");
    await expect(header).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Space");
    await expect(header).toHaveAttribute("aria-expanded", "false");
  });
});
