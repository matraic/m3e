import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { test as componentTest } from "../fixtures";
import { InteractionCarouselHarness } from "./carousel-interaction.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  interactionCarousel: InteractionCarouselHarness;
}>({
  hasTouch: async ({ $tags }, use) => use($tags.includes("@interaction-touch")),
  isMobile: async ({ $tags }, use) => use($tags.includes("@interaction-touch")),
  interactionCarousel: async ({ page, render }, use, testInfo) => {
    const harness = new InteractionCarouselHarness(page, render);
    try {
      await use(harness);
      if (testInfo.status === "passed") await harness.finish();
    } finally {
      await harness.dispose();
    }
  },
});
const { Given, When, Then } = createBdd(test);

Given(
  "an interaction carousel {string} initialized at selected index one",
  async ({ interactionCarousel }, tag: string) =>
    interactionCarousel.start(interactionCarousel.selectedIndexNavigation(tag as "m3e-carousel" | "m3e-carousel-grid")),
);

Then("the interaction carousel selectedIndex property is one", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel selectedIndex property is set to two", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel reflects index two without emitting change", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel moves to the next item through its API", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel reflects index three and emits change", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("an interaction carousel grid of five destinations between outside buttons", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.responsiveGridNavigation()),
);

Then(
  "the interaction carousel grid exposes its name, three rows, two columns and four-to-three cells",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel grid receives a change listener and keyboard entry", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid enters on its first action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel grid is navigated right, down, left and down before tabbing out",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("focus leaves the interaction carousel grid through the following button", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid exposes five items through its API", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid moves to index three through its API", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid reports index three and its change event", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid moves previous and next", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid returns to index three", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid narrows to three hundred pixels", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid reflows to five single-column rows", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel grid with inherited sizing in {string}",
  async ({ interactionCarousel }, direction: string) =>
    interactionCarousel.start(interactionCarousel.gridSizingThresholds(direction as "ltr" | "rtl")),
);

Then("the interaction carousel grid initially has two columns", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel grid runs all thirteen fractional, percentage and calculated sizing thresholds",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When(
  "the interaction carousel grid reconnects with two-hundred-pixel cells and sixteen-pixel gaps",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the interaction carousel grid reconnects with three columns and three rows", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("three interaction carousel grids sharing inherited minimum widths and gaps", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.simultaneousGridSizing()),
);

Then("all interaction carousel grids initially expose two columns", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel grids resize and change inherited percentage sizing under layout tracing",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("all interaction carousel grids expose three columns without forced layout", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel grid in a two-hundred-forty-pixel scroll container in {string}",
  async ({ interactionCarousel }, direction: string) =>
    interactionCarousel.start(interactionCarousel.scrollContainerGridPaging(direction as "ltr" | "rtl")),
);

Then("the scroll-contained interaction carousel grid has three columns", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid pages down from its second action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel grid focuses its eighth action and selects index seven",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel grid pages back up", async ({ interactionCarousel }) => interactionCarousel.advance());

Then("the interaction carousel grid restores focus to its second action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid disables its eighth action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid exposes the eighth action as disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid pages down past its disabled action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid focuses the seventh action instead", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel grid disables the adjacent actions and pages through the empty row",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the interaction carousel grid focuses the eleventh action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid pages up from the eleventh action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid focuses the fifth action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel grid exercises its final row, first row and modified paging boundaries",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the interaction carousel grid still has exactly one Tab stop", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel grid in a three-hundred-sixty-pixel document viewport",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.documentViewportGridPaging()),
);

Then("the document-paged interaction carousel grid exposes two columns", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the document-paged interaction carousel grid pages down from its second action",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the document-paged interaction carousel grid focuses its eighth action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the document-paged interaction carousel grid pages up", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the document-paged interaction carousel grid restores its second action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("an interaction carousel grid with local rtl direction inside an ltr document", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.documentDirectionGridNavigation()),
);

When("the interaction carousel grid moves right from Coast", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel grid selects Forest at index one", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel grid with three destinations and a removal destination",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.hiddenAndRemovedGridItems()),
);

Then("the destination interaction carousel grid initially has two rows", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid hides Forest", async ({ interactionCarousel }) => interactionCarousel.advance());

Then("the interaction carousel grid has one row and two exposed cells", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid reveals Forest again", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the destination interaction carousel grid returns to two rows", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel grid moves Coast outside and removes the grid", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the removed interaction carousel grid item has no managed slot or column index",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("an interaction carousel checking navigation across every layout", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.absentBuiltInNavigation()),
);

When("the interaction carousel renders the next layout without external navigation", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel has no built-in next or previous buttons", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("an interaction carousel containing Coast and an unsupported direct child", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.unsupportedChildren()),
);

Then("the interaction carousel hides unsupported content and exposes only Coast", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("a named hero interaction carousel with three destinations", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.horizontalGridSemantics()),
);

Then(
  "the interaction carousel exposes grid, row, cell and action semantics without redundant labels",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("a named fullscreen interaction carousel with three destinations", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.fullscreenGridSemantics()),
);

Then("the interaction carousel exposes three rows and one column", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the fullscreen interaction carousel changes to hero", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel exposes one row and restores cell column indices", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel with a Coast link and an explicitly labeled tour button",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.liveLinkActions()),
);

Then(
  "the interaction carousel link has its full accessible name, href, target and rel",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel Coast link loses its href", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel Coast action becomes a named button", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel Coast button is marked disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel Coast button is disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel Coast action regains its href while disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the disabled interaction carousel link has no active anchor", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel Coast link is enabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel Coast anchor is restored", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel link records clicks and receives a Space keydown", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel link retains its resting shape during Space", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Space is released on the interaction carousel link", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("Space does not activate the interaction carousel link", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Enter is pressed on the interaction carousel link", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel link retains its resting shape during Enter", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Enter is released on the interaction carousel link", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("Enter activates the interaction carousel link once", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "a twelve-item interaction carousel using {string} in {string} with a twelve-hundred-pixel viewport",
  async ({ interactionCarousel }, variant: string, direction: string) =>
    interactionCarousel.start(
      interactionCarousel.viewportPaging(
        variant as "multi-browse" | "hero" | "hero-centered",
        direction as "ltr" | "rtl",
      ),
    ),
);

When("the wide interaction carousel pages down from its first action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the wide interaction carousel focuses and selects its geometry-derived destination",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the wide interaction carousel pages up twice", async ({ interactionCarousel }) => interactionCarousel.advance());

When("the wide interaction carousel disables its page destination", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the wide interaction carousel exposes its page destination as disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the wide interaction carousel pages down past the disabled destination", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the wide interaction carousel focuses and selects the next enabled destination",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When(
  "the wide interaction carousel exercises End, reverse paging and modified paging",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the wide interaction carousel maintains one Tab stop", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an eight-item interaction carousel using fixed {string} geometry",
  async ({ interactionCarousel }, variant: string) =>
    interactionCarousel.start(interactionCarousel.fixedGeometryPaging(variant as "uncontained" | "fullscreen")),
);

When("the fixed-geometry interaction carousel pages down from its first action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the fixed-geometry interaction carousel focuses its destination and scrolls to the exact page offset",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the fixed-geometry interaction carousel pages back up", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the fixed-geometry interaction carousel focuses its first action again", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel using {string} between two outside buttons and recording clicks",
  async ({ interactionCarousel }, variant: string) =>
    interactionCarousel.start(
      interactionCarousel.singleTabStopNavigation(
        variant as "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen",
      ),
    ),
);

When("keyboard focus enters the interaction carousel from the preceding button", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "all five interaction carousel actions become focused, selected and fully visible in arrow order",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel receives one more forward arrow", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel stays on its last action with one Tab stop and no activation",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("keyboard focus tabs out of the interaction carousel and returns", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel remembers its last action as the Tab entry", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel receives Home twice and reverse Tab", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("keyboard focus leaves the interaction carousel through the preceding button", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an animated interaction carousel using {string} with gutters in {string}",
  async ({ interactionCarousel }, variant: string, direction: string) =>
    interactionCarousel.start(
      interactionCarousel.animatedArrowRetargeting(
        variant as "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen",
        direction as "ltr" | "rtl",
      ),
    ),
);

When(
  "the interaction carousel samples its first forward-arrow animation over four-hundred-fifty milliseconds",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "the interaction carousel focuses immediately while scrolling through multiple intermediate frames",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When(
  "the interaction carousel rapidly retargets through End, Home and two forward arrows",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "the interaction carousel focuses index two immediately and settles at its exact geometry offset",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("a reduced-motion interaction carousel using {string}", async ({ interactionCarousel }, variant: string) =>
  interactionCarousel.start(interactionCarousel.reducedMotionArrowNavigation(variant as "hero" | "fullscreen")),
);

When("the reduced-motion interaction carousel receives End", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the reduced-motion interaction carousel instantly reveals and focuses its final action",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "a hero interaction carousel between outside buttons with its second item disabled",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.repairingKeyboardEntry()),
);

When("keyboard focus enters the interaction carousel with a disabled second item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("arrows skip the disabled interaction carousel action in both directions", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel disables its focused first item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel repairs focus to its third action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel removes its focused third action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel repairs focus to Item 4 and reports four columns", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel hides its focused Item 4", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel repairs focus to Item 5 and reports three columns", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel enables its first item again", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel has one Tab stop and Home returns to its first action",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "a hero interaction carousel between outside buttons with its second action remembered",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.rememberedTabEntry()),
);

When("the interaction carousel scrolls through moveTo, movePrevious and moveNext", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel selects its last item without stealing second-action focus",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("keyboard focus leaves the scrolled interaction carousel and tabs back", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel restores its second action and selects index one", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("a hero interaction carousel recording first-item activations", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.sharedKeyboardFeedback()),
);

When("the interaction carousel first action receives Enter and Space", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel activates twice and attaches ripple, focus-ring and state-layer controls",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel disables and programmatically clicks its first item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the disabled interaction carousel item does not activate again", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("keyboard focus tabs from the interaction carousel viewport", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel enters on its second enabled action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an uncontained interaction carousel with one-hundred-sixty-pixel items in {string}",
  async ({ interactionCarousel }, direction: string) =>
    interactionCarousel.start(interactionCarousel.uncontainedEdgeMasks(direction as "ltr" | "rtl")),
);

When("the interaction carousel computes expected edge masks and viewport bounds", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "all eight forward and reverse interaction carousel scroll samples match masks, positions and fixed content widths",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "an interaction carousel using {string} with preferred three-hundred-twenty-pixel items and gutters in {string}",
  async ({ interactionCarousel }, variant: string, direction: string) =>
    interactionCarousel.start(
      interactionCarousel.gutterAdjustedGeometry(
        variant as "multi-browse" | "hero" | "hero-centered" | "uncontained",
        direction as "ltr" | "rtl",
      ),
    ),
);

When(
  "the interaction carousel grows to four-hundred-fifty-two by two-hundred-sixteen pixels",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "interaction carousel indices zero, two and four fit exact gutter-adjusted geometry and gutters do not hit items",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "an animated eight-item hero interaction carousel in {string}",
  async ({ interactionCarousel }, direction: string) =>
    interactionCarousel.start(interactionCarousel.completeScrollExtent(direction as "ltr" | "rtl")),
);

Then("the interaction carousel initially has the complete eight-item scroll extent", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel swipes through two-hundred and six-hundred pixels", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel cancels the swipe and hides its last item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel updates to the complete seven-item scroll extent", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an animated interaction carousel using {string} with one-hundred-eighty-six-pixel preferred items and gutters in {string}",
  async ({ interactionCarousel }, variant: string, direction: string) =>
    interactionCarousel.start(
      interactionCarousel.gutteredClickTransitionFrames(
        variant as "multi-browse" | "hero" | "hero-centered" | "uncontained",
        direction as "ltr" | "rtl",
      ),
    ),
);

When("the guttered interaction carousel widens and moves to its last item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the guttered interaction carousel reaches its full scroll extent", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel begins monitoring every visible action frame", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel has a visible earlier preview to select", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel computes the preview destination and clicks it", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel selects and settles on the clicked preview", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel stops monitoring after two additional animation frames",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "more than three interaction carousel frames were sampled with less than one pixel of gutter overflow",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "an interaction carousel using {string} with square items and red outward focus rings",
  async ({ interactionCarousel }, variant: string) =>
    interactionCarousel.start(interactionCarousel.outwardFocusAndShadows(variant as "hero" | "uncontained" | "grid")),
);

When("the interaction carousel captures its resting shadow and hovers its action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel hover shadow renders outside the action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel removes hover, captures its resting ring and enters by Tab",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the interaction carousel focus ring is outward and visible", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel focus-ring animation pauses at its midpoint", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel six-pixel ring renders outside without changing action bounds",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("a fullscreen interaction carousel with default gutters enabled", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.edgeToEdgeFullscreen()),
);

Then(
  "the interaction carousel action fills its viewport with no padding and inward focus",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the fullscreen interaction carousel action is hovered", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the fullscreen interaction carousel hover does not elevate", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the edge-to-edge interaction carousel changes to hero", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel restores hero gutters and outward focus", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("a guttered hero interaction carousel with viewport bounds recorded", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.liveGutterOverrides()),
);

When("the interaction carousel focuses its first action and navigates to End", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel focuses its final action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "all three interaction carousel gutter overrides reflow the final action while preserving focus and selection",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the gutter-overridden interaction carousel navigates Home", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the gutter-overridden interaction carousel focuses its first action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "a guttered hero interaction carousel containing directly slotted {string} media",
  async ({ interactionCarousel }, tag: string) =>
    interactionCarousel.start(interactionCarousel.slottedMediaSizing(tag as "img" | "video")),
);

Then(
  "the interaction carousel media fills its content with centered cover styling while its action is masked",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel moves to its media preview", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel reveals the media action without resizing its media", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel media receives author width, height and object-fit overrides",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "the interaction carousel media respects eighty-by-sixty contain styling aligned to the top left",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel media is nested inside a wrapper", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "nested interaction carousel media returns to its native dimensions and object-fit",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "an animated multi-browse interaction carousel with Coast title and subtitle overlays in {string}",
  async ({ interactionCarousel }, direction: string) =>
    interactionCarousel.start(interactionCarousel.maskDrivenOverlayFading(direction as "ltr" | "rtl")),
);

Then(
  "the interaction carousel overlay visibility follows full, intermediate and small masks without losing accessible names",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel samples overlays halfway to its second item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel partially fades overlays without resizing text or media and keeps a sixteen-pixel bottom inset",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("a hero interaction carousel with title and subtitle previews", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.restoredOverlayVisibility()),
);

Then("the interaction carousel preview overlays initially are hidden", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel changes through uncontained, fullscreen, centered hero and hero layouts",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel enables reduced motion", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel preview overlays become visible", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel restores animation", async ({ interactionCarousel }) => interactionCarousel.advance());

Then("the interaction carousel preview title fades again", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel preview item is removed to the document body", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the removed interaction carousel item restores both overlays", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "a two-item hero interaction carousel with default overlay typography recorded",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.overlayTypographyOverrides()),
);

When("the interaction carousel overrides inherited overlay font sizes and colors", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel title and subtitle use independent inherited sizes and colors",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When(
  "the interaction carousel first subtitle receives item-specific typography and color",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "the interaction carousel subtitle override leaves its title and sibling subtitle unchanged",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel removes item and inherited overlay overrides", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel restores default typography and shared text color", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("a hero interaction carousel with white media and title and subtitle text", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.configurableTextScrim()),
);

Then("the interaction carousel media loads and its scrim initially is transparent", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel captures top, bottom and media bounds and enables a blue scrim",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "the interaction carousel blue scrim has opacity 0.65 and changes only the bottom pixels",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel scrim opacity is reset to zero", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel original bottom pixels return", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "a multi-browse interaction carousel with {string} slots and scrim opacity 0.8",
  async ({ interactionCarousel }, slots: string) =>
    interactionCarousel.start(
      interactionCarousel.assignedTextScrims(slots as "title" | "subtitle" | "title and subtitle"),
    ),
);

Then(
  "the interaction carousel initial scrim opacities follow its assigned slots and masks",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel moves to its third text item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel selected text item scrim has opacity 0.8", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel selected text item loses its assigned children", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel selected text item scrim clears", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel selected text item restores its assigned children", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel selected text item scrim returns to opacity 0.8", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "a hero interaction carousel with black specification outlines and red feedback",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.specificationFeedbackColors()),
);

Then("the interaction carousel resting outline is one pixel and black", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the specification-colored interaction carousel action is hovered", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel hover uses red eight-percent feedback and preserves its black outline",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the specification-colored interaction carousel receives keyboard focus", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel focus uses red ten-percent feedback and preserves its black outline",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("Space is held on the specification-colored interaction carousel", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel uses a red ten-percent pressed ripple without a pressed state layer",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("Space is released on the specification-colored interaction carousel", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the specification-colored interaction carousel content dimensions do not change",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the specification-colored interaction carousel item is disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel disabled outline uses twelve-percent black", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel image {string} with black outline using {string} input",
  async ({ interactionCarousel }, actionType: string, input: string) =>
    interactionCarousel.start(
      interactionCarousel.pointerActivationOutlines(input as "mouse" | "touch", actionType as "button" | "link"),
    ),
);

When("the interaction carousel image action is activated by its configured pointer", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel image action releases its pressed state with a black outline and no visible focus ring",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel image action receives keyboard Tab entry", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel image action is focused with its black outline and visible focus ring",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "a hero interaction carousel with inherited custom outline and feedback colors",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.inheritedFeedbackOverrides()),
);

Then("the interaction carousel resting outline uses its orange override", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the custom-colored interaction carousel action is hovered", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel hover uses cyan outlines and twenty-five-percent blue feedback",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the custom-colored interaction carousel receives keyboard focus", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel focus uses orange outlines and twenty-percent green feedback",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("Space is held on the custom-colored interaction carousel", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel press uses green outlines and thirty-three-percent yellow ripple",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When(
  "the interaction carousel pressed item receives blue seventy-five-percent ripple overrides",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the interaction carousel pressed ripple uses its item-specific overrides", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Space is released on the custom-colored interaction carousel", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the custom-colored interaction carousel content dimensions do not change", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the custom-colored interaction carousel item is disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel disabled outline uses fifty-percent blue", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel outline width is set to zero", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel removes its outline without resizing content", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("a multi-browse interaction carousel with instantaneous elevation transitions", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.maskedHoverElevation()),
);

When(
  "the interaction carousel records masked bounds and resting shadow pixels then hovers the preview",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "the interaction carousel elevated shadow changes outside pixels without resizing action or content",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the elevated interaction carousel preview is disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel restores resting elevation and outside pixels", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "a hero interaction carousel with first-action content and corner hit testing prepared",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.visiblePressedCorners()),
);

Then("the resting interaction carousel rounded corner is not an action hit target", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel first action receives a held mouse press", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel sixteen-pixel pressed corner becomes hittable without resizing content",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel mouse press is released", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel restores its twenty-eight-pixel non-hittable corner", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel first action receives a touch pointerdown", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel touch press uses a sixteen-pixel corner", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel viewport cancels the touch pointer", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel canceled press restores its twenty-eight-pixel corner",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("a hero interaction carousel with a paused clock for quick pointer taps", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.quickPointerPressDuration()),
);

When("the interaction carousel receives its next quick mouse or touch tap", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel pointer tap stays pressed through 224 milliseconds and releases at 225 milliseconds",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given(
  "a focused hero interaction carousel with a paused clock for quick Space presses",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.quickSpaceAndSwipeCancellation()),
);

When("the interaction carousel receives a quick Space press", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel Space press stays pressed through 224 milliseconds and releases at 225 milliseconds",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel receives a held touch pointer", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel held touch pointer is pressed", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel begins a swipe while pressed", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel swipe cancels its pressed shape immediately", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the pressed-shape interaction carousel swipe is canceled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("a reduced-motion hero interaction carousel recording first-item clicks", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.roundedCornerActivation()),
);

When("the interaction carousel first action is clicked outside its rounded corner", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel corner click does not activate its item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel first action is clicked at its center", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel center click activates its item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given("a focused hero interaction carousel ready for keyboard pressed-shape checks", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.keyboardPressedShapeRestoration()),
);

When("Space is held on the interaction carousel first action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel held Space uses a sixteen-pixel shape", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Space is released on the interaction carousel first action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel released Space restores a twenty-eight-pixel shape", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Enter is held on the interaction carousel first action", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel held Enter keeps a twenty-eight-pixel shape", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When(
  "the interaction carousel releases Enter, holds Space and moves focus to its viewport",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then("the interaction carousel focus loss restores a twenty-eight-pixel shape", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel releases Space, refocuses and holds Space again", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel refocused Space press uses a sixteen-pixel shape", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel disables its keyboard-pressed item", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the disabled interaction carousel keyboard press restores a twenty-eight-pixel shape",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel releases Space and dispatches a disabled mouse press", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the disabled interaction carousel mouse press keeps a twenty-eight-pixel shape",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("a reduced-motion hero interaction carousel ready for custom pressed corners", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.customPressedShapes()),
);

When("the interaction carousel uses an eight-pixel resting corner and holds Space", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel pressed corner is capped at eight pixels", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel pressed morph is overridden to four pixels", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel uses a four-pixel corner without transition", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Space is released on the custom-corner interaction carousel", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel custom resting corner returns to eight pixels", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("a fullscreen interaction carousel is rendered and receives a held Space press", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the fullscreen interaction carousel pressed corner remains square", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("Space is released on the square fullscreen interaction carousel", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "an interaction carousel using {string} in {string} and recording preview clicks",
  async ({ interactionCarousel }, variant: string, direction: string) =>
    interactionCarousel.start(
      interactionCarousel.clickedPreviewSelection(
        variant as "multi-browse" | "hero" | "hero-centered",
        direction as "ltr" | "rtl",
      ),
    ),
);

When("the interaction carousel presses its next visible preview", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel preview press leaves the selected index unchanged", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the interaction carousel releases its preview press", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then(
  "the interaction carousel selects the clicked preview once and fully reveals it",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Given("a hero interaction carousel with its second preview disabled", async ({ interactionCarousel }) =>
  interactionCarousel.start(interactionCarousel.disabledPreviewSelection()),
);

Then("the interaction carousel second preview action is disabled", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

When("the disabled interaction carousel preview is clicked at its visible center", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel stays at index zero with zero scroll", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Given(
  "a hero interaction carousel recording click and pressed-state transitions during dragging",
  async ({ interactionCarousel }) => interactionCarousel.start(interactionCarousel.dragClickSuppression()),
);

When(
  "the interaction carousel is mouse-dragged from three-hundred to fifty pixels in eight steps",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

Then(
  "the interaction carousel cancels pressed shape, suppresses clicks and settles at its second item",
  async ({ interactionCarousel }) => interactionCarousel.advance(),
);

When("the interaction carousel receives the next click after dragging", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);

Then("the interaction carousel permits that next click exactly once", async ({ interactionCarousel }) =>
  interactionCarousel.advance(),
);
