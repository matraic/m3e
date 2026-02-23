/**
 * Determines whether an object has keys for a given type.
 * @template T The type to test.
 * @param {unknown} value The value to test.
 * @param {...keys: Array<keyof T>} keys The keys of `T` to test.
 * @returns {boolean} Whether `value` has all `keys`.
 */
export function hasKeys<T extends object>(value: unknown, ...keys: Array<keyof T>): boolean {
  return typeof value === "object" && value !== null && keys.every((x) => x in value);
}
