import { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * A `ReactiveController` that provides safe, predictable scroll locking for modal UI
 * surfaces (dialogs, bottom sheets, overlays). Scrolling remains locked until
 * every active controller releases its lock.
 */
export class ScrollLockController implements ReactiveController {
  /** @private */ static #lockCount = 0;
  /** @private */ static #scrollTop = 0;
  /** @private */ static #scrollLeft = 0;
  /** @private */ static #previousOverflow = "";
  /** @private */ static #previousScrollbarGutter = "";
  /** @private */ #locked = false;

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
    if (ScrollLockController.#lockCount++ > 0) return;

    // Save scroll position
    ScrollLockController.#scrollTop = window.scrollY;
    ScrollLockController.#scrollLeft = window.scrollX;

    // Save existing inline styles
    ScrollLockController.#previousOverflow = document.documentElement.style.overflow;
    ScrollLockController.#previousScrollbarGutter = document.documentElement.style.scrollbarGutter;

    // Only apply gutter if vertical scroll exists
    if (this.#isVerticallyScrollable()) {
      document.documentElement.style.scrollbarGutter = "stable";
    }

    // Lock scroll
    document.documentElement.style.overflow = "hidden";

    // Freeze scroll position
    window.scrollTo(ScrollLockController.#scrollLeft, ScrollLockController.#scrollTop);
  }

  /** Unlocks document scrolling and restores the previous state. */
  unlock() {
    if (!this.#locked) return;
    this.#locked = false;
    if (--ScrollLockController.#lockCount > 0) return;

    // Restore previous inline styles
    document.documentElement.style.overflow = ScrollLockController.#previousOverflow;
    document.documentElement.style.scrollbarGutter = ScrollLockController.#previousScrollbarGutter;

    // Restore scroll position
    window.scrollTo(ScrollLockController.#scrollLeft, ScrollLockController.#scrollTop);
  }

  /** @inheritdoc */
  hostDisconnected() {
    this.unlock();
  }
}
