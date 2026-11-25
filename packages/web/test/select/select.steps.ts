import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eSelectElement } from "@m3e/web/select";
import type { M3eOptionElement } from "@m3e/web/option";

import { expect, test as componentTest } from "../fixtures";
import { SelectHarness } from "./select.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ selects: SelectHarness }>({
  selects: async ({ page, render }, use) => use(new SelectHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a single-select labelled {string}", ({ selects }, label: string) => {
  selects.label = label;
});
When("the select renders", async ({ selects }) => selects.render());
Then("the select has listbox popup semantics", async ({ selects }) =>
  expect(selects.combobox).toHaveAttribute("aria-haspopup", "listbox"),
);
Then("the select is collapsed", async ({ selects }) =>
  expect(selects.combobox).toHaveAttribute("aria-expanded", "false"),
);
Then("the select listbox is hidden", async ({ selects }) => expect(selects.listbox).toBeHidden());

When("the user opens the select", async ({ selects }) => {
  await selects.combobox.click();
  await expect(selects.listbox).toBeVisible();
  await expect(selects.listbox).toBeInViewport();
});
Then("the select is expanded", async ({ selects }) =>
  expect(selects.combobox).toHaveAttribute("aria-expanded", "true"),
);
Then("the select listbox contains {int} options", async ({ page }, count: number) =>
  expect(page.getByRole("option")).toHaveCount(count),
);

Given("a multi-select labelled {string}", ({ selects }, label: string) => {
  selects.label = label;
  selects.multi = true;
});
Given("the select is inside a scrolling container", ({ selects }) => {
  selects.scrolling = true;
});
When("the select container scrolls down {int} pixels", async ({ selects }, pixels: number) => {
  await selects.scroll(pixels);
  await expect.poll(() => selects.page.locator("#scroller").evaluate((scroller) => scroller.scrollTop)).toBe(pixels);
});
Then("the select listbox stays open and moves up {int} pixels", async ({ selects }, pixels: number) => {
  await expect(selects.listbox).toBeVisible();
  await expect(selects.combobox).toHaveAttribute("aria-expanded", "true");
  await expect.poll(() => selects.listboxMovement()).toBe(pixels);
});
When("the user chooses {string} in the select", async ({ selects }, name: string) => selects.option(name).click());
Then("the select value is {string}", async ({ selects }, value: string) =>
  expect.poll(() => selects.value()).toBe(value),
);

When("the application observes select events", async ({ selects }) => selects.recordEvents());
Then("the select events are {string}", async ({ selects }, events: string) =>
  expect(selects.select).toHaveAttribute("data-events", events),
);

When("the application cancels select beforeinput", async ({ selects }) =>
  selects.select.evaluate((select) => select.addEventListener("beforeinput", (event) => event.preventDefault())),
);
Then("the select has no value", async ({ selects }) => expect.poll(() => selects.value()).toBeNull());

When("the user attempts to choose disabled option {string} in the select", async ({ selects }, name: string) => {
  await selects.option(name).dispatchEvent("pointerdown");
  await selects.option(name).dispatchEvent("pointerup");
});

Given("the select starts with value {string}", ({ selects }, value: string) => {
  selects.attributes.set("value", value);
});
When("the application sets the select value to {string}", async ({ selects }, value: string) =>
  selects.setValue(value),
);
When("the application clears the select twice", async ({ selects }) => selects.clearTwice());
When("the user presses {string} in the select", async ({ page }, key: string) => page.keyboard.press(key));
When("the user focuses the select", async ({ selects }) => selects.combobox.focus());

Given("the select starts disabled", ({ selects }) => {
  selects.attributes.set("disabled", "");
});
When("the application clicks the select", async ({ selects }) => selects.combobox.dispatchEvent("click"));

Given("the select is in a form", ({ selects }) => {
  selects.inForm = true;
});
Then("the select form submits {string} as {string}", async ({ selects }, name: string, value: string) =>
  expect(await selects.formValues(name)).toEqual([value]),
);

Given("the select is required", ({ selects }) => {
  selects.attributes.set("required", "");
});
Then("the select is invalid", async ({ selects }) => expect(await selects.validity()).toBe(false));
Then("the select is valid", async ({ selects }) => expect(await selects.validity()).toBe(true));

Then("the select listbox is visible", async ({ selects }) => expect(selects.listbox).toBeVisible());
Then("the select listbox supports multiple selection", async ({ selects }) =>
  expect(selects.listbox).toHaveAttribute("aria-multiselectable", "true"),
);
Then("the select values are {string}", async ({ selects }, values: string) =>
  expect.poll(() => selects.value()).toEqual(values.split(",")),
);
Then("the select form submits {string} as the values {string}", async ({ selects }, name: string, values: string) =>
  expect(await selects.formValues(name)).toEqual(values.split(",")),
);

Given("the select uses only its associated label", ({ selects }) => {
  selects.labelOnly = true;
});
Then("the select has accessible name {string}", async ({ selects }, name: string) =>
  expect.poll(() => selects.nativeAccessibleName()).toBe(name),
);
When("the user clicks the select label", async ({ page }) => page.locator("label[for=fruit]").click());
Then("the select is focused", async ({ selects }) => expect(selects.select).toBeFocused());

Then("the select controls its listbox", async ({ selects }) => {
  await expect(selects.listbox).toHaveAttribute("id", /.+/);
  await expect(selects.select).toHaveAttribute("aria-controls", (await selects.listbox.getAttribute("id"))!);
});
Then("only the popup select options are exposed", async ({ selects, page }) => {
  await expect(selects.select.getByRole("option")).toHaveCount(0);
  await expect(page.getByRole("option")).toHaveCount(3);
  await expect(selects.option("Oranges")).toHaveAttribute("aria-disabled", "true");
});
Then("the select active option is {string}", async ({ selects }, name: string) =>
  expect.poll(() => selects.activeOption()).toBe(name),
);
Then("the select has no popup relationships", async ({ selects }) => {
  await expect(selects.select).not.toHaveAttribute("aria-controls");
  await expect(selects.select).not.toHaveAttribute("aria-activedescendant");
});
Then("select option {string} is exposed as selected", async ({ selects }, name: string) =>
  expect(selects.option(name)).toHaveAttribute("aria-selected", "true"),
);
Then("the control after the select is focused", async ({ page }) =>
  expect(page.getByRole("button", { name: "After select", exact: true })).toBeFocused(),
);
When("the user tabs from the control before the select", async ({ page }) => {
  await page.getByRole("button", { name: "Before select", exact: true }).focus();
  await page.keyboard.press("Tab");
});
Then("the select form submits no {string} values", async ({ selects }, name: string) =>
  expect(await selects.formValues(name)).toEqual([]),
);

When("the application moves the select to a new parent", async ({ selects }) => selects.move());
Then("no select popup remains in the document", async ({ page }) =>
  expect(page.locator("m3e-option-panel")).toHaveCount(0),
);
Then("exactly one select popup exists", async ({ page }) => expect(page.locator("m3e-option-panel")).toHaveCount(1));
When("the application moves the select to a new form", async ({ selects }) => selects.move(true));
Then("the original select form submits no values", async ({ page }) =>
  expect(
    await page
      .locator("form")
      .first()
      .evaluate((form) => [...new FormData(form as HTMLFormElement)]),
  ).toEqual([]),
);
Then("the destination select form submits {string} as {string}", async ({ page }, name: string, value: string) =>
  expect
    .poll(() =>
      page
        .locator("form#select-destination")
        .evaluate((form, name) => new FormData(form as HTMLFormElement).getAll(name), name),
    )
    .toEqual([value]),
);

When(
  "the application adds select option {string} with value {string}",
  async ({ selects }, name: string, value: string) => selects.addOption(name, value),
);
Then("the select tracks {int} options", async ({ selects }, count: number) =>
  expect.poll(() => selects.optionCount()).toBe(count),
);
When("the application removes every select option", async ({ selects }) =>
  selects.select.evaluate((select) => select.querySelectorAll("m3e-option").forEach((option) => option.remove())),
);

Given("the select starts without options", ({ selects }) => {
  selects.empty = true;
});

When("the select form is reset", async ({ page }) =>
  page.locator("form").evaluate((form) => (form as HTMLFormElement).reset()),
);
When("the application clears the select and restores focus", async ({ selects }) =>
  selects.select.evaluate((select) => (select as M3eSelectElement).clear(true)),
);
When("the application disables the select", async ({ selects }) =>
  selects.select.evaluate((select) => ((select as M3eSelectElement).disabled = true)),
);
When("the application sends {string} to the disabled select", async ({ selects }, key: string) =>
  selects.select.dispatchEvent("keydown", { key }),
);
When("the application enables the select", async ({ selects }) =>
  selects.select.evaluate((select) => {
    select.removeAttribute("disabled");
    (select as M3eSelectElement).disabled = false;
  }),
);
When("the application removes select option {string}", async ({ selects }, name: string) =>
  selects.sourceOption(name).evaluate((option) => option.remove()),
);
Then("the select displays no selected label", async ({ selects }) =>
  expect(selects.select.locator('slot[name="value"]')).toHaveText(""),
);
When("the application disables select option {string}", async ({ selects }, name: string) =>
  selects.sourceOption(name).evaluate((option) => ((option as M3eOptionElement).disabled = true)),
);
Then("select option {string} is exposed as disabled", async ({ selects }, name: string) =>
  expect(selects.option(name)).toHaveAttribute("aria-disabled", "true"),
);
When("the user clicks the control after the select", async ({ page }) =>
  page.getByRole("button", { name: "After select", exact: true }).click(),
);

Given("the select is in a modal dialog", ({ selects }) => {
  selects.modal = true;
});
Then("the select listbox is inside the modal dialog", async ({ page }) =>
  expect(page.locator("dialog").getByRole("listbox")).toBeVisible(),
);
When(
  "the user presses select option {string} and releases on {string}",
  async ({ selects, page }, pressed: string, released: string) => {
    await selects.option(pressed).hover();
    await page.mouse.down();
    await selects.option(released).hover();
    await page.mouse.up();
  },
);

Given("the select has grouped fruit options", ({ selects }) => {
  selects.optionsHtml = `<m3e-optgroup><span slot="label">Orchard</span>
    <m3e-option value="apple">Apples</m3e-option><m3e-option value="orange" disabled>Oranges</m3e-option>
  </m3e-optgroup>
  <m3e-optgroup><span slot="label">Other fruit</span>
    <m3e-option value="banana">Bananas</m3e-option><m3e-option value="pear">Pears</m3e-option>
  </m3e-optgroup>`;
});
Then("select group {string} contains options {string}", async ({ selects }, group: string, names: string) =>
  expect(selects.listbox.getByRole("group", { name: group, exact: true }).getByRole("option")).toHaveText(
    names.split(","),
  ),
);

Given("the select includes a None option with an empty value", ({ selects }) => {
  selects.emptyChoice = true;
});
Then("the select label does not float", async ({ selects }) =>
  expect.poll(() => selects.select.evaluate((select) => (select as M3eSelectElement).shouldLabelFloat)).toBe(false),
);
When("the application moves the select within its form", async ({ selects }) => selects.moveWithinForm());

Given("the select has initially selected toppings without explicit values", ({ selects }) => {
  selects.optionsHtml = `<m3e-option selected>Extra cheese</m3e-option>
    <m3e-option ${selects.multi ? "selected" : ""}>Mushroom</m3e-option>
    <m3e-option>Onion</m3e-option>
    <m3e-option>Pepperoni</m3e-option>
    <m3e-option>Sausage</m3e-option>
    <m3e-option>Tomato</m3e-option>`;
});
Then("the select displays the selected label {string}", async ({ selects }, label: string) =>
  expect(selects.select.locator('slot[name="value"]')).toHaveText(label),
);
Then("the select form-field label floats", async ({ page }) =>
  expect
    .poll(() => page.locator("m3e-form-field").evaluate((field) => field.matches(":state(--float-label)")))
    .toBe(true),
);
