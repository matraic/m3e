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
  /** @private */ readonly #callback: FocusControllerCallback;
  /** @private */ readonly #keyDownHandler = (e: Event) => this.#handleKeyDown(e);
  /** @private */ readonly #focusInHandler = (e: Event) => this.#handleFocusIn(e);
  /** @private */ readonly #focusOutHandler = (e: Event) => this.#handleFocusOut(e);

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
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected override _unobserve(target: HTMLElement): void {
    target.removeEventListener("keydown", this.#keyDownHandler);
    target.removeEventListener("focusin", this.#focusInHandler);
    target.removeEventListener("focusout", this.#focusOutHandler);
  }

  /** @private */
  #handleKeyDown(e: Event): void {
    if ((<HTMLElement>e.target).matches(":focus-within")) {
      this.#handleFocusIn(e);
    }
  }

  /** @private */
  #handleFocusIn(e: Event): void {
    const target = e.target as HTMLElement;
    this.#callback(true, target.matches(":focus-visible") || forcedColorsActive(), target);
  }

  /** @private */
  #handleFocusOut(e: Event): void {
    this.#callback(false, false, e.target as HTMLElement);
  }
}
