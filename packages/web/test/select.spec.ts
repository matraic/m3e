import { expect, test } from "./fixtures";

type SelectLike = HTMLElement & { value: string | readonly string[] | null; clear(): void };

const single = (attrs = "") => `
  <m3e-form-field>
    <label slot="label" for="fruit">Fruit</label>
    <m3e-select id="fruit" name="fruit" aria-label="Fruit" ${attrs}>
      <m3e-option value="apple">Apples</m3e-option>
      <m3e-option value="orange" disabled>Oranges</m3e-option>
      <m3e-option value="banana">Bananas</m3e-option>
    </m3e-select>
  </m3e-form-field>
`;

const multi = (attrs = "") => `
  <m3e-form-field>
    <label slot="label" for="lang">Language</label>
    <m3e-select id="lang" name="lang" aria-label="Language" multi ${attrs}>
      <m3e-option value="js">JavaScript</m3e-option>
      <m3e-option value="ts">TypeScript</m3e-option>
      <m3e-option value="py">Python</m3e-option>
    </m3e-select>
  </m3e-form-field>
`;

async function openSelect(page: import("@playwright/test").Page, name: string): Promise<void> {
  await page.getByRole("combobox", { name }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(page.getByRole("listbox")).toBeInViewport();
}

const valueOf = (page: import("@playwright/test").Page) =>
  page.locator("m3e-select").evaluate((el) => (el as SelectLike).value);

test.describe("m3e-select", () => {
  test("exposes a collapsed combobox with popup semantics", async ({ page, render }) => {
    await render(single());
    const select = page.getByRole("combobox", { name: "Fruit" });

    await expect(select).toHaveAttribute("aria-haspopup", "listbox");
    await expect(select).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("listbox")).toBeHidden();
  });

  test("opens a listbox of options when clicked", async ({ page, render }) => {
    await render(single());

    await openSelect(page, "Fruit");

    await expect(page.getByRole("combobox", { name: "Fruit" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("option")).toHaveCount(3);
  });

  test("selects an option, closes, and dispatches beforeinput, input and change", async ({ page, render }) => {
    await render(single());
    await page.locator("m3e-select").evaluate((el) => {
      const events: string[] = [];
      (window as unknown as { events: string[] }).events = events;
      for (const type of ["beforeinput", "input", "change"]) {
        el.addEventListener(type, () => events.push(type));
      }
    });

    await openSelect(page, "Fruit");
    await page.getByRole("option", { name: "Bananas" }).click();

    await expect(page.getByRole("listbox")).toBeHidden();
    expect(await valueOf(page)).toBe("banana");
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual([
      "beforeinput",
      "input",
      "change",
    ]);
  });

  test("does not select when beforeinput is canceled", async ({ page, render }) => {
    await render(single());
    await page.locator("m3e-select").evaluate((el) => el.addEventListener("beforeinput", (e) => e.preventDefault()));

    await openSelect(page, "Fruit");
    await page.getByRole("option", { name: "Apples" }).click();

    expect(await valueOf(page)).toBeNull();
  });

  test("does not select a disabled option", async ({ page, render }) => {
    await render(single());

    await openSelect(page, "Fruit");
    await page.getByRole("option", { name: "Oranges" }).dispatchEvent("pointerdown");
    await page.getByRole("option", { name: "Oranges" }).dispatchEvent("pointerup");

    await expect(page.getByRole("combobox", { name: "Fruit" })).toHaveAttribute("aria-expanded", "true");
    expect(await valueOf(page)).toBeNull();
  });

  test("initializes from the value attribute and a selected option", async ({ page, render }) => {
    await render(single('value="banana"'));

    await expect.poll(() => valueOf(page)).toBe("banana");
  });

  test("applies a value set from script", async ({ page, render }) => {
    await render(single());

    await page.locator("m3e-select").evaluate((el) => ((el as SelectLike).value = "apple"));

    await expect.poll(() => valueOf(page)).toBe("apple");
  });

  test("clear() deselects and dispatches change once", async ({ page, render }) => {
    await render(single('value="apple"'));
    await expect.poll(() => valueOf(page)).toBe("apple");
    await page.locator("m3e-select").evaluate((el) => {
      (window as unknown as { changes: number }).changes = 0;
      el.addEventListener("change", () => (window as unknown as { changes: number }).changes++);
      (el as SelectLike).clear();
      (el as SelectLike).clear();
    });

    expect(await valueOf(page)).toBeNull();
    expect(await page.evaluate(() => (window as unknown as { changes: number }).changes)).toBe(1);
  });

  test("closes with Escape", async ({ page, render }) => {
    await render(single());

    await openSelect(page, "Fruit");
    await page.keyboard.press("Escape");

    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(page.getByRole("combobox", { name: "Fruit" })).toHaveAttribute("aria-expanded", "false");
  });

  test("selects the next enabled option with ArrowDown while closed", async ({ page, render }) => {
    await render(single());

    await page.getByRole("combobox", { name: "Fruit" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect.poll(() => valueOf(page)).toBe("apple");

    await page.keyboard.press("ArrowDown");
    await expect.poll(() => valueOf(page)).toBe("banana");
  });

  test("selects the active option with Enter when open", async ({ page, render }) => {
    await render(single());

    await openSelect(page, "Fruit");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(page.getByRole("listbox")).toBeHidden();
    expect(await valueOf(page)).toBe("banana");
  });

  test("does not open when disabled", async ({ page, render }) => {
    await render(single("disabled"));

    await page.getByRole("combobox", { name: "Fruit" }).dispatchEvent("click");

    await expect(page.getByRole("listbox")).toBeHidden();
  });

  test("submits the selected value with a form", async ({ page, render }) => {
    await render(`<form>${single('value="apple"')}</form>`);
    await expect.poll(() => valueOf(page)).toBe("apple");

    expect(await page.locator("form").evaluate((f) => new FormData(f as HTMLFormElement).get("fruit"))).toBe("apple");
  });

  test("is invalid when required and nothing is selected", async ({ page, render }) => {
    await render(single("required"));
    const select = page.locator("m3e-select");

    expect(await select.evaluate((el) => (el as unknown as HTMLInputElement).checkValidity())).toBe(false);

    await openSelect(page, "Fruit");
    await page.getByRole("option", { name: "Apples" }).click();

    expect(await select.evaluate((el) => (el as unknown as HTMLInputElement).checkValidity())).toBe(true);
  });
});

test.describe("m3e-select (multi)", () => {
  test("keeps the listbox open and selects several options", async ({ page, render }) => {
    await render(multi());

    await openSelect(page, "Language");
    await page.getByRole("option", { name: "JavaScript" }).click();
    await page.getByRole("option", { name: "Python" }).click();

    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    expect(await valueOf(page)).toEqual(["js", "py"]);
  });

  test("toggles an option off when clicked again", async ({ page, render }) => {
    await render(multi());

    await openSelect(page, "Language");
    await page.getByRole("option", { name: "JavaScript" }).click();
    await page.getByRole("option", { name: "JavaScript" }).click();

    expect(await valueOf(page)).toBeNull();
  });

  test("initializes from a comma-separated value", async ({ page, render }) => {
    await render(multi('value="js,ts"'));

    await expect.poll(() => valueOf(page)).toEqual(["js", "ts"]);
  });

  test("submits every selected value with a form", async ({ page, render }) => {
    await render(`<form>${multi('value="js,py"')}</form>`);
    await expect.poll(() => valueOf(page)).toEqual(["js", "py"]);

    expect(await page.locator("form").evaluate((f) => new FormData(f as HTMLFormElement).getAll("lang"))).toEqual([
      "js",
      "py",
    ]);
  });
});
