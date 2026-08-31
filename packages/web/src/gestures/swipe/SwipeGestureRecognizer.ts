import {
  createGestureRecognizer,
  GestureDetail,
  GestureInput,
  GestureInputDisposition,
  GestureRecognizerBase,
  GestureRecognizerOptions,
  registerGestureRecognizer,
} from "@m3e/web/gestures";

import { PanGestureDetail, PanGestureOptions } from "@m3e/web/gestures/pan";

/**
 * Specifies the possible directions of a swipe gesture.
 * - `left` — A swipe with dominant movement toward the negative x‑axis.
 * - `right` — A swipe with dominant movement toward the positive x‑axis.
 * - `up` — A swipe with dominant movement toward the negative y‑axis.
 * - `down` — A swipe with dominant movement toward the positive y‑axis.
 */
export type SwipeGestureDirection = "left" | "right" | "up" | "down";

/**
 * Specifies the dominant axis of a swipe gesture.
 * - `x` — The swipe's primary movement occurs along the horizontal axis.
 * - `y` — The swipe's primary movement occurs along the vertical axis.
 */
export type SwipeGestureAxis = "x" | "y";

/** Encapsulates detail about a swipe gesture. */
export interface SwipeGestureDetail extends GestureDetail {
  /** Resolved swipe direction. */
  direction: SwipeGestureDirection;

  /** Dominant axis of the swipe. */
  axis: SwipeGestureAxis;

  /** Total displacement (px) along the dominant axis. */
  distance: number;

  /** Velocity magnitude (px/ms). */
  speed: number;

  /** Angle (radians) of movement. */
  angle: number;
}

/** Encapsulates options used to recognize a swipe gesture. */
export interface SwipeGestureOptions extends GestureRecognizerOptions {
  /**
   * Minimum velocity (px/ms) required to recognize a swipe.
   * @default 0.3
   */
  readonly minVelocity: number;

  /**
   * The allowed directions of the swipe.
   * @default ["left", "right", "up", "down"]
   */
  readonly directions: readonly SwipeGestureDirection[];

  /**
   * Minimum displacement (px) required before direction is considered valid.
   * @default 8
   */
  readonly directionThreshold: number;

  /**
   * * Maximum distance (px) a pointer can move before the gesture fails.
   * @default 24
   */
  readonly maxDisplacement: number;
}

/** State used to recognize swipe gestures. */
interface GestureState {
  detail: PanGestureDetail;
  direction: SwipeGestureDirection;
  axis: SwipeGestureAxis;
}

/** Recognizes a swipe gesture. */
class SwipeGestureRecognizer extends GestureRecognizerBase<SwipeGestureOptions, SwipeGestureDetail> {
  /** @private */ readonly #pan = createGestureRecognizer<PanGestureOptions, PanGestureDetail>("pan", {
    minDisplacement: 0,
  });
  /** @private */ #state?: GestureState;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<SwipeGestureOptions> | undefined} options Options used to recognize gestures.
   */
  constructor(options?: Partial<SwipeGestureOptions>) {
    super(options);

    if (this.#pan) {
      this.#pan.onDisposition = (id, disposition) => this.#handlePanDisposition(id, disposition);
      this.#pan.onGesture = (detail) => this.#handlePanGesture(detail);
    }
  }

  /** @inheritdoc */
  override readonly gestureType = "swipe";

  /** @inheritdoc */
  override get eager(): boolean {
    return true;
  }

  /** @private */
  override onInput(input: GestureInput): void {
    this.#pan?.onInput(input);
    super.onInput(input);
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    if (!this.#state || this.#state.detail.id !== id) return;

    this._emitGesture({
      gestureType: this.gestureType,
      id: this.#state.detail.id,
      timestamp: this.#state.detail.timestamp,
      direction: this.#state.direction,
      axis: this.#state.axis,
      distance: Math.hypot(this.#state.detail.totalDeltaX, this.#state.detail.totalDeltaY),
      speed: this.#state.detail.speed,
      angle: this.#state.detail.angle,
    });

    this.reset();
  }

  /** @inheritdoc */
  protected override _onRejectInput(_id: number): void {
    if (!this.#state || this.#state.detail.id !== _id) return;
    this.reset();
  }

  /** @inheritdoc */
  override reset(): void {
    this.#pan?.reset();
    this.#state = undefined;
  }

  /** @private */
  #handlePanDisposition(id: number, disposition: GestureInputDisposition): void {
    if (disposition === "accept") {
      // Fires end
      this.#pan?.onResolution(id, "accept");
    }
  }

  /** @private */
  #handlePanGesture(detail: PanGestureDetail): void {
    switch (detail.phase) {
      case "cancel":
        this.reset();
        break;

      case "move": {
        // During early window, displacement must still be within swipe threshold
        const displacement = Math.hypot(detail.totalDeltaX, detail.totalDeltaY);

        // Must be within early window, release deferment and reset if exceeded
        if (displacement > this.options.maxDisplacement) {
          this._releaseInput(detail.id);
          this.reset();
          break;
        }

        // Must be fast, otherwise ignore
        if (detail.speed < this.options.minVelocity) break;

        // Must have directional commitment, otherwise ignore
        const axis = this.#computeAxis(detail);
        const committed =
          axis === "x"
            ? Math.abs(detail.totalDeltaX) >= this.options.directionThreshold
            : Math.abs(detail.totalDeltaY) >= this.options.directionThreshold;

        if (!committed) {
          break;
        }

        // Must be in allowed directions, otherwise ignore
        const direction = this.#computeDirection(detail);
        if (!this.options.directions.includes(direction)) {
          break;
        }

        // Try to accept gesture
        this.#state = { detail, direction, axis };
        this._acceptInput(detail.id);
        break;
      }

      case "start":
        // Ensure state is cleared
        this.#state = undefined;

        // Defer input so that if another gesture is recognized, this will be rejected
        this._deferInput(detail.id);
        break;

      case "end":
        // Swipe must be early, end velocity is fling behavior ignore
        this.reset();
        break;
    }
  }

  /** @private */
  #computeAxis(detail: PanGestureDetail): SwipeGestureAxis {
    return Math.abs(detail.totalDeltaX) > Math.abs(detail.totalDeltaY) ? "x" : "y";
  }

  /** @private */
  #computeDirection(detail: PanGestureDetail): SwipeGestureDirection {
    return this.#computeAxis(detail) === "x"
      ? detail.totalDeltaX > 0
        ? "right"
        : "left"
      : detail.totalDeltaY > 0
        ? "down"
        : "up";
  }
}

// Register the recognizer
registerGestureRecognizer<SwipeGestureOptions, SwipeGestureDetail>(
  "swipe",
  (options) => new SwipeGestureRecognizer(options),
);
