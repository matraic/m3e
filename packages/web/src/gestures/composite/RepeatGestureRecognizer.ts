import {
  GestureDetail,
  GestureInput,
  GestureInputDisposition,
  GestureRecognizer,
  GestureRecognizerBase,
  GestureRecognizerOptions,
  registerGestureRecognizer,
} from "@m3e/web/gestures";

/**
 * Encapsulates detail about a repeated gesture.
 * @template TDetail The type of repeated detail emitted when a gesture is recognized.
 */
export interface RepeatGestureDetail<TDetail extends GestureDetail = GestureDetail> extends GestureDetail {
  /** The details for each occurrence of the gesture. */
  readonly occurrences: readonly TDetail[];
}

/**
 * Encapsulates options used to recognize repeated gestures.
 * @template TDetail The type of repeated detail emitted when a gesture is recognized.
 */
export interface RepeatGestureOptions extends GestureRecognizerOptions {
  /** The recognizer used to detect the gesture to repeat. */
  readonly recognizer?: GestureRecognizer;

  /**
   * Maximum time (ms) between gestures before the repeated gesture fails.
   * @default 250
   */
  readonly maxInterval: number;

  /**
   * Number of times a gesture must be repeated.
   * @default 2
   */
  readonly count: number;
}

/**
 * Recognizes a given number of repeated gestures.
 * @template TDetail The type of repeated detail emitted when a gesture is recognized.
 */
class RepeatGestureRecognizer<TDetail extends GestureDetail = GestureDetail> extends GestureRecognizerBase<
  RepeatGestureOptions,
  RepeatGestureDetail
> {
  /** @private */ readonly #details = new Array<TDetail>();
  /** @private */ readonly #accepted = new Set<number>();
  /** @private */ #timeout?: number;

  constructor(options?: Partial<RepeatGestureOptions>) {
    super(options);
    this.#bindRecognizer();
  }

  /** @inheritdoc */
  get gestureType(): string {
    return "repeat";
  }

  /** @inheritdoc */
  protected override _defaultOptions(): Partial<RepeatGestureOptions> {
    return {
      ...super._defaultOptions,
      maxInterval: 250,
      count: 2,
    };
  }

  /** @inheritdoc */
  override updateOptions(options: Partial<RepeatGestureOptions>): void {
    this.#unbindRecognizer();
    super.updateOptions(options);
    this.#bindRecognizer();
  }

  /** @private */
  #unbindRecognizer(): void {
    if (!this.options.recognizer) return;
    this.options.recognizer.onGesture = undefined;
    this.options.recognizer.onDisposition = undefined;
    this.options.recognizer.reset();
  }

  /** @private */
  #bindRecognizer(): void {
    if (!this.options.recognizer) return;
    this.options.recognizer.onGesture = (detail) => this.#handleGesture(<TDetail>detail);
    this.options.recognizer.onDisposition = (id, disposition) => this.#handleDisposition(id, disposition);
    this.options.recognizer.reset();
  }

  /** @inheritdoc */
  override onInput(input: GestureInput): void {
    if (this.options.disabled || !this.options.recognizer) return;

    // Forward input to inner recognizer
    this.options.recognizer.onInput(input);
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    if (!this.options.recognizer) return;

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
    if (!this.options.recognizer) return;

    // Reset if input was accepted (held)
    if (this.#accepted.has(id)) {
      this.reset();
    }
  }

  /** @private */
  #handleGesture(detail: TDetail): void {
    if (!this.options.recognizer) return;
    clearTimeout(this.#timeout);

    this.#details.push(detail);

    if (this.#details.length === this.options.count) {
      // Disposition all inputs as accepted when detail count is satisfied
      this.#details.forEach((x) => this._acceptInput(x.id));
    } else {
      // Reset for next occurrence
      this.options.recognizer.reset();
      // Reset if max interval exceeded
      this.#timeout = setTimeout(() => this.reset(), this.options.maxInterval);
    }
  }

  /** @private */
  #handleDisposition(id: number, disposition: GestureInputDisposition): void {
    if (!this.options.recognizer) return;

    switch (disposition) {
      case "accept":
        // Place holds on accepted input and inform the recognizer it can be accepted (firing onGesture)
        if (!this.#accepted.has(id)) {
          this.#accepted.add(id);
          this._holdInput(id);
        }
        this.options.recognizer.onResolution(id, "accept");
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

    // Reset inner recognizer
    this.options.recognizer?.reset();
  }
}

// Register the recognizer
registerGestureRecognizer<RepeatGestureOptions, RepeatGestureDetail>(
  "repeat",
  (options) => new RepeatGestureRecognizer(options),
);
