import { GestureDetail } from "@m3e/web/gestures";

import { SwipeGestureDirection } from "./SwipeGestureOptions";

/** Describes the semantic output of a swipe gesture. */
export interface SwipeGestureDetail extends GestureDetail {
  /** Resolved swipe direction. */
  readonly direction: SwipeGestureDirection;

  /** Dominant axis of movement. */
  readonly axis: "x" | "y";

  /** Total horizontal movement (px). */
  readonly translationX: number;

  /** Total vertical movement (px). */
  readonly translationY: number;

  /** Instantaneous horizontal velocity (px/ms). */
  readonly velocityX: number;

  /** Instantaneous vertical velocity (px/ms). */
  readonly velocityY: number;

  /** Velocity magnitude (px/ms). */
  readonly speed: number;

  /** Total displacement (px). */
  readonly displacement: number;

  /** Total duration (ms). */
  readonly duration: number;
}
