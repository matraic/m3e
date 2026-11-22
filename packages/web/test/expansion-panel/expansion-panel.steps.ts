import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eAccordionElement, M3eExpansionPanelElement } from "@m3e/web/expansion-panel";

import { expect, test as componentTest } from "../fixtures";
import { ExpansionPanelHarness } from "./expansion-panel.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ expansion: ExpansionPanelHarness }>({
  expansion: async ({ page, render }, use) => use(new ExpansionPanelHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an expansion panel named {string}", ({ expansion }, name: string) => {
  expansion.html = expansion.panelMarkup(name);
});
When("the expansion panel renders", async ({ expansion }) => expansion.render());
Then("the {string} header is collapsed", async ({ expansion }, name: string) =>
  expect(expansion.header(name)).toHaveAttribute("aria-expanded", "false"),
);
Then("its content region is hidden", async ({ expansion }) => expect(expansion.region).toBeHidden());
Then("the header controls its labelled content region", async ({ expansion }) => {
  const header = expansion.firstPanel.locator("m3e-expansion-header");
  const headerId = await header.getAttribute("id");
  const regionId = await expansion.region.getAttribute("id");
  if (!headerId || !regionId) throw new Error("Expansion header or region ID is missing.");
  await expect(header).toHaveAttribute("aria-controls", regionId);
  await expect(expansion.region).toHaveAttribute("aria-labelledby", headerId);
  await expect(expansion.region).toHaveAttribute("role", "region");
});
When("the user clicks the {string} header", async ({ expansion }, name: string) => expansion.header(name).click());
Then("the {string} panel is open", async ({ expansion }, name: string) =>
  expect(expansion.panel(name)).toHaveAttribute("open", ""),
);
Then("the {string} header is expanded", async ({ expansion }, name: string) =>
  expect(expansion.header(name)).toHaveAttribute("aria-expanded", "true"),
);
Then("its content region is visible", async ({ expansion }) => {
  await expect(expansion.region).toBeVisible();
  const name = await expansion.firstPanel.locator('[slot="header"]').textContent();
  if (!name) throw new Error("Expansion header label is missing.");
  await expect(expansion.firstPanel.getByRole("region", { name, exact: true })).toBeVisible();
});
Then("the expansion panel content is visible", async ({ page }) =>
  expect(page.getByText("Panel content")).toBeVisible(),
);
When("the application observes expansion panel events", async ({ expansion }) => expansion.observeEvents());
Then("the expansion panel events are {string}", async ({ expansion }, events: string) =>
  expect(expansion.firstPanel).toHaveAttribute("data-events", events),
);
Then("the {string} panel is closed", async ({ expansion }, name: string) =>
  expect(expansion.panel(name)).not.toHaveAttribute("open"),
);

Given("a disabled expansion panel named {string}", ({ expansion }, name: string) => {
  expansion.html = expansion.panelMarkup(name, "disabled");
});
Then("the {string} header is disabled", async ({ expansion }, name: string) =>
  expect(expansion.header(name)).toHaveAttribute("aria-disabled", "true"),
);
When("the application clicks the {string} header", async ({ expansion }, name: string) =>
  expansion.header(name).evaluate((element: HTMLElement) => element.click()),
);
When("the application disables the {string} panel", async ({ expansion }, name: string) =>
  expansion.panel(name).evaluate((panel: M3eExpansionPanelElement) => {
    panel.disabled = true;
  }),
);
When("the application enables the {string} panel", async ({ expansion }, name: string) =>
  expansion.panel(name).evaluate((panel: M3eExpansionPanelElement) => {
    panel.disabled = false;
  }),
);
Then("the {string} header is enabled", async ({ expansion }, name: string) =>
  expect(expansion.header(name)).not.toHaveAttribute("aria-disabled"),
);
When("the user focuses the {string} header", async ({ expansion }, name: string) => expansion.header(name).focus());
When("the user presses {string} in the expansion panel", async ({ page }, key: string) => page.keyboard.press(key));

Given("an expansion panel named {string} with focusable content and actions", ({ expansion }, name: string) => {
  expansion.html = expansion.panelMarkup(
    name,
    "",
    '<button id="content-action">Content action</button><div slot="actions"><button id="panel-action">Panel action</button></div>',
  );
});
Then("the content action is excluded from the accessibility tree", async ({ page }) =>
  expect(page.getByRole("button", { name: "Content action" })).toHaveCount(0),
);
Then("the panel action is excluded from the accessibility tree", async ({ page }) =>
  expect(page.getByRole("button", { name: "Panel action" })).toHaveCount(0),
);
Then("focus is after the expansion panel", async ({ page }) => expect(page.locator("#after-panel")).toBeFocused());
Then("the content action is visible", async ({ page }) => expect(page.locator("#content-action")).toBeVisible());
Then("the panel action is visible", async ({ page }) => expect(page.locator("#panel-action")).toBeVisible());
Then("the content action is focused", async ({ page }) => expect(page.locator("#content-action")).toBeFocused());
Then("the panel action is focused", async ({ page }) => expect(page.locator("#panel-action")).toBeFocused());
Then("the content action is hidden", async ({ page }) => expect(page.locator("#content-action")).toBeHidden());
Then("the panel action is hidden", async ({ page }) => expect(page.locator("#panel-action")).toBeHidden());

Given("an open expansion panel named {string}", ({ expansion }, name: string) => {
  expansion.html = expansion.panelMarkup(name, "open");
});
When("the application closes the {string} panel", async ({ expansion }, name: string) =>
  expansion.panel(name).evaluate((panel: M3eExpansionPanelElement) => {
    panel.open = false;
  }),
);

Given("an accordion with panels {string} and {string}", ({ expansion }, first: string, second: string) => {
  expansion.html = `<m3e-accordion>${expansion.panelMarkup(first)}${expansion.panelMarkup(second)}</m3e-accordion>`;
});

Given("a multi accordion with panels {string} and {string}", ({ expansion }, first: string, second: string) => {
  expansion.html = `<m3e-accordion multi>${expansion.panelMarkup(first)}${expansion.panelMarkup(second)}</m3e-accordion>`;
});

Given(
  "an accordion with initially open panels {string} and {string}",
  ({ expansion }, first: string, second: string) => {
    expansion.html = `<m3e-accordion>${expansion.panelMarkup(first, "open")}${expansion.panelMarkup(second, "open")}</m3e-accordion>`;
  },
);

Given(
  "a multi accordion with initially open panels {string} and {string}",
  ({ expansion }, first: string, second: string) => {
    expansion.html = `<m3e-accordion multi>${expansion.panelMarkup(first, "open")}${expansion.panelMarkup(second, "open")}</m3e-accordion>`;
  },
);

Given("an accordion with a disabled middle panel", ({ expansion }) => {
  expansion.html = `<m3e-accordion>${expansion.panelMarkup("First")}${expansion.panelMarkup("Second", "disabled")}${expansion.panelMarkup("Third")}</m3e-accordion>`;
});
Then("the {string} header is focused", async ({ expansion }, name: string) =>
  expect(expansion.header(name)).toBeFocused(),
);
Then(
  "the indicator direction is {string} and position is {string}",
  async ({ expansion }, direction: string, position: string) => {
    const header = expansion.firstPanel.locator("m3e-expansion-header");
    await expect(header).toHaveAttribute("toggle-direction", direction);
    await expect(header).toHaveAttribute("toggle-position", position);
  },
);
Then("the indicator is visible", async ({ expansion }) =>
  expect(expansion.firstPanel.locator("m3e-expansion-header .toggle[aria-hidden]")).toBeVisible(),
);
Then("the indicator is hidden from assistive technology", async ({ expansion }) =>
  expect(expansion.firstPanel.locator("m3e-expansion-header .toggle[aria-hidden]")).toHaveAttribute(
    "aria-hidden",
    "true",
  ),
);

Given("an expansion panel with invalid indicator values", ({ expansion }) => {
  expansion.html = expansion.panelMarkup("Details", 'toggle-direction="bogus" toggle-position="bogus"');
});
When(
  "the application sets the indicator direction to {string} and position to {string}",
  async ({ expansion }, direction: string, position: string) =>
    expansion.firstPanel.evaluate(
      (panel, values) => {
        panel.setAttribute("toggle-direction", values.direction);
        panel.setAttribute("toggle-position", values.position);
      },
      { direction, position },
    ),
);
Then("the indicator appears before the {string} header text", async ({ expansion }, name: string) =>
  expect.poll(() => expansion.indicatorBefore(name)).toBe(true),
);
When("the application hides the indicator", async ({ expansion }) =>
  expansion.firstPanel.evaluate((panel: M3eExpansionPanelElement) => {
    panel.hideToggle = true;
  }),
);
Then("the indicator is hidden", async ({ expansion }) => {
  await expect(expansion.firstPanel.locator("m3e-expansion-header")).toHaveAttribute("hide-toggle", "");
  await expect(expansion.firstPanel.locator("m3e-expansion-header .toggle[aria-hidden]")).toBeHidden();
});
When("the application shows the indicator", async ({ expansion }) =>
  expansion.firstPanel.evaluate((panel: M3eExpansionPanelElement) => {
    panel.hideToggle = false;
  }),
);

Given("expansion panels with before and after indicators", ({ expansion }) => {
  expansion.html =
    expansion.panelMarkup("Before", 'toggle-position="before"') +
    expansion.panelMarkup("After", 'toggle-position="after"');
});
Then("the indicator appears after the {string} header text", async ({ expansion }, name: string) =>
  expect.poll(() => expansion.indicatorBefore(name)).toBe(false),
);

Given("an expansion panel named {string} with a custom indicator", ({ expansion }, name: string) => {
  expansion.html = expansion.panelMarkup(
    name,
    "",
    '<span slot="toggle-icon" id="custom-indicator">Icon</span>Panel content',
  );
});
Then("the custom indicator is visible", async ({ page }) => expect(page.locator("#custom-indicator")).toBeVisible());
When("the application moves the panel to a new parent", async ({ expansion }) =>
  expansion.firstPanel.evaluate((panel) => {
    const parent = document.createElement("div");
    parent.id = "new-panel-parent";
    document.body.append(parent);
    parent.append(panel);
  }),
);
Then("the {string} panel is in its new parent", async ({ page }, name: string) =>
  expect(page.locator("#new-panel-parent > m3e-expansion-panel").filter({ hasText: name })).toHaveCount(1),
);

Given("two single accordions with an open panel each", ({ expansion }) => {
  expansion.html = `<m3e-accordion id="first-accordion">${expansion.panelMarkup("First", "open")}</m3e-accordion>
    <m3e-accordion id="second-accordion">${expansion.panelMarkup("Second", "open")}</m3e-accordion>`;
});
When("the application moves {string} into the second accordion", async ({ expansion }, name: string) =>
  expansion.panel(name).evaluate((panel) => {
    const target = document.querySelector("#second-accordion");
    if (!target) throw new Error("Second accordion is missing.");
    target.append(panel);
  }),
);
Then("the first accordion contains {int} panels", async ({ page }, count: number) =>
  expect
    .poll(() => page.locator("#first-accordion").evaluate((accordion: M3eAccordionElement) => accordion.panels.length))
    .toBe(count),
);
Then("the second accordion contains {int} panels", async ({ page }, count: number) =>
  expect
    .poll(() => page.locator("#second-accordion").evaluate((accordion: M3eAccordionElement) => accordion.panels.length))
    .toBe(count),
);

Given("an accordion containing a nested accordion", ({ expansion }) => {
  const inner = `<m3e-accordion id="inner-accordion">${expansion.panelMarkup("Inner first")}${expansion.panelMarkup("Inner second")}</m3e-accordion>`;
  expansion.html = `<m3e-accordion id="outer-accordion">${expansion.panelMarkup("Outer", "open", inner)}${expansion.panelMarkup("Sibling")}</m3e-accordion>`;
});
When("the application observes nested panel events", async ({ page }) =>
  page.evaluate(() => {
    const events: string[] = [];
    for (const name of ["opening", "opened", "closing", "closed"]) {
      document.addEventListener(name, (event) => {
        if (event.target instanceof HTMLElement) {
          events.push(`${event.target.id}:${event.type}`);
          document.body.setAttribute("data-nested-events", events.join(","));
        }
      });
    }
  }),
);
Then("the nested panel events are {string}", async ({ page }, events: string) =>
  expect(page.locator("body")).toHaveAttribute("data-nested-events", events),
);
Then("the outer accordion contains only {string}", async ({ page }, names: string) =>
  expect
    .poll(() =>
      page
        .locator("#outer-accordion")
        .evaluate((accordion: M3eAccordionElement) =>
          accordion.panels.map((panel) => panel.querySelector('[slot="header"]')?.textContent?.trim()).join(","),
        ),
    )
    .toBe(names),
);
Then("the inner accordion contains only {string}", async ({ page }, names: string) =>
  expect
    .poll(() =>
      page
        .locator("#inner-accordion")
        .evaluate((accordion: M3eAccordionElement) =>
          accordion.panels.map((panel) => panel.querySelector('[slot="header"]')?.textContent?.trim()).join(","),
        ),
    )
    .toBe(names),
);
When("the application adds a {string} panel to the accordion", async ({ expansion, page }, name: string) =>
  page
    .locator("m3e-accordion")
    .evaluate((accordion, html) => accordion.insertAdjacentHTML("beforeend", html), expansion.panelMarkup(name)),
);
Then("the accordion panel order is {string}", async ({ page }, names: string) =>
  expect
    .poll(() =>
      page
        .locator("m3e-accordion")
        .evaluate((accordion: M3eAccordionElement) =>
          accordion.panels.map((panel) => panel.querySelector('[slot="header"]')?.textContent?.trim()).join(","),
        ),
    )
    .toBe(names),
);
When(
  "the application moves {string} before {string} in the accordion",
  async ({ expansion }, name: string, before: string) =>
    expansion.panel(name).evaluate(
      (panel, id) => {
        const target = document.getElementById(id);
        if (!target || !target.parentElement) throw new Error("Target panel is missing.");
        target.parentElement.insertBefore(panel, target);
      },
      `panel-${before.toLowerCase().replaceAll(" ", "-")}`,
    ),
);
When("the application removes the {string} panel", async ({ expansion }, name: string) =>
  expansion.panel(name).evaluate((panel) => panel.remove()),
);
When("the application disables multi on the accordion", async ({ page }) =>
  page.locator("m3e-accordion").evaluate((accordion: M3eAccordionElement) => {
    accordion.multi = false;
  }),
);
When("the application enables multi on the accordion", async ({ page }) =>
  page.locator("m3e-accordion").evaluate((accordion: M3eAccordionElement) => {
    accordion.multi = true;
  }),
);

Given("an open horizontal expansion panel named {string}", ({ expansion }, name: string) => {
  expansion.html = expansion.panelMarkup(name, 'open toggle-direction="horizontal" toggle-position="before"');
});
Then("the indicator rotates clockwise", async ({ expansion }) =>
  expect
    .poll(() =>
      expansion.firstPanel.locator("m3e-expansion-header .toggle[aria-hidden]").evaluate((toggle) => {
        const matrix = new DOMMatrix(getComputedStyle(toggle).transform);
        return Math.round(matrix.b);
      }),
    )
    .toBe(1),
);
When("the application changes the expansion page direction to {string}", async ({ page }, direction: string) => {
  if (direction !== "ltr" && direction !== "rtl") throw new Error(`Unknown direction: ${direction}`);
  await page.evaluate((value) => {
    document.body.dir = value;
  }, direction);
});
Then("the indicator rotates counterclockwise", async ({ expansion }) =>
  expect
    .poll(() =>
      expansion.firstPanel.locator("m3e-expansion-header .toggle[aria-hidden]").evaluate((toggle) => {
        const matrix = new DOMMatrix(getComputedStyle(toggle).transform);
        return Math.round(matrix.b);
      }),
    )
    .toBe(-1),
);
Then("the expansion actions area is hidden", async ({ expansion }) =>
  expect(expansion.firstPanel.locator(".actions")).toBeHidden(),
);
When("the application adds an expansion action", async ({ expansion }) =>
  expansion.firstPanel.evaluate((panel) =>
    panel.insertAdjacentHTML(
      "beforeend",
      '<div id="dynamic-expansion-actions" slot="actions"><button>Dynamic action</button></div>',
    ),
  ),
);
Then("the expansion actions area is visible", async ({ expansion }) =>
  expect(expansion.firstPanel.locator(".actions")).toBeVisible(),
);
Then("the dynamic expansion action is accessible", async ({ page }) =>
  expect(page.getByRole("button", { name: "Dynamic action" })).toBeVisible(),
);
When("the application removes the expansion action", async ({ page }) =>
  page.locator("#dynamic-expansion-actions").evaluate((actions) => actions.remove()),
);
Then("the dynamic expansion action is absent", async ({ page }) =>
  expect(page.locator("#dynamic-expansion-actions")).toHaveCount(0),
);
Then(
  "the {string} and {string} panels have distinct header and region relationships",
  async ({ expansion }, first: string, second: string) => {
    const relationships = await Promise.all(
      [first, second].map((name) =>
        expansion.panel(name).evaluate((panel) => {
          const header = panel.shadowRoot?.querySelector("m3e-expansion-header");
          const region = panel.shadowRoot?.querySelector("m3e-collapsible");
          if (!header || !region) throw new Error("Panel header or region is missing.");
          return {
            header: header.id,
            region: region.id,
            controls: header.getAttribute("aria-controls"),
            label: region.getAttribute("aria-labelledby"),
          };
        }),
      ),
    );
    for (const relationship of relationships) {
      expect(relationship.header).toBeTruthy();
      expect(relationship.region).toBeTruthy();
      expect(relationship.controls).toBe(relationship.region);
      expect(relationship.label).toBe(relationship.header);
    }
    expect(new Set(relationships.flatMap((relationship) => [relationship.header, relationship.region])).size).toBe(4);
  },
);
Then(
  "the {string} and {string} regions are accessible by name",
  async ({ expansion }, first: string, second: string) => {
    await expect(expansion.panel(first).getByRole("region", { name: first, exact: true })).toBeVisible();
    await expect(expansion.panel(second).getByRole("region", { name: second, exact: true })).toBeVisible();
  },
);
When("the user focuses the {word} action", async ({ page }, target: string) => {
  if (target !== "content" && target !== "panel") throw new Error(`Unknown expansion action: ${target}`);
  await page.locator(`#${target}-action`).focus();
});
Then("the {string} header is not in the tab order", async ({ expansion }, name: string) =>
  expect(expansion.header(name)).not.toHaveAttribute("tabindex"),
);
Then("the content action is not focused", async ({ page }) =>
  expect(page.locator("#content-action")).not.toBeFocused(),
);
When("the user focuses the element after the panel", async ({ page }) => page.locator("#after-panel").focus());

Given("an animated expansion panel named {string}", ({ expansion }, name: string) => {
  expansion.reducedMotion = "no-preference";
  expansion.html = expansion.panelMarkup(name, 'style="--m3e-collapsible-animation-duration: 1200ms"');
});
When("the application opens the panel during animation", async ({ expansion }) =>
  expansion.firstPanel.evaluate(async (panel: M3eExpansionPanelElement) => {
    panel.open = true;
    await panel.updateComplete;
    const region = panel.shadowRoot?.querySelector("m3e-collapsible");
    if (!region) throw new Error("Expansion region is missing.");
    await region.updateComplete;
  }),
);
When("the application waits for the expansion animation to run", async ({ expansion }) =>
  expect
    .poll(
      () =>
        expansion.region.evaluate((region) =>
          region
            .getAnimations()
            .some((animation) => animation.playState === "running" && Number(animation.currentTime) >= 100),
        ),
      { intervals: [20] },
    )
    .toBe(true),
);
When("the application closes the panel during animation", async ({ expansion }) =>
  expansion.firstPanel.evaluate(async (panel: M3eExpansionPanelElement) => {
    panel.open = false;
    await panel.updateComplete;
    const region = panel.shadowRoot?.querySelector("m3e-collapsible");
    if (!region) throw new Error("Expansion region is missing.");
    await region.updateComplete;
  }),
);
When("the application waits for the collapse animation to run", async ({ expansion }) =>
  expect
    .poll(
      () =>
        expansion.region.evaluate((region) =>
          region
            .getAnimations()
            .some((animation) => animation.playState === "running" && Number(animation.currentTime) >= 40),
        ),
      { intervals: [20] },
    )
    .toBe(true),
);

Given("an open animated expansion panel named {string}", ({ expansion }, name: string) => {
  expansion.reducedMotion = "no-preference";
  expansion.html = expansion.panelMarkup(name, 'open style="--m3e-collapsible-animation-duration: 1200ms"');
});
When("the application waits for the initial collapse animation", async ({ expansion }) =>
  expect
    .poll(
      () =>
        expansion.region.evaluate((region) =>
          region
            .getAnimations()
            .some((animation) => animation.playState === "running" && Number(animation.currentTime) >= 100),
        ),
      { intervals: [20] },
    )
    .toBe(true),
);
When("the application waits for the interrupted expansion animation", async ({ expansion }) =>
  expect
    .poll(
      () =>
        expansion.region.evaluate((region) =>
          region
            .getAnimations()
            .some((animation) => animation.playState === "running" && Number(animation.currentTime) >= 40),
        ),
      { intervals: [20] },
    )
    .toBe(true),
);
