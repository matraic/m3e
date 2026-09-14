import { DefaultGestureOptions, GestureOptions } from "@m3e/web/gestures";
import { TransformGestureActivationMode } from "@m3e/web/gestures/transform";

/** Encapsulates options used to detect and interpret rotate gestures. */
export interface RotateGestureOptions extends GestureOptions {
  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 2
   */
  readonly pointers: number;

  /**
   * Mode in which to activate the gesture.
   * @default "press"
   */
  readonly activationMode: TransformGestureActivationMode;

  /**
   * Minimum centroid displacement (px) before rotation starts.
   * @default 4
   */
  readonly minDisplacement: number;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  readonly maxPressInterval: number;
}

/** Defines the default options used to detect and interpret rotate gestures. */
export const DefaultRotateGestureOptions: RotateGestureOptions = {
  ...DefaultGestureOptions,
  activationMode: "press",
  minDisplacement: 4,
  pointers: 2,
  maxPressInterval: 120,
} as const;
