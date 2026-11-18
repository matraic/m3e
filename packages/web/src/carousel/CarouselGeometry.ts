import { CarouselVariant } from "./CarouselVariant";

/** Options used to calculate item sizes and positions for a carousel. */
export interface CarouselGeometryOptions {
  /** Carousel layout strategy. */
  variant: CarouselVariant;

  /** Available size along the scrolling axis. */
  viewportSize: number;

  /** Space between adjacent items. */
  gap: number;

  /** Number of items in the carousel. */
  count: number;

  /** Fallback size for fixed-size variants and default multi-browse preferred size. */
  baseSize: number;

  /** Preferred size of a large item for responsive arrangements. */
  preferredSize?: number;

  /** Keep items at a fixed size instead of interpolating masks while scrolling. */
  reducedMotion?: boolean;

  /** Minimum permitted preview size. */
  minSmallSize?: number;

  /** Maximum permitted preview size. */
  maxSmallSize?: number;

  /** Upper bound for large items in responsive arrangements. */
  maxLargeSize?: number;
}

/** The center position and rendered size of one item. */
export interface CarouselItemGeometry {
  /** Center position along the scrolling axis, relative to the viewport. */
  position: number;

  /** Item size along the scrolling axis. */
  size: number;
}

/** Calculated dimensions and position helpers for a carousel layout. */
export interface CarouselGeometry {
  /** Number of populated large-item slots in a responsive arrangement; one for fixed-size layouts. */
  largeCount: number;

  /** Size of a large item, or the fixed item size for uncontained/fullscreen. */
  itemSize: number;

  /** Resolved small-preview size; zero when the arrangement has no small previews. */
  smallSize: number;

  /** Resolved medium-preview size, or the midpoint of the large and small sizes. */
  mediumSize: number;

  /** Maximum native scroll offset for the full, large-item track. */
  maxScroll: number;

  /** Item centers and sizes at a native scroll offset. */
  itemsAt(scroll: number): CarouselItemGeometry[];

  /** Native scroll offset that brings an item to its current position; responsive intervals follow visual travel. */
  scrollForIndex(index: number): number;
}

/** @private */
interface CarouselArrangement {
  largeCount: number;
  largeSize: number;
  mediumCount: number;
  mediumSize: number;
  smallCount: number;
  smallSize: number;
  centered: boolean;
}

/** @private */
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** @private */
function interpolateItems(
  from: CarouselItemGeometry[],
  to: CarouselItemGeometry[],
  fraction: number,
): CarouselItemGeometry[] {
  return from.map((item, index) => ({
    position: item.position + (to[index].position - item.position) * fraction,
    size: item.size + (to[index].size - item.size) * fraction,
  }));
}

/** @private */
function chooseArrangement(
  variant: CarouselVariant,
  viewport: number,
  gap: number,
  count: number,
  preferred: number,
  minSmall: number,
  maxSmall: number,
  maxLarge: number,
): CarouselArrangement | undefined {
  const multiBrowse = variant === "multi-browse";

  // Centered hero keeps the current large item between previews when enough items exist.
  const centered = variant === "hero-centered" && count >= 3;
  const target = Math.max(Math.min(preferred, maxLarge), Math.min(viewport, maxLarge, minSmall * 1.25));
  const targetSmall = clamp(target / 3, minSmall, maxSmall);
  const targetMedium = multiBrowse ? (target + targetSmall) / 2 : 0;
  const requiredSmall = multiBrowse ? 1 : centered ? 2 : count > 1 ? 1 : 0;
  const threshold = multiBrowse ? minSmall * 2 : minSmall * (requiredSmall + 1.25);
  const smallCount = viewport < threshold ? 0 : requiredSmall;
  const minimumLarge = Math.max(
    1,
    Math.floor((viewport - (multiBrowse ? targetMedium + maxSmall * smallCount : minSmall * smallCount)) / target),
  );

  const maximumLarge = Math.max(1, Math.ceil(viewport / target));

  const fit = (smalls: number, mediums?: number): CarouselArrangement | undefined => {
    let best: CarouselArrangement | undefined;
    let bestCost = Number.POSITIVE_INFINITY;
    let priority = 0;

    const mediumCounts = mediums !== undefined ? [mediums] : multiBrowse ? [1, 0] : [0];

    for (let largeCount = maximumLarge; largeCount >= minimumLarge; largeCount--) {
      for (const mediumCount of mediumCounts) {
        priority++;

        const available = viewport - (largeCount + mediumCount + smalls - 1) * gap;
        const slack = available - largeCount * target - mediumCount * targetMedium - smalls * targetSmall;
        const smallSize = smalls > 0 ? clamp(targetSmall + slack / smalls, minSmall, maxSmall) : 0;

        // Share space between large and medium items while preserving their midpoint size relation.
        let largeSize = (available - (smalls + mediumCount / 2) * smallSize) / (largeCount + mediumCount / 2);
        let mediumSize = mediumCount > 0 ? (largeSize + smallSize) / 2 : 0;

        if (mediumCount > 0) {
          const correction =
            Math.sign(target - largeSize) *
            Math.min(Math.abs(target - largeSize) * largeCount, mediumSize * mediumCount * 0.1);

          largeSize += correction / largeCount;
          mediumSize -= correction / mediumCount;
        }

        if (
          largeSize <= 0 ||
          largeSize > maxLarge + 0.001 ||
          (smalls > 0 && largeSize <= smallSize) ||
          (mediumCount > 0 && (mediumSize <= smallSize || mediumSize >= largeSize))
        ) {
          continue;
        }

        const cost = Math.abs(target - largeSize) * priority;
        if (cost < bestCost) {
          bestCost = cost;
          best = { largeCount, largeSize, mediumCount, mediumSize, smallCount: smalls, smallSize, centered };
        }
      }
    }

    return best;
  };

  let arrangement = fit(smallCount);

  // If previews cannot fit, retry with large items only.
  if (!arrangement && smallCount > 0) {
    arrangement = fit(0);
  }

  // A short multi-browse list may not have enough items for every preview slot.
  if (multiBrowse && arrangement && count < arrangement.largeCount + arrangement.mediumCount + arrangement.smallCount) {
    arrangement = fit(0, arrangement.mediumCount);
  }

  if (
    arrangement?.centered &&
    count > arrangement.largeCount &&
    count < arrangement.largeCount + arrangement.smallCount &&
    count * arrangement.largeSize + (count - 1) * gap > viewport
  ) {
    arrangement = fit(count - arrangement.largeCount);
    if (arrangement) arrangement.centered = false;
  }

  if (arrangement) {
    arrangement.centered &&= count >= arrangement.largeCount + arrangement.mediumCount + arrangement.smallCount;
  }

  return arrangement;
}

/**
 * Creates responsive carousel geometry for the provided viewport and item count.
 * Reuses at most two neighboring responsive arrangements per instance while returning independent item geometry.
 * @param {CarouselGeometryOptions} options - Variant, viewport dimensions, item count, and optional sizing constraints.
 * @returns {CarouselGeometry | undefined} The calculated geometry, or `undefined` if the inputs are invalid or no arrangement fits.
 */
export function createCarouselGeometry(options: CarouselGeometryOptions): CarouselGeometry | undefined {
  const { variant } = options;
  const viewportSize = options.viewportSize;
  const count = Math.floor(options.count);

  if (!Number.isFinite(viewportSize) || viewportSize <= 0 || !Number.isFinite(count) || count <= 0) {
    return undefined;
  }

  const gap = options.gap;
  const minSmallSize = options.minSmallSize ?? 40;
  const maxSmallSize = Math.max(minSmallSize, options.maxSmallSize ?? 56);
  const maxLargeSize =
    options.maxLargeSize && options.maxLargeSize > 0 ? Math.min(viewportSize, options.maxLargeSize) : viewportSize;

  const baseSize = options.baseSize;
  const preferredSize = options.preferredSize;
  const fixedSize = variant === "uncontained" || variant === "fullscreen";
  const preferred =
    preferredSize !== undefined && preferredSize > 0
      ? preferredSize
      : variant === "multi-browse"
        ? baseSize
        : viewportSize;

  const arrangement = fixedSize
    ? undefined
    : chooseArrangement(variant, viewportSize, gap, count, preferred, minSmallSize, maxSmallSize, maxLargeSize);

  if (!fixedSize && !arrangement) {
    return undefined;
  }

  const itemSize =
    arrangement?.largeSize ?? (variant === "fullscreen" ? viewportSize : Math.min(baseSize, viewportSize));
  const pitch = itemSize + gap;
  const maxScroll = Math.max(0, count * itemSize + (count - 1) * gap - viewportSize);

  const boundedScroll = (scroll: number): number => clamp(Number.isFinite(scroll) ? scroll : 0, 0, maxScroll);
  const layoutAt = (focus: number): CarouselItemGeometry[] => {
    const { largeCount, mediumCount, mediumSize, smallCount, smallSize, centered } = arrangement!;
    const previews = [...Array<number>(smallCount).fill(smallSize), ...Array<number>(mediumCount).fill(mediumSize)];
    const slotCount = largeCount + previews.length;
    const focalOffset = centered ? Math.floor((largeCount - 1) / 2) : 0;
    const first = clamp(focus - focalOffset - (centered ? smallCount / 2 : 0), 0, Math.max(0, count - slotCount));
    const leading = clamp(focus - first - (centered ? focalOffset : largeCount - 1), 0, previews.length);

    // Preview sizes expand toward the leading edge and contract toward the trailing edge.
    const slots = [
      ...previews.slice(0, leading),
      ...Array<number>(largeCount).fill(itemSize),
      ...previews.slice(leading).reverse(),
    ];

    const fallbackSize = smallSize || mediumSize || itemSize;
    const items = new Array<CarouselItemGeometry>(count);

    let edge = 0;
    for (let index = first; index < count; index++) {
      const size = slots[index - first] ?? fallbackSize;
      items[index] = { position: edge + size / 2, size };
      edge += size + gap;
    }

    edge = -gap;

    for (let index = first - 1; index >= 0; index--) {
      items[index] = { position: edge - fallbackSize / 2, size: fallbackSize };
      edge -= fallbackSize + gap;
    }

    if (slotCount > count && count > 1) {
      const last = items[count - 1];
      const shift = (Math.max(0, viewportSize - last.position - last.size / 2) * focus) / (count - 1);
      return items.map((item) => ({ ...item, position: item.position + shift }));
    }

    if (
      !centered &&
      previews.length > 0 &&
      first === count - slotCount &&
      focus > first &&
      focus < first + largeCount
    ) {
      // Blend the final partial layout into the end-aligned layout to avoid a jump at the track end.
      const end = layoutAt(first + largeCount);
      const fraction = (focus - first) / largeCount;
      return interpolateItems(items, end, fraction);
    }

    return items;
  };

  let snapOffsets: number[] | undefined;
  if (!fixedSize && !options.reducedMotion && maxScroll > 0) {
    const { largeCount, mediumCount, smallCount } = arrangement!;
    const edgeCount = largeCount + mediumCount + smallCount;
    const travel = (from: CarouselItemGeometry[], to: CarouselItemGeometry[]): number =>
      to.reduce((maximum, item, index) => Math.max(maximum, Math.abs(item.position - from[index].position)), 0);

    snapOffsets = Array<number>(count).fill(0);
    let previous = layoutAt(0);
    let stepDistance = 0;

    for (let index = 1; index < count; index++) {
      let distance = stepDistance;

      // Interior transitions repeat; only calculate layouts at the edges and the first interior step.
      if (index <= edgeCount + 1 || index >= count - edgeCount) {
        if (index === count - edgeCount && index > edgeCount + 1) {
          previous = layoutAt(index - 1);
        }

        const next = layoutAt(index);
        distance = travel(previous, next);
        previous = next;
        stepDistance = distance;
      }

      // Allocate scroll distance by visible movement, including stationary keylines at either end.
      snapOffsets[index] = snapOffsets[index - 1] + distance;
    }

    const distance = snapOffsets[count - 1];
    snapOffsets = distance > 0 ? snapOffsets.map((offset) => (offset / distance) * maxScroll) : undefined;
  }

  const scrollForIndex = (index: number): number => {
    const itemIndex = clamp(Number.isFinite(index) ? Math.floor(index) : 0, 0, count - 1);

    if (options.reducedMotion || fixedSize) {
      const centering = arrangement?.centered ? (viewportSize - itemSize) / 2 : 0;
      return boundedScroll(itemIndex * pitch - centering);
    }

    return snapOffsets?.[itemIndex] ?? (count === 1 ? 0 : (maxScroll * itemIndex) / (count - 1));
  };

  let cachedLayouts:
    | {
        lower: number;
        from: CarouselItemGeometry[];
        to?: CarouselItemGeometry[];
      }
    | undefined;

  const itemsAt = (scroll: number): CarouselItemGeometry[] => {
    const offset = boundedScroll(scroll);
    if (options.reducedMotion || fixedSize || maxScroll === 0) {
      return Array.from({ length: count }, (_, index) => ({
        position: itemSize / 2 + index * pitch - offset,
        size: itemSize,
      }));
    }

    // Map native scroll progress to a fractional item index for smooth mask interpolation.
    let rawPhase = (offset / maxScroll) * (count - 1);
    if (snapOffsets) {
      const upper = snapOffsets.findIndex((snap) => snap > offset);
      rawPhase =
        upper < 0
          ? count - 1
          : upper - 1 + (offset - snapOffsets[upper - 1]) / (snapOffsets[upper] - snapOffsets[upper - 1]);
    }

    const nearest = Math.round(rawPhase);
    const phase = Math.abs(rawPhase - nearest) < 1e-10 ? nearest : rawPhase;
    const lower = Math.floor(phase);
    const fraction = phase - lower;

    if (cachedLayouts?.lower !== lower) {
      const from = cachedLayouts?.lower === lower - 1 ? (cachedLayouts.to ?? layoutAt(lower)) : layoutAt(lower);
      const to = cachedLayouts?.lower === lower + 1 ? cachedLayouts.from : undefined;
      cachedLayouts = { lower, from, to };
    }

    if (fraction === 0) {
      return cachedLayouts.from.map((item) => ({ ...item }));
    }

    cachedLayouts.to ??= layoutAt(lower + 1);
    const items = interpolateItems(cachedLayouts.from, cachedLayouts.to, fraction);
    const minimumSize = arrangement!.smallSize || arrangement!.mediumSize || itemSize;

    // Keep the inward edge moving while shrinking against the viewport; only small masks may cross it.
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (item.size <= minimumSize) continue;
      const left = item.position - item.size / 2;
      const right = item.position + item.size / 2;
      if (left < 0) {
        item.size = Math.max(minimumSize, right);
        item.position = right - item.size / 2;

        let edge = right - item.size - gap;
        for (let previous = index - 1; previous >= 0; previous--) {
          items[previous].position = edge - items[previous].size / 2;
          edge -= items[previous].size + gap;
        }
      } else if (right > viewportSize) {
        item.size = Math.max(minimumSize, viewportSize - left);
        item.position = left + item.size / 2;

        let edge = left + item.size + gap;
        for (let next = index + 1; next < items.length; next++) {
          items[next].position = edge + items[next].size / 2;
          edge += items[next].size + gap;
        }
      }
    }

    return items;
  };

  const smallSize = arrangement?.smallSize || 0;
  const mediumSize = arrangement?.mediumSize || (itemSize + smallSize) / 2;
  return {
    largeCount: Math.min(count, arrangement?.largeCount ?? 1),
    itemSize,
    smallSize,
    mediumSize,
    maxScroll,
    itemsAt,
    scrollForIndex,
  };
}
