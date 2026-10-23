import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

function recordEvents(page: Page, cancelBeforeInput = false): Promise<void> {
  return page.evaluate((cancel) => {
    const events: string[] = [];
    (window as unknown as { switchEvents: string[] }).switchEvents = events;
    const el = document.querySelector("m3e-switch")!;
    for (const type of ["beforeinput", "input", "change"]) {
      el.addEventListener(type, (event) => {
        events.push(type);
        if (cancel && type === "beforeinput") event.preventDefault();
      });
    }
  }, cancelBeforeInput);
}

const readEvents = (page: Page) => page.evaluate(() => (window as unknown as { switchEvents: string[] }).switchEvents);

test.describe("m3e-switch", () => {
  test("exposes a focusable switch with its label", async ({ page, render }) => {
    await render(`<label>Wi-Fi <m3e-switch aria-label="Wi-Fi"></m3e-switch></label>`);
    const sw = page.getByRole("switch", { name: "Wi-Fi" });

    await expect(sw).toBeVisible();
    await expect(sw).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Tab");
    await expect(sw).toBeFocused();
  });

  test("clicking the label toggles the switch", async ({ page, render }) => {
    await render(`<label>Wi-Fi <m3e-switch aria-label="Wi-Fi"></m3e-switch></label>`);
    const sw = page.getByRole("switch", { name: "Wi-Fi" });

    await page.getByText("Wi-Fi").click();
    await expect(sw).toHaveAttribute("checked", "");
    await page.getByText("Wi-Fi").click();
    await expect(sw).not.toHaveAttribute("checked");
  });

  test("toggles on click and raises events in order", async ({ page, render }) => {
    await render(`<m3e-switch aria-label="Wi-Fi"></m3e-switch>`);
    const sw = page.getByRole("switch");
    await recordEvents(page);

    await sw.click();
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await sw.click();
    await expect(sw).toHaveAttribute("aria-checked", "false");

    expect(await readEvents(page)).toEqual(["beforeinput", "input", "change", "beforeinput", "input", "change"]);
  });

  test("a cancelled beforeinput prevents the change", async ({ page, render }) => {
    await render(`<m3e-switch aria-label="Wi-Fi"></m3e-switch>`);
    const sw = page.getByRole("switch");
    await recordEvents(page, true);

    await sw.click();

    await expect(sw).not.toHaveAttribute("checked");
    expect(await readEvents(page)).toEqual(["beforeinput"]);
  });

  test("toggles with Space and Enter", async ({ page, render }) => {
    await render(`<m3e-switch aria-label="Wi-Fi"></m3e-switch>`);
    const sw = page.getByRole("switch");

    await sw.focus();
    await page.keyboard.press("Enter");
    await expect(sw).toHaveAttribute("checked", "");
    await page.keyboard.press("Space");
    await expect(sw).not.toHaveAttribute("checked");
  });

  test("initial checked attribute is reflected", async ({ page, render }) => {
    await render(`<m3e-switch checked aria-label="Wi-Fi"></m3e-switch>`);
    await expect(page.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  test("disabled switch is not focusable and does not toggle", async ({ page, render }) => {
    await render(`<m3e-switch disabled aria-label="Wi-Fi"></m3e-switch>`);
    const sw = page.getByRole("switch");
    await recordEvents(page);

    await expect(sw).toHaveAttribute("aria-disabled", "true");
    await expect(sw).not.toHaveAttribute("tabindex");
    await sw.evaluate((el: HTMLElement) => el.click());

    await expect(sw).not.toHaveAttribute("checked");
    expect(await readEvents(page)).toEqual([]);
  });

  test("icons default to none and invalid values fall back", async ({ page, render }) => {
    await render(`<m3e-switch aria-label="a"></m3e-switch><m3e-switch icons="bogus" aria-label="b"></m3e-switch>`);

    expect(
      await page
        .locator("m3e-switch")
        .first()
        .evaluate((el) => (el as unknown as { icons: string }).icons),
    ).toBe("none");
    await expect(page.locator("m3e-switch").nth(1)).toHaveAttribute("icons", "none");
  });

  for (const icons of ["none", "selected", "both"]) {
    test(`icons="${icons}" is accepted`, async ({ page, render }) => {
      await render(`<m3e-switch icons="${icons}" aria-label="Wi-Fi"></m3e-switch>`);
      expect(await page.locator("m3e-switch").evaluate((el) => (el as unknown as { icons: string }).icons)).toBe(icons);
    });
  }

  test("submits name and value only when checked", async ({ page, render }) => {
    await render(`<form id="f"><m3e-switch name="wifi" value="yes" aria-label="Wi-Fi"></m3e-switch></form>`);
    const sw = page.getByRole("switch");
    const values = () => page.locator("#f").evaluate((f) => Array.from(new FormData(f as HTMLFormElement).entries()));

    expect(await values()).toEqual([]);
    await sw.click();
    await expect.poll(values).toEqual([["wifi", "yes"]]);
    await sw.click();
    await expect.poll(values).toEqual([]);
  });

  test("defaults the submitted value to on", async ({ page, render }) => {
    await render(`<form id="f"><m3e-switch name="wifi" checked aria-label="Wi-Fi"></m3e-switch></form>`);

    expect(await page.locator("#f").evaluate((f) => new FormData(f as HTMLFormElement).get("wifi"))).toBe("on");
  });

  test("a disabled switch is not submitted", async ({ page, render }) => {
    await render(`<form id="f"><m3e-switch name="wifi" checked disabled aria-label="Wi-Fi"></m3e-switch></form>`);

    expect(await page.locator("#f").evaluate((f) => new FormData(f as HTMLFormElement).has("wifi"))).toBe(false);
  });

  test("form reset restores the initial state", async ({ page, render }) => {
    await render(`
      <form id="f">
        <m3e-switch checked aria-label="Wi-Fi"></m3e-switch>
        <button type="reset">Reset</button>
      </form>`);
    const sw = page.getByRole("switch");

    await sw.click();
    await expect(sw).not.toHaveAttribute("checked");
    await page.getByRole("button", { name: "Reset" }).click();

    await expect(sw).toHaveAttribute("checked", "");
  });
});
