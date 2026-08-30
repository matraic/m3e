import { GestureDetail, GestureRecognizerBase, PointerInput } from "../core";

/**
 * Represents the lifecycle phase of a scale gesture.
 * - `"start"` — The gesture has activated after crossing its threshold.
 * - `"move"` — The gesture is actively scaling, with pointer movement producing updated scale and centroid.
 * - `"end"` — All required pointers were released normally, completing the gesture.
 * - `"cancel"` — The gesture was interrupted or rejected and did not complete normally.
 */
export type ScaleGesturePhase = "start" | "move" | "end" | "cancel";

/** Encapsulates detail about a scale gesture. */
export interface ScaleGestureDetail extends GestureDetail {
  /** The current phase of the scale gesture. */
  readonly phase: ScaleGesturePhase;

  /**
   * Scale factor relative to the initial pointer distance.
   * A value of 1 represents no scaling; values >1 indicate expansion,
   * and values <1 indicate contraction.
   */
  readonly scale: number;

  /** Average distance of all active pointers from the gesture centroid. */
  readonly distance: number;

  /** Viewport X‑coordinate of the gesture centroid, computed from all active pointers. */
  readonly clientCenterX: number;

  /** Viewport Y‑coordinate of the gesture centroid, computed from all active pointers. */
  readonly clientCenterY: number;

  /** Local X‑coordinate of the gesture centroid, relative to the target element's bounding box. */
  readonly localCenterX: number;

  /** Local Y‑coordinate of the gesture centroid, relative to the target element's bounding box. */
  readonly localCenterY: number;

  /** Number of active pointers contributing to the scale gesture. */
  readonly pointers: number;
}

type ScaleGestureMetrics = Omit<ScaleGestureDetail, "phase" | "gestureType" | "pointers" | "id" | "timestamp">;

/** Recognizes a scale gesture. */
export class ScaleGestureRecognizer extends GestureRecognizerBase<ScaleGestureDetail> {
  /** @private */ #pointers = new Map<number, PointerInput>();
  /** @private */ #bounds: DOMRect | null = null;
  /** @private */ #accepted = new Set<number>();
  /** @private */ #initialDistance: number | null = null;
  /** @private */ #started = false;

  /** @inheritdoc */
  override gestureType = "scale";

  /**
   * Number of pointers that must be pressed before the gesture fails.
   * @default 2
   */
  pointers: number = 2;

  /**
   * Minimum distance change (px) required to activate scale.
   * @default 4
   */
  distanceThreshold = 4;

  /** @inheritdoc */
  protected override _onPointerDown(input: PointerInput): void {
    if (this.#pointers.size === this.pointers) {
      // Too many pointers, reject all and reset
      this.#pointers.forEach((x) => this._rejectInput(x.id));
      this.reset();
    }

    this.#pointers.set(input.id, input);

    // Hold input to be notified of rejection
    this._holdInput(input.id);
  }

  /** @inheritdoc */
  protected override _onPointerMove(input: PointerInput): void {
    // Ignore if not tracking pointer or count not met
    if (!this.#pointers.has(input.id) || this.#pointers.size !== this.pointers) return;

    this.#pointers.set(input.id, input);

    /** If started, emit move */
    if (this.#started) {
      this._emitGesture(this.#createDetail("move", input));
      return;
    }

    const state = this.#computeMetrics();

    // On first move, set initial distance
    if (this.#initialDistance === null) {
      this.#initialDistance = state.distance;

      // Capture bounds once
      this.#bounds = input.currentTarget.getBoundingClientRect();
      return;
    }

    // After first move, test distance and accept all pointers if threshold met
    if (Math.abs(state.distance - this.#initialDistance) >= this.distanceThreshold) {
      this.#pointers.forEach((x) => this._acceptInput(x.id));
    }
  }

  /** @inheritdoc */
  protected override _onPointerUp(input: PointerInput): void {
    // If not tracking pointer, ignore
    if (!this.#pointers.has(input.id)) return;

    // If started, end the gesture
    if (this.#started) {
      this._emitGesture(this.#createDetail("end", input));
    }

    this.reset();
  }

  /** @inheritdoc */
  protected override _onPointerCancel(input: PointerInput): void {
    if (!this.#pointers.has(input.id)) return;

    // If started, cancel gesture
    if (this.#started) {
      this._emitGesture(this.#createDetail("cancel", input));
    }

    this.reset();
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    const input = this.#pointers.get(id);
    if (!input || this.#accepted.has(id)) return;

    // If tracking pointer and not accepted, accept it
    this.#accepted.add(id);

    // When all accepted, start gesture
    if (this.#accepted.size === this.#pointers.size) {
      this.#started = true;
      this._emitGesture(this.#createDetail("start", input));
    }
  }

  /** @inheritdoc */
  protected override _onRejectInput(_id: number): void {
    if (!this.#pointers.has(_id)) return;

    // If any tracked pointer is rejected, reset
    this.reset();
  }

  /** @inheritdoc */
  override reset(): void {
    this.#pointers.clear();
    this.#accepted.clear();
    this.#initialDistance = null;
    this.#bounds = null;
    this.#started = false;
  }

  /** @private */
  #createDetail(phase: ScaleGesturePhase, input: PointerInput): ScaleGestureDetail {
    const state = this.#computeMetrics();

    return {
      id: input.id,
      timestamp: input.timestamp,
      phase: phase,
      gestureType: this.gestureType,
      pointers: this.#pointers.size,
      ...state,
    };
  }

  /** @private */
  #computeMetrics(): ScaleGestureMetrics {
    const inputs = [...this.#pointers.values()];

    // Compute centroid
    let clientCenterX = 0;
    let clientCenterY = 0;

    for (const p of inputs) {
      clientCenterX += p.clientX;
      clientCenterY += p.clientY;
    }

    clientCenterX /= inputs.length;
    clientCenterY /= inputs.length;

    // Local centroid (relative to element bounds)
    let localCenterX = clientCenterX;
    let localCenterY = clientCenterY;

    if (this.#bounds) {
      localCenterX = clientCenterX - this.#bounds.left;
      localCenterY = clientCenterY - this.#bounds.top;
    }

    // Compute average distance from centroid
    let total = 0;
    for (const p of inputs) {
      const dx = p.clientX - clientCenterX;
      const dy = p.clientY - clientCenterY;
      total += Math.hypot(dx, dy);
    }

    const distance = total / inputs.length;
    const scale = this.#initialDistance ? distance / this.#initialDistance : 1;

    return { distance, scale, clientCenterX, clientCenterY, localCenterX, localCenterY };
  }
}
