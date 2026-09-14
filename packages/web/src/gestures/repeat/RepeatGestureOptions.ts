import { DefaultGestureOptions, GestureOptions } from "@m3e/web/gestures";

/** Encapsulates options used to detect and interpret repeated gestures. */
export interface RepeatGestureOptions extends GestureOptions {
  /**
   * Maximum allowed time (ms) between consecutive gesture occurrences.
   * @default 250
   */
  readonly maxInterval: number;

  /**
   * Number of times a gesture must be repeated.
   * @default 2
   */
  readonly count: number;
}

/** Defines the default options used to detect and interpret repeated gestures. */
export const DefaultRepeatGestureOptions: RepeatGestureOptions = {
  ...DefaultGestureOptions,
  maxInterval: 250,
  count: 2,
} as const;
