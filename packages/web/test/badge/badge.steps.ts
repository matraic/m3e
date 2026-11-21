import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { BadgeHarness } from "./badge.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ badge: BadgeHarness }>({
  badge: async ({ page, render }, use) => use(new BadgeHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a badge with slotted content {string}", ({ badge }, content: string) => {
  badge.options.content = content;
});
When("the badge renders", async ({ badge }) => badge.show());
Then("the badge element is visible", async ({ badge }) => expect(badge.badge).toBeVisible());
Then("the badge shows slotted content {string}", async ({ page }, content: string) =>
  expect(page.getByText(content, { exact: true })).toBeVisible(),
);

Given("a badge attached to its target", ({ badge }) => {
  badge.options.attached = true;
});
Then("the badge's effective size is {string}", async ({ badge }, size: string) =>
  expect.poll(() => badge.readSize()).toBe(size),
);
Then("the badge's effective position is {string}", async ({ badge }, position: string) =>
  expect.poll(() => badge.readPosition()).toBe(position),
);
Then("the badge is positioned at {string}", async ({ badge }, position: string) => {
  const expected: Record<string, Record<string, boolean>> = {
    "above-after": { above: true, after: true },
    "above-before": { above: true, before: true },
    "below-before": { below: true, before: true },
    "below-after": { below: true, after: true },
    before: { before: true },
    after: { after: true },
    above: { above: true },
    below: { below: true },
  };
  const relations = expected[position];
  if (!relations) throw new Error(`Unknown badge position "${position}".`);
  await expect
    .poll(async () => {
      const targetId = await badge.readAnchorId();
      if (!targetId) throw new Error("Badge anchor target is missing.");
      return badge.readAnchorRelations(position, targetId);
    })
    .toMatchObject(relations);
});

Given("a badge with size {string}", ({ badge }, size: string) => {
  badge.options.size = size;
});
Then("the badge measures {int} pixels square", async ({ badge }, size: number) => {
  await expect.poll(() => badge.readSurfaceSize()).toEqual({ width: size, height: size });
});
Then("the badge suppresses its label", async ({ badge }) => expect(badge.readFontSize()).resolves.toBe("0px"));
Then("the badge's horizontal padding is {string}", async ({ badge }, padding: string) =>
  expect.poll(() => badge.readPadding()).toBe(padding),
);

Given("a badge attached to its target with position {string}", ({ badge }, position: string) => {
  badge.options.attached = true;
  badge.options.position = position;
});

Given("a badge with position {string}", ({ badge }, position: string) => {
  badge.options.position = position;
});
When("the application changes its label to {string}", async ({ badge }, content: string) => badge.setContent(content));

Given("a badge with custom foreground and background colors", ({ badge }) => {
  badge.options.style = "--m3e-badge-color: rgb(1, 2, 3); --m3e-badge-container-color: rgb(4, 5, 6)";
});
Then("the badge uses foreground color {string}", async ({ badge }, color: string) =>
  expect.poll(async () => (await badge.readColors()).foreground).toBe(color),
);
Then("the badge uses background color {string}", async ({ badge }, color: string) =>
  expect.poll(async () => (await badge.readColors()).background).toBe(color),
);
When("the application changes the badge target", async ({ badge }) => badge.changeTarget());
Then("the badge is attached to target {string}", async ({ badge }, targetId: string) =>
  expect.poll(() => badge.readAnchorId()).toBe(targetId),
);
When("the application changes the page direction to {string}", async ({ badge }, direction: string) =>
  badge.setPageDirection(direction),
);
When("the application moves the badge to a new DOM parent", async ({ badge }) => badge.moveToNewParent());
Then("the badge is attached to its target", async ({ badge }) =>
  expect.poll(() => badge.readAnchorId()).toBe("badge-target"),
);
When(
  "the application disconnects the badge, changes its label to {string}, and moves it to a new DOM parent",
  async ({ badge }, content: string) => badge.disconnectUpdateAndMove(content),
);
