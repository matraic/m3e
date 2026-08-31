import { GestureDetail } from "./GestureDetail";
import { GestureRecognizer } from "./GestureRecognizer";
import { GestureDetailOf, GestureRecognizerOptions } from "./GestureRecognizerOptions";

/**
 * Creates a gesture recognizer using the provided options.
 * @template TOptions The type of options used to recognize gestures.
 * @param {Partial<TOptions> | undefined} options The options used to configure the gesture recognizer instance.
 * @returns {GestureRecognizer<TDetail, TOptions>} A gesture recognizer configured with the provided options.
 */
export type GestureRecognizerFactory<
  TOptions extends GestureRecognizerOptions<GestureDetailOf<TOptions>> = GestureRecognizerOptions<GestureDetail>,
> = (options?: Partial<TOptions>) => GestureRecognizer<TOptions>;
