import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eDateInputElement } from "@m3e/web/date-input";

import { expect, test as componentTest } from "../fixtures";
import { DateInputHarness } from "./date-input.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ dateInput: DateInputHarness }>({
  dateInput: async ({ page, render }, use) => use(new DateInputHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);
const preset = "2024-01-15T10:30:00.000Z";
const timeInput = (attributes = "") =>
  `<m3e-date-input type="time" time-format="24" show-seconds value="${preset}" ${attributes}></m3e-date-input>`;

Given("a date input with custom date segment labels", ({ dateInput }) => {
  dateInput.markup = `<m3e-date-input month-label="Month of year" day-label="Day of month"
    year-label="Calendar year"></m3e-date-input>`;
});
When("the date input renders", async ({ dateInput }) => dateInput.show());
Then("the date input group is visible", async ({ page }) => expect(page.getByRole("group")).toBeVisible());
Then("the date segment {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("spinbutton", { name, exact: true })).toBeVisible(),
);

Given("date, 24-hour time with seconds, and 24-hour datetime inputs", ({ dateInput }) => {
  dateInput.markup = `<m3e-date-input type="date"></m3e-date-input>
    <m3e-date-input type="time" time-format="24" show-seconds></m3e-date-input>
    <m3e-date-input type="datetime" time-format="24"></m3e-date-input>`;
});
Then("the number of {string} date segments is {int}", async ({ page }, name: string, count: number) =>
  expect(page.getByRole("spinbutton", { name, exact: true })).toHaveCount(count),
);

Given("a date input with an unsupported type", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input type="invalid"></m3e-date-input>';
});
Then("the effective date input type is {string}", async ({ dateInput }, type: string) =>
  expect.poll(() => dateInput.input.evaluate((input: M3eDateInputElement) => input.type)).toBe(type),
);

Given("a date input with local date {string}", ({ dateInput }, value: string) => {
  dateInput.markup = `<m3e-date-input value="${value}"></m3e-date-input>`;
});
Then(
  "date segment {string} exposes value {string} from {string} to {string}",
  async ({ dateInput }, name: string, value: string, min: string, max: string) => {
    const segment = dateInput.segment(name);
    await expect(segment).toHaveAttribute("aria-valuenow", value);
    await expect(segment).toHaveAttribute("aria-valuemin", min);
    await expect(segment).toHaveAttribute("aria-valuemax", max);
  },
);
Then("date segment {string} exposes value text {string}", async ({ dateInput }, name: string, value: string) =>
  expect(dateInput.segment(name)).toHaveAttribute("aria-valuetext", value),
);

Given("a 12-hour time input with a local afternoon value", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input type="time" time-format="12" value="2024-01-15T15:30:00"></m3e-date-input>';
});
When("the user focuses the {string} date segment", async ({ dateInput }, name: string) =>
  dateInput.segment(name).focus(),
);
When(
  "the application sets date input attribute {string} to {string}",
  async ({ dateInput }, name: string, value: string) =>
    dateInput.input.evaluate((input, attribute) => input.setAttribute(attribute.name, attribute.value), {
      name,
      value,
    }),
);
Then("the {string} date segment has focus", async ({ dateInput }, name: string) =>
  expect(dateInput.segment(name)).toBeFocused(),
);
When("the application removes date input attribute {string}", async ({ dateInput }, name: string) =>
  dateInput.input.evaluate((input, attribute) => input.removeAttribute(attribute), name),
);
Then("the date input value has not changed", async ({ dateInput }) =>
  expect.poll(() => dateInput.value()).toBe(dateInput.initialValue),
);

Given("a datetime input with a local afternoon value", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input type="datetime" time-format="12" value="2024-01-15T15:30:00"></m3e-date-input>';
});

Given("a 24-hour time input with seconds and a preset value", ({ dateInput }) => {
  dateInput.markup = timeInput();
});
When("the application observes date input events", async ({ dateInput }) => dateInput.recordEvents());
When("the user presses {string} in the date input", async ({ page }, key: string) => page.keyboard.press(key));
Then("the hour segment has increased by one", async ({ dateInput }) =>
  expect(dateInput.segment("Hour")).toHaveAttribute("aria-valuenow", `${(dateInput.initialHour + 1) % 24}`),
);
When("the user leaves the date input", async ({ page }) => page.locator("body").click());
Then("the date input value has increased by one hour", async ({ dateInput }) =>
  expect.poll(() => dateInput.value()).toBe(dateInput.nextHourValue),
);
Then("the date input events are {string}", async ({ dateInput }, events: string) =>
  expect(dateInput.input).toHaveAttribute("data-events", events),
);

Given("a read-only 24-hour time input with seconds and a preset value", ({ dateInput }) => {
  dateInput.markup = timeInput("readonly");
});
Then("the {string} date segment is read-only", async ({ dateInput }, name: string) =>
  expect(dateInput.segment(name)).toHaveAttribute("aria-readonly", "true"),
);
Then("the hour segment has not changed", async ({ dateInput }) =>
  expect(dateInput.segment("Hour")).toHaveAttribute("aria-valuenow", `${dateInput.initialHour}`),
);
Then("the date input value is {string}", async ({ dateInput }, value: string) =>
  expect.poll(() => dateInput.value()).toBe(value),
);

Given("a disabled 24-hour time input with seconds and a preset value", ({ dateInput }) => {
  dateInput.markup = `${timeInput("disabled")}<button>Continue</button>`;
});
Then("the {string} date segment is disabled and not keyboard focusable", async ({ dateInput }, name: string) => {
  await expect(dateInput.segment(name)).toHaveAttribute("aria-disabled", "true");
  await expect(dateInput.segment(name)).not.toHaveAttribute("tabindex");
  await expect(dateInput.segment(name)).not.toHaveAttribute("contenteditable");
});
When("the user tabs past the date input", async ({ page }) => page.keyboard.press("Tab"));
Then("the control after the date input has focus", async ({ page }) =>
  expect(page.getByRole("button", { name: "Continue" })).toBeFocused(),
);

Given("a 24-hour time input with a local afternoon value", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input type="time" time-format="24" value="2024-01-15T15:30:00"></m3e-date-input>';
});

Given("a 12-hour time input with a local morning value", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input type="time" time-format="12" value="2024-01-15T10:30:00"></m3e-date-input>';
});
Then("the date input local hour is {int}", async ({ dateInput }, hour: number) =>
  expect.poll(() => dateInput.input.evaluate((input: M3eDateInputElement) => input.value?.getHours())).toBe(hour),
);
When("the application cancels date input beforeinput", async ({ dateInput }) => dateInput.recordEvents(true));

Given("a 24-hour time input with local morning value and seconds", ({ dateInput }) => {
  dateInput.markup = `<m3e-date-input type="time" time-format="24" show-seconds
    value="2024-01-15T10:30:00"></m3e-date-input>`;
});
When("the user types {string} in the date input", async ({ page }, value: string) => page.keyboard.type(value));

Given("a date input named {string} with a preset value in a form", ({ dateInput }, name: string) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input name="${name}" value="${preset}"></m3e-date-input>
    <button type="reset">Reset</button></form>`;
});
Then("the schedule form includes {string} with value {string}", async ({ dateInput }, name: string, value: string) =>
  expect.poll(() => dateInput.formValues()).toEqual([[name, value]]),
);
Then("the schedule form has no values", async ({ dateInput }) => expect.poll(() => dateInput.formValues()).toEqual([]));
When("the application sets the date input value to {string}", async ({ dateInput }, value: string) =>
  dateInput.input.evaluate((input, date) => input.setAttribute("value", date), value),
);
When("the user resets the schedule form", async ({ page }) => page.getByRole("button", { name: "Reset" }).click());

Given("a required empty date input in a form", ({ dateInput }) => {
  dateInput.markup = '<form id="schedule"><m3e-date-input name="start" required></m3e-date-input></form>';
});
Then("the date input reports a missing value", async ({ dateInput }) =>
  expect.poll(async () => (await dateInput.validity()).valueMissing).toBe(true),
);
Then("the date input is valid", async ({ dateInput }) =>
  expect.poll(async () => (await dateInput.validity()).valid).toBe(true),
);

Given("a date input with date limits in a form", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input name="start" value="2024-01-15"
    min-date="2024-02-01" max-date="2024-03-31"></m3e-date-input></form>`;
});
Then("the date input reports a range underflow", async ({ dateInput }) =>
  expect.poll(async () => (await dateInput.validity()).rangeUnderflow).toBe(true),
);
Then("the date input reports a range overflow", async ({ dateInput }) =>
  expect.poll(async () => (await dateInput.validity()).rangeOverflow).toBe(true),
);
When("the application moves the date input to a new DOM parent", async ({ dateInput }) => dateInput.moveToNewParent());
Then("the date input is in the new DOM parent", async ({ page }) =>
  expect(page.locator("#date-input-parent-2 > m3e-date-input")).toBeVisible(),
);

Given("a date input named {string} with a destination form", ({ dateInput }, name: string) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input name="${name}" value="${preset}"></m3e-date-input></form>
    <form id="destination"></form>`;
});
When("the application moves the date input to the destination form", async ({ dateInput }) =>
  dateInput.moveToDestinationForm(),
);
Then("the destination form includes {string} with value {string}", async ({ dateInput }, name: string, value: string) =>
  expect.poll(() => dateInput.formValues("destination")).toEqual([[name, value]]),
);

Given("a date input with fractional seconds", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input value="2024-01-15T10:30:45.123Z"></m3e-date-input>';
});

Given("a required date input with local date {string} in a form", ({ dateInput }, value: string) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input name="start" required value="${value}"></m3e-date-input></form>`;
});
Then("the {string} date segment has no value", async ({ dateInput }, name: string) =>
  expect(dateInput.segment(name)).not.toHaveAttribute("aria-valuenow"),
);
Then("the date input has no value", async ({ dateInput }) => expect.poll(() => dateInput.value()).toBeNull());
Then("the date input reports an incomplete value", async ({ dateInput }) =>
  expect.poll(async () => (await dateInput.validity()).typeMismatch).toBe(true),
);
Then("the date input local date is {string}", async ({ dateInput }, expected: string) =>
  expect
    .poll(() =>
      dateInput.input.evaluate((input: M3eDateInputElement) => {
        if (!input.value) return null;
        const date = input.value;
        return [
          date.getFullYear(),
          `${date.getMonth() + 1}`.padStart(2, "0"),
          `${date.getDate()}`.padStart(2, "0"),
        ].join("-");
      }),
    )
    .toBe(expected),
);

Given("a 12-hour time input set to local noon", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input type="time" time-format="12" value="2024-01-15T12:45:00"></m3e-date-input>';
});

Given("a 24-hour time input set to local 22:30", ({ dateInput }) => {
  dateInput.markup = '<m3e-date-input type="time" time-format="24" value="2024-01-15T22:30:00"></m3e-date-input>';
});
When("the user scrolls down over the {string} date segment", async ({ dateInput, page }, name: string) => {
  await dateInput.segment(name).hover();
  await page.mouse.wheel(0, 100);
});
When("the user scrolls up over the {string} date segment", async ({ dateInput, page }, name: string) => {
  await dateInput.segment(name).hover();
  await page.mouse.wheel(0, -100);
});

Given("a 24-hour time input with time limits in a form", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input type="time" time-format="24"
    value="2024-01-15T08:14:00" min-time="8:15 AM" max-time="5:30 PM"></m3e-date-input></form>`;
});

Given("a date input with a blackout date in a form", ({ dateInput }) => {
  dateInput.markup = '<form id="schedule"><m3e-date-input value="2024-02-29"></m3e-date-input></form>';
});
When("the application installs the blackout date predicate", async ({ dateInput }) =>
  dateInput.input.evaluate((input: M3eDateInputElement) => {
    input.blackoutDates = (date) => date.getMonth() === 1 && date.getDate() === 29;
  }),
);
Then("the date input reports a blackout error", async ({ dateInput }) =>
  expect.poll(async () => (await dateInput.validity()).customError).toBe(true),
);

Given("a 24-hour time input with a blackout time in a form", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input type="time" time-format="24"
    value="2024-01-15T07:30:00"></m3e-date-input></form>`;
});
When("the application installs the blackout time predicate", async ({ dateInput }) =>
  dateInput.input.evaluate((input: M3eDateInputElement) => {
    input.blackoutTimes = (time) => time.hour < 8;
  }),
);

Given("a datetime input with blackout constraints in a form", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input type="datetime" time-format="24"
    value="2024-02-29T10:30:00"></m3e-date-input></form>`;
});

Given("a required empty date input with a submit button", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input name="start" required></m3e-date-input>
    <button type="submit">Submit</button></form>`;
});
When("the application observes schedule form submissions and invalid events", async ({ dateInput, page }) => {
  await dateInput.input.evaluate((input) => {
    input.setAttribute("data-invalid-count", "0");
    input.addEventListener("invalid", () => {
      input.setAttribute("data-invalid-count", String(Number(input.getAttribute("data-invalid-count")) + 1));
    });
  });
  await page.locator("#schedule").evaluate((form: HTMLFormElement) => {
    form.setAttribute("data-submit-count", "0");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.setAttribute("data-submit-count", String(Number(form.getAttribute("data-submit-count")) + 1));
      form.setAttribute("data-submitted-values", JSON.stringify(Array.from(new FormData(form).entries())));
    });
  });
});
When("the user submits the schedule form", async ({ page }) => page.getByRole("button", { name: "Submit" }).click());
Then("the schedule form has {int} submissions", async ({ page }, count: number) =>
  expect(page.locator("#schedule")).toHaveAttribute("data-submit-count", String(count)),
);
Then("the date input has {int} invalid event", async ({ dateInput }, count: number) =>
  expect(dateInput.input).toHaveAttribute("data-invalid-count", String(count)),
);
Then(
  "the submitted schedule form contains the date input value as {string}",
  async ({ dateInput, page }, name: string) => {
    const value = await dateInput.value();
    expect(value).not.toBeNull();
    await expect(page.locator("#schedule")).toHaveAttribute("data-submitted-values", JSON.stringify([[name, value]]));
  },
);

Given("a date input with a preset value inside a disabled fieldset", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><fieldset disabled>
    <m3e-date-input name="start" value="${preset}"></m3e-date-input></fieldset></form>`;
});
When("the application enables the date input fieldset", async ({ page }) =>
  page.locator("#schedule fieldset").evaluate((fieldset: HTMLFieldSetElement) => {
    fieldset.disabled = false;
  }),
);
Then("the {string} date segment is keyboard focusable", async ({ dateInput }, name: string) =>
  expect(dateInput.segment(name)).toHaveAttribute("tabindex", "0"),
);
Then("the date input value has changed", async ({ dateInput }) =>
  expect.poll(() => dateInput.value()).not.toBe(dateInput.initialValue),
);

Given("a required date input with a local date and a reset button", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input name="start" required value="2024-02-29"></m3e-date-input>
    <button type="reset">Reset</button></form>`;
});
Then("the schedule form contains the date input value as {string}", async ({ dateInput }, name: string) =>
  expect.poll(async () => dateInput.formValues()).toEqual([[name, dateInput.initialValue]]),
);
Then("the date input is valid and untouched", async ({ dateInput }) => {
  await expect.poll(() => dateInput.input.evaluate((input: M3eDateInputElement) => input.untouched)).toBe(true);
  await expect.poll(async () => (await dateInput.validity()).valid).toBe(true);
});

Given("a read-only date input with a preset value in a form", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input name="start" value="${preset}" readonly></m3e-date-input></form>`;
});

Given("a date input associated with an external schedule form", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"></form>
    <m3e-date-input form="schedule" name="start" value="${preset}"></m3e-date-input>`;
});
Then("the date input belongs to the schedule form", async ({ dateInput }) =>
  expect.poll(() => dateInput.input.evaluate((input: M3eDateInputElement) => input.form?.id)).toBe("schedule"),
);

Given("a required date input in a labeled form field with a hint and error", ({ dateInput }) => {
  dateInput.markup = `<m3e-form-field hide-subscript="never">
    <label slot="label" for="appointment">Appointment date</label>
    <m3e-date-input id="appointment" required></m3e-date-input>
    <span slot="hint">Enter a date</span>
    <span slot="error">A date is required</span>
  </m3e-form-field>`;
});
Then("the date input has accessible name {string}", async ({ dateInput }, name: string) =>
  expect.poll(() => dateInput.nativeAccessibleName()).toBe(name),
);
Then("the date input is described by {string}", async ({ dateInput }, description: string) =>
  expect(dateInput.input).toHaveAccessibleDescription(new RegExp(description)),
);
Then("the date input is exposed as invalid", async ({ dateInput }) =>
  expect(dateInput.input).toHaveAttribute("aria-invalid", "true"),
);
Then("the date input form field shows the error", async ({ page }) =>
  expect(page.locator('m3e-form-field [slot="error"]')).toBeVisible(),
);

Given("a datetime input with date string {string}", ({ dateInput }, value: string) => {
  dateInput.markup = `<m3e-date-input type="datetime" time-format="24" show-seconds value="${value}"></m3e-date-input>`;
});
Then("the date input local time is {string}", async ({ dateInput }, expected: string) =>
  expect
    .poll(() =>
      dateInput.input.evaluate((input: M3eDateInputElement) => {
        if (!input.value) return null;
        const date = input.value;
        const clock = [date.getHours(), date.getMinutes(), date.getSeconds()]
          .map((part) => String(part).padStart(2, "0"))
          .join(":");
        return `${clock}.${String(date.getMilliseconds()).padStart(3, "0")}`;
      }),
    )
    .toBe(expected),
);

Given(
  "a required {string} input with seconds in {string} format in a form",
  ({ dateInput }, type: string, format: string) => {
    dateInput.markup = `<form id="schedule"><m3e-date-input name="start" required type="${type}"
    time-format="${format}" show-seconds value="2024-01-15T10:30:45"></m3e-date-input></form>`;
  },
);

Given("a 24-hour time input with second-level limits in a form", ({ dateInput }) => {
  dateInput.markup = `<form id="schedule"><m3e-date-input type="time" time-format="24" show-seconds
    value="2024-01-15T08:15:29" min-time="08:15:30" max-time="17:30:45"></m3e-date-input></form>`;
});
