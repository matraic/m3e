import { GestureInput } from "./GestureInput";

/** Defines functionality required to receive input. */
export interface GestureInputSink {
  /**
   * Whether the sink can receive the specified input.
   * @param {GestureInput} input The input to test.
   * @returns {boolean} `true` if `input` can be received; otherwise, `false`.
   */
  canReceiveInput(input: GestureInput): boolean;

  /** Receives the specified input.
   * @param {GestureInput} input The input to receive.
   */
  onInput(input: GestureInput): void;
}
