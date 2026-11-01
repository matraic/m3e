/** Specifies a scroll-driven behavior applied to an app-bar. */
export type AppBarScrollBehavior = "elevate" | "compress" | "hide" | "transparent";

/**
 * Determines whether a value is an `AppBarScrollBehavior`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `AppBarScrollBehavior`.
 */
export function isAppBarScrollBehavior(value: unknown): value is AppBarScrollBehavior {
  return value === "elevate" || value === "compress" || value === "hide" || value === "transparent";
}
