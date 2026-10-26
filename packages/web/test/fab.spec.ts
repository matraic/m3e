import { expect, test } from "./fixtures";

test.describe("m3e-fab", () => {
  test("exposes a focusable button named by its label", async ({ page, render }) => {
    await render(`
      <m3e-fab extended aria-label="Create">
        <span slot="label">Create</span>
      </m3e-fab>
    `);
    const fab = page.getByRole("button", { name: "Create" });

    await expect(fab).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(fab).toBeFocused();
  });

  test("renders its extended label only when extended is enabled", async ({ page, render }) => {
    await render(`
      <m3e-fab extended>
        <span slot="label">Compose</span>
      </m3e-fab>
      <m3e-fab>
        <span slot="label">Hidden label</span>
      </m3e-fab>
    `);
    const fabs = page.locator("m3e-fab");

    await expect(fabs.nth(0).getByText("Compose")).toBeVisible();
    await expect(fabs.nth(1).getByText("Hidden label")).toBeHidden();
  });

  test("normalizes unsupported variant and size values", async ({ page, render }) => {
    await render('<m3e-fab variant="unsupported" size="unsupported"></m3e-fab>');
    const fab = page.locator("m3e-fab");

    await expect.poll(() => fab.getAttribute("variant")).toBe("primary-container");
    await expect.poll(() => fab.getAttribute("size")).toBe("medium");
  });

  test("accepts each supported variant", async ({ page, render }) => {
    const variants = [
      "primary",
      "primary-container",
      "secondary",
      "secondary-container",
      "tertiary",
      "tertiary-container",
      "surface",
    ];
    await render(variants.map((variant) => `<m3e-fab variant="${variant}"></m3e-fab>`).join(""));
    const fabs = page.locator("m3e-fab");

    for (const [index, variant] of variants.entries()) {
      await expect(fabs.nth(index)).toHaveAttribute("variant", variant);
    }
  });

  test("accepts each supported size", async ({ page, render }) => {
    const sizes = ["small", "medium", "large"];
    await render(sizes.map((size) => `<m3e-fab size="${size}"></m3e-fab>`).join(""));
    const fabs = page.locator("m3e-fab");

    for (const [index, size] of sizes.entries()) {
      await expect(fabs.nth(index)).toHaveAttribute("size", size);
    }
  });

  test("does not activate when disabled", async ({ page, render }) => {
    await render('<m3e-fab disabled aria-label="Create"></m3e-fab>');
    const fab = page.getByRole("button", { name: "Create" });

    await expect(fab).toHaveAttribute("aria-disabled", "true");
    await expect(fab).not.toHaveAttribute("tabindex");
    await fab.evaluate((element) => (element as HTMLElement).click());
    await expect(fab).toHaveAttribute("aria-disabled", "true");
  });

  test("submits its name and value with its form", async ({ page, render }) => {
    await render(`
      <form id="create-form">
        <m3e-fab type="submit" name="action" value="create" aria-label="Create"></m3e-fab>
      </form>
    `);
    await page.evaluate(() => {
      const form = document.querySelector("form")!;
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        (window as unknown as { submittedValues: [string, FormDataEntryValue][] }).submittedValues = Array.from(
          new FormData(form).entries(),
        );
      });
    });

    await page.getByRole("button", { name: "Create" }).click();

    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { submittedValues: [string, FormDataEntryValue][] }).submittedValues),
      )
      .toEqual([["action", "create"]]);
  });
});

test.describe("m3e-fab lowered", () => {
  test("reflects the lowered attribute", async ({ page, render }) => {
    await render('<m3e-fab lowered aria-label="Add"><span slot="label">Add</span></m3e-fab>');

    await expect(page.locator("m3e-fab")).toHaveAttribute("lowered", "");
  });

  test("is not lowered by default", async ({ page, render }) => {
    await render('<m3e-fab aria-label="Add"><span slot="label">Add</span></m3e-fab>');

    await expect(page.locator("m3e-fab")).not.toHaveAttribute("lowered");
  });

  test("a lowered fab casts a different shadow than a raised one", async ({ page, render }) => {
    await render(`
      <m3e-fab id="raised" aria-label="Add"><span slot="label">Add</span></m3e-fab>
      <m3e-fab id="low" lowered aria-label="Add"><span slot="label">Add</span></m3e-fab>
    `);
    const shadow = (id: string) =>
      page.locator(id).evaluate((el) => {
        const elevation = el.shadowRoot!.querySelector("m3e-elevation")!;
        return (
          getComputedStyle(elevation).getPropertyValue("--m3e-elevation-level") + getComputedStyle(elevation).boxShadow
        );
      });

    expect(await shadow("#raised")).not.toBe(await shadow("#low"));
  });

  test("toggling lowered at runtime reflects", async ({ page, render }) => {
    await render('<m3e-fab aria-label="Add"><span slot="label">Add</span></m3e-fab>');
    await page.locator("m3e-fab").evaluate((el) => ((el as HTMLElement & { lowered: boolean }).lowered = true));

    await expect(page.locator("m3e-fab")).toHaveAttribute("lowered", "");
  });
});
