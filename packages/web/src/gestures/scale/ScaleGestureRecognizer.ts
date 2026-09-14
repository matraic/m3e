import { DelegatingGestureRecognizerBase, GestureListener } from "@m3e/web/gestures";

import {
  TransformGestureDetail,
  TransformGestureOptions,
  TransformGestureRecognizer,
} from "@m3e/web/gestures/transform";

import { ScaleGestureDetail } from "./ScaleGestureDetail";
import { DefaultScaleGestureOptions, ScaleGestureOptions } from "./ScaleGestureOptions";

/** A {@link GestureRecognizer} used to detect and interpret scale gestures from incoming input streams. */
export class ScaleGestureRecognizer extends DelegatingGestureRecognizerBase<
  ScaleGestureOptions,
  ScaleGestureDetail,
  TransformGestureOptions,
  TransformGestureDetail,
  TransformGestureRecognizer
> {
  /** @private */ #initialDistance = 0;
  /** @private */ #previousDistance = 0;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<ScaleGestureOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<ScaleGestureDetail>} listener The function invoked when semantic detail is emitted.
   */
  constructor(options?: Partial<ScaleGestureOptions>, listener?: GestureListener<ScaleGestureDetail>) {
    super(options, listener, new TransformGestureRecognizer());
  }

  /** @inheritdoc */
  override get defaultOptions(): ScaleGestureOptions {
    return { ...DefaultScaleGestureOptions };
  }

  /** @inheritdoc */
  protected override _applyOptions(options: ScaleGestureOptions, inner: TransformGestureRecognizer): void {
    inner.options = {
      minDisplacement: options.minDisplacement,
      pointers: options.pointers,
      maxPressInterval: options.maxPressInterval,
    };
  }

  /** @inheritdoc */
  protected override _handleGesture(detail: TransformGestureDetail): void {
    const trackers = this._inner?.trackers;
    if (!trackers || trackers.length < 2) return;

    const centroidX = detail.clientX;
    const centroidY = detail.clientY;

    let sum = 0;
    for (const t of trackers) {
      const p = t.current;
      const dx = p.clientX - centroidX;
      const dy = p.clientY - centroidY;
      sum += Math.hypot(dx, dy);
    }
    const currentDistance = sum / trackers.length;

    // Capture initial distance on gesture start
    if (detail.phase === "start") {
      this.#initialDistance = currentDistance;
      this.#previousDistance = currentDistance;
    }

    const scale = currentDistance / this.#initialDistance;
    const scaleDelta = currentDistance / this.#previousDistance;
    const scaleVelocity = detail.deltaTime > 0 ? scaleDelta / detail.deltaTime : 0;

    this.#previousDistance = currentDistance;

    const scaleDetail: ScaleGestureDetail = {
      inputId: detail.inputId,
      gestureName: "scale",
      phase: detail.phase,
      timestamp: detail.timestamp,
      translationX: detail.totalDeltaX,
      translationY: detail.totalDeltaY,
      velocityX: detail.velocityX,
      velocityY: detail.velocityY,
      directionX: detail.directionX,
      directionY: detail.directionY,
      axis: detail.axis,
      initialDistance: this.#initialDistance,
      currentDistance,
      scale,
      scaleDelta,
      scaleVelocity,
    };

    this._emit(scaleDetail);
  }

  /** @inheritdoc */
  override reset(): void {
    super.reset();
    this.#initialDistance = 0;
    this.#previousDistance = 0;
  }
}
