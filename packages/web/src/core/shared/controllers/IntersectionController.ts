import { isServer, ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";

/** The callback function for a `IntersectionController`. */
export type IntersectionControllerCallback = (...args: Parameters<IntersectionObserverCallback>) => void;

/** Encapsulates options used to configure a `IntersectionController`. */
export interface IntersectionControllerOptions extends MonitorControllerOptions {
  /** The callback used to process detected changes. */
  callback: IntersectionControllerCallback;

  /**
   * By default, the `callback` is invoked without changes when a
   * target is observed in order to help maintain initial state. Use
   * `skipInitial` to skip this step.
   */
  skipInitial?: boolean;

  /** The configuration object for the underlying `IntersectionObserver`. */
  init?: IntersectionObserverInit;
}

/** A `ReactiveController` used to monitor changes in the intersection of a target element with an ancestor element. */
export class IntersectionController extends MonitorControllerBase {
  /** @private */ #host: ReactiveControllerHost;
  /** @private */ #callback: IntersectionControllerCallback;
  /** @private */ #skipInitial = false;
  /** @private */ #observer?: IntersectionObserver;
  /** @private */ #unobservedUpdate = true;

  /**
   * Initializes a new instance of the `IntersectionController` class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {IntersectionControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: IntersectionControllerOptions) {
    super(host, options);

    this.#host = host;
    this.#callback = options.callback;
    this.#skipInitial = options.skipInitial ?? false;

    if (isServer) return;
    if (!window.IntersectionObserver) {
      console.warn("IntersectionController error: the browser does not support IntersectionObserver.");
      return;
    }

    this.#observer = new IntersectionObserver((entries, observer) => {
      this.#callback(entries, observer);
      this.#host.requestUpdate();
    }, options.init);
  }

  /** @inheritdoc */
  override async hostUpdated(): Promise<void> {
    if (this.#observer && !this.#skipInitial && this.#unobservedUpdate) {
      this.#callback([], this.#observer);
    }
    this.#unobservedUpdate = false;
  }

  /**
   * Starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  protected override _observe(target: HTMLElement): void {
    this.#observer?.observe(target);
    this.#unobservedUpdate = true;
    this.#host.requestUpdate();
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected override _unobserve(target: HTMLElement): void {
    this.#observer?.unobserve(target);
  }
}
