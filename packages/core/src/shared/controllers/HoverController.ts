import { ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";

/** The callback function invoked when the hover state of an element changes. */
export type HoverControllerCallback = (hovering: boolean, target: HTMLElement) => void;

/** Encapsulates options used to configure a `HoverController`. */
export interface HoverControllerOptions extends MonitorControllerOptions {
  /** The callback invoked when the hover state of an element changes. */
  callback: HoverControllerCallback;

  /** The delay, in milliseconds, before reporting hover start. */
  startDelay?: number;

  /** The delay, in milliseconds, before reporting hover end. */
  endDelay?: number;
}

/** A `ReactiveController` used to monitor the hover state of one or more elements. */
export class HoverController extends MonitorControllerBase {
  /** @private */ readonly #callback: HoverControllerCallback;
  /** @private */ readonly #startDelays = new Map<HTMLElement, number>();
  /** @private */ readonly #endDelays = new Map<HTMLElement, number>();
  /** @private */ readonly #pointerInHandler = (e: Event) => this.#handlePointerEnter(e);
  /** @private */ readonly #pointerLeaveHandler = (e: Event) => this.#handlePointerLeave(e);

  /** The delay, in milliseconds, before reporting hover start. */
  startDelay: number;

  /** The delay, in milliseconds, before reporting hover end. */
  endDelay: number;

  /**
   * Initializes a new instance of this class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {HoverControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: HoverControllerOptions) {
    super(host, options);
    this.#callback = options.callback;
    this.startDelay = options.startDelay ?? 0;
    this.endDelay = options.endDelay ?? 0;
  }

  /** Clears any hover delays for all targets. */
  clearDelays(): void {
    for (const target of this.targets) {
      this.#clearDelays(target);
    }
  }

  /**
   * Starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  protected override _observe(target: HTMLElement): void {
    target.addEventListener("pointerenter", this.#pointerInHandler);
    target.addEventListener("pointerleave", this.#pointerLeaveHandler);
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected override _unobserve(target: HTMLElement): void {
    target.removeEventListener("pointerenter", this.#pointerInHandler);
    target.removeEventListener("pointerout", this.#pointerLeaveHandler);
  }

  /** @private */
  #clearDelays(target: HTMLElement): void {
    this.#clearStartDelay(target);
    this.#clearEndDelay(target);
  }

  /** @private */
  #clearStartDelay(target: HTMLElement): boolean {
    if (this.#startDelays.has(target)) {
      clearTimeout(this.#startDelays.get(target));
      return this.#startDelays.delete(target);
    }
    return false;
  }

  /** @private */
  #clearEndDelay(target: HTMLElement): boolean {
    if (this.#endDelays.has(target)) {
      clearTimeout(this.#endDelays.get(target));
      return this.#endDelays.delete(target);
    }
    return false;
  }

  /** @private */
  #handlePointerEnter(e: Event): void {
    const target = e.target as HTMLElement;

    // If there is a pending end delay, cancel it.
    this.#clearEndDelay(target);

    // Otherwise, if there is a pending start delay, cancel it and start a new one.
    if (this.startDelay > 0) {
      this.#clearStartDelay(target);
      this.#startDelays.set(
        target,
        setTimeout(() => {
          this.#startDelays.delete(target);
          this.#callback(true, target);
        }, this.startDelay)
      );
    } else {
      // Otherwise, report the start.
      this.#callback(true, target);
    }
  }

  /** @private */
  #handlePointerLeave(e: Event): void {
    const target = e.target as HTMLElement;

    // If there is a pending start delay, cancel it and do not report the end.
    if (this.#clearStartDelay(target)) return;

    // Otherwise, if there is a pending end delay, cancel it and start a new one.
    if (this.endDelay > 0) {
      this.#clearEndDelay(target);
      this.#endDelays.set(
        target,
        setTimeout(() => {
          this.#endDelays.delete(target);
          this.#callback(false, target);
        }, this.endDelay)
      );
    } else {
      // Otherwise, report the end.
      this.#callback(false, target);
    }
  }
}
