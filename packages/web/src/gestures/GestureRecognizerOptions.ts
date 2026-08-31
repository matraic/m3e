import { GestureInputButton } from "./GestureInputButton";
import { GestureInputClaimantOptions } from "./GestureInputClaimantOptions";
import { PointerType } from "./PointerInput";

/** Encapsulates options used to recognize gestures. */
export interface GestureRecognizerOptions extends GestureInputClaimantOptions {
  /**
   * Whether gesture recognition is disabled.
   * @default false
   */
  readonly disabled: boolean;

  /**
   * Which buttons can be pressed.
   * @default ["primary"]
   */
  readonly buttons: readonly GestureInputButton[];

  /**
   * Which types of pointers can be used to recognize gestures.
   * @default ["mouse", "pen", "touch"]
   */
  readonly pointerTypes: readonly PointerType[];
}
