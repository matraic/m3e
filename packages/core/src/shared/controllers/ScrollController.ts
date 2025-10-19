import { ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";
import { debounce } from "../decorators";

/** The callback function invoked when a scrollable ancestor is scrolled. */
export type ScrollControllerCallback = (target: Element) => void;

/** Encapsulates options used to configure a `ScrollController`. */
export interface ScrollControllerOptions extends MonitorControllerOptions {
  /** The callback invoked a scrollable ancestor is scrolled. */
  callback: ScrollControllerCallback;

  /** Whether to debounce scroll events. */
  debounce?: boolean;
}

/** A `ReactiveController` used to monitor when a scroll event is emitted from a scrollable ancestor. */
export class ScrollController extends MonitorControllerBase {
  /** @private */ readonly #debounce: boolean;
  /** @private */ readonly #callback: ScrollControllerCallback;
  /** @private */ readonly #scrollHandler = (e: Event) => this.#handleScroll(e);
  /** @private */ readonly #scrollContainers = new Map<HTMLElement, Element[]>();

  /**
   * Initializes a new instance of the `ScrollController` class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {ScrollControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: ScrollControllerOptions) {
    super(host, options);
    this.#debounce = options.debounce === true;
    this.#callback = options.callback;
  }

  /**
   * Returns the scrollable ancestors for a target element currently being observed by this controller.
   * @param target The element whose scroll containers are currently being observed.
   * @returns {Element[] | undefined} The scrollable ancestors, or `undefined` if `target` is not being observed.
   */
  getScrollContainers(target: HTMLElement): Element[] | undefined {
    return this.#scrollContainers.get(target);
  }

  /** @inheritdoc */
  protected override _observe(target: HTMLElement): void {
    const scrollableAncestors = this.#getScrollContainers(target);
    if (scrollableAncestors.length > 0) {
      this.#scrollContainers.set(target, scrollableAncestors);
      for (const ancestor of scrollableAncestors) {
        (ancestor === document.documentElement ? document : ancestor).addEventListener("scroll", this.#scrollHandler, {
          passive: true,
        });
      }
    }
  }

  /** @inheritdoc */
  protected override _unobserve(target: HTMLElement): void {
    if (this.#scrollContainers.has(target)) {
      for (const ancestor of this.#scrollContainers.get(target)!) {
        (ancestor === document.documentElement ? document : ancestor).removeEventListener(
          "scroll",
          this.#scrollHandler
        );
      }
      this.#scrollContainers.delete(target);
    }
  }

  /** @private */
  #getScrollContainers(element: Element): Element[] {
    const ancestors = new Array<Element>();
    let ancestor: Element | null = element;
    while (ancestor) {
      const style = getComputedStyle(ancestor);
      if (/(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX)) {
        ancestors.push(ancestor);
      }
      ancestor = ancestor.parentElement;
    }
    return ancestors;
  }

  /** @private */
  #handleScroll(e: Event): void {
    const target = e.target === document ? document.documentElement : e.target;
    if (this.#debounce) {
      this._debounceCallback(target as Element);
    } else {
      this.#callback(target as Element);
    }
  }

  /** @private */
  @debounce(40)
  private _debounceCallback(target: Element): void {
    this.#callback(target);
  }
}
