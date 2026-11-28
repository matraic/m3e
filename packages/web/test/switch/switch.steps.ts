import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eSwitchElement } from "@m3e/web/switch";

import { expect, test as componentTest } from "../fixtures";
import { SwitchHarness } from "./switch.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  switchControl: SwitchHarness;
}>({
  switchControl: async ({ page, render }, use) => use(new SwitchHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a switch wrapped in its Wi-Fi label", ({ switchControl }) => {
  switchControl.markup = '<label>Wi-Fi <m3e-switch aria-label="Wi-Fi"></m3e-switch></label>';
});
When("the switch renders", async ({ switchControl }) => switchControl.show());
Then("a switch named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("switch", { name, exact: true })).toBeVisible(),
);
Then("the switch exposes checked state {string}", async ({ switchControl }, state: string) =>
  expect(switchControl.switch).toHaveAttribute("aria-checked", state),
);
When("the user presses {string} on the switch", async ({ page }, key: string) => page.keyboard.press(key));
Then("the switch has keyboard focus", async ({ switchControl }) => expect(switchControl.switch).toBeFocused());
When("the user clicks the Wi-Fi switch label", async ({ page }) => page.getByText("Wi-Fi", { exact: true }).click());
Then("the switch is checked", async ({ switchControl }) => expect(switchControl.switch).toHaveAttribute("checked", ""));
Then("the switch is unchecked", async ({ switchControl }) =>
  expect(switchControl.switch).not.toHaveAttribute("checked"),
);

Given("an unchecked switch", ({ switchControl }) => {
  switchControl.markup = '<m3e-switch aria-label="Wi-Fi"></m3e-switch>';
});
When("the application observes switch events", async ({ switchControl }) => switchControl.recordEvents());
When("the user clicks the switch", async ({ switchControl }) => switchControl.switch.click());
Then("the switch events are {string}", async ({ switchControl }, events: string) =>
  expect(switchControl.switch).toHaveAttribute("data-events", events),
);
When("the application cancels switch beforeinput", async ({ switchControl }) => switchControl.recordEvents(true));
When("the user focuses the switch", async ({ switchControl }) => switchControl.switch.focus());

Given("a checked switch", ({ switchControl }) => {
  switchControl.markup = '<m3e-switch checked aria-label="Wi-Fi"></m3e-switch>';
});

Given("a disabled switch", ({ switchControl }) => {
  switchControl.markup = '<m3e-switch disabled aria-label="Wi-Fi"></m3e-switch>';
});
Then("the switch exposes disabled state", async ({ switchControl }) =>
  expect(switchControl.switch).toHaveAttribute("aria-disabled", "true"),
);
Then("the switch is not keyboard focusable", async ({ switchControl }) =>
  expect(switchControl.switch).not.toHaveAttribute("tabindex"),
);
When("the application clicks the switch", async ({ switchControl }) =>
  switchControl.switch.evaluate((element: HTMLElement) => element.click()),
);

Given("a switch with a native {string} Wi-Fi label", ({ switchControl }, association: string) => {
  if (association === "wrapping") {
    switchControl.markup = "<label>Wi-Fi <m3e-switch></m3e-switch></label>";
  } else if (association === "explicit") {
    switchControl.markup = '<label for="wifi">Wi-Fi</label><m3e-switch id="wifi"></m3e-switch>';
  } else {
    throw new Error(`Unknown switch label association: ${association}`);
  }
});
Then("the switch has native accessible name {string}", async ({ switchControl }, name: string) =>
  expect.poll(() => switchControl.nativeAccessibleNames()).toEqual([name]),
);

When("the application sets the switch checked property to {string}", async ({ switchControl }, value: string) =>
  switchControl.switch.evaluate((element: M3eSwitchElement, checked) => {
    element.checked = checked;
  }, value === "true"),
);

When("the application enables the switch", async ({ switchControl }) =>
  switchControl.switch.evaluate((element) => element.removeAttribute("disabled")),
);
Then("the switch is keyboard focusable", async ({ switchControl }) =>
  expect(switchControl.switch).toHaveAttribute("tabindex", "0"),
);
Then("the switch is not exposed as disabled", async ({ switchControl }) =>
  expect(switchControl.switch).not.toHaveAttribute("aria-disabled", "true"),
);

Given("forced colors are active for switches", async ({ page }) => page.emulateMedia({ forcedColors: "active" }));
Then(
  "the switch track uses the {string} system color for its {string}",
  async ({ switchControl }, systemColor: string, property: string) => {
    if (property !== "border" && property !== "background") {
      throw new Error(`Unknown switch track property: ${property}`);
    }
    const colors = await switchControl.switch.locator(".track").evaluate(
      (track, input) => {
        const probe = document.createElement("span");
        probe.style.color = input.systemColor;
        document.body.append(probe);
        const expected = getComputedStyle(probe).color;
        probe.remove();
        const style = getComputedStyle(track);
        return { actual: input.property === "border" ? style.borderTopColor : style.backgroundColor, expected };
      },
      { systemColor, property },
    );
    expect(colors.actual).toBe(colors.expected);
  },
);
When("the application disables the switch", async ({ switchControl }) =>
  switchControl.switch.evaluate((element: M3eSwitchElement) => {
    element.disabled = true;
  }),
);

Given("switches with default and invalid icons", ({ switchControl }) => {
  switchControl.markup =
    '<m3e-switch aria-label="a"></m3e-switch><m3e-switch icons="bogus" aria-label="b"></m3e-switch>';
});
Then("the default switch has icons {string}", async ({ switchControl }, icons: string) =>
  expect(await switchControl.icons()).toBe(icons),
);
Then("the invalid switch reflects icons {string}", async ({ switchControl }, icons: string) =>
  expect(switchControl.switch.nth(1)).toHaveAttribute("icons", icons),
);

Given("a switch with icons {string}", ({ switchControl }, icons: string) => {
  switchControl.markup = `<m3e-switch icons="${icons}" aria-label="Wi-Fi"></m3e-switch>`;
});
Then("the switch has icons {string}", async ({ switchControl }, icons: string) =>
  expect(await switchControl.icons()).toBe(icons),
);

Given("switch icon motion is disabled", async ({ page }) => page.emulateMedia({ reducedMotion: "reduce" }));
Then("the visible switch icon is {string}", async ({ switchControl }, expected: string) => {
  for (const icon of ["selected", "unselected"]) {
    const locator = switchControl.switch.locator(`.icon.${icon}`);
    if (expected === icon) {
      await expect(locator).toHaveCSS("display", "block");
      await expect(locator).toHaveCSS("opacity", "1");
    } else {
      await expect
        .poll(() =>
          locator.evaluate((element) => {
            const style = getComputedStyle(element);
            return style.display === "none" || Number(style.opacity) === 0;
          }),
        )
        .toBe(true);
    }
  }
});

Given("a switch named {string} with value {string} in a form", ({ switchControl }, name: string, value: string) => {
  switchControl.markup = `<form id="switch-form"><m3e-switch name="${name}" value="${value}" aria-label="Wi-Fi"></m3e-switch></form>`;
});
Then("the switch form has no values", async ({ switchControl }) =>
  expect.poll(() => switchControl.formValues()).toEqual([]),
);
Then("the switch form includes {string} with value {string}", async ({ switchControl }, name: string, value: string) =>
  expect.poll(() => switchControl.formValues()).toEqual([[name, value]]),
);

Given("a checked switch named {string} without an explicit value in a form", ({ switchControl }, name: string) => {
  switchControl.markup = `<form id="switch-form"><m3e-switch name="${name}" checked aria-label="Wi-Fi"></m3e-switch></form>`;
});

Given("a checked disabled switch named {string} in a form", ({ switchControl }, name: string) => {
  switchControl.markup = `<form id="switch-form"><m3e-switch name="${name}" checked disabled aria-label="Wi-Fi"></m3e-switch></form>`;
});

Given("an initially checked switch in a form", ({ switchControl }) => {
  switchControl.markup = `<form id="switch-form">
    <m3e-switch checked aria-label="Wi-Fi"></m3e-switch><button type="reset">Reset</button>
  </form>`;
});
When("the user resets the switch form", async ({ page }) => page.getByRole("button", { name: "Reset" }).click());

Given("an initially unchecked switch in a form", ({ switchControl }) => {
  switchControl.markup = `<form id="switch-form">
    <m3e-switch aria-label="Wi-Fi"></m3e-switch><button type="reset">Reset</button>
  </form>`;
});

Given("a checked switch in a disabled fieldset", ({ switchControl }) => {
  switchControl.markup = `<form id="switch-form"><fieldset disabled>
    <m3e-switch checked name="wifi" value="yes" aria-label="Wi-Fi"></m3e-switch>
  </fieldset></form>`;
});
When("the application enables the switch fieldset", async ({ page }) =>
  page.locator("fieldset").evaluate((fieldset: HTMLFieldSetElement) => {
    fieldset.disabled = false;
  }),
);

Given("a checked switch with a destination form", ({ switchControl }) => {
  switchControl.markup = `<form id="switch-form">
    <m3e-switch checked name="wifi" value="yes" aria-label="Wi-Fi"></m3e-switch>
  </form><form id="switch-destination"></form>`;
});
When("the application moves the switch to its destination form", async ({ page, switchControl }) => {
  await switchControl.switch.evaluate((element) => {
    const destination = document.getElementById("switch-destination");
    if (!destination) throw new Error("Switch destination form is missing.");
    destination.append(element);
  });
  await expect(page.locator("#switch-destination m3e-switch")).toBeVisible();
});
Then(
  "the destination switch form includes {string} with value {string}",
  async ({ switchControl }, name: string, value: string) =>
    expect.poll(() => switchControl.formValues("switch-destination")).toEqual([[name, value]]),
);
Then("the destination switch form has no values", async ({ switchControl }) =>
  expect.poll(() => switchControl.formValues("switch-destination")).toEqual([]),
);

When("the application reconnects the switch", async ({ switchControl }) =>
  switchControl.switch.evaluate((element) => {
    const parent = element.parentElement;
    if (!parent) throw new Error("Switch parent is missing.");
    element.remove();
    parent.append(element);
  }),
);

When("the application cancels the next switch click", async ({ switchControl }) =>
  switchControl.switch.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), { capture: true, once: true });
  }),
);

When("the user hovers the Wi-Fi switch label", async ({ page }) => page.getByText("Wi-Fi", { exact: true }).hover());
Then("the switch shows hover feedback", async ({ switchControl }) =>
  expect(switchControl.switch.locator(".state-layer .layer")).toHaveClass(/(?:^|\s)hover(?:\s|$)/),
);
When("the user presses the Wi-Fi switch label", async ({ page }) => page.mouse.down());
Then("the switch shows pressed feedback", async ({ switchControl }) =>
  expect(switchControl.switch.locator(".track")).toHaveClass(/(?:^|\s)pressed(?:\s|$)/),
);
When("the user releases the Wi-Fi switch label", async ({ page }) => page.mouse.up());
Then("the switch no longer shows pressed feedback", async ({ switchControl }) =>
  expect(switchControl.switch.locator(".track")).not.toHaveClass(/(?:^|\s)pressed(?:\s|$)/),
);
When("the user moves away from the Wi-Fi switch label", async ({ page }) => page.mouse.move(600, 400));
Then("the switch no longer shows hover feedback", async ({ switchControl }) =>
  expect(switchControl.switch.locator(".state-layer .layer")).not.toHaveClass(/(?:^|\s)hover(?:\s|$)/),
);
