/** Specifies the possible shapes of a skeleton. */
export type SkeletonShape = "circular" | "rounded" | "square" | "auto";

/**
 * Determines whether a value is a `SkeletonShape`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SkeletonShape`.
 */
export function isSkeletonShape(value: unknown): value is SkeletonShape {
  return value === "circular" || value === "rounded" || value === "square" || value === "auto";
}
