import { GestureDetail } from "@m3e/web/gestures";

/**
 * Describes the semantic output of a repeated gesture.
 * @template TDetail - The detail type produced by each repeated occurrence.
 */
export interface RepeatGestureDetail<TDetail extends GestureDetail = GestureDetail> extends GestureDetail {
  /** Ordered list of gesture occurrences that form the repeated gesture. */
  readonly details: readonly TDetail[];
}
