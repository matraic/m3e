import { GestureInput } from "./GestureInput";
import { GestureInputButton } from "./GestureInputButton";
import { PointerType } from "./PointerInput";

/** Encapsulates options used to recognize gestures. */
export interface GestureRecognizerOptions {
  /**
   * Whether gesture recognition is disabled.
   * @default false
   */
  readonly disabled: boolean;

  /**
   * The priority in which dispositions should resolve.
   * @default 1
   */
  readonly priority: number;

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

  /**
   * Optional predicate used to determine whether a recognizer should receive a given input.
   * @param {GestureInput} input The input to evaluate.
   * @returns {boolean} `true` if the recognizer should process the input; otherwise, `false`.
   */
  readonly inputFilter?: (input: GestureInput) => boolean;
}
