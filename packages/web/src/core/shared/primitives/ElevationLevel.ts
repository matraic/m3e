/** Specifies the possible levels in which to visually depict elevation. */
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Determines whether a value is an `ElevationLevel`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `ElevationLevel`.
 */
export function isElevationLevel(value: unknown): value is ElevationLevel {
  return value === 0 || value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}
