import { expect, test } from "./fixtures";

type Option = HTMLElement & {
  value: string;
  label: string;
  isEmpty: boolean;
  selected: boolean;
  disabled: boolean;
  labelReady: Promise<void>;
  valueReady: Promise<void>;
};

test.describe("m3e-option", () => {
  test("has the option role", async ({ page, render }) => {
    await render(`<m3e-option>Apple</m3e-option>`);

    await expect(page.getByRole("option", { name: "Apple" })).toBeVisible();
  });

  test("value falls back to the label and an explicit value wins", async ({ page, render }) => {
    await render(`
      <m3e-option id="a">Apple</m3e-option>
      <m3e-option id="b" value="bn">Banana</m3e-option>
    `);

    const read = (id: string) =>
      page.locator(id).evaluate(async (el) => {
        const o = el as Option;
        await o.labelReady;
        await o.valueReady;
        return { value: o.value, label: o.label };
      });

    expect(await read("#a")).toEqual({ value: "Apple", label: "Apple" });
    expect(await read("#b")).toEqual({ value: "bn", label: "Banana" });
  });

  test("an option with an empty value is empty", async ({ page, render }) => {
    await render(`<m3e-option value="">None</m3e-option>`);
    const option = page.locator("m3e-option");

    await expect.poll(() => option.evaluate((el) => (el as Option).isEmpty)).toBe(true);
    await expect.poll(() => option.evaluate((el) => el.matches(":state(--empty)"))).toBe(true);
  });

  test("a non-empty option is not empty", async ({ page, render }) => {
    await render(`<m3e-option>Apple</m3e-option>`);
    const option = page.locator("m3e-option");

    await expect.poll(() => option.evaluate((el) => (el as Option).isEmpty)).toBe(false);
  });

  test("reflects the selected state", async ({ page, render }) => {
    await render(`<m3e-option selected>Apple</m3e-option>`);
    const option = page.locator("m3e-option");

    await expect(option).toHaveAttribute("aria-selected", "true");
    await option.evaluate((el) => ((el as Option).selected = false));
    await expect(option).toHaveAttribute("aria-selected", "false");
  });

  test("reflects the disabled state", async ({ page, render }) => {
    await render(`<m3e-option disabled>Apple</m3e-option>`);
    const option = page.locator("m3e-option");

    await expect(option).toHaveAttribute("aria-disabled", "true");
    await option.evaluate((el) => ((el as Option).disabled = false));
    await expect(option).not.toHaveAttribute("aria-disabled", "true");
  });

  test("dispatches a bubbling state-change event when selected or disabled changes", async ({ page, render }) => {
    await render(`<div id="host"><m3e-option>Apple</m3e-option></div>`);
    const option = page.locator("m3e-option");
    await page.evaluate(() => {
      (window as unknown as { count: number }).count = 0;
      document.getElementById("host")!.addEventListener("state-change", () => {
        (window as unknown as { count: number }).count++;
      });
    });

    await option.evaluate((el) => ((el as Option).selected = true));
    await expect.poll(() => page.evaluate(() => (window as unknown as { count: number }).count)).toBe(1);

    await option.evaluate((el) => ((el as Option).disabled = true));
    await expect.poll(() => page.evaluate(() => (window as unknown as { count: number }).count)).toBe(2);
  });

  test("selecting an option deselects the others in a single-select listbox", async ({ page, render }) => {
    await render(`
      <div role="listbox">
        <m3e-option id="a" selected>Apple</m3e-option>
        <m3e-option id="b">Banana</m3e-option>
      </div>
    `);

    await page.locator("#b").evaluate((el) => ((el as Option).selected = true));

    await expect(page.locator("#a")).toHaveAttribute("aria-selected", "false");
    await expect(page.locator("#b")).toHaveAttribute("aria-selected", "true");
  });

  test("selecting an option keeps the others in a multi-select listbox", async ({ page, render }) => {
    await render(`
      <div role="listbox" aria-multiselectable="true">
        <m3e-option id="a" selected>Apple</m3e-option>
        <m3e-option id="b">Banana</m3e-option>
      </div>
    `);

    await page.locator("#b").evaluate((el) => ((el as Option).selected = true));

    await expect(page.locator("#a")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#b")).toHaveAttribute("aria-selected", "true");
  });

  test("highlights the search term unless highlighting is disabled", async ({ page, render }) => {
    await render(`
      <m3e-option id="a" term="pp">Apple</m3e-option>
      <m3e-option id="b" term="pp" disable-highlight>Apple</m3e-option>
    `);
    const highlight = (id: string) =>
      page.locator(`${id} m3e-text-highlight`).evaluate((el) => el.hasAttribute("disabled"));

    await expect.poll(() => highlight("#a")).toBe(false);
    await expect.poll(() => highlight("#b")).toBe(true);
  });

  test("does not highlight when selected", async ({ page, render }) => {
    await render(`<m3e-option term="pp" selected>Apple</m3e-option>`);

    await expect
      .poll(() => page.locator("m3e-option m3e-text-highlight").evaluate((el) => el.hasAttribute("disabled")))
      .toBe(true);
  });

  test("a disabled option disables its state layer", async ({ page, render }) => {
    await render(`<m3e-option disabled>Apple</m3e-option>`);

    await expect
      .poll(() => page.locator("m3e-option m3e-state-layer").evaluate((el) => el.hasAttribute("disabled")))
      .toBe(true);
  });
});

test.describe("m3e-optgroup", () => {
  test("has the group role and is labelled by its label slot", async ({ page, render }) => {
    await render(`
      <m3e-optgroup>
        <span slot="label">Fruits</span>
        <m3e-option>Apple</m3e-option>
      </m3e-optgroup>
    `);

    await expect(page.getByRole("group", { name: "Fruits" })).toBeVisible();
  });

  test("keeps an existing label id", async ({ page, render }) => {
    await render(`
      <m3e-optgroup>
        <span slot="label" id="mine">Fruits</span>
        <m3e-option>Apple</m3e-option>
      </m3e-optgroup>
    `);

    await expect(page.locator("m3e-optgroup")).toHaveAttribute("aria-labelledby", "mine");
    await expect(page.locator("#mine")).toHaveCount(1);
  });

  test("removes the reference when the label is removed", async ({ page, render }) => {
    await render(`
      <m3e-optgroup>
        <span slot="label">Fruits</span>
        <m3e-option>Apple</m3e-option>
      </m3e-optgroup>
    `);
    const group = page.locator("m3e-optgroup");
    await expect(group).toHaveAttribute("aria-labelledby", /m3e-optgroup-label-/);

    await page.locator("[slot=label]").evaluate((el) => el.remove());

    await expect.poll(() => group.evaluate((el) => el.getAttribute("aria-labelledby") ?? "")).toBe("");
  });
});

test.describe("m3e-option-panel", () => {
  test("has the listbox role", async ({ page, render }) => {
    await render(`<m3e-option-panel><m3e-option>Apple</m3e-option></m3e-option-panel>`);

    await expect(page.locator("m3e-option-panel")).toHaveAttribute("role", "listbox");
  });

  test("marks the first and last visible options", async ({ page, render }) => {
    await render(`
      <m3e-option-panel>
        <m3e-option id="a">Apple</m3e-option>
        <m3e-option id="b">Banana</m3e-option>
        <m3e-option id="c">Cherry</m3e-option>
      </m3e-option-panel>
    `);
    const states = (id: string) =>
      page.locator(id).evaluate((el) => ({ first: el.matches(":state(--first)"), last: el.matches(":state(--last)") }));

    await expect.poll(() => states("#a")).toEqual({ first: true, last: false });
    expect(await states("#b")).toEqual({ first: false, last: false });
    expect(await states("#c")).toEqual({ first: false, last: true });
  });

  test("skips hidden options when marking first and last", async ({ page, render }) => {
    await render(`
      <m3e-option-panel>
        <m3e-option id="a" hidden>Apple</m3e-option>
        <m3e-option id="b">Banana</m3e-option>
        <m3e-option id="c" hidden>Cherry</m3e-option>
      </m3e-option-panel>
    `);
    const states = (id: string) =>
      page.locator(id).evaluate((el) => ({ first: el.matches(":state(--first)"), last: el.matches(":state(--last)") }));

    await expect.poll(() => states("#b")).toEqual({ first: true, last: true });
    expect(await states("#a")).toEqual({ first: false, last: false });
  });

  test("updates first and last when options change", async ({ page, render }) => {
    await render(`
      <m3e-option-panel>
        <m3e-option id="a">Apple</m3e-option>
      </m3e-option-panel>
    `);
    await page.locator("m3e-option-panel").evaluate((el) => {
      const o = document.createElement("m3e-option");
      o.id = "z";
      o.textContent = "Zucchini";
      el.appendChild(o);
    });
    const states = (id: string) =>
      page.locator(id).evaluate((el) => ({ first: el.matches(":state(--first)"), last: el.matches(":state(--last)") }));

    await expect.poll(() => states("#z")).toEqual({ first: false, last: true });
    expect(await states("#a")).toEqual({ first: true, last: false });
  });

  test("does not let option state-change events escape the panel", async ({ page, render }) => {
    await render(`
      <div id="host">
        <m3e-option-panel><m3e-option id="a">Apple</m3e-option></m3e-option-panel>
      </div>
    `);
    await page.evaluate(() => {
      (window as unknown as { count: number }).count = 0;
      document.getElementById("host")!.addEventListener("state-change", () => {
        (window as unknown as { count: number }).count++;
      });
    });

    await page.locator("#a").evaluate((el) => ((el as Option).selected = true));
    await expect(page.locator("#a")).toHaveAttribute("aria-selected", "true");

    expect(await page.evaluate(() => (window as unknown as { count: number }).count)).toBe(0);
  });
});
