import { GestureInput, PointerType } from "./GestureInput";

/** Specifies buttons which can be pressed during input. */
export type GestureInputButton = "primary" | "secondary" | "middle" | "back" | "forward";

/**
 * Function used to determine whether input can be used to recognize gestures.
 * @param {GestureInput} input The input to evaluate.
 * @returns `true` if `input` can be used to recognize gestures; otherwise, `false`.
 */
export type GestureInputFilter = (input: GestureInput) => boolean;

/** Encapsulates options used to detect and interpret gestures. */
export interface GestureOptions {
  /**
   * The priority in which to recognize gestures.
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

  /** Optional predicate used to determine whether input can be used to recognize gestures. */
  readonly inputFilter?: GestureInputFilter;
}

/** Defines the default options used to detect and interpret gestures. */
export const DefaultGestureOptions: GestureOptions = {
  priority: 1,
  buttons: ["primary"],
  pointerTypes: ["mouse", "pen", "touch"],
} as const;
