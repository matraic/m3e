import {
  GestureDetail,
  GestureDisposition,
  GestureInput,
  GestureListener,
  GesturePhase,
  GestureRecognizer,
  GestureRecognizerBase,
  PointerInput,
  WheelInput,
} from "@m3e/web/gestures";

import { SequenceGestureDetail } from "./SequenceGestureDetail";
import { DefaultSequenceGestureOptions, SequenceGestureOptions } from "./SequenceGestureOptions";

/** A {@link GestureRecognizer} used to detect and interpret a sequence of gestures from incoming input streams. */
export class SequenceGestureRecognizer extends GestureRecognizerBase<SequenceGestureOptions, SequenceGestureDetail> {
  /** @private */ readonly #listener: GestureListener = (detail) => this.#handleGesture(detail);
  /** @private */ readonly #details = new Array<GestureDetail>();
  /** @private */ readonly #accepted = new Set<number>();
  /** @private */ #recognizers = new Array<GestureRecognizer>();
  /** @private */ #timeout?: number;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<SequenceGestureOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<SequenceGestureDetail>} listener The function invoked when semantic detail is emitted.
   * @param {readonly GestureRecognizer[]} recognizers The recognizers used to detect a sequence of gesture gestures.
   */
  constructor(
    options?: Partial<SequenceGestureOptions>,
    listener?: GestureListener<SequenceGestureDetail>,
    ...recognizers: readonly GestureRecognizer[]
  ) {
    super(options, listener);
    this.recognizers = recognizers;
  }

  /** The current recognizer in the sequence. */
  get recognizer(): GestureRecognizer | undefined {
    return this.#recognizers[this.#details.length];
  }

  /** The recognizers used to detect a sequence of gestures. */
  get recognizers(): readonly GestureRecognizer[] {
    return this.#recognizers;
  }

  set recognizers(value: readonly GestureRecognizer[]) {
    this.#recognizers.forEach((x) => {
      x.removeListener(this.#listener);
      x.onDisposition = undefined;
      x.reset();
    });

    this.#recognizers.length = 0;
    this.#recognizers.push(...value);

    this.#recognizers.forEach((x) => {
      x.addListener(this.#listener);
      x.onDisposition = this.#handleDisposition.bind(this, x);
      x.reset();
    });

    this.reset();
  }

  /** @inheritdoc */
  override get defaultOptions(): SequenceGestureOptions {
    return { ...DefaultSequenceGestureOptions };
  }

  /** @inheritdoc */
  override shouldCapturePointer(input: PointerInput): boolean {
    return this.recognizer?.shouldCapturePointer(input) ?? super.shouldCapturePointer(input);
  }

  /** @inheritdoc */
  override canReceiveInput(input: GestureInput): boolean {
    return this.recognizer !== undefined && this.recognizer.canReceiveInput(input) && super.canReceiveInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerOver(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerEnter(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerDown(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerMove(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerUp(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerCancel(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerOut(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerLeave(input: PointerInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onWheel(input: WheelInput): void {
    this.recognizer?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onAccept(inputId: number): void {
    // Discard if input is not accepted (held)
    if (!this.#accepted.delete(inputId)) return;

    // End gesture when all input has been accepted
    if (this.#accepted.size === 0 && this.#details.length === this.recognizers.length) {
      this._emit(this.#createDetail("end"));
      this.reset();
    }
  }

  /** @inheritdoc */
  protected override _onReject(inputId: number): void {
    // Cancel and reset if accepted input was rejected
    if (this.#accepted.has(inputId)) {
      this._emit(this.#createDetail("cancel"));
      this.reset();
    }
  }

  /** @inheritdoc */
  override reset(): void {
    clearTimeout(this.#timeout);
    this.#timeout = undefined;

    this.#recognizers.forEach((x) => x.reset());
    this.#accepted.forEach((x) => this._release(x));
    this.#accepted.clear();
    this.#details.length = 0;
  }

  /** @private */
  #handleDisposition(recognizer: GestureRecognizer, inputId: number, disposition: GestureDisposition): void {
    switch (disposition) {
      case "accept":
        // Place holds on accepted input and inform the recognizer it can be accepted.
        if (!this.#accepted.has(inputId)) {
          this.#accepted.add(inputId);
          this._hold(inputId);
        }
        recognizer.onResolution(inputId, "accept");
        break;

      case "reject":
        // When a recognizer rejects, the sequence gesture is rejected.
        if (!this.#accepted.has(inputId)) {
          this._reject(inputId);
        }

        this.reset();
        break;

      case "hold":
        // Forward holds on input.
        if (!this.#accepted.has(inputId)) {
          this._hold(inputId);
        }
        break;

      case "release":
        // Forward releases to holds on input.
        if (!this.#accepted.has(inputId)) {
          this._release(inputId);
        }
        break;

      case "defer":
        // Forward deferrals on input.
        if (!this.#accepted.has(inputId)) {
          this._defer(inputId);
        }
        break;
    }
  }

  /** @private */
  #handleGesture(detail: GestureDetail): void {
    // Ignore non-terminal detail
    if (detail.phase === "start" || detail.phase === "update") return;

    if (detail.phase === "cancel") {
      if (this.#details.length > 0) {
        // The gesture has started, cancel it
        this._emit(this.#createDetail("cancel"));
      }

      this.reset();
      return;
    }

    this.#details.push(detail);

    if (this.#details.length === this.recognizers.length) {
      // Disposition all inputs as accepted when detail count is satisfied
      this.#details.forEach((x) => this._accept(x.inputId));
    } else {
      this._emit(this.#createDetail(this.#details.length === 1 ? "start" : "update"));

      if (this.options.maxInterval > 0) {
        clearTimeout(this.#timeout);
        // Cancel and reset (releasing outstanding holds) if max interval exceeded
        this.#timeout = setTimeout(() => {
          this._emit(this.#createDetail("cancel"));
          this.reset();
        }, this.options.maxInterval);
      }
    }
  }

  /** @inheritdoc */
  #createDetail(phase: GesturePhase): SequenceGestureDetail {
    const last = this.#details[this.#details.length - 1];
    return {
      inputId: this.#details.flatMap((d) => (Array.isArray(d.inputId) ? d.inputId : [d.inputId])),
      gestureName: "sequence",
      phase,
      timestamp: last.timestamp,
      details: [...this.#details],
    };
  }
}
