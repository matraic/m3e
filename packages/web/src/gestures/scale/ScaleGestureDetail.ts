import { PanGestureDetail } from "@m3e/web/gestures/pan";

/** Describes the semantic output of a scale gesture. */
export interface ScaleGestureDetail extends PanGestureDetail {
  /** Average distance (px) from each active pointer to the centroid at the moment the gesture activated. */
  readonly initialDistance: number;

  /** Average distance (px) from each active pointer to the centroid for the most recent input sample. */
  readonly currentDistance: number;

  /** Scale factor representing total zoom since activation. */
  readonly scale: number;

  /** Incremental scale change between the last two samples. */
  readonly scaleDelta: number;

  /** Instantaneous scale velocity (units/ms). */
  readonly scaleVelocity: number;
}
