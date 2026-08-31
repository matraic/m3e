import { GestureDetail } from "./GestureDetail";
import { GestureRecognizer } from "./GestureRecognizer";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";

/**
 * Creates a gesture recognizer using the provided options.
 * @template TOptions The type of options used to recognize gestures.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @param {Partial<TOptions> | undefined} options The options used to configure the gesture recognizer instance.
 * @returns {GestureRecognizer<TOptions, TDetail>} A gesture recognizer configured with the provided options.
 */
export type GestureRecognizerFactory<
  TOptions extends GestureRecognizerOptions = GestureRecognizerOptions,
  TDetail extends GestureDetail = GestureDetail,
> = (options?: Partial<TOptions>) => GestureRecognizer<TOptions, TDetail>;
