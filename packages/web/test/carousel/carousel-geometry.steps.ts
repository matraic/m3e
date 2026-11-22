import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest, type DataTable } from "playwright-bdd";

import { createCarouselGeometry } from "../../src/carousel/CarouselGeometry";
import { expect, test as componentTest } from "../fixtures";
import { CarouselGeometryHarness } from "./carousel-geometry.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  carouselGeometry: CarouselGeometryHarness;
}>({
  // eslint-disable-next-line no-empty-pattern
  carouselGeometry: async ({}, use) => use(new CarouselGeometryHarness()),
});
const { Given, When, Then } = createBdd(test);

const numbers = (value: string) => value.split(",").map((item) => Number(item.trim()));
const start = (item: { position: number; size: number }) => item.position - item.size / 2;
const end = (item: { position: number; size: number }) => item.position + item.size / 2;
const maxDifference = (before: { position: number; size: number }[], after: typeof before, key: "position" | "size") =>
  Math.max(...before.map((item, index) => Math.abs(item[key] - after[index][key])));

Given("a carousel geometry configured with:", ({ carouselGeometry }, table: DataTable) =>
  carouselGeometry.configure(table.hashes()[0]),
);
When(
  "the carousel geometry is sampled between snaps while counting arrangement builds:",
  ({ carouselGeometry }, table: DataTable) =>
    carouselGeometry.countArrangementBuilds(
      table.hashes().map(({ index, fraction }) => [Number(index), Number(fraction)] as [number, number]),
    ),
);
Then("the carousel geometry cumulative arrangement builds are {string}", ({ carouselGeometry }, counts: string) =>
  expect(carouselGeometry.buildCounts).toEqual(numbers(counts)),
);
When(
  "the carousel geometry is sampled at every snap and midpoint forwards then backwards, mutating each result",
  ({ carouselGeometry }) => carouselGeometry.sampleSnapsAndMidpointsMutatingResults(),
);
Then("every carousel geometry sample matches a freshly created carousel geometry", ({ carouselGeometry }) => {
  expect(carouselGeometry.cacheChecks.length).toBeGreaterThan(0);
  for (const { actual, expected } of carouselGeometry.cacheChecks) expect(actual).toEqual(expected);
});
Then(
  "a carousel geometry resized to a {float} pixel viewport matches a fresh carousel geometry at the start",
  ({ carouselGeometry }, viewportSize: number) =>
    expect(carouselGeometry.fresh({ viewportSize }).itemsAt(0)).toEqual(
      carouselGeometry.fresh({ viewportSize }).itemsAt(0),
    ),
);
Then("the carousel geometry still matches a fresh carousel geometry at the start", ({ carouselGeometry }) =>
  expect(carouselGeometry.layout.itemsAt(0)).toEqual(carouselGeometry.fresh().itemsAt(0)),
);
When("the carousel geometry is evaluated at scroll {float}", ({ carouselGeometry }, scroll: number) => {
  carouselGeometry.evaluate(scroll);
});
Then(
  "the carousel geometry items visible beyond a {float} pixel margin measure approximately {string}",
  ({ carouselGeometry }, margin: number, sizes: string) => {
    const expected = numbers(sizes);
    const visible = carouselGeometry.visible(carouselGeometry.current, margin);
    expect(visible).toHaveLength(expected.length);
    visible.forEach((item, index) => expect(item.size).toBeCloseTo(expected[index]));
  },
);
Then(
  "the carousel geometry items visible beyond a {float} pixel margin are separated by gap {float}",
  ({ carouselGeometry }, margin: number, gap: number) =>
    carouselGeometry.expectSeparatedByGap(carouselGeometry.visible(carouselGeometry.current, margin), gap),
);
When(
  "the first carousel geometry item is tracked every {float} pixels of scroll until it exits",
  ({ carouselGeometry }, step: number) => carouselGeometry.trackFirstItemUntilExit(step),
);
Then(
  "the first carousel geometry item shrinks against the leading edge while it is larger than the small size",
  ({ carouselGeometry }) => {
    const { firstItems, layout } = carouselGeometry;
    expect(firstItems.length).toBeGreaterThan(1);
    for (let index = 1; index < firstItems.length; index++) {
      const previous = firstItems[index - 1];
      const first = firstItems[index];
      expect(start(first)).toBeLessThanOrEqual(start(previous) + 0.001);
      expect(end(first)).toBeLessThan(end(previous) - 0.01);
      expect(first.size).toBeLessThanOrEqual(previous.size + 0.001);
      if (first.size > layout.smallSize + 0.001) expect(start(first)).toBeCloseTo(0, 5);
    }
  },
);
Then("the first carousel geometry item has exited the viewport", ({ carouselGeometry }) =>
  expect(end(carouselGeometry.firstItems.at(-1)!)).toBeLessThanOrEqual(0),
);
Then("the carousel geometry focal size is exactly {float}", ({ carouselGeometry }, size: number) =>
  expect(carouselGeometry.layout.itemSize).toBe(size),
);
Then("the carousel geometry maximum scroll is exactly {float}", ({ carouselGeometry }, scroll: number) =>
  expect(carouselGeometry.layout.maxScroll).toBe(scroll),
);
Then("the carousel geometry returns {int} item(s)", ({ carouselGeometry }, count: number) =>
  expect(carouselGeometry.current).toHaveLength(count),
);
Then(
  "the carousel geometry item at index {int} is exactly {float} pixels at position {float}",
  ({ carouselGeometry }, index: number, size: number, position: number) =>
    expect(carouselGeometry.current[index]).toEqual({ position, size }),
);
Then("the carousel geometry items at indexes {string} have the focal size", ({ carouselGeometry }, indexes: string) => {
  for (const index of numbers(indexes))
    expect(carouselGeometry.current[index].size).toBeCloseTo(carouselGeometry.layout.itemSize);
});
Then(
  "the carousel geometry item at index {int} is smaller than the item at index {int}",
  ({ carouselGeometry }, index: number, other: number) =>
    expect(carouselGeometry.current[index].size).toBeLessThan(carouselGeometry.current[other].size),
);
Then(
  "the carousel geometry item at index {int} measures exactly {float} pixels",
  ({ carouselGeometry }, index: number, size: number) => expect(carouselGeometry.current[index].size).toBe(size),
);
Then("the carousel geometry item at index {int} ends at {float}", ({ carouselGeometry }, index: number, edge: number) =>
  expect(end(carouselGeometry.current[index])).toBeCloseTo(edge),
);
Then(
  "the carousel geometry item at index {int} starts after {float}",
  ({ carouselGeometry }, index: number, edge: number) =>
    expect(start(carouselGeometry.current[index])).toBeGreaterThan(edge),
);
Then("the carousel geometry items are separated by gap {float}", ({ carouselGeometry }, gap: number) =>
  carouselGeometry.expectSeparatedByGap(carouselGeometry.current, gap),
);
Then(
  "the carousel geometry item at index {int} measures more than {float} pixel(s)",
  ({ carouselGeometry }, index: number, size: number) =>
    expect(carouselGeometry.current[index].size).toBeGreaterThan(size),
);
Then(
  "the carousel geometry item at index {int} starts at {float}",
  ({ carouselGeometry }, index: number, edge: number) =>
    expect(start(carouselGeometry.current[index])).toBeCloseTo(edge),
);
When("the carousel geometry is evaluated at its maximum scroll", ({ carouselGeometry }) => {
  carouselGeometry.evaluate(carouselGeometry.layout.maxScroll);
});
Then(
  "the carousel geometry item at index {int} measures approximately {float} pixels",
  ({ carouselGeometry }, index: number, size: number) => expect(carouselGeometry.current[index].size).toBeCloseTo(size),
);
Then(
  "the first {int} carousel geometry items are separated by gap {float}",
  ({ carouselGeometry }, count: number, gap: number) =>
    carouselGeometry.expectSeparatedByGap(carouselGeometry.current.slice(0, count), gap),
);
Then("the carousel geometry item at index {int} is exactly the focal size", ({ carouselGeometry }, index: number) =>
  expect(carouselGeometry.current[index].size).toBe(carouselGeometry.layout.itemSize),
);
Then(
  "the carousel geometry item at index {int} starts {float} pixels after the item at index {int} ends",
  ({ carouselGeometry }, index: number, gap: number, other: number) =>
    expect(start(carouselGeometry.current[index])).toBeCloseTo(end(carouselGeometry.current[other]) + gap),
);
When("the carousel geometry is evaluated at each item's snap position", ({ carouselGeometry }) =>
  carouselGeometry.evaluateSnaps(),
);
Then("every carousel geometry snap returns {int} items", ({ carouselGeometry }, count: number) => {
  for (const { items } of carouselGeometry.snaps) expect(items).toHaveLength(count);
});
Then("every selected carousel geometry item has the focal size", ({ carouselGeometry }) => {
  for (const { index, items } of carouselGeometry.snaps)
    expect(items[index].size).toBeCloseTo(carouselGeometry.layout.itemSize);
});
Then(
  "every selected carousel geometry item lies within the viewport with {float} pixel tolerance",
  ({ carouselGeometry }, tolerance: number) => {
    for (const { index, items } of carouselGeometry.snaps) {
      expect(start(items[index])).toBeGreaterThanOrEqual(-tolerance);
      expect(end(items[index])).toBeLessThanOrEqual(carouselGeometry.viewport + tolerance);
    }
  },
);
Then("the first selected carousel geometry item starts at {float}", ({ carouselGeometry }, edge: number) => {
  const { index, items } = carouselGeometry.snaps[0];
  expect(start(items[index])).toBeCloseTo(edge);
});
Then("the last selected carousel geometry item ends at {float}", ({ carouselGeometry }, edge: number) => {
  const { index, items } = carouselGeometry.snaps.at(-1)!;
  expect(end(items[index])).toBeCloseTo(edge);
});
Then("every carousel geometry snap offset lies within the scroll range", ({ carouselGeometry }) => {
  for (const { scroll } of carouselGeometry.snaps) {
    expect(scroll).toBeGreaterThanOrEqual(0);
    expect(scroll).toBeLessThanOrEqual(carouselGeometry.layout.maxScroll);
  }
});
Then("every carousel geometry snap is separated by gap {float}", ({ carouselGeometry }, gap: number) => {
  for (const { items } of carouselGeometry.snaps) carouselGeometry.expectSeparatedByGap(items, gap);
});
When(
  "the carousel geometry is evaluated at the midpoint between snaps {int} and {int} and {float} pixels beyond it",
  ({ carouselGeometry }, from: number, to: number, distance: number) =>
    carouselGeometry.evaluateAround((carouselGeometry.snap(from) + carouselGeometry.snap(to)) / 2, distance),
);
Then(
  "the carousel geometry items move less than {float} pixels across each boundary",
  ({ carouselGeometry }, limit: number) => {
    for (const { before, after } of carouselGeometry.boundaries) {
      expect(maxDifference(before, after, "position")).toBeLessThan(limit);
      expect(maxDifference(before, after, "size")).toBeLessThan(limit);
    }
  },
);
Then(
  "the carousel geometry items past each boundary are separated by gap {float}",
  ({ carouselGeometry }, gap: number) => {
    for (const { after } of carouselGeometry.boundaries) carouselGeometry.expectSeparatedByGap(after, gap);
  },
);
When("the carousel geometry is evaluated at the snap for item {int}", ({ carouselGeometry }, index: number) => {
  carouselGeometry.evaluate(carouselGeometry.snap(index));
});
Then(
  "the carousel geometry item at index {int} is centered at half the focal size",
  ({ carouselGeometry }, index: number) =>
    expect(carouselGeometry.current[index].position).toBeCloseTo(carouselGeometry.layout.itemSize / 2),
);
Then(
  "a carousel geometry item other than index {int} is smaller than the focal size",
  ({ carouselGeometry }, selected: number) =>
    expect(
      carouselGeometry.current.some(
        (item, index) => index !== selected && item.size < carouselGeometry.layout.itemSize,
      ),
    ).toBe(true),
);
Then("the carousel geometry item sizes and positions change across each boundary", ({ carouselGeometry }) => {
  for (const { before, after } of carouselGeometry.boundaries) {
    expect(after.some((item, index) => Math.abs(item.size - before[index].size) > 0)).toBe(true);
    expect(after.some((item, index) => Math.abs(item.position - before[index].position) > 0)).toBe(true);
  }
});
Then(
  "the carousel geometry items at indexes {int} and {int} are centered together at {float}",
  ({ carouselGeometry }, first: number, second: number, center: number) =>
    expect((carouselGeometry.current[first].position + carouselGeometry.current[second].position) / 2).toBeCloseTo(
      center,
    ),
);
When(
  "each carousel geometry snap transition is sampled at fractions {string}",
  ({ carouselGeometry }, fractions: string) => carouselGeometry.sampleSnapTransitions(numbers(fractions)),
);
Then(
  "each incoming carousel geometry item is larger halfway than at the start of its transition",
  ({ carouselGeometry }) => {
    expect(carouselGeometry.transitions.length).toBeGreaterThan(0);
    for (const { index, from, halfway } of carouselGeometry.transitions)
      expect(halfway[index].size).toBeGreaterThan(from[index + 1].size);
  },
);
Then("every carousel geometry transition sample is separated by gap {float}", ({ carouselGeometry }, gap: number) => {
  for (const { samples } of carouselGeometry.transitions)
    for (const items of samples) carouselGeometry.expectSeparatedByGap(items, gap);
});
Then("no carousel geometry transition sample exceeds the focal size", ({ carouselGeometry }) => {
  for (const { samples } of carouselGeometry.transitions)
    for (const items of samples)
      expect(items.every((item) => item.size <= carouselGeometry.layout.itemSize + 0.001)).toBe(true);
});
Then("each incoming carousel geometry item grows within its target size and revealed space", ({ carouselGeometry }) => {
  for (const { index, from, to, samples } of carouselGeometry.transitions) {
    let previousSize = from[index + 1].size;
    for (const items of samples) {
      const incoming = items[index + 1];
      const revealed = carouselGeometry.viewport - start(incoming);
      expect(incoming.size).toBeLessThanOrEqual(Math.min(to[index + 1].size, revealed) + 0.001);
      expect(incoming.size).toBeGreaterThanOrEqual(previousSize);
      previousSize = incoming.size;
    }
  }
});
Then(
  "each carousel geometry transition converges within {float} pixels of its destination snap",
  ({ carouselGeometry }, limit: number) => {
    for (const { to, nearEnd } of carouselGeometry.transitions)
      nearEnd.forEach((item, index) => {
        expect(Math.abs(item.position - to[index].position)).toBeLessThan(limit);
        expect(Math.abs(item.size - to[index].size)).toBeLessThan(limit);
      });
  },
);
When(
  "the carousel geometry is sampled at {int} even intervals across its scroll range",
  ({ carouselGeometry }, intervals: number) => carouselGeometry.sampleEvenly(intervals),
);
Then("every clipped carousel geometry item has the small size", ({ carouselGeometry }) => {
  for (const item of carouselGeometry.clippedItems())
    expect(item.size).toBeCloseTo(carouselGeometry.layout.smallSize, 5);
});
Then("at least one carousel geometry sample clips an item", ({ carouselGeometry }) =>
  expect(carouselGeometry.clippedItems().length).toBeGreaterThan(0),
);
Then("every carousel geometry sample is separated by gap {float}", ({ carouselGeometry }, gap: number) => {
  for (const items of carouselGeometry.frames) carouselGeometry.expectSeparatedByGap(items, gap);
});
When(
  "the outgoing leading carousel geometry preview is tracked from snaps {int} through {int} in {int} steps each",
  ({ carouselGeometry }, first: number, last: number, steps: number) =>
    carouselGeometry.trackOutgoingPreviews(first, last, steps),
);
Then("the outgoing leading carousel geometry preview never moves back toward the viewport", ({ carouselGeometry }) => {
  expect(carouselGeometry.outgoingRights.length).toBeGreaterThan(0);
  for (const rights of carouselGeometry.outgoingRights) {
    let leftViewport = false;
    let previousRight = Number.POSITIVE_INFINITY;
    for (const right of rights) {
      expect(right).toBeLessThanOrEqual(previousRight + 0.001);
      previousRight = right;
      if (right <= 0) leftViewport = true;
      if (leftViewport) expect(right).toBeLessThanOrEqual(0.001);
    }
  }
});
Then(
  "each nonfinal selected carousel geometry item starts at {float} with its successor ending at {float} and its predecessor out of view",
  ({ carouselGeometry }, leading: number, trailing: number) => {
    for (const { index, items } of carouselGeometry.snaps.slice(0, -1)) {
      expect(start(items[index])).toBeCloseTo(leading);
      if (index > 0) expect(end(items[index - 1])).toBeLessThanOrEqual(0);
      expect(end(items[index + 1])).toBeCloseTo(trailing);
    }
  },
);
Then(
  "the final selected carousel geometry item ends at {float} with its predecessor starting at {float}",
  ({ carouselGeometry }, trailing: number, leading: number) => {
    const { index, items } = carouselGeometry.snaps.at(-1)!;
    expect(end(items[index])).toBeCloseTo(trailing);
    expect(start(items[index - 1])).toBeCloseTo(leading);
  },
);
When("the carousel geometry is evaluated at the snaps {string}", ({ carouselGeometry }, indexes: string) =>
  carouselGeometry.evaluateSnaps(numbers(indexes)),
);
Then(
  "every carousel geometry snap shows {int} previews beside its selected item spanning {float} pixels",
  ({ carouselGeometry }, previews: number, span: number) => {
    for (const { index, items } of carouselGeometry.snaps) {
      const visible = carouselGeometry.visible(items);
      expect(visible).toHaveLength(previews + 1);
      expect(start(visible[0])).toBeCloseTo(0);
      expect(end(visible[visible.length - 1])).toBeCloseTo(span);
      expect(visible.filter((item) => item.size < items[index].size)).toHaveLength(previews);
    }
  },
);
When(
  "the carousel geometry is evaluated {float} pixels either side of the snaps {string}",
  ({ carouselGeometry }, distance: number, indexes: string) =>
    carouselGeometry.evaluateEitherSideOfSnaps(numbers(indexes), distance),
);
Then(
  "the carousel geometry item at index {int} measures between {float} and {float} pixels",
  ({ carouselGeometry }, index: number, min: number, max: number) => {
    expect(carouselGeometry.current[index].size).toBeGreaterThanOrEqual(min);
    expect(carouselGeometry.current[index].size).toBeLessThanOrEqual(max);
  },
);
Then(
  "every selected carousel geometry item has starting-size previews aligned to both viewport edges",
  ({ carouselGeometry }) => {
    const initialPreview = carouselGeometry.layout.itemsAt(0)[1].size;
    for (const { index, items } of carouselGeometry.snaps) {
      expect(items[index - 1].size).toBeCloseTo(initialPreview);
      expect(items[index + 1].size).toBeCloseTo(initialPreview);
      expect(items[index].size).toBeGreaterThan(initialPreview);
      expect(start(items[index - 1])).toBeCloseTo(0);
      expect(end(items[index + 1])).toBeCloseTo(carouselGeometry.viewport);
    }
  },
);
Then(
  "the smallest visible carousel geometry item measures between {float} and {float} pixels",
  ({ carouselGeometry }, min: number, max: number) => {
    const smallest = Math.min(...carouselGeometry.visible(carouselGeometry.current).map((item) => item.size));
    expect(smallest).toBeGreaterThanOrEqual(min);
    expect(smallest).toBeLessThanOrEqual(max);
  },
);
Then("the carousel geometry focal size is at most {float}", ({ carouselGeometry }, size: number) =>
  expect(carouselGeometry.layout.itemSize).toBeLessThanOrEqual(size),
);
Then(
  "the last carousel geometry item starting inside the viewport measures between {float} and {float} pixels and ends at {float}",
  ({ carouselGeometry }, min: number, max: number, edge: number) => {
    const visible = carouselGeometry.current.filter((item) => start(item) < carouselGeometry.viewport - 0.001);
    const small = visible[visible.length - 1];
    expect(small.size).toBeGreaterThanOrEqual(min);
    expect(small.size).toBeLessThanOrEqual(max);
    expect(end(small)).toBeCloseTo(edge);
  },
);
Then(
  "the first {int} carousel geometry items at the start and the last {int} at the end are exactly the focal size",
  ({ carouselGeometry }, first: number, last: number) => {
    const { layout } = carouselGeometry;
    expect(
      layout
        .itemsAt(0)
        .slice(0, first)
        .every((item) => item.size === layout.itemSize),
    ).toBe(true);
    expect(
      layout
        .itemsAt(layout.maxScroll)
        .slice(carouselGeometry.options.count - last)
        .every((item) => item.size === layout.itemSize),
    ).toBe(true);
  },
);
When(
  "the carousel geometry is dragged inward by {string} pixels from each end",
  ({ carouselGeometry }, distances: string) => carouselGeometry.dragInward(numbers(distances)),
);
Then("the fourth carousel geometry item from each end follows each inward drag", ({ carouselGeometry }) => {
  const { layout, options } = carouselGeometry;
  const atStart = layout.itemsAt(0);
  const atEnd = layout.itemsAt(layout.maxScroll);
  for (const { distance, fromStart, fromEnd } of carouselGeometry.drags) {
    expect(atStart[3].position - fromStart[3].position).toBeCloseTo(distance);
    expect(fromEnd[options.count - 4].position - atEnd[options.count - 4].position).toBeCloseTo(distance);
  }
});
Then("the carousel geometry items never move backward across each boundary", ({ carouselGeometry }) => {
  for (const { before, after } of carouselGeometry.boundaries)
    after.forEach((item, index) => expect(item.position).toBeLessThanOrEqual(before[index].position + 1e-8));
});
Then("exactly one carousel geometry item is visible and it fills the viewport", ({ carouselGeometry }) => {
  const visible = carouselGeometry.visible(carouselGeometry.current, 0.001);
  expect(visible).toHaveLength(1);
  expect(visible[0].size).toBe(carouselGeometry.viewport);
  expect(visible[0].position).toBe(carouselGeometry.viewport / 2);
});
Then("the carousel geometry item sizes are exactly {string}", ({ carouselGeometry }, sizes: string) =>
  expect(carouselGeometry.current.map((item) => item.size)).toEqual(numbers(sizes)),
);
Then(
  "the carousel geometry item at index {int} is smaller than the focal size",
  ({ carouselGeometry }, index: number) =>
    expect(carouselGeometry.current[index].size).toBeLessThan(carouselGeometry.layout.itemSize),
);
Then("the carousel geometry items never move backward between consecutive samples", ({ carouselGeometry }) => {
  const { frames } = carouselGeometry;
  for (let step = 1; step < frames.length; step++) {
    frames[step].forEach((item, index) => {
      const previous = frames[step - 1][index];
      expect(item.position).toBeLessThanOrEqual(previous.position + 1e-8);
      expect(start(item)).toBeLessThanOrEqual(start(previous) + 1e-8);
    });
  }
});
Then(
  "every carousel geometry sample after the start is separated by gap {float}",
  ({ carouselGeometry }, gap: number) => {
    for (const items of carouselGeometry.frames.slice(1)) carouselGeometry.expectSeparatedByGap(items, gap);
  },
);
Then(
  "the carousel geometry item at index {int} starts exactly at {float}",
  ({ carouselGeometry }, index: number, edge: number) => expect(start(carouselGeometry.current[index])).toBe(edge),
);
Then(
  "the carousel geometry item at index {int} ends exactly at {float}",
  ({ carouselGeometry }, index: number, edge: number) => expect(end(carouselGeometry.current[index])).toBe(edge),
);
Then(
  "the visible carousel geometry previews number {int} and each measures between {float} and {float} pixels",
  ({ carouselGeometry }, count: number, min: number, max: number) => {
    const previews = carouselGeometry.previews();
    expect(previews).toHaveLength(count);
    for (const preview of previews) {
      expect(preview.size).toBeGreaterThanOrEqual(min);
      expect(preview.size).toBeLessThanOrEqual(max);
    }
  },
);
Then("the last visible carousel geometry preview ends at {float}", ({ carouselGeometry }, edge: number) =>
  expect(end(carouselGeometry.previews().at(-1)!)).toBeCloseTo(edge),
);
Then(
  "the carousel geometry item at index {int} ends within {float}",
  ({ carouselGeometry }, index: number, edge: number) =>
    expect(end(carouselGeometry.current[index])).toBeLessThanOrEqual(edge),
);
Then(
  "the carousel geometry item at index {int} is centered at {float}",
  ({ carouselGeometry }, index: number, center: number) =>
    expect(carouselGeometry.current[index].position).toBeCloseTo(center),
);
Then("the carousel geometry snap for item {int} is exactly the maximum scroll", ({ carouselGeometry }, index: number) =>
  expect(carouselGeometry.snap(index)).toBe(carouselGeometry.layout.maxScroll),
);
Then("more than one fully visible carousel geometry item is exactly the focal size", ({ carouselGeometry }) =>
  expect(
    carouselGeometry
      .fullyVisible(carouselGeometry.current)
      .filter((item) => item.size === carouselGeometry.layout.itemSize).length,
  ).toBeGreaterThan(1),
);
Then("every carousel geometry snap has items touching both viewport edges", ({ carouselGeometry }) => {
  for (const { items } of carouselGeometry.snaps) {
    expect(items.some((item) => Math.abs(start(item)) < 0.001)).toBe(true);
    expect(items.some((item) => Math.abs(end(item) - carouselGeometry.viewport) < 0.001)).toBe(true);
  }
});
Then(
  "the carousel geometry item at index {int} is centered exactly at {float}",
  ({ carouselGeometry }, index: number, center: number) =>
    expect(carouselGeometry.current[index].position).toBe(center),
);
Then(
  "the carousel geometry item at index {int} plus half the focal size is exactly {float}",
  ({ carouselGeometry }, index: number, edge: number) =>
    expect(carouselGeometry.current[index].position + carouselGeometry.layout.itemSize / 2).toBe(edge),
);
Then(
  "the carousel geometry snap for item {int} is exactly {float}",
  ({ carouselGeometry }, index: number, scroll: number) => expect(carouselGeometry.snap(index)).toBe(scroll),
);
When(
  "the carousel geometry is evaluated {float} pixel(s) past its maximum scroll",
  ({ carouselGeometry }, distance: number) => {
    carouselGeometry.evaluate(carouselGeometry.layout.maxScroll + distance);
  },
);
Then(
  "the carousel geometry item sizes at indexes {string} are exactly {string}",
  ({ carouselGeometry }, indexes: string, sizes: string) =>
    expect(numbers(indexes).map((index) => carouselGeometry.current[index].size)).toEqual(numbers(sizes)),
);
When("the carousel geometry is sampled at every whole pixel of its scroll range", ({ carouselGeometry }) =>
  carouselGeometry.sampleEveryPixel(),
);
Then(
  "the visible items in every carousel geometry sample are separated by gap {float}",
  ({ carouselGeometry }, gap: number) => {
    for (const items of carouselGeometry.frames)
      carouselGeometry.expectSeparatedByGap(carouselGeometry.visible(items), gap);
  },
);
When("the carousel geometry is evaluated at half its maximum scroll", ({ carouselGeometry }) => {
  carouselGeometry.evaluate(carouselGeometry.layout.maxScroll / 2);
});
Then("the visible carousel geometry items are separated by gap {float}", ({ carouselGeometry }, gap: number) =>
  carouselGeometry.expectSeparatedByGap(carouselGeometry.visible(carouselGeometry.current), gap),
);
When("the carousel geometry is scrolled from {float} to {float}", ({ carouselGeometry }, from: number, to: number) =>
  carouselGeometry.translate(from, to),
);
Then(
  "every carousel geometry item keeps exactly the focal size and moves by the scrolled distance",
  ({ carouselGeometry }) => {
    const { start: initial, moved, distance } = carouselGeometry.translation!;
    initial.forEach((item, index) => {
      expect(item.size).toBe(carouselGeometry.layout.itemSize);
      expect(moved[index].size).toBe(item.size);
      expect(moved[index].position).toBeCloseTo(item.position - distance);
    });
  },
);
When("the carousel geometry is created", ({ carouselGeometry }) => {
  carouselGeometry.created = createCarouselGeometry(carouselGeometry.options);
});
Then("no carousel geometry is produced", ({ carouselGeometry }) => expect(carouselGeometry.created).toBeUndefined());
