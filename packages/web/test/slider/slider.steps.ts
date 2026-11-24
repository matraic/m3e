import type { M3eSliderElement } from "@m3e/web/slider";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { SliderHarness } from "./slider.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ slider: SliderHarness }>({
  slider: async ({ page, render }, use) => use(new SliderHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a single slider", ({ slider }) => slider.single());
When("the slider renders", async ({ slider }) => slider.render());
Then(
  "slider thumb {string} exposes minimum {int}, maximum {int}, and value {int}",
  async ({ slider }, name: string, min: number, max: number, value: number) => {
    await expect(slider.thumb(name)).toHaveAttribute("aria-valuemin", String(min));
    await expect(slider.thumb(name)).toHaveAttribute("aria-valuemax", String(max));
    await expect(slider.thumb(name)).toHaveAttribute("aria-valuenow", String(value));
  },
);
Then("slider thumb {string} exposes orientation {string}", async ({ slider }, name: string, orientation: string) =>
  expect(slider.thumb(name)).toHaveAttribute("aria-orientation", orientation),
);

Given("a single slider with attributes {string} and value {int}", ({ slider }, attributes: string, value: number) =>
  slider.single(attributes, value),
);

Given("a range slider", ({ slider }) => slider.range());

Given("a slider labelled by external text with an accessible value description", ({ slider }) => {
  slider.html = `<span id="volume-label">Playback volume</span><m3e-slider id="slider" style="width: 300px">
    <m3e-slider-thumb value="50" aria-labelledby="volume-label" aria-valuetext="Half volume"></m3e-slider-thumb>
  </m3e-slider>`;
});
Then("slider thumb {string} exposes value text {string}", async ({ slider }, name: string, text: string) =>
  expect(slider.thumb(name)).toHaveAttribute("aria-valuetext", text),
);

When("the user focuses the control before the slider", async ({ page }) => page.locator("#before").focus());
When("the user presses slider key {string}", async ({ page }, key: string) => page.keyboard.press(key));
Then("slider thumb {string} is focused", async ({ slider }, name: string) => expect(slider.thumb(name)).toBeFocused());
Then("focus moves past the slider", async ({ page }) => expect(page.locator("#after")).toBeFocused());

Then("slider thumb {string} is exposed as disabled", async ({ slider }, name: string) =>
  expect(slider.thumb(name)).toHaveAttribute("aria-disabled", "true"),
);

Then("slider thumb {string} has a visible focus ring", async ({ slider }, name: string) =>
  expect(slider.thumb(name).locator("m3e-focus-ring .outline")).toHaveClass(/visible/),
);
When("the user clicks slider value {int} beside thumb {string}", async ({ slider }, value: number, name: string) =>
  slider.click(value, name),
);
Then("slider thumb {string} has no visible focus ring", async ({ slider }, name: string) =>
  expect(slider.thumb(name).locator("m3e-focus-ring .outline")).not.toHaveClass(/visible/),
);

Given("forced colors are active for sliders", async ({ page }) => page.emulateMedia({ forcedColors: "active" }));

When("the application enables the slider", async ({ slider }) =>
  slider.slider.evaluate((element: M3eSliderElement) => (element.disabled = false)),
);
Then("slider thumb {string} has value {int}", async ({ slider }, name: string, value: number) =>
  expect(slider.thumb(name)).toHaveAttribute("aria-valuenow", String(value)),
);

Given("a single slider without a thumb value and minimum {int}", ({ slider }, minimum: number) => {
  slider.html = `<m3e-slider id="slider" min="${minimum}" style="width: 300px">
    <m3e-slider-thumb aria-label="Volume"></m3e-slider-thumb>
  </m3e-slider>`;
});
When("the user focuses slider thumb {string}", async ({ slider }, name: string) => slider.thumb(name).focus());

Given("a range slider without an upper thumb value", ({ slider }) => {
  slider.range();
  slider.html = slider.html.replace('value="75"', "");
});

Given("a slider with step {int} and direction {string}", ({ slider }, step: number, direction: "ltr" | "rtl") => {
  slider.single(`step="${step}"`);
  slider.direction = direction;
});

Given("a single slider on a scrollable page", ({ slider }) => {
  slider.single();
  slider.html += '<div style="height: 2000px"></div>';
});
When("the application observes slider events", async ({ slider }) => slider.recordEvents());
When("the application observes Space scrolling", async ({ slider, page }) => {
  await slider.slider.evaluate((element) => element.setAttribute("data-scroll-start", String(window.scrollY)));
  await page.evaluate(() =>
    document.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        document.getElementById("slider")?.setAttribute("data-space-prevented", String(event.defaultPrevented));
      }
    }),
  );
});
Then("the slider events are {string}", async ({ slider }, events: string) =>
  expect(slider.slider).toHaveAttribute("data-events", events),
);
Then("Space scrolling was prevented", async ({ slider }) => {
  await expect(slider.slider).toHaveAttribute("data-space-prevented", "true");
  expect(
    await slider.slider.evaluate((element) => window.scrollY - Number(element.getAttribute("data-scroll-start"))),
  ).toBe(0);
});

Given(
  "a single slider with orientation {string} and direction {string}",
  ({ slider }, orientation: string, direction: "ltr" | "rtl") => {
    slider.single(`orientation="${orientation}"`);
    slider.direction = direction;
  },
);

When("the user holds slider key {string}", async ({ page }, key: string) => page.keyboard.down(key));
When("the user releases slider key {string}", async ({ page }, key: string) => page.keyboard.up(key));

When("the application cancels slider beforeinput", async ({ slider }) => slider.recordEvents(true));

Given(
  "a range slider with orientation {string} and direction {string}",
  ({ slider }, orientation: string, direction: "ltr" | "rtl") => {
    slider.range(`orientation="${orientation}"`);
    slider.direction = direction;
  },
);
Then("slider thumb {string} has transform {string}", async ({ slider }, name: string, transform: string) =>
  expect(slider.thumb(name)).toHaveCSS("transform", transform),
);

Given("a range slider with a disabled upper thumb", ({ slider }) => slider.range("", "disabled"));

When("the user drags slider thumb {string} to value {int}", async ({ slider }, name: string, value: number) => {
  const box = await slider.thumb(name).boundingBox();
  if (!box) throw new Error("Missing slider thumb bounds");
  const point = await slider.point(value, name);
  await slider.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await slider.page.mouse.down();
  await slider.page.mouse.move(point.x, point.y, { steps: 5 });
  await slider.page.mouse.up();
});

Then("the slider zero tick is visible and inactive", async ({ slider }) => {
  await expect(slider.slider.locator(".tick")).toHaveCount(3);
  await expect(slider.slider.locator(".tick").nth(1)).toHaveCSS("transform", "matrix(1, 0, 0, 1, 142, 0)");
  await expect(slider.slider.locator(".tick").nth(1)).toHaveClass("tick inactive");
});
Then("the slider zero tick is visible and active", async ({ slider }) =>
  expect(slider.slider.locator(".tick").nth(1)).toHaveClass("tick active"),
);
Then("the slider zero tick is hidden by the thumb", async ({ slider }) =>
  expect(slider.slider.locator(".tick").nth(1)).toHaveClass(/hidden/),
);

Given("an animated stepped slider", async ({ slider, page }) => {
  await page.route("https://m3e.test/slider", (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><html><body></body></html>" }),
  );
  await page.goto("https://m3e.test/slider");
  slider.single('step="5"');
  slider.reducedMotion = "no-preference";
});
When("the application observes slider transform transitions", async ({ slider }) =>
  slider.thumb().evaluate((thumb: HTMLElement) => {
    thumb.setAttribute("data-transform-starts", "0");
    thumb.setAttribute("data-transform-ends", "0");
    for (const type of ["transitionrun", "transitionend"] as const) {
      thumb.addEventListener(type, (event) => {
        if (event.target !== thumb || event.propertyName !== "transform") return;
        const attribute = type === "transitionrun" ? "data-transform-starts" : "data-transform-ends";
        thumb.setAttribute(attribute, String(Number(thumb.getAttribute(attribute)) + 1));
      });
    }
  }),
);
When("the user starts dragging slider thumb {string}", async ({ slider }, name: string) => slider.startDrag(name));
When("the pointer delivers a slow movement to slider value {int}", async ({ slider }, value: number) =>
  slider.deliverMovement(value, 120),
);
When("the user releases the slider pointer", async ({ page }) => page.mouse.up());
Then("the slider transform animation completes", async ({ slider }) => {
  await expect.poll(() => slider.thumb().getAttribute("data-transform-starts")).not.toBe("0");
  await expect.poll(() => slider.thumb().getAttribute("data-transform-ends")).not.toBe("0");
  await expect.poll(() => slider.thumb().evaluate((thumb: HTMLElement) => thumb.style.transition)).toBe("");
  await expect(slider.thumb()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 227.2, 0)");
});

Then("slider thumb {string} has an active transform transition", async ({ slider }, name: string) =>
  expect.poll(() => slider.thumb(name).evaluate((thumb: HTMLElement) => thumb.style.transition)).toContain("transform"),
);
When("the pointer delivers a fast movement to slider value {int}", async ({ slider }, value: number) =>
  slider.deliverMovement(value, 16),
);
Then("slider thumb {string} has no transform transition", async ({ slider }, name: string) =>
  expect.poll(() => slider.thumb(name).evaluate((thumb: HTMLElement) => thumb.style.transition)).toBe(""),
);

When("the application changes slider direction to {string}", async ({ slider, page }, direction: "ltr" | "rtl") => {
  slider.direction = direction;
  await page.locator("body").evaluate((body, direction) => body.setAttribute("dir", direction), direction);
});

Given("a hidden slider with measurement monitoring", async ({ slider }) => {
  slider.single();
  slider.html = `<div id="hidden-slider" hidden>${slider.html}</div>`;
  await slider.monitorMeasurements();
});
When("the application reveals the slider", async ({ page }) =>
  page.locator("#hidden-slider").evaluate((element) => element.removeAttribute("hidden")),
);
When("the application sets slider thumb {string} to value {int}", async ({ slider }, name: string, value: number) =>
  slider.setValue(name, value),
);
When("the application makes the slider vertical with height {int}", async ({ slider }, height: number) =>
  slider.slider.evaluate((element: M3eSliderElement, height) => {
    element.style.height = `${height}px`;
    element.orientation = "vertical";
  }, height),
);
Then("the slider did not synchronously measure its layout", async ({ page }) =>
  expect(await page.evaluate(() => Object.getOwnPropertyDescriptor(window, "sliderMeasurementReads")?.value)).toEqual(
    [],
  ),
);

When("the application sets slider thumb width to {int}", async ({ slider }, width: number) =>
  slider
    .thumb()
    .evaluate(
      (element: HTMLElement, width) => element.style.setProperty("--m3e-slider-thumb-width", `${width}px`),
      width,
    ),
);
When("the application sets slider width to {int}", async ({ slider }, width: number) =>
  slider.slider.evaluate((element: HTMLElement, width) => (element.style.width = `${width}px`), width),
);
When("the application moves the slider to another container", async ({ slider }) => slider.moveSlider());

When("the application moves and scales the slider", async ({ slider }) =>
  slider.slider.evaluate((element: HTMLElement) => {
    element.style.marginLeft = "150px";
    element.style.transform = "scale(0.75)";
  }),
);

Given("two sliders with different bounds and orientations", ({ slider }) => {
  slider.single();
  slider.html +=
    '<m3e-slider id="second" min="10" max="90" step="5" orientation="vertical" style="height: 300px"></m3e-slider>';
});
When("the application moves the volume thumb to the second slider", async ({ slider }) =>
  slider.thumb().evaluate((thumb) => {
    const second = document.getElementById("second");
    if (!second) throw new Error("Missing second slider");
    second.appendChild(thumb);
  }),
);
Then("the first slider tracks no thumbs", async ({ slider }) => expect.poll(() => slider.thumbIds()).toEqual([]));
Then("the second slider tracks the volume thumb", async ({ slider }) =>
  expect.poll(() => slider.thumbIds("#second")).toEqual(["volume"]),
);
When("the application observes events on both sliders", async ({ slider }) => {
  await slider.recordEvents();
  await slider.recordEvents(false, "#second");
});
Then("the first slider has no input events", async ({ slider }) =>
  expect(slider.slider).toHaveAttribute("data-events", ""),
);
Then("the second slider events are {string}", async ({ page }, events: string) =>
  expect(page.locator("#second")).toHaveAttribute("data-events", events),
);

When("the application removes slider thumb {string}", async ({ slider }, name: string) =>
  slider.thumb(name).evaluate((thumb) => thumb.remove()),
);

When("the application adds a maximum thumb with value {int}", async ({ slider }, value: number) =>
  slider.slider.evaluate((element, value) => {
    const thumb = document.createElement("m3e-slider-thumb");
    thumb.setAttribute("aria-label", "Maximum");
    thumb.value = value;
    element.appendChild(thumb);
  }, value),
);

When("the application formats slider values as percentages", async ({ slider }) =>
  slider.slider.evaluate((element: M3eSliderElement) => (element.displayWith = (value) => `${value}%`)),
);
Then("the slider floating label is {string}", async ({ slider }, text: string) =>
  expect(slider.thumb().locator(".label")).toHaveText(text),
);

Given("a slider in a form with value {int}", ({ slider }, value: number) => {
  slider.single("", value, 'name="volume"');
  slider.html = `<form id="first-form">${slider.html}</form><form id="second-form"></form>`;
});
Then("the slider form value is {string}", async ({ page }, value: string) =>
  expect(await page.locator("#first-form").evaluate((form: HTMLFormElement) => new FormData(form).get("volume"))).toBe(
    value,
  ),
);

When("the application moves the slider into the second form", async ({ slider }) =>
  slider.slider.evaluate((element) => {
    const form = document.getElementById("second-form");
    if (!form) throw new Error("Missing second form");
    form.appendChild(element);
  }),
);
Then("the original form has no slider value", async ({ page }) =>
  expect(
    await page.locator("#first-form").evaluate((form: HTMLFormElement) => new FormData(form).get("volume")),
  ).toBeNull(),
);
Then("the second form slider value is {string}", async ({ page }, value: string) =>
  expect(await page.locator("#second-form").evaluate((form: HTMLFormElement) => new FormData(form).get("volume"))).toBe(
    value,
  ),
);

Given("a range slider in a form", ({ slider }) => {
  slider.range("", 'name="maximum"', 'name="minimum"');
  slider.html = `<form id="range-form">${slider.html}<button type="reset">Reset range</button></form>`;
});
Then(
  "the range form contains minimum {string} and maximum {string}",
  async ({ page }, minimum: string, maximum: string) =>
    expect
      .poll(() => page.locator("#range-form").evaluate((form: HTMLFormElement) => [...new FormData(form).entries()]))
      .toEqual([
        ["minimum", minimum],
        ["maximum", maximum],
      ]),
);
When("the user resets the range form", async ({ page }) =>
  page.getByRole("button", { name: "Reset range", exact: true }).click(),
);

Then("the slider size is {string}", async ({ slider }, size: string) =>
  expect(slider.slider).toHaveAttribute("size", size),
);
