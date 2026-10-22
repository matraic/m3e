import { expect, test } from "./fixtures";

const group = `
  <m3e-radio-group name="size" aria-label="Size">
    <m3e-radio value="s">Small</m3e-radio>
    <m3e-radio value="m">Medium</m3e-radio>
    <m3e-radio value="l">Large</m3e-radio>
  </m3e-radio-group>
`;

test.describe("m3e-radio-group", () => {
  test("exposes a radiogroup of radios", async ({ page, render }) => {
    await render(group);

    await expect(page.getByRole("radiogroup", { name: "Size" })).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(3);
    await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  });

  test("checks a radio when clicked and unchecks the previous one", async ({ page, render }) => {
    await render(group);

    await page.getByRole("radio", { name: "Small" }).click();
    await expect(page.getByRole("radio", { name: "Small" })).toBeChecked();

    await page.getByRole("radio", { name: "Large" }).click();
    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Small" })).not.toBeChecked();
  });

  test("reports the selected radio and value", async ({ page, render }) => {
    await render(group);
    const element = page.locator("m3e-radio-group");

    expect(await element.evaluate((el) => (el as HTMLElement & { value: string | null }).value)).toBeNull();

    await page.getByRole("radio", { name: "Medium" }).click();

    expect(await element.evaluate((el) => (el as HTMLElement & { value: string | null }).value)).toBe("m");
  });

  test("initializes from a checked radio", async ({ page, render }) => {
    await render(`
      <m3e-radio-group aria-label="Size">
        <m3e-radio value="s">Small</m3e-radio>
        <m3e-radio value="m" checked>Medium</m3e-radio>
      </m3e-radio-group>
    `);

    await expect(page.getByRole("radio", { name: "Medium" })).toBeChecked();
    expect(
      await page.locator("m3e-radio-group").evaluate((el) => (el as HTMLElement & { value: string | null }).value),
    ).toBe("m");
  });

  test("dispatches beforeinput, input and change when a radio is checked", async ({ page, render }) => {
    await render(group);
    await page.locator("m3e-radio-group").evaluate((el) => {
      const events: string[] = [];
      (window as unknown as { events: string[] }).events = events;
      for (const type of ["beforeinput", "input", "change"]) {
        el.addEventListener(type, () => events.push(type));
      }
    });

    await page.getByRole("radio", { name: "Small" }).click();

    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual([
      "beforeinput",
      "input",
      "change",
    ]);
  });

  test("does not check a radio when beforeinput is canceled", async ({ page, render }) => {
    await render(group);
    await page
      .locator("m3e-radio-group")
      .evaluate((el) => el.addEventListener("beforeinput", (e) => e.preventDefault()));

    await page.getByRole("radio", { name: "Small" }).click();

    await expect(page.getByRole("radio", { name: "Small" })).not.toBeChecked();
  });

  test("does not dispatch change when the checked radio is clicked again", async ({ page, render }) => {
    await render(group);
    await page.getByRole("radio", { name: "Small" }).click();
    await page.locator("m3e-radio-group").evaluate((el) => {
      (window as unknown as { changes: number }).changes = 0;
      el.addEventListener("change", () => (window as unknown as { changes: number }).changes++);
    });

    await page.getByRole("radio", { name: "Small" }).click();

    expect(await page.evaluate(() => (window as unknown as { changes: number }).changes)).toBe(0);
  });

  test("selects radios with the arrow keys and wraps around", async ({ page, render }) => {
    await render(group);

    await page.getByRole("radio", { name: "Small" }).click();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: "Medium" })).toBeChecked();

    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked();

    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: "Small" })).toBeChecked();

    await page.keyboard.press("ArrowUp");
    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked();
  });

  test("skips disabled radios with the arrow keys", async ({ page, render }) => {
    await render(`
      <m3e-radio-group aria-label="Size">
        <m3e-radio value="s">Small</m3e-radio>
        <m3e-radio value="m" disabled>Medium</m3e-radio>
        <m3e-radio value="l">Large</m3e-radio>
      </m3e-radio-group>
    `);

    await page.getByRole("radio", { name: "Small" }).click();
    await page.keyboard.press("ArrowDown");

    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Medium" })).not.toBeChecked();
  });

  test("does not check a disabled radio when clicked", async ({ page, render }) => {
    await render(`
      <m3e-radio-group aria-label="Size">
        <m3e-radio value="s" disabled>Small</m3e-radio>
        <m3e-radio value="m">Medium</m3e-radio>
      </m3e-radio-group>
    `);

    await page.getByRole("radio", { name: "Small" }).dispatchEvent("click");

    await expect(page.getByRole("radio", { name: "Small" })).not.toBeChecked();
  });

  test("disables every radio when the group is disabled", async ({ page, render }) => {
    await render(`
      <m3e-radio-group aria-label="Size" disabled>
        <m3e-radio value="s">Small</m3e-radio>
        <m3e-radio value="m">Medium</m3e-radio>
      </m3e-radio-group>
    `);

    await page.getByRole("radio", { name: "Small" }).dispatchEvent("click");
    await page.getByRole("radio", { name: "Medium" }).dispatchEvent("click");

    await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  });

  test("propagates the group name to its radios", async ({ page, render }) => {
    await render(group);

    const names = await page.locator("m3e-radio").evaluateAll((els) => els.map((x) => (x as HTMLInputElement).name));

    expect(names).toEqual(["size", "size", "size"]);
  });

  test("applies the group name to radios added later", async ({ page, render }) => {
    await render(group);

    await page.locator("m3e-radio-group").evaluate((el) => {
      const radio = document.createElement("m3e-radio");
      radio.setAttribute("value", "xl");
      radio.textContent = "Extra large";
      el.append(radio);
    });

    await expect(page.getByRole("radio")).toHaveCount(4);
    expect(
      await page
        .locator("m3e-radio")
        .last()
        .evaluate((el) => (el as HTMLInputElement).name),
    ).toBe("size");
  });

  test("submits the selected value with a form", async ({ page, render }) => {
    await render(`<form>${group}</form>`);

    await page.getByRole("radio", { name: "Medium" }).click();

    expect(await page.locator("form").evaluate((form) => new FormData(form as HTMLFormElement).get("size"))).toBe("m");
  });

  test("unchecks sibling radios of the same name outside a group", async ({ page, render }) => {
    await render(`
      <m3e-radio name="pet" value="cat">Cat</m3e-radio>
      <m3e-radio name="pet" value="dog">Dog</m3e-radio>
    `);

    await page.getByRole("radio", { name: "Cat" }).click();
    await page.getByRole("radio", { name: "Dog" }).click();

    await expect(page.getByRole("radio", { name: "Dog" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Cat" })).not.toBeChecked();
  });

  test("is invalid when required and nothing is selected", async ({ page, render }) => {
    await render(`
      <m3e-radio-group aria-label="Size" required>
        <m3e-radio value="s" required>Small</m3e-radio>
        <m3e-radio value="m" required>Medium</m3e-radio>
      </m3e-radio-group>
    `);
    const element = page.locator("m3e-radio-group");

    expect(await element.evaluate((el) => (el as HTMLInputElement).checkValidity())).toBe(false);

    await page.getByRole("radio", { name: "Small" }).click();

    expect(await element.evaluate((el) => (el as HTMLInputElement).checkValidity())).toBe(true);
  });
});
