/**
 * A deferred promise with externally exposed resolve and reject functions.
 * @template T The resolved type of the promise.
 */
export class DeferredPromise<T = void> {
  /** The promise that represents the deferred operation. */
  ready: Promise<T>;

  /** Resolves the `ready` promise with the given value.*/
  resolve!: (value: T) => void;

  /** Rejects the `ready` promise with the given reason.*/
  reject!: (reason?: unknown) => void;

  constructor() {
    this.ready = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
