import { GestureDetail, GestureRecognizerBase, PointerInput } from "../core";

/** Encapsulates detail about a long-press gesture. */
export interface LongPressGestureDetail extends GestureDetail {
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
export class LongPressGestureRecognizer extends GestureRecognizerBase<LongPressGestureDetail> {
  /** @private */ #state?: GestureState;

  /**
   * Maximum distance (px) a pointer can move before the gesture fails.
   * @default 4
   */
  maxDisplacement: number = 4;

  /**
   * Minimum time (ms) a pointer must remain pressed.
   * @default 500
   */
  minDuration: number = 500;

  /** @inheritdoc */
  override readonly gestureType: string = "long-press";

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
            this.#state.endTime = this.#state.startTime + this.minDuration;
            this._acceptInput(this.#state.id);
          }
        }, this.minDuration),
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
    const maxDispSq = this.maxDisplacement * this.maxDisplacement;
    const maxDisplacementExceeded = dx * dx + dy * dy > maxDispSq;

    if (maxDisplacementExceeded) {
      this._rejectInput(this.#state.id);
    }
  }

  /** @inheritdoc */
  override _onPointerUp(input: PointerInput): void {
    // Reject if pointer up occurs before accepted (eagerly)
    if (this.#state && this.#state.id === input.id) {
      this._rejectInput(this.#state.id);
    }
  }

  /** @inheritdoc */
  override _onPointerCancel(input: PointerInput) {
    if (this.#state && this.#state.id === input.id) {
      this._rejectInput(this.#state.id);
    }
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    if (!this.#state || this.#state.id !== id) return;

    this._emitGesture({
      id: this.#state.id,
      gestureType: this.gestureType,
      clientX: this.#state.clientX,
      clientY: this.#state.clientY,
      localX: this.#state.localX,
      localY: this.#state.localY,
      duration: this.#state.endTime - this.#state.startTime,
      timestamp: this.#state.endTime,
    });
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
}
