import { expect, test } from "./fixtures";

for (const tag of ["m3e-linear-progress-indicator", "m3e-circular-progress-indicator"]) {
  test.describe(tag, () => {
    test("exposes a determinate progressbar", async ({ page, render }) => {
      await render(`<${tag} aria-label="Progress" value="40"></${tag}>`);
      const indicator = page.getByRole("progressbar", { name: "Progress" });

      await expect(indicator).toHaveAttribute("aria-valuemin", "0");
      await expect(indicator).toHaveAttribute("aria-valuemax", "100");
      await expect(indicator).toHaveAttribute("aria-valuenow", "40");
    });

    test("honors a custom max", async ({ page, render }) => {
      await render(`<${tag} aria-label="Progress" value="5" max="10"></${tag}>`);
      const indicator = page.getByRole("progressbar", { name: "Progress" });

      await expect(indicator).toHaveAttribute("aria-valuemax", "10");
      await expect(indicator).toHaveAttribute("aria-valuenow", "5");
    });

    test("updates aria-valuenow when value changes", async ({ page, render }) => {
      await render(`<${tag} aria-label="Progress" value="10"></${tag}>`);
      const indicator = page.getByRole("progressbar", { name: "Progress" });

      await page.locator(tag).evaluate((element) => element.setAttribute("value", "75"));
      await expect(indicator).toHaveAttribute("aria-valuenow", "75");
    });

    test("defaults to the value 0", async ({ page, render }) => {
      await render(`<${tag} aria-label="Progress"></${tag}>`);

      await expect(page.getByRole("progressbar", { name: "Progress" })).toHaveAttribute("aria-valuenow", "0");
    });

    test("reflects the wavy variant and falls back to flat for invalid values", async ({ page, render }) => {
      await render(`
        <${tag} id="wavy" variant="wavy" aria-label="Wavy"></${tag}>
        <${tag} id="invalid" variant="bogus" aria-label="Invalid"></${tag}>
      `);

      await expect(page.locator("#wavy")).toHaveAttribute("variant", "wavy");
      await expect(page.locator("#invalid")).toHaveAttribute("variant", "flat");
    });

    test("is not displayed when hidden", async ({ page, render }) => {
      await render(`<${tag} hidden aria-label="Progress"></${tag}>`);

      await expect(page.locator(tag)).toBeHidden();
    });
  });
}

test.describe("m3e-linear-progress-indicator modes", () => {
  for (const mode of ["indeterminate", "query"]) {
    test(`omits aria-valuenow in ${mode} mode`, async ({ page, render }) => {
      await render(`<m3e-linear-progress-indicator aria-label="Progress" value="40" mode="${mode}">
        </m3e-linear-progress-indicator>`);

      await expect(page.getByRole("progressbar", { name: "Progress" })).not.toHaveAttribute("aria-valuenow");
    });
  }

  test("restores aria-valuenow when returning to determinate", async ({ page, render }) => {
    await render(`<m3e-linear-progress-indicator aria-label="Progress" value="40" mode="indeterminate">
      </m3e-linear-progress-indicator>`);
    const indicator = page.getByRole("progressbar", { name: "Progress" });

    await page
      .locator("m3e-linear-progress-indicator")
      .evaluate((element) => element.setAttribute("mode", "determinate"));
    await expect(indicator).toHaveAttribute("aria-valuenow", "40");
  });

  test("keeps aria-valuenow in buffer mode", async ({ page, render }) => {
    await render(`<m3e-linear-progress-indicator aria-label="Progress" value="30" buffer-value="60" mode="buffer">
      </m3e-linear-progress-indicator>`);

    await expect(page.getByRole("progressbar", { name: "Progress" })).toHaveAttribute("aria-valuenow", "30");
  });

  test("falls back to determinate for an invalid mode", async ({ page, render }) => {
    await render(`<m3e-linear-progress-indicator aria-label="Progress" mode="bogus">
      </m3e-linear-progress-indicator>`);

    await expect(page.locator("m3e-linear-progress-indicator")).toHaveAttribute("mode", "determinate");
  });
});

test.describe("m3e-circular-progress-indicator indeterminate", () => {
  test("omits aria-valuenow when indeterminate", async ({ page, render }) => {
    await render(`<m3e-circular-progress-indicator aria-label="Progress" value="40" indeterminate>
      </m3e-circular-progress-indicator>`);

    await expect(page.getByRole("progressbar", { name: "Progress" })).not.toHaveAttribute("aria-valuenow");
  });

  test("restores aria-valuenow when indeterminate is removed", async ({ page, render }) => {
    await render(`<m3e-circular-progress-indicator aria-label="Progress" value="40" indeterminate>
      </m3e-circular-progress-indicator>`);

    await page
      .locator("m3e-circular-progress-indicator")
      .evaluate((element) => element.removeAttribute("indeterminate"));
    await expect(page.getByRole("progressbar", { name: "Progress" })).toHaveAttribute("aria-valuenow", "40");
  });
});
