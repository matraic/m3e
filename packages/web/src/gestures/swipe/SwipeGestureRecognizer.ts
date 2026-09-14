import { DelegatingGestureRecognizerBase, GestureDisposition, GestureListener, GesturePhase } from "@m3e/web/gestures";

import {
  TransformGestureDetail,
  TransformGestureOptions,
  TransformGestureRecognizer,
} from "@m3e/web/gestures/transform";

import { DefaultSwipeGestureOptions, SwipeGestureDirection, SwipeGestureOptions } from "./SwipeGestureOptions";
import { SwipeGestureDetail } from "./SwipeGestureDetail";

/** Encapsulates state used to recognize swipe gestures. */
interface SwipeGestureState {
  detail: TransformGestureDetail;
  direction: SwipeGestureDirection;
  axis: "x" | "y";
}

/** A {@link GestureRecognizer} used to detect and interpret swipe gestures from incoming input streams. */
export class SwipeGestureRecognizer extends DelegatingGestureRecognizerBase<
  SwipeGestureOptions,
  SwipeGestureDetail,
  TransformGestureOptions,
  TransformGestureDetail,
  TransformGestureRecognizer
> {
  /** @private */ #state?: SwipeGestureState;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<SwipeGestureOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<SwipeGestureDetail>} listener The function invoked when semantic detail is emitted.
   */
  constructor(options?: Partial<SwipeGestureOptions>, listener?: GestureListener<SwipeGestureDetail>) {
    super(options, listener, new TransformGestureRecognizer());
  }

  /** @inheritdoc */
  override get defaultOptions(): SwipeGestureOptions {
    return { ...DefaultSwipeGestureOptions };
  }

  /** @inheritdoc */
  override get eager(): boolean {
    return true;
  }

  /** @inheritdoc */
  protected override _applyOptions(options: SwipeGestureOptions, inner: TransformGestureRecognizer): void {
    inner.options = {
      minDisplacement: options.startThreshold,
      pointers: options.pointers,
      maxPressInterval: options.maxPressInterval,
    };
  }

  /** @inheritdoc */
  protected override _onAccept(inputId: number): void {
    // Ignore if no state or state is for a different input.
    if (!this.#state || this.#shouldIgnoreInput(inputId, this.#state)) return;
    this._emit(this.#createDetail("end", this.#state));
    this.reset();
  }

  /** @inheritdoc */
  protected override _onReject(inputId: number): void {
    // Ignore if no state or state is for a different input.
    if (!this.#state || this.#shouldIgnoreInput(inputId, this.#state)) return;
    this._emit(this.#createDetail("cancel", this.#state));
    this.reset();
  }

  /** @private */
  protected override _handleDisposition(inputId: number, disposition: GestureDisposition): void {
    if (disposition === "accept") {
      // The inner recognizer does not compete with other gestures.
      this._inner?.onResolution(inputId, "accept");
    }
  }

  protected override _handleGesture(detail: TransformGestureDetail): void {
    switch (detail.phase) {
      case "cancel":
        // If cancelled and there is state (gesture started), cancel and release deferred input.
        // Otherwise, just reset the recognizer.

        if (this.#state) {
          this._emit(this.#createDetail("cancel", this.#state));
          this.#releaseAndReset(detail.inputId);
        } else {
          this.reset();
        }
        break;

      case "start":
        // On start, initialize state, emit start and defer input. Input is deferred so that the
        // recognizer can be informed when another gesture accepts the input.

        this.#state = { detail, direction: this.#computeDirection(detail), axis: detail.axis };
        this._emit(this.#createDetail("start", this.#state));
        this._defer(detail.inputId);
        break;

      case "update": {
        // On update (pointer move), update state, and validate whether the started gesture should be cancelled.
        const previousAxis = this.#state?.axis ?? detail.axis;
        const newAxis = detail.axis;
        this.#state = { detail, direction: this.#computeDirection(detail), axis: newAxis };

        if (this.options.directionGracePeriod > 0 && detail.duration > this.options.directionGracePeriod) {
          // Cancel early if axis flips after a grace period.
          if (previousAxis !== newAxis) {
            this._emit(this.#createDetail("cancel", this.#state));
            this.#releaseAndReset(detail.inputId);
            break;
          }

          // Cancel early if direction is not supported after a grace period.
          if (!this.options.directions.includes(this.#state.direction)) {
            this._emit(this.#createDetail("cancel", this.#state));
            this.#releaseAndReset(detail.inputId);
            break;
          }
        }

        // Emit an update if the gesture has not been cancelled.
        this._emit(this.#createDetail("update", this.#state));
        break;
      }

      case "end": {
        this.#state = { detail, direction: this.#computeDirection(detail), axis: detail.axis };
        // Cancel if there is not enough displacement.
        if (detail.totalDisplacement < this.options.minDisplacement) {
          this._emit(this.#createDetail("cancel", this.#state));
          this.#releaseAndReset(detail.inputId);
          break;
        }

        // Cancel if not enough velocity.
        if (detail.speed < this.options.minVelocity) {
          this._emit(this.#createDetail("cancel", this.#state));
          this.#releaseAndReset(detail.inputId);
          break;
        }

        // Cancel if there is no directional commitment.
        const committed =
          this.#state.axis === "x"
            ? Math.abs(detail.totalDeltaX) >= this.options.directionThreshold
            : Math.abs(detail.totalDeltaY) >= this.options.directionThreshold;

        if (!committed) {
          this._emit(this.#createDetail("cancel", this.#state));
          this.#releaseAndReset(detail.inputId);
          break;
        }

        // Cancel if not in an allowed directions
        if (!this.options.directions.includes(this.#state.direction)) {
          this._emit(this.#createDetail("cancel", this.#state));
          this.#releaseAndReset(detail.inputId);
          break;
        }

        // Attempt to accept input (eagerly).
        this._accept(detail.inputId);
        break;
      }
    }
  }

  /** @inheritdoc */
  override reset(): void {
    super.reset();
    this.#state = undefined;
  }

  /** @private */
  #shouldIgnoreInput(inputId: number, state: SwipeGestureState): boolean {
    const ids = Array.isArray(state.detail.inputId) ? state.detail.inputId : [state.detail.inputId];
    return !ids.includes(inputId);
  }

  /** @private */
  #computeDirection(detail: TransformGestureDetail): SwipeGestureDirection {
    return detail.axis === "x" ? (detail.totalDeltaX > 0 ? "right" : "left") : detail.totalDeltaY > 0 ? "down" : "up";
  }

  /** @private */
  #createDetail(phase: GesturePhase, state: SwipeGestureState): SwipeGestureDetail {
    return {
      inputId: state.detail.inputId,
      gestureName: "swipe",
      phase,
      timestamp: state.detail.timestamp,
      direction: state.direction,
      axis: state.detail.axis,
      translationX: state.detail.totalDeltaX,
      translationY: state.detail.totalDeltaY,
      displacement: state.detail.totalDisplacement,
      velocityX: state.detail.velocityX,
      velocityY: state.detail.velocityY,
      speed: state.detail.speed,
      duration: state.detail.duration,
    };
  }

  /** @private */
  #releaseAndReset(inputId: number | readonly number[]): void {
    this._release(inputId);
    this.reset();
  }
}
