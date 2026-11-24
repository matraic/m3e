import type { Page } from "@playwright/test";
import type { M3eSliderElement, M3eSliderThumbElement } from "@m3e/web/slider";

import { expect, test } from "./fixtures";

const single = (attrs = "", value = 50) => `
  <m3e-slider ${attrs} style="width: 300px">
    <m3e-slider-thumb value="${value}" aria-label="Volume"></m3e-slider-thumb>
  </m3e-slider>
`;

const range = (attrs = "") => `
  <m3e-slider ${attrs} style="width: 300px">
    <m3e-slider-thumb value="25" aria-label="Minimum"></m3e-slider-thumb>
    <m3e-slider-thumb value="75" aria-label="Maximum"></m3e-slider-thumb>
  </m3e-slider>
`;

const record = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => {
    const events: string[] = [];
    (window as unknown as { events: string[] }).events = events;
    for (const type of ["beforeinput", "input", "change"]) {
      el.addEventListener(type, () => events.push(type));
    }
  });

const events = (page: Page) => page.evaluate(() => (window as unknown as { events: string[] }).events);

test.describe("m3e-slider", () => {
  test("exposes each thumb as a slider with value semantics", async ({ page, render }) => {
    await render(single());
    const thumb = page.getByRole("slider", { name: "Volume" });

    await expect(thumb).toHaveAttribute("aria-valuemin", "0");
    await expect(thumb).toHaveAttribute("aria-valuemax", "100");
    await expect(thumb).toHaveAttribute("aria-valuenow", "50");
    await expect(thumb).toHaveAttribute("aria-orientation", "horizontal");
  });

  test("uses custom min and max", async ({ page, render }) => {
    await render(single('min="10" max="20"', 15));
    const thumb = page.getByRole("slider", { name: "Volume" });

    await expect(thumb).toHaveAttribute("aria-valuemin", "10");
    await expect(thumb).toHaveAttribute("aria-valuemax", "20");
    await expect(thumb).toHaveAttribute("aria-valuenow", "15");
  });

  test("bounds each thumb of a range slider by its neighbor", async ({ page, render }) => {
    await render(range());

    await expect(page.getByRole("slider", { name: "Minimum" })).toHaveAttribute("aria-valuemax", "75");
    await expect(page.getByRole("slider", { name: "Maximum" })).toHaveAttribute("aria-valuemin", "25");
  });

  test("reports a vertical orientation", async ({ page, render }) => {
    await render(`
      <m3e-slider orientation="vertical" style="height: 200px">
        <m3e-slider-thumb value="40" aria-label="Volume"></m3e-slider-thumb>
      </m3e-slider>
    `);

    await expect(page.getByRole("slider", { name: "Volume" })).toHaveAttribute("aria-orientation", "vertical");
  });

  test("initializes and updates values using resize-delivered dimensions", async ({ page, render }) => {
    await page.evaluate(() => {
      const reads: string[] = [];
      Object.defineProperty(window, "sliderMeasurementReads", { value: reads });
      let deliveringResize = false;
      const NativeResizeObserver = window.ResizeObserver;
      window.ResizeObserver = class extends NativeResizeObserver {
        constructor(callback: ResizeObserverCallback) {
          super((entries, observer) => {
            deliveringResize = true;
            try {
              callback(entries, observer);
            } finally {
              deliveringResize = false;
            }
          });
        }
      };
      for (const name of ["clientWidth", "clientHeight"]) {
        const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, name);
        if (!descriptor?.get) throw new Error(`Missing native ${name} getter`);
        const getter = descriptor.get;
        Object.defineProperty(Element.prototype, name, {
          ...descriptor,
          get: function (this: Element) {
            if (this.matches("m3e-slider, m3e-slider-thumb") && !deliveringResize) reads.push(name);
            return getter.call(this);
          },
        });
      }
      const getRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        if (this.matches("m3e-slider, m3e-slider-thumb") && !deliveringResize) reads.push("getBoundingClientRect");
        return getRect.call(this);
      };
    });

    await render(`<div id="hidden-slider" hidden>${single()}</div>`);
    await page.locator("#hidden-slider").evaluate((element) => element.removeAttribute("hidden"));
    const slider = page.locator("m3e-slider");
    const thumb = page.locator("m3e-slider-thumb");
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 142, 0)");
    await thumb.evaluate((element: M3eSliderThumbElement) => (element.value = 75));
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 213, 0)");

    await slider.evaluate((element: M3eSliderElement) => {
      element.style.height = "300px";
      element.orientation = "vertical";
    });
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -213)");
    expect(await page.evaluate(() => Object.getOwnPropertyDescriptor(window, "sliderMeasurementReads")?.value)).toEqual(
      [],
    );
  });

  test("updates sizing after thumb CSS changes, resizing, and reconnection", async ({ page, render }) => {
    await render(`${single()}<div id="destination"></div>`);
    const slider = page.locator("m3e-slider");
    const thumb = page.locator("m3e-slider-thumb");
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 142, 0)");
    await thumb.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-slider-thumb-width", "12px"));
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 138, 0)");
    await slider.evaluate((element: HTMLElement) => (element.style.width = "420px"));
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 198, 0)");
    await slider.evaluate((element) => {
      const destination = document.getElementById("destination");
      if (!destination) throw new Error("Missing slider destination");
      destination.appendChild(element);
    });
    await thumb.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-slider-thumb-width", "20px"));
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 194, 0)");
  });

  test("refreshes pointer coordinates after the slider moves and is transformed", async ({ page, render }) => {
    await render(single());
    const slider = page.locator("m3e-slider");
    const thumb = page.getByRole("slider", { name: "Volume" });
    await expect(thumb).toHaveCSS("transform", "matrix(1, 0, 0, 1, 142, 0)");
    await slider.evaluate((element: HTMLElement) => {
      element.style.marginLeft = "150px";
      element.style.transform = "scale(0.75)";
    });
    const box = await slider.boundingBox();
    if (!box) throw new Error("Missing slider bounds");
    await page.mouse.click(box.x + box.width * 0.8, box.y + box.height / 2);
    const value = Number(await thumb.getAttribute("aria-valuenow"));
    expect(value).toBeGreaterThanOrEqual(75);
    expect(value).toBeLessThanOrEqual(85);
  });

  test("changes the value by one step with the arrow keys", async ({ page, render }) => {
    await render(single());
    const thumb = page.getByRole("slider", { name: "Volume" });

    await thumb.focus();
    await page.keyboard.press("ArrowRight");
    await expect(thumb).toHaveAttribute("aria-valuenow", "51");

    await page.keyboard.press("ArrowUp");
    await expect(thumb).toHaveAttribute("aria-valuenow", "52");

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowDown");
    await expect(thumb).toHaveAttribute("aria-valuenow", "50");
  });

  test("honors a custom step", async ({ page, render }) => {
    await render(single('step="5"'));
    const thumb = page.getByRole("slider", { name: "Volume" });

    await thumb.focus();
    await page.keyboard.press("ArrowRight");

    await expect(thumb).toHaveAttribute("aria-valuenow", "55");
  });

  test("jumps with Home, End, PageUp and PageDown", async ({ page, render }) => {
    await render(single());
    const thumb = page.getByRole("slider", { name: "Volume" });

    await thumb.focus();
    await page.keyboard.press("Home");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0");

    await page.keyboard.press("PageUp");
    await expect(thumb).toHaveAttribute("aria-valuenow", "10");

    await page.keyboard.press("PageDown");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0");

    await page.keyboard.press("End");
    await expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  test("does not exceed the minimum or maximum", async ({ page, render }) => {
    await render(single("", 100));
    const thumb = page.getByRole("slider", { name: "Volume" });

    await thumb.focus();
    await page.keyboard.press("ArrowRight");

    await expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  test("prevents range thumbs from crossing", async ({ page, render }) => {
    await render(range());
    const lower = page.getByRole("slider", { name: "Minimum" });

    await lower.focus();
    await page.keyboard.press("End");

    await expect(lower).toHaveAttribute("aria-valuenow", "75");
  });

  test("dispatches beforeinput and input while changing and change on key up", async ({ page, render }) => {
    await render(single());
    await record(page, "m3e-slider");

    await page.getByRole("slider", { name: "Volume" }).focus();
    await page.keyboard.press("ArrowRight");

    expect(await events(page)).toEqual(["beforeinput", "input", "change"]);
  });

  test("does not change the value when beforeinput is canceled", async ({ page, render }) => {
    await render(single());
    await page.locator("m3e-slider").evaluate((el) => el.addEventListener("beforeinput", (e) => e.preventDefault()));
    const thumb = page.getByRole("slider", { name: "Volume" });

    await thumb.focus();
    await page.keyboard.press("ArrowRight");

    await expect(thumb).toHaveAttribute("aria-valuenow", "50");
  });

  test("does not dispatch events when the value cannot change", async ({ page, render }) => {
    await render(single("", 0));
    await record(page, "m3e-slider");

    await page.getByRole("slider", { name: "Volume" }).focus();
    await page.keyboard.press("Home");

    expect(await events(page)).toEqual([]);
  });

  test("moves the thumb to where the track is clicked", async ({ page, render }) => {
    await render(single());
    const thumb = page.getByRole("slider", { name: "Volume" });
    const box = (await page.locator("m3e-slider").boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.2, box.y + box.height / 2);

    const value = Number(await thumb.getAttribute("aria-valuenow"));
    expect(value).toBeGreaterThanOrEqual(15);
    expect(value).toBeLessThanOrEqual(25);
  });

  test("moves the thumb when dragged", async ({ page, render }) => {
    await render(single());
    const thumb = page.getByRole("slider", { name: "Volume" });
    const box = (await page.locator("m3e-slider").boundingBox())!;
    const y = box.y + box.height / 2;

    await page.mouse.move(box.x + box.width * 0.5, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, y, { steps: 5 });
    await page.mouse.up();

    const value = Number(await thumb.getAttribute("aria-valuenow"));
    expect(value).toBeGreaterThanOrEqual(75);
    expect(value).toBeLessThanOrEqual(85);
  });

  test("snaps clicks to the step", async ({ page, render }) => {
    await render(single('step="25" discrete'));
    const thumb = page.getByRole("slider", { name: "Volume" });
    const box = (await page.locator("m3e-slider").boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.8, box.y + box.height / 2);

    expect(["75", "100"]).toContain(await thumb.getAttribute("aria-valuenow"));
    expect(Number(await thumb.getAttribute("aria-valuenow")) % 25).toBe(0);
  });

  test("does not change when disabled", async ({ page, render }) => {
    await render(single("disabled"));
    const thumb = page.getByRole("slider", { name: "Volume" });
    const box = (await page.locator("m3e-slider").boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);

    await expect(thumb).toHaveAttribute("aria-valuenow", "50");
    await expect(thumb).toHaveAttribute("aria-disabled", "true");
  });

  test("formats the label with displayWith", async ({ page, render }) => {
    await render(single("labelled"));
    await page.locator("m3e-slider").evaluate((el) => {
      (el as HTMLElement & { displayWith: (v: number | null) => string }).displayWith = (v) => `${v}%`;
    });
    await page.getByRole("slider", { name: "Volume" }).focus();
    await page.keyboard.press("ArrowRight");

    await expect(page.getByText("51%", { exact: true })).toBeAttached();
  });

  test("submits the thumb value with a form", async ({ page, render }) => {
    await render(
      `<form><m3e-slider><m3e-slider-thumb name="volume" value="30"></m3e-slider-thumb></m3e-slider></form>`,
    );

    expect(await page.locator("form").evaluate((f) => new FormData(f as HTMLFormElement).get("volume"))).toBe("30");
  });

  test("falls back to the extra-small size for an invalid value", async ({ page, render }) => {
    await render(single('size="bogus"'));

    await expect(page.locator("m3e-slider")).toHaveAttribute("size", "extra-small");
  });
});
