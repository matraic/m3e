import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { AppBarHarness, fullScroll, normalColor, scrolledColor, smallHeight } from "./app-bar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ appBar: AppBarHarness }>({
  appBar: async ({ page, render }, use) => use(new AppBarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given('an app bar with a leading Back control, a title of "Inbox", a subtitle of "Recent messages", and a trailing More action', async ({ appBar }) => {
  await appBar.show();
});
When("the bar renders at the top level", async ({ appBar }) => expect(appBar.bar).toBeVisible());
Then("it is exposed as a banner landmark", async ({ page }) => expect(page.getByRole("banner")).toBeVisible());
Then("all four pieces of content are visible", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
  await expect(page.getByText("Inbox", { exact: true })).toBeVisible();
  await expect(page.getByText("Recent messages", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "More" })).toBeVisible();
});

Given("an app bar with no explicit role", ({ appBar }) => { appBar.options = {}; });
Given("its nearest ancestor with an explicit role has role {string}", ({ appBar }, role: string) => {
  appBar.options.role = role;
});
When("the bar renders", async ({ appBar }) => appBar.show());
Then("the default banner landmark is {string}", async ({ page }, result: string) => {
  await expect(page.getByRole("banner")).toHaveCount(result === "exposed" ? 1 : 0);
});

Given('an app bar using "leading-icon" for Back and "trailing-icon" for More instead of the current slot names', ({ appBar }) => {
  appBar.useDeprecatedSideSlots();
});
Then("Back and More appear on their respective sides of the bar", async ({ page }) => {
  const back = page.getByRole("button", { name: "Back" });
  const title = page.getByText("Inbox", { exact: true });
  const more = page.getByRole("button", { name: "More" });
  await expect(back).toBeVisible();
  await expect(more).toBeVisible();
  expect((await back.boundingBox())!.x).toBeLessThan((await title.boundingBox())!.x);
  expect((await more.boundingBox())!.x).toBeGreaterThan((await title.boundingBox())!.x);
});

Given("an app bar without a size", ({ appBar }) => { appBar.options.size = undefined; });
Given("an app bar with size {string}", ({ appBar }, size: string) => { appBar.options.size = size; });
Then("its effective size is {string}", async ({ appBar }, size: string) => {
  await expect(appBar.bar).toHaveJSProperty("size", size);
});

Given("a small app bar with a title and more space taken up by its trailing actions than by its leading control", ({ appBar }) => {
  appBar.options.size = "small";
});
When('the bar renders without "centered"', async ({ appBar }) => appBar.show());
Then("the title area is start-aligned", async ({ appBar }) => expect((await appBar.read()).titleOffset).toBeLessThan(-20));
Then("the {string} attribute is absent", async ({ appBar }, attribute: string) => {
  await expect(appBar.bar).not.toHaveAttribute(attribute);
});

Given('a small app bar rendered without "centered"', async ({ appBar }) => appBar.show({ size: "small" }));
When('the application enables its "centered" property', async ({ appBar }) => appBar.enableCentering());
Then('the "centered" attribute is present', async ({ appBar }) => expect(appBar.bar).toHaveAttribute("centered", ""));

Given("a centered {string} app bar with a title and subtitle that fit, and side content of unequal widths", ({ appBar }, size: string) => {
  appBar.options = { size, centered: true };
});
async function expectCentered(appBar: AppBarHarness) {
  await expect.poll(async () => Math.abs((await appBar.read()).titleOffset)).toBeLessThan(2);
  await expect.poll(async () => Math.abs((await appBar.read()).subtitleOffset)).toBeLessThan(2);
}
Then("the title and subtitle are centered horizontally within the bar", async ({ appBar }) => expectCentered(appBar));

Given('an app bar in "elevate" mode whose "for" attribute points to one of two scrollable containers', async ({ appBar }) =>
  appBar.related({ mode: "elevate", secondContainer: true }),
);
When("only the other container scrolls", async ({ appBar }) => appBar.scrollOtherContainer(fullScroll));
When("the associated container scrolls", async ({ appBar }) => appBar.scroll(fullScroll));
When("the application moves the app bar to a new DOM parent", async ({ appBar }) => appBar.moveToNewParent());
Then("the bar keeps its unscrolled appearance", async ({ appBar }) => appBar.expectState({ red: normalColor, shadowOffset: 0 }));
Then("the bar takes on its scrolled appearance", async ({ appBar }) => appBar.expectState({ red: scrolledColor, shadowOffset: 10 }));

Given('an app bar in "elevate" mode with no "for" attribute', async ({ appBar }) => appBar.related({ mode: "elevate", container: "unlinked" }));
When("the application calls attach with a scroll container and that container scrolls down", async ({ appBar }) => {
  await appBar.attach();
  await appBar.scroll(fullScroll);
});

When("the container returns to the top, the application calls detach, and the container scrolls down again", async ({ appBar }) => {
  await appBar.scroll(0);
  await appBar.expectState({ red: normalColor, shadowOffset: 0 });
  await appBar.detach();
  await appBar.scroll(fullScroll);
});

Given("an app bar connected to a scroll container without a scroll behavior", ({ appBar }) => {
  appBar.options = { container: "linked" };
});
Given("an app bar connected to a scroll container with scroll behavior {string}", ({ appBar }, mode: string) => {
  appBar.options = { container: "linked", mode };
});
Then("its effective scroll behavior is {string}", async ({ appBar }, mode: string) => {
  await expect(appBar.bar).toHaveJSProperty("scrollBehavior", mode);
});

Given('a medium app bar in "elevate" mode with distinct normal and on-scroll surface styles', async ({ appBar }) =>
  appBar.related({ size: "medium", mode: "elevate" }),
);
Given("its associated scroll container is at the top", async ({ appBar }) => appBar.expectState({ scrollTop: 0 }));
When("the user scrolls down in that container", async ({ appBar }) => appBar.scroll(fullScroll));
Then("the bar uses its on-scroll color and elevation", async ({ appBar }) => appBar.expectState({ red: scrolledColor, shadowOffset: 10 }));
Then("it remains at its expanded height", async ({ appBar }) => appBar.expectState({ height: appBar.initial.height }));
Then("it stays at the top of the scroll container", async ({ appBar }) => appBar.expectState({ top: 0 }));

When("the user scrolls back to the top", async ({ appBar }) => appBar.scroll(0));
Then("the bar uses its normal color and elevation again", async ({ appBar }) => appBar.expectState({ red: normalColor, shadowOffset: 0 }));

Given('an app bar in "transparent" mode with an opaque normal surface, a title, a subtitle, and controls on both sides', async ({ appBar }) =>
  appBar.related({ mode: "transparent" }),
);
When("the user scrolls down a short distance", async ({ appBar }) => appBar.scroll(16));
Then("the background, title, and subtitle are partly transparent", async ({ appBar }) => {
  await appBar.expectState({ labelOpacity: 0.75 });
  expect((await appBar.read()).backgroundOpacity).toBeCloseTo(0.75, 2);
});

When("the user scrolls down farther", async ({ appBar }) => appBar.scroll(32));
Then("the background, title, and subtitle fade further", async ({ appBar }) => {
  await appBar.expectState({ labelOpacity: 0.5 });
  expect((await appBar.read()).backgroundOpacity).toBeCloseTo(0.5, 2);
});
Then("the leading and trailing controls remain fully opaque", async ({ appBar }) => appBar.expectState({ controlOpacity: [1, 1] }));
Then("the app bar does not gain a shadow", async ({ appBar }) => appBar.expectState({ shadowVisible: false }));

When("the user scrolls far enough for the fade to complete", async ({ appBar }) => appBar.scroll(fullScroll));
Then("the background, title, and subtitle are fully transparent", async ({ appBar }) =>
  appBar.expectState({ backgroundOpacity: 0, labelOpacity: 0 }),
);
Then("the background, title, and subtitle are fully opaque again", async ({ appBar }) =>
  appBar.expectState({ backgroundOpacity: 1, labelOpacity: 1 }),
);

Given('a small app bar in "elevate" mode at the top of its scroll container', async ({ appBar }) =>
  appBar.related({ size: "small", mode: "elevate" }),
);
When("the application changes its scroll behavior to {string}", async ({ appBar }, mode: "elevate" | "transparent") => {
  await appBar.setScrollBehavior(mode);
});
Then("the bar keeps its original color with an opaque background and labels", async ({ appBar }) =>
  appBar.expectState({ red: appBar.initial.red, backgroundOpacity: 1, labelOpacity: 1 }),
);

Given('an app bar in "transparent" mode with a standard icon button and a text button using their default styles', async ({ appBar }) => {
  await appBar.showWithTextAndIconButtons();
  await appBar.expectState({ buttonOpacity: [0, 0] });
});
Then("the background behind each button fades in", async ({ appBar }) => {
  await expect.poll(async () => (await appBar.read()).buttonOpacity).toEqual([
    expect.closeTo(0.25, 2),
    expect.closeTo(0.25, 2),
  ]);
});
Then("both button backgrounds are fully opaque", async ({ appBar }) => appBar.expectState({ buttonOpacity: [1, 1] }));

Given('a scrolled app bar in "transparent" mode whose title has faded out', async ({ appBar }) => {
  await appBar.related({ mode: "transparent" });
  await appBar.scroll(fullScroll);
  await appBar.expectState({ labelOpacity: 0 });
});
Then("the title is fully opaque again", async ({ appBar }) => appBar.expectState({ labelOpacity: 1 }));
Then("the bar uses its on-scroll surface styles", async ({ appBar }) => appBar.expectState({ red: scrolledColor, shadowOffset: 10 }));

Given('an app bar in "hide" mode at the top of its associated scroll container', async ({ appBar }) => appBar.related({ mode: "hide" }));
When("the user scrolls down by less than the bar's height", async ({ appBar }) => appBar.scroll(20));
Then("the bar slides upward by the distance scrolled without changing its surface styles", async ({ appBar }) => {
  await appBar.expectState({ top: -20, red: normalColor, shadowOffset: 0 });
});

When("the user scrolls down by at least the bar's height", async ({ appBar }) => appBar.scroll(fullScroll));
Then("the bar slides fully out of view", async ({ appBar }) => appBar.expectState({ top: -appBar.initial.height }));

When("the user scrolls back up but stays at least one bar height from the top", async ({ appBar }) => appBar.scroll(fullScroll - 50));
Then("the bar remains out of view", async ({ appBar }) => appBar.expectState({ top: -appBar.initial.height }));

When("the user scrolls within one bar height of the top", async ({ appBar }) => appBar.scroll(20));
Then("the bar slides back into view", async ({ appBar }) => appBar.expectState({ top: -20 }));

When("the user reaches the top", async ({ appBar }) => appBar.scroll(0));
Then("the bar is fully visible", async ({ appBar }) => appBar.expectState({ top: 0 }));

Given('the app bar is an expanded {string} bar in "compress" mode', async ({ appBar }, size: string) => {
  await appBar.related({ size, mode: "compress" });
  expect(appBar.initial.height).toBeGreaterThan(smallHeight);
});
When("the user scrolls down far enough", async ({ appBar }) => appBar.scroll(fullScroll));
Then("the bar shrinks to the configured small app bar height", async ({ appBar }) => appBar.expectState({ height: smallHeight }));
Then("the content below the bar keeps its original position within the scrollable content", async ({ appBar }) =>
  appBar.expectState({ contentTop: appBar.initial.contentTop }),
);
Then("the bar returns to its original expanded height", async ({ appBar }) => appBar.expectState({ height: appBar.initial.height }));

Given("a large compressing app bar with the default small height", async ({ appBar }) =>
  appBar.related({ size: "large", mode: "compress", useDefaultSmallHeight: true }),
);
Then("the bar collapses to the default small height of {int} pixels", async ({ appBar }, height: number) => {
  expect(appBar.initial.height).toBeGreaterThan(height);
  await appBar.expectState({ height });
});

When("the user drags the scrollbar down by half the collapse distance", async ({ appBar }) => {
  await appBar.hold();
  await appBar.partialCollapse();
});
When("the user drags the scrollbar back to {int} pixels from the top", async ({ appBar }, scrollTop: number) =>
  appBar.scroll(scrollTop),
);
Then("the bar height is reduced by the distance scrolled", async ({ appBar }) => {
  const { scrollTop } = await appBar.read();
  expect(scrollTop).toBeGreaterThan(0);
  expect(scrollTop).toBeLessThan(appBar.initial.height - smallHeight);
  await appBar.expectState({ height: appBar.initial.height - scrollTop });
});

When("the user scrolls down and back to the top three times", async ({ appBar }) => {
  for (let cycle = 0; cycle < 3; cycle++) {
    await appBar.scroll(fullScroll);
    await appBar.expectState({ height: smallHeight });
    await appBar.scroll(0);
    await appBar.expectState({ height: appBar.initial.height });
  }
});
Then("the bar reaches the small height on each descent and restores its full height on each return", async ({ appBar }) =>
  appBar.expectState({ height: appBar.initial.height, scrollTop: 0 }),
);

Given('the app bar is small and in "compress" mode', async ({ appBar }) => appBar.related({ size: "small", mode: "compress" }));
When("the user scrolls down", async ({ appBar }) => appBar.scroll(fullScroll));
Then("the bar keeps its original height and surface styles", async ({ appBar }) =>
  appBar.expectState({ height: appBar.initial.height, red: normalColor, shadowOffset: 0 }),
);

Given('the app bar is a centered large bar with a title and subtitle in "compress" mode', async ({ appBar }) =>
  appBar.related({ size: "large", mode: "compress", centered: true }),
);
When("the user begins collapsing the bar", async ({ appBar }) => {
  await appBar.hold();
  await appBar.partialCollapse(0.25);
});
Then("the title and subtitle have moved upward and are partly faded", async ({ appBar }) => {
  const { labelOpacity, labelTop } = await appBar.read();
  expect(labelTop).toBeLessThan(appBar.initial.labelTop - 5);
  expect(labelOpacity).toBeGreaterThan(0.3);
  expect(labelOpacity).toBeLessThan(0.7);
});

When("the user scrolls down through the collapse", async ({ appBar }) => appBar.partialCollapse());
Then("the title and subtitle slide and fade out as the bar shrinks", async ({ appBar }) => {
  await appBar.expectState({ labelOpacity: 0 });
  const midway = await appBar.read();
  expect(midway.height).toBeLessThan(appBar.initial.height);
  expect(midway.labelTop).toBeLessThan(appBar.initial.labelTop);
});

Then("the title and subtitle fade back in within the compact row", async ({ appBar }) => {
  await appBar.expectState({ height: smallHeight, labelOpacity: 1 });
});
Then("they remain centered in the compact row", async ({ appBar }) => expectCentered(appBar));
Then("the title and subtitle return to their expanded positions", async ({ appBar }) =>
  appBar.expectState({ height: appBar.initial.height, labelTop: appBar.initial.labelTop, labelOpacity: 1 }),
);

Given('the app bar is a large bar in "compress" mode with distinct normal and on-scroll colors and elevations', async ({ appBar }) =>
  appBar.related({ size: "large", mode: "compress" }),
);
When("the bar is partway through collapsing", async ({ appBar }) => {
  await appBar.hold();
  await appBar.partialCollapse();
});
Then("its color and elevation are between their normal and on-scroll values", async ({ appBar }) => {
  const midway = await appBar.read();
  expect(midway.red).toBeGreaterThan(scrolledColor);
  expect(midway.red).toBeLessThan(normalColor);
  expect(midway.shadowOffset).toBeCloseTo(5, 0);
});

When("the bar is fully collapsed", async ({ appBar }) => {
  await appBar.scroll(fullScroll);
  await appBar.expectState({ height: smallHeight });
});
Then("it uses the configured on-scroll color and elevation", async ({ appBar }) =>
  appBar.expectState({ red: scrolledColor, shadowOffset: 10 }),
);

Given('the app bar is a large bar in "compress" mode with no custom on-scroll elevation', async ({ appBar }) =>
  appBar.show({ size: "large", mode: "compress", container: "linked" }),
);
Then("the bar casts no visible shadow", async ({ appBar }) => appBar.expectState({ shadowVisible: false }));
Then("it uses the on-scroll color", async ({ appBar }) => appBar.expectState({ red: scrolledColor }));

Given("the app bar is fully collapsed and its container is scrolled far from the top", async ({ appBar }) => {
  await appBar.related({ size: "large", mode: "compress" });
  await appBar.scroll(fullScroll);
  await appBar.expectState({ height: smallHeight });
});
When("the user scrolls up but remains far from the top", async ({ appBar }) => appBar.scroll(fullScroll - 50));
Then("the bar stays fully collapsed", async ({ appBar }) => appBar.expectState({ height: smallHeight }));

When("the user scrolls near enough to the top", async ({ appBar }) => {
  await appBar.hold();
  await appBar.partialCollapse();
});
Then("the bar starts to expand", async ({ appBar }) => {
  const { height } = await appBar.read();
  expect(height).toBeGreaterThan(smallHeight);
  expect(height).toBeLessThan(appBar.initial.height);
});

Given('an expanded app bar in "compress" mode in a browser that supports "scrollend"', async ({ appBar }) => {
  test.skip(!(await appBar.supportsScrollEnd()), "scrollend is not supported");
  await appBar.related({ size: "large", mode: "compress" });
});
When("the user scrolls down in two short movements separated by pauses without a scroll-end notification", async ({ appBar }) => {
  await appBar.installClock();
  await appBar.suppressScrollEnd();
  for (const scrollTop of [10, 12]) {
    await appBar.scroll(scrollTop);
    await appBar.advanceClock(400);
    await appBar.expectState({ height: appBar.initial.height - scrollTop, scrollTop });
  }
});
Then("the bar stays partially collapsed at both scroll positions", async ({ appBar }) =>
  appBar.expectState({ height: appBar.initial.height - 12, scrollTop: 12 }),
);

When("the user scrolls partially down and the browser reports scrolling has ended", async ({ appBar }) => {
  await appBar.scrollUntilEnd(10);
});
When("the user scrolls slightly up and the browser reports scrolling has ended", async ({ appBar }) => {
  await appBar.scrollUntilEnd((await appBar.read()).scrollTop - 2);
});

Given('an app bar in "compress" mode that is partway between expanded and collapsed', async ({ appBar }) => {
  await appBar.related({ size: "large", mode: "compress" });
  await appBar.hold();
  await appBar.partialCollapse();
});
Given("the associated container has room to scroll in the direction of the snap", async ({ appBar }) => {
  const { scrollTop, scrollHeight, clientHeight } = await appBar.readScrollLimits();
  expect(scrollTop).toBeGreaterThan(0);
  expect(scrollHeight - clientHeight - scrollTop).toBeGreaterThan(appBar.initial.height);
});
When("scrolling ends after the user last scrolled {string}", async ({ appBar }, direction: string) => {
  if (direction === "up") await appBar.scroll((await appBar.read()).scrollTop - 8);
  const { height, scrollTop } = await appBar.read();
  appBar.snapStart = scrollTop;
  appBar.snapStartHeight = height;
  await appBar.release();
});
Then("the bar settles {string}", async ({ appBar }, state: string) =>
  appBar.expectState({ height: state === "fully collapsed" ? smallHeight : appBar.initial.height }),
);
Then("the scroll position moves {string} by the remaining change in bar height", async ({ appBar }, direction: string) => {
  const { height, scrollTop } = await appBar.read();
  const distance = scrollTop - appBar.snapStart;
  expect(direction === "down" ? distance : -distance).toBeGreaterThan(0);
  expect(distance).toBe(appBar.snapStartHeight - height);
});

Given('an app bar in "compress" mode that is partway through collapsing while the user is {string}', async ({ appBar }, gesture: string) => {
  await appBar.related({ size: "large", mode: "compress" });
  await appBar.installClock();
  await appBar.hold(gesture);
  await appBar.partialCollapse();
  appBar.snapStart = (await appBar.read()).scrollTop;
});
When("the scroll position briefly stops changing", async ({ appBar }) => appBar.advanceClock(500));
Then("the bar does not snap while that input is held", async ({ appBar }) =>
  appBar.expectState({ height: appBar.initial.height - appBar.snapStart, scrollTop: appBar.snapStart }),
);

When("the user releases the input and scrolling ends", async ({ appBar }) => {
  await appBar.release();
  await appBar.advanceClock(500);
});
Then("the bar finishes collapsing", async ({ appBar }) => appBar.expectState({ height: smallHeight }));
