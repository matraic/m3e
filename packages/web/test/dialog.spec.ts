import { expect, test } from "./fixtures";

test.describe("m3e-dialog", () => {
  test("opens from its trigger and exposes the dialog title", async ({ page, render }) => {
    await render(`
      <m3e-button>
        <m3e-dialog-trigger for="dialog">Open dialog</m3e-dialog-trigger>
      </m3e-button>
      <m3e-dialog id="dialog">
        <span slot="header">Dialog title</span>
        Dialog content
      </m3e-dialog>
    `);

    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();

    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(page.getByRole("dialog", { name: "Dialog title" })).toBeVisible();
  });

  test("dispatches lifecycle events when shown and hidden", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog"><span slot="header">Dialog title</span></m3e-dialog>');
    const dialog = page.locator("#dialog");
    await page.evaluate(() => {
      (window as unknown as { dialogEvents: string[] }).dialogEvents = [];
      const element = document.querySelector("m3e-dialog")!;
      for (const eventName of ["opening", "opened", "closing", "closed"]) {
        element.addEventListener(eventName, () =>
          (window as unknown as { dialogEvents: string[] }).dialogEvents.push(eventName),
        );
      }
    });

    await dialog.evaluate((element) => (element as HTMLElement & { show(): Promise<void> }).show());
    await expect(page.getByRole("dialog", { name: "Dialog title" })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { dialogEvents: string[] }).dialogEvents))
      .toEqual(["opening", "opened"]);

    await dialog.evaluate((element) => (element as HTMLElement & { hide(): Promise<void> }).hide());
    await expect(page.getByRole("dialog", { name: "Dialog title" })).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { dialogEvents: string[] }).dialogEvents))
      .toEqual(["opening", "opened", "closing", "closed"]);
  });

  test("can prevent opening through the opening event", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    const dialog = page.locator("#dialog");
    await dialog.evaluate((element) => {
      element.addEventListener("opening", (event) => event.preventDefault());
    });

    await dialog.evaluate((element) => (element as HTMLElement & { show(): Promise<void> }).show());
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("can prevent closing through the closing event", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    const dialog = page.locator("#dialog");
    await dialog.evaluate((element) => (element as HTMLElement & { show(): Promise<void> }).show());
    await expect(page.getByRole("dialog")).toBeVisible();
    await dialog.evaluate((element) => {
      element.addEventListener("closing", (event) => event.preventDefault());
    });

    await dialog.evaluate((element) => (element as HTMLElement & { hide(): Promise<void> }).hide());
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("closes through a dialog action and exposes its return value", async ({ page, render }) => {
    await render(`
      <m3e-dialog id="dialog">
        <span slot="header">Confirm</span>
        <div slot="actions">
          <m3e-button><m3e-dialog-action return-value="accepted">Accept</m3e-dialog-action></m3e-button>
        </div>
      </m3e-dialog>
    `);
    const dialog = page.locator("#dialog");

    await dialog.evaluate((element) => (element as HTMLElement & { show(): Promise<void> }).show());
    await expect(page.getByRole("dialog", { name: "Confirm" })).toBeVisible();
    await page.getByRole("button", { name: "Accept" }).click();

    await expect(page.getByRole("dialog", { name: "Confirm" })).toBeHidden();
    await expect(dialog).toHaveJSProperty("returnValue", "accepted");
  });

  test("provides an accessible close button when dismissible", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog" dismissible close-label="Dismiss prompt">Prompt</m3e-dialog>');
    const dialog = page.locator("#dialog");

    await dialog.evaluate((element) => (element as HTMLElement & { show(): Promise<void> }).show());
    await page.getByRole("button", { name: "Dismiss prompt" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("does not close on Escape when disable-close is set", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog" disable-close>Dialog content</m3e-dialog>');
    const dialog = page.locator("#dialog");

    await dialog.evaluate((element) => (element as HTMLElement & { show(): Promise<void> }).show());
    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toBeVisible();
    await dialog.evaluate((element) => (element as HTMLElement & { hide(): Promise<void> }).hide());
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("uses alertdialog semantics when alert is set", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog" alert><span slot="header">Delete item?</span></m3e-dialog>');
    await page.locator("#dialog").evaluate((element) => (element as HTMLElement & { show(): Promise<void> }).show());

    await expect(page.getByRole("alertdialog", { name: "Delete item?" })).toBeVisible();
  });
});
