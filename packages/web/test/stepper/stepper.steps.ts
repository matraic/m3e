import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { StepperHarness } from "./stepper.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  stepper: StepperHarness;
}>({
  stepper: async ({ page, render }, use) => use(new StepperHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a stepper", ({ stepper }) => stepper.prepare());
When("the stepper renders", async ({ stepper }) => stepper.render());
Then("the first step is selected and only its panel is visible", async ({ stepper }) => {
  expect(await stepper.index()).toBe(0);
  await expect(stepper.tab("One")).toHaveAttribute("selected", "");
  await expect(stepper.panel("One")).toBeVisible();
  await expect(stepper.panel("Two")).toBeHidden();
});
Then("each stepper tab has an accessible name and its panel is labelled by it", async ({ stepper }) => {
  await expect(stepper.stepper.getByRole("tablist")).toBeVisible();
  await expect(stepper.tabs).toHaveCount(3);

  for (const name of ["One", "Two", "Three"]) {
    const tab = stepper.tab(name);
    const panel = stepper.panel(name);
    const tabId = await tab.getAttribute("id");
    await expect(tab).toHaveAccessibleName(name);
    await expect(tab).toHaveAttribute("aria-controls", `p${["One", "Two", "Three"].indexOf(name) + 1}`);
    await expect(panel).toHaveAttribute("role", "tabpanel");
    await expect(panel).toHaveAttribute("aria-labelledby", tabId ?? "");
  }
});
Then("only the selected step is in the tab order", async ({ stepper }) => {
  for (const [index, name] of ["One", "Two", "Three"].entries()) {
    await expect(stepper.tab(name)).toHaveAttribute("aria-selected", index === 0 ? "true" : "false");
    await expect(stepper.tab(name)).toHaveAttribute("tabindex", index === 0 ? "0" : "-1");
  }
});

Given("a stepper with attributes {string}", ({ stepper }, attributes: string) => stepper.prepare(attributes));
Then("the stepper tablist has aria-orientation {string}", async ({ stepper }, orientation: string) =>
  expect(stepper.stepper.getByRole("tablist")).toHaveAttribute("aria-orientation", orientation),
);
Then("the second step has display order {string}", async ({ stepper }, order: string) =>
  expect(stepper.tab("Two")).toHaveCSS("order", order),
);

When("the user focuses stepper step {string}", async ({ stepper }, name: string) => stepper.tab(name).focus());
When("the user presses {string} in the stepper", async ({ stepper }, key: string) => stepper.page.keyboard.press(key));
Then("stepper step {string} has focus", async ({ stepper }, name: string) => expect(stepper.tab(name)).toBeFocused());
Then("the selected step index is {int}", async ({ stepper }, index: number) =>
  expect.poll(() => stepper.index()).toBe(index),
);
Then("the active step panel has accessible name {string}", async ({ stepper }, name: string) =>
  expect(stepper.stepper.getByRole("tabpanel", { name, exact: true })).toBeVisible(),
);
When("the user clicks stepper step {string}", async ({ stepper }, name: string) => stepper.tab(name).click());

When("the stepper renders and records selection events", async ({ stepper }) => {
  await stepper.render();
  await stepper.recordEvents();
});
Then("stepper panel {string} is visible", async ({ stepper }, name: string) =>
  expect(stepper.panel(name)).toBeVisible(),
);
Then("the stepper emits beforeinput, input, and change in order", async ({ stepper }) =>
  expect.poll(() => stepper.events()).toEqual(["beforeinput", "input", "change"]),
);

When("the application cancels beforeinput on stepper step {string}", async ({ stepper }, name: string) =>
  stepper.cancelBeforeInput(name),
);
Then("the stepper emits only beforeinput", async ({ stepper }) =>
  expect(await stepper.events()).toEqual(["beforeinput"]),
);
Then("stepper step {string} is completed", async ({ stepper }, name: string) =>
  expect(stepper.tab(name)).toHaveAttribute("completed", ""),
);
When("the user activates stepper action {string}", async ({ stepper }, name: string) =>
  stepper.page.getByText(name, { exact: true }).click(),
);
Then("stepper step {string} is not completed", async ({ stepper }, name: string) =>
  expect(stepper.tab(name)).not.toHaveAttribute("completed", ""),
);

When("the application moves the stepper previous", async ({ stepper }) => {
  stepper.lastMovement = await stepper.movePrevious();
});
Then("the movement is rejected", ({ stepper }) => expect(stepper.lastMovement).toBe(false));
When("the application moves the stepper next", async ({ stepper }) => {
  stepper.lastMovement = await stepper.moveNext();
});
Then("the movement is accepted", ({ stepper }) => expect(stepper.lastMovement).toBe(true));
When("the application moves the stepper to index {int}", async ({ stepper }, index: number) => {
  stepper.lastMovement = await stepper.moveTo(index);
});
Then("the stepper emits one change event", async ({ stepper }) => expect(await stepper.events()).toEqual(["change"]));

Given("a stepper with step {string} disabled", ({ stepper }, name: string) => {
  const attributes = ["", "", ""];
  attributes[["One", "Two", "Three"].indexOf(name)] = "disabled";
  stepper.prepare("", attributes);
});
Then("stepper step {string} is exposed as disabled", async ({ stepper }, name: string) =>
  expect(stepper.tab(name)).toHaveAttribute("aria-disabled", "true"),
);
When("the user dispatches a click on stepper step {string}", async ({ stepper }, name: string) =>
  stepper.tab(name).dispatchEvent("click"),
);
Given("a stepper with the first step disabled", ({ stepper }) => stepper.prepare("", ["disabled", "", ""]));
When("the application adds an associated fourth step", async ({ stepper }) => stepper.addFourthStep());
Then("the stepper contains {int} steps and keeps the selected index at {int}", async ({ stepper }, count, index) => {
  await expect.poll(() => stepper.stepCount()).toBe(count);
  expect(await stepper.index()).toBe(index);
});
Then("the fourth step and panel are accessibly associated", async ({ stepper }) => {
  const tab = stepper.tab("Four");
  const panel = stepper.stepper.locator("#p4");
  await expect(tab).toHaveAccessibleName("Four");
  await expect(panel).toHaveAttribute("aria-labelledby", (await tab.getAttribute("id")) ?? "");
});

Given("a linear stepper", ({ stepper }) => stepper.prepare("linear"));
When("the application attempts to move the stepper next", async ({ stepper }) => {
  stepper.lastMovement = await stepper.moveNext();
});
Then("stepper step {string} is marked invalid", async ({ stepper }, name: string) =>
  expect(stepper.tab(name)).toHaveAttribute("invalid", ""),
);
When("the application fills the first step's required field", async ({ stepper }) =>
  stepper.panel("One").locator("input").fill("valid"),
);
Given("a linear stepper with an optional first step", ({ stepper }) => stepper.prepare("linear", ["optional", "", ""]));
Then("stepper step {string} is labelled optional", async ({ stepper }, name: string) =>
  expect(stepper.tabs.first()).toHaveAccessibleName(`${name} (Optional)`),
);
Given("a linear stepper with an editable first step", ({ stepper }) => stepper.prepare("linear", ["editable", "", ""]));
When("the application resets the stepper", async ({ stepper }) => stepper.reset());
Then("the first step's required field is empty", async ({ stepper }) =>
  expect(stepper.panel("One").locator("input")).toHaveValue(""),
);

Then("the stepper attribute {string} is {string}", async ({ stepper }, name: string, value: string) =>
  expect(stepper.stepper).toHaveAttribute(name, value),
);
Then("the tablist is below the selected step panel", async ({ stepper }) => {
  const tabs = (await stepper.stepper.getByRole("tablist").boundingBox())!;
  const panel = (await stepper.panel("One").boundingBox())!;
  expect(tabs.y).toBeGreaterThan(panel.y);
});
