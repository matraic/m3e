import { expect, test } from "./fixtures";

const single = `
  <m3e-segmented-button name="size" aria-label="Size">
    <m3e-button-segment value="s">Small</m3e-button-segment>
    <m3e-button-segment value="m">Medium</m3e-button-segment>
    <m3e-button-segment value="l">Large</m3e-button-segment>
  </m3e-segmented-button>
`;

const multi = `
  <m3e-segmented-button multi name="filter" aria-label="Filter">
    <m3e-button-segment value="a">Alpha</m3e-button-segment>
    <m3e-button-segment value="b">Beta</m3e-button-segment>
    <m3e-button-segment value="c">Gamma</m3e-button-segment>
  </m3e-segmented-button>
`;

type Value = { value: string | readonly string[] | null };

test.describe("m3e-segmented-button (single select)", () => {
  test("exposes a radiogroup of radios", async ({ page, render }) => {
    await render(single);

    await expect(page.getByRole("radiogroup", { name: "Size" })).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(3);
    await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  });

  test("checks a segment when clicked and unchecks the previous one", async ({ page, render }) => {
    await render(single);

    await page.getByRole("radio", { name: "Small" }).click();
    await expect(page.getByRole("radio", { name: "Small" })).toBeChecked();

    await page.getByRole("radio", { name: "Large" }).click();
    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Small" })).not.toBeChecked();
  });

  test("keeps a checked segment checked when clicked again", async ({ page, render }) => {
    await render(single);

    await page.getByRole("radio", { name: "Small" }).click();
    await page.getByRole("radio", { name: "Small" }).click();

    await expect(page.getByRole("radio", { name: "Small" })).toBeChecked();
  });

  test("initializes from a checked segment and reports its value", async ({ page, render }) => {
    await render(`
      <m3e-segmented-button aria-label="Size">
        <m3e-button-segment value="s">Small</m3e-button-segment>
        <m3e-button-segment value="m" checked>Medium</m3e-button-segment>
      </m3e-segmented-button>
    `);

    await expect(page.getByRole("radio", { name: "Medium" })).toBeChecked();
    expect(await page.locator("m3e-segmented-button").evaluate((el) => (el as unknown as Value).value)).toBe("m");
  });

  test("has a null value when nothing is selected", async ({ page, render }) => {
    await render(single);

    expect(await page.locator("m3e-segmented-button").evaluate((el) => (el as unknown as Value).value)).toBeNull();
  });

  test("dispatches beforeinput, input and change when a segment is checked", async ({ page, render }) => {
    await render(single);
    await page.locator("m3e-segmented-button").evaluate((el) => {
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

  test("does not check a segment when beforeinput is canceled", async ({ page, render }) => {
    await render(single);
    await page
      .locator("m3e-segmented-button")
      .evaluate((el) => el.addEventListener("beforeinput", (e) => e.preventDefault()));

    await page.getByRole("radio", { name: "Small" }).click();

    await expect(page.getByRole("radio", { name: "Small" })).not.toBeChecked();
  });

  test("selects segments with the arrow keys and wraps around", async ({ page, render }) => {
    await render(single);

    await page.getByRole("radio", { name: "Small" }).click();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Medium" })).toBeChecked();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Small" })).toBeChecked();

    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked();
  });

  test("skips disabled segments with the arrow keys", async ({ page, render }) => {
    await render(`
      <m3e-segmented-button aria-label="Size">
        <m3e-button-segment value="s">Small</m3e-button-segment>
        <m3e-button-segment value="m" disabled>Medium</m3e-button-segment>
        <m3e-button-segment value="l">Large</m3e-button-segment>
      </m3e-segmented-button>
    `);

    await page.getByRole("radio", { name: "Small" }).click();
    await page.keyboard.press("ArrowRight");

    await expect(page.getByRole("radio", { name: "Large" })).toBeChecked();
  });

  test("does not check a disabled segment when clicked", async ({ page, render }) => {
    await render(`
      <m3e-segmented-button aria-label="Size">
        <m3e-button-segment value="s" disabled>Small</m3e-button-segment>
        <m3e-button-segment value="m">Medium</m3e-button-segment>
      </m3e-segmented-button>
    `);

    await page.getByRole("radio", { name: "Small" }).dispatchEvent("click");

    await expect(page.getByRole("radio", { name: "Small" })).not.toBeChecked();
  });

  test("ignores clicks when the group is disabled", async ({ page, render }) => {
    await render(`
      <m3e-segmented-button aria-label="Size" disabled>
        <m3e-button-segment value="s">Small</m3e-button-segment>
        <m3e-button-segment value="m">Medium</m3e-button-segment>
      </m3e-segmented-button>
    `);

    await page.getByRole("radio", { name: "Small" }).dispatchEvent("click");

    await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  });

  test("submits the selected value with a form", async ({ page, render }) => {
    await render(`<form>${single}</form>`);

    await page.getByRole("radio", { name: "Medium" }).click();

    expect(await page.locator("form").evaluate((form) => new FormData(form as HTMLFormElement).get("size"))).toBe("m");
  });
});

test.describe("m3e-segmented-button (multi select)", () => {
  test("exposes a group of toggle buttons", async ({ page, render }) => {
    await render(multi);

    await expect(page.getByRole("group", { name: "Filter" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Alpha" })).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("radio")).toHaveCount(0);
  });

  test("toggles segments independently", async ({ page, render }) => {
    await render(multi);
    const alpha = page.getByRole("button", { name: "Alpha" });
    const beta = page.getByRole("button", { name: "Beta" });

    await alpha.click();
    await beta.click();
    await expect(alpha).toHaveAttribute("aria-pressed", "true");
    await expect(beta).toHaveAttribute("aria-pressed", "true");

    await alpha.click();
    await expect(alpha).toHaveAttribute("aria-pressed", "false");
    await expect(beta).toHaveAttribute("aria-pressed", "true");
  });

  test("reports an array of values when several are selected", async ({ page, render }) => {
    await render(multi);

    await page.getByRole("button", { name: "Alpha" }).click();
    await page.getByRole("button", { name: "Gamma" }).click();

    expect(await page.locator("m3e-segmented-button").evaluate((el) => (el as unknown as Value).value)).toEqual([
      "a",
      "c",
    ]);
  });

  test("does not change selection with the arrow keys", async ({ page, render }) => {
    await render(multi);

    await page.getByRole("button", { name: "Alpha" }).click();
    await page.keyboard.press("ArrowRight");

    await expect(page.getByRole("button", { name: "Alpha" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Beta" })).toHaveAttribute("aria-pressed", "false");
  });

  test("submits every selected value with a form", async ({ page, render }) => {
    await render(`<form>${multi}</form>`);

    await page.getByRole("button", { name: "Alpha" }).click();
    await page.getByRole("button", { name: "Beta" }).click();

    expect(
      await page.locator("form").evaluate((form) => new FormData(form as HTMLFormElement).getAll("filter")),
    ).toEqual(["a", "b"]);
  });

  test("marks the group aria-disabled when disabled", async ({ page, render }) => {
    await render(multi.replace("multi", "multi disabled"));

    await expect(page.getByRole("group", { name: "Filter" })).toHaveAttribute("aria-disabled", "true");
  });

  test("switches semantics when multi is toggled", async ({ page, render }) => {
    await render(single);

    await page.locator("m3e-segmented-button").evaluate((el) => el.setAttribute("multi", ""));

    await expect(page.getByRole("group", { name: "Size" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Small" })).toHaveCount(1);
  });
});
