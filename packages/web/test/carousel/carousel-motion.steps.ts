import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { test as componentTest } from "../fixtures";
import { CarouselMotionHarness } from "./carousel-motion.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  motionCarousel: CarouselMotionHarness;
}>({
  motionCarousel: async ({ page, render }, use, testInfo) => {
    const harness = new CarouselMotionHarness(page, render);
    try {
      await use(harness);
      if (testInfo.status === "passed") await harness.assertComplete();
    } finally {
      await harness.close();
    }
  },
});
const { Given, When, Then } = createBdd(test);

Given(
  "a motion carousel with elastic edge resistance with variant {string} and direction {string}",
  async ({ motionCarousel }, variant: string, direction: string) => {
    await motionCarousel.begin(
      motionCarousel.edgeResistance(
        variant as "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen",
        direction as "ltr" | "rtl",
      ),
      `a motion carousel with elastic edge resistance with variant "${variant}" and direction "${direction}"`,
    );
  },
);
When("the motion carousel is pulled 40, 80 and 400 pixels beyond its start edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel is pulled 40, 80 and 400 pixels beyond its start edge");
});
Then("the motion carousel has diminishing resistance below 48 pixels at its start edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel has diminishing resistance below 48 pixels at its start edge");
});
When("the motion carousel releases its start edge with outward velocity", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases its start edge with outward velocity");
});
Then(
  "the motion carousel returns from its start edge without changing selection or emitting change",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel returns from its start edge without changing selection or emitting change",
    );
  },
);
When("the motion carousel is pulled 40, 80 and 400 pixels beyond its end edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel is pulled 40, 80 and 400 pixels beyond its end edge");
});
Then("the motion carousel has diminishing resistance below 48 pixels at its end edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel has diminishing resistance below 48 pixels at its end edge");
});
When("the motion carousel releases its end edge with outward velocity", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases its end edge with outward velocity");
});
Then(
  "the motion carousel returns from its end edge without changing selection or emitting change",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel returns from its end edge without changing selection or emitting change",
    );
  },
);

Given("a motion carousel with one hero item and click tracking", async ({ motionCarousel }) => {
  await motionCarousel.begin(motionCarousel.pointerSpring(), `a motion carousel with one hero item and click tracking`);
});
When("the motion carousel releases a real 100-pixel outward pointer drag", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases a real 100-pixel outward pointer drag");
});
Then("the motion carousel starts a return spring without activating an item", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel starts a return spring without activating an item");
});
When("the motion carousel receives a new pointer press during the return spring", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives a new pointer press during the return spring");
});
Then("the motion carousel cancels its transform and permits one stationary click", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel cancels its transform and permits one stationary click");
});
When("the motion carousel releases a real 100-pixel drag in the opposite direction", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases a real 100-pixel drag in the opposite direction");
});
Then("the motion carousel returns to zero without another click or selection change", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel returns to zero without another click or selection change");
});

Given("a motion carousel with animated hero overscroll", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.overscrollInvalidation(),
    `a motion carousel with animated hero overscroll`,
  );
});
When("the motion carousel is pulled 100 pixels from the leading edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel is pulled 100 pixels from the leading edge");
});
Then("the motion carousel has positive leading-edge displacement", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel has positive leading-edge displacement");
});
When("the motion carousel reduces its outward pull to 20 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel reduces its outward pull to 20 pixels");
});
Then("the motion carousel reduces its elastic displacement", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel reduces its elastic displacement");
});
When("the motion carousel crosses inward through the overscroll origin", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel crosses inward through the overscroll origin");
});
Then("the motion carousel clears its transform and scrolls inward", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel clears its transform and scrolls inward");
});
When("the motion carousel cancels a renewed outward pull", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel cancels a renewed outward pull");
});
Then("the motion carousel returns its cancelled overscroll to zero", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel returns its cancelled overscroll to zero");
});
When(
  "the motion carousel navigates to the start during a pull and receives another update",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel navigates to the start during a pull and receives another update",
    );
  },
);
Then("the motion carousel does not resume overscroll after navigation", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel does not resume overscroll after navigation");
});
When("the motion carousel changes document direction during an outward pull", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel changes document direction during an outward pull");
});
Then(
  "the motion carousel clears direction-changed overscroll and ignores another update",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel clears direction-changed overscroll and ignores another update");
  },
);
When("the motion carousel changes to fullscreen during a reversed pull", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel changes to fullscreen during a reversed pull");
});
Then("the motion carousel clears variant-changed overscroll", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel clears variant-changed overscroll");
});
When("the motion carousel returns to hero and pulls in the reversed document direction", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel returns to hero and pulls in the reversed document direction");
});
Then("the motion carousel clears its reversed pull when reduced motion is enabled", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel clears its reversed pull when reduced motion is enabled");
});
When("the motion carousel is pulled again with reduced motion", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel is pulled again with reduced motion");
});
Then("the motion carousel clears its transform when removed and reconnected", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel clears its transform when removed and reconnected");
});

Given("a motion carousel inside a 200-pixel parent with a percentage height", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.frameHeights(),
    `a motion carousel inside a 200-pixel parent with a percentage height`,
  );
});
Then("the motion carousel has matching 100-pixel viewport and overscroll frame heights", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel has matching 100-pixel viewport and overscroll frame heights");
});
When("the motion carousel switches to fullscreen with a 240-pixel height token", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel switches to fullscreen with a 240-pixel height token");
});
Then("the motion carousel has matching 240-pixel viewport and overscroll frame heights", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel has matching 240-pixel viewport and overscroll frame heights");
});

Given("a motion carousel with three fullscreen items", async ({ motionCarousel }) => {
  await motionCarousel.begin(motionCarousel.fullscreenResize(), `a motion carousel with three fullscreen items`);
});
Then("the motion carousel starts with 200-pixel fullscreen viewport and item heights", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel starts with 200-pixel fullscreen viewport and item heights");
});
When("the motion carousel sets its fullscreen host height to 120 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel sets its fullscreen host height to 120 pixels");
});
Then("the motion carousel resizes its fullscreen viewport and item to 120 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel resizes its fullscreen viewport and item to 120 pixels");
});
When("the motion carousel sets its fullscreen host height to 60 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel sets its fullscreen host height to 60 pixels");
});
Then("the motion carousel resizes its fullscreen viewport and item to 60 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel resizes its fullscreen viewport and item to 60 pixels");
});

Given(
  "a motion carousel with a 256-pixel height token with variant {string}",
  async ({ motionCarousel }, variant: string) => {
    await motionCarousel.begin(
      motionCarousel.explicitHeight(variant as "multi-browse" | "fullscreen"),
      `a motion carousel with a 256-pixel height token with variant "${variant}"`,
    );
  },
);
When("the motion carousel sets its explicit host height to 320 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel sets its explicit host height to 320 pixels");
});
Then(
  "the motion carousel uses 320-pixel host and viewport heights instead of its token",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel uses 320-pixel host and viewport heights instead of its token");
  },
);
When("the motion carousel sets its explicit host height to 100 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel sets its explicit host height to 100 pixels");
});
Then(
  "the motion carousel uses 100-pixel host and viewport heights instead of its token",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel uses 100-pixel host and viewport heights instead of its token");
  },
);

Given("a motion carousel rendered at a 20-pixel root font size without explicit height", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.rootFontHeight(),
    `a motion carousel rendered at a 20-pixel root font size without explicit height`,
  );
});
Then("the motion carousel retains its default 205-pixel host and viewport heights", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel retains its default 205-pixel host and viewport heights");
});

Given(
  "a motion carousel with native overscroll bounds with mode {string}",
  async ({ motionCarousel }, mode: string) => {
    await motionCarousel.begin(
      motionCarousel.nativeOverscroll(mode as "ltr" | "rtl" | "fullscreen"),
      `a motion carousel with native overscroll bounds with mode "${mode}"`,
    );
  },
);
When("the motion carousel simulates a 30-pixel native bounce at item 0", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel simulates a 30-pixel native bounce at item 0");
});
Then("the motion carousel keeps item 0 in its pre-bounce position", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel keeps item 0 in its pre-bounce position");
});
When("the motion carousel simulates a 30-pixel native bounce at item 4", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel simulates a 30-pixel native bounce at item 4");
});
Then("the motion carousel keeps item 4 in its pre-bounce position", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel keeps item 4 in its pre-bounce position");
});

Given("a motion carousel with five hero items for a slow pointer drag", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.slowMouseDrag(),
    `a motion carousel with five hero items for a slow pointer drag`,
  );
});
When("the motion carousel holds a 210-pixel pointer drag", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel holds a 210-pixel pointer drag");
});
Then("the motion carousel scrolls continuously by more than 180 pixels while held", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel scrolls continuously by more than 180 pixels while held");
});
When("the motion carousel releases the slow drag after 400 milliseconds", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases the slow drag after 400 milliseconds");
});
Then("the motion carousel settles the slow pointer drag at item 1", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel settles the slow pointer drag at item 1");
});

Given(
  "a motion carousel with centered text in its first item and a left margin with variant {string}",
  async ({ motionCarousel }, variant: string) => {
    await motionCarousel.begin(
      motionCarousel.textDrag(variant as "hero" | "hero-centered"),
      `a motion carousel with centered text in its first item and a left margin with variant "${variant}"`,
    );
  },
);
When("the motion carousel drags its text gradually beyond the viewport boundary", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel drags its text gradually beyond the viewport boundary");
});
Then(
  "the motion carousel holds more than 100 pixels of scroll for 600 milliseconds without selecting text",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel holds more than 100 pixels of scroll for 600 milliseconds without selecting text",
    );
  },
);
When("the motion carousel moves the held text drag back inside its bounds", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel moves the held text drag back inside its bounds");
});
Then("the motion carousel reduces the held text drag scroll by more than 50 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel reduces the held text drag scroll by more than 50 pixels");
});
When("the motion carousel releases the text-started drag", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases the text-started drag");
});
Then(
  "the motion carousel settles the text-started drag at the selected geometry target",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel settles the text-started drag at the selected geometry target");
  },
);

Given("a motion carousel with five hero items in right-to-left document direction", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.rtlPointerSwipe(),
    `a motion carousel with five hero items in right-to-left document direction`,
  );
});
When("the motion carousel releases a fast rightward pointer swipe", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases a fast rightward pointer swipe");
});
Then("the motion carousel selects item 1 and advances its right-to-left scroll", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel selects item 1 and advances its right-to-left scroll");
});

Given(
  "a motion carousel with eight items for a short fast touch swipe with variant {string} and direction {string}",
  async ({ motionCarousel }, variant: string, direction: string) => {
    await motionCarousel.begin(
      motionCarousel.shortTouchSwipe(variant as "hero" | "hero-centered" | "multi-browse", direction as "ltr" | "rtl"),
      `a motion carousel with eight items for a short fast touch swipe with variant "${variant}" and direction "${direction}"`,
    );
  },
);
When(
  "the motion carousel receives a 40-pixel touch swipe released after 30 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel receives a 40-pixel touch swipe released after 30 milliseconds");
  },
);
Then("the motion carousel advances selection and scrolls beyond 40 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel advances selection and scrolls beyond 40 pixels");
});

Given(
  "a motion carousel with eight hero items and distance-based geometry with variant {string} and direction {string}",
  async ({ motionCarousel }, variant: string, direction: string) => {
    await motionCarousel.begin(
      motionCarousel.distanceSettle(variant as "hero" | "hero-centered", direction as "ltr" | "rtl"),
      `a motion carousel with eight hero items and distance-based geometry with variant "${variant}" and direction "${direction}"`,
    );
  },
);
When("the motion carousel releases a 600-pixel drag with velocity 0.1", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases a 600-pixel drag with velocity 0.1");
});
Then("the motion carousel settles beyond item 1 at the nearest distance target", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel settles beyond item 1 at the nearest distance target");
});

Given("a motion carousel with five centered-hero items for a direction change", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.directionReposition(),
    `a motion carousel with five centered-hero items for a direction change`,
  );
});
When(
  "the motion carousel selects item 2 and changes document direction after 600 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel selects item 2 and changes document direction after 600 milliseconds",
    );
  },
);
Then("the motion carousel centers selected item 2 at 210 pixels in the new direction", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel centers selected item 2 at 210 pixels in the new direction");
});
When("the motion carousel navigates to item 4 and waits 600 milliseconds", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel navigates to item 4 and waits 600 milliseconds");
});
Then("the motion carousel aligns the final item with the right-to-left leading edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel aligns the final item with the right-to-left leading edge");
});

Given("a motion carousel with a local rtl attribute in an ltr document", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.documentNavigation(),
    `a motion carousel with a local rtl attribute in an ltr document`,
  );
});
When("the motion carousel receives ArrowRight on its first action", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives ArrowRight on its first action");
});
Then("the motion carousel navigates according to document direction to item 1", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel navigates according to document direction to item 1");
});

Given("a motion carousel with five hero items for native touch dragging", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.realTouchDrag(),
    `a motion carousel with five hero items for native touch dragging`,
  );
});
When(
  "the motion carousel receives native touch moves from 300 through 220 to 80 pixels",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel receives native touch moves from 300 through 220 to 80 pixels");
  },
);
Then("the motion carousel scrolls more than 100 pixels before the touch ends", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel scrolls more than 100 pixels before the touch ends");
});
When("the motion carousel ends the native touch drag", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel ends the native touch drag");
});
Then("the motion carousel settles the native touch drag at item 1", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel settles the native touch drag at item 1");
});

Given(
  "a motion carousel with touch cancellation tracking with variant {string}",
  async ({ motionCarousel }, variant: string) => {
    await motionCarousel.begin(
      motionCarousel.touchOwnership(variant as "uncontained" | "fullscreen"),
      `a motion carousel with touch cancellation tracking with variant "${variant}"`,
    );
  },
);
When("the motion carousel moves a native touch 40 pixels on its carousel axis", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel moves a native touch 40 pixels on its carousel axis");
});
Then("the motion carousel prevents the carousel-axis touch move", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel prevents the carousel-axis touch move");
});
When("the motion carousel cancels its pointer and continues the same native touch", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel cancels its pointer and continues the same native touch");
});
Then("the motion carousel retains ownership of the cancelled-pointer touch", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel retains ownership of the cancelled-pointer touch");
});
When("the motion carousel ends that touch and performs a perpendicular touch gesture", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel ends that touch and performs a perpendicular touch gesture");
});
Then("the motion carousel releases touch ownership for the perpendicular gesture", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases touch ownership for the perpendicular gesture");
});

Given("a motion carousel inside a scrollable page with click and touch tracking", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.touchPageScroll(),
    `a motion carousel inside a scrollable page with click and touch tracking`,
  );
});
When("the motion carousel receives a native touch tap", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives a native touch tap");
});
Then("the motion carousel activates its tapped item", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel activates its tapped item");
});
When(
  "the motion carousel receives native perpendicular touch moves of 40 and 70 pixels",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel receives native perpendicular touch moves of 40 and 70 pixels");
  },
);
Then("the motion carousel allows the surrounding page to scroll beyond 100 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel allows the surrounding page to scroll beyond 100 pixels");
});

Given("a motion carousel with three centered-hero items in a 140-pixel viewport", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.narrowFocalItems(),
    `a motion carousel with three centered-hero items in a 140-pixel viewport`,
  );
});
Then("the motion carousel keeps its first narrow focal item at the leading edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel keeps its first narrow focal item at the leading edge");
});
When(
  "the motion carousel navigates to the final narrow focal item and waits 600 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel navigates to the final narrow focal item and waits 600 milliseconds",
    );
  },
);
Then(
  "the motion carousel keeps its final narrow focal item at the 140-pixel trailing edge",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel keeps its final narrow focal item at the 140-pixel trailing edge",
    );
  },
);

Given("a motion carousel with selected-item change event tracking", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.keyboardChange(),
    `a motion carousel with selected-item change event tracking`,
  );
});
When("the motion carousel receives ArrowRight while tracking selected-item changes", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives ArrowRight while tracking selected-item changes");
});
Then("the motion carousel emits the detail 1:Item 2", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel emits the detail 1:Item 2");
});
When("the motion carousel receives End while tracking selected-item changes", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives End while tracking selected-item changes");
});
Then("the motion carousel emits the detail 4:Item 5", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel emits the detail 4:Item 5");
});
When("the motion carousel receives Home while tracking selected-item changes", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives Home while tracking selected-item changes");
});
Then("the motion carousel emits the detail 0:Item 1", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel emits the detail 0:Item 1");
});

Given("a motion carousel with a 200-pixel fullscreen viewport and first action focused", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.verticalKeyboard(),
    `a motion carousel with a 200-pixel fullscreen viewport and first action focused`,
  );
});
When("the motion carousel receives ArrowDown on its first fullscreen action", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives ArrowDown on its first fullscreen action");
});
Then("the motion carousel selects item 1 and scrolls vertically beyond 100 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel selects item 1 and scrolls vertically beyond 100 pixels");
});

Given("a motion carousel with 160-pixel uncontained items for slow dragging", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.unsnappedDrag(),
    `a motion carousel with 160-pixel uncontained items for slow dragging`,
  );
});
When(
  "the motion carousel releases a 75-pixel uncontained drag after a 400-millisecond hold",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel releases a 75-pixel uncontained drag after a 400-millisecond hold",
    );
  },
);
Then("the motion carousel remains at the unsnapped 75-pixel drag position", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel remains at the unsnapped 75-pixel drag position");
});

Given("a motion carousel with 160-pixel uncontained items for wheel scrolling", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.unsnappedWheel(),
    `a motion carousel with 160-pixel uncontained items for wheel scrolling`,
  );
});
When("the motion carousel receives 75 pixels of horizontal wheel movement", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives 75 pixels of horizontal wheel movement");
});
Then(
  "the motion carousel remains at the unsnapped 75-pixel wheel position after 200 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel remains at the unsnapped 75-pixel wheel position after 200 milliseconds",
    );
  },
);

Given("a motion carousel with reduced-motion uncontained release movement", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.releaseMovement(),
    `a motion carousel with reduced-motion uncontained release movement`,
  );
});
When(
  "the motion carousel starts at minus 15 pixels and releases at minus 80 with velocity minus 0.5",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel starts at minus 15 pixels and releases at minus 80 with velocity minus 0.5",
    );
  },
);
Then("the motion carousel applies all 80 pixels of release movement without a fling", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel applies all 80 pixels of release movement without a fling");
});

Given(
  "a motion carousel with animated 160-pixel uncontained items with direction {string}",
  async ({ motionCarousel }, direction: string) => {
    await motionCarousel.begin(
      motionCarousel.uncontainedFling(direction as "ltr" | "rtl"),
      `a motion carousel with animated 160-pixel uncontained items with direction "${direction}"`,
    );
  },
);
When("the motion carousel flings its uncontained items with speed 0.85", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel flings its uncontained items with speed 0.85");
});
Then(
  "the motion carousel continues beyond 100 pixels and stops away from the 168-pixel snap grid",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel continues beyond 100 pixels and stops away from the 168-pixel snap grid",
    );
  },
);

Given(
  "a motion carousel with scroll-settle timer instrumentation with variant {string} and programmatic {string}",
  async ({ motionCarousel }, variant: string, programmatic: string) => {
    await motionCarousel.begin(
      motionCarousel.settleTimers(variant as "multi-browse" | "uncontained", programmatic === "true"),
      `a motion carousel with scroll-settle timer instrumentation with variant "${variant}" and programmatic "${programmatic}"`,
    );
  },
);
When(
  "the motion carousel records settle timers during and after its navigation or swipe fling",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel records settle timers during and after its navigation or swipe fling",
    );
  },
);
Then(
  "the motion carousel defers 100-millisecond settle timers and fires exactly one after its fling",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel defers 100-millisecond settle timers and fires exactly one after its fling",
    );
  },
);

Given("a motion carousel with eight multi-browse items for post-settle momentum", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.nativeAfterSettle(),
    `a motion carousel with eight multi-browse items for post-settle momentum`,
  );
});
When(
  "the motion carousel continues native scrolling 20 pixels behind its final programmatic target",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel continues native scrolling 20 pixels behind its final programmatic target",
    );
  },
);
Then("the motion carousel snaps back to item 7 within 3000 milliseconds", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel snaps back to item 7 within 3000 milliseconds");
});

Given(
  "a motion carousel with eight multi-browse items for a fast fling with direction {string}",
  async ({ motionCarousel }, direction: string) => {
    await motionCarousel.begin(
      motionCarousel.fastBrowseFling(direction as "ltr" | "rtl"),
      `a motion carousel with eight multi-browse items for a fast fling with direction "${direction}"`,
    );
  },
);
When("the motion carousel flings its multi-browse items with speed 1.8", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel flings its multi-browse items with speed 1.8");
});
Then(
  "the motion carousel settles beyond one item at its selected multi-browse geometry target",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel settles beyond one item at its selected multi-browse geometry target",
    );
  },
);

Given(
  "a motion carousel with twelve multi-browse items and first action focused with direction {string}",
  async ({ motionCarousel }, direction: string) => {
    await motionCarousel.begin(
      motionCarousel.offscreenFocus(direction as "ltr" | "rtl"),
      `a motion carousel with twelve multi-browse items and first action focused with direction "${direction}"`,
    );
  },
);
When("the motion carousel swipes its focused multi-browse item offscreen at speed 1.8", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel swipes its focused multi-browse item offscreen at speed 1.8");
});
Then("the motion carousel focuses the settled multi-browse item beyond item 1", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel focuses the settled multi-browse item beyond item 1");
});
When("the motion carousel presses the forward arrow after offscreen focus recovery", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel presses the forward arrow after offscreen focus recovery");
});
Then("the motion carousel focuses and selects the next item after recovery", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel focuses and selects the next item after recovery");
});

Given(
  "a motion carousel with reduced-motion uncontained items and first action focused",
  async ({ motionCarousel }) => {
    await motionCarousel.begin(
      motionCarousel.visibleFocus(),
      `a motion carousel with reduced-motion uncontained items and first action focused`,
    );
  },
);
When(
  "the motion carousel swipes its focused item only 75 pixels with velocity minus 0.001",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel swipes its focused item only 75 pixels with velocity minus 0.001",
    );
  },
);
Then("the motion carousel keeps focus on the still-visible first item at 75 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel keeps focus on the still-visible first item at 75 pixels");
});

Given("a motion carousel with reduced-motion multi-browse items and external focus", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.externalFocus(),
    `a motion carousel with reduced-motion multi-browse items and external focus`,
  );
});
When("the motion carousel flings while focus remains on an outside button", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel flings while focus remains on an outside button");
});
Then("the motion carousel advances beyond one item without stealing external focus", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel advances beyond one item without stealing external focus");
});

Given("a motion carousel with an outside button and animated first-item focus", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.focusLeavesFling(),
    `a motion carousel with an outside button and animated first-item focus`,
  );
});
When(
  "the motion carousel starts a fling and the user immediately focuses the outside button",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel starts a fling and the user immediately focuses the outside button",
    );
  },
);
Then("the motion carousel does not restore carousel focus when that fling settles", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel does not restore carousel focus when that fling settles");
});

Given(
  "a motion carousel with animated multi-browse focus and programmatic interruption with method {string}",
  async ({ motionCarousel }, method: string) => {
    await motionCarousel.begin(
      motionCarousel.navigationInterruptFocus(method as "moveTo" | "selectedIndex"),
      `a motion carousel with animated multi-browse focus and programmatic interruption with method "${method}"`,
    );
  },
);
When("the motion carousel interrupts its focused fling with navigation to item 7", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel interrupts its focused fling with navigation to item 7");
});
Then(
  "the motion carousel retains first-item focus and selection 7 after 1300 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel retains first-item focus and selection 7 after 1300 milliseconds",
    );
  },
);

Given(
  "a motion carousel with reduced-motion fullscreen items ready for focused pointer swiping",
  async ({ motionCarousel }) => {
    await motionCarousel.begin(
      motionCarousel.fullscreenPointerFocus(),
      `a motion carousel with reduced-motion fullscreen items ready for focused pointer swiping`,
    );
  },
);
When(
  "the motion carousel focuses its first action and releases a real vertical pointer swipe from 170 to 30 pixels",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel focuses its first action and releases a real vertical pointer swipe from 170 to 30 pixels",
    );
  },
);
Then("the motion carousel selects and focuses its second fullscreen item", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel selects and focuses its second fullscreen item");
});
When("the motion carousel receives ArrowDown after fullscreen pointer focus recovery", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel receives ArrowDown after fullscreen pointer focus recovery");
});
Then("the motion carousel focuses its third fullscreen item", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel focuses its third fullscreen item");
});

Given(
  "a motion carousel with uncontained first-item focus and the second item disabled",
  async ({ motionCarousel }) => {
    await motionCarousel.begin(
      motionCarousel.enabledVisibleFocus(),
      `a motion carousel with uncontained first-item focus and the second item disabled`,
    );
  },
);
When(
  "the motion carousel swipes 200 pixels with velocity minus 0.001 past the disabled item",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel swipes 200 pixels with velocity minus 0.001 past the disabled item",
    );
  },
);
Then(
  "the motion carousel focuses enabled item 3 while keeping selection 1 and unsnapped scroll 200",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel focuses enabled item 3 while keeping selection 1 and unsnapped scroll 200",
    );
  },
);

Given(
  "a motion carousel with three fully visible 320-pixel items in a 960-pixel viewport with variant {string} and direction {string} and motion {string}",
  async ({ motionCarousel }, variant: string, direction: string, motion: string) => {
    await motionCarousel.begin(
      motionCarousel.largeItemFling(
        variant as "hero" | "hero-centered",
        direction as "ltr" | "rtl",
        motion as "no-preference" | "reduce",
      ),
      `a motion carousel with three fully visible 320-pixel items in a 960-pixel viewport with variant "${variant}" and direction "${direction}" and motion "${motion}"`,
    );
  },
);
When("the motion carousel flings its large items with speed 0.5 and translation 40", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel flings its large items with speed 0.5 and translation 40");
});
Then("the motion carousel settles its slow large-item fling beyond the first item", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel settles its slow large-item fling beyond the first item");
});
When(
  "the motion carousel returns to the start and flings its large items with speed 20",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel returns to the start and flings its large items with speed 20");
  },
);
Then(
  "the motion carousel travels farther than the slow fling and reaches maximum scroll",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel travels farther than the slow fling and reaches maximum scroll");
  },
);
When("the motion carousel reverses its large-item fling with speed 20", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel reverses its large-item fling with speed 20");
});
Then("the motion carousel returns its large-item selection and scroll to zero", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel returns its large-item selection and scroll to zero");
});

Given(
  "a motion carousel with twelve 320-pixel items and a resizable viewport with variant {string}",
  async ({ motionCarousel }, variant: string) => {
    await motionCarousel.begin(
      motionCarousel.largeItemCount(variant as "hero" | "hero-centered"),
      `a motion carousel with twelve 320-pixel items and a resizable viewport with variant "${variant}"`,
    );
  },
);
When("the motion carousel resizes to 420 pixels and flings with velocity minus 3.5", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel resizes to 420 pixels and flings with velocity minus 3.5");
});
Then(
  "the motion carousel settles according to the 420-pixel large-item count and returns to the start",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel settles according to the 420-pixel large-item count and returns to the start",
    );
  },
);
When("the motion carousel resizes to 960 pixels and flings with velocity minus 3.5", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel resizes to 960 pixels and flings with velocity minus 3.5");
});
Then(
  "the motion carousel settles according to the 960-pixel large-item count and returns to the start",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel settles according to the 960-pixel large-item count and returns to the start",
    );
  },
);

Given(
  "a motion carousel with release-velocity sampling for six items with variant {string} and direction {string}",
  async ({ motionCarousel }, variant: string, direction: string) => {
    await motionCarousel.begin(
      motionCarousel.releaseVelocity(variant as "hero" | "hero-centered" | "fullscreen", direction as "ltr" | "rtl"),
      `a motion carousel with release-velocity sampling for six items with variant "${variant}" and direction "${direction}"`,
    );
  },
);
When("the motion carousel samples the first 80 milliseconds of a release at speed 0.5", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel samples the first 80 milliseconds of a release at speed 0.5");
});
Then(
  "the motion carousel settles its speed 0.5 release at item 1 and resets to the start",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel settles its speed 0.5 release at item 1 and resets to the start");
  },
);
When("the motion carousel samples the first 80 milliseconds of a release at speed 2", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel samples the first 80 milliseconds of a release at speed 2");
});
Then(
  "the motion carousel settles its speed 2 release at item 1 and resets to the start",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel settles its speed 2 release at item 1 and resets to the start");
  },
);
Then(
  "the motion carousel moves at least 30 pixels farther with its faster release velocity",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel moves at least 30 pixels farther with its faster release velocity",
    );
  },
);
When("the motion carousel navigates to item 3 and releases a reverse drag with speed 3", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel navigates to item 3 and releases a reverse drag with speed 3");
});
Then("the motion carousel settles the reversed release at item 2", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel settles the reversed release at item 2");
});

Given(
  "a motion carousel with six items and reduced-motion immediate settling with variant {string}",
  async ({ motionCarousel }, variant: string) => {
    await motionCarousel.begin(
      motionCarousel.immediateSettle(variant as "hero" | "hero-centered" | "fullscreen"),
      `a motion carousel with six items and reduced-motion immediate settling with variant "${variant}"`,
    );
  },
);
When("the motion carousel releases its reduced-motion drag with velocity minus 2", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases its reduced-motion drag with velocity minus 2");
});
Then(
  "the motion carousel selects item 1 immediately and remains stopped for 200 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel selects item 1 immediately and remains stopped for 200 milliseconds",
    );
  },
);

Given("a motion carousel with six centered-hero items for pointer interruption", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.pointerStopsHero(),
    `a motion carousel with six centered-hero items for pointer interruption`,
  );
});
When("the motion carousel presses the pointer after its hero fling passes 65 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel presses the pointer after its hero fling passes 65 pixels");
});
Then(
  "the motion carousel holds the interrupted hero fling position for 200 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel holds the interrupted hero fling position for 200 milliseconds");
  },
);
When("the motion carousel releases the pointer that interrupted its hero fling", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases the pointer that interrupted its hero fling");
});
Then(
  "the motion carousel settles that interrupted hero fling at the selected geometry target",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel settles that interrupted hero fling at the selected geometry target",
    );
  },
);

Given(
  "a motion carousel with six animated hero items for a motion-preference interruption",
  async ({ motionCarousel }) => {
    await motionCarousel.begin(
      motionCarousel.motionStopsHero(),
      `a motion carousel with six animated hero items for a motion-preference interruption`,
    );
  },
);
When("the motion carousel enables reduced motion after its hero fling passes 65 pixels", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel enables reduced motion after its hero fling passes 65 pixels");
});
Then(
  "the motion carousel makes item 1 fully visible and holds its stopped hero position",
  async ({ motionCarousel }) => {
    await motionCarousel.advance("the motion carousel makes item 1 fully visible and holds its stopped hero position");
  },
);

Given("a motion carousel with multi-browse scroll sampling every 100 milliseconds", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.singleAcceleration(),
    `a motion carousel with multi-browse scroll sampling every 100 milliseconds`,
  );
});
When("the motion carousel samples a velocity minus 0.6 fling for 1700 milliseconds", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel samples a velocity minus 0.6 fling for 1700 milliseconds");
});
Then(
  "the motion carousel travels more than 100 pixels without a second acceleration or backward motion",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel travels more than 100 pixels without a second acceleration or backward motion",
    );
  },
);

Given("a motion carousel with animated uncontained items for pointer interruption", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.pointerStopsInertia(),
    `a motion carousel with animated uncontained items for pointer interruption`,
  );
});
When(
  "the motion carousel presses the pointer after its uncontained fling passes 200 pixels",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel presses the pointer after its uncontained fling passes 200 pixels",
    );
  },
);
Then(
  "the motion carousel selects a progressed item and holds inertia stopped for 250 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel selects a progressed item and holds inertia stopped for 250 milliseconds",
    );
  },
);

Given("a motion carousel with reduced-motion multi-browse fling targets", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.reducedBrowseTarget(),
    `a motion carousel with reduced-motion multi-browse fling targets`,
  );
});
When("the motion carousel flings its reduced-motion multi-browse items at speed 0.4", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel flings its reduced-motion multi-browse items at speed 0.4");
});
Then("the motion carousel selects item 1 for its slower reduced-motion fling", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel selects item 1 for its slower reduced-motion fling");
});
When(
  "the motion carousel returns to zero and flings its reduced-motion multi-browse items at speed 1.8",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel returns to zero and flings its reduced-motion multi-browse items at speed 1.8",
    );
  },
);
Then(
  "the motion carousel advances beyond one item and remains stopped for 150 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel advances beyond one item and remains stopped for 150 milliseconds",
    );
  },
);

Given(
  "a motion carousel with reduced-motion fixed-size items with variant {string}",
  async ({ motionCarousel }, variant: string) => {
    await motionCarousel.begin(
      motionCarousel.fixedSizeMotion(variant as "multi-browse" | "hero" | "hero-centered"),
      `a motion carousel with reduced-motion fixed-size items with variant "${variant}"`,
    );
  },
);
When("the motion carousel holds a 100-pixel reduced-motion pointer drag", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel holds a 100-pixel reduced-motion pointer drag");
});
Then(
  "the motion carousel keeps every dragged item fully visible and translates by the scroll offset",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel keeps every dragged item fully visible and translates by the scroll offset",
    );
  },
);
When("the motion carousel releases its fixed-size drag and navigates to item 2", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases its fixed-size drag and navigates to item 2");
});
Then("the motion carousel aligns item 2 using its fixed-size variant geometry", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel aligns item 2 using its fixed-size variant geometry");
});
When("the motion carousel navigates to the final fixed-size item", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel navigates to the final fixed-size item");
});
Then(
  "the motion carousel aligns item 7 at 420 pixels and keeps final selection after 150 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel aligns item 7 at 420 pixels and keeps final selection after 150 milliseconds",
    );
  },
);

Given("a motion carousel with 186-pixel multi-browse items and animated layout", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.motionLayoutChange(),
    `a motion carousel with 186-pixel multi-browse items and animated layout`,
  );
});
When("the motion carousel selects item 2 and enables reduced-motion layout", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel selects item 2 and enables reduced-motion layout");
});
Then("the motion carousel keeps selection 2 aligned and makes item 3 fully visible", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel keeps selection 2 aligned and makes item 3 fully visible");
});
When("the motion carousel restores its animated layout preference", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel restores its animated layout preference");
});
Then("the motion carousel restores item 4 masking without changing selection 2", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel restores item 4 masking without changing selection 2");
});

Given(
  "a motion carousel with eight animated multi-browse items for motion interruption",
  async ({ motionCarousel }) => {
    await motionCarousel.begin(
      motionCarousel.motionStopsBrowse(),
      `a motion carousel with eight animated multi-browse items for motion interruption`,
    );
  },
);
When(
  "the motion carousel enables reduced motion after its multi-browse fling passes 100 pixels",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel enables reduced motion after its multi-browse fling passes 100 pixels",
    );
  },
);
Then(
  "the motion carousel makes item 1 fully visible and holds its stopped multi-browse position",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel makes item 1 fully visible and holds its stopped multi-browse position",
    );
  },
);

Given(
  "a motion carousel with reduced-motion 186-pixel items in right-to-left direction",
  async ({ motionCarousel }) => {
    await motionCarousel.begin(
      motionCarousel.rtlReducedAlignment(),
      `a motion carousel with reduced-motion 186-pixel items in right-to-left direction`,
    );
  },
);
When("the motion carousel navigates to item 2 in its reduced-motion rtl layout", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel navigates to item 2 in its reduced-motion rtl layout");
});
Then("the motion carousel aligns item 2 at the 420-pixel rtl leading edge", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel aligns item 2 at the 420-pixel rtl leading edge");
});
When("the motion carousel navigates to item 7 in its reduced-motion rtl layout", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel navigates to item 7 in its reduced-motion rtl layout");
});
Then(
  "the motion carousel aligns item 7 at zero and retains selection after 150 milliseconds",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel aligns item 7 at zero and retains selection after 150 milliseconds",
    );
  },
);

Given(
  "a motion carousel with animated 160-pixel uncontained items for preference changes",
  async ({ motionCarousel }) => {
    await motionCarousel.begin(
      motionCarousel.unsnappedMotionChange(),
      `a motion carousel with animated 160-pixel uncontained items for preference changes`,
    );
  },
);
When("the motion carousel is natively scrolled to an unsnapped 75-pixel position", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel is natively scrolled to an unsnapped 75-pixel position");
});
Then(
  "the motion carousel preserves its unsnapped 75-pixel position when reduced motion is enabled",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel preserves its unsnapped 75-pixel position when reduced motion is enabled",
    );
  },
);

Given("a motion carousel with reduced-motion multi-browse reversed release velocity", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.reverseReleaseVelocity(),
    `a motion carousel with reduced-motion multi-browse reversed release velocity`,
  );
});
When("the motion carousel releases a minus 600-pixel drag with positive velocity 0.3", async ({ motionCarousel }) => {
  await motionCarousel.advance("the motion carousel releases a minus 600-pixel drag with positive velocity 0.3");
});
Then(
  "the motion carousel does not jump back to the drag origin and selects at least item 1",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel does not jump back to the drag origin and selects at least item 1",
    );
  },
);

Given("a motion carousel with reduced-motion uncontained inertia", async ({ motionCarousel }) => {
  await motionCarousel.begin(
    motionCarousel.reducedInertia(),
    `a motion carousel with reduced-motion uncontained inertia`,
  );
});
When(
  "the motion carousel releases its reduced-motion uncontained fling at velocity minus 1",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel releases its reduced-motion uncontained fling at velocity minus 1",
    );
  },
);
Then(
  "the motion carousel stays at the 40-pixel release position without continuing inertia",
  async ({ motionCarousel }) => {
    await motionCarousel.advance(
      "the motion carousel stays at the 40-pixel release position without continuing inertia",
    );
  },
);
