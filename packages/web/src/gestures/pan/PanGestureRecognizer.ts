import {
  GestureDetail,
  gestureRecognizer,
  GestureRecognizerBase,
  GestureRecognizerOptions,
  PointerInput,
} from "@m3e/web/gestures";

/**
 * Represents the lifecycle phases of a pan gesture.
 * - `"start"` — The gesture has activated after crossing its movement threshold.
 * - `"move"` — The gesture is actively panning, updated deltas and displacement.
 * - `"end"` — The gesture completed normally because the active pointer was released.
 * - `"cancel"` — The gesture was interrupted or rejected and did not complete normally.
 */
export type PanGesturePhase = "start" | "move" | "end" | "cancel";

/**
 * Indicates the resolved primary axis of a pan gesture.
 * - `"horizontal"` — Movement along the x‑axis dominates total displacement.
 * - `"vertical"` — Movement along the y‑axis dominates total displacement.
 */
export type PanGestureOrientation = "horizontal" | "vertical";

/** Encapsulates detail about a pan gesture. */
export interface PanGestureDetail extends GestureDetail {
  /** Current phase of the pan gesture. */
  readonly phase: PanGesturePhase;

  /** Viewport x-coordinate where the pan began. */
  readonly startClientX: number;

  /** Viewport y-coordinate where the pan began. */
  readonly startClientY: number;

  /** Element-relative x-coordinate where the pan began. */
  readonly startLocalX: number;

  /** Element-relative y-coordinate where the pan began. */
  readonly startLocalY: number;

  /** Current viewport x-coordinate. */
  readonly clientX: number;

  /** Current viewport y-coordinate. */
  readonly clientY: number;

  /** Current element-relative x-coordinate. */
  readonly localX: number;

  /** Current element-relative y-coordinate. */
  readonly localY: number;

  /** Incremental x-axis movement since the previous pan event. */
  readonly deltaX: number;

  /** Incremental y-axis movement since the previous pan event. */
  readonly deltaY: number;

  /**
   * Incremental movement along the resolved primary axis.
   * Equals `deltaX` for horizontal pans and `deltaY` for vertical pans.
   */
  readonly primaryDelta: number;

  /**
   * Total movement along the resolved primary axis since pan start.
   * Equals `totalDeltaX` for horizontal pans and `totalDeltaY` for vertical pans.
   */
  readonly totalPrimaryDelta: number;

  /** Instantaneous x-axis velocity in px/ms. */
  readonly velocityX: number;

  /** Instantaneous y-axis velocity in px/ms. */
  readonly velocityY: number;

  /** Total x-axis displacement since pan start. */
  readonly totalDeltaX: number;

  /** Total y-axis displacement since pan start. */
  readonly totalDeltaY: number;

  /** Magnitude of the velocity vector. */
  readonly speed: number;

  /** Movement angle in radians, based on total displacement. Computed as atan2(totalDeltaY, totalDeltaX). */
  readonly angle: number;

  /** Movement direction along the x-axis: -1, 0, or 1. */
  readonly directionX: number;

  /** Movement direction along the y-axis: -1, 0, or 1. */
  readonly directionY: number;

  /** Resolved pan orientation based on dominant total displacement. */
  readonly orientation: PanGestureOrientation;
}

/** Encapsulates options used to recognize a pan gesture. */
export interface PanGestureOptions extends GestureRecognizerOptions {
  /**
   * Minimum distance (px) a pointer can move before the gesture starts.
   * @default 4
   */
  readonly minDisplacement: number;

  /**
   * Locks movement to an axis.
   * @default "none"
   */
  readonly lockAxis: PanGestureLockAxis;

  /**
   * Minimum total displacement (px) required before axis locking resolves.
   * @default 8
   */
  readonly axisThreshold: number;

  /**
   * Minimum incremental movement (px) on the secondary axis required before emitting move updates.
   * @default 0
   */
  readonly deltaThreshold: number;
}

/** State used to recognize pan gestures. */
interface GestureState {
  id: number;
  bounds: DOMRect;
  startClientX: number;
  startClientY: number;
  clientX: number;
  clientY: number;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  timestamp: number;
  active: boolean;
  orientation: PanGestureOrientation | null;
}

/** Specifies the axes to which a pan gesture can lock. */
export type PanGestureLockAxis = "x" | "y" | "lock" | "none";

/** Recognizes a pan gesture. */
gestureRecognizer("pan");
export class PanGestureRecognizer extends GestureRecognizerBase<PanGestureOptions, PanGestureDetail> {
  /** @private */ #state?: GestureState;

  /** @inheritdoc */
  protected override get _defaultOptions(): Partial<PanGestureOptions> {
    return {
      ...super._defaultOptions,
      minDisplacement: 4,
      lockAxis: "none",
      axisThreshold: 8,
      deltaThreshold: 0,
    };
  }

  /** @inheritdoc */
  override _onPointerDown(input: PointerInput): void {
    // Ignore other pointers
    if (this.#state && this.#state.id !== input.id) return;

    this.#state = {
      id: input.id,
      bounds: input.currentTarget.getBoundingClientRect(),
      startClientX: input.clientX,
      startClientY: input.clientY,
      clientX: input.clientX,
      clientY: input.clientY,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      timestamp: input.timestamp,
      active: false,
      orientation: null,
    };
  }

  /** @inheritdoc */
  override _onPointerMove(input: PointerInput): void {
    // Ignore if no state or state's id doesn't match input
    if (!this.#state || this.#state.id !== input.id) return;

    this.#updateState(input, this.#state);

    if (this.#state.active) {
      // When active, optionally lock axis
      this.#tryLockAxis(this.#state);

      // Don't emit move if axis is locked and delta didn't change.
      switch (this.#state.orientation) {
        case "horizontal":
          if (Math.abs(this.#state.deltaY) < this.options.deltaThreshold) {
            return;
          }
          break;

        case "vertical":
          if (Math.abs(this.#state.deltaX) < this.options.deltaThreshold) {
            return;
          }
          break;
      }

      // Dispatch updates
      this._emitGesture(this.#createDetail("move", this.#state));
      return;
    }

    // When not active, ensure min displacement prior to activation
    const deltaX = input.clientX - this.#state.startClientX;
    const deltaY = input.clientY - this.#state.startClientY;

    if (Math.hypot(deltaX, deltaY) >= this.options.minDisplacement) {
      // Accept, start gesture, defer input
      this.#state.active = true;
      this._emitGesture(this.#createDetail("start", this.#state));
      this._deferInput(input.id);
    }
  }

  /** @inheritdoc */
  override _onPointerUp(input: PointerInput): void {
    // Ignore if no state, state's id doesn't match input
    if (!this.#state || this.#state.id !== input.id) return;

    if (this.#state.active) {
      // When active, update coords and timestamp only, and attempt to accept input
      this.#state.clientX = input.clientX;
      this.#state.clientY = input.clientY;
      this.#state.timestamp = input.timestamp;

      this._acceptInput(input.id);
    } else {
      // If inactive, reset
      this.reset();
    }
  }

  /** @inheritdoc */
  override _onPointerCancel(input: PointerInput): void {
    // Ignore if no state, state's id doesn't match input
    if (!this.#state || this.#state.id !== input.id) return;

    if (this.#state.active) {
      // When active, cancel
      this._emitGesture(this.#createDetail("cancel", this.#state));
    }

    // Reset state
    this.reset();
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    // Ignore if no state, state's id doesn't match input, or inactive
    if (!this.#state || this.#state.id !== id || !this.#state.active) return;

    // When active, end and reset
    this._emitGesture(this.#createDetail("end", this.#state));
    this.reset();
  }

  /** @inheritdoc */
  protected override _onRejectInput(id: number): void {
    // Ignore if no state, state's id doesn't match input, or inactive
    if (!this.#state || this.#state.id !== id) return;

    if (this.#state.active) {
      // When active, cancel
      this._emitGesture(this.#createDetail("cancel", this.#state));
    }

    // Reset state
    this.reset();
  }

  /** @inheritdoc */
  override reset(): void {
    this.#state = undefined;
  }

  /** @private */
  #updateState(input: PointerInput, state: GestureState): void {
    state.deltaX = input.clientX - state.clientX;
    state.deltaY = input.clientY - state.clientY;

    const dt = input.timestamp - state.timestamp;
    state.velocityX = dt > 0 ? state.deltaX / dt : 0;
    state.velocityY = dt > 0 ? state.deltaY / dt : 0;

    state.clientX = input.clientX;
    state.clientY = input.clientY;
    state.timestamp = input.timestamp;
  }

  /** @private */
  #tryLockAxis(state: GestureState): void {
    // Explicit axis locking
    if (this.options.lockAxis === "x") {
      state.orientation = "horizontal";
      return;
    }

    if (this.options.lockAxis === "y") {
      state.orientation = "vertical";
      return;
    }

    // Natural axis locking
    if (this.options.lockAxis !== "lock" || state.orientation) return;

    const totalDeltaX = state.clientX - state.startClientX;
    const totalDeltaY = state.clientY - state.startClientY;

    // Lock axis only after threshold displacement
    if (Math.abs(totalDeltaX) >= this.options.axisThreshold || Math.abs(totalDeltaY) >= this.options.axisThreshold) {
      state.orientation = Math.abs(totalDeltaX) > Math.abs(totalDeltaY) ? "horizontal" : "vertical";
    }
  }

  /** @private */
  #createDetail(phase: PanGesturePhase, state: GestureState): PanGestureDetail {
    const totalDeltaX = state.clientX - state.startClientX;
    const totalDeltaY = state.clientY - state.startClientY;
    const dynamicOrientation = Math.abs(totalDeltaX) > Math.abs(totalDeltaY) ? "horizontal" : "vertical";
    const orientation = state.orientation ?? dynamicOrientation;

    return {
      gestureType: this.gestureType,
      phase: phase,
      id: state.id,
      timestamp: state.timestamp,
      startClientX: state.startClientX,
      startClientY: state.startClientY,
      startLocalX: state.startClientX - state.bounds.left,
      startLocalY: state.startClientY - state.bounds.top,
      clientX: state.clientX,
      clientY: state.clientY,
      localX: state.clientX - state.bounds.left,
      localY: state.clientY - state.bounds.top,
      deltaX: state.deltaX,
      deltaY: state.deltaY,
      primaryDelta: orientation === "horizontal" ? state.deltaX : state.deltaY,
      totalPrimaryDelta: orientation === "horizontal" ? totalDeltaX : totalDeltaY,
      velocityX: state.velocityX,
      velocityY: state.velocityY,
      speed: Math.hypot(state.velocityX, state.velocityY),
      angle: totalDeltaX === 0 && totalDeltaY === 0 ? 0 : Math.atan2(totalDeltaY, totalDeltaX),
      directionX: Math.sign(totalDeltaX),
      directionY: Math.sign(totalDeltaY),
      orientation,
      totalDeltaX,
      totalDeltaY,
    };
  }
}
