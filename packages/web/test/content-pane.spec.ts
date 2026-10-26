import { expect, test } from "./fixtures";

test.describe("m3e-content-pane", () => {
  test("renders content from its default slot", async ({ page, render }) => {
    await render(`
      <m3e-content-pane>
        <p>Scrollable document content</p>
      </m3e-content-pane>
    `);

    await expect(page.getByText("Scrollable document content")).toBeVisible();
    await expect
      .poll(() =>
        page.locator("m3e-content-pane").evaluate((element) => {
          const container = element.shadowRoot!.querySelector(".scroll-container")!;
          return [getComputedStyle(container).overflowY, getComputedStyle(container).overflowX];
        }),
      )
      .toEqual(["auto", "hidden"]);
  });

  test("allows vertical scrolling while clipping horizontal overflow", async ({ page, render }) => {
    await render(`
      <m3e-content-pane style="display: block; width: 300px; height: 120px">
        <div style="width: 800px; height: 600px"></div>
      </m3e-content-pane>
    `);
    const metrics = await page.locator("m3e-content-pane").evaluate((element) => {
      const scroller = element.shadowRoot!.querySelector<HTMLElement>(".scroll-container")!;
      scroller.scrollTop = 100;
      return {
        scrollTop: scroller.scrollTop,
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
        scrollWidth: scroller.scrollWidth,
        clientWidth: scroller.clientWidth,
      };
    });

    expect(metrics.scrollTop).toBe(100);
    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  });

  test("hides its surface when the host is hidden", async ({ page, render }) => {
    await render('<m3e-content-pane hidden>Hidden content</m3e-content-pane>');

    await expect(page.locator("m3e-content-pane")).toBeHidden();
  });
});
