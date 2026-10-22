import { expect, test } from "./fixtures";

const sizes = "--m3e-loading-indicator-size: 30px; --m3e-loading-indicator-container-size: 60px;";

test.describe("m3e-loading-indicator", () => {
  test("exposes an indeterminate progressbar", async ({ page, render }) => {
    await render(`<m3e-loading-indicator aria-label="Loading"></m3e-loading-indicator>`);
    const indicator = page.getByRole("progressbar", { name: "Loading" });

    await expect(indicator).toHaveAttribute("aria-valuemin", "0");
    await expect(indicator).toHaveAttribute("aria-valuemax", "100");
    await expect(indicator).not.toHaveAttribute("aria-valuenow");
  });

  test("sizes the uncontained and contained variants from their tokens", async ({ page, render }) => {
    await render(`
      <m3e-loading-indicator id="default" style="${sizes}"></m3e-loading-indicator>
      <m3e-loading-indicator id="contained" variant="contained" style="${sizes}"></m3e-loading-indicator>
      <m3e-loading-indicator id="invalid" variant="bogus" style="${sizes}"></m3e-loading-indicator>
    `);

    await expect(page.locator("#default")).toHaveCSS("width", "30px");
    await expect(page.locator("#contained")).toHaveCSS("width", "60px");
    await expect(page.locator("#invalid")).toHaveCSS("width", "30px");
  });

  test("updates its size when the variant attribute changes", async ({ page, render }) => {
    await render(`<m3e-loading-indicator style="${sizes}"></m3e-loading-indicator>`);
    const indicator = page.locator("m3e-loading-indicator");

    await indicator.evaluate((element) => element.setAttribute("variant", "contained"));
    await expect(indicator).toHaveCSS("width", "60px");

    await indicator.evaluate((element) => element.setAttribute("variant", "uncontained"));
    await expect(indicator).toHaveCSS("width", "30px");
  });

  test("animates while indeterminate and stops while a pull is in progress", async ({ page, render }) => {
    await render(`<m3e-loading-indicator></m3e-loading-indicator>`);
    const indicator = page.locator("m3e-loading-indicator");
    const animations = () => indicator.evaluate((element) => element.shadowRoot!.getAnimations().length);

    await expect.poll(animations).toBeGreaterThan(0);

    await indicator.evaluate((element) => element.setAttribute("pull-progress", "0.5"));
    await expect.poll(animations).toBe(0);

    await indicator.evaluate((element) => element.removeAttribute("pull-progress"));
    await expect.poll(animations).toBeGreaterThan(0);
  });

  test("does not animate when initially pulled", async ({ page, render }) => {
    await render(`<m3e-loading-indicator pull-progress="1"></m3e-loading-indicator>`);
    const indicator = page.locator("m3e-loading-indicator");

    await expect.poll(() => indicator.evaluate((element) => element.shadowRoot!.getAnimations().length)).toBe(0);
  });

  test("resumes animating after being reconnected", async ({ page, render }) => {
    await render(`<m3e-loading-indicator></m3e-loading-indicator>`);
    const indicator = page.locator("m3e-loading-indicator");

    await indicator.evaluate((element) => {
      const parent = element.parentElement!;
      element.remove();
      parent.append(element);
    });
    await expect
      .poll(() => indicator.evaluate((element) => element.shadowRoot!.getAnimations().length))
      .toBeGreaterThan(0);
  });
});
