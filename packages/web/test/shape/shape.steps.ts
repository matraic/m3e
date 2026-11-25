import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ShapeHarness } from "./shape.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ shapes: ShapeHarness }>({
  shapes: async ({ page, render }, use) => use(new ShapeHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an unnamed shape", ({ shapes }) => {
  shapes.html = "<m3e-shape></m3e-shape>";
});
When("the shape renders", async ({ shapes }) => shapes.render());
Then("the shape has no clip path", async ({ shapes }) => expect.poll(() => shapes.clipPath()).toBe("none"));

Given("a shape named {string}", ({ shapes }, name: string) => {
  shapes.html = `<m3e-shape name="${name}"></m3e-shape>`;
});
Then("the shape has a polygon clip path", async ({ shapes }) =>
  expect.poll(() => shapes.clipPath()).toContain("polygon("),
);

Given("shapes named {string}, {string}, and {string}", ({ shapes }, first: string, second: string, third: string) => {
  shapes.html = [first, second, third].map((name) => `<m3e-shape name="${name}"></m3e-shape>`).join("");
});
Then("the shapes have different clip paths", async ({ shapes }) =>
  expect(new Set(await shapes.clipPaths()).size).toBe(3),
);

When("the application changes the shape name to {string}", async ({ shapes }, name: string) => shapes.changeName(name));
Then("the shape's clip path changes", async ({ shapes }) =>
  expect.poll(() => shapes.clipPath()).not.toBe(shapes.previousClipPath),
);

When("the application removes the shape name", async ({ shapes }) =>
  shapes.shape.evaluate((shape) => shape.removeAttribute("name")),
);

Given("a shape sized {string}", ({ shapes }, size: string) => {
  shapes.html = `<m3e-shape name="circle" style="--m3e-shape-size: ${size}"></m3e-shape>`;
});
Then("the shape is {string} wide and high", async ({ shapes }, size: string) => {
  await expect(shapes.shape).toHaveCSS("width", size);
  await expect(shapes.shape).toHaveCSS("height", size);
});

Given("a shape containing {string}", ({ shapes }, content: string) => {
  shapes.html = `<m3e-shape name="circle" style="--m3e-shape-size: 100px"><span>${content}</span></m3e-shape>`;
});
Then("the shape content {string} is visible", async ({ shapes }, content: string) =>
  expect(shapes.shape.getByText(content)).toBeVisible(),
);

Given("a hidden shape", ({ shapes }) => {
  shapes.html = '<m3e-shape name="circle" hidden></m3e-shape>';
});
Then("the shape is hidden", async ({ shapes }) => expect(shapes.shape).toBeHidden());

Given("a shape with container color {string}", ({ shapes }, color: string) => {
  shapes.html = `<m3e-shape name="circle" style="--m3e-shape-container-color: ${color}"></m3e-shape>`;
});
Then("the shape background is {string}", async ({ shapes }, color: string) =>
  expect(shapes.wrapper).toHaveCSS("background-color", color),
);
