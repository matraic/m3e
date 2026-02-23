import { isServer, ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";

/** The callback function for a `ResizeController`. */
export type ResizeControllerCallback = (...args: Parameters<ResizeObserverCallback>) => void;

/** Encapsulates options used to configure a `ResizeController`. */
export interface ResizeControllerOptions extends MonitorControllerOptions {
  /** The callback used to process detected changes. */
  callback: ResizeControllerCallback;

  /**
   * By default, the `callback` is invoked without changes when a
   * target is observed in order to help maintain initial state. Use
   * `skipInitial` to skip this step.
   */
  skipInitial?: boolean;

  /** The configuration object for the underlying `ResizeObserver`. */
  config?: ResizeObserverOptions;
}

/** A `ReactiveController` used to monitor when an element is resized. */
export class ResizeController extends MonitorControllerBase {
  /** @private */ readonly #host: ReactiveControllerHost;
  /** @private */ readonly #callback: ResizeControllerCallback;
  /** @private */ readonly #skipInitial: boolean;
  /** @private */ readonly #config?: ResizeObserverOptions;
  /** @private */ readonly #observer?: ResizeObserver;
  /** @private */ #unobservedUpdate = true;

  /**
   * Initializes a new instance of the `ResizeController` class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {ResizeControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: ResizeControllerOptions) {
    super(host, options);

    this.#host = host;
    this.#callback = options.callback;
    this.#skipInitial = options.skipInitial ?? false;
    this.#config = options.config;

    if (isServer) return;
    if (!window.ResizeObserver) {
      console.warn("ResizeController error: the browser does not support ResizeObserver.");
      return;
    }

    this.#observer = new ResizeObserver((entries, observer) => {
      this.#callback(entries, observer);
      this.#host.requestUpdate();
    });
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
    this.#observer?.observe(target, this.#config);
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
