import {
  GestureDetail,
  GestureInput,
  GestureInputDisposition,
  GestureRecognizer,
  GestureRecognizerBase,
} from "@m3e/web/gestures";

/** Encapsulates detail about a sequence of gestures. */
export interface SequenceGestureDetail extends GestureDetail {
  /** The details for each gesture in the sequence. */
  readonly sequence: readonly GestureDetail[];
}

/** Recognizes a sequence of gestures. */
export class SequenceGestureRecognizer extends GestureRecognizerBase<SequenceGestureDetail> {
  /** @private */ readonly #sequence = new Array<GestureRecognizer>();
  /** @private */ readonly #details = new Array<GestureDetail>();
  /** @private */ readonly #accepted = new Set<number>();
  /** @private */ #timeout?: number;

  get #current(): GestureRecognizer | undefined {
    return this.#sequence[this.#details.length];
  }

  /**
   * Maximum time (ms) between gestures before the sequence fails.
   * @default 250
   */
  maxInterval: number = 250;

  /** @inheritdoc */
  override readonly gestureType: string = "sequence";

  /** Sequence of gestures to recognize. */
  get sequence(): readonly GestureRecognizer[] {
    return this.#sequence;
  }
  set sequence(value: readonly GestureRecognizer[]) {
    for (const recognizer of this.#sequence) {
      recognizer.onGesture = undefined;
      recognizer.onDisposition = undefined;
      recognizer.reset();
    }

    this.#sequence.length = 0;
    this.#sequence.push(...value);

    for (const recognizer of this.#sequence) {
      recognizer.onGesture = (detail) => this.#handleGesture(detail);
      recognizer.onDisposition = (id, disposition) => this.#handleDisposition(recognizer, id, disposition);
      recognizer.reset();
    }

    this.reset();
  }

  /** @inheritdoc */
  override onInput(input: GestureInput): void {
    if (this.disabled) return;

    // Forward input to current recognizer in sequence
    this.#current?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    // Discard if input is not accepted (held)
    if (!this.#accepted.delete(id)) return;

    // Emit gesture when all input has been accepted
    if (this.#accepted.size === 0 && this.#details.length > 0) {
      const last = this.#details[this.#details.length - 1];
      this._emitGesture({
        id: last.id,
        gestureType: this.gestureType,
        timestamp: last.timestamp,
        sequence: [...this.#details],
      });

      this.reset();
    }
  }

  /** @inheritdoc */
  protected override _onRejectInput(id: number): void {
    // Reset if input was accepted (held)
    if (this.#accepted.has(id)) {
      this.reset();
    }
  }

  /** @private */
  #handleGesture(detail: GestureDetail): void {
    clearTimeout(this.#timeout);

    this.#details.push(detail);

    if (this.#details.length === this.#sequence.length) {
      // Disposition all inputs as accepted when detail count matches sequence
      this.#details.forEach((x) => this._acceptInput(x.id));
    } else {
      // Reset if max interval exceeded
      this.#timeout = setTimeout(() => this.reset(), this.maxInterval);
    }
  }

  /** @private */
  #handleDisposition(recognizer: GestureRecognizer, id: number, disposition: GestureInputDisposition): void {
    switch (disposition) {
      case "accept":
        // Place holds on accepted input and inform the recognizer it can be accepted (firing onGesture)
        if (!this.#accepted.has(id)) {
          this.#accepted.add(id);
          this._holdInput(id);
        }
        recognizer.onResolution(id, "accept");
        break;

      case "reject":
        // When a recognizer rejects, the sequence is rejected.
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

      case "defer":
        // Forward deferrals on input
        if (!this.#accepted.has(id)) {
          this._deferInput(id);
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

    // Reset recognizer in the sequence
    this.#sequence.forEach((x) => x.reset());
  }
}
