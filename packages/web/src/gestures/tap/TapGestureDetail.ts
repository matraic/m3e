import { GestureDetail } from "@m3e/web/gestures";

/** Describes the semantic output of a tap gesture. */
export interface TapGestureDetail extends GestureDetail {
  /** Viewport x-coordinate where the tap began. */
  readonly clientX: number;

  /** Viewport y-coordinate where the tap began. */
  readonly clientY: number;

  /** Element-relative x-coordinate where the tap began. */
  readonly localX: number;

  /** Element-relative y-coordinate where the tap began. */
  readonly localY: number;

  /** Total duration (ms) of the gesture. */
  readonly duration: number;
}
