/** Constructor used to define mixins. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = abstract new (...args: any[]) => T;
