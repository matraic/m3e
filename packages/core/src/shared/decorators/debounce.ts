/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A decorator that runs a function once after a given "cooldown" period.
 * @param {number} timeout The timeout, in milliseconds, after which the function is invoked.
 * @returns {MethodDecorator} The decorator that runs a function once after a given "cooldown" period.
 */
export function debounce(timeout: number): MethodDecorator {
  const _id = Symbol("_id");
  return (_: any, __: PropertyKey | symbol, descriptor: PropertyDescriptor) => {
    const orig = descriptor.value;
    descriptor.value = function (...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self: any = this;
      clearTimeout(self[_id]);
      self[_id] = setTimeout(() => orig.apply(this, args), timeout);
    };
    return descriptor;
  };
}
