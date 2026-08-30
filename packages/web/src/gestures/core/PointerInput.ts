import { GestureInput } from "./GestureInput";

/**
 * Specifies the possible types of pointers.
 * - `"mouse"` — A mouse or any device emulating mouse input.
 * - `"pen"`   — A stylus or digital pen device.
 * - `"touch"` — A finger or multi-touch contact on a touchscreen.
 */
export type PointerType = "mouse" | "pen" | "touch";

/** A pointer input sample used to recognize gestures. */
export interface PointerInput extends GestureInput {
  /** Type of the pointer. */
  readonly pointerType: PointerType;

  /** Horizontal coordinate in viewport space where the input occurred. */
  readonly clientX: number;

  /** Vertical coordinate in viewport space where the input occurred. */
  readonly clientY: number;
}
