import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

/** Records checkbox state-change events, optionally canceling `beforeinput`. */
function recordEvents(page: Page, cancelBeforeInput = false): Promise<void> {
  return page.evaluate((cancel) => {
    const events: string[] = [];
    (window as unknown as { checkboxEvents: string[] }).checkboxEvents = events;
    const checkbox = document.querySelector("m3e-checkbox")!;
    for (const type of ["beforeinput", "input", "change"]) {
      checkbox.addEventListener(type, (event) => {
        events.push(type);
        if (cancel && type === "beforeinput") event.preventDefault();
      });
    }
  }, cancelBeforeInput);
}

function readEvents(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { checkboxEvents: string[] }).checkboxEvents);
}

test.describe("m3e-checkbox", () => {
  test("exposes a focusable checkbox with its associated label", async ({ page, render }) => {
    await render(`
      <label>
        <m3e-checkbox aria-label="Receive updates"></m3e-checkbox>
        Receive updates
      </label>
    `);
    const checkbox = page.getByRole("checkbox", { name: "Receive updates" });

    await expect(checkbox).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(checkbox).toBeFocused();

    await page.getByText("Receive updates", { exact: true }).click();
    await expect(checkbox).toHaveAttribute("checked", "");
  });

  test("toggles checked state and dispatches state-change events", async ({ page, render }) => {
    await render('<m3e-checkbox aria-label="Receive updates"></m3e-checkbox>');
    const checkbox = page.getByRole("checkbox", { name: "Receive updates" });
    await recordEvents(page);

    await checkbox.click();
    await expect(checkbox).toHaveAttribute("checked", "");
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(await readEvents(page)).toEqual(["beforeinput", "input", "change"]);

    await checkbox.click();
    await expect(checkbox).not.toHaveAttribute("checked");
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(await readEvents(page)).toEqual(["beforeinput", "input", "change", "beforeinput", "input", "change"]);
  });

  test("does not change state when beforeinput is canceled", async ({ page, render }) => {
    await render('<m3e-checkbox aria-label="Receive updates"></m3e-checkbox>');
    const checkbox = page.getByRole("checkbox", { name: "Receive updates" });
    await recordEvents(page, true);

    await checkbox.click();

    await expect(checkbox).not.toHaveAttribute("checked");
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(await readEvents(page)).toEqual(["beforeinput"]);
  });

  test("clears indeterminate state when activated", async ({ page, render }) => {
    await render('<m3e-checkbox indeterminate aria-label="Select all"></m3e-checkbox>');
    const checkbox = page.getByRole("checkbox", { name: "Select all" });

    await expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    await checkbox.click();

    await expect(checkbox).toHaveAttribute("checked", "");
    await expect(checkbox).not.toHaveAttribute("indeterminate");
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  test("toggles with Space but not Enter", async ({ page, render }) => {
    await render('<m3e-checkbox aria-label="Receive updates"></m3e-checkbox>');
    const checkbox = page.getByRole("checkbox", { name: "Receive updates" });

    await checkbox.focus();
    await page.keyboard.press("Enter");
    await expect(checkbox).not.toHaveAttribute("checked");

    await page.keyboard.press("Space");
    await expect(checkbox).toHaveAttribute("checked", "");
  });

  test("cannot be focused or changed when disabled", async ({ page, render }) => {
    await render('<m3e-checkbox disabled aria-label="Unavailable"></m3e-checkbox>');
    const checkbox = page.getByRole("checkbox", { name: "Unavailable" });

    await expect(checkbox).toHaveAttribute("aria-disabled", "true");
    await expect(checkbox).not.toHaveAttribute("tabindex");
    await checkbox.evaluate((element: HTMLElement) => element.click());
    await expect(checkbox).not.toHaveAttribute("checked");
  });

  test("submits its name and value only when checked", async ({ page, render }) => {
    await render(`
      <form id="preferences">
        <m3e-checkbox name="updates" value="weekly" aria-label="Weekly updates"></m3e-checkbox>
      </form>
    `);
    const checkbox = page.getByRole("checkbox", { name: "Weekly updates" });
    const formValues = () =>
      page.locator("#preferences").evaluate((form) => Array.from(new FormData(form as HTMLFormElement).entries()));

    expect(await formValues()).toEqual([]);
    await checkbox.click();
    await expect.poll(formValues).toEqual([["updates", "weekly"]]);

    await checkbox.click();
    await expect.poll(formValues).toEqual([]);
  });

  test("restores its initial checked state on form reset", async ({ page, render }) => {
    await render(`
      <form id="preferences">
        <m3e-checkbox checked aria-label="Receive updates"></m3e-checkbox>
        <button type="reset">Reset</button>
      </form>
    `);
    const checkbox = page.getByRole("checkbox", { name: "Receive updates" });

    await checkbox.click();
    await expect(checkbox).not.toHaveAttribute("checked");
    await page.getByRole("button", { name: "Reset" }).click();

    await expect(checkbox).toHaveAttribute("checked", "");
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  test("fails required validation until checked", async ({ page, render }) => {
    await render(`
      <form id="preferences">
        <m3e-checkbox required name="terms" value="accepted" aria-label="Accept terms"></m3e-checkbox>
      </form>
    `);
    const checkbox = page.getByRole("checkbox", { name: "Accept terms" });
    const formIsValid = () => page.locator("#preferences").evaluate((form) => (form as HTMLFormElement).checkValidity());

    expect(await formIsValid()).toBe(false);
    await checkbox.click();
    await expect.poll(formIsValid).toBe(true);
  });
});
