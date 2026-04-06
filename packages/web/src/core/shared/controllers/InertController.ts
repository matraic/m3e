import { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * A `ReactiveController` that provides safe, predictable inerting of background
 * content for modal UI surfaces (dialogs, date pickers, fullscreen search views).
 */
export class InertController implements ReactiveController {
  /** @private */ readonly #host: HTMLElement;
  /** @private */ readonly #inerts = new Array<HTMLElement>();

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.#host = host;
    host.addController(this);
  }

  /**
   * Locks background content by applying inertness to all non‑modal elements,
   * isolating the active surface from pointer and keyboard interaction.
   */
  lock() {
    this.unlock();

    for (
      let current: Node = this.#host as Node;
      current.parentNode && current.parentNode !== document.documentElement;
      current = current.parentNode
    ) {
      for (const sibling of current.parentNode.children) {
        if (sibling instanceof HTMLElement && sibling !== current && !sibling.inert) {
          sibling.inert = true;
          this.#inerts.push(sibling);
        }
      }
    }
  }

  /** Restores background interactivity by removing inertness previously applied during `lock()`. */
  unlock() {
    this.#inerts.forEach((x) => (x.inert = false));
    this.#inerts.length = 0;
  }

  /** @inheritdoc */
  hostDisconnected() {
    this.unlock();
  }
}
