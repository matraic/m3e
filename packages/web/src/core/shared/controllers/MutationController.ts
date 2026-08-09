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
  /** @private */ #callback: MutationCallback;
  /** @private */ #skipInitial = false;
  /** @private */ #config?: MutationObserverInit;
  /** @private */ #observer?: MutationObserver;
  /** @private */ #unobservedUpdate = true;
  /** @private */ #slotListeners = new Map<HTMLSlotElement, () => void>();
  /** @private */ #observedSlotted = new Map<HTMLSlotElement, Element[]>();

  /**
   * Initializes a new instance of the `MutationController` class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {MutationControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: MutationControllerOptions) {
    super(host, options);

    this.#callback = options.callback;
    this.#skipInitial = options.skipInitial ?? false;
    this.#config = options.config;

    if (isServer) return;
    if (!window.MutationObserver) {
      console.warn("MutationController error: the browser does not support MutationObserver.");
      return;
    }

    this.#observer = new MutationObserver((records, observer) => this.#callback(records, observer));
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
    this.#disconnect();
  }

  /** @inheritdoc */
  protected override _observe(target: HTMLElement): void {
    if (target instanceof HTMLSlotElement) {
      this.#attachSlotListener(target);
    } else {
      this.#observer?.observe(target, this.#config);
      this.#unobservedUpdate = true;
    }
  }

  /** @inheritdoc */
  protected override _unobserve(): void {
    this.#disconnect();

    for (const target of this.targets) {
      if (target instanceof HTMLSlotElement) {
        this.#attachSlotListener(target);
      } else {
        this.#observer?.observe(target, this.#config);
      }
    }
  }

  /** @private */
  #disconnect(): void {
    this.#observer?.disconnect();

    for (const [slot] of this.#slotListeners) {
      this.#detachSlotListener(slot);
    }

    this.#slotListeners.clear();
    this.#observedSlotted.clear();
  }

  /** @private */
  #attachSlotListener(slot: HTMLSlotElement) {
    if (this.#slotListeners.has(slot)) return;

    const handler = () => this.#onSlotChange(slot);
    slot.addEventListener("slotchange", handler);
    this.#slotListeners.set(slot, () => slot.removeEventListener("slotchange", handler));

    this.#onSlotChange(slot);
  }

  /** @private */
  #detachSlotListener(slot: HTMLSlotElement) {
    const remover = this.#slotListeners.get(slot);
    if (remover) {
      remover();
      this.#slotListeners.delete(slot);
    }

    this.#observedSlotted.delete(slot);
  }

  /** @private */
  #onSlotChange(slot: HTMLSlotElement) {
    this.#observer?.disconnect();

    const slotted = slot.assignedElements({ flatten: true });
    this.#observedSlotted.set(slot, slotted);

    for (const el of slotted) {
      this.#observer?.observe(el, this.#config);
    }

    for (const target of this.targets) {
      if (!(target instanceof HTMLSlotElement)) {
        this.#observer?.observe(target, this.#config);
      }
    }

    this.#unobservedUpdate = true;
  }
}
