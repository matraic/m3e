import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { TooltipHarness, type Tooltip } from "./tooltip.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ tooltip: TooltipHarness }>({
  tooltip: async ({ page, render }, use) => use(new TooltipHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a standard tooltip", ({ tooltip }) => {
  tooltip.html = tooltip.markup("standard");
});
When("the tooltip renders", async ({ tooltip }) => tooltip.render());
Then("the tooltip has the default delays and position", async ({ tooltip }) =>
  expect(
    await tooltip.tooltip.evaluate((element: Tooltip) => [element.showDelay, element.hideDelay, element.position]),
  ).toEqual([0, 200, "below"]),
);
Then("the tooltip is closed", async ({ tooltip }) => expect.poll(() => tooltip.isOpen()).toBe(false));
Then("the tooltip is hidden from assistive technology", async ({ tooltip }) =>
  expect(tooltip.tooltip).toHaveAttribute("aria-hidden", "true"),
);
When("the user hovers over the tooltip control", async ({ tooltip }) => tooltip.control.hover());
Then("the tooltip is open", async ({ tooltip }) => expect.poll(() => tooltip.isOpen()).toBe(true));
Then("its popover is open", async ({ tooltip }) => expect.poll(() => tooltip.popoverOpen()).toBe(true));
When("the pointer leaves the tooltip control", async ({ page }) => page.mouse.move(0, 0));
Then("its popover is closed", async ({ tooltip }) => expect.poll(() => tooltip.popoverOpen()).toBe(false));

Given("a standard tooltip with a {int} millisecond show delay", ({ tooltip }, delay: number) => {
  tooltip.html = tooltip.markup("standard", `show-delay="${delay}"`);
});
Then("the tooltip has not opened immediately", async ({ tooltip }) => expect(await tooltip.isOpen()).toBe(false));
Then("the tooltip eventually opens", async ({ tooltip }) => expect.poll(() => tooltip.isOpen()).toBe(true));
When("the user tabs to the tooltip control", async ({ page }) => page.keyboard.press("Tab"));
Then("the tooltip control is focused", async ({ tooltip }) => expect(tooltip.control).toBeFocused());
When("the user tabs away from the tooltip control", async ({ page }) => page.keyboard.press("Tab"));
When("the user clicks the tooltip control", async ({ tooltip }) => tooltip.control.click());
When("the user presses Escape", async ({ page }) => page.keyboard.press("Escape"));
When("the application shows the tooltip", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element: Tooltip) => element.show()),
);
When("the application hides the tooltip", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element: Tooltip) => element.hide()),
);

Given("a disabled standard tooltip", ({ tooltip }) => {
  tooltip.html = tooltip.markup("standard", "disabled");
});
When("the application enables and shows the tooltip", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element: Tooltip) => {
    element.disabled = false;
    return element.show();
  }),
);
When("the application disables the tooltip", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element: Tooltip) => {
    element.disabled = true;
  }),
);

Given("a standard tooltip attached to a disabled control", ({ tooltip }) => {
  tooltip.html = `<m3e-button id="btn" disabled style="margin: 200px">Target</m3e-button>
    <m3e-tooltip for="btn">Tooltip text</m3e-tooltip>`;
});

Given("two standard tooltips", ({ tooltip }) => {
  tooltip.html = `<button id="a" style="margin: 100px">A</button>
    <button id="b" style="margin: 100px">B</button>
    <m3e-tooltip id="ta" for="a">First</m3e-tooltip>
    <m3e-tooltip id="tb" for="b">Second</m3e-tooltip>`;
});
When("the application shows the first tooltip", async ({ page }) =>
  page.locator("#ta").evaluate((element: Tooltip) => element.show()),
);
When("the application shows the second tooltip", async ({ page }) =>
  page.locator("#tb").evaluate((element: Tooltip) => element.show()),
);
Then("the first tooltip is closed", async ({ page }) =>
  expect.poll(() => page.locator("#ta").evaluate((element: Tooltip) => element.isOpen)).toBe(false),
);
Then("the second tooltip is open", async ({ page }) =>
  expect.poll(() => page.locator("#tb").evaluate((element: Tooltip) => element.isOpen)).toBe(true),
);

Given("a standard tooltip with invalid position and touch gestures", ({ tooltip }) => {
  tooltip.html = tooltip.markup("standard", 'position="x" touch-gestures="x"');
});
Then("the tooltip uses the default position and touch gestures", async ({ tooltip }) =>
  expect
    .poll(() => tooltip.tooltip.evaluate((element: Tooltip) => [element.position, element.touchGestures]))
    .toEqual(["below", "auto"]),
);

Given("a standard tooltip positioned {string}", ({ tooltip }, position: string) => {
  tooltip.html = tooltip.markup("standard", `position="${position}"`);
});
Then("the tooltip is positioned {string} its control", async ({ tooltip }, position: string) => {
  const popover = await tooltip.tooltip.locator(".base").boundingBox();
  const control = await tooltip.control.boundingBox();
  if (!popover || !control) throw new Error("Missing tooltip or control bounds");
  switch (position) {
    case "above":
      expect(popover.y + popover.height).toBeLessThanOrEqual(control.y + 1);
      break;
    case "below":
      expect(popover.y).toBeGreaterThanOrEqual(control.y + control.height - 1);
      break;
    case "before":
      expect(popover.x + popover.width).toBeLessThanOrEqual(control.x + 1);
      break;
    case "after":
      expect(popover.x).toBeGreaterThanOrEqual(control.x + control.width - 1);
      break;
    default:
      throw new Error(`Unknown tooltip position: ${position}`);
  }
});

Given("a non-interactive rich tooltip", ({ tooltip }) => {
  tooltip.html = tooltip.markup("rich", "", "Plain text");
});
Then("the tooltip control has no dialog popup", async ({ tooltip }) =>
  expect(tooltip.control).not.toHaveAttribute("aria-haspopup"),
);

Given("an interactive rich tooltip", ({ tooltip }) => {
  tooltip.html = tooltip.interactive();
});
Then("the tooltip control announces a dialog popup", async ({ tooltip }) =>
  expect(tooltip.control).toHaveAttribute("aria-haspopup", "dialog"),
);
Then("the tooltip is not hidden from assistive technology", async ({ tooltip }) =>
  expect(tooltip.tooltip).not.toHaveAttribute("aria-hidden"),
);
Then("the tooltip remains closed on hover", async ({ tooltip, page }) => {
  await page.waitForTimeout(100);
  expect(await tooltip.isOpen()).toBe(false);
});
Then("the tooltip is an accessible dialog named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("dialog", { name, exact: true })).toBeVisible(),
);
When("the user presses Enter", async ({ page }) => page.keyboard.press("Enter"));
When("the user tabs to the tooltip action", async ({ page }) => page.keyboard.press("Tab"));
Then("the tooltip action is focused", async ({ page }) =>
  expect(page.getByRole("button", { name: "Done" })).toBeFocused(),
);
When("the user clicks outside the tooltip", async ({ page }) => page.mouse.click(5, 5));
When("the user activates the tooltip action", async ({ page }) => page.getByRole("button", { name: "Done" }).click());

Given("an interactive rich tooltip with focus restoration disabled", ({ tooltip }) => {
  tooltip.html = tooltip.interactive("disable-restore-focus");
});
Then("the tooltip control is not focused", async ({ tooltip }) => expect(tooltip.control).not.toBeFocused());
When("the application observes tooltip toggle events", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element) => {
    const events: string[] = [];
    const record = (event: Event) => {
      events.push(`${event.type === "beforetoggle" ? "before" : "toggle"}:${(event as ToggleEvent).newState}`);
      document.documentElement.dataset.tooltipEvents = JSON.stringify(events);
    };
    element.addEventListener("beforetoggle", record);
    element.addEventListener("toggle", record);
  }),
);
Then("the tooltip reports opening and closing events", async ({ page }) =>
  expect
    .poll(() => page.evaluate(() => JSON.parse(document.documentElement.dataset.tooltipEvents ?? "[]") as string[]))
    .toEqual(["before:open", "toggle:open", "before:closed", "toggle:closed"]),
);
When("the application cancels tooltip opening", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element) => element.addEventListener("beforetoggle", (event) => event.preventDefault())),
);

Given("a rich tooltip with an invalid position", ({ tooltip }) => {
  tooltip.html = tooltip.markup("rich", 'position="x"', "Text");
});
Then("the rich tooltip uses its default position", async ({ tooltip }) =>
  expect.poll(() => tooltip.tooltip.evaluate((element: Tooltip) => element.position)).toBe("below-after"),
);

Given("a {string} tooltip", ({ tooltip }, kind: string) => {
  tooltip.html = tooltip.markup(kind);
});
Then("the tooltip control is described by {string}", async ({ tooltip }, description: string) =>
  expect(tooltip.control).toHaveAccessibleDescription(description),
);

Given("a non-interactive rich tooltip with a subhead and content", ({ tooltip }) => {
  tooltip.html = tooltip.markup("rich", "", '<span slot="subhead">Head</span>Body text');
});
Then("the tooltip control has no tooltip description", async ({ tooltip }) =>
  expect(tooltip.control).not.toHaveAttribute("aria-describedby"),
);
When("the application adds a tooltip action", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element) => {
    const action = document.createElement("button");
    action.slot = "actions";
    action.textContent = "Done";
    element.append(action);
  }),
);
When("the application removes the tooltip action", async ({ tooltip }) =>
  tooltip.tooltip.locator('[slot="actions"]').evaluate((element) => element.remove()),
);

Given("a non-interactive rich tooltip with a consumer popup value", ({ tooltip }) => {
  tooltip.html = tooltip.markup("rich", "", "Plain text", 'aria-haspopup="menu"');
});
Then("the tooltip control has popup value {string}", async ({ tooltip }, value: string) =>
  expect(tooltip.control).toHaveAttribute("aria-haspopup", value),
);

Given("an interactive rich tooltip with consumer popup values on two controls", ({ tooltip }) => {
  tooltip.html = `${tooltip.interactive("", 'aria-haspopup="menu"')}
    <button id="other" aria-haspopup="listbox">Other</button>`;
});
When("the application retargets the tooltip", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element) => element.setAttribute("for", "other")),
);
Then("the other tooltip control has popup value {string}", async ({ page }, value: string) =>
  expect(page.locator("#other")).toHaveAttribute("aria-haspopup", value),
);
When("the application removes the tooltip", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element) => element.remove()),
);

Given("a {string} tooltip with another control", ({ tooltip }, kind: string) => {
  tooltip.html = `${tooltip.markup(kind)}<button id="other">Other</button>`;
});
Then("the original tooltip control has no tooltip description", async ({ tooltip }) =>
  expect(tooltip.control).not.toHaveAttribute("aria-describedby"),
);
Then("the other tooltip control is described by {string}", async ({ page }, text: string) =>
  expect(page.locator("#other")).toHaveAccessibleDescription(text),
);
Then("the other tooltip control has no tooltip description", async ({ page }) =>
  expect(page.locator("#other")).not.toHaveAttribute("aria-describedby"),
);
Then("the document has no tooltip description container", async ({ page }) =>
  expect(page.locator("body > .m3e-describedby-message-container")).toHaveCount(0),
);
When("the application removes the tooltip association", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element) => element.removeAttribute("for")),
);

Given("a {string} tooltip with a consumer description", ({ tooltip }, kind: string) => {
  tooltip.html = `<span id="external-description">External guidance</span>${tooltip.markup(
    kind,
    "",
    "Tooltip text",
    'aria-describedby="external-description"',
  )}`;
});
When("the application changes the tooltip text to {string}", async ({ tooltip }, text: string) =>
  tooltip.tooltip.evaluate((element, value) => {
    element.textContent = value;
  }, text),
);
Then("the tooltip control retains only the consumer description reference", async ({ tooltip }) =>
  expect(tooltip.control).toHaveAttribute("aria-describedby", "external-description"),
);

Given("two {string} tooltips with the same description", ({ tooltip }, kind: string) => {
  const first = tooltip.markup(kind);
  const tag = kind === "standard" ? "m3e-tooltip" : "m3e-rich-tooltip";
  tooltip.html = `${first}<button id="other">Other</button><${tag} for="other">Tooltip text</${tag}>`;
});
Then("the document has one tooltip description", async ({ page }) =>
  expect(page.locator("body > .m3e-describedby-message-container span")).toHaveCount(1),
);

Given("a movable {string} tooltip and control", ({ tooltip }, kind: string) => {
  tooltip.html = `<div id="moving">${tooltip.markup(kind)}</div><div id="destination"></div><div id="host"></div>`;
});
When("the application moves the tooltip and control to another parent", async ({ page }) =>
  page.locator("#moving").evaluate((moving) => {
    const destination = document.querySelector("#destination");
    if (!destination) throw new Error("Missing tooltip destination");
    destination.append(moving);
  }),
);
When("the application moves the tooltip and control into a shadow root", async ({ page }) =>
  page.evaluate(() => {
    const host = document.querySelector("#host");
    const moving = document.querySelector("#moving");
    if (!host || !moving) throw new Error("Missing tooltip movement fixture");
    host.attachShadow({ mode: "open" }).append(moving);
  }),
);
Then("the shadow root has one tooltip description", async ({ page }) =>
  expect(page.locator("#host .m3e-describedby-message-container span")).toHaveCount(1),
);
Then("the shadow root has no tooltip description container", async ({ page }) =>
  expect(page.locator("#host .m3e-describedby-message-container")).toHaveCount(0),
);
When("the application removes and reinserts the tooltip", async ({ tooltip }) =>
  tooltip.tooltip.evaluate((element) => {
    const parent = element.parentNode;
    if (!parent) throw new Error("Missing tooltip parent");
    element.remove();
    parent.appendChild(element);
  }),
);

Given("a movable interactive rich tooltip and control", ({ tooltip }) => {
  tooltip.html = `<div id="moving">${tooltip.interactive()}</div><div id="destination"></div>`;
});
