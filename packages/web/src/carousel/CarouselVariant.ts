/** Specifies the various appearance variants supported by a carousel. */
export type CarouselVariant = "multi-browse" | "uncontained" | "hero" | "hero-centered" | "fullscreen";

/**
 * Determines whether a value is an `CarouselVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `CarouselVariant`.
 */
export function isCarouselVariant(value: unknown): value is CarouselVariant {
  return (
    value === "multi-browse" ||
    value === "uncontained" ||
    value === "hero" ||
    value === "hero-centered" ||
    value === "fullscreen"
  );
}
