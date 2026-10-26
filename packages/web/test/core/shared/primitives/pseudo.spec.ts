import { expect, test } from "../../../fixtures";

type Pseudo = HTMLElement & { checked: boolean; indeterminate: boolean; disabled: boolean };

const path = (page: import("@playwright/test").Page, tag: string) =>
  page.locator(`${tag} svg path`).evaluateAll((els) => els.map((x) => x.getAttribute("d")));

test.describe("m3e-pseudo-checkbox", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(`<m3e-pseudo-checkbox></m3e-pseudo-checkbox>`);

    await expect(page.locator("m3e-pseudo-checkbox")).toHaveAttribute("aria-hidden", "true");
  });

  test("renders no icon when unchecked", async ({ page, render }) => {
    await render(`<m3e-pseudo-checkbox></m3e-pseudo-checkbox>`);

    await expect(page.locator("m3e-pseudo-checkbox svg")).toHaveCount(0);
  });

  test("renders a check mark when checked", async ({ page, render }) => {
    await render(`<m3e-pseudo-checkbox checked></m3e-pseudo-checkbox>`);

    expect(await path(page, "m3e-pseudo-checkbox")).toEqual(["M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"]);
  });

  test("renders a dash when indeterminate, even if checked", async ({ page, render }) => {
    await render(`<m3e-pseudo-checkbox checked indeterminate></m3e-pseudo-checkbox>`);

    expect(await path(page, "m3e-pseudo-checkbox")).toEqual(["M240-440v-80h480v80H240Z"]);
  });

  test("updates when state changes", async ({ page, render }) => {
    await render(`<m3e-pseudo-checkbox></m3e-pseudo-checkbox>`);
    const el = page.locator("m3e-pseudo-checkbox");

    await el.evaluate((x) => ((x as Pseudo).checked = true));
    await expect(page.locator("m3e-pseudo-checkbox svg")).toHaveCount(1);

    await el.evaluate((x) => ((x as Pseudo).checked = false));
    await expect(page.locator("m3e-pseudo-checkbox svg")).toHaveCount(0);
  });

  test("reflects checked, indeterminate and disabled", async ({ page, render }) => {
    await render(`<m3e-pseudo-checkbox checked indeterminate disabled></m3e-pseudo-checkbox>`);
    const el = page.locator("m3e-pseudo-checkbox");

    for (const attr of ["checked", "indeterminate", "disabled"]) {
      await expect(el).toHaveAttribute(attr, "");
    }
  });

  test("is not exposed as a control", async ({ page, render }) => {
    await render(`<m3e-pseudo-checkbox checked></m3e-pseudo-checkbox>`);

    await expect(page.getByRole("checkbox")).toHaveCount(0);
  });
});

test.describe("m3e-pseudo-radio", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(`<m3e-pseudo-radio></m3e-pseudo-radio>`);

    await expect(page.locator("m3e-pseudo-radio")).toHaveAttribute("aria-hidden", "true");
  });

  test("shows the inner dot only when checked", async ({ page, render }) => {
    await render(`<m3e-pseudo-radio></m3e-pseudo-radio>`);
    const el = page.locator("m3e-pseudo-radio");
    const opacity = () => el.locator(".inner").evaluate((x) => getComputedStyle(x).opacity);

    expect(await opacity()).toBe("0");

    await el.evaluate((x) => ((x as Pseudo).checked = true));
    await expect.poll(opacity).toBe("1");
  });

  test("reflects checked and disabled", async ({ page, render }) => {
    await render(`<m3e-pseudo-radio checked disabled></m3e-pseudo-radio>`);
    const el = page.locator("m3e-pseudo-radio");

    await expect(el).toHaveAttribute("checked", "");
    await expect(el).toHaveAttribute("disabled", "");
  });

  test("is not exposed as a control", async ({ page, render }) => {
    await render(`<m3e-pseudo-radio checked></m3e-pseudo-radio>`);

    await expect(page.getByRole("radio")).toHaveCount(0);
  });
});
