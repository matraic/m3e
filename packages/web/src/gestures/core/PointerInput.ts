import { GestureInput } from "./GestureInput";

/** A pointer input sample used to recognize gestures. */
export interface PointerInput extends GestureInput {
  /** Type of the pointer (mouse, pen, or touch). */
  readonly pointerType: string;

  /** Horizontal coordinate in viewport space where the input occurred. */
  readonly clientX: number;

  /** Vertical coordinate in viewport space where the input occurred. */
  readonly clientY: number;
}
