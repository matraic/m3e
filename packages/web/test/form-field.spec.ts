import { expect, test } from "./fixtures";

async function isSubscriptContentVisible(
  page: import("@playwright/test").Page,
  fieldIndex: number,
  content: "hint" | "error",
): Promise<boolean> {
  return page
    .locator("m3e-form-field")
    .nth(fieldIndex)
    .evaluate((element, selector) => {
      const content = element.shadowRoot!.querySelector(`.${selector}`)!;
      return getComputedStyle(content).display !== "none";
    }, content);
}

async function getSubscriptStyle(
  page: import("@playwright/test").Page,
  fieldIndex: number,
): Promise<{ display: string; opacity: string }> {
  return page
    .locator("m3e-form-field")
    .nth(fieldIndex)
    .evaluate((element) => {
      const subscript = element.shadowRoot!.querySelector(".subscript")!;
      const style = getComputedStyle(subscript);
      return { display: style.display, opacity: style.opacity };
    });
}

test.describe("m3e-form-field", () => {
  test("associates its label with the slotted control and focuses it on container click", async ({ page, render }) => {
    await render(`
      <m3e-form-field>
        <label slot="label" for="email">Email address</label>
        <input id="email" type="email" />
      </m3e-form-field>
    `);
    const input = page.getByRole("textbox", { name: "Email address" });

    await expect(input).toBeVisible();
    await page.locator("m3e-form-field").click();
    await expect(input).toBeFocused();
  });

  test("supports outlined and filled variants", async ({ page, render }) => {
    await render(`
      <m3e-form-field variant="outlined"><input aria-label="Outlined field" /></m3e-form-field>
      <m3e-form-field variant="filled"><input aria-label="Filled field" /></m3e-form-field>
    `);
    const fields = page.locator("m3e-form-field");

    await expect(fields.nth(0)).toHaveAttribute("variant", "outlined");
    await expect(fields.nth(1)).toHaveAttribute("variant", "filled");
  });

  test("floats the label automatically while the control has focus or a value", async ({ page, render }) => {
    await render(`
      <m3e-form-field>
        <label slot="label" for="auto-label">Name</label>
        <input id="auto-label" />
      </m3e-form-field>
    `);
    const field = page.locator("m3e-form-field");
    const input = page.getByRole("textbox", { name: "Name" });
    const isLabelFloating = () => field.evaluate((element) => element.matches(":state(--float-label)"));

    await expect.poll(isLabelFloating).toBe(false);
    await input.focus();
    await expect.poll(isLabelFloating).toBe(true);
    await input.blur();
    await expect.poll(isLabelFloating).toBe(false);

    await input.fill("Ada");
    await expect.poll(isLabelFloating).toBe(true);
  });

  test("keeps the label floated when float-label is always", async ({ page, render }) => {
    await render(`
      <m3e-form-field float-label="always">
        <label slot="label" for="always-label">Name</label>
        <input id="always-label" />
      </m3e-form-field>
    `);
    const field = page.locator("m3e-form-field");
    const labelFontSize = () =>
      field.evaluate((element) => getComputedStyle(element.shadowRoot!.querySelector(".label")!).fontSize);

    const floatedFontSize = await labelFontSize();
    expect(Number.parseFloat(floatedFontSize)).toBeLessThan(
      await page.locator("body").evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    );
    await page.getByRole("textbox", { name: "Name" }).focus();
    await page.getByRole("textbox", { name: "Name" }).blur();
    await expect.poll(labelFontSize).toBe(floatedFontSize);
  });

  test("does not focus its disabled control when the field is clicked", async ({ page, render }) => {
    await render(`
      <m3e-form-field>
        <label slot="label" for="disabled-field">Disabled field</label>
        <input id="disabled-field" disabled />
      </m3e-form-field>
    `);
    const input = page.getByRole("textbox", { name: "Disabled field" });

    await expect(input).toBeDisabled();
    await page.locator("m3e-form-field").click();
    await expect(input).not.toBeFocused();
  });

  test("allows focus but prevents editing its readonly control", async ({ page, render }) => {
    await render(`
      <m3e-form-field>
        <label slot="label" for="readonly-field">Readonly field</label>
        <input id="readonly-field" value="Original" readonly />
      </m3e-form-field>
    `);
    const input = page.getByRole("textbox", { name: "Readonly field" });

    await expect(input).toBeEnabled();
    await expect(input).toHaveAttribute("readonly", "");
    await input.focus();
    await page.keyboard.type(" changed");

    await expect(input).toBeFocused();
    await expect(input).toHaveValue("Original");
  });

  test("shows the hint and associates it with the control", async ({ page, render }) => {
    await render(`
      <m3e-form-field hide-subscript="never">
        <label slot="label" for="username">Username</label>
        <input id="username" />
        <span slot="hint">Use at least 4 characters</span>
      </m3e-form-field>
    `);
    const input = page.getByRole("textbox", { name: "Username" });

    await expect.poll(() => isSubscriptContentVisible(page, 0, "hint")).toBe(true);
    await expect.poll(() => input.getAttribute("aria-describedby")).toMatch(/\S/);
  });

  test("hides the subscript completely when hide-subscript is always", async ({ page, render }) => {
    await render(`
      <m3e-form-field hide-subscript="always">
        <input aria-label="Hidden hint field" />
        <span slot="hint">Hint text</span>
      </m3e-form-field>
    `);

    await expect.poll(() => getSubscriptStyle(page, 0)).toEqual({ display: "none", opacity: "1" });
    await page.getByRole("textbox", { name: "Hidden hint field" }).focus();
    await expect.poll(() => getSubscriptStyle(page, 0)).toEqual({ display: "none", opacity: "1" });
  });

  test("shows the subscript on focus or while invalid when hide-subscript is auto", async ({ page, render }) => {
    await render(`
      <m3e-form-field hide-subscript="auto">
        <label slot="label" for="auto-subscript">Required field</label>
        <input id="auto-subscript" required />
        <span slot="hint">Helpful hint</span>
        <span slot="error">This field is required</span>
      </m3e-form-field>
    `);
    const input = page.getByRole("textbox", { name: "Required field" });

    await expect.poll(() => getSubscriptStyle(page, 0)).toMatchObject({ display: "flex", opacity: "0" });
    await input.focus();
    await expect.poll(() => getSubscriptStyle(page, 0)).toMatchObject({ opacity: "1" });
    await input.blur();

    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect.poll(() => getSubscriptStyle(page, 0)).toMatchObject({ opacity: "1" });
    await expect.poll(() => isSubscriptContentVisible(page, 0, "error")).toBe(true);
  });

  test("shows validation errors and marks the control invalid", async ({ page, render }) => {
    await render(`
      <m3e-form-field hide-subscript="never">
        <label slot="label" for="required">Required field</label>
        <input id="required" required />
        <span slot="hint">Helpful hint</span>
        <span slot="error">This field is required</span>
      </m3e-form-field>
    `);
    const input = page.getByRole("textbox", { name: "Required field" });

    await expect.poll(() => isSubscriptContentVisible(page, 0, "hint")).toBe(true);
    await input.focus();
    await input.blur();

    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect.poll(() => isSubscriptContentVisible(page, 0, "error")).toBe(true);
    await expect.poll(() => isSubscriptContentVisible(page, 0, "hint")).toBe(false);
  });

  test("supports a manually forced error state", async ({ page, render }) => {
    await render(`
      <m3e-form-field error hide-subscript="never">
        <label slot="label" for="manual-error">Reference</label>
        <input id="manual-error" />
        <span slot="error">Reference is invalid</span>
      </m3e-form-field>
    `);
    const input = page.getByRole("textbox", { name: "Reference" });

    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect.poll(() => isSubscriptContentVisible(page, 0, "error")).toBe(true);
    expect(await input.evaluate((element) => !(element as HTMLInputElement).checkValidity())).toBe(true);
  });

  const requiredField = (attrs = "") => `
    <m3e-form-field ${attrs}>
      <label slot="label">Name</label>
      <input required />
    </m3e-form-field>
  `;

  test("shows a required marker for a required control", async ({ page, render }) => {
    await render(requiredField());

    await expect
      .poll(() => page.locator("m3e-form-field").evaluate((el) => el.matches(":state(--required)")))
      .toBe(true);
    await expect(page.locator("m3e-form-field .required-marker")).toHaveCount(1);
  });

  test("hide-required-marker removes the marker", async ({ page, render }) => {
    await render(requiredField("hide-required-marker"));

    await expect
      .poll(() => page.locator("m3e-form-field").evaluate((el) => el.matches(":state(--required)")))
      .toBe(true);
    await expect(page.locator("m3e-form-field .required-marker")).toHaveCount(0);
  });

  test("an optional control has no required marker", async ({ page, render }) => {
    await render(`
      <m3e-form-field>
        <label slot="label">Name</label>
        <input />
      </m3e-form-field>
    `);

    await expect(page.locator("m3e-form-field .required-marker")).toHaveCount(0);
    expect(await page.locator("m3e-form-field").evaluate((el) => el.matches(":state(--required)"))).toBe(false);
  });
});
