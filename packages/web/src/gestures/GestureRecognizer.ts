import { GestureCallback } from "./GestureCallback";
import { GestureDetail } from "./GestureDetail";
import { GestureInput } from "./GestureInput";
import { GestureInputDisposition } from "./GestureInputDisposition";
import { GestureInputResolution } from "./GestureInputResolution";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";
import { PointerInput } from "./PointerInput";

/**
 * Defines functionality required to recognize gestures.
 * @template TOptions The type of options used to recognize gestures.
 * @template TDetail The type of detail emitted for a recognized gesture.
 */
export interface GestureRecognizer<
  TOptions extends GestureRecognizerOptions = GestureRecognizerOptions,
  TDetail extends GestureDetail = GestureDetail,
> {
  /** The type of gesture produced from input. */
  readonly gestureType: string;

  /** Whether dispositions should resolve immediately. */
  readonly eager: boolean;

  /** Options used to recognize gestures. */
  readonly options: TOptions;

  /**
   * Whether the recognizer can receive the specified input.
   * @param {GestureInput} input The input to test.
   * @returns {boolean} `true` if `input` can be received; otherwise, `false`.
   */
  canReceiveInput(input: GestureInput): boolean;

  /** Receives the specified input.
   * @param {GestureInput} input The input to receive.
   */
  onInput(input: GestureInput): void;

  /**
   * Callback invoked when a disposition is made against input.
   * @param {number} id The identifier of the input for which a disposition is made.
   * @param {GestureDisposition} disposition The disposition for the input.
   */
  onDisposition?: (id: number, disposition: GestureInputDisposition) => void;

  /**
   * Receives resolution for a prior disposition against input.
   * @param {number} id The identifier of the input being resolved.
   * @param {GestureResolution} resolution The resolution for the input.
   */
  onResolution(id: number, resolution: GestureInputResolution): void;

  /**
   * Whether to capture the specified pointer.
   * @param {PointerInput} input The pointer input to test whether to its pointer should be captured.
   * @returns {boolean} Whether the pointer for `input` should be captured.
   */
  shouldCapturePointer(input: PointerInput): boolean;

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
