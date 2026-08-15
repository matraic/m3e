/** Specifies the possible grades of an icon. */
export type IconGrade = "low" | "medium" | "high";

/**
 * Determines whether a value is an `IconGrade`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `IconGrade`.
 */
export function isIconGrade(value: unknown): value is IconGrade {
  return value === "low" || value === "medium" || value === "high";
}
