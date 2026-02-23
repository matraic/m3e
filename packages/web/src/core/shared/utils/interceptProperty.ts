/**
 * Intercepts property access and mutations on a target object, allowing custom logic
 * to run when the property is read or written to.
 *
 * @template T - The type of the target object.
 * @template K - The key of the property being intercepted (must be a valid key of T).
 * @param target - The object whose property should be intercepted.
 * @param prop - The property key to intercept.
 * @param options - Configuration object for interceptor callbacks.
 * @returns A cleanup function that removes the interceptors and restores the original property descriptor.
 * @throws {Error} If the property does not exist on the target object or its prototype chain.
 */
export function interceptProperty<T extends object, K extends keyof T>(
  target: T,
  prop: K,
  options: {
    get?: (getter: () => T[K]) => T[K];
    set?: (value: T[K], setter: (v: T[K]) => void) => void;
  }
): () => void {
  const descriptor =
    Object.getOwnPropertyDescriptor(target, prop) ??
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), prop);

  if (!descriptor) {
    throw new Error(`Property ${String(prop)} not found on target.`);
  }

  const getter = descriptor.get?.bind(target);
  const setter = descriptor.set?.bind(target);

  Object.defineProperty(target, prop, {
    configurable: true,
    enumerable: descriptor.enumerable,
    get() {
      return options.get ? options.get(() => getter?.() as T[K]) : getter?.();
    },
    set(v: T[K]) {
      if (options.set) {
        options.set(v, (val) => setter?.(val));
      } else {
        setter?.(v);
      }
    },
  });

  return () => Object.defineProperty(target, prop, descriptor);
}
