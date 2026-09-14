import { GestureDetail } from "@m3e/web/gestures";

/** Describes the semantic output for a sequence of gestures. */
export interface SequenceGestureDetail extends GestureDetail {
  /** Ordered list of gesture occurrences that form the sequence of gestures. */
  readonly details: readonly GestureDetail[];
}
