/** Specifies the possible behavior modes for a linear progress bar. */
export type LinearProgressMode = "determinate" | "indeterminate" | "buffer" | "query";

/**
 * Determines whether a value is a `LinearProgressMode`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `LinearProgressMode`.
 */
export function isLinearProgressMode(value: unknown): value is LinearProgressMode {
  return value === "determinate" || value === "indeterminate" || value === "buffer" || value === "query";
}
