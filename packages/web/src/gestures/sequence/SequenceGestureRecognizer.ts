import {
  GestureCallback,
  GestureDetail,
  GestureInput,
  GestureInputDisposition,
  GestureInputDispositionCallback,
  gestureRecognizer,
  GestureRecognizer,
  GestureRecognizerBase,
  GestureRecognizerOptions,
  PointerInput,
} from "@m3e/web/gestures";

/**
 * Represents the lifecycle phases of a sequence gesture.
 * - `"start"` — The first gesture in the sequence has been detected.
 * - `"step"` — A subsequent gesture in the sequence has been detected.
 * - `"end"` — All gestures in the sequence have been detected.
 * - `"cancel"` — The gesture was interrupted or rejected and did not complete normally.
 */
export type SequenceGesturePhase = "start" | "step" | "end" | "cancel";

/** Encapsulates detail about a sequence of gestures. */
export interface SequenceGestureDetail extends GestureDetail {
  /** Current phase of the sequence gesture. */
  readonly phase: SequenceGesturePhase;

  /** The details for each gesture in the sequence. */
  readonly sequence: readonly GestureDetail[];
}

/** Encapsulates options used to recognize a sequence of gestures. */
export interface SequenceGestureOptions extends GestureRecognizerOptions {
  /**
   * Maximum time (ms) between gestures before the sequence fails.
   * @default 250
   */
  readonly maxInterval: number;

  /** The sequence of gestures to recognize. */
  readonly sequence: readonly GestureRecognizer[];
}

/** Recognizes a sequence of gestures. */
@gestureRecognizer("sequence")
export class SequenceGestureRecognizer extends GestureRecognizerBase<SequenceGestureOptions, SequenceGestureDetail> {
  /** @private */ readonly #details = new Array<GestureDetail>();
  /** @private */ readonly #accepted = new Set<number>();
  /** @private */ readonly #gestureCallbacks = new Map<GestureRecognizer, GestureCallback>();
  /** @private */ readonly #dispositionCallbacks = new Map<GestureRecognizer, GestureInputDispositionCallback>();
  /** @private */ #timeout?: number;

  constructor(options?: Partial<SequenceGestureOptions>) {
    super(options);
    this.#bindSequence();
  }

  /** @inheritdoc */
  protected override get _defaultOptions(): Partial<SequenceGestureOptions> {
    return {
      ...super._defaultOptions,
      maxInterval: 250,
      sequence: [],
    };
  }

  /** @inheritdoc */
  override updateOptions(options: Partial<SequenceGestureOptions>): void {
    this.#unbindSequence();
    super.updateOptions(options);
    this.#bindSequence();
  }

  /** @inheritdoc */
  override shouldCapturePointer(input: PointerInput): boolean {
    return this.#current ? this.#current.shouldCapturePointer(input) : super.shouldCapturePointer(input);
  }

  /** @private */
  #bindSequence(): void {
    for (const recognizer of this.options.sequence) {
      if (recognizer.onGesture) {
        this.#gestureCallbacks.set(recognizer, recognizer.onGesture);
      }

      if (recognizer.onDisposition) {
        this.#dispositionCallbacks.set(recognizer, recognizer.onDisposition);
      }

      recognizer.onGesture = (detail) => {
        this.#handleGesture(recognizer, detail);
        this.#gestureCallbacks.get(recognizer)?.(detail);
      };

      recognizer.onDisposition = (id, disposition) => {
        this.#handleDisposition(recognizer, id, disposition);
        this.#dispositionCallbacks.get(recognizer)?.(id, disposition);
      };
      recognizer.reset();
    }
  }

  /** @private */
  #unbindSequence(): void {
    for (const recognizer of this.options.sequence) {
      recognizer.onGesture = this.#gestureCallbacks.get(recognizer);
      recognizer.onDisposition = this.#dispositionCallbacks.get(recognizer);

      this.#gestureCallbacks.delete(recognizer);
      this.#dispositionCallbacks.delete(recognizer);

      recognizer.reset();
    }
  }

  get #current(): GestureRecognizer | undefined {
    return this.options.sequence[this.#details.length];
  }

  /** @inheritdoc */
  override onInput(input: GestureInput): void {
    if (this.options.disabled) return;

    // Forward input to current recognizer in sequence
    this.#current?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    // Discard if input is not accepted (held)
    if (!this.#accepted.delete(id)) return;

    // Emit end when all input has been accepted
    if (this.#accepted.size === 0 && this.#details.length > 0) {
      this._emitGesture(this.#createDetail("end"));
      this.reset();
    }
  }

  /** @inheritdoc */
  protected override _onRejectInput(id: number): void {
    // Reset if input was accepted (held)
    if (this.#accepted.has(id)) {
      // If details exist, emit cancel phase
      if (this.#details.length > 0) {
        this._emitGesture(this.#createDetail("cancel"));
      }
      this.reset();
    }
  }

  /** @private */
  #handleGesture(recognizer: GestureRecognizer, detail: GestureDetail): void {
    // For continuous, phase is emitted in detail; ignore detail until ended
    if (recognizer.continuous && "phase" in detail && detail.phase !== "end") {
      return;
    }

    clearTimeout(this.#timeout);

    this.#details.push(detail);

    if (this.#details.length === this.options.sequence.length) {
      // Disposition all inputs as accepted when detail count matches sequence
      // This will emit end or cancel phases
      this.#details.forEach((x) => this._acceptInput(x.id));
    } else {
      // Emit start or step based on detail length
      this._emitGesture(this.#createDetail(this.#details.length === 1 ? "start" : "step"));

      if (this.options.maxInterval > 0) {
        // Reset if max interval exceeded
        this.#timeout = setTimeout(() => {
          // If details exist, emit cancel phase
          if (this.#details.length > 0) {
            this._emitGesture(this.#createDetail("cancel"));
          }
          this.reset();
        }, this.options.maxInterval);
      }
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
    this.options.sequence.forEach((x) => x.reset());
  }

  /** @private */
  #createDetail(phase: SequenceGesturePhase): SequenceGestureDetail {
    const last = this.#details[this.#details.length - 1];
    return {
      id: last.id,
      phase: phase,
      gestureType: this.gestureType,
      timestamp: last.timestamp,
      sequence: [...this.#details],
    };
  }
}
