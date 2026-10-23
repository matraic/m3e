import { expect, test } from "./fixtures";

const autocompleteMarkup = `
  <input id="fruit" />
  <m3e-autocomplete for="fruit">
    <m3e-option>Apples</m3e-option>
    <m3e-option>Oranges</m3e-option>
    <m3e-option>Bananas</m3e-option>
  </m3e-autocomplete>
`;

test.describe("m3e-autocomplete", () => {
  test("exposes the input as a combobox and opens suggestions on focus", async ({ page, render }) => {
    await render(autocompleteMarkup);
    const input = page.getByRole("combobox");

    await input.focus();

    await expect(input).toHaveAttribute("aria-autocomplete", "list");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("option", { name: "Apples" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Oranges" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Bananas" })).toBeVisible();
  });

  test("filters suggestions by a case-insensitive substring by default", async ({ page, render }) => {
    await render(autocompleteMarkup);
    const input = page.getByRole("combobox");
    await input.fill("BAN");

    await expect(page.getByRole("option", { name: "Bananas" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Apples" })).toBeHidden();
    await expect(page.getByRole("option", { name: "Oranges" })).toBeHidden();
  });

  test("selects the active suggestion with the keyboard", async ({ page, render }) => {
    await render(autocompleteMarkup);
    const input = page.getByRole("combobox");
    await input.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(input).toHaveValue("Apples");
    await expect(page.locator("m3e-autocomplete m3e-option").filter({ hasText: "Apples" })).toHaveAttribute(
      "selected",
      "",
    );
    expect(
      await page
        .locator("m3e-autocomplete")
        .evaluate((element) => (element as HTMLElement & { value: string | null }).value),
    ).toBe("Apples");
  });

  test("emits a query event with the input term", async ({ page, render }) => {
    await render(`
      <input id="search" />
      <m3e-autocomplete for="search"></m3e-autocomplete>
    `);
    const input = page.getByRole("combobox");
    await input.focus();
    const eventPromise = page.evaluate(
      () =>
        new Promise<string>((resolve) => {
          document
            .querySelector("m3e-autocomplete")!
            .addEventListener("query", (event) => resolve((event as CustomEvent<{ term: string }>).detail.term), {
              once: true,
            });
        }),
    );

    await input.fill("pear");

    await expect(eventPromise).resolves.toBe("pear");
  });
});

test.describe("m3e-autocomplete options", () => {
  test("shows the no-data label when nothing matches", async ({ page, render }) => {
    await render(autocompleteMarkup);
    await page.getByRole("combobox").fill("zzz");

    await expect(page.locator("m3e-autocomplete-menu, [id$=-menu]").getByText("No options")).toBeVisible();
  });

  test("uses a custom no-data label", async ({ page, render }) => {
    await render(autocompleteMarkup.replace("<m3e-autocomplete ", '<m3e-autocomplete no-data-label="Nothing here" '));
    await page.getByRole("combobox").fill("zzz");

    await expect(page.locator("[id$=-menu]").getByText("Nothing here")).toBeVisible();
  });

  test("hide-no-data suppresses the no-data message", async ({ page, render }) => {
    await render(autocompleteMarkup.replace("<m3e-autocomplete ", "<m3e-autocomplete hide-no-data "));
    await page.getByRole("combobox").fill("zzz");

    await expect(page.getByRole("option", { name: "Apples" })).toBeHidden();
    await expect(page.locator("m3e-autocomplete-menu, [id$=-menu]").getByText("No options")).toBeHidden();
  });

  test("shows the loading label while loading", async ({ page, render }) => {
    await render(autocompleteMarkup.replace("<m3e-autocomplete ", "<m3e-autocomplete loading "));
    await page.getByRole("combobox").focus();

    await expect(page.locator("[id$=-menu]").getByText("Loading...")).toBeVisible();
  });

  test("hide-loading suppresses the loading message", async ({ page, render }) => {
    await render(autocompleteMarkup.replace("<m3e-autocomplete ", "<m3e-autocomplete loading hide-loading "));
    await page.getByRole("combobox").focus();

    await expect(page.locator("[id$=-menu]").getByText("Loading...")).toBeHidden();
  });

  test("case-sensitive filtering requires matching case", async ({ page, render }) => {
    await render(autocompleteMarkup.replace("<m3e-autocomplete ", "<m3e-autocomplete case-sensitive "));
    const input = page.getByRole("combobox");

    await input.fill("ban");
    await expect(page.getByRole("option", { name: "Bananas" })).toBeHidden();

    await input.fill("Ban");
    await expect(page.getByRole("option", { name: "Bananas" })).toBeVisible();
  });

  test("applies panel-class to the suggestion panel", async ({ page, render }) => {
    await render(autocompleteMarkup.replace("<m3e-autocomplete ", '<m3e-autocomplete panel-class="fancy wide" '));
    await page.getByRole("combobox").focus();

    await expect(page.getByRole("option", { name: "Apples" })).toBeVisible();
    await expect(page.locator(".fancy.wide")).toHaveCount(1);
  });

  test("Escape closes the suggestions", async ({ page, render }) => {
    await render(autocompleteMarkup);
    const input = page.getByRole("combobox");
    await input.focus();
    await expect(input).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");

    await expect(input).toHaveAttribute("aria-expanded", "false");
  });
});
