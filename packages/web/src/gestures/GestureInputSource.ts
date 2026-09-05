import { GestureInput } from "./GestureInput";

/**
 * Defines functionality for a source from which input is produced to recognize a gesture.
 * @internal
 */
export interface GestureInputSource {
  /** Callback invoked when input is emitted from this source. */
  onInput?: (input: GestureInput) => void;

  /** Destroys the input source. */
  destroy(): void;
}
