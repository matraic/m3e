import { DelegatingGestureRecognizerBase, GestureListener } from "@m3e/web/gestures";

import {
  DefaultTransformGestureOptions,
  TransformGestureDetail,
  TransformGestureOptions,
  TransformGestureRecognizer,
} from "@m3e/web/gestures/transform";

import { PanGestureDetail } from "./PanGestureDetail";

/** A {@link GestureRecognizer} used to detect and interpret pan gestures from incoming input streams. */
export class PanGestureRecognizer extends DelegatingGestureRecognizerBase<
  TransformGestureOptions,
  PanGestureDetail,
  TransformGestureOptions,
  TransformGestureDetail,
  TransformGestureRecognizer
> {
  /**
   * Initializes a new instance of this class.
   * @param {Partial<TransformGestureOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<PanGestureDetail>} listener The function invoked when semantic detail is emitted.
   */
  constructor(options?: Partial<TransformGestureOptions>, listener?: GestureListener<PanGestureDetail>) {
    super(options, listener, new TransformGestureRecognizer(options));
  }

  /** @inheritdoc */
  override get defaultOptions(): TransformGestureOptions {
    return { ...DefaultTransformGestureOptions };
  }

  /** @inheritdoc */
  protected override _applyOptions(options: TransformGestureOptions, inner: TransformGestureRecognizer): void {
    inner.options = options;
  }

  /** @inheritdoc */
  protected override _handleGesture(detail: TransformGestureDetail): void {
    this._emit({
      inputId: detail.inputId,
      gestureName: "pan",
      phase: detail.phase,
      timestamp: detail.timestamp,
      startClientX: detail.startClientX,
      startClientY: detail.startClientY,
      startLocalX: detail.startLocalX,
      startLocalY: detail.startLocalY,
      translationX: detail.totalDeltaX,
      translationY: detail.totalDeltaY,
      velocityX: detail.velocityX,
      velocityY: detail.velocityY,
      directionX: detail.directionX,
      directionY: detail.directionY,
      axis: detail.axis,
    });
  }
}
