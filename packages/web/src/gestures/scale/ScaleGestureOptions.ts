import { DefaultGestureOptions, GestureOptions } from "@m3e/web/gestures";

/** Encapsulates options used to detect and interpret scale gestures. */
export interface ScaleGestureOptions extends GestureOptions {
  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 2
   */
  readonly pointers: number;

  /**
   * Minimum distance (px) a pointer must move before the gesture starts.
   * @default 4
   */
  readonly minDisplacement: number;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  readonly maxPressInterval: number;
}

/** Defines the default options used to detect and interpret scale gestures. */
export const DefaultScaleGestureOptions: ScaleGestureOptions = {
  ...DefaultGestureOptions,
  minDisplacement: 4,
  pointers: 2,
  maxPressInterval: 120,
} as const;
