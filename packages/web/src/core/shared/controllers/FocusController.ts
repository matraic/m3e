import { ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";
import { forcedColorsActive } from "../utils";

/** The callback function invoked when the focused state of an element changes. */
export type FocusControllerCallback = (focused: boolean, focusVisible: boolean, target: HTMLElement) => void;

/** The callback function invoked to test whether an event should trigger a change to focused state. */
export type FocusControllerFilterCallback = (e: Event) => boolean;

/** Encapsulates options used to configure a `FocusController`. */
export interface FocusControllerOptions extends MonitorControllerOptions {
  /** The callback invoked when the focused state of an element changes. */
  callback: FocusControllerCallback;

  /** The callback function invoked to test whether an event should trigger a change to focused state. */
  filter?: FocusControllerFilterCallback;
}

/** A `ReactiveController` used to monitor the focused state of one or more elements. */
export class FocusController extends MonitorControllerBase {
  /** @private */ #touch = false;
  /** @private */ readonly #callback: FocusControllerCallback;
  /** @private */ readonly #filter?: FocusControllerFilterCallback;
  /** @private */ readonly #keyDownHandler = (e: Event) => this.#handleKeyDown(e);
  /** @private */ readonly #focusInHandler = (e: Event) => this.#handleFocusIn(e);
  /** @private */ readonly #focusOutHandler = (e: Event) => this.#handleFocusOut(e);
  /** @private */ readonly #touchStartHandler = () => (this.#touch = true);
  /** @private */ readonly #touchEndHandler = () => (this.#touch = false);

  /** @private */ #hadKeydown = false;
  /** @private */ readonly #windowKeyDownHandler = () => (this.#hadKeydown = true);
  /** @private */ readonly #windowPointerDownHandler = () => (this.#hadKeydown = false);

  /**
   * Initializes a new instance of this class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {FocusControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: FocusControllerOptions) {
    super(host, options);
    this.#callback = options.callback;
    this.#filter = options.filter;
  }

  /** @inheritdoc */
  override hostConnected(): void {
    super.hostConnected();

    window?.addEventListener("keydown", this.#windowKeyDownHandler, { capture: true, passive: true });
    window?.addEventListener("pointerdown", this.#windowPointerDownHandler, { capture: true });
  }

  /** @inheritdoc */
  override hostDisconnected(): void {
    super.hostDisconnected();

    window?.removeEventListener("keydown", this.#windowKeyDownHandler, { capture: true });
    window?.removeEventListener("pointerdown", this.#windowPointerDownHandler, { capture: true });
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
    if (this.#filter?.(e)) return;
    const target = e.currentTarget as HTMLElement;
    if (target.matches(":focus-within")) {
      this.#handleFocusIn(e);
    }
  }

  /** @private */
  #handleFocusIn(e: Event): void {
    if (this.#filter?.(e)) return;
    if (this.#touch) return;
    const target = e.currentTarget as HTMLElement;
    this.#callback(true, target.matches(":focus-visible") || this.#hadKeydown || forcedColorsActive(), target);
  }

  /** @private */
  #handleFocusOut(e: Event): void {
    if (this.#filter?.(e)) return;
    if (this.#touch) return;
    this.#callback(false, false, e.currentTarget as HTMLElement);
  }
}
