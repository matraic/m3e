import { ReactiveControllerHost } from "lit";
import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";

/** The callback function invoked when clicking outside all observed target. */
export type ClickOutsideControllerCallback = (composedPath: EventTarget[]) => void;

/** Encapsulates options used to configure a `ClickOutsideController`. */
export interface ClickOutsideControllerOptions extends MonitorControllerOptions {
  /** The callback invoked when clicking outside an observed target. */
  callback: ClickOutsideControllerCallback;
}

/** A `ReactiveController` used to monitor whether the user clicks outside all observed elements. */
export class ClickOutsideController extends MonitorControllerBase {
  /** @private */ readonly #callback: ClickOutsideControllerCallback;
  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);
  /** @private */ #listening = false;

  /**
   * Initializes a new instance of this class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {FocusControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: ClickOutsideControllerOptions) {
    super(host, options);
    this.#callback = options.callback;
  }

  /** @inheritdoc */
  protected override _observe(): void {
    if (!this.#listening) {
      document.addEventListener("click", this.#documentClickHandler);
      this.#listening = true;
    }
  }

  /** @inheritdoc */
  protected override _unobserve(): void {
    if (!this.hasTargets && this.#listening) {
      document.removeEventListener("click", this.#documentClickHandler);
      this.#listening = false;
    }
  }

  /** @private */
  #handleDocumentClick(e: MouseEvent): void {
    const composedPath = e.composedPath();
    if (!composedPath.some((x) => x instanceof HTMLElement && this.isObserving(x))) {
      this.#callback(composedPath);
    }
  }
}
