import { GestureInputDispatcher } from "./GestureInputDispatcher";
import { GestureInputResolver } from "./GestureInputResolver";
import { GestureInputSource } from "./GestureInputSource";
import { GestureRecognizer } from "./GestureRecognizer";
import { PointerInput } from "./PointerInput";

/** Coordinates gesture recognition by dispatching input to recognizers and resolving their claims on that input. */
export class GesturePipeline {
  /** @private */ readonly #recognizers = new Set<GestureRecognizer>();
  /** @private */ readonly #proxySource: GestureInputSource = {};
  /** @private */ readonly #dispatcher = new GestureInputDispatcher(this.#proxySource);
  /** @private */ readonly #resolver = new GestureInputResolver();
  /** @private */ readonly #releasedCaptures = new Set<number>();

  /**
   * Initializes a new instance of this class.
   * @param {GestureInputSource} source The source from which input is received.
   */
  constructor(source: GestureInputSource) {
    source.onInput = (input) => {
      if (input.type === "lostpointercapture") {
        // Ignore intentionally released pointer captures
        if (this.#releasedCaptures.has(input.id)) {
          this.#releasedCaptures.delete(input.id);
          return;
        }
        // Otherwise, convert to pointer cancel for use by recognizers
        input = { ...input, type: "pointercancel" };
      }

      // Forward input through proxy to dispatcher
      this.#proxySource.onInput?.(input);

      // Test each recognizer to determine whether at least one requires pointer capture.
      if (["pointerdown", "pointermove"].includes(input.type)) {
        let shouldCapturePointer = false;
        const pointerInput = <PointerInput>input;
        for (const recognizer of this.#recognizers.values()) {
          if (recognizer.shouldCapturePointer(pointerInput)) {
            shouldCapturePointer = true;
            break;
          }
        }

        if (shouldCapturePointer && !input.currentTarget.hasPointerCapture(input.id)) {
          input.currentTarget.setPointerCapture(input.id);
        }
      }
      // On terminal inputs, resolve any outstanding claims on input
      else if (["pointerup", "pointercancel"].includes(input.type)) {
        this.#resolver.resolve(input.id);

        // Release pointer capture
        if (input.currentTarget.hasPointerCapture(input.id)) {
          input.currentTarget.releasePointerCapture(input.id);
          this.#releasedCaptures.add(input.id);
        }
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
    if (this.#recognizers.has(recognizer)) return;
    this.#recognizers.add(recognizer);
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
    if (!this.#recognizers.delete(recognizer)) return false;
    this.#dispatcher.removeSink(recognizer);
    this.#resolver.removeClaimant(recognizer);
    return true;
  }
}
