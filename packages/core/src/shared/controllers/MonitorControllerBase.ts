import { ReactiveController, ReactiveControllerHost } from "lit";

/** Encapsulates options used to monitor the state of one or more elements. */
export interface MonitorControllerOptions {
  /**
   * The element to observe. In addition to configuring the target here,
   * the `observe` method can be called to observe additional targets. When
   * not specified, the target defaults to the `host`. If set to `null`, no
   * target is automatically observed. Only the configured target will be
   * re-observed if the host connects again after unobserving via disconnection.
   */
  target?: HTMLElement | null;
}

/**
 * A base implementation for a `ReactiveController` used to monitor the state of one
 * or more elements. This class must be inherited.
 */
export abstract class MonitorControllerBase implements ReactiveController {
  /** @private */ readonly #host: ReactiveControllerHost & HTMLElement;
  /** @private */ readonly #target?: HTMLElement | null;
  /** @private */ readonly #targets = new Set<HTMLElement>();

  /**
   * Initializes the `MonitorControllerBase` base class values when called by a derived class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {MonitorControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: MonitorControllerOptions) {
    this.#host = host;
    this.#target = options.target;
    this.#host.addController(this);
  }

  /** The targets being observed. */
  get targets(): Iterable<HTMLElement> {
    return this.#targets.values();
  }

  /** @inheritdoc */
  hostConnected(): void {
    // Target defaults to host unless explicitly null.
    if (this.#target !== null) {
      this.observe(this.#target ?? this.#host);
    }
  }

  /** @inheritdoc */
  hostDisconnected(): void {
    this.#targets.forEach((x) => this.unobserve(x));
    this.#targets.clear();
  }

  /** @inheritdoc */
  hostUpdate?(): void;

  /** @inheritdoc */
  hostUpdated?(): void;

  /**
   * Starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  observe(target: HTMLElement): void {
    if (this.#targets.has(target)) return;
    this.#targets.add(target);
    this._observe(target);
  }

  /**
   * Determines whether the specified element is being observed.
   * @param {HTMLElement} target The element to test.
   * @returns {boolean} Whether `target` is being observed.
   */
  isObserving(target: HTMLElement): boolean {
    return this.#targets.has(target);
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  unobserve(target: HTMLElement): void {
    if (!this.#targets.delete(target)) return;
    this._unobserve(target);
  }

  /**
   * When implemented by a derived class, starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  protected abstract _observe(target: HTMLElement): void;

  /**
   * When implemented by a derived class, stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected abstract _unobserve(target: HTMLElement): void;
}
