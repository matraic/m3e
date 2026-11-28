import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { lineHeight, lines, textareaFixture, TextareaAutosizeHarness } from "./textarea-autosize.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ autosize: TextareaAutosizeHarness }>({
  autosize: async ({ page, render }, use) => use(new TextareaAutosizeHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an autosizing textarea", ({ autosize }) => {
  autosize.markup = textareaFixture();
});
When("the autosize fixture renders", async ({ autosize }) => autosize.show());
Then("the autosize helper is hidden from assistive technology", async ({ autosize }) => {
  await expect(autosize.helper).toHaveAttribute("aria-hidden", "true");
  await expect(autosize.helper).toBeHidden();
});
Then("the textarea named {string} is focusable", async ({ page, autosize }, name: string) => {
  await expect(page.getByRole("textbox", { name, exact: true })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(autosize.textarea).toBeFocused();
});
Then("manual textarea resizing is disabled", async ({ autosize }) =>
  expect(autosize.textarea).toHaveCSS("resize", "none"),
);

Given("an autosizing textarea containing {int} lines", ({ autosize }, count: number) => {
  autosize.markup = textareaFixture("", lines(count));
});
Then("the textarea height is {int} lines", async ({ autosize }, count: number) =>
  expect.poll(() => autosize.height()).toBe(count * lineHeight),
);
When("the user enters {int} lines in the textarea", async ({ autosize }, count: number) =>
  autosize.textarea.fill(lines(count)),
);

Given("an autosizing textarea with attributes {string}", ({ autosize }, attrs: string) => {
  autosize.markup = textareaFixture(attrs);
});
Then("the textarea maximum height is {int} pixels", async ({ autosize }, pixels: number) =>
  expect(autosize.textarea).toHaveCSS("max-height", `${pixels}px`),
);
When("the user enters wrapping text in the textarea", async ({ autosize }) =>
  autosize.textarea.fill("word ".repeat(60)),
);
Then("the textarea height exceeds {int} lines", async ({ autosize }, count: number) =>
  expect.poll(() => autosize.height()).toBeGreaterThan(count * lineHeight),
);

Given("an autosizing textarea with a {int}-line placeholder", ({ autosize }, count: number) => {
  autosize.markup = textareaFixture("", "", `placeholder="${lines(count)}"`);
});
Then("the textarea height is at least {int} lines", async ({ autosize }, count: number) =>
  expect.poll(() => autosize.height()).toBeGreaterThanOrEqual(count * lineHeight),
);
When("the application sets the textarea value to {int} lines", async ({ autosize }, count: number) =>
  autosize.textarea.evaluate((element: HTMLTextAreaElement, value) => {
    element.value = value;
  }, lines(count)),
);
When("the application resizes the textarea", async ({ autosize }) => autosize.call("resizeToFitContent"));
When("the user selects text in the textarea", async ({ autosize }) =>
  autosize.textarea.evaluate((element: HTMLTextAreaElement) => {
    element.focus();
    element.setSelectionRange(2, 5);
  }),
);
Then("the textarea retains focus and its selection", async ({ autosize }) => {
  await expect(autosize.textarea).toBeFocused();
  expect(
    await autosize.textarea.evaluate((element: HTMLTextAreaElement) => [element.selectionStart, element.selectionEnd]),
  ).toEqual([2, 5]);
});

Given("a disabled autosizing textarea with an original height of {int} pixels", ({ autosize }, height: number) => {
  autosize.markup = textareaFixture("disabled", "", `style="height: ${height}px"`);
});
Then("the textarea height is {int} pixels", async ({ autosize }, height: number) =>
  expect.poll(() => autosize.height()).toBe(height),
);

Given(
  "an autosizing textarea containing {int} lines with an original height of {int} pixels",
  ({ autosize }, count: number, height: number) => {
    autosize.markup = textareaFixture("", lines(count), `style="height: ${height}px"`);
  },
);
When("the application disables autosizing", async ({ autosize }) =>
  autosize.helper.evaluate((element) => element.setAttribute("disabled", "")),
);
When("the application enables autosizing", async ({ autosize }) =>
  autosize.helper.evaluate((element) => element.removeAttribute("disabled")),
);
When("the application resets autosizing", async ({ autosize }) => autosize.call("reset"));

Given(
  "an autosizing textarea with maximum {int} rows containing {int} lines",
  ({ autosize }, rows: number, count: number) => {
    autosize.markup = textareaFixture(`max-rows="${rows}"`, lines(count));
  },
);
When(
  "the application sets autosize attribute {string} to {string}",
  async ({ autosize }, name: string, value: string) =>
    autosize.helper.evaluate((element, input) => element.setAttribute(input.name, input.value), { name, value }),
);
Then("the textarea has no inline maximum height", async ({ autosize }) =>
  expect.poll(() => autosize.textarea.evaluate((element: HTMLElement) => element.style.maxHeight)).toBe(""),
);

Given("an autosizing textarea containing {int} lines with inline height limits", ({ autosize }, count: number) => {
  autosize.markup = textareaFixture("", lines(count), 'style="max-height: 60px; min-height: 30px"');
});
Then("the textarea minimum height is {int} pixels", async ({ autosize }, pixels: number) =>
  expect(autosize.textarea).toHaveCSS("min-height", `${pixels}px`),
);

Given(
  "an autosizing textarea with minimum {int} and maximum {int} rows containing {int} lines",
  ({ autosize }, min: number, max: number, count: number) => {
    autosize.markup = textareaFixture(`min-rows="${min}" max-rows="${max}"`, lines(count));
  },
);
When("the application clears the autosize row limits", async ({ autosize }) =>
  autosize.helper.evaluate((element) => {
    element.removeAttribute("min-rows");
    element.removeAttribute("max-rows");
  }),
);
Then("the textarea has no inline row limits", async ({ autosize }) =>
  expect(
    await autosize.textarea.evaluate((element: HTMLElement) => [element.style.minHeight, element.style.maxHeight]),
  ).toEqual(["", ""]),
);

Given(
  "an autosizing textarea with minimum {int} rows containing {int} lines",
  ({ autosize }, min: number, count: number) => {
    autosize.markup = textareaFixture(`min-rows="${min}"`, lines(count));
  },
);

Given("an autosizing textarea containing wrapping text", ({ autosize }) => {
  autosize.markup = textareaFixture("", "word ".repeat(40));
});
When("the textarea width and viewport are reduced", async ({ autosize, page }) => {
  autosize.previousHeight = await autosize.height();
  await autosize.textarea.evaluate((element: HTMLElement) => {
    element.style.width = "100px";
  });
  await page.setViewportSize({ width: 700, height: 500 });
});
Then("the textarea grows after the viewport resize", async ({ autosize }) =>
  expect.poll(() => autosize.height()).toBeGreaterThan(autosize.previousHeight),
);

Given("an autosize helper targeting an input", ({ autosize }) => {
  autosize.markup = '<input id="i"><m3e-textarea-autosize for="i"></m3e-textarea-autosize>';
});
Then("the input keeps its original resize style", async ({ page }) =>
  expect(await page.locator("#i").evaluate((element: HTMLElement) => element.style.resize)).toBe(""),
);

When("the application disconnects the autosize helper", async ({ autosize }) =>
  autosize.helper.evaluate((element) => {
    (window as typeof window & { detachedAutosize?: Element }).detachedAutosize = element;
    element.remove();
  }),
);
When("the application reconnects the autosize helper", async ({ page }) =>
  page.evaluate(() => {
    const helper = (window as typeof window & { detachedAutosize?: Element }).detachedAutosize;
    if (!helper) throw new Error("Autosize helper was not disconnected.");
    document.body.append(helper);
  }),
);
