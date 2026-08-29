import { GestureDetail, GestureRecognizerBase, PointerInput } from "../core";

/** Specifies the phases of a pan gesture. */
export type PanGesturePhase = "start" | "move" | "end" | "cancel";

/** Specifies the orientation of a pan gesture. */
export type PanGestureOrientation = "horizontal" | "vertical";

/** Encapsulates detail about a pan gesture. */
export interface PanGestureDetail extends GestureDetail {
  /** Current phase of the pan gesture. */
  phase: PanGesturePhase;

  /** Viewport x-coordinate where the pan began. */
  startClientX: number;

  /** Viewport y-coordinate where the pan began. */
  startClientY: number;

  /** Element-relative x-coordinate where the pan began. */
  startLocalX: number;

  /** Element-relative y-coordinate where the pan began. */
  startLocalY: number;

  /** Current viewport x-coordinate. */
  clientX: number;

  /** Current viewport y-coordinate. */
  clientY: number;

  /** Current element-relative x-coordinate. */
  localX: number;

  /** Current element-relative y-coordinate. */
  localY: number;

  /** Incremental x-axis movement since the previous pan event. */
  deltaX: number;

  /** Incremental y-axis movement since the previous pan event. */
  deltaY: number;

  /**
   * Incremental movement along the resolved primary axis.
   * Equals `deltaX` for horizontal pans and `deltaY` for vertical pans.
   */
  primaryDelta: number;

  /**
   * Total movement along the resolved primary axis since pan start.
   * Equals `totalDeltaX` for horizontal pans and `totalDeltaY` for vertical pans.
   */
  totalPrimaryDelta: number;

  /** Instantaneous x-axis velocity in px/ms. */
  velocityX: number;

  /** Instantaneous y-axis velocity in px/ms. */
  velocityY: number;

  /** Total x-axis displacement since pan start. */
  totalDeltaX: number;

  /** Total y-axis displacement since pan start. */
  totalDeltaY: number;

  /** Magnitude of the velocity vector. */
  speed: number;

  /** Movement angle in radians, based on total displacement. Computed as atan2(totalDeltaY, totalDeltaX). */
  angle: number;

  /** Movement direction along the x-axis: -1, 0, or 1. */
  directionX: number;

  /** Movement direction along the y-axis: -1, 0, or 1. */
  directionY: number;

  /** Resolved pan orientation based on dominant total displacement. */
  orientation: PanGestureOrientation;
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
export class PanGestureRecognizer extends GestureRecognizerBase<PanGestureDetail> {
  /** @private */ #state?: GestureState;

  /**
   * Minimum distance (px) a pointer can move before the gesture starts.
   * @default 4
   */
  minDisplacement: number = 4;

  /**
   * Locks movement to an axis.
   * @default "none"
   */
  lockAxis: PanGestureLockAxis = "none";

  /**
   * Minimum total displacement (px) required before axis locking resolves.
   * @default 8
   */
  axisThreshold: number = 8;

  /**
   * Minimum incremental movement (px) on the secondary axis required before emitting move updates.
   * @default 0
   */
  deltaThreshold: number = 0;

  /** @inheritdoc */
  override readonly gestureType = "pan";

  /** @inheritdoc */
  override get eager(): boolean {
    return true;
  }

  /** @inheritdoc */
  override _onPointerDown(input: PointerInput): void {
    // Ignore other pointers
    if (this.#state) return;

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
          if (Math.abs(this.#state.deltaY) < this.deltaThreshold) {
            return;
          }
          break;

        case "vertical":
          if (Math.abs(this.#state.deltaX) < this.deltaThreshold) {
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

    if (Math.hypot(deltaX, deltaY) >= this.minDisplacement) {
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

    if (!this.#state.active) {
      // If inactive, reset
      this.reset();
    } else {
      // When active, update, and attempt to accept input
      this.#updateState(input, this.#state);
      this._acceptInput(input.id);
    }
  }

  /** @inheritdoc */
  override _onPointerCancel(input: PointerInput): void {
    // Ignore if no state, state's id doesn't match input
    if (!this.#state || this.#state.id !== input.id) return;

    if (!this.#state.active) {
      // If inactive, reset
      this.reset();
    } else {
      // When active, cancel and reset
      this._emitGesture(this.#createDetail("cancel", this.#state));
      this.reset();
    }
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
    if (!this.#state || this.#state.id !== id || !this.#state.active) return;

    // When active, cancel and reset
    this._emitGesture(this.#createDetail("cancel", this.#state));
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
    if (this.lockAxis === "x") {
      state.orientation = "horizontal";
      return;
    }

    if (this.lockAxis === "y") {
      state.orientation = "vertical";
      return;
    }

    // Natural axis locking
    if (this.lockAxis !== "lock" || state.orientation) return;

    const totalDeltaX = state.clientX - state.startClientX;
    const totalDeltaY = state.clientY - state.startClientY;

    // Lock axis only after threshold displacement
    if (Math.abs(totalDeltaX) >= this.axisThreshold || Math.abs(totalDeltaY) >= this.axisThreshold) {
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
