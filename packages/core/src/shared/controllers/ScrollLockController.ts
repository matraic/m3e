import { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * A `ReactiveController` that provides safe, predictable scroll locking for modal UI
 * surfaces (dialogs, bottom sheets, overlays).
 */
export class ScrollLockController implements ReactiveController {
  /** @private */ #locked = false;
  /** @private */ #scrollTop = 0;
  /** @private */ #scrollLeft = 0;
  /** @private */ #previousOverflow = "";
  /** @private */ #previousScrollbarGutter = "";

  constructor(host: ReactiveControllerHost) {
    host.addController(this);
  }

  /** Returns true if the document is vertically scrollable. */
  #isVerticallyScrollable() {
    return document.documentElement.scrollHeight > document.documentElement.clientHeight;
  }

  /** Locks document scrolling only if scroll actually exists. */
  lock() {
    if (this.#locked) return;
    this.#locked = true;

    // Save scroll position
    this.#scrollTop = window.scrollY;
    this.#scrollLeft = window.scrollX;

    // Save existing inline styles
    this.#previousOverflow = document.documentElement.style.overflow;
    this.#previousScrollbarGutter = document.documentElement.style.scrollbarGutter;

    // Only apply gutter if vertical scroll exists
    if (this.#isVerticallyScrollable()) {
      document.documentElement.style.scrollbarGutter = "stable";
    }

    // Lock scroll
    document.documentElement.style.overflow = "hidden";

    // Freeze scroll position
    window.scrollTo(this.#scrollLeft, this.#scrollTop);
  }

  /** Unlocks document scrolling and restores the previous state. */
  unlock() {
    if (!this.#locked) return;
    this.#locked = false;

    // Restore previous inline styles
    document.documentElement.style.overflow = this.#previousOverflow;
    document.documentElement.style.scrollbarGutter = this.#previousScrollbarGutter;

    // Restore scroll position
    window.scrollTo(this.#scrollLeft, this.#scrollTop);
  }

  /** @inheritdoc */
  hostDisconnected() {
    this.unlock();
  }
}
