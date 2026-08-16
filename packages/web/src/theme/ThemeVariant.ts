/** Specifies the color variants of a theme. */
export type ThemeVariant =
  | "monochrome"
  | "neutral"
  | "tonal-spot"
  | "vibrant"
  | "expressive"
  | "fidelity"
  | "content"
  | "rainbow"
  | "fruit-salad";

/**
 * Determines whether a value is a `ThemeVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ThemeVariant`.
 */
export function isThemeVariant(value: unknown): value is ThemeVariant {
  return (
    value === "monochrome" ||
    value === "neutral" ||
    value === "tonal-spot" ||
    value === "vibrant" ||
    value === "expressive" ||
    value === "fidelity" ||
    value === "content" ||
    value === "rainbow" ||
    value === "fruit-salad"
  );
}
