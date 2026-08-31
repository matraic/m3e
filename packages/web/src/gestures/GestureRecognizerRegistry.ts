import { GestureDetail } from "./GestureDetail";
import { GestureRecognizer } from "./GestureRecognizer";
import { GestureRecognizerFactory } from "./GestureRecognizerFactory";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";

class GestureRecognizerRegistry {
  static readonly #factories = new Map<string, GestureRecognizerFactory>();

  static addFactory(gestureType: string, factory: GestureRecognizerFactory): void {
    if (window !== undefined) {
      this.#factories.set(gestureType, factory);
    }
  }

  static getFactory(gestureType: string): GestureRecognizerFactory | undefined {
    return window !== undefined ? this.#factories.get(gestureType) : undefined;
  }
}

/**
 * Registers a recognizer for the specified type of gesture.
 * @template TOptions The type of options used to recognize gestures.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @param {string} gestureType The type of gesture for which to recognize.
 * @param {GestureRecognizerFactory<TOptions, TDetail>} factory The factory used to create recognizers for the given gesture type.
 */
export function registerGestureRecognizer<TOptions extends GestureRecognizerOptions, TDetail extends GestureDetail>(
  gestureType: string,
  factory: GestureRecognizerFactory<TOptions, TDetail>,
): void {
  GestureRecognizerRegistry.addFactory(gestureType, <GestureRecognizerFactory>factory);
}

/**
 * Creates a recognizer for the specified type of gesture.
 * @template TOptions The type of options used to recognize gestures.
 * @template TDetail The type of detail emitted for a recognized gesture.
 * @param {string} gestureType The type of gesture for which to create a recognizer.
 * @param {Partial<TOptions> | undefined} options Options that control gesture recognition.
 * @returns {GestureRecognizer<TOptions, TDetail>} A recognizer for the specified gesture type or `null` if a recognizer could not be created.
 */
export function createGestureRecognizer<TOptions extends GestureRecognizerOptions, TDetail extends GestureDetail>(
  gestureType: string,
  options?: Partial<TOptions>,
): GestureRecognizer<TOptions, TDetail> | null {
  const factory = GestureRecognizerRegistry.getFactory(gestureType) as
    | GestureRecognizerFactory<TOptions, TDetail>
    | undefined;
  return factory?.(options) ?? null;
}
