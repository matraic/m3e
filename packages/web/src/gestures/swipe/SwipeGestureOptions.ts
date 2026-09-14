import { DefaultGestureOptions, GestureOptions } from "@m3e/web/gestures";

/**
 * Specifies the possible directions of a swipe gesture.
 * - `left` — A swipe with dominant movement toward the negative x‑axis.
 * - `right` — A swipe with dominant movement toward the positive x‑axis.
 * - `up` — A swipe with dominant movement toward the negative y‑axis.
 * - `down` — A swipe with dominant movement toward the positive y‑axis.
 */
export type SwipeGestureDirection = "left" | "right" | "up" | "down";

/** Encapsulates options used to detect and interpret swipe gestures. */
export interface SwipeGestureOptions extends GestureOptions {
  /**
   * Number of pointers required for the gesture to be recognized.
   * @default 1
   */
  readonly pointers: number;

  /**
   * Minimum distance (px) a pointer must move before the gesture starts.
   * @default 4
   */
  readonly startThreshold: number;
  /**
   * Minimum velocity (px/ms) required to recognize a swipe.
   * @default 0.3
   */
  readonly minVelocity: number;

  /**
   * The allowed directions of the swipe.
   * @default ["left", "right", "up", "down"]
   */
  readonly directions: readonly SwipeGestureDirection[];

  /**
   * Minimum displacement (px) required before a direction is considered valid.
   * @default 12
   */
  readonly directionThreshold: number;

  /**
   * Maximum amount of time (ms) a pointer can move in an uncommitted or
   * disallowed direction before the gesture is rejected. When set to 0,
   * early‑direction rejection is disabled.
   * @default 0
   */
  readonly directionGracePeriod: number;

  /**
   * Minimum distance (px) a pointer must move before the gesture can be recognized.
   * @default 24
   */
  readonly minDisplacement: number;

  /**
   * Maximum allowed time (ms) between the earliest and latest press.
   * @default 120
   */
  readonly maxPressInterval: number;
}

/** Defines the default options used to detect and interpret swipe gestures. */
export const DefaultSwipeGestureOptions: SwipeGestureOptions = {
  ...DefaultGestureOptions,
  pointers: 1,
  startThreshold: 4,
  minVelocity: 0.3,
  directions: ["left", "right", "up", "down"],
  directionThreshold: 12,
  directionGracePeriod: 0,
  minDisplacement: 24,
  maxPressInterval: 120,
};
