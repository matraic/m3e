import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { HeadingHarness } from "./heading.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ heading: HeadingHarness }>({
  heading: async ({ page, render }, use) => use(new HeadingHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a heading with content {string}", ({ heading }, content: string) => {
  heading.html = heading.markup(content);
});
When("the heading renders", async ({ heading }) => heading.render());
Then("the heading displays {string}", async ({ heading }, content: string) =>
  expect(heading.heading()).toHaveText(content),
);
Then("the heading uses the default display medium typescale", async ({ heading }) =>
  expect(await heading.appearance()).toMatchObject({ variant: "display", size: "medium" }),
);
Then("the heading has no heading semantics by default", async ({ heading }) => {
  await expect(heading.heading()).not.toHaveAttribute("variant");
  await expect(heading.heading()).not.toHaveAttribute("size");
  await expect(heading.heading()).not.toHaveAttribute("role", "heading");
});

Given("headings with different variants, sizes, and emphasis", ({ heading }) => {
  heading.html = `<m3e-heading variant="headline" size="large" emphasized>Headline</m3e-heading>
    <m3e-heading variant="title" size="small">Title</m3e-heading>
    <m3e-heading variant="label" size="medium">Label</m3e-heading>`;
});
When("the headings render", async ({ heading }) => heading.render());
Then("the first heading uses the emphasized large headline typescale", async ({ heading }) => {
  await expect(heading.heading(0)).toHaveAttribute("variant", "headline");
  await expect(heading.heading(0)).toHaveAttribute("size", "large");
  await expect(heading.heading(0)).toHaveAttribute("emphasized", "");
});
Then("the second heading uses the small title typescale", async ({ heading }) => {
  await expect(heading.heading(1)).toHaveAttribute("variant", "title");
  await expect(heading.heading(1)).toHaveAttribute("size", "small");
});
Then("the third heading uses the medium label typescale", async ({ heading }) => {
  await expect(heading.heading(2)).toHaveAttribute("variant", "label");
  await expect(heading.heading(2)).toHaveAttribute("size", "medium");
});

Given("two identical headline headings with one emphasized", ({ heading }) => {
  heading.html = `<m3e-heading id="standard-heading" variant="headline" size="large">Headline</m3e-heading>
    <m3e-heading id="emphasized-heading" variant="headline" size="large" emphasized>Headline</m3e-heading>`;
});
Then("the emphasized heading has different typography", async ({ heading }) =>
  expect(await heading.typography(0)).not.toEqual(await heading.typography(1)),
);
When("the application toggles emphasis off", async ({ heading }) =>
  heading.heading(1).evaluate((element) => element.removeAttribute("emphasized")),
);
Then("both headings have the same typography", async ({ heading }) =>
  expect(await heading.typography(0)).toEqual(await heading.typography(1)),
);
When("the application toggles emphasis on", async ({ heading }) =>
  heading.heading(1).evaluate((element) => element.setAttribute("emphasized", "")),
);

Given("a heading with unsupported variant and size values", ({ heading }) => {
  heading.html = heading.markup("Fallback", 'variant="unsupported" size="extra-large"');
});
Then("the heading falls back to display medium", async ({ heading }) => {
  await expect(heading.heading()).toHaveAttribute("variant", "display");
  await expect(heading.heading()).toHaveAttribute("size", "medium");
});

Given("a heading at level {int}", ({ heading }, level: number) => {
  heading.html = heading.markup("Section title", `id="title" level="${level}"`);
});
Given("a heading with invalid level {string}", ({ heading }, level: string) => {
  heading.html = heading.markup("Section title", `level="${level}"`);
});
Then("the heading is accessible as level {int} with name {string}", async ({ page }, level: number, name: string) => {
  const accessibleHeading = page.getByRole("heading", { name, level, exact: true });
  await expect(accessibleHeading).toBeVisible();
  await expect(accessibleHeading).toHaveAttribute("aria-level", String(level));
});
When("the application changes the heading level to {int}", async ({ heading }, level: number) =>
  heading.heading().evaluate((element, value) => element.setAttribute("level", String(value)), level),
);
When("the application removes the heading level", async ({ heading }) =>
  heading.heading().evaluate((element) => element.removeAttribute("level")),
);
Then("the heading has no heading semantics", async ({ heading }) => {
  await expect(heading.heading()).not.toHaveAttribute("role", "heading");
  await expect(heading.heading()).not.toHaveAttribute("aria-level");
});
