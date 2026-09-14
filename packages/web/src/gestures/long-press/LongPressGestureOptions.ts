import { DefaultGestureOptions, GestureOptions } from "@m3e/web/gestures";

/** Encapsulates options used to detect and interpret long-press gestures. */
export interface LongPressGestureOptions extends GestureOptions {
  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 1
   */
  readonly pointers: number;

  /**
   * Maximum allowed movement (px).
   * @default 4
   */
  readonly maxDisplacement: number;

  /**
   * Minimum time (ms) a pointer must remain pressed.
   * @default 500
   */
  readonly minDuration: number;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  readonly maxPressInterval: number;
}

/** Defines the default options used to detect and interpret long-press gestures. */
export const DefaultLongPressGestureOptions: LongPressGestureOptions = {
  ...DefaultGestureOptions,
  pointers: 1,
  minDuration: 500,
  maxDisplacement: 4,
  maxPressInterval: 120,
} as const;
