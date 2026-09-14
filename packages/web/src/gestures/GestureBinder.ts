import { GestureBinding } from "./GestureBinding";
import { GestureRecognizer } from "./GestureRecognizer";

/**
 * Binds elements to recognizers responsible for detecting gestures.
 * @internal
 */
export class GestureBinder {
  /** @private */ static readonly #bindings = new WeakMap<HTMLElement, GestureBinding>();

  /**
   * Binds one or more gesture recognizers to an element.
   * @param {HTMLElement} element The element to which to bind a recognizer.
   * @param {readonly GestureRecognizer[]} recognizers The recognizers to bind to the specified element.
   */
  static bind(element: HTMLElement, ...recognizers: readonly GestureRecognizer[]): void {
    if (!recognizers) return;
    let binding = this.#bindings.get(element);
    if (!binding) {
      binding = new GestureBinding(element);
      this.#bindings.set(element, binding);
    }
    binding.addRecognizer(...recognizers);
  }

  /**
   * Removes one or more gesture recognizers from an element.
   * @param {HTMLElement} element The element from which to remove a recognizer.
   * @param {readonly GestureRecognizer[]} recognizers The recognizers to remove from the specified element.
   */
  static unbind(element: HTMLElement, ...recognizers: readonly GestureRecognizer[]): void {
    const binding = this.#bindings.get(element);
    if (!binding) return;

    binding.removeRecognizer(...recognizers);

    if (binding.empty) {
      binding.destroy();
      this.#bindings.delete(element);
    }
  }
}
