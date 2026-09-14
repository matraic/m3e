import { GestureDetail } from "@m3e/web/gestures";

/** Describes the semantic output of a long-press gesture. */
export interface LongPressGestureDetail extends GestureDetail {
  /** Viewport x-coordinate where the long-press began. */
  readonly clientX: number;

  /** Viewport y-coordinate where the long-press began. */
  readonly clientY: number;

  /** Element-relative x-coordinate where the long-press began. */
  readonly localX: number;

  /** Element-relative y-coordinate where the long-press began. */
  readonly localY: number;

  /** Total duration (ms) of the gesture. */
  readonly duration: number;
}
