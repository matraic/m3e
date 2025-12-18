import { ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";
import { forcedColorsActive } from "../utils";

/** The callback function invoked when the focused state of an element changes. */
export type FocusControllerCallback = (focused: boolean, focusVisible: boolean, target: HTMLElement) => void;

/** Encapsulates options used to configure a `FocusController`. */
export interface FocusControllerOptions extends MonitorControllerOptions {
  /** The callback invoked when the focused state of an element changes. */
  callback: FocusControllerCallback;
}

/** A `ReactiveController` used to monitor the focused state of one or more elements. */
export class FocusController extends MonitorControllerBase {
  /** @private */ #touch = false;
  /** @private */ readonly #callback: FocusControllerCallback;
  /** @private */ readonly #keyDownHandler = (e: Event) => this.#handleKeyDown(e);
  /** @private */ readonly #focusInHandler = (e: Event) => this.#handleFocusIn(e);
  /** @private */ readonly #focusOutHandler = (e: Event) => this.#handleFocusOut(e);
  /** @private */ readonly #touchStartHandler = () => (this.#touch = true);
  /** @private */ readonly #touchEndHandler = () => (this.#touch = false);

  /**
   * Initializes a new instance of this class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {FocusControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: FocusControllerOptions) {
    super(host, options);
    this.#callback = options.callback;
  }

  /**
   * Starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  protected override _observe(target: HTMLElement): void {
    target.addEventListener("keydown", this.#keyDownHandler);
    target.addEventListener("focusin", this.#focusInHandler);
    target.addEventListener("focusout", this.#focusOutHandler);
    target.addEventListener("touchstart", this.#touchStartHandler);
    target.addEventListener("touchend", this.#touchEndHandler);
    target.addEventListener("touchcancel", this.#touchEndHandler);
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected override _unobserve(target: HTMLElement): void {
    target.removeEventListener("keydown", this.#keyDownHandler);
    target.removeEventListener("focusin", this.#focusInHandler);
    target.removeEventListener("focusout", this.#focusOutHandler);
    target.removeEventListener("touchstart", this.#touchStartHandler);
    target.removeEventListener("touchend", this.#touchEndHandler);
    target.removeEventListener("touchcancel", this.#touchEndHandler);
  }

  /** @private */
  #handleKeyDown(e: Event): void {
    const target = e.currentTarget as HTMLElement;
    if (target.matches(":focus-within")) {
      this.#handleFocusIn(e);
    }
  }

  /** @private */
  #handleFocusIn(e: Event): void {
    if (this.#touch) return;
    const target = e.currentTarget as HTMLElement;
    this.#callback(true, target.matches(":focus-visible") || forcedColorsActive(), target);
  }

  /** @private */
  #handleFocusOut(e: Event): void {
    if (this.#touch) return;
    this.#callback(false, false, e.currentTarget as HTMLElement);
  }
}
