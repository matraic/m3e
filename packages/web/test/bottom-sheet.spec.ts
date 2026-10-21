import { expect, test } from "./fixtures";

test.describe("m3e-bottom-sheet", () => {
  test("opens from its trigger and closes from a sheet action", async ({ page, render }) => {
    await render(`
      <m3e-button>
        <m3e-bottom-sheet-trigger for="actions">Open actions</m3e-bottom-sheet-trigger>
      </m3e-button>
      <m3e-bottom-sheet id="actions">
        <m3e-button>
          <m3e-bottom-sheet-action>Close sheet</m3e-bottom-sheet-action>
        </m3e-button>
      </m3e-bottom-sheet>
    `);

    const sheet = page.locator("#actions");
    const trigger = page.getByRole("button", { name: "Open actions" });

    await trigger.click();
    await expect(sheet).toHaveAttribute("open", "");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.getByRole("button", { name: "Close sheet" }).click();
    await expect(sheet).not.toHaveAttribute("open");
  });

  test("can prevent opening through the opening event", async ({ page, render }) => {
    await render(`
      <m3e-button>
        <m3e-bottom-sheet-trigger for="actions">Open actions</m3e-bottom-sheet-trigger>
      </m3e-button>
      <m3e-bottom-sheet id="actions">Sheet content</m3e-bottom-sheet>
    `);

    await page.locator("#actions").evaluate((sheet) => {
      sheet.addEventListener("opening", (event) => event.preventDefault());
    });
    await page.getByRole("button", { name: "Open actions" }).click();

    await expect(page.locator("#actions")).not.toHaveAttribute("open");
  });

  test("dispatches lifecycle events when opening and closing", async ({ page, render }) => {
    await render('<m3e-bottom-sheet id="sheet">Sheet content</m3e-bottom-sheet>');
    const sheet = page.locator("#sheet");
    const events = page.evaluate(() => {
      const names: string[] = [];
      (window as unknown as { sheetEvents: string[] }).sheetEvents = names;
      const sheet = document.querySelector("m3e-bottom-sheet")!;
      for (const name of ["opening", "opened", "closing", "closed"]) {
        sheet.addEventListener(name, () => names.push(name));
      }
    });
    await events;

    await sheet.evaluate((element) => (element as HTMLElement & { show(): void }).show());
    await expect(sheet).toHaveAttribute("open", "");
    await expect.poll(() => page.evaluate(() => (window as unknown as { sheetEvents: string[] }).sheetEvents)).toEqual([
      "opening",
      "opened",
    ]);

    await sheet.evaluate((element) => (element as HTMLElement & { hide(): void }).hide());
    await expect(sheet).not.toHaveAttribute("open");
    await expect.poll(() => page.evaluate(() => (window as unknown as { sheetEvents: string[] }).sheetEvents)).toEqual([
      "opening",
      "opened",
      "closing",
      "closed",
    ]);
  });

  test("can prevent closing through the closing event", async ({ page, render }) => {
    await render('<m3e-bottom-sheet id="sheet" open>Sheet content</m3e-bottom-sheet>');
    const sheet = page.locator("#sheet");

    await sheet.evaluate((element) => {
      element.addEventListener("closing", (event) => event.preventDefault());
    });
    await sheet.evaluate((element) => (element as HTMLElement & { hide(): void }).hide());

    await expect(sheet).toHaveAttribute("open", "");
  });

  test("supports show, hide, and toggle methods", async ({ page, render }) => {
    await render('<m3e-bottom-sheet id="sheet">Sheet content</m3e-bottom-sheet>');
    const sheet = page.locator("#sheet");

    await sheet.evaluate((element) => (element as HTMLElement & { show(): void }).show());
    await expect(sheet).toHaveAttribute("open", "");

    await sheet.evaluate((element) => (element as HTMLElement & { toggle(): void }).toggle());
    await expect(sheet).not.toHaveAttribute("open");

    await sheet.evaluate((element) => (element as HTMLElement & { toggle(): void }).toggle());
    await expect(sheet).toHaveAttribute("open", "");

    await sheet.evaluate((element) => (element as HTMLElement & { hide(): void }).hide());
    await expect(sheet).not.toHaveAttribute("open");
  });

  test("closes a modal sheet on Escape and restores focus to its trigger", async ({ page, render }) => {
    await render(`
      <button id="opener">
        <m3e-bottom-sheet-trigger for="modal-sheet">Open modal sheet</m3e-bottom-sheet-trigger>
      </button>
      <m3e-bottom-sheet id="modal-sheet" modal>
        <button>Sheet action</button>
      </m3e-bottom-sheet>
    `);
    const sheet = page.getByRole("dialog");
    const trigger = page.getByRole("button", { name: "Open modal sheet" });

    await trigger.click();
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveAttribute("aria-modal", "true");
    await page.keyboard.press("Escape");

    await expect(page.locator("#modal-sheet")).not.toHaveAttribute("open");
    await expect(trigger).toBeFocused();
  });

  test("closes a modal sheet when clicking outside it", async ({ page, render }) => {
    await render(`
      <button>
        <m3e-bottom-sheet-trigger for="modal-sheet">Open modal sheet</m3e-bottom-sheet-trigger>
      </button>
      <m3e-bottom-sheet id="modal-sheet" modal>Sheet content</m3e-bottom-sheet>
    `);

    await page.getByRole("button", { name: "Open modal sheet" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.mouse.click(10, 10);

    await expect(page.locator("#modal-sheet")).not.toHaveAttribute("open");
  });

  test("can prevent modal dismissal through the cancel event", async ({ page, render }) => {
    await render('<m3e-bottom-sheet id="modal-sheet" modal open>Sheet content</m3e-bottom-sheet>');
    const sheet = page.locator("#modal-sheet");
    await expect(sheet).toBeVisible();
    await sheet.evaluate((element) => {
      element.addEventListener("cancel", (event) => event.preventDefault());
    });

    await page.keyboard.press("Escape");

    await expect(sheet).toHaveAttribute("open", "");
  });

  test("closes the previously opened sheet when another sheet opens", async ({ page, render }) => {
    await render(`
      <m3e-bottom-sheet id="first">First sheet</m3e-bottom-sheet>
      <m3e-bottom-sheet id="second">Second sheet</m3e-bottom-sheet>
    `);
    const first = page.locator("#first");
    const second = page.locator("#second");

    await first.evaluate((element) => (element as HTMLElement & { show(): void }).show());
    await expect(first).toHaveAttribute("open", "");

    await second.evaluate((element) => (element as HTMLElement & { show(): void }).show());
    await expect(second).toHaveAttribute("open", "");
    await expect(first).not.toHaveAttribute("open");
  });
});
