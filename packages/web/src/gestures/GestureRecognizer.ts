import { GestureDetail } from "./GestureDetail";
import { GestureInputClaimant } from "./GestureInputClaimant";
import { GestureInputSink } from "./GestureInputSink";
import { GestureDetailOf, GestureRecognizerOptions } from "./GestureRecognizerOptions";

/**
 * Defines functionality required to recognize gestures.
 *
 * A gesture recognizer:
 * - receives input through {@link GestureInputSink},
 * - makes claims on input through {@link GestureInputClaimant},
 * - and emits recognized gesture details.
 *
 * @template TOptions The type of options used to recognize gestures.
 */
export interface GestureRecognizer<
  TOptions extends GestureRecognizerOptions<GestureDetailOf<TOptions>> = GestureRecognizerOptions<GestureDetail>,
>
  extends GestureInputSink, GestureInputClaimant {
  /** Options used to recognize gestures. */
  readonly options: TOptions;

  /**
   * Updates options used to recognize gestures.
   * @param {Partial<TOptions>} options Options used to recognize gestures.
   */
  updateOptions(options: Partial<TOptions>): void;

  /** Returns the recognizer to its initial state. */
  reset(): void;
}
