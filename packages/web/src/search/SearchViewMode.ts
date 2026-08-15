/** Specifies the possible behavior modes of a search view. */
export type SearchViewMode = "fullscreen" | "docked" | "auto";

/**
 * Determines whether a value is a `SearchViewMode`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SearchViewMode`.
 */
export function isSearchViewMode(value: unknown): value is SearchViewMode {
  return value === "fullscreen" || value === "docked" || value === "auto";
}
