import { expect, test } from "./fixtures";

test.describe("m3e-card", () => {
  for (const variant of ["filled", "outlined", "elevated"]) {
    test(`applies the cut family to the ${variant} surface, media, and visual primitives`, async ({ page, render }) => {
      await render(`
        <style>:root { --m3e-shape-family: bevel; }</style>
        <m3e-card actionable variant="${variant}">
          <img slot="header" alt="Product" />
          <video slot="header"></video>
          <div slot="content">Product details</div>
        </m3e-card>
      `);

      for (const selector of [
        ".base",
        "img",
        "video",
        ".elevation",
        ".elevation .shadow",
        ".state-layer",
        ".state-layer .layer",
        ".ripple",
        ".focus-ring",
        ".focus-ring .outline",
      ]) {
        await expect(page.locator("m3e-card").locator(selector)).toHaveCSS("corner-shape", "superellipse(0)");
      }
      await expect(page.locator("m3e-card").locator(".base")).toHaveCSS("border-radius", "12px");
    });
  }

  test("resolves logical corners against the baseline and allows a card override", async ({ page, render }) => {
    await render(`
      <style>
        :root {
          --m3e-shape-family: bevel;
          --m3e-shape-family-start-start: round;
          --m3e-shape-family-end-end: round;
        }
      </style>
      <m3e-card>Family defaults</m3e-card>
    `);
    const card = page.locator("m3e-card");
    const base = card.locator(".base");
    await expect(base).toHaveCSS("corner-shape", "superellipse(1) superellipse(0)");

    await card.evaluate((element) => element.setAttribute("dir", "rtl"));
    await expect(base).toHaveCSS("corner-shape", "superellipse(0) superellipse(1)");

    await card.evaluate((element: HTMLElement) =>
      element.style.setProperty("--m3e-card-shape-family", "bevel"),
    );
    await expect(base).toHaveCSS("corner-shape", "superellipse(0)");

    await card.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-card-shape-family", "round"));
    await expect(base).toHaveCSS("corner-shape", "superellipse(1)");

    await card.evaluate((element: HTMLElement) =>
      element.style.setProperty("--m3e-card-shape-family-start-start", "bevel"),
    );
    await expect(base).toHaveCSS("corner-start-start-shape", "superellipse(0)");
    await expect(base).toHaveCSS("corner-start-end-shape", "superellipse(1)");

    await card.evaluate((element: HTMLElement) =>
      element.style.removeProperty("--m3e-card-shape-family-start-start"),
    );
    await expect(base).toHaveCSS("corner-shape", "superellipse(1)");

    await card.evaluate((element: HTMLElement) => element.style.removeProperty("--m3e-card-shape-family"));
    await expect(base).toHaveCSS("corner-shape", "superellipse(0) superellipse(1)");
  });

  test("renders content from its dedicated slots", async ({ page, render }) => {
    await render(`
      <m3e-card>
        <div slot="header">Product name</div>
        <div slot="content">Product details</div>
        <div slot="actions">Buy now</div>
        <div slot="footer">In stock</div>
      </m3e-card>
    `);

    await expect(page.getByText("Product name", { exact: true })).toBeVisible();
    await expect(page.getByText("Product details", { exact: true })).toBeVisible();
    await expect(page.getByText("Buy now", { exact: true })).toBeVisible();
    await expect(page.getByText("In stock", { exact: true })).toBeVisible();
  });

  test("renders default-slot content", async ({ page, render }) => {
    await render("<m3e-card>Custom card content</m3e-card>");

    await expect(page.getByText("Custom card content", { exact: true })).toBeVisible();
  });

  test("defaults to the filled variant and vertical orientation", async ({ page, render }) => {
    await render("<m3e-card>Card content</m3e-card>");

    await expect(page.locator("m3e-card").locator(".base")).toHaveCSS("corner-shape", "superellipse(1)");
    await expect(page.locator("m3e-card").locator(".base")).toHaveCSS("border-radius", "12px");

    await expect
      .poll(() =>
        page.locator("m3e-card").evaluate((element) => {
          const card = element as HTMLElement & { variant: string; orientation: string; inline: boolean };
          return [card.variant, card.orientation, card.inline];
        }),
      )
      .toEqual(["filled", "vertical", false]);
  });

  test("supports inline presentation", async ({ page, render }) => {
    await render('<m3e-card inline>Card content</m3e-card>');

    await expect(page.locator("m3e-card")).toHaveAttribute("inline", "");
  });

  for (const variant of ["filled", "outlined", "elevated"]) {
    test(`accepts the ${variant} variant`, async ({ page, render }) => {
      await render(`<m3e-card variant="${variant}">Card content</m3e-card>`);

      await expect(page.locator("m3e-card")).toHaveAttribute("variant", variant);
    });
  }

  test("falls back to the filled variant for an unknown variant", async ({ page, render }) => {
    await render('<m3e-card variant="unknown">Card content</m3e-card>');

    await expect
      .poll(() => page.locator("m3e-card").evaluate((element) => (element as HTMLElement & { variant: string }).variant))
      .toBe("filled");
  });

  for (const orientation of ["horizontal", "vertical"]) {
    test(`accepts the ${orientation} orientation`, async ({ page, render }) => {
      await render(`<m3e-card orientation="${orientation}">Card content</m3e-card>`);

      await expect(page.locator("m3e-card")).toHaveAttribute("orientation", orientation);
    });
  }

  test("falls back to vertical orientation for an unknown value", async ({ page, render }) => {
    await render('<m3e-card orientation="diagonal">Card content</m3e-card>');

    await expect
      .poll(
        () =>
          page
            .locator("m3e-card")
            .evaluate((element) => (element as HTMLElement & { orientation: string }).orientation),
      )
      .toBe("vertical");
  });

  test("is only exposed as a button and focusable when actionable", async ({ page, render }) => {
    await render(`
      <m3e-card>Static card</m3e-card>
      <m3e-card actionable>Actionable card</m3e-card>
    `);

    await expect(page.getByRole("button", { name: "Actionable card" })).toBeVisible();
    await expect(page.locator("m3e-card").first()).not.toHaveAttribute("tabindex");
    await expect(page.locator("m3e-card").nth(1)).toHaveAttribute("tabindex", "0");
  });

  test("dispatches click on pointer and keyboard activation", async ({ page, render }) => {
    await render('<m3e-card actionable>Open details</m3e-card>');
    const card = page.getByRole("button", { name: "Open details" });
    await page.evaluate(() => {
      const clicks: string[] = [];
      document.body.addEventListener("click", (event) => {
        if ((event.target as Element).closest("m3e-card")) clicks.push("click");
      });
      (window as unknown as { cardClicks: string[] }).cardClicks = clicks;
    });

    await card.click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { cardClicks: string[] }).cardClicks)).toEqual([
      "click",
    ]);

    await card.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => (window as unknown as { cardClicks: string[] }).cardClicks)).toEqual([
      "click",
      "click",
    ]);

    await page.keyboard.press("Space");
    await expect.poll(() => page.evaluate(() => (window as unknown as { cardClicks: string[] }).cardClicks)).toEqual([
      "click",
      "click",
      "click",
    ]);
  });

  test("does not dispatch clicks when disabled", async ({ page, render }) => {
    await render('<m3e-card actionable disabled>Unavailable card</m3e-card>');
    const card = page.getByRole("button", { name: "Unavailable card" });
    await page.evaluate(() => {
      const clicks: string[] = [];
      document.body.addEventListener("click", () => clicks.push("click"));
      (window as unknown as { cardClicks: string[] }).cardClicks = clicks;
    });

    await expect(card).toHaveAttribute("aria-disabled", "true");
    await expect(card).not.toHaveAttribute("tabindex");
    await card.evaluate((element: HTMLElement) => element.click());
    await expect(page.evaluate(() => (window as unknown as { cardClicks: string[] }).cardClicks)).resolves.toEqual([]);
  });

  test("exposes an actionable card with href as a link", async ({ page, render }) => {
    await render('<m3e-card actionable href="#details">View details</m3e-card>');

    await expect(page.getByRole("link", { name: "View details" })).toBeVisible();
  });
});
