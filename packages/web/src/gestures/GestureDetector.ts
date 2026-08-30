import { GestureInputDispatcher } from "./GestureInputDispatcher";
import { GestureInputResolver } from "./GestureInputResolver";
import { GestureInputSource } from "./GestureInputSource";
import { GestureRecognizer } from "./GestureRecognizer";

/**
 * Coordinates gesture recognition by dispatching input to recognizers
 * and resolving their claims on that input.
 *
 * A GestureDetector:
 * - receives input from a {@link GestureInputSource},
 * - dispatches that input to recognizers through an internal {@link GestureInputDispatcher},
 * - and resolves recognizer claims through an internal {@link GestureInputResolver}.
 */
export class GestureDetector {
  /** @private */ readonly #proxySource: GestureInputSource = {};
  /** @private */ readonly #dispatcher = new GestureInputDispatcher(this.#proxySource);
  /** @private */ readonly #resolver = new GestureInputResolver();

  /**
   * Initializes a new instance of this class.
   * @param {GestureInputSource} source The source from which input is received.
   */
  constructor(source: GestureInputSource) {
    source.onInput = (input) => {
      // Forward input through proxy to dispatcher
      this.#proxySource.onInput?.(input);

      // On terminal inputs, resolve any outstanding claims on input
      if (input.type === "pointerup" || input.type === "pointercancel") {
        this.#resolver.resolve(input.id);
      }
    };
  }

  /** The number of registered recognizers. */
  get size(): number {
    return this.#dispatcher.size;
  }

  /**
   * Adds the specified recognizer.
   * @param {GestureRecognizer} recognizer The recognizer to add.
   */
  addRecognizer(recognizer: GestureRecognizer): void {
    this.#dispatcher.addSink(recognizer);
    this.#resolver.addClaimant(recognizer);
    recognizer.reset();
  }

  /**
   * Removes the specified recognizer.
   * @param {GestureRecognizer} recognizer The recognizer to remove.
   * @returns {boolean} `true` if `recognizer` was removed; otherwise, `false`.
   */
  removeRecognizer(recognizer: GestureRecognizer): boolean {
    if (this.#dispatcher.removeSink(recognizer) && this.#resolver.removeClaimant(recognizer)) {
      recognizer.reset();
      return true;
    }
    return false;
  }
}
