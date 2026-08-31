import {
  createGestureRecognizer,
  GestureDetail,
  GestureInput,
  GestureInputDisposition,
  gestureRecognizer,
  GestureRecognizerBase,
  GestureRecognizerOptions,
} from "@m3e/web/gestures";

import { PanGestureDetail, PanGestureOptions } from "@m3e/web/gestures/pan";

/**
 * Specifies the possible directions of a fling gesture.
 * - `left` — A fling with dominant movement toward the negative x‑axis.
 * - `right` — A fling with dominant movement toward the positive x‑axis.
 * - `up` — A fling with dominant movement toward the negative y‑axis.
 * - `down` — A fling with dominant movement toward the positive y‑axis.
 */
export type FlingGestureDirection = "left" | "right" | "up" | "down";

/**
 * Specifies the dominant axis of a fling gesture.
 * - `x` — The fling's primary movement occurs along the horizontal axis.
 * - `y` — The fling's primary movement occurs along the vertical axis.
 */
export type FlingGestureAxis = "x" | "y";

/** Encapsulates detail about a fling gesture. */
export interface FlingGestureDetail extends GestureDetail {
  /** Resolved fling direction. */
  readonly direction: FlingGestureDirection;

  /** Dominant axis of the fling. */
  readonly axis: FlingGestureAxis;

  /** Total displacement (px) along the dominant axis. */
  readonly distance: number;

  /** Velocity magnitude (px/ms). */
  readonly speed: number;

  /** Angle (radians) of movement. */
  readonly angle: number;
}

/** Encapsulates options used to recognize a fling gesture. */
export interface FlingGestureOptions extends GestureRecognizerOptions {
  /**
   * Minimum velocity (px/ms) required to recognize a fling.
   * @default 0.3
   */
  readonly minVelocity: number;

  /**
   * The allowed directions of the fling.
   * @default ["left", "right", "up", "down"]
   */
  readonly directions: readonly FlingGestureDirection[];

  /**
   * Minimum displacement (px) required before direction is considered valid.
   * @default 12
   */
  readonly directionThreshold: number;

  /**
   * Minimum distance (px) a pointer must move before the gesture can be recognized.
   * @default 24
   */
  readonly minDisplacement: number;
}

/** State used to recognize fling gestures. */
interface GestureState {
  detail: PanGestureDetail;
  direction: FlingGestureDirection;
  axis: FlingGestureAxis;
}

/** Recognizes a fling gesture. */
@gestureRecognizer("fling")
export class FlingGestureRecognizer extends GestureRecognizerBase<FlingGestureOptions, FlingGestureDetail> {
  /** @private */ readonly #pan = createGestureRecognizer<PanGestureOptions, PanGestureDetail>("pan", {
    minDisplacement: 0,
  });
  /** @private */ #state?: GestureState;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<FlingGestureOptions> | undefined} options Options used to recognize gestures.
   */
  constructor(options?: Partial<FlingGestureOptions>) {
    super(options);

    if (this.#pan) {
      this.#pan.onDisposition = (id, disposition) => this.#handlePanDisposition(id, disposition);
      this.#pan.onGesture = (detail) => this.#handlePanGesture(detail);
    }
  }

  /** @inheritdoc */
  protected override get _defaultOptions(): Partial<FlingGestureOptions> {
    return {
      ...super._defaultOptions,
      minVelocity: 0.3,
      directions: ["left", "right", "up", "down"],
      directionThreshold: 12,
      minDisplacement: 24,
    };
  }

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
  protected override _onRejectInput(): void {
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

      case "start":
        // Ensure state is cleared
        this.#state = undefined;

        // Defer input so that if another gesture is recognized, this will be rejected
        this._deferInput(detail.id);
        break;

      case "move":
        // Fling never fires on move, only fires on end
        break;

      case "end": {
        // Must have enough displacement, otherwise release and reset
        const displacement = Math.hypot(detail.totalDeltaX, detail.totalDeltaY);
        if (displacement < this.options.minDisplacement) {
          this.#releaseAndReset(detail.id);
          break;
        }

        // Must be fast at end, otherwise release and reset
        if (detail.speed < this.options.minVelocity) {
          this.#releaseAndReset(detail.id);
          break;
        }

        // Must have directional commitment, otherwise release and reset
        const axis = this.#computeAxis(detail);
        const committed =
          axis === "x"
            ? Math.abs(detail.totalDeltaX) >= this.options.directionThreshold
            : Math.abs(detail.totalDeltaY) >= this.options.directionThreshold;

        if (!committed) {
          this.#releaseAndReset(detail.id);
          break;
        }

        // Must be in allowed directions, otherwise release and reset
        const direction = this.#computeDirection(detail);
        if (!this.options.directions.includes(direction)) {
          this.#releaseAndReset(detail.id);
          break;
        }

        // Try to accept gesture
        this.#state = { detail, direction, axis };
        this._acceptInput(detail.id);
        break;
      }
    }
  }

  /** @private */
  #computeAxis(detail: PanGestureDetail): FlingGestureAxis {
    return Math.abs(detail.totalDeltaX) > Math.abs(detail.totalDeltaY) ? "x" : "y";
  }

  /** @private */
  #computeDirection(detail: PanGestureDetail): FlingGestureDirection {
    return this.#computeAxis(detail) === "x"
      ? detail.totalDeltaX > 0
        ? "right"
        : "left"
      : detail.totalDeltaY > 0
        ? "down"
        : "up";
  }

  /** @private */
  #releaseAndReset(id: number): void {
    this._releaseInput(id);
    this.reset();
  }
}
