import { GestureInput } from "./GestureInput";

/** A wheel input sample used to recognize gestures. */
export interface WheelInput extends GestureInput {
  /** The horizontal scroll amount. */
  readonly deltaX: number;

  /** The vertical scroll amount. */
  readonly deltaY: number;

  /** The scroll amount for the z-axis. */
  readonly deltaZ: number;

  /** The unit of the delta* values' scroll amount. */
  readonly deltaMode: number;
}
