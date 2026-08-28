import { GestureInput } from "./GestureInput";

/** Defines functionality required to receive input. */
export interface GestureInputSink {
  /** Receives the specified input.
   * @param {GestureInput} input The input to receive.
   */
  onInput(input: GestureInput): void;
}
