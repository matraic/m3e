import {
  GestureDetail,
  GestureInput,
  GestureInputDisposition,
  GestureRecognizer,
  GestureRecognizerBase,
} from "../core";

/**
 * Encapsulates detail about a repeated gesture.
 * @template TDetail The type of repeated detail emitted when a gesture is recognized.
 */
export interface RepeatGestureDetail<TDetail extends GestureDetail = GestureDetail> extends GestureDetail {
  /** The details for each occurrence of the gesture. */
  readonly occurrences: readonly TDetail[];
}

/**
 * Recognizes a given number of repeated gestures.
 * @template TDetail The type of repeated detail emitted when a gesture is recognized.
 * @template TRecognizer The type of recognizer used to detect the gesture to repeat.
 */
export class RepeatGestureRecognizer<
  TDetail extends GestureDetail = GestureDetail,
  TRecognizer extends GestureRecognizer<TDetail> = GestureRecognizer<TDetail>,
> extends GestureRecognizerBase<RepeatGestureDetail<TDetail>> {
  /** @private */ readonly #details = new Array<TDetail>();
  /** @private */ readonly #accepted = new Set<number>();
  /** @private */ #timeout?: number;
  /** @private */ #recognizer: TRecognizer | null = null;

  /** The recognizer used to detect the gesture to repeat. */
  get recognizer(): TRecognizer | null {
    return this.#recognizer ?? null;
  }
  set recognizer(value: TRecognizer | null) {
    if (this.#recognizer) {
      this.#recognizer.onGesture = undefined;
      this.#recognizer.onDisposition = undefined;
      this.#recognizer.reset();
    }

    this.#recognizer = value;

    if (this.#recognizer) {
      this.#recognizer.onGesture = (detail) => this.#handleGesture(detail);
      this.#recognizer.onDisposition = (id, disposition) => this.#handleDisposition(id, disposition);
      this.#recognizer.reset();
    }
  }

  /**
   * Maximum time (ms) between gestures before the repeated gesture fails.
   * @default 250
   */
  maxInterval: number = 250;

  /**
   * Number of times a gesture must be repeated.
   * @default 2
   */
  count: number = 2;

  /** @inheritdoc */
  get gestureType(): string {
    return "repeat";
  }

  /** @inheritdoc */
  override onInput(input: GestureInput): void {
    if (this.disabled || !this.#recognizer) return;

    // Forward input to inner recognizer
    this.#recognizer.onInput(input);
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    if (!this.#recognizer) return;

    // Discard if input is not accepted (held)
    if (!this.#accepted.delete(id)) return;

    // Emit gesture when all input has been accepted
    if (this.#accepted.size === 0 && this.#details.length > 0) {
      const last = this.#details[this.#details.length - 1];
      this._emitGesture({
        id: last.id,
        gestureType: this.gestureType,
        timestamp: last.timestamp,
        occurrences: [...this.#details],
      });

      this.reset();
    }
  }

  /** @inheritdoc */
  protected override _onRejectInput(id: number): void {
    if (!this.#recognizer) return;

    // Reset if input was accepted (held)
    if (this.#accepted.has(id)) {
      this.reset();
    }
  }

  /** @private */
  #handleGesture(detail: TDetail): void {
    if (!this.#recognizer) return;
    clearTimeout(this.#timeout);

    this.#details.push(detail);

    if (this.#details.length === this.count) {
      // Disposition all inputs as accepted when detail count is satisfied
      this.#details.forEach((x) => this._acceptInput(x.id));
    } else {
      // Reset for next occurrence
      this.#recognizer.reset();
      // Reset if max interval exceeded
      this.#timeout = setTimeout(() => this.reset(), this.maxInterval);
    }
  }

  /** @private */
  #handleDisposition(id: number, disposition: GestureInputDisposition): void {
    if (!this.#recognizer) return;

    switch (disposition) {
      case "accept":
        // Place holds on accepted input and inform the recognizer it can be accepted (firing onGesture)
        if (!this.#accepted.has(id)) {
          this.#accepted.add(id);
          this._holdInput(id);
        }
        this.#recognizer.onResolution(id, "accept");
        break;

      case "reject":
        // When a recognizer rejects, the repeated gesture is rejected.
        if (!this.#accepted.has(id)) {
          this._rejectInput(id);
        }

        this.reset();
        break;

      case "hold":
        // Forward holds on input
        if (!this.#accepted.has(id)) {
          this._holdInput(id);
        }
        break;

      case "release":
        // Forward releases to holds on input
        if (!this.#accepted.has(id)) {
          this._releaseInput(id);
        }
        break;
    }
  }

  /** @inheritdoc */
  reset(): void {
    // Clear max interval timeout
    clearTimeout(this.#timeout);
    this.#timeout = undefined;

    // Release outstanding holds on input
    for (const accepted of this.#accepted.keys()) {
      this.#accepted.delete(accepted);
      this._releaseInput(accepted);
    }

    // Clear gesture state
    this.#details.length = 0;

    // Reset inner recognizer
    this.#recognizer?.reset();
  }
}
