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

  /** X‑coordinate of the gesture centroid, computed from all active pointers. */
  readonly centerX: number;

  /** Y‑coordinate of the gesture centroid, computed from all active pointers */
  readonly centerY: number;

  /** Number of active pointers contributing to the scale gesture. */
  readonly pointers: number;
}

/** Recognizes a scale gesture. */
export class ScaleGestureRecognizer extends GestureRecognizerBase<ScaleGestureDetail> {
  /** @private */ #pointers = new Map<number, PointerInput>();
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
      this._emitGesture(this.#createDetail("move", input.id));
      return;
    }

    const state = this.#computeState();

    // On first move, set initial distance
    if (this.#initialDistance === null) {
      this.#initialDistance = state.distance;
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
      this._emitGesture(this.#createDetail("end", input.id));
    }

    this.reset();
  }

  /** @inheritdoc */
  protected override _onPointerCancel(input: PointerInput): void {
    if (!this.#pointers.has(input.id)) return;

    // If started, cancel gesture
    if (this.#started) {
      this._emitGesture(this.#createDetail("cancel", input.id));
    }

    this.reset();
  }

  /** @inheritdoc */
  protected override _onAcceptInput(id: number): void {
    if (!this.#pointers.has(id) || this.#accepted.has(id)) return;

    // If tracking pointer and not accepted, accept it
    this.#accepted.add(id);

    // When all accepted, start gesture
    if (this.#accepted.size === this.#pointers.size) {
      this.#started = true;
      this._emitGesture(this.#createDetail("start", id));
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
    this.#started = false;
  }

  /** @private */
  #createDetail(phase: ScaleGesturePhase, id: number): ScaleGestureDetail {
    const p = this.#pointers.get(id)!;
    const state = this.#computeState();

    return {
      id: p.id,
      timestamp: p.timestamp,
      phase: phase,
      gestureType: this.gestureType,
      pointers: this.#pointers.size,
      ...state,
    };
  }

  /** @private */
  #computeState(): { scale: number; distance: number; centerX: number; centerY: number } {
    const inputs = [...this.#pointers.values()];

    // Compute centroid
    let centerX = 0;
    let centerY = 0;
    for (const p of inputs) {
      centerX += p.clientX;
      centerY += p.clientY;
    }
    centerX /= inputs.length;
    centerY /= inputs.length;

    // Compute average distance from centroid
    let total = 0;
    for (const p of inputs) {
      const dx = p.clientX - centerX;
      const dy = p.clientY - centerY;
      total += Math.hypot(dx, dy);
    }

    const distance = total / inputs.length;
    const scale = this.#initialDistance ? distance / this.#initialDistance : 1;

    return { distance, centerX, centerY, scale };
  }
}
