import { isServer, ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";

/** Encapsulates options used to configure a `MutationController`. */
export interface MutationControllerOptions extends MonitorControllerOptions {
  /** The callback used to process detected changes. */
  callback: MutationCallback;

  /**
   * By default, the `callback` is invoked without changes when a
   * target is observed in order to help maintain initial state. Use
   * `skipInitial` to skip this step.
   */
  skipInitial?: boolean;

  /** The configuration object for the underlying `MutationObserver`. */
  config?: MutationObserverInit;
}

/**
 * A `ReactiveController` that integrates a `MutationObserver` with an element's reactive update lifecycle
 * to detect arbitrary changes to DOM, including nodes being added or removed and attributes changing.
 */
export class MutationController extends MonitorControllerBase {
  /** @private */ #host: ReactiveControllerHost;
  /** @private */ #callback: MutationCallback;
  /** @private */ #skipInitial = false;
  /** @private */ #config?: MutationObserverInit;
  /** @private */ #observer?: MutationObserver;
  /** @private */ #unobservedUpdate = true;

  /**
   * Initializes a new instance of the `MutationController` class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {MutationControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: MutationControllerOptions) {
    super(host, options);

    this.#host = host;
    this.#callback = options.callback;
    this.#skipInitial = options.skipInitial ?? false;
    this.#config = options.config;

    if (isServer) return;
    if (!window.MutationObserver) {
      console.warn("MutationController error: the browser does not support MutationObserver.");
      return;
    }

    this.#observer = new MutationObserver((records, observer) => {
      this.#callback(records, observer);
      this.#host.requestUpdate();
    });
  }

  /** @inheritdoc */
  override async hostUpdated(): Promise<void> {
    if (this.#observer && !this.#skipInitial && this.#unobservedUpdate) {
      const records = this.#observer.takeRecords();
      if (records.length > 0) {
        this.#callback(records, this.#observer);
      }
    }
    this.#unobservedUpdate = false;
  }

  /** @inheritdoc */
  override hostDisconnected(): void {
    super.hostDisconnected();
    this.#observer?.disconnect();
  }

  /** @inheritdoc */
  protected override _observe(target: HTMLElement): void {
    this.#observer?.observe(target, this.#config);
    this.#unobservedUpdate = true;
    this.#host.requestUpdate();
  }

  /** @inheritdoc */
  protected override _unobserve(): void {
    this.#observer?.disconnect();
    for (const target of this.targets) {
      this.#observer?.observe(target, this.#config);
    }
  }
}
