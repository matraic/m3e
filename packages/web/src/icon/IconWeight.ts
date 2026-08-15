/** Specifies the weights of an icon. */
export type IconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

/**
 * Determines whether a value is an `IconWeight`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `IconWeight`.
 */
export function isIconWeight(value: unknown): value is IconWeight {
  return (
    value === 100 || value === 200 || value === 300 || value === 400 || value === 500 || value === 600 || value === 700
  );
}
