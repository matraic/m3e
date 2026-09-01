import {
  GestureDetail,
  gestureRecognizer,
  GestureRecognizerBase,
  GestureRecognizerOptions,
  PointerInput,
} from "@m3e/web/gestures";

/**
 * Represents the lifecycle phases of a long-press gesture.
 * - `start` — The gesture is recognized after the pointer has remained stationary for the required duration.
 * - `end`   — The gesture concludes when the pointer is released after recognition.
 */
export type LongPressGesturePhase = "start" | "end";

/** Encapsulates detail about a long-press gesture. */
export interface LongPressGestureDetail extends GestureDetail {
  /** The phase of the gesture. */
  readonly phase: LongPressGesturePhase;

  /** Viewport x-coordinate where the long-press began. */
  readonly clientX: number;

  /** Viewport y-coordinate where the long-press began. */
  readonly clientY: number;

  /** Element-relative x-coordinate where the long-press began. */
  readonly localX: number;

  /** Element-relative y-coordinate where the long-press began. */
  readonly localY: number;

  /** The total press duration (ms). */
  readonly duration: number;
}

/** Encapsulates options used to recognize a long-press gesture. */
export interface LongPressGestureOptions extends GestureRecognizerOptions {
  /**
   * Maximum distance (px) a pointer can move before the gesture fails.
   * @default 4
   */
  readonly maxDisplacement: number;

  /**
   * Minimum time (ms) a pointer must remain pressed.
   * @default 500
   */
  readonly minDuration: number;
}

/** State used to recognize long-press gestures. */
interface GestureState {
  id: number;
  clientX: number;
  clientY: number;
  localX: number;
  localY: number;
  startTime: number;
  endTime: number;
  timer: number;
  accepted: boolean;
}

/** Recognizes a long-press gesture. */
@gestureRecognizer("long-press")
export class LongPressGestureRecognizer extends GestureRecognizerBase<LongPressGestureOptions, LongPressGestureDetail> {
  /** @private */ #state?: GestureState;

  /** @inheritdoc */
  protected override get _defaultOptions(): Partial<LongPressGestureOptions> {
    return {
      ...super._defaultOptions,
      maxDisplacement: 4,
      minDuration: 500,
    };
  }

  /** @inheritdoc */
  override get eager(): boolean {
    return true;
  }

  /** @inheritdoc */
  override _onPointerDown(input: PointerInput): void {
    if (!this.#state) {
      const bounds = input.currentTarget.getBoundingClientRect();

      // Begin tracking
      this.#state = {
        id: input.id,
        clientX: input.clientX,
        clientY: input.clientY,
        localX: input.clientX - bounds.left,
        localY: input.clientY - bounds.top,
        startTime: input.timestamp,
        endTime: input.timestamp,
        accepted: false,
        timer: setTimeout(() => {
          // Accept if not yet rejected
          if (this.#state) {
            this.#state.accepted = true;
            this.#state.endTime = this.#state.startTime + this.options.minDuration;
            this._acceptInput(this.#state.id);
          }
        }, this.options.minDuration),
      };
    } else {
      // Reject when multiple pointers detected
      this._rejectInput(this.#state.id);
    }
  }

  /** @inheritdoc */
  override _onPointerMove(input: PointerInput): void {
    if (!this.#state) return;

    // Reject if max displacement is exceeded
    const dx = input.clientX - this.#state.clientX;
    const dy = input.clientY - this.#state.clientY;
    const maxDispSq = this.options.maxDisplacement * this.options.maxDisplacement;
    const maxDisplacementExceeded = dx * dx + dy * dy > maxDispSq;

    if (maxDisplacementExceeded) {
      this._rejectInput(this.#state.id);
    }
  }

  /** @inheritdoc */
  override _onPointerUp(input: PointerInput): void {
    if (this.#state && this.#state.id === input.id) {
      // Reject if pointer up occurs before accepted (eagerly)
      if (!this.#state.accepted) {
        this._rejectInput(this.#state.id);
      } else {
        // End the gesture
        this.#state.endTime = input.timestamp;
        this._emitGesture(this.#createDetail("end", this.#state));
        this.reset();
      }
    }
  }

  /** @inheritdoc */
  override _onPointerCancel(input: PointerInput) {
    if (this.#state && this.#state.id === input.id) {
      this._rejectInput(this.#state.id);
    }
  }

  /** @inheritdoc */
  override _onLostPointerCapture(input: PointerInput) {
    this._onPointerCancel(input);
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    if (!this.#state || this.#state.id !== id) return;
    this._emitGesture(this.#createDetail("start", this.#state));
  }

  /** @inheritdoc */
  protected override _onRejectInput(id: number): void {
    if (this.#state?.id === id) {
      this.reset();
    }
  }

  /** @inheritdoc */
  override reset(): void {
    clearTimeout(this.#state?.timer);
    this.#state = undefined;
  }

  /** @private */
  #createDetail(phase: LongPressGesturePhase, state: GestureState): LongPressGestureDetail {
    return {
      id: state.id,
      gestureType: this.gestureType,
      phase: phase,
      clientX: state.clientX,
      clientY: state.clientY,
      localX: state.localX,
      localY: state.localY,
      duration: state.endTime - state.startTime,
      timestamp: state.endTime,
    };
  }
}
