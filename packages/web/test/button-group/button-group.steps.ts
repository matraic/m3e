import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ButtonGroupHarness } from "./button-group.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ buttonGroup: ButtonGroupHarness }>({
  buttonGroup: async ({ page, render }, use) => use(new ButtonGroupHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a standard group with Save and Cancel buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group aria-label="Actions">
      <m3e-button>Save</m3e-button>
      <m3e-button>Cancel</m3e-button>
    </m3e-button-group>
  `;
});
When("the group renders", async ({ buttonGroup }) => {
  if (buttonGroup.motion && buttonGroup.motion !== "reduced") {
    buttonGroup.motionTimings = await buttonGroup.readMotionTimings(buttonGroup.motion);
  } else if (buttonGroup.motion === "reduced") {
    await buttonGroup.renderWithReducedMotion();
  } else {
    await buttonGroup.render();
  }
});
Then("a group named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("group", { name })).toBeVisible(),
);
Then("the Save and Cancel buttons are visible", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
});

Given("a single-select group with Day, Week, and Month toggle buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group aria-label="Period">
      <m3e-button toggle>Day</m3e-button>
      <m3e-button toggle>Week</m3e-button>
      <m3e-button toggle>Month</m3e-button>
    </m3e-button-group>
  `;
});
Then("a radiogroup named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("radiogroup", { name })).toBeVisible(),
);
Then("its toggle buttons have radio roles", async ({ page }) => {
  await expect(page.getByRole("radio", { name: "Day" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Week" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Month" })).toBeVisible();
});
When("the user selects {string}", async ({ buttonGroup }, name: string) => buttonGroup.button(name).click());
Then("{string} is selected", async ({ buttonGroup }, name: string) => {
  await expect(buttonGroup.radio(name)).toHaveAttribute("selected", "");
  await expect(buttonGroup.radio(name)).toHaveAttribute("aria-checked", "true");
});
Then("{string} is not selected", async ({ buttonGroup }, name: string) => {
  await expect(buttonGroup.radio(name)).not.toHaveAttribute("selected");
  await expect(buttonGroup.radio(name)).toHaveAttribute("aria-checked", "false");
});
When("the user tabs into the Period options", async ({ page }) => page.keyboard.press("Tab"));
Then("the {string} option has keyboard focus", async ({ page }, name: string) =>
  expect(page.getByRole("radio", { name, exact: true })).toBeFocused(),
);
When("the user tabs to the next Period option", async ({ page }) => page.keyboard.press("Tab"));
When("the user presses Space on the focused Period option", async ({ page }) => page.keyboard.press("Space"));

Given("a single-select group with Bold and Italic icon options", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group aria-label="Icon style">
      <m3e-icon-button aria-label="Bold" toggle><m3e-icon name="format_bold"></m3e-icon></m3e-icon-button>
      <m3e-icon-button aria-label="Italic" toggle><m3e-icon name="format_italic"></m3e-icon></m3e-icon-button>
    </m3e-button-group>
  `;
});
When("the user selects icon option {string}", async ({ page }, name: string) =>
  page.getByRole("radio", { name, exact: true }).click(),
);

When("the user detaches and reinserts the Period group", async ({ page }) => {
  await page.locator('m3e-button-group[aria-label="Period"]').evaluate((group) => {
    const parent = group.parentElement;
    if (!parent) throw new Error("Period group has no parent element.");
    group.remove();
    parent.append(group);
  });
});

Given("a source radio group and a destination multi-select group", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <div id="group-host">
      <m3e-button-group aria-label="Source">
        <m3e-button toggle>Alpha</m3e-button>
        <m3e-button toggle>Beta</m3e-button>
      </m3e-button-group>
      <m3e-button-group aria-label="Destination" multi>
        <m3e-button toggle>Gamma</m3e-button>
      </m3e-button-group>
    </div>
  `;
});
When("the user moves {string} to the destination group", async ({ buttonGroup, page }, name: string) => {
  await page
    .locator('m3e-button-group[aria-label="Destination"]')
    .evaluate((destination, button) => destination.append(button), await buttonGroup.button(name).elementHandle());
});
Then("{string} is a button in the destination group", async ({ page }, name: string) =>
  expect(page.getByRole("group", { name: "Destination" }).getByRole("button", { name, exact: true })).toBeVisible(),
);
Then("{string} is pressed", async ({ buttonGroup }, name: string) =>
  expect(buttonGroup.button(name)).toHaveAttribute("aria-pressed", "true"),
);

Given("a multi-select group with Bold and Italic toggle buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group aria-label="Formatting" multi>
      <m3e-button toggle>Bold</m3e-button>
      <m3e-button toggle>Italic</m3e-button>
    </m3e-button-group>
  `;
});

Given("a multi-select group with Bold and Italic icon buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group aria-label="Icon formatting" multi>
      <m3e-icon-button aria-label="Bold" toggle><m3e-icon name="format_bold"></m3e-icon></m3e-icon-button>
      <m3e-icon-button aria-label="Italic" toggle><m3e-icon name="format_italic"></m3e-icon></m3e-icon-button>
    </m3e-button-group>
  `;
});
When("the user activates both icon options", async ({ page }) => {
  await page.getByRole("button", { name: "Bold", exact: true }).click();
  await page.getByRole("button", { name: "Italic", exact: true }).click();
});
Then("both icon options are pressed", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Bold", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Italic", exact: true })).toHaveAttribute("aria-pressed", "true");
});

Given("an empty labeled button group", ({ buttonGroup }) => {
  buttonGroup.markup = '<m3e-button-group aria-label="Dynamic"></m3e-button-group>';
});
When("a toggle option is added to the group", async ({ buttonGroup }) => {
  await buttonGroup.group.evaluate((group) => {
    const option = document.createElement("m3e-button");
    option.toggleAttribute("toggle", true);
    option.textContent = "Pin";
    group.append(option);
  });
});
Then("the Pin option has a radio role", async ({ page }) =>
  expect(page.getByRole("radio", { name: "Pin", exact: true })).toBeVisible(),
);

Given("a button group with variant {string} and size {string}", ({ buttonGroup }, variant: string, size: string) => {
  buttonGroup.markup = `<m3e-button-group variant="${variant}" size="${size}"><m3e-button>One</m3e-button></m3e-button-group>`;
});
Then("the group reflects variant {string}", async ({ buttonGroup }, value: string) =>
  expect(buttonGroup.group).toHaveAttribute("variant", value),
);
Then("the group reflects size {string}", async ({ buttonGroup }, value: string) =>
  expect(buttonGroup.group).toHaveAttribute("size", value),
);

Given("a button group with an unknown variant and size", ({ buttonGroup }) => {
  buttonGroup.markup =
    '<m3e-button-group variant="unsupported" size="unsupported"><m3e-button>One</m3e-button></m3e-button-group>';
});

Given("a standard group using the {string} motion scheme", ({ buttonGroup }, motion: string) => {
  buttonGroup.motion = motion;
});
Then("each button and its label wrapper use the fast spatial spring", async ({ buttonGroup }) => {
  const timings = buttonGroup.motionTimings;
  if (!timings) throw new Error("Motion timings have not been collected.");
  expect(timings.buttons).toEqual(Array(4).fill(timings.spring));
});

Given("an expressive group with three buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-theme motion="expressive">
      <m3e-button-group>
        <m3e-button>One</m3e-button>
        <m3e-button>Two</m3e-button>
        <m3e-button>Three</m3e-button>
      </m3e-button-group>
    </m3e-theme>
  `;
});
When("the user presses the middle button", async ({ buttonGroup }) => {
  buttonGroup.widthPeaks = await buttonGroup.pressMiddleButtonForWidthPeaks();
});
Then("every button's width transition overshoots", async ({ buttonGroup }) => {
  const peaks = buttonGroup.widthPeaks;
  if (!peaks) throw new Error("Button width transition peaks have not been collected.");
  for (const peak of peaks) expect(peak).toBeGreaterThan(1.05);
});

Given("an expressive group with Start, Directions, and Share buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-theme motion="expressive">
      <m3e-button-group>
        <m3e-button>Start</m3e-button>
        <m3e-button>Directions</m3e-button>
        <m3e-button>Share</m3e-button>
      </m3e-button-group>
    </m3e-theme>
  `;
});
When(
  "the user presses and releases {string}",
  async ({ buttonGroup }, name: string) => (buttonGroup.labelOverflow = await buttonGroup.releaseLabelOverflow(name)),
);
Then("its label does not overflow during the return spring", async ({ buttonGroup }) =>
  expect(buttonGroup.labelOverflow).toBeLessThan(0.01),
);

Given("a standard group with a long first label and Day and Week buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group>
      <m3e-button>Start turn-by-turn navigation</m3e-button>
      <m3e-button>Day</m3e-button>
      <m3e-button>Week</m3e-button>
    </m3e-button-group>
  `;
});
When("the user holds the first button down", async ({ buttonGroup }) => {
  buttonGroup.neighborMeasurements = await buttonGroup.holdFirstButton();
});
Then("the Day button shrinks by no more than its end padding", async ({ buttonGroup }) => {
  const { rest, held } = buttonGroup.neighborMeasurements!;
  expect(rest[1].width - held[1].width).toBeCloseTo(rest[1].endPadding, 0);
});
Then("the pressed button grows by the same amount", async ({ buttonGroup }) => {
  const { rest, held } = buttonGroup.neighborMeasurements!;
  expect(held[0].width - rest[0].width).toBeCloseTo(rest[1].width - held[1].width, 0);
});
Then("the Week button keeps its width", async ({ buttonGroup }) => {
  const { rest, held } = buttonGroup.neighborMeasurements!;
  expect(held[2].width).toBeCloseTo(rest[2].width, 0);
});
Then("the pressed and adjacent labels clip instead of ellipsizing", async ({ buttonGroup }) => {
  const { held } = buttonGroup.neighborMeasurements!;
  expect(held[0].textOverflow).toBe("clip");
  expect(held[1].textOverflow).toBe("clip");
  expect(held[2].textOverflow).toBe("ellipsis");
});
Then("the pressed and adjacent labels stay clipped during the return spring", async ({ buttonGroup }) => {
  const { released } = buttonGroup.neighborMeasurements!;
  expect(released[0].textOverflow).toBe("clip");
  expect(released[1].textOverflow).toBe("clip");
  expect(released[2].textOverflow).toBe("ellipsis");
});

Given("a connected group with Start, Directions, and Share toggle buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group aria-label="Navigation" variant="connected">
      <m3e-button toggle>Start</m3e-button>
      <m3e-button toggle>Directions</m3e-button>
      <m3e-button toggle>Share</m3e-button>
    </m3e-button-group>
  `;
});
When("the user holds connected button {string}", async ({ buttonGroup }, name: string) => {
  buttonGroup.connectedWidthChange = await buttonGroup.pressConnectedButton(name);
});
Then("no connected group button changes width", async ({ buttonGroup }) => {
  expect(buttonGroup.connectedWidthChange).toBeLessThan(0.5);
});
When(
  "the user presses the buttons in quick succession",
  async ({ buttonGroup }) => (buttonGroup.quickPressDeviation = await buttonGroup.quickSuccessivePressDeviation()),
);
Then("every button returns to its resting width", async ({ buttonGroup }) => {
  expect(buttonGroup.quickPressDeviation).toBeLessThan(0.5);
});

Given("reduced motion is preferred", ({ buttonGroup }) => {
  buttonGroup.motion = "reduced";
});
Given("a standard group with One and Two buttons", ({ buttonGroup }) => {
  buttonGroup.markup = `
    <m3e-button-group>
      <m3e-button>One</m3e-button>
      <m3e-button>Two</m3e-button>
    </m3e-button-group>
  `;
});
When("the user holds down {string}", async ({ buttonGroup }, name: string) => {
  if (buttonGroup.motion === "reduced") {
    buttonGroup.reducedMotionResult = await buttonGroup.pressWithReducedMotion();
  } else {
    await buttonGroup.pressButton(name);
  }
});
Then("the pressed button grows without running transitions", async ({ buttonGroup }) => {
  const result = buttonGroup.reducedMotionResult;
  if (!result) throw new Error("Reduced-motion press was not recorded.");
  expect(result.pressedWidth).toBeGreaterThan(result.restWidth);
  expect(result.animations).toBe(0);
});
