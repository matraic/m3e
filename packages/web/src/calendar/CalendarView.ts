/** Specifies the possible views of a calendar. */
export type CalendarView = "month" | "year" | "multi-year";

/**
 * Determines whether a value is a `CalendarView`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CalendarView`.
 */
export function isCalendarView(value: unknown): value is CalendarView {
  return value === "month" || value === "year" || value === "multi-year";
}
