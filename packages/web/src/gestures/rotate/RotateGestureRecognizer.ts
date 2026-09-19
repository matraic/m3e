import { DelegatingGestureRecognizerBase, GestureListener } from "@m3e/web/gestures";

import { PanGestureDetail, PanGestureOptions, PanGestureRecognizer } from "@m3e/web/gestures/pan";

import { RotateGestureDetail } from "./RotateGestureDetail";
import { DefaultRotateGestureOptions, RotateGestureOptions } from "./RotateGestureOptions";

/** A {@link GestureRecognizer} used to detect and interpret rotate gestures from incoming input streams. */
export class RotateGestureRecognizer extends DelegatingGestureRecognizerBase<
  RotateGestureOptions,
  RotateGestureDetail,
  PanGestureOptions,
  PanGestureDetail,
  PanGestureRecognizer
> {
  /** @private */ #initialAngle = 0;
  /** @private */ #previousAngle = 0;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<RotateGestureOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<RotateGestureDetail>} listener The function invoked when semantic detail is emitted.
   */
  constructor(options?: Partial<RotateGestureOptions>, listener?: GestureListener<RotateGestureDetail>) {
    super(options, listener, new PanGestureRecognizer());
  }

  /** @inheritdoc */
  override get defaultOptions(): RotateGestureOptions {
    return { ...DefaultRotateGestureOptions };
  }

  /** @inheritdoc */
  protected override _applyOptions(options: RotateGestureOptions, inner: PanGestureRecognizer): void {
    inner.options = {
      activationMode: options.activationMode,
      minDisplacement: options.minDisplacement,
      pointers: options.pointers,
      maxPressInterval: options.maxPressInterval,
    };
  }

  /** @inheritdoc */
  protected override _handleGesture(detail: PanGestureDetail): void {
    const trackers = this._inner?.trackers;
    if (!trackers || trackers.length < 2) return;

    const centroidX = detail.clientX;
    const centroidY = detail.clientY;

    let sum = 0;
    for (const t of trackers) {
      const p = t.current;
      const dx = p.clientX - centroidX;
      const dy = p.clientY - centroidY;
      sum += Math.atan2(dy, dx);
    }

    const currentAngle = sum / trackers.length;

    if (detail.phase === "start") {
      this.#initialAngle = currentAngle;
      this.#previousAngle = currentAngle;
    }

    const rotation = currentAngle - this.#initialAngle;
    const rotationDelta = currentAngle - this.#previousAngle;
    const rotationVelocity = detail.deltaTime > 0 ? rotationDelta / detail.deltaTime : 0;

    this.#previousAngle = currentAngle;

    const rotateDetail: RotateGestureDetail = {
      gestureName: "rotate",
      phase: detail.phase,
      inputId: detail.inputId,
      timestamp: detail.timestamp,
      initialAngle: this.#initialAngle,
      currentAngle,
      rotation,
      rotationDelta,
      rotationVelocity,
    };

    this._emit(rotateDetail);
  }

  /** @inheritdoc */
  override reset(): void {
    super.reset();
    this.#initialAngle = 0;
    this.#previousAngle = 0;
  }
}
