import {
  createCarouselGeometry,
  type CarouselGeometry,
  type CarouselGeometryOptions,
  type CarouselItemGeometry,
} from "../../src/carousel/CarouselGeometry";
import { expect } from "../fixtures";
import { isCarouselVariant } from "../../src/carousel/CarouselVariant";

type Items = CarouselItemGeometry[];
type Boundary = { before: Items; after: Items };
type Snap = { index: number; scroll: number; items: Items };
type Transition = {
  index: number;
  from: Items;
  to: Items;
  halfway: Items;
  samples: Items[];
  nearEnd: Items;
};

/** Creates, samples and measures pure carousel geometry calculations without rendering a page. */
export class CarouselGeometryHarness {
  options!: CarouselGeometryOptions;
  created?: CarouselGeometry;
  current: Items = [];
  buildCounts: number[] = [];
  cacheChecks: { actual: Items; expected: Items }[] = [];
  firstItems: CarouselItemGeometry[] = [];
  snaps: Snap[] = [];
  boundaries: Boundary[] = [];
  transitions: Transition[] = [];
  outgoingRights: number[][] = [];
  frames: Items[] = [];
  drags: { distance: number; fromStart: Items; fromEnd: Items }[] = [];
  translation?: { start: Items; moved: Items; distance: number };

  configure(row: Record<string, string>) {
    const variant = row.variant;
    if (!isCarouselVariant(variant)) {
      throw new Error(`Unknown carousel geometry variant "${variant}".`);
    }
    const number = (key: keyof CarouselGeometryOptions) => {
      const value = row[key];
      if (value === undefined || value === "" || !Number.isFinite(Number(value))) {
        throw new Error(`Carousel geometry requires a numeric "${key}" value.`);
      }
      return Number(value);
    };
    const optionalNumber = (key: keyof CarouselGeometryOptions) =>
      row[key] === undefined || row[key] === "" ? undefined : number(key);
    if (row.reducedMotion !== undefined && !["", "true", "false"].includes(row.reducedMotion)) {
      throw new Error(`Invalid carousel geometry reducedMotion value "${row.reducedMotion}".`);
    }
    this.options = {
      variant,
      viewportSize: number("viewportSize"),
      gap: number("gap"),
      count: number("count"),
      baseSize: number("baseSize"),
      preferredSize: optionalNumber("preferredSize"),
      minSmallSize: optionalNumber("minSmallSize"),
      maxSmallSize: optionalNumber("maxSmallSize"),
      maxLargeSize: optionalNumber("maxLargeSize"),
      reducedMotion:
        row.reducedMotion === undefined || row.reducedMotion === "" ? undefined : row.reducedMotion === "true",
    };
  }

  get layout() {
    this.created ??= createCarouselGeometry(this.options);
    expect(this.created).toBeDefined();
    return this.created!;
  }

  get viewport() {
    return this.options.viewportSize;
  }

  fresh(options: Partial<CarouselGeometryOptions> = {}) {
    return createCarouselGeometry({ ...this.options, ...options })!;
  }

  evaluate(scroll: number) {
    this.current = this.layout.itemsAt(scroll);
    return this.current;
  }

  snap(index: number) {
    return this.layout.scrollForIndex(index);
  }

  visible(items: Items, tolerance = 0) {
    return items.filter(
      (item) => item.position + item.size / 2 > tolerance && item.position - item.size / 2 < this.viewport - tolerance,
    );
  }

  fullyVisible(items: Items) {
    return items.filter((item) => item.position - item.size / 2 >= 0 && item.position + item.size / 2 <= this.viewport);
  }

  expectSeparatedByGap(items: Items, gap = this.options.gap) {
    for (let index = 1; index < items.length; index++) {
      const centerDistance = items[index].position - items[index - 1].position;
      expect(centerDistance).toBeCloseTo(items[index - 1].size / 2 + gap + items[index].size / 2);
    }
  }

  countArrangementBuilds(samples: [number, number][]) {
    const layout = this.layout;
    const count = this.options.count;
    const sample = (index: number, fraction: number) =>
      layout.itemsAt(
        layout.scrollForIndex(index) + (layout.scrollForIndex(index + 1) - layout.scrollForIndex(index)) * fraction,
      );
    const OriginalArray = globalThis.Array;
    let builds = 0;
    this.buildCounts = [];
    globalThis.Array = new Proxy(OriginalArray, {
      construct(target, args, newTarget) {
        if (args.length === 1 && args[0] === count) builds++;
        return Reflect.construct(target, args, newTarget);
      },
    });
    try {
      for (const [index, fraction] of samples) {
        sample(index, fraction);
        this.buildCounts.push(builds);
      }
    } finally {
      globalThis.Array = OriginalArray;
    }
  }

  sampleSnapsAndMidpointsMutatingResults() {
    const layout = this.layout;
    const count = this.options.count;
    const offsets = Array.from({ length: count }, (_, index) => layout.scrollForIndex(index));
    const samples = offsets.flatMap((offset, index) =>
      index + 1 < count ? [offset, (offset + offsets[index + 1]) / 2] : [offset],
    );
    this.cacheChecks = [];
    for (const offset of [...samples, ...samples.reverse()]) {
      const expected = this.fresh().itemsAt(offset);
      const items = layout.itemsAt(offset);
      this.cacheChecks.push({ actual: structuredClone(items), expected });
      items[0].position = -999;
      items[0].size = -1;
      items.splice(1);
    }
  }

  trackFirstItemUntilExit(step: number) {
    const layout = this.layout;
    this.firstItems = [layout.itemsAt(0)[0]];
    for (let scroll = step; scroll <= layout.maxScroll; scroll += step) {
      const first = layout.itemsAt(scroll)[0];
      this.firstItems.push(first);
      if (first.position + first.size / 2 <= 0) break;
    }
  }

  evaluateSnaps(indexes = Array.from({ length: this.options.count }, (_, index) => index)) {
    this.snaps = indexes.map((index) => {
      const scroll = this.snap(index);
      return { index, scroll, items: this.layout.itemsAt(scroll) };
    });
  }

  evaluateAround(scroll: number, distance: number) {
    const before = this.layout.itemsAt(scroll);
    const after = this.layout.itemsAt(scroll + distance);
    this.boundaries = [{ before, after }];
    this.current = before;
  }

  evaluateEitherSideOfSnaps(indexes: number[], distance: number) {
    this.boundaries = indexes.map((index) => {
      const offset = this.snap(index);
      return {
        before: this.layout.itemsAt(Math.max(0, offset - distance)),
        after: this.layout.itemsAt(Math.min(this.layout.maxScroll, offset + distance)),
      };
    });
  }

  sampleSnapTransitions(fractions: number[]) {
    const layout = this.layout;
    this.transitions = [];
    for (let index = 0; index < this.options.count - 1; index++) {
      const start = layout.scrollForIndex(index);
      const end = layout.scrollForIndex(index + 1);
      this.transitions.push({
        index,
        from: layout.itemsAt(start),
        to: layout.itemsAt(end),
        halfway: layout.itemsAt((start + end) / 2),
        samples: fractions.map((fraction) => layout.itemsAt(start + (end - start) * fraction)),
        nearEnd: layout.itemsAt(end - 0.001),
      });
    }
  }

  trackOutgoingPreviews(first: number, last: number, steps: number) {
    this.outgoingRights = [];
    for (let index = first; index <= last; index++) {
      const start = this.snap(index);
      const end = this.snap(index + 1);
      const rights: number[] = [];
      for (let step = 0; step <= steps; step++) {
        const preview = this.layout.itemsAt(start + ((end - start) * step) / steps)[index - 1];
        rights.push(preview.position + preview.size / 2);
      }
      this.outgoingRights.push(rights);
    }
  }

  sampleEvenly(intervals: number) {
    this.frames = Array.from({ length: intervals + 1 }, (_, step) =>
      this.layout.itemsAt((this.layout.maxScroll * step) / intervals),
    );
  }

  sampleEveryPixel() {
    this.frames = [];
    for (let scroll = 0; scroll <= this.layout.maxScroll; scroll++) this.frames.push(this.layout.itemsAt(scroll));
  }

  dragInward(distances: number[]) {
    this.drags = distances.map((distance) => ({
      distance,
      fromStart: this.layout.itemsAt(distance),
      fromEnd: this.layout.itemsAt(this.layout.maxScroll - distance),
    }));
  }

  translate(from: number, to: number) {
    this.translation = {
      start: this.layout.itemsAt(from),
      moved: this.layout.itemsAt(to),
      distance: to - from,
    };
  }

  clippedItems() {
    return this.frames.flatMap((items) =>
      items.filter((item) => {
        const left = item.position - item.size / 2;
        const right = item.position + item.size / 2;
        if (right <= 0 || left >= this.viewport) return false;
        return left < -0.001 || right > this.viewport + 0.001;
      }),
    );
  }

  previews() {
    return this.visible(this.current).filter((item) => item.size < this.layout.itemSize - 0.01);
  }
}
