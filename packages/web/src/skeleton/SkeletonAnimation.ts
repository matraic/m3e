/** Specifies the possible animation effects that can be applied to a skeleton. */
export type SkeletonAnimation = "pulse" | "wave" | "none";

/**
 * Determines whether a value is a `SkeletonAnimation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SkeletonAnimation`.
 */
export function isSkeletonAnimation(value: unknown): value is SkeletonAnimation {
  return value === "pulse" || value === "wave" || value === "none";
}
