import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { FormFieldHarness } from "./form-field.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ formField: FormFieldHarness }>({
  formField: async ({ page, render }, use) => use(new FormFieldHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a form field labelled {string}", ({ formField }, label: string) => {
  formField.html = formField.markup(label);
});
When("the form field renders", async ({ formField }) => formField.render());
Then("the form field control is accessible as {string}", async ({ formField }, name: string) => {
  await expect(formField.control).toHaveRole("textbox");
  await expect(formField.control).toBeVisible();
  await expect(formField.control).toHaveAccessibleName(name);
});
When("the user clicks the form field", async ({ formField }) =>
  formField.field.locator(".base").click({ position: { x: 5, y: 5 } }),
);
Then("the form field control is focused", async ({ formField }) => expect(formField.control).toBeFocused());

Given("outlined and filled form fields", ({ formField }) => {
  formField.html = `<m3e-form-field variant="outlined"><input aria-label="Outlined field"></m3e-form-field>
    <m3e-form-field variant="filled"><input aria-label="Filled field"></m3e-form-field>`;
});
Then("the form fields have their configured variants", async ({ page }) => {
  await expect(page.locator("m3e-form-field").nth(0)).toHaveAttribute("variant", "outlined");
  await expect(page.locator("m3e-form-field").nth(1)).toHaveAttribute("variant", "filled");
});
Then("the form field label is not floating", async ({ formField }) =>
  expect.poll(() => formField.state("float-label")).toBe(false),
);
When("the user focuses the form field control", async ({ formField }) => formField.control.focus());
Then("the form field label is floating", async ({ formField }) =>
  expect.poll(() => formField.state("float-label")).toBe(true),
);
When("the user leaves the form field control", async ({ formField }) => formField.control.blur());
When("the user enters {string} in the form field control", async ({ formField }, value: string) =>
  formField.control.fill(value),
);

Given("a form field labelled {string} with an always-floating label", ({ formField }, label: string) => {
  formField.html = formField.markup(label, 'float-label="always"');
});
Then("the form field label uses the floating font size", async ({ formField, page }) => {
  formField.floatingFontSize = await formField.field
    .locator(".label")
    .evaluate((element) => getComputedStyle(element).fontSize);
  expect(Number.parseFloat(formField.floatingFontSize)).toBeLessThan(
    await page.locator("body").evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  );
});
Then("the form field label retains its floating font size", async ({ formField }) =>
  expect(formField.field.locator(".label")).toHaveCSS("font-size", formField.floatingFontSize),
);
Then("the outline notch matches the label {string}", async ({ formField }, label: string) => {
  await expect(formField.field.locator(".pseudo-label")).toHaveText(label);
  formField.notchWidth = await formField.field
    .locator(".outline-notch")
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(formField.notchWidth).toBeGreaterThan(0);
});
When("the application changes the form field label to {string}", async ({ formField }, label: string) =>
  formField.field.locator('[slot="label"]').evaluate((element, value) => {
    if (!element.firstChild) throw new Error("Missing form field label text node");
    element.firstChild.nodeValue = value;
  }, label),
);
Then("the outline notch matches the label {string} and is wider", async ({ formField }, label: string) => {
  await expect(formField.field.locator(".pseudo-label")).toHaveText(label);
  await expect
    .poll(() => formField.field.locator(".outline-notch").evaluate((element) => element.getBoundingClientRect().width))
    .toBeGreaterThan(formField.notchWidth);
});

Given("a disabled form field control", ({ formField }) => {
  formField.html = formField.markup("Disabled field", "", "disabled");
});
Then("the form field control is disabled", async ({ formField }) => expect(formField.control).toBeDisabled());
Then("the form field control is not focused", async ({ formField }) => expect(formField.control).not.toBeFocused());

Given("a read-only form field control with value {string}", ({ formField }, value: string) => {
  formField.html = formField.markup("Readonly field", "", `readonly value="${value}"`);
});
Then("the form field control is enabled and read-only", async ({ formField }) => {
  await expect(formField.control).toBeEnabled();
  await expect(formField.control).toHaveAttribute("readonly", "");
});
When("the user types {string} in the form field control", async ({ page }, text: string) => page.keyboard.type(text));
Then("the form field control value is {string}", async ({ formField }, value: string) =>
  expect(formField.control).toHaveValue(value),
);
When("the application disables the form field control", async ({ formField }) =>
  formField.control.evaluate((element: HTMLInputElement) => {
    element.disabled = true;
  }),
);
Then("the form field is marked disabled", async ({ formField }) =>
  expect.poll(() => formField.state("disabled")).toBe(true),
);
When("the application enables the form field control", async ({ formField }) =>
  formField.control.evaluate((element: HTMLInputElement) => {
    element.disabled = false;
  }),
);
Then("the form field is not marked disabled", async ({ formField }) =>
  expect.poll(() => formField.state("disabled")).toBe(false),
);
When("the application makes the form field control read-only", async ({ formField }) =>
  formField.control.evaluate((element: HTMLInputElement) => {
    element.readOnly = true;
  }),
);
Then("the form field is marked read-only", async ({ formField }) =>
  expect.poll(() => formField.state("readonly")).toBe(true),
);
When("the application makes the form field control editable", async ({ formField }) =>
  formField.control.evaluate((element: HTMLInputElement) => {
    element.readOnly = false;
  }),
);
Then("the form field is not marked read-only", async ({ formField }) =>
  expect.poll(() => formField.state("readonly")).toBe(false),
);

Given("a form field with an interactive suffix", ({ formField }) => {
  formField.html = formField.markup(
    "Name",
    "",
    "",
    '<button slot="suffix" type="button" onclick="this.dataset.clicks = String(Number(this.dataset.clicks || 0) + 1)">Clear</button>',
  );
});
When("the user activates the form field suffix", async ({ formField }) =>
  formField.field.getByRole("button", { name: "Clear" }).click(),
);
Then("the form field suffix is focused", async ({ formField }) =>
  expect(formField.field.getByRole("button", { name: "Clear" })).toBeFocused(),
);
Then("the form field suffix action is invoked once", async ({ formField }) =>
  expect(formField.field.getByRole("button", { name: "Clear" })).toHaveAttribute("data-clicks", "1"),
);

Given("a form field with a hint", ({ formField }) => {
  formField.html = formField.markup(
    "Username",
    'hide-subscript="never"',
    "",
    '<span slot="hint">Use at least 4 characters</span>',
  );
});
Then("the form field hint is visible", async ({ formField }) => expect(formField.field.locator(".hint")).toBeVisible());
Then("the form field control is described by {string}", async ({ formField }, text: string) =>
  expect(formField.control).toHaveAccessibleDescription(new RegExp(text)),
);

Given("a form field with a hint and a consumer description", ({ formField }) => {
  formField.html = `<span id="external-description">External guidance</span>${formField.markup(
    "Username",
    'hide-subscript="never"',
    'aria-describedby="external-description"',
    '<span slot="hint">Use at least 4 characters</span>',
  )}`;
});
When("the application changes the form field hint to {string}", async ({ formField }, hint: string) =>
  formField.field.locator('[slot="hint"]').evaluate((element, text) => {
    element.textContent = text;
  }, hint),
);
Then("the form field control is not described by {string}", async ({ formField }, text: string) =>
  expect(formField.control).not.toHaveAccessibleDescription(new RegExp(text)),
);
When("the application moves the form field to another parent", async ({ formField }) =>
  formField.field.evaluate((element) => {
    const destination = document.querySelector("#field-destination");
    if (!destination) throw new Error("Missing form field destination");
    destination.append(element);
  }),
);
When("the application replaces the form field control with a separately described control", async ({ formField }) =>
  formField.control.evaluate((element) => {
    const destination = document.querySelector("#removed-controls");
    if (!destination) throw new Error("Missing removed control destination");
    const replacement = document.createElement("input");
    replacement.id = "field-control";
    replacement.setAttribute("aria-describedby", "external-description");
    element.replaceWith(replacement);
    element.id = "old-control";
    destination.append(element);
  }),
);
Then("the new form field control is described by {string}", async ({ formField }, text: string) =>
  expect(formField.control).toHaveAccessibleDescription(new RegExp(text)),
);
Then("the removed form field control is described only by {string}", async ({ page }, text: string) => {
  const control = page.locator("#old-control");
  await expect(control).toHaveAccessibleDescription(text);
  await expect(control).toHaveAttribute("aria-describedby", "external-description");
});

Given("a form field with an always-hidden hint", ({ formField }) => {
  formField.html = formField.markup(
    "Hidden hint field",
    'hide-subscript="always"',
    "",
    '<span slot="hint">Hint text</span>',
  );
});
Then("the form field subscript is not displayed", async ({ formField }) =>
  expect.poll(() => formField.subscriptStyle()).toEqual({ display: "none", opacity: "1" }),
);

Given("a required form field with automatic subscript", ({ formField }) => {
  formField.html = formField.requiredMarkup('hide-subscript="auto"');
});
Then("the form field subscript is transparent", async ({ formField }) =>
  expect.poll(() => formField.subscriptStyle()).toMatchObject({ display: "flex", opacity: "0" }),
);
Then("the form field subscript is opaque", async ({ formField }) =>
  expect.poll(() => formField.subscriptStyle()).toMatchObject({ opacity: "1" }),
);
Then("the form field control is invalid", async ({ formField }) =>
  expect(formField.control).toHaveAttribute("aria-invalid", "true"),
);
Then("the form field error is visible", async ({ formField }) =>
  expect(formField.field.locator(".error")).toBeVisible(),
);

Given("a required form field with hint and error", ({ formField }) => {
  formField.html = formField.requiredMarkup('hide-subscript="never"');
});
Then("the form field hint is hidden", async ({ formField }) => expect(formField.field.locator(".hint")).toBeHidden());
Then("the form field control is valid", async ({ formField }) =>
  expect(formField.control).not.toHaveAttribute("aria-invalid", "true"),
);
Then("the form field error is hidden", async ({ formField }) => expect(formField.field.locator(".error")).toBeHidden());

Given("a required form field without an error message", ({ formField }) => {
  formField.html = formField.markup("Required field", 'hide-subscript="never"', "required");
});
Then("the native validation message is visible and describes the control", async ({ formField }) => {
  formField.nativeValidationMessage = await formField.control.evaluate(
    (element: HTMLInputElement) => element.validationMessage,
  );
  expect(formField.nativeValidationMessage).not.toBe("");
  await expect(formField.field.locator(".error")).toBeVisible();
  await expect(formField.field.locator(".error")).toHaveText(formField.nativeValidationMessage);
  await expect(formField.control).toHaveAccessibleDescription(formField.nativeValidationMessage);
});
Then("the native validation message no longer describes the control", async ({ formField }) =>
  expect(formField.control).not.toHaveAccessibleDescription(formField.nativeValidationMessage),
);

Given("a form field with a manually forced error", ({ formField }) => {
  formField.html = formField.markup(
    "Reference",
    'error hide-subscript="never"',
    "",
    '<span slot="error">Reference is invalid</span>',
  );
});
Then("the form field control fails native validity", async ({ formField }) =>
  expect(await formField.control.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(false),
);
When("the application clears the form field error", async ({ formField }) =>
  formField.field.evaluate((element) => element.removeAttribute("error")),
);
Then("the form field control passes native validity", async ({ formField }) =>
  expect(await formField.control.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(true),
);

Given("a form field with an error message", ({ formField }) => {
  formField.html = formField.markup(
    "Reference",
    'hide-subscript="never"',
    "",
    '<span slot="error">Reference is invalid</span>',
  );
});
When("the application forces a form field error", async ({ formField }) =>
  formField.field.evaluate((element) => element.setAttribute("error", "")),
);
Then("the form field native validation message is {string}", async ({ formField }, message: string) =>
  expect.poll(() => formField.control.evaluate((element: HTMLInputElement) => element.validationMessage)).toBe(message),
);
When("the application sets the control's custom validity to {string}", async ({ formField }, message: string) =>
  formField.control.evaluate((element: HTMLInputElement, text) => element.setCustomValidity(text), message),
);
When("the application changes the form field hint text node to {string}", async ({ formField }, hint: string) =>
  formField.field.locator('[slot="hint"]').evaluate((element, text) => {
    if (!element.firstChild) throw new Error("Missing hint text node");
    element.firstChild.nodeValue = text;
  }, hint),
);

Given("a form field without a hint", ({ formField }) => {
  formField.html = formField.markup("Name", 'hide-subscript="never"');
});
When("the application adds a(n) {string} slot with text {string}", async ({ formField }, slot: string, text: string) =>
  formField.field.evaluate(
    (element, options) => {
      if (options.slot !== "hint" && options.slot !== "error")
        throw new Error(`Unknown subscript slot: ${options.slot}`);
      const content = document.createElement("span");
      content.slot = options.slot;
      content.textContent = options.text;
      element.append(content);
    },
    { slot, text },
  ),
);
Then("the form field hint displays {string}", async ({ formField }, text: string) => {
  await expect(formField.field.locator(".hint")).toBeVisible();
  await expect(formField.field.locator('[slot="hint"]')).toBeVisible();
  await expect(formField.field.locator('[slot="hint"]')).toHaveText(text);
});
When(
  "the application replaces the {string} slot with text {string}",
  async ({ formField }, slot: string, text: string) =>
    formField.field.locator(`[slot="${slot}"]`).evaluate(
      (element, options) => {
        const content = document.createElement("span");
        content.slot = options.slot;
        content.textContent = options.text;
        element.replaceWith(content);
      },
      { slot, text },
    ),
);
When("the application removes the {string} slot", async ({ formField }, slot: string) =>
  formField.field.locator(`[slot="${slot}"]`).evaluate((element) => element.remove()),
);
Then("the form field error displays {string}", async ({ formField }, text: string) => {
  await expect(formField.field.locator(".error")).toBeVisible();
  await expect(formField.field.locator('[slot="error"]')).toBeVisible();
  await expect(formField.field.locator('[slot="error"]')).toHaveText(text);
});
When("the application changes the form field error text node to {string}", async ({ formField }, error: string) =>
  formField.field.locator('[slot="error"]').evaluate((element, text) => {
    if (!element.firstChild) throw new Error("Missing error text node");
    element.firstChild.nodeValue = text;
  }, error),
);
Given("an invalid and a valid form field with the same error text", ({ formField }) => {
  formField.html = `${formField.markup("First", 'error hide-subscript="never"', "", '<span slot="error">Shared error</span>')}
    <m3e-form-field id="valid-field"><input aria-label="Second"><span slot="error">Shared error</span></m3e-form-field>`;
});
When("the application removes the valid form field", async ({ page }) =>
  page.locator("#valid-field").evaluate((element) => element.remove()),
);

Given("a required form field with identical hint and error text", ({ formField }) => {
  formField.html = formField.markup(
    "Required field",
    'hide-subscript="never"',
    "required",
    '<span slot="hint">Shared guidance</span><span slot="error">Shared guidance</span>',
  );
});

Given("a required form field in a form", ({ formField }) => {
  formField.html = `<form id="form">${formField.requiredMarkup('hide-subscript="never"')}</form>`;
});
When("the application resets the form", async ({ page }) =>
  page.locator("#form").evaluate((form: HTMLFormElement) => form.reset()),
);

Given("a required form field", ({ formField }) => {
  formField.html = formField.markup("Name", "", "required");
});
Then("the form field is marked required", async ({ formField }) =>
  expect.poll(() => formField.state("required")).toBe(true),
);
Then("the required marker is visible and hidden from assistive technology", async ({ formField }) => {
  await expect(formField.field.locator(".required-marker")).toBeVisible();
  await expect(formField.field.locator(".required-marker")).toHaveAttribute("aria-hidden", "true");
});

Given("a required form field with the required marker hidden", ({ formField }) => {
  formField.html = formField.markup("Name", "hide-required-marker", "required");
});
Then("the form field has no required marker", async ({ formField }) =>
  expect(formField.field.locator(".required-marker")).toHaveCount(0),
);
Then("the form field control is required", async ({ formField }) =>
  expect(formField.control).toHaveAttribute("required", ""),
);

Given("an optional form field", ({ formField }) => {
  formField.html = formField.markup("Name");
});
Then("the form field is not marked required", async ({ formField }) =>
  expect.poll(() => formField.state("required")).toBe(false),
);
When("the application makes the form field control required", async ({ formField }) =>
  formField.control.evaluate((element: HTMLInputElement) => {
    element.required = true;
  }),
);
When("the application makes the form field control optional", async ({ formField }) =>
  formField.control.evaluate((element: HTMLInputElement) => {
    element.required = false;
  }),
);
When("the application replaces the form field control", async ({ formField }) =>
  formField.control.evaluate((element) => {
    const destination = document.querySelector("#removed-controls");
    if (!destination) throw new Error("Missing removed control destination");
    const replacement = document.createElement("input");
    replacement.id = "field-control";
    element.replaceWith(replacement);
    element.id = "old-control";
    destination.append(element);
  }),
);
Then("the removed form field control is not described by {string}", async ({ page }, text: string) =>
  expect(page.locator("#old-control")).not.toHaveAccessibleDescription(new RegExp(text)),
);
Then("the new form field control is focused", async ({ formField }) => expect(formField.control).toBeFocused());
When("the application moves the form field into a shadow root", async ({ formField, page }) => {
  await page.evaluate(() => {
    const host = document.createElement("div");
    host.id = "field-shadow-host";
    host.attachShadow({ mode: "open" });
    document.body.append(host);
  });
  await formField.field.evaluate((element) => {
    const root = document.querySelector("#field-shadow-host")?.shadowRoot;
    if (!root) throw new Error("Missing form field shadow root");
    root.append(element);
  });
});
Then("the original document has no form field description", async ({ page }) =>
  expect(page.locator("body > .m3e-describedby-message-container")).toHaveCount(0),
);
Then("the original shadow root has no form field description", async ({ page }) =>
  expect
    .poll(() =>
      page
        .locator("#field-shadow-host")
        .evaluate((host) => host.shadowRoot?.querySelectorAll(".m3e-describedby-message-container").length),
    )
    .toBe(0),
);

Given("a required form field in two forms", ({ formField }) => {
  formField.html = `<form id="first-form">${formField.requiredMarkup('hide-subscript="never"')}</form>
    <form id="second-form"></form>`;
});
When("the application moves the form field to the second form", async ({ formField }) =>
  formField.field.evaluate((element) => {
    const form = document.querySelector("#second-form");
    if (!form) throw new Error("Missing second form");
    form.append(element);
  }),
);
When("the application resets the first form", async ({ page }) =>
  page.locator("#first-form").evaluate(async (form: HTMLFormElement) => {
    form.reset();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }),
);
When("the application resets the second form", async ({ page }) =>
  page.locator("#second-form").evaluate((form: HTMLFormElement) => form.reset()),
);
