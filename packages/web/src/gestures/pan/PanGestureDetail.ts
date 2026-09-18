import { GestureDetail } from "@m3e/web/gestures";

/** Describes the semantic output of a pan gesture. */
export interface PanGestureDetail extends GestureDetail {
  /** Horizontal viewport coordinate of the initial input sample. */
  readonly startClientX: number;

  /** Vertical viewport coordinate of the initial input sample. */
  readonly startClientY: number;

  /** Element-relative horizontal coordinate of the initial input sample. */
  readonly startLocalX: number;

  /** Element-relative vertical coordinate of the initial input sample. */
  readonly startLocalY: number;

  /** Horizontal translation (px) from the initial position. */
  readonly translationX: number;

  /** Vertical translation (px) from the initial position. */
  readonly translationY: number;

  /** Instantaneous horizontal velocity (px/ms). */
  readonly velocityX: number;

  /** Instantaneous vertical velocity (px/ms). */
  readonly velocityY: number;

  /** Horizontal movement direction (-1, 0, or 1). */
  readonly directionX: number;

  /** Vertical movement direction (-1, 0, or 1). */
  readonly directionY: number;

  /** Dominant axis of movement. */
  readonly axis: "x" | "y";
}
