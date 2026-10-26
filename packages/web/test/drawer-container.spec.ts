import { expect, test } from "./fixtures";

test.describe("m3e-drawer-container", () => {
  test("renders the start drawer and main content in their slots", async ({ page, render }) => {
    await render(`
      <m3e-drawer-container>
        <nav slot="start">Navigation</nav>
        <main>Main content</main>
      </m3e-drawer-container>
    `);

    await expect(page.locator("nav[slot=start]")).toBeAttached();
    await expect(page.getByText("Navigation")).toBeHidden();
    await expect(page.getByText("Main content")).toBeVisible();
  });

  test("opens the start drawer from its toggle and dispatches change", async ({ page, render }) => {
    await render(`
      <m3e-button toggle>
        <m3e-drawer-toggle for="navigation"></m3e-drawer-toggle>
        Menu
      </m3e-button>
      <m3e-drawer-container start-mode="over">
        <nav slot="start" id="navigation">Navigation</nav>
        <main>Main content</main>
      </m3e-drawer-container>
    `);
    const container = page.locator("m3e-drawer-container");
    const toggle = page.getByRole("button", { name: "Menu" });
    await page.evaluate(() => {
      (window as unknown as { drawerChanges: number }).drawerChanges = 0;
      document.querySelector("m3e-drawer-container")!.addEventListener("change", () => {
        (window as unknown as { drawerChanges: number }).drawerChanges += 1;
      });
    });

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();

    await expect(container).toHaveAttribute("start", "");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("selected", "");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { drawerChanges: number }).drawerChanges))
      .toBe(1);

    await toggle.click();

    await expect(container).not.toHaveAttribute("start");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).not.toHaveAttribute("selected");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { drawerChanges: number }).drawerChanges))
      .toBe(2);
  });

  test("supports independently opening start and end side drawers", async ({ page, render }) => {
    await render(`
      <m3e-drawer-container start end start-mode="side" end-mode="side">
        <nav slot="start">Start navigation</nav>
        <main>Main content</main>
        <aside slot="end">End details</aside>
      </m3e-drawer-container>
    `);
    const container = page.locator("m3e-drawer-container");

    await expect(container).toHaveAttribute("start", "");
    await expect(container).toHaveAttribute("end", "");
    await expect(page.getByText("Start navigation")).toBeVisible();
    await expect(page.getByText("End details")).toBeVisible();
  });

  test("closes an open over drawer when its scrim is clicked", async ({ page, render }) => {
    await render(`
      <m3e-drawer-container start start-mode="over">
        <nav slot="start">Navigation</nav>
        <main>Main content</main>
      </m3e-drawer-container>
    `);
    const container = page.locator("m3e-drawer-container");

    await container.evaluate((element) => {
      element.shadowRoot!.querySelector<HTMLElement>(".scrim")!.click();
    });

    await expect(container).not.toHaveAttribute("start");
  });

  test("closes the non-side drawer when opening the opposite drawer", async ({ page, render }) => {
    await render(`
      <m3e-drawer-container start start-mode="over" end-mode="push">
        <nav slot="start">Navigation</nav>
        <main>Main content</main>
        <aside slot="end">Details</aside>
      </m3e-drawer-container>
    `);
    const container = page.locator("m3e-drawer-container");

    await container.evaluate((element) => {
      (element as HTMLElement & { end: boolean }).end = true;
    });

    await expect(container).toHaveAttribute("end", "");
    await expect(container).not.toHaveAttribute("start");
  });

  const sideContainer = (attrs = "") => `
    <m3e-drawer-container start end ${attrs} style="height: 200px">
      <nav slot="start">Start</nav>
      <aside slot="end">End</aside>
      <main>Main</main>
    </m3e-drawer-container>
  `;

  test("start-divider and end-divider reflect and draw a border in side mode", async ({ page, render }) => {
    await render(sideContainer("start-divider end-divider"));
    const container = page.locator("m3e-drawer-container");

    await expect(container).toHaveAttribute("start-divider", "");
    await expect(container).toHaveAttribute("end-divider", "");
    const borders = await container.evaluate((el) => {
      const sides = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".start, .end, .drawer")];
      return sides.some((x) => {
        const s = getComputedStyle(x);
        return parseFloat(s.borderInlineEndWidth) > 0 || parseFloat(s.borderInlineStartWidth) > 0;
      });
    });
    expect(borders).toBe(true);
  });

  test("no divider is drawn by default", async ({ page, render }) => {
    await render(sideContainer());
    const container = page.locator("m3e-drawer-container");

    await expect(container).not.toHaveAttribute("start-divider");
    await expect(container).not.toHaveAttribute("end-divider");
    const borders = await container.evaluate((el) =>
      [...el.shadowRoot!.querySelectorAll<HTMLElement>(".start, .end, .drawer")].some((x) => {
        const s = getComputedStyle(x);
        return parseFloat(s.borderInlineEndWidth) > 0 || parseFloat(s.borderInlineStartWidth) > 0;
      }),
    );
    expect(borders).toBe(false);
  });

  test("start-mode and end-mode default to side and fall back when invalid", async ({ page, render }) => {
    await render(sideContainer('start-mode="bogus" end-mode="bogus"'));
    const container = page.locator("m3e-drawer-container");

    await expect(container).toHaveAttribute("start-mode", "side");
    await expect(container).toHaveAttribute("end-mode", "side");
  });
});
