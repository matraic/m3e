import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { SplitPaneHarness } from "./split-pane.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ splitPane: SplitPaneHarness }>({
  splitPane: async ({ page, render }, use) => use(new SplitPaneHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a split pane", ({ splitPane }) => splitPane.prepare());
When("the split pane renders", async ({ splitPane }) => splitPane.render());
Then("the separator is visible with default label and values", async ({ splitPane }) => {
  await expect(splitPane.handle).toBeVisible();
  await expect(splitPane.handle).toHaveAttribute("aria-label", "Resize panes");
  await expect(splitPane.handle).toHaveAttribute("aria-valuenow", "50");
  await expect(splitPane.handle).toHaveAttribute("aria-valuemin", "0");
  await expect(splitPane.handle).toHaveAttribute("aria-valuemax", "100");
  await expect(splitPane.handle).toHaveAttribute("aria-orientation", "vertical");
  await expect(splitPane.handle).toHaveAttribute("aria-valuetext", "Panes equally sized");
});

Given("a split pane with a custom label", ({ splitPane }) => splitPane.prepare('label="Sidebar width"'));
Then("the separator is named {string}", async ({ splitPane }, label: string) =>
  expect(splitPane.handle).toHaveAttribute("aria-label", label),
);

Given("a split pane with value {int}", ({ splitPane }, value: number) => splitPane.prepare(`value="${value}"`));
Then("the separator reports value {int} and its pane proportions", async ({ splitPane }, value: number) => {
  await expect(splitPane.handle).toHaveAttribute("aria-valuenow", `${value}`);
  await expect(splitPane.handle).toHaveAttribute("aria-valuetext", `Left pane ${value}%, right pane ${100 - value}%`);
});

Then("the separator describes the left pane as collapsed", async ({ splitPane }) =>
  expect(splitPane.handle).toHaveAttribute("aria-valuetext", "Left pane collapsed"),
);
When("the application changes the split pane value to {int}", async ({ splitPane }, value: number) =>
  splitPane.setValue(value),
);
Then("the separator describes the right pane as collapsed", async ({ splitPane }) =>
  expect(splitPane.handle).toHaveAttribute("aria-valuetext", "Right pane collapsed"),
);

Given("a vertical split pane with value {int}", ({ splitPane }, value: number) =>
  splitPane.prepare(`orientation="vertical" value="${value}"`),
);
Then("the separator reports vertical pane proportions", async ({ splitPane }) => {
  await expect(splitPane.handle).toHaveAttribute("aria-orientation", "horizontal");
  await expect(splitPane.handle).toHaveAttribute("aria-valuetext", "Top pane 25%, bottom pane 75%");
});

Given("a split pane with invalid orientation", ({ splitPane }) => splitPane.prepare('orientation="diagonal"'));
Then("the split pane orientation is {string}", async ({ splitPane }, orientation: string) =>
  expect(splitPane.pane).toHaveAttribute("orientation", orientation),
);

When("the application sets a custom value formatter and value 40", async ({ splitPane }) =>
  splitPane.pane.evaluate((element) => {
    const pane = element as HTMLElement & {
      value: number;
      valueFormatter: (value: number) => string;
    };
    pane.valueFormatter = (value) => `${value} percent`;
    pane.value = 40;
  }),
);
Then("the separator value text is {string}", async ({ splitPane }, valueText: string) =>
  expect(splitPane.handle).toHaveAttribute("aria-valuetext", valueText),
);

When("the application sets a value formatter that returns no text", async ({ splitPane }) =>
  splitPane.pane.evaluate((element) => {
    (element as HTMLElement & { valueFormatter: () => undefined }).valueFormatter = () => undefined;
  }),
);
Then("the separator has no value text", async ({ splitPane }) =>
  expect(splitPane.handle).not.toHaveAttribute("aria-valuetext", /.*/),
);

Given("a split pane in RTL with value {int}", ({ splitPane }, value: number) =>
  splitPane.prepare(`value="${value}"`, { direction: "rtl" }),
);

When("the split pane renders and records resize events", async ({ splitPane }) => {
  await splitPane.render();
  await splitPane.recordResizeEvents();
});
When("the user presses ArrowRight and ArrowLeft twice on the split pane", async ({ splitPane }) =>
  splitPane.press("ArrowRight", "ArrowLeft", "ArrowLeft"),
);
Then("the split pane value is {int}", async ({ splitPane }, value: number) =>
  expect.poll(() => splitPane.value()).toBe(value),
);
Then("resize events include beforeinput, input, and change", async ({ splitPane }) => {
  const events = await splitPane.resizeEvents();
  expect(events).toContain("beforeinput");
  expect(events).toContain("input");
  expect(events).toContain("change");
});

Given(
  "a split pane with value {int}, minimum {int}, and maximum {int}",
  ({ splitPane }, value: number, min: number, max: number) =>
    splitPane.prepare(`value="${value}" min="${min}" max="${max}"`),
);
When("the user presses End and Home on the split pane", async ({ splitPane }) => splitPane.press("End", "Home"));

Given(
  "a split pane with value {int}, minimum {int}, maximum {int}, and detents {string}",
  ({ splitPane }, value: number, min: number, max: number, detents: string) =>
    splitPane.prepare(`value="${value}" min="${min}" max="${max}" detents="${detents}"`),
);
When("the user presses PageDown and PageUp twice on the split pane", async ({ splitPane }) =>
  splitPane.press("PageDown", "PageUp", "PageUp"),
);
When("the user presses ArrowLeft twice on the split pane", async ({ splitPane }) =>
  splitPane.press("ArrowLeft", "ArrowLeft"),
);
When("the split pane renders and cancels beforeinput", async ({ splitPane }) => {
  await splitPane.render();
  await splitPane.cancelBeforeInput();
});

Given("a split pane with value {int} and detents {string}", ({ splitPane }, value: number, detents: string) =>
  splitPane.prepare(`value="${value}" detents="${detents}"`),
);

Given(
  "a split pane with value {int}, detents {string}, and wrapping",
  ({ splitPane }, value: number, detents: string) =>
    splitPane.prepare(`value="${value}" detents="${detents}" wrap-detents`),
);
When("the user presses Enter three times on the split pane", async ({ splitPane }) =>
  splitPane.press("Enter", "Enter", "Enter"),
);

When("the user presses Enter on the split pane", async ({ splitPane }) => splitPane.press("Enter"));
When("the user presses Space on the split pane", async ({ splitPane }) => splitPane.press("Space"));
When("the user presses {string} on the split pane", async ({ splitPane }, key: string) => splitPane.press(key));

When("the user presses ArrowDown and ArrowUp on the split pane", async ({ splitPane }) =>
  splitPane.press("ArrowDown", "ArrowUp"),
);
Given("a split pane with value {int} and step {int}", ({ splitPane }, value: number, step: number) =>
  splitPane.prepare(`value="${value}" step="${step}"`),
);
When("the user presses ArrowRight and ArrowLeft on the split pane", async ({ splitPane }) =>
  splitPane.press("ArrowRight", "ArrowLeft"),
);

When("the application collapses and expands the split pane", async ({ splitPane }) => splitPane.collapseAndExpand());
When("the application snaps the split pane to {int}", async ({ splitPane }, value: number) =>
  splitPane.snapToValue(value),
);
Given(
  "a vertical split pane with value {int} and pixel detents {string}",
  ({ splitPane }, value: number, detents: string) =>
    splitPane.prepare(`orientation="vertical" value="${value}" detents="${detents}"`),
);

When(
  "the user drags the split pane handle {int} pixels {string}",
  async ({ splitPane }, distance: number, direction: string) => {
    if (direction === "right") await splitPane.dragBy(distance);
    else if (direction === "left") await splitPane.dragBy(-distance);
    else if (direction === "down") await splitPane.dragBy(0, distance);
    else throw new Error(`Unknown split-pane drag direction: ${direction}`);
  },
);
Then("the split pane value is greater than {int}", async ({ splitPane }, value: number) =>
  expect.poll(() => splitPane.value()).toBeGreaterThan(value),
);
Then("one change event was raised", async ({ splitPane }) => expect(await splitPane.changeCount()).toBe(1));

Given("a split pane with maximum {int} and value {int}", ({ splitPane }, max: number, value: number) =>
  splitPane.prepare(`value="${value}" max="${max}"`),
);
Given("a disabled split pane", ({ splitPane }) => splitPane.prepare("disabled"));
Then("the separator is disabled and not tabbable", async ({ splitPane }) => {
  await expect(splitPane.handle).toHaveAttribute("aria-disabled", "true");
  await expect(splitPane.handle).not.toHaveAttribute("tabindex", /.*/);
});

Given("a disabled split pane with value {int}", ({ splitPane }, value: number) =>
  splitPane.prepare(`disabled value="${value}"`),
);
When("the application disables resizing", async ({ splitPane }) => splitPane.setDisabled(true));
Given("a split pane without an end pane", ({ splitPane }) => splitPane.prepare("", { end: false }));
Then("the separator is hidden", async ({ splitPane }) => expect(splitPane.handle).toBeHidden());
When("the application hides the end pane", async ({ splitPane }) => splitPane.hidePane("end"));
When("the application restores the end pane", async ({ splitPane }) => splitPane.restorePane("end"));
When("the application hides the start pane", async ({ splitPane }) => splitPane.hidePane("start"));
When("the application restores the start pane", async ({ splitPane }) => splitPane.restorePane("start"));
Then("the separator is visible", async ({ splitPane }) => expect(splitPane.handle).toBeVisible());
When("the application adds an end pane", async ({ splitPane }) => splitPane.addEndPane());

Given("a narrow split-pane viewport and an auto-orientation split pane", async ({ page, splitPane }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  splitPane.prepare('orientation="auto"');
});
Then("the separator has horizontal orientation", async ({ splitPane }) =>
  expect(splitPane.handle).toHaveAttribute("aria-orientation", "horizontal"),
);
When("the split-pane viewport widens", async ({ splitPane }) => splitPane.setViewport(1400));
Then("the separator has vertical orientation", async ({ splitPane }) =>
  expect(splitPane.handle).toHaveAttribute("aria-orientation", "vertical"),
);
When("the split-pane viewport narrows", async ({ splitPane }) => splitPane.setViewport(400));

When("the application changes the orientation to {string}", async ({ splitPane }, orientation: string) =>
  splitPane.setAttribute("orientation", orientation),
);
Given("a split pane in a form with initial value {int}", ({ splitPane }, value: number) =>
  splitPane.prepareForm(value),
);
When("the application resets the split-pane form", async ({ splitPane }) => splitPane.resetForm());
Then("the split pane form value is {string}", async ({ splitPane }, value: string) =>
  expect(await splitPane.formValue("split")).toBe(value),
);
Given("a split pane in a disabled fieldset", ({ splitPane }) => splitPane.prepareForm(35, true));
Then("the split pane is omitted from form data", async ({ splitPane }) =>
  expect(await splitPane.formValue("split")).toBeNull(),
);

When("the split pane renders with motion enabled", async ({ splitPane }) => splitPane.renderWithMotion());
Then("the split pane snap animation runs", async ({ splitPane }) =>
  expect.poll(() => splitPane.snapAnimationRunning()).toBe(true),
);
Then("the split pane value is eventually {int}", async ({ splitPane }, value: number) =>
  expect.poll(() => splitPane.value()).toBe(value),
);
