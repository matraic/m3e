import { GestureDetail } from "./GestureDetail";
import { GestureInputButton } from "./GestureInputButton";
import { GestureInputClaimant } from "./GestureInputClaimant";
import { GestureInputSink } from "./GestureInputSink";

/**
 * Function signature for gesture callbacks.
 * @template TDetail The type of detail emitted for the gesture.
 */
export type GestureCallback<TDetail extends GestureDetail = GestureDetail> = (detail: TDetail) => void;

/**
 * Defines functionality required to recognize gestures.
 *
 * A gesture recognizer:
 * - receives input through {@link GestureInputSink},
 * - makes claims on input through {@link GestureInputClaimant},
 * - and emits recognized gesture details.
 *
 * @template TDetail The type of detail emitted when a gesture is recognized.
 */
export interface GestureRecognizer<TDetail extends GestureDetail = GestureDetail>
  extends GestureInputSink, GestureInputClaimant {
  /** Whether gesture recognition is disabled. */
  disabled: boolean;

  /** Which buttons can be pressed. */
  allowedButtons: readonly GestureInputButton[];

  /** Callback invoked when a gesture is recognized. */
  onGesture?: GestureCallback<TDetail>;

  /** Returns the recognizer to its initial state. */
  reset(): void;
}
