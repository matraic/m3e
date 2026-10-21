import { expect, test } from "./fixtures";

test.describe("m3e-chip", () => {
  test("renders its label and uses it as the default value", async ({ page, render }) => {
    await render(
      '<m3e-chip><span slot="icon" aria-hidden="true">★</span>Design<span slot="trailing-icon" aria-hidden="true">→</span></m3e-chip>',
    );

    await expect(page.locator("m3e-chip")).toBeVisible();
    await expect(page.locator("m3e-chip")).toContainText("Design");
    await expect(page.locator('m3e-chip > [slot="icon"]')).toBeVisible();
    await expect(page.locator('m3e-chip > [slot="trailing-icon"]')).toBeVisible();
    await expect
      .poll(() => page.locator("m3e-chip").evaluate((element) => (element as HTMLElement & { value: string }).value))
      .toBe("Design");
  });

  test("supports its appearance variants and falls back for an unknown variant", async ({ page, render }) => {
    await render(`
      <m3e-chip variant="elevated">Elevated</m3e-chip>
      <m3e-chip variant="outlined">Outlined</m3e-chip>
      <m3e-chip variant="unknown">Fallback</m3e-chip>
    `);

    const chips = page.locator("m3e-chip");
    await expect(chips.nth(0)).toHaveAttribute("variant", "elevated");
    await expect(chips.nth(1)).toHaveAttribute("variant", "outlined");
    await expect
      .poll(() =>
        chips.nth(2).evaluate((element) => (element as HTMLElement & { variant: string }).variant),
      )
      .toBe("outlined");
  });
});

test.describe("m3e-chip-set", () => {
  test("renders its chips and supports vertical orientation", async ({ page, render }) => {
    await render(`
      <m3e-chip-set vertical>
        <m3e-chip>Design</m3e-chip>
        <m3e-chip>Accessibility</m3e-chip>
      </m3e-chip-set>
    `);

    await expect(page.locator("m3e-chip-set")).toHaveAttribute("vertical", "");
    await expect(page.locator("m3e-chip-set m3e-chip")).toHaveCount(2);
  });
});

test.describe("action chips", () => {
  for (const tag of ["m3e-assist-chip", "m3e-suggestion-chip"]) {
    test(`${tag} supports button activation and disabled state`, async ({ page, render }) => {
      await render(`<${tag}>Open suggestions</${tag}>`);
      const chip = page.getByRole("button", { name: "Open suggestions" });
      await expect(chip).toBeVisible();
      await page.evaluate(() => {
        const clicks: string[] = [];
        document.querySelector("m3e-assist-chip, m3e-suggestion-chip")?.addEventListener("click", () => {
          clicks.push("click");
        });
        (window as unknown as { chipClicks: string[] }).chipClicks = clicks;
      });

      await chip.focus();
      await page.keyboard.press("Enter");
      await expect
        .poll(() => page.evaluate(() => (window as unknown as { chipClicks: string[] }).chipClicks))
        .toEqual(["click"]);

      await chip.evaluate((element) => element.setAttribute("disabled", ""));
      await expect(chip).toHaveAttribute("aria-disabled", "true");
      await expect(chip).not.toHaveAttribute("tabindex");
    });
  }
});

test.describe("m3e-filter-chip", () => {
  test("toggles selection and exposes radio state", async ({ page, render }) => {
    await render(`
      <m3e-filter-chip-set aria-label="Filter by topic">
        <m3e-filter-chip value="design">Design</m3e-filter-chip>
      </m3e-filter-chip-set>
    `);
    const chip = page.getByRole("radio", { name: "Design" });

    await expect(chip).toHaveAttribute("aria-checked", "false");
    await chip.click();
    await expect(chip).toHaveAttribute("selected", "");
    await expect(chip).toHaveAttribute("aria-checked", "true");

    await chip.click();
    await expect(chip).not.toHaveAttribute("selected");
    await expect(chip).toHaveAttribute("aria-checked", "false");
  });

  test("allows only one selected chip unless the set is multi-select", async ({ page, render }) => {
    await render(`
      <m3e-filter-chip-set aria-label="Topics">
        <m3e-filter-chip value="design" selected>Design</m3e-filter-chip>
        <m3e-filter-chip value="accessibility">Accessibility</m3e-filter-chip>
      </m3e-filter-chip-set>
    `);
    const chips = page.locator("m3e-filter-chip");

    await page.getByRole("radio", { name: "Accessibility" }).click();
    await expect(chips.nth(0)).not.toHaveAttribute("selected");
    await expect(chips.nth(1)).toHaveAttribute("selected", "");

    await page.locator("m3e-filter-chip-set").evaluate((element) => element.setAttribute("multi", ""));
    await expect(page.getByRole("group", { name: "Topics" })).toBeVisible();
    await page.getByRole("button", { name: "Design" }).click();
    await expect(chips.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(chips.nth(1)).toHaveAttribute("aria-pressed", "true");
  });

  test("supports canceling a selection change", async ({ page, render }) => {
    await render(`
      <m3e-filter-chip-set aria-label="Topics">
        <m3e-filter-chip>Design</m3e-filter-chip>
      </m3e-filter-chip-set>
    `);
    const chip = page.getByRole("radio", { name: "Design" });
    await chip.evaluate((element) => element.addEventListener("beforeinput", (event) => event.preventDefault()));

    await chip.click();

    await expect(chip).not.toHaveAttribute("selected");
    await expect(chip).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("m3e-input-chip", () => {
  test("shows a labeled remove button and emits remove when activated", async ({ page, render }) => {
    await render(`
      <m3e-input-chip-set aria-label="Keywords">
        <m3e-input-chip removable remove-label="Remove keyword">TypeScript</m3e-input-chip>
      </m3e-input-chip-set>
    `);
    await page.evaluate(() => {
      const chip = document.querySelector("m3e-input-chip")!;
      chip.addEventListener("remove", () => {
        (window as unknown as { removed: boolean }).removed = true;
      });
    });

    await page.getByRole("button", { name: "Remove keyword" }).click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { removed: boolean }).removed)).toBe(true);
    await expect(page.locator("m3e-input-chip")).toHaveCount(0);
  });
});

test.describe("m3e-input-chip-set", () => {
  test("adds a chip from input and reports the change", async ({ page, render }) => {
    await render(`
      <m3e-input-chip-set aria-label="Keywords">
        <input slot="input" aria-label="New keyword" />
      </m3e-input-chip-set>
    `);
    const set = page.locator("m3e-input-chip-set");
    await page.evaluate(() => {
      const changes: unknown[] = [];
      document.querySelector("m3e-input-chip-set")?.addEventListener("change", (event) => {
        changes.push((event as CustomEvent).detail);
      });
      (window as unknown as { chipChanges: unknown[] }).chipChanges = changes;
    });

    const input = page.getByRole("textbox", { name: "New keyword" });
    await input.fill("TypeScript");
    await input.press("Enter");

    await expect(page.getByText("TypeScript", { exact: true })).toBeVisible();
    await expect(input).toHaveValue("");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { chipChanges: { type: string; value: string }[] }).chipChanges))
      .toMatchObject([{ type: "add", value: "TypeScript" }]);

    await set.getByRole("button", { name: "Remove" }).click();
    await expect(page.locator("m3e-input-chip")).toHaveCount(0);
  });

  test("does not add duplicate chip values", async ({ page, render }) => {
    await render(`
      <m3e-input-chip-set aria-label="Keywords">
        <m3e-input-chip removable>TypeScript</m3e-input-chip>
        <input slot="input" aria-label="New keyword" />
      </m3e-input-chip-set>
    `);
    const input = page.getByRole("textbox", { name: "New keyword" });

    await input.fill("TypeScript");
    await input.press("Enter");

    await expect(page.locator("m3e-input-chip")).toHaveCount(1);
    await expect(input).toHaveValue("");
  });

  test("shows the configured maximum number of chips until focused", async ({ page, render }) => {
    await render(`
      <m3e-input-chip-set aria-label="Keywords" max-chips="1">
        <m3e-input-chip>One</m3e-input-chip>
        <m3e-input-chip>Two</m3e-input-chip>
        <input slot="input" aria-label="New keyword" />
      </m3e-input-chip-set>
    `);

    await expect(page.locator("m3e-input-chip").nth(0)).toBeVisible();
    await expect(page.locator("m3e-input-chip").nth(1)).toBeHidden();
    await expect(page.getByText("+1", { exact: true })).toBeVisible();

    await page.getByRole("textbox", { name: "New keyword" }).focus();
    await expect(page.locator("m3e-input-chip").nth(1)).toBeVisible();
  });
});
