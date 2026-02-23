import { ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";

/** The callback function invoked when a long press gesture is detected. */
export type LongPressControllerCallback = (pressed: boolean, target: HTMLElement) => void;

/** Encapsulates options used to configure a `LongPressController`. */
export interface LongPressControllerOptions extends MonitorControllerOptions {
  /** The callback invoked when the pressed state of an element changes. */
  callback: LongPressControllerCallback;

  /** The amount of time, in milliseconds, a touch gesture must be held. */
  threshold?: number;
}

/** A `ReactiveController` used to detect a long press gesture. */
export class LongPressController extends MonitorControllerBase {
  /** @private */ readonly #callback: LongPressControllerCallback;
  /** @private */ readonly #threshold: number;
  /** @private */ readonly #pressedTargets = new Set<HTMLElement>();
  /** @private */ readonly #pressedTimeouts = new Map<HTMLElement, number>();

  /** @private */ readonly #touchStartHandler = (e: TouchEvent) => this.#handleTouchStart(e);
  /** @private */ readonly #touchEndOrCancelHandler = (e: TouchEvent) => this.#handleTouchEndOrCancel(e);

  /**
   * Initializes a new instance of this class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {LongPressControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: LongPressControllerOptions) {
    super(host, options);
    this.#callback = options.callback;
    this.#threshold = options.threshold ?? 500;
  }

  /**
   * Starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  protected override _observe(target: HTMLElement): void {
    target.addEventListener("touchstart", this.#touchStartHandler, { passive: true });
    target.addEventListener("touchend", this.#touchEndOrCancelHandler);
    target.addEventListener("touchcancel", this.#touchEndOrCancelHandler);
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected override _unobserve(target: HTMLElement): void {
    target.removeEventListener("touchstart", this.#touchStartHandler);
    target.removeEventListener("touchend", this.#touchEndOrCancelHandler);
    target.removeEventListener("touchcancel", this.#touchEndOrCancelHandler);
  }

  /** @private */
  #handleTouchStart(e: TouchEvent): void {
    if (e.currentTarget instanceof HTMLElement && this.isObserving(e.currentTarget)) {
      const target = e.currentTarget;
      this.#pressedTimeouts.set(
        target,
        setTimeout(() => {
          this.#pressedTargets.add(target);
          this.#pressedTimeouts.delete(target);
          this.#callback(true, target);
        }, this.#threshold)
      );
    }
  }

  /** @private */
  #handleTouchEndOrCancel(e: TouchEvent): void {
    if (e.currentTarget instanceof HTMLElement && this.isObserving(e.currentTarget)) {
      const target = e.currentTarget;
      if (this.#pressedTargets.has(target)) {
        this.#callback(false, target);
        this.#pressedTargets.delete(target);
      }
      if (this.#pressedTimeouts.has(target)) {
        clearTimeout(this.#pressedTimeouts.get(target));
        this.#pressedTimeouts.delete(target);
      }
    }
  }
}
