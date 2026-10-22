import { expect, test } from "./fixtures";

test.describe("m3e-dialog", () => {
  test("opens from its trigger and exposes the dialog title", async ({
    page,
    render,
  }) => {
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
    await expect(
      page.getByRole("dialog", { name: "Dialog title" }),
    ).toBeVisible();
  });

  test("dispatches lifecycle events when shown and hidden", async ({
    page,
    render,
  }) => {
    await render(
      '<m3e-dialog id="dialog"><span slot="header">Dialog title</span></m3e-dialog>',
    );
    const dialog = page.locator("#dialog");
    await page.evaluate(() => {
      (window as unknown as { dialogEvents: string[] }).dialogEvents = [];
      const element = document.querySelector("m3e-dialog")!;
      for (const eventName of ["opening", "opened", "closing", "closed"]) {
        element.addEventListener(eventName, () =>
          (window as unknown as { dialogEvents: string[] }).dialogEvents.push(
            eventName,
          ),
        );
      }
    });

    await dialog.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );
    await expect(
      page.getByRole("dialog", { name: "Dialog title" }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { dialogEvents: string[] }).dialogEvents,
        ),
      )
      .toEqual(["opening", "opened"]);

    await dialog.evaluate((element) =>
      (element as HTMLElement & { hide(): Promise<void> }).hide(),
    );
    await expect(
      page.getByRole("dialog", { name: "Dialog title" }),
    ).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { dialogEvents: string[] }).dialogEvents,
        ),
      )
      .toEqual(["opening", "opened", "closing", "closed"]);
  });

  test("can prevent opening through the opening event", async ({
    page,
    render,
  }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    const dialog = page.locator("#dialog");
    await dialog.evaluate((element) => {
      element.addEventListener("opening", (event) => event.preventDefault());
    });

    await dialog.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("can prevent closing through the closing event", async ({
    page,
    render,
  }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    const dialog = page.locator("#dialog");
    await dialog.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );
    await expect(page.getByRole("dialog")).toBeVisible();
    await dialog.evaluate((element) => {
      element.addEventListener("closing", (event) => event.preventDefault());
    });

    await dialog.evaluate((element) =>
      (element as HTMLElement & { hide(): Promise<void> }).hide(),
    );
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("closes through a dialog action and exposes its return value", async ({
    page,
    render,
  }) => {
    await render(`
      <m3e-dialog id="dialog">
        <span slot="header">Confirm</span>
        <div slot="actions">
          <m3e-button><m3e-dialog-action return-value="accepted">Accept</m3e-dialog-action></m3e-button>
        </div>
      </m3e-dialog>
    `);
    const dialog = page.locator("#dialog");

    await dialog.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );
    await expect(page.getByRole("dialog", { name: "Confirm" })).toBeVisible();
    await page.getByRole("button", { name: "Accept" }).click();

    await expect(page.getByRole("dialog", { name: "Confirm" })).toBeHidden();
    await expect(dialog).toHaveJSProperty("returnValue", "accepted");
  });

  test("provides an accessible close button when dismissible", async ({
    page,
    render,
  }) => {
    await render(
      '<m3e-dialog id="dialog" dismissible close-label="Dismiss prompt">Prompt</m3e-dialog>',
    );
    const dialog = page.locator("#dialog");

    await dialog.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );
    await page.getByRole("button", { name: "Dismiss prompt" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("does not close on Escape when disable-close is set", async ({
    page,
    render,
  }) => {
    await render(
      '<m3e-dialog id="dialog" disable-close>Dialog content</m3e-dialog>',
    );
    const dialog = page.locator("#dialog");

    await dialog.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );
    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toBeVisible();
    await dialog.evaluate((element) =>
      (element as HTMLElement & { hide(): Promise<void> }).hide(),
    );
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("closes on Escape by default", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    await page
      .locator("#dialog")
      .evaluate((element) =>
        (element as HTMLElement & { show(): Promise<void> }).show(),
      );
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("closes when the backdrop is clicked", async ({ page, render }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    await page
      .locator("#dialog")
      .evaluate((element) =>
        (element as HTMLElement & { show(): Promise<void> }).show(),
      );
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.mouse.click(5, 5);

    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("does not close when the backdrop is clicked and disable-close is set", async ({
    page,
    render,
  }) => {
    await render(
      '<m3e-dialog id="dialog" disable-close>Dialog content</m3e-dialog>',
    );
    await page
      .locator("#dialog")
      .evaluate((element) =>
        (element as HTMLElement & { show(): Promise<void> }).show(),
      );
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.mouse.click(5, 5);

    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("can prevent cancellation through the cancel event", async ({
    page,
    render,
  }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    const dialog = page.locator("#dialog");
    await dialog.evaluate((element) => {
      (window as unknown as { cancelCount: number }).cancelCount = 0;
      element.addEventListener("cancel", (event) => {
        (window as unknown as { cancelCount: number }).cancelCount++;
        event.preventDefault();
      });
      return (element as HTMLElement & { show(): Promise<void> }).show();
    });
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { cancelCount: number }).cancelCount,
        ),
      )
      .toBe(1);
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("opens when the open attribute is set and clears it when hidden", async ({
    page,
    render,
  }) => {
    await render('<m3e-dialog id="dialog">Dialog content</m3e-dialog>');
    const dialog = page.locator("#dialog");

    await dialog.evaluate((element) => element.setAttribute("open", ""));
    await expect(page.getByRole("dialog")).toBeVisible();

    await dialog.evaluate((element) =>
      (element as HTMLElement & { hide(): Promise<void> }).hide(),
    );
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(dialog).not.toHaveAttribute("open");
  });

  test("renders header and content slots", async ({ page, render }) => {
    await render(`
      <m3e-dialog id="dialog">
        <span slot="header">Settings</span>
        <p>Body text</p>
      </m3e-dialog>
    `);
    await page
      .locator("#dialog")
      .evaluate((element) =>
        (element as HTMLElement & { show(): Promise<void> }).show(),
      );

    const dialog = page.getByRole("dialog", { name: "Settings" });
    await expect(dialog).toBeVisible();
    await expect(page.getByText("Body text")).toBeVisible();
  });

  test("tracks whether actions are slotted", async ({ page, render }) => {
    await render(`
      <m3e-dialog id="with-actions">
        <div slot="actions"><m3e-button>OK</m3e-button></div>
      </m3e-dialog>
      <m3e-dialog id="without-actions">Content</m3e-dialog>
    `);
    const withActions = page.locator("#with-actions");
    const withoutActions = page.locator("#without-actions");

    await withActions.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );
    await withoutActions.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );

    await expect
      .poll(() =>
        withActions.evaluate((element) =>
          element.matches(":state(--with-actions)"),
        ),
      )
      .toBe(true);
    await expect
      .poll(() =>
        withoutActions.evaluate((element) =>
          element.matches(":state(--with-actions)"),
        ),
      )
      .toBe(false);
  });

  test("keeps keyboard focus inside the dialog", async ({ page, render }) => {
    await render(`
      <button id="outside">Outside</button>
      <m3e-dialog id="dialog">
        <input aria-label="First" />
        <div slot="actions">
          <m3e-button><m3e-dialog-action>Close</m3e-dialog-action></m3e-button>
        </div>
      </m3e-dialog>
    `);
    await page
      .locator("#dialog")
      .evaluate((element) =>
        (element as HTMLElement & { show(): Promise<void> }).show(),
      );
    await expect(page.getByRole("dialog")).toBeVisible();

    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      await expect(page.locator("#outside")).not.toBeFocused();
      expect(
        await page.evaluate(
          () => document.activeElement?.closest("m3e-dialog") !== null,
        ),
      ).toBe(true);
    }
  });

  test("disables the focus trap when no-focus-trap is set", async ({
    page,
    render,
  }) => {
    await render(
      '<m3e-dialog id="dialog" no-focus-trap>Dialog content</m3e-dialog>',
    );
    const dialog = page.locator("#dialog");
    await dialog.evaluate((element) =>
      (element as HTMLElement & { show(): Promise<void> }).show(),
    );

    await expect
      .poll(() =>
        dialog.evaluate((element) =>
          element
            .shadowRoot!.querySelector("m3e-focus-trap")!
            .hasAttribute("disabled"),
        ),
      )
      .toBe(true);
  });

  test("restores focus to the opener when closed", async ({ page, render }) => {
    await render(`
      <m3e-button><m3e-dialog-trigger for="dialog">Open dialog</m3e-dialog-trigger></m3e-button>
      <m3e-dialog id="dialog" dismissible>Dialog content</m3e-dialog>
    `);
    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("uses alertdialog semantics when alert is set", async ({
    page,
    render,
  }) => {
    await render(
      '<m3e-dialog id="dialog" alert><span slot="header">Delete item?</span></m3e-dialog>',
    );
    await page
      .locator("#dialog")
      .evaluate((element) =>
        (element as HTMLElement & { show(): Promise<void> }).show(),
      );

    await expect(
      page.getByRole("alertdialog", { name: "Delete item?" }),
    ).toBeVisible();
  });
});
