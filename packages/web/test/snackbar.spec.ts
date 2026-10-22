import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

type Service = {
  open(...args: unknown[]): void;
  dismiss(): void;
};

const service = <T>(page: Page, fn: (s: Service) => T) =>
  page.evaluate(`(${fn.toString()})(window.M3eSnackbar)`) as Promise<T>;

test.describe("m3e-snackbar", () => {
  test("is hidden until opened", async ({ page, render }) => {
    await render(`<m3e-snackbar>File deleted</m3e-snackbar>`);

    await expect(page.locator("m3e-snackbar")).toBeHidden();
  });

  test("opens when the open attribute is set and announces politely", async ({ page, render }) => {
    await render(`<m3e-snackbar open duration="0">File deleted</m3e-snackbar>`);
    const snackbar = page.locator("m3e-snackbar");

    await expect(snackbar).toBeVisible();
    await expect(snackbar).toHaveAttribute("aria-live", "polite");
    await expect(snackbar).toHaveAttribute("popover", "manual");
    await expect(page.getByText("File deleted")).toBeVisible();
  });

  test("closes when the open attribute is removed", async ({ page, render }) => {
    await render(`<m3e-snackbar open duration="0">File deleted</m3e-snackbar>`);
    const snackbar = page.locator("m3e-snackbar");
    await expect(snackbar).toBeVisible();

    await snackbar.evaluate((el) => el.removeAttribute("open"));

    await expect(snackbar).toBeHidden();
  });

  test("dismisses automatically after its duration and clears open", async ({ page, render }) => {
    await render(`<m3e-snackbar open duration="300">File deleted</m3e-snackbar>`);
    const snackbar = page.locator("m3e-snackbar");
    await expect(snackbar).toBeVisible();

    await expect(snackbar).toBeHidden();
    await expect(snackbar).not.toHaveAttribute("open");
  });

  test("stays open when the duration is 0", async ({ page, render }) => {
    await render(`<m3e-snackbar open duration="0">File deleted</m3e-snackbar>`);

    await page.waitForTimeout(500);

    await expect(page.locator("m3e-snackbar")).toBeVisible();
  });

  test("shows an action button only when an action is set", async ({ page, render }) => {
    await render(`
      <m3e-snackbar id="plain" open duration="0">Plain</m3e-snackbar>
      <m3e-snackbar id="actionable" open duration="0" action="Undo">Actionable</m3e-snackbar>
    `);

    await expect(page.locator("#plain").getByRole("button")).toHaveCount(0);
    await expect(page.locator("#actionable").getByRole("button", { name: "Undo" })).toBeVisible();
  });

  test("closes when the action is clicked", async ({ page, render }) => {
    await render(`<m3e-snackbar open duration="0" action="Undo">File deleted</m3e-snackbar>`);

    await page.getByRole("button", { name: "Undo" }).click();

    await expect(page.locator("m3e-snackbar")).toBeHidden();
    expect(
      await page
        .locator("m3e-snackbar")
        .evaluate((el) => (el as HTMLElement & { isActionTaken: boolean }).isActionTaken),
    ).toBe(true);
  });

  test("shows a close button only when dismissible", async ({ page, render }) => {
    await render(`
      <m3e-snackbar id="plain" open duration="0">Plain</m3e-snackbar>
      <m3e-snackbar id="closable" open duration="0" dismissible>Closable</m3e-snackbar>
    `);

    await expect(page.locator("#plain").getByRole("button")).toHaveCount(0);
    await expect(page.locator("#closable").getByRole("button", { name: "Close" })).toBeVisible();
  });

  test("closes without taking the action when the close button is clicked", async ({ page, render }) => {
    await render(`<m3e-snackbar open duration="0" dismissible action="Undo">File deleted</m3e-snackbar>`);

    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.locator("m3e-snackbar")).toBeHidden();
    expect(
      await page
        .locator("m3e-snackbar")
        .evaluate((el) => (el as HTMLElement & { isActionTaken: boolean }).isActionTaken),
    ).toBe(false);
  });

  test("uses a custom close label", async ({ page, render }) => {
    await render(`<m3e-snackbar open duration="0" dismissible close-label="Dismiss">File deleted</m3e-snackbar>`);

    await expect(page.getByRole("button", { name: "Dismiss" })).toBeVisible();
  });

  test("dispatches toggle events when opened and closed", async ({ page, render }) => {
    await render(`<m3e-snackbar duration="0">File deleted</m3e-snackbar>`);
    await page.locator("m3e-snackbar").evaluate((el) => {
      const states: string[] = [];
      (window as unknown as { states: string[] }).states = states;
      el.addEventListener("toggle", (e) => states.push((e as ToggleEvent).newState));
      (el as HTMLElement & { open: boolean }).open = true;
    });
    await expect(page.locator("m3e-snackbar")).toBeVisible();

    await page.locator("m3e-snackbar").evaluate((el) => ((el as HTMLElement & { open: boolean }).open = false));
    await expect(page.locator("m3e-snackbar")).toBeHidden();

    expect(await page.evaluate(() => (window as unknown as { states: string[] }).states)).toEqual(["open", "closed"]);
  });

  test("closes the current snackbar when another opens", async ({ page, render }) => {
    await render(`
      <m3e-snackbar id="first" open duration="0">First</m3e-snackbar>
      <m3e-snackbar id="second" duration="0">Second</m3e-snackbar>
    `);
    await expect(page.locator("#first")).toBeVisible();

    await page.locator("#second").evaluate((el) => ((el as HTMLElement & { open: boolean }).open = true));

    await expect(page.locator("#second")).toBeVisible();
    await expect(page.locator("#first")).toBeHidden();
  });
});

test.describe("M3eSnackbar service", () => {
  test("is available on globalThis", async ({ page, render }) => {
    await render(`<div></div>`);

    expect(await service(page, (s) => typeof s.open)).toBe("function");
  });

  test("opens a snackbar with a message and removes it after it closes", async ({ page, render }) => {
    await render(`<div></div>`);

    await service(page, (s) => s.open("File deleted", { duration: 300 }));

    await expect(page.getByText("File deleted")).toBeVisible();
    await expect(page.locator("m3e-snackbar")).toHaveCount(0);
  });

  test("honors the duration option when passed directly after the message", async ({ page, render }) => {
    await render(`<div></div>`);

    await service(page, (s) => s.open("File deleted", { duration: 0 }));
    await expect(page.getByText("File deleted")).toBeVisible();
    await page.waitForTimeout(3500);

    await expect(page.getByText("File deleted")).toBeVisible();
  });

  test("opens with an action and invokes the callback when it is clicked", async ({ page, render }) => {
    await render(`<div></div>`);
    await page.evaluate(() => {
      (window as unknown as { undone: number }).undone = 0;
      (window as unknown as { M3eSnackbar: Service }).M3eSnackbar.open("File deleted", "Undo", {
        duration: 0,
        actionCallback: () => (window as unknown as { undone: number }).undone++,
      });
    });

    await page.getByRole("button", { name: "Undo" }).click();

    await expect(page.locator("m3e-snackbar")).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as { undone: number }).undone)).toBe(1);
  });

  test("does not invoke the action callback when dismissed", async ({ page, render }) => {
    await render(`<div></div>`);
    await page.evaluate(() => {
      (window as unknown as { undone: number }).undone = 0;
      (window as unknown as { M3eSnackbar: Service }).M3eSnackbar.open("File deleted", "Undo", true, {
        duration: 0,
        actionCallback: () => (window as unknown as { undone: number }).undone++,
      });
    });

    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.locator("m3e-snackbar")).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as { undone: number }).undone)).toBe(0);
  });

  test("opens a dismissible snackbar with a custom close label", async ({ page, render }) => {
    await render(`<div></div>`);

    await service(page, (s) => s.open("File deleted", true, { duration: 0, closeLabel: "Dismiss" }));

    await expect(page.getByRole("button", { name: "Dismiss" })).toBeVisible();
  });

  test("dismiss() closes the visible snackbar", async ({ page, render }) => {
    await render(`<div></div>`);
    await service(page, (s) => s.open("File deleted", { duration: 0 }));
    await expect(page.getByText("File deleted")).toBeVisible();

    await service(page, (s) => s.dismiss());

    await expect(page.locator("m3e-snackbar")).toHaveCount(0);
  });

  test("dismiss() does nothing when no snackbar is open", async ({ page, render }) => {
    await render(`<div></div>`);

    await service(page, (s) => s.dismiss());

    await expect(page.locator("m3e-snackbar")).toHaveCount(0);
  });
});
