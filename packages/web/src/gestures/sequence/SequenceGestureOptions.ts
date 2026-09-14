import { DefaultGestureOptions, GestureOptions } from "@m3e/web/gestures";

/** Encapsulates options used to detect and interpret a sequence of gestures. */
export interface SequenceGestureOptions extends GestureOptions {
  /**
   * Maximum allowed time (ms) between each gesture in the sequence.
   * @default 250
   */
  readonly maxInterval: number;
}

/** Defines the default options used to detect and interpret a sequence of gestures. */
export const DefaultSequenceGestureOptions: SequenceGestureOptions = {
  ...DefaultGestureOptions,
  maxInterval: 250,
} as const;
