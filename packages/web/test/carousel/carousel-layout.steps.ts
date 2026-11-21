import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { test as componentTest } from "../fixtures";
import { CarouselLayoutHarness } from "./carousel-layout.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  layoutCarousel: CarouselLayoutHarness;
}>({
  layoutCarousel: async ({ page, render }, use, testInfo) => {
    const harness = new CarouselLayoutHarness(page, render);
    try {
      await use(harness);
      if (testInfo.status === "passed") await harness.assertComplete();
    } finally {
      await harness.dispose();
    }
  },
});
const { Given, When, Then } = createBdd(test);
type Direction = "ltr" | "rtl";
type Variant = "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen";

Given("a layout carousel with a 186px multi-browse preference", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.responsive()),
);
Then("the layout carousel starts with two full items and a 40px preview", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the responsive layout carousel widens to 800px", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel reveals more of its third item", async ({ layoutCarousel }) => layoutCarousel.advance());

Given(
  "a layout carousel in {string} with {string} multi-browse sizing",
  async ({ layoutCarousel }, direction: Direction, sizing: string) =>
    layoutCarousel.start(layoutCarousel.leadingShrink(direction, sizing)),
);
When("a pointer drag starts on the leading layout carousel item", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "the layout carousel shrinks to small size before partial clipping through every drag fraction",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("an animated uncontained layout carousel with 160px items", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.uncontainedSwipe()),
);
When("the layout carousel receives a real 120px pointer swipe", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel scrolls more than 20px beyond its release position", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("a centered hero layout carousel with five items", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.keylines()),
);
Then("the layout carousel first item starts at the leading edge", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the keyline layout carousel selects its middle item", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel middle item settles at 210px", async ({ layoutCarousel }) => layoutCarousel.advance());
When("the keyline layout carousel selects its last item", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel reaches maximum scroll and the trailing edge", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given(
  "an animated multi-browse layout carousel in {string} with a {int}px preference",
  async ({ layoutCarousel }, direction: Direction, size: number) =>
    layoutCarousel.start(layoutCarousel.multiPreviews(direction, size)),
);
Then("layout carousel selections 0, 1, 3 and 4 preserve full items and ordered previews", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the preview layout carousel selects item 7", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel shifts ordered previews to the start and fills the end", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given(
  "a 583px layout carousel in {string} with six 198px preferred items",
  async ({ layoutCarousel }, direction: Direction) => layoutCarousel.start(layoutCarousel.trailingSwipe(direction)),
);
Then("layout carousel selections 2 through 5 keep trailing content beyond 581.5px", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the trailing layout carousel begins a swipe from selection 2", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("every layout carousel swipe sample fills the end and moves item 4 forward", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("a fully selectable multi-browse layout carousel in {string}", async ({ layoutCarousel }, direction: Direction) =>
  layoutCarousel.start(layoutCarousel.everySelection(direction)),
);
When("the layout carousel selects all eight items and checks each visible extent", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel final item aligns within 1.5px of the end", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("a start-aligned hero layout carousel with five items", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.startHero()),
);
When("the start-aligned layout carousel geometry is measured", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel shows a smaller positive preview across an 8px gap", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given(
  "a {string} layout carousel in {string} selected at item 2",
  async ({ layoutCarousel }, variant: Variant, direction: Direction) =>
    layoutCarousel.start(layoutCarousel.roundedCuts(variant, direction)),
);
When("a synthetic drag starts on the rounded-surface layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "both layout carousel viewport cuts preserve rounded hit areas and fixed content width",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("a default multi-browse action layout carousel in {string}", async ({ layoutCarousel }, direction: Direction) =>
  layoutCarousel.start(layoutCarousel.firstActionClip(direction)),
);
When("a synthetic drag starts on the first-action layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel action clips only after its surface reaches small size", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given(
  "a {string} layout carousel in {string} with 320px preferred items",
  async ({ layoutCarousel }, variant: Variant, direction: Direction) =>
    layoutCarousel.start(layoutCarousel.wideHero(variant, direction)),
);
Then("the narrow layout carousel has one large item and its variant previews", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the wide-hero layout carousel widens to 960px", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel has three large items at the start, middle and end", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("an animated centered-hero preview-limit layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.cssLimits()),
);
When("the layout carousel small-item minimum and maximum become 4rem", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel next preview becomes 64px", async ({ layoutCarousel }) => layoutCarousel.advance());
When("the preview-limit layout carousel selects its middle item", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("both layout carousel previews remain 64px beside a larger selected item", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("an animated centered-hero two-swipe layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.twoSwipes()),
);
When("the layout carousel swipes twice and checks each selection and adjacent preview", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "the layout carousel middle selection retains both original previews of at least 39px",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("an animated hero percentage-limit layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.percentageLimit()),
);
When("the layout carousel large-item maximum becomes 50 percent", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "the layout carousel shows two equally large items and a 39px to 57px trailing preview",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given(
  "a rounded-preview {string} layout carousel in {string}",
  async ({ layoutCarousel }, variant: Variant, direction: Direction) =>
    layoutCarousel.start(layoutCarousel.roundedPreviews(variant, direction)),
);
When("the rounded-preview layout carousel begins checking selection 0", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "layout carousel selections 0, 2 and 4 keep the expected rounded previews within the viewport",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("a reduced-motion last-item hero layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.lastHero()),
);
When("the last-item layout carousel selects item 4", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel last right edge is within 1.5px of 420px", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("a hero mask layout carousel with initial geometry recorded", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.heroMasks()),
);
When("the layout carousel pointer moves 90px while held down", async ({ layoutCarousel }) => layoutCarousel.advance());
Then(
  "the layout carousel scroll exceeds 50px and its incoming mask grows without resizing content",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given(
  "an incoming-item {string} layout carousel in {string}",
  async ({ layoutCarousel }, variant: Variant, direction: Direction) =>
    layoutCarousel.start(layoutCarousel.incomingHero(variant, direction)),
);
When("the layout carousel pointer drags halfway to the next keyline", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "the layout carousel exchanges visible sizes with an 8px gap and a small third preview",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given(
  "an 800px {string} layout carousel at item 1 using {string} navigation",
  async ({ layoutCarousel }, variant: Variant, action: "button" | "swipe") =>
    layoutCarousel.start(layoutCarousel.departedPreview(variant, action)),
);
When("the layout carousel advances and records departed-preview frames for 900ms", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "the layout carousel preview shrinks monotonically and never returns after departure",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("a single-item centered hero layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.singleHero()),
);
When("the single-item layout carousel geometry is measured", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel only item is 420px visible with no scroll range", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("an empty hero layout carousel", async ({ layoutCarousel }) => layoutCarousel.start(layoutCarousel.emptyHero()));
When("a first item is appended to the layout carousel", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel added item becomes 420px visible", async ({ layoutCarousel }) => layoutCarousel.advance());

Given("a {string} layout carousel with eight 180px preferred items", async ({ layoutCarousel }, variant: Variant) =>
  layoutCarousel.start(layoutCarousel.smallerPreferredHero(variant)),
);
When("the smaller-preference layout carousel widens to 800px and selects item 3", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel has at least two equally largest fully visible items", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given(
  "a guttered 932px centered hero layout carousel in {string} with four items",
  async ({ layoutCarousel }, direction: Direction) => layoutCarousel.start(layoutCarousel.shortWideHero(direction)),
);
When("the short layout carousel pointer goes down at its center", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then(
  "every layout carousel item advances monotonically through 12px, 24px, 36px and 48px drags",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("an uncontained layout carousel with a 600px item preference", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.uncontainedCap()),
);
When("the capped layout carousel geometry is measured", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel first item width and visible size are 420px", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("an uncontained layout carousel with five 160px preferred items", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.variantSizing()),
);
Then("the layout carousel uses the same preference through all four horizontal variants", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the preference layout carousel switches to fullscreen with 200px height", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel fullscreen item height is 200px", async ({ layoutCarousel }) => layoutCarousel.advance());

Given("a layout carousel inheriting calc lengths inside a 600px query container", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.containerSizing()),
);
Then("the inherited layout carousel item width is 166px", async ({ layoutCarousel }) => layoutCarousel.advance());
When("the layout carousel query container shrinks to 400px", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the layout carousel item width is 192px while its viewport stays 420px", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the inherited layout carousel overrides its preference to 50 percent", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the percentage layout carousel item width is 210px", async ({ layoutCarousel }) => layoutCarousel.advance());
When("the percentage layout carousel widens to 600px", async ({ layoutCarousel }) => layoutCarousel.advance());
Then("the percentage layout carousel item width is 300px", async ({ layoutCarousel }) => layoutCarousel.advance());
When("the inherited layout carousel removes its local preference", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel restores the inherited 192px width", async ({ layoutCarousel }) => layoutCarousel.advance());

Given("a {string} layout carousel inheriting a 186px preference", async ({ layoutCarousel }, variant: Variant) =>
  layoutCarousel.start(layoutCarousel.inheritedPreference(variant)),
);
When(
  "the inherited-preference layout carousel starts the 186px, 328px and default sequence",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);
Then("each layout carousel inherited preference matches its computed arrangement", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("an uncontained layout carousel with 32 items and warmed geometry", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.duplicatePresentation()),
);
When(
  "layout carousel style access is counted across drag updates and a duplicate scroll event",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);
Then(
  "the layout carousel skips duplicate writes and invariant reads with fewer than 32 reads at 80px",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("a centered hero layout carousel with 32 items selected at item 3", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.descendantStyles()),
);
When("eight layout carousel drag frames are traced for style recalculation", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel styles a positive number of fewer than 128 elements", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given(
  "an animated tracing {string} layout carousel in {string}",
  async ({ layoutCarousel }, variant: Variant, direction: Direction) =>
    layoutCarousel.start(layoutCarousel.tracedFling(variant, direction)),
);
When("the layout carousel drags through 20 frames and flings without forced layout", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the traced layout carousel scrolls beyond 80px", async ({ layoutCarousel }) => layoutCarousel.advance());

Given(
  "a guttered 800px multi-browse tracing layout carousel in {string}",
  async ({ layoutCarousel }, direction: Direction) => layoutCarousel.start(layoutCarousel.tracedPointer(direction)),
);
When(
  "the layout carousel real pointer drag reverses and checks surface clipping without forced layout",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);
Then("the pointer-traced layout carousel has positive scroll after release", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("a rapid-reversal {string} layout carousel", async ({ layoutCarousel }, variant: Variant) =>
  layoutCarousel.start(layoutCarousel.rapidReversal(variant)),
);
When("the rapid-reversal layout carousel geometry is warmed", async ({ layoutCarousel }) => layoutCarousel.advance());
Then(
  "the layout carousel completes eight passes of triple drag updates without forced layout",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given("an animated hero layout carousel with warmed 186px preferred sizing", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.cachedNavigation()),
);
When(
  "the cached-sizing layout carousel navigates to item 7 with measurement counters installed",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);
Then(
  "the layout carousel selects item 7 without bounds or dimension reads and at most two style reads",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);

Given(
  "a 900px {string} layout carousel in {string} with titled item 2 selected",
  async ({ layoutCarousel }, variant: Variant, direction: Direction) =>
    layoutCarousel.start(layoutCarousel.resizeSelection(variant, direction)),
);
When("the layout carousel width and height change over 20 traced frames", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the resized layout carousel keeps item 2 aligned, selected and its title opaque", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given(
  "all five layout carousel variants in {string} at 900px with item 2 selected",
  async ({ layoutCarousel }, direction: Direction) =>
    layoutCarousel.start(layoutCarousel.simultaneousResize(direction)),
);
When("all layout carousels resize together across 30 traced frames", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("all layout carousels keep item 2 aligned at 465px width and 314px height", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the first layout carousel disconnects and the others resize to 600px by 300px", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the connected layout carousels keep item 2 aligned and its title opaque", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
When("the disconnected layout carousel reconnects at 600px width", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("all reconnected layout carousels independently retain selection and title opacity", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("a default eight-item multi-browse layout carousel", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.multiArrangement()),
);
When("the default arrangement layout carousel geometry is measured", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);
Then("the layout carousel shows descending positive sizes ending at 420px", async ({ layoutCarousel }) =>
  layoutCarousel.advance(),
);

Given("a centered hero layout carousel whose first item has an important scale transform", async ({ layoutCarousel }) =>
  layoutCarousel.start(layoutCarousel.hiddenItem()),
);
When("the layout carousel first item is hidden", async ({ layoutCarousel }) => layoutCarousel.advance());
Then(
  "the layout carousel excludes that item, restores its authored styles and aligns the next item",
  async ({ layoutCarousel }) => layoutCarousel.advance(),
);
