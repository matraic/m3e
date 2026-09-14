import {
  DelegatingGestureRecognizerBase,
  GestureDetail,
  GestureDisposition,
  GestureListener,
  GestureOptions,
  GesturePhase,
  GestureRecognizer,
} from "@m3e/web/gestures";

import { RepeatGestureDetail } from "./RepeatGestureDetail";
import { DefaultRepeatGestureOptions, RepeatGestureOptions } from "./RepeatGestureOptions";

/**
 * A {@link GestureRecognizer} used to detect and interpret repeated gestures from incoming input streams.
 * @template TDetail - The type of semantic detail produced by each repeated occurrence.
 */
export class RepeatGestureRecognizer<
  TDetail extends GestureDetail = GestureDetail,
> extends DelegatingGestureRecognizerBase<
  RepeatGestureOptions,
  RepeatGestureDetail<TDetail>,
  GestureOptions,
  TDetail,
  GestureRecognizer<GestureOptions, TDetail>
> {
  /** @private */ readonly #details = new Array<TDetail>();
  /** @private */ readonly #accepted = new Set<number>();
  /** @private */ #timeout?: number;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<RepeatGestureOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<RepeatGestureDetail<TDetail>>} listener The function invoked when semantic detail is emitted.
   * @param {GestureRecognizer<GestureOptions, TDetail>} recognizer The recognizer used to detect the gesture to repeat.
   */
  constructor(
    options?: Partial<RepeatGestureOptions>,
    listener?: GestureListener<RepeatGestureDetail<TDetail>>,
    recognizer?: GestureRecognizer<GestureOptions, TDetail>,
  ) {
    super(options, listener, recognizer);
  }

  /** @inheritdoc */
  override get defaultOptions(): RepeatGestureOptions {
    return { ...DefaultRepeatGestureOptions };
  }

  /** The recognizer used to detect the gesture to repeat. */
  get recognizer(): GestureRecognizer<GestureOptions, TDetail> | undefined {
    return super._inner;
  }
  set recognizer(value: GestureRecognizer<GestureOptions, TDetail> | undefined) {
    super._inner = value;
  }

  /** @inheritdoc */
  protected override _onAccept(inputId: number): void {
    // Discard if input is not accepted (held).
    if (!this.#accepted.delete(inputId)) return;

    // End gesture when all input has been accepted.
    if (this.#accepted.size === 0 && this.#details.length === this.options.count) {
      this._emit(this.#createDetail("end"));
      this.reset();
    }
  }

  /** @inheritdoc */
  protected override _onReject(inputId: number): void {
    // Cancel and reset if accepted input was rejected.
    if (this.#accepted.has(inputId)) {
      this._emit(this.#createDetail("cancel"));
      this.reset();
    }
  }

  /** @inheritdoc */
  override reset(): void {
    super.reset();

    clearTimeout(this.#timeout);
    this.#timeout = undefined;
    this.#accepted.forEach((x) => this._release(x));
    this.#accepted.clear();
    this.#details.length = 0;
  }

  /** @inheritdoc */
  protected override _handleDisposition(inputId: number, disposition: GestureDisposition): void {
    if (!this.recognizer) return;
    switch (disposition) {
      case "accept":
        // Place holds on accepted input and inform the recognizer it can be accepted.
        if (!this.#accepted.has(inputId)) {
          this.#accepted.add(inputId);
          this._hold(inputId);
        }
        this.recognizer.onResolution(inputId, "accept");
        break;

      case "reject":
        // When a recognizer rejects, the repeated gesture is rejected.
        if (!this.#accepted.has(inputId)) {
          this._reject(inputId);
        }

        this.reset();
        break;

      case "hold":
        // Forward holds on input
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

  /** @inheritdoc */
  protected override _handleGesture(detail: GestureDetail): void {
    if (!this.recognizer) return;

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

    this.#details.push(detail as TDetail);

    if (this.#details.length === this.options.count) {
      // Disposition all inputs as accepted when detail count is satisfied
      this.#details.forEach((x) => this._accept(x.inputId));
    } else {
      this._emit(this.#createDetail(this.#details.length === 1 ? "start" : "update"));

      // Reset for next occurrence
      this.recognizer.reset();

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
  #createDetail(phase: GesturePhase): RepeatGestureDetail<TDetail> {
    const last = this.#details[this.#details.length - 1];
    return {
      inputId: this.#details.flatMap((d) => (Array.isArray(d.inputId) ? d.inputId : [d.inputId])),
      gestureName: "repeat",
      phase,
      timestamp: last.timestamp,
      details: [...this.#details],
    };
  }
}
