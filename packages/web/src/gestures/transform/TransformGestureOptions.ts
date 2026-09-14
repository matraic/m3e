import { DefaultGestureOptions, GestureOptions } from "@m3e/web/gestures";

/**
 * Specifies the possible modes in which to active a low-level transform gesture.
 * - `"press"` — Pointer must be pressed to activate the gesture.
 * - `"move"` — Pointer must be moved to activate the gesture.
 */
export type TransformGestureActivationMode = "press" | "move";

/** Specifies the axes to which a low-level transform gesture can lock. */
export type TransformGestureLockAxis = "x" | "y" | "auto" | "none";

/** Encapsulates options used to detect and interpret low-level transform gestures. */
export interface TransformGestureOptions extends GestureOptions {
  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 1
   */
  readonly pointers: number;

  /**
   * Mode in which to activate the gesture.
   * @default "press"
   */
  readonly activationMode: TransformGestureActivationMode;

  /**
   * Minimum distance (px) a pointer must move before the gesture starts.
   * @default 4
   */
  readonly minDisplacement: number;

  /**
   * The axis to which movement is locked.
   * @default "none"
   */
  readonly lockAxis: TransformGestureLockAxis;

  /**
   * Minimum total displacement (px) required before axis locking resolves.
   * @default 8
   */
  readonly axisThreshold: number;

  /**
   * Minimum incremental movement (px) on the secondary axis required before emitting detail for a locked axis.
   * @default 0
   */
  readonly deltaThreshold: number;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  readonly maxPressInterval: number;
}

/** Defines the default options used to detect and interpret low-level transform gestures. */
export const DefaultTransformGestureOptions: TransformGestureOptions = {
  ...DefaultGestureOptions,
  activationMode: "press",
  minDisplacement: 4,
  lockAxis: "none",
  axisThreshold: 8,
  deltaThreshold: 0,
  pointers: 1,
  maxPressInterval: 120,
} as const;
