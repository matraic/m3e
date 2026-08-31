import { GestureCallback } from "./GestureCallback";
import { GestureDetail } from "./GestureDetail";
import { GestureInputClaimant } from "./GestureInputClaimant";
import { GestureInputSink } from "./GestureInputSink";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";

/**
 * Defines functionality required to recognize gestures.
 *
 * A gesture recognizer:
 * - receives input through {@link GestureInputSink},
 * - makes claims on input through {@link GestureInputClaimant},
 * - and emits recognized gesture details.
 *
 * @template TOptions The type of options used to recognize gestures.
 * @template TDetail The type of detail emitted for a recognized gesture.
 */
export interface GestureRecognizer<
  TOptions extends GestureRecognizerOptions = GestureRecognizerOptions,
  TDetail extends GestureDetail = GestureDetail,
>
  extends GestureInputSink, GestureInputClaimant {
  /** Options used to recognize gestures. */
  readonly options: TOptions;

  /** Callback invoked when a gesture is recognized. */
  onGesture?: GestureCallback<TDetail>;

  /**
   * Updates options used to recognize gestures.
   * @param {Partial<TOptions>} options Options used to recognize gestures.
   */
  updateOptions(options: Partial<TOptions>): void;

  /** Returns the recognizer to its initial state. */
  reset(): void;
}
